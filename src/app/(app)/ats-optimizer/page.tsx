"use client";

import { createClient } from "@/lib/supabase/client";
import { useToast } from "@/contexts/ToastContext";
import styled, { keyframes, css } from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useCallback, useEffect } from "react";
import { useCredits } from "@/contexts/CreditsContext";
import { useRouter } from "next/navigation";
import { CreditsCard } from "@/components/dashboard/CreditsCard";
import {
  analyzeScore,
  getCategoryImpact,
  getCategoryImpactEmoji,
  generateQuickFixes,
  type CategoryScore,
} from "@/lib/ats/scoring";
import { ATSFullResult } from "@/components/ats";
import { useCreditConfirm } from "@/hooks/useCreditConfirm";
import { useAuth } from "@/hooks/useAuth";
import { LoadingModal } from "@/components/ui/LoadingModal";
import { FileUpload } from "@/components/ui/FileUpload";
import { CVCustomizationModal } from "@/components/features/CVCustomizationModal";
import { CVCustomizationOptions } from "@/types/cvCustomization";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/Spinner";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { HistoryGridSkeleton } from "@/components/skeletons/HistoryGridSkeleton";

// Common Icons
const ArrowRightIcon = () => (
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
    <path d="M5 12h14M12 5l7 7-7 7" />
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

const DownloadIcon = () => (
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
     <polyline points="7 10 12 15 17 10" />
     <line x1="12" y1="15" x2="12" y2="3" />
   </svg>
);



const PlusIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={2.5}
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 4.5v15m7.5-7.5h-15"
    />
  </svg>
);

type Step = "upload" | "analyzing" | "result" | "optimizing" | "optimized";

interface CVDocument {
  id: string;
  user_id: string;
  type: string;
  title: string;
  text: string;
  file_url: string;
  lang: string;
  created_at: string;
  ats_score?: number | null;
}

interface ATSResult {
  overallScore: number;
  scoreLabel?: string;
  summary: string;
  categories: {
    format: CategoryResult;
    structure: CategoryResult;
    keywords: CategoryResult;
    readability: CategoryResult;
  };
  topIssues: { severity: string; issue: string; suggestion: string; category?: string }[];
  quickWins: string[];
  metadata?: {
    wordCount: number;
    estimatedPages?: number;
    detectedSections?: string[];
    hasContactInfo?: {
      email: boolean;
      phone: boolean;
      linkedin: boolean;
      location: boolean;
    };
    keywordStats?: {
      hardSkillsCount: number;
      softSkillsCount: number;
      actionVerbsCount: number;
      quantifiedAchievements: number;
    };
  };
  metricQuestions?: { id: string; original_bullet: string; question: string }[] | null;
  atsCompatibility?: {
    workday: string;
    greenhouse: string;
    taleo: string;
    lever: string;
  };
  parsingChecks?: {
    singleColumn: { ok: boolean; note: string };
    standardSections: { ok: boolean; note: string };
    cleanCharacters: { ok: boolean; note: string };
    abbreviations: { ok: boolean; note: string };
  };
}

interface CategoryResult {
  name?: string;
  earnedPoints: number;
  maxPoints: number;
  percentage?: number;
  issues: { issue: string; impact?: string; severity?: string; fix?: string }[];
  passes: string[];
}

interface OptimizationResult {
  success: boolean;
  pdfUrl: string;
  beforeScore: number;
  afterScore: number;
  improvement: number;
  changes: Array<{
    category: string;
    issue: string;
    fix: string;
    impact?: string;
  }>;
  optimizedCVId: string;
  optimizedAtsResult?: {
    overallScore: number;
    summary: string;
    categories: {
      format: CategoryResult;
      structure: CategoryResult;
      keywords: CategoryResult;
      readability: CategoryResult;
    };
    metadata?: {
      wordCount: number;
      keywordStats?: {
        hardSkillsCount: number;
        softSkillsCount: number;
        actionVerbsCount: number;
        quantifiedAchievements: number;
      };
      hasContactInfo?: {
        email: boolean;
        phone: boolean;
        linkedin: boolean;
        location: boolean;
      };
    };
    atsCompatibility?: {
      workday: string;
      greenhouse: string;
      taleo: string;
      lever: string;
    };
    parsingChecks?: {
      singleColumn: { ok: boolean; note: string };
      standardSections: { ok: boolean; note: string };
      cleanCharacters: { ok: boolean; note: string };
      abbreviations: { ok: boolean; note: string };
    };
  };
}

interface OptimizedCVHistory {
  id: string;
  title: string;
  contact_name: string;
  file_url: string;
  before_score: number;
  after_score: number;
  created_at: string;
  ats_result?: ATSResult;
  changes?: Array<{
    category: string;
    issue: string;
    fix: string;
    impact?: string;
  }>;
}

const pulse = keyframes`
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.02); }
`;

const Container = styled.div`
  position: relative;
  padding-top: 24px;
  max-width: 1200px;
  margin: 0 auto;
  padding-left: ${({ theme }) => theme.spacing["2xl"]};
  padding-right: ${({ theme }) => theme.spacing["2xl"]};
  padding-bottom: 100px; /* Space for FAB */
  overflow-x: hidden;

  @media (max-width: 450px) {
    padding: ${({ theme }) => theme.spacing["lg"]};
    padding-top: 24px;
  }
`;

const Header = styled.div`
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 24px;
  margin-bottom: 48px;
  margin-top: 24px;

  @media (max-width: 768px) {
    align-items: flex-start;
    gap: 12px;
    margin-bottom: 24px;
  }
`;

const TitleElements = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  min-width: 0;
  gap: 12px;
`;

const Title = styled.h1`
  font-size: 36px;
  font-weight: 700;
  letter-spacing: -0.03em;
  color: rgba(255, 255, 255, 0.95);
  line-height: 1.1;
  margin: 0;

  @media (max-width: 768px) {
    font-size: 24px;
    margin-bottom: 4px;
  }
`;

const Subtitle = styled.p`
  font-size: 15px;
  color: rgba(255, 255, 255, 0.6);
  font-weight: 500;
  letter-spacing: -0.01em;
  margin: 0;

  @media (max-width: 768px) {
    order: 3;
  }
`;

const CreditsCardWrapper = styled.div`
  flex-shrink: 0;

  @media (max-width: 768px) {
    width: auto;
    
    > div {
      width: auto;
    }
  }
`;

const OptimizedCVGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
  gap: 16px;

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

// Shared Report Card Style for History
const OptimizedCVCard = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  overflow: hidden;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  min-height: 200px;

  /* Liquid Glass card */
  background: rgba(24, 24, 24, 0.4);
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

  &:hover .cv-content {
    transform: translateY(-32px);
  }

  &:hover .cv-cta {
    transform: translateY(0);
    opacity: 1;
  }

  @media (max-width: 1024px) {
    &:hover .cv-content {
      transform: none;
    }
  }
`;

const CardContent = styled.div`
  padding: 24px;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  position: relative;
  z-index: 1;
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

const ScoreValue = styled.span<{ $score: number }>`
  font-size: 48px;
  font-weight: 700;
  color: ${({ $score }) =>
    $score >= 85 ? "var(--primary-500)" :
    $score >= 70 ? "#2A57A0" :
    $score >= 50 ? "#EAB308" : "#F97316"};
  line-height: 1;

  &::after {
    content: '%';
    font-size: 24px;
    margin-left: 2px;
    opacity: 0.7;
  }
`;

const ReportTitle = styled.h3`
  font-size: 18px;
  font-weight: 600;
  color: var(--text-color);
  margin-top: 4px;
`;

const ReportMeta = styled.p`
  color: var(--text-secondary);
  font-size: 14px;
  line-height: 1.4;
  margin-top: 2px;
`;

const CTAContainer = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px;
  transform: translateY(100%);
  opacity: 0;
  transition: all 0.3s ease;
  background: linear-gradient(to top, rgba(24, 24, 24, 0.95) 60%, transparent);

  @media (max-width: 768px) {
    padding: 0;
    transform: translateY(0);
    opacity: 1;
    position: relative;
    padding-top: 16px;
    background: none;
  }
`;

const CTALink = styled.span`
  display: flex;
  align-items: center;
  gap: 6px;
  color: var(--accent);
  font-weight: 500;
  font-size: 14px;

  &:hover {
    text-decoration: underline;
  }
`;

