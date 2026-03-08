"use client";

import styled from "styled-components";
import { useState, useEffect, useRef, useId } from "react";
import { motion, AnimatePresence, LayoutGroup } from "motion/react";

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
  changes?: Array<{
    category: string;
    issue: string;
    fix: string;
    impact?: string;
  }>;
}

const getScoreColor = (percentage: number) => {
  if (percentage >= 85) return "var(--primary-500)"; // Apple Green
  if (percentage >= 70) return "#2A57A0"; // Apple Blue
  if (percentage >= 50) return "#EAB308"; // Apple Orange
  return "#F97316"; // Apple Red
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

const ArrowRightIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14M12 5l7 7-7 7" />
  </svg>
);

const CloseIcon = () => (
  <motion.svg
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0, transition: { duration: 0.05 } }}
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M18 6L6 18" />
    <path d="M6 6l12 12" />
  </motion.svg>
);

// Hook for detecting clicks outside
function useOutsideClick(ref: React.RefObject<HTMLDivElement | null>, callback: () => void) {
  useEffect(() => {
    function handleClick(event: MouseEvent | TouchEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        callback();
      }
    }
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("touchstart", handleClick);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("touchstart", handleClick);
    };
  }, [ref, callback]);
}

// Overlay
const Overlay = styled(motion.div)`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  z-index: 10;
`;

// Fixed container for expanded card
const ExpandedContainer = styled.div`
  position: fixed;
  inset: 0;
  display: grid;
  place-items: center;
  z-index: 100;
`;

// Collapsed card - Apple Liquid Glass style
const CollapsedCard = styled(motion.div)`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  border-radius: 20px;
  overflow: hidden;

  /* Liquid Glass card — stronger contrast (Matched to Job Posting Cards) */
  background: rgba(30, 30, 40, 0.78);
  backdrop-filter: blur(30px) saturate(160%);
  -webkit-backdrop-filter: blur(30px) saturate(160%);
  border: 1px solid rgba(255, 255, 255, 0.14);
  box-shadow:
    0 2px 1px rgba(255, 255, 255, 0.06) inset,
    0 8px 32px rgba(0, 0, 0, 0.55),
    0 2px 8px rgba(0, 0, 0, 0.4);

  cursor: pointer;
  min-height: 180px;
  padding: 24px;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);

  &:hover {
    transform: translateY(-5px);
    border-color: rgba(255, 255, 255, 0.22);
    box-shadow:
      0 2px 1px rgba(255, 255, 255, 0.08) inset,
      0 20px 56px rgba(0, 0, 0, 0.65),
      0 6px 20px rgba(0, 0, 0, 0.45);
  }
`;

// CTA for collapsed card hover
const CollapsedCTA = styled(motion.div)<{ $isMobile?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  z-index: 2;

  ${({ $isMobile }) => $isMobile ? `
    position: relative;
    padding: 16px 0 0 0;
  ` : `
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 20px 24px;
  `}
`;

const CTALink = styled.span<{ $color: string }>`
  display: flex;
  align-items: center;
  gap: 6px;
  color: ${({ $color }) => $color};
  font-weight: 500;
  font-size: 14px;
`;

// Overlay for collapsed card hover
const CollapsedOverlay = styled(motion.div)`
  pointer-events: none;
  position: absolute;
  inset: 0;
  z-index: 1;
`;

// Expanded card - Apple Liquid Glass
const ExpandedCard = styled(motion.div)`
  position: relative;
  width: 100%;
  max-width: 500px;
  max-height: 90%;
  display: flex;
  flex-direction: column;
  border-radius: 20px;
  overflow: hidden;

  /* Liquid Glass card — stronger contrast (Matched to Job Posting Cards) */
  background: rgba(30, 30, 40, 0.78);
  backdrop-filter: blur(30px) saturate(160%);
  -webkit-backdrop-filter: blur(30px) saturate(160%);
  border: 1px solid rgba(255, 255, 255, 0.14);
  box-shadow:
    0 2px 1px rgba(255, 255, 255, 0.06) inset,
    0 8px 32px rgba(0, 0, 0, 0.55),
    0 2px 8px rgba(0, 0, 0, 0.4);

  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);

  @media (max-width: 640px) {
    height: 100%;
    max-height: 100%;
    border-radius: 0;
    border: none;
  }
