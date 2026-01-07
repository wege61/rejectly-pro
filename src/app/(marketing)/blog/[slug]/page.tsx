import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  getBlogPostBySlug,
  getRelatedPosts,
  incrementPostViews,
  getAllPublishedSlugs,
} from "@/lib/blog";
import {
  BlogPostingSchema,
  BreadcrumbSchema,
} from "@/components/seo/StructuredData";
import { BlogPostContent } from "@/components/blog/BlogPostContent";

// ISR: Revalidate every 60 seconds for fresh content while keeping pages static
export const revalidate = 60;

// Generate static params for all published blog posts at build time
export async function generateStaticParams() {
  const slugs = await getAllPublishedSlugs();
  return slugs.map((slug) => ({ slug }));
}

// Generate metadata for each post
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);

  if (!post) {
    return {
      title: "Post Not Found | Rejectly.pro",
    };
  }

  const title = post.meta_title || post.title;
  const description = post.meta_description || post.excerpt || post.title;
  const image = post.og_image || post.featured_image || "/og-image.png";

  // Generate rich keywords from tags and category
  const keywords = [
    ...(post.meta_keywords || []),
    ...(post.tags?.map(t => t.name) || []),
    post.category?.name,
    "resume tips",
    "career advice",
  ].filter(Boolean) as string[];

  return {
    title: `${title} | Rejectly.pro Blog`,
    description,
    keywords,
    authors: [{ name: post.author_name, url: "https://www.rejectly.pro/about" }],
    creator: post.author_name,
    publisher: "Rejectly.pro",
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    openGraph: {
      title,
      description,
      url: `https://www.rejectly.pro/blog/${slug}`,
      siteName: "Rejectly.pro",
      type: "article",
      publishedTime: post.published_at || undefined,
      modifiedTime: post.updated_at,
      authors: [post.author_name],
      section: post.category?.name,
      tags: post.tags?.map(t => t.name),
      locale: "en_US",
      images: [
        {
          url: image.startsWith("/") ? `https://www.rejectly.pro${image}` : image,
          width: 1200,
          height: 630,
          alt: post.featured_image_alt || post.title,
          type: "image/png",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      site: "@rejectlypro",
      creator: "@rejectlypro",
      title,
      description,
      images: {
        url: image.startsWith("/") ? `https://www.rejectly.pro${image}` : image,
        alt: post.featured_image_alt || post.title,
      },
    },
    alternates: {
      canonical: post.canonical_url || `https://www.rejectly.pro/blog/${slug}`,
    },
    other: {
      "article:published_time": post.published_at || "",
      "article:modified_time": post.updated_at,
      "article:author": post.author_name,
      "article:section": post.category?.name || "Blog",
      "article:tag": post.tags?.map(t => t.name).join(", ") || "",
    },
  };
}

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);

  if (!post) {
    notFound();
  }

  // Increment view count (fire and forget)
  incrementPostViews(slug);

  const relatedPosts = await getRelatedPosts(post, 3);

  // Calculate word count from content
  const wordCount = post.content.replace(/<[^>]*>/g, '').split(/\s+/).filter(Boolean).length;

  return (
    <>
      <BlogPostingSchema
        title={post.title}
        description={post.meta_description || post.excerpt || post.title}
        image={post.featured_image || undefined}
        datePublished={post.published_at || post.created_at}
        dateModified={post.updated_at}
        authorName={post.author_name}
        slug={slug}
        wordCount={wordCount}
        category={post.category?.name}
        tags={post.tags?.map(t => t.name)}
        readingTime={post.reading_time_minutes}
      />
      <BreadcrumbSchema
        items={[
          { name: "Home", url: "https://www.rejectly.pro" },
          { name: "Blog", url: "https://www.rejectly.pro/blog" },
          { name: post.title, url: `https://www.rejectly.pro/blog/${slug}` },
        ]}
      />
      <BlogPostContent post={post} relatedPosts={relatedPosts} />
    </>
  );
}
