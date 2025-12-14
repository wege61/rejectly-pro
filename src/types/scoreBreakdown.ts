export interface ScoreComponent {
  name: string;
  weight: number;
  maxPoints: number;
  earnedPoints: number;
  percentage: number;
  details: string;
  matchedItems: string[];
  missingItems: string[];
}

export interface Penalty {
  id: string;
  type:
    | "skill_gap"
    | "experience_gap"
    | "industry_gap"
    | "certification_gap"
    | "seniority_mismatch"
    | "overqualified";
  description: string;
  pointsDeducted: number;
  severity: "critical" | "major" | "minor";
  reason: string;
}

export type JobLevel = "entry" | "mid" | "senior";

export type HRVerdict =
  | "would_interview"
  | "maybe_with_reservations"
  | "would_not_interview";

export interface ScoreBreakdown {
  version: string;
  calculatedAt: string;
  jobLevel: JobLevel;

  components: {
    skillsMatch: ScoreComponent;
    experienceMatch: ScoreComponent;
    industryRelevance: ScoreComponent;
    educationCerts: ScoreComponent;
  };

  penalties: Penalty[];
  rawScore: number;
  totalPenalties: number;
  finalScore: number;

  assessment: {
    verdict: HRVerdict;
    percentile: string;
    recommendation: string;
  };

  displayData: {
    scoreColor: string;
    scoreLabel: string;
    primaryGap: string;
  };

  summary: string;
}

// Helper function to get score color
export function getScoreColor(score: number): string {
  if (score >= 75) return "#10b981"; // green
  if (score >= 60) return "#22c55e"; // light green
  if (score >= 45) return "#f59e0b"; // orange
  if (score >= 30) return "#f97316"; // dark orange
  return "#ef4444"; // red
}

// Helper function to get score label
export function getScoreLabel(score: number): string {
  if (score >= 80) return "Excellent Match";
  if (score >= 70) return "Strong Match";
  if (score >= 60) return "Good Match";
  if (score >= 50) return "Moderate Match";
  if (score >= 40) return "Fair Match";
  if (score >= 30) return "Weak Match";
  return "Poor Match";
}

// Helper function to get verdict display text
export function getVerdictText(verdict: HRVerdict): string {
  switch (verdict) {
    case "would_interview":
      return "Would Interview";
    case "maybe_with_reservations":
      return "Maybe with Reservations";
    case "would_not_interview":
      return "Would Not Interview";
  }
}

// Helper function to get verdict color
export function getVerdictColor(verdict: HRVerdict): string {
  switch (verdict) {
    case "would_interview":
      return "#10b981";
    case "maybe_with_reservations":
      return "#f59e0b";
    case "would_not_interview":
      return "#ef4444";
  }
}
