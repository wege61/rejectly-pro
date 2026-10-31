"use client";

import { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { useReducedMotion } from "framer-motion";
import { PRICING, ROUTES } from "@/lib/constants";
import { useSeenOnce } from "../why/shared";
import { cheapest, money, PRICES, type PlanId } from "./plans";
import { Receipt } from "./Receipt";

/*
 * Homepage section 6: pricing as an honest calculation instead of a scare.
 * The free scan sits on a ticket above the plans. A planner asks how many jobs
 * you'll apply to this month, fans out that many resume pages and names the
 * cheapest real option (it will happily say "buy two Singles"). The receipt
 * shows what one credit buys.
 */

const MAX = 30;
const CHIPS = [1, 5, 10, 20];

const Section = styled.section<{ $page?: boolean }>`
  background: var(--rj-paper);
  color: var(--rj-ink);
  font-family: var(--rj-font);
  -webkit-font-smoothing: antialiased;
  border-top: ${({ $page }) => ($page ? "0" : "1px solid var(--rj-line)")};
  ${({ $page }) => $page && "padding-top: calc(60px + env(safe-area-inset-top, 0px));"}
`;

const Inner = styled.div`
  max-width: 1240px;
  margin: 0 auto;
  display: grid;
  gap: 28px;
  padding: 56px max(20px, env(safe-area-inset-right, 0px)) 64px max(20px, env(safe-area-inset-left, 0px));

  @media (min-width: 640px) { gap: 32px; padding: 80px 40px 88px; }
  @media (min-width: 1000px) { padding: 88px 40px 104px; }
`;

const Head = styled.header<{ $seen: boolean }>`
  .eyebrow {
    margin: 0;
    font: 500 11.5px/1.3 var(--rj-mono);
    letter-spacing: 0.07em;
    text-transform: uppercase;
    color: var(--rj-ink-2);
  }

  h1, h2 {
    margin: 12px 0 0;
    max-width: 12em;
    font-size: clamp(32px, 8.6vw, 56px);
    font-weight: 700;
    line-height: 1.02;
    letter-spacing: -0.04em;
    text-wrap: balance;
    color: var(--rj-ink);

    @media (min-width: 640px) { font-size: clamp(36px, 6.4vw, 56px); }
    @media (min-width: 1000px) { max-width: none; font-size: clamp(40px, 3.9vw, 56px); }
  }

  h1 mark, h2 mark {
    padding: 0 0.06em;
    margin: 0 -0.03em;
    border-radius: 0.08em;
    color: ${({ $seen }) => ($seen ? "var(--rj-hl-ink)" : "var(--rj-ink)")};
    background: linear-gradient(transparent 12%, var(--rj-hl) 12%, var(--rj-hl) 92%, transparent 92%) no-repeat 0 0;
    background-size: ${({ $seen }) => ($seen ? "100% 100%" : "0% 100%")};
    transition: background-size 0.6s cubic-bezier(0.6, 0, 0.2, 1) 0.2s, color 0.3s 0.2s;

    @media (prefers-reduced-motion: reduce) { transition: none; }
  }

  p {
    margin: 14px 0 0;
    max-width: 34em;
    font-size: 16.5px;
    line-height: 1.55;
    color: var(--rj-ink-2);

    @media (min-width: 640px) { font-size: 18px; }
  }
`;

const Arrow = () => (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M3 8h10M9 4l4 4-4 4" />
  </svg>
);

const Check = () => (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M3 8.5l3 3 7-7" />
  </svg>
);

const Ticket = styled.div`
  display: grid;
  grid-template-columns: auto 1fr;
  border-radius: 16px;
  overflow: hidden;
  background: var(--rj-surface);
  box-shadow: 0 0 0 1px var(--rj-line);

  .stub {
    position: relative;
    display: grid;
    place-items: center;
    padding: 14px 18px;
    text-align: center;
    font: 700 12px/1.15 var(--rj-mono);
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: #0d0e10;
    background: var(--rj-hl);

    /* Perforation between stub and ticket. */
    &::after {
      content: "";
      position: absolute;
      right: -5px;
      top: 6px;
      bottom: 6px;
      width: 10px;
      background: radial-gradient(circle at 5px 5px, var(--rj-surface) 3.2px, transparent 3.6px) 0 0 / 10px 10px repeat-y;
    }
  }

  .body {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: 10px 18px;
    padding: 14px 16px 14px 22px;
  }

  .links { display: flex; flex-wrap: wrap; gap: 8px 18px; }

  p {
    margin: 0;
    font-size: 15px;
    line-height: 1.45;
    color: var(--rj-ink-2);

    b { color: var(--rj-ink); font-weight: 600; }
  }
`;

const TextLink = styled.a`
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

const Main = styled.div`
  display: grid;
  gap: 20px;

  @media (min-width: 1000px) {
    grid-template-columns: minmax(0, 1fr) 320px;
    gap: 28px;
    align-items: start;
  }
`;

const Plans = styled.div`
  display: grid;
  gap: 14px;
  min-width: 0;
`;

const Planner = styled.div`
  display: grid;
  gap: 14px;
  padding: 18px;
  border-radius: 20px;
  background: var(--rj-surface);
  box-shadow: 0 0 0 1px var(--rj-line);

  @media (min-width: 1000px) {
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
    grid-template-areas: "q q" "s deck" "o o";
    column-gap: 32px;
    align-items: center;

    .q { grid-area: q; }
    .range { grid-area: s; }
    .deck { grid-area: deck; height: 50px; }
    .out { grid-area: o; min-height: 0; }
  }

  .q {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    gap: 12px;

    label { font-size: 15.5px; font-weight: 600; letter-spacing: -0.01em; color: var(--rj-ink); }
  }

  .n {
    min-width: 2.2ch;
    text-align: right;
    font-size: 34px;
    font-weight: 700;
    line-height: 1;
    letter-spacing: -0.04em;
    font-variant-numeric: tabular-nums;
  }

  .out {
    margin: 0;
    min-height: 3em;
    padding-top: 12px;
    border-top: 1px dashed var(--rj-line);
    font-size: 15px;
    line-height: 1.5;
    color: var(--rj-ink-2);

    b { color: var(--rj-ink); font-weight: 600; font-variant-numeric: tabular-nums; }
  }
`;

const Range = styled.input`
  display: none;
  width: 100%;
  height: 28px;
  margin: 0;
  background: transparent;
  cursor: pointer;
  -webkit-appearance: none;
  appearance: none;

  @media (min-width: 640px) { display: block; }

  &::-webkit-slider-runnable-track {
    height: 6px;
    border-radius: 3px;
    background: linear-gradient(var(--rj-ink), var(--rj-ink)) 0 0 / var(--fill, 25%) 100% no-repeat,
      color-mix(in srgb, var(--rj-ink) 12%, transparent);
  }
  &::-moz-range-track { height: 6px; border-radius: 3px; background: color-mix(in srgb, var(--rj-ink) 12%, transparent); }
  &::-moz-range-progress { height: 6px; border-radius: 3px; background: var(--rj-ink); }
  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 24px;
    height: 24px;
    margin-top: -9px;
    border-radius: 50%;
    background: var(--rj-surface);
    box-shadow: 0 0 0 2px var(--rj-ink), 0 2px 6px rgba(0, 0, 0, 0.2);
  }
  &::-moz-range-thumb { width: 22px; height: 22px; border: 0; border-radius: 50%; background: var(--rj-surface); box-shadow: 0 0 0 2px var(--rj-ink); }
  &:focus-visible { outline: 2px solid var(--rj-ink); outline-offset: 4px; border-radius: 4px; }
