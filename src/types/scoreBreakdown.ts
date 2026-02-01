// Score Component - Detailed breakdown of each scoring category
export interface ScoreComponent {
  name: string;
  weight?: number;
  maxPoints: number;
  earnedPoints: number;
  percentage: number;
  details: string | {
    requiredSkillsTotal?: number;
    requiredSkillsMatched?: number;
    preferredSkillsTotal?: number;
    preferredSkillsMatched?: number;
    yearsRequired?: number;
    yearsCandidate?: number;
    yearsGap?: number;
    yearsScore?: number;
    seniorityRequired?: string;
    seniorityCandidate?: string;
    seniorityScore?: number;
    industryMatch?: string;
    industryScore?: number;
    domainExperience?: string;
    domainScore?: number;
    educationMatch?: string;
    educationScore?: number;
    certMatch?: string;
    certScore?: number;
  };
  matchedItems?: string[];
  missingItems?: string[];
  matchedSkills?: Array<{skill: string; evidence: string; credit: number}>;
  missingSkills?: Array<{skill: string; required: boolean}>;
  requirementsMet?: string[];
  requirementsNotMet?: string[];
}

// Penalty definition
export interface Penalty {
  id: string;
  type?: string;
  condition?: string;
  description?: string;
  pointsDeducted?: number;
  deduction?: number;
  severity: "critical" | "major" | "minor" | "CRITICAL" | "MAJOR" | "MINOR";
  reason?: string;
  applied?: boolean;
}

// Job levels
export type JobLevel = "entry" | "mid" | "senior" | "junior" | "lead" | "manager";

// HR Verdicts - Extended to support new prompt format
export type HRVerdict =
  | "would_interview"
  | "lean_interview"
  | "maybe_with_reservations"
  | "likely_reject"
  | "would_not_interview";

// Job Analysis - New in v2
export interface JobAnalysis {
  detectedLevel: JobLevel;
  requiredYears: number;
  industry: string;
  requiredSkillsCount: number;
  preferredSkillsCount: number;
  hasCertRequirement: boolean;
  hasEducationRequirement: boolean;
}

// Candidate Analysis - New in v2
export interface CandidateAnalysis {
  detectedLevel: JobLevel;
  relevantYears: number;
  totalYears: number;
  industry: string;
  hasRequiredEducation: boolean;
  hasRequiredCerts: boolean;
}

// Score Breakdown - Supports both v1 and v2 formats
export interface ScoreBreakdown {
  version: string;
  calculatedAt: string;

  // V1 format
  jobLevel?: JobLevel;

  // V2 format
  jobAnalysis?: JobAnalysis;
  candidateAnalysis?: CandidateAnalysis;

  // Components - supports both naming conventions
  components: {
    // V1 names (backwards compatible)
    skillsMatch?: ScoreComponent;
    experienceMatch?: ScoreComponent;
    industryRelevance?: ScoreComponent;
    educationCerts?: ScoreComponent;
    // V2 names
    hardSkills?: ScoreComponent;
    experienceLevel?: ScoreComponent;
    industryDomain?: ScoreComponent;
    roleSpecific?: ScoreComponent;
  };

  penalties: Penalty[];

  // V1 format (direct fields)
  rawScore?: number;
  totalPenalties?: number;
  finalScore: number;

  // V2 format (nested in calculation)
  calculation?: {
    rawScore: number;
    totalPenalties: number;
    finalScore: number;
  };

  assessment: {
    verdict: HRVerdict;
    percentile: string;
    recommendation: string;
    topStrengths?: string[];
    criticalGaps?: string[];
  };

  displayData: {
    scoreColor: string;
    scoreLabel: string;
    primaryGap: string;
  };

  summary: string;
}