const CardActions = styled.div`
  display: flex;
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
  ), rgba(16, 185, 129, 0.38);
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
    0 8px 32px rgba(16, 185, 129, 0.5),
    0 2px 8px rgba(0, 0, 0, 0.25);

  &:hover {
    transform: scale(1.08) translateY(-3px);
    background: linear-gradient(
      180deg,
      rgba(255, 255, 255, 0.3) 0%,
      rgba(255, 255, 255, 0.0) 100%
    ), rgba(20, 195, 139, 0.58);
    box-shadow:
      inset 0 1.5px 0 rgba(255, 255, 255, 0.65),
      0 16px 48px rgba(16, 185, 129, 0.55),
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

const Overlay = styled.div`
  pointer-events: none;
  position: absolute;
  inset: 0;
  transition: all 0.3s ease;
`;

const ErrorMessage = styled.div`
  padding: 12px 16px;
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.2);
  border-radius: 8px;
  color: #ef4444;
  font-size: 14px;
  margin-top: 16px;
`;

// Results Section
const ResultsSection = styled.div`
  animation: fadeIn 0.5s ease;

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;

const ImprovementPotential = styled.div<{ $max: number }>`
  position: absolute;
  height: 100%;
  width: ${({ $max }) => $max}%;
  background: linear-gradient(90deg, rgba(16, 185, 129, 0.3) 0%, rgba(16, 185, 129, 0.5) 100%);
  border-radius: 6px;
  transition: width 0.5s ease;
`;

const ImprovementText = styled.p`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-top: 8px;
`;

// Contact Info Checklist
const ContactChecklist = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 16px;
  justify-content: center;
`;

const ContactItem = styled.span<{ $present: boolean }>`
  font-size: 12px;
  padding: 4px 10px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  gap: 4px;
  background: ${({ $present }) =>
    $present ? "rgba(16, 185, 129, 0.1)" : "rgba(239, 68, 68, 0.1)"};
  color: ${({ $present }) =>
    $present ? "#10b981" : "#ef4444"};
`;

// ATS System Compatibility
const ATSCompatibilitySection = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 16px;
  padding: 24px;
  margin-bottom: 24px;
`;

const ATSCompatibilityTitle = styled.h3`
  font-size: 16px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textPrimary};
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const ATSSystemsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;

  @media (max-width: 640px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const ATSSystemCard = styled.div<{ $level: string }>`
  text-align: center;
  padding: 16px 12px;
  border-radius: 12px;
  background: ${({ $level }) =>
    $level === "high" ? "rgba(16, 185, 129, 0.1)" :
    $level === "medium" ? "rgba(245, 158, 11, 0.1)" :
    "rgba(239, 68, 68, 0.1)"};
  border: 1px solid ${({ $level }) =>
    $level === "high" ? "rgba(16, 185, 129, 0.2)" :
    $level === "medium" ? "rgba(245, 158, 11, 0.2)" :
    "rgba(239, 68, 68, 0.2)"};
`;

const ATSSystemName = styled.div`
  font-size: 13px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textPrimary};
  margin-bottom: 4px;
`;

const ATSSystemLevel = styled.div<{ $level: string }>`
  font-size: 12px;
  font-weight: 500;
  text-transform: uppercase;
  color: ${({ $level }) =>
    $level === "high" ? "#10b981" :
    $level === "medium" ? "#f59e0b" :
    "#ef4444"};
`;

// Stats Section
const StatsSection = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
  margin-bottom: 24px;

  @media (max-width: 640px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const StatCard = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 12px;
  padding: 16px;
  text-align: center;
`;

const StatValue = styled.div`
  font-size: 24px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const StatLabel = styled.div`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-top: 4px;
`;

// Category Metrics Grid
const MetricsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  margin-bottom: 32px;

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

const MetricCard = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 16px;
  padding: 24px;
`;

const MetricHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
`;

const MetricTitle = styled.h3`
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textPrimary};
  display: flex;
  align-items: center;
  gap: 6px;
`;

const CategoryImpactEmoji = styled.span`
  font-size: 16px;
  line-height: 1;
`;

const MetricScore = styled.span<{ $score: number; $max: number }>`
  font-size: 14px;
  font-weight: 700;
  color: ${({ $score, $max }) => {
    const percentage = ($score / $max) * 100;
    return percentage >= 80 ? "#10b981" :
           percentage >= 60 ? "#f59e0b" :
           percentage >= 40 ? "#f97316" : "#ef4444";
  }};
`;

const MetricBar = styled.div`
  height: 8px;
  background: ${({ theme }) => theme.colors.border};
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 12px;
`;

const MetricProgress = styled.div<{ $score: number; $max: number }>`
  height: 100%;
  width: ${({ $score, $max }) => ($score / $max) * 100}%;
  background: ${({ $score, $max }) => {
    const percentage = ($score / $max) * 100;
    return percentage >= 80 ? "var(--primary-500)" :
           percentage >= 60 ? "#2A57A0" :
           percentage >= 40 ? "#EAB308" : "#F97316";
  }};
  border-radius: 4px;
  transition: width 0.5s ease;
`;

const MetricIssues = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const MetricIssue = styled.li`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.textSecondary};
  padding: 6px 0;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  display: flex;
  align-items: flex-start;
  gap: 8px;

  &:last-child {
    border-bottom: none;
  }

  svg {
    flex-shrink: 0;
    margin-top: 2px;
  }
`;

// Top Issues Section
const TopIssuesSection = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 16px;
  padding: 24px;
  margin-bottom: 24px;
`;

const TopIssuesTitle = styled.h3`
  font-size: 16px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textPrimary};
  margin-bottom: 16px;
`;

const IssueItem = styled.div`
  padding: 16px;
  background: ${({ theme }) => theme.colors.background};
  border-radius: 12px;
  margin-bottom: 12px;

  &:last-child {
    margin-bottom: 0;
  }
`;

const IssueHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
`;

const SeverityBadge = styled.span<{ $severity: string }>`
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  padding: 3px 8px;
  border-radius: 4px;
  background: ${({ $severity }) =>
    $severity === "critical" ? "rgba(239, 68, 68, 0.1)" :
    $severity === "major" ? "rgba(245, 158, 11, 0.1)" :
    "rgba(99, 102, 241, 0.1)"};
  color: ${({ $severity }) =>
    $severity === "critical" ? "#ef4444" :
    $severity === "major" ? "#f59e0b" :
    "#6366f1"};
`;

const CategoryBadge = styled.span`
  font-size: 11px;
  font-weight: 500;
  padding: 3px 8px;
  border-radius: 4px;
  background: ${({ theme }) => theme.colors.border};
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const IssueText = styled.p`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.textPrimary};
  margin-bottom: 8px;
  font-weight: 500;
`;

const IssueSuggestion = styled.p`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.textSecondary};
  display: flex;
  align-items: flex-start;
  gap: 6px;

  svg {
    flex-shrink: 0;
    margin-top: 2px;
  }
`;

// Quick Fixes Section (Faz 2)
const QuickFixesSection = styled.div`
  background: linear-gradient(135deg, rgba(16, 185, 129, 0.05) 0%, rgba(34, 197, 94, 0.05) 100%);
  border: 1px solid rgba(16, 185, 129, 0.2);
  border-radius: 16px;
  padding: 24px;
  margin-bottom: 32px;
`;

const QuickFixesTitle = styled.h3`
  font-size: 16px;
  font-weight: 600;
  color: #10b981;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const QuickFixesList = styled.div`
  display: grid;
  gap: 12px;
`;

const QuickFixItem = styled.div`
  background: white;
  border: 1px solid rgba(16, 185, 129, 0.2);
  border-radius: 12px;
  padding: 16px;
  display: flex;
  align-items: flex-start;
  gap: 12px;
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(16, 185, 129, 0.1);
  }
`;

const QuickFixIcon = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 8px;
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  svg {
    width: 18px;
    height: 18px;
    color: white;
  }
`;

const QuickFixContent = styled.div`
  flex: 1;
`;

const QuickFixHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 4px;
  gap: 12px;
`;

const QuickFixText = styled.div`
  font-size: 14px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const QuickFixCategory = styled.span`
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  padding: 3px 8px;
  border-radius: 4px;
  background: rgba(16, 185, 129, 0.1);
  color: #10b981;
`;

const QuickFixMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 6px;
`;

const QuickFixImpact = styled.span`
  font-size: 12px;
  font-weight: 600;
  color: #10b981;
  display: flex;
  align-items: center;
  gap: 4px;

  svg {
    width: 12px;
    height: 12px;
  }
`;

const QuickFixTime = styled.span`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.textSecondary};
  display: flex;
  align-items: center;
  gap: 4px;

  svg {
    width: 12px;
    height: 12px;
  }
