'use client';

import styled, { keyframes } from 'styled-components';
import { createPortal } from 'react-dom';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { PRICING, ROUTES } from '@/lib/constants';

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const slideUp = keyframes`
  from {
    transform: translateY(30px) scale(0.95);
    opacity: 0;
  }
  to {
    transform: translateY(0) scale(1);
    opacity: 1;
  }
`;

const float = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-8px); }
`;

const sparkle = keyframes`
  0%, 100% { opacity: 0.3; transform: scale(0.8); }
  50% { opacity: 1; transform: scale(1.2); }
`;

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  animation: ${fadeIn} 0.25s ease-out;
  padding: ${({ theme }) => theme.spacing.lg};
  overflow-y: auto;
`;

const ModalContent = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.xl};
  padding: ${({ theme }) => theme.spacing['2xl']};
  max-width: 720px;
  width: 100%;
  text-align: center;
  animation: ${slideUp} 0.35s ease-out;
  position: relative;
  overflow: hidden;

  @media (max-width: 768px) {
    padding: ${({ theme }) => theme.spacing.xl};
    max-width: 100%;
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 16px;
  right: 16px;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.backgroundAlt};
  border: 1px solid ${({ theme }) => theme.colors.border};
  color: ${({ theme }) => theme.colors.textSecondary};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  z-index: 1;

  &:hover {
    background: ${({ theme }) => theme.colors.surfaceHover};
    color: ${({ theme }) => theme.colors.textPrimary};
    transform: scale(1.05);
  }

  svg {
    width: 18px;
    height: 18px;
  }
`;

const IconContainer = styled.div`
  width: 80px;
  height: 80px;
  margin: 0 auto ${({ theme }) => theme.spacing.lg};
  background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: ${float} 3s ease-in-out infinite;
  position: relative;

  &::before,
  &::after {
    content: '';
    position: absolute;
    width: 12px;
    height: 12px;
    background: #fbbf24;
    border-radius: 50%;
    animation: ${sparkle} 2s ease-in-out infinite;
  }

  &::before {
    top: -5px;
    right: -5px;
    animation-delay: 0.3s;
  }

  &::after {
    bottom: 0;
    left: -8px;
    width: 8px;
    height: 8px;
    animation-delay: 0.7s;
  }
`;

const CoinIcon = () => (
  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#b45309" strokeWidth="2">
    <circle cx="12" cy="12" r="10" />
    <path d="M12 6v12M9 9h6M9 15h6" strokeLinecap="round" />
  </svg>
);

const Title = styled.h2`
  font-size: ${({ theme }) => theme.typography.fontSize['2xl']};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.textPrimary};
  margin-bottom: ${({ theme }) => theme.spacing.sm};

  @media (max-width: 768px) {
    font-size: ${({ theme }) => theme.typography.fontSize.xl};
  }
`;

const Subtitle = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  max-width: 400px;
  margin-left: auto;
  margin-right: auto;
  line-height: 1.6;

  @media (max-width: 768px) {
    font-size: ${({ theme }) => theme.typography.fontSize.sm};
  }
`;

const PackagesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: ${({ theme }) => theme.spacing.md};
  margin-bottom: ${({ theme }) => theme.spacing.xl};

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: ${({ theme }) => theme.spacing.sm};
  }
`;

const PackageCard = styled.div<{ $popular?: boolean }>`
  background: ${({ theme, $popular }) =>
    $popular
      ? `linear-gradient(135deg, ${theme.colors.primary}08 0%, ${theme.colors.primary}15 100%)`
      : theme.colors.backgroundAlt};
  border: 2px solid ${({ theme, $popular }) =>
    $popular ? theme.colors.primary : theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.lg};
  padding: ${({ theme }) => theme.spacing.lg};
  position: relative;
  transition: all 0.2s ease;

  ${({ $popular }) => $popular && `
    transform: scale(1.02);
  `}

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
    transform: translateY(-2px);
  }

  @media (max-width: 768px) {
    padding: ${({ theme }) => theme.spacing.md};

    ${({ $popular }) => $popular && `
      transform: none;
      order: -1;
    `}
  }
