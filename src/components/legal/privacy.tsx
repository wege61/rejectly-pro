import Link from "next/link";
import { ROUTES } from "@/lib/constants";
import type { LegalSection } from "./LegalPage";

/*
 * The Privacy Policy. Every line describes what the code does today; check it
 * when data handling changes:
 * - free scan: /api/ats/parse sends the text to OpenAI for a resume check and
 *   stores nothing (lib/ai/cvValidator); /api/ats/check's public path stores nothing
 * - builder: draft in localStorage (rejectly-cv-builder-storage), saved to the
 *   account on download (/api/cv-builder/save); AI routes under /api/cv/*
 * - browser: rj-theme and the saved scan (lib/ats/savedScan) in localStorage
 * - third parties: Supabase, OpenAI, Stripe, Resend, Vercel, Google Analytics
 *   (app/layout.tsx), Microsoft Office viewer (DOCX preview in OnboardingWizard),
 *   Clearbit, Open-Meteo, OpenStreetMap (AutocompleteInput, EducationForm)
 * - rate-limit counters: dropped after two days (migration 025)
 * - account deletion: /api/user/delete removes files, then the account (cascade)
 */

export const PRIVACY_UPDATED = "October 31, 2026";

const PRIVACY = "privacy@rejectly.pro";
const Mail = ({ to }: { to: string }) => <a href={`mailto:${to}`}>{to}</a>;
const Out = ({ href, children }: { href: string; children: string }) => <a href={href} target="_blank" rel="noopener noreferrer">{children}</a>;

