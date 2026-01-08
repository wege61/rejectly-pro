"use client";

import styled, { keyframes } from "styled-components";
import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import {
  analyzeScore,
  getCategoryImpact,
  getCategoryImpactEmoji,
  generateQuickFixes,
  type CategoryScore,
} from "@/lib/ats/scoring";
import { ATSFullResult } from "@/components/ats";
import { useCredits } from "@/contexts/CreditsContext";
import { useCreditConfirm } from "@/hooks/useCreditConfirm";
import { CreditConfirmModal } from "@/components/credits";

type Step = "upload" | "analyzing" | "result" | "optimizing" | "optimized";

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
    impact: string;
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

const spin = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

const pulse = keyframes`
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.02); }
`;

const PageContainer = styled.div`
  min-height: calc(100vh - 64px);
  max-width: 1200px;
  margin: 0 auto;
  padding: ${({ theme }) => theme.spacing["2xl"]};

  @media (max-width: 768px) {
    padding: ${({ theme }) => theme.spacing.lg};
  }
`;

const PageHeader = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing["2xl"]};
  text-align: center;
`;

const PageTitle = styled.h1`
  font-size: ${({ theme }) => theme.typography.fontSize["3xl"]};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.textPrimary};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const PageSubtitle = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const ContentCard = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.lg};
  padding: ${({ theme }) => theme.spacing["2xl"]};
`;

const DropzoneArea = styled.div<{ $isDragActive: boolean; $hasFile: boolean }>`
  border: 2px dashed ${({ $isDragActive, $hasFile, theme }) =>
    $isDragActive ? "#6366f1" : $hasFile ? "#10b981" : theme.colors.border};
  border-radius: 16px;
  padding: 48px;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s ease;
  background: ${({ $isDragActive, $hasFile }) =>
    $isDragActive ? "rgba(99, 102, 241, 0.05)" :
    $hasFile ? "rgba(16, 185, 129, 0.05)" : "transparent"};

  &:hover {
    border-color: #6366f1;
    background: rgba(99, 102, 241, 0.03);
  }
`;

const UploadIcon = styled.div`
  width: 64px;
  height: 64px;
  margin: 0 auto 20px;
  border-radius: 16px;
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  display: flex;
  align-items: center;
  justify-content: center;

  svg {
    width: 32px;
    height: 32px;
    color: white;
  }
`;

const DropzoneText = styled.p`
  font-size: 16px;
  color: ${({ theme }) => theme.colors.textPrimary};
  margin-bottom: 8px;
  font-weight: 500;
`;

const DropzoneSubtext = styled.p`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.textSecondary};
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

// Loading State
const LoadingContainer = styled.div`
  text-align: center;
  padding: 60px 20px;
`;

const Spinner = styled.div`
  width: 60px;
  height: 60px;
  border: 4px solid ${({ theme }) => theme.colors.border};
  border-top-color: #6366f1;
  border-radius: 50%;
  margin: 0 auto 24px;
  animation: ${spin} 1s linear infinite;
`;

const LoadingText = styled.p`
  font-size: 18px;
  color: ${({ theme }) => theme.colors.textPrimary};
  font-weight: 500;
  margin-bottom: 8px;
`;

const LoadingSubtext = styled.p`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

// Results Section
const ResultsSection = styled.div`
  animation: fadeIn 0.5s ease;

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;

const ScoreCard = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 20px;
  padding: 40px;
  text-align: center;
  margin-bottom: 32px;
`;

const ScoreCircle = styled.div<{ $score: number }>`
  width: 180px;
  height: 180px;
  border-radius: 50%;
  margin: 0 auto 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: conic-gradient(
    ${({ $score }) =>
      $score >= 80 ? "#10b981" :
      $score >= 60 ? "#f59e0b" :
      $score >= 40 ? "#f97316" : "#ef4444"
    } ${({ $score }) => $score * 3.6}deg,
    ${({ theme }) => theme.colors.border} 0deg
  );
  position: relative;

  &::before {
    content: "";
    position: absolute;
    width: 150px;
    height: 150px;
    border-radius: 50%;
    background: ${({ theme }) => theme.colors.surface};
  }
