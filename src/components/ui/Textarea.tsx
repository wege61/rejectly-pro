"use client";

import styled, { css } from "styled-components";
import { forwardRef } from "react";

interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
  fullWidth?: boolean;
}

const TextareaWrapper = styled.div<{ $fullWidth?: boolean }>`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
  width: ${({ $fullWidth }) => ($fullWidth ? "100%" : "auto")};
`;

const Label = styled.label`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  color: ${({ theme }) => theme.colors.textPrimary};
  transition: all ${({ theme }) => theme.transitions.fast};
`;

const StyledTextarea = styled.textarea<{ $hasError?: boolean }>`
  width: 100%;
  min-height: 120px;
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  font-family: ${({ theme }) => theme.typography.fontFamily.sans};
  color: ${({ theme }) => theme.colors.textPrimary};
  background-color: ${({ theme }) => theme.colors.surface};
  border: 2px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.md};
  transition: all ${({ theme }) => theme.transitions.normal};
  outline: none;
  resize: vertical;

  &::placeholder {
    color: ${({ theme }) => theme.colors.textTertiary};
  }

  &:hover:not(:disabled) {
    border-color: ${({ theme }) => theme.colors.borderHover};
  }

  &:focus {
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primaryLight};
    transform: translateY(-1px);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    background-color: ${({ theme }) => theme.colors.surfaceHover};
  }

  ${({ $hasError, theme }) =>
    $hasError &&
    css`
      border-color: ${theme.colors.error};

      &:focus {
        border-color: ${theme.colors.error};
        box-shadow: 0 0 0 3px ${theme.colors.errorLight};
      }
    `}
`;

const HelperText = styled.span<{ $isError?: boolean }>`
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  color: ${({ $isError, theme }) =>
    $isError ? theme.colors.error : theme.colors.textSecondary};
  margin-top: ${({ theme }) => theme.spacing.xs};
  display: block;
  animation: ${({ theme }) => theme.animations.slideInUp} 0.2s ease;
`;

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    { label, error, helperText, fullWidth = false, className, ...props },
    ref
  ) => {
    return (
      <TextareaWrapper $fullWidth={fullWidth} className={className}>
        {label && <Label>{label}</Label>}
        <StyledTextarea ref={ref} $hasError={!!error} {...props} />
        {error && <HelperText $isError>{error}</HelperText>}
        {!error && helperText && <HelperText>{helperText}</HelperText>}
      </TextareaWrapper>
    );
  }
);

Textarea.displayName = "Textarea";
