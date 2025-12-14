import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { openai, AI_MODEL } from "@/lib/ai/client";
import { generateSystematicScoringPrompt } from "@/lib/ai/prompts";
import { ScoreBreakdown } from "@/types/scoreBreakdown";

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
    const { cvId, jobIds } = await request.json();

    if (!cvId || !jobIds || !Array.isArray(jobIds) || jobIds.length === 0) {
      return NextResponse.json(
        { error: "CV ID and at least one job ID required" },
        { status: 400 }
      );
    }

    if (jobIds.length > 3) {
      return NextResponse.json(
        { error: "Maximum 3 job postings allowed for free analysis" },
        { status: 400 }
      );
    }

    // Fetch CV document
    const { data: cvDoc, error: cvError } = await supabase
      .from("documents")
      .select("*")
      .eq("id", cvId)
      .eq("user_id", user.id)
      .eq("type", "cv")
      .single();

    if (cvError || !cvDoc) {
      return NextResponse.json({ error: "CV not found" }, { status: 404 });
    }

    // Fetch job documents
    const { data: jobDocs, error: jobError } = await supabase
      .from("documents")
      .select("*")
      .in("id", jobIds)
      .eq("user_id", user.id)
      .eq("type", "job");

    if (jobError || !jobDocs || jobDocs.length === 0) {
      return NextResponse.json({ error: "Jobs not found" }, { status: 404 });
    }

    // Generate AI analysis with systematic scoring
    const prompt = generateSystematicScoringPrompt(
      cvDoc.text,
      jobDocs.map((job) => job.text)
    );

    const completion = await openai.chat.completions.create({
      model: AI_MODEL,
      messages: [{ role: "user", content: prompt }],
      temperature: 0.5, // Lower temperature for more consistent scoring
      max_tokens: 2500, // Increased for detailed breakdown
      response_format: { type: "json_object" },
    });

    const scoreBreakdown: ScoreBreakdown = JSON.parse(
      completion.choices[0].message.content || "{}"
    );

    // Extract missing keywords from all components
    const missingKeywords: string[] = [];
    Object.values(scoreBreakdown.components).forEach((component) => {
      if (component.missingItems) {
        missingKeywords.push(...component.missingItems);
      }
    });
    const uniqueMissingKeywords = [...new Set(missingKeywords)].slice(0, 10);

    // Save report to database with score breakdown
    const { data: report, error: reportError } = await supabase
      .from("reports")
      .insert({
        user_id: user.id,
        cv_id: cvId,
        job_ids: jobIds,
        fit_score: scoreBreakdown.finalScore || 0,
        summary_free: scoreBreakdown.summary || "",
        keywords: { missing: uniqueMissingKeywords },
        score_breakdown: scoreBreakdown,
        pro: false,
      })
      .select()
      .single();

    if (reportError) {
      throw new Error(`Failed to save report: ${reportError.message}`);
    }

    return NextResponse.json({
      success: true,
      report: {
        id: report.id,
        fitScore: report.fit_score,
        summary: report.summary_free,
        missingKeywords: uniqueMissingKeywords,
        scoreBreakdown: scoreBreakdown,
        createdAt: report.created_at,
      },
    });
  } catch (error) {
    console.error("Free analysis error:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    const errorStack = error instanceof Error ? error.stack : "";

    return NextResponse.json(
      {
        error: `Failed to generate analysis: ${errorMessage}`,
        stack: errorStack,
        details: String(error)
      },
      { status: 500 }
    );
  }
}
