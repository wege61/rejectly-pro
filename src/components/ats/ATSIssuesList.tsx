"use client";

import styled from "styled-components";

interface ATSIssue {
  severity: string;
  issue: string;
  suggestion?: string;
  recommendation?: string;
  category?: string;
}

interface ATSIssuesListProps {
  issues: ATSIssue[];
  title?: string;
  maxItems?: number;
}

const getSeverityData = (severity: string): { label: string; color: string; priority: number } => {
  switch (severity) {
    case "critical":
      return { label: "Critical", color: "#dc2626", priority: 1 };
    case "major":
      return { label: "Major", color: "#d97706", priority: 2 };
    default:
      return { label: "Minor", color: "#6b7280", priority: 3 };
  }
};

const AlertIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="8" x2="12" y2="12" />
    <line x1="12" y1="16" x2="12.01" y2="16" />
  </svg>
);

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const Title = styled.h3`
  font-size: 14px;
  font-weight: 600;
  color: var(--text-color, #1f2937);
  margin: 0 0 4px 0;
`;

const IssueCard = styled.div<{ $severity: string }>`
  display: flex;
  gap: 14px;
  padding: 16px;
  background: var(--bg-color, #ffffff);
  border: 1px solid var(--border-color, #e5e7eb);
  border-left: 4px solid ${({ $severity }) =>
    $severity === "critical" ? "#dc2626" :
    $severity === "major" ? "#d97706" : "#6b7280"};
  border-radius: 8px;
  transition: all 0.2s;

  &:hover {
    background: var(--bg-alt, #f9fafb);
  }
`;

const PriorityBadge = styled.div<{ $color: string }>`
  width: 28px;
  height: 28px;
  border-radius: 6px;
  background: ${({ $color }) => `${$color}15`};
  color: ${({ $color }) => $color};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

const Content = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const IssueHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
`;

const SeverityBadge = styled.span<{ $color: string }>`
  font-size: 10px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  padding: 3px 8px;
  border-radius: 4px;
  background: ${({ $color }) => `${$color}15`};
  color: ${({ $color }) => $color};
`;

const CategoryBadge = styled.span`
  font-size: 10px;
  font-weight: 500;
  text-transform: uppercase;
  padding: 3px 8px;
  border-radius: 4px;
  background: var(--bg-alt, #f3f4f6);
  color: var(--text-secondary, #6b7280);
`;

const IssueText = styled.p`
  font-size: 14px;
  font-weight: 500;
  color: var(--text-color, #1f2937);
  margin: 0;
  line-height: 1.5;
`;

const Suggestion = styled.div`
  font-size: 13px;
  color: var(--text-secondary, #6b7280);
  line-height: 1.5;
  padding: 10px 12px;
  background: var(--bg-alt, #f9fafb);
  border-radius: 6px;
  border-left: 2px solid #059669;
`;

export function ATSIssuesList({ issues, title, maxItems }: ATSIssuesListProps) {
  const displayIssues = maxItems ? issues.slice(0, maxItems) : issues;

  if (issues.length === 0) {
    return null;
  }

  return (
    <Container>
      {title && <Title>{title}</Title>}

      {displayIssues.map((issue, idx) => {
        const { label, color } = getSeverityData(issue.severity || "minor");

        return (
          <IssueCard key={idx} $severity={issue.severity || "minor"}>
            <PriorityBadge $color={color}>
              <AlertIcon />
            </PriorityBadge>

            <Content>
              <IssueHeader>
                <SeverityBadge $color={color}>{label}</SeverityBadge>
                {issue.category && (
                  <CategoryBadge>{issue.category}</CategoryBadge>
                )}
              </IssueHeader>

              <IssueText>{issue.issue}</IssueText>

              {(issue.suggestion || issue.recommendation) && (
                <Suggestion>{issue.suggestion || issue.recommendation}</Suggestion>
              )}
            </Content>
          </IssueCard>
        );
      })}
    </Container>
  );
}

export default ATSIssuesList;
