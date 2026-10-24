"use client";

import { useEffect, useState } from "react";
import styled from "styled-components";
import { useReducedMotion } from "framer-motion";
import { ROUTES } from "@/lib/constants";
import type { MatchResult } from "./types";

/*
 * The result is the job card from "Why it happens", filled with the visitor's data:
 * found requirements get the yellow tick; each missing one says whether the resume
 * already shows it in other words (a verified quote) or doesn't — and that Rejectly
 * won't add it.
 */

const R = 44;
const C = 2 * Math.PI * R;

const Grid = styled.div`
  display: grid;
  gap: 12px;

  @media (min-width: 640px) {
    grid-template-columns: 1.1fr 1fr;
    align-items: start;
    gap: 14px;
  }
`;

/* Two natural-height columns on tablet and up; one ordered stack on phones. */
const Col = styled.div`
  display: contents;

  @media (min-width: 640px) {
    display: grid;
    gap: 14px;
    align-content: start;
  }
`;

const Reveal = styled.div<{ $in: boolean; $delay?: number; $order: number }>`
  order: ${({ $order }) => $order};
  opacity: ${({ $in }) => ($in ? 1 : 0)};
  transform: translateY(${({ $in }) => ($in ? 0 : 10)}px);
  transition: opacity 0.5s, transform 0.55s cubic-bezier(0.3, 0, 0.2, 1);
  transition-delay: ${({ $delay = 0 }) => $delay}s;

  @media (min-width: 640px) {
    order: 0;
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`;

const Panel = styled.div`
  padding: 22px;
  border-radius: 20px;
  background: var(--rj-tile);
`;

const ScoreRow = styled.div`
  display: flex;
  align-items: center;
  gap: 18px;
`;

const Ring = styled.div`
  position: relative;
  flex: none;
  width: 104px;
  height: 104px;

  svg {
    width: 100%;
    height: 100%;
    transform: rotate(-90deg);
  }

  circle {
    fill: none;
    stroke-width: 7;
    stroke-linecap: round;
  }

  .trk { stroke: var(--rj-line); }
  .pot { stroke: var(--rj-hl); opacity: 0.55; transition: stroke-dashoffset 1s cubic-bezier(0.4, 0, 0.2, 1) 0.5s; }
  .val { transition: stroke-dashoffset 1s cubic-bezier(0.4, 0, 0.2, 1); }

  b {
    position: absolute;
    inset: 0;
    display: grid;
    place-items: center;
    font-size: 34px;
    font-weight: 700;
    letter-spacing: -0.04em;
    font-variant-numeric: tabular-nums;
    color: var(--rj-ink);
  }

  @media (prefers-reduced-motion: reduce) {
    .pot, .val { transition: none; }
  }
`;

const Kicker = styled.div`
  font: 600 10.5px/1 var(--rj-mono);
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--rj-ink-3);
`;

const ScoreText = styled.div`
  min-width: 0;

  h3 {
    margin: 6px 0 0;
    font-size: 19px;
    line-height: 1.2;
    letter-spacing: -0.02em;
    color: var(--rj-ink);
  }

  p {
    margin: 6px 0 0;
    font-size: 13.5px;
    color: var(--rj-ink-2);
  }

  p b { color: var(--rj-ink); }
`;

const Summary = styled.p`
  margin: 14px 0 0;
  font-size: 15px;
  line-height: 1.55;
  color: var(--rj-ink-2);
`;

const JobCard = styled.div`
  padding: 18px;
  border-radius: 16px;
  background: #ffffff;
  color: var(--rj-doc-ink);
  box-shadow: 0 0 0 1px rgba(13, 14, 16, 0.08), 0 22px 44px -26px rgba(0, 0, 0, 0.35);

  .k {
    font: 600 10.5px/1 var(--rj-mono);
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: #80848d;
  }

  h4 {
    margin: 6px 0 0;
    font-size: 17px;
    letter-spacing: -0.02em;
    color: var(--rj-doc-ink);
  }

  ul {
    list-style: none;
    margin: 14px 0 0;
    padding: 0;
    display: grid;
    gap: 9px;
  }
`;

