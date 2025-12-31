// ATS (Applicant Tracking System) Compatibility Check Types
// Updated for 2025 ATS standards: Workday, Greenhouse, Lever, Taleo

// Severity levels for ATS issues
export type ATSSeverity = "critical" | "major" | "minor";

// Category types
export type ATSCategory = "format" | "structure" | "keywords" | "readability";

// ATS Platform types
export type ATSPlatform = "workday" | "greenhouse" | "taleo" | "lever";

// ATS Compatibility rating
export type ATSRating = "high" | "medium" | "low";

// Individual ATS Issue
export interface ATSIssue {
  id: string;
  category: ATSCategory;
  severity: ATSSeverity;
  issue: string;
  recommendation: string;
  impact: number; // Points deducted (0-10)
}

// Platform-specific compatibility rating (legacy)
export interface ATSPlatformRating {
  rating: ATSRating;
  reason: string;
}

// Parsing check result (new - focuses on actual ATS parsing)
export interface ParsingCheck {
  ok: boolean;
  note: string;
}

// Parsing compatibility checks
export interface ParsingCompatibility {
  singleColumn: ParsingCheck;
  standardSections: ParsingCheck;
  cleanCharacters: ParsingCheck;
  abbreviations: ParsingCheck;
}

// Abbreviation check result
export interface AbbreviationCheck {
  expandedCorrectly: string[]; // e.g., "AWS (Amazon Web Services)"
  needsExpansion: string[]; // Abbreviations without full form - critical for Greenhouse/Lever
}

// Category Breakdown
export interface ATSCategoryScore {
  name: string;
  maxPoints: number;
  earnedPoints: number;
  percentage: number;
  issues: ATSIssue[];
  passes: string[]; // What the CV does well
}

// Complete ATS Check Result
export interface ATSCheckResult {
  version: string;
  checkedAt: string;

  // Score
  overallScore: number; // 0-100
  scoreLabel: "Excellent" | "Good" | "Needs Improvement" | "Poor";
  scoreColor: string; // Hex color for display

  // Summary
  summary: string; // 2-3 sentence summary

  // FREE - everyone sees this
  freePreview: {
    quickWin: string; // Just 1 teaser
    issueCount: number; // "5 issues found"
    passCount: number; // "3 things done well"
  };

  // PRO - requires credits
  categories: {
    format: ATSCategoryScore;
    structure: ATSCategoryScore;
    keywords: ATSCategoryScore;
    readability: ATSCategoryScore;
  };

  topIssues: ATSIssue[]; // Top 3-5 most impactful issues
  quickWins: string[]; // Easy fixes

  metadata: {
    wordCount: number;
    estimatedPages: number;
    fileFormat: "pdf" | "docx" | "unknown";
    hasStandardSections: boolean;
    hasContactInfo: {
      name?: boolean;
      email: boolean;
      phone: boolean;
      linkedin: boolean;
      location: boolean;
      portfolio?: boolean;
    };
    detectedSections?: string[];
    keywordStats?: {
      hardSkillsCount: number;
      softSkillsCount: number;
      actionVerbsCount: number;
      quantifiedAchievements: number;
    };
  };

  // ATS Parsing Checks - whether ATS can parse this CV correctly
  parsingChecks: ParsingCompatibility;

  // Legacy: Platform-specific ATS compatibility (kept for backwards compat)
  atsCompatibility?: {
    workday: ATSPlatformRating;
    greenhouse: ATSPlatformRating;
    taleo: ATSPlatformRating;
    lever: ATSPlatformRating;
  };

  // Abbreviation expansion check (critical for Greenhouse/Lever)
  abbreviationCheck?: AbbreviationCheck;

  // Unlock status
  isPro: boolean;
}

// API Request/Response Types
export interface ATSCheckRequest {
  documentId?: string; // Check existing CV
  cvText?: string; // Or provide text directly
  unlock?: boolean; // Unlock full report (costs credits)
}

export interface ATSCheckResponse {
  success: boolean;
  result?: ATSCheckResult;
  error?: string;
}

// Helper functions
export function getATSScoreLabel(
  score: number
): "Excellent" | "Good" | "Needs Improvement" | "Poor" {
  if (score >= 80) return "Excellent";
  if (score >= 60) return "Good";
  if (score >= 40) return "Needs Improvement";
  return "Poor";
}

export function getATSScoreColor(score: number): string {
  if (score >= 80) return "#10b981"; // green
  if (score >= 60) return "#f59e0b"; // yellow/amber
  if (score >= 40) return "#f97316"; // orange
  return "#ef4444"; // red
}

export function getATSPassRate(score: number): string {
  // Industry stat: Only 15% pass ATS
  if (score >= 80) return "Top 15% of resumes";
  if (score >= 60) return "Above average";
  if (score >= 40) return "Below average";
  return "High rejection risk";
}

// Category weights (must sum to 100)
export const ATS_CATEGORY_WEIGHTS = {
  format: 25,
  structure: 25,
  keywords: 30,
  readability: 20,
} as const;

// ATS Optimization Types
export interface ATSOptimizationChange {
  category: "format" | "structure" | "keywords" | "readability" | "content";
  issue: string;
  fix: string;
  impact: "high" | "medium" | "low";
}

export interface ATSOptimizationResult {
  success: boolean;
  pdfUrl: string;
  beforeScore: number;
  afterScore: number;
  improvement: number;
  changes: ATSOptimizationChange[];
  optimizedCVId: string;
}

export interface ATSOptimizeRequest {
  documentId: string;
}

export interface ATSOptimizeResponse {
  success: boolean;
  result?: ATSOptimizationResult;
  error?: string;
}
