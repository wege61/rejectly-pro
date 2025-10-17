'use client';

import styled, { css } from 'styled-components';

interface CardProps {
  variant?: 'default' | 'bordered' | 'elevated';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

const StyledCard = styled.div<CardProps>`
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.radius.lg};
  transition: all ${({ theme }) => theme.transitions.normal};
  
  ${({ onClick }) =>
    onClick &&
    css`
      cursor: pointer;
      
      &:hover {
        transform: translateY(-2px);
      }
    `}
  
  /* Padding */
  ${({ padding = 'md', theme }) => {
    switch (padding) {
      case 'none':
        return css`
          padding: 0;
        `;
      case 'sm':
        return css`
          padding: ${theme.spacing.md};
        `;
      case 'lg':
        return css`
          padding: ${theme.spacing.xl};
        `;
      default:
        return css`
          padding: ${theme.spacing.lg};
        `;
    }
  }}
  
  /* Variants */
  ${({ variant = 'default', theme }) => {
    switch (variant) {
      case 'bordered':
        return css`
          border: 1px solid ${theme.colors.border};
          
          &:hover {
            border-color: ${theme.colors.borderHover};
          }
        `;
      case 'elevated':
        return css`
          box-shadow: ${theme.shadow.md};
          
          &:hover {
            box-shadow: ${theme.shadow.lg};
          }
        `;
      default:
        return css`
          border: 1px solid ${theme.colors.border};
        `;
    }
  }}
`;

const CardHeader = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const CardTitle = styled.h3`
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.textPrimary};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

const CardDescription = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-bottom: 0;
`;

const CardContent = styled.div`
  /* Content area */
`;

const CardFooter = styled.div`
  margin-top: ${({ theme }) => theme.spacing.md};
  padding-top: ${({ theme }) => theme.spacing.md};
  border-top: 1px solid ${({ theme }) => theme.colors.border};
`;

export const Card = Object.assign(StyledCard, {
  Header: CardHeader,
  Title: CardTitle,
  Description: CardDescription,
  Content: CardContent,
  Footer: CardFooter,
});