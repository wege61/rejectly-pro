'use client';

import styled from 'styled-components';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import { PRICING } from '@/lib/constants';
import { useCredits } from '@/contexts/CreditsContext';
import { CreditsCard } from '@/components/dashboard/CreditsCard';

const GlassButton = styled.button<{ $primary?: boolean }>`
  width: 100%;
  padding: 14px 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background: ${({ $primary }) => 
    $primary 
      ? 'linear-gradient(135deg, rgba(53, 162, 159, 1) 0%, rgba(11, 102, 106, 1) 100%)' 
      : 'rgba(255, 255, 255, 0.05)'};
  color: ${({ $primary }) => $primary ? 'white' : 'rgba(255, 255, 255, 0.9)'};
  border: 1px solid ${({ $primary }) => 
    $primary ? 'rgba(53, 162, 159, 0.5)' : 'rgba(255, 255, 255, 0.1)'};
  border-radius: 100px;
  font-size: 15px;
  font-weight: 600;
  letter-spacing: 0.02em;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  box-shadow: ${({ $primary }) => 
    $primary ? '0 8px 24px rgba(53, 162, 159, 0.25)' : 'none'};

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    background: ${({ $primary }) => 
      $primary 
        ? 'linear-gradient(135deg, rgba(63, 172, 169, 1) 0%, rgba(21, 112, 116, 1) 100%)' 
        : 'rgba(255, 255, 255, 0.1)'};
    box-shadow: ${({ $primary }) => 
      $primary 
        ? '0 12px 32px rgba(53, 162, 159, 0.35)' 
        : '0 4px 12px rgba(0, 0, 0, 0.1)'};
    border-color: ${({ $primary }) => 
      $primary ? 'rgba(53, 162, 159, 0.8)' : 'rgba(255, 255, 255, 0.2)'};
  }

  &:active:not(:disabled) {
    transform: translateY(1px);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }

  svg {
    width: 20px;
    height: 20px;
    flex-shrink: 0;
  }
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: ${({ theme }) => theme.spacing['2xl']};

  
  @media (max-width: 450px) {
    padding: ${({ theme }) => theme.spacing["lg"]};
    padding-top: 32px;
  }
`;

const Header = styled.div`
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  margin-bottom: ${({ theme }) => theme.spacing["2xl"]};

`;

const Title = styled.h1`
  font-size: ${({ theme }) => theme.typography.fontSize['3xl']};
  margin-bottom: ${({ theme }) => theme.spacing.sm};

  @media (max-width: 768px) {
    order: 1;
  }
`;

const TitleElements = styled.div``;

const Subtitle = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  color: ${({ theme }) => theme.colors.textSecondary};

  @media (max-width: 768px) {
    order: 3;
  }
`;

const Section = styled.section`
  margin-bottom: ${({ theme }) => theme.spacing['2xl']};
`;

const SectionTitle = styled.h2`
  font-size: ${({ theme }) => theme.typography.fontSize.xl};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const PricingGrid = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.spacing.lg};
  grid-template-columns: repeat(3, 1fr);
  margin-bottom: ${({ theme }) => theme.spacing['2xl']};

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

const CreditsCardWrapper = styled.div`
  
`;



const TransactionsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
`;

const TransactionItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${({ theme }) => theme.spacing.lg};
  
  /* Liquid Glass for Transaction Items */
  background: rgba(255, 255, 255, 0.02);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.04);
  border-radius: ${({ theme }) => theme.radius.xl};
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.04);
    border-color: rgba(255, 255, 255, 0.08);
    transform: translateY(-1px);
  }
`;

const TransactionInfo = styled.div`
  flex: 1;
`;

