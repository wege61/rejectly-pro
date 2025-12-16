"use client";

import styled from "styled-components";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { Badge } from "@/components/ui/Badge";
import { JobsListSkeleton } from "@/components/skeletons/JobsListSkeleton";
import { useState, useEffect, useRef, useId } from "react";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { useToast } from "@/contexts/ToastContext";
import { useAuth } from "@/hooks/useAuth";
import { createClient } from "@/lib/supabase/client";
import { AnimatePresence, LayoutGroup, motion } from "motion/react";
import { useClickOutside } from "@/hooks/useClickOutside";

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
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
  gap: 16px;

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg};
`;

// Expanded card styled components
const ExpandedCardContainer = styled(motion.div)`
  width: 100%;
  max-width: 600px;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.radius.lg};
  box-shadow: ${({ theme }) => theme.shadow.xl};
  overflow: hidden;
`;

const ExpandedCardHeader = styled.div`
  padding: ${({ theme }) => theme.spacing.lg};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

const ExpandedCardBody = styled.div`
  padding: ${({ theme }) => theme.spacing.lg};
  overflow-y: auto;
  flex: 1;
`;

const ExpandedCardFooter = styled.div`
  padding: ${({ theme }) => theme.spacing.lg};
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  display: flex;
  justify-content: flex-end;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const ExpandedFormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
`;

// Job card with motion - Bento style
const JobCardWrapper = styled(motion.div)`
  cursor: pointer;
`;

const JobCardInner = styled.div`
  position: relative;
  overflow: hidden;
  border-radius: 16px;
  background: var(--bg-alt);
  transition: all 0.3s ease;

  /* Subtle depth through shadows */
  box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.03), 0 2px 4px rgba(0, 0, 0, 0.05),
    0 12px 24px rgba(0, 0, 0, 0.05);

  @media (prefers-color-scheme: dark) {
    box-shadow: 0 -20px 80px -20px rgba(255, 255, 255, 0.12) inset;
    border: 1px solid rgba(255, 255, 255, 0.1);
  }

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.12);
  }

  &:hover .job-content {
    transform: translateY(-8px);
  }

  &:hover .job-cta {
    transform: translateY(0);
    opacity: 1;
  }
`;

