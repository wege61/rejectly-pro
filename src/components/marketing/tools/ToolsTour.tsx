"use client";

import { useCallback, useEffect, useRef, useState, type ComponentType } from "react";
import styled, { keyframes } from "styled-components";
import { useReducedMotion } from "framer-motion";
import { ROUTES } from "@/lib/constants";
import { BuilderPanel, CheckPanel, GrowPanel, InterviewPanel, LetterPanel, MatchPanel, type PanelProps } from "./panels";

/*
 * Homepage section 4: six tools, shown as one application from scan to next skill.
 * A tablist of steps and a live panel. While the section is on screen the tour
 * advances on its own; it waits when off screen or the tab is hidden, stops for good
 * when a step is picked, and can always be paused (WCAG 2.2.2).
 * No prices here on purpose: pricing lives in its own section.
 */

const DWELL = 7000;

interface Tool {
  id: string;
  name: string;
  title: string;
  line: string;
  cta: string;
  href: string;
  Panel: ComponentType<PanelProps & { active: boolean }>;
}

const BUILDER: Tool = {
  id: "builder",
  name: "CV Builder",
  title: "No resume? Start from a clean template.",
  line: "Fill it in your own words. Pro rewrites each line with AI.",
  cta: "Open the CV Builder",
  href: ROUTES.PUBLIC.CV_BUILDER,
  Panel: BuilderPanel,
};

const TOUR: Tool[] = [
  { id: "check", name: "ATS Check", title: "See how the ATS reads it.", line: "No job post needed. Finds the format problems Workday, Greenhouse, Lever and Taleo trip over.", cta: "Scan your resume", href: ROUTES.PUBLIC.ATS_CHECK, Panel: CheckPanel },
  { id: "match", name: "Job Match", title: "Tailor it to every job.", line: "Each job post gets its own version of your resume, in that post's words.", cta: "Match your resume to a job", href: "#demo", Panel: MatchPanel },
  { id: "letter", name: "Cover Letters", title: "Write the cover letter.", line: "Written for this role and this company. Pick the tone.", cta: "Write your cover letter", href: ROUTES.APP.COVER_LETTERS, Panel: LetterPanel },
  { id: "interview", name: "Interview Prep", title: "Prepare for the interview.", line: "Likely questions for this role, with answer outlines from your real experience.", cta: "Prepare for your interview", href: "#demo", Panel: InterviewPanel },
  { id: "plan", name: "Career Plan", title: "Grow into the next requirement.", line: "A requirement you don't meet stays unmet. Your career plan shows how to earn it.", cta: "See your career plan", href: "#demo", Panel: GrowPanel },
];

const ALL = [BUILDER, ...TOUR];

/* ── layout ──────────────────────────────────────────────────────────────── */

const Section = styled.section`
  background: var(--rj-sheet);
  color: var(--rj-ink);
  font-family: var(--rj-font);
  -webkit-font-smoothing: antialiased;
  border-top: 1px solid var(--rj-line);
`;

const Inner = styled.div`
  max-width: 1240px;
  margin: 0 auto;
  display: grid;
  gap: 28px;
  padding: 56px max(20px, env(safe-area-inset-right, 0px)) 64px max(20px, env(safe-area-inset-left, 0px));

  @media (min-width: 640px) { gap: 36px; padding: 88px 40px 96px; }
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
    max-width: 14em;
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

const Window = styled.div`
  min-width: 0;
  border-radius: 26px;
  background: var(--rj-tile);
  overflow: hidden;
`;

const Body = styled.div`
  display: grid;
  min-width: 0;

  @media (min-width: 1000px) {
    grid-template-columns: 240px minmax(0, 1fr);
  }
