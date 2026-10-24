"use client";

import styled from "styled-components";
import { DESKTOP_UP, TABLET_UP, Tile } from "./shared";
import { LanguageTile } from "./LanguageTile";
import { ImpactTile } from "./ImpactTile";
import { LayoutTile } from "./LayoutTile";

/*
 * Homepage section 2: why the ATS filters new grads.
 * Explains the three failures the hero's Parser Lens shows, each with its own kind
 * of motion, then bridges into the live demo. Order puts the differentiator first:
 * Language (translation), Impact (asking for numbers), Layout (reading order).
 */

const Section = styled.section`
  background: var(--rj-sheet);
  color: var(--rj-ink);
  font-family: var(--rj-font);
  -webkit-font-smoothing: antialiased;
  border-top: 1px solid var(--rj-line);
`;

const Inner = styled.div`
  max-width: 1240px;
  margin: 0 auto;
  display: grid;
  gap: 32px;
  padding: 56px max(20px, env(safe-area-inset-right, 0px)) 64px max(20px, env(safe-area-inset-left, 0px));

  @media ${TABLET_UP} {
    gap: 44px;
    padding: 88px 40px 96px;
  }

  @media ${DESKTOP_UP} {
    padding: 64px 40px 112px;
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
    max-width: 15em;
    font-size: clamp(32px, 8.6vw, 56px);
    font-weight: 700;
    line-height: 1.02;
    letter-spacing: -0.04em;
    text-wrap: balance;
    color: var(--rj-ink);

    @media ${TABLET_UP} {
      font-size: clamp(36px, 6.4vw, 56px);
    }

    @media ${DESKTOP_UP} {
      font-size: clamp(40px, 3.9vw, 56px);
    }
  }

  p {
    margin: 14px 0 0;
    max-width: 36em;
    font-size: 16.5px;
    line-height: 1.55;
    text-wrap: pretty;
    color: var(--rj-ink-2);

    @media ${TABLET_UP} {
      font-size: 18px;
    }
  }
`;

const Bento = styled.div`
  display: grid;
  gap: 14px;

  @media ${TABLET_UP} {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media ${DESKTOP_UP} {
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 16px;
  }
`;

const Bridge = styled(Tile)`
  align-content: center;
  gap: 24px;
  padding: 28px 22px;
  background: var(--rj-bridge);
  color: var(--rj-bridge-ink);

  [data-theme="dark"] & {
    box-shadow: inset 0 0 0 1px rgba(255, 225, 77, 0.16);
  }

  @media ${TABLET_UP} {
    grid-column: 1 / -1;
    grid-template-columns: minmax(0, 1fr) minmax(0, 0.9fr);
    align-items: center;
    gap: 32px;
    padding: 36px;
  }

  @media ${DESKTOP_UP} {
    grid-column: span 2;
    padding: 40px 44px;
  }

  h3 {
    margin: 0;
    font-size: clamp(24px, 6cqw, 32px);
    font-weight: 700;
    line-height: 1.08;
    letter-spacing: -0.035em;
    text-wrap: balance;
    color: var(--rj-bridge-ink);
  }

  p {
    margin: 10px 0 0;
    max-width: 32em;
    font-size: 15.5px;
    line-height: 1.55;
    color: var(--rj-bridge-ink-2);
  }
`;

const TryButton = styled.a`
  margin-top: 20px;
  display: inline-flex;
  align-items: center;
  gap: 10px;
  height: 48px;
  padding: 0 22px;
  border-radius: 999px;
  background: var(--rj-hl);
  color: #0d0e10;
  font-size: 15.5px;
  font-weight: 600;
  text-decoration: none;
  transition: transform 0.15s ease;

  &:hover {
    color: #0d0e10;
    transform: translateY(-1px);
  }

  &:focus-visible {
    outline: 2px solid var(--rj-hl);
    outline-offset: 3px;
  }

  svg {
    width: 16px;
    height: 16px;
  }
`;

const Posts = styled.div`
  display: grid;
  gap: 10px;
  align-content: center;

  > div {
    display: grid;
    gap: 8px;
    padding: 12px 14px;
    border-radius: 12px;
    background: var(--rj-bridge-card);
    border: 1px solid var(--rj-bridge-line);
  }

  > div:nth-child(2) { margin-left: 18px; }
  > div:nth-child(3) { margin-left: 36px; }

  b {
    font-size: 14px;
    font-weight: 600;
    letter-spacing: -0.01em;
  }

  span {
    display: flex;
    flex-wrap: wrap;
    gap: 5px;
  }

  i {
    padding: 5px 7px;
    border-radius: 5px;
    font: 600 11px/1 var(--rj-mono);
    font-style: normal;
    color: #ffe680;
    background: rgba(255, 225, 77, 0.14);
  }
`;

// Illustrative postings: each role asks for different words.
const POSTS = [
  { role: "Data Analyst", words: ["SQL", "Tableau", "A/B testing"] },
  { role: "Marketing Analyst", words: ["GA4", "Excel", "Segmentation"] },
  { role: "Business Ops Associate", words: ["SQL", "Looker", "Forecasting"] },
];

export function WhyItHappens() {
  return (
    <Section id="why" aria-labelledby="why-title">
      <Inner>
        <Head>
          <p className="eyebrow">Why it happens</p>
          <h2 id="why-title">Three reasons the ATS filters new grads.</h2>
          <p>None of them are about your talent. All three can be fixed before you apply, without making anything up.</p>
        </Head>

        <Bento>
          <LanguageTile />
          <ImpactTile />
          <LayoutTile />

          <Bridge as="aside" aria-labelledby="why-bridge">
            <div>
              <h3 id="why-bridge">And every posting asks for different words.</h3>
              <p>One resume can&apos;t match fifty job posts. Paste the one you want and see exactly what yours is missing.</p>
              <TryButton href="#demo">
                Try it with a job post
                <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M3 8h10M9 4l4 4-4 4" />
                </svg>
              </TryButton>
            </div>
            <Posts aria-hidden="true">
              {POSTS.map((p) => (
                <div key={p.role}>
                  <b>{p.role}</b>
                  <span>{p.words.map((w) => <i key={w}>{w}</i>)}</span>
                </div>
              ))}
            </Posts>
          </Bridge>
        </Bento>
      </Inner>
    </Section>
  );
}

export default WhyItHappens;
