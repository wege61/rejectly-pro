'use client';

import styled from 'styled-components';
import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { PRICING } from '@/lib/constants';

interface UserCredits {
  credits: number;
  hasSubscription: boolean;
  canAnalyze: boolean;
}

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: ${({ theme }) => theme.spacing['2xl']};

  
  @media (max-width: 450px) {
    padding: ${({ theme }) => theme.spacing["lg"]};
    padding-top: 52px;
  }
`;

const Header = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing['2xl']};
`;

const Title = styled.h1`
  font-size: ${({ theme }) => theme.typography.fontSize['3xl']};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const Subtitle = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  color: ${({ theme }) => theme.colors.textSecondary};
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

const CreditsCard = styled(Card)`
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  background: linear-gradient(135deg, rgba(155, 135, 196, 0.1) 0%, rgba(180, 167, 214, 0.1) 100%);
  border: 1px solid rgba(155, 135, 196, 0.3);
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
  font-size: ${({ theme }) => theme.typography.fontSize["3xl"]};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.primary};
`;

const CreditsLabel = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const SubscriptionBadge = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  padding: ${({ theme }) => `${theme.spacing.sm} ${theme.spacing.lg}`};
  background: var(--success);
  color: white;
  border-radius: ${({ theme }) => theme.radius.md};
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
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

export default function BillingPage() {
  const [userCredits, setUserCredits] = useState<UserCredits>({
    credits: 0,
    hasSubscription: false,
    canAnalyze: false,
  });

  const [isLoading, setIsLoading] = useState<string | null>(null);

  const fetchCredits = async () => {
    try {
      const response = await fetch("/api/user/credits");
      if (response.ok) {
        const data = await response.json();
        setUserCredits(data);
      }
    } catch (error) {
      console.error("Error fetching credits:", error);
    }
  };

  useEffect(() => {
    fetchCredits();
  }, []);

  // TEST ONLY - Simulates purchase
  const handleBuy = async (planId: string, credits: number, planName: string) => {
    setIsLoading(planId);
    try {
      const response = await fetch("/api/credits/add-test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ credits, planName }),
      });

      if (response.ok) {
        alert(`✅ Success! Added ${credits} credits (${planName})`);
        fetchCredits(); // Refresh credits
      } else {
        alert("❌ Failed to add credits");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("❌ Error occurred");
    } finally {
      setIsLoading(null);
    }
  };

  // Mock data - gerçek data Supabase'den gelecek
  const transactions = [
    {
      id: '1',
      title: 'Starter Pack - 10 Credits',
      date: '2025-10-17',
      amount: 7,
      status: 'success',
    },
  ];

  return (
    <Container>
      <Header>
        <Title>Billing</Title>
        <Subtitle>Buy credits or subscribe for unlimited access</Subtitle>
      </Header>

      {/* Current Credits */}
      <CreditsCard variant="elevated">
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
          </CreditsInfo>
        </CreditsContent>
      </CreditsCard>

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
              onClick={() => handleBuy('single', 1, 'Single')}
              disabled={isLoading === 'single'}
            >
              {isLoading === 'single' ? 'Processing...' : 'Buy Single'}
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
              onClick={() => handleBuy('starter', 10, 'Starter')}
              disabled={isLoading === 'starter'}
            >
              {isLoading === 'starter' ? 'Processing...' : 'Buy Starter'}
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
              onClick={() => alert('⚠️ Subscription requires Stripe integration')}
            >
              Subscribe
            </Button>
          </PricingCard>
        </PricingGrid>
      </Section>

      <Section>
        <SectionTitle>Transaction History</SectionTitle>
        {transactions.length === 0 ? (
          <Card variant="bordered">
            <Card.Content>
              <p style={{ textAlign: 'center', color: '#6b7280' }}>
                No transactions yet
              </p>
            </Card.Content>
          </Card>
        ) : (
          <Card variant="bordered">
            <TransactionsList>
              {transactions.map((transaction) => (
                <TransactionItem key={transaction.id}>
                  <TransactionInfo>
                    <TransactionTitle>{transaction.title}</TransactionTitle>
                    <TransactionDate>
                      {new Date(transaction.date).toLocaleDateString('tr-TR', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </TransactionDate>
                  </TransactionInfo>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <TransactionAmount>${transaction.amount}</TransactionAmount>
                    <Badge variant="success">Paid</Badge>
                  </div>
                </TransactionItem>
              ))}
            </TransactionsList>
          </Card>
        )}
      </Section>
    </Container>
  );
}