'use client';

import styled, { keyframes, css } from 'styled-components';
import { useRouter } from 'next/navigation';
import { useCredits } from '@/contexts/CreditsContext';
import { ROUTES } from '@/lib/constants';

const slideDown = keyframes`
  from {
    transform: translateY(-100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
`;

const shimmer = keyframes`
  0% { transform: translateX(-100%); }
  100% { transform: translateX(200%); }
`;

const Banner = styled.div<{ $variant: 'warning' | 'danger' }>`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.lg};
  padding: ${({ theme }) => `${theme.spacing.sm} ${theme.spacing.xl}`};
  margin-bottom: ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.radius.xl};
  overflow: hidden;
  
  /* Ultra-Refined Apple Frosted Glass */
  background: ${({ $variant }) =>
    $variant === 'danger'
      ? 'rgba(239, 68, 68, 0.03)'
      : 'rgba(245, 158, 11, 0.03)'};
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  
  /* Delicate Borders & Inner Shadow for depth */
  border: 1px solid ${({ $variant }) =>
    $variant === 'danger' ? 'rgba(239, 68, 68, 0.15)' : 'rgba(245, 158, 11, 0.15)'};
  box-shadow: 
    0 4px 32px rgba(0, 0, 0, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.05);
  
  animation: ${css`${slideDown}`} 0.4s cubic-bezier(0.16, 1, 0.3, 1);

  /* Shimmer effect overlay for premium feel */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 50%;
    height: 100%;
    background: linear-gradient(
      to right,
      transparent 0%,
      ${({ $variant }) => $variant === 'danger' ? 'rgba(239, 68, 68, 0.03)' : 'rgba(245, 158, 11, 0.03)'} 50%,
      transparent 100%
    );
    transform: skewX(-20deg);
    animation: ${shimmer} 6s infinite;
    pointer-events: none;
  }

  @media (max-width: 640px) {
    flex-direction: column;
    gap: 16px;
    padding: 20px 16px;
    text-align: center;
    border-radius: 0;
    margin-bottom: 0;
    border-left: none;
    border-right: none;
  }
`;

const BannerContent = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  z-index: 1; /* Above shimmer */

  @media (max-width: 640px) {
    flex-direction: column;
    gap: 8px;
  }
`;

const BannerIconWrapper = styled.div<{ $variant: 'warning' | 'danger' }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: ${({ $variant }) => 
    $variant === 'danger' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(245, 158, 11, 0.1)'};
  border: 1px solid ${({ $variant }) => 
    $variant === 'danger' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(245, 158, 11, 0.2)'};

  @media (max-width: 640px) {
    width: 40px;
    height: 40px;
    margin-bottom: 4px;
  }
`;

const BannerIcon = styled.span`
  font-size: 16px;
  line-height: 1;

  @media (max-width: 640px) {
    font-size: 20px;
  }
`;

const BannerText = styled.span`
  font-size: 14px;
  font-weight: 400;
  letter-spacing: -0.01em;
  color: ${({ theme }) => theme.colors.textPrimary};
  opacity: 0.9;

  @media (max-width: 640px) {
    font-size: 14px;
    line-height: 1.5;
  }
`;

const BannerButton = styled.button<{ $variant: 'warning' | 'danger' }>`
  position: relative;
  overflow: hidden;
  padding: 8px 18px;
  background: ${({ $variant }) => 
    $variant === 'danger' 
      ? 'rgba(239, 68, 68, 0.1)' 
      : 'rgba(245, 158, 11, 0.1)'};
  color: ${({ $variant }) => 
    $variant === 'danger' ? '#fca5a5' : '#fcd34d'};
  border: 1px solid ${({ $variant }) => 
    $variant === 'danger' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(245, 158, 11, 0.2)'};
  border-radius: 100px; /* Pill shape */
  font-size: 13px;
  font-weight: 500;
  letter-spacing: 0.02em;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  white-space: nowrap;
  z-index: 1;

  &:hover {
    transform: translateY(-1px);
    background: ${({ $variant }) => 
      $variant === 'danger' 
        ? 'rgba(239, 68, 68, 0.2)' 
        : 'rgba(245, 158, 11, 0.2)'};
    color: white;
    border-color: ${({ $variant }) => 
      $variant === 'danger' ? 'rgba(239, 68, 68, 0.4)' : 'rgba(245, 158, 11, 0.4)'};
    box-shadow: 0 4px 12px ${({ $variant }) => 
      $variant === 'danger' ? 'rgba(239, 68, 68, 0.15)' : 'rgba(245, 158, 11, 0.15)'};
  }

  &:active {
    transform: translateY(1px);
  }

  @media (max-width: 640px) {
    width: 100%;
    padding: 12px;
    font-size: 14px;
    font-weight: 600;
    margin-top: 4px;
  }
`;

const CreditsCount = styled.span<{ $variant: 'warning' | 'danger' }>`
  font-weight: 600;
  color: ${({ $variant }) => ($variant === 'danger' ? '#ef4444' : '#f59e0b')};
`;

interface CreditWarningBannerProps {
  threshold?: number; // Show warning at or below this credit count
  className?: string;
}

export function CreditWarningBanner({ threshold = 3, className }: CreditWarningBannerProps) {
  const router = useRouter();
  const { credits, isLoading } = useCredits();

  // Don't show for subscribers or while loading
  if (isLoading || credits.hasSubscription) {
    return null;
  }

  // Don't show if credits are above threshold
  if (credits.credits > threshold) {
    return null;
  }

  const isDanger = credits.credits === 0;
  const variant = isDanger ? 'danger' : 'warning';

  return (
    <Banner $variant={variant} className={className}>
      <BannerContent>
        <BannerIconWrapper $variant={variant}>
          <BannerIcon>{isDanger ? '🚫' : '⚠️'}</BannerIcon>
        </BannerIconWrapper>
        <BannerText>
          {isDanger ? (
            <>You've run out of credits. <CreditsCount $variant={variant}>Refill required</CreditsCount> to continue using the Optimizer.</>
          ) : (
            <>
              You have <CreditsCount $variant={variant}>{credits.credits}</CreditsCount> credit{credits.credits !== 1 ? 's' : ''} remaining.
              {credits.credits === 1 ? ' Use it wisely or top up now.' : ' Consider refilling soon to prevent interruptions.'}
            </>
          )}
        </BannerText>
      </BannerContent>
      <BannerButton $variant={variant} onClick={() => router.push(ROUTES.APP.BILLING)}>
        {isDanger ? 'Refill Credits' : 'Get More Credits'}
      </BannerButton>
    </Banner>
  );
}
