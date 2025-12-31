"use client";

import styled from "styled-components";

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

const ComparisonRow = styled.div`
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  gap: 16px;
  align-items: center;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 12px;
  }
`;

const ScoreCard = styled.div<{ $type: "before" | "after" }>`
  background: var(--bg-alt, #f9fafb);
  border: 1px solid ${({ $type }) => $type === "after" ? "#059669" : "var(--border-color, #e5e7eb)"};
  border-radius: 12px;
  padding: 24px;
  text-align: center;
`;

const ScoreLabel = styled.div<{ $type: "before" | "after" }>`
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: ${({ $type }) => $type === "after" ? "#059669" : "var(--text-secondary, #6b7280)"};
  margin-bottom: 12px;
`;

const ScoreNumber = styled.div<{ $color: string }>`
  font-size: 48px;
  font-weight: 700;
  color: ${({ $color }) => $color};
  line-height: 1;
`;

const ScoreMax = styled.div`
  font-size: 13px;
  color: var(--text-secondary, #6b7280);
  margin-top: 4px;
`;

const Arrow = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;

  @media (max-width: 768px) {
    flex-direction: row;
    padding: 8px 0;
  }
`;

const ArrowIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 8px;
  background: var(--bg-alt, #f3f4f6);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-secondary, #6b7280);
  font-size: 18px;
`;

const ImprovementBadge = styled.div`
  background: var(--bg-alt, #f3f4f6);
  color: #059669;
  padding: 4px 12px;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 600;
`;

const ChangesSection = styled.div`
  background: var(--bg-color, #ffffff);
  border: 1px solid var(--border-color, #e5e7eb);
  border-radius: 12px;
  overflow: hidden;
`;

const ChangesSectionHeader = styled.div`
  background: var(--bg-alt, #f9fafb);
  padding: 12px 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid var(--border-color, #e5e7eb);
`;

const ChangesTitle = styled.h3`
  font-size: 14px;
  font-weight: 600;
  color: var(--text-color, #1f2937);
  margin: 0;
`;

const ChangesCount = styled.span`
  font-size: 12px;
  color: var(--text-secondary, #6b7280);
`;

const ChangesList = styled.div`
  display: flex;
  flex-direction: column;
`;

const ChangeItem = styled.div`
  display: grid;
  grid-template-columns: 1fr 32px 1fr;
  gap: 12px;
  padding: 16px;
  border-bottom: 1px solid var(--border-color, #e5e7eb);
  align-items: start;

  &:last-child {
    border-bottom: none;
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 8px;
  }
`;

const ChangeColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const ChangeLabel = styled.div<{ $type: "before" | "after" }>`
  font-size: 10px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: ${({ $type }) => $type === "before" ? "#dc2626" : "#059669"};
`;

const ChangeText = styled.div<{ $type: "before" | "after" }>`
  font-size: 13px;
  line-height: 1.5;
  color: var(--text-color, #1f2937);
  padding: 10px 12px;
  background: var(--bg-alt, #f9fafb);
  border-radius: 6px;
  border-left: 3px solid ${({ $type }) => $type === "before" ? "#dc2626" : "#059669"};
`;

const ChangeArrow = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-secondary, #6b7280);
  font-size: 16px;
  padding-top: 20px;

  @media (max-width: 768px) {
    padding: 0;
    justify-content: flex-start;
  }
`;

const CategoryBadge = styled.span`
  display: inline-block;
  font-size: 10px;
  font-weight: 500;
  text-transform: uppercase;
  padding: 2px 8px;
  border-radius: 4px;
  background: var(--bg-alt, #f3f4f6);
  color: var(--text-secondary, #6b7280);
  margin-bottom: 6px;
  width: fit-content;
`;

export function ATSBeforeAfter({ beforeScore, afterScore, changes }: ATSBeforeAfterProps) {
  const improvement = afterScore - beforeScore;
  const beforeColor = getScoreColor(beforeScore);
  const afterColor = getScoreColor(afterScore);

  return (
    <Container>
      <ComparisonRow>
        <ScoreCard $type="before">
          <ScoreLabel $type="before">Before</ScoreLabel>
          <ScoreNumber $color={beforeColor}>{beforeScore}</ScoreNumber>
          <ScoreMax>/100</ScoreMax>
        </ScoreCard>

        <Arrow>
          <ArrowIcon>→</ArrowIcon>
          <ImprovementBadge>+{improvement}</ImprovementBadge>
        </Arrow>

        <ScoreCard $type="after">
          <ScoreLabel $type="after">After</ScoreLabel>
          <ScoreNumber $color={afterColor}>{afterScore}</ScoreNumber>
          <ScoreMax>/100</ScoreMax>
        </ScoreCard>
      </ComparisonRow>

      {changes.length > 0 && (
        <ChangesSection>
          <ChangesSectionHeader>
            <ChangesTitle>Changes</ChangesTitle>
            <ChangesCount>{changes.length} items</ChangesCount>
          </ChangesSectionHeader>

          <ChangesList>
            {changes.map((change, idx) => (
              <ChangeItem key={idx}>
                <ChangeColumn>
                  <CategoryBadge>{change.category}</CategoryBadge>
                  <ChangeLabel $type="before">Issue</ChangeLabel>
                  <ChangeText $type="before">{change.issue}</ChangeText>
                </ChangeColumn>

                <ChangeArrow>→</ChangeArrow>

                <ChangeColumn>
                  <div style={{ height: "18px" }} />
                  <ChangeLabel $type="after">Fixed</ChangeLabel>
                  <ChangeText $type="after">{change.fix}</ChangeText>
                </ChangeColumn>
              </ChangeItem>
            ))}
          </ChangesList>
        </ChangesSection>
      )}
    </Container>
  );
}

export default ATSBeforeAfter;
