import type { ReactNode } from "react";

/*
 * Demo content for the hero's Parser Lens.
 * Each row is one line of the résumé: what a person sees (`human`) and what the
 * ATS extracts from that same line (`ats`). Both layers render the rows at the
 * same height, so the lens always shows one line's two faces side by side.
 * Two-cell rows (`[main, sidebar]`) model the two-column "before" résumé: a Canva-style
 * template with a letter-spaced name, contact icons in the page header, creative
 * headings, ➤ bullets, skill-dot bars and emoji.
 *
 * SCORE and ISSUE_COUNT are what lib/ats/deterministicScoring returns for the text a
 * parser pulls out of each version (BEFORE_TEXT / AFTER_TEXT below). Re-run it if
 * either résumé changes: `calculateDeterministicScore(BEFORE_TEXT)`.
 *
 * The demo mirrors what the optimizer really does (see lib/ai/prompts/cvOptimization):
 * it rewrites facts Maya already has in the posting's words, never invents numbers
 * or skills, and leaves an unmet requirement unmet. Numbers in the "after" state
 * are her answers to the metric questions, marked with `.ans`.
 */

export interface LensRow {
  human: ReactNode | [ReactNode, ReactNode];
  ats: ReactNode;
  tall?: boolean;
  fail?: boolean;
}

export type LensState = "before" | "after";

const X = () => <span className="bad">✕ </span>;
const OK = () => <span className="ok">✓ </span>;
const Weak = ({ children }: { children: ReactNode }) => <span className="weak">{children}</span>;
const Kw = ({ children }: { children: ReactNode }) => <span className="kw">{children}</span>;
const Ans = ({ children, num }: { children: ReactNode; num?: boolean }) => (
  <span className={num ? "num ans" : "ans"}>{children}</span>
);
const H = ({ children }: { children: ReactNode }) => <span className="h">{children}</span>;
const Muted = ({ children }: { children: ReactNode }) => <span className="muted">{children}</span>;
const Q = ({ children }: { children: ReactNode }) => <span className="q">{children}</span>;
const Dim = ({ children }: { children: ReactNode }) => <span className="dim">{children}</span>;
const Name = () => <span className="name">Maya Chen</span>;
const Spaced = ({ children }: { children: ReactNode }) => <span className="spaced">{children}</span>;
const Dots = ({ children }: { children: ReactNode }) => <span className="dots">{children}</span>;

/* Full résumé: desktop and tablet. */
export const FULL_ROWS: Record<LensState, LensRow[]> = {
  before: [
    { human: [<Spaced key="n">✦ M A Y A{"\u00a0\u00a0\u00a0"}C H E N ✦</Spaced>, ""], ats: <><X />name read as <Q>&quot;M A Y A C H E N&quot;</Q></>, tall: true, fail: true },
    { human: [<Spaced key="s">S T U D E N T</Spaced>, ""], ats: <><X />contact: none found <Dim>(page header)</Dim></>, fail: true },
    { human: [<Muted key="c">📧 maya.chen@mail.com 📞 (555) 014-2290</Muted>, ""], ats: <><X />email, phone skipped</>, fail: true },
    { human: [<H key="a">★ My journey ★</H>, <H key="b">★ About me ★</H>], ats: <><X /><Q>&quot;MY JOURNEY ABOUT ME&quot;</Q> <Dim>merged</Dim></>, fail: true },
    { human: [<span key="a"><b>Halden Analytics</b> · Intern</span>, "Curious, hard-working"], ats: <><X />&quot;My journey&quot; is not a section name</>, fail: true },
    { human: [<span key="a">➤ <Weak>Helped the team</Weak> with weekly reports</span>, "student who loves data"], ats: <><X />&quot;➤&quot; is not a bullet</>, fail: true },
    { human: [<span key="a">➤ <Weak>Responsible for</Weak> data entry tasks</span>, "and people! ✨"], ats: <><X />no numbers anywhere</>, fail: true },
    { human: ["➤ Attended client meetings", ""], ats: <><X />columns run together</>, fail: true },
    { human: [<H key="a">★ Cool projects ★</H>, <H key="b">★ Toolkit ★</H>], ats: <><X />&quot;Toolkit&quot; is not a skills section</>, fail: true },
    { human: [<span key="a">➤ <Weak>Worked on</Weak> a group project predicting churn</span>, <span key="b">SQL <Dots>●●●●○</Dots></span>], ats: <><X /><Q>&quot;●●●●○&quot;</Q> read as symbols</>, fail: true },
    { human: ["➤ Used Python and made charts for class", <span key="b">Python <Dots>●●●○○</Dots></span>], ats: <><X />skill level unreadable</>, fail: true },
    { human: ["➤ Did social media for Marketing Society", <H key="b">★ Superpowers ★</H>], ats: <><X />━━ ★ ✦ decorative symbols</>, fail: true },
    { human: [<H key="a">★ Learning ★</H>, "Hard-working 🔥"], ats: <><X />emoji 🔥 ✨ 📧</>, fail: true },
    { human: ["Economics, Lakeside University", "Teamwork 🤝"], ats: <><X />no LinkedIn · too short</>, fail: true },
    { human: ["", ""], ats: <><Dim>keywords</Dim> 3/6 · <span className="bad">predictive · dataviz · A/B</span></>, fail: true },
  ],
  after: [
    { human: <Name />, ats: <><OK />name: Maya Chen</>, tall: true },
    { human: <><b>Economics graduate</b> | Data Analyst Intern</>, ats: <><OK />headline: who you are</> },
    { human: <Muted>maya.chen@mail.com | (555) 014-2290 | Lakeside, CA</Muted>, ats: <><OK />email · phone · city</> },
    { human: <H>Experience</H>, ats: <><OK />section: experience</> },
    { human: <><b>Data Analyst Intern</b>, Halden Analytics <Muted>· <Ans>Jun–Aug 2026</Ans></Muted></>, ats: <><OK />role · dates (your answer)</> },
    { human: <>• Helped build weekly sales reports in <Kw>Tableau</Kw> for a team of <Ans>8</Ans></>, ats: <><OK />Tableau <OK />scope</> },
    { human: <>• Handled data entry for <Ans num>12,000</Ans> CRM records</>, ats: <><OK />metric (your answer)</> },
    { human: <H>Projects</H>, ats: <><OK />section: projects</> },
    { human: <>• Group project: built a <Kw>predictive model</Kw> in <Kw>Python</Kw> to flag churners</>, ats: <><OK />predictive modeling <OK />Python</> },
    { human: <>• Built <Kw>data visualizations</Kw> in Python for coursework</>, ats: <><OK />data visualization</> },
    { human: <H>Education</H>, ats: <><OK />section: education</> },
    { human: <>B.S. Economics, Lakeside University <Muted>· 2026</Muted></>, ats: <><OK />B.S. · 2026</> },
    { human: <H>Skills</H>, ats: <><OK />skills in one section</> },
    { human: <><Kw>SQL</Kw> · <Kw>Python</Kw> · <Kw>Tableau</Kw> · Excel</>, ats: <><OK />SQL <OK />Python <OK />Tableau</> },
    { human: "", ats: <><Dim>keywords</Dim> <span className="ok">5/6</span> · <span className="bad">A/B testing</span> <Dim>not in your experience</Dim></> },
  ],
};

