"use client";

import styled, { keyframes } from "styled-components";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { Badge } from "@/components/ui/Badge";
import { JobsListSkeleton } from "@/components/skeletons/JobsListSkeleton";
import { useState, useEffect, useRef, useId } from "react";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { useToast } from "@/contexts/ToastContext";
import { useAuth } from "@/hooks/useAuth";
import { createClient } from "@/lib/supabase/client";
import { AnimatePresence, LayoutGroup, motion } from "motion/react";
import { useClickOutside } from "@/hooks/useClickOutside";

// Icons
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

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 36px ${({ theme }) => theme.spacing["2xl"]} 120px;

  @media (max-width: 768px) {
    padding: 70px 16px 120px;
  }
`;

const Header = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing["xl"]};
`;

const HeaderContent = styled.div``;

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
  letter-spacing: -0.01em;
`;

const JobsList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
  gap: 16px;

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg};
`;

// Expanded card styled components
const ExpandedCardContainer = styled(motion.div)`
  width: 100%;
  max-width: 600px;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  background-color: ${({ theme }) => theme.colors.backgroundAlt2};
  border-radius: ${({ theme }) => theme.radius.lg};
  box-shadow: ${({ theme }) => theme.shadow.xl};
  overflow: hidden;
`;

const ExpandedCardHeader = styled.div`
  padding: ${({ theme }) => theme.spacing.lg};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

const ExpandedCardBody = styled.div`
  padding: ${({ theme }) => theme.spacing.lg};
  overflow-y: auto;
  flex: 1;
`;

const ExpandedCardFooter = styled.div`
  padding: ${({ theme }) => theme.spacing.lg};
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  display: flex;
  justify-content: flex-end;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const ExpandedFormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
`;

// Job card with motion - Bento style
const JobCardWrapper = styled(motion.div)`
  cursor: pointer;
`;

const JobCardInner = styled.div`
  position: relative;
  overflow: hidden;
  border-radius: 20px;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);

  /* Liquid Glass card — stronger contrast */
  background: rgba(30, 30, 40, 0.78);
  backdrop-filter: blur(30px) saturate(160%);
  -webkit-backdrop-filter: blur(30px) saturate(160%);
  border: 1px solid rgba(255, 255, 255, 0.14);
  box-shadow:
    0 2px 1px rgba(255, 255, 255, 0.06) inset,
    0 8px 32px rgba(0, 0, 0, 0.55),
    0 2px 8px rgba(0, 0, 0, 0.4);

  &:hover {
    transform: translateY(-5px) scale(1.01);
    border-color: rgba(255, 255, 255, 0.22);
    box-shadow:
      0 2px 1px rgba(255, 255, 255, 0.08) inset,
      0 20px 56px rgba(0, 0, 0, 0.65),
      0 6px 20px rgba(0, 0, 0, 0.45);
  }

  &:hover .job-content {
    transform: translateY(-32px);
  }

  &:hover .job-cta {
    transform: translateY(0);
    opacity: 1;
  }

  @media (max-width: 1024px) {
    &:hover .job-content {
      transform: none;
    }
  }
`;

// Background Animation Keyframes
const floatAnimation = keyframes`
  0%, 100% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-8px) rotate(1deg); }
`;

const fadeInUp = keyframes`
  0% { opacity: 0; transform: translateY(12px); }
  100% { opacity: 1; transform: translateY(0); }
`;

const scrollTextAnimation = keyframes`
  0% { transform: translateY(0); }
  100% { transform: translateY(-50%); }
