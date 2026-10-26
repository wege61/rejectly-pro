"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import styled from "styled-components";
import { ROUTES } from "@/lib/constants";
import { useGuideShelf } from "@/components/blog/BlogDataContext";
import { GUIDE_STAGES } from "./shelf";

/*
 * Homepage section 8: a shelf of tall guide cards (image, category, title and
 * nothing else on the card). Around the cards: arrow buttons, a closing card
 * with the guide count, and a rail that fills as you move from "before you
 * apply" to "after you apply" and jumps to a stage when clicked.
 */

const Section = styled.section`
  background: var(--rj-paper);
  color: var(--rj-ink);
  font-family: var(--rj-font);
  -webkit-font-smoothing: antialiased;
  border-top: 1px solid var(--rj-line);
  padding: 56px 0 64px;
  overflow: clip;

  @media (min-width: 640px) { padding: 80px 0 88px; }
  @media (min-width: 1000px) { padding: 104px 0; }
`;

const Head = styled.div`
  max-width: 1240px;
  margin: 0 auto;
  padding: 0 max(20px, env(safe-area-inset-right, 0px)) 0 max(20px, env(safe-area-inset-left, 0px));
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  justify-content: space-between;
  gap: 16px 24px;

  @media (min-width: 640px) { padding: 0 40px; }

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
    color: var(--rj-ink);

    @media (min-width: 640px) { font-size: clamp(36px, 6.4vw, 56px); }
    @media (min-width: 1000px) { font-size: clamp(40px, 3.9vw, 56px); }
  }

  .sub {
    margin: 12px 0 0;
    max-width: 30em;
    font-size: 16.5px;
    line-height: 1.55;
    color: var(--rj-ink-2);
  }
`;

const Controls = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const Arrow = styled.button`
  width: 44px;
  height: 44px;
  display: grid;
  place-items: center;
  border: 0;
  border-radius: 50%;
  color: var(--rj-ink);
  background: var(--rj-surface);
  box-shadow: 0 0 0 1px var(--rj-line);
  cursor: pointer;
  transition: opacity 0.2s, transform 0.2s;

  &:disabled { opacity: 0.35; cursor: default; }
  &:not(:disabled):hover { transform: scale(1.06); }
  &:focus-visible { outline: 2px solid var(--rj-ink); outline-offset: 3px; }
  svg { width: 18px; height: 18px; }
`;

const AllLink = styled(Link)`
  margin-left: 8px;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding-bottom: 1px;
  border-bottom: 1px solid var(--rj-ink);
  color: var(--rj-ink);
  font-size: 14.5px;
  font-weight: 600;
  white-space: nowrap;
  text-decoration: none;

  &:hover { color: var(--rj-ink); }
  &:focus-visible { outline: 2px solid var(--rj-ink); outline-offset: 3px; }
  svg { width: 14px; height: 14px; }
`;

/* Cards start at the content column and run off the right edge. */
const Track = styled.div`
  --pad: max(20px, calc((100vw - 1240px) / 2 + 20px));
  margin-top: 32px;
  display: flex;
  gap: 16px;
  padding: 8px var(--pad) 20px;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  scroll-padding-inline: var(--pad);
  overscroll-behavior-x: contain;
  scrollbar-width: none;

  &::-webkit-scrollbar { display: none; }
  &:focus-visible { outline: 2px solid var(--rj-ink); outline-offset: -2px; }

  @media (min-width: 640px) {
    --pad: max(40px, calc((100vw - 1240px) / 2 + 40px));
    gap: 20px;
  }
`;

