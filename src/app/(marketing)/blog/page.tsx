import type { Metadata } from "next";
import { getBlogPosts, getAllCategories, getAllTags } from "@/lib/blog";
import { BlogListSchema } from "@/components/seo/StructuredData";
import { GuidesIndex } from "@/components/blog/GuidesIndex";
import type { GuideListItem } from "@/components/blog/topics";
import { Footer } from "@/components/ui/Footer";

export const metadata: Metadata = {
  title: { absolute: "Guides: Resumes, ATS and the Job Search | Rejectly.pro" },
  description:
    "Guides on how applicant tracking systems read a resume, how to format and word yours, and how to get from application to interview. Written for students and new grads.",
};

// ISR: revalidate every 60 seconds for fresh content
export const revalidate = 60;

interface BlogPageProps {
  searchParams: Promise<{ category?: string; tag?: string }>;
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const params = await searchParams;

  // Older links filter by ?category= or ?tag=; the chips cover everything else.
  const [{ posts }, categories, tags] = await Promise.all([
    getBlogPosts({ page: 1, pageSize: 200, category: params.category, tag: params.tag }),
    params.category ? getAllCategories() : Promise.resolve([]),
    params.tag ? getAllTags() : Promise.resolve([]),
  ]);

  const filterLabel = params.category
    ? categories.find((c) => c.slug === params.category)?.name
    : params.tag
      ? tags.find((t) => t.slug === params.tag)?.name
      : undefined;

  const guides: GuideListItem[] = posts.map((p) => ({
    slug: p.slug,
    title: p.title,
    excerpt: p.excerpt || "",
    image: p.featured_image,
    imageAlt: p.featured_image_alt,
    category: p.category?.name ?? null,
    date: p.published_at
      ? new Date(p.published_at).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric", timeZone: "UTC" })
      : "",
  }));

  return (
    <div style={{ minHeight: "100vh", background: "var(--rj-paper)", overflowX: "clip" }}>
      <BlogListSchema
        posts={posts.map((p) => ({
          title: p.title,
          slug: p.slug,
          excerpt: p.excerpt || "",
          datePublished: p.published_at || p.created_at,
        }))}
      />
      <GuidesIndex guides={guides} filterLabel={filterLabel} />
      <Footer />
    </div>
  );
}
