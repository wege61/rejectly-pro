"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import Link from "next/link";
import styled, { keyframes } from "styled-components";
import { ROUTES, PRICING } from "@/lib/constants";
import { JOB, KEYWORDS, KEYWORDS_AFTER, REWRITES, RULES, STEPS, type StoryScores, type StoryStep } from "./story";

/*
 * /how-it-works: one resume (Maya's) through six steps. On desktop the chapters
 * scroll on the left and one stage stays put on the right, changing with the
 * chapter in the middle of the screen; a thin rail carries the yellow scan line
 * down as you read. On phones each chapter shows its own stage above its text.
 * Every number comes from the real scorer (see story.ts).
 */

const ease = "cubic-bezier(0.2, 0.8, 0.2, 1)";
const CATEGORY_NAMES: Record<string, string> = { format: "Format & parsing", structure: "Structure & sections", keywords: "Content", readability: "Readability" };

/* ---------------------------------------------------------------- page */

const Root = styled.div`
  background: var(--rj-paper);
  color: var(--rj-ink);
  font-family: var(--rj-font);
  -webkit-font-smoothing: antialiased;
  padding-top: calc(60px + env(safe-area-inset-top, 0px));
`;

const In = styled.div`
  max-width: 1240px;
  margin: 0 auto;
  padding: 0 max(20px, env(safe-area-inset-right, 0px)) 0 max(20px, env(safe-area-inset-left, 0px));

  @media (min-width: 640px) { padding: 0 40px; }

  .eyebrow { margin: 0; font: 500 11.5px/1.3 var(--rj-mono); letter-spacing: 0.07em; text-transform: uppercase; color: var(--rj-ink-2); }
`;

const Hero = styled.header`
  max-width: 820px;
  padding-top: 40px;

  @media (min-width: 640px) { padding-top: 64px; }
  @media (min-width: 1000px) { padding-top: 88px; }

  h1 { margin: 12px 0 0; font-size: clamp(40px, 10vw, 80px); font-weight: 700; line-height: 1.04; letter-spacing: -0.045em; color: var(--rj-ink); text-wrap: balance; }
  @media (min-width: 640px) { h1 { font-size: clamp(56px, 7.4vw, 80px); } }
  /* Highlight only the x-height band, so it never covers the descenders above it. */
  h1 mark { padding: 0 0.06em; margin: 0 -0.03em; border-radius: 0.08em; color: var(--rj-hl-ink); background: linear-gradient(transparent 14%, var(--rj-hl) 14%, var(--rj-hl) 90%, transparent 90%); -webkit-box-decoration-break: clone; box-decoration-break: clone; }
  .sub { margin: 18px 0 0; max-width: 34em; font-size: 18.5px; line-height: 1.55; color: var(--rj-ink-2); }
  .ctas { margin-top: 26px; display: flex; flex-wrap: wrap; align-items: center; gap: 14px 22px; }
`;

const Btn = styled(Link)`
  height: 52px;
  padding: 0 24px;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  border-radius: 999px;
  font-size: 16px;
  font-weight: 600;
  color: var(--rj-btn-ink);
  background: var(--rj-btn);
  text-decoration: none;

  svg { width: 15px; height: 15px; }
  &:hover { color: var(--rj-btn-ink); }
  &:focus-visible { outline: 2px solid var(--rj-ink); outline-offset: 3px; }
`;

const TextLink = styled.a`
  padding-bottom: 2px;
  border-bottom: 1px solid var(--rj-line);
  font-weight: 500;
  color: var(--rj-ink);
  text-decoration: none;

  &:hover { color: var(--rj-ink); border-color: var(--rj-ink); }
  &:focus-visible { outline: 2px solid var(--rj-ink); outline-offset: 3px; }
`;

const Story = styled.div`
  position: relative;
  margin-top: 48px;
  display: grid;
  grid-template-columns: minmax(0, 1fr);

  @media (min-width: 1000px) { grid-template-columns: 40px minmax(0, 1fr) minmax(0, 1.1fr); column-gap: 32px; }
`;

