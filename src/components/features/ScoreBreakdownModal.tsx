"use client";

import styled from "styled-components";
import { Drawer, DrawerHeader, DrawerTitle, DrawerDescription, DrawerBody, DrawerFooter } from "@/components/ui/Drawer";
import { Button } from "@/components/ui/Button";
import {
  ScoreBreakdown,
  getVerdictText,
  getVerdictColor,
} from "@/types/scoreBreakdown";
import {
  Target,
  Briefcase,
  Building2,
  GraduationCap,
  AlertTriangle,
  TrendingUp,
  CheckCircle2,
  XCircle,
  Info,
} from "lucide-react";

interface ScoreBreakdownModalProps {
  isOpen: boolean;
  onClose: () => void;
  breakdown: ScoreBreakdown | null;
  fitScore: number;
  originalScore?: number;
}

// --- Styled Components ---

const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const ScoreHero = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 24px 0;
`;

const ScoreRow = styled.div`
  display: flex;
  align-items: baseline;
  gap: 12px;
`;

const OriginalScore = styled.span`
  font-size: 28px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textTertiary};
  text-decoration: line-through;
  line-height: 1;
`;

const HeroScore = styled.span<{ $color: string }>`
  font-size: 48px;
  font-weight: 700;
  color: ${({ $color }) => $color};
  line-height: 1;
  letter-spacing: -2px;
`;

const ScoreSubtext = styled.div`
  font-size: 15px;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const VerdictBadge = styled.div<{ $color: string }>`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 14px;
  background: ${({ $color }) => `${$color}15`};
  color: ${({ $color }) => $color};
  border-radius: 9999px;
  font-size: 13px;
  font-weight: 600;
`;

const JobBadge = styled.span`
  font-size: 12px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.textTertiary};
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const StatsRow = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;

  @media (max-width: 640px) {
    grid-template-columns: repeat(3, 1fr);
    gap: 8px;
  }
`;

const StatItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 14px 8px;
  border-radius: 12px;
  background: ${({ theme }) => theme.colors.backgroundAlt};
`;

const StatValue = styled.div<{ $color?: string }>`
  font-size: 20px;
  font-weight: 700;
  color: ${({ $color, theme }) => $color || theme.colors.textPrimary};
  line-height: 1;
`;

const StatLabel = styled.div`
  font-size: 11px;
  color: ${({ theme }) => theme.colors.textTertiary};
  text-transform: uppercase;
  letter-spacing: 0.3px;
  font-weight: 500;
`;

const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textPrimary};

  svg {
    width: 16px;
    height: 16px;
    color: ${({ theme }) => theme.colors.textTertiary};
  }
`;

const ComponentsStack = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const ComponentCard = styled.div`
  padding: 14px 16px;
  border-radius: 12px;
  background: ${({ theme }) => theme.colors.backgroundAlt};
`;

const ComponentTop = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
`;

const ComponentName = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textPrimary};

  svg {
    width: 15px;
    height: 15px;
    color: ${({ theme }) => theme.colors.textTertiary};
  }
`;

const ComponentWeight = styled.span`
  font-size: 12px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.textTertiary};
`;

const ComponentScore = styled.span<{ $color: string }>`
  font-size: 14px;
  font-weight: 700;
  color: ${({ $color }) => $color};
`;

const ProgressTrack = styled.div`
  height: 6px;
  background: ${({ theme }) => theme.colors.border};
  border-radius: 9999px;
  overflow: hidden;
  margin-bottom: 10px;
`;

const ProgressFill = styled.div<{ $percentage: number; $color: string }>`
  height: 100%;
  width: ${({ $percentage }) => Math.min($percentage, 100)}%;
  background: ${({ $color }) => $color};
  border-radius: 9999px;
  transition: width 0.6s cubic-bezier(0.16, 1, 0.3, 1);
`;

const ComponentDetail = styled.p`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.textSecondary};
  line-height: 1.5;
  margin: 0 0 8px;
`;

const ChipsRow = styled.div`
  display: flex;
  gap: 12px;
  flex-wrap: wrap;

  @media (max-width: 640px) {
    flex-direction: column;
    gap: 8px;
  }
`;

