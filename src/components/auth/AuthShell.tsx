"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import styled from "styled-components";
import { PRICING, ROUTES } from "@/lib/constants";
import type { AuthContextInfo } from "./context";

/*
 * The frame for /signup, /login, /forgot-password and /reset-password: a
 * plain top bar, the form on the left, and on the right what the visitor was
 * doing before (their resume, their scan, the plan they picked). On phones
 * that context is a one-line strip above the form.
 */

const Page = styled.div`
  min-height: 100vh;
  min-height: 100dvh;
  display: grid;
  grid-template-rows: auto 1fr auto;
  background: var(--rj-paper);
  color: var(--rj-ink);
  font-family: var(--rj-font);
  -webkit-font-smoothing: antialiased;
`;

const Top = styled.header`
  width: 100%;
  max-width: 1120px;
  margin: 0 auto;
  padding: max(18px, env(safe-area-inset-top, 0px)) 20px 18px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;

  @media (min-width: 640px) { padding: 22px 40px; }

  .logo { display: inline-flex; align-items: center; gap: 8px; font: 700 18px var(--rj-font); letter-spacing: -0.02em; color: var(--rj-ink); text-decoration: none; }
  .logo i { width: 22px; height: 22px; border-radius: 6px; display: grid; place-items: center; font-style: normal; font-size: 13px; color: #0d0e10; background: var(--rj-hl); }
  .logo small { font: 500 12px var(--rj-mono); color: var(--rj-ink-3); }
  .back { font: 500 14px var(--rj-font); color: var(--rj-ink-2); text-decoration: none; }
  .back:hover { color: var(--rj-ink); }
  a:focus-visible { outline: 2px solid var(--rj-ink); outline-offset: 3px; border-radius: 4px; }
`;

const Body = styled.main<{ $side: boolean }>`
  width: 100%;
  max-width: 1120px;
  margin: 0 auto;
  padding: 8px 20px 40px;
  display: grid;
  gap: 20px;
  align-content: start;

  @media (min-width: 640px) { padding: 24px 40px 56px; }
  @media (min-width: 960px) {
    grid-template-columns: ${({ $side }) => ($side ? "minmax(0, 420px) minmax(0, 1fr)" : "minmax(0, 420px)")};
    gap: 72px;
    align-items: center;
    padding-top: 40px;
  }

  .strip { display: flex; align-items: center; gap: 12px; padding: 10px 12px; border-radius: 14px; font-size: 13.5px; line-height: 1.4; color: var(--rj-ink-2); background: var(--rj-surface); box-shadow: inset 0 0 0 1px var(--rj-line); }
  .strip b { color: var(--rj-ink); }
  .strip .ring { flex: none; width: 34px; height: 34px; border-radius: 50%; display: grid; place-items: center; font: 700 12px var(--rj-font); color: #0d0e10; background: var(--rj-hl); }
  @media (min-width: 960px) { .strip { display: none; } }
`;

