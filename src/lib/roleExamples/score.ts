import { calculateDeterministicScore } from "@/lib/ats/deterministicScoring";
import { cvPlainText } from "@/lib/pdf/cvGenerator";
import type { BeforeDoc, Pin, RoleExample } from "./types";
import { plainCV } from "./plain";

/*
 * Everything a role page shows about scores is computed here, from the same
 * checks as the free scan, so the page can't drift from what a scan would say.
 */

/*
 * What a parser pulls out of a two-column PDF: it reads straight across the
 * page, so each sidebar line runs into the main column's line beside it.
 * Icons leave no text; skill bars leave only their labels.
 */
export function beforeText(doc: BeforeDoc): string {
  const left: string[] = [doc.name.toUpperCase(), doc.tagline, ""];
  for (const b of doc.sidebar) {
    left.push(b.heading.toUpperCase());
    for (const l of b.lines ?? []) left.push(l);
    for (const bar of b.bars ?? []) left.push(bar.label);
    left.push("");
  }
  const right: string[] = [];
  const wrap = (t: string) => {
    const out: string[] = [];
    let line = "";
    for (const w of t.split(/\s+/)) {
      if (line && line.length + 1 + w.length > 38) { out.push(line); line = w; }
      else line = line ? `${line} ${w}` : w;
    }
    if (line) out.push(line);
    return out;
  };
  for (const b of doc.main) {
    right.push(b.heading.toUpperCase());
    if (b.text) right.push(...wrap(b.text));
    if (b.hidden) right.push(...wrap(b.hidden));
    for (const e of b.entries ?? []) {
      right.push(e.title);
      if (e.sub) right.push(e.sub);
      for (const x of e.bullets ?? []) right.push(...wrap(x));
      for (const row of e.table ?? []) right.push(row.join("     "));
    }
    right.push("");
  }
  const rows = Math.max(left.length, right.length);
  const lines: string[] = [];
  for (let i = 0; i < rows; i++) {
    const l = left[i] ?? "";
    const r = right[i] ?? "";
    lines.push(r ? `${l.padEnd(27)}${r}` : l);
  }
  return lines.join("\n").replace(/\n{3,}/g, "\n\n").trim();
}

/** Which change a failed check belongs to. Checks that share a fix share a pin. */
const CHECK_PIN: Record<string, Pin> = {
  single_column: "columns",
  no_pipes: "columns",
  contact_in_body: "contact",
  has_email: "contact",
  has_phone: "contact",
  has_linkedin: "contact",
  has_experience: "headings",
  has_education: "headings",
  has_skills: "headings",
  has_summary: "headings",
  quantified_achievements: "numbers",
  standard_bullets: "bullets",
  no_special_chars: "bullets",
  bullet_structure: "structure",
  word_count: "length",
  white_space: "breaks",
  no_creative_dividers: "bullets",
  has_skills_listed: "skills",
  consistent_dates: "structure",
};

export interface ScoredChange {
  pin: Pin;
  points: number;
  checks: string[];
}

export interface RoleScores {
  before: number;
  after: number;
  beforeFailing: number;
  afterFailing: string[];
  changes: ScoredChange[];
  beforeText: string;
  afterText: string;
}

function failing(text: string) {
  const r = calculateDeterministicScore(text);
  const checks = Object.values(r.categories).flatMap((c) => c.checks).filter((c) => !c.passed);
  return { score: r.overallScore, checks };
}

export function scoreExample(ex: RoleExample): RoleScores {
  const bText = beforeText(ex.before);
  const aText = cvPlainText(plainCV(ex.after));
  const b = failing(bText);
  const a = failing(aText);
  const fixed = b.checks.filter((c) => !a.checks.some((x) => x.id === c.id));

  // Group fixed checks by change, in the order they appear on the "before" page.
  // The layout comes first: it's the first thing anyone sees.
  const order: Pin[] = ["columns"];
  for (const block of ex.before.sidebar) if (block.pin && !order.includes(block.pin)) order.push(block.pin);
  for (const block of ex.before.main) {
    if (block.pin && !order.includes(block.pin)) order.push(block.pin);
    for (const e of block.entries ?? []) if (e.pin && !order.includes(e.pin)) order.push(e.pin);
  }
  const byPin = new Map<Pin, ScoredChange>();
  for (const c of fixed) {
    const pin = CHECK_PIN[c.id] ?? "structure";
    const cur = byPin.get(pin) ?? { pin, points: 0, checks: [] };
    cur.points += c.points;
    cur.checks.push(c.name);
    byPin.set(pin, cur);
  }
  const changes = [...byPin.values()].sort((x, y) => {
    const ix = order.indexOf(x.pin), iy = order.indexOf(y.pin);
    return (ix < 0 ? 99 : ix) - (iy < 0 ? 99 : iy);
  });

  return {
    before: b.score,
    after: a.score,
    beforeFailing: b.checks.length,
    afterFailing: a.checks.map((c) => c.name),
    changes,
    beforeText: bText,
    afterText: aText,
  };
}
