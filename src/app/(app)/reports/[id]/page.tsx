"use client";

import styled from "styled-components";
import { useState, useEffect, useCallback } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Spinner } from "@/components/ui/Spinner";
import { Modal } from "@/components/ui/Modal";
import { useParams, useRouter } from "next/navigation";
import { useToast } from "@/contexts/ToastContext";
import { useAuth } from "@/hooks/useAuth";
import { createClient } from "@/lib/supabase/client";
import { GeneratedCV } from "@/types/cv";
import { generateCVPDF } from "@/lib/pdf/cvGenerator";

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: ${({ theme }) => theme.spacing["2xl"]};
`;

const BackButton = styled(Button)`
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const Header = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing["2xl"]};
`;

const Title = styled.h1`
  font-size: ${({ theme }) => theme.typography.fontSize["3xl"]};
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
  margin-bottom: ${({ theme }) => theme.spacing["2xl"]};
`;

const ScoreCard = styled(Card)`
  text-align: center;
`;

const ScoreValue = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize["5xl"]};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const ScoreLabel = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const ComparisonScoreCard = styled(Card)`
  text-align: center;
`;

const ScoreComparison = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.lg};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const ScoreColumn = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const ScoreTitle = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const ComparisonValue = styled.div<{ $isOptimized?: boolean }>`
  font-size: ${({ theme }) => theme.typography.fontSize["4xl"]};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ $isOptimized, theme }) =>
    $isOptimized ? "#10b981" : theme.colors.primary};
`;

const ScoreDivider = styled.div`
  width: 1px;
  height: 60px;
  background-color: ${({ theme }) => theme.colors.border};
`;

const ImprovementBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
  border-radius: ${({ theme }) => theme.radius.full};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  margin-top: ${({ theme }) => theme.spacing.sm};
`;

const LoadingText = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-top: ${({ theme }) => theme.spacing.sm};
`;

const BreakdownContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
  margin-top: ${({ theme }) => theme.spacing.lg};
`;

const BreakdownItem = styled.div`
  display: grid;
  grid-template-columns: 60px 1fr 100px;
  gap: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.md};
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.md};
  align-items: start;
  transition: all ${({ theme }) => theme.transitions.fast};

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
    transform: translateX(4px);
  }
`;

const ImpactBadge = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
  font-size: ${({ theme }) => theme.typography.fontSize.xl};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  border-radius: ${({ theme }) => theme.radius.md};
  flex-shrink: 0;
`;

const ImpactContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
  min-width: 0;
`;

const ImpactCategory = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  color: ${({ theme }) => theme.colors.textSecondary};
  text-transform: uppercase;
  letter-spacing: 0.5px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
`;

const ImpactAction = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  color: ${({ theme }) => theme.colors.textPrimary};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  line-height: ${({ theme }) => theme.typography.lineHeight.normal};
`;

const ImpactReason = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
  line-height: ${({ theme }) => theme.typography.lineHeight.relaxed};
`;

const ImpactPoints = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: center;
`;

const ImpactValue = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: #10b981;
`;

const ImpactLabel = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  color: ${({ theme }) => theme.colors.textSecondary};
  text-transform: uppercase;
`;

const TotalImpactSummary = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${({ theme }) => theme.spacing.lg};
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: ${({ theme }) => theme.radius.lg};
  color: white;
  margin-top: ${({ theme }) => theme.spacing.md};
`;

const TotalLabel = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
`;

const TotalValue = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize["2xl"]};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
`;

const Section = styled.section`
  margin-bottom: ${({ theme }) => theme.spacing.xl};
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

const ProUpgradeCard = styled(Card)`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  text-align: center;

  * {
    color: white !important;
  }
`;

const UpgradeTitle = styled.h3`
  font-size: ${({ theme }) => theme.typography.fontSize["2xl"]};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const UpgradeFeatures = styled.ul`
  text-align: left;
  list-style: none;
  margin: ${({ theme }) => theme.spacing.lg} 0;

  li {
    margin-bottom: ${({ theme }) => theme.spacing.sm};
    padding-left: ${({ theme }) => theme.spacing.lg};
    position: relative;

    &:before {
      content: "✓";
      position: absolute;
      left: 0;
      font-weight: bold;
    }
  }
