"use client";

import styled from "styled-components";
import Image from "next/image";
import { Calendar, Clock, User, Tag, ArrowLeft, Share2, Search } from "lucide-react";
import { BlogCard } from "./BlogCard";
import { Footer } from "@/components/ui/Footer";
import { TableOfContents, extractHeadings, addHeadingIds } from "./TableOfContents";
import { BlogCTA, SidebarCTA } from "./BlogCTA";
import { ContextualBlogHeader } from "./ContextualBlogHeader";
import type { BlogPostWithRelations } from "@/types/blog";

// Dynamic import for DOMPurify to avoid SSR issues
const sanitizeHtml = (html: string, options?: { ADD_ATTR?: string[] }): string => {
  if (typeof window === "undefined") return html;
  const DOMPurify = require("dompurify");
  return DOMPurify.sanitize(html, options);
};

const Container = styled.div`
  min-height: 100vh;
  background-color: var(--bg-color);
  color: var(--text-color);
  position: relative;
`;

const FullBleedImageContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  width: 100%;
  height: 60vh;
  z-index: 0;
  
  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(
      to bottom,
      rgba(0,0,0,0.1) 0%,
      rgba(0,0,0,0.6) 70%,
      var(--bg-color) 100%
    );
  }
`;

const FeaturedImage = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
  
  img {
    object-fit: cover;
  }
`;

const TopActionBar = styled.div`
  position: absolute;
  top: 24px;
  right: 24px;
  z-index: 50;
  display: flex;
  align-items: center;
  gap: 12px;

  @media (max-width: 1024px) {
    top: 16px;
    right: 16px;
  }
`;

const SearchInputBox = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  padding: 8px 16px;
  border-radius: 20px;
  color: white;

  svg {
    width: 16px;
    height: 16px;
    opacity: 0.7;
  }

  input {
    background: transparent;
    border: none;
    color: white;
    font-size: 14px;
    width: 120px;
    outline: none;

    &::placeholder {
      color: rgba(255, 255, 255, 0.6);
    }
  }

  @media (max-width: 640px) {
    display: none;
  }
`;

const TopActionButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.2);
  }

  svg {
    width: 18px;
    height: 18px;
  }
`;

const LiquidSidebar = styled.aside`
  position: fixed;
  top: 0;
  left: 0;
  width: 320px;
  z-index: 40;

  /* Dashboard Floating Appearance */
  margin: 10px 0 10px 10px;
  height: calc(100vh - 20px);
  border-radius: 18px;

  background: rgba(255, 255, 255, 0.02);
  backdrop-filter: blur(40px);
  -webkit-backdrop-filter: blur(40px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  flex-direction: column;
  padding: 40px 24px 32px;
  overflow: hidden;
  box-shadow: 1px 0 20px rgba(0,0,0,0.1);

  @media (max-width: 1024px) {
    display: none;
  }
`;

const TOCWrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0;
  overflow: hidden;
`;

const PageRightContent = styled.div`
  margin-left: 340px;
  position: relative;
  z-index: 10;
  
  @media (max-width: 1024px) {
    margin-left: 0;
  }
`;

const MainContentWrapper = styled.div`
  padding: 45vh 48px 80px;
  max-width: 1200px;
  margin: 0 auto;
  min-height: 100vh;

  @media (max-width: 1024px) {
    padding: 45vh 24px 80px;
  }
`;

const BackLink = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: var(--text-color);
  text-decoration: none;
  transition: opacity 0.2s ease;
  font-weight: 500;

  &:hover {
    opacity: 0.8;
  }

  svg {
    width: 18px;
    height: 18px;
  }
`;

const TitleWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 48px;
`;

const CategoryBadge = styled.span`
  display: inline-block;
  font-size: 11px;
  font-weight: 600;
  color: #fff;
  background: rgba(255,255,255, 0.15);
  backdrop-filter: blur(10px);
  padding: 6px 14px;
  border-radius: 20px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  white-space: nowrap;
  margin-bottom: 8px;
  align-self: flex-start;
  border: 1px solid rgba(255,255,255,0.2);
`;

const Title = styled.h1`
  font-size: 48px;
  font-weight: 800;
  line-height: 1.15;
  margin: 0;
  color: #fff;
  text-shadow: 0 4px 12px rgba(0,0,0,0.5);

  @media (max-width: 768px) {
    font-size: 32px;
  }
`;

const Meta = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 20px;
  font-size: 14px;
  color: rgba(255, 255, 255, 0.8);
  padding-top: 8px;
`;

const MetaItem = styled.span`
  display: flex;
  align-items: center;
  gap: 6px;

  svg {
    width: 16px;
    height: 16px;
  }
`;

