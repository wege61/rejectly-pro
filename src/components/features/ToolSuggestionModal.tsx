"use client";

import styled from "styled-components";
import { useState, useEffect } from "react";
import { Modal } from "@/components/ui/Modal";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { Briefcase, Target, Plus, Sparkles, Check, X, AlertCircle } from "lucide-react";
import {
  ExperienceTools,
  ToolSuggestion,
  ToolSuggestionResponse,
} from "@/types/toolSuggestion";

interface ToolSuggestionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (selectedTools: string[]) => void;
  onSkip: () => void;
  suggestions: ToolSuggestionResponse | null;
}

const ModalContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding: 12px 12px 32px 12px;

  @media (max-width: 640px) {
    gap: 16px;
    padding: 8px 8px 24px 8px;
  }
`;

const Description = styled.p`
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  line-height: 1.6;
  margin: 0;
`;

const HighlightText = styled.span`
  color: ${({ theme }) => theme.colors.warning};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
`;

const ExperienceSection = styled.div`
  background: rgba(15, 15, 18, 0.4);
  backdrop-filter: blur(40px) saturate(200%);
  -webkit-backdrop-filter: blur(40px) saturate(200%);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 20px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.05);

  @media (max-width: 640px) {
    padding: 16px;
    gap: 16px;
    border-radius: 16px;
  }
`;

const ExperienceHeader = styled.div`
  display: flex;
  align-items: flex-start;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const IconWrapper = styled.div<{ $variant?: 'default' | 'accent' | 'muted' }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ $variant }) =>
    $variant === 'accent'
      ? 'var(--accent-light, rgba(99, 102, 241, 0.1))'
      : $variant === 'muted'
      ? 'rgba(107, 114, 128, 0.1)'
      : 'rgba(99, 102, 241, 0.08)'};
  color: ${({ $variant, theme }) =>
    $variant === 'accent'
      ? 'var(--accent)'
      : $variant === 'muted'
      ? theme.colors.textTertiary
      : 'var(--accent)'};
  flex-shrink: 0;

  svg {
    width: 18px;
    height: 18px;
  }

  @media (max-width: 640px) {
    width: 32px;
    height: 32px;

    svg {
      width: 16px;
      height: 16px;
    }
  }
`;

const ExperienceInfo = styled.div`
  flex: 1;
`;

const ExperienceTitle = styled.h4`
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.textPrimary};
  margin: 0 0 2px 0;

  @media (max-width: 640px) {
    font-size: ${({ theme }) => theme.typography.fontSize.sm};
  }
`;

const ExperienceMeta = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
  margin: 0;

  @media (max-width: 640px) {
    font-size: ${({ theme }) => theme.typography.fontSize.xs};
  }
`;

const ExistingToolsLabel = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  color: ${({ theme }) => theme.colors.textTertiary};
  margin: ${({ theme }) => theme.spacing.sm} 0 0 0;
`;

const ExistingTools = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.xs};
  margin-top: ${({ theme }) => theme.spacing.xs};
`;

const ExistingToolBadge = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 2px 8px;
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.sm};
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const SuggestedToolsSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const SectionLabel = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  color: ${({ theme }) => theme.colors.textPrimary};
  margin: 0;
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const ToolsGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.sm};

  @media (max-width: 640px) {
    gap: 8px;
  }
`;

const ToolCheckboxWrapper = styled.div`
  position: relative;
  display: inline-flex;

  &:hover > div[data-tooltip] {
    opacity: 1;
    visibility: visible;
    transform: translateX(-50%) translateY(0);
  }
`;

const ToolTooltip = styled.div`
  position: absolute;
  bottom: calc(100% + 8px);
  left: 50%;
  transform: translateX(-50%) translateY(4px);
  background: ${({ theme }) => theme.colors.textPrimary};
  color: ${({ theme }) => theme.colors.background};
  padding: 10px 14px;
  border-radius: 8px;
  font-size: 12px;
  line-height: 1.5;
  max-width: 240px;
  min-width: 160px;
  text-align: center;
  opacity: 0;
  visibility: hidden;
  transition: all 0.2s ease;
  z-index: 1000;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  pointer-events: none;

  &::after {
    content: '';
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    border: 6px solid transparent;
    border-top-color: ${({ theme }) => theme.colors.textPrimary};
  }

  @media (max-width: 640px) {
    display: none;
  }
