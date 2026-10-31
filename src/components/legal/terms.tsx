import Link from "next/link";
import { PRICING, ROUTES } from "@/lib/constants";
import type { LegalSection } from "./LegalPage";

/*
 * The Terms of Service. Facts here must match the product: prices and the Pro
 * run limit come from PRICING; refunds match the FAQ; failed runs refund their
 * credit (lib/credits refundCredit). Changing what a section promises is a
 * Terms change: update TERMS_UPDATED, and if it works against users, email
 * them 30 days ahead (section "Changes to these Terms").
 */

export const TERMS_UPDATED = "October 31, 2026";

const HELLO = "hello@rejectly.pro";
const Mail = ({ to }: { to: string }) => <a href={`mailto:${to}`}>{to}</a>;
const RUNS = PRICING.PRO.runsPerPeriod;

export const TERMS: LegalSection[] = [
  {
    id: "agreement",
    title: "Who we are",
    short: "Rejectly.pro is run by Bulbul Labs LLC. Using it means you accept these terms.",
    body: (
      <>
        <p>Rejectly.pro (the “Service”) is operated by Bulbul Labs LLC, a Wyoming limited liability company (“we”, “us”). These Terms of Service (“Terms”) govern your use of the website, the free tools and the paid features.</p>
        <p>By using the Service, you agree to these Terms. If you don’t agree, please don’t use it.</p>
      </>
    ),
  },
  {
    id: "accounts",
    title: "Your account",
    short: "Be 16 or older, use real details, keep one account and keep it secure.",
    body: (
      <ul>
        <li>You must be at least 16 years old.</li>
        <li>Give accurate details and keep them up to date.</li>
        <li>Keep your password safe. You’re responsible for what happens under your account.</li>
        <li>One account per person. Don’t create more to get around free or fair-use limits.</li>
      </ul>
    ),
  },
  {
    id: "free",
    title: "Free tools",
    short: "The ATS scan and the job match demo are free. Some need no account.",
    body: <p>Some parts of the Service are free, including the ATS scan and the job match demo. Free tools may have usage limits to prevent abuse, and we may change what’s free. Using a free tool doesn’t start a subscription or any payment.</p>,
  },
  {
    id: "payments",
    title: "Credits, Pro and payments",
    short: `One credit, one run. Credits never expire. Pro is $${PRICING.PRO.price} a month for up to ${RUNS} runs and renews until you cancel.`,
    body: (
      <dl>
        <div><dt>Credits</dt><dd>One credit buys one Job Match or one ATS Optimizer run. One credit costs ${PRICING.SINGLE.price}; a pack of {PRICING.STARTER.credits} costs ${PRICING.STARTER.price}. Prices are in US dollars. Credits don’t expire.</dd></div>
        <div><dt>Failed runs</dt><dd>If a run doesn’t finish, its credit goes back to your account automatically.</dd></div>
        <div><dt>Pro</dt><dd>${PRICING.PRO.price} a month for up to {RUNS} runs (Job Match or ATS Optimizer) per billing period, for your own job search. Unused runs don’t carry over, and Pro doesn’t use your credits.</dd></div>
        <div><dt>Renewal and cancelling</dt><dd>Pro renews automatically each month until you cancel. You can cancel anytime from your billing page; Pro stays on until the end of the period you’ve paid for and then stops.</dd></div>
        <div><dt>Payments</dt><dd>Payments are processed by Stripe. We don’t see or store your full card number.</dd></div>
        <div><dt>Price changes</dt><dd>We may change prices. If you have Pro, we’ll email you at least 30 days before a new price applies to your next renewal, so you can cancel first. Credits you’ve already bought keep working.</dd></div>
      </dl>
    ),
  },
  {
    id: "refunds",
    title: "Refunds",
    short: `Untouched credit packs, within 14 days. Write to ${HELLO}.`,
    body: (
      <>
        <p>You can get a full refund for a credit pack you haven’t used any credits from, if you ask within 14 days of buying it. Used credits and partial Pro months aren’t refunded.</p>
        <p>To ask, write to <Mail to={HELLO} /> from the email you paid with, or tell us which one it was.</p>
        <p>Nothing here limits refund rights you have under the law where you live.</p>
      </>
    ),
  },
  {
    id: "fair-use",
    title: "Acceptable use and fair use",
    short: "Use it for your own job search, lawfully. No bots, no shared accounts, no reselling.",
    body: (
      <>
        <p>The Service is for your own job search. You agree not to:</p>
        <ul>
          <li>break the law, or upload content that infringes someone else’s rights;</li>
          <li>harass, abuse or harm anyone;</li>
          <li>share your account or let other people use it;</li>
          <li>run the Service with bots, scripts or scrapers;</li>
          <li>resell the Service or offer it to others;</li>
          <li>get around security features or usage limits, upload malicious code, or try to reverse engineer the Service.</li>
        </ul>
        <p>Pro’s {RUNS} runs per billing period is a fair-use limit. If you reach it, you’ll see a message, and your runs come back at the start of your next period.</p>
        <p>If you break these rules, we may suspend or close your account (see <a href="#ending">Ending your account</a>).</p>
      </>
    ),
  },
  {
    id: "content",
    title: "Your content",
    short: "Your resume stays yours. We use it only to run the Service.",
    body: (
      <ul>
        <li>You keep all rights to what you upload.</li>
        <li>You let us process and store it only to provide the Service to you.</li>
        <li>Your content is processed by our AI provider, OpenAI. The <Link href={ROUTES.PUBLIC.PRIVACY}>Privacy Policy</Link> has the details.</li>
        <li>You can delete your account and everything in it from Settings. It’s permanent.</li>
      </ul>
    ),
  },
  {
    id: "ai",
    title: "AI suggestions",
    short: "AI suggestions are drafts. Keep only what’s true; you’re responsible for what you send.",
    body: (
      <>
        <p>Some features use AI to suggest rewrites, cover letters and interview answers. AI can make mistakes. Treat its suggestions as drafts: review them, keep only what’s true, and don’t claim skills or results you don’t have.</p>
        <p>You’re responsible for the resumes, letters and answers you send to employers. Scores estimate how readable your resume is for an applicant tracking system; they don’t predict any employer’s decision.</p>
      </>
    ),
  },
  {
    id: "ip",
    title: "Our intellectual property",
    short: "The Service, its design and its code belong to us.",
    body: <p>The Service and its content (other than what you upload), features and functionality belong to Bulbul Labs LLC and are protected by copyright, trademark and other laws. Don’t use our name or trademarks without our written permission.</p>,
  },
  {
    id: "no-guarantees",
    title: "No guarantees",
    short: "We can’t promise interviews or jobs, and the Service is provided as is.",
    body: (
      <>
        <p>We don’t guarantee interviews, offers or any hiring outcome. The Service isn’t career, legal or professional advice.</p>
        <p className="caps">The Service is provided “as is” and “as available.” To the extent the law allows, we disclaim all warranties, express or implied, including merchantability, fitness for a particular purpose and non-infringement. We don’t promise that the Service will be uninterrupted, error-free or always available.</p>
      </>
    ),
  },
  {
    id: "liability",
    title: "Limits on our liability",
    short: "If something goes wrong, our liability is capped at what you paid us in the last 12 months, or $50.",
    body: (
      <>
        <p className="caps">To the extent the law allows, we aren’t liable for indirect, incidental, special, consequential or punitive damages, or for lost profits, wages, opportunities or data. Our total liability for any claim relating to the Service is limited to the greater of the amount you paid us in the 12 months before the claim, or $50.</p>
        <p>Some places don’t allow these limits. Where they don’t, they apply only as far as the law allows. Nothing in these Terms limits liability for fraud, gross negligence or anything else the law doesn’t let us limit.</p>
      </>
    ),
  },
  {
    id: "indemnity",
    title: "If someone makes a claim against us because of you",
    short: "If your content or a breach of these terms gets us sued, you cover our reasonable costs.",
    body: <p>To the extent the law allows, you agree to cover our reasonable costs, including legal fees, from claims by others that arise from content you upload or from your breach of these Terms.</p>,
  },
  {
    id: "ending",
    title: "Ending your account",
    short: "You can delete your account anytime. If we close one, we tell you, and unused credits are protected.",
    body: (
      <dl>
        <div><dt>You</dt><dd>You can delete your account anytime from Settings.</dd></div>
        <div><dt>Us</dt><dd>We may suspend or close an account that breaks these Terms, is used for fraud or illegal activity, or that we’re required to close by law.</dd></div>
        <div><dt>Inactive accounts</dt><dd>We may close accounts that haven’t been used for 12 months or more. We’ll email you at least 30 days before, and we won’t close an inactive account that still has unused credits or an active Pro subscription.</dd></div>
        <div><dt>Your money</dt><dd>If we close your account for any reason other than a breach of these Terms, we’ll refund your unused credits and the unused part of your current Pro period. If we close it because these Terms were broken, unused credits aren’t refunded.</dd></div>
      </dl>
    ),
  },
  {
    id: "disputes",
    title: "Disputes and governing law",
    short: "Talk to us first. Wyoming law applies, and your local consumer rights stay.",
    body: (
      <>
        <p>If you have a problem with the Service, please write to <Mail to={HELLO} /> first. We’ll try to resolve it with you within 30 days.</p>
        <p>These Terms are governed by the laws of the State of Wyoming, USA, without regard to its conflict-of-law rules. A dispute we can’t resolve together will be decided by the state or federal courts located in Wyoming, and both you and we agree to their jurisdiction.</p>
        <p>If you live somewhere whose consumer laws give you rights a contract can’t take away, including the right to bring a claim in your local courts, these Terms don’t take those rights away.</p>
      </>
    ),
  },
  {
    id: "changes",
    title: "Changes to these Terms",
    short: "We post changes here. If a change works against you, we email you 30 days ahead.",
    body: (
      <>
        <p>We may update these Terms. We’ll post the new version here and change the date at the top. If a change reduces your rights or adds new limits, we’ll email registered users at least 30 days before it takes effect.</p>
        <p>If you keep using the Service after a change takes effect, the new Terms apply. If you don’t agree, you can stop using it and delete your account.</p>
      </>
    ),
  },
  {
    id: "others",
    title: "Other companies we rely on",
    short: "Stripe handles payments and OpenAI handles AI processing. Their terms cover what they do.",
    body: <p>The Service relies on other companies, including Stripe for payments and OpenAI for AI processing, and may link to other sites, such as job boards. Their own terms and policies apply to what they do. The <Link href={ROUTES.PUBLIC.PRIVACY}>Privacy Policy</Link> lists every company that handles your data.</p>,
  },
  {
    id: "general",
    title: "The fine print",
    short: "Standard rules about how these Terms work as a whole.",
    body: (
      <ul>
        <li>If part of these Terms can’t be enforced, the rest still applies.</li>
        <li>These Terms, with the <Link href={ROUTES.PUBLIC.PRIVACY}>Privacy Policy</Link>, are the whole agreement between you and us about the Service.</li>
        <li>If we don’t enforce a right right away, we haven’t given it up.</li>
        <li>You can’t transfer your account or these Terms to someone else. We may transfer them if Rejectly.pro is sold or merged, and these Terms keep protecting you.</li>
      </ul>
    ),
  },
  {
    id: "contact",
    title: "Contact",
    short: `Write to ${HELLO}. Legal and privacy notices have their own addresses.`,
    body: (
      <>
        <dl>
          <div><dt>Questions and refunds</dt><dd><Mail to={HELLO} /></dd></div>
          <div><dt>Legal notices</dt><dd><Mail to="legal@rejectly.pro" /></dd></div>
          <div><dt>Privacy requests</dt><dd><Mail to="privacy@rejectly.pro" /></dd></div>
        </dl>
        <p>Bulbul Labs LLC, Wyoming, USA.</p>
      </>
    ),
  },
];