`;

// Header section for expanded card
const ExpandedHeader = styled.div`
  padding: 32px 24px 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  box-shadow: 0 4px 6px 1px rgba(0, 0, 0, 0.1);
`;

const CloseButton = styled(motion.button)`
  position: absolute;
  top: 16px;
  right: 16px;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(255, 255, 255, 0.05);
  color: rgba(255, 255, 255, 0.8);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
  transition: all 0.2s ease;
  backdrop-filter: blur(10px);

  &:hover {
    background: rgba(255, 255, 255, 0.1);
    color: white;
    transform: scale(1.05);
  }
`;

// Score value - Apple style
const ScoreValue = styled(motion.span)<{ $color: string; $size?: "small" | "large" }>`
  font-size: ${({ $size }) => $size === "large" ? "48px" : "42px"};
  font-weight: 700;
  color: ${({ $color }) => $color};
  line-height: 1;
  letter-spacing: -1px;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;

  &::after {
    content: '%';
    font-size: ${({ $size }) => $size === "large" ? "24px" : "20px"};
    margin-left: 2px;
    font-weight: 500;
    color: rgba(255, 255, 255, 0.6);
  }
`;

// Category name
const CategoryName = styled(motion.h3)`
  font-weight: 600;
  font-size: 20px;
  color: rgba(255, 255, 255, 0.95);
  margin: 0;
  letter-spacing: -0.3px;
`;

// Category meta
const CategoryMeta = styled(motion.p)`
  font-size: 14px;
  color: rgba(255, 255, 255, 0.6);
  margin: 0;
  display: flex;
  align-items: center;
  gap: 8px;
  
`;

const IssueCount = styled.span<{ $hasIssues: boolean; $color: string }>`
  font-size: 13px;
  font-weight: 500;
  color: ${({ $color }) => $color};
`;

// Scrollable content area
const ContentArea = styled(motion.div)`
  position: relative;
  padding: 16px 24px 24px;
  overflow-y: auto;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 20px;
  -webkit-overflow-scrolling: touch;

  /* Thin scrollbar */
  scrollbar-width: thin;
  scrollbar-color: var(--border-color, #e5e7eb) transparent;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: var(--border-color, #e5e7eb);
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: var(--text-secondary, #6b7280);
  }
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
  color: ${({ $type }) => $type === "issues" ? "#F97316" : "var(--primary-500)"};
  display: flex;
  align-items: center;
  gap: 6px;
  padding-bottom: 8px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
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
  padding: 10px 12px;
  width: 95%;
  margin: 0 auto;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};

  &:last-child {
    border-bottom: none;
  }
`;

const PassItem = styled.li`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 12px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  width: 95%;
  margin: 0 auto;

  &:last-child {
    border-bottom: none;
  }
