'use client';

import styled from 'styled-components';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

const Hero = styled.section`
  max-width: 1200px;
  margin: 0 auto;
  padding: ${({ theme }) => `${theme.spacing['3xl']} ${theme.spacing.lg}`};
  text-align: center;
`;

const HeroTitle = styled.h1`
  font-size: ${({ theme }) => theme.typography.fontSize['5xl']};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  
  @media (max-width: 768px) {
    font-size: ${({ theme }) => theme.typography.fontSize['3xl']};
  }
`;

const HeroSubtitle = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.xl};
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-bottom: ${({ theme }) => theme.spacing['2xl']};
  max-width: 700px;
  margin-left: auto;
  margin-right: auto;
`;

const CTAButtons = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  justify-content: center;
  flex-wrap: wrap;
`;

const Features = styled.section`
  max-width: 1200px;
  margin: 0 auto;
  padding: ${({ theme }) => `${theme.spacing['3xl']} ${theme.spacing.lg}`};
  background-color: ${({ theme }) => theme.colors.backgroundAlt};
`;

const SectionTitle = styled.h2`
  font-size: ${({ theme }) => theme.typography.fontSize['3xl']};
  text-align: center;
  margin-bottom: ${({ theme }) => theme.spacing['2xl']};
`;

const FeatureGrid = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.spacing.lg};
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
`;

const FeatureCard = styled(Card)`
  text-align: center;
`;

const FeatureIcon = styled.div`
  width: 48px;
  height: 48px;
  margin: 0 auto ${({ theme }) => theme.spacing.md};
  color: ${({ theme }) => theme.colors.primary};
  
  svg {
    width: 100%;
    height: 100%;
  }
`;

export default function Home() {
  return (
    <>
      <Hero>
        <Badge variant="info" style={{ marginBottom: '24px' }}>
          AI-Powered CV Analysis
        </Badge>
        <HeroTitle>
          Why Was I Rejected?
        </HeroTitle>
        <HeroSubtitle>
          Get data-driven insights on why your CV didn't match the job posting. 
          Improve your applications with AI-powered analysis.
        </HeroSubtitle>
        <CTAButtons>
          <Button size="lg" onClick={() => window.location.href = '/signup'}>
            Start Free Analysis
          </Button>
          <Button size="lg" variant="secondary" onClick={() => window.location.href = '/how-it-works'}>
            See How It Works
          </Button>
        </CTAButtons>
      </Hero>

      <Features>
        <SectionTitle>How Rejectly.pro Helps You</SectionTitle>
        <FeatureGrid>
          <FeatureCard variant="elevated">
            <FeatureIcon>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </FeatureIcon>
            <Card.Title>Keyword Gap Analysis</Card.Title>
            <Card.Description>
              Discover missing keywords and skills between your CV and job requirements.
            </Card.Description>
          </FeatureCard>

          <FeatureCard variant="elevated">
            <FeatureIcon>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5M9 11.25v1.5M12 9v3.75m3-6v6" />
              </svg>
            </FeatureIcon>
            <Card.Title>Seniority Match</Card.Title>
            <Card.Description>
              See if your experience level aligns with the job requirements.
            </Card.Description>
          </FeatureCard>

          <FeatureCard variant="elevated">
            <FeatureIcon>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
              </svg>
            </FeatureIcon>
            <Card.Title>AI Recommendations</Card.Title>
            <Card.Description>
              Get personalized suggestions to improve your CV and increase match rates.
            </Card.Description>
          </FeatureCard>
        </FeatureGrid>
      </Features>
    </>
  );
}