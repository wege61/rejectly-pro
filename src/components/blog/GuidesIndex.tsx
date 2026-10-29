"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import styled from "styled-components";
import { useReducedMotion } from "framer-motion";
import { ROUTES } from "@/lib/constants";
import { ALL_FEATURED, TOPICS, type GuideListItem } from "./topics";
import { GuideCard } from "./GuideCard";

/*
 * /blog index. One featured guide (image, category, title, excerpt, date, one
 * button) and the plain guide cards below it. The chips are the reader's
 * problem; picking one rewrites the heading ("I'm stuck on my format."), the
 * featured guide and the list, with the homepage guides' soft switch: the image
 * slips out with a slight zoom and settles back, the copy fades down and back,
 * the cards rise in turn.
 *
 * Every card is rendered, extras hidden, so every guide is linked from the page.
 */

const STEP = 9;

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
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 20px;
  padding-top: 40px;

  @media (min-width: 640px) { padding-top: 64px; }
  @media (min-width: 1000px) { padding-top: 80px; }

  > * { min-width: 0; }

  .eyebrow { margin: 0; font: 500 11.5px/1.3 var(--rj-mono); letter-spacing: 0.07em; text-transform: uppercase; color: var(--rj-ink-2); }

  h1 {
    margin: 12px 0 0;
    font-size: clamp(36px, 9.6vw, 72px);
    font-weight: 700;
    line-height: 1.02;
    letter-spacing: -0.045em;
    color: var(--rj-ink);
    text-wrap: balance;
    transition: opacity 0.25s, transform 0.3s cubic-bezier(0.3, 0, 0.2, 1);

    @media (min-width: 640px) { font-size: clamp(44px, 7.4vw, 72px); }
    mark { padding: 0 0.06em; margin: 0 -0.03em; border-radius: 0.1em; color: var(--rj-hl-ink); background: var(--rj-hl); }
    &.out { opacity: 0; transform: translateY(6px); }
  }

  .row { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 14px 20px; }
  .row > * { min-width: 0; }
`;

const Chips = styled.div`
  flex: 1 1 auto;
  display: flex;
  gap: 8px;
  margin: -2px;
  padding: 2px;
  overflow-x: auto;
  scrollbar-width: none;

  &::-webkit-scrollbar { display: none; }

  button, a {
    flex: none;
    height: 42px;
    padding: 0 18px;
    display: inline-flex;
    align-items: center;
    border: 0;
    border-radius: 999px;
    font: 500 15px var(--rj-font);
    white-space: nowrap;
    text-decoration: none;
    color: var(--rj-ink);
    background: var(--rj-surface);
    box-shadow: inset 0 0 0 1px var(--rj-line);
    cursor: pointer;
    transition: background 0.2s, color 0.2s;

    &[aria-pressed="true"] { color: var(--rj-paper); background: var(--rj-ink); box-shadow: none; }
    &:focus-visible { outline: 2px solid var(--rj-ink); outline-offset: 2px; }
  }
`;

const Search = styled.label`
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
  height: 42px;
  border-radius: 999px;
  background: var(--rj-surface);
  box-shadow: inset 0 0 0 1px var(--rj-line);

  @media (min-width: 1000px) { flex: none; width: 280px; }
  &:focus-within { outline: 2px solid var(--rj-ink); outline-offset: 2px; }

  svg { position: absolute; left: 15px; width: 16px; height: 16px; color: var(--rj-ink-3); }
  input { width: 100%; height: 100%; padding: 0 16px 0 40px; border: 0; background: none; font: 500 15px var(--rj-font); color: var(--rj-ink); outline: none; }
  input::placeholder { color: var(--rj-ink-3); }
  input::-webkit-search-cancel-button { cursor: pointer; }
