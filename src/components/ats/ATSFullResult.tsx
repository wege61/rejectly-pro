"use client";

import styled from "styled-components";
import { ATSScoreCircle } from "./ATSScoreCircle";
import { ATSCategoryCard } from "./ATSCategoryCard";
import { ATSParsingChecklist } from "./ATSParsingChecklist";
import { ATSBeforeAfter } from "./ATSBeforeAfter";

interface CategoryResult {
  name?: string;
  earnedPoints: number;
  maxPoints: number;
  percentage?: number;
  issues: Array<{
    issue: string;
    recommendation?: string;
    severity?: string;
  }>;
  passes: string[];
}

interface ATSFullResultProps {
  score: number;
  summary: string;
  categories: {
    format: CategoryResult;
    structure: CategoryResult;
    keywords: CategoryResult;
    readability: CategoryResult;
  };
  hasContactInfo?: {
    email: boolean;
    phone: boolean;
    linkedin: boolean;
    location: boolean;
  };
  parsingChecks?: {
    singleColumn: { ok: boolean; note: string };
    standardSections: { ok: boolean; note: string };
    cleanCharacters: { ok: boolean; note: string };
    abbreviations: { ok: boolean; note: string };
  };
  keywordStats?: {
    hardSkillsCount: number;
    softSkillsCount?: number;
    actionVerbsCount: number;
    quantifiedAchievements: number;
  };
  wordCount: number;
  topIssues?: Array<{
    severity: string;
    issue: string;
    suggestion?: string;
    recommendation?: string;
    category?: string;
  }>;
  potentialScore?: number;
  easyWinsPoints?: number;
  isOptimized?: boolean;
  beforeScore?: number;
  changes?: Array<{
    category: string;
    issue: string;
    fix: string;
    impact?: string;
  }>;
  onDownload?: () => void;
  onOptimize?: () => void;
  onPreview?: () => void;
  downloadUrl?: string;
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 32px;
  max-width: 1200px;
  margin: 0 auto;
`;

// Hero section with score
const HeroSection = styled.div<{ $isOptimized?: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
  padding: 48px 32px;
  border-radius: 24px;
  background: ${({ $isOptimized }) => 
    $isOptimized 
      ? "linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(30, 30, 40, 0.4) 100%)"
      : "rgba(30, 30, 40, 0.4)"};
  backdrop-filter: blur(20px) saturate(140%);
  border: 1px solid ${({ $isOptimized }) => 
    $isOptimized ? "rgba(16, 185, 129, 0.2)" : "rgba(255, 255, 255, 0.08)"};
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.05), 0 4px 24px rgba(0, 0, 0, 0.2);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
  }
`;

const HeroContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  text-align: center;
  z-index: 1;
`;

const InsightMessage = styled.p`
  font-size: 18px;
  color: rgba(255, 255, 255, 0.85);
  line-height: 1.5;
  margin: 0;
  max-width: 540px;
  
