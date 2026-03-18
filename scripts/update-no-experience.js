const { createClient } = require("@supabase/supabase-js");

const supabase = createClient(
  "https://mxnytawzqzrounbomqxf.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im14bnl0YXd6cXpyb3VuYm9tcXhmIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MDYyMTk5OCwiZXhwIjoyMDc2MTk3OTk4fQ.sWdGWliNVxZzQ9dqTMdxh19JKdzeqagavs5791GmgRo"
);

async function updateBlogPost() {
  const { data, error } = await supabase
    .from("blog_posts")
    .update({
      reading_time_minutes: 7,
      content: `<h2>The Catch-22 Nobody Warns You About</h2>

<p>Every job posting seems to want two to five years of experience. You're just starting out. So you apply anyway, hear nothing, and quietly wonder if the whole thing is rigged against you.</p>

<p>It's not rigged. But it does have a logic — and once you understand it, you can work with it. When a company says they want "experience," they're really asking for evidence. Evidence that you can do the work, that hiring you is a reasonable bet. Experience is just the most obvious form of that evidence. It's not the only form. This guide is about building the other kinds.</p>

<h2>Reframe What Experience Actually Means</h2>

<p>Most people think of experience as paid work history. Recruiters think of it more broadly — and that distinction matters enormously.</p>

<p>Experience, from a hiring perspective, includes anything that demonstrates relevant skill or judgment: freelance projects, personal work, volunteer roles, coursework with real deliverables, open-source contributions, or a well-documented side project. The common thread isn't payment or prestige — it's proof.</p>

<p>The moment you stop asking "how do I get experience?" and start asking "how do I create proof?" the path forward becomes much clearer.</p>

<h2>Build Before You Apply</h2>

<p>The most effective thing you can do before sending a single application is to make something real. Not on paper — in practice. Walk into interviews with something to point at: "Here's what I built, here's the problem it solved, here's what I learned." That narrative is more compelling than most work histories.</p>

<h3>What to Build, by Field</h3>

<ul>
  <li><strong>Design:</strong> Redesign a product you think could be better. Document your process and reasoning. Publish it.</li>
  <li><strong>Marketing:</strong> Start a newsletter, grow a social account from zero, or run a small ad campaign with your own money and write up the results.</li>
  <li><strong>Software:</strong> Build something that solves a real problem — even a small one. Ship it. Get users.</li>
  <li><strong>Finance or business:</strong> Build financial models, write investment memos, analyze a public company's earnings in depth.</li>
  <li><strong>Writing:</strong> Publish consistently. The platform matters less than the body of work.</li>
</ul>

<h2>Your Transferable Skills Are More Valuable Than You Think</h2>

<p>If you've worked in any capacity — retail, hospitality, tutoring, caregiving — you have skills that translate directly to professional environments. The problem isn't that you lack them. It's that most people don't know how to articulate them.</p>

<h3>How the Translation Works</h3>

<ul>
  <li>Managing a restaurant shift → operations management, real-time prioritization, team coordination under pressure</li>
  <li>Tutoring students → communication, identifying knowledge gaps, adapting your approach to individual needs</li>
  <li>Running a student organization → project management, stakeholder management, budget responsibility</li>
  <li>Playing competitive sports → performance under pressure, accountability, resilience</li>
</ul>

<p>The language matters. "I worked at a coffee shop" tells a recruiter nothing. "I managed peak-hour operations for a high-volume café, training new staff and resolving customer issues in real time" tells a very different story — and it's entirely accurate. Go through everything you've done and ask: what was actually hard about this? What did it require? Those answers are your transferable skills.</p>

<h2>Network Before You Need It</h2>

<p>Most people treat networking as something you do when you're desperate. That's exactly backwards. The most effective professional relationships are built slowly, before there's any transactional element. Referrals account for roughly <strong>40% of hires</strong> at most companies — and referred candidates are hired at significantly higher rates than applicants from job boards. One warm introduction is worth a hundred cold applications.</p>

<h3>A Practical Approach That Actually Works</h3>

<ol>
  <li>Identify ten to fifteen people doing work you admire in fields you're targeting</li>
  <li>Follow their public work closely — articles, LinkedIn posts, talks</li>
  <li>Engage with specific things they've said, not generic compliments</li>
  <li>After several genuine interactions, send a short message asking for a 20-minute conversation about their career path</li>
  <li>Come to that conversation with good questions. Don't ask for a job. Ask for insight.</li>
</ol>

<h2>Target the Right Companies</h2>

<p>Not all employers value experience equally. Applying exclusively to Fortune 500 companies when you have no work history isn't wrong — it's just inefficient. Their processes are heavily optimized around credentials and past titles.</p>

<h3>Where to Focus Your Energy</h3>

<ul>
  <li><strong>Early-stage startups</strong> — They need people who can move fast. A strong portfolio and obvious curiosity matter more than lineage.</li>
  <li><strong>High-growth companies</strong> — They're hiring faster than they can fill roles with experienced candidates and are often willing to develop talent.</li>
  <li><strong>Small and mid-size businesses</strong> — Less structured hiring, more decisions made by humans who can recognize potential.</li>
</ul>

<h3>Consider Adjacent Roles as On-Ramps</h3>

<p>If you want to be a product manager but have no PM experience, look for associate PM roles, product operations roles, or customer success positions at product companies. These are legitimate entry points that experienced people rarely apply for — which means less competition and more room to stand out. Get in the door, do excellent work, and let that work open the next door.</p>

<h2>Write a Resume That Leads With Potential</h2>

<p>A resume with thin work history can still be a strong document. Structure and emphasis are everything.</p>

<h3>How to Structure It</h3>

<p><strong>Lead with a specific summary.</strong> Don't write a generic objective statement. Two or three sentences that articulate what you bring and what you're pursuing. "Recent marketing graduate with a demonstrated track record of growing owned channels" beats "motivated self-starter seeking opportunities."</p>

<p><strong>Put projects front and center.</strong> If your work history is sparse, move a Projects section above Experience. Two or three entries with a one-line description, the skills involved, and a result where possible.</p>

<p><strong>Keep it to one page.</strong> A two-page resume implies a history you don't have. One tight page looks intentional.</p>

<h2>The Hidden Job Market Is Real</h2>

<p>Roughly <strong>70–80% of jobs are never posted publicly</strong>. They're filled through networks and proactive outreach before a listing goes live. For someone with limited experience, this is actually an advantage — when a role gets posted publicly, you're competing with hundreds of credentialed applicants. When you reach out directly to a hiring manager before a role exists, you're a person, not a file.</p>

<p>Identify companies where you genuinely want to work, find the relevant team lead on LinkedIn, and send a short note expressing specific interest in their work. No pitch, no ask for a job — just a human expressing genuine curiosity. A meaningful percentage of those conversations lead somewhere.</p>

<h2>Before You Hit Apply: A Checklist</h2>

<ul>
  <li>Have you built at least one concrete proof of your skills — a project, portfolio piece, or documented work?</li>
  <li>Have you translated your past experiences into professional language with specific outcomes?</li>
  <li>Is your resume one page, with projects prominent and a specific summary at the top?</li>
  <li>Have you identified 5–10 target companies and researched what they actually value?</li>
  <li>Are you applying to companies that hire for potential, not just pedigree?</li>
  <li>Have you reached out to at least two or three people in your target field before applying?</li>
  <li>Have you checked the hidden job market — proactive outreach, not just job boards?</li>
</ul>

<h2>How Rejectly Helps You Compete</h2>

<p>When your resume needs to work harder than everyone else's, every detail matters. Rejectly's AI analysis identifies exactly where your resume falls short — missing keywords, weak phrasing, formatting that causes ATS systems to misread your application — and gives you specific improvements.</p>

<p>For candidates without extensive work history, this is especially valuable. You can't afford to lose points on presentation when you're already asking employers to bet on potential.</p>

<p><a href="/dashboard">See how your resume scores →</a></p>

<h2>Conclusion</h2>

<p>Getting your first job — or your first job in a new field — is genuinely hard. But the people who break through aren't the ones who send the most applications. They're the ones who build something, talk to people, position themselves honestly and specifically, and keep going when the process feels opaque.</p>

<p>You don't need a perfect resume. You need a clear story, credible proof, and the persistence to keep putting yourself in rooms where opportunities happen. Everything else follows from that.</p>`,
    })
    .eq("slug", "how-to-get-a-job-without-experience")
    .select();

  if (error) {
    console.error("ERROR:", error.message);
  } else {
    console.log("SUCCESS! Updated:");
    console.log("ID:", data[0].id);
    console.log("Slug:", data[0].slug);
  }
}

updateBlogPost();
