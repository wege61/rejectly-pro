"use client";

import { useState, useEffect, useCallback } from "react";
import styled from "styled-components";
import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/Spinner";
import { useToast } from "@/contexts/ToastContext";
import { Modal } from "@/components/ui/Modal";

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

const Container = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: ${({ theme }) => theme.spacing.xl};

  @media (max-width: 768px) {
    padding: ${({ theme }) => theme.spacing.md};
  }
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  gap: ${({ theme }) => theme.spacing.lg};

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const HeaderContent = styled.div`
  flex: 1;
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
  max-width: 800px;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
  gap: ${({ theme }) => theme.spacing.lg};

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const CoverLetterCard = styled.div<{ $tone: string }>`
  background: ${({ theme }) => theme.colors.surface};
  border: 2px solid ${({ $tone }) => {
    switch ($tone) {
      case 'professional':
        return '#3b82f6';
      case 'friendly':
        return '#10b981';
      case 'formal':
        return '#8b5cf6';
      default:
        return '#6b7280';
    }
  }};
  border-radius: ${({ theme }) => theme.radius.lg};
  padding: ${({ theme }) => theme.spacing.lg};
  transition: all ${({ theme }) => theme.transitions.fast};
  cursor: pointer;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: ${({ $tone }) => {
      switch ($tone) {
        case 'professional':
          return 'linear-gradient(90deg, #3b82f6 0%, #2563eb 100%)';
        case 'friendly':
          return 'linear-gradient(90deg, #10b981 0%, #059669 100%)';
        case 'formal':
          return 'linear-gradient(90deg, #8b5cf6 0%, #7c3aed 100%)';
        default:
          return 'linear-gradient(90deg, #6b7280 0%, #4b5563 100%)';
      }
    }};
  }

  &:hover {
    border-color: ${({ $tone }) => {
      switch ($tone) {
        case 'professional':
          return '#2563eb';
        case 'friendly':
          return '#059669';
        case 'formal':
          return '#7c3aed';
        default:
          return '#4b5563';
      }
    }};
    box-shadow: 0 8px 24px ${({ $tone }) => {
      switch ($tone) {
        case 'professional':
          return 'rgba(59, 130, 246, 0.2)';
        case 'friendly':
          return 'rgba(16, 185, 129, 0.2)';
        case 'formal':
          return 'rgba(139, 92, 246, 0.2)';
        default:
          return 'rgba(0, 0, 0, 0.1)';
      }
    }};
    transform: translateY(-4px);
  }
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: ${({ theme }) => theme.spacing.md};
  gap: ${({ theme }) => theme.spacing.sm};
`;

const CardTitle = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.textPrimary};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

const CardSubtitle = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const DateBadge = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  color: ${({ theme }) => theme.colors.textSecondary};
  background: ${({ theme }) => theme.colors.background};
  padding: 4px 10px;
  border-radius: ${({ theme }) => theme.radius.full};
  white-space: nowrap;
`;

const PreviewText = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
  line-height: 1.6;
  margin-bottom: ${({ theme }) => theme.spacing.md};
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const MetaTags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.xs};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const Tag = styled.div<{ $tone?: string }>`
  padding: 4px 10px;
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
        return '#10b981';
      case 'formal':
        return '#8b5cf6';
      default:
        return '#667eea';
    }
  }};
`;

const CardActions = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
  margin-top: ${({ theme }) => theme.spacing.md};
  padding-top: ${({ theme }) => theme.spacing.md};
  border-top: 1px solid ${({ theme }) => theme.colors.border};
