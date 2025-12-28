"use client";

import styled, { keyframes } from "styled-components";
import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { ROUTES } from "@/lib/constants";

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
  background: ${({ theme }) => theme.colors.background};
`;

const HeroSection = styled.section`
  text-align: center;
  padding: 60px 24px 40px;
  max-width: 800px;
  margin: 0 auto;

  @media (max-width: 768px) {
    padding: 40px 16px 32px;
  }
`;

const Badge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 14px;
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%);
  border: 1px solid rgba(99, 102, 241, 0.2);
  border-radius: 20px;
  font-size: 13px;
  font-weight: 500;
  color: #6366f1;
  margin-bottom: 20px;
`;

const Title = styled.h1`
  font-size: 48px;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.textPrimary};
  margin-bottom: 16px;
  line-height: 1.1;

  @media (max-width: 768px) {
    font-size: 32px;
  }
`;

const Subtitle = styled.p`
  font-size: 18px;
  color: ${({ theme }) => theme.colors.textSecondary};
  line-height: 1.6;
  max-width: 600px;
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

const CTASection = styled.div`
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%);
  border: 1px solid rgba(99, 102, 241, 0.2);
  border-radius: 20px;
  padding: 40px;
  text-align: center;
`;

const CTATitle = styled.h3`
  font-size: 24px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.textPrimary};
  margin-bottom: 12px;
`;

const CTAText = styled.p`
  font-size: 16px;
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-bottom: 24px;
  max-width: 400px;
  margin-left: auto;
  margin-right: auto;
`;

const CTAButton = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 16px 32px;
  font-size: 16px;
  font-weight: 600;
  color: white;
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  border-radius: 12px;
  text-decoration: none;
  transition: all 0.2s ease;
  animation: ${pulse} 2s ease-in-out infinite;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(99, 102, 241, 0.3);
  }

  svg {
    width: 20px;
    height: 20px;
  }
`;

const LoadingSection = styled.div`
  text-align: center;
  padding: 60px;
`;

const LoadingSpinner = styled.div`
  width: 60px;
  height: 60px;
  border: 4px solid ${({ theme }) => theme.colors.border};
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
  color: ${({ theme }) => theme.colors.textPrimary};
  margin-bottom: 8px;
`;

const LoadingSubtext = styled.p`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.textSecondary};
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
  margin-top: 32px;
  transition: all 0.2s ease;

  &:hover {
    background: ${({ theme }) => theme.colors.surface};
    border-color: ${({ theme }) => theme.colors.textSecondary};
  }
`;

// ATS System Compatibility Section
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

// Quick Wins Section
const QuickWinsSection = styled.div`
  background: linear-gradient(135deg, rgba(16, 185, 129, 0.05) 0%, rgba(34, 197, 94, 0.05) 100%);
  border: 1px solid rgba(16, 185, 129, 0.2);
  border-radius: 16px;
  padding: 24px;
  margin-bottom: 32px;
`;

const QuickWinsTitle = styled.h3`
  font-size: 16px;
  font-weight: 600;
  color: #10b981;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const QuickWinsList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const QuickWinItem = styled.li`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.textPrimary};
  padding: 10px 0;
  border-bottom: 1px solid rgba(16, 185, 129, 0.1);
  display: flex;
  align-items: flex-start;
  gap: 10px;

  &:last-child {
    border-bottom: none;
  }

  svg {
    flex-shrink: 0;
    color: #10b981;
    margin-top: 2px;
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
  font-size: 32px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.textPrimary};
  margin-bottom: 16px;
  text-align: center;

  @media (max-width: 768px) {
    font-size: 24px;
  }
`;

const SEOSubtitle = styled.p`
  font-size: 16px;
  color: ${({ theme }) => theme.colors.textSecondary};
  text-align: center;
  max-width: 600px;
  margin: 0 auto 40px;
  line-height: 1.6;
`;

const FAQList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const FAQItem = styled.details`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 12px;
  overflow: hidden;

  &[open] summary::after {
    transform: rotate(180deg);
  }
