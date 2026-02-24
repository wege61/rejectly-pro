"use client";

import styled, { keyframes, css } from "styled-components";
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { ReportsListSkeleton } from "@/components/skeletons/ReportsListSkeleton";
import { Modal } from "@/components/ui/Modal";
import { ROUTES } from "@/lib/constants";
import { useAuth } from "@/hooks/useAuth";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useToast } from "@/contexts/ToastContext";

// Icons
const DeleteIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    <line x1="10" y1="11" x2="10" y2="17" />
    <line x1="14" y1="11" x2="14" y2="17" />
  </svg>
);

const ArrowRightIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M5 12h14M12 5l7 7-7 7" />
  </svg>
);

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 36px ${({ theme }) => theme.spacing["2xl"]} 120px;

  @media (max-width: 768px) {
    padding: 70px 16px 120px;
  }
`;

const Header = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing["xl"]};
`;

const HeaderContent = styled.div``;

const Title = styled.h1`
  font-size: 34px;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.97);
  margin-bottom: 8px;
  letter-spacing: -0.04em;
  line-height: 1.1;

  @media (max-width: 768px) {
    font-size: 26px;
  }
`;

const Subtitle = styled.p`
  font-size: 15px;
  color: rgba(255, 255, 255, 0.4);
  line-height: 1.6;
  letter-spacing: -0.01em;
  max-width: 580px;
`;

const ReportsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
  gap: 16px;

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

const CategorySection = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing["2xl"]};

  &:last-child {
    margin-bottom: 0;
  }
`;

const CategoryHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const CategoryBadge = styled.span<{ $variant: 'excellent' | 'good' | 'fair' | 'poor' }>`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 5px 14px;
  border-radius: 9999px;
  font-size: 13px;
  font-weight: 600;

  /* Liquid Glass pill */
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);

  ${({ $variant }) => {
    switch ($variant) {
      case 'excellent':
        return `
          color: var(--primary-500);
          background: rgba(var(--primary-rgb, 99,210,178), 0.1);
          border: 1px solid rgba(var(--primary-rgb, 99,210,178), 0.2);
        `;
      case 'good':
        return `
          color: #60a5fa;
          background: rgba(96,165,250, 0.1);
          border: 1px solid rgba(96,165,250, 0.2);
        `;
      case 'fair':
        return `
          color: #fbbf24;
          background: rgba(251,191,36, 0.1);
          border: 1px solid rgba(251,191,36, 0.2);
        `;
      case 'poor':
        return `
          color: #fb923c;
          background: rgba(249,115,22, 0.1);
          border: 1px solid rgba(249,115,22, 0.2);
        `;
    }
  }}
`;

const CategoryCount = styled.span`
  font-size: 13px;
  color: var(--text-secondary);
`;

const ReportCard = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  overflow: hidden;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  min-height: 200px;

  /* Liquid Glass card — stronger contrast */
  background: rgba(30, 30, 40, 0.78);
  backdrop-filter: blur(30px) saturate(160%);
  -webkit-backdrop-filter: blur(30px) saturate(160%);
  border: 1px solid rgba(255, 255, 255, 0.14);
  box-shadow:
    0 2px 1px rgba(255, 255, 255, 0.06) inset,
    0 8px 32px rgba(0, 0, 0, 0.55),
    0 2px 8px rgba(0, 0, 0, 0.4);

  &:hover {
    transform: translateY(-5px) scale(1.01);
    border-color: rgba(255, 255, 255, 0.22);
    box-shadow:
      0 2px 1px rgba(255, 255, 255, 0.08) inset,
      0 20px 56px rgba(0, 0, 0, 0.65),
      0 6px 20px rgba(0, 0, 0, 0.45);
  }

  &:hover .report-content {
    transform: translateY(-32px);
  }

  &:hover .report-cta {
    transform: translateY(0);
    opacity: 1;
  }

  @media (max-width: 1024px) {
    &:hover .report-content {
      transform: none;
    }
  }
`;

const FakeItBanner = styled.div`
  position: absolute;
  top: 12px;
  left: 12px;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(12px);
  color: rgba(255, 255, 255, 0.75);
  padding: 4px 10px;
  font-size: 11px;
  font-weight: 500;
  border-radius: 9999px;
  z-index: 10;
  display: flex;
  align-items: center;
  gap: 4px;
`;

