"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import styled, { css, keyframes } from "styled-components";
import { ROUTES } from "@/lib/constants";

/*
 * /about: why Rejectly exists (a short letter), the promises we cross out in
 * red pen, what's code and what's AI, and who builds it. Every line here has to
 * stay true: no stats, reviews or badges we can't show.
 */

const PROMISES: { was: string; lead: string; rest: string }[] = [
  { was: "Beat the ATS bots.", lead: "Make sure an ATS can read you.", rest: "It's software reading text, not a game to win." },
  { was: "Guaranteed interviews.", lead: "No one can promise that.", rest: "We show you what to fix; the hiring is up to people." },
  { was: "Your AI match score: 92%.", lead: "Nineteen checks, written in code.", rest: "Same resume, same score, and every point explained." },
  { was: "Credits expire in 30 days.", lead: "Credits never expire.", rest: "Use them this week or next year." },
  { was: "Loved by 10,000+ job seekers.", lead: "No numbers or reviews we can't show you.", rest: "When we have them, they'll be real." },
];
/* Slightly uneven strokes, so each line looks drawn by hand. */
const STROKES = ["M2 12 C 30 9, 60 14, 98 10", "M2 10 C 35 13, 70 8, 98 12", "M2 11 C 28 14, 66 7, 98 11", "M2 12 C 40 8, 62 13, 98 9", "M2 10 C 30 12, 72 9, 98 12"];

const ease = "cubic-bezier(0.2, 0.8, 0.2, 1)";
const read = keyframes`0% { left: 0; opacity: 0; } 10% { opacity: 0.9; } 90% { opacity: 0.9; } 100% { left: 100%; opacity: 0; }`;

const mark = css`
  padding: 0 0.06em;
  margin: 0 -0.03em;
  border-radius: 0.08em;
  color: var(--rj-hl-ink);
  /* Highlight only the x-height band, so it never covers the descenders above it. */
  background: linear-gradient(transparent 14%, var(--rj-hl) 14%, var(--rj-hl) 90%, transparent 90%);
  -webkit-box-decoration-break: clone;
  box-decoration-break: clone;
`;

const Root = styled.div`
  background: var(--rj-paper);
  color: var(--rj-ink);
  font-family: var(--rj-font);
  -webkit-font-smoothing: antialiased;
  padding-top: calc(60px + env(safe-area-inset-top, 0px));

  .eyebrow { margin: 0; font: 500 11.5px/1.3 var(--rj-mono); letter-spacing: 0.07em; text-transform: uppercase; color: var(--rj-ink-2); }
  h2 { margin: 10px 0 0; font-size: clamp(30px, 7vw, 52px); font-weight: 700; line-height: 1.04; letter-spacing: -0.045em; color: var(--rj-ink); text-wrap: balance; }
  h2 mark { ${mark} }
  .lede { margin: 14px 0 0; max-width: 34em; font-size: 17px; line-height: 1.55; color: var(--rj-ink-2); }
`;

const In = styled.div`
  max-width: 1240px;
  margin: 0 auto;
  padding: 0 max(20px, env(safe-area-inset-right, 0px)) 0 max(20px, env(safe-area-inset-left, 0px));

  padding-bottom: 72px;

  @media (min-width: 640px) { padding: 0 40px 72px; }
`;

const Hero = styled.header`
  max-width: 900px;
  padding: 48px 0 8px;

  @media (min-width: 640px) { padding-top: 72px; }
  @media (min-width: 1000px) { padding-top: 88px; }

  h1 { margin: 14px 0 0; font-size: clamp(42px, 10.4vw, 88px); font-weight: 700; line-height: 1.02; letter-spacing: -0.05em; color: var(--rj-ink); text-wrap: balance; }
  h1 mark { ${mark} position: relative; }
  /* A thin cursor reads the highlighted word once. */
  h1 mark::after { content: ""; position: absolute; top: 8%; bottom: 6%; left: 0; width: 3px; border-radius: 2px; background: var(--rj-ink); opacity: 0; animation: ${read} 1.4s 0.5s cubic-bezier(0.45, 0, 0.55, 1) both; }
  .sub { margin: 20px 0 0; max-width: 34em; font-size: clamp(17px, 2.2vw, 20px); line-height: 1.55; color: var(--rj-ink-2); }

  @media (prefers-reduced-motion: reduce) { h1 mark::after { animation: none; } }
`;

const Letter = styled.section`
  margin-top: 56px;
  display: grid;
  gap: 28px;

  @media (min-width: 900px) { grid-template-columns: 260px minmax(0, 1fr); gap: 48px; margin-top: 88px; }

  h2 { font-size: clamp(26px, 6vw, 34px); line-height: 1.1; letter-spacing: -0.035em; }
`;