`;

const JobCardBackgroundWrapper = styled.div`
  position: absolute;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
  /* Fade bottom like CV cards — preview is at top-right */
  mask-image: linear-gradient(to top, transparent 35%, #000 100%);
  -webkit-mask-image: linear-gradient(to top, transparent 35%, #000 100%);
`;

const KeywordCloud = styled.div`
  position: absolute;
  top: 12px;
  left: 12px;
  right: 12px;
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  z-index: 2;
  opacity: 0.4
`;

const KeywordBadge = styled.span<{ $delay: number; $variant?: 'primary' | 'secondary' }>`
  font-size: 9px;
  font-weight: 600;
  padding: 4px 8px;
  border-radius: 6px;
  background: ${({ $variant }) =>
    $variant === 'primary'
      ? 'rgba(var(--accent-rgb), 0.12)'
      : 'rgba(var(--accent-rgb), 0.06)'};
  color: ${({ $variant }) =>
    $variant === 'primary'
      ? 'var(--accent)'
      : 'var(--text-secondary)'};
  animation: ${fadeInUp} 0.5s ease-out forwards;
  animation-delay: ${({ $delay }) => $delay}s;
  opacity: 0;
  filter: blur(0.3px);
  transition: all 0.2s ease;
  white-space: nowrap;

  &:hover {
    filter: blur(0);
    transform: translateY(-2px);
  }
`;

const TextScrollContainer = styled.div`
  position: absolute;
  top: 50px;
  left: 10px;
  right: 10px;
  bottom: 0;
  overflow: hidden;
  z-index: 1;
  opacity: 0.3;
`;

const ScrollingTextTrack = styled.div`
  animation: ${scrollTextAnimation} 40s linear infinite;
`;

const ScrollingTextLine = styled.div<{ $delay: number }>`
  font-size: 9px;
  line-height: 1.6;
  color: var(--text-secondary);
  padding: 2px 0;
  animation: ${fadeInUp} 0.4s ease-out forwards;
  animation-delay: ${({ $delay }) => $delay}s;

  &:nth-child(odd) {
    transform: translateX(8px);
  }
`;

const FloatingIcon = styled.div<{ $delay: number; $position: 'topRight' | 'bottomLeft' }>`
  position: absolute;
  ${({ $position }) => $position === 'topRight' ? 'top: 8px; right: 8px;' : 'bottom: 60px; left: 8px;'}
  width: 28px;
  height: 28px;
  border-radius: 8px;
  background: rgba(var(--accent-rgb), 0.08);
  display: flex;
  align-items: center;
  justify-content: center;
  /* animation removed — static icon only */
  z-index: 3;

  svg {
    width: 14px;
    height: 14px;
    color: var(--accent);
    opacity: 0.6;
  }
`;

/* ── CV-style document preview frame for job cards ── */
const JobPreviewContainer = styled.div`
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

const JobPreviewCard = styled.div<{ $delay: number }>`
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  padding: 10px;
  animation: ${fadeInUp} 0.5s ease-out forwards;
  animation-delay: ${({ $delay }) => $delay}s;
  opacity: 0;
  filter: blur(0.4px);
  transition: all 0.2s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
`;

const JobPreviewSection = styled.div`
  margin-bottom: 6px;
  &:last-child { margin-bottom: 0; }
`;

const JobPreviewSectionTitle = styled.div`
  font-size: 7px;
  font-weight: 700;
  color: var(--accent);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 3px;
`;

const JobPreviewLine = styled.div<{ $width?: string }>`
  height: 4px;
  width: ${({ $width }) => $width || '100%'};
  background: linear-gradient(
    90deg,
    rgba(var(--accent-rgb), 0.15) 0%,
    rgba(var(--accent-rgb), 0.25) 50%,
    rgba(var(--accent-rgb), 0.15) 100%
  );
  background-size: 200% 100%;
  border-radius: 2px;
  margin-bottom: 3px;
  &:last-child { margin-bottom: 0; }
`;

// Helper function to extract keywords from text
const extractKeywords = (text: string): string[] => {
  const commonWords = new Set([
    'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with',
    'by', 'from', 'as', 'is', 'was', 'are', 'were', 'been', 'be', 'have', 'has', 'had',
    'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might', 'must',
    'shall', 'can', 'need', 'dare', 'ought', 'used', 'this', 'that', 'these', 'those',
    'i', 'you', 'he', 'she', 'it', 'we', 'they', 'what', 'which', 'who', 'whom',
    'your', 'our', 'their', 'its', 'his', 'her', 'my', 'our', 'if', 'then', 'else',
    'when', 'where', 'why', 'how', 'all', 'each', 'every', 'both', 'few', 'more',
    'most', 'other', 'some', 'such', 'no', 'nor', 'not', 'only', 'own', 'same', 'so',
    'than', 'too', 'very', 'just', 'about', 'into', 'through', 'during', 'before',
    'after', 'above', 'below', 'between', 'under', 'again', 'further', 'once', 'here',
    'there', 'any', 'also', 'etc', 'including', 'within', 'across', 'along', 'among',
  ]);

  const words = text.toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter(word => word.length > 3 && !commonWords.has(word));

  const wordCount: Record<string, number> = {};
  words.forEach(word => {
    wordCount[word] = (wordCount[word] || 0) + 1;
  });

  return Object.entries(wordCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([word]) => word.charAt(0).toUpperCase() + word.slice(1));
};

interface JobCardBackgroundProps {
  text: string;
}

const JobCardBackgroundComponent = ({ text }: JobCardBackgroundProps) => {
  const keywords = extractKeywords(text);
  const lines = text.split(/[.!?\n]+/).filter(line => line.trim().length > 20).slice(0, 12);

  return (
    <JobCardBackgroundWrapper>
      {/* Document preview frame — top right, same style as CV cards */}
      <JobPreviewContainer>
        <JobPreviewCard $delay={0}>
          <JobPreviewSection>
            <JobPreviewSectionTitle>Requirements</JobPreviewSectionTitle>
            <JobPreviewLine $width="80%" />
            <JobPreviewLine $width="60%" />
          </JobPreviewSection>
          <JobPreviewSection>
            <JobPreviewSectionTitle>Responsibilities</JobPreviewSectionTitle>
            <JobPreviewLine />
            <JobPreviewLine $width="90%" />
            <JobPreviewLine $width="70%" />
          </JobPreviewSection>
        </JobPreviewCard>

        <JobPreviewCard $delay={0.15}>
          <JobPreviewSection>
            <JobPreviewSectionTitle>Skills</JobPreviewSectionTitle>
            <JobPreviewLine $width="85%" />
            <JobPreviewLine $width="65%" />
          </JobPreviewSection>
          <JobPreviewSection>
            <JobPreviewSectionTitle>Experience</JobPreviewSectionTitle>
            <JobPreviewLine $width="95%" />
            <JobPreviewLine $width="55%" />
          </JobPreviewSection>
        </JobPreviewCard>
      </JobPreviewContainer>

      {/* Keyword cloud — left side, pushed right so it doesn't overlap frame */}
      <KeywordCloud style={{ right: '160px' }}>
        {keywords.map((keyword, idx) => (
          <KeywordBadge
            key={idx}
            $delay={idx * 0.08}
            $variant={idx < 3 ? 'primary' : 'secondary'}
          >
            {keyword}
          </KeywordBadge>
        ))}
      </KeywordCloud>

      <TextScrollContainer style={{ right: '160px' }}>
        <ScrollingTextTrack>
          {[...lines, ...lines].map((line, idx) => (
            <ScrollingTextLine key={idx} $delay={idx * 0.05}>
              {line.trim().slice(0, 60)}...
            </ScrollingTextLine>
          ))}
        </ScrollingTextTrack>
      </TextScrollContainer>
    </JobCardBackgroundWrapper>
  );
};

const JobCardContent = styled.div`
  position: relative;
  z-index: 1;
  padding: 24px;
  display: flex;
  flex-direction: column;
  min-height: 200px;
  justify-content: flex-end;
`;

const ContentInner = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  transform-origin: bottom left;
  transition: all 0.3s ease;

  @media (max-width: 1024px) {
    transform: none !important;
  }
`;

const JobCardOverlay = styled.div`
  pointer-events: none;
  position: absolute;
  inset: 0;
  transition: all 0.3s ease;
`;

const CardTitleWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: start;
`;

const CardTitleContent = styled.div``;

const CTAContainer = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: 16px 20px;
  transform: translateY(100%);
  opacity: 0;
  transition: all 0.3s ease;
  background: linear-gradient(to top, rgba(22, 22, 28, 0.95) 60%, transparent);
  gap: 8px;

  @media (max-width: 768px) {
    transform: translateY(0);
    opacity: 1;
    position: relative;
    padding-top: 12px;
    background: none;
  }
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
    background: rgba(var(--accent-rgb), 0.1);
    color: var(--accent);
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

/* ── Jobs FAB — Liquid Glass, matches dashboard FAB ── */
const JobFAB = styled.button`
  position: fixed;
  bottom: 32px;
  right: 32px;
  width: 60px;
  height: 60px;
  border-radius: 9999px;
  z-index: 90;

  background: linear-gradient(
    180deg,
    rgba(255, 255, 255, 0.22) 0%,
    rgba(255, 255, 255, 0.0) 100%
  ), rgba(220, 60, 60, 0.38);
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.22s cubic-bezier(0.16, 1, 0.3, 1);

  box-shadow:
    inset 0 1.5px 0 rgba(255, 255, 255, 0.55),
    0 8px 32px rgba(220, 60, 60, 0.5),
    0 2px 8px rgba(0, 0, 0, 0.25);

  &:hover {
    transform: scale(1.08) translateY(-3px);
    background: linear-gradient(
      180deg,
      rgba(255, 255, 255, 0.3) 0%,
      rgba(255, 255, 255, 0.0) 100%
    ), rgba(230, 70, 70, 0.58);
    box-shadow:
      inset 0 1.5px 0 rgba(255, 255, 255, 0.65),
      0 16px 48px rgba(220, 60, 60, 0.55),
      0 4px 16px rgba(0, 0, 0, 0.3);
  }

  &:active { transform: scale(0.96); }

  svg {
    width: 26px;
    height: 26px;
    filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.3));
  }

  @media (max-width: 768px) {
    bottom: 24px;
    right: 20px;
    width: 56px;
    height: 56px;
  }
`;

const PlusIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

/* ── Liquid Glass empty state (Jobs) ── */
const floatOrbJ = keyframes`
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  33%       { transform: translateY(-16px) rotate(3deg); }
  66%       { transform: translateY(8px) rotate(-2deg); }
`;

const JobsEmptyHero = styled.div`
  position: relative;
  border-radius: 28px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0;
  padding: 36px 40px 44px;
  text-align: center;

  background:
    radial-gradient(ellipse 70% 50% at 50% 0%, rgba(102, 126, 234, 0.12) 0%, transparent 70%),
    rgba(16, 16, 22, 0.60);
  backdrop-filter: blur(48px) saturate(180%);
  -webkit-backdrop-filter: blur(48px) saturate(180%);
  border: 1px solid rgba(255,255,255,0.10);
  box-shadow:
    inset 0 1px 0 rgba(255,255,255,0.12),
    0 32px 80px rgba(0,0,0,0.5);

  @media (max-width: 768px) {
    padding: 32px 20px 40px;
  }
`;

const JobsOrbA = styled.div`
  position: absolute;
  width: 340px; height: 340px;
  border-radius: 50%;
  top: -70px; right: -50px;
  background: radial-gradient(circle, rgba(102, 126, 234, 0.14) 0%, transparent 70%);
  animation: ${floatOrbJ} 9s ease-in-out infinite;
  pointer-events: none;
`;

const JobsOrbB = styled.div`
  position: absolute;
  width: 260px; height: 260px;
  border-radius: 50%;
  bottom: -50px; left: -30px;
  background: radial-gradient(circle, rgba(var(--accent-rgb), 0.10) 0%, transparent 70%);
  animation: ${floatOrbJ} 12s ease-in-out infinite reverse;
  pointer-events: none;
`;

const JobsHeroSpecular = styled.div`
  position: absolute;
  top: 0; left: 15%; right: 15%;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.40) 50%, transparent);
  pointer-events: none;
`;

const JobsHeroIconBadge = styled.div`
  width: 80px; height: 80px;
  border-radius: 24px;
  margin-bottom: 22px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;

  background:
    linear-gradient(145deg, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0.04) 100%),
    rgba(102, 126, 234, 0.22);
  border: 1px solid rgba(255,255,255,0.22);
  box-shadow:
    inset 0 1.5px 0 rgba(255,255,255,0.55),
    0 8px 28px rgba(102, 126, 234, 0.32),
    0 3px 10px rgba(0,0,0,0.35);

  svg {
    width: 36px; height: 36px;
    color: rgba(255,255,255,0.92);
    filter: drop-shadow(0 1px 4px rgba(102, 126, 234, 0.55));
  }
`;

const JobsHeroTitle = styled.h2`
  font-size: 26px;
  font-weight: 800;
  letter-spacing: -0.04em;
  line-height: 1.15;
  margin-bottom: 10px;
  color: rgba(255,255,255,0.95);

  @media (max-width: 768px) { font-size: 22px; }
`;

const JobsHeroSubtitle = styled.p`
  font-size: 14px;
  color: rgba(255,255,255,0.42);
  line-height: 1.60;
  max-width: 420px;
  margin: 0 auto 24px;
  letter-spacing: -0.01em;
`;

const JobsStepsRow = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 0;
  width: 100%;
  max-width: 580px;
  margin-bottom: 28px;
  position: relative;

  @media (max-width: 640px) {
    flex-direction: column;
    align-items: center;
    gap: 12px;
  }
`;

const JobsStepConnector = styled.div`
  flex: 1;
  height: 1px;
  background: linear-gradient(90deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.06) 100%);
  margin-top: 22px;
  @media (max-width: 640px) { display: none; }
`;

const JobsStep = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  flex-shrink: 0;
  width: 130px;

  @media (max-width: 640px) {
    width: 100%; max-width: 260px;
    flex-direction: row; text-align: left;
    align-items: center;
  }
`;

const JobsStepNum = styled.div<{ $n: 1 | 2 | 3 }>`
  width: 44px; height: 44px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  font-weight: 800;
  flex-shrink: 0;

  background: ${({ $n }) => {
    switch ($n) {
      case 1: return 'rgba(102, 126, 234, 0.18)';
      case 2: return 'rgba(var(--accent-rgb), 0.18)';
      case 3: return 'rgba(16, 185, 129, 0.18)';
    }
  }};
  border: 1px solid ${({ $n }) => {
    switch ($n) {
      case 1: return 'rgba(102, 126, 234, 0.35)';
      case 2: return 'rgba(var(--accent-rgb), 0.35)';
      case 3: return 'rgba(16, 185, 129, 0.35)';
    }
  }};
  color: ${({ $n }) => {
    switch ($n) {
      case 1: return '#818cf8';
      case 2: return 'var(--accent)';
      case 3: return '#34d399';
    }
  }};
`;

const JobsStepText = styled.div`
  font-size: 11.5px;
  font-weight: 600;
  color: rgba(255,255,255,0.48);
  letter-spacing: 0.01em;
  line-height: 1.45;
  text-align: center;
  @media (max-width: 640px) { text-align: left; }
`;

const JobsCTAButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 16px 36px;
  border-radius: 9999px;
  cursor: pointer;
  font-size: 15px;
  font-weight: 700;
  letter-spacing: -0.01em;
  border: none;
  color: white;
  transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);

  background: linear-gradient(
    135deg, rgba(255,255,255,0.22) 0%, rgba(255,255,255,0.0) 100%
  ), rgba(102, 126, 234, 0.80);
  backdrop-filter: blur(20px);
  box-shadow:
    inset 0 1.5px 0 rgba(255,255,255,0.55),
    0 8px 32px rgba(102, 126, 234, 0.45),
    0 2px 8px rgba(0,0,0,0.3);

  &:hover {
    transform: translateY(-3px) scale(1.02);
    box-shadow:
      inset 0 1.5px 0 rgba(255,255,255,0.70),
      0 16px 56px rgba(102, 126, 234, 0.55),
      0 4px 16px rgba(0,0,0,0.35);
  }
  &:active { transform: scale(0.98); }
  svg { width: 20px; height: 20px; flex-shrink: 0; }
