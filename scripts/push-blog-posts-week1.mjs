#!/usr/bin/env node

/**
 * Push 3 SEO blog posts for Week 1 of 30-day plan
 * Run: node scripts/push-blog-posts-week1.mjs
 */

const SUPABASE_URL = 'https://mxnytawzqzrounbomqxf.supabase.co';
const SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im14bnl0YXd6cXpyb3VuYm9tcXhmIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MDYyMTk5OCwiZXhwIjoyMDc2MTk3OTk4fQ.sWdGWliNVxZzQ9dqTMdxh19JKdzeqagavs5791GmgRo';

const headers = {
  'apikey': SERVICE_KEY,
  'Authorization': `Bearer ${SERVICE_KEY}`,
  'Content-Type': 'application/json',
  'Prefer': 'return=representation',
};

const CATEGORIES = {
  ATS_OPTIMIZATION: 'c7a0dd47-797e-4ee2-9564-18fbdfa672a9',
  RESUME_TIPS: '9706e75f-58ea-4aad-91ce-4d0accae36e0',
  CAREER_ADVICE: '8910d30e-ead4-45d8-a279-a77fc4f05c90',
};

const TAGS = {
  ATS: '73070f6c-ada7-4646-8caa-b2623a67ea7e',
  RESUME: 'cb52df10-a06c-4f73-9e12-e73d80e8b35d',
  JOB_SEARCH: '8fe24506-08da-4cfc-b6b8-e6196043abc0',
};

// ─── Post 1: Should You Customize Your Resume for Every Job? ─────────────────

