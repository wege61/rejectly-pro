"use client";

import styled, { css, keyframes } from "styled-components";
import { useEffect } from "react";
import { createPortal } from "react-dom";

interface ModalProps {
  isOpen: boolean;
  onClose?: () => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
  showCloseButton?: boolean;
  closeOnBackdropClick?: boolean;
  closeOnEscape?: boolean;
}

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const slideUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const Backdrop = styled.div<{ $isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: ${({ theme }) => theme.zIndex.modalBackdrop};
  padding: ${({ theme }) => theme.spacing.lg};
  animation: ${fadeIn} 0.2s ease;
  overflow-y: auto;

  @media (max-width: 640px) {
    padding: 0;
    align-items: flex-end;
  }
`;

const ModalContainer = styled.div<{ $size: string }>`
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.radius.lg};
  box-shadow: ${({ theme }) => theme.shadow.xl};
  width: 100%;
  max-height: 90vh;
  margin: auto;
  display: flex;
  flex-direction: column;
  animation: ${slideUp} 0.3s ease;
  z-index: ${({ theme }) => theme.zIndex.modal};

  ${({ $size }) => {
    switch ($size) {
      case "sm":
        return css`
          max-width: 400px;
        `;
      case "lg":
        return css`
          max-width: 800px;
        `;
      case "xl":
        return css`
          max-width: 1200px;
        `;
      default: // md
        return css`
          max-width: 600px;
        `;
    }
  }}

  @media (max-width: 640px) {
    max-width: 100%;
    max-height: 100vh;
    margin: 0;
    border-radius: 16px 16px 0 0;
  }
`;

const ModalHeader = styled.div`
  padding: 16px 20px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.sm};

  @media (max-width: 640px) {
    padding: 14px 16px;
  }
`;

const ModalHeaderContent = styled.div`
  flex: 1;
  min-width: 0;
`;

const ModalTitle = styled.h2`
  font-size: 1.125rem;
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.textPrimary};
  margin-bottom: 2px;
  line-height: 1.3;

  @media (max-width: 640px) {
    font-size: 1rem;
  }
`;

const ModalDescription = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-bottom: 0;
  line-height: 1.4;

  @media (max-width: 640px) {
    font-size: ${({ theme }) => theme.typography.fontSize.xs};
  }
`;

const CloseButton = styled.button`
  width: 32px;
  height: 32px;
  border-radius: ${({ theme }) => theme.radius.md};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.textSecondary};
  transition: all ${({ theme }) => theme.transitions.fast};
  flex-shrink: 0;

  &:hover {
    background-color: ${({ theme }) => theme.colors.surfaceHover};
    color: ${({ theme }) => theme.colors.textPrimary};
  }

  svg {
    width: 20px;
    height: 20px;
  }
`;

const ModalBody = styled.div`
  padding: 20px;
  overflow-y: auto;
  flex: 1;

  @media (max-width: 640px) {
    padding: 16px;
  }
`;

const ModalFooter = styled.div`
  padding: 16px 20px;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: ${({ theme }) => theme.spacing.sm};

  @media (max-width: 640px) {
    padding: 14px 16px;
    flex-direction: column-reverse;
    gap: 10px;

    > button {
      width: 100%;
    }
  }
`;

const CloseIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={2}
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M6 18L18 6M6 6l12 12"
    />
  </svg>
);

export const Modal: React.FC<ModalProps> & {
  Body: typeof ModalBody;
  Footer: typeof ModalFooter;
} = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  size = "md",
  showCloseButton = true,
  closeOnBackdropClick = true,
  closeOnEscape = true,
}) => {
  // ESC tuşu ile kapatma ve scroll engelleme
  useEffect(() => {
    let scrollY = 0;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen && closeOnEscape && onClose) {
        onClose();
      }
    };

    if (isOpen) {
      scrollY = window.scrollY;
      document.addEventListener("keydown", handleEscape);

      // Body scroll'u engelle - pozisyonu koru
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollY}px`;
      document.body.style.left = "0";
      document.body.style.right = "0";
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);

      if (document.body.style.position === "fixed") {
        const savedScrollY = parseInt(document.body.style.top || "0", 10) * -1;
        document.body.style.position = "";
        document.body.style.top = "";
        document.body.style.left = "";
        document.body.style.right = "";
        document.body.style.overflow = "";
        window.scrollTo(0, savedScrollY);
      }
    };
  }, [isOpen, onClose, closeOnEscape]);

  if (!isOpen) return null;

  // Backdrop'a tıklayınca kapatma
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget && closeOnBackdropClick && onClose) {
      onClose();
    }
  };

  const modalContent = (
    <Backdrop $isOpen={isOpen} onClick={handleBackdropClick}>
      <ModalContainer $size={size} onClick={(e) => e.stopPropagation()}>
        {(title || description || showCloseButton) && (
          <ModalHeader>
            <ModalHeaderContent>
              {title && <ModalTitle>{title}</ModalTitle>}
              {description && (
                <ModalDescription>{description}</ModalDescription>
              )}
            </ModalHeaderContent>
            {showCloseButton && onClose && (
              <CloseButton onClick={onClose} aria-label="Close modal">
                <CloseIcon />
              </CloseButton>
            )}
          </ModalHeader>
        )}
        {children}
      </ModalContainer>
    </Backdrop>
  );

  // Portal kullanarak body'e render et
  return typeof document !== "undefined"
    ? createPortal(modalContent, document.body)
    : null;
};

Modal.Body = ModalBody;
Modal.Footer = ModalFooter;