`;

const ActionButton = styled.button<{ $variant?: 'primary' | 'danger' | 'ghost' }>`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.xs};
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  border: none;
  border-radius: ${({ theme }) => theme.radius.md};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};

  ${({ $variant = 'primary', theme }) => {
    if ($variant === 'danger') {
      return `
        background: rgba(239, 68, 68, 0.1);
        color: #dc2626;

        &:hover {
          background: rgba(239, 68, 68, 0.2);
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(239, 68, 68, 0.2);
        }
      `;
    } else if ($variant === 'ghost') {
      return `
        background: transparent;
        color: ${theme.colors.textSecondary};

        &:hover {
          background: ${theme.colors.surfaceHover};
          color: ${theme.colors.textPrimary};
          transform: translateY(-2px);
        }
      `;
    } else {
      return `
        background: ${theme.colors.surfaceHover};
        color: ${theme.colors.textPrimary};

        &:hover {
          background: ${theme.colors.primary};
          color: white;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.2);
        }
      `;
    }
  }}

  &:active {
    transform: translateY(0);
  }
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing["3xl"]};
  text-align: center;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const EmptyIcon = styled.div`
  font-size: 64px;
  margin-bottom: ${({ theme }) => theme.spacing.lg};
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

const SelectionModalContent = styled.div`
  padding: ${({ theme }) => theme.spacing.lg};
  max-height: 600px;
  overflow-y: auto;
`;

const Section = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const SectionTitle = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.textPrimary};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const SectionDescription = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const SelectList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
  max-height: 200px;
  overflow-y: auto;
`;

const SelectItem = styled.div<{ $selected: boolean }>`
  padding: ${({ theme }) => theme.spacing.md};
  background: ${({ $selected, theme }) =>
    $selected ? theme.colors.primaryLight : theme.colors.surface};
  border: 2px solid
    ${({ $selected, theme }) =>
      $selected ? theme.colors.primary : theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.md};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
    background: ${({ $selected, theme }) =>
      $selected ? theme.colors.primaryLight : theme.colors.surfaceHover};
  }
`;

const ItemTitle = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  color: ${({ theme }) => theme.colors.textPrimary};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

const ItemMeta = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const OptionGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: ${({ theme }) => theme.spacing.sm};
`;

const TemplateGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: ${({ theme }) => theme.spacing.md};
`;

const OptionButton = styled.button<{ $selected: boolean }>`
  padding: ${({ theme }) => theme.spacing.md};
  background: ${({ $selected, theme }) =>
    $selected
      ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
      : theme.colors.surface};
  border: 2px solid
    ${({ $selected, theme }) =>
      $selected ? "#667eea" : theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.md};
  color: ${({ $selected, theme }) =>
    $selected ? "white" : theme.colors.textPrimary};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px
      ${({ $selected }) =>
        $selected ? "rgba(102, 126, 234, 0.3)" : "rgba(0, 0, 0, 0.1)"};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const TemplateButton = styled(OptionButton)`
  padding: ${({ theme }) => theme.spacing.lg};
  text-align: left;
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const Input = styled.input`
  padding: ${({ theme }) => theme.spacing.md};
  background: ${({ theme }) => theme.colors.surface};
  border: 2px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.md};
  color: ${({ theme }) => theme.colors.textPrimary};
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  width: 100%;

  &:focus {
    outline: none;
    border-color: #667eea;
  }

  &::placeholder {
    color: ${({ theme }) => theme.colors.textSecondary};
    opacity: 0.6;
  }
`;

interface CoverLetter {
  id: string;
  content: string;
  tone: string;
  length: string;
  language: string;
  template?: string;
  created_at: string;
  job?: {
    id: string;
    title: string;
    type: string;
  };
}

interface Document {
  id: string;
  title: string;
  type: string;
  created_at: string;
}

const TEMPLATES = [
  { id: 'standard', name: 'Standard', emoji: '📄', description: 'Classic professional format' },
  { id: 'story_driven', name: 'Story Driven', emoji: '📖', description: 'Narrative approach' },
  { id: 'technical_focus', name: 'Technical Focus', emoji: '💻', description: 'Emphasize technical skills' },
  { id: 'results_oriented', name: 'Results Oriented', emoji: '📊', description: 'Focus on metrics' },
  { id: 'career_change', name: 'Career Change', emoji: '🔄', description: 'Transitioning fields' },
  { id: 'short_intro', name: 'Short Intro', emoji: '⚡', description: 'Concise and impactful' },
];

