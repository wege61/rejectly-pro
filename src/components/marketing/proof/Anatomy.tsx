"use client";

import { useEffect, useState } from "react";
import styled, { css, keyframes } from "styled-components";

/*
 * Resume anatomy: a small page diagram that lights up where a scoring category
 * looks (red = trouble spots it hunts for, yellow = places it reads closely).
 * Decorative: the same information is in the "Where it looks" list beside it.
 */

type Zone = { cat: number; tone: "y" | "r"; style: React.CSSProperties; delay: number };

const ZONES: Zone[] = [
  { cat: 0, tone: "r", style: { left: 0, right: 0, top: 0, height: "6%" }, delay: 0.1 },
  { cat: 0, tone: "r", style: { left: 0, right: 0, bottom: 0, height: "5%" }, delay: 0.15 },
  { cat: 0, tone: "r", style: { left: "68%", right: "3%", top: "10%", bottom: "9%" }, delay: 0.2 },
  { cat: 0, tone: "y", style: { left: "6%", width: "5%", top: "41%", height: "20%" }, delay: 0.3 },
  { cat: 1, tone: "y", style: { left: "6%", width: "52%", top: "8%", height: "10%" }, delay: 0.05 },
  ...[21, 34, 66, 80].map((top, i) => ({ cat: 1, tone: "y" as const, style: { left: "6%", width: "32%", top: `${top - 1.2}%`, height: "4.5%" }, delay: 0.15 + i * 0.08 })),
  { cat: 2, tone: "y", style: { left: "3%", right: "3%", top: 0, height: "33%" }, delay: 0.05 },
  { cat: 2, tone: "y", style: { left: "6%", width: "58%", top: "39%", height: "23%" }, delay: 0.2 },
  { cat: 2, tone: "y", style: { left: "6%", width: "58%", top: "83.5%", height: "6%" }, delay: 0.35 },
  { cat: 3, tone: "r", style: { left: "2%", right: "2%", top: "2%", bottom: "2%" }, delay: 0.05 },
];

const LEGEND: { cat: number; tone: "y" | "r"; text: string }[] = [
  { cat: 0, tone: "r", text: "Page header and footer" },
  { cat: 0, tone: "r", text: "A second column" },
  { cat: 0, tone: "y", text: "Bullet symbols and fonts" },
  { cat: 1, tone: "y", text: "Section headings and their order" },
  { cat: 1, tone: "y", text: "Name and contact at the top" },
  { cat: 2, tone: "y", text: "The top third (weighted 2×)" },
  { cat: 2, tone: "y", text: "Keywords inside your bullets" },
  { cat: 2, tone: "y", text: "Your skills list" },
  { cat: 3, tone: "r", text: "The whole page: words, bullets, white space" },
];

/* page "text": [top %, width %, left %, colour] */
const LINES: [number, number, number, string][] = [
  [10, 40, 9, "#9C9FA6"], [14, 52, 9, "#9C9FA6"],
  [25, 52, 9, "#DADBD6"], [28.5, 46, 9, "#DADBD6"],
  ...[39, 43, 47, 51, 55, 59].map((t, k): [number, number, number, string] => [t, k % 2 ? 48 : 42, 13, "#DADBD6"]),
  [70, 40, 9, "#DADBD6"], [73.5, 30, 9, "#DADBD6"], [85, 50, 9, "#DADBD6"],
  ...[12, 18, 24, 30, 46, 52, 58, 72].map((t): [number, number, number, string] => [t, 18, 72, "#E7E8E4"]),
  [2.5, 40, 30, "#E7E8E4"],
];
const HEADINGS = [21, 34, 66, 80];

const scan = keyframes`
  0% { top: 0; opacity: 1; }
  90% { opacity: 1; }
  100% { top: 100%; opacity: 0; }
`;

const Wrap = styled.div`
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  gap: 16px;
  align-items: center;
`;

const Page = styled.div`
  position: relative;
  width: 132px;
  aspect-ratio: 3 / 3.9;
  border-radius: 6px;
  background: #ffffff;
  box-shadow: 0 0 0 1px rgba(13, 14, 16, 0.12), 0 16px 30px -18px rgba(0, 0, 0, 0.35);
  overflow: hidden;

  i {
    position: absolute;
    height: 3px;
    border-radius: 2px;
  }
`;