`;

// Optimize CTA
const OptimizeCTA = styled.div`
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%);
  border: 1px solid rgba(99, 102, 241, 0.2);
  border-radius: 20px;
  padding: 32px;
  text-align: center;
  margin-bottom: 24px;
`;

const CTATitle = styled.h3`
  font-size: 20px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.textPrimary};
  margin-bottom: 8px;
`;

const CTAText = styled.p`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-bottom: 20px;
`;

const OptimizeButton = styled.button`
  padding: 16px 32px;
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  border: none;
  border-radius: 12px;
  color: white;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  display: inline-flex;
  align-items: center;
  gap: 10px;
  animation: ${pulse} 2s ease-in-out infinite;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(99, 102, 241, 0.3);
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
    transform: none;
    animation: none;
  }
`;

const TryAgainButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  font-size: 14px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.textPrimary};
  background: transparent;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${({ theme }) => theme.colors.surface};
    border-color: ${({ theme }) => theme.colors.textSecondary};
  }
`;

// CV Selection Components
const ExistingCVSection = styled.div`
  margin-top: 24px;
  background: ${({ theme }) => theme.colors.backgroundAlt};
    border-radius: 12px;

`;

const ExistingCVHeader = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  background: ${({ theme }) => theme.colors.backgroundAlt};
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  

  &:hover {
    background: ${({ theme }) => theme.colors.border};
    box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.06), 0 4px 8px rgba(0, 0, 0, 0.08),
      0 16px 32px rgba(0, 0, 0, 0.08);
  }

  @media (prefers-color-scheme: dark) {

    &:hover {
      border-color: ${({ theme }) => theme.colors.textSecondary};
      box-shadow: none;
    }
  }
`;

const ExistingCVHeaderContent = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 14px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.textPrimary};

  svg {
    color: ${({ theme }) => theme.colors.textSecondary};
  }
`;

const CVListContainer = styled.div`
  margin-top: 12px;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 12px;
  max-height: 400px;
  overflow-y: auto;
  padding: 4px;

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

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

const CVMiniCard = styled.button`
  position: relative;
  width: 100%;
  padding: 20px;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  text-align: left;
  overflow: hidden;
  height: 140px;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;

  /* Liquid Glass card */
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

  &:hover .cv-mini-content { transform: translateY(-8px); }
  &:hover .cv-mini-icon { transform: scale(0.85); }
  &:hover .cv-mini-arrow { transform: translateY(-50%) translateX(4px); opacity: 1; }

  @media (max-width: 1024px) {
    &:hover .cv-mini-content { transform: none; }
  }
`;

const CVMiniContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  transform-origin: bottom left;
  transition: all 0.3s ease;

  @media (max-width: 1024px) {
    transform: none !important;
  }
`;

const CVMiniIcon = styled.div`
  transform-origin: left;
  transition: all 0.3s ease;
  color: var(--accent);
  margin-bottom: 8px;

  svg {
    width: 32px;
    height: 32px;
  }

  @media (max-width: 640px) {
    svg {
      width: 28px;
      height: 28px;
    }
  }
`;

const CVMiniTitle = styled.div`
  font-size: 16px;
  font-weight: 600;
  color: var(--text-color);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const CVMiniDate = styled.div`
  font-size: 13px;
  color: var(--text-secondary);
`;

const CVMiniMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 4px;
`;

const CVMiniScoreBadge = styled.span<{ $score: number }>`
  position: absolute;
  right: 16px;
  top: 16px;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;

  color: ${({ $score }) => {
   if ($score >= 85) return "var(--primary-500)";
  if ($score >= 70) return "#2a57a0ff";
  if ($score >= 50) return "#EAB308";
  return "#F97316";
  }};
`;

const CVMiniArrow = styled.div`
  position: absolute;
  right: 16px;
  top: 50%;
  transform: translateY(-50%);
  opacity: 0.4;
  transition: all 0.3s ease;
  color: var(--accent);

  svg {
    width: 18px;
    height: 18px;
  }
`;

const CVMiniOverlay = styled.div`
  pointer-events: none;
  position: absolute;
  inset: 0;
  border-radius: 16px;
  transition: all 0.3s ease;
`;

const EmptyCVList = styled.div`
  grid-column: 1 / -1;
  padding: 40px 24px;
  text-align: center;
  color: var(--text-secondary);
  font-size: 14px;
  background: var(--bg-alt);
  border-radius: 12px;
  border: 1px dashed var(--border-color);
`;

const LoadingSpinner = styled.div`
  grid-column: 1 / -1;
  padding: 40px 24px;
  text-align: center;
  color: var(--text-secondary);
  font-size: 14px;
  background: var(--bg-alt);
  border-radius: 12px;
`;

// Optimized Result
const OptimizedCard = styled.div`
  background: linear-gradient(135deg, rgba(16, 185, 129, 0.05) 0%, rgba(99, 102, 241, 0.05) 100%);
  border: 1px solid rgba(16, 185, 129, 0.2);
  border-radius: 20px;
  padding: 40px;
  text-align: center;
  margin-bottom: 32px;
`;

const SuccessTitle = styled.h2`
  font-size: 28px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.textPrimary};
  margin-bottom: 16px;
`;

const ScoreComparison = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 32px;
  margin: 32px 0;
`;

const ScoreBox = styled.div`
  text-align: center;
`;

const ScoreBoxLabel = styled.div`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-bottom: 8px;
`;

const ScoreBoxValue = styled.div<{ $isAfter?: boolean }>`
  font-size: 48px;
  font-weight: 800;
  color: ${({ $isAfter }) => $isAfter ? "#10b981" : "#6b7280"};
`;

const ScoreArrow = styled.div`
  font-size: 32px;
  color: #10b981;
`;


const ImprovementBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 10px;
  background: rgba(16, 185, 129, 0.1);
  border-radius: 20px;
  font-size: 13px;
  font-weight: 600;
  color: #10b981;
`;

const TopFixesContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
`;

const TopFixItem = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 8px;
  font-size: 13px;
  color: var(--text-secondary);
  line-height: 1.4;

  svg {
    width: 14px;
    height: 14px;
    color: #10b981;
    margin-top: 2px;
    flex-shrink: 0;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 16px;
  margin-top: 32px;

  @media (max-width: 640px) {
    flex-direction: column;
  }
`;

const DownloadButton = styled.a`
  flex: 1;
  padding: 16px 24px;
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  border: none;
  border-radius: 12px;
  color: white;
  font-size: 16px;
  font-weight: 600;
  text-decoration: none;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(16, 185, 129, 0.3);
  }
`;

const SecondaryButton = styled.button`
  flex: 1;
  padding: 16px 24px;
  background: transparent;
  border: none;
  border-radius: 12px;
  color: ${({ theme }) => theme.colors.textPrimary};
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.06), 0 1px 2px rgba(0, 0, 0, 0.04);

  &:hover {
    background: ${({ theme }) => theme.colors.background};
    box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.08), 0 2px 4px rgba(0, 0, 0, 0.06);
  }

  @media (prefers-color-scheme: dark) {
    box-shadow: none;
    border: 1px solid ${({ theme }) => theme.colors.border};

    &:hover {
      box-shadow: none;
    }
  }
`;

// PDF Preview Modal Styled Components
const PDFPreviewContainer = styled.div`
  width: 100%;
  height: 70vh;
  min-height: 500px;
  background: #f3f4f6;
  border-radius: 8px;
  overflow: hidden;
`;

const PDFViewer = styled.iframe`
  width: 100%;
  height: 100%;
  border: none;
`;



// History Section Styled Components
const HistorySection = styled.div`
  margin-top: 32px;
  position: relative;
  border-radius: 18px;
  overflow: hidden;

  /* Apple Liquid Glass core */
  background: rgba(22, 22, 26, 0.78);
  backdrop-filter: blur(60px) saturate(200%);
  -webkit-backdrop-filter: blur(60px) saturate(200%);
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow:
    0 8px 40px rgba(0, 0, 0, 0.45),
    0 2px 8px rgba(0, 0, 0, 0.3);

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(
      90deg,
      transparent 0%,
      rgba(255, 255, 255, 0.25) 40%,
      rgba(255, 255, 255, 0.45) 60%,
      rgba(255, 255, 255, 0.25) 80%,
      transparent 100%
    );
    pointer-events: none;
    z-index: 1;
  }

  &::after {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    width: 1px;
    background: linear-gradient(
      180deg,
      rgba(255, 255, 255, 0.15) 0%,
      rgba(255, 255, 255, 0.05) 40%,
      rgba(255, 255, 255, 0.0) 100%
    );
    pointer-events: none;
    z-index: 1;
  }
`;

const HistorySectionHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 28px 24px 16px;
  position: relative;
  z-index: 2;
`;

const HistoryTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--text-color);
  letter-spacing: -0.01em;
  margin: 0;
`;

const HistoryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px;
  padding: 24px;

  @media (max-width: 768px) {
    padding: 16px;
  }
`;

const HistoryCard = styled.div`
  position: relative;
  border-radius: 20px;
  padding: 20px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  overflow: hidden;
  height: 180px;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;

  /* Liquid Glass card */
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

  &:hover .history-content { transform: translateY(-8px); }
  &:hover .history-icon { transform: scale(0.85); }
  &:hover .history-arrow { transform: translateY(-50%) translateX(4px); opacity: 1; }

  @media (max-width: 1024px) {
    &:hover .history-content { transform: none; }
  }
`;

const HistoryContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  transform-origin: bottom left;
  transition: all 0.3s ease;

  @media (max-width: 1024px) {
    transform: none !important;
  }
`;

const HistoryIcon = styled.div`
  transform-origin: left;
  transition: all 0.3s ease;
  color: var(--success);
  margin-bottom: 8px;

  svg {
    width: 32px;
    height: 32px;
  }

  @media (max-width: 640px) {
    svg {
      width: 28px;
      height: 28px;
    }
  }
`;

const HistoryOverlay = styled.div`
  pointer-events: none;
  position: absolute;
  inset: 0;
  border-radius: 16px;
  transition: all 0.3s ease;
`;

const HistoryArrow = styled.div`
  position: absolute;
  right: 16px;
  top: 50%;
  transform: translateY(-50%);
  opacity: 0.4;
  transition: all 0.3s ease;
  color: var(--success);

  svg {
    width: 18px;
    height: 18px;
  }
`;

const HistoryCardName = styled.div`
  font-size: 17px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textPrimary};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const HistoryCardDate = styled.div`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const HistoryScoreRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 8px;
`;

const HistoryScoreBadge = styled.span<{ $type: "before" | "after" }>`
  display: inline-flex;
  align-items: center;
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 600;
  background: ${({ $type }) => $type === "before" ? "rgba(239, 68, 68, 0.1)" : "rgba(34, 197, 94, 0.1)"};
  color: ${({ $type }) => $type === "before" ? "#ef4444" : "#22c55e"};
`;

const HistoryScoreArrow = styled.span`
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: 14px;
`;

const HistoryImprovement = styled.span`
  font-size: 12px;
  color: #22c55e;
  font-weight: 500;
`;

const BackButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 8px;
  color: ${({ theme }) => theme.colors.textPrimary};
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-bottom: 20px;

  &:hover {
    background: ${({ theme }) => theme.colors.background};
    border-color: ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.colors.primary};
  }

  svg {
    width: 16px;
    height: 16px;
  }
`;

/* ── Liquid Glass empty state (ATS Optimizer) ── */
const floatOrbATS = keyframes`
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  33%       { transform: translateY(-16px) rotate(3deg); }
  66%       { transform: translateY(8px) rotate(-2deg); }
`;

const ATSEmptyHero = styled.div`
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

const ATSOrbA = styled.div`
  position: absolute;
  width: 340px; height: 340px;
  border-radius: 50%;
  top: -70px; right: -50px;
  background: radial-gradient(circle, rgba(102, 126, 234, 0.14) 0%, transparent 70%);
  animation: ${floatOrbATS} 9s ease-in-out infinite;
  pointer-events: none;
`;

const ATSOrbB = styled.div`
  position: absolute;
  width: 260px; height: 260px;
  border-radius: 50%;
  bottom: -50px; left: -30px;
  background: radial-gradient(circle, rgba(139, 92, 246, 0.10) 0%, transparent 70%);
  animation: ${floatOrbATS} 12s ease-in-out infinite reverse;
  pointer-events: none;
`;

const ATSHeroSpecular = styled.div`
  position: absolute;
  top: 0; left: 15%; right: 15%;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.40) 50%, transparent);
  pointer-events: none;
`;

const ATSHeroIconBadge = styled.div`
  width: 80px; height: 80px;
  border-radius: 24px;
  margin-bottom: 22px;
  display: flex;
  align-items: center;
  justify-content: center;

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

const ATSHeroTitle = styled.h2`
  font-size: 26px;
  font-weight: 800;
  letter-spacing: -0.04em;
  line-height: 1.15;
  margin-bottom: 10px;
  color: rgba(255,255,255,0.95);

  @media (max-width: 768px) { font-size: 22px; }
`;

const ATSHeroSubtitle = styled.p`
  font-size: 14px;
  color: rgba(255,255,255,0.42);
  line-height: 1.60;
  max-width: 420px;
  margin: 0 auto 24px;
  letter-spacing: -0.01em;
`;

const ATSStepsRow = styled.div`
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

const ATSStepConnector = styled.div`
  flex: 1;
  height: 1px;
  background: linear-gradient(90deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.06) 100%);
  margin-top: 22px;
  @media (max-width: 640px) { display: none; }
`;

const ATSStep = styled.div`
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

const ATSStepNum = styled.div<{ $n: 1 | 2 | 3 }>`
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
      case 1: return 'rgba(16, 185, 129, 0.18)';
      case 2: return 'rgba(102, 126, 234, 0.18)';
      case 3: return 'rgba(139, 92, 246, 0.18)';
    }
  }};
  border: 1px solid ${({ $n }) => {
    switch ($n) {
      case 1: return 'rgba(16, 185, 129, 0.35)';
      case 2: return 'rgba(102, 126, 234, 0.35)';
      case 3: return 'rgba(139, 92, 246, 0.35)';
    }
  }};
  color: ${({ $n }) => {
    switch ($n) {
      case 1: return '#34d399';
      case 2: return '#818cf8';
      case 3: return '#a78bfa';
    }
  }};
`;

const ATSStepText = styled.div`
  font-size: 11.5px;
  font-weight: 600;
  color: rgba(255,255,255,0.48);
  letter-spacing: 0.01em;
  line-height: 1.45;
  text-align: center;
  @media (max-width: 640px) { text-align: left; }
`;

const ATSCTAButton = styled.button`
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

const ATSCTASecondary = styled.button`
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

const ATSCTARow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
  justify-content: center;
`;

/* ── ATS Upload Modal — Liquid Glass ── */
const ATSModalHeaderInner = styled.div`
  padding: 32px 32px 0;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  position: relative;

  @media (max-width: 640px) { padding: 24px 24px 0; }
`;

const ATSModalIconBadge = styled.div`
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

const ATSModalHeadTitle = styled.h2`
  font-size: 20px;
  font-weight: 800;
  letter-spacing: -0.035em;
  color: rgba(255,255,255,0.96);
  margin: 0 0 4px;
`;

const ATSModalHeadSub = styled.p`
  font-size: 13px;
  color: rgba(255,255,255,0.38);
  letter-spacing: -0.01em;
  margin: 0;
`;

const ATSModalCloseBtn = styled.button`
  position: absolute;
  top: 32px;
  right: 32px;

  @media (max-width: 640px) {
    top: 24px;
    right: 24px;
  }
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

const ATSUploadBody = styled.div`
  padding: 24px 28px 28px;
  display: flex;
  flex-direction: column;
  gap: 16px;

  @media (max-width: 640px) { padding: 20px; }
`;

const ATSDropZone = styled.div<{ $isDragOver: boolean; $hasFile: boolean }>`
  position: relative;
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: ${({ $hasFile }) => $hasFile ? '20px' : '40px 24px'};
  cursor: pointer;
  transition: all 0.22s cubic-bezier(0.16, 1, 0.3, 1);
  overflow: hidden;

  background: ${({ $isDragOver }) => $isDragOver
    ? 'rgba(102, 126, 234, 0.14)'
    : 'rgba(255,255,255,0.04)'};
  border: 1.5px dashed ${({ $isDragOver }) => $isDragOver
    ? 'rgba(102, 126, 234, 0.70)'
    : 'rgba(255,255,255,0.14)'};

  box-shadow: ${({ $isDragOver }) => $isDragOver
    ? 'inset 0 0 0 1px rgba(102, 126, 234, 0.25), 0 0 32px rgba(102,126,234,0.12)'
    : 'none'};

  &:hover {
    background: rgba(102, 126, 234, 0.07);
    border-color: rgba(255,255,255,0.22);
  }