const ChipGroup = styled.div`
  flex: 1;
  min-width: 0;
`;

const ChipLabel = styled.div<{ $type: "matched" | "missing" }>`
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 11px;
  font-weight: 600;
  color: ${({ $type }) => ($type === "matched" ? "var(--primary-500, #35A29F)" : "#ef4444")};
  margin-bottom: 6px;
  text-transform: uppercase;
  letter-spacing: 0.3px;

  svg {
    width: 11px;
    height: 11px;
  }
`;

const ChipsWrap = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
`;

const Chip = styled.span<{ $type: "matched" | "missing" }>`
  display: inline-block;
  padding: 3px 8px;
  background: ${({ $type }) =>
    $type === "matched" ? "rgba(53, 162, 159, 0.1)" : "rgba(239, 68, 68, 0.08)"};
  color: ${({ $type }) => ($type === "matched" ? "var(--primary-500, #35A29F)" : "#ef4444")};
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
  max-width: 160px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const PenaltiesCard = styled.div`
  border-radius: 12px;
  background: rgba(239, 68, 68, 0.04);
  border: 1px solid rgba(239, 68, 68, 0.1);
  overflow: hidden;
`;

const PenaltyRow = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 12px 16px;
  border-bottom: 1px solid rgba(239, 68, 68, 0.06);

  &:last-child {
    border-bottom: none;
  }
`;

const PenaltyIcon = styled.span<{ $severity: string }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  border-radius: 6px;
  flex-shrink: 0;
  background: ${({ $severity }) =>
    $severity === "critical"
      ? "rgba(239, 68, 68, 0.15)"
      : $severity === "major"
        ? "rgba(249, 115, 22, 0.15)"
        : "rgba(245, 158, 11, 0.15)"};
  color: ${({ $severity }) =>
    $severity === "critical"
      ? "#ef4444"
      : $severity === "major"
        ? "#f97316"
        : "#f59e0b"};

  svg {
    width: 12px;
    height: 12px;
  }
`;

const PenaltyText = styled.div`
  flex: 1;
  min-width: 0;
`;

const PenaltyDesc = styled.div`
  font-size: 13px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.textPrimary};
  line-height: 1.4;
`;

const PenaltyReason = styled.div`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.textTertiary};
  margin-top: 2px;
`;

const PenaltyPts = styled.span`
  font-weight: 700;
  color: #ef4444;
  font-size: 13px;
  flex-shrink: 0;
`;

const NoPenalties = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 14px 16px;
  background: rgba(53, 162, 159, 0.06);
  border: 1px solid rgba(53, 162, 159, 0.12);
  border-radius: 12px;
  color: var(--primary-500, #35A29F);
  font-size: 14px;
  font-weight: 500;

  svg {
    width: 16px;
    height: 16px;
  }
`;

const AssessmentCard = styled.div`
  border-radius: 12px;
  background: ${({ theme }) => theme.colors.backgroundAlt};
  padding: 16px;
`;

const AssessmentText = styled.p`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.textPrimary};
  line-height: 1.6;
  margin: 0 0 12px;
`;

const GapRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 12px;
  background: ${({ theme }) => theme.colors.backgroundAlt2};
  border-radius: 8px;
  font-size: 13px;
  color: ${({ theme }) => theme.colors.textSecondary};

  svg {
    width: 14px;
    height: 14px;
    color: ${({ theme }) => theme.colors.textTertiary};
    flex-shrink: 0;
  }
`;

// --- Helpers ---

const getScoreColor = (score: number): string => {
  if (score >= 85) return "var(--primary-500, #35A29F)";
  if (score >= 70) return "#2a57a0ff";
  if (score >= 50) return "#EAB308";
  return "#F97316";
};

const getComponentIcon = (name: string) => {
  if (name.toLowerCase().includes("skill")) return <Target />;
  if (name.toLowerCase().includes("experience") || name.toLowerCase().includes("potential")) return <Briefcase />;
  if (name.toLowerCase().includes("industry")) return <Building2 />;
  if (name.toLowerCase().includes("education")) return <GraduationCap />;
  return <Target />;
};

