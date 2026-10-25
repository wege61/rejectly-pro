/*
 * Homepage FAQ. `short` is the answer shown next to the question before it opens,
 * so every question here must have an honest one-to-two word answer.
 * Every claim is checked against the product: see the notes beside each entry.
 */

export interface Faq {
  question: string;
  short: string;
  answer: string;
  link?: { label: string; href: string };
}

export const FAQS: Faq[] = [
  {
    question: "Can you guarantee I'll get past the ATS?",
    short: "No",
    answer:
      "No one honestly can. Every company sets up its ATS differently. What we do: show you what the parser reads, fix the format and wording it trips on, and score you against the job. The rest is your experience.",
    link: { label: "See the 80 checks", href: "#proof" },
  },
  {
    question: "Why not just paste it into ChatGPT?",
    short: "You can",
    answer:
      "You can. But a chatbot doesn't read your file the way an ATS parser does, doesn't score it against 80 checks, and will happily invent a number if you let it. Rejectly does the parsing, the scoring and a rule-bound rewrite in one place.",
  },
  {
    // The rewrite rules live in src/lib/ai/prompts/cvOptimization.ts.
    question: "Will the AI make things up?",
    short: "Never",
    answer:
      "It won't inflate your role, invent a number or add a skill you don't have. If a keyword is missing, we tell you instead of writing it in.",
    link: { label: "Read the rules", href: "#proof" },
  },
  {
    // Cliché and inflated-verb bans: cvOptimization.ts and atsCheck.ts prompts.
    question: "Will it read like AI wrote it?",
    short: "No clichés",
    answer:
      "The rewrite bans the usual AI tells, like “spearheaded”, “passionate” and keyword lists posing as sentences, and keeps your facts and numbers as you wrote them. Read it before you send it; it's still your resume.",
  },
  {
    question: "I have no work experience. Will this help?",
    short: "Yes",
    answer:
      "Rejectly is built for students and new grads. Projects, coursework, clubs and part-time jobs all count. We rewrite them in the words recruiters search for, at their real size.",
  },
  {
    // Public scan path: api/ats/check handles cvText without auth.
    question: "What's free?",
    short: "The scan",
    answer:
      "Your ATS score, the breakdown by category and one quick fix. No account, no card, and no trial that turns into a charge.",
  },
  {
    question: "Do credits expire?",
    short: "No",
    answer:
      "Never. One credit buys one Job Match, with the rewritten resume, cover letter and interview prep included, or one full ATS report. Haven't used them? Full refund within 14 days.",
  },
  {
    // Stripe Customer Portal, cancel at period end.
    question: "Can I cancel Pro myself?",
    short: "Yes",
    answer:
      "From your billing page, in a few clicks. You keep Pro until the end of the month you paid for, and it doesn't renew.",
  },
  {
    // Matches the privacy policy (OpenAI API processing, account deletion in Settings).
    question: "What happens to my resume?",
    short: "You decide",
    answer:
      "It's sent to OpenAI's API for the analysis; OpenAI doesn't train its models on API data. Your reports stay in your account, and you can delete your account from Settings at any time.",
  },
];
