"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import styled, { css, keyframes } from "styled-components";
import { useReducedMotion } from "framer-motion";
import { PRICING, ROUTES } from "@/lib/constants";
import { useAuth } from "@/hooks/useAuth";
import { saveScan, loadScan } from "@/lib/ats/savedScan";
import { BEFORE_TEXT } from "@/components/marketing/hero/parserLensRows";
import type { ATSCheckResult } from "@/types/atsCheck";

/*
 * The free ATS checker. Three states:
 *  - upload: drop a file or try Maya's resume (the hero's Canva résumé).
 *  - scanning: shows only what we really have — the text the parser pulled out,
 *    read top to bottom, and the 19 checks ticking with their real results. It
 *    lasts about as long as the request, and can be skipped once results exist.
 *  - result: one score moment, every check (free), and "Fix it for me", which
 *    hands this scan to the ATS optimizer (1 credit) through the visitor's browser.
 */

type Stage = "upload" | "scanning" | "result";

const MAX_BYTES = 5 * 1024 * 1024;
const MAYA_FILE = "maya_chen_resume.pdf";
const OPTIMIZER_HANDOFF = `${ROUTES.APP.ATS_OPTIMIZER}?from=scan`;
const CATEGORY_NAMES: Record<string, string> = {
  format: "Format & parsing",
  structure: "Structure & sections",
  keywords: "Content",
  readability: "Readability",
};

type Check = NonNullable<ATSCheckResult["categories"]["format"]["checks"]>[number];

function checksOf(result: ATSCheckResult) {
  return (Object.keys(CATEGORY_NAMES) as (keyof ATSCheckResult["categories"])[]).map((key) => {
    const cat = result.categories[key];
    return { key, name: CATEGORY_NAMES[key], earned: cat.earnedPoints, max: cat.maxPoints, checks: (cat.checks ?? []) as Check[] };
  });
}

function verdict(score: number) {
  if (score >= 80) return "Reads cleanly.";
  if (score >= 60) return "Readable, but it's losing points.";
  if (score >= 40) return "Parts of it get misread.";
  return "Hard for an ATS to read.";
}

const compact = (line: string) => line.trim().replace(/ {2,}/g, "  ");

/* ---------------------------------------------------------------- styles */

const Main = styled.div`
  background: var(--rj-paper);
  color: var(--rj-ink);
  font-family: var(--rj-font);
  -webkit-font-smoothing: antialiased;
  padding-top: calc(60px + env(safe-area-inset-top, 0px));
`;

const Inner = styled.div`
  max-width: 1240px;
  margin: 0 auto;
  padding: 40px max(20px, env(safe-area-inset-right, 0px)) 56px max(20px, env(safe-area-inset-left, 0px));

  @media (min-width: 640px) { padding: 56px 40px 72px; }
  @media (min-width: 1000px) { padding: 64px 40px 88px; }
`;

const Head = styled.header<{ $result: boolean }>`
  max-width: 760px;
  margin: 0 auto;
  text-align: center;

  h1 {
    margin: 0;
    font: 500 11.5px/1.3 var(--rj-mono);
    letter-spacing: 0.07em;
    text-transform: uppercase;
    color: var(--rj-ink-2);

    mark { background: none; color: var(--rj-ink); border-bottom: 2px solid var(--rj-hl); padding-bottom: 1px; }
  }

  .big {
    margin: 14px 0 0;
    font-size: clamp(38px, 10vw, 72px);
    font-weight: 700;
    line-height: 1;
    letter-spacing: -0.045em;

    span { padding: 0 0.08em; margin: 0 -0.04em; border-radius: 0.08em; color: var(--rj-hl-ink); background: linear-gradient(transparent 12%, var(--rj-hl) 12%, var(--rj-hl) 92%, transparent 92%); }
    @media (min-width: 640px) { font-size: clamp(48px, 8vw, 72px); }
  }

  .sub {
    margin: 16px auto 0;
    max-width: 34em;
    font-size: 16.5px;
    line-height: 1.55;
    color: var(--rj-ink-2);
    text-wrap: balance;

    b { color: var(--rj-ink); font-weight: 600; }
  }

  ${({ $result }) =>
    $result &&
    css`
      max-width: 1160px;
      text-align: left;
      .big, .sub { display: none; }
    `}
`;

