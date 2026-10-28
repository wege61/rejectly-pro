"use client";

import { useEffect, useRef, useState } from "react";
import styled, { css } from "styled-components";
import { useReducedMotion } from "framer-motion";
import { ROUTES } from "@/lib/constants";
import { useSeenOnce } from "../why/shared";
import { TOTAL_CHECKS } from "../proof/data";

/*
 * Homepage section 9: the closing panel. The hero's headline returns, and the
 * Parser Lens passes over the top of Maya's resume one more time: what the ATS
 * reads on the left, what a recruiter sees on the right. The lens is a slider
 * visitors can drag or move with the arrow keys. Every resume line is from the
 * demo resume and its rule-following rewrite; nothing new is added here.
 */

const ROWS: { human: React.ReactNode; bot: [React.ReactNode, React.ReactNode] }[] = [
  {
    human: <><span className="nm">Maya Chen</span><span className="r">maya.chen@mail.com</span></>,
    bot: [<><b>name</b> &quot;Maya Chen&quot;</>, <><b>email</b> maya.chen@mail.com</>],
  },
  {
    human: <><span className="hl">Economics graduate · Data Analyst Intern</span><span className="r">Lakeside University</span></>,
    bot: [<><b>headline</b> &quot;Economics graduate · Data Analyst Intern&quot;</>, <><b>school</b> Lakeside University</>],
  },
  { human: null, bot: [null, null] },
  { human: <span className="sec">EXPERIENCE</span>, bot: [<><b>section</b> EXPERIENCE</>, null] },
  {
    human: <><span className="job">Halden Analytics</span><span className="r">Data Analyst Intern</span></>,
    bot: [<><b>employer</b> Halden Analytics</>, <><b>title</b> Data Analyst Intern</>],
  },
  { human: <span className="bul">Helped build the team&apos;s weekly reports in Tableau</span>, bot: [<><b>bullet</b> weekly reports in <mark>Tableau</mark></>, null] },
  { human: <span className="bul">Handled data entry for 12,000 CRM records</span>, bot: [<><b>bullet</b> data entry, <mark>12,000</mark> CRM records</>, null] },
  { human: <span className="bul">Attended client meetings</span>, bot: [<><b>bullet</b> client meetings</>, null] },
];

const Section = styled.section`
  padding: 0 12px 12px;
  background: var(--rj-paper);
  font-family: var(--rj-font);
  -webkit-font-smoothing: antialiased;

  @media (min-width: 640px) { padding: 0 20px 20px; }
`;

const Panel = styled.div`
  position: relative;
  isolation: isolate;
  max-width: 1400px;
  margin: 0 auto;
  border-radius: 32px;
  /* clip, not hidden: a hidden overflow is still scrollable, and scrollIntoView or
     find-in-page would shift the whole panel's content. */
  overflow: clip;
  color: var(--rj-bridge-ink);
  background: var(--rj-bridge);

  [data-theme="dark"] & { box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.06); }

  /* The panel's only colour: a faint highlighter glow behind the resume. */
  &::before {
    content: "";
    position: absolute;
    z-index: -1;
    left: 50%;
    bottom: -260px;
    width: 900px;
    height: 520px;
    margin-left: -450px;
    border-radius: 50%;
    background: radial-gradient(closest-side, rgba(255, 225, 77, 0.16), rgba(255, 225, 77, 0));
    pointer-events: none;
  }
`;

