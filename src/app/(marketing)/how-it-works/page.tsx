import { HowItWorks } from "@/components/how-it-works/HowItWorks";
import { STEPS, type StoryScores } from "@/components/how-it-works/story";
import { BEFORE_TEXT, AFTER_TEXT } from "@/components/marketing/hero/parserLensRows";
import { calculateDeterministicScore } from "@/lib/ats/deterministicScoring";
import { Footer } from "@/components/ui/Footer";

/*
 * The story's numbers come from the real scorer, run on Maya's two resumes at
 * build time, so the page can't drift from what the scan would say.
 */
function storyScores(): StoryScores {
  const before = calculateDeterministicScore(BEFORE_TEXT);
  const after = calculateDeterministicScore(AFTER_TEXT);
  const flat = (r: typeof before) =>
    (Object.entries(r.categories) as [string, (typeof r.categories)[keyof typeof r.categories]][]).flatMap(([category, c]) =>
      c.checks.map((ch) => ({ category, name: ch.name, points: ch.points, passed: ch.passed }))
    );
  const names: Record<string, string> = {
    "LinkedIn URL": "LinkedIn",
    "Summary section": "a summary",
    "Consistent date format": "one date format",
    "Reasonable length": "length",
  };
  return {
    before: before.overallScore,
    after: after.overallScore,
    beforeChecks: flat(before),
    stillFailing: flat(after).filter((c) => !c.passed).map((c) => names[c.name] ?? c.name.toLowerCase()),
  };
}

const STEP_TEXT = [
  "Upload a PDF or DOCX. The free scan pulls the text out of your file the way an applicant tracking system does.",
  "The text is scored against 19 fixed checks: layout, sections, contact details, numbers and length. Each failed check comes with its fix.",
  "Paste a job post. Rejectly finds its keywords and shows which ones your resume has and which are missing.",
  "Rejectly rewrites your lines in the post's words, asks you for any number a line needs, and never adds a skill you don't have.",
  "The ATS Optimizer rebuilds your resume as one clean column and scores it again with the same 19 checks.",
  "From the same match report, get a cover letter and interview prep for that job.",
];

const howToJsonLd = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "How Rejectly checks and fixes a resume for applicant tracking systems",
  description: "Follow one resume from upload to interview: what the ATS reads, the 19-check score, a job match, the rewrite, the rebuilt layout and the application.",
  step: STEPS.map((s, i) => ({
    "@type": "HowToStep",
    position: i + 1,
    name: s.title.replace(/\.$/, ""),
    text: STEP_TEXT[i],
    url: `https://rejectly.pro/how-it-works#step-${i + 1}`,
  })),
};

export default function HowItWorksPage() {
  return (
    <div style={{ minHeight: "100vh", background: "var(--rj-paper)", overflowX: "clip" }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(howToJsonLd) }} />
      <HowItWorks scores={storyScores()} beforeText={BEFORE_TEXT} afterText={AFTER_TEXT} />
      <Footer />
    </div>
  );
}