`;

const Chips = styled.div`
  display: flex;
  gap: 8px;

  @media (min-width: 640px) { display: none; }

  button {
    flex: 1;
    height: 40px;
    border: 0;
    border-radius: 12px;
    font: 600 15px var(--rj-font);
    color: var(--rj-ink-2);
    background: color-mix(in srgb, var(--rj-ink) 6%, transparent);
    cursor: pointer;

    &[aria-pressed="true"] { color: var(--rj-paper); background: var(--rj-ink); }
    &:focus-visible { outline: 2px solid var(--rj-ink); outline-offset: 2px; }
  }
`;

const Deck = styled.div`
  position: relative;
  height: 58px;

  @media (min-width: 640px) { height: 62px; }
`;

/* A small resume page; the fanned deck shows one per application. */
const Page = styled.span<{ $on: boolean }>`
  position: absolute;
  bottom: 0;
  width: 34px;
  height: 44px;
  border-radius: 4px;
  background: #ffffff;
  box-shadow: 0 0 0 1px rgba(13, 14, 16, 0.16), -2px 0 4px -2px rgba(0, 0, 0, 0.22);
  transform-origin: 50% 100%;
  opacity: ${({ $on }) => ($on ? 1 : 0)};
  transition: opacity 0.25s, transform 0.35s cubic-bezier(0.3, 1.4, 0.5, 1);

  &::before {
    content: "";
    position: absolute;
    left: 6px;
    right: 10px;
    top: 7px;
    height: 3px;
    border-radius: 2px;
    background: #9c9fa6;
    box-shadow: 0 7px 0 #dadbd6, 0 13px 0 #dadbd6, 0 19px 0 #dadbd6, 0 25px 0 #e7e8e4;
  }

  @media (prefers-reduced-motion: reduce) { transition: none; }
