"use client";

import styled, { keyframes } from "styled-components";
import { useState, useRef, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { motion } from "motion/react";
import { ROUTES } from "@/lib/constants";
import { Footer } from "@/components/ui/Footer";
import { SecondaryCTA } from "@/components/marketing/SecondaryCTA";
import {
  analyzeScore,
  getCategoryImpact,
  getCategoryImpactEmoji,
  generateQuickFixes,
  type CategoryScore,
} from "@/lib/ats/scoring";
import { ATSFullResult } from "@/components/ats";

const pulse = keyframes`
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
`;

const shimmer = keyframes`
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
`;

const PageContainer = styled.div`
  min-height: 100vh;
  margin-top: 40px;
  background-color: var(--bg-color);
  color: var(--text-color);
  padding: 80px 24px 60px;

  @media (max-width: 768px) {
    padding: 60px 16px 40px;
  }
`;

const HeroSection = styled.section`
  text-align: center;
  padding: 0 0 40px;
  max-width: 800px;
  margin: 0 auto;

  @media (max-width: 768px) {
    padding: 0 0 32px;
  }
`;

const Title = styled.h1`
  font-size: 56px;
  font-weight: 800;
  color: var(--text-color);
  margin-bottom: 20px;
  line-height: 1.1;
  letter-spacing: -0.02em;

  @media (max-width: 768px) {
    font-size: 36px;
  }
`;

const Subtitle = styled.p`
  font-size: 20px;
  color: var(--text-secondary);
  line-height: 1.6;
  max-width: 640px;
  margin: 0 auto;

  @media (max-width: 768px) {
    font-size: 16px;
  }
`;

const MainContent = styled.div`
  max-width: 900px;
  margin: 0 auto;
  padding: 0 24px 80px;

  @media (max-width: 768px) {
    padding: 0 16px 60px;
  }
`;

const UploadSection = styled.div<{ $isAnalyzing?: boolean }>`
  display: ${({ $isAnalyzing }) => $isAnalyzing ? "none" : "block"};
`;

// Animation variants for file upload
const mainVariant = {
  initial: { x: 0, y: 0 },
  animate: { x: 20, y: -20, opacity: 0.9 },
};

const secondaryVariant = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
};

const UploadWrapper = styled.div`
  width: 100%;
`;

const UploadContainer = styled(motion.div)`
  padding: 40px;
  display: block;
  border-radius: 12px;
  cursor: pointer;
  width: 100%;
  position: relative;
  overflow: hidden;
  background: var(--bg-color);
  border: 2px dashed var(--border-color);
  transition: all 0.3s ease;

  &:hover {
    border-color: var(--primary-500);
    background: linear-gradient(135deg, rgba(var(--primary-500-rgb), 0.05) 0%, rgba(var(--primary-500-rgb), 0.08) 100%);
  }
`;

const GridPatternContainer = styled.div`
  position: absolute;
  inset: 0;
  mask-image: radial-gradient(ellipse at center, white, transparent);
  -webkit-mask-image: radial-gradient(ellipse at center, white, transparent);
  pointer-events: none;
`;

const GridPatternInner = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  gap: 1px;
  transform: scale(1.05);
  background: var(--bg-color);
`;

const GridCell = styled.div<{ $isEven: boolean }>`
  width: 40px;
  height: 40px;
  flex-shrink: 0;
  border-radius: 2px;
  background: var(--bg-alt);
  box-shadow: ${({ $isEven }) => !$isEven ? 'inset 0 0 1px 3px var(--bg-color)' : 'none'};
`;

const ContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  z-index: 10;
`;

const UploadTitle = styled.p`
  font-weight: 700;
  font-size: 16px;
  color: var(--text-color);
`;

const UploadDescription = styled.p`
  font-weight: 400;
  font-size: 14px;
  color: var(--text-secondary);
  margin-top: 8px;
`;

const FilePreviewContainer = styled.div`
  position: relative;
  width: 100%;
  margin-top: 40px;
  max-width: 560px;
  margin-left: auto;
  margin-right: auto;
`;

const FileCard = styled(motion.div)`
  position: relative;
  overflow: hidden;
  z-index: 40;
  background: var(--bg-alt);
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  padding: 16px;
  margin-top: 16px;
  width: 100%;
  margin-left: auto;
  margin-right: auto;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  border: 1px solid var(--border-color);
`;

const FileHeader = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  align-items: center;
  gap: 16px;
`;

const FileName = styled(motion.p)`
  font-size: 16px;
  color: var(--text-color);
  font-weight: 500;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 320px;
`;

const FileSize = styled(motion.p)`
  border-radius: 8px;
  padding: 4px 8px;
  flex-shrink: 0;
  font-size: 14px;
  color: var(--text-secondary);
  background: var(--bg-color);
`;

const FileMeta = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 100%;
  margin-top: 8px;
  justify-content: space-between;
  color: var(--text-secondary);
  font-size: 14px;

  @media (min-width: 768px) {
    flex-direction: row;
    align-items: center;
  }
`;

const FileType = styled(motion.p)`
  padding: 2px 8px;
  border-radius: 6px;
  background: var(--bg-color);
`;

const FileDate = styled(motion.p)`
  color: var(--text-secondary);
`;

const FileActions = styled(motion.div)`
  display: flex;
  gap: 8px;
  margin-top: 12px;
  width: 100%;
`;

const FileActionButton = styled.button<{ $variant?: "primary" | "danger" }>`
  flex: 1;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 8px 14px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;
  background: var(--bg-color);
  color: ${({ $variant }) => $variant === "danger" ? "#ef4444" : "var(--text-color)"};

  &:hover {
    background: ${({ $variant }) => $variant === "danger" ? "rgba(239, 68, 68, 0.1)" : "var(--bg-alt)"};
  }

  svg {
    width: 14px;
    height: 14px;
  }
`;

