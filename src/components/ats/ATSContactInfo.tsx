"use client";

import styled from "styled-components";

interface ATSContactInfoProps {
  hasContactInfo: {
    email: boolean;
    phone: boolean;
    linkedin: boolean;
    location: boolean;
  };
}

const CheckIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const XIcon = () => (
  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const Container = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
`;

const Item = styled.div<{ $present: boolean }>`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 14px;
  border-radius: 8px;
  background: var(--bg-alt, #f9fafb);
  border: 1px solid ${({ $present }) => $present ? "#d1fae5" : "#fecaca"};
  transition: all 0.2s;
`;

const Checkbox = styled.div<{ $checked: boolean }>`
  width: 20px;
  height: 20px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  background: ${({ $checked }) => $checked ? "#059669" : "#fef2f2"};
  color: ${({ $checked }) => $checked ? "white" : "#dc2626"};
  border: 2px solid ${({ $checked }) => $checked ? "#059669" : "#fecaca"};
`;

const Label = styled.span<{ $present: boolean }>`
  font-size: 13px;
  font-weight: 500;
  color: ${({ $present }) => $present ? "var(--text-color, #1f2937)" : "var(--text-secondary, #6b7280)"};
`;

const contactItems = [
  { key: "email", label: "Email" },
  { key: "phone", label: "Phone" },
  { key: "linkedin", label: "LinkedIn" },
  { key: "location", label: "Location" },
] as const;

export function ATSContactInfo({ hasContactInfo }: ATSContactInfoProps) {
  return (
    <Container>
      {contactItems.map(({ key, label }) => {
        const present = hasContactInfo[key];
        return (
          <Item key={key} $present={present}>
            <Checkbox $checked={present}>
              {present ? <CheckIcon /> : <XIcon />}
            </Checkbox>
            <Label $present={present}>{label}</Label>
          </Item>
        );
      })}
    </Container>
  );
}

export default ATSContactInfo;
