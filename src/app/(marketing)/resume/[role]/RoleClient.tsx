"use client";

import styled, { css, keyframes } from "styled-components";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Footer } from "@/components/ui/Footer";
import { SecondaryCTA } from "@/components/marketing/SecondaryCTA";
import { ROUTES } from "@/lib/constants";
import type { RoleData } from "@/lib/resumeRoles";

// ─── Liquid glass primitives ─────────────────────────────────────────────────

const glass = css`
  position: relative;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.065), rgba(255, 255, 255, 0.03));
  -webkit-backdrop-filter: blur(24px) saturate(1.7);
  backdrop-filter: blur(24px) saturate(1.7);
  border-radius: 28px;
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.12),
    inset 0 0 0 1px rgba(255, 255, 255, 0.045),
    0 24px 48px -24px rgba(0, 0, 0, 0.5);
`;

const drift = keyframes`
  from { transform: translate3d(0, 0, 0); }
  to   { transform: translate3d(48px, -36px, 0); }
`;

const Page = styled.div<{ $hue: string; $rgb: string }>`
  --role: ${(p) => p.$hue};
  --role-rgb: ${(p) => p.$rgb};
  position: relative;
  min-height: 100vh;
  background: var(--bg-color);
  color: var(--text-color);
  overflow: clip;
`;

const Ambient = styled.div`
  position: absolute;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  overflow: hidden;
`;

const Blob = styled.div`
  position: absolute;
  border-radius: 50%;
  filter: blur(90px);
  animation: ${drift} 28s ease-in-out infinite alternate;

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`;

// ─── Hero ────────────────────────────────────────────────────────────────────

const Hero = styled.section`
  position: relative;
  z-index: 1;
  max-width: 1200px;
  margin: 0 auto;
  padding: 140px 24px 88px;
  display: grid;
  grid-template-columns: 1fr;
  gap: 72px;
  align-items: center;

  @media (min-width: 1024px) {
    grid-template-columns: 1fr 1.05fr;
    padding: 160px 24px 112px;
  }

  @media (max-width: 768px) {
    padding: 110px 20px 64px;
    gap: 56px;
  }
`;

const Kicker = styled.p`
  margin: 0 0 20px;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--role);
`;

const Title = styled.h1`
  margin: 0 0 24px;
  font-size: clamp(38px, 5vw, 58px);
  font-weight: 700;
  letter-spacing: -0.035em;
  line-height: 1.05;

  em {
    font-style: normal;
    color: var(--text-secondary);
  }
`;

const Lede = styled.p`
  margin: 0 0 36px;
  font-size: 18px;
  line-height: 1.7;
  color: var(--text-secondary);
  max-width: 52ch;

  @media (max-width: 768px) {
    font-size: 16px;
  }
`;

const CtaRow = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 24px;
`;

const PrimaryCta = styled(Link)`
  ${glass};
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 15px 30px;
  border-radius: 999px;
  font-size: 15px;
  font-weight: 600;
  text-decoration: none;
  color: #fff;
  background: linear-gradient(180deg, rgba(var(--role-rgb), 0.34), rgba(var(--role-rgb), 0.18));
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.22),
    inset 0 0 0 1px rgba(var(--role-rgb), 0.25),
    0 16px 40px -16px rgba(var(--role-rgb), 0.45);
  transition: transform 0.25s ease, box-shadow 0.25s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow:
      inset 0 1px 0 rgba(255, 255, 255, 0.28),
      inset 0 0 0 1px rgba(var(--role-rgb), 0.35),
      0 22px 48px -16px rgba(var(--role-rgb), 0.55);
  }

  svg {
    width: 17px;
    height: 17px;
  }
`;

const QuietLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 15px;
  font-weight: 500;
  color: var(--text-secondary);
  text-decoration: none;
  transition: color 0.2s ease;

  &:hover {
    color: var(--text-color);
  }

  svg {
    width: 15px;
    height: 15px;
  }
`;

// ─── The annotated resume artifact ───────────────────────────────────────────

const ArtifactWrap = styled.div`
  position: relative;
`;

