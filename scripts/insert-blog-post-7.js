const { createClient } = require("@supabase/supabase-js");

const supabase = createClient(
  "https://mxnytawzqzrounbomqxf.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im14bnl0YXd6cXpyb3VuYm9tcXhmIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MDYyMTk5OCwiZXhwIjoyMDc2MTk3OTk4fQ.sWdGWliNVxZzQ9dqTMdxh19JKdzeqagavs5791GmgRo"
);

async function insertBlogPost() {
  const { data, error } = await supabase.from("blog_posts").insert({
    title: "How Job Descriptions Are Written (And How to Reverse-Engineer Them)",
    slug: "how-to-reverse-engineer-job-descriptions",
    excerpt:
      "Job descriptions aren't neutral documents. They're written by specific people, under specific pressures, using specific shortcuts — and once you understand the process, you can extract information most applicants completely miss.",
    content: `<h2>The Document Nobody Tells You How to Read</h2>

<p>Most people read job descriptions the way they read terms and conditions — skimming for the parts that seem relevant, treating the rest as filler. That approach costs them more than they realize. A job description isn't just a list of requirements. It's a document with a history, a politics, and a set of hidden signals that, once you know how to read them, tell you far more than the text itself says.</p>

<p>Understanding how these documents get made is the first step to using them properly.</p>

<h2>Who Actually Writes Job Descriptions</h2>

<h3>HR vs. the Hiring Manager</h3>

<p>In most companies, job descriptions are written by someone in HR or recruiting — not by the person who will actually be your manager. The hiring manager provides a rough brief: "we need someone who can do X, Y, and Z, ideally with experience in A and B." HR translates that into a formal posting, often by pulling from a library of existing descriptions, editing last year's version of the same role, or adapting a template.</p>

<p>This matters because the resulting document is often one step removed from what the team actually needs. Requirements get inflated in the translation. Qualifications from a previous hire get copy-pasted even when they're no longer relevant. Boilerplate language about "fast-paced environments" and "self-starters" gets added by default. By the time the posting goes live, it may represent what HR thinks the job sounds like more than what the manager actually wants.</p>

<h3>The Copy-Paste Problem</h3>

<p>A significant number of job descriptions are previous versions of the same posting with light edits, or composites of two or three postings from similar companies. When you see identical phrasing across job descriptions at different companies — word for word — you're looking at industry-template language that nobody wrote intentionally. It was copied, accepted, and published. This means the specific wording carries less meaning than you'd assume, and that you should focus your energy on what's specific and repeated, not what's generic and present everywhere.</p>

<h2>The Anatomy of a Job Description</h2>

<h3>The Job Title</h3>

<p>Job titles are often the most internally negotiated part of a posting. What gets published may differ from what the team actually calls the role, what the hire will eventually be titled, or even what the company's compensation band requires it to be called. "Senior Associate" at one company is "Manager" at another. "Growth Lead" might be a renamed "Marketing Manager" posted under a different title to attract a different candidate pool.</p>

<p>The title tells you the seniority level and the general function. Beyond that, look at how the role is described — not what it's called.</p>

<h3>Responsibilities vs. Requirements</h3>

<p>These two sections serve completely different purposes and should be read differently. Responsibilities describe what you'll actually do. Requirements describe the filter the company is using to screen. The order of the responsibilities list is almost always deliberate — whatever's listed first is what the team cares about most. If "manage a team of engineers" is the first bullet and "write technical documentation" is the eighth, the role is fundamentally a people management position, whatever the title says.</p>

<p>Requirements are where most applicants get unnecessarily discouraged. Research consistently shows that many candidates — particularly women — apply only when they meet close to 100% of listed requirements, while others apply at 60% or less. The bar in most postings is aspirational, not firm. The "five years of experience" requirement is often a placeholder that the actual hiring decision will ignore if a strong candidate with three years appears.</p>

<h3>"Nice to Have" Is a Green Light</h3>

<p>When a posting separates required qualifications from preferred ones, the preferred list is telling you exactly how to stand out — not setting a higher bar you have to clear. If you meet all the required qualifications and two or three of the preferred ones, you're a strong candidate. If you meet them all, you may be overqualified. The preferred section is the differentiation layer, and most applicants either ignore it or treat it as more required qualifications. Neither is right.</p>

<h2>Reading Between the Lines</h2>

<h3>What the Euphemisms Actually Signal</h3>

<p>Job description language has a well-established vocabulary of phrases that mean something different from what they say on the surface:</p>

<ul>
  <li><strong>"Fast-paced environment"</strong> — high workload, possibly understaffed, expect pressure</li>
  <li><strong>"Wear many hats"</strong> — the team is small and the role scope is broader than the title suggests</li>
  <li><strong>"Self-starter"</strong> — limited management support; you'll need to direct your own work</li>
  <li><strong>"Competitive salary"</strong> — they won't say the number in the posting</li>
  <li><strong>"Collaborative culture"</strong> — generic; present in almost every posting and meaningless without supporting evidence</li>
  <li><strong>"Exciting opportunity to make an impact"</strong> — the role is probably under-resourced or early-stage</li>
</ul>

<p>None of these automatically disqualify a role. But they're honest signals worth weighing before you invest significant time in an application.</p>

<h3>Requirement Inflation</h3>

<p>The longer and more specific the requirements list, the more likely it is that at least some of them were added defensively — either to filter out a high volume of applications, to match a previous hire's profile, or simply because nobody pushed back when HR added them. A posting that requires a master's degree for a role that clearly doesn't need one, or asks for seven years of experience in a technology that has only existed for four, is showing you its process more than its actual needs. Apply anyway, and address any gaps directly in your cover letter.</p>

<h2>The Reverse-Engineering Process</h2>

<h3>Extract the Real Priorities</h3>

<p>Read the posting once for comprehension, then read it again specifically to identify repetition. Any skill, tool, or responsibility mentioned more than once — in the title, in the responsibilities, and in the requirements — is a genuine priority. These are the keywords that should appear in your resume summary, your most relevant job descriptions, and your skills section. Everything else is secondary.</p>

<p>Count the words used to describe each responsibility area. More words means more importance. A single bullet about "data analysis" and four bullets about "cross-functional collaboration and stakeholder management" tells you this is primarily a relationship and influence role, not a technical one — even if the job title sounds technical.</p>

<h3>Mirror Their Language Back</h3>

<p>Once you've identified the priorities, use the posting's exact language in your resume. Not paraphrases — the specific terms they used. If they say "go-to-market strategy," don't write "product launch planning." If they say "customer lifecycle management," don't write "managing client relationships." ATS systems score exact matches higher, and human recruiters pattern-match against the posting language when they scan a resume. Speaking their dialect signals cultural fit before you've said a word.</p>

<h3>Find What They Didn't Say Out Loud</h3>

<p>The most useful intelligence about a role often isn't in the posting at all. Look up two or three people on LinkedIn who have held this role at this company previously. What does their experience look like? What did they do before joining? What did they move on to? The patterns in their profiles tell you what the role actually develops, what the company values in this function, and how to position your own background in relation to what they've hired before.</p>

<p>Also look at the posting date and history. A role that has been reposted multiple times suggests either high turnover in the position or difficulty finding the right candidate — both worth understanding before you get deep into the process.</p>

<h2>Reverse-Engineering Checklist</h2>

<ul>
  <li>Have you identified every keyword that appears more than once in the posting?</li>
  <li>Have you noted the order of the responsibilities — what's first, what's last?</li>
  <li>Have you separated required from preferred qualifications and addressed both?</li>
  <li>Have you used the posting's exact language in your resume and cover letter — not synonyms?</li>
  <li>Have you looked at 2–3 similar postings at other companies to identify what's industry-standard vs. specific to this employer?</li>
  <li>Have you checked LinkedIn for people who previously held this role to understand what the company actually values?</li>
  <li>Have you noted any euphemisms or signals about team culture that inform whether this is the right fit?</li>
  <li>Have you checked how long the posting has been live and whether it's been reposted?</li>
</ul>

<h2>How Rejectly Automates the Analysis</h2>

<p>Doing this manually for every application is time-consuming. Rejectly handles the extraction and comparison automatically: paste a job description, upload your resume, and see exactly which keywords you're matching, which are missing, and how your resume's language aligns with the posting's priorities. The gaps that would cost you an ATS match score — or that a recruiter would notice in a six-second scan — become visible before you apply.</p>

<p><a href="/dashboard">Analyze your resume against any job description →</a></p>

<h2>Conclusion</h2>

<p>A job description is a negotiated, imperfect document written under time pressure by people who may not fully understand the role they're describing. That's not a criticism — it's just how organizations work. Once you understand the process, you stop reading postings as authoritative truth and start reading them as data sources: imperfect signals about real priorities, recoverable through careful reading, cross-referencing, and a deliberate approach to how you respond to what you find.</p>

<p>The candidates who consistently get interviews aren't the most qualified. They're the ones who understood what the posting was really asking for — and made sure their application said it back.</p>`,
    featured_image:
      "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=1200&h=630&fit=crop&q=80",
    featured_image_alt: "Person reading and annotating a document at a desk",
    category_id: "8910d30e-ead4-45d8-a279-a77fc4f05c90",
    author_name: "Rejectly Team",
    is_published: true,
    published_at: new Date().toISOString(),
    reading_time_minutes: 7,
    meta_title:
      "How Job Descriptions Are Written (And How to Reverse-Engineer Them) | Rejectly",
    meta_description:
      "Job descriptions are written by HR from templates, not by the people you'll work with. Here's how to read past the boilerplate, find the real priorities, and tailor your application to what they're actually looking for.",
    meta_keywords: [
      "how to read job descriptions",
      "reverse engineer job posting",
      "job description tips",
      "how to analyze job postings",
      "job description keywords",
      "how to apply for jobs",
      "job application strategy",
      "job posting analysis",
    ],
    og_image:
      "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=1200&h=630&fit=crop&q=80",
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
