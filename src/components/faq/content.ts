import type { ShortAnswer } from "@/components/ui/ShortAnswerFaq";

/*
 * /faq content, also used for the page's FAQPage structured data. Every answer
 * is checked against the product, the Terms and the code: refunds match the
 * Terms, failed runs refund their credit (lib/credits refundCredit), the ATS
 * checks read English and Turkish headings (lib/ats/deterministicScoring).
 * `short` is shown next to the question before it opens, so it must be an honest
 * one-to-three word answer. `id` is the answer's link (/faq#refunds); keep it stable.
 */

export interface FaqItem extends ShortAnswer {
  id: string;
}

export interface FaqTopic {
  key: string;
  title: string;
  items: FaqItem[];
}

export const FAQ_TOPICS: FaqTopic[] = [
  {
    key: "start",
    title: "Getting started",
    items: [
      {
        id: "how-it-works",
        question: "How does Rejectly work?",
        short: "Scan, match, fix",
        answer:
          "Upload your resume and the free scan shows the text an applicant tracking system pulls out, scored against 19 checks. Applying to a specific job? Job Match compares your resume to the post and rewrites it in its words. The ATS Optimizer rebuilds the layout as one clean column.",
      },
      {
        id: "no-experience",
        question: "I have no work experience. Will it work for me?",
        short: "Yes",
        answer:
          "Rejectly is built for students and new grads. Projects, coursework, clubs, hackathons and part-time jobs all count. We write them up in the words recruiters search for, at their real size.",
      },
      {
        id: "projects",
        question: "My university projects aren't real jobs. How do I write about them?",
        short: "They count",
        answer:
          "A capstone, a hackathon or running a club is experience. Write it as action, scope, tool, result. \"Worked on a school project\" becomes \"Built an inventory tracker for a 4-person class project using React and PostgreSQL.\" Rejectly keeps the real size of the work and only uses numbers you give it.",
      },
      {
        id: "files",
        question: "What files can I upload?",
        short: "PDF or DOCX",
        answer:
          "PDF or DOCX, up to 5 MB, with real text in it. Scanned images can't be read. Design templates from Canva or Figma often parse badly; the scan shows you exactly how yours reads.",
      },
      {
        id: "time",
        question: "How long does it take?",
        short: "Seconds",
        answer:
          "The scan takes a few seconds. A Job Match usually takes under a minute.",
      },
    ],
  },
  {
    key: "pricing",
    title: "Pricing",
    items: [
      {
        id: "free",
        question: "What's free?",
        short: "The scan, the demo",
        answer:
          "The ATS scan: your score, all 19 checks with the fix for each, and the text the ATS pulled out. And the job match demo: your match score, matched and missing keywords, and quick wins. No account, no card.",
      },
      {
        id: "credits",
        question: "How do credits work?",
        short: "1 credit, 1 run",
        answer:
          "One credit buys one Job Match or one ATS Optimizer run. A single credit is $2, ten are $7, or Pro is $12 a month for 150 runs.",
      },
      {
        id: "job-match",
        question: "What does a paid Job Match include?",
        short: "Five things",
        answer:
          "Your resume rewritten in the post's words, bullet rewrites, three role recommendations, interview prep for that job, and a cover letter.",
      },
      {
        id: "expire",
        question: "Do credits expire?",
        short: "Never",
        answer:
          "No. Use them this week or next year.",
      },
      {
        id: "cancel",
        question: "Can I cancel Pro?",
        short: "Anytime",
        answer:
          "From your billing page. Pro stays on until the end of the period you paid for and doesn't renew.",
      },
      {
        id: "refunds",
        question: "Can I get a refund?",
        short: "Untouched packs",
        answer:
          "Yes, for a credit pack you haven't used any credits from, if you ask within 14 days of buying it. Used credits and partial Pro months aren't refunded.",
      },
    ],
  },
  {
    key: "privacy",
    title: "Your data",
    items: [
      {
        id: "resume-use",
        question: "What happens to my resume?",
        short: "You decide",
        answer:
          "It's sent to OpenAI's API to run the analysis you asked for; OpenAI doesn't train its models on API data. It's stored with Supabase, encrypted in transit and at rest, and stays in your account until you delete it.",
      },
      {
        id: "who-sees",
        question: "Who can see my resume?",
        short: "Not employers",
        answer:
          "Your resumes belong to your account. We don't show them to other users, employers or advertisers, and we don't sell or share them.",
      },
      {
        id: "scan-file",
        question: "Does the free scan keep my file?",
        short: "No",
        answer:
          "We read your file and discard it. If you save your scan, it's kept in your browser so you can come back to it after you sign up.",
      },
      {
        id: "delete",
        question: "Can I delete everything?",
        short: "Yes",
        answer:
          "Delete your account from Settings. It's permanent: your profile, reports and every file you uploaded or generated are removed.",
      },
    ],
  },
  {
    key: "ai",
    title: "What the AI does",
    items: [
      {
        id: "guarantee",
        question: "Can you guarantee I'll get past the ATS?",
        short: "No",
        answer:
          "No one honestly can. Every company sets up its ATS differently. We show you what the parser reads, fix the format and wording it trips on, and score you against the job.",
      },
      {
        id: "make-up",
        question: "Will the AI make things up?",
        short: "Never",
        answer:
          "It won't inflate your role, invent a number or add a skill you don't have. If a keyword is missing, we tell you instead of writing it in.",
      },
      {
        id: "accuracy",
        question: "How accurate is the score?",
        short: "Same every time",
        answer:
          "The ATS score isn't AI: it's 19 fixed checks run by code, so the same resume always gets the same score. Rewrites and job matches use AI; read every line before you send it.",
      },
      {
        id: "languages",
        question: "Which languages work?",
        short: "English, Turkish",
        answer:
          "English and Turkish resumes and job posts. The ATS checks know section headings in both.",
      },
      {
        id: "cover-letters",
        question: "Do you write cover letters?",
        short: "With a match",
        answer:
          "Yes, as part of a paid Job Match, written from your match report in the tone you pick.",
      },
    ],
  },
  {
    key: "help",
    title: "Troubleshooting",
    items: [
      {
        id: "upload",
        question: "My file won't upload.",
        short: "Check three things",
        answer:
          "Make sure it's under 5 MB, a PDF or DOCX, and not a scanned image. If it came from a design tool, export it again as a PDF or DOCX. Still stuck? Write to hello@rejectly.pro.",
      },
      {
        id: "slow",
        question: "It's taking a long time.",
        short: "Refresh",
        answer:
          "If a Job Match runs past two minutes, refresh and try again. If a run fails, the credit goes back to your account automatically.",
      },
      {
        id: "mobile",
        question: "Does it work on my phone?",
        short: "Yes",
        answer:
          "Yes, on phones, tablets and computers.",
      },
      {
        id: "api",
        question: "Do you have an API?",
        short: "Not yet",
        answer:
          "Not at the moment. If you need one, tell us at hello@rejectly.pro.",
      },
    ],
  },
];

export const ALL_FAQS: FaqItem[] = FAQ_TOPICS.flatMap((t) => t.items);