const ScoreChip = styled(motion.div)`
  ${glass};
  position: absolute;
  top: -18px;
  right: 12px;
  z-index: 2;
  display: flex;
  align-items: baseline;
  gap: 8px;
  padding: 10px 18px;
  border-radius: 999px;

  .label {
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--text-secondary);
  }

  .value {
    font-size: 20px;
    font-weight: 700;
    letter-spacing: -0.02em;
    color: var(--role);
  }
`;

const Doc = styled.div`
  ${glass};
  padding: 30px 32px;
  font-size: 12.5px;
  line-height: 1.55;

  @media (max-width: 480px) {
    padding: 24px 20px;
    font-size: 12px;
  }
`;

const DocName = styled.p`
  margin: 0;
  font-size: 17px;
  font-weight: 700;
  letter-spacing: -0.01em;

  em {
    font-style: normal;
    font-weight: 600;
    font-size: 12px;
    color: var(--role);
    margin-left: 8px;
  }
`;

const DocHeadline = styled.p`
  margin: 3px 0 0;
  font-size: 13px;
  font-weight: 600;
  color: var(--text-color);
`;

const DocMeta = styled.p`
  margin: 3px 0 0;
  color: var(--text-secondary);
`;

const DocLabel = styled.p`
  margin: 22px 0 10px;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--text-secondary);
  border-bottom: 1px solid var(--border-color);
  padding-bottom: 6px;
`;

const DocJob = styled.div`
  & + & {
    margin-top: 14px;
  }
`;

const DocJobHead = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 12px;
  font-weight: 600;

  .period {
    color: var(--text-secondary);
    font-weight: 400;
    white-space: nowrap;
  }
`;

const DocCompany = styled.p`
  margin: 1px 0 6px;
  color: var(--text-secondary);
`;

const DocBullets = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

const DocBullet = styled.li<{ $hot?: boolean }>`
  position: relative;
  padding-left: 14px;
  color: var(--text-secondary);

  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 8px;
    width: 4px;
    height: 4px;
    border-radius: 50%;
    background: var(--text-secondary);
    opacity: 0.5;
  }

  ${(p) =>
    p.$hot &&
    css`
      color: var(--text-color);
      background: linear-gradient(90deg, rgba(var(--role-rgb), 0.12), transparent 85%);
      border-radius: 6px;
      margin-left: -8px;
      padding: 3px 6px 3px 22px;

      &::before {
        left: 8px;
        top: 11px;
        background: var(--role);
        opacity: 1;
      }
    `}
`;

const SkillRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 6px;
`;

const Mark = styled.span`
  padding: 2px 8px;
  border-radius: 6px;
  background: rgba(var(--role-rgb), 0.14);
  color: var(--role);
  font-weight: 600;
  font-size: 11.5px;
  white-space: nowrap;
`;

const Pin = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 17px;
  height: 17px;
  border-radius: 50%;
  background: var(--role);
  color: #0c0d0e;
  font-size: 10.5px;
  font-weight: 700;
  margin-left: 8px;
  vertical-align: text-bottom;
  flex: none;
  box-shadow: 0 0 0 4px rgba(var(--role-rgb), 0.18);
`;

const Legend = styled.ol`
  list-style: none;
  margin: 26px 0 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;

  li {
    display: flex;
    align-items: flex-start;
    gap: 12px;
    font-size: 13.5px;
    line-height: 1.55;
    color: var(--text-secondary);

    ${Pin} {
      margin: 2px 0 0;
    }
  }
`;

// ─── Editorial sections ──────────────────────────────────────────────────────

const Section = styled.section`
  position: relative;
  z-index: 1;
  max-width: 1140px;
  margin: 0 auto;
  padding: 76px 24px;

  @media (max-width: 768px) {
    padding: 56px 20px;
  }
`;

const SectionGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 40px;

  @media (min-width: 960px) {
    grid-template-columns: 0.85fr 1.3fr;
    gap: 72px;
  }
`;

const SectionHeader = styled.div`
  @media (min-width: 960px) {
    position: sticky;
    top: 120px;
    align-self: start;
  }
`;

const H2 = styled.h2`
  margin: 0 0 18px;
  font-size: clamp(28px, 3.4vw, 38px);
  font-weight: 700;
  letter-spacing: -0.03em;
  line-height: 1.12;
`;

const SectionLead = styled.p`
  margin: 0;
  font-size: 16px;
  line-height: 1.7;
  color: var(--text-secondary);
  max-width: 42ch;
`;

