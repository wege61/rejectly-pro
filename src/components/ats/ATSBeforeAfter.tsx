"use client";

import styled from "styled-components";

interface ATSBeforeAfterProps {
  beforeScore: number;
  afterScore: number;
  changes: Array<{
    category: string;
    issue: string;
    fix: string;
    impact?: string;
  }>;
}

// ─── Shared glass card ────────────────────────────────────────────────────────

const glassCard = `
  position: relative;
  background: rgba(22, 22, 26, 0.78);
  backdrop-filter: blur(60px) saturate(220%);
  -webkit-backdrop-filter: blur(60px) saturate(220%);
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: 0 8px 40px rgba(0, 0, 0, 0.45), inset 0 1px 0 rgba(255, 255, 255, 0.06);
  border-radius: 20px;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 1px;
    background: linear-gradient(
      90deg,
      transparent 0%,
      rgba(255, 255, 255, 0.22) 40%,
      rgba(255, 255, 255, 0.42) 60%,
      rgba(255, 255, 255, 0.22) 80%,
      transparent 100%
    );
    pointer-events: none;
    z-index: 1;
  }
`;

// ─── Layout ───────────────────────────────────────────────────────────────────

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

// ─── Hero Card ────────────────────────────────────────────────────────────────

const HeroCard = styled.div`
  ${glassCard}
`;

// Two-panel layout: left = pull-quote number, right = before/after + track
const HeroBody = styled.div`
  display: grid;
  grid-template-columns: 1fr 1px 1fr;
  min-height: 180px;

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
    min-height: auto;
  }
`;

const HeroDivider = styled.div`
  background: rgba(255, 255, 255, 0.06);
  margin: 32px 0;

  @media (max-width: 640px) {
    display: none;
  }
`;

// Left panel — the editorial pull-quote
const HeroLeft = styled.div`
  padding: 36px 40px;
  display: flex;
  flex-direction: column;
  justify-content: center;

  @media (max-width: 640px) {
    padding: 28px 28px 20px;
  }
`;

const BigNumber = styled.div`
  font-size: 80px;
  font-weight: 700;
  letter-spacing: -5px;
  line-height: 0.9;
  font-family: -apple-system, BlinkMacSystemFont, "SF Pro Display", "Helvetica Neue", sans-serif;
  background: linear-gradient(175deg, rgba(255, 255, 255, 1) 30%, rgba(255, 255, 255, 0.5) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 10px;

  @media (max-width: 640px) {
    font-size: 60px;
    letter-spacing: -4px;
  }
`;

const BigNumberLabel = styled.div`
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: rgba(255, 255, 255, 0.24);
`;

// Right panel — before / after scores + track
const HeroRight = styled.div`
  padding: 36px 40px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 20px;

  @media (max-width: 640px) {
    padding: 0 28px 28px;
    gap: 16px;
    border-top: 1px solid rgba(255, 255, 255, 0.05);
  }
`;

const ScoreRow = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
`;

const ScoreStat = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const ScoreNum = styled.span<{ $faded?: boolean }>`
  font-size: ${({ $faded }) => ($faded ? "28px" : "44px")};
  font-weight: 700;
  letter-spacing: -2px;
  line-height: 1;
  color: ${({ $faded }) =>
    $faded ? "rgba(255, 255, 255, 0.28)" : "rgba(255, 255, 255, 0.96)"};
  font-family: -apple-system, BlinkMacSystemFont, "SF Pro Display", "Helvetica Neue", sans-serif;
`;

const ScoreLabel = styled.span`
  font-size: 10px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.09em;
  color: rgba(255, 255, 255, 0.2);
`;

// Track
const TrackWrapper = styled.div`
  position: relative;
  height: 3px;
`;

const TrackBase = styled.div`
  width: 100%;
  height: 3px;
  border-radius: 100px;
  background: rgba(255, 255, 255, 0.07);
`;

const TrackFill = styled.div<{ $pct: number }>`
  position: absolute;
  top: 0;
  left: 0;
  height: 3px;
  width: ${({ $pct }) => $pct}%;
  border-radius: 100px;
  background: var(--primary-500);
`;

const TrackMarker = styled.div<{ $pct: number }>`
  position: absolute;
  top: -3px;
  left: ${({ $pct }) => $pct}%;
  transform: translateX(-50%);
  width: 2px;
  height: 9px;
  border-radius: 1px;
  background: rgba(255, 255, 255, 0.28);
`;

// ─── Changes Grid ──────────────────────────────────────────────────────────────

const LogCard = styled.div`
  ${glassCard}
`;

const LogHeader = styled.div`
  padding: 22px 28px 16px;
  display: flex;
  align-items: baseline;
  gap: 10px;

  @media (max-width: 640px) {
    padding: 18px 20px 12px;
  }
`;

const LogTitle = styled.h3`
  font-size: 14px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.88);
  margin: 0;
  letter-spacing: -0.01em;
`;

const LogCount = styled.span`
  font-size: 11px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.22);
  letter-spacing: 0.06em;
  text-transform: uppercase;
`;

// 2-column card grid
const LogGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  padding: 0 16px 16px;

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
    padding: 0 12px 12px;
  }
`;

const ChangeCard = styled.div`
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 14px;
  padding: 16px 18px;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const ChangeCategory = styled.span`
  font-size: 10px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--primary-400);
`;

const ChangeFix = styled.p`
  font-size: 13px;
  color: rgba(255, 255, 255, 0.82);
  margin: 0;
  line-height: 1.55;
  letter-spacing: -0.01em;
  flex: 1;
`;

const ChangeIssue = styled.p`
  font-size: 11px;
  color: rgba(255, 255, 255, 0.24);
  margin: 0;
  line-height: 1.45;
`;

// ─── Component ────────────────────────────────────────────────────────────────

export function ATSBeforeAfter({ beforeScore, afterScore, changes }: ATSBeforeAfterProps) {
  const improvement = afterScore - beforeScore;

  return (
    <Container>
      {/* Hero: two-panel — editorial number left, score bridge right */}
      <HeroCard>
        <HeroBody>
          <HeroLeft>
            <BigNumber>+{improvement}</BigNumber>
            <BigNumberLabel>Points Gained</BigNumberLabel>
          </HeroLeft>

          <HeroDivider />

          <HeroRight>
            <ScoreRow>
              <ScoreStat>
                <ScoreNum $faded>{beforeScore}</ScoreNum>
                <ScoreLabel>Before</ScoreLabel>
              </ScoreStat>
              <ScoreStat style={{ alignItems: "flex-end" }}>
                <ScoreNum>{afterScore}</ScoreNum>
                <ScoreLabel>After</ScoreLabel>
              </ScoreStat>
            </ScoreRow>

            <TrackWrapper>
              <TrackBase />
              <TrackFill $pct={afterScore} />
              <TrackMarker $pct={beforeScore} />
            </TrackWrapper>
          </HeroRight>
        </HeroBody>
      </HeroCard>

      {/* Changes: 2-column card grid */}
      {changes.length > 0 && (
        <LogCard>
          <LogHeader>
            <LogTitle>What Changed</LogTitle>
            <LogCount>{changes.length} fixes</LogCount>
          </LogHeader>

          <LogGrid>
            {changes.map((change, idx) => (
              <ChangeCard key={idx}>
                <ChangeCategory>{change.category}</ChangeCategory>
                <ChangeFix>{change.fix}</ChangeFix>
                {change.issue && <ChangeIssue>{change.issue}</ChangeIssue>}
              </ChangeCard>
            ))}
          </LogGrid>
        </LogCard>
      )}
    </Container>
  );
}

export default ATSBeforeAfter;
