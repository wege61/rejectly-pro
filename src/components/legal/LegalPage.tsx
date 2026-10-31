"use client";

import { useEffect, useState, type ReactNode } from "react";
import styled, { keyframes } from "styled-components";

/*
 * The layout for /terms and /privacy: one reading column, a contents list that
 * follows you (a disclosure on phones), and a one-line "In short" at the top of
 * each section. The summaries help people read; the page says they aren't part
 * of the text that applies. Each heading links to itself (/terms#refunds).
 */

export interface LegalSection {
  id: string;
  title: string;
  short: string;
  body: ReactNode;
}

const flash = keyframes`0%, 30% { background: color-mix(in srgb, var(--rj-hl) 22%, transparent); } 100% { background: transparent; }`;

const Root = styled.div`
  background: var(--rj-paper);
  color: var(--rj-ink);
  font-family: var(--rj-font);
  -webkit-font-smoothing: antialiased;
  padding-top: calc(60px + env(safe-area-inset-top, 0px));

  .eyebrow { margin: 0; font: 500 11.5px/1.3 var(--rj-mono); letter-spacing: 0.07em; text-transform: uppercase; color: var(--rj-ink-2); }
`;

const In = styled.div`
  max-width: 1240px;
  margin: 0 auto;
  padding: 0 max(20px, env(safe-area-inset-right, 0px)) 72px max(20px, env(safe-area-inset-left, 0px));

  @media (min-width: 640px) { padding: 0 40px 96px; }
`;

const Hero = styled.header`
  max-width: 760px;
  padding-top: 48px;

  @media (min-width: 640px) { padding-top: 72px; }

  h1 { margin: 12px 0 0; font-size: clamp(40px, 9vw, 68px); font-weight: 700; line-height: 1.02; letter-spacing: -0.05em; color: var(--rj-ink); }
  .meta { margin: 16px 0 0; display: flex; flex-wrap: wrap; gap: 6px 14px; font: 500 12.5px var(--rj-mono); color: var(--rj-ink-3); }
  .note { margin: 24px 0 0; padding: 14px 16px; border-radius: 14px; display: flex; gap: 12px; align-items: flex-start; background: var(--rj-surface); box-shadow: inset 0 0 0 1px var(--rj-line); font-size: 15px; line-height: 1.5; color: var(--rj-ink-2); }
  .note b { font-weight: 600; color: var(--rj-ink); }
  .note i { flex: none; width: 22px; height: 22px; border-radius: 6px; display: grid; place-items: center; font: 700 12px var(--rj-font); font-style: normal; color: #0d0e10; background: var(--rj-hl); }
`;

const Body = styled.div`
  margin-top: 40px;
  display: grid;
  gap: 24px;

  @media (min-width: 1000px) { grid-template-columns: 240px minmax(0, 720px); gap: 72px; margin-top: 64px; }
`;

const Toc = styled.nav`
  display: none;

  @media (min-width: 1000px) { display: block; position: sticky; top: 84px; align-self: start; max-height: calc(100vh - 100px); overflow: auto; scrollbar-width: none; }

  ol { list-style: none; margin: 12px 0 0; padding: 0; display: grid; gap: 1px; }
  a { display: grid; grid-template-columns: 22px 1fr; gap: 6px; padding: 6px 10px 6px 8px; border-radius: 9px; font-size: 13.5px; line-height: 1.35; color: var(--rj-ink-2); text-decoration: none; }
  a span { font: 500 11px/1.6 var(--rj-mono); color: var(--rj-ink-3); }
  a:hover { color: var(--rj-ink); background: color-mix(in srgb, var(--rj-ink) 4%, transparent); }
  a[aria-current="true"] { font-weight: 600; color: var(--rj-ink); background: color-mix(in srgb, var(--rj-ink) 6%, transparent); }
  a:focus-visible { outline: 2px solid var(--rj-ink); outline-offset: 1px; }
`;

