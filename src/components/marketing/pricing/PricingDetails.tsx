"use client";

import Link from "next/link";
import styled from "styled-components";
import { ROUTES } from "@/lib/constants";
import { ShortAnswerFaq } from "@/components/ui/ShortAnswerFaq";
import { PRICING_FAQS } from "./faq";

/*
 * /pricing below the pricing section: what's free and what a credit buys, tool
 * by tool (the same four tools as the navbar), the billing rules in plain words
 * (they must match the Terms), the FAQ, and one closing CTA.
 *
 * Tools with a free version and a paid one are a ticket torn down the middle;
 * tools with one price are a single piece.
 */

type Half = { title: string; tag: string; free?: boolean; items: string[]; link?: { label: string; href: string } };
type ToolTicket = { name: string; question: string; free?: Half; paid?: Half };

const TOOLS: ToolTicket[] = [
  {
    name: "ATS Optimizer",
    question: "Can software read your resume?",
    free: {
      title: "ATS scan",
      tag: "Free",
      free: true,
      items: ["Score out of 100", "All 19 checks, each with its fix", "The text the ATS pulled out"],
      link: { label: "Scan free", href: ROUTES.PUBLIC.ATS_CHECK },
    },
    paid: {
      title: "Optimizer run",
      tag: "1 credit",
      items: ["Your resume rebuilt as one clean column", "Standard headings and bullets, your facts kept", "Scored again with the same 19 checks", "PDF download"],
    },
  },
  {
    name: "Job Match",
    question: "Does your resume fit this job?",
    free: {
      title: "Demo",
      tag: "Free",
      free: true,
      items: ["Match score", "Matched and missing keywords", "Quick wins"],
      link: { label: "Try the demo", href: "/#demo" },
    },
    paid: {
      title: "Full match",
      tag: "1 credit",
      items: ["Your resume rewritten in the post's words", "Bullet rewrites, no invented facts", "3 role recommendations", "Interview prep for this job", "A cover letter"],
    },
  },
  {
    name: "Cover Letters",
    question: "A letter for the job you matched.",
    paid: {
      title: "Included with every full Job Match",
      tag: "Included",
      items: ["Written from your match report, no new facts", "Pick the tone"],
    },
  },
  {
    name: "Resume Builder",
    question: "Starting from scratch.",
    free: {
      title: "Free, all of it",
      tag: "Free",
      free: true,
      items: ["ATS-friendly templates", "Guided sections", "PDF export"],
      link: { label: "Open the builder", href: ROUTES.PUBLIC.CV_BUILDER },
    },
  },
];

const FACTS = [
  { k: "Credits", title: "Never expire.", text: "Use them this week or next year." },
  { k: "One credit", title: "One run.", text: "One Job Match or one ATS Optimizer run." },
  { k: "Packs", title: "Pay once.", text: "Single and Starter never renew. Only Pro is monthly." },
  { k: "Refunds", title: "Untouched packs, 14 days.", text: "Ask within 14 days of buying a pack you haven't used. Used credits and partial Pro months aren't refunded." },
  { k: "Pro", title: "Cancel anytime.", text: "From your billing page. Pro stays on until the end of the period you paid for." },
  { k: "Checkout", title: "Stripe.", text: "We never see or store your card number." },
];

/* ---------------------------------------------------------------- styles */

const Section = styled.section`
  background: var(--rj-paper);
  border-top: 1px solid var(--rj-line);
  color: var(--rj-ink);
  font-family: var(--rj-font);
  -webkit-font-smoothing: antialiased;
`;

const In = styled.div<{ $faq?: boolean }>`
  max-width: 1240px;
  margin: 0 auto;
  display: grid;
  gap: ${({ $faq }) => ($faq ? "24px" : "28px")};
  padding: 56px max(20px, env(safe-area-inset-right, 0px)) 64px max(20px, env(safe-area-inset-left, 0px));

  @media (min-width: 640px) { padding: 80px 40px 88px; gap: 32px; }
  @media (min-width: 1000px) {
    padding: 104px 40px;
    ${({ $faq }) => $faq && "grid-template-columns: 340px minmax(0, 1fr); gap: 64px; align-items: start;"}

    .head { position: sticky; top: 100px; }
  }

  .eyebrow { margin: 0; font: 500 11.5px/1.3 var(--rj-mono); letter-spacing: 0.07em; text-transform: uppercase; color: var(--rj-ink-2); }
  h2 { margin: 12px 0 0; color: var(--rj-ink); font-size: clamp(30px, 7.6vw, 48px); font-weight: 700; line-height: 1.05; letter-spacing: -0.04em; text-wrap: balance; }
`;

const Tickets = styled.div`
  display: grid;
  gap: 12px;
`;

