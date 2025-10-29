import { openai, AI_MODEL } from "@/lib/ai/client";

export async function POST(request: Request) {
  try {
    const { cvText, jobText } = await request.json();

    if (!cvText || !jobText) {
      return Response.json(
        { error: "CV and job description required" },
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