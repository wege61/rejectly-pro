"use client";

import styled, { keyframes } from "styled-components";

interface ATSScoreCircleProps {
  score: number;
  size?: "small" | "medium" | "large";
  showLabel?: boolean;
  animated?: boolean;
}

const getScoreColor = (score: number): string => {
  if (score >= 70) return "#059669";
  if (score >= 50) return "#d97706";
  return "#dc2626";
};

const getScoreData = (score: number): { label: string; description: string } => {
  if (score >= 85) return { label: "Excellent", description: "Should parse correctly" };
  if (score >= 70) return { label: "Good", description: "Minor parsing issues" };
  if (score >= 50) return { label: "Fair", description: "Some data may not extract" };
  return { label: "Poor", description: "Parsing issues detected" };
};

const fillAnimation = keyframes`
  from { stroke-dashoffset: 283; }
`;

const Container = styled.div<{ $size: string }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ $size }) => $size === "large" ? "20px" : $size === "medium" ? "14px" : "10px"};
`;

const CircleWrapper = styled.div<{ $size: string; $color: string }>`
  position: relative;
  width: ${({ $size }) => $size === "large" ? "200px" : $size === "medium" ? "150px" : "100px"};
  height: ${({ $size }) => $size === "large" ? "200px" : $size === "medium" ? "150px" : "100px"};
  border-radius: 50%;
  background: ${({ $color }) => `${$color}08`};
`;

const SVG = styled.svg`
  transform: rotate(-90deg);
  width: 100%;
  height: 100%;
`;

const BackgroundCircle = styled.circle`
  fill: none;
  stroke: var(--border-color, #e5e7eb);
  stroke-width: 10;
`;

const ProgressCircle = styled.circle<{ $color: string; $animated: boolean }>`
  fill: none;
  stroke: ${({ $color }) => $color};
  stroke-width: 10;
  stroke-linecap: round;
  transition: stroke-dashoffset 1s ease-out;
  animation: ${({ $animated }) => $animated ? fillAnimation : "none"} 1.2s ease-out;
  filter: drop-shadow(0 0 6px ${({ $color }) => `${$color}40`});
`;

const ScoreContainer = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const ScoreNumber = styled.span<{ $size: string; $color: string }>`
  font-size: ${({ $size }) => $size === "large" ? "56px" : $size === "medium" ? "40px" : "28px"};
  font-weight: 800;
  color: ${({ $color }) => $color};
  line-height: 1;
  letter-spacing: -2px;
`;

const ScoreMax = styled.span<{ $size: string }>`
  font-size: ${({ $size }) => $size === "large" ? "14px" : $size === "medium" ? "12px" : "10px"};
  color: var(--text-secondary, #6b7280);
  margin-top: 4px;
`;

const LabelContainer = styled.div`
  text-align: center;
`;

const Label = styled.div<{ $color: string }>`
  font-size: 18px;
  font-weight: 700;
  color: ${({ $color }) => $color};
  margin-bottom: 4px;
`;

const Description = styled.div`
  font-size: 13px;
  color: var(--text-secondary, #6b7280);
`;

export function ATSScoreCircle({
  score,
  size = "large",
  showLabel = true,
  animated = true
}: ATSScoreCircleProps) {
  const color = getScoreColor(score);
  const { label, description } = getScoreData(score);

  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const progress = (score / 100) * circumference;
  const offset = circumference - progress;

  return (
    <Container $size={size}>
      <CircleWrapper $size={size} $color={color}>
        <SVG viewBox="0 0 100 100">
          <BackgroundCircle cx="50" cy="50" r={radius} />
          <ProgressCircle
            cx="50"
            cy="50"
            r={radius}
            $color={color}
            $animated={animated}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
          />
        </SVG>
        <ScoreContainer>
          <ScoreNumber $size={size} $color={color}>{score}</ScoreNumber>
          <ScoreMax $size={size}>of 100</ScoreMax>
        </ScoreContainer>
      </CircleWrapper>

      {showLabel && (
        <LabelContainer>
          <Label $color={color}>{label}</Label>
          <Description>{description}</Description>
        </LabelContainer>
      )}
    </Container>
  );
}

export default ATSScoreCircle;