`;

const ScoreValue = styled.div<{ $score: number }>`
  position: relative;
  z-index: 1;
  font-size: 48px;
  font-weight: 800;
  color: ${({ $score }) =>
    $score >= 80 ? "#10b981" :
    $score >= 60 ? "#f59e0b" :
    $score >= 40 ? "#f97316" : "#ef4444"
  };
`;

const ScoreLabel = styled.div`
  position: relative;
  z-index: 1;
  font-size: 14px;
  color: ${({ theme }) => theme.colors.textSecondary};
  font-weight: 500;
`;

const ScoreTitle = styled.h2<{ $score: number }>`
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 8px;
  color: ${({ $score }) =>
    $score >= 80 ? "#10b981" :
    $score >= 60 ? "#f59e0b" :
    $score >= 40 ? "#f97316" : "#ef4444"
  };
`;

const ScoreSummary = styled.p`
  font-size: 16px;
  color: ${({ theme }) => theme.colors.textSecondary};
  line-height: 1.6;
  max-width: 500px;
  margin: 0 auto;
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

// Optimized Result
const OptimizedCard = styled.div`
  background: linear-gradient(135deg, rgba(16, 185, 129, 0.05) 0%, rgba(99, 102, 241, 0.05) 100%);
  border: 1px solid rgba(16, 185, 129, 0.2);
  border-radius: 20px;
  padding: 40px;
  text-align: center;
  margin-bottom: 32px;
`;

const SuccessIcon = styled.div`
  width: 80px;
  height: 80px;
  margin: 0 auto 24px;
  border-radius: 50%;
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  display: flex;
  align-items: center;
  justify-content: center;

  svg {
    width: 40px;
    height: 40px;
    color: white;
  }
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

const ChangesSection = styled.div`
  text-align: left;
  margin-top: 32px;
`;

const SectionTitle = styled.h3`
  font-size: 18px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textPrimary};
  margin-bottom: 16px;
`;

const ChangeItem = styled.div`
  padding: 16px;
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 12px;
  margin-bottom: 12px;
  display: flex;
  gap: 12px;
`;

const ChangeIcon = styled.div<{ $impact: string }>`
  width: 32px;
  height: 32px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  background: ${({ $impact }) =>
    $impact === "high" ? "rgba(16, 185, 129, 0.1)" :
    $impact === "medium" ? "rgba(99, 102, 241, 0.1)" : "rgba(156, 163, 175, 0.1)"
  };
  color: ${({ $impact }) =>
    $impact === "high" ? "#10b981" :
    $impact === "medium" ? "#6366f1" : "#9ca3af"
  };
`;

const ChangeContent = styled.div`
  flex: 1;
`;

const ChangeIssue = styled.div`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-bottom: 4px;
`;

const ChangeFix = styled.div`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.textPrimary};
  font-weight: 500;
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
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 12px;
  color: ${({ theme }) => theme.colors.textPrimary};
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${({ theme }) => theme.colors.background};
  }
