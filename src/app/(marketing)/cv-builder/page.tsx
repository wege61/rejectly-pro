"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import styled, { keyframes, css } from "styled-components";
import { useCVStore } from "@/components/cv-builder/store";
import { BasicsForm } from "@/components/cv-builder/BasicsForm";
import { EducationForm } from "@/components/cv-builder/EducationForm";
import { SkillsForm } from "@/components/cv-builder/SkillsForm";
import { ExperienceForm } from "@/components/cv-builder/ExperienceForm";
import { CertificationForm } from "@/components/cv-builder/CertificationForm";
import { ProjectsForm } from "@/components/cv-builder/ProjectsForm";
import { SummaryForm } from "@/components/cv-builder/SummaryForm";
import { ThemeForm } from "@/components/cv-builder/ThemeForm";
import { CVPreview } from "@/components/cv-builder/CVPreview";
import { AtsMeter } from "@/components/cv-builder/AtsMeter";
import { generatePDF } from "@/utils/exportPDF";
import { useAuth } from "@/hooks/useAuth";
import { ROUTES } from "@/lib/constants";
import { Footer } from "@/components/ui/Footer";

/*
 * The resume builder. New visitors see Gordon's example (store.ts) and can
 * start empty in one click; progress saves in the browser. Six steps on the
 * left; on the right the paper preview with a live ATS score above it (the
 * same 19 checks as the free scan, run on the PDF's text). Downloading needs a
 * free account: signup brings the visitor back here and the download starts.
 */

/* Seven steps; certifications live in the education step. */
const STEPS: { store: number; label: string; title: string; text: string }[] = [
  { store: 1, label: "Basics", title: "Start with the basics", text: "Contact details go in the body of your resume, where an ATS can read them." },
  { store: 2, label: "Education", title: "Where did you study?", text: "Degree, school, dates. Add courses or certifications if they fit the job." },
  { store: 3, label: "Experience", title: "Experience", text: "Internships, part-time jobs, TA and research roles, volunteering. Start each line with what you did." },
  { store: 4, label: "Projects", title: "Projects", text: "Class projects, personal projects, hackathons. For a first job they count as much as experience." },
  { store: 5, label: "Skills", title: "What are your skills?", text: "List them one by one, the way job posts word them." },
  { store: 6, label: "Summary", title: "A short summary", text: "Two or three sentences: who you are and what you're looking for." },
  { store: 7, label: "Finish", title: "Finish", text: "Choose what leads your resume and an accent color. It stays one column either way." },
];
const DOWNLOAD_FLAG = "download";
const scanSweep = keyframes`0% { top: 0; opacity: 1; } 90% { opacity: 1; } 100% { top: 100%; opacity: 0; }`;

const Root = styled.div`
  min-height: 100vh;
  overflow-x: clip;
  background: var(--rj-paper);
  color: var(--rj-ink);
  font-family: var(--rj-font);
  -webkit-font-smoothing: antialiased;
  padding-top: calc(60px + env(safe-area-inset-top, 0px));
`;

const In = styled.div`
  max-width: 1240px;
  margin: 0 auto;
  padding: 0 max(20px, env(safe-area-inset-right, 0px)) 0 max(20px, env(safe-area-inset-left, 0px));

  @media (min-width: 640px) { padding: 0 40px; }
`;

const Head = styled.header`
  padding-top: 32px;

  @media (min-width: 640px) { padding-top: 48px; }

  .eyebrow { margin: 0; font: 500 11.5px/1.3 var(--rj-mono); letter-spacing: 0.07em; text-transform: uppercase; color: var(--rj-ink-2); }
  h1 { margin: 10px 0 0; font-size: clamp(32px, 8vw, 52px); font-weight: 700; line-height: 1.04; letter-spacing: -0.04em; color: var(--rj-ink); text-wrap: balance; }
  @media (min-width: 640px) { h1 { font-size: clamp(40px, 5vw, 52px); } }
  h1 mark { padding: 0 0.06em; margin: 0 -0.03em; border-radius: 0.08em; color: var(--rj-hl-ink); background: linear-gradient(transparent 14%, var(--rj-hl) 14%, var(--rj-hl) 90%, transparent 90%); -webkit-box-decoration-break: clone; box-decoration-break: clone; }
  .sub { margin: 10px 0 0; max-width: 34em; font-size: 16px; line-height: 1.5; color: var(--rj-ink-2); }
  .ex { min-height: 40px; margin-top: 16px; display: flex; flex-wrap: wrap; align-items: center; gap: 10px; font-size: 13px; color: var(--rj-ink-3); }
  .ex b { padding: 4px 7px; border-radius: 6px; font: 700 10px/1 var(--rj-mono); letter-spacing: 0.07em; text-transform: uppercase; color: var(--rj-ink-2); box-shadow: inset 0 0 0 1.5px var(--rj-line); }
`;

