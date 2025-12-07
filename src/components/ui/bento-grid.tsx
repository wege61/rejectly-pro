"use client";
import styled from "styled-components";
import { cn } from "@/lib/utils";
import React from "react";

const BentoGridWrapper = styled.div`
  display: grid;
  gap: 16px;

  @media (min-width: 768px) {
    grid-auto-rows: 18rem;
    grid-template-columns: repeat(3, 1fr);
  }
`;

const BentoGridItemWrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 16px;
  border-radius: 24px;
  background: var(--bg-alt);
  overflow: hidden;
  transition: all 0.3s ease;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: inherit;
    padding: 1px;
    background: linear-gradient(
      180deg,
      rgba(255, 107, 107, 0.2) 0%,
      rgba(255, 107, 107, 0.05) 100%
    );
    -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
    pointer-events: none;
  }

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);

    &::before {
      background: linear-gradient(
        180deg,
        rgba(255, 107, 107, 0.4) 0%,
        rgba(255, 107, 107, 0.1) 100%
      );
    }
  }

  &.md-col-span-2 {
    @media (min-width: 768px) {
      grid-column: span 2;
    }
  }
`;

const ItemHeader = styled.div`
  flex: 1;
`;

const ItemContent = styled.div`
  transition: transform 0.3s ease;

  ${BentoGridItemWrapper}:hover & {
    transform: translateY(-2px);
  }
`;

const ItemIcon = styled.div`
  margin-bottom: 8px;
`;

const ItemTitle = styled.h4`
  font-size: 16px;
  font-weight: 700;
  color: var(--text-color);
  margin-bottom: 8px;
  line-height: 1.4;
`;

const ItemDescription = styled.p`
  font-size: 14px;
  color: var(--text-secondary);
  line-height: 1.6;
`;

export const BentoGrid = ({
  className,
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) => {
  return (
    <BentoGridWrapper className={cn(className)}>
      {children}
    </BentoGridWrapper>
  );
};

export const BentoGridItem = ({
  className,
  title,
  description,
  header,
  icon,
}: {
  className?: string;
  title?: string | React.ReactNode;
  description?: string | React.ReactNode;
  header?: React.ReactNode;
  icon?: React.ReactNode;
}) => {
  const isColSpan2 = className?.includes("md:col-span-2");

  return (
    <BentoGridItemWrapper className={cn(isColSpan2 && "md-col-span-2", className)}>
      <ItemHeader>{header}</ItemHeader>
      <ItemContent>
        <ItemIcon>{icon}</ItemIcon>
        <ItemTitle>{title}</ItemTitle>
        <ItemDescription>{description}</ItemDescription>
      </ItemContent>
    </BentoGridItemWrapper>
  );
};
