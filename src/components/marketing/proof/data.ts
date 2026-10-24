/*
 * Proof section content. Nothing here is invented:
 * - RULES restate rules from lib/ai/prompts/cvOptimization (never inflate scope,
 *   never invent numbers, never add unmet skills, never use a title the candidate
 *   hasn't held). The "tempting" lines are what an unconstrained AI would write.
 * - CATEGORIES are the scoring categories and checks from lib/ai/prompts/atsCheck,
 *   in plain English. Points per category match the prompt (25 + 25 + 30 + 20).
 *   Length & readability also scores the word count, so it is listed as a check.
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

export interface Category {
  name: string;
  points: number;
  checks: string[];
}

export const CATEGORIES: Category[] = [
  {
    name: "Format & parsing",
    points: 25,
    checks: [
      "Two-column layouts", "Leftover table structures", "Contact details in the header or footer", "Photos and logos",
      "Text boxes and sidebars", "Decorative or script fonts", "Decorative dividers (═══, ★★★)", "Unusual bullet symbols (➤, ◆)",
      "Emoji and special symbols", "ALL CAPS section headings", "Inconsistent spacing", "Margins outside 0.5–1 inch",
      "Scanned PDFs that aren't real text", "Smart quotes instead of straight quotes", "En dashes in dates",
      "Unusual characters in names and titles", "Extra blank lines between sections", "A clean single-column flow",
      "Standard bullets (• or -)", "Consistent indentation", "Clear paragraph breaks", "Standard fonts throughout",
      "Contact details in the main body",
    ],
  },
  {
    name: "Structure & sections",
    points: 25,
    checks: [
      "“Summary”, not “About me”", "“Work Experience”, not “Career journey”", "“Education”, not “Academic background”",
      "“Skills”, not “Toolbox”", "“Certifications”, not “Credentials”", "A contact section at the top", "An experience section",
      "An education section", "A skills section", "A summary right after your contact details", "A clear title for each role",
      "A company name for each role", "A location for each role", "Most recent role first", "One date format throughout",
      "Job title before company", "Dates tied to each role", "No bullets without a parent role", "The same structure for every role",
      "Your name at the very top", "A valid email address", "A phone number", "A LinkedIn URL", "Your city and country",
      "No full home address", "A portfolio or GitHub link (tech roles)",
    ],
  },
  {
    name: "Keywords & content",
    points: 30,
    checks: [
      "How often each key skill appears", "Key skills used 2–3 times in context", "Skills mentioned only once",
      "Skills repeated 5+ times", "Abbreviations spelled out at least once", "A job title in the posting's language",
      "Certification names in full", "Key words in the top third", "A skills list, not a comma dump",
      "Keywords inside your bullets, not just listed", "Key words across several sections", "Present tense for your current role",
      "Past tense for past roles", "Tense variations (only Lever reads them)", "Bullets that start with an action verb",
      "Impact, with numbers where you have them", "Results-focused language", "Industry terms used naturally", "Keyword stuffing",
      "Skills with no context", "Generic phrases (“hard worker”)", "Empty buzzwords (“synergy”)", "Abbreviations with no full form",
    ],
  },
  {
    name: "Length & readability",
    points: 20,
    checks: [
      "Word count (400–650 is ideal)", "Bullets, not a wall of text", "One or two lines per bullet", "White space between sections",
      "No paragraph over three lines", "Name, title and top skills findable in 6 seconds", "Key achievements visible at a glance",
      "Structure obvious at a glance",
    ],
  },
];

export const TOTAL_CHECKS = CATEGORIES.reduce((n, c) => n + c.checks.length, 0);
export const TOTAL_POINTS = CATEGORIES.reduce((n, c) => n + c.points, 0);
