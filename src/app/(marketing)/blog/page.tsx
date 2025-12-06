import { getBlogPosts, getAllCategories, getAllTags } from "@/lib/blog";
import { BlogListSchema } from "@/components/seo/StructuredData";
import { BlogPageContent } from "@/components/blog/BlogPageContent";
import type { BlogFilters } from "@/types/blog";

export const dynamic = "force-dynamic";

interface BlogPageProps {
  searchParams: Promise<{
    page?: string;
    category?: string;
    tag?: string;
    search?: string;
  }>;
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const params = await searchParams;

  const filters: BlogFilters = {
    page: params.page ? parseInt(params.page, 10) : 1,
    category: params.category,
    tag: params.tag,
    search: params.search,
    pageSize: 12,
  };

  const [{ posts, total, page, totalPages }, categories, tags] =
    await Promise.all([
      getBlogPosts(filters),
      getAllCategories(),
      getAllTags(),
    ]);

  return (
    <>
      <BlogListSchema
        posts={posts.map((p) => ({
          title: p.title,
          slug: p.slug,
          excerpt: p.excerpt || "",
          datePublished: p.published_at || p.created_at,
        }))}
      />
      <BlogPageContent
        posts={posts}
        total={total}
        page={page}
        totalPages={totalPages}
        categories={categories}
        tags={tags}
        activeCategory={params.category}
        activeTag={params.tag}
      />
    </>
  );
}