const UploadIconBox = styled(motion.div)<{ $isDragActive: boolean }>`
  position: relative;
  z-index: 40;
  background: var(--bg-alt);
  display: flex;
  align-items: center;
  justify-content: center;
  height: 128px;
  margin-top: 16px;
  width: 100%;
  max-width: 128px;
  margin-left: auto;
  margin-right: auto;
  border-radius: 12px;
  box-shadow: 0 10px 50px rgba(0, 0, 0, 0.1);
  border: 1px solid var(--border-color);
  transition: box-shadow 0.3s ease;

  ${UploadContainer}:hover & {
    box-shadow: 0 25px 50px rgba(0, 0, 0, 0.15);
  }

  svg {
    width: 24px;
    height: 24px;
    color: var(--text-secondary);
  }
`;

const DropText = styled(motion.p)`
  color: var(--text-secondary);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  font-size: 14px;
`;

const DashedBorder = styled(motion.div)`
  position: absolute;
  opacity: 0;
  border: 2px dashed var(--primary-500);
  inset: 0;
  z-index: 30;
  background: transparent;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 128px;
  margin-top: 16px;
  width: 100%;
  max-width: 128px;
  margin-left: auto;
  margin-right: auto;
  border-radius: 12px;
`;

const HiddenInput = styled.input`
  display: none;
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

const ScoreCard = styled.div`
  background: var(--surface-color);
  border: 1px solid var(--border-color);
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
    var(--border-color) 0deg
  );
  position: relative;

  &::before {
    content: "";
    position: absolute;
    width: 150px;
    height: 150px;
    border-radius: 50%;
    background: var(--surface-color);
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
  color: var(--text-secondary);
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
  color: var(--text-secondary);
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
  color: var(--text-secondary);
  margin-top: 8px;
  font-weight: 500;
`;

// Improvement Potential Section (Faz 1)
const ImprovementPotentialSection = styled.div`
  background: var(--surface-color);
  border: 1px solid var(--border-color);
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
  color: var(--text-color);
`;

const ImprovementScores = styled.span`
  font-size: 14px;
  font-weight: 700;
  color: var(--text-color);
`;

const ImprovementBar = styled.div`
  height: 12px;
  background: var(--border-color);
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
  color: var(--text-secondary);
  margin-top: 8px;
`;

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
  background: var(--surface-color);
  border: 1px solid var(--border-color);
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
  color: var(--text-color);
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
  background: var(--border-color);
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
  color: var(--text-secondary);
  padding: 6px 0;
  border-bottom: 1px solid var(--border-color);
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

const CTASection = styled.div`
  position: relative;
  isolation: isolate;
  overflow: hidden;
  background: var(--bg-alt);
  padding: 48px 32px;
  border-radius: 24px;
  text-align: center;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  outline: 1px solid rgba(0, 0, 0, 0.05);

  @media (max-width: 768px) {
    padding: 32px 24px;
  }
`;

const CTAGradientCircle = styled.svg`
  position: absolute;
  top: 50%;
  left: 50%;
  z-index: -1;
  width: 600px;
  height: 600px;
  transform: translate(-50%, -50%);
  mask-image: radial-gradient(closest-side, white, transparent);
  -webkit-mask-image: radial-gradient(closest-side, white, transparent);
  opacity: 0.6;
`;

const CTATitle = styled.h3`
  font-size: 28px;
  font-weight: 700;
  letter-spacing: -0.025em;
  color: var(--text-color);
  margin-bottom: 16px;
  text-wrap: balance;

  @media (max-width: 768px) {
    font-size: 24px;
  }
`;

const CTAText = styled.p`
  font-size: 16px;
  line-height: 1.7;
  color: var(--text-secondary);
  margin-bottom: 32px;
  max-width: 480px;
  margin-left: auto;
  margin-right: auto;
  text-wrap: pretty;
`;

const CTAButtonGroup = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
  flex-wrap: wrap;
`;

const CTAButton = styled.a`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 14px 28px;
  font-size: 15px;
  font-weight: 600;
  color: white;
  background: var(--primary-500);
  border-radius: 8px;
  text-decoration: none;
  box-shadow: 0 4px 12px rgba(53, 162, 159, 0.3);
  transition: all 0.2s ease;

  &:hover {
    background: var(--primary-700);
    transform: translateY(-1px);
    box-shadow: 0 6px 20px rgba(53, 162, 159, 0.4);
  }

  svg {
    width: 18px;
    height: 18px;
  }
`;

const CTASecondaryButton = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 15px;
  font-weight: 600;
  color: var(--text-color);
  text-decoration: none;
  transition: all 0.2s ease;

  &:hover {
    color: var(--primary-500);
  }

  span {
    margin-left: 4px;
    transition: transform 0.2s ease;
  }

  &:hover span {
    transform: translateX(4px);
  }
`;

const LoadingSection = styled.div`
  text-align: center;
  padding: 60px;
`;

const LoadingSpinner = styled.div`
  width: 60px;
  height: 60px;
  border: 4px solid var(--border-color);
  border-top-color: #6366f1;
  border-radius: 50%;
  margin: 0 auto 24px;
  animation: spin 1s linear infinite;

  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;

const LoadingText = styled.p`
  font-size: 18px;
  font-weight: 500;
  color: var(--text-color);
  margin-bottom: 8px;
`;

const LoadingSubtext = styled.p`
  font-size: 14px;
  color: var(--text-secondary);
`;

const TryAgainButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  font-size: 14px;
  font-weight: 500;
  color: var(--text-color);
  background: transparent;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  cursor: pointer;
  margin-top: 32px;
  transition: all 0.2s ease;

  &:hover {
    background: var(--surface-color);
    border-color: var(--text-secondary);
  }
`;

// ATS System Compatibility Section
const ATSCompatibilitySection = styled.div`
  background: var(--surface-color);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  padding: 24px;
  margin-bottom: 24px;
`;

const ATSCompatibilityTitle = styled.h3`
  font-size: 16px;
  font-weight: 600;
  color: var(--text-color);
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
  color: var(--text-color);
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
  background: var(--surface-color);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 16px;
  text-align: center;
`;

const StatValue = styled.div`
  font-size: 24px;
  font-weight: 700;
  color: var(--text-color);
`;

const StatLabel = styled.div`
  font-size: 12px;
  color: var(--text-secondary);
  margin-top: 4px;
`;

// Top Issues Section
const TopIssuesSection = styled.div`
  background: var(--surface-color);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  padding: 24px;
  margin-bottom: 24px;
`;

const TopIssuesTitle = styled.h3`
  font-size: 16px;
  font-weight: 600;
  color: var(--text-color);
  margin-bottom: 16px;
`;

const IssueItem = styled.div`
  padding: 16px;
  background: var(--bg-color);
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
  background: var(--border-color);
  color: var(--text-secondary);
`;

const IssueText = styled.p`
  font-size: 14px;
  color: var(--text-color);
  margin-bottom: 8px;
  font-weight: 500;
`;

const IssueSuggestion = styled.p`
  font-size: 13px;
  color: var(--text-secondary);
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
  color: var(--text-color);
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
  color: var(--text-secondary);
  display: flex;
  align-items: center;
  gap: 4px;

  svg {
    width: 12px;
    height: 12px;
  }
`;

// Contact Info Checklist
const ContactChecklist = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 12px;
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

// SEO Section Styles
const SEOSection = styled.section`
  max-width: 900px;
  margin: 0 auto;
  padding: 60px 24px 80px;

  @media (max-width: 768px) {
    padding: 40px 16px 60px;
  }
`;

const SEOTitle = styled.h2`
  font-size: 48px;
  font-weight: 800;
  color: var(--text-color);
  margin-bottom: 16px;
  text-align: center;
  letter-spacing: -0.02em;

  @media (max-width: 768px) {
    font-size: 32px;
  }
`;

const SEOSubtitle = styled.p`
  font-size: 20px;
  color: var(--text-secondary);
  text-align: center;
  max-width: 640px;
  margin: 0 auto 48px;
  line-height: 1.6;

  @media (max-width: 768px) {
    font-size: 16px;
  }
`;

const SectionDivider = styled.div`
  height: 1px;
  background: linear-gradient(
    90deg,
    transparent,
    var(--border-color),
    transparent
  );
  margin: 0 auto;
  max-width: 100%;
`;

const FAQList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const FAQItem = styled.div<{ $isOpen: boolean }>`
  background: var(--bg-alt);
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  outline: 1px solid rgba(0, 0, 0, 0.05);
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.3s ease;

  ${({ $isOpen }) =>
    $isOpen &&
    `
    border-color: var(--primary-200);
    box-shadow: 0 4px 12px rgba(var(--primary-500-rgb), 0.1);
  `}
`;

const FAQQuestion = styled.button`
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

const FAQQuestionIcon = styled.span<{ $isOpen: boolean }>`
  font-size: 24px;
  color: var(--primary-500);
  transition: transform 0.3s ease;
  transform: ${({ $isOpen }) => ($isOpen ? "rotate(180deg)" : "rotate(0)")};
  flex-shrink: 0;
`;

const FAQAnswer = styled.div<{ $isOpen: boolean }>`
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
`;

// Bento Grid styled components for Features
const BentoGrid = styled.div`
  display: grid;
  gap: 16px;
  max-width: 1000px;
  margin: 48px auto 0;

  @media (min-width: 768px) {
    grid-auto-rows: 20rem;
    grid-template-columns: repeat(3, 1fr);
  }
`;

const BentoCard = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 24px;
  border-radius: 24px;
  background: var(--bg-color);
  overflow: hidden;
  transition: all 0.3s ease;
  min-height: 280px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  outline: 1px solid rgba(0, 0, 0, 0.05);

  &:hover {
    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.1);
  }

  @media (max-width: 767px) {
    min-height: 320px;
    padding: 20px;
  }