const ZoneBox = styled.span<{ $on: boolean; $tone: "y" | "r"; $delay: number }>`
  position: absolute;
  border-radius: 3px;
  opacity: ${({ $on }) => ($on ? 1 : 0)};
  transition: opacity 0.35s ease;
  transition-delay: ${({ $on, $delay }) => ($on ? $delay : 0)}s;
  ${({ $tone }) =>
    $tone === "y"
      ? css`background: rgba(255, 225, 77, 0.55);`
      : css`background: rgba(224, 53, 43, 0.07); box-shadow: inset 0 0 0 1.5px #e0352b;`}

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`;

const Count = styled.span<{ $on: boolean }>`
  position: absolute;
  right: 6%;
  bottom: 3%;
  padding: 3px 4px;
  border-radius: 3px;
  font: 700 8px/1 var(--rj-mono);
  color: #0d0e10;
  background: #ffe14d;
  opacity: ${({ $on }) => ($on ? 1 : 0)};
  transition: opacity 0.35s 0.3s;
`;

const Scan = styled.span<{ $go: boolean }>`
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  height: 2px;
  background: #ffe14d;
  box-shadow: 0 0 10px 2px rgba(255, 225, 77, 0.8);
  opacity: 0;
  ${({ $go }) =>
    $go &&
    css`
      animation: ${scan} 0.9s cubic-bezier(0.45, 0, 0.55, 1) both;
    `}

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`;

const Legend = styled.div<{ $onPaper?: boolean }>`
  display: grid;
  gap: 8px;
  font-size: 13px;
  color: ${({ $onPaper }) => ($onPaper ? "#4A4D55" : "var(--rj-ink-2)")};

  .k {
    font: 600 10.5px/1 var(--rj-mono);
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: ${({ $onPaper }) => ($onPaper ? "#80848D" : "var(--rj-ink-3)")};
  }

  ul {
    list-style: none;
    margin: 0;
    padding: 0;
    display: grid;
    gap: 6px;
  }

  li {
    display: grid;
    grid-template-columns: 12px 1fr;
    gap: 8px;
    align-items: center;
  }

  li i {
    width: 12px;
    height: 12px;
    border-radius: 3px;
  }

  li i.y { background: rgba(255, 225, 77, 0.85); }
  li i.r { box-shadow: inset 0 0 0 1.5px #e0352b; }
`;

export function Anatomy({ category, onPaper, animate }: { category: number; onPaper?: boolean; animate: boolean }) {
  const [scanKey, setScanKey] = useState(0);

  // Sweep the scan line each time the category changes (after the first paint).
  useEffect(() => {
    if (animate) setScanKey((k) => k + 1);
  }, [category, animate]);

  return (
    <Wrap>
      <Page aria-hidden="true">
        {LINES.map(([top, width, left, color], i) => (
          <i key={`l${i}`} style={{ top: `${top}%`, width: `${width}%`, left: `${left}%`, background: color }} />
        ))}
        {HEADINGS.map((top) => (
          <i key={`h${top}`} style={{ top: `${top}%`, width: "26%", left: "9%", background: "#9C9FA6" }} />
        ))}
        <i style={{ bottom: "2%", width: "40%", left: "30%", background: "#E7E8E4" }} />
        {ZONES.map((z, i) => (
          <ZoneBox key={`z${i}`} $on={z.cat === category} $tone={z.tone} $delay={z.delay} style={z.style} />
        ))}
        <Count $on={category === 3}>≈ 520 words</Count>
        <Scan key={scanKey} $go={scanKey > 0} />
      </Page>
      <Legend $onPaper={onPaper}>
        <span className="k">Where it looks</span>
        <ul>
          {LEGEND.filter((l) => l.cat === category).map((l) => (
            <li key={l.text}>
              <i className={l.tone} aria-hidden="true" />
              {l.text}
            </li>
          ))}
        </ul>
      </Legend>
    </Wrap>
  );
}
