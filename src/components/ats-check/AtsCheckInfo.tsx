"use client";

import styled from "styled-components";
import { CATEGORIES, TOTAL_CHECKS, TOTAL_POINTS } from "@/components/marketing/proof/data";
import { ShortAnswerFaq } from "@/components/ui/ShortAnswerFaq";
import { ATS_FAQS } from "./faq";

/*
 * Below the checker: how it works, the checks behind the score (with points, from
 * the same list the homepage uses), and the FAQ that also feeds the page's FAQPage
 * structured data.
 */

// Short labels for the compact grid, in the order of proof/data CATEGORIES.
const SHORT: string[][] = [
  ["Single-column layout", "No table-like rows", "Readable contact details", "Standard bullets", "Clean characters", "Simple dividers"],
  ["Experience section", "Education section", "Skills section", "Email", "Phone", "LinkedIn", "Summary"],
  ["Numbers in achievements", "One date format", "Readable skills"],
  ["Reasonable length", "Clear section breaks", "Bullets, not paragraphs"],
];

const STEPS = [
  { title: "Upload", text: "We pull the text out of your PDF or DOCX the way an applicant tracking system does." },
  { title: "Read", text: `The same ${TOTAL_CHECKS} checks run on every resume: layout, sections, contact details, numbers, length.` },
  { title: "Fix", text: "Your score, what each check found, and the change that's worth the most points." },
];

const Section = styled.section`
  background: var(--rj-paper);
  border-top: 1px solid var(--rj-line);
  color: var(--rj-ink);
  font-family: var(--rj-font);
  -webkit-font-smoothing: antialiased;
`;

const In = styled.div<{ $faq?: boolean }>`
  max-width: 1240px;
  margin: 0 auto;
  display: grid;
  gap: ${({ $faq }) => ($faq ? "24px" : "28px")};
  padding: 56px max(20px, env(safe-area-inset-right, 0px)) 64px max(20px, env(safe-area-inset-left, 0px));

  @media (min-width: 640px) { padding: 80px 40px 88px; }
  @media (min-width: 1000px) {
    padding: 104px 40px;
    ${({ $faq }) => $faq && "grid-template-columns: 340px minmax(0, 1fr); gap: 64px; align-items: start;"}

    /* Like the homepage FAQ: the heading stays in view while the answers scroll past. */
    .head { position: sticky; top: 100px; }
  }

  .eyebrow { margin: 0; font: 500 11.5px/1.3 var(--rj-mono); letter-spacing: 0.07em; text-transform: uppercase; color: var(--rj-ink-2); }
  h2 { margin: 12px 0 0; color: var(--rj-ink); font-size: clamp(30px, 7.6vw, 48px); font-weight: 700; line-height: 1.05; letter-spacing: -0.04em; text-wrap: balance; }
  .lede { margin: 12px 0 0; max-width: 34em; font-size: 16.5px; line-height: 1.55; color: var(--rj-ink-2); }
`;

const Steps = styled.ol`
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: 12px;
  counter-reset: ac-step;

  @media (min-width: 640px) { grid-template-columns: repeat(3, 1fr); }

  li {
    counter-increment: ac-step;
    display: grid;
    gap: 6px;
    align-content: start;
    padding: 18px;
    border-radius: 20px;
    background: var(--rj-surface);
    box-shadow: 0 0 0 1px var(--rj-line);

    &::before { content: counter(ac-step, decimal-leading-zero); font: 600 11px var(--rj-mono); color: var(--rj-ink-3); }
  }
  b { font-size: 16.5px; letter-spacing: -0.015em; }
  span { font-size: 14.5px; line-height: 1.5; color: var(--rj-ink-2); }
`;

const Grid = styled.div`
  display: grid;
  gap: 12px;

  @media (min-width: 640px) { grid-template-columns: repeat(2, 1fr); }
  @media (min-width: 1000px) { grid-template-columns: repeat(4, 1fr); }

  section { padding: 18px; border-radius: 20px; background: var(--rj-surface); box-shadow: 0 0 0 1px var(--rj-line); }
  h3 { margin: 0 0 10px; color: var(--rj-ink); display: flex; justify-content: space-between; align-items: baseline; font-size: 15.5px; }
  h3 span, li span { font: 600 12px var(--rj-mono); color: var(--rj-ink-3); }
  ul { list-style: none; margin: 0; padding: 0; display: grid; gap: 7px; }
  li { display: grid; grid-template-columns: minmax(0, 1fr) auto; gap: 10px; font-size: 13.5px; line-height: 1.4; color: var(--rj-ink-2); }
  li span { font-size: 11.5px; line-height: 1.6; }
`;

export function AtsCheckInfo() {
  return (
    <>
      <Section aria-labelledby="ac-how">
        <In>
          <div>
            <p className="eyebrow">How it works</p>
            <h2 id="ac-how">Three steps, about ten seconds.</h2>
          </div>
          <Steps>
            {STEPS.map((s) => (
              <li key={s.title}>
                <b>{s.title}</b>
                <span>{s.text}</span>
              </li>
            ))}
          </Steps>
        </In>
      </Section>

      <Section aria-labelledby="ac-what">
        <In>
          <div>
            <p className="eyebrow">What we check</p>
            <h2 id="ac-what">{TOTAL_CHECKS} checks. {TOTAL_POINTS} points.</h2>
            <p className="lede">No black box. These are the checks behind your score and what each one is worth.</p>
          </div>
          <Grid>
            {CATEGORIES.map((cat, ci) => (
              <section key={cat.name}>
                <h3>{cat.name} <span>{cat.points}</span></h3>
                <ul>
                  {cat.checks.map((ch, i) => (
                    <li key={ch.label} title={ch.label}>
                      {SHORT[ci]?.[i] ?? ch.label}
                      <span>{ch.points}</span>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </Grid>
        </In>
      </Section>

      <Section aria-labelledby="ac-faq" id="faq">
        <In $faq>
          <div className="head">
            <p className="eyebrow">ATS resume checker FAQ</p>
            <h2 id="ac-faq">Straight answers.</h2>
          </div>
          <ShortAnswerFaq items={ATS_FAQS} idPrefix="ac-faq" />
        </In>
      </Section>
    </>
  );
}

export default AtsCheckInfo;