`;

const BentoHeader = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
`;

const BentoContent = styled.div`
  transition: transform 0.3s ease;
  padding-top: 8px;

  ${BentoCard}:hover & {
    transform: translateY(-2px);
  }
`;

const BentoTitle = styled.h4`
  font-size: 15px;
  font-weight: 700;
  color: var(--text-color);
  line-height: 1.4;
  margin: 0 0 6px 0;
`;

const BentoDescription = styled.span`
  font-size: 13px;
  color: var(--text-secondary);
  line-height: 1.6;
  display: block;
`;

const DotBackground = styled.div`
  position: absolute;
  inset: 0;
  background-image: radial-gradient(
    var(--text-secondary) 1px,
    transparent 1px
  );
  background-size: 16px 16px;
  opacity: 0.1;
`;

// Animation 1: Upload Resume Animation
const UploadAnimation = () => {
  const [phase, setPhase] = useState<"idle" | "uploading" | "done">("idle");

  useEffect(() => {
    const runAnimation = () => {
      setPhase("uploading");
      setTimeout(() => setPhase("done"), 1200);
      setTimeout(() => setPhase("idle"), 2500);
    };

    runAnimation();
    const interval = setInterval(runAnimation, 3500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      style={{
        display: "flex",
        flex: 1,
        width: "100%",
        height: "100%",
        minHeight: "6rem",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        gap: "12px",
      }}
    >
      <DotBackground />

      {/* Upload Box */}
      <motion.div
        animate={{
          borderColor: phase === "uploading" ? "var(--primary-500)" : "var(--border-color)",
          scale: phase === "done" ? [1, 1.02, 1] : 1,
        }}
        style={{
          position: "relative",
          zIndex: 2,
          width: "80px",
          height: "80px",
          background: "var(--bg-alt)",
          borderRadius: "16px",
          border: "2px dashed var(--border-color)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "4px",
        }}
      >
        {/* File icon moving up */}
        <motion.div
          animate={{
            y: phase === "uploading" ? [-20, 0] : 0,
            opacity: phase === "idle" ? 0.5 : 1,
          }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          style={{
            width: "32px",
            height: "40px",
            background: "var(--surface-color)",
            borderRadius: "4px",
            border: "1px solid var(--border-color)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "4px",
          }}
        >
          <div style={{ width: "100%", height: "3px", background: "var(--border-color)", borderRadius: "2px", marginBottom: "2px" }} />
          <div style={{ width: "80%", height: "2px", background: "var(--border-color)", borderRadius: "2px", marginBottom: "2px" }} />
          <div style={{ width: "60%", height: "2px", background: "var(--border-color)", borderRadius: "2px" }} />
        </motion.div>

        {/* Checkmark */}
        <motion.div
          animate={{
            opacity: phase === "done" ? 1 : 0,
            scale: phase === "done" ? [0, 1.2, 1] : 0,
          }}
          transition={{ duration: 0.3 }}
          style={{
            position: "absolute",
            top: "-8px",
            right: "-8px",
            width: "24px",
            height: "24px",
            background: "#22c55e",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
            fontSize: "14px",
            fontWeight: "bold",
          }}
        >
          ✓
        </motion.div>
      </motion.div>

      {/* Progress bar */}
      <div style={{ width: "80px", height: "4px", background: "var(--bg-alt)", borderRadius: "2px", overflow: "hidden", position: "relative", zIndex: 1 }}>
        <motion.div
          animate={{
            width: phase === "uploading" ? "100%" : phase === "done" ? "100%" : "0%",
          }}
          transition={{ duration: 1, ease: "easeInOut" }}
          style={{
            height: "100%",
            background: phase === "done" ? "#22c55e" : "var(--primary-500)",
            borderRadius: "2px",
          }}
        />
      </div>
    </div>
  );
};

// Animation 2: Score Meter Animation
const ScoreAnimation = () => {
  const [score, setScore] = useState(0);
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    const runAnimation = () => {
      setAnimating(true);
      setScore(0);

      let current = 0;
      const targetScore = 85;
      const interval = setInterval(() => {
        current += 2;
        if (current >= targetScore) {
          setScore(targetScore);
          clearInterval(interval);
          setTimeout(() => setAnimating(false), 1000);
        } else {
          setScore(current);
        }
      }, 30);
    };

    runAnimation();
    const mainInterval = setInterval(runAnimation, 4000);
    return () => clearInterval(mainInterval);
  }, []);

  const getScoreColor = (s: number) => {
    if (s >= 80) return "#22c55e";
    if (s >= 60) return "#f59e0b";
    return "#ef4444";
  };

  return (
    <div
      style={{
        display: "flex",
        flex: 1,
        width: "100%",
        height: "100%",
        minHeight: "6rem",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        gap: "12px",
      }}
    >
      <DotBackground />

      {/* Circular Score */}
      <div style={{ position: "relative", zIndex: 2 }}>
        <svg width="100" height="100" viewBox="0 0 100 100">
          {/* Background circle */}
          <circle
            cx="50"
            cy="50"
            r="40"
            fill="none"
            stroke="var(--bg-alt)"
            strokeWidth="8"
          />
          {/* Progress circle */}
          <motion.circle
            cx="50"
            cy="50"
            r="40"
            fill="none"
            stroke={getScoreColor(score)}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={251.2}
            strokeDashoffset={251.2 - (251.2 * score) / 100}
            transform="rotate(-90 50 50)"
            style={{ transition: "stroke-dashoffset 0.1s ease" }}
          />
        </svg>
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            textAlign: "center",
          }}
        >
          <motion.span
            style={{
              fontSize: "28px",
              fontWeight: 700,
              color: getScoreColor(score),
            }}
          >
            {score}
          </motion.span>
          <span style={{ fontSize: "12px", color: "var(--text-secondary)", display: "block" }}>/100</span>
        </div>
      </div>

      {/* Score label */}
      <motion.span
        animate={{ opacity: score >= 80 ? 1 : 0.5 }}
        style={{
          fontSize: "11px",
          fontWeight: 600,
          color: getScoreColor(score),
          position: "relative",
          zIndex: 1,
        }}
      >
        {score >= 80 ? "✓ ATS Optimized" : "Analyzing..."}
      </motion.span>
    </div>
  );
};

