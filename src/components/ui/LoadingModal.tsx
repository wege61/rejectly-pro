'use client';

import styled, { keyframes, css } from 'styled-components';
import { createPortal } from 'react-dom';
import { useEffect, useState } from 'react';

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const slideUp = keyframes`
  from {
    transform: translateY(20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
`;

const spin = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

const progressPulse = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

const messageSlideIn = keyframes`
  0% {
    opacity: 0;
    transform: translateY(8px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
`;

const messageSlideOut = keyframes`
  0% {
    opacity: 1;
    transform: translateY(0);
  }
  100% {
    opacity: 0;
    transform: translateY(-8px);
  }
`;

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  animation: ${fadeIn} 0.2s ease-out;
`;

const ModalContent = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.xl};
  padding: ${({ theme }) => theme.spacing['2xl']};
  max-width: 400px;
  width: 90%;
  text-align: center;
  animation: ${slideUp} 0.3s ease-out;
`;

const SpinnerContainer = styled.div`
  width: 64px;
  height: 64px;
  margin: 0 auto ${({ theme }) => theme.spacing.xl};
  position: relative;
`;

const SpinnerRing = styled.div`
  position: absolute;
  inset: 0;
  border: 3px solid ${({ theme }) => theme.colors.border};
  border-top-color: ${({ theme }) => theme.colors.primary};
  border-radius: 50%;
  animation: ${spin} 0.8s linear infinite;
`;

const SpinnerInner = styled.div`
  position: absolute;
  inset: 10px;
  background: ${({ theme }) => theme.colors.backgroundAlt};
  border-radius: 50%;
`;

const Title = styled.h3`
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.textPrimary};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const MessageContainer = styled.div`
  min-height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const Message = styled.p<{ $isExiting: boolean }>`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
  line-height: 1.5;
  margin: 0;

  ${({ $isExiting }) => $isExiting
    ? css`animation: ${messageSlideOut} 0.25s ease-in forwards;`
    : css`animation: ${messageSlideIn} 0.25s ease-out forwards;`
  }
`;

const ProgressBar = styled.div`
  height: 4px;
  background: ${({ theme }) => theme.colors.border};
  border-radius: 2px;
  overflow: hidden;
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const ProgressFill = styled.div`
  height: 100%;
  width: 100%;
  background: linear-gradient(
    90deg,
    ${({ theme }) => theme.colors.primary},
    ${({ theme }) => theme.colors.primaryLight},
    ${({ theme }) => theme.colors.primary}
  );
  background-size: 200% 100%;
  animation: ${progressPulse} 1.5s ease-in-out infinite;
  border-radius: 2px;
`;

const StepsContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.lg};
`;

const Step = styled.div<{ $active?: boolean; $completed?: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  opacity: ${({ $active, $completed }) => ($active || $completed ? 1 : 0.4)};
  transition: opacity 0.3s ease;
`;

const StepIcon = styled.div<{ $active?: boolean; $completed?: boolean }>`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: ${({ $active, $completed, theme }) =>
    $completed
      ? 'var(--success)'
      : $active
      ? theme.colors.primary
      : theme.colors.border};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ $active, $completed }) => ($active || $completed ? 'white' : 'inherit')};
  font-size: 14px;
  font-weight: 600;
  transition: all 0.3s ease;
`;

const StepLabel = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const CheckIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

export interface LoadingStep {
  label: string;
  completed?: boolean;
  active?: boolean;
}

interface LoadingModalProps {
  isOpen: boolean;
  title: string;
  subtitle?: string;
  messages?: string[];
  showProgress?: boolean;
  steps?: LoadingStep[];
  messageInterval?: number;
}

export function LoadingModal({
  isOpen,
  title,
  subtitle,
  messages,
  showProgress = true,
  steps,
  messageInterval = 2500,
}: LoadingModalProps) {
  const [mounted, setMounted] = useState(false);
  const [messageIndex, setMessageIndex] = useState(0);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  // Reset message index when modal opens
  useEffect(() => {
    if (isOpen) {
      setMessageIndex(0);
      setIsExiting(false);
    }
  }, [isOpen]);

  // Cycle through messages with animation
  useEffect(() => {
    if (!isOpen || !messages || messages.length <= 1) return;

    const interval = setInterval(() => {
      setIsExiting(true);

      setTimeout(() => {
        setMessageIndex((prev) => (prev + 1) % messages.length);
        setIsExiting(false);
      }, 250);
    }, messageInterval);

    return () => clearInterval(interval);
  }, [isOpen, messages, messageInterval]);

  if (!isOpen || !mounted) return null;

  const currentMessage = messages ? messages[messageIndex] : subtitle;

  const content = (
    <Overlay>
      <ModalContent>
        <SpinnerContainer>
          <SpinnerRing />
          <SpinnerInner />
        </SpinnerContainer>

        <Title>{title}</Title>

        {currentMessage && (
          <MessageContainer>
            <Message key={messageIndex} $isExiting={isExiting}>
              {currentMessage}
            </Message>
          </MessageContainer>
        )}

        {showProgress && (
          <ProgressBar>
            <ProgressFill />
          </ProgressBar>
        )}

        {steps && steps.length > 0 && (
          <StepsContainer>
            {steps.map((step, index) => (
              <Step key={index} $active={step.active} $completed={step.completed}>
                <StepIcon $active={step.active} $completed={step.completed}>
                  {step.completed ? <CheckIcon /> : index + 1}
                </StepIcon>
                <StepLabel>{step.label}</StepLabel>
              </Step>
            ))}
          </StepsContainer>
        )}
      </ModalContent>
    </Overlay>
  );

  return createPortal(content, document.body);
}