`;

const Nav = styled.div`
  position: relative;
  display: grid;
  min-width: 0;
  border-bottom: 1px solid var(--rj-line);

  /* phones and tablets: a fading edge says the step strip scrolls */
  &::after {
    content: "";
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    width: 44px;
    pointer-events: none;
    background: linear-gradient(90deg, transparent, var(--rj-tile));
  }

  @media (min-width: 1000px) {
    align-content: start;
    gap: 10px;
    padding: 16px;
    border-bottom: 0;
    border-right: 1px solid var(--rj-line);

    &::after { display: none; }
  }
`;

const Steps = styled.div`
  display: flex;
  gap: 8px;
  padding: 12px 44px 12px 12px;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  scrollbar-width: none;

  &::-webkit-scrollbar { display: none; }

  @media (min-width: 1000px) {
    flex-direction: column;
    gap: 4px;
    padding: 0;
    overflow: visible;
  }
`;

const Step = styled.button<{ $phoneOnly?: boolean }>`
  position: relative;
  flex: none;
  scroll-snap-align: start;
  display: grid;
  grid-template-columns: 26px auto;
  gap: 10px;
  align-items: center;
  padding: 10px 14px 10px 10px;
  border-radius: 14px;
  text-align: left;
  overflow: hidden;
  font-family: var(--rj-font);

  .n {
    width: 26px;
    height: 26px;
    display: grid;
    place-items: center;
    border-radius: 50%;
    font: 700 11px/1 var(--rj-mono);
    color: var(--rj-ink-2);
    box-shadow: inset 0 0 0 1.5px var(--rj-line);
  }

  b {
    font-size: 14.5px;
    font-weight: 600;
    letter-spacing: -0.01em;
    white-space: nowrap;
    color: var(--rj-ink);
  }

  &[aria-selected="true"] {
    background: var(--rj-surface);
    box-shadow: 0 0 0 1px var(--rj-line), 0 8px 20px -14px rgba(0, 0, 0, 0.3);
  }

  &[aria-selected="true"] .n {
    color: var(--rj-paper);
    background: var(--rj-ink);
    box-shadow: none;
  }

  &:focus-visible { outline: 2px solid var(--rj-ink); outline-offset: -2px; }

  @media (min-width: 1000px) {
    width: 100%;
    ${({ $phoneOnly }) => $phoneOnly && "display: none;"}
  }
`;

const grow = keyframes`
  from { width: 0%; }
  to { width: 100%; }
`;

/* Remounted per step (key) so the bar restarts; runs for exactly one dwell. */
const Progress = styled.i`
  position: absolute;
  left: 0;
  bottom: 0;
  height: 2px;
  background: var(--rj-hl);
  animation: ${grow} ${DWELL}ms linear forwards;
`;

/* One tablist for the desktop entry and the step strip. */
const TabList = styled.div`
  display: grid;
  min-width: 0;

  @media (min-width: 1000px) {
    gap: 10px;
  }
`;

const Entry = styled.button`
  display: none;

  @media (min-width: 1000px) {
    display: grid;
    grid-template-columns: 26px 1fr;
    gap: 2px 10px;
    align-items: center;
    width: 100%;
    padding: 10px 12px 10px 10px;
    border-radius: 14px;
    border: 1.5px dashed color-mix(in srgb, var(--rj-ink) 18%, transparent);
    text-align: left;
    font-family: var(--rj-font);

    .n { grid-row: span 2; width: 26px; height: 26px; display: grid; place-items: center; font-size: 15px; color: var(--rj-ink-2); }
    small { font-size: 12px; color: var(--rj-ink-3); }
    b { font-size: 14.5px; font-weight: 600; color: var(--rj-ink); }

    &[aria-selected="true"] { border-style: solid; background: var(--rj-surface); }
    &:focus-visible { outline: 2px solid var(--rj-ink); outline-offset: 2px; }
  }