const FailGroupLabel = styled.p`
  margin: 0 0 4px;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--role);

  &:not(:first-child) {
    margin-top: 36px;
  }
`;

const FailList = styled.ol`
  list-style: none;
  margin: 0;
  padding: 0;
`;

const FailItem = styled.li`
  display: flex;
  align-items: baseline;
  gap: 18px;
  padding: 16px 0;
  border-bottom: 1px solid var(--border-color);
  font-size: 15.5px;
  line-height: 1.6;
  color: var(--text-secondary);

  .num {
    font-family: 'SF Mono', ui-monospace, monospace;
    font-size: 12px;
    color: var(--text-secondary);
    opacity: 0.55;
    flex: none;
  }
`;

const RewritePanel = styled.div`
  ${glass};
  padding: 26px 28px;

  & + & {
    margin-top: 20px;
  }
`;

const RewriteLabel = styled.p<{ $after?: boolean }>`
  margin: 0 0 8px;
  font-size: 10.5px;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: ${(p) => (p.$after ? "var(--role)" : "var(--text-secondary)")};
`;

const RewriteBefore = styled.p`
  margin: 0 0 18px;
  font-size: 14.5px;
  line-height: 1.6;
  color: var(--text-secondary);
  opacity: 0.75;
`;

const RewriteAfter = styled.p`
  margin: 0;
  font-size: 15px;
  line-height: 1.65;
  color: var(--text-color);
  padding-left: 14px;
  border-left: 2px solid var(--role);
`;

const TipList = styled.ol`
  list-style: none;
  margin: 44px 0 0;
  padding: 0;
  counter-reset: tip;
`;

const TipItem = styled.li`
  counter-increment: tip;
  display: flex;
  align-items: baseline;
  gap: 18px;
  padding: 14px 0;
  border-bottom: 1px solid var(--border-color);
  font-size: 15px;
  line-height: 1.65;
  color: var(--text-secondary);

  &::before {
    content: counter(tip, decimal-leading-zero);
    font-family: 'SF Mono', ui-monospace, monospace;
    font-size: 12px;
    color: var(--role);
    flex: none;
  }
`;

const VocabPanel = styled.div`
  ${glass};
  padding: 28px 30px;
`;

const VocabNote = styled.p`
  margin: 18px 0 0;
  font-size: 13.5px;
  line-height: 1.6;
  color: var(--text-secondary);
`;

const ProductGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 20px;
  margin-top: 44px;

  @media (min-width: 760px) {
    grid-template-columns: 1fr 1fr;
  }
`;

const ProductPanel = styled.div`
  ${glass};
  padding: 28px 30px;

  h3 {
    margin: 0 0 6px;
    font-size: 18px;
    font-weight: 700;
    letter-spacing: -0.01em;
  }

  .caption {
    margin: 0 0 18px;
    font-size: 13px;
    color: var(--role);
    font-weight: 600;
  }

  ul {
    list-style: none;
    margin: 0;
    padding: 0;
  }

  li {
    padding: 10px 0;
    font-size: 14.5px;
    line-height: 1.6;
    color: var(--text-secondary);
    border-top: 1px solid var(--border-color);
  }
`;

const RelatedRow = styled.nav`
  margin-top: 44px;

  ul {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-wrap: wrap;
    gap: 10px 26px;
  }

  a {
    font-size: 14px;
    color: var(--text-secondary);
    text-decoration: none;
    transition: color 0.2s ease;

    &:hover {
      color: var(--text-color);
    }
  }
