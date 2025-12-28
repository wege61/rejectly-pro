"use client";

import styled, { keyframes } from "styled-components";
import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { ROUTES } from "@/lib/constants";
import { Footer } from "@/components/ui/Footer";
import { SecondaryCTA } from "@/components/marketing/SecondaryCTA";
import { HeroHighlight, Highlight } from "@/components/ui/HeroHighlight";
import { ProblemBentoGrid } from "@/components/marketing/ProblemBentoGrid";
import { LampContainer } from "@/components/ui/LampContainer";
import {
  DemoCard as NewDemoCard,
  DemoCardHeader,
  DemoCardTitle,
  DemoCardDescription,
  DemoCardContent,
} from "@/components/ui/DemoCard";
import { FileUpload } from "@/components/ui/FileUpload";
import { DemoTextarea as NewDemoTextarea } from "@/components/ui/DemoTextarea";
import { Carousel, AppleCard, Card } from "@/components/ui/AppleCarousel";
import { b } from "framer-motion/client";

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
  <svg fill="none" stroke="var(--primary-500)" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M5 13l4 4L19 7"
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
  overflow-x: clip;
`;

// ==================== HERO SECTION ====================
const HeroSection = styled.section`
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background-color: var(--bg-color);

  @media (max-width: 768px) {
    min-height: auto;
  }
`;

const HeroHighlightWrapper = styled(HeroHighlight)`
  min-height: 100vh;
  padding: 80px 24px 60px;

  @media (max-width: 768px) {
    min-height: auto;
    padding: 60px 16px 40px;
  }
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
`;

const AvatarWrapper = styled.div<{ $isFirst?: boolean }>`
  width: 44px;
  height: 44px;
  border-radius: 50%;
  border: 3px solid var(--bg-color);
  margin-left: ${({ $isFirst }) => ($isFirst ? "0" : "-12px")};
  transition: transform 0.2s ease;
  overflow: hidden;
  position: relative;
  flex-shrink: 0;

  &:hover {
    transform: scale(1.1);
    z-index: 10;
  }

  @media (max-width: 640px) {
    width: 40px;
    height: 40px;
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
const DemoSectionWrapper = styled.div`
  /* Full viewport width */
  width: 100vw;
  position: relative;
  left: 50%;
  right: 50%;
  margin-left: -50vw;
  margin-right: -50vw;
  overflow: hidden;
`;

const DemoSection = styled.section`
  max-width: 900px;
  margin: 0 auto;
  padding: 0 24px 80px;
  position: relative;
  z-index: 10;

  @media (max-width: 768px) {
    padding: 0 16px 60px;
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

// New Demo Components
const DemoTitleRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 24px;
  font-weight: 700;

  svg {
    width: 24px;
    height: 24px;
    color: var(--accent);
  }
`;

const DemoInputsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 32px;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
    gap: 24px;
  }
`;

const DemoInputSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const DemoInputContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const DemoOrDivider = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  color: var(--text-secondary);
  font-size: 13px;
  font-weight: 500;

  &::before,
  &::after {
    content: '';
    flex: 1;
    height: 1px;
    background: var(--border-color);
  }

  span {
    text-transform: uppercase;
    letter-spacing: 0.5px;
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
  justify-content: center;
  gap: 8px;
  background: transparent;
  border: 1px solid var(--border-color);
  color: var(--text-color);
  padding: 16px 32px;
  font-weight: 600;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.2s ease;
  border-radius: ${({ theme }) => theme.radius.lg};
  min-width: 180px;

  svg {
    width: 20px;
    height: 20px;
  }

  &:hover {
    border-color: var(--accent);
    color: var(--accent);
    background: rgba(var(--primary-500-rgb), 0.05);
  }
`;

const ButtonsRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 24px;

  @media (max-width: 480px) {
    flex-direction: column;

    button {
      width: 100%;
    }
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
  min-width: 180px;

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
  gap: 20px;

  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const FeatureCard = styled.div`
  padding: 40px;
  text-align: center;
  background: var(--bg-alt);
  border-radius: ${({ theme }) => theme.radius.xl};

  @media (max-width: 767px) {
    padding: 32px 24px;
  }
`;

const FeatureIcon = styled.div`
  width: 56px;
  height: 56px;
  border-radius: 16px;
  background: var(--primary-500);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 20px;

  svg {
    width: 28px;
    height: 28px;
    color: white;
  }
`;

const FeatureTitle = styled.h3`
  font-size: 20px;
  font-weight: 700;
  margin-bottom: 12px;
  color: var(--text-color);
`;

const FeatureDescription = styled.p`
  color: var(--text-secondary);
  line-height: 1.6;
  font-size: 15px;
`;

const FeatureHighlight = styled.span`
  display: inline-block;
  margin-top: 16px;
  font-size: 13px;
  font-weight: 600;
  color: var(--primary-500);
  background: rgba(var(--primary-500-rgb), 0.1);
  padding: 6px 12px;
  border-radius: 100px;
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
  border-radius: ${({ theme }) => theme.radius.xl};
  padding: 32px;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  gap: 20px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  outline: 1px solid rgba(0, 0, 0, 0.05);

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
  flex-wrap: wrap;
`;

const TestimonialAvatar = styled.div`
  width: 56px;
  height: 56px;
  border-radius: 50%;
  border: 2px solid var(--border-color);
  overflow: hidden;
  position: relative;
  flex-shrink: 0;
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
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.3s ease;

  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  outline: 1px solid rgba(0, 0, 0, 0.05);

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
  background: var(--bg-color);
`;

const ProblemGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
  margin-bottom: 48px;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
    gap: 20px;
  }
`;

const ProblemCard = styled.div`
  background: var(--bg-alt);
  border-radius: ${({ theme }) => theme.radius.xl};
  padding: 32px;
  position: relative;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: inherit;
    padding: 1px;
    background: linear-gradient(
      180deg,
      rgba(255, 107, 107, 0.3) 0%,
      rgba(255, 107, 107, 0.05) 100%
    );
    -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
    pointer-events: none;
  }

  &:hover {
    transform: translateY(-6px);

    &::before {
      background: linear-gradient(
        180deg,
        rgba(255, 107, 107, 0.5) 0%,
        rgba(255, 107, 107, 0.15) 100%
      );
    }

    .problem-icon {
      transform: scale(1.1);
      box-shadow: 0 0 24px rgba(255, 107, 107, 0.4);
    }
  }

  @media (max-width: 768px) {
    padding: 24px;
  }
`;

const ProblemIcon = styled.div`
  width: 56px;
  height: 56px;
  border-radius: 16px;
  background: var(--landing-button);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 24px;
  transition: all 0.3s ease;

  svg {
    width: 28px;
    height: 28px;
    color: white;
  }
`;

const ProblemTitle = styled.h3`
  font-size: 18px;
  font-weight: 700;
  color: var(--text-color);
  line-height: 1.4;
  margin-bottom: 12px;
  min-height: 50px;

  @media (max-width: 768px) {
    min-height: auto;
  }
`;

const ProblemDescription = styled.p`
  color: var(--text-secondary);
  line-height: 1.7;
  font-size: 15px;
  flex: 1;
`;

const ProblemQuote = styled.div`
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px dashed rgba(255, 107, 107, 0.3);

  p {
    font-size: 14px;
    font-style: italic;
    color: var(--text-muted);
    line-height: 1.6;
    margin: 0;

    &::before {
      content: '— ';
      color: #FF6B6B;
    }
  }
