"use client";

import styled, { keyframes } from "styled-components";
import { useState } from "react";
import Image from "next/image";

// Animations
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

// Layout Components
const Container = styled.div`
  min-height: 100vh;
  background-color: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.textPrimary};
`;

// Hero Section Styles
const HeroSection = styled.section`
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  padding: 80px 24px;
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
  max-width: 1200px;
  margin: 0 auto;
  text-align: center;
  animation: ${fadeIn} 0.6s ease-out;
`;

const Badge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: rgba(99, 102, 241, 0.1);
  border: 1px solid rgba(99, 102, 241, 0.2);
  border-radius: 9999px;
  padding: 8px 16px;
  margin-bottom: 32px;
  font-weight: 500;
  animation: ${fadeIn} 0.6s ease-out;

  svg {
    width: 20px;
    height: 20px;
    color: #93c5fd;
  }

  span {
    color: #93c5fd;
  }
`;

const HeroTitle = styled.h1`
  font-size: 72px;
  font-weight: 900;
  margin-bottom: 24px;
  line-height: 1.2;
  animation: ${fadeIn} 0.6s ease-out 0.1s backwards;

  @media (max-width: 768px) {
    font-size: 48px;
  }
`;

const GradientText = styled.span`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const HeroSubtitle = styled.p`
  font-size: 24px;
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-bottom: 48px;
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
  line-height: 1.6;
  animation: ${fadeIn} 0.6s ease-out 0.2s backwards;

  @media (max-width: 768px) {
    font-size: 18px;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  justify-content: center;
  margin-bottom: 48px;
  animation: ${fadeIn} 0.6s ease-out 0.3s backwards;

  @media (min-width: 640px) {
    flex-direction: row;
  }
`;

const PrimaryButton = styled.a`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 16px 32px;
  border-radius: 9999px;
  font-weight: 600;
  font-size: 18px;
  transition: all 0.3s ease;
  cursor: pointer;
  text-decoration: none;

  &:hover {
    transform: scale(1.05);
  }

  svg {
    width: 20px;
    height: 20px;
  }
`;

const SecondaryButton = styled.a`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: white;
  padding: 16px 32px;
  border-radius: 9999px;
  font-weight: 600;
  font-size: 18px;
  transition: all 0.3s ease;
  cursor: pointer;
  text-decoration: none;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }

  svg {
    width: 20px;
    height: 20px;
  }
`;

const SocialProof = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  margin-bottom: 32px;
  animation: ${fadeIn} 0.6s ease-out 0.4s backwards;
`;

const AvatarStack = styled.div`
  display: flex;
  margin-left: -8px;

  img {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    border: 3px solid ${({ theme }) => theme.colors.background};
    margin-left: -12px;
  }
`;

const SocialProofText = styled.p`
  color: ${({ theme }) => theme.colors.textSecondary};

  span {
    font-weight: 600;
    color: ${({ theme }) => theme.colors.textPrimary};
  }
`;

const DemoScreenshot = styled.div`
  margin-top: 64px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
  animation: ${fadeIn} 0.6s ease-out 0.5s backwards;

  img {
    width: 100%;
    display: block;
  }
`;

// Section Components
const Section = styled.section`
  max-width: 1200px;
  margin: 0 auto;
  padding: 96px 24px;
`;

const SectionHeader = styled.div`
  text-align: center;
  margin-bottom: 64px;
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
`;

const Divider = styled.div`
  height: 1px;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.1),
    transparent
  );
  margin: 80px 0;
  max-width: 1200px;
  margin-left: auto;
  margin-right: auto;
`;

// How It Works
const StepsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 32px;

  @media (min-width: 768px) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

const StepCard = styled.div`
  text-align: center;
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-8px);
  }
`;

const StepNumber = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  font-size: 24px;
  margin: 0 auto 24px;
`;

const StepImage = styled.div`
  margin-bottom: 24px;

  img {
    width: 100%;
    border-radius: 12px;
  }
`;

const StepTitle = styled.h3`
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 12px;
`;

const StepDescription = styled.p`
  color: ${({ theme }) => theme.colors.textSecondary};
  line-height: 1.6;
`;

// Demo Section Styles (your existing component styles)
const DemoSection = styled.section`
  max-width: 1200px;
  margin: 0 auto;
  padding: ${({ theme }) => `${theme.spacing.xl} ${theme.spacing.lg}`};
`;

const DemoHeader = styled.div`
  text-align: center;
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const DemoTitle = styled.h2`
  font-size: ${({ theme }) => theme.typography.fontSize["3xl"]};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  margin-bottom: ${({ theme }) => theme.spacing.md};

  @media (max-width: 768px) {
    font-size: ${({ theme }) => theme.typography.fontSize.xl};
  }
`;

const DemoSubtitle = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.xl};
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const LoadSampleButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  background-color: ${({ theme }) => theme.colors.backgroundAlt};
  border: 1px solid ${({ theme }) => theme.colors.border};
  color: ${({ theme }) => theme.colors.textPrimary};
  padding: ${({ theme }) => `${theme.spacing.sm} ${theme.spacing.lg}`};
  border-radius: 9999px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.normal};

  &:hover {
    background-color: ${({ theme }) => theme.colors.surface};
  }
`;

