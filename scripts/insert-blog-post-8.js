const { createClient } = require("@supabase/supabase-js");

const supabase = createClient(
  "https://mxnytawzqzrounbomqxf.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im14bnl0YXd6cXpyb3VuYm9tcXhmIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MDYyMTk5OCwiZXhwIjoyMDc2MTk3OTk4fQ.sWdGWliNVxZzQ9dqTMdxh19JKdzeqagavs5791GmgRo"
);

async function insertBlogPost() {
  const { data, error } = await supabase.from("blog_posts").insert({
    title: "Resume Keyword Stuffing vs. Smart Optimization (What Actually Works?)",
    slug: "resume-keyword-stuffing-vs-optimization",
    excerpt:
      "Cramming your resume with keywords feels logical — more matches, higher score, better odds. The reality is more nuanced, and getting it wrong in either direction costs you interviews.",
    content: `<h2>The Logic That Gets People Into Trouble</h2>

<p>If ATS systems score resumes based on keyword matching, the obvious move is to include as many keywords as possible. Repeat the important ones. Cover every variation. Give the algorithm what it's looking for.</p>

<p>It makes sense on paper. In practice, it backfires in multiple ways — some immediately, some later in the process. The candidates who consistently get through aren't the ones who stuffed the most keywords. They're the ones who made the right keywords land in the right places. That's a meaningfully different approach.</p>

<h2>What Keyword Stuffing Actually Looks Like</h2>

<h3>The Obvious Kind</h3>

<p>A skills section listing 45 tools. "Python" appearing eleven times across a one-page resume. A summary that reads like a keyword list with connector words wedged between them: "Results-driven professional with expertise in project management, agile methodology, stakeholder communication, cross-functional collaboration, strategic planning, and data-driven decision making." Each of those phrases might be relevant. Stacked together with nothing supporting them, they say nothing at all.</p>

<p>This pattern is immediately recognizable to any recruiter who has read more than a hundred resumes — which is to say, all of them. It reads as someone who gamed a checklist rather than someone who did actual work.</p>

<h3>The Less Obvious Kind</h3>

<p>More sophisticated stuffing attempts try to stay invisible. Hiding keywords in white text on a white background — so ATS reads them but humans can't see them — was a popular tactic for a while. Modern ATS platforms flag this automatically, and it's grounds for immediate disqualification at most companies. Some systems check for text color mismatches as a standard filter.</p>

<p>Burying a long keyword list in the document footer, or adding a hidden "ATS optimization" section in tiny or invisible text, falls into the same category. These approaches treat ATS as a dumb pattern-matcher. They haven't been dumb pattern-matchers for several years.</p>

<h2>Why It Doesn't Work Anymore</h2>

<h3>Modern ATS Use Semantic Analysis</h3>

<p>Enterprise ATS platforms — Workday, Greenhouse, Lever — don't just count keyword instances. They use techniques like TF-IDF (term frequency–inverse document frequency) and NLP-based semantic matching that can detect when a term appears at an unnaturally high frequency relative to the document's overall content. Repetition that would boost a score in a naive keyword counter often depresses it in a semantic scorer, because it signals incoherence rather than expertise.</p>

<p>Context also matters to these systems. "Managed Salesforce implementation across three business units" signals real usage. "Salesforce" repeated in a list eight times signals a list. The former scores better in any system sophisticated enough to parse sentence structure — which most enterprise-grade ATS now are.</p>

<h3>Human Reviewers Catch What ATS Misses</h3>

<p>The goal of clearing the ATS filter is to get your resume in front of a human. If your resume cleared the filter through stuffing, the human reviewer is your next hurdle — and they're significantly harder to fool. Recruiters develop pattern recognition fast. A resume whose skills section contains forty tools, or whose bullet points feel like keyword containers rather than descriptions of real work, gets flagged mentally in seconds. You cleared one filter and failed the next.</p>

<h2>What Smart Optimization Actually Looks Like</h2>

<h3>One Keyword, Three Places</h3>

<p>The effective approach isn't to repeat a keyword as many times as possible — it's to place it strategically in the three sections that carry the most weight: your summary, your most relevant work experience bullet, and your skills section. Once in each. That's enough for any ATS to register it as a genuine competency, and it reads naturally to a human because the keyword appears in context each time.</p>

<p>"Stakeholder management" in your summary establishes it as a core strength. "Managed quarterly reporting to C-suite and board stakeholders across four product lines" in your experience proves it with evidence. "Stakeholder Management" in your skills section confirms it as a labeled competency. Three instances, three different contexts, zero repetition that feels mechanical.</p>

<h3>Context Over Frequency</h3>

<p>A keyword embedded in a result-oriented bullet point does far more work than the same keyword in a list. "Increased pipeline conversion by 34% through redesigned lead scoring model in Salesforce" tells the ATS you used Salesforce and tells the human you used it effectively. "Salesforce" alone in a skills list tells the ATS something and tells the human nothing. Every keyword should be doing double duty: satisfying the algorithm and demonstrating actual capability to the person reading afterward.</p>

<h3>The Skills Section Done Right</h3>

<p>Skills sections aren't the problem — how they're used is. A focused skills section of twelve to eighteen genuinely relevant tools and competencies, grouped into two or three categories, reads cleanly and parses reliably. A bloated list of forty-plus entries reads as indiscriminate and makes it harder, not easier, for a recruiter to identify your actual strengths. Trim to what's genuinely relevant to the role you're applying for, and let the experience section do the heavy lifting for everything else.</p>

<h2>Finding the Right Keyword Density</h2>

<p>There's no magic percentage, but there's a useful heuristic: if you read your resume aloud and it sounds like a document rather than a person describing their work, it's probably over-optimized. Naturally written professional content lands at roughly 1–3% density for any given important term. Above that, it starts to feel mechanical. Well below it, you may be underselling a genuine competency.</p>

<p>A more practical test: take the five most important keywords from the job description and check where each one appears on your resume. If any of them don't appear at all, that's the gap to address. If any of them appear more than three times, that's the stuffing to trim. The optimization work is almost always about addition in the right places, not repetition in every place.</p>

<h2>Mistakes That Look Like Stuffing Without Being Intentional</h2>

<ul>
  <li><strong>Listing every tool you've ever touched</strong> — if you used a platform once briefly, it doesn't belong in your skills section for a role where it's central</li>
  <li><strong>Copying phrases from the job description verbatim into your summary</strong> — mirroring language is smart; reproducing entire sentences from the posting reads as lazy and sometimes as plagiarism</li>
  <li><strong>Using every variation of a keyword</strong> — "project management," "managing projects," "project manager," "PM work" — pick one, use it consistently</li>
  <li><strong>A summary that's entirely made of keyword phrases</strong> — add a specific achievement or a concrete framing to make it read as authored, not assembled</li>
</ul>

<h2>Optimization Checklist</h2>

<ul>
  <li>Have you identified the 8–12 most important keywords from the job description?</li>
  <li>Does each priority keyword appear in at least one of: summary, experience, or skills?</li>
  <li>Does any keyword appear more than three times? If so, trim the repetitions.</li>
  <li>Are your keywords embedded in context — sentences with results — rather than isolated in lists?</li>
  <li>Is your skills section 12–18 items, grouped by category, not an exhaustive inventory?</li>
  <li>Have you read your resume aloud? Does it sound like a person describing their work?</li>
  <li>Are there any hidden text tricks, white-on-white keywords, or footer keyword lists? Remove them.</li>
</ul>

<h2>How Rejectly Finds the Balance</h2>

<p>Identifying where you're under-optimized versus over-optimized manually — for every application, against every posting — is genuinely difficult. Rejectly analyzes your resume against the specific job description you're targeting and shows you both gaps: keywords that are missing entirely and keywords that appear at frequencies that may read as unnatural. The output is specific enough to act on — not just a score, but a map of what to add, what to trim, and where each change will have the most impact.</p>

<p><a href="/dashboard">See your resume's optimization breakdown →</a></p>

<h2>Conclusion</h2>

<p>Keyword optimization and keyword stuffing are opposites that can look similar at a glance. One is a disciplined process of placing the right language in the right places with enough context to be credible. The other is a volume strategy that undermines credibility with both the algorithm and the person reading after it. The first gets you interviews. The second gets you filtered out by ATS, flagged by recruiters, or both. The difference, in practice, is usually a matter of placement and context rather than the keywords themselves.</p>`,
    featured_image:
      "https://images.unsplash.com/photo-1516321497487-e288fb19713f?w=1200&h=630&fit=crop&q=80",
    featured_image_alt: "Person highlighting text in a document with a marker",
    category_id: "c7a0dd47-797e-4ee2-9564-18fbdfa672a9",
    author_name: "Rejectly Team",
    is_published: true,
    published_at: new Date().toISOString(),
    reading_time_minutes: 7,
    meta_title:
      "Resume Keyword Stuffing vs. Smart Optimization (What Actually Works?) | Rejectly",
    meta_description:
      "Keyword stuffing your resume feels logical but backfires with modern ATS — and human reviewers catch it instantly. Here's what smart optimization actually looks like, and how to find the right balance.",
    meta_keywords: [
      "resume keyword stuffing",
      "resume keyword optimization",
      "ats keyword stuffing",
      "resume optimization tips",
      "ats resume keywords",
      "keyword density resume",
      "resume ats optimization",
      "how to optimize resume keywords",
    ],
    og_image:
      "https://images.unsplash.com/photo-1516321497487-e288fb19713f?w=1200&h=630&fit=crop&q=80",
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
