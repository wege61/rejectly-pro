"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import styled, { css, keyframes } from "styled-components";
import { useReducedMotion } from "framer-motion";
import { Replay, Tile, TileCopy, TABLET_UP, useSeenOnce, useTimeline } from "./shared";

/*
 * "Your words aren't theirs." The translator: a phrase from Maya's résumé is decoded
 * into the posting's term under the yellow scan line, then flies into the job post,
 * which records where each match came from. Nothing new is invented: every term
 * describes something the original phrase already says.
 */

const ITEMS = [
  { stu: "used Python", corp: "Python" },
  { stu: "guessed which customers would quit", corp: "predictive modeling" },
  { stu: "made charts for class", corp: "data visualization" },
];
const LAST = ITEMS.length - 1;
const STEP = 3400;
const LETTERS = "abcdefghijklmnopqrstuvwxyz";

type Phrase = { kind: "none" | "stu" | "dec" | "corp"; text: string };

const scanX = keyframes`
  0% { left: 0; opacity: 1; }
  92% { opacity: 1; }
  100% { left: 100%; opacity: 0; }
`;

const LangTile = styled(Tile)`
  grid-template-rows: auto 1fr;

  @media ${TABLET_UP} {
    grid-column: 1 / -1;
  }

  @media (min-width: 1000px) {
    grid-column: span 2;
  }
`;

const Stage = styled.div`
  align-self: center;
  display: grid;
  gap: 18px;

  @media ${TABLET_UP} {
    grid-template-columns: minmax(0, 1.15fr) minmax(0, 1fr);
    align-items: center;
    gap: 22px;
  }
`;

const FlyLayer = styled.div`
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 6;

  .flyer {
    position: absolute;
    transform-origin: 0 0;
    white-space: nowrap;
    padding: 0 0.12em;
    border-radius: 4px;
    font-weight: 700;
    letter-spacing: -0.02em;
    color: #0d0e10;
    background: #ffe14d;
    box-shadow: 0 8px 20px -8px rgba(160, 130, 0, 0.7);
  }
`;

const PhraseBox = styled.div`
  position: relative;
  min-height: 140px;
  display: grid;
  align-content: center;
  gap: 8px;
  padding: 22px;
  border-radius: 18px;
  background: var(--rj-doc);
  color: var(--rj-doc-ink);
  box-shadow: 0 0 0 1px rgba(13, 14, 16, 0.08);
  overflow: hidden;

  @media ${TABLET_UP} {
    min-height: 190px;
  }
`;

const Label = styled.span`
  font: 600 10.5px/1 var(--rj-mono);
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #80848d;
`;

const Old = styled.div`
  min-height: 1.4em;
  font-size: 15px;
  color: #80848d;

  s {
    text-decoration-color: var(--rj-pen);
    text-decoration-thickness: 2px;
  }
`;

const Now = styled.div<{ $lit: boolean }>`
  min-height: 2.3em;
  font-size: clamp(26px, 7.4cqw, 38px);
  font-weight: 700;
  line-height: 1.12;
  letter-spacing: -0.035em;
  text-wrap: balance;

  .stu {
    font-weight: 600;
    color: #3a3d44;
    text-decoration: underline wavy var(--rj-pen);
    text-decoration-thickness: 1.5px;
    text-underline-offset: 6px;
  }

  .dec {
    font-family: var(--rj-mono);
    font-size: 0.82em;
    font-weight: 500;
    letter-spacing: 0;
    color: #6a6e76;
  }

  .corp {
    padding: 0 0.1em;
    background: linear-gradient(transparent 12%, #ffe14d 12%, #ffe14d 90%, transparent 90%) no-repeat 0 0;
    background-size: ${({ $lit }) => ($lit ? "100% 100%" : "0% 100%")};
    -webkit-box-decoration-break: clone;
    box-decoration-break: clone;
    transition: background-size 0.45s cubic-bezier(0.6, 0, 0.2, 1);
  }
`;

const Scan = styled.i<{ $go: boolean }>`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  width: 2px;
  background: #ffe14d;
  box-shadow: 0 0 16px 3px rgba(255, 225, 77, 0.75);
  opacity: 0;
  ${({ $go }) =>
    $go &&
    css`
      animation: ${scanX} 0.9s cubic-bezier(0.45, 0, 0.55, 1) both;
    `}
`;

