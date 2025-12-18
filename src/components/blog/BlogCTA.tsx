"use client";

import styled from "styled-components";
import Link from "next/link";
import { Sparkles, FileText, Target, ArrowRight, Zap } from "lucide-react";

type CTAVariant = "primary" | "secondary" | "inline";
type CTAType = "resume" | "cover-letter" | "general";

interface BlogCTAProps {
  type?: CTAType;
  variant?: CTAVariant;
}

const CTABox = styled.div<{ $variant: CTAVariant }>`
  position: relative;
  overflow: hidden;
  border-radius: 16px;
  padding: ${({ $variant }) => ($variant === "inline" ? "24px" : "32px 28px")};
  margin: ${({ $variant }) => ($variant === "inline" ? "32px 0" : "48px 0")};
  background: ${({ $variant }) =>
    $variant === "primary"
      ? "linear-gradient(135deg, #7c3aed 0%, #5b21b6 100%)"
      : $variant === "secondary"
      ? "linear-gradient(135deg, rgba(124, 58, 237, 0.1) 0%, rgba(91, 33, 182, 0.15) 100%)"
      : "var(--bg-alt)"};
  border: ${({ $variant }) =>
    $variant === "inline" ? "1px solid var(--border-color)" : "none"};

  @media (max-width: 768px) {
    padding: ${({ $variant }) => ($variant === "inline" ? "20px" : "24px 20px")};
  }
`;

const CTAContent = styled.div<{ $variant: CTAVariant }>`
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 20px;
  color: ${({ $variant }) => ($variant === "primary" ? "#ffffff" : "inherit")};

  @media (min-width: 768px) {
    flex-direction: row;
    text-align: left;
    align-items: flex-start;
    gap: 24px;
  }
`;

const IconWrapper = styled.div<{ $variant: CTAVariant }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 64px;
  height: 64px;
  border-radius: 16px;
  background: ${({ $variant }) =>
    $variant === "primary"
      ? "rgba(255, 255, 255, 0.2)"
      : "rgba(var(--primary-500-rgb), 0.15)"};
  flex-shrink: 0;

  svg {
    width: 32px;
    height: 32px;
    color: ${({ $variant }) =>
      $variant === "primary" ? "white" : "var(--primary-500)"};
  }
`;

const TextContent = styled.div`
  flex: 1;
`;

const CTATitle = styled.h3<{ $variant: CTAVariant }>`
  font-size: ${({ $variant }) => ($variant === "inline" ? "18px" : "24px")};
  font-weight: 700;
  margin: 0 0 10px 0;
  color: ${({ $variant }) => ($variant === "primary" ? "#ffffff" : "var(--text-color)")};
  line-height: 1.3;

  @media (max-width: 768px) {
    font-size: ${({ $variant }) => ($variant === "inline" ? "16px" : "20px")};
  }
`;

const CTADescription = styled.p<{ $variant: CTAVariant }>`
  font-size: ${({ $variant }) => ($variant === "inline" ? "14px" : "15px")};
  margin: 0;
  color: ${({ $variant }) => ($variant === "primary" ? "rgba(255, 255, 255, 0.9)" : "var(--text-secondary)")};
  line-height: 1.6;

  @media (max-width: 768px) {
    font-size: 14px;
  }
`;

const CTAButton = styled(Link)<{ $variant: CTAVariant }>`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: ${({ $variant }) =>
    $variant === "inline" ? "12px 20px" : "14px 28px"};
  border-radius: 12px;
  font-size: ${({ $variant }) => ($variant === "inline" ? "14px" : "16px")};
  font-weight: 600;
  text-decoration: none;
  transition: all 0.2s ease;
  flex-shrink: 0;
  background: ${({ $variant }) =>
    $variant === "primary" ? "white" : "var(--primary-500)"};
  color: ${({ $variant }) =>
    $variant === "primary" ? "var(--primary-600)" : "white"};

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px
      ${({ $variant }) =>
        $variant === "primary"
          ? "rgba(255, 255, 255, 0.3)"
          : "rgba(var(--primary-500-rgb), 0.4)"};
  }

  svg {
    width: 18px;
    height: 18px;
    transition: transform 0.2s ease;
  }

  &:hover svg {
    transform: translateX(4px);
  }
`;

const FeatureList = styled.ul<{ $variant: CTAVariant }>`
  display: flex;
  flex-wrap: wrap;
  gap: 8px 16px;
  margin: 14px 0 0 0;
  padding: 0;
  list-style: none;
  justify-content: center;

  @media (min-width: 768px) {
    justify-content: flex-start;
  }
