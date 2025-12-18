"use client";

import { useState, useEffect, useCallback } from "react";
import styled from "styled-components";
import { List } from "lucide-react";

export interface TOCItem {
  id: string;
  text: string;
  level: number;
}

const TOCContainer = styled.nav`
  padding: 20px;
  background: var(--bg-alt);
  border-radius: 12px;
  border: 1px solid var(--border-color);
`;

const TOCHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: var(--text-secondary);
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid var(--border-color);

  svg {
    width: 16px;
    height: 16px;
  }
`;

const TOCList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const TOCItem = styled.li<{ $level: number; $isActive: boolean }>`
  margin-bottom: 8px;
  padding-left: ${({ $level }) => ($level === 3 ? "16px" : "0")};

  a {
    display: block;
    font-size: ${({ $level }) => ($level === 2 ? "14px" : "13px")};
    font-weight: ${({ $level, $isActive }) =>
      $isActive ? "600" : $level === 2 ? "500" : "400"};
    color: ${({ $isActive }) =>
      $isActive ? "var(--primary-500)" : "var(--text-secondary)"};
    text-decoration: none;
    line-height: 1.5;
    padding: 6px 12px;
    border-radius: 6px;
    border-left: 2px solid
      ${({ $isActive }) =>
        $isActive ? "var(--primary-500)" : "transparent"};
    background: ${({ $isActive }) =>
      $isActive ? "rgba(var(--primary-500-rgb), 0.08)" : "transparent"};
    transition: all 0.2s ease;

    &:hover {
      color: var(--primary-500);
      background: rgba(var(--primary-500-rgb), 0.05);
    }
  }
`;

interface TableOfContentsProps {
  content: string;
}

export function extractHeadings(html: string): TOCItem[] {
  const headings: TOCItem[] = [];
  const regex = /<h([23])[^>]*>([^<]+)<\/h[23]>/gi;
  let match;

  while ((match = regex.exec(html)) !== null) {
    const level = parseInt(match[1], 10);
    const text = match[2].trim();
    const id = text
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .substring(0, 50);

    headings.push({ id, text, level });
  }

  return headings;
}

export function addHeadingIds(html: string, headings: TOCItem[]): string {
  let result = html;
  let headingIndex = 0;

  result = result.replace(/<h([23])([^>]*)>([^<]+)<\/h([23])>/gi, (match, level, attrs, text) => {
    if (headingIndex < headings.length) {
      const heading = headings[headingIndex];
      headingIndex++;
      // Check if id already exists
      if (attrs.includes('id=')) {
        return match;
      }
      return `<h${level}${attrs} id="${heading.id}">${text}</h${level}>`;
    }
    return match;
  });

  return result;
}

export function TableOfContents({ content }: TableOfContentsProps) {
  const [headings, setHeadings] = useState<TOCItem[]>([]);
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    const extractedHeadings = extractHeadings(content);
    setHeadings(extractedHeadings);
  }, [content]);

  const handleScroll = useCallback(() => {
    const headingElements = headings
      .map((h) => document.getElementById(h.id))
      .filter(Boolean);

    const scrollPosition = window.scrollY + 150;

    for (let i = headingElements.length - 1; i >= 0; i--) {
      const element = headingElements[i];
      if (element && element.offsetTop <= scrollPosition) {
        setActiveId(headings[i].id);
        return;
      }
    }

    if (headings.length > 0) {
      setActiveId(headings[0].id);
    }
  }, [headings]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [handleScroll]);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      const offset = 100;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
      setActiveId(id);
    }
  };

  if (headings.length < 2) {
    return null;
  }

  return (
    <TOCContainer aria-label="Table of contents">
      <TOCHeader>
        <List />
        On This Page
      </TOCHeader>
      <TOCList>
        {headings.map((heading) => (
          <TOCItem
            key={heading.id}
            $level={heading.level}
            $isActive={activeId === heading.id}
          >
            <a
              href={`#${heading.id}`}
              onClick={(e) => handleClick(e, heading.id)}
            >
              {heading.text}
            </a>
          </TOCItem>
        ))}
      </TOCList>
    </TOCContainer>
  );
}
