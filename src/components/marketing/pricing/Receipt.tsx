"use client";

import type { Ref } from "react";
import styled, { css } from "styled-components";

/*
 * "What one credit gets you", told as a till receipt that prints top to bottom
 * the first time it scrolls into view. It stays a paper document in both themes.
 * Without `armed` (server render, reduced motion) it shows fully printed.
 */

const ITEMS = ["Match score + gaps", "Rewritten resume", "Cover letter", "Interview prep", "Career next steps"];

const Wrap = styled.aside`
  display: grid;
  gap: 10px;
  align-content: start;

  @media (min-width: 1000px) {
    position: sticky;
    top: 84px;
  }

  .k {
    font: 600 10.5px/1 var(--rj-mono);
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--rj-ink-3);
  }
`;

const Printer = styled.div`
  position: relative;
  z-index: 1;
  height: 14px;
  border-radius: 8px;
  background: var(--rj-ink);
  box-shadow: 0 6px 14px -8px rgba(0, 0, 0, 0.5);

  [data-theme="dark"] & { background: #3a3c42; }

  &::after {
    content: "";
    position: absolute;
    left: 14px;
    right: 14px;
    top: 6px;
    height: 2px;
    border-radius: 1px;
    background: color-mix(in srgb, var(--rj-paper) 35%, transparent);
  }
`;

const Clip = styled.div`
  margin: -7px 12px 0;
  overflow: hidden;
`;

const zigzag = `linear-gradient(#000, #000) 0 0 / 100% calc(100% - 8px) no-repeat,
  conic-gradient(from -45deg at 50% 0, #000 90deg, transparent 0) 0 100% / 12px 8px repeat-x`;

const Paper = styled.div<{ $armed: boolean; $printed: boolean }>`
  padding: 22px 18px 26px;
  background: #ffffff;
  color: #1b1c20;
  font: 500 12.5px/1.6 var(--rj-mono);
  box-shadow: 0 0 0 1px rgba(13, 14, 16, 0.08);
  -webkit-mask: ${zigzag};
  mask: ${zigzag};

  ${({ $armed, $printed }) =>
    $armed &&
    css`
      clip-path: inset(0 0 ${$printed ? 0 : 100}% 0);
      transition: clip-path 2.2s steps(22, end);
    `}

  header {
    text-align: center;
    padding-bottom: 10px;
    margin-bottom: 10px;
    border-bottom: 1px dashed #c9cbc5;

    b { display: block; font-size: 14px; line-height: 1.3; letter-spacing: 0.14em; }
    span { font-size: 11.5px; color: #80848d; }
  }

  ul { list-style: none; margin: 0; padding: 0; }

  li {
    display: flex;
    align-items: baseline;
    gap: 6px;
    white-space: nowrap;
  }

  .dots {
    flex: 1;
    overflow: hidden;
    color: #c9cbc5;
    &::before { content: "................................................................"; letter-spacing: 1px; }
  }

  .tot {
    display: flex;
    justify-content: space-between;
    margin-top: 10px;
    padding-top: 10px;
    border-top: 1px dashed #c9cbc5;
    font-size: 14px;
    font-weight: 700;

    b { padding: 0 4px; border-radius: 3px; background: #ffe14d; }
  }

  .or { margin: 8px 0 0; font-size: 11.5px; line-height: 1.5; color: #62666f; }

  .bc {
    height: 26px;
    margin-top: 12px;
    opacity: 0.85;
    background: repeating-linear-gradient(90deg, #1b1c20 0 2px, transparent 2px 4px, #1b1c20 4px 5px, transparent 5px 8px, #1b1c20 8px 11px, transparent 11px 12px);
  }

  .thx { margin-top: 6px; text-align: center; font-size: 11px; color: #80848d; }

  @media (prefers-reduced-motion: reduce) {
    clip-path: none;
    transition: none;
  }
`;

const Tick = styled.i<{ $armed: boolean; $printed: boolean; $i: number }>`
  font-style: normal;
  font-weight: 700;
  color: #138a52;

  ${({ $armed, $printed, $i }) =>
    $armed &&
    css`
      opacity: ${$printed ? 1 : 0};
      transform: scale(${$printed ? 1 : 0.4});
      transition: opacity 0.2s, transform 0.3s cubic-bezier(0.3, 1.6, 0.5, 1);
      transition-delay: ${0.5 + $i * 0.3}s;
    `}
`;

export function Receipt({ armed, printed, ref }: { armed: boolean; printed: boolean; ref?: Ref<HTMLElement> }) {
  return (
    <Wrap ref={ref} aria-labelledby="pricing-receipt">
      <span className="k" id="pricing-receipt">What one credit gets you</span>
      <Printer aria-hidden="true" />
      <Clip>
        <Paper $armed={armed} $printed={printed}>
          <header>
            <b>REJECTLY</b>
            <span>Job Match · Data Analyst Intern</span>
          </header>
          <ul>
            {ITEMS.map((item, i) => (
              <li key={item}>
                {item}
                <span className="dots" aria-hidden="true" />
                <Tick $armed={armed} $printed={printed} $i={i} aria-label="included">✓</Tick>
              </li>
            ))}
          </ul>
          <div className="tot"><span>TOTAL</span><b>1 credit</b></div>
          <p className="or">Or spend it on one ATS Optimizer run: your resume rebuilt and scored again.</p>
          <div className="bc" aria-hidden="true" />
          <div className="thx" aria-hidden="true">NO EXPIRY · NO SUBSCRIPTION</div>
        </Paper>
      </Clip>
    </Wrap>
  );
}