const Panel = styled.aside`
  display: none;

  @media (min-width: 960px) { display: grid; }

  .card { padding: 26px; border-radius: 26px; display: grid; gap: 16px; background: var(--rj-surface); box-shadow: 0 0 0 1px var(--rj-line), 0 40px 80px -60px rgba(0, 0, 0, 0.4); }
  .k { margin: 0; font: 500 11.5px/1.3 var(--rj-mono); letter-spacing: 0.07em; text-transform: uppercase; color: var(--rj-ink-2); }
  h2 { margin: 0; font-size: 20px; letter-spacing: -0.025em; color: var(--rj-ink); }
  p { margin: 0; font-size: 14.5px; line-height: 1.55; color: var(--rj-ink-2); }
  .row { display: grid; grid-template-columns: auto 1fr; gap: 14px; align-items: center; }
  .score { position: relative; width: 64px; height: 64px; }
  .score svg { width: 100%; height: 100%; transform: rotate(-90deg); }
  .score b { position: absolute; inset: 0; display: grid; place-items: center; font-size: 20px; color: var(--rj-ink); }
  .mini { padding: 18px 18px 12px; border-radius: 6px; display: grid; gap: 5px; color: #1b1d22; background: #fff; box-shadow: 0 0 0 1px var(--rj-line); }
  .mini .n { font: 700 16px var(--rj-font); }
  .mini .c { font-size: 9.5px; color: #555; }
  .mini .h { margin-top: 6px; padding-bottom: 2px; border-bottom: 1px solid #1b1d22; font: 700 8.5px var(--rj-font); letter-spacing: 0.1em; }
  .mini i { height: 5px; border-radius: 2px; background: #e6e6e1; }
  ul { list-style: none; margin: 0; padding: 0; display: grid; gap: 10px; }
  .fixes li { display: flex; justify-content: space-between; gap: 10px; font-size: 14px; color: var(--rj-ink); }
  .fixes span { font: 600 12px var(--rj-mono); color: var(--rj-ink-3); }
  .facts li { display: grid; grid-template-columns: 22px 1fr; gap: 10px; font-size: 15px; line-height: 1.45; color: var(--rj-ink-2); }
  .facts li b { font-weight: 600; color: var(--rj-ink); }
  .facts i { width: 22px; height: 22px; border-radius: 50%; display: grid; place-items: center; font: 700 11px var(--rj-font); font-style: normal; color: #0d0e10; background: var(--rj-hl); }
  .plan { padding: 14px 16px; border-radius: 16px; display: flex; justify-content: space-between; align-items: baseline; gap: 12px; background: var(--rj-paper); box-shadow: inset 0 0 0 1px var(--rj-line); }
  .plan b { font-size: 17px; color: var(--rj-ink); }
  .plan small { display: block; margin-top: 2px; font-size: 13px; font-weight: 400; color: var(--rj-ink-3); }
  .plan span { font: 700 22px var(--rj-font); color: var(--rj-ink); }
  .steps { display: flex; gap: 6px; }
  .steps i { flex: 1; height: 3px; border-radius: 2px; background: var(--rj-line); }
  .steps i.on { background: var(--rj-ink); }
`;

const Foot = styled.footer`
  width: 100%;
  max-width: 1120px;
  margin: 0 auto;
  padding: 16px 20px max(24px, env(safe-area-inset-bottom, 0px));
  display: flex;
  flex-wrap: wrap;
  gap: 6px 18px;
  font-size: 12.5px;
  color: var(--rj-ink-3);

  @media (min-width: 640px) { padding: 16px 40px 28px; }

  a { color: var(--rj-ink-3); text-decoration: none; }
  a:hover { color: var(--rj-ink); }
`;

function Ring({ value }: { value: number }) {
  const C = 2 * Math.PI * 42;
  return (
    <div className="score" aria-hidden="true">
      <svg viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="42" fill="none" stroke="var(--rj-line)" strokeWidth="10" />
        <circle cx="50" cy="50" r="42" fill="none" stroke="var(--rj-ink)" strokeWidth="10" strokeLinecap="round" strokeDasharray={C} strokeDashoffset={C * (1 - value / 100)} />
      </svg>
      <b>{value}</b>
    </div>
  );
}

