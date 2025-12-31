"use client";

import styled from "styled-components";

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

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const CheckItem = styled.div<{ $ok: boolean }>`
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 14px 16px;
  background: var(--bg-color, #ffffff);
  border: 1px solid var(--border-color, #e5e7eb);
  border-left: 3px solid ${({ $ok }) => $ok ? "#059669" : "#dc2626"};
  border-radius: 8px;
`;

const IconWrapper = styled.div<{ $ok: boolean }>`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: ${({ $ok }) => $ok ? "#f0fdf4" : "#fef2f2"};
  color: ${({ $ok }) => $ok ? "#059669" : "#dc2626"};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  margin-top: 1px;
`;

const Content = styled.div`
  flex: 1;
`;

const Label = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: var(--text-color, #1f2937);
  margin-bottom: 4px;
`;

const Note = styled.div`
  font-size: 13px;
  color: var(--text-secondary, #6b7280);
  line-height: 1.4;
`;

const checkLabels: Record<string, string> = {
  singleColumn: "Single Column Layout",
  standardSections: "Standard Section Headers",
  cleanCharacters: "Clean Character Encoding",
  abbreviations: "Abbreviations Expanded",
};

export function ATSParsingChecklist({ checks }: ATSParsingChecklistProps) {
  const checkKeys = ["singleColumn", "standardSections", "cleanCharacters", "abbreviations"] as const;

  return (
    <Container>
      {checkKeys.map((key) => {
        const check = checks[key];
        return (
          <CheckItem key={key} $ok={check.ok}>
            <IconWrapper $ok={check.ok}>
              {check.ok ? <CheckIcon /> : <XIcon />}
            </IconWrapper>
            <Content>
              <Label>{checkLabels[key]}</Label>
              <Note>{check.note}</Note>
            </Content>
          </CheckItem>
        );
      })}
    </Container>
  );
}

export default ATSParsingChecklist;
