"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import Link from "next/link";
import styled, { keyframes } from "styled-components";
import { CVPreview } from "@/components/cv-builder/CVPreview";
import { ROUTES } from "@/lib/constants";
import { CHANGE_COPY } from "@/lib/roleExamples/copy";
import type { RoleScores } from "@/lib/roleExamples/score";
import type { BeforeDoc, Pin, RoleExample } from "@/lib/roleExamples/types";

/*
 * One example resume, four ways: before or after, as a person sees it or as
 * the ATS reads it. Numbered pins sit on the change they belong to; the list
 * explains each one with the check it fixed and its points (from score.ts).
 */

const W = 780; // both papers are drawn at this width and scaled to fit
const STANDARD = new Set(["SUMMARY", "EXPERIENCE", "EDUCATION", "SKILLS", "PROJECTS", "CONTACT", "LANGUAGES", "CERTIFICATIONS"]);
/** What each sidebar icon stands for, for the note under the ATS view. */
const ICON_NAMES: Record<string, string> = { in: "LinkedIn", GH: "GitHub", "Bē": "Behance", "✦": "portfolio" };
const sweep = keyframes`0% { top: 0; opacity: 1; } 90% { opacity: 1; } 100% { top: 100%; opacity: 0; }`;
const ease = "cubic-bezier(0.32, 0.72, 0, 1)";

const Bar = styled.div`
  position: sticky;
  top: 64px;
  z-index: 5;
  padding: 10px 0;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px 14px;
  background: color-mix(in srgb, var(--rj-paper) 88%, transparent);
  -webkit-backdrop-filter: blur(12px);
  backdrop-filter: blur(12px);

  .who { margin-left: auto; font: 500 12px var(--rj-mono); white-space: nowrap; color: var(--rj-ink-3); }
`;

const Seg = styled.div`
  display: inline-flex;
  padding: 3px;
  border-radius: 999px;
  background: color-mix(in srgb, var(--rj-ink) 7%, transparent);

  button { height: 36px; padding: 0 16px; border: 0; border-radius: 999px; font: 600 14px var(--rj-font); color: var(--rj-ink-2); background: none; cursor: pointer; transition: background 0.25s, color 0.25s; }
  button[aria-pressed="true"] { color: var(--rj-ink); background: var(--rj-surface); box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12); }
  button:focus-visible { outline: 2px solid var(--rj-ink); outline-offset: 2px; }
`;

const Grid = styled.div`
  margin-top: 18px;
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 20px;

  @media (min-width: 1000px) { grid-template-columns: minmax(0, 1fr) 380px; gap: 32px; align-items: start; }
`;

const Frame = styled.div`
  position: relative;
  min-width: 0;
  overflow: hidden;
  border-radius: 6px;
  background: #fff;
  box-shadow: 0 0 0 1px var(--rj-line), 0 40px 80px -48px rgba(0, 0, 0, 0.45);
  transition: height 0.4s ${ease};

  .scale { width: ${W}px; transform-origin: 0 0; }
  .views { display: grid; }
  .views > div { grid-area: 1 / 1; transition: opacity 0.45s ease, transform 0.55s ${ease}, filter 0.45s ease; }
  .views > div[data-on="false"] { opacity: 0; transform: scale(0.985); filter: blur(4px); visibility: hidden; pointer-events: none; transition: opacity 0.45s ease, transform 0.55s ${ease}, filter 0.45s ease, visibility 0s 0.45s; }
  .views #cv-preview-paper { box-shadow: none; border-radius: 0; }

  &::after { content: ""; position: absolute; left: 0; right: 0; top: 0; height: 2px; opacity: 0; pointer-events: none; background: #ffe14d; box-shadow: 0 0 14px 3px rgba(255, 225, 77, 0.6); }
  &.sweep::after { animation: ${sweep} 0.9s cubic-bezier(0.45, 0, 0.55, 1); }

  @media (prefers-reduced-motion: reduce) { .views > div { transition: none; } &::after { animation: none; } }
`;

