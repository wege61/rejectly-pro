"use client";

import styled, { keyframes } from "styled-components";

interface ATSScoreCircleProps {
  score: number;
  size?: "small" | "medium" | "large";
  showLabel?: boolean;
  animated?: boolean;
}

const getScoreTheme = (score: number) => {
  if (score >= 85) return { color: "#34C759", label: "Excellent", description: "Highly ATS Compatible" }; // Apple Green
  if (score >= 70) return { color: "#007AFF", label: "Good", description: "Minor parsing issues" }; // Apple Blue
  if (score >= 50) return { color: "#FF9500", label: "Fair", description: "Data extraction at risk" }; // Apple Orange
  return { color: "#FF3B30", label: "Poor", description: "Severe parsing blocks" }; // Apple Red
};

const fillAnimation = keyframes`
  from { stroke-dashoffset: 283; }
`;

const Container = styled.div<{ $size: string }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ $size }) => $size === "large" ? "24px" : "16px"};
`;

// Apple-style deeply frosted panel behind the circle
const CircleWrapper = styled.div<{ $size: string }>`
  position: relative;
  width: ${({ $size }) => $size === "large" ? "240px" : $size === "medium" ? "180px" : "120px"};
  height: ${({ $size }) => $size === "large" ? "240px" : $size === "medium" ? "180px" : "120px"};
  border-radius: 50%;
  
  /* Deep blur liquid glass */
  background: rgba(255, 255, 255, 0.02);
  backdrop-filter: blur(40px) saturate(140%);
  -webkit-backdrop-filter: blur(40px) saturate(140%);
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.05);

  display: flex;
  align-items: center;
  justify-content: center;
`;

const SVG = styled.svg`
  transform: rotate(-90deg);
  width: 90%;
  height: 90%;
  position: absolute;
`;

const BackgroundCircle = styled.circle`
  fill: none;
  stroke: rgba(255, 255, 255, 0.06);
  stroke-width: 6;
`;

const ProgressCircle = styled.circle<{ $color: string; $animated: boolean }>`
  fill: none;
  stroke-width: 6;
  stroke-linecap: round;
  stroke: ${({ $color }) => $color};
  transition: stroke-dashoffset 1.5s cubic-bezier(0.16, 1, 0.3, 1);
  animation: ${({ $animated }) => $animated ? fillAnimation : "none"} 1.5s cubic-bezier(0.16, 1, 0.3, 1);
  /* Very soft glow, not neon */
  filter: drop-shadow(0 0 4px ${({ $color }) => `${$color}30`});
`;

const ScoreContainer = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 2;
`;

const ScoreNumber = styled.span<{ $size: string; $color: string }>`
  font-size: ${({ $size }) => $size === "large" ? "64px" : $size === "medium" ? "48px" : "32px"};
  font-weight: 700;
  color: ${({ $color }) => $color};
  line-height: 1;
  letter-spacing: -1.5px;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
`;

const ScoreMax = styled.span<{ $size: string }>`
  font-size: ${({ $size }) => $size === "large" ? "14px" : "12px"};
  color: rgba(255, 255, 255, 0.5);
  margin-top: 4px;
  font-weight: 500;
`;

const LabelContainer = styled.div`
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const Label = styled.div<{ $color: string }>`
  font-size: 20px;
  font-weight: 600;
  color: ${({ $color }) => $color};
  letter-spacing: -0.3px;
`;

const Description = styled.div`
  font-size: 14px;
  color: rgba(255, 255, 255, 0.6);
  font-weight: 400;
`;

export function ATSScoreCircle({
  score,
  size = "large",
  showLabel = true,
  animated = true
}: ATSScoreCircleProps) {
  const theme = getScoreTheme(score);

  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const progress = (score / 100) * circumference;
  const offset = circumference - progress;

  return (
    <Container $size={size}>
      <CircleWrapper $size={size}>
        <SVG viewBox="0 0 100 100">
          <BackgroundCircle cx="50" cy="50" r={radius} />
          <ProgressCircle
            cx="50"
            cy="50"
            r={radius}
            $color={theme.color}
            $animated={animated}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
          />
        </SVG>
        <ScoreContainer>
          <ScoreNumber $size={size} $color={theme.color}>{score}</ScoreNumber>
          <ScoreMax $size={size}>/ 100</ScoreMax>
        </ScoreContainer>
      </CircleWrapper>

      {showLabel && (
        <LabelContainer>
          <Label $color={theme.color}>{theme.label}</Label>
          <Description>{theme.description}</Description>
        </LabelContainer>
      )}
    </Container>
  );
}

export default ATSScoreCircle;
