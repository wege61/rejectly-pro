"use client";

import { ComponentPropsWithoutRef, ReactNode } from "react";
import styled from "styled-components";

interface BentoGridProps extends ComponentPropsWithoutRef<"div"> {
  children: ReactNode;
  className?: string;
}

interface BentoCardProps extends ComponentPropsWithoutRef<"div"> {
  name: string;
  className?: string;
  background?: ReactNode;
  Icon: React.ElementType;
  description: string;
  href: string;
  cta: string;
  value?: string | number;
}

const ArrowRightIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={2}
    stroke="currentColor"
    style={{ width: 16, height: 16 }}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
    />
  </svg>
);

const BentoGridWrapper = styled.div`
  display: grid;
  width: 100%;
  gap: 16px;
  grid-template-columns: 1fr;
  grid-auto-rows: auto;

  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
    grid-auto-rows: 12rem;
  }

  @media (min-width: 1024px) {
    grid-template-columns: repeat(3, 1fr);
  }

  &.lg\\:grid-rows-3 {
    @media (min-width: 1024px) {
      grid-template-rows: repeat(3, 14rem);
    }
  }

  &.lg\\:grid-rows-2 {
    @media (min-width: 1024px) {
      grid-template-rows: repeat(2, 14rem);
    }
  }
`;

interface BentoCardWrapperProps {
  $colSpan?: number;
  $rowSpan?: number;
  $lgColSpan?: number;
  $lgRowSpan?: number;
  $lgColStart?: number;
  $lgColEnd?: number;
  $lgRowStart?: number;
  $lgRowEnd?: number;
}

const BentoCardWrapper = styled.div<BentoCardWrapperProps>`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  overflow: hidden;
  border-radius: 16px;
  background: var(--bg-alt);
  cursor: pointer;
  transition: all 0.3s ease;

  /* Default single column on mobile */
  grid-column: span 1;
  grid-row: span 1;

  /* Tablet (md) */
  @media (min-width: 768px) {
    grid-column: span ${({ $colSpan }) => $colSpan || 1};
    grid-row: span ${({ $rowSpan }) => $rowSpan || 1};
  }

  /* Desktop (lg) */
  @media (min-width: 1024px) {
    ${({ $lgColStart, $lgColEnd, $lgColSpan }) => {
      if ($lgColStart && $lgColEnd) {
        return `grid-column: ${$lgColStart} / ${$lgColEnd};`;
      }
      return `grid-column: span ${$lgColSpan || 1};`;
    }}
    ${({ $lgRowStart, $lgRowEnd, $lgRowSpan }) => {
      if ($lgRowStart && $lgRowEnd) {
        return `grid-row: ${$lgRowStart} / ${$lgRowEnd};`;
      }
      return `grid-row: span ${$lgRowSpan || 1};`;
    }}
  }

  /* Light styles */
  box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.03), 0 2px 4px rgba(0, 0, 0, 0.05),
    0 12px 24px rgba(0, 0, 0, 0.05);

  /* Dark styles */
  @media (prefers-color-scheme: dark) {
    box-shadow: 0 -20px 80px -20px rgba(255, 255, 255, 0.12) inset;
    border: 1px solid rgba(255, 255, 255, 0.1);
  }

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.12);
  }

  &:hover .bento-icon {
    transform: scale(0.85);
  }

  &:hover .bento-content {
    transform: translateY(-32px);
  }

  &:hover .bento-cta-desktop {
    transform: translateY(0);
    opacity: 1;
  }

  &:hover .bento-overlay {
    background: rgba(0, 0, 0, 0.03);
  }

  @media (prefers-color-scheme: dark) {
    &:hover .bento-overlay {
      background: rgba(255, 255, 255, 0.05);
    }
  }

  @media (max-width: 640px) {
    min-height: 180px;
  }
`;

const BackgroundContainer = styled.div`
  position: absolute;
  inset: 0;
  pointer-events: none;
`;

const ContentContainer = styled.div`
  padding: 20px;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
`;

const ContentInner = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  transform-origin: bottom left;
  transition: all 0.3s ease;

  @media (max-width: 1024px) {
    transform: none !important;
  }