const Paper = styled.div`
  padding: 28px 24px 30px;
  border-radius: 6px;
  background: var(--rj-surface);
  box-shadow: 0 0 0 1px var(--rj-line), 0 30px 60px -40px rgba(0, 0, 0, 0.35);

  @media (min-width: 640px) { padding: 48px 56px 50px; }

  p { margin: 0 0 18px; max-width: 36em; font-size: 17.5px; line-height: 1.65; color: var(--rj-ink-2); }
  p:first-child { font-size: clamp(20px, 3vw, 23px); line-height: 1.45; letter-spacing: -0.012em; color: var(--rj-ink); }
  .sign { margin: 26px 0 0; display: flex; align-items: center; gap: 12px; font: 500 13px var(--rj-mono); color: var(--rj-ink-3); }
  .sign::before { content: ""; width: 28px; height: 1.5px; background: var(--rj-ink-3); }
`;

const Pen = styled.section`
  margin-top: 80px;

  @media (min-width: 900px) { margin-top: 120px; }
`;

const Rows = styled.ul`
  list-style: none;
  margin: 32px 0 0;
  padding: 0;
  border-top: 1px solid var(--rj-line);
`;

const Row = styled.li<{ $on: boolean }>`
  display: grid;
  gap: 8px;
  padding: 20px 0;
  border-bottom: 1px solid var(--rj-line);

  @media (min-width: 760px) { grid-template-columns: minmax(0, 1fr) 28px minmax(0, 1.15fr); gap: 16px; align-items: center; padding: 24px 0; }

  .was { position: relative; justify-self: start; font-size: clamp(19px, 3vw, 24px); font-weight: 600; letter-spacing: -0.02em; color: var(--rj-ink-3); }
  .was svg { position: absolute; left: -4%; top: 50%; width: 108%; height: 22px; margin-top: -10px; overflow: visible; pointer-events: none; }
  .was path { fill: none; stroke: var(--rj-pen); stroke-width: 2.6; stroke-linecap: round; stroke-dasharray: 1; stroke-dashoffset: ${({ $on }) => ($on ? 0 : 1)}; transition: stroke-dashoffset 0.5s 0.12s cubic-bezier(0.6, 0, 0.3, 1); }
  .arrow { display: none; color: var(--rj-ink-3); }
  @media (min-width: 760px) { .arrow { display: block; } }
  .is { margin: 0; font-size: clamp(17px, 2.4vw, 19px); line-height: 1.45; color: var(--rj-ink); }
  .is b { font-weight: 600; }
  @media (max-width: 759px) {
    .is::before { content: "We say"; display: block; margin-bottom: 4px; font: 600 10px/1.2 var(--rj-mono); letter-spacing: 0.08em; text-transform: uppercase; color: var(--rj-ink-3); }
  }
  .sr { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap; }

  @media (prefers-reduced-motion: reduce) { .was path { transition: none; stroke-dashoffset: 0; } }
`;

const How = styled.section`
  margin-top: 88px;

  @media (min-width: 900px) { margin-top: 128px; }
`;

const Split = styled.div`
  margin-top: 32px;
  display: grid;
  gap: 14px;

  @media (min-width: 760px) { grid-template-columns: 1fr 1fr; gap: 16px; }
`;

const Card = styled.article`
  padding: 24px;
  border-radius: 24px;
  background: var(--rj-surface);
  box-shadow: 0 0 0 1px var(--rj-line);
  display: grid;
  gap: 14px;
  align-content: start;

  @media (min-width: 640px) { padding: 30px; }

  h3 { margin: 0; font-size: 24px; letter-spacing: -0.03em; color: var(--rj-ink); }
  .text { margin: 0; font-size: 16px; line-height: 1.55; color: var(--rj-ink-2); }
  ul { list-style: none; margin: 4px 0 0; padding: 14px 0 0; border-top: 1px solid var(--rj-line); display: grid; gap: 10px; }
  li { display: flex; justify-content: space-between; gap: 12px; font-size: 15px; color: var(--rj-ink); }
  li span { font: 500 12px var(--rj-mono); color: var(--rj-ink-3); white-space: nowrap; }
  li a { color: var(--rj-ink); text-decoration: underline; text-decoration-color: var(--rj-line); text-underline-offset: 3px; }
  li a:hover { color: var(--rj-ink); text-decoration-color: var(--rj-ink); }
`;

