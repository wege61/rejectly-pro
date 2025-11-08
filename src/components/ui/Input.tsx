"use client";

import styled, { css } from "styled-components";
import { forwardRef } from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  fullWidth?: boolean;
}

const InputWrapper = styled.div<{ $fullWidth?: boolean }>`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
  width: ${({ $fullWidth }) => ($fullWidth ? "100%" : "auto")};
`;

const Label = styled.label`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  color: var(--text-color);
  transition: all ${({ theme }) => theme.transitions.fast};
`;

const InputContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const StyledInput = styled.input<{ $hasError?: boolean }>`
  width: 100%;
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  font-family: ${({ theme }) => theme.typography.fontFamily.sans};
  color: var(--text-color);
  background-color: var(--surface-color);
  border: 2px solid var(--border-color);
  border-radius: ${({ theme }) => theme.radius.md};
  transition: all ${({ theme }) => theme.transitions.normal};
  outline: none;

  &::placeholder {
    color: var(--text-secondary);
    opacity: 0.6;
  }

  &:hover:not(:disabled) {
    border-color: var(--border-color);
    filter: brightness(1.1);
  }

  &:focus {
    border-color: var(--primary-color);
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primaryLight};
    transform: translateY(-1px);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    background-color: var(--surface-hover);
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
    $isError ? theme.colors.error : "var(--text-secondary)"};
  margin-top: ${({ theme }) => theme.spacing.xs};
  display: block;
  animation: ${({ theme }) => theme.animations.slideInUp} 0.2s ease;
`;

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    { label, error, helperText, fullWidth = false, className, ...props },
    ref
  ) => {
    return (
      <InputWrapper $fullWidth={fullWidth} className={className}>
        {label && <Label>{label}</Label>}
        <InputContainer>
          <StyledInput ref={ref} $hasError={!!error} {...props} />
        </InputContainer>
        {error && <HelperText $isError>{error}</HelperText>}
        {!error && helperText && <HelperText>{helperText}</HelperText>}
      </InputWrapper>
    );
  }
);

Input.displayName = "Input";
