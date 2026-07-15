"use client";

import { useState, useEffect } from "react";
import styled from "styled-components";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { BlogPostWithRelations } from "@/types/blog";

const POSTS_PER_PAGE = 8;

const BentoGridWrapper = styled.div`
  display: grid;
  gap: 20px;
  max-width: 100%;
  margin: 0 auto;
  grid-template-columns: 1fr;

  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
    grid-auto-flow: dense;
    align-items: start;
  }
`;

const CardLink = styled(Link)`
  position: relative;
  display: flex;
  flex-direction: column;
  border-radius: 20px;
  overflow: hidden;
  text-decoration: none;
  color: inherit;
  background: var(--bg-color);
  transition: transform 0.5s cubic-bezier(0.25, 1, 0.5, 1),
    box-shadow 0.5s cubic-bezier(0.25, 1, 0.5, 1);

  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);

  @media (prefers-color-scheme: dark) {
    background: rgba(255, 255, 255, 0.04);
    box-shadow: none;
  }

  &:hover {
    transform: scale(1.02);
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.08);

    @media (prefers-color-scheme: dark) {
      box-shadow: 0 12px 40px rgba(0, 0, 0, 0.3);
    }
  }

  &:active {
    transform: scale(0.98);
  }

  &.featured {
    @media (min-width: 768px) {
      grid-column: span 2;
      min-height: 360px;
    }
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

  .featured & {
    @media (min-width: 768px) {
      width: 55%;
      aspect-ratio: unset;
      position: absolute;
      top: 0;
      left: 0;
      bottom: 0;
    }
  }
`;

const CardBody = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 20px;
  flex: 1;

  .featured & {
    @media (min-width: 768px) {
      padding: 32px;
      margin-left: 55%;
      justify-content: center;
    }
  }
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

  .featured & {
    @media (min-width: 768px) {
      font-size: 28px;
      letter-spacing: -0.5px;
      -webkit-line-clamp: 3;
    }
  }
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

  .featured & {
    @media (min-width: 768px) {
      font-size: 15px;
      -webkit-line-clamp: 3;
    }
  }
`;

const CardDate = styled.span`
  font-size: 13px;
  color: var(--text-muted);
  margin-top: 14px;

  .featured & {
    @media (min-width: 768px) {
      margin-top: 20px;
    }
  }
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
    margin-bottom: 8px;
  }

  p {
    font-size: 16px;
  }
`;

const PaginationWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  margin-top: 48px;
`;

