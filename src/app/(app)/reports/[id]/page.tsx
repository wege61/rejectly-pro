"use client";

import styled from "styled-components";
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Spinner } from "@/components/ui/Spinner";
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

interface RoleRecommendation {
  title: string;
  fit: number;
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
  const [report, setReport] = useState<Report | null>(null);

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

      setReport(data);
      setIsLoading(false);
    }

    fetchReport();
  }, [user, reportId, router, toast]);

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

      toast.success("CV generated successfully!");

      // Refresh report to get generated_cv
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
        error instanceof Error ? error.message : "CV generation failed";
      toast.error(errorMessage);
    } finally {
      setIsGeneratingCV(false);
    }
  };

  const handleDownloadCV = () => {
    if (!report?.generated_cv) return;

    try {
      const pdf = generateCVPDF(report.generated_cv);
      const fileName = `${report.generated_cv.contact.name.replace(/\s+/g, "_")}_CV_Optimized.pdf`;
      pdf.save(fileName);
      toast.success("CV downloaded!");
    } catch {
      toast.error("Failed to download CV");
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
      </Header>

      <Grid>
        <ScoreCard variant="elevated">
          <ScoreValue>{report.fit_score}%</ScoreValue>
          <ScoreLabel>Match Score</ScoreLabel>
        </ScoreCard>

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
                        onClick={handleDownloadCV}
                        size="lg"
                        variant="primary"
                      >
                        📥 Download CV (PDF)
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
    </Container>
  );
}
