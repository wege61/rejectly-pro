"use client";

import { useEffect, useState } from "react";
import styled, { css, keyframes } from "styled-components";
import { useCount, useStep, useTyped } from "./motion";

/*
 * Live mini UIs for each tool, all running on Maya's data. They mirror what the
 * product really does (checked against the API prompts): the builder's AI rewrite is
 * a Pro feature, interview prep gives questions and answer outlines (no grading),
 * the career plan suggests courses and projects, and nothing is added to a resume
 * that the candidate didn't do.
 */

export interface PanelProps {
  playKey: number;
  reduce: boolean;
}

const blink = keyframes`50% { opacity: 0; }`;

/* ── shared pieces ─────────────────────────────────────────────────────────── */

export const Ui = styled.div`
  position: relative;
  min-height: 300px;
  display: grid;
  align-content: center;
  gap: 14px;
  padding: 18px;
  border-radius: 16px;
  background: var(--rj-doc);
  color: var(--rj-doc-ink);
  box-shadow: 0 0 0 1px rgba(13, 14, 16, 0.08);
  font-size: 14px;
  line-height: 1.45;
  overflow: hidden;

  @media (min-width: 640px) {
    min-height: 340px;
    padding: 22px;
  }

  @media (min-width: 1000px) {
    min-height: 350px;
  }
`;

const K = styled.span`
  font: 600 10.5px/1 var(--rj-mono);
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #80848d;
`;

const Card = styled.div`
  display: grid;
  gap: 8px;
  padding: 14px;
  border-radius: 12px;
  background: #ffffff;
  box-shadow: 0 0 0 1px rgba(13, 14, 16, 0.08), 0 12px 28px -18px rgba(0, 0, 0, 0.3);
`;

const Show = styled.div<{ $on: boolean; $delay?: number }>`
  opacity: ${({ $on }) => ($on ? 1 : 0)};
  transform: translateY(${({ $on }) => ($on ? 0 : 8)}px);
  transition: opacity 0.45s ease, transform 0.5s cubic-bezier(0.3, 0, 0.2, 1);
  transition-delay: ${({ $delay = 0 }) => $delay}s;
`;

const Mark = styled.span<{ $on: boolean }>`
  padding: 0 0.12em;
  margin: 0 -0.06em;
  background: linear-gradient(transparent 14%, #ffe14d 14%, #ffe14d 88%, transparent 88%) no-repeat 0 0;
  background-size: ${({ $on }) => ($on ? "100% 100%" : "0% 100%")};
  -webkit-box-decoration-break: clone;
  box-decoration-break: clone;
  transition: background-size 0.5s cubic-bezier(0.6, 0, 0.2, 1);
`;

const Caret = styled.span<{ $on: boolean }>`
  ${({ $on }) =>
    $on &&
    css`
      &::after {
        content: "";
        display: inline-block;
        width: 1px;
        height: 1em;
        margin-left: 2px;
        vertical-align: -2px;
        background: currentColor;
        animation: ${blink} 1s steps(1) infinite;
      }
    `}
`;

