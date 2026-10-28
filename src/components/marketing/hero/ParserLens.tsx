"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import styled, { css, keyframes } from "styled-components";
import {
  COMPACT_ISSUE_COUNT,
  COMPACT_ROWS,
  FULL_ROWS,
  ISSUE_COUNT,
  KEYWORDS_AFTER,
  SCORE,
  type LensRow,
  type LensState,
} from "./parserLensRows";

/*
 * Parser Lens: the hero's signature demo.
 * Desktop/tablet: a draggable lens splits each résumé line into "You see" (left)
 * and "ATS reads" (right). Phone: a curated card where press-and-hold (or the
 * switch) X-rays the whole card into the ATS view.
 * Both variants are in the markup and swapped by a media query, so the card's
 * height never jumps during hydration.
 */

const PHONE_QUERY = "(max-width: 639px)";
const REST_POS = 62;
const RING = 2 * Math.PI * 15;

// ─── Card ────────────────────────────────────────────────────────────────────
const Card = styled.div`
  min-width: 0;
  background: var(--rj-surface);
  border: 1px solid var(--rj-line);
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 1px 0 var(--rj-line), var(--rj-shadow);
  font-family: var(--rj-font);
`;

const Top = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 14px;
  border-bottom: 1px solid var(--rj-line);
`;

const File = styled.div`
  flex: 1;
  min-width: 0;
  font: 500 12px var(--rj-mono);
  color: var(--rj-ink-2);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  b {
    color: var(--rj-ink);
    font-weight: 500;
  }
`;

const Score = styled.div<{ $after: boolean }>`
  display: flex;
  align-items: center;
  gap: 8px;
  flex: none;

  svg {
    width: 32px;
    height: 32px;
    transform: rotate(-90deg);
  }

  .track {
    fill: none;
    stroke: var(--rj-line);
    stroke-width: 3.5;
  }

  .bar {
    fill: none;
    stroke: ${({ $after }) => ($after ? "var(--rj-pass)" : "var(--rj-pen)")};
    stroke-width: 3.5;
    stroke-linecap: round;
    transition: stroke-dashoffset 0.9s cubic-bezier(0.4, 0, 0.2, 1), stroke 0.4s;
  }

  b {
    display: block;
    min-width: 2ch;
    font-size: 20px;
    font-weight: 600;
    line-height: 1;
    letter-spacing: -0.03em;
    font-variant-numeric: tabular-nums;
    color: var(--rj-ink);
  }

  small {
    display: block;
    margin-top: 3px;
    font: 500 10px var(--rj-mono);
    letter-spacing: 0.05em;
    text-transform: uppercase;
    color: var(--rj-ink-3);
  }

  @media (prefers-reduced-motion: reduce) {
    .bar { transition: none; }
  }
`;

// ─── Lens ────────────────────────────────────────────────────────────────────
const lensIntro = keyframes`
  from { --rj-lens-pos: 100%; }
  to { --rj-lens-pos: ${REST_POS}%; }
`;

const rowIn = keyframes`
  from { opacity: 0.15; transform: translateY(3px); }
`;

const pulse = keyframes`
  50% { box-shadow: 0 0 0 6px rgba(255, 225, 77, 0); }
`;

const Lens = styled.div<{ $intro: boolean; $swapping: boolean }>`
  --rj-lens-pos: ${REST_POS}%;
  --rh: clamp(15px, 3.5cqw, 26px);
  --pad-top: calc(var(--rh) * 1.7);
  position: relative;
  container-type: inline-size;
  overflow: hidden;
  user-select: none;
  -webkit-user-select: none;

  /* One intro moment: the lens sweeps in from the right edge (needs @property, set in app/layout). */
  ${({ $intro }) =>
    $intro &&
    css`
      animation: ${lensIntro} 1.3s cubic-bezier(0.65, 0, 0.35, 1) 0.7s backwards;
    `}

  ${({ $swapping }) =>
    $swapping &&
    css`
      .r { animation: ${rowIn} 0.45s cubic-bezier(0.3, 0, 0.2, 1) both; animation-delay: calc(var(--i) * 28ms); }
    `}

  @media (prefers-reduced-motion: reduce) {
    animation: none;
    .r { animation: none; }
  }

  .variant-compact { display: none; }

  @media ${PHONE_QUERY} {
    --rh: 24px;
    --pad-top: 44px;
    touch-action: pan-y;
    -webkit-touch-callout: none;
    cursor: pointer;
    animation: none;

    .variant-full { display: none; }
    .variant-compact { display: block; }
  }
