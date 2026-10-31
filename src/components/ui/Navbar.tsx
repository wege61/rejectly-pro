"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import styled, { css } from "styled-components";
import { ROUTES } from "@/lib/constants";
import { useAuth } from "@/hooks/useAuth";
import { useTheme } from "@/contexts/ThemeContext";

/*
 * Site navbar. Tools lists the four real tools with their price; the two with a
 * free version (the ATS scan and the job match demo) show it inside their row,
 * since they're the same tool, score only. Hovering a row swaps the preview to
 * that tool, drawn from the homepage's Maya demo (no invented data).
 *
 * The bar blends into the page at the top and frosts once you scroll. On phones
 * and tablets the menu is a full-screen sheet with one CTA. A page can hide the
 * bar's CTA while its own copy of it is on screen by marking an element with
 * `data-nav-cta-hide` (the /ats-check drop zone does).
 */

type Tool = {
  key: "opt" | "match" | "cover" | "build";
  title: string;
  href: string;
  price: string;
  free?: boolean;
  text: string;
  freeLink?: { label: string; short: string; href: string };
};

const TOOLS: Tool[] = [
  {
    key: "opt",
    title: "ATS Optimizer",
    href: ROUTES.APP.ATS_OPTIMIZER,
    price: "1 credit",
    text: "Rebuilds your resume as one clean column with standard headings, then scores it again.",
    freeLink: { label: "ATS scan, score only", short: "ATS scan", href: ROUTES.PUBLIC.ATS_CHECK },
  },
  {
    key: "match",
    title: "Job Match",
    href: ROUTES.APP.REPORTS,
    price: "1 credit",
    text: "Your resume against one job post, rewritten in its words. Includes role ideas and interview prep.",
    freeLink: { label: "Demo, match score only", short: "Demo", href: "/#demo" },
  },
  {
    key: "cover",
    title: "Cover Letters",
    href: ROUTES.APP.COVER_LETTERS,
    price: "With a match",
    text: "A letter for the job you matched, written from your match report.",
  },
  {
    key: "build",
    title: "Resume Builder",
    href: ROUTES.PUBLIC.CV_BUILDER,
    price: "Free",
    free: true,
    text: "Start from scratch in an ATS-friendly template and export a PDF.",
  },
];

const LINKS = [
  { label: "Pricing", href: ROUTES.PUBLIC.PRICING },
  { label: "Guides", href: ROUTES.PUBLIC.BLOG },
];

// Pages on the paper design, where the bar can blend into the page at the top.
// Older pages keep a solid bar so its ink stays readable on their own backgrounds.
const BLEND_AT_TOP = new Set<string>([ROUTES.PUBLIC.HOME, ROUTES.PUBLIC.ATS_CHECK, ROUTES.PUBLIC.PRICING, ROUTES.PUBLIC.BLOG, ROUTES.PUBLIC.FAQ, ROUTES.PUBLIC.HOW_IT_WORKS, ROUTES.PUBLIC.ABOUT, ROUTES.PUBLIC.CONTACT, ROUTES.PUBLIC.TERMS, ROUTES.PUBLIC.PRIVACY]);
const blendsAtTop = (path: string) => BLEND_AT_TOP.has(path) || path.startsWith(`${ROUTES.PUBLIC.BLOG}/`);

const ease = "cubic-bezier(0.2, 0.8, 0.2, 1)";

/* ---------------------------------------------------------------- bar */

