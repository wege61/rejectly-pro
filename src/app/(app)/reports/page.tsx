"use client";

import styled from "styled-components";
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

const CategoryBadge = styled.span<{ $variant: 'excellent' | 'good' | 'needsWork' }>`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 600;

  ${({ $variant }) => {
    switch ($variant) {
      case 'excellent':
        return `
          background: rgba(34, 197, 94, 0.1);
          color: #22c55e;
        `;
      case 'good':
        return `
          background: rgba(59, 130, 246, 0.1);
          color: #3b82f6;
        `;
      case 'needsWork':
        return `
          background: rgba(249, 115, 22, 0.1);
          color: #f97316;
        `;
    }
  }}
`;

const CategoryCount = styled.span`
  font-size: 13px;
  color: var(--text-secondary);
`;

const ReportCard = styled.div<{ $fakeItMode?: boolean }>`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  overflow: hidden;
  border-radius: 16px;
  background: var(--bg-alt);
  cursor: pointer;
  transition: all 0.3s ease;
  min-height: 200px;

  /* Subtle depth through shadows */
  box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.03), 0 2px 4px rgba(0, 0, 0, 0.05),
    0 12px 24px rgba(0, 0, 0, 0.05);

  @media (prefers-color-scheme: dark) {
    box-shadow: 0 -20px 80px -20px rgba(255, 255, 255, 0.12) inset;
    border: 1px solid rgba(255, 255, 255, 0.1);
  }

  ${({ $fakeItMode }) =>
    $fakeItMode &&
    `
    margin-top: 14px;
  `}

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.12);
  }

  &:hover .report-content {
    transform: translateY(-10px);
  }

  &:hover .report-cta {
    transform: translateY(0);
    opacity: 1;
  }

  &:hover .report-overlay {
    background: rgba(0, 0, 0, 0.02);
  }

  @media (prefers-color-scheme: dark) {
    &:hover .report-overlay {
      background: rgba(255, 255, 255, 0.03);
    }
  }
`;

const FakeItBanner = styled.div`
  position: absolute;
  top: -14px;
  right: 20px;
  background: linear-gradient(135deg, #f59e0b 0%, #ea580c 100%);
  color: white;
  padding: 6px 14px;
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  border-radius: 8px;
  z-index: 10;
  display: flex;
  align-items: center;
  gap: 4px;

  &::before {
    content: '🚀';
  }
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
`;

const ScoreDisplay = styled.div`
  margin-bottom: 8px;
`;

const ScoreValue = styled.span`
  font-size: 48px;
  font-weight: 700;
  color: var(--accent);
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
  background: linear-gradient(to top, var(--bg-alt) 60%, transparent);

  @media (max-width: 768px) {
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
        <>
          {(() => {
            const excellent = reports.filter((r) => r.fit_score >= 70);
            const good = reports.filter((r) => r.fit_score >= 41 && r.fit_score < 70);
            const needsWork = reports.filter((r) => r.fit_score <= 40);

            const renderReportCard = (report: Report) => {
              const jobTitles = report.job_ids
                ?.map((id) => jobTitlesMap[id])
                .filter(Boolean)
                .join(" • ");

              return (
                <ReportCard
                  key={report.id}
                  $fakeItMode={report.fake_it_mode ?? false}
                  onClick={() => router.push(ROUTES.APP.REPORT_DETAIL(report.id))}
                >
                  {report.fake_it_mode && <FakeItBanner>Fake It Mode</FakeItBanner>}

                  <CardContent>
                    <ContentInner className="report-content">
                      <ScoreDisplay>
                        <ScoreValue>{report.fit_score}</ScoreValue>
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
                        <MetaItem>
                          {report.pro ? "Pro" : "Free"}
                        </MetaItem>
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
                      <CategoryBadge $variant="excellent">Excellent Match</CategoryBadge>
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
                      <CategoryBadge $variant="good">Good Potential</CategoryBadge>
                      <CategoryCount>{good.length} report{good.length > 1 ? 's' : ''}</CategoryCount>
                    </CategoryHeader>
                    <ReportsGrid>
                      {good.map(renderReportCard)}
                    </ReportsGrid>
                  </CategorySection>
                )}

                {needsWork.length > 0 && (
                  <CategorySection>
                    <CategoryHeader>
                      <CategoryBadge $variant="needsWork">Needs Work</CategoryBadge>
                      <CategoryCount>{needsWork.length} report{needsWork.length > 1 ? 's' : ''}</CategoryCount>
                    </CategoryHeader>
                    <ReportsGrid>
                      {needsWork.map(renderReportCard)}
                    </ReportsGrid>
                  </CategorySection>
                )}
              </>
            );
          })()}
        </>
      )}

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
