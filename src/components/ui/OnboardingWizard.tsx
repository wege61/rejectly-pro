"use client";

import styled from "styled-components";
import { useState, useCallback, useEffect } from "react";
import { Modal } from "./Modal";
import { Button } from "./Button";
import { Spinner } from "./Spinner";
import { AnalysisProgress } from "./AnalysisProgress";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useToast } from "@/contexts/ToastContext";
import { motion, AnimatePresence } from "framer-motion";

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 400 : -400,
    opacity: 0,
    position: "absolute" as const,
  }),
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1,
    position: "relative" as const,
  },
  exit: (direction: number) => ({
    zIndex: 0,
    x: direction < 0 ? 400 : -400,
    opacity: 0,
    position: "absolute" as const,
  }),
};

// Icons
const DocumentIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={2}
    stroke="currentColor"
    style={{ width: '20px', height: '20px', display: 'inline-block', verticalAlign: 'middle' }}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
    />
  </svg>
);

const UploadArrowIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={2}
    stroke="currentColor"
    style={{ width: '48px', height: '48px', display: 'inline-block', verticalAlign: 'middle' }}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
    />
  </svg>
);

const BriefcaseIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={2}
    stroke="currentColor"
    style={{ width: '20px', height: '20px', display: 'inline-block', verticalAlign: 'middle' }}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0M12 12.75h.008v.008H12v-.008z"
    />
  </svg>
);

const TargetIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={2}
    stroke="currentColor"
    style={{ width: '20px', height: '20px', display: 'inline-block', verticalAlign: 'middle' }}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);

const SparklesIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={2}
    stroke="currentColor"
    style={{ width: '20px', height: '20px', display: 'inline-block', verticalAlign: 'middle' }}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z"
    />
  </svg>
);

const EditIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={2}
    stroke="currentColor"
    style={{ width: '20px', height: '20px', display: 'inline-block', verticalAlign: 'middle' }}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
    />
  </svg>
);

const CloseIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={2}
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M6 18L18 6M6 6l12 12"
    />
  </svg>
);

const EyeIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
    />
  </svg>
);

const WizardContainer = styled.div<{ $isPreview?: boolean }>`
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: ${({ $isPreview }) => $isPreview ? '85vh' : '480px'};
  width: 100%;
  padding: 24px;
  position: relative;
  overflow: hidden;

  @media (max-width: 640px) {
    height: 100%;
    min-height: auto;
    border-radius: inherit;
    padding: 24px 20px;
    padding-bottom: calc(env(safe-area-inset-bottom, 20px) + 20px);
  }
`;

const WizardHeader = styled.div`
  position: absolute;
  top: 24px;
  right: 24px;
  z-index: 10;
  
  @media (max-width: 640px) {
    top: 20px;
    right: 20px;
  }
`;

const ProgressBar = styled.div`
  flex: 1;
  height: 4px;
  background-color: ${({ theme }) => theme.colors.border};
  border-radius: 999px;
  overflow: hidden;
`;

const WizardCloseButton = styled.button`
  width: 40px;
  height: 40px;
  border-radius: ${({ theme }) => theme.radius.full};
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(255, 255, 255, 0.7);
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  flex-shrink: 0;

  &:hover {
    background-color: rgba(255, 255, 255, 0.15);
    color: rgba(255, 255, 255, 1);
    transform: translateY(-1px);
  }

  svg {
    width: 20px;
    height: 20px;
  }
`;

const ProgressFill = styled.div<{ $progress: number }>`
  width: ${({ $progress }) => $progress}%;
  height: 100%;
  background: var(--gradient-primary);
  border-radius: 999px;
  transition: width 0.3s ease;
`;

const StepHeader = styled.div`
  text-align: center;
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  flex-shrink: 0;
`;

const StepTitle = styled.h2`
  font-size: ${({ theme }) => theme.typography.fontSize["2xl"]};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const StepDescription = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const StepContent = styled.div`
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  display: flex;
  flex-direction: column;

  /* Hidden scrollbar */
  scrollbar-width: none;
  -ms-overflow-style: none;
  &::-webkit-scrollbar {
    display: none;
  }
