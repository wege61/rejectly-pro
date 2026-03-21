// Run: node insert-blog-post.js
// Requires: npm install @supabase/supabase-js

const { createClient } = require("@supabase/supabase-js");

const supabase = createClient(
  "https://mxnytawzqzrounbomqxf.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im14bnl0YXd6cXpyb3VuYm9tcXhmIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MDYyMTk5OCwiZXhwIjoyMDc2MTk3OTk4fQ.sWdGWliNVxZzQ9dqTMdxh19JKdzeqagavs5791GmgRo"
);

async function insertBlogPost() {
  const { data, error } = await supabase.from("blog_posts").insert({
    title: "ATS Resume Keywords: How to Find and Use Them (2026 Guide)",
    slug: "ats-resume-keywords-guide",
    excerpt:
      "Learn how to find the right ATS keywords, where to place them on your resume, and avoid common mistakes that get you filtered out before a recruiter ever sees your application.",
    content: `<h2>Why ATS Keywords Matter More Than You Think</h2>

<p>You spent hours perfecting your resume. You hit "Apply." And then... silence. Sound familiar? Here's the hard truth: <strong>98% of Fortune 500 companies</strong> use Applicant Tracking Systems (ATS) to filter resumes before a human ever sees them. If your resume doesn't contain the right keywords, it gets buried — no matter how qualified you are.</p>

<p>ATS software scans your resume for specific words and phrases that match the job description. It then assigns a relevance score. Resumes with higher scores get pushed to the top of the recruiter's queue. Those with lower scores? They disappear into the void.</p>

<p>The good news: once you understand how ATS keywords work, optimizing your resume becomes straightforward. This guide shows you exactly how to find, choose, and place the right keywords to get past the bots and land interviews.</p>

<h2>What Are ATS Keywords Exactly?</h2>

<p>ATS keywords are the specific terms, skills, and phrases that Applicant Tracking Systems scan for when filtering and ranking your resume. They fall into two main categories:</p>

<p><strong>Hard Skill Keywords:</strong></p>

<ul>
  <li>Technical skills: Python, SQL, Figma, Salesforce, AWS</li>
  <li>Certifications: PMP, CPA, Google Analytics Certified</li>
  <li>Tools and platforms: Jira, HubSpot, SAP, Tableau</li>
  <li>Methodologies: Agile, Scrum, Six Sigma, Lean</li>
</ul>

<p><strong>Soft Skill Keywords:</strong></p>

<ul>
  <li>Leadership and team management</li>
  <li>Cross-functional collaboration</li>
  <li>Strategic planning and problem solving</li>
  <li>Stakeholder communication</li>
</ul>

<p>Important: hard skill keywords carry significantly more weight in ATS scoring. A 2025 industry study found that resumes listing <strong>20+ skills in a separate section</strong> had a 67% rejection rate, while those integrating skills naturally into work experience descriptions dropped to 34%. Context matters more than keyword lists.</p>

<h2>How to Find the Right Keywords for Any Job</h2>

<p>The most effective ATS keywords aren't generic — they come directly from the job posting you're applying to. Here's a step-by-step process:</p>

<h3>Step 1: Analyze the Job Description</h3>

<p>Open the job posting and highlight every skill, tool, qualification, and requirement mentioned. Pay special attention to:</p>

<ul>
  <li>Words that appear <strong>more than once</strong> (these are high-priority keywords)</li>
  <li>Required vs. preferred qualifications (required keywords are non-negotiable)</li>
  <li>Specific tools or software mentioned by name</li>
  <li>Action verbs used to describe responsibilities</li>
</ul>

<h3>Step 2: Check Multiple Postings for the Same Role</h3>

<p>Don't rely on a single job posting. Look at 3-5 similar positions from different companies. Keywords that appear across multiple listings are industry-standard terms that ATS systems are almost certainly scanning for.</p>

<h3>Step 3: Mirror the Exact Language</h3>

<p>This is critical. If the job description says "project management," don't write "managing projects" on your resume. ATS systems often perform <strong>exact-match searches</strong>. While modern platforms use natural language processing to understand context, exact matches still score highest. Use the employer's language, not your own variation of it.</p>

<h3>Step 4: Include Both Acronyms and Full Terms</h3>

<p>Different ATS platforms search differently. Write out the full term on first use with the acronym in parentheses:</p>

<ul>
  <li>"Search Engine Optimization (SEO)" — not just "SEO"</li>
  <li>"Project Management Professional (PMP)" — not just "PMP"</li>
  <li>"Amazon Web Services (AWS)" — not just "AWS"</li>
</ul>

<h2>Where to Place Keywords for Maximum Impact</h2>

<p>ATS systems don't weigh all resume sections equally. Here's where your keywords have the most impact, ranked by priority:</p>

<p><strong>1. Professional Summary (Top of Resume)</strong></p>

<p>This is prime real estate. Include 3-5 of the most important keywords from the job description in your summary. Recruiters who scan past ATS spend only <strong>6-8 seconds</strong> on an initial resume review — your summary is what they read first.</p>

<p><strong>2. Job Titles</strong></p>

<p>If your official title was something creative like "Growth Ninja," use the standard industry equivalent instead: "Growth Marketing Manager." ATS searches for conventional job titles.</p>

<p><strong>3. Work Experience Bullet Points</strong></p>

<p>Weave keywords naturally into your achievement statements. The formula that works best:</p>

<p><em>"[Action verb] + [keyword/skill] + [measurable result]"</em></p>

<p>Example: "Led cross-functional teams using Agile methodology to deliver product launch 2 months ahead of schedule, resulting in $2M revenue in first quarter."</p>

<p><strong>4. Skills Section</strong></p>

<p>A dedicated skills section gives ATS an easy-to-parse keyword list. Group by category for clarity: "Technical: Python, SQL, Tableau" / "Project Management: Agile, Jira, Scrum."</p>

<p><strong>5. Education and Certifications</strong></p>

<p>Include relevant certifications, degrees, and coursework that match the job requirements. These often serve as knockout filters — if the ATS doesn't find them, you're automatically disqualified.</p>

<h2>The 10 Most Universal ATS Keywords in 2026</h2>

<p>While you should always tailor keywords to each job posting, these terms appear in <strong>over 80% of job descriptions</strong> across industries:</p>

<ul>
  <li><strong>Project Management</strong> — planning, executing, and closing projects</li>
  <li><strong>Data Analysis</strong> — interpreting data to drive decisions</li>
  <li><strong>Cross-Functional Collaboration</strong> — working across teams and departments</li>
  <li><strong>Process Optimization</strong> — improving efficiency and workflows</li>
  <li><strong>Stakeholder Communication</strong> — managing expectations and reporting</li>
  <li><strong>Budget Management</strong> — financial planning and cost control</li>
  <li><strong>Strategic Planning</strong> — long-term goal setting and execution</li>
  <li><strong>Team Leadership</strong> — managing and mentoring team members</li>
  <li><strong>Problem Solving</strong> — identifying issues and implementing solutions</li>
  <li><strong>Continuous Improvement</strong> — ongoing process and performance enhancement</li>
</ul>

<h2>Common Keyword Mistakes That Get You Rejected</h2>

<h3>Keyword Stuffing</h3>

<p>Repeating the same keyword 15 times doesn't boost your score — it gets you flagged. Modern ATS platforms use AI to detect unnatural language patterns. Enterprise systems in 2026 have even started flagging resumes that appear entirely AI-generated. Focus on natural integration, not repetition.</p>

<h3>Using Only Generic Keywords</h3>

<p>Terms like "team player" or "hard worker" are so overused that they carry zero weight. Replace them with specific, measurable skills. Instead of "excellent communicator," write "presented quarterly results to C-suite stakeholders across 5 regional offices."</p>

<h3>Ignoring Job-Specific Keywords</h3>

<p>Industry-wide keywords are a good foundation, but each job posting has unique priorities. A "Digital Marketing Manager" role at one company might emphasize "paid social" while another prioritizes "marketing automation." Always customize.</p>

<h3>Sending the Same Resume Everywhere</h3>

<p>This is the single biggest mistake job seekers make. Each job posting has different keyword priorities. Customizing your resume's keywords for each application can increase your ATS match score by <strong>40-60%</strong>. Yes, it takes more time — but generic resumes get generic results.</p>

<h3>Using Outdated Keywords</h3>

<p>Technology and industry terminology evolve. Terms like "social media marketing" might now appear as "digital community management" in modern job descriptions. Keep your keyword vocabulary current by regularly reviewing fresh job postings in your field.</p>

<h2>ATS Keyword Checklist: Before You Hit Apply</h2>

<p>Run through this checklist for every application:</p>

<ul>
  <li>Have you identified <strong>10-15 keywords</strong> from the specific job description?</li>
  <li>Are keywords placed in your summary, job titles, experience, and skills sections?</li>
  <li>Did you include both acronyms and full terms for technical skills?</li>
  <li>Are keywords integrated naturally into achievement statements with metrics?</li>
  <li>Did you use the <strong>exact language</strong> from the job posting (not synonyms)?</li>
  <li>Is your resume in a simple, single-column format that ATS can parse?</li>
  <li>Did you save as .docx (highest ATS compatibility) or clean PDF?</li>
  <li>Have you avoided tables, text boxes, images, and fancy formatting?</li>
</ul>

<h2>How Rejectly Automates Your Keyword Optimization</h2>

<p>Manually comparing your resume to every job description is effective but time-consuming. Rejectly does this for you in seconds:</p>

<ul>
  <li><strong>AI-Powered Keyword Analysis</strong> — Paste any job description and Rejectly instantly identifies the keywords you're missing</li>
  <li><strong>ATS Score Prediction</strong> — See your estimated match score before you apply</li>
  <li><strong>Smart Suggestions</strong> — Get specific recommendations for where and how to add missing keywords</li>
  <li><strong>Format Compliance Check</strong> — Ensure your resume structure passes ATS parsing without errors</li>
</ul>

<p>Stop guessing which keywords matter. Let AI analyze the job description and optimize your resume for maximum ATS compatibility.</p>

<p><a href="/dashboard">Optimize your resume with Rejectly →</a></p>

<h2>Conclusion</h2>

<p>ATS keywords aren't a cheat code — they're the language that connects your qualifications to the systems screening your resume. The candidates who land interviews aren't necessarily more qualified. They're the ones whose resumes speak the same language as the job description. Find the right keywords, place them strategically, integrate them naturally, and tailor for every application. That's the formula that gets your resume past the bots and into human hands.</p>`,
    featured_image:
      "https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=1200&h=630&fit=crop&q=80",
    featured_image_alt: "Person reviewing resume keywords on laptop screen",
    category_id: "c7a0dd47-797e-4ee2-9564-18fbdfa672a9",
    author_name: "Rejectly Team",
    is_published: true,
    published_at: new Date().toISOString(),
    reading_time_minutes: 6,
    meta_title:
      "ATS Resume Keywords: How to Find and Use Them (2026 Guide) | Rejectly",
    meta_description:
      "Discover which ATS keywords actually matter, how to find them in any job description, and where to place them on your resume for maximum impact. Free checklist included.",
    meta_keywords: [
      "ats keywords",
      "resume keywords",
      "ats resume",
      "ats optimization",
      "resume optimization",
      "applicant tracking system",
      "ats friendly resume",
      "resume tips 2026",
    ],
    og_image:
      "https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=1200&h=630&fit=crop&q=80",
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
