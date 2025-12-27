require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

async function applyMigration() {
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

  console.log('🚀 Applying blog migration...\n');

  // Blog posts data
  const posts = [
    {
      title: 'Kusursuz CV Nasıl Hazırlanır? 2025 Rehberi',
      slug: 'kusursuz-cv-hazirlama-rehberi-2025',
      excerpt: 'Profesyonel bir CV hazirlayarak hayalinizdeki ise bir adim daha yaklasabilirsiniz. Bu kapsamli rehberde, dikkat ceken bir CV olusturmanin tum sirlari.',
      category_slug: 'resume-tips',
      tags: ['resume', 'job-search', 'ats'],
      published_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      reading_time_minutes: 10,
    },
    {
      title: 'Etkileyici On Yazi Nasil Yazilir? Orneklerle Kapsamli Rehber',
      slug: 'etkileyici-on-yazi-nasil-yazilir',
      excerpt: 'On yazi (cover letter) is basvurunuzda fark yaratmanizi saglar. Bu rehberde, isverenleri etkileyecek on yazi yazmanin tum sirlari ve ornekleri.',
      category_slug: 'resume-tips',
      tags: ['cover-letter', 'job-search', 'resume'],
      published_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      reading_time_minutes: 12,
    },
    {
      title: 'LinkedIn Profilini Optimize Etme: Is Verenler Sizi Bulsun',
      slug: 'linkedin-profil-optimizasyonu-rehberi',
      excerpt: 'LinkedIn\'de onemli bir profesyonel network olusturun ve is verenler sizi bulsun. Profil optimizasyonu, icerik stratejisi ve network ipuclari.',
      category_slug: 'career-advice',
      tags: ['linkedin', 'career-change', 'job-search'],
      published_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      reading_time_minutes: 15,
    },
    {
      title: 'Uzaktan Çalışma İşi Nasıl Bulunur? Kapsamlı Rehber',
      slug: 'uzaktan-calisma-isi-nasil-bulunur',
      excerpt: 'Uzaktan çalışma hayalinizi gerçekleştirin. En iyi remote iş platformları, başvuru stratejileri ve home office kurulumu ipuçları.',
      category_slug: 'career-advice',
      tags: ['remote-work', 'job-search', 'career-change'],
      published_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      reading_time_minutes: 14,
    },
    {
      title: 'Yazılım Mülakat Hazırlığı: Algoritma, Sistem Tasarımı ve Davranışsal Sorular',
      slug: 'yazilim-mulakat-hazirligi-rehberi',
      excerpt: 'FAANG ve tech şirket mülakatlarına nasıl hazırlanılır? Algoritma soruları, sistem tasarımı, coding challenge\'lar ve davranışsal mülakat ipuçları.',
      category_slug: 'interview-prep',
      tags: ['tech-industry', 'job-search'],
      published_at: new Date().toISOString(),
      reading_time_minutes: 18,
    },
  ];

  // Read full content from migration file
  const migrationContent = fs.readFileSync('supabase/migrations/016_add_comprehensive_blog_posts.sql', 'utf8');

  // Extract content for each post (simplified - using predefined content)
  const contentMap = {
    'kusursuz-cv-hazirlama-rehberi-2025': extractContent(migrationContent, 'Kusursuz CV Nasil Hazirlanir'),
    'etkileyici-on-yazi-nasil-yazilir': extractContent(migrationContent, 'Etkileyici On Yazi'),
    'linkedin-profil-optimizasyonu-rehberi': extractContent(migrationContent, 'LinkedIn Profilini'),
    'uzaktan-calisma-isi-nasil-bulunur': extractContent(migrationContent, 'Uzaktan Çalışma'),
    'yazilim-mulakat-hazirligi-rehberi': extractContent(migrationContent, 'Yazılım Mülakat'),
  };

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

      const content = contentMap[post.slug] || 'Content will be added soon.';

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
          content: content,
          category_id: category.id,
          author_name: 'Rejectly Team',
          is_published: true,
          published_at: post.published_at,
          reading_time_minutes: post.reading_time_minutes,
          meta_title: `${post.title} | Rejectly`,
          meta_description: post.excerpt,
          featured_image: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=1200&h=630&fit=crop',
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

  console.log(`\n✨ Migration complete! Total published posts: ${count}`);
}

function extractContent(migrationContent, titleStart) {
  const startMarker = `content,\n    '`;
  const idx = migrationContent.indexOf(titleStart);
  if (idx === -1) return '';

  const contentStart = migrationContent.indexOf(startMarker, idx);
  if (contentStart === -1) return '';

  const actualStart = contentStart + startMarker.length;
  const contentEnd = migrationContent.indexOf("',\n    'https://", actualStart);

  if (contentEnd === -1) return '';

  return migrationContent.substring(actualStart, contentEnd).replace(/\\'/g, "'");
}

applyMigration().catch(console.error);
