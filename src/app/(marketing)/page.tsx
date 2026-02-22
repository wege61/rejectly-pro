"use client";

import styled, { keyframes } from "styled-components";
import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { ROUTES } from "@/lib/constants";
import { Footer } from "@/components/ui/Footer";
import { SecondaryCTA } from "@/components/marketing/SecondaryCTA";
import { AnimatedATSScanner } from "@/components/marketing/AnimatedATSScanner";
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
  <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
  @media (max-width: 1024px) {
    padding-top: 60px;
  }
`;

// ==================== HERO SECTION ====================
const HeroSection = styled.section`
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;

  @media (max-width: 768px) {
    min-height: auto;
  }
`;

const AppleHeroBackground = styled.div`
  min-height: 100vh;
  width: 100%;
  padding: 80px 24px 60px;
  position: relative;
  overflow: hidden;

  /* Massive, diffused ambient light */
  &::before {
    content: '';
    position: absolute;
    top: -30%;
    left: 40%;
    width: 100vw;
    height: 100vw;
    background: radial-gradient(circle, rgba(53, 162, 159, 0.12) 0%, rgba(53, 162, 159, 0.05) 30%, transparent 60%);
    filter: blur(100px);
    z-index: 0;
    pointer-events: none;
    opacity: 0.8;
  }

  /* Secondary subtle warm light for depth */
  &::after {
    content: '';
    position: absolute;
    bottom: -20%;
    right: -10%;
    width: 80vw;
    height: 80vw;
    background: radial-gradient(circle, rgba(238, 90, 90, 0.06) 0%, transparent 50%);
    filter: blur(120px);
    z-index: 0;
    pointer-events: none;
  }

  > * {
    position: relative;
    z-index: 1;
  }

  @media (max-width: 768px) {
    min-height: auto;
    padding: 60px 16px 40px;
  }
`;


const HeroContent = styled.div`
  position: relative;
  z-index: 1;
  max-width: 1280px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr;
  gap: 64px;
  align-items: center;
  text-align: center;
  
  @media (min-width: 1024px) {
    grid-template-columns: 1.1fr 0.9fr;
    text-align: left;
  }
`;

const HeroTextColumn = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  animation: ${fadeIn} 0.6s ease-out;

  @media (min-width: 1024px) {
    align-items: flex-start;
  }
`;

const HeroVisualColumn = styled.div`
  display: none;
  
  @media (min-width: 1024px) {
    display: block;
    animation: ${fadeIn} 0.6s ease-out 0.3s backwards;
  }
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
  font-size: 76px;
  font-weight: 700;
  margin-bottom: 24px;
  line-height: 1.05;
  letter-spacing: -0.05em;
  background: linear-gradient(180deg, #FFFFFF 0%, #A1A1AA 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: ${fadeIn} 0.8s cubic-bezier(0.16, 1, 0.3, 1) backwards;
  
  @media (max-width: 768px) {
    font-size: 48px;
  }
`;