/** What the visitor was doing, on the right of the form. */
function ContextCard({ info }: { info: AuthContextInfo }) {
  if (info.kind === "builder" && info.builder) {
    const b = info.builder;
    return (
      <div className="card">
        <p className="k">Your resume</p>
        <div className="row">
          {b.score !== null ? <Ring value={b.score} /> : <div className="score" />}
          <div><h2>{b.name}</h2><p>{b.score !== null ? `Live ATS score · ${b.toFix === 0 ? "every check passes" : `${b.toFix} ${b.toFix === 1 ? "check" : "checks"} to fix`}` : "Live ATS score"}</p></div>
        </div>
        <div className="mini" aria-hidden="true">
          <span className="n">{b.name}</span>
          <span className="c">{b.contact}</span>
          {b.sections.map((s) => (
            <span key={s} style={{ display: "contents" }}><span className="h">{s}</span><i style={{ width: "85%" }} /><i style={{ width: "65%" }} /></span>
          ))}
        </div>
        <p>It’s saved in this browser. Create a free account and it’s saved to your dashboard, then the PDF downloads.</p>
        <div className="steps" aria-label="Step 2 of 2"><i className="on" /><i className="on" /></div>
      </div>
    );
  }
  if (info.kind === "scan" && info.scan) {
    const s = info.scan;
    return (
      <div className="card">
        <p className="k">Your free scan</p>
        <div className="row"><Ring value={s.score} /><div><h2>{s.fileName}</h2><p>{s.toFix === 0 ? "Every check passes" : `${s.toFix} ${s.toFix === 1 ? "check" : "checks"} to fix`}</p></div></div>
        {s.top.length > 0 && <ul className="fixes">{s.top.map((t) => <li key={t.name}>{t.name}<span>+{t.points}</span></li>)}</ul>}
        <p>Saving keeps this scan and its fixes in your dashboard, so you can come back to them. The scan itself stays free.</p>
      </div>
    );
  }
  if (info.kind === "pricing" && info.plan) {
    const p = info.plan;
    return (
      <div className="card">
        <p className="k">Your plan</p>
        <div className="plan"><b>{p.name}<small>{p.detail}</small></b><span>${p.price}{p.id === "pro" && <small style={{ display: "inline", marginLeft: 4 }}>/mo</small>}</span></div>
        <ul className="facts">
          {p.id === "pro"
            ? <li><i>✓</i><span><b>Cancel anytime</b> from your billing page. Pro stays on until the end of the period you paid for.</span></li>
            : <li><i>✓</i><span><b>Credits never expire.</b> Use them this week or next year.</span></li>}
          {p.id !== "pro" && <li><i>✓</i><span><b>Untouched packs are refundable</b> within 14 days.</span></li>}
          <li><i>✓</i><span>Payment is by Stripe on the next page. We never see your card number.</span></li>
        </ul>
        <div className="steps" aria-label="Step 2 of 3"><i className="on" /><i className="on" /><i /></div>
      </div>
    );
  }
  return (
    <div className="card">
      <p className="k">Your account</p>
      <h2>What a free account gives you.</h2>
      <ul className="facts">
        <li><i>✓</i><span><b>Your scans, resumes and reports</b> in one place, on any device.</span></li>
        <li><i>✓</i><span><b>The resume builder’s PDF download</b>, free.</span></li>
        <li><i>✓</i><span><b>No card.</b> Pay only if you want a Job Match; one credit is ${PRICING.SINGLE.price}, and credits never expire.</span></li>
      </ul>
      <p>The ATS scan doesn’t need an account at all.</p>
    </div>
  );
}

function Strip({ info }: { info: AuthContextInfo }) {
  if (info.kind === "builder" && info.builder) return <div className="strip"><span className="ring">{info.builder.score ?? "…"}</span><span><b>{info.builder.name}’s resume</b> · downloads after this step</span></div>;
  if (info.kind === "scan" && info.scan) return <div className="strip"><span className="ring">{info.scan.score}</span><span><b>Your scan</b> · {info.scan.toFix} to fix · saved after this step</span></div>;
  if (info.kind === "pricing" && info.plan) return <div className="strip"><span className="ring">${info.plan.price}</span><span><b>{info.plan.name}</b> · checkout after this step</span></div>;
  return <div className="strip"><span className="ring">✓</span><span><b>Free.</b> No card, and credits never expire.</span></div>;
}

export function AuthShell({ info, children, context = true }: { info?: AuthContextInfo; children: ReactNode; context?: boolean }) {
  const [year] = useState(() => new Date().getFullYear());
  const back = info?.back ?? { href: ROUTES.PUBLIC.HOME, label: "Rejectly home" };
  const side = context && !!info;
  return (
    <Page>
      <Top>
        <Link className="logo" href={ROUTES.PUBLIC.HOME} aria-label="Rejectly.pro home"><i aria-hidden="true">✓</i>Rejectly<small>.pro</small></Link>
        <Link className="back" href={back.href}>← {back.label}</Link>
      </Top>
      <Body $side={side}>
        {side && <Strip info={info!} />}
        <div>{children}</div>
        {side && <Panel aria-label="Where you were"><ContextCard info={info!} /></Panel>}
      </Body>
      <Foot>
        <span>© {year} Bulbul Labs LLC</span>
        <Link href={ROUTES.PUBLIC.TERMS}>Terms</Link>
        <Link href={ROUTES.PUBLIC.PRIVACY}>Privacy</Link>
        <a href="mailto:hello@rejectly.pro">hello@rejectly.pro</a>
      </Foot>
    </Page>
  );
}

