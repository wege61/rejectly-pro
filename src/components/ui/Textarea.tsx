'use client';

import styled, { css } from 'styled-components';
import { forwardRef } from 'react';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
  fullWidth?: boolean;
}

const TextareaWrapper = styled.div<{ $fullWidth?: boolean }>`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
  
  ${({ $fullWidth }) =>
    $fullWidth &&
    css`
      width: 100%;
    `}
`;

const Label = styled.label`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const StyledTextarea = styled.textarea<{ $hasError?: boolean }>`
  padding: ${({ theme }) => `${theme.spacing.sm} ${theme.spacing.md}`};
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  font-family: ${({ theme }) => theme.typography.fontFamily.sans};
  color: ${({ theme }) => theme.colors.textPrimary};
  background-color: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.md};
  transition: all ${({ theme }) => theme.transitions.fast};
  outline: none;
  resize: vertical;
  min-height: 100px;
  
  &::placeholder {
    color: ${({ theme }) => theme.colors.textTertiary};
  }
  
  &:hover:not(:disabled) {
    border-color: ${({ theme }) => theme.colors.borderHover};
  }
  
  &:focus {
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primaryLight};
  }
  
  &:disabled {
    background-color: ${({ theme }) => theme.colors.backgroundAlt};
    cursor: not-allowed;
    opacity: 0.6;
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
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ $isError, theme }) =>
    $isError ? theme.colors.error : theme.colors.textSecondary};
`;

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, helperText, fullWidth, ...props }, ref) => {
    const hasError = !!error;
    const displayHelperText = error || helperText;

    return (
      <TextareaWrapper $fullWidth={fullWidth}>
        {label && <Label>{label}</Label>}
        <StyledTextarea ref={ref} $hasError={hasError} {...props} />
        {displayHelperText && (
          <HelperText $isError={hasError}>{displayHelperText}</HelperText>
        )}
      </TextareaWrapper>
    );
  }
);

Textarea.displayName = 'Textarea';