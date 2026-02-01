"use client";

import { createClient } from "@/lib/supabase/client";
import { useToast } from "@/contexts/ToastContext";
import styled, { keyframes, css } from "styled-components";
import { useState, useCallback, useEffect } from "react";
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

const FAB = styled.button`
  position: fixed;
  bottom: ${({ theme }) => theme.spacing["2xl"]};
  right: ${({ theme }) => theme.spacing["2xl"]};
  width: 64px;
  height: 64px;
  border-radius: ${({ theme }) => theme.radius.full};
  background: var(--accent);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8px 24px var(--accent-shadow);
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.normal};
  z-index: 10010;
  border: none;

  &:hover {
    transform: scale(1.1) translateY(-2px);
    box-shadow: 0 12px 32px var(--accent-shadow);
  }

  &:active {
    transform: scale(0.95);
  }

  svg {
    width: 28px;
    height: 28px;
  }
`;

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
  max-width: 1200px;
  margin: 0 auto;
  padding: ${({ theme }) => theme.spacing["2xl"]};

  @media (max-width: 450px) {
    padding: ${({ theme }) => theme.spacing["lg"]};
    padding-top: 32px;
  }
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${({ theme }) => theme.spacing["2xl"]};
`;

const HeaderContent = styled.div``;

const Title = styled.h1`
  font-size: ${({ theme }) => theme.typography.fontSize["3xl"]};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const Subtitle = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  color: ${({ theme }) => theme.colors.textSecondary};
  @media (max-width: 410px) {
    margin-right: 10px;
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
  border-radius: 16px;
  background: var(--bg-alt);
  cursor: pointer;
  transition: all 0.3s ease;
  min-height: 200px;
  /* Subtle depth through shadows */
  box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.03), 0 2px 4px rgba(0, 0, 0, 0.05),
    0 12px 24px rgba(0, 0, 0, 0.05);

  @media (prefers-color-scheme: dark) {
    box-shadow: 0 -20px 80px -20px rgba(255, 255, 255, 0.12) inset;
    border: 1px solid rgba(255, 255, 255, 0.1);
  }

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.12);
  }

  &:hover .cv-content {
    transform: translateY(-32px);
  }

  &:hover .cv-cta {
    transform: translateY(0);
    opacity: 1;
  }

  &:hover .cv-overlay {
    background: rgba(0, 0, 0, 0.03);
  }

  @media (prefers-color-scheme: dark) {
    &:hover .cv-overlay {
      background: rgba(255, 255, 255, 0.05);
    }
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
    $score >= 80 ? "#10b981" :
    $score >= 60 ? "#f59e0b" :
    $score >= 40 ? "#f97316" : "#ef4444"};
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

// Percentile Badge (Faz 1)
const PercentileBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  margin-top: 16px;
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%);
  border: 1px solid rgba(99, 102, 241, 0.2);
  border-radius: 20px;
  font-size: 14px;
  font-weight: 600;
  color: #6366f1;
`;

const PercentileMessage = styled.p`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-top: 8px;
  font-weight: 500;
`;

// Improvement Potential Section (Faz 1)
const ImprovementPotentialSection = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 16px;
  padding: 20px 24px;
  margin-bottom: 24px;
`;

const ImprovementHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
`;

const ImprovementTitle = styled.h3`
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const ImprovementScores = styled.span`
  font-size: 14px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const ImprovementBar = styled.div`
  height: 12px;
  background: ${({ theme }) => theme.colors.border};
  border-radius: 6px;
  overflow: hidden;
  position: relative;