/* ---- form parts shared by the four pages ---- */

export const Form = styled.form`
  display: grid;
  gap: 14px;

  .k { margin: 0; font: 500 11.5px/1.3 var(--rj-mono); letter-spacing: 0.07em; text-transform: uppercase; color: var(--rj-ink-2); }
  h1 { margin: 4px 0 0; font-size: clamp(30px, 7vw, 40px); font-weight: 700; line-height: 1.08; letter-spacing: -0.04em; color: var(--rj-ink); text-wrap: balance; }
  h1 mark { padding: 0 0.06em; margin: 0 -0.03em; border-radius: 0.08em; color: var(--rj-hl-ink); background: linear-gradient(transparent 14%, var(--rj-hl) 14%, var(--rj-hl) 90%, transparent 90%); -webkit-box-decoration-break: clone; box-decoration-break: clone; }
  .lead { margin: 0; font-size: 15.5px; line-height: 1.5; color: var(--rj-ink-2); }
  .or { display: flex; align-items: center; gap: 12px; font: 500 12px var(--rj-mono); color: var(--rj-ink-3); }
  .or::before, .or::after { content: ""; flex: 1; height: 1px; background: var(--rj-line); }
  .legal { margin: 0; font-size: 12.5px; line-height: 1.5; color: var(--rj-ink-3); }
  .switch { margin: 4px 0 0; font-size: 14.5px; color: var(--rj-ink-2); }
  .legal a, .switch a { color: var(--rj-ink-2); text-decoration: underline; text-decoration-color: var(--rj-line); text-underline-offset: 3px; }
  .switch a { font-weight: 600; color: var(--rj-ink); }
  .err { margin: 0; padding: 10px 12px; border-radius: 10px; font-size: 14px; line-height: 1.45; color: var(--rj-ink); background: color-mix(in srgb, var(--rj-pen) 10%, transparent); box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--rj-pen) 35%, transparent); }
  .err a { font-weight: 600; color: var(--rj-ink); }
  .done { display: grid; gap: 12px; justify-items: start; }
  .tick { width: 44px; height: 44px; border-radius: 50%; display: grid; place-items: center; color: #0d0e10; background: var(--rj-hl); }
  .done p { margin: 0; font-size: 15.5px; line-height: 1.55; color: var(--rj-ink-2); }
  .done b { color: var(--rj-ink); }
`;

export const Primary = styled.button`
  height: 50px;
  border: 0;
  border-radius: 999px;
  font: 600 16px var(--rj-font);
  color: var(--rj-btn-ink);
  background: var(--rj-btn);
  cursor: pointer;

  &:disabled { opacity: 0.6; cursor: progress; }
  &:focus-visible { outline: 2px solid var(--rj-ink); outline-offset: 3px; }
`;

const GoogleBtn = styled.button`
  height: 50px;
  border: 0;
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  font: 600 15.5px var(--rj-font);
  color: var(--rj-ink);
  background: var(--rj-surface);
  box-shadow: inset 0 0 0 1px var(--rj-line), 0 1px 2px rgba(0, 0, 0, 0.05);
  cursor: pointer;

  svg { width: 18px; height: 18px; }
  &:disabled { opacity: 0.6; cursor: progress; }
  &:focus-visible { outline: 2px solid var(--rj-ink); outline-offset: 3px; }
`;

