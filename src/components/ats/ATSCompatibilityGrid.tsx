"use client";

import styled from "styled-components";

interface ATSCompatibilityGridProps {
  compatibility: {
    workday: { rating: string; reason?: string };
    greenhouse: { rating: string; reason?: string };
    taleo: { rating: string; reason?: string };
    lever: { rating: string; reason?: string };
  };
  showReasons?: boolean;
}

const getRatingValue = (rating: string): number => {
  if (rating === "high") return 100;
  if (rating === "medium") return 60;
  return 30;
};

const getRatingColor = (rating: string): string => {
  if (rating === "high") return "#059669";
  if (rating === "medium") return "#d97706";
  return "#dc2626";
};

const Container = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

const Card = styled.div`
  background: var(--bg-color, #ffffff);
  border: 1px solid var(--border-color, #e5e7eb);
  border-radius: 10px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const CardHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const Logo = styled.div`
  font-size: 14px;
  font-weight: 700;
  width: 32px;
  height: 32px;
  border-radius: 6px;
  background: var(--bg-alt, #f3f4f6);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-color, #1f2937);
`;

const Name = styled.span`
  font-size: 14px;
  font-weight: 600;
  color: var(--text-color, #1f2937);
`;

const RatingSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const RatingBar = styled.div`
  height: 6px;
  background: var(--border-color, #e5e7eb);
  border-radius: 3px;
  overflow: hidden;
`;

const RatingFill = styled.div<{ $value: number; $color: string }>`
  height: 100%;
  width: ${({ $value }) => $value}%;
  background: ${({ $color }) => $color};
  border-radius: 3px;
  transition: width 0.5s ease-out;
`;

const RatingLabel = styled.div<{ $color: string }>`
  font-size: 12px;
  font-weight: 600;
  color: ${({ $color }) => $color};
  text-transform: capitalize;
`;

const Reason = styled.p`
  font-size: 11px;
  color: var(--text-secondary, #6b7280);
  line-height: 1.4;
  margin: 0;
`;

const atsLogos: Record<string, string> = {
  workday: "W",
  greenhouse: "G",
  taleo: "T",
  lever: "L",
};

const atsNames: Record<string, string> = {
  workday: "Workday",
  greenhouse: "Greenhouse",
  taleo: "Taleo",
  lever: "Lever",
};

export function ATSCompatibilityGrid({ compatibility, showReasons = false }: ATSCompatibilityGridProps) {
  const platforms = ["workday", "greenhouse", "taleo", "lever"] as const;

  return (
    <Container>
      {platforms.map((platform) => {
        const data = compatibility[platform];
        const rating = typeof data === "string" ? data : data?.rating || "low";
        const reason = typeof data === "object" ? data?.reason : undefined;
        const value = getRatingValue(rating);
        const color = getRatingColor(rating);

        return (
          <Card key={platform}>
            <CardHeader>
              <Logo>{atsLogos[platform]}</Logo>
              <Name>{atsNames[platform]}</Name>
            </CardHeader>
            <RatingSection>
              <RatingBar>
                <RatingFill $value={value} $color={color} />
              </RatingBar>
              <RatingLabel $color={color}>{rating} compatibility</RatingLabel>
            </RatingSection>
            {showReasons && reason && <Reason>{reason}</Reason>}
          </Card>
        );
      })}
    </Container>
  );
}

export default ATSCompatibilityGrid;