const HeroSubtitle = styled.p`
  font-size: 20px;
  color: #5C6570;
  margin-bottom: 40px;
  max-width: 700px;
  margin-left: auto;
  margin-right: auto;
  
  @media (min-width: 1024px) {
    margin-left: 0;
    margin-right: 0;
  }
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
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.18) 0%, rgba(255, 255, 255, 0) 100%),
    rgba(238, 90, 90, 0.82);
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  color: #FFFFFF;
  padding: 18px 40px;
  border-radius: 9999px;
  font-weight: 700;
  font-size: 18px;
  transition: all 0.35s cubic-bezier(0.25, 0.8, 0.25, 1);
  cursor: pointer;
  text-decoration: none;
  border: 1px solid rgba(255, 255, 255, 0.28);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.5),
    0 8px 32px rgba(238, 90, 90, 0.35);

  &:hover {
    background: linear-gradient(180deg, rgba(255, 255, 255, 0.26) 0%, rgba(255, 255, 255, 0) 100%),
      rgba(238, 90, 90, 0.92);
    box-shadow:
      inset 0 1px 0 rgba(255, 255, 255, 0.65),
      0 8px 32px rgba(238, 90, 90, 0.5);
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
  background: rgba(150, 150, 150, 0.08);
  backdrop-filter: blur(40px) saturate(200%);
  -webkit-backdrop-filter: blur(40px) saturate(200%);
  border: 1px solid rgba(255, 255, 255, 0.15);
  color: var(--text-color);
  padding: 18px 32px;
  border-radius: 9999px;
  font-weight: 600;
  font-size: 16px;
  transition: all 0.35s cubic-bezier(0.25, 0.8, 0.25, 1);
  cursor: pointer;
  text-decoration: none;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.25);

  &:hover {
    background: rgba(150, 150, 150, 0.16);
    border-color: rgba(255, 255, 255, 0.28);
    box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.4), 0 8px 24px rgba(0, 0, 0, 0.1);
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
  
  @media (min-width: 1024px) {
    justify-content: flex-start;
  }
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
  background: rgba(150, 150, 150, 0.08);
  backdrop-filter: blur(40px) saturate(200%);
  -webkit-backdrop-filter: blur(40px) saturate(200%);
  border: 1px solid rgba(255, 255, 255, 0.15);
  color: var(--text-color);
  padding: 16px 28px;
  font-weight: 600;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.35s cubic-bezier(0.25, 0.8, 0.25, 1);
  border-radius: 9999px;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.25);
  min-width: 180px;

  svg {
    width: 20px;
    height: 20px;
  }

  &:hover {
    background: rgba(150, 150, 150, 0.16);
    border-color: rgba(255, 255, 255, 0.28);
    box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.4), 0 8px 24px rgba(0, 0, 0, 0.1);
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
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.18) 0%, rgba(255, 255, 255, 0) 100%),
    rgba(238, 90, 90, 0.82);
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  color: white;
  padding: 16px 32px;
  border: 1px solid rgba(255, 255, 255, 0.28);
  border-radius: 9999px;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.35s cubic-bezier(0.25, 0.8, 0.25, 1);
  opacity: ${({ $isLoading }) => ($isLoading ? 0.7 : 1)};
  min-width: 180px;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.5), 0 4px 16px rgba(238, 90, 90, 0.35);

  &:hover:not(:disabled) {
    background: linear-gradient(180deg, rgba(255, 255, 255, 0.26) 0%, rgba(255, 255, 255, 0) 100%),
      rgba(238, 90, 90, 0.92);
    box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.65), 0 4px 20px rgba(238, 90, 90, 0.5);
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
  background: rgba(150, 150, 150, 0.08);
  backdrop-filter: blur(50px) saturate(200%);
  border: 1px solid rgba(255, 255, 255, 0.15);
  box-shadow: inset 0 1px 1px rgba(255, 255, 255, 0.3), 0 20px 50px rgba(0, 0, 0, 0.15);
  border-radius: ${({ theme }) => theme.radius.xl};
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);

  &:hover {
    transform: translateY(-4px);
    box-shadow: inset 0 1px 1px rgba(255, 255, 255, 0.4), 0 25px 60px rgba(0, 0, 0, 0.2);
  }

  @media (max-width: 767px) {
    padding: 32px 24px;
  }
`;

const FeatureIC = styled.div`
  width: 56px;
  height: 56px;
  border-radius: 16px;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.4) 0%, rgba(255, 255, 255, 0.05) 100%);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 20px;
  box-shadow: inset 0 2px 4px rgba(255, 255, 255, 0.5), 0 8px 16px rgba(0, 0, 0, 0.1);

  svg {
    width: 28px;
    height: 28px;
    color: var(--text-color);
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
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  padding: 6px 12px;
  border-radius: 100px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: inset 0 1px 1px rgba(255, 255, 255, 0.4);
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
  background: rgba(255, 255, 255, 0.02);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 20px;
  padding: 32px;
  transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
  display: flex;
  flex-direction: column;
  gap: 20px;
  box-shadow: inset 0 1px 1px rgba(255, 255, 255, 0.05), 0 4px 16px rgba(0, 0, 0, 0.2);

  @media (min-width: 768px) and (max-width: 850px) {
    gap: 16px;
    padding: 20px;
  }

  &:hover {
    border-color: rgba(255, 255, 255, 0.15);
    background: rgba(255, 255, 255, 0.04);
    transform: translateY(-4px);
    box-shadow: inset 0 1px 1px rgba(255, 255, 255, 0.1), 0 12px 32px rgba(0, 0, 0, 0.4);
  }
`;

const TestimonialHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
`;

const TestimonialAvatar = styled.div`
  width: 52px;
  height: 52px;
  border-radius: 50%;
  border: 1px solid rgba(255, 255, 255, 0.15);
  overflow: hidden;
  position: relative;
  flex-shrink: 0;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
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
  opacity: 0.9;

  &:before {
    content: '"';
    font-size: 40px;
    color: rgba(255, 255, 255, 0.1);
    position: absolute;
    top: -12px;
    left: -12px;
    font-family: Georgia, serif;
    pointer-events: none;
  }