/* A typical student template: navy sidebar, skill bars, stars and arrows. */
const BeforeSheet = styled.div`
  display: grid;
  grid-template-columns: 250px 1fr;
  min-height: 1000px;
  font-family: var(--rj-font);
  color: #2b2f36;

  .side { padding: 44px 26px; background: var(--side); color: #e9eef7; }
  .ph { width: 96px; height: 96px; margin: 0 auto 18px; border-radius: 50%; display: grid; place-items: center; font: 700 32px var(--rj-font); color: #fff; background: linear-gradient(135deg, #8aa4cf, #4e6a99); }
  .ph.photo { background: radial-gradient(circle at 50% 38%, #f1d3b3 0 22%, transparent 23%), radial-gradient(circle at 50% 100%, #9fb3c8 0 45%, transparent 46%), linear-gradient(160deg, #dfe7ef, #b8c6d6); box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.5); }
  .chart { display: grid; grid-template-columns: 84px 1fr; gap: 12px; align-items: center; margin-top: 4px; }
  .chart svg { width: 84px; height: 84px; transform: rotate(-90deg); }
  .chart ul { list-style: none; margin: 0; padding: 0; display: grid; gap: 5px; font-size: 11.5px; }
  .chart li { display: flex; align-items: center; gap: 6px; }
  .chart li i { width: 8px; height: 8px; border-radius: 2px; }
  table { width: 100%; margin: 4px 0 10px; border-collapse: collapse; font-size: 13px; }
  td { padding: 7px 9px; border: 1px solid #d9dee8; background: #f6f8fb; }
  h1 { margin: 0; text-align: center; font: 700 24px/1.15 var(--rj-font); letter-spacing: 0.02em; color: #fff; }
  .tag { margin: 6px 0 24px; text-align: center; font-size: 13px; font-style: italic; color: #b9c8e3; }
  h4 { margin: 24px 0 10px; padding-bottom: 6px; border-bottom: 1px solid rgba(255, 255, 255, 0.25); font: 700 12px var(--rj-font); letter-spacing: 0.14em; text-transform: uppercase; color: #fff; }
  .side p { margin: 0 0 6px; font-size: 12.5px; line-height: 1.5; color: #dfe7f5; overflow-wrap: anywhere; }
  .icons { display: flex; gap: 8px; margin-top: 8px; }
  .icons i { width: 28px; height: 28px; border-radius: 7px; display: grid; place-items: center; font: 700 11px var(--rj-font); font-style: normal; color: var(--side); background: #e9eef7; }
  .barrow { display: grid; grid-template-columns: 1fr auto; align-items: center; gap: 8px; margin-bottom: 7px; font-size: 12.5px; }
  .barrow i { font-style: normal; font-size: 11px; letter-spacing: 2px; color: var(--accent); }
  .main { padding: 44px 36px; }
  section { margin-bottom: 28px; }
  h3 { margin: 0 0 10px; display: flex; align-items: center; gap: 8px; font: 700 16px var(--rj-font); letter-spacing: 0.06em; text-transform: uppercase; color: var(--side); }
  h3::before { content: var(--mark); font-size: 14px; color: var(--accent); }
  .main p { margin: 0 0 6px; font-size: 13.5px; line-height: 1.55; }
  .t { font-weight: 700; font-size: 14px; color: var(--side); }
  .s { font-size: 13px; font-style: italic; color: #6b7280; }
  ul { margin: 6px 0 10px; padding-left: 18px; list-style: "➤  "; font-size: 13.5px; line-height: 1.6; }
`;

const Ats = styled.pre`
  margin: 0;
  min-height: 1000px;
  padding: 40px;
  font: 500 13.5px/1.75 var(--rj-mono);
  white-space: pre-wrap;
  overflow-wrap: anywhere;
  color: #d9dbd4;
  background: #101114;

  .cap { display: block; margin-bottom: 16px; padding-bottom: 12px; border-bottom: 1px solid rgba(255, 255, 255, 0.1); font: 600 11.5px var(--rj-mono); letter-spacing: 0.08em; text-transform: uppercase; white-space: normal; color: #81858e; }
  .x { color: #ff7468; text-decoration: underline wavy rgba(255, 116, 104, 0.6); text-underline-offset: 4px; }
  .h { font-weight: 700; color: #fff; }
  .d { color: #81858e; }
`;

