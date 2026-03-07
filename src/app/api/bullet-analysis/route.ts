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

    // Fetch the report with CV text
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

    const cvText = report.cv?.text;
    if (!cvText) {
      return NextResponse.json(
        { error: "CV text not found" },
        { status: 404 }
      );
    }

    // Generate personalized bullet point analysis
    const prompt = generateBulletAnalysisPrompt(cvText);

    const completion = await openai.chat.completions.create({
      model: AI_MODEL,
      messages: [{ role: "user", content: prompt }],
      temperature: 0.3,
      max_tokens: 800,
      response_format: { type: "json_object" },
    });

    const result = JSON.parse(
      completion.choices[0].message.content || '{"findings":[]}'
    );

    const findings = result.findings || [];

    return NextResponse.json({
      success: true,
      findings,
    });
  } catch (error) {
    console.error("Bullet analysis error:", error);
    return NextResponse.json(
      { error: "Failed to generate bullet analysis" },
      { status: 500 }
    );
  }
}

function generateBulletAnalysisPrompt(cvText: string): string {
  return `You are an expert resume reviewer. Analyze this resume text and find 2 to 3 WEAK bullet points from the Work Experience section.

=============================================================================
RESUME TEXT
=============================================================================
"""
${cvText}
"""
=============================================================================
ANALYSIS FOCUS
=============================================================================
Look for bullet points that suffer from one or more of these common issues:
- Lack of metrics or quantifiable results
- Vague or generic descriptions of duties (e.g., "Responsible for...", "Handled...")
- Missing business impact (what was the RESULT of the action?)
- Weak action verbs (e.g., "Helped", "Worked on")

For each weak bullet point you find, provide:
1. The exact original text (or truncated if very long).
2. A specific critique of why it is weak.
3. A short, persuasive explanation of how a "Pro" rewrite would fix it (e.g., "Pro will rewrite this with strong action verbs and metrics.").

Do NOT rewrite the bullet point for them. Only critique it and tell them how Pro fixes it.

=============================================================================
RESPONSE FORMAT (STRICT JSON)
=============================================================================
{
  "findings": [
    {
      "original": "<exact text from resume>",
      "critique": "<1-2 sentence specific critique>",
      "suggestion": "<1 sentence explanation of how Pro optimization solves this>"
    }
  ]
}

Respond with ONLY the JSON object.`;
}