`;

const TestimonialHighlight = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: rgba(34, 197, 94, 0.08); /* Tailwind green-500 matching */
  border: 1px solid rgba(34, 197, 94, 0.2);
  color: #22c55e;

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
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  max-width: 1200px;
  margin: 0 auto;

  @media (max-width: 968px) {
    grid-template-columns: 1fr;
    max-width: 480px;
  }
`;

const PricingCard = styled.div<{ $featured?: boolean }>`
  background: var(--bg-alt);
  border: 1px solid ${({ $featured }) => $featured ? "var(--text-color)" : "var(--border-color)"};
  border-radius: 16px;
  padding: 40px;
  position: relative;
  transition: all 0.2s ease;

  @media (max-width: 768px) {
    padding: 32px;
  }
`;

const PricingBadge = styled.div`
  position: absolute;
  top: -14px;
  left: 50%;
  transform: translateX(-50%);
  background: var(--text-color);
  color: var(--bg-alt);
  padding: 8px 20px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 500;
  white-space: nowrap;
`;

const PricingPlanName = styled.h3`
  font-size: 24px;
  font-weight: 600;
  margin: 0 0 12px;
  color: var(--text-color);
`;

const PricingPrice = styled.div`
  font-size: 56px;
  font-weight: 700;
  color: var(--text-color);
  line-height: 1.1;
  letter-spacing: -2px;
  margin-bottom: 6px;

  @media (max-width: 768px) {
    font-size: 48px;
  }
`;

const PricingPriceSubtext = styled.p`
  font-size: 15px;
  color: var(--text-tertiary);
  margin: 0 0 6px;
`;

const PricingPlanDescription = styled.p`
  font-size: 15px;
  color: var(--text-tertiary);
  margin: 0 0 20px;
`;

const PricingPlanTagline = styled.p`
  font-size: 18px;
  font-weight: 600;
  color: var(--text-color);
  margin: 0 0 24px;
`;

const PricingCTAButton = styled.a<{ $primary?: boolean }>`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 16px 28px;
  border-radius: 9999px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.35s cubic-bezier(0.25, 0.8, 0.25, 1);
  margin-bottom: 32px;
  text-decoration: none;

  ${({ $primary }) =>
    $primary
      ? `
    background: linear-gradient(180deg, rgba(255, 255, 255, 0.18) 0%, rgba(255, 255, 255, 0) 100%),
      rgba(238, 90, 90, 0.82);
    backdrop-filter: blur(20px) saturate(180%);
    -webkit-backdrop-filter: blur(20px) saturate(180%);
    color: white;
    border: 1px solid rgba(255, 255, 255, 0.28);
    box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.5), 0 4px 16px rgba(238, 90, 90, 0.35);

    &:hover {
      background: linear-gradient(180deg, rgba(255, 255, 255, 0.26) 0%, rgba(255, 255, 255, 0) 100%),
        rgba(238, 90, 90, 0.92);
      box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.65), 0 4px 20px rgba(238, 90, 90, 0.5);
    }
  `
      : `
    background: rgba(150, 150, 150, 0.08);
    backdrop-filter: blur(40px) saturate(200%);
    -webkit-backdrop-filter: blur(40px) saturate(200%);
    color: var(--text-color);
    border: 1px solid rgba(255, 255, 255, 0.15);
    box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.25);

    &:hover {
      background: rgba(150, 150, 150, 0.16);
      border-color: rgba(255, 255, 255, 0.28);
      box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.4), 0 8px 24px rgba(0, 0, 0, 0.1);
    }
  `}

  svg {
    width: 18px;
    height: 18px;
  }
`;


const PricingFeatureList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const PricingFeatureRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 15px;
  color: var(--text-color);

  svg {
    flex-shrink: 0;
    width: 20px;
    height: 20px;
    color: var(--text-tertiary);
  }
`;

const PricingFeatureRowMuted = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 14px;
  color: var(--text-tertiary);

  svg {
    flex-shrink: 0;
    width: 20px;
    height: 20px;
    color: var(--text-tertiary);
    opacity: 0.7;
  }
`;

const PricingFeatureRowHighlight = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 15px;
  color: var(--accent);
  font-weight: 500;

  svg {
    flex-shrink: 0;
    width: 20px;
    height: 20px;
    color: var(--accent);
  }
