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

const Banner = styled.div<{ $variant: 'warning' | 'danger' }>`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => `${theme.spacing.sm} ${theme.spacing.lg}`};
  background: ${({ $variant }) =>
    $variant === 'danger'
      ? 'linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%)'
      : 'linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)'};
  border-bottom: 1px solid ${({ $variant }) =>
    $variant === 'danger' ? '#fecaca' : '#fde68a'};
  animation: ${css`${slideDown}`} 0.3s ease-out;

  @media (max-width: 640px) {
    flex-direction: column;
    text-align: center;
    gap: ${({ theme }) => theme.spacing.sm};
    padding: ${({ theme }) => theme.spacing.md};
  }
`;

const BannerContent = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const BannerIcon = styled.span`
  font-size: 18px;
`;

const BannerText = styled.span<{ $variant: 'warning' | 'danger' }>`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  color: ${({ $variant }) => ($variant === 'danger' ? '#991b1b' : '#92400e')};
`;

const BannerButton = styled.button<{ $variant: 'warning' | 'danger' }>`
  padding: ${({ theme }) => `${theme.spacing.xs} ${theme.spacing.md}`};
  background: ${({ $variant }) => ($variant === 'danger' ? '#dc2626' : '#f59e0b')};
  color: white;
  border: none;
  border-radius: ${({ theme }) => theme.radius.md};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;

  &:hover {
    background: ${({ $variant }) => ($variant === 'danger' ? '#b91c1c' : '#d97706')};
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }
`;

const CreditsCount = styled.span<{ $variant: 'warning' | 'danger' }>`
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ $variant }) => ($variant === 'danger' ? '#dc2626' : '#d97706')};
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
        <BannerIcon>{isDanger ? '🚫' : '⚠️'}</BannerIcon>
        <BannerText $variant={variant}>
          {isDanger ? (
            <>You're out of credits! Buy credits to continue analyzing.</>
          ) : (
            <>
              Only <CreditsCount $variant={variant}>{credits.credits}</CreditsCount> credit{credits.credits !== 1 ? 's' : ''} left.
              {credits.credits === 1 ? ' Use your last credit wisely!' : ' Get more credits to continue seamlessly.'}
            </>
          )}
        </BannerText>
      </BannerContent>
      <BannerButton $variant={variant} onClick={() => router.push(ROUTES.APP.BILLING)}>
        {isDanger ? 'Buy Credits' : 'Get Credits'}
      </BannerButton>
    </Banner>
  );
}