const getProgressColor = (percentage: number): string => {
  if (percentage >= 70) return "var(--primary-500, #35A29F)";
  if (percentage >= 50) return "#EAB308";
  return "#ef4444";
};

const getJobLevelLabel = (level: string): string => {
  switch (level) {
    case "entry": return "Entry Level";
    case "mid": return "Mid Level";
    case "senior": return "Senior Level";
    default: return level;
  }
};

const formatComponentDetails = (details: string | object): string => {
  if (typeof details === "string") return details;

  const d = details as Record<string, unknown>;
  const parts: string[] = [];
  if (d.requiredSkillsTotal !== undefined) parts.push(`Required: ${d.requiredSkillsMatched}/${d.requiredSkillsTotal}`);
  if (d.preferredSkillsTotal !== undefined) parts.push(`Preferred: ${d.preferredSkillsMatched}/${d.preferredSkillsTotal}`);
  if (d.yearsRequired !== undefined) parts.push(`Experience: ${d.yearsCandidate}/${d.yearsRequired} years`);
  if (d.seniorityRequired !== undefined) parts.push(`Seniority: ${d.seniorityCandidate} (required: ${d.seniorityRequired})`);
  if (d.industryMatch !== undefined) parts.push(`Industry: ${d.industryMatch}`);
  if (d.educationMatch !== undefined) parts.push(`Education: ${d.educationMatch}`);
  if (d.certMatch !== undefined) parts.push(`Certifications: ${d.certMatch}`);
  return parts.length > 0 ? parts.join(" · ") : "";
};

// --- Component ---