`;

const FAQQuestion = styled.summary`
  padding: 20px 24px;
  font-size: 16px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textPrimary};
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  list-style: none;

  &::-webkit-details-marker {
    display: none;
  }

  &::after {
    content: "";
    width: 10px;
    height: 10px;
    border-right: 2px solid ${({ theme }) => theme.colors.textSecondary};
    border-bottom: 2px solid ${({ theme }) => theme.colors.textSecondary};
    transform: rotate(45deg);
    transition: transform 0.2s ease;
    flex-shrink: 0;
    margin-left: 16px;
  }

  &:hover {
    color: #6366f1;
  }
`;

const FAQAnswer = styled.div`
  padding: 0 24px 20px;
  font-size: 15px;
  color: ${({ theme }) => theme.colors.textSecondary};
  line-height: 1.7;
`;

const FeatureGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
  margin-top: 48px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 16px;
  }
`;

const FeatureCard = styled.div`
  text-align: center;
  padding: 32px 24px;
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 16px;
`;

const FeatureIcon = styled.div`
  width: 48px;
  height: 48px;
  margin: 0 auto 16px;
  border-radius: 12px;
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #6366f1;
`;

const FeatureTitle = styled.h3`
  font-size: 16px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textPrimary};
  margin-bottom: 8px;
`;

const FeatureText = styled.p`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.textSecondary};
  line-height: 1.5;
`;

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
}

interface CategoryResult {
  name?: string;
  earnedPoints: number;
  maxPoints: number;
  percentage?: number;
  issues: { issue: string; impact?: string; severity?: string; fix?: string }[];
  passes: string[];
}