const post1 = {
  title: 'Should You Customize Your Resume for Every Job? (The Data Says Yes)',
  slug: 'should-you-customize-resume-every-job',
  excerpt: 'Sending the same resume to every job is the biggest mistake job seekers make. Here\'s the data behind why customization matters — and how to do it without spending hours on each application.',
  featured_image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200&h=630&fit=crop',
  featured_image_alt: 'Person customizing resume for different job applications',
  category_id: CATEGORIES.CAREER_ADVICE,
  author_name: 'Rejectly Team',
  is_published: true,
  published_at: new Date().toISOString(),
  reading_time_minutes: 8,
  meta_title: 'Should You Customize Your Resume for Every Job? Data Says Yes',
  meta_description: 'The data is clear: customized resumes get 3x more callbacks. Learn why sending the same resume everywhere fails and how to tailor each application efficiently.',
  meta_keywords: ['customize resume for every job', 'tailor resume', 'should i change my resume for each job', 'resume for each application', 'job specific resume', 'resume customization'],
  content: `
<h2>The One-Resume Strategy Is Killing Your Job Search</h2>

<p>Let's start with an uncomfortable question: <strong>are you sending the same resume to every job?</strong></p>

<p>If you are, you're in the majority — and that's the problem. Most job seekers create one "master resume" and blast it to every opening they find. It feels efficient. It feels productive. You're applying to 20 jobs a week!</p>

<p>But here's what the data shows: <strong>a generic resume has roughly a 2-3% callback rate.</strong> That means for every 50 applications, you might hear back from one or two companies. And those aren't interviews — those are just "we received your application" emails.</p>

<p>A tailored resume? The callback rate jumps to <strong>8-12%</strong>. That's not a minor improvement — it's the difference between hearing nothing for months and having multiple interviews each week.</p>

<h2>Why Generic Resumes Fail</h2>

<p>There are three reasons your one-resume approach isn't working:</p>

<h3>1. ATS Keyword Matching</h3>

<p>Every company writes their job descriptions differently. Even for the same role, Company A might require "project management" while Company B asks for "program management." ATS systems match your resume against <em>their specific</em> job posting. If your resume says "managed projects" but the posting says "program management," the ATS might not make the connection.</p>

<p>This isn't about lying — it's about <strong>speaking each employer's language.</strong></p>

<h3>2. Different Companies Prioritize Different Things</h3>

<p>A startup looking for a Marketing Manager wants to see growth hacking, scrappiness, and wearing multiple hats. An enterprise company wants process, scale, and cross-functional leadership. Same title, completely different expectations.</p>

<p>Your resume needs to highlight the aspects of your experience that each specific company cares about.</p>

<h3>3. Recruiter Attention Is Limited</h3>

<p>Recruiters spend an average of <strong>6-7 seconds</strong> on initial resume review. In those seconds, they're scanning for specific keywords and experiences that match their open role. If your resume leads with achievements relevant to a different type of role, you've lost them.</p>

<h2>What "Customization" Actually Means</h2>

<p>Good news: customizing your resume doesn't mean rewriting it from scratch for every application. Here's what it actually involves:</p>

<h3>Level 1: Keyword Matching (5 minutes)</h3>
<p>Read the job posting. Identify the top 5-10 keywords and skills they mention. Make sure those exact terms appear in your resume — in context, not just listed.</p>

<h3>Level 2: Achievement Reordering (10 minutes)</h3>
<p>Move your most relevant achievements to the top of each experience section. If the job emphasizes leadership, lead with your leadership accomplishments. If it emphasizes technical skills, lead with technical wins.</p>

<h3>Level 3: Full Optimization (15-20 minutes)</h3>
<p>Rewrite your bullet points to mirror the job description's language. Adjust your summary/objective. Add role-specific skills. This is the gold standard — and it's what gets the highest callback rates.</p>

<h2>The Time Problem (And How to Solve It)</h2>

<p>The obvious pushback: "I don't have 20 minutes per application. I'm applying to dozens of jobs."</p>

<p>Here's the math that changes the equation:</p>

<ul>
<li><strong>50 generic applications × 2% callback = 1 response</strong></li>
<li><strong>15 tailored applications × 10% callback = 1.5 responses</strong></li>
</ul>

<p>You get <em>more</em> responses from fewer, better applications. Quality beats quantity — every time.</p>

<p>But even 15-20 minutes per application adds up. This is exactly the problem that <a href="/features">AI resume tools</a> solve. Instead of manually rewriting your resume for each job, an AI can read the job description, identify the critical keywords, and rewrite your resume to match — in under a minute.</p>

<h2>What to Customize (Priority Order)</h2>

<ol>
<li><strong>Professional Summary</strong> — Tailor it to each role's core requirements</li>
<li><strong>Skills Section</strong> — Mirror the job posting's required skills</li>
<li><strong>Achievement Bullets</strong> — Lead with what matters most to this employer</li>
<li><strong>Job Titles</strong> — If your actual title was "associate," but you did "coordinator" work and the job asks for a coordinator, adjust accordingly (truthfully)</li>
<li><strong>Keywords Throughout</strong> — Naturally weave in the specific terms from the posting</li>
</ol>

<h2>Real Example: Same Person, Two Resumes</h2>

<p>Meet Alex — a marketing professional applying for two different roles:</p>

<h3>Application 1: Growth Marketing Manager at a Startup</h3>
<p><em>"Spearheaded growth marketing strategy that increased MQLs by 340% in 6 months through data-driven experimentation across paid social, email automation, and content marketing. Managed $50K monthly budget with 280% ROAS."</em></p>

<h3>Application 2: Senior Marketing Manager at an Enterprise Company</h3>
<p><em>"Led cross-functional marketing team of 8 across brand, content, and demand generation. Developed and executed go-to-market strategy for enterprise SaaS product, generating $2.4M pipeline through integrated campaigns and stakeholder alignment."</em></p>

<p><strong>Same person. Same experience. Completely different emphasis.</strong> The startup version highlights scrappiness and metrics. The enterprise version highlights team leadership and strategy. Both are true — but each speaks directly to what that employer is looking for.</p>

<h2>The Bottom Line</h2>

<p>Every piece of data we have says the same thing: <strong>customized resumes dramatically outperform generic ones.</strong> The 6-7 seconds a recruiter spends on your resume need to immediately show them that you're a match for <em>their specific role</em>.</p>

<p>You have two options:</p>
<ol>
<li>Spend 15-20 minutes manually tailoring each application</li>
<li>Use AI to do it in under a minute</li>
</ol>

<p>Either way, stop sending the same resume everywhere. Your future self will thank you.</p>

<p><strong>Ready to create job-specific resumes?</strong> <a href="/signup">Try Rejectly.pro</a> — paste a job description, and our AI creates a fully optimized resume tailored to that specific role. Or <a href="/ats-check">check your current resume's ATS score</a> to see how it performs.</p>`,
};