const Rail = styled.div`
  display: none;

  @media (min-width: 1000px) {
    display: block;
    grid-column: 1;
    grid-row: 1;
    position: sticky;
    top: 90px;
    height: calc(100vh - 140px);

    &::before { content: ""; position: absolute; left: 19px; top: 0; bottom: 0; width: 2px; border-radius: 2px; background: var(--rj-line); }
    .f { position: absolute; left: 19px; top: 0; width: 2px; height: var(--rail, 0%); border-radius: 2px; background: color-mix(in srgb, var(--rj-hl) 70%, transparent); }
    .b { position: absolute; left: 6px; right: 6px; top: var(--rail, 0%); height: 2px; background: #ffe14d; box-shadow: 0 0 14px 3px rgba(255, 225, 77, 0.6); }
  }
`;

const Chapters = styled.div`
  @media (min-width: 1000px) { grid-column: 2; grid-row: 1; }
`;

const Chapter = styled.section<{ $on: boolean }>`
  display: flex;
  flex-direction: column;
  padding: 28px 0 40px;
  border-top: 1px solid var(--rj-line);

  @media (min-width: 1000px) {
    min-height: 72vh;
    justify-content: center;
    padding: 48px 0;
    border-top: 0;
    opacity: ${({ $on }) => ($on ? 1 : 0.32)};
    transition: opacity 0.35s;
  }
  @media (prefers-reduced-motion: reduce) { transition: none; }

  .n { margin: 0; display: flex; flex-wrap: wrap; align-items: center; gap: 8px; font: 600 11px/1 var(--rj-mono); letter-spacing: 0.08em; text-transform: uppercase; color: var(--rj-ink-3); }
  .inline { margin: 16px 0 6px; @media (min-width: 1000px) { display: none; } }
  h2 { margin: 14px 0 0; font-size: clamp(28px, 6.6vw, 40px); font-weight: 700; line-height: 1.08; letter-spacing: -0.035em; color: var(--rj-ink); text-wrap: balance; }
  @media (min-width: 1000px) { h2 { font-size: clamp(30px, 2.9vw, 40px); } }
  p { margin: 14px 0 0; max-width: 30em; font-size: 17px; line-height: 1.6; color: var(--rj-ink-2); }
  p b { color: var(--rj-ink); font-weight: 600; }
`;

const Tag = styled.span<{ $free?: boolean }>`
  padding: 4px 7px;
  border-radius: 6px;
  font: 700 10px/1 var(--rj-mono);
  letter-spacing: 0.07em;
  text-transform: uppercase;
  color: ${({ $free }) => ($free ? "#0d0e10" : "var(--rj-ink-2)")};
  background: ${({ $free }) => ($free ? "var(--rj-hl)" : "none")};
  box-shadow: ${({ $free }) => ($free ? "none" : "inset 0 0 0 1.5px var(--rj-line)")};
`;

const Note = styled.span<{ $kind: StoryStep["kind"] }>`
  margin-top: 14px;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font: 500 12.5px/1.4 var(--rj-mono);
  color: var(--rj-ink-2);

  i { flex: none; width: 8px; height: 8px; border-radius: 50%; ${({ $kind }) => ($kind === "code" ? "background: var(--rj-ink);" : "box-shadow: inset 0 0 0 1.5px var(--rj-ink);")} }
`;

const Stage = styled.div`
  display: none;

  @media (min-width: 1000px) {
    display: grid;
    grid-column: 3;
    grid-row: 1;
    position: sticky;
    top: 110px;
    align-self: start;
    min-height: 560px;

    /* All states share one box, so the card never jumps between chapters. */
    > div { grid-area: 1 / 1; height: 100%; opacity: 0; transform: translateY(10px) scale(0.985); transition: opacity 0.45s, transform 0.55s ${ease}; pointer-events: none; }
    > div[data-on="true"] { opacity: 1; transform: none; pointer-events: auto; }
    > div > * { height: 100%; }
  }
  @media (prefers-reduced-motion: reduce) { > div { transition: none; } }
`;

