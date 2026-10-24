"use client";

import { useCallback, useRef, useState } from "react";
import styled from "styled-components";
import { Reading } from "./Reading";
import { Result } from "./Result";
import { MAYA_JOB, MAYA_RESUME, type MatchResult } from "./types";

/*
 * Homepage section 3: try it. The visitor's own resume against the job they want.
 * Three states in one stage: input (two documents) → reading (the lens scans their
 * text while the request runs) → result (the job card, filled with their data).
 * Uses the free demo endpoints: /api/demo/parse-cv and /api/demo/analyze (5 per hour per IP).
 */

type Stage = "input" | "reading" | "result";
type Resume = { kind: "none" } | { kind: "file"; name: string; text: string } | { kind: "paste"; text: string };

const MIN_TEXT = 50;

const Section = styled.section`
  background: var(--rj-paper);
  color: var(--rj-ink);
  font-family: var(--rj-font);
  -webkit-font-smoothing: antialiased;
  border-top: 1px solid var(--rj-line);
  scroll-margin-top: 60px;
`;

const Inner = styled.div`
  max-width: 1240px;
  margin: 0 auto;
  display: grid;
  gap: 28px;
  padding: 56px max(20px, env(safe-area-inset-right, 0px)) 64px max(20px, env(safe-area-inset-left, 0px));

  @media (min-width: 640px) {
    gap: 36px;
    padding: 88px 40px 96px;
  }

  @media (min-width: 1000px) {
    padding: 104px 40px 112px;
  }
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

const StageBox = styled.div`
  min-width: 0;
  padding: 14px;
  border-radius: 28px;
  background: var(--rj-surface);
  border: 1px solid var(--rj-line);
  box-shadow: 0 1px 0 var(--rj-line), 0 30px 60px -40px rgba(0, 0, 0, 0.3);

  @media (min-width: 640px) {
    padding: 18px;
  }
`;

const Docs = styled.div`
  display: grid;
  gap: 12px;

  @media (min-width: 640px) {
    grid-template-columns: 1fr 1fr;
  }
`;

const Sheet = styled.div`
  min-width: 0;
  min-height: 250px;
  display: grid;
  gap: 12px;
  align-content: start;
  padding: 16px;
  border-radius: 18px;
  background: var(--rj-doc);
  color: var(--rj-doc-ink);
  box-shadow: 0 0 0 1px rgba(13, 14, 16, 0.08);
`;

const SheetHead = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  font: 600 10.5px/1 var(--rj-mono);
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #80848d;

  button {
    padding: 0;
    font: 500 12.5px/1 var(--rj-font);
    letter-spacing: 0;
    text-transform: none;
    color: #4a4d55;
    text-decoration: underline;
    text-underline-offset: 3px;
  }
`;

const Drop = styled.label<{ $over: boolean }>`
  min-height: 180px;
  display: grid;
  place-items: center;
  align-content: center;
  gap: 6px;
  padding: 26px 16px;
  border-radius: 14px;
  border: 1.5px dashed ${({ $over }) => ($over ? "#0D0E10" : "rgba(13,14,16,.2)")};
  background: ${({ $over }) => ($over ? "rgba(13,14,16,.03)" : "transparent")};
  text-align: center;
  cursor: pointer;
  transition: border-color 0.2s, background 0.2s;

  &:hover { border-color: rgba(13, 14, 16, 0.45); }
  &:focus-within { outline: 2px solid #0d0e10; outline-offset: 2px; }

  svg { width: 30px; height: 30px; color: #4a4d55; }
  b { font-size: 15px; }
  span { font-size: 12.5px; color: #80848d; }

  input {
    position: absolute;
    width: 1px;
    height: 1px;
    opacity: 0;
  }
`;

const FileChip = styled.div`
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) auto;
  gap: 12px;
  align-items: center;
  padding: 12px;
  border-radius: 12px;
  background: #ffffff;
  box-shadow: 0 0 0 1px rgba(13, 14, 16, 0.1);

  .ic {
    position: relative;
    width: 34px;
    height: 40px;
    border-radius: 6px;
    background: var(--rj-doc-side);
  }

  .ic::after {
    content: "CV";
    position: absolute;
    left: 5px;
    bottom: 5px;
    font: 700 8px/1 var(--rj-mono);
    color: #ffffff;
  }

  b {
    display: block;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    font-size: 14px;
  }

  span { font-size: 12px; color: #80848d; }

  button {
    padding: 6px;
    font-size: 12.5px;
    color: #4a4d55;
    text-decoration: underline;
    text-underline-offset: 3px;
  }
`;