const PageButton = styled(Link)<{ $active?: boolean; $disabled?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 40px;
  height: 40px;
  padding: 0 12px;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 500;
  border: none;
  cursor: pointer;
  transition: all 0.25s cubic-bezier(0.25, 1, 0.5, 1);
  text-decoration: none;

  ${({ $active }) =>
    $active
      ? `
    background: var(--text-color);
    color: var(--bg-color);
  `
      : `
    background: transparent;
    color: var(--text-secondary);

    &:hover {
      background: rgba(128, 128, 128, 0.1);
      color: var(--text-color);
    }
  `}

  ${({ $disabled }) =>
    $disabled &&
    `
    opacity: 0.3;
    pointer-events: none;
  `}

  svg {
    width: 18px;
    height: 18px;
  }
`;

const PageInfo = styled.span`
  font-size: 13px;
  color: var(--text-muted);
  margin: 0 4px;
  user-select: none;
`;

const GridContainer = styled.div`
  position: relative;
  min-height: 400px;
`;

// Direct child of the grid — this is the actual grid item, so the
// full-width span has to live here (not on the nested CardLink).
const GridItem = styled.div<{ $featured?: boolean; $hidden?: boolean }>`
  ${({ $featured }) =>
    $featured &&
    `
    @media (min-width: 768px) {
      grid-column: span 2;
    }
  `}

  ${({ $hidden }) =>
    $hidden &&
    `
    position: absolute;
    width: 1px;
    height: 1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  `}
`;

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
  featured?: boolean;
}

const BlogBentoItem = ({ post, index, featured }: BlogBentoItemProps) => {
  const formattedDate = post.published_at
    ? new Date(post.published_at).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : "";

  return (
    <CardLink
      href={`/blog/${post.slug}`}
      className={cn(featured && "featured")}
    >
      <CardImage>
        {post.featured_image ? (
          <Image
            src={post.featured_image}
            alt={post.featured_image_alt || post.title}
            fill
            sizes={
              featured
                ? "(max-width: 768px) 100vw, 55vw"
                : "(max-width: 768px) 100vw, 50vw"
            }
            style={{ objectFit: "cover" }}
            loading={index < 3 ? "eager" : "lazy"}
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
};

const getLayoutPattern = (index: number): boolean => {
  // Bookend layout per page of 8:
  //   featured (full-width) | 6 normal (2 cols x 3 rows) | featured (full-width)
  // i.e. the first and last post of each page span both columns.
  const posInPage = ((index % POSTS_PER_PAGE) + POSTS_PER_PAGE) % POSTS_PER_PAGE;
  return posInPage === 0 || posInPage === POSTS_PER_PAGE - 1;
};

interface BlogBentoGridProps {
  posts: BlogPostWithRelations[];
}

export function BlogBentoGrid({ posts }: BlogBentoGridProps) {
  const searchParams = useSearchParams();
  const pageParam = searchParams.get("page");
  
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    if (pageParam) {
      setCurrentPage(parseInt(pageParam, 10) || 1);
    } else {
      setCurrentPage(1);
    }
  }, [pageParam]);

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

  const createPageUrl = (pageNumber: number) => {
    const params = new URLSearchParams(searchParams.toString());
    if (pageNumber === 1) {
      params.delete("page");
    } else {
      params.set("page", pageNumber.toString());
    }
    const query = params.toString();
    return query ? `?${query}` : "/blog";
  };

  const handlePageClick = () => {
    const gridElement = document.getElementById("blog-bento-grid");
    if (gridElement) {
      gridElement.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const getPageNumbers = (): (number | "ellipsis")[] => {
    const pages: (number | "ellipsis")[] = [];

    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push("ellipsis");
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
      if (currentPage < totalPages - 2) pages.push("ellipsis");
      pages.push(totalPages);
    }

    return pages;
  };

  return (
    <GridContainer id="blog-bento-grid">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentPage}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          <BentoGrid>
            {posts.map((post, index) => {
              const postPage = Math.floor(index / POSTS_PER_PAGE) + 1;
              const isCurrentPage = postPage === currentPage;
              const featured = getLayoutPattern(index);

              return (
                <GridItem
                  key={post.id}
                  $featured={featured}
                  $hidden={!isCurrentPage}
                  aria-hidden={!isCurrentPage}
                >
                  <BlogBentoItem
                    post={post}
                    index={index}
                    featured={featured}
                  />
                </GridItem>
              );
            })}
          </BentoGrid>
        </motion.div>
      </AnimatePresence>

      {totalPages > 1 && (
        <PaginationWrapper>
          <PageButton
            href={createPageUrl(currentPage - 1)}
            onClick={handlePageClick}
            $disabled={currentPage === 1}
            scroll={false}
            aria-label="Previous page"
          >
            <ChevronLeft />
          </PageButton>

          {getPageNumbers().map((page, index) =>
            page === "ellipsis" ? (
              <PageInfo key={`ellipsis-${index}`}>...</PageInfo>
            ) : (
              <PageButton
                key={page}
                href={createPageUrl(page as number)}
                onClick={handlePageClick}
                $active={page === currentPage}
                scroll={false}
                aria-label={`Page ${page}`}
              >
                {page}
              </PageButton>
            )
          )}

          <PageButton
            href={createPageUrl(currentPage + 1)}
            onClick={handlePageClick}
            $disabled={currentPage === totalPages}
            scroll={false}
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
