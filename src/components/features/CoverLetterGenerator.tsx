"use client";

import { useState, useEffect } from "react";
import styled from "styled-components";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/Spinner";
import { useToast } from "@/contexts/ToastContext";

// Icons
const DocumentIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" />
    <line x1="10" y1="9" x2="8" y2="9" />
  </svg>
);

const BookOpenIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
  </svg>
);

const CodeIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="16 18 22 12 16 6" />
    <polyline points="8 6 2 12 8 18" />
  </svg>
);

const ChartIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="20" x2="18" y2="10" />
    <line x1="12" y1="20" x2="12" y2="4" />
    <line x1="6" y1="20" x2="6" y2="14" />
  </svg>
);

const RefreshIcon = ({ size = 24 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 2v6h-6" />
    <path d="M3 12a9 9 0 0 1 15-6.7L21 8" />
    <path d="M3 22v-6h6" />
    <path d="M21 12a9 9 0 0 1-15 6.7L3 16" />
  </svg>
);

const ZapIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
  </svg>
);

const CopyIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
  </svg>
);

const DownloadIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="7 10 12 15 17 10" />
    <line x1="12" y1="15" x2="12" y2="3" />
  </svg>
);

const EditIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
  </svg>
);

const MailIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
    <polyline points="22,6 12,13 2,6" />
  </svg>
);

const LightbulbIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 18h6" />
    <path d="M10 22h4" />
    <path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .23 2.23 1.5 3.5A4.61 4.61 0 0 1 8.91 14" />
  </svg>
);

const CheckIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const GeneratorContent = styled.div`
  padding: ${({ theme }) => theme.spacing.lg};
`;

const OptionSection = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const OptionLabel = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.textPrimary};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const OptionDescription = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const OptionGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: ${({ theme }) => theme.spacing.sm};
`;

const TemplateGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: ${({ theme }) => theme.spacing.md};

  @media (max-width: 900px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 520px) {
    grid-template-columns: 1fr;
  }
`;

const OptionButton = styled.button<{ $selected: boolean }>`
  padding: ${({ theme }) => theme.spacing.md};
  background: ${({ $selected, theme }) =>
    $selected
      ? "var(--gradient-primary)"
      : theme.colors.surface};
  border: 2px solid
    ${({ $selected, theme }) =>
      $selected ? "var(--accent)" : theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.md};
  color: ${({ $selected, theme }) =>
    $selected ? "white" : theme.colors.textPrimary};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px
      ${({ $selected }) =>
        $selected ? "var(--accent-shadow)" : "rgba(0, 0, 0, 0.1)"};
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
  gap: ${({ theme }) => theme.spacing.xs};
  min-height: 140px;
`;

const TemplateIconWrapper = styled.div<{ $selected: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ $selected }) =>
    $selected
      ? "rgba(255, 255, 255, 0.2)"
      : "rgba(102, 126, 234, 0.1)"};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
  transition: all ${({ theme }) => theme.transitions.fast};

  svg {
    color: ${({ $selected }) =>
      $selected ? "white" : "var(--accent)"};
  }
`;

const OptionTitle = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

const OptionDesc = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  opacity: 0.8;
`;

const CustomizationSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
`;

const Input = styled.input`
  padding: ${({ theme }) => theme.spacing.md};
  background: ${({ theme }) => theme.colors.surface};
  border: 2px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.md};
  color: ${({ theme }) => theme.colors.textPrimary};
  font-size: ${({ theme }) => theme.typography.fontSize.base};

  &:focus {
    outline: none;
    border-color: var(--accent);
  }

  &::placeholder {
    color: ${({ theme }) => theme.colors.textSecondary};
    opacity: 0.6;
  }
`;

const PreviewHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const PreviewTitle = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const WordCount = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const EditorContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 320px;
  gap: ${({ theme }) => theme.spacing.lg};

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

const ParagraphsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg};
  max-height: 600px;
  overflow-y: auto;
  padding: ${({ theme }) => theme.spacing.md};
  background: ${({ theme }) => theme.colors.background};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.lg};
`;

const ParagraphCard = styled.div`
  padding: ${({ theme }) => theme.spacing.lg};
  background: ${({ theme }) => theme.colors.surface};
  border: 2px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.md};
  transition: all ${({ theme }) => theme.transitions.fast};
`;

