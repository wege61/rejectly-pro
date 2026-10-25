"use client";

import styled, { keyframes } from "styled-components";
import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { ROUTES } from "@/lib/constants";
import { Footer } from "@/components/ui/Footer";
import { SecondaryCTA } from "@/components/marketing/SecondaryCTA";
import { FeaturedGuides } from "@/components/marketing/FeaturedGuides";
import { Hero } from "@/components/marketing/hero/Hero";
import { HeroHighlight, Highlight } from "@/components/ui/HeroHighlight";
import { WhyItHappens } from "@/components/marketing/why/WhyItHappens";
import { TryIt } from "@/components/marketing/try/TryIt";
import { ToolsTour } from "@/components/marketing/tools/ToolsTour";
import { Proof } from "@/components/marketing/proof/Proof";
import { Pricing } from "@/components/marketing/pricing/Pricing";

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

const SectionHeader = styled.header`
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
const DemoSectionWrapper = styled.section`
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
  gap: 24px;
  position: relative;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
    gap: 16px;
  }
`;

const CompactLabelRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
`;

const CompactLabel = styled.div`
  font-size: 13px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  font-weight: 700;
  color: var(--text-secondary);
  display: flex;
  align-items: center;
  gap: 8px;

  svg {
    width: 16px;
    height: 16px;
  }
`;

const DemoInputSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0;
  height: 100%;
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

const CTASection = styled.section`
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

const FeatureCard = styled.article`
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

const TestimonialCard = styled.article`
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
  display: flex;
  align-items: center;
  margin-left: auto;
  margin-right: auto;
  gap: 6px;
  background: rgba(78, 180, 175, 0.08);
  border: 1px solid rgba(34, 197, 94, 0.2);
  color: var(--text-color);

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

const PricingCard = styled.article<{ $featured?: boolean }>`
  background: ${({ $featured }) => $featured ? "rgba(255, 255, 255, 0.04)" : "rgba(255, 255, 255, 0.02)"};
  backdrop-filter: blur(40px) saturate(200%);
  -webkit-backdrop-filter: blur(40px) saturate(200%);
  border: 1px solid ${({ $featured }) => $featured ? "rgba(255, 255, 255, 0.2)" : "rgba(255, 255, 255, 0.08)"};
  border-radius: 24px;
  padding: 40px;
  position: relative;
  transform: ${({ $featured }) => $featured 
    ? "scale(1.05)"
    : "scale(1)"};

  transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
  box-shadow: ${({ $featured }) => $featured 
    ? "inset 0 1px 1px rgba(255, 255, 255, 0.2), 0 12px 40px rgba(0, 0, 0, 0.4), 0 0 30px rgba(255, 255, 255, 0.03)"
    : "inset 0 1px 1px rgba(255, 255, 255, 0.15), 0 4px 24px rgba(0, 0, 0, 0.3)"};

  &:hover {
    background: ${({ $featured }) => $featured ? "rgba(255, 255, 255, 0.06)" : "rgba(255, 255, 255, 0.04)"};
    border-color: ${({ $featured }) => $featured ? "rgba(255, 255, 255, 0.3)" : "rgba(255, 255, 255, 0.15)"};
    box-shadow: ${({ $featured }) => $featured 
      ? "inset 0 1px 2px rgba(255, 255, 255, 0.3), 0 16px 48px rgba(0, 0, 0, 0.5), 0 0 40px rgba(255, 255, 255, 0.05)"
      : "inset 0 1px 2px rgba(255, 255, 255, 0.2), 0 8px 32px rgba(0, 0, 0, 0.4)"};
  }

  @media (max-width: 768px) {
    padding: 32px;
  }