const TransactionTitle = styled.div`
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

const TransactionDate = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const TransactionAmount = styled.div`
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
`;

const PricingCard = styled.div<{ $featured?: boolean }>`
  background: ${({ $featured }) => $featured ? "rgba(255, 255, 255, 0.04)" : "rgba(255, 255, 255, 0.02)"};
  backdrop-filter: blur(40px) saturate(200%);
  -webkit-backdrop-filter: blur(40px) saturate(200%);
  border: 1px solid ${({ $featured }) => $featured ? "rgba(255, 255, 255, 0.2)" : "rgba(255, 255, 255, 0.08)"};
  border-radius: 24px;
  padding: 40px;
  position: relative;
  transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
  box-shadow: ${({ $featured }) => $featured 
    ? "inset 0 1px 1px rgba(255, 255, 255, 0.2), 0 12px 40px rgba(0, 0, 0, 0.4), 0 0 30px rgba(255, 255, 255, 0.03)"
    : "inset 0 1px 1px rgba(255, 255, 255, 0.15), 0 4px 24px rgba(0, 0, 0, 0.3)"};

  &:hover {
    background: ${({ $featured }) => $featured ? "rgba(255, 255, 255, 0.06)" : "rgba(255, 255, 255, 0.04)"};
    border-color: ${({ $featured }) => $featured ? "rgba(255, 255, 255, 0.3)" : "rgba(255, 255, 255, 0.15)"};
    box-shadow: ${({ $featured }) => $featured 
      ? "inset 0 1px 2px rgba(255, 255, 255, 0.3), 0 16px 48px rgba(0, 0, 0, 0.5), 0 0 40px rgba(255, 255, 255, 0.05)"
      : "inset 0 1px 2px rgba(255, 255, 255, 0.2), 0 8px 32px rgba(0, 0, 0, 0.4)"};
    transform: translateY(-4px);
  }

  @media (max-width: 768px) {
    padding: 32px;
  }
`;

const PricingBadge = styled.div`
  position: absolute;
  top: -14px;
  left: 50%;
  transform: translateX(-50%);
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.95), rgba(255, 255, 255, 0.75));
  backdrop-filter: blur(10px);
  color: #000;
  padding: 8px 20px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 700;
  white-space: nowrap;
  box-shadow: 0 4px 12px rgba(255, 255, 255, 0.15), inset 0 1px 1px #fff;
  border: 1px solid rgba(255, 255, 255, 0.5);
  letter-spacing: 0.5px;
  text-transform: uppercase;
`;

const PricingPlanName = styled.h3`
  font-size: 24px;
  font-weight: 600;
  margin: 0 0 12px;
  color: var(--text-color);
`;

const PricingPrice = styled.div`
  font-size: 56px;
  font-weight: 700;
  color: var(--text-color);
  line-height: 1.1;
  letter-spacing: -2px;
  margin-bottom: 6px;

  @media (max-width: 768px) {
    font-size: 48px;
  }
`;

const PricingPriceSubtext = styled.p`
  font-size: 15px;
  color: var(--text-tertiary);
  margin: 0 0 6px;
`;

const PricingPlanDescription = styled.p`
  font-size: 15px;
  color: var(--text-tertiary);
  margin: 0 0 20px;
`;

const PricingPlanTagline = styled.p`
  font-size: 18px;
  font-weight: 600;
  color: var(--text-color);
  margin: 0 0 24px;
`;

const PricingFeatureList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const PricingFeatureRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 15px;
  color: var(--text-color);

  svg {
    flex-shrink: 0;
    width: 20px;
    height: 20px;
    color: var(--text-tertiary);
  }
`;

const PricingFeatureRowMuted = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 14px;
  color: var(--text-tertiary);

  svg {
    flex-shrink: 0;
    width: 20px;
    height: 20px;
    color: var(--text-tertiary);
    opacity: 0.7;
  }
`;

const PricingFeatureRowHighlight = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 15px;
  color: var(--accent);
  font-weight: 500;

  svg {
    flex-shrink: 0;
    width: 20px;
    height: 20px;
    color: var(--accent);
  }
`;

// Pricing Icons
const PricingArrowIcon = () => (
  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
  </svg>
);