`;

const PDFPreviewContainer = styled.div`
  width: 100%;
  height: 70vh;
  min-height: 500px;
  max-height: 800px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.md};
  overflow: hidden;
  background-color: ${({ theme }) => theme.colors.surface};

  @media (max-width: 640px) {
    height: 500px;
    min-height: 400px;
  }
`;

const PDFViewer = styled.iframe`
  width: 100%;
  height: 100%;
  border: none;
`;

const PreviewActions = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  justify-content: flex-end;
  margin-top: ${({ theme }) => theme.spacing.lg};
`;

interface RoleRecommendation {
  title: string;
  fit: number;
}

interface Improvement {
  category: string;
  action: string;
  impact: number;
  reason: string;
}

interface Report {
  id: string;
  user_id: string;
  cv_id: string;
  job_ids: string[];
  fit_score: number;
  summary_free: string;
  summary_pro: {
    rewrittenBullets?: string[];
    roleRecommendations?: RoleRecommendation[];
    atsFlags?: string[];
  } | null;
  keywords: {
    missing?: string[];
  } | null;
  role_fit: RoleRecommendation[] | null;
  ats_flags: string[] | null;
  pro: boolean;
  generated_cv: GeneratedCV | null;
  optimized_score: number | null;
  improvement_breakdown: Improvement[] | null;
  created_at: string;
}

