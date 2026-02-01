import { GeneratedCV } from "@/types/cv";
import { ScoreBreakdown } from "@/types/scoreBreakdown";

// Score range classification
export type ScoreRange = "low" | "medium" | "high";

// User state based on report status
export type UserState = "free" | "pro_pending" | "pro_optimized";

// Severity levels for improvements
export type Severity = "critical" | "important" | "minor";

// Role recommendation
export interface RoleRecommendation {
  title: string;
  fit: number;
  description?: string;
}

// Improvement item from CV optimization
export interface Improvement {
  category: string;
  action: string;
  impact: number;
  reason: string;
  section?: string;
  problem?: string;
  before?: string;
  after?: string;
  severity?: Severity;
}

// Fake skill recommendation for learning paths
export interface FakeSkillRecommendation {
  skill: string;
  category: string;
  learningPath: string[];
  projectIdeas: string[];
  estimatedTime: string;
}

// Main report interface
export interface Report {
  id: string;
  user_id: string;
  cv_id: string;
  job_ids: string[];
  fit_score: number;
  summary_free: string;
  summary_pro: {
    rewrittenBullets?: string[];
    roleRecommendations?: RoleRecommendation[];
    atsFlags?: string[];
  } | null;
  keywords: {
    missing?: string[];
  } | null;
  sample_rewrite: {
    original: string;
    rewritten: string;
  } | null;
  sample_role: {
    title: string;
    fit: number;
    description: string;
  } | null;
  role_fit: RoleRecommendation[] | null;
  ats_flags: string[] | null;
  pro: boolean;
  generated_cv: GeneratedCV | null;
  optimized_score: number | null;
  improvement_breakdown: Improvement[] | null;
  fake_skills_recommendations: FakeSkillRecommendation[] | null;
  fake_it_mode: boolean;
  score_breakdown: ScoreBreakdown | null;
  optimized_score_breakdown: ScoreBreakdown | null;
  ats_score_optimized: number | null;
  ats_breakdown_optimized: any | null;
  created_at: string;
}

// User credits info
export interface UserCredits {
  credits: number;
  hasSubscription: boolean;
  canAnalyze: boolean;
}

// Visible sections configuration
export interface VisibleSections {
  showScoreComparison: boolean;
  showProblemSummary: boolean;
  showImprovementBreakdown: boolean;
  showRoleRecommendations: boolean;
  showUpgradePrompt: boolean;
  showSuccess: boolean;
  showActionCards: boolean;
  showSampleContent: boolean;
  showFullContent: boolean;
  showGenerateCTA: boolean;
  showCareerInsight: boolean;
  showPerfectMatch: boolean; // For high-score users where no improvements are needed
}

// Score message configuration
export interface ScoreMessage {
  title: string;
  subtitle?: string;
  cta?: string;
  highlight?: string;
  variant?: "success" | "warning" | "danger";
}

// Problem stats for summary
export interface ProblemStats {
  critical: { count: number; impact: number };
  important: { count: number; impact: number };
  minor: { count: number; impact: number };
  totalImpact: number;
}
