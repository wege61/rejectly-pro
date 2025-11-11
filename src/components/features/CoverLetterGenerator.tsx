"use client";

import { useState } from "react";
import styled from "styled-components";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/Spinner";
import { useToast } from "@/contexts/ToastContext";

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
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
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
  gap: ${({ theme }) => theme.spacing.xs};
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
    border-color: #667eea;
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
      case 'achievement': return '#10b981';
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
    $isHighlight ? 'rgba(16, 185, 129, 0.1)' : 'transparent'};
  border-bottom: ${({ $isHighlight }) =>
    $isHighlight ? '2px solid #10b981' : 'none'};
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
  background: rgba(16, 185, 129, 0.05);
  border-left: 4px solid #10b981;
  border-radius: ${({ theme }) => theme.radius.md};
`;

const HighlightsTitle = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: #10b981;
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

const HighlightItem = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
  padding: ${({ theme }) => theme.spacing.xs} 0;

  &::before {
    content: "✓ ";
    color: #10b981;
    font-weight: bold;
  }
`;

const ActionButtons = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
  margin-top: ${({ theme }) => theme.spacing.lg};
  flex-wrap: wrap;
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
  reportId: string;
  onSuccess?: () => void;
}

const TEMPLATES = [
  {
    id: 'standard',
    name: 'Standard',
    emoji: '📄',
    description: 'Classic professional format with clear structure',
  },
  {
    id: 'story_driven',
    name: 'Story Driven',
    emoji: '📖',
    description: 'Narrative approach that tells your professional story',
  },
  {
    id: 'technical_focus',
    name: 'Technical Focus',
    emoji: '💻',
    description: 'Emphasize technical skills and achievements',
  },
  {
    id: 'results_oriented',
    name: 'Results Oriented',
    emoji: '📊',
    description: 'Focus on metrics and measurable impact',
  },
  {
    id: 'career_change',
    name: 'Career Change',
    emoji: '🔄',
    description: 'Perfect for transitioning to a new field',
  },
  {
    id: 'short_intro',
    name: 'Short Intro',
    emoji: '⚡',
    description: 'Concise and impactful, straight to the point',
  },
];

export function CoverLetterGenerator({
  isOpen,
  onClose,
  reportId,
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
      toast.success("Cover letter generated successfully!");
      onSuccess?.();
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
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="✉️ Generate Cover Letter"
      description="Create a personalized, customizable cover letter with AI assistance"
      size="xl"
    >
      <Modal.Body>
        <GeneratorContent>
          {isGenerating ? (
            <LoadingContainer>
              <Spinner size="xl" />
              <LoadingText>
                Creating your personalized cover letter...
                <br />
                <span style={{ fontSize: '14px', marginTop: '8px', display: 'block' }}>
                  This may take a few moments
                </span>
              </LoadingText>
            </LoadingContainer>
          ) : !generatedLetter ? (
            <>
              <OptionSection>
                <OptionLabel>Template</OptionLabel>
                <OptionDescription>
                  Choose the approach that best fits your application
                </OptionDescription>
                <TemplateGrid>
                  {TEMPLATES.map(tmpl => (
                    <TemplateButton
                      key={tmpl.id}
                      $selected={template === tmpl.id}
                      onClick={() => setTemplate(tmpl.id)}
                    >
                      <div style={{ fontSize: '24px', marginBottom: '4px' }}>{tmpl.emoji}</div>
                      <OptionTitle>{tmpl.name}</OptionTitle>
                      <OptionDesc>{tmpl.description}</OptionDesc>
                    </TemplateButton>
                  ))}
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

              <OptionSection>
                <OptionLabel>Language</OptionLabel>
                <OptionGrid>
                  <OptionButton
                    $selected={language === 'en'}
                    onClick={() => setLanguage('en')}
                  >
                    <OptionTitle>English</OptionTitle>
                    <OptionDesc>International</OptionDesc>
                  </OptionButton>
                  <OptionButton
                    $selected={language === 'tr'}
                    onClick={() => setLanguage('tr')}
                  >
                    <OptionTitle>Turkish</OptionTitle>
                    <OptionDesc>Türkçe</OptionDesc>
                  </OptionButton>
                </OptionGrid>
              </OptionSection>

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
                      💡 Why This Content?
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
                    <HighlightItem key={index}>{highlight}</HighlightItem>
                  ))}
                </HighlightsList>
              )}

              <ActionButtons>
                <Button onClick={handleCopy} variant="primary">
                  📋 Copy to Clipboard
                </Button>
                <Button onClick={handleDownload} variant="ghost">
                  💾 Download
                </Button>
                <Button
                  onClick={() => setGeneratedLetter(null)}
                  variant="ghost"
                >
                  🔄 Generate New
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
                      style={{ fontWeight: 600, color: '#10b981' }}
                    >
                      ✓ {selectedSentenceData.text}
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
