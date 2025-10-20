"use client";

import styled, { keyframes } from "styled-components";
import { useState } from "react";

// Animations
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const pulse = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: .5; }
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

// Hero Section
const HeroSection = styled.section`
  position: relative;
  max-width: 1200px;
  margin: 0 auto;
  padding: ${({ theme }) => `${theme.spacing.xl} ${theme.spacing.lg}`};
  text-align: center;
  overflow: hidden;
  animation: ${fadeIn} 0.6s ease;
`;

const BackgroundBlur = styled.div`
  position: absolute;
  inset: 0;
  opacity: 0.2;
  pointer-events: none;
`;

const BlurCircle = styled.div<{ $delay?: string; $position: string }>`
  position: absolute;
  width: 24rem;
  height: 24rem;
  border-radius: 50%;
  filter: blur(80px);
  animation: ${pulse} 4s ease-in-out infinite;
  animation-delay: ${({ $delay }) => $delay || "0s"};
  ${({ $position }) => $position}
`;

const HeroContent = styled.div`
  position: relative;
  z-index: 1;
  max-width: 1200px;
  margin: 0 auto;
`;

const Badge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  background: rgba(99, 102, 241, 0.1);
  border: 1px solid rgba(99, 102, 241, 0.2);
  border-radius: 9999px;
  padding: ${({ theme }) => `${theme.spacing.sm} ${theme.spacing.lg}`};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};

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
  font-size: ${({ theme }) => theme.typography.fontSize["5xl"]};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  line-height: 1.2;

  @media (max-width: 768px) {
    font-size: ${({ theme }) => theme.typography.fontSize["3xl"]};
  }
`;

const GradientText = styled.span`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  display: block;
`;

const HeroSubtitle = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.xl};
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  max-width: 900px;
  margin-left: auto;
  margin-right: auto;
  line-height: 1.6;

  @media (max-width: 768px) {
    font-size: ${({ theme }) => theme.typography.fontSize.base};
  }
`;

// Demo Section
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

// Input Grid
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

// Upload Area
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
    transition: color ${({ theme }) => theme.transitions.fast};

    &:hover {
      color: ${({ theme }) => theme.colors.primaryHover};
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

const Divider = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  margin: ${({ theme }) => theme.spacing.lg} 0;

  &::before,
  &::after {
    content: "";
    flex: 1;
    height: 1px;
    background-color: ${({ theme }) => theme.colors.border};
  }

  span {
    font-size: ${({ theme }) => theme.typography.fontSize.sm};
    color: ${({ theme }) => theme.colors.textSecondary};
    font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  }
`;

const StyledTextarea = styled.textarea<{ disabled?: boolean }>`
  width: 100%;
  background-color: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.lg};
  padding: ${({ theme }) => theme.spacing.md};
  color: ${({ theme }) => theme.colors.textPrimary};
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  font-family: inherit;
  resize: none;
  transition: all ${({ theme }) => theme.transitions.normal};

  &::placeholder {
    color: ${({ theme }) => theme.colors.textSecondary};
    opacity: 0.6;
  }

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primaryLight};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

// Analyze Button
const AnalyzeButtonWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const AnalyzeButton = styled.button<{
  disabled?: boolean;
  $isLoading?: boolean;
}>`
  background: ${({ disabled }) =>
    disabled
      ? "linear-gradient(135deg, #4b5563 0%, #374151 100%)"
      : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"};
  color: white;
  padding: ${({ theme }) => `${theme.spacing.md} ${theme.spacing.xl}`};
  border-radius: 9999px;
  border: none;
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  cursor: ${({ disabled }) => (disabled ? "not-allowed" : "pointer")};
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  transition: all ${({ theme }) => theme.transitions.normal};
  box-shadow: ${({ theme, disabled }) => (disabled ? "none" : theme.shadow.xl)};
  min-width: 200px;
  justify-content: center;

  &:hover {
    box-shadow: ${({ theme, disabled }) =>
      disabled ? "none" : theme.shadow.xl};
    transform: ${({ disabled }) => (disabled ? "none" : "translateY(-1px)")};
  }

  svg {
    width: 24px;
    height: 24px;
  }
`;

