"use client";

import styled from "styled-components";
import { useState, useCallback, useEffect } from "react";
import { Modal } from "./Modal";
import { Button } from "./Button";
import { Spinner } from "./Spinner";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useToast } from "@/contexts/ToastContext";

// Icons
const DocumentIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={2}
    stroke="currentColor"
    style={{ width: '20px', height: '20px', display: 'inline-block', verticalAlign: 'middle' }}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
    />
  </svg>
);

const UploadArrowIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={2}
    stroke="currentColor"
    style={{ width: '48px', height: '48px', display: 'inline-block', verticalAlign: 'middle' }}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
    />
  </svg>
);

const BriefcaseIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={2}
    stroke="currentColor"
    style={{ width: '20px', height: '20px', display: 'inline-block', verticalAlign: 'middle' }}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0M12 12.75h.008v.008H12v-.008z"
    />
  </svg>
);

const TargetIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={2}
    stroke="currentColor"
    style={{ width: '20px', height: '20px', display: 'inline-block', verticalAlign: 'middle' }}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);

const SparklesIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={2}
    stroke="currentColor"
    style={{ width: '20px', height: '20px', display: 'inline-block', verticalAlign: 'middle' }}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z"
    />
  </svg>
);

const EditIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={2}
    stroke="currentColor"
    style={{ width: '20px', height: '20px', display: 'inline-block', verticalAlign: 'middle' }}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
    />
  </svg>
);

const WizardContainer = styled.div`
  height: 70vh;
  min-height: 500px;
  max-height: 800px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 4px;
  background-color: ${({ theme }) => theme.colors.border};
  border-radius: 999px;
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  overflow: hidden;
  flex-shrink: 0;
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
  flex-shrink: 0;
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
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  padding-right: ${({ theme }) => theme.spacing.sm};
  margin-bottom: ${({ theme }) => theme.spacing.md};

  /* Custom scrollbar styling */
  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: ${({ theme }) => theme.colors.background};
    border-radius: ${({ theme }) => theme.radius.full};
  }

  &::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.colors.border};
    border-radius: ${({ theme }) => theme.radius.full};

    &:hover {
      background: ${({ theme }) => theme.colors.borderHover};
    }
  }
`;

const UploadArea = styled.div<{ $isDragging: boolean }>`
  border: 2px dashed ${({ theme, $isDragging }) =>
    $isDragging ? theme.colors.primary : theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.lg};
  padding: ${({ theme }) => `${theme.spacing["3xl"]} ${theme.spacing.xl}`};
  text-align: center;
  background-color: ${({ theme, $isDragging }) =>
    $isDragging ? theme.colors.primaryLight : theme.colors.background};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.normal};
  min-height: 240px;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
    background-color: ${({ theme }) => theme.colors.primaryLight};
    transform: translateY(-2px);
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
  margin-top: ${({ theme }) => theme.spacing.xl};
  padding: ${({ theme }) => theme.spacing.lg};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.lg};
  background-color: ${({ theme }) => theme.colors.background};
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

const EditablePreview = styled.textarea`
  width: 100%;
  min-height: 120px;
  padding: ${({ theme }) => theme.spacing.md};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.md};
  background-color: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.textPrimary};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  line-height: ${({ theme }) => theme.typography.lineHeight.relaxed};
  resize: vertical;
  font-family: ${({ theme }) => theme.typography.fontFamily.sans};
  transition: all ${({ theme }) => theme.transitions.fast};

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    background-color: ${({ theme }) => theme.colors.background};
  }
  
  &::placeholder {
    color: ${({ theme }) => theme.colors.textTertiary};
  }
`;

const ResultSummary = styled.div`
  text-align: center;
  padding: ${({ theme }) => `${theme.spacing["2xl"]} ${theme.spacing.xl}`};
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
`;

const ResultScore = styled.div`
  font-size: 80px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: ${({ theme }) => theme.spacing.sm};
  animation: ${({ theme }) => theme.animations.scaleIn} 0.5s ease;
  line-height: 1;
`;

const ResultDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
  margin-top: ${({ theme }) => theme.spacing.xl};
  text-align: left;
`;

const ResultItem = styled.div`
  padding: ${({ theme }) => theme.spacing.lg};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.lg};
  background-color: ${({ theme }) => theme.colors.surface};
  transition: all ${({ theme }) => theme.transitions.normal};
  
  &:hover {
    border-color: ${({ theme }) => theme.colors.borderHover};
    box-shadow: ${({ theme }) => theme.shadow.md};
  }
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
  display: inline-flex;
  align-items: center;
  padding: ${({ theme }) => `${theme.spacing.xs} ${theme.spacing.md}`};
  background-color: ${({ theme }) => theme.colors.primaryLight};
  color: ${({ theme }) => theme.colors.primary};
  border: 1px solid ${({ theme }) => theme.colors.primary}33;
  border-radius: ${({ theme }) => theme.radius.full};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  transition: all ${({ theme }) => theme.transitions.fast};
  
  &:hover {
    background-color: ${({ theme }) => theme.colors.primary};
    color: white;
    transform: translateY(-1px);
  }
`;

