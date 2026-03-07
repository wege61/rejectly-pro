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
import { SharedPricingCards } from '@/components/billing/PricingCards';

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
  position: relative;
  padding-top: 24px;
  max-width: 1200px;
  margin: 0 auto;
  padding-left: ${({ theme }) => theme.spacing["2xl"]};
  padding-right: ${({ theme }) => theme.spacing["2xl"]};
  padding-bottom: 100px; /* Space for FAB */
  overflow-x: hidden;

  @media (max-width: 450px) {
    padding: ${({ theme }) => theme.spacing["lg"]};
    padding-top: 24px;
  }
`;

const Header = styled.div`
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 24px;
  margin-bottom: 48px;
  margin-top: 24px;

  @media (max-width: 768px) {
    align-items: flex-start;
    gap: 12px;
    margin-bottom: 24px;
  }
`;

const TitleElements = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  min-width: 0;
  gap: 12px;
`;

const Title = styled.h1`
  font-size: 36px;
  font-weight: 700;
  letter-spacing: -0.03em;
  color: rgba(255, 255, 255, 0.95);
  line-height: 1.1;
  margin: 0;

  @media (max-width: 768px) {
    font-size: 24px;
    margin-bottom: 4px;
  }
`;

const Subtitle = styled.p`
  font-size: 15px;
  color: rgba(255, 255, 255, 0.6);
  font-weight: 500;
  letter-spacing: -0.01em;
  margin: 0;

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
  flex-shrink: 0;

  @media (max-width: 768px) {
    width: auto;
    
    > div {
      width: auto;
    }
  }
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
        <SharedPricingCards 
          onCheckout={handleCheckout} 
          isLoading={isLoading} 
        />
      </Section>

      {/* ... Transactions ... */}
    </Container>
  );
}