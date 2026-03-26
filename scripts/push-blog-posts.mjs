#!/usr/bin/env node

/**
 * Push 2 SEO-optimized blog posts to Supabase
 * Run: node scripts/push-blog-posts.mjs
 */

const SUPABASE_URL = 'https://mxnytawzqzrounbomqxf.supabase.co';
const SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im14bnl0YXd6cXpyb3VuYm9tcXhmIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MDYyMTk5OCwiZXhwIjoyMDc2MTk3OTk4fQ.sWdGWliNVxZzQ9dqTMdxh19JKdzeqagavs5791GmgRo';

const headers = {
  'apikey': SERVICE_KEY,
  'Authorization': `Bearer ${SERVICE_KEY}`,
  'Content-Type': 'application/json',
  'Prefer': 'return=representation',
};

// ─── Category & Tag IDs ──────────────────────────────────────────────────────
const CATEGORIES = {
  ATS_OPTIMIZATION: 'c7a0dd47-797e-4ee2-9564-18fbdfa672a9',
  RESUME_TIPS: '9706e75f-58ea-4aad-91ce-4d0accae36e0',
};

const TAGS = {
  ATS: '73070f6c-ada7-4646-8caa-b2623a67ea7e',
  RESUME: 'cb52df10-a06c-4f73-9e12-e73d80e8b35d',
  JOB_SEARCH: '8fe24506-08da-4cfc-b6b8-e6196043abc0',
};

// ─── Blog Post 1: How to Beat ATS ────────────────────────────────────────────