`;

const ImprovementCurrent = styled.div<{ $score: number }>`
  position: absolute;
  height: 100%;
  width: ${({ $score }) => $score}%;
  background: linear-gradient(90deg, #f59e0b 0%, #f97316 100%);
  border-radius: 6px;
  transition: width 0.5s ease;
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
    return percentage >= 80 ? "#10b981" :
           percentage >= 60 ? "#f59e0b" :
           percentage >= 40 ? "#f97316" : "#ef4444";
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
  background: var(--bg-alt);
  border: none;
  border-radius: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: left;
  overflow: hidden;
  height: 140px;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;

  /* Subtle depth through shadows - matching cv/page.tsx */
  box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.03), 0 2px 4px rgba(0, 0, 0, 0.05),
    0 12px 24px rgba(0, 0, 0, 0.05);

  @media (prefers-color-scheme: dark) {
    box-shadow: 0 -20px 80px -20px rgba(255, 255, 255, 0.12) inset;
    border: 1px solid rgba(255, 255, 255, 0.1);
  }

  &:hover {
    transform: translateY(-4px);
   
  }

  &:hover .cv-mini-content {
    transform: translateY(-8px);
  }

  &:hover .cv-mini-icon {
    transform: scale(0.85);
  }

  &:hover .cv-mini-overlay {
    background: rgba(0, 0, 0, 0.03);
  }

  &:hover .cv-mini-arrow {
    transform: translateY(-50%) translateX(4px);
    opacity: 1;
  }

  @media (prefers-color-scheme: dark) {
    &:hover .cv-mini-overlay {
      background: rgba(255, 255, 255, 0.05);
    }
  }

  @media (max-width: 1024px) {
    &:hover .cv-mini-content {
      transform: none;
    }
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
  padding: 8px 16px;
  background: rgba(16, 185, 129, 0.1);
  border-radius: 20px;
  font-size: 16px;
  font-weight: 600;
  color: #10b981;
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
`;

const HistorySectionHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
`;

const HistoryTitle = styled.h3`
  font-size: ${({ theme }) => theme.typography.fontSize.xl};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
`;

const HistoryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px;
`;

const HistoryCard = styled.div`
  position: relative;
  background: var(--bg-alt);
  border: none;
  border-radius: 16px;
  padding: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  overflow: hidden;
  height: 180px;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;

  /* Subtle depth through shadows - matching CVCard */
  box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.03), 0 2px 4px rgba(0, 0, 0, 0.05),
    0 12px 24px rgba(0, 0, 0, 0.05);

  @media (prefers-color-scheme: dark) {
    box-shadow: 0 -20px 80px -20px rgba(255, 255, 255, 0.12) inset;
    border: 1px solid rgba(255, 255, 255, 0.1);
  }

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.12);
  }

  &:hover .history-content {
    transform: translateY(-8px);
  }

  &:hover .history-icon {
    transform: scale(0.85);
  }

  &:hover .history-overlay {
    background: rgba(0, 0, 0, 0.03);
  }

  &:hover .history-arrow {
    transform: translateY(-50%) translateX(4px);
    opacity: 1;
  }

  @media (prefers-color-scheme: dark) {
    &:hover .history-overlay {
      background: rgba(255, 255, 255, 0.05);
    }
  }

  @media (max-width: 1024px) {
    &:hover .history-content {
      transform: none;
    }
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

export default function DashboardATSOptimizerPage() {
  const [step, setStep] = useState<Step>("upload");
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [_file, setFile] = useState<File | null>(null);
  const [cvText, setCvText] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [atsResult, setAtsResult] = useState<ATSResult | null>(null);
  const [optimizationResult, setOptimizationResult] = useState<OptimizationResult | null>(null);

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
    setIsUploadModalOpen(false); // Close modal
    setStep("analyzing"); // Start analysis flow

    try {
      // Run ATS analysis with existing CV text
      const analyzeResponse = await fetch("/api/ats/check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cvText: cv.text }),
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

      // Step 2: Upload the file to save it (in background)
      const uploadFormData = new FormData();
      uploadFormData.append("file", file);

      fetch("/api/cv/upload", {
        method: "POST",
        body: uploadFormData,
      }).catch(console.error);

      // Step 3: Run ATS analysis with cvText
      const analyzeResponse = await fetch("/api/ats/check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cvText: parsedText }),
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


  const performOptimization = async () => {
    setStep("optimizing");
    setError(null);

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
          }
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

    creditConfirm.requestCredit({
      action: "CV Optimization",
      creditsRequired: 1,
      onConfirm: performOptimization,
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
            <HeaderContent>
              <Title>ATS Optimizer</Title>
              <Subtitle>
                Upload your resume to check ATS compatibility and get an optimized version
              </Subtitle>
            </HeaderContent>
            {/* FAB replaces the header button */}
          </Header>

          {loadingHistory ? (
             <HistoryGridSkeleton />
          ) : optimizedHistory.length === 0 ? (
            <Card variant="bordered">
              <EmptyState
                icon={<EmptyState.DocumentIcon />}
                title="No optimized resumes yet"
                description="Upload a CV to start optimizing for ATS systems."
                action={{
                  label: "Start Optimization",
                  onClick: () => setIsUploadModalOpen(true),
                }}
              />
            </Card>
          ) : (
            <OptimizedCVGrid>
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
            </OptimizedCVGrid>
          )}

          {/* FAB for Upload */}
          <FAB onClick={() => setIsUploadModalOpen(true)}>
            <PlusIcon />
          </FAB>
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
                      parsingChecks={atsResult.parsingChecks}
                      keywordStats={atsResult.metadata?.keywordStats}
                      wordCount={atsResult.metadata?.wordCount}
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
                    hasContactInfo={optResult?.metadata?.hasContactInfo}
                    parsingChecks={optResult?.parsingChecks}
                    keywordStats={optResult?.metadata?.keywordStats}
                    wordCount={optResult?.metadata?.wordCount}
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

      {/* Upload Modal - Replaces inline file upload */}
      <Modal 
        isOpen={isUploadModalOpen} 
        onClose={() => setIsUploadModalOpen(false)}
        title="Start New Optimization"
        size="md"
      >
        <Modal.Body>
          <FileUpload
            accept=".pdf,.docx"
            onChange={(files) => {
              if (files.length > 0) onDrop(files);
            }}
          />
           
           {/* Existing CV Selection Logic inside Modal */}
           <div style={{ marginTop: 24 }}>
              <div 
                style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', gap: 8, color: 'var(--text-secondary)' }}
                onClick={() => setShowExistingCVs(!showExistingCVs)}
              >
                  <span>Select from uploaded resumes</span>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ transform: showExistingCVs ? 'rotate(180deg)' : 'rotate(0deg)' }}>
                    <path d="M19 9l-7 7-7-7" />
                  </svg>
              </div>

              {showExistingCVs && (
                 <div style={{ marginTop: 12, display: 'grid', gap: 8, maxHeight: 300, overflowY: 'auto' }}>
                    {loadingCVs ? <Spinner /> : existingCVs.map(cv => (
                       <div 
                          key={cv.id} 
                          onClick={() => handleSelectExistingCV(cv)}
                          style={{ 
                            padding: 12, 
                            border: '1px solid var(--border)', 
                            borderRadius: 8, 
                            cursor: 'pointer',
                            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                            background: 'var(--bg-alt)'
                          }}
                       >
                          <span style={{ fontWeight: 500 }}>{cv.title}</span>
                          <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{formatDate(cv.created_at)}</span>
                       </div>
                    ))}
                 </div>
              )}
           </div>

           {error && <ErrorMessage>{error}</ErrorMessage>}
        </Modal.Body>
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
      <Modal
        isOpen={isPreviewOpen}
        onClose={handleClosePreview}
        title="CV Preview"
        description="Review your optimized resume before downloading"
        size="lg"
      >
        <Modal.Body>
           <PDFPreviewContainer>
             {pdfPreviewUrl ? (
               <iframe
                 src={`${pdfPreviewUrl}#toolbar=0&navpanes=0&scrollbar=0&view=FitH`}
                 title="CV Preview"
                 style={{ width: '100%', height: '100%', border: 'none' }}
               />
             ) : <div style={{ display:'flex', justifyContent:'center', alignItems:'center', height:'100%' }}><Spinner /></div>}
           </PDFPreviewContainer>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="ghost" onClick={handleClosePreview}>Close</Button>
          <Button variant="primary" onClick={handleDownloadCV}><DownloadIcon /> Download</Button>
        </Modal.Footer>
      </Modal>

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

    </Container>
  );
}
