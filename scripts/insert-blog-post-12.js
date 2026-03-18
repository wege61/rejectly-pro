const { createClient } = require("@supabase/supabase-js");

const supabase = createClient(
  "https://mxnytawzqzrounbomqxf.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im14bnl0YXd6cXpyb3VuYm9tcXhmIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MDYyMTk5OCwiZXhwIjoyMDc2MTk3OTk4fQ.sWdGWliNVxZzQ9dqTMdxh19JKdzeqagavs5791GmgRo"
);

async function insertBlogPost() {
  const { data, error } = await supabase.from("blog_posts").insert({
    title: "The Biggest Career Mistakes in Your 20s",
    slug: "career-mistakes-in-your-20s",
    excerpt:
      "Your 20s aren't a trial run — they're the highest-optionality period of your career. The decisions made here compound in both directions. Here's what the costly ones look like, and what to do instead.",
    content: `<h2>The Highest-Stakes Decade You're Told Is Low-Stakes</h2>

<p>The common framing of your 20s is that they're for figuring things out — a relatively consequence-free period of experimentation before real life begins. This framing is mostly wrong, and believing it is itself one of the more expensive mistakes people make in their 20s.</p>

<p>What's actually true: your 20s are the highest-optionality period of your career. You have fewer obligations, the widest range of directions still open, and — critically — the most time for mistakes to compound positively rather than negatively. The people who build remarkable careers don't spend their 20s waiting for clarity. They make specific bets early, learn faster than the people around them, and build things that compound: skills, relationships, reputations.</p>

<p>Here are the mistakes that most reliably slow that process down.</p>

<h2>Optimizing for Salary Too Early</h2>

<p>Taking the highest-paying offer at 23 feels rational. In many cases, it's the costlier choice. Early in a career, the most valuable currency isn't money — it's learning rate. A role that pays $15,000 less but puts you in daily contact with exceptional people, gives you real responsibility, and teaches you how high-functioning organizations actually work is worth significantly more in career capital than a well-compensated role where you're doing rote work with limited exposure.</p>

<p>The salary difference is real but recoverable. The lost learning compounds in the wrong direction for years. The people who earn the most at 35 are almost never the ones who maximized income at 23 — they're the ones who maximized their learning rate during the years when the cost of doing so was low.</p>

<h2>Staying in the Wrong Job Too Long</h2>

<p>The first year at most jobs teaches you a lot. The second year teaches you less. By the third year in a role that isn't growing you, you're paying a hidden tax: the opportunity cost of time spent in a context that stopped developing your skills, network, or judgment. That tax is real even if the job is comfortable, the colleagues are fine, and there's no urgent reason to leave.</p>

<h3>The Sunk Cost Problem</h3>

<p>People stay in underperforming roles for the same reason they finish bad books: they've already invested time, and leaving feels like admitting that time was wasted. It wasn't wasted — you learned what you learned, and now the question is what comes next. The relevant calculation is forward-looking: is the next year at this job going to develop you as much as the next year somewhere else would? If the honest answer is no, that's the signal worth acting on.</p>

<p>This doesn't mean job-hopping reflexively. A year or two at a role where you're genuinely growing is worth defending. But "comfort" and "growth" are different things, and it's easy to mistake one for the other when you're inside a situation.</p>

<h2>Building a Network Only When You Need One</h2>

<p>Most people treat professional networking as something you do when you're job searching — a transactional activity with an obvious goal. The relationships built under those conditions are weaker than the ones built with no agenda at all.</p>

<p>The relationships formed in your 20s, when nobody has much power or anything particular to offer each other, become the most valuable ones by your 30s and 40s — because the people you met when they were junior analysts or early engineers are now directors, founders, and decision-makers. They hire people they know. They recommend people they trust. And they know you from before there was anything to gain from knowing you, which is a different quality of relationship entirely.</p>

<p>Building that network requires consistent, low-pressure contact over years: staying in touch with former colleagues, being genuinely curious about what people are working on, making introductions between people who should know each other. None of it is urgent. All of it compounds.</p>

<h2>Keeping Your Head Down</h2>

<p>The implicit assumption behind "just do great work and it will be noticed" is that excellent work is self-evidently visible. It isn't. Organizations are large and noisy. Work that isn't attached to a name and presented in a context where it can be evaluated tends to be absorbed into the collective output and forgotten, regardless of its quality.</p>

<h3>What Visibility Actually Means</h3>

<p>Visibility doesn't mean self-promotion in the uncomfortable sense. It means doing work that is inherently visible: taking on projects that cross teams, presenting your work rather than just completing it, writing up what you built and what it produced, mentoring someone more junior. It means creating a record that makes your contributions identifiable, so that when opportunities arise, the people who control them know what you've done.</p>

<p>The people who get promoted, recruited, and referred aren't always the best performers. They're the best performers whose work is visible to the people making those decisions. The gap between those two things is where a lot of careers stall unnecessarily.</p>

<h2>Not Negotiating — Even Once</h2>

<p>The first salary you accept sets an anchor. Most future compensation discussions — raises, counter-offers, new role negotiations — begin from that number. A $5,000 difference at 22, compounded through raises, bonuses, and future offer negotiations over a decade, is not a $5,000 difference. It's substantially larger, and it was determined in a ten-minute conversation most people didn't prepare for.</p>

<p>Negotiating an offer doesn't require aggression or elaborate strategy. It requires doing basic market research, making a specific counter with a brief rationale, and being willing to hold the silence after you make it. Most offers have room. Most employers expect it. The cost of not trying is almost always higher than the cost of asking.</p>

<h2>Staying Generically Well-Rounded</h2>

<p>There's a version of career advice that recommends accumulating broad exposure across many areas — a little marketing, a little product, a little operations — in service of becoming a versatile generalist. This advice isn't wrong for everyone, but for most people in their 20s it produces a more expensive outcome than developing genuine depth in something specific.</p>

<p>Organizations pay premiums for expertise. A person who is genuinely exceptional at one valuable thing — growth marketing, financial modeling, ML engineering, enterprise sales — has significantly more leverage than someone who is competent across six things. The generalist path works well if you're moving toward a specific leadership or operational role where breadth is the job. As a default early-career strategy, it often produces a resume that reads as unfocused rather than versatile.</p>

<h2>A Checklist for Your 20s</h2>

<ul>
  <li>Is your current role developing you at a rate you'd defend — or are you staying because it's comfortable?</li>
  <li>Are you optimizing for learning, not just salary, when evaluating new opportunities?</li>
  <li>Do you have relationships with people in your industry that aren't purely transactional?</li>
  <li>Is your work visible — presented, documented, attached to your name — or does it disappear into the team output?</li>
  <li>Have you negotiated at least one offer or salary, with real market data to back it?</li>
  <li>Are you developing genuine depth in something, or staying safely broad?</li>
  <li>Are you treating your 20s with the urgency they deserve — not anxiety, but deliberate direction?</li>
</ul>

<h2>How Rejectly Helps</h2>

<p>Many of the mistakes above are downstream of one thing: not being deliberate about the opportunities you're pursuing. A generic resume sent to generic roles produces generic outcomes. Rejectly helps you position your actual experience — whatever stage you're at — as specifically and compellingly as possible for the roles that would genuinely accelerate your trajectory.</p>

<p>If you're early in your career and your resume feels thin, the gap is usually not in your experience — it's in how that experience is framed and what keywords connect it to the roles you want.</p>

<p><a href="/dashboard">See how your resume positions you →</a></p>

<h2>Conclusion</h2>

<p>The mistakes that compound most negatively in your 20s are rarely dramatic. They're the accumulation of small, comfortable choices: staying a year too long, not asking for more, building skills broadly rather than deeply, doing excellent work that nobody can see. None of these feel like mistakes in the moment. They only become legible in retrospect, when the distance between where you are and where you could have been starts to show.</p>

<p>The antidote isn't anxiety — it's intentionality. Knowing what you're optimizing for, making deliberate bets, and being willing to move when the honest assessment says it's time. That's not a formula for a perfect career. It's the foundation for one that compounds in the direction you actually want.</p>`,
    featured_image:
      "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=1200&h=630&fit=crop&q=80",
    featured_image_alt: "Young professionals collaborating around a table",
    category_id: "8910d30e-ead4-45d8-a279-a77fc4f05c90",
    author_name: "Rejectly Team",
    is_published: true,
    published_at: new Date().toISOString(),
    reading_time_minutes: 7,
    meta_title: "The Biggest Career Mistakes in Your 20s | Rejectly",
    meta_description:
      "Your 20s aren't a trial run — the decisions made here compound for decades. Here are the career mistakes that cost people the most, and what to do instead.",
    meta_keywords: [
      "career mistakes in your 20s",
      "career advice 20s",
      "biggest career mistakes",
      "career tips for young professionals",
      "career development 20s",
      "early career mistakes",
      "career mistakes to avoid",
      "professional development 20s",
    ],
    og_image:
      "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=1200&h=630&fit=crop&q=80",
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
