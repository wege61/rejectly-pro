import { MetadataRoute } from "next";
import { createClient } from "@supabase/supabase-js";
import { config } from "@/lib/config";
import { ROLE_SLUGS } from "@/lib/resumeRoles";

const BASE_URL = "https://rejectly.pro";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/pricing`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/ats-check`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/cv-builder`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/how-it-works`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/features`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/blog`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/faq`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${BASE_URL}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${BASE_URL}/signup`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.6,
    },
    {
      url: `${BASE_URL}/login`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.5,
    },
    {
      url: `${BASE_URL}/terms`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${BASE_URL}/privacy`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];

  // Programmatic SEO pages for role-specific resume optimization
  const rolePages: MetadataRoute.Sitemap = ROLE_SLUGS.map((role) => ({
    url: `${BASE_URL}/resume/${role}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  // Fetch blog posts from Supabase (using direct client without cookies)
  let blogPages: MetadataRoute.Sitemap = [];

  try {
    // Use direct Supabase client for build-time access (no cookies needed for public data)
    const supabase = createClient(config.supabase.url, config.supabase.anonKey);

    // Fetch published blog posts
    const { data: posts } = await supabase
      .from("blog_posts")
      .select("slug, updated_at, published_at")
      .eq("is_published", true)
      .order("published_at", { ascending: false });

    if (posts) {
      blogPages = posts.map((post, index) => ({
        url: `${BASE_URL}/blog/${post.slug}`,
        lastModified: new Date(post.updated_at || post.published_at),
        changeFrequency: "weekly" as const,
        // Recent posts get higher priority (0.8-0.9), older posts get 0.7
        priority: index < 5 ? 0.9 : index < 15 ? 0.8 : 0.7,
      }));

      // Add pagination pages to sitemap
      const POSTS_PER_PAGE = 6; // Matching POSTS_PER_PAGE from BlogBentoGrid
      const totalBlogPages = Math.ceil(posts.length / POSTS_PER_PAGE);
      
      if (totalBlogPages > 1) {
        for (let i = 2; i <= totalBlogPages; i++) {
          blogPages.push({
            url: `${BASE_URL}/blog?page=${i}`,
            lastModified: new Date(posts[0]?.updated_at || posts[0]?.published_at || new Date()),
            changeFrequency: "weekly" as const,
            priority: 0.6,
          });
        }
      }
    }

    // Note: Category and tag filter pages (/blog?category=X, /blog?tag=Y) are
    // intentionally excluded from sitemap as they are filtered views of /blog
    // and Google treats query-string URLs as potential duplicate content.
  } catch (error) {
    console.error("Error fetching blog data for sitemap:", error);
  }

  return [...staticPages, ...rolePages, ...blogPages];
}
