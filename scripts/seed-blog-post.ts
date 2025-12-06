import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { resolve } from 'path';

// Load .env.local
dotenv.config({ path: resolve(__dirname, '../.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function seedBlogPost() {
  console.log('Seeding sample blog post...');

  // First, ensure categories exist
  console.log('Ensuring categories exist...');
  const { error: catError } = await supabase
    .from('blog_categories')
    .upsert([
      { name: 'Resume Tips', slug: 'resume-tips', description: 'Expert advice on crafting the perfect resume' },
      { name: 'Career Advice', slug: 'career-advice', description: 'Guidance for career growth and job searching' },
      { name: 'ATS Optimization', slug: 'ats-optimization', description: 'Tips for passing Applicant Tracking Systems' },
      { name: 'Interview Prep', slug: 'interview-prep', description: 'Prepare for your next job interview' },
      { name: 'Industry Insights', slug: 'industry-insights', description: 'Trends and news from various industries' },
    ], { onConflict: 'slug' });

  if (catError) {
    console.error('Error creating categories:', catError);
    return;
  }

  // Ensure tags exist
  console.log('Ensuring tags exist...');
  const { error: tagError } = await supabase
    .from('blog_tags')
    .upsert([
      { name: 'Resume', slug: 'resume' },
      { name: 'Cover Letter', slug: 'cover-letter' },
      { name: 'ATS', slug: 'ats' },
      { name: 'Job Search', slug: 'job-search' },
      { name: 'Career Change', slug: 'career-change' },
      { name: 'Remote Work', slug: 'remote-work' },
      { name: 'Tech Industry', slug: 'tech-industry' },
      { name: 'Entry Level', slug: 'entry-level' },
      { name: 'Executive', slug: 'executive' },
      { name: 'LinkedIn', slug: 'linkedin' },
    ], { onConflict: 'slug' });

  if (tagError) {
    console.error('Error creating tags:', tagError);
    return;
  }

  // Get category ID for 'ATS Optimization'
  const { data: category } = await supabase
    .from('blog_categories')
    .select('id')
    .eq('slug', 'ats-optimization')
    .single();

  if (!category) {
    console.error('Category not found!');
    return;
  }

  // Get tag IDs
  const { data: tags } = await supabase
    .from('blog_tags')
    .select('id, slug')
    .in('slug', ['resume', 'ats', 'job-search']);

  const blogPost = {
    title: 'What is ATS? Understanding Why Your Resume Gets Rejected',
    slug: 'what-is-ats-why-resume-gets-rejected',
    excerpt: 'Wondering why your job applications never get a response? ATS (Applicant Tracking Systems) might be filtering out your resume before human eyes ever see it. Learn how these systems work and how to beat them.',
    content: `## What is ATS?

ATS (Applicant Tracking System) is software that companies use to manage job applications. **99% of Fortune 500 companies** and **75% of mid-sized companies** use an ATS.

These systems:
- Automatically scan and score your resume
- Filter candidates based on keywords
- Present the most qualified applicants to employers

### Why Does This Matter?

Research shows that approximately **75% of resumes** are rejected without ever being seen by a human. The main reason? ATS systems flag these resumes as "not a match."

## Why ATS Rejects Your Resume

### 1. Wrong File Format

ATS systems struggle to read certain file formats:

- **PDF**: Supported by most ATS, but some older systems have issues
- **DOCX**: The safest format
- **Image-heavy designs**: ATS can't read these at all!

### 2. Missing Keywords

Keyword matching between the job posting and your resume is critical. For example:

- If the job requires "project management," that term should be in your resume
- Writing "JS" instead of "JavaScript" can lower your match rate
- Industry jargon and abbreviations should be used carefully

### 3. Complex Design

- Tables and columns can confuse ATS
- Graphics and icons are unreadable
- Custom fonts may cause issues
- Headers and footers are sometimes skipped

### 4. Missing Contact Information

ATS automatically extracts your basic contact info:
- Email address
- Phone number
- Location

If any of these are missing, your application might be filtered out.

## 5 Golden Rules to Pass the ATS

### 1. Use a Clean, Simple Format

Choose a single-column, clean design. Avoid unnecessary graphics.

### 2. Analyze the Job Posting

Identify keywords in each job posting and naturally incorporate them into your resume.

### 3. Use Standard Section Headers

Stick to standard headers:
- "Work Experience" or "Professional Experience"
- "Education"
- "Skills"

### 4. Add Measurable Achievements

Concrete numbers like "Increased sales by 30%" impress both ATS and human readers.

### 5. Customize for Each Application

Don't send the same resume everywhere. Tailor it for each job posting.

## ATS Check with Rejectly

Rejectly analyzes your resume against job postings and:

- Provides an **ATS compatibility score**
- Lists **missing keywords**
- Offers **improvement suggestions**
- Generates an **optimized resume**

Want to know if your resume passes the ATS test? [Get your free analysis](/dashboard) now.

## Conclusion

Understanding ATS systems is essential in the modern job search process. By making your resume ATS-friendly, you can significantly increase your chances of getting past the digital gatekeepers and into human hands.

Remember: The best resume is one that passes the ATS AND impresses humans.`,
    featured_image: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=1200&h=630&fit=crop',
    featured_image_alt: 'Person working on resume on laptop',
    category_id: category.id,
    author_name: 'Rejectly Team',
    is_published: true,
    published_at: new Date().toISOString(),
    reading_time_minutes: 8,
    meta_title: 'What is ATS? Why Your Resume Gets Rejected | Rejectly',
    meta_description: 'Learn what ATS (Applicant Tracking Systems) are and why they reject your resume. Discover how to optimize your resume to pass ATS screening and land more interviews.',
    meta_keywords: ['ats', 'applicant tracking system', 'resume', 'cv', 'job application', 'resume optimization'],
  };

  // Delete old Turkish post if exists
  await supabase
    .from('blog_posts')
    .delete()
    .eq('slug', 'ats-nedir-ozgecmis-reddedilme-nedenleri');

  // Insert or update the first blog post
  const { data: post1, error: postError1 } = await supabase
    .from('blog_posts')
    .upsert(blogPost, { onConflict: 'slug' })
    .select()
    .single();

  if (postError1) {
    console.error('Error inserting post 1:', postError1);
    return;
  }

  console.log('Blog post 1 created/updated:', post1.id);

  // Add tags to the first post
  if (tags && tags.length > 0) {
    const postTags = tags.map(tag => ({
      post_id: post1.id,
      tag_id: tag.id,
    }));

    await supabase
      .from('blog_post_tags')
      .upsert(postTags, { onConflict: 'post_id,tag_id' });
  }

  // Get category ID for 'Resume Tips'
  const { data: resumeCategory } = await supabase
    .from('blog_categories')
    .select('id')
    .eq('slug', 'resume-tips')
    .single();

  // Get tags for second post
  const { data: tags2 } = await supabase
    .from('blog_tags')
    .select('id, slug')
    .in('slug', ['resume', 'job-search', 'entry-level']);

  // Second blog post - Resume Tips category
  const blogPost2 = {
    title: '10 Resume Mistakes That Are Costing You Job Interviews',
    slug: '10-resume-mistakes-costing-job-interviews',
    excerpt: 'Your resume might be sabotaging your job search without you knowing it. Discover the most common resume mistakes and learn how to fix them to land more interviews.',
    content: `## Introduction

You've sent out dozens of resumes but aren't getting callbacks. Sound familiar? The problem might not be your qualifications—it could be your resume itself.

After analyzing thousands of resumes, we've identified the most common mistakes that prevent qualified candidates from landing interviews. Here's what you need to know.

## The Top 10 Resume Mistakes

### 1. Using a Generic Resume for Every Application

**The Problem:** Sending the same resume to every job posting signals that you haven't read the job description carefully.

**The Fix:** Customize your resume for each position. Mirror the language used in the job posting and highlight relevant experience.

### 2. Including an Objective Statement Instead of a Summary

**The Problem:** Objective statements are outdated and focus on what YOU want, not what you offer.

**The Fix:** Replace it with a professional summary that highlights your key achievements and value proposition in 2-3 sentences.

### 3. Listing Duties Instead of Achievements

**The Problem:** "Responsible for managing a team" tells employers nothing about your impact.

**The Fix:** Use the STAR method and quantify results. "Led a team of 8 developers, delivering projects 20% under budget and 15% ahead of schedule."

### 4. Poor Formatting and Design

**The Problem:** Cluttered layouts, inconsistent fonts, and walls of text make your resume hard to read.

**The Fix:**
- Use consistent formatting throughout
- Include plenty of white space
- Stick to 1-2 professional fonts
- Use bullet points for easy scanning

### 5. Including Irrelevant Information

**The Problem:** Your high school job at a pizza shop probably isn't relevant to your software engineering application.

**The Fix:** Only include experience relevant to the position. For most professionals, focus on the last 10-15 years of experience.

### 6. Typos and Grammatical Errors

**The Problem:** Even small errors signal carelessness and poor attention to detail.

**The Fix:**
- Use spell-check tools
- Read your resume backward to catch errors
- Have someone else proofread it
- Read it out loud

### 7. Making It Too Long (or Too Short)

**The Problem:** A 4-page resume is overwhelming; a half-page resume looks inexperienced.

**The Fix:**
- Entry-level: 1 page
- Mid-career: 1-2 pages
- Executive/Academic: 2-3 pages

### 8. Using an Unprofessional Email Address

**The Problem:** partyanimal2000@email.com doesn't exactly scream "hire me."

**The Fix:** Create a professional email using your name: firstname.lastname@email.com

### 9. Forgetting to Include Keywords

**The Problem:** Without the right keywords, your resume won't pass ATS screening.

**The Fix:** Carefully read the job posting and include relevant keywords naturally throughout your resume. Use tools like Rejectly to identify missing keywords.

### 10. Including Personal Information You Shouldn't

**The Problem:** Adding age, marital status, or a photo can lead to unconscious bias (and isn't expected in most countries).

**The Fix:** Stick to professional information: name, location (city/state), phone, email, and LinkedIn URL.

## How to Fix Your Resume Today

1. **Audit your current resume** against this checklist
2. **Rewrite your bullet points** to focus on achievements with numbers
3. **Tailor your resume** for your target role
4. **Run it through an ATS checker** like Rejectly to identify issues
5. **Get feedback** from someone in your industry

## Use Rejectly for Instant Feedback

Not sure if your resume makes these mistakes? [Upload your resume to Rejectly](/dashboard) and get instant feedback on:

- ATS compatibility issues
- Missing keywords for your target jobs
- Formatting problems
- Suggestions for improvement

## Conclusion

Your resume is often your first impression with an employer. By avoiding these common mistakes, you can dramatically increase your chances of landing interviews.

Remember: A great resume doesn't just list your experience—it tells the story of your professional value.`,
    featured_image: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=1200&h=630&fit=crop',
    featured_image_alt: 'Person reviewing documents at desk',
    category_id: resumeCategory?.id,
    author_name: 'Rejectly Team',
    is_published: true,
    published_at: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
    reading_time_minutes: 10,
    meta_title: '10 Resume Mistakes Costing You Interviews | Rejectly',
    meta_description: 'Discover the top 10 resume mistakes that prevent qualified candidates from landing job interviews. Learn how to fix them and get more callbacks.',
    meta_keywords: ['resume mistakes', 'resume tips', 'job interview', 'resume writing', 'career advice'],
  };

  // Insert second blog post
  const { data: post2, error: postError2 } = await supabase
    .from('blog_posts')
    .upsert(blogPost2, { onConflict: 'slug' })
    .select()
    .single();

  if (postError2) {
    console.error('Error inserting post 2:', postError2);
    return;
  }

  console.log('Blog post 2 created/updated:', post2.id);

  // Add tags to the second post
  if (tags2 && tags2.length > 0) {
    const postTags2 = tags2.map(tag => ({
      post_id: post2.id,
      tag_id: tag.id,
    }));

    await supabase
      .from('blog_post_tags')
      .upsert(postTags2, { onConflict: 'post_id,tag_id' });
  }

  console.log('\nBlog posts seeded successfully!');
  console.log('Post 1:', `/blog/${blogPost.slug}`);
  console.log('Post 2:', `/blog/${blogPost2.slug}`);
}

seedBlogPost().catch(console.error);