const post1 = {
  title: 'How to Beat ATS in 2025: The Complete Guide',
  slug: 'how-to-beat-ats-2025-complete-guide',
  excerpt: 'Applicant Tracking Systems reject 85% of resumes before a human ever sees them. Here\'s exactly how they work, what they scan for, and how to optimize your resume to pass every time.',
  featured_image: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=1200&h=630&fit=crop',
  featured_image_alt: 'Person reviewing ATS resume optimization results on laptop',
  category_id: CATEGORIES.ATS_OPTIMIZATION,
  author_name: 'Rejectly Team',
  is_published: true,
  published_at: new Date().toISOString(),
  reading_time_minutes: 12,
  meta_title: 'How to Beat ATS in 2025: The Complete Guide to Passing Resume Scanners',
  meta_description: 'Learn exactly how Applicant Tracking Systems work and how to optimize your resume to pass ATS scanners. Covers Workday, Greenhouse, Taleo, and Lever with actionable tips.',
  meta_keywords: ['how to beat ats', 'ats resume checker', 'ats friendly resume', 'how to pass ats', 'applicant tracking system', 'ats resume tips', 'resume scanner', 'ats optimization'],
  content: `
<h2>What Is an ATS and Why Does It Matter?</h2>

<p>An <strong>Applicant Tracking System (ATS)</strong> is software that companies use to manage job applications. Before your resume reaches a human recruiter, it passes through this digital gatekeeper. The ATS parses your resume, extracts information, and scores how well you match the job requirements.</p>

<p>Here's the uncomfortable truth: <strong>85% of resumes are rejected by ATS before a recruiter ever sees them.</strong> This isn't because candidates aren't qualified — it's because their resumes aren't formatted for machines.</p>

<p>If you've been applying to jobs and hearing nothing back, ATS rejection is almost certainly the reason. Let's fix that.</p>

<h2>How ATS Systems Actually Work</h2>

<p>Understanding the enemy is half the battle. Here's what happens when you submit your resume:</p>

<h3>Step 1: Document Parsing</h3>
<p>The ATS converts your resume file (PDF, DOCX, or plain text) into structured data. It tries to identify your name, contact info, work experience, education, and skills. <strong>This is where most resumes fail.</strong> Tables, columns, graphics, headers, and footers confuse the parser.</p>

<h3>Step 2: Keyword Extraction</h3>
<p>The system scans your parsed content for keywords that match the job description. It's looking for job titles, skills, tools, certifications, and industry-specific vocabulary. This isn't a simple word match — modern ATS systems understand synonyms and related terms.</p>

<h3>Step 3: Ranking & Scoring</h3>
<p>Your resume receives a score based on how many required and preferred qualifications you match. Resumes with a score above the threshold get forwarded to a human recruiter. Those below get archived — often permanently.</p>

<h2>The 4 Most Popular ATS Systems (And Their Quirks)</h2>

<p>Not all ATS systems parse resumes the same way. Here's what you need to know about the big four:</p>

<h3>Workday</h3>
<p>Used by <strong>50% of Fortune 500 companies</strong>. Workday is notoriously strict about formatting. It struggles with tables, multi-column layouts, and embedded images. If your resume isn't simple and clean, Workday will mangle your data.</p>

<h3>Greenhouse</h3>
<p>Popular with <strong>10,000+ companies</strong>, especially tech startups and mid-size firms. Greenhouse has better parsing than Workday but still trips on creative layouts. It places heavy emphasis on keyword matching against the job req.</p>

<h3>Taleo (Oracle)</h3>
<p>The legacy giant, still used by many large enterprises and government agencies. Taleo's parsing engine is older and less sophisticated — it needs very standard formatting to work properly.</p>

<h3>Lever</h3>
<p>Favored by fast-growing startups. Lever has relatively modern parsing but weights recent experience heavily. It's also one of the few ATS systems that factors in your application history with the company.</p>

<h2>10 Rules for an ATS-Friendly Resume</h2>

<p>Follow these rules and you'll pass the vast majority of ATS filters:</p>

<h3>1. Use a Simple, Single-Column Layout</h3>
<p>Tables, text boxes, columns, and graphics break ATS parsing. Use a single-column layout with clear section headers. Yes, it might look "boring" to you — but ATS systems love it.</p>

<h3>2. Use Standard Section Headers</h3>
<p>The ATS expects specific section names. Use: <strong>Experience, Education, Skills, Summary, Certifications.</strong> Don't get creative with "My Journey" or "What I Bring to the Table."</p>

<h3>3. Include Keywords from the Job Description</h3>
<p>This is the single most important thing you can do. Read the job posting carefully and mirror the exact language they use. If they say "project management," don't write "project coordination." If they list "Python," include "Python" — not just "programming."</p>

<h3>4. Match Both Acronyms and Full Terms</h3>
<p>Write "Search Engine Optimization (SEO)" not just "SEO." Some ATS systems only recognize the full term, others only the acronym. Include both to be safe.</p>

<h3>5. Use Standard Fonts</h3>
<p>Stick with Arial, Calibri, Helvetica, Times New Roman, or Georgia. Custom or decorative fonts may not render properly in ATS systems.</p>

<h3>6. Save as .docx or Simple PDF</h3>
<p>Most ATS systems handle .docx best. If you submit a PDF, ensure it's text-based (you can select and copy text) — not a scanned image.</p>

<h3>7. Put Contact Info in the Body, Not the Header</h3>
<p>Many ATS systems can't read content in document headers or footers. Put your name, email, phone, and LinkedIn URL in the main body at the top of the document.</p>

<h3>8. Quantify Your Achievements</h3>
<p>Numbers stand out to both ATS systems and human recruiters. "Increased revenue by 40%" is far stronger than "Responsible for increasing revenue." Use specific numbers, percentages, and dollar amounts wherever possible.</p>

<h3>9. Don't Keyword Stuff</h3>
<p>Some people try to game the system by hiding keywords in white text or repeating terms excessively. Modern ATS systems detect this, and it will get your resume flagged or rejected outright.</p>

<h3>10. Customize for Every Job</h3>
<p>This is the most important rule. <strong>Every job posting uses different keywords, even for the same role.</strong> A "Software Engineer" at Google requires different keywords than at a startup. Sending the same resume everywhere is why most people don't get interviews.</p>

<p>This is exactly why <a href="/features">Rejectly.pro</a> exists — our AI creates a unique, optimized resume for every job you apply to, matching the exact keywords and requirements each position demands.</p>

<h2>How to Check Your ATS Score</h2>

<p>Before you submit your resume anywhere, check how it performs against real ATS systems. Here's how:</p>

<ol>
<li><strong>Upload your resume</strong> to a free ATS checker like <a href="/ats-check">Rejectly's ATS Score Checker</a></li>
<li><strong>Review your score</strong> — aim for 80+ out of 100</li>
<li><strong>Fix the issues</strong> — formatting, missing keywords, structure problems</li>
<li><strong>Re-check</strong> until your score is in the green zone</li>
</ol>

<p>A score of 80+ means your resume will pass most ATS filters. Below 60, and you're getting automatically rejected — regardless of how qualified you are.</p>

<h2>Common ATS Myths (Debunked)</h2>

<h3>Myth: "PDF resumes always get rejected by ATS"</h3>
<p><strong>Reality:</strong> Modern ATS systems handle text-based PDFs just fine. The issue is with scanned/image PDFs that contain no extractable text.</p>

<h3>Myth: "ATS only looks for exact keyword matches"</h3>
<p><strong>Reality:</strong> Modern systems like Greenhouse and Lever understand synonyms. But using the exact terms from the job posting is still your safest bet.</p>

<h3>Myth: "A beautiful resume design will impress recruiters"</h3>
<p><strong>Reality:</strong> If your beautiful resume can't pass ATS parsing, no recruiter will ever see it. Substance over style — always.</p>

<h3>Myth: "I only need one version of my resume"</h3>
<p><strong>Reality:</strong> This is the biggest myth in job searching. Every job posting has unique requirements. Using the same resume for 50 applications is like wearing the same outfit to every type of event — sometimes you'll fit in, but usually you won't.</p>

<h2>The Bottom Line</h2>

<p>Beating ATS isn't about tricks or hacks. It's about understanding what these systems need and giving it to them:</p>

<ul>
<li><strong>Clean, simple formatting</strong> that any parser can read</li>
<li><strong>Relevant keywords</strong> that match the specific job description</li>
<li><strong>A customized resume</strong> for every application</li>
</ul>

<p>The job seekers who understand this land interviews. The ones who don't, wonder why their phone never rings.</p>

<p><strong>Ready to check your resume's ATS score?</strong> <a href="/ats-check">Try our free ATS checker</a> — no signup required. Or let our AI <a href="/signup">build you a job-specific resume</a> that's guaranteed to pass.</p>`,
};