const CardContent = styled.div`
  padding: 24px;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  position: relative;
  z-index: 1;
`;

const ContentInner = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  transform-origin: bottom left;
  transition: all 0.3s ease;

  @media (max-width: 1024px) {
    transform: none !important;
  }
`;

const ScoreDisplay = styled.div`
  margin-bottom: 8px;
  display: flex;
  align-items: flex-end;
`;

const ScoreValue = styled.span<{ $category: 'excellent' | 'good' | 'fair' | 'poor' }>`
  font-size: 48px;
  font-weight: 700;
  color: ${({ $category }) => {
    switch ($category) {
      case 'excellent':
        return 'var(--primary-500)';
      case 'good':
        return '#2A57A0';
      case 'fair':
        return '#EAB308';
      case 'poor':
        return '#F97316';
    }
  }};
  line-height: 1;

  &::after {
    content: '%';
    font-size: 24px;
    margin-left: 2px;
    opacity: 0.7;
  }

  @media (max-width: 640px) {
    font-size: 40px;

    &::after {
      font-size: 20px;
    }
  }
`;

const OriginalScore = styled.span`
  font-size: 28px;
  font-weight: 600;
  color: var(--text-secondary);
  text-decoration: line-through;
  opacity: 0.5;
  margin-right: 8px;
  line-height: 1;
  align-self: flex-end;
  padding-bottom: 4px;

  @media (max-width: 640px) {
    font-size: 24px;
  }
`;

const ReportTitle = styled.h3`
  font-size: 18px;
  font-weight: 600;
  color: var(--text-color);
  margin-top: 4px;

  @media (max-width: 640px) {
    font-size: 16px;
  }
`;

const ReportMeta = styled.p`
  color: var(--text-secondary);
  font-size: 14px;
  line-height: 1.4;
  margin-top: 2px;
`;

const MetaRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 12px;
`;

const MetaItem = styled.span`
  font-size: 13px;
  color: var(--text-secondary);
  display: flex;
  align-items: center;
  gap: 4px;
`;

const MetaItemProOrFree = styled.span<{ $isPro?: boolean }>`
  font-size: 13px;
  color: ${({ $isPro }) => $isPro ? '#FF7A73' : 'var(--text-secondary)'};
  display: flex;
  align-items: center;
  gap: 4px;
`;

const CTAContainer = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px;
  transform: translateY(100%);
  opacity: 0;
  transition: all 0.3s ease;
  background: linear-gradient(to top, rgba(30, 30, 40, 0.95) 60%, transparent);

  @media (max-width: 768px) {
    padding: 0;
    transform: translateY(0);
    opacity: 1;
    position: relative;
    padding-top: 16px;
    background: none;
  }
`;

const CTALink = styled.span`
  display: flex;
  align-items: center;
  gap: 6px;
  color: var(--accent);
  font-weight: 500;
  font-size: 14px;

  &:hover {
    text-decoration: underline;
  }
`;

const CardActions = styled.div`
  display: flex;
  gap: 8px;
`;

const ActionButton = styled.button<{ $variant?: 'danger' }>`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px 12px;
  border: none;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  background: transparent;
  color: var(--text-secondary);

  &:hover {
    background: rgba(var(--accent-rgb), 0.1);
    color: var(--accent);
  }

  ${({ $variant }) =>
    $variant === 'danger' &&
    `
    &:hover {
      background: rgba(239, 68, 68, 0.1);
      color: #ef4444;
    }
  `}
`;

const Overlay = styled.div`
  pointer-events: none;
  position: absolute;
  inset: 0;
  transition: all 0.3s ease;
`;

// Background Animation Components
const floatAnimation = keyframes`
  0%, 100% { transform: translateY(0) rotate(0deg); opacity: 0.6; }
  50% { transform: translateY(-8px) rotate(2deg); opacity: 0.8; }
`;

const fadeInUp = keyframes`
  0% { opacity: 0; transform: translateY(10px); }
  100% { opacity: 1; transform: translateY(0); }
`;

const scrollText = keyframes`
  0% { transform: translateY(0); }
  100% { transform: translateY(-50%); }