`;

const JobsCTASecondary = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 14px 28px;
  border-radius: 9999px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  letter-spacing: -0.01em;
  color: rgba(255,255,255,0.60);
  border: 1px solid rgba(255,255,255,0.12);
  background: rgba(255,255,255,0.05);
  backdrop-filter: blur(16px);
  transition: all 0.2s ease;

  &:hover {
    color: rgba(255,255,255,0.85);
    background: rgba(255,255,255,0.10);
    border-color: rgba(255,255,255,0.22);
  }
`;

const JobsCTARow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
  justify-content: center;
`;

// Backdrop
const Backdrop = styled(motion.div)`
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 100;
`;

const ExpandedCardOverlay = styled.div`
  position: fixed;
  inset: 0;
  display: grid;
  place-items: center;
  z-index: 101;
  padding: ${({ theme }) => theme.spacing.lg};
`;

const CloseButton = styled(motion.button)`
  position: absolute;
  top: 12px;
  right: 12px;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 102;

  &:hover {
    background-color: ${({ theme }) => theme.colors.surfaceHover};
  }

  svg {
    width: 16px;
    height: 16px;
    color: ${({ theme }) => theme.colors.textSecondary};
  }
`;

/* ── Add Job Modal — Liquid Glass internals ── */
const ModalIconBadge = styled.div`
  width: 52px;
  height: 52px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 12px;

  background:
    linear-gradient(145deg, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0.04) 100%),
    rgba(102, 126, 234, 0.22);
  border: 1px solid rgba(255,255,255,0.22);
  box-shadow:
    inset 0 1.5px 0 rgba(255,255,255,0.50),
    0 6px 20px rgba(102, 126, 234, 0.28),
    0 2px 8px rgba(0,0,0,0.30);

  svg {
    width: 24px;
    height: 24px;
    color: rgba(255,255,255,0.92);
    filter: drop-shadow(0 1px 3px rgba(102, 126, 234, 0.50));
  }