const MobileToc = styled.details`
  margin-bottom: 12px;
  border-radius: 14px;
  background: var(--rj-surface);
  box-shadow: inset 0 0 0 1px var(--rj-line);

  @media (min-width: 1000px) { display: none; }

  summary { list-style: none; display: flex; align-items: center; justify-content: space-between; padding: 14px 16px; font: 600 15px var(--rj-font); color: var(--rj-ink); cursor: pointer; }
  summary::-webkit-details-marker { display: none; }
  summary small { font: 500 12px var(--rj-mono); color: var(--rj-ink-3); }
  summary:focus-visible { outline: 2px solid var(--rj-ink); outline-offset: 2px; border-radius: 14px; }
  ol { list-style: none; margin: 0; padding: 0 8px 10px; display: grid; }
  a { display: grid; grid-template-columns: 26px 1fr; padding: 9px 8px; border-top: 1px solid var(--rj-line); font-size: 15px; color: var(--rj-ink); text-decoration: none; }
  a span { font: 500 12px/1.6 var(--rj-mono); color: var(--rj-ink-3); }
`;

const Section = styled.section`
  position: relative;
  padding: 28px 0;
  border-top: 1px solid var(--rj-line);
  scroll-margin-top: 84px;

  &:first-of-type { border-top: 0; }
  @media (min-width: 1000px) { &:first-of-type { padding-top: 0; } }
  &.hit { animation: ${flash} 1.6s ease; }
  @media (prefers-reduced-motion: reduce) { &.hit { animation: none; } }

  h2 { margin: 0; display: flex; align-items: baseline; gap: 12px; font-size: clamp(22px, 4.6vw, 26px); font-weight: 700; line-height: 1.2; letter-spacing: -0.03em; color: var(--rj-ink); }
  h2 .n { flex: none; font: 500 13px var(--rj-mono); letter-spacing: 0; color: var(--rj-ink-3); }
  h2 .anc { margin-left: auto; flex: none; width: 30px; height: 30px; border-radius: 8px; display: grid; place-items: center; color: var(--rj-ink-3); opacity: 0; transition: opacity 0.15s; }
  &:hover h2 .anc, h2 .anc:focus-visible { opacity: 1; }
  h2 .anc:hover { color: var(--rj-ink); background: color-mix(in srgb, var(--rj-ink) 6%, transparent); }
  h2 .anc:focus-visible { outline: 2px solid var(--rj-ink); outline-offset: 1px; }
  @media (hover: none) { h2 .anc { display: none; } }

  .short { margin: 12px 0 0; padding: 10px 14px; border-radius: 10px; font-size: 15px; line-height: 1.5; color: var(--rj-ink); background: color-mix(in srgb, var(--rj-ink) 4%, transparent); }
  .short::before { content: "In short"; display: block; margin-bottom: 2px; font: 600 10px/1.4 var(--rj-mono); letter-spacing: 0.08em; text-transform: uppercase; color: var(--rj-ink-3); }
  p { margin: 14px 0 0; font-size: 16.5px; line-height: 1.7; color: var(--rj-ink-2); }
  p.caps { font-size: 14.5px; line-height: 1.65; letter-spacing: 0.01em; text-transform: uppercase; }
  ul { list-style: disc; margin: 14px 0 0; padding-left: 20px; display: grid; gap: 8px; font-size: 16.5px; line-height: 1.6; color: var(--rj-ink-2); }
  li::marker { color: var(--rj-ink-3); }
  dl { margin: 14px 0 0; display: grid; gap: 14px; }
  dt { font-size: 15px; font-weight: 600; color: var(--rj-ink); }
  dd { margin: 3px 0 0; font-size: 16.5px; line-height: 1.65; color: var(--rj-ink-2); }
  a:not(.anc) { color: var(--rj-ink); text-decoration: underline; text-decoration-color: var(--rj-line); text-underline-offset: 3px; }
  a:not(.anc):hover { color: var(--rj-ink); text-decoration-color: var(--rj-ink); }
  table { width: 100%; margin: 14px 0 0; border-collapse: collapse; font-size: 15px; line-height: 1.5; }
  th, td { padding: 10px 12px 10px 0; text-align: left; vertical-align: top; border-bottom: 1px solid var(--rj-line); color: var(--rj-ink-2); }
  th { font: 600 11px var(--rj-mono); letter-spacing: 0.06em; text-transform: uppercase; color: var(--rj-ink-3); }
  td:first-child { font-weight: 600; color: var(--rj-ink); white-space: nowrap; }
  @media (max-width: 639px) { table, tbody, tr, td { display: block; } thead { display: none; } tr { padding: 10px 0; border-bottom: 1px solid var(--rj-line); } td { padding: 2px 0; border: 0; } td:first-child { white-space: normal; } }
`;

const LinkIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M10 13a5 5 0 0 0 7.5.5l3-3a5 5 0 0 0-7-7l-1.7 1.7" />
    <path d="M14 11a5 5 0 0 0-7.5-.5l-3 3a5 5 0 0 0 7 7l1.7-1.7" />
  </svg>
);

const pad = (i: number) => String(i + 1).padStart(2, "0");

export function LegalPage({ title, updated, sections }: { title: string; updated: string; sections: LegalSection[] }) {
  const [current, setCurrent] = useState(sections[0]?.id);

  // Highlight the section in the upper third of the screen.
  useEffect(() => {
    const els = sections.map((s) => document.getElementById(s.id)).filter((el): el is HTMLElement => !!el);
    const onScroll = () => {
      const line = window.innerHeight * 0.35;
      let id = els[0]?.id;
      for (const el of els) if (el.getBoundingClientRect().top <= line) id = el.id;
      setCurrent(id);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [sections]);

  // Arriving at /terms#refunds, or following a contents link: flash the section once.
  useEffect(() => {
    const hit = () => {
      const el = document.getElementById(decodeURIComponent(window.location.hash.slice(1)));
      if (!el || el.tagName !== "SECTION") return;
      el.classList.remove("hit");
      void el.offsetWidth;
      el.classList.add("hit");
    };
    hit();
    window.addEventListener("hashchange", hit);
    return () => window.removeEventListener("hashchange", hit);
  }, []);

  const list = sections.map((s, i) => (
    <li key={s.id}><a href={`#${s.id}`} aria-current={current === s.id ? "true" : undefined}><span>{pad(i)}</span>{s.title}</a></li>
  ));

  return (
    <Root>
      <In>
        <Hero>
          <p className="eyebrow">Legal</p>
          <h1>{title}</h1>
          <p className="meta"><span>Last updated {updated}</span><span>Bulbul Labs LLC</span></p>
          <p className="note">
            <i aria-hidden="true">i</i>
            <span>Each section starts with a <b>short summary</b> to help you read. The summaries aren&apos;t part of the {title}; the full text is what applies.</span>
          </p>
        </Hero>
        <Body>
          <Toc aria-label="Contents">
            <p className="eyebrow">Contents</p>
            <ol>{list}</ol>
          </Toc>
          <div>
            <MobileToc onClick={(e) => { if ((e.target as HTMLElement).closest("a")) e.currentTarget.open = false; }}>
              <summary>Contents <small>{sections.length} sections</small></summary>
              <ol>{list}</ol>
            </MobileToc>
            {sections.map((s, i) => (
              <Section key={s.id} id={s.id} aria-labelledby={`${s.id}-title`}>
                <h2 id={`${s.id}-title`}>
                  <span className="n">{pad(i)}</span>
                  <span>{s.title}</span>
                  <a className="anc" href={`#${s.id}`} aria-label={`Link to “${s.title}”`}><LinkIcon /></a>
                </h2>
                <p className="short">{s.short}</p>
                {s.body}
              </Section>
            ))}
          </div>
        </Body>
      </In>
    </Root>
  );
}

export default LegalPage;
