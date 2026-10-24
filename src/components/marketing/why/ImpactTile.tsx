"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import styled, { css, keyframes } from "styled-components";
import { useReducedMotion } from "framer-motion";
import { Replay, Tile, TileCopy, useSeenOnce, useTimeline } from "./shared";

/*
 * "You list duties, not results." Mirrors the real MetricQuestionsModal
 * (title, helper text and placeholder are the product's own copy): Rejectly asks,
 * the candidate answers, and the answer counts up into the bullet.
 */

const ANSWER = "12,000";
const TARGET = 12000;

const blink = keyframes`
  50% { opacity: 0; }
`;

const Appear = styled.div<{ $in: boolean }>`
  opacity: ${({ $in }) => ($in ? 1 : 0)};
  transform: translateY(${({ $in }) => ($in ? 0 : 8)}px);
  transition: opacity 0.45s ease, transform 0.5s cubic-bezier(0.3, 0, 0.2, 1);

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`;

const Modal = styled(Appear)`
  overflow: hidden;
  border-radius: 16px;
  background: #ffffff;
  color: var(--rj-doc-ink);
  box-shadow: 0 0 0 1px rgba(13, 14, 16, 0.08), 0 22px 44px -22px rgba(0, 0, 0, 0.35);
`;

const Head = styled.div`
  padding: 14px 16px 12px;
  border-bottom: 1px solid rgba(13, 14, 16, 0.08);

  b {
    display: block;
    font-size: 15px;
    letter-spacing: -0.01em;
  }

  span {
    display: block;
    margin-top: 3px;
    font-size: 12.5px;
    color: #80848d;
  }
`;

const Body = styled.div`
  display: grid;
  gap: 8px;
  padding: 14px 16px;

  .orig {
    margin: 0;
    font-size: 13px;
    font-style: italic;
    color: #6a6e76;
  }

  .label {
    margin: 0;
    font-size: 14px;
    font-weight: 600;
  }
`;

const Input = styled.div<{ $focus: boolean; $caret: boolean }>`
  height: 38px;
  display: flex;
  align-items: center;
  padding: 0 12px;
  border-radius: 10px;
  font-size: 14px;
  box-shadow: inset 0 0 0 ${({ $focus }) => ($focus ? "2px #0D0E10" : "1.5px rgba(13,14,16,.16)")};
  transition: box-shadow 0.25s;

  .ph {
    color: #a3a6ad;
  }

  ${({ $caret }) =>
    $caret &&
    css`
      .val::after {
        content: "";
        display: inline-block;
        width: 1px;
        height: 1em;
        margin-left: 2px;
        vertical-align: -2px;
        background: currentColor;
        animation: ${blink} 1s steps(1) infinite;
      }
    `}
`;

const Foot = styled.div<{ $pressed: boolean }>`
  display: flex;
  justify-content: flex-end;
  padding: 0 16px 14px;

  span {
    padding: 9px 14px;
    border-radius: 999px;
    font-size: 13px;
    font-weight: 600;
    color: #ffffff;
    background: #0d0e10;
    transform: scale(${({ $pressed }) => ($pressed ? 0.94 : 1)});
    transition: transform 0.15s;
  }
`;

const Result = styled(Appear)`
  display: grid;
  gap: 4px;
  padding: 4px 4px 0;

  .big {
    display: flex;
    flex-wrap: wrap;
    align-items: baseline;
    gap: 10px;
  }

  .big b {
    font-size: clamp(40px, 13cqw, 56px);
    font-weight: 700;
    line-height: 1;
    letter-spacing: -0.045em;
    font-variant-numeric: tabular-nums;
    color: var(--rj-ink);
  }

  .big small {
    font-size: 13px;
    color: var(--rj-ink-3);
  }

  p {
    margin: 6px 0 0;
    font-size: 14.5px;
    color: var(--rj-ink-2);
  }
`;

const Mark = styled.span<{ $lit: boolean }>`
  padding: 0 0.12em;
  margin: 0 -0.06em;
  font-weight: 700;
  color: #0d0e10;
  background: linear-gradient(transparent 14%, #ffe14d 14%, #ffe14d 88%, transparent 88%) no-repeat 0 0;
  background-size: ${({ $lit }) => ($lit ? "100% 100%" : "0% 100%")};
  transition: background-size 0.5s cubic-bezier(0.6, 0, 0.2, 1);
`;

export function ImpactTile() {
  const reduce = useReducedMotion();
  const tl = useTimeline();
  const tileRef = useRef<HTMLElement>(null);

  // The server renders the finished frame.
  const [step, setStep] = useState(5);
  const [typed, setTyped] = useState<string | null>(ANSWER);
  const [typing, setTyping] = useState(false);
  const [pressed, setPressed] = useState(false);
  const [count, setCount] = useState(TARGET);
  const [done, setDone] = useState(true);

  const reset = useCallback(() => {
    tl.clear();
    setStep(0);
    setTyped(null);
    setTyping(false);
    setPressed(false);
    setCount(0);
    setDone(false);
  }, [tl]);

  const play = useCallback(() => {
    reset();
    tl.at(200, () => setStep(1));
    tl.at(1100, () => {
      setStep(2);
      setTyping(true);
      for (let k = 1; k <= ANSWER.length; k++) tl.at(k * 90, () => setTyped(ANSWER.slice(0, k)));
    });
    tl.at(2100, () => {
      setTyping(false);
      setStep(3);
      setPressed(true);
      tl.at(200, () => setPressed(false));
    });
    tl.at(2600, () => {
      setStep(4);
      tl.tween(1200, (p) => setCount(Math.round(TARGET * (1 - Math.pow(1 - p, 3)))));
    });
    tl.at(3900, () => setStep(5));
    tl.at(4600, () => setDone(true));
  }, [reset, tl]);

  const [armed, setArmed] = useState(false);
  useEffect(() => {
    if (reduce) return;
    reset();
    setArmed(true);
  }, [reduce, reset]);
  useSeenOnce(tileRef, play, armed);

  return (
    <Tile ref={tileRef} aria-labelledby="why-impact">
      <Replay visible={done && !reduce} onClick={play} />
      <TileCopy>
        <h3 id="why-impact">You list duties, not results.</h3>
        <p>Rejectly asks you for the number. It never makes one up.</p>
      </TileCopy>

      <Modal $in={step >= 1} aria-label="Example of Rejectly's metric question">
        <Head>
          <b>Boost Your ATS Score</b>
          <span>Fill in what you remember, skip the rest.</span>
        </Head>
        <Body>
          <p className="orig">&ldquo;Responsible for data entry tasks&rdquo;</p>
          <p className="label">How many records did you work with?</p>
          <Input $focus={typing} $caret={typing}>
            {typed === null ? <span className="ph">e.g. 50+, $10K, 20%...</span> : <span className="val">{typed}</span>}
          </Input>
        </Body>
        <Foot $pressed={pressed}>
          <span>Save &amp; Continue</span>
        </Foot>
      </Modal>

      <Result $in={step >= 4}>
        <div className="big">
          <b>{count.toLocaleString("en-US")}</b>
          <small>records, from your answer</small>
        </div>
        <p>
          Cleaned <Mark $lit={step >= 5}>{ANSWER}</Mark> CRM records during data entry
        </p>
      </Result>
    </Tile>
  );
}
