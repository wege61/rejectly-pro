import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { openai, AI_MODEL } from "@/lib/ai/client";

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
        { error: "reportId is required" },
        { status: 400 }
      );
    }

    // Fetch the report with CV text and job texts
    const { data: report, error: reportError } = await supabase
      .from("reports")
      .select("*, cv:documents!cv_id(text)")
      .eq("id", reportId)
      .eq("user_id", user.id)
      .single();

    if (reportError || !report) {
      return NextResponse.json(
        { error: "Report not found" },
        { status: 404 }
      );
    }

    // If ats_flags already has structured readability data, return it
    if (
      report.ats_flags &&
      Array.isArray(report.ats_flags) &&
      report.ats_flags.length > 0 &&
      typeof report.ats_flags[0] === "object"
    ) {
      return NextResponse.json({
        success: true,
        findings: report.ats_flags,
        cached: true,
      });
    }

    const cvText = report.cv?.text;
    if (!cvText) {
      return NextResponse.json(
        { error: "CV text not found" },
        { status: 404 }
      );
    }

    // Fetch job texts
    const jobIds = report.job_ids as string[];
    const { data: jobDocs } = await supabase
      .from("documents")
      .select("text")
      .in("id", jobIds)
      .eq("user_id", user.id)
      .eq("type", "job");

    const jobTexts = jobDocs?.map((j) => j.text) || [];

    // Generate personalized ATS readability analysis
    const prompt = generateAtsReadabilityPrompt(cvText, jobTexts);

    const completion = await openai.chat.completions.create({
      model: AI_MODEL,
      messages: [{ role: "user", content: prompt }],
      temperature: 0.3,
      max_tokens: 1200,
      response_format: { type: "json_object" },
    });

    const result = JSON.parse(
      completion.choices[0].message.content || '{"findings":[]}'
    );

    const findings = result.findings || [];

    // Save to report so it doesn't need to be regenerated
    await supabase
      .from("reports")
      .update({ ats_flags: findings })
      .eq("id", reportId);

    return NextResponse.json({
      success: true,
      findings,
      cached: false,
    });
  } catch (error) {
    console.error("ATS readability analysis error:", error);
    return NextResponse.json(
      { error: "Failed to generate ATS readability analysis" },
      { status: 500 }
    );
  }
}

function generateAtsReadabilityPrompt(
  cvText: string,
  jobTexts: string[]
): string {
  return `You are an ATS (Applicant Tracking System) parsing expert. Analyze this resume for ATS READABILITY and PARSEABILITY issues.

=============================================================================
RESUME TEXT
=============================================================================
"""
${cvText}
"""

${
  jobTexts.length > 0
    ? `=============================================================================
TARGET JOB POSTING(S)
=============================================================================
${jobTexts.map((t, i) => `--- JOB ${i + 1} ---\n"""\n${t}\n"""`).join("\n")}`
    : ""
}

=============================================================================
ANALYSIS FOCUS — ATS PARSING & READABILITY ONLY
=============================================================================
You must analyze how well an ATS can READ and PARSE this resume.
Do NOT analyze job fit, skills match, or qualifications.
Focus ONLY on technical parseability.

Evaluate these categories. For each, give a status based on what you ACTUALLY find in the resume text:

1. **section_headers**: Are section headers standard? ("Work Experience" vs "My Journey")
2. **formatting**: Does the text suggest tables, columns, or complex layouts?
3. **keyword_presence**: Does the resume include relevant keywords from the job posting? Are they naturally placed?
4. **contact_info**: Is contact information clearly structured and in a parseable location?
5. **date_formats**: Are dates consistent and in standard formats (MM/YYYY, Month YYYY)?
6. **content_structure**: Is work history clearly structured (Title → Company → Dates → Bullets)?
7. **file_readability**: Any signs of text extraction issues? (garbled text, missing characters, encoding problems)

=============================================================================
RESPONSE FORMAT (STRICT JSON)
=============================================================================
{
  "findings": [
    {
      "id": "<category_id from list above>",
      "label": "<human readable short label>",
      "status": "pass" | "warning" | "fail",
      "detail": "<1-2 sentence explanation specific to THIS resume. Reference actual content from the resume.>"
    }
  ]
}

RULES:
- Return exactly 5-7 findings (skip categories that don't apply)
- "detail" MUST reference specific things from THIS resume (section names, missing keywords, actual formatting issues found)
- Do NOT give generic advice. Every finding must be grounded in the actual resume content
- Be honest: if the resume is well-formatted, give "pass" status
- "fail" = ATS will likely misparse this section
- "warning" = suboptimal but parseable  
- "pass" = good ATS compatibility for this aspect

Respond with ONLY the JSON object.`;
}