const PricingCreditIcon = () => (
  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const PricingAnalysisIcon = () => (
  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
  </svg>
);

const PricingATSIcon = () => (
  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const PricingLetterIcon = () => (
  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
);

const PricingSparklesIcon = () => (
  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
  </svg>
);

const PricingClockIcon = () => (
  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const PricingShieldIcon = () => (
  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
  </svg>
);

const PricingMixIcon = () => (
  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
  </svg>
);

const PricingSaveIcon = () => (
  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const PricingTargetIcon = () => (
  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const PricingInfinityIcon = () => (
  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18.178 8c5.096 0 5.096 8 0 8-5.095 0-7.133-8-12.739-8-4.303 0-4.303 8 0 8 5.606 0 7.644-8 12.74-8z" />
  </svg>
);

const PricingRocketIcon = () => (
  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.631 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 00-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 01-2.448-2.448 14.9 14.9 0 01.06-.312m-2.24 2.39a4.493 4.493 0 00-1.757 4.306 4.493 4.493 0 004.306-1.758M16.5 9a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
  </svg>
);

const PricingStarIcon = () => (
  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
  </svg>
);

const PricingRefreshIcon = () => (
  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
  </svg>
);

const CheckIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
    <path
      fillRule="evenodd"
      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
      clipRule="evenodd"
    />
  </svg>
);

const ModalContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing.xl} 0;
  text-align: center;
`;

const ModalIconWrapper = styled.div<{ $variant: 'success' | 'error' | 'warning' }>`
  width: 64px;
  height: 64px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  
  ${({ $variant, theme }) => {
    switch ($variant) {
      case 'success':
        return `
          background-color: rgba(34, 197, 94, 0.2);
          color: #4ade80;
          box-shadow: 0 0 20px rgba(34, 197, 94, 0.3);
        `;
      case 'error':
        return `
          background-color: rgba(239, 68, 68, 0.2);
          color: #f87171;
          box-shadow: 0 0 20px rgba(239, 68, 68, 0.3);
        `;
      case 'warning':
        return `
          background-color: rgba(245, 158, 11, 0.2);
          color: #fbbf24;
          box-shadow: 0 0 20px rgba(245, 158, 11, 0.3);
        `;
    }
  }}

  svg {
    width: 32px;
    height: 32px;
  }
`;

const ModalHeading = styled.h3`
  font-size: ${({ theme }) => theme.typography.fontSize.xl};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: rgba(255, 255, 255, 0.95);
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const ModalMessage = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  color: rgba(255, 255, 255, 0.7);
  line-height: 1.5;
  margin-bottom: ${({ theme }) => theme.spacing.sm};
  max-width: 400px;
`;

export default function BillingPage() {
  const { refreshCredits } = useCredits();
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<'success' | 'cancelled' | 'error' | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>('');


  const router = useRouter(); // Helper to clean URL after
  
  useEffect(() => {
    // Check for payment status in URL
    const query = new URLSearchParams(window.location.search);
    if (query.get('payment') === 'success') {
      setPaymentStatus('success');
      
      // Clean up the URL exactly once right away
      window.history.replaceState({}, '', '/billing');

      // Immediate refresh attempt
      refreshCredits();
      
      // Polling mechanism to bridge the gap between UI redirect and DB Webhook (which can take a few seconds)
      let attempts = 0;
      const maxAttempts = 5; // 5 attempts = ~10 seconds
      
      const pollInterval = setInterval(() => {
        attempts++;
        if (attempts >= maxAttempts) {
          clearInterval(pollInterval);
        } else {
          refreshCredits();
        }
      }, 2000); // Poll every 2 seconds

      // Cleanup on unmount or after success
      return () => clearInterval(pollInterval);
      
    } else if (query.get('payment') === 'cancelled') {
      setPaymentStatus('cancelled');
      window.history.replaceState({}, '', '/billing');
    }
  }, [refreshCredits]);

  const handleCheckout = async (priceId: string, mode: 'subscription' | 'payment') => {
    setIsLoading(priceId);
    setErrorMessage('');
    try {
      const returnUrl = `${window.location.origin}/billing`;
      
      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          priceId,
          mode,
          successUrl: `${returnUrl}?payment=success`,
          cancelUrl: `${returnUrl}?payment=cancelled`,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Network response was not ok');
      }

      const { url } = await response.json();
      
      if (url) {
        window.location.href = url;
      } else {
        throw new Error('No checkout URL received');
      }
    } catch (error: any) {
      console.error('Error:', error);
      setErrorMessage(error.message || 'Payment failed to start.');
      setPaymentStatus('error');
    } finally {
      setIsLoading(null);
    }
  };

  const closeModals = () => {
    setPaymentStatus(null);
    setErrorMessage('');
  };

  // ... transactions ...

  return (
    <Container>
      {/* Success Modal */}
      <Modal 
        isOpen={paymentStatus === 'success'} 
        onClose={closeModals}
        showCloseButton={false}
        size="sm"
      >
        <Modal.Body>
          <ModalContentWrapper>
            <ModalIconWrapper $variant="success">
              <CheckCircle />
            </ModalIconWrapper>
            <ModalHeading>Payment Successful!</ModalHeading>
            <ModalMessage>
              Your transaction was completed successfully. Your credits have been updated.
            </ModalMessage>
          </ModalContentWrapper>
        </Modal.Body>
        <Modal.Footer>
          <Button fullWidth onClick={closeModals}>Start Using Rejectly</Button>
        </Modal.Footer>
      </Modal>

      {/* Cancelled/Error Modal */}
      <Modal 
        isOpen={paymentStatus === 'cancelled' || paymentStatus === 'error'} 
        onClose={closeModals}
        showCloseButton={false}
        size="sm"
      >
        <Modal.Body>
          <ModalContentWrapper>
            <ModalIconWrapper $variant={paymentStatus === 'cancelled' ? 'warning' : 'error'}>
              {paymentStatus === 'cancelled' ? <AlertTriangle /> : <XCircle />}
            </ModalIconWrapper>
            <ModalHeading>
              {paymentStatus === 'cancelled' ? 'Payment Cancelled' : 'Payment Failed'}
            </ModalHeading>
            <ModalMessage>
              {paymentStatus === 'cancelled' 
                ? 'You cancelled the checkout process. No charges were made.' 
                : errorMessage || 'Something went wrong with your payment. Please try again.'}
            </ModalMessage>
          </ModalContentWrapper>
        </Modal.Body>
        <Modal.Footer>
          <Button fullWidth variant="secondary" onClick={closeModals}>Close</Button>
        </Modal.Footer>
      </Modal>

      <Header>
        <TitleElements>
          <Title>Billing</Title>
          <Subtitle>Buy credits or subscribe for unlimited access</Subtitle>
        </TitleElements>
        <CreditsCardWrapper>
          <CreditsCard />
        </CreditsCardWrapper>
      </Header>
      <Section>
        <SectionTitle>Buy Credits</SectionTitle>
        <PricingGrid>
          {/* Single Plan */}
          <PricingCard>
            <PricingPlanName>{PRICING.SINGLE.name}</PricingPlanName>
            <PricingPrice>${PRICING.SINGLE.price}</PricingPrice>
            <PricingPriceSubtext>one-time payment</PricingPriceSubtext>
            <PricingPlanDescription>Try it with a single analysis</PricingPlanDescription>
            <PricingPlanTagline>Perfect for quick tests</PricingPlanTagline>
            
            <GlassButton
              onClick={() => handleCheckout(PRICING.SINGLE.priceId, 'payment')}
              disabled={isLoading === PRICING.SINGLE.priceId}
              style={{ marginBottom: '32px' }}
            >
              {isLoading === PRICING.SINGLE.priceId ? 'Processing...' : 'Buy Single'} <PricingArrowIcon />
            </GlassButton>
            
            <PricingFeatureList>
              <PricingFeatureRow><PricingCreditIcon />1 credit — Perfect for testing</PricingFeatureRow>
              <PricingFeatureRow><PricingAnalysisIcon />1 job match analysis OR</PricingFeatureRow>
              <PricingFeatureRow><PricingATSIcon />1 ATS optimization OR</PricingFeatureRow>
              <PricingFeatureRow><PricingLetterIcon />1 cover letter</PricingFeatureRow>
              <PricingFeatureRow><PricingSparklesIcon />Full Pro features included</PricingFeatureRow>
              <PricingFeatureRowMuted><PricingClockIcon />Valid for 30 days</PricingFeatureRowMuted>
              <PricingFeatureRowMuted><PricingShieldIcon />No subscription, no commitment</PricingFeatureRowMuted>
            </PricingFeatureList>
          </PricingCard>

          {/* Starter Plan */}
          <PricingCard $featured>
            <PricingBadge>Most popular</PricingBadge>
            <PricingPlanName>{PRICING.STARTER.name}</PricingPlanName>
            <PricingPrice>${PRICING.STARTER.price}</PricingPrice>
            <PricingPriceSubtext>one-time payment</PricingPriceSubtext>
            <PricingPlanDescription>$0.70 per analysis — save 65%</PricingPlanDescription>
            <PricingPlanTagline>Best for active job seekers</PricingPlanTagline>
            
            <GlassButton
              $primary
              onClick={() => handleCheckout(PRICING.STARTER.priceId, 'payment')}
              disabled={isLoading === PRICING.STARTER.priceId}
              style={{ marginBottom: '32px' }}
            >
              {isLoading === PRICING.STARTER.priceId ? 'Processing...' : 'Buy Starter'} <PricingArrowIcon />
            </GlassButton>
            
            <PricingFeatureList>
              <PricingFeatureRow><PricingCreditIcon />10 credits — Use however you need</PricingFeatureRow>
              <PricingFeatureRow><PricingAnalysisIcon />Job match analyses</PricingFeatureRow>
              <PricingFeatureRow><PricingATSIcon />ATS optimizations</PricingFeatureRow>
              <PricingFeatureRow><PricingLetterIcon />Cover letters</PricingFeatureRow>
              <PricingFeatureRow><PricingMixIcon />Mix & match: 5 jobs + 3 ATS + 2 letters</PricingFeatureRow>
              <PricingFeatureRowHighlight><PricingSaveIcon />Save 65% ($0.70 per credit)</PricingFeatureRowHighlight>
              <PricingFeatureRowMuted><PricingClockIcon />Credits valid for 90 days</PricingFeatureRowMuted>
              <PricingFeatureRowMuted><PricingTargetIcon />Best for 5-10 target positions</PricingFeatureRowMuted>
            </PricingFeatureList>
          </PricingCard>

          {/* Pro Plan */}
          <PricingCard>
            <PricingPlanName>{PRICING.PRO.name}</PricingPlanName>
            <PricingPrice>${PRICING.PRO.price}</PricingPrice>
            <PricingPriceSubtext>per month</PricingPriceSubtext>
            <PricingPlanDescription>Unlimited for power users</PricingPlanDescription>
            <PricingPlanTagline>Apply without limits</PricingPlanTagline>
            
            <GlassButton
              onClick={() => handleCheckout(PRICING.PRO.priceId, 'subscription')}
              disabled={isLoading === PRICING.PRO.priceId}
              style={{ marginBottom: '32px' }}
            >
               {isLoading === PRICING.PRO.priceId ? 'Processing...' : 'Subscribe'} <PricingArrowIcon />
            </GlassButton>

            <PricingFeatureList>
              <PricingFeatureRow><PricingInfinityIcon />Unlimited — No limits, no counting</PricingFeatureRow>
              <PricingFeatureRow><PricingAnalysisIcon />Unlimited job match analyses</PricingFeatureRow>
              <PricingFeatureRow><PricingATSIcon />Unlimited ATS optimizations</PricingFeatureRow>
              <PricingFeatureRow><PricingLetterIcon />Unlimited cover letters</PricingFeatureRow>
              <PricingFeatureRow><PricingRocketIcon />Perfect for career transitions</PricingFeatureRow>
              <PricingFeatureRowHighlight><PricingStarIcon />Best value for 20+ analyses/month</PricingFeatureRowHighlight>
              <PricingFeatureRowMuted><PricingRefreshIcon />Credits never expire while subscribed</PricingFeatureRowMuted>
              <PricingFeatureRowMuted><PricingShieldIcon />Cancel anytime, no questions asked</PricingFeatureRowMuted>
            </PricingFeatureList>
          </PricingCard>
        </PricingGrid>
      </Section>

      {/* ... Transactions ... */}
    </Container>
  );
}