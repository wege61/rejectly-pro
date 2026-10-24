"use client";

import styled, { keyframes } from "styled-components";
import { ROUTES } from "@/lib/constants";
import { ParserLens } from "./ParserLens";

/*
 * Homepage hero. Paper and ink, one signature interaction (Parser Lens).
 * Color jobs: highlighter yellow = brand + match, red pen = rejection only,
 * green = system success only. CTAs are ink.
 */

const draw = keyframes`
  from { transform: rotate(-4deg) scaleX(0); }
`;

const sweep = keyframes`
  from { background-size: 0% 100%; color: var(--rj-ink); }
`;

const Section = styled.section`
  background: var(--rj-paper);
  color: var(--rj-ink);
  font-family: var(--rj-font);
  -webkit-font-smoothing: antialiased;
  /* Clears the fixed 60px navbar. */
  padding-top: calc(60px + env(safe-area-inset-top, 0px));
`;

const Inner = styled.div`
  max-width: 1240px;
  margin: 0 auto;
  display: grid;
  gap: 20px;
  padding: 16px max(20px, env(safe-area-inset-right, 0px)) 40px max(20px, env(safe-area-inset-left, 0px));

  @media (min-width: 640px) {
    gap: 40px;
    padding: 44px 40px 64px;
  }

  @media (min-width: 1000px) {
    grid-template-columns: minmax(0, 1fr) minmax(0, 1.1fr);
    align-items: center;
    gap: 48px 56px;
    padding: 52px 40px 36px;
  }
`;

const Copy = styled.div`
  min-width: 0;
`;

/* The real <h1> carries the search keywords; the big line below is the visual headline. */
const Eyebrow = styled.h1`
  margin: 0;
  font: 500 11.5px/1.3 var(--rj-mono);
  letter-spacing: 0.07em;
  text-transform: uppercase;
  text-wrap: balance;
  color: var(--rj-ink-2);

  mark {
    background: none;
    color: var(--rj-ink);
    border-bottom: 2px solid var(--rj-hl);
    padding-bottom: 1px;
  }
`;

const Headline = styled.p`
  margin: 14px 0 0;
  font-weight: 700;
  font-size: clamp(38px, 10.4vw, 84px);
  line-height: 0.98;
  letter-spacing: -0.045em;
  color: var(--rj-ink);

  > span { display: block; }

  @media (min-width: 640px) {
    font-size: clamp(44px, 8.4vw, 84px);
  }

  @media (min-width: 1000px) {
    font-size: clamp(50px, 4.1vw, 72px);
  }
`;

const Strike = styled.span`
  position: relative;
  white-space: nowrap;

  &::after {
    content: "";
    position: absolute;
    left: -4%;
    right: -4%;
    top: 52%;
    height: 0.085em;
    border-radius: 99px;
    background: var(--rj-pen);
    transform-origin: left center;
    transform: rotate(-4deg);
    animation: ${draw} 0.55s cubic-bezier(0.6, 0, 0.2, 1) 0.45s both;
  }

  @media (prefers-reduced-motion: reduce) {
    &::after { animation: none; }
  }
`;

const Marker = styled.span`
  color: var(--rj-hl-ink);
  padding: 0 0.08em;
  margin: 0 -0.04em;
  border-radius: 0.08em;
  background: linear-gradient(transparent 12%, var(--rj-hl) 12%, var(--rj-hl) 92%, transparent 92%) no-repeat 0 0 / 100% 100%;
  animation: ${sweep} 0.6s cubic-bezier(0.6, 0, 0.2, 1) 1s both;

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`;

const Sub = styled.p`
  margin: 14px 0 0;
  max-width: 34em;
  font-size: 16.5px;
  line-height: 1.55;
  color: var(--rj-ink-2);
  text-wrap: pretty;

  b {
    color: var(--rj-ink);
    font-weight: 600;
  }

  @media (min-width: 640px) {
    margin-top: 18px;
    font-size: 18px;
  }
`;

