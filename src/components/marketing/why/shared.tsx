"use client";

import { useEffect, useRef, type RefObject } from "react";
import styled from "styled-components";

/*
 * Shared pieces for the "Why it happens" bento.
 * Every tile renders its finished frame on the server. On the client, a tile with
 * motion "arms" itself (resets to its first frame) and plays once when it scrolls
 * into view. With reduced motion it stays on the finished frame.
 */

export const PHONE = "(max-width: 639px)";
export const TABLET_UP = "(min-width: 640px)";
export const DESKTOP_UP = "(min-width: 1000px)";

export const Tile = styled.article`
  position: relative;
  container-type: inline-size;
  min-width: 0;
  display: grid;
  gap: 20px;
  align-content: start;
  padding: 22px;
  border-radius: 26px;
  background: var(--rj-tile);
  overflow: hidden;

  @media ${TABLET_UP} {
    padding: 28px;
  }

  @media ${DESKTOP_UP} {
    padding: 32px;
  }
`;

export const TileCopy = styled.div`
  max-width: 32em;
  padding-right: 40px;

  h3 {
    margin: 0;
    font-size: 22px;
    font-weight: 700;
    line-height: 1.12;
    letter-spacing: -0.028em;
    text-wrap: balance;
    color: var(--rj-ink);
  }

  p {
    margin: 6px 0 0;
    font-size: 15px;
    line-height: 1.5;
    color: var(--rj-ink-2);
  }
`;

const ReplayButton = styled.button<{ $visible: boolean }>`
  position: absolute;
  top: 18px;
  right: 18px;
  width: 32px;
  height: 32px;
  display: grid;
  place-items: center;
  border-radius: 50%;
  background: color-mix(in srgb, var(--rj-ink) 7%, transparent);
  color: var(--rj-ink-2);
  opacity: ${({ $visible }) => ($visible ? 1 : 0)};
  pointer-events: ${({ $visible }) => ($visible ? "auto" : "none")};
  transition: opacity 0.3s, color 0.15s;

  &:hover {
    color: var(--rj-ink);
  }

  &:focus-visible {
    outline: 2px solid var(--rj-ink);
    outline-offset: 2px;
  }

  svg {
    width: 15px;
    height: 15px;
  }
`;

export function Replay({ visible, onClick }: { visible: boolean; onClick: () => void }) {
  return (
    <ReplayButton type="button" $visible={visible} onClick={onClick} aria-label="Replay animation" tabIndex={visible ? 0 : -1}>
      <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M2.5 8a5.5 5.5 0 1 0 1.7-4" />
        <path d="M2.5 2.5v3h3" />
      </svg>
    </ReplayButton>
  );
}

/** Calls `onSeen` once, the first time `threshold` of the element is visible. */
export function useSeenOnce(ref: RefObject<Element | null>, onSeen: () => void, enabled: boolean, threshold = 0.5) {
  const cb = useRef(onSeen);
  cb.current = onSeen;

  useEffect(() => {
    const el = ref.current;
    if (!enabled || !el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          io.disconnect();
          cb.current();
        }
      },
      { threshold }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [ref, enabled, threshold]);
}

export interface Timeline {
  clear: () => void;
  at: (ms: number, fn: () => void) => void;
  /** Runs `step(progress)` on animation frames for `ms` (linear 0..1). */
  tween: (ms: number, step: (p: number) => void, done?: () => void) => void;
}

/** A timer bag that is cleared on replay and on unmount. The returned object is stable. */
export function useTimeline(): Timeline {
  const ref = useRef<Timeline | null>(null);
  if (!ref.current) {
    let timers: ReturnType<typeof setTimeout>[] = [];
    let frames: number[] = [];
    ref.current = {
      clear: () => {
        timers.forEach(clearTimeout);
        frames.forEach(cancelAnimationFrame);
        timers = [];
        frames = [];
      },
      at: (ms, fn) => {
        timers.push(setTimeout(fn, ms));
      },
      tween: (ms, step, done) => {
        const t0 = performance.now();
        const tick = (t: number) => {
          const p = Math.min(1, (t - t0) / ms);
          step(p);
          if (p < 1) frames.push(requestAnimationFrame(tick));
          else done?.();
        };
        frames.push(requestAnimationFrame(tick));
      },
    };
  }
  const tl = ref.current;
  useEffect(() => tl.clear, [tl]);
  return tl;
}