const Spinner = styled.div`
  width: 20px;
  height: 20px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: ${spin} 0.6s linear infinite;
`;

// Results Section
const ResultsCard = styled.div`
  margin-top: ${({ theme }) => theme.spacing.xl};
  background: ${({ theme }) => theme.colors.backgroundAlt};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.xl};
  padding: ${({ theme }) => theme.spacing.xl};
  box-shadow: ${({ theme }) => theme.shadow.xl};
  animation: ${fadeIn} 0.6s ease;

  @media (min-width: 768px) {
    padding: ${({ theme }) => theme.spacing.xl};
  }
`;

const ScoreDisplay = styled.div`
  text-align: center;
  padding: ${({ theme }) => theme.spacing.xl};
  background: linear-gradient(
    135deg,
    rgba(102, 126, 234, 0.1) 0%,
    rgba(118, 75, 162, 0.1) 100%
  );
  border-radius: ${({ theme }) => theme.radius.xl};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const ScoreValue = styled.div`
  font-size: 5rem;
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: ${({ theme }) => theme.spacing.sm};
  line-height: 1;

  @media (min-width: 768px) {
    font-size: 6rem;
  }
`;

const ScoreLabel = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.xl};
  color: ${({ theme }) => theme.colors.textSecondary};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
`;

const SectionTitle = styled.h3`
  font-size: ${({ theme }) => theme.typography.fontSize.xl};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};

  svg {
    width: 28px;
    height: 28px;
  }
`;

const SummaryBox = styled.div`
  background-color: ${({ theme }) => theme.colors.surface};
  border-left: 4px solid ${({ theme }) => theme.colors.primary};
  padding: ${({ theme }) => theme.spacing.lg};
  border-radius: ${({ theme }) => theme.radius.md};
  margin-bottom: ${({ theme }) => theme.spacing.xl};

  p {
    color: ${({ theme }) => theme.colors.textSecondary};
    line-height: 1.7;
    margin: 0;
    font-size: ${({ theme }) => theme.typography.fontSize.lg};
  }
`;

const KeywordList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.sm};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const KeywordBadge = styled.span`
  background: rgba(234, 179, 8, 0.1);
  border: 1px solid rgba(234, 179, 8, 0.3);
  color: #fde047;
  padding: ${({ theme }) => `${theme.spacing.xs} ${theme.spacing.md}`};
  border-radius: 9999px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
`;

const ProPreview = styled.div`
  position: relative;
  background: linear-gradient(
    135deg,
    rgba(102, 126, 234, 0.05) 0%,
    rgba(118, 75, 162, 0.05) 100%
  );
  border: 2px dashed ${({ theme }) => theme.colors.primary};
  border-radius: ${({ theme }) => theme.radius.xl};
  padding: ${({ theme }) => theme.spacing.xl};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const BlurredContent = styled.div`
  filter: blur(4px);
  user-select: none;
  pointer-events: none;

  h3 {
    font-size: ${({ theme }) => theme.typography.fontSize.xl};
    font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
    margin-bottom: ${({ theme }) => theme.spacing.md};
    display: flex;
    align-items: center;
    gap: ${({ theme }) => theme.spacing.sm};
  }

  p {
    margin-bottom: ${({ theme }) => theme.spacing.sm};
    color: ${({ theme }) => theme.colors.textSecondary};
  }
`;

const ProBadge = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: ${({ theme }) => theme.spacing.xl};
  border-radius: ${({ theme }) => theme.radius.xl};
  text-align: center;
  box-shadow: ${({ theme }) => theme.shadow.xl};

  .emoji {
    font-size: 2.5rem;
    margin-bottom: ${({ theme }) => theme.spacing.sm};
  }

  .text {
    font-size: ${({ theme }) => theme.typography.fontSize.xl};
    font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  }
`;

