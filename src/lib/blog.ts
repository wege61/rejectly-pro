import { createClient } from '@/lib/supabase/server';
import type { BlogPost, BlogPostWithRelations, BlogCategory, BlogTag, BlogFilters } from '@/types/blog';

const DEFAULT_PAGE_SIZE = 12;

export async function getBlogPosts(filters: BlogFilters = {}): Promise<{
  posts: BlogPostWithRelations[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}> {
  const supabase = await createClient();
  const page = filters.page || 1;
  const pageSize = filters.pageSize || DEFAULT_PAGE_SIZE;
  const offset = (page - 1) * pageSize;

  let query = supabase
    .from('blog_posts')
    .select(`
      *,
      category:blog_categories(*),
      tags:blog_post_tags(tag:blog_tags(*))
    `, { count: 'exact' })
    .eq('is_published', true)
    .order('published_at', { ascending: false });

  // Filter by category
  if (filters.category) {
    const { data: category } = await supabase
      .from('blog_categories')
      .select('id')
      .eq('slug', filters.category)
      .single();

    if (category) {
      query = query.eq('category_id', category.id);
    }
  }

  // Filter by tag
  if (filters.tag) {
    const { data: tag } = await supabase
      .from('blog_tags')
      .select('id')
      .eq('slug', filters.tag)
      .single();

    if (tag) {
      const { data: postIds } = await supabase
        .from('blog_post_tags')
        .select('post_id')
        .eq('tag_id', tag.id);

      if (postIds && postIds.length > 0) {
        query = query.in('id', postIds.map(p => p.post_id));
      } else {
        return { posts: [], total: 0, page, pageSize, totalPages: 0 };
      }
    }
  }

  // Search filter
  if (filters.search) {
    query = query.or(`title.ilike.%${filters.search}%,excerpt.ilike.%${filters.search}%`);
  }

  // Apply pagination
  query = query.range(offset, offset + pageSize - 1);

  const { data, error, count } = await query;

  if (error) {
    console.error('Error fetching blog posts:', error);
    return { posts: [], total: 0, page, pageSize, totalPages: 0 };
  }

  // Transform the nested tags structure
  const posts: BlogPostWithRelations[] = (data || []).map((post: BlogPost & { tags: { tag: BlogTag }[] }) => ({
    ...post,
    tags: post.tags?.map(t => t.tag) || [],
  }));

  const total = count || 0;
  const totalPages = Math.ceil(total / pageSize);

  return { posts, total, page, pageSize, totalPages };
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPostWithRelations | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('blog_posts')
    .select(`
      *,
      category:blog_categories(*),
      tags:blog_post_tags(tag:blog_tags(*))
    `)
    .eq('slug', slug)
    .eq('is_published', true)
    .single();

  if (error || !data) {
    return null;
  }

  // Transform the nested tags structure
  return {
    ...data,
    tags: data.tags?.map((t: { tag: BlogTag }) => t.tag) || [],
  };
}

export async function getRelatedPosts(post: BlogPostWithRelations, limit = 3): Promise<BlogPostWithRelations[]> {
  const supabase = await createClient();

  let query = supabase
    .from('blog_posts')
    .select(`
      *,
      category:blog_categories(*),
      tags:blog_post_tags(tag:blog_tags(*))
    `)
    .eq('is_published', true)
    .neq('id', post.id)
    .order('published_at', { ascending: false })
    .limit(limit);

  // Prefer posts from the same category
  if (post.category_id) {
    query = query.eq('category_id', post.category_id);
  }

  const { data, error } = await query;

  if (error || !data) {
    return [];
  }

  // Transform the nested tags structure
  return (data || []).map((p: BlogPost & { tags: { tag: BlogTag }[] }) => ({
    ...p,
    tags: p.tags?.map(t => t.tag) || [],
  }));
}

export async function getAllCategories(): Promise<BlogCategory[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('blog_categories')
    .select('*')
    .order('name');

  if (error) {
    console.error('Error fetching categories:', error);
    return [];
  }

  return data || [];
}

export async function getAllTags(): Promise<BlogTag[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('blog_tags')
    .select('*')
    .order('name');

  if (error) {
    console.error('Error fetching tags:', error);
    return [];
  }

  return data || [];
}

export async function incrementPostViews(slug: string): Promise<void> {
  const supabase = await createClient();

  await supabase.rpc('increment_blog_post_views', { post_slug: slug });
}

export async function getAllPublishedSlugs(): Promise<string[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('blog_posts')
    .select('slug')
    .eq('is_published', true);

  if (error) {
    console.error('Error fetching slugs:', error);
    return [];
  }

  return (data || []).map(post => post.slug);
}
