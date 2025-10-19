"use client";

import styled from "styled-components";
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/Spinner";
import { useToast } from "@/contexts/ToastContext";
import { useAuth } from "@/hooks/useAuth";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/lib/constants";

const Container = styled.div`
  max-width: 800px;
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

const Section = styled.section`
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const SectionTitle = styled.h2`
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const SelectCard = styled(Card)<{ $selected: boolean }>`
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};
  border: 2px solid
    ${({ theme, $selected }) =>
      $selected ? theme.colors.primary : theme.colors.border};
  background-color: ${({ theme, $selected }) =>
    $selected ? theme.colors.primaryLight : theme.colors.surface};

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const JobCheckbox = styled.div<{ $checked: boolean }>`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing.md};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.md};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};
  background-color: ${({ theme, $checked }) =>
    $checked ? theme.colors.primaryLight : "transparent"};
  border-color: ${({ theme, $checked }) =>
    $checked ? theme.colors.primary : theme.colors.border};

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const Checkbox = styled.input`
  width: 20px;
  height: 20px;
  cursor: pointer;
`;

interface Document {
  id: string;
  title: string;
  text: string;
  created_at: string;
}

export default function AnalyzePage() {
  const [isLoading, setIsLoading] = useState(true);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [cv, setCv] = useState<Document | null>(null);
  const [jobs, setJobs] = useState<Document[]>([]);
  const [selectedJobIds, setSelectedJobIds] = useState<string[]>([]);
  const toast = useToast();
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    async function fetchData() {
      if (!user) return;

      const supabase = createClient();

      // Fetch CV
      const { data: cvData } = await supabase
        .from("documents")
        .select("*")
        .eq("user_id", user.id)
        .eq("type", "cv")
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (cvData) {
        setCv(cvData);
      }

      // Fetch Jobs
      const { data: jobsData } = await supabase
        .from("documents")
        .select("*")
        .eq("user_id", user.id)
        .eq("type", "job")
        .order("created_at", { ascending: false });

      if (jobsData) {
        setJobs(jobsData);
      }

      setIsLoading(false);
    }

    fetchData();
  }, [user]);

  const toggleJob = (jobId: string) => {
    if (selectedJobIds.includes(jobId)) {
      setSelectedJobIds(selectedJobIds.filter((id) => id !== jobId));
    } else {
      if (selectedJobIds.length >= 3) {
        toast.warning("Maximum 3 job postings allowed for free analysis");
        return;
      }
      setSelectedJobIds([...selectedJobIds, jobId]);
    }
  };

  const handleAnalyze = async () => {
    if (!cv) {
      toast.error("Please upload your CV first");
      router.push(ROUTES.APP.CV);
      return;
    }

    if (selectedJobIds.length === 0) {
      toast.error("Please select at least one job posting");
      return;
    }

    setIsAnalyzing(true);
    try {
      const response = await fetch("/api/analyze/free", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          cvId: cv.id,
          jobIds: selectedJobIds,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Analysis failed");
      }

      toast.success("Analysis complete!");
      router.push(ROUTES.APP.REPORT_DETAIL(result.report.id));
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Analysis failed";
      toast.error(errorMessage);
    } finally {
      setIsAnalyzing(false);
    }
  };

  if (isLoading) {
    return (
      <Container>
        <Spinner centered size="xl" />
      </Container>
    );
  }

  if (!cv) {
    return (
      <Container>
        <Card variant="bordered">
          <Card.Content>
            <p style={{ textAlign: "center", marginBottom: "16px" }}>
              You need to upload your CV first
            </p>
            <Button fullWidth onClick={() => router.push(ROUTES.APP.CV)}>
              Upload CV
            </Button>
          </Card.Content>
        </Card>
      </Container>
    );
  }

  if (jobs.length === 0) {
    return (
      <Container>
        <Card variant="bordered">
          <Card.Content>
            <p style={{ textAlign: "center", marginBottom: "16px" }}>
              You need to add job postings first
            </p>
            <Button fullWidth onClick={() => router.push(ROUTES.APP.JOBS)}>
              Add Jobs
            </Button>
          </Card.Content>
        </Card>
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <Title>New Analysis</Title>
        <Subtitle>Select job postings to analyze with your CV</Subtitle>
      </Header>

      <Section>
        <SectionTitle>Your CV</SectionTitle>
        <SelectCard variant="bordered" $selected>
          <Card.Header>
            <Card.Title>{cv.title}</Card.Title>
            <Card.Description>
              {cv.text.length.toLocaleString()} characters
            </Card.Description>
          </Card.Header>
        </SelectCard>
      </Section>

      <Section>
        <SectionTitle>
          Select Job Postings ({selectedJobIds.length}/3)
        </SectionTitle>
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {jobs.map((job) => (
            <JobCheckbox
              key={job.id}
              $checked={selectedJobIds.includes(job.id)}
              onClick={() => toggleJob(job.id)}
            >
              <Checkbox
                type="checkbox"
                checked={selectedJobIds.includes(job.id)}
                onChange={() => {}} // Handled by parent onClick
              />
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 500 }}>{job.title}</div>
                <div style={{ fontSize: "14px", color: "#6b7280" }}>
                  {job.text.length.toLocaleString()} characters
                </div>
              </div>
            </JobCheckbox>
          ))}
        </div>
      </Section>

      <Button
        fullWidth
        size="lg"
        onClick={handleAnalyze}
        isLoading={isAnalyzing}
        disabled={selectedJobIds.length === 0}
      >
        {isAnalyzing ? "Analyzing..." : "Generate Free Analysis"}
      </Button>
    </Container>
  );
}
