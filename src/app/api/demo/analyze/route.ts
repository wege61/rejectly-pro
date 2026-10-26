import { openai, AI_MODEL } from "@/lib/ai/client";
import rateLimit from "@/lib/rate-limit";
import { isValidJobDescription } from "@/lib/ai/validator";

const limiter = rateLimit({
  name: "demo-analyze",
  interval: 60 * 60 * 1000, // 1 hour
  uniqueTokenPerInterval: 500,
});

/*
 * The demo is free and needs no account, so it gets two cost guards on top of
 * the per-IP limit: a size cap (a normal resume is 3-5k characters; without a
 * cap one request could cost ~60x a normal one) and a site-wide daily budget,
 * so a bot rotating IPs can't run up the OpenAI bill. A demo costs about half
 * a cent, so the default cap is roughly $10 a day.
 */
const MAX_CHARS = 12_000;
const DAILY_LIMIT = Number(process.env.DEMO_DAILY_LIMIT) || 2000;
const dailyBudget = rateLimit({
  name: "demo-analyze-daily",
  interval: 24 * 60 * 60 * 1000,
  uniqueTokenPerInterval: 1,
});

export async function POST(request: Request) {
  try {
    const { cvText, jobText } = await request.json();

    if (typeof cvText !== "string" || typeof jobText !== "string" || !cvText.trim() || !jobText.trim()) {
      return Response.json(
        { error: "CV and job description required" },
        { status: 400 }
      );
    }

    if (cvText.length > MAX_CHARS || jobText.length > MAX_CHARS) {
      return Response.json(
        { error: "That's longer than the free demo can check. Please shorten the resume or job post to about 12,000 characters." },
        { status: 413 }
      );
    }

    // Rate limiting: max 5 requests per hour per IP
    try {
      const ip = request.headers.get("x-forwarded-for") || "127.0.0.1";
      await limiter.check(5, ip);
    } catch {
      return Response.json(
        { error: "Rate limit exceeded. Please try again later or sign up for unlimited analysis." },
        { status: 429 }
      );
    }

    try {
      await dailyBudget.check(DAILY_LIMIT, "all");
    } catch {
      console.warn("[demo-analyze] Daily budget reached");
      return Response.json(
        { error: "The free demo is very busy today. Create a free account to keep going." },
        { status: 429 }
      );
    }

    // Validate the job description text using AI
    const isValid = await isValidJobDescription(jobText);

    if (!isValid) {
      return Response.json(
        { error: "The provided text doesn't look like a valid job description. Please provide a real job posting." },
        { status: 400 }
      );
    }

    // Enhanced prompt for full analysis
    const prompt = `You are an expert CV analyzer. Analyze the following CV against the job description.

CV:
${cvText}

JOB DESCRIPTION:
${jobText}

Provide a comprehensive analysis:

1. **Match Score** (0-100): Current compatibility score - be realistic and critical
2. **Summary** (2-3 sentences): Brief explanation of the match
3. **Missing Keywords** (2-8 items): Requirements from the job description that the CV does not state in the job's words. Each item is a short skill or requirement name of 1-4 words, using the job description's own wording (e.g. "A/B testing", "data visualization"). Only list real requirements from the job description; never generic items like "real-world experience" or "more details".
4. **Improvement Tips** (8-10 items): Specific, actionable advice to improve the match score. Each tip should be 1-2 sentences.
5. **Potential Score** (0-100): Estimated score if all improvements are made
6. **Quick Wins** (3 items): The top 3 easiest improvements that would have biggest impact. Never tell the candidate to add a skill, tool or experience the CV doesn't show; for those, say "if you have done X, add it".
7. **Job Title** (string): The role title from the job description, as written (e.g. "Junior Data Analyst")
8. **Matched Keywords** (1-8 items): Requirements from the job description that the CV already states, as short names of 1-4 words in the job's wording. A requirement is either matched or missing, never both.
9. **Missing Details**: For each item in Missing Keywords, decide whether the CV already describes the same thing in different words.
   - Look for the same activity described in student or everyday language (e.g. "made charts" describes data visualization, "predicting churn" describes predictive modeling).
   - If it does, set "foundAs" to a short phrase (max 8 words) copied EXACTLY, character for character, from the CV.
   - If it does not, set "foundAs" to null. Never imply the candidate has a skill the CV doesn't show.

Respond in JSON format:
{
  "fitScore": <number>,
  "summary": "<string>",
  "missingKeywords": ["<string>", ...],
  "improvementTips": ["<string>", ...],
  "potentialScore": <number>,
  "quickWins": ["<string>", "<string>", "<string>"],
  "jobTitle": "<string>",
  "matchedKeywords": ["<string>", ...],
  "missingDetails": [{ "keyword": "<string>", "foundAs": "<exact phrase from the CV>" | null }, ...]
}

Be realistic with scores. Most CVs should score 40-70. Only give 80+ if truly excellent match.`;

    const completion = await openai.chat.completions.create({
      model: AI_MODEL,
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
      response_format: { type: "json_object" },
    });

    const result = JSON.parse(completion.choices[0].message.content || "{}");
    const missingKeywords: string[] = Array.isArray(result.missingKeywords) ? result.missingKeywords : [];

    // "foundAs" claims the candidate already did this. Only keep it when the quote really
    // appears in the CV, so the UI never tells someone they have experience they don't.
    const normalize = (t: string) => t.toLowerCase().replace(/\s+/g, " ").trim();
    const cvNormalized = normalize(String(cvText));
    const details: { keyword?: unknown; foundAs?: unknown }[] = Array.isArray(result.missingDetails) ? result.missingDetails : [];
    const missingDetails = missingKeywords.map((keyword) => {
      const match = details.find((d) => typeof d?.keyword === "string" && normalize(d.keyword) === normalize(keyword));
      const quote = typeof match?.foundAs === "string" ? match.foundAs.trim() : "";
      return { keyword, foundAs: quote && cvNormalized.includes(normalize(quote)) ? quote : null };
    });

    // A matched requirement must use the job post's own words and can't also be missing.
    // The model sometimes lists the CV's phrasing ("predicting churn") as a match, which
    // would contradict the missing item it describes.
    const jobNormalized = normalize(String(jobText));
    const missingSet = new Set(missingKeywords.map(normalize));
    const quoteSet = new Set(missingDetails.flatMap((d) => (d.foundAs ? [normalize(d.foundAs)] : [])));
    const matchedKeywords = (Array.isArray(result.matchedKeywords) ? result.matchedKeywords : [])
      .filter((k: unknown): k is string => typeof k === "string" && k.trim().length > 0)
      .filter((k: string) => {
        const n = normalize(k);
        return jobNormalized.includes(n) && !missingSet.has(n) && !quoteSet.has(n);
      });

    return Response.json({
      success: true,
      fitScore: result.fitScore || 50,
      summary: result.summary || "Analysis completed.",
      missingKeywords,
      improvementTips: result.improvementTips || [],
      potentialScore: result.potentialScore || 70,
      quickWins: result.quickWins || [],
      jobTitle: typeof result.jobTitle === "string" ? result.jobTitle : "",
      matchedKeywords,
      missingDetails,
    });
  } catch (error) {
    console.error("Analysis error:", error);
    return Response.json(
      { error: "Failed to analyze" },
      { status: 500 }
    );
  }
}