const JobCard = styled.div`
  padding: 18px 18px 14px;
  border-radius: 16px;
  background: #ffffff;
  color: var(--rj-doc-ink);
  box-shadow: 0 0 0 1px rgba(13, 14, 16, 0.08), 0 22px 44px -22px rgba(0, 0, 0, 0.4);

  @media ${TABLET_UP} {
    transform: rotate(1.5deg);
  }

  h4 {
    margin: 6px 0 0;
    font-size: 17px;
    font-weight: 700;
    letter-spacing: -0.02em;
    color: var(--rj-doc-ink);
  }
`;

const Reqs = styled.ul`
  margin: 14px 0 0;
  padding: 0;
  list-style: none;
  display: grid;
  gap: 10px;
`;

const Req = styled.li<{ $on: boolean; $pop: boolean }>`
  display: grid;
  grid-template-columns: 20px minmax(0, 1fr);
  column-gap: 10px;
  align-items: start;

  .box {
    width: 20px;
    height: 20px;
    display: grid;
    place-items: center;
    border-radius: 6px;
    font-size: 12px;
    font-weight: 800;
    color: ${({ $on }) => ($on ? "#0D0E10" : "transparent")};
    background: ${({ $on }) => ($on ? "#FFE14D" : "transparent")};
    box-shadow: ${({ $on }) => ($on ? "none" : "inset 0 0 0 1.5px rgba(13,14,16,.22)")};
    transform: scale(${({ $pop }) => ($pop ? 1.25 : 1)});
    transition: background 0.3s, box-shadow 0.3s, color 0.3s, transform 0.3s cubic-bezier(0.3, 1.6, 0.5, 1);
  }

  .term {
    font-size: 14.5px;
    font-weight: 600;
    line-height: 20px;
  }

  .from {
    grid-column: 2;
    font-size: 12.5px;
    line-height: 1.4;
    color: #80848d;
    opacity: ${({ $on }) => ($on ? 1 : 0)};
    transition: opacity 0.4s 0.15s;
  }

  @media (prefers-reduced-motion: reduce) {
    .box, .from { transition: none; }
  }
`;

const Meter = styled.div<{ $bad: boolean }>`
  margin-top: 14px;
  padding-top: 12px;
  border-top: 1px dashed rgba(13, 14, 16, 0.14);
  display: flex;
  align-items: center;
  justify-content: space-between;

  b {
    font: 600 13px/1 var(--rj-mono);
    font-variant-numeric: tabular-nums;
    color: ${({ $bad }) => ($bad ? "#C42B22" : "#138A52")};
  }
`;

