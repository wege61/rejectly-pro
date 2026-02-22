'use client';

import styled from 'styled-components';
import { useRouter } from 'next/navigation';
import { useCredits } from '@/contexts/CreditsContext';
import { ROUTES } from '@/lib/constants';

type CreditVariant = 'pro' | 'empty' | 'low' | 'medium' | 'high';

const getBackgroundColor = (variant: CreditVariant): string => {
  switch (variant) {
    case 'pro':
      return 'linear-gradient(135deg, rgba(5, 150, 105, 0.6) 0%, rgba(16, 185, 129, 0.2) 100%)';
    case 'empty':
      return 'linear-gradient(135deg, rgba(249, 115, 22, 0.6) 0%, rgba(251, 146, 60, 0.2) 100%)';
    case 'low':
      return 'linear-gradient(135deg, rgba(234, 179, 8, 0.6) 0%, rgba(250, 204, 21, 0.2) 100%)';
    case 'medium':
      return 'linear-gradient(135deg, rgba(42, 87, 160, 0.6) 0%, rgba(59, 130, 246, 0.2) 100%)';
    case 'high':
      return 'linear-gradient(135deg, rgba(53, 162, 159, 0.6) 0%, rgba(94, 234, 212, 0.2) 100%)';
  }
};

const getCreditVariant = (credits: number): CreditVariant => {
  if (credits === 0) return 'empty';
  if (credits <= 3) return 'low';
  if (credits <= 5) return 'medium';
  return 'high';
};

const CardWrapper = styled.div<{ $variant: CreditVariant }>`
  display: inline-flex;
  align-items: center;
  border-radius: 100px; /* Pill shape */
  padding: 6px 6px 6px 20px;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: ${({ $variant }) => getBackgroundColor($variant)};
  backdrop-filter: blur(40px) saturate(150%);
  -webkit-backdrop-filter: blur(40px) saturate(150%);
  transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.4s cubic-bezier(0.16, 1, 0.3, 1);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 12px 32px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.3);
  }
`;

const CardContent = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const IconWrapper = styled.div`
  color: rgba(255, 255, 255, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;

  svg {
    width: 20px;
    height: 20px;
  }
`;

const ValueText = styled.div`
  font-size: 16px;
  font-weight: 700;
  color: white;
  letter-spacing: -0.02em;
`;

const TitleText = styled.div`
  font-size: 14px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.8);
  letter-spacing: -0.01em;
  margin-right: 8px;

  @media (max-width: 640px) {
    display: none;
  }
`;

const ActionButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 100px;
  padding: 8px 16px;
  color: white;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.25);
    transform: scale(1.02);
  }

  @media (max-width: 640px) {
    padding: 8px;
    span {
      display: none;
    }
  }
`;

const ActionButtonText = styled.span`
  margin-right: 4px;
`;

const ArrowIcon = styled.div`
  color: white;
  display: flex;
  align-items: center;
  transition: transform 0.3s ease;

  svg {
    width: 18px;
    height: 18px;
  }

  @media (max-width: 640px) {
    svg {
      width: 16px;
      height: 16px;
    }
  }
`;

const SkeletonWrapper = styled.div`
  min-width: 180px;
  height: 100px;
  border-radius: 16px;
  background: linear-gradient(135deg, #e5e7eb 0%, #d1d5db 100%);
  animation: pulse 1.5s ease-in-out infinite;

  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
  }

  @media (max-width: 640px) {
    min-width: 160px;
    height: 90px;
  }
`;

const CoinIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8" />
    <path d="M12 18V6" />
  </svg>
);

const CheckIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </svg>
);

const ArrowRightIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14M12 5l7 7-7 7" />
  </svg>
);

export function CreditsCard() {
  const router = useRouter();
  const { credits: userCredits, isLoading } = useCredits();

  if (isLoading) {
    return <SkeletonWrapper />;
  }

  const isPro = userCredits.hasSubscription;
  const variant: CreditVariant = isPro ? 'pro' : getCreditVariant(userCredits.credits);

  return (
    <CardWrapper $variant={variant}>
      <CardContent>
        <IconWrapper>
          {isPro ? <CheckIcon /> : <CoinIcon />}
        </IconWrapper>
        <ValueText>
          {isPro ? 'Pro' : userCredits.credits}
        </ValueText>
        <TitleText>
          {isPro ? 'Unlimited' : 'Credits'}
        </TitleText>
      </CardContent>
      <ActionButton onClick={() => router.push(ROUTES.APP.BILLING)}>
        <ActionButtonText>{isPro ? 'Manage' : 'Get More'}</ActionButtonText>
        <ArrowRightIcon />
      </ActionButton>
    </CardWrapper>
  );
}
