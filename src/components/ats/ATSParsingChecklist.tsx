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
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 8px;
`;

const IconWrapper = styled.div<{ $ok: boolean }>`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: var(--checkbox);
  color: ${({ $ok }) => $ok ? "var(--primary-500)" : "#F97316"};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  margin-top: 1px;
`;

const Content = styled.div`
  flex: 1;
`;


const SeverityDot = styled.span<{ $type: "issues" | "passes" }>`
  width: 8px;
  height: 8px;
  background: ${({ $type }) => $type === "issues" ? "#F97316" : "var(--primary-500)"};
  border-radius: 50%;
  flex-shrink: 0;
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
  abbreviations: "Quantified Achievements",
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
              <SeverityDot $type={check.ok ? "passes" : "issues"} />
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