const Ghost = styled.button`
  height: 40px;
  padding: 0 16px;
  border: 0;
  border-radius: 999px;
  font: 600 14px var(--rj-font);
  color: var(--rj-ink);
  background: color-mix(in srgb, var(--rj-ink) 6%, transparent);
  cursor: pointer;

  &:focus-visible { outline: 2px solid var(--rj-ink); outline-offset: 2px; }
`;

const App = styled.div`
  margin: 24px 0 64px;
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 16px;

  @media (min-width: 1000px) { grid-template-columns: minmax(0, 1fr) minmax(0, 500px); gap: 24px; align-items: start; }
`;

const Form = styled.section`
  min-width: 0;
  padding: 20px;
  border-radius: 24px;
  background: var(--rj-surface);
  box-shadow: 0 0 0 1px var(--rj-line);

  @media (min-width: 640px) { padding: 24px 28px; }

  .k { margin: 0; font: 600 11px/1 var(--rj-mono); letter-spacing: 0.08em; text-transform: uppercase; color: var(--rj-ink-3); }
  > h2 { margin: 8px 0 0; font-size: 26px; letter-spacing: -0.03em; color: var(--rj-ink); }
  > .d { margin: 6px 0 18px; font-size: 15px; line-height: 1.5; color: var(--rj-ink-2); }
`;

const Steps = styled.ol`
  list-style: none;
  margin: 0 0 18px;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 4px;

  button {
    position: relative;
    width: 100%;
    padding: 9px 0 0;
    border: 0;
    background: none;
    text-align: left;
    font: 600 10px/1.2 var(--rj-mono);
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: var(--rj-ink-3);
    cursor: pointer;

    &::before { content: ""; position: absolute; left: 0; right: 0; top: 0; height: 3px; border-radius: 2px; background: var(--rj-line); }
    &[data-done="true"]::before, &[aria-current="step"]::before { background: var(--rj-ink); }
    &[aria-current="step"] { color: var(--rj-ink); }
    &:focus-visible { outline: 2px solid var(--rj-ink); outline-offset: 2px; border-radius: 3px; }

    @media (max-width: 639px) { font-size: 0; padding-top: 6px; }
  }
`;

const Nav = styled.div`
  margin-top: 28px;
  display: flex;
  align-items: center;
  gap: 12px;

  button { height: 46px; padding: 0 22px; border: 0; border-radius: 999px; font: 600 15px var(--rj-font); cursor: pointer; }
  button:focus-visible { outline: 2px solid var(--rj-ink); outline-offset: 2px; }
  .back { color: var(--rj-ink-2); background: none; }
  .skip { color: var(--rj-ink-3); background: none; text-decoration: underline; text-underline-offset: 3px; }
  .go { margin-left: auto; color: var(--rj-btn-ink); background: var(--rj-btn); }
`;

const Layout = styled.div`
  margin-bottom: 22px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;

  @media (max-width: 520px) { grid-template-columns: 1fr; }

  button { padding: 14px 16px; border: 0; border-radius: 16px; display: grid; gap: 4px; text-align: left; font: inherit; color: var(--rj-ink); background: var(--rj-paper); box-shadow: inset 0 0 0 1px var(--rj-line); cursor: pointer; }
  button[aria-checked="true"] { box-shadow: inset 0 0 0 2px var(--rj-ink); }
  button:focus-visible { outline: 2px solid var(--rj-ink); outline-offset: 2px; }
  b { font-size: 15px; }
  span { font-size: 13px; line-height: 1.45; color: var(--rj-ink-2); }
`;

