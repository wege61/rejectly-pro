"use client";

import styled from "styled-components";
import type { BlogCategory, BlogTag } from "@/types/blog";

const Sidebar = styled.aside`
  display: flex;
  flex-direction: column;
  gap: 40px;

  @media (max-width: 1024px) {
    flex-direction: row;
    flex-wrap: wrap;
    gap: 32px;
  }
`;

const Section = styled.div`
  @media (max-width: 1024px) {
    flex: 1;
    min-width: 240px;
  }
`;

const SectionTitle = styled.h3`
  font-size: 13px;
  font-weight: 600;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.8px;
  margin-bottom: 14px;
  padding-bottom: 12px;
  border-bottom: 1px solid rgba(128, 128, 128, 0.12);
`;

const CategoryList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const CategoryItem = styled.li<{ $active?: boolean }>`
  a {
    display: block;
    padding: 8px 12px;
    border-radius: 10px;
    text-decoration: none;
    font-size: 15px;
    font-weight: ${({ $active }) => ($active ? "600" : "400")};
    color: ${({ $active }) =>
      $active ? "var(--accent)" : "var(--text-secondary)"};
    background: ${({ $active }) =>
      $active ? "rgba(var(--accent-rgb), 0.08)" : "transparent"};
    transition: all 0.2s ease;

    &:hover {
      color: var(--text-color);
      background: rgba(128, 128, 128, 0.06);
    }
  }
`;

const TagsWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

const TagChip = styled.a<{ $active?: boolean }>`
  display: inline-block;
  padding: 6px 14px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 500;
  text-decoration: none;
  transition: all 0.2s ease;

  ${({ $active }) =>
    $active
      ? `
    background: var(--text-color);
    color: var(--bg-color);
  `
      : `
    background: rgba(128, 128, 128, 0.08);
    color: var(--text-secondary);

    &:hover {
      background: rgba(128, 128, 128, 0.15);
      color: var(--text-color);
    }
  `}
`;

interface BlogSidebarProps {
  categories: BlogCategory[];
  tags: BlogTag[];
  activeCategory?: string;
  activeTag?: string;
}

export function BlogSidebar({
  categories,
  tags,
  activeCategory,
  activeTag,
}: BlogSidebarProps) {
  return (
    <Sidebar>
      <Section>
        <SectionTitle>Categories</SectionTitle>
        <CategoryList>
          <CategoryItem $active={!activeCategory}>
            <a href="/blog">All Posts</a>
          </CategoryItem>
          {categories.map((category) => (
            <CategoryItem
              key={category.id}
              $active={activeCategory === category.slug}
            >
              <a href={`/blog?category=${category.slug}`}>{category.name}</a>
            </CategoryItem>
          ))}
        </CategoryList>
      </Section>

      {tags.length > 0 && (
        <Section>
          <SectionTitle>Tags</SectionTitle>
          <TagsWrapper>
            {tags.map((tag) => (
              <TagChip
                key={tag.id}
                href={`/blog?tag=${tag.slug}`}
                $active={activeTag === tag.slug}
              >
                {tag.name}
              </TagChip>
            ))}
          </TagsWrapper>
        </Section>
      )}
    </Sidebar>
  );
}
