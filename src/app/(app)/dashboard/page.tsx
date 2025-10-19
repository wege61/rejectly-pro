"use client";

import styled from "styled-components";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

import { EmptyState } from "@/components/ui/EmptyState";
import { ROUTES } from "@/lib/constants";

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: ${({ theme }) => theme.spacing["2xl"]};
`;

const Header = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing["2xl"]};
`;

const Title = styled.h1`
  font-size: ${({ theme }) => theme.typography.fontSize["3xl"]};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const Subtitle = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const Grid = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.spacing.lg};
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  margin-bottom: ${({ theme }) => theme.spacing["2xl"]};
`;

const StatCard = styled(Card)`
  text-align: center;
`;

const StatValue = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize["4xl"]};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const StatLabel = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const Section = styled.section`
  margin-bottom: ${({ theme }) => theme.spacing["2xl"]};
`;

const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const SectionTitle = styled.h2`
  font-size: ${({ theme }) => theme.typography.fontSize.xl};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
`;

export default function DashboardPage() {
  // Mock data - gerçek data Supabase'den gelecek
  const hasReports = false;

  return (
    <Container>
      <Header>
        <Title>Dashboard</Title>
        <Subtitle>CV analizlerinize ve raporlarınıza genel bakış</Subtitle>
      </Header>

      <Grid>
        <StatCard variant="bordered">
          <StatValue>0</StatValue>
          <StatLabel>Total Analyses</StatLabel>
        </StatCard>

        <StatCard variant="bordered">
          <StatValue>0</StatValue>
          <StatLabel>Pro Reports</StatLabel>
        </StatCard>

        <StatCard variant="bordered">
          <StatValue>-</StatValue>
          <StatLabel>Avg Match Score</StatLabel>
        </StatCard>
      </Grid>

      <Section>
        <SectionHeader>
          <SectionTitle>Recent Reports</SectionTitle>
          <Button size="sm" onClick={() => (window.location.href = "/analyze")}>
            New Analysis
          </Button>
        </SectionHeader>

        {!hasReports ? (
          <Card variant="bordered">
            <EmptyState
              icon={<EmptyState.DocumentIcon />}
              title="No reports yet"
              description="Upload your CV and start analyzing job postings to see your first report here."
              action={{
                label: "Upload CV",
                onClick: () => (window.location.href = ROUTES.APP.CV),
              }}
            />
          </Card>
        ) : (
          // Reports list will go here
          <div>Reports list placeholder</div>
        )}
      </Section>
    </Container>
  );
}
