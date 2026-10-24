import type { ReactNode } from "react";

/*
 * Demo content for the hero's Parser Lens.
 * Each row is one line of the résumé: what a person sees (`human`) and what the
 * ATS extracts from that same line (`ats`). Both layers render the rows at the
 * same height, so the lens always shows one line's two faces side by side.
 * Two-cell rows (`[main, sidebar]`) model the two-column "before" résumé.
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

/* Full résumé: desktop and tablet. */
export const FULL_ROWS: Record<LensState, LensRow[]> = {
  before: [
    { human: [<Name key="n" />, ""], ats: <><OK />name: Maya Chen</>, tall: true },
    { human: [<Muted key="m">Student</Muted>, ""], ats: <><X />title: no target role</>, fail: true },
    { human: ["", ""], ats: "" },
    { human: [<H key="a">Experience</H>, <H key="b">Contact</H>], ats: <><X /><Q>&quot;EXPERIENCE CONTACT&quot;</Q> <Dim>merged</Dim></>, fail: true },
    { human: [<span key="a"><b>Halden Analytics</b> · Intern</span>, "maya.chen@mail.com"], ats: <><X /><Q>&quot;Halden… maya.chen@…&quot;</Q></>, fail: true },
    { human: [<span key="a">• <Weak>Helped the team</Weak> with weekly reports in Tableau</span>, "(555) 014-2290"], ats: <><X />duty, not a result</>, fail: true },
    { human: [<span key="a">• <Weak>Responsible for</Weak> data entry tasks</span>, "Lakeside, CA"], ats: <><X />duty, not a result</>, fail: true },
    { human: ["• Attended client meetings", ""], ats: <><X />role has no dates</>, fail: true },
    { human: [<H key="a">Projects</H>, <H key="b">Skills</H>], ats: <><X /><Q>&quot;PROJECTS SKILLS&quot;</Q> <Dim>merged</Dim></>, fail: true },
    { human: [<span key="a">• <Weak>Worked on</Weak> a group project predicting churn</span>, "SQL"], ats: <><X />&quot;predicting churn&quot; ≠ &quot;predictive modeling&quot;</>, fail: true },
    { human: ["• Used Python and made charts for class", "Excel"], ats: <><X />&quot;made charts&quot; ≠ &quot;data visualization&quot;</>, fail: true },
    { human: ["• Did social media for Marketing Society", "Teamwork"], ats: <><X />&quot;Teamwork&quot; is not a keyword</>, fail: true },
    { human: [<H key="a">Education</H>, "Hard-working"], ats: <><X />&quot;Hard-working&quot; is not a keyword</>, fail: true },
    { human: ["Economics, Lakeside University", ""], ats: <><X />degree type and year missing</>, fail: true },
    { human: ["", ""], ats: <><Dim>keywords</Dim> 3/6 · <span className="bad">predictive · dataviz · A/B</span></>, fail: true },
  ],
  after: [
    { human: <Name />, ats: <><OK />name: Maya Chen</>, tall: true },
    { human: <b>Junior Data Analyst</b>, ats: <><OK />title matches the role</> },
    { human: <Muted>maya.chen@mail.com · (555) 014-2290 · Lakeside, CA</Muted>, ats: <><OK />email · phone · city</> },
    { human: <H>Experience</H>, ats: <><OK />section: experience</> },
    { human: <><b>Data Analyst Intern</b>, Halden Analytics <Muted>· <Ans>Jun–Aug 2026</Ans></Muted></>, ats: <><OK />role · dates (your answer)</> },
    { human: <>• Built weekly sales reports in <Kw>Tableau</Kw> for a team of <Ans>8</Ans></>, ats: <><OK />Tableau <OK />scope</> },
    { human: <>• Cleaned <Ans num>12,000</Ans> CRM records during data entry</>, ats: <><OK />metric (your answer)</> },
    { human: <H>Projects</H>, ats: <><OK />section: projects</> },
    { human: <>• Built a <Kw>predictive model</Kw> in <Kw>Python</Kw> to flag likely churners</>, ats: <><OK />predictive modeling <OK />Python</> },
    { human: <>• Presented results with <Kw>data visualizations</Kw></>, ats: <><OK />data visualization</> },
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
    { human: <Name />, ats: <><OK />name: Maya Chen</>, tall: true },
    { human: <Muted>Student</Muted>, ats: <><X />title: no target role</>, fail: true },
    { human: <H>Experience</H>, ats: <><X /><Q>&quot;EXPERIENCE CONTACT&quot;</Q> <Dim>merged</Dim></>, fail: true },
    { human: <>• <Weak>Helped the team</Weak> with weekly reports</>, ats: <><X />duty, not a result</>, fail: true },
    { human: <>• <Weak>Responsible for</Weak> data entry tasks</>, ats: <><X />role has no dates</>, fail: true },
    { human: <>• <Weak>Worked on</Weak> a group project predicting churn</>, ats: <><X />≠ &quot;predictive modeling&quot;</>, fail: true },
    { human: <><Muted>Skills:</Muted> SQL · Excel · Teamwork</>, ats: <><Dim>keywords</Dim> 3/6</>, fail: true },
  ],
  after: [
    { human: <Name />, ats: <><OK />name: Maya Chen</>, tall: true },
    { human: <b>Junior Data Analyst</b>, ats: <><OK />title matches the role</> },
    { human: <H>Experience</H>, ats: <><OK />role · <Dim>dates from you</Dim></> },
    { human: <>• Weekly sales reports in <Kw>Tableau</Kw>, team of <Ans>8</Ans></>, ats: <><OK />Tableau <OK />scope</> },
    { human: <>• Cleaned <Ans num>12,000</Ans> CRM records</>, ats: <><OK />metric (your answer)</> },
    { human: <>• <Kw>Predictive model</Kw> in <Kw>Python</Kw></>, ats: <><OK />predictive modeling</> },
    { human: <><Kw>SQL</Kw> · <Kw>Python</Kw> · <Kw>Tableau</Kw></>, ats: <><Dim>keywords</Dim> <span className="ok">5/6</span> · <span className="bad">A/B</span> <Dim>unmet</Dim></> },
  ],
};

export const ISSUE_COUNT = FULL_ROWS.before.filter((r) => r.fail).length;
export const COMPACT_ISSUE_COUNT = COMPACT_ROWS.before.filter((r) => r.fail).length;

export const SCORE: Record<LensState, number> = { before: 32, after: 88 };
export const KEYWORDS_AFTER = "5/6";