`;

const ModalHeaderInner = styled.div`
  padding: 28px 28px 0;
  display: flex;
  flex-direction: column;
  align-items: flex-start;

  @media (max-width: 640px) { padding: 24px 20px 0; }
`;

const ModalHeadTitle = styled.h2`
  font-size: 20px;
  font-weight: 800;
  letter-spacing: -0.035em;
  color: rgba(255,255,255,0.96);
  margin: 0 0 4px;
`;

const ModalHeadSub = styled.p`
  font-size: 13px;
  color: rgba(255,255,255,0.38);
  letter-spacing: -0.01em;
  margin: 0;
`;

const ModalCloseBtn = styled.button`
  position: absolute;
  top: 20px;
  right: 20px;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255,255,255,0.08);
  border: 1px solid rgba(255,255,255,0.10);
  color: rgba(255,255,255,0.50);
  cursor: pointer;
  transition: all 0.18s ease;

  &:hover {
    background: rgba(255,255,255,0.14);
    color: rgba(255,255,255,0.85);
  }
  svg { width: 16px; height: 16px; }
`;

const InputModeToggle = styled.div`
  display: flex;
  background: rgba(255,255,255,0.06);
  border: 1px solid rgba(255,255,255,0.09);
  border-radius: 12px;
  padding: 3px;
  gap: 2px;
  margin-bottom: 20px;
