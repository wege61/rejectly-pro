require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

async function fixBlogOrganization() {
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

  console.log('🎨 Improving blog organization...\n');

  // Update featured images and meta data for better organization
  const updates = [
    {
      slug: 'perfect-resume-guide-2025',
      featured_image: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=1200&h=630&fit=crop&q=80',
      featured_image_alt: 'Professional resume template on desk with laptop',
      meta_keywords: ['resume writing', 'CV tips', 'job application', '2025 resume guide', 'ATS resume', 'professional resume']
    },
    {
      slug: 'how-to-write-compelling-cover-letter',
      featured_image: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=1200&h=630&fit=crop&q=80',
      featured_image_alt: 'Person writing cover letter on laptop',
      meta_keywords: ['cover letter tips', 'job application letter', 'cover letter examples', 'professional writing', 'job search']
    },
    {
      slug: 'linkedin-profile-optimization-guide',
      featured_image: 'https://images.unsplash.com/photo-1611944212129-29977ae1398c?w=1200&h=630&fit=crop&q=80',
      featured_image_alt: 'LinkedIn profile on computer screen',
      meta_keywords: ['LinkedIn optimization', 'professional networking', 'LinkedIn profile tips', 'career networking', 'job search LinkedIn']
    },
    {
      slug: 'how-to-find-remote-work-jobs',
      featured_image: 'https://images.unsplash.com/photo-1588196749597-9ff075ee6b5b?w=1200&h=630&fit=crop&q=80',
      featured_image_alt: 'Remote worker with laptop in home office',
      meta_keywords: ['remote work', 'work from home jobs', 'remote job search', 'digital nomad', 'remote career']
    },
    {
      slug: 'tech-interview-preparation-guide',
      featured_image: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=1200&h=630&fit=crop&q=80',
      featured_image_alt: 'Software engineer coding on multiple monitors',
      meta_keywords: ['tech interview', 'coding interview', 'FAANG interview', 'algorithm questions', 'system design', 'behavioral interview']
    },
  ];

  for (const update of updates) {
    try {
      const { error } = await supabase
        .from('blog_posts')
        .update({
          featured_image: update.featured_image,
          featured_image_alt: update.featured_image_alt,
          meta_keywords: update.meta_keywords,
        })
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

  console.log('\n🎉 Blog organization improved!');

  // Show current posts with categories
  const { data: posts } = await supabase
    .from('blog_posts')
    .select(`
      title,
      slug,
      category:blog_categories(name, slug)
    `)
    .eq('is_published', true)
    .order('published_at', { ascending: false });

  if (posts) {
    console.log('\n📚 Current blog posts:');
    posts.forEach(post => {
      console.log(`  ${post.category?.name || 'No Category'} → ${post.title}`);
    });
  }
}

fixBlogOrganization().catch(console.error);
