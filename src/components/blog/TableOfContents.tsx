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
  padding: 0;
  background: transparent;
  border-radius: 0;
  border: none;
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
`;

const TOCHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: rgba(255, 255, 255, 0.5);
  margin-bottom: 20px;
  padding-bottom: 12px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  flex-shrink: 0;

  svg {
    width: 14px;
    height: 14px;
  }
`;

const TOCList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  flex: 1;
  overflow-y: auto;
  min-height: 0;
  padding-right: 8px;
  padding-bottom: 40px;

  /* Liquid Glass Scrollbar */
  &::-webkit-scrollbar {
    width: 4px;
  }
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.15);
    border-radius: 4px;
  }
  &::-webkit-scrollbar-thumb:hover {
    background: rgba(255, 255, 255, 0.25);
  }
`;

const TOCItem = styled.li<{ $level: number; $isActive: boolean }>`
  margin-bottom: 4px;
  padding-left: ${({ $level }) => ($level === 3 ? "16px" : "0")};

  a {
    display: block;
    font-size: ${({ $level }) => ($level === 2 ? "13px" : "12px")};
    font-weight: ${({ $level }) => ($level === 2 ? "500" : "400")};
    color: ${({ $isActive }) =>
      $isActive ? "var(--accent)" : "rgba(255, 255, 255, 0.6)"};
    text-decoration: none;
    line-height: 1.5;
    padding: 8px 12px;
    border-radius: 8px;
    
    background: ${({ $isActive }) =>
      $isActive ? "rgba(255, 255, 255, 0.1)" : "transparent"};
    transition: all 0.2s ease;

    &:hover {
      color: white;
      background: rgba(255, 255, 255, 0.05);
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