`;

// Pricing Icons
const PricingArrowIcon = () => (
  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
  </svg>
);

const PricingCreditIcon = () => (
  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const PricingAnalysisIcon = () => (
  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
  </svg>
);

const PricingATSIcon = () => (
  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const PricingLetterIcon = () => (
  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
);

const PricingSparklesIcon = () => (
  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
  </svg>
);

const PricingClockIcon = () => (
  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const PricingShieldIcon = () => (
  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
  </svg>
);

const PricingMixIcon = () => (
  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
  </svg>
);

const PricingSaveIcon = () => (
  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const PricingTargetIcon = () => (
  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const PricingInfinityIcon = () => (
  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18.178 8c5.096 0 5.096 8 0 8-5.095 0-7.133-8-12.739-8-4.303 0-4.303 8 0 8 5.606 0 7.644-8 12.74-8z" />
  </svg>
);

const PricingRocketIcon = () => (
  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.631 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 00-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 01-2.448-2.448 14.9 14.9 0 01.06-.312m-2.24 2.39a4.493 4.493 0 00-1.757 4.306 4.493 4.493 0 004.306-1.758M16.5 9a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
  </svg>
);

const PricingStarIcon = () => (
  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
  </svg>
);

const PricingRefreshIcon = () => (
  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
  </svg>
);

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
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.18) 0%, rgba(255, 255, 255, 0) 100%),
    var(--primary-500);
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  color: white;
  font-size: 16px;
  font-weight: 600;
  border-radius: 9999px;
  text-decoration: none;
  transition: all 0.35s cubic-bezier(0.25, 0.8, 0.25, 1);
  border: 1px solid rgba(255, 255, 255, 0.28);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.5), 0 4px 16px rgba(var(--primary-500-rgb), 0.3);

  &:hover {
    filter: brightness(1.1);
    box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.65), 0 4px 20px rgba(var(--primary-500-rgb), 0.45);
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

// ==================== PROVOCATION SECTION (The True Cost) ====================
const ProvocationSection = styled.div`
  margin: 60px 0 100px;
  width: 100%;
`;

const ProvocationHeader = styled.div`
  text-align: center;
  margin-bottom: 64px;

  .eyebrow {
    font-size: 13px;
    text-transform: uppercase;
    letter-spacing: 2px;
    font-weight: 700;
    color: #ff6b6b;
    margin-bottom: 16px;
    display: inline-block;
  }

  h3 {
    font-size: 48px;
    font-weight: 800;
    color: var(--text-color);
    letter-spacing: -0.03em;
    line-height: 1.1;
    margin-bottom: 24px;
    max-width: 800px;
    margin-left: auto;
    margin-right: auto;

    @media (max-width: 768px) {
      font-size: 36px;
    }
  }

  p {
    font-size: 20px;
    color: var(--text-secondary);
    line-height: 1.6;
    max-width: 640px;
    margin: 0 auto;

    @media (max-width: 768px) {
      font-size: 18px;
    }
  }
`;

const ContrastGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 24px;
  max-width: 1000px;
  margin: 0 auto;

  @media (min-width: 768px) {
    grid-template-columns: 1fr 1fr;
  }
`;

const BaseColumn = styled.div`
  border-radius: 24px;
  padding: 48px 40px;
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;

  @media (max-width: 768px) {
    padding: 32px 24px;
  }
`;

const OldWayColumn = styled(BaseColumn)`
  background: rgba(150, 150, 150, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
  opacity: 0.8;

  .title {
    font-size: 16px;
    text-transform: uppercase;
    letter-spacing: 1px;
    color: var(--text-tertiary);
    font-weight: 600;
    margin-bottom: 24px;
  }

  .price {
    font-size: 64px;
    font-weight: 800;
    color: var(--text-secondary);
    letter-spacing: -0.04em;
    line-height: 1;
    margin-bottom: 32px;
    text-decoration: line-through;
    opacity: 0.5;

    span {
      font-size: 24px;
      font-weight: 600;
      letter-spacing: normal;
    }
  }

  ul {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 16px;

    li {
      display: flex;
      align-items: center;
      gap: 12px;
      font-size: 16px;
      color: var(--text-tertiary);

      svg {
        width: 20px;
        height: 20px;
        color: rgba(255, 255, 255, 0.2);
        flex-shrink: 0;
      }
    }
  }
`;

