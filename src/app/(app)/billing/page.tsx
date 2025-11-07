'use client';

import styled from 'styled-components';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { PRICING } from '@/lib/constants';

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
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  margin-bottom: ${({ theme }) => theme.spacing['2xl']};
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
  // Mock data - gerçek data Supabase'den gelecek
  const transactions = [
    {
      id: '1',
      title: 'Pro Report - Senior Frontend Developer',
      date: '2025-10-17',
      amount: 9,
      status: 'success',
    },
  ];

  return (
    <Container>
      <Header>
        <Title>Billing</Title>
        <Subtitle>Manage your payments and view transaction history</Subtitle>
      </Header>

      <Section>
        <SectionTitle>Pricing Plans</SectionTitle>
        <PricingGrid>
          {/* Free Plan */}
          <PricingCard variant="bordered">
            <PricingHeader>
              <PricingName>{PRICING.FREE.name}</PricingName>
              <PricingPrice>
                ${PRICING.FREE.price}
              </PricingPrice>
            </PricingHeader>
            <FeatureList>
              {PRICING.FREE.features.map((feature) => (
                <FeatureItem key={feature}>
                  <CheckIcon />
                  <span>{feature}</span>
                </FeatureItem>
              ))}
            </FeatureList>
            <Button variant="secondary" fullWidth disabled>
              Current Plan
            </Button>
          </PricingCard>

          {/* Pro Plan */}
          <PricingCard variant="elevated" $featured>
            <FeaturedBadge>
              <Badge variant="info">Recommended</Badge>
            </FeaturedBadge>
            <PricingHeader>
              <PricingName>{PRICING.PRO.name}</PricingName>
              <PricingPrice>
                ${PRICING.PRO.price} <span>per month</span>
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
            <Button fullWidth>
              Purchase Pro Report
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