const Item = styled.li<{ $ok: boolean; $in: boolean; $delay: number }>`
  display: grid;
  grid-template-columns: 20px minmax(0, 1fr) auto;
  gap: 4px 10px;
  align-items: center;
  font-size: 14.5px;
  font-weight: 600;
  opacity: ${({ $in }) => ($in ? 1 : 0)};
  transform: translateY(${({ $in }) => ($in ? 0 : 6)}px);
  transition: opacity 0.35s, transform 0.35s;
  transition-delay: ${({ $delay }) => $delay}s;

  .bx {
    width: 20px;
    height: 20px;
    display: grid;
    place-items: center;
    border-radius: 6px;
    font-size: 12px;
    font-weight: 800;
    color: #0d0e10;
    background: ${({ $ok }) => ($ok ? "#FFE14D" : "transparent")};
    box-shadow: ${({ $ok }) => ($ok ? "none" : "inset 0 0 0 1.5px rgba(13,14,16,.22)")};
  }

  .st {
    font: 500 11px/1 var(--rj-mono);
    color: ${({ $ok }) => ($ok ? "#80848D" : "#C42B22")};
  }

  .note {
    grid-column: 2 / -1;
    font-size: 12.5px;
    font-weight: 400;
    line-height: 1.4;
    color: #6a6e76;
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`;

const CardFoot = styled.div`
  margin-top: 14px;
  padding-top: 12px;
  border-top: 1px dashed rgba(13, 14, 16, 0.14);
  display: flex;
  justify-content: space-between;
  font: 600 12px/1 var(--rj-mono);
  color: #80848d;

  b { color: #138a52; }
`;

const Fixes = styled(Panel)`
  h3 {
    margin: 0;
    font-size: 19px;
    letter-spacing: -0.02em;
    color: var(--rj-ink);
  }

  ol {
    margin: 14px 0 0;
    padding: 0;
    list-style: none;
    display: grid;
    gap: 12px;
    counter-reset: fx;
  }

  ol li {
    counter-increment: fx;
    display: grid;
    grid-template-columns: 26px 1fr;
    gap: 10px;
    font-size: 14.5px;
    line-height: 1.45;
    color: var(--rj-ink-2);
  }

  ol li::before {
    content: counter(fx);
    width: 26px;
    height: 26px;
    display: grid;
    place-items: center;
    border-radius: 50%;
    font: 700 12px/1 var(--rj-mono);
    color: var(--rj-paper);
    background: var(--rj-ink);
  }

  details { margin-top: 14px; }

  summary {
    display: inline-flex;
    gap: 6px;
    align-items: center;
    list-style: none;
    cursor: pointer;
    font-size: 14px;
    font-weight: 500;
    color: var(--rj-ink);
  }

  summary::-webkit-details-marker { display: none; }
  summary::after { content: "↓"; font-size: 12px; transition: transform 0.2s; }
  details[open] summary::after { transform: rotate(180deg); }

  details ul {
    margin: 12px 0 0;
    padding-left: 18px;
    display: grid;
    gap: 8px;
    font-size: 14px;
    line-height: 1.45;
    color: var(--rj-ink-2);
  }
`;

const Cta = styled.div`
  display: grid;
  gap: 14px;
  padding: 24px;
  border-radius: 20px;
  background: var(--rj-bridge);
  color: var(--rj-bridge-ink);

  h3 {
    margin: 0;
    font-size: 22px;
    line-height: 1.15;
    letter-spacing: -0.03em;
    color: var(--rj-bridge-ink);
  }

  p {
    margin: 4px 0 0;
    font-size: 14.5px;
    line-height: 1.5;
    color: var(--rj-bridge-ink-2);
  }

  .row {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 10px 16px;
  }

  .small {
    font-size: 12.5px;
    color: var(--rj-bridge-ink-2);
  }

  a {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    height: 48px;
    padding: 0 22px;
    border-radius: 999px;
    font-size: 15.5px;
    font-weight: 600;
    text-decoration: none;
    color: #0d0e10;
    background: var(--rj-hl);
    transition: transform 0.15s ease;
  }

  a:hover { color: #0d0e10; transform: translateY(-1px); }
  a:focus-visible { outline: 2px solid var(--rj-hl); outline-offset: 3px; }
  a svg { width: 16px; height: 16px; }
`;

function ringColor(score: number) {
  return score >= 75 ? "var(--rj-pass)" : "var(--rj-pen)";
}