const RejectlyColumn = styled(BaseColumn)`
  background: linear-gradient(135deg, rgba(var(--accent-rgb), 0.15) 0%, rgba(var(--primary-500-rgb), 0.05) 100%);
  backdrop-filter: blur(40px) saturate(200%);
  -webkit-backdrop-filter: blur(40px) saturate(200%);
  border: 1px solid rgba(var(--accent-rgb), 0.4);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.2), 0 24px 48px rgba(var(--accent-rgb), 0.15);

  .glow {
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(circle at 50% 0%, rgba(var(--accent-rgb), 0.15) 0%, transparent 50%);
    pointer-events: none;
  }

  .title {
    font-size: 16px;
    text-transform: uppercase;
    letter-spacing: 2px;
    color: var(--accent);
    font-weight: 800;
    margin-bottom: 24px;
    position: relative;
    z-index: 1;
  }

  .price {
    font-size: 80px;
    font-weight: 800;
    color: var(--text-color);
    letter-spacing: -0.05em;
    line-height: 1;
    margin-bottom: 32px;
    position: relative;
    z-index: 1;
    text-shadow: 0 4px 24px rgba(var(--accent-rgb), 0.4);

    span {
      font-size: 20px;
      font-weight: 600;
      color: var(--text-secondary);
      letter-spacing: normal;
      text-shadow: none;
    }
  }

  ul {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 16px;
    position: relative;
    z-index: 1;

    li {
      display: flex;
      align-items: flex-start;
      gap: 12px;
      font-size: 18px;
      color: var(--text-color);
      font-weight: 500;
      line-height: 1.4;

      svg {
        width: 24px;
        height: 24px;
        color: var(--accent);
        flex-shrink: 0;
        margin-top: -2px;
      }
    }
  }
`;

