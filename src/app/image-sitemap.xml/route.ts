import { createClient } from "@supabase/supabase-js";
import { config } from "@/lib/config";

const BASE_URL = "https://rejectly.pro";

export const revalidate = 3600; // Revalidate every hour

export async function GET() {
  try {
    const supabase = createClient(config.supabase.url, config.supabase.anonKey);

    // Fetch published blog posts with images and content
    const { data: posts, error } = await supabase
      .from("blog_posts")
      .select("slug, title, featured_image, featured_image_alt, updated_at, published_at, content")
      .eq("is_published", true)
      .order("published_at", { ascending: false });

    if (error) {
      console.error("Image sitemap error:", error);
      return emptyImageSitemap();
    }

    const validPosts = (posts || []).filter(
      (post) => post.featured_image && post.slug && post.title
    );

    if (validPosts.length === 0) {
      return emptyImageSitemap();
    }

    const imageEntries = validPosts
      .map((post) => {
        const lastmod = post.updated_at || post.published_at || new Date().toISOString();

        let imageTags = '';
        
        // 1. Featured image
        if (post.featured_image) {
          const featuredUrl = post.featured_image.startsWith("/")
            ? `${BASE_URL}${post.featured_image}`
            : post.featured_image;
          imageTags += `
    <image:image>
      <image:loc>${escapeXml(featuredUrl)}</image:loc>
      <image:title>${escapeXml(post.featured_image_alt || post.title)}</image:title>
      <image:caption>${escapeXml(post.title)}</image:caption>
    </image:image>`;
        }

        // 2. In-content images
        if (post.content) {
          const imgRegex = /<img[^>]+src="([^">]+)"(?:[^>]+alt="([^">]*)")?[^>]*>/gi;
          let match;
          while ((match = imgRegex.exec(post.content)) !== null) {
            let src = match[1];
            if (!src) continue;
            let alt = match[2] || post.title;
            
            if (src.startsWith('/')) {
              src = `${BASE_URL}${src}`;
            }

            // Avoid duplicating the featured image
            if (post.featured_image && src.includes(post.featured_image)) continue;

            imageTags += `
    <image:image>
      <image:loc>${escapeXml(src)}</image:loc>
      <image:title>${escapeXml(alt)}</image:title>
      <image:caption>${escapeXml(alt)}</image:caption>
    </image:image>`;
          }
        }

        // If no images found for this post, don't include it in the sitemap
        if (!imageTags) return null;

        return `  <url>
    <loc>${escapeXml(`${BASE_URL}/blog/${post.slug}`)}</loc>${imageTags}
    <lastmod>${new Date(lastmod).toISOString()}</lastmod>
  </url>`;
      })
      .filter(Boolean)
      .join("\n");

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${imageEntries}
</urlset>`;

    return new Response(sitemap, {
      headers: {
        "Content-Type": "application/xml; charset=utf-8",
        "Cache-Control": "public, max-age=3600, s-maxage=3600",
      },
    });
  } catch (err) {
    console.error("Image sitemap error:", err);
    return emptyImageSitemap();
  }
}

function emptyImageSitemap() {
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
</urlset>`;

  return new Response(sitemap, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}

function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}
