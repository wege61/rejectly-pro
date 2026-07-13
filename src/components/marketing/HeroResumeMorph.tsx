"use client";

import { useEffect, useReducer, useState } from "react";
import styled from "styled-components";
import { motion, useReducedMotion } from "framer-motion";

/**
 * Hero visual: a Canva-style résumé rebuilding itself into the single-column,
 * ATS-parseable document that the CV builder actually outputs.
 *
 * Every block lives at a fixed slot in a CANVAS_W x CANVAS_H design canvas and
 * animates between two coordinate sets — `canva` and `ats`. Morphing explicit
 * coordinates (rather than relying on layout animations across a changing DOM
 * tree) keeps the reflow predictable: the sidebar collapses, and the blocks it
 * held fly into their correct order in the single column.
 *
 * The "after" state mirrors src/components/cv-builder/CVPreview.tsx — white A4
 * paper, uppercase underlined section titles in the theme colour, and the
 * section order Summary → Experience → Education → Skills → Languages.
 */

// Roughly A4, and the type scale below is set against this width.
const CANVAS_W = 460;
const CANVAS_H = 660;

/**
 * Type scale, in canvas px. Taken from the proportions of a real Canva template
 * (a 1050px-wide page): body text is ~1.6% of the page width, section headings
 * ~2.5%, the name ~5.5%. Sizing these by eye is what made earlier versions look
 * like a poster rather than a résumé — headings ballooned and the page read as
 * half-empty. Keep the ratios; do not nudge individual values.
 */
const T = {
  name: 26,
  role: 12,
  heading: 11.5,
  sidebarHeading: 10.5,
  jobTitle: 9,
  meta: 7.4,
  body: 7.4,
  small: 6.4,
} as const;

/** The "after" document, matching CVPreview's 780px paper scaled to the canvas. */
const A = {
  name: 19,
  heading: 8.4,
  jobTitle: 8.4,
  meta: 6.9,
  body: 7.4,
  chip: 6.9,
} as const;

/**
 * Callouts sit on the paper's outer margin and spill past its edge, rather than
 * in full-width gutters — gutters wide enough to hold them shrank the résumé too
 * far. The content columns stop short of the paper edge so a label's overlap
 * always lands on blank margin, never on text.
 */
const LABEL_W = 118;
const OVERHANG = 70;
const PAPER_X = OVERHANG;
const STAGE_W = CANVAS_W + OVERHANG * 2;

/** Left edge of the single-column document — clears the left-hand label. */
const CONTENT_LEFT = 52;
/** Right edge of every text column — sits clear of the right-hand labels. */
const CONTENT_RIGHT = 404;

/** Narrower than this there is nowhere for a label to go — drop the callouts. */
const MIN_WIDTH_FOR_CALLOUTS = 520;

const NAVY = "#2C3A55";
const TEAL = "#35A29F";
const INK = "#1A1A1A";
const MUTED = "#6B7280";
const FAINT = "#9AA1AC";
const RED = "#EE5A5A";
const GREEN = "#10B981";

type Phase = "canva" | "ats";

// ---------- callouts ----------

type Callout = {
  id: string;
  phase: Phase;
  side: "left" | "right";
  title: string;
  sub: string;
  /** Top of the label, in canvas units. */
  y: number;
  /** The point the arrow lands on, in *paper* coordinates. */
  target: { x: number; y: number };
};