const Finish = styled.div`
  margin-top: 18px;
  display: grid;
  gap: 18px;

  .dl { display: grid; gap: 8px; }
  .dl button { height: 52px; border: 0; border-radius: 999px; font: 600 16px var(--rj-font); color: var(--rj-btn-ink); background: var(--rj-btn); cursor: pointer; }
  .dl button:disabled { opacity: 0.6; cursor: progress; }
  .dl button:focus-visible { outline: 2px solid var(--rj-ink); outline-offset: 3px; }
  .dl small { font-size: 12.5px; line-height: 1.45; text-align: center; color: var(--rj-ink-3); }
  .next { display: grid; gap: 10px; }
  .next a { display: grid; grid-template-columns: minmax(0, 1fr) auto; gap: 2px 12px; align-items: center; padding: 14px 16px; border-radius: 16px; color: var(--rj-ink); background: var(--rj-paper); box-shadow: inset 0 0 0 1px var(--rj-line); text-decoration: none; }
  .next a:hover { color: var(--rj-ink); box-shadow: inset 0 0 0 1px var(--rj-ink-3); }
  .next a:focus-visible { outline: 2px solid var(--rj-ink); outline-offset: 2px; }
  .next b { font-size: 15px; }
  .next span { grid-column: 1; font-size: 13px; color: var(--rj-ink-2); }
  .next em { grid-row: 1 / 3; grid-column: 2; padding: 4px 7px; border-radius: 6px; font: 700 10px/1 var(--rj-mono); font-style: normal; letter-spacing: 0.07em; text-transform: uppercase; color: var(--rj-ink-2); box-shadow: inset 0 0 0 1.5px var(--rj-line); }
  .next em.free { color: #0d0e10; background: var(--rj-hl); box-shadow: none; }
`;

const Side = styled.aside`
  display: none;

  @media (min-width: 1000px) { display: grid; gap: 12px; position: sticky; top: 76px; }
`;

/* The paper is drawn at 780px and scaled to fit its column. */
const PaperFrame = styled.div<{ $sweep: boolean }>`
  position: relative;
  overflow: hidden;
  border-radius: 6px;
  box-shadow: 0 0 0 1px var(--rj-line), 0 30px 60px -36px rgba(0, 0, 0, 0.4);

  .scale { width: 780px; transform-origin: 0 0; }
  .scale > div { box-shadow: none; border-radius: 0; }

  &::after {
    content: "";
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    z-index: 2;
    height: 2px;
    pointer-events: none;
    opacity: 0;
    background: #ffe14d;
    box-shadow: 0 0 14px 3px rgba(255, 225, 77, 0.6);
    ${({ $sweep }) => $sweep && css`animation: ${scanSweep} 1.1s cubic-bezier(0.45, 0, 0.55, 1);`}
  }
  @media (prefers-reduced-motion: reduce) { &::after { animation: none; } }
`;

const Fab = styled.button`
  position: fixed;
  left: 50%;
  bottom: calc(18px + env(safe-area-inset-bottom, 0px));
  z-index: 90;
  height: 46px;
  padding: 0 18px 0 8px;
  display: inline-flex;
  align-items: center;
  gap: 10px;
  border: 0;
  border-radius: 999px;
  font: 600 14.5px var(--rj-font);
  white-space: nowrap;
  color: var(--rj-btn-ink);
  background: var(--rj-btn);
  box-shadow: 0 12px 30px -10px rgba(0, 0, 0, 0.45);
  transform: translateX(-50%);
  cursor: pointer;

  @media (min-width: 1000px) { display: none; }
  i { width: 32px; height: 32px; display: grid; place-items: center; border-radius: 50%; font: 700 12.5px var(--rj-font); font-style: normal; color: #0d0e10; background: var(--rj-hl); }
  &:focus-visible { outline: 2px solid var(--rj-ink); outline-offset: 3px; }
  .sr { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap; }
`;

/* iOS sheet: the page steps back (blur, slight zoom-out) while the sheet rises. */
const EASE = "cubic-bezier(0.32, 0.72, 0, 1)";

const Stage = styled.div<{ $back: boolean }>`
  transition: transform 0.5s ${EASE}, border-radius 0.5s ${EASE};
  ${({ $back }) => $back && css`
    transform: scale(0.94);
    border-radius: 22px;
    overflow: clip;
  `}
  @media (min-width: 1000px) { transform: none; border-radius: 0; }
  @media (prefers-reduced-motion: reduce) { transition: none; transform: none; }
`;