const InputGrid = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.spacing.lg};
  grid-template-columns: 1fr;
  margin-bottom: ${({ theme }) => theme.spacing.xl};

  @media (min-width: 768px) {
    grid-template-columns: 1fr 1fr;
  }
`;

const InputCard = styled.div`
  background: ${({ theme }) => theme.colors.backgroundAlt};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.xl};
  padding: ${({ theme }) => theme.spacing.xl};
  transition: border-color ${({ theme }) => theme.transitions.normal};

  &:hover {
    border-color: ${({ theme }) => theme.colors.borderHover};
  }
`;

const CardHeader = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const CardTitle = styled.h3`
  font-size: ${({ theme }) => theme.typography.fontSize.xl};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

const CardDescription = styled.p`
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: ${({ theme }) => theme.typography.fontSize.base};
`;

const UploadArea = styled.div<{ $isDragging: boolean }>`
  border: 2px dashed
    ${({ theme, $isDragging }) =>
      $isDragging ? theme.colors.primary : theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.lg};
  padding: ${({ theme }) => theme.spacing.xl};
  text-align: center;
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.normal};
  background-color: ${({ theme, $isDragging }) =>
    $isDragging ? theme.colors.primaryLight : "transparent"};
  margin-bottom: ${({ theme }) => theme.spacing.lg};

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
    background-color: ${({ theme }) => theme.colors.primaryLight};
  }
`;

const UploadIconWrapper = styled.div`
  width: 48px;
  height: 48px;
  margin: 0 auto ${({ theme }) => theme.spacing.md};
  color: ${({ theme }) => theme.colors.primary};

  svg {
    width: 100%;
    height: 100%;
  }
`;

const UploadText = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const UploadHint = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const FileName = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => `${theme.spacing.sm} ${theme.spacing.md}`};
  background-color: ${({ theme }) => theme.colors.primaryLight};
  color: ${({ theme }) => theme.colors.primary};
  border-radius: ${({ theme }) => theme.radius.md};
  border: 1px solid rgba(102, 126, 234, 0.2);
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  margin-bottom: ${({ theme }) => theme.spacing.lg};

  svg {
    width: 20px;
    height: 20px;
  }

  span {
    flex: 1;
  }

  button {
    background: none;
    border: none;
    cursor: pointer;
    padding: 0;
    color: ${({ theme }) => theme.colors.primary};
    display: flex;
    align-items: center;

    &:hover {
      opacity: 0.7;
    }

    svg {
      width: 16px;
      height: 16px;
    }
  }
`;

const HiddenInput = styled.input`
  display: none;
`;

const StyledDivider = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  margin: ${({ theme }) => theme.spacing.lg} 0;
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};

  &::before,
  &::after {
    content: "";
    flex: 1;
    height: 1px;
    background-color: ${({ theme }) => theme.colors.border};
  }
`;

const StyledTextarea = styled.textarea`
  width: 100%;
  background: ${({ theme }) => theme.colors.background};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.lg};
  padding: ${({ theme }) => theme.spacing.md};
  color: ${({ theme }) => theme.colors.textPrimary};
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  font-family: inherit;
  resize: vertical;
  transition: border-color ${({ theme }) => theme.transitions.normal};

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  &::placeholder {
    color: ${({ theme }) => theme.colors.textSecondary};
  }
`;

const AnalyzeButtonWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const AnalyzeButton = styled.button<{ $isLoading?: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: ${({ theme }) => `${theme.spacing.md} ${theme.spacing["2xl"]}`};
  border: none;
  border-radius: 9999px;
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.normal};
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
  background: ${({ theme }) => theme.colors.backgroundAlt};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.xl};
  padding: ${({ theme }) => theme.spacing.xl};
  margin-top: ${({ theme }) => theme.spacing.xl};
`;

const ScoreDisplay = styled.div`
  text-align: center;
  padding: ${({ theme }) => theme.spacing.xl};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  background: linear-gradient(
    135deg,
    rgba(102, 126, 234, 0.1) 0%,
    rgba(118, 75, 162, 0.1) 100%
  );
  border-radius: ${({ theme }) => theme.radius.lg};
  border: 1px solid rgba(102, 126, 234, 0.2);
`;

const ScoreValue = styled.div`
  font-size: 64px;
  font-weight: 900;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

const ScoreLabel = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.xl};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const SectionTitleWithIcon = styled.h3`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  font-size: ${({ theme }) => theme.typography.fontSize["2xl"]};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  color: ${({ theme }) => theme.colors.textPrimary};

  svg {
    width: 24px;
    height: 24px;
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const SummaryBox = styled.div`
  background: ${({ theme }) => theme.colors.background};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.lg};
  padding: ${({ theme }) => theme.spacing.lg};
  margin-bottom: ${({ theme }) => theme.spacing.xl};

  p {
    color: ${({ theme }) => theme.colors.textPrimary};
    line-height: 1.8;
    margin: 0;
  }