`;

const PauseButton = styled.button`
  position: absolute;
  top: 50%;
  right: 8px;
  z-index: 2;
  transform: translateY(-50%);
  width: 30px;
  height: 30px;
  display: grid;
  place-items: center;
  border-radius: 50%;
  color: var(--rj-ink-2);
  background: var(--rj-surface);
  box-shadow: 0 0 0 1px var(--rj-line);

  svg { width: 12px; height: 12px; }
  .lbl { display: none; }
  &:focus-visible { outline: 2px solid var(--rj-ink); outline-offset: 2px; }

  @media (min-width: 1000px) {
    position: static;
    transform: none;
    justify-self: start;
    width: auto;
    height: 32px;
    margin-top: 6px;
    padding: 0 12px;
    display: inline-flex;
    align-items: center;
    gap: 8px;
    border-radius: 999px;
    font: 500 12.5px/1 var(--rj-font);
    background: transparent;
    box-shadow: none;

    .lbl { display: inline; }
  }
`;

const Stage = styled.div`
  min-width: 0;
  padding: 14px;

  @media (min-width: 640px) { padding: 20px; }
  @media (min-width: 1000px) { padding: 24px; }
`;

const Caption = styled.div`
  display: grid;
  gap: 2px;
  padding: 4px 6px 14px;

  h3 {
    margin: 0;
    font-size: 20px;
    letter-spacing: -0.025em;
    color: var(--rj-ink);
  }

  p {
    margin: 0;
    max-width: 40em;
    font-size: 14.5px;
    line-height: 1.5;
    color: var(--rj-ink-2);
  }
`;

const Link = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  margin: 12px 6px 4px;
  padding-bottom: 2px;
  border-bottom: 1px solid var(--rj-line);
  font-size: 14px;
  font-weight: 500;
  text-decoration: none;
  color: var(--rj-ink);

  &:hover { color: var(--rj-ink); border-bottom-color: var(--rj-ink); }
  svg { width: 14px; height: 14px; }
`;

const PauseIcon = () => (
  <svg viewBox="0 0 12 12" fill="currentColor" aria-hidden="true"><rect x="2" y="1.5" width="2.6" height="9" rx="1" /><rect x="7.4" y="1.5" width="2.6" height="9" rx="1" /></svg>
);
const PlayIcon = () => (
  <svg viewBox="0 0 12 12" fill="currentColor" aria-hidden="true"><path d="M3 1.8v8.4L10.2 6z" /></svg>
);

/* ── component ───────────────────────────────────────────────────────────── */

