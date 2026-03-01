import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { openai, AI_MODEL } from "@/lib/ai/client";
import { generateProReportPrompt } from "@/lib/ai/prompts";
import { getUserAccessStatus, consumeCredit } from "@/lib/credits";
import { proAnalyzeRequestSchema, validateRequest } from "@/lib/validations";

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

    // Get and validate request body
    const body = await request.json();
    const validation = validateRequest(proAnalyzeRequestSchema, body);

    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error },
        { status: 400 }
      );
    }

    const { reportId } = validation.data;

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

    // Check user access (subscription or credits)
    console.log("Checking access for user:", user.id);
    const accessStatus = await getUserAccessStatus(user.id);
    console.log("Access status:", accessStatus);

    if (!accessStatus.canAnalyze) {
      return NextResponse.json(
        {
          error: "No credits or subscription available",
          credits: accessStatus.credits,
          hasSubscription: accessStatus.hasSubscription
        },
        { status: 402 } // Payment Required
      );
    }

    // If user doesn't have subscription, consume a credit
    if (!accessStatus.hasSubscription) {
      const creditConsumed = await consumeCredit(user.id);
      if (!creditConsumed) {
        return NextResponse.json(
          { error: "Failed to consume credit" },
          { status: 500 }
        );
      }
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

    return NextResponse.json(
      { error: "Failed to generate Pro analysis. Please try again." },
      { status: 500 }
    );
  }
}
