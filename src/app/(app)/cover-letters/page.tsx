"use client";

import { useState, useEffect, useCallback } from "react";
import styled from "styled-components";
import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/Spinner";
import { useToast } from "@/contexts/ToastContext";
import { Modal } from "@/components/ui/Modal";
import { EmptyState } from "@/components/ui/EmptyState";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { CoverLetterGenerator } from "@/components/features/CoverLetterGenerator";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/lib/constants";

interface UserCredits {
  credits: number;
  hasSubscription: boolean;
  canAnalyze: boolean;
}

// Icons
const ViewIcon = () => (
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
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const CopyIcon = () => (
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
    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
  </svg>
);

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

const DocumentIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" />
    <line x1="10" y1="9" x2="8" y2="9" />
  </svg>
);

const EnvelopeIcon = ({ size = "64" }: { size?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    style={{
      width: `${size}px`,
      height: `${size}px`,
      display: "inline-block",
    }}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
    />
  </svg>
);

const CheckCircleIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={2}
    stroke="currentColor"
    style={{
      width: "20px",
      height: "20px",
      display: "inline-block",
      verticalAlign: "middle",
    }}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);

const Container = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: ${({ theme }) => theme.spacing.xl};

  @media (max-width: 768px) {
    padding: ${({ theme }) => theme.spacing.md};
  }
`;

const TwoColumnLayout = styled.div`
  display: grid;
  grid-template-columns: 20% 1px 1fr;
  gap: ${({ theme }) => theme.spacing.xl};
  align-items: start;

  @media (max-width: 1200px) {
    grid-template-columns: 1fr;
    gap: ${({ theme }) => theme.spacing.lg};
  }
`;

const ColumnDivider = styled.div`
  width: 1px;
  height: 100%;
  min-height: 500px;
  background: linear-gradient(
    to bottom,
    transparent 0%,
    ${({ theme }) => theme.colors.border} 5%,
    ${({ theme }) => theme.colors.border} 95%,
    transparent 100%
  );

  @media (max-width: 1200px) {
    display: none;
  }
`;

const Column = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
`;

const ColumnHeader = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const Header = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing["2xl"]};
`;

const Title = styled.h1`
  font-size: ${({ theme }) => theme.typography.fontSize["3xl"]};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.textPrimary};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const Description = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  color: ${({ theme }) => theme.colors.textSecondary};
  max-width: 600px;
`;

const HeaderRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.md};
`;

const CreditsIndicator = styled.div<{ $low?: boolean; $subscription?: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => `${theme.spacing.sm} ${theme.spacing.lg}`};
  background: ${({ $subscription, $low }) =>
    $subscription
      ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.2) 0%, rgba(5, 150, 105, 0.2) 100%)'
      : $low
        ? 'linear-gradient(135deg, rgba(245, 158, 11, 0.2) 0%, rgba(217, 119, 6, 0.2) 100%)'
        : 'linear-gradient(135deg, rgba(155, 135, 196, 0.2) 0%, rgba(180, 167, 214, 0.2) 100%)'
  };
  border: 2px solid ${({ $subscription, $low }) =>
    $subscription
      ? 'rgba(16, 185, 129, 0.5)'
      : $low
        ? 'rgba(245, 158, 11, 0.5)'
        : 'rgba(155, 135, 196, 0.5)'
  };
  border-radius: ${({ theme }) => theme.radius.lg};
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  color: ${({ $subscription, $low }) =>
    $subscription
      ? 'var(--success)'
      : $low
        ? '#f59e0b'
        : '#e5e7eb'
  };
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 2px 8px ${({ $subscription, $low }) =>
    $subscription
      ? 'rgba(16, 185, 129, 0.2)'
      : $low
        ? 'rgba(245, 158, 11, 0.2)'
        : 'rgba(155, 135, 196, 0.2)'
  };

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px ${({ $subscription, $low }) =>
      $subscription
        ? 'rgba(16, 185, 129, 0.3)'
        : $low
          ? 'rgba(245, 158, 11, 0.3)'
          : 'rgba(155, 135, 196, 0.3)'
    };
  }

  .credit-value {
    font-size: ${({ theme }) => theme.typography.fontSize.xl};
    font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
    color: ${({ $subscription, $low }) =>
      $subscription
        ? 'var(--success)'
        : $low
          ? '#f59e0b'
          : '#9b87c4'
    };
  }
