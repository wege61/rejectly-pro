"use client";

import styled, { css } from "styled-components";

type BadgeVariant = "default" | "success" | "warning" | "error" | "info";
type BadgeSize = "sm" | "md" | "lg";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  size?: BadgeSize;
  children: React.ReactNode;
}

const StyledBadge = styled.span<BadgeProps>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  border-radius: ${({ theme }) => theme.radius.full};
  white-space: nowrap;
  transition: all ${({ theme }) => theme.transitions.fast};
  animation: ${({ theme }) => theme.animations.scaleIn} 0.2s ease;

  /* Sizes */
  ${({ size = "md", theme }) => {
    switch (size) {
      case "sm":
        return css`
          padding: ${theme.spacing.xs} ${theme.spacing.sm};
          font-size: ${theme.typography.fontSize.xs};
          height: 20px;
        `;
      case "lg":
        return css`
          padding: ${theme.spacing.sm} ${theme.spacing.md};
          font-size: ${theme.typography.fontSize.base};
          height: 32px;
        `;
      default:
        return css`
          padding: ${theme.spacing.xs} ${theme.spacing.md};
          font-size: ${theme.typography.fontSize.sm};
          height: 24px;
        `;
    }
  }}

  /* Variants */
  ${({ variant = "default", theme }) => {
    switch (variant) {
      case "success":
        return css`
          background-color: ${theme.colors.successLight};
          color: ${theme.colors.success};

          &:hover {
            background-color: ${theme.colors.success};
            color: ${theme.colors.background};
            transform: scale(1.05);
          }
        `;
      case "warning":
        return css`
          background-color: ${theme.colors.warningLight};
          color: ${theme.colors.warning};

          &:hover {
            background-color: ${theme.colors.warning};
            color: ${theme.colors.background};
            transform: scale(1.05);
          }
        `;
      case "error":
        return css`
          background-color: ${theme.colors.errorLight};
          color: ${theme.colors.error};

          &:hover {
            background-color: ${theme.colors.error};
            color: ${theme.colors.background};
            transform: scale(1.05);
          }
        `;
      case "info":
        return css`
          background-color: ${theme.colors.infoLight};
          color: ${theme.colors.info};

          &:hover {
            background-color: ${theme.colors.info};
            color: ${theme.colors.background};
            transform: scale(1.05);
          }
        `;
      default:
        return css`
          background-color: ${theme.colors.backgroundAlt};
          color: ${theme.colors.textSecondary};

          &:hover {
            background-color: ${theme.colors.surfaceHover};
            color: ${theme.colors.textPrimary};
            transform: scale(1.05);
          }
        `;
    }
  }}
`;

export const Badge: React.FC<BadgeProps> = ({ children, ...props }) => {
  return <StyledBadge {...props}>{children}</StyledBadge>;
};