/* ---------------------------------------------------------------- stage cards */

const beamMove = keyframes`0%, 100% { top: 6%; } 50% { top: 92%; }`;

const Card = styled.div`
  position: relative;
  overflow: hidden;
  padding: 14px;
  border-radius: 24px;
  background: var(--rj-surface);
  box-shadow: 0 0 0 1px var(--rj-line), 0 30px 60px -40px rgba(0, 0, 0, 0.4);

  .k { margin: 2px 4px 10px; display: flex; justify-content: space-between; font: 600 10.5px/1 var(--rj-mono); letter-spacing: 0.08em; text-transform: uppercase; color: var(--rj-ink-3); }

  .canva { position: relative; display: grid; grid-template-columns: 32% 1fr; min-height: 210px; overflow: hidden; border-radius: 12px; background: #fbfbf9; box-shadow: 0 0 0 1px rgba(13, 14, 16, 0.08); }
  .canva .side { display: grid; gap: 6px; align-content: start; padding: 14px 10px; background: #6f9c99; }
  .canva .side .ph { width: 44px; height: 44px; margin-bottom: 6px; border-radius: 50%; background: rgba(255, 255, 255, 0.45); }
  .canva i { display: block; height: 4px; border-radius: 2px; background: rgba(255, 255, 255, 0.5); }
  .canva .main { display: grid; gap: 6px; align-content: start; padding: 0 12px 12px; }
  .canva .band { margin: 0 -12px 8px; padding: 14px 12px; font: 700 16px/1 var(--rj-font); letter-spacing: 0.14em; color: #2b2e33; background: #edcdbe; }
  .canva .main i { background: #d7d8d3; }
  .canva .main i.h { width: 40%; margin-top: 4px; background: #9c9fa6; }
  .beam { position: absolute; left: 0; right: 0; top: 10%; height: 2px; background: #ffe14d; box-shadow: 0 0 14px 3px rgba(255, 225, 77, 0.6); animation: ${beamMove} 3.4s cubic-bezier(0.45, 0, 0.55, 1) infinite; }
  @media (prefers-reduced-motion: reduce) { .beam { animation: none; } }

  .term { margin-top: 10px; max-height: 200px; overflow: hidden; padding: 12px 14px; border-radius: 12px; white-space: pre; font: 500 10.5px/1.75 var(--rj-mono); color: var(--rj-term-ink); background: var(--rj-term); }
  .term b { font-weight: 500; color: var(--rj-term-dim); }
`;

const Read = ({ text }: { text: string }) => (
  <Card>
    <div className="k"><span>maya_chen_resume.pdf</span><span>Reading</span></div>
    <div className="canva" aria-hidden="true">
      <div className="side"><span className="ph" /><i /><i style={{ width: "70%" }} /><i style={{ width: "85%" }} /><i style={{ marginTop: 8 }} /><i style={{ width: "60%" }} /></div>
      <div className="main"><div className="band">MAYA CHEN</div><i className="h" /><i /><i style={{ width: "80%" }} /><i style={{ width: "70%" }} /><i className="h" /><i /><i style={{ width: "75%" }} /></div>
      <span className="beam" />
    </div>
    <div className="term" role="img" aria-label="The text an ATS pulls out of Maya's two-column resume, with the columns read side by side">
      <b>{"// text the ATS pulled out\n"}</b>
      {text}
    </div>
  </Card>
);

