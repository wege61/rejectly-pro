"use client";

import { useEffect, useState } from "react";

/*
 * Tiny motion helpers for the tool panels. A panel is "played" by giving it a new
 * playKey; playKey 0 means "show the finished frame" (server render, reduced motion,
 * or a panel that isn't on stage).
 */

/** Steps 0..times.length on a timeline; returns the last step when not animating. */
export function useStep(times: number[], playKey: number, reduce: boolean) {
  const final = times.length;
  const [step, setStep] = useState(final);
  const key = times.join(",");

  useEffect(() => {
    if (!playKey || reduce) {
      setStep(final);
      return;
    }
    setStep(0);
    const ids = key.split(",").map((ms, i) => setTimeout(() => setStep(i + 1), Number(ms)));
    return () => ids.forEach(clearTimeout);
  }, [playKey, reduce, final, key]);

  return step;
}

/** Types `text` once `started` turns true. Without animation, returns the full text. */
export function useTyped(text: string, started: boolean, animate: boolean) {
  const [count, setCount] = useState(text.length);

  useEffect(() => {
    if (!animate) {
      setCount(text.length);
      return;
    }
    if (!started) {
      setCount(0);
      return;
    }
    let k = 0;
    const speed = Math.max(14, Math.min(45, 1800 / text.length));
    const id = setInterval(() => {
      k += 1;
      setCount(k);
      if (k >= text.length) clearInterval(id);
    }, speed);
    return () => clearInterval(id);
  }, [text, started, animate]);

  return { shown: text.slice(0, count), typing: animate && started && count < text.length };
}

/** Counts up to `target` once `started` turns true. */
export function useCount(target: number, started: boolean, animate: boolean) {
  const [value, setValue] = useState(target);

  useEffect(() => {
    if (!animate) {
      setValue(target);
      return;
    }
    if (!started) {
      setValue(0);
      return;
    }
    const t0 = performance.now();
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min(1, (t - t0) / 1100);
      setValue(Math.round(target * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, started, animate]);

  return value;
}