`;

const ATSDropIconRing = styled.div`
  width: 56px;
  height: 56px;
  border-radius: 18px;
  display: flex;
  align-items: center;
  justify-content: center;

  background:
    linear-gradient(145deg, rgba(255,255,255,0.16) 0%, rgba(255,255,255,0.04) 100%),
    rgba(102, 126, 234, 0.18);
  border: 1px solid rgba(255,255,255,0.18);
  box-shadow:
    inset 0 1.5px 0 rgba(255,255,255,0.40),
    0 4px 16px rgba(102, 126, 234, 0.22);

  svg {
    width: 24px;
    height: 24px;
    color: rgba(255,255,255,0.82);
  }
`;

const ATSDropTitle = styled.p`
  font-size: 15px;
  font-weight: 700;
  color: rgba(255,255,255,0.88);
  letter-spacing: -0.02em;
  margin: 0;
`;

const ATSDropSub = styled.p`
  font-size: 12.5px;
  color: rgba(255,255,255,0.30);
  margin: 0;
  letter-spacing: -0.01em;
`;

const ATSFileChip = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 14px;
  border-radius: 12px;
  background: rgba(102, 126, 234, 0.12);
  border: 1px solid rgba(102, 126, 234, 0.30);
  width: 100%;
`;

const ATSFileChipName = styled.span`
  flex: 1;
  font-size: 13.5px;
  font-weight: 600;
  color: rgba(255,255,255,0.85);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const ATSFileChipSize = styled.span`
  font-size: 12px;
  color: rgba(255,255,255,0.35);
  flex-shrink: 0;
`;

const ATSFileChipClear = styled.button`
  width: 22px;
  height: 22px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255,255,255,0.08);
  border: none;
  color: rgba(255,255,255,0.45);
  cursor: pointer;
  flex-shrink: 0;
  transition: all 0.15s ease;

  &:hover { background: rgba(255,255,255,0.14); color: rgba(255,255,255,0.80); }
  svg { width: 12px; height: 12px; }
`;

const ATSDivider = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  color: rgba(255,255,255,0.18);
  font-size: 11.5px;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;

  &::before, &::after {
    content: '';
    flex: 1;
    height: 1px;
    background: rgba(255,255,255,0.08);
  }
`;

const ATSCVAccordion = styled.div`
  border-radius: 14px;
  border: 1px solid rgba(255,255,255,0.09);
  overflow: hidden;
`;

const ATSCVAccordionHeader = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 13px 16px;
  background: rgba(255,255,255,0.04);
  border: none;
  cursor: pointer;
  font-size: 13.5px;
  font-weight: 600;
  color: rgba(255,255,255,0.55);
  transition: all 0.18s ease;

  &:hover { color: rgba(255,255,255,0.80); background: rgba(255,255,255,0.07); }

  svg { width: 14px; height: 14px; transition: transform 0.22s ease; }
`;

const ATSCVList = styled.div`
  display: flex;
  flex-direction: column;
  max-height: 220px;
  overflow-y: auto;
  scrollbar-width: none;
  &::-webkit-scrollbar { display: none; }
  border-top: 1px solid rgba(255,255,255,0.06);
`;

const ATSCVItem = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  background: transparent;
  border: none;
  cursor: pointer;
  text-align: left;
  transition: background 0.15s ease;
  border-bottom: 1px solid rgba(255,255,255,0.04);

  &:last-child { border-bottom: none; }
  &:hover { background: rgba(102, 126, 234, 0.08); }
`;

const ATSCVItemName = styled.span`
  font-size: 13.5px;
  font-weight: 600;
  color: rgba(255,255,255,0.78);
`;

const ATSCVItemDate = styled.span`
  font-size: 12px;
  color: rgba(255,255,255,0.28);
  flex-shrink: 0;
`;

const ATSUploadPrimaryBtn = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  padding: 14px 28px;
  border-radius: 9999px;
  border: none;
  cursor: pointer;
  font-size: 14.5px;
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
    transform: translateY(-2px);
    box-shadow:
      inset 0 1.5px 0 rgba(255,255,255,0.65),
      0 12px 36px rgba(102, 126, 234, 0.52),
      0 3px 10px rgba(0,0,0,0.28);
  }
  &:active { transform: scale(0.98); }
  &:disabled { opacity: 0.40; cursor: not-allowed; }
  &:disabled { opacity: 0.40; cursor: not-allowed; }
  svg { width: 18px; height: 18px; flex-shrink: 0; }
`;

// Preview Modal specific styles
const PreviewModalOverlay = styled(motion.div)`
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  background: rgba(10, 10, 14, 0.4);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);

  @media (max-width: 768px) {
    padding: 0;
    align-items: flex-end;
  }
`;

const PreviewModalContent = styled(motion.div)`
  width: 100%;
  max-width: 900px;
  height: 90vh;
  margin: 0 auto;
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;

  /* Liquid Glass Base */
  background: rgba(22, 22, 30, 0.7);
  backdrop-filter: blur(40px) saturate(150%);
  -webkit-backdrop-filter: blur(40px) saturate(150%);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 28px;
  box-shadow: 
    0 4px 1px rgba(255, 255, 255, 0.05) inset,
    0 24px 64px rgba(0, 0, 0, 0.4),
    0 12px 24px rgba(0, 0, 0, 0.2);

  @media (max-width: 768px) {
    height: 95vh;
    border-radius: 28px 28px 0 0;
    border-bottom: none;
  }
`;

const PreviewModalBody = styled.div`
  flex: 1;
  padding: 0 24px;
  overflow: hidden;
  display: flex;
  flex-direction: column;

  @media (max-width: 768px) {
    padding: 0 16px;
  }
`;

const PreviewModalFooter = styled.div`
  padding: 24px;
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  background: rgba(10, 10, 14, 0.3);
  border-top: 1px solid rgba(255, 255, 255, 0.05);

  @media (max-width: 768px) {
    padding: 16px;
    flex-direction: column;
  }
`;

const PreviewSecondaryBtn = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 14px 28px;
  border-radius: 9999px;
  font-size: 14.5px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: white;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
    border-color: rgba(255, 255, 255, 0.2);
  }

  &:active {
    transform: scale(0.98);
  }

  @media (max-width: 768px) {
    width: 100%;
  }
`;

// Floating Action Button for easy access to upload
const FAB = styled.button`
  position: fixed;
  bottom: 32px;
  right: 32px;
  width: 64px;
  height: 64px;
  border-radius: 50%;
  border: none;
  background: linear-gradient(135deg, rgba(16, 185, 129, 0.9) 0%, rgba(5, 150, 105, 0.9) 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 
    0 8px 32px rgba(16, 185, 129, 0.4),
    inset 0 1px 1px rgba(255, 255, 255, 0.4);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  z-index: 100;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);

  &:hover {
    transform: translateY(-4px) scale(1.05);
    box-shadow: 
      0 12px 48px rgba(16, 185, 129, 0.5),
      inset 0 1px 1px rgba(255, 255, 255, 0.5);
  }

  &:active {
    transform: translateY(0) scale(0.95);
  }

  svg {
    width: 28px;
    height: 28px;
  }

  @media (max-width: 768px) {
    bottom: 24px;
    right: 24px;
    width: 56px;
    height: 56px;
    
    svg {
      width: 24px;
      height: 24px;
    }
  }
`;

