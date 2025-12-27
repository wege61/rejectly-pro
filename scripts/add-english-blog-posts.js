require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

async function addEnglishPosts() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    }
  );

  console.log('🚀 Replacing Turkish posts with English versions...\n');

  // First, unpublish Turkish posts
  const turkishSlugs = [
    'kusursuz-cv-hazirlama-rehberi-2025',
    'etkileyici-on-yazi-nasil-yazilir',
    'linkedin-profil-optimizasyonu-rehberi',
    'uzaktan-calisma-isi-nasil-bulunur',
    'yazilim-mulakat-hazirligi-rehberi',
  ];

  await supabase
    .from('blog_posts')
    .update({ is_published: false })
    .in('slug', turkishSlugs);

  console.log('📦 Unpublished Turkish posts\n');

  // English blog posts
  const posts = [
    {
      title: 'How to Create the Perfect Resume in 2025',
      slug: 'perfect-resume-guide-2025',
      excerpt: 'Learn how to craft a professional resume that gets you closer to your dream job. This comprehensive guide covers everything you need to create an attention-grabbing resume.',
      content: `## Introduction: Why Your Resume Matters

Your resume is your first point of contact with potential employers. Research shows that hiring managers spend an average of only **6 seconds** reviewing a resume. You need to make a strong impression in that brief window.

## Resume Basics

### 1. Choosing the Right Format

Select your resume format based on your experience level and goals:

**Chronological Format**
- Most commonly used format
- Lists work experience from newest to oldest
- Ideal for those with steady career progression

**Functional Format**
- Emphasizes skills over chronology
- Suitable for career changers
- Helpful for candidates with employment gaps

**Combination Format**
- Highlights both skills and work history
- Perfect for experienced professionals
- Great for candidates with diverse experience

### 2. Essential Resume Sections

**Contact Information**
- Full Name (large font)
- Phone number
- Professional email address
- LinkedIn profile link
- Location (city is sufficient)

**Professional Summary**
- 2-3 sentence introduction
- Key skills
- Career objectives
- Unique value propositions

**Work Experience**
- Company name and location
- Job title
- Employment dates
- Responsibilities and achievements (bullet points)
- Quantifiable results

**Education**
- University/school name
- Major/field of study
- Graduation year
- Honors (if applicable)

**Skills**
- Technical skills
- Software/programs
- Languages and proficiency levels
- Certifications

### 3. Quantify Your Achievements

Wrong: "Managed sales team"
Right: "Led 10-person sales team, increasing annual sales by 35%"

Wrong: "Improved customer satisfaction"
Right: "Reduced customer complaints by 60% in 6 months, raising satisfaction score to 4.8/5"

### 4. Creating an ATS-Friendly Resume

Most modern companies use ATS (Applicant Tracking Systems). Make your resume ATS-compliant by:

- Using standard headings (Experience, Education, Skills)
- Choosing simple, single-column layouts
- Using text instead of graphics
- Including keywords from job descriptions
- Preferring PDF or DOCX formats

## Common Mistakes to Avoid

### 1. Wrong Length

- New graduates: 1 page
- Mid-level (3-10 years): 1-2 pages
- Senior/Executive: 2-3 pages

### 2. Too Much Personal Information

Don't include:
- Date of birth
- Marital status
- Photo (except in some countries)
- Social security number
- References (unless requested)

### 3. Generic Statements

Avoid:
- "Team player"
- "Fast learner"
- "Detail-oriented"
- "Strong communication skills"

Provide concrete examples instead.

### 4. Typos and Errors

- Proofread at least 3 times
- Have someone else review it
- Use tools like Grammarly
- Double-check names, dates, and contact info

## Industry-Specific Tips

### Technology

- Include GitHub/Portfolio links
- List technologies used
- Mention open-source contributions
- Discuss side projects

### Marketing

- Share campaign results
- Specify platforms used
- Include ROI metrics
- Highlight certifications

### Finance

- Feature certifications prominently (CFA, CPA, etc.)
- Express financial results with numbers
- Emphasize compliance/regulatory experience
- Showcase analytical skills

## Optimize Your Resume with Rejectly

Rejectly analyzes your resume with AI to:

- Show job posting compatibility score
- Identify missing keywords
- Evaluate ATS compliance
- Provide personalized improvement suggestions
- Generate optimized resume versions

[Get free resume analysis](/dashboard)

## Conclusion

Creating the perfect resume is a process. Keep updating it, customize for each application, and incorporate feedback.

Remember: Your resume is your professional story. It's up to you to tell it effectively!`,
      category_slug: 'resume-tips',
      tags: ['resume', 'job-search', 'ats'],
      published_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      reading_time_minutes: 10,
      featured_image: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=1200&h=630&fit=crop',
      featured_image_alt: 'Person preparing resume on laptop',
    },
    {
      title: 'How to Write a Compelling Cover Letter: Complete Guide with Examples',
      slug: 'how-to-write-compelling-cover-letter',
      excerpt: 'A cover letter helps you stand out in job applications. This guide covers all the secrets and examples of writing a cover letter that impresses employers.',
      content: `## What is a Cover Letter and Why Does It Matter?

A cover letter is a formal letter you send with your resume, introducing yourself and your application. Research shows that candidates who send cover letters have a **40% higher chance** of being called for interviews.

## Cover Letter Structure

### 1. Header and Contact Information

\`\`\`
[Your Name]
[Your Email]
[Your Phone]
[Date]

[Company Name]
[Hiring Manager Name (if known)]
[Company Address]
\`\`\`

### 2. Opening Paragraph

Your first paragraph should be attention-grabbing:

**Wrong Example:**
"I am applying for the X position with this letter."

**Right Example:**
"My 5 years of digital marketing experience and 150% ROI increase in campaigns I managed last year make me the ideal candidate for your Marketing Manager position."

### 3. Body Paragraphs (1-2 paragraphs)

**First Paragraph:** Why this position?
- Show you've researched the company
- Emphasize alignment with company values
- Explain why you're interested in the position

**Second Paragraph:** Why you?
- Share concrete achievements
- Show how you meet job requirements
- Highlight unique skills

### 4. Closing Paragraph

- Request for interview
- Expression of thanks
- Professional closing

## Cover Letter Writing Best Practices

### DO: What You Should Do

1. **Personalize**
   - Write new cover letter for each application
   - Research the company
   - Learn the hiring manager's name

2. **Be Specific**
   - Use numbers and metrics
   - Provide specific examples
   - Make achievements measurable

3. **Show Passion**
   - Demonstrate interest in the position
   - Emphasize cultural fit
   - Express desire to contribute

4. **Be Professional**
   - Use formal language
   - Pay attention to grammar
   - Choose appropriate format

### DON'T: What to Avoid

1. **Don't Use Generic Templates**
   - Use names instead of "Dear Hiring Manager"
   - Avoid copy-paste

2. **Don't Repeat Your Resume**
   - Cover letter isn't a resume summary
   - Add new information
   - Tell your story

3. **Don't Write Too Long**
   - Maximum 1 page
   - 3-4 paragraphs sufficient
   - Every word counts

4. **Don't Mention Negatives**
   - Don't criticize previous employers
   - Don't emphasize weaknesses
   - Don't make excuses

## Industry-Specific Cover Letter Examples

### Tech Industry Example

\`\`\`
Dear [Manager Name],

I'm applying for your Software Developer position. My 4 years of experience with React and Node.js, plus 10,000+ GitHub stars on my open-source projects, demonstrate that I can make valuable contributions to your team.

I've been following your company's microservices architecture transition project with great interest. In my previous company, I led a similar transition, improving system performance by 200% and reducing distributed system error rates by 80%.

I'd like to join your team to contribute to your technical vision and develop scalable solutions.

Best regards,
[Your Name]
\`\`\`

### Marketing Industry Example

\`\`\`
Dear [Manager Name],

I'm applying for your Digital Marketing Specialist position. My social media campaigns reaching 2M+ users and achieving 45% engagement rates over the past 3 years show I can strengthen your brand's digital presence.

Your sustainability-focused brand positioning greatly impressed me. In my previous role, I created a brand strategy from scratch for a startup with similar values, gaining 50K organic followers in 6 months.

I'd like to add value to your brand with my creative campaign ideas and data-driven approach.

Best wishes,
[Your Name]
\`\`\`

## Create Cover Letters with Rejectly

Rejectly's AI-powered cover letter generator:

- Generates cover letters tailored to your resume and job posting
- Personalized content suggestions
- ATS-compliant format
- Different tone and style options

[Start creating cover letters now](/cover-letters)

## Conclusion

An effective cover letter is the most important factor distinguishing you from other candidates. Taking time to write a personalized and compelling cover letter will significantly increase your interview chances.

Remember: Your cover letter is the first indicator of your professional identity and communication skills!`,
      category_slug: 'resume-tips',
      tags: ['cover-letter', 'job-search', 'resume'],
      published_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      reading_time_minutes: 12,
      featured_image: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=1200&h=630&fit=crop',
      featured_image_alt: 'Person writing on laptop',
    },
    {
      title: 'LinkedIn Profile Optimization: Get Found by Employers',
      slug: 'linkedin-profile-optimization-guide',
      excerpt: 'Build a strong professional network on LinkedIn and get found by employers. Profile optimization, content strategy, and networking tips.',
      content: `## Why LinkedIn?

LinkedIn is the world's largest job search and networking platform with **900+ million** professionals. Research shows that **87% of recruiters** use LinkedIn for candidate searches.

## LinkedIn Profile Optimization

### 1. Profile Photo

**Should be professional:**
- High resolution
- Plain background
- Business attire
- Face clearly visible
- Smile professional and friendly

**Statistics:**
- Profiles with photos get **21% more views**
- Receive **36% more messages**

### 2. Cover Image

Your cover image should:
- Reflect your professional identity
- Align with your brand
- Be eye-catching but not overwhelming
- Ideally 1584x396 pixels

### 3. Headline

Your headline shouldn't just be your title:

**Wrong:**
"Software Developer"

**Right:**
"Senior Full-Stack Developer | React & Node.js | Open Source Contributor | 50K+ GitHub Stars"

**Tips:**
- Include key skills
- Highlight unique value
- Use 220 character limit
- Use emojis carefully

### 4. About Section

This section is your professional story:

**Structure:**
1. **Opening (2-3 sentences):** Who you are and what you do
2. **Experience:** Key achievements and experiences
3. **Passion:** What excites you
4. **CTA:** How people can reach you

**Example:**

\`\`\`
I'm a UX Designer specialized in user experience design for 7 years. I've managed 50+ projects from Fortune 500 companies to startups, increasing user satisfaction by an average of 40%.

Throughout my career, I've created user-centric designs for iOS, Android, and web platforms. My biggest achievement was redesigning the UX of a mobile app with 5M+ users, increasing usage by 200%.

I love accessible design and creating inclusive digital experiences. In my free time, I work as a mentor in design communities.

Contact me for collaborations or projects!
\`\`\`

### 5. Experience Section

For each position:

**Title:** Clear and descriptive
**Dates:** Start and end
**Description:**
- 3-5 bullet points
- Each bullet an achievement
- Quantifiable results
- Keywords

**Example:**

\`\`\`
Senior Product Manager | TechCorp
January 2020 - Present

• Led 3 cross-functional teams executing 5 major product launches
• Optimized product roadmap by analyzing user feedback, resulting in 35% satisfaction increase
• Implemented Agile methodology, accelerating product development process by 40%
• Designed and launched premium feature set generating $2M+ revenue increase
\`\`\`

### 6. Skills

**Strategic skill addition:**
- Place top 5 skills at the top
- Add industry-relevant keywords
- Request endorsements from colleagues
- Update regularly

**Tip:** You can add up to 50 skills on LinkedIn, but focus on the top 10-15.

### 7. Recommendations

- Request recommendations from colleagues
- Write mutual recommendations
- Get recommendations about specific projects
- Aim for at least 3-5 recommendations

## Content Strategy

### What Should You Share?

1. **Industry news and commentary**
2. **Your professional achievements**
3. **Lessons learned**
4. **Useful resources and articles**
5. **Event and conference experiences**

### Posting Frequency

- **Minimum:** 2-3 posts per week
- **Optimum:** 1 post or interaction daily
- **Maximum:** 2-3 posts per day (to avoid appearing spammy)

### Best Posting Times

**For US audiences:**
- Weekdays: 8-9 AM, 12-1 PM, 5-6 PM EST
- Most active days: Tuesday, Wednesday, Thursday

### Content Formats

**Formats with most engagement:**
1. **Document (Carousel):** 30% more engagement
2. **Video:** 20% more reach
3. **Image + Text:** Good engagement
4. **Text Only:** Ideal for authentic stories

## Networking Tips

### 1. Connection Requests

**Good connection message:**
\`\`\`
Hi [Name],

[Common ground / why you want to connect]. [How you found them on LinkedIn]. I'd love the opportunity to add you to my professional network.

Thanks,
[Your Name]
\`\`\`

### 2. Messaging

- Personalize your first message
- Offer value
- Don't sell directly
- Send follow-up messages

### 3. Groups and Events

- Join industry-related groups
- Actively participate in discussions
- Register for events
- Become visible by commenting

## LinkedIn SEO

### Keyword Optimization

Use keywords in these sections:
- Headline
- About
- Experience descriptions
- Skills
- Titles and certifications

### URL Customization

Default: \`linkedin.com/in/john-doe-123456789\`
Custom: \`linkedin.com/in/johndoe\`

## Is LinkedIn Premium Worth It?

### Free vs Premium

**Premium Benefits:**
- InMail credits
- Who viewed your profile (full list)
- "Featured Applicant" on job postings
- LinkedIn Learning access
- Advanced search filters

**Valuable For:**
- Active job seekers
- Freelancers and consultants
- Sales professionals
- Recruiters

## Rejectly LinkedIn Integration

With Rejectly:
- Sync your resume with LinkedIn profile
- Optimize your LinkedIn headline
- Enhance profile summary with AI
- Strategically organize skills

[Optimize your LinkedIn profile](/dashboard)

## Conclusion

LinkedIn is an essential part of modern career management. Optimizing your profile, sharing regular content, and active networking will significantly increase your career opportunities.

Remember: LinkedIn is a marathon, not a sprint. Be consistent and authentic!`,
      category_slug: 'career-advice',
      tags: ['linkedin', 'career-change', 'job-search'],
      published_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      reading_time_minutes: 15,
      featured_image: 'https://images.unsplash.com/photo-1611944212129-29977ae1398c?w=1200&h=630&fit=crop',
      featured_image_alt: 'LinkedIn profile screen',
    },
    {
      title: 'How to Find Remote Work: Complete Guide',
      slug: 'how-to-find-remote-work-jobs',
      excerpt: 'Make your remote work dreams come true. Best remote job platforms, application strategies, and home office setup tips.',
      content: `## The Remote Work Revolution

As of 2025, **35% of the global workforce** works fully or partially remotely. In the US, this rate is **22%** and rapidly growing.

## Benefits of Remote Work

### For Employees
- **Flexibility:** Set your own schedule
- **Savings:** Transportation and meal costs
- **Quality of Life:** More family time
- **Global Opportunities:** Work from anywhere in the world

### For Employers
- **Wide Talent Pool**
- **Cost reduction**
- **Higher productivity**
- **Employee satisfaction**

## Best Remote Job Platforms

### International Platforms

**1. We Work Remotely**
- Tech-focused
- 100+ new listings daily
- Free applications
- weworkremotely.com

**2. Remote.co**
- Quality job listings
- Company profiles
- Remote work resources
- remote.co

**3. FlexJobs**
- Verified listings
- Scam-free guarantee
- Paid membership ($14.95/month)
- flexjobs.com

**4. AngelList (Wellfound)**
- Startup jobs
- Equity information
- Direct contact with founders
- wellfound.com

**5. LinkedIn**
- Use "Remote" filter
- Largest professional network
- Direct applications

### Other Top Platforms

**1. Remote OK**
- Tech and design jobs
- Global opportunities
- remoteok.com

**2. Toptal**
- For freelance experts
- Selective admission process
- High-paying projects
- toptal.com

**3. Upwork**
- Freelance marketplace
- Project-based work
- Global clients
- upwork.com

## Remote Job Application Strategies

### 1. Resume and Portfolio Preparation

**For Resume:**
- Highlight remote work experience
- Show self-discipline and time management skills
- List remote work tools you use
- Emphasize async communication skills

**For Portfolio:**
- Create online portfolio
- Use platforms like GitHub/Behance
- Show concrete project results
- Add video presentations

### 2. Remote Work Skills

Employers look for:
- **Communication:** Written and verbal
- **Self-Motivation:** Ability to work without supervision
- **Technical Proficiency:** Tool usage
- **Time Management:** Meeting deadlines
- **Problem Solving:** Independent decision making

### 3. Application Process Considerations

**First Impression:**
- Make email signature professional
- Respond quickly (within 24 hours)
- Account for different time zones
- Test video call setup

**Video Interviews:**
- Good lighting
- Clean background
- Professional attire
- Stable internet connection
- Quiet environment

## Succeeding in Remote Work

### Home Office Setup

**Essential Equipment:**
- Ergonomic chair
- Adjustable desk
- Good laptop/desktop
- External monitor (preferred)
- Quality headset/microphone
- Fast internet (min. 25 Mbps)

**Environment:**
- Separate workspace
- Natural light
- Minimal distractions
- Good ventilation

### Time Management

**Techniques:**
- **Pomodoro:** 25 min work, 5 min break
- **Time Blocking:** Divide day into blocks
- **Eat the Frog:** Do hard task in morning
- **2-Minute Rule:** If under 2 min, do it now

**Tools:**
- Trello/Asana: Project management
- RescueTime: Time tracking
- Focus@Will: Focus music
- Forest: Reduce phone addiction

### Communication Tools

**Messaging:**
- Slack
- Microsoft Teams
- Discord (for tech teams)

**Video Conferencing:**
- Zoom
- Google Meet
- Microsoft Teams

**Project Management:**
- Jira
- Trello
- Asana
- ClickUp

**Document Sharing:**
- Google Workspace
- Notion
- Confluence

## Common Challenges and Solutions

### 1. Feeling Isolated

**Solutions:**
- Use co-working spaces
- Organize virtual coffee chats
- Attend local meetups
- Find online communities

### 2. Work-Life Balance

**Solutions:**
- Set clear working hours
- Have lunch outside
- Turn off evening notifications
- Make weekly plans

### 3. Loss of Motivation

**Solutions:**
- Set short-term goals
- Celebrate achievements
- Create routine
- Get accountability partner

## Remote Work and Taxes

### For US Workers

**Income from Foreign Companies:**
- Consult with tax advisor
- Report all income
- Understand tax brackets

**Important:**
- Declare income
- Know your tax brackets
- Consider self-employment tax

## Remote Job Applications with Rejectly

Rejectly's remote job features:
- CV optimization specific to remote positions
- Highlighting remote work skills
- Global ATS-compliant format
- Time-zone compatible application tracking

[Start applying for remote jobs](/dashboard)

## Conclusion

Remote work is no longer a luxury but a standard way of working. With the right tools, strategies, and mindset, you can work from anywhere in the world and improve both your career and quality of life.

Remember: Remote work success requires discipline and the right habits!`,
      category_slug: 'career-advice',
      tags: ['remote-work', 'job-search', 'career-change'],
      published_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      reading_time_minutes: 14,
      featured_image: 'https://images.unsplash.com/photo-1588196749597-9ff075ee6b5b?w=1200&h=630&fit=crop',
      featured_image_alt: 'Person working from home with laptop',
    },
    {
      title: 'Tech Interview Preparation: Algorithms, System Design, and Behavioral Questions',
      slug: 'tech-interview-preparation-guide',
      excerpt: 'How to prepare for FAANG and tech company interviews? Algorithm questions, system design, coding challenges, and behavioral interview tips.',
      content: `## The Tech Interview Process

Tech company interview processes typically consist of 4-6 stages:

1. **Phone Screening** (30-45 min)
2. **Technical Phone Interview** (45-60 min)
3. **Coding Challenge** (Take-home or live)
4. **Onsite/Virtual Interview** (3-5 hours, 4-6 rounds)
5. **Hiring Manager Discussion**
6. **Culture Fit/Behavioral**

## Algorithms and Data Structures

### Core Topics

**1. Data Structures:**
- Array and String
- Linked List
- Stack and Queue
- Hash Table
- Tree (Binary, BST, AVL)
- Heap
- Graph
- Trie

**2. Algorithms:**
- Searching (Binary Search, DFS, BFS)
- Sorting (Quick, Merge, Heap Sort)
- Dynamic Programming
- Greedy Algorithms
- Backtracking
- Divide and Conquer

### Study Strategy

**Weekly Plan (8 Weeks):**

**Week 1-2: Basic Data Structures**
- Array/String: 15 problems
- Linked List: 10 problems
- Stack/Queue: 10 problems

**Week 3-4: Trees and Graphs**
- Binary Tree: 15 problems
- Binary Search Tree: 10 problems
- Graph: 15 problems

**Week 5-6: Dynamic Programming**
- 1D DP: 10 problems
- 2D DP: 10 problems
- Advanced DP: 5 problems

**Week 7: Greedy and Backtracking**
- Greedy: 10 problems
- Backtracking: 10 problems

**Week 8: Mock Interviews and Review**
- Review all topics
- Mock interviews
- Study weak points

### Best Resources

**Problem Platforms:**
- **LeetCode:** 75 question list (Blind 75)
- **HackerRank:** Interview preparation kit
- **CodeSignal:** Company-specific tracks
- **AlgoExpert:** Comprehensive explained solutions

**Books:**
- "Cracking the Coding Interview" - Gayle McDowell
- "Elements of Programming Interviews" - Aziz, Lee, Prakash
- "Introduction to Algorithms" - CLRS (For reference)

### Problem-Solving Approach

**UMPIRE Framework:**

1. **Understand:** Understand the problem
   - What are inputs?
   - What are outputs?
   - What are edge cases?

2. **Match:** Pattern matching
   - Which data structure?
   - Have you seen similar problems?

3. **Plan:** Plan solution
   - Write pseudocode
   - Calculate complexity

4. **Implement:** Write code
   - Clean and readable
   - Descriptive variable names

5. **Review:** Check
   - Test edge cases
   - Any syntax errors?

6. **Evaluate:** Assess
   - Time complexity: O(?)
   - Space complexity: O(?)
   - Can it be optimized?

## System Design Interview

### Common Questions

1. Design URL Shortener (TinyURL)
2. Twitter/X-like social platform
3. YouTube-like video platform
4. WhatsApp-like messaging app
5. Uber/Lyft-like ride-sharing app
6. Design Rate Limiter
7. Design Web Crawler
8. Design Notification System

### System Design Approach

**1. Requirements Clarification (5 min)**
- Functional requirements
- Non-functional requirements
- User count, scale
- Read vs Write ratio

**2. Back-of-envelope Estimation (5 min)**
- QPS (Queries per second)
- Storage needs
- Bandwidth
- Memory/Cache

**3. High-level Design (10-15 min)**
- API design
- Database schema
- Core components
- System flow

**4. Deep Dive (15-20 min)**
- Scaling strategies
- Solving bottlenecks
- Caching strategy
- Load balancing

**5. Wrap Up (5 min)**
- Discuss trade-offs
- Monitoring and alerting
- Deployment strategy

### Key Concepts

**Scalability:**
- Horizontal vs Vertical scaling
- Load balancing
- Caching (Redis, Memcached)
- CDN
- Database sharding
- Microservices

**Reliability:**
- Replication
- Failover
- Backup strategies

**Performance:**
- Indexing
- Caching layers
- Async processing
- Message queues

### Resources

- **Grokking the System Design Interview** (educative.io)
- **System Design Primer** (GitHub)
- **Designing Data-Intensive Applications** - Martin Kleppmann
- **ByteByteGo** YouTube channel

## Behavioral Interview

### STAR Method

**S**ituation: The situation
**T**ask: The task
**A**ction: The action
**R**esult: The result

### Common Questions and Example Answers

**1. "Tell me about a time you had a conflict with a teammate"**

**STAR Answer:**
\`\`\`
Situation: At my previous company, I had a disagreement with a senior developer about the implementation approach for a feature.

Task: We needed to find the best technical solution without missing the deadline.

Action:
- We documented both approaches in detail
- Created pros/cons lists
- Presented to tech lead for objective input
- Eventually developed a hybrid approach

Result: We met the deadline and created a 30% more performant solution by combining both approaches. This experience taught me the value of different perspectives.
\`\`\`

**2. "Tell me about your biggest failure"**

**Good Answer Structure:**
- Choose a real failure
- Accept responsibility
- Emphasize what you learned
- Show how you improved

**3. "Why do you want to work here?"**

**Preparation:**
- Research company culture
- Use their products
- Read tech blog
- Follow recent news

### 10 Questions to Prepare

1. Tell me about yourself
2. Why this company?
3. Biggest strength/weakness
4. Conflict resolution
5. Leadership experience
6. Failure and learning
7. Challenging project
8. Tight deadline experience
9. Disagreement with manager
10. Questions for interviewer

## Mock Interviews

### Platforms

- **Pramp:** Free peer mock interviews
- **interviewing.io:** Anonymous interviews
- **Gainlo:** Experienced interviewers
- **Exponent:** System design focus

### Mock Interview with Friend

**Tips:**
- Treat like real interview
- Allocate 45-60 min
- Use real problems
- Give and receive feedback
- Record (with permission)

## Interview Day Tips

### Before (1 Day)

- Sleep early
- Don't study stressful topics
- Test equipment
- Prepare notes
- Final company review

### During Interview

**Do:**
- Think out loud
- Ask questions
- Request clarification
- Consider test cases
- Discuss trade-offs

**Don't:**
- Don't start coding immediately
- Don't stay silent
- Don't say "I don't know" and move on
- Don't be defensive
- Don't refuse hints

### After

- Send thank you email (within 24 hours)
- Ask about follow-up timeline
- Write your notes
- Evaluate what you did well/poorly

## Red Flags - What to Avoid

**While Coding:**
- Variable names: a, b, c
- Global variables
- Hard-coded values
- No error handling
- No edge case tests

**In Communication:**
- Arrogant behavior
- Refusing hints
- Being closed to feedback
- Turning interview into monolog

## Interview Prep with Rejectly

With Rejectly:
- Company-specific CV optimization
- Position-based skill highlighting
- Success story creation with STAR method
- Mock interview question preparation

[Start interview preparation](/dashboard)

## Conclusion

Tech interview preparation is a marathon, not a sprint. Regular practice, mock interviews, and solving real problems guarantee success.

**Average Prep Time:**
- Entry-level: 2-3 months
- Mid-level: 1-2 months
- Senior: 3-4 weeks

Remember: Every failed interview is a learning opportunity. Keep going!`,
      category_slug: 'interview-prep',
      tags: ['tech-industry', 'job-search'],
      published_at: new Date().toISOString(),
      reading_time_minutes: 18,
      featured_image: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=1200&h=630&fit=crop',
      featured_image_alt: 'Software developer coding',
    },
  ];

  for (const post of posts) {
    try {
      // Get category
      const { data: category } = await supabase
        .from('blog_categories')
        .select('id')
        .eq('slug', post.category_slug)
        .single();

      if (!category) {
        console.log(`❌ Category not found: ${post.category_slug}`);
        continue;
      }

      // Get tags
      const { data: tags } = await supabase
        .from('blog_tags')
        .select('id, slug')
        .in('slug', post.tags);

      // Check if post already exists
      const { data: existing } = await supabase
        .from('blog_posts')
        .select('id')
        .eq('slug', post.slug)
        .single();

      if (existing) {
        console.log(`ℹ️  Post already exists: ${post.title}`);
        continue;
      }

      // Insert post
      const { data: newPost, error: postError } = await supabase
        .from('blog_posts')
        .insert({
          title: post.title,
          slug: post.slug,
          excerpt: post.excerpt,
          content: post.content,
          category_id: category.id,
          author_name: 'Rejectly Team',
          is_published: true,
          published_at: post.published_at,
          reading_time_minutes: post.reading_time_minutes,
          meta_title: `${post.title} | Rejectly`,
          meta_description: post.excerpt,
          featured_image: post.featured_image,
          featured_image_alt: post.featured_image_alt,
        })
        .select()
        .single();

      if (postError) {
        console.log(`❌ Error inserting post: ${post.title}`, postError.message);
        continue;
      }

      // Insert post tags
      if (tags && tags.length > 0) {
        const postTags = tags.map(tag => ({
          post_id: newPost.id,
          tag_id: tag.id,
        }));

        await supabase.from('blog_post_tags').insert(postTags);
      }

      console.log(`✅ Added: ${post.title}`);
    } catch (error) {
      console.log(`❌ Error processing post: ${post.title}`, error.message);
    }
  }

  // Verify
  const { data: allPosts, count } = await supabase
    .from('blog_posts')
    .select('title', { count: 'exact' })
    .eq('is_published', true);

  console.log(`\n✨ Migration complete! Total published English posts: ${count}`);
  console.log('\n📚 Published posts:');
  allPosts.forEach(p => console.log(`  - ${p.title}`));
}

addEnglishPosts().catch(console.error);