`;

const Cards = styled.div`
  display: grid;
  gap: 12px;

  @media (min-width: 640px) { grid-template-columns: repeat(3, minmax(0, 1fr)); }
`;

const Card = styled.article<{ $rec: boolean }>`
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 18px;
  border-radius: 20px;
  background: var(--rj-surface);
  box-shadow: 0 0 0 ${({ $rec }) => ($rec ? "2px var(--rj-ink)" : "1px var(--rj-line)")};
  transition: box-shadow 0.3s;

  h3 {
    margin: 0;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
    font-size: 15px;
    font-weight: 600;
    color: var(--rj-ink-2);
  }

  .fit {
    padding: 5px 7px;
    border-radius: 6px;
    font: 700 10.5px/1 var(--rj-mono);
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: #0d0e10;
    background: var(--rj-hl);
    opacity: ${({ $rec }) => ($rec ? 1 : 0)};
    transform: translateY(${({ $rec }) => ($rec ? 0 : 3)}px);
    transition: opacity 0.25s, transform 0.3s;
  }

  .amt {
    display: flex;
    align-items: baseline;
    gap: 6px;

    b { font-size: 40px; font-weight: 700; line-height: 1; letter-spacing: -0.045em; color: var(--rj-ink); }
    span { font-size: 14px; color: var(--rj-ink-3); }
  }

  .what {
    margin: 0 0 4px;
    font-size: 14.5px;
    line-height: 1.45;
    color: var(--rj-ink-2);

    b { color: var(--rj-ink); font-weight: 600; }
  }

  .stamp {
    align-self: flex-start;
    margin-bottom: 4px;
    padding: 6px 8px;
    border-radius: 6px;
    font: 700 10.5px/1 var(--rj-mono);
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--rj-ink);
    box-shadow: inset 0 0 0 1.5px currentColor;
    transform: rotate(-2deg);
  }

  .tag {
    align-self: flex-start;
    margin-bottom: 4px;
    padding: 6px 8px;
    border-radius: 7px;
    font: 600 11px/1 var(--rj-mono);
    color: var(--rj-ink-2);
    background: color-mix(in srgb, var(--rj-ink) 6%, transparent);
  }

  a {
    margin-top: auto;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 46px;
    border-radius: 999px;
    font-size: 15px;
    font-weight: 600;
    text-decoration: none;
    color: ${({ $rec }) => ($rec ? "var(--rj-btn-ink)" : "var(--rj-ink)")};
    background: ${({ $rec }) => ($rec ? "var(--rj-btn)" : "transparent")};
    box-shadow: ${({ $rec }) => ($rec ? "none" : "inset 0 0 0 1.5px var(--rj-line)")};
    transition: background 0.25s, color 0.25s, box-shadow 0.25s;

    &:hover { color: ${({ $rec }) => ($rec ? "var(--rj-btn-ink)" : "var(--rj-ink)")}; }
    &:focus-visible { outline: 2px solid var(--rj-ink); outline-offset: 3px; }
  }
