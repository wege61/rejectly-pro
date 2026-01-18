'use client';

import styled from 'styled-components';
import { useRouter } from 'next/navigation';
import { useCredits } from '@/contexts/CreditsContext';
import { ROUTES } from '@/lib/constants';

const CardWrapper = styled.div<{ $variant: 'credits' | 'pro' }>`
  display: flex;
  flex-direction: column;
  border-radius: 14px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  min-width: 180px;
  background: ${({ $variant }) =>
    $variant === 'pro'
      ? 'linear-gradient(135deg, #059669 0%, #10b981 100%)'
      : 'linear-gradient(135deg, #4f46e5 0%, #6366f1 100%)'
  };

  @media (max-width: 640px) {
    min-width: 160px;
  }
`;

const CardContent = styled.div`
  padding: 12px 16px;
  display: flex;
  flex-direction: column;
  gap: 2px;

  @media (max-width: 640px) {
    padding: 10px 14px;
  }
`;

const IconWrapper = styled.div`
  color: rgba(255, 255, 255, 0.6);
  margin-bottom: 2px;

  svg {
    width: 20px;
    height: 20px;
  }

  @media (max-width: 640px) {
    svg {
      width: 18px;
      height: 18px;
    }
  }
`;

const ValueText = styled.div`
  font-size: 26px;
  font-weight: 700;
  color: white;
  line-height: 1;

  @media (max-width: 640px) {
    font-size: 22px;
  }
`;

const TitleText = styled.div`
  font-size: 12px;
  font-weight: 600;
  color: white;

  @media (max-width: 640px) {
    font-size: 11px;
  }
`;

const BottomBar = styled.button`
  width: 100%;
  background: rgba(0, 0, 0, 0.85);
  padding: 10px 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border: none;
  cursor: pointer;
  transition: background 0.2s ease;

  &:hover {
    background: rgba(0, 0, 0, 0.95);
  }

  &:hover svg {
    transform: translateX(4px);
  }

  @media (max-width: 640px) {
    padding: 8px 14px;
  }
`;

const BottomBarText = styled.span`
  font-size: 13px;
  font-weight: 500;
  color: white;

  @media (max-width: 640px) {
    font-size: 11px;
  }
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

  return (
    <CardWrapper $variant={isPro ? 'pro' : 'credits'}>
      <CardContent>
        <IconWrapper>
          {isPro ? <CheckIcon /> : <CoinIcon />}
        </IconWrapper>
        <ValueText>
          {isPro ? 'Pro' : userCredits.credits}
        </ValueText>
        <TitleText>
          {isPro ? 'Unlimited Access' : 'Credits Left'}
        </TitleText>
      </CardContent>
      <BottomBar onClick={() => router.push(ROUTES.APP.BILLING)}>
        <BottomBarText>
          {isPro ? 'Manage subscription' : 'Get more credits'}
        </BottomBarText>
        <ArrowIcon>
          <ArrowRightIcon />
        </ArrowIcon>
      </BottomBar>
    </CardWrapper>
  );
}
