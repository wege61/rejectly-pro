"use client";

import styled from "styled-components";
import Link from "next/link";
import Image from "next/image";
import type { BlogPostWithRelations } from "@/types/blog";

const CardLink = styled(Link)`
  position: relative;
  display: flex;
  flex-direction: column;
  border-radius: 20px;
  overflow: hidden;
  text-decoration: none;
  color: inherit;
  background: rgba(255, 255, 255, 0.05);
  transition: transform 0.5s cubic-bezier(0.25, 1, 0.5, 1),
    box-shadow 0.5s cubic-bezier(0.25, 1, 0.5, 1);

  &:hover {
    transform: scale(1.02);
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.3);
  }

  &:active {
    transform: scale(0.98);
  }

  @media (max-width: 767px) {
    border-radius: 16px;
  }
`;

const CardImage = styled.div`
  position: relative;
  width: 100%;
  aspect-ratio: 16 / 10;
  overflow: hidden;
  background: rgba(128, 128, 128, 0.06);
  flex-shrink: 0;

  img {
    transition: transform 0.6s cubic-bezier(0.25, 1, 0.5, 1);
  }

  ${CardLink}:hover & img {
    transform: scale(1.04);
  }
`;

const CardBody = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 20px;
  flex: 1;
`;

const CardCategory = styled.span`
  font-size: 12px;
  font-weight: 600;
  color: var(--accent);
  text-transform: uppercase;
  letter-spacing: 0.8px;
  margin-bottom: 8px;
`;

const CardTitle = styled.h3`
  font-size: 19px;
  font-weight: 700;
  color: var(--text-color);
  line-height: 1.3;
  margin: 0 0 8px 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  letter-spacing: -0.2px;
`;

const CardExcerpt = styled.p`
  font-size: 14px;
  color: var(--text-secondary);
  line-height: 1.55;
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const CardDate = styled.span`
  font-size: 13px;
  color: var(--text-muted);
  margin-top: 14px;
`;

interface BlogCardProps {
  post: BlogPostWithRelations;
}

export function BlogCard({ post }: BlogCardProps) {
  const formattedDate = post.published_at
    ? new Date(post.published_at).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : "";

  return (
    <CardLink href={`/blog/${post.slug}`}>
      <CardImage>
        {post.featured_image ? (
          <Image
            src={post.featured_image}
            alt={post.featured_image_alt || post.title}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            style={{ objectFit: "cover" }}
            loading="lazy"
          />
        ) : (
          <div
            style={{
              width: "100%",
              height: "100%",
              background:
                "linear-gradient(135deg, rgba(128,128,128,0.06) 0%, rgba(128,128,128,0.12) 100%)",
            }}
          />
        )}
      </CardImage>

      <CardBody>
        {post.category?.name && (
          <CardCategory>{post.category.name}</CardCategory>
        )}
        <CardTitle>{post.title}</CardTitle>
        <CardExcerpt>{post.excerpt}</CardExcerpt>
        <CardDate>{formattedDate}</CardDate>
      </CardBody>
    </CardLink>
  );
}
