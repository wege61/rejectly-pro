"use client";

import { useEffect, useState } from "react";
import styled, { keyframes, css } from "styled-components";
import { ShareScoreButton } from "./ShareScoreButton";

interface ATSScoreCircleProps {
  score: number;
  size?: "small" | "medium" | "large";
  showLabel?: boolean;
  animated?: boolean;
}

const getScoreTheme = (score: number) => {
  if (score >= 85)
    return {
      color: "var(--primary-500)",
      label: "ATS Ready",
      description: "Your resume passes automated screening.",
    };
  if (score >= 70)
    return {
      color: "#2A57A0",
      label: "Looking Good",
      description: "A few tweaks could push you higher.",
    };
  if (score >= 50)
    return {
      color: "#EAB308",
      label: "Needs Attention",
      description: "Several issues are affecting your score.",
    };
  return {
    color: "#F97316",
    label: "Not Ready",
    description: "Your resume needs significant improvements.",
  };
};

// ─── Animations ────────────────────────────────────────────────────────────

const progressIn = keyframes`
  from { width: 0%; }
`;

const cardReveal = keyframes`
  from {
    opacity: 0;
    transform: translateY(12px) scale(0.97);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
`;

const badgePop = keyframes`
  0% { opacity: 0; transform: scale(0.8); }
  60% { transform: scale(1.06); }
  100% { opacity: 1; transform: scale(1); }
`;

// ─── Small ─────────────────────────────────────────────────────────────────

const SmallBadge = styled.div<{ $color: string }>`
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 6px 13px 6px 10px;
  border-radius: 100px;
  background: ${({ $color }) => `${$color}14`};
  border: 1px solid ${({ $color }) => `${$color}26`};
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
`;

const SmallDot = styled.div<{ $color: string }>`
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: ${({ $color }) => $color};
  flex-shrink: 0;
`;

const SmallScore = styled.span<{ $color: string }>`
  font-size: 18px;
  font-weight: 700;
  color: ${({ $color }) => $color};
  letter-spacing: -0.5px;
  line-height: 1;
  font-family: -apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif;
`;

const SmallUnit = styled.span`
  font-size: 11px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.3);
  letter-spacing: 0.8px;
  text-transform: uppercase;
`;

// ─── Card ──────────────────────────────────────────────────────────────────

const Card = styled.div<{ $color: string; $size: string; $animated: boolean }>`
  position: relative;
  width: 100%;
  max-width: ${({ $size }) => ($size === "large" ? "420px" : "320px")};
  overflow: hidden;
  border-radius: 18px;

  background:
    radial-gradient(
      ellipse 110% 60% at 50% 130%,
      ${({ $color }) => `${$color}14`},
      transparent 65%
    ),
    rgba(22, 22, 26, 0.78);

  backdrop-filter: blur(60px) saturate(200%);
  -webkit-backdrop-filter: blur(60px) saturate(200%);

  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow:
    0 8px 40px rgba(0, 0, 0, 0.45),
    0 2px 8px rgba(0, 0, 0, 0.3);

  padding: ${({ $size }) => ($size === "large" ? "32px 36px 32px" : "24px 28px 26px")};

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

  ${({ $animated }) =>
    $animated &&
    css`
      animation: ${cardReveal} 0.6s cubic-bezier(0.16, 1, 0.3, 1) both;
    `}
`;

const CardHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 8px;
`;

const Eyebrow = styled.span`
  font-size: 11px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.28);
  letter-spacing: 1.4px;
  text-transform: uppercase;
`;

const Badge = styled.div<{ $color: string; $animated: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 5px 11px 5px 9px;
  border-radius: 100px;
  background: ${({ $color }) => `${$color}18`};
  border: 1px solid ${({ $color }) => `${$color}2E`};
  flex-shrink: 0;

  ${({ $animated }) =>
    $animated &&
    css`
      animation: ${badgePop} 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) 0.6s both;
    `}
`;

const BadgeDot = styled.div<{ $color: string }>`
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: ${({ $color }) => $color};
  flex-shrink: 0;
`;

