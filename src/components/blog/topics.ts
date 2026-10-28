/*
 * /blog topic chips. They're the reader's problem, not our categories ("I'm stuck
 * on my format"), so each lists guides by slug, hand-picked, the first one being
 * the topic's featured guide. A slug that isn't published is skipped; a post that
 * isn't in any topic still shows under All.
 */

export interface Topic {
  key: string;
  label: string;
  /** Heading when the topic is picked: `${lead} <mark>${word}</mark>.` */
  lead: string;
  word: string;
  slugs: string[];
}

/** Featured guide when All is picked (an editor's pick, not the newest post). */
export const ALL_FEATURED = "how-ats-parses-your-resume";

export const TOPICS: Topic[] = [
  {
    key: "format",
    label: "My format",
    lead: "I'm stuck on my",
    word: "format",
    slugs: [
      "how-ats-parses-your-resume",
      "ats-resume-format-template-2026",
      "resume-sections-that-matter",
      "free-ats-resume-checker-how-to-check-score",
      "what-is-ats-why-resume-gets-rejected",
      "resume-vs-cv-difference",
      "resume-with-career-gaps",
      "perfect-resume-guide-2025",
    ],
  },
  {
    key: "no-experience",
    label: "No experience",
    lead: "I'm stuck with",
    word: "no experience",
    slugs: [
      "how-to-get-a-job-without-experience",
      "harsh-truth-entry-level-jobs-2026",
      "career-mistakes-in-your-20s",
      "resume-with-career-gaps",
      "ultimate-guide-bypassing-ats-first-job",
    ],
  },
  {
    key: "keywords",
    label: "Keywords",
    lead: "I'm stuck on",
    word: "keywords",
    slugs: [
      "how-to-reverse-engineer-job-descriptions",
      "resume-keyword-stuffing-vs-optimization",
      "ats-resume-keywords-guide",
      "resume-keywords-by-industry-ats",
      "should-you-customize-resume-every-job",
      "resume-keywords-ultimate-guide-ats-2025",
    ],
  },
  {
    key: "no-replies",
    label: "No replies",
    lead: "I'm stuck getting",
    word: "no replies",
    slugs: [
      "why-not-getting-interviews",
      "why-applying-to-more-jobs-is-not-the-solution",
      "should-you-customize-resume-every-job",
      "how-to-beat-ats-2026-complete-guide",
      "linkedin-profile-optimization-guide",
      "how-to-write-compelling-cover-letter",
      "how-to-write-cover-letter-gets-hired-2025",
    ],
  },
  {
    key: "interviews",
    label: "Interviews",
    lead: "I'm stuck on",
    word: "interviews",
    slugs: [
      "how-to-recover-after-bad-interview-answer",
      "tech-interview-preparation-guide",
      "salary-negotiation-guide-get-pay-you-deserve",
    ],
  },
];

/** Only what an index card shows; article bodies never reach the browser. */
export interface GuideListItem {
  slug: string;
  title: string;
  excerpt: string;
  image: string | null;
  imageAlt: string | null;
  category: string | null;
  date: string;
}
