"use client";
import { cn } from "@/lib/utils";
import React, { ReactNode } from "react";
import styled, { keyframes } from "styled-components";

const auroraAnimation = keyframes`
  0% {
    background-position: 50% 50%, 50% 50%;
  }
  50% {
    background-position: 350% 50%, 350% 50%;
  }
  100% {
    background-position: 50% 50%, 50% 50%;
  }
`;

const AuroraWrapper = styled.div<{ $showRadialGradient?: boolean }>`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: var(--bg-color);
  transition: background 0.3s ease;
  overflow: hidden;
`;

const AuroraOverlay = styled.div`
  position: absolute;
  inset: 0;
  overflow: hidden;

  --aurora: repeating-linear-gradient(
    100deg,
    #22c55e 10%,
    #4ade80 15%,
    #16a34a 20%,
    #86efac 25%,
    #15803d 30%
  );
  --dark-gradient: repeating-linear-gradient(
    100deg,
    var(--bg-color) 0%,
    var(--bg-color) 7%,
    transparent 10%,
    transparent 12%,
    var(--bg-color) 16%
  );
  --light-gradient: repeating-linear-gradient(
    100deg,
    var(--bg-color) 0%,
    var(--bg-color) 7%,
    transparent 10%,
    transparent 12%,
    var(--bg-color) 16%
  );
`;

const AuroraEffect = styled.div<{ $showRadialGradient?: boolean }>`
  pointer-events: none;
  position: absolute;
  inset: -10px;
  opacity: 0.6;
  filter: blur(10px);
  will-change: transform;

  background-image: var(--dark-gradient), var(--aurora);
  background-size: 300%, 200%;
  background-position: 50% 50%, 50% 50%;

  &::after {
    content: "";
    position: absolute;
    inset: 0;
    background-image: var(--dark-gradient), var(--aurora);
    background-size: 200%, 100%;
    background-attachment: fixed;
    mix-blend-mode: difference;
    animation: ${auroraAnimation} 60s linear infinite;
  }

  ${({ $showRadialGradient }) =>
    $showRadialGradient &&
    `
    mask-image: radial-gradient(ellipse at 100% 0%, black 10%, transparent 70%);
    -webkit-mask-image: radial-gradient(ellipse at 100% 0%, black 10%, transparent 70%);
  `}

  /* Light mode adjustments */
  [data-theme="light"] & {
    filter: blur(10px) invert(1);
    background-image: var(--light-gradient), var(--aurora);

    &::after {
      background-image: var(--light-gradient), var(--aurora);
    }
  }
`;

const AuroraContent = styled.div`
  position: relative;
  z-index: 10;
  width: 100%;
`;

interface AuroraBackgroundProps extends React.HTMLProps<HTMLDivElement> {
  children: ReactNode;
  showRadialGradient?: boolean;
}

export const AuroraBackground = ({
  className,
  children,
  showRadialGradient = true,
  ...props
}: AuroraBackgroundProps) => {
  return (
    <AuroraWrapper className={cn(className)} {...props}>
      <AuroraOverlay>
        <AuroraEffect $showRadialGradient={showRadialGradient} />
      </AuroraOverlay>
      <AuroraContent>{children}</AuroraContent>
    </AuroraWrapper>
  );
};

export default AuroraBackground;
