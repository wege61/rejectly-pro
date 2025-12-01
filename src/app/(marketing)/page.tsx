"use client";

import styled, { keyframes } from "styled-components";
import { useState, useRef } from "react";
import { ROUTES } from "@/lib/constants";
import { Footer } from "@/components/ui/Footer";

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

const UploadIcon = () => (
  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
    />
  </svg>
);

const DocumentTextIcon = () => (
  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
    />
  </svg>
);

const BriefcaseIcon = () => (
  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0M12 12.75h.008v.008H12v-.008z"
    />
  </svg>
);

const RefreshIcon = () => (
  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
    />
  </svg>
);

const LockIcon = () => (
  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
    />
  </svg>
);

const MagnifyingGlassIcon = () => (
  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
    />
  </svg>
);

const RobotIcon = () => (
  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2zm8-12v2m-2 4h.01M13 11h.01"
    />
  </svg>
);

const LightBulbIcon = () => (
  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
    />
  </svg>
);

const PencilIcon = () => (
  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
    />
  </svg>
);

const DocumentCheckIcon = () => (
  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 12l2 2 4-4"
    />
  </svg>
);

const BriefcaseSearchIcon = () => (
  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
    />
  </svg>
);

const DocumentDuplicateIcon = () => (
  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
    />
  </svg>
);

