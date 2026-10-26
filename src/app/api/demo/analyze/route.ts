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
3. **Missing Keywords** (5-8 items): Key skills/requirements from job that are missing in CV
4. **Improvement Tips** (8-10 items): Specific, actionable advice to improve the match score. Each tip should be 1-2 sentences.
5. **Potential Score** (0-100): Estimated score if all improvements are made
6. **Quick Wins** (3 items): The top 3 easiest improvements that would have biggest impact

Respond in JSON format:
{
  "fitScore": <number>,
  "summary": "<string>",
  "missingKeywords": ["<string>", ...],
  "improvementTips": ["<string>", ...],
  "potentialScore": <number>,
  "quickWins": ["<string>", "<string>", "<string>"]
}

Be realistic with scores. Most CVs should score 40-70. Only give 80+ if truly excellent match.`;

    const completion = await openai.chat.completions.create({
      model: AI_MODEL,
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
      response_format: { type: "json_object" },
    });

    const result = JSON.parse(completion.choices[0].message.content || "{}");

    return Response.json({
      success: true,
      fitScore: result.fitScore || 50,
      summary: result.summary || "Analysis completed.",
      missingKeywords: result.missingKeywords || [],
      improvementTips: result.improvementTips || [],
      potentialScore: result.potentialScore || 70,
      quickWins: result.quickWins || [],
    });
  } catch (error) {
    console.error("Analysis error:", error);
    return Response.json(
      { error: "Failed to analyze" },
      { status: 500 }
    );
  }
}