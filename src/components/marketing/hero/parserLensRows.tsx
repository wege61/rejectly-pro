import type { ReactNode } from "react";

/*
 * Demo content for the hero's Parser Lens.
 * Each row is one line of the résumé: what a person sees (`human`) and what the
 * ATS extracts from that same line (`ats`). Both layers render the rows at the
 * same height, so the lens always shows one line's two faces side by side.
 * Two-cell rows (`[main, sidebar]`) model the two-column "before" résumé: a common Canva
 * student template (photo, profile and contact in a sidebar, the name in a band, plain
 * lines under each heading). The sidebar is drawn on the left.
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
const Canva = () => <span className="canva-name">MAYA CHEN</span>;
const Chev = ({ children }: { children: ReactNode }) => <span className="h"><span className="chev" aria-hidden="true">❯</span> {children}</span>;

/* Full résumé: desktop and tablet. */
export const FULL_ROWS: Record<LensState, LensRow[]> = {
  before: [
    { human: [<Canva key="n" />, ""], ats: <><OK />name: Maya Chen</>, tall: true },
    { human: [<i key="s">Student</i>, ""], ats: <Dim>headline: &quot;Student&quot;</Dim> },
    { human: [<Chev key="a">Experience</Chev>, <H key="b">Profile</H>], ats: <><X /><Q>&quot;PROFILE EXPERIENCE&quot;</Q> <Dim>merged</Dim></>, fail: true },
    { human: [<span key="a"><b>Halden Analytics</b>, Intern</span>, "Economics student who"], ats: <><X />two columns read side by side</>, fail: true },
    { human: [<span key="a"><Weak>Helped the team</Weak> with weekly reports in Tableau</span>, "loves working with data."], ats: <><X />no bullet points</>, fail: true },
    { human: [<span key="a"><Weak>Responsible for</Weak> data entry tasks</span>, ""], ats: <><X />no numbers anywhere</>, fail: true },
    { human: ["Attended client meetings", <H key="b">Contact me</H>], ats: <><OK />email, phone <Dim>found mid-page</Dim></> },
    { human: [<Chev key="a">Projects</Chev>, "(555) 014-2290"], ats: <><X /><Q>&quot;PROJECTS (555) 014…&quot;</Q> <Dim>merged</Dim></>, fail: true },
    { human: [<span key="a"><Weak>Worked on</Weak> a group project predicting churn</span>, "maya.chen@mail.com"], ats: <Dim>&quot;predicting churn&quot; ≠ &quot;predictive modeling&quot;</Dim> },
    { human: ["Used Python and made charts for class", "Lakeside, CA"], ats: <Dim>&quot;made charts&quot; ≠ &quot;data visualization&quot;</Dim> },
    { human: [<Chev key="a">Computer skills</Chev>, ""], ats: <><OK />section: skills</> },
    { human: ["SQL, Excel, Python, Tableau", ""], ats: <><X />only 4 skills it can read</>, fail: true },
    { human: [<Chev key="a">Education</Chev>, ""], ats: <><OK />section: education</> },
    { human: ["Economics, Lakeside University", ""], ats: <><X />no LinkedIn · too short</>, fail: true },
    { human: ["", ""], ats: <><Dim>keywords</Dim> 3/6 · <span className="bad">predictive · dataviz · A/B</span></> },
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
    { human: <Canva />, ats: <><OK />name: Maya Chen</>, tall: true },
    { human: <Chev>Experience</Chev>, ats: <><X />merged with &quot;Profile&quot;</>, fail: true },
    { human: <><Weak>Helped the team</Weak> with weekly reports</>, ats: <><X />no bullet points</>, fail: true },
    { human: <><Weak>Responsible for</Weak> data entry tasks</>, ats: <><X />no numbers anywhere</>, fail: true },
    { human: <>SQL, Excel, Python, Tableau</>, ats: <><X />only 4 skills read</>, fail: true },
    { human: <>Economics, Lakeside University</>, ats: <><X />no LinkedIn · too short</>, fail: true },
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

/* What a parser extracts from each version, for checking SCORE against the real scorer.
   The photo and icons are images, so they don't come through; many parsers read the
   two columns line by line, side by side. */
export const BEFORE_TEXT = `                           MAYA CHEN
                           Student
PROFILE                    EXPERIENCE
Economics student who      Halden Analytics, Intern
loves working with data.   Helped the team with weekly reports in Tableau
                           Responsible for data entry tasks
CONTACT ME                 Attended client meetings
(555) 014-2290
maya.chen@mail.com         PROJECTS
Lakeside, CA               Worked on a group project predicting churn
                           Used Python and made charts for class
                           Did social media for Marketing Society
                           COMPUTER SKILLS
                           SQL, Excel, Python, Tableau
                           EDUCATION
                           Lakeside University
                           Economics, in progress`;

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

/* calculateDeterministicScore(BEFORE_TEXT) → 63 with 7 issues; (AFTER_TEXT) → 87. */
export const SCORE: Record<LensState, number> = { before: 63, after: 87 };
export const ISSUE_COUNT = 7;
export const COMPACT_ISSUE_COUNT = COMPACT_ROWS.before.filter((r) => r.fail).length;
export const KEYWORDS_AFTER = "5/6";
