'use client';

import styled, { keyframes, css } from 'styled-components';
import { Spinner } from './Spinner';

const pulse = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
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
  max-width: 400px;
  margin: 0 auto;
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
  padding: ${({ theme }) => theme.spacing.md};
  background: ${({ $status, theme }) =>
    $status === 'completed'
      ? 'rgba(16, 185, 129, 0.1)'
      : $status === 'active'
      ? 'var(--primary-50)'
      : theme.colors.backgroundAlt};
  border-radius: ${({ theme }) => theme.radius.md};
  border: 1px solid ${({ $status }) =>
    $status === 'completed'
      ? 'rgba(16, 185, 129, 0.3)'
      : $status === 'active'
      ? 'var(--primary-200)'
      : 'transparent'};
  transition: all 0.3s ease;

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
  background: ${({ $status }) =>
    $status === 'completed'
      ? 'var(--success)'
      : $status === 'active'
      ? 'var(--accent)'
      : '#e5e7eb'};
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
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ $status }) => ($status === 'active' ? '600' : '500')};
  color: ${({ $status, theme }) =>
    $status === 'completed'
      ? 'var(--success)'
      : $status === 'active'
      ? theme.colors.textPrimary
      : theme.colors.textSecondary};
`;

const StepDescription = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-top: 2px;
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 4px;
  background: ${({ theme }) => theme.colors.border};
  border-radius: 2px;
  overflow: hidden;
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const ProgressFill = styled.div<{ $progress: number }>`
  height: 100%;
  width: ${({ $progress }) => $progress}%;
  background: linear-gradient(90deg, var(--accent) 0%, var(--success) 100%);
  border-radius: 2px;
  transition: width 0.5s ease;
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
  { id: 'prepare', label: 'Belgeler hazırlanıyor', description: 'CV ve iş ilanı yükleniyor' },
  { id: 'analyze', label: 'CV analiz ediliyor', description: 'İçerik ve anahtar kelimeler çıkarılıyor' },
  { id: 'compare', label: 'Karşılaştırma yapılıyor', description: 'İş gereksinimleri ile eşleştiriliyor' },
  { id: 'score', label: 'Skor hesaplanıyor', description: 'Uyum puanı belirleniyor' },
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
  title = 'Analiz Yapılıyor',
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
          Tahmini süre: ~{Math.max(1, steps.length - currentStep) * 3} saniye
        </TimeEstimate>
      )}
    </Container>
  );
}
