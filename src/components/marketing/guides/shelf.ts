/*
 * The homepage guide shelf: guides picked for the order of a job search, not
 * by publish date. The marketing layout fetches them by slug (see
 * getGuideShelfStatic); if a slug is unpublished, the newest posts fill in.
 */

export type GuideStage = 0 | 1 | 2;

export const GUIDE_STAGES = ["Before you apply", "While you apply", "After you apply"] as const;

export const GUIDE_SHELF: { slug: string; stage: GuideStage }[] = [
  { slug: "how-ats-parses-your-resume", stage: 0 },
  { slug: "ats-resume-format-template-2026", stage: 0 },
  { slug: "how-to-get-a-job-without-experience", stage: 0 },
  { slug: "how-to-reverse-engineer-job-descriptions", stage: 1 },
  { slug: "resume-keyword-stuffing-vs-optimization", stage: 1 },
  { slug: "should-you-customize-resume-every-job", stage: 1 },
  { slug: "why-not-getting-interviews", stage: 2 },
  { slug: "how-to-recover-after-bad-interview-answer", stage: 2 },
];

/** Only what a shelf card shows; the article body never reaches the browser. */
export interface GuideCard {
  slug: string;
  title: string;
  image: string | null;
  imageAlt: string | null;
  category: string | null;
  stage: GuideStage;
}

export interface GuideShelfData {
  guides: GuideCard[];
  total: number;
}
