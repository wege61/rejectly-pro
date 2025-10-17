'use client';

import styled from 'styled-components';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { useParams, useRouter } from 'next/navigation';

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: ${({ theme }) => theme.spacing['2xl']};
`;

const BackButton = styled(Button)`
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const Header = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing['2xl']};
`;

const Title = styled.h1`
  font-size: ${({ theme }) => theme.typography.fontSize['3xl']};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const HeaderMeta = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  flex-wrap: wrap;
  align-items: center;
`;

const Grid = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.spacing.lg};
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  margin-bottom: ${({ theme }) => theme.spacing['2xl']};
`;

const ScoreCard = styled(Card)`
  text-align: center;
`;

const ScoreValue = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize['5xl']};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const ScoreLabel = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const Section = styled.section`
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const SectionTitle = styled.h2`
  font-size: ${({ theme }) => theme.typography.fontSize.xl};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const KeywordList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const BulletList = styled.ul`
  list-style: disc;
  padding-left: ${({ theme }) => theme.spacing.lg};
  
  li {
    margin-bottom: ${({ theme }) => theme.spacing.sm};
    color: ${({ theme }) => theme.colors.textPrimary};
  }
`;

export default function ReportDetailPage() {
  const params = useParams();
  const router = useRouter();
  const reportId = params.id as string;

  // Mock data - gerçek data Supabase'den gelecek
  const report = {
    id: reportId,
    title: 'Senior Frontend Developer Analysis',
    fitScore: 85,
    isPro: true,
    createdAt: '2025-10-17',
    missingKeywords: ['Docker', 'Kubernetes', 'AWS', 'GraphQL', 'Testing'],
    rewrittenBullets: [
      'Led development of 5+ large-scale React applications using TypeScript and Next.js, improving performance by 40%',
      'Architected and implemented component library with 50+ reusable components using styled-components',
      'Mentored team of 3 junior developers and established best practices for code quality and testing',
    ],
    roleRecommendations: [
      { title: 'Senior Frontend Engineer', fit: 90 },
      { title: 'Lead React Developer', fit: 85 },
      { title: 'Full Stack Developer', fit: 75 },
    ],
    atsFlags: [
      'Include specific years of experience (e.g., "5+ years")',
      'Add quantifiable achievements with metrics',
      'Include industry-standard keywords from job description',
    ],
  };

  return (
    <Container>
      <BackButton 
        variant="ghost" 
        size="sm"
        onClick={() => router.back()}
      >
        ← Back
      </BackButton>

      <Header>
        <Title>{report.title}</Title>
        <HeaderMeta>
          <Badge variant={report.isPro ? 'info' : 'default'}>
            {report.isPro ? 'Pro Report' : 'Free Report'}
          </Badge>
          <span style={{ color: '#9ca3af', fontSize: '14px' }}>
            Created on {new Date(report.createdAt).toLocaleDateString('tr-TR')}
          </span>
        </HeaderMeta>
      </Header>

      <Grid>
        <ScoreCard variant="elevated">
          <ScoreValue>{report.fitScore}%</ScoreValue>
          <ScoreLabel>Match Score</ScoreLabel>
        </ScoreCard>

        <ScoreCard variant="elevated">
          <ScoreValue>{report.missingKeywords.length}</ScoreValue>
          <ScoreLabel>Missing Keywords</ScoreLabel>
        </ScoreCard>

        <ScoreCard variant="elevated">
          <ScoreValue>{report.roleRecommendations.length}</ScoreValue>
          <ScoreLabel>Role Recommendations</ScoreLabel>
        </ScoreCard>
      </Grid>

      <Section>
        <Card variant="bordered">
          <Card.Header>
            <Card.Title>Missing Keywords</Card.Title>
            <Card.Description>
              Add these keywords to improve your match score
            </Card.Description>
          </Card.Header>
          <Card.Content>
            <KeywordList>
              {report.missingKeywords.map((keyword) => (
                <Badge key={keyword} variant="warning">
                  {keyword}
                </Badge>
              ))}
            </KeywordList>
          </Card.Content>
        </Card>
      </Section>

      {report.isPro && (
        <>
          <Section>
            <Card variant="bordered">
              <Card.Header>
                <Card.Title>Rewritten Bullet Points</Card.Title>
                <Card.Description>
                  Improved versions of your experience bullets
                </Card.Description>
              </Card.Header>
              <Card.Content>
                <BulletList>
                  {report.rewrittenBullets.map((bullet, index) => (
                    <li key={index}>{bullet}</li>
                  ))}
                </BulletList>
              </Card.Content>
            </Card>
          </Section>

          <Section>
            <Card variant="bordered">
              <Card.Header>
                <Card.Title>Role Recommendations</Card.Title>
                <Card.Description>
                  Alternative roles that match your profile
                </Card.Description>
              </Card.Header>
              <Card.Content>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {report.roleRecommendations.map((role) => (
                    <div
                      key={role.title}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '12px',
                        backgroundColor: '#f9fafb',
                        borderRadius: '8px',
                      }}
                    >
                      <span style={{ fontWeight: 500 }}>{role.title}</span>
                      <Badge variant="success">{role.fit}% Match</Badge>
                    </div>
                  ))}
                </div>
              </Card.Content>
            </Card>
          </Section>

          <Section>
            <Card variant="bordered">
              <Card.Header>
                <Card.Title>ATS Optimization Tips</Card.Title>
                <Card.Description>
                  Improve your chances with applicant tracking systems
                </Card.Description>
              </Card.Header>
              <Card.Content>
                <BulletList>
                  {report.atsFlags.map((flag, index) => (
                    <li key={index}>{flag}</li>
                  ))}
                </BulletList>
              </Card.Content>
            </Card>
          </Section>
        </>
      )}

      <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
        <Button variant="secondary">Download PDF</Button>
        {!report.isPro && (
          <Button>Upgrade to Pro Report - $9</Button>
        )}
      </div>
    </Container>
  );
}