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

// Contact type icons
const PhoneIcon = ({ color }: { color: string }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill={color}>
    <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
  </svg>
);

const EmailIcon = ({ color }: { color: string }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill={color}>
    <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
  </svg>
);

const LinkedInIcon = ({ color }: { color: string }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill={color}>
    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/>
  </svg>
);

const LocationIcon = ({ color }: { color: string }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill={color}>
    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
  </svg>
);

// Icon colors when active
const ICON_COLORS = {
  phone: "#34C759",    // iPhone green
  email: "#007AFF",    // iPhone blue
  linkedin: "#0A66C2", // LinkedIn blue
  location: "#FF3B30", // Apple Maps red
};

const INACTIVE_COLOR = "#D1D5DB"; // Light gray for unchecked

const Container = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
`;

const Item = styled.div<{ $present: boolean }>`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 18px 16px;
  border-radius: 12px;
  background: var(--bg-alt, #f9fafb);
  transition: all 0.2s;
  opacity: ${({ $present }) => ($present ? 1 : 0.5)};
`;

const ContactIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

const Label = styled.span<{ $present: boolean }>`
  font-size: 14px;
  font-weight: 500;
  color: ${({ $present }) => $present ? "var(--text-color, #1f2937)" : "var(--text-secondary, #9CA3AF)"};
`;

const Summary = styled.div`
  margin-top: 12px;
  font-size: 13px;
  color: var(--text-secondary, #6b7280);
  text-align: center;
`;

const contactItems = [
  { key: "phone", label: "Phone" },
  { key: "email", label: "Email" },
  { key: "linkedin", label: "LinkedIn" },
  { key: "location", label: "Location" },
] as const;

const getContactIcon = (key: string, isActive: boolean) => {
  const color = isActive ? ICON_COLORS[key as keyof typeof ICON_COLORS] : INACTIVE_COLOR;

  switch (key) {
    case "phone":
      return <PhoneIcon color={color} />;
    case "email":
      return <EmailIcon color={color} />;
    case "linkedin":
      return <LinkedInIcon color={color} />;
    case "location":
      return <LocationIcon color={color} />;
    default:
      return null;
  }
};

export function ATSContactInfo({ hasContactInfo }: ATSContactInfoProps) {
  const detected = Object.values(hasContactInfo).filter(Boolean).length;
  const total = Object.values(hasContactInfo).length;
  const missing = total - detected;

  return (
    <>
      <Container>
        {contactItems.map(({ key, label }) => {
          const present = hasContactInfo[key];
          return (
            <Item key={key} $present={present}>
              <ContactIcon>
                {getContactIcon(key, present)}
              </ContactIcon>
              <Label $present={present}>{label}</Label>
            </Item>
          );
        })}
      </Container>
      <Summary>
        {detected === total
          ? `All ${total} contact details detected`
          : `${detected} of ${total} detected${missing > 0 ? ` · ${missing} missing` : ""}`}
      </Summary>
    </>
  );
}

export default ATSContactInfo;
