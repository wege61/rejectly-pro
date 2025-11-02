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

const EditPanel = styled.div`
  margin-top: ${({ theme }) => theme.spacing.lg};
  padding: ${({ theme }) => theme.spacing.lg};
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  background-color: ${({ theme }) => theme.colors.surface};
`;

const EditTitle = styled.h4`
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.textPrimary};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const EditableTextarea = styled.textarea`
  width: 100%;
  min-height: 300px;
  padding: ${({ theme }) => theme.spacing.md};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.sm};
  background-color: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.textPrimary};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  resize: vertical;
  font-family: monospace;
  line-height: 1.6;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const EditActions = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
  justify-content: flex-end;
  margin-top: ${({ theme }) => theme.spacing.md};
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
  const [expandedJobId, setExpandedJobId] = useState<string | null>(null);
  const [editedTexts, setEditedTexts] = useState<Record<string, string>>({});
  const [savingJobId, setSavingJobId] = useState<string | null>(null);
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
      // Clean up expanded state
      if (expandedJobId === jobId) setExpandedJobId(null);
      const newEditedTexts = { ...editedTexts };
      delete newEditedTexts[jobId];
      setEditedTexts(newEditedTexts);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to delete job posting";
      toast.error(errorMessage);
    }
  };

  const handleToggleExpand = (jobId: string, jobText: string) => {
    if (expandedJobId === jobId) {
      setExpandedJobId(null);
    } else {
      setExpandedJobId(jobId);
      // Initialize edited text if not exists
      if (!editedTexts[jobId]) {
        setEditedTexts({ ...editedTexts, [jobId]: jobText });
      }
    }
  };

  const handleSaveJob = async (jobId: string) => {
    setSavingJobId(jobId);
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from("documents")
        .update({ text: editedTexts[jobId] })
        .eq("id", jobId);

      if (error) throw error;

      toast.success("Job posting updated!");
      // Update local state
      setJobs(jobs.map(job =>
        job.id === jobId ? { ...job, text: editedTexts[jobId] } : job
      ));
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to update job posting";
      toast.error(errorMessage);
    } finally {
      setSavingJobId(null);
    }
  };

  const handleDiscardChanges = (jobId: string) => {
    const originalJob = jobs.find(job => job.id === jobId);
    if (originalJob) {
      setEditedTexts({ ...editedTexts, [jobId]: originalJob.text });
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
          {jobs.map((job) => {
            const isExpanded = expandedJobId === job.id;
            const editedText = editedTexts[job.id] || job.text;
            const hasChanges = editedText !== job.text;

            return (
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

                {isExpanded && (
                  <EditPanel>
                    <EditTitle>Job Description</EditTitle>
                    <EditableTextarea
                      value={editedText}
                      onChange={(e) =>
                        setEditedTexts({ ...editedTexts, [job.id]: e.target.value })
                      }
                      placeholder="Job description..."
                    />
                    <CharCount>{editedText.length} characters</CharCount>
                    {hasChanges && (
                      <EditActions>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDiscardChanges(job.id)}
                        >
                          Discard Changes
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => handleSaveJob(job.id)}
                          isLoading={savingJobId === job.id}
                        >
                          Save Changes
                        </Button>
                      </EditActions>
                    )}
                  </EditPanel>
                )}

                <Card.Footer>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(job.id)}
                  >
                    Delete
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => handleToggleExpand(job.id, job.text)}
                  >
                    {isExpanded ? "Hide Details" : "View & Edit"}
                  </Button>
                </Card.Footer>
              </JobCard>
            );
          })}
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