// Animation 3: Fix & Optimize Animation
const OptimizeAnimation = () => {
  const [step, setStep] = useState(0);

  const fixes = [
    { label: "Format", icon: "📄" },
    { label: "Keywords", icon: "🔑" },
    { label: "ATS Ready", icon: "✅" },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setStep((prev) => (prev + 1) % (fixes.length + 2));
    }, 800);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      style={{
        display: "flex",
        flex: 1,
        width: "100%",
        height: "100%",
        minHeight: "6rem",
        flexDirection: "column",
        position: "relative",
        gap: "4px",
        justifyContent: "center",
        padding: "0",
      }}
    >
      <DotBackground />

      {fixes.map((fix, i) => (
        <motion.div
          key={fix.label}
          initial={{ opacity: 0, x: -20 }}
          animate={{
            opacity: step > i ? 1 : 0.3,
            x: step > i ? 0 : -10,
          }}
          transition={{ duration: 0.3 }}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "5px 10px",
            background: step > i ? "rgba(34, 197, 94, 0.1)" : "var(--bg-alt)",
            borderRadius: "6px",
            border: `1px solid ${step > i ? "rgba(34, 197, 94, 0.3)" : "var(--border-color)"}`,
            position: "relative",
            zIndex: 1,
          }}
        >
          <span style={{ fontSize: "12px" }}>{fix.icon}</span>
          <span style={{ fontSize: "11px", color: "var(--text-color)", fontWeight: 500, flex: 1 }}>
            {fix.label}
          </span>
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: step > i ? 1 : 0 }}
            transition={{ duration: 0.2, delay: 0.1 }}
            style={{
              fontSize: "11px",
              fontWeight: 700,
              color: "#22c55e",
            }}
          >
            ✓
          </motion.span>
        </motion.div>
      ))}

      {/* Final message */}
      <motion.div
        animate={{
          opacity: step > fixes.length ? 1 : 0,
          scale: step > fixes.length ? 1 : 0.9,
        }}
        transition={{ duration: 0.3 }}
        style={{
          marginTop: "2px",
          padding: "4px 10px",
          background: "rgba(34, 197, 94, 0.15)",
          borderRadius: "6px",
          border: "1px solid rgba(34, 197, 94, 0.3)",
          textAlign: "center",
          position: "relative",
          zIndex: 1,
        }}
      >
        <span style={{ fontSize: "10px", color: "#22c55e", fontWeight: 700 }}>
          Ready! 🎉
        </span>
      </motion.div>
    </div>
  );
};

