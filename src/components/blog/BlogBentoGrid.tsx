"use client";

import { useState } from "react";
import styled from "styled-components";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, Clock, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { BlogPostWithRelations } from "@/types/blog";

const POSTS_PER_PAGE = 6;

// BentoGrid styled components
const BentoGridWrapper = styled.div`
  display: grid;
  gap: 16px;
  max-width: 100%;
  margin: 0 auto;

  @media (min-width: 768px) {
    grid-template-columns: repeat(3, 1fr);
    grid-auto-flow: dense;
    align-items: start;
  }
`;

const BentoGridItemWrapper = styled(Link)`
  position: relative;
  display: flex;
  flex-direction: column;
  border-radius: 24px;
  background: var(--bg-alt);
  overflow: hidden;
  transition: all 0.3s ease;
  min-height: 380px;
  text-decoration: none;
  color: inherit;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: inherit;
    padding: 1px;
    background: linear-gradient(
      180deg,
      rgba(255, 107, 107, 0.2) 0%,
      rgba(255, 107, 107, 0.05) 100%
    );
    -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
    pointer-events: none;
  }

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);

    &::before {
      background: linear-gradient(
        180deg,
        rgba(255, 107, 107, 0.4) 0%,
        rgba(255, 107, 107, 0.1) 100%
      );
    }
  }

  &.md-col-span-2 {
    @media (min-width: 768px) {
      grid-column: span 2;
    }
  }

  @media (max-width: 767px) {
    min-height: 340px;
  }
`;

const ImageHeader = styled.div`
  position: relative;
  width: 100%;
  height: 180px;
  overflow: hidden;
  background: var(--surface-color);

  @media (min-width: 768px) {
    height: 200px;
  }
`;

const PostImageWrapper = styled(motion.div)`
  position: relative;
  width: 100%;
  height: 100%;
`;

const PlaceholderImage = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(
    135deg,
    rgba(255, 107, 107, 0.1) 0%,
    rgba(255, 107, 107, 0.05) 100%
  );

  svg {
    width: 48px;
    height: 48px;
    color: var(--primary-500);
    opacity: 0.5;
  }
`;

const DotBackground = styled.div`
  position: absolute;
  inset: 0;
  background-image: radial-gradient(
    var(--text-muted) 1px,
    transparent 1px
  );
  background-size: 16px 16px;
  opacity: 0.1;
`;

const ItemContent = styled.div`
  padding: 20px 24px 24px;
  display: flex;
  flex-direction: column;
  flex: 1;
  transition: transform 0.3s ease;

  ${BentoGridItemWrapper}:hover & {
    transform: translateY(-2px);
  }
`;

const Category = styled.span`
  display: inline-block;
  font-size: 11px;
  font-weight: 700;
  color: var(--landing-button);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 10px;
  padding: 4px 10px;
  background: rgba(255, 107, 107, 0.1);
  border-radius: 20px;
  width: fit-content;
`;

const ItemTitle = styled.h3`
  font-size: 17px;
  font-weight: 700;
  color: var(--text-color);
  line-height: 1.4;
  margin: 0 0 10px 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const ItemDescription = styled.p`
  font-size: 14px;
  color: var(--text-secondary);
  line-height: 1.6;
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  flex: 1;
`;

const MetaWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid var(--border-color);
`;

const Meta = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 12px;
  color: var(--text-muted);
`;

const MetaItem = styled.span`
  display: flex;
  align-items: center;
  gap: 4px;

  svg {
    width: 13px;
    height: 13px;
  }
`;

const ReadMore = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 13px;
  font-weight: 600;
  color: var(--landing-button);
  transition: gap 0.2s ease;

  ${BentoGridItemWrapper}:hover & {
    gap: 8px;
  }

  svg {
    width: 14px;
    height: 14px;
  }
`;

const Tags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 12px;
`;

const Tag = styled.span`
  font-size: 11px;
  color: var(--text-secondary);
  background: var(--surface-color);
  padding: 3px 8px;
  border-radius: 10px;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 80px 24px;
  color: var(--text-secondary);
  grid-column: 1 / -1;

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

// Pagination styled components
const PaginationWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-top: 40px;
`;

const PageButton = styled.button<{ $active?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 42px;
  height: 42px;
  padding: 0 14px;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 600;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;

  ${({ $active }) =>
    $active
      ? `
    background: var(--landing-button);
    color: white;
    box-shadow: 0 4px 12px rgba(248, 73, 56, 0.3);
  `
      : `
    background: var(--bg-alt);
    color: var(--text-secondary);
    border: 1px solid var(--border-color);

    &:hover {
      background: var(--surface-color);
      color: var(--text-color);
      border-color: var(--landing-button);
    }
  `}

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
    &:hover {
      background: var(--bg-alt);
      color: var(--text-secondary);
      border-color: var(--border-color);
    }
  }

  svg {
    width: 18px;
    height: 18px;
  }
`;

const PageInfo = styled.span`
  font-size: 13px;
  color: var(--text-secondary);
  margin: 0 8px;
`;

const GridContainer = styled.div`
  position: relative;
  min-height: 400px;
