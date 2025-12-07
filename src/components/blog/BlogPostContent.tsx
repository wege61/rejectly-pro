"use client";

import styled from "styled-components";
import { Calendar, Clock, User, Tag, ArrowLeft, Share2 } from "lucide-react";
import { BlogCard } from "./BlogCard";
import { Footer } from "@/components/ui/Footer";
import type { BlogPostWithRelations } from "@/types/blog";

const Container = styled.div`
  min-height: 100vh;
  background-color: var(--bg-color);
  color: var(--text-color);
`;

const HeroSection = styled.div`
  background: linear-gradient(
    135deg,
    rgba(var(--primary-500-rgb), 0.03) 0%,
    rgba(var(--primary-700-rgb), 0.06) 100%
  );
  padding: 100px 24px 70px;

  @media (max-width: 768px) {
    padding: 80px 16px 50px;
  }
`;

const HeroContent = styled.div`
  max-width: 800px;
  margin: 0 auto;
`;

const BackLink = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: var(--text-secondary);
  text-decoration: none;
  transition: color 0.2s ease;

  &:hover {
    color: var(--primary-500);
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
  margin-top: 32px;
`;

const CategoryBadge = styled.span`
  display: inline-block;
  font-size: 11px;
  font-weight: 600;
  color: var(--primary-500);
  background: rgba(var(--primary-500-rgb), 0.1);
  padding: 6px 14px;
  border-radius: 20px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  white-space: nowrap;
  margin-bottom: 8px;
`;

const Title = styled.h1`
  font-size: 44px;
  font-weight: 800;
  line-height: 1.15;
  margin: 0;

  @media (max-width: 768px) {
    font-size: 28px;
  }
`;

const Meta = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 20px;
  font-size: 14px;
  color: var(--text-secondary);
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

const FeaturedImageWrapper = styled.div`
  background: linear-gradient(
    to bottom,
    rgba(var(--primary-500-rgb), 0.03) 0%,
    var(--bg-color) 50%
  );
  padding: 40px 24px 60px;

  @media (max-width: 768px) {
    padding: 30px 16px 40px;
  }
`;

const FeaturedImage = styled.div`
  max-width: 900px;
  margin: 0 auto;

  img {
    width: 100%;
    border-radius: 16px;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.12);
  }
`;

const ArticleSection = styled.div`
  padding: 60px 24px;

  @media (max-width: 768px) {
    padding: 40px 16px;
  }
`;

const ArticleContent = styled.article`
  max-width: 720px;
  margin: 0 auto;
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
  padding: 60px 24px 80px;
  background: var(--bg-alt);
  border-top: 1px solid var(--border-color);

  @media (max-width: 768px) {
    padding: 40px 16px 60px;
  }
`;

const RelatedContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const RelatedTitle = styled.h2`
  font-size: 32px;
  font-weight: 700;
  text-align: center;
  margin-bottom: 48px;

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

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

interface BlogPostContentProps {
  post: BlogPostWithRelations;
  relatedPosts: BlogPostWithRelations[];
}

export function BlogPostContent({ post, relatedPosts }: BlogPostContentProps) {
  const formattedDate = post.published_at
    ? new Date(post.published_at).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "";

  const shareUrl = `https://www.rejectly.pro/blog/${post.slug}`;

  return (
    <Container>
      <HeroSection>
        <HeroContent>
          <BackLink href="/blog">
            <ArrowLeft />
            Back to Blog
          </BackLink>

          <TitleWrapper>
            {post.category && (
              <CategoryBadge>{post.category.name}</CategoryBadge>
            )}
            <Title>{post.title}</Title>

            <Meta>
              <MetaItem>
                <User />
                {post.author_name}
              </MetaItem>
              {formattedDate && (
                <MetaItem>
                  <Calendar />
                  {formattedDate}
                </MetaItem>
              )}
              <MetaItem>
                <Clock />
                {post.reading_time_minutes} min read
              </MetaItem>
            </Meta>
          </TitleWrapper>
        </HeroContent>
      </HeroSection>

      {post.featured_image && (
        <FeaturedImageWrapper>
          <FeaturedImage>
            <img
              src={post.featured_image}
              alt={post.featured_image_alt || post.title}
            />
          </FeaturedImage>
        </FeaturedImageWrapper>
      )}

      <ArticleSection>
        <ArticleContent>
          {/* Content is stored as HTML in Supabase */}
          <Content dangerouslySetInnerHTML={{ __html: post.content }} />

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
              href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(post.title)}`}
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
        </ArticleContent>
      </ArticleSection>

      {relatedPosts.length > 0 && (
        <RelatedSection>
          <RelatedContent>
            <RelatedTitle>Related Posts</RelatedTitle>
            <RelatedGrid>
              {relatedPosts.map((relatedPost) => (
                <BlogCard key={relatedPost.id} post={relatedPost} />
              ))}
            </RelatedGrid>
          </RelatedContent>
        </RelatedSection>
      )}

      <Footer />
    </Container>
  );
}
