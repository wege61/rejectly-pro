"use client";

import styled, { keyframes, css } from "styled-components";

const shimmer = keyframes`
  0% {
    background-position: -1000px 0;
  }
  100% {
    background-position: 1000px 0;
  }
`;

interface SkeletonProps {
  width?: string;
  height?: string;
  circle?: boolean;
  className?: string;
}

const StyledSkeleton = styled.div<SkeletonProps>`
  display: inline-block;
  background: linear-gradient(
    90deg,
    ${({ theme }) => theme.colors.surfaceHover} 0%,
    ${({ theme }) => theme.colors.border} 50%,
    ${({ theme }) => theme.colors.surfaceHover} 100%
  );
  background-size: 1000px 100%;
  animation: ${shimmer} 2s infinite linear;

  ${({ width }) =>
    width &&
    css`
      width: ${width};
    `}

  ${({ height }) =>
    height &&
    css`
      height: ${height};
    `}
  
  ${({ circle, width, height }) =>
    circle &&
    css`
      border-radius: 50%;
      width: ${width || height || "40px"};
      height: ${height || width || "40px"};
    `}
  
  ${({ circle, theme }) =>
    !circle &&
    css`
      border-radius: ${theme.radius.md};
    `}
`;

export const Skeleton: React.FC<SkeletonProps> = ({
  width,
  height,
  circle,
  className,
}) => {
  return (
    <StyledSkeleton
      width={width}
      height={height}
      circle={circle}
      className={className}
    />
  );
};

// Pre-built skeleton components
export const SkeletonText = styled(Skeleton)`
  width: 100%;
  height: 16px;
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

export const SkeletonTitle = styled(Skeleton)`
  width: 60%;
  height: 24px;
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

export const SkeletonCircle = styled(Skeleton).attrs({ circle: true })``;

export const SkeletonButton = styled(Skeleton)`
  width: 120px;
  height: 40px;
`;

export const SkeletonCard = styled.div`
  background-color: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.lg};
  padding: ${({ theme }) => theme.spacing.lg};
  animation: ${({ theme }) => theme.animations.fadeIn} 0.3s ease;
`;