`;

const KeywordList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.sm};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const KeywordBadge = styled.span`
  display: inline-flex;
  align-items: center;
  padding: ${({ theme }) => `${theme.spacing.xs} ${theme.spacing.md}`};
  background-color: rgba(102, 126, 234, 0.1);
  color: ${({ theme }) => theme.colors.primary};
  border: 1px solid rgba(102, 126, 234, 0.2);
  border-radius: 9999px;
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
`;

const ProPreview = styled.div`
  position: relative;
  background: ${({ theme }) => theme.colors.background};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.lg};
  padding: ${({ theme }) => theme.spacing.xl};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  overflow: hidden;
`;

const BlurredContent = styled.div`
  filter: blur(4px);
  user-select: none;
  pointer-events: none;
  color: ${({ theme }) => theme.colors.textSecondary};

  h3 {
    display: flex;
    align-items: center;
    gap: ${({ theme }) => theme.spacing.sm};
    font-size: ${({ theme }) => theme.typography.fontSize.xl};
    font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
    margin-bottom: ${({ theme }) => theme.spacing.md};

    svg {
      width: 20px;
      height: 20px;
    }
  }

  p {
    margin-bottom: ${({ theme }) => theme.spacing.sm};
    line-height: 1.6;
  }
`;

const ProBadge = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: ${({ theme }) => `${theme.spacing.lg} ${theme.spacing["2xl"]}`};
  border-radius: ${({ theme }) => theme.radius.lg};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  box-shadow: 0 10px 40px rgba(102, 126, 234, 0.4);
  text-align: center;

  .emoji {
    font-size: 48px;
    margin-bottom: ${({ theme }) => theme.spacing.sm};
  }

  .text {
    font-size: ${({ theme }) => theme.typography.fontSize.xl};
  }
`;

const CTASection = styled.div`
  text-align: center;
  padding: ${({ theme }) => theme.spacing.xl};
  background: linear-gradient(
    135deg,
    rgba(102, 126, 234, 0.05) 0%,
    rgba(118, 75, 162, 0.05) 100%
  );
  border-radius: ${({ theme }) => theme.radius.lg};
  border: 1px solid rgba(102, 126, 234, 0.1);

  h3 {
    font-size: ${({ theme }) => theme.typography.fontSize["2xl"]};
    font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
    margin-bottom: ${({ theme }) => theme.spacing.sm};
  }

  p {
    color: ${({ theme }) => theme.colors.textSecondary};
    margin-bottom: ${({ theme }) => theme.spacing.lg};
    font-size: ${({ theme }) => theme.typography.fontSize.lg};
  }
`;

const CTAButtons = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  justify-content: center;
  flex-wrap: wrap;
`;

const CTAButton = styled.button<{ $variant?: "primary" | "secondary" }>`
  padding: ${({ theme }) => `${theme.spacing.md} ${theme.spacing.xl}`};
  border-radius: 9999px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.normal};
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
    background: ${theme.colors.backgroundAlt};
    color: ${theme.colors.textPrimary};
    border: 1px solid ${theme.colors.border};
    
    &:hover {
      background: ${theme.colors.surface};
    }
  `}
`;

const Toast = styled.div`
  position: fixed;
  bottom: 24px;
  right: 24px;
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
  padding: ${({ theme }) => `${theme.spacing.md} ${theme.spacing.lg}`};
  border-radius: ${({ theme }) => theme.radius.lg};
  box-shadow: 0 10px 40px rgba(16, 185, 129, 0.3);
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  z-index: 1000;
  animation: ${fadeIn} 0.3s ease;

  svg {
    width: 20px;
    height: 20px;
  }
`;

// Features Section
const FeaturesSection = styled.section`
  max-width: 1200px;
  margin: 0 auto;
  padding: ${({ theme }) => `${theme.spacing["2xl"]} ${theme.spacing.lg}`};
  text-align: center;
`;

const FeaturesSectionTitle = styled.h2`
  font-size: ${({ theme }) => theme.typography.fontSize["4xl"]};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  margin-bottom: ${({ theme }) => theme.spacing["2xl"]};

  @media (max-width: 768px) {
    font-size: ${({ theme }) => theme.typography.fontSize["3xl"]};
  }
`;

const FeatureGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: ${({ theme }) => theme.spacing.xl};

  @media (min-width: 768px) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

const FeatureCard = styled.div`
  background: ${({ theme }) => theme.colors.backgroundAlt};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.xl};
  padding: ${({ theme }) => theme.spacing.xl};
  transition: all ${({ theme }) => theme.transitions.normal};
  text-align: center;

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
    transform: translateY(-4px);
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
  margin: 0 auto ${({ theme }) => theme.spacing.md};

  svg {
    width: 32px;
    height: 32px;
    color: white;
  }
`;

const FeatureTitle = styled.h3`
  font-size: ${({ theme }) => theme.typography.fontSize.xl};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const FeatureDescription = styled.p`
  color: ${({ theme }) => theme.colors.textSecondary};
  line-height: 1.6;
`;

// Testimonials
const TestimonialGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 24px;

  @media (min-width: 768px) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

const TestimonialCard = styled.div`
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 24px;
  transition: all 0.3s ease;

  &:hover {
    border-color: rgba(102, 126, 234, 0.3);
    background: rgba(102, 126, 234, 0.05);
  }
`;

const TestimonialHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;

  img {
    width: 48px;
    height: 48px;
    border-radius: 50%;
  }
`;

