"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import styled from "styled-components";
import { Modal } from "@/components/ui/Modal";
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
  gap: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.md};
  border-radius: 12px;
  position: relative;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  
  /* Liquid Glass Base */
  background: ${({ $selected }) =>
    $selected 
      ? 'linear-gradient(135deg, rgba(var(--accent-rgb), 0.15), rgba(var(--accent-rgb), 0.05))' 
      : 'rgba(255, 255, 255, 0.03)'};
  border: 1px solid ${({ $selected }) =>
    $selected ? 'rgba(var(--accent-rgb), 0.4)' : 'rgba(255, 255, 255, 0.06)'};
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);

  /* Subtle border glow and shadow for selected state */
  box-shadow: ${({ $selected }) =>
    $selected 
      ? '0 8px 32px rgba(var(--accent-rgb), 0.12), inset 0 1px 1px rgba(255, 255, 255, 0.2)' 
      : 'inset 0 1px 1px rgba(255, 255, 255, 0.05)'};

  &:hover {
    transform: translateY(-2px);
    background: ${({ $selected }) =>
      $selected 
        ? 'linear-gradient(135deg, rgba(var(--accent-rgb), 0.2), rgba(var(--accent-rgb), 0.08))' 
        : 'rgba(255, 255, 255, 0.06)'};
    border-color: ${({ $selected }) =>
      $selected ? 'rgba(var(--accent-rgb), 0.6)' : 'rgba(255, 255, 255, 0.15)'};
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1), inset 0 1px 1px rgba(255, 255, 255, 0.1);
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
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  
  /* Liquid Glass Base */
  background: ${({ $selected }) =>
    $selected 
      ? 'linear-gradient(90deg, rgba(var(--accent-rgb), 0.12), rgba(var(--accent-rgb), 0.03))' 
      : 'rgba(255, 255, 255, 0.02)'};
  border: 1px solid ${({ $selected }) =>
    $selected ? 'rgba(var(--accent-rgb), 0.3)' : 'transparent'};
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);

  /* Subtle border glow and shadow for selected state */
  box-shadow: ${({ $selected }) =>
    $selected 
      ? '0 4px 16px rgba(var(--accent-rgb), 0.08), inset 0 1px 1px rgba(255, 255, 255, 0.1)' 
      : 'none'};

  &:hover {
    transform: translateX(4px);
    background: ${({ $selected }) =>
      $selected 
        ? 'linear-gradient(90deg, rgba(var(--accent-rgb), 0.15), rgba(var(--accent-rgb), 0.05))' 
        : 'rgba(255, 255, 255, 0.05)'};
    border-color: ${({ $selected }) =>
      $selected ? 'rgba(var(--accent-rgb), 0.5)' : 'rgba(255, 255, 255, 0.1)'};
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

const TwoColumnGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 24px;
  padding: 8px 4px;

  @media (min-width: 900px) {
    grid-template-columns: 5fr 3fr;
    align-items: flex-start;
  }
`;

const EditorColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  height: 100%;
`;

const InsightsColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  position: sticky;
  top: 0;
`;

const EditorContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  position: relative;
`;

const ParagraphsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const ParagraphCard = styled.div`
  padding: 18px 24px;
  border-radius: 16px;
  position: relative;
  overflow: hidden;
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  
  /* Liquid Glass Base */
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.04), rgba(255, 255, 255, 0.01));
  border: 1px solid rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.05);

  &:hover {
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.06), rgba(255, 255, 255, 0.02));
    border-color: rgba(255, 255, 255, 0.2);
    transform: translateY(-2px);
    box-shadow: 0 12px 32px rgba(0, 0, 0, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.1);
  }
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
  margin-top: 10px;
  line-height: 1.8;
  color: rgba(255, 255, 255, 0.9);
`;

const Sentence = styled.span<{ $isHighlight: boolean; $isSelected: boolean }>`
  cursor: pointer;
  padding: 4px 6px;
  margin: 0 -2px;
  border-radius: 6px;
  font-size: 13.5px;
  text-decoration: none;
  display: inline-block;
  
  /* Liquid Glass Highlight */
  background: ${({ $isHighlight, $isSelected }) =>
    $isSelected 
      ? 'linear-gradient(135deg, rgba(var(--accent-rgb), 0.2), rgba(var(--accent-rgb), 0.1))' 
      : $isHighlight 
        ? 'rgba(255, 255, 255, 0.05)' 
        : 'transparent'};
  
  color: ${({ $isHighlight, $isSelected }) =>
    $isSelected || $isHighlight ? 'var(--accent)' : 'inherit'};
    
  border: 1px solid ${({ $isSelected }) =>
    $isSelected ? 'rgba(var(--accent-rgb), 0.4)' : 'transparent'};
    
  box-shadow: ${({ $isSelected }) => 
    $isSelected ? '0 0 12px rgba(var(--accent-rgb), 0.2), inset 0 1px 1px rgba(255, 255, 255, 0.2)' : 'none'};
    
  backdrop-filter: ${({ $isSelected }) => $isSelected ? 'blur(4px)' : 'none'};
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);

  &:hover {
    background: linear-gradient(135deg, rgba(var(--accent-rgb), 0.25), rgba(var(--accent-rgb), 0.1));
    color: var(--accent);
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(var(--accent-rgb), 0.15), inset 0 1px 1px rgba(255, 255, 255, 0.2);
    border-color: rgba(var(--accent-rgb), 0.5);
  }
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
    from {
      opacity: 0;
      transform: scale(0.95) translateY(-8px);
    }
    to {
      opacity: 1;
      transform: scale(1) translateY(0);
    }
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
  color: rgba(255, 255, 255, 0.9);
  transition: all 150ms ease;
  margin-bottom: 2px;

  &:hover {
    background: rgba(255, 255, 255, 0.06);
    transform: translateX(2px);
  }

  ${({ $isSelected }) =>
    $isSelected &&
    `
    background: rgba(var(--accent-rgb), 0.1);
    color: var(--accent);
    font-weight: 500;
    
    &:hover {
      background: rgba(var(--accent-rgb), 0.15);
    }
  `}
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

const RationalePanel = styled.div`
  padding: 16px 20px;
  border: 1px solid rgba(var(--accent-rgb), 0.2);
  background: linear-gradient(180deg, rgba(var(--accent-rgb), 0.05) 0%, rgba(var(--accent-rgb), 0.02) 100%);
  border-radius: 16px;
  height: 100%;
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  box-shadow: inset 0 1px 1px rgba(255, 255, 255, 0.1), 0 4px 16px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
`;

const RationaleTitle = styled.div`
  font-size: 12.5px;
  font-weight: 600;
  color: var(--accent);
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  gap: 6px;

  svg {
    width: 14px;
    height: 14px;
  }
`;

const RationaleContent = styled.div`
  font-size: 13px;
  color: rgba(255, 255, 255, 0.85);
  line-height: 1.6;
`;

const RationaleEmpty = styled.div`
  font-size: 12px;
  color: rgba(255, 255, 255, 0.5);
  font-style: italic;
  display: flex;
  align-items: center;
  gap: 6px;
`;

// Accordion for Key Highlights
const AccordionWrapper = styled.div`
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.03) 0%, rgba(255, 255, 255, 0.01) 100%);
  border-radius: 16px;
  padding: 0 20px;
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  box-shadow: inset 0 1px 1px rgba(255, 255, 255, 0.05), 0 4px 16px rgba(0, 0, 0, 0.1);
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
    strokeWidth={2}
    stroke="currentColor"
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
  </svg>
);

