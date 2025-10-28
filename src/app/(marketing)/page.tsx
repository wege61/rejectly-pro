"use client";

import styled, { keyframes } from "styled-components";
import { useState } from "react";

// ==================== ANIMATIONS ====================
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
`;

const pulse = keyframes`
  0%, 100% { opacity: 0.3; transform: scale(1); }
  50% { opacity: 0.5; transform: scale(1.1); }
`;

const spin = keyframes`
  to { transform: rotate(360deg); }
`;

const float = keyframes`
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-20px); }
`;

// ==================== ICONS ====================
const CheckIcon = () => (
  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M5 13l4 4L19 7"
    />
  </svg>
);

const XIcon = () => (
  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M6 18L18 6M6 6l12 12"
    />
  </svg>
);

const SparklesIcon = () => (
  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
    />
  </svg>
);

const ZapIcon = () => (
  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M13 10V3L4 14h7v7l9-11h-7z"
    />
  </svg>
);

const TargetIcon = () => (
  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);

const StarIcon = () => (
  <svg fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
  </svg>
);

const ArrowRightIcon = () => (
  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 5l7 7-7 7"
    />
  </svg>
);

const RocketIcon = () => (
  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M13 10V3L4 14h7v7l9-11h-7z"
    />
  </svg>
);

const ChevronDownIcon = () => (
  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M19 9l-7 7-7-7"
    />
  </svg>
);

// ==================== LAYOUT ====================
const Container = styled.div`
  min-height: 100vh;
  background-color: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.textPrimary};
`;

// ==================== HERO SECTION ====================
const HeroSection = styled.section`
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  padding: 80px 24px 60px;

  @media (max-width: 768px) {
    min-height: auto;
    padding: 60px 16px 40px;
  }
`;

const BackgroundBlur = styled.div`
  position: absolute;
  inset: 0;
  pointer-events: none;
`;

const BlurCircle = styled.div<{
  $delay?: string;
  $position: string;
  $color: string;
}>`
  position: absolute;
  width: 500px;
  height: 500px;
  border-radius: 50%;
  filter: blur(100px);
  opacity: 0.3;
  animation: ${pulse} 4s ease-in-out infinite;
  animation-delay: ${({ $delay }) => $delay || "0s"};
  background: ${({ $color }) => $color};
  ${({ $position }) => $position}
`;

const HeroContent = styled.div`
  position: relative;
  z-index: 1;
  max-width: 1100px;
  margin: 0 auto;
  text-align: center;
  animation: ${fadeIn} 0.6s ease-out;
`;

const TrustBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: rgba(16, 185, 129, 0.1);
  border: 1px solid rgba(16, 185, 129, 0.3);
  border-radius: 9999px;
  padding: 6px 16px;
  margin-bottom: 24px;
  font-weight: 500;
  font-size: 14px;
  animation: ${fadeIn} 0.6s ease-out;

  svg {
    width: 18px;
    height: 18px;
    color: #10b981;
  }

  span {
    color: #10b981;
  }
`;

const HeroTitle = styled.h1`
  font-size: 64px;
  font-weight: 900;
  margin-bottom: 20px;
  line-height: 1.1;
  animation: ${fadeIn} 0.6s ease-out 0.1s backwards;

  @media (max-width: 768px) {
    font-size: 36px;
  }
`;

const GradientText = styled.span`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const HeroSubtitle = styled.p`
  font-size: 20px;
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-bottom: 40px;
  max-width: 700px;
  margin-left: auto;
  margin-right: auto;
  line-height: 1.6;
  animation: ${fadeIn} 0.6s ease-out 0.2s backwards;

  strong {
    color: ${({ theme }) => theme.colors.textPrimary};
    font-weight: 600;
  }

  @media (max-width: 768px) {
    font-size: 16px;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  justify-content: center;
  align-items: center;
  margin-bottom: 40px;
  animation: ${fadeIn} 0.6s ease-out 0.3s backwards;

  @media (min-width: 640px) {
    flex-direction: row;
    gap: 16px;
  }
`;

const PrimaryButton = styled.a`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 18px 40px;
  border-radius: 9999px;
  font-weight: 700;
  font-size: 18px;
  transition: all 0.3s ease;
  cursor: pointer;
  text-decoration: none;
  box-shadow: 0 10px 30px rgba(102, 126, 234, 0.4);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 15px 40px rgba(102, 126, 234, 0.5);
  }

  svg {
    width: 22px;
    height: 22px;
  }

  @media (max-width: 640px) {
    width: 100%;
    max-width: 320px;
    font-size: 16px;
    padding: 16px 32px;
  }
`;

const SecondaryButton = styled.a`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.15);
  color: ${({ theme }) => theme.colors.textPrimary};
  padding: 18px 32px;
  border-radius: 9999px;
  font-weight: 600;
  font-size: 16px;
  transition: all 0.3s ease;
  cursor: pointer;
  text-decoration: none;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
    border-color: rgba(255, 255, 255, 0.3);
  }

  svg {
    width: 18px;
    height: 18px;
  }

  @media (max-width: 640px) {
    width: 100%;
    max-width: 320px;
    font-size: 15px;
  }
`;

const TrustIndicators = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 40px;
  margin-bottom: 48px;
  animation: ${fadeIn} 0.6s ease-out 0.4s backwards;
  padding: 0 16px;

  @media (max-width: 768px) {
    gap: 24px;
  }
`;

const TrustItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;

  .number {
    font-size: 32px;
    font-weight: 800;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    line-height: 1;
  }

  .label {
    font-size: 13px;
    color: ${({ theme }) => theme.colors.textSecondary};
    text-align: center;
    line-height: 1.4;
  }

  @media (max-width: 768px) {
    .number {
      font-size: 26px;
    }
    .label {
      font-size: 12px;
    }
  }
`;

const SocialProof = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  animation: ${fadeIn} 0.6s ease-out 0.5s backwards;
  flex-wrap: wrap;

  @media (max-width: 640px) {
    flex-direction: column;
    gap: 12px;
  }
`;

const AvatarStack = styled.div`
  display: flex;
  align-items: center;

  img {
    width: 44px;
    height: 44px;
    border-radius: 50%;
    border: 3px solid ${({ theme }) => theme.colors.background};
    margin-left: -12px;
    transition: transform 0.2s ease;

    &:first-child {
      margin-left: 0;
    }

    &:hover {
      transform: scale(1.1);
      z-index: 10;
    }
  }

  @media (max-width: 640px) {
    img {
      width: 40px;
      height: 40px;
    }
  }
`;

const SocialProofText = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: 15px;

  svg {
    width: 16px;
    height: 16px;
    color: #f59e0b;
    fill: #f59e0b;
  }

  strong {
    color: ${({ theme }) => theme.colors.textPrimary};
    font-weight: 700;
  }

  @media (max-width: 640px) {
    font-size: 14px;
    text-align: center;
  }
`;

// ==================== SECTIONS ====================
const Section = styled.section`
  max-width: 1200px;
  margin: 0 auto;
  padding: 80px 24px;

  @media (max-width: 768px) {
    padding: 60px 16px;
  }
`;

const SectionHeader = styled.div`
  text-align: center;
  margin-bottom: 64px;

  @media (max-width: 768px) {
    margin-bottom: 48px;
  }
`;

const SectionTitle = styled.h2`
  font-size: 48px;
  font-weight: 800;
  margin-bottom: 16px;

  @media (max-width: 768px) {
    font-size: 32px;
  }
`;

const SectionSubtitle = styled.p`
  font-size: 20px;
  color: ${({ theme }) => theme.colors.textSecondary};

  @media (max-width: 768px) {
    font-size: 16px;
  }
`;

const Divider = styled.div`
  height: 1px;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.1),
    transparent
  );
  margin: 0 auto;
  max-width: 1200px;
`;

// ==================== DEMO SECTION - SIMPLIFIED ====================
const DemoSection = styled.section`
  max-width: 900px;
  margin: 0 auto;
  padding: 80px 24px;

  @media (max-width: 768px) {
    padding: 60px 16px;
  }
`;

const DemoCard = styled.div`
  background: ${({ theme }) => theme.colors.backgroundAlt};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.xl};
  padding: 40px;
  box-shadow: ${({ theme }) => theme.shadow.xl};

  @media (max-width: 768px) {
    padding: 24px;
  }
`;

const DemoHeader = styled.div`
  text-align: center;
  margin-bottom: 32px;
`;

const DemoTitle = styled.h3`
  font-size: 32px;
  font-weight: 800;
  margin-bottom: 12px;

  @media (max-width: 768px) {
    font-size: 24px;
  }
`;

const DemoSubtitle = styled.p`
  font-size: 16px;
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-bottom: 20px;
`;

const LoadSampleButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: rgba(102, 126, 234, 0.1);
  border: 1px solid rgba(102, 126, 234, 0.3);
  color: ${({ theme }) => theme.colors.primary};
  padding: 10px 20px;
  border-radius: 9999px;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(102, 126, 234, 0.2);
    border-color: rgba(102, 126, 234, 0.5);
  }
`;

const DemoTextarea = styled.textarea`
  width: 100%;
  background: ${({ theme }) => theme.colors.background};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.lg};
  padding: 16px;
  color: ${({ theme }) => theme.colors.textPrimary};
  font-size: 14px;
  font-family: inherit;
  resize: vertical;
  min-height: 120px;
  margin-bottom: 16px;
  transition: border-color 0.3s ease;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
  }

  &::placeholder {
    color: ${({ theme }) => theme.colors.textSecondary};
  }
`;

const AnalyzeButton = styled.button<{ $isLoading?: boolean }>`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 16px 32px;
  border: none;
  border-radius: ${({ theme }) => theme.radius.lg};
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  opacity: ${({ $isLoading }) => ($isLoading ? 0.7 : 1)};

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 10px 25px rgba(102, 126, 234, 0.3);
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }

  svg {
    width: 20px;
    height: 20px;
  }
`;

const Spinner = styled.div`
  width: 20px;
  height: 20px;
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: ${spin} 0.8s linear infinite;
`;

const ResultsCard = styled.div`
  margin-top: 32px;
  background: ${({ theme }) => theme.colors.background};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.lg};
  padding: 32px;
  animation: ${fadeIn} 0.5s ease;

  @media (max-width: 768px) {
    padding: 20px;
  }
`;

const ScoreDisplay = styled.div`
  text-align: center;
  padding: 32px;
  margin-bottom: 32px;
  background: linear-gradient(
    135deg,
    rgba(102, 126, 234, 0.1) 0%,
    rgba(118, 75, 162, 0.1) 100%
  );
  border-radius: ${({ theme }) => theme.radius.lg};
  border: 1px solid rgba(102, 126, 234, 0.2);
`;