const Card = styled(Link)`
  position: relative;
  flex: 0 0 auto;
  width: 280px;
  height: 380px;
  border-radius: 24px;
  overflow: hidden;
  scroll-snap-align: start;
  color: #ffffff;
  background: #1a1b1f;
  text-decoration: none;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
  transition: transform 0.4s cubic-bezier(0.25, 1, 0.5, 1), box-shadow 0.4s;

  @media (min-width: 640px) { width: 340px; height: 480px; }

  &:hover {
    color: #ffffff;
    transform: scale(1.02);
    box-shadow: 0 16px 36px -12px rgba(0, 0, 0, 0.35);
  }
  &:focus-visible { outline: 2px solid var(--rj-ink); outline-offset: 3px; }

  img { filter: saturate(0.82) contrast(1.04); }

  /* Strong at the bottom so titles stay readable on busy photos. */
  &::after {
    content: "";
    position: absolute;
    inset: 0;
    background: linear-gradient(180deg, rgba(0, 0, 0, 0.3) 0%, rgba(0, 0, 0, 0) 24%, rgba(0, 0, 0, 0.12) 40%, rgba(0, 0, 0, 0.72) 64%, rgba(0, 0, 0, 0.9) 100%);
  }

  .body {
    position: absolute;
    z-index: 1;
    left: 0;
    right: 0;
    bottom: 0;
    padding: 24px;

    @media (min-width: 640px) { padding: 30px; }
  }

  .cat {
    display: block;
    margin-bottom: 10px;
    font-size: 12px;
    font-weight: 600;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: rgba(255, 255, 255, 0.78);
  }

  h3 {
    margin: 0;
    font-size: 22px;
    font-weight: 600;
    line-height: 1.25;
    letter-spacing: -0.02em;
    text-wrap: balance;

    @media (min-width: 640px) { font-size: 26px; }
  }

  @media (prefers-reduced-motion: reduce) { transition: none; }
`;

const EndCard = styled(Card)`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 26px;
  color: var(--rj-ink);
  background: var(--rj-surface);
  box-shadow: 0 0 0 1px var(--rj-line);

  &:hover { color: var(--rj-ink); }
  &::after { display: none; }

  b { font-size: 96px; font-weight: 700; line-height: 0.9; letter-spacing: -0.06em; }
  p { margin: 8px 0 0; font-size: 17px; line-height: 1.4; color: var(--rj-ink-2); }

  .go {
    width: 52px;
    height: 52px;
    display: grid;
    place-items: center;
    border-radius: 50%;
    color: var(--rj-btn-ink);
    background: var(--rj-btn);

    svg { width: 20px; height: 20px; }
  }
`;

const Rail = styled.div`
  max-width: 1240px;
  margin: 4px auto 0;
  padding: 0 20px;
  display: grid;
  gap: 8px;

  @media (min-width: 640px) { padding: 0 40px; }

  button {
    position: relative;
    padding: 10px 0 0;
    border: 0;
    background: none;
    text-align: left;
    font: 600 10px/1.3 var(--rj-mono);
    letter-spacing: 0.07em;
    text-transform: uppercase;
    color: var(--rj-ink-3);
    cursor: pointer;
    transition: color 0.3s;

    @media (min-width: 640px) { font-size: 11px; }

    &::before,
    &::after {
      content: "";
      position: absolute;
      left: 0;
      top: 0;
      height: 3px;
      border-radius: 2px;
    }
    &::before { right: 0; background: var(--rj-line); }
    &::after { width: var(--p, 0%); background: var(--rj-ink); transition: width 0.25s; }

    &[aria-current="true"] { color: var(--rj-ink); }
    &:focus-visible { outline: 2px solid var(--rj-ink); outline-offset: 3px; }
  }
`;

const ArrowIcon = ({ back }: { back?: boolean }) => (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {back ? <path d="M13 8H3M7 4L3 8l4 4" /> : <path d="M3 8h10M9 4l4 4-4 4" />}
  </svg>
);

