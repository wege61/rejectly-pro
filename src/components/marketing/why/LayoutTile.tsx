"use client";

import { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { useReducedMotion } from "framer-motion";
import { Tile, TileCopy } from "./shared";

/*
 * "It can't read your layout." The scan follows the visitor's scroll: as the yellow
 * line moves down both pages, the reading order appears (zigzag across two columns,
 * straight down one column) and the parsed words drop in that order.
 * Claim matches the product's own check (lib/ai/prompts/atsCheck: Taleo/older ATS
 * read left-to-right across columns).
 */

type Mark = { n: number; x: number; y: number };

const TWO: Mark[] = [
  { n: 1, x: 22, y: 24 },
  { n: 2, x: 82, y: 24 },
  { n: 3, x: 22, y: 46 },
  { n: 4, x: 82, y: 46 },
  { n: 5, x: 22, y: 68 },
];
const ONE: Mark[] = [
  { n: 1, x: 16, y: 22 },
  { n: 2, x: 16, y: 40 },
  { n: 3, x: 16, y: 58 },
  { n: 4, x: 16, y: 76 },
];
const TWO_WORDS = [
  { w: "EXPERIENCE", at: 24 },
  { w: "CONTACT", at: 24 },
  { w: "Halden…", at: 46 },
  { w: "maya.chen@…", at: 46 },
];
const ONE_WORDS = [
  { w: "EXPERIENCE", at: 22 },
  { w: "Halden", at: 40 },
  { w: "Intern", at: 58 },
  { w: "Jun–Aug", at: 76 },
];

const Thumbs = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
`;

const Figure = styled.figure`
  margin: 0;
  min-width: 0;
  display: grid;
  gap: 8px;
  align-content: start;

  figcaption {
    font: 500 11px/1.3 var(--rj-mono);
    color: var(--rj-ink-3);
  }
`;

const Page = styled.div<{ $two: boolean }>`
  position: relative;
  aspect-ratio: 3 / 3.6;
  border-radius: 10px;
  background: #ffffff;
  box-shadow: 0 0 0 1px rgba(13, 14, 16, 0.1), 0 14px 30px -18px rgba(0, 0, 0, 0.3);
  overflow: hidden;

  ${({ $two }) =>
    $two &&
    `&::before {
      content: "";
      position: absolute;
      top: 0;
      bottom: 0;
      right: 0;
      width: 34%;
      background: var(--rj-doc-side);
    }`}

  svg {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
  }

  polyline {
    fill: none;
    stroke: ${({ $two }) => ($two ? "#E0352B" : "#138A52")};
    stroke-width: 1;
    opacity: 0.45;
    vector-effect: non-scaling-stroke;
  }
`;

const Bars = styled.div<{ $side?: boolean; $narrow?: boolean }>`
  position: absolute;
  inset: 12% ${({ $narrow }) => ($narrow ? "40%" : "8%")} 10% ${({ $side }) => ($side ? "70%" : "8%")};
  ${({ $side }) => $side && "right: 6%;"}
  display: grid;
  align-content: start;
  gap: 7%;

  i {
    display: block;
    height: 5px;
    border-radius: 3px;
    background: ${({ $side }) => ($side ? "rgba(255,255,255,.28)" : "#D9DAD5")};
  }

  i:nth-child(2n) { width: 78%; }
  i:nth-child(3n) { width: 60%; }
`;

const Dot = styled.span<{ $on: boolean; $two: boolean }>`
  position: absolute;
  width: 18px;
  height: 18px;
  margin: -9px 0 0 -9px;
  display: grid;
  place-items: center;
  border-radius: 50%;
  font: 700 10px/1 var(--rj-mono);
  color: #ffffff;
  background: ${({ $two }) => ($two ? "#E0352B" : "#138A52")};
  transform: scale(${({ $on }) => ($on ? 1 : 0)});
  transition: transform 0.3s cubic-bezier(0.3, 1.5, 0.5, 1);

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`;

const Beam = styled.i`
  position: absolute;
  left: 0;
  right: 0;
  height: 2px;
  background: #ffe14d;
  box-shadow: 0 0 12px 2px rgba(255, 225, 77, 0.75);
`;

const Parsed = styled.div<{ $bad: boolean }>`
  min-height: 3em;
  display: flex;
  flex-wrap: wrap;
  gap: 0 6px;
  font: 500 10.5px/1.5 var(--rj-mono);
  color: ${({ $bad }) => ($bad ? "var(--rj-pen)" : "var(--rj-pass)")};

  span {
    transition: opacity 0.3s, transform 0.3s;
  }
`;

const Hint = styled.span<{ $hidden: boolean }>`
  font: 500 11px/1 var(--rj-mono);
  color: var(--rj-ink-3);
  opacity: ${({ $hidden }) => ($hidden ? 0 : 1)};
  transition: opacity 0.3s;
`;

const Word = ({ on, children }: { on: boolean; children: string }) => (
  <span style={{ opacity: on ? 1 : 0, transform: on ? "none" : "translateY(4px)" }}>{children}</span>
);

export function LayoutTile() {
  const reduce = useReducedMotion();
  const thumbsRef = useRef<HTMLDivElement>(null);
  // null = not scrubbing (server render, reduced motion): everything shown, no beam.
  const [beam, setBeam] = useState<number | null>(null);

  useEffect(() => {
    if (reduce) {
      setBeam(null);
      return;
    }
    let frame = 0;
    const update = () => {
      frame = 0;
      const el = thumbsRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      // 0 when the pages enter the bottom of the screen, 1 once they've risen half a screen.
      const p = Math.max(0, Math.min(1, (vh - r.top - 40) / (vh * 0.5)));
      setBeam(6 + p * 88);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [reduce]);

  const scrubbing = beam !== null;
  const reached = (y: number) => !scrubbing || (beam as number) >= y;
  const beamStyle = scrubbing ? { top: `${beam}%`, opacity: (beam as number) >= 94 ? 0 : 1 } : { display: "none" };

  return (
    <Tile aria-labelledby="why-layout">
      <TileCopy>
        <h3 id="why-layout">It can&apos;t read your layout.</h3>
        <p>Older ATS like Taleo read straight across the page, so two columns get scrambled.</p>
      </TileCopy>

      <Thumbs ref={thumbsRef}>
        <Figure role="img" aria-label="A two-column resume. The parser reads across both columns, so headings and contact details get mixed together.">
          <Page $two>
            <Bars $narrow><i /><i /><i /><i /><i /></Bars>
            <Bars $side><i /><i /><i /><i /><i /></Bars>
            <svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
              <polyline points={TWO.map((m) => `${m.x},${m.y}`).join(" ")} />
            </svg>
            {TWO.map((m) => (
              <Dot key={m.n} $two $on={reached(m.y)} style={{ left: `${m.x}%`, top: `${m.y}%` }}>{m.n}</Dot>
            ))}
            <Beam style={beamStyle} />
          </Page>
          <figcaption><span style={{ color: "var(--rj-pen)" }}>✕</span> Two columns</figcaption>
          <Parsed $bad>{TWO_WORDS.map((t) => <Word key={t.w} on={reached(t.at)}>{t.w}</Word>)}</Parsed>
        </Figure>

        <Figure role="img" aria-label="A one-column resume. The parser reads it top to bottom in the right order.">
          <Page $two={false}>
            <Bars><i /><i /><i /><i /><i /><i /></Bars>
            <svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
              <polyline points={ONE.map((m) => `${m.x},${m.y}`).join(" ")} />
            </svg>
            {ONE.map((m) => (
              <Dot key={m.n} $two={false} $on={reached(m.y)} style={{ left: `${m.x}%`, top: `${m.y}%` }}>{m.n}</Dot>
            ))}
            <Beam style={beamStyle} />
          </Page>
          <figcaption><span style={{ color: "var(--rj-pass)" }}>✓</span> One column</figcaption>
          <Parsed $bad={false}>{ONE_WORDS.map((t) => <Word key={t.w} on={reached(t.at)}>{t.w}</Word>)}</Parsed>
        </Figure>
      </Thumbs>

      {scrubbing && <Hint $hidden={(beam as number) > 20} aria-hidden="true">↓ Scroll to scan</Hint>}
    </Tile>
  );
}