const ScoreValue = styled.div`
  font-size: 72px;
  font-weight: 900;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 8px;
  line-height: 1;

  @media (max-width: 768px) {
    font-size: 56px;
  }
`;

const ScoreLabel = styled.div`
  font-size: 18px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const ResultSection = styled.div`
  margin-bottom: 32px;

  &:last-child {
    margin-bottom: 0;
  }
`;

const ResultTitle = styled.h4`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 20px;
  font-weight: 700;
  margin-bottom: 16px;

  svg {
    width: 24px;
    height: 24px;
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const SummaryBox = styled.div`
  background: ${({ theme }) => theme.colors.backgroundAlt};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.md};
  padding: 20px;
  line-height: 1.7;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const KeywordList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

const KeywordBadge = styled.span`
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.3);
  color: #ef4444;
  padding: 6px 12px;
  border-radius: 9999px;
  font-size: 14px;
  font-weight: 500;
`;

const CTASection = styled.div`
  text-align: center;
  padding: 32px;
  background: linear-gradient(
    135deg,
    rgba(102, 126, 234, 0.05) 0%,
    rgba(118, 75, 162, 0.05) 100%
  );
  border-radius: ${({ theme }) => theme.radius.lg};
  border: 1px solid rgba(102, 126, 234, 0.2);
  margin-top: 32px;

  h3 {
    font-size: 24px;
    font-weight: 700;
    margin-bottom: 12px;
  }

  p {
    color: ${({ theme }) => theme.colors.textSecondary};
    margin-bottom: 24px;
    font-size: 16px;
  }
`;

const CTAButtons = styled.div`
  display: flex;
  gap: 12px;
  justify-content: center;
  flex-wrap: wrap;
`;

const CTAButton = styled.button<{ $variant?: "primary" | "secondary" }>`
  padding: 14px 32px;
  border-radius: 9999px;
  font-weight: 700;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
  border: none;

  ${({ $variant, theme }) =>
    $variant === "primary"
      ? `
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 10px 25px rgba(102, 126, 234, 0.3);
    }
  `
      : `
    background: ${theme.colors.surface};
    color: ${theme.colors.textPrimary};
    border: 1px solid ${theme.colors.border};
    
    &:hover {
      background: ${theme.colors.surfaceHover};
    }
  `}
`;

// ==================== FEATURES ====================
const FeatureGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 32px;

  @media (min-width: 768px) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

const FeatureCard = styled.div`
  background: ${({ theme }) => theme.colors.backgroundAlt};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.xl};
  padding: 32px;
  transition: all 0.3s ease;
  text-align: center;

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
    transform: translateY(-4px);
    box-shadow: ${({ theme }) => theme.shadow.lg};
  }
`;

const FeatureIcon = styled.div<{ $gradient: string }>`
  width: 64px;
  height: 64px;
  border-radius: ${({ theme }) => theme.radius.lg};
  background: ${({ $gradient }) => $gradient};
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 20px;

  svg {
    width: 32px;
    height: 32px;
    color: white;
  }
`;

const FeatureTitle = styled.h3`
  font-size: 20px;
  font-weight: 700;
  margin-bottom: 12px;
`;

const FeatureDescription = styled.p`
  color: ${({ theme }) => theme.colors.textSecondary};
  line-height: 1.6;
  font-size: 15px;
`;

const FeatureHighlight = styled.div`
  margin-top: 16px;
  padding: 12px;
  background: rgba(102, 126, 234, 0.1);
  border-radius: ${({ theme }) => theme.radius.md};
  border: 1px solid rgba(102, 126, 234, 0.2);

  strong {
    color: ${({ theme }) => theme.colors.primary};
    font-weight: 700;
  }
`;

// ==================== TESTIMONIALS - STYLED COMPONENTS ====================
// (Diğer styled components'lerden sonra, FeatureGrid'den sonra ekleyin)

const TestimonialGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 32px;

  @media (min-width: 768px) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

const TestimonialCard = styled.div`
  background: ${({ theme }) => theme.colors.backgroundAlt};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.xl};
  padding: 32px;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  gap: 20px;

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
    transform: translateY(-4px);
    box-shadow: ${({ theme }) => theme.shadow.lg};
  }
`;

const TestimonialHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;

  img {
    width: 56px;
    height: 56px;
    border-radius: 50%;
    border: 2px solid ${({ theme }) => theme.colors.border};
  }
`;

const TestimonialAuthor = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;

  .name {
    font-weight: 700;
    font-size: 16px;
    color: ${({ theme }) => theme.colors.textPrimary};
  }

  .role {
    font-size: 14px;
    color: ${({ theme }) => theme.colors.textSecondary};
  }
`;

const TestimonialRating = styled.div`
  display: flex;
  gap: 4px;
  margin-left: auto;

  svg {
    width: 18px;
    height: 18px;
    color: #f59e0b;
    fill: #f59e0b;
  }
`;

const TestimonialText = styled.p`
  color: ${({ theme }) => theme.colors.textPrimary};
  line-height: 1.7;
  font-size: 15px;
  font-style: italic;
  position: relative;

  &:before {
    content: '"';
    font-size: 48px;
    color: ${({ theme }) => theme.colors.primary};
    opacity: 0.3;
    position: absolute;
    top: -10px;
    left: -10px;
    font-family: Georgia, serif;
  }