const CTASection = styled.div`
  text-align: center;
  padding: ${({ theme }) => theme.spacing.xl};
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: ${({ theme }) => theme.radius.xl};
  color: white;

  h3 {
    font-size: ${({ theme }) => theme.typography.fontSize.xl};
    margin-bottom: ${({ theme }) => theme.spacing.md};
    font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
    color: white;
  }

  p {
    font-size: ${({ theme }) => theme.typography.fontSize.lg};
    margin-bottom: ${({ theme }) => theme.spacing.xl};
    opacity: 0.95;
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
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.normal};
  min-width: 160px;

  ${({ $variant }) =>
    $variant === "primary"
      ? `
    background: white;
    color: #667eea;
    border: none;
    
    &:hover {
      background: #f1f5f9;
    }
  `
      : `
    background: transparent;
    color: white;
    border: 2px solid white;
    
    &:hover {
      background: rgba(255, 255, 255, 0.1);
    }
  `}
`;

// Features Section
const FeaturesSection = styled.section`
  max-width: 1200px;
  margin: 0 auto;
  padding: ${({ theme }) => `${theme.spacing.xl} ${theme.spacing.lg}`};
`;

const FeaturesSectionTitle = styled.h2`
  font-size: ${({ theme }) => theme.typography.fontSize.xl};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  text-align: center;
  margin-bottom: ${({ theme }) => theme.spacing.xl};

  @media (max-width: 768px) {
    font-size: ${({ theme }) => theme.typography.fontSize.xl};
  }
`;

const FeatureGrid = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.spacing.xl};
  grid-template-columns: 1fr;

  @media (min-width: 768px) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

const FeatureCard = styled.div`
  background: ${({ theme }) => theme.colors.backgroundAlt};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.xl};
  padding: ${({ theme }) => theme.spacing.xl};
  text-align: center;
  transition: all ${({ theme }) => theme.transitions.normal};

  &:hover {
    border-color: ${({ theme }) => theme.colors.borderHover};
    transform: translateY(-4px);
  }
`;

const FeatureIcon = styled.div<{ $gradient: string }>`
  width: 64px;
  height: 64px;
  background: ${({ $gradient }) => $gradient};
  border-radius: ${({ theme }) => theme.radius.lg};
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto ${({ theme }) => theme.spacing.lg};

  svg {
    width: 32px;
    height: 32px;
    color: white;
  }
`;

const FeatureTitle = styled.h3`
  font-size: ${({ theme }) => theme.typography.fontSize.xl};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const FeatureDescription = styled.p`
  color: ${({ theme }) => theme.colors.textSecondary};
  line-height: 1.6;
  font-size: ${({ theme }) => theme.typography.fontSize.base};
`;

// Toast
const Toast = styled.div`
  position: fixed;
  top: ${({ theme }) => theme.spacing.lg};
  right: ${({ theme }) => theme.spacing.lg};
  z-index: 1000;
  background: ${({ theme }) => theme.colors.backgroundAlt};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.lg};
  padding: ${({ theme }) => `${theme.spacing.md} ${theme.spacing.lg}`};
  box-shadow: ${({ theme }) => theme.shadow.xl};
  animation: ${fadeIn} 0.3s ease;
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};

  svg {
    width: 20px;
    height: 20px;
    color: #10b981;
  }
`;

// Sample Data
const sampleCV = `Senior Frontend Developer
Istanbul, Turkey | developer@email.com

EXPERIENCE
Senior Frontend Developer | TechCorp | 2021-Present
- Led development of React-based dashboard serving 10K+ daily users
- Implemented component library with TypeScript and Storybook
- Mentored 2 junior developers and conducted code reviews

Frontend Developer | StartupXYZ | 2019-2021
- Built responsive web applications using React and Next.js
- Collaborated with designers to implement pixel-perfect UIs

