'use client';

import styled from 'styled-components';
import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
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



// ... (imports remain)

export default function BillingPage() {
  const { refreshCredits } = useCredits();
  const [isLoading, setIsLoading] = useState<string | null>(null);

  const handleCheckout = async (priceId: string, mode: 'subscription' | 'payment') => {
    setIsLoading(priceId);
    try {
      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          priceId,
          mode,
          successUrl: `${window.location.origin}/app/billing?payment=success`,
          cancelUrl: `${window.location.origin}/app/billing?payment=cancelled`,
        }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const { url } = await response.json();
      
      if (url) {
        window.location.href = url;
      } else {
        throw new Error('No checkout URL received');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Payment failed to start. Please try again.');
    } finally {
      setIsLoading(null);
    }
  };

  // ... transactions ...

  return (
    <Container>
      {/* ... Header ... */}
      
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