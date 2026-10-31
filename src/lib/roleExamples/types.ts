import type { GeneratedCV } from "@/types/cv";

/*
 * One /resume/[role] page: a fictional new grad's first resume (a typical
 * two-column template, with the mistakes students really make) and the one they
 * sent after (a resume our builder produces). Scores and the list of changes
 * come from the real scorer at build time (lib/roleExamples/score.ts); nothing
 * here states a score.
 */

/** Where a change shows on the "before" resume. Matches CHANGE_COPY keys. */
export type Pin = "columns" | "contact" | "headings" | "numbers" | "bullets" | "structure" | "length" | "breaks" | "dividers" | "skills";

export interface BeforeSidebarBlock {
  heading: string;
  pin?: Pin;
  lines?: string[];
  /** Links shown only as icons: nothing of them reaches the text. */
  icons?: string[];
  /** Skill bars: only the label survives as text. */
  bars?: { label: string; level: number }[];
  /** A chart drawn as a picture: nothing of it survives as text. */
  chart?: { label: string; value: number }[];
}

export interface BeforeEntry {
  title: string;
  sub?: string;
  /** Rendered with decorative arrows, as a template would. */
  bullets?: string[];
  /** A table: a parser reads its cells across, with wide gaps between them. */
  table?: string[][];
  pin?: Pin;
}

export interface BeforeMainBlock {
  heading: string;
  pin?: Pin;
  text?: string;
  /** Keywords in white text: invisible on the page, plain as day in the ATS's text. */
  hidden?: string;
  entries?: BeforeEntry[];
}

export interface BeforeDoc {
  name: string;
  tagline: string;
  /** How the template looks: sidebar color, accent, the symbol before headings, a photo. */
  look?: { side?: string; accent?: string; mark?: string; photo?: boolean };
  sidebar: BeforeSidebarBlock[];
  main: BeforeMainBlock[];
}

export interface Mistake {
  title: string;
  text: string;
  /** check: the free scan checks it · see: visible in the ATS view above · practice: advice we don't measure */
  tag: "check" | "see" | "practice";
}

export interface Rewrite {
  before: string;
  /** "{n}" marks the number the person supplied; `answers` fills them in order. */
  after: string;
  answers: string[];
}

export interface RoleExample {
  /** Job title, as in "Software Engineer". */
  title: string;
  metaTitle: string;
  metaDescription: string;
  hero: { headline: [string, string, string]; sub: string };
  /** The fictional person; `pronoun` is how the page refers to them. */
  person: { first: string; pronoun: "he" | "she" | "they"; detail: string };
  before: BeforeDoc;
  /** The "after" resume, exactly as the builder stores it. Numbers the person supplied are wrapped in ⟦ ⟧. */
  after: GeneratedCV;
  /** Role-specific wording for a change; falls back to CHANGE_COPY. */
  changes?: Partial<Record<Pin, { before?: string; after?: string; why?: string; whyAfter?: string }>>;
  /** Text on the "after" resume each change points at (first match wins). */
  afterAnchors: Partial<Record<Pin, string>>;
  mistakes: { read: Mistake[]; match: Mistake[]; reader: Mistake[] };
  order: { title: string; text: string }[];
  rewrites: Rewrite[];
  skills: string[];
  /** Things that feel like they help and don't: what people believe, and what's true. */
  myths: { belief: string; truth: string }[];
}