`;

const UploadArea = styled.div<{ $isDragging: boolean }>`
  border: 2px dashed ${({ theme, $isDragging }) =>
    $isDragging ? theme.colors.primary : 'rgba(255, 255, 255, 0.15)'};
  border-radius: ${({ theme }) => theme.radius.xl};
  padding: ${({ theme }) => `${theme.spacing["2xl"]} ${theme.spacing.xl}`};
  text-align: center;
  background-color: ${({ theme, $isDragging }) =>
    $isDragging ? 'rgba(var(--primary-rgb), 0.15)' : 'rgba(255, 255, 255, 0.03)'};
  backdrop-filter: blur(30px) saturate(150%);
  -webkit-backdrop-filter: blur(30px) saturate(150%);
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  min-height: 280px;
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
    background-color: rgba(var(--primary-rgb), 0.08);
    transform: translateY(-2px);
    box-shadow: 0 16px 32px -12px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1);
  }

  @media (max-width: 640px) {
    min-height: 200px;
    padding: ${({ theme }) => theme.spacing.xl};
  }
`;

const SegmentControl = styled.div`
  display: flex;
  background: rgba(255, 255, 255, 0.04);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: ${({ theme }) => theme.radius.lg};
  padding: 4px;
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  flex-shrink: 0;
  box-shadow: inset 0 2px 4px rgba(0,0,0,0.2);
`;

const SegmentButton = styled.button<{ $active?: boolean }>`
  flex: 1;
  padding: 8px 16px;
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ $active }) => $active ? 'rgba(255, 255, 255, 0.1)' : 'transparent'};
  color: ${({ $active, theme }) => $active ? theme.colors.textPrimary : theme.colors.textSecondary};
  font-weight: ${({ $active }) => $active ? 600 : 500};
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
  border: none;
  cursor: pointer;
  box-shadow: ${({ $active }) => $active ? '0 4px 12px rgba(0, 0, 0, 0.15)' : 'none'};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  
  &:hover {
    color: ${({ theme }) => theme.colors.textPrimary};
  }
`;

const SlideContainer = styled(motion.div)`
  flex: 1;
  min-height: 0;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const UploadIcon = styled.div`
  font-size: 48px;
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const UploadText = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const JobForm = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
`;

const Input = styled.input`
  width: 100%;
  padding: ${({ theme }) => theme.spacing.md};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.md};
  background-color: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.textPrimary};
  font-size: ${({ theme }) => theme.typography.fontSize.base};

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const Textarea = styled.textarea`
  width: 100%;
  min-height: 200px;
  padding: ${({ theme }) => theme.spacing.md};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.md};
  background-color: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.textPrimary};
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  resize: vertical;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const CharCount = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
  text-align: right;
`;

const PreviewPanel = styled.div`
  margin-top: ${({ theme }) => theme.spacing.xl};
  padding: ${({ theme }) => theme.spacing.lg};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.lg};
  background-color: ${({ theme }) => theme.colors.background};
`;

const PreviewSection = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.md};

  &:last-child {
    margin-bottom: 0;
  }
`;

const PreviewTitle = styled.h4`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
  text-transform: uppercase;
`;

const EditablePreview = styled.textarea`
  width: 100%;
  min-height: 120px;
  padding: ${({ theme }) => theme.spacing.md};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.md};
  background-color: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.textPrimary};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  line-height: ${({ theme }) => theme.typography.lineHeight.relaxed};
  resize: vertical;
  font-family: ${({ theme }) => theme.typography.fontFamily.sans};
  transition: all ${({ theme }) => theme.transitions.fast};

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    background-color: ${({ theme }) => theme.colors.background};
  }
  
  &::placeholder {
    color: ${({ theme }) => theme.colors.textTertiary};
  }
`;


const WizardActions = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.md};
  padding-top: ${({ theme }) => theme.spacing.lg};
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  flex-shrink: 0;
  margin-top: 0;

  & > button {
    min-width: 140px;
  }

  @media (max-width: 640px) {
    gap: ${({ theme }) => theme.spacing.sm};
    
    & > button {
      min-width: 0;
      flex: 1;
    }
  }
`;

const SelectionList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const CompactJobList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  padding-right: ${({ theme }) => theme.spacing.xs};
  padding-bottom: ${({ theme }) => theme.spacing.md};

  /* Hide scrollbar */
  scrollbar-width: none;
  -ms-overflow-style: none;
  &::-webkit-scrollbar {
    display: none;
  }
`;

