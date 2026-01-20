"use client";

import { useState, useEffect } from "react";
import styled from "styled-components";
import { Sheet } from "@/components/ui/Sheet";
import { Button } from "@/components/ui/Button";
import { LoadingModal } from "@/components/ui/LoadingModal";
import { useToast } from "@/contexts/ToastContext";

// Icons
const RefreshIcon = ({ size = 24 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 2v6h-6" />
    <path d="M3 12a9 9 0 0 1 15-6.7L21 8" />
    <path d="M3 22v-6h6" />
    <path d="M21 12a9 9 0 0 1-15 6.7L3 16" />
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
  padding: 0;
  font-size: 13px;
`;

const OptionSection = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  padding: 12px 24px;
`;

const OptionLabel = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.textPrimary};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
  letter-spacing: 0.5px;
`;

const OptionDescription = styled.div`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const TemplateList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const TemplateItem = styled.label<{ $selected: boolean }>`
  display: flex;
  align-items: flex-start;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.radius.md};
  border: 1px solid ${({ $selected, theme }) =>
    $selected ? "var(--accent)" : theme.colors.border};
  background: ${({ $selected }) =>
    $selected ? "rgba(255, 255, 255, 0.2)" : "transparent"};
  cursor: pointer;
  transition: all 150ms ease;

  &:hover {
    background: ${({ $selected }) =>
      $selected ? "rgba(255, 255, 255, 0.4)" : "rgba(255, 255, 255, 0.1)"};
  }
`;

const RadioIndicator = styled.div<{ $selected: boolean }>`
  position: relative;
  width: 18px;
  height: 18px;
  flex-shrink: 0;
  border-radius: 50%;
  border: 2px solid ${({ $selected }) =>
    $selected ? "var(--accent)" : "var(--checkbox)"};
  background: ${({ $selected }) =>
    $selected ? "var(--accent)" : "transparent"};
  transition: all 150ms ease;
  margin-top: 2px;

  &::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: white;
    opacity: ${({ $selected }) => ($selected ? 1 : 0)};
    transition: opacity 150ms ease;
  }
`;

const TemplateContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const TemplateName = styled.span`
  font-size: 13px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const TemplateDescription = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const SimpleOptionList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
`;

const SimpleOptionItem = styled.label<{ $selected: boolean }>`
  display: flex;
  align-items: flex-start;
  gap: ${({ theme }) => theme.spacing.sm};
  cursor: pointer;
  padding: ${({ theme }) => theme.spacing.xs} 0;
`;

const SimpleRadioIndicator = styled.div<{ $selected: boolean }>`
  position: relative;
  width: 18px;
  height: 18px;
  flex-shrink: 0;
  border-radius: 50%;
  border: 2px solid ${({ $selected }) =>
    $selected ? "var(--accent)" : "var(--checkbox)"};
  background: ${({ $selected }) =>
    $selected ? "var(--accent)" : "transparent"};
  transition: all 150ms ease;
  margin-top: 1px;

  &::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: white;
    opacity: ${({ $selected }) => ($selected ? 1 : 0)};
    transition: opacity 150ms ease;
  }
`;

const SimpleOptionContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const SimpleOptionLabel = styled.span`
  font-size: 13px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const SimpleOptionDescription = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const CustomizationSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
`;

const StyledTextarea = styled.textarea`
  display: flex;
  width: 100%;
  min-height: 64px;
  padding: 8px 12px;
  background: transparent;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.md};
  color: ${({ theme }) => theme.colors.textPrimary};
  font-size: 14px;
  font-family: inherit;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  outline: none;
  resize: vertical;
  field-sizing: content;
  transition: color 150ms ease, box-shadow 150ms ease, border-color 150ms ease;

  &:focus-visible {
    border-color: var(--ring, var(--accent));
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.25);
  }

  &::placeholder {
    color: ${({ theme }) => theme.colors.textSecondary};
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }

  @media (prefers-color-scheme: dark) {
    background: rgba(255, 255, 255, 0.05);
  }
`;

const EditorContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const BottomRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
  margin-top: ${({ theme }) => theme.spacing.lg};
  padding: 0 12px;

  @media (min-width: 768px) {
    flex-direction: row;
    align-items: flex-start;
    gap: ${({ theme }) => theme.spacing.lg};
  }
`;

const BottomRowItem = styled.div`
  flex: 1;
  min-width: 0;

  @media (max-width: 767px) {
    width: 100%;
  }
`;

const ParagraphsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0;
  max-height: 400px;
  overflow-y: auto;
  padding: ${({ theme }) => theme.spacing.md};
  background: ${({ theme }) => theme.colors.border}; 
  @media (max-width: 768px) {
   max-height: 350px;
  }
`;

const ParagraphCard = styled.div`
  padding: ${({ theme }) => theme.spacing.sm};
  transition: all ${({ theme }) => theme.transitions.fast};
`;

const ParagraphType = styled.div<{ $type: string }>`
  display: inline-block;
  color: ${({ $type }) => {
    switch ($type) {
      case 'header': return '#64748b';
      case 'greeting': return '#EAB308';
      case 'opening': return '#2A57A0';
      case 'achievement': return 'var(--primary-500)';
      case 'motivation': return '#f59e0b';
      case 'closing': return '#F97316';
      default: return '#6b7280';
    }
  }};
  
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  text-transform: uppercase;
  letter-spacing: 0.5px;
  font-size: 12px;
`;

const SentenceContainer = styled.div`
  margin: ${({ theme }) => theme.spacing.xs} 0;
  line-height: 1.8;
`;

const Sentence = styled.span<{ $isHighlight: boolean; $isSelected: boolean }>`
  cursor: pointer;
  padding: 2px 4px;
  font-size: 13px;
  text-decoration: ${({ $isHighlight }) => ($isHighlight ? 'underline' : 'none')};
  font-style: ${({ $isHighlight }) => ($isHighlight ? 'italic' : 'normal')};
  background: ${({ $isHighlight, $isSelected }) =>
    $isSelected ? '#fef3c7' :
    $isHighlight ? 'transparent' : 'transparent'};
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
  padding: ${({ theme }) => theme.spacing.md};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.md};
  height: fit-content;
`;

const RationaleTitle = styled.div`
  font-size: 13px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  color: ${({ theme }) => theme.colors.textPrimary};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};

  svg {
    width: 14px;
    height: 14px;
  }
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
  padding: 12px;
`;

// Accordion for Key Highlights
const AccordionWrapper = styled.div`
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  padding: 0 ${({ theme }) => theme.spacing.md};
`;

const AccordionTrigger = styled.button<{ $isOpen: boolean }>`
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: space-between;
  padding: ${({ theme }) => theme.spacing.md} 0;
  background: transparent;
  border: none;
  cursor: pointer;
  gap: 10px;
  transition: all 150ms ease;
`;

const AccordionTriggerText = styled.span`
  font-size: 13px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const AccordionChevron = styled.div<{ $isOpen: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 200ms ease;
  transform: ${({ $isOpen }) => ($isOpen ? "rotate(180deg)" : "rotate(0deg)")};
  color: ${({ theme }) => theme.colors.textSecondary};

  svg {
    width: 16px;
    height: 16px;
  }
`;

const AccordionContent = styled.div<{ $isOpen: boolean }>`
  display: grid;
  grid-template-rows: ${({ $isOpen }) => ($isOpen ? "1fr" : "0fr")};
  transition: grid-template-rows 200ms ease;
`;

const AccordionContentInner = styled.div`
  overflow: hidden;
`;

const AccordionContentPadding = styled.div`
  padding-bottom: ${({ theme }) => theme.spacing.md};
`;

const HighlightItem = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
  padding: 6px 0;
  display: flex;
  align-items: flex-start;
  gap: ${({ theme }) => theme.spacing.sm};

  svg {
    color: var(--success);
    flex-shrink: 0;
    margin-top: 2px;
  }
`;

const ChevronDownIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
  </svg>
);

const ActionButtonsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};

  button {
    display: inline-flex;
    align-items: center;
    gap: ${({ theme }) => theme.spacing.xs};
    white-space: nowrap;
  }

  @media (min-width: 768px) {
    flex-direction: row;
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
  "Crafting your personalized introduction...",
  "Analyzing job requirements...",
  "Highlighting your best achievements...",
  "Weaving your professional story...",
  "Optimizing tone and language...",
  "Polishing the final touches...",
  "Almost there, hang tight...",
  "Creating something impressive...",
  "Making words dance together...",
  "Writing to impress hiring managers...",
];

const TEMPLATES = [
  {
    id: 'standard',
    name: 'Standard',
    description: 'Classic professional format with clear structure',
  },
  {
    id: 'story_driven',
    name: 'Story Driven',
    description: 'Narrative approach that tells your professional story',
  },
  {
    id: 'technical_focus',
    name: 'Technical Focus',
    description: 'Emphasize technical skills and achievements',
  },
  {
    id: 'results_oriented',
    name: 'Results Oriented',
    description: 'Focus on metrics and measurable impact',
  },
  {
    id: 'career_change',
    name: 'Career Change',
    description: 'Perfect for transitioning to a new field',
  },
  {
    id: 'short_intro',
    name: 'Short Intro',
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

  // State for bottom sheet (editor view)
  const [isEditorSheetOpen, setIsEditorSheetOpen] = useState(false);

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
      // Open editor sheet for existing letter
      setIsEditorSheetOpen(true);
    } else if (isOpen && !existingLetter) {
      // Reset when opening in create mode
      setGeneratedLetter(null);
      setTone('professional');
      setLength('medium');
      setLanguage('en');
      setTemplate('standard');
      setEmphasizeSkills('');
      setSpecificProjects('');
      setIsEditorSheetOpen(false);
    }
  }, [isOpen, existingLetter]);

  // Close editor sheet when main sheet closes
  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => {
        setIsEditorSheetOpen(false);
      }, 350);
    }
  }, [isOpen]);

  // Editor states
  const [selectedSentence, setSelectedSentence] = useState<{
    paragraphId: string;
    sentenceId: string;
    position: { x: number; y: number };
  } | null>(null);
  const [activeParagraphId, setActiveParagraphId] = useState<string | null>(null);
  const [isHighlightsOpen, setIsHighlightsOpen] = useState(false);

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
      setIsEditorSheetOpen(true); // Open bottom sheet with result
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

  return (
    <>
      {/* Cover Letter Generation Loading Modal */}
      <LoadingModal
        isOpen={isGenerating}
        title="Generating Cover Letter"
        messages={LOADING_MESSAGES}
        steps={[
          { label: "Analyze", completed: true },
          { label: "Write", active: true },
          { label: "Complete", active: false },
        ]}
      />

      {/* Right Sheet - Generation Form (only for new letters) */}
      <Sheet
        isOpen={isOpen && !existingLetter}
        onClose={onClose}
        title="Generate Cover Letter"
        description="Create a personalized, customizable cover letter with AI assistance"
        size="lg"
        side="right"
      >
        <Sheet.Body>
          <GeneratorContent>
            <OptionSection>
              <OptionLabel>Template</OptionLabel>
              <OptionDescription>
                Choose the approach that best fits your application
              </OptionDescription>
              <TemplateList>
                {TEMPLATES.map(tmpl => (
                  <TemplateItem
                    key={tmpl.id}
                    $selected={template === tmpl.id}
                    onClick={() => setTemplate(tmpl.id)}
                  >
                    <RadioIndicator $selected={template === tmpl.id} />
                    <TemplateContent>
                      <TemplateName>{tmpl.name}</TemplateName>
                      <TemplateDescription>{tmpl.description}</TemplateDescription>
                    </TemplateContent>
                  </TemplateItem>
                ))}
              </TemplateList>
            </OptionSection>

            <OptionSection>
              <OptionLabel>Tone</OptionLabel>
              <SimpleOptionList>
                <SimpleOptionItem
                  $selected={tone === 'professional'}
                  onClick={() => setTone('professional')}
                >
                  <SimpleRadioIndicator $selected={tone === 'professional'} />
                  <SimpleOptionContent>
                    <SimpleOptionLabel>Professional</SimpleOptionLabel>
                    <SimpleOptionDescription>Confident & direct</SimpleOptionDescription>
                  </SimpleOptionContent>
                </SimpleOptionItem>
                <SimpleOptionItem
                  $selected={tone === 'friendly'}
                  onClick={() => setTone('friendly')}
                >
                  <SimpleRadioIndicator $selected={tone === 'friendly'} />
                  <SimpleOptionContent>
                    <SimpleOptionLabel>Friendly</SimpleOptionLabel>
                    <SimpleOptionDescription>Warm & approachable</SimpleOptionDescription>
                  </SimpleOptionContent>
                </SimpleOptionItem>
                <SimpleOptionItem
                  $selected={tone === 'formal'}
                  onClick={() => setTone('formal')}
                >
                  <SimpleRadioIndicator $selected={tone === 'formal'} />
                  <SimpleOptionContent>
                    <SimpleOptionLabel>Formal</SimpleOptionLabel>
                    <SimpleOptionDescription>Traditional & respectful</SimpleOptionDescription>
                  </SimpleOptionContent>
                </SimpleOptionItem>
              </SimpleOptionList>
            </OptionSection>

            <OptionSection>
              <OptionLabel>Length</OptionLabel>
              <SimpleOptionList>
                <SimpleOptionItem
                  $selected={length === 'short'}
                  onClick={() => setLength('short')}
                >
                  <SimpleRadioIndicator $selected={length === 'short'} />
                  <SimpleOptionContent>
                    <SimpleOptionLabel>Short</SimpleOptionLabel>
                    <SimpleOptionDescription>150-200 words</SimpleOptionDescription>
                  </SimpleOptionContent>
                </SimpleOptionItem>
                <SimpleOptionItem
                  $selected={length === 'medium'}
                  onClick={() => setLength('medium')}
                >
                  <SimpleRadioIndicator $selected={length === 'medium'} />
                  <SimpleOptionContent>
                    <SimpleOptionLabel>Medium</SimpleOptionLabel>
                    <SimpleOptionDescription>250-300 words</SimpleOptionDescription>
                  </SimpleOptionContent>
                </SimpleOptionItem>
                <SimpleOptionItem
                  $selected={length === 'long'}
                  onClick={() => setLength('long')}
                >
                  <SimpleRadioIndicator $selected={length === 'long'} />
                  <SimpleOptionContent>
                    <SimpleOptionLabel>Long</SimpleOptionLabel>
                    <SimpleOptionDescription>350-400 words</SimpleOptionDescription>
                  </SimpleOptionContent>
                </SimpleOptionItem>
              </SimpleOptionList>
            </OptionSection>

            <OptionSection>
              <OptionLabel>Customization <i>(Optional)</i></OptionLabel>
              <OptionDescription>
                Help AI personalize your letter by specifying key information
              </OptionDescription>
              <CustomizationSection>
                <StyledTextarea
                  placeholder="Skills to emphasize (comma-separated, e.g., Python, Leadership, Data Analysis)"
                  value={emphasizeSkills}
                  onChange={(e) => setEmphasizeSkills(e.target.value)}
                />
                <StyledTextarea
                  placeholder="Specific projects to highlight (comma-separated, e.g., E-commerce Platform, ML Model)"
                  value={specificProjects}
                  onChange={(e) => setSpecificProjects(e.target.value)}
                />
              </CustomizationSection>
            </OptionSection>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', margin: '0 8px 12px 0' }}>
              <Button
                size="sm"
                variant="ghost"
                onClick={onClose}
              >
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={handleGenerate}
              >
                Generate
              </Button>
            </div>
          </GeneratorContent>
        </Sheet.Body>
      </Sheet>

      {/* Bottom Sheet - Editor/Viewer */}
      <Sheet
        isOpen={isEditorSheetOpen}
        onClose={() => {
          setIsEditorSheetOpen(false);
          // If viewing existing letter, also close main
          if (existingLetter) {
            onClose();
          }
        }}
        title="Cover Letter"
        description={generatedLetter ? `${generatedLetter.wordCount} words` : undefined}
        size="xl"
        side="bottom"
      >
        <Sheet.Body>
          {generatedLetter && (
            <GeneratorContent>
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
                </EditorContainer>
              ) : (
                <div style={{
                  padding: '16px',
                  background: 'var(--bg-alt)',
                  borderRadius: '0',
                  whiteSpace: 'pre-wrap',
                  lineHeight: '1.8',
                  maxHeight: '300px',
                  overflowY: 'auto'
                }}>
                  {generatedLetter.content}
                </div>
              )}

              {/* Bottom Row: Why This Content, Key Highlights, Actions */}
              <BottomRow>
                {generatedLetter.paragraphs && generatedLetter.paragraphs.length > 0 && (
                  <BottomRowItem>
                    <RationalePanel>
                      <RationaleTitle>
                        <LightbulbIcon /> Why This Content?
                      </RationaleTitle>
                      {activeParagraph ? (
                        <RationaleContent>
                          <strong style={{ display: 'block', marginBottom: '4px', fontSize: '12px' }}>
                            {activeParagraph.type.replace('_', ' ').toUpperCase()}:
                          </strong>
                          {activeParagraph.rationale}
                        </RationaleContent>
                      ) : (
                        <RationaleEmpty>
                          Hover over a paragraph to see why it was included.
                        </RationaleEmpty>
                      )}
                    </RationalePanel>
                  </BottomRowItem>
                )}

                {generatedLetter.keyHighlights && generatedLetter.keyHighlights.length > 0 && (
                  <BottomRowItem>
                    <AccordionWrapper>
                      <AccordionTrigger
                        $isOpen={isHighlightsOpen}
                        onClick={() => setIsHighlightsOpen(!isHighlightsOpen)}
                      >
                        <AccordionTriggerText>
                          Key Highlights ({generatedLetter.keyHighlights.length})
                        </AccordionTriggerText>
                        <AccordionChevron $isOpen={isHighlightsOpen}>
                          <ChevronDownIcon />
                        </AccordionChevron>
                      </AccordionTrigger>
                      <AccordionContent $isOpen={isHighlightsOpen}>
                        <AccordionContentInner>
                          <AccordionContentPadding>
                            {generatedLetter.keyHighlights.map((highlight, index) => (
                              <HighlightItem key={index}>
                                <span>{highlight}</span>
                              </HighlightItem>
                            ))}
                          </AccordionContentPadding>
                        </AccordionContentInner>
                      </AccordionContent>
                    </AccordionWrapper>
                  </BottomRowItem>
                )}

                <ActionButtonsWrapper>
                  <Button onClick={handleCopy} variant="primary" size="sm">
                    <CopyIcon /> Copy
                  </Button>
                  <Button onClick={handleDownload} variant="ghost" size="sm">
                    <DownloadIcon /> Download
                  </Button>
                  {!existingLetter && (
                    <Button
                      onClick={() => {
                        setIsEditorSheetOpen(false);
                        setGeneratedLetter(null);
                      }}
                      variant="ghost"
                      size="sm"
                    >
                      <RefreshIcon size={16} /> New
                    </Button>
                  )}
                </ActionButtonsWrapper>
              </BottomRow>

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
                      onClick={() => setSelectedSentence(null)}
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
            </GeneratorContent>
          )}
        </Sheet.Body>
      </Sheet>
    </>
  );
}
