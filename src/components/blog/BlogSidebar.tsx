"use client";

import styled from "styled-components";
import { Tag, FolderOpen } from "lucide-react";
import type { BlogCategory, BlogTag } from "@/types/blog";

const Sidebar = styled.aside`
  display: flex;
  flex-direction: column;
  gap: 32px;

  @media (max-width: 1024px) {
    flex-direction: row;
    flex-wrap: wrap;
  }
`;

const Section = styled.div`
  background: var(--bg-alt);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  padding: 24px;

  @media (max-width: 1024px) {
    flex: 1;
    min-width: 280px;
  }
`;

const SectionTitle = styled.h3`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 16px;
  font-weight: 700;
  color: var(--text-color);
  margin-bottom: 16px;

  svg {
    width: 18px;
    height: 18px;
    color: var(--primary-500);
  }
`;

const List = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const ListItem = styled.li`
  a {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px 12px;
    border-radius: 8px;
    text-decoration: none;
    color: var(--text-secondary);
    font-size: 14px;
    transition: all 0.2s ease;

    &:hover {
      background: var(--surface-color);
      color: var(--text-color);
    }

    &.active {
      background: rgba(var(--primary-500-rgb), 0.1);
      color: var(--primary-500);
    }
  }
`;

const TagsWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

const TagLink = styled.a<{ $active?: boolean }>`
  display: inline-block;
  padding: 6px 12px;
  border-radius: 16px;
  font-size: 13px;
  text-decoration: none;
  transition: all 0.2s ease;

  ${({ $active }) =>
    $active
      ? `
    background: var(--primary-500);
    color: white;
  `
      : `
    background: var(--surface-color);
    color: var(--text-secondary);
    border: 1px solid var(--border-color);

    &:hover {
      background: var(--primary-500);
      color: white;
      border-color: var(--primary-500);
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
        <SectionTitle>
          <FolderOpen />
          Categories
        </SectionTitle>
        <List>
          <ListItem>
            <a href="/blog" className={!activeCategory ? "active" : ""}>
              All Posts
            </a>
          </ListItem>
          {categories.map((category) => (
            <ListItem key={category.id}>
              <a
                href={`/blog?category=${category.slug}`}
                className={activeCategory === category.slug ? "active" : ""}
              >
                {category.name}
              </a>
            </ListItem>
          ))}
        </List>
      </Section>

      <Section>
        <SectionTitle>
          <Tag />
          Popular Tags
        </SectionTitle>
        <TagsWrapper>
          {tags.map((tag) => (
            <TagLink
              key={tag.id}
              href={`/blog?tag=${tag.slug}`}
              $active={activeTag === tag.slug}
            >
              {tag.name}
            </TagLink>
          ))}
        </TagsWrapper>
      </Section>
    </Sidebar>
  );
}
