"use client";

import styled from "styled-components";
import { BlogCard } from "./BlogCard";
import type { BlogPostWithRelations } from "@/types/blog";

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 32px;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 80px 24px;
  color: var(--text-secondary);

  h3 {
    font-size: 24px;
    font-weight: 600;
    color: var(--text-color);
    margin-bottom: 12px;
  }

  p {
    font-size: 16px;
  }
`;

interface BlogListProps {
  posts: BlogPostWithRelations[];
}

export function BlogList({ posts }: BlogListProps) {
  if (!posts || posts.length === 0) {
    return (
      <EmptyState>
        <h3>No posts yet</h3>
        <p>Check back soon for new content!</p>
      </EmptyState>
    );
  }

  return (
    <Grid>
      {posts.map((post) => (
        <BlogCard key={post.id} post={post} />
      ))}
    </Grid>
  );
}