const CALLOUTS: Callout[] = [
  // --- what the ATS chokes on, before ---
  {
    id: "metrics",
    phase: "canva",
    side: "right",
    title: "No metrics",
    sub: "Duties, not results",
    y: 170,
    target: { x: 380, y: 272 },
  },
  {
    id: "refs",
    phase: "canva",
    side: "right",
    title: "References",
    sub: "ATS ignores this",
    y: 440,
    target: { x: 300, y: 562 },
  },
  {
    id: "columns",
    phase: "canva",
    side: "left",
    // Lands inside the navy sidebar, not in the white gap beside it — the arrow
    // has to touch the column it is accusing.
    title: "Two columns",
    sub: "Parser reads out of order",
    y: 578,
    target: { x: 95, y: 465 },
  },

  // --- what it gets right, after ---
  {
    id: "quantified",
    phase: "ats",
    side: "right",
    title: "Quantified",
    sub: "Results, not duties",
    y: 175,
    target: { x: 380, y: 222 },
  },
  {
    id: "keywords",
    phase: "ats",
    side: "right",
    title: "ATS keywords",
    sub: "Matched to the job",
    y: 466,
    target: { x: 330, y: 498 },
  },
  {
    id: "single",
    phase: "ats",
    side: "left",
    title: "Single column",
    sub: "Parses top to bottom",
    y: 300,
    target: { x: 66, y: 270 },
  },
];

const labelX = (c: Callout) => (c.side === "left" ? 0 : STAGE_W - LABEL_W);

/** Where the leader line leaves the label — the edge that faces the paper. */
const anchorOf = (c: Callout) => ({
  x: c.side === "left" ? LABEL_W : labelX(c),
  y: c.y + 22,
});

/** Arrow tip, converted from paper coordinates into the wider stage canvas. */
const tipOf = (c: Callout) => ({ x: PAPER_X + c.target.x, y: c.target.y });

// ---------- layout ----------

/** left/top/width in design-canvas px, plus opacity. */
type Slot = { x: number; y: number; w: number; o?: number };

const SIDE_X = 20;
const SIDE_W = 126;
const MAIN_X = 180;
const MAIN_W = CONTENT_RIGHT - MAIN_X;
const ATS_W = CONTENT_RIGHT - CONTENT_LEFT;

/** Blocks that live in the sidebar before, and in the single column after. */
const flying = (canvaY: number, atsY: number): Record<Phase, Slot> => ({
  canva: { x: SIDE_X, y: canvaY, w: SIDE_W },
  ats: { x: CONTENT_LEFT, y: atsY, w: ATS_W },
});

/** Blocks that stay in the main column, but reflow to full width. */
const staying = (canvaY: number, atsY: number): Record<Phase, Slot> => ({
  canva: { x: MAIN_X, y: canvaY, w: MAIN_W },
  ats: { x: CONTENT_LEFT, y: atsY, w: ATS_W },
});

const SLOTS: Record<string, Record<Phase, Slot>> = {
  sidebar: {
    canva: { x: 0, y: 0, w: 165 },
    ats: { x: 0, y: 0, w: 0, o: 0 },
  },
  photo: {
    canva: { x: 35, y: 26, w: 96 },
    ats: { x: 35, y: 10, w: 96, o: 0 },
  },
  contact: flying(158, 62),
  name: staying(30, 22),
  rule: {
    canva: { x: MAIN_X, y: 96, w: MAIN_W, o: 0 },
    ats: { x: CONTENT_LEFT, y: 80, w: ATS_W, o: 1 },
  },
  summary: staying(108, 92),
  expTitle: staying(202, 156),
  exp1: staying(236, 182),
  exp2: staying(356, 274),
  exp3: staying(458, 336),
  education: flying(268, 386),
  skills: flying(380, 470),
  languages: flying(510, 540),
  references: {
    canva: { x: MAIN_X, y: 544, w: MAIN_W },
    ats: { x: CONTENT_LEFT, y: 620, w: ATS_W, o: 0 },
  },
};

const EASE = [0.22, 1, 0.36, 1] as const;

const Block: React.FC<{
  slot: keyof typeof SLOTS;
  phase: Phase;
  delay?: number;
  children: React.ReactNode;
}> = ({ slot, phase, delay = 0, children }) => {
  const target = SLOTS[slot][phase];

  return (
    <motion.div
      initial={false}
      animate={{
        x: target.x,
        y: target.y,
        width: target.w,
        opacity: target.o ?? 1,
      }}
      transition={{ duration: 0.9, ease: EASE, delay }}
      style={{ position: "absolute", top: 0, left: 0 }}
      data-slot={slot}
    >
      {children}
    </motion.div>
  );
};