export const PRIVACY_SECTIONS: LegalSection[] = [
  {
    id: "who",
    title: "Who we are",
    short: "Bulbul Labs LLC runs Rejectly.pro and is responsible for your data.",
    body: (
      <>
        <p>Rejectly.pro is operated by Bulbul Labs LLC, a Wyoming limited liability company (“we”, “us”). We decide how your personal data is used, which makes us its controller under laws like the GDPR.</p>
        <p>This policy covers the website and everything you do on it. Questions go to <Mail to={PRIVACY} />.</p>
      </>
    ),
  },
  {
    id: "collect",
    title: "What we collect",
    short: "Your account details, the resumes and job posts you give us, payment status, and basic usage data.",
    body: (
      <table>
        <thead><tr><th>What</th><th>Details</th></tr></thead>
        <tbody>
          <tr><td>Account details</td><td>Your name, email and password when you sign up. Passwords are stored hashed by our sign-in provider; we never see them.</td></tr>
          <tr><td>Resumes and job posts</td><td>The files and text you upload or paste, and the reports, rewrites, cover letters and interview prep we create from them.</td></tr>
          <tr><td>Free ATS scan</td><td>The text of the file you scan, only for as long as the scan takes. We don’t save it to an account or anywhere else.</td></tr>
          <tr><td>Resume builder</td><td>What you type is kept in your browser. When you download your resume, it’s saved to your account.</td></tr>
          <tr><td>Payments</td><td>Stripe collects your card details. We receive what you bought, the amount, the payment status and a Stripe customer ID, never your full card number.</td></tr>
          <tr><td>Messages</td><td>Your email address and message when you use the contact form or write to us.</td></tr>
          <tr><td>Usage and device data</td><td>Pages you visit, your browser and device, approximate location and page speed, through Google Analytics. Our hosting provider also logs requests, including IP addresses.</td></tr>
          <tr><td>Abuse protection</td><td>Short-lived counters keyed by IP address or account, so no one can overload the free tools. They’re deleted after two days.</td></tr>
        </tbody>
      </table>
    ),
  },
  {
    id: "use",
    title: "How we use it",
    short: "To run the Service, take payments, keep it safe and make it better. Never to sell, never for ads.",
    body: (
      <>
        <ul>
          <li>To run the Service: scan and score resumes, match them to job posts, and write the rewrites, letters and prep you ask for.</li>
          <li>To manage your account and payments, and answer you when you write.</li>
          <li>To send emails about your account: a welcome email, “your report is ready”, receipts, and a follow-up about a free report you ran. Reply to any of them and ask us to stop the follow-ups, and we will.</li>
          <li>To keep the Service safe: preventing abuse, fraud and overload.</li>
          <li>To understand which pages work and which don’t, using aggregated analytics.</li>
          <li>To meet legal obligations, such as keeping payment records.</li>
        </ul>
        <p>We don’t sell your personal data, we don’t share it for advertising, and we don’t use your resumes to train AI models.</p>
      </>
    ),
  },
  {
    id: "ai",
    title: "AI processing",
    short: "Resume and job text goes to OpenAI to produce results. OpenAI doesn’t train on it.",
    body: (
      <>
        <p>To produce scores, rewrites, cover letters and interview prep, we send the relevant text to our AI provider, OpenAI, through its API. When you upload a file to the free scan, its text is also sent to OpenAI for a quick check that it’s a resume. When you ask the resume builder for suggestions, the fields you’re working on are sent too.</p>
        <p>Under OpenAI’s API policy, data sent through the API isn’t used to train its models. OpenAI may keep it for a limited time to monitor for abuse, as its policy describes.</p>
      </>
    ),
  },
  {
    id: "share",
    title: "Who else handles your data",
    short: "Only the companies that run parts of the Service for us. Here’s the full list.",
    body: (
      <>
        <p>These companies process data on our behalf, only to provide their part of the Service:</p>
        <table>
          <thead><tr><th>Company</th><th>What they do</th></tr></thead>
          <tbody>
            <tr><td>Supabase</td><td>Database, sign-in and file storage</td></tr>
            <tr><td>OpenAI</td><td>AI processing (see above)</td></tr>
            <tr><td>Stripe</td><td>Payments</td></tr>
            <tr><td>Resend</td><td>Sending our emails, and contact form messages to our inbox</td></tr>
            <tr><td>Vercel</td><td>Hosting the website</td></tr>
            <tr><td>Google Analytics</td><td>Usage analytics</td></tr>
            <tr><td>Microsoft</td><td>Showing a preview when you open a Word (DOCX) file in the app. Microsoft’s viewer receives a link to that file.</td></tr>
            <tr><td>Clearbit</td><td>Company name suggestions as you type in the resume builder. Your browser sends what you type.</td></tr>
            <tr><td>Open-Meteo and OpenStreetMap</td><td>Location and school suggestions as you type in the resume builder. Your browser sends what you type.</td></tr>
          </tbody>
        </table>
        <p>We may also disclose data when the law requires it, to protect someone’s safety, or as part of a sale or merger of Rejectly.pro, in which case this policy keeps applying to your data.</p>
      </>
    ),
  },
  {
    id: "browser",
    title: "Cookies and browser storage",
    short: "Sign-in cookies, Google Analytics cookies, and a few settings saved in your browser.",
    body: (
      <>
        <ul>
          <li><b>Sign-in cookies</b> keep you logged in. The Service doesn’t work without them.</li>
          <li><b>Google Analytics cookies</b> count visits and pages. You can block them in your browser or with Google’s <Out href="https://tools.google.com/dlpage/gaoptout">opt-out add-on</Out>; everything still works.</li>
          <li><b>Browser storage</b> (not cookies) remembers your theme, your resume builder draft and your last free scan. It stays on your device; clearing your browser data removes it.</li>
        </ul>
      </>
    ),
  },
  {
    id: "keep",
    title: "How long we keep it",
    short: "Until you delete your account. Payment records are kept as long as the law requires.",
    body: (
      <ul>
        <li>Your account, resumes, reports and files: until you delete your account. Deleting it from Settings removes them permanently.</li>
        <li>Payment records: as long as tax and accounting law requires, even after you delete your account.</li>
        <li>Messages you send us: as long as we need them to help you.</li>
        <li>Free scans: not kept.</li>
        <li>Abuse-protection counters: two days.</li>
        <li>Our providers’ backups may hold deleted data for a short time before it’s overwritten.</li>
      </ul>
    ),
  },
  {
    id: "security",
    title: "Security",
    short: "Data is encrypted in transit and stored with established providers. No system is perfect.",
    body: (
      <>
        <p>Data moves between your browser and our servers over encrypted connections (TLS), and our providers encrypt the data they store. Within our team, access to personal data is limited to the people who run the Service.</p>
        <p>No system is perfectly secure. If a breach affects your data, we’ll tell you as the law requires.</p>
      </>
    ),
  },
  {
    id: "rights",
    title: "Your rights",
    short: `You can see, fix, export or delete your data. Ask at ${PRIVACY}; we answer within 30 days.`,
    body: (
      <>
        <p>Wherever you live, you can ask us to:</p>
        <ul>
          <li>give you a copy of your personal data, or export it in a portable format;</li>
          <li>correct data that’s wrong;</li>
          <li>delete your data (you can also delete your account yourself from Settings);</li>
          <li>stop using your data for a purpose you object to, such as the follow-up emails.</li>
        </ul>
        <p>Write to <Mail to={PRIVACY} /> from the email on your account. We may ask you to confirm it’s you, and we’ll answer within 30 days. We won’t treat you differently for using these rights.</p>
        <p><b>In the EEA and UK</b>, you also have the right to restrict processing and to complain to your local data protection authority. We rely on these legal bases: performing our contract with you (running the Service and taking payments), our legitimate interests (security, abuse prevention, analytics and the follow-up emails, which you can stop anytime), and legal obligations (payment records).</p>
        <p><b>In California and other US states</b> with privacy laws: we don’t sell your personal information or share it for cross-context behavioral advertising.</p>
      </>
    ),
  },
  {
    id: "transfers",
    title: "Where your data goes",
    short: "We’re based in the US, and our providers process data in the US and other countries.",
    body: <p>We’re based in the United States, and the companies listed above process data in the US and other countries. Those countries’ data protection laws may differ from yours. We use providers that commit to protecting the data they process for us.</p>,
  },
  {
    id: "children",
    title: "Children",
    short: "The Service is for people 16 and older.",
    body: <p>The Service isn’t meant for anyone under 16, and we don’t knowingly collect their data. If you think a child has given us personal data, write to <Mail to={PRIVACY} /> and we’ll delete it.</p>,
  },
  {
    id: "changes",
    title: "Changes to this policy",
    short: "We post changes here. If a change affects how we use your data, we email you first.",
    body: <p>We may update this policy. We’ll post the new version here and change the date at the top. If a change affects how we use data you’ve already given us, we’ll email registered users before it takes effect. The <Link href={`${ROUTES.PUBLIC.TERMS}#changes`}>Terms of Service</Link> explain how changes to the Terms work.</p>,
  },
  {
    id: "contact",
    title: "Contact",
    short: `Privacy questions and requests: ${PRIVACY}.`,
    body: (
      <>
        <dl>
          <div><dt>Privacy requests</dt><dd><Mail to={PRIVACY} /></dd></div>
          <div><dt>Everything else</dt><dd><Mail to="hello@rejectly.pro" /></dd></div>
        </dl>
        <p>Bulbul Labs LLC, Wyoming, USA.</p>
      </>
    ),
  },
];