const Copy = styled.div<{ $armed: boolean; $go: boolean }>`
  max-width: 760px;
  margin: 0 auto;
  padding: 64px 20px 0;
  text-align: center;

  @media (min-width: 640px) { padding-top: 96px; }
  @media (min-width: 1000px) { padding-top: 120px; }

  .eyebrow {
    margin: 0;
    font: 500 11.5px/1.3 var(--rj-mono);
    letter-spacing: 0.07em;
    text-transform: uppercase;
    color: var(--rj-bridge-ink-2);
  }

  h2 {
    margin: 16px 0 0;
    font-size: clamp(36px, 9.6vw, 68px);
    font-weight: 700;
    line-height: 1;
    letter-spacing: -0.045em;
    color: var(--rj-bridge-ink);

    > span { display: block; }
    @media (min-width: 640px) { font-size: clamp(44px, 7.4vw, 68px); }
  }

  .strike {
    position: relative;
    white-space: nowrap;

    &::after {
      content: "";
      position: absolute;
      left: -4%;
      right: -4%;
      top: 52%;
      height: 0.085em;
      border-radius: 99px;
      background: #ff5a4e;
      transform-origin: left center;
      transform: rotate(-4deg) scaleX(${({ $armed, $go }) => ($armed && !$go ? 0 : 1)});
      transition: ${({ $go }) => ($go ? "transform 0.55s cubic-bezier(0.6, 0, 0.2, 1) 0.3s" : "none")};
    }
  }

  .mark {
    padding: 0 0.08em;
    margin: 0 -0.04em;
    border-radius: 0.08em;
    background: linear-gradient(transparent 12%, #ffe14d 12%, #ffe14d 92%, transparent 92%) no-repeat 0 0;
    ${({ $armed, $go }) =>
      $armed && !$go
        ? css`background-size: 0% 100%; color: var(--rj-bridge-ink);`
        : css`background-size: 100% 100%; color: #0d0e10;`}
    transition: ${({ $go }) => ($go ? "background-size 0.6s cubic-bezier(0.6, 0, 0.2, 1) 0.9s, color 0.3s 0.9s" : "none")};
  }

  .sub {
    margin: 18px auto 0;
    max-width: 30em;
    font-size: 17px;
    line-height: 1.55;
    color: var(--rj-bridge-ink-2);
    text-wrap: balance;
  }
`;

const Ctas = styled.div`
  margin-top: 28px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;

  @media (min-width: 640px) { flex-direction: row; justify-content: center; gap: 22px; }
