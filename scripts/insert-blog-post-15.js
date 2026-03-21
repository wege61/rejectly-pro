const { createClient } = require("@supabase/supabase-js");

const supabase = createClient(
  "https://mxnytawzqzrounbomqxf.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im14bnl0YXd6cXpyb3VuYm9tcXhmIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MDYyMTk5OCwiZXhwIjoyMDc2MTk3OTk4fQ.sWdGWliNVxZzQ9dqTMdxh19JKdzeqagavs5791GmgRo"
);

async function insertBlogPost() {
  const { data, error } = await supabase.from("blog_posts").insert({
    title: "Why You're Not Getting Interviews (Even If You're Qualified)",
    slug: "why-not-getting-interviews",
    excerpt:
      "Being qualified for a role and being seen as qualified for it are two different things. The gap between them is almost always identifiable — and fixable. Here's where the process is most likely breaking down.",
    content: `<h2>Qualified and Visible Are Not the Same Thing</h2>

<p>The most frustrating position in a job search is having the right background, the right experience, and the right skills — and still hearing nothing. It produces a specific kind of self-doubt: if I'm qualified and I'm not getting responses, either my qualifications aren't what I think they are, or something about the process is broken in a way I can't see.</p>

<p>In most cases, it's the second one. The process has several layers between you and a recruiter's desk, and any one of them can quietly filter you out regardless of how strong your underlying profile is. The good news is that these layers are identifiable and most of them are fixable. The bad news is that most people don't find them until they've been searching for months.</p>

<h2>You're Not Clearing the ATS Filter</h2>

<p>The most invisible barrier in modern hiring is the Applicant Tracking System that processes your application before any human sees it. ATS platforms score resumes against job descriptions and filter out applications that fall below a threshold — and that threshold is determined by keyword matching, not by qualification in any meaningful sense.</p>

<h3>The Keyword Mismatch Problem</h3>

<p>A resume that describes your experience in your own language — the terms you'd use, the way your company named things internally — often doesn't match the language of the job description, even when the underlying experience is identical. "Revenue operations" and "sales operations" refer to overlapping functions. "Growth marketing" and "performance marketing" describe similar work. ATS systems, especially older ones, score these as different keywords. Your resume may be functionally perfect for the role and still score poorly because you're speaking a slightly different dialect.</p>

<p>The fix is methodical: read the job description, identify the specific terms it uses for each core competency, and use those exact terms in your resume. Not synonyms — the same words. This feels mechanical, but it's what the scoring system rewards.</p>

<h3>Formatting That Looks Fine But Reads Broken</h3>

<p>A resume can appear polished as a PDF while being nearly unreadable to an ATS parser. Multi-column layouts, text boxes, tables, headers and footers containing contact information, icons, and graphics — all of these cause parsing errors that result in garbled or missing data on the recruiter's end. You might have a strong profile that an ATS registers as an incoherent block of text because your resume was built in a design tool optimized for human eyes, not machine parsing.</p>

<p>The test: copy and paste the text from your resume into a plain text document. If it reads out of order, if sections are scrambled, if information is missing — that's what many ATS systems are extracting. Fix the format before applying anywhere else.</p>

<h2>Your Resume Describes What You Did, Not What You Produced</h2>

<p>This is the most common reason qualified candidates don't convert applications into interviews, and it has nothing to do with ATS. It's about what the document communicates to the human who reads it.</p>

<p>Most resumes are written as job descriptions — a list of responsibilities the role involved. "Managed social media accounts." "Supported the sales team." "Responsible for customer onboarding." These phrases tell a recruiter what the job entailed, not what you specifically contributed or delivered. They're forgettable because they could describe anyone who held that role.</p>

<p>The resumes that generate interview requests are written as records of output: what you built, improved, grew, reduced, or delivered — with numbers where possible. "Reduced customer onboarding time from 14 days to 6 through a redesigned intake process" is specific, credible, and interesting in a way that "responsible for customer onboarding" isn't. Every bullet point on your resume should be answering the question: what actually happened because this person was here?</p>

<h2>You're Targeting the Wrong Roles or Companies</h2>

<h3>The Fit Isn't as Obvious as It Feels to You</h3>

<p>Qualification is necessary but not sufficient. A recruiter reviewing your resume is also asking whether the fit is immediately legible — whether your background connects to this role without requiring them to make inferential leaps. If you're changing industries, changing functions, or applying to a role where your most relevant experience is buried or described in terms that don't translate cleanly, you may be qualified in ways the reviewer can't see.</p>

<p>The solution isn't to pad your resume — it's to do the translation work explicitly. If your experience is in B2B software and you're applying to a consumer product company, name the transferable elements directly. Make the connection visible rather than assuming the reader will make it for you.</p>

<h3>Applying to Companies That Aren't Hiring for Fit</h3>

<p>Some companies are genuinely well-matched to your profile. Others are long shots — prestigious, competitive, or simply not at a stage where they value what you bring. A search that's heavily concentrated on well-known companies with high application volumes and narrow hiring criteria will produce fewer responses than one that includes growth-stage companies actively building out the function you work in. Both are worth targeting, but the ratio matters. If your list is 80% household names and 20% everything else, the response rate will reflect that.</p>

<h2>Your LinkedIn Profile Is Doing Damage</h2>

<p>Recruiters who receive your application will almost always check your LinkedIn profile before deciding whether to reach out. What they find there either reinforces your application or undermines it — and most people haven't optimized their profile for this function.</p>

<h3>Inconsistencies Between Resume and Profile</h3>

<p>Dates that don't match. Positions on the resume that aren't on LinkedIn, or vice versa. Titles that differ between the two documents. Any of these creates doubt — not necessarily the conclusion that something dishonest is happening, but the question of which version is accurate. That question is a reason to move to the next candidate, not to investigate further. Keep your resume and LinkedIn profile consistent in every detail that overlaps.</p>

<h3>A Profile That Doesn't Tell the Same Story</h3>

<p>Beyond consistency, your LinkedIn profile should actively support your candidacy — not just exist. A sparse profile with no summary, minimal descriptions of past roles, and no recent activity reads as someone who isn't taking their professional presence seriously. Recruiters who source candidates proactively — which is a significant channel, separate from inbound applications — won't find you if your profile doesn't contain the keywords they're searching for. Your LinkedIn headline and summary are searchable; they should reflect the exact function and skills you're targeting.</p>

<h2>You're Applying Too Late</h2>

<p>Application timing is a real and underappreciated factor. Research on hiring behavior consistently shows that applications submitted within the first 48 hours of a posting going live receive significantly more attention than those submitted a week later. Recruiters often begin reviewing applications before the posting closes, and early applicants have better odds of being seen before the recruiter's attention is saturated by volume.</p>

<p>Roles that have been posted for three or more weeks are often in a different state than they appear — the company may have an internal candidate in process, the position may be on hold, or the requirements may have shifted since the posting went live. Fresh postings are where the opportunity is concentrated. Setting up alerts for target companies and roles on LinkedIn and job boards — and applying within the first day or two — is a simple change that meaningfully improves your position in the queue.</p>

<h2>Your Entire Search Is Running Through Job Boards</h2>

<p>Job boards are visible, accessible, and competitive. Every application you submit there is competing with every other application submitted by everyone who saw the same listing — often hundreds or thousands. The conversion rate of job board applications to interviews is low as a baseline, and it doesn't improve by sending more of them.</p>

<p>The channels with higher conversion rates — referrals, direct outreach to hiring managers, recruiter relationships, proactive contact before a role is posted — require more effort per contact and produce better results per contact. If your entire search is inbound through job boards, you're working the lowest-conversion channel exclusively and wondering why the math isn't working.</p>

<h2>Diagnostic Checklist</h2>

<ul>
  <li>Have you copy-pasted your resume into plain text to check whether ATS can parse it correctly?</li>
  <li>Does your resume use the exact language of each job description you're applying to — not synonyms?</li>
  <li>Are your experience bullets describing outputs and outcomes, not responsibilities and duties?</li>
  <li>Does your LinkedIn profile match your resume exactly in dates, titles, and companies?</li>
  <li>Is your LinkedIn headline and summary optimized with the keywords recruiters in your field search for?</li>
  <li>Are you applying within 48 hours of a posting going live, or are you applying to old listings?</li>
  <li>Is your target company list diversified — not just high-prestige employers with deep applicant pools?</li>
  <li>Are you doing anything beyond job boards — outreach, referrals, recruiter contact?</li>
</ul>

<h2>How Rejectly Identifies Where You're Breaking Down</h2>

<p>The most common reason people don't diagnose these issues themselves is that the resume looks fine to them — because they're reading it as a human, not as an ATS. Rejectly runs the same analysis an ATS does: extracting text from your document, matching it against the job description, and showing you exactly where the keyword gaps and scoring problems are.</p>

<p>If you've been applying without responses, the answer is almost always in that analysis. Not in sending more applications — in understanding what's preventing the ones you've already sent from converting.</p>

<p><a href="/dashboard">Find out why your resume isn't getting responses →</a></p>

<h2>Conclusion</h2>

<p>Not getting interviews when you're qualified isn't a mystery — it's a diagnostic problem. Something specific is happening between your application and a recruiter's decision to reach out, and that something is almost always identifiable. ATS filtering on keyword mismatches or broken formatting. A resume that describes duties instead of outcomes. A LinkedIn profile that creates doubt or simply doesn't appear in recruiter searches. Applying too late, or only through the most competitive channels. Each of these is fixable. None of them require you to be more qualified. They require you to be more visible — which is a different problem with a different solution.</p>`,
    featured_image:
      "https://images.unsplash.com/photo-1543269664-56d93c1b41a6?w=1200&h=630&fit=crop&q=80",
    featured_image_alt: "Person sitting at a desk staring at laptop screen, thoughtful",
    category_id: "8910d30e-ead4-45d8-a279-a77fc4f05c90",
    author_name: "Rejectly Team",
    is_published: true,
    published_at: new Date().toISOString(),
    reading_time_minutes: 7,
    meta_title: "Why You're Not Getting Interviews (Even If You're Qualified) | Rejectly",
    meta_description:
      "Being qualified and being seen as qualified are two different things. Here's a diagnostic breakdown of why strong candidates don't get interview requests — and exactly what to fix.",
    meta_keywords: [
      "why not getting interviews",
      "qualified but no interviews",
      "not getting job interviews",
      "why no response from job applications",
      "job application no response",
      "resume not getting interviews",
      "job search not working",
      "interview tips",
    ],
    og_image:
      "https://images.unsplash.com/photo-1543269664-56d93c1b41a6?w=1200&h=630&fit=crop&q=80",
  }).select();

  if (error) {
    console.error("ERROR:", error.message);
  } else {
    console.log("SUCCESS! Blog post inserted:");
    console.log("ID:", data[0].id);
    console.log("Slug:", data[0].slug);
    console.log("Published:", data[0].is_published);
  }
}

insertBlogPost();
