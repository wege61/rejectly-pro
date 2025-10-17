'use client';

import styled, { keyframes, css } from 'styled-components';

type SpinnerSize = 'sm' | 'md' | 'lg' | 'xl';
type SpinnerVariant = 'primary' | 'white' | 'current';

interface SpinnerProps {
  size?: SpinnerSize;
  variant?: SpinnerVariant;
  className?: string;
}

const spin = keyframes`
  to {
    transform: rotate(360deg);
  }
`;

const StyledSpinner = styled.div<SpinnerProps>`
  display: inline-block;
  border-radius: 50%;
  border-style: solid;
  animation: ${spin} 0.6s linear infinite;
  
  /* Sizes */
  ${({ size = 'md' }) => {
    switch (size) {
      case 'sm':
        return css`
          width: 16px;
          height: 16px;
          border-width: 2px;
        `;
      case 'lg':
        return css`
          width: 32px;
          height: 32px;
          border-width: 3px;
        `;
      case 'xl':
        return css`
          width: 48px;
          height: 48px;
          border-width: 4px;
        `;
      default: // md
        return css`
          width: 24px;
          height: 24px;
          border-width: 2px;
        `;
    }
  }}
  
  /* Variants */
  ${({ variant = 'primary', theme }) => {
    switch (variant) {
      case 'white':
        return css`
          border-color: rgba(255, 255, 255, 0.3);
          border-top-color: white;
        `;
      case 'current':
        return css`
          border-color: currentColor;
          border-top-color: transparent;
          opacity: 0.3;
        `;
      default: // primary
        return css`
          border-color: ${theme.colors.primaryLight};
          border-top-color: ${theme.colors.primary};
        `;
    }
  }}
`;

const SpinnerContainer = styled.div<{ $centered?: boolean }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  
  ${({ $centered }) =>
    $centered &&
    css`
      width: 100%;
      padding: ${({ theme }) => theme.spacing.xl};
    `}
`;

export const Spinner: React.FC<SpinnerProps & { centered?: boolean }> = ({
  centered,
  ...props
}) => {
  return (
    <SpinnerContainer $centered={centered}>
      <StyledSpinner {...props} />
    </SpinnerContainer>
  );
};