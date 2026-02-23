"use client";

import styled, { keyframes } from "styled-components";
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";
import { EmptyState } from "@/components/ui/EmptyState";
import { useToast } from "@/contexts/ToastContext";
import { Spinner } from "@/components/ui/Spinner";
import { CVListSkeleton } from "@/components/skeletons/CVListSkeleton";
import { useAuth } from "@/hooks/useAuth";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

// Icons
const UploadIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="17 8 12 3 7 8" />
    <line x1="12" y1="3" x2="12" y2="15" />
  </svg>
);

const DownloadIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="7 10 12 15 17 10" />
    <line x1="12" y1="15" x2="12" y2="3" />
  </svg>
);

const DeleteIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    <line x1="10" y1="11" x2="10" y2="17" />
    <line x1="14" y1="11" x2="14" y2="17" />
  </svg>
);


interface CVDocument {
  id: string;
  user_id: string;
  type: string;
  title: string;
  text: string;
  file_url: string;
  lang: string;
  created_at: string;
  updated_at: string;
  // ATS fields
  ats_score?: number | null;
  ats_breakdown?: any;
  ats_checked_at?: string | null;
  ats_unlocked?: boolean;
}

// ATS Score Icon
const ATSIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M9 11l3 3L22 4" />
    <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
  </svg>
);

// ATS Score Badge Component
const ATSScoreBadge = styled.div<{ $score: number }>`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
  
  color: ${({ $score }) => {
    if ($score >= 70) return 'var(--primary-500)';
    if ($score >= 41 && $score < 70) return '#2a57a0ff';
    if ($score <= 40) return '#f97316';
    return '#ef4444';
  }};
  
`;

const CheckATSButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px 12px;
  border: none;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  background: transparent;
  color: var(--text-secondary);

  &:hover {
    background: rgba(0, 0, 0, 0.05);
  }

  @media (prefers-color-scheme: dark) {
    &:hover {
      background: rgba(255, 255, 255, 0.08);
    }
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

interface OptimizedCV {
  id: string;
  user_id: string;
  report_id: string;
  original_cv_id: string | null;
  title: string;
  file_url: string;
  text: string;
  lang: string;
  created_at: string;
  updated_at: string;
  job_title?: string;
  fake_it_mode?: boolean;
  source?: string;
  before_score?: number;
  after_score?: number;
  contact_name?: string;
}

type CVItem =
  | CVDocument
  | (OptimizedCV & { isOptimized: true; reportId: string });

const PageContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 36px 28px;
  padding-bottom: 120px;

  @media (max-width: 768px) {
    padding: 84px 16px 120px;
  }
`;

const Header = styled.div`
  margin-bottom: 32px;
`;

const HeaderTop = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 24px;
  margin-bottom: 24px;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 16px;
  }
`;

const HeaderContent = styled.div`
  flex: 1;
`;

const Title = styled.h1`
  font-size: 34px;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.97);
  margin-bottom: 8px;
  letter-spacing: -0.04em;
  line-height: 1.1;

  @media (max-width: 768px) {
    font-size: 26px;
  }
`;

const Subtitle = styled.p`
  font-size: 15px;
  color: rgba(255, 255, 255, 0.4);
  line-height: 1.6;
  max-width: 500px;
  letter-spacing: -0.01em;
`;

// Content Section — Liquid Glass container
const ContentSection = styled.div`
  position: relative;
  border-radius: 24px;
  overflow: hidden;

  /* Liquid Glass */
  background: rgba(18, 18, 22, 0.55);
  backdrop-filter: blur(40px) saturate(180%);
  -webkit-backdrop-filter: blur(40px) saturate(180%);
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow:
    0 8px 40px rgba(0, 0, 0, 0.4),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);

  /* Specular top streak */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 10%;
    right: 10%;
    height: 1px;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.35) 50%,
      transparent
    );
    pointer-events: none;
    z-index: 1;
  }
`;

const ContentHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
    gap: 16px;
    padding: 16px;
  }
`;

const ContentBody = styled.div`
  padding: 24px;

  @media (max-width: 768px) {
    padding: 16px;
  }
`;

const CVGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  margin-bottom: ${({ theme }) => theme.spacing.lg};

  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 880px) {
    grid-template-columns: 1fr;
  }
`;

// Tab Navigation
type CVTabType = 'original' | 'ats-optimized' | 'job-matched';

/* Tab bar — floating pill matching marketing NavContainer */
const TabContainer = styled.div`
  display: flex;
  align-items: center;
  flex-shrink: 0;
  gap: 2px;
  padding: 4px;
  border-radius: 9999px;

  /* Liquid Glass pill */
  background: rgba(255, 255, 255, 0.06);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.08);

  @media (max-width: 768px) {
    width: 100%;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
    border-radius: 14px;

    &::-webkit-scrollbar {
      display: none;
    }
  }
`;

const TabButton = styled.button<{ $active: boolean }>`
  display: inline-flex;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;
  gap: 7px;
  padding: 7px 14px;
  border: none;
  border-radius: 9999px;
  font-size: 13.5px;
  font-weight: ${({ $active }) => ($active ? 600 : 500)};
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
  white-space: nowrap;
  letter-spacing: -0.01em;

  background: ${({ $active }) =>
    $active
      ? 'rgba(255,255,255,0.14)'
      : 'transparent'};
  color: ${({ $active }) =>
    $active ? 'rgba(255,255,255,0.97)' : 'rgba(255,255,255,0.45)'};

  /* Active: specular inner shine */
  box-shadow: ${({ $active }) =>
    $active
      ? 'inset 0 1px 0 rgba(255,255,255,0.2), 0 2px 8px rgba(0,0,0,0.3)'
      : 'none'};

  &:hover {
    color: rgba(255, 255, 255, 0.85);
    background: ${({ $active }) =>
      $active ? 'rgba(255,255,255,0.14)' : 'rgba(255,255,255,0.07)'};
  }

  svg {
    width: 15px;
    height: 15px;
    flex-shrink: 0;
    opacity: ${({ $active }) => ($active ? 1 : 0.55)};
    transition: opacity 0.15s ease;
  }

  &:hover svg {
    opacity: 0.9;
  }

  @media (max-width: 600px) {
    padding: 6px 11px;
    font-size: 13px;
    gap: 5px;

    svg { width: 13px; height: 13px; }
  }
`;

