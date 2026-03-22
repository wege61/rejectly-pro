"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import styled from "styled-components";
import { Modal } from "@/components/ui/Modal";
import { EditorModal, Body as EditorModalBody } from "@/components/ui/EditorModal";
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
  gap: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.md};
  border-radius: 12px;
  cursor: pointer;
  transition: border-color 0.2s ease, background 0.2s ease;

  background: ${({ $selected }) =>
    $selected ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.02)'};
  border: 1px solid ${({ $selected }) =>
    $selected ? 'rgba(var(--accent-rgb), 0.35)' : 'rgba(255, 255, 255, 0.06)'};

  &:hover {
    background: rgba(255, 255, 255, 0.05);
    border-color: ${({ $selected }) =>
      $selected ? 'rgba(var(--accent-rgb), 0.5)' : 'rgba(255, 255, 255, 0.12)'};
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
  align-items: center;
  gap: 12px;
  cursor: pointer;
  padding: 10px 14px;
  border-radius: 10px;
  transition: border-color 0.2s ease, background 0.2s ease;

  background: ${({ $selected }) =>
    $selected ? 'rgba(255, 255, 255, 0.05)' : 'transparent'};
  border: 1px solid ${({ $selected }) =>
    $selected ? 'rgba(var(--accent-rgb), 0.3)' : 'transparent'};

  &:hover {
    background: rgba(255, 255, 255, 0.04);
    border-color: ${({ $selected }) =>
      $selected ? 'rgba(var(--accent-rgb), 0.45)' : 'rgba(255, 255, 255, 0.08)'};
  }
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
  padding: 12px 16px;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  color: rgba(255, 255, 255, 0.9);
  font-size: 13.5px;
  font-family: inherit;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.05);
  outline: none;
  resize: vertical;
  field-sizing: content;
  transition: all 0.2s ease;

  &:focus-visible {
    border-color: rgba(var(--accent-rgb), 0.5);
    background: rgba(255, 255, 255, 0.04);
    box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.05), 0 0 0 3px rgba(var(--accent-rgb), 0.15);
  }

  &::placeholder {
    color: rgba(255, 255, 255, 0.4);
    font-style: italic;
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
`;

// ─── Document-style editor layout ─────────────────────────────────────────────

const EditorLayout = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  align-items: flex-start;

  @media (min-width: 900px) {
    grid-template-columns: 240px 1fr;
    gap: 32px;
  }
`;

const InsightsColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  position: sticky;
  top: 0;

  @media (max-width: 899px) {
    display: none;
  }
`;

const RationalePanel = styled.div`
  padding: 16px;
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.07);
`;

const RationaleTitle = styled.div`
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: rgba(255, 255, 255, 0.28);
  margin-bottom: 10px;
`;

const RationaleContent = styled.div`
  font-size: 12.5px;
  color: rgba(255, 255, 255, 0.7);
  line-height: 1.65;
`;

const RationaleEmpty = styled.div`
  font-size: 12px;
  color: rgba(255, 255, 255, 0.25);
  line-height: 1.6;
  font-style: italic;
`;

// Key Highlights
const HighlightsPanel = styled.div`
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.07);
  overflow: hidden;
`;

const HighlightsTrigger = styled.button<{ $isOpen: boolean }>`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  background: transparent;
  cursor: pointer;
  gap: 8px;

  .chevron {
    width: 12px;
    height: 12px;
    color: rgba(255, 255, 255, 0.2);
    transition: transform 0.22s ease;
    transform: ${({ $isOpen }) => ($isOpen ? 'rotate(180deg)' : 'rotate(0deg)')};
    flex-shrink: 0;
  }
`;

const HighlightsTriggerText = styled.span`
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: rgba(255, 255, 255, 0.28);
`;

const HighlightsContent = styled.div<{ $isOpen: boolean }>`
  display: grid;
  grid-template-rows: ${({ $isOpen }) => ($isOpen ? '1fr' : '0fr')};
  transition: grid-template-rows 0.22s ease;
