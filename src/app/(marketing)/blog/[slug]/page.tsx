import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  getBlogPostBySlug,
  getRelatedPosts,
  incrementPostViews,
} from "@/lib/blog";
import {
  BlogPostingSchema,
  BreadcrumbSchema,
} from "@/components/seo/StructuredData";
import { BlogPostContent } from "@/components/blog/BlogPostContent";

// Use dynamic rendering for blog posts (no static generation at build time)
export const dynamic = "force-dynamic";

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

  return {
    title: `${title} | Rejectly.pro Blog`,
    description,
    keywords: post.meta_keywords || [],
    openGraph: {
      title,
      description,
      url: `https://www.rejectly.pro/blog/${slug}`,
      type: "article",
      publishedTime: post.published_at || undefined,
      modifiedTime: post.updated_at,
      authors: [post.author_name],
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
    alternates: {
      canonical: post.canonical_url || `https://www.rejectly.pro/blog/${slug}`,
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
