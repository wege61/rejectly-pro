"use client";

import styled from "styled-components";
import { BlogList } from "./BlogList";
import { BlogPagination } from "./BlogPagination";
import { BlogSidebar } from "./BlogSidebar";
import { SecondaryCTA } from "@/components/marketing/SecondaryCTA";
import { Footer } from "@/components/ui/Footer";
import type { BlogPostWithRelations, BlogCategory, BlogTag } from "@/types/blog";

const Container = styled.div`
  min-height: 100vh;
  background-color: var(--bg-color);
  color: var(--text-color);
  padding: 80px 24px 60px;

  @media (max-width: 768px) {
    padding: 60px 16px 40px;
  }
`;

const Content = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const Header = styled.header`
  text-align: center;
  margin-bottom: 48px;
  padding-bottom: 32px;
  border-bottom: 1px solid var(--border-color);

  @media (max-width: 768px) {
    margin-bottom: 32px;
    padding-bottom: 24px;
  }
`;

const Title = styled.h1`
  font-size: 56px;
  font-weight: 900;
  margin-bottom: 16px;

  @media (max-width: 768px) {
    font-size: 36px;
  }
`;

const Subtitle = styled.p`
  font-size: 18px;
  color: var(--text-secondary);
  max-width: 600px;
  margin: 0 auto;
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
    order: -1;
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
        <Header>
          <Title>Blog</Title>
          <Subtitle>
            Expert tips on resume optimization, ATS systems, career advice, and
            job search strategies.
          </Subtitle>
        </Header>

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

            <BlogList posts={posts} />

            <BlogPagination
              currentPage={page}
              totalPages={totalPages}
              baseUrl={
                activeCategory
                  ? `/blog?category=${activeCategory}`
                  : activeTag
                  ? `/blog?tag=${activeTag}`
                  : "/blog"
              }
            />
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
