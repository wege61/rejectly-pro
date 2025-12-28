// ATS (Applicant Tracking System) Compatibility Check Types

// Severity levels for ATS issues
export type ATSSeverity = "critical" | "major" | "minor";

// Category types
export type ATSCategory = "format" | "structure" | "keywords" | "readability";

// Individual ATS Issue
export interface ATSIssue {
  id: string;
  category: ATSCategory;
  severity: ATSSeverity;
  issue: string;
  recommendation: string;
  impact: number; // Points deducted (0-10)
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
    hasContactInfo: boolean;
  };

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