const Sheet = styled.div<{ $open: boolean }>`
  position: fixed;
  inset: 0;
  z-index: 1002;

  @media (min-width: 1000px) { display: none; }

  .scrim {
    position: absolute;
    inset: 0;
    background: rgba(13, 14, 16, 0.32);
    -webkit-backdrop-filter: blur(10px) saturate(140%);
    backdrop-filter: blur(10px) saturate(140%);
    opacity: ${({ $open }) => ($open ? 1 : 0)};
    transition: opacity 0.45s ${EASE};
  }
  .panel {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    max-height: calc(100dvh - 76px);
    display: flex;
    flex-direction: column;
    border-radius: 26px 26px 0 0;
    background: var(--rj-paper);
    box-shadow: 0 -20px 50px -20px rgba(0, 0, 0, 0.45);
    transform: translateY(${({ $open }) => ($open ? "0" : "100%")});
    transition: transform 0.5s ${EASE};
    will-change: transform;
  }
  .panel:focus { outline: none; }
  .panel[data-dragging="true"] { transition: none; }
  .top { flex: none; display: grid; gap: 8px; padding: 8px 16px 12px; touch-action: none; cursor: grab; }
  .body {
    flex: 1 1 auto;
    min-height: 0;
    overflow-y: auto;
    overscroll-behavior: contain;
    display: grid;
    gap: 12px;
    padding: 0 16px calc(20px + env(safe-area-inset-bottom, 0px));
    scrollbar-width: none;
  }
  .body::-webkit-scrollbar { display: none; }
  .grab { justify-self: center; width: 36px; height: 5px; border-radius: 3px; background: color-mix(in srgb, var(--rj-ink) 18%, transparent); }
  .bar { display: flex; justify-content: space-between; align-items: center; }
  .bar b { font-size: 16px; color: var(--rj-ink); }
  .bar button { height: 34px; padding: 0 14px; border: 0; border-radius: 999px; font: 600 13.5px var(--rj-font); color: var(--rj-ink); background: color-mix(in srgb, var(--rj-ink) 6%, transparent); cursor: pointer; }
  .bar button:focus-visible { outline: 2px solid var(--rj-ink); outline-offset: 2px; }

  @media (prefers-reduced-motion: reduce) { .scrim, .panel { transition: none; } }
`;

function useFit(width = 780) {
  const frame = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [height, setHeight] = useState<number | undefined>(undefined);
  useEffect(() => {
    const el = frame.current;
    if (!el) return;
    const ro = new ResizeObserver(() => {
      const s = el.clientWidth / width;
      setScale(s);
      const inner = el.firstElementChild as HTMLElement | null;
      if (inner) setHeight(inner.offsetHeight * s);
    });
    ro.observe(el);
    const inner = el.firstElementChild;
    if (inner) ro.observe(inner);
    return () => ro.disconnect();
  }, [width]);
  return { frame, scale, height };
}

function Paper({ sweep }: { sweep: boolean }) {
  const { frame, scale, height } = useFit();
  return (
    <PaperFrame ref={frame} $sweep={sweep} style={{ height }}>
      <div className="scale" style={{ transform: `scale(${scale})` }}>
        <CVPreview />
      </div>
    </PaperFrame>
  );
}