export function LanguageTile() {
  const reduce = useReducedMotion();
  const tl = useTimeline();
  const tileRef = useRef<HTMLElement>(null);
  const flyRef = useRef<HTMLDivElement>(null);
  const nowRef = useRef<HTMLSpanElement>(null);
  const termRefs = useRef<(HTMLSpanElement | null)[]>([]);

  // The server renders the finished frame.
  const [label, setLabel] = useState("In their words");
  const [old, setOld] = useState(ITEMS[LAST].stu);
  const [phrase, setPhrase] = useState<Phrase>({ kind: "corp", text: ITEMS[LAST].corp });
  const [lit, setLit] = useState(true);
  const [matched, setMatched] = useState(ITEMS.length);
  const [pop, setPop] = useState(-1);
  const [scanning, setScanning] = useState(false);
  const [done, setDone] = useState(true);

  const reset = useCallback(() => {
    tl.clear();
    flyRef.current?.replaceChildren();
    setLabel("From your resume");
    setOld("");
    setPhrase({ kind: "none", text: "" });
    setLit(false);
    setMatched(0);
    setPop(-1);
    setScanning(false);
    setDone(false);
  }, [tl]);

  const fly = useCallback((index: number) => {
    const tile = tileRef.current, layer = flyRef.current, src = nowRef.current, dst = termRefs.current[index];
    if (!tile || !layer || !src || !dst) return;
    const tr = tile.getBoundingClientRect();
    const a = src.getBoundingClientRect();
    const b = dst.getBoundingClientRect();
    const flyer = document.createElement("span");
    flyer.className = "flyer";
    flyer.textContent = src.textContent;
    flyer.style.left = `${a.left - tr.left}px`;
    flyer.style.top = `${a.top - tr.top}px`;
    flyer.style.fontSize = getComputedStyle(src).fontSize;
    flyer.style.lineHeight = `${a.height}px`;
    layer.appendChild(flyer);
    const scale = parseFloat(getComputedStyle(dst).fontSize) / parseFloat(getComputedStyle(src).fontSize);
    flyer
      .animate(
        [
          { transform: "translate(0, 0) scale(1)", opacity: 1 },
          { transform: `translate(${b.left - a.left}px, ${b.top - a.top}px) scale(${scale})`, opacity: 0.85 },
        ],
        { duration: 700, easing: "cubic-bezier(.5,0,.15,1)", fill: "forwards" }
      )
      .finished.then(() => flyer.remove(), () => flyer.remove());
  }, []);

  const play = useCallback(() => {
    reset();
    ITEMS.forEach((item, i) => {
      const t = i * STEP;
      tl.at(t, () => {
        setLabel("From your resume");
        setOld("");
        setLit(false);
        setPhrase({ kind: "stu", text: item.stu });
      });
      tl.at(t + 800, () => {
        setScanning(false);
        requestAnimationFrame(() => setScanning(true));
        tl.tween(
          900,
          (p) => {
            const n = Math.round(item.stu.length + (item.corp.length - item.stu.length) * p);
            let out = "";
            for (let k = 0; k < n; k++) {
              out += k / n < p ? item.corp[k] ?? "" : item.corp[k] === " " ? " " : LETTERS[(Math.random() * 26) | 0];
            }
            setPhrase({ kind: "dec", text: out });
          },
          () => {
            setLabel("In their words");
            setOld(item.stu);
            setPhrase({ kind: "corp", text: item.corp });
            requestAnimationFrame(() => requestAnimationFrame(() => setLit(true)));
          }
        );
      });
      tl.at(t + 2350, () => fly(i));
      tl.at(t + 3000, () => {
        setMatched(i + 1);
        setPop(i);
        tl.at(300, () => setPop(-1));
      });
    });
    tl.at(ITEMS.length * STEP, () => setDone(true));
  }, [reset, tl, fly]);

  // Arm once on the client: start from the first frame and wait to be seen.
  const [armed, setArmed] = useState(false);
  useEffect(() => {
    if (reduce) return;
    reset();
    setArmed(true);
  }, [reduce, reset]);
  useSeenOnce(tileRef, play, armed);

  return (
    <LangTile ref={tileRef} aria-labelledby="why-lang">
      <Replay visible={done && !reduce} onClick={play} />
      <TileCopy>
        <h3 id="why-lang">Your words aren&apos;t theirs.</h3>
        <p>Recruiters search the ATS with the job post&apos;s words. Rejectly rewrites what you already did in their language.</p>
      </TileCopy>

      <Stage>
        <PhraseBox>
          <Label>{label}</Label>
          <Old>{old && <s>{old}</s>}</Old>
          <Now $lit={lit}>
            {phrase.kind !== "none" && (
              <span key={phrase.kind} ref={nowRef} className={phrase.kind}>
                {phrase.text}
              </span>
            )}
          </Now>
          <Scan $go={scanning} aria-hidden="true" />
        </PhraseBox>

        <JobCard>
          <Label>Job post</Label>
          <h4>Junior Data Analyst</h4>
          <Reqs>
            {ITEMS.map((item, i) => (
              <Req key={item.corp} $on={i < matched} $pop={pop === i}>
                <span className="box" aria-hidden="true">✓</span>
                <span className="term" ref={(el) => { termRefs.current[i] = el; }}>{item.corp}</span>
                <span className="from">← &ldquo;{item.stu}&rdquo;</span>
              </Req>
            ))}
          </Reqs>
          <Meter $bad={matched === 0}>
            <Label>Matched</Label>
            <b>{matched}/{ITEMS.length}</b>
          </Meter>
        </JobCard>
      </Stage>

      <FlyLayer ref={flyRef} aria-hidden="true" />
    </LangTile>
  );
}