const Ticket = styled.article<{ $one: boolean }>`
  display: grid;
  overflow: hidden;
  border-radius: 20px;
  background: var(--rj-surface);
  box-shadow: 0 0 0 1px var(--rj-line);

  .name { padding: 18px 18px 0; }
  .name h3 { margin: 0; color: var(--rj-ink); font-size: 19px; letter-spacing: -0.025em; }
  .name p { margin: 4px 0 0; font-size: 13.5px; line-height: 1.45; color: var(--rj-ink-3); }

  .half { position: relative; display: grid; gap: 10px; align-content: start; padding: 16px 18px 18px; }
  .free { background: ${({ $one }) => ($one ? "var(--rj-surface)" : "var(--rj-paper)")}; }

  /* The tear between the free and the paid half. */
  .free::after {
    content: "";
    display: ${({ $one }) => ($one ? "none" : "block")};
    position: absolute;
    left: 14px;
    right: 14px;
    bottom: -1px;
    height: 2px;
    background: radial-gradient(circle, var(--rj-ink-3) 1px, transparent 1.5px) 0 0 / 8px 2px repeat-x;
    opacity: 0.6;
  }

  .lab { display: flex; align-items: center; justify-content: space-between; gap: 10px; }
  .lab b { font-size: 14px; font-weight: 600; color: var(--rj-ink); }
  ul { list-style: none; margin: 0; padding: 0; display: grid; gap: 7px; font-size: 14px; line-height: 1.45; color: var(--rj-ink-2); }
  li { display: grid; grid-template-columns: 16px minmax(0, 1fr); gap: 6px; }
  li::before { content: "✓"; font-weight: 700; color: var(--rj-pass); }

  a {
    justify-self: start;
    display: inline-flex;
    align-items: center;
    gap: 6px;
    margin-top: 4px;
    padding-bottom: 1px;
    border-bottom: 1px solid var(--rj-ink);
    font-size: 14px;
    font-weight: 600;
    color: var(--rj-ink);
    text-decoration: none;

    svg { width: 14px; height: 14px; }
    &:hover { color: var(--rj-ink); }
    &:focus-visible { outline: 2px solid var(--rj-ink); outline-offset: 3px; border-radius: 3px; }
  }

  @media (min-width: 640px) {
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
    .name { grid-column: 1 / -1; padding: 20px 22px 4px; }
    .half { padding: 16px 22px 22px; ${({ $one }) => $one && "grid-column: 1 / -1;"} }
    .free::after { left: auto; right: -1px; top: 14px; bottom: 14px; width: 2px; height: auto; background-size: 2px 8px; background-repeat: repeat-y; }
  }

  @media (min-width: 1000px) {
    grid-template-columns: 240px minmax(0, 1fr) minmax(0, 1fr);
    .name { grid-column: auto; padding: 22px 24px; border-right: 1px solid var(--rj-line); }
    .half { ${({ $one }) => $one && "grid-column: 2 / -1;"} }
  }
`;

const Tag = styled.span<{ $free?: boolean }>`
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

const Facts = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: 1px;
  overflow: hidden;
  border-radius: 20px;
  background: var(--rj-line);
  box-shadow: 0 0 0 1px var(--rj-line);

  @media (min-width: 640px) { grid-template-columns: repeat(2, 1fr); }
  @media (min-width: 1000px) { grid-template-columns: repeat(3, 1fr); }

  li { display: grid; gap: 8px; align-content: start; padding: 20px 18px 22px; background: var(--rj-surface); }
  .k { font: 600 10.5px/1 var(--rj-mono); letter-spacing: 0.08em; text-transform: uppercase; color: var(--rj-ink-3); }
  b { font-size: 19px; line-height: 1.2; letter-spacing: -0.025em; color: var(--rj-ink); }
  span:last-child { font-size: 14px; line-height: 1.5; color: var(--rj-ink-2); }
`;

const End = styled.div`
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

  a {
    height: 50px;
    padding: 0 24px;
    display: inline-flex;
    align-items: center;
    gap: 8px;
    border-radius: 999px;
    font-weight: 600;
    color: #0d0e10;
    background: #f2f2ef;
    text-decoration: none;

    svg { width: 15px; height: 15px; }
    &:hover { color: #0d0e10; }
    &:focus-visible { outline: 2px solid #f2f2ef; outline-offset: 3px; }
  }
`;

const Arrow = () => (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M3 8h10M9 4l4 4-4 4" />
  </svg>
);

function HalfView({ half, className }: { half: Half; className: string }) {
  return (
    <div className={`half ${className}`}>
      <div className="lab">
        <b>{half.title}</b>
        <Tag $free={half.free}>{half.tag}</Tag>
      </div>
      <ul>
        {half.items.map((item) => <li key={item}>{item}</li>)}
      </ul>
      {half.link && <Link href={half.link.href}>{half.link.label} <Arrow /></Link>}
    </div>
  );
}

export function PricingDetails() {
  return (
    <>
      <Section aria-labelledby="pp-tools">
        <In>
          <div>
            <p className="eyebrow">Free and paid, tool by tool</p>
            <h2 id="pp-tools">Free shows you the problem. A credit fixes it.</h2>
          </div>
          <Tickets>
            {TOOLS.map((t) => (
              <Ticket key={t.name} $one={!(t.free && t.paid)} aria-label={t.name}>
                <div className="name">
                  <h3>{t.name}</h3>
                  <p>{t.question}</p>
                </div>
                {t.free && <HalfView half={t.free} className="free" />}
                {t.paid && <HalfView half={t.paid} className="paid" />}
              </Ticket>
            ))}
          </Tickets>
        </In>
      </Section>

      <Section aria-labelledby="pp-facts">
        <In>
          <div>
            <p className="eyebrow">Billing</p>
            <h2 id="pp-facts">The fine print, in large print.</h2>
          </div>
          <Facts>
            {FACTS.map((f) => (
              <li key={f.k}>
                <span className="k">{f.k}</span>
                <b>{f.title}</b>
                <span>{f.text}</span>
              </li>
            ))}
          </Facts>
        </In>
      </Section>

      <Section aria-labelledby="pp-faq">
        <In $faq>
          <div className="head">
            <p className="eyebrow">Pricing FAQ</p>
            <h2 id="pp-faq">Straight answers.</h2>
          </div>
          <ShortAnswerFaq items={PRICING_FAQS} idPrefix="pp-faq" />
        </In>
      </Section>

      <Section aria-label="Start free">
        <In>
          <End>
            <p>Start free. <span>Pay when a job is worth it.</span></p>
            <Link href={ROUTES.PUBLIC.ATS_CHECK}>Scan my resume free <Arrow /></Link>
          </End>
        </In>
      </Section>
    </>
  );
}

export default PricingDetails;
