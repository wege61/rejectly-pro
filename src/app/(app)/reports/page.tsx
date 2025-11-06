"use client";

import styled from "styled-components";
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";
import { ReportsListSkeleton } from "@/components/skeletons/ReportsListSkeleton";
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
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${({ theme }) => theme.spacing["2xl"]};
`;

const HeaderContent = styled.div``;

const Title = styled.h1`
  font-size: ${({ theme }) => theme.typography.fontSize["3xl"]};
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

const ScoreBadge = styled(Badge)`
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  padding: ${({ theme }) => `${theme.spacing.xs} ${theme.spacing.md}`};
`;

interface Report {
  id: string;
  fit_score: number;
  summary_free: string;
  keywords: {
    missing?: string[];
  } | null;
  pro: boolean;
  created_at: string;
  job_ids: string[];
}

export default function ReportsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [reports, setReports] = useState<Report[]>([]);
  const [jobTitlesMap, setJobTitlesMap] = useState<Record<string, string>>({});
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    async function fetchReports() {
      if (!user) return;

      const supabase = createClient();
      const { data } = await supabase
        .from("reports")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (data) {
        setReports(data);

        // Collect all unique job IDs from all reports
        const allJobIds = new Set<string>();
        data.forEach((report) => {
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

      setIsLoading(false);
    }

    fetchReports();
  }, [user]);

  const getScoreColor = (score: number): "success" | "warning" | "error" => {
    if (score >= 75) return "success";
    if (score >= 50) return "warning";
    return "error";
  };

  if (isLoading) {
    return <ReportsListSkeleton />;
  }

  return (
    <Container>
      <Header>
        <HeaderContent>
          <Title>My Reports</Title>
          <Subtitle>View and manage your CV analysis reports</Subtitle>
        </HeaderContent>
        <Button onClick={() => router.push(ROUTES.APP.ANALYZE)}>
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
              label: "Get Started",
              onClick: () => router.push(ROUTES.APP.ANALYZE),
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
                    Created on{" "}
                    {new Date(report.created_at).toLocaleDateString("en-EN", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </ReportDate>
                  {report.job_ids && report.job_ids.length > 0 && (
                    <div style={{ marginTop: "4px", fontSize: "13px" }}>
                      <span style={{ color: "#6b7280", fontWeight: "500" }}>
                        Job{report.job_ids.length > 1 ? "s" : ""}:{" "}
                      </span>
                      <span style={{ color: "#1f2937", fontWeight: "600" }}>
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
            </ReportCard>
          ))}
        </ReportsList>
      )}
    </Container>
  );
}
