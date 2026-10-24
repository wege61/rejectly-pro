"use client";

import { useEffect, useState } from "react";
import styled, { css, keyframes } from "styled-components";
import type { Rule } from "./data";

/*
 * One rule, told as a tiny story: an "AI draft" types the tempting line, the red pen
 * strikes it, "won't write this" appears, then the honest line arrives.
 * Without `armed` (server render, reduced motion) the card shows its finished frame.
 * Once armed it waits at the start until `startIn` (ms) is set, then plays.
 * The animated text is aria-hidden; screen readers get the full sentences.
 */

const blink = keyframes`50% { opacity: 0; }`;

const Card = styled.article`
  display: grid;
  gap: 12px;
  align-content: start;
  padding: 18px;
  border-radius: 20px;
  background: var(--rj-surface);
  box-shadow: 0 0 0 1px var(--rj-line);

  h4 {
    margin: 0;
    font-size: 16.5px;
    letter-spacing: -0.015em;
    color: var(--rj-ink);

    @media (min-width: 1000px) {
      min-height: 2.4em;
    }
  }
`;

const Strip = styled.div`
  display: grid;
  gap: 10px;
  padding: 14px;
  border-radius: 12px;
  background: var(--rj-doc);
  color: var(--rj-doc-ink);
  box-shadow: 0 0 0 1px rgba(13, 14, 16, 0.08);
  font-size: 14px;
  line-height: 1.45;

  .src {
    font-size: 13px;
    color: #6a6e76;
  }
`;

const AiTag = styled.span<{ $dim: boolean }>`
  margin-right: 6px;
  font: 600 9.5px/1 var(--rj-mono);
  letter-spacing: 0.06em;
  text-transform: uppercase;
  vertical-align: 1px;
  color: #80848d;
  opacity: ${({ $dim }) => ($dim ? 0.5 : 1)};
  transition: opacity 0.3s;
`;

const Tempting = styled.s<{ $struck: boolean; $caret: boolean }>`
  text-decoration: none;
  color: ${({ $struck }) => ($struck ? "#80848D" : "#1B1C20")};
  background: linear-gradient(var(--rj-pen), var(--rj-pen)) no-repeat 0 58%;
  background-size: ${({ $struck }) => ($struck ? "100% 2px" : "0% 2px")};
  -webkit-box-decoration-break: clone;
  box-decoration-break: clone;
  transition: background-size 0.55s cubic-bezier(0.6, 0, 0.2, 1), color 0.3s;

  ${({ $caret }) =>
    $caret &&
    css`
      &::after {
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

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`;

const Nope = styled.span<{ $on: boolean }>`
  display: block;
  margin-top: 4px;
  font: 600 10.5px/1 var(--rj-mono);
  letter-spacing: 0.03em;
  white-space: nowrap;
  color: #c42b22;
  opacity: ${({ $on }) => ($on ? 1 : 0)};
  transition: opacity 0.35s;
`;

const Honest = styled.div<{ $on: boolean }>`
  display: grid;
  grid-template-columns: 18px 1fr;
  gap: 8px;
  opacity: ${({ $on }) => ($on ? 1 : 0)};
  transform: translateY(${({ $on }) => ($on ? 0 : 4)}px);
  transition: opacity 0.35s, transform 0.4s cubic-bezier(0.3, 0, 0.2, 1);

  i {
    width: 18px;
    height: 18px;
    margin-top: 1px;
    display: grid;
    place-items: center;
    border-radius: 5px;
    font-size: 11px;
    font-weight: 800;
    font-style: normal;
    background: #ffe14d;
  }

  .note { color: #80848d; }
`;

const SrOnly = styled.span`
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip: rect(0 0 0 0);
  white-space: nowrap;
`;

export function RuleCard({ rule, armed, startIn }: { rule: Rule; armed: boolean; startIn: number | null }) {
  // 0 = waiting, 1 = typing, 2 = struck, 3 = "won't write", 4 = honest line. 4 is the finished frame.
  const [stage, setStage] = useState(4);
  const [typed, setTyped] = useState(rule.tempting.length);

  useEffect(() => {
    if (!armed) {
      setStage(4);
      setTyped(rule.tempting.length);
      return;
    }
    if (startIn === null) {
      setStage(0);
      setTyped(0);
      return;
    }
    const timers: ReturnType<typeof setTimeout>[] = [];
    const at = (ms: number, fn: () => void) => timers.push(setTimeout(fn, ms));
    const n = rule.tempting.length;
    at(startIn, () => setStage(1));
    for (let k = 1; k <= n; k++) at(startIn + k * 32, () => setTyped(k));
    const done = startIn + n * 32;
    at(done + 250, () => setStage(2));
    at(done + 700, () => setStage(3));
    at(done + 1050, () => setStage(4));
    return () => timers.forEach(clearTimeout);
  }, [armed, startIn, rule.tempting]);

  return (
    <Card>
      <h4>{rule.title}</h4>
      <Strip>
        <div className="src">{rule.source}</div>
        <div style={{ color: "#80848D" }}>
          <SrOnly>An AI might write: {rule.tempting}. Rejectly won&apos;t write this.</SrOnly>
          <span aria-hidden="true">
            {armed && <AiTag $dim={stage >= 2}>AI draft</AiTag>}
            <Tempting $struck={stage >= 2} $caret={stage === 1}>{rule.tempting.slice(0, typed)}</Tempting>
            <Nope $on={stage >= 3}>✕ won&apos;t write this</Nope>
          </span>
        </div>
        <Honest $on={stage >= 4}>
          <i aria-hidden="true">✓</i>
          <span>
            {rule.honest}
            {rule.note && <span className="note"> {rule.note}</span>}
          </span>
        </Honest>
      </Strip>
    </Card>
  );
}