`;

const Trust = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-wrap: wrap;
  gap: 8px 22px;
  font-size: 13px;
  color: var(--rj-ink-3);

  li { display: inline-flex; align-items: center; gap: 6px; }
  svg { width: 13px; height: 13px; color: var(--rj-pass); }
`;

function describe(n: number) {
  const label = n >= MAX ? `${MAX}+` : String(n);
  const head = `${label} ${n === 1 ? "application" : "applications"}:`;
  const r = cheapest(n);

  if (r.plan === "pro") {
    const each = n < MAX ? `, ${money(Math.round((PRICES.pro * 100) / n) / 100)} a job.` : `. Up to ${PRICING.PRO.runsPerPeriod} runs a month.`;
    return { label, plan: r.plan, head, before: "Pro is cheapest at ", price: money(PRICES.pro), after: ` for the month${each}` };
  }
  if (r.plan === "single") {
    if (n === 1) return { label, plan: r.plan, head, before: "one Single credit, ", price: money(r.cost), after: "." };
    const extra = money(PRICES.pack - r.cost);
    return {
      label,
      plan: r.plan,
      head,
      before: `${n} Single credits are cheapest at `,
      price: money(r.cost),
      after: `. Starter is ${extra} more and leaves ${PRICES.packCredits - n} credits for later.`,
    };
  }
  const left = r.packs * PRICES.packCredits + r.singles - n;
  return {
    label,
    plan: r.plan,
    head,
    before: `Starter${r.singles ? ` + ${r.singles} Single` : ""} is cheapest at `,
    price: money(r.cost),
    after: left ? `. ${left} credit${left > 1 ? "s" : ""} left over, and they never expire.` : ".",
  };
}

/**
 * The pricing section. On the homepage it's one section (h2); /pricing uses it
 * as its hero (`page`), so the page title is an h1 and it clears the navbar.
 */