const JobCardBackground = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  padding: 20px;
  font-size: 10px;
  line-height: 1.5;
  color: var(--text-secondary);
  opacity: 0.12;
  overflow: hidden;
  pointer-events: none;
  mask-image: linear-gradient(to bottom, #000 0%, #000 50%, transparent 100%);
  -webkit-mask-image: linear-gradient(to bottom, #000 0%, #000 50%, transparent 100%);
  word-break: break-word;
  white-space: pre-wrap;
`;

const JobCardContent = styled.div`
  position: relative;
  z-index: 1;
  padding: 24px;
  display: flex;
  flex-direction: column;
  min-height: 200px;
  justify-content: flex-end;
`;

const ContentInner = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  transform-origin: bottom left;
  transition: all 0.3s ease;
`;

const CardTitleWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: start;
`;

const CardTitleContent = styled.div``;

const CTAContainer = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: 16px 20px;
  transform: translateY(100%);
  opacity: 0;
  transition: all 0.3s ease;
  background: linear-gradient(to top, var(--bg-alt) 60%, transparent);
  gap: 8px;

  @media (max-width: 768px) {
    transform: translateY(0);
    opacity: 1;
    position: relative;
    padding-top: 12px;
    background: none;
  }
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

// Backdrop
const Backdrop = styled(motion.div)`
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 100;
`;

const ExpandedCardOverlay = styled.div`
  position: fixed;
  inset: 0;
  display: grid;
  place-items: center;
  z-index: 101;
  padding: ${({ theme }) => theme.spacing.lg};
`;

const CloseButton = styled(motion.button)`
  position: absolute;
  top: 12px;
  right: 12px;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 102;

  &:hover {
    background-color: ${({ theme }) => theme.colors.surfaceHover};
  }

  svg {
    width: 16px;
    height: 16px;
    color: ${({ theme }) => theme.colors.textSecondary};
  }
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
  const [deletingJobId, setDeletingJobId] = useState<string | null>(null);

  // Expandable card state
  const [activeJob, setActiveJob] = useState<Job | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editUrl, setEditUrl] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [isEditLoading, setIsEditLoading] = useState(false);

  const expandedCardRef = useRef<HTMLDivElement>(null);
  const id = useId();
  const toast = useToast();
  const { user } = useAuth();

  // Handle escape key and body scroll
  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setActiveJob(null);
      }
    }

    if (activeJob) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [activeJob]);

  // Click outside to close
  useClickOutside(expandedCardRef, () => setActiveJob(null));

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

  const openAddModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setJobTitle("");
    setJobUrl("");
    setJobDescription("");
  };

  const handleOpenEdit = (job: Job, e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveJob(job);
    setEditTitle(job.title);
    setEditUrl(job.file_url || "");
    setEditDescription(job.text);
  };

  const handleCloseEdit = () => {
    setActiveJob(null);
    setEditTitle("");
    setEditUrl("");
    setEditDescription("");
  };

  const handleSubmit = async () => {
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
        throw new Error(result.error || "Operation failed");
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

      closeModal();
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Operation failed";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditSubmit = async () => {
    if (!editTitle || (!editUrl && !editDescription)) {
      toast.error("Please fill in job title and description");
      return;
    }

    if (!activeJob) return;

    setIsEditLoading(true);
    try {
      const response = await fetch("/api/jobs/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          jobId: activeJob.id,
          title: editTitle,
          url: editUrl || null,
          description: editDescription || null,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Update failed");
      }

      toast.success("Job posting updated!");

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

      handleCloseEdit();
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Update failed";
      toast.error(errorMessage);
    } finally {
      setIsEditLoading(false);
    }
  };

  const handleDeleteClick = (jobId: string, e: React.MouseEvent) => {
    e.stopPropagation();
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

      <LayoutGroup>
        {/* Backdrop */}
        <AnimatePresence>
        {activeJob && (
          <Backdrop
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
        )}
      </AnimatePresence>

      {/* Expanded Card */}
      <AnimatePresence mode="popLayout">
        {activeJob && (
          <ExpandedCardOverlay>
            <CloseButton
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, transition: { duration: 0.05 } }}
              onClick={handleCloseEdit}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </CloseButton>
            <ExpandedCardContainer
              layoutId={`card-${activeJob.id}-${id}`}
              ref={expandedCardRef}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              <ExpandedCardHeader>
                <motion.h3
                  layout
                  layoutId={`title-${activeJob.id}-${id}`}
                  style={{
                    fontSize: "1.25rem",
                    fontWeight: 600,
                    marginBottom: "4px",
                    margin: 0,
                  }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                >
                  {activeJob.title}
                </motion.h3>
                <motion.p
                  layout
                  layoutId={`description-${activeJob.id}-${id}`}
                  style={{
                    fontSize: "0.875rem",
                    color: "#6b7280",
                    margin: 0,
                    marginTop: "4px",
                  }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                >
                  Added on{" "}
                  {new Date(activeJob.created_at).toLocaleDateString("tr-TR")}
                </motion.p>
              </ExpandedCardHeader>
              <ExpandedCardBody>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <ExpandedFormGroup>
                    <Input
                      label="Job Title"
                      placeholder="e.g. Senior Frontend Developer"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      required
                      fullWidth
                    />
                    <Input
                      label="Job URL (Optional)"
                      type="url"
                      placeholder="https://..."
                      value={editUrl}
                      onChange={(e) => setEditUrl(e.target.value)}
                      helperText="We'll extract the job description automatically"
                      fullWidth
                    />
                    <Textarea
                      label="Job Description"
                      placeholder="Paste the full job description here..."
                      value={editDescription}
                      onChange={(e) => setEditDescription(e.target.value)}
                      rows={8}
                      fullWidth
                      helperText={`${editDescription.length} characters`}
                    />
                  </ExpandedFormGroup>
                </motion.div>
              </ExpandedCardBody>
              <ExpandedCardFooter>
                <Button variant="ghost" onClick={handleCloseEdit}>
                  Cancel
                </Button>
                <Button onClick={handleEditSubmit} isLoading={isEditLoading}>
                  Update Job
                </Button>
              </ExpandedCardFooter>
            </ExpandedCardContainer>
          </ExpandedCardOverlay>
        )}
      </AnimatePresence>

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
            <JobCardWrapper
              key={job.id}
              layoutId={`card-${job.id}-${id}`}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              <JobCardInner>
                <JobCardBackground>
                  {job.text}
                </JobCardBackground>
                <JobCardContent>
                  <ContentInner className="job-content">
                    <CardTitleWrapper>
                      <CardTitleContent>
                        <motion.h3
                          layout
                          layoutId={`title-${job.id}-${id}`}
                          style={{
                            fontSize: "1.125rem",
                            fontWeight: 600,
                            margin: 0,
                            color: "var(--text-color)",
                          }}
                          transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        >
                          {job.title}
                        </motion.h3>
                        <motion.p
                          layout
                          layoutId={`description-${job.id}-${id}`}
                          style={{
                            fontSize: "0.875rem",
                            color: "var(--text-secondary)",
                            margin: 0,
                            marginTop: "4px",
                          }}
                          transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        >
                          Added on{" "}
                          {new Date(job.created_at).toLocaleDateString("tr-TR")}
                        </motion.p>
                      </CardTitleContent>
                      <Badge>{job.text.length.toLocaleString()} chars</Badge>
                    </CardTitleWrapper>
                  </ContentInner>
                  <CTAContainer className="job-cta" onClick={(e) => e.stopPropagation()}>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => handleOpenEdit(job, e)}
                    >
                      Edit
                    </Button>
                    <ActionButton
                      $variant="danger"
                      onClick={(e) => handleDeleteClick(job.id, e)}
                    >
                      <DeleteIcon />
                    </ActionButton>
                  </CTAContainer>
                </JobCardContent>
              </JobCardInner>
            </JobCardWrapper>
          ))}
        </JobsList>
      )}
      </LayoutGroup>

      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
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
          <Button variant="ghost" onClick={closeModal}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} isLoading={isLoading}>
            Add Job
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