const BadgeText = styled.span<{ $color: string }>`
  font-size: 12px;
  font-weight: 600;
  color: ${({ $color }) => $color};
  letter-spacing: 0.1px;
  white-space: nowrap;
`;

const ScoreNumber = styled.div<{ $size: string }>`
  font-size: ${({ $size }) => ($size === "large" ? "100px" : "76px")};
  font-weight: 700;
  line-height: 1;
  letter-spacing: -5px;
  font-family: -apple-system, BlinkMacSystemFont, "SF Pro Display",
    "Helvetica Neue", sans-serif;

  /* Vertical gradient: solid white → fades slightly at base */
  background: linear-gradient(
    180deg,
    rgba(255, 255, 255, 1) 40%,
    rgba(255, 255, 255, 0.65) 100%
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;

  /* Negative bottom margin to tighten spacing with the bar */
  margin-bottom: ${({ $size }) => ($size === "large" ? "24px" : "18px")};
  margin-top: ${({ $size }) => ($size === "large" ? "4px" : "2px")};
`;

const ProgressTrack = styled.div`
  width: 100%;
  height: 3px;
  border-radius: 100px;
  background: rgba(255, 255, 255, 0.07);
  overflow: hidden;
  margin-bottom: 16px;
`;

const ProgressFill = styled.div<{
  $color: string;
  $score: number;
  $animated: boolean;
}>`
  height: 100%;
  width: ${({ $score }) => $score}%;
  border-radius: 100px;
  background: ${({ $color }) => $color};

  ${({ $animated }) =>
    $animated &&
    css`
      animation: ${progressIn} 1.2s cubic-bezier(0.16, 1, 0.3, 1) 0.1s both;
    `}
`;

const Description = styled.p<{ $size: string }>`
  font-size: ${({ $size }) => ($size === "large" ? "14px" : "13px")};
  line-height: 1.55;
  color: rgba(255, 255, 255, 0.36);
  font-weight: 400;
  margin: 0;
  letter-spacing: 0.05px;
`;

// ─── Component ─────────────────────────────────────────────────────────────

export function ATSScoreCircle({
  score,
  size = "large",
  showLabel = true,
  animated = true,
}: ATSScoreCircleProps) {
  const theme = getScoreTheme(score);

  // Keynote-style number reveal: counts up from 0
  const [displayScore, setDisplayScore] = useState(animated ? 0 : score);

  useEffect(() => {
    if (!animated) {
      setDisplayScore(score);
      return;
    }

    let frame: number;
    const duration = 1100;
    const startTime = performance.now();

    const tick = (now: number) => {
      const elapsed = now - startTime;
      const t = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3); // ease out cubic
      setDisplayScore(Math.round(eased * score));
      if (t < 1) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [score, animated]);

  if (size === "small") {
    return (
      <SmallBadge $color={theme.color}>
        <SmallDot $color={theme.color} />
        <SmallScore $color={theme.color}>{displayScore}</SmallScore>
        <SmallUnit>ATS</SmallUnit>
      </SmallBadge>
    );
  }

  return (
    <Card $color={theme.color} $size={size} $animated={animated}>
      <CardHeader>
        <Eyebrow>ATS Score</Eyebrow>
        {showLabel && (
          <Badge $color={theme.color} $animated={animated}>
            <BadgeDot $color={theme.color} />
            <BadgeText $color={theme.color}>{theme.label}</BadgeText>
          </Badge>
        )}
      </CardHeader>

      <ScoreNumber $size={size}>{displayScore}</ScoreNumber>

      <ProgressTrack>
        <ProgressFill
          $color={theme.color}
          $score={score}
          $animated={animated}
        />
      </ProgressTrack>

      {showLabel && (
        <Description $size={size}>{theme.description}</Description>
      )}

      <div style={{ marginTop: '16px' }}>
        <ShareScoreButton score={score} size="sm" />
      </div>
    </Card>
  );
}

export default ATSScoreCircle;
