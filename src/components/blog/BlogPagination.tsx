"use client";

import styled from "styled-components";
import { ChevronLeft, ChevronRight } from "lucide-react";

const PaginationWrapper = styled.nav`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-top: 48px;
`;

const PageButton = styled.a<{ $active?: boolean; $disabled?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 40px;
  height: 40px;
  padding: 0 12px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  text-decoration: none;
  transition: all 0.2s ease;
  cursor: ${({ $disabled }) => ($disabled ? "not-allowed" : "pointer")};
  opacity: ${({ $disabled }) => ($disabled ? 0.5 : 1)};
  pointer-events: ${({ $disabled }) => ($disabled ? "none" : "auto")};

  ${({ $active }) =>
    $active
      ? `
    background: var(--primary-500);
    color: white;
  `
      : `
    background: var(--bg-alt);
    color: var(--text-secondary);
    border: 1px solid var(--border-color);

    &:hover {
      background: var(--surface-color);
      color: var(--text-color);
    }
  `}

  svg {
    width: 18px;
    height: 18px;
  }
`;

const Ellipsis = styled.span`
  color: var(--text-muted);
  padding: 0 4px;
`;

interface BlogPaginationProps {
  currentPage: number;
  totalPages: number;
  baseUrl?: string;
}

export function BlogPagination({
  currentPage,
  totalPages,
  baseUrl = "/blog",
}: BlogPaginationProps) {
  if (totalPages <= 1) return null;

  const getPageUrl = (page: number) => {
    if (page === 1) return baseUrl;
    return `${baseUrl}?page=${page}`;
  };

  const getPageNumbers = () => {
    const pages: (number | "ellipsis")[] = [];
    const showEllipsisThreshold = 7;

    if (totalPages <= showEllipsisThreshold) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);

      if (currentPage > 3) {
        pages.push("ellipsis");
      }

      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (currentPage < totalPages - 2) {
        pages.push("ellipsis");
      }

      pages.push(totalPages);
    }

    return pages;
  };

  return (
    <PaginationWrapper aria-label="Blog pagination">
      <PageButton
        href={getPageUrl(currentPage - 1)}
        $disabled={currentPage === 1}
        aria-label="Previous page"
      >
        <ChevronLeft />
      </PageButton>

      {getPageNumbers().map((page, index) =>
        page === "ellipsis" ? (
          <Ellipsis key={`ellipsis-${index}`}>...</Ellipsis>
        ) : (
          <PageButton
            key={page}
            href={getPageUrl(page)}
            $active={page === currentPage}
            aria-label={`Page ${page}`}
            aria-current={page === currentPage ? "page" : undefined}
          >
            {page}
          </PageButton>
        )
      )}

      <PageButton
        href={getPageUrl(currentPage + 1)}
        $disabled={currentPage === totalPages}
        aria-label="Next page"
      >
        <ChevronRight />
      </PageButton>
    </PaginationWrapper>
  );
}