const WizardActions = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.md};
  padding-top: ${({ theme }) => theme.spacing.lg};
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  flex-shrink: 0;
  margin-top: 0;
`;

const SelectionList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const SuccessBox = styled.div`
  padding: ${({ theme }) => theme.spacing["2xl"]};
  border: 2px solid ${({ theme }) => theme.colors.success};
  border-radius: ${({ theme }) => theme.radius.lg};
  background: ${({ theme }) => theme.colors.successLight};
  text-align: center;
  animation: ${({ theme }) => theme.animations.scaleIn} 0.3s ease;
`;

const SuccessIcon = styled.div`
  font-size: 64px;
  margin-bottom: ${({ theme }) => theme.spacing.md};
  animation: ${({ theme }) => theme.animations.bounce} 0.6s ease;
`;

const SuccessTitle = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.textPrimary};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

const SuccessSubtitle = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const ReplaceButton = styled(Button)`
  margin-top: ${({ theme }) => theme.spacing.md};
`;

const CVOptionWrapper = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const ExistingCVCard = styled.div`
  padding: ${({ theme }) => theme.spacing.xl};
  border: 2px solid ${({ theme }) => theme.colors.primary};
  border-radius: ${({ theme }) => theme.radius.lg};
  background: ${({ theme }) => theme.colors.primaryLight};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.normal};
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;

  &:hover {
    border-color: ${({ theme }) => theme.colors.primaryHover};
    transform: translateY(-2px);
    box-shadow: ${({ theme }) => theme.shadow.lg};
  }
`;

const CVIcon = styled.div`
  font-size: 48px;
  margin-bottom: ${({ theme }) => theme.spacing.md};
  text-align: center;
`;

const CVTitle = styled.h4`
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.textPrimary};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
  text-align: center;
`;

const CVSubtitle = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
  text-align: center;
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
  justify-content: center;
`;

const CVOptionsContainer = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  align-items: stretch;

  @media (max-width: 600px) {
    flex-direction: column;
    gap: 0!important;
  }
`;

const DividerText = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  padding: 0 ${({ theme }) => theme.spacing.sm};
  position: relative;

  &::before,
  &::after {
    content: '';
    flex: 1;
    height: 1px;
    background: ${({ theme }) => theme.colors.border};
  }

  &::before {
    margin-right: ${({ theme }) => theme.spacing.sm};
  }

  &::after {
    margin-left: ${({ theme }) => theme.spacing.sm};
  }

  @media (max-width: 600px) {
    margin: ${({ theme }) => theme.spacing.lg} 0;

    &::before,
    &::after {
      display: none;
    }
  }
`;

const FormLabel = styled.label`
  display: block;
  margin-bottom: ${({ theme }) => theme.spacing.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const SectionHeading = styled.h3`
  margin-bottom: ${({ theme }) => theme.spacing.md};
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const CardTitle = styled.div`
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  color: ${({ theme }) => theme.colors.textPrimary};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

const CardSubtitle = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const LoadingContainer = styled.div`
  text-align: center;
  padding: ${({ theme }) => `${theme.spacing["3xl"]} 0`};
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const LoadingTitle = styled.p`
  margin-top: ${({ theme }) => theme.spacing.xl};
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const LoadingSubtitle = styled.p`
  margin-top: ${({ theme }) => theme.spacing.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
`;

const UploadHint = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.textTertiary};
  margin-top: ${({ theme }) => theme.spacing.xs};
`;

const ResultScoreLabel = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  color: ${({ theme }) => theme.colors.textSecondary};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
`;

const ResultHeading = styled.h4`
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
  color: ${({ theme }) => theme.colors.textPrimary};
  font-size: ${({ theme }) => theme.typography.fontSize.base};
`;

const ResultText = styled.p`
  color: ${({ theme }) => theme.colors.textSecondary};
  line-height: ${({ theme }) => theme.typography.lineHeight.relaxed};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
`;

const SelectionCard = styled.div<{ $selected: boolean }>`
  padding: ${({ theme }) => theme.spacing.lg};
  border: 2px solid ${({ theme, $selected }) =>
    $selected ? theme.colors.primary : theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.lg};
  background-color: ${({ theme, $selected }) =>
    $selected ? theme.colors.primaryLight : theme.colors.surface};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.normal};
  position: relative;
  overflow: hidden;

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
    background-color: ${({ theme }) => theme.colors.primaryLight};
    transform: translateX(4px);
  }
  
  ${({ $selected, theme }) => $selected && `
    &::before {
      content: '✓';
      position: absolute;
      top: ${theme.spacing.sm};
      right: ${theme.spacing.sm};
      width: 24px;
      height: 24px;
      background: ${theme.colors.primary};
      color: white;
      border-radius: ${theme.radius.full};
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: ${theme.typography.fontSize.sm};
      font-weight: ${theme.typography.fontWeight.bold};
    }
  `}