/* Curated subset for phones: one column, readable size. */
export const COMPACT_ROWS: Record<LensState, LensRow[]> = {
  before: [
    { human: <Spaced>✦ M A Y A{"\u00a0\u00a0\u00a0"}C H E N ✦</Spaced>, ats: <><X />name split into letters</>, tall: true, fail: true },
    { human: <Muted>📧 maya.chen@mail.com 📞 (555)…</Muted>, ats: <><X />contact: none found</>, fail: true },
    { human: <H>★ My journey ★</H>, ats: <><X />not a section name</>, fail: true },
    { human: <>➤ <Weak>Helped the team</Weak> with weekly reports</>, ats: <><X />&quot;➤&quot; is not a bullet</>, fail: true },
    { human: <>Python <Dots>●●●○○</Dots></>, ats: <><X />read as symbols</>, fail: true },
    { human: <>Hard-working 🔥 Teamwork 🤝</>, ats: <><X />emoji, not skills</>, fail: true },
  ],
  after: [
    { human: <Name />, ats: <><OK />name: Maya Chen</>, tall: true },
    { human: <b>Economics graduate</b>, ats: <><OK />headline: who you are</> },
    { human: <H>Experience</H>, ats: <><OK />role · <Dim>dates from you</Dim></> },
    { human: <>• Helped build weekly <Kw>Tableau</Kw> reports, team of <Ans>8</Ans></>, ats: <><OK />Tableau <OK />scope</> },
    { human: <>• Data entry for <Ans num>12,000</Ans> CRM records</>, ats: <><OK />metric (your answer)</> },
    { human: <>• Group project: <Kw>predictive model</Kw> in <Kw>Python</Kw></>, ats: <><OK />predictive modeling</> },
    { human: <><Kw>SQL</Kw> · <Kw>Python</Kw> · <Kw>Tableau</Kw></>, ats: <><Dim>keywords</Dim> <span className="ok">5/6</span> · <span className="bad">A/B</span> <Dim>unmet</Dim></> },
  ],
};

/* What a parser extracts from each version, for checking SCORE against the real scorer. */
export const BEFORE_TEXT = `✦ M A Y A   C H E N ✦
S T U D E N T
━━━━━━━━━━━━━━━━━━━━━━━━━━
★ ABOUT ME ★              ★ MY JOURNEY ★
Curious, hard-working     Halden Analytics
student who loves data    Intern
and people!               ➤ Helped the team with weekly reports in Tableau
                          ➤ Responsible for data entry tasks
★ TOOLKIT ★               ➤ Attended client meetings
SQL        ●●●●○
Excel      ●●●●●          ★ COOL PROJECTS ★
Python     ●●●○○          ➤ Worked on a group project predicting churn
Tableau    ●●●○○          ➤ Used Python and made charts for class
                          ➤ Did social media for Marketing Society
★ SUPERPOWERS ★
Teamwork ✨               ★ LEARNING ★
Hard-working 🔥           Economics, Lakeside University`;

export const AFTER_TEXT = `MAYA CHEN
Economics graduate | Data Analyst Intern
maya.chen@mail.com | (555) 014-2290 | Lakeside, CA

EXPERIENCE
Data Analyst Intern, Halden Analytics, Jun–Aug 2026
• Helped build weekly sales reports in Tableau for a team of 8
• Handled data entry for 12,000 CRM records

PROJECTS
• Group project: built a predictive model in Python to flag churners
• Built data visualizations in Python for coursework

EDUCATION
B.S. Economics, Lakeside University, 2026

SKILLS
SQL, Python, Tableau, Excel`;

/* calculateDeterministicScore(BEFORE_TEXT) → 27 with 14 issues; (AFTER_TEXT) → 87. */
export const SCORE: Record<LensState, number> = { before: 27, after: 87 };
export const ISSUE_COUNT = 14;
export const COMPACT_ISSUE_COUNT = COMPACT_ROWS.before.filter((r) => r.fail).length;
export const KEYWORDS_AFTER = "5/6";
