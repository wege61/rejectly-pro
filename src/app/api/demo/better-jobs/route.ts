import { openai, AI_MODEL } from "@/lib/ai/client";

export async function POST(request: Request) {
  try {
    const { cvText, jobs } = await request.json();

    if (!cvText || !jobs || jobs.length === 0) {
      return Response.json(
        { error: "CV and jobs required" },
        { status: 400 }
      );
    }

    // Analyze each job for match score
    const prompt = `You are an expert job matcher. Analyze how well this CV matches each job posting.

CV:
${cvText}

Job Postings:
${jobs.map((job: any, idx: number) => `
Job ${idx + 1}: ${job.title} at ${job.company}
Location: ${job.location}
Description: ${job.description}
`).join('\n---\n')}

For each job, provide:
1. Match score (0-100) - be realistic
2. Why it matches (1 sentence)
3. Top 3 reasons for the score

Respond in JSON format:
{
  "matches": [
    {
      "jobIndex": 0,
      "matchScore": 75,
      "whyMatch": "Your React experience aligns well with their frontend needs",
      "topReasons": ["React expertise", "3 years experience", "Remote work preference"]
    },
    ...
  ]
}

Sort by matchScore descending. Be critical - most jobs should score 50-80.`;

    const completion = await openai.chat.completions.create({
      model: AI_MODEL,
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
      response_format: { type: "json_object" },
    });

    const result = JSON.parse(completion.choices[0].message.content || "{}");

    // Combine job data with match results
    const betterJobs = (result.matches || []).map((match: any) => ({
      ...jobs[match.jobIndex],
      matchScore: match.matchScore,
      whyMatch: match.whyMatch,
      topReasons: match.topReasons,
    }));

    return Response.json({
      success: true,
      jobs: betterJobs.slice(0, 3), // Top 3 only
    });
  } catch (error) {
    console.error("Better jobs error:", error);
    return Response.json(
      { error: "Failed to analyze jobs" },
      { status: 500 }
    );
  }
}