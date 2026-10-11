import { openai, CV_MODEL } from "./client";
import type { GeneratedCVData } from "@/lib/ats/utils";

/**
 * Generates the optimized CV JSON, then checks it against the source material
 * and asks the model to repair it once if numbers were dropped or invented.
 */

const str = { type: "string" };
const nullableStr = { type: ["string", "null"] };
const bullets = { type: "array", items: str };
const obj = (properties: Record<string, unknown>) => ({
  type: "object",
  additionalProperties: false,
  properties,
  required: Object.keys(properties),
});
const nullableList = (item: Record<string, unknown>) => ({ type: ["array", "null"], items: item });

// Strict structured output: the model cannot omit sections or return malformed JSON.
const CV_SCHEMA = obj({
  contact: obj({ name: str, email: str, phone: str, location: str, linkedin: nullableStr, portfolio: nullableStr }),
  summary: str,
  experience: { type: "array", items: obj({ title: str, company: str, location: str, startDate: str, endDate: str, bullets }) },
  projects: nullableList(obj({ name: str, role: nullableStr, url: nullableStr, startDate: str, endDate: str, bullets })),
  education: { type: "array", items: obj({ degree: str, institution: str, location: str, startDate: str, graduationDate: str, details: nullableStr }) },
  skills: obj({ technical: { type: "array", items: str }, soft: { type: "array", items: str } }),
  certifications: nullableList(obj({ name: str, issuer: str, date: str })),
  languages: nullableList(obj({ language: str, proficiency: str })),
  leadership: nullableList(obj({ title: str, organization: str, location: str, startDate: str, endDate: str, bullets })),
  isEntryLevel: { type: "boolean" },
});

/** Numbers as comparable digit strings: "$12M" → "12", "400.000 TL" → "400000", "3,2" → "32". */
function numbersIn(text: string): string[] {
  return (text.match(/\d+(?:[.,]\d+)*/g) || []).map((n) => n.replace(/[.,]/g, ""));
}

// Years, phone fragments and single digits are too noisy to compare.
function isComparable(digits: string): boolean {
  if (digits.length < 2 || digits.length > 7) return false;
  const n = Number(digits);
  return !(n >= 1950 && n <= 2100 && digits.length === 4);
}

function cvBodyText(cv: GeneratedCVData): string {
  // Contact details are excluded: phone numbers and postcodes aren't metrics.
  return JSON.stringify({ ...cv, contact: undefined });
}

// Named tools and products. A model asked to tailor a CV is tempted to add the
// ones the job posting asks for (e.g. "Power BI"), so any of these in the output
// must also appear in the CV, the user's answers or their confirmed tools.
// Only concrete product names: generic concepts ("testing") are too ambiguous.
const KNOWN_TOOLS = [
  "power bi", "tableau", "spss", "sas", "stata", "minitab", "looker", "qlik", "matlab", "alteryx",
  "sap", "oracle", "salesforce", "hubspot", "zendesk", "workday", "quickbooks", "netsuite",
  "jira", "confluence", "asana", "trello", "notion", "figma", "sketch", "photoshop", "illustrator",
  "indesign", "autocad", "solidworks", "catia", "revit", "primavera",
  "react", "angular", "vue", "next.js", "node.js", "django", "flask", "spring boot", "laravel",
  "docker", "kubernetes", "terraform", "jenkins", "aws", "azure", "google cloud", "gcp",
  "postgresql", "mysql", "mongodb", "redis", "snowflake", "databricks", "bigquery", "airflow",
  "spark", "hadoop", "tensorflow", "pytorch", "scikit-learn", "pandas", "numpy",
  "typescript", "javascript", "python", "java", "c#", "golang", "rust", "kotlin", "swift", "php",
  "google analytics", "ga4", "google ads", "meta ads", "semrush", "ahrefs",
];

function mentions(text: string, tool: string): boolean {
  const escaped = tool.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return new RegExp(`(?<![\\p{L}\\p{N}])${escaped}(?![\\p{L}\\p{N}])`, "iu").test(text);
}