const TestimonialAuthor = styled.div`
  .name {
    font-weight: 700;
  }

  .role {
    font-size: 14px;
    color: ${({ theme }) => theme.colors.textSecondary};
  }
`;

const TestimonialText = styled.p`
  color: ${({ theme }) => theme.colors.textPrimary};
  line-height: 1.6;
`;

// Founder Story
const FounderStory = styled.div`
  background: linear-gradient(
    135deg,
    rgba(102, 126, 234, 0.1) 0%,
    rgba(118, 75, 162, 0.1) 100%
  );
  border: 1px solid rgba(102, 126, 234, 0.2);
  border-radius: 16px;
  padding: 48px;
  display: flex;
  flex-direction: column;
  gap: 32px;
  align-items: center;

  @media (min-width: 768px) {
    flex-direction: row;
  }
`;

const FounderContent = styled.div`
  h3 {
    font-size: 32px;
    font-weight: 800;
    margin-bottom: 16px;
  }

  p {
    color: ${({ theme }) => theme.colors.textPrimary};
    line-height: 1.8;
    margin-bottom: 16px;

    &:last-child {
      margin-bottom: 0;
    }
  }
`;

// Pricing
const PricingGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 32px;

  @media (min-width: 768px) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

const PricingCard = styled.div<{ $featured?: boolean }>`
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(10px);
  border: ${({ $featured }) =>
    $featured ? "2px solid #764ba2" : "1px solid rgba(255, 255, 255, 0.1)"};
  border-radius: 16px;
  padding: 32px;
  transition: all 0.3s ease;
  position: relative;

  &:hover {
    transform: translateY(-4px);
  }
`;

const PricingBadge = styled.div`
  position: absolute;
  top: -12px;
  right: 20px;
  background: linear-gradient(135deg, #f59e0b 0%, #ef4444 100%);
  color: white;
  padding: 4px 12px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 600;
`;

const PricingTitle = styled.h3`
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 8px;
`;

const PricingPrice = styled.div`
  font-size: 56px;
  font-weight: 800;
  margin-bottom: 24px;

  span {
    font-size: 20px;
    color: ${({ theme }) => theme.colors.textSecondary};
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
  gap: 8px;

  svg {
    width: 24px;
    height: 24px;
    flex-shrink: 0;
    margin-top: 2px;
    color: ${({ $enabled }) => ($enabled ? "#10b981" : "#71717a")};
  }

  span {
    color: ${({ $enabled, theme }) =>
      $enabled ? theme.colors.textPrimary : theme.colors.textSecondary};
  }
`;

const PricingButton = styled.button<{ $variant?: "primary" | "secondary" }>`
  width: 100%;
  padding: 12px 24px;
  border-radius: 9999px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  border: none;

  ${({ $variant }) =>
    $variant === "primary"
      ? `
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;

    &:hover {
      transform: scale(1.05);
    }
  `
      : `
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    color: white;

    &:hover {
      background: rgba(255, 255, 255, 0.1);
    }
  `}
`;

// FAQ
const FAQList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const FAQItem = styled.div<{ $isOpen?: boolean }>`
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  padding: 24px 0;

  &:last-child {
    border-bottom: none;
  }
`;

const FAQQuestion = styled.div<{ $isOpen?: boolean }>`
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: 600;
  font-size: 18px;

  svg {
    width: 24px;
    height: 24px;
    transition: transform 0.3s ease;
    transform: ${({ $isOpen }) => ($isOpen ? "rotate(180deg)" : "rotate(0)")};
  }
`;

const FAQAnswer = styled.div<{ $isOpen?: boolean }>`
  margin-top: 12px;
  color: ${({ theme }) => theme.colors.textSecondary};
  line-height: 1.6;
  display: ${({ $isOpen }) => ($isOpen ? "block" : "none")};
`;

// Final CTA
const FinalCTA = styled.div`
  background: linear-gradient(
    135deg,
    rgba(102, 126, 234, 0.1) 0%,
    rgba(118, 75, 162, 0.1) 100%
  );
  border: 1px solid rgba(102, 126, 234, 0.2);
  border-radius: 16px;
  padding: 64px 48px;
  text-align: center;
  position: relative;
  overflow: hidden;
`;

const CTAContent = styled.div`
  position: relative;
  z-index: 1;

  h2 {
    font-size: 48px;
    font-weight: 800;
    margin-bottom: 24px;

    @media (max-width: 768px) {
      font-size: 32px;
    }
  }

  p {
    font-size: 20px;
    color: ${({ theme }) => theme.colors.textPrimary};
    margin-bottom: 32px;
    max-width: 700px;
    margin-left: auto;
    margin-right: auto;
  }
`;

// Footer
const Footer = styled.footer`
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  margin-top: 96px;
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
    font-size: 20px;
    margin-bottom: 16px;
  }

  h4 {
    font-weight: 600;
    margin-bottom: 12px;
  }

  p {
    color: ${({ theme }) => theme.colors.textSecondary};
    font-size: 14px;
  }

  ul {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  li a {
    color: ${({ theme }) => theme.colors.textSecondary};
    font-size: 14px;
    text-decoration: none;
    transition: color 0.3s ease;

    &:hover {
      color: ${({ theme }) => theme.colors.textPrimary};
    }
  }
`;