`;

// ─── Motion helper ───────────────────────────────────────────────────────────

function Reveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ type: "spring", stiffness: 110, damping: 20, delay }}
    >
      {children}
    </motion.div>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────────

interface RelatedRole {
  slug: string;
  title: string;
}

export function RoleClient({ role, related }: { role: RoleData; related: RelatedRole[] }) {
  const reduce = useReducedMotion();
  const { resume } = role;
  const pins: Record<string, number> = {};
  role.annotations.forEach((a, i) => {
    pins[a.anchor] = i + 1;
  });

  return (
    <Page $hue={role.hue} $rgb={role.hueRgb}>
      <Ambient aria-hidden="true">
        <Blob style={{ top: -140, left: -100, width: 580, height: 580, background: role.hue, opacity: 0.13 }} />
        <Blob style={{ top: 420, right: -180, width: 520, height: 520, background: role.hue, opacity: 0.09, animationDirection: "alternate-reverse", animationDuration: "36s" }} />
        <Blob style={{ top: "58%", left: "16%", width: 420, height: 420, background: "#ffffff", opacity: 0.035, animationDuration: "44s" }} />
      </Ambient>

      <Hero>
        <div>
          <Reveal>
            <Kicker>Resume Guide · {role.field}</Kicker>
            <Title>
              The {role.title} resume, <em>decoded.</em>
            </Title>
            <Lede>{role.description}</Lede>
            <CtaRow>
              <PrimaryCta href={ROUTES.PUBLIC.ATS_CHECK}>
                Score my resume — free <ArrowRight aria-hidden="true" />
              </PrimaryCta>
              <QuietLink href={ROUTES.PUBLIC.HOW_IT_WORKS}>
                How it works <ArrowRight aria-hidden="true" />
              </QuietLink>
            </CtaRow>
          </Reveal>
        </div>

        <ArtifactWrap>
          <ScoreChip
            initial={reduce ? false : { opacity: 0, scale: 0.85, y: 10 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 220, damping: 18, delay: 0.35 }}
          >
            <span className="label">ATS score</span>
            <span className="value">92</span>
          </ScoreChip>

          <Reveal delay={0.1}>
            <Doc aria-label={`Example ATS-optimized ${role.title} resume`}>
              <DocName>
                {resume.name}
                {resume.credentials && <em>{resume.credentials}</em>}
              </DocName>
              <DocHeadline>
                {resume.headline}
                <Pin aria-hidden="true">{pins.header}</Pin>
              </DocHeadline>
              <DocMeta>{resume.location}</DocMeta>

              <DocLabel>Experience</DocLabel>
              {resume.experience.map((job, ji) => (
                <DocJob key={job.company}>
                  <DocJobHead>
                    <span>{job.role}</span>
                    <span className="period">{job.period}</span>
                  </DocJobHead>
                  <DocCompany>{job.company}</DocCompany>
                  <DocBullets>
                    {job.bullets.map((b, bi) => (
                      <DocBullet key={bi} $hot={ji === 0 && bi === 0}>
                        {b}
                        {ji === 0 && bi === 0 && <Pin aria-hidden="true">{pins.bullet}</Pin>}
                      </DocBullet>
                    ))}
                  </DocBullets>
                </DocJob>
              ))}

              <DocLabel>Skills</DocLabel>
              <SkillRow>
                {resume.skills.map((s) => (
                  <Mark key={s}>{s}</Mark>
                ))}
                <Pin aria-hidden="true">{pins.skills}</Pin>
              </SkillRow>

              <DocLabel>Education</DocLabel>
              <DocMeta>{resume.education}</DocMeta>
            </Doc>

            <Legend>
              {role.annotations.map((a, i) => (
                <li key={a.anchor}>
                  <Pin aria-hidden="true">{i + 1}</Pin>
                  <span>{a.text}</span>
                </li>
              ))}
            </Legend>
          </Reveal>
        </ArtifactWrap>
      </Hero>

      <Section>
        <SectionGrid>
          <SectionHeader>
            <Reveal>
              <Kicker>The problem</Kicker>
              <H2>Where {role.title.toLowerCase()} resumes die.</H2>
              <SectionLead>
                Before a recruiter ever sees your resume, parsing and ranking software decides
                whether they will. For {role.title.toLowerCase()}s, these are the failure points.
              </SectionLead>
            </Reveal>
          </SectionHeader>
          <div>
            <Reveal delay={0.05}>
              <FailGroupLabel>On the page</FailGroupLabel>
              <FailList>
                {role.challenges.map((c, i) => (
                  <FailItem key={i}>
                    <span className="num">{String(i + 1).padStart(2, "0")}</span>
                    {c}
                  </FailItem>
                ))}
              </FailList>
              <FailGroupLabel>Inside the ATS</FailGroupLabel>
              <FailList>
                {role.atsIssues.map((a, i) => (
                  <FailItem key={i}>
                    <span className="num">{String(role.challenges.length + i + 1).padStart(2, "0")}</span>
                    {a}
                  </FailItem>
                ))}
              </FailList>
            </Reveal>
          </div>
        </SectionGrid>
      </Section>

      <Section>
        <SectionGrid>
          <SectionHeader>
            <Reveal>
              <Kicker>The fix</Kicker>
              <H2>Same experience. Different resume.</H2>
              <SectionLead>
                Ranking algorithms reward specificity: metrics, named tools, scale. Here is the
                same line from a {role.title.toLowerCase()} resume, before and after.
              </SectionLead>
            </Reveal>
          </SectionHeader>
          <div>
            {role.rewrites.map((r, i) => (
              <Reveal key={i} delay={i * 0.08}>
                <RewritePanel>
                  <RewriteLabel>Before</RewriteLabel>
                  <RewriteBefore>{r.before}</RewriteBefore>
                  <RewriteLabel $after>After</RewriteLabel>
                  <RewriteAfter>{r.after}</RewriteAfter>
                </RewritePanel>
              </Reveal>
            ))}
            <Reveal delay={0.16}>
              <TipList>
                {role.tips.map((t, i) => (
                  <TipItem key={i}>{t}</TipItem>
                ))}
              </TipList>
            </Reveal>
          </div>
        </SectionGrid>
      </Section>

      <Section>
        <SectionGrid>
          <SectionHeader>
            <Reveal>
              <Kicker>The vocabulary</Kicker>
              <H2>The words the machine listens for.</H2>
              <SectionLead>
                These are the exact terms ATS filters scan {role.title.toLowerCase()} applications
                for. If a keyword genuinely describes your experience, it belongs on the page —
                verbatim.
              </SectionLead>
            </Reveal>
          </SectionHeader>
          <div>
            <Reveal delay={0.05}>
              <VocabPanel>
                <DocLabel as="p" style={{ marginTop: 0 }}>
                  Skills
                </DocLabel>
                <SkillRow>
                  {role.keywords.map((k) => (
                    <Mark key={k}>{k}</Mark>
                  ))}
                </SkillRow>
                <VocabNote>
                  Filters match exact strings. Write &ldquo;{role.keywords[0]}&rdquo;, not a synonym —
                  and keep abbreviations next to their expansions.
                </VocabNote>
              </VocabPanel>
            </Reveal>
          </div>
        </SectionGrid>
      </Section>

      <Section>
        <Reveal>
          <Kicker>The product</Kicker>
          <H2 style={{ maxWidth: "22ch" }}>
            Rejectly reads your resume the way the machine does. Then fixes it.
          </H2>
        </Reveal>
        <ProductGrid>
          <Reveal delay={0.05}>
            <ProductPanel>
              <h3>Job Match Analysis</h3>
              <p className="caption">For a specific {role.title} posting</p>
              <ul>
                <li>Paste a {role.title.toLowerCase()} job description</li>
                <li>Get a fully rewritten resume matching that specific role</li>
                <li>Every keyword, achievement, and bullet point optimized</li>
              </ul>
            </ProductPanel>
          </Reveal>
          <Reveal delay={0.12}>
            <ProductPanel>
              <h3>ATS Optimizer</h3>
              <p className="caption">No job description needed</p>
              <ul>
                <li>Tests against Workday, Greenhouse, Taleo &amp; Lever</li>
                <li>Finds the parsing failures that silently reject you</li>
                <li>One-click optimization with downloadable PDF</li>
              </ul>
            </ProductPanel>
          </Reveal>
        </ProductGrid>

        <Reveal delay={0.1}>
          <RelatedRow aria-label="More resume guides">
            <ul>
              {related.map((r) => (
                <li key={r.slug}>
                  <Link href={`/resume/${r.slug}`}>{r.title} Resume</Link>
                </li>
              ))}
              <li>
                <Link href={ROUTES.PUBLIC.ATS_CHECK}>Free ATS Check</Link>
              </li>
              <li>
                <Link href={ROUTES.PUBLIC.CV_BUILDER}>Free CV Builder</Link>
              </li>
            </ul>
          </RelatedRow>
        </Reveal>
      </Section>

      <SecondaryCTA />
      <Footer />
    </Page>
  );
}