`;

const Featured = styled(Link)`
  margin-top: 28px;
  display: grid;
  gap: 4px;
  padding: 12px;
  border-radius: 28px;
  color: inherit;
  text-decoration: none;
  background: var(--rj-surface);
  box-shadow: 0 0 0 1px var(--rj-line);

  @media (min-width: 640px) { padding: 16px; }
  @media (min-width: 1000px) { grid-template-columns: minmax(0, 1.15fr) minmax(0, 1fr); gap: 0; align-items: stretch; }
  &:hover { color: inherit; }
  &:focus-visible { outline: 2px solid var(--rj-ink); outline-offset: 3px; }

  .im { position: relative; aspect-ratio: 16 / 10; overflow: hidden; border-radius: 18px; background: var(--rj-tile); }
  @media (min-width: 1000px) { .im { aspect-ratio: auto; min-height: 420px; } }
  .im img { transition: opacity 0.35s, transform 0.9s cubic-bezier(0.25, 1, 0.5, 1); }
  .im img.out { opacity: 0; transform: scale(1.04); }
  &:hover .im img:not(.out) { transform: scale(1.03); }

  .bd { display: flex; flex-direction: column; padding: 16px 10px 10px; transition: opacity 0.25s, transform 0.3s cubic-bezier(0.3, 0, 0.2, 1); }
  @media (min-width: 640px) { .bd { padding: 20px 12px 12px; } }
  @media (min-width: 1000px) { .bd { justify-content: center; padding: 32px 40px 32px 48px; } }
  .bd.out { opacity: 0; transform: translateY(6px); }

  .c { font: 600 11px/1 var(--rj-mono); letter-spacing: 0.08em; text-transform: uppercase; color: var(--rj-ink-3); }
  h2 { margin: 12px 0 0; font-size: clamp(26px, 6.4vw, 42px); font-weight: 700; line-height: 1.08; letter-spacing: -0.035em; color: var(--rj-ink); text-wrap: balance; }
  @media (min-width: 1000px) { h2 { font-size: clamp(30px, 3vw, 42px); } }
  p { margin: 14px 0 0; max-width: 32em; font-size: 16.5px; line-height: 1.55; color: var(--rj-ink-2); }
  .ft { margin-top: 22px; display: flex; flex-wrap: wrap; align-items: center; gap: 12px 20px; }
  .go { height: 48px; padding: 0 22px; display: inline-flex; align-items: center; gap: 8px; border-radius: 999px; font-size: 15px; font-weight: 600; color: var(--rj-btn-ink); background: var(--rj-btn); }
  .go svg { width: 15px; height: 15px; }
  time { font-size: 14px; color: var(--rj-ink-3); }

  @media (prefers-reduced-motion: reduce) { .im img, .bd { transition: none; } }
