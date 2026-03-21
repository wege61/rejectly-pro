const { createClient } = require("@supabase/supabase-js");

const supabase = createClient(
  "https://mxnytawzqzrounbomqxf.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im14bnl0YXd6cXpyb3VuYm9tcXhmIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MDYyMTk5OCwiZXhwIjoyMDc2MTk3OTk4fQ.sWdGWliNVxZzQ9dqTMdxh19JKdzeqagavs5791GmgRo"
);

async function updateBlogPost() {
  const { data, error } = await supabase
    .from("blog_posts")
    .update({
      reading_time_minutes: 9,
      content: `<h2>The Terms Everyone Uses Wrong</h2>

<p>Ask ten people the difference between a resume and a CV, and you'll get ten different answers. Some will say length. Some will say formality. A few will say they're essentially the same document with different names. Almost nobody will give you the full picture — and in certain situations, that gap in understanding can quietly derail an application before anyone reads a single line of your background.</p>

<p>The confusion is understandable. The terms get used interchangeably all the time: in job postings, in casual conversation, even by HR professionals who should know better. But in specific contexts, the difference matters enormously. An academic institution asking for a CV is not asking for the same document a tech startup means when it says "send us your resume." Getting this wrong signals, at best, that you didn't read carefully — and at worst, that you fundamentally misunderstand the hiring process you're trying to navigate.</p>

<p>Here's what each document actually is, when to use each one, and how to tell what a job is really asking for when the posting isn't clear.</p>

<h2>What a Resume Is (and What It Isn't)</h2>

<p>A resume is a curated, targeted document. Its entire job is to make a specific case for one specific role. Everything on it — every bullet point, every skill listed, the phrasing of your summary — is there to answer a single question: why should we hire you for this position?</p>

<p>That selectivity is the whole point. You don't include everything you've ever done. You include what's relevant, framed in language that speaks directly to what the employer needs. A resume is an argument, not a record. The moment it starts trying to be a record, it stops being an effective resume.</p>

<p>In practice, this means resumes are short. One to two pages for most people. Recruiters at large companies spend an average of six to eight seconds on an initial scan — that's not a myth, it's been measured repeatedly in eye-tracking studies. Every line has to earn its place.</p>

<p>Resumes are also living documents in a way that CVs are not. A strong resume gets adjusted — sometimes substantially — for every application. The version you send to a growth-stage startup should read differently from the one you send to a Fortune 500 company, even if your underlying experience is identical.</p>

<h2>What a CV Is (and What It Isn't)</h2>

<p>CV stands for <em>curriculum vitae</em> — Latin for "course of life." That etymology is the best guide to what a CV actually does. It's a comprehensive record of your academic and professional history. Not a curated argument: a complete account.</p>

<p>That means publications, conference presentations, research grants, teaching experience, professional affiliations, awards, editorial roles, invited talks, funded projects, and anything else that constitutes your scholarly or professional record. Nothing is left out because it's "not relevant to this application." In a CV, completeness is the standard — not relevance.</p>

<p>CVs have no page limit, and that's intentional. A newly minted PhD might have a three-page CV. A senior professor might have thirty. Both are appropriate. In academic and research contexts, length signals depth and output, not padding. A two-page CV from a senior researcher would raise more eyebrows than a twenty-page one.</p>

<h2>Key Differences, Side by Side</h2>

<h3>Length</h3>

<p>Resumes are one to two pages — full stop. Two pages is acceptable for candidates with ten or more years of directly relevant experience. For most people, one tight, well-organized page is stronger than two sparse ones. CVs are as long as they need to be and grow over the course of a career as new work is added.</p>

<h3>Content and Structure</h3>

<p>A resume typically includes a professional summary, work experience, skills, and education — in roughly that order of prominence. A CV includes all of that plus publications, conference presentations, research grants, fellowships, teaching history, professional memberships, and any other scholarly output. The structure of a CV also tends to be more standardized within fields: academic CVs in biology look broadly similar to each other; resumes for marketing roles vary much more.</p>

<h3>Tailoring</h3>

<p>This is one of the most important practical differences. A resume should be customized for every application. The language in your bullet points, the skills you choose to highlight, even the order of your sections — all of this should shift to match what each specific employer is looking for. A CV, by contrast, stays relatively stable. You add to it over time, but you don't reshape it for each opportunity. Its value comes from being a complete and accurate record, not from being strategically curated.</p>

<h3>Personal Details and Photos</h3>

<p>In the United States, UK, and Canada, resumes typically omit photos, age, marital status, and other personal information. This is a deliberate convention designed to reduce unconscious bias in screening. CVs for international academic positions sometimes include these details, depending on the country's norms — particularly in parts of Europe and the Middle East where photos are still standard. If you're applying internationally, research what's expected in that specific country before you submit anything.</p>

<h2>When to Use a Resume</h2>

<h3>Private Sector Jobs</h3>

<p>Technology, finance, marketing, operations, sales, product, design, consulting — these all call for a resume. This covers the overwhelming majority of jobs that most people are looking for. When a company posts a role on LinkedIn, Indeed, or its own careers page and says "attach your resume or CV," they almost certainly want a resume. The phrasing is just imprecise. Nobody at a SaaS company expects to receive a fifteen-page academic document.</p>

<h3>Nonprofit and Government Roles</h3>

<p>Most nonprofit and government positions below the senior research or policy level also expect resumes. There are exceptions — some federal government applications use their own standardized formats, and senior research roles at government agencies may call for a CV — but as a baseline, resume is the right choice.</p>

<h3>Startup Environments</h3>

<p>Startups are, if anything, more resume-oriented than large companies. They're moving fast, they're evaluating potential as much as history, and they have little patience for lengthy documents. A concise, well-targeted resume almost always outperforms anything longer in early-stage hiring contexts.</p>

<h2>When to Use a CV</h2>

<h3>Academic Positions</h3>

<p>Faculty positions, postdoctoral fellowships, research appointments, and academic administrative roles all require a CV. A hiring committee at a university wants to see your full publication record, every course you've taught, the grants you've received, and the conferences you've spoken at. Submitting a resume for an academic position suggests you don't understand how academic hiring works — and that perception is difficult to recover from.</p>

<h3>Medical and Clinical Roles</h3>

<p>Physicians, clinical researchers, and medical scientists applying for hospital positions, academic medical center appointments, or clinical research roles typically submit CVs. These documents need to comprehensively capture board certifications, residency and fellowship training, clinical experience, research output, and professional affiliations. A resume simply can't hold all of that in the format medical hiring committees expect.</p>

<h3>Research Grants and Fellowships</h3>

<p>Any application to a funding body — a research grant, a national fellowship, a foundation award — will ask for a CV. Grant reviewers are evaluating your full scholarly record: prior funding, publication track record, institutional affiliations, and the arc of your research agenda. A curated resume tells the wrong story in this context.</p>

<h2>The International Complication</h2>

<p>This is where things get genuinely complicated — and where the most confusion lives, especially for people applying across borders.</p>

<h3>UK, Australia, and New Zealand</h3>

<p>In the United Kingdom, Ireland, Australia, and New Zealand, "CV" is simply the standard term for what Americans call a resume. A British job posting that asks for your CV is not requesting a twenty-page academic document. It wants your professional history, formatted much like a US resume — just called something different because that's the convention there. Length expectations are similar: two pages is the UK standard for most roles, roughly equivalent to the American one-to-two-page norm.</p>

<p>This matters in both directions. An American sending a one-page resume to a UK employer has done nothing wrong. A British candidate sending what they call their "CV" to a US company — and genuinely submitting a long academic document — has created an awkward situation that's hard to recover from mid-process.</p>

<h3>Europe, Asia, and the Rest of the World</h3>

<p>Conventions vary significantly by country. In Germany and much of Central Europe, detailed CVs with photos are standard. In France, the format expectations differ again. In some Asian markets, a specific standardized format is expected for government or large corporate applications. The safest approach when applying internationally: look at what employers in that specific country actually post in their job listings, and if you can, find examples from professionals in your field in that region. The terminology in a posting tells you less than the context around it.</p>

<h2>How to Tell What a Job Posting Is Actually Asking For</h2>

<p>When a posting is ambiguous — and many are — read the surrounding context rather than just the word used. A few reliable signals:</p>

<ul>
  <li>If the posting mentions publications, research experience, or academic qualifications as core requirements, they probably want a CV.</li>
  <li>If it lists responsibilities, required skills, and a salary band like a standard job listing, send a resume regardless of what word they used.</li>
  <li>If the employer is a university, hospital, research institute, or government research agency, lean toward a CV.</li>
  <li>If the employer is a company of any kind outside academia and medicine, send a resume.</li>
  <li>When genuinely uncertain, a well-structured, tailored resume is almost never the wrong call for non-academic roles.</li>
</ul>

<p>You can also simply ask. If you've reached a point in the process where you're communicating with a recruiter or hiring manager, a brief, direct question — "Should I submit a CV or a resume for this role?" — signals attention to detail, not confusion.</p>

<h2>How to Format Each One Correctly</h2>

<h3>Resume Formatting Essentials</h3>

<p>Keep it clean and scannable. Single column, standard fonts (not creative typography), consistent formatting throughout. Bullet points over paragraphs for work experience. Quantify wherever you can — numbers give recruiters something concrete to hold onto. Save as a .docx or clean PDF; avoid anything that might break when parsed by an ATS system. No photos, no graphics, no text boxes that could confuse automated screening software.</p>

<h3>CV Formatting Essentials</h3>

<p>CVs in academic fields tend to follow field-specific conventions — look at CVs from established researchers in your discipline for reference. The order typically goes: education first (unlike resumes, where experience leads), then research experience, publications, presentations, grants, teaching, and service. Publications are usually formatted in the citation style of your field. Consistency and completeness matter more than design — academic committees are reading for content, not scanning for keywords.</p>

<h2>Common Mistakes That Cost People Opportunities</h2>

<h3>Sending a CV When a Resume Was Expected</h3>

<p>This happens more often than you'd think, particularly among people transitioning out of academia into industry. A fifteen-page CV sent to a tech company's recruiter doesn't read as thorough — it reads as someone who doesn't understand how hiring works outside academia. Worse, most ATS systems struggle to parse multi-page documents with non-standard formatting. The document may never surface correctly in the screening queue.</p>

<h3>Treating Your Resume Like a CV</h3>

<p>The opposite problem: people who include everything they've ever done in chronological order, hoping something will land. Resumes that try to be comprehensive instead of targeted tend to be longer, harder to read, and less persuasive. Recruiters aren't looking for a complete record — they're looking for evidence that you can do this specific job. If your resume doesn't make that case clearly within the first half of the page, it isn't doing its job.</p>

<h3>Not Tailoring Your Resume for Each Application</h3>

<p>Sending the same resume to fifty companies is one of the most common mistakes in a job search — and one of the most costly. Each posting has its own keyword priorities, its own way of describing similar work, its own signals about what matters to that company. A resume that's carefully aligned with a specific job description consistently outperforms a generic one, both in ATS scoring and in the impression it makes on human reviewers. Customizing takes more time. It also works significantly better.</p>

<h3>Applying the Wrong Country's Conventions</h3>

<p>International applications that ignore local formatting norms stand out — not in a good way. A photo on a US resume can raise unconscious bias concerns or simply look out of place. A resume without a photo in Germany might signal that the candidate doesn't know local norms. When applying across borders, research the expectations in the destination country, not just the format you're used to.</p>

<h2>Resume vs CV Checklist: Which Do You Need?</h2>

<p>Before you put together any application, run through these questions:</p>

<ul>
  <li>Is the employer a university, hospital, research institute, or government research body? → <strong>CV</strong></li>
  <li>Are you applying for a faculty position, postdoc, research fellowship, or clinical role? → <strong>CV</strong></li>
  <li>Are you applying for a grant or research funding? → <strong>CV</strong></li>
  <li>Is the employer a company — startup, SME, or large corporate? → <strong>Resume</strong></li>
  <li>Is the posting on a standard job board (LinkedIn, Indeed, Glassdoor)? → <strong>Resume</strong></li>
  <li>Are you applying to a UK, Australian, or New Zealand employer outside academia? → <strong>Resume</strong> (even if they call it a CV)</li>
  <li>Are you applying internationally and unsure of local norms? → Research first, then decide</li>
  <li>Is the posting genuinely ambiguous and you can't tell? → <strong>Resume</strong>, and tailor it carefully</li>
</ul>

<h2>How Rejectly Helps You Get the Resume Right</h2>

<p>Once you've confirmed that a resume is what's needed — which it will be for most applications — the next question is whether your resume is actually working. And that's harder to assess than most people expect.</p>

<p>ATS systems filter out a significant percentage of applicants before any human sees their document. Keyword matching, formatting compatibility, section structure — all of these affect whether your resume surfaces correctly in the screening queue. A resume that reads beautifully as a PDF might parse terribly in an automated system.</p>

<p>Rejectly analyzes your resume against any job description and shows you exactly where you stand: which keywords you're hitting, which you're missing, how your ATS score compares to the threshold for that type of role, and what specific changes would make the biggest difference. If you're going to invest time tailoring your resume for each application, it helps to know whether that tailoring is actually landing.</p>

<p><a href="/dashboard">See how your resume scores against your target role →</a></p>

<h2>Conclusion</h2>

<p>Resume and CV aren't interchangeable — at least not in contexts where it actually matters. A resume is a targeted argument for a specific role. A CV is a comprehensive record of a career. Most jobs want a resume. Academic, medical, and research roles want a CV. And in much of the English-speaking world outside the US, "CV" just means resume, which adds a layer of confusion that you now know how to navigate.</p>

<p>The goal of either document is the same: make it easy for someone to say yes to you. Knowing which one to send — and making sure it's built correctly for its audience — is the first step in doing that well.</p>`,
    })
    .eq("slug", "resume-vs-cv-difference")
    .select();

  if (error) {
    console.error("ERROR:", error.message);
  } else {
    console.log("SUCCESS! Blog post updated:");
    console.log("ID:", data[0].id);
    console.log("Slug:", data[0].slug);
    console.log("Reading time:", data[0].reading_time_minutes, "min");
  }
}

updateBlogPost();
