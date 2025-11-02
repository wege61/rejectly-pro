"use client";

import styled from "styled-components";
import { useState, useCallback, useEffect } from "react";
import { Modal } from "./Modal";
import { Button } from "./Button";
import { Input } from "./Input";
import { Textarea } from "./Textarea";
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
  border: 2px dashed
    ${({ theme, $isDragging }) =>
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

const PreviewSection = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.md};

  &:last-child {
    margin-bottom: 0;
  }
`;

const PreviewTitle = styled.h4`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
  text-transform: uppercase;
`;

const PreviewContent = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.textPrimary};
  line-height: 1.6;
`;

const ResultSummary = styled.div`
  text-align: center;
  padding: ${({ theme }) => theme.spacing.xl};
`;

const ResultScore = styled.div`
  font-size: 64px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const ResultDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
  margin-top: ${({ theme }) => theme.spacing.xl};
  text-align: left;
`;

const ResultItem = styled.div`
  padding: ${({ theme }) => theme.spacing.md};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.md};
  background-color: ${({ theme }) => theme.colors.surface};
`;

const KeywordList = styled.ul`
  list-style: none;
  padding: 0;
  margin: ${({ theme }) => theme.spacing.sm} 0 0 0;
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const KeywordTag = styled.li`
  display: inline-block;
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
  background-color: rgba(102, 126, 234, 0.1);
  color: ${({ theme }) => theme.colors.primary};
  border-radius: ${({ theme }) => theme.radius.sm};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
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
  border: 2px solid
    ${({ theme, $selected }) =>
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

interface Document {
  id: string;
  user_id: string;
  type: string;
  title: string;
  text: string;
  file_url?: string;
  lang: string;
  created_at: string;
  updated_at: string;
}

interface JobResult {
  id: string;
  title: string;
  textLength: number;
  createdAt: string;
}

interface OnboardingWizardProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
}