export default function ReportDetailPage() {
  const params = useParams();
  const router = useRouter();
  const toast = useToast();
  const { user } = useAuth();
  const reportId = params.id as string;

  const [isLoading, setIsLoading] = useState(true);
  const [isUpgrading, setIsUpgrading] = useState(false);
  const [isGeneratingCV, setIsGeneratingCV] = useState(false);
  const [isAnalyzingOptimized, setIsAnalyzingOptimized] = useState(false);
  const [optimizedScore, setOptimizedScore] = useState<number | null>(null);
  const [improvementBreakdown, setImprovementBreakdown] = useState<Improvement[]>([]);
  const [report, setReport] = useState<Report | null>(null);
  const [jobPostingTitles, setJobPostingTitles] = useState<string[]>([]);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [pdfPreviewUrl, setPdfPreviewUrl] = useState<string | null>(null);

  // Define analyzeOptimizedCV before useEffect that uses it
  const analyzeOptimizedCV = useCallback(async () => {
    if (!report) return;

    console.log('🔍 Starting CV analysis...', {
      reportId: report.id,
      hasGeneratedCV: !!report.generated_cv,
      currentOptimizedScore: optimizedScore
    });

    setIsAnalyzingOptimized(true);
    try {
      const response = await fetch("/api/cv/analyze-optimized", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          reportId: report.id,
        }),
      });

      const result = await response.json();

      console.log('📊 Analysis result:', {
        ...result,
        improvementBreakdownType: typeof result.improvementBreakdown,
        improvementBreakdownValue: result.improvementBreakdown,
        isArray: Array.isArray(result.improvementBreakdown),
        length: result.improvementBreakdown?.length
      });

      if (!response.ok) {
        throw new Error(result.error || "Analysis failed");
      }

      setOptimizedScore(result.fitScore);

      // Normalize improvement breakdown to match actual score difference
      if (result.improvementBreakdown &&
          Array.isArray(result.improvementBreakdown) &&
          result.improvementBreakdown.length > 0) {
        const actualDifference = result.fitScore - report.fit_score;
        const totalImpact = result.improvementBreakdown.reduce(
          (sum: number, imp: Improvement) => sum + imp.impact,
          0
        );

        console.log('🎯 Breakdown normalization:', {
          actualDifference,
          totalImpact,
          needsNormalization: Math.abs(totalImpact - actualDifference) > 0.5
        });

        // If AI's total doesn't match actual difference, normalize it
        if (totalImpact > 0 && Math.abs(totalImpact - actualDifference) > 0.5) {
          const scaleFactor = actualDifference / totalImpact;
          const normalizedBreakdown = result.improvementBreakdown.map(
            (imp: Improvement) => ({
              ...imp,
              impact: Math.round(imp.impact * scaleFactor * 10) / 10, // Round to 1 decimal
            })
          );
          console.log('✅ Setting normalized breakdown:', normalizedBreakdown);
          setImprovementBreakdown(normalizedBreakdown);
        } else {
          console.log('✅ Setting original breakdown:', result.improvementBreakdown);
          setImprovementBreakdown(result.improvementBreakdown);
        }
      } else {
        console.log('⚠️ No breakdown data received');
        setImprovementBreakdown([]);
      }
    } catch (error) {
      console.error("❌ Failed to analyze optimized CV:", error);
      // Don't show error toast to user, just log it
    } finally {
      setIsAnalyzingOptimized(false);
    }
  }, [report, optimizedScore]);

  useEffect(() => {
    async function fetchReport() {
      if (!user) return;

      const supabase = createClient();
      const { data, error } = await supabase
        .from("reports")
        .select("*")
        .eq("id", reportId)
        .eq("user_id", user.id)
        .single();

      if (error || !data) {
        toast.error("Report not found");
        router.push("/reports");
        return;
      }

      // Fetch job posting titles from job_ids
      if (data.job_ids && Array.isArray(data.job_ids) && data.job_ids.length > 0) {
        const { data: jobDocs, error: jobError } = await supabase
          .from("documents")
          .select("title")
          .in("id", data.job_ids)
          .eq("type", "job");

        if (!jobError && jobDocs) {
          setJobPostingTitles(jobDocs.map(doc => doc.title));
        }
      }

      console.log('📋 Report loaded from database:', {
        reportId: data.id,
        hasGeneratedCV: !!data.generated_cv,
        optimizedScore: {
          type: typeof data.optimized_score,
          value: data.optimized_score,
          isNumber: typeof data.optimized_score === 'number'
        },
        improvementBreakdown: {
          exists: !!data.improvement_breakdown,
          type: typeof data.improvement_breakdown,
          length: data.improvement_breakdown?.length,
          isArray: Array.isArray(data.improvement_breakdown)
        }
      });

      setReport(data);

      // Load cached analysis results from database if available
      const hasValidScore = typeof data.optimized_score === 'number';
      const hasValidBreakdown = data.improvement_breakdown &&
                                Array.isArray(data.improvement_breakdown) &&
                                data.improvement_breakdown.length > 0;

      console.log('🔍 Cache validation:', {
        hasValidScore,
        hasValidBreakdown,
        willLoadFromCache: hasValidScore && hasValidBreakdown
      });

      if (hasValidScore && hasValidBreakdown) {
        console.log('✅ Loading from cache:', {
          score: data.optimized_score,
          breakdownCount: data.improvement_breakdown.length,
          breakdown: data.improvement_breakdown
        });
        setOptimizedScore(data.optimized_score);
        setImprovementBreakdown(data.improvement_breakdown);
      } else {
        console.log('⚠️ Cache not available:', {
          reason: !hasValidScore ? 'No valid score' : 'No valid breakdown',
          willAnalyze: !!data.generated_cv
        });
      }

      setIsLoading(false);
    }

    fetchReport();
  }, [user, reportId, router, toast]);

  // Auto-analyze when CV exists but no score
  useEffect(() => {
    const shouldAnalyze =
      !isLoading &&
      report?.generated_cv &&
      optimizedScore === null &&
      !isAnalyzingOptimized &&
      typeof report.optimized_score !== 'number';

    console.log('🔍 Analysis check:', {
      isLoading,
      hasCV: !!report?.generated_cv,
      currentScore: optimizedScore,
      analyzing: isAnalyzingOptimized,
      dbScore: report?.optimized_score,
      shouldAnalyze
    });

    if (shouldAnalyze) {
      console.log('🚀 Triggering analysis');
      analyzeOptimizedCV();
    }
  }, [isLoading, report?.generated_cv, report?.optimized_score, optimizedScore, isAnalyzingOptimized, analyzeOptimizedCV]);

  const handleUpgradeToPro = async () => {
    if (!report) return;

    setIsUpgrading(true);
    try {
      const response = await fetch("/api/analyze/pro", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          reportId: report.id,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Upgrade failed");
      }

      toast.success("Upgraded to Pro!");

      // Refresh report
      const supabase = createClient();
      const { data } = await supabase
        .from("reports")
        .select("*")
        .eq("id", reportId)
        .single();

      if (data) {
        setReport(data);
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Upgrade failed";
      toast.error(errorMessage);
    } finally {
      setIsUpgrading(false);
    }
  };

  const handleGenerateCV = async () => {
    if (!report) return;

    setIsGeneratingCV(true);
    // Clear previous analysis cache
    setOptimizedScore(null);
    setImprovementBreakdown([]);

    try {
      const response = await fetch("/api/cv/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          reportId: report.id,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "CV generation failed");
      }

      toast.success("Your optimized CV has been generated successfully! You can now download it as PDF.");

      // Refresh report to get generated_cv (cache will be cleared)
      const supabase = createClient();
      const { data } = await supabase
        .from("reports")
        .select("*")
        .eq("id", reportId)
        .single();

      if (data) {
        setReport(data);
      }

      // Analyze the optimized CV to get new match score
      await analyzeOptimizedCV();
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "CV generation failed";
      toast.error(errorMessage);
    } finally {
      setIsGeneratingCV(false);
    }
  };

  const handlePreviewCV = async () => {
    if (!report?.generated_cv) return;

    try {
      const pdf = await generateCVPDF(report.generated_cv);
      const pdfBlob = pdf.output("blob");
      const blobUrl = URL.createObjectURL(pdfBlob);
      setPdfPreviewUrl(blobUrl);
      setIsPreviewOpen(true);
    } catch (error) {
      console.error("CV preview error:", error);
      toast.error("Failed to preview CV. Please try again.");
    }
  };

  const handleDownloadCV = async () => {
    if (!report?.generated_cv) return;

    try {
      const pdf = await generateCVPDF(report.generated_cv);
      const fileName = `${report.generated_cv.contact.name.replace(/\s+/g, "_")}_CV_Optimized.pdf`;
      pdf.save(fileName);
      toast.success("CV downloaded successfully! Check your downloads folder.");
      handleClosePreview(); // Close modal after download
    } catch (error) {
      console.error("CV download error:", error);
      toast.error("Failed to download CV. Please try again.");
    }
  };

  const handleClosePreview = () => {
    setIsPreviewOpen(false);
    if (pdfPreviewUrl) {
      URL.revokeObjectURL(pdfPreviewUrl);
      setPdfPreviewUrl(null);
    }
  };

  if (isLoading) {
    return (
      <Container>
        <Spinner centered size="xl" />
      </Container>
    );
  }

  if (!report) {
    return null;
  }

  const missingKeywords = report.keywords?.missing || [];
  const rewrittenBullets = report.summary_pro?.rewrittenBullets || [];
  const roleRecommendations = report.role_fit || [];
  const atsFlags = report.ats_flags || [];

  return (
    <Container>
      <BackButton variant="ghost" size="sm" onClick={() => router.back()}>
        ← Back
      </BackButton>

      <Header>
        <Title>CV Analysis Report</Title>
        <HeaderMeta>
          <Badge variant={report.pro ? "info" : "default"}>
            {report.pro ? "Pro Report" : "Free Report"}
          </Badge>
          <span style={{ color: "#9ca3af", fontSize: "14px" }}>
            Created on {new Date(report.created_at).toLocaleDateString("tr-TR")}
          </span>
        </HeaderMeta>
        {jobPostingTitles.length > 0 && (
          <div style={{ marginTop: "12px" }}>
            <span style={{ color: "#6b7280", fontSize: "14px", fontWeight: "500" }}>
              Job Posting{jobPostingTitles.length > 1 ? "s" : ""}:{" "}
            </span>
            <span style={{ color: "white", fontSize: "14px", fontWeight: "600" }}>
              {jobPostingTitles.join(" • ")}
            </span>
          </div>
        )}
      </Header>

      <Grid>
        {optimizedScore !== null && report.generated_cv ? (
          <ComparisonScoreCard variant="elevated">
            <ScoreComparison>
              <ScoreColumn>
                <ScoreTitle>ORIGINAL</ScoreTitle>
                <ComparisonValue>{report.fit_score}%</ComparisonValue>
              </ScoreColumn>
              <ScoreDivider />
              <ScoreColumn>
                <ScoreTitle>OPTIMIZED</ScoreTitle>
                <ComparisonValue $isOptimized>{optimizedScore}%</ComparisonValue>
              </ScoreColumn>
            </ScoreComparison>
            {optimizedScore > report.fit_score && (
              <ImprovementBadge>
                ↑ +{optimizedScore - report.fit_score}% Improvement
              </ImprovementBadge>
            )}
            {isAnalyzingOptimized && (
              <LoadingText>Analyzing optimized CV...</LoadingText>
            )}
          </ComparisonScoreCard>
        ) : (
          <ScoreCard variant="elevated">
            <ScoreValue>{report.fit_score}%</ScoreValue>
            <ScoreLabel>Match Score</ScoreLabel>
            {report.generated_cv && isAnalyzingOptimized && (
              <LoadingText>Analyzing optimized CV...</LoadingText>
            )}
          </ScoreCard>
        )}

        <ScoreCard variant="elevated">
          <ScoreValue>{missingKeywords.length}</ScoreValue>
          <ScoreLabel>Missing Keywords</ScoreLabel>
        </ScoreCard>

        {report.pro && (
          <ScoreCard variant="elevated">
            <ScoreValue>{roleRecommendations.length}</ScoreValue>
            <ScoreLabel>Role Recommendations</ScoreLabel>
          </ScoreCard>
        )}
      </Grid>

      {report.generated_cv && isAnalyzingOptimized && (
        <Section>
          <Card variant="bordered">
            <Card.Content style={{ textAlign: 'center', padding: '40px' }}>
              <Spinner size="lg" />
              <p style={{ marginTop: '16px', color: '#9ca3af' }}>
                Analyzing optimized CV to calculate improvement breakdown...
              </p>
            </Card.Content>
          </Card>
        </Section>
      )}

      {improvementBreakdown.length > 0 && optimizedScore !== null && !isAnalyzingOptimized && (
        <Section>
          <Card variant="bordered">
            <Card.Header>
              <Card.Title>🎯 How We Improved Your Score</Card.Title>
              <Card.Description>
                Detailed breakdown of each optimization and its impact
              </Card.Description>
            </Card.Header>
            <Card.Content>
              <BreakdownContainer>
                {improvementBreakdown.map((improvement, index) => (
                  <BreakdownItem key={index}>
                    <ImpactBadge>+{Math.round(improvement.impact * 10) / 10}</ImpactBadge>
                    <ImpactContent>
                      <ImpactCategory>{improvement.category}</ImpactCategory>
                      <ImpactAction>{improvement.action}</ImpactAction>
                      <ImpactReason>{improvement.reason}</ImpactReason>
                    </ImpactContent>
                    <ImpactPoints>
                      <ImpactValue>+{Math.round(improvement.impact * 10) / 10}%</ImpactValue>
                      <ImpactLabel>Score</ImpactLabel>
                    </ImpactPoints>
                  </BreakdownItem>
                ))}
              </BreakdownContainer>
              <TotalImpactSummary>
                <TotalLabel>Total Impact</TotalLabel>
                <TotalValue>
                  +{Math.round(improvementBreakdown.reduce((sum, imp) => sum + imp.impact, 0) * 10) / 10}%
                </TotalValue>
              </TotalImpactSummary>
            </Card.Content>
          </Card>
        </Section>
      )}

      <Section>
        <Card variant="bordered">
          <Card.Header>
            <Card.Title>Summary</Card.Title>
            <Card.Description>
              AI-generated analysis of your CV match
            </Card.Description>
          </Card.Header>
          <Card.Content>
            <p>{report.summary_free}</p>
          </Card.Content>
        </Card>
      </Section>

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
              {missingKeywords.map((keyword: string) => (
                <Badge key={keyword} variant="warning">
                  {keyword}
                </Badge>
              ))}
            </KeywordList>
          </Card.Content>
        </Card>
      </Section>

      {!report.pro ? (
        <Section>
          <ProUpgradeCard variant="elevated">
            <Card.Content>
              <UpgradeTitle>🚀 Upgrade to Pro Report - $9</UpgradeTitle>
              <p style={{ marginBottom: "24px" }}>
                Get detailed insights to dramatically improve your CV
              </p>
              <UpgradeFeatures>
                <li>3 professionally rewritten bullet points</li>
                <li>3 alternative role recommendations with match scores</li>
                <li>ATS optimization tips for better visibility</li>
                <li>AI-generated optimized CV in PDF format</li>
                <li>Downloadable PDF report</li>
              </UpgradeFeatures>
              <Button
                size="lg"
                onClick={handleUpgradeToPro}
                isLoading={isUpgrading}
                style={{ backgroundColor: "white", color: "#667eea" }}
              >
                {isUpgrading ? "Upgrading..." : "Upgrade Now - $9"}
              </Button>
            </Card.Content>
          </ProUpgradeCard>
        </Section>
      ) : (
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
                  {rewrittenBullets.map((bullet: string, index: number) => (
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
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "12px",
                  }}
                >
                  {roleRecommendations.map((role: RoleRecommendation) => (
                    <div
                      key={role.title}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        padding: "12px",
                        backgroundColor: "#1e293b", // slate-800 (theme.colors.surface)
                        border: "1px solid #334155", // slate-700 (theme.colors.border)
                        borderRadius: "8px",
                      }}
                    >
                      <span style={{ fontWeight: 500, color: "#f1f5f9" }}>
                        {role.title}
                      </span>
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
                  {atsFlags.map((flag: string, index: number) => (
                    <li key={index}>{flag}</li>
                  ))}
                </BulletList>
              </Card.Content>
            </Card>
          </Section>

          <Section>
            <Card variant="bordered">
              <Card.Header>
                <Card.Title>🎯 Generate Optimized CV</Card.Title>
                <Card.Description>
                  Get a fully optimized, ATS-friendly CV with all improvements applied
                </Card.Description>
              </Card.Header>
              <Card.Content>
                {!report.generated_cv ? (
                  <div>
                    <p style={{ marginBottom: "16px", color: "#9ca3af" }}>
                      Generate a professional CV that incorporates all the analysis insights:
                    </p>
                    <ul style={{ marginBottom: "24px", marginLeft: "20px", color: "#9ca3af" }}>
                      <li>Missing keywords naturally integrated</li>
                      <li>Rewritten bullet points with achievements</li>
                      <li>ATS-optimized formatting</li>
                      <li>Professional design and layout</li>
                    </ul>
                    <Button
                      onClick={handleGenerateCV}
                      isLoading={isGeneratingCV}
                      size="lg"
                    >
                      {isGeneratingCV ? "Generating CV..." : "Generate Optimized CV"}
                    </Button>
                  </div>
                ) : (
                  <div>
                    <div
                      style={{
                        padding: "16px",
                        backgroundColor: "#10b981",
                        borderRadius: "8px",
                        marginBottom: "16px",
                      }}
                    >
                      <p style={{ color: "white", fontWeight: 500 }}>
                        ✓ Your optimized CV is ready!
                      </p>
                    </div>
                    <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
                      <Button
                        onClick={handlePreviewCV}
                        size="lg"
                        variant="primary"
                      >
                        👁️ Preview & Download CV
                      </Button>
                      <Button
                        onClick={handleGenerateCV}
                        size="lg"
                        variant="ghost"
                        isLoading={isGeneratingCV}
                      >
                        {isGeneratingCV ? "Regenerating..." : "🔄 Regenerate CV"}
                      </Button>
                    </div>
                  </div>
                )}
              </Card.Content>
            </Card>
          </Section>
        </>
      )}

      {/* CV Preview Modal */}
      <Modal
        isOpen={isPreviewOpen}
        onClose={handleClosePreview}
        title="CV Preview"
        description="Review your optimized CV before downloading"
        size="lg"
      >
        <Modal.Body>
          <PDFPreviewContainer>
            {pdfPreviewUrl ? (
              <PDFViewer
                src={`${pdfPreviewUrl}#toolbar=0&navpanes=0&scrollbar=0&view=FitH`}
                title="CV Preview"
              />
            ) : (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  height: "100%",
                }}
              >
                <Spinner size="lg" />
              </div>
            )}
          </PDFPreviewContainer>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="ghost" onClick={handleClosePreview}>
            Close
          </Button>
          <Button variant="primary" onClick={handleDownloadCV}>
            📥 Download PDF
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}