const ArticleContent = styled.article`
  width: 100%;
`;

const Content = styled.div`
  font-size: 18px;
  line-height: 1.8;
  color: var(--text-color);

  h2 {
    font-size: 32px;
    font-weight: 700;
    margin: 48px 0 24px;
    color: var(--text-color);
  }

  h3 {
    font-size: 24px;
    font-weight: 600;
    margin: 36px 0 16px;
    color: var(--text-color);
  }

  p {
    margin-bottom: 24px;
    color: var(--text-secondary);
  }

  strong {
    color: var(--text-color);
    font-weight: 600;
  }

  em {
    font-style: italic;
    color: var(--text-secondary);
  }

  ul {
    margin-bottom: 24px;
    padding-left: 24px;
    color: var(--text-secondary);
    list-style-type: disc;

    li {
      margin-bottom: 12px;
      padding-left: 8px;

      &::marker {
        color: var(--primary-500);
      }
    }
  }

  ol {
    margin-bottom: 24px;
    padding-left: 24px;
    color: var(--text-secondary);
    list-style-type: decimal;

    li {
      margin-bottom: 12px;
      padding-left: 8px;

      &::marker {
        color: var(--primary-500);
        font-weight: 600;
      }
    }
  }

  blockquote {
    margin: 32px 0;
    padding: 24px 32px;
    border-left: 4px solid var(--primary-500);
    background: var(--bg-alt);
    border-radius: 0 12px 12px 0;
    font-style: italic;
    color: var(--text-secondary);
  }

  code {
    background: var(--bg-alt);
    padding: 2px 8px;
    border-radius: 4px;
    font-family: monospace;
    font-size: 0.9em;
  }

  pre {
    background: var(--bg-alt);
    padding: 24px;
    border-radius: 12px;
    overflow-x: auto;
    margin-bottom: 24px;

    code {
      background: none;
      padding: 0;
    }
  }

  a {
    color: var(--primary-500);
    text-decoration: underline;

    &:hover {
      opacity: 0.8;
    }
  }

  img {
    max-width: 100%;
    border-radius: 12px;
    margin: 32px 0;
  }

  @media (max-width: 768px) {
    font-size: 16px;

    h2 {
      font-size: 26px;
    }

    h3 {
      font-size: 20px;
    }
  }
`;

const TagsSection = styled.div`
  margin-top: 48px;
  padding-top: 32px;
  border-top: 1px solid var(--border-color);
`;

const TagsTitle = styled.h4`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 600;
  color: var(--text-secondary);
  margin-bottom: 16px;

  svg {
    width: 16px;
    height: 16px;
  }
`;

const TagsList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

const TagLink = styled.a`
  display: inline-block;
  padding: 6px 14px;
  border-radius: 20px;
  font-size: 13px;
  text-decoration: none;
  background: var(--bg-alt);
  color: var(--text-secondary);
  border: 1px solid var(--border-color);
  transition: all 0.2s ease;

  &:hover {
    background: var(--primary-500);
    color: white;
    border-color: var(--primary-500);
  }
`;

const ShareSection = styled.div`
  margin-top: 32px;
  display: flex;
  align-items: center;
  gap: 16px;
`;

const ShareTitle = styled.span`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 600;
  color: var(--text-secondary);

  svg {
    width: 16px;
    height: 16px;
  }
`;

const ShareButton = styled.a`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: var(--bg-alt);
  color: var(--text-secondary);
  border: 1px solid var(--border-color);
  text-decoration: none;
  transition: all 0.2s ease;

  &:hover {
    background: var(--primary-500);
    color: white;
    border-color: var(--primary-500);
  }

  svg {
    width: 18px;
    height: 18px;
  }
`;

const RelatedSection = styled.section`
  padding: 80px 0 100px;
  background: #000000;
  
  /* Break out of PageRightContent margin to span 100vw */
  width: 100vw;
  margin-left: -340px; /* Exactly offsets the PageRightContent margin-left */
  position: relative;
  /* Prevent horizontal scrollbar on some OS by ensuring no excess width */
  max-width: 100vw;

  @media (max-width: 1024px) {
    margin-left: 0;
    padding: 60px 0 80px;
  }
`;

const RelatedContentWrapper = styled.div`
  width: calc(100% - 340px);
  margin-left: 340px;

  @media (max-width: 1024px) {
    width: 100%;
    margin-left: 0;
  }
`;

const RelatedContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 48px;

  @media (max-width: 768px) {
    padding: 0 24px;
  }
`;

const RelatedTitle = styled.h2`
  font-size: 32px;
  font-weight: 700;
  text-align: left;
  margin-bottom: 48px;
  color: white;

  @media (max-width: 768px) {
    font-size: 24px;
    margin-bottom: 32px;
  }
