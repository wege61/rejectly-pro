import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { openai, AI_MODEL } from "@/lib/ai/client";
import { generateInterviewPrepPrompt } from "@/lib/ai/prompts";

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

    // Fetch report with CV data
    const { data: report, error: reportError } = await supabase
      .from("reports")
      .select("*, cv:documents!cv_id(*)")
      .eq("id", reportId)
      .eq("user_id", user.id)
      .single();

    if (reportError || !report) {
      return NextResponse.json({ error: "Report not found" }, { status: 404 });
    }

    // Only pro users with generated CV can access interview prep
    if (!report.pro || !report.generated_cv) {
      return NextResponse.json(
        { error: "Interview preparation requires a generated optimized resume" },
        { status: 403 }
      );
    }

    // Return cached data if already generated
    if (report.interview_prep) {
      return NextResponse.json({
        success: true,
        interviewPrep: report.interview_prep,
        cached: true,
      });
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

    // Build weak categories from score breakdown
    const weakCategories: string[] = [];
    if (report.score_breakdown?.components) {
      const components = report.score_breakdown.components as Record<string, { earnedPoints?: number; maxPoints?: number }>;
      for (const [key, comp] of Object.entries(components)) {
        if (comp && comp.maxPoints && comp.earnedPoints !== undefined) {
          const pct = (comp.earnedPoints / comp.maxPoints) * 100;
          if (pct < 60) {
            weakCategories.push(key);
          }
        }
      }
    }

    const missingKeywords = report.keywords?.missing || [];

    const prompt = generateInterviewPrepPrompt(
      report.cv.text,
      jobDocs.map((job: { text: string }) => job.text),
      missingKeywords,
      {
        fitScore: report.fit_score,
        weakCategories,
      }
    );

    const completion = await openai.chat.completions.create({
      model: AI_MODEL,
      messages: [{ role: "user", content: prompt }],
      temperature: 0.4,
      max_tokens: 4000,
      response_format: { type: "json_object" },
    });

    const result = JSON.parse(completion.choices[0].message.content || "{}");

    // Validate the structure
    if (!result.behavioral || !result.technical) {
      throw new Error("Invalid interview prep response structure");
    }

    // Save to database
    const { error: updateError } = await supabase
      .from("reports")
      .update({ interview_prep: result })
      .eq("id", reportId);

    if (updateError) {
      console.error("Failed to save interview prep:", updateError);
    }

    return NextResponse.json({
      success: true,
      interviewPrep: result,
      cached: false,
    });
  } catch (error) {
    console.error("Interview prep generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate interview preparation. Please try again." },
      { status: 500 }
    );
  }
}