// ─── Blog Post 2: Resume Keywords by Industry ────────────────────────────────

const post2 = {
  title: '50+ Resume Keywords That Get You Past ATS (By Industry)',
  slug: 'resume-keywords-by-industry-ats',
  excerpt: 'The exact keywords Applicant Tracking Systems scan for in Software Engineering, Marketing, Finance, Healthcare, and more. Copy-paste ready lists with context on how to use them.',
  featured_image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1200&h=630&fit=crop',
  featured_image_alt: 'Resume keyword optimization for ATS systems',
  category_id: CATEGORIES.ATS_OPTIMIZATION,
  author_name: 'Rejectly Team',
  is_published: true,
  published_at: new Date().toISOString(),
  reading_time_minutes: 10,
  meta_title: '50+ Resume Keywords That Pass ATS (By Industry) | 2025 Guide',
  meta_description: 'Complete list of ATS resume keywords for Software Engineering, Marketing, Finance, Healthcare, Sales, and more. Learn which keywords ATS systems scan for and how to use them.',
  meta_keywords: ['resume keywords', 'ats resume keywords', 'resume keywords for ats', 'ats keywords by industry', 'resume power words', 'keywords for resume', 'ats friendly keywords'],
  content: `
<h2>Why Resume Keywords Matter More Than You Think</h2>

<p>When you submit your resume online, an <strong>Applicant Tracking System (ATS)</strong> scans it for specific keywords before any human sees it. If your resume doesn't contain the right terms, it gets filtered out — no matter how qualified you are.</p>

<p>But here's what most job seekers get wrong: <strong>keywords aren't universal.</strong> A "Software Engineer" resume needs completely different keywords than a "Marketing Manager" resume. Even two Software Engineer postings at different companies might prioritize different terms.</p>

<p>Below, we've compiled the most impactful keywords by industry — the terms that ATS systems actually scan for and weight heavily in scoring.</p>

<h2>How to Use These Keywords (The Right Way)</h2>

<p>Before we dive into the lists, here are three rules for keyword usage:</p>

<ol>
<li><strong>Context matters.</strong> Don't just list keywords — weave them into your achievement bullets. "Managed a $2M Google Ads budget with 300% ROAS" is infinitely better than "Google Ads, budget management, ROAS."</li>
<li><strong>Match the job posting.</strong> Always check the specific language in the job description. If they say "stakeholder management" and you write "stakeholder relations," the ATS might not make the connection.</li>
<li><strong>Include both acronyms and full terms.</strong> Write "Search Engine Optimization (SEO)" so you match both variations.</li>
</ol>

<h2>Software Engineering Keywords</h2>

<p>Tech resumes need a balance of <strong>programming languages, frameworks, methodologies, and impact metrics.</strong></p>

<h3>Must-Have Technical Keywords</h3>
<ul>
<li><strong>Languages:</strong> JavaScript, TypeScript, Python, Java, Go, Rust, C++, SQL</li>
<li><strong>Frontend:</strong> React, Angular, Vue.js, Next.js, HTML5, CSS3, Tailwind CSS</li>
<li><strong>Backend:</strong> Node.js, Express, Django, Spring Boot, FastAPI, GraphQL, REST API</li>
<li><strong>Cloud & DevOps:</strong> AWS, Azure, GCP, Docker, Kubernetes, CI/CD, Terraform, Jenkins</li>
<li><strong>Data:</strong> PostgreSQL, MongoDB, Redis, Elasticsearch, Apache Kafka</li>
</ul>

<h3>High-Impact Action Keywords</h3>
<ul>
<li>Architected, Implemented, Optimized, Scaled, Refactored</li>
<li>Reduced latency by X%, Improved throughput by X%, Decreased error rate by X%</li>
<li>System design, Code review, Technical leadership, Mentored X engineers</li>
</ul>

<h3>Example Bullet Point</h3>
<p><em>"Architected a microservices backend using Node.js and PostgreSQL, reducing API latency by 40% and supporting 10K concurrent users on AWS ECS."</em></p>

<h2>Marketing & Digital Marketing Keywords</h2>

<p>Marketing resumes need to show both <strong>strategic thinking and tactical execution</strong> with measurable outcomes.</p>

<h3>Must-Have Keywords</h3>
<ul>
<li><strong>Strategy:</strong> Content Strategy, Brand Management, Go-to-Market (GTM), Marketing Automation</li>
<li><strong>Digital:</strong> SEO/SEM, Google Ads, Facebook Ads, PPC, Social Media Marketing</li>
<li><strong>Analytics:</strong> Google Analytics (GA4), HubSpot, Marketo, Salesforce Marketing Cloud</li>
<li><strong>Content:</strong> Content Marketing, Email Marketing, CRM, Lead Generation, Conversion Rate Optimization (CRO)</li>
<li><strong>Metrics:</strong> ROAS, CAC, LTV, CTR, Engagement Rate, Marketing Qualified Leads (MQLs)</li>
</ul>

<h3>Example Bullet Point</h3>
<p><em>"Developed and executed a content marketing strategy that generated 5,000 MQLs monthly, achieving a 300% ROAS on a $50K quarterly Google Ads budget."</em></p>

<h2>Finance & Accounting Keywords</h2>

<p>Finance resumes are heavily weighted toward <strong>certifications, compliance knowledge, and software proficiency.</strong></p>

<h3>Must-Have Keywords</h3>
<ul>
<li><strong>Certifications:</strong> CPA, CFA, CMA, ACCA, Series 7, Series 63</li>
<li><strong>Standards:</strong> GAAP, IFRS, SOX Compliance, SEC Reporting</li>
<li><strong>Software:</strong> SAP, Oracle, NetSuite, QuickBooks, Bloomberg Terminal, Advanced Excel</li>
<li><strong>Skills:</strong> Financial Modeling, Variance Analysis, Budgeting & Forecasting, Tax Preparation, Audit</li>
<li><strong>Metrics:</strong> P&L Management, Revenue Recognition, Cash Flow Analysis, Accounts Payable/Receivable</li>
</ul>

<h3>Example Bullet Point</h3>
<p><em>"Managed month-end close for 12 entities ($50M combined revenue), reducing close cycle from 10 days to 5 days through process automation in SAP FI/CO."</em></p>

<h2>Healthcare & Nursing Keywords</h2>

<p>Healthcare ATS systems are unique — they heavily filter for <strong>certifications, clinical specializations, and EMR systems.</strong></p>

<h3>Must-Have Keywords</h3>
<ul>
<li><strong>Certifications:</strong> RN, BSN, MSN, NP, BLS, ACLS, PALS, CCRN</li>
<li><strong>EMR Systems:</strong> Epic, Cerner, Meditech, Allscripts — list the specific system you've used</li>
<li><strong>Clinical:</strong> Patient Assessment, Care Planning, Medication Administration, IV Therapy, Wound Care</li>
<li><strong>Specializations:</strong> ICU, ER, OR, Med-Surg, Pediatrics, Oncology, Telemetry</li>
<li><strong>Compliance:</strong> HIPAA, Joint Commission, Evidence-Based Practice, Quality Improvement</li>
</ul>

<h3>Example Bullet Point</h3>
<p><em>"Provided direct patient care in a 40-bed ICU at a Level I Trauma Center (1:2 ratio), managing ventilator patients and continuous drips while maintaining 98% medication accuracy score in Epic EMR."</em></p>

<h2>Sales & Business Development Keywords</h2>

<p>Sales resumes live and die by <strong>numbers, CRM tools, and methodology terms.</strong></p>

<h3>Must-Have Keywords</h3>
<ul>
<li><strong>CRM:</strong> Salesforce, HubSpot, Pipedrive, Zoho CRM</li>
<li><strong>Methodology:</strong> MEDDIC, SPIN Selling, Challenger Sale, Solution Selling, Consultative Selling</li>
<li><strong>Metrics:</strong> Quota Attainment, Pipeline Management, Revenue Growth, Deal Size, Win Rate</li>
<li><strong>Activities:</strong> Lead Generation, Cold Calling, Account Management, Contract Negotiation, Upselling</li>
<li><strong>Types:</strong> B2B, B2C, Enterprise, SMB, SaaS, Inside Sales, Field Sales</li>
</ul>

<h3>Example Bullet Point</h3>
<p><em>"Consistently achieved 130%+ of $1.5M annual quota, closing 40+ enterprise SaaS deals ($50K-$300K ACV) through MEDDIC-based consultative selling in Salesforce-managed pipeline."</em></p>

<h2>Project Management Keywords</h2>

<h3>Must-Have Keywords</h3>
<ul>
<li><strong>Certifications:</strong> PMP, CSM, SAFe, PRINCE2, Lean Six Sigma</li>
<li><strong>Methodologies:</strong> Agile, Scrum, Kanban, Waterfall, Hybrid</li>
<li><strong>Tools:</strong> JIRA, Asana, Monday.com, MS Project, Confluence, Smartsheet</li>
<li><strong>Skills:</strong> Risk Management, Stakeholder Management, Resource Planning, Budget Management, Change Management</li>
<li><strong>Metrics:</strong> On-time delivery, Under-budget completion, Team size, Project value</li>
</ul>

<h3>Example Bullet Point</h3>
<p><em>"Delivered a $3.2M digital transformation project 3 weeks ahead of schedule, managing a 15-person cross-functional team using Agile/Scrum methodology in JIRA."</em></p>

<h2>Human Resources Keywords</h2>

<h3>Must-Have Keywords</h3>
<ul>
<li><strong>HRIS:</strong> Workday, BambooHR, ADP, SAP SuccessFactors, UKG</li>
<li><strong>Functions:</strong> Talent Acquisition, Employee Relations, Performance Management, Succession Planning</li>
<li><strong>Compliance:</strong> FMLA, ADA, EEOC, FLSA, I-9 Verification, OFCCP</li>
<li><strong>Strategy:</strong> Employer Branding, Compensation & Benefits, Organizational Development, D&I Initiatives</li>
<li><strong>Metrics:</strong> Time-to-Fill, Turnover Rate, Employee Engagement Score, Cost-per-Hire</li>
</ul>

<h2>Universal Power Keywords (Every Resume Needs These)</h2>

<p>Regardless of your industry, these action verbs and phrases get ATS attention:</p>

<h3>Leadership</h3>
<p>Led, Directed, Managed, Supervised, Mentored, Coordinated, Spearheaded</p>

<h3>Achievement</h3>
<p>Achieved, Exceeded, Surpassed, Delivered, Accomplished, Generated, Increased</p>

<h3>Innovation</h3>
<p>Developed, Created, Designed, Implemented, Launched, Pioneered, Introduced</p>

<h3>Efficiency</h3>
<p>Streamlined, Optimized, Reduced, Automated, Consolidated, Improved, Accelerated</p>

<h2>The Secret Most People Miss</h2>

<p>Here's the truth nobody tells you about resume keywords: <strong>the best keywords aren't from a generic list — they're from the specific job posting you're applying to.</strong></p>

<p>Every company writes their job descriptions differently. One might say "stakeholder management" while another says "stakeholder engagement." One might want "Python" while another wants "Python 3.x." The keywords that matter are the ones in the actual posting.</p>

<p>This is exactly the problem <a href="/features">Rejectly.pro</a> solves. Our Job Match Analysis reads the specific job description you're applying to, identifies every keyword and requirement, and rewrites your resume to match — creating a unique, optimized version for every single application.</p>

<p><strong>Want to see which keywords you're missing?</strong> <a href="/ats-check">Check your resume's ATS score for free</a> and get a detailed keyword gap analysis. Or <a href="/signup">start building a job-specific resume</a> that includes the exact keywords each role demands.</p>`,
};

