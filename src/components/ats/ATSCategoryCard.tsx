"use client";

import styled from "styled-components";
import { useState, useEffect, useRef, useId } from "react";
import { motion, AnimatePresence } from "motion/react";

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

const CloseIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

// Hook for detecting clicks outside
function useOutsideClick(ref: React.RefObject<HTMLDivElement | null>, callback: () => void) {
  useEffect(() => {
    function handleClick(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        callback();
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [ref, callback]);
}

// Overlay for expanded state
const Overlay = styled(motion.div)`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 100;
  backdrop-filter: blur(4px);
`;

// Wrapper to maintain card position
const CardWrapper = styled.div`
  position: relative;
`;

// Collapsed card
const CollapsedCard = styled(motion.div)`
  background: var(--bg-alt);
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 12px;
  padding: 16px 20px;
  display: flex;
  align-items: center;
  gap: 16px;
  cursor: pointer;
  transition: box-shadow 0.2s, border-color 0.2s;

  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    border-color: var(--primary-500);
  }
`;

// Expanded card container (centered modal)
const ExpandedCardContainer = styled(motion.div)`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 110;
  width: 90%;
  max-width: 560px;
  max-height: 85vh;
  display: flex;
  flex-direction: column;
`;

// Expanded card
const ExpandedCard = styled(motion.div)`
  background: var(--bg-color, #ffffff);
  border-radius: 16px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.25);
`;

// Header section for expanded card
const ExpandedHeader = styled.div`
  padding: 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  border-bottom: 1px solid var(--border-color, #e5e7eb);
  position: relative;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 16px;
  right: 16px;
  width: 32px;
  height: 32px;
  border-radius: 8px;
  border: none;
  background: var(--bg-alt, #f9fafb);
  color: var(--text-secondary, #6b7280);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;

  &:hover {
    background: var(--border-color, #e5e7eb);
    color: var(--text-color, #1f2937);
  }
`;

// Score ring component
const ScoreRing = styled(motion.div)<{ $percentage: number; $color: string; $size?: "small" | "large" }>`
  width: ${({ $size }) => $size === "large" ? "80px" : "48px"};
  height: ${({ $size }) => $size === "large" ? "80px" : "48px"};
  border-radius: 50%;
  background: conic-gradient(
    ${({ $color }) => $color} ${({ $percentage }) => $percentage * 3.6}deg,
    var(--border-color, #e5e7eb) 0deg
  );
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  position: relative;

  &::before {
    content: "";
    width: ${({ $size }) => $size === "large" ? "64px" : "38px"};
    height: ${({ $size }) => $size === "large" ? "64px" : "38px"};
    border-radius: 50%;
    background: var(--bg-color, #ffffff);
  }
`;

const ScoreValue = styled(motion.span)<{ $color: string; $size?: "small" | "large" }>`
  position: absolute;
  font-size: ${({ $size }) => $size === "large" ? "20px" : "14px"};
  font-weight: 700;
  color: ${({ $color }) => $color};
`;

const ScoreRingWrapper = styled(motion.div)`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
`;

// Category info
const CategoryInfo = styled(motion.div)<{ $expanded?: boolean }>`
  display: flex;
  flex-direction: column;
  gap: ${({ $expanded }) => $expanded ? "8px" : "4px"};
  flex: 1;
  align-items: ${({ $expanded }) => $expanded ? "center" : "flex-start"};
`;

const CategoryName = styled(motion.span)<{ $expanded?: boolean }>`
  font-weight: 600;
  font-size: ${({ $expanded }) => $expanded ? "18px" : "15px"};
  color: var(--text-color, #1f2937);
`;

const CategoryMeta = styled(motion.div)`
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

// Scrollable content area
const ContentArea = styled(motion.div)`
  overflow-y: auto;
  flex: 1;
  max-height: calc(85vh - 200px);
`;

const ContentInner = styled.div`
  padding: 20px 24px 24px;
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

const IssueItem = styled(motion.li)`
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 12px;
  background: var(--bg-alt, #f9fafb);
  border-radius: 8px;
  border-left: 3px solid #dc2626;
`;

const PassItem = styled(motion.li)`
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

// Click hint
const ClickHint = styled.span`
  font-size: 12px;
  color: var(--text-secondary, #6b7280);
  opacity: 0;
  transition: opacity 0.2s;

  ${CollapsedCard}:hover & {
    opacity: 1;
  }
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
  const id = useId();
  const expandedRef = useRef<HTMLDivElement>(null);

  useOutsideClick(expandedRef, () => setIsExpanded(false));

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsExpanded(false);
    };
    if (isExpanded) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [isExpanded]);

  return (
    <CardWrapper>
      <AnimatePresence>
        {isExpanded && (
          <Overlay
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {!isExpanded ? (
          <CollapsedCard
            key={`collapsed-${id}`}
            layoutId={`card-${id}`}
            onClick={() => setIsExpanded(true)}
          >
            <ScoreRingWrapper layoutId={`score-wrapper-${id}`}>
              <ScoreRing
                layoutId={`score-ring-${id}`}
                $percentage={percentage}
                $color={color}
                $size="small"
              />
              <ScoreValue layoutId={`score-value-${id}`} $color={color} $size="small">
                {percentage}%
              </ScoreValue>
            </ScoreRingWrapper>

            <CategoryInfo layoutId={`info-${id}`}>
              <CategoryName layoutId={`name-${id}`}>{name}</CategoryName>
              <CategoryMeta layoutId={`meta-${id}`}>
                <ScoreText>{earnedPoints}/{maxPoints} pts</ScoreText>
                {issues.length > 0 && (
                  <IssueCount $hasIssues={true}>{issues.length} issues</IssueCount>
                )}
                {issues.length === 0 && passes.length > 0 && (
                  <IssueCount $hasIssues={false}>All passed</IssueCount>
                )}
              </CategoryMeta>
            </CategoryInfo>

            <ClickHint>Click to expand</ClickHint>
          </CollapsedCard>
        ) : (
          <ExpandedCardContainer
            key={`expanded-${id}`}
            ref={expandedRef}
          >
            <ExpandedCard layoutId={`card-${id}`}>
              <ExpandedHeader>
                <CloseButton onClick={() => setIsExpanded(false)}>
                  <CloseIcon />
                </CloseButton>

                <ScoreRingWrapper layoutId={`score-wrapper-${id}`}>
                  <ScoreRing
                    layoutId={`score-ring-${id}`}
                    $percentage={percentage}
                    $color={color}
                    $size="large"
                  />
                  <ScoreValue layoutId={`score-value-${id}`} $color={color} $size="large">
                    {percentage}%
                  </ScoreValue>
                </ScoreRingWrapper>

                <CategoryInfo layoutId={`info-${id}`} $expanded>
                  <CategoryName layoutId={`name-${id}`} $expanded>{name}</CategoryName>
                  <CategoryMeta layoutId={`meta-${id}`}>
                    <ScoreText>{earnedPoints}/{maxPoints} pts</ScoreText>
                    {issues.length > 0 && (
                      <IssueCount $hasIssues={true}>{issues.length} issues</IssueCount>
                    )}
                    {issues.length === 0 && passes.length > 0 && (
                      <IssueCount $hasIssues={false}>All passed</IssueCount>
                    )}
                  </CategoryMeta>
                </CategoryInfo>
              </ExpandedHeader>

              <ContentArea
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ delay: 0.1 }}
              >
                <ContentInner>
                  {issues.length > 0 && (
                    <Section>
                      <SectionHeader $type="issues">
                        <XIcon /> Issues to fix
                      </SectionHeader>
                      <List>
                        {issues.map((issue, idx) => (
                          <IssueItem
                            key={idx}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 + idx * 0.05 }}
                          >
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
                          <PassItem
                            key={idx}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.15 + idx * 0.05 }}
                          >
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
              </ContentArea>
            </ExpandedCard>
          </ExpandedCardContainer>
        )}
      </AnimatePresence>
    </CardWrapper>
  );
}

export default ATSCategoryCard;