`;

const ToolCheckbox = styled.label<{ $priority: string; $isSelected: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 10px 14px;
  background: ${({ theme, $isSelected }) =>
    $isSelected ? "rgba(102, 126, 234, 0.15)" : "rgba(255, 255, 255, 0.03)"};
  border: 1px solid
    ${({ theme, $isSelected, $priority }) =>
      $isSelected
        ? "rgba(102, 126, 234, 0.5)"
        : $priority === "high"
        ? "rgba(245, 158, 11, 0.4)"
        : "rgba(255, 255, 255, 0.08)"};
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.25, 1, 0.5, 1);
  user-select: none;

  &:hover {
    background: ${({ theme, $isSelected }) =>
      $isSelected ? "rgba(102, 126, 234, 0.25)" : "rgba(255, 255, 255, 0.06)"};
    border-color: ${({ $isSelected, $priority, theme }) =>
      $isSelected
        ? "rgba(102, 126, 234, 0.8)"
        : $priority === "high"
        ? "rgba(245, 158, 11, 0.6)"
        : "rgba(255, 255, 255, 0.2)"};
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }

  &:active {
    transform: translateY(0);
  }

  input {
    display: none;
  }

  @media (max-width: 640px) {
    padding: 8px 12px;
    gap: 8px;
    border-radius: 10px;
  }
`;

const CheckIcon = styled.span<{ $isSelected: boolean }>`
  width: 16px;
  height: 16px;
  border-radius: 4px;
  border: 1.5px solid
    ${({ $isSelected }) => ($isSelected ? "var(--accent)" : "var(--border-color)")};
  background: ${({ $isSelected }) =>
    $isSelected ? "var(--accent)" : "transparent"};
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.15s ease;
  flex-shrink: 0;

  svg {
    width: 10px;
    height: 10px;
    stroke-width: 3;
    color: white;
    opacity: ${({ $isSelected }) => ($isSelected ? 1 : 0)};
  }
`;

const ToolName = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  color: ${({ theme }) => theme.colors.textPrimary};

  @media (max-width: 640px) {
    font-size: ${({ theme }) => theme.typography.fontSize.xs};
  }
`;

const ToolCategory = styled.span`
  font-size: 11px;
  color: ${({ theme }) => theme.colors.textTertiary};
  opacity: 0.8;

  @media (max-width: 640px) {
    font-size: 10px;
  }
`;


const GlobalSection = styled.div`
  background: linear-gradient(
    135deg,
    rgba(102, 126, 234, 0.1) 0%,
    rgba(118, 75, 162, 0.1) 100%
  );
  backdrop-filter: blur(40px) saturate(200%);
  -webkit-backdrop-filter: blur(40px) saturate(200%);
  border: 1px solid rgba(102, 126, 234, 0.3);
  border-radius: 20px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  box-shadow: 0 12px 40px rgba(102, 126, 234, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.1);

  @media (max-width: 640px) {
    padding: 16px;
    gap: 16px;
    border-radius: 16px;
  }
`;

const GlobalHeader = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const GlobalTitle = styled.h4`
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.textPrimary};
  margin: 0;

  @media (max-width: 640px) {
    font-size: ${({ theme }) => theme.typography.fontSize.sm};
  }
`;

const SelectedCount = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: var(--accent);
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
`;

const FooterInfo = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  color: ${({ theme }) => theme.colors.textTertiary};
  margin: 0;
  text-align: center;
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing.xl};
  gap: ${({ theme }) => theme.spacing.md};
  text-align: center;
`;


const EmptyText = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  color: ${({ theme }) => theme.colors.textSecondary};
  margin: 0;
`;

const CustomToolsSection = styled.div`
  background: rgba(15, 15, 18, 0.3);
  backdrop-filter: blur(20px);
  border: 1px dashed rgba(255, 255, 255, 0.15);
  border-radius: 20px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;

  @media (max-width: 640px) {
    padding: 16px;
    border-radius: 16px;
  }
`;

const CustomToolsHeader = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const CustomToolsTitle = styled.h4`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  color: ${({ theme }) => theme.colors.textPrimary};
  margin: 0;
`;

