"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import styled from "styled-components";
import { ROUTES } from "@/lib/constants";
import { initialCVState, useCVStore } from "@/components/cv-builder/store";
import { MISTAKE_TAG } from "@/lib/roleExamples/copy";
import { plainCV } from "@/lib/roleExamples/plain";
import type { RoleScores } from "@/lib/roleExamples/score";
import type { Mistake, RoleExample } from "@/lib/roleExamples/types";
import { BeforeAfter } from "./BeforeAfter";

/*
 * /resume/[role]: a first-job resume guide built around one fictional new
 * grad's before and after. Every score on the page comes from score.ts.
 */

const Root = styled.div`
  background: var(--rj-paper);
  color: var(--rj-ink);
  font-family: var(--rj-font);
  -webkit-font-smoothing: antialiased;
  padding-top: calc(60px + env(safe-area-inset-top, 0px));

  .eyebrow { margin: 0; font: 500 11.5px/1.3 var(--rj-mono); letter-spacing: 0.07em; text-transform: uppercase; color: var(--rj-ink-2); }
  .title mark, h1 mark { padding: 0 0.06em; margin: 0 -0.03em; border-radius: 0.08em; color: var(--rj-hl-ink); background: linear-gradient(transparent 14%, var(--rj-hl) 14%, var(--rj-hl) 90%, transparent 90%); -webkit-box-decoration-break: clone; box-decoration-break: clone; }
  .title { margin: 10px 0 0; font-size: clamp(30px, 6.4vw, 48px); font-weight: 700; line-height: 1.05; letter-spacing: -0.045em; color: var(--rj-ink); text-wrap: balance; }
  .lede { margin: 14px 0 0; max-width: 36em; font-size: 17px; line-height: 1.55; color: var(--rj-ink-2); }
`;

const In = styled.div`
  max-width: 1240px;
  margin: 0 auto;
  padding: 0 max(20px, env(safe-area-inset-right, 0px)) 72px max(20px, env(safe-area-inset-left, 0px));

  @media (min-width: 640px) { padding: 0 40px 96px; }
`;

const Hero = styled.header`
  padding-top: 48px;
  display: grid;
  gap: 28px;

  @media (min-width: 640px) { padding-top: 72px; }
  @media (min-width: 1000px) { grid-template-columns: minmax(0, 1fr) 360px; align-items: end; gap: 56px; }

  h1 { margin: 12px 0 0; font-size: clamp(40px, 9vw, 72px); font-weight: 700; line-height: 1.02; letter-spacing: -0.05em; color: var(--rj-ink); text-wrap: balance; }
  .sub { margin: 18px 0 0; max-width: 34em; font-size: clamp(17px, 2.2vw, 19px); line-height: 1.55; color: var(--rj-ink-2); }
  .ctas { margin-top: 26px; display: flex; flex-wrap: wrap; align-items: center; gap: 12px 18px; }
`;

const Btn = styled.button`
  height: 50px;
  padding: 0 22px;
  display: inline-flex;
  align-items: center;
  border: 0;
  border-radius: 999px;
  font: 600 16px var(--rj-font);
  color: var(--rj-btn-ink);
  background: var(--rj-btn);
  cursor: pointer;

  &:focus-visible { outline: 2px solid var(--rj-ink); outline-offset: 3px; }
`;

const TextLink = styled(Link)`
  font: 600 15px var(--rj-font);
  color: var(--rj-ink);
  text-decoration: underline;
  text-decoration-color: var(--rj-line);
  text-underline-offset: 4px;

  &:hover { color: var(--rj-ink); text-decoration-color: var(--rj-ink); }
`;

const Facts = styled.ul`
  margin: 0;
  padding: 0;
  list-style: none;
  display: grid;
  gap: 1px;
  border-radius: 18px;
  overflow: hidden;
  background: var(--rj-line);
  box-shadow: 0 0 0 1px var(--rj-line);

  li { padding: 14px 16px; display: grid; grid-template-columns: auto 1fr; gap: 2px 12px; background: var(--rj-surface); }
  b { grid-row: 1 / 3; align-self: center; min-width: 52px; font: 700 22px/1 var(--rj-font); letter-spacing: -0.03em; color: var(--rj-ink); }
  span { font-size: 14px; font-weight: 600; color: var(--rj-ink); }
  small { font-size: 12.5px; color: var(--rj-ink-3); }
`;

const Sec = styled.section`
  margin-top: 96px;

  @media (min-width: 1000px) { margin-top: 128px; }
`;

