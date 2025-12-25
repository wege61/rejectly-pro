"use client";
import { cn } from "@/lib/utils";
import React, { ReactNode } from "react";
import styled, { keyframes } from "styled-components";

const auroraAnimation = keyframes`
  from {
    background-position: 50% 50%, 50% 50%;
  }
  to {
    background-position: 350% 50%, 350% 50%;
  }
`;

const AuroraWrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: var(--bg-alt);
  transition: background 0.3s ease;
  min-height: 600px;

  @media (min-width: 768px) {
    min-height: 600px;
  }

  /* Top fade overlay for smooth blend-in */
  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 80px;
    background: linear-gradient(to bottom, var(--bg-alt) 0%, transparent 100%);
    z-index: 5;
    pointer-events: none;
  }
`;

const AuroraOverlay = styled.div`
  position: absolute;
  inset: 0;
  overflow: hidden;

  --green-400: #4ade80;
  --green-500: #22c55e;
  --green-600: #16a34a;
  --green-300: #86efac;
  --green-700: #15803d;
  --black: #000;
  --white: #fff;
  --transparent: transparent;

  --aurora: repeating-linear-gradient(
    100deg,
    var(--green-500) 10%,
    var(--green-400) 15%,
    var(--green-600) 20%,
    var(--green-300) 25%,
    var(--green-700) 30%
  );

  --dark-gradient: repeating-linear-gradient(
    100deg,
    var(--black) 0%,
    var(--black) 7%,
    var(--transparent) 10%,
    var(--transparent) 12%,
    var(--black) 16%
  );

  --white-gradient: repeating-linear-gradient(
    100deg,
    var(--white) 0%,
    var(--white) 7%,
    var(--transparent) 10%,
    var(--transparent) 12%,
    var(--white) 16%
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

  /* Light mode - add invert */
  @media (prefers-color-scheme: light) {
    filter: blur(10px) invert(1);
    background-image: var(--white-gradient), var(--aurora);

    &::after {
      background-image: var(--white-gradient), var(--aurora);
    }
  }

  /* Support for data-theme attribute */
  [data-theme="light"] & {
    filter: blur(10px) invert(1);
    background-image: var(--white-gradient), var(--aurora);

    &::after {
      background-image: var(--white-gradient), var(--aurora);
    }
  }

  [data-theme="dark"] & {
    filter: blur(10px);
    background-image: var(--dark-gradient), var(--aurora);

    &::after {
      background-image: var(--dark-gradient), var(--aurora);
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
