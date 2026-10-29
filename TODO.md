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
- [ ] `/how-it-works`
- [ ] `/cv-builder` landing
- [ ] `/about`, `/contact`
- [ ] `/resume/[role]` pages
- [ ] `/privacy`, `/terms` (light restyle only, no wording changes without review)
- [ ] `/login`, `/signup`, `/forgot-password`, `/reset-password` (still says "Beat the bots")
- [ ] Merge `redesign/hero` into `main` after the preview is reviewed (ask first)

## 2. Decisions waiting

- [ ] Dual scoring: the ATS Optimizer still scores with AI (`useAI: true`); the free scan
      uses the 19 deterministic checks. Recommendation: deterministic everywhere.
- [ ] `/api/ats/parse` runs an AI "is this a resume?" check on every upload: 5–8 s and a
      small cost, no auth, no rate limit. Rate-limit it or drop it.
- [ ] Make the `cv-files` storage bucket private and serve files through signed URLs.
- [ ] Upsell numbers on `reports/[id]` can't be verified: replace or remove.
- [ ] Main `.env.local` uses live Stripe keys: switch local development to test keys.
- [ ] Roll the Stripe test key that was shared in chat.

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
