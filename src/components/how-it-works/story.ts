/*
 * /how-it-works follows one resume (Maya's, the homepage demo) through Rejectly.
 * Scores and check results are not written here: the page runs the real scorer
 * on BEFORE_TEXT and AFTER_TEXT (components/marketing/hero/parserLensRows) at
 * build time. Keywords and rewritten lines match the homepage demo rows; the
 * numbers in the rewrites (8, 12,000) are Maya's answers to the metric questions.
 */

export interface StoryCheck {
  category: string;
  name: string;
  points: number;
  passed: boolean;
}

export interface StoryScores {
  before: number;
  after: number;
  beforeChecks: StoryCheck[];
  stillFailing: string[];
}

export type StepKind = "code" | "ai";

export interface StoryStep {
  key: "read" | "score" | "match" | "rewrite" | "rebuild" | "apply";
  label: string;
  price: { text: string; free?: boolean }[];
  title: string;
  kind: StepKind;
  note: string;
}

export const STEPS: StoryStep[] = [
  { key: "read", label: "Read", price: [{ text: "Free", free: true }], title: "What the ATS reads.", kind: "code", note: "Code. No AI." },
  { key: "score", label: "Score", price: [{ text: "Free", free: true }], title: "19 checks, the same every time.", kind: "code", note: "Code. Same file, same score." },
  { key: "match", label: "Match", price: [{ text: "Free demo", free: true }, { text: "1 credit" }], title: "Your resume against one job post.", kind: "ai", note: "AI, with rules." },
  { key: "rewrite", label: "Rewrite", price: [{ text: "1 credit" }], title: "Your words, in the post's language.", kind: "ai", note: "AI, with rules." },
  { key: "rebuild", label: "Rebuild", price: [{ text: "1 credit" }], title: "One clean column, scored again.", kind: "ai", note: "Rewrite: AI, with rules. Score: code." },
  { key: "apply", label: "Apply", price: [{ text: "With a match" }], title: "The letter and the interview.", kind: "ai", note: "AI, with rules." },
];

export const JOB = "Data Analyst Intern";

/** The post's six keywords and where Maya's original resume has (or lacks) them. */
export const KEYWORDS: { term: string; found: boolean; why: string }[] = [
  { term: "SQL", found: true, why: "Skills" },
  { term: "Python", found: true, why: "Skills, projects" },
  { term: "Tableau", found: true, why: "Experience" },
  { term: "Predictive modeling", found: false, why: "“predicting churn” isn’t the same phrase" },
  { term: "Data visualization", found: false, why: "“made charts” isn’t the same phrase" },
  { term: "A/B testing", found: false, why: "Not on her resume" },
];
export const KEYWORDS_AFTER = "5 / 6";

export const REWRITES: { before: string; ask?: { q: string; a: string }; after: [string, string, string] }[] = [
  {
    before: "Helped the team with weekly reports in Tableau",
    ask: { q: "How big was the team?", a: "8" },
    after: ["Helped build weekly sales reports in Tableau for a team of ", "8", ""],
  },
  {
    before: "Responsible for data entry tasks",
    ask: { q: "About how many records?", a: "12,000" },
    after: ["Handled data entry for ", "12,000", " CRM records"],
  },
  {
    before: "Worked on a group project predicting churn",
    after: ["Group project: built a ", "predictive model", " in Python to flag churners"],
  },
];

export const RULES = [
  "never inflates a role (“Helped”, not “Led”)",
  "never invents a number; it asks you",
  "never adds a skill you don’t have: A/B testing stays missing",
];