`;

const PopularBadge = styled.span`
  position: absolute;
  top: -10px;
  left: 50%;
  transform: translateX(-50%);
  background: ${({ theme }) => theme.colors.primary};
  color: white;
  font-size: 11px;
  font-weight: 600;
  padding: 4px 12px;
  border-radius: 20px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const PackageName = styled.h3`
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.textPrimary};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

const PackageCredits = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const PackagePrice = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize['2xl']};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.textPrimary};
  margin-bottom: ${({ theme }) => theme.spacing.md};

  span {
    font-size: ${({ theme }) => theme.typography.fontSize.sm};
    font-weight: normal;
    color: ${({ theme }) => theme.colors.textSecondary};
  }
`;

const BuyButton = styled.button<{ $primary?: boolean }>`
  width: 100%;
  padding: 12px 16px;
  border-radius: ${({ theme }) => theme.radius.md};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  cursor: pointer;
  transition: all 0.2s ease;

  ${({ $primary, theme }) => $primary ? `
    background: ${theme.colors.primary};
    color: white;
    border: none;

    &:hover {
      background: ${theme.colors.primaryHover};
      transform: translateY(-1px);
    }
  ` : `
    background: transparent;
    color: ${theme.colors.textPrimary};
    border: 1px solid ${theme.colors.border};

    &:hover {
      background: ${theme.colors.surfaceHover};
      border-color: ${theme.colors.primary};
    }
  `}
`;

const FooterText = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-top: ${({ theme }) => theme.spacing.md};
  opacity: 0.7;

  a {
    color: ${({ theme }) => theme.colors.primary};
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }
`;

interface NoCreditsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function NoCreditsModal({ isOpen, onClose }: NoCreditsModalProps) {
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  const handleBuyPackage = (packageId: string) => {
    onClose();
    router.push(`${ROUTES.APP.BILLING}?package=${packageId}`);
  };

  if (!isOpen || !mounted) return null;

  const content = (
    <Overlay onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <CloseButton onClick={onClose} aria-label="Close">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" />
          </svg>
        </CloseButton>

        <IconContainer>
          <CoinIcon />
        </IconContainer>

        <Title>Out of Credits!</Title>
        <Subtitle>
          Don't worry, you can continue analyzing by purchasing new credits.
          Choose the package that suits you.
        </Subtitle>

        <PackagesGrid>
          <PackageCard>
            <PackageName>{PRICING.SINGLE.name}</PackageName>
            <PackageCredits>{PRICING.SINGLE.credits} analysis credit</PackageCredits>
            <PackagePrice>
              ${PRICING.SINGLE.price}
            </PackagePrice>
            <BuyButton onClick={() => handleBuyPackage(PRICING.SINGLE.id)}>
              Buy Now
            </BuyButton>
          </PackageCard>

          <PackageCard $popular>
            <PopularBadge>Most Popular</PopularBadge>
            <PackageName>{PRICING.STARTER.name}</PackageName>
            <PackageCredits>{PRICING.STARTER.credits} analysis credits</PackageCredits>
            <PackagePrice>
              ${PRICING.STARTER.price}
              <span> (${(PRICING.STARTER.price / PRICING.STARTER.credits).toFixed(1)}/credit)</span>
            </PackagePrice>
            <BuyButton $primary onClick={() => handleBuyPackage(PRICING.STARTER.id)}>
              Buy Now
            </BuyButton>
          </PackageCard>

          <PackageCard>
            <PackageName>{PRICING.PRO.name}</PackageName>
            <PackageCredits>Unlimited analyses</PackageCredits>
            <PackagePrice>
              ${PRICING.PRO.price}
              <span>/mo</span>
            </PackagePrice>
            <BuyButton onClick={() => handleBuyPackage(PRICING.PRO.id)}>
              Go Pro
            </BuyButton>
          </PackageCard>
        </PackagesGrid>

        <FooterText>
          All payments are securely processed by <a href="https://stripe.com" target="_blank" rel="noopener noreferrer">Stripe</a>.
        </FooterText>
      </ModalContent>
    </Overlay>
  );

  return createPortal(content, document.body);
}
