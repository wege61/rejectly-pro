"use client";

import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Link from "next/link";
import { ArrowLeft, Share2, ArrowUpRight, Search } from "lucide-react";
import { ROUTES } from "@/lib/constants";

const HeaderContainer = styled.header`
  position: fixed;
  top: 0;
  left: 340px; /* Aligned with PageRightContent */
  right: 0;
  z-index: 1000;
  padding: 16px 32px;
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);

  @media (max-width: 1024px) {
    left: 0;
    padding: 12px 16px;
  }
`;

const GlassPill = styled.div<{ $isScrolled: boolean }>`
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 16px 10px 20px;
  border-radius: 9999px;
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  
  background: ${({ $isScrolled }) => ($isScrolled ? "rgba(18, 18, 22, 0.65)" : "transparent")};
  backdrop-filter: ${({ $isScrolled }) => ($isScrolled ? "blur(40px) saturate(200%)" : "none")};
  -webkit-backdrop-filter: ${({ $isScrolled }) => ($isScrolled ? "blur(40px) saturate(200%)" : "none")};
  border: 1px solid ${({ $isScrolled }) => ($isScrolled ? "rgba(255, 255, 255, 0.12)" : "transparent")};
  box-shadow: ${({ $isScrolled }) => ($isScrolled ? "0 12px 40px rgba(0, 0, 0, 0.4), inset 0 1px 1px rgba(255, 255, 255, 0.15)" : "none")};
`;

const LeftSection = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  flex: 1;
  min-width: 0;
`;

const BackButton = styled(Link)<{ $isScrolled: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  transition: all 0.3s ease;
  flex-shrink: 0;

  background: ${({ $isScrolled }) => ($isScrolled ? "transparent" : "rgba(255, 255, 255, 0.15)")};
  backdrop-filter: ${({ $isScrolled }) => ($isScrolled ? "none" : "blur(40px) saturate(200%)")};
  -webkit-backdrop-filter: ${({ $isScrolled }) => ($isScrolled ? "none" : "blur(40px) saturate(200%)")};
  color: white;
  border: 1px solid ${({ $isScrolled }) => ($isScrolled ? "transparent" : "rgba(255, 255, 255, 0.2)")};
  box-shadow: ${({ $isScrolled }) => ($isScrolled ? "none" : "0 8px 32px rgba(0, 0, 0, 0.2)")};

  &:hover {
    background: ${({ $isScrolled }) => ($isScrolled ? "rgba(255, 255, 255, 0.1)" : "rgba(255, 255, 255, 0.25)")};
    color: white;
  }

  svg {
    width: 16px;
    height: 16px;
  }
`;

const TitleWrapper = styled.div<{ $isScrolled: boolean }>`
  display: flex;
  flex-direction: column;
  min-width: 0;
  flex: 1;
  transition: opacity 0.3s ease, transform 0.3s ease;
  opacity: ${({ $isScrolled }) => ($isScrolled ? 1 : 0)};
  transform: ${({ $isScrolled }) => ($isScrolled ? "translateY(0)" : "translateY(4px)")};
  pointer-events: ${({ $isScrolled }) => ($isScrolled ? "auto" : "none")};
`;

const ArticleTitle = styled.h3`
  font-size: 14px;
  font-weight: 600;
  color: white;
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  letter-spacing: -0.01em;
`;

const ProgressBarWrapper = styled.div`
  width: 100%;
  height: 3px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  margin-top: 6px;
  overflow: hidden;
`;

const ProgressFill = styled.div<{ $progress: number }>`
  height: 100%;
  background: linear-gradient(90deg, var(--primary-500), var(--primary-400));
  width: ${({ $progress }) => $progress}%;
  transition: width 0.1s linear;
  border-radius: 4px;
`;

const RightSection = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  flex-shrink: 0;
  margin-left: 24px;
`;

const IconButton = styled.button<{ $isScrolled: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.3s ease;

  background: ${({ $isScrolled }) => ($isScrolled ? "transparent" : "rgba(255, 255, 255, 0.15)")};
  backdrop-filter: ${({ $isScrolled }) => ($isScrolled ? "none" : "blur(40px) saturate(200%)")};
  -webkit-backdrop-filter: ${({ $isScrolled }) => ($isScrolled ? "none" : "blur(40px) saturate(200%)")};
  color: white;
  border: 1px solid ${({ $isScrolled }) => ($isScrolled ? "transparent" : "rgba(255, 255, 255, 0.2)")};
  box-shadow: ${({ $isScrolled }) => ($isScrolled ? "none" : "0 8px 32px rgba(0, 0, 0, 0.2)")};

  &:hover {
    color: white;
    background: ${({ $isScrolled }) => ($isScrolled ? "rgba(255, 255, 255, 0.1)" : "rgba(255, 255, 255, 0.25)")};
  }

  svg {
    width: 18px;
    height: 18px;
  }
`;

const CTAButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  font-weight: 600;
  color: white;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0) 100%),
    rgba(238, 90, 90, 0.9);
  padding: 10px 20px;
  border-radius: 9999px;
  text-decoration: none;
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: all 0.2s ease;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.3);

  &:hover {
    background: linear-gradient(180deg, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0) 100%),
      rgba(238, 90, 90, 1);
  }

  svg {
    width: 14px;
    height: 14px;
  }

  @media (max-width: 640px) {
    display: none;
  }
`;

export function ContextualBlogHeader({ title, url }: { title: string; url: string }) {
  const [readingProgress, setReadingProgress] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setIsScrolled(currentScrollY > 50);

      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const maxScroll = documentHeight - windowHeight;
      
      if (maxScroll > 0) {
        const progress = Math.min(100, Math.max(0, (currentScrollY / maxScroll) * 100));
        setReadingProgress(progress);
      } else {
        setReadingProgress(100);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // Initial check

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleShare = (e: React.MouseEvent) => {
    e.preventDefault();
    const shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`;
    window.open(shareUrl, "_blank");
  };

  return (
    <HeaderContainer>
      <GlassPill $isScrolled={isScrolled}>
        <LeftSection>
          <BackButton $isScrolled={isScrolled} href="/blog" aria-label="Back to Blog">
            <ArrowLeft />
          </BackButton>
          <TitleWrapper $isScrolled={isScrolled}>
            <ArticleTitle>{title}</ArticleTitle>
            <ProgressBarWrapper>
              <ProgressFill $progress={readingProgress} />
            </ProgressBarWrapper>
          </TitleWrapper>
        </LeftSection>

        <RightSection>
          <IconButton $isScrolled={isScrolled} onClick={() => console.log('Search clicked')} aria-label="Search Articles" title="Search">
            <Search />
          </IconButton>
          <IconButton $isScrolled={isScrolled} onClick={handleShare} aria-label="Share Article" title="Share on X">
            <Share2 />
          </IconButton>
          <CTAButton href={ROUTES.AUTH.SIGNUP}>
            Get Started
            <ArrowUpRight />
          </CTAButton>
        </RightSection>
      </GlassPill>
    </HeaderContainer>
  );
}