export default function ATSCheckPage() {
  const [file, setFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ATSResult | null>(null);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    setFile(file);
    setError(null);
    setIsAnalyzing(true);

    try {
      // Step 1: Parse the file
      const formData = new FormData();
      formData.append("file", file);

      const parseResponse = await fetch("/api/ats/parse", {
        method: "POST",
        body: formData,
      });

      const parseData = await parseResponse.json();

      if (!parseResponse.ok) {
        throw new Error(parseData.error || "Failed to parse file");
      }

      // Step 2: Analyze the CV automatically
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
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to analyze file");
      setFile(null);
    } finally {
      setIsAnalyzing(false);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
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
        <Badge>
          <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Free Resume Score Check
        </Badge>
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
        ) : result ? (
          <ResultsSection>
            <ScoreCard>
              <ScoreCircle $score={result.overallScore}>
                <ScoreValue $score={result.overallScore}>{result.overallScore}</ScoreValue>
                <ScoreLabel>out of 100</ScoreLabel>
              </ScoreCircle>
              <ScoreTitle $score={result.overallScore}>
                {result.overallScore >= 85 ? "Excellent" :
                 result.overallScore >= 70 ? "Good" :
                 result.overallScore >= 55 ? "Fair" :
                 result.overallScore >= 40 ? "Poor" : "Critical"}
              </ScoreTitle>
              <ScoreSummary>{result.summary || getScoreMessage(result.overallScore)}</ScoreSummary>

              {/* Contact Info Checklist */}
              {result.metadata?.hasContactInfo && (
                <ContactChecklist>
                  <ContactItem $present={result.metadata.hasContactInfo.email}>
                    {result.metadata.hasContactInfo.email ? "✓" : "✗"} Email
                  </ContactItem>
                  <ContactItem $present={result.metadata.hasContactInfo.phone}>
                    {result.metadata.hasContactInfo.phone ? "✓" : "✗"} Phone
                  </ContactItem>
                  <ContactItem $present={result.metadata.hasContactInfo.linkedin}>
                    {result.metadata.hasContactInfo.linkedin ? "✓" : "✗"} LinkedIn
                  </ContactItem>
                  <ContactItem $present={result.metadata.hasContactInfo.location}>
                    {result.metadata.hasContactInfo.location ? "✓" : "✗"} Location
                  </ContactItem>
                </ContactChecklist>
              )}
            </ScoreCard>

            {/* ATS System Compatibility */}
            {result.atsCompatibility && (
              <ATSCompatibilitySection>
                <ATSCompatibilityTitle>
                  <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                  </svg>
                  ATS System Compatibility
                </ATSCompatibilityTitle>
                <ATSSystemsGrid>
                  <ATSSystemCard $level={result.atsCompatibility.workday}>
                    <ATSSystemName>Workday</ATSSystemName>
                    <ATSSystemLevel $level={result.atsCompatibility.workday}>
                      {result.atsCompatibility.workday}
                    </ATSSystemLevel>
                  </ATSSystemCard>
                  <ATSSystemCard $level={result.atsCompatibility.greenhouse}>
                    <ATSSystemName>Greenhouse</ATSSystemName>
                    <ATSSystemLevel $level={result.atsCompatibility.greenhouse}>
                      {result.atsCompatibility.greenhouse}
                    </ATSSystemLevel>
                  </ATSSystemCard>
                  <ATSSystemCard $level={result.atsCompatibility.taleo}>
                    <ATSSystemName>Taleo</ATSSystemName>
                    <ATSSystemLevel $level={result.atsCompatibility.taleo}>
                      {result.atsCompatibility.taleo}
                    </ATSSystemLevel>
                  </ATSSystemCard>
                  <ATSSystemCard $level={result.atsCompatibility.lever}>
                    <ATSSystemName>Lever</ATSSystemName>
                    <ATSSystemLevel $level={result.atsCompatibility.lever}>
                      {result.atsCompatibility.lever}
                    </ATSSystemLevel>
                  </ATSSystemCard>
                </ATSSystemsGrid>
              </ATSCompatibilitySection>
            )}

            {/* Keyword Stats */}
            {result.metadata?.keywordStats && (
              <StatsSection>
                <StatCard>
                  <StatValue>{result.metadata.keywordStats.hardSkillsCount}</StatValue>
                  <StatLabel>Hard Skills</StatLabel>
                </StatCard>
                <StatCard>
                  <StatValue>{result.metadata.keywordStats.actionVerbsCount}</StatValue>
                  <StatLabel>Action Verbs</StatLabel>
                </StatCard>
                <StatCard>
                  <StatValue>{result.metadata.keywordStats.quantifiedAchievements}</StatValue>
                  <StatLabel>Metrics Used</StatLabel>
                </StatCard>
                <StatCard>
                  <StatValue>{result.metadata.wordCount}</StatValue>
                  <StatLabel>Word Count</StatLabel>
                </StatCard>
              </StatsSection>
            )}

            {/* Category Breakdown */}
            <MetricsGrid>
              {Object.entries(result.categories).map(([key, category]) => (
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
              ))}
            </MetricsGrid>

            {/* Top Issues */}
            {result.topIssues && result.topIssues.length > 0 && (
              <TopIssuesSection>
                <TopIssuesTitle>Top Issues to Fix</TopIssuesTitle>
                {result.topIssues.slice(0, 5).map((issue, idx) => (
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

            {/* Quick Wins */}
            {result.quickWins && result.quickWins.length > 0 && (
              <QuickWinsSection>
                <QuickWinsTitle>
                  <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Quick Wins (5-minute fixes)
                </QuickWinsTitle>
                <QuickWinsList>
                  {result.quickWins.map((win, idx) => (
                    <QuickWinItem key={idx}>
                      <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path d="M5 13l4 4L19 7" />
                      </svg>
                      {win}
                    </QuickWinItem>
                  ))}
                </QuickWinsList>
              </QuickWinsSection>
            )}

            <CTASection>
              <CTATitle>Ready to Fix These Issues?</CTATitle>
              <CTAText>
                Sign up to get AI-powered suggestions and optimize your resume for maximum ATS compatibility.
              </CTAText>
              <CTAButton href={ROUTES.AUTH.SIGNUP}>
                Fix My Resume
                <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </CTAButton>
            </CTASection>

            <TryAgainButton onClick={handleTryAgain}>
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Analyze Another Resume
            </TryAgainButton>
          </ResultsSection>
        ) : (
          <UploadSection>
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
          </UploadSection>
        )}
      </MainContent>

      {/* SEO Content Section */}
      <SEOSection>
        <SEOTitle>How Our Resume Score Checker Works</SEOTitle>
        <SEOSubtitle>
          Our ATS resume checker analyzes your resume against the same criteria used by
          Fortune 500 companies to filter candidates automatically.
        </SEOSubtitle>

        <FeatureGrid>
          <FeatureCard>
            <FeatureIcon>
              <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </FeatureIcon>
            <FeatureTitle>Upload Your Resume</FeatureTitle>
            <FeatureText>
              Simply drag and drop your resume (PDF or DOCX). Our ATS score checker
              instantly parses your document.
            </FeatureText>
          </FeatureCard>

          <FeatureCard>
            <FeatureIcon>
              <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </FeatureIcon>
            <FeatureTitle>Get Your Resume Score</FeatureTitle>
            <FeatureText>
              Receive an instant ATS score out of 100, with detailed breakdown across
              format, structure, keywords, and readability.
            </FeatureText>
          </FeatureCard>

          <FeatureCard>
            <FeatureIcon>
              <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </FeatureIcon>
            <FeatureTitle>Fix & Optimize</FeatureTitle>
            <FeatureText>
              Get actionable suggestions to improve your resume score and pass
              ATS filters at companies like Google, Amazon, and Microsoft.
            </FeatureText>
          </FeatureCard>
        </FeatureGrid>

        <div style={{ marginTop: "64px" }}>
          <SEOTitle>Frequently Asked Questions</SEOTitle>
          <SEOSubtitle>
            Everything you need to know about ATS resume scoring and optimization.
          </SEOSubtitle>

          <FAQList>
            <FAQItem>
              <FAQQuestion>What is an ATS resume score?</FAQQuestion>
              <FAQAnswer>
                An ATS (Applicant Tracking System) resume score measures how well your resume
                will perform when parsed by automated hiring software. Companies like Workday,
                Greenhouse, Taleo, and Lever use ATS to filter resumes before human review.
                A score of 80+ typically means your resume will pass initial screening, while
                scores below 60 often result in automatic rejection — regardless of your qualifications.
              </FAQAnswer>
            </FAQItem>

            <FAQItem>
              <FAQQuestion>How do I check my resume score for free?</FAQQuestion>
              <FAQAnswer>
                Simply upload your resume (PDF or DOCX) to our free ATS resume checker above.
                Within seconds, you&apos;ll receive a comprehensive resume score breakdown including
                format analysis, keyword optimization, and compatibility ratings for major ATS
                systems. No signup required for the basic score check.
              </FAQAnswer>
            </FAQItem>

            <FAQItem>
              <FAQQuestion>What is a good ATS resume score?</FAQQuestion>
              <FAQAnswer>
                A good ATS resume score is 80 or above out of 100. Here&apos;s how to interpret your score:
                <br /><br />
                <strong>80-100 (Excellent):</strong> Your resume is well-optimized and should pass most ATS filters.<br />
                <strong>60-79 (Good):</strong> Acceptable but has room for improvement.<br />
                <strong>40-59 (Fair):</strong> Significant issues that may cause rejection.<br />
                <strong>Below 40 (Poor):</strong> Critical problems — most ATS systems will reject this resume.
              </FAQAnswer>
            </FAQItem>

            <FAQItem>
              <FAQQuestion>Why do 85% of resumes get rejected by ATS?</FAQQuestion>
              <FAQAnswer>
                Most resumes get rejected due to formatting issues (tables, graphics, text boxes,
                headers/footers), missing keywords, non-standard section headings, and poor structure.
                ATS systems struggle to parse creative layouts, causing qualified candidates to be
                filtered out before human review. Our resume score checker identifies these exact
                issues so you can fix them.
              </FAQAnswer>
            </FAQItem>

            <FAQItem>
              <FAQQuestion>Which ATS systems does this checker support?</FAQQuestion>
              <FAQAnswer>
                Our ATS resume checker analyzes your resume against the parsing behavior of the
                most popular ATS platforms: Workday (used by 50% of Fortune 500), Greenhouse
                (10,000+ companies), Taleo/Oracle (large enterprises), and Lever (fast-growing
                startups). Each system has different parsing quirks, and we show you compatibility
                ratings for all four.
              </FAQAnswer>
            </FAQItem>

            <FAQItem>
              <FAQQuestion>How can I improve my resume score quickly?</FAQQuestion>
              <FAQAnswer>
                The fastest ways to improve your ATS resume score:<br /><br />
                1. <strong>Use a simple, single-column layout</strong> — avoid tables, graphics, and text boxes<br />
                2. <strong>Use standard section headers</strong> — &quot;Experience&quot; not &quot;My Journey&quot;<br />
                3. <strong>Add quantified achievements</strong> — numbers and percentages stand out<br />
                4. <strong>Include relevant keywords</strong> — match the job description language<br />
                5. <strong>Save as .docx or simple PDF</strong> — avoid scanned images
              </FAQAnswer>
            </FAQItem>
          </FAQList>
        </div>
      </SEOSection>
    </PageContainer>
  );
}
