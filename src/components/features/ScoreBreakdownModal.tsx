"use client";

import styled from "styled-components";
import { Modal } from "@/components/ui/Modal";
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
}

const ModalContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg};
`;

const ScoreHeader = styled.div`
  text-align: center;
  padding: ${({ theme }) => theme.spacing.lg};
  background: linear-gradient(
    135deg,
    ${({ theme }) => theme.colors.surfaceHover} 0%,
    ${({ theme }) => theme.colors.surface} 100%
  );
  border-radius: ${({ theme }) => theme.radius.lg};
  border: 1px solid ${({ theme }) => theme.colors.border};
`;

const MainScore = styled.div<{ $color: string }>`
  font-size: 4rem;
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ $color }) => $color};
  line-height: 1;
  margin-bottom: ${({ theme }) => theme.spacing.xs};

  @media (max-width: 640px) {
    font-size: 3rem;
  }
`;

const ScoreLabel = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const Verdict = styled.div<{ $color: string }>`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  padding: ${({ theme }) => `${theme.spacing.xs} ${theme.spacing.md}`};
  background: ${({ $color }) => `${$color}15`};
  color: ${({ $color }) => $color};
  border-radius: ${({ theme }) => theme.radius.full};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
`;

const JobLevelBadge = styled.span`
  display: inline-block;
  padding: 2px 8px;
  background: ${({ theme }) => theme.colors.primary}15;
  color: ${({ theme }) => theme.colors.primary};
  border-radius: ${({ theme }) => theme.radius.sm};
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  text-transform: uppercase;
  margin-top: ${({ theme }) => theme.spacing.sm};
`;

const SectionTitle = styled.h3`
  font-size: ${({ theme }) => theme.typography.fontSize.md};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.textPrimary};
  margin-bottom: ${({ theme }) => theme.spacing.md};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};

  svg {
    width: 18px;
    height: 18px;
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const ScoreSummaryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.md};
  background: ${({ theme }) => theme.colors.surfaceHover};
  border-radius: ${({ theme }) => theme.radius.md};
  border: 1px solid ${({ theme }) => theme.colors.border};

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
    gap: ${({ theme }) => theme.spacing.sm};
  }
`;

const SummaryItem = styled.div`
  text-align: center;
  padding: ${({ theme }) => theme.spacing.sm};
`;

const SummaryValue = styled.div<{ $color?: string }>`
  font-size: ${({ theme }) => theme.typography.fontSize.xl};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ $color, theme }) => $color || theme.colors.textPrimary};
`;

const SummaryLabel = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  color: ${({ theme }) => theme.colors.textSecondary};
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const ComponentsGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
`;

const ComponentCard = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.md};
  padding: ${({ theme }) => theme.spacing.md};
  transition: all ${({ theme }) => theme.transitions.fast};

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary}50;
  }
`;

const ComponentHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const ComponentName = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.textPrimary};

  svg {
    width: 16px;
    height: 16px;
    color: ${({ theme }) => theme.colors.textSecondary};
  }
`;

const ComponentScore = styled.span<{ $percentage: number }>`
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ $percentage }) =>
    $percentage >= 70
      ? "#10b981"
      : $percentage >= 50
        ? "#f59e0b"
        : "#ef4444"};
`;

const ProgressBarContainer = styled.div`
  height: 8px;
  background: ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.full};
  overflow: hidden;
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const ProgressBarFill = styled.div<{ $percentage: number; $color: string }>`
  height: 100%;
  width: ${({ $percentage }) => Math.min($percentage, 100)}%;
  background: ${({ $color }) => $color};
  border-radius: ${({ theme }) => theme.radius.full};
  transition: width 0.5s ease;
`;

const ComponentDetails = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
  line-height: 1.5;
`;

const ItemsContainer = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.lg};
  margin-top: ${({ theme }) => theme.spacing.xs};

  @media (max-width: 640px) {
    flex-direction: column;
    gap: ${({ theme }) => theme.spacing.sm};
  }
`;

const ItemsList = styled.div`
  flex: 1;
`;

const ItemsLabel = styled.div<{ $type: "matched" | "missing" }>`
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 11px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ $type }) => ($type === "matched" ? "#10b981" : "#ef4444")};
  margin-bottom: 6px;
  text-transform: uppercase;
  letter-spacing: 0.5px;

  svg {
    width: 12px;
    height: 12px;
  }
`;

const ItemsChips = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
`;