const TabCount = styled.span<{ $active: boolean }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 18px;
  height: 18px;
  padding: 0 5px;
  border-radius: 9999px;
  font-size: 10.5px;
  font-weight: 700;
  background: ${({ $active }) =>
    $active ? 'var(--accent)' : 'rgba(255,255,255,0.1)'};
  color: ${({ $active }) =>
    $active ? 'white' : 'rgba(255,255,255,0.45)'};

  @media (max-width: 600px) {
    min-width: 16px;
    height: 16px;
    font-size: 10px;
  }
`;

const TabEmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 24px;
  text-align: center;

  svg {
    width: 56px;
    height: 56px;
    color: var(--text-tertiary);
    margin-bottom: 20px;
    opacity: 0.5;
  }
`;

const TabEmptyTitle = styled.h3`
  font-size: 18px;
  font-weight: 600;
  color: var(--text-color);
  margin-bottom: 8px;
`;

const TabEmptyDescription = styled.p`
  font-size: 14px;
  color: var(--text-secondary);
  max-width: 360px;
  line-height: 1.6;
  margin-bottom: 20px;
`;

const TabEmptyAction = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  border: none;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  background: var(--accent);
  color: white;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
  }

  svg {
    width: 18px;
    height: 18px;
    margin: 0;
    opacity: 1;
  }
`;

// Tab Icons
const OriginalIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
  </svg>
);

const ATSIcon2 = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const JobIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0M12 12.75h.008v.008H12v-.008z" />
  </svg>
);

const CVCard = styled.div<{ $isOptimized?: boolean }>`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  overflow: hidden;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  height: 200px;

  /* Liquid Glass card */
  background: rgba(22, 22, 28, 0.6);
  backdrop-filter: blur(30px) saturate(160%);
  -webkit-backdrop-filter: blur(30px) saturate(160%);
  border: 1px solid rgba(255, 255, 255, 0.09);
  box-shadow:
    0 4px 24px rgba(0, 0, 0, 0.35),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);

  &:hover {
    transform: translateY(-5px) scale(1.01);
    border-color: rgba(255, 255, 255, 0.16);
    box-shadow:
      0 16px 48px rgba(0, 0, 0, 0.5),
      0 4px 16px rgba(0, 0, 0, 0.3),
      inset 0 1px 0 rgba(255, 255, 255, 0.16);
  }

  &:hover .cv-content {
    transform: translateY(-32px);
  }

  &:hover .cv-cta {
    transform: translateY(0);
    opacity: 1;
  }

  @media (max-width: 1024px) {
    height: 220px;
    &:hover .cv-content {
      transform: none;
    }
  }

  @media (max-width: 640px) {
    height: 220px;
  }
`;

// Background Animation Keyframes
const fadeInUp = keyframes`
  0% { opacity: 0; transform: translateY(12px); }
  100% { opacity: 1; transform: translateY(0); }