/** Cross-fades the "before" wording with the "after" wording in place. */
const Swap: React.FC<{
  phase: Phase;
  canva: React.ReactNode;
  ats: React.ReactNode;
  delay?: number;
}> = ({ phase, canva, ats, delay = 0 }) => (
  <div style={{ position: "relative" }}>
    <motion.div
      initial={false}
      animate={{ opacity: phase === "canva" ? 1 : 0 }}
      transition={{ duration: 0.3, delay: phase === "canva" ? delay : 0 }}
    >
      {canva}
    </motion.div>
    <motion.div
      initial={false}
      animate={{ opacity: phase === "ats" ? 1 : 0 }}
      transition={{ duration: 0.4, delay: phase === "ats" ? delay : 0 }}
      style={{ position: "absolute", inset: 0 }}
    >
      {ats}
    </motion.div>
  </div>
);

// ---------- primitives ----------

const CanvaHeading = styled.div<{ $onNavy?: boolean }>`
  font-size: ${({ $onNavy }) => ($onNavy ? T.sidebarHeading : T.heading)}px;
  font-weight: 700;
  letter-spacing: ${({ $onNavy }) => ($onNavy ? "1.4px" : "0")};
  color: ${({ $onNavy }) => ($onNavy ? "#FFFFFF" : INK)};
  padding-bottom: 5px;
  margin-bottom: 8px;
  border-bottom: 1px solid
    ${({ $onNavy }) => ($onNavy ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.75)")};
`;

/** Matches SectionTitle in CVPreview: uppercase, tracked, themed, underlined. */
const AtsHeading = styled.div`
  font-size: ${A.heading}px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.8px;
  color: ${TEAL};
  padding-bottom: 3px;
  margin-bottom: 6px;
  border-bottom: 1px solid ${TEAL}55;
`;

const BulletRow = styled.div<{ $strong?: boolean }>`
  display: flex;
  gap: 5px;
  font-size: ${T.body}px;
  line-height: 1.5;
  color: ${({ $strong }) => ($strong ? INK : "#3F3F46")};
  margin-bottom: 4px;

  &::before {
    content: "•";
    color: ${({ $strong }) => ($strong ? TEAL : "rgba(0,0,0,0.5)")};
    flex-shrink: 0;
  }

  b {
    color: ${TEAL};
    font-weight: 700;
  }
`;

/**
 * The row is a flex container (for the hanging bullet), so the text has to live
 * in a single child — otherwise every <b> becomes its own flex item and the
 * `gap` opens a space before the punctuation that follows it.
 */
const Bullet: React.FC<{ $strong?: boolean; children: React.ReactNode }> = ({
  $strong,
  children,
}) => (
  <BulletRow $strong={$strong}>
    <span>{children}</span>
  </BulletRow>
);

/** One job in the "before" résumé: dates, company, title, duties. */
const CanvaJob: React.FC<{
  dates: string;
  company: string;
  title: string;
  duties: string[];
}> = ({ dates, company, title, duties }) => (
  <>
    <div style={{ fontSize: T.meta, color: MUTED, lineHeight: 1.4 }}>
      {dates}
    </div>
    <div style={{ fontSize: T.meta, color: MUTED, lineHeight: 1.4 }}>
      {company}
    </div>
    <div
      style={{
        fontSize: T.jobTitle,
        color: INK,
        margin: "3px 0 5px",
        lineHeight: 1.3,
      }}
    >
      {title}
    </div>
    {duties.map((d) => (
      <Bullet key={d}>{d}</Bullet>
    ))}
  </>
);

/** The same job, rewritten: title first, then quantified outcomes. */
const AtsJob: React.FC<{
  title: string;
  meta: string;
  wins: React.ReactNode[];
}> = ({ title, meta, wins }) => (
  <>
    <div style={{ fontSize: A.jobTitle, fontWeight: 700, color: INK }}>
      {title}
    </div>
    <div
      style={{
        fontSize: A.meta,
        color: MUTED,
        margin: "1px 0 5px",
      }}
    >
      {meta}
    </div>
    {wins.map((w, i) => (
      <Bullet key={i} $strong>
        {w}
      </Bullet>
    ))}
  </>
);

