"use client";

import styled from "styled-components";
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";
import { Spinner } from "@/components/ui/Spinner";
import { ROUTES } from "@/lib/constants";
import { useAuth } from "@/hooks/useAuth";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

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
`;

const ReportTitle = styled.h3`
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

const ReportDate = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
`;

interface Report {
  id: string;
  fit_score: number;
  pro: boolean;
  created_at: string;
}

export default function DashboardPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [reports, setReports] = useState<Report[]>([]);
  const [stats, setStats] = useState({
    totalAnalyses: 0,
    proReports: 0,
    avgMatchScore: 0,
  });
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    async function fetchData() {
      if (!user) return;

      const supabase = createClient();
      const { data } = await supabase
        .from("reports")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(5);

      if (data && data.length > 0) {
        setReports(data);

        // Calculate stats
        const totalAnalyses = data.length;
        const proReports = data.filter((r) => r.pro).length;
        const avgMatchScore = Math.round(
          data.reduce((sum, r) => sum + r.fit_score, 0) / data.length
        );

        setStats({
          totalAnalyses,
          proReports,
          avgMatchScore,
        });
      }

      setIsLoading(false);
    }

    fetchData();
  }, [user]);

  const getScoreColor = (score: number): "success" | "warning" | "error" => {
    if (score >= 75) return "success";
    if (score >= 50) return "warning";
    return "error";
  };

  if (isLoading) {
    return (
      <Container>
        <Spinner centered size="xl" />
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <Title>Dashboard</Title>
        <Subtitle>CV analizlerinize ve raporlarınıza genel bakış</Subtitle>
      </Header>

      <Grid>
        <StatCard variant="bordered">
          <StatValue>{stats.totalAnalyses}</StatValue>
          <StatLabel>Total Analyses</StatLabel>
        </StatCard>

        <StatCard variant="bordered">
          <StatValue>{stats.proReports}</StatValue>
          <StatLabel>Pro Reports</StatLabel>
        </StatCard>

        <StatCard variant="bordered">
          <StatValue>
            {stats.avgMatchScore > 0 ? `${stats.avgMatchScore}%` : "-"}
          </StatValue>
          <StatLabel>Avg Match Score</StatLabel>
        </StatCard>
      </Grid>

      <Section>
        <SectionHeader>
          <SectionTitle>Recent Reports</SectionTitle>
          <Button size="sm" onClick={() => router.push("/analyze")}>
            New Analysis
          </Button>
        </SectionHeader>

        {reports.length === 0 ? (
          <Card variant="bordered">
            <EmptyState
              icon={<EmptyState.DocumentIcon />}
              title="No reports yet"
              description="Upload your CV and start analyzing job postings to see your first report here."
              action={{
                label: "Upload CV",
                onClick: () => router.push(ROUTES.APP.CV),
              }}
            />
          </Card>
        ) : (
          <ReportsList>
            {reports.map((report) => (
              <ReportCard
                key={report.id}
                variant="elevated"
                onClick={() => router.push(ROUTES.APP.REPORT_DETAIL(report.id))}
              >
                <ReportHeader>
                  <div>
                    <ReportTitle>CV Analysis Report</ReportTitle>
                    <ReportDate>
                      {new Date(report.created_at).toLocaleDateString("tr-TR")}
                    </ReportDate>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      gap: "8px",
                      alignItems: "center",
                    }}
                  >
                    <Badge variant={getScoreColor(report.fit_score)}>
                      {report.fit_score}% Match
                    </Badge>
                    {report.pro && (
                      <Badge variant="info" size="sm">
                        Pro
                      </Badge>
                    )}
                  </div>
                </ReportHeader>
              </ReportCard>
            ))}
          </ReportsList>
        )}
      </Section>
    </Container>
  );
}
