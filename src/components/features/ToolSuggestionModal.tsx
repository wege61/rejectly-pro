"use client";

import styled from "styled-components";
import { useState, useEffect } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
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
  gap: ${({ theme }) => theme.spacing.lg};
`;

const Description = styled.p`
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  line-height: 1.6;
  margin: 0;
`;

const ExperienceSection = styled.div`
  background: ${({ theme }) => theme.colors.surfaceHover};
  border-radius: ${({ theme }) => theme.radius.lg};
  padding: ${({ theme }) => theme.spacing.lg};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
`;

const ExperienceHeader = styled.div`
  display: flex;
  align-items: flex-start;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const ExperienceIcon = styled.span`
  font-size: 1.25rem;
  line-height: 1;
`;

const ExperienceInfo = styled.div`
  flex: 1;
`;

const ExperienceTitle = styled.h4`
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.textPrimary};
  margin: 0 0 ${({ theme }) => theme.spacing.xs} 0;
`;

const ExperienceMeta = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
  margin: 0;
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
`;

const ToolCheckbox = styled.label<{ $priority: string; $isSelected: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  background: ${({ theme, $isSelected }) =>
    $isSelected ? "var(--accent-light, rgba(99, 102, 241, 0.1))" : theme.colors.surface};
  border: 1px solid
    ${({ theme, $isSelected, $priority }) =>
      $isSelected
        ? "var(--accent)"
        : $priority === "high"
        ? theme.colors.warning
        : theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.md};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};
  user-select: none;

  &:hover {
    background: ${({ theme, $isSelected }) =>
      $isSelected ? "var(--accent-light, rgba(99, 102, 241, 0.15))" : theme.colors.surfaceHover};
    border-color: ${({ $isSelected }) =>
      $isSelected ? "var(--accent)" : "var(--accent-light, rgba(99, 102, 241, 0.5))"};
  }

  input {
    display: none;
  }
`;

const CheckIcon = styled.span<{ $isSelected: boolean }>`
  width: 18px;
  height: 18px;
  border-radius: ${({ theme }) => theme.radius.sm};
  border: 2px solid
    ${({ $isSelected }) => ($isSelected ? "var(--accent)" : "var(--border-color)")};
  background: ${({ $isSelected }) =>
    $isSelected ? "var(--accent)" : "transparent"};
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all ${({ theme }) => theme.transitions.fast};
  flex-shrink: 0;

  svg {
    width: 12px;
    height: 12px;
    color: white;
    opacity: ${({ $isSelected }) => ($isSelected ? 1 : 0)};
  }
`;

const ToolName = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const ToolCategory = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  color: ${({ theme }) => theme.colors.textTertiary};
`;

const PriorityBadge = styled.span<{ $priority: string }>`
  font-size: 10px;
  padding: 2px 6px;
  border-radius: ${({ theme }) => theme.radius.sm};
  background: ${({ $priority }) =>
    $priority === "high"
      ? "rgba(245, 158, 11, 0.15)"
      : $priority === "medium"
      ? "rgba(99, 102, 241, 0.1)"
      : "rgba(107, 114, 128, 0.1)"};
  color: ${({ $priority, theme }) =>
    $priority === "high"
      ? theme.colors.warning
      : $priority === "medium"
      ? "var(--accent)"
      : theme.colors.textTertiary};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
`;

const GlobalSection = styled.div`
  background: linear-gradient(
    135deg,
    rgba(99, 102, 241, 0.05) 0%,
    rgba(139, 92, 246, 0.05) 100%
  );
  border: 1px solid rgba(99, 102, 241, 0.2);
  border-radius: ${({ theme }) => theme.radius.lg};
  padding: ${({ theme }) => theme.spacing.lg};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
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

const EmptyIcon = styled.span`
  font-size: 3rem;
`;

const EmptyText = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  color: ${({ theme }) => theme.colors.textSecondary};
  margin: 0;