`;

const PricingBadge = styled.div`
  position: absolute;
  top: -14px;
  left: 50%;
  transform: translateX(-50%);
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.95), rgba(255, 255, 255, 0.75));
  backdrop-filter: blur(10px);
  color: #000;
  padding: 8px 20px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 700;
  white-space: nowrap;
  box-shadow: 0 4px 12px rgba(255, 255, 255, 0.15), inset 0 1px 1px #fff;
  border: 1px solid rgba(255, 255, 255, 0.5);
  letter-spacing: 0.5px;
  text-transform: uppercase;
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
const FAQSectionWrapper = styled.section`
  position: relative;
  isolation: isolate;
  
  /* Ambient Apple Aurora Background */
  &::before {
    content: '';
    position: absolute;
    top: 20%;
    left: 10%;
    width: 60%;
    height: 60%;
    background: radial-gradient(circle, rgba(94, 234, 212, 0.15) 0%, transparent 60%);
    filter: blur(100px);
    z-index: -1;
    pointer-events: none;
    border-radius: 50%;
  }

  &::after {
    content: '';
    position: absolute;
    bottom: 0%;
    right: 10%;
    width: 50%;
    height: 50%;
    background: radial-gradient(circle, rgba(14, 165, 233, 0.12) 0%, transparent 60%);
    filter: blur(80px);
    z-index: -1;
    pointer-events: none;
    border-radius: 50%;
  }
`;

const FAQList = styled.div`
  max-width: 800px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 16px;
  position: relative;
  z-index: 10;
`;

const FAQItem = styled.div<{ $isOpen?: boolean }>`
  background: rgba(150, 150, 150, 0.05);
  backdrop-filter: blur(20px) saturate(150%);
  -webkit-backdrop-filter: blur(20px) saturate(150%);
  border-radius: 16px;
  overflow: hidden;
  transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: inset 0 1px 1px rgba(255, 255, 255, 0.05), 0 4px 12px rgba(0, 0, 0, 0.1);

  ${({ $isOpen }) =>
    $isOpen &&
    `
    background: rgba(150, 150, 150, 0.08);
    border-color: rgba(255, 255, 255, 0.15);
    box-shadow: inset 0 1px 1px rgba(255, 255, 255, 0.1), 0 8px 24px rgba(0, 0, 0, 0.2);
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
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  font-size: 18px;
  font-weight: 300;
  color: ${({ $isOpen }) => ($isOpen ? "var(--bg-color)" : "var(--text-secondary)")};
  background: ${({ $isOpen }) => ($isOpen ? "var(--text-color)" : "rgba(255, 255, 255, 0.05)")};
  transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
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
  margin: 80px 0 100px;
  width: 100%;
  padding: 0 24px;
  box-sizing: border-box;
`;

const ProvocationHeader = styled.div`
  text-align: center;
  margin-bottom: 64px;

  .eyebrow {
    display: block;
    font-size: 11px;
    text-transform: uppercase;
    letter-spacing: 3px;
    font-weight: 600;
    color: #ff453a;
    margin-bottom: 16px;
  }

  h3 {
    font-size: clamp(28px, 4vw, 44px);
    font-weight: 700;
    color: var(--text-color);
    letter-spacing: -0.025em;
    line-height: 1.1;
    margin-bottom: 16px;
    max-width: 680px;
    margin-left: auto;
    margin-right: auto;
  }

  p {
    font-size: 16px;
    color: var(--text-secondary);
    line-height: 1.6;
    max-width: 500px;
    margin: 0 auto;
    font-weight: 400;
  }
`;

const ContrastGrid = styled.div`
  max-width: 840px;
  margin: 0 auto;
  border-radius: 18px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  overflow: hidden;
  display: grid;
  grid-template-columns: 1fr;

  @media (min-width: 768px) {
    grid-template-columns: 1fr 1fr;
  }
`;

const BaseColumn = styled.div`
  padding: 48px 40px;
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;

  @media (max-width: 768px) {
    padding: 36px 28px;
  }
`;

const OldWayColumn = styled(BaseColumn)`
  background: transparent;

  @media (min-width: 768px) {
    border-right: 1px solid rgba(255, 255, 255, 0.06);
  }

  @media (max-width: 767px) {
    border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  }

  .title {
    font-size: 12px;
    text-transform: uppercase;
    letter-spacing: 2.5px;
    color: rgba(255, 255, 255, 0.3);
    font-weight: 600;
    margin-bottom: 28px;
  }

  .price {
    font-size: 56px;
    font-weight: 700;
    color: rgba(255, 255, 255, 0.18);
    letter-spacing: -0.04em;
    line-height: 1;
    margin-bottom: 36px;
    text-decoration: line-through;
    text-decoration-color: rgba(255, 69, 58, 0.35);
    text-decoration-thickness: 2px;

    span {
      font-size: 18px;
      font-weight: 400;
      letter-spacing: 0;
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
      gap: 10px;
      font-size: 14px;
      color: rgba(255, 255, 255, 0.25);
      letter-spacing: -0.01em;

      svg {
        width: 15px;
        height: 15px;
        color: rgba(255, 69, 58, 0.35);
        flex-shrink: 0;
      }
    }
  }