`;

const TestimonialHighlight = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: rgba(16, 185, 129, 0.1);
  border: 1px solid rgba(16, 185, 129, 0.3);
  color: #10b981;
  padding: 8px 16px;
  border-radius: 9999px;
  font-size: 13px;
  font-weight: 600;
  margin-top: auto;

  svg {
    width: 16px;
    height: 16px;
  }
`;

// ==================== PRICING ====================
const PricingGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 32px;
  max-width: 900px;
  margin: 0 auto;

  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const PricingCard = styled.div<{ $featured?: boolean }>`
  background: ${({ theme }) => theme.colors.backgroundAlt};
  border: ${({ $featured, theme }) =>
    $featured
      ? `2px solid ${theme.colors.primary}`
      : `1px solid ${theme.colors.border}`};
  border-radius: ${({ theme }) => theme.radius.xl};
  padding: 40px 32px;
  transition: all 0.3s ease;
  position: relative;

  &:hover {
    transform: translateY(-4px);
    box-shadow: ${({ theme }) => theme.shadow.xl};
  }

  @media (max-width: 768px) {
    padding: 32px 24px;
  }
`;

const PricingBadge = styled.div`
  position: absolute;
  top: -12px;
  right: 24px;
  background: linear-gradient(135deg, #f59e0b 0%, #ef4444 100%);
  color: white;
  padding: 6px 16px;
  border-radius: 9999px;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.5px;
`;

const PricingTitle = styled.h3`
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 12px;
`;

const PricingPrice = styled.div`
  font-size: 56px;
  font-weight: 800;
  margin-bottom: 24px;
  line-height: 1;

  span {
    font-size: 20px;
    color: ${({ theme }) => theme.colors.textSecondary};
    font-weight: 600;
  }
`;

const PricingFeatures = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0 0 32px;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const PricingFeature = styled.li<{ $enabled?: boolean }>`
  display: flex;
  align-items: flex-start;
  gap: 12px;

  svg {
    width: 20px;
    height: 20px;
    flex-shrink: 0;
    margin-top: 2px;
    color: ${({ $enabled }) => ($enabled ? "#10b981" : "#71717a")};
  }

  span {
    color: ${({ $enabled, theme }) =>
      $enabled ? theme.colors.textPrimary : theme.colors.textSecondary};
    line-height: 1.5;
    font-size: 15px;
  }
`;

const PricingButton = styled.button<{ $variant?: "primary" | "secondary" }>`
  width: 100%;
  padding: 16px 32px;
  border-radius: ${({ theme }) => theme.radius.lg};
  font-weight: 700;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
  border: none;

  ${({ $variant, theme }) =>
    $variant === "primary"
      ? `
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 10px 25px rgba(102, 126, 234, 0.3);
    }
  `
      : `
    background: ${theme.colors.surface};
    color: ${theme.colors.textPrimary};
    border: 1px solid ${theme.colors.border};
    
    &:hover {
      background: ${theme.colors.surfaceHover};
    }
  `}
`;

// ==================== FAQ ====================
const FAQList = styled.div`
  max-width: 800px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const FAQItem = styled.div<{ $isOpen?: boolean }>`
  background: ${({ theme }) => theme.colors.backgroundAlt};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.lg};
  padding: 24px;
  transition: all 0.3s ease;

  ${({ $isOpen, theme }) =>
    $isOpen &&
    `
    border-color: ${theme.colors.primary};
    background: rgba(102, 126, 234, 0.05);
  `}
`;

const FAQQuestion = styled.button<{ $isOpen?: boolean }>`
  width: 100%;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: 600;
  font-size: 17px;
  color: ${({ theme }) => theme.colors.textPrimary};
  background: none;
  border: none;
  padding: 0;
  text-align: left;

  svg {
    width: 24px;
    height: 24px;
    flex-shrink: 0;
    transition: transform 0.3s ease;
    transform: ${({ $isOpen }) => ($isOpen ? "rotate(180deg)" : "rotate(0)")};
    color: ${({ theme }) => theme.colors.textSecondary};
  }
`;

const FAQAnswer = styled.div<{ $isOpen?: boolean }>`
  margin-top: 16px;
  color: ${({ theme }) => theme.colors.textSecondary};
  line-height: 1.7;
  font-size: 15px;
  display: ${({ $isOpen }) => ($isOpen ? "block" : "none")};
`;

// ==================== FOOTER ====================
const Footer = styled.footer`
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  margin-top: 80px;
`;

const FooterContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 48px 24px;
`;

const FooterGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 32px;
  margin-bottom: 32px;

  @media (min-width: 768px) {
    grid-template-columns: repeat(4, 1fr);
  }