const Chip = styled.span<{ $type: "matched" | "missing" }>`
  display: inline-block;
  padding: 2px 8px;
  background: ${({ $type }) =>
    $type === "matched" ? "rgba(16, 185, 129, 0.1)" : "rgba(239, 68, 68, 0.1)"};
  color: ${({ $type }) => ($type === "matched" ? "#10b981" : "#ef4444")};
  border-radius: 4px;
  font-size: 11px;
  max-width: 150px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const PenaltiesSection = styled.div`
  background: rgba(239, 68, 68, 0.05);
  border: 1px solid rgba(239, 68, 68, 0.2);
  border-radius: ${({ theme }) => theme.radius.lg};
  padding: ${({ theme }) => theme.spacing.md};
`;

const PenaltyItem = styled.div`
  display: flex;
  align-items: flex-start;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing.sm} 0;
  border-bottom: 1px solid rgba(239, 68, 68, 0.1);

  &:last-child {
    border-bottom: none;
    padding-bottom: 0;
  }

  &:first-child {
    padding-top: 0;
  }
`;

const PenaltyIcon = styled.span<{ $severity: string }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: ${({ theme }) => theme.radius.sm};
  background: ${({ $severity }) =>
    $severity === "critical"
      ? "rgba(239, 68, 68, 0.2)"
      : $severity === "major"
        ? "rgba(249, 115, 22, 0.2)"
        : "rgba(245, 158, 11, 0.2)"};
  color: ${({ $severity }) =>
    $severity === "critical"
      ? "#ef4444"
      : $severity === "major"
        ? "#f97316"
        : "#f59e0b"};
  flex-shrink: 0;

  svg {
    width: 14px;
    height: 14px;
  }
`;

const PenaltyContent = styled.div`
  flex: 1;
  min-width: 0;
`;

const PenaltyDescription = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const PenaltyReason = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-top: 2px;
`;

const PenaltyPoints = styled.span`
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: #ef4444;
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  flex-shrink: 0;
`;

const AssessmentCard = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.md};
  padding: ${({ theme }) => theme.spacing.md};
`;

const RecommendationText = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.textPrimary};
  line-height: 1.6;
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const PrimaryGap = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing.sm};
  background: ${({ theme }) => theme.colors.surfaceHover};
  border-radius: ${({ theme }) => theme.radius.sm};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};

  svg {
    width: 16px;
    height: 16px;
    color: ${({ theme }) => theme.colors.primary};
    flex-shrink: 0;
  }
`;

const NoPenaltiesMessage = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing.md};
  background: rgba(16, 185, 129, 0.1);
  border: 1px solid rgba(16, 185, 129, 0.2);
  border-radius: ${({ theme }) => theme.radius.md};
  color: #10b981;
  font-size: ${({ theme }) => theme.typography.fontSize.sm};

  svg {
    width: 18px;
    height: 18px;
  }
`;

const getComponentIcon = (name: string) => {
  if (name.toLowerCase().includes("skill")) return <Target />;
  if (
    name.toLowerCase().includes("experience") ||
    name.toLowerCase().includes("potential")
  )
    return <Briefcase />;
  if (name.toLowerCase().includes("industry")) return <Building2 />;
  if (name.toLowerCase().includes("education")) return <GraduationCap />;
  return <Target />;
};

const getProgressColor = (percentage: number): string => {
  if (percentage >= 70) return "#10b981";
  if (percentage >= 50) return "#f59e0b";
  return "#ef4444";
};

const getJobLevelLabel = (level: string): string => {
  switch (level) {
    case "entry":
      return "Entry Level";
    case "mid":
      return "Mid Level";
    case "senior":
      return "Senior Level";
    default:
      return level;
  }
};

