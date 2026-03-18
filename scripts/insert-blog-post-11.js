const { createClient } = require("@supabase/supabase-js");

const supabase = createClient(
  "https://mxnytawzqzrounbomqxf.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im14bnl0YXd6cXpyb3VuYm9tcXhmIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MDYyMTk5OCwiZXhwIjoyMDc2MTk3OTk4fQ.sWdGWliNVxZzQ9dqTMdxh19JKdzeqagavs5791GmgRo"
);

async function insertBlogPost() {
  const { data, error } = await supabase.from("blog_posts").insert({
    title: "Resume Sections That Matter (And What to Cut)",
    slug: "resume-sections-that-matter",
    excerpt:
      "Most resumes have too much on them. The sections that actually move the needle are fewer than people think — and several standard inclusions are actively hurting applications. Here's what to keep, what to add situationally, and what to delete entirely.",
    content: `<h2>More Isn't Better. It's Just More.</h2>

<p>The impulse behind most bloated resumes is understandable: include everything, cover every possible angle, give the recruiter as much information as possible and let them decide what matters. The problem is that recruiters don't make decisions by reading everything on a resume. They scan for specific signals in a matter of seconds, and everything that isn't a signal is friction.</p>

<p>Every section on your resume is either earning its place or diluting the sections that are. Knowing the difference — and having the discipline to cut what isn't working — is what separates a resume that reads as confident and purposeful from one that reads as padded.</p>

<h2>The Sections That Earn Their Place</h2>

<h3>Contact Information</h3>

<p>Name, professional email address, phone number, LinkedIn URL, and location (city and state is enough — no street address). That's it. Your email address should be a variation of your name at a standard domain. An address at an old university domain, a nickname-based handle, or a non-standard provider all create small, unnecessary friction. This section should take four lines and two seconds to process.</p>

<h3>Professional Summary</h3>

<p>The summary earns its place only if it says something specific. A generic summary — "results-driven professional with extensive experience in cross-functional environments seeking to leverage expertise" — is worse than no summary at all. It occupies prime real estate at the top of the page and communicates nothing. A summary that works names your function, your level, one or two specific strengths, and optionally a career highlight: "Product manager with six years in B2B SaaS, specializing in growth-stage scaling. Led three zero-to-one product launches, most recently a feature set that drove 40% increase in annual contract value." Two sentences, specific, useful.</p>

<p>If you can't write a summary that says something concrete, skip it and start with experience. A strong experience section needs no preamble.</p>

<h3>Work Experience</h3>

<p>This is the most valuable real estate on any resume, and also the most commonly wasted. The mistake most people make is writing job descriptions — listing what the role was responsible for — rather than achievement statements that show what they personally delivered. "Managed social media accounts" describes a responsibility. "Grew organic LinkedIn following from 4,200 to 31,000 in fourteen months through a weekly long-form content series" describes an outcome. One is forgettable. The other is specific enough to be credible and interesting enough to generate a conversation.</p>

<p>Each role should have three to five bullets, all in this shape: action verb, specific activity, measurable result. No bullet should describe a duty that anyone in that role would have had — every bullet should describe something you specifically did and what it produced.</p>

<h3>Skills</h3>

<p>A focused skills section of twelve to eighteen items, grouped by category, serves two purposes: it gives ATS systems a clean keyword list to parse, and it gives human readers a fast snapshot of your technical landscape. Keep it to tools and competencies that are genuinely relevant to the roles you're targeting. Remove anything you'd hesitate to be asked about in an interview, and remove anything so basic it goes without saying — listing "Microsoft Word" as a skill in 2026 actively undermines your credibility.</p>

<h3>Education</h3>

<p>Degree, institution, graduation year — that's the core. Add relevant coursework or academic honors only if you're within two years of graduation and they're directly applicable. After that, education moves toward the bottom of the resume and takes up less space. A fifteen-year career professional who dedicates six lines to their undergraduate degree is misallocating page space that their experience section should own.</p>

<h2>Sections Worth Adding in the Right Context</h2>

<h3>Projects</h3>

<p>Highly valuable for recent graduates, career changers, and anyone whose work history doesn't fully demonstrate what they can do. A projects section with two or three specific, results-oriented entries can carry more weight than an equivalent amount of job history. Include the project name or description, the technologies or methods used, and an outcome. If the project is publicly accessible — a GitHub repo, a published piece, a live product — link to it.</p>

<h3>Certifications</h3>

<p>Worth including when the certification is recognized in your industry and directly relevant to the roles you're applying for. PMP, CPA, Google Analytics, AWS certifications — these belong on the resume and often serve as knockout filters in ATS systems. Include the full name of the certification, the issuing body, and the year. Certifications completed more than five years ago that haven't been renewed are worth removing unless they're evergreen credentials in your field.</p>

<h3>Volunteer Work</h3>

<p>Relevant volunteer experience belongs on a resume when it demonstrates skills that your paid experience doesn't fully cover, when you're early in your career and need to bulk out a thin experience section, or when it demonstrates genuine engagement with a cause that's relevant to the employer. A software engineer who volunteers as a technical mentor has something worth listing. Listing volunteer work purely to signal good character, without any professionally relevant content, adds noise without signal.</p>

<h2>Sections to Cut Entirely</h2>

<h3>The Objective Statement</h3>

<p>Objective statements — "Seeking a challenging role in a dynamic organization where I can contribute my skills" — were standard practice in the 1990s. They've been replaced by the professional summary, and even the summary needs to earn its place. An objective statement tells the employer what you want from them, which is the least useful information on the page. Cut it entirely; if you want an opener, write a summary that tells them what you bring.</p>

<h3>"References Available Upon Request"</h3>

<p>This line appears on a remarkable number of resumes and contributes nothing. Every employer knows that references exist and that you'll provide them when asked. Stating it takes up a line that could go to an additional achievement bullet or simply not exist. Remove it.</p>

<h3>Hobbies and Interests</h3>

<p>This section is occasionally useful — at early career level, where hiring managers are looking for cultural and personality signals, or at startups where culture fit is explicitly part of the evaluation. When it works, it's because the interests are specific and genuinely interesting: "competitive Brazilian jiu-jitsu" or "maintaining a photography archive of abandoned industrial sites" gives the reader something to remember and a natural conversation opener. "Reading, hiking, and spending time with family" does neither. If your interests aren't specific enough to be interesting, this section shouldn't be on your resume.</p>

<h3>A Photo</h3>

<p>In the United States, United Kingdom, and Canada, photos on resumes are not just unnecessary — they're actively discouraged, because they introduce the potential for appearance-based bias and create legal exposure for employers. Many ATS systems automatically crop or discard images. In Germany and parts of the Middle East, photos remain standard. Know your target market; in most contexts, remove it.</p>

<h3>Your GPA</h3>

<p>Include your GPA only if you graduated within the last two to three years and it's above 3.5. After that threshold, it stops being a positive signal and starts being a reminder that you're leading with academic performance rather than professional output. A ten-year professional listing a 3.4 GPA from 2014 is not making a strong argument for themselves.</p>

<h2>What Order Should Your Sections Be In?</h2>

<p>For most people with meaningful work history: summary (if strong), experience, skills, education. Experience leads because it's the section with the most information value for mid-career and senior professionals.</p>

<p>For recent graduates or career changers where education or projects are your strongest credentials: summary, education or projects, experience, skills. Lead with what's strongest — which isn't always chronological work history.</p>

<p>ATS systems generally weight experience and skills sections most heavily in keyword scoring. Whatever order you choose for human readability, make sure those two sections are substantive and keyword-rich.</p>

<h2>Resume Sections Checklist</h2>

<ul>
  <li>Is your contact information clean — name, email, phone, LinkedIn, city only?</li>
  <li>If you have a summary, does it say something specific — function, level, one concrete highlight?</li>
  <li>Are your experience bullets achievement-oriented, not responsibility-oriented?</li>
  <li>Is your skills section 12–18 items you'd genuinely defend in an interview?</li>
  <li>Does your education section take up proportionally more space than its current relevance warrants?</li>
  <li>Have you removed "References available upon request"?</li>
  <li>Have you removed or replaced the objective statement with a specific summary?</li>
  <li>If you have a hobbies section, are the interests specific enough to be interesting — or is it generic filler?</li>
  <li>Have you removed your GPA if you graduated more than three years ago?</li>
  <li>Is every section on the page earning its place, or are some sections there by default?</li>
</ul>

<h2>How Rejectly Reviews Your Resume Structure</h2>

<p>Knowing which sections to include is one part of the problem. Knowing whether the content within those sections is working — whether your experience bullets are achievement-oriented, whether your skills section is keyword-matched to the role, whether your summary is specific enough to be useful — is harder to assess from inside your own document.</p>

<p>Rejectly analyzes your resume's structure and content against the job description you're targeting, identifying where sections are underperforming and what specific changes would increase your match score and readability.</p>

<p><a href="/dashboard">See how your resume structure scores →</a></p>

<h2>Conclusion</h2>

<p>A resume that works isn't the longest or the most comprehensive. It's the one where every section is doing something useful — where the experience bullets describe outcomes, the skills section reflects genuine competency, and the filler that accumulated over years of following outdated advice has been cleared away. Less, in this context, is genuinely more: a tighter document reads as more confident, is easier to scan, and gives the recruiter exactly what they're looking for without making them excavate through sections that shouldn't be there.</p>`,
    featured_image:
      "https://images.unsplash.com/photo-1586281380117-5a60ae2050cc?w=1200&h=630&fit=crop&q=80",
    featured_image_alt: "Clean desk with a notebook and pen, minimal setup",
    category_id: "9706e75f-58ea-4aad-91ce-4d0accae36e0",
    author_name: "Rejectly Team",
    is_published: true,
    published_at: new Date().toISOString(),
    reading_time_minutes: 7,
    meta_title: "Resume Sections That Matter (And What to Cut) | Rejectly",
    meta_description:
      "Most resumes have too much on them. Here's exactly which sections earn their place, which to add only in the right context, and which to delete entirely — including several you probably still have.",
    meta_keywords: [
      "resume sections",
      "what to include on a resume",
      "resume sections to remove",
      "resume tips",
      "resume structure",
      "what not to put on resume",
      "resume sections guide",
      "resume writing tips",
    ],
    og_image:
      "https://images.unsplash.com/photo-1586281380117-5a60ae2050cc?w=1200&h=630&fit=crop&q=80",
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