const Term = styled.div`
  padding: 14px 16px;
  border-radius: 14px;
  background: var(--rj-term);
  color: var(--rj-term-ink);
  font: 500 12.5px/1.75 var(--rj-mono);

  .p { color: var(--rj-term-pass); }
  .d { color: var(--rj-term-dim); }
`;

const Suggestion = styled.div<{ $state: "idle" | "kept" | "gone" }>`
  display: grid;
  gap: 8px;

  .ai {
    padding: 12px 14px;
    border-radius: 14px;
    font-size: 14.5px;
    line-height: 1.45;
    color: var(--rj-ink);
    background: var(--rj-tile);
    box-shadow: inset 0 0 0 ${({ $state }) => ($state === "kept" ? "1.5px var(--rj-ink)" : "1px var(--rj-line)")};
    opacity: ${({ $state }) => ($state === "gone" ? 0.35 : 1)};
    text-decoration: ${({ $state }) => ($state === "gone" ? "line-through" : "none")};
    text-decoration-color: var(--rj-pen);
    transition: opacity 0.3s ${ease}, box-shadow 0.3s ${ease};
  }
  .ai small { display: block; margin-bottom: 4px; font: 600 10px var(--rj-mono); letter-spacing: 0.08em; text-transform: uppercase; color: var(--rj-ink-3); }
  .you { justify-self: end; display: flex; gap: 8px; }
  .you button { height: 34px; padding: 0 14px; border: 0; border-radius: 999px; font: 600 13.5px var(--rj-font); cursor: pointer; }
  .you button:focus-visible { outline: 2px solid var(--rj-ink); outline-offset: 2px; }
  .keep { color: var(--rj-btn-ink); background: var(--rj-btn); }
  .drop { color: var(--rj-ink); background: color-mix(in srgb, var(--rj-ink) 6%, transparent); }
`;

const Team = styled.section`
  margin-top: 88px;
  display: grid;
  gap: 20px;

  @media (min-width: 900px) { margin-top: 128px; grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); gap: 48px; align-items: end; }

  .text { margin: 0; max-width: 32em; font-size: 17px; line-height: 1.6; color: var(--rj-ink-2); }
`;

const End = styled.section`
  margin-top: 88px;
  padding: 40px 24px;
  border-radius: 28px;
  background: var(--rj-bridge);
  display: grid;
  gap: 18px;
  justify-items: start;

  @media (min-width: 640px) { padding: 56px; margin-top: 120px; }

  h2 { margin: 0; color: var(--rj-bridge-ink); }
  h2 mark { color: #0d0e10; }
  p { margin: 0; font-size: 16px; color: var(--rj-bridge-ink-2); }
  .acts { display: flex; flex-wrap: wrap; align-items: center; gap: 10px 18px; }
  .go { height: 50px; padding: 0 24px; display: inline-flex; align-items: center; border-radius: 999px; font: 600 16px var(--rj-font); color: #0d0e10; background: var(--rj-hl); text-decoration: none; }
  .go:hover { color: #0d0e10; }
  .ln { font: 600 15px var(--rj-font); color: var(--rj-bridge-ink); text-underline-offset: 4px; }
  .ln:hover { color: var(--rj-bridge-ink); }
  a:focus-visible { outline: 2px solid var(--rj-bridge-ink); outline-offset: 3px; }
`;

function Promise({ was, lead, rest, stroke }: { was: string; lead: string; rest: string; stroke: string }) {
  const ref = useRef<HTMLLIElement>(null);
  const [on, setOn] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setOn(true); io.disconnect(); } }, { threshold: 0.6 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <Row ref={ref} $on={on}>
      <span className="was">
        <span className="sr">Not: </span>{was}
        <svg viewBox="0 0 100 22" preserveAspectRatio="none" aria-hidden="true"><path pathLength={1} d={stroke} /></svg>
      </span>
      <svg className="arrow" width="28" height="14" viewBox="0 0 28 14" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M1 7h25M20 1l6 6-6 6" /></svg>
      <p className="is"><b>{lead}</b> {rest}</p>
    </Row>
  );
}

