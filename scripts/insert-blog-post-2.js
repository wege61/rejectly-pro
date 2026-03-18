const { createClient } = require("@supabase/supabase-js");

const supabase = createClient(
  "https://mxnytawzqzrounbomqxf.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im14bnl0YXd6cXpyb3VuYm9tcXhmIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MDYyMTk5OCwiZXhwIjoyMDc2MTk3OTk4fQ.sWdGWliNVxZzQ9dqTMdxh19JKdzeqagavs5791GmgRo"
);

async function insertBlogPost() {
  const { data, error } = await supabase.from("blog_posts").insert({
    title: "How to Get a Job Without Experience (Proven Strategies)",
    slug: "how-to-get-a-job-without-experience",
    excerpt:
      "The experience paradox is real — but it's not unbeatable. Here's how to reframe what experience actually means, build credibility from scratch, and land interviews even when your resume feels thin.",
    content: `<h2>The Catch-22 Nobody Warns You About</h2>

<p>Every job posting seems to want two to five years of experience. You're just starting out. You don't have two to five years of anything. So you apply anyway, hear nothing, and quietly wonder if the whole system is rigged against you.</p>

<p>It's not rigged. But it does have a logic — and once you understand that logic, you can work with it instead of against it.</p>

<p>Here's the truth: when a company says they want "experience," they're really asking for evidence. Evidence that you can do the work, that you won't need six months of hand-holding, that hiring you is a reasonable bet. Experience is just the most obvious form of that evidence. It's not the only form.</p>

<p>This guide is about building the other kinds.</p>

<h2>Reframe What Experience Actually Means</h2>

<p>Most people think of experience as paid work history. Recruiters think of it more broadly — and that distinction matters.</p>

<p>Experience, from a hiring perspective, includes anything that demonstrates relevant skill or judgment: freelance projects, personal work, volunteer roles, coursework with real deliverables, contributions to open-source projects, or even a well-documented side project that went nowhere. The common thread isn't payment or prestige — it's proof.</p>

<p>A graphic designer who has redesigned three local nonprofit websites for free has more demonstrable experience than someone with a title and no portfolio. A developer who has built and shipped a side app — even if ten people use it — has more to show than one who has only completed tutorials.</p>

<p>The moment you stop asking "how do I get experience?" and start asking "how do I create proof?" the path forward becomes much clearer.</p>

<h2>Build Before You Apply</h2>

<p>The most effective thing you can do before sending a single application is to make something. Not on paper — in reality.</p>

<p>The specifics depend on your field:</p>

<ul>
  <li><strong>Design:</strong> Redesign an existing product you think could be better. Document your thinking. Publish it.</li>
  <li><strong>Marketing:</strong> Start a newsletter, grow a social account, run a small ad campaign with your own money and write up what you learned.</li>
  <li><strong>Software:</strong> Build something that solves a real problem — even a small one. Ship it. Get users.</li>
  <li><strong>Finance or business:</strong> Build financial models, write investment memos, analyze a company's earnings call in depth.</li>
  <li><strong>Writing:</strong> Publish consistently. The medium matters less than the body of work.</li>
</ul>

<p>The goal is to walk into interviews with something to point at. "Here's what I built, here's the problem it solved, here's what I learned." That narrative is more compelling than most work histories.</p>

<h2>Your Transferable Skills Are More Valuable Than You Think</h2>

<p>If you've worked in any capacity — retail, hospitality, tutoring, caregiving, sports — you have skills that translate directly to professional environments. The problem isn't that you lack them. The problem is that most people don't know how to articulate them.</p>

<p>A few examples of what this translation looks like in practice:</p>

<ul>
  <li>Managing a shift at a busy restaurant → operations management, real-time prioritization, team coordination under pressure</li>
  <li>Tutoring students → communication, identifying knowledge gaps, adapting your approach to individual needs</li>
  <li>Running a student organization → project management, stakeholder management, budget responsibility</li>
  <li>Playing competitive sports → performance under pressure, accountability to a team, resilience</li>
</ul>

<p>The language matters enormously here. "I worked at a coffee shop" tells a recruiter nothing. "I managed peak-hour operations for a high-volume café, training new staff and resolving customer issues in real time" tells a very different story — and it's entirely accurate.</p>

<p>Go through everything you've done and ask: what was actually hard about this? What did it require of me? What would break down if I weren't good at it? Those answers are your transferable skills.</p>

<h2>Network Before You Need It</h2>

<p>Most job seekers treat networking as something you do when you're desperate. That's exactly backwards.</p>

<p>The most effective professional relationships are built slowly, over time, before there's any transactional element. When you reach out to someone and immediately ask for a job, the dynamic is uncomfortable for everyone. When you've spent six months being genuinely curious about someone's work — commenting thoughtfully on their writing, asking good questions, offering something useful — the conversation shifts entirely.</p>

<p>A practical approach that actually works:</p>

<ul>
  <li>Identify ten to fifteen people doing work you admire in fields you're targeting</li>
  <li>Follow their public work closely — articles, talks, LinkedIn posts, podcasts</li>
  <li>Engage with specific things they've said, not generic compliments</li>
  <li>After several genuine interactions, send a short, specific message asking for a 20-minute conversation about their career path</li>
  <li>Come to that conversation with good questions. Don't ask for a job. Ask for insight.</li>
</ul>

<p>Referrals account for roughly <strong>40% of hires</strong> at most companies, and referred candidates are hired at significantly higher rates than applicants from job boards. One warm introduction is worth a hundred cold applications.</p>

<h2>Target the Right Companies</h2>

<p>Not all employers value experience equally. Applying to Fortune 500 companies when you have no work history is not wrong, but it is inefficient — their hiring processes are heavily optimized around credentials and past titles.</p>

<p>The companies most likely to take a chance on potential over history:</p>

<ul>
  <li><strong>Early-stage startups</strong> — They need people who can move fast and wear multiple hats. A strong portfolio and obvious curiosity matter more than lineage.</li>
  <li><strong>High-growth companies</strong> — They're hiring faster than they can fill roles with experienced candidates. They're often willing to develop talent.</li>
  <li><strong>Small and mid-size businesses</strong> — Less structured hiring, more decisions made by actual humans who can recognize potential.</li>
  <li><strong>Mission-driven organizations</strong> — Demonstrated alignment with what they're trying to do carries significant weight.</li>
</ul>

<p>Also worth considering: adjacent roles. If you want to be a product manager but have no PM experience, look for associate PM roles, product operations roles, or customer success roles at product companies. These are legitimate on-ramps that experienced people rarely apply for — which means less competition and more opportunity to stand out.</p>

<h2>Write a Resume That Leads With Potential</h2>

<p>A resume with thin work history can still be a strong document. The key is structure and emphasis.</p>

<p><strong>Lead with a summary that positions you clearly.</strong> Don't write a generic objective statement. Write two or three sentences that articulate what you bring, what you're pursuing, and why. Be specific. "Recent marketing graduate with a demonstrated track record of growing owned channels" is better than "motivated self-starter seeking opportunities."</p>

<p><strong>Put your projects front and center.</strong> If your work history is sparse, move a "Projects" section above your experience. List two or three projects with a one-line description, the skills involved, and a quantifiable result where possible.</p>

<p><strong>Be precise about your skills.</strong> Instead of listing "communication" or "leadership," show those skills through your descriptions. Let the evidence speak rather than the label.</p>

<p><strong>Keep it to one page.</strong> A two-page resume implies a history you don't have. One tight, well-structured page looks intentional. Two sparse pages looks like you're padding.</p>

<h2>Use Internships and Contract Work as Entry Points</h2>

<p>Internships are not just for students. Many companies offer internship programs for career changers, recent graduates, and people re-entering the workforce. These are low-risk engagements for the employer and high-value opportunities for you — not just for the work itself, but for the network you build and the full-time roles that often follow.</p>

<p>Contract and freelance work serves a similar function. Platforms like Upwork, Toptal, and Contra connect clients with contractors at every experience level. A few completed contracts with strong reviews build credibility faster than most people expect.</p>

<p>The goal isn't to do this forever. It's to get in the door, do excellent work, and let that work speak for you.</p>

<h2>The Hidden Job Market Is Real — And Underused</h2>

<p>Roughly <strong>70-80% of jobs are never posted publicly</strong>. They're filled through internal networks, referrals, and proactive outreach before a listing ever goes live. For someone with limited experience, this is actually an advantage.</p>

<p>When a role gets posted publicly, it attracts hundreds of applicants, many of whom have exactly the credentials the job description requests. You're competing on a crowded field. But when you reach out to a hiring manager or team lead directly — before a role exists — you're a person, not a file.</p>

<p>A simple approach: identify companies where you genuinely want to work, find the relevant team lead or manager on LinkedIn, and send a short, direct note expressing specific interest in their work and asking if they'd be open to a conversation. No ask for a job, no long pitch. Just a human expressing genuine interest. A meaningful percentage of those conversations lead somewhere.</p>

<h2>How Rejectly Helps You Compete at Every Stage</h2>

<p>When your resume needs to work harder than everyone else's, the details matter. Rejectly's AI analysis identifies exactly where your resume falls short — missing keywords, weak phrasing, formatting issues that cause ATS systems to misread your application — and gives you specific, actionable improvements.</p>

<p>For candidates without extensive work history, this is particularly valuable. You can't afford to lose points on presentation when you're already asking employers to take a bet on potential. Every word needs to earn its place.</p>

<p><a href="/dashboard">See how your resume scores →</a></p>

<h2>The Long View</h2>

<p>Getting your first job — or your first job in a new field — is genuinely hard. The barriers are real. But they are not permanent, and they are not insurmountable.</p>

<p>The people who break through aren't the ones who apply to the most job postings. They're the ones who build something, talk to people, position themselves honestly and specifically, and keep going when the process feels opaque.</p>

<p>You don't need a perfect resume. You need a clear story, credible proof, and the persistence to keep putting yourself in rooms where opportunities happen. Everything else follows from that.</p>`,
    featured_image:
      "https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=1200&h=630&fit=crop&q=80",
    featured_image_alt: "Two people in a collaborative work conversation",
    category_id: "8910d30e-ead4-45d8-a279-a77fc4f05c90",
    author_name: "Rejectly Team",
    is_published: true,
    published_at: new Date().toISOString(),
    reading_time_minutes: 8,
    meta_title:
      "How to Get a Job Without Experience (Proven Strategies) | Rejectly",
    meta_description:
      "No experience? No problem. Learn how to reframe your background, build proof of your skills, and land interviews using strategies that actually work in 2026.",
    meta_keywords: [
      "how to get a job without experience",
      "entry level job tips",
      "no experience jobs",
      "first job advice",
      "career advice for beginners",
      "how to get hired",
      "job search strategies",
      "transferable skills",
    ],
    og_image:
      "https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=1200&h=630&fit=crop&q=80",
  }).select();

  if (error) {
    console.error("ERROR:", error.message);
  } else {
    console.log("SUCCESS! Blog post inserted:");
    console.log("ID:", data[0].id);
    console.log("Slug:", data[0].slug);
    console.log("Published:", data[0].is_published);
    console.log("Published at:", data[0].published_at);
  }
}

insertBlogPost();
