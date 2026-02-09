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

const PriceSubtext = styled.p`
  font-size: 13px;
  color: var(--success);
  font-weight: 600;
  margin-top: 4px;
`;

const PricingCard = styled(Card)<{ $featured?: boolean }>`
  position: relative;
  ${({ $featured, theme }) =>
    $featured &&
    `
    border: 2px solid ${theme.colors.primary};
  `}
`;

const FeaturedBadge = styled.div`
  position: absolute;
  top: -12px;
  right: 24px;
`;

const PricingHeader = styled.div`
  text-align: center;
  padding-bottom: ${({ theme }) => theme.spacing.lg};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const PricingName = styled.h3`
  font-size: ${({ theme }) => theme.typography.fontSize.xl};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const PricingPrice = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize['4xl']};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.primary};
  
  span {
    font-size: ${({ theme }) => theme.typography.fontSize.base};
    font-weight: ${({ theme }) => theme.typography.fontWeight.normal};
    color: ${({ theme }) => theme.colors.textSecondary};
  }
`;

const FeatureList = styled.ul`
  list-style: none;
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const FeatureItem = styled.li`
  display: flex;
  align-items: start;
  gap: ${({ theme }) => theme.spacing.sm};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
  
  svg {
    width: 20px;
    height: 20px;
    flex-shrink: 0;
    color: ${({ theme }) => theme.colors.success};
    margin-top: 2px;
  }
`;

const TransactionsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const TransactionItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${({ theme }) => theme.spacing.md};
  background-color: ${({ theme }) => theme.colors.backgroundAlt};
  border-radius: ${({ theme }) => theme.radius.md};
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
      refreshCredits();
      window.history.replaceState({}, '', '/billing');
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
          <PricingCard variant="bordered">
            <PricingHeader>
              <PricingName>{PRICING.SINGLE.name}</PricingName>
              <PricingPrice>
                ${PRICING.SINGLE.price} <span>one-time</span>
              </PricingPrice>
            </PricingHeader>
            <FeatureList>
              {PRICING.SINGLE.features.map((feature) => (
                <FeatureItem key={feature}>
                  <CheckIcon />
                  <span>{feature}</span>
                </FeatureItem>
              ))}
            </FeatureList>
            <Button
              variant="secondary"
              fullWidth
              onClick={() => handleCheckout(PRICING.SINGLE.priceId, 'payment')}
              disabled={isLoading === PRICING.SINGLE.priceId}
            >
              {isLoading === PRICING.SINGLE.priceId ? 'Processing...' : 'Buy Single'}
            </Button>
          </PricingCard>

          {/* Starter Plan */}
          <PricingCard variant="elevated" $featured>
            <FeaturedBadge>
              <Badge variant="info">Best Value</Badge>
            </FeaturedBadge>
            <PricingHeader>
              <PricingName>{PRICING.STARTER.name}</PricingName>
              <PricingPrice>
                ${PRICING.STARTER.price} <span>one-time</span>
              </PricingPrice>
              <PriceSubtext>$0.70 per report - save 65%</PriceSubtext>
            </PricingHeader>
            <FeatureList>
              {PRICING.STARTER.features.map((feature) => (
                <FeatureItem key={feature}>
                  <CheckIcon />
                  <span>{feature}</span>
                </FeatureItem>
              ))}
            </FeatureList>
            <Button
              fullWidth
              onClick={() => handleCheckout(PRICING.STARTER.priceId, 'payment')}
              disabled={isLoading === PRICING.STARTER.priceId}
            >
              {isLoading === PRICING.STARTER.priceId ? 'Processing...' : 'Buy Starter'}
            </Button>
          </PricingCard>

          {/* Pro Plan */}
          <PricingCard variant="bordered">
            <PricingHeader>
              <PricingName>{PRICING.PRO.name}</PricingName>
              <PricingPrice>
                ${PRICING.PRO.price} <span>/month</span>
              </PricingPrice>
            </PricingHeader>
            <FeatureList>
              {PRICING.PRO.features.map((feature) => (
                <FeatureItem key={feature}>
                  <CheckIcon />
                  <span>{feature}</span>
                </FeatureItem>
              ))}
            </FeatureList>
            <Button
              variant="secondary"
              fullWidth
              onClick={() => handleCheckout(PRICING.PRO.priceId, 'subscription')}
              disabled={isLoading === PRICING.PRO.priceId}
            >
               {isLoading === PRICING.PRO.priceId ? 'Processing...' : 'Subscribe'}
            </Button>
          </PricingCard>
        </PricingGrid>
      </Section>

      {/* ... Transactions ... */}
    </Container>
  );
}