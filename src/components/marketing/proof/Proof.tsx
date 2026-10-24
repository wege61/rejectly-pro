"use client";

import { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { useReducedMotion } from "framer-motion";
import { ROUTES } from "@/lib/constants";
import { Anatomy } from "./Anatomy";
import { RuleCard } from "./RuleCard";
import { CATEGORIES, RULES, TOTAL_CHECKS, TOTAL_POINTS } from "./data";

/*
 * Homepage section 5: proof by transparency. No reviews (we won't invent any).
 * First the rewrite rules every rewrite follows, each played as an AI draft the red
 * pen stops; then the full scoring checklist, readable item by item, with a page
 * diagram of where each category looks. Phones get an accordion; desktop shows the
 * category list on the left and the open checklist on the right.
 */

const PREVIEW = 8;
const RULE_GAP = 1300;
const MAX_POINTS = Math.max(...CATEGORIES.map((c) => c.points));

const Section = styled.section`
  background: var(--rj-paper);
  color: var(--rj-ink);
  font-family: var(--rj-font);
  -webkit-font-smoothing: antialiased;
  border-top: 1px solid var(--rj-line);
`;

const Inner = styled.div`
  max-width: 1240px;
  margin: 0 auto;
  display: grid;
  gap: 44px;
  padding: 56px max(20px, env(safe-area-inset-right, 0px)) 64px max(20px, env(safe-area-inset-left, 0px));

  @media (min-width: 640px) { gap: 64px; padding: 88px 40px 96px; }
  @media (min-width: 1000px) { padding: 104px 40px 112px; }
`;

const Head = styled.header`
  .eyebrow {
    margin: 0;
    font: 500 11.5px/1.3 var(--rj-mono);
    letter-spacing: 0.07em;
    text-transform: uppercase;
    color: var(--rj-ink-2);
  }

  h2 {
    margin: 12px 0 0;
    max-width: 13em;
    font-size: clamp(32px, 8.6vw, 56px);
    font-weight: 700;
    line-height: 1.02;
    letter-spacing: -0.04em;
    text-wrap: balance;
    color: var(--rj-ink);

    @media (min-width: 640px) { font-size: clamp(36px, 6.4vw, 56px); }
    @media (min-width: 1000px) { font-size: clamp(40px, 3.9vw, 56px); }
  }

  p {
    margin: 14px 0 0;
    max-width: 34em;
    font-size: 16.5px;
    line-height: 1.55;
    color: var(--rj-ink-2);

    @media (min-width: 640px) { font-size: 18px; }
  }
`;

const Sub = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  justify-content: space-between;
  gap: 6px 12px;
  margin-bottom: 16px;

  h3 {
    margin: 0;
    font-size: 22px;
    letter-spacing: -0.028em;
    color: var(--rj-ink);
  }

  span {
    font: 500 12px var(--rj-mono);
    color: var(--rj-ink-3);
  }
`;

const Rules = styled.div`
  display: grid;
  gap: 12px;

  @media (min-width: 640px) { grid-template-columns: 1fr 1fr; gap: 14px; }
  @media (min-width: 1000px) { grid-template-columns: repeat(4, minmax(0, 1fr)); }
`;

const Score = styled.div`
  display: grid;
  gap: 8px;

  @media (min-width: 1000px) {
    grid-template-columns: minmax(0, 1fr) minmax(0, 1.15fr);
    column-gap: 28px;
    row-gap: 8px;
    align-items: start;
  }
`;

const Row = styled.div`
  display: grid;
  gap: 8px;

  @media (min-width: 1000px) {
    display: contents;
  }
`;

const Cat = styled.button<{ $row: number; $grow: boolean }>`
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 8px 12px;
  align-items: center;
  padding: 14px 16px;
  border-radius: 16px;
  text-align: left;
  font-family: var(--rj-font);
  color: var(--rj-ink);
  background: var(--rj-surface);
  box-shadow: 0 0 0 1px var(--rj-line);

  &[aria-expanded="true"] { box-shadow: 0 0 0 2px var(--rj-ink); }
  &:focus-visible { outline: 2px solid var(--rj-ink); outline-offset: 2px; }

  b { font-size: 15.5px; letter-spacing: -0.01em; }
  .pts { font: 600 13px/1 var(--rj-mono); font-variant-numeric: tabular-nums; }
  .pts em { font-style: normal; color: var(--rj-ink-3); }
  .cnt { grid-column: 1 / -1; font-size: 12.5px; color: var(--rj-ink-3); }

  .bar {
    grid-column: 1 / -1;
    height: 8px;
    border-radius: 4px;
    overflow: hidden;
    background: color-mix(in srgb, var(--rj-ink) 8%, transparent);
  }

  .bar i {
    display: block;
    height: 100%;
    border-radius: 4px;
    transform-origin: left;
    transform: scaleX(${({ $grow }) => ($grow ? 1 : 0)});
    background: color-mix(in srgb, var(--rj-ink) 30%, transparent);
    transition: transform 0.7s cubic-bezier(0.3, 0, 0.2, 1), background 0.2s;
  }

  &[aria-expanded="true"] .bar i { background: var(--rj-ink); }

  @media (min-width: 1000px) {
    grid-column: 1;
    grid-row: ${({ $row }) => $row};
  }

  @media (prefers-reduced-motion: reduce) {
    .bar i { transition: none; }
  }
`;

const Panel = styled.div`
  @media (min-width: 1000px) {
    grid-column: 2;
    grid-row: 1 / span 6;
  }
`;

const Sheet = styled.div`
  padding: 20px;
  border-radius: 16px;
  background: var(--rj-doc);
  color: var(--rj-doc-ink);
  box-shadow: 0 0 0 1px rgba(13, 14, 16, 0.08), 0 26px 50px -32px rgba(0, 0, 0, 0.4);

  .phone-anatomy {
    margin-bottom: 14px;
    padding-bottom: 14px;
    border-bottom: 1px solid rgba(13, 14, 16, 0.1);

    @media (min-width: 1000px) { display: none; }
  }

  .sh {
    display: flex;
    flex-wrap: wrap;
    align-items: baseline;
    justify-content: space-between;
    gap: 10px;
    padding-bottom: 12px;
    border-bottom: 1px solid rgba(13, 14, 16, 0.1);
  }

  .sh b { font-size: 16px; letter-spacing: -0.01em; }
  .sh span { font: 500 11.5px var(--rj-mono); color: #80848d; }

  > ul {
    list-style: none;
    margin: 12px 0 0;
    padding: 0;
    display: grid;
    gap: 7px;
  }

  > ul > li {
    display: grid;
    grid-template-columns: 16px 1fr;
    gap: 10px;
    align-items: start;
    font-size: 14px;
    line-height: 1.4;
  }

  > ul > li::before {
    content: "";
    width: 12px;
    height: 12px;
    margin-top: 3px;
    border-radius: 3px;
    box-shadow: inset 0 0 0 1.5px rgba(13, 14, 16, 0.35);
  }

  .all {
    margin-top: 14px;
    padding: 0;
    font: 500 13.5px/1 var(--rj-font);
    color: var(--rj-doc-ink);
    text-decoration: underline;
    text-underline-offset: 3px;
  }

  .all:focus-visible { outline: 2px solid #0d0e10; outline-offset: 3px; }
`;

const DeskAnatomy = styled.div`
  display: none;

  @media (min-width: 1000px) {
    display: block;
    grid-column: 1;
    grid-row: 5;
    margin-top: 8px;
    padding: 18px;
    border-radius: 16px;
    background: var(--rj-surface);
    box-shadow: 0 0 0 1px var(--rj-line);
  }
`;

const Cta = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  margin-top: 18px;
  padding-bottom: 2px;
  border-bottom: 1px solid var(--rj-line);
  font-size: 15px;
  font-weight: 500;
  text-decoration: none;
  color: var(--rj-ink);

  &:hover { color: var(--rj-ink); border-bottom-color: var(--rj-ink); }
  svg { width: 14px; height: 14px; }
`;

function useIsDesktop() {
  const [desktop, setDesktop] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1000px)");
    const sync = () => setDesktop(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);
  return desktop;
}

export function Proof() {
  const reduce = !!useReducedMotion();
  const desktop = useIsDesktop();
  const [open, setOpen] = useState<number | null>(0);
  const [showAll, setShowAll] = useState<Record<number, boolean>>({});
  const [armed, setArmed] = useState(false);
  const [ruleStart, setRuleStart] = useState<(number | null)[]>(RULES.map(() => null));
  const [barsIn, setBarsIn] = useState(true);
  const ruleRefs = useRef<(HTMLDivElement | null)[]>([]);
  const scoreRef = useRef<HTMLDivElement>(null);

  // On the client (with motion): rule cards wait for their turn, bars grow when seen.
  useEffect(() => {
    if (reduce || typeof IntersectionObserver === "undefined") return;
    setArmed(true);
    setBarsIn(false);
    let queued = 0;
    const io = new IntersectionObserver(
      (entries) => {
        const seen = entries.filter((e) => e.isIntersecting);
        seen.forEach((e, n) => {
          const i = ruleRefs.current.indexOf(e.target as HTMLDivElement);
          if (i >= 0) {
            const delay = (queued + n) * RULE_GAP;
            setRuleStart((prev) => prev.map((v, k) => (k === i ? delay : v)));
            io.unobserve(e.target);
          }
          if (e.target === scoreRef.current) {
            setBarsIn(true);
            io.unobserve(e.target);
          }
        });
        queued = 0;
      },
      { threshold: 0.4 }
    );
    ruleRefs.current.forEach((el) => el && io.observe(el));
    if (scoreRef.current) io.observe(scoreRef.current);
    return () => io.disconnect();
  }, [reduce]);

  // Desktop always keeps one category open.
  useEffect(() => {
    if (desktop && open === null) setOpen(0);
  }, [desktop, open]);

  const toggle = (i: number) => setOpen((cur) => (cur === i && !desktop ? null : i));
  const shown = open ?? 0;

  return (
    <Section id="proof" aria-labelledby="proof-title">
      <Inner>
        <Head>
          <p className="eyebrow">Proof</p>
          <h2 id="proof-title">No fake reviews. Here are the rules instead.</h2>
          <p>Every rewrite follows the same rules, and every score comes from the same checklist. You can read both.</p>
        </Head>

        <div>
          <Sub><h3>What we never write</h3><span>Rules every rewrite follows</span></Sub>
          <Rules>
            {RULES.map((rule, i) => (
              <div key={rule.title} ref={(el) => { ruleRefs.current[i] = el; }} style={{ display: "grid" }}>
                <RuleCard rule={rule} armed={armed} startIn={ruleStart[i]} />
              </div>
            ))}
          </Rules>
        </div>

        <div>
          <Sub><h3>What we check</h3><span>{TOTAL_POINTS} points · {TOTAL_CHECKS} checks</span></Sub>
          <Score ref={scoreRef}>
            {CATEGORIES.map((c, i) => {
              const expanded = open === i;
              const all = !!showAll[i];
              return (
                <Row key={c.name}>
                  <Cat
                    type="button"
                    id={`proof-cat-${i}`}
                    aria-expanded={expanded}
                    aria-controls={`proof-panel-${i}`}
                    $row={i + 1}
                    $grow={barsIn}
                    onClick={() => toggle(i)}
                  >
                    <b>{c.name}</b>
                    <span className="pts">{c.points}<em> pts</em></span>
                    <span className="bar" aria-hidden="true"><i style={{ width: `${(c.points / MAX_POINTS) * 100}%` }} /></span>
                    <span className="cnt">{c.checks.length} checks</span>
                  </Cat>
                  <Panel id={`proof-panel-${i}`} role="region" aria-labelledby={`proof-cat-${i}`} hidden={!expanded}>
                    <Sheet>
                      <div className="phone-anatomy">
                        <Anatomy category={i} onPaper animate={!reduce && expanded && !desktop} />
                      </div>
                      <div className="sh"><b>{c.name}</b><span>{c.points} points · {c.checks.length} checks</span></div>
                      <ul>
                        {(all ? c.checks : c.checks.slice(0, PREVIEW)).map((check) => <li key={check}>{check}</li>)}
                      </ul>
                      {c.checks.length > PREVIEW && (
                        <button type="button" className="all" aria-expanded={all} onClick={() => setShowAll((s) => ({ ...s, [i]: !all }))}>
                          {all ? "Show fewer" : `Show all ${c.checks.length} checks`}
                        </button>
                      )}
                    </Sheet>
                  </Panel>
                </Row>
              );
            })}
            <DeskAnatomy>
              <Anatomy category={shown} animate={!reduce && desktop} />
            </DeskAnatomy>
          </Score>
          <Cta href={ROUTES.PUBLIC.ATS_CHECK}>
            Scan your resume against all {TOTAL_CHECKS} checks
            <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M3 8h10M9 4l4 4-4 4" />
            </svg>
          </Cta>
        </div>
      </Inner>
    </Section>
  );
}

export default Proof;
