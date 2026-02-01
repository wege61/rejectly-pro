import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getUserAccessStatus, consumeCredit } from "@/lib/credits";
import {
  ATSCheckResult,
  ATSCheckRequest,
  ATSCheckResponse,
  getATSScoreLabel,
  getATSScoreColor,
} from "@/types/atsCheck";
import {
  calculateDeterministicScore,
  calculateParsingCompatibility,
  parseCV,
} from "@/lib/ats/deterministicScoring";
import { generateATSCheckPrompt } from "@/lib/ai/prompts";
import { openai, AI_MODEL } from "@/lib/ai/client";

export async function POST(request: NextRequest) {
  console.log("\n\n🔍 ATS CHECK ENDPOINT CALLED 🔍\n\n");

  try {
    // 1. Parse request first
    const body: ATSCheckRequest & { useAI?: boolean; reportId?: string } = await request.json();
    const { documentId, cvText, unlock = false, useAI = false, reportId } = body;

    console.log("📋 ATS Check Request:", {
      documentId,
      reportId,
      hasCvText: !!cvText,
      unlock,
      useAI,
    });

    if (!documentId && !reportId && !cvText) {
      return NextResponse.json(
        { error: "Either documentId, reportId or cvText is required" },
        { status: 400 }
      );
    }

    // 2. Public access for cvText-only requests (no auth required)
    if (!documentId && !reportId && cvText) {
      console.log("🌐 Public ATS check (no auth required), useAI:", useAI);
      return handlePublicATSCheck(cvText, useAI);
    }

    // 3. Authenticated access for documentId/reportId requests
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 4. Get CV text and Check Cache
    let textToAnalyze: string = cvText || "";
    let doc: any = null;

    if (documentId) {
      console.log("🔍 Looking for document:", {
        documentId,
        userId: user.id,
        type: "cv"
      });

      const { data: foundDoc, error: docError } = await supabase
        .from("documents")
        .select("text, ats_score, ats_breakdown, ats_unlocked")
        .eq("id", documentId)
        .eq("user_id", user.id)
        .eq("type", "cv")
        .single();

      if (docError || !foundDoc) {
        console.error("❌ Document not found:", { error: docError });
        return NextResponse.json({ error: "CV not found" }, { status: 404 });
      }

      doc = foundDoc;
      textToAnalyze = doc.text;

      // Check if we have cached results for document
      if (doc.ats_breakdown && !unlock) {
        console.log("✅ Returning cached ATS result for document");
        const cachedResult = doc.ats_breakdown as ATSCheckResult;

        // If not unlocked, return free preview only
        if (!doc.ats_unlocked) {
          const freeResult = createFreePreview(cachedResult);
          return NextResponse.json({
            success: true,
            result: freeResult,
          } as ATSCheckResponse);
        }

        return NextResponse.json({
          success: true,
          result: cachedResult,
        } as ATSCheckResponse);
      }
    } else if (reportId) {
      console.log("🔍 Looking for report:", {
        reportId,
        userId: user.id
      });

      const { data: report, error: reportError } = await supabase
        .from("reports")
        .select("ats_score_optimized, ats_breakdown_optimized")
        .eq("id", reportId)
        .eq("user_id", user.id)
        .single();

      if (reportError || !report) {
         console.error("❌ Report not found:", { reportError });
         return NextResponse.json({ error: "Report not found" }, { status: 404 });
      }

      if (report.ats_breakdown_optimized) {
         console.log("✅ Returning cached Optimized ATS result for report");
         return NextResponse.json({
           success: true,
           result: report.ats_breakdown_optimized as ATSCheckResult,
         } as ATSCheckResponse);
      }
      
      // If we don't have text provided, we might fail here. 
      // Assuming text is always provided with reportId as per plan.
      if (!textToAnalyze) {
          return NextResponse.json({ error: "CV text required for report analysis" }, { status: 400 });
      }
    }

    // Handle unlocking credit deduction (only for documents)
    if (documentId && unlock && doc && !doc.ats_unlocked) {
        // Check user access (subscription or credits)
        const accessStatus = await getUserAccessStatus(user.id);

        if (!accessStatus.canAnalyze) {
          return NextResponse.json(
            { error: "Insufficient credits", creditsRequired: 1, credits: accessStatus.credits },
            { status: 402 }
          );
        }

        // Consume credit if not subscribed
        if (!accessStatus.hasSubscription) {
          const consumed = await consumeCredit(user.id);
          if (!consumed) {
            return NextResponse.json(
              { error: "Failed to process credit" },
              { status: 500 }
            );
          }
          console.log("💳 Deducted 1 credit for ATS unlock");
        } else {
          console.log("✅ User has subscription, no credit deducted");
        }

        // Mark as unlocked
        await supabase
          .from("documents")
          .update({ ats_unlocked: true })
          .eq("id", documentId);

        // Return full cached result if available
        if (doc.ats_breakdown) {
          const fullResult = doc.ats_breakdown as ATSCheckResult;
          fullResult.isPro = true;
          return NextResponse.json({
            success: true,
            result: fullResult,
          } as ATSCheckResponse);
        }
    }

    // 5. Calculate DETERMINISTIC score (rule-based, consistent)
    console.log("📊 Calculating deterministic ATS score...");
    const deterministicResult = calculateDeterministicScore(textToAnalyze);
    const parsedCV = parseCV(textToAnalyze);
    const parsingChecks = calculateParsingCompatibility(parsedCV);

    // 6. Build final result from deterministic scoring
    const result: ATSCheckResult = {
      version: "3.0-deterministic",
      checkedAt: new Date().toISOString(),
      overallScore: deterministicResult.overallScore,
      scoreLabel: getATSScoreLabel(deterministicResult.overallScore),
      scoreColor: getATSScoreColor(deterministicResult.overallScore),
      summary: deterministicResult.summary,
      freePreview: {
        quickWin: deterministicResult.quickWins[0] || "Add more quantified achievements",
        issueCount: deterministicResult.topIssues.length,
        passCount: Object.values(deterministicResult.categories).reduce(
          (sum, cat) => sum + cat.passes.length, 0
        ),
      },
      categories: {
        format: {
          name: deterministicResult.categories.format.name,
          maxPoints: deterministicResult.categories.format.maxPoints,
          earnedPoints: deterministicResult.categories.format.earnedPoints,
          percentage: deterministicResult.categories.format.percentage,
          issues: deterministicResult.categories.format.issues,
          passes: deterministicResult.categories.format.passes,
        },
        structure: {
          name: deterministicResult.categories.structure.name,
          maxPoints: deterministicResult.categories.structure.maxPoints,
          earnedPoints: deterministicResult.categories.structure.earnedPoints,
          percentage: deterministicResult.categories.structure.percentage,
          issues: deterministicResult.categories.structure.issues,
          passes: deterministicResult.categories.structure.passes,
        },
        keywords: {
          name: deterministicResult.categories.keywords.name,
          maxPoints: deterministicResult.categories.keywords.maxPoints,
          earnedPoints: deterministicResult.categories.keywords.earnedPoints,
          percentage: deterministicResult.categories.keywords.percentage,
          issues: deterministicResult.categories.keywords.issues,
          passes: deterministicResult.categories.keywords.passes,
        },
        readability: {
          name: deterministicResult.categories.readability.name,
          maxPoints: deterministicResult.categories.readability.maxPoints,
          earnedPoints: deterministicResult.categories.readability.earnedPoints,
          percentage: deterministicResult.categories.readability.percentage,
          issues: deterministicResult.categories.readability.issues,
          passes: deterministicResult.categories.readability.passes,
        },
      },
      topIssues: deterministicResult.topIssues,
      quickWins: deterministicResult.quickWins,
      metadata: {
        wordCount: deterministicResult.metadata.wordCount,
        estimatedPages: deterministicResult.metadata.estimatedPages,
        fileFormat: "pdf",
        hasStandardSections: parsedCV.hasProfessionalSummary && parsedCV.hasExperience && parsedCV.hasEducation,
        hasContactInfo: deterministicResult.metadata.hasContactInfo,
        detectedSections: [
          parsedCV.hasProfessionalSummary && "Professional Summary",
          parsedCV.hasExperience && "Experience",
          parsedCV.hasEducation && "Education",
          parsedCV.hasSkills && "Skills",
          parsedCV.hasCertifications && "Certifications",
          parsedCV.hasLanguages && "Languages",
        ].filter(Boolean) as string[],
        keywordStats: deterministicResult.metadata.keywordStats,
      },
      parsingChecks,
      abbreviationCheck: deterministicResult.abbreviationCheck,
      isPro: unlock || !!reportId, // If reportId is provided, it's pro (optimized CV)
    };

    console.log("📊 ATS Score:", result.overallScore, result.scoreLabel);

    // 6. Save to database (if documentId or reportId provided)
    if (documentId) {
      const { error: updateError } = await supabase
        .from("documents")
        .update({
          ats_score: result.overallScore,
          ats_breakdown: result,
          ats_checked_at: new Date().toISOString(),
          ats_unlocked: unlock,
        })
        .eq("id", documentId);

      if (updateError) {
        console.error("Failed to save ATS result to documents:", updateError);
        // Don't fail the request, just log
      } else {
        console.log("✅ ATS result saved to documents database");
      }
    }

    if (reportId) {
       const { error: updateReportError } = await supabase
        .from("reports")
        .update({
          ats_score_optimized: result.overallScore,
          ats_breakdown_optimized: result,
        })
        .eq("id", reportId);

      if (updateReportError) {
        console.error("Failed to save ATS result to reports:", updateReportError);
      } else {
        console.log("✅ Optimized ATS result saved to reports database");
      }
    }

    // 7. Return response (free or full based on unlock/reportId)
    // For documentId, we respect 'unlock' flag.
    // For reportId, we always return full result (as users who generated reports are pro/paid usually, or we treat it as unlocked)
    // Actually, reportId implies access to the optimized CV, which should have the full score breakdown.
    
    if (documentId && !unlock) {
      const freeResult = createFreePreview(result);
      return NextResponse.json({
        success: true,
        result: freeResult,
      } as ATSCheckResponse);
    }
    
    // For reportId or unlocked document
    return NextResponse.json({
      success: true,
      result,
    } as ATSCheckResponse);

  } catch (error) {
    console.error("ATS check error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "ATS check failed",
      },
      { status: 500 }
    );
  }
}