const FooterBottom = styled.div`
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  padding-top: 32px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  font-size: 14px;
  color: ${({ theme }) => theme.colors.textSecondary};

  @media (min-width: 768px) {
    flex-direction: row;
    justify-content: space-between;
  }
`;

const FooterLinks = styled.div`
  display: flex;
  gap: 24px;

  a {
    color: ${({ theme }) => theme.colors.textSecondary};
    text-decoration: none;
    transition: color 0.3s ease;

    &:hover {
      color: ${({ theme }) => theme.colors.textPrimary};
    }
  }
`;

// Icons
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

const UploadSvgIcon = () => (
  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
    />
  </svg>
);

const FileTextIcon = () => (
  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
    />
  </svg>
);

// Main Component
export default function Page() {
  const [file, setFile] = useState<File | null>(null);
  const [cvText, setCvText] = useState("");
  const [jobText, setJobText] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<{
    fitScore: number;
    summary: string;
    missingKeywords: string[];
  } | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const faqs = [
    {
      question: "How does Rejectly.pro work?",
      answer:
        "Upload your CV and the job description you're targeting. Our advanced AI analyzes the match between them, identifies gaps, and provides personalized improvement suggestions.",
    },
    {
      question: "What file formats do you support?",
      answer:
        "We support PDF and DOCX formats. You can also directly paste text for analysis.",
    },
    {
      question: "Is my data secure?",
      answer:
        "Absolutely! All your data is encrypted and stored securely. We never share your information with third parties. We're fully GDPR compliant.",
    },
    {
      question: "How many analyses can I do with the free plan?",
      answer:
        "The free plan allows 3 analyses per month. For unlimited analyses, upgrade to the Pro plan.",
    },
    {
      question: "What is ATS optimization?",
      answer:
        "ATS (Applicant Tracking System) is software many companies use to filter CVs. Rejectly.pro optimizes your CV to pass through these systems.",
    },
    {
      question: "Can I cancel anytime?",
      answer:
        "Yes! No contracts or long-term commitments. You can cancel anytime.",
    },
  ];

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragging(true);
    } else if (e.type === "dragleave") {
      setIsDragging(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files && files[0]) {
      setFile(files[0]);
      setCvText("");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setCvText("");
    }
  };

  const loadSample = () => {
    setCvText(
      "John Doe\nSoftware Engineer\n\nExperience:\n- 3 years of React development\n- Built 5 web applications\n- Team collaboration\n\nSkills: React, JavaScript, HTML, CSS"
    );
    setJobText(
      "Senior Frontend Developer\n\nRequirements:\n- 5+ years React experience\n- TypeScript expertise\n- Next.js knowledge\n- Testing experience (Jest, React Testing Library)\n- CI/CD pipelines\n- Team leadership"
    );
    setFile(null);
    showToastMessage("Sample data loaded!");
  };

  const handleAnalyze = async () => {
    if ((!file && !cvText) || !jobText) return;

    setIsAnalyzing(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));

    setResult({
      fitScore: 67,
      summary:
        "Your CV shows relevant React experience, but lacks several key requirements. You're missing TypeScript and Next.js expertise, which are crucial for this role. Additionally, your experience is below the 5+ years requirement.",
      missingKeywords: [
        "TypeScript",
        "Next.js",
        "Jest",
        "React Testing Library",
        "CI/CD",
        "Team Leadership",
      ],
    });

    setIsAnalyzing(false);
    showToastMessage("Analysis complete!");

    // Scroll to results
    setTimeout(() => {
      document.getElementById("results")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 100);
  };

  const showToastMessage = (message: string) => {
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  return (
    <Container>
      {/* Toast Notification */}
      {showToast && (
        <Toast>
          <CheckIcon />
          <span>{toastMessage}</span>
        </Toast>
      )}

      {/* Hero Section */}
      <HeroSection>
        <BackgroundBlur>
          <BlurCircle $position="top: 10%; left: 10%;" $color="#a855f7" />
          <BlurCircle
            $position="bottom: 10%; right: 10%;"
            $delay="1s"
            $color="#3b82f6"
          />
        </BackgroundBlur>

        <HeroContent>
          <Badge>
            <SparklesIcon />
            <span>AI-Powered CV Analysis</span>
          </Badge>

          <HeroTitle>
            <GradientText>Why Was I Rejected?</GradientText>
          </HeroTitle>

          <HeroSubtitle>
            Get instant, data-driven insights on why your CV didn&apos;t match
            the job. Powered by advanced AI to help you land your dream role.
          </HeroSubtitle>

          <ButtonGroup>
            <PrimaryButton href="#demo">
              <ZapIcon />
              Try It Free
            </PrimaryButton>
            <SecondaryButton href="#pricing">
              See Pricing
              <ArrowRightIcon />
            </SecondaryButton>
          </ButtonGroup>

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
              <span>2,847+</span> professionals using it
            </SocialProofText>
          </SocialProof>

          <DemoScreenshot>
            <Image
              src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&h=675&fit=crop"
              alt="Rejectly Demo"
              width={1200}
              height={675}
              priority
            />
          </DemoScreenshot>
        </HeroContent>
      </HeroSection>

      {/* How It Works */}
      <Section id="how">
        <SectionHeader>
          <SectionTitle>How It Works?</SectionTitle>
          <SectionSubtitle>
            Find opportunities in 3 simple steps
          </SectionSubtitle>
        </SectionHeader>

        <StepsGrid>
          <StepCard>
            <StepNumber>1</StepNumber>
            <StepImage>
              <Image
                src="https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=400&h=300&fit=crop"
                alt="Upload CV"
                width={400}
                height={300}
              />
            </StepImage>
            <StepTitle>Upload Your CV</StepTitle>
            <StepDescription>
              Upload in PDF or Word format. Alternatively, paste text directly.
            </StepDescription>
          </StepCard>

          <StepCard>
            <StepNumber>2</StepNumber>
            <StepImage>
              <Image
                src="https://images.unsplash.com/photo-1554774853-aae0a22c8aa4?w=400&h=300&fit=crop"
                alt="Job Description"
                width={400}
                height={300}
              />
            </StepImage>
            <StepTitle>Add Job Description</StepTitle>
            <StepDescription>
              Paste the complete description of the job you&apos;re targeting.
            </StepDescription>
          </StepCard>

          <StepCard>
            <StepNumber>3</StepNumber>
            <StepImage>
              <Image
                src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop"
                alt="Get Results"
                width={400}
                height={300}
              />
            </StepImage>
            <StepTitle>Get Instant Results</StepTitle>
            <StepDescription>
              Review the AI analysis and learn how to optimize your CV.
            </StepDescription>
          </StepCard>
        </StepsGrid>
      </Section>

      <Divider />

      {/* Demo Section - Your existing demo component */}
      <DemoSection id="demo">
        <DemoHeader>
          <DemoTitle>🚀 Try It Now - Free Demo</DemoTitle>
          <DemoSubtitle>
            Upload your CV or paste text, add a job description, and get instant
            AI feedback
          </DemoSubtitle>
          <LoadSampleButton onClick={loadSample}>
            📝 Load Sample Data
          </LoadSampleButton>
        </DemoHeader>

        {/* Input Grid */}
        <InputGrid>
          {/* CV Input */}
          <InputCard>
            <CardHeader>
              <CardTitle>Your CV</CardTitle>
              <CardDescription>Upload a file or paste text</CardDescription>
            </CardHeader>

            <UploadArea
              $isDragging={isDragging}
              onDragEnter={handleDrag}
              onDragOver={handleDrag}
              onDragLeave={handleDrag}
              onDrop={handleDrop}
              onClick={() => document.getElementById("cv-file-input")?.click()}
            >
              <UploadIconWrapper>
                <UploadSvgIcon />
              </UploadIconWrapper>
              <UploadText>
                {file ? "Change File" : "Click to upload or drag & drop"}
              </UploadText>
              <UploadHint>PDF or DOCX (max 5MB)</UploadHint>
            </UploadArea>

            {file && (
              <FileName>
                <FileTextIcon />
                <span>{file.name}</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setFile(null);
                  }}
                >
                  <XIcon />
                </button>
              </FileName>
            )}

            <HiddenInput
              id="cv-file-input"
              type="file"
              accept=".pdf,.docx"
              onChange={handleFileChange}
            />

            <StyledDivider>
              <span>OR</span>
            </StyledDivider>

            <StyledTextarea
              placeholder="Paste your CV text here..."
              value={cvText}
              onChange={(e) => {
                setCvText(e.target.value);
                if (e.target.value) setFile(null);
              }}
              disabled={!!file}
              rows={8}
            />
          </InputCard>

          {/* Job Input */}
          <InputCard>
            <CardHeader>
              <CardTitle>Job Description</CardTitle>
              <CardDescription>
                Paste the job posting you&apos;re targeting
              </CardDescription>
            </CardHeader>

            <StyledTextarea
              placeholder="Paste the full job description here..."
              value={jobText}
              onChange={(e) => setJobText(e.target.value)}
              rows={23}
            />
          </InputCard>
        </InputGrid>

        {/* Analyze Button */}
        <AnalyzeButtonWrapper>
          <AnalyzeButton
            onClick={handleAnalyze}
            disabled={(!file && !cvText) || !jobText || isAnalyzing}
            $isLoading={isAnalyzing}
          >
            {isAnalyzing ? (
              <>
                <Spinner />
                Analyzing...
              </>
            ) : (
              <>
                <TargetIcon />
                Analyze Match
              </>
            )}
          </AnalyzeButton>
        </AnalyzeButtonWrapper>

        {/* Results Section */}
        {result && (
          <ResultsCard id="results">
            {/* Score Display */}
            <ScoreDisplay>
              <ScoreValue>{result.fitScore}%</ScoreValue>
              <ScoreLabel>Match Score</ScoreLabel>
            </ScoreDisplay>

            {/* Summary */}
            <div>
              <SectionTitleWithIcon>
                <SparklesIcon />
                AI Summary
              </SectionTitleWithIcon>
              <SummaryBox>
                <p>{result.summary}</p>
              </SummaryBox>
            </div>

            {/* Missing Keywords */}
            <div>
              <SectionTitleWithIcon>
                <TargetIcon />
                Missing Keywords
              </SectionTitleWithIcon>
              <KeywordList>
                {result.missingKeywords?.map((keyword: string) => (
                  <KeywordBadge key={keyword}>{keyword}</KeywordBadge>
                ))}
              </KeywordList>
            </div>

            {/* Pro Preview */}
            <ProPreview>
              <BlurredContent>
                <h3>
                  <SparklesIcon />
                  Pro Features Preview
                </h3>
                <p>
                  • 3 professionally rewritten bullet points optimized for ATS
                </p>
                <p>
                  • 3 alternative role recommendations with match percentages
                </p>
                <p>• Detailed ATS optimization checklist</p>
                <p>• Save and compare unlimited analyses</p>
              </BlurredContent>

              <ProBadge>
                <div className="emoji">🔒</div>
                <div className="text">Pro Features Locked</div>
              </ProBadge>
            </ProPreview>

            {/* CTA Section */}
            <CTASection>
              <h3>Want the Full Analysis?</h3>
              <p>
                Sign up free to save this report, get unlimited analyses, and
                unlock Pro features for just $9 per report!
              </p>
              <CTAButtons>
                <CTAButton $variant="primary">Sign Up Free</CTAButton>
                <CTAButton $variant="secondary">Login</CTAButton>
              </CTAButtons>
            </CTASection>
          </ResultsCard>
        )}
      </DemoSection>

      <Divider />

      {/* Features */}
      <Section id="features">
        <SectionHeader>
          <SectionTitle>Why Rejectly.pro?</SectionTitle>
          <SectionSubtitle>Grow with data, not guesses</SectionSubtitle>
        </SectionHeader>

        <FeatureGrid>
          <FeatureCard>
            <FeatureIcon $gradient="linear-gradient(135deg, #a855f7 0%, #ec4899 100%)">
              <SparklesIcon />
            </FeatureIcon>
            <FeatureTitle>AI-Powered Analysis</FeatureTitle>
            <FeatureDescription>
              Advanced GPT-4 technology analyzes your CV against job
              requirements with human-level understanding
            </FeatureDescription>
          </FeatureCard>

          <FeatureCard>
            <FeatureIcon $gradient="linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)">
              <ZapIcon />
            </FeatureIcon>
            <FeatureTitle>Instant Results</FeatureTitle>
            <FeatureDescription>
              Get your match score and actionable feedback in seconds, not days.
              Start improving immediately.
            </FeatureDescription>
          </FeatureCard>

          <FeatureCard>
            <FeatureIcon $gradient="linear-gradient(135deg, #eab308 0%, #f97316 100%)">
              <TargetIcon />
            </FeatureIcon>
            <FeatureTitle>Actionable Insights</FeatureTitle>
            <FeatureDescription>
              Not just problems—get specific, prioritized recommendations to
              optimize your CV for each application
            </FeatureDescription>
          </FeatureCard>

          <FeatureCard>
            <FeatureIcon $gradient="linear-gradient(135deg, #10b981 0%, #14b8a6 100%)">
              <TargetIcon />
            </FeatureIcon>
            <FeatureTitle>ATS Optimization</FeatureTitle>
            <FeatureDescription>
              Ensure your CV passes through applicant tracking systems
            </FeatureDescription>
          </FeatureCard>

          <FeatureCard>
            <FeatureIcon $gradient="linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)">
              <SparklesIcon />
            </FeatureIcon>
            <FeatureTitle>Unlimited Comparisons</FeatureTitle>
            <FeatureDescription>
              Save and compare analyses across different job applications
            </FeatureDescription>
          </FeatureCard>

          <FeatureCard>
            <FeatureIcon $gradient="linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)">
              <ZapIcon />
            </FeatureIcon>
            <FeatureTitle>Professional Rewriting</FeatureTitle>
            <FeatureDescription>
              Get professionally rewritten bullet points optimized for ATS
            </FeatureDescription>
          </FeatureCard>
        </FeatureGrid>
      </Section>

      <Divider />

      {/* Testimonials */}
      <Section>
        <SectionHeader>
          <SectionTitle>What Our Users Say</SectionTitle>
          <SectionSubtitle>
            2,847+ professionals trust Rejectly.pro
          </SectionSubtitle>
        </SectionHeader>

        <TestimonialGrid>
          <TestimonialCard>
            <TestimonialHeader>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="https://i.pravatar.cc/150?img=10" alt="John" />
              <TestimonialAuthor>
                <div className="name">John Smith</div>
                <div className="role">Software Developer</div>
              </TestimonialAuthor>
            </TestimonialHeader>
            <TestimonialText>
              &quot;Thanks to Rejectly.pro, I saw what was missing in my CV and
              fixed it. Now I&apos;m getting more interview calls! 🚀&quot;
            </TestimonialText>
          </TestimonialCard>

          <TestimonialCard>
            <TestimonialHeader>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="https://i.pravatar.cc/150?img=20" alt="Sarah" />
              <TestimonialAuthor>
                <div className="name">Sarah Johnson</div>
                <div className="role">Marketing Specialist</div>
              </TestimonialAuthor>
            </TestimonialHeader>
            <TestimonialText>
              &quot;The AI analysis is incredibly accurate. I get different
              suggestions for each application and it really works.&quot;
            </TestimonialText>
          </TestimonialCard>

          <TestimonialCard>
            <TestimonialHeader>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="https://i.pravatar.cc/150?img=30" alt="Michael" />
              <TestimonialAuthor>
                <div className="name">Michael Chen</div>
                <div className="role">Product Manager</div>
              </TestimonialAuthor>
            </TestimonialHeader>
            <TestimonialText>
              &quot;Simple but powerful. Thanks to ATS optimization, I started
              passing initial screening rounds. Highly recommend! ⭐&quot;
            </TestimonialText>
          </TestimonialCard>
        </TestimonialGrid>
      </Section>

      {/* Founder Story */}
      <Section>
        <FounderStory>
          <Image
            src="https://i.pravatar.cc/200?img=40"
            alt="Founder"
            width={128}
            height={128}
            style={{ borderRadius: "50%", border: "4px solid #764ba2" }}
          />
          <FounderContent>
            <h3>The Story of Rejectly.pro</h3>
            <p>
              As a software engineer, I applied to dozens of jobs. With each
              rejection, I asked myself: &quot;Why?&quot;
            </p>
            <p>
              The answer was usually simple: my CV had points that didn&apos;t
              match the job posting. I wasn&apos;t using the right keywords or
              expressing my experience incorrectly.
            </p>
            <p>
              That&apos;s exactly why I built Rejectly.pro - so everyone can
              have these insights before applying. With AI, you can now act on
              real data instead of guessing.
            </p>
          </FounderContent>
        </FounderStory>
      </Section>

      <Divider />

      {/* Pricing */}
      <Section id="pricing">
        <SectionHeader>
          <SectionTitle>Simple and Transparent Pricing</SectionTitle>
          <SectionSubtitle>
            Affordable plans to help you succeed
          </SectionSubtitle>
        </SectionHeader>

        <PricingGrid>
          <PricingCard>
            <PricingTitle>Free</PricingTitle>
            <PricingPrice>
              $0<span>/month</span>
            </PricingPrice>
            <PricingFeatures>
              <PricingFeature $enabled>
                <CheckIcon />
                <span>3 analyses/month</span>
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
            </PricingFeatures>
            <PricingButton $variant="secondary">Start Free</PricingButton>
          </PricingCard>

          <PricingCard $featured>
            <PricingBadge>Most Popular</PricingBadge>
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
                <span>Advanced AI insights</span>
              </PricingFeature>
              <PricingFeature $enabled>
                <CheckIcon />
                <span>Professional rewriting</span>
              </PricingFeature>
              <PricingFeature $enabled>
                <CheckIcon />
                <span>ATS optimization guide</span>
              </PricingFeature>
              <PricingFeature $enabled>
                <CheckIcon />
                <span>Alternative role suggestions</span>
              </PricingFeature>
              <PricingFeature $enabled>
                <CheckIcon />
                <span>Priority support</span>
              </PricingFeature>
            </PricingFeatures>
            <PricingButton $variant="primary">Try 14 Days Free</PricingButton>
          </PricingCard>

          <PricingCard>
            <PricingTitle>Enterprise</PricingTitle>
            <PricingPrice>Custom</PricingPrice>
            <PricingFeatures>
              <PricingFeature $enabled>
                <CheckIcon />
                <span>Everything in Pro</span>
              </PricingFeature>
              <PricingFeature $enabled>
                <CheckIcon />
                <span>Unlimited team members</span>
              </PricingFeature>
              <PricingFeature $enabled>
                <CheckIcon />
                <span>Custom AI model</span>
              </PricingFeature>
              <PricingFeature $enabled>
                <CheckIcon />
                <span>API access</span>
              </PricingFeature>
              <PricingFeature $enabled>
                <CheckIcon />
                <span>Custom training</span>
              </PricingFeature>
              <PricingFeature $enabled>
                <CheckIcon />
                <span>24/7 support</span>
              </PricingFeature>
            </PricingFeatures>
            <PricingButton $variant="secondary">Contact Us</PricingButton>
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

      {/* Final CTA */}
      <Section>
        <FinalCTA>
          <BlurCircle
            $position="top: -100px; left: -100px;"
            $color="#a855f7"
            style={{ width: "300px", height: "300px" }}
          />
          <BlurCircle
            $position="bottom: -100px; right: -100px;"
            $color="#3b82f6"
            style={{ width: "300px", height: "300px" }}
          />

          <CTAContent>
            <h2>Ready for Your Dream Job?</h2>
            <p>
              Optimize your CV with data-driven insights and get more interview
              calls
            </p>

            <ButtonGroup>
              <PrimaryButton href="#demo">Try 14 Days Free</PrimaryButton>
            </ButtonGroup>

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
              </AvatarStack>
              <p style={{ fontSize: "14px", color: "#a1a1aa" }}>
                2,847+ people already using Rejectly.pro
              </p>
            </SocialProof>
          </CTAContent>
        </FinalCTA>
      </Section>

      {/* Footer */}
      <Footer>
        <FooterContent>
          <FooterGrid>
            <FooterColumn>
              <h3>Rejectly.pro</h3>
              <p>AI-powered CV analysis to help you land your dream job.</p>
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
                  <a href="#">Careers</a>
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
                  <a href="#">Contact</a>
                </li>
                <li>
                  <a href="#">Privacy</a>
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