export function Pricing({ page = false }: { page?: boolean }) {
  const reduce = useReducedMotion();
  const Title = page ? "h1" : "h2";
  const [n, setN] = useState(8);
  const [armed, setArmed] = useState(false);
  const [seen, setSeen] = useState(false);
  const [printed, setPrinted] = useState(false);
  const [deckWidth, setDeckWidth] = useState(0);
  const headRef = useRef<HTMLElement>(null);
  const receiptRef = useRef<HTMLElement>(null);
  const deckRef = useRef<HTMLDivElement>(null);

  // Phones start on a chip value; motion arms only after hydration.
  useEffect(() => {
    if (window.matchMedia("(max-width: 639px)").matches) setN(5);
    setArmed(!reduce);
    if (reduce) setSeen(true);
  }, [reduce]);

  useEffect(() => {
    const el = deckRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setDeckWidth(el.clientWidth));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useSeenOnce(headRef, () => setSeen(true), armed, 0.6);
  useSeenOnce(receiptRef, () => setPrinted(true), armed, 0.35);

  const d = describe(n);
  const step = Math.min(16, Math.max(5, (deckWidth - 40) / Math.max(n - 1, 1)));

  const fit = `Best for ${d.label}`;
  const badge = (id: PlanId) => (
    <span className="fit" aria-hidden={d.plan !== id}>{fit}</span>
  );

  return (
    <Section id="pricing" aria-labelledby="pricing-title" $page={page}>
      <Inner>
        <Head ref={headRef} $seen={seen}>
          <p className="eyebrow">Pricing</p>
          <Title id="pricing-title">
            Pay for the jobs you <mark>apply to.</mark>
          </Title>
          <p>Scan free. Spend a credit when a job is worth it. Credits never expire.</p>
        </Head>

        <Ticket>
          <div className="stub">Free<br />always</div>
          <div className="body">
            <p><b>The ATS scan with all 19 checks, and the job match demo.</b> No account, no card.</p>
            <span className="links">
              <TextLink href={ROUTES.PUBLIC.ATS_CHECK}>Scan free <Arrow /></TextLink>
              <TextLink href="/#demo">Try the demo <Arrow /></TextLink>
            </span>
          </div>
        </Ticket>

        <Main>
          <Plans>
            <Planner>
              <div className="q">
                <label htmlFor="pricing-range">How many jobs will you apply to this month?</label>
                <span className="n" aria-hidden="true">{d.label}</span>
              </div>
              <Range
                className="range"
                id="pricing-range"
                type="range"
                min={1}
                max={MAX}
                value={n}
                onChange={(e) => setN(Number(e.target.value))}
                aria-describedby="pricing-out"
                aria-valuetext={`${d.label} applications`}
                style={{ "--fill": `${((n - 1) / (MAX - 1)) * 100}%` } as React.CSSProperties}
              />
              <Chips role="group" aria-label="Applications this month">
                {CHIPS.map((c) => (
                  <button key={c} type="button" aria-pressed={n === c} onClick={() => setN(c)}>
                    {c === 20 ? "20+" : c}
                  </button>
                ))}
              </Chips>
              <Deck className="deck" ref={deckRef} aria-hidden="true">
                {Array.from({ length: MAX }, (_, k) => {
                  const on = k < n;
                  return (
                    <Page
                      key={k}
                      $on={on}
                      style={{
                        zIndex: MAX - k,
                        left: k * step,
                        transform: on ? `rotate(${(((k * 37) % 7) - 3) * 0.7}deg)` : "translateY(10px) scale(0.9)",
                      }}
                    />
                  );
                })}
              </Deck>
              <p className="out" id="pricing-out" aria-live="polite">
                <b>{d.head}</b> {d.before}<b>{d.price}</b>{d.after}
              </p>
            </Planner>

            <Cards>
              <Card $rec={d.plan === "single"}>
                <h3>Single {badge("single")}</h3>
                <div className="amt"><b>{money(PRICES.single)}</b><span>1 credit</span></div>
                <p className="what">For the one job you really want.</p>
                <a href={ROUTES.AUTH.SIGNUP}>Buy 1 credit</a>
              </Card>
              <Card $rec={d.plan === "starter"}>
                <h3>Starter {badge("starter")}</h3>
                <div className="amt"><b>{money(PRICES.pack)}</b><span>{PRICES.packCredits} credits</span></div>
                <p className="what"><b>{money(PRICES.pack / PRICES.packCredits)} a job.</b> For a focused search.</p>
                <span className="stamp">✓ Never expire</span>
                <a href={ROUTES.AUTH.SIGNUP}>Get {PRICES.packCredits} credits</a>
              </Card>
              <Card $rec={d.plan === "pro"}>
                <h3>Pro {badge("pro")}</h3>
                <div className="amt"><b>{money(PRICES.pro)}</b><span>per month</span></div>
                <p className="what"><b>{PRICING.PRO.runsPerPeriod} runs a month</b>: Job Matches and ATS Optimizer runs.</p>
                <span className="tag">Cancel anytime</span>
                <a href={ROUTES.AUTH.SIGNUP}>Go Pro</a>
              </Card>
            </Cards>
          </Plans>

          <Receipt ref={receiptRef} armed={armed} printed={printed} />
        </Main>

        <Trust>
          <li><Check />Secure checkout by Stripe</li>
          <li><Check />Credits never expire</li>
          <li><Check />Untouched credit packs refunded within 14 days</li>
          <li><Check />Cancel Pro anytime from your billing page</li>
        </Trust>
      </Inner>
    </Section>
  );
}

export default Pricing;
