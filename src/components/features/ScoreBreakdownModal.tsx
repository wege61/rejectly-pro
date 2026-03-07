"use client";

import styled from "styled-components";
import { Drawer, DrawerHeader, DrawerTitle, DrawerDescription, DrawerBody, DrawerFooter } from "@/components/ui/Drawer";
import { Button } from "@/components/ui/Button";
import {
  ScoreBreakdown,
  getVerdictText,
  getVerdictColor,
} from "@/types/scoreBreakdown";

interface ScoreBreakdownModalProps {
  isOpen: boolean;
  onClose: () => void;
  breakdown: ScoreBreakdown | null;
  fitScore: number;
  originalScore?: number;
}

// --- Styled Components ---

const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: 32px;
`;

// Hero Section - Clean and focused
const ScoreHero = styled.div`
  text-align: center;
  padding: 16px 0 24px;
  border-bottom: 1px solid var(--border);
`;

const ScoreDisplay = styled.div`
  display: flex;
  align-items: baseline;
  justify-content: center;
  gap: 8px;
  margin-bottom: 8px;
`;

const OriginalScore = styled.span`
  font-size: 24px;
  font-weight: 500;
  color: var(--text-tertiary);
  text-decoration: line-through;
`;

const MainScore = styled.span<{ $color: string }>`
  font-size: 56px;
  font-weight: 600;
  color: ${({ $color }) => $color};
  letter-spacing: -3px;
  line-height: 1;
`;

const ScoreLabel = styled.p`
  font-size: 15px;
  color: var(--text-secondary);
  margin: 0 0 16px;
`;

const Verdict = styled.p<{ $color: string }>`
  font-size: 14px;
  font-weight: 500;
  color: ${({ $color }) => $color};
  margin: 0;
`;

// Score Summary - Simple row
const ScoreSummary = styled.div`
  display: flex;
  justify-content: center;
  gap: 32px;
  padding: 20px 0;
  border-bottom: 1px solid var(--border);
`;

const SummaryItem = styled.div`
  text-align: center;
`;

const SummaryValue = styled.div<{ $color?: string }>`
  font-size: 24px;
  font-weight: 600;
  color: ${({ $color }) => $color || 'var(--text-primary)'};
  margin-bottom: 4px;
