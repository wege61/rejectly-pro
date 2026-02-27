import { createClient } from "@supabase/supabase-js";
import { config } from "@/lib/config";

const BASE_URL = "https://www.rejectly.pro";

export const revalidate = 3600; // Revalidate every hour

export async function GET() {
  const supabase = createClient(config.supabase.url, config.supabase.anonKey);

  const { data: posts } = await supabase
    .from("blog_posts")
    .select(`
      title,
      slug,
      excerpt,
      content,
      featured_image,
      author_name,
      published_at,
      updated_at,
      category:blog_categories(name)
    `)
    .eq("is_published", true)
    .order("published_at", { ascending: false })
    .limit(50);

  const escapeXml = (str: string) => {
    return str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&apos;");
  };

  const stripHtml = (html: string) => {
    return html.replace(/<[^>]*>/g, "").substring(0, 500);
  };

  const rssItems = (posts || [])
    .map((post) => {
      const pubDate = new Date(post.published_at || post.updated_at).toUTCString();
      const description = post.excerpt || stripHtml(post.content);
      
      let categoryName: string | undefined;
      if (post.category) {
        if (Array.isArray(post.category) && post.category.length > 0) {
          categoryName = post.category[0]?.name;
        } else if (!Array.isArray(post.category)) {
          categoryName = (post.category as any).name;
        }
      }

      return `
    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${BASE_URL}/blog/${post.slug}</link>
      <guid isPermaLink="true">${BASE_URL}/blog/${post.slug}</guid>
      <description><![CDATA[${description}]]></description>
      <pubDate>${pubDate}</pubDate>
      <author>support@rejectly.pro (${escapeXml(post.author_name)})</author>
      ${categoryName ? `<category>${escapeXml(categoryName)}</category>` : ""}
      ${post.featured_image ? `<enclosure url="${escapeXml(post.featured_image)}" type="image/jpeg" />` : ""}
    </item>`;
    })
    .join("");

  const rssFeed = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"
  xmlns:atom="http://www.w3.org/2005/Atom"
  xmlns:content="http://purl.org/rss/1.0/modules/content/"
  xmlns:dc="http://purl.org/dc/elements/1.1/">
  <channel>
    <title>Rejectly.pro Blog - Resume Tips &amp; Career Advice</title>
    <link>${BASE_URL}/blog</link>
    <description>Expert tips on resume optimization, ATS systems, career advice, and job search strategies to help you land more interviews.</description>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${BASE_URL}/blog/feed.xml" rel="self" type="application/rss+xml"/>
    <image>
      <url>${BASE_URL}/logo.png</url>
      <title>Rejectly.pro Blog</title>
      <link>${BASE_URL}/blog</link>
    </image>
    <copyright>Copyright ${new Date().getFullYear()} Rejectly.pro. All rights reserved.</copyright>
    <managingEditor>support@rejectly.pro (Rejectly Team)</managingEditor>
    <webMaster>support@rejectly.pro (Rejectly Team)</webMaster>
    <ttl>60</ttl>
    ${rssItems}
  </channel>
</rss>`;

  return new Response(rssFeed, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
