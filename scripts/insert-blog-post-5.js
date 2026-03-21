const { createClient } = require("@supabase/supabase-js");

const supabase = createClient(
  "https://mxnytawzqzrounbomqxf.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im14bnl0YXd6cXpyb3VuYm9tcXhmIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MDYyMTk5OCwiZXhwIjoyMDc2MTk3OTk4fQ.sWdGWliNVxZzQ9dqTMdxh19JKdzeqagavs5791GmgRo"
);

async function insertBlogPost() {
  const { data, error } = await supabase.from("blog_posts").insert({
    title: "How to Get Paid in USD While Living Abroad",
    slug: "how-to-get-paid-in-usd-abroad",
    excerpt:
      "Earning in dollars while your expenses are in pesos, lira, or baht is one of the most powerful financial moves available to remote workers. Here's exactly how the mechanics work — banking, taxes, and finding the jobs in the first place.",
    content: `<h2>Why the Currency You're Paid In Matters as Much as the Amount</h2>

<p>There's a version of remote work where you earn in the local currency of wherever you happen to be living. And there's a version where you keep your income anchored to a strong currency — USD, EUR, GBP — while your day-to-day expenses drop dramatically because you're living somewhere cheaper.</p>

<p>The second version is a fundamentally different financial position. A $6,000/month freelance income in Colombia or Georgia or Portugal doesn't just feel different from the same income spent in New York — it compounds differently. Savings rates that would be impossible in a high-cost city become routine. The mechanics of making it work, though, are more specific than most guides let on.</p>

<h2>The Three Main Ways to Earn in USD Abroad</h2>

<h3>Remote Employment (Salary, Benefits, Stability)</h3>

<p>The cleanest arrangement: a full-time remote job at a US or other high-salary-market company that pays you in USD regardless of where you live. Your salary is direct-deposited into a US bank account, you file taxes as you normally would, and your employer often doesn't care — or even know — which country you're sitting in on any given day.</p>

<p>The catch is that many companies have started implementing location-based pay adjustments. If your employer discovers you've relocated abroad and applies a 15–25% reduction to account for lower local costs, the arbitrage shrinks fast. Before you move, understand your company's policy. Some have it in writing; many enforce it inconsistently; some don't have one at all.</p>

<h3>Freelancing and Contract Work</h3>

<p>This is where geographic arbitrage works most cleanly. As a freelancer or independent contractor, your rate is set by the market you serve — US clients paying US market rates — not the country you live in. A freelance designer billing $120/hour to clients in San Francisco earns the same whether they're working from Lisbon or Los Angeles. The living costs, however, are not the same.</p>

<p>Platforms like Toptal, Upwork, and Contra connect freelancers with USD-paying clients globally. Direct client relationships — built through networking and referrals — typically pay better and require no platform fee. Most freelancers end up with a mix of both.</p>

<h3>Running an Online Business</h3>

<p>Products, courses, SaaS subscriptions, newsletters with paid tiers — any digital business that sells to a US or European audience generates revenue in strong currencies regardless of where the operator lives. This path has the highest ceiling and the most variable timeline. It's worth mentioning, but it's a separate undertaking from finding a job or freelance client.</p>

<h2>The Banking Setup That Actually Works</h2>

<h3>Keep a US Bank Account Active</h3>

<p>This is non-negotiable. A US bank account is where your income lands and from which you pull funds as needed. The account you want abroad is <strong>Charles Schwab's High Yield Investor Checking</strong> — no foreign transaction fees, no monthly fees, and it automatically reimburses all ATM fees worldwide at the end of each month. It's the account most long-term remote workers and expats end up using for daily spending.</p>

<p>If you're operating as a freelancer or business owner, <strong>Mercury</strong> is worth knowing: it's a US business bank account available to non-US residents, designed specifically for remote entrepreneurs. It integrates cleanly with invoicing and payment platforms.</p>

<h3>Use Wise for Currency Conversion</h3>

<p><strong>Wise</strong> (formerly TransferWise) is the standard solution for converting USD to local currency without getting destroyed on exchange rates. It holds balances in multiple currencies, converts at the real mid-market rate with a transparent small fee, and issues a debit card you can use anywhere. For most people abroad, the workflow is: income lands in US account → transfer to Wise → convert to local currency as needed. The fees are a fraction of what any traditional bank charges for the same operation.</p>

<p><strong>Payoneer</strong> is the alternative most freelancers on platforms like Upwork or Fiverr encounter first, since those platforms pay directly to Payoneer accounts. It works, but Wise is typically cheaper for actual currency conversion and more flexible for general use.</p>

<h3>A Note on Crypto</h3>

<p>Some clients — particularly in certain tech and Web3 adjacent industries — offer payment in USDC or USDT (dollar-pegged stablecoins). This sidesteps international wire fees and works across borders without friction. It's a legitimate option if you're comfortable with the setup and your clients offer it. It's not worth building your income infrastructure around unless you're already in that world.</p>

<h2>The Tax Reality Nobody Likes to Talk About</h2>

<h3>If You're a US Citizen</h3>

<p>The United States taxes its citizens on worldwide income regardless of where they live — one of only two countries in the world that does this (the other is Eritrea). Living abroad doesn't exempt you from filing. What it does do is make you potentially eligible for the <strong>Foreign Earned Income Exclusion (FEIE)</strong>, which allows you to exclude up to roughly $126,500 of foreign-earned income from US federal tax in 2024 if you meet the bona fide residence or physical presence test.</p>

<p>You'll also need to be aware of <strong>FBAR filing</strong> (FinCEN Form 114) if the aggregate balance of your foreign financial accounts exceeds $10,000 at any point during the year. It's a disclosure requirement, not a tax — but the penalties for missing it are severe. If your financial life is getting complex, an accountant who specializes in expat taxes (firms like Greenback Expat Tax Services or Bright!Tax) is worth the cost.</p>

<h3>If You're Not a US Citizen</h3>

<p>Generally, earning USD from US clients while living outside the US does not create a US tax obligation for non-US citizens. Your tax liability is typically to your country of residence. This is substantially simpler — though it varies by country, and some destinations (like Georgia, with its favorable freelancer tax structures) are worth researching specifically if tax efficiency is a priority.</p>

<h2>Finding Remote USD Jobs in the First Place</h2>

<h3>Where to Look</h3>

<ul>
  <li><strong>We Work Remotely</strong> and <strong>Remote OK</strong> — the two strongest dedicated remote job boards for tech, design, and marketing roles</li>
  <li><strong>LinkedIn</strong> with "remote" filter — higher volume, more noise, but where many companies post exclusively</li>
  <li><strong>Toptal</strong> — vetted freelance network for developers, designers, and finance professionals; rates are high, acceptance is competitive</li>
  <li><strong>Flexjobs</strong> — screened remote listings across industries, subscription-based but worth it for the signal-to-noise ratio</li>
  <li><strong>Direct outreach</strong> — identifying companies that already employ remote workers internationally (check LinkedIn for "remote" in employee locations) and reaching out before roles are posted</li>
</ul>

<h3>How to Position Yourself</h3>

<p>Companies hiring internationally for remote roles are often implicitly looking for people who are self-directed, async-comfortable, and don't require hand-holding on time zones or communication. Your resume and cover letter should reflect those qualities explicitly — not just your technical skills. Mention async tools you've used (Notion, Linear, Loom), reference distributed team experience if you have it, and make clear you've thought about the practical realities of remote work, not just the lifestyle.</p>

<h2>Before You Make the Move: A Checklist</h2>

<ul>
  <li>Do you have a US bank account you'll keep active? (Schwab checking is the standard recommendation)</li>
  <li>Have you set up Wise for currency conversion and local spending?</li>
  <li>Do you know your employer's location-based pay policy, if you're employed?</li>
  <li>Have you researched the tax obligations in your destination country?</li>
  <li>If you're a US citizen: are you aware of FEIE eligibility and FBAR requirements?</li>
  <li>If you're freelancing: do your client contracts specify USD payment and wire transfer or ACH details?</li>
  <li>Have you confirmed reliable internet at your destination before committing to a lease?</li>
</ul>

<h2>How Rejectly Fits In</h2>

<p>The banking and tax setup is the infrastructure. But the foundation of all of it is having income strong enough to make the math work — which means landing the right remote role or clients in the first place.</p>

<p>Remote jobs at well-funded US companies attract global applicants. The competition is real, and the resumes that get through ATS systems and onto recruiter desks are the ones that are precisely tailored to each posting. If you're targeting USD-paying remote roles, your resume needs to compete at that level.</p>

<p><a href="/dashboard">See how your resume scores for remote roles →</a></p>

<h2>Conclusion</h2>

<p>Getting paid in USD while living abroad isn't complicated — but it does require getting the right pieces in place. A US bank account that doesn't punish you for being overseas. A currency conversion layer that doesn't eat your margins. A clear understanding of your tax obligations. And income that's actually anchored to a strong-currency market, not just called "remote."</p>

<p>Get those pieces right, and the rest — the lower rent, the higher savings rate, the life that looks financially impossible from inside a high-cost city — follows naturally.</p>`,
    featured_image:
      "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=1200&h=630&fit=crop&q=80",
    featured_image_alt: "Person working on laptop with currency and passport nearby",
    category_id: "8910d30e-ead4-45d8-a279-a77fc4f05c90",
    author_name: "Rejectly Team",
    is_published: true,
    published_at: new Date().toISOString(),
    reading_time_minutes: 7,
    meta_title: "How to Get Paid in USD While Living Abroad | Rejectly",
    meta_description:
      "The exact banking setup, tax realities, and job-finding strategies for remote workers who want to earn in dollars while living somewhere their money goes further.",
    meta_keywords: [
      "get paid in USD abroad",
      "remote work banking",
      "earn in dollars living abroad",
      "digital nomad banking",
      "wise payoneer remote work",
      "USD income abroad",
      "expat remote work",
      "remote work taxes abroad",
    ],
    og_image:
      "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=1200&h=630&fit=crop&q=80",
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
