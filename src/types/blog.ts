export interface BlogCategory {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  created_at: string;
}

export interface BlogTag {
  id: string;
  name: string;
  slug: string;
  created_at: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  featured_image: string | null;
  featured_image_alt: string | null;
  category_id: string | null;
  author_name: string;
  is_published: boolean;
  published_at: string | null;
  views_count: number;
  reading_time_minutes: number;
  // SEO fields
  meta_title: string | null;
  meta_description: string | null;
  meta_keywords: string[] | null;
  canonical_url: string | null;
  og_image: string | null;
  // Timestamps
  created_at: string;
  updated_at: string;
  // Relations (populated via joins)
  category?: BlogCategory;
  tags?: BlogTag[];
}

export interface BlogPostWithRelations extends BlogPost {
  category: BlogCategory | null;
  tags: BlogTag[];
}

export interface BlogListResponse {
  posts: BlogPostWithRelations[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface BlogFilters {
  category?: string;
  tag?: string;
  search?: string;
  page?: number;
  pageSize?: number;
}
