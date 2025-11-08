"use client";

import styled, { css } from "styled-components";
import { useState, MouseEvent } from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
  isLoading?: boolean;
}

interface RippleType {
  x: number;
  y: number;
  size: number;
  key: number;
}

const StyledButton = styled.button<{
  $variant: ButtonProps['variant'];
  $size: ButtonProps['size'];
  $fullWidth: boolean;
}>`
  position: relative;
  overflow: hidden;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.sm};
  font-family: ${({ theme }) => theme.typography.fontFamily.sans};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  border-radius: ${({ theme }) => theme.radius.md};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.normal};
  white-space: nowrap;
  user-select: none;

  ${({ $fullWidth }) =>
    $fullWidth &&
    css`
      width: 100%;
    `}

  ${({ $size, theme }) => {
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
      default: // md
        return css`
          padding: ${theme.spacing.sm} ${theme.spacing.lg};
          font-size: ${theme.typography.fontSize.base};
          height: 40px;
        `;
    }
  }}

  ${({ $variant, theme }) => {
    switch ($variant) {
      case "secondary":
        return css`
          background-color: ${theme.colors.secondary};
          color: ${theme.colors.textPrimary};
          border: 1px solid ${theme.colors.border};

          &:hover:not(:disabled) {
            background-color: ${theme.colors.secondaryHover};
            border-color: ${theme.colors.borderHover};
            transform: translateY(-1px);
            box-shadow: ${theme.shadow.sm};
          }

          &:active:not(:disabled) {
            transform: translateY(0);
          }
        `;
      case "ghost":
        return css`
          background-color: transparent;
          color: ${theme.colors.textSecondary};
          border: none;

          &:hover:not(:disabled) {
            background-color: ${theme.colors.surfaceHover};
            color: ${theme.colors.textPrimary};
          }

          &:active:not(:disabled) {
            background-color: ${theme.colors.surface};
          }
        `;
      case "danger":
        return css`
          background-color: ${theme.colors.error};
          color: white;
          border: none;

          &:hover:not(:disabled) {
            background-color: ${theme.colors.errorHover};
            transform: translateY(-1px);
            box-shadow: ${theme.shadow.md};
          }

          &:active:not(:disabled) {
            transform: translateY(0);
          }
        `;
      default: // primary
        return css`
          background-color: ${theme.colors.primary};
          color: white;
          border: none;

          &:hover:not(:disabled) {
            background-color: ${theme.colors.primaryHover};
            transform: translateY(-2px);
            box-shadow: ${theme.shadow.md};
          }

          &:active:not(:disabled) {
            transform: translateY(0);
          }
        `;
    }
  }}

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none !important;
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.primary};
    outline-offset: 2px;
  }
`;

const Ripple = styled.span`
  position: absolute;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.6);
  pointer-events: none;
  animation: ${({ theme }) => theme.animations.ripple} 0.6s ease-out;
`;

const LoadingSpinner = styled.span`
  display: inline-block;
  width: 16px;
  height: 16px;
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
  variant = "primary",
  size = "md",
  fullWidth = false,
  isLoading = false,
  disabled,
  onClick,
  ...props
}) => {
  const [ripples, setRipples] = useState<RippleType[]>([]);

  const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
    if (disabled || isLoading) return;

    const button = e.currentTarget;
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;

    const newRipple: RippleType = {
      x,
      y,
      size,
      key: Date.now(),
    };

    setRipples((prev) => [...prev, newRipple]);

    // Remove ripple after animation
    setTimeout(() => {
      setRipples((prev) =>
        prev.filter((ripple) => ripple.key !== newRipple.key)
      );
    }, 600);

    if (onClick) {
      onClick(e);
    }
  };

  return (
    <StyledButton
      $variant={variant}
      $size={size}
      $fullWidth={fullWidth}
      disabled={disabled || isLoading}
      onClick={handleClick}
      {...props}
    >
      {isLoading && <LoadingSpinner />}
      {children}
      {ripples.map((ripple) => (
        <Ripple
          key={ripple.key}
          style={{
            left: ripple.x,
            top: ripple.y,
            width: ripple.size,
            height: ripple.size,
          }}
        />
      ))}
    </StyledButton>
  );
};