`;

const RejectlyColumn = styled(BaseColumn)`
  background: rgba(255, 255, 255, 0.04);

  .glow {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: var(--accent);
    pointer-events: none;
  }

  .title {
    font-size: 12px;
    text-transform: uppercase;
    letter-spacing: 2.5px;
    color: var(--accent);
    font-weight: 600;
    margin-bottom: 28px;
    position: relative;
    z-index: 1;
  }

  .price {
    font-size: 64px;
    font-weight: 700;
    color: var(--text-color);
    letter-spacing: -0.04em;
    line-height: 1;
    margin-bottom: 36px;
    position: relative;
    z-index: 1;

    span {
      font-size: 18px;
      font-weight: 400;
      color: var(--text-secondary);
      letter-spacing: 0;
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
      gap: 10px;
      font-size: 14px;
      color: var(--text-color);
      letter-spacing: -0.01em;
      line-height: 1.45;

      svg {
        width: 15px;
        height: 15px;
        color: var(--accent);
        flex-shrink: 0;
        margin-top: 1px;
      }
    }
  }
`;

const ProvocativeCTA = styled.div`
  text-align: center;
  margin-top: 56px;

  p {
    font-size: 15px;
    font-weight: 400;
    color: var(--text-secondary);
    letter-spacing: -0.01em;
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
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const faqs = [
    {
      question: "I have no professional experience. Will this work for me?",
      answer:
        "Yes! Our AI is specifically trained to translate academic projects, hackathons, and extracurriculars into the corporate keywords ATS systems are looking for. You don't need 3 years of experience if you have the right keywords.",
    },
    {
      question: "Does this actually bypass ATS systems?",
      answer:
        "Yes. By identifying the exact keywords in the job description and weaving them into your generated resume, we drastically increase your match score and help you bypass automatic rejection filters.",
    },
    {
      question: "What's included in every analysis?",
      answer:
        "Every analysis gives you the exact ATS match score, reveals the missing keywords, and provides a completely AI-optimized resume tailored specifically for that single job description.",
    },
    {
      question: "How does pricing work?",
      answer:
        "We offer flexible options: Single ($2) for 1 analysis, Starter ($7) for 10 analyses at best value, or Pro ($12/month) for unlimited access to the ATS bypass tools. Credits never expire!",
    },
    {
      question: "What file formats do you support?",
      answer:
        "We support PDF and DOCX formats. You can also paste text directly for analysis. Maximum file size is 5MB.",
    },
    {
      question: "Is my data secure?",
      answer:
        "Absolutely! All your data is encrypted and stored securely. We never share your information with third parties or employers.",
    },
  ];


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
            url: 'https://rejectly.pro',
            logo: 'https://rejectly.pro/logo.png',
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
      {/* WebSite schema is rendered site-wide by <WebSiteSchema /> in the root layout — do not duplicate it here */}
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
            description: 'AI-powered resume optimization tool that analyzes your resume against job postings, identifies ATS compatibility issues, and provides actionable improvements to increase interview rates.',
            featureList: [
              'AI Resume Analysis',
              'ATS Optimization',
              'Job Matching Algorithm',
              'Cover Letter Generator',
              'Keyword Targeting',
              'Resume Rewriting',
            ],
            screenshot: 'https://rejectly.pro/screenshot.png',
          })
        }}
      />
      <Container>
      {/* HERO SECTION */}
      <Hero />

      {/* WHY IT HAPPENS */}
      <WhyItHappens />

      {/* TRY IT */}
      <TryIt />

      {/* SIX TOOLS */}
      <ToolsTour />

      {/* PROOF */}
      <Proof />

      {/* PRICING */}
      <Pricing />

      <Divider />

      {/* FAQ */}
      <Section id="faq">
        <FAQSectionWrapper>
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
        </FAQSectionWrapper>
      </Section>

      <Divider />

      {/* SECONDARY CTA SECTION */}
      <FeaturedGuides />

      <SecondaryCTA />

      <Footer />
    </Container>
    </>
  );
}