const ParagraphType = styled.div<{ $type: string }>`
  display: inline-block;
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
  background: ${({ $type }) => {
    switch ($type) {
      case 'header': return '#64748b';
      case 'greeting': return '#06b6d4';
      case 'opening': return '#3b82f6';
      case 'achievement': return 'var(--success)';
      case 'motivation': return '#f59e0b';
      case 'closing': return '#8b5cf6';
      default: return '#6b7280';
    }
  }};
  color: white;
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  border-radius: ${({ theme }) => theme.radius.sm};
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const SentenceContainer = styled.div`
  margin: ${({ theme }) => theme.spacing.xs} 0;
  line-height: 1.8;
`;

const Sentence = styled.span<{ $isHighlight: boolean; $isSelected: boolean }>`
  cursor: pointer;
  padding: 2px 4px;
  border-radius: 4px;
  background: ${({ $isHighlight, $isSelected }) =>
    $isSelected ? '#fef3c7' :
    $isHighlight ? 'var(--success-light)' : 'transparent'};
  border-bottom: ${({ $isHighlight }) =>
    $isHighlight ? '2px solid var(--success)' : 'none'};
  transition: all 0.2s;

  &:hover {
    background: #fef3c7;
  }
`;

const AlternativesPopup = styled.div`
  position: absolute;
  background: ${({ theme }) => theme.colors.surface};
  border: 2px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.md};
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  padding: ${({ theme }) => theme.spacing.md};
  z-index: 1000;
  min-width: 300px;
  max-width: 500px;
`;

const AlternativeOption = styled.div`
  padding: ${({ theme }) => theme.spacing.sm};
  cursor: pointer;
  border-radius: ${({ theme }) => theme.radius.sm};
  transition: all ${({ theme }) => theme.transitions.fast};

  &:hover {
    background: rgba(102, 126, 234, 0.1);
  }

  &:not(:last-child) {
    border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  }
`;

const RationalePanel = styled.div`
  padding: ${({ theme }) => theme.spacing.lg};
  background: ${({ theme }) => theme.colors.surface};
  border: 2px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.lg};
  max-height: 600px;
  overflow-y: auto;
  position: sticky;
  top: 0;
`;

const RationaleTitle = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.textPrimary};
  margin-bottom: ${({ theme }) => theme.spacing.md};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const RationaleContent = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
  line-height: 1.6;
`;

const RationaleEmpty = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
  font-style: italic;
  text-align: center;
  padding: ${({ theme }) => theme.spacing.xl};
`;

const HighlightsList = styled.div`
  margin-top: ${({ theme }) => theme.spacing.lg};
  padding: ${({ theme }) => theme.spacing.md};
  background: var(--success-bg);
  border-left: 4px solid var(--success);
  border-radius: ${({ theme }) => theme.radius.md};
`;

const HighlightsTitle = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: var(--success);
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

const HighlightItem = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
  padding: ${({ theme }) => theme.spacing.xs} 0;
  display: flex;
  align-items: flex-start;
  gap: ${({ theme }) => theme.spacing.xs};

  svg {
    color: var(--success);
    flex-shrink: 0;
    margin-top: 2px;
  }
`;

const ActionButtons = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
  margin-top: ${({ theme }) => theme.spacing.xl};
  padding-top: ${({ theme }) => theme.spacing.lg};
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  flex-wrap: wrap;

  button {
    display: inline-flex;
    align-items: center;
    gap: ${({ theme }) => theme.spacing.xs};
  }

  @media (max-width: 520px) {
    flex-direction: column;

    button {
      width: 100%;
      justify-content: center;
    }
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing["3xl"]};
  text-align: center;