`;

const shimmer = keyframes`
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
`;

const CVCardBackgroundWrapper = styled.div`
  position: absolute;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
  mask-image: linear-gradient(to top, transparent 40%, #000 100%);
  -webkit-mask-image: linear-gradient(to top, transparent 40%, #000 100%);
`;

const ResumePreviewContainer = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;
  width: 140px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  z-index: 2;

  @media (max-width: 640px) {
    width: 120px;
    right: 8px;
  }
`;

const ResumePreviewCard = styled.div<{ $delay: number }>`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 10px;
  padding: 10px;
  animation: ${fadeInUp} 0.5s ease-out forwards;
  animation-delay: ${({ $delay }) => $delay}s;
  opacity: 0;
  filter: blur(0.4px);
  transition: all 0.2s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);

  &:hover {
    filter: blur(0);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
`;

const ResumeSection = styled.div`
  margin-bottom: 6px;

  &:last-child {
    margin-bottom: 0;
  }
`;

const ResumeSectionTitle = styled.div`
  font-size: 7px;
  font-weight: 700;
  color: var(--accent);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 3px;
`;

const ResumeLine = styled.div<{ $width?: string }>`
  height: 4px;
  width: ${({ $width }) => $width || '100%'};
  background: linear-gradient(
    90deg,
    rgba(var(--accent-rgb), 0.15) 0%,
    rgba(var(--accent-rgb), 0.25) 50%,
    rgba(var(--accent-rgb), 0.15) 100%
  );
  background-size: 200% 100%;
  animation: ${shimmer} 3s linear infinite;
  border-radius: 2px;
  margin-bottom: 3px;

  &:last-child {
    margin-bottom: 0;
  }
`;

interface CVCardBackgroundProps {
  text?: string;
  isOptimized?: boolean;
}

const CVCardBackgroundComponent = ({ isOptimized }: CVCardBackgroundProps) => {
  return (
    <CVCardBackgroundWrapper>
      <ResumePreviewContainer>
        <ResumePreviewCard $delay={0}>
          <ResumeSection>
            <ResumeSectionTitle>Contact</ResumeSectionTitle>
            <ResumeLine $width="80%" />
            <ResumeLine $width="60%" />
          </ResumeSection>
          <ResumeSection>
            <ResumeSectionTitle>Summary</ResumeSectionTitle>
            <ResumeLine />
            <ResumeLine $width="90%" />
            <ResumeLine $width="70%" />
          </ResumeSection>
        </ResumePreviewCard>

        <ResumePreviewCard $delay={0.15}>
          <ResumeSection>
            <ResumeSectionTitle>Experience</ResumeSectionTitle>
            <ResumeLine $width="85%" />
            <ResumeLine $width="95%" />
            <ResumeLine $width="60%" />
          </ResumeSection>
          <ResumeSection>
            <ResumeSectionTitle>Skills</ResumeSectionTitle>
            <ResumeLine $width="70%" />
            <ResumeLine $width="50%" />
          </ResumeSection>
        </ResumePreviewCard>

        {isOptimized && (
          <ResumePreviewCard $delay={0.3} style={{ borderColor: 'var(--success)', borderWidth: '2px' }}>
            <ResumeSection>
              <ResumeSectionTitle style={{ color: 'var(--success)' }}>Optimized</ResumeSectionTitle>
              <ResumeLine $width="100%" style={{ background: 'rgba(16, 185, 129, 0.2)' }} />
              <ResumeLine $width="80%" style={{ background: 'rgba(16, 185, 129, 0.15)' }} />
            </ResumeSection>
          </ResumePreviewCard>
        )}
      </ResumePreviewContainer>
    </CVCardBackgroundWrapper>
  );
};

const CVCardInner = styled.div`
  position: relative;
  z-index: 1;
  padding: 20px;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
`;

const CVCardContentInner = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  transform-origin: bottom left;
  transition: all 0.3s ease;

  @media (max-width: 1024px) {
    transform: none !important;
  }
`;

const CVCardIcon = styled.div<{ $isOptimized?: boolean }>`
  transform-origin: left;
  transition: all 0.3s ease;
  color: ${({ $isOptimized }) => $isOptimized ? 'var(--primary-500)' : 'var(--accent)'};
  margin-bottom: 8px;

  svg {
    width: 36px;
    height: 36px;
  }

  @media (max-width: 640px) {
    svg {
      width: 28px;
      height: 28px;
    }
  }
`;

const CVCardOverlay = styled.div`
  pointer-events: none;
  position: absolute;
  inset: 0;
  transition: all 0.3s ease;
`;

const CVCardTitle = styled.h3`
  font-size: 18px;
  font-weight: 600;
  color: var(--text-color);
  margin-top: 4px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

  @media (max-width: 640px) {
    font-size: 16px;
  }
`;

const CVCardMeta = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
`;

const CVCardDate = styled.p`
  color: var(--text-secondary);
  font-size: 14px;
`;

const CVCardJobInfo = styled.div`
  font-size: 14px;
  color: var(--text-secondary);
  line-height: 1.4;

  span {
    color: var(--text-secondary);
    font-weight: 500;
  }
`;

const CVCardTopBadge = styled.div`
  position: absolute;
  top: 12px;
  right: 12px;
  z-index: 3;
`;

const CTAContainer = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px;
  transform: translateY(40px);
  opacity: 0;
  transition: all 0.3s ease;

  @media (max-width: 1024px) {
    transform: translateY(0);
    opacity: 1;
    position: relative;
    padding: 12px 0 0 0;
    background: none;
  }
`;

const CTAActions = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const ActionButton = styled.button<{ $variant?: 'danger' }>`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px 12px;
  border: none;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  background: transparent;
  color: var(--text-secondary);

  &:hover {
    background: rgba(0, 0, 0, 0.05);
  }

  @media (prefers-color-scheme: dark) {
    &:hover {
      background: rgba(255, 255, 255, 0.08);
    }
  }

  ${({ $variant }) =>
    $variant === 'danger' &&
    `
    &:hover {
      background: rgba(239, 68, 68, 0.1);
      color: #ef4444;
    }
  `}
`;

const PreviewLink = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  color: var(--accent);
  font-weight: 500;
  font-size: 14px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  transition: all 0.2s ease;

  &:hover {
    text-decoration: underline;
  }

  svg {
    width: 16px;
    height: 16px;
    transition: transform 0.2s ease;
  }

  &:hover svg {
    transform: translateX(3px);
  }
`;

const ArrowRightIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={2}
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
    />
  </svg>
);

/* Upload Resume — Liquid Glass pill button */
const UploadButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 11px 22px;
  border-radius: 9999px;
  font-size: 14px;
  font-weight: 600;
  letter-spacing: -0.01em;
  cursor: pointer;
  transition: all 0.22s cubic-bezier(0.16, 1, 0.3, 1);
  white-space: nowrap;

  /* Liquid Glass red tint (matches FAB) */
  background: linear-gradient(
    180deg,
    rgba(255, 255, 255, 0.22) 0%,
    rgba(255, 255, 255, 0.0) 100%
  ), rgba(220, 60, 60, 0.55);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.28);
  color: white;
  box-shadow:
    inset 0 1.5px 0 rgba(255, 255, 255, 0.5),
    0 6px 24px rgba(220, 60, 60, 0.4),
    0 2px 8px rgba(0, 0, 0, 0.2);

  svg {
    width: 18px;
    height: 18px;
    flex-shrink: 0;
    filter: drop-shadow(0 1px 2px rgba(0,0,0,0.2));
  }

  &:hover {
    transform: translateY(-2px) scale(1.02);
    background: linear-gradient(
      180deg,
      rgba(255, 255, 255, 0.3) 0%,
      rgba(255, 255, 255, 0.0) 100%
    ), rgba(230, 70, 70, 0.72);
    box-shadow:
      inset 0 1.5px 0 rgba(255, 255, 255, 0.6),
      0 12px 36px rgba(220, 60, 60, 0.5),
      0 4px 12px rgba(0, 0, 0, 0.25);
  }

  &:active {
    transform: scale(0.97);
  }

  @media (max-width: 768px) {
    width: 100%;
  }