`;

const SectionTitle = styled.h2`
  font-size: ${({ theme }) => theme.typography.fontSize.xl};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.textPrimary};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

const SectionDescription = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const Grid = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
`;

// Report Card Styles - Compact & Professional
const ReportCard = styled.div<{ $isPremium: boolean }>`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.lg};
  padding: ${({ theme }) => theme.spacing.md};
  transition: all ${({ theme }) => theme.transitions.fast};
  cursor: pointer;
  position: relative;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
  height: 100%;
  overflow: hidden;

  ${({ $isPremium, theme }) =>
    $isPremium &&
    `
    border-color: ${theme.colors.primary};
    box-shadow: 0 0 0 1px ${theme.colors.primary}15;

    &::after {
      content: 'PRO';
      position: absolute;
      top: 8px;
      right: 8px;
      background: linear-gradient(135deg, ${theme.colors.primary} 0%, var(--primary-600) 100%);
      color: white;
      font-size: 9px;
      font-weight: 700;
      padding: 2px 6px;
      border-radius: 3px;
      letter-spacing: 0.5px;
    }
  `}

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.15);
    transform: translateY(-2px);
  }

  &:active {
    transform: translateY(0);
  }
`;

const ReportCardHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const ReportCardInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

const ReportCardTitle = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.textPrimary};
  line-height: 1.3;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin-bottom: 2px;
`;

const ReportCardSubtitle = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  color: ${({ theme }) => theme.colors.textSecondary};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const ReportScore = styled.div<{ $score: number }>`
  font-size: ${({ theme }) => theme.typography.fontSize["2xl"]};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ $score }) => {
    if ($score >= 80) return 'var(--success)';
    if ($score >= 60) return '#f59e0b';
    return '#ef4444';
  }};
  line-height: 1;
  flex-shrink: 0;

  &::after {
    content: '%';
    font-size: ${({ theme }) => theme.typography.fontSize.sm};
    margin-left: 1px;
  }
`;

const ReportMeta = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  padding-top: ${({ theme }) => theme.spacing.xs};
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const GenerateButton = styled(Button)`
  width: 100%;
  margin-top: ${({ theme }) => theme.spacing.md};
  padding-top: ${({ theme }) => theme.spacing.md};
  border-top: 1px solid ${({ theme }) => theme.colors.border};
`;

// Cover Letter Card Styles - Refined & Symmetric
const CoverLetterCard = styled.div<{ $tone: string }>`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.lg};
  padding: ${({ theme }) => theme.spacing.md};
  transition: all ${({ theme }) => theme.transitions.fast};
  cursor: pointer;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;

  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 12px;
    bottom: 12px;
    width: 3px;
    border-radius: 0 2px 2px 0;
    background: ${({ $tone }) => {
      switch ($tone) {
        case 'professional':
          return '#3b82f6';
        case 'friendly':
          return 'var(--success)';
        case 'formal':
          return '#8b5cf6';
        default:
          return '#6b7280';
      }
    }};
  }

  &:hover {
    border-color: ${({ $tone, theme }) => {
      switch ($tone) {
        case 'professional':
          return '#3b82f6';
        case 'friendly':
          return 'var(--success)';
        case 'formal':
          return '#8b5cf6';
        default:
          return theme.colors.primary;
      }
    }};
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.15);
    transform: translateY(-2px);
  }

  &:active {
    transform: translateY(0);
  }
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: ${({ theme }) => theme.spacing.sm};
  gap: ${({ theme }) => theme.spacing.sm};
  padding-left: 8px;
`;

const CardTitle = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.textPrimary};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
  line-height: 1.3;
