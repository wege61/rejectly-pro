import { PRICING } from "@/lib/constants";

/*
 * FAQ for /ats-check: rendered by the page and used for its FAQPage structured
 * data (app/(marketing)/ats-check/layout.tsx), so both always say the same thing.
 * Every answer has to match the product: the score is lib/ats/deterministicScoring
 * (19 checks), the file is parsed and discarded (api/ats/parse), a saved scan lives
 * in the visitor's browser (lib/ats/savedScan).
 */

export interface AtsFaq {
  question: string;
  short: string;
  answer: string;
}

export const ATS_FAQS: AtsFaq[] = [
  {
    question: "What is an ATS resume checker?",
    short: "A preview",
    answer:
      "It pulls the text out of your file the way applicant tracking software does, then checks it against the things those parsers trip on: layout, section names, contact details, numbers and length.",
  },
  {
    question: "Is it really free?",
    short: "Yes",
    answer: `The scan, your score, all 19 checks and the text the ATS pulled out are free. No account, no card. Having Rejectly fix the resume for you costs 1 credit ($${PRICING.SINGLE.price}).`,
  },
  {
    question: "What's a good ATS score?",
    short: "80+",
    answer:
      "80 or above means a parser reads your resume cleanly. 60 to 79 reads, but loses points on things you can fix. Below 60, expect parts of it to be misread. It's a format score, not a prediction of interviews.",
  },
  {
    question: "Why do so many resumes fail ATS parsing?",
    short: "Format",
    answer:
      "Mostly layout: two columns, tables, text boxes, contact details in the page header and creative section names. Design templates from Canva or Figma are the usual cause.",
  },
  {
    question: "Which ATS does it check against?",
    short: "Their rules",
    answer:
      "The format rules Workday, Greenhouse, Lever and Taleo parsers are known to trip on. We don't run your file through those companies' systems; nobody outside them can.",
  },
  {
    question: "Can I put a capstone or hackathon on my resume?",
    short: "Yes",
    answer: "Put it under Projects or Experience with a standard heading. The ATS reads it like any other entry.",
  },
  {
    question: "How is this different from a resume review?",
    short: "Bot first",
    answer:
      "A review judges your writing. This checks whether software can read your resume at all. Scan first, then use the job match for the content.",
  },
  {
    question: "Do you keep my file?",
    short: "No",
    answer:
      "We read your file and discard it. If you save your scan, it's kept in your browser so you can come back to it after you sign up.",
  },
];