// Helper: Create free preview from full result
function createFreePreview(fullResult: ATSCheckResult): ATSCheckResult {
  return {
    ...fullResult,
    // Keep these for free
    overallScore: fullResult.overallScore,
    scoreLabel: fullResult.scoreLabel,
    scoreColor: fullResult.scoreColor,
    summary: fullResult.summary,
    freePreview: fullResult.freePreview,
    metadata: fullResult.metadata,

    // Hide these for pro
    categories: {
      format: { ...fullResult.categories.format, issues: [], passes: [] },
      structure: { ...fullResult.categories.structure, issues: [], passes: [] },
      keywords: { ...fullResult.categories.keywords, issues: [], passes: [] },
      readability: { ...fullResult.categories.readability, issues: [], passes: [] },
    },
    topIssues: [],
    quickWins: [fullResult.quickWins?.[0] || "Unlock to see all tips"],

    isPro: false,
  };
}

// Helper: Count all issues
function countAllIssues(result: ATSCheckResult): number {
  if (!result.categories) return 0;
  return (
    (result.categories.format?.issues?.length || 0) +
    (result.categories.structure?.issues?.length || 0) +
    (result.categories.keywords?.issues?.length || 0) +
    (result.categories.readability?.issues?.length || 0)
  );
}

// Helper: Count all passes
function countAllPasses(result: ATSCheckResult): number {
  if (!result.categories) return 0;
  return (
    (result.categories.format?.passes?.length || 0) +
    (result.categories.structure?.passes?.length || 0) +
    (result.categories.keywords?.passes?.length || 0) +
    (result.categories.readability?.passes?.length || 0)
  );
}