`;

const CardSubtitle = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const DateBadge = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  color: ${({ theme }) => theme.colors.textSecondary};
  white-space: nowrap;
`;

const MetaTags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.xs};
  padding-left: 8px;
`;

const Tag = styled.div<{ $tone?: string }>`
  padding: 3px 8px;
  border-radius: ${({ theme }) => theme.radius.sm};
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  background: ${({ $tone }) => {
    switch ($tone) {
      case 'professional':
        return 'rgba(59, 130, 246, 0.1)';
      case 'friendly':
        return 'rgba(16, 185, 129, 0.1)';
      case 'formal':
        return 'rgba(139, 92, 246, 0.1)';
      default:
        return 'rgba(102, 126, 234, 0.1)';
    }
  }};
  color: ${({ $tone }) => {
    switch ($tone) {
      case 'professional':
        return '#3b82f6';
      case 'friendly':
        return 'var(--success)';
      case 'formal':
        return '#8b5cf6';
      default:
        return 'var(--accent)';
    }
  }};
`;

const QuickActions = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.xs};
  margin-top: ${({ theme }) => theme.spacing.sm};
  padding-left: 8px;
`;

const QuickActionButton = styled.button<{ $variant?: 'copy' | 'delete' }>`
  padding: 4px 10px;
  border: none;
  border-radius: ${({ theme }) => theme.radius.sm};
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};
  display: flex;
  align-items: center;
  gap: 4px;

  ${({ $variant = 'copy', theme }) => {
    if ($variant === 'delete') {
      return `
        background: transparent;
        color: #ef4444;
        &:hover {
          background: rgba(239, 68, 68, 0.1);
        }
        &:active {
          background: rgba(239, 68, 68, 0.15);
        }
      `;
    } else {
      return `
        background: transparent;
        color: ${theme.colors.textSecondary};
        &:hover {
          background: ${theme.colors.surfaceHover};
          color: ${theme.colors.textPrimary};
        }
        &:active {
          background: ${theme.colors.border};
        }
      `;
    }
  }}

  svg {
    width: 12px;
    height: 12px;
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing["3xl"]};
`;

const ModalContent = styled.div`
  padding: ${({ theme }) => theme.spacing.lg};
`;

const ModalText = styled.div`
  white-space: pre-wrap;
  line-height: 1.8;
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  color: ${({ theme }) => theme.colors.textPrimary};
  max-height: 500px;
  overflow-y: auto;
`;

const ModalMetaInfo = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  padding-bottom: ${({ theme }) => theme.spacing.md};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  flex-wrap: wrap;
`;

const MetaItem = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
`;

interface CoverLetter {
  id: string;
  content: string;
  tone: string;
  length: string;
  language: string;
  template?: string;
  created_at: string;
  report_id?: string;
  structured_content?: {
    paragraphs?: Array<{
      id: string;
      type: string;
      content: string;
      rationale: string;
      sentences: Array<{
        id: string;
        text: string;
        isHighlight: boolean;
        alternatives?: string[];
      }>;
    }>;
    keyHighlights?: string[];
    wordCount?: number;
  };
  report?: {
    id: string;
    job?: {
      title: string;
    };
  };
  job?: {
    id: string;
    title: string;
    type: string;
  };
}

interface Report {
  id: string;
  fit_score: number;
  is_premium: boolean;
  created_at: string;
  cv?: {
    title: string;
  };
  job?: {
    title: string;
  };
}

