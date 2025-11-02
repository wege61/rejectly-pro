"use client";

import styled from "styled-components";
import { useState, useCallback, useEffect } from "react";
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

const EditablePreview = styled.textarea`
  width: 100%;
  min-height: 80px;
  padding: ${({ theme }) => theme.spacing.sm};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.sm};
  background-color: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.textPrimary};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  resize: vertical;
  font-family: inherit;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const ResultSummary = styled.div`
  text-align: center;
  padding: ${({ theme }) => theme.spacing.xl};
`;

const ResultScore = styled.div`
  font-size: 64px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
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

  // Step 1: CV Upload
  const [uploadedCV, setUploadedCV] = useState<any>(null);
  const [cvText, setCvText] = useState("");

  // Step 2: Job Posting
  const [jobTitle, setJobTitle] = useState("");
  const [jobSummary, setJobSummary] = useState("");
  const [jobDetails, setJobDetails] = useState("");
  const [savedJob, setSavedJob] = useState<any>(null);

  // Step 3: Analysis
  const [selectedCV, setSelectedCV] = useState<string | null>(null);
  const [selectedJobs, setSelectedJobs] = useState<string[]>([]);
  const [cvList, setCvList] = useState<any[]>([]);
  const [jobList, setJobList] = useState<any[]>([]);
  const [analysisProgress, setAnalysisProgress] = useState<string>("");

  // Step 4: Result Summary
  const [analysisResult, setAnalysisResult] = useState<{
    id: string;
    fitScore: number;
    summary: string;
    missingKeywords: string[];
  } | null>(null);

  const totalSteps = 4;
  const progress = (currentStep / totalSteps) * 100;

  // Load wizard state from localStorage
  useEffect(() => {
    if (isOpen) {
      try {
        const savedState = localStorage.getItem(WIZARD_STORAGE_KEY);
        if (savedState) {
          const state = JSON.parse(savedState);
          setCurrentStep(state.currentStep || 1);
          setUploadedCV(state.uploadedCV || null);
          setCvText(state.cvText || "");
          setJobTitle(state.jobTitle || "");
          setJobSummary(state.jobSummary || "");
          setJobDetails(state.jobDetails || "");
          setSavedJob(state.savedJob || null);
          setSelectedCV(state.selectedCV || null);
          setSelectedJobs(state.selectedJobs || []);
        }
      } catch (error) {
        console.error("Failed to load wizard state:", error);
      }
    }
  }, [isOpen]);

  // Save wizard state to localStorage
  useEffect(() => {
    if (isOpen && currentStep < 4) {
      try {
        const state = {
          currentStep,
          uploadedCV,
          cvText,
          jobTitle,
          jobSummary,
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
  }, [currentStep, uploadedCV, cvText, jobTitle, jobSummary, jobDetails, savedJob, selectedCV, selectedJobs, isOpen]);

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
    if (!jobTitle || !jobSummary || !jobDetails) {
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

      // Combine summary and details
      const fullJobDescription = `${jobSummary}\n\n${jobDetails}`;

      const { data, error } = await supabase
        .from("documents")
        .insert({
          user_id: user.id,
          type: "job",
          title: jobTitle,
          text: fullJobDescription,
          lang: "en",
        })
        .select()
        .single();

      if (error) throw error;

      setSavedJob(data);
      toast.success("Job posting added!");
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
      // Show progress messages
      setAnalysisProgress("Preparing your documents...");
      await new Promise(resolve => setTimeout(resolve, 500));

      setAnalysisProgress("Analyzing CV content...");
      await new Promise(resolve => setTimeout(resolve, 500));

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
      await new Promise(resolve => setTimeout(resolve, 500));

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
                <>
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
                      {cvText.length} characters extracted
                    </p>
                  </div>

                  {cvText && (
                    <PreviewPanel>
                      <PreviewSection>
                        <PreviewTitle>CV Content Preview</PreviewTitle>
                        <EditablePreview
                          value={cvText}
                          onChange={(e) => setCvText(e.target.value)}
                          placeholder="Edit your CV text here..."
                        />
                        <CharCount>{cvText.length} characters</CharCount>
                      </PreviewSection>
                    </PreviewPanel>
                  )}
                </>
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
                    Job Summary
                  </label>
                  <Textarea
                    placeholder="Brief overview of the position..."
                    value={jobSummary}
                    onChange={(e) => setJobSummary(e.target.value)}
                    style={{ minHeight: "120px" }}
                  />
                  <CharCount>
                    {jobSummary.length} characters · {jobSummary.split('\n').length} lines
                  </CharCount>
                </div>
                <div>
                  <label style={{ display: "block", marginBottom: "8px", fontWeight: 500 }}>
                    Detailed Description
                  </label>
                  <Textarea
                    placeholder="Full job description, requirements, responsibilities..."
                    value={jobDetails}
                    onChange={(e) => setJobDetails(e.target.value)}
                    style={{ minHeight: "200px" }}
                  />
                  <CharCount>
                    {jobDetails.length} characters · {jobDetails.split('\n').length} lines
                  </CharCount>
                </div>

                {/* Preview */}
                {(jobSummary || jobDetails) && (
                  <PreviewPanel>
                    <PreviewTitle>Preview</PreviewTitle>
                    <PreviewContent>
                      {jobSummary && (
                        <div style={{ marginBottom: "16px" }}>
                          <strong>Summary:</strong>
                          <p style={{ marginTop: "8px", whiteSpace: "pre-wrap" }}>{jobSummary}</p>
                        </div>
                      )}
                      {jobDetails && (
                        <div>
                          <strong>Details:</strong>
                          <p style={{ marginTop: "8px", whiteSpace: "pre-wrap" }}>{jobDetails}</p>
                        </div>
                      )}
                    </PreviewContent>
                  </PreviewPanel>
                )}
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

      case 4:
        return (
          <>
            <StepHeader>
              <StepTitle>✨ Analysis Complete!</StepTitle>
              <StepDescription>
                Here's your CV match summary
              </StepDescription>
            </StepHeader>
            <StepContent>
              {analysisResult && (
                <ResultSummary>
                  <ResultScore>{analysisResult.fitScore}%</ResultScore>
                  <p style={{ fontSize: "18px", color: "#6b7280", marginBottom: "16px" }}>
                    Match Score
                  </p>

                  <ResultDetails>
                    <ResultItem>
                      <h4 style={{ fontWeight: 600, marginBottom: "8px" }}>Summary</h4>
                      <p style={{ color: "#6b7280", lineHeight: "1.6" }}>
                        {analysisResult.summary}
                      </p>
                    </ResultItem>

                    {analysisResult.missingKeywords && analysisResult.missingKeywords.length > 0 && (
                      <ResultItem>
                        <h4 style={{ fontWeight: 600, marginBottom: "8px" }}>
                          Missing Keywords ({analysisResult.missingKeywords.length})
                        </h4>
                        <KeywordList>
                          {analysisResult.missingKeywords.map((keyword, index) => (
                            <KeywordTag key={index}>{keyword}</KeywordTag>
                          ))}
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
              <p style={{ marginTop: "8px", color: "#6b7280", fontSize: "14px" }}>
                This may take a few moments
              </p>
            )}
          </div>
        ) : (
          <>
            {renderStepContent()}

            <WizardActions>
              {/* Previous Button */}
              {currentStep < 4 && (
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
                  {currentStep === 1 ? "Cancel" : "← Previous"}
                </Button>
              )}

              {/* Next/Action Buttons */}
              {currentStep === 1 && uploadedCV && (
                <Button onClick={() => setCurrentStep(2)}>
                  Next Step →
                </Button>
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
                  disabled={!jobTitle || !jobSummary || !jobDetails}
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

              {currentStep === 4 && analysisResult && (
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
