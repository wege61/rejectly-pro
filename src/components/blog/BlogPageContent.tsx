"use client";

import styled from "styled-components";
import { BlogBentoGrid } from "./BlogBentoGrid";
import { BlogSidebar } from "./BlogSidebar";
import { SecondaryCTA } from "@/components/marketing/SecondaryCTA";
import { Footer } from "@/components/ui/Footer";
import type { BlogPostWithRelations, BlogCategory, BlogTag } from "@/types/blog";

const Container = styled.div`
  min-height: 100vh;
  margin-top: 40px;
  background-color: var(--bg-color);
  color: var(--text-color);
  padding: 80px 24px 60px;

  @media (max-width: 768px) {
    padding: 60px 16px 40px;
  }
`;

const Content = styled.div`
  max-width: 1200px;
  margin: 0 auto 100px auto;
`;

const MobileFilterBar = styled.div`
  display: none;
  margin-bottom: 28px;

  @media (max-width: 1024px) {
    display: block;
  }
`;

const FilterChipsContainer = styled.div`
  display: flex;
  gap: 8px;
  overflow-x: auto;
  padding-bottom: 4px;
  scrollbar-width: none;
  -ms-overflow-style: none;

  &::-webkit-scrollbar {
    display: none;
  }
`;

const FilterChip = styled.a<{ $active?: boolean }>`
  display: inline-flex;
  align-items: center;
  padding: 7px 16px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 500;
  white-space: nowrap;
  text-decoration: none;
  transition: all 0.2s ease;
  flex-shrink: 0;

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

const MainLayout = styled.div`
  display: grid;
  grid-template-columns: 1fr 260px;
  gap: 48px;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
    gap: 32px;
  }
`;

const MainContent = styled.main``;

const SidebarWrapper = styled.div`
  @media (max-width: 1024px) {
    display: none;
  }
`;

const FilterInfo = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 28px;

  p {
    font-size: 14px;
    color: var(--text-muted);

    strong {
      color: var(--text-color);
      font-weight: 600;
    }
  }

  a {
    font-size: 13px;
    font-weight: 500;
    color: var(--accent);
    text-decoration: none;
    padding: 4px 12px;
    border-radius: 8px;
    transition: background 0.2s ease;

    &:hover {
      background: rgba(var(--accent-rgb), 0.08);
    }
  }
`;

interface BlogPageContentProps {
  posts: BlogPostWithRelations[];
  total: number;
  page: number;
  totalPages: number;
  categories: BlogCategory[];
  tags: BlogTag[];
  activeCategory?: string;
  activeTag?: string;
}

export function BlogPageContent({
  posts,
  total,
  page,
  totalPages,
  categories,
  tags,
  activeCategory,
  activeTag,
}: BlogPageContentProps) {
  const activeFilter = activeCategory || activeTag;

  return (
    <Container>
      <Content>
        <MobileFilterBar>
          <FilterChipsContainer>
            <FilterChip href="/blog" $active={!activeCategory && !activeTag}>
              All
            </FilterChip>
            {categories.map((category) => (
              <FilterChip
                key={category.id}
                href={`/blog?category=${category.slug}`}
                $active={activeCategory === category.slug}
              >
                {category.name}
              </FilterChip>
            ))}
          </FilterChipsContainer>
        </MobileFilterBar>

        <MainLayout>
          <MainContent>
            {activeFilter && (
              <FilterInfo>
                <p>
                  {activeCategory && (
                    <>
                      Filtered by <strong>{activeCategory}</strong>
                    </>
                  )}
                  {activeTag && (
                    <>
                      Tagged <strong>{activeTag}</strong>
                    </>
                  )}
                  {" "}&middot; {total} {total === 1 ? "post" : "posts"}
                </p>
                <a href="/blog">Clear</a>
              </FilterInfo>
            )}

            <BlogBentoGrid posts={posts} />
          </MainContent>

          <SidebarWrapper>
            <BlogSidebar
              categories={categories}
              tags={tags}
              activeCategory={activeCategory}
              activeTag={activeTag}
            />
          </SidebarWrapper>
        </MainLayout>
      </Content>

      <SecondaryCTA />

      <Footer />
    </Container>
  );
}
