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
  gap: 24px;
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
      grid-template-rows: 14rem 7rem 14rem;
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
  border-radius: 24px;
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(40px) saturate(150%);
  -webkit-backdrop-filter: blur(40px) saturate(150%);
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);

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
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.04), inset 0 1px 0 rgba(255, 255, 255, 0.4);
  border: 1px solid rgba(0, 0, 0, 0.05);

  /* Dark styles */
  @media (prefers-color-scheme: dark) {
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.08);
  }

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.2);
    border-color: rgba(255, 255, 255, 0.15);
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
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  color: var(--accent);
  margin-bottom: 12px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 56px;
  height: 56px;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.05);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);

  svg {
    width: 26px;
    height: 26px;
  }

  @media (max-width: 640px) {
    width: 48px;
    height: 48px;
    border-radius: 12px;
    margin-bottom: 12px;
    svg {
      width: 22px;
      height: 22px;
    }
  }
`;

const ValueText = styled.span`
  font-size: 50px;
  font-weight: 700;
  letter-spacing: -0.05em;
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
  font-size: 20px;
  font-weight: 600;
  letter-spacing: -0.02em;
  color: rgba(255, 255, 255, 0.95);
  margin-top: 4px;
  margin-bottom: 8px;

  @media (max-width: 640px) {
    font-size: 16px;
  }
`;

const DescriptionText = styled.p`
  max-width: 32rem;
  color: rgba(255, 255, 255, 0.6);
  font-size: 15px;
  letter-spacing: -0.01em;
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