const Cols = styled.div`
  margin-top: 32px;
  display: grid;
  gap: 14px;

  @media (min-width: 900px) { grid-template-columns: repeat(3, 1fr); gap: 16px; }

  > div { padding: 22px; border-radius: 22px; background: var(--rj-surface); box-shadow: 0 0 0 1px var(--rj-line); }
  h3 { margin: 0; font-size: 20px; letter-spacing: -0.025em; color: var(--rj-ink); }
  > div > p { margin: 6px 0 0; font-size: 14px; line-height: 1.5; color: var(--rj-ink-2); }
  ul { list-style: none; margin: 16px 0 0; padding: 0; }
  li { padding: 12px 0; display: grid; gap: 4px; border-top: 1px solid var(--rj-line); }
  li b { font-size: 15px; font-weight: 600; color: var(--rj-ink); }
  li span { font-size: 14px; line-height: 1.5; color: var(--rj-ink-2); }
  em { justify-self: start; margin-top: 2px; padding: 3px 7px; border-radius: 6px; font: 600 10px/1.2 var(--rj-mono); font-style: normal; letter-spacing: 0.06em; text-transform: uppercase; color: var(--rj-ink-2); box-shadow: inset 0 0 0 1.2px var(--rj-line); }
  em.check { color: #0d0e10; background: var(--rj-hl); box-shadow: none; }
  em.see { color: var(--rj-ink); background: color-mix(in srgb, var(--rj-ink) 7%, transparent); box-shadow: none; }
`;

const Order = styled.ol`
  margin: 32px 0 0;
  padding: 0;
  list-style: none;
  display: grid;
  gap: 10px;
  counter-reset: o;

  @media (min-width: 900px) { grid-template-columns: repeat(4, 1fr); gap: 14px; }

  li { padding: 20px; border-radius: 20px; background: var(--rj-surface); box-shadow: 0 0 0 1px var(--rj-line); counter-increment: o; }
  li::before { content: "0" counter(o); font: 500 12px var(--rj-mono); color: var(--rj-ink-3); }
  b { display: block; margin-top: 8px; font-size: 18px; letter-spacing: -0.02em; color: var(--rj-ink); }
  span { display: block; margin-top: 6px; font-size: 14px; line-height: 1.5; color: var(--rj-ink-2); }
`;

const Lines = styled.div`
  margin-top: 32px;
  display: grid;
  gap: 12px;

  .line { padding: 18px 20px; border-radius: 20px; display: grid; gap: 10px; background: var(--rj-surface); box-shadow: 0 0 0 1px var(--rj-line); }
  @media (min-width: 900px) { .line { grid-template-columns: minmax(0, 1fr) 28px minmax(0, 1.4fr); align-items: center; gap: 18px; } }
  .was { font-size: 16px; color: var(--rj-ink-3); text-decoration: line-through; text-decoration-color: color-mix(in srgb, var(--rj-pen) 70%, transparent); }
  .arr { display: none; color: var(--rj-ink-3); }
  @media (min-width: 900px) { .arr { display: block; } }
  .now { font-size: 16.5px; line-height: 1.55; color: var(--rj-ink); }
  .foot { margin: 6px 0 0; font-size: 14px; color: var(--rj-ink-3); }
  button { margin: 0 2px; padding: 1px 8px; border: 0; border-radius: 7px; font: 500 13px var(--rj-mono); color: var(--rj-ink-2); background: color-mix(in srgb, var(--rj-hl) 25%, transparent); box-shadow: inset 0 0 0 1.5px var(--rj-hl); cursor: pointer; }
  button[aria-pressed="true"] { font: 650 15px var(--rj-font); color: #0d0e10; background: #fff3b0; }
  button:focus-visible { outline: 2px solid var(--rj-ink); outline-offset: 2px; }
`;

const Chips = styled.div`
  margin-top: 28px;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;

  span { height: 38px; padding: 0 14px; display: inline-flex; align-items: center; border-radius: 999px; font: 500 14.5px var(--rj-font); color: var(--rj-ink); background: var(--rj-surface); box-shadow: inset 0 0 0 1px var(--rj-line); }
`;

const Match = styled.div`
  margin-top: 20px;
  padding: 18px 20px;
  border-radius: 20px;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  background: var(--rj-surface);
  box-shadow: 0 0 0 1px var(--rj-line);

  p { margin: 0; max-width: 36em; font-size: 15px; line-height: 1.5; color: var(--rj-ink-2); }
  p b { color: var(--rj-ink); }
  a { height: 46px; padding: 0 20px; display: inline-flex; align-items: center; border-radius: 999px; font: 600 15px var(--rj-font); color: var(--rj-btn-ink); background: var(--rj-btn); text-decoration: none; }
  a:hover { color: var(--rj-btn-ink); }
  a:focus-visible { outline: 2px solid var(--rj-ink); outline-offset: 3px; }
`;

