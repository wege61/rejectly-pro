import type { ShortAnswer } from "@/components/ui/ShortAnswerFaq";
import { PRICING } from "@/lib/constants";
import { cheapest } from "./plans";

/*
 * /pricing FAQ, also used for the page's FAQPage structured data. Refund and
 * cancellation wording must match the Terms (app/(marketing)/terms).
 */

const PRO_FROM = Array.from({ length: 60 }, (_, i) => i + 1).find((n) => cheapest(n).plan === "pro");

export const PRICING_FAQS: ShortAnswer[] = [
  {
    question: "What does one credit buy?",
    short: "One run",
    answer:
      "One Job Match (score, rewritten resume, role ideas, interview prep and a cover letter) or one ATS Optimizer run (your resume rebuilt as one clean column and scored again).",
  },
  {
    question: "Do credits expire?",
    short: "Never",
    answer: "No. Credits from Single and Starter never expire. Use them this week or next year.",
  },
  {
    question: "Credits or Pro: which should I pick?",
    short: "Use the slider",
    answer: `Move the slider to the number of jobs you'll apply to this month. It picks the cheapest option, packs or Pro. From ${PRO_FROM} applications a month, Pro costs less than credits.`,
  },
  {
    question: "Can I get a refund?",
    short: "Untouched packs",
    answer:
      "Yes, for a credit pack you haven't used any credits from, if you ask within 14 days of buying it. Used credits and partial Pro months aren't refunded.",
  },
  {
    question: "What happens if I cancel Pro?",
    short: "Kept to period end",
    answer:
      "Cancel anytime from your billing page. Pro stays on until the end of the period you paid for, then your account goes back to credits.",
  },
  {
    question: "I have credits. What if I go Pro?",
    short: "Still yours",
    answer: "Your credits stay in your account. Pro doesn't use them, and they're still there if you cancel.",
  },
  {
    question: "Is the ATS scan really free?",
    short: "Yes",
    answer:
      "The scan, your score and all 19 checks with their fixes are free, with no account. So is the job match demo. You pay only when you want Rejectly to fix or rewrite the resume.",
  },
  {
    question: "How do I pay?",
    short: "Stripe",
    answer: `Card checkout through Stripe. We never see or store your card number. Single is $${PRICING.SINGLE.price}, Starter is $${PRICING.STARTER.price} for ${PRICING.STARTER.credits} credits, and Pro is $${PRICING.PRO.price} a month.`,
  },
];
