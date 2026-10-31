# Rejectly redesign: to-do

Working list for the `redesign/hero` branch. Order matters: page design first,
content rewrite last. Check items off here as they ship.

## 1. Page design (in progress)

Every page is shown as an HTML simulation first, approved, then built.

- [x] Homepage (hero, why, try it, tools, proof, pricing, FAQ, guides, final CTA, footer)
- [x] `/ats-check`
- [x] Navbar
- [x] `/pricing`
- [x] `/blog` index
- [x] `/blog/[slug]` article page (reading bar with the yellow scan line, liquid-glass contents)
- [x] `/faq`
- [x] `/how-it-works`
- [x] `/cv-builder`: paper redesign, live ATS score (same 19 checks, run on the PDF text), start empty, signup → auto-download
- [x] `/about`: origin letter, red-pen promises, code vs AI, anonymous team
- [x] `/contact`: letter form that really sends (/api/contact → hello@, Reply goes to the sender), topic hints, quick answers
- [x] `/resume/[role]` pages, rebuilt as first-job guides (`lib/roleExamples`, `components/resume-role`)
  - [x] Software Engineer (Daniel Park: 54 → 100)
  - [x] Data Analyst (Maya Chen: 63 → 100), Product Manager (Jordan Lee: 59 → 100),
        UX Designer (Amara Okafor: 41 → 100)
  - [x] Marketing (Priya Nair: 45 → 100), Project Manager (Marcus Johnson: 60 → 100),
        Sales Representative (Lucía Gómez: 45 → 100)
  - [x] Nurse (David Mensah: 42 → 100), Accountant (Omar Haddad: 54 → 100), Teacher
        (Jamal Wright: 41 → 100), Human Resources (Ryan Patel: 60 → 100), Business Analyst
        (Elena Petrova: 45 → 100)
  - [x] Old `RoleClient.tsx` and `lib/resumeRoles` removed
- [x] `/terms`, `/privacy`: rewritten with the owner (Bulbul Labs LLC, Wyoming law, no arbitration,
      liability cap, Pro fair use), "In short" summaries, shared `components/legal/LegalPage`
- [x] `/login`, `/signup`, `/forgot-password`, `/reset-password`: one Name field, context from ?redirect
      (builder draft, saved scan, pricing plan → billing checkout). Untested end to end: the
      pricing → signup → Stripe checkout path needs a real login and test keys.
- [ ] Merge `redesign/hero` into `main` after the preview is reviewed (ask first)

## 2. Decisions waiting

- [ ] Dual scoring: the ATS Optimizer still scores with AI (`useAI: true`); the free scan
      uses the 19 deterministic checks. Recommendation: deterministic everywhere.
- [ ] `/api/ats/parse` runs an AI "is this a resume?" check on every upload: 5–8 s and a
      small cost, no auth, no rate limit. Rate-limit it or drop it.
- [ ] Make the `cv-files` storage bucket private and serve files through signed URLs.
      **Do this before launch marketing**: files sit at `userId/timestamp-name` in a public bucket,
      and the Privacy Policy deliberately doesn't claim access control until this is fixed.
- [ ] The free-report follow-up email (`api/cron/fomo-email`) has no unsubscribe link. Add one
      (CAN-SPAM, GDPR). The Privacy Policy tells people to reply to stop it meanwhile.
- [ ] The follow-up cron runs once a day (`vercel.json`, 00:00) but only looks at reports made
      2–3 hours earlier, so it emails almost no one. Decide: fix the window or remove the email.
- [ ] Google Analytics loads for everyone with no consent banner. EU/UK visitors need consent
      for analytics cookies: add a banner, or switch to cookieless analytics.
- [ ] Upsell numbers on `reports/[id]` can't be verified: replace or remove.
- [ ] Main `.env.local` uses live Stripe keys: switch local development to test keys.
- [ ] Roll the Stripe test key that was shared in chat.
- [ ] Roll the OpenAI API key that was shared in chat, then update `OPENAI_API_KEY` on Vercel.
- [x] Pro fair use: 150 runs per billing period (`lib/credits` hasProRunsLeft, counted from
      Pro reports + ATS Optimizer results). No active subscribers when it shipped, so no notice
      was needed. Known gap: deleting reports frees runs.
- [ ] Try gpt-6-luna prompt by prompt (cover letter, interview prep first). A blanket
      switch broke `/api/analyze/free` before (2d5919c: long JSON hit the token limit,
      ~30 s per call). Measure accuracy, time and tokens on sample CVs before moving any.
- [ ] `AI_CONFIG.model` in `lib/constants.ts` (default gpt-5.4-mini) is unused; the real
      defaults live in `lib/ai/client.ts`. Remove it so nobody reads the wrong one.
- [ ] Contact form says "We couldn't send that": `/api/contact` answers 502 when the
      email can't go out. Locally `RESEND_API_KEY` is missing from `.env.local`; on a
      deployed preview check the env var and that Resend accepts `hello@rejectly.pro` as
      the sender. Send one test message after the fix.

- [x] Scorer bug: "Consistent date format" only accepted full month names, so every resume from
      our own builder ("Aug 2021") lost 6 points. Fixed in cfd5375; homepage demo after score 87 → 93.
- [ ] Scorer gap: "Quantified achievements" only counts %, $, "N+", "Nx" and "1,000"-style
      numbers; "120 students" or "9 seconds" don't count. Decide whether plain counts should.

- [x] Scorer gap: "Extractable skills" only knew tech and marketing terms. Added data and
      business analysis, PM, sales, design, healthcare, education, HR and finance terms.
- [ ] Scorer: `HARD_SKILLS` matches substrings, so short terms over-count ("go" in "good",
      "rest" in "restaurant", "sem" in "semester"). Switch to word-boundary matching, then
      re-check every score the site states (hero demo, how-it-works, role pages).

## 3. Content rewrite (last)

Do this after every page above is designed. Rules: no invented statistics, no
"bypass" / "beat the bots" framing, facts must match the product (19 checks, credits
never expire, untouched packs refunded within 14 days).

- [ ] "The Ultimate Guide to Bypassing ATS Bots for Your First Job (2026)": rewrite title
      and body, keep the URL
- [ ] "How to Beat ATS in 2026: The Complete Guide": remove the unsourced "reject 85% of
      resumes" claim and the "beat" framing
- [ ] "What is ATS? Understanding Why Your Resume Gets Rejected": "how to beat them"
- [ ] Posts with 2025 in the title: update or retitle ("How to Create the Perfect Resume
      in 2025", "Resume Keywords: The Ultimate Guide to Getting Past ATS in 2025",
      "How to Write a Cover Letter That Actually Gets You Hired in 2025")
- [ ] Three overlapping keyword guides (`resume-keywords-by-industry-ats`,
      `ats-resume-keywords-guide`, `resume-keywords-ultimate-guide-ats-2025`): merge into
      one, redirect the others
- [ ] Two cover letter guides: merge, redirect the other
- [ ] Put `ultimate-guide-bypassing-ats-first-job` back into "Keep reading" after its rewrite
      (`NOT_RECOMMENDED` in `app/(marketing)/blog/[slug]/page.tsx`)
- [ ] Off-topic posts (`how-to-get-paid-in-usd-abroad`,
      `best-countries-work-remotely-salary-cost`): keep, move, or unpublish
- [ ] Reading times stored in the database are inflated (the article page now computes them
      from word count; the stored column is unused and can be fixed or dropped)
- [ ] Re-check every post for numbers it can't source
- [ ] "How ATS Parses Your Resume": source or drop "98% of Fortune 500 companies"
