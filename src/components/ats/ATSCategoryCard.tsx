"use client";

import styled, { keyframes } from "styled-components";
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
  changes?: Array<{
    category: string;
    issue: string;
    fix: string;
    impact?: string;
  }>;
}

// ─── Background animation ───────────────────────────────────────────────────

const scrollUp = keyframes`
  from { transform: translateY(0); }
  to   { transform: translateY(-50%); }
`;

const CardBackground = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  width: 50%;
  overflow: hidden;
  pointer-events: none;
  z-index: 0;

  /* Fade left edge into card + fade bottom out */
  -webkit-mask-image:
    linear-gradient(to right, transparent 0%, black 32%),
    linear-gradient(to bottom, black 15%, black 55%, transparent 92%);
  -webkit-mask-composite: source-in;
  mask-image:
    linear-gradient(to right, transparent 0%, black 32%),
    linear-gradient(to bottom, black 15%, black 55%, transparent 92%);
  mask-composite: intersect;
`;

const ScrollTrack = styled.div<{ $duration: number; $paused: boolean }>`
  display: flex;
  flex-direction: column;
  animation: ${scrollUp} ${({ $duration }) => $duration}s linear infinite;
  animation-play-state: ${({ $paused }) => ($paused ? "paused" : "running")};
`;

const BgRow = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 7px;
  padding: 6px 8px 6px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.025);
`;

const BgDot = styled.div<{ $isIssue: boolean }>`
  width: 4px;
  height: 4px;
  border-radius: 50%;
  flex-shrink: 0;
  margin-top: 5px;
  background: ${({ $isIssue }) =>
    $isIssue ? "rgba(249, 115, 22, 0.5)" : "rgba(48, 209, 88, 0.4)"};
`;

const BgText = styled.span`
  font-size: 11px;
  line-height: 1.4;
  color: rgba(255, 255, 255, 0.14);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 180px;
`;

// ─────────────────────────────────────────────────────────────────────────────

const getScoreColor = (percentage: number) => {
  if (percentage >= 85) return "var(--primary-500)"; // Apple Green
  if (percentage >= 70) return "#2A57A0"; // Apple Blue
  if (percentage >= 50) return "#EAB308"; // Apple Orange
  return "#F97316"; // Apple Red
};


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
  background: rgba(0, 0, 0, 0.55);
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

  /* Apple Liquid Glass core — matching sidebar */
  background: rgba(22, 22, 26, 0.78);
  backdrop-filter: blur(60px) saturate(200%);
  -webkit-backdrop-filter: blur(60px) saturate(200%);
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow:
    0 8px 40px rgba(0, 0, 0, 0.45),
    0 2px 8px rgba(0, 0, 0, 0.3);

  cursor: pointer;
  min-height: 180px;
  padding: 24px;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);

  /* Specular light refraction — top highlight */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(
      90deg,
      transparent 0%,
      rgba(255, 255, 255, 0.25) 40%,
      rgba(255, 255, 255, 0.45) 60%,
      rgba(255, 255, 255, 0.25) 80%,
      transparent 100%
    );
    pointer-events: none;
    z-index: 1;
  }

  /* Right-edge refraction */
  &::after {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    width: 1px;
    background: linear-gradient(
      180deg,
      rgba(255, 255, 255, 0.15) 0%,
      rgba(255, 255, 255, 0.05) 40%,
      rgba(255, 255, 255, 0.0) 100%
    );
    pointer-events: none;
    z-index: 1;
  }

  &:hover {
    transform: translateY(-5px);
    border-color: rgba(255, 255, 255, 0.14);
    box-shadow:
      0 20px 56px rgba(0, 0, 0, 0.55),
      0 6px 20px rgba(0, 0, 0, 0.35);
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
  color: var(--accent);
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

  /* Apple Liquid Glass core — matching sidebar */
  background: rgba(22, 22, 26, 0.78);
  backdrop-filter: blur(60px) saturate(200%);
  -webkit-backdrop-filter: blur(60px) saturate(200%);
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow:
    0 8px 40px rgba(0, 0, 0, 0.45),
    0 2px 8px rgba(0, 0, 0, 0.3);

  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);

  /* Specular light refraction — top highlight */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(
      90deg,
      transparent 0%,
      rgba(255, 255, 255, 0.25) 40%,
      rgba(255, 255, 255, 0.45) 60%,
      rgba(255, 255, 255, 0.25) 80%,
      transparent 100%
    );
    pointer-events: none;
    z-index: 1;
  }

  /* Right-edge refraction */
  &::after {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    width: 1px;
    background: linear-gradient(
      180deg,
      rgba(255, 255, 255, 0.15) 0%,
      rgba(255, 255, 255, 0.05) 40%,
      rgba(255, 255, 255, 0.0) 100%
    );
    pointer-events: none;
    z-index: 1;
  }

  @media (max-width: 640px) {
    height: 100%;
    max-height: 100%;
    border-radius: 0;
    border: none;
  }