export const ScoreBreakdownModal: React.FC<ScoreBreakdownModalProps> = ({
  isOpen,
  onClose,
  breakdown,
  fitScore,
}) => {
  if (!breakdown) return null;

  const components = [
    breakdown.components.skillsMatch,
    breakdown.components.experienceMatch,
    breakdown.components.industryRelevance,
    breakdown.components.educationCerts,
  ];

  const verdictColor = getVerdictColor(breakdown.assessment.verdict);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Score Breakdown"
      description="See how your CV matches the job requirements"
      size="lg"
    >
      <Modal.Body>
        <ModalContent>
          {/* Main Score Display */}
          <ScoreHeader>
            <MainScore $color={breakdown.displayData.scoreColor}>
              {fitScore}%
            </MainScore>
            <ScoreLabel>{breakdown.displayData.scoreLabel}</ScoreLabel>
            <Verdict $color={verdictColor}>
              {breakdown.assessment.verdict === "would_interview" && (
                <CheckCircle2 size={14} />
              )}
              {breakdown.assessment.verdict === "maybe_with_reservations" && (
                <Info size={14} />
              )}
              {breakdown.assessment.verdict === "would_not_interview" && (
                <XCircle size={14} />
              )}
              {getVerdictText(breakdown.assessment.verdict)}
            </Verdict>
            <JobLevelBadge>{getJobLevelLabel(breakdown.jobLevel)}</JobLevelBadge>
          </ScoreHeader>

          {/* Score Summary */}
          <ScoreSummaryGrid>
            <SummaryItem>
              <SummaryValue>{breakdown.rawScore}</SummaryValue>
              <SummaryLabel>Raw Score</SummaryLabel>
            </SummaryItem>
            <SummaryItem>
              <SummaryValue $color="#ef4444">
                -{breakdown.totalPenalties}
              </SummaryValue>
              <SummaryLabel>Penalties</SummaryLabel>
            </SummaryItem>
            <SummaryItem>
              <SummaryValue $color={breakdown.displayData.scoreColor}>
                {breakdown.finalScore}
              </SummaryValue>
              <SummaryLabel>Final Score</SummaryLabel>
            </SummaryItem>
          </ScoreSummaryGrid>

          {/* Components Breakdown */}
          <div>
            <SectionTitle>
              <TrendingUp /> Score Components
            </SectionTitle>
            <ComponentsGrid>
              {components.map((component) => (
                <ComponentCard key={component.name}>
                  <ComponentHeader>
                    <ComponentName>
                      {getComponentIcon(component.name)}
                      {component.name} ({component.weight}%)
                    </ComponentName>
                    <ComponentScore $percentage={component.percentage}>
                      {component.earnedPoints.toFixed(1)}/{component.maxPoints}
                    </ComponentScore>
                  </ComponentHeader>
                  <ProgressBarContainer>
                    <ProgressBarFill
                      $percentage={component.percentage}
                      $color={getProgressColor(component.percentage)}
                    />
                  </ProgressBarContainer>
                  <ComponentDetails>{component.details}</ComponentDetails>
                  <ItemsContainer>
                    {component.matchedItems &&
                      component.matchedItems.length > 0 && (
                        <ItemsList>
                          <ItemsLabel $type="matched">
                            <CheckCircle2 /> Matched
                          </ItemsLabel>
                          <ItemsChips>
                            {component.matchedItems.slice(0, 4).map((item, i) => (
                              <Chip key={i} $type="matched" title={item}>
                                {item}
                              </Chip>
                            ))}
                            {component.matchedItems.length > 4 && (
                              <Chip $type="matched">
                                +{component.matchedItems.length - 4}
                              </Chip>
                            )}
                          </ItemsChips>
                        </ItemsList>
                      )}
                    {component.missingItems &&
                      component.missingItems.length > 0 && (
                        <ItemsList>
                          <ItemsLabel $type="missing">
                            <XCircle /> Missing
                          </ItemsLabel>
                          <ItemsChips>
                            {component.missingItems.slice(0, 4).map((item, i) => (
                              <Chip key={i} $type="missing" title={item}>
                                {item}
                              </Chip>
                            ))}
                            {component.missingItems.length > 4 && (
                              <Chip $type="missing">
                                +{component.missingItems.length - 4}
                              </Chip>
                            )}
                          </ItemsChips>
                        </ItemsList>
                      )}
                  </ItemsContainer>
                </ComponentCard>
              ))}
            </ComponentsGrid>
          </div>

          {/* Penalties Section */}
          <div>
            <SectionTitle>
              <AlertTriangle /> Penalties Applied
            </SectionTitle>
            {breakdown.penalties && breakdown.penalties.length > 0 ? (
              <PenaltiesSection>
                {breakdown.penalties.map((penalty) => (
                  <PenaltyItem key={penalty.id}>
                    <PenaltyIcon $severity={penalty.severity}>
                      <AlertTriangle />
                    </PenaltyIcon>
                    <PenaltyContent>
                      <PenaltyDescription>{penalty.description}</PenaltyDescription>
                      <PenaltyReason>{penalty.reason}</PenaltyReason>
                    </PenaltyContent>
                    <PenaltyPoints>-{penalty.pointsDeducted}</PenaltyPoints>
                  </PenaltyItem>
                ))}
              </PenaltiesSection>
            ) : (
              <NoPenaltiesMessage>
                <CheckCircle2 />
                No penalties applied - great job!
              </NoPenaltiesMessage>
            )}
          </div>

          {/* HR Assessment */}
          <div>
            <SectionTitle>
              <Briefcase /> HR Assessment
            </SectionTitle>
            <AssessmentCard>
              <RecommendationText>
                {breakdown.assessment.recommendation}
              </RecommendationText>
              <PrimaryGap>
                <Target />
                <span>
                  <strong>Primary Gap:</strong> {breakdown.displayData.primaryGap}
                </span>
              </PrimaryGap>
            </AssessmentCard>
          </div>
        </ModalContent>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="primary" onClick={onClose}>
          Got it
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
