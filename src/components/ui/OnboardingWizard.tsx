"use client";

import styled from "styled-components";
import { useState, useCallback } from "react";
import { Modal } from "./Modal";
import { Button } from "./Button";
import { Spinner } from "./Spinner";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useToast } from "@/contexts/ToastContext";

const WizardContainer = styled.div`
  min-height: 400px;
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 4px;
  background-color: ${({ theme }) => theme.colors.border};
  border-radius: 999px;
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  overflow: hidden;
`;

const ProgressFill = styled.div<{ $progress: number }>`
  width: ${({ $progress }) => $progress}%;
  height: 100%;
  background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
  border-radius: 999px;
  transition: width 0.3s ease;
`;

const StepHeader = styled.div`
  text-align: center;
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const StepTitle = styled.h2`
  font-size: ${({ theme }) => theme.typography.fontSize["2xl"]};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const StepDescription = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const StepContent = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const UploadArea = styled.div<{ $isDragging: boolean }>`
  border: 2px dashed ${({ theme, $isDragging }) =>
    $isDragging ? theme.colors.primary : theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.lg};
  padding: ${({ theme }) => theme.spacing["2xl"]};
  text-align: center;
  background-color: ${({ theme, $isDragging }) =>
    $isDragging ? "rgba(102, 126, 234, 0.05)" : "transparent"};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.normal};

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
    background-color: rgba(102, 126, 234, 0.05);
  }
`;

const UploadIcon = styled.div`
  font-size: 48px;
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const UploadText = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const JobForm = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
`;

const Input = styled.input`
  width: 100%;
  padding: ${({ theme }) => theme.spacing.md};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.md};
  background-color: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.textPrimary};
  font-size: ${({ theme }) => theme.typography.fontSize.base};

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const Textarea = styled.textarea`
  width: 100%;
  min-height: 200px;
  padding: ${({ theme }) => theme.spacing.md};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.md};
  background-color: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.textPrimary};
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  resize: vertical;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const CharCount = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
  text-align: right;
`;

const WizardActions = styled.div`
  display: flex;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.md};
  margin-top: ${({ theme }) => theme.spacing.xl};
`;

const SelectionList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const SelectionCard = styled.div<{ $selected: boolean }>`
  padding: ${({ theme }) => theme.spacing.md};
  border: 2px solid ${({ theme, $selected }) =>
    $selected ? theme.colors.primary : theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.md};
  background-color: ${({ theme, $selected }) =>
    $selected ? "rgba(102, 126, 234, 0.1)" : theme.colors.surface};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.normal};

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

interface OnboardingWizardProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
}