export default function CVBuilderPage() {
  const { cv, currentStep, setStep, startEmpty, setEntryLevel } = useCVStore();
  const { user, loading } = useAuth();
  const [mounted, setMounted] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [sheetMounted, setSheetMounted] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [origin, setOrigin] = useState("50% 0");
  const stage = useRef<HTMLDivElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const drag = useRef<{ y: number; dy: number } | null>(null);
  const [sweep, setSweep] = useState(false);
  const [score, setScore] = useState<number | null>(null);
  const [isExample, setIsExample] = useState(false);
  const autoDownload = useRef(false);

  const idx = Math.max(0, STEPS.findIndex((s) => s.store === currentStep));
  const step = STEPS[idx];

  useEffect(() => {
    setMounted(true);
    // The example is Gordon until the visitor changes his name.
    setIsExample(useCVStore.getState().cv.contact.name === "Gordon Freeman, Ph.D.");
  }, [setStep]);

  useEffect(() => {
    setIsExample(cv.contact.name === "Gordon Freeman, Ph.D.");
  }, [cv.contact.name]);

  const lastScore = useRef<number | null>(null);
  const onScore = useCallback((next: number | null) => {
    setScore(next);
    if (lastScore.current !== null && next !== null && next !== lastScore.current) {
      setSweep(false);
      requestAnimationFrame(() => setSweep(true));
    }
    lastScore.current = next;
  }, []);

  const download = useCallback(async () => {
    if (!user) {
      window.location.href = `${ROUTES.AUTH.SIGNUP}?redirect=${encodeURIComponent(`${ROUTES.PUBLIC.CV_BUILDER}?${DOWNLOAD_FLAG}=1`)}`;
      return;
    }
    setDownloading(true);
    const state = useCVStore.getState().cv;
    const filename = state.contact.name ? `${state.contact.name.replace(/\s+/g, "_")}_CV` : "Resume";
    try {
      await fetch("/api/cv-builder/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cvData: state, filename }),
      });
    } catch (e) {
      console.error("Failed to save CV to dashboard", e);
    }
    await generatePDF("cv-preview-paper", filename, state);
    setDownloading(false);
  }, [user]);

  // Back from signup: finish the download they asked for.
  useEffect(() => {
    if (!mounted || loading || !user || autoDownload.current) return;
    const params = new URLSearchParams(window.location.search);
    if (params.get(DOWNLOAD_FLAG) !== "1") return;
    autoDownload.current = true;
    window.history.replaceState(null, "", window.location.pathname);
    setStep(7);
    download();
  }, [mounted, loading, user, download, setStep]);

  const openSheet = useCallback(() => {
    // Zoom out around the middle of the screen, not the middle of the page.
    const top = stage.current?.getBoundingClientRect().top ?? 0;
    setOrigin(`50% ${window.innerHeight / 2 - top}px`);
    setSheetMounted(true);
    // Mount below the screen first, then rise on the next frame.
    requestAnimationFrame(() => requestAnimationFrame(() => {
      setSheetOpen(true);
      panel.current?.focus({ preventScroll: true });
    }));
  }, []);
  const closeSheet = useCallback(() => setSheetOpen(false), []);

  useEffect(() => {
    if (!sheetMounted) return;
    if (!sheetOpen) {
      const t = window.setTimeout(() => setSheetMounted(false), 500);
      return () => window.clearTimeout(t);
    }
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setSheetOpen(false); };
    window.addEventListener("keydown", onKey);
    return () => { document.body.style.overflow = prev; window.removeEventListener("keydown", onKey); };
  }, [sheetMounted, sheetOpen]);

  // Pull the sheet down by its top bar to close it.
  const onDragStart = (e: React.PointerEvent) => {
    if ((e.target as HTMLElement).closest("button")) return;
    drag.current = { y: e.clientY, dy: 0 };
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    panel.current?.setAttribute("data-dragging", "true");
  };
  const onDragMove = (e: React.PointerEvent) => {
    if (!drag.current || !panel.current) return;
    drag.current.dy = Math.max(0, e.clientY - drag.current.y);
    panel.current.style.transform = `translateY(${drag.current.dy}px)`;
  };
  const onDragEnd = () => {
    if (!drag.current || !panel.current) return;
    const { dy } = drag.current;
    drag.current = null;
    panel.current.removeAttribute("data-dragging");
    panel.current.style.transform = "";
    if (dy > 90) setSheetOpen(false);
  };

  if (!mounted) return <Root />; // the store lives in localStorage

  const go = (i: number) => {
    setStep(STEPS[Math.max(0, Math.min(STEPS.length - 1, i))].store);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const meter = <AtsMeter cv={cv} onScore={onScore} />;

  return (
    <Root>
      <Stage ref={stage} $back={sheetOpen} style={{ transformOrigin: origin }}>
      <In>
        <Head>
          <div>
            <p className="eyebrow">Resume Builder · Free</p>
            <h1>Build a resume an ATS can <mark>read</mark>.</h1>
            <p className="sub">One clean column, standard headings, and a live ATS score as you write. No account until you download.</p>
          </div>
          <div className="ex">
            {isExample ? (
              <>
                <b>Example</b>Gordon&apos;s here to show you around.
                <Ghost type="button" onClick={() => { startEmpty(); setIsExample(false); }}>Start empty</Ghost>
              </>
            ) : (
              <span>Your progress saves in this browser.</span>
            )}
          </div>
        </Head>

        <App>
          <Form aria-labelledby="builder-step">
            <Steps aria-label="Steps">
              {STEPS.map((s, i) => (
                <li key={s.label}>
                  <button type="button" data-done={i < idx} aria-current={i === idx ? "step" : undefined} onClick={() => go(i)}>
                    {s.label}
                  </button>
                </li>
              ))}
            </Steps>
            <p className="k">Step {idx + 1} of {STEPS.length}</p>
            <h2 id="builder-step">{step.title}</h2>
            <p className="d">{step.text}</p>

            {step.store === 1 && <BasicsForm />}
            {step.store === 2 && (<><EducationForm /><CertificationForm /></>)}
            {step.store === 3 && <ExperienceForm />}
            {step.store === 4 && <ProjectsForm />}
            {step.store === 5 && <SkillsForm />}
            {step.store === 6 && <SummaryForm />}
            {step.store === 7 && (
              <>
                <Layout role="radiogroup" aria-label="What leads your resume">
                  <button type="button" role="radio" aria-checked={!!cv.isEntryLevel} onClick={() => setEntryLevel(true)}>
                    <b>Education first</b><span>For students and new grads. Projects get their own section.</span>
                  </button>
                  <button type="button" role="radio" aria-checked={!cv.isEntryLevel} onClick={() => setEntryLevel(false)}>
                    <b>Experience first</b><span>Once your work history is the strongest part.</span>
                  </button>
                </Layout>
                <ThemeForm />
                <Finish>
                  <div className="dl">
                    <button type="button" onClick={download} disabled={downloading}>{downloading ? "Preparing your PDF…" : "Download PDF"}</button>
                    <small>{user ? "Free. It's also saved to your dashboard." : "Free. You'll create a free account so your resume is saved, then the download starts."}</small>
                  </div>
                  <div className="next">
                    <Link href={ROUTES.PUBLIC.ATS_CHECK}><b>Scan it</b><span>See the text an ATS pulls out of your PDF, with the fix for each check.</span><em className="free">Free</em></Link>
                    <Link href={ROUTES.APP.REPORTS}><b>Match it to a job</b><span>Rewrite it in a job post&apos;s words, with a cover letter.</span><em>1 credit</em></Link>
                  </div>
                </Finish>
              </>
            )}

            <Nav>
              {idx > 0 && <button className="back" type="button" onClick={() => go(idx - 1)}>Back</button>}
              {(step.store === 2 || step.store === 4) && <button className="skip" type="button" onClick={() => go(idx + 1)}>Skip this step</button>}
              {idx < STEPS.length - 1 && <button className="go" type="button" onClick={() => go(idx + 1)}>Continue</button>}
            </Nav>
          </Form>

          <Side aria-label="Preview">
            {meter}
            <Paper sweep={sweep} />
          </Side>
        </App>
      </In>

      <Footer />
      </Stage>

      <Fab type="button" onClick={openSheet} aria-haspopup="dialog" aria-expanded={sheetOpen}>
        <i aria-hidden="true">{score ?? "—"}</i>{score !== null && <span className="sr">ATS score {score}, </span>}Preview
      </Fab>
      {sheetMounted && (
        <Sheet $open={sheetOpen} role="dialog" aria-modal="true" aria-label="Preview">
          <div className="scrim" onClick={closeSheet} />
          <div className="panel" ref={panel} tabIndex={-1}>
            <div className="top" onPointerDown={onDragStart} onPointerMove={onDragMove} onPointerUp={onDragEnd} onPointerCancel={onDragEnd}>
              <span className="grab" aria-hidden="true" />
              <div className="bar"><b>Preview</b><button type="button" onClick={closeSheet}>Done</button></div>
            </div>
            <div className="body">
              {meter}
              <Paper sweep={false} />
            </div>
          </div>
        </Sheet>
      )}
    </Root>
  );
}
