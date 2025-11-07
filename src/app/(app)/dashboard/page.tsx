"use client";

import styled from "styled-components";
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";
import { DashboardSkeleton } from "@/components/skeletons/DashboardSkeleton";
import { ROUTES } from "@/lib/constants";
import { useAuth } from "@/hooks/useAuth";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: ${({ theme }) => theme.spacing["2xl"]};
  padding-bottom: 100px; /* Space for FAB */
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
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const SectionTitle = styled.h2`
  font-size: ${({ theme }) => theme.typography.fontSize.xl};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
`;

const QuickActionsGrid = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.spacing.lg};
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
`;

const ActionCard = styled(Card)`
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.normal};

  &:hover {
    transform: translateY(-4px);
    box-shadow: ${({ theme }) => theme.shadow.lg};
  }
`;

const ReportsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
`;

const ReportCard = styled(Card)`
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.normal};

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${({ theme }) => theme.shadow.md};
  }
`;

const ReportHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: start;
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const ReportTitle = styled.h3`
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.textPrimary};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

const ReportDate = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const ScoreBadge = styled(Badge)`
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  padding: ${({ theme }) => `${theme.spacing.xs} ${theme.spacing.md}`};
`;

const ReportMeta = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
  flex-wrap: wrap;
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const ReportSummary = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
  line-height: ${({ theme }) => theme.typography.lineHeight.relaxed};
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

// Floating Action Button (FAB)
const FAB = styled.button`
  position: fixed;
  bottom: ${({ theme }) => theme.spacing["2xl"]};
  right: ${({ theme }) => theme.spacing["2xl"]};
  width: 64px;
  height: 64px;
  border-radius: ${({ theme }) => theme.radius.full};
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8px 24px rgba(102, 126, 234, 0.4);
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.normal};
  z-index: ${({ theme }) => theme.zIndex.fixed};
  border: none;

  &:hover {
    transform: scale(1.1) translateY(-2px);
    box-shadow: 0 12px 32px rgba(102, 126, 234, 0.5);
  }

  &:active {
    transform: scale(0.95);
  }

  svg {
    width: 28px;
    height: 28px;
  }
`;

const FABTooltip = styled.div`
  position: absolute;
  right: 80px;
  background: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.textPrimary};
  padding: ${({ theme }) => `${theme.spacing.sm} ${theme.spacing.md}`};
  border-radius: ${({ theme }) => theme.radius.md};
  white-space: nowrap;
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  box-shadow: ${({ theme }) => theme.shadow.lg};
  opacity: 0;
  pointer-events: none;
  transition: opacity ${({ theme }) => theme.transitions.fast};

  ${FAB}:hover & {
    opacity: 1;
  }

  &::after {
    content: "";
    position: absolute;
    right: -6px;
    top: 50%;
    transform: translateY(-50%);
    width: 0;
    height: 0;
    border-left: 6px solid ${({ theme }) => theme.colors.surface};
    border-top: 6px solid transparent;
    border-bottom: 6px solid transparent;
  }