`;

const ItemIcon = styled.span<{ $type: "issue" | "pass" }>`
  flex-shrink: 0;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: var(--checkbox);
  color: ${({ $type }) => $type === "issue" ? "#F97316" : "var(--primary-500)"};
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ItemContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0;
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
  padding-top: 4px;
  background: var(--bg-color, #ffffff);
  border-radius: 6px;
`;

const SeverityDot = styled.span<{ $type: "issues" | "passes" }>`
  width: 8px;
  height: 8px;
  background: ${({ $type }) => $type === "issues" ? "#F97316" : "var(--primary-500)"};
  border-radius: 50%;
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
  expanded = false,
  changes = []
}: ATSCategoryCardProps) {
  const [isExpanded, setIsExpanded] = useState(expanded);
  const [isHovered, setIsHovered] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const percentage = Math.round((earnedPoints / maxPoints) * 100);
  const color = getScoreColor(percentage);
  const id = useId();
  const expandedRef = useRef<HTMLDivElement>(null);

  // Check for mobile viewport
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 1024);
    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  useOutsideClick(expandedRef, () => setIsExpanded(false));

  // Handle escape key and body scroll
  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsExpanded(false);
      }
    }

    if (isExpanded) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isExpanded]);

  return (
    <LayoutGroup id={`ats-card-${id}`}>
      {/* Overlay */}
      <AnimatePresence>
        {isExpanded && (
          <Overlay
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
        )}
      </AnimatePresence>

      {/* Expanded Card */}
      <AnimatePresence>
        {isExpanded && (
          <ExpandedContainer>
            <ExpandedCard
              layoutId={`card-${name}-${id}`}
              ref={expandedRef}
              transition={{ type: "tween", duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
            >
              <CloseButton
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                onClick={() => setIsExpanded(false)}
              >
                <CloseIcon />
              </CloseButton>

              <ExpandedHeader>
                <motion.div
                  layoutId={`score-${name}-${id}`}
                  layout="position"
                  transition={{ type: "tween", duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
                >
                  <ScoreValue $color={color} $size="large">
                    {percentage}
                  </ScoreValue>
                </motion.div>

                <CategoryName
                  layoutId={`title-${name}-${id}`}
                  layout="position"
                  transition={{ type: "tween", duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
                >
                  {name}
                </CategoryName>

                <CategoryMeta
                  layoutId={`meta-${name}-${id}`}
                  layout="position"
                  transition={{ type: "tween", duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
                >
                  {earnedPoints}/{maxPoints} pts
                  {issues.length > 0 && (
                    <IssueCount $hasIssues={true} $color="#FF3B30">{issues.length} issues</IssueCount>
                  )}
                  {issues.length === 0 && passes.length > 0 && (
                    <IssueCount $hasIssues={false} $color="var(--primary-500)">All passed</IssueCount>
                  )}
                </CategoryMeta>
              </ExpandedHeader>

              <ContentArea
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                {changes.length > 0 ? (
                  <>
                  {/* Show specific changes relevant to this category if we have them */}
                   <Section>
                    <SectionHeader $type="issues">
                     Optimizations Made
                    </SectionHeader>
                    <List>
                      {changes.filter(c => c.category.toLowerCase() === name.toLowerCase()).map((change, idx) => (
                         <IssueItem key={idx} style={{ flexDirection: 'column', gap: 6 }}>
                             {/* Before - Issue */}
                             <div style={{ display: 'flex', alignItems: 'center', gap: 8, width: '100%' }}>
                                <div style={{ fontSize: 11, fontWeight: 600, color: '#dc2626', textTransform: 'uppercase', width: 40 }}>Issue</div>
                                <div style={{ fontSize: 13, color: 'var(--text-color)', flex: 1 }}>{change.issue}</div>
                             </div>

                             {/* Arrow down */}
                             <div style={{ display: 'flex', alignItems: 'center', gap: 8, width: '100%', paddingLeft: 48, opacity: 0.5 }}>
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14M5 12l7 7 7-7"/></svg>
                             </div>

                             {/* After - Fixed */}
                             <div style={{ display: 'flex', alignItems: 'center', gap: 8, width: '100%' }}>
                                <div style={{ fontSize: 11, fontWeight: 600, color: '#059669', textTransform: 'uppercase', width: 40 }}>Fixed</div>
                                <div style={{ fontSize: 13, color: 'var(--text-color)', fontWeight: 500, flex: 1 }}>{change.fix}</div>
                             </div>
                         </IssueItem>
                      ))}
                    </List>
                  </Section>

                  {/* Show Issues that were NOT fixed (if any) */}
                  {issues.length > 0 && (
                      <Section>
                        <SectionHeader $type="issues">
                         Remaining Issues
                        </SectionHeader>
                        <List>
                          {issues.map((issue, idx) => (
                            <IssueItem key={idx}>
                              <ItemIcon $type="issue">
                               <SeverityDot $type="issues" />
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

                  {/* Always show Passed Checks */}
                  {passes.length > 0 && (
                    <Section>
                      <SectionHeader $type="passes">
                       Passed checks
                      </SectionHeader>
                      <List>
                        {passes.map((pass, idx) => (
                          <PassItem key={idx}>
                            <ItemIcon $type="pass">
                              <SeverityDot $type="passes" />
                            </ItemIcon>
                            <ItemText>{pass}</ItemText>
                          </PassItem>
                        ))}
                      </List>
                    </Section>
                  )}
                  </>
                ) : (
                  <>
                  {issues.length > 0 && (
                    <Section>
                      <SectionHeader $type="issues">
                      Issues to fix
                      </SectionHeader>
                      <List>
                        {issues.map((issue, idx) => (
                          <IssueItem key={idx}>
                            <ItemIcon $type="issue">
                            <SeverityDot $type="issues" />
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
                      Passed checks
                      </SectionHeader>
                      <List>
                        {passes.map((pass, idx) => (
                          <PassItem key={idx}>
                            <ItemIcon $type="pass">
                              <SeverityDot $type="passes" />
                            </ItemIcon>
                            <ItemText>{pass}</ItemText>
                          </PassItem>
                        ))}
                      </List>
                    </Section>
                  )}
                  </>
                )}

                {issues.length === 0 && passes.length === 0 && (
                  <EmptyState>No details available</EmptyState>
                )}
              </ContentArea>
            </ExpandedCard>
          </ExpandedContainer>
        )}
      </AnimatePresence>

      {/* Collapsed Card - Always rendered */}
      <CollapsedCard
        layoutId={`card-${name}-${id}`}
        onClick={() => {
          setIsHovered(false);
          setIsExpanded(true);
        }}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        animate={{
          y: isHovered ? -2 : 0,
          boxShadow: isHovered
            ? `0 12px 32px rgba(0, 0, 0, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.08)`
            : `0 4px 24px rgba(0, 0, 0, 0.05), inset 0 1px 0 rgba(255, 255, 255, 0.05)`
        }}
        transition={{
          type: "tween",
          duration: 0.3,
          ease: "easeOut",
        }}
      >
        <CollapsedOverlay
          animate={{
            backgroundColor: isHovered
              ? "rgba(255, 255, 255, 0.02)"
              : "rgba(0, 0, 0, 0)"
          }}
          transition={{ duration: 0.3 }}
        />

        <motion.div
          layoutId={`score-${name}-${id}`}
          layout="position"
          style={{ zIndex: 2 }}
          transition={{ type: "tween", duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
        >
          <ScoreValue $color={color} $size="small">
            {percentage}
          </ScoreValue>
        </motion.div>

        <div style={{ marginTop: '12px', zIndex: 2, position: 'relative' }}>
          <CategoryName
            layoutId={`title-${name}-${id}`}
            layout="position"
            transition={{ type: "tween", duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
          >
            {name}
          </CategoryName>
          <CategoryMeta
            layoutId={`meta-${name}-${id}`}
            layout="position"
            transition={{ type: "tween", duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
          >
            {earnedPoints}/{maxPoints} pts
            {issues.length > 0 && (
              <IssueCount $hasIssues={true} $color="#F97316">{issues.length} issues</IssueCount>
            )}
            {issues.length === 0 && passes.length > 0 && (
              <IssueCount $hasIssues={false} $color="var(--primary-500)">All passed</IssueCount>
            )}
          </CategoryMeta>
        </div>

        <CollapsedCTA
          $isMobile={isMobile}
          animate={{
            y: isMobile ? 0 : (isHovered ? 0 : "100%"),
            opacity: isMobile ? 1 : (isHovered ? 1 : 0)
          }}
          transition={{ type: "tween", duration: 0.3 }}
        >
          <CTALink $color={color}>
            View Details
            <ArrowRightIcon />
          </CTALink>
        </CollapsedCTA>
      </CollapsedCard>
    </LayoutGroup>
  );
}

export default ATSCategoryCard;
