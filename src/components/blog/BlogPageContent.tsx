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

// Mobile filter bar - horizontal scrolling chips
const MobileFilterBar = styled.div`
  display: none;
  margin-bottom: 24px;

  @media (max-width: 1024px) {
    display: block;
  }
`;

const FilterChipsContainer = styled.div`
  display: flex;
  gap: 8px;
  overflow-x: auto;
  padding-bottom: 8px;
  scrollbar-width: none;
  -ms-overflow-style: none;

  &::-webkit-scrollbar {
    display: none;
  }
`;

const FilterChip = styled.a<{ $active?: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 500;
  white-space: nowrap;
  text-decoration: none;
  transition: all 0.2s ease;
  flex-shrink: 0;

  ${({ $active }) =>
    $active
      ? `
    background: var(--landing-button);
    color: white;
  `
      : `
    background: var(--bg-alt);
    color: var(--text-secondary);
    border: 1px solid var(--border-color);

    &:hover {
      border-color: var(--landing-button);
      color: var(--text-color);
    }
  `}
`;

const MainLayout = styled.div`
  display: grid;
  grid-template-columns: 1fr 300px;
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
  margin-bottom: 32px;
  padding: 16px 20px;
  background: var(--bg-alt);
  border: 1px solid var(--border-color);
  border-radius: 12px;

  p {
    font-size: 14px;
    color: var(--text-secondary);

    strong {
      color: var(--text-color);
    }
  }

  a {
    font-size: 14px;
    color: var(--primary-500);
    text-decoration: none;

    &:hover {
      text-decoration: underline;
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
        {/* Mobile Filter Bar */}
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
                  Showing posts{" "}
                  {activeCategory && (
                    <>
                      in category: <strong>{activeCategory}</strong>
                    </>
                  )}
                  {activeTag && (
                    <>
                      tagged: <strong>{activeTag}</strong>
                    </>
                  )}
                  {" "}({total} {total === 1 ? "post" : "posts"})
                </p>
                <a href="/blog">Clear filter</a>
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
