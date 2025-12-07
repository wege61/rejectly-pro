"use client";

import { cn } from "@/lib/utils";
import React, { useState, useRef } from "react";
import styled, { keyframes } from "styled-components";

const dotPatterns = {
  light: {
    default: `url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' width='16' height='16' fill='none'%3E%3Ccircle fill='%23d4d4d4' cx='10' cy='10' r='2.5'%3E%3C/circle%3E%3C/svg%3E")`,
    hover: `url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' width='16' height='16' fill='none'%3E%3Ccircle fill='%23FF7A73' cx='10' cy='10' r='2.5'%3E%3C/circle%3E%3C/svg%3E")`,
  },
  dark: {
    default: `url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' width='16' height='16' fill='none'%3E%3Ccircle fill='%23404040' cx='10' cy='10' r='2.5'%3E%3C/circle%3E%3C/svg%3E")`,
    hover: `url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' width='16' height='16' fill='none'%3E%3Ccircle fill='%23FF7A73' cx='10' cy='10' r='2.5'%3E%3C/circle%3E%3C/svg%3E")`,
  },
};

const Container = styled.div`
  position: relative;
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: center;
`;

const DotPatternBase = styled.div`
  pointer-events: none;
  position: absolute;
  inset: 0;
`;

const DotPatternLight = styled(DotPatternBase)`
  background-image: ${dotPatterns.light.default};

  [data-theme="dark"] & {
    display: none;
  }
`;

const DotPatternDark = styled(DotPatternBase)`
  display: none;
  background-image: ${dotPatterns.dark.default};

  [data-theme="dark"] & {
    display: block;
  }
`;

const HoverPattern = styled(DotPatternBase)<{ $mouseX: number; $mouseY: number; $isHovering: boolean }>`
  background-image: ${dotPatterns.light.hover};
  opacity: ${({ $isHovering }) => ($isHovering ? 1 : 0)};
  transition: opacity 0.3s ease;
  mask-image: ${({ $mouseX, $mouseY }) =>
    `radial-gradient(200px circle at ${$mouseX}px ${$mouseY}px, black 0%, transparent 100%)`};
  -webkit-mask-image: ${({ $mouseX, $mouseY }) =>
    `radial-gradient(200px circle at ${$mouseX}px ${$mouseY}px, black 0%, transparent 100%)`};

  [data-theme="dark"] & {
    background-image: ${dotPatterns.dark.hover};
  }
`;

const Content = styled.div`
  position: relative;
  z-index: 20;
`;

export const HeroHighlight = ({
  children,
  className,
  containerClassName,
}: {
  children: React.ReactNode;
  className?: string;
  containerClassName?: string;
}) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const { left, top } = containerRef.current.getBoundingClientRect();
    setMousePosition({
      x: e.clientX - left,
      y: e.clientY - top,
    });
  };

  return (
    <Container
      ref={containerRef}
      className={cn(containerClassName)}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <DotPatternLight />
      <DotPatternDark />
      <HoverPattern
        $mouseX={mousePosition.x}
        $mouseY={mousePosition.y}
        $isHovering={isHovering}
      />
      <Content className={cn(className)}>{children}</Content>
    </Container>
  );
};

const highlightAnimation = keyframes`
  from {
    background-size: 0% 100%;
  }
  to {
    background-size: 100% 100%;
  }
`;

const HighlightSpan = styled.span`
  position: relative;
  display: inline-block;
  background: linear-gradient(to right, #FF7A73, #FF9D98);
  background-repeat: no-repeat;
  background-position: left center;
  background-size: 0% 100%;
  border-radius: 8px;
  padding: 0 4px 4px;
  animation: ${highlightAnimation} 2s ease forwards;
  animation-delay: 0.5s;
`;

export const Highlight = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <HighlightSpan className={cn(className)}>
      {children}
    </HighlightSpan>
  );
};