export function OnboardingWizard({
  isOpen,
  onClose,
  onComplete,
}: OnboardingWizardProps) {
  const router = useRouter();
  const toast = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  // Step 1: CV Upload
  const [uploadedCV, setUploadedCV] = useState<any>(null);

  // Step 2: Job Posting
  const [jobTitle, setJobTitle] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [savedJob, setSavedJob] = useState<any>(null);

  // Step 3: Analysis
  const [selectedCV, setSelectedCV] = useState<string | null>(null);
  const [selectedJobs, setSelectedJobs] = useState<string[]>([]);
  const [cvList, setCvList] = useState<any[]>([]);
  const [jobList, setJobList] = useState<any[]>([]);

  const totalSteps = 3;
  const progress = (currentStep / totalSteps) * 100;

  // Step 1: Handle CV Upload
  const handleFileSelect = async (file: File) => {
    if (!file) return;

    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/cv/upload", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Upload failed");
      }

      setUploadedCV(result.document);
      toast.success("CV uploaded successfully! Moving to next step...");

      // Auto-advance to next step
      setTimeout(() => {
        setCurrentStep(2);
      }, 1000);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Upload failed";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileSelect(file);
    }
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  // Step 2: Handle Job Posting
  const handleJobSubmit = async () => {
    if (!jobTitle || !jobDescription) {
      toast.error("Please fill in all fields");
      return;
    }

    setIsLoading(true);
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        throw new Error("Not authenticated");
      }

      const { data, error } = await supabase
        .from("documents")
        .insert({
          user_id: user.id,
          type: "job",
          title: jobTitle,
          text: jobDescription,
          lang: "en",
        })
        .select()
        .single();

      if (error) throw error;

      setSavedJob(data);
      toast.success("Job posting added! Moving to analysis step...");

      // Auto-advance to next step
      setTimeout(() => {
        setCurrentStep(3);
        fetchDataForAnalysis();
      }, 1000);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to add job";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Step 3: Fetch data for analysis
  const fetchDataForAnalysis = async () => {
    setIsLoading(true);
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) return;

      const [cvsRes, jobsRes] = await Promise.all([
        supabase
          .from("documents")
          .select("*")
          .eq("user_id", user.id)
          .eq("type", "cv"),
        supabase
          .from("documents")
          .select("*")
          .eq("user_id", user.id)
          .eq("type", "job"),
      ]);

      setCvList(cvsRes.data || []);
      setJobList(jobsRes.data || []);

      // Auto-select uploaded CV and job
      if (uploadedCV) setSelectedCV(uploadedCV.id);
      if (savedJob) setSelectedJobs([savedJob.id]);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Step 3: Create analysis
  const handleCreateAnalysis = async () => {
    if (!selectedCV || selectedJobs.length === 0) {
      toast.error("Please select a CV and at least one job posting");
      return;
    }

    setIsLoading(true);
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) throw new Error("Not authenticated");

      const { data: report, error } = await supabase
        .from("reports")
        .insert({
          user_id: user.id,
          cv_id: selectedCV,
          job_ids: selectedJobs,
        })
        .select()
        .single();

      if (error) throw error;

      toast.success("Analysis created! Generating your report...");

      // Close wizard and redirect to report
      onComplete();
      router.push(`/reports/${report.id}`);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to create analysis";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <>
            <StepHeader>
              <StepTitle>📄 Upload Your CV</StepTitle>
              <StepDescription>
                Upload your resume in PDF or DOCX format
              </StepDescription>
            </StepHeader>
            <StepContent>
              {uploadedCV ? (
                <div
                  style={{
                    padding: "24px",
                    border: "2px solid #10b981",
                    borderRadius: "12px",
                    backgroundColor: "rgba(16, 185, 129, 0.1)",
                    textAlign: "center",
                  }}
                >
                  <div style={{ fontSize: "48px", marginBottom: "16px" }}>✓</div>
                  <p style={{ fontSize: "18px", fontWeight: 600, marginBottom: "8px" }}>
                    {uploadedCV.title}
                  </p>
                  <p style={{ fontSize: "14px", color: "#6b7280" }}>
                    {uploadedCV.textLength || uploadedCV.text?.length} characters extracted
                  </p>
                </div>
              ) : (
                <UploadArea
                  $isDragging={isDragging}
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onClick={() => document.getElementById("wizard-cv-upload")?.click()}
                >
                  <UploadIcon>📤</UploadIcon>
                  <UploadText>
                    <strong>Click to upload</strong> or drag and drop
                  </UploadText>
                  <p style={{ fontSize: "14px", color: "#9ca3af" }}>
                    PDF or DOCX (max 5MB)
                  </p>
                  <input
                    id="wizard-cv-upload"
                    type="file"
                    accept=".pdf,.docx"
                    style={{ display: "none" }}
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleFileSelect(file);
                    }}
                  />
                </UploadArea>
              )}
            </StepContent>
          </>
        );

      case 2:
        return (
          <>
            <StepHeader>
              <StepTitle>💼 Add Job Posting</StepTitle>
              <StepDescription>
                Paste the job description you want to apply to
              </StepDescription>
            </StepHeader>
            <StepContent>
              <JobForm>
                <div>
                  <label style={{ display: "block", marginBottom: "8px", fontWeight: 500 }}>
                    Job Title
                  </label>
                  <Input
                    type="text"
                    placeholder="e.g. Senior Frontend Developer"
                    value={jobTitle}
                    onChange={(e) => setJobTitle(e.target.value)}
                  />
                </div>
                <div>
                  <label style={{ display: "block", marginBottom: "8px", fontWeight: 500 }}>
                    Job Description
                  </label>
                  <Textarea
                    placeholder="Paste the full job description here..."
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                  />
                  <CharCount>{jobDescription.length} characters</CharCount>
                </div>
              </JobForm>
            </StepContent>
          </>
        );

      case 3:
        return (
          <>
            <StepHeader>
              <StepTitle>🎯 Create Analysis</StepTitle>
              <StepDescription>
                Review your selections and generate your match report
              </StepDescription>
            </StepHeader>
            <StepContent>
              <SelectionList>
                <div>
                  <h3 style={{ marginBottom: "12px", fontSize: "16px", fontWeight: 600 }}>
                    Selected CV
                  </h3>
                  {cvList.map((cv) => (
                    <SelectionCard
                      key={cv.id}
                      $selected={selectedCV === cv.id}
                      onClick={() => setSelectedCV(cv.id)}
                    >
                      <div style={{ fontWeight: 500 }}>{cv.title}</div>
                      <div style={{ fontSize: "14px", color: "#6b7280", marginTop: "4px" }}>
                        {cv.text?.length || 0} characters
                      </div>
                    </SelectionCard>
                  ))}
                </div>
                <div>
                  <h3 style={{ marginBottom: "12px", fontSize: "16px", fontWeight: 600 }}>
                    Selected Job Postings
                  </h3>
                  {jobList.map((job) => (
                    <SelectionCard
                      key={job.id}
                      $selected={selectedJobs.includes(job.id)}
                      onClick={() => {
                        if (selectedJobs.includes(job.id)) {
                          setSelectedJobs(selectedJobs.filter((id) => id !== job.id));
                        } else {
                          setSelectedJobs([...selectedJobs, job.id]);
                        }
                      }}
                    >
                      <div style={{ fontWeight: 500 }}>{job.title}</div>
                      <div style={{ fontSize: "14px", color: "#6b7280", marginTop: "4px" }}>
                        {job.text?.length || 0} characters
                      </div>
                    </SelectionCard>
                  ))}
                </div>
              </SelectionList>
            </StepContent>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="large">
      <WizardContainer>
        <ProgressBar>
          <ProgressFill $progress={progress} />
        </ProgressBar>

        {isLoading ? (
          <div style={{ textAlign: "center", padding: "60px 0" }}>
            <Spinner size="xl" />
            <p style={{ marginTop: "24px", color: "#6b7280" }}>Processing...</p>
          </div>
        ) : (
          <>
            {renderStepContent()}

            <WizardActions>
              <Button
                variant="ghost"
                onClick={() => {
                  if (currentStep > 1) {
                    setCurrentStep(currentStep - 1);
                  } else {
                    onClose();
                  }
                }}
              >
                {currentStep === 1 ? "Cancel" : "Back"}
              </Button>

              {currentStep === 1 && uploadedCV && (
                <Button onClick={() => setCurrentStep(2)}>
                  Next Step →
                </Button>
              )}

              {currentStep === 2 && (
                <Button
                  onClick={handleJobSubmit}
                  disabled={!jobTitle || !jobDescription}
                >
                  Add Job & Continue →
                </Button>
              )}

              {currentStep === 3 && (
                <Button
                  onClick={handleCreateAnalysis}
                  disabled={!selectedCV || selectedJobs.length === 0}
                >
                  Generate Analysis 🎯
                </Button>
              )}
            </WizardActions>
          </>
        )}
      </WizardContainer>
    </Modal>
  );
}