`;

const InputModeTab = styled.button<{ $active: boolean }>`
  flex: 1;
  padding: 8px 0;
  border: none;
  border-radius: 9px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.18s cubic-bezier(0.16, 1, 0.3, 1);
  letter-spacing: -0.01em;

  background: ${({ $active }) => $active
    ? 'linear-gradient(135deg, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0.08) 100%)'
    : 'transparent'};
  color: ${({ $active }) => $active ? 'rgba(255,255,255,0.92)' : 'rgba(255,255,255,0.40)'};
  box-shadow: ${({ $active }) => $active
    ? 'inset 0 1px 0 rgba(255,255,255,0.25), 0 2px 8px rgba(0,0,0,0.20)'
    : 'none'};

  &:hover {
    color: ${({ $active }) => $active ? 'rgba(255,255,255,0.92)' : 'rgba(255,255,255,0.65)'};
  }
`;

const GlassInput = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const GlassLabel = styled.label`
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: rgba(255,255,255,0.40);
`;

const GlassField = styled.input`
  width: 100%;
  padding: 13px 16px;
  background: rgba(255,255,255,0.06);
  border: 1px solid rgba(255,255,255,0.10);
  border-radius: 14px;
  font-size: 14px;
  font-weight: 500;
  color: rgba(255,255,255,0.90);
  outline: none;
  transition: all 0.18s ease;
  box-sizing: border-box;

  &::placeholder { color: rgba(255,255,255,0.22); }

  &:focus {
    border-color: rgba(102, 126, 234, 0.55);
    background: rgba(102, 126, 234, 0.08);
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.15);
  }
`;

const GlassTextarea = styled.textarea`
  width: 100%;
  padding: 13px 16px;
  background: rgba(255,255,255,0.06);
  border: 1px solid rgba(255,255,255,0.10);
  border-radius: 14px;
  font-size: 14px;
  font-weight: 500;
  color: rgba(255,255,255,0.90);
  outline: none;
  transition: all 0.18s ease;
  resize: none;
  font-family: inherit;
  box-sizing: border-box;
  min-height: 160px;

  &::placeholder { color: rgba(255,255,255,0.22); }
  scrollbar-width: none;
  &::-webkit-scrollbar { display: none; }

  &:focus {
    border-color: rgba(102, 126, 234, 0.55);
    background: rgba(102, 126, 234, 0.08);
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.15);
  }
`;

const GlassHelperText = styled.p`
  font-size: 11.5px;
  color: rgba(255,255,255,0.25);
  margin: 0;
  letter-spacing: -0.01em;
