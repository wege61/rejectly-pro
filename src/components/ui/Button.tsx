"use client";

import styled, { css } from "styled-components";
import { useState, MouseEvent } from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger" | "glass-primary" | "glass-secondary";
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
  border-radius: 9999px;
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
          background-color: var(--surface-color);
          color: var(--text-color);
          border: 1px solid var(--border-color);

          &:hover:not(:disabled) {
            background-color: var(--surface-hover);
            border-color: var(--border-color);
            box-shadow: ${theme.shadow.sm};
          }

          &:active:not(:disabled) {
            transform: translateY(0);
          }
        `;
      case "ghost":
        return css`
          background: rgba(150, 150, 150, 0.08);
          backdrop-filter: blur(40px) saturate(200%);
          -webkit-backdrop-filter: blur(40px) saturate(200%);
          border: 1px solid rgba(255, 255, 255, 0.15);
          color: var(--text-color);
          box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.25);

          &:hover:not(:disabled) {
            background: rgba(150, 150, 150, 0.16);
            border-color: rgba(255, 255, 255, 0.28);
            box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.4), 0 8px 24px rgba(0, 0, 0, 0.1);
            color: var(--text-color);
          }

          &:active:not(:disabled) {
            transform: translateY(0);
            box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.15);
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
      case "glass-primary":
        return css`
          background: linear-gradient(135deg, rgba(53, 162, 159, 0.9) 0%, rgba(11, 102, 106, 0.9) 100%);
          color: white;
          border: 1px solid rgba(53, 162, 159, 0.5);
          box-shadow: 0 8px 32px rgba(53, 162, 159, 0.2);
          backdrop-filter: blur(12px) saturate(160%);
          -webkit-backdrop-filter: blur(12px) saturate(160%);

          &:hover:not(:disabled) {
            background: linear-gradient(135deg, rgba(63, 172, 169, 1) 0%, rgba(21, 112, 116, 1) 100%);
            box-shadow: 0 12px 40px rgba(53, 162, 159, 0.3);
            border-color: rgba(53, 162, 159, 0.8);
          }

          &:active:not(:disabled) {
            transform: translateY(0);
            box-shadow: 0 4px 16px rgba(53, 162, 159, 0.2);
          }
        `;
      case "glass-secondary":
        return css`
          background: rgba(255, 255, 255, 0.05);
          color: rgba(255, 255, 255, 0.9);
          border: 1px solid rgba(255, 255, 255, 0.1);
          box-shadow: none;
          backdrop-filter: blur(12px) saturate(160%);
          -webkit-backdrop-filter: blur(12px) saturate(160%);

          &:hover:not(:disabled) {
            background: rgba(255, 255, 255, 0.1);
            box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
            border-color: rgba(255, 255, 255, 0.2);
            color: white;
          }

          &:active:not(:disabled) {
            transform: translateY(0);
            background: rgba(255, 255, 255, 0.05);
          }
        `;
      default: // primary
        return css`
          background: linear-gradient(180deg, rgba(255, 255, 255, 0.18) 0%, rgba(255, 255, 255, 0) 100%),
            rgba(238, 90, 90, 0.82);
          backdrop-filter: blur(20px) saturate(180%);
          -webkit-backdrop-filter: blur(20px) saturate(180%);
          color: #FFFFFF;
          border: 1px solid rgba(255, 255, 255, 0.28);
          box-shadow:
            inset 0 1px 0 rgba(255, 255, 255, 0.5),
            0 8px 32px rgba(238, 90, 90, 0.35);

          &:hover:not(:disabled) {
            background: linear-gradient(180deg, rgba(255, 255, 255, 0.26) 0%, rgba(255, 255, 255, 0) 100%),
              rgba(238, 90, 90, 0.92);
            box-shadow:
              inset 0 1px 0 rgba(255, 255, 255, 0.65),
              0 8px 32px rgba(238, 90, 90, 0.5);
          }

          &:active:not(:disabled) {
            transform: translateY(0);
            box-shadow:
              inset 0 1px 0 rgba(255, 255, 255, 0.4),
              0 4px 16px rgba(238, 90, 90, 0.25);
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
    outline: 2px solid var(--accent);
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