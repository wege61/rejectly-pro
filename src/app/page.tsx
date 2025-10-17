'use client';

import styled from 'styled-components';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

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
  margin-top: ${({ theme }) => theme.spacing.xl};
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

export default function Home() {
  return (
    <Container>
      <Title>Rejectly.pro - Component Library</Title>
      
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

      <Section>
        <SectionTitle>Card with Badges</SectionTitle>
        <Card variant="elevated">
          <Card.Header>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
              <div>
                <Card.Title>Senior Frontend Developer</Card.Title>
                <Card.Description>Remote • Full-time</Card.Description>
              </div>
              <Badge variant="success">85% Match</Badge>
            </div>
          </Card.Header>
          <Card.Content>
            <BadgeGrid>
              <Badge size="sm">React</Badge>
              <Badge size="sm">TypeScript</Badge>
              <Badge size="sm">Next.js</Badge>
              <Badge size="sm">styled-components</Badge>
            </BadgeGrid>
          </Card.Content>
          <Card.Footer>
            <Button fullWidth>View Analysis</Button>
          </Card.Footer>
        </Card>
      </Section>
    </Container>
  );
}