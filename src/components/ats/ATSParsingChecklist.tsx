"use client";

import styled, { keyframes } from "styled-components";

interface ParsingCheck {
  ok: boolean;
  note: string;
}

interface ATSParsingChecklistProps {
  checks: {
    singleColumn: ParsingCheck;
    standardSections: ParsingCheck;
    cleanCharacters: ParsingCheck;
    abbreviations: ParsingCheck;
  };
}

// ─── Icons ─────────────────────────────────────────────────────────────────

const CheckIcon = () => (
  <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
    <path
      d="M1.5 5.5L4 8L9.5 2.5"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const WarnIcon = () => (
  <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
    <path d="M5.5 2V6.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    <circle cx="5.5" cy="9" r="0.8" fill="currentColor" />
  </svg>
);

// ─── Animation ─────────────────────────────────────────────────────────────

const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: translateY(0);   }
`;

// ─── Styles ────────────────────────────────────────────────────────────────

// Premium Apple Tahoe / VisionOS liquid glass grid
const GridContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
  
  @media (min-width: 640px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const WidgetCard = styled.div`
  border-radius: 24px;
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(40px) saturate(150%);
  -webkit-backdrop-filter: blur(40px) saturate(150%);
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.15),
    0 12px 40px rgba(0, 0, 0, 0.12);
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  animation: ${fadeUp} 0.5s cubic-bezier(0.16, 1, 0.3, 1) both;
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);

  &:hover {
    transform: translateY(-4px) scale(1.02);
    box-shadow:
      inset 0 1px 0 rgba(255, 255, 255, 0.2),
      0 20px 50px rgba(0, 0, 0, 0.18);
    border-color: rgba(255, 255, 255, 0.12);
    background: rgba(255, 255, 255, 0.04);
  }
`;

const WidgetHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
`;

// App Store style vibrant squircle icons but with our Native Palette
const IconWrap = styled.div<{ $ok: boolean }>`
  width: 44px;
  height: 44px;
  border-radius: 12px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  
  /* Using site's theme colors with translucent glass backgrounds */
  background: ${({ $ok }) =>
    $ok 
      ? "rgba(53, 162, 159, 0.12)" /* A subtle teal/green from previous design */
      : "rgba(255, 255, 255, 0.06)"};
  color: ${({ $ok }) =>
    $ok ? "var(--primary-500, #35A29F)" : "rgba(255, 255, 255, 0.4)"};
  
  box-shadow: ${({ $ok }) =>
    $ok 
      ? "inset 0 1px 0 rgba(255, 255, 255, 0.1), 0 4px 12px rgba(53, 162, 159, 0.15)" 
      : "inset 0 1px 0 rgba(255, 255, 255, 0.05)"};
  
  /* Subtle inner glow for depth */
  border: 1px solid ${({ $ok }) =>
    $ok 
      ? "rgba(53, 162, 159, 0.2)" 
      : "rgba(255, 255, 255, 0.1)"};
  
  svg {
    width: 20px;
    height: 20px;
    stroke-width: 2.2;
  }
`;

const TextContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const Label = styled.div`
  font-size: 18px;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.95);
  letter-spacing: -0.3px;
  line-height: 1.2;
`;

const Note = styled.div`
  font-size: 14.5px;
  font-weight: 400;
  color: rgba(255, 255, 255, 0.5);
  line-height: 1.5;
`;

// Distinctive polished status indicators as Pill Badges
const StatusBadge = styled.div<{ $ok: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 6px 14px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 700;
  letter-spacing: -0.1px;
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);

  ${({ $ok }) => $ok ? `
    background: rgba(53, 162, 159, 0.1);
    color: var(--primary-500, #35A29F);
    border: 1px solid rgba(53, 162, 159, 0.2);
    box-shadow: inset 0 1px 0 rgba(53, 162, 159, 0.15);
  ` : `
    background: rgba(255, 149, 0, 0.1);
    color: #FF9500;
    border: 1px solid rgba(255, 149, 0, 0.2);
    box-shadow: inset 0 1px 0 rgba(255, 149, 0, 0.15);
  `}
`;

// ─── Data ──────────────────────────────────────────────────────────────────

const checkLabels: Record<string, string> = {
  singleColumn:      "Single Column Layout",
  standardSections:  "Standard Section Headers",
  cleanCharacters:   "Clean Character Encoding",
  abbreviations:     "Quantified Achievements",
};

// ─── Component ─────────────────────────────────────────────────────────────

export function ATSParsingChecklist({ checks }: ATSParsingChecklistProps) {
  const checkKeys = [
    "singleColumn",
    "standardSections",
    "cleanCharacters",
    "abbreviations",
  ] as const;

  return (
    <GridContainer>
      {checkKeys.map((key, index) => {
        const check = checks[key];
        return (
          <WidgetCard key={key} style={{ animationDelay: `${index * 0.1}s` }}>
            <WidgetHeader>
              <IconWrap $ok={check.ok}>
                {check.ok ? <CheckIcon /> : <WarnIcon />}
              </IconWrap>
              <StatusBadge $ok={check.ok}>
                {check.ok ? "Passed" : "Fix"}
              </StatusBadge>
            </WidgetHeader>
            <TextContent>
              <Label>{checkLabels[key]}</Label>
              <Note>{check.note}</Note>
            </TextContent>
          </WidgetCard>
        );
      })}
    </GridContainer>
  );
}

export default ATSParsingChecklist;