`;

const StyledIcon = styled.div`
  transform-origin: left;
  transition: all 0.3s ease;
  color: var(--accent);
  margin-bottom: 8px;

  svg {
    width: 36px;
    height: 36px;
  }

  @media (max-width: 640px) {
    svg {
      width: 28px;
      height: 28px;
    }
  }
`;

const ValueText = styled.span`
  font-size: 48px;
  font-weight: 700;
  color: var(--accent);
  line-height: 1;
  margin-bottom: 4px;

  @media (max-width: 1024px) {
    font-size: 40px;
  }

  @media (max-width: 640px) {
    font-size: 36px;
  }
`;

const TitleText = styled.h3`
  font-size: 18px;
  font-weight: 600;
  color: var(--text-color);
  margin-top: 4px;

  @media (max-width: 640px) {
    font-size: 16px;
  }
`;

const DescriptionText = styled.p`
  max-width: 32rem;
  color: var(--text-secondary);
  font-size: 14px;
  line-height: 1.4;
`;

const CTAContainerMobile = styled.div`
  display: flex;
  width: 100%;
  flex-direction: row;
  align-items: center;
  transform: translateY(0);
  opacity: 1;
  transition: all 0.3s ease;
  margin-top: 12px;

  @media (min-width: 1025px) {
    display: none;
  }
`;

const CTAContainerDesktop = styled.div`
  position: absolute;
  bottom: 0;
  display: none;
  width: 100%;
  flex-direction: row;
  align-items: center;
  padding: 20px;
  transform: translateY(40px);
  opacity: 0;
  transition: all 0.3s ease;

  @media (min-width: 1025px) {
    display: flex;
  }
`;

const Overlay = styled.div`
  pointer-events: none;
  position: absolute;
  inset: 0;
  transition: all 0.3s ease;
`;

const StyledLink = styled.a`
  display: flex;
  align-items: center;
  gap: 6px;
  color: var(--accent);
  font-weight: 500;
  font-size: 14px;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;

const BentoGrid = ({ children, className, ...props }: BentoGridProps) => {
  return (
    <BentoGridWrapper className={className} {...props}>
      {children}
    </BentoGridWrapper>
  );
};

const BentoCard = ({
  name,
  className,
  background,
  Icon,
  description,
  href,
  cta,
  value,
  ...props
}: BentoCardProps) => {
  // Parse className to extract grid values
  const parseValue = (prefix: string, cls: string = ""): number | undefined => {
    const match = cls.match(new RegExp(`${prefix}-(\\d+)`));
    return match ? parseInt(match[1], 10) : undefined;
  };

  const colSpan = parseValue("col-span", className);
  const rowSpan = parseValue("row-span", className);
  const lgColSpan = parseValue("lg:col-span", className);
  const lgRowSpan = parseValue("lg:row-span", className);
  const lgColStart = parseValue("lg:col-start", className);
  const lgColEnd = parseValue("lg:col-end", className);
  const lgRowStart = parseValue("lg:row-start", className);
  const lgRowEnd = parseValue("lg:row-end", className);

  return (
    <BentoCardWrapper
      $colSpan={colSpan}
      $rowSpan={rowSpan}
      $lgColSpan={lgColSpan}
      $lgRowSpan={lgRowSpan}
      $lgColStart={lgColStart}
      $lgColEnd={lgColEnd}
      $lgRowStart={lgRowStart}
      $lgRowEnd={lgRowEnd}
      {...props}
    >
      <BackgroundContainer>{background}</BackgroundContainer>
      <ContentContainer>
        <ContentInner className="bento-content">
          <StyledIcon className="bento-icon">
            <Icon />
          </StyledIcon>
          {value !== undefined && <ValueText>{value}</ValueText>}
          <TitleText>{name}</TitleText>
          <DescriptionText>{description}</DescriptionText>
        </ContentInner>

        <CTAContainerMobile>
          <StyledLink href={href}>
            {cta}
            <ArrowRightIcon />
          </StyledLink>
        </CTAContainerMobile>
      </ContentContainer>

      <CTAContainerDesktop className="bento-cta-desktop">
        <StyledLink href={href}>
          {cta}
          <ArrowRightIcon />
        </StyledLink>
      </CTAContainerDesktop>

      <Overlay className="bento-overlay" />
    </BentoCardWrapper>
  );
};

export { BentoCard, BentoGrid };
