"use client";

import { useState } from "react";
import styled from "styled-components";
import { ROUTES } from "@/lib/constants";
import { FAQSchema } from "@/components/seo/StructuredData";
import { FAQS } from "./data";

/*
 * Homepage section 7: straight answers. Each question carries its short answer
 * as a tag, so the list reads as answers before anything is opened; opening one
 * fills the tag with highlighter and shows the why. Deliberately calm after Pricing.
 */

const Section = styled.section`
  background: var(--rj-paper);
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

  @media (min-width: 640px) { gap: 36px; padding: 80px 40px 88px; }

  @media (min-width: 1000px) {
    grid-template-columns: 340px minmax(0, 1fr);
    gap: 64px;
    align-items: start;
    padding: 104px 40px 112px;
  }
`;

const Head = styled.header`
  @media (min-width: 1000px) {
    position: sticky;
    top: 100px;
    margin-top: -26px;
  }

  .eyebrow {
    margin: 0;
    font: 500 11.5px/1.3 var(--rj-mono);
    letter-spacing: 0.07em;
    text-transform: uppercase;
    color: var(--rj-ink-2);
  }

  h2 {
    margin: 12px 0 0;
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
    max-width: 26em;
    font-size: 16.5px;
    line-height: 1.55;
    color: var(--rj-ink-2);
  }

  .mail { margin-top: 20px; }
`;

const TextLink = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding-bottom: 1px;
  border-bottom: 1px solid var(--rj-ink);
  color: var(--rj-ink);
  font-size: 14.5px;
  font-weight: 600;
  text-decoration: none;

  &:hover { color: var(--rj-ink); }
  &:focus-visible { outline: 2px solid var(--rj-ink); outline-offset: 3px; }
  svg { width: 14px; height: 14px; }
`;

const List = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  border-top: 1px solid var(--rj-line);
`;

const Item = styled.li<{ $open: boolean }>`
  border-bottom: 1px solid var(--rj-line);

  h3 { margin: 0; }

  button {
    width: 100%;
    display: grid;
    grid-template-columns: minmax(0, 1fr) 22px;
    grid-template-areas: "t i" "v .";
    gap: 10px 14px;
    align-items: center;
    padding: 18px 2px;
    border: 0;
    background: none;
    text-align: left;
    font-family: var(--rj-font);
    color: var(--rj-ink);
    cursor: pointer;

    &:focus-visible { outline: 2px solid var(--rj-ink); outline-offset: 2px; border-radius: 8px; }

    @media (min-width: 640px) {
      grid-template-columns: minmax(0, 1fr) auto 22px;
      grid-template-areas: "t v i";
      gap: 16px;
      padding: 20px 2px;
    }
  }

  .t {
    grid-area: t;
    font-size: 17px;
    font-weight: 600;
    line-height: 1.35;
    letter-spacing: -0.015em;

    @media (min-width: 1000px) { font-size: 18px; }
  }

  .v {
    grid-area: v;
    justify-self: start;
    padding: 6px 8px;
    border-radius: 6px;
    white-space: nowrap;
    font: 700 11px/1 var(--rj-mono);
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: ${({ $open }) => ($open ? "#0d0e10" : "var(--rj-ink)")};
    box-shadow: inset 0 0 0 1.5px ${({ $open }) => ($open ? "var(--rj-hl)" : "var(--rj-line)")};
    background: linear-gradient(var(--rj-hl), var(--rj-hl)) no-repeat 0 0;
    background-size: ${({ $open }) => ($open ? "100% 100%" : "0% 100%")};
    transition: background-size 0.45s cubic-bezier(0.6, 0, 0.2, 1), box-shadow 0.3s, color 0.3s;

    @media (min-width: 640px) { justify-self: end; }
  }

  .i {
    grid-area: i;
    position: relative;
    width: 22px;
    height: 22px;
    border-radius: 50%;
    box-shadow: inset 0 0 0 1.5px var(--rj-line);

    &::before,
    &::after {
      content: "";
      position: absolute;
      left: 6px;
      right: 6px;
      top: 10px;
      height: 1.5px;
      border-radius: 1px;
      background: var(--rj-ink);
      transition: transform 0.3s cubic-bezier(0.3, 0, 0.2, 1);
    }

    &::after { transform: rotate(${({ $open }) => ($open ? 0 : 90)}deg); }
  }

  .a {
    display: grid;
    grid-template-rows: ${({ $open }) => ($open ? "1fr" : "0fr")};
    transition: grid-template-rows 0.35s cubic-bezier(0.3, 0, 0.2, 1);

    > div { overflow: hidden; }
  }

  .a p {
    margin: 0;
    max-width: 40em;
    padding: 0 36px 20px 2px;
    font-size: 15.5px;
    line-height: 1.6;
    color: var(--rj-ink-2);
  }

  .a ${TextLink} { margin: -6px 0 22px 2px; font-size: 14px; }

  @media (prefers-reduced-motion: reduce) {
    .v, .i::before, .i::after, .a { transition: none; }
  }
`;

const SrOnly = styled.span`
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip: rect(0 0 0 0);
  white-space: nowrap;
`;

const Arrow = () => (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M3 8h10M9 4l4 4-4 4" />
  </svg>
);

export function FAQ() {
  const [open, setOpen] = useState<Set<number>>(() => new Set([0]));

  const toggle = (i: number) =>
    setOpen((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });

  return (
    <Section id="faq" aria-labelledby="faq-title">
      <FAQSchema faqs={FAQS.map(({ question, answer }) => ({ question, answer }))} />
      <Inner>
        <Head>
          <p className="eyebrow">FAQ</p>
          <h2 id="faq-title">Straight answers.</h2>
          <p>The short answer sits next to every question. Open one for the why.</p>
          <p className="mail">
            <TextLink href={ROUTES.PUBLIC.CONTACT}>Still stuck? Write to us <Arrow /></TextLink>
          </p>
        </Head>

        <div>
          <List>
            {FAQS.map((faq, i) => {
              const isOpen = open.has(i);
              return (
                <Item key={faq.question} $open={isOpen}>
                  <h3>
                    <button
                      type="button"
                      id={`faq-q${i}`}
                      aria-expanded={isOpen}
                      aria-controls={`faq-a${i}`}
                      onClick={() => toggle(i)}
                    >
                      <span className="t">{faq.question}</span>
                      <span className="v"><SrOnly>Short answer: </SrOnly>{faq.short}</span>
                      <span className="i" aria-hidden="true" />
                    </button>
                  </h3>
                  <div className="a" id={`faq-a${i}`} role="region" aria-labelledby={`faq-q${i}`}>
                    <div inert={!isOpen}>
                      <p>{faq.answer}</p>
                      {faq.link && (
                        <TextLink href={faq.link.href}>
                          {faq.link.label} <Arrow />
                        </TextLink>
                      )}
                    </div>
                  </div>
                </Item>
              );
            })}
          </List>
          <p style={{ margin: "22px 0 0" }}>
            <TextLink href={ROUTES.PUBLIC.FAQ}>All questions <Arrow /></TextLink>
          </p>
        </div>
      </Inner>
    </Section>
  );
}

export default FAQ;