const Flag = styled(motion.div)<{ $good?: boolean }>`
  position: absolute;
  width: ${LABEL_W}px;
  padding: 7px 9px;
  border-radius: 7px;
  background: ${({ $good }) => ($good ? GREEN : RED)};
  color: #fff;
  box-shadow: 0 6px 18px
    ${({ $good }) =>
      $good ? "rgba(16,185,129,0.45)" : "rgba(238,90,90,0.45)"};
  z-index: 20;

  .title {
    display: flex;
    align-items: center;
    gap: 4px;
    font-size: 11.5px;
    font-weight: 800;
    line-height: 1.2;
  }

  .sub {
    font-size: 9.5px;
    font-weight: 500;
    line-height: 1.3;
    opacity: 0.92;
    margin-top: 2px;
  }
`;

// ---------- shell ----------

const Stage = styled.div`
  width: 100%;
  max-width: 620px;
  margin: 0 auto;
  position: relative;
`;

/** Holds the paper + labels at design size; scaled as one unit to fit the column. */
const Scaler = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  height: ${CANVAS_H}px;
  transform-origin: top left;
`;

const Paper = styled.div<{ $x: number }>`
  position: absolute;
  top: 0;
  left: ${({ $x }) => $x}px;
  width: ${CANVAS_W}px;
  height: ${CANVAS_H}px;
  /* The hero centres its text; the résumé is a document and must not inherit that. */
  text-align: left;
  background: #ffffff;
  border-radius: 6px;
  overflow: hidden;
  font-family: "Inter", system-ui, -apple-system, sans-serif;
  box-shadow:
    0 30px 70px -20px rgba(0, 0, 0, 0.75),
    0 0 0 1px rgba(255, 255, 255, 0.12);
`;

const ScoreBadge = styled(motion.div)<{ $good: boolean }>`
  position: absolute;
  top: 14px;
  right: 14px;
  z-index: 30;
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 5px 10px;
  border-radius: 999px;
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 0.3px;
  color: #fff;
  background: ${({ $good }) => ($good ? GREEN : RED)};
  box-shadow: 0 6px 18px
    ${({ $good }) => ($good ? "rgba(16,185,129,0.45)" : "rgba(238,90,90,0.45)")};
