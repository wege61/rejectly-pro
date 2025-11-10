"use client";

import { useState, useEffect, useCallback } from "react";
import styled from "styled-components";
import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/Spinner";
import { useToast } from "@/contexts/ToastContext";
import { Modal } from "@/components/ui/Modal";

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
        return '#3b82f6'; // Blue
      case 'friendly':
        return '#10b981'; // Green
      case 'formal':
        return '#8b5cf6'; // Purple
      default:
        return '#6b7280'; // Gray
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
  gap: ${({ theme }) => theme.spacing.xs};
  margin-top: ${({ theme }) => theme.spacing.md};
  padding-top: ${({ theme }) => theme.spacing.md};
  border-top: 1px solid ${({ theme }) => theme.colors.border};
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
`;

const MetaItem = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const SelectionModalContent = styled.div`
  padding: ${({ theme }) => theme.spacing.lg};
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

interface CoverLetter {
  id: string;
  content: string;
  tone: string;
  length: string;
  language: string;
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

export default function CoverLettersPage() {
  const toast = useToast();
  const [coverLetters, setCoverLetters] = useState<CoverLetter[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedLetter, setSelectedLetter] = useState<CoverLetter | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSelectionModalOpen, setIsSelectionModalOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [cvs, setCvs] = useState<Document[]>([]);
  const [jobs, setJobs] = useState<Document[]>([]);
  const [selectedCvId, setSelectedCvId] = useState<string>("");
  const [selectedJobId, setSelectedJobId] = useState<string>("");
  const [tone, setTone] = useState<'professional' | 'friendly' | 'formal'>('professional');
  const [length, setLength] = useState<'short' | 'medium' | 'long'>('medium');
  const [language, setLanguage] = useState<'en' | 'tr'>('en');

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
    setTone('professional');
    setLength('medium');
    setLanguage('en');
    setIsSelectionModalOpen(true);
  };

  const handleGenerate = async () => {
    if (!selectedCvId || !selectedJobId) {
      toast.error("Please select both CV and Job");
      return;
    }

    setIsGenerating(true);

    try {
      const response = await fetch("/api/cover-letter/generate-simple", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          cvId: selectedCvId,
          jobId: selectedJobId,
          tone,
          length,
          language,
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

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this cover letter?")) {
      return;
    }

    try {
      const response = await fetch(`/api/cover-letters?id=${id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to delete cover letter");
      }

      toast.success("Cover letter deleted successfully!");
      fetchCoverLetters();
      setIsModalOpen(false);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      toast.error(errorMessage);
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
            Generate your first cover letter from a report page
          </p>
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
                <Tag>{getWordCount(letter.content)} words</Tag>
                <Tag>{getLanguageLabel(letter.language)}</Tag>
              </MetaTags>

              <CardActions onClick={(e) => e.stopPropagation()}>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigator.clipboard.writeText(letter.content);
                    toast.success("Copied to clipboard!");
                  }}
                >
                  📋 Copy
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(letter.id);
                  }}
                >
                  🗑️ Delete
                </Button>
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

      {/* Selection Modal */}
      <Modal
        isOpen={isSelectionModalOpen}
        onClose={() => setIsSelectionModalOpen(false)}
        title="Generate Cover Letter"
        description="Select CV, Job, and customize your cover letter"
        size="lg"
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
    </Container>
  );
}