`;

const RelatedGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 32px;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

interface BlogPostContentProps {
  post: BlogPostWithRelations;
  relatedPosts: BlogPostWithRelations[];
}

// Determine CTA type based on post content/tags
function getCTAType(post: BlogPostWithRelations): "resume" | "cover-letter" | "general" {
  const tagSlugs = post.tags?.map(t => t.slug.toLowerCase()) || [];
  const categorySlug = post.category?.slug?.toLowerCase() || "";
  const titleLower = post.title.toLowerCase();

  // Check for cover letter related content
  if (
    tagSlugs.includes("cover-letter") ||
    titleLower.includes("cover letter")
  ) {
    return "cover-letter";
  }

  // Check for resume/ATS related content
  if (
    tagSlugs.includes("resume") ||
    tagSlugs.includes("ats") ||
    categorySlug === "ats-optimization" ||
    categorySlug === "resume-tips" ||
    titleLower.includes("resume") ||
    titleLower.includes("ats")
  ) {
    return "resume";
  }

  return "general";
}

export function BlogPostContent({ post, relatedPosts }: BlogPostContentProps) {
  const formattedDate = post.published_at
    ? new Date(post.published_at).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "";

  // ISO date for semantic HTML
  const isoDate = post.published_at
    ? new Date(post.published_at).toISOString()
    : "";

  const shareUrl = `https://www.rejectly.pro/blog/${post.slug}`;
  const shareText = `${post.title} - Great article on resume optimization!`;

  return (
    <Container>
      {post.featured_image && (
        <FullBleedImageContainer>
          <FeaturedImage>
            <Image
              src={post.featured_image}
              alt={post.featured_image_alt || post.title}
              fill
              sizes="100vw"
              priority
            />
          </FeaturedImage>
        </FullBleedImageContainer>
      )}

      <ContextualBlogHeader title={post.title} url={shareUrl} />

      <LiquidSidebar>
        <TOCWrapper>
          <TableOfContents content={post.content} />
        </TOCWrapper>
      </LiquidSidebar>

      <PageRightContent>
        <MainContentWrapper>
          <TitleWrapper>
            {post.category && (
              <CategoryBadge>{post.category.name}</CategoryBadge>
            )}
            <Title>{post.title}</Title>

            <Meta>
              <MetaItem>
                <User />
                <span itemProp="author">{post.author_name}</span>
              </MetaItem>
              {formattedDate && (
                <MetaItem>
                  <Calendar />
                  <time dateTime={isoDate} itemProp="datePublished">
                    {formattedDate}
                  </time>
                </MetaItem>
              )}
              <MetaItem>
                <Clock />
                <span>{post.reading_time_minutes} min read</span>
              </MetaItem>
            </Meta>
          </TitleWrapper>

          <ArticleContent itemScope itemType="https://schema.org/Article">
            <Content
              className="article-content"
              itemProp="articleBody"
              dangerouslySetInnerHTML={{
                __html: sanitizeHtml(
                  addHeadingIds(post.content, extractHeadings(post.content)),
                  { ADD_ATTR: ['target'] }
                )
              }}
            />

            {post.tags && post.tags.length > 0 && (
              <TagsSection>
                <TagsTitle>
                  <Tag />
                  Tags
                </TagsTitle>
                <TagsList>
                  {post.tags.map((tag) => (
                    <TagLink key={tag.id} href={`/blog?tag=${tag.slug}`}>
                      {tag.name}
                    </TagLink>
                  ))}
                </TagsList>
              </TagsSection>
            )}

            <ShareSection>
              <ShareTitle>
                <Share2 />
                Share
              </ShareTitle>
              <ShareButton
                href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}&via=rejectlypro`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Share on Twitter"
              >
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </ShareButton>
              <ShareButton
                href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Share on LinkedIn"
              >
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </ShareButton>
            </ShareSection>

            <BlogCTA type={getCTAType(post)} variant="primary" />

            
          </ArticleContent>
        </MainContentWrapper>

        {relatedPosts.length > 0 && (
          <RelatedSection aria-labelledby="related-posts-heading">
            <RelatedContentWrapper>
              <RelatedContent>
                <RelatedTitle id="related-posts-heading">Related Posts</RelatedTitle>
                <RelatedGrid role="list">
                  {relatedPosts.map((relatedPost) => (
                    <BlogCard key={relatedPost.id} post={relatedPost} />
                  ))}
                </RelatedGrid>
              </RelatedContent>
            </RelatedContentWrapper>
          </RelatedSection>
        )}

        <Footer />
      </PageRightContent>
    </Container>
  );
}
