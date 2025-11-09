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


  @media (max-width: 450px) {
    padding: ${({ theme }) => theme.spacing["lg"]};
    padding-top: 52px;
  }
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
  @media (max-width: 410px) {
    margin-right: 10px;
  }
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
  @media (max-width: 375px) {
  font-size: 13px;
  }
`;

const MatchQualityBadge = styled.div<{ $quality: 'low' | 'medium' | 'high' }>`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
  border-radius: ${({ theme }) => theme.radius.full};
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  text-transform: uppercase;
  letter-spacing: 0.5px;

  ${({ $quality, theme }) => {
    if ($quality === 'high') {
      return `
        background: linear-gradient(135deg, #10b981 0%, #059669 100%);
        color: white;
      `;
    } else if ($quality === 'medium') {
      return `
        background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
        color: white;
      `;
    } else {
      return `
        background: linear-gradient(135deg, #6b7280 0%, #4b5563 100%);
        color: white;
      `;
    }
  }}
`;

const ScoreImprovement = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  margin-top: ${({ theme }) => theme.spacing.xs};
`;

const BeforeScore = styled.span`
  color: ${({ theme }) => theme.colors.textSecondary};
  text-decoration: line-through;
`;

const AfterScore = styled.span`
  color: #10b981;
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
`;

const ImprovementArrow = styled.span`
  color: #10b981;
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
`;

const FakeItIndicator = styled.div`
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.md};
  background: linear-gradient(135deg, #f59e0b 0%, #ea580c 100%);
  color: white;
  border-radius: ${({ theme }) => theme.radius.full};
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  text-transform: uppercase;
  letter-spacing: 0.5px;
  box-shadow: 0 4px 12px rgba(245, 158, 11, 0.3);
  animation: pulse 2s ease-in-out infinite;

  &::before {
    content: '';
    position: absolute;
    inset: -2px;
    background: linear-gradient(135deg, #f59e0b 0%, #ea580c 100%);
    border-radius: ${({ theme }) => theme.radius.full};
    opacity: 0.3;
    filter: blur(8px);
    z-index: -1;
  }

  @keyframes pulse {
    0%, 100% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.05);
    }
  }
`;

const FakeItBanner = styled.div`
  position: absolute;
  top: -10px;
  right: 12px;
  background: linear-gradient(135deg, #f59e0b 0%, #ea580c 100%);
  color: white;
  padding: 6px 16px;
  font-size: 10px;
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 0.8px;
  box-shadow: 0 4px 12px rgba(245, 158, 11, 0.4);
  border-radius: 6px 6px 0 0;
  z-index: 10;
  display: flex;
  align-items: center;
  gap: 4px;

  &::before {
    content: '🚀';
  }
`;

const ReportCardWithFakeIt = styled(ReportCard)<{ $fakeItMode?: boolean }>`
  ${({ $fakeItMode }) =>
    $fakeItMode &&
    `
    position: relative;
    border: 2px solid rgba(245, 158, 11, 0.3);
    margin-top: 12px;
    overflow: visible;

    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 3px;
      background: linear-gradient(90deg, #f59e0b 0%, #ea580c 100%);
    }

    &:hover {
      border-color: rgba(245, 158, 11, 0.5);
      box-shadow: 0 8px 24px rgba(245, 158, 11, 0.15);
    }
  `}
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
  optimized_score: number | null;
  fake_it_mode: boolean | null;
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

  const getMatchQuality = (score: number): { quality: 'low' | 'medium' | 'high'; label: string } => {
    if (score >= 75) {
      return { quality: 'high', label: '✨ Excellent Match' };
    } else if (score >= 50) {
      return { quality: 'medium', label: '📈 Growth Potential' };
    } else {
      return { quality: 'low', label: '💡 Consider Alternatives' };
    }
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
            <ReportCardWithFakeIt
              key={report.id}
              variant="elevated"
              onClick={() => router.push(ROUTES.APP.REPORT_DETAIL(report.id))}
              $fakeItMode={report.fake_it_mode}
            >
              {report.fake_it_mode && (
                <FakeItBanner>
                  Fake It Mode
                </FakeItBanner>
              )}
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
                      <span style={{ color: "#6b7280", fontWeight: "600" }}>
                        {report.job_ids
                          .map((id) => jobTitlesMap[id] || "Unknown")
                          .join(" • ")}
                      </span>
                    </div>
                  )}
                  {report.optimized_score && report.optimized_score > report.fit_score && (
                    <ScoreImprovement>
                      <BeforeScore>{report.fit_score}%</BeforeScore>
                      <ImprovementArrow>→</ImprovementArrow>
                      <AfterScore>{report.optimized_score}%</AfterScore>
                      <span style={{ fontSize: "11px", color: "#10b981" }}>
                        (+{report.optimized_score - report.fit_score}%)
                      </span>
                    </ScoreImprovement>
                  )}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px' }}>
                  <ScoreBadge variant={getScoreColor(report.fit_score)}>
                    {report.fit_score}% Match
                  </ScoreBadge>
                  <MatchQualityBadge $quality={getMatchQuality(report.fit_score).quality}>
                    {getMatchQuality(report.fit_score).label}
                  </MatchQualityBadge>
                </div>
              </ReportHeader>
              <ReportMeta>
                <Badge size="sm">
                  {report.keywords?.missing?.length || 0} Missing Keywords
                </Badge>
                <Badge variant={report.pro ? "info" : "default"} size="sm">
                  {report.pro ? "Pro Report" : "Free Report"}
                </Badge>
              </ReportMeta>
            </ReportCardWithFakeIt>
          ))}
        </ReportsList>
      )}
    </Container>
  );
}