`;

const HighlightsInner = styled.div`
  overflow: hidden;
`;

const HighlightItem = styled.div`
  padding: 8px 16px;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.55);
  line-height: 1.5;
  border-top: 1px solid rgba(255, 255, 255, 0.05);

  &:first-child { border-top: none; }
`;

const InteractionHint = styled.p`
  font-size: 11px;
  color: rgba(255, 255, 255, 0.22);
  line-height: 1.6;
  margin: 0;
  padding-top: 4px;
`;

const HintUnderline = styled.span`
  text-decoration: underline;
  text-decoration-style: dashed;
  text-decoration-color: rgba(255, 255, 255, 0.3);
  text-underline-offset: 3px;
`;

const DocumentView = styled.div`
  min-width: 0;
`;

const ParagraphSection = styled.div`
  margin-bottom: 36px;
  position: relative;
  &:last-child { margin-bottom: 0; }
`;

const ParagraphEyebrow = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 10px;
  position: relative;
`;

const EyebrowLabel = styled.span`
  font-size: 10px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: rgba(255, 255, 255, 0.2);
  cursor: default;
  user-select: none;
`;

const EyebrowDivider = styled.div`
  flex: 1;
  height: 1px;
  background: rgba(255, 255, 255, 0.05);
`;


const SentenceContainer = styled.div`
  line-height: 1.85;
  color: rgba(255, 255, 255, 0.88);
  font-size: 15px;
`;

const Sentence = styled.span<{ $isHighlight: boolean; $isSelected: boolean }>`
  padding: 2px 4px;
  margin: 0 -1px;
  border-radius: 4px;
  font-size: 13.5px;
  display: inline;
  transition: background 0.15s ease, color 0.15s ease;

  /* Non-interactive sentences */
  cursor: ${({ $isHighlight }) => $isHighlight ? 'pointer' : 'text'};

  text-decoration: ${({ $isHighlight, $isSelected }) =>
    $isHighlight || $isSelected ? 'underline' : 'none'};
  text-decoration-style: ${({ $isSelected }) => $isSelected ? 'solid' : 'dashed'};
  text-decoration-color: ${({ $isHighlight, $isSelected }) =>
    $isSelected
      ? 'var(--accent)'
      : $isHighlight
        ? 'rgba(var(--accent-rgb), 0.55)'
        : 'transparent'};
  text-underline-offset: 3px;

  background: ${({ $isSelected }) =>
    $isSelected ? 'rgba(var(--accent-rgb), 0.12)' : 'transparent'};

  color: ${({ $isHighlight, $isSelected }) =>
    $isSelected
      ? 'var(--accent)'
      : $isHighlight
        ? 'rgba(255, 255, 255, 0.75)'
        : 'inherit'};

  ${({ $isHighlight }) => $isHighlight && `
    &:hover {
      background: rgba(var(--accent-rgb), 0.1);
      color: var(--accent);
      text-decoration-color: var(--accent);
      text-decoration-style: solid;
    }
  `}
`;

// Select-style dropdown for alternatives
const SelectDropdown = styled.div`
  position: fixed;
  background: rgba(30, 30, 38, 0.85); /* Slightly transparent */
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.05);
  z-index: 3000;
  min-width: 320px;
  max-width: 450px;
  max-height: 300px;
  overflow-y: auto;
  padding: 8px;
  animation: selectFadeIn 250ms cubic-bezier(0.16, 1, 0.3, 1);
  transform-origin: top left;

  @keyframes selectFadeIn {
    from { opacity: 0; transform: scale(0.97); }
    to   { opacity: 1; transform: scale(1); }
  }

  &::-webkit-scrollbar { width: 6px; }
  &::-webkit-scrollbar-track { background: transparent; }
  &::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 4px; }
  &::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.2); }
`;

