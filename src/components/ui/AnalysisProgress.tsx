'use client';

import styled, { keyframes, css } from 'styled-components';
import { Spinner } from './Spinner';

const pulse = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
`;

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

const checkmark = keyframes`
  0% { transform: scale(0); }
  50% { transform: scale(1.2); }
  100% { transform: scale(1); }
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: ${({ theme }) => theme.spacing['2xl']};
  width: 100%;
  max-width: 440px;
  margin: 0 auto;
  animation: ${fadeIn} 0.5s cubic-bezier(0.16, 1, 0.3, 1);
`;

const Title = styled.h3`
  font-size: ${({ theme }) => theme.typography.fontSize.xl};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.textPrimary};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  text-align: center;
`;

const StepsContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const StepItem = styled.div<{ $status: 'pending' | 'active' | 'completed' }>`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.lg};
  background: ${({ $status, theme }) =>
    $status === 'completed'
      ? 'rgba(16, 185, 129, 0.05)'
      : $status === 'active'
      ? `rgba(${theme.colors.primary}, 0.08)`
      : 'rgba(255, 255, 255, 0.02)'};
  border-radius: ${({ theme }) => theme.radius.xl};
  border: 1px solid ${({ $status, theme }) =>
    $status === 'completed'
      ? 'rgba(16, 185, 129, 0.2)'
      : $status === 'active'
      ? `rgba(${theme.colors.primary}, 0.3)`
      : 'rgba(255, 255, 255, 0.05)'};
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  backdrop-filter: blur(10px);
  position: relative;
  overflow: hidden;

  ${({ $status, theme }) =>
    $status === 'active' &&
    css`
      box-shadow: 0 0 20px -5px ${theme.colors.primary}40;
      transform: translateY(-2px);
    `}

  ${({ $status }) =>
    $status === 'active' &&
    css`
      animation: ${pulse} 1.5s ease-in-out infinite;
    `}
`;

const StepIndicator = styled.div<{ $status: 'pending' | 'active' | 'completed' }>`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  background: ${({ $status, theme }) =>
    $status === 'completed'
      ? theme.colors.success
      : $status === 'active'
      ? theme.colors.primary
      : theme.colors.surface};
  color: ${({ $status }) => ($status === 'pending' ? '#9ca3af' : 'white')};
  font-size: 14px;
  font-weight: 600;
  transition: all 0.3s ease;

  ${({ $status }) =>
    $status === 'completed' &&
    css`
      animation: ${checkmark} 0.3s ease-out;
    `}
`;

const StepContent = styled.div`
  flex: 1;
`;

const StepLabel = styled.div<{ $status: 'pending' | 'active' | 'completed' }>`
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  font-weight: ${({ $status }) => ($status === 'active' ? '600' : '500')};
  color: ${({ $status, theme }) =>
    $status === 'completed'
      ? theme.colors.success
      : $status === 'active'
      ? theme.colors.primary
      : theme.colors.textSecondary};
  transition: color 0.3s ease;
`;

const StepDescription = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-top: 2px;
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 6px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 3px;
  overflow: hidden;
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const ProgressFill = styled.div<{ $progress: number }>`
  height: 100%;
  width: ${({ $progress }) => $progress}%;
  background: linear-gradient(90deg, ${({ theme }) => theme.colors.primary} 0%, ${({ theme }) => theme.colors.success} 100%);
  border-radius: 3px;
  transition: width 0.8s cubic-bezier(0.16, 1, 0.3, 1);
  box-shadow: 0 0 10px ${({ theme }) => theme.colors.primary}80;
`;

const TimeEstimate = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
  text-align: center;
`;

const CheckIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

interface AnalysisStep {
  id: string;
  label: string;
  description?: string;
}

const DEFAULT_STEPS: AnalysisStep[] = [
  { id: 'prepare', label: 'Preparing documents', description: 'Loading CV and job posting' },
  { id: 'analyze', label: 'Analyzing CV', description: 'Extracting content and keywords' },
  { id: 'compare', label: 'Comparing', description: 'Matching with job requirements' },
  { id: 'score', label: 'Calculating score', description: 'Determining match score' },
];

interface AnalysisProgressProps {
  currentStep: number; // 0-indexed
  steps?: AnalysisStep[];
  title?: string;
  showTimeEstimate?: boolean;
}

export function AnalysisProgress({
  currentStep,
  steps = DEFAULT_STEPS,
  title = 'Analyzing',
  showTimeEstimate = true,
}: AnalysisProgressProps) {
  const progress = Math.min(((currentStep + 1) / steps.length) * 100, 100);

  const getStepStatus = (index: number): 'pending' | 'active' | 'completed' => {
    if (index < currentStep) return 'completed';
    if (index === currentStep) return 'active';
    return 'pending';
  };

  return (
    <Container>
      <Title>{title}</Title>

      <ProgressBar>
        <ProgressFill $progress={progress} />
      </ProgressBar>

      <StepsContainer>
        {steps.map((step, index) => {
          const status = getStepStatus(index);
          return (
            <StepItem key={step.id} $status={status}>
              <StepIndicator $status={status}>
                {status === 'completed' ? (
                  <CheckIcon />
                ) : status === 'active' ? (
                  <Spinner size="sm" />
                ) : (
                  index + 1
                )}
              </StepIndicator>
              <StepContent>
                <StepLabel $status={status}>{step.label}</StepLabel>
                {step.description && status === 'active' && (
                  <StepDescription>{step.description}</StepDescription>
                )}
              </StepContent>
            </StepItem>
          );
        })}
      </StepsContainer>

      {showTimeEstimate && (
        <TimeEstimate>
          Estimated time: ~{Math.max(1, steps.length - currentStep) * 3} seconds
        </TimeEstimate>
      )}
    </Container>
  );
}