const InputWrapper = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const CustomToolsInput = styled.input`
  flex: 1;
  padding: 12px 16px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  background: rgba(15, 15, 18, 0.4);
  color: white;
  font-size: 14px;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: rgba(102, 126, 234, 0.6);
    background: rgba(15, 15, 18, 0.6);
    box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.15);
  }

  &::placeholder {
    color: rgba(255, 255, 255, 0.3);
  }
`;

const AddButton = styled.button<{ $visible: boolean }>`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 12px 20px;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.9) 0%, rgba(118, 75, 162, 0.9) 100%);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.25, 1, 0.5, 1);
  opacity: ${({ $visible }) => ($visible ? 1 : 0)};
  transform: ${({ $visible }) => ($visible ? 'scale(1)' : 'scale(0.95)')};
  pointer-events: ${({ $visible }) => ($visible ? 'auto' : 'none')};
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);

  &:hover {
    transform: ${({ $visible }) => ($visible ? 'scale(1) translateY(-1px)' : 'scale(0.95)')};
    box-shadow: 0 6px 16px rgba(102, 126, 234, 0.4);
    border-color: rgba(255, 255, 255, 0.2);
  }

  &:active {
    transform: scale(0.98);
  }

  svg {
    width: 16px;
    height: 16px;
  }
`;

const CustomToolsHint = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  color: ${({ theme }) => theme.colors.textTertiary};
  margin: 0;
`;

const CustomToolsList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.xs};
  margin-top: ${({ theme }) => theme.spacing.xs};
`;

const CustomToolBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 6px 12px;
  background: rgba(102, 126, 234, 0.15);
  border: 1px solid rgba(102, 126, 234, 0.4);
  border-radius: 10px;
  font-size: 13px;
  color: white;
  backdrop-filter: blur(10px);

  button {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0;
    background: none;
    border: none;
    color: rgba(255, 255, 255, 0.6);
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover {
      color: rgba(255, 255, 255, 1);
      transform: scale(1.1);
    }

    svg {
      width: 14px;
      height: 14px;
    }
  }
`;

const ModalGlassCTAButton = styled(motion.button)`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 14px 28px;
  border: 1px solid rgba(102, 126, 234, 0.4);
  border-radius: 12px;
  font-size: 15px;
  font-weight: 600;
  color: white;
  cursor: pointer;
  background: rgba(102, 126, 234, 0.15);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  box-shadow: 0 4px 16px rgba(102, 126, 234, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1);
  transition: all 0.2s ease;
  overflow: hidden;

  &:hover:not(:disabled) {
    background: rgba(102, 126, 234, 0.25);
    border-color: rgba(102, 126, 234, 0.8);
    box-shadow: 0 8px 24px rgba(102, 126, 234, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.15);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    background: rgba(255, 255, 255, 0.05);
    border-color: rgba(255, 255, 255, 0.1);
    box-shadow: none;
  }