const SelectLabel = styled.div`
  padding: 8px 10px 6px;
  font-size: 11px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textSecondary};
  text-transform: uppercase;
  letter-spacing: 0.8px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  margin-bottom: 6px;
`;

const SelectItem = styled.div<{ $isSelected?: boolean }>`
  position: relative;
  display: flex;
  align-items: flex-start;
  gap: 8px;
  padding: 10px 10px 10px 32px;
  cursor: pointer;
  border-radius: 8px;
  font-size: 13px;
  line-height: 1.5;
  color: ${({ $isSelected }) => $isSelected ? 'var(--accent)' : 'rgba(255, 255, 255, 0.85)'};
  font-weight: ${({ $isSelected }) => $isSelected ? '500' : '400'};
  background: ${({ $isSelected }) => $isSelected ? 'rgba(var(--accent-rgb), 0.08)' : 'transparent'};
  transition: background 0.15s ease;
  margin-bottom: 2px;

  &:hover {
    background: ${({ $isSelected }) =>
      $isSelected ? 'rgba(var(--accent-rgb), 0.12)' : 'rgba(255, 255, 255, 0.05)'};
  }
`;

const SelectIndicator = styled.span`
  position: absolute;
  left: 8px;
  top: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--accent);

  svg {
    width: 14px;
    height: 14px;
  }
`;

const SelectOverlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 2999;
`;

// ─── Floating Player Bar (Apple Music-style) ────────────────────────────────

const FloatingPlayerBar = styled.div`
  position: absolute;
  bottom: 24px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 10;

  display: flex;
  align-items: center;
  gap: 4px;
  padding: 8px 10px;
  border-radius: 100px;
  white-space: nowrap;

  /* Navbar pattern: backdrop-filter on ::before with z-index: -1
     avoids nested stacking context issues */
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: 100px;
    background: rgba(150, 150, 150, 0.08);
    border: 1px solid rgba(255, 255, 255, 0.15);
    box-shadow: inset 0 1px 1px rgba(255, 255, 255, 0.2), 0 8px 32px rgba(0, 0, 0, 0.12);
    backdrop-filter: blur(40px) saturate(200%);
    -webkit-backdrop-filter: blur(40px) saturate(200%);
    z-index: -1;
  }
`;

const PlayerBtn = styled.button<{ $variant?: 'primary' | 'default' | 'ghost' }>`
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 9px 18px;
  border-radius: 100px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.15s ease, opacity 0.15s ease;
  letter-spacing: -0.1px;

  ${({ $variant = 'default' }) => {
    switch ($variant) {
      case 'primary':
        return `
          background: rgba(255, 255, 255, 0.14);
          border: 1px solid rgba(255, 255, 255, 0.18);
          color: rgba(255, 255, 255, 0.95);
          &:hover { background: rgba(255, 255, 255, 0.2); }
          &:active { opacity: 0.75; }
        `;
      case 'ghost':
        return `
          background: transparent;
          border: 1px solid transparent;
          color: rgba(255, 255, 255, 0.45);
          &:hover { background: rgba(255, 255, 255, 0.07); color: rgba(255, 255, 255, 0.7); }
          &:active { opacity: 0.6; }
        `;
      default:
        return `
          background: transparent;
          border: 1px solid transparent;
          color: rgba(255, 255, 255, 0.75);
          &:hover { background: rgba(255, 255, 255, 0.08); color: rgba(255, 255, 255, 0.95); }
          &:active { opacity: 0.6; }
        `;
    }
  }}

  svg { flex-shrink: 0; }
`;

const PlayerDivider = styled.div`
  width: 1px;
  height: 20px;
  background: rgba(255, 255, 255, 0.1);
  margin: 0 4px;
  flex-shrink: 0;