const Card = styled.div<{ $wide?: boolean }>`
  max-width: ${({ $wide }) => ($wide ? "1000px" : "760px")};
  margin: 32px auto 0;
  border-radius: 28px;
  background: var(--rj-surface);
  box-shadow: 0 0 0 1px var(--rj-line), 0 30px 60px -40px rgba(0, 0, 0, 0.35);
  overflow: clip;
`;

const sweep = keyframes`0%, 100% { top: 34px; } 50% { top: 150px; }`;

const scanDoc = keyframes`0%, 100% { top: 8px; } 50% { top: 70px; }`;

const Drop = styled.label<{ $over: boolean }>`
  margin: 14px;
  padding: 40px 20px 32px;
  display: grid;
  justify-items: center;
  gap: 10px;
  border-radius: 20px;
  border: 1.5px dashed ${({ $over }) => ($over ? "var(--rj-ink)" : "color-mix(in srgb, var(--rj-ink) 22%, transparent)")};
  background: ${({ $over }) => ($over ? "color-mix(in srgb, var(--rj-hl) 18%, var(--rj-paper))" : "var(--rj-paper)")};
  text-align: center;
  cursor: pointer;
  transition: background 0.2s, border-color 0.2s;

  @media (min-width: 640px) { margin: 16px; padding: 52px 24px 40px; }

  .doc {
    position: relative;
    width: 64px;
    height: 80px;
    margin-bottom: 6px;
    border-radius: 8px;
    background: #ffffff;
    box-shadow: 0 0 0 1px rgba(13, 14, 16, 0.12), 0 12px 24px -14px rgba(0, 0, 0, 0.35);

    &::before {
      content: "";
      position: absolute;
      left: 10px;
      right: 18px;
      top: 12px;
      height: 4px;
      border-radius: 2px;
      background: #9c9fa6;
      box-shadow: 0 9px 0 #dadbd6, 0 16px 0 #dadbd6, 0 25px 0 #9c9fa6, 0 32px 0 #dadbd6, 0 39px 0 #dadbd6, 0 48px 0 #dadbd6;
    }

    &::after {
      content: "";
      position: absolute;
      left: -8px;
      right: -8px;
      top: 34px;
      height: 2px;
      background: #ffe14d;
      box-shadow: 0 0 12px 3px rgba(255, 225, 77, 0.6);
      animation: ${scanDoc} 2.4s cubic-bezier(0.45, 0, 0.55, 1) infinite;
      @media (prefers-reduced-motion: reduce) { animation: none; }
    }
  }

  b { font-size: 18px; letter-spacing: -0.015em; }
  .small { font-size: 13.5px; color: var(--rj-ink-3); }

  .choose {
    margin-top: 8px;
    height: 50px;
    padding: 0 26px;
    display: inline-flex;
    align-items: center;
    gap: 10px;
    border-radius: 999px;
    color: var(--rj-btn-ink);
    background: var(--rj-btn);
    font-size: 15.5px;
    font-weight: 600;
    svg { width: 16px; height: 16px; }
  }

  &:focus-within { outline: 2px solid var(--rj-ink); outline-offset: 3px; }
  input { position: absolute; width: 1px; height: 1px; opacity: 0; }
`;

