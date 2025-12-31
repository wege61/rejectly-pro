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

export async function POST(request: NextRequest) {
  console.log("\n\n🔍 ATS CHECK ENDPOINT CALLED 🔍\n\n");

  try {
    // 1. Parse request first
    const body: ATSCheckRequest = await request.json();
    const { documentId, cvText, unlock = false } = body;

    console.log("📋 ATS Check Request:", {
      documentId,
      hasCvText: !!cvText,
      unlock,
    });

    if (!documentId && !cvText) {
      return NextResponse.json(
        { error: "Either documentId or cvText is required" },
        { status: 400 }
      );
    }

    // 2. Public access for cvText-only requests (no auth required)
    if (!documentId && cvText) {
      console.log("🌐 Public ATS check (no auth required)");
      return handlePublicATSCheck(cvText);
    }

    // 3. Authenticated access for documentId requests
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 4. Get CV text from document
    let textToAnalyze: string = "";

    if (documentId) {
      console.log("🔍 Looking for document:", {
        documentId,
        userId: user.id,
        type: "cv"
      });

      // First, check if document exists at all (without user filter)
      const { data: anyDoc, error: anyError } = await supabase
        .from("documents")
        .select("id, user_id, type")
        .eq("id", documentId)
        .single();

      console.log("🔎 Document lookup (no user filter):", { anyDoc, anyError });

      const { data: doc, error: docError } = await supabase
        .from("documents")
        .select("text, ats_score, ats_breakdown, ats_unlocked")
        .eq("id", documentId)
        .eq("user_id", user.id)
        .eq("type", "cv")
        .single();

      if (docError || !doc) {
        console.error("❌ Document not found:", {
          error: docError,
          documentId,
          userId: user.id,
          docExistsWithoutFilter: !!anyDoc,
          docUserId: anyDoc?.user_id,
          docType: anyDoc?.type
        });
        return NextResponse.json({ error: "CV not found" }, { status: 404 });
      }

      console.log("✅ Document found:", { hasText: !!doc.text, textLength: doc.text?.length });

      textToAnalyze = doc.text;

      // Check if we have cached results
      if (doc.ats_breakdown && !unlock) {
        console.log("✅ Returning cached ATS result");
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

      // If unlocking, check if already unlocked
      if (unlock && doc.ats_unlocked && doc.ats_breakdown) {
        console.log("✅ Already unlocked, returning full result");
        return NextResponse.json({
          success: true,
          result: doc.ats_breakdown as ATSCheckResult,
        } as ATSCheckResponse);
      }

      // If unlocking, check credits
      if (unlock && !doc.ats_unlocked) {
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
      isPro: unlock,
    };

    console.log("📊 ATS Score:", result.overallScore, result.scoreLabel);

    // 6. Save to database (if documentId provided)
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
        console.error("Failed to save ATS result:", updateError);
        // Don't fail the request, just log
      } else {
        console.log("✅ ATS result saved to database");
      }
    }

    // 7. Return response (free or full based on unlock)
    if (!unlock) {
      const freeResult = createFreePreview(result);
      return NextResponse.json({
        success: true,
        result: freeResult,
      } as ATSCheckResponse);
    }

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
async function handlePublicATSCheck(cvText: string) {
  try {
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