export function Result({ result }: { result: MatchResult }) {
  const reduce = useReducedMotion();
  const [shown, setShown] = useState(!!reduce);
  const [count, setCount] = useState(reduce ? result.fitScore : 0);

  useEffect(() => {
    if (reduce) return;
    const raf = requestAnimationFrame(() => requestAnimationFrame(() => setShown(true)));
    const t0 = performance.now();
    let frame = 0;
    const tick = (t: number) => {
      const p = Math.min(1, (t - t0) / 1000);
      setCount(Math.round(result.fitScore * (1 - Math.pow(1 - p, 3))));
      if (p < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      cancelAnimationFrame(frame);
    };
  }, [reduce, result.fitScore]);

  const title = result.jobTitle || "This job";
  const matched = result.matchedKeywords;
  const missing = result.missingDetails;
  const total = matched.length + missing.length;
  const fixes = result.quickWins.slice(0, 3);
  const more = result.improvementTips;
  const potential = Math.max(result.potentialScore, result.fitScore);

  return (
    <Grid>
      <Col>
        <Reveal $in={shown} $order={1}>
          <Panel>
            <ScoreRow>
              <Ring>
                <svg viewBox="0 0 100 100" aria-hidden="true">
                  <circle className="trk" cx="50" cy="50" r={R} />
                  <circle className="pot" cx="50" cy="50" r={R} strokeDasharray={C} strokeDashoffset={shown ? C * (1 - potential / 100) : C} />
                  <circle className="val" cx="50" cy="50" r={R} stroke={ringColor(result.fitScore)} strokeDasharray={C} strokeDashoffset={shown ? C * (1 - result.fitScore / 100) : C} />
                </svg>
                <b aria-label={`Match score ${result.fitScore} out of 100`}>{count}</b>
              </Ring>
              <ScoreText>
                <Kicker>Match for this job</Kicker>
                <h3>{title}</h3>
                {potential > result.fitScore && (
                  <p>About <b>{potential}</b> after the fixes below</p>
                )}
              </ScoreText>
            </ScoreRow>
            {result.summary && <Summary>{result.summary}</Summary>}
          </Panel>
        </Reveal>

        {fixes.length > 0 && (
          <Reveal $in={shown} $delay={0.2} $order={3}>
            <Fixes>
              <h3>Fix these first</h3>
              <ol>
                {fixes.map((fix) => <li key={fix}><span>{fix}</span></li>)}
              </ol>
              {more.length > 0 && (
                <details>
                  <summary>See {more.length} more tips</summary>
                  <ul>
                    {more.map((tip) => <li key={tip}>{tip}</li>)}
                  </ul>
                </details>
              )}
            </Fixes>
          </Reveal>
        )}
      </Col>

      <Col>
        <Reveal $in={shown} $delay={0.1} $order={2}>
          <JobCard>
            <span className="k">What the post asks for</span>
            <h4>{title}</h4>
            <ul>
              {matched.map((k, i) => (
                <Item key={`m-${k}`} $ok $in={shown} $delay={0.15 + i * 0.08}>
                  <span className="bx" aria-hidden="true">✓</span>
                  <span>{k}</span>
                  <span className="st">found</span>
                </Item>
              ))}
              {missing.map((m, i) => (
                <Item key={`x-${m.keyword}`} $ok={false} $in={shown} $delay={0.15 + (matched.length + i) * 0.08}>
                  <span className="bx" aria-hidden="true" />
                  <span>{m.keyword}</span>
                  <span className="st">missing</span>
                  <span className="note">
                    {m.foundAs
                      ? <>You did this (&ldquo;{m.foundAs}&rdquo;). Say it in their words.</>
                      : <>We couldn&apos;t find this in your resume. Rejectly won&apos;t add it for you.</>}
                  </span>
                </Item>
              ))}
            </ul>
            {total > 0 && (
              <CardFoot>
                <span>Matched</span>
                <b>{matched.length}/{total}</b>
              </CardFoot>
            )}
          </JobCard>
        </Reveal>

        <Reveal $in={shown} $delay={0.35} $order={4}>
          <Cta>
            <div>
              <h3>Rejectly can rewrite it for this job.</h3>
              <p>In the post&apos;s words, using only what&apos;s true. It asks you for the numbers.</p>
            </div>
            <div className="row">
              <a href={ROUTES.AUTH.SIGNUP}>
                Get my rewritten resume · $2
                <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M3 8h10M9 4l4 4-4 4" />
                </svg>
              </a>
              <span className="small">One-time. Credits never expire.</span>
            </div>
          </Cta>
        </Reveal>
      </Col>
    </Grid>
  );
}
