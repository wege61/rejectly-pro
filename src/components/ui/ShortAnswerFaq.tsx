"use client";

import { useState } from "react";
import styled from "styled-components";

/*
 * FAQ list with a short answer on each question ("Never", "One run"), so a
 * skimmer gets the answer without opening it. Used on /ats-check and /pricing.
 * Answers stay in the DOM while closed so they're crawlable; the same items
 * feed each page's FAQPage structured data.
 */

export interface ShortAnswer {
  question: string;
  short: string;
  answer: string;
}

const Faqs = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  border-top: 1px solid var(--rj-line);
`;

const Faq = styled.li<{ $open: boolean }>`
  border-bottom: 1px solid var(--rj-line);

  h3 { margin: 0; color: var(--rj-ink); }

  button {
    width: 100%;
    display: grid;
    grid-template-columns: minmax(0, 1fr) 22px;
    grid-template-areas: "t i" "v .";
    gap: 8px 14px;
    align-items: center;
    padding: 16px 2px;
    border: 0;
    background: none;
    font-family: var(--rj-font);
    color: var(--rj-ink);
    text-align: left;
    cursor: pointer;

    @media (min-width: 640px) { grid-template-columns: minmax(0, 1fr) auto 22px; grid-template-areas: "t v i"; }
    &:focus-visible { outline: 2px solid var(--rj-ink); outline-offset: 2px; border-radius: 6px; }
  }

  .t { grid-area: t; font-size: 16.5px; font-weight: 600; letter-spacing: -0.015em; }

  .v {
    grid-area: v;
    justify-self: start;
    padding: 6px 8px;
    border-radius: 6px;
    font: 700 11px/1 var(--rj-mono);
    letter-spacing: 0.08em;
    text-transform: uppercase;
    white-space: nowrap;
    color: ${({ $open }) => ($open ? "#0d0e10" : "var(--rj-ink)")};
    background: ${({ $open }) => ($open ? "var(--rj-hl)" : "none")};
    box-shadow: inset 0 0 0 1.5px ${({ $open }) => ($open ? "var(--rj-hl)" : "var(--rj-line)")};

    @media (min-width: 640px) { justify-self: end; }
  }

  .i {
    grid-area: i;
    position: relative;
    width: 22px;
    height: 22px;
    border-radius: 50%;
    box-shadow: inset 0 0 0 1.5px var(--rj-line);

    &::before, &::after { content: ""; position: absolute; left: 6px; right: 6px; top: 10px; height: 1.5px; background: var(--rj-ink); }
    &::after { transform: rotate(${({ $open }) => ($open ? 0 : 90)}deg); transition: transform 0.25s; }
  }

  .a { display: grid; grid-template-rows: ${({ $open }) => ($open ? "1fr" : "0fr")}; transition: grid-template-rows 0.3s; @media (prefers-reduced-motion: reduce) { transition: none; } }
  .a > div { overflow: hidden; }
  p { margin: 0; max-width: 44em; padding: 0 30px 18px 2px; font-size: 15px; line-height: 1.6; color: var(--rj-ink-2); }
`;

export function ShortAnswerFaq({ items, idPrefix }: { items: ShortAnswer[]; idPrefix: string }) {
  const [open, setOpen] = useState<Set<number>>(() => new Set([0]));
  const toggle = (i: number) =>
    setOpen((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });

  return (
    <Faqs>
      {items.map((f, i) => {
        const isOpen = open.has(i);
        return (
          <Faq key={f.question} $open={isOpen}>
            <h3>
              <button type="button" aria-expanded={isOpen} aria-controls={`${idPrefix}-${i}`} onClick={() => toggle(i)}>
                <span className="t">{f.question}</span>
                <span className="v">{f.short}</span>
                <span className="i" aria-hidden="true" />
              </button>
            </h3>
            <div className="a" id={`${idPrefix}-${i}`}>
              <div>
                <p>{f.answer}</p>
              </div>
            </div>
          </Faq>
        );
      })}
    </Faqs>
  );
}

export default ShortAnswerFaq;