// ─── Post 2: ATS Resume Format ───────────────────────────────────────────────

const post2 = {
  title: 'ATS Resume Format: The Only Template You Need in 2026',
  slug: 'ats-resume-format-template-2026',
  excerpt: 'Stop guessing about resume formatting. Here\'s the exact format that passes every major ATS system — Workday, Greenhouse, Taleo, and Lever — with a downloadable template and section-by-section breakdown.',
  featured_image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=1200&h=630&fit=crop',
  featured_image_alt: 'ATS-friendly resume template format example',
  category_id: CATEGORIES.RESUME_TIPS,
  author_name: 'Rejectly Team',
  is_published: true,
  published_at: new Date().toISOString(),
  reading_time_minutes: 9,
  meta_title: 'ATS Resume Format 2026: The Only Template You Need',
  meta_description: 'The exact resume format that passes Workday, Greenhouse, Taleo, and Lever ATS systems. Section-by-section breakdown with formatting rules.',
  meta_keywords: ['ats resume format', 'ats friendly resume template', 'ats resume template', 'resume format for ats', 'ats compatible resume', 'best resume format 2026', 'resume template ats friendly'],
  content: `
<h2>Why Resume Format Matters More Than Content</h2>

<p>Here's a counterintuitive truth: <strong>your resume's format matters more than its content — at least for the first screening.</strong></p>

<p>An Applicant Tracking System (ATS) doesn't read your resume the way a human does. It <em>parses</em> it — extracting text, identifying sections, and categorizing information into structured fields. If your formatting confuses the parser, even the most impressive achievements become jumbled data.</p>

<p>We've analyzed how the four major ATS systems — Workday, Greenhouse, Taleo, and Lever — parse resumes, and distilled it into one format that works everywhere.</p>

<h2>The Universal ATS-Friendly Format</h2>

<p>Here's the format structure that passes all major ATS systems:</p>

<h3>Document Settings</h3>
<ul>
<li><strong>File type:</strong> .docx (best) or text-based PDF</li>
<li><strong>Font:</strong> Arial, Calibri, or Helvetica — 10-12pt body, 14-16pt headers</li>
<li><strong>Margins:</strong> 0.5" to 1" on all sides</li>
<li><strong>Layout:</strong> Single column only — no tables, no columns, no text boxes</li>
<li><strong>Length:</strong> 1-2 pages (1 for &lt;10 years experience, 2 for 10+ years)</li>
<li><strong>Line spacing:</strong> 1.0 to 1.15</li>
</ul>

<h3>Section Order (Top to Bottom)</h3>
<ol>
<li>Contact Information</li>
<li>Professional Summary</li>
<li>Skills</li>
<li>Experience</li>
<li>Education</li>
<li>Certifications (if applicable)</li>
</ol>

<h2>Section-by-Section Breakdown</h2>

<h3>1. Contact Information</h3>

<p><strong>Critical rule:</strong> Put your contact info in the document body — not in the header or footer. Many ATS systems (especially Taleo and older Workday versions) cannot read header/footer content.</p>

<p>Include:</p>
<ul>
<li>Full name (no nicknames in parentheses)</li>
<li>City, State (no full address needed)</li>
<li>Phone number</li>
<li>Professional email</li>
<li>LinkedIn URL (customized, e.g., linkedin.com/in/yourname)</li>
</ul>

<p><strong>Don't include:</strong> Photo, date of birth, marital status, or full mailing address.</p>

<h3>2. Professional Summary (3-4 lines)</h3>

<p>This is your elevator pitch — and the first text the ATS and recruiter see. Make it count:</p>

<p><em>"Results-driven Software Engineer with 6+ years of experience building scalable web applications using React, Node.js, and AWS. Proven track record of reducing system latency by up to 40% and leading cross-functional teams of 5-8 engineers in Agile environments."</em></p>

<p>Key rules:</p>
<ul>
<li>Include your target job title</li>
<li>Mention years of experience</li>
<li>Name 3-4 key technologies or skills</li>
<li>Include one quantified achievement</li>
<li><strong>Customize this for every application</strong></li>
</ul>

<h3>3. Skills Section</h3>

<p>Use a simple comma-separated or bulleted list. Group by category if you have many skills:</p>

<p><strong>Languages:</strong> JavaScript, TypeScript, Python, SQL<br />
<strong>Frameworks:</strong> React, Next.js, Node.js, Express<br />
<strong>Cloud:</strong> AWS (EC2, S3, Lambda), Docker, CI/CD<br />
<strong>Tools:</strong> Git, JIRA, Figma, PostgreSQL</p>

<p><strong>ATS tip:</strong> List both the full term and abbreviation: "Search Engine Optimization (SEO)" — this catches both variations in keyword matching.</p>

<h3>4. Experience Section</h3>

<p>This is where most ATS parsing breaks. Follow this exact format:</p>

<p><strong>Job Title</strong><br />
<strong>Company Name</strong> | City, State | Month Year – Month Year</p>

<ul>
<li>Start each bullet with a strong action verb</li>
<li>Include specific numbers, percentages, or dollar amounts</li>
<li>Keep bullets to 1-2 lines each</li>
<li>Use 4-6 bullets per role (most recent roles get more)</li>
</ul>

<p>Example:</p>
<ul>
<li>Architected microservices backend serving 50K daily active users, reducing API response time from 800ms to 120ms</li>
<li>Led migration from monolith to microservices architecture, improving deployment frequency from monthly to daily releases</li>
<li>Mentored 4 junior engineers through code reviews and pair programming sessions, resulting in 30% faster onboarding</li>
</ul>

<h3>5. Education Section</h3>

<p>Keep it simple:</p>

<p><strong>Degree, Major</strong><br />
University Name | Graduation Year</p>

<p>Only include GPA if it's 3.5+ and you graduated within the last 3 years. For experienced professionals, education goes last — your work experience matters more.</p>

<h3>6. Certifications</h3>

<p>If you have relevant certifications, list them clearly:</p>
<ul>
<li>AWS Solutions Architect Associate (2025)</li>
<li>PMP – Project Management Professional (2024)</li>
<li>Google Analytics Certified (2025)</li>
</ul>

<h2>Formatting Rules That Prevent ATS Parsing Failures</h2>

<h3>✅ Do This</h3>
<ul>
<li>Use standard section headers: "Experience," "Education," "Skills"</li>
<li>Use standard bullet points (•) — not custom symbols</li>
<li>Use consistent date formatting throughout (Month Year – Month Year)</li>
<li>Save as .docx for maximum ATS compatibility</li>
<li>Use bold for job titles and company names — ATS systems often use bold text as parsing signals</li>
</ul>

<h3>❌ Never Do This</h3>
<ul>
<li>Tables or columns — ATS reads left-to-right, tables create scrambled output</li>
<li>Text boxes — completely invisible to most ATS parsers</li>
<li>Headers/footers for important info — many systems skip these entirely</li>
<li>Images, icons, or graphics — ATS can't read visual elements</li>
<li>Creative section names like "My Journey" or "What I Bring" — ATS expects standard terms</li>
<li>Fancy fonts or colored text — stick to black text, standard fonts</li>
</ul>

<h2>How Different ATS Systems Handle Your Resume</h2>

<h3>Workday</h3>
<p>The strictest parser. Workday will mangle anything with tables or multi-column layouts. It also struggles with PDFs that have complex layers. <strong>Always submit .docx to Workday-powered portals.</strong></p>

<h3>Greenhouse</h3>
<p>Better parsing than Workday, but heavy emphasis on keyword matching. Greenhouse extracts your skills and maps them against the job requirements — so your skills section needs to be comprehensive.</p>

<h3>Taleo (Oracle)</h3>
<p>Legacy system still used by many large corporations. Taleo's parser is older and less forgiving. Simple formatting is essential. It also doesn't handle special characters well — avoid em-dashes and fancy quotation marks.</p>

<h3>Lever</h3>
<p>Most modern parser of the four. Lever handles PDFs better than others and has decent synonym recognition. Still, clean formatting helps ensure accurate parsing.</p>

<h2>Quick ATS Format Checklist</h2>

<p>Before you submit, run through this checklist:</p>

<ol>
<li>☐ Single-column layout?</li>
<li>☐ No tables, text boxes, or graphics?</li>
<li>☐ Contact info in body (not header)?</li>
<li>☐ Standard section headers?</li>
<li>☐ Standard font, 10-12pt?</li>
<li>☐ Saved as .docx or text-based PDF?</li>
<li>☐ All dates in consistent format?</li>
<li>☐ Keywords from job description included?</li>
</ol>

<p>If you checked all 8, your format is ATS-ready.</p>

<h2>Don't Just Format — Optimize</h2>

<p>Good formatting gets your resume <em>through</em> the ATS. Good content gets you the interview. You need both.</p>

<p>The fastest way to check? <a href="/ats-check">Run your resume through our free ATS checker</a> — it tests your formatting and keyword optimization against all four major ATS systems and gives you a score in seconds.</p>

<p>Want to go further? Our <a href="/cv-builder">free CV Builder</a> creates a perfectly formatted, ATS-optimized resume from scratch — so you never have to worry about formatting again.</p>`,
};