const PinBtn = styled.button<{ $pen: boolean; $on: boolean }>`
  position: absolute;
  z-index: 3;
  width: 24px;
  height: 24px;
  margin: -12px 0 0 -12px;
  border: 0;
  border-radius: 50%;
  display: grid;
  place-items: center;
  font: 700 11.5px var(--rj-font);
  cursor: pointer;
  transition: transform 0.2s;
  transform: scale(${({ $on }) => ($on ? 1.25 : 1)});
  color: ${({ $pen }) => ($pen ? "#fff" : "#0d0e10")};
  background: ${({ $pen }) => ($pen ? "#e0352b" : "#ffe14d")};
  box-shadow: 0 0 0 3px ${({ $pen }) => ($pen ? "rgba(224, 53, 43, 0.25)" : "rgba(255, 225, 77, 0.35)")}, 0 4px 10px rgba(0, 0, 0, 0.2);

  &:focus-visible { outline: 2px solid var(--rj-ink); outline-offset: 2px; }
`;

const Side = styled.aside`
  display: grid;
  gap: 14px;

  @media (min-width: 1000px) { position: sticky; top: 128px; }
`;

const Score = styled.div`
  padding: 18px;
  border-radius: 22px;
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 4px 16px;
  align-items: center;
  background: var(--rj-surface);
  box-shadow: 0 0 0 1px var(--rj-line);

  .ring { position: relative; grid-row: 1 / 3; width: 76px; height: 76px; }
  .ring svg { width: 100%; height: 100%; transform: rotate(-90deg); }
  .arc { transition: stroke-dashoffset 0.9s cubic-bezier(0.2, 0.8, 0.2, 1); }
  .ring b { position: absolute; inset: 0; display: grid; place-items: center; font-size: 24px; letter-spacing: -0.03em; font-variant-numeric: tabular-nums; color: var(--rj-ink); }
  .t { font-size: 15px; font-weight: 650; color: var(--rj-ink); }
  .n { font-size: 13.5px; color: var(--rj-ink-2); }
  small { grid-column: 1 / -1; margin-top: 8px; font: 500 11px var(--rj-mono); color: var(--rj-ink-3); }
  @media (prefers-reduced-motion: reduce) { .arc { transition: none; } }
`;

const List = styled.ol<{ $after: boolean }>`
  list-style: none;
  margin: 0;
  padding: 6px;
  border-radius: 22px;
  background: var(--rj-surface);
  box-shadow: 0 0 0 1px var(--rj-line);

  li + li { border-top: 1px solid var(--rj-line); }
  button { width: 100%; display: grid; grid-template-columns: 24px minmax(0, 1fr) auto; gap: 2px 12px; align-items: start; padding: 12px 10px; border: 0; border-radius: 14px; text-align: left; font: inherit; color: inherit; background: none; cursor: pointer; }
  button:hover, button[data-focus="true"] { background: color-mix(in srgb, var(--rj-ink) 4%, transparent); }
  button:focus-visible { outline: 2px solid var(--rj-ink); outline-offset: -2px; }
  .num { width: 22px; height: 22px; border-radius: 50%; display: grid; place-items: center; font: 700 11px var(--rj-font); color: ${({ $after }) => ($after ? "#0d0e10" : "#fff")}; background: ${({ $after }) => ($after ? "var(--rj-hl)" : "var(--rj-pen)")}; }
  .tt { font-size: 14.5px; font-weight: 600; line-height: 1.35; color: var(--rj-ink); }
  .pts { font: 600 12px var(--rj-mono); white-space: nowrap; color: ${({ $after }) => ($after ? "var(--rj-pass)" : "var(--rj-ink-3)")}; }
  .why { grid-column: 2 / 4; font-size: 13.5px; line-height: 1.5; color: var(--rj-ink-2); }
  .chk { grid-column: 2 / 4; margin-top: 4px; font: 500 11px var(--rj-mono); color: ${({ $after }) => ($after ? "var(--rj-ink-3)" : "var(--rj-pen)")}; }
`;

const Cta = styled.div`
  padding: 16px 18px;
  border-radius: 18px;
  display: grid;
  gap: 10px;
  background: var(--rj-bridge);

  b { font-size: 16px; color: var(--rj-bridge-ink); }
  span { font-size: 13.5px; line-height: 1.5; color: var(--rj-bridge-ink-2); }
  a { justify-self: start; height: 40px; padding: 0 16px; display: inline-flex; align-items: center; border-radius: 999px; font: 600 14px var(--rj-font); color: #0d0e10; background: var(--rj-hl); text-decoration: none; }
  a:hover { color: #0d0e10; }
  a:focus-visible { outline: 2px solid var(--rj-bridge-ink); outline-offset: 2px; }
`;

