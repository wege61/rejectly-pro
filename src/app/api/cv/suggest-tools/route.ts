import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { openai, AI_MODEL } from "@/lib/ai/client";
import { ToolSuggestionResponse } from "@/types/toolSuggestion";

function generateToolSuggestionPrompt(
  cvText: string,
  jobTexts: string[]
): string {
  return `You are an expert career coach and technical recruiter. Analyze the CV and job posting(s) to suggest tools and technologies the candidate might have used but didn't mention in their CV.

=============================================================================
CANDIDATE'S CV
=============================================================================
"""
${cvText}
"""

=============================================================================
TARGET JOB POSTING(S)
=============================================================================
${jobTexts
  .map(
    (text, i) => `
--- JOB ${i + 1} ---
"""
${text}
"""
`
  )
  .join("\n")}

=============================================================================
YOUR TASK
=============================================================================
1. Extract each work experience from the CV (title, company, dates)
2. Identify tools/technologies already mentioned for each experience
3. Suggest additional tools the candidate LIKELY used based on:
   - Tools required in job posting but missing from CV (priority: high)
   - Industry-standard tools for that role/time period (priority: medium)
   - Tools related to their existing skills (priority: low)

=============================================================================
CRITICAL RULES
=============================================================================
- Only suggest tools that are PLAUSIBLE given the role and time period
- Don't suggest tools that didn't exist during their tenure
- Prioritize tools from the job posting - these directly impact ATS score
- Limit suggestions to 4-6 tools per experience (most relevant only)
- Include a brief reason why they might have used each tool

=============================================================================
RESPONSE FORMAT (STRICT JSON)
=============================================================================
{
  "experiences": [
    {
      "experienceIndex": 0,
      "title": "Job Title from CV",
      "company": "Company Name from CV",
      "dates": "Start - End dates from CV",
      "existingTools": ["Tool1", "Tool2"],
      "suggestedTools": [
        {
          "name": "React",
          "category": "Frontend Framework",
          "reason": "Required in job posting, commonly used with JavaScript",
          "priority": "high",
          "source": "job_posting"
        },
        {
          "name": "Jest",
          "category": "Testing",
          "reason": "Industry standard for JavaScript testing",
          "priority": "medium",
          "source": "industry_standard"
        }
      ]
    }
  ],
  "globalSuggestions": [
    {
      "name": "Docker",
      "category": "DevOps",
      "reason": "Mentioned 3 times in job posting, essential for modern development",
      "priority": "high",
      "source": "job_posting"
    }
  ]
}

=============================================================================
SUGGESTION CATEGORIES
=============================================================================
Use these categories:
- Programming Language
- Frontend Framework
- Backend Framework
- Database
- Cloud Platform (AWS, GCP, Azure)
- DevOps Tool
- Testing Framework
- Design Tool
- Project Management
- Version Control
- CI/CD
- Monitoring
- Other

=============================================================================
PRIORITY GUIDELINES
=============================================================================
- "high": Tool is explicitly required/mentioned in job posting
- "medium": Industry standard for the role, would strengthen CV
- "low": Related to existing skills, nice to have

=============================================================================
SOURCE VALUES
=============================================================================
- "job_posting": Tool appears in the target job description
- "industry_standard": Common tool for this role/industry
- "related_skill": Logically connected to tools already in CV

Only suggest tools that would realistically have been used. Quality over quantity.

Respond with ONLY the JSON object. No explanations.`;
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { reportId } = await request.json();

    if (!reportId) {
      return NextResponse.json(
        { error: "Report ID required" },
        { status: 400 }
      );
    }

    // Fetch report with CV
    const { data: report, error: reportError } = await supabase
      .from("reports")
      .select("*, cv:documents!cv_id(*)")
      .eq("id", reportId)
      .eq("user_id", user.id)
      .single();

    if (reportError || !report) {
      return NextResponse.json({ error: "Report not found" }, { status: 404 });
    }

    // Fetch job documents
    const jobIds = report.job_ids as string[];
    const { data: jobDocs, error: jobError } = await supabase
      .from("documents")
      .select("*")
      .in("id", jobIds)
      .eq("user_id", user.id)
      .eq("type", "job");

    if (jobError || !jobDocs || jobDocs.length === 0) {
      return NextResponse.json({ error: "Jobs not found" }, { status: 404 });
    }

    // Generate tool suggestions using AI
    const prompt = generateToolSuggestionPrompt(
      report.cv.text,
      jobDocs.map((job) => job.text)
    );

    const completion = await openai.chat.completions.create({
      model: AI_MODEL,
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
      max_tokens: 2000,
      response_format: { type: "json_object" },
    });

    const suggestions: ToolSuggestionResponse = JSON.parse(
      completion.choices[0].message.content || "{}"
    );

    // Filter out experiences with no suggestions
    const filteredExperiences = suggestions.experiences?.filter(
      (exp) => exp.suggestedTools && exp.suggestedTools.length > 0
    ) || [];

    return NextResponse.json({
      success: true,
      suggestions: {
        experiences: filteredExperiences,
        globalSuggestions: suggestions.globalSuggestions || [],
      },
    });
  } catch (error) {
    console.error("Tool suggestion error:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";

    return NextResponse.json(
      { error: `Failed to generate tool suggestions: ${errorMessage}` },
      { status: 500 }
    );
  }
}