const Preview = styled.div`
  max-height: 9.9em;
  overflow: hidden;
  white-space: pre-wrap;
  font: 400 11.5px/1.65 var(--rj-mono);
  color: #6a6e76;
  -webkit-mask-image: linear-gradient(#000 60%, transparent);
  mask-image: linear-gradient(#000 60%, transparent);
`;

const TextArea = styled.textarea`
  width: 100%;
  min-height: 180px;
  resize: vertical;
  padding: 12px;
  border: 0;
  border-radius: 12px;
  background: #ffffff;
  box-shadow: inset 0 0 0 1.5px rgba(13, 14, 16, 0.14);
  font: 400 13.5px/1.55 var(--rj-font);
  color: var(--rj-doc-ink);

  &:focus {
    outline: none;
    box-shadow: inset 0 0 0 2px #0d0e10;
  }
`;

const Foot = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 12px 20px;
  padding: 16px 6px 4px;
`;

const Example = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 0;
  font: 500 14.5px/1 var(--rj-font);
  color: var(--rj-ink);

  i {
    width: 22px;
    height: 22px;
    display: grid;
    place-items: center;
    border-radius: 50%;
    font: 700 10px/1 var(--rj-mono);
    font-style: normal;
    color: #0d0e10;
    background: var(--rj-hl);
  }

  u {
    text-underline-offset: 3px;
    text-decoration-color: var(--rj-line);
  }
`;

const Go = styled.button`
  width: 100%;
  height: 50px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 0 24px;
  border-radius: 999px;
  font: 600 15.5px/1 var(--rj-font);
  color: var(--rj-btn-ink);
  background: var(--rj-btn);
  transition: transform 0.15s, opacity 0.2s;

  &:disabled { opacity: 0.35; }
  &:not(:disabled):hover { transform: translateY(-1px); }
  &:focus-visible { outline: 2px solid var(--rj-ink); outline-offset: 3px; }

  svg { width: 16px; height: 16px; }

  @media (min-width: 640px) {
    width: auto;
  }
`;

const Message = styled.p<{ $tone: "error" | "info" }>`
  margin: 12px 6px 0;
  font-size: 14px;
  line-height: 1.45;
  color: ${({ $tone }) => ($tone === "error" ? "var(--rj-pen)" : "var(--rj-ink-2)")};
`;

const Again = styled.button`
  margin: 16px 6px 0;
  padding: 0;
  font: 500 13.5px/1 var(--rj-font);
  color: var(--rj-ink-2);
  text-decoration: underline;
  text-underline-offset: 3px;
`;

const Arrow = () => (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M3 8h10M9 4l4 4-4 4" />
  </svg>
);

function errorText(status: number, fallback?: string) {
  if (status === 429) return "You've used the free checks for this hour. Try again later, or sign up for unlimited checks with Pro.";
  if (status === 400 && fallback) return fallback;
  return "Something went wrong on our side. Please try again in a moment.";
}