export default function CoverLettersPage() {
  const toast = useToast();
  const [coverLetters, setCoverLetters] = useState<CoverLetter[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedLetter, setSelectedLetter] = useState<CoverLetter | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSelectionModalOpen, setIsSelectionModalOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [letterToDelete, setLetterToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [cvs, setCvs] = useState<Document[]>([]);
  const [jobs, setJobs] = useState<Document[]>([]);
  const [selectedCvId, setSelectedCvId] = useState<string>("");
  const [selectedJobId, setSelectedJobId] = useState<string>("");
  const [template, setTemplate] = useState<string>('standard');
  const [tone, setTone] = useState<'professional' | 'friendly' | 'formal'>('professional');
  const [length, setLength] = useState<'short' | 'medium' | 'long'>('medium');
  const [language, setLanguage] = useState<'en' | 'tr'>('en');
  const [emphasizeSkills, setEmphasizeSkills] = useState<string>('');
  const [specificProjects, setSpecificProjects] = useState<string>('');

  const fetchCoverLetters = useCallback(async () => {
    try {
      setIsLoading(true);
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
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchCoverLetters();
  }, [fetchCoverLetters]);

  const fetchDocuments = async () => {
    try {
      const response = await fetch("/api/documents");
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch documents");
      }

      const cvDocs = data.documents.filter((doc: Document) => doc.type === "cv");
      const jobDocs = data.documents.filter((doc: Document) => doc.type === "job");

      setCvs(cvDocs || []);
      setJobs(jobDocs || []);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      toast.error(errorMessage);
    }
  };

  const handleGenerateNew = async () => {
    await fetchDocuments();
    setSelectedCvId("");
    setSelectedJobId("");
    setTemplate('standard');
    setTone('professional');
    setLength('medium');
    setLanguage('en');
    setEmphasizeSkills('');
    setSpecificProjects('');
    setIsSelectionModalOpen(true);
  };

  const handleGenerate = async () => {
    if (!selectedCvId || !selectedJobId) {
      toast.error("Please select both CV and Job");
      return;
    }

    setIsGenerating(true);

    try {
      const customizationFields: any = {};
      if (emphasizeSkills) {
        customizationFields.emphasize_skills = emphasizeSkills.split(',').map(s => s.trim());
      }
      if (specificProjects) {
        customizationFields.specific_projects = specificProjects.split(',').map(s => s.trim());
      }

      const response = await fetch("/api/cover-letter/generate-simple", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          cvId: selectedCvId,
          jobId: selectedJobId,
          template,
          tone,
          length,
          language,
          customizationFields: Object.keys(customizationFields).length > 0 ? customizationFields : undefined,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to generate cover letter");
      }

      toast.success("Cover letter generated successfully!");
      setIsSelectionModalOpen(false);
      fetchCoverLetters();
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      toast.error(errorMessage);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCardClick = (letter: CoverLetter) => {
    setSelectedLetter(letter);
    setIsModalOpen(true);
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
      professional: "💼 Professional",
      friendly: "😊 Friendly",
      formal: "🎩 Formal",
    };
    return labels[tone] || tone;
  };

  const getTemplateLabel = (template: string) => {
    const tmpl = TEMPLATES.find(t => t.id === template);
    return tmpl ? `${tmpl.emoji} ${tmpl.name}` : template;
  };

  const getToneIcon = (tone: string) => {
    const icons: Record<string, string> = {
      professional: "💼",
      friendly: "😊",
      formal: "🎩",
    };
    return icons[tone] || "✉️";
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
        <HeaderContent>
          <Title>✉️ Cover Letters</Title>
          <Description>
            View and manage all your AI-generated cover letters. Click on any letter to view the full content.
          </Description>
        </HeaderContent>
        <Button onClick={handleGenerateNew} size="lg">
          + Generate New
        </Button>
      </Header>

      {coverLetters.length === 0 ? (
        <EmptyState>
          <EmptyIcon>✉️</EmptyIcon>
          <h3 style={{ marginBottom: "8px" }}>No cover letters yet</h3>
          <p style={{ marginBottom: "24px" }}>
            Generate your first cover letter using the button above
          </p>
          <Button onClick={handleGenerateNew}>+ Generate Cover Letter</Button>
        </EmptyState>
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
                    {getToneIcon(letter.tone)} {letter.job?.title || "Cover Letter"}
                  </CardTitle>
                  {letter.job && (
                    <CardSubtitle>
                      Application for {letter.job.title}
                    </CardSubtitle>
                  )}
                </div>
                <DateBadge>{formatDate(letter.created_at)}</DateBadge>
              </CardHeader>

              <PreviewText>{letter.content}</PreviewText>

              <MetaTags>
                <Tag $tone={letter.tone}>{getToneLabel(letter.tone)}</Tag>
                {letter.template && <Tag>{getTemplateLabel(letter.template)}</Tag>}
                <Tag>{getWordCount(letter.content)} words</Tag>
                <Tag>{getLanguageLabel(letter.language)}</Tag>
              </MetaTags>

              <CardActions onClick={(e) => e.stopPropagation()}>
                <ActionButton
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCardClick(letter);
                  }}
                >
                  <ViewIcon /> View Full
                </ActionButton>
                <ActionButton
                  $variant="ghost"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigator.clipboard.writeText(letter.content);
                    toast.success("Copied to clipboard!");
                  }}
                >
                  <CopyIcon /> Copy
                </ActionButton>
                <ActionButton
                  $variant="danger"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteClick(letter.id);
                  }}
                >
                  <DeleteIcon /> Delete
                </ActionButton>
              </CardActions>
            </CoverLetterCard>
          ))}
        </Grid>
      )}

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
                {selectedLetter.template && (
                  <MetaItem>
                    <strong>Template:</strong> {getTemplateLabel(selectedLetter.template)}
                  </MetaItem>
                )}
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
              📋 Copy
            </Button>
            <Button variant="primary" onClick={handleDownload}>
              💾 Download
            </Button>
          </Modal.Footer>
        </Modal>
      )}

      {/* Generation Modal */}
      <Modal
        isOpen={isSelectionModalOpen}
        onClose={() => setIsSelectionModalOpen(false)}
        title="✉️ Generate Cover Letter"
        description="Customize and generate a personalized cover letter"
        size="xl"
      >
        <Modal.Body>
          <SelectionModalContent>
            <Section>
              <SectionTitle>Select Your CV</SectionTitle>
              {cvs.length === 0 ? (
                <p style={{ color: "#9ca3af" }}>No CVs found. Please upload a CV first.</p>
              ) : (
                <SelectList>
                  {cvs.map((cv) => (
                    <SelectItem
                      key={cv.id}
                      $selected={selectedCvId === cv.id}
                      onClick={() => setSelectedCvId(cv.id)}
                    >
                      <ItemTitle>{cv.title}</ItemTitle>
                      <ItemMeta>Created: {formatDate(cv.created_at)}</ItemMeta>
                    </SelectItem>
                  ))}
                </SelectList>
              )}
            </Section>

            <Section>
              <SectionTitle>Select Job Posting</SectionTitle>
              {jobs.length === 0 ? (
                <p style={{ color: "#9ca3af" }}>No jobs found. Please add a job posting first.</p>
              ) : (
                <SelectList>
                  {jobs.map((job) => (
                    <SelectItem
                      key={job.id}
                      $selected={selectedJobId === job.id}
                      onClick={() => setSelectedJobId(job.id)}
                    >
                      <ItemTitle>{job.title}</ItemTitle>
                      <ItemMeta>Created: {formatDate(job.created_at)}</ItemMeta>
                    </SelectItem>
                  ))}
                </SelectList>
              )}
            </Section>

            <Section>
              <SectionTitle>Template</SectionTitle>
              <SectionDescription>
                Choose the approach that best fits your application
              </SectionDescription>
              <TemplateGrid>
                {TEMPLATES.map(tmpl => (
                  <TemplateButton
                    key={tmpl.id}
                    $selected={template === tmpl.id}
                    onClick={() => setTemplate(tmpl.id)}
                  >
                    <div style={{ fontSize: '20px' }}>{tmpl.emoji}</div>
                    <div style={{ fontWeight: 600, fontSize: '14px' }}>{tmpl.name}</div>
                    <div style={{ fontSize: '11px', opacity: 0.8, fontWeight: 400 }}>{tmpl.description}</div>
                  </TemplateButton>
                ))}
              </TemplateGrid>
            </Section>

            <Section>
              <SectionTitle>Tone</SectionTitle>
              <OptionGrid>
                <OptionButton
                  $selected={tone === 'professional'}
                  onClick={() => setTone('professional')}
                >
                  Professional
                </OptionButton>
                <OptionButton
                  $selected={tone === 'friendly'}
                  onClick={() => setTone('friendly')}
                >
                  Friendly
                </OptionButton>
                <OptionButton
                  $selected={tone === 'formal'}
                  onClick={() => setTone('formal')}
                >
                  Formal
                </OptionButton>
              </OptionGrid>
            </Section>

            <Section>
              <SectionTitle>Length</SectionTitle>
              <OptionGrid>
                <OptionButton
                  $selected={length === 'short'}
                  onClick={() => setLength('short')}
                >
                  Short (150-200)
                </OptionButton>
                <OptionButton
                  $selected={length === 'medium'}
                  onClick={() => setLength('medium')}
                >
                  Medium (250-300)
                </OptionButton>
                <OptionButton
                  $selected={length === 'long'}
                  onClick={() => setLength('long')}
                >
                  Long (350-400)
                </OptionButton>
              </OptionGrid>
            </Section>

            <Section>
              <SectionTitle>Language</SectionTitle>
              <OptionGrid>
                <OptionButton
                  $selected={language === 'en'}
                  onClick={() => setLanguage('en')}
                >
                  English
                </OptionButton>
                <OptionButton
                  $selected={language === 'tr'}
                  onClick={() => setLanguage('tr')}
                >
                  Turkish
                </OptionButton>
              </OptionGrid>
            </Section>

            <Section>
              <SectionTitle>Customization (Optional)</SectionTitle>
              <SectionDescription>
                Help AI personalize your letter by specifying key information
              </SectionDescription>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <Input
                  type="text"
                  placeholder="Skills to emphasize (comma-separated, e.g., Python, Leadership, Data Analysis)"
                  value={emphasizeSkills}
                  onChange={(e) => setEmphasizeSkills(e.target.value)}
                />
                <Input
                  type="text"
                  placeholder="Specific projects to highlight (comma-separated, e.g., E-commerce Platform, ML Model)"
                  value={specificProjects}
                  onChange={(e) => setSpecificProjects(e.target.value)}
                />
              </div>
            </Section>
          </SelectionModalContent>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="ghost"
            onClick={() => setIsSelectionModalOpen(false)}
            disabled={isGenerating}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleGenerate}
            isLoading={isGenerating}
            disabled={!selectedCvId || !selectedJobId}
          >
            {isGenerating ? "Generating..." : "Generate Cover Letter"}
          </Button>
        </Modal.Footer>
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
            <p style={{ color: '#dc2626', fontSize: '14px', fontWeight: 500 }}>
              ⚠️ This will permanently remove the cover letter from your account.
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