`;

// Bento Grid Components
const BentoGrid = ({
  className,
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) => {
  return (
    <BentoGridWrapper className={cn(className)}>
      {children}
    </BentoGridWrapper>
  );
};

interface BlogBentoItemProps {
  post: BlogPostWithRelations;
  className?: string;
  index: number;
}

const BlogBentoItem = ({ post, className, index }: BlogBentoItemProps) => {
  const isColSpan2 = className?.includes("md:col-span-2");

  const formattedDate = post.published_at
    ? new Date(post.published_at).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "";

  return (
    <BentoGridItemWrapper
      href={`/blog/${post.slug}`}
      className={cn(isColSpan2 && "md-col-span-2", className)}
    >
      <ImageHeader>
        {post.featured_image ? (
          <PostImageWrapper
            initial={{ scale: 1 }}
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
          >
            <Image
              src={post.featured_image}
              alt={post.featured_image_alt || post.title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
              style={{ objectFit: "cover" }}
              loading={index < 3 ? "eager" : "lazy"}
            />
          </PostImageWrapper>
        ) : (
          <>
            <DotBackground />
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
          </>
        )}
      </ImageHeader>

      <ItemContent>
        {post.category?.name && (
          <Category>{post.category.name}</Category>
        )}
        <ItemTitle>{post.title}</ItemTitle>
        <ItemDescription>{post.excerpt}</ItemDescription>

        {post.tags && post.tags.length > 0 && (
          <Tags>
            {post.tags.slice(0, 2).map((tag) => (
              <Tag key={tag.id}>{tag.name}</Tag>
            ))}
          </Tags>
        )}

        <MetaWrapper>
          <Meta>
            {formattedDate && (
              <MetaItem>
                <Calendar />
                {formattedDate}
              </MetaItem>
            )}
            <MetaItem>
              <Clock />
              {post.reading_time_minutes} min
            </MetaItem>
          </Meta>
          <ReadMore>
            Read <ArrowRight />
          </ReadMore>
        </MetaWrapper>
      </ItemContent>
    </BentoGridItemWrapper>
  );
};

// Determine layout pattern for posts
const getLayoutClass = (index: number, totalPosts: number): string => {
  // Pattern that fills all 3 columns in each row (7 items per cycle):
  // Row 1: [2-col] [1-col]     = 3 cols (index 0, 1)
  // Row 2: [1-col] [1-col] [1-col] = 3 cols (index 2, 3, 4)
  // Row 3: [1-col] [2-col]     = 3 cols (index 5, 6)
  // Repeat...

  const patternIndex = index % 7;

  // First item and last item in cycle span 2 columns
  if (patternIndex === 0 || patternIndex === 6) return "md:col-span-2";
  return "md:col-span-1";
};

interface BlogBentoGridProps {
  posts: BlogPostWithRelations[];
}

export function BlogBentoGrid({ posts }: BlogBentoGridProps) {
  const [currentPage, setCurrentPage] = useState(1);

  if (!posts || posts.length === 0) {
    return (
      <BentoGrid>
        <EmptyState>
          <h3>No posts yet</h3>
          <p>Check back soon for new content!</p>
        </EmptyState>
      </BentoGrid>
    );
  }

  const totalPages = Math.ceil(posts.length / POSTS_PER_PAGE);
  const startIndex = (currentPage - 1) * POSTS_PER_PAGE;
  const endIndex = startIndex + POSTS_PER_PAGE;
  const currentPosts = posts.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll to top of grid smoothly
    const gridElement = document.getElementById('blog-bento-grid');
    if (gridElement) {
      gridElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const getPageNumbers = (): (number | 'ellipsis')[] => {
    const pages: (number | 'ellipsis')[] = [];

    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);

      if (currentPage > 3) {
        pages.push('ellipsis');
      }

      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (currentPage < totalPages - 2) {
        pages.push('ellipsis');
      }

      pages.push(totalPages);
    }

    return pages;
  };

  return (
    <GridContainer id="blog-bento-grid">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentPage}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          <BentoGrid>
            {currentPosts.map((post, index) => (
              <BlogBentoItem
                key={post.id}
                post={post}
                index={index}
                className={getLayoutClass(index, currentPosts.length)}
              />
            ))}
          </BentoGrid>
        </motion.div>
      </AnimatePresence>

      {totalPages > 1 && (
        <PaginationWrapper>
          <PageButton
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            aria-label="Previous page"
          >
            <ChevronLeft />
          </PageButton>

          {getPageNumbers().map((page, index) =>
            page === 'ellipsis' ? (
              <PageInfo key={`ellipsis-${index}`}>...</PageInfo>
            ) : (
              <PageButton
                key={page}
                onClick={() => handlePageChange(page)}
                $active={page === currentPage}
                aria-label={`Page ${page}`}
              >
                {page}
              </PageButton>
            )
          )}

          <PageButton
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            aria-label="Next page"
          >
            <ChevronRight />
          </PageButton>
        </PaginationWrapper>
      )}
    </GridContainer>
  );
}

export default BlogBentoGrid;
