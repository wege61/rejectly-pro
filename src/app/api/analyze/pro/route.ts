import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { openai, AI_MODEL } from "@/lib/ai/client";
import { generateProReportPrompt } from "@/lib/ai/prompts";

export async function POST(request: NextRequest) {
  try {
    // Get authenticated user
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get request body
    const { reportId } = await request.json();

    if (!reportId) {
      return NextResponse.json(
        { error: "Report ID required" },
        { status: 400 }
      );
    }

    // Fetch report
    const { data: report, error: reportError } = await supabase
      .from("reports")
      .select("*, cv:documents!cv_id(*)")
      .eq("id", reportId)
      .eq("user_id", user.id)
      .single();

    if (reportError || !report) {
      return NextResponse.json({ error: "Report not found" }, { status: 404 });
    }

    // Check if already pro
    if (report.pro) {
      return NextResponse.json({
        success: true,
        message: "Report is already Pro",
        report: {
          id: report.id,
          summaryPro: report.summary_pro,
        },
      });
    }

    // TODO: Check payment status (Stripe integration)
    // For now, we'll skip payment check for testing

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

    // Generate Pro analysis
    const prompt = generateProReportPrompt(
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

    const result = JSON.parse(completion.choices[0].message.content || "{}");

    // Update report with Pro data
    const { data: updatedReport, error: updateError } = await supabase
      .from("reports")
      .update({
        summary_pro: result,
        role_fit: result.roleRecommendations,
        ats_flags: result.atsFlags,
        pro: true,
      })
      .eq("id", reportId)
      .select()
      .single();

    if (updateError) {
      throw new Error(`Failed to update report: ${updateError.message}`);
    }

    return NextResponse.json({
      success: true,
      report: {
        id: updatedReport.id,
        rewrittenBullets: result.rewrittenBullets || [],
        roleRecommendations: result.roleRecommendations || [],
        atsFlags: result.atsFlags || [],
      },
    });
  } catch (error) {
    console.error("Pro analysis error:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";

    return NextResponse.json(
      { error: `Failed to generate Pro analysis: ${errorMessage}` },
      { status: 500 }
    );
  }
}