const Alt = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 10px 20px;
  padding: 4px 26px 20px;

  @media (min-width: 640px) { padding: 6px 30px 22px; }

  .maya {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    padding: 0;
    border: 0;
    background: none;
    font: 500 14.5px var(--rj-font);
    color: var(--rj-ink);
    cursor: pointer;

    i { width: 26px; height: 26px; display: grid; place-items: center; border-radius: 50%; color: #0d0e10; background: var(--rj-hl); font: 700 11px var(--rj-mono); font-style: normal; }
    u { text-decoration-color: color-mix(in srgb, var(--rj-ink) 30%, transparent); text-underline-offset: 3px; }
    &:focus-visible { outline: 2px solid var(--rj-ink); outline-offset: 3px; border-radius: 6px; }
  }

  ul { list-style: none; margin: 0; padding: 0; display: flex; flex-wrap: wrap; gap: 6px 16px; font-size: 13px; color: var(--rj-ink-3); }
  li { display: inline-flex; align-items: center; gap: 6px; }
  li svg { width: 13px; height: 13px; color: var(--rj-pass); }
`;

const ErrorNote = styled.p`
  margin: 0 26px 20px;
  padding: 12px 14px;
  border-radius: 12px;
  font-size: 14px;
  color: var(--rj-ink);
  background: color-mix(in srgb, var(--rj-pen) 10%, var(--rj-surface));
`;

const Scan = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 14px;
  padding: 18px;

  @media (min-width: 640px) { padding: 22px; }

  .file { display: flex; align-items: center; gap: 12px; }
  .file b { min-width: 0; font: 600 13.5px var(--rj-mono); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .file span { margin-left: auto; font: 500 12px var(--rj-mono); color: var(--rj-ink-3); white-space: nowrap; }
  .file button { padding: 0; border: 0; background: none; font: 500 13px var(--rj-font); color: var(--rj-ink); text-decoration: underline; text-underline-offset: 3px; cursor: pointer; }
  .file button:disabled { color: var(--rj-ink-3); cursor: default; text-decoration: none; }

  .grid { display: grid; grid-template-columns: minmax(0, 1fr); gap: 14px; @media (min-width: 640px) { grid-template-columns: minmax(0, 1.2fr) minmax(0, 1fr); } }
  .k { margin: 0 0 10px; font: 600 10.5px/1.2 var(--rj-mono); letter-spacing: 0.08em; text-transform: uppercase; color: var(--rj-ink-3); }
`;

const Text = styled.div`
  position: relative;
  max-height: 168px;
  overflow: hidden;
  padding: 14px 0 10px;
  border-radius: 16px;
  color: var(--rj-term-ink);
  background: var(--rj-term);
  font: 500 11px/1 var(--rj-mono);

  @media (min-width: 640px) { max-height: 420px; font-size: 12px; }

  .k { padding: 0 16px; color: var(--rj-term-dim); }

  .line {
    display: grid;
    grid-template-columns: 22px minmax(0, 1fr);
    gap: 10px;
    height: 22px;
    align-items: center;
    padding: 0 16px;
    opacity: 0.14;
    transition: opacity 0.2s;
  }
  .line.on { opacity: 1; }
  .n { font-size: 10.5px; text-align: right; color: var(--rj-term-dim); }
  .t { overflow: hidden; white-space: pre; text-overflow: ellipsis; }
  .tc { display: none; }
  @media (max-width: 639px) { .tf { display: none; } .tc { display: inline; } }

  .beam.wait { animation: ${sweep} 1.6s cubic-bezier(0.45, 0, 0.55, 1) infinite; @media (prefers-reduced-motion: reduce) { animation: none; } }
  .wait-lines { display: grid; gap: 12px; padding: 18px 16px 8px 48px; }
  .wait-lines i { display: block; height: 6px; border-radius: 3px; background: rgba(255, 255, 255, 0.08); }

  .beam {
    position: absolute;
    left: 0;
    right: 0;
    height: 2px;
    background: #ffe14d;
    box-shadow: 0 0 16px 3px rgba(255, 225, 77, 0.5);
    transition: top 0.07s linear;
  }
`;

const Checks = styled.div`
  display: grid;
  gap: 10px;
  align-content: start;
  padding: 14px 16px;
  border-radius: 16px;
  background: var(--rj-paper);
  box-shadow: inset 0 0 0 1px var(--rj-line);

  .g { margin-bottom: 4px; font-size: 12px; font-weight: 600; }
  .wait { margin: 0; font-size: 13px; line-height: 1.5; color: var(--rj-ink-3); }

  .c {
    display: grid;
    grid-template-columns: 16px minmax(0, 1fr) auto;
    gap: 8px;
    align-items: center;
    font-size: 12.5px;
    line-height: 1.5;
    color: var(--rj-ink-3);
  }
  .m { width: 12px; height: 12px; border-radius: 50%; box-shadow: inset 0 0 0 1.5px var(--rj-line); }
  .p { font: 500 11px var(--rj-mono); }
  .c.done { color: var(--rj-ink-2); }
  .c.done.ok .m { box-shadow: none; background: var(--rj-pass); }
  .c.done.bad .m { box-shadow: none; background: var(--rj-pen); }
  .c.done.bad { color: var(--rj-ink); }
`;

const Result = styled.div`
  max-width: 1160px;
  margin: 24px auto 0;
  display: grid;
  gap: 16px;
`;

const Moment = styled.section`
  display: grid;
  gap: 20px 28px;
  align-items: center;
  padding: 24px;
  border-radius: 28px;
  background: var(--rj-surface);
  box-shadow: 0 0 0 1px var(--rj-line), 0 30px 60px -44px rgba(0, 0, 0, 0.4);

  @media (min-width: 640px) { grid-template-columns: auto minmax(0, 1fr); padding: 28px 32px; }

  .ring { position: relative; width: 104px; height: 104px; @media (min-width: 640px) { width: 128px; height: 128px; } }
  .ring svg { width: 100%; height: 100%; transform: rotate(-90deg); }
  .ring .arc { transition: stroke-dashoffset 1.1s cubic-bezier(0.2, 0.8, 0.2, 1); @media (prefers-reduced-motion: reduce) { transition: none; } }
  .ring b { position: absolute; inset: 0; display: grid; place-items: center; font-size: 38px; font-weight: 700; letter-spacing: -0.05em; font-variant-numeric: tabular-nums; @media (min-width: 640px) { font-size: 46px; } }

  .k { margin: 0; font: 600 10.5px/1.2 var(--rj-mono); letter-spacing: 0.08em; text-transform: uppercase; color: var(--rj-ink-3); overflow-wrap: anywhere; }
  h2 { margin: 8px 0 0; color: var(--rj-ink); font-size: clamp(24px, 6vw, 34px); line-height: 1.1; letter-spacing: -0.035em; outline: none; }
  p.lede { margin: 8px 0 0; font-size: 16px; line-height: 1.5; color: var(--rj-ink-2); b { color: var(--rj-ink); } }
  .row { margin-top: 18px; display: flex; flex-wrap: wrap; align-items: center; gap: 12px 20px; }
`;

const Primary = styled.button<{ $light?: boolean; $wide?: boolean }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  height: 50px;
  padding: 0 24px;
  border: 0;
  border-radius: 999px;
  font: 600 15.5px var(--rj-font);
  cursor: pointer;
  color: ${({ $light }) => ($light ? "#0d0e10" : "var(--rj-btn-ink)")};
  background: ${({ $light }) => ($light ? "#f2f2ef" : "var(--rj-btn)")};
  ${({ $wide }) => $wide && "width: 100%;"}

  svg { width: 15px; height: 15px; }
  &:focus-visible { outline: 2px solid ${({ $light }) => ($light ? "#f2f2ef" : "var(--rj-ink)")}; outline-offset: 3px; }
`;

const TextButton = styled.button<{ $muted?: boolean }>`
  padding: 0;
  border: 0;
  background: none;
  font: 500 14.5px var(--rj-font);
  color: ${({ $muted }) => ($muted ? "var(--rj-ink-3)" : "var(--rj-ink)")};
  text-decoration: underline;
  text-decoration-color: color-mix(in srgb, var(--rj-ink) 30%, transparent);
  text-underline-offset: 3px;
  cursor: pointer;

  &:focus-visible { outline: 2px solid var(--rj-ink); outline-offset: 3px; }
`;

const Split = styled.div`
  display: grid;
  gap: 16px;

  @media (min-width: 1000px) { grid-template-columns: minmax(0, 1.25fr) minmax(0, 1fr); align-items: start; }
`;

const List = styled.section`
  padding: 8px 22px 12px;
  border-radius: 24px;
  background: var(--rj-surface);
  box-shadow: 0 0 0 1px var(--rj-line);

  .lh { display: flex; justify-content: space-between; align-items: baseline; padding: 14px 0 6px; }
  .lh h3 { margin: 0; color: var(--rj-ink); font-size: 17px; letter-spacing: -0.02em; }
  .lh span { font: 500 11.5px var(--rj-mono); color: var(--rj-ink-3); }

  .cat { padding: 14px 0; border-top: 1px solid var(--rj-line); }
  .rh { display: grid; grid-template-columns: minmax(0, 1fr) auto; gap: 8px 12px; align-items: center; }
  .nm { font-size: 15px; font-weight: 600; }
  .pt { font: 600 13px var(--rj-mono); font-variant-numeric: tabular-nums; em { font-style: normal; color: var(--rj-ink-3); } }
  .bar { grid-column: 1 / -1; height: 6px; border-radius: 3px; overflow: hidden; background: color-mix(in srgb, var(--rj-ink) 8%, transparent); }
  .bar i { display: block; height: 100%; border-radius: 3px; background: var(--rj-ink); }

  ul { list-style: none; margin: 12px 0 0; padding: 0; display: grid; gap: 10px; }
  li { display: grid; grid-template-columns: 16px minmax(0, 1fr) auto; gap: 8px; font-size: 13.5px; line-height: 1.45; color: var(--rj-ink-2); }
  li .mk { font-weight: 800; color: var(--rj-pen); }
  li.ok .mk { color: var(--rj-pass); }
  li b { display: block; font-weight: 600; color: var(--rj-ink); }
  li .gain { font: 600 11.5px/1.5 var(--rj-mono); color: var(--rj-ink-2); white-space: nowrap; }
`;

const Offer = styled.aside`
  display: grid;
  gap: 14px;
  align-content: start;
  padding: 22px;
  border-radius: 24px;
  color: var(--rj-bridge-ink);
  background: var(--rj-bridge);

  @media (min-width: 1000px) { position: sticky; top: 84px; }

  h3 { margin: 0; color: var(--rj-bridge-ink); font-size: 22px; letter-spacing: -0.03em; }
  p { margin: 0; font-size: 14.5px; line-height: 1.5; color: var(--rj-bridge-ink-2); }
  small { font-size: 12.5px; text-align: center; color: var(--rj-bridge-ink-2); }
`;

const MiniLens = styled.div`
  --x: 46%;
  position: relative;
  height: 210px;
  border-radius: 14px;
  overflow: clip;

  .before {
    position: absolute;
    inset: 0;
    padding: 30px 14px 0;
    overflow: hidden;
    white-space: pre;
    color: #d9dbd4;
    background: #141518;
    font: 500 9.5px/19px var(--rj-mono);
    clip-path: inset(0 calc(100% - var(--x)) 0 0);
    @media (min-width: 640px) { font-size: 10.5px; }
  }

  .after {
    position: absolute;
    inset: 0;
    display: grid;
    gap: 8px;
    align-content: start;
    padding: 32px 18px 0 calc(var(--x) + 18px);
    background: #fbfbf9;
    clip-path: inset(0 0 0 var(--x));

    i { display: block; width: 82%; height: 6px; border-radius: 3px; background: #dadbd6; }
    i.h { width: 40%; height: 7px; margin-top: 6px; background: #9c9fa6; }
    i.s { width: 64%; }
  }

  .line {
    position: absolute;
    top: 0;
    bottom: 0;
    left: var(--x);
    width: 2px;
    margin-left: -1px;
    background: #ffe14d;
    box-shadow: 0 0 18px 3px rgba(255, 225, 77, 0.45);
  }

  .tag { position: absolute; top: 8px; padding: 4px 6px; border-radius: 5px; font: 600 9.5px/1 var(--rj-mono); letter-spacing: 0.06em; text-transform: uppercase; }
  .tag.l { left: 8px; color: #a6a9b0; background: rgba(255, 255, 255, 0.06); }
  .tag.r { right: 8px; color: #4a4d55; background: rgba(13, 14, 16, 0.06); }
`;

const Next = styled.p`
  margin: 4px 0 0;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px 14px;
  font-size: 14.5px;
  color: var(--rj-ink-2);

  b { color: var(--rj-ink); }
  a { display: inline-flex; align-items: center; gap: 6px; padding-bottom: 1px; border-bottom: 1px solid var(--rj-ink); color: var(--rj-ink); font-weight: 600; text-decoration: none; }
  a svg { width: 14px; height: 14px; }
`;

/* ---------------------------------------------------------------- icons */

const Arrow = () => (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M3 8h10M9 4l4 4-4 4" />
  </svg>
);

const Tick = () => (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M3 8.5l3 3 7-7" />
  </svg>
);

/* ---------------------------------------------------------------- component */

export function AtsCheck() {
  const router = useRouter();
  const reduce = useReducedMotion();
  const { user } = useAuth();
  const [stage, setStage] = useState<Stage>("upload");
  const [fileName, setFileName] = useState("");
  const [text, setText] = useState("");
  const [result, setResult] = useState<ATSCheckResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [over, setOver] = useState(false);
  const [linesOn, setLinesOn] = useState(0);
  const [checksOn, setChecksOn] = useState(0);
  const [shown, setShown] = useState(0);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const textBox = useRef<HTMLDivElement>(null);
  const verdictRef = useRef<HTMLHeadingElement>(null);

  const clearTimers = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  };
  useEffect(() => clearTimers, []);

  // Coming back from signup with a saved scan: show it again.
  useEffect(() => {
    if (new URLSearchParams(window.location.search).get("restore") !== "1") return;
    const saved = loadScan();
    if (!saved) return;
    setFileName(saved.fileName);
    setText(saved.text);
    setResult(saved.result);
    setStage("result");
  }, []);

  // What the parser pulled out, without blank lines (the score still reads the full text).
  const lines = text ? text.split("\n").filter((l) => l.trim()).slice(0, 40) : [];

  const run = useCallback(
    async (name: string, getText: () => Promise<string>) => {
      clearTimers();
      setError(null);
      setFileName(name);
      setResult(null);
      setLinesOn(0);
      setChecksOn(0);
      setStage("scanning");
      const started = Date.now();
      try {
        const cvText = await getText();
        setText(cvText);
        const res = await fetch("/api/ats/check", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ cvText }),
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok || !data.result) throw new Error(data.error || "We couldn't read that file. Try a PDF or DOCX with real text in it.");
        setResult(data.result);
        // Let the reading play for about as long as the request took, at least a moment.
        const elapsed = Date.now() - started;
        const total = reduce ? 0 : Math.max(1600 - elapsed, 900);
        const lineCount = cvText.split("\n").filter((l) => l.trim()).length;
        for (let i = 1; i <= Math.min(lineCount, 40); i++) {
          timers.current.push(setTimeout(() => setLinesOn(i), (total * 0.75 * i) / Math.min(lineCount, 40)));
        }
        for (let i = 1; i <= 19; i++) timers.current.push(setTimeout(() => setChecksOn(i), total * 0.25 + (total * 0.7 * i) / 19));
        timers.current.push(setTimeout(() => setStage("result"), total + 450));
      } catch (e) {
        setStage("upload");
        setError(e instanceof Error ? e.message : "Something went wrong. Please try again.");
      }
    },
    [reduce]
  );

  const onFile = (file: File | undefined) => {
    if (!file) return;
    if (!/\.(pdf|docx?)$/i.test(file.name)) return setError("Please upload a PDF or DOCX file.");
    if (file.size > MAX_BYTES) return setError("That file is over 5 MB. Please upload a smaller one.");
    run(file.name, async () => {
      const form = new FormData();
      form.append("file", file);
      const res = await fetch("/api/ats/parse", { method: "POST", body: form });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.text) throw new Error(data.error || "We couldn't pull text out of that file. Scanned images can't be read; try exporting it again as a PDF or DOCX.");
      return data.text as string;
    });
  };

  // Score reveal: the ring fills and the number counts up, then focus moves to the verdict.
  useEffect(() => {
    if (stage !== "result" || !result) return;
    const end = result.overallScore;
    if (reduce) {
      setShown(end);
      verdictRef.current?.focus({ preventScroll: true });
      return;
    }
    setShown(0);
    let raf = 0;
    const t0 = performance.now();
    const tick = (t: number) => {
      const p = Math.min(1, (t - t0) / 1100);
      setShown(Math.round(end * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    verdictRef.current?.focus({ preventScroll: true });
    window.scrollTo({ top: 0 });
    return () => cancelAnimationFrame(raf);
  }, [stage, result, reduce]);

  // Keep the scan beam under the last line read.
  const beamTop = (() => {
    const box = textBox.current;
    const line = box?.querySelectorAll<HTMLElement>(".line")[Math.max(0, linesOn - 1)];
    return line ? line.offsetTop + line.offsetHeight : 34;
  })();

  const handOff = (to: string) => {
    if (result) saveScan({ fileName, text, result });
    router.push(user ? to : `${ROUTES.AUTH.SIGNUP}?redirect=${encodeURIComponent(to)}`);
  };

  const reset = () => {
    clearTimers();
    setStage("upload");
    setResult(null);
    setText("");
    setError(null);
    window.history.replaceState(null, "", window.location.pathname);
  };

  const cats = result ? checksOf(result) : [];
  const allChecks = cats.flatMap((c) => c.checks);
  const failed = allChecks.filter((c) => !c.passed);
  const gain = failed.reduce((n, c) => n + c.points, 0);
  const circ = 2 * Math.PI * 46;

  return (
    <Main>
      <Inner>
        <Head $result={stage === "result"}>
          <h1>
            Free <mark>ATS resume checker</mark>
          </h1>
          <p className="big">
            See what the <span>ATS</span> sees.
          </p>
          {stage === "upload" && (
            <p className="sub">
              Upload your resume and watch an applicant tracking system read it, line by line. <b>19 checks, the same every time</b>, and the fixes that matter most.
            </p>
          )}
        </Head>

        {stage === "upload" && (
          <Card data-nav-cta-hide>
            <Drop
              $over={over}
              onDragOver={(e) => {
                e.preventDefault();
                setOver(true);
              }}
              onDragLeave={() => setOver(false)}
              onDrop={(e) => {
                e.preventDefault();
                setOver(false);
                onFile(e.dataTransfer.files?.[0]);
              }}
            >
              <span className="doc" aria-hidden="true" />
              <b>Drop your resume here</b>
              <span className="small">PDF or DOCX, up to 5 MB</span>
              <span className="choose">
                Choose a file <Arrow />
              </span>
              <input type="file" accept=".pdf,.docx,.doc" onChange={(e) => onFile(e.target.files?.[0])} aria-label="Upload your resume" />
            </Drop>
            {error && <ErrorNote role="alert">{error}</ErrorNote>}
            <Alt>
              <button type="button" className="maya" onClick={() => run(MAYA_FILE, async () => BEFORE_TEXT)}>
                <i aria-hidden="true">M</i>
                <span>
                  No file handy? <u>Try Maya&apos;s resume</u>
                </span>
              </button>
              <ul>
                <li><Tick />No account</li>
                <li><Tick />No card</li>
                <li><Tick />We don&apos;t keep your file</li>
              </ul>
            </Alt>
          </Card>
        )}

        {stage === "scanning" && (
          <Card $wide>
            <Scan>
              <div className="file">
                <b>{fileName}</b>
                <span aria-live="polite">{result ? (checksOn >= 19 ? "19 checks done" : `Reading line ${Math.max(1, linesOn)} of ${Math.min(lines.length, 40)}`) : "Reading your file"}</span>
                <button type="button" disabled={!result} onClick={() => { clearTimers(); setStage("result"); }}>
                  Skip
                </button>
              </div>
              <div className="grid">
                <Text ref={textBox}>
                  <div className="k">Text the ATS pulled out</div>
                  <span className={`beam${result ? "" : " wait"}`} aria-hidden="true" style={result ? { top: beamTop } : undefined} />
                  {!result && (
                    <div className="wait-lines" aria-hidden="true">
                      <i style={{ width: "40%" }} /><i style={{ width: "72%" }} /><i style={{ width: "64%" }} /><i style={{ width: "80%" }} /><i style={{ width: "52%" }} />
                    </div>
                  )}
                  {lines.map((l, i) => (
                    <div key={i} className={`line${i < linesOn ? " on" : ""}`}>
                      <span className="n">{i + 1}</span>
                      <span className="t">
                        <span className="tf">{l}</span>
                        <span className="tc">{compact(l)}</span>
                      </span>
                    </div>
                  ))}
                </Text>
                <Checks aria-label="19 checks">
                  <div className="k">19 checks</div>
                  {!result && <p className="wait">The checks run as soon as the text is out of your file.</p>}
                  {(result ? checksOf(result) : []).map((c, ci, all) => {
                    const before = all.slice(0, ci).reduce((n, x) => n + x.checks.length, 0);
                    return (
                      <div key={c.key}>
                        <div className="g">{c.name}</div>
                        {c.checks.map((ch, i) => (
                          <div key={ch.id} className={`c${before + i < checksOn ? ` done ${ch.passed ? "ok" : "bad"}` : ""}`}>
                            <span className="m" aria-hidden="true" />
                            <span>{ch.name}</span>
                            <span className="p">{ch.points}</span>
                          </div>
                        ))}
                      </div>
                    );
                  })}
                </Checks>
              </div>
            </Scan>
          </Card>
        )}

        {stage === "result" && result && (
          <Result>
            <Moment aria-labelledby="ats-verdict">
              <div className="ring" aria-hidden="true">
                <svg viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="46" fill="none" stroke="var(--rj-line)" strokeWidth="6" />
                  <circle
                    className="arc"
                    cx="50"
                    cy="50"
                    r="46"
                    fill="none"
                    stroke="var(--rj-ink)"
                    strokeWidth="6"
                    strokeLinecap="round"
                    strokeDasharray={circ}
                    strokeDashoffset={circ * (1 - shown / 100)}
                  />
                </svg>
                <b>{shown}</b>
              </div>
              <div>
                <p className="k">ATS score {result.overallScore} / 100 · {fileName}</p>
                <h2 id="ats-verdict" ref={verdictRef} tabIndex={-1}>{verdict(result.overallScore)}</h2>
                <p className="lede">
                  {failed.length === 0 ? (
                    "Every one of the 19 checks passed."
                  ) : (
                    <>
                      {failed.length} of 19 checks failed. Fixing them is worth up to <b>+{gain} points</b>.
                    </>
                  )}
                </p>
                <div className="row">
                  {failed.length > 0 && (
                    <Primary type="button" onClick={() => handOff(OPTIMIZER_HANDOFF)}>
                      Fix it for me <Arrow />
                    </Primary>
                  )}
                  {!user && <TextButton type="button" onClick={() => handOff(`${ROUTES.PUBLIC.ATS_CHECK}?restore=1`)}>Save this scan</TextButton>}
                  <TextButton type="button" $muted onClick={reset}>Scan another</TextButton>
                </div>
              </div>
            </Moment>

            <Split>
              <List aria-label="Your score, check by check">
                <div className="lh">
                  <h3>Check by check</h3>
                  <span>free · all 19</span>
                </div>
                {cats.map((c) => {
                  const bad = c.checks.filter((ch) => !ch.passed);
                  const ok = c.checks.length - bad.length;
                  return (
                    <div className="cat" key={c.key}>
                      <div className="rh">
                        <span className="nm">{c.name}</span>
                        <span className="pt">{c.earned}<em>/{c.max}</em></span>
                        <span className="bar" aria-hidden="true"><i style={{ width: `${(c.earned / c.max) * 100}%` }} /></span>
                      </div>
                      <ul>
                        {bad.map((ch) => (
                          <li key={ch.id}>
                            <span className="mk" aria-label="Failed">✕</span>
                            <span><b>{ch.name}</b>{ch.suggestion}</span>
                            <span className="gain">+{ch.points}</span>
                          </li>
                        ))}
                        <li className="ok">
                          <span className="mk" aria-hidden="true">✓</span>
                          <span>{ok} of {c.checks.length} checks pass</span>
                          <span />
                        </li>
                      </ul>
                    </div>
                  );
                })}
              </List>

              {failed.length > 0 && (
                <Offer aria-labelledby="ats-offer">
                  <h3 id="ats-offer">Fix it for me</h3>
                  <p>Rejectly rebuilds your resume as one clean column with standard headings and bullets, keeps your facts, and scores it again.</p>
                  <MiniLens aria-hidden="true">
                    <div className="before">{lines.slice(0, 9).map(compact).join("\n")}</div>
                    <div className="after">
                      <i className="h" /><i /><i className="s" /><i className="h" /><i /><i /><i className="s" /><i className="h" /><i /><i />
                    </div>
                    <span className="line" />
                    <span className="tag l">Your file, as read</span>
                    <span className="tag r">Fixed layout</span>
                  </MiniLens>
                  <Primary type="button" $light $wide onClick={() => handOff(OPTIMIZER_HANDOFF)}>
                    Fix it for me · 1 credit (${PRICING.SINGLE.price}) <Arrow />
                  </Primary>
                  <small>Credits never expire. Untouched packs refunded within 14 days.</small>
                </Offer>
              )}
            </Split>

            <Next>
              <b>Applying to a specific job?</b> Match your resume to the post.
              <Link href="/#demo">Try the job match <Arrow /></Link>
            </Next>
          </Result>
        )}
      </Inner>
    </Main>
  );
}

export default AtsCheck;