// ─── Push Function ───────────────────────────────────────────────────────────

async function pushPost(post, tagIds) {
  console.log(`\n📝 Pushing: "${post.title}"...`);

  // Insert the blog post
  const response = await fetch(`${SUPABASE_URL}/rest/v1/blog_posts`, {
    method: 'POST',
    headers,
    body: JSON.stringify(post),
  });

  if (!response.ok) {
    const error = await response.text();
    console.error(`❌ Failed to insert post: ${error}`);
    return;
  }

  const [insertedPost] = await response.json();
  console.log(`✅ Post inserted with ID: ${insertedPost.id}`);

  // Link tags
  for (const tagId of tagIds) {
    const tagResponse = await fetch(`${SUPABASE_URL}/rest/v1/blog_post_tags`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        post_id: insertedPost.id,
        tag_id: tagId,
      }),
    });

    if (!tagResponse.ok) {
      const error = await tagResponse.text();
      console.error(`⚠️ Failed to link tag ${tagId}: ${error}`);
    } else {
      console.log(`  🏷️  Tag linked: ${tagId}`);
    }
  }

  return insertedPost;
}

// ─── Main ────────────────────────────────────────────────────────────────────

async function main() {
  console.log('🚀 Pushing SEO blog posts to Supabase...\n');

  // Post 1: How to Beat ATS (tags: ATS, Resume, Job Search)
  await pushPost(post1, [TAGS.ATS, TAGS.RESUME, TAGS.JOB_SEARCH]);

  // Post 2: Resume Keywords (tags: ATS, Resume)
  await pushPost(post2, [TAGS.ATS, TAGS.RESUME]);

  console.log('\n✨ Done! Both posts are now live on the blog.');
  console.log('📍 Visit: http://localhost:3000/blog to see them.');
}

main().catch(console.error);