`;

const CVPreviewDrawer = styled.div<{ $isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1000;
  pointer-events: ${({ $isOpen }) => ($isOpen ? "auto" : "none")};
`;

const CVPreviewBackdrop = styled.div<{ $isOpen: boolean }>`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  opacity: ${({ $isOpen }) => ($isOpen ? 1 : 0)};
  transition: opacity 0.3s ease;
`;

const CVPreviewContent = styled.div<{ $isOpen: boolean }>`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  width: 1200px;
  max-width: 95vw;
  background: ${({ theme }) => theme.colors.surface};
  box-shadow: -4px 0 24px rgba(0, 0, 0, 0.12);
  display: flex;
  transform: translateX(${({ $isOpen }) => ($isOpen ? "0" : "100%")});
  transition: transform 0.35s cubic-bezier(0.4, 0, 0.2, 1);

  @media (max-width: 1024px) {
    width: 100vw;
    max-width: 100vw;
  }
`;

const CVPreviewSidebar = styled.div`
  width: 280px;
  border-right: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.background};
  display: flex;
  flex-direction: column;
  overflow: hidden;

  @media (max-width: 1024px) {
    display: none;
  }
`;

const CVPreviewSidebarHeader = styled.div`
  padding: ${({ theme }) => theme.spacing.lg};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.surface};
`;

const CVPreviewSidebarTitle = styled.h3`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.textSecondary};
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const CVPreviewSidebarList = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: ${({ theme }) => theme.spacing.sm};

  /* Custom scrollbar */
  &::-webkit-scrollbar {
    width: 4px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.colors.border};
    border-radius: 2px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: ${({ theme }) => theme.colors.textTertiary};
  }
`;

const CVPreviewSidebarItem = styled.div<{ $active: boolean; $isOptimized?: boolean }>`
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
  border-radius: ${({ theme }) => theme.radius.md};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};
  border-left: 1px solid ${({ $active, $isOptimized, theme }) =>
    $active
      ? $isOptimized
        ? "var(--primary-500)"
        : "var(--accent)"
      : "transparent"};
  background: ${({ $active, $isOptimized, theme }) =>
    $active
      ? $isOptimized
        ? "var(--primary-50)"
        : "var(--primary-50)"
      : theme.colors.surface};
  position: relative;

  &::before {
    content: "";
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 3px;
    background: ${({ $active, $isOptimized, theme }) =>
      $active
        ? $isOptimized
          ? "var(--success)"
          : "var(--accent)"
        : "transparent"};
    border-radius: ${({ theme }) => theme.radius.sm} 0 0 ${({ theme }) => theme.radius.sm};
    transition: all ${({ theme }) => theme.transitions.fast};
  }

  &:hover {
    background: ${({ $active, $isOptimized, theme }) =>
      $active
        ? $isOptimized
          ? "var(--success-light)"
          : "var(--primary-50)"
        : "rgba(0, 0, 0, 0.03)"};
    transform: translateX(2px);

    &::before {
      background: ${({ $active, $isOptimized, theme }) =>
        $active
          ? $isOptimized
            ? "var(--primary-500)"
            : "var(--accent)"
          : theme.colors.textTertiary};
    }
  }
`;

const CVPreviewSidebarItemTitle = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  color: ${({ theme }) => theme.colors.textPrimary};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const CVPreviewSidebarItemMeta = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.xs};
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const CVPreviewMain = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const CVPreviewHeader = styled.div`
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.lg};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.sm};
  flex-shrink: 0;
  background: ${({ theme }) => theme.colors.surface};

  @media (max-width: 768px) {
    padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  }
`;

const CVPreviewTitle = styled.h2`
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.textPrimary};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  flex: 1;

  @media (max-width: 768px) {
    font-size: ${({ theme }) => theme.typography.fontSize.base};
  }
`;

const CVPreviewTitleWrapper = styled.div`
  flex: 1;
  min-width: 0;
`;

const CVPreviewJobInfo = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  color: ${({ theme }) => theme.colors.textSecondary};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const CVPreviewActions = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.xs};
  flex-shrink: 0;
`;

const CVPreviewNavigation = styled.div`
  display: none;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  padding: ${({ theme }) => theme.spacing.sm};
  background: ${({ theme }) => theme.colors.background};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};

  @media (max-width: 1024px) {
    display: flex;
  }
`;

const CVPreviewNavButton = styled(Button)`
  min-width: 40px;
`;

const CVPreviewNavInfo = styled.div`
  flex: 1;
  text-align: center;
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const ChevronLeftIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="15 18 9 12 15 6" />
  </svg>
);

const ChevronRightIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="9 18 15 12 9 6" />
  </svg>
);

const CVPreviewBody = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: ${({ theme }) => theme.spacing.lg};
  background: ${({ theme }) => theme.colors.background};

  /* Custom scrollbar */
  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.colors.border};
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: ${({ theme }) => theme.colors.textTertiary};
  }
`;

const PDFContainer = styled.div`
  width: 100%;
  height: 100%;
  min-height: calc(100vh - 140px);
  background: white;
  border-radius: ${({ theme }) => theme.radius.md};
  box-shadow: ${({ theme }) => theme.shadow.md};
  overflow: hidden;

  iframe {
    width: 100%;
    height: 100%;
    border: none;
  }
`;

const CloseIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const HiddenInput = styled.input`
  display: none;