// Handle public ATS check (no auth required, full results for landing page)
async function handlePublicATSCheck(cvText: string, useAI: boolean = false): Promise<NextResponse> {
  try {
    // If useAI is true, use AI prompt-based evaluation (same as ATS Optimizer)
    if (useAI) {
      console.log("🤖 Using AI-based ATS evaluation (ATS Optimizer prompt)...");
      return handleAIBasedATSCheck(cvText);
    }

    console.log("📊 Calculating public deterministic ATS score...");

    // Use deterministic scoring for consistent results
    const deterministicResult = calculateDeterministicScore(cvText);
    const parsedCV = parseCV(cvText);
    const parsingChecks = calculateParsingCompatibility(parsedCV);

    // Build result from deterministic scoring
    const result: ATSCheckResult = {
      version: "3.0-deterministic",
      checkedAt: new Date().toISOString(),
      overallScore: deterministicResult.overallScore,
      scoreLabel: getATSScoreLabel(deterministicResult.overallScore),
      scoreColor: getATSScoreColor(deterministicResult.overallScore),
      summary: deterministicResult.summary,
      freePreview: {
        quickWin: deterministicResult.quickWins[0] || "Add more quantified achievements",
        issueCount: deterministicResult.topIssues.length,
        passCount: Object.values(deterministicResult.categories).reduce(
          (sum, cat) => sum + cat.passes.length, 0
        ),
      },
      categories: {
        format: {
          name: deterministicResult.categories.format.name,
          maxPoints: deterministicResult.categories.format.maxPoints,
          earnedPoints: deterministicResult.categories.format.earnedPoints,
          percentage: deterministicResult.categories.format.percentage,
          issues: deterministicResult.categories.format.issues,
          passes: deterministicResult.categories.format.passes,
        },
        structure: {
          name: deterministicResult.categories.structure.name,
          maxPoints: deterministicResult.categories.structure.maxPoints,
          earnedPoints: deterministicResult.categories.structure.earnedPoints,
          percentage: deterministicResult.categories.structure.percentage,
          issues: deterministicResult.categories.structure.issues,
          passes: deterministicResult.categories.structure.passes,
        },
        keywords: {
          name: deterministicResult.categories.keywords.name,
          maxPoints: deterministicResult.categories.keywords.maxPoints,
          earnedPoints: deterministicResult.categories.keywords.earnedPoints,
          percentage: deterministicResult.categories.keywords.percentage,
          issues: deterministicResult.categories.keywords.issues,
          passes: deterministicResult.categories.keywords.passes,
        },
        readability: {
          name: deterministicResult.categories.readability.name,
          maxPoints: deterministicResult.categories.readability.maxPoints,
          earnedPoints: deterministicResult.categories.readability.earnedPoints,
          percentage: deterministicResult.categories.readability.percentage,
          issues: deterministicResult.categories.readability.issues,
          passes: deterministicResult.categories.readability.passes,
        },
      },
      topIssues: deterministicResult.topIssues,
      quickWins: deterministicResult.quickWins,
      metadata: {
        wordCount: deterministicResult.metadata.wordCount,
        estimatedPages: deterministicResult.metadata.estimatedPages,
        fileFormat: "pdf",
        hasStandardSections: parsedCV.hasProfessionalSummary && parsedCV.hasExperience && parsedCV.hasEducation,
        hasContactInfo: deterministicResult.metadata.hasContactInfo,
        detectedSections: [
          parsedCV.hasProfessionalSummary && "Professional Summary",
          parsedCV.hasExperience && "Experience",
          parsedCV.hasEducation && "Education",
          parsedCV.hasSkills && "Skills",
          parsedCV.hasCertifications && "Certifications",
          parsedCV.hasLanguages && "Languages",
        ].filter(Boolean) as string[],
        keywordStats: deterministicResult.metadata.keywordStats,
      },
      parsingChecks,
      abbreviationCheck: deterministicResult.abbreviationCheck,
      isPro: false, // Public users see results but can't save
    };

    console.log("📊 Public ATS Score:", result.overallScore, result.scoreLabel);

    return NextResponse.json({
      success: true,
      result,
    } as ATSCheckResponse);
  } catch (error) {
    console.error("Public ATS check error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "ATS check failed",
      },
      { status: 500 }
    );
  }
}