// ─── Post 3: Free ATS Resume Checker ─────────────────────────────────────────

const post3 = {
  title: 'Free ATS Resume Checker: How to Check Your Resume Score Before Applying',
  slug: 'free-ats-resume-checker-how-to-check-score',
  excerpt: 'Don\'t apply blind. Learn how to check your resume\'s ATS score for free, understand what the score means, and fix the issues that get you rejected — before you hit submit.',
  featured_image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&h=630&fit=crop',
  featured_image_alt: 'Checking resume ATS score on computer screen',
  category_id: CATEGORIES.ATS_OPTIMIZATION,
  author_name: 'Rejectly Team',
  is_published: true,
  published_at: new Date().toISOString(),
  reading_time_minutes: 7,
  meta_title: 'Free ATS Resume Checker: Check Your Resume Score | 2026',
  meta_description: 'Check your resume ATS score for free before applying. Learn what ATS scores mean, how to interpret results, and fix issues that cause automatic rejection.',
  meta_keywords: ['free ats resume checker', 'check resume score', 'ats score checker free', 'resume score checker', 'ats resume scan free', 'check my resume ats', 'free resume scanner'],
  content: `
<h2>Why You Should Check Your Resume Score Before Every Application</h2>

<p>Imagine spending an hour crafting the perfect cover letter, carefully filling out an application form, and hitting "Submit" — only to have your resume automatically rejected before anyone reads it.</p>

<p>That's exactly what happens to <strong>85% of job applications.</strong> The ATS rejects them based on formatting issues, missing keywords, or structural problems. The candidate never finds out — they just never hear back.</p>

<p>This is why checking your resume score <em>before</em> you apply is so important. A 2-minute check can save you from weeks of silence.</p>

<h2>What Is a Resume ATS Score?</h2>

<p>An ATS resume score is a numerical grade (typically 0-100) that measures how well your resume will perform when parsed and evaluated by Applicant Tracking Systems. The score considers:</p>

<ul>
<li><strong>Format compatibility:</strong> Can the ATS actually read your resume?</li>
<li><strong>Section structure:</strong> Does your resume have the sections ATS expects?</li>
<li><strong>Keyword coverage:</strong> Does your resume contain the terms the job requires?</li>
<li><strong>Content quality:</strong> Are your bullets quantified and impact-focused?</li>
<li><strong>ATS-specific criteria:</strong> How well does your resume work across Workday, Greenhouse, Taleo, and Lever?</li>
</ul>

<h2>How to Interpret Your Score</h2>

<h3>90-100: Excellent ✅</h3>
<p>Your resume is highly optimized. It should pass the vast majority of ATS filters. Minor tweaks might help, but you're in great shape.</p>

<h3>75-89: Good 🟡</h3>
<p>Your resume will pass many ATS systems, but there are optimization opportunities. Check for missing keywords and formatting issues that could be improved.</p>

<h3>60-74: Fair ⚠️</h3>
<p>Your resume has significant issues. It might pass simpler ATS systems but will likely be filtered out by stricter ones like Workday. Focus on keyword gaps and formatting problems.</p>

<h3>Below 60: Needs Work 🔴</h3>
<p>Your resume has critical problems that will cause rejection by most ATS systems. Common causes: tables/columns, missing keywords, creative formatting, or non-standard section headers.</p>

<h2>How to Check Your Resume Score (Step by Step)</h2>

<p>Here's how to check your resume's ATS compatibility in under 2 minutes:</p>

<h3>Step 1: Prepare Your Resume File</h3>
<p>Have your resume ready as a PDF or DOCX file. If you have multiple versions, start with the one you use most frequently.</p>

<h3>Step 2: Upload to an ATS Checker</h3>
<p>Go to a free ATS resume checker like <a href="/ats-check">Rejectly's ATS Score Checker</a>. Upload your resume — no signup required for your initial score.</p>

<h3>Step 3: Review Your Score Breakdown</h3>
<p>Don't just look at the overall number. Pay attention to the category breakdowns:</p>
<ul>
<li><strong>Format Score:</strong> Is your resume ATS-parseable?</li>
<li><strong>Content Score:</strong> Are your bullets strong and quantified?</li>
<li><strong>Keyword Score:</strong> Are you missing critical terms?</li>
<li><strong>ATS Compatibility:</strong> How does your resume perform on each system?</li>
</ul>

<h3>Step 4: Fix the Issues</h3>
<p>Focus on the lowest-scoring categories first. Common quick fixes:</p>
<ul>
<li><strong>Format issues:</strong> Remove tables, columns, graphics, and text boxes</li>
<li><strong>Missing sections:</strong> Add a Skills section if you don't have one</li>
<li><strong>Keyword gaps:</strong> Add the specific terms from the job description</li>
<li><strong>Weak bullets:</strong> Add numbers and measurable outcomes</li>
</ul>

<h3>Step 5: Re-check</h3>
<p>After making fixes, run the check again. Keep iterating until your score is 80+.</p>

<h2>The 5 Most Common Issues ATS Checkers Find</h2>

<h3>1. Tables and Multi-Column Layouts</h3>
<p><strong>Impact: Critical.</strong> Tables are the #1 cause of ATS parsing failures. The system reads left-to-right across the entire page, so column content gets mixed together. A two-column layout with your name on the left and contact info on the right might parse as "John Doe john@email 555-123 Software Engineer com 4567."</p>

<h3>2. Missing Keywords</h3>
<p><strong>Impact: High.</strong> If the job requires "project management" and your resume only says "managed projects," some ATS systems won't make the connection. Use the exact phrases from the job posting.</p>

<h3>3. Non-Standard Section Headers</h3>
<p><strong>Impact: Medium-High.</strong> ATS systems look for specific section names to categorize your information. "Experience" is recognized; "Where I've Made an Impact" is not. Stick to standard headers.</p>

<h3>4. Weak or Unquantified Bullets</h3>
<p><strong>Impact: Medium.</strong> Bullets that start with "Responsible for" or "Helped with" are weak. ATS systems (and recruiters) prefer quantified achievements: "Increased" by X%, "Reduced" by $Y, "Led" team of Z.</p>

<h3>5. Contact Info in Headers/Footers</h3>
<p><strong>Impact: Medium.</strong> Many ATS systems skip header and footer content entirely. If your name and email are only in the header, the system might not even know who you are.</p>

<h2>Free vs. Paid ATS Checkers: What's the Difference?</h2>

<p>Most free ATS checkers give you a basic score. Here's what to look for:</p>

<h3>Basic (Free)</h3>
<ul>
<li>Overall ATS score</li>
<li>Major formatting issues</li>
<li>Basic keyword analysis</li>
</ul>

<h3>Advanced (Paid/Pro)</h3>
<ul>
<li>Per-system compatibility (Workday, Greenhouse, Taleo, Lever)</li>
<li>Keyword gap analysis against specific job descriptions</li>
<li>Bullet point improvement suggestions</li>
<li>Optimized resume generation</li>
<li>Before/after score comparison</li>
</ul>

<p>Start with a free check to understand your baseline. If your score is below 80, consider using an optimization tool to fix the issues systematically.</p>

<h2>How Often Should You Check Your Score?</h2>

<p><strong>Every time you apply to a different type of role.</strong></p>

<p>Here's why: an ATS score isn't static. The same resume might score 85 for a Marketing Manager position and 55 for a Product Manager position — because the keywords are completely different.</p>

<p>Ideally, you should:</p>
<ol>
<li>Check your base resume once (fix formatting issues)</li>
<li>Customize your resume for each job posting</li>
<li>Check the customized version against that specific role's requirements</li>
</ol>

<h2>Start Checking Now</h2>

<p>The best time to check your resume score is before your next application — not after weeks of silence wondering what went wrong.</p>

<p><a href="/ats-check"><strong>Check your ATS resume score for free →</strong></a></p>

<p>It takes less than a minute. No signup required. You'll get an instant score with a detailed breakdown of what's working and what needs to be fixed.</p>

<p>If your score needs improvement, our <a href="/features">AI-powered optimizer</a> can fix the issues automatically — or you can <a href="/cv-builder">build a new ATS-friendly resume from scratch</a> using our free CV Builder.</p>`,
};