`;

const Primary = styled.a`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  height: 54px;
  padding: 0 30px;
  border-radius: 999px;
  color: #0d0e10;
  background: #f2f2ef;
  font-size: 16px;
  font-weight: 600;
  text-decoration: none;
  transition: transform 0.2s cubic-bezier(0.3, 0, 0.2, 1), box-shadow 0.2s;

  &:hover {
    color: #0d0e10;
    transform: translateY(-1px);
    box-shadow: 0 0 0 6px rgba(255, 225, 77, 0.16);
  }
  &:focus-visible { outline: 2px solid #f2f2ef; outline-offset: 3px; }
  svg { width: 16px; height: 16px; }

  @media (prefers-reduced-motion: reduce) { transition: none; }
`;

const Secondary = styled.a`
  font-size: 14.5px;
  color: var(--rj-bridge-ink-2);
  text-decoration: none;

  &:hover { color: var(--rj-bridge-ink-2); }
  &:focus-visible { outline: 2px solid #f2f2ef; outline-offset: 3px; }
  b { font-weight: 600; color: var(--rj-bridge-ink); border-bottom: 1px solid rgba(255, 255, 255, 0.3); }
`;

const Micro = styled.ul`
  margin: 18px 0 0;
  padding: 0;
  list-style: none;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 6px 18px;
  font-size: 13px;
  color: var(--rj-bridge-ink-2);

  li { display: inline-flex; align-items: center; gap: 6px; }
  svg { width: 13px; height: 13px; color: #5cd69a; }
`;

const Stage = styled.div`
  max-width: 880px;
  margin: 48px auto 0;
  padding: 0 16px;

  @media (min-width: 640px) { margin-top: 60px; padding: 0 32px; }
  @media (min-width: 1000px) { margin-top: 72px; }

  .labels {
    display: flex;
    justify-content: space-between;
    margin: 0 4px 10px;
    font: 600 10.5px/1 var(--rj-mono);
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--rj-bridge-ink-2);

    .long { display: none; }
    @media (min-width: 640px) { .long { display: inline; } }
  }
`;

const Sheet = styled.div<{ $armed: boolean; $go: boolean }>`
  position: relative;
  height: 300px;
  border-radius: 16px 16px 0 0;
  overflow: clip;
  cursor: ew-resize;
  touch-action: pan-y;
  user-select: none;
  box-shadow: 0 -1px 0 rgba(255, 255, 255, 0.08), 0 -30px 60px -30px rgba(0, 0, 0, 0.8);
  opacity: ${({ $armed, $go }) => ($armed && !$go ? 0 : 1)};
  transform: translateY(${({ $armed, $go }) => ($armed && !$go ? 70 : 0)}px);
  transition: ${({ $go }) => ($go ? "transform 1s cubic-bezier(0.2, 0.8, 0.2, 1) 0.2s, opacity 0.6s 0.2s" : "none")};

  @media (min-width: 640px) { height: 330px; }
  @media (min-width: 1000px) { height: 350px; }
`;

const Layer = styled.div<{ $bot?: boolean }>`
  position: absolute;
  inset: 0;
  display: grid;
  grid-template-rows: 38px 24px 18px 26px 26px 24px 24px 24px;
  align-content: start;
  padding: 22px 18px 0;

  @media (min-width: 640px) {
    grid-template-rows: 44px 28px 22px 30px 30px 27px 27px 27px;
    padding: 32px 40px 0;
  }

  .row {
    display: flex;
    align-items: ${({ $bot }) => ($bot ? "center" : "baseline")};
    justify-content: space-between;
    gap: 16px;
    min-width: 0;
    white-space: nowrap;

    > span { overflow: hidden; text-overflow: ellipsis; }
  }

  ${({ $bot }) =>
    $bot
      ? css`
          color: #f2f2ef;
          background: #141518;
          font: 500 10.5px/1.2 var(--rj-mono);
          clip-path: inset(0 calc(100% - var(--x)) 0 0);

          @media (min-width: 640px) { font-size: 12.5px; }

          b {
            display: none;
            margin-right: 6px;
            font-weight: 500;
            color: #81858e;

            @media (min-width: 640px) { display: inline; }
          }
          mark { padding: 0 2px; border-radius: 3px; color: #ffe14d; background: rgba(255, 225, 77, 0.22); }
          i { margin-left: 6px; font-style: normal; font-weight: 700; color: #5cd69a; }
        `
      : css`
          color: #1b1c20;
          background: #fbfbf9;
          font-size: 12.5px;

          @media (min-width: 640px) { font-size: 14px; }

          .nm { font-size: 24px; font-weight: 700; line-height: 1; letter-spacing: -0.035em; @media (min-width: 640px) { font-size: 30px; } }
          .hl { color: #4a4d55; }
          .r { flex: none; font-size: 11.5px; color: #62666f; @media (min-width: 640px) { font-size: 13.5px; } }
          .rule { align-self: center; border-top: 1px solid #e2e3df; }
          .sec { font-size: 11.5px; font-weight: 700; letter-spacing: 0.12em; }
          .job { font-weight: 600; }
          .bul {
            position: relative;
            padding-left: 14px;
            color: #33363c;

            &::before {
              content: "";
              position: absolute;
              left: 2px;
              top: 0.62em;
              width: 4px;
              height: 4px;
              border-radius: 50%;
              background: #80848d;
            }
          }
        `}
`;

const Lens = styled.div`
  position: absolute;
  z-index: 1;
  top: 0;
  bottom: 0;
  left: var(--x);
  width: 2px;
  margin-left: -1px;
  background: #ffe14d;
  box-shadow: 0 0 22px 3px rgba(255, 225, 77, 0.5);

  &:focus-visible { outline: 2px solid #f2f2ef; outline-offset: 3px; }

  span {
    position: absolute;
    left: 50%;
    top: 96px;
    width: 40px;
    height: 40px;
    margin-left: -20px;
    display: grid;
    place-items: center;
    border-radius: 50%;
    color: #0d0e10;
    background: #ffe14d;
    box-shadow: 0 6px 18px rgba(0, 0, 0, 0.35);

    @media (min-width: 640px) { top: 118px; }
    svg { width: 18px; height: 18px; }
  }
`;

const Arrow = () => (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M3 8h10M9 4l4 4-4 4" />
  </svg>
);

const Check = () => (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M3 8.5l3 3 7-7" />
  </svg>
);

const ease = (p: number) => (p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2);

export function FinalCTA() {
  const reduce = useReducedMotion();
  const [armed, setArmed] = useState(false);
  const [go, setGo] = useState(false);
  const [x, setX] = useState(46);
  const touched = useRef(false);
  const dragging = useRef(false);
  const panel = useRef<HTMLDivElement>(null);
  const sheet = useRef<HTMLDivElement>(null);

  // Motion arms after hydration so the server render is the finished frame.
  useEffect(() => {
    if (reduce) return;
    setArmed(true);
    setX(0);
  }, [reduce]);

  useSeenOnce(panel, () => setGo(true), armed, 0.35);

  // One slow pass after the sheet rises: across to the bot view, then rest near the middle.
  useEffect(() => {
    if (!go) return;
    let raf = 0;
    const keys: [number, number][] = [[0, 0], [1500, 100], [2300, 46]];
    const start = window.setTimeout(() => {
      const t0 = performance.now();
      const tick = (t: number) => {
        if (touched.current) return;
        const e = t - t0;
        const [a, b] = e < keys[1][0] ? [keys[0], keys[1]] : [keys[1], keys[2]];
        const p = Math.min(1, (e - a[0]) / (b[0] - a[0]));
        setX(a[1] + (b[1] - a[1]) * ease(p));
        if (e < keys[2][0]) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    }, 1300);
    return () => {
      window.clearTimeout(start);
      cancelAnimationFrame(raf);
    };
  }, [go]);

  const fromPointer = (clientX: number) => {
    const r = sheet.current?.getBoundingClientRect();
    if (r) setX(Math.max(0, Math.min(100, ((clientX - r.left) / r.width) * 100)));
  };

  return (
    <Section aria-labelledby="final-title">
      <Panel ref={panel}>
        <Copy $armed={armed} $go={go}>
          <p className="eyebrow">Your turn</p>
          <h2 id="final-title">
            <span>Get past the <span className="strike">bot</span>.</span>
            <span>Get to a <span className="mark">human</span>.</span>
          </h2>
          <p className="sub">See your resume the way the ATS reads it, and the way a recruiter will. Fix the first so you reach the second.</p>
          <Ctas>
            <Primary href={ROUTES.PUBLIC.ATS_CHECK}>Scan my resume free <Arrow /></Primary>
            <Secondary href="#demo">or <b>try it with Maya&apos;s resume</b></Secondary>
          </Ctas>
          <Micro>
            <li><Check />No account</li>
            <li><Check />No card</li>
            <li><Check />{TOTAL_CHECKS} checks</li>
          </Micro>
        </Copy>

        <Stage>
          <div className="labels" aria-hidden="true">
            <span>← <span className="long">What the </span>ATS reads</span>
            <span><span className="long">What the </span>recruiter sees →</span>
          </div>
          <Sheet
            ref={sheet}
            $armed={armed}
            $go={go}
            style={{ "--x": `${x}%` } as React.CSSProperties}
            onPointerDown={(e) => {
              touched.current = true;
              dragging.current = true;
              e.currentTarget.setPointerCapture(e.pointerId);
              fromPointer(e.clientX);
            }}
            onPointerMove={(e) => dragging.current && fromPointer(e.clientX)}
            onPointerUp={() => (dragging.current = false)}
            onPointerCancel={() => (dragging.current = false)}
          >
            <Layer aria-hidden="true">
              {ROWS.map((row, i) =>
                row.human === null ? <div key={i} className="rule" /> : <div key={i} className="row">{row.human}</div>
              )}
            </Layer>
            <Layer $bot aria-hidden="true">
              {ROWS.map((row, i) =>
                row.human === null ? (
                  <div key={i} />
                ) : (
                  <div key={i} className="row">
                    <span>{row.bot[0]}</span>
                    <span>{row.bot[1]}<i>✓</i></span>
                  </div>
                )
              )}
            </Layer>
            <Lens
              role="slider"
              tabIndex={0}
              aria-label="Compare what the ATS reads with what the recruiter sees"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={Math.round(x)}
              onKeyDown={(e) => {
                const d = e.key === "ArrowLeft" ? -5 : e.key === "ArrowRight" ? 5 : 0;
                if (!d) return;
                e.preventDefault();
                touched.current = true;
                setX((v) => Math.max(0, Math.min(100, v + d)));
              }}
            >
              <span>
                <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M6 4L2 8l4 4M10 4l4 4-4 4" />
                </svg>
              </span>
            </Lens>
          </Sheet>
        </Stage>
      </Panel>
    </Section>
  );
}

export default FinalCTA;