const ActionButtonsWrapper = styled.div`
  display: flex;
  gap: 12px;
  margin-left: auto; /* Push buttons to the right */
`;

const GlassButton = styled.button<{ $variant?: 'primary' | 'secondary' | 'ghost', $size?: 'sm' | 'md' }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  white-space: nowrap;
  border-radius: 10px;
  font-weight: 600;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  cursor: pointer;
  
  /* Size */
  ${({ $size = 'md' }) => 
    $size === 'sm' 
      ? 'padding: 8px 16px; font-size: 13px;'
      : 'padding: 10px 20px; font-size: 14px;'
  }

  /* Variants */
  ${({ $variant = 'secondary' }) => {
    switch ($variant) {
      case 'primary':
        return `
          background: linear-gradient(135deg, rgba(var(--accent-rgb), 0.8), rgba(var(--accent-rgb), 0.6));
          border: 1px solid rgba(255, 255, 255, 0.2);
          color: #ffffff;
          box-shadow: 0 4px 12px rgba(var(--accent-rgb), 0.3), inset 0 1px 1px rgba(255, 255, 255, 0.4);
          
          &:hover {
            background: linear-gradient(135deg, rgba(var(--accent-rgb), 0.9), rgba(var(--accent-rgb), 0.7));
            transform: translateY(-1px);
            box-shadow: 0 6px 16px rgba(var(--accent-rgb), 0.4), inset 0 1px 1px rgba(255, 255, 255, 0.5);
          }
        `;
      case 'ghost':
        return `
          background: transparent;
          border: 1px solid transparent;
          color: rgba(255, 255, 255, 0.6);
          box-shadow: none;
          
          &:hover {
            color: rgba(255, 255, 255, 0.9);
            background: rgba(255, 255, 255, 0.05);
            border-color: rgba(255, 255, 255, 0.08);
          }
        `;
      case 'secondary':
      default:
        return `
          background: linear-gradient(180deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.03) 100%);
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1), inset 0 1px 1px rgba(255, 255, 255, 0.1);
          
          &:hover {
            background: linear-gradient(180deg, rgba(255, 255, 255, 0.12) 0%, rgba(255, 255, 255, 0.06) 100%);
            border-color: rgba(255, 255, 255, 0.2);
            transform: translateY(-1px);
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15), inset 0 1px 1px rgba(255, 255, 255, 0.2);
          }
        `;
    }
  }}

  &:active {
    transform: translateY(1px);
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

      {/* Modal - Editor/Viewer */}
      <Modal
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
      >
        <Modal.Body>
          {generatedLetter && (
            <GeneratorContent style={{ padding: '0 20px 20px' }}>
              {generatedLetter.paragraphs && generatedLetter.paragraphs.length > 0 ? (
                <TwoColumnGrid>
                  {/* Left Column: The Application Letter */}
                  <EditorColumn>
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
                  </EditorColumn>

                  {/* Right Column: Insights & Rationale */}
                  <InsightsColumn>
                    {generatedLetter.paragraphs && generatedLetter.paragraphs.length > 0 && (
                      <RationalePanel>
                        <RationaleTitle>
                          <LightbulbIcon /> Why This Content?
                        </RationaleTitle>
                        {activeParagraph ? (
                          <RationaleContent>
                            <strong style={{ display: 'block', marginBottom: '8px', fontSize: '12px' }}>
                              {activeParagraph.type.replace('_', ' ').toUpperCase()}:
                            </strong>
                            {activeParagraph.rationale}
                          </RationaleContent>
                        ) : (
                          <RationaleEmpty>
                            Hover over a paragraph to see why it was included. AI adapts styling of thoughts accordingly.
                          </RationaleEmpty>
                        )}
                      </RationalePanel>
                    )}

                    {generatedLetter.keyHighlights && generatedLetter.keyHighlights.length > 0 && (
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
                    )}
                  </InsightsColumn>
                </TwoColumnGrid>
              ) : (
                <div style={{
                  padding: '24px',
                  background: 'rgba(255,255,255,0.02)',
                  border: '1px solid rgba(255,255,255,0.05)',
                  borderRadius: '16px',
                  whiteSpace: 'pre-wrap',
                  lineHeight: '1.8',
                  maxHeight: '600px',
                  overflowY: 'auto'
                }}>
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
        </Modal.Body>
        <Modal.Footer>
          <ActionButtonsWrapper>
            <GlassButton onClick={handleCopy} $variant="primary" $size="sm">
              <CopyIcon /> Copy
            </GlassButton>
            <GlassButton onClick={handleDownload} $variant="secondary" $size="sm">
              <DownloadIcon /> Download
            </GlassButton>
            {!existingLetter && (
              <GlassButton
                onClick={() => {
                  setIsEditorSheetOpen(false);
                  setGeneratedLetter(null);
                }}
                $variant="ghost"
                $size="sm"
              >
                <RefreshIcon size={16} /> New
              </GlassButton>
            )}
          </ActionButtonsWrapper>
        </Modal.Footer>
      </Modal>
    </>
  );
}
