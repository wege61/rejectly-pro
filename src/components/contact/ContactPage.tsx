"use client";

import { useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import styled, { css, keyframes } from "styled-components";
import { ROUTES } from "@/lib/constants";
import { CONTACT_TOPICS, type ContactTopic } from "@/lib/contact";

/*
 * /contact: the form is a letter (To / From / About) that really sends, to
 * hello@ through /api/contact, with Reply going back to the sender. Picking a
 * topic shows the answer that settles most of those messages. No reply-time
 * promise and no address we don't read.
 */

const EMAIL = "hello@rejectly.pro";

const HINTS: Partial<Record<ContactTopic, { lead?: string; text: string }>> = {
  bug: { text: "Tell us what you clicked and what happened.", lead: "If a run failed, the credit already went back to your account." },
  billing: { lead: "Refunds:", text: "a credit pack you haven't used any credits from, within 14 days of buying it. Write from the email you paid with, or mention it." },
  idea: { text: "Tell us what you'd use it for. That's what helps us decide." },
};

const QUICK = [
  { id: "free", q: "What's free?", a: "The ATS scan with all 19 checks, and the job match demo. No account, no card." },
  { id: "expire", q: "Do credits expire?", a: "Never." },
  { id: "refunds", q: "Can I get a refund?", a: "For an untouched credit pack, within 14 days." },
  { id: "delete", q: "Can I delete everything?", a: "Yes, from Settings. It's permanent." },
];

const curve = "cubic-bezier(0.32, 0.72, 0, 1)";
const scan = keyframes`0% { top: 0; opacity: 1; } 90% { opacity: 1; } 100% { top: 100%; opacity: 0; }`;

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

  @media (min-width: 640px) { padding: 0 40px 88px; }
`;

const Hero = styled.header`
  max-width: 820px;
  padding-top: 48px;

  @media (min-width: 640px) { padding-top: 72px; }

  h1 { margin: 12px 0 0; font-size: clamp(42px, 10vw, 80px); font-weight: 700; line-height: 1.02; letter-spacing: -0.05em; color: var(--rj-ink); }
  /* Highlight only the x-height band, so it never covers the descenders above it. */
  h1 mark { padding: 0 0.06em; margin: 0 -0.03em; border-radius: 0.08em; color: var(--rj-hl-ink); background: linear-gradient(transparent 14%, var(--rj-hl) 14%, var(--rj-hl) 90%, transparent 90%); -webkit-box-decoration-break: clone; box-decoration-break: clone; }
  .sub { margin: 18px 0 0; max-width: 34em; font-size: clamp(17px, 2.2vw, 19px); line-height: 1.55; color: var(--rj-ink-2); }
`;

const Body = styled.div`
  margin-top: 40px;
  display: grid;
  gap: 28px;

  @media (min-width: 960px) { grid-template-columns: minmax(0, 1fr) 340px; gap: 48px; align-items: start; margin-top: 56px; }
`;

/* The form and the "Sent" card share one cell, so nothing jumps when it's sent. */
const Stage = styled.div`
  display: grid;

  > * { grid-area: 1 / 1; }
`;

const Letter = styled.form<{ $state: "idle" | "sending" | "sent"; $gone: boolean }>`
  position: relative;
  overflow: hidden;
  border-radius: 6px;
  background: var(--rj-surface);
  box-shadow: 0 0 0 1px var(--rj-line), 0 30px 60px -40px rgba(0, 0, 0, 0.35);
  transition: transform 0.6s ${curve}, opacity 0.45s ease;
  ${({ $state }) => $state === "sent" && css`transform: translateY(-24px) scale(0.97); opacity: 0; pointer-events: none; visibility: hidden; transition: transform 0.6s ${curve}, opacity 0.45s ease, visibility 0s 0.6s;`}

  &::after {
    content: "";
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    height: 2px;
    opacity: 0;
    pointer-events: none;
    background: #ffe14d;
    box-shadow: 0 0 14px 3px rgba(255, 225, 77, 0.6);
    ${({ $state }) => $state !== "idle" && css`animation: ${scan} 0.7s cubic-bezier(0.45, 0, 0.55, 1) forwards;`}
  }

  /* Once it has lifted away, give its height back so the "Sent" card isn't left floating. */
  ${({ $gone }) => $gone && css`display: none;`}

  @media (prefers-reduced-motion: reduce) { transition: none; &::after { animation: none; } }
`;

const Field = styled.div`
  display: grid;
  grid-template-columns: 64px minmax(0, 1fr);
  align-items: center;
  gap: 0 12px;
  min-height: 58px;
  padding: 6px 20px;
  border-bottom: 1px solid var(--rj-line);

  @media (min-width: 640px) { grid-template-columns: 80px minmax(0, 1fr); padding: 6px 32px; }

  &:focus-within { background: color-mix(in srgb, var(--rj-ink) 2.5%, transparent); }
  > label, > .l { font: 600 11px var(--rj-mono); letter-spacing: 0.08em; text-transform: uppercase; color: var(--rj-ink-3); }
  .to { font-size: 16px; color: var(--rj-ink); }
  input { width: 100%; height: 44px; padding: 0; border: 0; background: none; font: 400 16px var(--rj-font); color: var(--rj-ink); outline: none; }
  input::placeholder { color: var(--rj-ink-3); }
  .err { grid-column: 2; margin: -6px 0 6px; font-size: 13px; color: var(--rj-pen); }
`;

const Topics = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  padding: 8px 0;

  button { height: 34px; padding: 0 13px; border: 0; border-radius: 999px; font: 500 14px var(--rj-font); color: var(--rj-ink); background: color-mix(in srgb, var(--rj-ink) 6%, transparent); cursor: pointer; }
  button[aria-pressed="true"] { color: var(--rj-paper); background: var(--rj-ink); }
  button:focus-visible { outline: 2px solid var(--rj-ink); outline-offset: 2px; }
`;

const Hint = styled.p`
  margin: 0;
  padding: 12px 20px;
  display: flex;
  gap: 10px;
  font-size: 14px;
  line-height: 1.5;
  color: var(--rj-ink-2);
  background: color-mix(in srgb, var(--rj-hl) 22%, transparent);
  border-bottom: 1px solid var(--rj-line);

  @media (min-width: 640px) { padding: 12px 32px; }

  b { font-weight: 600; color: var(--rj-ink); }
`;

const Message = styled.div`
  padding: 18px 20px 6px;

  @media (min-width: 640px) { padding: 22px 32px 6px; }

  textarea { width: 100%; min-height: 220px; resize: vertical; padding: 0; border: 0; background: none; font: 400 17px/1.6 var(--rj-font); color: var(--rj-ink); outline: none; }
  textarea::placeholder { color: var(--rj-ink-3); }
  .err { margin: 0 0 8px; font-size: 13px; color: var(--rj-pen); }
  /* Bots fill every field; people never see this one. */
  .hp { position: absolute; left: -9999px; width: 1px; height: 1px; overflow: hidden; }
`;

const Foot = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 14px 20px 20px;

  @media (min-width: 640px) { padding: 14px 32px 28px; }

  small { font-size: 13px; color: var(--rj-ink-3); }
  small.fail { color: var(--rj-pen); }
  button { height: 48px; padding: 0 24px; border: 0; border-radius: 999px; font: 600 16px var(--rj-font); color: var(--rj-btn-ink); background: var(--rj-btn); cursor: pointer; }
  button:disabled { opacity: 0.6; cursor: progress; }
  button:focus-visible { outline: 2px solid var(--rj-ink); outline-offset: 3px; }
`;

const Done = styled.div<{ $on: boolean }>`
  align-self: start;
  padding: 40px 24px;
  border-radius: 24px;
  background: var(--rj-surface);
  box-shadow: 0 0 0 1px var(--rj-line);
  display: grid;
  gap: 12px;
  justify-items: start;
  opacity: ${({ $on }) => ($on ? 1 : 0)};
  transform: ${({ $on }) => ($on ? "none" : "translateY(16px)")};
  visibility: ${({ $on }) => ($on ? "visible" : "hidden")};
  transition: opacity 0.5s 0.25s ease, transform 0.6s 0.25s ${curve}, visibility 0s ${({ $on }) => ($on ? "0s" : "0.85s")};

  @media (min-width: 640px) { padding: 48px; }
  @media (prefers-reduced-motion: reduce) { transition: none; }

  .tick { width: 44px; height: 44px; border-radius: 50%; display: grid; place-items: center; color: #0d0e10; background: var(--rj-hl); }
  h2 { margin: 6px 0 0; font-size: clamp(28px, 6vw, 40px); letter-spacing: -0.04em; color: var(--rj-ink); }
  p { margin: 0; max-width: 32em; font-size: 16.5px; line-height: 1.55; color: var(--rj-ink-2); overflow-wrap: anywhere; }
  p b { font-weight: 600; color: var(--rj-ink); }
  button { margin-top: 8px; height: 42px; padding: 0 18px; border: 0; border-radius: 999px; font: 600 14.5px var(--rj-font); color: var(--rj-ink); background: color-mix(in srgb, var(--rj-ink) 6%, transparent); cursor: pointer; }
  button:focus-visible { outline: 2px solid var(--rj-ink); outline-offset: 2px; }
`;

const Side = styled.aside`
  display: grid;
  gap: 14px;

  h2 { margin: 6px 0 0; font-size: 22px; letter-spacing: -0.03em; color: var(--rj-ink); }
  ul { list-style: none; margin: 4px 0 0; padding: 0; border-top: 1px solid var(--rj-line); }
  li { border-bottom: 1px solid var(--rj-line); }
  li a { display: grid; gap: 3px; padding: 14px 0; color: var(--rj-ink); text-decoration: none; }
  li a:hover { color: var(--rj-ink); }
  li a:hover b { text-decoration: underline; text-underline-offset: 3px; }
  li a:focus-visible { outline: 2px solid var(--rj-ink); outline-offset: 2px; border-radius: 4px; }
  li b { font-size: 15px; font-weight: 600; }
  li span { font-size: 14px; line-height: 1.5; color: var(--rj-ink-2); }
`;

const Direct = styled.div`
  margin-top: 8px;
  padding: 18px;
  border-radius: 18px;
  background: var(--rj-surface);
  box-shadow: 0 0 0 1px var(--rj-line);
  display: grid;
  gap: 8px;

  p { margin: 0; font-size: 14px; color: var(--rj-ink-2); }
  .row { display: flex; align-items: center; justify-content: space-between; gap: 10px; }
  a { font: 600 15.5px var(--rj-font); color: var(--rj-ink); text-decoration: none; overflow-wrap: anywhere; }
  a:hover { color: var(--rj-ink); text-decoration: underline; text-underline-offset: 3px; }
  button { flex: none; height: 32px; padding: 0 12px; border: 0; border-radius: 999px; font: 600 13px var(--rj-font); color: var(--rj-ink); background: color-mix(in srgb, var(--rj-ink) 6%, transparent); cursor: pointer; }
  a:focus-visible, button:focus-visible { outline: 2px solid var(--rj-ink); outline-offset: 2px; }
`;

const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());

export function ContactPage() {
  const [email, setEmail] = useState("");
  const [topic, setTopic] = useState<ContactTopic>("question");
  const [message, setMessage] = useState("");
  const [website, setWebsite] = useState("");
  const [errors, setErrors] = useState<{ email?: boolean; message?: boolean }>({});
  const [state, setState] = useState<"idle" | "sending" | "sent">("idle");
  const [failure, setFailure] = useState("");
  const [sentTo, setSentTo] = useState("");
  const [gone, setGone] = useState(false);
  const doneRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);
  const emailRef = useRef<HTMLInputElement>(null);
  const messageRef = useRef<HTMLTextAreaElement>(null);
  const againRef = useRef<HTMLButtonElement>(null);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    const next = { email: !isEmail(email), message: message.trim().length < 10 };
    setErrors(next);
    if (next.email) return emailRef.current?.focus();
    if (next.message) return messageRef.current?.focus();

    setFailure("");
    setState("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), topic, message, website }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || `We couldn't send that. Please email ${EMAIL} directly.`);
      setSentTo(email.trim());
      setState("sent");
      setTimeout(() => {
        setGone(true);
        const card = doneRef.current;
        if (card && card.getBoundingClientRect().top < 80) card.scrollIntoView({ behavior: "smooth", block: "center" });
        againRef.current?.focus({ preventScroll: true });
      }, 650);
    } catch (err) {
      setState("idle");
      setFailure(err instanceof Error ? err.message : `We couldn't send that. Please email ${EMAIL} directly.`);
    }
  };

  const again = () => {
    setMessage("");
    setTopic("question");
    setGone(false);
    setState("idle");
    setTimeout(() => messageRef.current?.focus(), 400);
  };

  const copy = async () => {
    try { await navigator.clipboard.writeText(EMAIL); } catch { /* the address is still on screen */ }
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const hint = HINTS[topic];

  return (
    <Root>
      <In>
        <Hero>
          <p className="eyebrow">Contact</p>
          <h1>Write to a <mark>person</mark>.</h1>
          <p className="sub">A question, something that broke, a refund, an idea. Your message goes to the people who build Rejectly, and the reply comes from them.</p>
        </Hero>

        <Body>
          <Stage>
            <Letter $state={state} $gone={gone} onSubmit={submit} noValidate aria-label="Message" aria-hidden={state === "sent"}>
              <Field><span className="l">To</span><span className="to">The Rejectly team</span></Field>
              <Field>
                <label htmlFor="contact-email">From</label>
                <input
                  ref={emailRef}
                  id="contact-email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@school.edu"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setErrors((x) => ({ ...x, email: false })); }}
                  aria-invalid={errors.email || undefined}
                  aria-describedby={errors.email ? "contact-email-err" : undefined}
                  required
                />
                {errors.email && <p className="err" id="contact-email-err">Add an email we can reply to.</p>}
              </Field>
              <Field>
                <span className="l" id="contact-topic">About</span>
                <Topics role="group" aria-labelledby="contact-topic">
                  {(Object.keys(CONTACT_TOPICS) as ContactTopic[]).map((t) => (
                    <button key={t} type="button" aria-pressed={topic === t} onClick={() => setTopic(t)}>{CONTACT_TOPICS[t]}</button>
                  ))}
                </Topics>
              </Field>
              {hint && (
                <Hint aria-live="polite">
                  <span aria-hidden="true">→</span>
                  <span>
                    {topic === "billing" ? <><b>{hint.lead}</b> {hint.text}</> : <>{hint.text}{hint.lead && <> <b>{hint.lead}</b></>}</>}
                  </span>
                </Hint>
              )}
              <Message>
                <label className="hp" aria-hidden="true">Leave this empty<input tabIndex={-1} autoComplete="off" value={website} onChange={(e) => setWebsite(e.target.value)} /></label>
                {errors.message && <p className="err" id="contact-message-err">Write a little more, so we can help.</p>}
                <textarea
                  ref={messageRef}
                  aria-label="Your message"
                  placeholder="Hi, …"
                  maxLength={5000}
                  value={message}
                  onChange={(e) => { setMessage(e.target.value); setErrors((x) => ({ ...x, message: false })); }}
                  aria-invalid={errors.message || undefined}
                  aria-describedby={errors.message ? "contact-message-err" : undefined}
                />
              </Message>
              <Foot>
                {failure ? <small className="fail" role="alert">{failure}</small> : <small>We only use your email to reply. No newsletter.</small>}
                <button type="submit" disabled={state === "sending"}>{state === "sending" ? "Sending…" : "Send"}</button>
              </Foot>
            </Letter>

            <Done ref={doneRef} $on={state === "sent"} aria-live="polite" aria-hidden={state !== "sent"}>
              <span className="tick" aria-hidden="true">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5" /></svg>
              </span>
              <h2>Sent.</h2>
              <p>We&apos;ll reply to <b>{sentTo}</b>. If it&apos;s about a run that failed, check your credits first: they go back automatically.</p>
              <button ref={againRef} type="button" onClick={again} tabIndex={state === "sent" ? 0 : -1}>Write another</button>
            </Done>
          </Stage>

          <Side aria-labelledby="contact-before">
            <p className="eyebrow">Before you write</p>
            <h2 id="contact-before">These might answer it.</h2>
            <ul>
              {QUICK.map((x) => (
                <li key={x.id}><Link href={`${ROUTES.PUBLIC.FAQ}#${x.id}`}><b>{x.q}</b><span>{x.a}</span></Link></li>
              ))}
            </ul>
            <Direct>
              <p>Or email us directly</p>
              <div className="row">
                <a href={`mailto:${EMAIL}`}>{EMAIL}</a>
                <button type="button" onClick={copy}>{copied ? "Copied" : "Copy"}</button>
              </div>
            </Direct>
          </Side>
        </Body>
      </In>
    </Root>
  );
}

export default ContactPage;
