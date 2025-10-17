'use client';

import styled, { keyframes, css } from 'styled-components';
import { useToast, Toast as ToastType } from '@/contexts/ToastContext';
import { createPortal } from 'react-dom';

const slideIn = keyframes`
  from {
    transform: translateX(400px);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
`;

const slideOut = keyframes`
  from {
    transform: translateX(0);
    opacity: 1;
  }
  to {
    transform: translateX(400px);
    opacity: 0;
  }
`;

const ToastContainer = styled.div`
  position: fixed;
  top: ${({ theme }) => theme.spacing.lg};
  right: ${({ theme }) => theme.spacing.lg};
  z-index: ${({ theme }) => theme.zIndex.tooltip};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
  pointer-events: none;
  
  @media (max-width: 640px) {
    left: ${({ theme }) => theme.spacing.md};
    right: ${({ theme }) => theme.spacing.md};
  }
`;

const ToastItem = styled.div<{ $variant: string; $isExiting?: boolean }>`
  display: flex;
  align-items: flex-start;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing.md};
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.radius.md};
  box-shadow: ${({ theme }) => theme.shadow.lg};
  min-width: 300px;
  max-width: 400px;
  pointer-events: auto;
  animation: ${slideIn} 0.3s ease forwards;
  border-left: 4px solid;
  
  ${({ $isExiting }) =>
    $isExiting &&
    css`
      animation: ${slideOut} 0.3s ease forwards;
    `}
  
  ${({ $variant, theme }) => {
    switch ($variant) {
      case 'success':
        return css`
          border-left-color: ${theme.colors.success};
        `;
      case 'error':
        return css`
          border-left-color: ${theme.colors.error};
        `;
      case 'warning':
        return css`
          border-left-color: ${theme.colors.warning};
        `;
      default: // info
        return css`
          border-left-color: ${theme.colors.info};
        `;
    }
  }}
  
  @media (max-width: 640px) {
    min-width: unset;
    max-width: unset;
  }
`;

const IconWrapper = styled.div<{ $variant: string }>`
  flex-shrink: 0;
  width: 20px;
  height: 20px;
  
  ${({ $variant, theme }) => {
    switch ($variant) {
      case 'success':
        return css`
          color: ${theme.colors.success};
        `;
      case 'error':
        return css`
          color: ${theme.colors.error};
        `;
      case 'warning':
        return css`
          color: ${theme.colors.warning};
        `;
      default: // info
        return css`
          color: ${theme.colors.info};
        `;
    }
  }}
`;

const ToastMessage = styled.p`
  flex: 1;
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.textPrimary};
  margin: 0;
  line-height: ${({ theme }) => theme.typography.lineHeight.normal};
`;

const CloseButton = styled.button`
  flex-shrink: 0;
  width: 20px;
  height: 20px;
  padding: 0;
  color: ${({ theme }) => theme.colors.textSecondary};
  transition: color ${({ theme }) => theme.transitions.fast};
  
  &:hover {
    color: ${({ theme }) => theme.colors.textPrimary};
  }
  
  svg {
    width: 100%;
    height: 100%;
  }
`;

// Icons
const SuccessIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
    <path
      fillRule="evenodd"
      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
      clipRule="evenodd"
    />
  </svg>
);

const ErrorIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
    <path
      fillRule="evenodd"
      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z"
      clipRule="evenodd"
    />
  </svg>
);

const WarningIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
    <path
      fillRule="evenodd"
      d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z"
      clipRule="evenodd"
    />
  </svg>
);

const InfoIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
    <path
      fillRule="evenodd"
      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z"
      clipRule="evenodd"
    />
  </svg>
);

const CloseIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const getIcon = (variant: string) => {
  switch (variant) {
    case 'success':
      return <SuccessIcon />;
    case 'error':
      return <ErrorIcon />;
    case 'warning':
      return <WarningIcon />;
    default:
      return <InfoIcon />;
  }
};

const ToastItemComponent: React.FC<{ toast: ToastType }> = ({ toast }) => {
  const { removeToast } = useToast();

  return (
    <ToastItem $variant={toast.variant}>
      <IconWrapper $variant={toast.variant}>{getIcon(toast.variant)}</IconWrapper>
      <ToastMessage>{toast.message}</ToastMessage>
      <CloseButton onClick={() => removeToast(toast.id)} aria-label="Close notification">
        <CloseIcon />
      </CloseButton>
    </ToastItem>
  );
};

export const ToastList: React.FC = () => {
  const { toasts } = useToast();

  if (toasts.length === 0) return null;

  const content = (
    <ToastContainer>
      {toasts.map((toast) => (
        <ToastItemComponent key={toast.id} toast={toast} />
      ))}
    </ToastContainer>
  );

  return typeof document !== 'undefined' ? createPortal(content, document.body) : null;
};