`;

// Header section for expanded card
const ExpandedHeader = styled.div`
  padding: 28px 24px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.07);
`;

const CloseButton = styled(motion.button)`
  position: absolute;
  top: 14px;
  right: 14px;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  border: none;
  background: rgba(255, 255, 255, 0.08);
  color: rgba(255, 255, 255, 0.55);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
  transition: background 0.15s ease, color 0.15s ease;

  svg {
    width: 14px;
    height: 14px;
  }

  &:hover {
    background: rgba(255, 255, 255, 0.14);
    color: rgba(255, 255, 255, 0.9);
  }
`;

// Score value
const ScoreValue = styled(motion.span)<{ $color: string; $size?: "small" | "large" }>`
  font-size: ${({ $size }) => $size === "large" ? "52px" : "52px"};
  font-weight: 700;
  color: ${({ $color }) => $color};
  line-height: 1;
  letter-spacing: -1.5px;

  &::after {
    content: '%';
    font-size: ${({ $size }) => $size === "large" ? "22px" : "18px"};
    margin-left: 1px;
    font-weight: 500;
    letter-spacing: 0;
    color: rgba(255, 255, 255, 0.4);
  }
`;

// Category name
const CategoryName = styled(motion.h3)`
  font-weight: 600;
  font-size: 17px;
  color: rgba(255, 255, 255, 0.9);
  margin: 0;
  letter-spacing: -0.3px;
`;

// Category meta
const CategoryMeta = styled(motion.p)`
  font-size: 13px;
  color: rgba(255, 255, 255, 0.38);
  margin: 0;
  display: flex;
  align-items: center;
  gap: 6px;
`;

const IssueCount = styled.span<{ $hasIssues: boolean; $color: string }>`
  font-size: 12px;
  font-weight: 500;
  color: ${({ $color }) => $color};
`;

// Scrollable content area
const ContentArea = styled(motion.div)`
  position: relative;
  padding: 16px 20px 24px;
  overflow-y: auto;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 16px;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: thin;
  scrollbar-color: rgba(255, 255, 255, 0.1) transparent;

  &::-webkit-scrollbar {
    width: 4px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 2px;
  }
`;

const Section = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const SectionHeader = styled.div<{ $type: "issues" | "passes" }>`
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 2px;
  color: ${({ $type }) => $type === "issues"
    ? "#F97316"
    : "var(--primary-500)"};
  padding-bottom: 10px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
`;

const List = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
`;

const IssueItem = styled.li`
  display: flex;
  flex-direction: column;
  padding: 11px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);

  &:last-child {
    border-bottom: none;
  }
`;

const PassItem = styled.li`
  padding: 11px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);

  &:last-child {
    border-bottom: none;
  }
`;

const ItemContent = styled.div`
  display: flex;
  flex-direction: column;
`;

const ItemText = styled.span`
  font-size: 14px;
  line-height: 1.45;
`;

const IssueText = styled(ItemText)`
  color: rgba(255, 255, 255, 0.65);
`;

const PassText = styled(ItemText)`
  color: rgba(255, 255, 255, 0.85);
`;

const ItemSuggestion = styled.span`
  font-size: 12px;
  color: rgba(255, 255, 255, 0.32);
  line-height: 1.45;
  margin-top: 5px;
  padding-left: 10px;
  border-left: 1.5px solid rgba(255, 255, 255, 0.08);
  display: block;
`;

// Optimization change rows
const ChangeItem = styled.li`
  display: flex;
  flex-direction: column;
  gap: 0;
  padding: 12px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);

  &:last-child {
    border-bottom: none;
  }
`;

const ChangeRow = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 10px;
`;

const ChangeBadge = styled.span<{ $role: "issue" | "fix" }>`
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  color: ${({ $role }) => $role === "issue"
    ? "rgba(255, 69, 58, 0.65)"
    : "rgba(48, 209, 88, 0.75)"};
  min-width: 34px;
  flex-shrink: 0;
  padding-top: 2px;
`;

const ChangeText = styled.span<{ $role: "issue" | "fix" }>`
  font-size: 13px;
  color: ${({ $role }) => $role === "issue"
    ? "rgba(255, 255, 255, 0.5)"
    : "rgba(255, 255, 255, 0.82)"};
  line-height: 1.45;
  flex: 1;
`;

const ChangeArrow = styled.div`
  padding: 3px 0 3px 44px;
  color: rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
