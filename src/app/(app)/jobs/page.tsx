"use client";

import styled from "styled-components";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { Badge } from "@/components/ui/Badge";
import { JobsListSkeleton } from "@/components/skeletons/JobsListSkeleton";
import { useState, useEffect } from "react";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { useToast } from "@/contexts/ToastContext";
import { useAuth } from "@/hooks/useAuth";
import { createClient } from "@/lib/supabase/client";

const CharCount = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
  text-align: right;
  margin-top: ${({ theme }) => theme.spacing.xs};
`;

const PreviewPanel = styled.div`
  margin-top: ${({ theme }) => theme.spacing.lg};
  padding: ${({ theme }) => theme.spacing.lg};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.md};
  background-color: ${({ theme }) => theme.colors.surface};
  max-height: 300px;
  overflow-y: auto;
`;

const PreviewTitle = styled.h4`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
  text-transform: uppercase;
`;

const PreviewContent = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.textPrimary};
  line-height: 1.6;
  white-space: pre-wrap;
`;

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

const JobsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
`;

const JobCard = styled(Card)`
  cursor: default;
`;

interface Job {
  id: string;
  user_id: string;
  type: string;
  title: string;
  text: string;
  file_url: string | null;
  created_at: string;
}

export default function JobsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [jobTitle, setJobTitle] = useState("");
  const [jobUrl, setJobUrl] = useState("");
  const [jobSummary, setJobSummary] = useState("");
  const [jobDetails, setJobDetails] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingJobs, setIsFetchingJobs] = useState(true);
  const [jobs, setJobs] = useState<Job[]>([]);
  const toast = useToast();
  const { user } = useAuth();

  // Fetch jobs on mount
  useEffect(() => {
    async function fetchJobs() {
      if (!user) return;

      setIsFetchingJobs(true);
      const supabase = createClient();
      const { data } = await supabase
        .from("documents")
        .select("*")
        .eq("user_id", user.id)
        .eq("type", "job")
        .order("created_at", { ascending: false });

      if (data) {
        setJobs(data);
      }

      setIsFetchingJobs(false);
    }

    fetchJobs();
  }, [user]);

  const handleAddJob = async () => {
    if (!jobTitle || (!jobUrl && !jobSummary && !jobDetails)) {
      toast.error("Please fill in the required fields");
      return;
    }

    setIsLoading(true);
    try {
      // Combine summary and details
      const fullDescription = jobSummary && jobDetails
        ? `${jobSummary}\n\n${jobDetails}`
        : jobSummary || jobDetails;

      const response = await fetch("/api/jobs/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: jobTitle,
          url: jobUrl || null,
          description: fullDescription || null,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Job posting failed");
      }

      toast.success("Job posting added!");

      // Refresh jobs list
      const supabase = createClient();
      const { data } = await supabase
        .from("documents")
        .select("*")
        .eq("user_id", user?.id)
        .eq("type", "job")
        .order("created_at", { ascending: false });

      if (data) {
        setJobs(data);
      }

      // Close modal and reset form
      setIsModalOpen(false);
      setJobTitle("");
      setJobUrl("");
      setJobSummary("");
      setJobDetails("");
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Job posting failed";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (jobId: string) => {
    try {
      const supabase = createClient();
      const { error: deleteError } = await supabase
        .from("documents")
        .delete()
        .eq("id", jobId);

      if (deleteError) throw deleteError;

      toast.success("Job posting deleted");
      setJobs(jobs.filter((job) => job.id !== jobId));
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to delete job posting";
      toast.error(errorMessage);
    }
  };

  if (isFetchingJobs) {
    return <JobsListSkeleton />;
  }

  return (
    <Container>
      <Header>
        <HeaderContent>
          <Title>Job Postings</Title>
          <Subtitle>Manage job postings to compare with your CV</Subtitle>
        </HeaderContent>
        <Button onClick={() => setIsModalOpen(true)}>Add Job Posting</Button>
      </Header>

      {jobs.length === 0 ? (
        <Card variant="bordered">
          <EmptyState
            icon={<EmptyState.InboxIcon />}
            title="No job postings yet"
            description="Add job postings to analyze and compare with your CV."
            action={{
              label: "Add Job Posting",
              onClick: () => setIsModalOpen(true),
            }}
          />
        </Card>
      ) : (
        <JobsList>
          {jobs.map((job) => (
            <JobCard key={job.id} variant="elevated">
              <Card.Header>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "start",
                  }}
                >
                  <div>
                    <Card.Title>{job.title}</Card.Title>
                    <Card.Description>
                      Added on{" "}
                      {new Date(job.created_at).toLocaleDateString("tr-TR")}
                    </Card.Description>
                  </div>
                  <Badge>{job.text.length.toLocaleString()} characters</Badge>
                </div>
              </Card.Header>
              <Card.Footer>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDelete(job.id)}
                >
                  Delete
                </Button>
              </Card.Footer>
            </JobCard>
          ))}
        </JobsList>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add Job Posting"
        description="Enter job details or paste a job posting URL"
      >
        <Modal.Body>
          <div
            style={{ display: "flex", flexDirection: "column", gap: "16px" }}
          >
            <Input
              label="Job Title"
              placeholder="e.g. Senior Frontend Developer"
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              required
              fullWidth
            />
            <Input
              label="Job URL (Optional)"
              type="url"
              placeholder="https://..."
              value={jobUrl}
              onChange={(e) => setJobUrl(e.target.value)}
              helperText="We'll extract the job description automatically"
              fullWidth
            />

            <div>
              <Textarea
                label="Job Summary"
                placeholder="Brief overview of the position..."
                value={jobSummary}
                onChange={(e) => setJobSummary(e.target.value)}
                rows={4}
                fullWidth
              />
              <CharCount>
                {jobSummary.length} characters · {jobSummary.split('\n').length} lines
              </CharCount>
            </div>

            <div>
              <Textarea
                label="Detailed Description"
                placeholder="Full job description, requirements, responsibilities..."
                value={jobDetails}
                onChange={(e) => setJobDetails(e.target.value)}
                rows={6}
                fullWidth
              />
              <CharCount>
                {jobDetails.length} characters · {jobDetails.split('\n').length} lines
              </CharCount>
            </div>

            {/* Preview */}
            {(jobSummary || jobDetails) && (
              <PreviewPanel>
                <PreviewTitle>Preview</PreviewTitle>
                {jobSummary && (
                  <div style={{ marginBottom: "16px" }}>
                    <strong>Summary:</strong>
                    <PreviewContent>{jobSummary}</PreviewContent>
                  </div>
                )}
                {jobDetails && (
                  <div>
                    <strong>Details:</strong>
                    <PreviewContent>{jobDetails}</PreviewContent>
                  </div>
                )}
              </PreviewPanel>
            )}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="ghost" onClick={() => setIsModalOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleAddJob} isLoading={isLoading}>
            Add Job
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}