`;

const Layer = styled.div`
  padding: var(--pad-top) 0 calc(var(--rh) * 0.8);

  @media ${PHONE_QUERY} {
    padding-bottom: 12px;
  }
`;

const HumanLayer = styled(Layer)<{ $before: boolean }>`
  position: relative;
  color: var(--rj-doc-ink);
  font-size: clamp(8.6px, 2.1cqw, 14.5px);
  background: ${({ $before }) =>
    $before
      ? /* Canva-style template: peach header band, teal sidebar. */
        "linear-gradient(180deg, #F6DCCB 0 calc(var(--pad-top) + var(--rh) * 4.15), transparent 0), linear-gradient(90deg, var(--rj-doc) 0 68%, #2F5D62 68%)"
      : "var(--rj-doc)"};

  .r {
    padding: 0 6%;
    /* Text dissolves as it reaches the scanner line instead of being cut mid-word. */
    -webkit-mask-image: linear-gradient(90deg, #000 calc(var(--rj-lens-pos) - 56px), transparent calc(var(--rj-lens-pos) - 4px));
    mask-image: linear-gradient(90deg, #000 calc(var(--rj-lens-pos) - 56px), transparent calc(var(--rj-lens-pos) - 4px));
  }

  .r.two {
    display: grid;
    grid-template-columns: 68% 1fr;
    padding: 0;
  }

  .r.two > span { overflow: hidden; text-overflow: ellipsis; }
  .r.two > span:first-child { padding: 0 4% 0 6%; }
  .r.two > span:last-child { padding: 0 6% 0 7%; color: #DCE2EC; font-size: 0.9em; }
  .r.two > span:last-child .h { color: #FFFFFF; }

  .name { font-size: 2.05em; font-weight: 700; letter-spacing: -0.035em; }
  .spaced { font-size: 1.15em; font-weight: 700; letter-spacing: 0.32em; white-space: nowrap; color: #7A3E2A; }
  .dots { margin-left: 0.4em; letter-spacing: 0.1em; color: #F3C969; }
  .h { font-size: 0.8em; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase; }
  .muted { color: #6A6E76; }
  .weak {
    color: #B02920;
    text-decoration: underline wavy var(--rj-pen);
    text-decoration-thickness: 1px;
    text-underline-offset: 2px;
  }
  .kw { padding: 0 0.12em; background: linear-gradient(transparent 14%, #FFE14D 14%, #FFE14D 88%, transparent 88%); }
  .num { font-weight: 700; }
  /* the candidate's own answers to the metric questions */
  .ans { text-decoration: underline dotted; text-decoration-thickness: 1.5px; text-underline-offset: 3px; }

  @media ${PHONE_QUERY} {
    font-size: 13.5px;
    background: ${({ $before }) =>
      $before ? "linear-gradient(180deg, #F6DCCB 0 calc(var(--pad-top) + var(--rh) * 1.7), var(--rj-doc) 0)" : "var(--rj-doc)"};

    .r { -webkit-mask-image: none; mask-image: none; }
  }
`;

const AtsLayer = styled(Layer)`
  position: absolute;
  inset: 0;
  background: var(--rj-term);
  color: var(--rj-term-ink);
  font-family: var(--rj-mono);
  font-size: clamp(8.2px, 1.95cqw, 13px);
  clip-path: inset(0 0 0 var(--rj-lens-pos));
  box-shadow: inset 14px 0 18px -14px rgba(0, 0, 0, 0.6);

  .r { padding: 0 12px 0 calc(var(--rj-lens-pos) + 16px); }
  .dim { color: var(--rj-term-dim); }
  .bad { color: var(--rj-term-fail); }
  .ok { color: var(--rj-term-pass); }
  .q { color: #B5B8B0; }

  @media ${PHONE_QUERY} {
    font-size: 12px;
    box-shadow: none;
    clip-path: inset(0 100% 0 0);
    transition: clip-path 0.42s cubic-bezier(0.6, 0, 0.2, 1);

    .r { padding: 0 6%; }

    [data-xray="true"] & { clip-path: inset(0); }
  }

  @media ${PHONE_QUERY} and (prefers-reduced-motion: reduce) {
    transition: none;
  }
`;

const Row = styled.div<{ $tall?: boolean }>`
  height: ${({ $tall }) => ($tall ? "calc(var(--rh) * 2)" : "var(--rh)")};
  line-height: ${({ $tall }) => ($tall ? "calc(var(--rh) * 2)" : "var(--rh)")};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const Tag = styled.span<{ $side: "l" | "r"; $hidden: boolean }>`
  position: absolute;
  top: calc(var(--rh) * 0.45);
  ${({ $side }) => ($side === "l" ? "left: 10px;" : "right: 10px;")}
  z-index: 3;
  padding: 5px 7px;
  border-radius: 5px;
  font: 600 10px/1 var(--rj-mono);
  letter-spacing: 0.07em;
  text-transform: uppercase;
  pointer-events: none;
  opacity: ${({ $hidden }) => ($hidden ? 0 : 1)};
  transition: opacity 0.2s;
  background: ${({ $side }) => ($side === "l" ? "rgba(255, 255, 255, 0.88)" : "rgba(255, 255, 255, 0.1)")};
  color: ${({ $side }) => ($side === "l" ? "#4A4D55" : "#D9DBD4")};
  box-shadow: ${({ $side }) => ($side === "l" ? "0 0 0 1px rgba(13, 14, 16, 0.08)" : "none")};

  @media ${PHONE_QUERY} {
    display: none;
  }
`;

const Handle = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  left: var(--rj-lens-pos);
  z-index: 4;
  width: 44px;
  margin-left: -22px;
  display: grid;
  place-items: center;
  cursor: ew-resize;
  touch-action: pan-y;
  outline: none;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    bottom: 0;
    left: 50%;
    width: 2px;
    margin-left: -1px;
    background: var(--rj-hl);
    box-shadow: 0 0 16px 1px rgba(255, 225, 77, 0.5);
  }

  &:focus-visible > span {
    outline: 2px solid var(--rj-ink);
    outline-offset: 3px;
  }

  @media ${PHONE_QUERY} {
    display: none;
  }
`;

const Knob = styled.span`
  position: relative;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  background: var(--rj-hl);
  color: #0D0E10;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.3);

  svg { width: 17px; height: 17px; }
`;

const PhoneControls = styled.div`
  display: none;

  @media ${PHONE_QUERY} {
    position: absolute;
    z-index: 5;
    top: 10px;
    left: 10px;
    right: 10px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    pointer-events: none;
  }
`;

const Hint = styled.span<{ $hidden: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 8px;
  border-radius: 6px;
  font: 600 10.5px/1 var(--rj-mono);
  letter-spacing: 0.06em;
  text-transform: uppercase;
  background: rgba(255, 255, 255, 0.92);
  color: #4A4D55;
  box-shadow: 0 0 0 1px rgba(13, 14, 16, 0.08);
  opacity: ${({ $hidden }) => ($hidden ? 0 : 1)};
  transition: opacity 0.3s;

  &::before {
    content: "";
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: #FFE14D;
    box-shadow: 0 0 0 3px rgba(255, 225, 77, 0.35);
    animation: ${pulse} 1.6s ease-in-out infinite;
  }

  @media (prefers-reduced-motion: reduce) {
    &::before { animation: none; }
  }
`;

const ViewSwitch = styled.div`
  pointer-events: auto;
  display: inline-flex;
  padding: 2px;
  border-radius: 8px;
  background: #FFFFFF;
  box-shadow: 0 0 0 1px rgba(13, 14, 16, 0.1), 0 2px 8px rgba(0, 0, 0, 0.12);

  button {
    padding: 7px 9px;
    border-radius: 6px;
    font: 600 11px/1 var(--rj-font);
    color: #80848D;
  }

  button[aria-pressed="true"] {
    background: #0D0E10;
    color: #FFFFFF;
  }

  button:focus-visible {
    outline: 2px solid #FFE14D;
    outline-offset: 1px;
  }
`;

// ─── Footer ──────────────────────────────────────────────────────────────────
const Foot = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  min-height: 58px;
  padding: 10px 10px 10px 16px;
  border-top: 1px solid var(--rj-line);
`;

const Verdict = styled.p<{ $after: boolean }>`
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
  margin: 0;
  font-size: 13.5px;
  color: var(--rj-ink-2);

  i {
    flex: none;
    width: 18px;
    height: 18px;
    display: grid;
    place-items: center;
    border-radius: 50%;
    font-style: normal;
    font-size: 10.5px;
    font-weight: 700;
    color: #FFFFFF;
    background: ${({ $after }) => ($after ? "var(--rj-pass)" : "var(--rj-pen)")};
  }

  b { color: var(--rj-ink); font-weight: 600; }

  .ans { text-decoration: underline dotted; text-decoration-thickness: 1.5px; text-underline-offset: 3px; }

  .compact { display: none; }

  @media ${PHONE_QUERY} {
    .full { display: none; }
    .compact { display: inline; }
  }
`;

const FixButton = styled.button<{ $ghost: boolean }>`
  flex: none;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  height: 38px;
  padding: 0 ${({ $ghost }) => ($ghost ? "10px" : "16px")};
  border-radius: 9999px;
  font: ${({ $ghost }) => ($ghost ? 500 : 600)} 14px/1 var(--rj-font);
  transition: transform 0.15s ease;

  ${({ $ghost }) =>
    $ghost
      ? css`
          color: var(--rj-ink-2);
        `
      : css`
          background: var(--rj-hl);
          color: #0D0E10;
          box-shadow: 0 0 0 1px rgba(13, 14, 16, 0.08), 0 6px 16px -8px rgba(160, 130, 0, 0.6);
          &:hover { transform: translateY(-1px); }
        `}

  &:focus-visible {
    outline: 2px solid var(--rj-ink);
    outline-offset: 2px;
  }

  svg { width: 15px; height: 15px; }
`;

const ArrowIcon = () => (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M3 8h10M9 4l4 4-4 4" />
  </svg>
);

const SplitIcon = () => (
  <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M7 6l-4 4 4 4M13 6l4 4-4 4" />
  </svg>
);

// ─── Rows ────────────────────────────────────────────────────────────────────
function HumanRows({ rows }: { rows: LensRow[] }) {
  return (
    <>
      {rows.map((row, i) => {
        const style = { "--i": i } as React.CSSProperties;
        if (Array.isArray(row.human)) {
          return (
            <Row key={i} $tall={row.tall} className="r two" style={style}>
              <span>{row.human[0]}</span>
              <span>{row.human[1]}</span>
            </Row>
          );
        }
        return (
          <Row key={i} $tall={row.tall} className="r" style={style}>
            {row.human}
          </Row>
        );
      })}
    </>
  );
}

function AtsRows({ rows }: { rows: LensRow[] }) {
  return (
    <>
      {rows.map((row, i) => (
        <Row key={i} $tall={row.tall} className="r" style={{ "--i": i } as React.CSSProperties}>
          {row.ats}
        </Row>
      ))}
    </>
  );
}

// ─── Component ───────────────────────────────────────────────────────────────
export function ParserLens() {
  const [state, setState] = useState<LensState>("before");
  const [score, setScore] = useState(SCORE.before);
  const [pos, setPos] = useState<number | null>(null); // null = CSS rest position / intro
  const [intro, setIntro] = useState(true);
  const [swapping, setSwapping] = useState(false);
  const [xray, setXray] = useState(false);
  const [pinned, setPinned] = useState(false);
  const [held, setHeld] = useState(false);

  const lensRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);
  const touched = useRef(false);
  const holdTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const start = useRef({ x: 0, y: 0 });
  const isPhone = useRef(false);
  const scoreRef = useRef<number>(SCORE.before);

  const after = state === "after";
  const shownPos = pos ?? REST_POS;

  useEffect(() => {
    const mq = window.matchMedia(PHONE_QUERY);
    const sync = () => {
      isPhone.current = mq.matches;
    };
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  // Phone intro: one short X-ray preview teaches the gesture.
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const show = setTimeout(() => {
      if (!isPhone.current || touched.current) return;
      setXray(true);
    }, 1400);
    const hide = setTimeout(() => {
      if (!touched.current) setXray(false);
    }, 2900);
    return () => {
      clearTimeout(show);
      clearTimeout(hide);
    };
  }, []);

  // Count the score toward its target whenever the state flips.
  useEffect(() => {
    const target = SCORE[state];
    const from = scoreRef.current;
    if (from === target) return;
    const set = (v: number) => {
      scoreRef.current = v;
      setScore(v);
    };
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      set(target);
      return;
    }
    const t0 = performance.now();
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min(1, (t - t0) / 900);
      set(Math.round(from + (target - from) * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [state]);

  const interact = useCallback(() => {
    touched.current = true;
    setIntro(false);
  }, []);

  const posFromEvent = useCallback((clientX: number) => {
    const el = lensRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    setPos(Math.max(0, Math.min(100, ((clientX - r.left) / r.width) * 100)));
  }, []);

  const toggleFix = () => {
    interact();
    if (pos !== null && (pos > 85 || pos < 15)) setPos(REST_POS);
    setSwapping(true);
    setState((s) => (s === "before" ? "after" : "before"));
  };

  // ── desktop lens drag ──
  const onHandleDown = (e: React.PointerEvent<HTMLDivElement>) => {
    interact();
    dragging.current = true;
    e.currentTarget.setPointerCapture(e.pointerId);
    posFromEvent(e.clientX);
  };
  const onHandleMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (dragging.current) posFromEvent(e.clientX);
  };
  const onHandleUp = () => {
    dragging.current = false;
  };
  const onHandleKey = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
    e.preventDefault();
    interact();
    setPos((p) => Math.max(0, Math.min(100, (p ?? REST_POS) + (e.key === "ArrowLeft" ? -5 : 5))));
  };
  const onLensClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isPhone.current || (e.target as HTMLElement).closest("[data-handle]")) return;
    interact();
    posFromEvent(e.clientX);
  };

  // ── phone press-and-hold ──
  const clearHold = () => {
    if (holdTimer.current) clearTimeout(holdTimer.current);
    holdTimer.current = null;
  };
  const onLensDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isPhone.current || (e.target as HTMLElement).closest("[data-switch]")) return;
    start.current = { x: e.clientX, y: e.clientY };
    clearHold();
    holdTimer.current = setTimeout(() => {
      interact();
      setHeld(true);
      setXray(true);
    }, 140);
  };
  const onLensMove = (e: React.PointerEvent<HTMLDivElement>) => {
    // A scroll or swipe is not a hold.
    if (holdTimer.current && (Math.abs(e.clientY - start.current.y) > 8 || Math.abs(e.clientX - start.current.x) > 8)) clearHold();
  };
  const onLensRelease = () => {
    clearHold();
    if (held) {
      setHeld(false);
      setXray(pinned);
    }
  };
  const pickView = (ats: boolean) => {
    interact();
    setPinned(ats);
    setXray(ats);
  };

  const fullRows = FULL_ROWS[state];
  const compactRows = COMPACT_ROWS[state];
  const lensStyle = pos === null ? undefined : ({ "--rj-lens-pos": `${pos}%` } as React.CSSProperties);

  return (
    <Card>
      <Top>
        <File>
          {after ? "maya_chen_resume_v2.pdf" : "maya_chen_resume.pdf"} → <b>Junior Data Analyst</b>
        </File>
        <Score $after={after} aria-live="polite">
          <svg viewBox="0 0 36 36" aria-hidden="true">
            <circle className="track" cx="18" cy="18" r="15" />
            <circle
              className="bar"
              cx="18"
              cy="18"
              r="15"
              strokeDasharray={RING.toFixed(2)}
              strokeDashoffset={(RING * (1 - SCORE[state] / 100)).toFixed(2)}
            />
          </svg>
          <div>
            <b>{score}</b>
            <small>ATS score</small>
          </div>
        </Score>
      </Top>

      <Lens
        ref={lensRef}
        $intro={intro}
        $swapping={swapping}
        style={lensStyle}
        data-xray={xray}
        onClick={onLensClick}
        onPointerDown={onLensDown}
        onPointerMove={onLensMove}
        onPointerUp={onLensRelease}
        onPointerCancel={onLensRelease}
        onPointerLeave={onLensRelease}
        onContextMenu={(e) => {
          if (isPhone.current) e.preventDefault();
        }}
      >
        <HumanLayer $before={!after} key={`h-${state}`}>
          <div className="variant-full"><HumanRows rows={fullRows} /></div>
          <div className="variant-compact"><HumanRows rows={compactRows} /></div>
        </HumanLayer>
        <AtsLayer aria-hidden="true" key={`a-${state}`}>
          <div className="variant-full"><AtsRows rows={fullRows} /></div>
          <div className="variant-compact"><AtsRows rows={compactRows} /></div>
        </AtsLayer>

        <Tag $side="l" $hidden={shownPos < 18}>You see</Tag>
        <Tag $side="r" $hidden={shownPos > 82}>ATS reads</Tag>

        <Handle
          data-handle
          role="slider"
          tabIndex={0}
          aria-label="Lens position: what you see versus what the ATS reads"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(shownPos)}
          onPointerDown={onHandleDown}
          onPointerMove={onHandleMove}
          onPointerUp={onHandleUp}
          onPointerCancel={onHandleUp}
          onKeyDown={onHandleKey}
        >
          <Knob><SplitIcon /></Knob>
        </Handle>

        <PhoneControls>
          <Hint $hidden={xray || held}>Hold to X-ray</Hint>
          <ViewSwitch data-switch role="group" aria-label="View">
            <button type="button" aria-pressed={!xray} onClick={() => pickView(false)}>You see</button>
            <button type="button" aria-pressed={xray} onClick={() => pickView(true)}>ATS reads</button>
          </ViewSwitch>
        </PhoneControls>
      </Lens>

      <Foot>
        <Verdict $after={after}>
          <i aria-hidden="true">{after ? "✓" : "✕"}</i>
          {after ? (
            <span>
              <b>Passes.</b> {KEYWORDS_AFTER} keywords
              <span className="full"> · <span className="ans">dotted</span> = your answers</span>
            </span>
          ) : (
            <span>
              <b>{ISSUE_COUNT} issues.</b>{" "}
              <span className="full">Hard for an ATS to read</span>
              <span className="compact">Top {COMPACT_ISSUE_COUNT} shown</span>
            </span>
          )}
        </Verdict>
        <FixButton type="button" $ghost={after} onClick={toggleFix}>
          {after ? "See original" : <>Fix it <ArrowIcon /></>}
        </FixButton>
      </Foot>
    </Card>
  );
}

export default ParserLens;
