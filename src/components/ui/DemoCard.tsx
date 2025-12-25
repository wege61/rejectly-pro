"use client";

import styled from "styled-components";
import { ComponentPropsWithoutRef, ReactNode } from "react";

// Card Container
const CardWrapper = styled.div`
  background: var(--bg-alt);
  color: var(--text-color);
  display: flex;
  flex-direction: column;
  gap: 24px;
  border-radius: 16px;
  padding: 24px 0;
  transition: all 0.3s ease;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  outline: 1px solid rgba(0, 0, 0, 0.05);

  
  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
`;

// Card Header
const CardHeaderWrapper = styled.div`
  display: grid;
  grid-template-rows: auto auto;
  align-items: start;
  gap: 8px;
  padding: 0 24px;

  &[data-has-action="true"] {
    grid-template-columns: 1fr auto;
  }
`;

// Card Title
const CardTitleWrapper = styled.div`
  font-weight: 600;
  line-height: 1.2;
  font-size: 18px;
  color: var(--text-color);
`;

// Card Description
const CardDescriptionWrapper = styled.div`
  font-size: 14px;
  color: var(--text-secondary);
  line-height: 1.5;
`;

// Card Action
const CardActionWrapper = styled.div`
  grid-column-start: 2;
  grid-row: span 2;
  grid-row-start: 1;
  align-self: start;
  justify-self: end;
`;

// Card Content
const CardContentWrapper = styled.div`
  padding: 0 24px;
`;

// Card Footer
const CardFooterWrapper = styled.div`
  display: flex;
  align-items: center;
  padding: 0 24px;
`;

// Types
interface CardProps extends ComponentPropsWithoutRef<"div"> {
  children: ReactNode;
}

// Components
export function DemoCard({ children, ...props }: CardProps) {
  return (
    <CardWrapper data-slot="card" {...props}>
      {children}
    </CardWrapper>
  );
}

export function DemoCardHeader({ children, ...props }: CardProps) {
  return (
    <CardHeaderWrapper data-slot="card-header" {...props}>
      {children}
    </CardHeaderWrapper>
  );
}

export function DemoCardTitle({ children, ...props }: CardProps) {
  return (
    <CardTitleWrapper data-slot="card-title" {...props}>
      {children}
    </CardTitleWrapper>
  );
}

export function DemoCardDescription({ children, ...props }: CardProps) {
  return (
    <CardDescriptionWrapper data-slot="card-description" {...props}>
      {children}
    </CardDescriptionWrapper>
  );
}

export function DemoCardAction({ children, ...props }: CardProps) {
  return (
    <CardActionWrapper data-slot="card-action" {...props}>
      {children}
    </CardActionWrapper>
  );
}

export function DemoCardContent({ children, ...props }: CardProps) {
  return (
    <CardContentWrapper data-slot="card-content" {...props}>
      {children}
    </CardContentWrapper>
  );
}

export function DemoCardFooter({ children, ...props }: CardProps) {
  return (
    <CardFooterWrapper data-slot="card-footer" {...props}>
      {children}
    </CardFooterWrapper>
  );
}