export function TryIt() {
  const [stage, setStage] = useState<Stage>("input");
  const [resume, setResume] = useState<Resume>({ kind: "none" });
  const [job, setJob] = useState("");
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<MatchResult | null>(null);
  const [answered, setAnswered] = useState(false);
  const stageRef = useRef<HTMLDivElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const resumeText = resume.kind === "none" ? "" : resume.text;
  const ready = resumeText.trim().length >= MIN_TEXT && job.trim().length >= MIN_TEXT && !uploading;

  const upload = async (file: File) => {
    setError(null);
    setUploading(true);
    try {
      const body = new FormData();
      body.append("file", file);
      const res = await fetch("/api/demo/parse-cv", { method: "POST", body });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "We couldn't read that file. Try a PDF or DOCX, or paste the text.");
      setResume({ kind: "file", name: file.name, text: data.text });
    } catch (e) {
      setResume({ kind: "none" });
      setError(e instanceof Error ? e.message : "We couldn't read that file. Try a PDF or DOCX, or paste the text.");
    } finally {
      setUploading(false);
    }
  };

  const loadExample = () => {
    setError(null);
    setResume({ kind: "file", name: "maya_chen_resume (example)", text: MAYA_RESUME });
    setJob(MAYA_JOB);
  };

  const check = async () => {
    if (!ready) return;
    setError(null);
    setResult(null);
    setAnswered(false);
    setStage("reading");
    stageRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    try {
      const res = await fetch("/api/demo/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cvText: resumeText, jobText: job }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw Object.assign(new Error(errorText(res.status, data.error)), { handled: true });
      setResult({
        fitScore: Number(data.fitScore) || 0,
        potentialScore: Number(data.potentialScore) || 0,
        summary: data.summary || "",
        jobTitle: data.jobTitle || "",
        matchedKeywords: data.matchedKeywords || [],
        missingDetails: data.missingDetails || (data.missingKeywords || []).map((k: string) => ({ keyword: k, foundAs: null })),
        quickWins: data.quickWins || [],
        improvementTips: data.improvementTips || [],
      });
      setAnswered(true);
    } catch (e) {
      setStage("input");
      setError(e instanceof Error && "handled" in e ? e.message : errorText(0));
    }
  };

  const onRead = useCallback(() => setStage("result"), []);

  return (
    <Section id="demo" aria-labelledby="try-title">
      <Inner>
        <Head>
          <p className="eyebrow">Try it</p>
          <h2 id="try-title">Paste a job post. See what&apos;s missing.</h2>
          <p>Your resume against the job you actually want. Free, no signup.</p>
        </Head>

        <StageBox ref={stageRef} style={{ scrollMarginTop: 80 }}>
          {stage === "input" && (
            <>
              <Docs>
                <Sheet>
                  <SheetHead>
                    <span>Your resume</span>
                    {resume.kind !== "paste" && (
                      <button type="button" onClick={() => setResume({ kind: "paste", text: resume.kind === "file" ? resume.text : "" })}>
                        Paste text instead
                      </button>
                    )}
                  </SheetHead>

                  {resume.kind === "none" && (
                    <Drop
                      $over={dragOver}
                      onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                      onDragLeave={() => setDragOver(false)}
                      onDrop={(e) => {
                        e.preventDefault();
                        setDragOver(false);
                        const f = e.dataTransfer.files?.[0];
                        if (f) upload(f);
                      }}
                    >
                      <input
                        ref={fileRef}
                        type="file"
                        accept=".pdf,.docx"
                        onChange={(e) => { const f = e.target.files?.[0]; if (f) upload(f); e.target.value = ""; }}
                      />
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" />
                        <path d="M14 3v5h5" />
                        <path d="M12 17v-6M9 13.5 12 11l3 2.5" />
                      </svg>
                      <b>{uploading ? "Reading your file…" : "Drop your resume"}</b>
                      <span>PDF or DOCX, up to 5 MB</span>
                    </Drop>
                  )}

                  {resume.kind === "file" && (
                    <>
                      <FileChip>
                        <span className="ic" aria-hidden="true" />
                        <div>
                          <b>{resume.name}</b>
                          <span>Ready</span>
                        </div>
                        <button type="button" onClick={() => setResume({ kind: "none" })}>Remove</button>
                      </FileChip>
                      <Preview aria-hidden="true">{resume.text}</Preview>
                    </>
                  )}

                  {resume.kind === "paste" && (
                    <TextArea
                      aria-label="Your resume text"
                      placeholder="Paste your resume text…"
                      value={resume.text}
                      onChange={(e) => setResume({ kind: "paste", text: e.target.value })}
                    />
                  )}
                </Sheet>

                <Sheet>
                  <SheetHead><span>The job post</span></SheetHead>
                  <TextArea
                    aria-label="The job post"
                    placeholder="Paste the job post you want to apply for…"
                    value={job}
                    onChange={(e) => setJob(e.target.value)}
                  />
                </Sheet>
              </Docs>

              {error && <Message $tone="error" role="alert">{error}</Message>}

              <Foot>
                <Example type="button" onClick={loadExample}>
                  <i aria-hidden="true">M</i>
                  <u>Use Maya&apos;s example</u>
                </Example>
                <Go type="button" onClick={check} disabled={!ready}>
                  Check my match <Arrow />
                </Go>
              </Foot>
            </>
          )}

          {stage === "reading" && (
            <Reading resumeText={resumeText} jobText={job} answered={answered} onFinished={onRead} />
          )}

          {stage === "result" && result && (
            <>
              <Result result={result} />
              <Again type="button" onClick={() => setStage("input")}>Check another job post</Again>
            </>
          )}
        </StageBox>
      </Inner>
    </Section>
  );
}

export default TryIt;