`;

const LoadingText = styled.div`
  margin-top: ${({ theme }) => theme.spacing.lg};
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const LoadingSpinner = styled.div`
  width: 80px;
  height: 80px;
  margin: 0 auto ${({ theme }) => theme.spacing.xl};
  border: 4px solid ${({ theme }) => theme.colors.border};
  border-top: 4px solid ${({ theme }) => theme.colors.primary};
  border-radius: 50%;
  animation: spin 1s linear infinite;

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

const LoadingTitle = styled.h3`
  font-size: ${({ theme }) => theme.typography.fontSize.xl};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.textPrimary};
  margin-bottom: ${({ theme }) => theme.spacing.md};
  background: var(--gradient-primary);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const LoadingMessage = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  color: ${({ theme }) => theme.colors.textSecondary};
  line-height: 1.6;
  min-height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 ${({ theme }) => theme.spacing.lg};
  animation: messageSlide 0.5s ease-in-out;

  @keyframes messageSlide {
    0% {
      opacity: 0;
      transform: translateY(-10px);
    }
    100% {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const LoadingModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  animation: fadeIn 0.3s ease-in-out;

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
`;

const LoadingModalContent = styled.div`
  background: ${({ theme }) => theme.colors.background};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.xl};
  padding: 48px;
  max-width: 600px;
  width: 90%;
  text-align: center;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  animation: slideUp 0.4s ease-out;

  @keyframes slideUp {
    from {
      transform: translateY(30px);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }
`;

interface Sentence {
  id: string;
  text: string;
  isHighlight: boolean;
  alternatives?: string[];
}

interface Paragraph {
  id: string;
  type: 'header' | 'greeting' | 'opening' | 'achievement' | 'motivation' | 'closing';
  content: string;
  rationale: string;
  sentences: Sentence[];
}

interface GeneratedLetter {
  content: string;
  wordCount: number;
  keyHighlights: string[];
  paragraphs?: Paragraph[];
}

interface CoverLetterGeneratorProps {
  isOpen: boolean;
  onClose: () => void;
  reportId?: string;
  existingLetter?: {
    id: string;
    content: string;
    tone: string;
    length: string;
    language: string;
    paragraphs?: Paragraph[];
    keyHighlights?: string[];
  };
  onSuccess?: (letterId?: string) => void;
}

const LOADING_MESSAGES = [
  "Crafting your personalized introduction... ✍️",
  "Analyzing job requirements... 🔍",
  "Highlighting your best achievements... 🌟",
  "Weaving your professional story... 📖",
  "Optimizing tone and language... 🎯",
  "Polishing the final touches... ✨",
  "Almost there... 🚀",
];

const TEMPLATES = [
  {
    id: 'standard',
    name: 'Standard',
    icon: DocumentIcon,
    description: 'Classic professional format with clear structure',
  },
  {
    id: 'story_driven',
    name: 'Story Driven',
    icon: BookOpenIcon,
    description: 'Narrative approach that tells your professional story',
  },
  {
    id: 'technical_focus',
    name: 'Technical Focus',
    icon: CodeIcon,
    description: 'Emphasize technical skills and achievements',
  },
  {
    id: 'results_oriented',
    name: 'Results Oriented',
    icon: ChartIcon,
    description: 'Focus on metrics and measurable impact',
  },
  {
    id: 'career_change',
    name: 'Career Change',
    icon: RefreshIcon,
    description: 'Perfect for transitioning to a new field',
  },
  {
    id: 'short_intro',
    name: 'Short Intro',
    icon: ZapIcon,
    description: 'Concise and impactful, straight to the point',
  },
];

export function CoverLetterGenerator({
  isOpen,
  onClose,
  reportId,
  existingLetter,
  onSuccess,
}: CoverLetterGeneratorProps) {
  const toast = useToast();

  // Form states
  const [template, setTemplate] = useState<string>('standard');
  const [tone, setTone] = useState<'professional' | 'friendly' | 'formal'>('professional');
  const [length, setLength] = useState<'short' | 'medium' | 'long'>('medium');
  const [language, setLanguage] = useState<'en' | 'tr'>('en');
  const [emphasizeSkills, setEmphasizeSkills] = useState<string>('');
  const [specificProjects, setSpecificProjects] = useState<string>('');

  // Generation states
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedLetter, setGeneratedLetter] = useState<GeneratedLetter | null>(null);
  const [loadingMessageIndex, setLoadingMessageIndex] = useState(0);

  // Rotate loading messages
  useEffect(() => {
    if (!isGenerating) return;

    const interval = setInterval(() => {
      setLoadingMessageIndex((prev) => (prev + 1) % LOADING_MESSAGES.length);
    }, 2500);

    return () => clearInterval(interval);
  }, [isGenerating]);

  // Load existing letter when modal opens in edit mode
  useEffect(() => {
    if (isOpen && existingLetter) {
      const wordCount = existingLetter.content.trim().split(/\s+/).length;
      setGeneratedLetter({
        content: existingLetter.content,
        wordCount: wordCount,
        keyHighlights: existingLetter.keyHighlights || [],
        paragraphs: existingLetter.paragraphs,
      });
      setTone(existingLetter.tone as 'professional' | 'friendly' | 'formal');
      setLength(existingLetter.length as 'short' | 'medium' | 'long');
      setLanguage(existingLetter.language as 'en' | 'tr');
    } else if (isOpen && !existingLetter) {
      // Reset when opening in create mode
      setGeneratedLetter(null);
      setTone('professional');
      setLength('medium');
      setLanguage('en');
      setTemplate('standard');
      setEmphasizeSkills('');
      setSpecificProjects('');
    }
  }, [isOpen, existingLetter]);

  // Editor states
  const [selectedSentence, setSelectedSentence] = useState<{
    paragraphId: string;
    sentenceId: string;
    position: { x: number; y: number };
  } | null>(null);
  const [activeParagraphId, setActiveParagraphId] = useState<string | null>(null);

  const handleGenerate = async () => {
    setIsGenerating(true);
    setGeneratedLetter(null);

    try {
      const customizationFields: any = {};
      if (emphasizeSkills) {
        customizationFields.emphasize_skills = emphasizeSkills.split(',').map(s => s.trim());
      }
      if (specificProjects) {
        customizationFields.specific_projects = specificProjects.split(',').map(s => s.trim());
      }

      const response = await fetch("/api/cover-letter/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          reportId,
          existingLetterId: existingLetter?.id, // Update existing letter if regenerating
          tone,
          length,
          language,
          template,
          customizationFields: Object.keys(customizationFields).length > 0 ? customizationFields : undefined,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to generate cover letter");
      }

      setGeneratedLetter(result.coverLetter);
      toast.success(existingLetter ? "Cover letter updated!" : "Cover letter generated!");
      onSuccess?.(result.coverLetter?.id);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      toast.error(errorMessage);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSentenceClick = (
    paragraphId: string,
    sentenceId: string,
    event: React.MouseEvent
  ) => {
    const rect = (event.target as HTMLElement).getBoundingClientRect();
    setSelectedSentence({
      paragraphId,
      sentenceId,
      position: { x: rect.left, y: rect.bottom + 5 },
    });
  };

  const handleAlternativeSelect = (paragraphId: string, sentenceId: string, newText: string) => {
    if (!generatedLetter?.paragraphs) return;

    const updatedParagraphs = generatedLetter.paragraphs.map(para => {
      if (para.id === paragraphId) {
        const updatedSentences = para.sentences.map(sent =>
          sent.id === sentenceId ? { ...sent, text: newText } : sent
        );
        const updatedContent = updatedSentences.map(s => s.text).join(' ');
        return { ...para, sentences: updatedSentences, content: updatedContent };
      }
      return para;
    });

    const updatedContent = updatedParagraphs.map(p => p.content).join('\n\n');

    setGeneratedLetter({
      ...generatedLetter,
      paragraphs: updatedParagraphs,
      content: updatedContent,
    });
    setSelectedSentence(null);
    toast.success("Sentence updated!");
  };

  const handleCopy = () => {
    if (generatedLetter) {
      navigator.clipboard.writeText(generatedLetter.content);
      toast.success("Cover letter copied to clipboard!");
    }
  };

  const handleDownload = () => {
    if (generatedLetter) {
      const blob = new Blob([generatedLetter.content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'cover_letter.txt';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success("Cover letter downloaded!");
    }
  };

  const getSelectedSentence = () => {
    if (!selectedSentence || !generatedLetter?.paragraphs) return null;

    const paragraph = generatedLetter.paragraphs.find(p => p.id === selectedSentence.paragraphId);
    if (!paragraph) return null;

    const sentence = paragraph.sentences.find(s => s.id === selectedSentence.sentenceId);
    return sentence;
  };

  const selectedSentenceData = getSelectedSentence();
  const activeParagraph = generatedLetter?.paragraphs?.find(p => p.id === activeParagraphId);

  // Show full-screen loading overlay when generating
  if (isGenerating) {
    return (
      <LoadingModalOverlay>
        <LoadingModalContent>
          <LoadingSpinner />
          <LoadingTitle>Generating Your Cover Letter</LoadingTitle>
          <LoadingMessage key={loadingMessageIndex}>
            {LOADING_MESSAGES[loadingMessageIndex]}
          </LoadingMessage>
        </LoadingModalContent>
      </LoadingModalOverlay>
    );
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={existingLetter ? "Edit Cover Letter" : "Generate Cover Letter"}
      description={existingLetter ? "Review and edit your cover letter" : "Create a personalized, customizable cover letter with AI assistance"}
      size="xl"
    >
      <Modal.Body>
        <GeneratorContent>
          {!generatedLetter ? (
            <>
              <OptionSection>
                <OptionLabel>Template</OptionLabel>
                <OptionDescription>
                  Choose the approach that best fits your application
                </OptionDescription>
                <TemplateGrid>
                  {TEMPLATES.map(tmpl => {
                    const IconComponent = tmpl.icon;
                    return (
                      <TemplateButton
                        key={tmpl.id}
                        $selected={template === tmpl.id}
                        onClick={() => setTemplate(tmpl.id)}
                      >
                        <TemplateIconWrapper $selected={template === tmpl.id}>
                          <IconComponent />
                        </TemplateIconWrapper>
                        <OptionTitle>{tmpl.name}</OptionTitle>
                        <OptionDesc>{tmpl.description}</OptionDesc>
                      </TemplateButton>
                    );
                  })}
                </TemplateGrid>
              </OptionSection>

              <OptionSection>
                <OptionLabel>Tone</OptionLabel>
                <OptionGrid>
                  <OptionButton
                    $selected={tone === 'professional'}
                    onClick={() => setTone('professional')}
                  >
                    <OptionTitle>Professional</OptionTitle>
                    <OptionDesc>Confident & direct</OptionDesc>
                  </OptionButton>
                  <OptionButton
                    $selected={tone === 'friendly'}
                    onClick={() => setTone('friendly')}
                  >
                    <OptionTitle>Friendly</OptionTitle>
                    <OptionDesc>Warm & approachable</OptionDesc>
                  </OptionButton>
                  <OptionButton
                    $selected={tone === 'formal'}
                    onClick={() => setTone('formal')}
                  >
                    <OptionTitle>Formal</OptionTitle>
                    <OptionDesc>Traditional & respectful</OptionDesc>
                  </OptionButton>
                </OptionGrid>
              </OptionSection>

              <OptionSection>
                <OptionLabel>Length</OptionLabel>
                <OptionGrid>
                  <OptionButton
                    $selected={length === 'short'}
                    onClick={() => setLength('short')}
                  >
                    <OptionTitle>Short</OptionTitle>
                    <OptionDesc>150-200 words</OptionDesc>
                  </OptionButton>
                  <OptionButton
                    $selected={length === 'medium'}
                    onClick={() => setLength('medium')}
                  >
                    <OptionTitle>Medium</OptionTitle>
                    <OptionDesc>250-300 words</OptionDesc>
                  </OptionButton>
                  <OptionButton
                    $selected={length === 'long'}
                    onClick={() => setLength('long')}
                  >
                    <OptionTitle>Long</OptionTitle>
                    <OptionDesc>350-400 words</OptionDesc>
                  </OptionButton>
                </OptionGrid>
              </OptionSection>

              {/* Language selection hidden for now - defaulting to English
                 Infrastructure preserved for future multi-language support */}

              <OptionSection>
                <OptionLabel>Customization (Optional)</OptionLabel>
                <OptionDescription>
                  Help AI personalize your letter by specifying key information
                </OptionDescription>
                <CustomizationSection>
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
                </CustomizationSection>
              </OptionSection>

              <Button
                size="lg"
                onClick={handleGenerate}
                style={{ width: '100%' }}
              >
                Generate Cover Letter
              </Button>
            </>
          ) : (
            <>
              <PreviewHeader>
                <PreviewTitle>Your Interactive Cover Letter</PreviewTitle>
                <WordCount>{generatedLetter.wordCount} words</WordCount>
              </PreviewHeader>

              {generatedLetter.paragraphs && generatedLetter.paragraphs.length > 0 ? (
                <EditorContainer>
                  <ParagraphsContainer>
                    {generatedLetter.paragraphs.map((paragraph) => (
                      <ParagraphCard
                        key={paragraph.id}
                        onMouseEnter={() => setActiveParagraphId(paragraph.id)}
                        onMouseLeave={() => setActiveParagraphId(null)}
                      >
                        <ParagraphType $type={paragraph.type}>
                          {paragraph.type.replace('_', ' ')}
                        </ParagraphType>
                        <SentenceContainer>
                          {paragraph.sentences && paragraph.sentences.length > 0 ? (
                            paragraph.sentences.map((sentence, idx) => (
                              <span key={sentence.id}>
                                <Sentence
                                  $isHighlight={sentence.isHighlight}
                                  $isSelected={
                                    selectedSentence?.sentenceId === sentence.id &&
                                    selectedSentence?.paragraphId === paragraph.id
                                  }
                                  onClick={(e) => sentence.alternatives && sentence.alternatives.length > 0 &&
                                    handleSentenceClick(paragraph.id, sentence.id, e)
                                  }
                                  title={sentence.isHighlight ? "Click for alternatives" : undefined}
                                >
                                  {sentence.text}
                                </Sentence>
                                {idx < paragraph.sentences.length - 1 && ' '}
                              </span>
                            ))
                          ) : (
                            <div style={{ whiteSpace: 'pre-wrap' }}>
                              {paragraph.content}
                            </div>
                          )}
                        </SentenceContainer>
                      </ParagraphCard>
                    ))}
                  </ParagraphsContainer>

                  <RationalePanel>
                    <RationaleTitle>
                      <LightbulbIcon /> Why This Content?
                    </RationaleTitle>
                    {activeParagraph ? (
                      <RationaleContent>
                        <strong style={{ display: 'block', marginBottom: '8px' }}>
                          {activeParagraph.type.replace('_', ' ').toUpperCase()} Paragraph:
                        </strong>
                        {activeParagraph.rationale}
                      </RationaleContent>
                    ) : (
                      <RationaleEmpty>
                        Hover over a paragraph to see why it was included and how it relates to the job posting.
                      </RationaleEmpty>
                    )}
                  </RationalePanel>
                </EditorContainer>
              ) : (
                <div style={{
                  padding: '24px',
                  background: '#f9fafb',
                  borderRadius: '8px',
                  whiteSpace: 'pre-wrap',
                  lineHeight: '1.8'
                }}>
                  {generatedLetter.content}
                </div>
              )}

              {generatedLetter.keyHighlights && generatedLetter.keyHighlights.length > 0 && (
                <HighlightsList>
                  <HighlightsTitle>Key Highlights Mentioned:</HighlightsTitle>
                  {generatedLetter.keyHighlights.map((highlight, index) => (
                    <HighlightItem key={index}>
                      <CheckIcon />
                      <span>{highlight}</span>
                    </HighlightItem>
                  ))}
                </HighlightsList>
              )}

              <ActionButtons>
                <Button onClick={handleCopy} variant="primary">
                  <CopyIcon /> Copy to Clipboard
                </Button>
                <Button onClick={handleDownload} variant="ghost">
                  <DownloadIcon /> Download
                </Button>
                <Button
                  onClick={() => setGeneratedLetter(null)}
                  variant="ghost"
                >
                  <RefreshIcon size={16} /> Generate New
                </Button>
              </ActionButtons>

              {/* Alternatives Popup */}
              {selectedSentence && selectedSentenceData && selectedSentenceData.alternatives && (
                <>
                  <div
                    style={{
                      position: 'fixed',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      zIndex: 999,
                    }}
                    onClick={() => setSelectedSentence(null)}
                  />
                  <AlternativesPopup
                    style={{
                      top: selectedSentence.position.y,
                      left: selectedSentence.position.x,
                    }}
                  >
                    <div style={{
                      fontSize: '12px',
                      fontWeight: 600,
                      marginBottom: '8px',
                      color: '#6b7280',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px'
                    }}>
                      Alternative Phrasings
                    </div>
                    <AlternativeOption
                      onClick={() => {
                        // Keep current
                        setSelectedSentence(null);
                      }}
                      style={{ fontWeight: 600, color: 'var(--success)', display: 'flex', alignItems: 'center', gap: '6px' }}
                    >
                      <CheckIcon /> {selectedSentenceData.text}
                    </AlternativeOption>
                    {selectedSentenceData.alternatives.map((alt, idx) => (
                      <AlternativeOption
                        key={idx}
                        onClick={() =>
                          handleAlternativeSelect(
                            selectedSentence.paragraphId,
                            selectedSentence.sentenceId,
                            alt
                          )
                        }
                      >
                        {alt}
                      </AlternativeOption>
                    ))}
                  </AlternativesPopup>
                </>
              )}
            </>
          )}
        </GeneratorContent>
      </Modal.Body>
    </Modal>
  );
}