const ScoreCard = styled(Card)`
  .top { display: flex; align-items: center; gap: 16px; padding: 4px 4px 12px; }
  svg { flex: none; width: 74px; height: 74px; transform: rotate(-90deg); }
  strong { font-size: 34px; letter-spacing: -0.045em; color: var(--rj-ink); }
  .top span { display: block; font-size: 13.5px; color: var(--rj-ink-2); }
  .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
  section { padding: 10px 12px; border-radius: 12px; background: var(--rj-paper); }
  h4 { margin: 0 0 6px; font-size: 11.5px; color: var(--rj-ink); }
  ul { list-style: none; margin: 0; padding: 0; display: grid; gap: 2px; }
  li { display: grid; grid-template-columns: 10px minmax(0, 1fr) auto; gap: 6px; align-items: center; font-size: 11px; line-height: 1.5; color: var(--rj-ink-2); }
  li i { width: 8px; height: 8px; border-radius: 50%; background: var(--rj-pass); }
  li.no { color: var(--rj-ink); }
  li.no i { background: var(--rj-pen); }
  li em { font: 500 10px var(--rj-mono); font-style: normal; color: var(--rj-ink-3); }
`;

const Score = ({ scores }: { scores: StoryScores }) => {
  const failed = scores.beforeChecks.filter((c) => !c.passed).length;
  const circ = 2 * Math.PI * 42;
  const groups = Object.keys(CATEGORY_NAMES).map((k) => ({ k, items: scores.beforeChecks.filter((c) => c.category === k) }));
  return (
    <ScoreCard>
      <div className="top">
        <svg viewBox="0 0 100 100" aria-hidden="true">
          <circle cx="50" cy="50" r="42" fill="none" stroke="var(--rj-line)" strokeWidth="9" />
          <circle cx="50" cy="50" r="42" fill="none" stroke="var(--rj-ink)" strokeWidth="9" strokeLinecap="round" strokeDasharray={circ} strokeDashoffset={circ * (1 - scores.before / 100)} />
        </svg>
        <div><strong>{scores.before}</strong><span>{failed} of {scores.beforeChecks.length} checks fail. Same file, same score, every time.</span></div>
      </div>
      <div className="grid">
        {groups.map((g) => (
          <section key={g.k}>
            <h4>{CATEGORY_NAMES[g.k]}</h4>
            <ul>
              {g.items.map((c) => (
                <li key={c.name} className={c.passed ? undefined : "no"}>
                  <i aria-hidden="true" />{c.name}<em>{c.points}</em>
                  <span style={{ position: "absolute", width: 1, height: 1, overflow: "hidden", clip: "rect(0 0 0 0)" }}>{c.passed ? "passes" : "fails"}</span>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </ScoreCard>
  );
};

const MatchCard = styled(Card)`
  .job { padding: 16px; border-radius: 14px; color: #1b1c20; background: #ffffff; box-shadow: 0 0 0 1px rgba(13, 14, 16, 0.08); }
  .job .kk { font: 600 10px/1 var(--rj-mono); letter-spacing: 0.08em; text-transform: uppercase; color: #80848d; }
  h4 { margin: 6px 0 12px; font-size: 17px; letter-spacing: -0.02em; color: #1b1c20; }
  ul { list-style: none; margin: 0; padding: 0; display: grid; gap: 8px; }
  li { display: grid; grid-template-columns: 20px minmax(0, 1fr) auto; gap: 4px 10px; align-items: center; font-size: 14px; font-weight: 600; }
  .bx { width: 20px; height: 20px; display: grid; place-items: center; border-radius: 6px; font-size: 11px; font-weight: 800; box-shadow: inset 0 0 0 1.5px rgba(13, 14, 16, 0.22); }
  li.ok .bx { color: #0d0e10; background: #ffe14d; box-shadow: none; }
  em { font: 500 11px var(--rj-mono); font-style: normal; color: #80848d; }
  li:not(.ok) em { color: #c42b22; }
  .why { grid-column: 2 / -1; margin-top: -2px; font-size: 12px; font-weight: 400; color: #6a6e76; }
  .m { margin-top: 12px; padding-top: 10px; display: flex; justify-content: space-between; border-top: 1px dashed rgba(13, 14, 16, 0.14); font: 600 12px var(--rj-mono); color: #80848d; }
  .m b { color: #0d0e10; }
`;

const Match = () => (
  <MatchCard>
    <div className="job">
      <div className="kk">Job post</div>
      <h4>{JOB}</h4>
      <ul>
        {KEYWORDS.map((k) => (
          <li key={k.term} className={k.found ? "ok" : undefined}>
            <span className="bx" aria-hidden="true">{k.found ? "✓" : ""}</span>{k.term}<em>{k.found ? "found" : "missing"}</em>
            <span className="why">{k.why}</span>
          </li>
        ))}
      </ul>
      <div className="m"><span>Keywords from the post</span><b>{KEYWORDS.filter((k) => k.found).length} / {KEYWORDS.length}</b></div>
    </div>
  </MatchCard>
);

const RewriteCard = styled(Card)`
  .rows { display: grid; gap: 10px; }
  .row { display: grid; gap: 8px; padding: 12px 14px; border-radius: 14px; background: var(--rj-paper); }
  s { font-size: 14px; color: var(--rj-ink-3); text-decoration-color: var(--rj-pen); }
  .ask { justify-self: start; display: inline-flex; align-items: center; gap: 8px; padding: 6px 10px; border-radius: 999px; font-size: 12.5px; color: var(--rj-ink-2); background: var(--rj-surface); box-shadow: inset 0 0 0 1px var(--rj-line); }
  .ask b { padding: 2px 6px; border-radius: 5px; font: 700 11.5px var(--rj-mono); color: #0d0e10; background: var(--rj-hl); }
  .new { font-size: 15px; font-weight: 600; color: var(--rj-ink); }
  .new mark { padding: 0 2px; border-radius: 3px; color: inherit; background: color-mix(in srgb, var(--rj-hl) 55%, transparent); }
  ul { list-style: none; margin: 4px 0 0; padding: 0; display: grid; gap: 6px; font: 500 12px/1.4 var(--rj-mono); color: var(--rj-ink-2); }
  li::before { content: "✕ "; font-weight: 700; color: var(--rj-pen); }
`;

const Rewrite = () => (
  <RewriteCard>
    <div className="rows">
      {REWRITES.map((r) => (
        <div className="row" key={r.before}>
          <s>{r.before}</s>
          {r.ask && <span className="ask">{r.ask.q} <b>{r.ask.a}</b></span>}
          <span className="new">{r.after[0]}<mark>{r.after[1]}</mark>{r.after[2]}</span>
        </div>
      ))}
      <ul aria-label="Rules">{RULES.map((r) => <li key={r}>{r}</li>)}</ul>
    </div>
  </RewriteCard>
);

const RebuildCard = styled(Card)`
  .d { display: flex; align-items: center; gap: 12px; padding: 2px 4px 10px; }
  .d s { font-size: 26px; color: var(--rj-ink-3); text-decoration-thickness: 2px; }
  .d big { font-size: 34px; font-weight: 700; letter-spacing: -0.045em; color: var(--rj-ink); }
  .d span { font-size: 12.5px; line-height: 1.4; color: var(--rj-ink-2); }
  .doc { max-height: 300px; overflow: hidden; padding: 14px 16px; border-radius: 12px; white-space: pre-line; font: 500 10.5px/1.6 var(--rj-font); color: #22242a; background: #fbfbf9; box-shadow: 0 0 0 1px rgba(13, 14, 16, 0.08); }
  .doc b { display: block; margin-top: 6px; padding-bottom: 2px; border-bottom: 1px solid #d5d6d1; font-size: 9.5px; letter-spacing: 0.14em; }
  .doc b.name { margin-top: 0; border: 0; font-size: 14px; letter-spacing: -0.01em; }
`;

const HEADINGS = new Set(["EXPERIENCE", "PROJECTS", "EDUCATION", "SKILLS"]);

const Rebuild = ({ scores, text }: { scores: StoryScores; text: string }) => {
  const lines = text.split("\n").filter((l) => l.trim());
  return (
    <RebuildCard>
      <div className="d">
        <s>{scores.before}</s><big>{scores.after}</big>
        <span>Same 19 checks. Still failing: {scores.stillFailing.join(", ")}. Those are yours to add.</span>
      </div>
      <div className="doc">
        {lines.map((l, i) => (i === 0 ? <b className="name" key={i}>{l}</b> : HEADINGS.has(l.trim()) ? <b key={i}>{l}</b> : <span key={i}>{l}{"\n"}</span>))}
      </div>
    </RebuildCard>
  );
};

const ApplyCard = styled(Card)`
  .g { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
  .c { display: grid; gap: 6px; align-content: start; padding: 12px 14px; border-radius: 14px; background: var(--rj-paper); }
  .c.w { grid-column: 1 / -1; }
  .kk { font: 600 10px/1 var(--rj-mono); letter-spacing: 0.08em; text-transform: uppercase; color: var(--rj-ink-3); }
  .c p { margin: 0; font-size: 12.5px; color: var(--rj-ink); }
  .c i { display: block; height: 5px; border-radius: 3px; background: color-mix(in srgb, var(--rj-ink) 12%, transparent); }
`;

const Apply = () => (
  <ApplyCard>
    <div className="g">
      <div className="c w"><span className="kk">{JOB}</span><p><b>{KEYWORDS_AFTER}</b> keywords from the post. A/B testing stays missing.</p></div>
      <div className="c" aria-label="A cover letter for this job"><span className="kk">Cover letter</span><p>Dear Hiring Manager,</p><i /><i style={{ width: "85%" }} /><i style={{ width: "92%" }} /><i style={{ width: "55%" }} /></div>
      <div className="c" aria-label="Interview prep for this job"><span className="kk">Interview prep</span><p>Questions for this job</p><i /><i style={{ width: "80%" }} /><i style={{ width: "90%" }} /><i style={{ width: "60%" }} /></div>
    </div>
  </ApplyCard>
);

/* ---------------------------------------------------------------- after the story */

const Section = styled.section`
  padding-top: 64px;

  h2 { margin: 10px 0 0; font-size: clamp(28px, 6.6vw, 44px); font-weight: 700; line-height: 1.06; letter-spacing: -0.04em; color: var(--rj-ink); text-wrap: balance; }
  .lede { margin: 12px 0 0; max-width: 34em; font-size: 15px; line-height: 1.55; color: var(--rj-ink-2); }
`;

const Split = styled.div`
  margin-top: 24px;
  display: grid;
  gap: 12px;

  @media (min-width: 640px) { grid-template-columns: 1fr 1fr; }

  section { padding: 20px; border-radius: 22px; background: var(--rj-surface); box-shadow: 0 0 0 1px var(--rj-line); }
  h3 { margin: 0; display: flex; align-items: center; gap: 10px; font-size: 18px; letter-spacing: -0.02em; color: var(--rj-ink); }
  h3 i { width: 10px; height: 10px; border-radius: 50%; background: var(--rj-ink); }
  section.ai h3 i { background: none; box-shadow: inset 0 0 0 2px var(--rj-ink); }
  p { margin: 8px 0 12px; font-size: 14.5px; line-height: 1.5; color: var(--rj-ink-2); }
  ul { list-style: none; margin: 0; padding: 12px 0 0; display: grid; gap: 8px; border-top: 1px solid var(--rj-line); font-size: 14.5px; color: var(--rj-ink); }
  li { display: flex; justify-content: space-between; gap: 12px; }
  li span { font: 500 12px var(--rj-mono); color: var(--rj-ink-3); text-align: right; }
`;

const Costs = styled.ol`
  list-style: none;
  margin: 24px 0 0;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1px;
  overflow: hidden;
  border-radius: 20px;
  background: var(--rj-line);
  box-shadow: 0 0 0 1px var(--rj-line);

  @media (min-width: 640px) { grid-template-columns: repeat(3, minmax(0, 1fr)); }
  @media (min-width: 1000px) { grid-template-columns: repeat(6, minmax(0, 1fr)); }

  li { display: grid; gap: 8px; align-content: start; padding: 16px; background: var(--rj-surface); }
  .i { font: 600 10.5px var(--rj-mono); color: var(--rj-ink-3); }
  b { font-size: 15px; color: var(--rj-ink); }
  .tags { display: flex; flex-wrap: wrap; gap: 6px; }
`;

const End = styled.div`
  margin: 64px 0 80px;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 18px 24px;
  padding: 28px 24px;
  border-radius: 28px;
  color: var(--rj-bridge-ink);
  background: var(--rj-bridge);

  @media (min-width: 640px) { padding: 32px 36px; }

  p { margin: 0; font-size: clamp(22px, 5vw, 30px); font-weight: 700; line-height: 1.15; letter-spacing: -0.035em; }
  p span { color: var(--rj-bridge-ink-2); }
  a { height: 50px; padding: 0 24px; display: inline-flex; align-items: center; gap: 8px; border-radius: 999px; font-weight: 600; color: #0d0e10; background: #f2f2ef; text-decoration: none; }
  a svg { width: 15px; height: 15px; }
  a:hover { color: #0d0e10; }
  a:focus-visible { outline: 2px solid #f2f2ef; outline-offset: 3px; }
`;

const Arrow = () => (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M3 8h10M9 4l4 4-4 4" /></svg>
);

/* ---------------------------------------------------------------- component */

export function HowItWorks({ scores, beforeText, afterText }: { scores: StoryScores; beforeText: string; afterText: string }) {
  const [active, setActive] = useState(0);
  const storyRef = useRef<HTMLDivElement>(null);
  const chapterRefs = useRef<(HTMLElement | null)[]>([]);

  const copy: Record<StoryStep["key"], ReactNode> = {
    read: <>A parser doesn&apos;t see your design. It pulls the text out of your file, left to right. Maya&apos;s Canva template turns into this: her profile and her internship read side by side, headings merged.</>,
    score: <>Layout, sections, contact details, numbers, length. Each check passes or fails and is worth set points. Maya gets <b>{scores.before}</b>, with the fix for every failed check.</>,
    match: <>Paste the post. Rejectly finds its keywords and checks which ones your resume actually has. Maya has SQL, Python and Tableau. <b>Predictive modeling</b> is in her project, in other words; <b>A/B testing</b> isn&apos;t there at all.</>,
    rewrite: <>Weak verbs get stronger, vague lines get specific. When a line needs a number, Rejectly asks you for it. A skill you don&apos;t have stays missing; we tell you instead of writing it in.</>,
    rebuild: <>The ATS Optimizer rebuilds the layout as one column with standard headings and bullets, keeps your facts, and runs the same 19 checks. Maya goes from <b>{scores.before} to {scores.after}</b>. {scores.stillFailing.length} checks still fail, and we say so.</>,
    apply: <>The same match report writes a cover letter for that job and prepares you for its interview questions. Nothing new gets added about you.</>,
  };

  const stage: Record<StoryStep["key"], ReactNode> = {
    read: <Read text={beforeText} />,
    score: <Score scores={scores} />,
    match: <Match />,
    rewrite: <Rewrite />,
    rebuild: <Rebuild scores={scores} text={afterText} />,
    apply: <Apply />,
  };

  // The chapter in the middle of the screen drives the stage; the rail follows the story.
  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const mid = window.innerHeight * 0.5;
      let cur = 0;
      chapterRefs.current.forEach((el, i) => { if (el && el.getBoundingClientRect().top <= mid) cur = i; });
      setActive(cur);
      const story = storyRef.current;
      if (story) {
        const r = story.getBoundingClientRect();
        const p = Math.max(0, Math.min(1, (window.innerHeight * 0.4 - r.top) / Math.max(1, r.height - window.innerHeight * 0.6)));
        story.style.setProperty("--rail", `${p * 100}%`);
      }
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => { window.removeEventListener("scroll", onScroll); window.removeEventListener("resize", onScroll); if (raf) cancelAnimationFrame(raf); };
  }, []);

  return (
    <Root>
      <In>
        <Hero>
          <p className="eyebrow">How it works</p>
          <h1>Follow one resume from upload to <mark>interview</mark>.</h1>
          <p className="sub">This is Maya&apos;s. A Canva template, an economics degree, one internship. Here&apos;s everything Rejectly does to it, what each step costs, and which parts are AI.</p>
          <div className="ctas">
            <Btn href={ROUTES.PUBLIC.ATS_CHECK}>Scan my resume free <Arrow /></Btn>
            <TextLink href="#ai-or-code">What&apos;s AI, what&apos;s code</TextLink>
          </div>
        </Hero>

        <Story ref={storyRef}>
          <Rail aria-hidden="true"><span className="f" /><span className="b" /></Rail>
          <Chapters>
            {STEPS.map((s, i) => (
              <Chapter key={s.key} id={`step-${i + 1}`} $on={active === i} ref={(el) => { chapterRefs.current[i] = el; }} aria-labelledby={`step-${i + 1}-h`}>
                <p className="n">
                  0{i + 1} · {s.label}
                  {s.price.map((p) => <Tag key={p.text} $free={p.free}>{p.text}</Tag>)}
                </p>
                <div className="inline">{stage[s.key]}</div>
                <h2 id={`step-${i + 1}-h`}>{s.title}</h2>
                <p>{copy[s.key]}</p>
                <Note $kind={s.kind}><i aria-hidden="true" />{s.note}</Note>
              </Chapter>
            ))}
          </Chapters>
          <Stage aria-hidden="true">
            {STEPS.map((s, i) => <div key={s.key} data-on={active === i}>{stage[s.key]}</div>)}
          </Stage>
        </Story>

        <Section id="ai-or-code" aria-labelledby="hiw-ai">
          <p className="eyebrow">What&apos;s AI, what&apos;s code</p>
          <h2 id="hiw-ai">The score never guesses. The writing follows rules.</h2>
          <Split>
            <section>
              <h3><i aria-hidden="true" />Code</h3>
              <p>Runs the same way every time. Same file in, same result out.</p>
              <ul>
                <li>Reading your file <span>parser</span></li>
                <li>The 19 checks and your score <span>fixed rules</span></li>
                <li>The rebuilt layout <span>template</span></li>
              </ul>
            </section>
            <section className="ai">
              <h3><i aria-hidden="true" />AI, with rules</h3>
              <p>Writes, within limits: no inflated roles, no invented numbers, no skills you don&apos;t have.</p>
              <ul>
                <li>Matching to a job post <span>keywords</span></li>
                <li>Rewriting your lines <span>your facts only</span></li>
                <li>Cover letter and interview prep <span>from your report</span></li>
              </ul>
            </section>
          </Split>
        </Section>

        <Section aria-labelledby="hiw-cost">
          <p className="eyebrow">What it costs</p>
          <h2 id="hiw-cost">Free until you want it fixed.</h2>
          <Costs>
            {STEPS.map((s, i) => (
              <li key={s.key}>
                <span className="i">0{i + 1}</span>
                <b>{s.label}</b>
                <span className="tags">{s.price.map((p) => <Tag key={p.text} $free={p.free}>{p.text}</Tag>)}</span>
              </li>
            ))}
          </Costs>
          <p className="lede">
            One credit is ${PRICING.SINGLE.price}, {PRICING.STARTER.credits} are ${PRICING.STARTER.price}, or Pro is ${PRICING.PRO.price} a month for unlimited. Credits never expire.
          </p>
        </Section>

        <End>
          <p>Your turn. <span>See what the ATS reads in yours.</span></p>
          <Link href={ROUTES.PUBLIC.ATS_CHECK}>Scan my resume free <Arrow /></Link>
        </End>
      </In>
    </Root>
  );
}

export default HowItWorks;