`;

export const ToolSuggestionModal: React.FC<ToolSuggestionModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  onSkip,
  suggestions,
}) => {
  const [selectedTools, setSelectedTools] = useState<Set<string>>(new Set());
  const [customTools, setCustomTools] = useState<string[]>([]);
  const [customToolInput, setCustomToolInput] = useState("");

  // Reset selections when modal opens with new suggestions
  useEffect(() => {
    if (isOpen && suggestions) {
      setSelectedTools(new Set());
      setCustomTools([]);
      setCustomToolInput("");
    }
  }, [isOpen, suggestions]);

  const toggleTool = (toolName: string) => {
    setSelectedTools((prev) => {
      const next = new Set(prev);
      if (next.has(toolName)) {
        next.delete(toolName);
      } else {
        next.add(toolName);
      }
      return next;
    });
  };

  const handleCustomToolInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && customToolInput.trim()) {
      e.preventDefault();
      addCustomTools();
    }
  };

  const addCustomTools = () => {
    if (!customToolInput.trim()) return;

    // Parse comma-separated tools
    const newTools = customToolInput
      .split(",")
      .map((t) => t.trim())
      .filter((t) => t.length > 0)
      .filter((t) => !customTools.includes(t) && !selectedTools.has(t));

    if (newTools.length > 0) {
      setCustomTools((prev) => [...prev, ...newTools]);
    }
    setCustomToolInput("");
  };

  const removeCustomTool = (tool: string) => {
    setCustomTools((prev) => prev.filter((t) => t !== tool));
  };

  const handleConfirm = () => {
    // Combine selected suggested tools with custom tools
    const allTools = [...Array.from(selectedTools), ...customTools];
    onConfirm(allTools);
  };

  // Parse date string and extract start year/month for sorting
  const parseStartDate = (dates: string): Date => {
    // Handle formats like "Jan 2020 - Present", "2019 - 2021", "January 2020 - December 2021"
    const months: Record<string, number> = {
      jan: 0, january: 0,
      feb: 1, february: 1,
      mar: 2, march: 2,
      apr: 3, april: 3,
      may: 4,
      jun: 5, june: 5,
      jul: 6, july: 6,
      aug: 7, august: 7,
      sep: 8, september: 8,
      oct: 9, october: 9,
      nov: 10, november: 10,
      dec: 11, december: 11,
    };

    const startPart = dates.split('-')[0].trim().toLowerCase();

    // Check for "Present" or current job
    if (dates.toLowerCase().includes('present') || dates.toLowerCase().includes('current')) {
      // If it's current job, use today's date for end comparison
      // but we need start date, so parse the start part
    }

    // Try to find year
    const yearMatch = startPart.match(/\d{4}/);
    const year = yearMatch ? parseInt(yearMatch[0]) : 2000;

    // Try to find month
    let month = 0;
    for (const [key, value] of Object.entries(months)) {
      if (startPart.includes(key)) {
        month = value;
        break;
      }
    }

    return new Date(year, month, 1);
  };

  // Sort experiences by start date (most recent first)
  const sortedExperiences = suggestions?.experiences
    ? [...suggestions.experiences].sort((a, b) => {
        const dateA = parseStartDate(a.dates);
        const dateB = parseStartDate(b.dates);
        return dateB.getTime() - dateA.getTime(); // Descending (newest first)
      })
    : [];

  const totalSelectedCount = selectedTools.size + customTools.length;

  const hasNoSuggestions =
    !suggestions ||
    ((!suggestions.experiences || suggestions.experiences.length === 0) &&
      (!suggestions.globalSuggestions ||
        suggestions.globalSuggestions.length === 0));

  const renderToolCheckbox = (tool: ToolSuggestion) => {
    const isSelected = selectedTools.has(tool.name);
    return (
      <ToolCheckboxWrapper key={tool.name}>
        <ToolTooltip data-tooltip>{tool.reason}</ToolTooltip>
        <ToolCheckbox
          $priority={tool.priority}
          $isSelected={isSelected}
        >
          <input
            type="checkbox"
            checked={isSelected}
            onChange={() => toggleTool(tool.name)}
          />
          <CheckIcon $isSelected={isSelected}>
            <Check />
          </CheckIcon>
          <ToolName>{tool.name}</ToolName>
          <ToolCategory>{tool.category}</ToolCategory>
          {tool.priority === "high" && (
            <AlertCircle size={14} style={{ color: 'var(--warning-color, #f59e0b)' }} />
          )}
        </ToolCheckbox>
      </ToolCheckboxWrapper>
    );
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Enhance Your CV with Additional Tools"
      description="Select the tools you have experience with to strengthen your CV."
      size="lg"
      showCloseButton={false}
      closeOnBackdropClick={false}
      closeOnEscape={false}
    >
      <Modal.Body>
        {hasNoSuggestions ? (
          <EmptyState>
            <IconWrapper $variant="accent" style={{ width: 48, height: 48 }}>
              <Sparkles style={{ width: 24, height: 24 }} />
            </IconWrapper>
            <EmptyText>
              Your CV already contains comprehensive tool and technology information.
              You can proceed to generate your optimized CV.
            </EmptyText>
          </EmptyState>
        ) : (
          <ModalContent>
            <Description>
              Select tools you&apos;ve used. <HighlightText>Yellow borders</HighlightText> = required by job posting.
            </Description>

            {sortedExperiences.map((exp: ExperienceTools) => (
              <ExperienceSection key={exp.experienceIndex}>
                <ExperienceHeader>
                  <IconWrapper>
                    <Briefcase />
                  </IconWrapper>
                  <ExperienceInfo>
                    <ExperienceTitle>{exp.title}</ExperienceTitle>
                    <ExperienceMeta>
                      {exp.company} | {exp.dates}
                    </ExperienceMeta>
                    {exp.existingTools && exp.existingTools.length > 0 && (
                      <>
                        <ExistingToolsLabel>
                          Already in your CV:
                        </ExistingToolsLabel>
                        <ExistingTools>
                          {exp.existingTools.map((tool) => (
                            <ExistingToolBadge key={tool}>
                              {tool}
                            </ExistingToolBadge>
                          ))}
                        </ExistingTools>
                      </>
                    )}
                  </ExperienceInfo>
                </ExperienceHeader>

                <SuggestedToolsSection>
                  <SectionLabel>
                    Did you use any of these tools in this position?
                  </SectionLabel>
                  <ToolsGrid>
                    {exp.suggestedTools.map(renderToolCheckbox)}
                  </ToolsGrid>
                </SuggestedToolsSection>
              </ExperienceSection>
            ))}

            {suggestions?.globalSuggestions &&
              suggestions.globalSuggestions.length > 0 && (
                <GlobalSection>
                  <GlobalHeader>
                    <IconWrapper $variant="accent">
                      <Target />
                    </IconWrapper>
                    <GlobalTitle>Critical Tools from Job Posting</GlobalTitle>
                  </GlobalHeader>
                  <Description>
                    These tools are required in the job posting but missing from your CV.
                    If you have experience with any of them, make sure to select them.
                  </Description>
                  <ToolsGrid>
                    {suggestions.globalSuggestions.map(renderToolCheckbox)}
                  </ToolsGrid>
                </GlobalSection>
              )}

            {/* Custom Tools Input Section */}
            <CustomToolsSection>
              <CustomToolsHeader>
                <IconWrapper $variant="muted">
                  <Plus />
                </IconWrapper>
                <CustomToolsTitle>Add Other Tools</CustomToolsTitle>
              </CustomToolsHeader>
              <InputWrapper>
                <CustomToolsInput
                  type="text"
                  placeholder="Type tool names separated by commas (e.g., Figma, Notion)"
                  value={customToolInput}
                  onChange={(e) => setCustomToolInput(e.target.value)}
                  onKeyDown={handleCustomToolInputKeyDown}
                />
                <AddButton
                  type="button"
                  $visible={customToolInput.trim().length > 0}
                  onClick={addCustomTools}
                >
                  <Plus />
                  Add
                </AddButton>
              </InputWrapper>
              <CustomToolsHint>
                Press Enter or click Add button
              </CustomToolsHint>
              {customTools.length > 0 && (
                <CustomToolsList>
                  {customTools.map((tool) => (
                    <CustomToolBadge key={tool}>
                      {tool}
                      <button
                        type="button"
                        onClick={() => removeCustomTool(tool)}
                        aria-label={`Remove ${tool}`}
                      >
                        <X size={14} />
                      </button>
                    </CustomToolBadge>
                  ))}
                </CustomToolsList>
              )}
            </CustomToolsSection>

            {totalSelectedCount > 0 && (
              <SelectedCount>
                {totalSelectedCount} tool{totalSelectedCount > 1 ? 's' : ''} selected
              </SelectedCount>
            )}

            <FooterInfo>
              Selected tools will be added to your CV appropriately and will help
              improve your ATS score.
            </FooterInfo>
          </ModalContent>
        )}
      </Modal.Body>

      <Modal.Footer>
        <Button variant="ghost" onClick={onSkip}>
          {hasNoSuggestions ? "Continue" : "I didn't use any of these"}
        </Button>
        {!hasNoSuggestions && (
          <ModalGlassCTAButton
            onClick={handleConfirm}
            disabled={totalSelectedCount === 0}
            whileHover={totalSelectedCount > 0 ? { scale: 1.02, y: -2 } : {}}
            whileTap={totalSelectedCount > 0 ? { scale: 0.98, y: 0 } : {}}
          >
            Add Selected Tools ({totalSelectedCount})
          </ModalGlassCTAButton>
        )}
      </Modal.Footer>
    </Modal>
  );
};