`;

const EmptyState = styled.div`
  padding: 32px 0;
  text-align: center;
  color: rgba(255, 255, 255, 0.3);
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
    <>
      {/* Overlay — blur grows first, then modal fades in */}
      <AnimatePresence>
        {isExpanded && (
          <Overlay
            initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
            animate={{ opacity: 1, backdropFilter: "blur(18px)" }}
            exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
            transition={{ duration: 0.45, ease: [0.25, 0, 0, 1] }}
          />
        )}
      </AnimatePresence>

      {/* Expanded Card */}
      <AnimatePresence>
        {isExpanded && (
          <ExpandedContainer>
            <ExpandedCard
              ref={expandedRef}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.3, delay: 0.12, ease: [0.25, 0, 0, 1] }}
            >
              <CloseButton
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, transition: { delay: 0.3, duration: 0.2 } }}
                exit={{ opacity: 0 }}
                onClick={() => setIsExpanded(false)}
              >
                <CloseIcon />
              </CloseButton>

              <ExpandedHeader>
                <div>
                  <ScoreValue $color={color} $size="large">
                    {percentage}
                  </ScoreValue>
                </div>

                <CategoryName>
                  {name}
                </CategoryName>

                <CategoryMeta>
                  {earnedPoints}/{maxPoints} pts
                  {issues.length > 0 && (
                    <IssueCount $hasIssues={true} $color="#F97316">{issues.length} issues</IssueCount>
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
                    <Section>
                      <SectionHeader $type="issues">Optimizations Made</SectionHeader>
                      <List>
                        {changes.filter(c => c.category.toLowerCase() === name.toLowerCase()).map((change, idx) => (
                          <ChangeItem key={idx}>
                            <ChangeRow>
                              <ChangeBadge $role="issue">Before</ChangeBadge>
                              <ChangeText $role="issue">{change.issue}</ChangeText>
                            </ChangeRow>
                            <ChangeArrow>
                              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                <path d="M12 5v14M5 12l7 7 7-7"/>
                              </svg>
                            </ChangeArrow>
                            <ChangeRow>
                              <ChangeBadge $role="fix">After</ChangeBadge>
                              <ChangeText $role="fix">{change.fix}</ChangeText>
                            </ChangeRow>
                          </ChangeItem>
                        ))}
                      </List>
                    </Section>

                    {issues.length > 0 && (
                      <Section>
                        <SectionHeader $type="issues">Remaining Issues</SectionHeader>
                        <List>
                          {issues.map((issue, idx) => (
                            <IssueItem key={idx}>
                              <ItemContent>
                                <IssueText>{issue.issue}</IssueText>
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
                        <SectionHeader $type="passes">Passed Checks</SectionHeader>
                        <List>
                          {passes.map((pass, idx) => (
                            <PassItem key={idx}>
                              <PassText>{pass}</PassText>
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
                        <SectionHeader $type="issues">Issues to Fix</SectionHeader>
                        <List>
                          {issues.map((issue, idx) => (
                            <IssueItem key={idx}>
                              <ItemContent>
                                <IssueText>{issue.issue}</IssueText>
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
                        <SectionHeader $type="passes">Passed Checks</SectionHeader>
                        <List>
                          {passes.map((pass, idx) => (
                            <PassItem key={idx}>
                              <PassText>{pass}</PassText>
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
        onClick={() => {
          if (!isExpanded) {
            setIsHovered(false);
            setIsExpanded(true);
          }
        }}
        onHoverStart={() => !isExpanded && setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        animate={{
          opacity: isExpanded ? 0 : 1,
          y: isHovered && !isExpanded ? -4 : 0,
        }}
        style={{ pointerEvents: isExpanded ? 'none' : 'auto' }}
        transition={{ type: "spring", stiffness: 400, damping: 35 }}
      >
        {/* Background marquee — right 50%, reflects card content */}
        {(issues.length > 0 || passes.length > 0) && (() => {
          const allItems = [
            ...issues.map(i => ({ text: i.issue, isIssue: true })),
            ...passes.map(p => ({ text: p, isIssue: false })),
          ];
          const duration = Math.max(8, allItems.length * 2.2);
          return (
            <CardBackground>
              <ScrollTrack $duration={duration} $paused={isHovered}>
                {/* First pass */}
                {allItems.map((item, i) => (
                  <BgRow key={`a-${i}`}>
                    <BgDot $isIssue={item.isIssue} />
                    <BgText>{item.text}</BgText>
                  </BgRow>
                ))}
                {/* Duplicate for seamless loop */}
                {allItems.map((item, i) => (
                  <BgRow key={`b-${i}`}>
                    <BgDot $isIssue={item.isIssue} />
                    <BgText>{item.text}</BgText>
                  </BgRow>
                ))}
              </ScrollTrack>
            </CardBackground>
          );
        })()}

        <CollapsedOverlay
          animate={{
            backgroundColor: isHovered
              ? "rgba(255, 255, 255, 0.025)"
              : "rgba(0, 0, 0, 0)"
          }}
          transition={{ duration: 0.2 }}
        />

        <div style={{ zIndex: 2 }}>
          <ScoreValue $color={color} $size="small">
            {percentage}
          </ScoreValue>
        </div>

        <div style={{ marginTop: '12px', zIndex: 2, position: 'relative' }}>
          <CategoryName>
            {name}
          </CategoryName>
          <CategoryMeta>
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
          transition={{ type: "spring", stiffness: 400, damping: 35 }}
        >
          <CTALink $color={color}>
            View Details
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </CTALink>
        </CollapsedCTA>
      </CollapsedCard>
    </>
  );
}

export default ATSCategoryCard;
