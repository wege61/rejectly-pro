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

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg};
`;

const DetailsPanel = styled.div<{ $isExpanded: boolean }>`
  max-height: ${({ $isExpanded }) => ($isExpanded ? "800px" : "0")};
  overflow: hidden;
  transition: max-height ${({ theme }) => theme.transitions.normal};
  margin-top: ${({ $isExpanded, theme }) => ($isExpanded ? theme.spacing.md : "0")};
`;

const DetailsPanelContent = styled.div`
  padding: ${({ theme }) => theme.spacing.lg};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.md};
  background-color: ${({ theme }) => theme.colors.surface};
`;

const PanelTitle = styled.h4`
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

const CharCount = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
  text-align: right;
  margin-top: ${({ theme }) => theme.spacing.xs};
`;

const EditActions = styled.div`
  margin-top: ${({ theme }) => theme.spacing.md};
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
  justify-content: flex-end;
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
  const [jobDescription, setJobDescription] = useState("");
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
    if (!jobTitle || (!jobUrl && !jobDescription)) {
      toast.error("Please fill in job title and description");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("/api/jobs/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: jobTitle,
          url: jobUrl || null,
          description: jobDescription || null,
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
      setJobDescription("");
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

  const handleToggleDetails = (jobId: string, jobText: string) => {
    if (expandedJobId === jobId) {
      setExpandedJobId(null);
    } else {
      setExpandedJobId(jobId);
      // Initialize edited text if not already set
      if (!editedTexts[jobId]) {
        setEditedTexts({ ...editedTexts, [jobId]: jobText });
      }
    }
  };

  const handleTextChange = (jobId: string, newText: string) => {
    setEditedTexts({ ...editedTexts, [jobId]: newText });
  };

  const handleSaveChanges = async (jobId: string) => {
    const job = jobs.find((j) => j.id === jobId);
    if (!job) return;

    setSavingJobId(jobId);
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from("documents")
        .update({ text: editedTexts[jobId] })
        .eq("id", jobId);

      if (error) throw error;

      toast.success("Job posting updated successfully!");
      // Update local state
      setJobs(
        jobs.map((j) =>
          j.id === jobId ? { ...j, text: editedTexts[jobId] } : j
        )
      );
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to update job posting";
      toast.error(errorMessage);
    } finally {
      setSavingJobId(null);
    }
  };

  const handleDiscardChanges = (jobId: string) => {
    const job = jobs.find((j) => j.id === jobId);
    if (job) {
      setEditedTexts({ ...editedTexts, [jobId]: job.text });
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

                <DetailsPanel $isExpanded={isExpanded}>
                  <DetailsPanelContent>
                    <PanelTitle>Job Posting Content</PanelTitle>
                    <EditableTextarea
                      value={editedText}
                      onChange={(e) => handleTextChange(job.id, e.target.value)}
                      placeholder="Job posting content will appear here..."
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
                          onClick={() => handleSaveChanges(job.id)}
                          isLoading={savingJobId === job.id}
                        >
                          Save Changes
                        </Button>
                      </EditActions>
                    )}
                  </DetailsPanelContent>
                </DetailsPanel>

                <Card.Footer>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleToggleDetails(job.id, job.text)}
                  >
                    {isExpanded ? "Hide Details" : "View Details"}
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDelete(job.id)}
                  >
                    Delete
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
        description="Enter the job title and paste the full job description"
      >
        <Modal.Body>
          <FormGroup>
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
            <Textarea
              label="Job Description"
              placeholder="Paste the full job description here (requirements, responsibilities, qualifications, etc.)..."
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              rows={12}
              fullWidth
              helperText={`${jobDescription.length} characters`}
            />
          </FormGroup>
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