const Chip = styled.span<{ $on?: boolean; $miss?: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 6px 8px;
  border-radius: 6px;
  font: 600 11.5px/1 var(--rj-mono);
  transition: background 0.35s, box-shadow 0.35s, color 0.35s;
  ${({ $on = true, $miss }) =>
    $miss
      ? css`
          background: #ffffff;
          color: #c42b22;
          box-shadow: inset 0 0 0 1px rgba(224, 53, 43, 0.4);
        `
      : $on
        ? css`
            background: #ffe14d;
            color: #0d0e10;
          `
        : css`
            background: #ffffff;
            color: #0d0e10;
            box-shadow: inset 0 0 0 1px rgba(13, 14, 16, 0.22);
          `}
`;

const Chips = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
`;

const Two = styled.div`
  display: grid;
  gap: 12px;

  @media (min-width: 640px) {
    grid-template-columns: 1fr 1fr;
    align-items: start;
  }
`;

const Input = styled.div`
  min-height: 38px;
  padding: 9px 12px;
  border-radius: 10px;
  box-shadow: inset 0 0 0 1.5px rgba(13, 14, 16, 0.16);
`;

const Resume = styled.div`
  padding: 14px 16px;
  border-radius: 10px;
  background: #ffffff;
  box-shadow: 0 0 0 1px rgba(13, 14, 16, 0.08);
  font-size: 12.5px;
  line-height: 1.55;

  .nm { font-size: 17px; font-weight: 700; letter-spacing: -0.02em; }
  .sub { color: #6a6e76; }
  .hd {
    margin-top: 8px;
    padding-bottom: 3px;
    border-bottom: 1px solid #d5d6d1;
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 0.14em;
    text-transform: uppercase;
  }
`;

/* ── 0. CV Builder ─────────────────────────────────────────────────────────── */

const AiButton = styled(Show)`
  justify-self: start;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 9px 12px;
  border-radius: 999px;
  background: #0d0e10;
  color: #ffffff;
  font-size: 13px;
  font-weight: 600;

  .spark { color: #ffe14d; }
  .pro {
    padding: 4px 6px;
    border-radius: 5px;
    font: 700 9.5px/1 var(--rj-mono);
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: #0d0e10;
    background: #ffe14d;
  }
`;

const Swap = styled.div<{ $after: boolean }>`
  display: grid;

  > span { grid-area: 1 / 1; transition: opacity 0.4s; }
  > span:first-child { opacity: ${({ $after }) => ($after ? 0 : 1)}; color: #6a6e76; }
  > span:last-child { opacity: ${({ $after }) => ($after ? 1 : 0)}; }
`;

const RAW = "I made the weekly sales report in Tableau for the 8-person team.";

export function BuilderPanel({ playKey, reduce }: PanelProps) {
  const step = useStep([300, 900, 2400, 3000, 3600], playKey, reduce);
  const animate = !!playKey && !reduce;
  const typed = useTyped(RAW, step >= 2, animate);
  return (
    <Ui>
      <Two>
        <div style={{ display: "grid", gap: 10 }}>
          <K>Experience</K>
          <Input style={{ fontSize: 13, color: "#6A6E76" }}>Data Analyst Intern · Halden Analytics</Input>
          <Show $on={step >= 1}>
            <Input><Caret $on={typed.typing}>{typed.shown}</Caret></Input>
          </Show>
          <AiButton $on={step >= 3} aria-hidden="true">
            <span className="spark">✦</span>Rewrite with AI<span className="pro">Pro</span>
          </AiButton>
        </div>
        <Show $on={step >= 1}>
          <Resume>
            <div className="nm">Maya Chen</div>
            <div className="sub">Junior Data Analyst</div>
            <div className="hd">Experience</div>
            <div><b>Data Analyst Intern</b>, Halden Analytics</div>
            <Swap $after={step >= 4}>
              <span>• {RAW}</span>
              <span>• Built the weekly sales report in <Mark $on={step >= 5}>Tableau</Mark> for an 8-person team</span>
            </Swap>
            <div className="hd">Education</div>
            <div><b>B.S. Economics</b>, Lakeside University · 2026</div>
            <div className="hd">Skills</div>
            <div>SQL · Python · Tableau · Excel</div>
          </Resume>
        </Show>
      </Two>
    </Ui>
  );
}

/* ── 1. ATS Check ──────────────────────────────────────────────────────────── */

const RING = 2 * Math.PI * 44;

const Ring = styled.div`
  position: relative;
  flex: none;
  width: 92px;
  height: 92px;

  svg { width: 100%; height: 100%; transform: rotate(-90deg); }
  circle { fill: none; stroke-width: 7; stroke-linecap: round; }
  .trk { stroke: #e6e7e3; }
  .val { stroke: var(--rj-pen); transition: stroke-dashoffset 1.1s cubic-bezier(0.4, 0, 0.2, 1); }

  b {
    position: absolute;
    inset: 0;
    display: grid;
    place-items: center;
    font-size: 28px;
    font-weight: 700;
    letter-spacing: -0.04em;
    font-variant-numeric: tabular-nums;
  }
`;

const Check = styled.div<{ $ok: boolean; $on: boolean }>`
  display: grid;
  grid-template-columns: 20px 1fr;
  gap: 10px;
  align-items: center;
  font-size: 14px;
  color: ${({ $ok }) => ($ok ? "#1B1C20" : "#6A6E76")};

  .bx {
    width: 20px;
    height: 20px;
    display: grid;
    place-items: center;
    border-radius: 6px;
    font-size: 11px;
    font-weight: 800;
    color: #ffffff;
    background: ${({ $ok }) => ($ok ? "#138A52" : "#E0352B")};
    transform: scale(${({ $on }) => ($on ? 1 : 0)});
    transition: transform 0.3s cubic-bezier(0.3, 1.5, 0.5, 1);
  }
`;

const CHECKS: [string, boolean][] = [
  ["One column, read in order", true],
  ["Standard section headings", true],
  ["Contact details in the body, not the header", true],
  ["No dates on 1 role", false],
  ["No measurable results yet", false],
];

export function CheckPanel({ playKey, reduce }: PanelProps) {
  const step = useStep([300, 700, 1000, 1300, 1600, 1900], playKey, reduce);
  const animate = !!playKey && !reduce;
  const score = useCount(74, step >= 1, animate);
  return (
    <Ui>
      <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
        <Ring>
          <svg viewBox="0 0 100 100" aria-hidden="true">
            <circle className="trk" cx="50" cy="50" r="44" />
            <circle className="val" cx="50" cy="50" r="44" strokeDasharray={RING} strokeDashoffset={step >= 1 ? RING * (1 - 0.74) : RING} />
          </svg>
          <b>{score}</b>
        </Ring>
        <div>
          <K>ATS readability</K>
          <div style={{ fontSize: 17, fontWeight: 700, marginTop: 6 }}>maya_chen_resume.pdf</div>
          <div style={{ color: "#6A6E76", fontSize: 13 }}>2 issues to fix</div>
        </div>
      </div>
      <div style={{ display: "grid", gap: 9 }}>
        {CHECKS.map(([label, ok], i) => (
          <Check key={label} $ok={ok} $on={step >= i + 2}>
            <span className="bx" aria-hidden="true">{ok ? "✓" : "✕"}</span>
            <span>{label}</span>
          </Check>
        ))}
      </div>
    </Ui>
  );
}

/* ── 2. Job Match: one fact, one version per job ───────────────────────────── */

const Jobs = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;

  button {
    display: grid;
    gap: 2px;
    padding: 9px 12px;
    border-radius: 12px;
    text-align: left;
    color: #4a4d55;
    box-shadow: inset 0 0 0 1px rgba(13, 14, 16, 0.14);
  }

  button b { font-size: 13.5px; color: #1b1c20; }
  button span { font-size: 11.5px; }
  button[aria-pressed="true"] { background: #ffffff; box-shadow: 0 0 0 1.5px #0d0e10; }
  button:focus-visible { outline: 2px solid #0d0e10; outline-offset: 2px; }
`;

const JobView = styled.div<{ $fading: boolean }>`
  display: grid;
  gap: 12px;
  opacity: ${({ $fading }) => ($fading ? 0 : 1)};
  transition: opacity 0.25s;
`;

const Score = styled.div`
  display: flex;
  align-items: baseline;
  gap: 8px;

  b { font-size: 34px; font-weight: 700; letter-spacing: -0.04em; font-variant-numeric: tabular-nums; }
  span { font-size: 13px; color: #6a6e76; }
`;

const JOBS = [
  {
    role: "Junior Data Analyst",
    company: "Northfield",
    score: 88,
    chips: [["Tableau", true], ["data cleaning", true], ["reporting", true]] as [string, boolean][],
    line: (
      <>Built the weekly sales <Mark $on>reporting</Mark> in <Mark $on>Tableau</Mark> for an 8-person team, from 12,000 CRM records after <Mark $on>data cleaning</Mark>.</>
    ),
  },
  {
    role: "Marketing Analyst",
    company: "Bluepine",
    score: 71,
    chips: [["performance reporting", true], ["CRM data", true], ["GA4", false]] as [string, boolean][],
    line: (
      <>Owned the weekly sales <Mark $on>performance reporting</Mark> for an 8-person team, built in Tableau from 12,000 cleaned <Mark $on>CRM data</Mark> records.</>
    ),
  },
];

export function MatchPanel({ playKey, reduce, active }: PanelProps & { active: boolean }) {
  const [job, setJob] = useState(0);
  const [fading, setFading] = useState(false);
  const [userPicked, setUserPicked] = useState(false);

  const pick = (j: number, fromUser = false) => {
    if (fromUser) setUserPicked(true);
    if (reduce) {
      setJob(j);
      return;
    }
    setFading(true);
    setTimeout(() => {
      setJob(j);
      setFading(false);
    }, 250);
  };

  // A new play starts from the first job.
  useEffect(() => {
    if (playKey) {
      setJob(0);
      setUserPicked(false);
    }
  }, [playKey]);

  // While on stage and untouched, alternate between the two job posts.
  useEffect(() => {
    if (!active || !playKey || reduce || userPicked) return;
    const id = setInterval(() => pick(job === 0 ? 1 : 0), 3000);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, playKey, reduce, userPicked, job]);

  const d = JOBS[job];
  return (
    <Ui>
      <Jobs role="group" aria-label="Job post">
        {JOBS.map((j, i) => (
          <button key={j.role} type="button" aria-pressed={job === i} onClick={() => pick(i, true)}>
            <b>{j.role}</b>
            <span>{j.company}</span>
          </button>
        ))}
      </Jobs>
      <JobView $fading={fading} aria-live="polite">
        <Score><b>{d.score}</b><span>match after tailoring</span></Score>
        <Chips>
          {d.chips.map(([c, ok]) => ok ? <Chip key={c}>✓ {c}</Chip> : <Chip key={c} $miss>{c} · missing</Chip>)}
        </Chips>
        <Card>
          <K>Your Halden bullet, for this job</K>
          <div>{d.line}</div>
        </Card>
        <div style={{ fontSize: 12.5, color: "#80848D" }}>Same facts, different words. Nothing added that you didn&apos;t do.</div>
      </JobView>
    </Ui>
  );
}

/* ── 3. Cover Letters ──────────────────────────────────────────────────────── */

const Tone = styled.div`
  display: inline-flex;
  justify-self: start;
  padding: 3px;
  border-radius: 9px;
  background: rgba(13, 14, 16, 0.06);

  span { padding: 7px 10px; border-radius: 7px; font: 600 12px/1 var(--rj-font); color: #80848d; }
  span.on { background: #ffffff; color: #0d0e10; box-shadow: 0 1px 2px rgba(0, 0, 0, 0.15); }
`;

const Letter = styled(Show)`
  min-height: 190px;
  padding: 18px 20px;
  border-radius: 10px;
  background: #ffffff;
  box-shadow: 0 0 0 1px rgba(13, 14, 16, 0.08), 0 18px 36px -24px rgba(0, 0, 0, 0.35);
  font-size: 13.5px;
  line-height: 1.65;

  p { margin: 0 0 8px; }
`;

const LETTER = "I'm applying for the Junior Data Analyst role. At Halden Analytics I built the weekly sales report in Tableau for an 8-person team, and in a class project I built a Python model to flag customers likely to churn. I'd like to bring that work to your growth team.";

export function LetterPanel({ playKey, reduce }: PanelProps) {
  const step = useStep([300, 800], playKey, reduce);
  const typed = useTyped(LETTER, step >= 2, !!playKey && !reduce);
  return (
    <Ui>
      <Tone aria-hidden="true"><span className="on">Professional</span><span>Confident</span><span>Conversational</span></Tone>
      <Letter $on={step >= 1}>
        <p>Dear Northfield team,</p>
        <p><Caret $on={typed.typing}>{typed.shown}</Caret></p>
      </Letter>
    </Ui>
  );
}

/* ── 4. Interview Prep: questions and answer outlines, no grading ──────────── */

const Tabs = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;

  span { padding: 8px 10px; border-radius: 999px; font: 600 12px/1 var(--rj-font); color: #4a4d55; box-shadow: inset 0 0 0 1px rgba(13, 14, 16, 0.14); }
  span.on { background: #0d0e10; color: #ffffff; box-shadow: none; }
`;

const Outline = styled.div`
  display: grid;
  gap: 6px;

  > div { display: grid; grid-template-columns: 74px 1fr; gap: 10px; font-size: 13px; }
  b { font: 600 10.5px/1.6 var(--rj-mono); letter-spacing: 0.06em; text-transform: uppercase; color: #80848d; }
`;

const STAR: [string, string][] = [
  ["Situation", "The 8-person sales team needed numbers every week."],
  ["Task", "You owned the weekly report."],
  ["Action", "You built it in Tableau."],
  ["Result", "Add what changed: time saved, a decision it informed."],
];

export function InterviewPanel({ playKey, reduce }: PanelProps) {
  const step = useStep([300, 900, 1300, 1700, 2100], playKey, reduce);
  return (
    <Ui>
      <Tabs aria-hidden="true"><span className="on">Behavioral</span><span>Technical</span><span>Weak spots</span><span>Ask them</span></Tabs>
      <Show $on={step >= 1}>
        <Card>
          <K>Likely question</K>
          <div style={{ fontSize: 15, fontWeight: 600 }}>Tell me about a report you built that someone relied on.</div>
          <div style={{ fontSize: 12.5, color: "#6A6E76" }}>Why: the post asks for data visualization for stakeholders.</div>
        </Card>
      </Show>
      <Card>
        <K>Your answer outline · from your Halden internship</K>
        <Outline>
          {STAR.map(([k, v], i) => (
            <Show key={k} $on={step >= i + 2}><b>{k}</b><span>{v}</span></Show>
          ))}
        </Outline>
      </Card>
    </Ui>
  );
}

/* ── 5. Career Plan: the unmet requirement becomes a plan ──────────────────── */

const Gap = styled(Show)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  padding: 12px 14px;
  border-radius: 12px;
  background: rgba(224, 53, 43, 0.07);

  b { font-size: 14.5px; }
  span { font: 500 11px/1 var(--rj-mono); color: #c42b22; }
`;

const PlanItem = styled(Card)`
  grid-template-columns: auto 1fr;
  align-items: start;
  gap: 4px 12px;

  .ic { grid-row: span 2; width: 30px; height: 30px; display: grid; place-items: center; border-radius: 8px; font: 700 11px/1 var(--rj-mono); background: rgba(13, 14, 16, 0.06); }
  b { font-size: 14px; }
  span { font-size: 12.5px; color: #6a6e76; }
`;

export function GrowPanel({ playKey, reduce }: PanelProps) {
  const step = useStep([300, 900, 1400, 2000], playKey, reduce);
  return (
    <Ui>
      <Gap $on={step >= 1}><b>A/B testing</b><span>not on your resume yet</span></Gap>
      <div style={{ display: "grid", gap: 10 }}>
        <Show $on={step >= 2}>
          <PlanItem><span className="ic">C</span><b>A/B Testing course</b><span>A short online course on experiment design and reading results.</span></PlanItem>
        </Show>
        <Show $on={step >= 3}>
          <PlanItem><span className="ic">P</span><b>Project: test your Marketing Society posts</b><span>Run a real A/B test on two post formats and write up what you found.</span></PlanItem>
        </Show>
      </div>
      <Show $on={step >= 4}>
        <p style={{ margin: 0, fontSize: 15.5, fontWeight: 600, letterSpacing: "-0.01em" }}>
          Rejectly won&apos;t fake the skill. It shows you how to earn it.
        </p>
      </Show>
    </Ui>
  );
}