export default function CoverLettersPage() {
  const toast = useToast();
  const router = useRouter();
  const [coverLetters, setCoverLetters] = useState<CoverLetter[]>([]);
  const [reports, setReports] = useState<Report[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedLetter, setSelectedLetter] = useState<CoverLetter | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [letterToDelete, setLetterToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Cover letter generator
  const [selectedReportId, setSelectedReportId] = useState<string | null>(null);
  const [isGeneratorOpen, setIsGeneratorOpen] = useState(false);
  const [isPremiumModalOpen, setIsPremiumModalOpen] = useState(false);
  const [selectedFreeReportId, setSelectedFreeReportId] = useState<string | null>(null);

  // Cover letter editor
  const [selectedLetterForEdit, setSelectedLetterForEdit] = useState<CoverLetter | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);

  // User credits
  const [userCredits, setUserCredits] = useState<UserCredits>({
    credits: 0,
    hasSubscription: false,
    canAnalyze: false,
  });

  const fetchCredits = useCallback(async () => {
    try {
      const response = await fetch("/api/user/credits");
      if (response.ok) {
        const data = await response.json();
        setUserCredits(data);
      }
    } catch (error) {
      console.error("Error fetching credits:", error);
    }
  }, []);

  const fetchCoverLetters = useCallback(async () => {
    try {
      const response = await fetch("/api/cover-letters");
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch cover letters");
      }

      setCoverLetters(data.coverLetters || []);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      toast.error(errorMessage);
    }
  }, [toast]);

  const fetchReports = useCallback(async () => {
    try {
      const response = await fetch("/api/reports");
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch reports");
      }

      setReports(data.reports || []);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      toast.error(errorMessage);
    }
  }, [toast]);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      await Promise.all([fetchCoverLetters(), fetchReports(), fetchCredits()]);
      setIsLoading(false);
    };

    loadData();
  }, [fetchCoverLetters, fetchReports, fetchCredits]);

  const handleReportClick = (reportId: string) => {
    const report = reports.find(r => r.id === reportId);
    if (!report) return;

    if (report.is_premium) {
      setSelectedReportId(reportId);
      setIsGeneratorOpen(true);
    } else {
      setSelectedFreeReportId(reportId);
      setIsPremiumModalOpen(true);
    }
  };

  const handleGeneratorClose = () => {
    setIsGeneratorOpen(false);
    setSelectedReportId(null);
  };

  const handleGeneratorSuccess = async (letterId?: string) => {
    await fetchCoverLetters();

    // Auto-open the generated cover letter
    if (letterId) {
      const newLetter = coverLetters.find(l => l.id === letterId);
      if (newLetter) {
        setSelectedLetterForEdit(newLetter);
        setIsEditorOpen(true);
      } else {
        // Refetch and find
        const response = await fetch("/api/cover-letters");
        if (response.ok) {
          const data = await response.json();
          const generated = data.coverLetters?.find((l: CoverLetter) => l.id === letterId);
          if (generated) {
            setSelectedLetterForEdit(generated);
            setIsEditorOpen(true);
          }
        }
      }
    }

    handleGeneratorClose();
    toast.success("Cover letter generated successfully!");
  };

  const handleCardClick = (letter: CoverLetter) => {
    setSelectedLetterForEdit(letter);
    setIsEditorOpen(true);
  };

  const handleCopy = () => {
    if (selectedLetter) {
      navigator.clipboard.writeText(selectedLetter.content);
      toast.success("Cover letter copied to clipboard!");
    }
  };

  const handleDownload = () => {
    if (selectedLetter) {
      const blob = new Blob([selectedLetter.content], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `cover_letter_${new Date(selectedLetter.created_at).toLocaleDateString()}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success("Cover letter downloaded!");
    }
  };

  const handleDeleteClick = (id: string) => {
    setLetterToDelete(id);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!letterToDelete) return;

    setIsDeleting(true);
    try {
      const response = await fetch(`/api/cover-letters?id=${letterToDelete}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to delete cover letter");
      }

      toast.success("Cover letter deleted successfully!");
      fetchCoverLetters();
      setDeleteModalOpen(false);
      setLetterToDelete(null);
      setIsModalOpen(false);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      toast.error(errorMessage);
    } finally {
      setIsDeleting(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getWordCount = (text: string) => {
    return text.trim().split(/\s+/).length;
  };

  const getToneLabel = (tone: string) => {
    const labels: Record<string, string> = {
      professional: "Professional",
      friendly: "Friendly",
      formal: "Formal",
    };
    return labels[tone] || tone;
  };

  const getLanguageLabel = (lang: string) => {
    const labels: Record<string, string> = {
      en: "English",
      tr: "Turkish",
    };
    return labels[lang] || lang;
  };

  if (isLoading) {
    return (
      <Container>
        <LoadingContainer>
          <Spinner size="xl" />
        </LoadingContainer>
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <HeaderRow>
          <div>
            <Title>Cover Letters</Title>
            <Description>
              Generate AI-powered cover letters from your reports and manage your applications.
            </Description>
          </div>
          <CreditsIndicator
            $subscription={userCredits.hasSubscription}
            $low={!userCredits.hasSubscription && userCredits.credits <= 2}
            onClick={() => router.push(ROUTES.APP.BILLING)}
          >
            {userCredits.hasSubscription ? (
              <>✓ Pro Active</>
            ) : (
              <>
                <span className="credit-value">{userCredits.credits}</span> credits
              </>
            )}
          </CreditsIndicator>
        </HeaderRow>
      </Header>

      <TwoColumnLayout>
        {/* Left Column - Reports (30%) */}
        <Column>
          <ColumnHeader>
            <SectionTitle>Reports</SectionTitle>
            <SectionDescription>
              Select a report to generate a cover letter
            </SectionDescription>
          </ColumnHeader>

          {reports.length === 0 ? (
            <Card variant="bordered">
              <EmptyState
                icon={<EmptyState.DocumentIcon />}
                title="No reports yet"
                description="Create your first analysis to start generating cover letters."
                action={{
                  label: "Create Analysis",
                  onClick: () => window.location.href = "/analyze",
                }}
              />
            </Card>
          ) : (
            <Grid>
              {reports.map((report) => (
                <ReportCard
                  key={report.id}
                  $isPremium={report.is_premium}
                  onClick={() => handleReportClick(report.id)}
                >
                  <ReportCardHeader>
                    <ReportCardInfo>
                      <ReportCardTitle>
                        {report.job?.title || "Job Analysis"}
                      </ReportCardTitle>
                      {report.cv && (
                        <ReportCardSubtitle>
                          {report.cv.title}
                        </ReportCardSubtitle>
                      )}
                    </ReportCardInfo>
                    <ReportScore $score={report.fit_score}>
                      {report.fit_score}
                    </ReportScore>
                  </ReportCardHeader>

                  <ReportMeta>
                    {formatDate(report.created_at)}
                  </ReportMeta>
                </ReportCard>
              ))}
            </Grid>
          )}
        </Column>

        {/* Divider */}
        <ColumnDivider />

        {/* Right Column - Generated Cover Letters (70%) */}
        <Column>
          <ColumnHeader>
            <SectionTitle>Your Cover Letters</SectionTitle>
            <SectionDescription>
              Click to view and edit
            </SectionDescription>
          </ColumnHeader>

          {coverLetters.length === 0 ? (
            <Card variant="bordered">
              <EmptyState
                icon={<EmptyState.DocumentIcon />}
                title="No cover letters yet"
                description="Click on a report to generate your first cover letter."
              />
            </Card>
          ) : (
            <Grid>
              {coverLetters.map((letter) => (
                <CoverLetterCard
                  key={letter.id}
                  $tone={letter.tone}
                  onClick={() => handleCardClick(letter)}
                >
                  <CardHeader>
                    <div style={{ flex: 1 }}>
                      <CardTitle>
                        {letter.job?.title || "Cover Letter"}
                      </CardTitle>
                      <CardSubtitle>
                        {getToneLabel(letter.tone)} · {getWordCount(letter.content)} words
                      </CardSubtitle>
                    </div>
                    <DateBadge>{formatDate(letter.created_at)}</DateBadge>
                  </CardHeader>

                  <MetaTags>
                    <Tag $tone={letter.tone}>{getToneLabel(letter.tone)}</Tag>
                  </MetaTags>

                  <QuickActions onClick={(e) => e.stopPropagation()}>
                    <QuickActionButton
                      onClick={(e) => {
                        e.stopPropagation();
                        navigator.clipboard.writeText(letter.content);
                        toast.success("Copied to clipboard!");
                      }}
                    >
                      <CopyIcon /> Copy
                    </QuickActionButton>
                    <QuickActionButton
                      $variant="delete"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteClick(letter.id);
                      }}
                    >
                      <DeleteIcon /> Delete
                    </QuickActionButton>
                  </QuickActions>
                </CoverLetterCard>
              ))}
            </Grid>
          )}
        </Column>
      </TwoColumnLayout>

      {/* View Cover Letter Modal */}
      {selectedLetter && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Cover Letter"
          description="Full cover letter content"
          size="lg"
        >
          <Modal.Body>
            <ModalContent>
              <ModalMetaInfo>
                <MetaItem>
                  <strong>Tone:</strong> {getToneLabel(selectedLetter.tone)}
                </MetaItem>
                <MetaItem>
                  <strong>Words:</strong> {getWordCount(selectedLetter.content)}
                </MetaItem>
                <MetaItem>
                  <strong>Language:</strong> {getLanguageLabel(selectedLetter.language)}
                </MetaItem>
                <MetaItem>
                  <strong>Created:</strong> {formatDate(selectedLetter.created_at)}
                </MetaItem>
              </ModalMetaInfo>

              <ModalText>{selectedLetter.content}</ModalText>
            </ModalContent>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="ghost" onClick={() => setIsModalOpen(false)}>
              Close
            </Button>
            <Button variant="ghost" onClick={handleCopy}>
              <CopyIcon /> Copy
            </Button>
            <Button variant="primary" onClick={handleDownload}>
              Download
            </Button>
          </Modal.Footer>
        </Modal>
      )}

      {/* Cover Letter Generator Modal (for creating new letters) */}
      {selectedReportId && (
        <CoverLetterGenerator
          isOpen={isGeneratorOpen}
          onClose={handleGeneratorClose}
          reportId={selectedReportId}
          onSuccess={handleGeneratorSuccess}
        />
      )}

      {/* Cover Letter Editor Modal (for editing existing letters) */}
      {selectedLetterForEdit && (
        <CoverLetterGenerator
          isOpen={isEditorOpen}
          onClose={() => {
            setIsEditorOpen(false);
            setSelectedLetterForEdit(null);
          }}
          reportId={selectedLetterForEdit.report_id}
          existingLetter={{
            id: selectedLetterForEdit.id,
            content: selectedLetterForEdit.content,
            tone: selectedLetterForEdit.tone,
            length: selectedLetterForEdit.length,
            language: selectedLetterForEdit.language,
            paragraphs: selectedLetterForEdit.structured_content?.paragraphs as any,
            keyHighlights: selectedLetterForEdit.structured_content?.keyHighlights,
          }}
          onSuccess={() => {
            fetchCoverLetters();
            toast.success("Cover letter viewed!");
          }}
        />
      )}

      {/* Premium Upgrade Modal */}
      <Modal
        isOpen={isPremiumModalOpen}
        onClose={() => setIsPremiumModalOpen(false)}
        title="✨ Premium Feature"
        description="Cover letters are only available for premium reports"
        size="md"
      >
        <Modal.Body>
          <div style={{
            padding: '24px',
            textAlign: 'center',
          }}>
            <div style={{
              marginBottom: '20px',
              display: 'flex',
              justifyContent: 'center',
            }}>
              <div style={{
                background: 'var(--gradient-primary)',
                borderRadius: '16px',
                padding: '16px',
                display: 'inline-flex',
              }}>
                <EnvelopeIcon size="48" />
              </div>
            </div>
            <h3 style={{
              fontSize: '24px',
              fontWeight: 600,
              marginBottom: '16px',
              background: 'var(--gradient-primary)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>
              AI-Powered Cover Letters
            </h3>
            <p style={{
              fontSize: '16px',
              color: '#9ca3af',
              marginBottom: '24px',
              lineHeight: '1.6',
            }}>
              Create personalized, professional cover letters tailored to each job posting.
              To unlock this feature, you need to upgrade the report to premium.
            </p>

            <div style={{
              background: 'rgba(102, 126, 234, 0.1)',
              border: '2px solid rgba(102, 126, 234, 0.3)',
              borderRadius: '12px',
              padding: '20px',
              marginBottom: '24px',
              textAlign: 'left',
            }}>
              <div style={{ fontSize: '14px', fontWeight: 600, marginBottom: '12px', color: 'var(--accent)' }}>
                ✨ What you'll get with premium:
              </div>
              <ul style={{
                listStyle: 'none',
                padding: 0,
                margin: 0,
                fontSize: '14px',
                color: '#d1d5db',
              }}>
                <li style={{ marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ color: 'var(--success)', flexShrink: 0 }}>
                    <CheckCircleIcon />
                  </div>
                  <span>AI-generated cover letters with 6 templates</span>
                </li>
                <li style={{ marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ color: 'var(--success)', flexShrink: 0 }}>
                    <CheckCircleIcon />
                  </div>
                  <span>Optimized CV with improved ATS score</span>
                </li>
                <li style={{ marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ color: 'var(--success)', flexShrink: 0 }}>
                    <CheckCircleIcon />
                  </div>
                  <span>Detailed improvement breakdown</span>
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ color: 'var(--success)', flexShrink: 0 }}>
                    <CheckCircleIcon />
                  </div>
                  <span>Alternative role recommendations</span>
                </li>
              </ul>
            </div>

            {userCredits.canAnalyze ? (
              <>
                <div style={{
                  background: 'rgba(16, 185, 129, 0.1)',
                  border: '1px solid rgba(16, 185, 129, 0.3)',
                  borderRadius: '8px',
                  padding: '12px',
                  marginBottom: '16px',
                  fontSize: '14px',
                  color: 'var(--success)',
                }}>
                  You have <strong>{userCredits.credits}</strong> credits available
                </div>
                <Button
                  size="lg"
                  onClick={() => {
                    setIsPremiumModalOpen(false);
                    if (selectedFreeReportId) {
                      router.push(`/reports/${selectedFreeReportId}?upgrade=true`);
                    }
                  }}
                  style={{
                    width: '100%',
                    background: 'var(--gradient-primary)',
                    fontSize: '16px',
                    padding: '14px 24px',
                    marginBottom: '12px',
                  }}
                >
                  Upgrade to Pro - Use 1 Credit
                </Button>
                <p style={{
                  fontSize: '12px',
                  color: '#6b7280',
                  marginTop: '12px',
                }}>
                  Uses 1 credit • Unlock all premium features
                </p>
              </>
            ) : (
              <>
                <Button
                  size="lg"
                  onClick={() => router.push(ROUTES.APP.BILLING)}
                  style={{
                    width: '100%',
                    background: 'var(--gradient-primary)',
                    fontSize: '16px',
                    padding: '14px 24px',
                    marginBottom: '12px',
                  }}
                >
                  Buy Credits to Unlock
                </Button>
                <p style={{
                  fontSize: '12px',
                  color: '#6b7280',
                  marginTop: '12px',
                }}>
                  Starting at $2 for 1 credit • Best value: $7 for 10 credits
                </p>
              </>
            )}
          </div>
        </Modal.Body>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={() => !isDeleting && setDeleteModalOpen(false)}
        title="Delete Cover Letter"
        size="sm"
      >
        <Modal.Body>
          <div style={{ padding: '16px 0' }}>
            <p style={{ marginBottom: '12px', fontSize: '15px', lineHeight: '1.6' }}>
              Are you sure you want to delete this cover letter? This action cannot be undone.
            </p>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="ghost"
            onClick={() => setDeleteModalOpen(false)}
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleDeleteConfirm}
            isLoading={isDeleting}
            style={{
              background: 'linear-gradient(135deg, #dc2626 0%, #991b1b 100%)',
              border: 'none',
            }}
          >
            {isDeleting ? 'Deleting...' : 'Delete Cover Letter'}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}
