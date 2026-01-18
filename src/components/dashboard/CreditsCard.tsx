'use client';

import styled, { keyframes, css } from 'styled-components';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useCredits } from '@/contexts/CreditsContext';
import { ROUTES } from '@/lib/constants';

const pulseGlow = keyframes`
  0% {
    transform: scale(1);
    box-shadow: 0 0 0 0 rgba(99, 102, 241, 0.4);
  }
  50% {
    transform: scale(1.02);
    box-shadow: 0 0 20px 10px rgba(99, 102, 241, 0.2);
  }
  100% {
    transform: scale(1);
    box-shadow: 0 0 0 0 rgba(99, 102, 241, 0);
  }
`;

const countChange = keyframes`
  0% {
    transform: scale(1.3);
    color: #ef4444;
  }
  50% {
    transform: scale(1.1);
    color: #f59e0b;
  }
  100% {
    transform: scale(1);
    color: var(--accent);
  }
`;

const coinDrop = keyframes`
  0% {
    transform: translateY(-10px);
    opacity: 0;
  }
  50% {
    transform: translateY(5px);
    opacity: 1;
  }
  100% {
    transform: translateY(0);
    opacity: 1;
  }
`;

const StyledCreditsCard = styled(Card)<{ $isAnimating?: boolean }>`
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  background: linear-gradient(135deg, var(--primary-50) 0%, var(--primary-100) 100%);
  border: 1px solid var(--primary-200);
  transition: all 0.3s ease;

  ${({ $isAnimating }) => $isAnimating && css`
    animation: ${pulseGlow} 0.8s ease-out;
  `}
`;

const CreditsContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.md};
`;

const CreditsInfo = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.lg};
`;

const CreditsNumber = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
`;

const CoinIcon = styled.span<{ $isAnimating?: boolean }>`
  display: inline-block;
  margin-right: 8px;
  font-size: 24px;

  ${({ $isAnimating }) => $isAnimating && css`
    animation: ${coinDrop} 0.5s ease-out;
  `}
`;

const CreditsValue = styled.span<{ $isAnimating?: boolean }>`
  font-size: ${({ theme }) => theme.typography.fontSize['3xl']};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: var(--accent);
  display: flex;
  align-items: center;
  transition: color 0.3s ease;

  ${({ $isAnimating }) => $isAnimating && css`
    animation: ${countChange} 0.8s ease-out;
  `}
`;

const CreditsLabel = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const SubscriptionBadge = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  padding: ${({ theme }) => `${theme.spacing.xs} ${theme.spacing.md}`};
  background: var(--success);
  color: white;
  border-radius: ${({ theme }) => theme.radius.full};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
`;

const LowCreditsWarning = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  color: #f59e0b;
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
`;

const CreditsCardSkeleton = styled.div`
  height: 80px;
  background: linear-gradient(135deg, var(--primary-50) 0%, var(--primary-100) 100%);
  border: 1px solid var(--primary-200);
  border-radius: ${({ theme }) => theme.radius.lg};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  animation: pulse 1.5s ease-in-out infinite;

  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.6; }
  }
`;

export function CreditsCard() {
  const router = useRouter();
  const { credits: userCredits, isLoading } = useCredits();
  const [isAnimating, setIsAnimating] = useState(false);
  const prevCreditsRef = useRef(userCredits.credits);

  // Trigger animation when credits change
  useEffect(() => {
    if (prevCreditsRef.current !== userCredits.credits && !userCredits.hasSubscription) {
      setIsAnimating(true);
      const timer = setTimeout(() => {
        setIsAnimating(false);
      }, 800);
      prevCreditsRef.current = userCredits.credits;
      return () => clearTimeout(timer);
    }
  }, [userCredits.credits, userCredits.hasSubscription]);

  if (isLoading) {
    return <CreditsCardSkeleton />;
  }

  return (
    <StyledCreditsCard variant="elevated" $isAnimating={isAnimating}>
      <CreditsContent>
        <CreditsInfo>
          {userCredits.hasSubscription ? (
            <SubscriptionBadge>
              ✓ Pro Subscription Active
            </SubscriptionBadge>
          ) : (
            <CreditsNumber>
              <CreditsValue $isAnimating={isAnimating}>
                <CoinIcon $isAnimating={isAnimating}>🪙</CoinIcon>
                {userCredits.credits}
              </CreditsValue>
              <CreditsLabel>Credits remaining</CreditsLabel>
            </CreditsNumber>
          )}
          {!userCredits.hasSubscription && userCredits.credits <= 2 && userCredits.credits > 0 && (
            <LowCreditsWarning>
              ⚠ Running low on credits
            </LowCreditsWarning>
          )}
        </CreditsInfo>
        {!userCredits.hasSubscription && (
          <Button
            size="sm"
            onClick={() => router.push(ROUTES.APP.BILLING)}
          >
            {userCredits.credits === 0 ? 'Buy Credits' : 'Get More Credits'}
          </Button>
        )}
      </CreditsContent>
    </StyledCreditsCard>
  );
}