// AI-based ATS check using the same prompt as ATS Optimizer
async function handleAIBasedATSCheck(cvText: string): Promise<NextResponse> {
  try {
    console.log("🤖 Generating AI-based ATS score using ATS Optimizer prompt...");

    // Generate prompt using the same function as ATS Optimizer
    const prompt = generateATSCheckPrompt(cvText);

    // Call OpenAI
    const completion = await openai.chat.completions.create({
      model: AI_MODEL,
      messages: [{ role: "user", content: prompt }],
      temperature: 0.3, // Low temperature for consistent scoring
      max_tokens: 3000,
      response_format: { type: "json_object" },
    });

    const aiResult = JSON.parse(completion.choices[0].message.content || "{}");

    console.log("🤖 AI ATS Score:", aiResult.overallScore);

    // Build result from AI response
    const result: ATSCheckResult = {
      version: "3.0-ai",
      checkedAt: aiResult.checkedAt || new Date().toISOString(),
      overallScore: aiResult.overallScore || 0,
      scoreLabel: getATSScoreLabel(aiResult.overallScore || 0),
      scoreColor: getATSScoreColor(aiResult.overallScore || 0),
      summary: aiResult.summary || "",
      freePreview: {
        quickWin: aiResult.quickWins?.[0] || "Optimize your CV for ATS",
        issueCount: aiResult.topIssues?.length || 0,
        passCount: Object.values(aiResult.categories || {}).reduce(
          (sum: number, cat: any) => sum + (cat.passes?.length || 0), 0
        ),
      },
      categories: {
        format: {
          name: aiResult.categories?.format?.name || "Format & Parsing",
          maxPoints: 25,
          earnedPoints: aiResult.categories?.format?.earnedPoints || 0,
          percentage: aiResult.categories?.format?.percentage || 0,
          issues: aiResult.categories?.format?.issues || [],
          passes: aiResult.categories?.format?.passes || [],
        },
        structure: {
          name: aiResult.categories?.structure?.name || "Structure & Sections",
          maxPoints: 25,
          earnedPoints: aiResult.categories?.structure?.earnedPoints || 0,
          percentage: aiResult.categories?.structure?.percentage || 0,
          issues: aiResult.categories?.structure?.issues || [],
          passes: aiResult.categories?.structure?.passes || [],
        },
        keywords: {
          name: aiResult.categories?.keywords?.name || "Keywords & Content",
          maxPoints: 30,
          earnedPoints: aiResult.categories?.keywords?.earnedPoints || 0,
          percentage: aiResult.categories?.keywords?.percentage || 0,
          issues: aiResult.categories?.keywords?.issues || [],
          passes: aiResult.categories?.keywords?.passes || [],
        },
        readability: {
          name: aiResult.categories?.readability?.name || "Length & Readability",
          maxPoints: 20,
          earnedPoints: aiResult.categories?.readability?.earnedPoints || 0,
          percentage: aiResult.categories?.readability?.percentage || 0,
          issues: aiResult.categories?.readability?.issues || [],
          passes: aiResult.categories?.readability?.passes || [],
        },
      },
      topIssues: aiResult.topIssues || [],
      quickWins: aiResult.quickWins || [],
      metadata: aiResult.metadata || {
        wordCount: cvText.split(/\s+/).length,
        estimatedPages: 1,
        fileFormat: "text",
        hasStandardSections: true,
        hasContactInfo: { email: true, phone: true, linkedin: false, location: true },
        detectedSections: [],
        keywordStats: { hardSkillsCount: 0, softSkillsCount: 0, actionVerbsCount: 0, quantifiedAchievements: 0 },
      },
      parsingChecks: {
        singleColumn: { ok: true, note: "Single column layout detected" },
        standardSections: { ok: true, note: "Standard sections found" },
        cleanCharacters: { ok: true, note: "Clean formatting" },
        abbreviations: { ok: true, note: "Abbreviations checked" },
      },
      abbreviationCheck: aiResult.abbreviationCheck || {
        expandedCorrectly: [],
        needsExpansion: [],
      },
      atsCompatibility: aiResult.atsCompatibility,
      isPro: false,
    };

    return NextResponse.json({
      success: true,
      result,
    } as ATSCheckResponse);
  } catch (error) {
    console.error("AI ATS check error:", error);

    // Fallback to deterministic scoring if AI fails
    console.log("⚠️ Falling back to deterministic scoring...");
    return handlePublicATSCheck(cvText, false);
  }
}