`;

const GlassButton = styled.button<{ $variant?: 'primary' | 'secondary' | 'ghost', $size?: 'sm' | 'md' }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  white-space: nowrap;
  border-radius: 10px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s ease, border-color 0.2s ease, opacity 0.2s ease;

  ${({ $size = 'md' }) =>
    $size === 'sm'
      ? 'padding: 8px 16px; font-size: 13px;'
      : 'padding: 10px 20px; font-size: 14px;'
  }

  ${({ $variant = 'secondary' }) => {
    switch ($variant) {
      case 'primary':
        return `
          background: var(--accent);
          border: 1px solid rgba(255, 255, 255, 0.15);
          color: #ffffff;

          &:hover { opacity: 0.88; }
          &:active { opacity: 0.76; }
        `;
      case 'ghost':
        return `
          background: transparent;
          border: 1px solid transparent;
          color: rgba(255, 255, 255, 0.55);

          &:hover {
            color: rgba(255, 255, 255, 0.85);
            background: rgba(255, 255, 255, 0.05);
            border-color: rgba(255, 255, 255, 0.08);
          }
        `;
      case 'secondary':
      default:
        return `
          background: rgba(255, 255, 255, 0.06);
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: rgba(255, 255, 255, 0.85);

          &:hover {
            background: rgba(255, 255, 255, 0.1);
            border-color: rgba(255, 255, 255, 0.18);
          }
          &:active { opacity: 0.8; }
        `;
    }
  }}
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
    rect: { top: number; bottom: number; left: number; right: number };
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
      rect: {
        top: rect.top,
        bottom: rect.bottom,
        left: rect.left,
        right: rect.right,
      },
    });
  };

  // Calculate dropdown position to prevent overflow
  const getDropdownPosition = () => {
    if (!selectedSentence) return { top: 0, left: 0 };

    const { rect } = selectedSentence;
    const dropdownWidth = 320;
    const dropdownHeight = 250; // Estimated max height
    const padding = 8;
    const gap = 6;

    let top = rect.bottom + gap;
    let left = rect.left;

    // Check if dropdown would overflow bottom
    if (top + dropdownHeight > window.innerHeight - padding) {
      // Position above the element
      top = rect.top - dropdownHeight - gap;
      // If still overflows top, just position at top with padding
      if (top < padding) {
        top = padding;
      }
    }

    // Check if dropdown would overflow right
    if (left + dropdownWidth > window.innerWidth - padding) {
      left = window.innerWidth - dropdownWidth - padding;
    }

    // Check if dropdown would overflow left
    if (left < padding) {
      left = padding;
    }

    return { top, left };
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

      {/* Modal - Generation Form (only for new letters) */}
      <Modal
        isOpen={isOpen && !existingLetter}
        onClose={onClose}
        title="Generate Cover Letter"
        description="Create a personalized, customizable cover letter with AI assistance"
        size="md"
      >
        <Modal.Body>
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

            <Modal.Footer>
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', width: '100%' }}>
                <GlassButton
                  $size="md"
                  $variant="ghost"
                  onClick={onClose}
                >
                  Cancel
                </GlassButton>
                <GlassButton
                  $size="md"
                  $variant="primary"
                  onClick={handleGenerate}
                >
                  Generate
                </GlassButton>
              </div>
            </Modal.Footer>
          </GeneratorContent>
        </Modal.Body>
      </Modal>

      {/* EditorModal - Editor/Viewer */}
      <EditorModal
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
        floatingBar={generatedLetter ? (
          <FloatingPlayerBar>
            {!existingLetter && (
              <>
                <PlayerBtn
                  $variant="ghost"
                  onClick={() => {
                    setIsEditorSheetOpen(false);
                    setGeneratedLetter(null);
                  }}
                >
                  <RefreshIcon size={14} /> New
                </PlayerBtn>
                <PlayerDivider />
              </>
            )}
            <PlayerBtn $variant="default" onClick={handleCopy}>
              <CopyIcon /> Copy
            </PlayerBtn>
            <PlayerBtn $variant="primary" onClick={handleDownload}>
              <DownloadIcon /> Download .txt
            </PlayerBtn>
          </FloatingPlayerBar>
        ) : undefined}
      >
        <EditorModalBody>
          {generatedLetter && (
            <GeneratorContent style={{ padding: '0 0 88px' }}>
              {generatedLetter.paragraphs && generatedLetter.paragraphs.length > 0 ? (
                <EditorLayout>
                  {/* Left column: Insights */}
                  <InsightsColumn>
                    <RationalePanel>
                      <RationaleTitle>Why This Content?</RationaleTitle>
                      {activeParagraph ? (
                        <RationaleContent>{activeParagraph.rationale}</RationaleContent>
                      ) : (
                        <RationaleEmpty>Hover over a paragraph to see why it was written this way.</RationaleEmpty>
                      )}
                    </RationalePanel>

                    {generatedLetter.keyHighlights && generatedLetter.keyHighlights.length > 0 && (
                      <HighlightsPanel>
                        <HighlightsTrigger
                          $isOpen={isHighlightsOpen}
                          onClick={() => setIsHighlightsOpen(!isHighlightsOpen)}
                        >
                          <HighlightsTriggerText>
                            Key Highlights ({generatedLetter.keyHighlights.length})
                          </HighlightsTriggerText>
                          <svg className="chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="6 9 12 15 18 9" />
                          </svg>
                        </HighlightsTrigger>
                        <HighlightsContent $isOpen={isHighlightsOpen}>
                          <HighlightsInner>
                            {generatedLetter.keyHighlights.map((h, i) => (
                              <HighlightItem key={i}>{h}</HighlightItem>
                            ))}
                          </HighlightsInner>
                        </HighlightsContent>
                      </HighlightsPanel>
                    )}
                    <InteractionHint>
                      <HintUnderline>Underlined phrases</HintUnderline> have alternatives — click to swap.
                    </InteractionHint>
                  </InsightsColumn>

                  {/* Right column: The letter */}
                  <DocumentView>
                    {generatedLetter.paragraphs.map((paragraph) => (
                      <ParagraphSection
                        key={paragraph.id}
                        onMouseEnter={() => setActiveParagraphId(paragraph.id)}
                        onMouseLeave={() => setActiveParagraphId(null)}
                      >
                        <ParagraphEyebrow>
                          <EyebrowLabel>{paragraph.type.replace('_', ' ')}</EyebrowLabel>
                          <EyebrowDivider />
                        </ParagraphEyebrow>
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
                            <div style={{ whiteSpace: 'pre-wrap' }}>{paragraph.content}</div>
                          )}
                        </SentenceContainer>
                      </ParagraphSection>
                    ))}
                  </DocumentView>
                </EditorLayout>
              ) : (
                <div style={{ whiteSpace: 'pre-wrap', lineHeight: '1.85', fontSize: '15px', color: 'rgba(255,255,255,0.88)' }}>
                  {generatedLetter.content}
                </div>
              )}

              {/* Alternatives Select Dropdown - rendered via portal */}
              {selectedSentence && selectedSentenceData && selectedSentenceData.alternatives && typeof document !== 'undefined' &&
                createPortal(
                  <>
                    <SelectOverlay onClick={() => setSelectedSentence(null)} />
                    <SelectDropdown style={getDropdownPosition()}>
                      <SelectLabel>Alternative Phrasings</SelectLabel>
                      <SelectItem
                        $isSelected={true}
                        onClick={() => setSelectedSentence(null)}
                      >
                        <SelectIndicator>
                          <CheckIcon />
                        </SelectIndicator>
                        {selectedSentenceData.text}
                      </SelectItem>
                      {selectedSentenceData.alternatives.map((alt, idx) => (
                        <SelectItem
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
                        </SelectItem>
                      ))}
                    </SelectDropdown>
                  </>,
                  document.body
                )
              }
            </GeneratorContent>
          )}

        </EditorModalBody>
      </EditorModal>
    </>
  );
}