export const ScoreBreakdownModal: React.FC<ScoreBreakdownModalProps> = ({
  isOpen,
  onClose,
  breakdown,
  fitScore,
  originalScore,
}) => {
  if (!breakdown) return null;

  const components = [
    breakdown.components.skillsMatch,
    breakdown.components.experienceMatch,
    breakdown.components.industryRelevance,
    breakdown.components.educationCerts,
  ].filter(Boolean);

  const verdictColor = getVerdictColor(breakdown.assessment.verdict);
  const scoreColor = getScoreColor(fitScore);

  return (
    <Drawer isOpen={isOpen} onClose={onClose}>
      <DrawerHeader>
        <DrawerTitle>Score Breakdown</DrawerTitle>
        <DrawerDescription>How your CV matches the job requirements</DrawerDescription>
      </DrawerHeader>
      <DrawerBody>
        <Content>
          {/* Hero Score */}
          <ScoreHero>
            <ScoreRow>
              {originalScore !== undefined && originalScore !== fitScore && (
                <OriginalScore>{originalScore}%</OriginalScore>
              )}
              <HeroScore $color={scoreColor}>{fitScore}%</HeroScore>
            </ScoreRow>
            <ScoreSubtext>{breakdown.displayData.scoreLabel}</ScoreSubtext>
            <VerdictBadge $color={verdictColor}>
              {breakdown.assessment.verdict === "would_interview" && <CheckCircle2 size={13} />}
              {breakdown.assessment.verdict === "maybe_with_reservations" && <Info size={13} />}
              {breakdown.assessment.verdict === "would_not_interview" && <XCircle size={13} />}
              {getVerdictText(breakdown.assessment.verdict)}
            </VerdictBadge>
            {breakdown.jobLevel && (
              <JobBadge>{getJobLevelLabel(breakdown.jobLevel)}</JobBadge>
            )}
          </ScoreHero>

          {/* Stats Row */}
          <StatsRow>
            <StatItem>
              <StatValue>{breakdown.rawScore}</StatValue>
              <StatLabel>Raw</StatLabel>
            </StatItem>
            <StatItem>
              <StatValue $color="#ef4444">-{breakdown.totalPenalties}</StatValue>
              <StatLabel>Penalties</StatLabel>
            </StatItem>
            <StatItem>
              <StatValue $color={scoreColor}>{breakdown.finalScore}</StatValue>
              <StatLabel>Final</StatLabel>
            </StatItem>
          </StatsRow>

          {/* Components */}
          <div>
            <SectionHeader>
              <TrendingUp /> Score Components
            </SectionHeader>
            <ComponentsStack>
              {components.map((component) => {
                const pColor = getProgressColor(component!.percentage);
                return (
                  <ComponentCard key={component!.name}>
                    <ComponentTop>
                      <ComponentName>
                        {getComponentIcon(component!.name)}
                        {component!.name}
                        <ComponentWeight>({component!.weight}%)</ComponentWeight>
                      </ComponentName>
                      <ComponentScore $color={pColor}>
                        {component!.earnedPoints.toFixed(1)}/{component!.maxPoints}
                      </ComponentScore>
                    </ComponentTop>
                    <ProgressTrack>
                      <ProgressFill $percentage={component!.percentage} $color={pColor} />
                    </ProgressTrack>
                    {formatComponentDetails(component!.details) && (
                      <ComponentDetail>{formatComponentDetails(component!.details)}</ComponentDetail>
                    )}
                    <ChipsRow>
                      {component!.matchedItems && component!.matchedItems.length > 0 && (
                        <ChipGroup>
                          <ChipLabel $type="matched"><CheckCircle2 /> Matched</ChipLabel>
                          <ChipsWrap>
                            {component!.matchedItems.slice(0, 5).map((item, i) => (
                              <Chip key={i} $type="matched" title={item}>{item}</Chip>
                            ))}
                            {component!.matchedItems.length > 5 && (
                              <Chip $type="matched">+{component!.matchedItems.length - 5}</Chip>
                            )}
                          </ChipsWrap>
                        </ChipGroup>
                      )}
                      {component!.missingItems && component!.missingItems.length > 0 && (
                        <ChipGroup>
                          <ChipLabel $type="missing"><XCircle /> Missing</ChipLabel>
                          <ChipsWrap>
                            {component!.missingItems.slice(0, 5).map((item, i) => (
                              <Chip key={i} $type="missing" title={item}>{item}</Chip>
                            ))}
                            {component!.missingItems.length > 5 && (
                              <Chip $type="missing">+{component!.missingItems.length - 5}</Chip>
                            )}
                          </ChipsWrap>
                        </ChipGroup>
                      )}
                    </ChipsRow>
                  </ComponentCard>
                );
              })}
            </ComponentsStack>
          </div>

          {/* Penalties */}
          <div>
            <SectionHeader>
              <AlertTriangle /> Penalties
            </SectionHeader>
            {breakdown.penalties && breakdown.penalties.length > 0 ? (
              <PenaltiesCard>
                {breakdown.penalties.map((penalty) => (
                  <PenaltyRow key={penalty.id}>
                    <PenaltyIcon $severity={penalty.severity}>
                      <AlertTriangle />
                    </PenaltyIcon>
                    <PenaltyText>
                      <PenaltyDesc>{penalty.description}</PenaltyDesc>
                      {penalty.reason && <PenaltyReason>{penalty.reason}</PenaltyReason>}
                    </PenaltyText>
                    <PenaltyPts>-{penalty.pointsDeducted}</PenaltyPts>
                  </PenaltyRow>
                ))}
              </PenaltiesCard>
            ) : (
              <NoPenalties>
                <CheckCircle2 />
                No penalties applied
              </NoPenalties>
            )}
          </div>

          {/* HR Assessment */}
          <div>
            <SectionHeader>
              <Briefcase /> HR Assessment
            </SectionHeader>
            <AssessmentCard>
              <AssessmentText>{breakdown.assessment.recommendation}</AssessmentText>
              <GapRow>
                <Target />
                <span><strong>Primary Gap:</strong> {breakdown.displayData.primaryGap}</span>
              </GapRow>
            </AssessmentCard>
          </div>
        </Content>
      </DrawerBody>
      <DrawerFooter>
        <Button variant="primary" onClick={onClose} style={{width: "300px", maxWidth: "95%"}}>
          Done
        </Button>
      </DrawerFooter>
    </Drawer>
  );
};