`;

const FeatureItem = styled.li<{ $variant: CTAVariant }>`
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 12px;
  font-weight: 500;
  color: ${({ $variant }) => ($variant === "primary" ? "rgba(255, 255, 255, 0.9)" : "var(--text-secondary)")};

  svg {
    width: 12px;
    height: 12px;
    color: ${({ $variant }) => ($variant === "primary" ? "#fbbf24" : "var(--primary-500)")};
  }
`;

const ctaContent = {
  resume: {
    icon: Target,
    title: "Get Your Resume ATS-Ready",
    description:
      "Upload your resume and get instant AI-powered analysis. See your ATS score, find missing keywords, and get actionable suggestions to land more interviews.",
    buttonText: "Analyze My Resume",
    buttonLink: "/analyze",
    features: ["ATS Score Check", "Keyword Analysis", "Instant Results"],
  },
  "cover-letter": {
    icon: FileText,
    title: "Generate a Winning Cover Letter",
    description:
      "Stop struggling with blank pages. Our AI creates personalized, ATS-optimized cover letters tailored to each job posting in seconds.",
    buttonText: "Create Cover Letter",
    buttonLink: "/cover-letters",
    features: ["AI-Powered", "Job-Tailored", "ATS-Optimized"],
  },
  general: {
    icon: Sparkles,
    title: "Land More Interviews with AI",
    description:
      "Join thousands of job seekers who've increased their interview rate by 3x. Optimize your resume and cover letters with Rejectly.pro.",
    buttonText: "Get Started Free",
    buttonLink: "/signup",
    features: ["Free Analysis", "No Credit Card", "Instant Results"],
  },
};

export function BlogCTA({ type = "general", variant = "primary" }: BlogCTAProps) {
  const content = ctaContent[type];
  const Icon = content.icon;

  return (
    <CTABox $variant={variant}>
      <CTAContent $variant={variant}>
        <IconWrapper $variant={variant}>
          <Icon />
        </IconWrapper>
        <TextContent>
          <CTATitle $variant={variant}>{content.title}</CTATitle>
          <CTADescription $variant={variant}>
            {content.description}
          </CTADescription>
          {variant !== "inline" && (
            <FeatureList $variant={variant}>
              {content.features.map((feature) => (
                <FeatureItem key={feature} $variant={variant}>
                  <Zap />
                  {feature}
                </FeatureItem>
              ))}
            </FeatureList>
          )}
        </TextContent>
        <CTAButton href={content.buttonLink} $variant={variant}>
          {content.buttonText}
          <ArrowRight />
        </CTAButton>
      </CTAContent>
    </CTABox>
  );
}

// Sticky Sidebar CTA
const SidebarCTAWrapper = styled.div`
  background: linear-gradient(
    135deg,
    rgba(var(--primary-500-rgb), 0.08) 0%,
    rgba(var(--primary-700-rgb), 0.12) 100%
  );
  border: 1px solid rgba(var(--primary-500-rgb), 0.2);
  border-radius: 16px;
  padding: 24px;
  text-align: center;
`;

const SidebarIcon = styled.div`
  width: 48px;
  height: 48px;
  margin: 0 auto 16px;
  border-radius: 12px;
  background: rgba(var(--primary-500-rgb), 0.15);
  display: flex;
  align-items: center;
  justify-content: center;

  svg {
    width: 24px;
    height: 24px;
    color: var(--primary-500);
  }
`;

const SidebarTitle = styled.h4`
  font-size: 16px;
  font-weight: 700;
  margin: 0 0 8px 0;
  color: var(--text-color);
`;

const SidebarDescription = styled.p`
  font-size: 14px;
  color: var(--text-secondary);
  margin: 0 0 16px 0;
  line-height: 1.5;
`;

const SidebarButton = styled(Link)`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  padding: 12px 20px;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 600;
  text-decoration: none;
  background: var(--primary-500);
  color: white;
  transition: all 0.2s ease;

  &:hover {
    background: var(--primary-600);
    transform: translateY(-1px);
  }

  svg {
    width: 16px;
    height: 16px;
  }
`;

export function SidebarCTA({ type = "general" }: { type?: CTAType }) {
  const content = ctaContent[type];
  const Icon = content.icon;

  return (
    <SidebarCTAWrapper>
      <SidebarIcon>
        <Icon />
      </SidebarIcon>
      <SidebarTitle>{content.title}</SidebarTitle>
      <SidebarDescription>{content.description}</SidebarDescription>
      <SidebarButton href={content.buttonLink}>
        {content.buttonText}
        <ArrowRight />
      </SidebarButton>
    </SidebarCTAWrapper>
  );
}
