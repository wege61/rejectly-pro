/*
 * Proof section content. Nothing here is invented:
 * - RULES restate rules from lib/ai/prompts/cvOptimization (never inflate scope,
 *   never invent numbers, never add unmet skills, never use a title the candidate
 *   hasn't held). The "tempting" lines are what an unconstrained AI would write.
 * - CATEGORIES are the checks the ATS score actually runs (lib/ats/deterministicScoring,
 *   FORMAT/STRUCTURE/KEYWORDS/READABILITY_CRITERIA), in plain English, with the
 *   points each one is worth. If a check or its points change there, change it here.
 */

export interface Rule {
  title: string;
  source: string;
  tempting: string;
  honest: string;
  /** Optional note shown after the honest line. */
  note?: string;
}

export const RULES: Rule[] = [
  {
    title: "Never inflates your role.",
    source: "“Helped the team with weekly reports”",
    tempting: "Led the team's weekly reporting",
    honest: "Helped build the team's weekly reports in Tableau",
  },
  {
    title: "Never invents a number.",
    source: "“Responsible for data entry tasks”",
    tempting: "Improved data accuracy by 40%",
    honest: "Handled data entry for 12,000 CRM records",
    note: "(the number you gave)",
  },
  {
    title: "Never adds a skill you don't have.",
    source: "The post asks for A/B testing",
    tempting: "Ran A/B tests on campaign emails",
    honest: "A/B testing stays unmet and goes on your career plan",
  },
  {
    title: "Never gives you a title you haven't held.",
    source: "Economics graduate, applying as a Data Analyst",
    tempting: "Data Analyst",
    honest: "Economics graduate · Data Analyst Intern",
  },
];

export interface Check {
  label: string;
  points: number;
}

export interface Category {
  name: string;
  points: number;
  checks: Check[];
}

const c = (label: string, points: number): Check => ({ label, points });

export const CATEGORIES: Category[] = [
  {
    name: "Format & parsing",
    points: 35,
    checks: [
      c("A single-column layout", 10),
      c("No table-like rows (| repeated down the page)", 8),
      c("Contact details the ATS can read, not only in a header or footer", 7),
      c("Standard bullets (• or -)", 4),
      c("Clean characters, no emoji or odd symbols", 3),
      c("Simple section dividers, no ═══ or ★★★", 3),
    ],
  },
  {
    name: "Structure & sections",
    points: 35,
    checks: [
      c("An experience section", 10),
      c("An education section", 8),
      c("A skills section", 8),
      c("An email address", 3),
      c("A phone number", 3),
      c("A LinkedIn URL", 2),
      c("A summary", 1),
    ],
  },
  {
    name: "Content",
    points: 20,
    checks: [
      c("Numbers in your achievements", 10),
      c("One date format throughout", 6),
      c("Skills the ATS can pick out", 4),
    ],
  },
  {
    name: "Readability",
    points: 10,
    checks: [
      c("A reasonable length", 4),
      c("Clear breaks between sections", 3),
      c("Bullets, not paragraphs", 3),
    ],
  },
];

export const TOTAL_CHECKS = CATEGORIES.reduce((n, c) => n + c.checks.length, 0);
export const TOTAL_POINTS = CATEGORIES.reduce((n, c) => n + c.points, 0);