  strong {
    color: white;
    font-weight: 600;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 8px;

  @media (max-width: 640px) {
    flex-direction: column;
    width: 100%;
  }
`;

const Button = styled.button<{ $primary?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 14px 32px;
  border-radius: 9999px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
  
  ${({ $primary }) => $primary ? `
    background: linear-gradient(135deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 100%), var(--accent);
    color: white;
    border: none;
    box-shadow: inset 0 1.5px 0 rgba(255,255,255,0.4), 0 8px 24px rgba(var(--accent-rgb), 0.4);

    &:hover {
      transform: translateY(-2px);
      box-shadow: inset 0 1.5px 0 rgba(255,255,255,0.5), 0 12px 32px rgba(var(--accent-rgb), 0.5);
    }
  ` : `
    background: rgba(255,255,255,0.05);
    color: rgba(255,255,255,0.9);
    border: 1px solid rgba(255,255,255,0.12);
    backdrop-filter: blur(10px);

    &:hover {
      background: rgba(255,255,255,0.1);
      border-color: rgba(255,255,255,0.25);
    }
  `}

  &:active {
    transform: scale(0.98);
  }
`;

// Potential improvement inline
const PotentialBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  background: rgba(16, 185, 129, 0.1);
  border: 1px solid rgba(16, 185, 129, 0.2);
  border-radius: 9999px;
  font-size: 14px;
  color: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
`;

const PotentialValue = styled.span`
  font-weight: 700;
  color: #059669;
`;

// Section layout
const Section = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const SectionTitle = styled.h3`
  font-size: 16px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.95);
  margin: 0 0 8px 0;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const ActionList = styled.div`
  background: rgba(255, 255, 255, 0.02);
  backdrop-filter: blur(40px) saturate(140%);
  -webkit-backdrop-filter: blur(40px) saturate(140%);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 24px;
  padding: 8px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.05), inset 0 1px 0 rgba(255, 255, 255, 0.05);
`;

const ActionItem = styled.div<{ $severity: string }>`
  display: flex;
  align-items: flex-start;
  gap: 16px;
  padding: 16px;
  border-radius: 16px;
  transition: background 0.2s ease;

  &:not(:last-child) {
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  }

  &:hover {
    background: rgba(255, 255, 255, 0.03);
  }
`;

const ActionIcon = styled.div<{ $severity: string }>`
  width: 28px;
  height: 28px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  background: ${({ $severity }) => {
    switch ($severity) {
      case "critical":
      case "high": return "rgba(255, 59, 48, 0.1)"; // Apple Red
      case "medium": return "rgba(255, 149, 0, 0.1)"; // Apple Orange
      case "low": return "rgba(52, 199, 89, 0.1)"; // Apple Green
      default: return "rgba(255,255,255,0.1)";
    }
  }};
  color: ${({ $severity }) => {
    switch ($severity) {
      case "critical":
      case "high": return "#FF3B30";
      case "medium": return "#FF9500";
      case "low": return "#34C759";
      default: return "#fff";
    }
  }};
  
  svg {
    width: 14px;
    height: 14px;
  }
`;

const ActionContent = styled.div`
  flex: 1;
`;

const ActionTitle = styled.h4`
  font-size: 15px;
  font-weight: 600;
  color: white;
  margin: 0 0 4px 0;
`;

const ActionDesc = styled.p`
  font-size: 14px;
  color: rgba(255, 255, 255, 0.6);
  margin: 0;
  line-height: 1.4;
`;

// Two column grid
const TwoColumnGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

const GridCard = styled.div`
  background: var(--bg-color, #ffffff);
  border-radius: 12px;
  padding: 20px;
`;

const GridCardTitle = styled.h4`
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: var(--text-secondary, #6b7280);
  margin: 0 0 16px 0;
`;

// Health Stack for Categories
const HealthStack = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const getDynamicInsight = (score: number, totalIssues: number) => {
  if (score >= 85) return `Your resume is structurally sound. You scored an ${score}%. AI can fix the remaining ${totalIssues} minor issues instantly to guarantee perfect parsing.`;
  if (score >= 70) return `Your resume has good potential but lacks key structual elements. AI can automatically resolve ${totalIssues} formatting and keyword issues to get you over 85%.`;
  if (score >= 50) return `Your resume is at risk of being rejected by basic ATS filters. AI has identified ${totalIssues} critical issues that it can reorganize and fix for you right now.`;
  return `Serious parsing blocks detected. AI needs to completely rebuild your resume structure to fix ${totalIssues} errors before you apply.`;
};

export function ATSFullResult({
  score,
  summary,
  categories,
  hasContactInfo,
  parsingChecks,
  keywordStats,
  wordCount,
  topIssues = [],
  potentialScore,
  easyWinsPoints,
  isOptimized = false,
  beforeScore,
  changes = [],
  onDownload,
  onOptimize,
  onPreview,
  downloadUrl,
}: ATSFullResultProps) {
  const totalIssuesCount = Object.values(categories).reduce((acc, cat) => acc + cat.issues.length, 0);

  return (
    <Container>
      {/* Hero: Score + Summary + Actions */}
      <HeroSection $isOptimized={isOptimized}>
        <ATSScoreCircle score={score} size="large" />

        <HeroContent>
          {isOptimized && beforeScore ? (
            <InsightMessage>
              Your CV is now fully optimized for Application Tracking Systems! We improved your score from <strong>{beforeScore}%</strong> to <strong>{score}%</strong> by applying {changes.length} strategic fixes.
            </InsightMessage>
          ) : (
            <InsightMessage>{getDynamicInsight(score, totalIssuesCount)}</InsightMessage>
          )}

          {!isOptimized && potentialScore && potentialScore > score && (
            <PotentialBadge>
              Potential: <PotentialValue>{potentialScore}%</PotentialValue>
              {easyWinsPoints && easyWinsPoints > 0 && (
                <span>(+{easyWinsPoints} quick fixes)</span>
              )}
            </PotentialBadge>
          )}

          <ButtonGroup>
            {isOptimized && (downloadUrl || onPreview) && (
              <Button $primary onClick={onPreview}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                  <circle cx="12" cy="12" r="3"/>
                </svg>
                Preview & Download CV
              </Button>
            )}

            {!isOptimized && onOptimize && (
              <Button $primary onClick={onOptimize}>
                Optimize Resume Instantly
              </Button>
            )}
            {!isOptimized && onDownload && (
              <Button onClick={onDownload}>
                Download ATS Report
              </Button>
            )}
          </ButtonGroup>
        </HeroContent>
      </HeroSection>

      {/* Top Priority Issues (shown only if there are top issues and it's not the optimized version) */}
      {!isOptimized && topIssues && topIssues.length > 0 && (
        <Section>
          <SectionTitle>Action Items (AI will fix these)</SectionTitle>
          <ActionList>
            {topIssues.slice(0, 3).map((issue, idx) => (
              <ActionItem key={idx} $severity={issue.severity}>
                <ActionIcon $severity={issue.severity}>
                  {issue.severity === "critical" || issue.severity === "high" ? (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                  ) : issue.severity === "medium" ? (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                  ) : (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
                  )}
                </ActionIcon>
                <ActionContent>
                  <ActionTitle>{issue.issue}</ActionTitle>
                  {(issue.suggestion || issue.recommendation) && (
                    <ActionDesc>{issue.suggestion || issue.recommendation}</ActionDesc>
                  )}
                </ActionContent>
              </ActionItem>
            ))}
          </ActionList>
        </Section>
      )}

      {/* Optimized Result Mode: Show Before/After Comparison */}
      {isOptimized && beforeScore && (
        <Section>
          <ATSBeforeAfter 
            beforeScore={beforeScore} 
            afterScore={score} 
            changes={changes} 
          />
        </Section>
      )}

      {/* Categories - Health Stack (Only for Initial Report) */}
      {!isOptimized && (
        <Section>
          <SectionTitle>Category Breakdown</SectionTitle>
          <HealthStack>
            <ATSCategoryCard
              name="Format"
              earnedPoints={categories.format.earnedPoints}
              maxPoints={categories.format.maxPoints}
              issues={categories.format.issues}
              passes={categories.format.passes}
              changes={changes}
            />
            <ATSCategoryCard
              name="Structure"
              earnedPoints={categories.structure.earnedPoints}
              maxPoints={categories.structure.maxPoints}
              issues={categories.structure.issues}
              passes={categories.structure.passes}
              changes={changes}
            />
            <ATSCategoryCard
              name="Keywords"
              earnedPoints={categories.keywords.earnedPoints}
              maxPoints={categories.keywords.maxPoints}
              issues={categories.keywords.issues}
              passes={categories.keywords.passes}
              changes={changes}
            />
            <ATSCategoryCard
              name="Readability"
              earnedPoints={categories.readability.earnedPoints}
              maxPoints={categories.readability.maxPoints}
              issues={categories.readability.issues}
              passes={categories.readability.passes}
              changes={changes}
            />
          </HealthStack>
        </Section>
      )}

      {/* Parsing Compatibility (Only for Initial Report) */}
      {!isOptimized && parsingChecks && (
        <Section>
          <SectionTitle>ATS Parsing Checks</SectionTitle>
          <ATSParsingChecklist checks={parsingChecks} />
        </Section>
      )}

    </Container>
  );
}

export default ATSFullResult;
