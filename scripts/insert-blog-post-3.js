const { createClient } = require("@supabase/supabase-js");

const supabase = createClient(
  "https://mxnytawzqzrounbomqxf.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im14bnl0YXd6cXpyb3VuYm9tcXhmIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MDYyMTk5OCwiZXhwIjoyMDc2MTk3OTk4fQ.sWdGWliNVxZzQ9dqTMdxh19JKdzeqagavs5791GmgRo"
);

async function insertBlogPost() {
  const { data, error } = await supabase.from("blog_posts").insert({
    title: "Resume vs CV: What's the Difference? (+ When to Use Each)",
    slug: "resume-vs-cv-difference",
    excerpt:
      "Most people use the terms interchangeably. Most people are wrong — at least in certain contexts. Here's what actually separates a resume from a CV, and how to know which one a job is actually asking for.",
    content: `<h2>Everyone Thinks They Know This. Most Don't.</h2>

<p>Ask ten people the difference between a resume and a CV, and you'll get ten different answers. Some will say length. Some will say formality. A few will say they're the same thing. Almost nobody will give you the full picture.</p>

<p>The confusion is understandable. The terms get used interchangeably all the time — in casual conversation, in job postings, even by HR professionals who should know better. But in specific contexts, getting this wrong can quietly derail an application before anyone reads a single line of your background.</p>

<p>So let's clear it up properly.</p>

<h2>What a Resume Actually Is</h2>

<p>A resume is a curated, targeted document. Its entire purpose is to make a case for one specific role at one specific company. Everything on it — every bullet point, every skill listed, every line of your summary — is there to answer one question: why should we hire you for this job?</p>

<p>That selectivity is the point. You don't include everything you've ever done. You include what's relevant, framed in a way that speaks to the employer's needs. A resume is an argument, not a record.</p>

<p>In terms of format: one to two pages, roughly. Longer for senior roles with extensive relevant history; shorter for everyone else. Recruiters at large companies spend an average of six to eight seconds on an initial scan. A resume needs to earn its keep on every line.</p>

<h2>What a CV Actually Is</h2>

<p>CV stands for <em>curriculum vitae</em> — Latin for "course of life." The name tells you everything. A CV is a comprehensive record of your academic and professional history. Not a curated argument — a complete account.</p>

<p>That means publications, conference presentations, research grants, teaching experience, professional affiliations, awards, certifications, and anything else that constitutes your scholarly or professional record. Nothing gets left out because it's "not relevant to this role." Relevance, in CV terms, is beside the point. Completeness is the point.</p>

<p>CVs have no page limit. A newly minted PhD might have a three-page CV. A seasoned professor might have twenty. Neither is wrong. Length, in this context, is a signal of depth — not padding.</p>

<h2>The Practical Difference, Side by Side</h2>

<p><strong>Length:</strong> Resumes are one to two pages. CVs are as long as they need to be.</p>

<p><strong>Content:</strong> Resumes highlight selected achievements relevant to a specific role. CVs document everything — research, publications, presentations, academic honors, teaching history.</p>

<p><strong>Purpose:</strong> Resumes are used for most corporate, nonprofit, and private sector jobs. CVs are used for academic positions, medical and clinical roles, research fellowships, and grant applications.</p>

<p><strong>Tailoring:</strong> A resume should be adjusted for every application. A CV stays relatively stable — you add to it over time, but you don't reshape it for each opportunity.</p>

<p><strong>Photos and personal details:</strong> Resumes in the US, UK, and Canada typically omit photos and personal information like age or marital status. CVs for international academic positions sometimes include them, depending on the country's conventions.</p>

<h2>When You Need a Resume</h2>

<p>If you're applying for a job in the private sector — technology, finance, marketing, sales, consulting, operations, retail, hospitality — you need a resume. Full stop. This covers the vast majority of jobs that most people are looking for.</p>

<p>The same applies to most nonprofit roles, government positions below the senior academic or research level, and most startup jobs. When a company posts a job on LinkedIn or Indeed and asks you to upload your "resume or CV," they almost certainly want a resume. The phrasing is just imprecise.</p>

<h2>When You Need a CV</h2>

<p>CVs are the standard in three main contexts:</p>

<p><strong>Academia.</strong> Faculty positions, postdoctoral fellowships, research appointments — these all require a CV. A hiring committee at a university wants to see your full publication record, your teaching history, the grants you've received, the conferences you've presented at. A two-page resume would raise eyebrows.</p>

<p><strong>Medicine and clinical research.</strong> Physicians, researchers, and clinical scientists applying for hospital positions, research roles, or academic medical appointments typically submit CVs. The document needs to capture board certifications, residencies, fellowships, publications, and clinical experience comprehensively.</p>

<p><strong>International applications.</strong> This is where things get genuinely complicated — and where the most confusion lives.</p>

<h2>The International Wrinkle</h2>

<p>In the United States, the distinction between resume and CV is fairly clean. In much of the rest of the world, it isn't.</p>

<p>In the United Kingdom, Ireland, Australia, New Zealand, and many parts of Europe, "CV" is simply the standard term for what Americans would call a resume. A British job posting that asks for your CV is not asking for a twenty-page academic document. It's asking for your professional history, formatted in roughly the same way a US resume would be — just called something different.</p>

<p>This matters if you're applying across borders. An American who sends a one-page resume in response to a UK job posting has done nothing wrong. A British applicant who sends a "CV" to a US company and genuinely submits a ten-page academic document has created an awkward situation.</p>

<p>When applying internationally, the safest approach is to look at what the specific employer is asking for and calibrate to their context — not just the word they used.</p>

<h2>If You're Not Sure Which One to Send</h2>

<p>When a posting is ambiguous, read the description carefully. If it mentions publications, research experience, or academic qualifications as central requirements, lean toward a CV format. If it reads like a standard job listing with responsibilities, required skills, and a salary range, send a resume.</p>

<p>When in doubt, a well-structured resume is almost always the safer choice for non-academic roles. Hiring managers at most companies have never asked for a CV in the technical sense of the word — they just use the term loosely because it sounds more formal.</p>

<blockquote>
<p>The goal of either document is the same: to make it easy for someone to say yes to you. Format is just the vehicle. Content is what actually does the work.</p>
</blockquote>

<h2>One More Thing Worth Knowing</h2>

<p>A CV, by definition, is not something you optimize for a specific application. A resume is. That distinction has real consequences for how you approach your job search.</p>

<p>If you're applying for corporate or private sector roles, generic resumes cost you opportunities. Every posting has its own priorities, its own language, its own keyword landscape. A resume tailored to each application consistently outperforms a static document — not by a small margin, but by a significant one. ATS systems alone filter out a large percentage of applicants before human eyes ever get involved, and keyword matching is a major factor in how those filters work.</p>

<p>Rejectly analyzes any job description and shows you exactly how well your resume matches it — what's landing, what's missing, and where the gaps are. If you're applying with a resume rather than a CV, that kind of precision is worth having.</p>

<p><a href="/dashboard">Check your resume's match score →</a></p>

<h2>The Short Version</h2>

<p>Resume: curated, targeted, one to two pages, used for most jobs in the private and public sector.</p>

<p>CV: comprehensive, untailored, no page limit, used for academic, medical, and research positions — and as a synonym for resume in much of the non-US world.</p>

<p>When you're not sure which one a posting wants, read the context. If it still isn't clear, a clean, well-optimized resume is almost never the wrong call.</p>`,
    featured_image:
      "https://images.unsplash.com/photo-1568992688065-536aad8a12f6?w=1200&h=630&fit=crop&q=80",
    featured_image_alt: "Clean desk with documents and a laptop",
    category_id: "9706e75f-58ea-4aad-91ce-4d0accae36e0",
    author_name: "Rejectly Team",
    is_published: true,
    published_at: new Date().toISOString(),
    reading_time_minutes: 6,
    meta_title:
      "Resume vs CV: What's the Difference? (+ When to Use Each) | Rejectly",
    meta_description:
      "Resume and CV aren't the same thing — and using the wrong one can hurt your application. Here's a clear breakdown of the differences and exactly when to use each.",
    meta_keywords: [
      "resume vs cv",
      "cv vs resume difference",
      "when to use a cv",
      "when to use a resume",
      "resume or cv",
      "curriculum vitae vs resume",
      "resume tips",
      "job application tips",
    ],
    og_image:
      "https://images.unsplash.com/photo-1568992688065-536aad8a12f6?w=1200&h=630&fit=crop&q=80",
  }).select();

  if (error) {
    console.error("ERROR:", error.message);
  } else {
    console.log("SUCCESS! Blog post inserted:");
    console.log("ID:", data[0].id);
    console.log("Slug:", data[0].slug);
    console.log("Published:", data[0].is_published);
    console.log("Published at:", data[0].published_at);
  }
}

insertBlogPost();