const WIZARD_STORAGE_KEY = "rejectly_wizard_state";

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
  const [hasExistingCV, setHasExistingCV] = useState(false);

  // Step 1: CV Upload
  const [uploadedCV, setUploadedCV] = useState<Document | null>(null);
  const [cvText, setCvText] = useState("");

  // Step 2: Job Posting
  const [jobTitle, setJobTitle] = useState("");
  const [jobUrl, setJobUrl] = useState("");
  const [jobDetails, setJobDetails] = useState("");
  const [savedJob, setSavedJob] = useState<JobResult | null>(null);

  // Step 3: Analysis
  const [selectedCV, setSelectedCV] = useState<string | null>(null);
  const [selectedJobs, setSelectedJobs] = useState<string[]>([]);
  const [cvList, setCvList] = useState<Document[]>([]);
  const [jobList, setJobList] = useState<Document[]>([]);
  const [analysisProgress, setAnalysisProgress] = useState<string>("");

  // Step 4: Result Summary
  const [analysisResult, setAnalysisResult] = useState<{
    id: string;
    fitScore: number;
    summary: string;
    missingKeywords: string[];
  } | null>(null);

  // Dynamic total steps based on whether user has CV
  const totalSteps = hasExistingCV ? 3 : 4;
  const progress = (currentStep / totalSteps) * 100;

  // Check if user has existing CV when modal opens
  useEffect(() => {
    async function checkExistingCV() {
      if (!isOpen) return;

      try {
        const supabase = createClient();
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) return;

        const { data } = await supabase
          .from("documents")
          .select("*")
          .eq("user_id", user.id)
          .eq("type", "cv")
          .order("created_at", { ascending: false })
          .limit(1)
          .maybeSingle();

        if (data) {
          setHasExistingCV(true);
          setUploadedCV(data);
          setCvText(data.text || "");
          // Skip to step 2 if no saved state and user has CV
          const savedState = localStorage.getItem(WIZARD_STORAGE_KEY);
          if (!savedState) {
            setCurrentStep(2);
          }
        } else {
          setHasExistingCV(false);
          setCurrentStep(1);
        }
      } catch (error) {
        console.error("Failed to check existing CV:", error);
      }
    }

    checkExistingCV();
  }, [isOpen]);

  // Load wizard state from localStorage
  useEffect(() => {
    if (isOpen) {
      try {
        const savedState = localStorage.getItem(WIZARD_STORAGE_KEY);
        if (savedState) {
          const state = JSON.parse(savedState);
          setCurrentStep(state.currentStep || (hasExistingCV ? 2 : 1));
          setUploadedCV(state.uploadedCV || null);
          setCvText(state.cvText || "");
          setJobTitle(state.jobTitle || "");
          setJobUrl(state.jobUrl || "");
          setJobDetails(state.jobDetails || "");
          setSavedJob(state.savedJob || null);
          setSelectedCV(state.selectedCV || null);
          setSelectedJobs(state.selectedJobs || []);
        }
      } catch (error) {
        console.error("Failed to load wizard state:", error);
      }
    }
  }, [isOpen, hasExistingCV]);

  // Save wizard state to localStorage
  useEffect(() => {
    if (isOpen && currentStep < 4) {
      try {
        const state = {
          currentStep,
          uploadedCV,
          cvText,
          jobTitle,
          jobUrl,
          jobDetails,
          savedJob,
          selectedCV,
          selectedJobs,
        };
        localStorage.setItem(WIZARD_STORAGE_KEY, JSON.stringify(state));
      } catch (error) {
        console.error("Failed to save wizard state:", error);
      }
    }
  }, [
    currentStep,
    uploadedCV,
    cvText,
    jobTitle,
    jobUrl,
    jobDetails,
    savedJob,
    selectedCV,
    selectedJobs,
    isOpen,
  ]);

  // Clear wizard state when modal is completed
  const handleComplete = () => {
    localStorage.removeItem(WIZARD_STORAGE_KEY);
    onComplete();
  };

  // Step 1: Handle CV Upload
  const handleFileSelect = async (file: File) => {
    if (!file) return;

    setIsLoading(true);
    try {
      // If user already has a CV, delete it first (single CV policy)
      if (hasExistingCV && uploadedCV) {
        const supabase = createClient();
        const { error: deleteError } = await supabase
          .from("documents")
          .delete()
          .eq("id", uploadedCV.id);

        if (deleteError) {
          console.error("Failed to delete existing CV:", deleteError);
          // Continue anyway
        }
      }

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
      setCvText(result.document.text || "");
      toast.success("CV uploaded successfully!");
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Upload failed";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) {
        handleFileSelect(file);
      }
    },
    [handleFileSelect]
  );

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
    if (!jobTitle || (!jobUrl && !jobDetails)) {
      toast.error("Please fill in the required fields");
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
          description: jobDetails || null,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Job posting failed");
      }

      toast.success("Job posting added!");
      setSavedJob(result.job);
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
      const {
        data: { user },
      } = await supabase.auth.getUser();

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

      // Auto-select uploaded/existing CV and job
      if (uploadedCV) {
        setSelectedCV(uploadedCV.id);
      } else if (cvsRes.data && cvsRes.data.length > 0) {
        // Auto-select first (most recent) CV if exists
        setSelectedCV(cvsRes.data[0].id);
      }

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
      // Show progress messages
      setAnalysisProgress("Preparing your documents...");
      await new Promise((resolve) => setTimeout(resolve, 500));

      setAnalysisProgress("Analyzing CV content...");
      await new Promise((resolve) => setTimeout(resolve, 500));

      setAnalysisProgress("Comparing with job requirements...");

      // Call the analyze API instead of direct insert
      const response = await fetch("/api/analyze/free", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          cvId: selectedCV,
          jobIds: selectedJobs,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Analysis failed");
      }

      setAnalysisProgress("Calculating match score...");
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Save analysis result and move to step 4
      setAnalysisResult({
        id: result.report.id,
        fitScore: result.report.fitScore,
        summary: result.report.summary,
        missingKeywords: result.report.missingKeywords || [],
      });

      toast.success("Analysis complete!");
      setCurrentStep(4);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to create analysis";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
      setAnalysisProgress("");
    }
  };

  const renderStepContent = () => {
    // If user has CV, skip step 1
    const effectiveStep = hasExistingCV ? currentStep + 1 : currentStep;

    switch (effectiveStep) {
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
                <PreviewPanel>
                  <PreviewSection>
                    <PreviewTitle>✓ CV Uploaded</PreviewTitle>
                    <PreviewContent>
                      <strong>{uploadedCV.title || "Your CV"}</strong>
                      <p style={{ marginTop: "8px", opacity: 0.7 }}>
                        {cvText.substring(0, 200)}
                        {cvText.length > 200 && "..."}
                      </p>
                    </PreviewContent>
                  </PreviewSection>
                </PreviewPanel>
              ) : (
                <UploadArea
                  $isDragging={isDragging}
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onClick={() =>
                    document.getElementById("cv-file-input")?.click()
                  }
                >
                  <UploadIcon>📄</UploadIcon>
                  <UploadText>
                    <strong>Click to upload</strong> or drag and drop
                  </UploadText>
                  <p style={{ fontSize: "14px", opacity: 0.7 }}>
                    PDF or DOCX (Max 5MB)
                  </p>
                  <input
                    id="cv-file-input"
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
              <StepTitle>Add Job Posting</StepTitle>
              <StepDescription>
                Enter the job title and paste the full job description
              </StepDescription>
            </StepHeader>
            <StepContent>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "16px",
                }}
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
                    label="Job Description"
                    placeholder="Paste the full job description here (requirements, responsibilities, qualifications, etc.)..."
                    value={jobDetails}
                    onChange={(e) => setJobDetails(e.target.value)}
                    rows={10}
                    fullWidth
                  />
                  <CharCount>{jobDetails.length} characters</CharCount>
                </div>
              </div>
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
                  <h4 style={{ fontWeight: 600, marginBottom: "12px" }}>
                    Selected CV
                  </h4>
                  {cvList.map((cv) => (
                    <SelectionCard
                      key={cv.id}
                      $selected={selectedCV === cv.id}
                      onClick={() => setSelectedCV(cv.id)}
                    >
                      <div style={{ fontWeight: 500 }}>{cv.title}</div>
                      <div
                        style={{
                          fontSize: "14px",
                          opacity: 0.7,
                          marginTop: "4px",
                        }}
                      >
                        {new Date(cv.created_at).toLocaleDateString()}
                      </div>
                    </SelectionCard>
                  ))}
                </div>

                <div>
                  <h4 style={{ fontWeight: 600, marginBottom: "12px" }}>
                    Job Postings ({selectedJobs.length} selected)
                  </h4>
                  {jobList.map((job) => (
                    <SelectionCard
                      key={job.id}
                      $selected={selectedJobs.includes(job.id)}
                      onClick={() => {
                        if (selectedJobs.includes(job.id)) {
                          setSelectedJobs(
                            selectedJobs.filter((id) => id !== job.id)
                          );
                        } else {
                          setSelectedJobs([...selectedJobs, job.id]);
                        }
                      }}
                    >
                      <div style={{ fontWeight: 500 }}>{job.title}</div>
                      <div
                        style={{
                          fontSize: "14px",
                          opacity: 0.7,
                          marginTop: "4px",
                        }}
                      >
                        {new Date(job.created_at).toLocaleDateString()}
                      </div>
                    </SelectionCard>
                  ))}
                </div>
              </SelectionList>
            </StepContent>
          </>
        );

      case 4:
        return (
          <>
            <StepHeader>
              <StepTitle>✨ Analysis Complete!</StepTitle>
              <StepDescription>
                Here&apos;s your CV match summary
              </StepDescription>
            </StepHeader>
            <StepContent>
              {analysisResult && (
                <ResultSummary>
                  <ResultScore>{analysisResult.fitScore}%</ResultScore>
                  <p
                    style={{
                      fontSize: "18px",
                      color: "#6b7280",
                      marginBottom: "16px",
                    }}
                  >
                    Match Score
                  </p>

                  <ResultDetails>
                    <ResultItem>
                      <h4 style={{ fontWeight: 600, marginBottom: "8px" }}>
                        Summary
                      </h4>
                      <p style={{ color: "#6b7280", lineHeight: "1.6" }}>
                        {analysisResult.summary}
                      </p>
                    </ResultItem>

                    {analysisResult.missingKeywords &&
                      analysisResult.missingKeywords.length > 0 && (
                        <ResultItem>
                          <h4 style={{ fontWeight: 600, marginBottom: "8px" }}>
                            Missing Keywords (
                            {analysisResult.missingKeywords.length})
                          </h4>
                          <KeywordList>
                            {analysisResult.missingKeywords.map(
                              (keyword, index) => (
                                <KeywordTag key={index}>{keyword}</KeywordTag>
                              )
                            )}
                          </KeywordList>
                        </ResultItem>
                      )}
                  </ResultDetails>
                </ResultSummary>
              )}
            </StepContent>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <WizardContainer>
        <ProgressBar>
          <ProgressFill $progress={progress} />
        </ProgressBar>

        {isLoading ? (
          <div style={{ textAlign: "center", padding: "60px 0" }}>
            <Spinner size="xl" />
            <p style={{ marginTop: "24px", fontSize: "18px", fontWeight: 600 }}>
              {analysisProgress || "Processing..."}
            </p>
            {analysisProgress && (
              <p
                style={{ marginTop: "8px", color: "#6b7280", fontSize: "14px" }}
              >
                This may take a few moments
              </p>
            )}
          </div>
        ) : (
          <>
            {renderStepContent()}

            <WizardActions>
              {/* Previous Button */}
              {currentStep < (hasExistingCV ? 3 : 4) && (
                <Button
                  variant="ghost"
                  onClick={() => {
                    // If has CV and on step 2, close modal (no step 1)
                    if (hasExistingCV && currentStep === 2) {
                      onClose();
                    } else if (currentStep > 1) {
                      setCurrentStep(currentStep - 1);
                    } else {
                      onClose();
                    }
                  }}
                >
                  {currentStep === 1 || (hasExistingCV && currentStep === 2)
                    ? "Cancel"
                    : "← Previous"}
                </Button>
              )}

              {/* Next/Action Buttons - adjust for hasExistingCV */}
              {!hasExistingCV && currentStep === 1 && uploadedCV && (
                <Button onClick={() => setCurrentStep(2)}>Next Step →</Button>
              )}

              {currentStep === 2 && (
                <Button
                  onClick={async () => {
                    await handleJobSubmit();
                    if (savedJob || jobTitle) {
                      setCurrentStep(3);
                      fetchDataForAnalysis();
                    }
                  }}
                  disabled={!jobTitle || (!jobUrl && !jobDetails)}
                >
                  Save & Continue →
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

              {((!hasExistingCV && currentStep === 4) ||
                (hasExistingCV && currentStep === 4)) &&
                analysisResult && (
                  <Button
                    onClick={() => {
                      handleComplete();
                      router.push(`/reports/${analysisResult.id}`);
                    }}
                  >
                    View Full Report →
                  </Button>
                )}
            </WizardActions>
          </>
        )}
      </WizardContainer>
    </Modal>
  );
}
