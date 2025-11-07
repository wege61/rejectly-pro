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
`;

const JobsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
`;

const JobCard = styled(Card)`
  cursor: default;
  transition: all ${({ theme }) => theme.transitions.normal};

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
  }
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg};
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
  const [editingJob, setEditingJob] = useState<Job | null>(null);
  const [jobTitle, setJobTitle] = useState("");
  const [jobUrl, setJobUrl] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingJobs, setIsFetchingJobs] = useState(true);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [deletingJobId, setDeletingJobId] = useState<string | null>(null);
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

  // Pre-populate form when editing
  useEffect(() => {
    if (editingJob) {
      setJobTitle(editingJob.title);
      setJobUrl(editingJob.file_url || "");
      setJobDescription(editingJob.text);
    } else {
      setJobTitle("");
      setJobUrl("");
      setJobDescription("");
    }
  }, [editingJob]);

  const openAddModal = () => {
    setEditingJob(null);
    setIsModalOpen(true);
  };

  const openEditModal = (job: Job) => {
    setEditingJob(job);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingJob(null);
    setJobTitle("");
    setJobUrl("");
    setJobDescription("");
  };

  const handleSubmit = async () => {
    if (!jobTitle || (!jobUrl && !jobDescription)) {
      toast.error("Please fill in job title and description");
      return;
    }

    setIsLoading(true);
    try {
      const isEditing = !!editingJob;
      const endpoint = isEditing ? "/api/jobs/update" : "/api/jobs/add";
      const method = isEditing ? "PUT" : "POST";

      const response = await fetch(endpoint, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...(isEditing && { jobId: editingJob.id }),
          title: jobTitle,
          url: jobUrl || null,
          description: jobDescription || null,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Operation failed");
      }

      toast.success(isEditing ? "Job posting updated!" : "Job posting added!");

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
      closeModal();
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Operation failed";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteClick = (jobId: string) => {
    setDeletingJobId(jobId);
  };

  const handleConfirmDelete = async () => {
    if (!deletingJobId) return;

    try {
      const supabase = createClient();
      const { error: deleteError } = await supabase
        .from("documents")
        .delete()
        .eq("id", deletingJobId);

      if (deleteError) throw deleteError;

      toast.success("Job posting deleted");
      setJobs(jobs.filter((job) => job.id !== deletingJobId));
      setDeletingJobId(null);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to delete job posting";
      toast.error(errorMessage);
    }
  };

  const handleCancelDelete = () => {
    setDeletingJobId(null);
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
        <Button onClick={openAddModal}>Add Job Posting</Button>
      </Header>

      {jobs.length === 0 ? (
        <Card variant="bordered">
          <EmptyState
            icon={<EmptyState.InboxIcon />}
            title="No job postings yet"
            description="Add job postings to analyze and compare with your CV."
            action={{
              label: "Add Job Posting",
              onClick: openAddModal,
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
                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => openEditModal(job)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDeleteClick(job.id)}
                  >
                    Delete
                  </Button>
                </div>
              </Card.Footer>
            </JobCard>
          ))}
        </JobsList>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={editingJob ? "Edit Job Posting" : "Add Job Posting"}
        description={
          editingJob
            ? "Update the job details below"
            : "Enter the job title and paste the full job description"
        }
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
          <Button variant="ghost" onClick={closeModal}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} isLoading={isLoading}>
            {editingJob ? "Update Job" : "Add Job"}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deletingJobId !== null}
        onClose={handleCancelDelete}
        title="Delete Job Posting"
        description="Are you sure you want to delete this job posting?"
      >
        <Modal.Body>
          <p style={{ color: "#6b7280", fontSize: "14px", lineHeight: "1.6" }}>
            This action cannot be undone. The job posting will be permanently
            removed from your account.
          </p>
          {deletingJobId && (
            <p
              style={{
                marginTop: "12px",
                fontWeight: "600",
                color: "#1f2937",
                fontSize: "14px",
              }}
            >
              Job: {jobs.find((j) => j.id === deletingJobId)?.title}
            </p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="ghost" onClick={handleCancelDelete}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleConfirmDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}
