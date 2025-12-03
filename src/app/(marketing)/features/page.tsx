'use client';

import styled from 'styled-components';
import { BreadcrumbSchema } from '@/components/seo/StructuredData';

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: ${({ theme }) => theme.spacing['3xl']} ${({ theme }) => theme.spacing.lg};
`;

const Title = styled.h1`
  font-size: ${({ theme }) => theme.typography.fontSize['4xl']};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  text-align: center;
`;

export default function FeaturesPage() {
  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: 'https://www.rejectly.pro' },
          { name: 'Features', url: 'https://www.rejectly.pro/features' }
        ]}
      />
      {/* Features ItemList Schema */}
      <script
        id="features-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'ItemList',
            name: 'Rejectly.pro Features',
            description: 'AI-powered resume optimization features to help you land more interviews',
            itemListElement: [
              {
                '@type': 'ListItem',
                position: 1,
                name: 'AI Resume Analysis',
                description: 'GPT-4 powered analysis that identifies gaps, keywords, and optimization opportunities in seconds',
              },
              {
                '@type': 'ListItem',
                position: 2,
                name: 'ATS Optimization',
                description: 'Ensure your resume passes Applicant Tracking Systems with keyword optimization and formatting recommendations',
              },
              {
                '@type': 'ListItem',
                position: 3,
                name: 'Job Matching Algorithm',
                description: 'AI-powered matching between your resume and job descriptions to identify compatibility and gaps',
              },
              {
                '@type': 'ListItem',
                position: 4,
                name: 'Professional Rewriting',
                description: 'Get 3 bullet points professionally rewritten by AI to showcase your achievements effectively',
              },
              {
                '@type': 'ListItem',
                position: 5,
                name: 'Cover Letter Generator',
                description: 'Create personalized, compelling cover letters in 30 seconds tailored to each job application',
              },
              {
                '@type': 'ListItem',
                position: 6,
                name: 'Alternative Role Suggestions',
                description: 'Discover other suitable positions based on your skills and experience with AI recommendations',
              },
            ],
          })
        }}
      />
      <Container>
        <Title>Features</Title>
        <p style={{ textAlign: 'center', color: '#6b7280' }}>
          Features page coming soon...
        </p>
      </Container>
    </>
  );
}