const ProvocativeCTA = styled.div`
  text-align: center;
  margin-top: 64px;
  
  p {
    font-size: 24px;
    font-weight: 700;
    color: var(--text-color);
    letter-spacing: -0.02em;
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
      title: "X-Ray Vision for Your Resume",
      category: "See the Unseen",
      content: (
        <div>
          <p>See exactly why you're getting rejected. Our AI analyzes your resume against the job description and reveals:</p>
          <ul style={{ marginTop: '16px', paddingLeft: '20px' }}>
            <li>The exact missing keywords killing your ATS score</li>
            <li>Formatting errors that trigger auto-rejections</li>
            <li>Weak action verbs that make you sound junior</li>
            <li>The quantifiable metrics employers are actually looking for</li>
          </ul>
          <p style={{ marginTop: '16px' }}>Stop guessing. Get the hiring manager's perspective in seconds.</p>
        </div>
      ),
    },
    {
      src: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=800&auto=format&fit=crop",
      title: "Sniper-Targeted Job Matching",
      category: "Find Your Fit",
      content: (
        <div>
          <p>Stop applying blindly and praying for a response. Our AI finds jobs where you have an unfair advantage.</p>
          <ul style={{ marginTop: '16px', paddingLeft: '20px' }}>
            <li>Hard metric match score for every job posting</li>
            <li>Brutal skills gap analysis (know what you're missing)</li>
            <li>Salary insights based on your actual market value</li>
            <li>Company culture compatibility indicators</li>
          </ul>
          <p style={{ marginTop: '16px' }}>Apply smarter. Only fight battles you can win.</p>
        </div>
      ),
    },
    {
      src: "https://images.unsplash.com/photo-1455390582262-044cdead277a?q=80&w=800&auto=format&fit=crop",
      title: "1-Click Tailored Cover Letters",
      category: "Stop Staring at Blank Pages",
      content: (
        <div>
          <p>The days of generic &quot;To whom it may concern&quot; letters are over. Generate hyper-personalized letters instantly.</p>
          <ul style={{ marginTop: '16px', paddingLeft: '20px' }}>
            <li>Professionally written in 30 seconds</li>
            <li>Matches the specific job requirements perfectly</li>
            <li>Highlights your most relevant achievements</li>
            <li>Multiple tone options (formal, creative, confident)</li>
          </ul>
          <p style={{ marginTop: '16px' }}>Make them feel like you wrote it just for them.</p>
        </div>
      ),
    },
    {
      src: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=800&auto=format&fit=crop",
      title: "Robot-Proof Formatting",
      category: "Beat the Filters",
      content: (
        <div>
          <p>Beautiful resumes get rejected if robots can't read them. We use structures engineered to pass the ATS.</p>
          <ul style={{ marginTop: '16px', paddingLeft: '20px' }}>
            <li>Templates rigorously tested against major ATS systems</li>
            <li>Automatic, context-aware keyword optimization</li>
            <li>Flawless parsing by recruiting software</li>
            <li>Export to PDF, Word, or plain text exactly as needed</li>
          </ul>
          <p style={{ marginTop: '16px' }}>Built from the ground up to slip past the robot gatekeepers.</p>
        </div>
      ),
    },
    {
      src: "https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=800&auto=format&fit=crop",
      title: "Interview Preparation Simulator",
      category: "Dominate the Room",
      content: (
        <div>
          <p>Don&apos;t freeze when it matters most. Walk into every interview knowing the answers before they ask the questions.</p>
          <ul style={{ marginTop: '16px', paddingLeft: '20px' }}>
            <li>Predictive questions for your specific target role</li>
            <li>Company-specific talking points and red flags</li>
            <li>STAR method response frameworks built for your background</li>
            <li>High-leverage questions to ask your interviewer</li>
          </ul>
          <p style={{ marginTop: '16px' }}>Turn interviews from interrogations into conversations.</p>
        </div>
      ),
    },
    {
      src: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=800&auto=format&fit=crop",
      title: "The Application War Room",
      category: "Command Center",
      content: (
        <div>
          <p>Keep your entire job search arsenal in one focused dashboard. Never drop the ball on a follow-up again.</p>
          <ul style={{ marginTop: '16px', paddingLeft: '20px' }}>
            <li>Automated status tracking pipeline</li>
            <li>Aggressive follow-up reminders</li>
            <li>Hard data on your response rate and funnel conversion</li>
            <li>Centralized document management for every role</li>
          </ul>
          <p style={{ marginTop: '16px' }}>Treat your job search like a high-stakes sales pipeline.</p>
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
        <AppleHeroBackground>
                <HeroContent>
          <HeroTextColumn>
            <HeroTitle>
              Your Resume is Invisible. Let&apos;s Fix That.
            </HeroTitle>

            <HeroSubtitle>
              75% of resumes never reach a human. Train our AI on your target job description and get a <strong>mathematically perfect, ATS-beating resume</strong> in 30 seconds.
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
            
            <div style={{ fontSize: '13px', color: 'var(--text-tertiary)', marginTop: '-24px', marginBottom: '40px', textAlign: 'center', letterSpacing: '0.2px' }}>
              No credit card required &bull; Get results in 30s
            </div>

            <TrustIndicators>
              <TrustItem>
                <div className="number">500+</div>
                <div className="label">Careers Transformed</div>
              </TrustItem>
              <TrustItem>
                <div className="number">10,000+</div>
                <div className="label">ATS Filters Bypassed</div>
              </TrustItem>
              <TrustItem>
                <div className="number">73%</div>
                <div className="label">Higher Interview Rate</div>
              </TrustItem>
            </TrustIndicators>
          </HeroTextColumn>

          <HeroVisualColumn>
            <AnimatedATSScanner />
          </HeroVisualColumn>
        </HeroContent>
        </AppleHeroBackground>
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

                Scan Your Resume. See Why You&apos;re Failing.
              </SectionTitle>
              <SectionSubtitle>
                Is your resume ATS-ready? Paste your text below and let the AI find your fatal flaws.
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
                <div style={{ background: 'rgba(238, 90, 90, 0.1)', border: '1px solid rgba(238, 90, 90, 0.3)', padding: '40px 32px', borderRadius: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.1), 0 20px 40px rgba(238, 90, 90, 0.15)' }}>
                  <h3 style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', color: '#ff6b6b', fontSize: '28px', margin: 0 }}>
                    <LockIcon />
                    Unlock Your Fatal Flaws for $2
                  </h3>
                  <p style={{ fontSize: '18px', color: 'var(--text-color)', fontWeight: 500, margin: 0, textAlign: 'center' }}>
                    You are making critical mistakes that guarantee your rejection. <br/>
                    Don't lose a $100k+ job because you didn't know the rules.
                  </p>
                  <p style={{ margin: 0, fontSize: '15px', color: 'var(--text-secondary)', textAlign: 'center' }}>
                    Get the exact missing keywords, robot-proof formatting, and instant AI rewrites.
                  </p>
                  <CTAButtons style={{ marginTop: '16px', width: '100%', justifyContent: 'center' }}>
                    <CTAButton as="a" href="/signup" $variant="primary" style={{ width: '100%', maxWidth: '320px', fontSize: '18px', padding: '16px' }}>
                      Reveal My Mistakes Now
                    </CTAButton>
                  </CTAButtons>
                </div>
              </CTASection>
            </ResultsCard>
          )}
          </NewDemoCard>
          </DemoSection>
        </LampContainer>
      </DemoSectionWrapper>

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

      {/* FEATURES */}
      <section id="features" style={{ width: "100vw", position: "relative", left: "50%", right: "50%", marginLeft: "-50vw", marginRight: "-50vw", padding: "100px 0", overflow: "hidden" }}>
        {/* Animated Background Orbs for Liquid Glass Effect */}
        <div style={{
          position: "absolute",
          top: "-10%",
          left: "-10%",
          width: "50vw",
          height: "50vw",
          background: "radial-gradient(circle, rgba(94, 187, 240, 0.4) 0%, rgba(94, 187, 240, 0) 70%)",
          filter: "blur(80px)",
          zIndex: -1,
          animation: "float 15s ease-in-out infinite alternate"
        }} />
        <div style={{
           position: "absolute",
           bottom: "-20%",
           right: "-10%",
           width: "60vw",
           height: "60vw",
           background: "radial-gradient(circle, rgba(238, 90, 90, 0.3) 0%, rgba(238, 90, 90, 0) 70%)",
           filter: "blur(100px)",
           zIndex: -1,
           animation: "float 20s ease-in-out infinite alternate-reverse"
        }} />
        <div style={{
           position: "absolute",
           top: "30%",
           left: "30%",
           width: "40vw",
           height: "40vw",
           background: "radial-gradient(circle, rgba(147, 112, 219, 0.25) 0%, rgba(147, 112, 219, 0) 70%)",
           filter: "blur(90px)",
           zIndex: -1,
           animation: "pulse 12s ease-in-out infinite alternate"
        }} />

        <style dangerouslySetInnerHTML={{__html: `
          @keyframes float {
            0% { transform: translate(0, 0) scale(1); }
            50% { transform: translate(5%, 5%) scale(1.1); }
            100% { transform: translate(-5%, -5%) scale(0.9); }
          }
          @keyframes pulse {
            0% { opacity: 0.6; transform: scale(0.95); }
            100% { opacity: 1; transform: scale(1.05); }
          }
        `}} />

        <SectionHeader style={{ maxWidth: "1200px", margin: "0 auto 64px auto", padding: "0 24px", position: "relative", zIndex: 2 }}>
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
      </section>

      <Divider />

      {/* PRICING - SIMPLIFIED */}
      <Section id="pricing">
        <SectionHeader>
          <SectionTitle>Simple and transparent pricing</SectionTitle>
          <SectionSubtitle>
            Affordable plans to help you succeed
          </SectionSubtitle>
        </SectionHeader>

        {/* THE TRUE COST (PROVOCATIVE SALES SECTION) */}
        <ProvocationSection>
          <ProvocationHeader>
            <span className="eyebrow">The True Cost</span>
            <h3>Don't lose a $100k+ job over a $2 mistake.</h3>
            <p>75% of resumes are discarded by ATS robots before a human ever sees them. Relying on generic templates or guessing keywords is killing your career trajectory.</p>
          </ProvocationHeader>

          <ContrastGrid>
            {/* The Old Way */}
            <OldWayColumn>
              <div className="title">The Old Way</div>
              <div className="price">$250+<span>/avg</span></div>
              <ul>
                <li>
                  <svg fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                  Hire a "career coach" who uses same AI tools
                </li>
                <li>
                  <svg fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                  Wait 7 days for a generic, manual rewrite
                </li>
                <li>
                  <svg fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                  Still fail the specific ATS keyword scan
                </li>
              </ul>
            </OldWayColumn>

            {/* The Rejectly Way */}
            <RejectlyColumn>
              <div className="glow" />
              <div className="title">With Rejectly.pro</div>
              <div className="price">$2<span>/analysis</span></div>
              <ul>
                <li>
                  <CheckIcon />
                  AI specifically trained to bypass ATS filters
                </li>
                <li>
                  <CheckIcon />
                  Expert-level rewriting delivered in 30 seconds
                </li>
                <li>
                  <CheckIcon />
                  Bullet points tailored to the exact job description
                </li>
              </ul>
            </RejectlyColumn>
          </ContrastGrid>

          <ProvocativeCTA>
            <p>Stop bringing a knife to a robot fight.</p>
          </ProvocativeCTA>
        </ProvocationSection>

        <PricingGrid>
          {/* Single Plan */}
          <PricingCard>
            <PricingPlanName>Single</PricingPlanName>
            <PricingPrice>$2</PricingPrice>
            <PricingPriceSubtext>one-time payment</PricingPriceSubtext>
            <PricingPlanDescription>Try it with a single analysis</PricingPlanDescription>
            <PricingPlanTagline>Perfect for quick tests</PricingPlanTagline>
            <PricingCTAButton href={ROUTES.AUTH.SIGNUP}>
              Get started <PricingArrowIcon />
            </PricingCTAButton>
            <PricingFeatureList>
              <PricingFeatureRow><PricingCreditIcon />1 credit — Perfect for testing</PricingFeatureRow>
              <PricingFeatureRow><PricingAnalysisIcon />1 job match analysis OR</PricingFeatureRow>
              <PricingFeatureRow><PricingATSIcon />1 ATS optimization OR</PricingFeatureRow>
              <PricingFeatureRow><PricingLetterIcon />1 cover letter</PricingFeatureRow>
              <PricingFeatureRow><PricingSparklesIcon />Full Pro features included</PricingFeatureRow>
              <PricingFeatureRowMuted><PricingClockIcon />Valid for 30 days</PricingFeatureRowMuted>
              <PricingFeatureRowMuted><PricingShieldIcon />No subscription, no commitment</PricingFeatureRowMuted>
            </PricingFeatureList>
          </PricingCard>

          {/* Starter Plan - Featured */}
          <PricingCard $featured>
            <PricingBadge>Most popular</PricingBadge>
            <PricingPlanName>Starter</PricingPlanName>
            <PricingPrice>$7</PricingPrice>
            <PricingPriceSubtext>one-time payment</PricingPriceSubtext>
            <PricingPlanDescription>$0.70 per analysis — save 65%</PricingPlanDescription>
            <PricingPlanTagline>Best for active job seekers</PricingPlanTagline>
            <PricingCTAButton $primary href={ROUTES.AUTH.SIGNUP}>
              Get started <PricingArrowIcon />
            </PricingCTAButton>
            <PricingFeatureList>
              <PricingFeatureRow><PricingCreditIcon />10 credits — Use however you need</PricingFeatureRow>
              <PricingFeatureRow><PricingAnalysisIcon />Job match analyses</PricingFeatureRow>
              <PricingFeatureRow><PricingATSIcon />ATS optimizations</PricingFeatureRow>
              <PricingFeatureRow><PricingLetterIcon />Cover letters</PricingFeatureRow>
              <PricingFeatureRow><PricingMixIcon />Mix & match: 5 jobs + 3 ATS + 2 letters</PricingFeatureRow>
              <PricingFeatureRowHighlight><PricingSaveIcon />Save 65% ($0.70 per credit)</PricingFeatureRowHighlight>
              <PricingFeatureRowMuted><PricingClockIcon />Credits valid for 90 days</PricingFeatureRowMuted>
              <PricingFeatureRowMuted><PricingTargetIcon />Best for 5-10 target positions</PricingFeatureRowMuted>
            </PricingFeatureList>
          </PricingCard>

          {/* Pro Plan */}
          <PricingCard>
            <PricingPlanName>Pro</PricingPlanName>
            <PricingPrice>$12</PricingPrice>
            <PricingPriceSubtext>per month</PricingPriceSubtext>
            <PricingPlanDescription>Unlimited for power users</PricingPlanDescription>
            <PricingPlanTagline>Apply without limits</PricingPlanTagline>
            <PricingCTAButton href={ROUTES.AUTH.SIGNUP}>
              Get started <PricingArrowIcon />
            </PricingCTAButton>
            <PricingFeatureList>
              <PricingFeatureRow><PricingInfinityIcon />Unlimited — No limits, no counting</PricingFeatureRow>
              <PricingFeatureRow><PricingAnalysisIcon />Unlimited job match analyses</PricingFeatureRow>
              <PricingFeatureRow><PricingATSIcon />Unlimited ATS optimizations</PricingFeatureRow>
              <PricingFeatureRow><PricingLetterIcon />Unlimited cover letters</PricingFeatureRow>
              <PricingFeatureRow><PricingRocketIcon />Perfect for career transitions</PricingFeatureRow>
              <PricingFeatureRowHighlight><PricingStarIcon />Best value for 20+ analyses/month</PricingFeatureRowHighlight>
              <PricingFeatureRowMuted><PricingRefreshIcon />Credits never expire while subscribed</PricingFeatureRowMuted>
              <PricingFeatureRowMuted><PricingShieldIcon />Cancel anytime, no questions asked</PricingFeatureRowMuted>
            </PricingFeatureList>
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
