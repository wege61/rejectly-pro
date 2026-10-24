/** Shape returned by POST /api/demo/analyze. */
export interface MatchResult {
  fitScore: number;
  potentialScore: number;
  summary: string;
  jobTitle: string;
  matchedKeywords: string[];
  /** foundAs is a verified quote from the resume, or null when the resume doesn't show it. */
  missingDetails: { keyword: string; foundAs: string | null }[];
  quickWins: string[];
  improvementTips: string[];
}

/*
 * "Use Maya's example": the same candidate the hero and the "Why it happens"
 * section follow, so the story carries straight into the live check.
 */
export const MAYA_RESUME = `MAYA CHEN
Student

EXPERIENCE                 CONTACT
Halden Analytics · Intern  maya.chen@mail.com
• Helped the team with weekly reports in Tableau
• Responsible for data entry tasks
• Attended client meetings

PROJECTS                   SKILLS
• Worked on a group project predicting churn   SQL
• Used Python and made charts for class        Excel

EDUCATION
Economics, Lakeside University`;

export const MAYA_JOB = `Junior Data Analyst — Northfield

We're looking for a junior analyst to join our growth team.

Requirements
• SQL and Tableau
• Python for analysis
• Predictive modeling (churn, retention)
• Data visualization for stakeholders
• A/B testing experience is a plus`;