const End = styled.section`
  margin-top: 112px;
  padding: 40px 24px;
  border-radius: 28px;
  display: grid;
  gap: 18px;
  background: var(--rj-bridge);

  @media (min-width: 640px) { padding: 56px; }

  .title { margin: 0; color: var(--rj-bridge-ink); }
  .title mark { color: #0d0e10; }
  p { margin: 0; max-width: 34em; font-size: 16px; line-height: 1.55; color: var(--rj-bridge-ink-2); }
  .acts { display: flex; flex-wrap: wrap; align-items: center; gap: 12px 18px; }
  .go { height: 50px; padding: 0 22px; border: 0; border-radius: 999px; font: 600 16px var(--rj-font); color: #0d0e10; background: var(--rj-hl); cursor: pointer; }
  .go:focus-visible, .ln:focus-visible { outline: 2px solid var(--rj-bridge-ink); outline-offset: 3px; }
  .ln { font: 600 15px var(--rj-font); color: var(--rj-bridge-ink); text-underline-offset: 4px; }
  .ln:hover { color: var(--rj-bridge-ink); }
`;

const Others = styled.nav`
  margin-top: 40px;

  p { margin: 0 0 12px; font: 500 11.5px var(--rj-mono); letter-spacing: 0.07em; text-transform: uppercase; color: var(--rj-ink-3); }
  div { display: flex; flex-wrap: wrap; gap: 8px; }
  a { height: 36px; padding: 0 14px; display: inline-flex; align-items: center; border-radius: 999px; font: 500 14px var(--rj-font); color: var(--rj-ink); text-decoration: none; background: color-mix(in srgb, var(--rj-ink) 5%, transparent); }
  a:hover { color: var(--rj-ink); background: color-mix(in srgb, var(--rj-ink) 9%, transparent); }
  a:focus-visible { outline: 2px solid var(--rj-ink); outline-offset: 2px; }
`;

const Arrow = () => (
  <svg className="arr" width="28" height="14" viewBox="0 0 28 14" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M1 7h25M20 1l6 6-6 6" />
  </svg>
);

function Blank({ answer }: { answer: string }) {
  const [on, setOn] = useState(false);
  return (
    <button type="button" aria-pressed={on} aria-label={on ? answer : "A number you'd supply. Show the example's answer"} onClick={() => setOn((x) => !x)}>
      {on ? answer : "how many?"}
    </button>
  );
}

function MistakeCol({ title, text, items }: { title: string; text: string; items: Mistake[] }) {
  return (
    <div>
      <h3>{title}</h3>
      <p>{text}</p>
      <ul>
        {items.map((m) => (
          <li key={m.title}><b>{m.title}</b><span>{m.text}</span><em className={m.tag}>{MISTAKE_TAG[m.tag]}</em></li>
        ))}
      </ul>
    </div>
  );
}

