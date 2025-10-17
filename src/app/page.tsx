'use client';

import styled from 'styled-components';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Spinner } from '@/components/ui/Spinner';

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: ${({ theme }) => theme.spacing['2xl']};
`;

const Title = styled.h1`
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const Section = styled.section`
  margin-top: ${({ theme }) => theme.spacing['2xl']};
`;

const SectionTitle = styled.h2`
  font-size: ${({ theme }) => theme.typography.fontSize.xl};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const Grid = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.spacing.md};
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
`;

const BadgeGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.sm};
  align-items: center;
`;

const SpinnerGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.xl};
  align-items: center;
`;

const SpinnerDemo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const SpinnerLabel = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
`;

export default function Home() {
  return (
    <Container>
      <Title>Rejectly.pro - Component Library</Title>
      
      <Section>
        <SectionTitle>Spinners</SectionTitle>
        <SpinnerGrid>
          <SpinnerDemo>
            <Spinner size="sm" />
            <SpinnerLabel>Small</SpinnerLabel>
          </SpinnerDemo>
          
          <SpinnerDemo>
            <Spinner size="md" />
            <SpinnerLabel>Medium</SpinnerLabel>
          </SpinnerDemo>
          
          <SpinnerDemo>
            <Spinner size="lg" />
            <SpinnerLabel>Large</SpinnerLabel>
          </SpinnerDemo>
          
          <SpinnerDemo>
            <Spinner size="xl" />
            <SpinnerLabel>Extra Large</SpinnerLabel>
          </SpinnerDemo>
        </SpinnerGrid>

        <div style={{ marginTop: '32px' }}>
          <Card variant="elevated">
            <Card.Header>
              <Card.Title>Loading State</Card.Title>
              <Card.Description>Spinner centered in a card</Card.Description>
            </Card.Header>
            <Card.Content>
              <Spinner centered />
            </Card.Content>
          </Card>
        </div>

        <div style={{ marginTop: '16px', background: '#6366f1', padding: '24px', borderRadius: '12px' }}>
          <SpinnerGrid>
            <SpinnerDemo>
              <Spinner variant="white" size="md" />
              <SpinnerLabel style={{ color: 'white' }}>White Variant</SpinnerLabel>
            </SpinnerDemo>
          </SpinnerGrid>
        </div>
      </Section>

      <Section>
        <SectionTitle>Cards</SectionTitle>
        <Grid>
          <Card variant="default">
            <Card.Header>
              <Card.Title>Default Card</Card.Title>
              <Card.Description>This is a default card with border</Card.Description>
            </Card.Header>
            <Card.Content>
              <p>Card content goes here. You can put any content you want.</p>
            </Card.Content>
            <Card.Footer>
              <Button size="sm">Action</Button>
            </Card.Footer>
          </Card>

          <Card variant="elevated">
            <Card.Header>
              <Card.Title>Elevated Card</Card.Title>
              <Card.Description>This card has a shadow</Card.Description>
            </Card.Header>
            <Card.Content>
              <p>Elevated cards are great for highlighting important content.</p>
            </Card.Content>
          </Card>

          <Card variant="bordered" onClick={() => alert('Card clicked!')}>
            <Card.Header>
              <Card.Title>Clickable Card</Card.Title>
              <Card.Description>Click me!</Card.Description>
            </Card.Header>
            <Card.Content>
              <p>This card has a hover effect and is clickable.</p>
            </Card.Content>
          </Card>
        </Grid>
      </Section>

      <Section>
        <SectionTitle>Badges</SectionTitle>
        <BadgeGrid>
          <Badge>Default</Badge>
          <Badge variant="success">Success</Badge>
          <Badge variant="warning">Warning</Badge>
          <Badge variant="error">Error</Badge>
          <Badge variant="info">Info</Badge>
          <Badge size="sm">Small</Badge>
          <Badge size="lg">Large</Badge>
        </BadgeGrid>
      </Section>
    </Container>
  );
}