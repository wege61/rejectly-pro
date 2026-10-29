"use client";

import { Fragment, useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import styled, { css, keyframes } from "styled-components";
import { useReducedMotion } from "framer-motion";
import { ROUTES } from "@/lib/constants";
import { FAQ_TOPICS, ALL_FAQS } from "./content";

/*
 * /faq. The same short-answer list as the homepage, /ats-check and /pricing,
 * grouped into topics, with a live search (filters questions and answers, marks
 * the match, opens what matches) and a topic list that follows the scroll.
 * Every answer has a link (/faq#refunds); arriving through one opens it and the
 * yellow scan line reads the question once. Answers stay in the DOM while
 * closed so they're crawlable.
 */

const SUPPORT = "support@rejectly.pro";

const Root = styled.div`
  background: var(--rj-paper);
  color: var(--rj-ink);
  font-family: var(--rj-font);
  -webkit-font-smoothing: antialiased;
  padding-top: calc(60px + env(safe-area-inset-top, 0px));
`;

const In = styled.div`
  max-width: 1240px;
  margin: 0 auto;
  padding: 0 max(20px, env(safe-area-inset-right, 0px)) 0 max(20px, env(safe-area-inset-left, 0px));

  @media (min-width: 640px) { padding: 0 40px; }
`;

const Head = styled.header`
  max-width: 760px;
  display: grid;
  gap: 22px;
  padding-top: 40px;

  @media (min-width: 640px) { padding-top: 64px; }
  @media (min-width: 1000px) { padding-top: 88px; }

  .eyebrow { margin: 0; font: 500 11.5px/1.3 var(--rj-mono); letter-spacing: 0.07em; text-transform: uppercase; color: var(--rj-ink-2); }
  h1 { margin: 12px 0 0; font-size: clamp(40px, 10vw, 76px); font-weight: 700; line-height: 1; letter-spacing: -0.045em; color: var(--rj-ink); }
  @media (min-width: 640px) { h1 { font-size: clamp(56px, 7vw, 76px); } }
  h1 mark { padding: 0 0.06em; margin: 0 -0.03em; border-radius: 0.1em; color: var(--rj-hl-ink); background: var(--rj-hl); }
  .sub { margin: 16px 0 0; max-width: 32em; font-size: 18px; line-height: 1.55; color: var(--rj-ink-2); }
`;

const Search = styled.label`
  position: relative;
  display: flex;
  align-items: center;
  height: 56px;
  border-radius: 999px;
  background: var(--rj-surface);
  box-shadow: inset 0 0 0 1px var(--rj-line), 0 12px 30px -24px rgba(0, 0, 0, 0.3);

  &:focus-within { outline: 2px solid var(--rj-ink); outline-offset: 2px; }
  svg { position: absolute; left: 20px; width: 19px; height: 19px; color: var(--rj-ink-3); }
  input { width: 100%; height: 100%; padding: 0 20px 0 52px; border: 0; background: none; font: 500 17px var(--rj-font); color: var(--rj-ink); outline: none; }
  input::placeholder { color: var(--rj-ink-3); }
`;

const Body = styled.div`
  margin-top: 40px;
  display: grid;
  grid-template-columns: minmax(0, 1fr);

  @media (min-width: 1000px) { grid-template-columns: 220px minmax(0, 1fr); gap: 64px; align-items: start; }
`;

const Topics = styled.nav`
  display: flex;
  gap: 8px;
  margin: -2px -2px 8px;
  padding: 2px;
  overflow-x: auto;
  scrollbar-width: none;
  &::-webkit-scrollbar { display: none; }

  a {
    flex: none;
    height: 40px;
    padding: 0 16px;
    display: inline-flex;
    align-items: center;
    gap: 8px;
    border-radius: 999px;
    font: 500 14.5px var(--rj-font);
    white-space: nowrap;
    text-decoration: none;
    color: var(--rj-ink);
    background: var(--rj-surface);
    box-shadow: inset 0 0 0 1px var(--rj-line);

    small { font: 500 11px var(--rj-mono); color: var(--rj-ink-3); }
    &[aria-current="true"] { color: var(--rj-paper); background: var(--rj-ink); box-shadow: none; }
    &[aria-current="true"] small { color: color-mix(in srgb, var(--rj-paper) 65%, transparent); }
    &:focus-visible { outline: 2px solid var(--rj-ink); outline-offset: 2px; }
  }

  @media (min-width: 1000px) {
    position: sticky;
    top: 92px;
    flex-direction: column;
    gap: 2px;
    margin: 32px 0 0;
    overflow: visible;

    a {
      height: auto;
      padding: 10px 14px;
      justify-content: space-between;
      border-radius: 12px;
      color: var(--rj-ink-2);
      background: none;
      box-shadow: none;

      &:hover { color: var(--rj-ink); background: color-mix(in srgb, var(--rj-ink) 5%, transparent); }
      &[aria-current="true"] { color: var(--rj-ink); background: var(--rj-surface); box-shadow: 0 0 0 1px var(--rj-line); }
      &[aria-current="true"] small { color: var(--rj-ink-3); }
    }
  }
`;

const List = styled.div`
  @media (min-width: 1000px) { max-width: 820px; }

  section { padding-top: 32px; scroll-margin-top: 80px; }
  section[hidden] { display: none; }
  h2 { margin: 0 0 12px; font-size: clamp(24px, 5.6vw, 30px); font-weight: 700; letter-spacing: -0.03em; color: var(--rj-ink); }
  ul { list-style: none; margin: 0; padding: 0; border-top: 1px solid var(--rj-line); }
`;

const scan = keyframes`0% { left: 0; opacity: 1; } 90% { opacity: 1; } 100% { left: 100%; opacity: 0; }`;
const glow = keyframes`0%, 40% { background: color-mix(in srgb, var(--rj-hl) 14%, transparent); } 100% { background: transparent; }`;

const Item = styled.li<{ $open: boolean; $hit: boolean }>`
  position: relative;
  border-bottom: 1px solid var(--rj-line);
  scroll-margin-top: 90px;

  &[hidden] { display: none; }
  h3 { margin: 0; color: var(--rj-ink); }

  .q {
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

  .a { display: grid; grid-template-rows: ${({ $open }) => ($open ? "1fr" : "0fr")}; transition: grid-template-rows 0.3s; }
  .a > div { overflow: hidden; }
  p { margin: 0; max-width: 44em; padding: 0 30px 12px 2px; font-size: 15.5px; line-height: 1.6; color: var(--rj-ink-2); }
  mark { padding: 0 1px; border-radius: 3px; color: inherit; background: color-mix(in srgb, var(--rj-hl) 55%, transparent); }

  .lnk {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    margin: 0 0 18px 2px;
    padding: 0;
    border: 0;
    background: none;
    font: 500 13px var(--rj-font);
    color: var(--rj-ink-3);
    cursor: pointer;

    svg { width: 13px; height: 13px; }
    &:hover { color: var(--rj-ink); }
    &:focus-visible { outline: 2px solid var(--rj-ink); outline-offset: 2px; border-radius: 4px; }
  }

  ${({ $hit }) =>
    $hit &&
    css`
      animation: ${glow} 1.6s ease-out;
      &::after { content: ""; position: absolute; top: 0; bottom: 0; left: 0; width: 2px; pointer-events: none; background: #ffe14d; box-shadow: 0 0 16px 3px rgba(255, 225, 77, 0.6); animation: ${scan} 1.1s cubic-bezier(0.45, 0, 0.55, 1) forwards; }
    `}

  @media (prefers-reduced-motion: reduce) {
    animation: none;
    &::after { display: none; }
    .a, .i::after { transition: none; }
  }
`;

const Empty = styled.p`
  margin: 24px 0 0;
  padding: 36px 20px;
  border-radius: 20px;
  text-align: center;
  color: var(--rj-ink-2);
  background: var(--rj-surface);
  box-shadow: 0 0 0 1px var(--rj-line);
`;

const Still = styled.section`
  margin: 64px 0 80px;
  display: grid;
  gap: 14px;
  padding: 28px 24px;
  border-radius: 28px;
  color: var(--rj-bridge-ink);
  background: var(--rj-bridge);

  @media (min-width: 640px) { padding: 36px 40px; }

  .k { margin: 0; font: 600 11px/1 var(--rj-mono); letter-spacing: 0.08em; text-transform: uppercase; color: var(--rj-bridge-ink-2); }
  h2 { margin: 0; font-size: clamp(26px, 6vw, 38px); font-weight: 700; line-height: 1.08; letter-spacing: -0.035em; color: var(--rj-bridge-ink); }
  p { margin: 0; max-width: 32em; font-size: 16px; line-height: 1.55; color: var(--rj-bridge-ink-2); }
  .row { display: flex; flex-wrap: wrap; align-items: center; gap: 12px 18px; }
  .mail {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    height: 50px;
    padding: 0 8px 0 20px;
    border-radius: 999px;
    font: 500 15px var(--rj-mono);
    color: var(--rj-bridge-ink);
    background: rgba(255, 255, 255, 0.08);
    box-shadow: inset 0 0 0 1px var(--rj-bridge-line);
    user-select: all;
  }
  .mail button { height: 36px; padding: 0 14px; border: 0; border-radius: 999px; font: 600 13.5px var(--rj-font); color: #0d0e10; background: #f2f2ef; cursor: pointer; user-select: none; }
  .mail button:focus-visible { outline: 2px solid #f2f2ef; outline-offset: 2px; }
  a { padding-bottom: 1px; border-bottom: 1px solid var(--rj-bridge-ink-2); font-size: 15px; font-weight: 600; color: var(--rj-bridge-ink); text-decoration: none; }
  a:hover { color: var(--rj-bridge-ink); }
`;

const LinkIcon = () => (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true"><path d="M6.5 9.5l3-3M7 4.5l1-1a2.8 2.8 0 0 1 4 4l-1 1M9 11.5l-1 1a2.8 2.8 0 0 1-4-4l1-1" /></svg>
);

/** Wrap matches of `term` in <mark>, as React nodes (no HTML injection). */
function highlight(text: string, term: string) {
  if (!term) return text;
  const lower = text.toLowerCase();
  const out: React.ReactNode[] = [];
  let i = 0;
  for (let at = lower.indexOf(term); at !== -1; at = lower.indexOf(term, i)) {
    out.push(<Fragment key={`t${i}`}>{text.slice(i, at)}</Fragment>, <mark key={`m${at}`}>{text.slice(at, at + term.length)}</mark>);
    i = at + term.length;
  }
  out.push(<Fragment key="end">{text.slice(i)}</Fragment>);
  return out;
}

export function FaqPage() {
  const reduce = useReducedMotion();
  const [open, setOpen] = useState<Set<string>>(() => new Set([ALL_FAQS[0].id]));
  const [query, setQuery] = useState("");
  const [current, setCurrent] = useState(FAQ_TOPICS[0].key);
  const [hit, setHit] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});

  const term = query.trim().toLowerCase();
  const matches = useMemo(() => {
    if (!term) return null;
    return new Set(ALL_FAQS.filter((f) => `${f.question} ${f.answer}`.toLowerCase().includes(term)).map((f) => f.id));
  }, [term]);
  const visible = (id: string) => !matches || matches.has(id);

  const toggle = (id: string) =>
    setOpen((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  // Arriving through an answer's link: open it, bring it into view, let the scan line read it.
  const goToHash = useCallback(() => {
    const id = decodeURIComponent(window.location.hash.slice(1));
    if (!ALL_FAQS.some((f) => f.id === id)) return;
    setOpen((prev) => new Set(prev).add(id));
    requestAnimationFrame(() => {
      const el = document.getElementById(id);
      if (!el) return;
      window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 90, behavior: reduce ? "auto" : "smooth" });
      setHit(null);
      window.setTimeout(() => setHit(id), reduce ? 0 : 450);
      window.setTimeout(() => setHit(null), 2200);
    });
  }, [reduce]);

  useEffect(() => {
    goToHash();
    window.addEventListener("hashchange", goToHash);
    return () => window.removeEventListener("hashchange", goToHash);
  }, [goToHash]);

  // The topic list follows the scroll.
  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      let cur = FAQ_TOPICS[0].key;
      for (const t of FAQ_TOPICS) {
        const el = sectionRefs.current[t.key];
        if (el && !el.hidden && el.getBoundingClientRect().top <= 140) cur = t.key;
      }
      setCurrent(cur);
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => { window.removeEventListener("scroll", onScroll); if (raf) cancelAnimationFrame(raf); };
  }, [matches]);

  const copy = async (text: string, key: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(key);
    } catch {
      setCopied(`${key}-failed`);
    }
    window.setTimeout(() => setCopied(null), 1600);
  };

  const jump = (e: React.MouseEvent<HTMLAnchorElement>, key: string) => {
    e.preventDefault();
    const el = sectionRefs.current[key];
    if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 70, behavior: reduce ? "auto" : "smooth" });
  };

  const total = ALL_FAQS.length;
  const shown = matches ? matches.size : total;

  return (
    <Root>
      <In>
        <Head>
          <div>
            <p className="eyebrow">FAQ</p>
            <h1>Straight <mark>answers</mark>.</h1>
            <p className="sub">Scanning, credits, your data, and what the AI will and won&apos;t do.</p>
          </div>
          <Search>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7" /><path d="M20 20l-3.5-3.5" /></svg>
            <input type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder={`Search ${total} questions`} aria-label="Search questions" aria-describedby="faq-count" />
          </Search>
        </Head>
        <span id="faq-count" role="status" aria-live="polite" style={{ position: "absolute", width: 1, height: 1, overflow: "hidden", clip: "rect(0 0 0 0)" }}>
          {term ? `${shown} ${shown === 1 ? "answer" : "answers"}` : ""}
        </span>

        <Body>
          <Topics aria-label="Topics">
            {FAQ_TOPICS.map((t) => {
              const n = t.items.filter((f) => visible(f.id)).length;
              if (!n) return null;
              return (
                <a key={t.key} href={`#topic-${t.key}`} aria-current={current === t.key ? "true" : "false"} onClick={(e) => jump(e, t.key)}>
                  {t.title} <small>{n}</small>
                </a>
              );
            })}
          </Topics>

          <List>
            {FAQ_TOPICS.map((t) => {
              const items = t.items.filter((f) => visible(f.id));
              return (
                <section key={t.key} id={`topic-${t.key}`} aria-labelledby={`topic-${t.key}-h`} hidden={items.length === 0} ref={(el) => { sectionRefs.current[t.key] = el; }}>
                  <h2 id={`topic-${t.key}-h`}>{t.title}</h2>
                  <ul>
                    {t.items.map((f) => {
                      const isOpen = open.has(f.id) || (!!matches && matches.has(f.id));
                      return (
                        <Item key={f.id} id={f.id} hidden={!visible(f.id)} $open={isOpen} $hit={hit === f.id}>
                          <h3>
                            <button className="q" type="button" aria-expanded={isOpen} aria-controls={`${f.id}-a`} onClick={() => toggle(f.id)}>
                              <span className="t">{f.question}</span>
                              <span className="v">{f.short}</span>
                              <span className="i" aria-hidden="true" />
                            </button>
                          </h3>
                          <div className="a" id={`${f.id}-a`}>
                            <div>
                              <p>{highlight(f.answer, term)}</p>
                              <button className="lnk" type="button" tabIndex={isOpen ? 0 : -1} onClick={() => copy(`https://rejectly.pro${ROUTES.PUBLIC.FAQ}#${f.id}`, f.id)}>
                                <LinkIcon />
                                {copied === f.id ? "Link copied" : copied === `${f.id}-failed` ? "Copy failed. Use the address bar." : "Copy link to this answer"}
                              </button>
                            </div>
                          </div>
                        </Item>
                      );
                    })}
                  </ul>
                </section>
              );
            })}
            {matches && matches.size === 0 && (
              <Empty>Nothing matches that. Try &quot;refund&quot;, &quot;delete&quot; or &quot;Turkish&quot;, or write to us below.</Empty>
            )}
          </List>
        </Body>

        <Still aria-labelledby="faq-still">
          <p className="k">Still stuck?</p>
          <h2 id="faq-still">Write to a person.</h2>
          <p>Tell us what you tried and what happened. Include the email on your account if it&apos;s about billing.</p>
          <div className="row">
            <span className="mail">
              {SUPPORT}
              <button type="button" onClick={() => copy(SUPPORT, "mail")}>{copied === "mail" ? "Copied" : "Copy"}</button>
            </span>
            <Link href={ROUTES.PUBLIC.CONTACT}>Contact page</Link>
          </div>
        </Still>
      </In>
    </Root>
  );
}

export default FaqPage;
