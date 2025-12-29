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

  const handleOptimize = async () => {
    if (!cvText || !atsResult) {
      setError("Missing CV data. Please try uploading again.");
      return;
    }

    setStep("optimizing");
    setError(null);

    try {
      const response = await fetch("/api/ats/optimize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cvText,
          atsResult: {
            overallScore: atsResult.overallScore,
            categories: atsResult.categories,
            topIssues: atsResult.topIssues,
            quickWins: atsResult.quickWins,
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

    } catch (err) {
      setError(err instanceof Error ? err.message : "Optimization failed");
      setStep("result");
    }
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
        // Faz 1: Calculate score analysis
        const categoriesForAnalysis: Record<string, CategoryScore> = Object.entries(atsResult.categories).reduce((acc, [key, cat]) => {
          acc[key] = {
            earnedPoints: cat.earnedPoints,
            maxPoints: cat.maxPoints,
            percentage: (cat.earnedPoints / cat.maxPoints) * 100
          };
          return acc;
        }, {} as Record<string, CategoryScore>);

        const scoreAnalysis = analyzeScore(atsResult.overallScore, categoriesForAnalysis);

        // Faz 2: Generate quick fixes - convert topIssues to expected format
        const issuesForQuickFixes = atsResult.topIssues.map(issue => ({
          issue: issue.issue,
          category: issue.category || 'General',
          fix: issue.suggestion
        }));
        const quickFixes = generateQuickFixes(categoriesForAnalysis, issuesForQuickFixes);

        return (
        <ResultsSection>
          <ScoreCard>
            <ScoreCircle $score={atsResult.overallScore}>
              <ScoreValue $score={atsResult.overallScore}>{atsResult.overallScore}</ScoreValue>
              <ScoreLabel>out of 100</ScoreLabel>
            </ScoreCircle>
            <ScoreTitle $score={atsResult.overallScore}>
              {scoreAnalysis.label}
            </ScoreTitle>
            <ScoreSummary>{atsResult.summary}</ScoreSummary>

            {/* Faz 1: Percentile Badge */}
            <PercentileBadge>
              <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
              {scoreAnalysis.percentile}
            </PercentileBadge>
            <PercentileMessage>{scoreAnalysis.percentileMessage}</PercentileMessage>

            {/* Contact Info Checklist */}
            {atsResult.metadata?.hasContactInfo && (
              <ContactChecklist>
                <ContactItem $present={atsResult.metadata.hasContactInfo.email}>
                  {atsResult.metadata.hasContactInfo.email ? "✓" : "✗"} Email
                </ContactItem>
                <ContactItem $present={atsResult.metadata.hasContactInfo.phone}>
                  {atsResult.metadata.hasContactInfo.phone ? "✓" : "✗"} Phone
                </ContactItem>
                <ContactItem $present={atsResult.metadata.hasContactInfo.linkedin}>
                  {atsResult.metadata.hasContactInfo.linkedin ? "✓" : "✗"} LinkedIn
                </ContactItem>
                <ContactItem $present={atsResult.metadata.hasContactInfo.location}>
                  {atsResult.metadata.hasContactInfo.location ? "✓" : "✗"} Location
                </ContactItem>
              </ContactChecklist>
            )}
          </ScoreCard>

          {/* Faz 1: Improvement Potential */}
          <ImprovementPotentialSection>
            <ImprovementHeader>
              <ImprovementTitle>Your Improvement Potential</ImprovementTitle>
              <ImprovementScores>
                {atsResult.overallScore} → {scoreAnalysis.maxPotential}
              </ImprovementScores>
            </ImprovementHeader>
            <ImprovementBar>
              <ImprovementPotential $max={scoreAnalysis.maxPotential} />
              <ImprovementCurrent $score={atsResult.overallScore} />
            </ImprovementBar>
            <ImprovementText>
              With quick fixes, you can realistically reach {scoreAnalysis.maxPotential} points
              (+{scoreAnalysis.easyWinsPoints} points from easy improvements)
            </ImprovementText>
          </ImprovementPotentialSection>

          {/* ATS System Compatibility */}
          {atsResult.atsCompatibility && (
            <ATSCompatibilitySection>
              <ATSCompatibilityTitle>
                <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                </svg>
                ATS System Compatibility
              </ATSCompatibilityTitle>
              <ATSSystemsGrid>
                <ATSSystemCard $level={atsResult.atsCompatibility.workday}>
                  <ATSSystemName>Workday</ATSSystemName>
                  <ATSSystemLevel $level={atsResult.atsCompatibility.workday}>
                    {atsResult.atsCompatibility.workday}
                  </ATSSystemLevel>
                </ATSSystemCard>
                <ATSSystemCard $level={atsResult.atsCompatibility.greenhouse}>
                  <ATSSystemName>Greenhouse</ATSSystemName>
                  <ATSSystemLevel $level={atsResult.atsCompatibility.greenhouse}>
                    {atsResult.atsCompatibility.greenhouse}
                  </ATSSystemLevel>
                </ATSSystemCard>
                <ATSSystemCard $level={atsResult.atsCompatibility.taleo}>
                  <ATSSystemName>Taleo</ATSSystemName>
                  <ATSSystemLevel $level={atsResult.atsCompatibility.taleo}>
                    {atsResult.atsCompatibility.taleo}
                  </ATSSystemLevel>
                </ATSSystemCard>
                <ATSSystemCard $level={atsResult.atsCompatibility.lever}>
                  <ATSSystemName>Lever</ATSSystemName>
                  <ATSSystemLevel $level={atsResult.atsCompatibility.lever}>
                    {atsResult.atsCompatibility.lever}
                  </ATSSystemLevel>
                </ATSSystemCard>
              </ATSSystemsGrid>
            </ATSCompatibilitySection>
          )}

          {/* Keyword Stats */}
          {atsResult.metadata?.keywordStats && (
            <StatsSection>
              <StatCard>
                <StatValue>{atsResult.metadata.keywordStats.hardSkillsCount}</StatValue>
                <StatLabel>Hard Skills</StatLabel>
              </StatCard>
              <StatCard>
                <StatValue>{atsResult.metadata.keywordStats.actionVerbsCount}</StatValue>
                <StatLabel>Action Verbs</StatLabel>
              </StatCard>
              <StatCard>
                <StatValue>{atsResult.metadata.keywordStats.quantifiedAchievements}</StatValue>
                <StatLabel>Metrics Used</StatLabel>
              </StatCard>
              <StatCard>
                <StatValue>{atsResult.metadata.wordCount}</StatValue>
                <StatLabel>Word Count</StatLabel>
              </StatCard>
            </StatsSection>
          )}

          {/* Category Breakdown */}
          <MetricsGrid>
            {Object.entries(atsResult.categories).map(([key, category]) => {
              // Faz 1: Add category impact
              const impact = getCategoryImpact(category.earnedPoints, category.maxPoints);
              const impactEmoji = getCategoryImpactEmoji(impact);

              return (
              <MetricCard key={key}>
                <MetricHeader>
                  <MetricTitle>
                    <CategoryImpactEmoji>{impactEmoji}</CategoryImpactEmoji>
                    {category.name || getCategoryLabel(key)}
                  </MetricTitle>
                  <MetricScore $score={category.earnedPoints} $max={category.maxPoints}>
                    {category.earnedPoints}/{category.maxPoints}
                  </MetricScore>
                </MetricHeader>
                <MetricBar>
                  <MetricProgress $score={category.earnedPoints} $max={category.maxPoints} />
                </MetricBar>
                <MetricIssues>
                  {category.issues.slice(0, 2).map((issue, idx) => (
                    <MetricIssue key={idx}>
                      <svg width="14" height="14" fill="none" stroke="#ef4444" strokeWidth="2" viewBox="0 0 24 24">
                        <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                      {issue.issue}
                    </MetricIssue>
                  ))}
                  {category.passes.slice(0, 1).map((pass, idx) => (
                    <MetricIssue key={`pass-${idx}`}>
                      <svg width="14" height="14" fill="none" stroke="#10b981" strokeWidth="2" viewBox="0 0 24 24">
                        <path d="M5 13l4 4L19 7" />
                      </svg>
                      {pass}
                    </MetricIssue>
                  ))}
                </MetricIssues>
              </MetricCard>
              );
            })}
          </MetricsGrid>

          {/* Top Issues */}
          {atsResult.topIssues && atsResult.topIssues.length > 0 && (
            <TopIssuesSection>
              <TopIssuesTitle>Top Issues to Fix</TopIssuesTitle>
              {atsResult.topIssues.slice(0, 5).map((issue, idx) => (
                <IssueItem key={idx}>
                  <IssueHeader>
                    <SeverityBadge $severity={issue.severity}>{issue.severity}</SeverityBadge>
                    {issue.category && <CategoryBadge>{issue.category}</CategoryBadge>}
                  </IssueHeader>
                  <IssueText>{issue.issue}</IssueText>
                  <IssueSuggestion>
                    <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    {issue.suggestion}
                  </IssueSuggestion>
                </IssueItem>
              ))}
            </TopIssuesSection>
          )}

          {/* Faz 2: Quick Fixes with Impact & Time */}
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

          {/* Optimize CTA */}
          <OptimizeCTA>
            <CTATitle>Ready to Fix All Issues Automatically?</CTATitle>
            <CTAText>
              Our AI will rewrite your CV to achieve 95%+ ATS compatibility,
              fix all formatting issues, and add powerful action verbs.
            </CTAText>
            <OptimizeButton onClick={handleOptimize}>
              <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
              </svg>
              Fix All Issues & Optimize (1 Credit)
            </OptimizeButton>
          </OptimizeCTA>

          {error && <ErrorMessage>{error}</ErrorMessage>}

          <div style={{ textAlign: "center" }}>
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
      {step === "optimized" && optimizationResult && (
        <ResultsSection>
          {/* Success Header with Score Comparison */}
          <OptimizedCard>
            <SuccessIcon>
              <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M5 13l4 4L19 7" />
              </svg>
            </SuccessIcon>
            <SuccessTitle>Your CV Has Been Optimized!</SuccessTitle>

            <ScoreComparison>
              <ScoreBox>
                <ScoreBoxLabel>Before</ScoreBoxLabel>
                <ScoreBoxValue>{optimizationResult.beforeScore}</ScoreBoxValue>
              </ScoreBox>
              <ScoreArrow>→</ScoreArrow>
              <ScoreBox>
                <ScoreBoxLabel>After</ScoreBoxLabel>
                <ScoreBoxValue $isAfter>{optimizationResult.afterScore}</ScoreBoxValue>
              </ScoreBox>
            </ScoreComparison>

            <ImprovementBadge>
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
              +{optimizationResult.improvement} points improvement
            </ImprovementBadge>
          </OptimizedCard>

          {/* New Score Card - Same as Analysis */}
          {optimizationResult.optimizedAtsResult && (
            <>
              <ScoreCard>
                <ScoreCircle $score={optimizationResult.afterScore}>
                  <ScoreValue $score={optimizationResult.afterScore}>{optimizationResult.afterScore}</ScoreValue>
                  <ScoreLabel>out of 100</ScoreLabel>
                </ScoreCircle>
                <ScoreTitle $score={optimizationResult.afterScore}>
                  {optimizationResult.afterScore >= 85 ? "Excellent" :
                   optimizationResult.afterScore >= 70 ? "Good" :
                   optimizationResult.afterScore >= 55 ? "Fair" :
                   optimizationResult.afterScore >= 40 ? "Poor" : "Critical"}
                </ScoreTitle>
                <ScoreSummary>{optimizationResult.optimizedAtsResult.summary}</ScoreSummary>

                {/* Contact Info Checklist */}
                {optimizationResult.optimizedAtsResult.metadata?.hasContactInfo && (
                  <ContactChecklist>
                    <ContactItem $present={optimizationResult.optimizedAtsResult.metadata.hasContactInfo.email}>
                      {optimizationResult.optimizedAtsResult.metadata.hasContactInfo.email ? "✓" : "✗"} Email
                    </ContactItem>
                    <ContactItem $present={optimizationResult.optimizedAtsResult.metadata.hasContactInfo.phone}>
                      {optimizationResult.optimizedAtsResult.metadata.hasContactInfo.phone ? "✓" : "✗"} Phone
                    </ContactItem>
                    <ContactItem $present={optimizationResult.optimizedAtsResult.metadata.hasContactInfo.linkedin}>
                      {optimizationResult.optimizedAtsResult.metadata.hasContactInfo.linkedin ? "✓" : "✗"} LinkedIn
                    </ContactItem>
                    <ContactItem $present={optimizationResult.optimizedAtsResult.metadata.hasContactInfo.location}>
                      {optimizationResult.optimizedAtsResult.metadata.hasContactInfo.location ? "✓" : "✗"} Location
                    </ContactItem>
                  </ContactChecklist>
                )}
              </ScoreCard>

              {/* ATS System Compatibility */}
              {optimizationResult.optimizedAtsResult.atsCompatibility && (
                <ATSCompatibilitySection>
                  <ATSCompatibilityTitle>
                    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                    </svg>
                    ATS System Compatibility
                  </ATSCompatibilityTitle>
                  <ATSSystemsGrid>
                    <ATSSystemCard $level={optimizationResult.optimizedAtsResult.atsCompatibility.workday}>
                      <ATSSystemName>Workday</ATSSystemName>
                      <ATSSystemLevel $level={optimizationResult.optimizedAtsResult.atsCompatibility.workday}>
                        {optimizationResult.optimizedAtsResult.atsCompatibility.workday}
                      </ATSSystemLevel>
                    </ATSSystemCard>
                    <ATSSystemCard $level={optimizationResult.optimizedAtsResult.atsCompatibility.greenhouse}>
                      <ATSSystemName>Greenhouse</ATSSystemName>
                      <ATSSystemLevel $level={optimizationResult.optimizedAtsResult.atsCompatibility.greenhouse}>
                        {optimizationResult.optimizedAtsResult.atsCompatibility.greenhouse}
                      </ATSSystemLevel>
                    </ATSSystemCard>
                    <ATSSystemCard $level={optimizationResult.optimizedAtsResult.atsCompatibility.taleo}>
                      <ATSSystemName>Taleo</ATSSystemName>
                      <ATSSystemLevel $level={optimizationResult.optimizedAtsResult.atsCompatibility.taleo}>
                        {optimizationResult.optimizedAtsResult.atsCompatibility.taleo}
                      </ATSSystemLevel>
                    </ATSSystemCard>
                    <ATSSystemCard $level={optimizationResult.optimizedAtsResult.atsCompatibility.lever}>
                      <ATSSystemName>Lever</ATSSystemName>
                      <ATSSystemLevel $level={optimizationResult.optimizedAtsResult.atsCompatibility.lever}>
                        {optimizationResult.optimizedAtsResult.atsCompatibility.lever}
                      </ATSSystemLevel>
                    </ATSSystemCard>
                  </ATSSystemsGrid>
                </ATSCompatibilitySection>
              )}

              {/* Keyword Stats */}
              {optimizationResult.optimizedAtsResult.metadata?.keywordStats && (
                <StatsSection>
                  <StatCard>
                    <StatValue>{optimizationResult.optimizedAtsResult.metadata.keywordStats.hardSkillsCount}</StatValue>
                    <StatLabel>Hard Skills</StatLabel>
                  </StatCard>
                  <StatCard>
                    <StatValue>{optimizationResult.optimizedAtsResult.metadata.keywordStats.actionVerbsCount}</StatValue>
                    <StatLabel>Action Verbs</StatLabel>
                  </StatCard>
                  <StatCard>
                    <StatValue>{optimizationResult.optimizedAtsResult.metadata.keywordStats.quantifiedAchievements}</StatValue>
                    <StatLabel>Metrics Used</StatLabel>
                  </StatCard>
                  <StatCard>
                    <StatValue>{optimizationResult.optimizedAtsResult.metadata.wordCount}</StatValue>
                    <StatLabel>Word Count</StatLabel>
                  </StatCard>
                </StatsSection>
              )}

              {/* Category Breakdown */}
              <MetricsGrid>
                {Object.entries(optimizationResult.optimizedAtsResult.categories).map(([key, category]) => (
                  <MetricCard key={key}>
                    <MetricHeader>
                      <MetricTitle>{category.name || getCategoryLabel(key)}</MetricTitle>
                      <MetricScore $score={category.earnedPoints} $max={category.maxPoints}>
                        {category.earnedPoints}/{category.maxPoints}
                      </MetricScore>
                    </MetricHeader>
                    <MetricBar>
                      <MetricProgress $score={category.earnedPoints} $max={category.maxPoints} />
                    </MetricBar>
                    <MetricIssues>
                      {category.passes.slice(0, 3).map((pass, idx) => (
                        <MetricIssue key={`pass-${idx}`}>
                          <svg width="14" height="14" fill="none" stroke="#10b981" strokeWidth="2" viewBox="0 0 24 24">
                            <path d="M5 13l4 4L19 7" />
                          </svg>
                          {pass}
                        </MetricIssue>
                      ))}
                    </MetricIssues>
                  </MetricCard>
                ))}
              </MetricsGrid>
            </>
          )}

          {/* Changes Made */}
          {optimizationResult.changes && optimizationResult.changes.length > 0 && (
            <ChangesSection>
              <SectionTitle>Changes Made</SectionTitle>
              {optimizationResult.changes.slice(0, 8).map((change, index) => (
                <ChangeItem key={index}>
                  <ChangeIcon $impact={change.impact}>
                    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path d="M5 13l4 4L19 7" />
                    </svg>
                  </ChangeIcon>
                  <ChangeContent>
                    <ChangeIssue>{change.issue}</ChangeIssue>
                    <ChangeFix>{change.fix}</ChangeFix>
                  </ChangeContent>
                </ChangeItem>
              ))}
            </ChangesSection>
          )}

          {/* Download Buttons */}
          <ButtonGroup>
            <DownloadButton href={optimizationResult.pdfUrl} target="_blank" download>
              <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Download Optimized CV
            </DownloadButton>
            <SecondaryButton onClick={handleReset}>
              Try Another CV
            </SecondaryButton>
          </ButtonGroup>
        </ResultsSection>
      )}
    </PageContainer>
  );
}
