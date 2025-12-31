"use client";

import styled from "styled-components";
import { ATSScoreCircle } from "./ATSScoreCircle";
import { ATSContactInfo } from "./ATSContactInfo";
import { ATSCompatibilityGrid } from "./ATSCompatibilityGrid";
import { ATSStatsGrid } from "./ATSStatsGrid";

interface ATSResultSummaryProps {
  score: number;
  summary: string;
  hasContactInfo: {
    email: boolean;
    phone: boolean;
    linkedin: boolean;
    location: boolean;
  };
  atsCompatibility: {
    workday: { rating: string; reason?: string };
    greenhouse: { rating: string; reason?: string };
    taleo: { rating: string; reason?: string };
    lever: { rating: string; reason?: string };
  };
  keywordStats: {
    hardSkillsCount: number;
    softSkillsCount?: number;
    actionVerbsCount: number;
    quantifiedAchievements: number;
  };
  wordCount: number;
  potentialScore?: number;
  easyWinsPoints?: number;
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 32px;
`;

const TopSection = styled.div`
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 40px;
  align-items: start;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 24px;
  }
`;

const ScoreSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
`;

const InfoSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const SummaryText = styled.p`
  font-size: 16px;
  line-height: 1.7;
  color: var(--text-color, #1f2937);
  margin: 0;
  padding: 20px;
  background: var(--bg-alt, #f9fafb);
  border-radius: 12px;
  border-left: 4px solid #6366f1;
`;

const SectionTitle = styled.h3`
  font-size: 14px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: var(--text-secondary, #6b7280);
  margin: 0 0 12px 0;
`;

const Section = styled.div`
  display: flex;
  flex-direction: column;
`;

const PotentialCard = styled.div`
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.08) 0%, rgba(139, 92, 246, 0.08) 100%);
  border: 1px solid rgba(99, 102, 241, 0.2);
  border-radius: 12px;
  padding: 16px 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;

  @media (max-width: 640px) {
    flex-direction: column;
    text-align: center;
  }
`;

const PotentialText = styled.div`
  font-size: 14px;
  color: var(--text-color, #1f2937);

  strong {
    color: #6366f1;
  }
`;

const PotentialScores = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 18px;
  font-weight: 700;
`;

const CurrentScore = styled.span`
  color: var(--text-secondary, #6b7280);
`;

const ArrowRight = styled.span`
  color: #10b981;
`;

const PotentialScore = styled.span`
  color: #10b981;
`;

const EasyWins = styled.span`
  font-size: 12px;
  color: #10b981;
  background: #dcfce7;
  padding: 4px 10px;
  border-radius: 12px;
  font-weight: 600;
`;

export function ATSResultSummary({
  score,
  summary,
  hasContactInfo,
  atsCompatibility,
  keywordStats,
  wordCount,
  potentialScore,
  easyWinsPoints,
}: ATSResultSummaryProps) {
  return (
    <Container>
      <TopSection>
        <ScoreSection>
          <ATSScoreCircle score={score} size="large" />

          {potentialScore && potentialScore > score && (
            <PotentialCard>
              <PotentialText>
                <strong>Your Improvement Potential</strong>
              </PotentialText>
              <PotentialScores>
                <CurrentScore>{score}</CurrentScore>
                <ArrowRight>→</ArrowRight>
                <PotentialScore>{potentialScore}</PotentialScore>
                {easyWinsPoints && easyWinsPoints > 0 && (
                  <EasyWins>+{easyWinsPoints} easy</EasyWins>
                )}
              </PotentialScores>
            </PotentialCard>
          )}
        </ScoreSection>

        <InfoSection>
          <SummaryText>{summary}</SummaryText>

          <Section>
            <SectionTitle>Contact Information</SectionTitle>
            <ATSContactInfo hasContactInfo={hasContactInfo} />
          </Section>
        </InfoSection>
      </TopSection>

      <Section>
        <SectionTitle>ATS System Compatibility</SectionTitle>
        <ATSCompatibilityGrid compatibility={atsCompatibility} />
      </Section>

      <Section>
        <SectionTitle>CV Statistics</SectionTitle>
        <ATSStatsGrid stats={keywordStats} wordCount={wordCount} />
      </Section>
    </Container>
  );
}

export default ATSResultSummary;
