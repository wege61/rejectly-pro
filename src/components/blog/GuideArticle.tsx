"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import styled, { css } from "styled-components";
import { useReducedMotion } from "framer-motion";
import { ROUTES } from "@/lib/constants";
import type { ArticleSection } from "@/lib/blogArticle";
import { GuideCard } from "./GuideCard";
import type { GuideListItem } from "./topics";

/*
 * A guide. The site navbar stays on top; once the title scrolls away it turns
 * into a reading bar (back, title, Contents, share, CTA) with the yellow scan
 * line as the reading progress (the navbar hides its own row while
 * html[data-reading] is set).
 *
 * Contents is one liquid-glass panel with three behaviours:
 *   ≥1000px  docks in the left gutter and the article slides right without
 *            changing width, so no line re-wraps and the reader keeps their place;
 *   640–999  slides over the text from the left, the page dims behind it;
 *   <640     a bottom sheet, where the thumb is.
 * It sits outside the article (the article is what moves) and outside any
 * backdrop-filtered parent (a blurred parent turns off the panel's own blur).
 */

const TOC_KEY = "rj-toc-open";
const ease = "cubic-bezier(0.2, 0.8, 0.2, 1)";

export interface GuideArticleData {
  slug: string;
  title: string;
  excerpt: string;
  category: string | null;
  date: string;
  isoDate: string;
  readingMinutes: number | null;
  image: string | null;
  imageAlt: string | null;
  author: string;
  html: string;
  sections: ArticleSection[];
}

/* ---------------------------------------------------------------- reading bar */