`;

const SummaryLabel = styled.div`
  font-size: 12px;
  color: var(--text-tertiary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

// Components Section
const Section = styled.div``;

const SectionTitle = styled.h3`
  font-size: 13px;
  font-weight: 600;
  color: var(--text-tertiary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin: 0 0 16px;
`;

const ComponentsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const ComponentItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const ComponentHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ComponentName = styled.span`
  font-size: 15px;
  font-weight: 500;
  color: var(--text-primary);
`;

const ComponentScore = styled.span<{ $color: string }>`
  font-size: 15px;
  font-weight: 600;
  color: ${({ $color }) => $color};
`;

const ProgressBar = styled.div`
  height: 4px;
  background: ${({ theme }) => theme.colors.border};
  border-radius: 2px;
  overflow: hidden;
`;

const ProgressFill = styled.div<{ $width: number; $color: string }>`
  height: 100%;
  width: ${({ $width }) => Math.min($width, 100)}%;
  background: ${({ $color }) => $color};
  border-radius: 2px;
  transition: width 0.5s ease-out;
`;

const ComponentDetails = styled.div`
  display: flex;
  gap: 24px;
  margin-top: 4px;
`;

const DetailGroup = styled.div`
  flex: 1;
`;

const DetailLabel = styled.p`
  font-size: 11px;
  font-weight: 500;
  color: var(--text-tertiary);
  text-transform: uppercase;
  letter-spacing: 0.3px;
  margin: 0 0 6px;
`;

const DetailList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const DetailItem = styled.li<{ $type: 'matched' | 'missing' }>`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: ${({ $type }) => $type === 'matched' ? 'var(--text-secondary)' : 'var(--text-tertiary)'};
  padding: 3px 0;
`;

const StatusDot = styled.span<{ $type: 'matched' | 'missing' }>`
  width: 6px;
  height: 6px;
  background: ${({ $type }) => $type === 'matched' ? 'var(--primary-500, #35A29F)' : '#F97316'};
  border-radius: 50%;
  flex-shrink: 0;
`;

const MoreItems = styled.span`
  font-size: 12px;
  color: var(--text-tertiary);
  font-style: italic;
`;

// Penalties Section
const PenaltiesList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const PenaltyItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 16px;
`;

const PenaltyInfo = styled.div`
  flex: 1;
`;

const PenaltyDescription = styled.p`
  font-size: 14px;
  color: var(--text-primary);
  margin: 0 0 2px;
`;

const PenaltyReason = styled.p`
  font-size: 12px;
  color: var(--text-tertiary);
  margin: 0;
`;

const PenaltyPoints = styled.span`
  font-size: 14px;
  font-weight: 600;
  color: #ef4444;
  flex-shrink: 0;
`;

const NoPenalties = styled.p`
  font-size: 14px;
  color: var(--primary-500, #35A29F);
  margin: 0;
`;

// Assessment Section
const AssessmentText = styled.p`
  font-size: 14px;
  color: var(--text-secondary);
  line-height: 1.6;
  margin: 0 0 12px;
`;

const PrimaryGap = styled.p`
  font-size: 13px;
  color: var(--text-tertiary);
  margin: 0;

  strong {
    color: var(--text-secondary);
  }
`;

// --- Helpers ---

const getScoreColor = (score: number): string => {
  if (score >= 75) return "var(--primary-500, #35A29F)";
  if (score >= 60) return "#2a57a0";
  if (score >= 45) return "#EAB308";
  return "#F97316";
};

const getProgressColor = (percentage: number): string => {
  if (percentage >= 75) return "var(--primary-500, #35A29F)";
  if (percentage >= 50) return "#EAB308";
  return "#ef4444";
};

// --- Component ---

export const ScoreBreakdownModal: React.FC<ScoreBreakdownModalProps> = ({
  isOpen,
  onClose,
  breakdown,
  fitScore,
  originalScore,
}) => {
  if (!breakdown) return null;

  const components = [
    breakdown.components.skillsMatch,
    breakdown.components.experienceMatch,
    breakdown.components.industryRelevance,
    breakdown.components.educationCerts,
  ].filter(Boolean);

  const verdictColor = getVerdictColor(breakdown.assessment.verdict);
  const scoreColor = getScoreColor(fitScore);

  return (
    <Drawer isOpen={isOpen} onClose={onClose}>
      <DrawerHeader>
        <DrawerTitle>Score Breakdown</DrawerTitle>
        <DrawerDescription>How your resume matches the job requirements</DrawerDescription>
      </DrawerHeader>
      <DrawerBody>
        <Content>
          {/* Hero Score */}
          <ScoreHero>
            <ScoreDisplay>
              {originalScore !== undefined && originalScore !== fitScore && (
                <OriginalScore>{originalScore}%</OriginalScore>
              )}
              <MainScore $color={scoreColor}>{fitScore}%</MainScore>
            </ScoreDisplay>
            <ScoreLabel>{breakdown.displayData.scoreLabel}</ScoreLabel>
            <Verdict $color={verdictColor}>
              {getVerdictText(breakdown.assessment.verdict)}
            </Verdict>
          </ScoreHero>

          {/* Score Summary */}
          <ScoreSummary>
            <SummaryItem>
              <SummaryValue>{breakdown.rawScore}%</SummaryValue>
              <SummaryLabel>Raw Score</SummaryLabel>
            </SummaryItem>
            <SummaryItem>
              <SummaryValue $color="#F97316">−{breakdown.totalPenalties}%</SummaryValue>
              <SummaryLabel>Penalties</SummaryLabel>
            </SummaryItem>
            <SummaryItem>
              <SummaryValue $color={scoreColor}>{breakdown.finalScore}%</SummaryValue>
              <SummaryLabel>Final Score</SummaryLabel>
            </SummaryItem>
          </ScoreSummary>

          {/* Components */}
          <Section>
            <SectionTitle>Score Components</SectionTitle>
            <ComponentsList>
              {components.map((component) => {
                const pColor = getProgressColor(component!.percentage);
                const matched = component!.matchedItems || [];
                const missing = component!.missingItems || [];

                return (
                  <ComponentItem key={component!.name}>
                    <ComponentHeader>
                      <ComponentName>{component!.name}</ComponentName>
                      <ComponentScore $color={pColor}>
                        {Math.round(component!.percentage)}%
                      </ComponentScore>
                    </ComponentHeader>
                    <ProgressBar>
                      <ProgressFill $width={component!.percentage} $color={pColor} />
                    </ProgressBar>
                    {(matched.length > 0 || missing.length > 0) && (
                      <ComponentDetails>
                        {matched.length > 0 && (
                          <DetailGroup>
                            <DetailLabel>Matched</DetailLabel>
                            <DetailList>
                              {matched.slice(0, 3).map((item, i) => (
                                <DetailItem key={i} $type="matched">
                                  <StatusDot $type="matched" />
                                  {item}
                                </DetailItem>
                              ))}
                              {matched.length > 3 && (
                                <MoreItems>+{matched.length - 3} more</MoreItems>
                              )}
                            </DetailList>
                          </DetailGroup>
                        )}
                        {missing.length > 0 && (
                          <DetailGroup>
                            <DetailLabel>Missing</DetailLabel>
                            <DetailList>
                              {missing.slice(0, 3).map((item, i) => (
                                <DetailItem key={i} $type="missing">
                                  <StatusDot $type="missing" />
                                  {item}
                                </DetailItem>
                              ))}
                              {missing.length > 3 && (
                                <MoreItems>+{missing.length - 3} more</MoreItems>
                              )}
                            </DetailList>
                          </DetailGroup>
                        )}
                      </ComponentDetails>
                    )}
                  </ComponentItem>
                );
              })}
            </ComponentsList>
          </Section>

          {/* Penalties */}
          {breakdown.penalties && breakdown.penalties.length > 0 && (
            <Section>
              <SectionTitle>Penalties</SectionTitle>
              <PenaltiesList>
                {breakdown.penalties.map((penalty) => (
                  <PenaltyItem key={penalty.id}>
                    <PenaltyInfo>
                      <PenaltyDescription>{penalty.description}</PenaltyDescription>
                      {penalty.reason && <PenaltyReason>{penalty.reason}</PenaltyReason>}
                    </PenaltyInfo>
                    <PenaltyPoints>−{penalty.pointsDeducted}</PenaltyPoints>
                  </PenaltyItem>
                ))}
              </PenaltiesList>
            </Section>
          )}

          {breakdown.penalties && breakdown.penalties.length === 0 && (
            <Section>
              <SectionTitle>Penalties</SectionTitle>
              <NoPenalties>No penalties applied</NoPenalties>
            </Section>
          )}

          {/* Assessment */}
          <Section>
            <SectionTitle>Assessment</SectionTitle>
            <AssessmentText>{breakdown.assessment.recommendation}</AssessmentText>
            <PrimaryGap>
              <strong>Primary Gap:</strong> {breakdown.displayData.primaryGap}
            </PrimaryGap>
          </Section>
        </Content>
      </DrawerBody>
      <DrawerFooter>
        <Button variant="primary" onClick={onClose} style={{width: "300px", maxWidth: "95%"}}>
          Done
        </Button>
      </DrawerFooter>
    </Drawer>
  );
};