`;

const Grid = styled.div`
  margin-top: 20px;
  display: grid;
  gap: 20px;
  transition: opacity 0.2s;

  @media (min-width: 640px) { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  @media (min-width: 1000px) { grid-template-columns: repeat(3, minmax(0, 1fr)); }

  &.out { opacity: 0; }
  &.in > a:not([hidden]) { animation: rj-guide-rise 0.55s cubic-bezier(0.3, 0, 0.2, 1) both; animation-delay: calc(var(--i, 0) * 45ms); }
  @keyframes rj-guide-rise { from { opacity: 0; transform: translateY(14px); } }
  @media (prefers-reduced-motion: reduce) { transition: none; &.in > a { animation: none; } }
`;

const More = styled.button`
  margin: 28px auto 0;
  height: 48px;
  padding: 0 24px;
  display: flex;
  align-items: center;
  border: 0;
  border-radius: 999px;
  background: none;
  box-shadow: inset 0 0 0 1.5px var(--rj-line);
  color: var(--rj-ink);
  font: 600 15px var(--rj-font);
  cursor: pointer;

  &[hidden] { display: none; }
  &:focus-visible { outline: 2px solid var(--rj-ink); outline-offset: 3px; }
`;

const Empty = styled.p`
  margin: 24px 0 0;
  padding: 40px 20px;
  border-radius: 20px;
  text-align: center;
  color: var(--rj-ink-2);
  background: var(--rj-surface);
  box-shadow: 0 0 0 1px var(--rj-line);
`;

const End = styled.div`
  margin: 56px 0 72px;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 18px 24px;
  padding: 28px 24px;
  border-radius: 24px;
  color: var(--rj-bridge-ink);
  background: var(--rj-bridge);

  @media (min-width: 640px) { padding: 32px 36px; }

  p { margin: 0; font-size: clamp(22px, 5vw, 30px); font-weight: 700; line-height: 1.15; letter-spacing: -0.035em; }
  p span { color: var(--rj-bridge-ink-2); }
  a { height: 50px; padding: 0 24px; display: inline-flex; align-items: center; gap: 8px; border-radius: 999px; font-weight: 600; color: #0d0e10; background: #f2f2ef; text-decoration: none; }
  a svg { width: 15px; height: 15px; }
  a:hover { color: #0d0e10; }
  a:focus-visible { outline: 2px solid #f2f2ef; outline-offset: 3px; }
`;

const Arrow = () => (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M3 8h10M9 4l4 4-4 4" />
  </svg>
);

interface Props {
  guides: GuideListItem[];
  /** Set when the URL filters by category or tag (?category= / ?tag=): no chips then. */
  filterLabel?: string;
}

export function GuidesIndex({ guides, filterLabel }: Props) {
  const reduce = useReducedMotion();
  const bySlug = useMemo(() => new Map(guides.map((g) => [g.slug, g])), [guides]);
  const topics = useMemo(
    () => TOPICS.map((t) => ({ ...t, slugs: t.slugs.filter((s) => bySlug.has(s)) })).filter((t) => t.slugs.length > 0),
    [bySlug]
  );

  const [topic, setTopic] = useState("all"); // what's shown
  const [picked, setPicked] = useState("all"); // chip state, ahead of the switch
  const [query, setQuery] = useState("");
  const [limit, setLimit] = useState(STEP);
  const [leaving, setLeaving] = useState(false);
  const [entering, setEntering] = useState(false);
  const [settling, setSettling] = useState(false); // new image mounts zoomed out, then settles
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const enterTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
    if (enterTimer.current) clearTimeout(enterTimer.current);
  }, []);
  useEffect(() => {
    if (!settling) return;
    let raf = requestAnimationFrame(() => { raf = requestAnimationFrame(() => setSettling(false)); });
    return () => cancelAnimationFrame(raf);
  }, [settling]);

  const current = topics.find((t) => t.key === topic);
  const list = current ? current.slugs.map((s) => bySlug.get(s)!) : guides;
  const featuredSlug = filterLabel ? list[0]?.slug : current ? current.slugs[0] : bySlug.has(ALL_FEATURED) ? ALL_FEATURED : guides[0]?.slug;
  const featured = featuredSlug ? bySlug.get(featuredSlug) : undefined;

  const term = query.trim().toLowerCase();
  const pool = term ? list : list.filter((g) => g.slug !== featuredSlug);
  const hits = new Set(
    pool.filter((g) => !term || `${g.title} ${g.excerpt}`.toLowerCase().includes(term)).slice(0, limit).map((g) => g.slug)
  );
  const total = pool.filter((g) => !term || `${g.title} ${g.excerpt}`.toLowerCase().includes(term)).length;
  // Cards follow the topic's order; the rest keep their place, hidden.
  const order = [...pool, ...guides.filter((g) => !pool.includes(g))];

  const pick = (key: string, chip: HTMLElement) => {
    if (key === picked) return;
    const row = chip.parentElement;
    if (row && (chip.offsetLeft < row.scrollLeft || chip.offsetLeft + chip.offsetWidth > row.scrollLeft + row.clientWidth)) {
      row.scrollTo({ left: chip.offsetLeft - 20, behavior: reduce ? "auto" : "smooth" });
    }
    setPicked(key);
    if (timer.current) clearTimeout(timer.current);
    if (reduce) {
      setTopic(key);
      setLimit(STEP);
      return;
    }
    setLeaving(true);
    setEntering(false);
    timer.current = setTimeout(() => {
      setTopic(key);
      setLimit(STEP);
      setLeaving(false);
      setSettling(true);
      setEntering(true);
      if (enterTimer.current) clearTimeout(enterTimer.current);
      enterTimer.current = setTimeout(() => setEntering(false), 1400);
    }, 260);
  };

  let shown = 0;
  const headline = filterLabel ? (
    <>Guides on <mark>{filterLabel}</mark>.</>
  ) : current ? (
    <>{current.lead} <mark>{current.word}</mark>.</>
  ) : (
    <>Everything we&apos;ve <mark>written</mark>.</>
  );

  return (
    <Root>
      <In>
        <Head>
          <div>
            <p className="eyebrow">Guides</p>
            <h1 className={leaving ? "out" : undefined} aria-live="polite">{headline}</h1>
          </div>
          <div className="row">
            <Chips role="group" aria-label="What are you stuck on?">
              {filterLabel ? (
                <Link href={ROUTES.PUBLIC.BLOG}>All guides</Link>
              ) : (
                <>
                  <button type="button" aria-pressed={picked === "all"} onClick={(e) => pick("all", e.currentTarget)}>All</button>
                  {topics.map((t) => (
                    <button key={t.key} type="button" aria-pressed={picked === t.key} onClick={(e) => pick(t.key, e.currentTarget)}>
                      {t.label}
                    </button>
                  ))}
                </>
              )}
            </Chips>
            <Search>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7" /><path d="M20 20l-3.5-3.5" /></svg>
              <input
                type="search"
                value={query}
                onChange={(e) => { setQuery(e.target.value); setLimit(STEP); }}
                placeholder={`Search ${guides.length} guides`}
                aria-label="Search guides"
              />
            </Search>
          </div>
        </Head>

        {featured && !term && (
          <Featured href={ROUTES.PUBLIC.BLOG_POST(featured.slug)} aria-label={featured.title}>
            <span className="im">
              {featured.image && (
                <Image
                  key={featured.slug}
                  className={leaving || settling ? "out" : undefined}
                  src={featured.image}
                  alt={featured.imageAlt || ""}
                  fill
                  sizes="(min-width: 1000px) 640px, 100vw"
                  style={{ objectFit: "cover" }}
                  priority
                />
              )}
            </span>
            <span className={`bd${leaving ? " out" : ""}`}>
              {featured.category && <span className="c">{featured.category}</span>}
              <h2>{featured.title}</h2>
              <p>{featured.excerpt}</p>
              <span className="ft">
                <span className="go">Read the guide <Arrow /></span>
                {featured.date && <time>{featured.date}</time>}
              </span>
            </span>
          </Featured>
        )}

        <Grid className={leaving ? "out" : entering ? "in" : undefined}>
          {order.map((g) => {
            const on = hits.has(g.slug);
            return (
              <GuideCard
                key={g.slug}
                guide={g}
                hidden={!on}
                style={{ "--i": on ? shown++ : 0 } as React.CSSProperties}
              />
            );
          })}
        </Grid>

        {guides.length === 0 ? (
          <Empty>The guides didn&apos;t load. Refresh the page in a moment.</Empty>
        ) : (
          total === 0 && <Empty>No guides match that. Try &quot;keywords&quot; or &quot;interview&quot;.</Empty>
        )}
        <More type="button" hidden={total <= limit} onClick={() => setLimit((l) => l + STEP)}>
          Show more guides
        </More>

        <End>
          <p>Read enough? <span>See what the ATS sees in yours.</span></p>
          <Link href={ROUTES.PUBLIC.ATS_CHECK}>Scan my resume free <Arrow /></Link>
        </End>
      </In>
    </Root>
  );
}

export default GuidesIndex;