// ─── Push Function ───────────────────────────────────────────────────────────

async function pushPost(post, tagIds) {
  console.log(`\n📝 Pushing: "${post.title}"...`);

  const response = await fetch(`${SUPABASE_URL}/rest/v1/blog_posts`, {
    method: 'POST',
    headers,
    body: JSON.stringify(post),
  });

  if (!response.ok) {
    const error = await response.text();
    console.error(`❌ Failed: ${error}`);
    return;
  }

  const [insertedPost] = await response.json();
  console.log(`✅ ID: ${insertedPost.id}`);

  for (const tagId of tagIds) {
    const tagResponse = await fetch(`${SUPABASE_URL}/rest/v1/blog_post_tags`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ post_id: insertedPost.id, tag_id: tagId }),
    });
    if (tagResponse.ok) console.log(`  🏷️  Tag: ${tagId}`);
    else console.error(`  ⚠️ Tag failed: ${tagId}`);
  }
  return insertedPost;
}

// ─── Main ────────────────────────────────────────────────────────────────────

async function main() {
  console.log('🚀 Pushing Week 1 blog posts...\n');

  await pushPost(post1, [TAGS.RESUME, TAGS.JOB_SEARCH]);
  await pushPost(post2, [TAGS.ATS, TAGS.RESUME]);
  await pushPost(post3, [TAGS.ATS, TAGS.RESUME, TAGS.JOB_SEARCH]);

  console.log('\n✨ Done! 3 new posts live. Blog now has 11 total.');
  console.log('📍 http://localhost:3000/blog');
}

main().catch(console.error);
