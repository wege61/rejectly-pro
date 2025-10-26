"use client";

import styled, { css } from "styled-components";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "bordered" | "elevated";
  padding?: "none" | "sm" | "md" | "lg";
  hoverable?: boolean;
  children?: React.ReactNode;
}

const StyledCard = styled.div<CardProps>`
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.radius.lg};
  transition: all ${({ theme }) => theme.transitions.normal};
  position: relative;

  ${({ padding, theme }) => {
    switch (padding) {
      case "none":
        return css`
          padding: 0;
        `;
      case "sm":
        return css`
          padding: ${theme.spacing.md};
        `;
      case "lg":
        return css`
          padding: ${theme.spacing.xl};
        `;
      default: // md
        return css`
          padding: ${theme.spacing.lg};
        `;
    }
  }}

  ${({ variant, theme }) => {
    switch (variant) {
      case "bordered":
        return css`
          border: 1px solid ${theme.colors.border};
        `;
      case "elevated":
        return css`
          box-shadow: ${theme.shadow.md};
        `;
      default:
        return css`
          border: 1px solid ${theme.colors.border};
        `;
    }
  }}

  ${({ hoverable, onClick, theme }) =>
    (hoverable || onClick) &&
    css`
      cursor: pointer;

      &:hover {
        transform: translateY(-4px);
        box-shadow: ${theme.shadow.lg};
        border-color: ${theme.colors.borderHover};
      }

      &:active {
        transform: translateY(-2px);
        box-shadow: ${theme.shadow.md};
      }
    `}
`;

const CardHeader = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const CardTitle = styled.h3`
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.textPrimary};
  margin: 0 0 ${({ theme }) => theme.spacing.xs} 0;
`;

const CardDescription = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
  margin: 0;
  line-height: ${({ theme }) => theme.typography.lineHeight.relaxed};
`;

const CardContent = styled.div`
  flex: 1;
`;

const CardFooter = styled.div`
  margin-top: ${({ theme }) => theme.spacing.lg};
  padding-top: ${({ theme }) => theme.spacing.md};
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
`;

export const Card: React.FC<CardProps> & {
  Header: typeof CardHeader;
  Title: typeof CardTitle;
  Description: typeof CardDescription;
  Content: typeof CardContent;
  Footer: typeof CardFooter;
} = ({
  children,
  variant = "default",
  padding = "md",
  hoverable = false,
  ...props
}) => {
  return (
    <StyledCard
      variant={variant}
      padding={padding}
      hoverable={hoverable}
      {...props}
    >
      {children}
    </StyledCard>
  );
};

Card.Header = CardHeader;
Card.Title = CardTitle;
Card.Description = CardDescription;
Card.Content = CardContent;
Card.Footer = CardFooter;