`;

// ---------- content ----------

const CONTACT = [
  "hello@reallygreatsite.com",
  "+123-456-7890",
  "123 Anywhere St., Any City",
  "reallygreatsite.com",
];

const SKILLS = [
  "ROI Calculations",
  "Social media marketing",
  "Product development lifecycle",
  "Marketing strategy",
  "Product promotion",
  "Value Propositions",
];

const DEGREES = [
  { degree: "Master of Business", school: "Wardiere University", years: "2011 - 2015" },
  { degree: "BA Sales and Commerce", school: "Wardiere University", years: "2011 - 2015" },
];

const REFEREES = [
  { name: "Estelle Darcy", role: "Wardiere Inc. / CEO" },
  { name: "Harper Russo", role: "Wardiere Inc. / CEO" },
];

const KEYWORDS = [
  "SEO",
  "Marketing Strategy",
  "ROI Analysis",
  "HubSpot",
  "A/B Testing",
  "Brand Management",
  "Product Marketing",
];

// ---------- component ----------

export function HeroResumeMorph() {
  const reduceMotion = useReducedMotion();
  const [phase, setPhase] = useState<Phase>("canva");
  // Which set of callouts is up: the red faults, the green fixes, or neither
  // (during the morph itself, so nothing competes with the rebuild).
  const [markers, setMarkers] = useState<"none" | "bad" | "good">("none");
  // Lags `phase` so the score flips once the document has finished rebuilding,
  // not while it is still mid-morph — the payoff has to land last.
  const [scorePassing, setScorePassing] = useState(false);
  const [cycle, restart] = useReducer((n: number) => n + 1, 0);
  const [scale, setScale] = useState(1);
  const [showCallouts, setShowCallouts] = useState(false);

  // Fit the design canvas into whatever width the hero column gives us. Narrow
  // columns get the paper alone; only wide ones can afford the labels.
  useEffect(() => {
    const stage = document.getElementById("resume-morph-stage");
    if (!stage) return;

    const fit = () => {
      const available = stage.clientWidth;
      const withLabels = available >= MIN_WIDTH_FOR_CALLOUTS;
      setShowCallouts(withLabels);
      setScale(available / (withLabels ? STAGE_W : CANVAS_W));
    };
    fit();

    const observer = new ResizeObserver(fit);
    observer.observe(stage);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (reduceMotion) {
      setPhase("ats");
      setScorePassing(true);
      setMarkers("good");
      return;
    }

    // One timer list per cycle, all cleared together — no orphaned timeouts.
    const timers = [
      setTimeout(() => setMarkers("bad"), 700),
      setTimeout(() => {
        setMarkers("none");
        setPhase("ats");
      }, 2400),
      setTimeout(() => setScorePassing(true), 3300),
      setTimeout(() => setMarkers("good"), 3500),
      setTimeout(() => {
        setPhase("canva");
        setScorePassing(false);
        setMarkers("none");
      }, 6600),
      setTimeout(restart, 6900),
    ];

    return () => timers.forEach(clearTimeout);
  }, [cycle, reduceMotion]);

  /** A callout shows only when its own phase's marker set is the active one. */
  const isVisible = (c: Callout) =>
    showCallouts && markers === (c.phase === "canva" ? "bad" : "good");

  return (
    <Stage id="resume-morph-stage" style={{ height: CANVAS_H * scale }}>
      <Scaler
        style={{
          transform: `scale(${scale})`,
          width: showCallouts ? STAGE_W : CANVAS_W,
        }}
      >
        <Paper $x={showCallouts ? PAPER_X : 0}>
          {/* Navy sidebar — the thing that breaks the parser */}
          <Block slot="sidebar" phase={phase}>
            <div style={{ height: CANVAS_H, background: NAVY }} />
          </Block>

          <Block slot="photo" phase={phase}>
            <div
              style={{
                width: 96,
                height: 96,
                borderRadius: "50%",
                background: "#4A5A7A",
                border: "5px solid #3A4A66",
                boxShadow: "inset 0 0 20px rgba(0,0,0,0.3)",
              }}
            />
          </Block>

          {/* Contact: iconed list on navy → plain inline text line */}
          <Block slot="contact" phase={phase}>
            <Swap
              phase={phase}
              canva={
                <>
                  <CanvaHeading $onNavy>Contact</CanvaHeading>
                  {CONTACT.map((t) => (
                    <div
                      key={t}
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: 6,
                        marginBottom: 7,
                      }}
                    >
                      <div
                        style={{
                          width: 7,
                          height: 7,
                          marginTop: 2,
                          borderRadius: 1.5,
                          background: "rgba(255,255,255,0.55)",
                          flexShrink: 0,
                        }}
                      />
                      <span
                        style={{
                          fontSize: T.body,
                          lineHeight: 1.35,
                          color: "rgba(255,255,255,0.9)",
                        }}
                      >
                        {t}
                      </span>
                    </div>
                  ))}
                </>
              }
              ats={
                <div style={{ fontSize: A.body, color: MUTED }}>
                  {CONTACT.join("  ·  ")}
                </div>
              }
            />
          </Block>

          <Block slot="name" phase={phase}>
            <Swap
              phase={phase}
              canva={
                <>
                  <div
                    style={{
                      fontSize: T.name,
                      fontWeight: 800,
                      color: INK,
                      letterSpacing: -0.6,
                      lineHeight: 1,
                    }}
                  >
                    Olivia Wilson
                  </div>
                  <div
                    style={{
                      fontSize: T.role,
                      color: "#3F3F46",
                      marginTop: 5,
                      lineHeight: 1.2,
                    }}
                  >
                    Marketing Manager
                  </div>
                </>
              }
              ats={
                <div
                  style={{
                    fontSize: A.name,
                    fontWeight: 800,
                    color: TEAL,
                    letterSpacing: -0.3,
                  }}
                >
                  Olivia Wilson
                </div>
              }
            />
          </Block>

          {/* The 2px themed rule under the header in CVPreview */}
          <Block slot="rule" phase={phase}>
            <div style={{ height: 2, background: TEAL }} />
          </Block>

          {/* About Me (adjectives) → SUMMARY (facts) */}
          <Block slot="summary" phase={phase}>
            <Swap
              phase={phase}
              delay={0.25}
              canva={
                <>
                  <CanvaHeading>About Me</CanvaHeading>
                  <div
                    style={{
                      fontSize: T.body,
                      lineHeight: 1.55,
                      color: "#3F3F46",
                      textAlign: "justify",
                    }}
                  >
                    An experienced Marketing Manager with{" "}
                    <span style={{ color: RED, fontWeight: 600 }}>
                      exceptional skills
                    </span>{" "}
                    in creating marketing plans, launching products, promoting
                    them, and overseeing their development.{" "}
                    <span style={{ color: RED, fontWeight: 600 }}>
                      Excellent knowledge
                    </span>{" "}
                    of SE content creation, social media audience engagement, and
                    brand management.
                  </div>
                </>
              }
              ats={
                <>
                  <AtsHeading>Summary</AtsHeading>
                  <div
                    style={{ fontSize: A.body, lineHeight: 1.55, color: INK }}
                  >
                    Marketing Manager, 6 yrs. Multi-channel campaigns, SEO content
                    strategy, product marketing and brand management. Drove{" "}
                    <b style={{ color: TEAL }}>27% YoY pipeline growth</b> across
                    a <b style={{ color: TEAL }}>12K</b>-subscriber funnel.
                  </div>
                </>
              }
            />
          </Block>

          <Block slot="expTitle" phase={phase}>
            <Swap
              phase={phase}
              canva={<CanvaHeading>Work Experience</CanvaHeading>}
              ats={<AtsHeading>Experience</AtsHeading>}
            />
          </Block>

          {/* The money shot: duties → quantified outcomes */}
          <Block slot="exp1" phase={phase}>
            <Swap
              phase={phase}
              delay={0.3}
              canva={
                <CanvaJob
                  dates="Aug 2018 - present"
                  company="Timmerman Industries"
                  title="Marketing Manager"
                  duties={[
                    "Maintained and organized numerous office files",
                    "Constantly updated the company's contact and mailing lists",
                    "Monitored ongoing marketing campaigns",
                    "Monitored press coverage",
                  ]}
                />
              }
              ats={
                <AtsJob
                  title="Marketing Manager"
                  meta="Timmerman Industries · Aug 2018 – Present"
                  wins={[
                    <>
                      Centralized <b>200+</b> campaign assets, cutting retrieval
                      time <b>40%</b>
                    </>,
                    <>
                      Grew segmented mailing list to <b>12K</b>; open rate{" "}
                      <b>18% → 31%</b>
                    </>,
                    <>
                      Ran <b>14</b> multi-channel campaigns; <b>27%</b> YoY
                      pipeline growth
                    </>,
                    <>
                      Secured <b>18</b> earned-media placements in trade press
                    </>,
                  ]}
                />
              }
            />
          </Block>

          <Block slot="exp2" phase={phase}>
            <Swap
              phase={phase}
              delay={0.36}
              canva={
                <CanvaJob
                  dates="Jul 2015 - Aug 2018"
                  company="Timmerman Industries"
                  title="Marketing Assistant"
                  duties={[
                    "Handled the company's online presence – regularly updated the company's website and various social media accounts",
                    "Monitored ongoing marketing campaigns",
                  ]}
                />
              }
              ats={
                <AtsJob
                  title="Marketing Assistant"
                  meta="Timmerman Industries · Jul 2015 – Aug 2018"
                  wins={[
                    <>
                      Scaled social presence to <b>45K</b> followers across{" "}
                      <b>4</b> channels
                    </>,
                    <>
                      Cut campaign reporting time <b>60%</b> with automated
                      dashboards
                    </>,
                  ]}
                />
              }
            />
          </Block>

          <Block slot="exp3" phase={phase}>
            <Swap
              phase={phase}
              delay={0.42}
              canva={
                <CanvaJob
                  dates="Aug 2014 - Jul 2015"
                  company="Liceria & Co."
                  title="Marketing Assistant"
                  duties={[
                    "Handled the company's online presence – regularly updated the company's website and various social media accounts",
                  ]}
                />
              }
              ats={
                <AtsJob
                  title="Marketing Assistant"
                  meta="Liceria & Co. · Aug 2014 – Jul 2015"
                  wins={[
                    <>
                      Launched the company blog; <b>3.2K</b> organic sessions/mo
                      within <b>6</b> months
                    </>,
                  ]}
                />
              }
            />
          </Block>

          {/* Sidebar refugees — these fly into the single column, in order */}
          <Block slot="education" phase={phase} delay={0.1}>
            <Swap
              phase={phase}
              canva={
                <>
                  <CanvaHeading $onNavy>Education</CanvaHeading>
                  {DEGREES.map((d) => (
                    <div key={d.degree} style={{ marginBottom: 10 }}>
                      <div
                        style={{
                          fontSize: T.body,
                          color: "#fff",
                          lineHeight: 1.35,
                        }}
                      >
                        {d.degree}
                      </div>
                      <div
                        style={{
                          fontSize: T.body,
                          color: "#fff",
                          fontWeight: 700,
                          lineHeight: 1.35,
                        }}
                      >
                        {d.school}
                      </div>
                      <div
                        style={{
                          fontSize: T.small,
                          color: "rgba(255,255,255,0.75)",
                          marginTop: 1,
                        }}
                      >
                        {d.years}
                      </div>
                    </div>
                  ))}
                </>
              }
              ats={
                <>
                  <AtsHeading>Education</AtsHeading>
                  {DEGREES.map((d) => (
                    <div key={d.degree} style={{ marginBottom: 6 }}>
                      <div
                        style={{ fontSize: A.body, color: INK, fontWeight: 700 }}
                      >
                        {d.degree} · {d.school}
                      </div>
                      <div
                        style={{ fontSize: A.meta, color: MUTED, marginTop: 1 }}
                      >
                        {d.years}
                      </div>
                    </div>
                  ))}
                </>
              }
            />
          </Block>

          <Block slot="skills" phase={phase} delay={0.18}>
            <Swap
              phase={phase}
              canva={
                <>
                  <CanvaHeading $onNavy>Skills</CanvaHeading>
                  {SKILLS.map((s) => (
                    <div
                      key={s}
                      style={{
                        display: "flex",
                        gap: 6,
                        fontSize: T.body,
                        lineHeight: 1.35,
                        color: "rgba(255,255,255,0.9)",
                        marginBottom: 6,
                      }}
                    >
                      <span style={{ opacity: 0.8 }}>•</span>
                      <span>{s}</span>
                    </div>
                  ))}
                </>
              }
              ats={
                <>
                  <AtsHeading>Skills</AtsHeading>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                    {KEYWORDS.map((k) => (
                      <span
                        key={k}
                        style={{
                          fontSize: A.chip,
                          fontWeight: 600,
                          color: TEAL,
                          background: `${TEAL}15`,
                          border: `1px solid ${TEAL}40`,
                          borderRadius: 3,
                          padding: "2px 5px",
                        }}
                      >
                        {k}
                      </span>
                    ))}
                  </div>
                </>
              }
            />
          </Block>

          <Block slot="languages" phase={phase} delay={0.26}>
            <Swap
              phase={phase}
              canva={
                <>
                  <CanvaHeading $onNavy>Language</CanvaHeading>
                  {["English", "French"].map((l) => (
                    <div
                      key={l}
                      style={{
                        fontSize: T.body,
                        lineHeight: 1.35,
                        color: "rgba(255,255,255,0.9)",
                        marginBottom: 6,
                      }}
                    >
                      {l}
                    </div>
                  ))}
                </>
              }
              ats={
                <>
                  <AtsHeading>Languages</AtsHeading>
                  <div style={{ fontSize: A.body, color: INK }}>
                    English (Native) · French (B2)
                  </div>
                </>
              }
            />
          </Block>

          {/* References: dead weight, dropped entirely */}
          <Block slot="references" phase={phase}>
            <CanvaHeading>References</CanvaHeading>
            <div style={{ display: "flex", gap: 16 }}>
              {REFEREES.map((r) => (
                <div key={r.name} style={{ flex: 1 }}>
                  <div
                    style={{
                      fontSize: T.body,
                      fontWeight: 700,
                      color: INK,
                      lineHeight: 1.35,
                    }}
                  >
                    {r.name}
                  </div>
                  <div
                    style={{
                      fontSize: T.body,
                      color: "#3F3F46",
                      lineHeight: 1.35,
                      marginBottom: 3,
                    }}
                  >
                    {r.role}
                  </div>
                  <div style={{ fontSize: T.small, color: FAINT }}>
                    Phone: +123-456-7890
                  </div>
                  <div style={{ fontSize: T.small, color: FAINT }}>
                    Email: hello@reallygreatsite.com
                  </div>
                </div>
              ))}
            </div>
          </Block>

          <ScoreBadge
            $good={scorePassing}
            initial={false}
            animate={{ scale: scorePassing ? [1, 1.12, 1] : 1 }}
            transition={{ duration: 0.45 }}
          >
            {scorePassing ? "✓ 98% ATS" : "✕ 32% ATS"}
          </ScoreBadge>
        </Paper>

        {/* Leader lines: drawn in canvas units, over the paper, never clipped. */}
        <svg
          width={STAGE_W}
          height={CANVAS_H}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            pointerEvents: "none",
            zIndex: 15,
          }}
        >
          <defs>
            {[
              ["morph-arrow-bad", RED],
              ["morph-arrow-good", GREEN],
            ].map(([id, color]) => (
              <marker
                key={id}
                id={id}
                markerWidth="5"
                markerHeight="5"
                refX="4"
                refY="2.5"
                orient="auto"
              >
                <path d="M0,0 L5,2.5 L0,5 Z" fill={color} />
              </marker>
            ))}
          </defs>

          {CALLOUTS.map((c, i) => {
            const from = anchorOf(c);
            const to = tipOf(c);
            const good = c.phase === "ats";
            const on = isVisible(c);
            return (
              <motion.line
                key={c.id}
                x1={from.x}
                y1={from.y}
                x2={to.x}
                y2={to.y}
                stroke={good ? GREEN : RED}
                strokeWidth={1.4}
                markerEnd={`url(#morph-arrow-${good ? "good" : "bad"})`}
                initial={false}
                animate={{ opacity: on ? 1 : 0 }}
                transition={{ duration: 0.25, delay: on ? 0.1 + i * 0.12 : 0 }}
              />
            );
          })}
        </svg>

        {CALLOUTS.map((c, i) => {
          const good = c.phase === "ats";
          const on = isVisible(c);
          return (
            <Flag
              key={c.id}
              $good={good}
              initial={false}
              animate={{
                opacity: on ? 1 : 0,
                // Each label slides in from its own side.
                x: on ? 0 : c.side === "left" ? -10 : 10,
              }}
              transition={{ duration: 0.28, delay: on ? 0.1 + i * 0.12 : 0 }}
              style={{ left: labelX(c), top: c.y }}
            >
              <div className="title">
                <span>{good ? "✓" : "✕"}</span>
                {c.title}
              </div>
              <div className="sub">{c.sub}</div>
            </Flag>
          );
        })}
      </Scaler>
    </Stage>
  );
}