SKILLS
React, TypeScript, JavaScript, HTML, CSS, Git, REST APIs`;

const sampleJob = `Senior Frontend Developer - Remote

ABOUT THE ROLE
We're looking for an experienced Senior Frontend Developer to join our team.

REQUIREMENTS
- 5+ years of React experience
- Strong TypeScript skills
- Experience with Next.js and modern frontend tooling
- Knowledge of Docker and CI/CD pipelines
- AWS/Cloud experience preferred
- Strong communication skills

RESPONSIBILITIES
- Build scalable web applications
- Lead technical discussions and architecture decisions
- Code review and mentor junior developers
- Collaborate with design and backend teams`;

// SVG Icons
const UploadSvgIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
    />
  </svg>
);

const FileTextIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
    />
  </svg>
);

const XIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M6 18L18 6M6 6l12 12"
    />
  </svg>
);

const CheckIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M4.5 12.75l6 6 9-13.5"
    />
  </svg>
);

const SparklesIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z"
    />
  </svg>
);

const TargetIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"
    />
  </svg>
);

const ZapIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z"
    />
  </svg>
);

// Types
interface AnalysisResult {
  fitScore: number;
  summary: string;
  missingKeywords: string[];
}

// Main Component
export default function RejectlyOnboarding() {
  const [file, setFile] = useState<File | null>(null);
  const [cvText, setCvText] = useState("");
  const [jobText, setJobText] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const showNotification = (message: string) => {
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setCvText("");
      showNotification("File uploaded! Now add a job description.");
    }
  };

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

    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      setFile(droppedFile);
      setCvText("");
      showNotification("File uploaded! Now add a job description.");
    }
  };

  const loadSample = () => {
    setFile(null);
    setCvText(sampleCV);
    setJobText(sampleJob);
    showNotification("Sample data loaded! Click Analyze to try it.");
  };

  const handleAnalyze = () => {
    if ((!file && !cvText) || !jobText) {
      showNotification("Please provide both CV and Job Description");
      return;
    }

    setIsAnalyzing(true);

    // Simulate API call
    setTimeout(() => {
      setResult({
        fitScore: 76,
        summary:
          "Your CV shows strong React and TypeScript experience, which aligns well with the role requirements. However, you&apos;re missing explicit mentions of Docker, CI/CD pipelines, and AWS experience. Adding these keywords and providing concrete examples of your work with these technologies would significantly improve your match score.",
        missingKeywords: [
          "Docker",
          "CI/CD",
          "AWS",
          "Cloud Architecture",
          "Kubernetes",
        ],
      });
      setIsAnalyzing(false);
      showNotification("Analysis complete!");
      setTimeout(() => {
        document
          .getElementById("results")
          ?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }, 2000);
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
          <BlurCircle
            $position="top: 25%; left: 25%;"
            style={{ background: "#a855f7" }}
          />
          <BlurCircle
            $position="bottom: 25%; right: 25%;"
            $delay="1s"
            style={{ background: "#3b82f6" }}
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
        </HeroContent>
      </HeroSection>

      {/* Demo Section */}
      <DemoSection>
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

            <Divider>
              <span>OR</span>
            </Divider>

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
              <SectionTitle>
                <SparklesIcon />
                AI Summary
              </SectionTitle>
              <SummaryBox>
                <p>{result.summary}</p>
              </SummaryBox>
            </div>

            {/* Missing Keywords */}
            <div>
              <SectionTitle>
                <TargetIcon />
                Missing Keywords
              </SectionTitle>
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

      {/* Features Section */}
      <FeaturesSection>
        <FeaturesSectionTitle>Why Rejectly.pro?</FeaturesSectionTitle>

        <FeatureGrid>
          {/* Feature 1 */}
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

          {/* Feature 2 */}
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

          {/* Feature 3 */}
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
        </FeatureGrid>
      </FeaturesSection>
    </Container>
  );
}