`;

const TransitionBox = styled.div`
  text-align: center;
  margin-top: 64px;
  padding-top: 48px;
  border-top: 1px solid var(--border-color);

  h3 {
    font-size: 36px;
    font-weight: 700;
    margin-bottom: 20px;
    color: var(--landing);
    letter-spacing: -0.02em;
  }

  p {
    font-size: 20px;
    color: var(--text-secondary);
    line-height: 1.6;
    max-width: 540px;
    margin: 0 auto;
  }

  @media (max-width: 768px) {
    margin-top: 48px;
    padding-top: 32px;

    h3 {
      font-size: 26px;
    }

    p {
      font-size: 17px;
    }
  }
`;

// ==================== TIMELINE SECTION ====================
const TimelineSection = styled.section`
  background: var(--bg-color);
  padding: 80px 0;
  width: 100%;

  @media (max-width: 768px) {
    padding: 60px 0;
  }
`;

const TimelineHighlight = styled.span`
  color: var(--text-color);
  font-weight: 600;
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


// ==================== TIMELINE COMPONENT ====================
interface TimelineEntryData {
  period: string;
  headline: string;
  text: React.ReactNode;
  metadata: string;
}

function Timeline({ data }: { data: TimelineEntryData[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (ref.current) {
      const rect = ref.current.getBoundingClientRect();
      setHeight(rect.height);
    }
  }, [ref]);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 10%", "end 50%"],
  });

  const heightTransform = useTransform(scrollYProgress, [0, 1], [0, height]);
  const opacityTransform = useTransform(scrollYProgress, [0, 0.1], [0, 1]);

  return (
    <div
      ref={containerRef}
      style={{
        width: "100%",
        background: "var(--bg-color)",
        padding: "0 40px",
      }}
    >
      <div
        ref={ref}
        style={{
          position: "relative",
          maxWidth: "1280px",
          margin: "0 auto",
          paddingBottom: "80px",
        }}
      >
        {data.map((item, index) => (
          <div
            key={index}
            style={{
              display: "flex",
              justifyContent: "flex-start",
              paddingTop: index === 0 ? "40px" : "160px",
              gap: "40px",
            }}
          >
            {/* Sticky left column */}
            <div
              style={{
                position: "sticky",
                display: "flex",
                flexDirection: "row",
                zIndex: 40,
                alignItems: "center",
                top: "160px",
                alignSelf: "flex-start",
                width: "100%",
                maxWidth: "384px",
              }}
            >
              {/* Dot */}
              <div
                style={{
                  height: "40px",
                  width: "40px",
                  position: "absolute",
                  left: "12px",
                  borderRadius: "9999px",
                  background: "var(--bg-color)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <div
                  style={{
                    height: "16px",
                    width: "16px",
                    borderRadius: "9999px",
                    background: "var(--bg-alt)",
                    border: "1px solid var(--border-color)",
                  }}
                />
              </div>
              {/* Period text */}
              <h3
                style={{
                  display: "block",
                  paddingLeft: "80px",
                  fontSize: "48px",
                  fontWeight: 700,
                  color: "var(--text-muted)",
                }}
              >
                {item.period}
              </h3>
            </div>

            {/* Content column */}
            <div
              style={{
                position: "relative",
                paddingLeft: "16px",
                width: "100%",
              }}
            >
              <h4
                style={{
                  fontSize: "32px",
                  fontWeight: 700,
                  color: "var(--text-color)",
                  lineHeight: 1.4,
                  marginBottom: "20px",
                }}
              >
                {item.headline}
              </h4>
              <p
                style={{
                  fontSize: "18px",
                  color: "var(--text-secondary)",
                  lineHeight: 1.8,
                  marginBottom: "28px",
                  maxWidth: "480px",
                }}
              >
                {item.text}
              </p>
              <p
                style={{
                  fontSize: "13px",
                  color: "var(--text-muted)",
                  marginTop: "16px",
                  lineHeight: 1.5,
                  fontStyle: "italic",
                }}
              >
                {item.metadata}
              </p>
            </div>
          </div>
        ))}

        {/* Vertical line */}
        <div
          style={{
            height: height + "px",
            position: "absolute",
            left: "32px",
            top: 0,
            overflow: "hidden",
            width: "2px",
            background: "linear-gradient(to bottom, transparent 0%, var(--border-color) 10%, var(--border-color) 90%, transparent 99%)",
            maskImage: "linear-gradient(to bottom, transparent 0%, black 10%, black 90%, transparent 100%)",
            WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, black 10%, black 90%, transparent 100%)",
          }}
        >
          <motion.div
            style={{
              height: heightTransform,
              opacity: opacityTransform,
              position: "absolute",
              left: 0,
              right: 0,
              top: 0,
              width: "2px",
              background: "linear-gradient(to top, var(--landing-button) 0%, rgba(255, 107, 107, 0.5) 10%, transparent 100%)",
              borderRadius: "9999px",
            }}
          />
        </div>
      </div>
    </div>
  );
}

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
  const [hasUploadedFile, setHasUploadedFile] = useState(false);
  const [isUploadingCV, setIsUploadingCV] = useState(false);

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

  const featureCards: Card[] = [
    {
      src: "https://images.unsplash.com/photo-1586281380349-632531db7ed4?q=80&w=800&auto=format&fit=crop",
      title: "AI Resume Analysis",
      category: "Smart Insights",
      content: (
        <div>
          <p>See exactly what&apos;s wrong with your resume. Our AI analyzes your resume against the job description and reveals:</p>
          <ul style={{ marginTop: '16px', paddingLeft: '20px' }}>
            <li>Missing keywords that ATS systems are looking for</li>
            <li>Formatting issues that hurt readability</li>
            <li>Weak action verbs and how to strengthen them</li>
            <li>Quantifiable achievements you should highlight</li>
          </ul>
          <p style={{ marginTop: '16px' }}>Get instant, actionable feedback in seconds—not hours.</p>
        </div>
      ),
    },
    {
      src: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=800&auto=format&fit=crop",
      title: "Smart Job Matching",
      category: "Find Your Fit",
      content: (
        <div>
          <p>Stop applying blindly. Our AI finds jobs where your skills actually match what employers are looking for.</p>
          <ul style={{ marginTop: '16px', paddingLeft: '20px' }}>
            <li>Match score for every job posting</li>
            <li>Skills gap analysis and recommendations</li>
            <li>Salary insights based on your experience</li>
            <li>Company culture compatibility indicators</li>
          </ul>
          <p style={{ marginTop: '16px' }}>Apply smarter, not harder. Focus on roles where you&apos;ll succeed.</p>
        </div>
      ),
    },
    {
      src: "https://images.unsplash.com/photo-1455390582262-044cdead277a?q=80&w=800&auto=format&fit=crop",
      title: "Cover Letter Generator",
      category: "One Click",
      content: (
        <div>
          <p>One click. Personalized letter. Tailored to the job description and your unique experience.</p>
          <ul style={{ marginTop: '16px', paddingLeft: '20px' }}>
            <li>Professionally written in seconds</li>
            <li>Matches the job requirements perfectly</li>
            <li>Highlights your most relevant achievements</li>
            <li>Multiple tone options (formal, creative, casual)</li>
          </ul>
          <p style={{ marginTop: '16px' }}>Never stare at a blank page again.</p>
        </div>
      ),
    },
    {
      src: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=800&auto=format&fit=crop",
      title: "ATS-Optimized Resume Builder",
      category: "Built to Pass",
      content: (
        <div>
          <p>Start fresh with an ATS-optimized resume. Clean formatting, right keywords, professional structure.</p>
          <ul style={{ marginTop: '16px', paddingLeft: '20px' }}>
            <li>Templates designed for ATS systems</li>
            <li>Automatic keyword optimization</li>
            <li>Professional formatting that works everywhere</li>
            <li>Export to PDF, Word, or plain text</li>
          </ul>
          <p style={{ marginTop: '16px' }}>Built from the ground up to get past the robots.</p>
        </div>
      ),
    },
    {
      src: "https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=800&auto=format&fit=crop",
      title: "Interview Preparation",
      category: "Be Ready",
      content: (
        <div>
          <p>Walk into every interview with confidence. Our AI prepares you with:</p>
          <ul style={{ marginTop: '16px', paddingLeft: '20px' }}>
            <li>Common questions for your specific role</li>
            <li>Company-specific talking points</li>
            <li>STAR method response frameworks</li>
            <li>Questions to ask your interviewer</li>
          </ul>
          <p style={{ marginTop: '16px' }}>Be the most prepared candidate in the room.</p>
        </div>
      ),
    },
    {
      src: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=800&auto=format&fit=crop",
      title: "Application Tracker",
      category: "Stay Organized",
      content: (
        <div>
          <p>Keep track of every application in one place. Never lose an opportunity.</p>
          <ul style={{ marginTop: '16px', paddingLeft: '20px' }}>
            <li>Automatic status tracking</li>
            <li>Follow-up reminders</li>
            <li>Response rate analytics</li>
            <li>Interview scheduling integration</li>
          </ul>
          <p style={{ marginTop: '16px' }}>Your job search command center.</p>
        </div>
      ),
    },
  ];

  const loadSample = () => {
    setCvText(
      "John Doe\nSoftware Engineer\n\nExperience:\n- 3 years of React development\n- Built 5 web applications\n- Team collaboration\n\nSkills: React, JavaScript, HTML, CSS"
    );
    setJobText(
      "Senior Frontend Developer\n\nRequirements:\n- 5+ years React experience\n- TypeScript expertise\n- Next.js knowledge\n- Testing experience (Jest, React Testing Library)\n- CI/CD pipelines\n- Team leadership"
    );
    setHasUploadedFile(false);
  };

  // Handler for FileUpload dropzone component
  const handleCVFileUploadFromDropzone = async (file: File) => {
    if (!file) return;

    setIsUploadingCV(true);
    setHasUploadedFile(false);

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
      setHasUploadedFile(true);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Upload failed";
      alert(errorMessage);
    } finally {
      setIsUploadingCV(false);
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
    <>
      {/* Structured Data (JSON-LD) for Homepage */}
      <script
        id="organization-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Organization',
            name: 'Rejectly.pro',
            url: 'https://www.rejectly.pro',
            logo: 'https://www.rejectly.pro/logo.png',
            description: 'AI-powered resume optimization platform that helps job seekers get past ATS systems and land more interviews.',
            foundingDate: '2024',
            sameAs: [
              'https://twitter.com/rejectlypro',
              'https://linkedin.com/company/rejectlypro',
            ],
            contactPoint: {
              '@type': 'ContactPoint',
              email: 'support@rejectly.pro',
              contactType: 'Customer Support',
              availableLanguage: ['English'],
            },
          })
        }}
      />
      <script
        id="website-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebSite',
            name: 'Rejectly.pro',
            url: 'https://www.rejectly.pro',
            description: 'AI-powered resume optimization and ATS checker. Transform your resume and get 3x more interviews.',
            potentialAction: {
              '@type': 'SearchAction',
              target: {
                '@type': 'EntryPoint',
                urlTemplate: 'https://www.rejectly.pro/?s={search_term_string}',
              },
              'query-input': 'required name=search_term_string',
            },
          })
        }}
      />
      <script
        id="product-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'SoftwareApplication',
            name: 'Rejectly.pro Resume Optimizer',
            operatingSystem: 'Web',
            applicationCategory: 'BusinessApplication',
            offers: {
              '@type': 'AggregateOffer',
              lowPrice: '2.00',
              highPrice: '12.00',
              priceCurrency: 'USD',
              priceSpecification: [
                {
                  '@type': 'PriceSpecification',
                  price: '2.00',
                  priceCurrency: 'USD',
                  name: 'Single Analysis',
                },
                {
                  '@type': 'PriceSpecification',
                  price: '7.00',
                  priceCurrency: 'USD',
                  name: 'Starter Pack',
                },
                {
                  '@type': 'PriceSpecification',
                  price: '12.00',
                  priceCurrency: 'USD',
                  name: 'Pro Monthly',
                },
              ],
            },
            aggregateRating: {
              '@type': 'AggregateRating',
              ratingValue: '4.8',
              reviewCount: '127',
              bestRating: '5',
              worstRating: '1',
            },
            description: 'AI-powered resume optimization tool that analyzes your resume against job postings, identifies ATS compatibility issues, and provides actionable improvements to increase interview rates.',
            featureList: [
              'AI Resume Analysis',
              'ATS Optimization',
              'Job Matching Algorithm',
              'Cover Letter Generator',
              'Keyword Targeting',
              'Resume Rewriting',
            ],
            screenshot: 'https://www.rejectly.pro/screenshot.png',
          })
        }}
      />
      <script
        id="review-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Product',
            name: 'Rejectly.pro AI Resume Optimizer',
            description: 'AI-powered resume optimization and ATS checker',
            brand: {
              '@type': 'Organization',
              name: 'Rejectly.pro',
            },
            aggregateRating: {
              '@type': 'AggregateRating',
              ratingValue: '4.8',
              reviewCount: '127',
              bestRating: '5',
              worstRating: '1',
            },
            review: [
              {
                '@type': 'Review',
                author: {
                  '@type': 'Person',
                  name: 'Sarah Chen',
                },
                reviewRating: {
                  '@type': 'Rating',
                  ratingValue: '5',
                  bestRating: '5',
                },
                datePublished: '2024-11-15',
                reviewBody:
                  'I went from 2 responses out of 50 applications to 8 interviews in 2 weeks. The ATS optimization alone was worth 10x the price. My resume now actually gets read by humans, not just rejected by bots.',
              },
              {
                '@type': 'Review',
                author: {
                  '@type': 'Person',
                  name: 'Marcus Williams',
                },
                reviewRating: {
                  '@type': 'Rating',
                  ratingValue: '5',
                  bestRating: '5',
                },
                datePublished: '2024-11-10',
                reviewBody:
                  'Best investment in my job search. The AI caught keyword gaps I never would have noticed. Within 3 days of using my optimized resume, I had interview requests from 3 companies I thought were out of reach.',
              },
              {
                '@type': 'Review',
                author: {
                  '@type': 'Person',
                  name: 'Priya Patel',
                },
                reviewRating: {
                  '@type': 'Rating',
                  ratingValue: '5',
                  bestRating: '5',
                },
                datePublished: '2024-11-05',
                reviewBody:
                  'The cover letter generator saved me hours. I was spending 45 minutes per application writing custom letters. Now I get personalized, compelling cover letters in 30 seconds. Already landed 2 final round interviews.',
              },
            ],
          })
        }}
      />
      <Container>
      {/* HERO SECTION */}
      <HeroSection>
        <HeroHighlightWrapper>
        <HeroContent>
          

          <HeroTitle>
            Optimize Your Resume for <Highlight>Job Postings</Highlight>
          </HeroTitle>

          <HeroSubtitle>
            Use AI to <strong>identify missing skills</strong>, improve your
            resume, and get <strong>73% more interview invitations</strong>
          </HeroSubtitle>

          <ButtonGroup>
            <PrimaryButton href={ROUTES.AUTH.SIGNUP}>
              
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
              <AvatarWrapper $isFirst>
                <Image src="https://i.pravatar.cc/150?img=1" alt="Software Engineer who beat ATS systems with Rejectly AI resume optimizer" fill sizes="44px" style={{ objectFit: "cover" }} />
              </AvatarWrapper>
              <AvatarWrapper>
                <Image src="https://i.pravatar.cc/150?img=2" alt="Product Manager who achieved career transformation using Rejectly ATS optimization" fill sizes="44px" style={{ objectFit: "cover" }} />
              </AvatarWrapper>
              <AvatarWrapper>
                <Image src="https://i.pravatar.cc/150?img=3" alt="Data Scientist who landed dream job with Rejectly AI-powered resume analysis" fill sizes="44px" style={{ objectFit: "cover" }} />
              </AvatarWrapper>
              <AvatarWrapper>
                <Image src="https://i.pravatar.cc/150?img=4" alt="UX Designer who improved interview success rate with Rejectly resume optimizer" fill sizes="44px" style={{ objectFit: "cover" }} />
              </AvatarWrapper>
              <AvatarWrapper>
                <Image src="https://i.pravatar.cc/150?img=5" alt="Marketing Professional who got 5x more interviews using Rejectly ATS-friendly resumes" fill sizes="44px" style={{ objectFit: "cover" }} />
              </AvatarWrapper>
            </AvatarStack>
            <SocialProofText>
              <StarIcon />
              <strong>4.8/5</strong> (127 reviews)
            </SocialProofText>
          </SocialProof>
        </HeroContent>
        </HeroHighlightWrapper>
      </HeroSection>

      <Divider />

      {/* PROBLEM-AGITATE SECTION */}
      <ProblemBentoGrid />

      <Divider />

      {/* DEMO SECTION - SIMPLIFIED */}
      <DemoSectionWrapper>
        <LampContainer>
          <DemoSection id="demo">
            <SectionHeader>
              <SectionTitle style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>

                Try it now - Free
              </SectionTitle>
              <SectionSubtitle>
                Paste your resume and job description, get instant AI feedback
              </SectionSubtitle>
            </SectionHeader>

        <NewDemoCard>
          {step === "upload" && !result && (
            <>
              <DemoCardHeader>
                <DemoCardTitle>
                  <DemoTitleRow>
                    Quick Demo
                  </DemoTitleRow>
                </DemoCardTitle>
                <DemoCardDescription>
                  Upload or paste your resume and job description to get instant AI feedback
                </DemoCardDescription>
              </DemoCardHeader>

              <DemoCardContent>
                <DemoInputsGrid>
                  {/* Resume Input Section */}
                  <DemoInputSection>
                    <InputLabel>
                      <DocumentTextIcon />
                      Your Resume
                    </InputLabel>
                    <DemoInputContent>
                      <FileUpload
                        accept=".pdf,.docx"
                        onChange={(files) => {
                          if (files.length > 0) {
                            handleCVFileUploadFromDropzone(files[0]);
                          }
                        }}
                        onRemove={() => {
                          setHasUploadedFile(false);
                          setCvText("");
                        }}
                      />
                      {!hasUploadedFile && (
                        <>
                          <DemoOrDivider>
                            <span>or paste text</span>
                          </DemoOrDivider>
                          <NewDemoTextarea
                            placeholder="Paste your resume text here..."
                            value={cvText}
                            onChange={(e) => setCvText(e.target.value)}
                            style={{ minHeight: '120px' }}
                          />
                        </>
                      )}
                    </DemoInputContent>
                  </DemoInputSection>

                  {/* Job Description Input Section */}
                  <DemoInputSection>
                    <InputLabel>
                      <BriefcaseIcon />
                      Job Description
                    </InputLabel>
                    <NewDemoTextarea
                      placeholder="Paste the job description here..."
                      value={jobText}
                      onChange={(e) => setJobText(e.target.value)}
                      style={{ minHeight: '200px', flex: 1 }}
                    />
                  </DemoInputSection>
                </DemoInputsGrid>

                <ButtonsRow>
                  <LoadSampleButton onClick={loadSample}>
                    Try Sample Data
                  </LoadSampleButton>
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
                        
                        Analyze Now
                      </>
                    )}
                  </AnalyzeButton>
                </ButtonsRow>
              </DemoCardContent>
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
          </NewDemoCard>
          </DemoSection>
        </LampContainer>
      </DemoSectionWrapper>

      <Divider />

      {/* FEATURES */}
      <Section id="features">
        <SectionHeader>
          <SectionTitle>Six powerful tools. One goal.</SectionTitle>
          <SectionSubtitle>
            Everything works together to get you hired.
          </SectionSubtitle>
        </SectionHeader>

        <Carousel
          items={featureCards.map((card, index) => (
            <AppleCard key={card.title} card={card} index={index} layout />
          ))}
        />
      </Section>

      <Divider />

      {/* TIMELINE SECTION */}
      <TimelineSection>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px' }}>
          <SectionHeader>
            <SectionTitle>A clearer path forward</SectionTitle>
            <SectionSubtitle>
              What changes when your resume finally works for you
            </SectionSubtitle>
          </SectionHeader>
        </div>

        <Timeline
          data={[
            {
              period: "Day 1",
              headline: "Your resume becomes visible",
              text: (
                <>
                  AI reveals <TimelineHighlight>exactly why</TimelineHighlight> you were getting rejected.
                  In just 15 minutes, you have an ATS-optimized resume with the right keywords,
                  perfect formatting, and language that both robots and humans love.
                </>
              ),
              metadata: "Optimized for modern ATS systems · Setup takes under 15 minutes",
            },
            {
              period: "Week 1",
              headline: "Recruiters start noticing",
              text: (
                <>
                  Your resume passes automated filters and reaches real decision-makers.<br/>
You’re no longer applying broadly — <TimelineHighlight>you’re applying precisely.</TimelineHighlight>
                </>
              ),
              metadata: "Higher response rate · Better role alignment",
            },
            {
              period: "Month 1",
              headline: "You gain leverage",
              text: (
                <>
                  Interviews turn into offers.<br/>
Not one — but multiple conversations happening at the same time.<br/>
For the first time, you’re choosing, not waiting.
                </>
              ),
              metadata: "Multiple offers · Negotiation confidence",
            },
            {
              period: "Year 1",
              headline: "Your trajectory changes",
              text: (
                <>
                  Promotions feel attainable.<br/>
Your confidence compounds.<br/>
You understand how to position yourself — for any role that comes next.
                </>
              ),
              metadata: "Long-term earning growth · Career momentum",
            },
          ]}
        />
      </TimelineSection>

      <Divider />

      {/* TESTIMONIALS - WHAT OUR USERS SAY */}
      <Section id="testimonials">
        <SectionHeader>
          <SectionTitle>What our users say</SectionTitle>
          <SectionSubtitle>
            Real results from real professionals
          </SectionSubtitle>
        </SectionHeader>

        <TestimonialGrid>
          <TestimonialCard>
            <TestimonialHeader>
              <TestimonialAvatar>
                <Image src="https://i.pravatar.cc/150?img=12" alt="Sarah Chen - Frontend Developer who got 5 interviews in 2 weeks with Rejectly AI resume optimization" fill sizes="56px" style={{ objectFit: "cover" }} />
              </TestimonialAvatar>
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
              <TestimonialAvatar>
                <Image src="https://i.pravatar.cc/150?img=33" alt="Marcus Johnson - Product Manager who achieved 85% ATS pass rate improvement with Rejectly resume optimizer" fill sizes="56px" style={{ objectFit: "cover" }} />
              </TestimonialAvatar>
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
              <TestimonialAvatar>
                <Image src="https://i.pravatar.cc/150?img=47" alt="Emily Rodriguez - Data Analyst success story using Rejectly AI-powered resume analysis and ATS optimization" fill sizes="56px" style={{ objectFit: "cover" }} />
              </TestimonialAvatar>
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
          <SectionTitle>Simple and transparent pricing</SectionTitle>
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
          <SectionTitle>Frequently asked questions</SectionTitle>
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
      <SecondaryCTA />

      <Divider />

      <Footer />
    </Container>
    </>
  );
}
