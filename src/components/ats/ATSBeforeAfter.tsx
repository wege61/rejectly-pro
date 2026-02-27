"use client";

import styled, { keyframes } from "styled-components";
import { motion } from "motion/react";

interface ATSBeforeAfterProps {
  beforeScore: number;
  afterScore: number;
  changes: Array<{
    category: string;
    issue: string;
    fix: string;
    impact?: string;
  }>;
}

const getScoreColor = (score: number): string => {
  if (score >= 70) return "#059669";
  if (score >= 50) return "#d97706";
  return "#dc2626";
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const TopMetricsRow = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  margin-bottom: 32px;

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

const MetricCard = styled.div`
  background: rgba(255, 255, 255, 0.02);
  backdrop-filter: blur(40px) saturate(140%);
  -webkit-backdrop-filter: blur(40px) saturate(140%);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 20px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.05), inset 0 1px 0 rgba(255, 255, 255, 0.05);
`;

const MetricValue = styled.div<{ $color: string }>`
  font-size: 42px;
  font-weight: 700;
  color: ${({ $color }) => $color};
  line-height: 1;
  letter-spacing: -1px;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  margin-bottom: 8px;
`;

const MetricLabel = styled.div`
  font-size: 13px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: rgba(255, 255, 255, 0.6);
`;

const ChangesList = styled.div`
  background: rgba(255, 255, 255, 0.02);
  backdrop-filter: blur(40px) saturate(140%);
  -webkit-backdrop-filter: blur(40px) saturate(140%);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 24px;
  overflow: hidden;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.05), inset 0 1px 0 rgba(255, 255, 255, 0.05);
`;

const ListHeader = styled.div`
  padding: 20px 24px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const ListTitle = styled.h3`
  font-size: 16px;
  font-weight: 600;
  color: white;
  margin: 0;
`;

const ChangesCountBadge = styled.span`
  background: rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.9);
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 600;
`;

const ChangeRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 40px 1fr;
  align-items: center;
  gap: 16px;
  padding: 20px 24px;
  transition: background 0.2s ease;

  &:not(:last-child) {
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  }

  &:hover {
    background: rgba(255, 255, 255, 0.02);
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 12px;
  }
`;

const ChangeSide = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const ChangeSideLabel = styled.div<{ $type: "before" | "after" }>`
  font-size: 12px;
  font-weight: 600;
  color: ${({ $type }) => $type === "before" ? "#FF3B30" : "#34C759"};
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const ChangeText = styled.p`
  font-size: 14px;
  color: rgba(255, 255, 255, 0.85);
  margin: 0;
  line-height: 1.5;
`;

const ChangeArrow = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(255, 255, 255, 0.2);

  svg {
    width: 20px;
    height: 20px;
  }

  @media (max-width: 768px) {
    transform: rotate(90deg);
  }
`;

const CategoryBadge = styled.span`
  display: inline-block;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  padding: 4px 10px;
  border-radius: 6px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 8px;
  width: fit-content;
`;

export function ATSBeforeAfter({ beforeScore, afterScore, changes }: ATSBeforeAfterProps) {
  const improvement = afterScore - beforeScore;
  const beforeColor = getScoreColor(beforeScore);
  const afterColor = getScoreColor(afterScore);

  return (
    <Container>
      <TopMetricsRow>
        <MetricCard>
          <MetricValue $color="#34C759">+{improvement}</MetricValue>
          <MetricLabel>Score Increase</MetricLabel>
        </MetricCard>
        <MetricCard>
          <MetricValue $color="#007AFF">{changes.length}</MetricValue>
          <MetricLabel>Issues Fixed</MetricLabel>
        </MetricCard>
        <MetricCard>
          <MetricValue $color="white">{afterScore}%</MetricValue>
          <MetricLabel>New ATS Score</MetricLabel>
        </MetricCard>
      </TopMetricsRow>

      {changes.length > 0 && (
        <ChangesList>
          <ListHeader>
            <ListTitle>Optimization Log</ListTitle>
            <ChangesCountBadge>{changes.length} Fixes Applied</ChangesCountBadge>
          </ListHeader>
          
          <div>
            {changes.map((change, idx) => (
              <ChangeRow key={idx}>
                <ChangeSide>
                  <ChangeSideLabel $type="before">Identified Issue</ChangeSideLabel>
                  <ChangeText>{change.issue}</ChangeText>
                </ChangeSide>

                <ChangeArrow>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </ChangeArrow>

                <ChangeSide>
                  <ChangeSideLabel $type="after">AI Optimization</ChangeSideLabel>
                  <ChangeText>{change.fix}</ChangeText>
                </ChangeSide>
              </ChangeRow>
            ))}
          </div>
        </ChangesList>
      )}
    </Container>
  );
}

export default ATSBeforeAfter;