// Icons for file upload
const UploadSvgIcon = () => (
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
    <polyline points="17 8 12 3 7 8" />
    <line x1="12" y1="3" x2="12" y2="15" />
  </svg>
);

const RefreshIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 2v6h-6" />
    <path d="M3 12a9 9 0 0 1 15-6.7L21 8" />
    <path d="M3 22v-6h6" />
    <path d="M21 12a9 9 0 0 1-15 6.7L3 16" />
  </svg>
);

const XIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

// Grid Pattern Component
function GridPattern() {
  const columns = 41;
  const rows = 11;
  return (
    <GridPatternInner>
      {Array.from({ length: rows }).map((_, row) =>
        Array.from({ length: columns }).map((_, col) => {
          const index = row * columns + col;
          return (
            <GridCell
              key={`${col}-${row}`}
              $isEven={index % 2 === 0}
            />
          );
        })
      )}
    </GridPatternInner>
  );
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
    estimatedPages: number;
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

const JobDescriptionWrapper = styled(motion.div)`
  margin-top: 24px;
  width: 100%;
  max-width: 560px;
  margin-left: auto;
  margin-right: auto;
  text-align: left;
`;

const JDLabel = styled.label`
  display: block;
  font-size: 14px;
  font-weight: 600;
  color: var(--text-color);
  margin-bottom: 8px;
`;

const JDTextarea = styled.textarea`
  width: 100%;
  height: 120px;
  padding: 16px;
  border-radius: 12px;
  border: 1px solid var(--border-color);
  background: var(--bg-alt);
  color: var(--text-color);
  font-family: inherit;
  font-size: 14px;
  resize: vertical;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: var(--primary-500);
    box-shadow: 0 0 0 2px rgba(var(--primary-500-rgb), 0.2);
  }
`;

const AnalyzeButton = styled(motion.button)`
  width: 100%;
  max-width: 560px;
  margin: 24px auto 0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 16px 32px;
  font-size: 16px;
  font-weight: 700;
  color: white;
  background: var(--primary-500);
  border-radius: 12px;
  border: none;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(53, 162, 159, 0.3);
  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    background: var(--primary-700);
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(53, 162, 159, 0.4);
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
    transform: none;
  }
`;

export default function ATSCheckPage() {
  const [file, setFile] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ATSResult | null>(null);
  const [openFAQs, setOpenFAQs] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const toggleFAQ = (id: string) => {
    setOpenFAQs((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleFileChange = (newFile: File) => {
    setFile(newFile);
    setError(null);
    // Don't auto-analyze, let user click the button so they can add job description
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    setFile(null);
    setResult(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleChangeFile = (e: React.MouseEvent) => {
    e.stopPropagation();
    fileInputRef.current?.click();
  };

  const handleClick = () => {
    if (!file) {
      fileInputRef.current?.click();
    }
  };

  const analyzeFile = async (fileToAnalyze: File) => {
    setIsAnalyzing(true);

    try {
      // Step 1: Parse the file
      const formData = new FormData();
      formData.append("file", fileToAnalyze);

      const parseResponse = await fetch("/api/ats/parse", {
        method: "POST",
        body: formData,
      });

      const parseData = await parseResponse.json();

      if (!parseResponse.ok) {
        throw new Error(parseData.error || "Failed to parse file");
      }

      if (jobDescription.trim()) {
        // Use demo analyze for Job Match
        const analyzeResponse = await fetch("/api/demo/analyze", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ cvText: parseData.text, jobText: jobDescription }),
        });

        const analyzeData = await analyzeResponse.json();

        if (!analyzeResponse.ok) {
          throw new Error(analyzeData.error || "Analysis failed");
        }

        // Map Demo Result to ATSResult format
        const missingKeyIssues = (analyzeData.missingKeywords || []).map((kw: string) => ({
          severity: "critical",
          issue: "Missing Required Skill",
          suggestion: `Add the keyword '${kw}' to your experience or skills section to match the job description.`,
          category: "Keywords"
        }));
        
        const otherIssues = (analyzeData.improvementTips || []).map((tip: string) => ({
          severity: "high",
          issue: "Job Match Improvement",
          suggestion: tip,
          category: "Format"
        }));

        const mappedResult: ATSResult = {
          overallScore: analyzeData.fitScore,
          scoreLabel: analyzeData.fitScore >= 80 ? "Excellent Match" : analyzeData.fitScore >= 60 ? "Good Match" : "Weak Match",
          summary: analyzeData.summary,
          categories: {
            format: { earnedPoints: 20, maxPoints: 25, issues: [], passes: [] },
            structure: { earnedPoints: 20, maxPoints: 25, issues: [], passes: [] },
            keywords: { earnedPoints: Math.round((analyzeData.fitScore / 100) * 30), maxPoints: 30, issues: [], passes: [] },
            readability: { earnedPoints: 15, maxPoints: 20, issues: [], passes: [] },
          },
          topIssues: [...missingKeyIssues, ...otherIssues],
          quickWins: analyzeData.quickWins || [],
          metadata: {
            wordCount: parseData.text.split(" ").length,
            estimatedPages: 1,
            keywordStats: { hardSkillsCount: 0, softSkillsCount: 0, actionVerbsCount: 0, quantifiedAchievements: 0 }
          }
        };

        setResult(mappedResult);
      } else {
        // Step 2: Analyze the CV automatically (General Format Check)
        const analyzeResponse = await fetch("/api/ats/check", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ cvText: parseData.text }),
        });

        const analyzeData = await analyzeResponse.json();

        if (!analyzeResponse.ok) {
          throw new Error(analyzeData.error || "Analysis failed");
        }

        setResult(analyzeData.result);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to analyze file");
      // Keep file so they can retry
    } finally {
      setIsAnalyzing(false);
    }
  };

  const { getRootProps, isDragActive } = useDropzone({
    multiple: false,
    noClick: true,
    onDrop: (acceptedFiles: File[]) => {
      const droppedFile = acceptedFiles[0];
      if (droppedFile) {
        handleFileChange(droppedFile);
      }
    },
    accept: {
      "application/pdf": [".pdf"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
      "application/msword": [".doc"],
    },
    maxFiles: 1,
    maxSize: 5 * 1024 * 1024, // 5MB
  });

  const handleTryAgain = () => {
    setResult(null);
    setFile(null);
    setError(null);
  };

  const getScoreMessage = (score: number): string => {
    if (score >= 80) return "Excellent! Your resume is well-optimized for ATS systems.";
    if (score >= 60) return "Good foundation, but there's room for improvement.";
    if (score >= 40) return "Your resume needs work to pass ATS filters.";
    return "Critical issues detected. Most ATS systems will reject this resume.";
  };

  const getCategoryLabel = (key: string): string => {
    const labels: Record<string, string> = {
      format: "Format & Parsing",
      structure: "Structure & Layout",
      keywords: "Keywords & Content",
      readability: "Readability & Length",
    };
    return labels[key] || key;
  };

  return (
    <PageContainer>
      <HeroSection>
        
        <Title>Free ATS Resume Score Checker</Title>
        <Subtitle>
          Check your resume score instantly. Our ATS score checker analyzes your resume
          against 40+ criteria used by Workday, Greenhouse, Taleo & Lever.
          85% of resumes get rejected — see where you stand.
        </Subtitle>
      </HeroSection>

      <MainContent>
        {isAnalyzing ? (
          <LoadingSection>
            <LoadingSpinner />
            <LoadingText>Analyzing your resume...</LoadingText>
            <LoadingSubtext>Checking format, structure, keywords, and readability</LoadingSubtext>
          </LoadingSection>
        ) : result ? (() => {
          // Faz 1: Calculate score analysis
          const categoriesForAnalysis: Record<string, CategoryScore> = Object.entries(result.categories).reduce((acc, [key, cat]) => {
            acc[key] = {
              earnedPoints: cat.earnedPoints,
              maxPoints: cat.maxPoints,
              percentage: (cat.earnedPoints / cat.maxPoints) * 100
            };
            return acc;
          }, {} as Record<string, CategoryScore>);

          const scoreAnalysis = analyzeScore(result.overallScore, categoriesForAnalysis);

          // Faz 2: Generate quick fixes - convert topIssues to expected format
          const issuesForQuickFixes = result.topIssues.map(issue => ({
            issue: issue.issue,
            category: issue.category || 'General',
            fix: issue.suggestion
          }));
          const quickFixes = generateQuickFixes(categoriesForAnalysis, issuesForQuickFixes);

          return (
          <ResultsSection>
            {/* The Faded Report */}
            <div style={{ 
               maxHeight: "900px", 
               overflow: "hidden", 
               position: "relative",
               maskImage: "linear-gradient(to bottom, black 30%, transparent 100%)",
               WebkitMaskImage: "-webkit-linear-gradient(top, black 30%, transparent 100%)"
            }}>
              {/* ATSFullResult Component */}
              <ATSFullResult
                score={result.overallScore}
                summary={result.summary || getScoreMessage(result.overallScore)}
                categories={{
                  format: {
                    earnedPoints: result.categories.format.earnedPoints,
                    maxPoints: result.categories.format.maxPoints,
                    issues: result.categories.format.issues.map(i => ({
                      issue: i.issue,
                      recommendation: i.fix,
                      severity: i.severity
                    })),
                    passes: result.categories.format.passes
                  },
                  structure: {
                    earnedPoints: result.categories.structure.earnedPoints,
                    maxPoints: result.categories.structure.maxPoints,
                    issues: result.categories.structure.issues.map(i => ({
                      issue: i.issue,
                      recommendation: i.fix,
                      severity: i.severity
                    })),
                    passes: result.categories.structure.passes
                  },
                  keywords: {
                    earnedPoints: result.categories.keywords.earnedPoints,
                    maxPoints: result.categories.keywords.maxPoints,
                    issues: result.categories.keywords.issues.map(i => ({
                      issue: i.issue,
                      recommendation: i.fix,
                      severity: i.severity
                    })),
                    passes: result.categories.keywords.passes
                  },
                  readability: {
                    earnedPoints: result.categories.readability.earnedPoints,
                    maxPoints: result.categories.readability.maxPoints,
                    issues: result.categories.readability.issues.map(i => ({
                      issue: i.issue,
                      recommendation: i.fix,
                      severity: i.severity
                    })),
                    passes: result.categories.readability.passes
                  }
                }}
                hasContactInfo={result.metadata?.hasContactInfo || {
                  email: false,
                  phone: false,
                  linkedin: false,
                  location: false
                }}
                parsingChecks={result.parsingChecks || {
                  singleColumn: { ok: true, note: "Unknown" },
                  standardSections: { ok: true, note: "Unknown" },
                  cleanCharacters: { ok: true, note: "Unknown" },
                  abbreviations: { ok: true, note: "Unknown" }
                }}
                keywordStats={result.metadata?.keywordStats || {
                  hardSkillsCount: 0,
                  actionVerbsCount: 0,
                  quantifiedAchievements: 0
                }}
                wordCount={result.metadata?.wordCount || 0}
                topIssues={result.topIssues?.map(issue => ({
                  severity: issue.severity,
                  issue: issue.issue,
                  suggestion: issue.suggestion,
                  category: issue.category
                }))}
                potentialScore={scoreAnalysis.maxPotential}
                easyWinsPoints={scoreAnalysis.easyWinsPoints}
              />
            </div>

            {/* Overlay CTA Section */}
            <div style={{ marginTop: "-220px", position: "relative", zIndex: 10, padding: "0 16px" }}>
              <CTASection style={{ boxShadow: "0 20px 40px rgba(0,0,0,0.2)" }}>
                <CTAGradientCircle viewBox="0 0 600 600" aria-hidden="true">
                  <circle
                    r={300}
                    cx={300}
                    cy={300}
                    fill="url(#gradient-cta-ats)"
                    fillOpacity="0.7"
                  />
                  <defs>
                    <radialGradient id="gradient-cta-ats">
                      <stop stopColor="#35A29F" />
                      <stop offset={1} stopColor="#0B666A" />
                    </radialGradient>
                  </defs>
                </CTAGradientCircle>
                <CTATitle>Unlock Your Full Report</CTATitle>
                <CTAText>
                  Your resume is missing critical keywords. Sign up for free to unlock the full list of errors and fix your CV instantly with AI.
                </CTAText>
                <CTAButtonGroup>
                  <CTAButton href={ROUTES.AUTH.SIGNUP}>
                    Sign Up to Unlock
                  </CTAButton>
                  <CTASecondaryButton href={`https://twitter.com/intent/tweet?text=I%20just%20scored%20${result.overallScore}/100%20on%20my%20Resume!%20Check%20yours%20for%20free%20at%20rejectly.pro/ats-check?score=${result.overallScore}`} target="_blank" rel="noreferrer">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                       <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path>
                    </svg>
                    Share Score
                  </CTASecondaryButton>
                </CTAButtonGroup>
              </CTASection>
            </div>

            <TryAgainButton onClick={handleTryAgain}>
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Analyze Another Resume
            </TryAgainButton>
          </ResultsSection>
          );
        })() : (
          <UploadSection>
            <UploadWrapper {...getRootProps()}>
              <UploadContainer
                onClick={handleClick}
                whileHover="animate"
              >
                <HiddenInput
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.docx,.doc"
                  onChange={(e) => {
                    const selectedFile = e.target.files?.[0];
                    if (selectedFile) {
                      handleFileChange(selectedFile);
                    }
                  }}
                />
                <GridPatternContainer>
                  <GridPattern />
                </GridPatternContainer>
                <ContentContainer>
                  <UploadTitle>Upload your resume</UploadTitle>
                  <UploadDescription>
                    Drag or drop your resume here or click to upload (PDF or DOCX, max 5MB)
                  </UploadDescription>
                  <FilePreviewContainer>
                    {file ? (
                      <FileCard layoutId="file-upload">
                        <FileHeader>
                          <FileName
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            layout
                          >
                            {file.name}
                          </FileName>
                          <FileSize
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            layout
                          >
                            {(file.size / (1024 * 1024)).toFixed(2)} MB
                          </FileSize>
                        </FileHeader>
                        <FileMeta>
                          <FileType
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            layout
                          >
                            {file.type || "document"}
                          </FileType>
                          <FileDate
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            layout
                          >
                            modified {new Date(file.lastModified).toLocaleDateString()}
                          </FileDate>
                        </FileMeta>
                        <FileActions
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.2 }}
                        >
                          <FileActionButton onClick={handleChangeFile}>
                            <RefreshIcon />
                            Change File
                          </FileActionButton>
                          <FileActionButton $variant="danger" onClick={handleRemove}>
                            <XIcon />
                            Remove
                          </FileActionButton>
                        </FileActions>
                      </FileCard>
                    ) : (
                      <>
                        <UploadIconBox
                          layoutId="file-upload"
                          variants={mainVariant}
                          transition={{
                            type: "spring",
                            stiffness: 300,
                            damping: 20,
                          }}
                          $isDragActive={isDragActive}
                        >
                          {isDragActive ? (
                            <DropText
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                            >
                              Drop it
                              <UploadSvgIcon />
                            </DropText>
                          ) : (
                            <UploadSvgIcon />
                          )}
                        </UploadIconBox>
                        <DashedBorder variants={secondaryVariant} />
                      </>
                    )}
                  </FilePreviewContainer>
                </ContentContainer>
              </UploadContainer>
            </UploadWrapper>

            {/* NEW: Job Description & Analyze Button */}
            {file && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                <JobDescriptionWrapper>
                  <JDLabel>Target Job Description (Optional)</JDLabel>
                  <JDTextarea
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    placeholder="Paste the job description here to get a tailored Job Match Score. If left blank, we'll run a general formatting check."
                  />
                </JobDescriptionWrapper>

                <AnalyzeButton
                  onClick={() => analyzeFile(file)}
                  disabled={isAnalyzing}
                  whileTap={{ scale: 0.98 }}
                >
                  {isAnalyzing ? "Analyzing..." : "Get My ATS Score"}
                </AnalyzeButton>
              </motion.div>
            )}

            {error && <ErrorMessage>{error}</ErrorMessage>}
          </UploadSection>
        )}
      </MainContent>

      <SectionDivider />

      {/* SEO Content Section */}
      <SEOSection>
        <SEOTitle>How our resume score checker works</SEOTitle>
        <SEOSubtitle>
          Our ATS resume checker analyzes your resume against the same criteria used by
          Fortune 500 companies to filter candidates automatically.
        </SEOSubtitle>

        <BentoGrid>
          <BentoCard>
            <BentoHeader>
              <UploadAnimation />
            </BentoHeader>
            <BentoContent>
              <BentoTitle>Upload Your Resume</BentoTitle>
              <BentoDescription>
                Simply drag and drop your resume (PDF or DOCX). Our ATS score checker
                instantly parses your document.
              </BentoDescription>
            </BentoContent>
          </BentoCard>

          <BentoCard>
            <BentoHeader>
              <ScoreAnimation />
            </BentoHeader>
            <BentoContent>
              <BentoTitle>Get Your Resume Score</BentoTitle>
              <BentoDescription>
                Receive an instant ATS score out of 100, with detailed breakdown across
                format, structure, keywords, and readability.
              </BentoDescription>
            </BentoContent>
          </BentoCard>

          <BentoCard>
            <BentoHeader>
              <OptimizeAnimation />
            </BentoHeader>
            <BentoContent>
              <BentoTitle>Fix & Optimize</BentoTitle>
              <BentoDescription>
                Get actionable suggestions to improve your resume score and pass
                ATS filters at companies like Google, Amazon, and Microsoft.
              </BentoDescription>
            </BentoContent>
          </BentoCard>
        </BentoGrid>

        <SectionDivider style={{ marginTop: "80px", marginBottom: "80px" }} />

        <div>
          <SEOTitle>Frequently asked questions</SEOTitle>
          <SEOSubtitle>
            Everything you need to know about ATS resume scoring and optimization.
          </SEOSubtitle>

          <FAQList>
            <FAQItem $isOpen={openFAQs.includes("faq-0")}>
              <FAQQuestion onClick={() => toggleFAQ("faq-0")}>
                <FAQQuestionText>What is an ATS resume score?</FAQQuestionText>
                <FAQQuestionIcon $isOpen={openFAQs.includes("faq-0")}>
                  {openFAQs.includes("faq-0") ? "−" : "+"}
                </FAQQuestionIcon>
              </FAQQuestion>
              <FAQAnswer $isOpen={openFAQs.includes("faq-0")}>
                <FAQAnswerText>
                  An ATS (Applicant Tracking System) resume score measures how well your resume
                  will perform when parsed by automated hiring software. Companies like Workday,
                  Greenhouse, Taleo, and Lever use ATS to filter resumes before human review.
                  A score of 80+ typically means your resume will pass initial screening, while
                  scores below 60 often result in automatic rejection — regardless of your qualifications.
                </FAQAnswerText>
              </FAQAnswer>
            </FAQItem>

            <FAQItem $isOpen={openFAQs.includes("faq-1")}>
              <FAQQuestion onClick={() => toggleFAQ("faq-1")}>
                <FAQQuestionText>How do I check my resume score for free?</FAQQuestionText>
                <FAQQuestionIcon $isOpen={openFAQs.includes("faq-1")}>
                  {openFAQs.includes("faq-1") ? "−" : "+"}
                </FAQQuestionIcon>
              </FAQQuestion>
              <FAQAnswer $isOpen={openFAQs.includes("faq-1")}>
                <FAQAnswerText>
                  Simply upload your resume (PDF or DOCX) to our free ATS resume checker above.
                  Within seconds, you&apos;ll receive a comprehensive resume score breakdown including
                  format analysis, keyword optimization, and compatibility ratings for major ATS
                  systems. No signup required for the basic score check.
                </FAQAnswerText>
              </FAQAnswer>
            </FAQItem>

            <FAQItem $isOpen={openFAQs.includes("faq-2")}>
              <FAQQuestion onClick={() => toggleFAQ("faq-2")}>
                <FAQQuestionText>What is a good ATS resume score?</FAQQuestionText>
                <FAQQuestionIcon $isOpen={openFAQs.includes("faq-2")}>
                  {openFAQs.includes("faq-2") ? "−" : "+"}
                </FAQQuestionIcon>
              </FAQQuestion>
              <FAQAnswer $isOpen={openFAQs.includes("faq-2")}>
                <FAQAnswerText>
                  A good ATS resume score is 80 or above out of 100. Here&apos;s how to interpret your score:
                  <br /><br />
                  <strong>80-100 (Excellent):</strong> Your resume is well-optimized and should pass most ATS filters.<br />
                  <strong>60-79 (Good):</strong> Acceptable but has room for improvement.<br />
                  <strong>40-59 (Fair):</strong> Significant issues that may cause rejection.<br />
                  <strong>Below 40 (Poor):</strong> Critical problems — most ATS systems will reject this resume.
                </FAQAnswerText>
              </FAQAnswer>
            </FAQItem>

            <FAQItem $isOpen={openFAQs.includes("faq-3")}>
              <FAQQuestion onClick={() => toggleFAQ("faq-3")}>
                <FAQQuestionText>Why do 85% of resumes get rejected by ATS?</FAQQuestionText>
                <FAQQuestionIcon $isOpen={openFAQs.includes("faq-3")}>
                  {openFAQs.includes("faq-3") ? "−" : "+"}
                </FAQQuestionIcon>
              </FAQQuestion>
              <FAQAnswer $isOpen={openFAQs.includes("faq-3")}>
                <FAQAnswerText>
                  Most resumes get rejected due to formatting issues (tables, graphics, text boxes,
                  headers/footers), missing keywords, non-standard section headings, and poor structure.
                  ATS systems struggle to parse creative layouts, causing qualified candidates to be
                  filtered out before human review. Our resume score checker identifies these exact
                  issues so you can fix them.
                </FAQAnswerText>
              </FAQAnswer>
            </FAQItem>

            <FAQItem $isOpen={openFAQs.includes("faq-4")}>
              <FAQQuestion onClick={() => toggleFAQ("faq-4")}>
                <FAQQuestionText>Which ATS systems does this checker support?</FAQQuestionText>
                <FAQQuestionIcon $isOpen={openFAQs.includes("faq-4")}>
                  {openFAQs.includes("faq-4") ? "−" : "+"}
                </FAQQuestionIcon>
              </FAQQuestion>
              <FAQAnswer $isOpen={openFAQs.includes("faq-4")}>
                <FAQAnswerText>
                  Our ATS resume checker analyzes your resume against the parsing behavior of the
                  most popular ATS platforms: Workday (used by 50% of Fortune 500), Greenhouse
                  (10,000+ companies), Taleo/Oracle (large enterprises), and Lever (fast-growing
                  startups). Each system has different parsing quirks, and we show you compatibility
                  ratings for all four.
                </FAQAnswerText>
              </FAQAnswer>
            </FAQItem>

            <FAQItem $isOpen={openFAQs.includes("faq-5")}>
              <FAQQuestion onClick={() => toggleFAQ("faq-5")}>
                <FAQQuestionText>How can I improve my resume score quickly?</FAQQuestionText>
                <FAQQuestionIcon $isOpen={openFAQs.includes("faq-5")}>
                  {openFAQs.includes("faq-5") ? "−" : "+"}
                </FAQQuestionIcon>
              </FAQQuestion>
              <FAQAnswer $isOpen={openFAQs.includes("faq-5")}>
                <FAQAnswerText>
                  The fastest ways to improve your ATS resume score:<br /><br />
                  1. <strong>Use a simple, single-column layout</strong> — avoid tables, graphics, and text boxes<br />
                  2. <strong>Use standard section headers</strong> — &quot;Experience&quot; not &quot;My Journey&quot;<br />
                  3. <strong>Add quantified achievements</strong> — numbers and percentages stand out<br />
                  4. <strong>Include relevant keywords</strong> — match the job description language<br />
                  5. <strong>Save as .docx or simple PDF</strong> — avoid scanned images
                </FAQAnswerText>
              </FAQAnswer>
            </FAQItem>
          </FAQList>
        </div>
      </SEOSection>
      <SectionDivider />
      <SecondaryCTA />
      <Footer />
    </PageContainer>
  );
}
