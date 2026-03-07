/**
 * ATS Scoring Utilities
 * Helper functions for ATS score presentation and analysis
 */

export interface CategoryScore {
  earnedPoints: number;
  maxPoints: number;
  percentage: number;
}

export interface ScoreAnalysis {
  score: number;
  label: string;
  color: string;
  percentile: string;
  percentileMessage: string;
  maxPotential: number;
  easyWinsPoints: number;
}

/**
 * Calculate percentile based on score
 * Distribution based on realistic ATS score patterns:
 * - Top 5%: 85-100
 * - Top 20%: 70-84
 * - Top 50%: 55-69
 * - Bottom 50%: <55
 */
export function getPercentile(score: number): string {
  if (score >= 85) return "Top 5%";
  if (score >= 75) return "Top 10%";
  if (score >= 65) return "Top 20%";
  if (score >= 55) return "Top 35%";
  if (score >= 45) return "Top 50%";
  if (score >= 35) return "Below Average";
  return "Bottom 25%";
}

/**
 * Get percentile message for user
 */
export function getPercentileMessage(score: number): string {
  const percentile = getPercentile(score);

  if (score >= 85) return `Better than 95% of resumes`;
  if (score >= 75) return `Better than 90% of resumes`;
  if (score >= 65) return `Better than 80% of resumes`;
  if (score >= 55) return `Better than 65% of resumes`;
  if (score >= 45) return `Better than 50% of resumes`;
  if (score >= 35) return `In the middle 50%`;
  return `Below 75% of resumes`;
}

/**
 * Calculate maximum achievable score based on categories
 */
export function calculateMaxPotential(
  categories: Record<string, CategoryScore>
): number {
  let totalMax = 0;
  let totalEarned = 0;
  let easyWinsPotential = 0;

  Object.values(categories).forEach((category) => {
    totalMax += category.maxPoints;
    totalEarned += category.earnedPoints;

    // Calculate easy wins: if category is at < 80%, there's room for improvement
    const percentage = (category.earnedPoints / category.maxPoints) * 100;
    if (percentage < 80) {
      // Assume we can realistically improve by 50% of the gap
      const gap = category.maxPoints - category.earnedPoints;
      easyWinsPotential += gap * 0.5;
    }
  });

  const maxRealistic = Math.min(100, totalEarned + easyWinsPotential);
  return Math.round(maxRealistic);
}

/**
 * Calculate quick improvement points
 * These are the easiest 5-10 minute fixes
 */
export function calculateEasyWinsPoints(
  categories: Record<string, CategoryScore>
): number {
  let easyPoints = 0;

  Object.values(categories).forEach((category) => {
    const percentage = (category.earnedPoints / category.maxPoints) * 100;

    // If category is significantly below max, there are likely easy fixes
    if (percentage < 60) {
      // Assume 20% of gap is easy wins
      const gap = category.maxPoints - category.earnedPoints;
      easyPoints += gap * 0.2;
    } else if (percentage < 80) {
      // Smaller gaps have fewer easy wins
      const gap = category.maxPoints - category.earnedPoints;
      easyPoints += gap * 0.1;
    }
  });

  return Math.round(easyPoints);
}

/**
 * Get comprehensive score analysis
 */
export function analyzeScore(
  score: number,
  categories: Record<string, CategoryScore>
): ScoreAnalysis {
  const label = getScoreLabel(score);
  const color = getScoreColor(score);
  const percentile = getPercentile(score);
  const percentileMessage = getPercentileMessage(score);
  const maxPotential = calculateMaxPotential(categories);
  const easyWinsPoints = calculateEasyWinsPoints(categories);

  return {
    score,
    label,
    color,
    percentile,
    percentileMessage,
    maxPotential,
    easyWinsPoints,
  };
}

/**
 * Get score label
 */
export function getScoreLabel(score: number): string {
  if (score >= 85) return "Excellent";
  if (score >= 70) return "Good";
  if (score >= 55) return "Fair";
  if (score >= 40) return "Needs Work";
  return "Critical";
}

/**
 * Get score color
 */
export function getScoreColor(score: number): string {
  if (score >= 75) return "#10b981"; // green
  if (score >= 60) return "#22c55e"; // light green
  if (score >= 45) return "#f59e0b"; // yellow/amber
  if (score >= 30) return "#f97316"; // orange
  return "#ef4444"; // red
}

/**
 * Get category impact level
 */
export function getCategoryImpact(
  earnedPoints: number,
  maxPoints: number
): "critical" | "high" | "medium" | "low" {
  const percentage = (earnedPoints / maxPoints) * 100;
  const gap = maxPoints - earnedPoints;

  // Critical: High weight category with big gap
  if (maxPoints >= 25 && percentage < 60) return "critical";

  // High: Big gap in any category
  if (gap >= 8) return "high";

  // Medium: Moderate gap
  if (gap >= 4) return "medium";

  // Low: Small gap
  return "low";
}

/**
 * Get category impact emoji
 */
export function getCategoryImpactEmoji(impact: "critical" | "high" | "medium" | "low"): string {
  switch (impact) {
    case "critical":
      return "🔥";
    case "high":
      return "⚡";
    case "medium":
      return "📌";
    case "low":
      return "✨";
  }
}

/**
 * Generate quick fix suggestions based on category scores
 */
export function generateQuickFixes(
  categories: Record<string, CategoryScore>,
  issues: Array<{ issue: string; category: string; fix?: string }>
): Array<{ fix: string; impact: string; time: string; category: string }> {
  const quickFixes: Array<{ fix: string; impact: string; time: string; category: string }> = [];

  // Analyze each category
  Object.entries(categories).forEach(([key, category]) => {
    const percentage = (category.earnedPoints / category.maxPoints) * 100;
    const gap = category.maxPoints - category.earnedPoints;

    // Category-specific quick fixes
    if (key === "format" && percentage < 80) {
      quickFixes.push({
        fix: "Convert to single-column layout",
        impact: `+${Math.round(gap * 0.3)} points`,
        time: "10 min",
        category: "Format",
      });
    }

    if (key === "structure" && percentage < 80) {
      quickFixes.push({
        fix: "Use standard section headers",
        impact: `+${Math.round(gap * 0.25)} points`,
        time: "5 min",
        category: "Structure",
      });
    }

    if (key === "keywords" && percentage < 80) {
      quickFixes.push({
        fix: "Add 5-10 relevant keywords",
        impact: `+${Math.round(gap * 0.4)} points`,
        time: "15 min",
        category: "Keywords",
      });
    }

    if (key === "readability" && percentage < 80) {
      quickFixes.push({
        fix: "Use bullet points consistently",
        impact: `+${Math.round(gap * 0.2)} points`,
        time: "5 min",
        category: "Readability",
      });
    }
  });

  // Sort by impact (extract numeric value)
  return quickFixes
    .sort((a, b) => {
      const impactA = parseInt(a.impact.match(/\d+/)?.[0] || "0");
      const impactB = parseInt(b.impact.match(/\d+/)?.[0] || "0");
      return impactB - impactA;
    })
    .slice(0, 4); // Top 4 quick fixes
}
