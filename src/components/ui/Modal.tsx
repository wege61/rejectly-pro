"use client";

import styled, { css } from "styled-components";
import { useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";

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
  /** Position rect of the element that triggered the modal (e.g. FAB), used for origin animation */
  triggerRect?: DOMRect | null;
}

// ─── Styled Components ───────────────────────────────────────────────────────

const Backdrop = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.45);
  backdrop-filter: blur(12px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: ${({ theme }) => theme.zIndex.modalBackdrop};
  padding: ${({ theme }) => theme.spacing.lg};

  @media (max-width: 640px) {
    padding: 0;
    align-items: flex-end;
  }
`;

const ModalContainer = styled(motion.div)<{ $size: string }>`
  background-color: rgba(20, 20, 28, 0.45);
  backdrop-filter: blur(60px) saturate(220%);
  -webkit-backdrop-filter: blur(60px) saturate(220%);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 36px;
  box-shadow:
    0 40px 80px -20px rgba(0, 0, 0, 0.7),
    0 0 0 1px rgba(255, 255, 255, 0.05) inset,
    inset 0 1px 1px rgba(255, 255, 255, 0.2);
  width: 100%;
  max-height: 90vh;
  margin: auto;
  display: flex;
  flex-direction: column;
  z-index: ${({ theme }) => theme.zIndex.modal};
  overflow: hidden;

  ${({ $size }) => {
    switch ($size) {
      case "sm":
        return css`max-width: 400px;`;
      case "lg":
        return css`max-width: 800px;`;
      case "xl":
        return css`max-width: 1200px;`;
      default:
        return css`max-width: 600px;`;
    }
  }}

  @media (max-width: 640px) {
    max-width: 100%;
    width: 100%;
    height: calc(100dvh - 16px);
    max-height: calc(100dvh - 16px);
    margin: 0;
    margin-top: auto;
    border-radius: 32px 32px 0 0;
    border: none;
    border-top: 1px solid rgba(255, 255, 255, 0.12);
    padding-bottom: env(safe-area-inset-bottom, 20px);
  }
`;

const ModalHeader = styled.div`
  padding: 24px 24px 16px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.sm};

  @media (max-width: 640px) {
    padding: 0 20px 14px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  }
`;

const ModalHeaderContent = styled.div`
  flex: 1;
  min-width: 0;
`;

const ModalTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.95);
  margin-bottom: 4px;
  line-height: 1.2;
  letter-spacing: -0.01em;

  @media (max-width: 640px) {
    font-size: 1.125rem;
  }
`;

const ModalDescription = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: rgba(255, 255, 255, 0.7);
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
  color: rgba(255, 255, 255, 0.6);
  transition: all ${({ theme }) => theme.transitions.fast};
  flex-shrink: 0;

  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
    color: rgba(255, 255, 255, 1);
  }

  svg {
    width: 20px;
    height: 20px;
  }
`;

const ModalBody = styled.div`
  padding: 0;
  overflow-y: auto;
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;

  /* Hide scrollbar */
  scrollbar-width: none;
  -ms-overflow-style: none;
  &::-webkit-scrollbar {
    display: none;
  }

  @media (max-width: 640px) {
    padding: 0;
  }
`;

const ModalFooter = styled.div`
  padding: 16px 24px 24px;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: ${({ theme }) => theme.spacing.sm};

  @media (max-width: 640px) {
    padding: 14px 20px 20px;
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

// ─── Framer Motion Variants ───────────────────────────────────────────────────

const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.25, ease: "easeOut" as const } },
  exit: { opacity: 0, transition: { duration: 0.2, ease: "easeIn" as const } },
};

// Factory that builds modal variants with a specific transform origin
const makeModalVariants = () => ({
  hidden: {
    opacity: 0,
    scale: 0.1,
    filter: "blur(8px)",
  },
  visible: {
    opacity: 1,
    scale: 1,
    filter: "blur(0px)",
    transition: {
      type: "spring" as const,
      stiffness: 350,
      damping: 28,
      mass: 0.8,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.08,
    filter: "blur(8px)",
    transition: {
      duration: 0.22,
      ease: [0.4, 0, 1, 1] as [number, number, number, number],
    },
  },
});

const modalVariants = makeModalVariants();

// Mobile: slides up from bottom like a native iOS sheet
const mobileModalVariants = {
  hidden: { opacity: 0, y: "100%" },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring" as const, stiffness: 300, damping: 32, mass: 0.9 },
  },
  exit: {
    opacity: 0,
    y: "100%",
    transition: { duration: 0.22, ease: [0.4, 0, 1, 1] as [number, number, number, number] },
  },
};

// ─── Component ───────────────────────────────────────────────────────────────

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
  triggerRect = null,
}) => {
  // ESC key + scroll lock
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
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollY}px`;
      document.body.style.left = "0";
      document.body.style.right = "0";
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);

      if (document.body.style.position === "fixed") {
        const savedScrollY =
          parseInt(document.body.style.top || "0", 10) * -1;
        document.body.style.position = "";
        document.body.style.top = "";
        document.body.style.left = "";
        document.body.style.right = "";
        document.body.style.overflow = "";
        window.scrollTo(0, savedScrollY);
      }
    };
  }, [isOpen, onClose, closeOnEscape]);

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget && closeOnBackdropClick && onClose) {
      onClose();
    }
  };

  // Detect mobile for variant selection
  const isMobile =
    typeof window !== "undefined" && window.innerWidth <= 640;

  // Compute transformOrigin from trigger element rect (FAB position)
  const transformOrigin: string = (() => {
    if (!triggerRect || typeof window === "undefined") return "center center";
    const fabCenterX = triggerRect.left + triggerRect.width / 2;
    const fabCenterY = triggerRect.top + triggerRect.height / 2;
    
    // ModalContainer is perfectly centered in the viewport.
    // transformOrigin is relative to the element (50% 50% = center).
    // We want the origin to be exactly at the FAB's screen coordinates.
    // So we offset by the difference between the FAB center and the viewport center.
    const offsetX = fabCenterX - window.innerWidth / 2;
    const offsetY = fabCenterY - window.innerHeight / 2;
    
    return `calc(50% + ${offsetX}px) calc(50% + ${offsetY}px)`;
  })();

  const modalContent = (
    <AnimatePresence mode="wait">
      {isOpen && (
        <Backdrop
          key="modal-backdrop"
          variants={backdropVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          onClick={handleBackdropClick}
        >
          <ModalContainer
            $size={size}
            variants={isMobile ? mobileModalVariants : modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            style={!isMobile ? { transformOrigin } : undefined}
            onClick={(e) => e.stopPropagation()}
          >

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
      )}
    </AnimatePresence>
  );

  return typeof document !== "undefined"
    ? createPortal(modalContent, document.body)
    : null;
};

Modal.Body = ModalBody;
Modal.Footer = ModalFooter;
