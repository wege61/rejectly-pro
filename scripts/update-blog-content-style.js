require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

async function updateBlogContent() {
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

  console.log('✍️  Updating blog content to match original style...\n');

  const updates = [
    {
      slug: 'perfect-resume-guide-2025',
      content: `## Why Your Resume Matters

Your resume is your first point of contact with potential employers. Research shows that hiring managers spend an average of only **6 seconds** reviewing a resume. You need to make a strong impression in that brief window.

## Essential Resume Sections

A well-structured resume should include these key sections:

- **Contact Information**: Name, phone, professional email, LinkedIn profile, location
- **Professional Summary**: 2-3 sentences highlighting your key skills and career objectives
- **Work Experience**: Company name, job title, dates, and bullet-pointed achievements
- **Education**: University name, degree, graduation year, honors
- **Skills**: Technical skills, languages, certifications

## Making Your Resume ATS-Friendly

Most modern companies use **ATS (Applicant Tracking Systems)**. Research shows that **75% of resumes** never reach human eyes due to ATS filtering.

To pass ATS screening:
- Use standard section headings (Experience, Education, Skills)
- Choose simple, single-column layouts
- Avoid graphics and complex formatting
- Include keywords from the job description
- Save as PDF or DOCX format

## Quantify Your Achievements

Numbers speak louder than words. Compare these examples:

**Bad**: "Managed sales team"
**Good**: "Led 10-person sales team, increasing annual sales by 35%"

**Bad**: "Improved customer satisfaction"
**Good**: "Reduced customer complaints by 60% in 6 months, raising satisfaction score to 4.8/5"

## Common Resume Mistakes

Avoid these critical errors:

### Length Issues
- New graduates: 1 page
- Mid-level (3-10 years): 1-2 pages
- Senior/Executive: 2-3 pages

### Too Much Personal Info
Don't include: date of birth, marital status, photo (in most countries), social security number

### Generic Statements
Skip vague phrases like "team player" or "fast learner". Provide concrete examples instead.

### Typos
Proofread at least 3 times and have someone else review your resume.

## Optimize with Rejectly

Rejectly analyzes your resume with AI to:
- Show job posting compatibility score
- Identify missing keywords
- Evaluate ATS compliance
- Provide personalized improvement suggestions
- Generate optimized resume versions

[Get free resume analysis](/dashboard)

## Final Tips

Remember: Your resume is your professional story. Keep it updated, customize for each application, and focus on achievements rather than just responsibilities. The best resume is one that passes ATS filters AND impresses human readers.`
    },
    {
      slug: 'how-to-write-compelling-cover-letter',
      content: `## What is a Cover Letter?

A cover letter is a formal document you send with your resume, introducing yourself and explaining why you're the perfect fit for the position. Research shows that candidates who send cover letters have a **40% higher chance** of being called for interviews.

## Cover Letter Structure

### Header
Include your contact information and date:
- Your Name
- Email Address
- Phone Number
- Date

### Opening Paragraph

Make it attention-grabbing, not generic.

**Bad**: "I am applying for the X position."
**Good**: "My 5 years of digital marketing experience and 150% ROI increase in campaigns I managed last year make me the ideal candidate for your Marketing Manager position."

### Body Paragraphs

**Why This Position?**
- Show you've researched the company
- Align with company values
- Explain your genuine interest

**Why You?**
- Share concrete achievements
- Match job requirements
- Highlight unique skills

### Closing

- Request an interview
- Express gratitude
- Professional sign-off

## Cover Letter Best Practices

### DO:
- Personalize for each application
- Use specific numbers and metrics
- Show enthusiasm for the role
- Keep it to one page (3-4 paragraphs)

### DON'T:
- Use generic templates
- Repeat your resume
- Write more than one page
- Criticize previous employers

## Industry-Specific Examples

### Tech Industry
Focus on: technical skills, projects, GitHub contributions, problem-solving abilities

### Marketing
Highlight: campaign results, platforms used, ROI metrics, creativity

### Finance
Emphasize: certifications (CFA, CPA), financial results, compliance experience, analytical skills

## Common Mistakes to Avoid

**Generic Salutations**
Use hiring manager's name instead of "Dear Hiring Manager"

**Too Long**
Keep it concise and focused - every word should count

**Repeating Resume**
Add new information and tell your unique story

**Typos and Errors**
Proofread carefully - errors suggest lack of attention to detail

## Create Cover Letters with Rejectly

Rejectly's AI-powered cover letter generator:
- Generates letters tailored to your resume and job posting
- Provides personalized content suggestions
- Ensures ATS-compliant formatting
- Offers different tone and style options

[Start creating cover letters now](/cover-letters)

## Key Takeaway

An effective cover letter distinguishes you from other candidates. Invest time in writing a personalized, compelling letter that showcases both your qualifications and your communication skills.`
    },
    {
      slug: 'linkedin-profile-optimization-guide',
      content: `## Why LinkedIn Matters

LinkedIn is the world's largest professional networking platform with **900+ million** professionals. Research shows that **87% of recruiters** use LinkedIn for candidate searches.

## Profile Photo

Your profile photo is crucial:
- Use high-resolution, professional image
- Dress in business attire
- Choose plain background
- Smile naturally

**Impact**: Profiles with photos get **21% more views** and **36% more messages**.

## Headline Optimization

Don't just list your job title. Make it compelling:

**Bad**: "Software Developer"
**Good**: "Senior Full-Stack Developer | React & Node.js | Open Source Contributor | 50K+ GitHub Stars"

Use all 220 characters to include key skills and unique value propositions.

## About Section

This is your professional story. Structure it effectively:

1. **Opening** (2-3 sentences): Who you are and what you do
2. **Experience**: Key achievements and expertise
3. **Passion**: What drives you professionally
4. **Call to Action**: How to connect

Keep it conversational yet professional, and include relevant keywords for search optimization.

## Work Experience

For each position, include:
- Clear, descriptive title
- Employment dates
- 3-5 bullet points focusing on achievements
- Quantifiable results
- Industry keywords

**Example**:
"Led 10-person team, increasing revenue by 35% through implementation of new sales strategy and process optimization."

## Skills Section

**Strategic approach**:
- Place top 5 skills at the beginning
- Include industry-relevant keywords
- Request endorsements from colleagues
- Update regularly based on career goals

You can add up to 50 skills, but focus on the top 10-15 most relevant ones.

## Content Strategy

### What to Share
- Industry news and insights
- Professional achievements
- Lessons learned
- Useful resources
- Event experiences

### Posting Frequency
- Minimum: 2-3 posts per week
- Optimum: Daily engagement
- Maximum: 2-3 posts per day

### Best Formats
1. **Document/Carousel**: 30% more engagement
2. **Video**: 20% more reach
3. **Image + Text**: Strong engagement
4. **Text Only**: Great for authentic stories

## Networking Tips

### Connection Requests
Always personalize your message:

"Hi [Name], I noticed we both work in [industry/field]. I'd love to connect and learn from your experience in [specific area]."

### Engagement
- Comment thoughtfully on others' posts
- Share relevant content
- Join industry groups
- Attend LinkedIn events

## LinkedIn SEO

Optimize these sections with keywords:
- Headline
- About section
- Experience descriptions
- Skills
- Certifications

Also, customize your LinkedIn URL from the default random numbers to: linkedin.com/in/yourname

## Is LinkedIn Premium Worth It?

**Premium Benefits**:
- InMail credits
- Full "Who Viewed Your Profile" list
- "Featured Applicant" status on job postings
- LinkedIn Learning access
- Advanced search filters

**Best for**: Active job seekers, freelancers, sales professionals, and recruiters.

## Optimize with Rejectly

With Rejectly, you can:
- Sync your resume with LinkedIn profile
- Optimize your headline with AI
- Enhance profile summary
- Strategically organize skills

[Optimize your LinkedIn profile](/dashboard)

## Final Thoughts

LinkedIn is essential for modern career management. Optimize your profile, share regularly, and actively network. Remember: LinkedIn success requires consistency and authenticity, not perfection.`
    },
    {
      slug: 'how-to-find-remote-work-jobs',
      content: `## The Remote Work Revolution

As of 2025, **35% of the global workforce** works remotely (fully or partially). This number continues to grow as companies embrace flexible work arrangements.

## Benefits of Remote Work

**For Employees**:
- Flexible schedule
- Save on commute and meals
- Better work-life balance
- Access to global opportunities

**For Employers**:
- Wider talent pool
- Reduced overhead costs
- Higher productivity
- Improved employee satisfaction

## Top Remote Job Platforms

### International Platforms

**We Work Remotely**
- Tech-focused opportunities
- 100+ new listings daily
- Free to apply
- weworkremotely.com

**FlexJobs**
- Verified, scam-free listings
- Quality job postings
- $14.95/month subscription
- flexjobs.com

**Remote.co**
- Curated remote positions
- Company profiles
- Free resources
- remote.co

**LinkedIn**
- Use "Remote" filter in job search
- Largest professional network
- Direct applications possible

**Toptal**
- For expert freelancers
- Selective admission
- High-paying projects
- toptal.com

## Application Strategies

### Resume Preparation
Highlight:
- Previous remote work experience
- Self-discipline and time management
- Remote collaboration tools (Slack, Zoom, Asana)
- Async communication skills

### Required Skills
Employers look for:
- **Communication**: Strong written and verbal skills
- **Self-Motivation**: Work independently without supervision
- **Technical Skills**: Comfortable with digital tools
- **Time Management**: Meet deadlines consistently
- **Problem Solving**: Independent decision-making

### Interview Tips
For video interviews:
- Test equipment beforehand
- Ensure good lighting and clean background
- Dress professionally
- Stable internet connection
- Quiet environment

## Home Office Setup

### Essential Equipment
- Ergonomic chair
- Adjustable desk
- Reliable laptop/desktop
- External monitor (recommended)
- Quality headset/microphone
- Fast internet (min. 25 Mbps)

### Ideal Environment
- Dedicated workspace
- Natural lighting
- Minimal distractions
- Good ventilation

## Time Management Tools

**Productivity Techniques**:
- **Pomodoro**: 25 min work, 5 min break
- **Time Blocking**: Schedule your day in blocks
- **Eat the Frog**: Tackle hardest task first
- **2-Minute Rule**: If under 2 minutes, do it now

**Recommended Tools**:
- Trello/Asana: Project management
- RescueTime: Time tracking
- Slack: Team communication
- Zoom: Video conferencing

## Common Challenges

### Isolation
**Solutions**: Use co-working spaces, join online communities, attend local meetups

### Work-Life Balance
**Solutions**: Set clear working hours, take regular breaks, turn off notifications after work

### Motivation
**Solutions**: Set short-term goals, celebrate wins, create routines, find accountability partners

## Remote Work Success with Rejectly

Rejectly helps with:
- CV optimization for remote positions
- Highlighting remote-work skills
- ATS-compliant formatting
- Application tracking across time zones

[Start applying for remote jobs](/dashboard)

## Conclusion

Remote work offers incredible opportunities for flexibility and global career growth. With the right preparation, tools, and mindset, you can successfully transition to remote work and enjoy its many benefits.`
    },
    {
      slug: 'tech-interview-preparation-guide',
      content: `## The Tech Interview Process

Tech company interviews typically consist of 4-6 stages:

1. **Phone Screening** (30-45 min)
2. **Technical Phone Interview** (45-60 min)
3. **Coding Challenge** (Take-home or live)
4. **Onsite/Virtual Interview** (3-5 hours, 4-6 rounds)
5. **Hiring Manager Discussion**
6. **Culture Fit/Behavioral**

## Data Structures & Algorithms

### Core Topics

**Data Structures**:
- Arrays and Strings
- Linked Lists
- Stacks and Queues
- Hash Tables
- Trees (Binary, BST, AVL)
- Heaps
- Graphs
- Tries

**Algorithms**:
- Searching (Binary Search, DFS, BFS)
- Sorting (Quick, Merge, Heap Sort)
- Dynamic Programming
- Greedy Algorithms
- Backtracking
- Divide and Conquer

### Study Plan (8 Weeks)

**Weeks 1-2**: Array/String (15 problems), Linked List (10), Stack/Queue (10)
**Weeks 3-4**: Trees (15 problems), BST (10), Graph (15)
**Weeks 5-6**: Dynamic Programming - 1D (10), 2D (10), Advanced (5)
**Week 7**: Greedy (10), Backtracking (10)
**Week 8**: Mock interviews and review

### Best Resources

- **LeetCode**: Blind 75 question list
- **HackerRank**: Interview preparation kit
- **AlgoExpert**: Comprehensive solutions
- **Books**: "Cracking the Coding Interview" by Gayle McDowell

## Problem-Solving Framework

**UMPIRE Method**:

1. **Understand**: Clarify inputs, outputs, edge cases
2. **Match**: Identify patterns and data structures
3. **Plan**: Write pseudocode, calculate complexity
4. **Implement**: Write clean, readable code
5. **Review**: Test edge cases, check syntax
6. **Evaluate**: Analyze time/space complexity, optimize

## System Design Interview

### Common Questions
- Design URL Shortener (TinyURL)
- Design Twitter/X
- Design YouTube
- Design WhatsApp
- Design Uber/Lyft
- Design Rate Limiter

### Approach

1. **Requirements** (5 min): Functional vs non-functional, scale, users
2. **Estimation** (5 min): QPS, storage, bandwidth, cache
3. **High-Level Design** (10-15 min): API, database, components
4. **Deep Dive** (15-20 min): Scaling, bottlenecks, caching, load balancing
5. **Wrap-Up** (5 min): Trade-offs, monitoring, deployment

### Key Concepts
- **Scalability**: Horizontal/vertical scaling, load balancing, caching, CDN, sharding
- **Reliability**: Replication, failover, backups
- **Performance**: Indexing, caching, async processing, message queues

**Resources**: Grokking System Design, System Design Primer (GitHub), "Designing Data-Intensive Applications"

## Behavioral Interview

### STAR Method

**S**ituation: Set the context
**T**ask: Describe your responsibility
**A**ction: Explain what you did
**R**esult: Share the outcome

### Common Questions

1. Tell me about yourself
2. Why this company?
3. Biggest strength/weakness
4. Conflict resolution example
5. Leadership experience
6. Failure and learning
7. Challenging project
8. Tight deadline experience
9. Disagreement with manager
10. Questions for interviewer

### Preparation Tips
- Research company culture thoroughly
- Use their products
- Read tech blog
- Follow recent news
- Prepare questions to ask

## Mock Interviews

**Platforms**:
- **Pramp**: Free peer interviews
- **interviewing.io**: Anonymous practice
- **Gainlo**: Experienced interviewers
- **Exponent**: System design focused

## Interview Day Tips

**Before**:
- Sleep well
- Test equipment
- Review notes
- Do final company research

**During**:
- Think out loud
- Ask clarifying questions
- Discuss trade-offs
- Accept hints gracefully

**After**:
- Send thank-you email (within 24 hours)
- Take notes on what went well/poorly
- Follow up on timeline

## Prepare with Rejectly

Rejectly helps with:
- Company-specific CV optimization
- Skill highlighting for positions
- STAR method story creation
- Mock interview question prep

[Start interview preparation](/dashboard)

## Final Thoughts

Tech interview prep is a marathon, not a sprint. Consistent practice, mock interviews, and learning from failures are key to success.

**Average Prep Time**:
- Entry-level: 2-3 months
- Mid-level: 1-2 months
- Senior: 3-4 weeks

Remember: Every interview is a learning opportunity!`
    }
  ];

  for (const update of updates) {
    try {
      const { error } = await supabase
        .from('blog_posts')
        .update({ content: update.content })
        .eq('slug', update.slug);

      if (error) {
        console.log(`❌ Error updating ${update.slug}:`, error.message);
      } else {
        console.log(`✅ Updated: ${update.slug}`);
      }
    } catch (error) {
      console.log(`❌ Error processing ${update.slug}:`, error.message);
    }
  }

  console.log('\n✨ All blog posts updated to match original style!');
}

updateBlogContent().catch(console.error);