`;

export default function CVPage() {
  const [isUploading, setIsUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [allCVs, setAllCVs] = useState<CVItem[]>([]);
  const [previewCV, setPreviewCV] = useState<CVItem | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [cvToDelete, setCvToDelete] = useState<CVItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [checkingATSId, setCheckingATSId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<CVTabType>('original');
  const toast = useToast();
  const { user } = useAuth();
  const router = useRouter();

  // Filter CVs by category
  const originalCVs = allCVs.filter((cv) => !("isOptimized" in cv) || !cv.isOptimized);
  const atsOptimizedCVs = allCVs.filter((cv) => "isOptimized" in cv && cv.isOptimized && (cv as any).source === 'ats-optimizer');
  const jobMatchedCVs = allCVs.filter((cv) => "isOptimized" in cv && cv.isOptimized && (cv as any).source !== 'ats-optimizer');

  // Get filtered CVs based on active tab
  const getFilteredCVs = () => {
    switch (activeTab) {
      case 'original':
        return originalCVs;
      case 'ats-optimized':
        return atsOptimizedCVs;
      case 'job-matched':
        return jobMatchedCVs;
      default:
        return [];
    }
  };

  const filteredCVs = getFilteredCVs();

  // Handle ATS check
  const handleATSCheck = async (cv: CVDocument, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();

    setCheckingATSId(cv.id);
    try {
      const response = await fetch("/api/ats/check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ documentId: cv.id }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "ATS check failed");
      }

      // Update the CV in state with new ATS score
      setAllCVs((prev) =>
        prev.map((item) =>
          item.id === cv.id
            ? { ...item, ats_score: result.result.overallScore }
            : item
        )
      );

      // Navigate to ATS result page
      router.push(`/ats-check/${cv.id}`);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "ATS check failed";
      toast.error(errorMessage);
    } finally {
      setCheckingATSId(null);
    }
  };

  // Scroll active CV into view in sidebar
  useEffect(() => {
    if (previewCV) {
      const activeElement = document.getElementById(`sidebar-cv-${previewCV.id}`);
      if (activeElement) {
        activeElement.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }
    }
  }, [previewCV]);

  // Close drawer with ESC key, navigate with arrow keys, and prevent body scroll
  useEffect(() => {
    const handleKeyboard = (e: KeyboardEvent) => {
      if (!previewCV) return;

      if (e.key === "Escape") {
        setPreviewCV(null);
      } else if (e.key === "ArrowUp" || e.key === "ArrowDown") {
        e.preventDefault();
        const currentIndex = allCVs.findIndex((cv) => cv.id === previewCV.id);

        if (e.key === "ArrowUp" && currentIndex > 0) {
          setPreviewCV(allCVs[currentIndex - 1]);
        } else if (e.key === "ArrowDown" && currentIndex < allCVs.length - 1) {
          setPreviewCV(allCVs[currentIndex + 1]);
        }
      }
    };

    if (previewCV) {
      window.addEventListener("keydown", handleKeyboard);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      window.removeEventListener("keydown", handleKeyboard);
      document.body.style.overflow = "unset";
    };
  }, [previewCV, allCVs]);

  // Fetch all CVs (both original and optimized)
  useEffect(() => {
    async function fetchCVs() {
      if (!user) return;

      const supabase = createClient();

      // Fetch original CVs
      const { data: originalCVs } = await supabase
        .from("documents")
        .select("*")
        .eq("user_id", user.id)
        .eq("type", "cv")
        .order("created_at", { ascending: false });

      // Fetch optimized CVs from optimized_cvs table with report info
      const { data: optimizedCVs } = await supabase
        .from("optimized_cvs")
        .select(`
          *,
          reports:report_id (
            job_ids,
            fake_it_mode
          )
        `)
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      // Get job titles from documents for all job_ids
      const allJobIds = (optimizedCVs || [])
        .flatMap((cv: any) => cv.reports?.job_ids || [])
        .filter(Boolean);

      let jobTitlesMap: Record<string, string> = {};
      if (allJobIds.length > 0) {
        const { data: jobDocs } = await supabase
          .from("documents")
          .select("id, title")
          .in("id", allJobIds);

        if (jobDocs) {
          jobTitlesMap = Object.fromEntries(
            jobDocs.map((doc) => [doc.id, doc.title])
          );
        }
      }

      // Combine all lists (only original and optimized with PDFs)
      const combined: CVItem[] = [
        ...(originalCVs || []),
        ...(optimizedCVs || []).map((cv: any) => {
          const jobIds = cv.reports?.job_ids || [];
          const jobTitle = jobIds.map((id: string) => jobTitlesMap[id]).filter(Boolean).join(', ');
          return {
            ...cv,
            isOptimized: true as const,
            reportId: cv.report_id,
            job_title: jobTitle || undefined,
            fake_it_mode: cv.reports?.fake_it_mode || false,
            source: cv.source || 'reports',
          };
        }),
      ];

      // Sort by created_at desc
      combined.sort((a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );

      setAllCVs(combined);
      setIsLoading(false);
    }

    fetchCVs();
  }, [user]);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/cv/upload", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Upload failed");
      }

      toast.success("CV uploaded successfully!");

      // Refresh CV data
      const supabase = createClient();
      const { data } = await supabase
        .from("documents")
        .select("*")
        .eq("id", result.document.id)
        .single();

      if (data) {
        setAllCVs((prev) => [data, ...prev]);
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Upload failed";
      toast.error(errorMessage);
    } finally {
      setIsUploading(false);
      e.target.value = "";
    }
  };

  const handleUploadClick = () => {
    document.getElementById("cv-upload")?.click();
  };

  const handleDeleteClick = (cv: CVItem, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setCvToDelete(cv);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!cvToDelete) return;

    setIsDeleting(true);
    try {
      const supabase = createClient();
      const isOptimized = "isOptimized" in cvToDelete && cvToDelete.isOptimized;

      // Delete from appropriate table
      const { error } = await supabase
        .from(isOptimized ? "optimized_cvs" : "documents")
        .delete()
        .eq("id", cvToDelete.id);

      if (error) throw error;

      // If optimized CV, also clear generated_cv from reports table
      if (isOptimized && "reportId" in cvToDelete) {
        await supabase
          .from("reports")
          .update({
            generated_cv: null,
            optimized_score: null,
            improvement_breakdown: null
          })
          .eq("id", cvToDelete.reportId);
      }

      toast.success("CV deleted successfully!");
      setAllCVs((prev) => prev.filter((cv) => cv.id !== cvToDelete.id));

      // Close preview if the deleted CV is currently being previewed
      if (previewCV?.id === cvToDelete.id) {
        setPreviewCV(null);
      }

      setDeleteModalOpen(false);
      setCvToDelete(null);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to delete CV";
      toast.error(errorMessage);
    } finally {
      setIsDeleting(false);
    }
  };

  const getPublicUrl = (fileUrl: string): string => {
    // If already a full URL, return as is
    if (fileUrl.startsWith("http://") || fileUrl.startsWith("https://")) {
      return fileUrl;
    }

    // Otherwise, construct Supabase Storage public URL
    const supabase = createClient();
    const { data } = supabase.storage
      .from("cv-files")
      .getPublicUrl(fileUrl);

    return data.publicUrl;
  };

  const handleDownload = async (cv: CVItem) => {
    if (!cv?.file_url) return;

    try {
      const publicUrl = getPublicUrl(cv.file_url);
      const response = await fetch(publicUrl);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;

      let filename: string;

      // For optimized CVs, try to extract name from the CV data for ATS compatibility
      if ("isOptimized" in cv && cv.isOptimized) {
        let extractedName: string | null = null;

        // Try to get name from cv.text (JSON data)
        if (cv.text) {
          try {
            const cvData = JSON.parse(cv.text);
            if (cvData.contact?.name) {
              extractedName = cvData.contact.name;
            }
          } catch (e) {
            console.log("Failed to parse CV text:", e);
          }
        }

        // Fallback: extract name from title (e.g., "John Doe - Optimized CV" -> "John Doe")
        if (!extractedName && cv.title) {
          const titleMatch = cv.title.match(/^(.+?)\s*-\s*Optimized CV$/i);
          if (titleMatch) {
            extractedName = titleMatch[1].trim();
          }
        }

        if (extractedName) {
          filename = extractedName.replace(/\s+/g, "_") + ".pdf";
        } else {
          filename = (cv.title || "cv").replace(/\.pdf.*/i, "").replace(/ - Optimized CV$/i, "") + ".pdf";
        }
      } else {
        // Original CV - use title
        filename = (cv.title || "cv").replace(/\.pdf.*/i, "") + ".pdf";
      }

      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success("CV downloaded!");
    } catch (error) {
      toast.error("Failed to download CV");
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  if (isLoading) {
    return <CVListSkeleton />;
  }

  return (
    <PageContainer>
        <Header>
          <HeaderTop>
            <HeaderContent>
              <Title>My Resumes</Title>
              <Subtitle>
                Manage your resumes and track optimized versions across different job applications.
              </Subtitle>
            </HeaderContent>
            <UploadButton onClick={handleUploadClick} disabled={isUploading}>
              {isUploading ? (
                <>
                  <Spinner size="sm" /> Uploading...
                </>
              ) : (
                <>
                  <UploadIcon /> Upload Resume
                </>
              )}
            </UploadButton>
          </HeaderTop>

        </Header>

        <HiddenInput
          id="cv-upload"
          type="file"
          accept=".pdf,.docx"
          onChange={handleFileSelect}
          disabled={isUploading}
        />

        {allCVs.length === 0 ? (
          <Card variant="bordered">
            <EmptyState
              icon={<EmptyState.DocumentIcon />}
              title="No resumes yet"
              description="Upload your first resume to get started with job matching analysis and AI-powered optimization."
              action={{
                label: isUploading ? "Uploading..." : "Upload Your Resume",
                onClick: handleUploadClick,
              }}
            />
          </Card>
        ) : (
          <ContentSection>
            <ContentHeader>
              {/* Tab Navigation */}
              <TabContainer>
                <TabButton
                  $active={activeTab === 'original'}
                  onClick={() => setActiveTab('original')}
                >
                  <OriginalIcon />
                  Original
                  <TabCount $active={activeTab === 'original'}>{originalCVs.length}</TabCount>
                </TabButton>
                <TabButton
                  $active={activeTab === 'ats-optimized'}
                  onClick={() => setActiveTab('ats-optimized')}
                >
                  <ATSIcon2 />
                  ATS Optimized
                  <TabCount $active={activeTab === 'ats-optimized'}>{atsOptimizedCVs.length}</TabCount>
                </TabButton>
                <TabButton
                  $active={activeTab === 'job-matched'}
                  onClick={() => setActiveTab('job-matched')}
                >
                  <JobIcon />
                  Job Matched
                  <TabCount $active={activeTab === 'job-matched'}>{jobMatchedCVs.length}</TabCount>
                </TabButton>
              </TabContainer>
            </ContentHeader>

            <ContentBody>
              {/* CV Grid based on active tab */}
              {filteredCVs.length === 0 ? (
                <TabEmptyState>
                  {activeTab === 'original' && (
                    <>
                      <OriginalIcon />
                      <TabEmptyTitle>No original CVs yet</TabEmptyTitle>
                      <TabEmptyDescription>
                        Upload your resume to get started with job matching and ATS optimization.
                      </TabEmptyDescription>
                      <TabEmptyAction onClick={handleUploadClick}>
                        <UploadIcon /> Upload Resume
                      </TabEmptyAction>
                    </>
                  )}
                  {activeTab === 'ats-optimized' && (
                    <>
                      <ATSIcon2 />
                      <TabEmptyTitle>No ATS optimized CVs</TabEmptyTitle>
                      <TabEmptyDescription>
                        Run an ATS check on your original CV and click "Optimize" to create an ATS-friendly version.
                      </TabEmptyDescription>
                      <TabEmptyAction onClick={() => router.push('/ats-check')}>
                        <ATSIcon2 /> Check ATS Score
                      </TabEmptyAction>
                    </>
                  )}
                  {activeTab === 'job-matched' && (
                    <>
                      <JobIcon />
                      <TabEmptyTitle>No job matched CVs</TabEmptyTitle>
                      <TabEmptyDescription>
                        Generate a tailored CV from your job analysis reports to match specific positions.
                      </TabEmptyDescription>
                      <TabEmptyAction onClick={() => router.push('/reports')}>
                        <JobIcon /> View Reports
                      </TabEmptyAction>
                    </>
                  )}
                </TabEmptyState>
              ) : (
                <CVGrid>
                {filteredCVs.map((cv) => {
                  const isOptimized = "isOptimized" in cv && cv.isOptimized;
                  const optimizedCV = isOptimized ? cv as OptimizedCV & { isOptimized: true; reportId: string } : null;
                  const isATSOptimized = isOptimized && (cv as any).source === 'ats-optimizer';

                  return (
                    <CVCard key={cv.id} $isOptimized={isOptimized} onClick={() => setPreviewCV(cv)}>
                      <CVCardBackgroundComponent text={cv.text} isOptimized={isOptimized} />

                      {/* ATS Optimized score badge - top right */}
                      {isATSOptimized && optimizedCV?.before_score && optimizedCV?.after_score && (
                        <CVCardTopBadge>
                          <Badge size="sm" variant="success">
                            {optimizedCV.before_score} → {optimizedCV.after_score}
                          </Badge>
                        </CVCardTopBadge>
                      )}

                      <CVCardInner>
                        <CVCardContentInner className="cv-content">
                          <CVCardIcon $isOptimized={isOptimized} className="cv-icon">
                            {activeTab === 'original' && <OriginalIcon />}
                            {activeTab === 'ats-optimized' && <ATSIcon2 />}
                            {activeTab === 'job-matched' && <JobIcon />}
                          </CVCardIcon>
                          <CVCardTitle>
                            {isATSOptimized && optimizedCV?.contact_name ? optimizedCV.contact_name : cv.title}
                          </CVCardTitle>

                          {/* Job Matched: job info right after title */}
                          {activeTab === 'job-matched' && optimizedCV && optimizedCV.job_title && (
                            <CVCardJobInfo>
                              For: <span>{optimizedCV.job_title}</span>
                            </CVCardJobInfo>
                          )}

                          {/* Date at the bottom for all cards */}
                          <CVCardDate>{formatDate(cv.created_at)}</CVCardDate>

                          {/* Job Matched: Fake It badge */}
                          {activeTab === 'job-matched' && optimizedCV && optimizedCV.fake_it_mode && (
                            <CVCardMeta>
                              <Badge size="sm" variant="warning">Fake It</Badge>
                            </CVCardMeta>
                          )}
                        </CVCardContentInner>

                        <CTAContainer className="cv-cta" onClick={(e) => e.stopPropagation()}>
                          <PreviewLink
                            onClick={(e) => {
                              e.stopPropagation();
                              setPreviewCV(cv);
                            }}
                          >
                            Preview
                            <ArrowRightIcon />
                          </PreviewLink>
                          <CTAActions>
                            {/* ATS Score Badge or Check ATS Button - only for original CVs */}
                            {activeTab === 'original' && (
                              <>
                                {(cv as CVDocument).ats_score ? (
                                  <ATSScoreBadge
                                    $score={(cv as CVDocument).ats_score!}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      router.push(`/ats-check/${cv.id}`);
                                    }}
                                    style={{ cursor: 'pointer' }}
                                    title="View ATS Report"
                                  >
                                    ATS {(cv as CVDocument).ats_score}%
                                  </ATSScoreBadge>
                                ) : (
                                  <CheckATSButton
                                    onClick={(e) => handleATSCheck(cv as CVDocument, e)}
                                    disabled={checkingATSId === cv.id}
                                  >
                                    {checkingATSId === cv.id ? <Spinner size="sm" /> : "Check ATS"}
                                  </CheckATSButton>
                                )}
                              </>
                            )}
                            <ActionButton
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDownload(cv);
                              }}
                            >
                              <DownloadIcon />
                            </ActionButton>
                            <ActionButton
                              $variant="danger"
                              onClick={(e) => handleDeleteClick(cv, e)}
                            >
                              <DeleteIcon />
                            </ActionButton>
                          </CTAActions>
                        </CTAContainer>
                      </CVCardInner>
                      <CVCardOverlay className="cv-overlay" />
                    </CVCard>
                  );
                })}
              </CVGrid>
              )}
            </ContentBody>
          </ContentSection>
        )}

      {/* PDF Preview Drawer */}
      <CVPreviewDrawer $isOpen={!!previewCV}>
        <CVPreviewBackdrop
          $isOpen={!!previewCV}
          onClick={() => setPreviewCV(null)}
        />
        <CVPreviewContent $isOpen={!!previewCV}>
          {/* Sidebar with CV list */}
          <CVPreviewSidebar>
            <CVPreviewSidebarHeader>
              <CVPreviewSidebarTitle>All CVs ({allCVs.length})</CVPreviewSidebarTitle>
            </CVPreviewSidebarHeader>
            <CVPreviewSidebarList>
              {allCVs.map((cv) => {
                const isOptimized = "isOptimized" in cv && cv.isOptimized;
                const isATSOptimized = isOptimized && (cv as any).source === 'ats-optimizer';
                const isJobSpecific = isOptimized && (cv as any).source !== 'ats-optimizer';
                return (
                  <CVPreviewSidebarItem
                    id={`sidebar-cv-${cv.id}`}
                    key={cv.id}
                    $active={previewCV?.id === cv.id}
                    $isOptimized={isOptimized}
                    onClick={() => setPreviewCV(cv)}
                  >
                    <CVPreviewSidebarItemTitle>
                      {cv.title}
                    </CVPreviewSidebarItemTitle>
                    <CVPreviewSidebarItemMeta>
                      {isATSOptimized ? (
                        <span style={{ color: "var(--success)" }}>ATS Optimized</span>
                      ) : isJobSpecific ? (
                        <>
                          <span style={{ color: "var(--primary-500)" }}>Job-Specific</span>
                          {(cv as any).fake_it_mode && (
                            <>
                              <span>•</span>
                              <span style={{ color: "#f59e0b" }}>Fake It</span>
                            </>
                          )}
                        </>
                      ) : (
                        <span>Original</span>
                      )}
                    </CVPreviewSidebarItemMeta>
                  </CVPreviewSidebarItem>
                );
              })}
            </CVPreviewSidebarList>
          </CVPreviewSidebar>

          {/* Main preview area */}
          <CVPreviewMain>
            {/* Mobile navigation */}
            <CVPreviewNavigation>
              <CVPreviewNavButton
                variant="ghost"
                size="sm"
                onClick={() => {
                  const currentIndex = allCVs.findIndex((cv) => cv.id === previewCV?.id);
                  if (currentIndex > 0) {
                    setPreviewCV(allCVs[currentIndex - 1]);
                  }
                }}
                disabled={allCVs.findIndex((cv) => cv.id === previewCV?.id) === 0}
              >
                <ChevronLeftIcon />
              </CVPreviewNavButton>
              <CVPreviewNavInfo>
                {allCVs.findIndex((cv) => cv.id === previewCV?.id) + 1} / {allCVs.length}
              </CVPreviewNavInfo>
              <CVPreviewNavButton
                variant="ghost"
                size="sm"
                onClick={() => {
                  const currentIndex = allCVs.findIndex((cv) => cv.id === previewCV?.id);
                  if (currentIndex < allCVs.length - 1) {
                    setPreviewCV(allCVs[currentIndex + 1]);
                  }
                }}
                disabled={allCVs.findIndex((cv) => cv.id === previewCV?.id) === allCVs.length - 1}
              >
                <ChevronRightIcon />
              </CVPreviewNavButton>
            </CVPreviewNavigation>

            <CVPreviewHeader>
              <CVPreviewTitleWrapper>
                <CVPreviewTitle>
                  {previewCV?.title}
                  {"isOptimized" in (previewCV || {}) && (previewCV as any).isOptimized && (
                    <Badge size="sm" variant="success">
                       Optimized
                    </Badge>
                  )}
                  {"isOptimized" in (previewCV || {}) && (previewCV as any).fake_it_mode && (
                    <Badge size="sm" variant="warning">
                      🎭 Fake It
                    </Badge>
                  )}
                </CVPreviewTitle>
                {"isOptimized" in (previewCV || {}) && (previewCV as any).job_title && (
                  <CVPreviewJobInfo>
                    <span>Created for:</span>
                    <strong style={{ color: 'var(--primary-500)' }}>{(previewCV as any).job_title}</strong>
                  </CVPreviewJobInfo>
                )}
              </CVPreviewTitleWrapper>
              <CVPreviewActions>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => previewCV && handleDownload(previewCV)}
                >
                  <DownloadIcon /> Download
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setPreviewCV(null)}
                >
                  <CloseIcon />
                </Button>
              </CVPreviewActions>
            </CVPreviewHeader>
            <CVPreviewBody>
              {previewCV && (
                <PDFContainer>
                  <iframe
                    src={`${getPublicUrl(previewCV.file_url)}#toolbar=0`}
                    title="CV Preview"
                  />
                </PDFContainer>
              )}
            </CVPreviewBody>
          </CVPreviewMain>
        </CVPreviewContent>
      </CVPreviewDrawer>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={() => !isDeleting && setDeleteModalOpen(false)}
        title="Delete CV"
        size="sm"
      >
        <Modal.Body>
          <div style={{ padding: "16px 0" }}>
            <p style={{ marginBottom: "12px", fontSize: "15px", lineHeight: "1.6" }}>
              Are you sure you want to delete <strong>{cvToDelete?.title}</strong>?
              This action cannot be undone.
            </p>
            <p style={{ color: "#dc2626", fontSize: "14px", fontWeight: 500 }}>
              ⚠️ All reports associated with this CV will remain, but the CV file will be permanently removed.
            </p>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="ghost"
            onClick={() => setDeleteModalOpen(false)}
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleDeleteConfirm}
            isLoading={isDeleting}
            style={{
              background: "linear-gradient(135deg, #dc2626 0%, #991b1b 100%)",
              border: "none",
            }}
          >
            {isDeleting ? "Deleting..." : "Delete CV"}
          </Button>
        </Modal.Footer>
      </Modal>
    </PageContainer>
  );
}