`;

const ReportCardBackgroundWrapper = styled.div`
  position: absolute;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
  /* Fade bottom — preview frame is at top-right */
  mask-image: linear-gradient(to top, transparent 35%, #000 100%);
  -webkit-mask-image: linear-gradient(to top, transparent 35%, #000 100%);
`;

const KeywordContainer = styled.div`
  position: absolute;
  top: 12px;
  left: 12px;
  right: 80px;
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  opacity: 0.5;
`;

const KeywordBadge = styled.span<{ $delay: number }>`
  display: inline-block;
  padding: 4px 8px;
  font-size: 9px;
  font-weight: 500;
  background: rgba(var(--accent-rgb), 0.08);
  color: var(--text-secondary);
  border-radius: 4px;
  border: 1px solid rgba(var(--accent-rgb), 0.1);
  animation: ${fadeInUp} 0.4s ease-out forwards;
  animation-delay: ${({ $delay }) => $delay}s;
  opacity: 0;
`;

const SummaryScrollContainer = styled.div`
  position: absolute;
  top: 50px;
  left: 12px;
  right: 12px;
  bottom: 60px;
  overflow: hidden;
  opacity: 0.15;
`;

const SummaryText = styled.div`
  font-size: 10px;
  line-height: 1.6;
  color: var(--text-secondary);
  animation: ${scrollText} 20s linear infinite;

  &:hover {
    animation-play-state: paused;
  }
`;

const SummaryTextDuplicate = styled.div`
  font-size: 10px;
  line-height: 1.6;
  color: var(--text-secondary);
`;

interface ReportCardBackgroundProps {
  keywords?: string[];
  summary?: string;
}

/* ── Document preview frame (same as CV + Jobs cards) ── */
const ReportPreviewContainer = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;
  width: 140px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  z-index: 2;

  @media (max-width: 640px) {
    width: 120px;
    right: 8px;
  }
`;

const ReportPreviewCard = styled.div<{ $delay: number }>`
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  padding: 10px;
  animation: ${fadeInUp} 0.5s ease-out forwards;
  animation-delay: ${({ $delay }) => $delay}s;
  opacity: 0;
  filter: blur(0.4px);
  transition: all 0.2s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
`;

const ReportPreviewSection = styled.div`
  margin-bottom: 6px;
  &:last-child { margin-bottom: 0; }
`;

const ReportPreviewSectionTitle = styled.div`
  font-size: 7px;
  font-weight: 700;
  color: var(--accent);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 3px;
`;

const ReportPreviewLine = styled.div<{ $width?: string }>`
  height: 4px;
  width: ${({ $width }) => $width || '100%'};
  background: linear-gradient(
    90deg,
    rgba(var(--accent-rgb), 0.15) 0%,
    rgba(var(--accent-rgb), 0.25) 50%,
    rgba(var(--accent-rgb), 0.15) 100%
  );
  background-size: 200% 100%;
  border-radius: 2px;
  margin-bottom: 3px;
  &:last-child { margin-bottom: 0; }
`;

const ReportCardBackground = ({ keywords, summary }: ReportCardBackgroundProps) => {
  const displayKeywords = keywords?.slice(0, 5) || [];
  const summaryText = summary || '';

  return (
    <ReportCardBackgroundWrapper>
      {/* Document preview frame — top right */}
      <ReportPreviewContainer>
        <ReportPreviewCard $delay={0}>
          <ReportPreviewSection>
            <ReportPreviewSectionTitle>Match Score</ReportPreviewSectionTitle>
            <ReportPreviewLine $width="85%" />
            <ReportPreviewLine $width="60%" />
          </ReportPreviewSection>
          <ReportPreviewSection>
            <ReportPreviewSectionTitle>Keywords</ReportPreviewSectionTitle>
            <ReportPreviewLine />
            <ReportPreviewLine $width="75%" />
            <ReportPreviewLine $width="50%" />
          </ReportPreviewSection>
        </ReportPreviewCard>

        <ReportPreviewCard $delay={0.15}>
          <ReportPreviewSection>
            <ReportPreviewSectionTitle>Skills</ReportPreviewSectionTitle>
            <ReportPreviewLine $width="90%" />
            <ReportPreviewLine $width="65%" />
          </ReportPreviewSection>
          <ReportPreviewSection>
            <ReportPreviewSectionTitle>Experience</ReportPreviewSectionTitle>
            <ReportPreviewLine $width="80%" />
            <ReportPreviewLine $width="55%" />
          </ReportPreviewSection>
        </ReportPreviewCard>
      </ReportPreviewContainer>

      {/* Keyword badges — left side */}
      {displayKeywords.length > 0 && (
        <KeywordContainer style={{ right: '160px' }}>
          {displayKeywords.map((keyword, idx) => (
            <KeywordBadge key={idx} $delay={idx * 0.1}>
              {keyword}
            </KeywordBadge>
          ))}
        </KeywordContainer>
      )}

      {summaryText && (
        <SummaryScrollContainer style={{ right: '160px' }}>
          <SummaryText>
            {summaryText}
            <SummaryTextDuplicate>
              {summaryText}
            </SummaryTextDuplicate>
          </SummaryText>
        </SummaryScrollContainer>
      )}
    </ReportCardBackgroundWrapper>
  );
};

const FAB = styled.button`
  position: fixed;
  bottom: 32px;
  right: 32px;
  width: 60px;
  height: 60px;
  border-radius: 9999px;
  z-index: 90;

  background: linear-gradient(
    180deg,
    rgba(255, 255, 255, 0.22) 0%,
    rgba(255, 255, 255, 0.0) 100%
  ), rgba(220, 60, 60, 0.38);
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.22s cubic-bezier(0.16, 1, 0.3, 1);
  box-shadow:
    inset 0 1.5px 0 rgba(255, 255, 255, 0.55),
    0 8px 32px rgba(220, 60, 60, 0.5),
    0 2px 8px rgba(0, 0, 0, 0.25);

  &:hover {
    transform: scale(1.08) translateY(-3px);
    background: linear-gradient(
      180deg,
      rgba(255, 255, 255, 0.3) 0%,
      rgba(255, 255, 255, 0.0) 100%
    ), rgba(230, 70, 70, 0.58);
    box-shadow:
      inset 0 1.5px 0 rgba(255, 255, 255, 0.65),
      0 16px 48px rgba(220, 60, 60, 0.55),
      0 4px 16px rgba(0, 0, 0, 0.3);
  }

  &:active { transform: scale(0.96); }

  svg {
    width: 26px;
    height: 26px;
    filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.3));
  }

  @media (max-width: 768px) {
    bottom: 24px;
    right: 20px;
    width: 56px;
    height: 56px;
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
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [reportToDelete, setReportToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const { user } = useAuth();
  const router = useRouter();
  const toast = useToast();

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
            report.job_ids.forEach((id: string) => allJobIds.add(id));
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

  const handleDeleteClick = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setReportToDelete(id);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!reportToDelete) return;

    setIsDeleting(true);
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from("reports")
        .delete()
        .eq("id", reportToDelete)
        .eq("user_id", user?.id);

      if (error) throw error;

      toast.success("Report deleted successfully!");
      setReports(reports.filter(report => report.id !== reportToDelete));
      setDeleteModalOpen(false);
      setReportToDelete(null);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to delete report";
      toast.error(errorMessage);
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return <ReportsListSkeleton />;
  }

  return (
    <Container>
      <Header>
        <HeaderContent>
          <Title>Job Match & Optimize</Title>
          <Subtitle>Analyze how well your resume matches a job posting and generate a targeted version to boost your chances.</Subtitle>
        </HeaderContent>
        {/* Button removed as requested */}
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
        <>
          {(() => {
            const getDisplayScore = (r: Report) => r.optimized_score ?? r.fit_score;
            const excellent = reports.filter((r) => getDisplayScore(r) >= 85);
            const good = reports.filter((r) => getDisplayScore(r) >= 70 && getDisplayScore(r) < 85);
            const fair = reports.filter((r) => getDisplayScore(r) >= 50 && getDisplayScore(r) < 70);
            const poor = reports.filter((r) => getDisplayScore(r) < 50);

            const renderReportCard = (report: Report) => {
              const jobTitles = report.job_ids
                ?.map((id) => jobTitlesMap[id])
                .filter(Boolean)
                .join(" • ");

              return (
                <ReportCard
                  key={report.id}
                  onClick={() => router.push(ROUTES.APP.REPORT_DETAIL(report.id))}
                >
                  <ReportCardBackground
                    keywords={report.keywords?.missing}
                    summary={report.summary_free}
                  />
                  {report.fake_it_mode && <FakeItBanner>🎭 Fake It</FakeItBanner>}

                  <CardContent>
                    <ContentInner className="report-content">
                      <ScoreDisplay>
                        {report.optimized_score != null && report.optimized_score !== report.fit_score && (
                          <OriginalScore>{report.fit_score}%</OriginalScore>
                        )}
                        <ScoreValue $category={(() => { const s = report.optimized_score ?? report.fit_score; return s >= 85 ? 'excellent' : s >= 70 ? 'good' : s >= 50 ? 'fair' : 'poor'; })()}>{report.optimized_score ?? report.fit_score}</ScoreValue>
                      </ScoreDisplay>
                      <ReportTitle>
                        {jobTitles || "CV Analysis Report"}
                      </ReportTitle>
                      <ReportMeta>
                        {new Date(report.created_at).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </ReportMeta>
                      <MetaRow>
                        <MetaItem>
                          {report.keywords?.missing?.length || 0} missing keywords
                        </MetaItem>
                        <MetaItemProOrFree $isPro={report.pro}>
                          {report.pro ? "Pro" : "Free"}
                        </MetaItemProOrFree>
                      </MetaRow>
                    </ContentInner>

                    <CTAContainer className="report-cta" onClick={(e) => e.stopPropagation()}>
                      <CTALink>
                        View Details
                        <ArrowRightIcon />
                      </CTALink>
                      <CardActions>
                        <ActionButton
                          $variant="danger"
                          onClick={(e) => handleDeleteClick(report.id, e)}
                        >
                          <DeleteIcon />
                        </ActionButton>
                      </CardActions>
                    </CTAContainer>
                  </CardContent>

                  <Overlay className="report-overlay" />
                </ReportCard>
              );
            };

            return (
              <>
                {excellent.length > 0 && (
                  <CategorySection>
                    <CategoryHeader>
                      <CategoryBadge $variant="excellent">Excellent</CategoryBadge>
                      <CategoryCount>{excellent.length} report{excellent.length > 1 ? 's' : ''}</CategoryCount>
                    </CategoryHeader>
                    <ReportsGrid>
                      {excellent.map(renderReportCard)}
                    </ReportsGrid>
                  </CategorySection>
                )}

                {good.length > 0 && (
                  <CategorySection>
                    <CategoryHeader>
                      <CategoryBadge $variant="good">Good</CategoryBadge>
                      <CategoryCount>{good.length} report{good.length > 1 ? 's' : ''}</CategoryCount>
                    </CategoryHeader>
                    <ReportsGrid>
                      {good.map(renderReportCard)}
                    </ReportsGrid>
                  </CategorySection>
                )}

                {fair.length > 0 && (
                  <CategorySection>
                    <CategoryHeader>
                      <CategoryBadge $variant="fair">Fair</CategoryBadge>
                      <CategoryCount>{fair.length} report{fair.length > 1 ? 's' : ''}</CategoryCount>
                    </CategoryHeader>
                    <ReportsGrid>
                      {fair.map(renderReportCard)}
                    </ReportsGrid>
                  </CategorySection>
                )}

                {poor.length > 0 && (
                  <CategorySection>
                    <CategoryHeader>
                      <CategoryBadge $variant="poor">Poor</CategoryBadge>
                      <CategoryCount>{poor.length} report{poor.length > 1 ? 's' : ''}</CategoryCount>
                    </CategoryHeader>
                    <ReportsGrid>
                      {poor.map(renderReportCard)}
                    </ReportsGrid>
                  </CategorySection>
                )}
              </>
            );
          })()}
        </>
      )}
      
      <FAB onClick={() => router.push(ROUTES.APP.ANALYZE)}>
        <PlusIcon />
      </FAB>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={() => !isDeleting && setDeleteModalOpen(false)}
        title="Delete Report"
        size="sm"
      >
        <Modal.Body>
          <div style={{ padding: '16px 0' }}>
            <p style={{ marginBottom: '12px', fontSize: '15px', lineHeight: '1.6' }}>
              Are you sure you want to delete this report? This action cannot be undone.
            </p>
            <p style={{ color: '#dc2626', fontSize: '14px', fontWeight: 500 }}>
              ⚠️ This will permanently remove all analysis data.
            </p>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="ghost"
            onClick={() => setDeleteModalOpen(false)}
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleDeleteConfirm}
            isLoading={isDeleting}
            style={{
              background: 'linear-gradient(135deg, #dc2626 0%, #991b1b 100%)',
              border: 'none',
            }}
          >
            {isDeleting ? 'Deleting...' : 'Delete Report'}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}