`;

const CustomToolsSection = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px dashed ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.lg};
  padding: ${({ theme }) => theme.spacing.lg};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
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

const CustomToolsInput = styled.input`
  width: 100%;
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.textPrimary};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  transition: all ${({ theme }) => theme.transitions.fast};

  &:focus {
    outline: none;
    border-color: var(--accent);
    box-shadow: 0 0 0 3px var(--accent-light, rgba(99, 102, 241, 0.1));
  }

  &::placeholder {
    color: ${({ theme }) => theme.colors.textTertiary};
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
  gap: ${({ theme }) => theme.spacing.xs};
  padding: 4px 10px;
  background: var(--accent-light, rgba(99, 102, 241, 0.1));
  border: 1px solid var(--accent);
  border-radius: ${({ theme }) => theme.radius.md};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: var(--accent);

  button {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0;
    background: none;
    border: none;
    color: var(--accent);
    cursor: pointer;
    opacity: 0.7;
    transition: opacity ${({ theme }) => theme.transitions.fast};

    &:hover {
      opacity: 1;
    }

    svg {
      width: 14px;
      height: 14px;
    }
  }
`;

const CheckIconSvg = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3}>
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const CloseIconSvg = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
    <path d="M18 6L6 18M6 6l12 12" />
  </svg>
);

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

  const totalSelectedCount = selectedTools.size + customTools.length;

  const hasNoSuggestions =
    !suggestions ||
    ((!suggestions.experiences || suggestions.experiences.length === 0) &&
      (!suggestions.globalSuggestions ||
        suggestions.globalSuggestions.length === 0));

  const renderToolCheckbox = (tool: ToolSuggestion) => {
    const isSelected = selectedTools.has(tool.name);
    return (
      <ToolCheckbox
        key={tool.name}
        $priority={tool.priority}
        $isSelected={isSelected}
        title={tool.reason}
      >
        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => toggleTool(tool.name)}
        />
        <CheckIcon $isSelected={isSelected}>
          <CheckIconSvg />
        </CheckIcon>
        <ToolName>{tool.name}</ToolName>
        <ToolCategory>({tool.category})</ToolCategory>
        {tool.priority === "high" && (
          <PriorityBadge $priority={tool.priority}>Critical</PriorityBadge>
        )}
      </ToolCheckbox>
    );
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Enhance Your CV with Additional Tools"
      description="Select the tools you have experience with to strengthen your CV."
      size="lg"
    >
      <Modal.Body>
        {hasNoSuggestions ? (
          <EmptyState>
            <EmptyIcon>✨</EmptyIcon>
            <EmptyText>
              Your CV already contains comprehensive tool and technology information.
              You can proceed to generate your optimized CV.
            </EmptyText>
          </EmptyState>
        ) : (
          <ModalContent>
            <Description>
              Based on the job posting and your industry, we&apos;ve identified tools
              you may have used in your previous positions. Select the ones you have
              experience with to add them to your CV.
              <strong> Tools with yellow borders</strong> are required in the job posting
              but missing from your CV.
            </Description>

            {suggestions?.experiences?.map((exp: ExperienceTools) => (
              <ExperienceSection key={exp.experienceIndex}>
                <ExperienceHeader>
                  <ExperienceIcon>💼</ExperienceIcon>
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
                    <ExperienceIcon>🎯</ExperienceIcon>
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
                <ExperienceIcon>➕</ExperienceIcon>
                <CustomToolsTitle>Add Other Tools</CustomToolsTitle>
              </CustomToolsHeader>
              <CustomToolsInput
                type="text"
                placeholder="Type tool names separated by commas (e.g., Figma, Notion, Slack)"
                value={customToolInput}
                onChange={(e) => setCustomToolInput(e.target.value)}
                onKeyDown={handleCustomToolInputKeyDown}
                onBlur={addCustomTools}
              />
              <CustomToolsHint>
                Press Enter or click outside to add tools not listed above
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
                        <CloseIconSvg />
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
          <Button
            variant="primary"
            onClick={handleConfirm}
            disabled={totalSelectedCount === 0}
          >
            Add Selected Tools ({totalSelectedCount})
          </Button>
        )}
      </Modal.Footer>
    </Modal>
  );
};
