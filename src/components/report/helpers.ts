import {
  ScoreRange,
  UserState,
  Report,
  Improvement,
  VisibleSections,
  ProblemStats,
  Severity,
} from "./types";
import { SCORE_THRESHOLDS, SCORE_MESSAGES, SEVERITY_CONFIG } from "./constants";

/**
 * Determine score range based on numeric score
 */
export const getScoreRange = (score: number): ScoreRange => {
  if (score <= SCORE_THRESHOLDS.LOW_MAX) return "low";
  if (score <= SCORE_THRESHOLDS.MEDIUM_MAX) return "medium";
  return "high";
};

/**
 * Determine user state based on report status
 */
export const getUserState = (report: Report): UserState => {
  if (!report.pro) return "free";
  if (!report.generated_cv) return "pro_pending";
  return "pro_optimized";
};

/**
 * Get score message configuration based on score range and user state
 */
export const getScoreMessage = (scoreRange: ScoreRange, userState: UserState) => {
  return SCORE_MESSAGES[scoreRange][userState];
};

/**
 * Determine which sections should be visible based on score range and user state
 */
export const getVisibleSections = (
  scoreRange: ScoreRange,
  userState: UserState,
  hasImprovements: boolean,
  hasOptimizedScore: boolean
): VisibleSections => {
  const isFree = userState === "free";
  const isProPending = userState === "pro_pending";
  const isProOptimized = userState === "pro_optimized";
  const isHighScore = scoreRange === "high";

  // Perfect match: pro optimized user with high score but no improvements made
  // This happens when the original CV was already excellent (e.g., 90-100% score)
  const isPerfectMatch = isProOptimized && isHighScore && !hasOptimizedScore;

  return {
    // Score comparison: only when optimized and score improved
    showScoreComparison: isProOptimized && hasOptimizedScore,

    // Problem summary: only when optimized with improvements
    showProblemSummary: isProOptimized && hasImprovements && hasOptimizedScore,

    // Improvement breakdown (chart): only when optimized with improvements
    showImprovementBreakdown: isProOptimized && hasImprovements && hasOptimizedScore,

    // Role recommendations: always for pro, highlighted for low scores
    showRoleRecommendations: !isFree,

    // Upgrade prompt: only for free users
    showUpgradePrompt: isFree,

    // Success message: only for optimized pro users
    showSuccess: isProOptimized,

    // Action cards (download, cover letter): only for optimized pro users
    showActionCards: isProOptimized,

    // Sample content (blurred): only for free users
    showSampleContent: isFree,

    // Full content: only for pro users
    showFullContent: !isFree,

    // Generate CTA: only for pro users without generated CV
    showGenerateCTA: isProPending,

    // Career insight (alternative roles): low score pro users
    showCareerInsight: scoreRange === "low" && !isFree,

    // Perfect match: show special card for high-score users with no improvements needed
    showPerfectMatch: isPerfectMatch,
  };
};

/**
 * Calculate problem statistics from improvements
 */
export const getProblemStats = (improvements: Improvement[]): ProblemStats => {
  const stats: ProblemStats = {
    critical: { count: 0, impact: 0 },
    important: { count: 0, impact: 0 },
    minor: { count: 0, impact: 0 },
    totalImpact: 0,
  };

  improvements.forEach((improvement) => {
    const severity = improvement.severity || "minor";
    stats[severity].count++;
    stats[severity].impact += improvement.impact;
    stats.totalImpact += improvement.impact;
  });

  return stats;
};

/**
 * Get severity configuration
 */
export const getSeverityInfo = (severity?: Severity) => {
  const key = severity || "minor";
  return SEVERITY_CONFIG[key];
};

/**
 * Get score label based on numeric score
 */
export const getScoreLabel = (score: number): string => {
  if (score >= 75) return "Excellent Match";
  if (score >= 60) return "Strong Match";
  if (score >= 45) return "Good Match";
  return "Needs Improvement";
};

/**
 * Format impact percentage
 */
export const formatImpact = (impact: number): string => {
  return `+${Math.round(impact * 10) / 10}%`;
};

/**
 * Check if report has meaningful improvements
 */
export const hasSignificantImprovements = (
  improvements: Improvement[] | null,
  optimizedScore: number | null,
  originalScore: number
): boolean => {
  if (!improvements || improvements.length === 0) return false;
  if (optimizedScore === null) return false;
  return optimizedScore > originalScore;
};