export function GuidesShelf() {
  const { guides, total } = useGuideShelf();
  const track = useRef<HTMLDivElement>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);
  const [view, setView] = useState({ first: 0, seen: 1 });

  // Where each stage starts and ends in the card list.
  const stages = GUIDE_STAGES.map((_, s) => {
    const idx = guides.flatMap((g, i) => (g.stage === s ? [i] : []));
    return idx.length ? { from: idx[0], to: idx[idx.length - 1] + 1 } : null;
  });

  const cardStep = useCallback(() => {
    const cards = track.current?.children;
    if (!cards || cards.length < 2) return 1;
    return (cards[1] as HTMLElement).offsetLeft - (cards[0] as HTMLElement).offsetLeft;
  }, []);

  const update = useCallback(() => {
    const el = track.current;
    if (!el) return;
    const step = cardStep();
    setAtStart(el.scrollLeft < 4);
    setAtEnd(el.scrollLeft > el.scrollWidth - el.clientWidth - 4);
    const first = Math.round(el.scrollLeft / step);
    setView({ first, seen: first + Math.max(1, Math.floor(el.clientWidth / step)) });
  }, [cardStep]);

  useEffect(() => {
    const el = track.current;
    if (!el) return;
    update();
    el.addEventListener("scroll", update, { passive: true });
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => {
      el.removeEventListener("scroll", update);
      ro.disconnect();
    };
  }, [update, guides.length]);

  const page = (dir: 1 | -1) => {
    const el = track.current;
    if (!el) return;
    const step = cardStep();
    el.scrollBy({ left: dir * step * Math.max(1, Math.floor(el.clientWidth / step) - 1), behavior: "smooth" });
  };

  const goTo = (index: number) => {
    const el = track.current;
    if (!el) return;
    el.scrollTo({ left: index * cardStep(), behavior: "smooth" });
  };

  if (guides.length === 0) return null;

  return (
    <Section id="guides" aria-labelledby="guides-title">
      <Head>
        <div>
          <p className="eyebrow">Guides</p>
          <h2 id="guides-title">Read before you apply.</h2>
          <p className="sub">Short, honest guides for every stage of the search.</p>
        </div>
        <Controls>
          <Arrow type="button" onClick={() => page(-1)} disabled={atStart} aria-label="Previous guides">
            <ArrowIcon back />
          </Arrow>
          <Arrow type="button" onClick={() => page(1)} disabled={atEnd} aria-label="Next guides">
            <ArrowIcon />
          </Arrow>
          <AllLink href={ROUTES.PUBLIC.BLOG}>All guides <ArrowIcon /></AllLink>
        </Controls>
      </Head>

      <Track ref={track} tabIndex={0} aria-label="Guides, scroll sideways">
        {guides.map((g) => (
          <Card key={g.slug} href={ROUTES.PUBLIC.BLOG_POST(g.slug)}>
            {g.image && (
              <Image src={g.image} alt={g.imageAlt ?? ""} fill sizes="(min-width: 640px) 340px, 280px" style={{ objectFit: "cover" }} />
            )}
            <div className="body">
              {g.category && <span className="cat">{g.category}</span>}
              <h3>{g.title}</h3>
            </div>
          </Card>
        ))}
        <EndCard href={ROUTES.PUBLIC.BLOG}>
          <div>
            <b>{total}</b>
            <p>guides on ATS, resumes, interviews and offers.</p>
          </div>
          <span className="go"><ArrowIcon /></span>
        </EndCard>
      </Track>

      <Rail
        aria-label="Jump to a stage of the search"
        style={{ gridTemplateColumns: stages.flatMap((r) => (r ? [`${r.to - r.from}fr`] : [])).join(" ") }}
      >
        {GUIDE_STAGES.map((label, s) => {
          const range = stages[s];
          if (!range) return null;
          const fill = Math.max(0, Math.min(1, (view.seen - range.from) / (range.to - range.from)));
          const current = view.first < range.to && view.seen > range.from;
          return (
            <button
              key={label}
              type="button"
              onClick={() => goTo(range.from)}
              aria-current={current}
              style={{ "--p": `${fill * 100}%` } as React.CSSProperties}
            >
              {label}
            </button>
          );
        })}
      </Rail>
    </Section>
  );
}

export default GuidesShelf;