const ReadingBar = styled.div<{ $on: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1001;
  padding-top: env(safe-area-inset-top, 0px);
  pointer-events: none;
  font-family: var(--rj-font);

  .in {
    max-width: 1240px;
    height: 60px;
    margin: 0 auto;
    padding: 0 max(20px, env(safe-area-inset-right, 0px)) 0 max(20px, env(safe-area-inset-left, 0px));
    display: flex;
    align-items: center;
    gap: 10px;
    opacity: 0;
    transform: translateY(-8px);
    transition: opacity 0.25s, transform 0.35s ${ease};

    @media (min-width: 640px) { padding: 0 40px; }
  }

  .prog {
    position: absolute;
    left: 0;
    bottom: -1px;
    height: 2px;
    width: var(--read, 0%);
    background: var(--rj-hl);
    box-shadow: 0 0 10px 1px rgba(255, 225, 77, 0.55);
    opacity: 0;
    transition: opacity 0.25s;
  }

  ${({ $on }) =>
    $on &&
    css`
      .in { opacity: 1; transform: none; pointer-events: auto; }
      .prog { opacity: 1; }
    `}

  .t { flex: 1; min-width: 0; display: grid; gap: 1px; }
  .t small { font: 600 10px/1.2 var(--rj-mono); letter-spacing: 0.08em; text-transform: uppercase; color: var(--rj-ink-3); }
  .t b { overflow: hidden; white-space: nowrap; text-overflow: ellipsis; font-size: 14px; font-weight: 600; letter-spacing: -0.01em; color: var(--rj-ink); }

  .cta {
    flex: none;
    height: 36px;
    padding: 0 16px;
    display: none;
    align-items: center;
    border-radius: 999px;
    white-space: nowrap;
    font: 600 14px var(--rj-font);
    color: var(--rj-btn-ink);
    background: var(--rj-btn);
    text-decoration: none;

    @media (min-width: 640px) { display: inline-flex; }
    &:hover { color: var(--rj-btn-ink); }
    &:focus-visible { outline: 2px solid var(--rj-ink); outline-offset: 2px; }
  }

  @media (prefers-reduced-motion: reduce) { .in, .prog { transition: none; } }
`;

const iconButton = css`
  flex: none;
  width: 36px;
  height: 36px;
  display: grid;
  place-items: center;
  border: 0;
  border-radius: 50%;
  background: none;
  color: var(--rj-ink);
  cursor: pointer;
  text-decoration: none;

  svg { width: 17px; height: 17px; }
  &:hover { color: var(--rj-ink); background: color-mix(in srgb, var(--rj-ink) 6%, transparent); }
  &:focus-visible { outline: 2px solid var(--rj-ink); outline-offset: 2px; }
`;
const IconLink = styled(Link)`${iconButton}`;
const IconButton = styled.button`${iconButton}`;

const ContentsButton = styled.button<{ $open: boolean; $small?: boolean }>`
  flex: none;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  height: ${({ $small }) => ($small ? "28px" : "34px")};
  padding: 0 12px;
  border: 0;
  border-radius: 999px;
  font: 500 ${({ $small }) => ($small ? "12.5px" : "13px")} var(--rj-font);
  letter-spacing: 0;
  text-transform: none;
  cursor: pointer;
  color: ${({ $open }) => ($open ? "var(--rj-paper)" : "var(--rj-ink)")};
  background: ${({ $open }) => ($open ? "var(--rj-ink)" : "color-mix(in srgb, var(--rj-ink) 6%, transparent)")};
  transition: background 0.2s, color 0.2s;

  svg { width: 14px; height: 14px; }
  &:focus-visible { outline: 2px solid var(--rj-ink); outline-offset: 2px; }
`;

/* ---------------------------------------------------------------- contents panel */

const Scrim = styled.div<{ $open: boolean }>`
  position: fixed;
  inset: calc(60px + env(safe-area-inset-top, 0px)) 0 0;
  z-index: 998;
  background: rgba(13, 14, 16, 0.18);
  opacity: ${({ $open }) => ($open ? 1 : 0)};
  pointer-events: ${({ $open }) => ($open ? "auto" : "none")};
  transition: opacity 0.3s;

  [data-theme="dark"] & { background: rgba(0, 0, 0, 0.45); }
  @media (min-width: 1000px) { display: none; }
`;

/* Liquid glass: a thin, very clear pane that blurs and brightens what's behind it,
   a rim that catches the light on the upper edge, and a soft sheen. */
const Panel = styled.nav<{ $open: boolean }>`
  --glass-tint: color-mix(in srgb, var(--rj-surface) 58%, transparent);
  --glass-rim: rgba(255, 255, 255, 0.85);
  --glass-rim-2: rgba(255, 255, 255, 0.28);
  --glass-edge: rgba(13, 14, 16, 0.1);
  --glass-sheen: rgba(255, 255, 255, 0.55);
  --glass-shadow: rgba(13, 14, 16, 0.22);
  [data-theme="dark"] & {
    --glass-rim: rgba(255, 255, 255, 0.3);
    --glass-rim-2: rgba(255, 255, 255, 0.08);
    --glass-edge: rgba(0, 0, 0, 0.5);
    --glass-sheen: rgba(255, 255, 255, 0.1);
    --glass-shadow: rgba(0, 0, 0, 0.55);
  }

  position: fixed;
  z-index: 999;
  isolation: isolate;
  display: flex;
  flex-direction: column;
  font-family: var(--rj-font);
  background: linear-gradient(160deg, var(--glass-sheen) 0%, transparent 38%), var(--glass-tint);
  -webkit-backdrop-filter: blur(30px) saturate(2) brightness(1.05);
  backdrop-filter: blur(30px) saturate(2) brightness(1.05);
  box-shadow:
    inset 0 1px 0 var(--glass-rim),
    inset 1px 0 0 var(--glass-rim-2),
    inset 0 -1px 0 var(--glass-rim-2),
    inset -1px 0 0 var(--glass-rim-2),
    0 0 0 0.5px var(--glass-edge),
    0 2px 6px -2px var(--glass-shadow),
    0 28px 56px -24px var(--glass-shadow);
  visibility: ${({ $open }) => ($open ? "visible" : "hidden")};
  transition: transform 0.45s ${ease}, opacity 0.3s, visibility 0s ${({ $open }) => ($open ? "0s" : "0.45s")};

  &::after {
    content: "";
    position: absolute;
    inset: 0;
    z-index: -1;
    border-radius: inherit;
    pointer-events: none;
    background: radial-gradient(120% 60% at 0% 0%, var(--glass-sheen), transparent 55%), radial-gradient(80% 40% at 100% 100%, var(--glass-rim-2), transparent 60%);
    mix-blend-mode: soft-light;
  }

  /* phone: bottom sheet */
  left: 10px;
  right: 10px;
  bottom: calc(10px + env(safe-area-inset-bottom, 0px));
  max-height: 66vh;
  padding: 12px 10px 14px;
  border-radius: 24px;
  opacity: ${({ $open }) => ($open ? 1 : 0)};
  transform: translateY(${({ $open }) => ($open ? "0" : "24px")});

  &::before { content: ""; align-self: center; width: 36px; height: 5px; margin: -4px 0 8px; border-radius: 3px; background: color-mix(in srgb, var(--rj-ink) 18%, transparent); }

  /* tablet: slides over from the left */
  @media (min-width: 640px) {
    left: 0;
    right: auto;
    top: calc(60px + env(safe-area-inset-top, 0px));
    bottom: 0;
    width: 320px;
    max-height: none;
    padding: 18px 14px;
    border-radius: 0 24px 24px 0;
    opacity: 1;
    transform: translateX(${({ $open }) => ($open ? "0" : "-104%")});
    &::before { display: none; }
  }

  /* desktop: docks in the gutter and the article slides */
  @media (min-width: 1000px) {
    --glass-tint: color-mix(in srgb, var(--rj-surface) 40%, transparent);
    -webkit-backdrop-filter: blur(22px) saturate(2) brightness(1.05);
    backdrop-filter: blur(22px) saturate(2) brightness(1.05);
    left: max(40px, calc((100vw - 1240px) / 2 + 40px));
    top: calc(76px + env(safe-area-inset-top, 0px));
    bottom: auto;
    width: 260px;
    max-height: calc(100vh - 108px);
    padding: 14px 10px;
    border-radius: 22px;
    opacity: ${({ $open }) => ($open ? 1 : 0)};
    transform: translateX(${({ $open }) => ($open ? "0" : "calc(-100% - 80px)")});
  }

  @media (prefers-reduced-motion: reduce) { transition: none; }

  .h { display: flex; align-items: center; justify-content: space-between; padding: 0 0 6px 10px; }
  .k { margin: 0; font: 600 10.5px/1 var(--rj-mono); letter-spacing: 0.08em; text-transform: uppercase; color: var(--rj-ink-3); }
  .x {
    width: 30px;
    height: 30px;
    display: grid;
    place-items: center;
    border: 0;
    border-radius: 50%;
    color: var(--rj-ink-2);
    background: color-mix(in srgb, var(--rj-ink) 6%, transparent);
    box-shadow: inset 0 1px 0 var(--glass-rim-2);
    cursor: pointer;

    svg { width: 13px; height: 13px; }
    &:focus-visible { outline: 2px solid var(--rj-ink); outline-offset: 2px; }
  }

  ul { list-style: none; margin: 0; padding: 0; display: grid; gap: 2px; overflow: auto; overscroll-behavior: contain; }
  a {
    position: relative;
    display: block;
    padding: 8px 10px 8px 16px;
    border-radius: 10px;
    font-size: 13.5px;
    line-height: 1.35;
    color: var(--rj-ink-2);
    text-decoration: none;
    transition: color 0.2s, background 0.2s;

    &::before { content: ""; position: absolute; left: 6px; top: 10px; bottom: 10px; width: 2px; border-radius: 2px; background: transparent; transition: background 0.25s, box-shadow 0.25s; }
    &:hover { color: var(--rj-ink); background: color-mix(in srgb, var(--rj-ink) 7%, transparent); }
    &:focus-visible { outline: 2px solid var(--rj-ink); outline-offset: -2px; }
    &[aria-current="location"] {
      color: var(--rj-ink);
      font-weight: 600;
      background: color-mix(in srgb, var(--rj-surface) 55%, transparent);
      box-shadow: inset 0 1px 0 var(--glass-rim-2);
      &::before { background: var(--rj-hl); box-shadow: 0 0 8px 1px rgba(255, 225, 77, 0.6); }
    }
  }
`;

/* ---------------------------------------------------------------- page */

const Root = styled.div`
  background: var(--rj-paper);
  color: var(--rj-ink);
  font-family: var(--rj-font);
  -webkit-font-smoothing: antialiased;
  padding-top: calc(60px + env(safe-area-inset-top, 0px));
  overflow-x: clip;
`;

const Article = styled.article<{ $shift: number; $open: boolean }>`
  transition: transform 0.45s ${ease};

  @media (min-width: 1000px) {
    transform: translateX(${({ $open, $shift }) => ($open ? `${$shift}px` : "0")});
  }
  @media (prefers-reduced-motion: reduce) { transition: none; }
`;

const Gutter = styled.div`
  padding: 0 max(20px, env(safe-area-inset-right, 0px)) 0 max(20px, env(safe-area-inset-left, 0px));

  @media (min-width: 640px) { padding: 0 40px; }
`;

const Head = styled.header`
  max-width: 760px;
  margin: 0 auto;
  padding-top: 32px;

  @media (min-width: 640px) { padding-top: 64px; }
  @media (min-width: 1000px) { padding-top: 80px; }

  .meta { margin: 0; display: flex; flex-wrap: wrap; align-items: center; gap: 6px 14px; font: 500 12px/1.4 var(--rj-mono); letter-spacing: 0.06em; text-transform: uppercase; color: var(--rj-ink-3); }
  .meta a { color: var(--rj-ink); text-decoration: none; }
  .meta a:hover { text-decoration: underline; text-underline-offset: 3px; }
  .meta button { margin-left: auto; }

  h1 { margin: 16px 0 0; font-size: clamp(34px, 8.4vw, 60px); font-weight: 700; line-height: 1.04; letter-spacing: -0.045em; color: var(--rj-ink); text-wrap: balance; }
  @media (min-width: 1000px) { h1 { font-size: clamp(44px, 4.2vw, 60px); } }
  .dek { margin: 18px 0 0; font-size: clamp(18px, 4.4vw, 22px); line-height: 1.5; color: var(--rj-ink-2); text-wrap: pretty; }
  @media (min-width: 640px) { .dek { font-size: 21px; } }
`;

const Figure = styled.figure`
  position: relative;
  max-width: 1080px;
  margin: 32px auto 0;
  aspect-ratio: 16 / 9;
  overflow: hidden;
  border-radius: 18px;
  background: var(--rj-tile);
  box-shadow: 0 0 0 1px var(--rj-line);

  @media (min-width: 640px) { border-radius: 24px; }
`;

const Body = styled.div`
  max-width: 680px;
  margin: 40px auto 0;
  font-size: 18px;
  line-height: 1.72;
  color: var(--rj-ink-2);
  overflow-wrap: break-word;

  h2 { margin: 56px 0 0; font-size: clamp(26px, 6vw, 32px); font-weight: 700; line-height: 1.15; letter-spacing: -0.03em; color: var(--rj-ink); text-wrap: balance; scroll-margin-top: 90px; }
  h2:first-child { margin-top: 0; }
  h3 { margin: 36px 0 0; font-size: 21px; font-weight: 650; line-height: 1.3; letter-spacing: -0.015em; color: var(--rj-ink); scroll-margin-top: 90px; }
  p { margin: 18px 0 0; }
  strong, b { color: var(--rj-ink); font-weight: 600; }
  a { color: var(--rj-ink); text-decoration: underline; text-decoration-color: color-mix(in srgb, var(--rj-ink) 35%, transparent); text-underline-offset: 3px; }
  a:hover { text-decoration-color: var(--rj-ink); }
  ul, ol { margin: 18px 0 0; padding: 0; display: grid; gap: 10px; }
  ul { list-style: none; }
  ul > li { position: relative; padding-left: 26px; }
  ul > li::before { content: ""; position: absolute; left: 6px; top: 0.72em; width: 6px; height: 6px; border-radius: 50%; background: var(--rj-ink-3); }
  ol { padding-left: 26px; }
  ol > li::marker { font: 600 15px var(--rj-mono); color: var(--rj-ink-3); }
  blockquote { margin: 28px 0 0; padding: 4px 0 4px 20px; border-left: 3px solid var(--rj-hl); color: var(--rj-ink); font-size: 20px; line-height: 1.55; }
  blockquote p:first-child { margin-top: 0; }
  code { padding: 2px 6px; border-radius: 6px; font: 500 0.88em var(--rj-mono); color: var(--rj-ink); background: var(--rj-tile); }
  pre { margin: 24px 0 0; padding: 18px; overflow-x: auto; border-radius: 14px; background: var(--rj-term); color: var(--rj-term-ink); font: 500 14px/1.6 var(--rj-mono); }
  pre code { padding: 0; background: none; color: inherit; }
  img { display: block; max-width: 100%; height: auto; margin: 28px auto 0; border-radius: 16px; }
  table { width: 100%; margin: 24px 0 0; border-collapse: collapse; font-size: 16px; display: block; overflow-x: auto; }
  th, td { padding: 10px 12px; border-bottom: 1px solid var(--rj-line); text-align: left; }
  th { color: var(--rj-ink); font-weight: 600; }
  hr { margin: 40px 0 0; border: 0; border-top: 1px solid var(--rj-line); }
`;

const End = styled.div`
  max-width: 680px;
  margin: 48px auto 0;
  padding-top: 24px;
  border-top: 1px solid var(--rj-line);
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 12px 20px;
  font-size: 14px;
  color: var(--rj-ink-3);

  .share { display: flex; flex-wrap: wrap; gap: 8px; }
  .share a, .share button {
    height: 36px;
    padding: 0 14px;
    display: inline-flex;
    align-items: center;
    border: 0;
    border-radius: 999px;
    font: 500 13.5px var(--rj-font);
    color: var(--rj-ink);
    background: color-mix(in srgb, var(--rj-ink) 6%, transparent);
    text-decoration: none;
    cursor: pointer;

    &:hover { color: var(--rj-ink); background: color-mix(in srgb, var(--rj-ink) 10%, transparent); }
    &:focus-visible { outline: 2px solid var(--rj-ink); outline-offset: 2px; }
  }
`;

const Cta = styled.section`
  max-width: 1240px;
  margin: 56px auto 0;

  .in { display: grid; gap: 16px; padding: 28px 24px; border-radius: 28px; color: var(--rj-bridge-ink); background: var(--rj-bridge); }
  @media (min-width: 640px) { .in { padding: 36px 40px; } }
  .k { margin: 0; font: 600 11px/1 var(--rj-mono); letter-spacing: 0.08em; text-transform: uppercase; color: var(--rj-bridge-ink-2); }
  h2 { margin: 0; font-size: clamp(26px, 6vw, 38px); font-weight: 700; line-height: 1.08; letter-spacing: -0.035em; color: var(--rj-bridge-ink); text-wrap: balance; }
  h2 span { color: #ffe14d; }
  p { margin: 0; max-width: 34em; font-size: 16px; line-height: 1.55; color: var(--rj-bridge-ink-2); }
  a { justify-self: start; height: 50px; padding: 0 24px; display: inline-flex; align-items: center; gap: 8px; border-radius: 999px; font-weight: 600; color: #0d0e10; background: #f2f2ef; text-decoration: none; }
  a svg { width: 15px; height: 15px; }
  a:hover { color: #0d0e10; }
  a:focus-visible { outline: 2px solid #f2f2ef; outline-offset: 3px; }
`;

const Related = styled.section`
  max-width: 1240px;
  margin: 72px auto 0;
  padding-bottom: 80px;

  .eyebrow { margin: 0; font: 500 11.5px/1.3 var(--rj-mono); letter-spacing: 0.07em; text-transform: uppercase; color: var(--rj-ink-2); }
  h2 { margin: 10px 0 0; font-size: clamp(26px, 6vw, 36px); font-weight: 700; letter-spacing: -0.035em; color: var(--rj-ink); }
  .grid { margin-top: 24px; display: grid; gap: 20px; }
  @media (min-width: 640px) { .grid { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
  @media (min-width: 1000px) { .grid { grid-template-columns: repeat(3, minmax(0, 1fr)); } }
`;

const Toast = styled.div<{ $on: boolean }>`
  position: fixed;
  left: 50%;
  bottom: calc(24px + env(safe-area-inset-bottom, 0px));
  z-index: 1002;
  padding: 10px 16px;
  border-radius: 999px;
  font: 500 14px var(--rj-font);
  color: var(--rj-btn-ink);
  background: var(--rj-btn);
  transform: translate(-50%, ${({ $on }) => ($on ? "0" : "12px")});
  opacity: ${({ $on }) => ($on ? 1 : 0)};
  pointer-events: none;
  transition: opacity 0.2s, transform 0.25s ${ease};
`;

/* ---------------------------------------------------------------- icons */

const Arrow = () => (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M3 8h10M9 4l4 4-4 4" /></svg>
);
const Back = () => (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M13 8H3M7 4L3 8l4 4" /></svg>
);
const ShareIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 3v12M7 8l5-5 5 5" /><path d="M5 13v6a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-6" /></svg>
);
const ListIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true"><path d="M8 6h12M8 12h12M8 18h12M4 6h.01M4 12h.01M4 18h.01" /></svg>
);

/* ---------------------------------------------------------------- component */

export function GuideArticle({ article, related }: { article: GuideArticleData; related: GuideListItem[] }) {
  const reduce = useReducedMotion();
  const [reading, setReading] = useState(false);
  const [pastArticle, setPastArticle] = useState(false); // the panel steps aside below the article
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState(article.sections[0]?.id ?? "");
  const [shift, setShift] = useState(80);
  const [toast, setToast] = useState("");
  const headRef = useRef<HTMLElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLElement>(null);
  const opener = useRef<HTMLElement | null>(null);
  const url = `https://rejectly.pro${ROUTES.PUBLIC.BLOG_POST(article.slug)}`;

  const isWide = () => typeof window !== "undefined" && window.matchMedia("(min-width: 1000px)").matches;

  // The navbar hides its own row while a guide's reading bar is showing.
  useEffect(() => {
    const root = document.documentElement;
    if (reading) root.dataset.reading = "1";
    else delete root.dataset.reading;
    return () => { delete root.dataset.reading; };
  }, [reading]);

  // Desktop: slide the article just enough to clear the panel, at least 80px, never off screen.
  useEffect(() => {
    const measure = () => {
      const W = window.innerWidth;
      const col = Math.min(680, W);
      const colLeft = (W - col) / 2;
      const panelRight = Math.max(40, (W - 1240) / 2 + 40) + 260 + 32;
      setShift(Math.round(Math.min(Math.max(80, panelRight - colLeft), Math.max(80, (W - col) / 2 - 20))));
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  // Open on desktop if the reader left it open last time.
  useEffect(() => {
    try {
      if (isWide() && localStorage.getItem(TOC_KEY) === "1") setOpen(true);
    } catch {
      /* storage blocked: start closed */
    }
  }, []);

  // Reading state, progress (written straight to the bar, no re-render) and the current section.
  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const head = headRef.current;
      const body = bodyRef.current;
      if (!head || !body) return;
      const y = window.scrollY;
      setReading(y > head.offsetTop + head.offsetHeight - 60);
      setPastArticle(body.getBoundingClientRect().bottom < 240);
      const top = body.getBoundingClientRect().top + y - 80;
      const len = body.offsetHeight - window.innerHeight + 160;
      barRef.current?.style.setProperty("--read", `${Math.max(0, Math.min(100, ((y - top) / Math.max(1, len)) * 100))}%`);
      let cur = article.sections[0]?.id ?? "";
      for (const s of article.sections) {
        const el = document.getElementById(s.id);
        if (el && el.getBoundingClientRect().top <= 120) cur = s.id;
      }
      setCurrent(cur);
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [article.sections]);

  const setContents = useCallback((next: boolean, remember: boolean) => {
    setOpen(next);
    if (remember && isWide()) {
      try { localStorage.setItem(TOC_KEY, next ? "1" : "0"); } catch { /* ignore */ }
    }
  }, []);

  // On tablets and phones the panel covers the page: lock scrolling, move focus in, Esc closes.
  useEffect(() => {
    if (!open) return;
    const modal = !isWide();
    const prev = document.body.style.overflow;
    if (modal) {
      document.body.style.overflow = "hidden";
      panelRef.current?.querySelector<HTMLElement>("a, button")?.focus({ preventScroll: true });
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setContents(false, true);
      opener.current?.focus();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, setContents]);

  const toggle = (e: React.MouseEvent<HTMLElement>) => {
    opener.current = e.currentTarget;
    setContents(!open, true);
  };

  const goTo = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (!el) return;
    window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 80, behavior: reduce ? "auto" : "smooth" });
    history.replaceState(null, "", `#${id}`);
    if (!isWide()) setContents(false, false);
  };

  const flash = (msg: string) => {
    setToast(msg);
    window.setTimeout(() => setToast(""), 1800);
  };
  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      flash("Link copied");
    } catch {
      flash("Couldn't copy. The link is in the address bar.");
    }
  };
  const share = async () => {
    if (navigator.share) {
      try { await navigator.share({ title: article.title, url }); } catch { /* cancelled */ }
    } else {
      copyLink();
    }
  };

  const hasContents = article.sections.length > 1;
  // Below the article (CTA, related guides, footer) nothing slides, so the panel would sit on top of them.
  const shown = open && hasContents && !pastArticle;

  return (
    <Root>
      <ReadingBar ref={barRef} $on={reading} aria-hidden={!reading}>
        <div className="in">
          <IconLink href={ROUTES.PUBLIC.BLOG} aria-label="All guides" tabIndex={reading ? 0 : -1}><Back /></IconLink>
          <span className="t"><small>Guides</small><b>{article.title}</b></span>
          {hasContents && (
            <ContentsButton type="button" $open={open} aria-expanded={open} aria-controls="guide-contents" onClick={toggle} tabIndex={reading ? 0 : -1}>
              <ListIcon />Contents
            </ContentsButton>
          )}
          <IconButton type="button" aria-label="Share this guide" onClick={share} tabIndex={reading ? 0 : -1}><ShareIcon /></IconButton>
          <Link className="cta" href={ROUTES.PUBLIC.ATS_CHECK} tabIndex={reading ? 0 : -1}>Free ATS scan</Link>
        </div>
        <span className="prog" aria-hidden="true" />
      </ReadingBar>

      {hasContents && (
        <>
          <Scrim $open={shown} onClick={() => setContents(false, false)} aria-hidden="true" />
          <Panel ref={panelRef} id="guide-contents" aria-label="On this page" $open={shown} inert={!shown}>
            <div className="h">
              <p className="k">On this page</p>
              <button className="x" type="button" aria-label="Close contents" onClick={() => { setContents(false, true); opener.current?.focus(); }}>
                <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true"><path d="M4 4l8 8M12 4l-8 8" /></svg>
              </button>
            </div>
            <ul>
              {article.sections.map((s) => (
                <li key={s.id}>
                  <a href={`#${s.id}`} aria-current={current === s.id ? "location" : undefined} onClick={(e) => goTo(e, s.id)}>{s.text}</a>
                </li>
              ))}
            </ul>
          </Panel>
        </>
      )}

      <Article $open={shown} $shift={shift}>
        <Gutter>
          <Head ref={headRef}>
            <p className="meta">
              {article.category && <Link href={ROUTES.PUBLIC.BLOG}>{article.category}</Link>}
              {article.date && <time dateTime={article.isoDate}>{article.date}</time>}
              {article.readingMinutes ? <span>{article.readingMinutes} min read</span> : null}
              {hasContents && (
                <ContentsButton type="button" $small $open={open} aria-expanded={open} aria-controls="guide-contents" onClick={toggle}>
                  <ListIcon />Contents
                </ContentsButton>
              )}
            </p>
            <h1>{article.title}</h1>
            {article.excerpt && <p className="dek">{article.excerpt}</p>}
          </Head>

          {article.image && (
            <Figure>
              <Image src={article.image} alt={article.imageAlt || ""} fill priority sizes="(min-width: 1160px) 1080px, 100vw" style={{ objectFit: "cover" }} />
            </Figure>
          )}

          <Body ref={bodyRef} className="article-content" itemProp="articleBody" dangerouslySetInnerHTML={{ __html: article.html }} />

          <End>
            <span>By {article.author}</span>
            <span className="share">
              <button type="button" onClick={copyLink}>Copy link</button>
              <a href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(article.title)}`} target="_blank" rel="noopener noreferrer">Share on X</a>
              <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`} target="_blank" rel="noopener noreferrer">LinkedIn</a>
            </span>
          </End>
        </Gutter>
      </Article>

      <Gutter>
        <Cta aria-label="Free ATS scan">
          <div className="in">
            <p className="k">Free ATS scan</p>
            <h2>Now see what the ATS sees <span>in yours.</span></h2>
            <p>Upload your resume: the text the parser pulls out, your score from 19 checks, and the fix for each one. No account, no card.</p>
            <Link href={ROUTES.PUBLIC.ATS_CHECK}>Scan my resume free <Arrow /></Link>
          </div>
        </Cta>

        {related.length > 0 && (
          <Related aria-labelledby="guide-related">
            <p className="eyebrow">Keep reading</p>
            <h2 id="guide-related">More on getting read.</h2>
            <div className="grid">
              {related.map((g) => <GuideCard key={g.slug} guide={g} />)}
            </div>
          </Related>
        )}
      </Gutter>

      <Toast $on={!!toast} role="status" aria-live="polite">{toast}</Toast>
    </Root>
  );
}

export default GuideArticle;