const Ctas = styled.div`
  margin-top: 20px;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px 22px;

  @media (min-width: 640px) {
    margin-top: 24px;
  }
`;

const PrimaryCta = styled.a`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  width: 100%;
  height: 52px;
  padding: 0 26px;
  border-radius: 9999px;
  background: var(--rj-btn);
  color: var(--rj-btn-ink);
  font-size: 16px;
  font-weight: 600;
  text-decoration: none;
  transition: transform 0.15s ease;

  &:hover {
    color: var(--rj-btn-ink);
    transform: translateY(-1px);
  }

  &:focus-visible {
    outline: 2px solid var(--rj-ink);
    outline-offset: 3px;
  }

  svg { width: 16px; height: 16px; }

  @media (min-width: 640px) {
    width: auto;
  }
`;

/* On phones the Parser Lens itself answers "how it works", so the link steps aside. */
const SecondaryLink = styled.a`
  display: none;
  padding-bottom: 2px;
  border-bottom: 1px solid var(--rj-line);
  color: var(--rj-ink);
  font-size: 15px;
  font-weight: 500;
  text-decoration: none;

  &:hover {
    color: var(--rj-ink);
    border-bottom-color: var(--rj-ink);
  }

  @media (min-width: 640px) {
    display: inline;
  }
`;

const Micro = styled.ul`
  margin: 14px 0 0;
  padding: 0;
  display: flex;
  flex-wrap: wrap;
  gap: 6px 14px;
  font-size: 13px;
  color: var(--rj-ink-3);

  li {
    display: inline-flex;
    align-items: center;
    gap: 6px;
  }

  svg {
    width: 13px;
    height: 13px;
    color: var(--rj-pass);
  }
`;

const Proof = styled.div`
  display: none;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 10px 32px;
  padding-top: 20px;
  border-top: 1px solid var(--rj-line);

  em {
    font: 500 11px var(--rj-mono);
    font-style: normal;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--rj-ink-3);
  }

  span {
    font-size: 15px;
    font-weight: 600;
    letter-spacing: -0.01em;
    color: var(--rj-ink-2);
  }

  @media (min-width: 640px) {
    display: flex;
  }

  @media (min-width: 1000px) {
    grid-column: 1 / -1;
    gap: 10px 44px;
  }
`;

const Check = () => (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M3 8.5l3 3 7-7" />
  </svg>
);

export function Hero() {
  return (
    <Section aria-labelledby="hero-title">
      <Inner>
        <Copy>
          <Eyebrow id="hero-title">
            The <mark>ATS resume checker</mark> for students &amp; new grads
          </Eyebrow>
          <Headline>
            <span>Get past the <Strike>bot</Strike>.</span>
            <span>Get to a <Marker>human</Marker>.</span>
          </Headline>
          <Sub>
            Before a recruiter sees your resume, an applicant tracking system scores it.{" "}
            <b>Rejectly shows you exactly what it sees</b>, then rewrites your projects and internships until they pass.
          </Sub>
          <Ctas>
            <PrimaryCta href={ROUTES.PUBLIC.ATS_CHECK}>
              Scan my resume free
              <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M3 8h10M9 4l4 4-4 4" />
              </svg>
            </PrimaryCta>
            <SecondaryLink href={ROUTES.PUBLIC.HOW_IT_WORKS}>See how it works</SecondaryLink>
          </Ctas>
          <Micro>
            <li><Check />Free ATS scan</li>
            <li><Check />No credit card</li>
          </Micro>
        </Copy>

        <ParserLens />

        <Proof>
          <em>Scored against the systems employers use</em>
          <span>Workday</span>
          <span>Greenhouse</span>
          <span>Lever</span>
          <span>Taleo</span>
        </Proof>
      </Inner>
    </Section>
  );
}

export default Hero;
