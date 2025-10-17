'use client';

import styled, { css } from 'styled-components';

type BadgeVariant = 'default' | 'success' | 'warning' | 'error' | 'info';
type BadgeSize = 'sm' | 'md' | 'lg';

interface BadgeProps {
  variant?: BadgeVariant;
  size?: BadgeSize;
  children: React.ReactNode;
  className?: string;
}

const StyledBadge = styled.span<BadgeProps>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  border-radius: ${({ theme }) => theme.radius.full};
  white-space: nowrap;
  
  /* Sizes */
  ${({ size = 'md', theme }) => {
    switch (size) {
      case 'sm':
        return css`
          padding: ${theme.spacing.xs} ${theme.spacing.sm};
          font-size: ${theme.typography.fontSize.xs};
          height: 20px;
        `;
      case 'lg':
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
  ${({ variant = 'default', theme }) => {
    switch (variant) {
      case 'success':
        return css`
          background-color: ${theme.colors.successLight};
          color: ${theme.colors.success};
        `;
      case 'warning':
        return css`
          background-color: ${theme.colors.warningLight};
          color: ${theme.colors.warning};
        `;
      case 'error':
        return css`
          background-color: ${theme.colors.errorLight};
          color: ${theme.colors.error};
        `;
      case 'info':
        return css`
          background-color: ${theme.colors.infoLight};
          color: ${theme.colors.info};
        `;
      default:
        return css`
          background-color: ${theme.colors.backgroundAlt};
          color: ${theme.colors.textSecondary};
        `;
    }
  }}
`;

export const Badge: React.FC<BadgeProps> = ({ children, ...props }) => {
  return <StyledBadge {...props}>{children}</StyledBadge>;
};