export function AboutPage() {
  const [suggestion, setSuggestion] = useState<"idle" | "kept" | "gone">("idle");

  return (
    <Root>
      <In>
        <Hero>
          <p className="eyebrow">About Rejectly</p>
          <h1>We show you what the software <mark>sees</mark>.</h1>
          <p className="sub">Before a person reads your resume, an applicant tracking system turns it into text. Rejectly shows you that text, checks it, and helps you fix it. Built for students and new grads.</p>
        </Hero>

        <Letter aria-labelledby="about-why">
          <div>
            <p className="eyebrow">Why it exists</p>
            <h2 id="about-why">It started with our own rejections.</h2>
          </div>
          <Paper>
            <p>We applied for jobs, and so did our friends. Resume after resume went out. Most came back with nothing at all; the rest with the same polite no, a few days later. No one could tell us why.</p>
            <p>So we went looking for what happens after you click Apply. Many employers run every application through an applicant tracking system first. It turns your PDF into plain text and sorts it into sections, and that text is what recruiters search and skim.</p>
            <p>Seen that way, a lot of good resumes fall apart. Two columns read in the wrong order. Contact details vanish into a header. Skills sit inside a graphic the system can&apos;t read. None of it is about how good you are, and all of it can be fixed.</p>
            <p>Rejectly is the tool we wished we&apos;d had: it shows you the text an ATS pulls from your resume, checks it, and helps you rewrite it for the job you want, without making anything up.</p>
            <p className="sign">The Rejectly team</p>
          </Paper>
        </Letter>

        <Pen aria-labelledby="about-pen">
          <p className="eyebrow">What we won&apos;t say</p>
          <h2 id="about-pen">Resume tools love big <mark>promises</mark>. We cross them out.</h2>
          <p className="lede">These are lines you&apos;ll find elsewhere. Here&apos;s what we say instead, and why.</p>
          <Rows>
            {PROMISES.map((p, i) => <Promise key={p.was} {...p} stroke={STROKES[i % STROKES.length]} />)}
          </Rows>
        </Pen>

        <How aria-labelledby="about-how">
          <p className="eyebrow">How it&apos;s built</p>
          <h2 id="about-how">Code where it can be. AI where it helps.</h2>
          <p className="lede">Checking a resume is a job for rules. Rewriting one for a job post is where AI earns its place, as long as you stay in charge.</p>
          <Split>
            <Card>
              <p className="eyebrow">Rules, in code</p>
              <h3>The ATS scan</h3>
              <p className="text">Nineteen checks, written in code. Same resume, same score, every time. It&apos;s free, and it runs in seconds.</p>
              <Term aria-hidden="true">
                <div><span className="p">✓</span> Text extracted <span className="d">· 412 words</span></div>
                <div><span className="p">✓</span> Standard headings <span className="d">· 5 of 5</span></div>
                <div><span className="p">✓</span> Email and phone found</div>
                <div><span className="d">…</span> 16 more checks</div>
              </Term>
              <ul>
                <li><Link href={ROUTES.PUBLIC.ATS_CHECK}>Free ATS scan</Link><span>free</span></li>
                <li><Link href={ROUTES.PUBLIC.CV_BUILDER}>Live score in the resume builder</Link><span>free</span></li>
              </ul>
            </Card>
            <Card>
              <p className="eyebrow">AI, with you deciding</p>
              <h3>The rewrite</h3>
              <p className="text">It works from your resume and the job post, and it&apos;s told not to invent anything. It suggests; you keep what&apos;s true.</p>
              <Suggestion $state={suggestion}>
                <div className="ai" aria-live="polite">
                  <small>{suggestion === "gone" ? "Dropped" : suggestion === "kept" ? "Kept" : "Suggestion"}</small>
                  Built a course-planning app in React used by classmates in two sections of CS 201.
                </div>
                <div className="you">
                  <button type="button" className="drop" onClick={() => setSuggestion("gone")} aria-pressed={suggestion === "gone"}>Not true</button>
                  <button type="button" className="keep" onClick={() => setSuggestion("kept")} aria-pressed={suggestion === "kept"}>Keep</button>
                </div>
              </Suggestion>
              <ul>
                <li><Link href={ROUTES.PUBLIC.PRICING}>Job match and rewrite</Link><span>1 credit</span></li>
                <li>Cover letter and interview prep<span>with a paid match</span></li>
              </ul>
            </Card>
          </Split>
        </How>

        <Team aria-labelledby="about-team">
          <div>
            <p className="eyebrow">Who&apos;s behind it</p>
            <h2 id="about-team">A small, independent team.</h2>
          </div>
          <p className="text">We build Rejectly ourselves, from the scoring rules to the words on this page. When you write to us, the people who build it read your message.</p>
        </Team>

        <End aria-labelledby="about-end">
          <h2 id="about-end">See what the software <mark>sees</mark>.</h2>
          <p>Free, no account needed for the scan.</p>
          <div className="acts">
            <Link className="go" href={ROUTES.PUBLIC.ATS_CHECK}>Free ATS scan</Link>
            <Link className="ln" href={ROUTES.PUBLIC.CONTACT}>Write to us</Link>
          </div>
        </End>
      </In>
    </Root>
  );
}

export default AboutPage;