export function RolePage({ example, scores, others }: { example: RoleExample; scores: RoleScores; others: { slug: string; title: string }[] }) {
  const router = useRouter();
  const name = example.person.first;
  const role = example.title.toLowerCase();

  // Open the example in the builder; the visitor edits from there.
  const edit = () => {
    // Don't silently replace a resume the visitor has been writing.
    const current = useCVStore.getState().cv;
    const theirs = current.contact.name.trim() && current.contact.name !== initialCVState.contact.name && current.contact.name !== example.after.contact.name;
    if (theirs && !window.confirm(`This replaces the resume in your builder (${current.contact.name}) with ${name}’s example. Continue?`)) return;
    useCVStore.getState().loadCV(plainCV(example.after));
    router.push(ROUTES.PUBLIC.CV_BUILDER);
  };

  const [h1a, h1mark, h1b] = example.hero.headline;
  const mistakes = example.mistakes.read.length + example.mistakes.match.length + example.mistakes.reader.length;

  return (
    <Root>
      <In>
        <Hero>
          <div>
            <p className="eyebrow">Resume guide · {example.title}</p>
            <h1>{h1a}<mark>{h1mark}</mark>{h1b}</h1>
            <p className="sub">{example.hero.sub}</p>
            <div className="ctas">
              <Btn type="button" onClick={edit}>Edit this example in the builder</Btn>
              <TextLink href={ROUTES.PUBLIC.ATS_CHECK}>Scan your resume, free</TextLink>
            </div>
          </div>
          <Facts aria-label="About the example">
            <li><b>{scores.before}</b><span>{name}’s first resume</span><small>{example.person.detail}</small></li>
            <li><b>{scores.after}</b><span>The one {example.person.pronoun} sent after</span><small>Same experience, one column</small></li>
            <li><b>19</b><span>Checks, the same as the free scan</span><small>Code, not AI. Fictional student.</small></li>
          </Facts>
        </Hero>

        <Sec aria-labelledby="ba-title">
          <p className="eyebrow">Before and after</p>
          <h2 className="title" id="ba-title">Same student, same experience. A resume an ATS can <mark>read</mark>.</h2>
          <p className="lede">{name}’s first resume, and the one sent after. The score is the same 19 checks as the free scan. Highlighted numbers are {name}’s own answers; nothing was made up.</p>
          <BeforeAfter example={example} scores={scores} />
        </Sec>

        <Sec aria-labelledby="mistakes-title">
          <p className="eyebrow">Common mistakes</p>
          <h2 className="title" id="mistakes-title">{mistakes === 12 ? "Twelve" : mistakes} mistakes, and who they trip up.</h2>
          <p className="lede">Most of these won’t get a resume rejected on their own. They make it harder to read, harder to find, or easier to skip. Each one says whether our scan checks it, whether you can see it above, or whether it’s simply good practice.</p>
          <Cols>
            <MistakeCol title="Can’t be read" text="The ATS gets the text wrong or doesn’t get it at all." items={example.mistakes.read} />
            <MistakeCol title="Can’t be matched" text="The text is there, but searches and filters miss it." items={example.mistakes.match} />
            <MistakeCol title="Loses the reader" text="A person reads it next, usually in seconds." items={example.mistakes.reader} />
          </Cols>
        </Sec>

        <Sec aria-labelledby="order-title">
          <p className="eyebrow">The order</p>
          <h2 className="title" id="order-title">How a first {role} resume is laid out.</h2>
          <Order>{example.order.map((o) => <li key={o.title}><b>{o.title}</b><span>{o.text}</span></li>)}</Order>
        </Sec>

        <Sec aria-labelledby="lines-title">
          <p className="eyebrow">Lines that work</p>
          <h2 className="title" id="lines-title">Say what you did. The numbers are yours.</h2>
          <p className="lede">Rejectly rewrites a line in the job post’s words and asks you for any number it needs. Tap a blank to see {name}’s answer.</p>
          <Lines>
            {example.rewrites.map((r) => {
              const parts = r.after.split("{n}");
              return (
                <div className="line" key={r.before}>
                  <span className="was">{r.before}</span>
                  <Arrow />
                  <span className="now">{parts.map((p, i) => <span key={i}>{p}{i < r.answers.length && <Blank answer={r.answers[i]} />}</span>)}</span>
                </div>
              );
            })}
            <p className="foot">Use only numbers you can back up. If you don’t know one, leave the line without it.</p>
          </Lines>
        </Sec>

        <Sec aria-labelledby="skills-title">
          <p className="eyebrow">Skills</p>
          <h2 className="title" id="skills-title">Skills you’ll often see in entry-level posts.</h2>
          <p className="lede">A starting point, not a checklist. Use the ones the post asks for and you’ve actually used.</p>
          <Chips>{example.skills.map((s) => <span key={s}>{s}</span>)}</Chips>
          <Match>
            <p><b>Every post asks for different words.</b> Paste one and see which of its keywords your resume has and which are missing. Free.</p>
            <Link href="/#demo">Try the job match</Link>
          </Match>
        </Sec>

        <End aria-labelledby="end-title">
          <h2 className="title" id="end-title">Start from {name}’s resume. Make it <mark>yours</mark>.</h2>
          <p>Open the example in the resume builder, replace the details with yours, and watch the score as you go. No account until you download.</p>
          <div className="acts">
            <button className="go" type="button" onClick={edit}>Edit this example</button>
            <Link className="ln" href={ROUTES.PUBLIC.ATS_CHECK}>Or scan the resume you have</Link>
          </div>
        </End>

        <Others aria-label="Other roles">
          <p>Other first-job resumes</p>
          <div>{others.map((o) => <Link key={o.slug} href={`/resume/${o.slug}`}>{o.title}</Link>)}</div>
        </Others>
      </In>
    </Root>
  );
}

export default RolePage;