const Note = styled.p`
  margin: 0;
  font-size: 13px;
  line-height: 1.5;
  color: var(--rj-ink-3);

  .sw { display: inline-block; width: 10px; height: 10px; margin-right: 6px; border-radius: 2px; vertical-align: -1px; background: #fff3b0; box-shadow: inset 0 -1.5px 0 #e6c200; }
`;

function BeforePaper({ doc }: { doc: BeforeDoc }) {
  const initials = doc.name.split(" ").map((w) => w[0]).join("").slice(0, 2);
  const look = { side: "#23395d", accent: "#ffb703", mark: "★", ...doc.look };
  return (
    <BeforeSheet style={{ "--side": look.side, "--accent": look.accent, "--mark": `"${look.mark}"` } as React.CSSProperties}>
      <div className="side">
        <div className={look.photo ? "ph photo" : "ph"} aria-hidden="true">{look.photo ? "" : initials}</div>
        <h1 data-pin="columns">{doc.name}</h1>
        <p className="tag">{doc.tagline}</p>
        {doc.sidebar.map((b) => (
          <div key={b.heading}>
            <h4 data-pin={b.pin}>{b.heading}</h4>
            {b.lines?.map((l) => <p key={l}>{l}</p>)}
            {b.icons && <div className="icons" aria-hidden="true">{b.icons.map((i) => <i key={i}>{i}</i>)}</div>}
            {b.bars?.map((bar) => (
              <div className="barrow" key={bar.label}>{bar.label}<i aria-label={`${bar.level} of 5`}>{"●".repeat(bar.level)}{"○".repeat(5 - bar.level)}</i></div>
            ))}
            {b.chart && (
              <div className="chart" aria-hidden="true">
                <svg viewBox="0 0 42 42">{b.chart.reduce<{ el: React.ReactNode[]; at: number }>((acc, c, i) => {
                  acc.el.push(<circle key={c.label} cx="21" cy="21" r="15.9" fill="none" strokeWidth="6" stroke={["#ffd166", "#ef476f", "#06d6a0", "#8ecae6", "#fb8500"][i % 5]} strokeDasharray={`${c.value} ${100 - c.value}`} strokeDashoffset={25 - acc.at} />);
                  acc.at += c.value;
                  return acc;
                }, { el: [], at: 0 }).el}</svg>
                <ul>{b.chart.map((c, i) => <li key={c.label}><i style={{ background: ["#ffd166", "#ef476f", "#06d6a0", "#8ecae6", "#fb8500"][i % 5] }} />{c.label}</li>)}</ul>
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="main">
        {doc.main.map((b) => (
          <section key={b.heading}>
            <h3 data-pin={b.pin}>{b.heading}</h3>
            {b.text && <p>{b.text}</p>}
            {b.entries?.map((e) => (
              <div key={e.title} data-pin={e.pin}>
                <p className="t">{e.title}</p>
                {e.sub && <p className="s">{e.sub}</p>}
                {e.bullets && <ul>{e.bullets.map((x) => <li key={x}>{x}</li>)}</ul>}
                {e.table && <table><tbody>{e.table.map((row, r) => <tr key={r}>{row.map((cell) => <td key={cell}>{cell}</td>)}</tr>)}</tbody></table>}
              </div>
            ))}
          </section>
        ))}
      </div>
    </BeforeSheet>
  );
}

function AtsView({ text, caption, bad, notes }: { text: string; caption: string; bad?: string[]; notes?: string[] }) {
  const lines = text.split("\n");
  const mark = (line: string, i: number) => {
    const hit = bad?.find((b) => line.includes(b));
    if (hit) {
      const [a, ...rest] = line.split(hit);
      return <span key={i}>{a}<span className="x">{hit}</span>{rest.join(hit)}{"\n"}</span>;
    }
    return <span key={i} className={STANDARD.has(line.trim()) ? "h" : undefined}>{line}{"\n"}</span>;
  };
  return (
    <Ats>
      <span className="cap">{caption}</span>
      {lines.map(mark)}
      {notes && notes.length > 0 && <span className="d">{"\n"}{notes.map((n) => `— ${n}`).join("\n")}</span>}
    </Ats>
  );
}

/** Finds the element on the "after" paper that holds `text` most tightly. */
function findText(root: HTMLElement, text: string): HTMLElement | null {
  const want = text.toLowerCase();
  let best: HTMLElement | null = null;
  root.querySelectorAll<HTMLElement>("*").forEach((el) => {
    if (best) return;
    if (!el.textContent?.toLowerCase().includes(want)) return;
    const child = [...el.children].some((c) => c.textContent?.toLowerCase().includes(want));
    if (!child) best = el;
  });
  return best;
}

export function BeforeAfter({ example, scores }: { example: RoleExample; scores: RoleScores }) {
  const [v, setV] = useState<"before" | "after">("before");
  const [mode, setMode] = useState<"human" | "ats">("human");
  const [focus, setFocus] = useState<Pin | null>(null);
  const [open, setOpen] = useState<Pin | null>(null);
  const [shown, setShown] = useState(scores.before);
  const [pins, setPins] = useState<Partial<Record<Pin, { x: number; y: number }>>>({});
  const frame = useRef<HTMLDivElement>(null);
  const scaler = useRef<HTMLDivElement>(null);
  const rows = useRef<Partial<Record<Pin, HTMLButtonElement | null>>>({});
  const after = v === "after";
  const view = `${v}-${mode}`;
  const target = after ? scores.after : scores.before;

  // Count the score up or down.
  useEffect(() => {
    let raf = 0;
    const from = shown;
    const t0 = performance.now();
    const step = (t: number) => {
      const k = Math.min(1, (t - t0) / 900);
      setShown(Math.round(from + (target - from) * (1 - Math.pow(1 - k, 3))));
      if (k < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target]);

  const layout = useCallback(() => {
    const f = frame.current;
    const sc = scaler.current;
    if (!f || !sc) return;
    const s = f.clientWidth / W;
    sc.style.transform = `scale(${s})`;
    const active = sc.querySelector<HTMLElement>(`[data-view="${view}"]`);
    if (!active) return;
    f.style.height = `${active.offsetHeight * s}px`;
    if (mode === "ats") return setPins({});
    const fr = f.getBoundingClientRect();
    const next: Partial<Record<Pin, { x: number; y: number }>> = {};
    for (const c of scores.changes) {
      const el = after
        ? (example.afterAnchors[c.pin] ? findText(active, example.afterAnchors[c.pin]!) : null)
        : active.querySelector<HTMLElement>(`[data-pin="${c.pin}"]`);
      if (!el) continue;
      const r = el.getBoundingClientRect();
      next[c.pin] = { x: Math.max(14, r.left - fr.left - 20), y: r.top - fr.top + 10 * s };
    }
    setPins(next);
  }, [view, mode, after, scores.changes, example.afterAnchors]);

  useLayoutEffect(() => {
    layout();
    const t = window.setTimeout(layout, 500); // after the crossfade settles
    const ro = new ResizeObserver(layout);
    if (frame.current) ro.observe(frame.current);
    return () => { window.clearTimeout(t); ro.disconnect(); };
  }, [layout]);

  const pick = (next: "before" | "after") => {
    if (next === v) return;
    setV(next);
    const f = frame.current;
    if (f) { f.classList.remove("sweep"); void f.offsetWidth; f.classList.add("sweep"); }
  };
  const toggle = (pin: Pin) => { setFocus(pin); setOpen((o) => (o === pin ? null : pin)); };

  const beforeHeadings = [...example.before.sidebar.map((b) => b.heading), ...example.before.main.map((b) => b.heading)]
    .map((h) => h.toUpperCase())
    .filter((h) => !STANDARD.has(h));
  const icons = example.before.sidebar.flatMap((b) => b.icons ?? []);
  const notes = [
    !/\(?\d{3}\)?[\s.-]?\d{3}[\s.-]\d{4}/.test(scores.beforeText) && "no phone number",
    icons.length > 0 && `the ${icons.map((i) => ICON_NAMES[i] ?? i).join(", ").replace(/, ([^,]*)$/, " and $1")} icon${icons.length > 1 ? "s" : ""} left no text behind`,
    !/\b(19|20)\d{2}\b/.test(scores.beforeText) && "no dates anywhere",
  ].filter(Boolean) as string[];
  const C = 2 * Math.PI * 42;
  const name = example.person.first;

  return (
    <div>
      <Bar>
        <Seg role="group" aria-label="Version">
          <button type="button" aria-pressed={!after} onClick={() => pick("before")}>Before</button>
          <button type="button" aria-pressed={after} onClick={() => pick("after")}>After</button>
        </Seg>
        <Seg role="group" aria-label="View">
          <button type="button" aria-pressed={mode === "human"} onClick={() => setMode("human")}>As people see it</button>
          <button type="button" aria-pressed={mode === "ats"} onClick={() => setMode("ats")}>As the ATS reads it</button>
        </Seg>
        <span className="who">Example · fictional student</span>
      </Bar>

      <Grid>
        <Frame ref={frame}>
          <div className="scale" ref={scaler}>
            <div className="views">
              <div data-view="before-human" data-on={view === "before-human"} aria-hidden={view !== "before-human"}><BeforePaper doc={example.before} /></div>
              <div data-view="after-human" data-on={view === "after-human"} aria-hidden={view !== "after-human"}><CVPreview cv={example.after} /></div>
              <div data-view="before-ats" data-on={view === "before-ats"} aria-hidden={view !== "before-ats"}>
                <AtsView text={scores.beforeText} caption="What a parser pulls out of the PDF: the two columns run into each other, line by line." bad={beforeHeadings} notes={notes} />
              </div>
              <div data-view="after-ats" data-on={view === "after-ats"} aria-hidden={view !== "after-ats"}>
                <AtsView text={scores.afterText} caption="What a parser pulls out of the PDF: one column, in reading order." />
              </div>
            </div>
          </div>
          {scores.changes.map((c, i) => {
            const p = pins[c.pin];
            if (!p) return null;
            const copy = { ...CHANGE_COPY[c.pin], ...example.changes?.[c.pin] };
            return (
              <PinBtn
                key={c.pin}
                type="button"
                $pen={!after}
                $on={focus === c.pin}
                style={{ left: p.x, top: p.y }}
                aria-label={`${i + 1}: ${after ? copy.after : copy.before}`}
                onClick={() => { toggle(c.pin); rows.current[c.pin]?.scrollIntoView({ block: "nearest", behavior: "smooth" }); }}
              >
                {i + 1}
              </PinBtn>
            );
          })}
        </Frame>

        <Side>
          <Score aria-live="polite">
            <div className="ring">
              <svg viewBox="0 0 100 100" aria-hidden="true">
                <circle cx="50" cy="50" r="42" fill="none" stroke="var(--rj-line)" strokeWidth="10" />
                <circle className="arc" cx="50" cy="50" r="42" fill="none" stroke="var(--rj-ink)" strokeWidth="10" strokeLinecap="round" strokeDasharray={C} strokeDashoffset={C * (1 - target / 100)} />
              </svg>
              <b>{shown}</b>
            </div>
            <span className="t">ATS score</span>
            <span className="n">{after ? (scores.afterFailing.length ? `${scores.afterFailing.length} of 19 checks fail` : "All 19 checks pass") : `${scores.beforeFailing} of 19 checks fail`}</span>
            <small>Same 19 checks as the free ATS scan · code, not AI</small>
          </Score>

          <List $after={after} onMouseLeave={() => setFocus(null)}>
            {scores.changes.map((c, i) => {
              const copy = { ...CHANGE_COPY[c.pin], ...example.changes?.[c.pin] };
              return (
                <li key={c.pin}>
                  <button
                    ref={(el) => { rows.current[c.pin] = el; }}
                    type="button"
                    data-focus={focus === c.pin}
                    aria-expanded={open === c.pin}
                    onMouseEnter={() => setFocus(c.pin)}
                    onFocus={() => setFocus(c.pin)}
                    onClick={() => toggle(c.pin)}
                  >
                    <span className="num">{i + 1}</span>
                    <span className="tt">{after ? copy.after : copy.before}</span>
                    <span className="pts">{after ? "+" : "−"}{c.points}</span>
                    {open === c.pin && (
                      <>
                        <span className="why">{after ? copy.whyAfter : copy.why}</span>
                        <span className="chk">{c.checks.join(" · ")}</span>
                      </>
                    )}
                  </button>
                </li>
              );
            })}
          </List>

          {mode === "ats" && (
            <Cta>
              <b>What does yours look like?</b>
              <span>Upload your resume and see the text an ATS pulls out of it, with all 19 checks. Free, no account.</span>
              <Link href={ROUTES.PUBLIC.ATS_CHECK}>Scan yours, free</Link>
            </Cta>
          )}
          {after && scores.after === 100 && <Note>100 means every check passes: an ATS can read this resume. It doesn’t mean an interview.</Note>}
          <Note><span className="sw" aria-hidden="true" />Highlighted numbers are {name}’s answers. Rejectly asks for numbers; it never makes them up.</Note>
        </Side>
      </Grid>
    </div>
  );
}

export default BeforeAfter;
