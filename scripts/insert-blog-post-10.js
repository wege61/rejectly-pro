const { createClient } = require("@supabase/supabase-js");

const supabase = createClient(
  "https://mxnytawzqzrounbomqxf.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im14bnl0YXd6cXpyb3VuYm9tcXhmIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MDYyMTk5OCwiZXhwIjoyMDc2MTk3OTk4fQ.sWdGWliNVxZzQ9dqTMdxh19JKdzeqagavs5791GmgRo"
);

async function insertBlogPost() {
  const { data, error } = await supabase.from("blog_posts").insert({
    title: "How to Write a Resume If You Have Career Gaps",
    slug: "resume-with-career-gaps",
    excerpt:
      "A gap on your resume isn't a red flag — how you handle it is what determines whether it becomes one. Here's how to format, frame, and explain time away from work without apologizing for it.",
    content: `<h2>The Gap Isn't the Problem. The Handling Is.</h2>

<p>Career gaps are common. Layoffs, health issues, caregiving, burnout, deliberate breaks, economic downturns — most people, if they work for several decades, will have at least one period that doesn't fit neatly into a chronological resume. The widespread assumption that gaps are automatic disqualifiers is both pervasive and largely wrong.</p>

<p>What employers are actually concerned about isn't the gap itself — it's what the gap implies. Are your skills current? Do you have a coherent professional narrative? Did something happen that might affect your reliability or judgment? Those are the real questions. A well-constructed resume answers them before they're asked.</p>

<h2>What Employers Actually Think When They See a Gap</h2>

<p>Recruiters and hiring managers see gaps constantly. Their initial reaction is rarely moral judgment — it's pattern recognition. A gap that's explained by context they recognize (layoff, 2020–2021, parental leave) barely registers. A gap with no context and no framing raises questions that they'll either ask about or use as a reason to move to the next file.</p>

<p>The pandemic normalized a significant category of gaps. A break between 2020 and 2022 is now almost universally understood without explanation. Similarly, gaps following widely reported industry layoffs — tech in 2022–2023, media, finance — carry built-in context that many hiring managers share firsthand. The gaps that require the most deliberate handling are the ones without obvious external causes, or those extending beyond twelve to eighteen months.</p>

<h2>Types of Gaps and How Each Is Perceived</h2>

<h3>Layoffs and Restructuring</h3>

<p>The least stigmatized category. Being laid off is a business decision, not a performance verdict, and most hiring managers understand this viscerally — many have been through it themselves. A gap following a layoff benefits from brief, factual framing: "Company underwent a significant restructuring" or simply listing the employment end date without elaboration. You don't owe a detailed explanation on the resume itself.</p>

<h3>Personal and Family Reasons</h3>

<p>Caregiving for a child, parent, or spouse is a legitimate reason for a career break and is increasingly treated as such. "Career break — family caregiving" is an honest and sufficient label. Going into more detail on the resume than that is unnecessary. Interviewers who push for personal medical or family details beyond what you've offered are overstepping; you're not obligated to provide them.</p>

<h3>Health</h3>

<p>You are not required to disclose health-related reasons for a career gap on a resume or in most interview contexts. "Personal leave" or "medical leave" is sufficient. If pressed in an interview, "I dealt with a health matter that's now fully resolved" closes the subject professionally. The only information that matters to a prospective employer is whether you're able to do the job — and that's demonstrated by your application, not your medical history.</p>

<h3>Intentional Time Off</h3>

<p>A deliberate break for travel, study, creative work, or personal development is increasingly normalized, particularly for breaks under twelve months. "Career break — independent study and travel" or listing a specific course or project you completed gives the period positive content. The risk with intentional breaks is appearing unfocused. The antidote is showing that the time had direction, even if that direction was unconventional.</p>

<h2>Formatting Strategies That Reduce the Visual Impact</h2>

<h3>Use Years Only, Not Months</h3>

<p>This is the most straightforward technique for minimizing short gaps. "2022 – 2024" instead of "January 2022 – March 2024" makes a three-month gap between roles effectively invisible on the page. It's not deceptive — years-only dating is standard and widely used. If a gap is under six months, this format often eliminates any need to address it at all.</p>

<p>Gaps over six months are harder to obscure this way, since the years themselves will show the break. For those, framing becomes more important than formatting.</p>

<h3>Avoid Functional Resumes</h3>

<p>Functional resumes — which organize content by skill category rather than chronologically — are often recommended for people with gaps as a way to draw attention away from the timeline. In practice, they backfire. Experienced recruiters recognize functional formats immediately and associate them with attempts to hide something. They tend to generate more questions about the timeline, not fewer, because the format itself signals that there's something the candidate wants to obscure.</p>

<p>A chronological resume with honest dates and strategic framing of the gap period is almost always stronger than a functional one. The format communicates transparency; the framing handles the substance.</p>

<h3>List What You Did During the Gap</h3>

<p>If your gap had any professional content — freelance work, consulting, a certification, volunteer work, caregiving — it can and should appear on your resume as an entry, not a blank. "Independent Consultant, 2023 – 2024" with one or two brief bullets describing the work is legitimate and fills the visual space. "Career Break — Full-time Caregiver" with no bullets is also legitimate and honest. Both are better than a blank period that raises unspoken questions.</p>

<p>LinkedIn officially supports "Career Break" as a position type in the experience section, with a dropdown of recognized reasons. Using it normalizes the period rather than hiding it.</p>

<h2>How to Address Gaps in Cover Letters and Interviews</h2>

<h3>The Brief Explanation Approach</h3>

<p>The cover letter, if you're writing one, is the right place for a one-sentence acknowledgment of a significant gap — not the resume. "After leaving [Company] in 2022, I took time away from the workforce to care for a family member. I'm now fully focused on returning to [field] and am particularly drawn to this role because [specific reason]." One sentence, no over-explaining, immediate pivot to what's relevant.</p>

<p>In an interview, the same structure applies: brief, factual, forward-looking. State the reason without excessive detail, confirm that the situation is resolved if relevant, and redirect to your enthusiasm for the role. The instinct to over-explain a gap — to fill silence with more justification — almost always makes the gap feel larger than it is.</p>

<h3>What Not to Say</h3>

<ul>
  <li>Don't apologize for the gap. It wasn't a mistake and shouldn't be framed as one.</li>
  <li>Don't volunteer medical or deeply personal details that aren't relevant to your ability to do the job.</li>
  <li>Don't describe the gap as "just" taking time off or minimize it in a way that sounds defensive.</li>
  <li>Don't present a gap as longer than it was — if the resume shows years only and the actual gap was four months, that's fine and honest.</li>
</ul>

<h2>If You're Currently in a Gap</h2>

<p>The most effective thing you can do while job searching during a gap is to create something to put in the period. A completed online certification in a relevant tool. One freelance project — even a small one — that you can describe with outcomes. A volunteer role. Contributing to an open-source project. Writing publicly about your field. None of these need to be significant to be useful on a resume; they just need to give the gap positive content instead of empty space.</p>

<p>Even a single substantive activity during a gap transforms how it reads. "Completed Google Project Management Certificate; consulted independently on two client projects" turns a blank twelve months into a period of deliberate activity. The signal is that you remained engaged with your field — which is exactly what employers are trying to assess.</p>

<h2>Resume with Career Gaps: Checklist</h2>

<ul>
  <li>Are you using years-only dating? Short gaps under six months often disappear entirely with this format.</li>
  <li>Have you avoided a functional resume format in favor of chronological with honest dates?</li>
  <li>If the gap is significant, have you added an entry — career break, freelance work, caregiving, certification — to fill the period?</li>
  <li>Is your explanation of the gap brief and factual, without over-sharing personal details?</li>
  <li>Have you framed any skills or activities from the gap period as professionally relevant where they are?</li>
  <li>If you're currently in a gap, have you identified at least one thing you can complete or contribute to before your next application?</li>
  <li>Does your resume still lead with your strongest qualifications — not with an explanation of the gap?</li>
</ul>

<h2>How Rejectly Helps</h2>

<p>ATS systems used by many employers include filters that flag extended employment gaps automatically, sometimes excluding applicants before human review. Rejectly identifies how your resume is likely to be parsed — whether the gap period is reading correctly, whether dates are formatted in a way that minimizes unnecessary flags, and whether the content surrounding the gap is strong enough to outweigh it in the overall match score.</p>

<p>Gaps don't have to be liabilities. With the right structure and framing, they're a neutral part of a strong professional story.</p>

<p><a href="/dashboard">See how your resume reads to an ATS →</a></p>

<h2>Conclusion</h2>

<p>A career gap is a fact about your timeline, not a verdict about your value. Most employers understand this — and the ones who don't aren't the ones you want to work for anyway. Format your resume to minimize unnecessary visual gaps, add honest content to the gap period where you can, frame the break briefly and without apology, and then let the strength of the rest of your experience do the work. The gap is one data point in a document full of them. It doesn't have to be the loudest one.</p>`,
    featured_image:
      "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?w=1200&h=630&fit=crop&q=80",
    featured_image_alt: "Person writing notes at a desk with a calendar nearby",
    category_id: "9706e75f-58ea-4aad-91ce-4d0accae36e0",
    author_name: "Rejectly Team",
    is_published: true,
    published_at: new Date().toISOString(),
    reading_time_minutes: 7,
    meta_title: "How to Write a Resume If You Have Career Gaps | Rejectly",
    meta_description:
      "Career gaps don't disqualify you — how you handle them does. Here's how to format dates, frame the gap period, and explain time away from work without letting it define your application.",
    meta_keywords: [
      "resume with career gaps",
      "employment gap resume",
      "how to explain career gap",
      "resume gaps tips",
      "career break resume",
      "employment gap on resume",
      "how to write resume after gap",
      "career gap interview",
    ],
    og_image:
      "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?w=1200&h=630&fit=crop&q=80",
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