const CompactJobCard = styled.div<{ $selected?: boolean }>`
  padding: ${({ theme }) => theme.spacing.md};
  border: 1px solid ${({ theme, $selected }) =>
    $selected ? theme.colors.primary : 'rgba(255, 255, 255, 0.12)'};
  border-radius: ${({ theme }) => theme.radius.lg};
  background-color: ${({ theme, $selected }) =>
    $selected ? 'rgba(var(--primary-rgb), 0.15)' : 'rgba(255, 255, 255, 0.04)'};
  backdrop-filter: blur(20px) saturate(150%);
  -webkit-backdrop-filter: blur(20px) saturate(150%);
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  position: relative;
  box-shadow: ${({ $selected }) => 
    $selected ? '0 8px 24px -8px rgba(var(--primary-rgb), 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.2)' : '0 4px 12px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255, 255, 255, 0.08)'};

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
    background-color: rgba(var(--primary-rgb), 0.08);
    transform: translateY(-2px);
    box-shadow: 0 12px 28px -10px rgba(var(--primary-rgb), 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.15);
  }

  ${({ $selected, theme }) => $selected && `
    &::before {
      content: '✓';
      position: absolute;
      top: ${theme.spacing.sm};
      right: ${theme.spacing.sm};
      width: 20px;
      height: 20px;
      background: ${theme.colors.primary};
      color: white;
      border-radius: ${theme.radius.full};
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: ${theme.typography.fontSize.xs};
      font-weight: ${theme.typography.fontWeight.bold};
    }
  `}
`;

const CompactJobTitle = styled.h4`
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.textPrimary};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

const CompactJobMeta = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const ReplaceButton = styled(Button)`
  margin-top: ${({ theme }) => theme.spacing.md};
`;

const CVOptionWrapper = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const ExistingCVCard = styled.div`
  padding: ${({ theme }) => theme.spacing.md};
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: ${({ theme }) => theme.radius.lg};
  background: rgba(255, 255, 255, 0.04);
  backdrop-filter: blur(40px) saturate(150%);
  -webkit-backdrop-filter: blur(40px) saturate(150%);
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  box-shadow: 0 4px 12px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255, 255, 255, 0.08);

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
    background: rgba(var(--primary-rgb), 0.08);
    transform: translateY(-2px);
    box-shadow: 0 12px 28px -10px rgba(var(--primary-rgb), 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.15);
  }
`;

const CVIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: ${({ theme }) => theme.radius.md};
  background: rgba(var(--primary-rgb), 0.15);
  color: ${({ theme }) => theme.colors.primary};
  flex-shrink: 0;

  svg {
    width: 20px;
    height: 20px;
  }
`;

const CVTextContent = styled.div`
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const CVTitle = styled.h4`
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.textPrimary};
  margin-bottom: 2px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const CVSubtitle = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const PreviewButton = styled.button`
  background: transparent;
  border: none;
  color: ${({ theme }) => theme.colors.textSecondary};
  cursor: pointer;
  padding: 8px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  flex-shrink: 0;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
    color: ${({ theme }) => theme.colors.textPrimary};
  }

  svg {
    width: 20px;
    height: 20px;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
  justify-content: center;
`;

const CVOptionsContainer = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  align-items: stretch;

  @media (max-width: 600px) {
    flex-direction: column;
    gap: 0!important;
  }
`;

const DividerText = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  padding: 0 ${({ theme }) => theme.spacing.sm};
  position: relative;

  &::before,
  &::after {
    content: '';
    flex: 1;
    height: 1px;
    background: ${({ theme }) => theme.colors.border};
  }

  &::before {
    margin-right: ${({ theme }) => theme.spacing.sm};
  }

  &::after {
    margin-left: ${({ theme }) => theme.spacing.sm};
  }

  @media (max-width: 600px) {
    margin: ${({ theme }) => theme.spacing.lg} 0;

    &::before,
    &::after {
      display: none;
    }
  }
`;

const FormLabel = styled.label`
  display: block;
  margin-bottom: ${({ theme }) => theme.spacing.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const SectionHeading = styled.h3`
  margin-bottom: ${({ theme }) => theme.spacing.md};
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const CardTitle = styled.div`
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  color: ${({ theme }) => theme.colors.textPrimary};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

const CardSubtitle = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const LoadingContainer = styled.div`
  text-align: center;
  padding: 0;
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const LoadingTitle = styled.p`
  margin-top: ${({ theme }) => theme.spacing.xl};
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const LoadingSubtitle = styled.p`
  margin-top: ${({ theme }) => theme.spacing.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
`;

const UploadHint = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.textTertiary};
  margin-top: ${({ theme }) => theme.spacing.xs};
`;


// Type definitions
interface DocumentType {
  id: string;
  title: string;
  text?: string;
  user_id?: string;
  type?: string;
  created_at?: string;
  file_url?: string;
}

interface AnalysisResultType {
  id: string;
  fitScore: number;
  summary: string;
  missingKeywords: string[];
}

interface OnboardingWizardProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
  triggerRect?: DOMRect | null;
}

