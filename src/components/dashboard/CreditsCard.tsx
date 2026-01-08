'use client';

import styled from 'styled-components';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useCredits } from '@/contexts/CreditsContext';
import { ROUTES } from '@/lib/constants';

const StyledCreditsCard = styled(Card)`
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  background: linear-gradient(135deg, var(--primary-50) 0%, var(--primary-100) 100%);
  border: 1px solid var(--primary-200);
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
`;

const CreditsValue = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSize['3xl']};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: var(--accent);
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

  if (isLoading) {
    return <CreditsCardSkeleton />;
  }

  return (
    <StyledCreditsCard variant="elevated">
      <CreditsContent>
        <CreditsInfo>
          {userCredits.hasSubscription ? (
            <SubscriptionBadge>
              ✓ Pro Subscription Active
            </SubscriptionBadge>
          ) : (
            <CreditsNumber>
              <CreditsValue>{userCredits.credits}</CreditsValue>
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
