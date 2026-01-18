"use client";

import styled from "styled-components";
import { ATSScoreCircle } from "./ATSScoreCircle";
import { ATSCategoryCard } from "./ATSCategoryCard";
import { ATSContactInfo } from "./ATSContactInfo";
import { ATSParsingChecklist } from "./ATSParsingChecklist";
import { ATSStatsGrid } from "./ATSStatsGrid";
import { ATSIssuesList } from "./ATSIssuesList";
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
  hasContactInfo: {
    email: boolean;
    phone: boolean;
    linkedin: boolean;
    location: boolean;
  };
  parsingChecks: {
    singleColumn: { ok: boolean; note: string };
    standardSections: { ok: boolean; note: string };
    cleanCharacters: { ok: boolean; note: string };
    abbreviations: { ok: boolean; note: string };
  };
  keywordStats: {
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
const HeroSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
  padding: 32px;
  background: var(--bg-color, #ffffff);
`;

const HeroContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  text-align: center;
`;

const SummaryText = styled.p`
  font-size: 15px;
  line-height: 1.6;
  color: var(--text-secondary, #6b7280);
  margin: 0;
  max-width: 500px;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
`;

const Button = styled.button<{ $primary?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 28px;
  font-size: 14px;
  font-weight: 600;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  background: ${({ $primary }) => $primary ? "var(--primary-500)" : "var(--bg-alt, #f9fafb)"};
  color: ${({ $primary }) => $primary ? "white" : "var(--text-color, #1f2937)"};
  border: none;

  &:hover {
    background: ${({ $primary }) => $primary ? "var(--primary-700)" : "var(--bg-color, #e5e7eb)"};
  }
`;

// Potential improvement inline
const PotentialBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: var(--bg-alt, #f9fafb);
  border-radius: 8px;
  font-size: 13px;
  color: var(--text-secondary, #6b7280);
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
  font-size: 13px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: var(--text-secondary, #6b7280);
  margin: 0;
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

// Categories grid - 2x2
const CategoriesGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

// Success banner
const SuccessBanner = styled.div`
  background: #059669;
  color: white;
  padding: 16px 24px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 16px;
`;

const SuccessText = styled.div`
  font-size: 15px;
  font-weight: 500;
`;

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

  return (
    <Container>
      {/* Success banner for optimized results */}
      {isOptimized && beforeScore && (
        <SuccessBanner>
          <SuccessText>
            Score improved: {beforeScore} → {score} (+{score - beforeScore} pts)
          </SuccessText>
          {(downloadUrl || onPreview) && (
            <Button $primary style={{ padding: "10px 20px" }} onClick={onPreview}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                <circle cx="12" cy="12" r="3"/>
              </svg>
              Preview & Download
            </Button>
          )}
        </SuccessBanner>
      )}

      {/* Before/After comparison */}
      {isOptimized && beforeScore && changes.length > 0 && (
        <ATSBeforeAfter
          beforeScore={beforeScore}
          afterScore={score}
          changes={changes}
        />
      )}

      {/* Hero: Score + Summary + Actions */}
      <HeroSection>
        <ATSScoreCircle score={score} size="large" />

        <HeroContent>
          <SummaryText>{summary}</SummaryText>

          {potentialScore && potentialScore > score && (
            <PotentialBadge>
              Potential: <PotentialValue>{potentialScore}</PotentialValue>
              {easyWinsPoints && easyWinsPoints > 0 && (
                <span>(+{easyWinsPoints} quick fixes)</span>
              )}
            </PotentialBadge>
          )}
        </HeroContent>

        {!isOptimized && (onOptimize || onDownload) && (
          <ButtonGroup>
            {onOptimize && (
              <Button $primary onClick={onOptimize}>
                Optimize resume
              </Button>
            )}
            {onDownload && (
              <Button onClick={onDownload}>
                Download Report
              </Button>
            )}
          </ButtonGroup>
        )}
      </HeroSection>

      {/* Categories - 2x2 grid */}
      <Section>
        <SectionTitle>Detailed Breakdown</SectionTitle>
        <CategoriesGrid>
          <ATSCategoryCard
            name="Format"
            earnedPoints={categories.format.earnedPoints}
            maxPoints={categories.format.maxPoints}
            issues={categories.format.issues}
            passes={categories.format.passes}
          />
          <ATSCategoryCard
            name="Structure"
            earnedPoints={categories.structure.earnedPoints}
            maxPoints={categories.structure.maxPoints}
            issues={categories.structure.issues}
            passes={categories.structure.passes}
          />
          <ATSCategoryCard
            name="Keywords"
            earnedPoints={categories.keywords.earnedPoints}
            maxPoints={categories.keywords.maxPoints}
            issues={categories.keywords.issues}
            passes={categories.keywords.passes}
          />
          <ATSCategoryCard
            name="Readability"
            earnedPoints={categories.readability.earnedPoints}
            maxPoints={categories.readability.maxPoints}
            issues={categories.readability.issues}
            passes={categories.readability.passes}
          />
        </CategoriesGrid>
      </Section>


      {/* Contact & Stats - Two columns */}
      <TwoColumnGrid>
        <GridCard>
          <GridCardTitle>Contact Information</GridCardTitle>
          <ATSContactInfo hasContactInfo={hasContactInfo} />
        </GridCard>
        <GridCard>
          <GridCardTitle>Resume statistics</GridCardTitle>
          <ATSStatsGrid stats={keywordStats} wordCount={wordCount} />
        </GridCard>
      </TwoColumnGrid>

      {/* Parsing Compatibility */}
      <Section>
        <SectionTitle>ATS Parsing Checks</SectionTitle>
        <ATSParsingChecklist checks={parsingChecks} />
      </Section>

      
      {/* Top Issues */}
      {topIssues.length > 0 && (
        <Section>
          <SectionTitle>Priority Issues</SectionTitle>
          <ATSIssuesList issues={topIssues} maxItems={5} />
        </Section>
      )}
    </Container>
  );
}

export default ATSFullResult;
