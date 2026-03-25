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
  border-radius: 20px;
  padding: ${({ $variant }) => ($variant === "inline" ? "24px" : "40px 32px")};
  margin: ${({ $variant }) => ($variant === "inline" ? "32px 0" : "64px 0")};
  
  /* Liquid Glass Styling */
  background: rgba(255, 255, 255, 0.02);
  backdrop-filter: blur(40px) saturate(200%);
  -webkit-backdrop-filter: blur(40px) saturate(200%);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 
    0 10px 40px rgba(0, 0, 0, 0.2), 
    inset 0 1px 1px rgba(255, 255, 255, 0.1);
  
  /* Add subtle glow behind CTA */
  &::before {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(circle at center, rgba(238, 90, 90, 0.05) 0%, transparent 60%);
    z-index: 0;
    pointer-events: none;
  }

  @media (max-width: 768px) {
    padding: ${({ $variant }) => ($variant === "inline" ? "20px" : "32px 24px")};
  }
`;

const CTAContent = styled.div<{ $variant: CTAVariant }>`
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 24px;
  color: #fff;

  @media (min-width: 768px) {
    flex-direction: row;
    text-align: left;
    align-items: center;
    gap: 32px;
  }
`;

/* Icons are removed for an Apple Minimalist look */
const IconWrapper = styled.div<{ $variant: CTAVariant }>`
  display: none; 
`;

const TextContent = styled.div`
  flex: 1;
`;

const CTATitle = styled.h3<{ $variant: CTAVariant }>`
  font-size: ${({ $variant }) => ($variant === "inline" ? "20px" : "28px")};
  font-weight: 700;
  margin: 0 0 12px 0;
  color: #ffffff;
  line-height: 1.2;
  letter-spacing: -0.02em;

  @media (max-width: 768px) {
    font-size: ${({ $variant }) => ($variant === "inline" ? "18px" : "24px")};
  }
`;

const CTADescription = styled.p<{ $variant: CTAVariant }>`
  font-size: ${({ $variant }) => ($variant === "inline" ? "14px" : "16px")};
  margin: 0;
  color: rgba(255, 255, 255, 0.6);
  line-height: 1.6;

  @media (max-width: 768px) {
    font-size: 14px;
  }
`;

const CTAButton = styled(Link)<{ $variant: CTAVariant }>`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  border-radius: 9999px;
  font-size: 15px;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.2s ease;
  flex-shrink: 0;
  
  /* Liquid Glass Button Style */
  color: white;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0) 100%),
    rgba(238, 90, 90, 0.9);
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.3), 0 4px 12px rgba(238, 90, 90, 0.2);

  &:hover {
    transform: translateY(-2px);
    background: linear-gradient(180deg, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0) 100%),
      rgba(238, 90, 90, 1);
    box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.3), 0 6px 16px rgba(238, 90, 90, 0.3);
  }

  svg {
    width: 16px;
    height: 16px;
    transition: transform 0.2s ease;
  }

  &:hover svg {
    transform: translateX(4px);
  }
`;

const FeatureList = styled.ul<{ $variant: CTAVariant }>`
  display: flex;
  flex-wrap: wrap;
  gap: 12px 24px;
  margin: 20px 0 0 0;
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
  gap: 6px;
  font-size: 13px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.5);

  svg {
    width: 14px;
    height: 14px;
    color: rgba(255, 255, 255, 0.8);
    opacity: 0.5;
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
      "Stop sending the same resume everywhere. Get a unique, ATS-optimized CV for every job you apply to — plus cover letters, interview prep, and career insights.",
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

// Sticky Sidebar CTA (Not used in new design, left for compatibility but restyled)
const SidebarCTAWrapper = styled.div`
  background: rgba(255, 255, 255, 0.02);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 24px;
  text-align: center;
`;

const SidebarIcon = styled.div`
  display: none; /* Removing icon */
`;

const SidebarTitle = styled.h4`
  font-size: 16px;
  font-weight: 700;
  margin: 0 0 8px 0;
  color: white;
`;

const SidebarDescription = styled.p`
  font-size: 14px;
  color: rgba(255, 255, 255, 0.6);
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
  border-radius: 9999px;
  font-size: 14px;
  font-weight: 600;
  text-decoration: none;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0) 100%), rgba(238, 90, 90, 0.9);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: all 0.2s ease;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.3);

  &:hover {
    background: linear-gradient(180deg, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0) 100%), rgba(238, 90, 90, 1);
    transform: translateY(-1px);
  }

  svg {
    width: 16px;
    height: 16px;
    transition: transform 0.2s ease;
  }
  
  &:hover svg {
    transform: translateX(4px);
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