`;

const ModalFormBody = styled.div`
  padding: 24px 28px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  overflow-y: auto;
  scrollbar-width: none;
  &::-webkit-scrollbar { display: none; }

  @media (max-width: 640px) { padding: 20px; }
`;

const ModalGlassFooter = styled.div`
  padding: 16px 28px 24px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 10px;
  border-top: 1px solid rgba(255,255,255,0.06);

  @media (max-width: 640px) {
    padding: 14px 20px 20px;
    flex-direction: column-reverse;
    > button { width: 100%; }
  }
`;

const ModalPrimaryBtn = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 28px;
  border-radius: 9999px;
  border: none;
  cursor: pointer;
  font-size: 14px;
  font-weight: 700;
  letter-spacing: -0.01em;
  color: white;
  transition: all 0.22s cubic-bezier(0.16, 1, 0.3, 1);

  background: linear-gradient(
    135deg, rgba(255,255,255,0.22) 0%, rgba(255,255,255,0) 100%
  ), rgba(102, 126, 234, 0.85);
  box-shadow:
    inset 0 1.5px 0 rgba(255,255,255,0.55),
    0 6px 24px rgba(102, 126, 234, 0.42),
    0 2px 6px rgba(0,0,0,0.25);

  &:hover:not(:disabled) {
    transform: translateY(-2px) scale(1.02);
    box-shadow:
      inset 0 1.5px 0 rgba(255,255,255,0.65),
      0 12px 36px rgba(102, 126, 234, 0.52),
      0 3px 10px rgba(0,0,0,0.28);
  }
  &:active { transform: scale(0.97); }
  &:disabled { opacity: 0.55; cursor: not-allowed; }
`;

const ModalGhostBtn = styled.button`
  display: inline-flex;
  align-items: center;
  padding: 12px 20px;
  border-radius: 9999px;
  border: 1px solid rgba(255,255,255,0.10);
  background: rgba(255,255,255,0.05);
  color: rgba(255,255,255,0.50);
  font-size: 14px;
  font-weight: 600;
  letter-spacing: -0.01em;
  cursor: pointer;
  transition: all 0.18s ease;

  &:hover {
    background: rgba(255,255,255,0.09);
    color: rgba(255,255,255,0.80);
    border-color: rgba(255,255,255,0.18);
  }
`;

interface Job {
  id: string;
  user_id: string;
  type: string;
  title: string;
  text: string;
  file_url: string | null;
  created_at: string;
}

