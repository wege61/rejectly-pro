'use client';

import styled from 'styled-components';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { EmptyState } from '@/components/ui/EmptyState';
import { ROUTES } from '@/lib/constants';

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: ${({ theme }) => theme.spacing['2xl']};
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${({ theme }) => theme.spacing['2xl']};
`;

const HeaderContent = styled.div``;

const Title = styled.h1`
  font-size: ${({ theme }) => theme.typography.fontSize['3xl']};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const Subtitle = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const ReportsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
`;

const ReportCard = styled(Card)`
  cursor: pointer;
  transition: transform ${({ theme }) => theme.transitions.fast};
  
  &:hover {
    transform: translateY(-2px);
  }
`;

const ReportHeader = styled.div`
  display: flex;
  align-items: start;
  justify-content: space-between;
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const ReportTitle = styled.h3`
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

const ReportDate = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const ReportMeta = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
  flex-wrap: wrap;
`;

export default function ReportsPage() {
  // Mock data - gerçek data Supabase'den gelecek
  const reports: any[] = [];

  return (
    <Container>
      <Header>
        <HeaderContent>
          <Title>My Reports</Title>
          <Subtitle>View and manage your CV analysis reports</Subtitle>
        </HeaderContent>
        <Button onClick={() => window.location.href = ROUTES.APP.CV}>
          New Analysis
        </Button>
      </Header>

      {reports.length === 0 ? (
        <Card variant="bordered">
          <EmptyState
            icon={<EmptyState.FolderIcon />}
            title="No reports yet"
            description="Create your first analysis report by uploading your CV and adding job postings."
            action={{
              label: 'Get Started',
              onClick: () => window.location.href = ROUTES.APP.CV,
            }}
          />
        </Card>
      ) : (
        <ReportsList>
          {/* Mock report card for UI demonstration */}
          <ReportCard 
            variant="elevated"
            onClick={() => window.location.href = ROUTES.APP.REPORT_DETAIL('demo')}
          >
            <ReportHeader>
              <div>
                <ReportTitle>Senior Frontend Developer Analysis</ReportTitle>
                <ReportDate>Created on Oct 17, 2025</ReportDate>
              </div>
              <Badge variant="success">85% Match</Badge>
            </ReportHeader>
            <ReportMeta>
              <Badge size="sm">React</Badge>
              <Badge size="sm">TypeScript</Badge>
              <Badge size="sm">Next.js</Badge>
              <Badge variant="info" size="sm">Pro Report</Badge>
            </ReportMeta>
          </ReportCard>
        </ReportsList>
      )}
    </Container>
  );
}