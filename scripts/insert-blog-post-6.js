const { createClient } = require("@supabase/supabase-js");

const supabase = createClient(
  "https://mxnytawzqzrounbomqxf.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im14bnl0YXd6cXpyb3VuYm9tcXhmIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MDYyMTk5OCwiZXhwIjoyMDc2MTk3OTk4fQ.sWdGWliNVxZzQ9dqTMdxh19JKdzeqagavs5791GmgRo"
);

async function insertBlogPost() {
  const { data, error } = await supabase.from("blog_posts").insert({
    title: "Inside the ATS: What Happens to Your Resume the Second You Hit Apply",
    slug: "how-ats-parses-your-resume",
    excerpt:
      "Most people treat ATS as a mysterious black box. It isn't. Here's exactly what happens to your resume — file parsing, data extraction, keyword scoring, ranking — and where the process quietly breaks for most applicants.",
    content: `<h2>You Hit Apply. Now What?</h2>

<p>Your resume disappears into a portal and you wait. What's actually happening on the other side of that button is a multi-step automated process that happens in seconds — and that process determines whether a recruiter ever sees your name.</p>

<p>Applicant Tracking Systems are used by <strong>98% of Fortune 500 companies</strong> and the majority of mid-sized employers. The most common platforms — Workday, Greenhouse, Lever, iCIMS, Taleo — each have slightly different parsing engines, but they all follow roughly the same pipeline. Understanding that pipeline is the difference between a resume that clears the filter and one that doesn't.</p>

<h2>Step 1 — File Parsing: The Format Problem</h2>

<p>Before any content is read, the ATS has to extract text from your file. This is where a surprising number of resumes fail silently — not because of what they say, but because of how they're built.</p>

<h3>What ATS Can and Can't Read</h3>

<p>A plain .docx file is the most universally parseable format. The text is structured, the reading order is unambiguous, and virtually every ATS handles it correctly. Clean, text-based PDFs work well too — when the file was created digitally (exported from Word or Google Docs), the text layer is intact and readable.</p>

<p>The problems start with design-heavy formats. Multi-column layouts look clean to a human eye, but most ATS parsers read documents linearly — left to right, top to bottom — treating the entire page as a single text stream. A two-column resume where your job title is on the left and your dates are on the right often gets read as a scrambled string of text with no coherent structure. Tables and text boxes are frequently skipped entirely. Graphics, icons, and skill bars register as nothing — just whitespace in the extracted text.</p>

<h3>The Scanned PDF Problem</h3>

<p>A scanned PDF — a physical document photographed or photocopied and saved as a PDF — is essentially an image file. There's no text layer to extract. Some ATS systems run OCR (optical character recognition) on these, but the results are inconsistent and error-prone. If your resume was designed in Canva, exported as an image-heavy PDF, or passed through a scanner at any point, the parsed version may be unrecognizable. When in doubt: export as .docx, or generate a clean PDF from a text-based source.</p>

<h2>Step 2 — Data Extraction: Sections and Fields</h2>

<p>Once text is extracted, the ATS tries to sort it into structured fields: name, contact information, work experience, education, skills. This is where resume formatting choices have outsized consequences.</p>

<h3>How ATS Systems Identify Sections</h3>

<p>Section detection relies on header recognition. The parser looks for known keywords — "Experience," "Work History," "Education," "Skills," "Certifications" — and uses them as anchors to categorize everything that follows. Standard headers work reliably. Creative alternatives often don't.</p>

<p>"Where I've Been" instead of "Experience." "My Toolkit" instead of "Skills." "Academic Background" where most parsers expect "Education." These feel distinctive and human in person. In a parser, they frequently cause the content beneath them to be miscategorized or dropped into an unstructured overflow field that recruiters rarely see.</p>

<h3>What Gets Lost</h3>

<p>Text in document headers and footers — a common place to put contact information or page numbers — is often ignored entirely. Information inside tables gets extracted in reading order, which may bear no resemblance to the visual layout. Bullet points using special characters or custom symbols sometimes parse as garbled text instead of clean list items. None of this is visible in your PDF preview. It only surfaces when a recruiter looks at what the ATS actually captured — which is sometimes a garbled shell of what you submitted.</p>

<h2>Step 3 — Keyword Matching and Scoring</h2>

<p>After extraction, the ATS compares your parsed content to the job description and generates a relevance score. This is the step most people have heard of — but the mechanics matter more than the general concept.</p>

<h3>Exact Match vs. Semantic Match</h3>

<p>Older systems — Taleo, legacy iCIMS configurations — rely heavily on exact keyword matching. "Project management" and "managing projects" are different strings; only one might score. This is why mirroring the job description's exact language has always been the standard advice, and why it still holds.</p>

<p>More modern platforms, particularly Greenhouse and newer Workday configurations, use natural language processing that understands semantic similarity. "Led cross-functional initiatives" and "managed interdepartmental projects" would score similarly. But exact matches still outperform near-matches in every system — NLP reduces the penalty for synonyms, it doesn't eliminate the advantage of precision.</p>

<h3>How Scores Are Calculated</h3>

<p>Most systems weight keywords by their prominence in the job description. A skill mentioned once in a list of preferred qualifications matters less than one repeated in the responsibilities section, the required qualifications, and the job title itself. The placement on your resume also matters: keywords in your summary and job titles carry more weight than identical terms buried in a bullet point halfway down the page.</p>

<p>Some systems go beyond keywords. They flag employment gaps above a certain threshold, calculate tenure averages, cross-reference job title progression, and even check whether your listed employers appear in their database of known companies. These secondary signals influence how your profile surfaces to recruiters, separate from the keyword score.</p>

<h2>Step 4 — Ranking and the Threshold Problem</h2>

<p>Scored resumes get ranked. Recruiters typically set a minimum score threshold — often without fully understanding how that number was generated — and only open files above it. In a competitive posting that receives 400 applications, a recruiter might only review the top 40. If your score is 61 and the cutoff is 65, the content of your resume is irrelevant. It wasn't seen.</p>

<p>This is why incremental optimization matters more than most people expect. The difference between a resume that clears the filter and one that doesn't is often a handful of missing keywords, a section header that didn't parse, or a skill buried in a format the system couldn't read.</p>

<h2>The Most Common Ways Resumes Fail ATS Parsing</h2>

<h3>Formatting Failures</h3>

<ul>
  <li><strong>Two-column layouts</strong> — parsed in reading order, producing scrambled text</li>
  <li><strong>Text boxes and tables</strong> — frequently skipped or extracted out of sequence</li>
  <li><strong>Contact info in the document header</strong> — often not captured</li>
  <li><strong>Graphics, icons, and skill bar charts</strong> — invisible to parsers</li>
  <li><strong>Unusual fonts or special characters</strong> — can produce garbled extraction</li>
  <li><strong>Creative section names</strong> — break category detection</li>
  <li><strong>Scanned or image-based PDFs</strong> — may have no readable text layer at all</li>
</ul>

<h3>Keyword Failures</h3>

<ul>
  <li><strong>Using synonyms instead of the job description's exact language</strong> — loses exact-match weight</li>
  <li><strong>Listing acronyms without spelling them out</strong> — "PMP" without "Project Management Professional" misses one search pattern</li>
  <li><strong>Burying skills in low-weight sections</strong> — skills mentioned only in a footer or afterthought section score less</li>
  <li><strong>Sending the same resume to every job</strong> — keyword priorities differ significantly between postings</li>
  <li><strong>Missing required qualifications entirely</strong> — some ATS use knockout filters: if the required keyword isn't present, the application is auto-rejected before scoring</li>
</ul>

<h2>Is Your Resume ATS-Ready? A Checklist</h2>

<ul>
  <li>Is your file a .docx or clean, text-based PDF — not a scanned image or Canva export?</li>
  <li>Is your layout single-column with no tables or text boxes?</li>
  <li>Are your section headers standard — Experience, Education, Skills, not creative alternatives?</li>
  <li>Is your contact information in the body of the document, not the header or footer?</li>
  <li>Have you identified the most-repeated keywords in the job description and used them verbatim?</li>
  <li>Have you written out both the full term and acronym for certifications and technical tools?</li>
  <li>Are your most important keywords placed in your summary and job title descriptions — not just a skills list?</li>
  <li>Have you tailored this version of your resume specifically to this posting?</li>
</ul>

<h2>How Rejectly Reads Your Resume the Way an ATS Does</h2>

<p>The problem with manually checking all of this is that you can't see your own parsing errors — they're invisible in the PDF you're looking at. Rejectly analyzes your resume the same way an ATS does: extracting text, identifying what was captured and what wasn't, comparing your content to the target job description, and showing you exactly where your match score breaks down.</p>

<p>You see the gaps before the ATS does. Which keywords are missing, which sections may have parsed incorrectly, and what specific changes would push your score past the threshold that gets your resume in front of a recruiter.</p>

<p><a href="/dashboard">Check how your resume parses →</a></p>

<h2>Conclusion</h2>

<p>An ATS isn't making judgments about you. It's running a structured extraction and matching process that has known failure modes — and most of those failure modes are avoidable once you know what they are. Clean formatting, standard section headers, exact keyword matching, and a tailored version for each application. That's the checklist. The candidates who clear the filter consistently aren't doing anything extraordinary. They're just not making the preventable mistakes that knock most resumes out before a human ever opens them.</p>`,
    featured_image:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&h=630&fit=crop&q=80",
    featured_image_alt: "Data dashboard with charts and filtering interface",
    category_id: "c7a0dd47-797e-4ee2-9564-18fbdfa672a9",
    author_name: "Rejectly Team",
    is_published: true,
    published_at: new Date().toISOString(),
    reading_time_minutes: 7,
    meta_title:
      "Inside the ATS: What Happens to Your Resume the Second You Hit Apply | Rejectly",
    meta_description:
      "A step-by-step breakdown of how Applicant Tracking Systems parse, score, and rank your resume — and exactly where most resumes fail before a human ever sees them.",
    meta_keywords: [
      "how ats parses resume",
      "ats resume parsing",
      "applicant tracking system explained",
      "ats resume tips",
      "how ats works",
      "ats resume format",
      "ats keyword scoring",
      "resume ats check",
    ],
    og_image:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&h=630&fit=crop&q=80",
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