export default function JobsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [inputMode, setInputMode] = useState<'url' | 'paste'>('paste');
  const [jobTitle, setJobTitle] = useState("");
  const [jobUrl, setJobUrl] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingJobs, setIsFetchingJobs] = useState(true);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [deletingJobId, setDeletingJobId] = useState<string | null>(null);

  // Expandable card state
  const [activeJob, setActiveJob] = useState<Job | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editUrl, setEditUrl] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [isEditLoading, setIsEditLoading] = useState(false);

  const expandedCardRef = useRef<HTMLDivElement>(null);
  const id = useId();
  const toast = useToast();
  const { user } = useAuth();

  // Handle escape key and body scroll
  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setActiveJob(null);
      }
    }

    if (activeJob) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [activeJob]);

  // Click outside to close
  useClickOutside(expandedCardRef, () => setActiveJob(null));

  // Fetch jobs on mount
  useEffect(() => {
    async function fetchJobs() {
      if (!user) return;

      setIsFetchingJobs(true);
      const supabase = createClient();
      const { data } = await supabase
        .from("documents")
        .select("*")
        .eq("user_id", user.id)
        .eq("type", "job")
        .order("created_at", { ascending: false });

      if (data) {
        setJobs(data);
      }

      setIsFetchingJobs(false);
    }

    fetchJobs();
  }, [user]);

  const openAddModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setJobTitle("");
    setJobUrl("");
    setJobDescription("");
  };

  const handleOpenEdit = (job: Job, e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveJob(job);
    setEditTitle(job.title);
    setEditUrl(job.file_url || "");
    setEditDescription(job.text);
  };

  const handleCloseEdit = () => {
    setActiveJob(null);
    setEditTitle("");
    setEditUrl("");
    setEditDescription("");
  };

  const handleSubmit = async () => {
    if (!jobTitle || (!jobUrl && !jobDescription)) {
      toast.error("Please fill in job title and description");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("/api/jobs/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: jobTitle,
          url: jobUrl || null,
          description: jobDescription || null,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Operation failed");
      }

      toast.success("Job posting added!");

      // Refresh jobs list
      const supabase = createClient();
      const { data } = await supabase
        .from("documents")
        .select("*")
        .eq("user_id", user?.id)
        .eq("type", "job")
        .order("created_at", { ascending: false });

      if (data) {
        setJobs(data);
      }

      closeModal();
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Operation failed";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditSubmit = async () => {
    if (!editTitle || (!editUrl && !editDescription)) {
      toast.error("Please fill in job title and description");
      return;
    }

    if (!activeJob) return;

    setIsEditLoading(true);
    try {
      const response = await fetch("/api/jobs/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          jobId: activeJob.id,
          title: editTitle,
          url: editUrl || null,
          description: editDescription || null,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Update failed");
      }

      toast.success("Job posting updated!");

      // Refresh jobs list
      const supabase = createClient();
      const { data } = await supabase
        .from("documents")
        .select("*")
        .eq("user_id", user?.id)
        .eq("type", "job")
        .order("created_at", { ascending: false });

      if (data) {
        setJobs(data);
      }

      handleCloseEdit();
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Update failed";
      toast.error(errorMessage);
    } finally {
      setIsEditLoading(false);
    }
  };

  const handleDeleteClick = (jobId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setDeletingJobId(jobId);
  };

  const handleConfirmDelete = async () => {
    if (!deletingJobId) return;

    try {
      const supabase = createClient();
      const { error: deleteError } = await supabase
        .from("documents")
        .delete()
        .eq("id", deletingJobId);

      if (deleteError) throw deleteError;

      toast.success("Job posting deleted");
      setJobs(jobs.filter((job) => job.id !== deletingJobId));
      setDeletingJobId(null);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to delete job posting";
      toast.error(errorMessage);
    }
  };

  const handleCancelDelete = () => {
    setDeletingJobId(null);
  };

  if (isFetchingJobs) {
    return <JobsListSkeleton />;
  }

  return (
    <Container>
      <Header>
        <HeaderContent>
          <Title>Job Postings</Title>
          <Subtitle>Manage job postings to compare with your resume</Subtitle>
        </HeaderContent>
      </Header>

      <LayoutGroup>
        {/* Backdrop */}
        <AnimatePresence>
        {activeJob && (
          <Backdrop
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
        )}
      </AnimatePresence>

      {/* Expanded Card */}
      <AnimatePresence mode="popLayout">
        {activeJob && (
          <ExpandedCardOverlay>
            <CloseButton
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, transition: { duration: 0.05 } }}
              onClick={handleCloseEdit}
            >
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
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </CloseButton>
            <ExpandedCardContainer
              layoutId={`card-${activeJob.id}-${id}`}
              ref={expandedCardRef}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              <ExpandedCardHeader>
                <motion.h3
                  layout
                  layoutId={`title-${activeJob.id}-${id}`}
                  style={{
                    fontSize: "1.25rem",
                    fontWeight: 600,
                    marginBottom: "4px",
                    margin: 0,
                  }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                >
                  {activeJob.title}
                </motion.h3>
                <motion.p
                  layout
                  layoutId={`description-${activeJob.id}-${id}`}
                  style={{
                    fontSize: "0.875rem",
                    color: "#6b7280",
                    margin: 0,
                    marginTop: "4px",
                  }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                >
                  Added on{" "}
                  {new Date(activeJob.created_at).toLocaleDateString("tr-TR")}
                </motion.p>
              </ExpandedCardHeader>
              <ExpandedCardBody>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <ExpandedFormGroup>
                    <Input
                      label="Job Title"
                      placeholder="e.g. Senior Frontend Developer"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      required
                      fullWidth
                    />
                    <Input
                      label="Job URL (Optional)"
                      type="url"
                      placeholder="https://..."
                      value={editUrl}
                      onChange={(e) => setEditUrl(e.target.value)}
                      helperText="We'll extract the job description automatically"
                      fullWidth
                    />
                    <Textarea
                      label="Job Description"
                      placeholder="Paste the full job description here..."
                      value={editDescription}
                      onChange={(e) => setEditDescription(e.target.value)}
                      rows={8}
                      fullWidth
                      helperText={`${editDescription.length} characters`}
                    />
                  </ExpandedFormGroup>
                </motion.div>
              </ExpandedCardBody>
              <ExpandedCardFooter>
                <Button variant="ghost" onClick={handleCloseEdit}>
                  Cancel
                </Button>
                <Button onClick={handleEditSubmit} isLoading={isEditLoading}>
                  Update Job
                </Button>
              </ExpandedCardFooter>
            </ExpandedCardContainer>
          </ExpandedCardOverlay>
        )}
      </AnimatePresence>

      {jobs.length === 0 ? (
        <JobsEmptyHero>
          <JobsOrbA />
          <JobsOrbB />
          <JobsHeroSpecular />

          <JobsHeroIconBadge>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/>
              <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/>
            </svg>
          </JobsHeroIconBadge>

          <JobsHeroTitle>Save your first job posting</JobsHeroTitle>
          <JobsHeroSubtitle>
            Paste a job description or add a URL — then run an AI match analysis against your CV to see how well you fit.
          </JobsHeroSubtitle>

          <JobsStepsRow>
            <JobsStep>
              <JobsStepNum $n={1}>1</JobsStepNum>
              <JobsStepText>Add a job posting by URL or paste the description</JobsStepText>
            </JobsStep>
            <JobsStepConnector />
            <JobsStep>
              <JobsStepNum $n={2}>2</JobsStepNum>
              <JobsStepText>Run a Job Match analysis against your CV</JobsStepText>
            </JobsStep>
            <JobsStepConnector />
            <JobsStep>
              <JobsStepNum $n={3}>3</JobsStepNum>
              <JobsStepText>Get your score and an ATS-optimized CV</JobsStepText>
            </JobsStep>
          </JobsStepsRow>

          <JobsCTARow>
            <JobsCTAButton onClick={openAddModal}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              Add Job Posting
            </JobsCTAButton>
            <JobsCTASecondary onClick={() => window.open('https://www.linkedin.com/jobs/', '_blank')}>
              Browse on LinkedIn
            </JobsCTASecondary>
          </JobsCTARow>
        </JobsEmptyHero>
      ) : (
        <JobsList>
          {jobs.map((job) => (
            <JobCardWrapper
              key={job.id}
              layoutId={`card-${job.id}-${id}`}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              <JobCardInner>
                <JobCardBackgroundComponent text={job.text} />
                <JobCardContent>
                  <ContentInner className="job-content">
                    <CardTitleWrapper>
                      <CardTitleContent>
                        <motion.h3
                          layout
                          layoutId={`title-${job.id}-${id}`}
                          style={{
                            fontSize: "1.125rem",
                            fontWeight: 600,
                            margin: 0,
                            color: "var(--text-color)",
                          }}
                          transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        >
                          {job.title}
                        </motion.h3>
                        <motion.p
                          layout
                          layoutId={`description-${job.id}-${id}`}
                          style={{
                            fontSize: "0.875rem",
                            color: "var(--text-secondary)",
                            margin: 0,
                            marginTop: "4px",
                          }}
                          transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        >
                          Added on{" "}
                          {new Date(job.created_at).toLocaleDateString("tr-TR")}
                        </motion.p>
                      </CardTitleContent>
                      <Badge>{job.text.length.toLocaleString()} chars</Badge>
                    </CardTitleWrapper>
                  </ContentInner>
                  <CTAContainer className="job-cta" onClick={(e) => e.stopPropagation()}>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => handleOpenEdit(job, e)}
                    >
                      Edit
                    </Button>
                    <ActionButton
                      $variant="danger"
                      onClick={(e) => handleDeleteClick(job.id, e)}
                    >
                      <DeleteIcon />
                    </ActionButton>
                  </CTAContainer>
                </JobCardContent>
                <JobCardOverlay className="job-overlay" />
              </JobCardInner>
            </JobCardWrapper>
          ))}
        </JobsList>
      )}
      </LayoutGroup>

      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        showCloseButton={false}
      >
        {/* Custom header */}
        <div style={{ position: 'relative' }}>
          <ModalHeaderInner>
            <ModalIconBadge>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/>
                <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/>
              </svg>
            </ModalIconBadge>
            <ModalHeadTitle>Add Job Posting</ModalHeadTitle>
            <ModalHeadSub>Paste a description or add a URL to extract automatically</ModalHeadSub>
          </ModalHeaderInner>
          <ModalCloseBtn onClick={closeModal} aria-label="Close">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M18 6L6 18M6 6l12 12"/>
            </svg>
          </ModalCloseBtn>
        </div>

        <ModalFormBody>
          {/* Job Title */}
          <GlassInput>
            <GlassLabel>Job Title</GlassLabel>
            <GlassField
              type="text"
              placeholder="e.g. Senior Frontend Developer"
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
            />
          </GlassInput>

          {/* Input Mode Toggle */}
          <InputModeToggle>
            <InputModeTab $active={inputMode === 'paste'} onClick={() => setInputMode('paste')}>
              Paste Description
            </InputModeTab>
            <InputModeTab $active={inputMode === 'url'} onClick={() => setInputMode('url')}>
              Add URL
            </InputModeTab>
          </InputModeToggle>

          {/* Conditional input */}
          {inputMode === 'url' ? (
            <GlassInput>
              <GlassLabel>Job URL</GlassLabel>
              <GlassField
                type="url"
                placeholder="https://linkedin.com/jobs/view/..."
                value={jobUrl}
                onChange={(e) => setJobUrl(e.target.value)}
              />
              <GlassHelperText>We’ll extract the job description automatically</GlassHelperText>
            </GlassInput>
          ) : (
            <GlassInput>
              <GlassLabel>Job Description</GlassLabel>
              <GlassTextarea
                placeholder="Paste the full job description here — requirements, responsibilities, qualifications..."
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                rows={10}
              />
              <GlassHelperText>{jobDescription.length.toLocaleString()} characters</GlassHelperText>
            </GlassInput>
          )}
        </ModalFormBody>

        <ModalGlassFooter>
          <ModalGhostBtn onClick={closeModal}>Cancel</ModalGhostBtn>
          <ModalPrimaryBtn onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? 'Adding...' : 'Add Job Posting'}
          </ModalPrimaryBtn>
        </ModalGlassFooter>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deletingJobId !== null}
        onClose={handleCancelDelete}
        title="Delete Job Posting"
        description="Are you sure you want to delete this job posting?"
      >
        <Modal.Body>
          <p style={{ color: "#6b7280", fontSize: "14px", lineHeight: "1.6" }}>
            This action cannot be undone. The job posting will be permanently
            removed from your account.
          </p>
          {deletingJobId && (
            <p
              style={{
                marginTop: "12px",
                fontWeight: "600",
                color: "#1f2937",
                fontSize: "14px",
              }}
            >
              Job: {jobs.find((j) => j.id === deletingJobId)?.title}
            </p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="ghost" onClick={handleCancelDelete}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleConfirmDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>

      {/* ── Add Job FAB ── */}
      <JobFAB onClick={openAddModal} title="Add Job Posting">
        <PlusIcon />
      </JobFAB>
    </Container>
  );
}
