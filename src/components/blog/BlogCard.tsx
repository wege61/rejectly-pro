"use client";

import styled from "styled-components";
import Link from "next/link";
import { Calendar, Clock, ArrowRight } from "lucide-react";
import type { BlogPostWithRelations } from "@/types/blog";

const CardLink = styled(Link)`
  text-decoration: none;
  color: inherit;
  display: flex;
  flex-direction: column;
  height: 100%;
`;

const Card = styled.article`
  background: var(--bg-alt);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  overflow: hidden;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;

  &:hover {
    border-color: var(--primary-300);
    transform: translateY(-4px);
    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.1);
  }
`;

const ImageWrapper = styled.div`
  position: relative;
  width: 100%;
  aspect-ratio: 16 / 9;
  overflow: hidden;
  background: var(--surface-color);
`;

const Image = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;

  ${Card}:hover & {
    transform: scale(1.05);
  }
`;

const PlaceholderImage = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(
    135deg,
    rgba(var(--primary-500-rgb), 0.1) 0%,
    rgba(var(--primary-700-rgb), 0.1) 100%
  );

  svg {
    width: 48px;
    height: 48px;
    color: var(--primary-500);
    opacity: 0.5;
  }
`;

const Content = styled.div`
  padding: 24px;
  display: flex;
  flex-direction: column;
  flex: 1;
  height: 100%;
`;

const TopSection = styled.div`
  display: flex;
  flex-direction: column;
`;

const Category = styled.span`
  display: inline-block;
  font-size: 12px;
  font-weight: 600;
  color: var(--primary-500);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 12px;
  height: 18px;
`;

const Title = styled.h3`
  font-size: 20px;
  font-weight: 700;
  color: var(--text-color);
  margin-bottom: 12px;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  height: 56px;

  @media (max-width: 768px) {
    font-size: 18px;
    height: 50px;
  }
`;

const Excerpt = styled.p`
  font-size: 15px;
  color: var(--text-secondary);
  line-height: 1.6;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  height: 72px;
  margin-bottom: 0;
`;

const BottomSection = styled.div`
  margin-top: auto;
  padding-top: 16px;
  display: flex;
  flex-direction: column;
`;

const Meta = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  font-size: 13px;
  color: var(--text-muted);
`;

const MetaItem = styled.span`
  display: flex;
  align-items: center;
  gap: 6px;

  svg {
    width: 14px;
    height: 14px;
  }
`;

const Tags = styled.div`
  display: flex;
  flex-wrap: nowrap;
  gap: 8px;
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid var(--border-color);
  height: 44px;
  align-items: flex-start;
`;

const Tag = styled.span`
  font-size: 12px;
  color: var(--text-secondary);
  background: var(--surface-color);
  padding: 4px 10px;
  border-radius: 12px;
  line-height: 1.3;
  white-space: normal;
`;

const ReadMore = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  font-weight: 600;
  color: var(--primary-500);
  margin-top: 16px;
  transition: gap 0.2s ease;

  ${Card}:hover & {
    gap: 10px;
  }

  svg {
    width: 16px;
    height: 16px;
  }
`;

interface BlogCardProps {
  post: BlogPostWithRelations;
}

export function BlogCard({ post }: BlogCardProps) {
  const formattedDate = post.published_at
    ? new Date(post.published_at).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "";

  return (
    <Card>
      <CardLink href={`/blog/${post.slug}`}>
        <ImageWrapper>
          {post.featured_image ? (
            <Image src={post.featured_image} alt={post.featured_image_alt || post.title} />
          ) : (
            <PlaceholderImage>
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
                />
              </svg>
            </PlaceholderImage>
          )}
        </ImageWrapper>

        <Content>
          <TopSection>
            <Category>{post.category?.name || "\u00A0"}</Category>
            <Title>{post.title}</Title>
            <Excerpt>{post.excerpt || "\u00A0"}</Excerpt>
          </TopSection>

          <BottomSection>
            <Meta>
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

            <Tags>
              {post.tags && post.tags.length > 0 ? (
                post.tags.slice(0, 3).map((tag) => (
                  <Tag key={tag.id}>{tag.name}</Tag>
                ))
              ) : (
                <Tag style={{ visibility: "hidden" }}>Placeholder</Tag>
              )}
            </Tags>

            <ReadMore>
              Read More <ArrowRight />
            </ReadMore>
          </BottomSection>
        </Content>
      </CardLink>
    </Card>
  );
}
