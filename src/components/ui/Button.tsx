"use client";

import styled, { css } from "styled-components";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  isLoading?: boolean;
}

// Transient props interface for styled component (with $ prefix)
interface StyledButtonProps {
  $variant?: ButtonVariant;
  $size?: ButtonSize;
  $fullWidth?: boolean;
  $isLoading?: boolean;
}

const StyledButton = styled.button<StyledButtonProps>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  border-radius: ${({ theme }) => theme.radius.md};
  transition: all ${({ theme }) => theme.transitions.fast};
  cursor: pointer;
  border: none;
  white-space: nowrap;

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }

  ${({ $fullWidth }) =>
    $fullWidth &&
    css`
      width: 100%;
    `}

  /* Sizes */
  ${({ $size = "md", theme }) => {
    switch ($size) {
      case "sm":
        return css`
          padding: ${theme.spacing.xs} ${theme.spacing.md};
          font-size: ${theme.typography.fontSize.sm};
          height: 32px;
        `;
      case "lg":
        return css`
          padding: ${theme.spacing.md} ${theme.spacing.xl};
          font-size: ${theme.typography.fontSize.lg};
          height: 48px;
        `;
      default:
        return css`
          padding: ${theme.spacing.sm} ${theme.spacing.lg};
          font-size: ${theme.typography.fontSize.base};
          height: 40px;
        `;
    }
  }}
  
  /* Variants */
  ${({ $variant = "primary", theme }) => {
    switch ($variant) {
      case "secondary":
        return css`
          background-color: ${theme.colors.surface};
          color: ${theme.colors.textPrimary};
          border: 1px solid ${theme.colors.border};

          &:hover:not(:disabled) {
            background-color: ${theme.colors.surfaceHover};
            border-color: ${theme.colors.borderHover};
          }

          &:active:not(:disabled) {
            transform: scale(0.98);
          }
        `;
      case "ghost":
        return css`
          background-color: transparent;
          color: ${theme.colors.textSecondary};

          &:hover:not(:disabled) {
            background-color: ${theme.colors.surfaceHover};
            color: ${theme.colors.textPrimary};
          }
        `;
      case "danger":
        return css`
          background-color: ${theme.colors.error};
          color: white;

          &:hover:not(:disabled) {
            background-color: #dc2626;
          }

          &:active:not(:disabled) {
            transform: scale(0.98);
          }
        `;
      default: // primary
        return css`
          background-color: ${theme.colors.primary};
          color: white;

          &:hover:not(:disabled) {
            background-color: ${theme.colors.primaryHover};
            box-shadow: ${theme.shadow.md};
          }

          &:active:not(:disabled) {
            transform: scale(0.98);
          }
        `;
    }
  }}
  
  ${({ $isLoading }) =>
    $isLoading &&
    css`
      pointer-events: none;
      opacity: 0.7;
    `}
`;

const LoadingSpinner = styled.span`
  display: inline-block;
  width: 14px;
  height: 14px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

export const Button: React.FC<ButtonProps> = ({
  children,
  variant,
  size,
  fullWidth,
  isLoading,
  disabled,
  ...props
}) => {
  return (
    <StyledButton
      $variant={variant}
      $size={size}
      $fullWidth={fullWidth}
      $isLoading={isLoading}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && <LoadingSpinner />}
      {children}
    </StyledButton>
  );
};