export function GoogleButton({ onClick, busy }: { onClick: () => void; busy: boolean }) {
  return (
    <GoogleBtn type="button" onClick={onClick} disabled={busy}>
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.7-2.4 3.6v3h3.9c2.3-2.1 3.5-5.2 3.5-8.8z" />
        <path fill="#34A853" d="M12 24c3.2 0 6-1.1 7.9-2.9l-3.9-3c-1.1.7-2.4 1.2-4 1.2-3.1 0-5.7-2.1-6.6-4.9h-4v3.1C3.4 21.4 7.4 24 12 24z" />
        <path fill="#FBBC05" d="M5.4 14.4c-.2-.7-.4-1.5-.4-2.4s.1-1.6.4-2.4V6.5h-4C.5 8.2 0 10 0 12s.5 3.8 1.4 5.5l4-3.1z" />
        <path fill="#EA4335" d="M12 4.8c1.8 0 3.3.6 4.6 1.8l3.4-3.4C17.9 1.2 15.2 0 12 0 7.4 0 3.4 2.6 1.4 6.5l4 3.1C6.3 6.9 8.9 4.8 12 4.8z" />
      </svg>
      {busy ? "Connecting…" : "Continue with Google"}
    </GoogleBtn>
  );
}

const FieldWrap = styled.div`
  display: grid;
  gap: 6px;

  .lr { display: flex; justify-content: space-between; align-items: baseline; }
  label { font: 500 13.5px var(--rj-font); color: var(--rj-ink); }
  .lr a { font-size: 13px; color: var(--rj-ink-2); text-decoration: underline; text-decoration-color: var(--rj-line); text-underline-offset: 3px; }
  .in { position: relative; }
  input { width: 100%; height: 48px; padding: 0 14px; border: 0; border-radius: 12px; font: 400 16px var(--rj-font); color: var(--rj-ink); background: var(--rj-surface); box-shadow: inset 0 0 0 1px var(--rj-line); outline: none; transition: box-shadow 0.15s; }
  input:focus { box-shadow: inset 0 0 0 2px var(--rj-ink); }
  input::placeholder { color: var(--rj-ink-3); }
  input[aria-invalid="true"] { box-shadow: inset 0 0 0 2px var(--rj-pen); }
  input[type="password"], input.pw { padding-right: 70px; }
  .eye { position: absolute; right: 6px; top: 6px; height: 36px; padding: 0 10px; border: 0; border-radius: 9px; font: 600 12.5px var(--rj-font); color: var(--rj-ink-2); background: none; cursor: pointer; }
  .eye:hover { background: color-mix(in srgb, var(--rj-ink) 6%, transparent); }
  .eye:focus-visible { outline: 2px solid var(--rj-ink); outline-offset: 1px; }
  .hint { margin: 0; font-size: 12.5px; color: var(--rj-ink-3); }
`;

export function Field({
  id, label, value, onChange, type = "text", autoComplete, placeholder, invalid, hint, aside, inputMode,
}: {
  id: string; label: string; value: string; onChange: (v: string) => void; type?: string; autoComplete: string;
  placeholder?: string; invalid?: boolean; hint?: string; aside?: ReactNode; inputMode?: "email" | "text";
}) {
  const [show, setShow] = useState(false);
  const password = type === "password";
  return (
    <FieldWrap>
      <div className="lr"><label htmlFor={id}>{label}</label>{aside}</div>
      <div className="in">
        <input
          id={id}
          type={password && show ? "text" : type}
          className={password ? "pw" : undefined}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          autoComplete={autoComplete}
          inputMode={inputMode}
          placeholder={placeholder}
          aria-invalid={invalid || undefined}
          aria-describedby={hint ? `${id}-hint` : undefined}
          required
        />
        {password && (
          <button type="button" className="eye" onClick={() => setShow((s) => !s)} aria-label={show ? "Hide password" : "Show password"} aria-pressed={show}>
            {show ? "Hide" : "Show"}
          </button>
        )}
      </div>
      {hint && <p className="hint" id={`${id}-hint`}>{hint}</p>}
    </FieldWrap>
  );
}

export const Tick = () => (
  <span className="tick" aria-hidden="true">
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5" /></svg>
  </span>
);