const Header = styled.header<{ $solid: boolean; $sheet: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  padding-top: env(safe-area-inset-top, 0px);
  font-family: var(--rj-font);
  -webkit-font-smoothing: antialiased;
  transition: background 0.25s, box-shadow 0.25s;
  background: transparent;
  box-shadow: 0 1px 0 transparent;

  ${({ $solid }) =>
    $solid &&
    css`
      background: var(--rj-nav);
      box-shadow: 0 1px 0 var(--rj-line);
      backdrop-filter: saturate(1.6) blur(16px);
      -webkit-backdrop-filter: saturate(1.6) blur(16px);
    `}
  ${({ $sheet }) => $sheet && "background: var(--rj-paper); box-shadow: 0 1px 0 var(--rj-line);"}
`;

const Bar = styled.div`
  position: relative;
  max-width: 1240px;
  height: 60px;
  margin: 0 auto;
  padding: 0 max(20px, env(safe-area-inset-right, 0px)) 0 max(20px, env(safe-area-inset-left, 0px));
  display: flex;
  align-items: center;
  gap: 8px;

  @media (min-width: 640px) { padding: 0 40px; }

  /* A guide's reading bar takes over this row while you read (see GuideArticle). */
  transition: opacity 0.25s, transform 0.35s cubic-bezier(0.2, 0.8, 0.2, 1);
  html[data-reading="1"] & { opacity: 0; transform: translateY(8px); pointer-events: none; }
  @media (prefers-reduced-motion: reduce) { transition: none; }
`;

const Logo = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  margin-right: 18px;
  flex-shrink: 0;
  font-size: 18px;
  font-weight: 700;
  letter-spacing: -0.03em;
  color: var(--rj-ink);
  text-decoration: none;

  svg { width: 22px; height: 22px; }
  small { margin-left: -4px; font: 500 12px var(--rj-mono); letter-spacing: 0; color: var(--rj-ink-3); }
  &:hover { color: var(--rj-ink); }
  &:focus-visible { outline: 2px solid var(--rj-ink); outline-offset: 3px; border-radius: 6px; }

  [data-theme="dark"] & .logo-tile { stroke: rgba(255, 255, 255, 0.28); stroke-width: 1; }
`;

const Links = styled.nav`
  display: none;
  align-items: center;
  gap: 2px;

  @media (min-width: 1000px) { display: flex; }
`;

const pill = css`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  height: 36px;
  padding: 0 12px;
  border: 0;
  border-radius: 999px;
  background: none;
  font: 500 14px var(--rj-font);
  color: var(--rj-ink-2);
  text-decoration: none;
  cursor: pointer;
  transition: color 0.15s, background 0.15s;

  &:hover, &[aria-expanded="true"], &[aria-current="page"] { color: var(--rj-ink); background: color-mix(in srgb, var(--rj-ink) 6%, transparent); }
  &:focus-visible { outline: 2px solid var(--rj-ink); outline-offset: 2px; }
`;

const NavButton = styled.button`
  ${pill}
  svg { width: 10px; height: 10px; transition: transform 0.2s; }
  &[aria-expanded="true"] svg { transform: rotate(180deg); }
`;

const NavLink = styled(Link)`${pill}`;

const Right = styled.div<{ $sheet: boolean }>`
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: 6px;

  .login { display: none; @media (min-width: 640px) { display: inline-flex; } }
  .credits { display: none; @media (min-width: 640px) { display: inline-flex; } }
  .theme { display: none; @media (min-width: 1000px) { display: grid; } }

  /* One CTA at a time: while the sheet is open, its own CTA takes over. */
  ${({ $sheet }) =>
    $sheet &&
    css`
      .login, .credits { visibility: hidden; }
      .cta { opacity: 0; transform: scale(0.94); pointer-events: none; }
    `}
`;

const IconButton = styled.button`
  width: 36px;
  height: 36px;
  place-items: center;
  border: 0;
  border-radius: 50%;
  background: none;
  color: var(--rj-ink-2);
  cursor: pointer;

  svg { width: 17px; height: 17px; }
  &:hover { color: var(--rj-ink); background: color-mix(in srgb, var(--rj-ink) 6%, transparent); }
  &:focus-visible { outline: 2px solid var(--rj-ink); outline-offset: 2px; }
`;

const Cta = styled(Link)<{ $hidden?: boolean }>`
  height: 36px;
  padding: 0 16px;
  display: inline-flex;
  align-items: center;
  border-radius: 999px;
  white-space: nowrap;
  font: 600 14px var(--rj-font);
  color: var(--rj-btn-ink);
  background: var(--rj-btn);
  text-decoration: none;
  transition: opacity 0.2s, transform 0.2s;

  &:hover { color: var(--rj-btn-ink); }
  &:focus-visible { outline: 2px solid var(--rj-ink); outline-offset: 2px; }
  ${({ $hidden }) => $hidden && "opacity: 0; transform: scale(0.94); pointer-events: none;"}
`;

const Credits = styled(Link)`
  align-items: center;
  gap: 6px;
  height: 30px;
  padding: 0 11px;
  border-radius: 999px;
  box-shadow: inset 0 0 0 1px var(--rj-line);
  font: 600 12px var(--rj-mono);
  color: var(--rj-ink);
  white-space: nowrap;
  text-decoration: none;

  i { width: 7px; height: 7px; border-radius: 50%; background: var(--rj-hl); box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.15); }
  &:hover { color: var(--rj-ink); box-shadow: inset 0 0 0 1px var(--rj-ink-3); }
  &:focus-visible { outline: 2px solid var(--rj-ink); outline-offset: 2px; }
`;

const Burger = styled.button<{ $open: boolean }>`
  width: 40px;
  height: 40px;
  display: grid;
  place-items: center;
  border: 0;
  border-radius: 50%;
  background: none;
  color: var(--rj-ink);
  cursor: pointer;

  @media (min-width: 1000px) { display: none; }
  &:hover { background: color-mix(in srgb, var(--rj-ink) 6%, transparent); }
  &:focus-visible { outline: 2px solid var(--rj-ink); outline-offset: 2px; }

  span { position: relative; display: block; width: 18px; height: 12px; }
  span::before, span::after {
    content: "";
    position: absolute;
    left: 0;
    right: 0;
    height: 1.75px;
    border-radius: 2px;
    background: currentColor;
    transition: transform 0.3s ${ease}, top 0.3s ${ease};
    @media (prefers-reduced-motion: reduce) { transition: none; }
  }
  span::before { top: ${({ $open }) => ($open ? "5px" : "2px")}; transform: rotate(${({ $open }) => ($open ? 45 : 0)}deg); }
  span::after { top: ${({ $open }) => ($open ? "5px" : "8px")}; transform: rotate(${({ $open }) => ($open ? -45 : 0)}deg); }
`;

/* ---------------------------------------------------------------- tools panel */

const Scrim = styled.div<{ $open: boolean }>`
  position: fixed;
  inset: calc(60px + env(safe-area-inset-top, 0px)) 0 0;
  z-index: 999;
  background: rgba(13, 14, 16, 0.1);
  opacity: ${({ $open }) => ($open ? 1 : 0)};
  pointer-events: ${({ $open }) => ($open ? "auto" : "none")};
  transition: opacity 0.2s;

  [data-theme="dark"] & { background: rgba(0, 0, 0, 0.45); }
  @media (max-width: 999px) { display: none; }
`;

const Panel = styled.div<{ $open: boolean }>`
  position: absolute;
  top: 56px;
  left: 150px;
  width: 744px;
  display: grid;
  grid-template-columns: minmax(0, 1fr) 268px;
  gap: 8px;
  padding: 8px;
  border-radius: 22px;
  background: var(--rj-surface);
  box-shadow: 0 0 0 1px var(--rj-line), 0 30px 60px -28px rgba(0, 0, 0, 0.35);
  transform-origin: 80px 0;
  opacity: 0;
  visibility: hidden;
  transform: translateY(-6px) scale(0.985);
  transition: opacity 0.18s, transform 0.22s ${ease}, visibility 0s 0.22s;

  ${({ $open }) =>
    $open &&
    css`
      opacity: 1;
      visibility: visible;
      transform: none;
      transition: opacity 0.18s, transform 0.22s ${ease};
    `}

  @media (max-width: 999px) { display: none; }
  @media (prefers-reduced-motion: reduce) { transform: none; }
`;

const Rows = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: 2px;
  align-content: start;
`;

const Row = styled.li<{ $on: boolean }>`
  border-radius: 14px;
  background: ${({ $on }) => ($on ? "var(--rj-tile)" : "none")};
  transition: background 0.15s;

  .m {
    display: grid;
    grid-template-columns: minmax(0, 1fr) auto;
    gap: 4px 12px;
    align-items: center;
    padding: 14px 16px 0;
    color: var(--rj-ink);
    text-decoration: none;
    outline: none;

    &:last-child { padding-bottom: 14px; }
    &:focus-visible .t { text-decoration: underline; text-underline-offset: 3px; }
  }
  .t { font-size: 15.5px; font-weight: 600; letter-spacing: -0.015em; }
  .d { grid-column: 1 / -1; font-size: 13.5px; line-height: 1.45; color: var(--rj-ink-2); }

  .fr {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    margin: 9px 16px 14px;
    font-size: 13px;
    font-weight: 500;
    color: var(--rj-ink);
    text-decoration: none;
    outline: none;

    i { font-style: normal; transition: transform 0.2s; }
    &:hover i { transform: translateX(3px); }
    &:focus-visible { text-decoration: underline; text-underline-offset: 3px; }
  }
`;

const Tag = styled.span<{ $free?: boolean }>`
  justify-self: end;
  padding: 4px 7px;
  border-radius: 6px;
  font: 700 10px/1 var(--rj-mono);
  letter-spacing: 0.07em;
  text-transform: uppercase;
  white-space: nowrap;
  color: ${({ $free }) => ($free ? "#0d0e10" : "var(--rj-ink-2)")};
  background: ${({ $free }) => ($free ? "var(--rj-hl)" : "none")};
  box-shadow: ${({ $free }) => ($free ? "none" : "inset 0 0 0 1.5px var(--rj-line)")};
`;

const PanelFoot = styled.div`
  grid-column: 1 / -1;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 8px 16px;
  padding: 12px 14px 8px;
  border-top: 1px solid var(--rj-line);
  font-size: 13px;
  color: var(--rj-ink-2);

  a { color: var(--rj-ink); font-weight: 600; text-decoration: none; border-bottom: 1px solid var(--rj-line); }
  a:hover { color: var(--rj-ink); border-color: var(--rj-ink); }
  a:focus-visible { outline: 2px solid var(--rj-ink); outline-offset: 2px; border-radius: 3px; }
`;

const Preview = styled.div`
  position: relative;
  min-height: 300px;
  border-radius: 16px;
  overflow: clip;
  background: #1a1b1f;

  [data-theme="dark"] & { background: #222328; }
`;

const Pv = styled.div<{ $on: boolean }>`
  position: absolute;
  inset: 0;
  display: grid;
  align-content: start;
  gap: 10px;
  padding: 16px;
  color: #d9dbd4;
  opacity: ${({ $on }) => ($on ? 1 : 0)};
  transform: translateY(${({ $on }) => ($on ? 0 : 4)}px);
  transition: opacity 0.2s, transform 0.25s ${ease};

  .h { display: flex; justify-content: space-between; align-items: center; font: 600 10px/1 var(--rj-mono); letter-spacing: 0.08em; text-transform: uppercase; color: #81858e; }
  .h b { padding: 4px 6px; border-radius: 5px; font-weight: 600; color: #d9dbd4; background: rgba(255, 255, 255, 0.07); }
  pre { margin: 0; overflow: hidden; white-space: pre; font: 500 11px/1.95 var(--rj-mono); }
  .ok { color: #5cd69a; }
  .no { color: #ff7468; }
  .dim { color: #81858e; }

  .beam {
    position: absolute;
    left: 0;
    right: 0;
    top: 46px;
    height: 2px;
    background: #ffe14d;
    box-shadow: 0 0 14px 3px rgba(255, 225, 77, 0.45);
    animation: ${({ $on }) => ($on ? "rj-nav-beam 3.2s cubic-bezier(0.45, 0, 0.55, 1) infinite" : "none")};
    @media (prefers-reduced-motion: reduce) { animation: none; }
  }
  @keyframes rj-nav-beam { 0%, 100% { top: 46px; } 50% { top: 220px; } }

  .score { display: flex; align-items: center; gap: 10px; font-size: 26px; font-weight: 700; letter-spacing: -0.04em; color: #f2f2ef; }
  .score s { font-weight: 600; color: #81858e; text-decoration-thickness: 2px; }
  .score em { margin-left: auto; font: 500 10.5px var(--rj-mono); font-style: normal; letter-spacing: 0.06em; text-transform: uppercase; color: #81858e; }
  .big { font-size: 30px; font-weight: 700; letter-spacing: -0.04em; color: #f2f2ef; }
  .cap { font: 500 10.5px/1.4 var(--rj-mono); letter-spacing: 0.06em; text-transform: uppercase; color: #81858e; }

  .chips { display: flex; flex-wrap: wrap; gap: 6px; }
  .chips span { padding: 5px 8px; border-radius: 6px; font: 500 11px/1 var(--rj-mono); color: #0d0e10; background: #ffe14d; }
  .chips span.miss { color: #ff7468; background: none; box-shadow: inset 0 0 0 1px rgba(255, 116, 104, 0.5); }

  ul { list-style: none; margin: 4px 0 0; padding: 12px 0 0; display: grid; gap: 8px; border-top: 1px solid rgba(255, 255, 255, 0.08); font: 500 11.5px/1.4 var(--rj-mono); }
  li::before { content: "+ "; color: #ffe14d; }

  .doc { display: grid; gap: 7px; padding: 14px; border-radius: 10px; background: #fbfbf9; }
  .doc i { display: block; height: 5px; border-radius: 3px; background: #dadbd6; }
  .doc i.hd { width: 38%; height: 6px; margin-top: 4px; background: #9c9fa6; }
  .doc p { margin: 0; font: 500 10.5px/1.45 var(--rj-font); color: #22242a; }
  .doc mark { padding: 0 2px; border-radius: 2px; color: #0d0e10; background: #ffe14d; }
`;

/* ---------------------------------------------------------------- sheet */

const Sheet = styled.div<{ $open: boolean }>`
  position: fixed;
  top: calc(60px + env(safe-area-inset-top, 0px));
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 999;
  display: flex;
  overflow: auto;
  overscroll-behavior: contain;
  padding: 8px max(20px, env(safe-area-inset-right, 0px)) calc(20px + env(safe-area-inset-bottom, 0px)) max(20px, env(safe-area-inset-left, 0px));
  background: var(--rj-paper);
  font-family: var(--rj-font);
  opacity: ${({ $open }) => ($open ? 1 : 0)};
  visibility: ${({ $open }) => ($open ? "visible" : "hidden")};
  transition: opacity 0.2s, visibility 0s ${({ $open }) => ($open ? "0s" : "0.2s")};

  @media (min-width: 640px) { padding: 12px 40px 32px; }
  @media (min-width: 1000px) { display: none; }

  .in { width: 100%; max-width: 560px; margin: 0 auto; display: flex; flex-direction: column; }

  ul { list-style: none; margin: 0; padding: 0; }
  li {
    border-bottom: 1px solid var(--rj-line);
    opacity: ${({ $open }) => ($open ? 1 : 0)};
    transform: translateY(${({ $open }) => ($open ? 0 : -6)}px);
    transition: opacity 0.3s, transform 0.35s ${ease};
    transition-delay: calc(var(--i) * 40ms);
  }
  .m { display: grid; grid-template-columns: minmax(0, 1fr) auto; gap: 12px; align-items: center; padding: 15px 2px 16px; color: var(--rj-ink); text-decoration: none; }
  li:has(.fr) .m { padding-bottom: 8px; }
  .t { font-size: 25px; font-weight: 700; line-height: 1.1; letter-spacing: -0.035em; }
  .fr { display: inline-flex; align-items: center; gap: 8px; margin: 0 2px 16px; font-size: 14px; font-weight: 500; color: var(--rj-ink); text-decoration: none; }
  .fr i { font-style: normal; }

  .sub, .bottom {
    opacity: ${({ $open }) => ($open ? 1 : 0)};
    transition: opacity 0.3s 0.2s;
  }
  .sub { display: flex; flex-wrap: wrap; gap: 4px 22px; padding: 18px 2px 0; }
  .sub a { padding: 6px 0; font-size: 17px; font-weight: 500; color: var(--rj-ink-2); text-decoration: none; }
  .bottom { margin-top: auto; padding-top: 24px; display: grid; gap: 12px; @media (min-width: 640px) { margin-top: 0; padding-top: 48px; max-width: 420px; } }
  .row { display: flex; align-items: center; justify-content: space-between; gap: 12px; font-size: 14px; color: var(--rj-ink-2); }
  .row a { font-weight: 600; color: var(--rj-ink); text-decoration: none; }

  a:focus-visible, button:focus-visible { outline: 2px solid var(--rj-ink); outline-offset: 2px; border-radius: 8px; }
  @media (prefers-reduced-motion: reduce) { li, .sub, .bottom { transition: none; transform: none; } }
`;

const Seg = styled.span`
  display: inline-flex;
  gap: 2px;
  padding: 3px;
  border-radius: 999px;
  background: color-mix(in srgb, var(--rj-ink) 7%, transparent);

  button { height: 30px; padding: 0 14px; border: 0; border-radius: 999px; background: none; font: 500 13px var(--rj-font); color: var(--rj-ink-2); cursor: pointer; }
  button[aria-pressed="true"] { color: var(--rj-ink); background: var(--rj-surface); box-shadow: 0 1px 2px rgba(0, 0, 0, 0.12); }
`;

const Big = styled(Link)<{ $ghost?: boolean }>`
  height: ${({ $ghost }) => ($ghost ? "48px" : "52px")};
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  border-radius: 999px;
  font: 600 ${({ $ghost }) => ($ghost ? "15px" : "16px")} var(--rj-font);
  text-decoration: none;
  color: ${({ $ghost }) => ($ghost ? "var(--rj-ink)" : "var(--rj-btn-ink)")};
  background: ${({ $ghost }) => ($ghost ? "none" : "var(--rj-btn)")};
  box-shadow: ${({ $ghost }) => ($ghost ? "inset 0 0 0 1px var(--rj-line)" : "none")};

  &:hover { color: ${({ $ghost }) => ($ghost ? "var(--rj-ink)" : "var(--rj-btn-ink)")}; }
  svg { width: 15px; height: 15px; }
`;

/* ---------------------------------------------------------------- icons */

export const LogoMark = () => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <rect x="2.5" y="2.5" width="19" height="19" rx="5.5" fill="#0D0E10" className="logo-tile" />
    <path d="M7 12.5l3.2 3.2L17 8.8" stroke="#FFE14D" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const Chevron = () => (
  <svg viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M2 3.5l3 3 3-3" />
  </svg>
);

const Arrow = () => (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M3 8h10M9 4l4 4-4 4" />
  </svg>
);

const Sun = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
  </svg>
);

const Moon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z" />
  </svg>
);

/* ---------------------------------------------------------------- previews */

function Previews({ on }: { on: Tool["key"] }) {
  return (
    <Preview aria-hidden="true">
      <Pv $on={on === "opt"}>
        <div className="h"><span>maya_chen_resume.pdf</span><b>ATS reads</b></div>
        <pre>
          <span className="ok">✓</span> name: Maya Chen{"\n"}
          <span className="dim">  headline: &quot;Student&quot;</span>{"\n"}
          <span className="no">✕</span> &quot;PROFILE EXPERIENCE&quot; merged{"\n"}
          <span className="no">✕</span> two columns read side by side{"\n"}
          <span className="no">✕</span> no bullet points{"\n"}
          <span className="ok">✓</span> section: skills{"\n"}
          <span className="ok">✓</span> section: education{"\n"}
          <span className="no">✕</span> no LinkedIn
        </pre>
        <div className="score"><s>63</s><span>→ 87</span><em>after the fix</em></div>
        <span className="beam" />
      </Pv>
      <Pv $on={on === "match"}>
        <div className="h"><span>Data Analyst Intern</span><b>Job match</b></div>
        <div><div className="big">3 / 6</div><div className="cap">Keywords from the post</div></div>
        <div className="chips"><span>SQL</span><span>Python</span><span>Tableau</span><span className="miss">predictive</span></div>
        <ul><li>Resume rewritten for this post</li><li>Role ideas from your experience</li><li>Interview prep for this job</li></ul>
      </Pv>
      <Pv $on={on === "cover"}>
        <div className="h"><span>Cover letter</span><b>Professional</b></div>
        <div className="doc"><p>Dear Hiring Manager,</p><i /><i style={{ width: "88%" }} /><i style={{ width: "94%" }} /><i style={{ width: "60%" }} /><i style={{ marginTop: 8 }} /><i style={{ width: "80%" }} /><i style={{ width: "40%" }} /></div>
        <pre className="dim">Written from your match report.{"\n"}No new facts added.</pre>
      </Pv>
      <Pv $on={on === "build"}>
        <div className="h"><span>New resume</span><b>Builder</b></div>
        <div className="doc"><p><b>YOUR NAME</b></p><i style={{ width: "56%" }} /><i className="hd" /><i /><i style={{ width: "84%" }} /><i className="hd" /><i style={{ width: "70%" }} /><i style={{ width: "90%" }} /></div>
        <pre className="dim">One column. Standard headings.{"\n"}Download as PDF.</pre>
      </Pv>
    </Preview>
  );
}

/* ---------------------------------------------------------------- component */

export function Navbar() {
  const pathname = usePathname();
  const { user, loading } = useAuth();
  const { mode, setMode, toggleMode } = useTheme();
  const [open, setOpen] = useState<"tools" | "menu" | null>(null);
  const [preview, setPreview] = useState<Tool["key"]>("opt");
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [ctaHidden, setCtaHidden] = useState(false);
  const [balance, setBalance] = useState<{ credits: number; pro: boolean } | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const toolsButton = useRef<HTMLButtonElement>(null);
  const burger = useRef<HTMLButtonElement>(null);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    const sync = () => setScrolled(window.scrollY > 8);
    sync();
    window.addEventListener("scroll", sync, { passive: true });
    return () => window.removeEventListener("scroll", sync);
  }, []);

  // Close menus when the route changes.
  useEffect(() => setOpen(null), [pathname]);

  // The sheet covers the page: stop the page scrolling under it.
  useEffect(() => {
    if (open !== "menu") return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      (open === "menu" ? burger : toolsButton).current?.focus();
      setOpen(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  // Hide the bar's CTA while the page shows its own (e.g. the /ats-check drop zone).
  useEffect(() => {
    setCtaHidden(false);
    const target = document.querySelector("[data-nav-cta-hide]");
    if (!target || !("IntersectionObserver" in window)) return;
    const io = new IntersectionObserver(([entry]) => setCtaHidden(entry.isIntersecting), { rootMargin: "-60px 0px 0px 0px" });
    io.observe(target);
    return () => io.disconnect();
  }, [pathname]);

  // Marketing pages don't load the credits context; fetch the balance for the pill.
  useEffect(() => {
    if (!user) { setBalance(null); return; }
    let live = true;
    fetch("/api/user/credits")
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => { if (live && d) setBalance({ credits: d.credits ?? 0, pro: !!d.hasSubscription }); })
      .catch(() => {});
    return () => { live = false; };
  }, [user]);

  const openTools = useCallback(() => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpen("tools");
  }, []);
  const leaveTools = useCallback(() => {
    closeTimer.current = setTimeout(() => setOpen((o) => (o === "tools" ? null : o)), 160);
  }, []);

  const close = () => setOpen(null);
  const ready = mounted && !loading;
  const balanceLabel = balance ? (balance.pro ? "Pro" : `${balance.credits} ${balance.credits === 1 ? "credit" : "credits"}`) : null;
  const themeLabel = mode === "dark" ? "Switch to light theme" : "Switch to dark theme";

  return (
    <>
      <Header $solid={scrolled || open === "tools" || !blendsAtTop(pathname ?? "")} $sheet={open === "menu"}>
        <Bar>
          <Logo href={ROUTES.PUBLIC.HOME} aria-label="Rejectly home" onClick={close}>
            <LogoMark />
            Rejectly<small>.pro</small>
          </Logo>

          <Links aria-label="Main">
            <NavButton
              ref={toolsButton}
              type="button"
              aria-expanded={open === "tools"}
              aria-controls="rj-tools"
              onClick={() => setOpen(open === "tools" ? null : "tools")}
              onMouseEnter={openTools}
              onMouseLeave={leaveTools}
            >
              Tools <Chevron />
            </NavButton>
            {LINKS.map((l) => (
              <NavLink key={l.href} href={l.href} aria-current={pathname === l.href ? "page" : undefined}>
                {l.label}
              </NavLink>
            ))}
          </Links>

          {/* Kept in the DOM while closed, so every page links to each tool. */}
          <Panel id="rj-tools" role="region" aria-label="Tools" $open={open === "tools"} onMouseEnter={openTools} onMouseLeave={leaveTools}>
            <Rows>
              {TOOLS.map((t) => (
                <Row key={t.key} $on={preview === t.key} onMouseEnter={() => setPreview(t.key)} onFocus={() => setPreview(t.key)}>
                  <Link className="m" href={t.href} onClick={close} tabIndex={open === "tools" ? 0 : -1}>
                    <span className="t">{t.title}</span>
                    <Tag $free={t.free}>{t.price}</Tag>
                    <span className="d">{t.text}</span>
                  </Link>
                  {t.freeLink && (
                    <Link className="fr" href={t.freeLink.href} onClick={close} tabIndex={open === "tools" ? 0 : -1}>
                      <Tag $free>Free</Tag>
                      {t.freeLink.label} <i aria-hidden="true">→</i>
                    </Link>
                  )}
                </Row>
              ))}
            </Rows>
            <Previews on={preview} />
            <PanelFoot>
              <span>
                Applying a lot? <Link href={ROUTES.PUBLIC.PRICING} onClick={close} tabIndex={open === "tools" ? 0 : -1}>Pro: 150 runs a month</Link>
              </span>
              <Link href={ROUTES.PUBLIC.PRICING} onClick={close} tabIndex={open === "tools" ? 0 : -1}>See pricing</Link>
            </PanelFoot>
          </Panel>

          <Right $sheet={open === "menu"}>
            <IconButton className="theme" type="button" onClick={toggleMode} aria-label={themeLabel} title={themeLabel}>
              {mode === "dark" ? <Sun /> : <Moon />}
            </IconButton>
            {!ready ? (
              <span style={{ width: 120, height: 36 }} />
            ) : user ? (
              <>
                {balanceLabel && (
                  <Credits className="credits" href={ROUTES.PUBLIC.PRICING} title={balance?.pro ? "150 runs a month" : "Credits never expire"}>
                    <i aria-hidden="true" />
                    {balanceLabel}
                  </Credits>
                )}
                <Cta className="cta" href={ROUTES.APP.DASHBOARD}>Dashboard</Cta>
              </>
            ) : (
              <>
                <NavLink className="login" href={ROUTES.AUTH.LOGIN}>Log in</NavLink>
                <Cta className="cta" href={ROUTES.PUBLIC.ATS_CHECK} $hidden={ctaHidden} tabIndex={ctaHidden ? -1 : undefined} aria-hidden={ctaHidden || undefined}>
                  Free ATS scan
                </Cta>
              </>
            )}
            <Burger
              ref={burger}
              type="button"
              $open={open === "menu"}
              aria-expanded={open === "menu"}
              aria-controls="rj-menu"
              aria-label={open === "menu" ? "Close menu" : "Open menu"}
              onClick={() => setOpen(open === "menu" ? null : "menu")}
            >
              <span />
            </Burger>
          </Right>
        </Bar>
      </Header>

      <Scrim $open={open === "tools"} onClick={close} aria-hidden="true" />

      <Sheet id="rj-menu" $open={open === "menu"} aria-label="Menu" aria-hidden={open !== "menu"} inert={open !== "menu"}>
        <div className="in">
          <ul>
            {TOOLS.map((t, i) => (
              <li key={t.key} style={{ "--i": i } as React.CSSProperties}>
                <Link className="m" href={t.href} onClick={close}>
                  <span className="t">{t.title}</span>
                  <Tag $free={t.free}>{t.price}</Tag>
                </Link>
                {t.freeLink && (
                  <Link className="fr" href={t.freeLink.href} onClick={close}>
                    <Tag $free>Free</Tag>
                    {t.freeLink.short} <i aria-hidden="true">→</i>
                  </Link>
                )}
              </li>
            ))}
          </ul>
          <div className="sub">
            <Link href={ROUTES.PUBLIC.PRICING} onClick={close}>Pricing</Link>
            <Link href={ROUTES.PUBLIC.BLOG} onClick={close}>Guides</Link>
            <Link href={ROUTES.PUBLIC.FAQ} onClick={close}>FAQ</Link>
          </div>
          <div className="bottom">
            <div className="row">
              <span>Appearance</span>
              <Seg role="group" aria-label="Appearance">
                <button type="button" aria-pressed={mode === "light"} onClick={() => setMode("light")}>Light</button>
                <button type="button" aria-pressed={mode === "dark"} onClick={() => setMode("dark")}>Dark</button>
              </Seg>
            </div>
            {ready && user ? (
              <>
                {balanceLabel && (
                  <div className="row">
                    <span>{balance?.pro ? "Pro · 150 runs a month" : `${balanceLabel} · never expire`}</span>
                    {!balance?.pro && <Link href={ROUTES.PUBLIC.PRICING} onClick={close}>Buy more</Link>}
                  </div>
                )}
                <Big href={ROUTES.APP.DASHBOARD} onClick={close}>Dashboard</Big>
              </>
            ) : (
              <>
                <Big $ghost href={ROUTES.AUTH.LOGIN} onClick={close}>Log in</Big>
                <Big href={ROUTES.PUBLIC.ATS_CHECK} onClick={close}>Scan my resume free <Arrow /></Big>
              </>
            )}
          </div>
        </div>
      </Sheet>
    </>
  );
}

export default Navbar;