const WIZARD_STORAGE_KEY = "rejectly_wizard_state";

type TabState = "new" | "existing";

export function OnboardingWizard({
  isOpen,
  onClose,
  onComplete,
  triggerRect,
}: OnboardingWizardProps) {
  const router = useRouter();
  const toast = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [direction, setDirection] = useState(1);

  const changeStep = (newStep: number) => {
    setDirection(newStep > currentStep ? 1 : -1);
    setCurrentStep(newStep);
  };
  const [isLoading, setIsLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [hasExistingCV, setHasExistingCV] = useState(false);
  const [hasExistingJob, setHasExistingJob] = useState(false);

  // Step 1: CV Upload
  const [uploadedCV, setUploadedCV] = useState<DocumentType | null>(null);
  const [cvText, setCvText] = useState("");

  // Step 2: Job Posting
  const [jobTitle, setJobTitle] = useState("");
  const [jobDetails, setJobDetails] = useState("");
  const [savedJob, setSavedJob] = useState<DocumentType | null>(null);

  // Segment Types
  const [activeCvTab, setActiveCvTab] = useState<TabState>("new");
  const [activeJobTab, setActiveJobTab] = useState<TabState>("new");

  // Step 3: Analysis
  const [selectedCV, setSelectedCV] = useState<string | null>(null);
  const [selectedJob, setSelectedJob] = useState<string | null>(null);
  const [cvList, setCvList] = useState<DocumentType[]>([]);
  const [jobList, setJobList] = useState<DocumentType[]>([]);
  const [analysisProgressStep, setAnalysisProgressStep] = useState<number>(0);

  // Step 4: Result Summary
  const [analysisResult, setAnalysisResult] = useState<AnalysisResultType | null>(null);

  // Preview State
  const [previewDocument, setPreviewDocument] = useState<{ title: string, url: string, isPdf: boolean } | null>(null);
  const [isPreviewLoading, setIsPreviewLoading] = useState(false);

  // Total steps is 2 (CV -> Job -> Analysis Loader -> Redirect)
  const totalSteps = 2;
  const progress = (currentStep / totalSteps) * 100;

  // Reset wizard state when modal first opens (unless continuing from saved state)
  useEffect(() => {
    if (isOpen) {
      const savedState = localStorage.getItem(WIZARD_STORAGE_KEY);
      if (!savedState) {
        // Fresh start - reset everything
        changeStep(1);
        setIsLoading(false);
        setIsDragging(false);
      }
    }
  }, [isOpen]);

  // Check if user has existing CV and Job when modal opens
  useEffect(() => {
    async function checkExistingDocuments() {
      if (!isOpen) return;

      // Reset to step 1 when modal opens (unless we have saved state)
      const savedState = localStorage.getItem(WIZARD_STORAGE_KEY);
      if (!savedState) {
        changeStep(1);
      }

      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) return;

        // Check for existing CV
        const { data: cvData } = await supabase
          .from("documents")
          .select("*")
          .eq("user_id", user.id)
          .eq("type", "cv")
          .order("created_at", { ascending: false })
          .limit(1)
          .maybeSingle();

        if (cvData) {
          setHasExistingCV(true);
          setUploadedCV(cvData);
          setCvText(cvData.text || "");
          setActiveCvTab("existing");
        } else {
          setHasExistingCV(false);
          setActiveCvTab("new");
        }

        // Check for existing Job
        const { data: jobData } = await supabase
          .from("documents")
          .select("*")
          .eq("user_id", user.id)
          .eq("type", "job")
          .order("created_at", { ascending: false })
          .limit(1)
          .maybeSingle();

        if (jobData) {
          setHasExistingJob(true);
          setActiveJobTab("existing");
        } else {
          setHasExistingJob(false);
          setActiveJobTab("new");
        }
      } catch (error) {
        console.error("Failed to check existing documents:", error);
      }
    }

    checkExistingDocuments();
  }, [isOpen]);

  // Load wizard state from localStorage
  useEffect(() => {
    if (isOpen) {
      try {
        const savedState = localStorage.getItem(WIZARD_STORAGE_KEY);
        if (savedState) {
          const state = JSON.parse(savedState);
          // Only restore step if there was a saved state
          if (state.currentStep) {
            setCurrentStep(state.currentStep);
          }
          setUploadedCV(state.uploadedCV || null);
          setCvText(state.cvText || "");
          setJobTitle(state.jobTitle || "");
          setJobDetails(state.jobDetails || "");
          setSavedJob(state.savedJob || null);
          setSelectedCV(state.selectedCV || null);
          setSelectedJob(state.selectedJob || null);
        }
      } catch (error) {
        console.error("Failed to load wizard state:", error);
      }
    }
  }, [isOpen]);

  // Save wizard state to localStorage
  useEffect(() => {
    if (isOpen && currentStep < 4) {
      try {
        const state = {
          currentStep,
          uploadedCV,
          cvText,
          jobTitle,
          jobDetails,
          savedJob,
          selectedCV,
          selectedJob,
        };
        localStorage.setItem(WIZARD_STORAGE_KEY, JSON.stringify(state));
      } catch (error) {
        console.error("Failed to save wizard state:", error);
      }
    }
  }, [currentStep, uploadedCV, cvText, jobTitle, jobDetails, savedJob, selectedCV, selectedJob, isOpen]);

  // Fetch job list when entering step 2 if user has existing jobs
  useEffect(() => {
    async function fetchJobs() {
      if (currentStep === 2 && hasExistingJob && jobList.length === 0) {
        try {
          const supabase = createClient();
          const { data: { user } } = await supabase.auth.getUser();
          if (!user) return;

          const { data: jobsData } = await supabase
            .from("documents")
            .select("*")
            .eq("user_id", user.id)
            .eq("type", "job")
            .order("created_at", { ascending: false });

          if (jobsData) {
            setJobList(jobsData);
          }
        } catch (error) {
          console.error("Failed to fetch jobs:", error);
        }
      }
    }
    fetchJobs();
  }, [currentStep, hasExistingJob, jobList.length]);

  // Clear wizard state when modal is completed or closed
  const handleClose = () => {
    // Only clear if not in middle of wizard
    if (currentStep === 1 || currentStep === 4) {
      localStorage.removeItem(WIZARD_STORAGE_KEY);
    }
    onClose();
  };

  const handleComplete = () => {
    localStorage.removeItem(WIZARD_STORAGE_KEY);
    onComplete();
  };

  // Step 1: Handle CV Upload
  const handleFileSelect = useCallback(async (file: File) => {
    if (!file) return;

    setIsLoading(true);
    try {
      // If user already has a CV, delete it first (single CV policy)
      if (hasExistingCV && uploadedCV) {
        const supabase = createClient();
        const { error: deleteError } = await supabase
          .from("documents")
          .delete()
          .eq("id", uploadedCV.id);

        if (deleteError) {
          console.error("Failed to delete existing CV:", deleteError);
          // Continue anyway
        }
      }

      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/cv/upload", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Upload failed");
      }

      setUploadedCV(result.document);
      setSelectedCV(result.document.id);
      setCvText(result.document.text || "");
      setHasExistingCV(true);
      setActiveCvTab("existing"); // Automatically switch to the "Saved Resumes" view
      toast.success("Resume uploaded successfully!");
      
      // Auto-advance for refined Apple-style UX flow
      setTimeout(() => {
        changeStep(2);
      }, 1200);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Upload failed";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [hasExistingCV, uploadedCV, toast]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileSelect(file);
    }
  }, [handleFileSelect]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  // Step 2: Handle Job Posting
  const handleJobSubmit = async () => {
    if (!jobTitle || !jobDetails) {
      toast.error("Please fill in all fields");
      return null;
    }

    setIsLoading(true);
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        throw new Error("Not authenticated");
      }

      const { data, error } = await supabase
        .from("documents")
        .insert({
          user_id: user.id,
          type: "job",
          title: jobTitle,
          text: jobDetails,
          lang: "en",
        })
        .select()
        .single();

      if (error) throw error;

      setSavedJob(data);
      toast.success("Job posting added!");
      return data.id;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to add job";
      toast.error(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Step 3: Fetch data for analysis
  const fetchDataForAnalysis = async () => {
    setIsLoading(true);
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) return;

      const [cvsRes, jobsRes] = await Promise.all([
        supabase
          .from("documents")
          .select("*")
          .eq("user_id", user.id)
          .eq("type", "cv"),
        supabase
          .from("documents")
          .select("*")
          .eq("user_id", user.id)
          .eq("type", "job"),
      ]);

      setCvList(cvsRes.data || []);
      setJobList(jobsRes.data || []);

      // Auto-select uploaded/existing CV and job
      if (uploadedCV) {
        setSelectedCV(uploadedCV.id);
      } else if (cvsRes.data && cvsRes.data.length > 0) {
        // Auto-select first (most recent) CV if exists
        setSelectedCV(cvsRes.data[0].id);
      }

      if (savedJob) setSelectedJob(savedJob.id);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Step 3: Create analysis
  const handleCreateAnalysis = async (overrideJobId?: string) => {
    const currentJobId = overrideJobId || selectedJob;

    if (!selectedCV || !currentJobId) {
      toast.error("Please select a resume and a job posting");
      return;
    }

    setIsLoading(true);
    setAnalysisProgressStep(0);

    try {
      // Step 0: Preparing documents
      await new Promise(resolve => setTimeout(resolve, 600));

      // Step 1: Analyzing resume
      setAnalysisProgressStep(1);
      await new Promise(resolve => setTimeout(resolve, 600));

      // Step 2: Comparing with job
      setAnalysisProgressStep(2);

      // Call the analyze API
      const response = await fetch("/api/analyze/free", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          cvId: selectedCV,
          jobIds: [currentJobId],
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Analysis failed");
      }

      // Step 3: Calculating score
      setAnalysisProgressStep(3);
      await new Promise(resolve => setTimeout(resolve, 500));

      // Redirect immediately to the report page
      toast.success("Analysis complete!");
      handleComplete();
      router.push(`/reports/${result.report.id}`);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to create analysis";
      toast.error(errorMessage);
      // Revert to form view on error so user isn't stuck loading
      changeStep(2);
      setIsLoading(false);
      setAnalysisProgressStep(0);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <SlideContainer
            key="step1"
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <StepHeader>
              <StepTitle><DocumentIcon /> Select Resume</StepTitle>
              <StepDescription>
                {hasExistingCV
                  ? "Upload a new PDF/DOCX or use a previously saved resume"
                  : "Upload your resume in PDF or DOCX format"
                }
              </StepDescription>
            </StepHeader>

            <StepContent>
              {hasExistingCV && (
                <SegmentControl>
                  <SegmentButton
                    $active={activeCvTab === "new"}
                    onClick={() => setActiveCvTab("new")}
                  >
                    Upload New
                  </SegmentButton>
                  <SegmentButton
                    $active={activeCvTab === "existing"}
                    onClick={() => setActiveCvTab("existing")}
                  >
                    Saved Resumes
                  </SegmentButton>
                </SegmentControl>
              )}

              <AnimatePresence mode="popLayout" initial={false}>
                {activeCvTab === "existing" && hasExistingCV ? (
                  <motion.div
                    key="existing-cv"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.2 }}
                    style={{ flex: 1, width: "100%", position: "relative", display: "flex", flexDirection: "column" }}
                  >
                    <CompactJobList>
                      {uploadedCV && (
                        <ExistingCVCard
                          onClick={() => {
                            setSelectedCV(uploadedCV.id);
                            changeStep(2);
                          }}
                          style={{ borderColor: selectedCV === uploadedCV.id ? 'var(--primary)' : undefined }}
                        >
                          <CVIcon><DocumentIcon /></CVIcon>
                          <CVTextContent>
                            <CVTitle>{uploadedCV.title}</CVTitle>
                            <CVSubtitle>
                              {cvText.length} characters • Just uploaded
                            </CVSubtitle>
                          </CVTextContent>
                          <PreviewButton
                            onClick={(e) => handleOpenPreview(uploadedCV, e)}
                            title="Preview Resume"
                            disabled={isPreviewLoading}
                          >
                            {isPreviewLoading ? <Spinner size="sm" /> : <EyeIcon />}
                          </PreviewButton>
                        </ExistingCVCard>
                      )}
                      
                      {cvList.filter(cv => cv.id !== uploadedCV?.id).map((cv) => (
                        <ExistingCVCard
                          key={cv.id}
                          onClick={() => {
                            setSelectedCV(cv.id);
                            changeStep(2);
                          }}
                          style={{
                            borderColor: selectedCV === cv.id ? 'var(--primary)' : undefined,
                            background: selectedCV === cv.id ? 'rgba(var(--primary-rgb), 0.08)' : undefined
                          }}
                        >
                          <CVIcon><DocumentIcon /></CVIcon>
                          <CVTextContent>
                            <CVTitle>{cv.title}</CVTitle>
                            <CVSubtitle>Saved Resume</CVSubtitle>
                          </CVTextContent>
                          <PreviewButton
                            onClick={(e) => handleOpenPreview(cv, e)}
                            title="Preview Resume"
                            disabled={isPreviewLoading}
                          >
                            {isPreviewLoading ? <Spinner size="sm" /> : <EyeIcon />}
                          </PreviewButton>
                        </ExistingCVCard>
                      ))}
                    </CompactJobList>
                  </motion.div>
                ) : (
                  <motion.div
                    key="new-cv"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                    style={{ flex: 1, width: "100%", position: "relative", display: "flex", flexDirection: "column" }}
                  >
                    <UploadArea
                      $isDragging={isDragging}
                      onDrop={handleDrop}
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onClick={() => document.getElementById("wizard-cv-upload")?.click()}
                    >
                      <UploadIcon><UploadArrowIcon /></UploadIcon>
                      <UploadText>
                        <strong>Click to upload</strong> or drag and drop
                      </UploadText>
                      <UploadHint>
                        PDF or DOCX (max 5MB)
                      </UploadHint>
                      <input
                        id="wizard-cv-upload"
                        type="file"
                        accept=".pdf,.docx"
                        style={{ display: "none" }}
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleFileSelect(file);
                        }}
                      />
                    </UploadArea>
                  </motion.div>
                )}
              </AnimatePresence>
            </StepContent>
          </SlideContainer>
        );

      case 2:
        return (
          <SlideContainer
            key="step2"
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <StepHeader>
              <StepTitle><BriefcaseIcon /> Add Job Posting</StepTitle>
              <StepDescription>
                {hasExistingJob
                  ? "Paste a new job description or use an existing one"
                  : "Paste the job description you want to apply to"
                }
              </StepDescription>
            </StepHeader>

            <StepContent style={{ display: 'flex', flexDirection: 'column' }}>
              {hasExistingJob && (
                <SegmentControl>
                  <SegmentButton
                    $active={activeJobTab === "new"}
                    onClick={() => setActiveJobTab("new")}
                  >
                    Paste New
                  </SegmentButton>
                  <SegmentButton
                    $active={activeJobTab === "existing"}
                    onClick={() => setActiveJobTab("existing")}
                  >
                    Saved Jobs
                  </SegmentButton>
                </SegmentControl>
              )}

              <AnimatePresence mode="popLayout" initial={false}>
                {activeJobTab === "existing" && hasExistingJob ? (
                  <motion.div
                    key="existing-job"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.2 }}
                    style={{ flex: 1, width: '100%', position: 'relative', display: 'flex', flexDirection: 'column' }}
                  >
                    <CompactJobList>
                      {jobList.map((job) => (
                        <CompactJobCard
                          key={job.id}
                          $selected={savedJob?.id === job.id}
                          onClick={() => {
                            setSavedJob(job);
                            setSelectedJob(job.id);
                            // Refined one-tap instantly triggers analysis
                            changeStep(3);
                            handleCreateAnalysis(job.id);
                          }}
                        >
                          <CompactJobTitle>{job.title}</CompactJobTitle>
                          <CompactJobMeta>
                            {job.text?.length || 0} characters
                          </CompactJobMeta>
                        </CompactJobCard>
                      ))}
                    </CompactJobList>
                  </motion.div>
                ) : (
                  <motion.div
                    key="new-job"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                    style={{ flex: 1, width: '100%', position: 'relative', display: 'flex', flexDirection: 'column' }}
                  >
                    <JobForm style={{ flex: 1 }}>
                      <div>
                        <FormLabel>Job Title</FormLabel>
                        <Input
                          type="text"
                          placeholder="e.g. Senior Frontend Developer"
                          value={jobTitle}
                          onChange={(e) => setJobTitle(e.target.value)}
                        />
                      </div>
                      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                        <FormLabel>Job Description</FormLabel>
                        <Textarea
                          placeholder="Paste the full job description here (requirements, responsibilities, qualifications, etc.)..."
                          value={jobDetails}
                          onChange={(e) => setJobDetails(e.target.value)}
                          style={{ flex: 1, minHeight: hasExistingJob ? "160px" : "240px", resize: 'none' }}
                        />
                        <CharCount>
                          {jobDetails.length} characters · {jobDetails.split('\n').length} lines
                        </CharCount>
                      </div>
                    </JobForm>
                  </motion.div>
                )}
              </AnimatePresence>
            </StepContent>

            {/* Always-visible footer — anchored at bottom of SlideContainer */}
            <WizardActions>
              <Button variant="ghost" onClick={() => changeStep(1)}>
                ← Previous
              </Button>
              {activeJobTab === "new" && (
                <Button
                  variant="primary"
                  onClick={async () => {
                    let finalJobId = selectedJob;
                    const newJobId = await handleJobSubmit();
                    if (newJobId) {
                      finalJobId = newJobId;
                      setSelectedJob(newJobId);
                    } else {
                      return;
                    }
                    if (finalJobId) {
                      changeStep(3);
                      handleCreateAnalysis(finalJobId);
                    }
                  }}
                  disabled={!jobTitle || !jobDetails}
                >
                  Save & Analyze <TargetIcon />
                </Button>
              )}
            </WizardActions>
          </SlideContainer>
        );

      case 3:
        if (isLoading && analysisProgressStep > 0) {
          return (
            <SlideContainer
              key="step3-loading"
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              <LoadingContainer>
                <AnalysisProgress
                  currentStep={analysisProgressStep - 1}
                  title="Analyzing your match"
                />
              </LoadingContainer>
            </SlideContainer>
          );
        }

        if (isLoading) {
          return (
            <LoadingContainer>
              <Spinner size="lg" />
              <LoadingTitle>Initializing Analysis...</LoadingTitle>
              <LoadingSubtitle>Preparing documents</LoadingSubtitle>
            </LoadingContainer>
          );
        }

        return null;
      default:
        return null;
    }
  };

  const handleOpenPreview = async (doc: DocumentType, e: React.MouseEvent) => {
    e.stopPropagation();
    setIsPreviewLoading(true);
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      let downloadUrl = doc.file_url;

      // Ensure we have a valid URL path
      if (!downloadUrl) {
         downloadUrl = `${user.id}/${doc.id}`;
      }

      // Instead of relying on client-side storage policies, ask our backend for a signed url
      const res = await fetch(`/api/cv/preview?id=${doc.id}`);
      if (!res.ok) {
        throw new Error("Failed to get secure preview link");
      }
      
      const { url } = await res.json();
      if (!url) throw new Error("URL missing in response");

      setPreviewDocument({
        title: doc.title,
        url: url,
        isPdf: doc.title.toLowerCase().endsWith('.pdf')
      });
    } catch (error) {
      console.error("Preview error:", error);
      toast.error("Could not load document preview");
    } finally {
      setIsPreviewLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size={previewDocument ? "lg" : "md"} showCloseButton={false} triggerRect={triggerRect}>
      <Modal.Body style={{ padding: 0, display: "flex", flex: 1 }}>
        <WizardContainer $isPreview={!!previewDocument}>
          <WizardHeader>
            <WizardCloseButton onClick={handleClose} aria-label="Close">
              <CloseIcon />
            </WizardCloseButton>
          </WizardHeader>

          <div style={{ flex: 1, position: "relative", overflow: "hidden", display: "flex", flexDirection: "column" }}>
            <AnimatePresence mode="popLayout" initial={false} custom={direction}>
              {renderStepContent()}
            </AnimatePresence>

            <AnimatePresence>
              {previewDocument && (
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ type: "spring", damping: 25, stiffness: 300 }}
                  style={{
                    position: "absolute",
                    inset: 0,
                    zIndex: 50,
                    background: "rgba(20,20,20,0.95)",
                    backdropFilter: "blur(20px)",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <div style={{ padding: "16px 20px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
                    <h3 style={{ margin: 0, fontSize: "16px", fontWeight: 600, color: "white", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                      Preview: {previewDocument.title}
                    </h3>
                    <Button variant="ghost" size="sm" onClick={() => setPreviewDocument(null)}>
                      Close
                    </Button>
                  </div>
                  <div style={{ flex: 1, background: "white" }}>
                    {previewDocument.isPdf ? (
                       <iframe
                         src={`${previewDocument.url}#toolbar=0&navpanes=0`}
                         style={{ width: "100%", height: "100%", border: "none" }}
                         title="PDF Preview"
                       />
                    ) : (
                       <iframe
                         src={`https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(previewDocument.url)}`}
                         style={{ width: "100%", height: "100%", border: "none" }}
                         title="DOCX Preview"
                       />
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </WizardContainer>
      </Modal.Body>
    </Modal>
  );
}