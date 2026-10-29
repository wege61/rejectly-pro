"use client";

import { useDeferredValue, useEffect, useMemo } from "react";
import styled from "styled-components";
import type { GeneratedCV } from "@/types/cv";
import { cvPlainText } from "@/lib/pdf/cvGenerator";
import { calculateDeterministicScore } from "@/lib/ats/deterministicScoring";

/*
 * The builder's live ATS score: the same 19 checks as the free scan, run in the
 * browser on the text the downloaded PDF will contain (cvPlainText). It's code,
 * not AI, so it's instant, free and gives the same result every time.
 */

/** Plain-language fixes for the checks a builder user can act on. */
const FIX: Record<string, string> = {
  "Phone present": "Add a phone number an ATS can read",
  "Email present": "Add your email",
  "LinkedIn URL": "Add your LinkedIn URL",
  "Summary section": "Add a two or three sentence summary",
  "Experience section": "Add an internship, job or project",
  "Education section": "Add your school",
  "Skills section": "Add your skills",
  "Quantified achievements": "Add numbers you can back up to your bullets",
  "Consistent date format": "Use one date format throughout",
  "Extractable skills": "List skills one by one",
  "Reasonable length": "Add more detail: projects, coursework, clubs",
  "Bullet point structure": "Shorten bullets that run past two lines",
  "Standard bullet characters": "Use standard bullets",
  "Clean character encoding": "Remove emoji and unusual symbols",
};

const Card = styled.div`
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  gap: 2px 14px;
  align-items: center;
  padding: 14px 16px;
  border-radius: 20px;
  background: var(--rj-surface);
  box-shadow: 0 0 0 1px var(--rj-line);
  font-family: var(--rj-font);

  .ring { position: relative; grid-row: 1 / 3; width: 58px; height: 58px; }
  .ring svg { width: 100%; height: 100%; transform: rotate(-90deg); }
  .arc { transition: stroke-dashoffset 0.7s cubic-bezier(0.2, 0.8, 0.2, 1); }
  .ring b { position: absolute; inset: 0; display: grid; place-items: center; font-size: 19px; letter-spacing: -0.03em; color: var(--rj-ink); font-variant-numeric: tabular-nums; }
  .t { font-size: 14.5px; font-weight: 600; color: var(--rj-ink); }
  .t small { font-weight: 400; color: var(--rj-ink-3); }
  .n { font-size: 13px; color: var(--rj-ink-2); }
  ul { grid-column: 1 / -1; list-style: none; margin: 10px 0 0; padding: 10px 0 0; display: grid; gap: 6px; border-top: 1px solid var(--rj-line); }
  li { display: grid; grid-template-columns: minmax(0, 1fr) auto; gap: 10px; font-size: 13px; line-height: 1.4; color: var(--rj-ink-2); }
  li em { font: 600 11.5px var(--rj-mono); font-style: normal; color: var(--rj-ink); }
  .src { grid-column: 1 / -1; margin: 8px 0 0; font: 500 11px var(--rj-mono); color: var(--rj-ink-3); }

  @media (prefers-reduced-motion: reduce) { .arc { transition: none; } }
`;

export function AtsMeter({ cv, onScore }: { cv: GeneratedCV; onScore?: (score: number | null) => void }) {
  // Typing stays smooth: the score follows a frame behind.
  const deferred = useDeferredValue(cv);
  const result = useMemo(() => {
    const hasContent = !!(deferred.contact?.name?.trim() || deferred.experience?.some((e) => e.title?.trim()));
    if (!hasContent) return null;
    const r = calculateDeterministicScore(cvPlainText(deferred));
    const failed = Object.values(r.categories)
      .flatMap((c) => c.checks)
      .filter((c) => !c.passed)
      .sort((a, b) => b.points - a.points);
    return { score: r.overallScore, failed };
  }, [deferred]);

  // The page shows the score on its preview button and runs the scan line when it moves.
  useEffect(() => {
    onScore?.(result ? result.score : null);
  }, [result, onScore]);

  const circ = 2 * Math.PI * 42;
  const score = result?.score ?? 0;

  return (
    <Card role="status" aria-live="polite" aria-label={result ? `ATS score ${score} out of 100, ${result.failed.length} checks to fix` : "ATS score appears once you add your basics"}>
      <div className="ring" aria-hidden="true">
        <svg viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="42" fill="none" stroke="var(--rj-line)" strokeWidth="10" />
          {result && <circle className="arc" cx="50" cy="50" r="42" fill="none" stroke="var(--rj-ink)" strokeWidth="10" strokeLinecap="round" strokeDasharray={circ} strokeDashoffset={circ * (1 - score / 100)} />}
        </svg>
        <b>{result ? score : "—"}</b>
      </div>
      <span className="t">ATS score <small>· live</small></span>
      <span className="n">
        {!result ? "Add your basics to see your score" : result.failed.length === 0 ? "Every check passes" : `${result.failed.length} ${result.failed.length === 1 ? "check" : "checks"} to fix`}
      </span>
      {result && result.failed.length > 0 && (
        <ul>
          {result.failed.slice(0, 5).map((c) => (
            <li key={c.id}>{FIX[c.name] ?? c.name}<em>+{c.points}</em></li>
          ))}
        </ul>
      )}
      <p className="src">Same 19 checks as the free ATS scan · code, not AI</p>
    </Card>
  );
}

export default AtsMeter;