export default function DashboardATSOptimizerPage() {
  const [step, setStep] = useState<Step>("upload");
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [_file, setFile] = useState<File | null>(null);
  const [cvText, setCvText] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [atsResult, setAtsResult] = useState<ATSResult | null>(null);
  const [optimizationResult, setOptimizationResult] = useState<OptimizationResult | null>(null);

  // Customization modal states
  const [isCVCustomizationModalOpen, setIsCVCustomizationModalOpen] = useState(false);
  const [currentDocumentId, setCurrentDocumentId] = useState<string | null>(null);
  const [cvCustomizationOptions, setCvCustomizationOptions] = useState<CVCustomizationOptions | null>(null);

  // CV Selection states
  const [existingCVs, setExistingCVs] = useState<CVDocument[]>([]);
  const [loadingCVs, setLoadingCVs] = useState(false);
  const [showExistingCVs, setShowExistingCVs] = useState(false);

  // CV Preview Modal states
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [pdfPreviewUrl, setPdfPreviewUrl] = useState<string | null>(null);

  // History states
  const [optimizedHistory, setOptimizedHistory] = useState<OptimizedCVHistory[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(true);

  // Delete states
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [cvToDelete, setCvToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Credits system
  const { credits, isLoading: isLoadingCredits } = useCredits();
  const router = useRouter();
  const creditConfirm = useCreditConfirm();
  const { user } = useAuth();
  const toast = useToast();

  // Fetch optimized CV history on mount
  useEffect(() => {
    fetchOptimizedHistory();
  }, []);

  // Fetch existing CVs when showing the list (in modal)
  useEffect(() => {
    if (showExistingCVs && existingCVs.length === 0) {
      fetchExistingCVs();
    }
  }, [showExistingCVs]);

  const fetchOptimizedHistory = async () => {
    try {
      const response = await fetch("/api/ats/history?limit=20");
      if (response.ok) {
        const data = await response.json();
        setOptimizedHistory(data.optimizedCVs || []);
      }
    } catch (err) {
      console.error("Failed to fetch history:", err);
    } finally {
      setLoadingHistory(false);
    }
  };

  const handleHistoryCardClick = (cv: OptimizedCVHistory) => {
    if (cv.ats_result) {
      setOptimizationResult({
        success: true,
        pdfUrl: cv.file_url,
        beforeScore: cv.before_score,
        afterScore: cv.after_score,
        improvement: cv.after_score - cv.before_score,
        changes: cv.changes || [],
        optimizedCVId: cv.id,
        optimizedAtsResult: cv.ats_result,
      });
      setStep("optimized"); // Switch to detailed view
    } else {
      handlePreviewCV();
    }
  };

  const handleDeleteClick = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setCvToDelete(id);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!cvToDelete || !user) return;

    setIsDeleting(true);
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from("optimized_cvs")
        .delete()
        .eq("id", cvToDelete)
        .eq("user_id", user.id);

      if (error) throw error;

      toast.success("Optimized CV deleted successfully");
      setOptimizedHistory(prev => prev.filter(cv => cv.id !== cvToDelete));
      setDeleteModalOpen(false);
      setCvToDelete(null);
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Failed to delete optimized CV");
    } finally {
      setIsDeleting(false);
    }
  };

  const fetchExistingCVs = async () => {
    setLoadingCVs(true);
    try {
      const response = await fetch("/api/documents?type=cv");
      if (response.ok) {
        const data = await response.json();
        setExistingCVs(data.documents || []);
      }
    } catch (err) {
      console.error("Failed to fetch CVs:", err);
    } finally {
      setLoadingCVs(false);
    }
  };

  const handleSelectExistingCV = async (cv: CVDocument) => {
     if (!cv.text) {
      setError("This resume doesn't have extractable text. Please upload a new one.");
      return;
    }

    setError(null);
    setCvText(cv.text);
    setCurrentDocumentId(cv.id); // Remember the ID for photo extraction later
    setIsUploadModalOpen(false); // Close modal
    setStep("analyzing"); // Start analysis flow

    try {
      // Run ATS analysis with existing CV text
      const analyzeResponse = await fetch("/api/ats/check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cvText: cv.text, useAI: true }),
      });

      if (!analyzeResponse.ok) {
        const analyzeData = await analyzeResponse.json();
        throw new Error(analyzeData.error || "Failed to analyze CV");
      }

      const analyzeData = await analyzeResponse.json();
      setAtsResult(analyzeData.result);
      setStep("result");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Analysis failed");
      setStep("upload"); // Revert to upload state (showing grid)
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    setFile(file);
    setError(null);
    setIsUploadModalOpen(false); // Close modal immediately
    setStep("analyzing"); // Show loading

    try {
      // Step 1: Parse the file to get text
      const formData = new FormData();
      formData.append("file", file);

      const parseResponse = await fetch("/api/ats/parse", {
        method: "POST",
        body: formData,
      });

      if (!parseResponse.ok) {
        const parseData = await parseResponse.json();
        throw new Error(parseData.error || "Failed to parse resume");
      }

      const parseData = await parseResponse.json();
      const parsedText = parseData.text;
      setCvText(parsedText);

      // Step 2: Upload the file to save it (wait for it so we have an ID for photos)
      const uploadFormData = new FormData();
      uploadFormData.append("file", file);

      const uploadResponse = await fetch("/api/cv/upload", {
        method: "POST",
        body: uploadFormData,
      });
      
      const uploadData = await uploadResponse.json();
      
      if (!uploadResponse.ok) {
         throw new Error(`CV Upload Failed: ${uploadData.error || "Unknown error"}`);
      }
      
      if (uploadData.document?.id) {
         setCurrentDocumentId(uploadData.document.id);
      } else {
         throw new Error("CV Upload Failed: No document ID returned from server.");
      }

      // Step 3: Run ATS analysis with cvText
      const analyzeResponse = await fetch("/api/ats/check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cvText: parsedText, useAI: true }),
      });

      if (!analyzeResponse.ok) {
        const analyzeData = await analyzeResponse.json();
        throw new Error(analyzeData.error || "Failed to analyze resume");
      }

      const analyzeData = await analyzeResponse.json();
      setAtsResult(analyzeData.result);
      setStep("result");

    } catch (err) {
      setError(err instanceof Error ? err.message : "Analysis failed");
      setStep("upload"); // Revert to grid
    }
  }, []);


  const performOptimization = async (options?: CVCustomizationOptions) => {
    setStep("optimizing");
    setError(null);

    const activeOptions = options || cvCustomizationOptions;

    try {
      const response = await fetch("/api/ats/optimize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cvText,
          atsResult: {
            overallScore: atsResult!.overallScore,
            categories: atsResult!.categories,
            topIssues: atsResult!.topIssues,
            quickWins: atsResult!.quickWins,
          },
          photoBase64: activeOptions?.photoBase64,
          colorTemplateKey: activeOptions?.colorTemplateKey
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 402) {
          throw new Error("Insufficient credits. Please purchase more credits to optimize your resume.");
        }
        throw new Error(data.error || "Optimization failed");
      }

      setOptimizationResult(data.result);
      setStep("optimized");

      // Refresh history to show the new optimized CV
      fetchOptimizedHistory();

    } catch (err) {
      setError(err instanceof Error ? err.message : "Optimization failed");
      setStep("result");
    }
  };

  const handleOptimize = () => {
    if (!cvText || !atsResult) {
      setError("Missing resume data. Please try uploading again.");
      return;
    }

    setIsCVCustomizationModalOpen(true);
  };

  const handleCustomizationConfirm = (options: CVCustomizationOptions) => {
    setIsCVCustomizationModalOpen(false);
    setCvCustomizationOptions(options);

    creditConfirm.requestCredit({
      action: "CV Optimization",
      creditsRequired: 1,
      onConfirm: () => performOptimization(options),
    });
  };

  const handleCustomizationSkip = () => {
    setIsCVCustomizationModalOpen(false);
    
    creditConfirm.requestCredit({
      action: "CV Optimization",
      creditsRequired: 1,
      onConfirm: () => performOptimization(),
    });
  };

  const handlePreviewCV = async () => {
    if (!optimizationResult?.pdfUrl) return;

    try {
      const response = await fetch(optimizationResult.pdfUrl);
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      setPdfPreviewUrl(blobUrl);
      setIsPreviewOpen(true);
    } catch (err) {
      console.error("Failed to load PDF preview:", err);
    }
  };

  const handleClosePreview = () => {
    setIsPreviewOpen(false);
    if (pdfPreviewUrl) {
      URL.revokeObjectURL(pdfPreviewUrl);
      setPdfPreviewUrl(null);
    }
  };

  const handleDownloadCV = async () => {
    if (!optimizationResult?.pdfUrl) return;

    try {
      const response = await fetch(optimizationResult.pdfUrl);
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = optimizationResult.pdfUrl.split("/").pop() || "Optimized_CV.pdf";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(blobUrl);
      handleClosePreview();
    } catch (err) {
      console.error("Failed to download PDF:", err);
    }
  };

  const handleReset = () => {
    setStep("upload");
    setFile(null);
    setCvText(null);
    setError(null);
    setAtsResult(null);
    setOptimizationResult(null);
    setCurrentDocumentId(null);
    setIsUploadModalOpen(false); // Ensure modal is closed
  };

  // Main Render
  return (
    <Container>
      {/* Header - Always visible unless in deep wizard steps? 
          Actually reports page hides grid when details are shown (routing). 
          Here we have steps. Let's hide grid if not in 'upload' step. 
      */}
      
      {step === 'upload' ? (
        <>
          <Header>
            <TitleElements>
              <Title>ATS Optimizer</Title>
              <Subtitle>
                Optimize your CV specifically for ATS systems using AI. We analyze keywords, formatting, and structure.
              </Subtitle>
            </TitleElements>
            <CreditsCardWrapper>
              <CreditsCard />
            </CreditsCardWrapper>
          </Header>
          
          {/* FAB replaces the header button */}
          <JobFAB onClick={() => setIsUploadModalOpen(true)} title="Upload Resume">
            <PlusIcon />
          </JobFAB>

          {loadingHistory ? (
             <HistoryGridSkeleton />
          ) : optimizedHistory.length === 0 ? (
            <ATSEmptyHero>
              <ATSOrbA />
              <ATSOrbB />
              <ATSHeroSpecular />

              <ATSHeroIconBadge>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </ATSHeroIconBadge>

              <ATSHeroTitle>Run your first ATS check</ATSHeroTitle>
              <ATSHeroSubtitle>
                Upload your CV and instantly see how well it passes Applicant Tracking Systems — then generate a fully optimized version.
              </ATSHeroSubtitle>

              <ATSStepsRow>
                <ATSStep>
                  <ATSStepNum $n={1}>1</ATSStepNum>
                  <ATSStepText>Upload your CV in PDF or DOCX format</ATSStepText>
                </ATSStep>
                <ATSStepConnector />
                <ATSStep>
                  <ATSStepNum $n={2}>2</ATSStepNum>
                  <ATSStepText>Get your ATS score across key categories</ATSStepText>
                </ATSStep>
                <ATSStepConnector />
                <ATSStep>
                  <ATSStepNum $n={3}>3</ATSStepNum>
                  <ATSStepText>Download an ATS-optimized version of your CV</ATSStepText>
                </ATSStep>
              </ATSStepsRow>

              <ATSCTARow>
                {credits.credits > 0 || credits.hasSubscription ? (
                  <ATSCTAButton onClick={() => setIsUploadModalOpen(true)}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                      <polyline points="16 16 12 12 8 16"/>
                      <line x1="12" y1="12" x2="12" y2="21"/>
                      <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"/>
                    </svg>
                    Start Optimization
                  </ATSCTAButton>
                ) : (
                  <ATSCTAButton onClick={() => router.push('/billing')} style={{
                      background: 'rgba(255, 255, 255, 0.1)',
                      backdropFilter: 'blur(20px)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      color: 'white',
                      boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.2)'
                  }}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" style={{ width: 18, height: 18 }}>
                      <path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                    </svg>
                    Unlock Optimizer
                  </ATSCTAButton>
                )}
                <ATSCTASecondary onClick={() => (credits.credits > 0 || credits.hasSubscription) ? setIsUploadModalOpen(true) : router.push('/billing')}>
                  {(credits.credits > 0 || credits.hasSubscription) ? (
                    <>
                      PDF or DOCX supported
                      {(credits.credits <= 3 && !credits.hasSubscription) && ` • ${credits.credits} credit${credits.credits !== 1 ? 's' : ''} remaining`}
                    </>
                  ) : (
                    'Ready for your next breakthrough? Unlock credits to continue.'
                  )}
                </ATSCTASecondary>
              </ATSCTARow>
            </ATSEmptyHero>
          ) : (
            <HistorySection>
              <HistorySectionHeader>
                <HistoryTitle>Optimization History</HistoryTitle>
              </HistorySectionHeader>
              <HistoryGrid>
              {optimizedHistory.map((cv) => (
                <OptimizedCVCard key={cv.id} onClick={() => handleHistoryCardClick(cv)}>
                  <CardContent>
                    <ContentInner className="cv-content">
                      <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px', marginBottom: '8px' }}>
                        <span style={{ fontSize: '24px', color: 'var(--text-secondary)', textDecoration: 'line-through', fontWeight: 600 }}>{cv.before_score}%</span>
                        <ScoreValue $score={cv.after_score}>{cv.after_score}</ScoreValue>
                      </div>
                      


                      <ReportTitle>
                        {cv.contact_name || "Optimized CV"}
                      </ReportTitle>
                      <ReportMeta>
                         {formatDate(cv.created_at)}
                      </ReportMeta>
                    </ContentInner>

                     <CTAContainer className="cv-cta" onClick={(e) => e.stopPropagation()}>
                        <CTALink>
                          View Result
                          <ArrowRightIcon />
                        </CTALink>
                        <CardActions>
                          <ActionButton
                            $variant="danger"
                            onClick={(e) => handleDeleteClick(cv.id, e)}
                          >
                            <DeleteIcon />
                          </ActionButton>
                        </CardActions>
                      </CTAContainer>
                  </CardContent>
                  <Overlay className="cv-overlay" />
                </OptimizedCVCard>
              ))}
              </HistoryGrid>
            </HistorySection>
          )}


        </>
      ) : (
        /* Not in 'upload' step - render the wizard content (Analyzing, Result, Optimized) */
        /* Reusing existing ResultsSection logic but wrapped in Container */
        <>
          {/* We might want a back button here to go back to grid */}
           {(step === 'result' || step === 'optimized') && (
             <div style={{ marginBottom: 20 }}>
               <Button variant="ghost" onClick={handleReset}>
                ← Back to Dashboard
               </Button>
             </div>
           )}

          {/* Result Step */}
          {step === "result" && atsResult && (() => {
             // ... [Reuse existing logic for calculating props] ...
             const categoriesForAnalysis: Record<string, CategoryScore> = Object.entries(atsResult.categories).reduce((acc, [key, cat]) => {
                acc[key] = {
                  earnedPoints: cat.earnedPoints,
                  maxPoints: cat.maxPoints,
                  percentage: (cat.earnedPoints / cat.maxPoints) * 100
                };
                return acc;
              }, {} as Record<string, CategoryScore>);
              const scoreAnalysis = analyzeScore(atsResult.overallScore, categoriesForAnalysis);
              return (
                <ResultsSection>
                   {/* ... content ... */}
                   <ATSFullResult 
                      score={atsResult.overallScore}
                      summary={atsResult.summary}
                      categories={atsResult.categories}
                      hasContactInfo={atsResult.metadata?.hasContactInfo || { email:false, phone:false, linkedin:false, location:false }}
                      parsingChecks={atsResult.parsingChecks || { singleColumn: { ok: false, note: "" }, standardSections: { ok: false, note: "" }, cleanCharacters: { ok: false, note: "" }, abbreviations: { ok: false, note: "" } }}
                      keywordStats={atsResult.metadata?.keywordStats || { hardSkillsCount: 0, softSkillsCount: 0, actionVerbsCount: 0, quantifiedAchievements: 0 }}
                      wordCount={atsResult.metadata?.wordCount || 0}
                      topIssues={atsResult.topIssues}
                      potentialScore={scoreAnalysis.maxPotential}
                      easyWinsPoints={scoreAnalysis.easyWinsPoints}
                      onOptimize={handleOptimize}
                   />
                   {/* ... Error & Try Again ... */}
                   {error && <ErrorMessage>{error}</ErrorMessage>}
                </ResultsSection>
              )
          })()}

          {/* Optimized Step */}
          {step === "optimized" && optimizationResult && (() => {
             const optResult = optimizationResult.optimizedAtsResult;
             return (
               <ResultsSection>
                 <ATSFullResult 
                    isOptimized={true}
                    score={optimizationResult.afterScore}
                    beforeScore={optimizationResult.beforeScore}
                    summary={optResult?.summary || "Optimized."}
                    categories={optResult?.categories || { format:{earnedPoints:0, maxPoints:0, issues:[], passes:[]} } as any}
                    hasContactInfo={optResult?.metadata?.hasContactInfo || { email: false, phone: false, linkedin: false, location: false }}
                    parsingChecks={optResult?.parsingChecks || { singleColumn: { ok: false, note: "" }, standardSections: { ok: false, note: "" }, cleanCharacters: { ok: false, note: "" }, abbreviations: { ok: false, note: "" } }}
                    keywordStats={optResult?.metadata?.keywordStats || { hardSkillsCount: 0, softSkillsCount: 0, actionVerbsCount: 0, quantifiedAchievements: 0 }}
                    wordCount={optResult?.metadata?.wordCount || 0}
                    changes={optimizationResult.changes}
                    downloadUrl={optimizationResult.pdfUrl}
                    onPreview={handlePreviewCV}
                 />
                 <div style={{ textAlign: "center", marginTop: 24 }}>
                   <SecondaryButton onClick={handleReset}>Optimize Another CV</SecondaryButton>
                 </div>
               </ResultsSection>
             )
          })()}
        </>
      )}

      {/* Upload Modal */}
      <Modal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        showCloseButton={false}
        size="md"
      >
        <ATSModalHeaderInner>
          <ATSModalIconBadge>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
          </ATSModalIconBadge>
          <ATSModalHeadTitle>Start New Optimization</ATSModalHeadTitle>
          <ATSModalHeadSub>Upload a CV or select one you’ve already uploaded</ATSModalHeadSub>
          <ATSModalCloseBtn onClick={() => setIsUploadModalOpen(false)} aria-label="Close">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M18 6L6 18M6 6l12 12"/>
            </svg>
          </ATSModalCloseBtn>
        </ATSModalHeaderInner>

        <ATSUploadBody>
          {/* Drop Zone */}
          <input
            id="ats-file-input"
            type="file"
            accept=".pdf,.docx"
            style={{ display: 'none' }}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) { setFile(file); onDrop([file]); }
            }}
          />
          <ATSDropZone
            $isDragOver={false}
            $hasFile={!!_file}
            onClick={() => document.getElementById('ats-file-input')?.click()}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              const file = e.dataTransfer.files?.[0];
              if (file) { setFile(file); onDrop([file]); }
            }}
          >
            {_file ? (
              <ATSFileChip onClick={(e) => e.stopPropagation()}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" style={{ width: 16, height: 16, color: '#818cf8', flexShrink: 0 }}>
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                  <polyline points="14 2 14 8 20 8"/>
                </svg>
                <ATSFileChipName>{_file.name}</ATSFileChipName>
                <ATSFileChipSize>{(_file.size / (1024*1024)).toFixed(1)} MB</ATSFileChipSize>
                <ATSFileChipClear onClick={(e) => { e.stopPropagation(); setFile(null); }}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                    <path d="M18 6L6 18M6 6l12 12"/>
                  </svg>
                </ATSFileChipClear>
              </ATSFileChip>
            ) : (
              <>
                <ATSDropIconRing>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                    <polyline points="16 16 12 12 8 16"/>
                    <line x1="12" y1="12" x2="12" y2="21"/>
                    <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"/>
                  </svg>
                </ATSDropIconRing>
                <ATSDropTitle>Drop your CV here</ATSDropTitle>
                <ATSDropSub>PDF or DOCX · max 5 MB · click to browse</ATSDropSub>
              </>
            )}
          </ATSDropZone>

          {/* Divider */}
          <ATSDivider>or select from your uploads</ATSDivider>

          {/* Existing CV accordion */}
          <ATSCVAccordion>
            <ATSCVAccordionHeader onClick={() => setShowExistingCVs(!showExistingCVs)}>
              <span>My uploaded resumes ({existingCVs.length})</span>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"
                style={{ transform: showExistingCVs ? 'rotate(180deg)' : 'rotate(0deg)' }}>
                <path d="M19 9l-7 7-7-7"/>
              </svg>
            </ATSCVAccordionHeader>
            {showExistingCVs && (
              <ATSCVList>
                {loadingCVs ? (
                  <div style={{ display: 'flex', justifyContent: 'center', padding: '16px' }}>
                    <Spinner />
                  </div>
                ) : existingCVs.length === 0 ? (
                  <div style={{ padding: '16px', fontSize: '13px', color: 'rgba(255,255,255,0.28)', textAlign: 'center' }}>
                    No uploaded resumes yet
                  </div>
                ) : existingCVs.map(cv => (
                  <ATSCVItem key={cv.id} onClick={() => handleSelectExistingCV(cv)}>
                    <ATSCVItemName>{cv.title}</ATSCVItemName>
                    <ATSCVItemDate>{formatDate(cv.created_at)}</ATSCVItemDate>
                  </ATSCVItem>
                ))}
              </ATSCVList>
            )}
          </ATSCVAccordion>

          {error && <ErrorMessage>{error}</ErrorMessage>}

          {/* Start CTA */}
          {credits.credits > 0 || credits.hasSubscription ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <ATSUploadPrimaryBtn
                disabled={!_file}
                onClick={() => {
                  if (_file) { setIsUploadModalOpen(false); }
                }}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <path d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                {_file ? 'Start Optimization' : 'Select or upload a CV first'}
              </ATSUploadPrimaryBtn>
              {(credits.credits <= 3 && !credits.hasSubscription) && (
                <div style={{ textAlign: 'center', fontSize: '12px', color: 'rgba(255, 255, 255, 0.4)', marginTop: '4px' }}>
                  {credits.credits} credit{credits.credits !== 1 ? 's' : ''} remaining
                </div>
              )}
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <ATSUploadPrimaryBtn
                  onClick={() => router.push('/billing')}
                  style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    color: 'white',
                    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.2)'
                  }}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" style={{ width: 18, height: 18 }}>
                  <path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                </svg>
                Unlock Optimizer
              </ATSUploadPrimaryBtn>
              <div style={{ textAlign: 'center', fontSize: '12px', color: 'rgba(255, 255, 255, 0.5)', letterSpacing: '-0.01em' }}>
                Ready for your next breakthrough? Unlock credits to continue.
              </div>
            </div>
          )}
        </ATSUploadBody>
      </Modal>

      {/* Loading Modals */}
      <LoadingModal
        isOpen={step === "analyzing"}
        title="Analyzing Your CV"
        messages={[
          "Scanning your resume like a detective...",
           // ... same messages ...
          "Almost there, hang tight...",
        ]}
        steps={[
          { label: "Format", active: true },
          { label: "Structure", active: true },
          { label: "Content", active: false },
        ]}
      />

      <LoadingModal
        isOpen={step === "optimizing"}
        title="Optimizing Your CV"
        messages={[
          "Supercharging your resume...",
           // ... same messages ...
          "Almost perfect, just a moment...",
        ]}
        steps={[
          { label: "Analyze", completed: true },
          { label: "Optimize", active: true },
          { label: "Generate", active: false },
        ]}
      />

       {/* CV Preview Modal */}
       <AnimatePresence>
        {isPreviewOpen && (
          <PreviewModalOverlay
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={handleClosePreview}
          >
            <PreviewModalContent
              onClick={(e) => e.stopPropagation()}
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
            >
              <ATSModalHeaderInner>
                <ATSModalIconBadge>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                    <path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                  </svg>
                </ATSModalIconBadge>
                <ATSModalHeadTitle>CV Preview</ATSModalHeadTitle>
                <ATSModalHeadSub>Review your optimized resume before downloading</ATSModalHeadSub>
                <ATSModalCloseBtn onClick={handleClosePreview} aria-label="Close">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                    <path d="M18 6L6 18M6 6l12 12"/>
                  </svg>
                </ATSModalCloseBtn>
              </ATSModalHeaderInner>

              <PreviewModalBody>
                 <PDFPreviewContainer style={{ height: '100%', borderRadius: '16px', overflow: 'hidden', background: 'white' }}>
                   {pdfPreviewUrl ? (
                     <iframe
                       src={`${pdfPreviewUrl}#toolbar=0&navpanes=0&scrollbar=0&view=FitH`}
                       title="CV Preview"
                       style={{ width: '100%', height: '100%', border: 'none' }}
                     />
                   ) : <div style={{ display:'flex', justifyContent:'center', alignItems:'center', height:'100%', color: 'black' }}><Spinner /></div>}
                 </PDFPreviewContainer>
              </PreviewModalBody>

              <PreviewModalFooter>
                <PreviewSecondaryBtn onClick={handleClosePreview}>Cancel</PreviewSecondaryBtn>
                <ATSUploadPrimaryBtn onClick={handleDownloadCV} style={{ width: 'auto' }}>
                  <DownloadIcon /> 
                  Download PDF
                </ATSUploadPrimaryBtn>
              </PreviewModalFooter>
            </PreviewModalContent>
          </PreviewModalOverlay>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Delete Optimized CV"
        size="sm"
      >
        <Modal.Body>
          <p style={{ color: 'var(--text-secondary)' }}>
            Are you sure you want to delete this optimized CV? This action cannot be undone.
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="ghost" onClick={() => setDeleteModalOpen(false)} disabled={isDeleting}>
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={handleDeleteConfirm}
            disabled={isDeleting}
          >
            {isDeleting ? <Spinner size="sm" /> : "Delete"}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* CV Customization Modal */}
      <CVCustomizationModal
        isOpen={isCVCustomizationModalOpen}
        onClose={() => setIsCVCustomizationModalOpen(false)}
        onConfirm={handleCustomizationConfirm}
        onSkip={handleCustomizationSkip}
        documentId={currentDocumentId || undefined}
        metricQuestions={
          atsResult?.metricQuestions || [
            {
              id: "test_ats_1",
              original_bullet: "Organized a team.",
              question: "How many people were in the team?"
            }
          ]
        }
      />

      {/* Floating Action Button */}
      {step !== "analyzing" && step !== "optimizing" && (
        <FAB onClick={() => setIsUploadModalOpen(true)} aria-label="Optimize another resume">
          <PlusIcon />
        </FAB>
      )}
    </Container>
  );
}
