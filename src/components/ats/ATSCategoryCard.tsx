"use client";

import styled from "styled-components";
import { useState } from "react";

interface ATSCategoryCardProps {
  name: string;
  earnedPoints: number;
  maxPoints: number;
  issues: Array<{
    issue: string;
    recommendation?: string;
    severity?: string;
  }>;
  passes: string[];
  expanded?: boolean;
}

const getScoreColor = (percentage: number): string => {
  if (percentage >= 70) return "#059669";
  if (percentage >= 50) return "#d97706";
  return "#dc2626";
};

const CheckIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const XIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const ChevronIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

const Card = styled.div`
  background: var(--bg-color, #ffffff);
  border: 1px solid var(--border-color, #e5e7eb);
  border-radius: 12px;
  overflow: hidden;
`;

const Header = styled.div<{ $isExpanded: boolean }>`
  padding: 16px 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background: var(--bg-alt, #f9fafb);
  }
`;

const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  flex: 1;
`;

const ScoreRing = styled.div<{ $percentage: number; $color: string }>`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: conic-gradient(
    ${({ $color }) => $color} ${({ $percentage }) => $percentage * 3.6}deg,
    var(--border-color, #e5e7eb) 0deg
  );
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  &::before {
    content: "";
    width: 38px;
    height: 38px;
    border-radius: 50%;
    background: var(--bg-color, #ffffff);
  }
`;

const ScoreValue = styled.span<{ $color: string }>`
  position: absolute;
  font-size: 14px;
  font-weight: 700;
  color: ${({ $color }) => $color};
`;

const ScoreRingWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const CategoryInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 1;
`;

const CategoryName = styled.span`
  font-weight: 600;
  font-size: 15px;
  color: var(--text-color, #1f2937);
`;

const CategoryMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const ScoreText = styled.span`
  font-size: 13px;
  color: var(--text-secondary, #6b7280);
`;

const IssueCount = styled.span<{ $hasIssues: boolean }>`
  font-size: 12px;
  font-weight: 500;
  padding: 2px 8px;
  border-radius: 4px;
  background: ${({ $hasIssues }) => $hasIssues ? "#fef2f2" : "#f0fdf4"};
  color: ${({ $hasIssues }) => $hasIssues ? "#dc2626" : "#059669"};
`;

const HeaderRight = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const ExpandIcon = styled.div<{ $isExpanded: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-secondary, #6b7280);
  transform: rotate(${({ $isExpanded }) => $isExpanded ? "180deg" : "0deg"});
  transition: transform 0.2s;
`;

const Content = styled.div<{ $isExpanded: boolean }>`
  max-height: ${({ $isExpanded }) => $isExpanded ? "1000px" : "0"};
  overflow: hidden;
  transition: max-height 0.3s ease-in-out;
`;

const ContentInner = styled.div`
  padding: 0 20px 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const Section = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const SectionHeader = styled.div<{ $type: "issues" | "passes" }>`
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: ${({ $type }) => $type === "issues" ? "#dc2626" : "#059669"};
  display: flex;
  align-items: center;
  gap: 6px;
  padding-bottom: 8px;
  border-bottom: 1px solid var(--border-color, #e5e7eb);
`;

const List = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const IssueItem = styled.li`
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 12px;
  background: var(--bg-alt, #f9fafb);
  border-radius: 8px;
  border-left: 3px solid #dc2626;
`;

const PassItem = styled.li`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 12px;
  background: var(--bg-alt, #f9fafb);
  border-radius: 8px;
  border-left: 3px solid #059669;
`;

const ItemIcon = styled.span<{ $type: "issue" | "pass" }>`
  flex-shrink: 0;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: ${({ $type }) => $type === "issue" ? "#fef2f2" : "#f0fdf4"};
  color: ${({ $type }) => $type === "issue" ? "#dc2626" : "#059669"};
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ItemContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const ItemText = styled.span`
  font-size: 14px;
  color: var(--text-color, #1f2937);
  line-height: 1.5;
`;

const ItemSuggestion = styled.span`
  font-size: 13px;
  color: var(--text-secondary, #6b7280);
  line-height: 1.5;
  padding: 8px 12px;
  background: var(--bg-color, #ffffff);
  border-radius: 6px;
  border-left: 2px solid #059669;
`;

const SeverityDot = styled.span<{ $severity: string }>`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${({ $severity }) =>
    $severity === "critical" ? "#dc2626" :
    $severity === "major" ? "#d97706" : "#6b7280"};
  flex-shrink: 0;
`;

const EmptyState = styled.div`
  padding: 20px;
  text-align: center;
  color: var(--text-secondary, #6b7280);
  font-size: 14px;
`;

export function ATSCategoryCard({
  name,
  earnedPoints,
  maxPoints,
  issues,
  passes,
  expanded = false
}: ATSCategoryCardProps) {
  const [isExpanded, setIsExpanded] = useState(expanded);
  const percentage = Math.round((earnedPoints / maxPoints) * 100);
  const color = getScoreColor(percentage);

  return (
    <Card>
      <Header $isExpanded={isExpanded} onClick={() => setIsExpanded(!isExpanded)}>
        <HeaderLeft>
          <ScoreRingWrapper>
            <ScoreRing $percentage={percentage} $color={color} />
            <ScoreValue $color={color}>{percentage}%</ScoreValue>
          </ScoreRingWrapper>
          <CategoryInfo>
            <CategoryName>{name}</CategoryName>
            <CategoryMeta>
              <ScoreText>{earnedPoints}/{maxPoints} pts</ScoreText>
              {issues.length > 0 && (
                <IssueCount $hasIssues={true}>{issues.length} issues</IssueCount>
              )}
              {issues.length === 0 && passes.length > 0 && (
                <IssueCount $hasIssues={false}>All passed</IssueCount>
              )}
            </CategoryMeta>
          </CategoryInfo>
        </HeaderLeft>

        <HeaderRight>
          <ExpandIcon $isExpanded={isExpanded}>
            <ChevronIcon />
          </ExpandIcon>
        </HeaderRight>
      </Header>

      <Content $isExpanded={isExpanded}>
        <ContentInner>
          {issues.length > 0 && (
            <Section>
              <SectionHeader $type="issues">
                <XIcon /> Issues to fix
              </SectionHeader>
              <List>
                {issues.map((issue, idx) => (
                  <IssueItem key={idx}>
                    <ItemIcon $type="issue">
                      {issue.severity && <SeverityDot $severity={issue.severity} />}
                      {!issue.severity && <XIcon />}
                    </ItemIcon>
                    <ItemContent>
                      <ItemText>{issue.issue}</ItemText>
                      {issue.recommendation && (
                        <ItemSuggestion>{issue.recommendation}</ItemSuggestion>
                      )}
                    </ItemContent>
                  </IssueItem>
                ))}
              </List>
            </Section>
          )}

          {passes.length > 0 && (
            <Section>
              <SectionHeader $type="passes">
                <CheckIcon /> Passed checks
              </SectionHeader>
              <List>
                {passes.map((pass, idx) => (
                  <PassItem key={idx}>
                    <ItemIcon $type="pass">
                      <CheckIcon />
                    </ItemIcon>
                    <ItemText>{pass}</ItemText>
                  </PassItem>
                ))}
              </List>
            </Section>
          )}

          {issues.length === 0 && passes.length === 0 && (
            <EmptyState>No details available</EmptyState>
          )}
        </ContentInner>
      </Content>
    </Card>
  );
}

export default ATSCategoryCard;
