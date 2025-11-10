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

const OptionTitle = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

const OptionDesc = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  opacity: 0.8;
`;

const PreviewSection = styled.div`
  margin-top: ${({ theme }) => theme.spacing.xl};
  padding: ${({ theme }) => theme.spacing.xl};
  background: ${({ theme }) => theme.colors.background};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.lg};
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

const CoverLetterText = styled.div`
  white-space: pre-wrap;
  line-height: 1.8;
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  color: ${({ theme }) => theme.colors.textPrimary};
  max-height: 400px;
  overflow-y: auto;
  padding: ${({ theme }) => theme.spacing.md};
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

interface CoverLetterGeneratorProps {
  isOpen: boolean;
  onClose: () => void;
  reportId: string;
  onSuccess?: () => void;
}

export function CoverLetterGenerator({
  isOpen,
  onClose,
  reportId,
  onSuccess,
}: CoverLetterGeneratorProps) {
  const toast = useToast();
  const [tone, setTone] = useState<'professional' | 'friendly' | 'formal'>('professional');
  const [length, setLength] = useState<'short' | 'medium' | 'long'>('medium');
  const [language, setLanguage] = useState<'en' | 'tr'>('en');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedLetter, setGeneratedLetter] = useState<{
    content: string;
    wordCount: number;
    keyHighlights: string[];
  } | null>(null);

  const handleGenerate = async () => {
    setIsGenerating(true);
    setGeneratedLetter(null);

    try {
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

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="✉️ Generate Cover Letter"
      description="Create a personalized cover letter for your job application"
      size="lg"
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

              <Button
                size="lg"
                onClick={handleGenerate}
                style={{ width: '100%' }}
              >
                Generate Cover Letter
              </Button>
            </>
          ) : (
            <PreviewSection>
              <PreviewHeader>
                <PreviewTitle>Your Cover Letter</PreviewTitle>
                <WordCount>{generatedLetter.wordCount} words</WordCount>
              </PreviewHeader>

              <CoverLetterText>{generatedLetter.content}</CoverLetterText>

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
            </PreviewSection>
          )}
        </GeneratorContent>
      </Modal.Body>
    </Modal>
  );
}