// ==================== LAYOUT ====================
const Container = styled.div`
  min-height: 100vh;
  background-color: var(--bg-color);
  color: var(--text-color);
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
  background-color: var(--bg-color);

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
  $isDarkMode?: boolean;
}>`
  position: absolute;
  border-radius: 50%;
  filter: blur(120px);
  ${({ $position }) => $position}
  background: ${({ $color }) => $color};
  opacity: ${({ $isDarkMode }) => ($isDarkMode ? '0.6' : '0.6')};

  /* Hide/show based on theme */
  ${({ $isDarkMode }) => $isDarkMode ? `
    display: none;

    [data-theme="dark"] & {
      display: block;
    }

    @media (prefers-color-scheme: dark) {
      display: block;
    }

    [data-theme="light"] & {
      display: none;
    }
  ` : `
    display: block;

    [data-theme="dark"] & {
      display: none;
    }

    @media (prefers-color-scheme: dark) {
      display: none;
    }

    [data-theme="light"] & {
      display: block;
    }
  `}
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
  background: rgba(0, 110, 129, 0.15);
  border: 1px solid rgba(var(--primary-500-rgb), 0.4);
  border-radius: 9999px;
  padding: 6px 16px;
  margin-bottom: 24px;
  font-weight: 500;
  font-size: 14px;
  animation: ${fadeIn} 0.6s ease-out;

  svg {
    width: 18px;
    height: 18px;
    
  }

  span {
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
  color: var(--landing);
  font-weight: 900;
`;

const HeroSubtitle = styled.p`
  font-size: 20px;
  color: #5C6570;
  margin-bottom: 40px;
  max-width: 700px;
  margin-left: auto;
  margin-right: auto;
  line-height: 1.6;
  animation: ${fadeIn} 0.6s ease-out 0.2s backwards;

  [data-theme="dark"] & {
    color: #A5A9B3;
  }

  @media (prefers-color-scheme: dark) {
    color: #A5A9B3;
  }

  [data-theme="light"] & {
    color: #5C6570;
  }

  strong {
    color: inherit;
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
  background: var(--landing-button);
  color: #FFFFFF;
  padding: 18px 40px;
  border-radius: 9999px;
  font-weight: 700;
  font-size: 18px;
  transition: all 0.3s ease;
  cursor: pointer;
  text-decoration: none;
  box-shadow: 0 8px 24px rgba(255, 122, 115, 0.25);

  &:hover {
    background: #FF6A64;
    transform: translateY(-2px);
    box-shadow: 0 15px 40px rgba(255, 122, 115, 0.4);
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
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: #0B666A;
  padding: 18px 32px;
  border-radius: 9999px;
  font-weight: 600;
  font-size: 16px;
  transition: all 0.3s ease;
  cursor: pointer;
  text-decoration: none;

  [data-theme="dark"] & {
    color: #FFFFFF;
    border-color: rgba(255, 255, 255, 0.3);
  }

  @media (prefers-color-scheme: dark) {
    color: #FFFFFF;
    border-color: rgba(255, 255, 255, 0.3);
  }

  [data-theme="light"] & {
    color: #0B666A;
    border-color: rgba(11, 102, 106, 0.2);
  }

  &:hover {
    background: rgba(255, 255, 255, 0.1);

    [data-theme="dark"] & {
      background: rgba(255, 255, 255, 0.1);
      border-color: rgba(255, 255, 255, 0.4);
    }

    [data-theme="light"] & {
      background: rgba(11, 102, 106, 0.05);
      border-color: rgba(11, 102, 106, 0.3);
    }
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
  animation: ${fadeIn} 0.6s ease-out 0.4s backwards
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
    color: #0B666A;

    [data-theme="dark"] & {
      color: #ea7a18;
    }

    @media (prefers-color-scheme: dark) {
      color: #97FEED;
    }

    [data-theme="light"] & {
      color: #0B666A;
    }
  }

  .label {
    font-size: 13px;
    text-align: center;
    line-height: 1.4;
    color: #5C6570;

    [data-theme="dark"] & {
      color: #A5A9B3;
    }

    @media (prefers-color-scheme: dark) {
      color: #A5A9B3;
    }

    [data-theme="light"] & {
      color: #5C6570;
    }
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
    border: 3px solid var(--bg-color);
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
  color: var(--text-secondary);
  font-size: 15px;

  svg {
    width: 16px;
    height: 16px;
    color: #ea7a18;;
    fill: #ea7a18;;
  }

  strong {
    color: var(--text-color);
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

  

  svg {
    width: 48px;
    height: 48px;
  }

  @media (max-width: 768px) {
    font-size: 32px;

    svg {
      width: 32px;
      height: 32px;
    }
  }
`;

const SectionSubtitle = styled.p`
  font-size: 20px;
  color: var(--text-secondary);

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
  background: var(--bg-alt);
  border: 1px solid var(--primary-500);
  border-radius: ${({ theme }) => theme.radius.xl};
  padding: 40px;
  box-shadow: 0 4px 24px rgba(var(--primary-500-rgb), 0.08);

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
  color: var(--text-secondary);
  margin-bottom: 20px;
`;

const LoadSampleButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: linear-gradient(135deg, rgba(var(--primary-500-rgb), 0.1) 0%, rgba(var(--primary-500-rgb), 0.1) 100%);
  border: 1px solid var(--primary-500);
  color: var(--accent);
  padding: 10px 20px;
  border-radius: 9999px;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;

  svg {
    width: 18px;
    height: 18px;
  }

  &:hover {
    background: linear-gradient(135deg, rgba(var(--primary-500-rgb), 0.15) 0%, rgba(var(--primary-500-rgb), 0.15) 100%);
    border-color: var(--primary-500);
  }
`;

const InputWrapper = styled.div`
  margin-bottom: 16px;
`;

const InputLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 600;
  color: var(--text-color);
  margin-bottom: 8px;

  svg {
    width: 18px;
    height: 18px;
    color: var(--accent);
  }
`;

const UploadOrText = styled.div`
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  gap: 16px;
  align-items: stretch;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 12px;
  }
`;

const UploadBox = styled.label`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 32px 20px;
  background: var(--bg-color);
  border: 2px dashed var(--primary-200);
  border-radius: ${({ theme }) => theme.radius.lg};
  color: var(--primary-200);
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: center;

  &:hover {
    background: linear-gradient(135deg, rgba(var(--primary-500-rgb), 0.15) 0%, rgba(var(--primary-500-rgb), 0.15) 100%);
    border-color: var(--primary-500);
    transform: translateY(-2px);
  }

  svg {
    width: 32px;
    height: 32px;
  }

  input {
    display: none;
  }

  .upload-text {
    font-weight: 700;
    font-size: 15px;
    color: var(--primary-500);
  }

  .upload-subtext {
    font-size: 12px;
    color: var(--text-secondary);
    font-weight: 500;
  }
`;

const TextBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;

  .paste-label {
    font-size: 13px;
    font-weight: 600;
    color: var(--text-secondary);
    text-align: center;
  }
`;

const OrDivider = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-secondary);
  font-size: 13px;
  font-weight: 600;
  text-transform: uppercase;
  position: relative;

  &:before {
    content: '';
    position: absolute;
    left: 50%;
    top: 0;
    bottom: 0;
    width: 1px;
    background: linear-gradient(180deg, transparent, var(--border-color), transparent);
    transform: translateX(-50%);
  }

  span {
    position: relative;
    background: var(--bg-alt);
    padding: 8px 12px;
    border-radius: 9999px;
    border: 1px solid var(--border-color);
    z-index: 1;
  }

  @media (max-width: 768px) {
    &:before {
      width: 100%;
      height: 1px;
      left: 0;
      top: 50%;
      transform: translateY(-50%);
      background: linear-gradient(90deg, transparent, var(--border-color), transparent);
    }
  }
`;

const UploadedFileCard = styled.div`
  background: linear-gradient(
    135deg,
    rgba(var(--success-rgb), 0.05) 0%,
    rgba(var(--success-rgb), 0.1) 100%
  );
  border: 2px solid var(--success);
  border-radius: ${({ theme }) => theme.radius.lg};
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  animation: ${fadeIn} 0.3s ease;
`;

const FileHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const FileIconWrapper = styled.div`
  width: 56px;
  height: 56px;
  background: var(--success);
  border-radius: ${({ theme }) => theme.radius.lg};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  svg {
    width: 32px;
    height: 32px;
    color: white;
  }
`;

const FileInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

const FileName = styled.div`
  font-weight: 700;
  font-size: 16px;
  color: var(--text-color);
  margin-bottom: 4px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const FileStats = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 14px;
  color: var(--text-secondary);
  flex-wrap: wrap;
`;

const FileStat = styled.span`
  display: flex;
  align-items: center;
  gap: 4px;

  svg {
    width: 16px;
    height: 16px;
    color: var(--success);
  }
`;

const FileActions = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 8px;

  @media (max-width: 640px) {
    flex-direction: column;
  }
`;

const FileActionButton = styled.button<{ $variant?: "primary" | "danger" }>`
  flex: 1;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 10px 16px;
  border-radius: ${({ theme }) => theme.radius.md};
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid;

  ${({ $variant }) =>
    $variant === "danger"
      ? `
    background: linear-gradient(135deg, rgba(255, 179, 186, 0.08) 0%, rgba(255, 204, 229, 0.08) 100%);
    border-color: rgba(255, 143, 163, 0.3);
    color: #FF8FA3;

    &:hover {
      background: linear-gradient(135deg, rgba(255, 179, 186, 0.15) 0%, rgba(255, 204, 229, 0.15) 100%);
      border-color: rgba(255, 143, 163, 0.5);
    }
  `
      : `
    background: linear-gradient(135deg, rgba(var(--primary-500-rgb), 0.08) 0%, rgba(var(--primary-500-rgb), 0.08) 100%);
    border-color: var(--primary-500);
    color: var(--accent);

    &:hover {
      background: linear-gradient(135deg, rgba(var(--primary-500-rgb), 0.15) 0%, rgba(var(--primary-500-rgb), 0.15) 100%);
      border-color: var(--primary-500);
    }
  `}

  svg {
    width: 16px;
    height: 16px;
  }
`;

const DemoTextarea = styled.textarea`
  width: 100%;
  background: var(--bg-color);
  border: 2px solid var(--border-color);
  border-radius: ${({ theme }) => theme.radius.lg};
  padding: 16px;
  color: var(--text-color);
  font-size: 14px;
  font-family: inherit;
  resize: vertical;
  min-height: 160px;
  transition: all 0.3s ease;
  flex: 1;

  &:focus {
    outline: none;
    border-color: var(--accent);
    box-shadow: 0 0 0 3px rgba(var(--primary-500-rgb), 0.1);
  }

  &::placeholder {
    color: var(--text-secondary);
  }

  &:hover {
    border-color: var(--primary-500);
  }
`;

const AnalyzeButton = styled.button<{ $isLoading?: boolean }>`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background: var(--landing-button);
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
    box-shadow: 0 10px 25px rgba(var(--primary-500-rgb), 0.4);
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

const BigSpinner = styled.div`
  width: 48px;
  height: 48px;
  border: 4px solid rgba(var(--primary-500-rgb), 0.2);
  border-top-color: var(--accent);
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;
  margin: 0 auto;
`;

const ResultsCard = styled.div`
  margin-top: 32px;
  background: var(--bg-color);
  border: 1px solid var(--border-color);
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
    rgba(var(--primary-500-rgb), 0.1) 0%,
    rgba(var(--primary-500-rgb), 0.1) 100%
  );
  border-radius: ${({ theme }) => theme.radius.lg};
  border: 1px solid var(--primary-500);
`;

const ScoreValue = styled.div`
  font-size: 72px;
  font-weight: 900;
  background: var(--accent);
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
  color: var(--text-secondary);
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
    color: var(--accent);
  }
`;

const SummaryBox = styled.div`
  background: var(--bg-alt);
  border: 1px solid var(--border-color);
  border-radius: ${({ theme }) => theme.radius.md};
  padding: 20px;
  line-height: 1.7;
  color: var(--text-secondary);
`;

const KeywordList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

const KeywordBadge = styled.span`
  background: linear-gradient(135deg, rgba(255, 179, 186, 0.1) 0%, rgba(255, 204, 229, 0.1) 100%);
  border: 1px solid rgba(255, 143, 163, 0.3);
  color: #FF8FA3;
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
    rgba(var(--primary-500-rgb), 0.08) 0%,
    rgba(var(--primary-500-rgb), 0.08) 100%
  );
  border-radius: ${({ theme }) => theme.radius.lg};
  border: 1px solid var(--primary-500);
  margin-top: 32px;

  h3 {
    font-size: 24px;
    font-weight: 700;
    margin-bottom: 12px;

    svg {
      width: 24px;
      height: 24px;
    }
  }

  p {
    color: var(--text-secondary);
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

  ${({ $variant }) =>
    $variant === "primary"
      ? `
    background: var(--accent);
    color: white;

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 10px 25px rgba(var(--primary-500-rgb), 0.4);
    }
  `
      : `
    background: var(--surface-color);
    color: var(--text-color);
    border: 1px solid var(--border-color);

    &:hover {
      background: var(--surface-hover);
    }
  `}
`;

// ==================== FEATURES ====================
const FeatureGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 32px;

  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const FeatureCard = styled.div`
  background: var(--bg-alt);
  border: 1px solid var(--border-color);
  border-radius: ${({ theme }) => theme.radius.xl};
  padding: 32px;
  transition: all 0.3s ease;
  text-align: center;

  &:hover {
    border-color: var(--primary-color);
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
  color: var(--text-secondary);
  line-height: 1.6;
  font-size: 15px;
`;

const FeatureHighlight = styled.div`
  margin-top: 16px;
  padding: 12px;
  background: rgba(var(--primary-500-rgb), 0.08);
  border-radius: ${({ theme }) => theme.radius.md};
  border: 1px solid var(--primary-500);

  strong {
    color: var(--accent);
    font-weight: 700;
  }
`;

// ==================== TESTIMONIALS - STYLED COMPONENTS ====================
// (Diğer styled components'lerden sonra, FeatureGrid'den sonra ekleyin)

const TestimonialGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 32px;

  @media (min-width: 768px) and (max-width: 850px) {
    gap: 18px;
  }

  @media (min-width: 768px) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

const TestimonialCard = styled.div`
  background: var(--bg-alt);
  border: 1px solid var(--border-color);
  border-radius: ${({ theme }) => theme.radius.xl};
  padding: 32px;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  gap: 20px;

  @media (min-width: 768px) and (max-width: 850px) {
    gap: 16px;
    padding: 20px;
  }

  &:hover {
    border-color: var(--primary-color);
    transform: translateY(-4px);
    box-shadow: ${({ theme }) => theme.shadow.lg};
  }
`;

const TestimonialHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap; /* 🔥 Wrap eklendi */

  img {
    width: 56px;
    height: 56px;
    border-radius: 50%;
    border: 2px solid var(--border-color);
  }
`;

const TestimonialAuthor = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;

  .name {
    font-weight: 700;
    font-size: 16px;
    color: var(--text-color);
  }

  .role {
    font-size: 14px;
    color: var(--text-secondary);
  }
`;

const TestimonialRating = styled.div`
  display: flex;
  gap: 4px;
  margin-left: auto;

  svg {
    width: 18px;
    height: 18px;
    color: #ea7a18;
    fill: #ea7a18;
  }

  /* 🔥 1040px altında ismin altına taşı */
  @media (max-width: 1040px) {
    width: 100%;
    margin-left: 0;
    padding-left: 72px; /* Avatar genişliği + gap */
  }

  /* 🔥 768px altında tekrar ismin yanına dön */
  @media (max-width: 768px) {
    width: auto;
    margin-left: auto;
    padding-left: 0;
  }
`;

const TestimonialText = styled.p`
  color: var(--text-color);
  line-height: 1.7;
  font-size: 15px;
  font-style: italic;
  position: relative;

  &:before {
    content: '"';
    font-size: 48px;
    color: var(--primary-color);
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
  background: rgba(var(--success-rgb), 0.1);
  border: 1px solid var(--success);
  color: var(--success);
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
  gap: 24px;
  max-width: 1100px;
  margin: 0 auto;

  @media (min-width: 768px) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

const PricingCard = styled.div<{ $featured?: boolean }>`
  background: var(--bg-alt);
  border: ${({ $featured }) =>
    $featured
      ? "2px solid #ff6a64"
      : "1px solid var(--border-color)"};
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
  top: -16px;
  left: 50%;
  transform: translateX(-50%);
  background: var(--accent);
  color: white;
  padding: 8px 20px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
  box-shadow: 0 4px 12px rgba(var(--accent-rgb), 0.3);
`;

const PricingTitle = styled.h3`
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 12px;
`;

const PricingPrice = styled.div`
  font-size: 56px;
  font-weight: 800;
  margin-bottom: 8px;
  line-height: 1;

  span {
    font-size: 20px;
    color: var(--text-secondary);
    font-weight: 600;
  }
`;

const PricingSubtext = styled.p`
  font-size: 14px;
  color: var(--success);
  font-weight: 600;
  margin-bottom: 24px;
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
    color: ${({ $enabled }) => ($enabled ? "var(--success)" : "#71717a")};
  }

  span {
    color: ${({ $enabled }) =>
      $enabled ? "var(--text-color)" : "var(--text-secondary)"};
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

  ${({ $variant }) =>
    $variant === "primary"
      ? `
    background: var(--accent);
    color: white;

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 10px 25px rgba(var(--primary-500-rgb), 0.3);
    }
  `
      : `
    background: var(--surface-color);
    color: var(--text-color);
    border: 1px solid var(--border-color);

    &:hover {
      background: var(--surface-hover);
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
  background: var(--bg-alt);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.3s ease;

  ${({ $isOpen }) =>
    $isOpen &&
    `
    border-color: var(--primary-500);
    box-shadow: 0 4px 12px rgba(var(--primary-500-rgb), 0.1);
  `}
`;

const FAQQuestion = styled.button<{ $isOpen?: boolean }>`
  width: 100%;
  background: none;
  border: none;
  padding: 20px 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  cursor: pointer;
  text-align: left;
  transition: background 0.2s ease;

  &:hover {
    background: rgba(var(--primary-500-rgb), 0.05);
  }

  @media (max-width: 768px) {
    padding: 16px 20px;
  }
`;

const FAQQuestionText = styled.span`
  font-size: 18px;
  font-weight: 600;
  color: var(--text-color);
  flex: 1;

  @media (max-width: 768px) {
    font-size: 16px;
  }
`;

const FAQQuestionIcon = styled.span<{ $isOpen?: boolean }>`
  font-size: 24px;
  color: var(--primary-500);
  transition: transform 0.3s ease;
  transform: ${({ $isOpen }) => ($isOpen ? "rotate(180deg)" : "rotate(0)")};
  flex-shrink: 0;
`;

const FAQAnswer = styled.div<{ $isOpen?: boolean }>`
  max-height: ${({ $isOpen }) => ($isOpen ? "500px" : "0")};
  overflow: hidden;
  transition: max-height 0.3s ease, padding 0.3s ease;
  padding: ${({ $isOpen }) => ($isOpen ? "0 24px 20px 24px" : "0 24px")};

  @media (max-width: 768px) {
    padding: ${({ $isOpen }) => ($isOpen ? "0 20px 16px 20px" : "0 20px")};
  }
`;

const FAQAnswerText = styled.p`
  font-size: 16px;
  line-height: 1.8;
  color: var(--text-secondary);

  strong {
    color: var(--text-color);
    font-weight: 600;
  }

  a {
    color: var(--accent);
    text-decoration: underline;
    transition: opacity 0.2s ease;

    &:hover {
      opacity: 0.8;
    }
  }
`;

const FAQButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 48px;

  @media (max-width: 768px) {
    margin-top: 32px;
  }
`;

const FAQButton = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 14px 32px;
  background: var(--primary-500);
  color: white;
  font-size: 16px;
  font-weight: 600;
  border-radius: 12px;
  text-decoration: none;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(var(--primary-500-rgb), 0.2);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(var(--primary-500-rgb), 0.3);
  }

  @media (max-width: 768px) {
    padding: 12px 24px;
    font-size: 15px;
  }
`;

const LoadingState = styled.div`
  text-align: center;
  padding: 60px 32px;

  h3 {
    font-size: 24px;
    margin: 24px 0 16px;

    svg {
      width: 24px;
      height: 24px;
    }
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
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  background: var(--bg-alt);
  border: 1px solid var(--border-color);
  border-radius: ${({ theme }) => theme.radius.md};
  font-size: 15px;
  color: ${({ $completed }) =>
    $completed ? "var(--accent)" : "var(--text-secondary)"};
  font-weight: ${({ $completed }) => ($completed ? 600 : 400)};
  transition: all 0.3s ease;

  svg {
    width: 20px;
    height: 20px;
    flex-shrink: 0;
    color: ${({ $completed }) => ($completed ? "var(--success)" : "var(--accent)")};
  }

  .loading-icon {
    width: 16px;
    height: 16px;
    border: 2px solid var(--primary-500);
    border-top-color: var(--accent);
    border-radius: 50%;
    animation: ${spin} 0.8s linear infinite;
  }
`;

const ImprovementSection = styled.div`
  margin-top: 32px;
  background: var(--bg-color);
  border: 1px solid var(--border-color);
  border-radius: ${({ theme }) => theme.radius.lg};
  padding: 32px;

  @media (max-width: 768px) {
    padding: 20px;
  }
`;

const ImprovementHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;

  h3 {
    font-size: 20px;
    font-weight: 700;
  }

  svg {
    width: 24px;
    height: 24px;
    color: var(--accent);
  }
`;

const PotentialScoreBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: linear-gradient(
    135deg,
    rgba(var(--primary-500-rgb), 0.1) 0%,
    rgba(var(--primary-500-rgb), 0.1) 100%
  );
  border: 1px solid var(--primary-500);
  border-radius: ${({ theme }) => theme.radius.md};
  padding: 16px 20px;
  margin-bottom: 24px;

  .label {
    font-size: 15px;
    color: var(--text-secondary);
  }

  .score {
    font-size: 32px;
    font-weight: 800;
    background: var(--accent);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
`;

const TipsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 20px;
`;

const TipItem = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 12px;
  background: var(--bg-alt);
  border: 1px solid var(--border-color);
  border-radius: ${({ theme }) => theme.radius.md};

  svg {
    width: 20px;
    height: 20px;
    flex-shrink: 0;
    margin-top: 2px;
    color: var(--success);
  }

  span {
    color: var(--text-color);
    font-size: 15px;
    line-height: 1.5;
  }
`;

const BlurredContent = styled.div`
  position: relative;
  filter: blur(5px);
  user-select: none;
  pointer-events: none;
  opacity: 0.5;
`;

const UnlockOverlay = styled.div`
  text-align: center;
  padding: 20px;
  background: linear-gradient(135deg, rgba(var(--primary-500-rgb), 0.05) 0%, rgba(var(--primary-500-rgb), 0.05) 100%);
  border: 1px dashed var(--primary-500);
  border-radius: ${({ theme }) => theme.radius.md};

  p {
    color: var(--text-secondary);
    margin-bottom: 8px;
    font-size: 14px;

    svg {
      width: 18px;
      height: 18px;
      flex-shrink: 0;
    }
  }

  strong {
    color: var(--accent);
    font-weight: 600;
  }
`;

const BetterJobsSection = styled.div`
  margin-top: 32px;
  background: var(--bg-color);
  border: 1px solid var(--border-color);
  border-radius: ${({ theme }) => theme.radius.lg};
  padding: 32px;

  @media (max-width: 768px) {
    padding: 20px;
  }
`;

const BetterJobCard = styled.div<{ $blurred?: boolean }>`
  background: var(--bg-alt);
  border: 1px solid var(--border-color);
  border-radius: ${({ theme }) => theme.radius.md};
  padding: 20px;
  margin-bottom: 16px;
  position: relative;
  ${({ $blurred }) => $blurred && `filter: blur(3px); opacity: 0.6;`}

  &:last-child {
    margin-bottom: 0;
  }
`;

const JobHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
  gap: 16px;
`;

const JobInfo = styled.div`
  flex: 1;

  h4 {
    font-size: 18px;
    font-weight: 700;
    margin-bottom: 6px;
    color: var(--text-color);
  }

  p {
    font-size: 14px;
    color: var(--text-secondary);
  }
`;

const MatchBadge = styled.div`
  background: var(--success);
  color: white;
  padding: 6px 12px;
  border-radius: 9999px;
  font-weight: 700;
  font-size: 14px;
  white-space: nowrap;

  svg {
    width: 16px;
    height: 16px;
    flex-shrink: 0;
  }
`;

const JobDescription = styled.p`
  font-size: 14px;
  color: var(--text-secondary);
  line-height: 1.6;
  margin-bottom: 12px;
`;

// ==================== PROBLEM-AGITATE SECTION ====================
const ProblemSection = styled(Section)`
  background: linear-gradient(
    135deg,
    rgba(255, 107, 107, 0.03) 0%,
    rgba(255, 179, 186, 0.03) 100%
  );
  border-top: 1px solid rgba(255, 107, 107, 0.1);
  border-bottom: 1px solid rgba(255, 107, 107, 0.1);
`;

const ProblemGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 24px;
  margin-bottom: 48px;

  @media (min-width: 768px) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

const ProblemCard = styled.div`
  background: var(--bg-alt);
  border: 1px solid rgba(255, 107, 107, 0.2);
  border-radius: ${({ theme }) => theme.radius.xl};
  padding: 32px;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;

  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, #FF6B6B 0%, #FFB3BA 100%);
  }

  &:hover {
    transform: translateY(-4px);
    box-shadow: ${({ theme }) => theme.shadow.lg};
    border-color: rgba(255, 107, 107, 0.4);
  }

  @media (max-width: 768px) {
    padding: 24px;
  }
`;

const ProblemIcon = styled.div`
  width: 56px;
  height: 56px;
  border-radius: ${({ theme }) => theme.radius.lg};
  background: linear-gradient(135deg, #FF6B6B 0%, #FFB3BA 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;

  svg {
    width: 28px;
    height: 28px;
    color: white;
  }
`;

const ProblemTitle = styled.h3`
  font-size: 20px;
  font-weight: 700;
  margin-bottom: 12px;
  color: var(--text-color);
`;

const ProblemDescription = styled.p`
  color: var(--text-secondary);
  line-height: 1.7;
  font-size: 15px;
  margin-bottom: 16px;
`;

const ProblemAgitation = styled.div`
  background: rgba(255, 107, 107, 0.1);
  border-left: 3px solid #FF6B6B;
  padding: 12px 16px;
  border-radius: ${({ theme }) => theme.radius.md};
  font-size: 14px;
  font-style: italic;
  color: var(--text-color);
`;

const TransitionBox = styled.div`
  background: linear-gradient(135deg, rgba(var(--primary-500-rgb), 0.1) 0%, rgba(var(--accent-rgb), 0.1) 100%);
  border: 2px solid var(--primary-500);
  border-radius: ${({ theme }) => theme.radius.xl};
  padding: 32px;
  text-align: center;
  margin-top: 48px;

  h3 {
    font-size: 28px;
    font-weight: 800;
    margin-bottom: 16px;
    background: linear-gradient(135deg, var(--landing) 0%, var(--accent) 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  p {
    font-size: 18px;
    color: var(--text-secondary);
    line-height: 1.6;
  }

  @media (max-width: 768px) {
    padding: 24px;

    h3 {
      font-size: 22px;
    }

    p {
      font-size: 16px;
    }
  }
`;

// ==================== TRANSFORMATION SECTION ====================
const TransformationSection = styled(Section)`
  background: linear-gradient(
    180deg,
    transparent 0%,
    rgba(var(--primary-500-rgb), 0.03) 50%,
    transparent 100%
  );
`;

const TransformationTimeline = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 48px;
  max-width: 900px;
  margin: 0 auto;
  position: relative;
`;

const TransformationStage = styled.div<{ $index: number }>`
  display: flex;
  flex-direction: column;
  gap: 24px;

  @media (min-width: 768px) {
    flex-direction: ${({ $index }) => ($index % 2 === 0 ? 'row' : 'row-reverse')};
    align-items: center;
  }
`;

const TransformationContent = styled.div`
  flex: 1;
  background: var(--bg-alt);
  border: 1px solid var(--border-color);
  border-radius: ${({ theme }) => theme.radius.xl};
  padding: 32px;
  transition: all 0.3s ease;

  &:hover {
    border-color: var(--primary-500);
    transform: translateY(-4px);
    box-shadow: ${({ theme }) => theme.shadow.lg};
  }

  @media (max-width: 768px) {
    padding: 24px;
  }
`;

const TransformationBadge = styled.div<{ $color: string }>`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: ${({ $color }) => $color};
  color: white;
  padding: 8px 16px;
  border-radius: 9999px;
  font-weight: 700;
  font-size: 14px;
  margin-bottom: 16px;

  svg {
    width: 18px;
    height: 18px;
  }
`;

const TransformationTitle = styled.h3`
  font-size: 24px;
  font-weight: 800;
  margin-bottom: 12px;
  color: var(--text-color);

  @media (max-width: 768px) {
    font-size: 20px;
  }
`;

const TransformationDescription = styled.p`
  color: var(--text-secondary);
  line-height: 1.7;
  font-size: 16px;
  margin-bottom: 16px;
`;

const TransformationMetrics = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  margin-top: 20px;
`;

const TransformationMetric = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  background: rgba(var(--success-rgb), 0.1);
  border: 1px solid var(--success);
  color: var(--success);
  padding: 8px 16px;
  border-radius: 9999px;
  font-weight: 600;
  font-size: 14px;

  svg {
    width: 18px;
    height: 18px;
  }
`;

const TransformationIcon = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--primary-500) 0%, var(--accent) 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  position: relative;
  box-shadow: 0 8px 24px rgba(var(--primary-500-rgb), 0.3);

  svg {
    width: 40px;
    height: 40px;
    color: white;
  }

  @media (min-width: 768px) {
    margin: 0 32px;
  }

  @media (max-width: 768px) {
    width: 64px;
    height: 64px;
    margin: 0 auto 16px;

    svg {
      width: 32px;
      height: 32px;
    }
  }
`;

// ==================== VALUE STACK (Enhanced Pricing) ====================
const ValueStackHeader = styled.div`
  background: linear-gradient(135deg, rgba(var(--accent-rgb), 0.05) 0%, rgba(var(--primary-500-rgb), 0.05) 100%);
  border: 1px solid var(--primary-500);
  border-radius: ${({ theme }) => theme.radius.xl};
  padding: 32px;
  margin-bottom: 48px;
  text-align: center;

  @media (max-width: 768px) {
    padding: 24px;
  }
`;

const ValueStackTitle = styled.h3`
  font-size: 24px;
  font-weight: 800;
  margin-bottom: 24px;
  color: var(--text-color);

  @media (max-width: 768px) {
    font-size: 20px;
  }
`;

const ValueStackList = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
  margin-bottom: 24px;
  text-align: left;

  @media (min-width: 640px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const ValueStackItem = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  background: var(--bg-alt);
  border: 1px solid var(--border-color);
  border-radius: ${({ theme }) => theme.radius.md};

  svg {
    width: 24px;
    height: 24px;
    color: var(--success);
    flex-shrink: 0;
  }
`;

const ValueStackItemText = styled.div`
  flex: 1;

  .feature-name {
    font-size: 15px;
    font-weight: 600;
    color: var(--text-color);
    margin-bottom: 4px;
  }

  .feature-value {
    font-size: 18px;
    font-weight: 800;
    color: var(--accent);
  }
`;

const ValueStackTotal = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 24px;
  background: linear-gradient(135deg, rgba(var(--accent-rgb), 0.1) 0%, rgba(var(--primary-500-rgb), 0.1) 100%);
  border: 2px solid var(--accent);
  border-radius: ${({ theme }) => theme.radius.lg};

  @media (min-width: 640px) {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
`;

const ValueStackTotalItem = styled.div<{ $emphasized?: boolean }>`
  display: flex;
  flex-direction: column;
  gap: 4px;

  .label {
    font-size: 14px;
    color: var(--text-secondary);
    text-transform: uppercase;
    letter-spacing: 1px;
    font-weight: 600;
  }

  .amount {
    font-size: ${({ $emphasized }) => ($emphasized ? '48px' : '32px')};
    font-weight: 900;
    color: ${({ $emphasized }) => ($emphasized ? 'var(--accent)' : 'var(--text-color)')};
    line-height: 1;

    ${({ $emphasized }) =>
      $emphasized &&
      `
      background: linear-gradient(135deg, var(--landing) 0%, var(--accent) 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    `}

    span {
      font-size: 24px;
      color: var(--text-secondary);
    }

    @media (max-width: 640px) {
      font-size: ${({ $emphasized }) => ($emphasized ? '40px' : '28px')};
    }
  }

  .savings {
    font-size: 16px;
    color: var(--success);
    font-weight: 700;
  }
`;

// ==================== SECONDARY CTA SECTION ====================
const SecondaryCTASection = styled(Section)`
  background: linear-gradient(
    135deg,
    rgba(var(--accent-rgb), 0.05) 0%,
    rgba(var(--primary-500-rgb), 0.05) 100%
  );
  border-top: 1px solid var(--primary-500);
  border-bottom: 1px solid var(--primary-500);
`;

const SecondaryCTACard = styled.div`
  background: var(--bg-alt);
  border: 2px solid var(--accent);
  border-radius: ${({ theme }) => theme.radius.xl};
  padding: 64px 48px;
  text-align: center;
  max-width: 800px;
  margin: 0 auto;
  box-shadow: 0 20px 60px rgba(var(--accent-rgb), 0.15);

  @media (max-width: 768px) {
    padding: 40px 24px;
  }
`;

const SecondaryCTAAvatarStack = styled(AvatarStack)`
  justify-content: center;
  margin-bottom: 24px;
`;

const SecondaryCTATitle = styled.h2`
  font-size: 36px;
  font-weight: 800;
  margin-bottom: 16px;
  color: var(--text-color);

  @media (max-width: 768px) {
    font-size: 28px;
  }
`;

const SecondaryCTASubtitle = styled.p`
  font-size: 18px;
  color: var(--text-secondary);
  margin-bottom: 32px;
  line-height: 1.6;

  @media (max-width: 768px) {
    font-size: 16px;
  }
`;

const SecondaryCTAButton = styled(PrimaryButton)`
  font-size: 20px;
  padding: 20px 48px;

  @media (max-width: 768px) {
    font-size: 18px;
    padding: 18px 36px;
    width: 100%;
  }
`;

const SecondaryCTAFeatures = styled.div`
  display: flex;
  justify-content: center;
  gap: 32px;
  margin-top: 32px;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    gap: 16px;
  }
`;

const SecondaryCTAFeature = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--text-secondary);
  font-size: 14px;

  svg {
    width: 18px;
    height: 18px;
    color: var(--success);
  }
`;

// ==================== SUCCESS SECTION (Conditional) ====================
const SuccessSection = styled.div`
  background: linear-gradient(135deg, rgba(var(--success-rgb), 0.1) 0%, rgba(var(--primary-500-rgb), 0.1) 100%);
  border: 2px solid var(--success);
  border-radius: ${({ theme }) => theme.radius.xl};
  padding: 40px;
  margin: 32px auto;
  max-width: 700px;
  text-align: center;
  animation: ${fadeIn} 0.6s ease-out;

  @media (max-width: 768px) {
    padding: 24px;
    margin: 24px 16px;
  }
`;

const SuccessIcon = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: var(--success);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 24px;
  animation: ${pulse} 2s infinite;

  svg {
    width: 48px;
    height: 48px;
    color: white;
  }
`;

const SuccessTitle = styled.h2`
  font-size: 32px;
  font-weight: 800;
  margin-bottom: 16px;
  color: var(--text-color);

  @media (max-width: 768px) {
    font-size: 24px;
  }
`;

const SuccessSubtitle = styled.p`
  font-size: 18px;
  color: var(--text-secondary);
  margin-bottom: 32px;
  line-height: 1.6;

  @media (max-width: 768px) {
    font-size: 16px;
  }
`;

const SuccessDeliverables = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  text-align: left;
  margin-bottom: 32px;
`;

const SuccessDeliverable = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  background: var(--bg-alt);
  border: 1px solid var(--border-color);
  border-radius: ${({ theme }) => theme.radius.md};
  padding: 16px;

  svg {
    width: 24px;
    height: 24px;
    color: var(--success);
    flex-shrink: 0;
  }

  span {
    font-size: 16px;
    color: var(--text-color);
    font-weight: 500;
  }
`;

// ==================== MAIN COMPONENT ====================
export default function Page() {
  const [step, setStep] = useState<"upload" | "loading" | "analyzing">(
    "upload"
  );
  const [detectedLocation, setDetectedLocation] = useState("");
  const [improvementTips, setImprovementTips] = useState<string[]>([]);
  const [potentialScore, setPotentialScore] = useState<number>(0);
  const [quickWins, setQuickWins] = useState<string[]>([]);
  const [betterJobs, setBetterJobs] = useState<any[]>([]);
  7;
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
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [isUploadingCV, setIsUploadingCV] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
        "Our AI analysis typically takes 15-30 seconds to complete. For complex resumes and longer job descriptions, it may take up to 1 minute, but never longer.",
    },
    {
      question: "How does pricing work?",
      answer:
        "We offer flexible options: Single ($2) for 1 analysis, Starter ($7) for 10 analyses at best value, or Pro ($12/month) for unlimited access. Credits never expire!",
    },
    {
      question: "What's included in every analysis?",
      answer:
        "Every Pro analysis includes detailed AI insights, all missing keywords, professional rewriting of 3 bullet points, ATS optimization guide, role recommendations, and AI-optimized resume generation.",
    },
    {
      question: "Can I cancel Pro anytime?",
      answer:
        "Yes! No commitment required. Cancel anytime and keep access until the end of your billing period. Your unused credits from packs never expire.",
    },
  ];

  const loadSample = () => {
    setCvText(
      "John Doe\nSoftware Engineer\n\nExperience:\n- 3 years of React development\n- Built 5 web applications\n- Team collaboration\n\nSkills: React, JavaScript, HTML, CSS"
    );
    setJobText(
      "Senior Frontend Developer\n\nRequirements:\n- 5+ years React experience\n- TypeScript expertise\n- Next.js knowledge\n- Testing experience (Jest, React Testing Library)\n- CI/CD pipelines\n- Team leadership"
    );
    setUploadedFileName(null);
  };

  const handleCVFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploadingCV(true);
    setUploadedFileName(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/demo/parse-cv", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to parse resume");
      }

      setCvText(data.text);
      setUploadedFileName(data.fileName);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Upload failed";
      alert(errorMessage);
    } finally {
      setIsUploadingCV(false);
      // Reset file input so user can upload the same file again
      event.target.value = "";
    }
  };

  const handleAnalyze = async () => {
    if (!cvText || !jobText) {
      alert("Please paste both resume and job description");
      return;
    }

    setStep("loading");
    setIsAnalyzing(true);

    try {
      // Step 1: Fetch location + jobs (background)
      const jobsPromise = fetch("/api/demo/fetch-jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cvText }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            setDetectedLocation(data.location);
            setDetectedJobTitle(data.detectedJobTitle);
            setFetchedJobs(data.jobs);
            return data.jobs;
          }
          return [];
        })
        .catch(() => []);

      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Step 2: Analyzing with REAL AI
      setStep("analyzing");

      const analysisResponse = await fetch("/api/demo/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cvText, jobText }),
      });

      const analysisData = await analysisResponse.json();

      if (!analysisResponse.ok) {
        throw new Error(analysisData.error || "Analysis failed");
      }

      // Set analysis results
      setResult({
        fitScore: analysisData.fitScore,
        summary: analysisData.summary,
        missingKeywords: analysisData.missingKeywords,
      });
      setImprovementTips(analysisData.improvementTips || []);
      setPotentialScore(analysisData.potentialScore || 0);
      setQuickWins(analysisData.quickWins || []);

      // Step 3: Get better jobs (if jobs were fetched)
      const jobs = await jobsPromise;
      if (jobs.length > 0) {
        const betterJobsResponse = await fetch("/api/demo/better-jobs", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ cvText, jobs }),
        });

        const betterJobsData = await betterJobsResponse.json();
        if (betterJobsData.success) {
          setBetterJobs(betterJobsData.jobs || []);
        }
      }

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
          {/* Light mode - Mint glow */}
          <BlurCircle
            $position="width: 320px; height: 320px; left: -128px; top: -128px;"
            $color="#006e81"
            $isDarkMode={false}
          />
          <BlurCircle
            $position="width: 384px; height: 384px; right: -140px; bottom: -140px;"
            $color="#006e81"
            $isDarkMode={false}
          />

          {/* Dark mode - Teal / Navy glow */}
          <BlurCircle
            $position="width: 400px; height: 600px; left: -160px; top: -160px;"
            $color="#118296ff"
            $isDarkMode={true}
          />
          <BlurCircle
            $position="width: 400px; height: 600px; right: -140px; bottom: -140px;"
            $color="#006e81"
            $isDarkMode={true}
          />
        </BackgroundBlur>

        <HeroContent>
          <TrustBadge>
            <CheckIcon />
            <span>OpenAI GPT-4 Powered • GDPR Compliant</span>
          </TrustBadge>

          <HeroTitle>
            Optimize Your Resume for <GradientText>Job Postings</GradientText>
          </HeroTitle>

          <HeroSubtitle>
            Use AI to <strong>identify missing skills</strong>, improve your
            resume, and get <strong>73% more interview invitations</strong>
          </HeroSubtitle>

          <ButtonGroup>
            <PrimaryButton href={ROUTES.AUTH.SIGNUP}>
              <RocketIcon />
              Analyze for Free
            </PrimaryButton>
            <SecondaryButton href={ROUTES.PUBLIC.HOW_IT_WORKS}>
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
              <img src="https://i.pravatar.cc/150?img=1" alt="Software Engineer who beat ATS systems with Rejectly AI resume optimizer" />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="https://i.pravatar.cc/150?img=2" alt="Product Manager who achieved career transformation using Rejectly ATS optimization" />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="https://i.pravatar.cc/150?img=3" alt="Data Scientist who landed dream job with Rejectly AI-powered resume analysis" />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="https://i.pravatar.cc/150?img=4" alt="UX Designer who improved interview success rate with Rejectly resume optimizer" />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="https://i.pravatar.cc/150?img=5" alt="Marketing Professional who got 5x more interviews using Rejectly ATS-friendly resumes" />
            </AvatarStack>
            <SocialProofText>
              <StarIcon />
              <strong>4.8/5</strong> (127 reviews)
            </SocialProofText>
          </SocialProof>
        </HeroContent>
      </HeroSection>

      <Divider />

      {/* PROBLEM-AGITATE SECTION */}
      <ProblemSection>
        <SectionHeader>
          <SectionTitle>Why Your Applications Keep Getting Rejected</SectionTitle>
          <SectionSubtitle>
            The brutal truth about modern job hunting that nobody tells you
          </SectionSubtitle>
        </SectionHeader>

        <ProblemGrid>
          <ProblemCard>
            <ProblemIcon>
              <XIcon />
            </ProblemIcon>
            <ProblemTitle>ATS Robots Kill Your Resume Before Human Eyes See It</ProblemTitle>
            <ProblemDescription>
              98% of Fortune 500 companies use Applicant Tracking Systems that automatically
              filter resumes. Your perfectly crafted CV gets rejected in 7.4 seconds by
              algorithms that can't parse your format or find the right keywords.
            </ProblemDescription>
            <ProblemAgitation>
              "You could be the perfect candidate, but if the ATS can't read your resume,
              you're invisible. It's like showing up to an interview in the wrong language."
            </ProblemAgitation>
          </ProblemCard>

          <ProblemCard>
            <ProblemIcon>
              <TargetIcon />
            </ProblemIcon>
            <ProblemTitle>You're Applying to Jobs You'll Never Get</ProblemTitle>
            <ProblemDescription>
              Without AI analysis, you can't see the 30-40% skills gap between your resume
              and the job posting. You waste hours applying to positions where you have zero
              chance, while missing roles you'd actually excel at.
            </ProblemDescription>
            <ProblemAgitation>
              "Sent 150 applications. Got 4 responses. The problem isn't you—it's your
              targeting. Every bad-fit application is time stolen from finding your dream job."
            </ProblemAgitation>
          </ProblemCard>

          <ProblemCard>
            <ProblemIcon>
              <RobotIcon />
            </ProblemIcon>
            <ProblemTitle>Your Resume Speaks Human, But Hiring is Done by Machines</ProblemTitle>
            <ProblemDescription>
              What impresses humans (creative formatting, personality, storytelling) confuses
              ATS systems. Your resume needs to be bilingual: machine-readable for ATS,
              compelling for humans. Most resumes fail at both.
            </ProblemDescription>
            <ProblemAgitation>
              "Your skills are real. Your experience is solid. But if your resume doesn't
              speak 'ATS language' with the exact keywords recruiters search for, you're
              screaming into a void."
            </ProblemAgitation>
          </ProblemCard>
        </ProblemGrid>

        <TransitionBox>
          <h3>If This Sounds Familiar, You're in the Right Place</h3>
          <p>
            Every day you wait is another day of wasted applications. Rejectly.pro uses
            GPT-4 to transform your resume from "auto-rejected" to "interview-ready" in
            30 seconds. Stop guessing. Start getting interviews.
          </p>
        </TransitionBox>
      </ProblemSection>

      <Divider />

      {/* DEMO SECTION - SIMPLIFIED */}
      <DemoSection id="demo">
        <SectionHeader>
          <SectionTitle style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
          
            Try It Now - Free
          </SectionTitle>
          <SectionSubtitle>
            Paste your resume and job description, get instant AI feedback
          </SectionSubtitle>
        </SectionHeader>

        <DemoCard>
          {step === "upload" && !result && (
            <>
              <DemoHeader>
                <DemoTitle>Quick Demo</DemoTitle>
                <DemoSubtitle>
                  Upload or paste your resume and job description, get instant
                  AI feedback
                </DemoSubtitle>
                <LoadSampleButton onClick={loadSample}>
                  <PencilIcon />
                  Load Sample Data
                </LoadSampleButton>
              </DemoHeader>

              <InputWrapper>
                <InputLabel>
                  <DocumentTextIcon />
                  Your Resume
                </InputLabel>
                {!uploadedFileName ? (
                  <UploadOrText>
                    <UploadBox>
                      <UploadIcon />
                      <div className="upload-text">
                        {isUploadingCV ? "Uploading..." : "Upload PDF/DOCX"}
                      </div>
                      <div className="upload-subtext">Click to browse files</div>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept=".pdf,.docx"
                        onChange={handleCVFileUpload}
                        disabled={isUploadingCV}
                      />
                    </UploadBox>

                    <OrDivider>
                      <span>or</span>
                    </OrDivider>

                    <TextBox>
                      
                      <DemoTextarea
                        placeholder="Paste your resume text here..."
                        value={cvText}
                        onChange={(e) => setCvText(e.target.value)}
                      />
                    </TextBox>
                  </UploadOrText>
                ) : (
                  <UploadedFileCard>
                    <FileHeader>
                      <FileIconWrapper>
                        <CheckIcon />
                      </FileIconWrapper>
                      <FileInfo>
                        <FileName>{uploadedFileName}</FileName>
                        <FileStats>
                          <FileStat>
                            <CheckIcon />
                            Successfully parsed
                          </FileStat>
                          <FileStat>
                            <DocumentTextIcon />
                            {cvText.length.toLocaleString()} characters
                          </FileStat>
                        </FileStats>
                      </FileInfo>
                    </FileHeader>
                    <FileActions>
                      <FileActionButton
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <RefreshIcon />
                        Change File
                      </FileActionButton>
                      <FileActionButton
                        $variant="danger"
                        onClick={() => {
                          setUploadedFileName(null);
                          setCvText("");
                        }}
                      >
                        <XIcon />
                        Remove & Use Text
                      </FileActionButton>
                    </FileActions>
                  </UploadedFileCard>
                )}
              </InputWrapper>

              <InputWrapper>
                <InputLabel>
                  <BriefcaseIcon />
                  Job Description
                </InputLabel>
                <DemoTextarea
                  placeholder="Paste the job description here..."
                  value={jobText}
                  onChange={(e) => setJobText(e.target.value)}
                />
              </InputWrapper>

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
              <BigSpinner />
              <h3 style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                <MagnifyingGlassIcon />
                Analyzing Your Resume...
              </h3>
              <LoadingSteps>
                <LoadingStep $completed>
                  <CheckIcon />
                  <span>Detected: {detectedJobTitle || "..."}</span>
                </LoadingStep>
                <LoadingStep $completed>
                  <CheckIcon />
                  <span>Location: {detectedLocation || "Detecting..."}</span>
                </LoadingStep>
                <LoadingStep $completed={false}>
                  <div className="loading-icon" />
                  <span>Finding matching jobs...</span>
                </LoadingStep>
              </LoadingSteps>
            </LoadingState>
          )}

          {/* STEP 3: ANALYZING */}
          {step === "analyzing" && (
            <LoadingState>
              <BigSpinner />
              <h3 style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                <RobotIcon />
                Analyzing Match...
              </h3>
              <LoadingSteps>
                <LoadingStep $completed>
                  <CheckIcon />
                  <span>Resume and job description loaded</span>
                </LoadingStep>
                <LoadingStep $completed={false}>
                  <div className="loading-icon" />
                  <span>Calculating match score...</span>
                </LoadingStep>
                <LoadingStep $completed={false}>
                  <div className="loading-icon" />
                  <span>Identifying missing skills...</span>
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

              {/* IMPROVEMENT SECTION */}
              {improvementTips.length > 0 && (
                <ImprovementSection>
                  <ImprovementHeader>
                    <LightBulbIcon />
                    <h3>How to Improve Your Score</h3>
                  </ImprovementHeader>

                  <PotentialScoreBox>
                    <div className="label">
                      Potential Score After Improvements:
                    </div>
                    <div className="score">{potentialScore}%</div>
                  </PotentialScoreBox>

                  <TipsList>
                    {quickWins.slice(0, 3).map((tip, idx) => (
                      <TipItem key={idx}>
                        <CheckIcon />
                        <span>{tip}</span>
                      </TipItem>
                    ))}
                  </TipsList>

                  <BlurredContent>
                    <TipsList>
                      {improvementTips.slice(3, 6).map((tip, idx) => (
                        <TipItem key={idx}>
                          <CheckIcon />
                          <span>{tip}</span>
                        </TipItem>
                      ))}
                    </TipsList>
                  </BlurredContent>

                  <UnlockOverlay>
                    <p style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                      <LockIcon />
                      <strong>
                        {improvementTips.length - 3} more improvement tips
                      </strong>
                      locked
                    </p>
                    <p>Upgrade to see all personalized recommendations</p>
                  </UnlockOverlay>
                </ImprovementSection>
              )}

              {/* BETTER JOBS SECTION */}
              {betterJobs.length > 0 && (
                <BetterJobsSection>
                  <ImprovementHeader>
                    <TargetIcon />
                    <h3>Better Matched Jobs for You</h3>
                  </ImprovementHeader>

                  <p
                    style={{
                      marginBottom: "20px",
                      color: "var(--text-secondary)",
                    }}
                  >
                    Based on your resume, these positions might be a better fit
                  </p>

                  {betterJobs.slice(0, 2).map((job, idx) => (
                    <BetterJobCard key={idx}>
                      <JobHeader>
                        <JobInfo>
                          <h4>{job.title}</h4>
                          <p>
                            {job.company} • {job.location}
                          </p>
                        </JobInfo>
                        <MatchBadge style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <StarIcon />
                          {job.matchScore}% Match
                        </MatchBadge>
                      </JobHeader>
                      <JobDescription>{job.description}</JobDescription>
                    </BetterJobCard>
                  ))}

                  {betterJobs.length > 2 && (
                    <>
                      <BetterJobCard $blurred>
                        <JobHeader>
                          <JobInfo>
                            <h4>{betterJobs[2].title}</h4>
                            <p>
                              {betterJobs[2].company} • {betterJobs[2].location}
                            </p>
                          </JobInfo>
                          <MatchBadge style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <StarIcon />
                            {betterJobs[2].matchScore}% Match
                          </MatchBadge>
                        </JobHeader>
                        <JobDescription>
                          {betterJobs[2].description}
                        </JobDescription>
                      </BetterJobCard>

                      <UnlockOverlay>
                        <p style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                          <LockIcon />
                          <strong>More perfectly matched jobs</strong>
                          waiting for you
                        </p>
                        <p>
                          Upgrade to see all recommendations with detailed match
                          analysis
                        </p>
                      </UnlockOverlay>
                    </>
                  )}
                </BetterJobsSection>
              )}

              <CTASection>
                <h3 style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                  <TargetIcon />
                  Want the Full Analysis?
                </h3>
                <p>
                  Sign up for free, save your report, and perfect your resume
                  with Pro features!
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
          <SectionTitle>AI-Powered Career Tools</SectionTitle>
          <SectionSubtitle>
            Everything you need to land your dream job
          </SectionSubtitle>
        </SectionHeader>

        <FeatureGrid>
          <FeatureCard>
            <FeatureIcon $gradient="linear-gradient(135deg, #FFB3BA 0%, #FFCCE5 100%)">
              <DocumentCheckIcon />
            </FeatureIcon>
            <FeatureTitle>Resume Analysis & Improvement</FeatureTitle>
            <FeatureDescription>
              Get instant AI-powered feedback on your resume. Identify missing skills,
              improve formatting, and optimize content for ATS systems in seconds.
            </FeatureDescription>
            <FeatureHighlight>
              <strong>30 seconds</strong> analysis time
            </FeatureHighlight>
          </FeatureCard>

          <FeatureCard>
            <FeatureIcon $gradient="linear-gradient(135deg, #B4E7F5 0%, #C7E9FB 100%)">
              <BriefcaseSearchIcon />
            </FeatureIcon>
            <FeatureTitle>Personalized Job Recommendations</FeatureTitle>
            <FeatureDescription>
              Discover job opportunities tailored to your resume. Our AI matches
              your skills and experience with the best positions for you.
            </FeatureDescription>
            <FeatureHighlight>
              <strong>Smart matching</strong> algorithm
            </FeatureHighlight>
          </FeatureCard>

          <FeatureCard>
            <FeatureIcon $gradient="linear-gradient(135deg, #BFACE2 0%, #D4C5F9 100%)">
              <PencilIcon />
            </FeatureIcon>
            <FeatureTitle>AI Cover Letter Generator</FeatureTitle>
            <FeatureDescription>
              Create compelling, customized cover letters in minutes. Our AI
              crafts professional letters tailored to each job application.
            </FeatureDescription>
            <FeatureHighlight>
              <strong>Personalized</strong> for each role
            </FeatureHighlight>
          </FeatureCard>

          <FeatureCard>
            <FeatureIcon $gradient="linear-gradient(135deg, #B9E8D8 0%, #D0F0E4 100%)">
              <DocumentDuplicateIcon />
            </FeatureIcon>
            <FeatureTitle>AI-Optimized Resume Creation</FeatureTitle>
            <FeatureDescription>
              Generate a professionally optimized resume with AI. Get ATS-friendly
              formatting, keyword optimization, and compelling bullet points.
            </FeatureDescription>
            <FeatureHighlight>
              <strong>85% more</strong> ATS pass rate
            </FeatureHighlight>
          </FeatureCard>
        </FeatureGrid>
      </Section>

      <Divider />

      {/* TRANSFORMATION SECTION */}
      <TransformationSection>
        <SectionHeader>
          <SectionTitle>Your Career Transformation Journey</SectionTitle>
          <SectionSubtitle>
            From "auto-rejected" to "dream job offer" in 4 proven stages
          </SectionSubtitle>
        </SectionHeader>

        <TransformationTimeline>
          {/* Stage 1: Quick Win */}
          <TransformationStage $index={0}>
            <TransformationContent>
              <TransformationBadge $color="#10B981">
                <ZapIcon />
                Day 1 - Quick Win
              </TransformationBadge>
              <TransformationTitle>Your First Optimized Resume Goes Live</TransformationTitle>
              <TransformationDescription>
                Get instant AI analysis revealing exactly why your resume was failing. Within
                15 minutes, you'll have an ATS-optimized version with the right keywords,
                format, and compelling bullet points that actually get read.
              </TransformationDescription>
              <TransformationMetrics>
                <TransformationMetric>
                  <CheckIcon />
                  +85% ATS pass rate
                </TransformationMetric>
                <TransformationMetric>
                  <CheckIcon />
                  Ready in 15 minutes
                </TransformationMetric>
                <TransformationMetric>
                  <CheckIcon />
                  15+ keyword gaps fixed
                </TransformationMetric>
              </TransformationMetrics>
            </TransformationContent>
            <TransformationIcon>
              <ZapIcon />
            </TransformationIcon>
          </TransformationStage>

          {/* Stage 2: Compound */}
          <TransformationStage $index={1}>
            <TransformationContent>
              <TransformationBadge $color="#F59E0B">
                <RefreshIcon />
                Week 1 - Compound Effect
              </TransformationBadge>
              <TransformationTitle>3x More Interview Invitations Start Rolling In</TransformationTitle>
              <TransformationDescription>
                Your optimized resume cuts through the ATS noise. Recruiters actually read it
                and reach out. Every application now targets roles where you have 70%+ skill
                match, tripling your response rate from 2% to 7-10%.
              </TransformationDescription>
              <TransformationMetrics>
                <TransformationMetric>
                  <CheckIcon />
                  5-8 interview requests
                </TransformationMetric>
                <TransformationMetric>
                  <CheckIcon />
                  +300% response rate
                </TransformationMetric>
                <TransformationMetric>
                  <CheckIcon />
                  Better-fit positions
                </TransformationMetric>
              </TransformationMetrics>
            </TransformationContent>
            <TransformationIcon>
              <RefreshIcon />
            </TransformationIcon>
          </TransformationStage>

          {/* Stage 3: Advantage */}
          <TransformationStage $index={2}>
            <TransformationContent>
              <TransformationBadge $color="#8B5CF6">
                <BriefcaseIcon />
                Month 1 - Competitive Advantage
              </TransformationBadge>
              <TransformationTitle>Multiple Offers, Better Leverage</TransformationTitle>
              <TransformationDescription>
                Because you're targeting the right roles, your interviews convert at higher
                rates. You get 2-3 competing offers, giving you negotiation power. One of
                them is your dream company—and they want you.
              </TransformationDescription>
              <TransformationMetrics>
                <TransformationMetric>
                  <CheckIcon />
                  2-3 job offers
                </TransformationMetric>
                <TransformationMetric>
                  <CheckIcon />
                  15-25% salary boost
                </TransformationMetric>
                <TransformationMetric>
                  <CheckIcon />
                  Dream company YES
                </TransformationMetric>
              </TransformationMetrics>
            </TransformationContent>
            <TransformationIcon>
              <BriefcaseIcon />
            </TransformationIcon>
          </TransformationStage>

          {/* Stage 4: 10x */}
          <TransformationStage $index={3}>
            <TransformationContent>
              <TransformationBadge $color="#EF4444">
                <SparklesIcon />
                Year 1 - 10x Career Momentum
              </TransformationBadge>
              <TransformationTitle>Your Career Trajectory Changes Forever</TransformationTitle>
              <TransformationDescription>
                You're thriving at your new job. The confidence from landing it carries over
                into faster promotions. You know how to position yourself for any opportunity.
                Your network grows. Your earning power compounds year over year.
              </TransformationDescription>
              <TransformationMetrics>
                <TransformationMetric>
                  <CheckIcon />
                  +40-60% total comp
                </TransformationMetric>
                <TransformationMetric>
                  <CheckIcon />
                  Promotion-ready profile
                </TransformationMetric>
                <TransformationMetric>
                  <CheckIcon />
                  Career confidence
                </TransformationMetric>
                <TransformationMetric>
                  <CheckIcon />
                  Industry reputation
                </TransformationMetric>
              </TransformationMetrics>
            </TransformationContent>
            <TransformationIcon>
              <SparklesIcon />
            </TransformationIcon>
          </TransformationStage>
        </TransformationTimeline>
      </TransformationSection>

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
              <img src="https://i.pravatar.cc/150?img=12" alt="Sarah Chen - Frontend Developer who got 5 interviews in 2 weeks with Rejectly AI resume optimization" />
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
              Rejectly.pro, I optimized my resume and got 5 interview
              invitations in 2 weeks! The AI insights were spot-on about what I
              was missing.
            </TestimonialText>
            <TestimonialHighlight>
              <CheckIcon />5 interviews in 2 weeks
            </TestimonialHighlight>
          </TestimonialCard>

          <TestimonialCard>
            <TestimonialHeader>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://i.pravatar.cc/150?img=33"
                alt="Marcus Johnson - Product Manager who achieved 85% ATS pass rate improvement with Rejectly resume optimizer"
              />
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
              The ATS optimization feature is a game-changer. My resume was
              being rejected by automated systems before I even got to human
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
              <img
                src="https://i.pravatar.cc/150?img=47"
                alt="Emily Rodriguez - Data Analyst success story using Rejectly AI-powered resume analysis and ATS optimization"
              />
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
              The professional rewriting suggestions helped me transform my
              resume from generic to compelling. I learned how to speak the
              language HR managers want to see. Landed my dream job within a
              month!
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

        {/* VALUE STACK */}
        <ValueStackHeader>
          <ValueStackTitle>Everything You Get in Each Analysis</ValueStackTitle>
          <ValueStackList>
            <ValueStackItem>
              <CheckIcon />
              <ValueStackItemText>
                <div className="feature-name">Professional Resume Writer</div>
                <div className="feature-value">$75 per resume</div>
              </ValueStackItemText>
            </ValueStackItem>
            <ValueStackItem>
              <CheckIcon />
              <ValueStackItemText>
                <div className="feature-name">Career Coach Consultation</div>
                <div className="feature-value">$120/hour</div>
              </ValueStackItemText>
            </ValueStackItem>
            <ValueStackItem>
              <CheckIcon />
              <ValueStackItemText>
                <div className="feature-name">ATS Optimization Service</div>
                <div className="feature-value">$45 per resume</div>
              </ValueStackItemText>
            </ValueStackItem>
            <ValueStackItem>
              <CheckIcon />
              <ValueStackItemText>
                <div className="feature-name">Custom Cover Letter</div>
                <div className="feature-value">$35 per letter</div>
              </ValueStackItemText>
            </ValueStackItem>
          </ValueStackList>
          <ValueStackTotal>
            <ValueStackTotalItem>
              <div className="label">If You Hired Humans</div>
              <div className="amount">$275<span>+</span></div>
            </ValueStackTotalItem>
            <ValueStackTotalItem $emphasized>
              <div className="label">With Rejectly.pro</div>
              <div className="amount">$2</div>
              <div className="savings">Save 99% • AI does it in 30 seconds</div>
            </ValueStackTotalItem>
          </ValueStackTotal>
        </ValueStackHeader>

        <PricingGrid>
          {/* Single Plan */}
          <PricingCard>
            <PricingTitle>Single</PricingTitle>
            <PricingPrice>
              $2<span> one-time</span>
            </PricingPrice>
            <PricingFeatures>
              <PricingFeature $enabled>
                <CheckIcon />
                <span>1 Pro analysis</span>
              </PricingFeature>
              <PricingFeature $enabled>
                <CheckIcon />
                <span>Detailed AI insights</span>
              </PricingFeature>
              <PricingFeature $enabled>
                <CheckIcon />
                <span>All missing keywords</span>
              </PricingFeature>
              <PricingFeature $enabled>
                <CheckIcon />
                <span>3 bullet points rewritten</span>
              </PricingFeature>
              <PricingFeature $enabled>
                <CheckIcon />
                <span>ATS optimization guide</span>
              </PricingFeature>
              <PricingFeature $enabled>
                <CheckIcon />
                <span>AI-optimized resume</span>
              </PricingFeature>
            </PricingFeatures>
            <PricingButton $variant="secondary">Buy Single</PricingButton>
          </PricingCard>

          {/* Starter Plan */}
          <PricingCard $featured>
            <PricingBadge>BEST VALUE</PricingBadge>
            <PricingTitle>Starter</PricingTitle>
            <PricingPrice>
              $7<span> one-time</span>
            </PricingPrice>
            <PricingSubtext>$0.70 per report - save 65%</PricingSubtext>
            <PricingFeatures>
              <PricingFeature $enabled>
                <CheckIcon />
                <span>10 Pro analyses</span>
              </PricingFeature>
              <PricingFeature $enabled>
                <CheckIcon />
                <span>Detailed AI insights</span>
              </PricingFeature>
              <PricingFeature $enabled>
                <CheckIcon />
                <span>All missing keywords</span>
              </PricingFeature>
              <PricingFeature $enabled>
                <CheckIcon />
                <span>3 bullet points rewritten</span>
              </PricingFeature>
              <PricingFeature $enabled>
                <CheckIcon />
                <span>ATS optimization guide</span>
              </PricingFeature>
              <PricingFeature $enabled>
                <CheckIcon />
                <span>AI-optimized resume</span>
              </PricingFeature>
            </PricingFeatures>
            <PricingButton $variant="primary">Buy Starter</PricingButton>
          </PricingCard>

          {/* Pro Plan */}
          <PricingCard>
            <PricingTitle>Pro</PricingTitle>
            <PricingPrice>
              $12<span>/month</span>
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
                <span>All missing keywords</span>
              </PricingFeature>
              <PricingFeature $enabled>
                <CheckIcon />
                <span>3 bullet points rewritten</span>
              </PricingFeature>
              <PricingFeature $enabled>
                <CheckIcon />
                <span>ATS optimization guide</span>
              </PricingFeature>
              <PricingFeature $enabled>
                <CheckIcon />
                <span>Priority support</span>
              </PricingFeature>
            </PricingFeatures>
            <PricingButton $variant="secondary">Subscribe</PricingButton>
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
                <FAQQuestionText>{faq.question}</FAQQuestionText>
                <FAQQuestionIcon $isOpen={openFaq === index}>
                  {openFaq === index ? "−" : "+"}
                </FAQQuestionIcon>
              </FAQQuestion>
              <FAQAnswer $isOpen={openFaq === index}>
                <FAQAnswerText>{faq.answer}</FAQAnswerText>
              </FAQAnswer>
            </FAQItem>
          ))}
        </FAQList>

        <FAQButtonContainer>
          <FAQButton href={ROUTES.PUBLIC.FAQ}>
            View All FAQs
            <ArrowRightIcon />
          </FAQButton>
        </FAQButtonContainer>
      </Section>

      <Divider />

      {/* SECONDARY CTA SECTION */}
      <SecondaryCTASection>
        <SecondaryCTACard>
          <SecondaryCTAAvatarStack>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="https://i.pravatar.cc/150?img=1" alt="Professional who achieved interview success with Rejectly AI resume optimizer and ATS optimization" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="https://i.pravatar.cc/150?img=2" alt="Job seeker who transformed career using Rejectly ATS-friendly resume builder" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="https://i.pravatar.cc/150?img=3" alt="Tech professional who landed interviews at top companies with Rejectly resume analysis" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="https://i.pravatar.cc/150?img=4" alt="Career changer who beat applicant tracking systems using Rejectly AI optimization" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="https://i.pravatar.cc/150?img=5" alt="Success story from 500+ professionals who transformed job search with Rejectly AI resume optimizer" />
          </SecondaryCTAAvatarStack>

          <SecondaryCTATitle>
            Still Deciding? Every Day You Wait is Another Day of Rejections.
          </SecondaryCTATitle>

          <SecondaryCTASubtitle>
            Join 500+ professionals who transformed their job search with Rejectly.pro.
            Stop wasting hours on applications that go nowhere. Start getting interviews
            within 7 days—or your money back.
          </SecondaryCTASubtitle>

          <SecondaryCTAButton href={ROUTES.AUTH.SIGNUP}>
            <RocketIcon />
            Yes, I Want to Fix My Resume Now
          </SecondaryCTAButton>

          <SecondaryCTAFeatures>
            <SecondaryCTAFeature>
              <CheckIcon />
              No credit card required
            </SecondaryCTAFeature>
            <SecondaryCTAFeature>
              <CheckIcon />
              Results in 30 seconds
            </SecondaryCTAFeature>
            <SecondaryCTAFeature>
              <CheckIcon />
              Cancel anytime, no questions
            </SecondaryCTAFeature>
          </SecondaryCTAFeatures>
        </SecondaryCTACard>
      </SecondaryCTASection>

      <Divider />

      <Footer />
    </Container>
  );
}