export interface GroundingIssues {
  /** Numbers in the original CV that the output lost. */
  missing: string[];
  /** Numbers in the output that no source mentions. */
  invented: string[];
  /** Named tools in the output that no source mentions. */
  inventedTools: string[];
}

export function findGroundingIssues(cvText: string, otherSources: string[], cv: GeneratedCVData): GroundingIssues {
  const contact = [cv.contact?.phone, cv.contact?.email, cv.contact?.linkedin, cv.contact?.portfolio].join(" ");
  const contactNumbers = new Set(numbersIn(contact));
  const outputNumbers = new Set(numbersIn(cvBodyText(cv)));
  const sourceNumbers = new Set(numbersIn([cvText, ...otherSources].join(" ")));

  const original = [...new Set(numbersIn(cvText))].filter((n) => isComparable(n) && !contactNumbers.has(n));
  const missing = original.filter((n) => !outputNumbers.has(n));
  const invented = [...outputNumbers].filter((n) => isComparable(n) && !sourceNumbers.has(n));

  const body = cvBodyText(cv);
  const sources = [cvText, ...otherSources].join("\n");
  const inventedTools = KNOWN_TOOLS.filter((tool) => mentions(body, tool) && !mentions(sources, tool));
  return { missing, invented, inventedTools };
}

// Strict mode returns null for absent optional fields; the rest of the app expects them absent.
const dropNulls = (_key: string, value: unknown) => (value === null ? undefined : value);

export async function generateOptimizedCV(params: {
  prompt: string;
  outputLanguage: string;
  cvText: string;
  /** Job postings and user answers: numbers from these are legitimate too. */
  otherSources: string[];
}): Promise<{ cv: GeneratedCVData; issues: GroundingIssues; repaired: boolean }> {
  const messages: Array<{ role: "system" | "user" | "assistant"; content: string }> = [
    {
      role: "system",
      content: `You are an expert CV writer. Write every text value of the CV in ${params.outputLanguage}. JSON keys stay in English.`,
    },
    { role: "user", content: params.prompt },
  ];

  const complete = async () => {
    const completion = await openai.chat.completions.create({
      model: CV_MODEL,
      messages,
      temperature: 0.4,
      max_completion_tokens: 8000,
      response_format: { type: "json_schema", json_schema: { name: "optimized_cv", strict: true, schema: CV_SCHEMA } },
    });
    const content = completion.choices[0].message.content || "{}";
    return { content, cv: JSON.parse(content, dropNulls) as GeneratedCVData };
  };

  const first = await complete();
  const issues = findGroundingIssues(params.cvText, params.otherSources, first.cv);
  const count = (i: GroundingIssues) => i.missing.length + i.invented.length + i.inventedTools.length;
  if (count(issues) === 0) {
    return { cv: first.cv, issues, repaired: false };
  }

  console.log("[optimizedCV] Grounding issues, asking for a repair:", issues);
  const problems = [
    issues.missing.length > 0 &&
      `These numbers from the original CV are missing from your CV: ${issues.missing.join(", ")}. Find the original bullets that contain them and restore those facts (keep their exact wording of the numbers and units).`,
    issues.invented.length > 0 &&
      `These numbers appear in your CV but in none of the inputs: ${issues.invented.join(", ")}. Remove them (rewrite the sentence without the number) unless they are a direct, exact restatement of an input fact.`,
    issues.inventedTools.length > 0 &&
      `These tools appear in your CV but the candidate never mentioned them: ${issues.inventedTools.join(", ")}. Remove them from the skills list and every sentence (the job posting asking for a tool is not evidence the candidate used it).`,
  ].filter(Boolean).join("\n");

  messages.push(
    { role: "assistant", content: first.content },
    { role: "user", content: `${problems}\nReturn the full corrected CV JSON. Change nothing else.` },
  );

  try {
    const second = await complete();
    const remaining = findGroundingIssues(params.cvText, params.otherSources, second.cv);
    // Keep whichever version has fewer problems.
    if (count(remaining) <= count(issues)) {
      return { cv: second.cv, issues: remaining, repaired: true };
    }
  } catch (err) {
    console.log("[optimizedCV] Repair pass failed, keeping first version:", err);
  }
  return { cv: first.cv, issues, repaired: false };
}
