"use client";

import { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { useReducedMotion } from "framer-motion";

/*
 * The wait, shown as the hero's lens reading the visitor's own text.
 * Stages follow the request honestly: the resume and the job post are "read" while
 * the request is in flight, then "Comparing them" holds until the answer arrives.
 */

const RESUME_MS = 1800;
const JOB_MS = 1600;
const LINES = 11;

const Wrap = styled.div`
  display: grid;
  gap: 14px;
`;

const Status = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 4px 6px 0;

  b {
    font-size: 15px;
    letter-spacing: -0.01em;
    color: var(--rj-ink);
  }

  span {
    font: 500 12px/1 var(--rj-mono);
    font-variant-numeric: tabular-nums;
    color: var(--rj-ink-3);
  }
`;

const Bar = styled.div`
  height: 3px;
  margin: 0 6px;
  border-radius: 3px;
  background: var(--rj-line);
  overflow: hidden;

  i {
    display: block;
    height: 100%;
    background: var(--rj-hl);
    transition: width 0.3s linear;
  }
`;

const Docs = styled.div`
  display: grid;
  gap: 12px;

  @media (min-width: 640px) {
    grid-template-columns: 1fr 1fr;
  }
`;

const Doc = styled.div`
  position: relative;
  height: 180px;
  padding: 16px;
  border-radius: 18px;
  background: var(--rj-doc);
  box-shadow: 0 0 0 1px rgba(13, 14, 16, 0.08);
  overflow: hidden;

  @media (min-width: 640px) {
    height: 240px;
  }

  .k {
    display: block;
    margin-bottom: 10px;
    font: 600 10.5px/1 var(--rj-mono);
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: #80848d;
  }

  pre {
    margin: 0;
    font: 400 12px/1.7 var(--rj-mono);
    white-space: pre-wrap;
    word-break: break-word;
    color: #6a6e76;
  }

  pre .seen {
    color: var(--rj-doc-ink);
  }
`;

const Scan = styled.i`
  position: absolute;
  left: 0;
  right: 0;
  height: 2px;
  background: var(--rj-hl);
  box-shadow: 0 0 14px 3px rgba(255, 225, 77, 0.7);
`;

function ReadDoc({ label, text, progress }: { label: string; text: string; progress: number | null }) {
  const lines = text.split("\n").slice(0, LINES);
  const seen = progress === null ? 0 : Math.floor(progress * lines.length);
  const scanning = progress !== null && progress > 0 && progress < 1;
  return (
    <Doc>
      <span className="k">{label}</span>
      <pre>
        {lines.map((line, i) => (
          <span key={i} className={i < seen ? "seen" : undefined}>
            {line}
            {i < lines.length - 1 ? "\n" : ""}
          </span>
        ))}
      </pre>
      {scanning && <Scan style={{ top: `${8 + (progress as number) * 86}%` }} aria-hidden="true" />}
    </Doc>
  );
}

export function Reading({ resumeText, jobText, answered, onFinished }: {
  resumeText: string;
  jobText: string;
  /** True once the analysis response has arrived. */
  answered: boolean;
  /** Called when the reading animation has finished and the answer is in. */
  onFinished: () => void;
}) {
  const reduce = useReducedMotion();
  const [elapsed, setElapsed] = useState(0);
  const finished = useRef(false);

  useEffect(() => {
    // Smooth frames while the scan line moves, then a slow tick while we wait for the answer.
    const t0 = performance.now();
    let raf = 0;
    let interval: ReturnType<typeof setInterval> | undefined;
    const tick = (t: number) => {
      setElapsed(t - t0);
      if (t - t0 < RESUME_MS + JOB_MS) raf = requestAnimationFrame(tick);
      else interval = setInterval(() => setElapsed(performance.now() - t0), 250);
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      if (interval) clearInterval(interval);
    };
  }, []);

  const readDone = reduce || elapsed >= RESUME_MS + JOB_MS;

  useEffect(() => {
    if (answered && readDone && !finished.current) {
      finished.current = true;
      const id = setTimeout(onFinished, 300);
      return () => clearTimeout(id);
    }
  }, [answered, readDone, onFinished]);

  const resumeP = reduce ? 1 : Math.min(1, elapsed / RESUME_MS);
  const jobP = reduce ? 1 : elapsed < RESUME_MS ? null : Math.min(1, (elapsed - RESUME_MS) / JOB_MS);

  let label = "Reading your resume";
  let pct = Math.round(resumeP * 40);
  if (jobP !== null) {
    label = "Reading the job post";
    pct = 40 + Math.round(jobP * 38);
  }
  if (readDone) {
    label = "Comparing them";
    // Creep toward 95% while we wait, so the bar never claims to be done early.
    const waited = Math.max(0, elapsed - RESUME_MS - JOB_MS);
    pct = answered ? 100 : Math.min(95, 78 + Math.round(17 * (1 - Math.exp(-waited / 6000))));
  }

  return (
    <Wrap aria-live="polite">
      <Status>
        <b>{label}</b>
        <span>{pct}%</span>
      </Status>
      <Bar>
        <i style={{ width: `${pct}%` }} />
      </Bar>
      <Docs>
        <ReadDoc label="Your resume" text={resumeText} progress={resumeP} />
        <ReadDoc label="The job post" text={jobText} progress={jobP} />
      </Docs>
    </Wrap>
  );
}