`;

const FooterColumn = styled.div`
  h3 {
    font-weight: 700;
    font-size: 18px;
    margin-bottom: 16px;
  }

  h4 {
    font-weight: 600;
    font-size: 16px;
    margin-bottom: 16px;
  }

  p {
    color: ${({ theme }) => theme.colors.textSecondary};
    font-size: 14px;
    line-height: 1.6;
  }

  ul {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  li a {
    color: ${({ theme }) => theme.colors.textSecondary};
    font-size: 14px;
    text-decoration: none;
    transition: color 0.2s ease;

    &:hover {
      color: ${({ theme }) => theme.colors.textPrimary};
    }
  }
`;

const FooterBottom = styled.div`
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  padding-top: 32px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  align-items: center;
  justify-content: space-between;

  @media (min-width: 768px) {
    flex-direction: row;
  }

  p {
    color: ${({ theme }) => theme.colors.textSecondary};
    font-size: 14px;
  }
`;

const FooterLinks = styled.div`
  display: flex;
  gap: 24px;

  a {
    color: ${({ theme }) => theme.colors.textSecondary};
    font-size: 14px;
    text-decoration: none;
    transition: color 0.2s ease;

    &:hover {
      color: ${({ theme }) => theme.colors.textPrimary};
    }
  }
`;

const LoadingState = styled.div`
  text-align: center;
  padding: 60px 32px;

  h3 {
    font-size: 24px;
    margin: 24px 0 16px;
  }
`;

const LoadingSteps = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  text-align: left;
  max-width: 400px;
  margin: 0 auto;
`;

const LoadingStep = styled.div<{ $completed?: boolean }>`
  padding: 12px 16px;
  background: ${({ theme }) => theme.colors.backgroundAlt};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.md};
  font-size: 15px;
  color: ${({ $completed, theme }) =>
    $completed ? theme.colors.primary : theme.colors.textSecondary};
  font-weight: ${({ $completed }) => ($completed ? 600 : 400)};
`;

// ==================== MAIN COMPONENT ====================
export default function Page() {
  const [step, setStep] = useState<"upload" | "loading" | "analyzing">("upload");
const [detectedLocation, setDetectedLocation] = useState("");
const [detectedJobTitle, setDetectedJobTitle] = useState("");
const [fetchedJobs, setFetchedJobs] = useState<any[]>([]);
  const [cvText, setCvText] = useState("");
  const [jobText, setJobText] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<{
    fitScore: number;
    summary: string;
    missingKeywords: string[];
  } | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const faqs = [
    {
      question: "Is my data secure?",
      answer:
        "Absolutely! All your data is encrypted and stored securely. We never share your information with third parties. We're fully GDPR compliant and take data security seriously.",
    },
    {
      question: "What file formats do you support?",
      answer:
        "We support PDF and DOCX formats. You can also paste text directly for analysis. Maximum file size is 5MB.",
    },
    {
      question: "How long does the analysis take?",
      answer:
        "Our AI analysis typically takes 15-30 seconds to complete. For complex CVs and longer job descriptions, it may take up to 1 minute, but never longer.",
    },
    {
      question: "How many analyses can I do with the free plan?",
      answer:
        "The free plan allows 3 analyses per month. You can compare up to 3 job postings per analysis. Upgrade to Pro for unlimited analyses.",
    },
    {
      question: "What's included in the Pro plan?",
      answer:
        "Pro includes unlimited analyses, detailed AI insights, professional rewriting of 3 bullet points, ATS optimization recommendations, and alternative role suggestions. Only $9/month.",
    },
    {
      question: "Can I cancel anytime?",
      answer:
        "Yes! No commitment required. You can cancel anytime. After canceling, you'll continue to have Pro features until the end of your billing period.",
    },
  ];

  const loadSample = () => {
    setCvText(
      "John Doe\nSoftware Engineer\n\nExperience:\n- 3 years of React development\n- Built 5 web applications\n- Team collaboration\n\nSkills: React, JavaScript, HTML, CSS"
    );
    setJobText(
      "Senior Frontend Developer\n\nRequirements:\n- 5+ years React experience\n- TypeScript expertise\n- Next.js knowledge\n- Testing experience (Jest, React Testing Library)\n- CI/CD pipelines\n- Team leadership"
    );
  };

 const handleAnalyze = async () => {
  if (!cvText || !jobText) {
    alert("Please paste both CV and job description");
    return;
  }

  setStep("loading");
  setIsAnalyzing(true);

  try {
    // Step 1: Fetch location + jobs
    const jobResponse = await fetch("/api/demo/fetch-jobs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ cvText }),
    });

    const jobData = await jobResponse.json();

    if (jobData.success) {
      setDetectedLocation(jobData.location);
      setDetectedJobTitle(jobData.detectedJobTitle);
      setFetchedJobs(jobData.jobs);
    }

    // Wait 1 second
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Step 2: Analyzing
    setStep("analyzing");
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Step 3: Results
    setResult({
      fitScore: 67,
      summary:
        "Your CV shows strong React experience, but lacks several key requirements for this position. You're missing TypeScript and Next.js expertise, which are crucial for this role. Additionally, your experience falls short of the 5+ years requirement. Testing and CI/CD experience are also not mentioned.",
      missingKeywords: [
        "TypeScript",
        "Next.js",
        "Jest",
        "React Testing Library",
        "CI/CD",
        "Team Leadership",
      ],
    });

    setStep("upload");
  } catch (error) {
    console.error("Analysis error:", error);
    alert("Failed to analyze. Please try again.");
    setStep("upload");
  } finally {
    setIsAnalyzing(false);
  }
};

  return (
    <Container>
      {/* HERO SECTION */}
      <HeroSection>
        <BackgroundBlur>
          <BlurCircle
            $position="top: -200px; left: -200px;"
            $color="#a855f7"
            $delay="0s"
          />
          <BlurCircle
            $position="top: -100px; right: -200px;"
            $color="#3b82f6"
            $delay="2s"
          />
          <BlurCircle
            $position="bottom: -200px; left: 50%; transform: translateX(-50%);"
            $color="#ec4899"
            $delay="4s"
          />
        </BackgroundBlur>

        <HeroContent>
          <TrustBadge>
            <CheckIcon />
            <span>OpenAI GPT-4 Powered • GDPR Compliant</span>
          </TrustBadge>

          <HeroTitle>
            Optimize Your CV for <GradientText>Job Postings</GradientText>
          </HeroTitle>

          <HeroSubtitle>
            Use AI to <strong>identify missing skills</strong>, improve your CV,
            and get <strong>73% more interview invitations</strong>
          </HeroSubtitle>

          <ButtonGroup>
            <PrimaryButton href="#demo">
              <RocketIcon />
              Analyze for Free
            </PrimaryButton>
            <SecondaryButton href="#features">
              How It Works
              <ArrowRightIcon />
            </SecondaryButton>
          </ButtonGroup>

          <TrustIndicators>
            <TrustItem>
              <div className="number">500+</div>
              <div className="label">Active Users</div>
            </TrustItem>
            <TrustItem>
              <div className="number">1,200+</div>
              <div className="label">Analyses Completed</div>
            </TrustItem>
            <TrustItem>
              <div className="number">73%</div>
              <div className="label">Average Improvement</div>
            </TrustItem>
          </TrustIndicators>

          <SocialProof>
            <AvatarStack>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="https://i.pravatar.cc/150?img=1" alt="User" />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="https://i.pravatar.cc/150?img=2" alt="User" />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="https://i.pravatar.cc/150?img=3" alt="User" />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="https://i.pravatar.cc/150?img=4" alt="User" />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="https://i.pravatar.cc/150?img=5" alt="User" />
            </AvatarStack>
            <SocialProofText>
              <StarIcon />
              <strong>4.8/5</strong> (127 reviews)
            </SocialProofText>
          </SocialProof>
        </HeroContent>
      </HeroSection>

      <Divider />

      {/* DEMO SECTION - SIMPLIFIED */}
      <DemoSection id="demo">
        <SectionHeader>
          <SectionTitle>🚀 Try It Now - Free</SectionTitle>
          <SectionSubtitle>
            Paste your CV and job description, get instant AI feedback
          </SectionSubtitle>
        </SectionHeader>

        <DemoCard>
  {step === "upload" && !result && (
    <>
      <DemoHeader>
        <DemoTitle>Quick Demo</DemoTitle>
        <DemoSubtitle>
          Paste your CV and job description, get instant AI feedback
        </DemoSubtitle>
        <LoadSampleButton onClick={loadSample}>
          📝 Load Sample Data
        </LoadSampleButton>
      </DemoHeader>

      <DemoTextarea
        placeholder="Paste your CV here (or load sample data)..."
        value={cvText}
        onChange={(e) => setCvText(e.target.value)}
        rows={6}
      />

      <DemoTextarea
        placeholder="Paste the job description here..."
        value={jobText}
        onChange={(e) => setJobText(e.target.value)}
        rows={6}
      />

      <AnalyzeButton
        onClick={handleAnalyze}
        disabled={!cvText || !jobText || isAnalyzing}
        $isLoading={isAnalyzing}
      >
        {isAnalyzing ? (
          <>
            <Spinner />
            Analyzing...
          </>
        ) : (
          <>
            <ZapIcon />
            Analyze Now
          </>
        )}
      </AnalyzeButton>
    </>
  )}

  {/* STEP 2: LOADING */}
  {step === "loading" && (
    <LoadingState>
      <Spinner />
      <h3>🔍 Analyzing Your CV...</h3>
      <LoadingSteps>
        <LoadingStep $completed>
          ✅ Detected: {detectedJobTitle || "..."}
        </LoadingStep>
        <LoadingStep $completed>
          ✅ Location: {detectedLocation || "Detecting..."}
        </LoadingStep>
        <LoadingStep $completed={false}>
          🔄 Finding matching jobs...
        </LoadingStep>
      </LoadingSteps>
    </LoadingState>
  )}

  {/* STEP 3: ANALYZING */}
  {step === "analyzing" && (
    <LoadingState>
      <Spinner />
      <h3>🤖 Analyzing Match...</h3>
      <LoadingSteps>
        <LoadingStep $completed>
          ✅ CV and job description loaded
        </LoadingStep>
        <LoadingStep $completed={false}>
          🔄 Calculating match score...
        </LoadingStep>
        <LoadingStep $completed={false}>
          🔄 Identifying missing skills...
        </LoadingStep>
      </LoadingSteps>
    </LoadingState>
  )}

  {/* STEP 4: RESULTS */}
  {result && (
    <ResultsCard>
      <ScoreDisplay>
        <ScoreValue>{result.fitScore}%</ScoreValue>
        <ScoreLabel>Match Score</ScoreLabel>
      </ScoreDisplay>

      <ResultSection>
        <ResultTitle>
          <SparklesIcon />
          AI Summary
        </ResultTitle>
        <SummaryBox>
          <p>{result.summary}</p>
        </SummaryBox>
      </ResultSection>

      <ResultSection>
        <ResultTitle>
          <TargetIcon />
          Missing Skills
        </ResultTitle>
        <KeywordList>
          {result.missingKeywords.map((keyword) => (
            <KeywordBadge key={keyword}>{keyword}</KeywordBadge>
          ))}
        </KeywordList>
      </ResultSection>

      <CTASection>
        <h3>🎯 Want the Full Analysis?</h3>
        <p>
          Sign up for free, save your report, and perfect your CV with Pro features!
        </p>
        <CTAButtons>
          <CTAButton as="a" href="/signup" $variant="primary">
            Sign Up Free
          </CTAButton>
          <CTAButton as="a" href="/login" $variant="secondary">
            Log In
          </CTAButton>
        </CTAButtons>
      </CTASection>
    </ResultsCard>
  )}
</DemoCard>
      </DemoSection>

      <Divider />

      {/* FEATURES - BENEFIT DRIVEN */}
      <Section id="features">
        <SectionHeader>
          <SectionTitle>Why Rejectly.pro?</SectionTitle>
          <SectionSubtitle>
            Data-driven improvements, not guesswork
          </SectionSubtitle>
        </SectionHeader>

        <FeatureGrid>
          <FeatureCard>
            <FeatureIcon $gradient="linear-gradient(135deg, #a855f7 0%, #ec4899 100%)">
              <SparklesIcon />
            </FeatureIcon>
            <FeatureTitle>Identify Missing Skills</FeatureTitle>
            <FeatureDescription>
              Discover gaps between your CV and job postings in 30 seconds with
              GPT-4 technology
            </FeatureDescription>
            <FeatureHighlight>
              Results in <strong>30 seconds</strong>
            </FeatureHighlight>
          </FeatureCard>

          <FeatureCard>
            <FeatureIcon $gradient="linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)">
              <ZapIcon />
            </FeatureIcon>
            <FeatureTitle>Pass Bot Filters</FeatureTitle>
            <FeatureDescription>
              Reduce your CV rejection rate by robots with ATS (Applicant
              Tracking System) optimization
            </FeatureDescription>
            <FeatureHighlight>
              <strong>85% more</strong> ATS pass rate
            </FeatureHighlight>
          </FeatureCard>

          <FeatureCard>
            <FeatureIcon $gradient="linear-gradient(135deg, #10b981 0%, #14b8a6 100%)">
              <TargetIcon />
            </FeatureIcon>
            <FeatureTitle>Professionally Rewrite Your CV</FeatureTitle>
            <FeatureDescription>
              Get bullet point suggestions optimized for specific job postings,
              written in HR language
            </FeatureDescription>
            <FeatureHighlight>
              <strong>3 bullet points</strong> rewritten
            </FeatureHighlight>
          </FeatureCard>
        </FeatureGrid>
      </Section>

     <Divider />

      {/* TESTIMONIALS - WHAT OUR USERS SAY */}
      <Section id="testimonials">
        <SectionHeader>
          <SectionTitle>What Our Users Say</SectionTitle>
          <SectionSubtitle>
            Real results from real professionals
          </SectionSubtitle>
        </SectionHeader>

        <TestimonialGrid>
          <TestimonialCard>
            <TestimonialHeader>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="https://i.pravatar.cc/150?img=12" alt="Sarah Chen" />
              <TestimonialAuthor>
                <div className="name">Sarah Chen</div>
                <div className="role">Frontend Developer</div>
              </TestimonialAuthor>
              <TestimonialRating>
                <StarIcon />
                <StarIcon />
                <StarIcon />
                <StarIcon />
                <StarIcon />
              </TestimonialRating>
            </TestimonialHeader>
            <TestimonialText>
              I was applying to jobs for months with no responses. After using
              Rejectly.pro, I optimized my CV and got 5 interview invitations in
              2 weeks! The AI insights were spot-on about what I was missing.
            </TestimonialText>
            <TestimonialHighlight>
              <CheckIcon />
              5 interviews in 2 weeks
            </TestimonialHighlight>
          </TestimonialCard>

          <TestimonialCard>
            <TestimonialHeader>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="https://i.pravatar.cc/150?img=33" alt="Marcus Johnson" />
              <TestimonialAuthor>
                <div className="name">Marcus Johnson</div>
                <div className="role">Product Manager</div>
              </TestimonialAuthor>
              <TestimonialRating>
                <StarIcon />
                <StarIcon />
                <StarIcon />
                <StarIcon />
                <StarIcon />
              </TestimonialRating>
            </TestimonialHeader>
            <TestimonialText>
              The ATS optimization feature is a game-changer. My CV was being
              rejected by automated systems before I even got to human
              reviewers. Now I'm getting past those filters and landing
              interviews at top companies.
            </TestimonialText>
            <TestimonialHighlight>
              <CheckIcon />
              85% ATS pass rate improvement
            </TestimonialHighlight>
          </TestimonialCard>

          <TestimonialCard>
            <TestimonialHeader>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="https://i.pravatar.cc/150?img=47" alt="Emily Rodriguez" />
              <TestimonialAuthor>
                <div className="name">Emily Rodriguez</div>
                <div className="role">Data Analyst</div>
              </TestimonialAuthor>
              <TestimonialRating>
                <StarIcon />
                <StarIcon />
                <StarIcon />
                <StarIcon />
                <StarIcon />
              </TestimonialRating>
            </TestimonialHeader>
            <TestimonialText>
              The professional rewriting suggestions helped me transform my CV
              from generic to compelling. I learned how to speak the language HR
              managers want to see. Landed my dream job within a month!
            </TestimonialText>
            <TestimonialHighlight>
              <CheckIcon />
              Dream job in 1 month
            </TestimonialHighlight>
          </TestimonialCard>
        </TestimonialGrid>
      </Section>

      <Divider />
      

      {/* PRICING - SIMPLIFIED */}
      <Section id="pricing">
        <SectionHeader>
          <SectionTitle>Simple and Transparent Pricing</SectionTitle>
          <SectionSubtitle>
            Affordable plans to help you succeed
          </SectionSubtitle>
        </SectionHeader>

        <PricingGrid>
          {/* Free Plan */}
          <PricingCard>
            <PricingTitle>Free</PricingTitle>
            <PricingPrice>
              $0<span>/month</span>
            </PricingPrice>
            <PricingFeatures>
              <PricingFeature $enabled>
                <CheckIcon />
                <span>3 analyses per month</span>
              </PricingFeature>
              <PricingFeature $enabled>
                <CheckIcon />
                <span>Basic match score</span>
              </PricingFeature>
              <PricingFeature $enabled>
                <CheckIcon />
                <span>Missing keywords</span>
              </PricingFeature>
              <PricingFeature>
                <XIcon />
                <span>Professional rewriting</span>
              </PricingFeature>
              <PricingFeature>
                <XIcon />
                <span>ATS optimization</span>
              </PricingFeature>
              <PricingFeature>
                <XIcon />
                <span>Role recommendations</span>
              </PricingFeature>
            </PricingFeatures>
            <PricingButton $variant="secondary">Start Free</PricingButton>
          </PricingCard>

          {/* Pro Plan */}
          <PricingCard $featured>
            <PricingBadge>MOST POPULAR</PricingBadge>
            <PricingTitle>Pro</PricingTitle>
            <PricingPrice>
              $9<span>/month</span>
            </PricingPrice>
            <PricingFeatures>
              <PricingFeature $enabled>
                <CheckIcon />
                <span>Unlimited analyses</span>
              </PricingFeature>
              <PricingFeature $enabled>
                <CheckIcon />
                <span>Detailed AI insights</span>
              </PricingFeature>
              <PricingFeature $enabled>
                <CheckIcon />
                <span>Missing keywords + suggestions</span>
              </PricingFeature>
              <PricingFeature $enabled>
                <CheckIcon />
                <span>3 bullet points rewritten professionally</span>
              </PricingFeature>
              <PricingFeature $enabled>
                <CheckIcon />
                <span>ATS optimization guide</span>
              </PricingFeature>
              <PricingFeature $enabled>
                <CheckIcon />
                <span>3 alternative role recommendations</span>
              </PricingFeature>
            </PricingFeatures>
            <PricingButton $variant="primary">Upgrade to Pro</PricingButton>
          </PricingCard>
        </PricingGrid>
      </Section>

      <Divider />

      {/* FAQ */}
      <Section id="faq">
        <SectionHeader>
          <SectionTitle>Frequently Asked Questions</SectionTitle>
          <SectionSubtitle>Everything you need to know</SectionSubtitle>
        </SectionHeader>

        <FAQList>
          {faqs.map((faq, index) => (
            <FAQItem key={index} $isOpen={openFaq === index}>
              <FAQQuestion
                $isOpen={openFaq === index}
                onClick={() => setOpenFaq(openFaq === index ? null : index)}
              >
                <span>{faq.question}</span>
                <ChevronDownIcon />
              </FAQQuestion>
              <FAQAnswer $isOpen={openFaq === index}>{faq.answer}</FAQAnswer>
            </FAQItem>
          ))}
        </FAQList>
      </Section>

      <Divider />

      {/* FOOTER */}
      <Footer>
        <FooterContent>
          <FooterGrid>
            <FooterColumn>
              <h3>Rejectly.pro</h3>
              <p>
                AI-powered CV analysis to help you land your dream job.
              </p>
            </FooterColumn>
            <FooterColumn>
              <h4>Product</h4>
              <ul>
                <li>
                  <a href="#features">Features</a>
                </li>
                <li>
                  <a href="#pricing">Pricing</a>
                </li>
                <li>
                  <a href="#demo">Demo</a>
                </li>
              </ul>
            </FooterColumn>
            <FooterColumn>
              <h4>Company</h4>
              <ul>
                <li>
                  <a href="#">About</a>
                </li>
                <li>
                  <a href="#">Blog</a>
                </li>
                <li>
                  <a href="#">Contact</a>
                </li>
              </ul>
            </FooterColumn>
            <FooterColumn>
              <h4>Support</h4>
              <ul>
                <li>
                  <a href="#faq">FAQ</a>
                </li>
                <li>
                  <a href="#">Privacy</a>
                </li>
                <li>
                  <a href="#">Terms</a>
                </li>
              </ul>
            </FooterColumn>
          </FooterGrid>

          <FooterBottom>
            <p>© 2025 Rejectly.pro. All rights reserved.</p>
            <FooterLinks>
              <a href="#">Twitter</a>
              <a href="#">LinkedIn</a>
              <a href="#">GitHub</a>
            </FooterLinks>
          </FooterBottom>
        </FooterContent>
      </Footer>
    </Container>
  );
}