`;

// Helper functions
const getCategoryLabel = (key: string): string => {
  const labels: Record<string, string> = {
    format: "Format & Parsing",
    structure: "Structure & Layout",
    keywords: "Keywords & Content",
    readability: "Readability & Length",
  };
  return labels[key] || key;
};

export default function DashboardATSOptimizerPage() {
  const [step, setStep] = useState<Step>("upload");
  const [file, setFile] = useState<File | null>(null);
  const [cvText, setCvText] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [atsResult, setAtsResult] = useState<ATSResult | null>(null);
  const [optimizationResult, setOptimizationResult] = useState<OptimizationResult | null>(null);

  // Credits system
  const { notifyCreditConsumed } = useCredits();
  const creditConfirm = useCreditConfirm();

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    setFile(file);
    setError(null);
    setStep("analyzing");

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
        throw new Error(parseData.error || "Failed to parse CV");
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
        throw new Error(analyzeData.error || "Failed to analyze CV");
      }

      const analyzeData = await analyzeResponse.json();
      setAtsResult(analyzeData.result);
      setStep("result");

    } catch (err) {
      setError(err instanceof Error ? err.message : "Analysis failed");
      setStep("upload");
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
    },
    maxSize: 5 * 1024 * 1024,
    multiple: false,
  });

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
          throw new Error("Insufficient credits. Please purchase more credits to optimize your CV.");
        }
        throw new Error(data.error || "Optimization failed");
      }

      setOptimizationResult(data.result);
      setStep("optimized");

      // Notify about credit consumption
      notifyCreditConsumed("CV Optimizasyonu");

    } catch (err) {
      setError(err instanceof Error ? err.message : "Optimization failed");
      setStep("result");
    }
  };

  const handleOptimize = () => {
    if (!cvText || !atsResult) {
      setError("Missing CV data. Please try uploading again.");
      return;
    }

    // Request credit confirmation before proceeding
    creditConfirm.requestCredit({
      action: "CV Optimizasyonu",
      creditsRequired: 1,
      onConfirm: performOptimization,
      onCancel: () => {},
    });
  };

  const handleReset = () => {
    setStep("upload");
    setFile(null);
    setCvText(null);
    setError(null);
    setAtsResult(null);
    setOptimizationResult(null);
  };

  return (
    <PageContainer>
      <PageHeader>
        <PageTitle>ATS Optimizer</PageTitle>
        <PageSubtitle>
          Upload your CV to check ATS compatibility and get an optimized version
        </PageSubtitle>
      </PageHeader>

      {/* Upload Step */}
      {step === "upload" && (
        <ContentCard>
          <DropzoneArea {...getRootProps()} $isDragActive={isDragActive} $hasFile={!!file}>
            <input {...getInputProps()} />
            <UploadIcon>
              <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
            </UploadIcon>
            <DropzoneText>
              {isDragActive ? "Drop your resume here" : "Drag & drop your resume"}
            </DropzoneText>
            <DropzoneSubtext>PDF or DOCX (max 5MB) - Analysis starts automatically</DropzoneSubtext>
          </DropzoneArea>
          {error && <ErrorMessage>{error}</ErrorMessage>}
        </ContentCard>
      )}

      {/* Analyzing Step */}
      {step === "analyzing" && (
        <ContentCard>
          <LoadingContainer>
            <Spinner />
            <LoadingText>Analyzing your resume...</LoadingText>
            <LoadingSubtext>Checking format, structure, keywords, and readability</LoadingSubtext>
          </LoadingContainer>
        </ContentCard>
      )}

      {/* Result Step */}
      {step === "result" && atsResult && (() => {
        // Calculate score analysis for quick fixes
        const categoriesForAnalysis: Record<string, CategoryScore> = Object.entries(atsResult.categories).reduce((acc, [key, cat]) => {
          acc[key] = {
            earnedPoints: cat.earnedPoints,
            maxPoints: cat.maxPoints,
            percentage: (cat.earnedPoints / cat.maxPoints) * 100
          };
          return acc;
        }, {} as Record<string, CategoryScore>);

        const scoreAnalysis = analyzeScore(atsResult.overallScore, categoriesForAnalysis);

        // Generate quick fixes
        const issuesForQuickFixes = atsResult.topIssues.map(issue => ({
          issue: issue.issue,
          category: issue.category || 'General',
          fix: issue.suggestion
        }));
        const quickFixes = generateQuickFixes(categoriesForAnalysis, issuesForQuickFixes);

        return (
        <ResultsSection>
          <ATSFullResult
            score={atsResult.overallScore}
            summary={atsResult.summary}
            categories={atsResult.categories}
            hasContactInfo={atsResult.metadata?.hasContactInfo || {
              email: false,
              phone: false,
              linkedin: false,
              location: false,
            }}
            parsingChecks={atsResult.parsingChecks || {
              singleColumn: { ok: true, note: "Unknown" },
              standardSections: { ok: true, note: "Unknown" },
              cleanCharacters: { ok: true, note: "Unknown" },
              abbreviations: { ok: true, note: "Unknown" },
            }}
            keywordStats={atsResult.metadata?.keywordStats || {
              hardSkillsCount: 0,
              softSkillsCount: 0,
              actionVerbsCount: 0,
              quantifiedAchievements: 0,
            }}
            wordCount={atsResult.metadata?.wordCount || 0}
            topIssues={atsResult.topIssues.map(issue => ({
              severity: issue.severity,
              issue: issue.issue,
              recommendation: issue.suggestion,
              category: issue.category,
            }))}
            potentialScore={scoreAnalysis.maxPotential}
            easyWinsPoints={scoreAnalysis.easyWinsPoints}
            onOptimize={handleOptimize}
          />

          {/* Quick Fixes with Impact & Time */}
          {quickFixes.length > 0 && (
            <QuickFixesSection>
              <QuickFixesTitle>
                <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Quick Fixes (Prioritized by Impact)
              </QuickFixesTitle>
              <QuickFixesList>
                {quickFixes.map((fix, idx) => (
                  <QuickFixItem key={idx}>
                    <QuickFixIcon>
                      <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path d="M5 13l4 4L19 7" />
                      </svg>
                    </QuickFixIcon>
                    <QuickFixContent>
                      <QuickFixHeader>
                        <QuickFixText>{fix.fix}</QuickFixText>
                        <QuickFixCategory>{fix.category}</QuickFixCategory>
                      </QuickFixHeader>
                      <QuickFixMeta>
                        <QuickFixImpact>
                          <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                          </svg>
                          {fix.impact}
                        </QuickFixImpact>
                        <QuickFixTime>
                          <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {fix.time}
                        </QuickFixTime>
                      </QuickFixMeta>
                    </QuickFixContent>
                  </QuickFixItem>
                ))}
              </QuickFixesList>
            </QuickFixesSection>
          )}

          {error && <ErrorMessage>{error}</ErrorMessage>}

          <div style={{ textAlign: "center", marginTop: "24px" }}>
            <TryAgainButton onClick={handleReset}>
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Analyze Another Resume
            </TryAgainButton>
          </div>
        </ResultsSection>
        );
      })()}

      {/* Optimizing Step */}
      {step === "optimizing" && (
        <ContentCard>
          <LoadingContainer>
            <Spinner />
            <LoadingText>Optimizing your CV...</LoadingText>
            <LoadingSubtext>Fixing formatting, improving bullets, and enhancing ATS compatibility</LoadingSubtext>
          </LoadingContainer>
        </ContentCard>
      )}

      {/* Optimized Step */}
      {step === "optimized" && optimizationResult && (() => {
        const optResult = optimizationResult.optimizedAtsResult;

        return (
        <ResultsSection>
          <ATSFullResult
            score={optimizationResult.afterScore}
            summary={optResult?.summary || "Your CV has been optimized for ATS compatibility."}
            categories={optResult?.categories || {
              format: { earnedPoints: 25, maxPoints: 25, issues: [], passes: ["Format optimized"] },
              structure: { earnedPoints: 25, maxPoints: 25, issues: [], passes: ["Structure optimized"] },
              keywords: { earnedPoints: 30, maxPoints: 30, issues: [], passes: ["Keywords optimized"] },
              readability: { earnedPoints: 20, maxPoints: 20, issues: [], passes: ["Readability optimized"] },
            }}
            hasContactInfo={optResult?.metadata?.hasContactInfo || {
              email: true,
              phone: true,
              linkedin: true,
              location: true,
            }}
            parsingChecks={optResult?.parsingChecks || {
              singleColumn: { ok: true, note: "Linear text flow detected" },
              standardSections: { ok: true, note: "Standard section headers found" },
              cleanCharacters: { ok: true, note: "Clean character encoding" },
              abbreviations: { ok: true, note: "Abbreviations properly expanded" },
            }}
            keywordStats={optResult?.metadata?.keywordStats || {
              hardSkillsCount: 0,
              softSkillsCount: 0,
              actionVerbsCount: 0,
              quantifiedAchievements: 0,
            }}
            wordCount={optResult?.metadata?.wordCount || 0}
            isOptimized={true}
            beforeScore={optimizationResult.beforeScore}
            changes={optimizationResult.changes}
            downloadUrl={optimizationResult.pdfUrl}
          />

          {/* Additional action button */}
          <div style={{ textAlign: "center", marginTop: "24px" }}>
            <SecondaryButton onClick={handleReset}>
              Try Another CV
            </SecondaryButton>
          </div>
        </ResultsSection>
        );
      })()}

      {/* Credit Confirmation Modal */}
      <CreditConfirmModal
        isOpen={creditConfirm.state.isOpen}
        action={creditConfirm.state.action}
        creditsRequired={creditConfirm.state.creditsRequired}
        currentCredits={creditConfirm.state.currentCredits}
        hasSubscription={creditConfirm.state.hasSubscription}
        isProcessing={creditConfirm.isProcessing}
        canProceed={creditConfirm.canProceed}
        onConfirm={creditConfirm.confirm}
        onCancel={creditConfirm.cancel}
      />
    </PageContainer>
  );
}