`;

// Type definitions
interface DocumentType {
  id: string;
  title: string;
  text?: string;
  user_id?: string;
  type?: string;
  created_at?: string;
}

interface AnalysisResultType {
  id: string;
  fitScore: number;
  summary: string;
  missingKeywords: string[];
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
  const [hasExistingJob, setHasExistingJob] = useState(false);

  // Step 1: CV Upload
  const [uploadedCV, setUploadedCV] = useState<DocumentType | null>(null);
  const [cvText, setCvText] = useState("");

  // Step 2: Job Posting
  const [jobTitle, setJobTitle] = useState("");
  const [jobDetails, setJobDetails] = useState("");
  const [savedJob, setSavedJob] = useState<DocumentType | null>(null);

  // Step 3: Analysis
  const [selectedCV, setSelectedCV] = useState<string | null>(null);
  const [selectedJob, setSelectedJob] = useState<string | null>(null);
  const [cvList, setCvList] = useState<DocumentType[]>([]);
  const [jobList, setJobList] = useState<DocumentType[]>([]);
  const [analysisProgress, setAnalysisProgress] = useState<string>("");

  // Step 4: Result Summary
  const [analysisResult, setAnalysisResult] = useState<AnalysisResultType | null>(null);

  // Total steps is always 4
  const totalSteps = 4;
  const progress = (currentStep / totalSteps) * 100;

  // Reset wizard state when modal first opens (unless continuing from saved state)
  useEffect(() => {
    if (isOpen) {
      const savedState = localStorage.getItem(WIZARD_STORAGE_KEY);
      if (!savedState) {
        // Fresh start - reset everything
        setCurrentStep(1);
        setIsLoading(false);
        setIsDragging(false);
      }
    }
  }, [isOpen]);

  // Check if user has existing CV and Job when modal opens
  useEffect(() => {
    async function checkExistingDocuments() {
      if (!isOpen) return;

      // Reset to step 1 when modal opens (unless we have saved state)
      const savedState = localStorage.getItem(WIZARD_STORAGE_KEY);
      if (!savedState) {
        setCurrentStep(1);
      }

      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) return;

        // Check for existing CV
        const { data: cvData } = await supabase
          .from("documents")
          .select("*")
          .eq("user_id", user.id)
          .eq("type", "cv")
          .order("created_at", { ascending: false })
          .limit(1)
          .maybeSingle();

        if (cvData) {
          setHasExistingCV(true);
          setUploadedCV(cvData);
          setCvText(cvData.text || "");
        } else {
          setHasExistingCV(false);
        }

        // Check for existing Job
        const { data: jobData } = await supabase
          .from("documents")
          .select("*")
          .eq("user_id", user.id)
          .eq("type", "job")
          .order("created_at", { ascending: false })
          .limit(1)
          .maybeSingle();

        if (jobData) {
          setHasExistingJob(true);
        } else {
          setHasExistingJob(false);
        }
      } catch (error) {
        console.error("Failed to check existing documents:", error);
      }
    }

    checkExistingDocuments();
  }, [isOpen]);

  // Load wizard state from localStorage
  useEffect(() => {
    if (isOpen) {
      try {
        const savedState = localStorage.getItem(WIZARD_STORAGE_KEY);
        if (savedState) {
          const state = JSON.parse(savedState);
          // Only restore step if there was a saved state
          if (state.currentStep) {
            setCurrentStep(state.currentStep);
          }
          setUploadedCV(state.uploadedCV || null);
          setCvText(state.cvText || "");
          setJobTitle(state.jobTitle || "");
          setJobDetails(state.jobDetails || "");
          setSavedJob(state.savedJob || null);
          setSelectedCV(state.selectedCV || null);
          setSelectedJob(state.selectedJob || null);
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
          jobDetails,
          savedJob,
          selectedCV,
          selectedJob,
        };
        localStorage.setItem(WIZARD_STORAGE_KEY, JSON.stringify(state));
      } catch (error) {
        console.error("Failed to save wizard state:", error);
      }
    }
  }, [currentStep, uploadedCV, cvText, jobTitle, jobDetails, savedJob, selectedCV, selectedJob, isOpen]);

  // Clear wizard state when modal is completed or closed
  const handleClose = () => {
    // Only clear if not in middle of wizard
    if (currentStep === 1 || currentStep === 4) {
      localStorage.removeItem(WIZARD_STORAGE_KEY);
    }
    onClose();
  };

  const handleComplete = () => {
    localStorage.removeItem(WIZARD_STORAGE_KEY);
    onComplete();
  };

  // Step 1: Handle CV Upload
  const handleFileSelect = useCallback(async (file: File) => {
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
  }, [hasExistingCV, uploadedCV, toast]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileSelect(file);
    }
  }, [handleFileSelect]);

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
    if (!jobTitle || !jobDetails) {
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
          text: jobDetails,
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

      // Auto-select uploaded/existing CV and job
      if (uploadedCV) {
        setSelectedCV(uploadedCV.id);
      } else if (cvsRes.data && cvsRes.data.length > 0) {
        // Auto-select first (most recent) CV if exists
        setSelectedCV(cvsRes.data[0].id);
      }

      if (savedJob) setSelectedJob(savedJob.id);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Step 3: Create analysis
  const handleCreateAnalysis = async () => {
    if (!selectedCV || !selectedJob) {
      toast.error("Please select a CV and a job posting");
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
          jobIds: [selectedJob],
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
              <StepTitle><DocumentIcon /> Upload Your CV</StepTitle>
              <StepDescription>
                {hasExistingCV 
                  ? "Use your existing CV or upload a new one"
                  : "Upload your resume in PDF or DOCX format"
                }
              </StepDescription>
            </StepHeader>
            <StepContent>
              {hasExistingCV && uploadedCV && !isLoading ? (
                <CVOptionsContainer>
                  <CVOptionWrapper>
                    <ExistingCVCard onClick={() => {
                      // User clicked to use existing CV, just continue
                      setCurrentStep(2);
                    }}>
                      <CVIcon><DocumentIcon /></CVIcon>
                      <CVTitle>{uploadedCV.title}</CVTitle>
                      <CVSubtitle>
                        {cvText.length} characters • Click to use this CV
                      </CVSubtitle>
                    </ExistingCVCard>
                  </CVOptionWrapper>

                  <DividerText>or</DividerText>

                  <CVOptionWrapper>
                    <UploadArea
                      $isDragging={isDragging}
                      onDrop={handleDrop}
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onClick={() => document.getElementById("wizard-cv-upload")?.click()}
                    >
                      <UploadIcon><UploadArrowIcon /></UploadIcon>
                      <UploadText>
                        <strong>Upload a new CV</strong>
                      </UploadText>
                      <UploadHint>
                        PDF or DOCX (max 5MB)
                      </UploadHint>
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
                  </CVOptionWrapper>
                </CVOptionsContainer>
              ) : uploadedCV ? (
                <>
                  <SuccessBox>
                    <SuccessIcon>✓</SuccessIcon>
                    <SuccessTitle>{uploadedCV.title}</SuccessTitle>
                    <SuccessSubtitle>
                      {cvText.length} characters extracted
                    </SuccessSubtitle>
                  </SuccessBox>

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
                  <UploadIcon><UploadArrowIcon /></UploadIcon>
                  <UploadText>
                    <strong>Click to upload</strong> or drag and drop
                  </UploadText>
                  <UploadHint>
                    PDF or DOCX (max 5MB)
                  </UploadHint>
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
              <StepTitle><BriefcaseIcon /> Add Job Posting</StepTitle>
              <StepDescription>
                {hasExistingJob
                  ? "Add a new job posting or use an existing one"
                  : "Paste the job description you want to apply to"
                }
              </StepDescription>
            </StepHeader>
            <StepContent>
              {hasExistingJob && !savedJob ? (
                <CVOptionsContainer>
                  <CVOptionWrapper>
                    <JobForm>
                      <div>
                        <FormLabel>Job Title</FormLabel>
                        <Input
                          type="text"
                          placeholder="e.g. Senior Frontend Developer"
                          value={jobTitle}
                          onChange={(e) => setJobTitle(e.target.value)}
                        />
                      </div>
                      <div>
                        <FormLabel>Job Description</FormLabel>
                        <Textarea
                          placeholder="Paste the full job description here..."
                          value={jobDetails}
                          onChange={(e) => setJobDetails(e.target.value)}
                          style={{ minHeight: "200px" }}
                        />
                        <CharCount>
                          {jobDetails.length} characters
                        </CharCount>
                      </div>
                    </JobForm>
                  </CVOptionWrapper>

                  <DividerText>or</DividerText>

                  <CVOptionWrapper>
                    <ExistingCVCard onClick={() => {
                      // Skip to next step - user will select existing job there
                      setCurrentStep(3);
                      fetchDataForAnalysis();
                    }}>
                      <CVIcon><BriefcaseIcon /></CVIcon>
                      <CVTitle>Use Existing Job</CVTitle>
                      <CVSubtitle>
                        Skip this step and select from your saved job postings
                      </CVSubtitle>
                    </ExistingCVCard>
                  </CVOptionWrapper>
                </CVOptionsContainer>
              ) : (
                <JobForm>
                  <div>
                    <FormLabel>Job Title</FormLabel>
                    <Input
                      type="text"
                      placeholder="e.g. Senior Frontend Developer"
                      value={jobTitle}
                      onChange={(e) => setJobTitle(e.target.value)}
                    />
                  </div>
                  <div>
                    <FormLabel>Job Description</FormLabel>
                    <Textarea
                      placeholder="Paste the full job description here (requirements, responsibilities, qualifications, etc.)..."
                      value={jobDetails}
                      onChange={(e) => setJobDetails(e.target.value)}
                      style={{ minHeight: "300px" }}
                    />
                    <CharCount>
                      {jobDetails.length} characters · {jobDetails.split('\n').length} lines
                    </CharCount>
                  </div>
                </JobForm>
              )}
            </StepContent>
          </>
        );

      case 3:
        return (
          <>
            <StepHeader>
              <StepTitle><TargetIcon /> Create Analysis</StepTitle>
              <StepDescription>
                Review your selections and generate your match report
              </StepDescription>
            </StepHeader>
            <StepContent>
              <SelectionList>
                <div>
                  <SectionHeading>Selected CV</SectionHeading>
                  {cvList.map((cv) => (
                    <SelectionCard
                      key={cv.id}
                      $selected={selectedCV === cv.id}
                      onClick={() => setSelectedCV(cv.id)}
                    >
                      <CardTitle>{cv.title}</CardTitle>
                      <CardSubtitle>
                        {cv.text?.length || 0} characters
                      </CardSubtitle>
                    </SelectionCard>
                  ))}
                </div>
                <div>
                  <SectionHeading>Select Job Posting</SectionHeading>
                  {jobList.map((job) => (
                    <SelectionCard
                      key={job.id}
                      $selected={selectedJob === job.id}
                      onClick={() => setSelectedJob(job.id)}
                    >
                      <CardTitle>{job.title}</CardTitle>
                      <CardSubtitle>
                        {job.text?.length || 0} characters
                      </CardSubtitle>
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
              <StepTitle><SparklesIcon /> Analysis Complete!</StepTitle>
              <StepDescription>
                Here&apos;s your CV match summary
              </StepDescription>
            </StepHeader>
            <StepContent>
              {analysisResult && (
                <ResultSummary>
                  <ResultScore>{analysisResult.fitScore}%</ResultScore>
                  <ResultScoreLabel>Match Score</ResultScoreLabel>

                  <ResultDetails>
                    <ResultItem>
                      <ResultHeading>Summary</ResultHeading>
                      <ResultText>
                        {analysisResult.summary}
                      </ResultText>
                    </ResultItem>

                    {analysisResult.missingKeywords && analysisResult.missingKeywords.length > 0 && (
                      <ResultItem>
                        <ResultHeading>
                          Missing Keywords ({analysisResult.missingKeywords.length})
                        </ResultHeading>
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
    <Modal isOpen={isOpen} onClose={handleClose} size="lg">
      <Modal.Body>
        <WizardContainer>
          <ProgressBar>
            <ProgressFill $progress={progress} />
          </ProgressBar>

          {isLoading ? (
            <LoadingContainer>
              <Spinner size="xl" />
              <LoadingTitle>
                {analysisProgress || "Processing..."}
              </LoadingTitle>
              {analysisProgress && (
                <LoadingSubtitle>
                  This may take a few moments
                </LoadingSubtitle>
              )}
            </LoadingContainer>
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
                      handleClose();
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
                  disabled={!jobTitle || !jobDetails}
                >
                  Save & Continue →
                </Button>
              )}

              {currentStep === 3 && (
                <Button
                  onClick={handleCreateAnalysis}
                  disabled={!selectedCV || !selectedJob}
                >
                  Generate Analysis <TargetIcon />
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
      </Modal.Body>
    </Modal>
  );
}