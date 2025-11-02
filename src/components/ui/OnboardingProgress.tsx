"use client";

import styled from "styled-components";
import { useState } from "react";
import { Card } from "./Card";
import { Button } from "./Button";
import { OnboardingWizard } from "./OnboardingWizard";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/lib/constants";

const ProgressContainer = styled(Card)`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  margin-bottom: ${({ theme }) => theme.spacing["2xl"]};

  * {
    color: white !important;
  }
`;

const ProgressHeader = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const ProgressTitle = styled.h2`
  font-size: ${({ theme }) => theme.typography.fontSize["2xl"]};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

const ProgressSubtitle = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  opacity: 0.9;
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 8px;
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: 999px;
  overflow: hidden;
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const ProgressFill = styled.div<{ $progress: number }>`
  width: ${({ $progress }) => $progress}%;
  height: 100%;
  background-color: white;
  border-radius: 999px;
  transition: width 0.5s ease;
`;

const StepsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const StepItem = styled.div<{ $completed: boolean; $active: boolean }>`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.md};
  background-color: ${({ $completed, $active }) =>
    $completed
      ? "rgba(16, 185, 129, 0.2)"
      : $active
      ? "rgba(255, 255, 255, 0.15)"
      : "rgba(255, 255, 255, 0.05)"};
  border-radius: ${({ theme }) => theme.radius.lg};
  border: 2px solid
    ${({ $completed, $active }) =>
      $completed
        ? "rgba(16, 185, 129, 0.5)"
        : $active
        ? "rgba(255, 255, 255, 0.4)"
        : "transparent"};
  transition: all ${({ theme }) => theme.transitions.normal};
  cursor: ${({ $completed }) => ($completed ? "default" : "pointer")};

  &:hover {
    background-color: ${({ $completed }) =>
      $completed
        ? "rgba(16, 185, 129, 0.25)"
        : "rgba(255, 255, 255, 0.2)"};
  }
`;

const StepIcon = styled.div<{ $completed: boolean; $active: boolean }>`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: ${({ $completed, $active }) =>
    $completed
      ? "#10b981"
      : $active
      ? "rgba(255, 255, 255, 0.3)"
      : "rgba(255, 255, 255, 0.1)"};
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  flex-shrink: 0;
`;

const StepContent = styled.div`
  flex: 1;
`;

const StepTitle = styled.div`
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

const StepDescription = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  opacity: 0.9;
`;

const ActionButton = styled(Button)`
  background-color: white;
  color: #667eea;
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};

  &:hover {
    background-color: rgba(255, 255, 255, 0.9);
  }
`;

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  route: string;
  completed: boolean;
}

interface OnboardingProgressProps {
  hasCVs: boolean;
  hasJobs: boolean;
  hasReports: boolean;
}

export function OnboardingProgress({
  hasCVs,
  hasJobs,
  hasReports,
}: OnboardingProgressProps) {
  const router = useRouter();
  const [isWizardOpen, setIsWizardOpen] = useState(false);

  const steps: OnboardingStep[] = [
    {
      id: "cv",
      title: "Upload Your CV",
      description: "Upload your resume in PDF or DOCX format",
      route: ROUTES.APP.CV,
      completed: hasCVs,
    },
    {
      id: "job",
      title: "Add Job Postings",
      description: "Add job postings you want to apply to",
      route: ROUTES.APP.JOBS,
      completed: hasJobs,
    },
    {
      id: "analyze",
      title: "Create Your First Analysis",
      description: "Generate a CV-job match report to see your fit score",
      route: ROUTES.APP.ANALYZE,
      completed: hasReports,
    },
  ];

  const completedSteps = steps.filter((s) => s.completed).length;
  const totalSteps = steps.length;
  const progress = (completedSteps / totalSteps) * 100;
  const isComplete = completedSteps === totalSteps;

  // Find the next step to complete
  const nextStep = steps.find((s) => !s.completed);

  // Always show the card, but change the messaging if complete
  return (
    <>
      <ProgressContainer variant="elevated">
        <Card.Content>
          <ProgressHeader>
            <ProgressTitle>
              {isComplete ? "✅ Ready to Analyze!" : "🚀 Get Started with Rejectly.pro"}
            </ProgressTitle>
            <ProgressSubtitle>
              {isComplete
                ? "You're all set! Use the guided setup to create new analyses anytime"
                : "Complete these steps to maximize your job search success"}
            </ProgressSubtitle>
          </ProgressHeader>

          <ProgressBar>
            <ProgressFill $progress={progress} />
          </ProgressBar>

          <div style={{ marginBottom: "16px", fontSize: "14px", opacity: 0.9 }}>
            {completedSteps} of {totalSteps} steps completed ({Math.round(progress)}%)
          </div>

          {!isComplete && (
            <StepsList>
              {steps.map((step, index) => {
                const isActive = !step.completed && step.id === nextStep?.id;
                return (
                  <StepItem
                    key={step.id}
                    $completed={step.completed}
                    $active={isActive}
                    onClick={() => !step.completed && router.push(step.route)}
                  >
                    <StepIcon $completed={step.completed} $active={isActive}>
                      {step.completed ? "✓" : index + 1}
                    </StepIcon>
                    <StepContent>
                      <StepTitle>{step.title}</StepTitle>
                      <StepDescription>{step.description}</StepDescription>
                    </StepContent>
                  </StepItem>
                );
              })}
            </StepsList>
          )}

          <div style={{ display: "flex", gap: "12px" }}>
            <ActionButton
              size="lg"
              onClick={() => setIsWizardOpen(true)}
              style={{ flex: 1 }}
            >
              🚀 {isComplete ? "New Guided Analysis" : "Start Guided Setup"}
            </ActionButton>
            {nextStep && (
              <Button
                variant="ghost"
                size="lg"
                onClick={() => router.push(nextStep.route)}
                style={{ flex: 1, color: "white", borderColor: "white" }}
              >
                {nextStep.id === "cv"
                  ? "Or Upload Manually"
                  : nextStep.id === "job"
                  ? "Or Add Job"
                  : "Or Create Analysis"}
              </Button>
            )}
          </div>
        </Card.Content>
      </ProgressContainer>

      <OnboardingWizard
        isOpen={isWizardOpen}
        onClose={() => setIsWizardOpen(false)}
        onComplete={() => {
          setIsWizardOpen(false);
          window.location.reload(); // Refresh to update progress
        }}
      />
    </>
  );
}