export function ToolsTour() {
  const reduce = !!useReducedMotion();
  const [current, setCurrent] = useState("check");
  const [playKey, setPlayKey] = useState(0); // 0 = finished frames until the tour starts
  const [paused, setPaused] = useState(false);
  const [inView, setInView] = useState(false);
  const [pageVisible, setPageVisible] = useState(true);
  const [cycle, setCycle] = useState(0); // restarts the progress bar
  const windowRef = useRef<HTMLDivElement>(null);
  const stripRef = useRef<HTMLDivElement>(null);
  const started = useRef(false);

  const running = !reduce && !paused && inView && pageVisible && TOUR.some((t) => t.id === current);

  const show = useCallback((id: string, fromUser = false) => {
    setCurrent(id);
    setPlayKey((k) => k + 1);
    setCycle((c) => c + 1);
    if (fromUser) setPaused(true);
  }, []);

  // Start the tour the first time the window is on screen; wait while it isn't.
  useEffect(() => {
    const el = windowRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting);
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          if (!reduce) show("check");
        }
      },
      { threshold: 0.35 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [reduce, show]);

  useEffect(() => {
    const onVis = () => setPageVisible(!document.hidden);
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, []);

  // Advance to the next step after DWELL while running.
  useEffect(() => {
    if (!running) return;
    const id = setTimeout(() => {
      const i = TOUR.findIndex((t) => t.id === current);
      show(TOUR[(i + 1) % TOUR.length].id);
    }, DWELL);
    return () => clearTimeout(id);
  }, [running, current, cycle, show]);

  // Keep the selected chip in view on the scrolling strip.
  useEffect(() => {
    const strip = stripRef.current;
    const tab = strip?.querySelector<HTMLElement>(`[data-id="${current}"]`);
    if (strip && tab && strip.scrollWidth > strip.clientWidth) {
      strip.scrollTo({ left: tab.offsetLeft - 12, behavior: reduce ? "auto" : "smooth" });
    }
  }, [current, reduce]);

  const onKey = (e: React.KeyboardEvent, id: string) => {
    const order = ALL.map((t) => t.id);
    const d = e.key === "ArrowDown" || e.key === "ArrowRight" ? 1 : e.key === "ArrowUp" || e.key === "ArrowLeft" ? -1 : 0;
    if (!d) return;
    e.preventDefault();
    const next = order[(order.indexOf(id) + d + order.length) % order.length];
    show(next, true);
    const root = windowRef.current;
    const tabs = root ? Array.from(root.querySelectorAll<HTMLElement>(`[data-id="${next}"]`)) : [];
    tabs.find((t) => t.offsetParent !== null)?.focus();
  };

  const tool = ALL.find((t) => t.id === current) ?? TOUR[0];

  const tabProps = (t: Tool) => ({
    role: "tab" as const,
    type: "button" as const,
    "data-id": t.id,
    "aria-selected": current === t.id,
    "aria-controls": `tool-panel-${t.id}`,
    tabIndex: current === t.id ? 0 : -1,
    onClick: () => show(t.id, true),
    onKeyDown: (e: React.KeyboardEvent) => onKey(e, t.id),
  });

  return (
    <Section id="tools" aria-labelledby="tools-title">
      <Inner>
        <Head>
          <p className="eyebrow">Six tools</p>
          <h2 id="tools-title">One resume. Every step of the application.</h2>
          <p>Follow Maya from her first scan to her next skill.</p>
        </Head>

        <Window ref={windowRef}>
          <Body>
            <Nav>
              <TabList role="tablist" aria-label="Steps of an application">
              <Entry {...tabProps(BUILDER)} id="tool-tab-builder">
                <span className="n" aria-hidden="true">+</span>
                <small>No resume yet?</small>
                <b>CV Builder</b>
              </Entry>
              <Steps ref={stripRef}>
                {TOUR.map((t, i) => (
                  <Step key={t.id} {...tabProps(t)} id={`tool-tab-${t.id}`}>
                    <span className="n">{i + 1}</span>
                    <b>{t.name}</b>
                    {running && current === t.id && <Progress key={cycle} aria-hidden="true" />}
                  </Step>
                ))}
                <Step $phoneOnly {...tabProps(BUILDER)}>
                  <span className="n" aria-hidden="true">+</span>
                  <b>CV Builder</b>
                </Step>
              </Steps>
              </TabList>
              {!reduce && (
                <PauseButton type="button" onClick={() => setPaused((p) => !p)} aria-label={paused ? "Play the tour" : "Pause the tour"}>
                  {paused ? <PlayIcon /> : <PauseIcon />}
                  <span className="lbl">{paused ? "Play" : "Pause"}</span>
                </PauseButton>
              )}
            </Nav>

            <Stage>
              {ALL.map((t) => (
                <div key={t.id} id={`tool-panel-${t.id}`} role="tabpanel" aria-labelledby={`tool-tab-${t.id}`} hidden={current !== t.id}>
                  <Caption>
                    <h3>{t.title}</h3>
                    <p>{t.line}</p>
                  </Caption>
                  <t.Panel playKey={current === t.id ? playKey : 0} reduce={reduce} active={current === t.id} />
                </div>
              ))}
              <Link href={tool.href}>
                {tool.cta}
                <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M3 8h10M9 4l4 4-4 4" />
                </svg>
              </Link>
            </Stage>
          </Body>
        </Window>
      </Inner>
    </Section>
  );
}

export default ToolsTour;
