"use client";

import React from "react";
import styled from "styled-components";
import Link from "next/link";
import Image from "next/image";
import { Carousel } from "@/components/ui/AppleCarousel";
import { useLatestPosts } from "@/components/blog/BlogDataContext";
import type { BlogPostWithRelations } from "@/types/blog";

const CardLink = styled(Link)`
  display: block;
  border-radius: 24px;
  overflow: hidden;
  position: relative;
  background-color: var(--bg-alt);
  height: 380px;
  width: 280px;
  text-decoration: none;
  transition: transform 0.4s cubic-bezier(0.25, 1, 0.5, 1), box-shadow 0.4s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);

  @media (min-width: 768px) {
    height: 480px;
    width: 340px;
  }

  &:hover {
    transform: scale(1.02);
    box-shadow: 0 12px 32px rgba(0, 0, 0, 0.1);
  }

  @media (prefers-color-scheme: dark) {
    box-shadow: none;
    &:hover {
      box-shadow: 0 12px 32px rgba(0, 0, 0, 0.4);
    }
  }
`;

const ImageWrapper = styled.div`
  position: absolute;
  inset: 0;
  z-index: 0;

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.85) 100%);
  }
`;

const ContentWrapper = styled.div`
  position: relative;
  z-index: 10;
  padding: 24px;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;

  @media (min-width: 768px) {
    padding: 32px;
  }
`;

const Category = styled.span`
  color: rgba(255, 255, 255, 0.8);
  font-size: 13px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 12px;
`;

const Title = styled.h3`
  color: white;
  font-size: 22px;
  font-weight: 600;
  line-height: 1.3;
  margin: 0;
  letter-spacing: -0.5px;

  @media (min-width: 768px) {
    font-size: 26px;
  }
`;

const SectionContainer = styled.section`
  padding: 100px 0;
  background-color: var(--bg-color);
  width: 100vw;
  position: relative;
  left: 50%;
  right: 50%;
  margin-left: -50vw;
  margin-right: -50vw;
  overflow: hidden;
`;

const HeaderContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto 64px auto;
  padding: 0 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  position: relative;
  z-index: 2;
`;

const HeaderText = styled.div`
  max-width: 600px;
  margin: 0 auto;
`;

const SectionTitle = styled.h2`
  font-size: 32px;
  font-weight: 800;
  color: var(--text-color);
  margin: 0 0 16px 0;
  letter-spacing: -0.5px;

  @media (min-width: 768px) {
    font-size: 48px;
  }
`;

const SectionSubtitle = styled.p`
  font-size: 18px;
  color: var(--text-secondary);
  margin: 0 auto;
  max-width: 600px;
  line-height: 1.6;
`;

const ViewAllLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-size: 16px;
  font-weight: 600;
  color: var(--primary-500);
  text-decoration: none;
  margin-top: 24px;
  transition: all 0.2s ease;

  &:hover {
    color: var(--primary-700);
    transform: translateX(4px);
  }

  svg {
    width: 20px;
    height: 20px;
  }
`;

export function FeaturedGuides() {
  const posts = useLatestPosts();

  if (!posts || posts.length === 0) {
    return null; // Return nothing if no posts are fetched
  }

  const carouselItems = posts.map((post, index) => {
    const url = `/blog/${post.slug}`;
    // Use the post's featured image if available, else use a placeholder from unsplash
    const src = post.featured_image || "https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=1200&h=630&fit=crop";
    const category = post.category?.name || "Career Advice";

    return (
      <CardLink key={post.id || index} href={url}>
        <ImageWrapper>
          <Image
            src={src}
            alt={post.title}
            fill
            style={{ objectFit: "cover" }}
            sizes="(max-width: 768px) 280px, 340px"
          />
        </ImageWrapper>
        <ContentWrapper>
          <Category>{category}</Category>
          <Title>{post.title}</Title>
        </ContentWrapper>
      </CardLink>
    );
  });

  return (
    <SectionContainer>
      <HeaderContainer>
        <HeaderText>
          <SectionTitle>Expert ATS Guides.</SectionTitle>
          <SectionSubtitle>
            Everything you need to know to beat the HR filters and land your first job.
          </SectionSubtitle>
        </HeaderText>
        <ViewAllLink href="/blog">
          View all guides
          <svg fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
          </svg>
        </ViewAllLink>
      </HeaderContainer>
      <Carousel items={carouselItems} />
    </SectionContainer>
  );
}
