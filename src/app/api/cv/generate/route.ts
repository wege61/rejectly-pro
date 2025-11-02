import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { openai, AI_MODEL } from "@/lib/ai/client";
import { generateOptimizedCVPrompt } from "@/lib/ai/prompts";

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

    // Fetch report with all related data
    const { data: report, error: reportError } = await supabase
      .from("reports")
      .select("*, cv:documents!cv_id(*)")
      .eq("id", reportId)
      .eq("user_id", user.id)
      .single();

    if (reportError || !report) {
      return NextResponse.json({ error: "Report not found" }, { status: 404 });
    }

    // Check if CV already generated
    if (report.generated_cv) {
      return NextResponse.json({
        success: true,
        message: "CV already generated",
        cv: report.generated_cv,
      });
    }

    // Check if report is Pro (required for CV generation)
    if (!report.pro) {
      return NextResponse.json(
        { error: "Pro analysis required for CV generation" },
        { status: 403 }
      );
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

    // Prepare analysis results
    const analysisResults = {
      fitScore: report.fit_score || 0,
      summary: report.summary_free || "",
      missingKeywords: report.keywords || [],
      rewrittenBullets: report.summary_pro?.rewrittenBullets || [],
      roleRecommendations: report.role_fit || [],
      atsFlags: report.ats_flags || [],
    };

    // Generate optimized CV using AI
    const prompt = generateOptimizedCVPrompt(
      report.cv.text,
      jobDocs.map((job) => job.text),
      analysisResults
    );

    const completion = await openai.chat.completions.create({
      model: AI_MODEL,
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
      max_tokens: 3000,
      response_format: { type: "json_object" },
    });

    const generatedCV = JSON.parse(
      completion.choices[0].message.content || "{}"
    );

    // Save generated CV to database
    const { error: updateError } = await supabase
      .from("reports")
      .update({
        generated_cv: generatedCV,
      })
      .eq("id", reportId)
      .select()
      .single();

    if (updateError) {
      throw new Error(`Failed to save generated CV: ${updateError.message}`);
    }

    return NextResponse.json({
      success: true,
      message: "CV generated successfully",
      cv: generatedCV,
    });
  } catch (error) {
    console.error("CV generation error:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";

    return NextResponse.json(
      { error: `Failed to generate CV: ${errorMessage}` },
      { status: 500 }
    );
  }
}