// Helper function to normalize ScoreBreakdown from either format
export function normalizeScoreBreakdown(raw: ScoreBreakdown): ScoreBreakdown {
  // If calculation exists, flatten it
  if (raw.calculation) {
    raw.rawScore = raw.calculation.rawScore;
    raw.totalPenalties = raw.calculation.totalPenalties;
    raw.finalScore = raw.calculation.finalScore;
  }

  // Helper to normalize component arrays
  const normalizeComponentArrays = (comp: ScoreComponent | undefined) => {
    if (!comp) return;
    
    // Map matchedSkills -> matchedItems
    if (comp.matchedSkills && (!comp.matchedItems || comp.matchedItems.length === 0)) {
      comp.matchedItems = comp.matchedSkills.map(s => `${s.skill}${s.credit < 1 ? ' (Low Evidence)' : ''}`);
    }
    
    // Map missingSkills -> missingItems
    if (comp.missingSkills && (!comp.missingItems || comp.missingItems.length === 0)) {
      comp.missingItems = comp.missingSkills.map(s => s.skill);
    }

    // Map requirementsMet -> matchedItems
    if (comp.requirementsMet && (!comp.matchedItems || comp.matchedItems.length === 0)) {
      comp.matchedItems = comp.requirementsMet;
    }

    // Map requirementsNotMet -> missingItems
    if (comp.requirementsNotMet && (!comp.missingItems || comp.missingItems.length === 0)) {
      comp.missingItems = comp.requirementsNotMet;
    }

    // Infer weight from maxPoints if missing (V2 convention)
    if (comp.weight === undefined && comp.maxPoints !== undefined) {
      comp.weight = comp.maxPoints;
    }
  };

  // Normalize component names if V2 format
  if (raw.components.hardSkills && !raw.components.skillsMatch) {
    raw.components.skillsMatch = raw.components.hardSkills;
  }
  if (raw.components.experienceLevel && !raw.components.experienceMatch) {
    raw.components.experienceMatch = raw.components.experienceLevel;
  }
  if (raw.components.industryDomain && !raw.components.industryRelevance) {
    raw.components.industryRelevance = raw.components.industryDomain;
  }
  // Role specific is usually mapped to "educationCerts" or similar in some systems, 
  // but looking at ScoreBreakdownModal it uses industryRelevance, etc.
  // Wait, I missed roleSpecific in line 105 of the interface, it was just added.
  // But ScoreBreakdownModal uses:
  // breakdown.components.skillsMatch,
  // breakdown.components.experienceMatch,
  // breakdown.components.industryRelevance,
  // breakdown.components.educationCerts,
  
  // So we need to ensure educationCerts is populated too if we have V2 data.
  if (raw.components.educationCerts) {
      // V1 or hybrid
  } else if (raw.components.educationCerts === undefined) {
      // Logic for mapping education/certs from V2?
      // V2 has "educationCerts" already in the interface (line 415 in scoring.ts)
      // So it should be fine if the prompt generates it.
  }

  // Normalize arrays for all components present
  normalizeComponentArrays(raw.components.skillsMatch);
  normalizeComponentArrays(raw.components.experienceMatch);
  normalizeComponentArrays(raw.components.industryRelevance);
  normalizeComponentArrays(raw.components.educationCerts);
  normalizeComponentArrays(raw.components.hardSkills);
  normalizeComponentArrays(raw.components.experienceLevel);
  normalizeComponentArrays(raw.components.industryDomain);
  normalizeComponentArrays(raw.components.roleSpecific);


  // Normalize job level
  if (raw.jobAnalysis && !raw.jobLevel) {
    const level = raw.jobAnalysis.detectedLevel;
    if (level === 'junior') raw.jobLevel = 'entry';
    else if (level === 'lead' || level === 'manager') raw.jobLevel = 'senior';
    else raw.jobLevel = level as JobLevel;
  }

  return raw;
}

// Helper function to get score color
export function getScoreColor(score: number): string {
  if (score >= 70) return "#10b981"; // green - excellent
  if (score >= 55) return "#22c55e"; // light green - strong
  if (score >= 40) return "#f59e0b"; // orange - moderate
  if (score >= 25) return "#f97316"; // dark orange - weak
  return "#ef4444"; // red - poor
}

// Helper function to get score label
export function getScoreLabel(score: number): string {
  if (score >= 70) return "Excellent Match";
  if (score >= 55) return "Strong Match";
  if (score >= 40) return "Good Match";
  if (score >= 25) return "Moderate Match";
  return "Poor Match";
}

// Helper function to get verdict display text
export function getVerdictText(verdict: HRVerdict): string {
  switch (verdict) {
    case "would_interview":
      return "Would Interview";
    case "lean_interview":
      return "Leaning Interview";
    case "maybe_with_reservations":
      return "Maybe with Reservations";
    case "likely_reject":
      return "Likely Reject";
    case "would_not_interview":
      return "Would Not Interview";
  }
}

// Helper function to get verdict color
export function getVerdictColor(verdict: HRVerdict): string {
  switch (verdict) {
    case "would_interview":
      return "#10b981";
    case "lean_interview":
      return "#22c55e";
    case "maybe_with_reservations":
      return "#f59e0b";
    case "likely_reject":
      return "#f97316";
    case "would_not_interview":
      return "#ef4444";
  }
}