`;

const PlusIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={2.5}
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 4.5v15m7.5-7.5h-15"
    />
  </svg>
);

interface Stats {
  totalReports: number;
  totalCVs: number;
  totalJobs: number;
}

interface Report {
  id: string;
  created_at: string;
  fit_score: number;
  summary_free: string;
  pro: boolean;
  job_ids: string[];
  keywords: {
    missing?: string[];
  } | null;
}

export default function DashboardPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState<Stats>({
    totalReports: 0,
    totalCVs: 0,
    totalJobs: 0,
  });
  const [recentReports, setRecentReports] = useState<Report[]>([]);
  const [jobTitlesMap, setJobTitlesMap] = useState<Record<string, string>>({});

  useEffect(() => {
    async function fetchDashboardData() {
      if (!user) return;

      try {
        const supabase = createClient();

        // Fetch stats
        const [reportsRes, cvsRes, jobsRes] = await Promise.all([
          supabase
            .from("reports")
            .select("id", { count: "exact", head: true })
            .eq("user_id", user.id),
          supabase
            .from("documents")
            .select("id", { count: "exact", head: true })
            .eq("user_id", user.id)
            .eq("type", "cv"),
          supabase
            .from("documents")
            .select("id", { count: "exact", head: true })
            .eq("user_id", user.id)
            .eq("type", "job"),
        ]);

        setStats({
          totalReports: reportsRes.count || 0,
          totalCVs: cvsRes.count || 0,
          totalJobs: jobsRes.count || 0,
        });

        // Fetch recent reports
        const { data: reports } = await supabase
          .from("reports")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
          .limit(5);

        if (reports) {
          setRecentReports(reports);

          // Collect all unique job IDs from reports
          const allJobIds = new Set<string>();
          reports.forEach((report) => {
            if (report.job_ids && Array.isArray(report.job_ids)) {
              report.job_ids.forEach((id) => allJobIds.add(id));
            }
          });

          // Fetch all job titles in one query
          if (allJobIds.size > 0) {
            const { data: jobDocs } = await supabase
              .from("documents")
              .select("id, title")
              .in("id", Array.from(allJobIds))
              .eq("type", "job");

            if (jobDocs) {
              const titlesMap: Record<string, string> = {};
              jobDocs.forEach((doc) => {
                titlesMap[doc.id] = doc.title;
              });
              setJobTitlesMap(titlesMap);
            }
          }
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchDashboardData();
  }, [user]);

  const getScoreColor = (score: number): "success" | "warning" | "error" => {
    if (score >= 75) return "success";
    if (score >= 50) return "warning";
    return "error";
  };

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  return (
    <>
      <Container>
        <Header>
          <Title>Dashboard</Title>
          <Subtitle>
            Welcome back, {user?.user_metadata?.name || "User"}! Here&apos;s
            your overview.
          </Subtitle>
        </Header>

        {/* Stats */}
        <Grid>
          <StatCard variant="elevated">
            <StatValue>{stats.totalReports}</StatValue>
            <StatLabel>Total Reports</StatLabel>
          </StatCard>
          <StatCard variant="elevated">
            <StatValue>{stats.totalCVs}</StatValue>
            <StatLabel>CVs Uploaded</StatLabel>
          </StatCard>
          <StatCard variant="elevated">
            <StatValue>{stats.totalJobs}</StatValue>
            <StatLabel>Job Postings</StatLabel>
          </StatCard>
        </Grid>

        {/* Quick Actions */}
        <Section>
          <SectionHeader>
            <SectionTitle>Quick Actions</SectionTitle>
          </SectionHeader>
          <QuickActionsGrid>
            <ActionCard
              variant="elevated"
              onClick={() => router.push(ROUTES.APP.CV)}
            >
              <Card.Header>
                <Card.Title>Upload CV</Card.Title>
                <Card.Description>
                  Add a new CV to analyze against job postings
                </Card.Description>
              </Card.Header>
            </ActionCard>
            <ActionCard
              variant="elevated"
              onClick={() => router.push(ROUTES.APP.JOBS)}
            >
              <Card.Header>
                <Card.Title>Add Job Posting</Card.Title>
                <Card.Description>
                  Save job postings to compare with your CV
                </Card.Description>
              </Card.Header>
            </ActionCard>
          </QuickActionsGrid>
        </Section>

        {/* Recent Reports */}
        <Section>
          <SectionHeader>
            <SectionTitle>Recent Reports</SectionTitle>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => router.push(ROUTES.APP.REPORTS)}
            >
              View All
            </Button>
          </SectionHeader>

          {recentReports.length === 0 ? (
            <Card variant="bordered">
              <EmptyState
                icon={<EmptyState.DocumentIcon />}
                title="No reports yet"
                description="Create your first analysis to see results here."
                action={{
                  label: "Create Analysis",
                  onClick: () => router.push(ROUTES.APP.ANALYZE),
                }}
              />
            </Card>
          ) : (
            <ReportsList>
              {recentReports.map((report) => (
                <ReportCard
                  key={report.id}
                  variant="elevated"
                  onClick={() =>
                    router.push(ROUTES.APP.REPORT_DETAIL(report.id))
                  }
                >
                  <ReportHeader>
                    <div>
                      <ReportTitle>CV Analysis Report</ReportTitle>
                      <ReportDate>
                        Created on{" "}
                        {new Date(report.created_at).toLocaleDateString(
                          "en-EN",
                          {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          }
                        )}
                      </ReportDate>
                      {report.job_ids && report.job_ids.length > 0 && (
                        <div style={{ marginTop: "4px", fontSize: "13px" }}>
                          <span style={{ color: "#6b7280", fontWeight: "500" }}>
                            Job{report.job_ids.length > 1 ? "s" : ""}:{" "}
                          </span>
                          <span style={{ color: "#6b7280", fontWeight: "600" }}>
                            {report.job_ids
                              .map((id) => jobTitlesMap[id] || "Unknown")
                              .join(" • ")}
                          </span>
                        </div>
                      )}
                    </div>
                    <ScoreBadge variant={getScoreColor(report.fit_score)}>
                      {report.fit_score}% Match
                    </ScoreBadge>
                  </ReportHeader>
                  <ReportMeta>
                    <Badge size="sm">
                      {report.keywords?.missing?.length || 0} Missing Keywords
                    </Badge>
                    <Badge variant={report.pro ? "info" : "default"} size="sm">
                      {report.pro ? "Pro Report" : "Free Report"}
                    </Badge>
                  </ReportMeta>
                  <ReportSummary>{report.summary_free}</ReportSummary>
                </ReportCard>
              ))}
            </ReportsList>
          )}
        </Section>
      </Container>

      {/* Floating Action Button */}
      <FAB onClick={() => router.push(ROUTES.APP.ANALYZE)}>
        <FABTooltip>New Analysis</FABTooltip>
        <PlusIcon />
      </FAB>
    </>
  );
}
