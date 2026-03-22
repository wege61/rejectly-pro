"use client";

import styled from "styled-components";
import { useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";

interface EditorModalProps {
  isOpen: boolean;
  onClose?: () => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  floatingBar?: React.ReactNode;
  size?: "md" | "lg" | "xl";
}

// ─── Styled Components ───────────────────────────────────────────────────────

const Backdrop = styled(motion.div)`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 24px;

  @media (max-width: 640px) {
    padding: 0;
    align-items: flex-end;
  }
`;

// Wrapper: positioning context for the floating bar, same width as Container
// but NOT a stacking context (no backdrop-filter), so bar's blur works correctly
const ModalWrapper = styled.div<{ $size: string }>`
  position: relative;
  width: 100%;
  max-width: ${({ $size }) =>
    $size === "xl" ? "1200px" : $size === "lg" ? "800px" : "600px"};

  @media (max-width: 640px) {
    max-width: 100%;
    height: calc(100dvh - 16px);
  }
`;

const Container = styled(motion.div)<{ $size: string }>`
  background: rgba(20, 20, 28, 0.72);
  backdrop-filter: blur(60px) saturate(220%);
  -webkit-backdrop-filter: blur(60px) saturate(220%);
  border: 1px solid rgba(255, 255, 255, 0.10);
  border-radius: 20px;
  box-shadow:
    0 40px 80px -20px rgba(0, 0, 0, 0.7),
    inset 0 1px 0 rgba(255, 255, 255, 0.12);
  width: 100%;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;

  @media (max-width: 640px) {
    height: calc(100dvh - 16px);
    max-height: calc(100dvh - 16px);
    border-radius: 20px 20px 0 0;
    border: none;
    border-top: 1px solid rgba(255, 255, 255, 0.10);
    padding-bottom: env(safe-area-inset-bottom, 20px);
  }
`;

const Header = styled.div`
  padding: 20px 24px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  flex-shrink: 0;
`;

const HeaderContent = styled.div`
  flex: 1;
  min-width: 0;
`;

const Title = styled.h2`
  font-size: 17px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.92);
  margin: 0;
  line-height: 1.2;
  letter-spacing: -0.02em;
`;

const Description = styled.p`
  font-size: 13px;
  color: rgba(255, 255, 255, 0.42);
  margin: 3px 0 0;
  line-height: 1.3;
  letter-spacing: 0em;
`;

const CloseButton = styled.button`
  width: 28px;
  height: 28px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(255, 255, 255, 0.4);
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.08);
  transition: background 0.15s ease, color 0.15s ease, border-color 0.15s ease;
  flex-shrink: 0;

  &:hover {
    background: rgba(255, 255, 255, 0.12);
    border-color: rgba(255, 255, 255, 0.15);
    color: rgba(255, 255, 255, 0.85);
  }

  svg { width: 14px; height: 14px; }
`;

export const Body = styled.div`
  padding: 20px 20px 20px;
  overflow-y: auto;
  flex: 1;
  min-height: 0;
  scrollbar-width: none;
  -ms-overflow-style: none;
  &::-webkit-scrollbar { display: none; }

  @media (max-width: 640px) { padding: 16px; }
`;

// ─── Animations ──────────────────────────────────────────────────────────────

const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.22, ease: "easeOut" as const } },
  exit:   { opacity: 0, transition: { duration: 0.18, ease: "easeIn" as const } },
};

const containerVariants = {
  hidden:  { opacity: 0, scale: 0.96, filter: "blur(6px)" },
  visible: {
    opacity: 1, scale: 1, filter: "blur(0px)",
    transition: { type: "spring" as const, stiffness: 350, damping: 28, mass: 0.8 },
  },
  exit: {
    opacity: 0, scale: 0.96, filter: "blur(6px)",
    transition: { duration: 0.18, ease: [0.4, 0, 1, 1] as [number, number, number, number] },
  },
};

const CloseIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);

// ─── Component ───────────────────────────────────────────────────────────────

export function EditorModal({
  isOpen,
  onClose,
  title,
  description,
  children,
  floatingBar,
  size = "xl",
}: EditorModalProps) {
  useEffect(() => {
    let scrollY = 0;
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen && onClose) onClose();
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
        const saved = parseInt(document.body.style.top || "0", 10) * -1;
        document.body.style.position = "";
        document.body.style.top = "";
        document.body.style.left = "";
        document.body.style.right = "";
        document.body.style.overflow = "";
        window.scrollTo(0, saved);
      }
    };
  }, [isOpen, onClose]);

  const content = (
    <AnimatePresence mode="wait">
      {isOpen && (
        <Backdrop
          key="editor-modal-backdrop"
          variants={backdropVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          onClick={(e) => e.target === e.currentTarget && onClose?.()}
        >
          {/* ModalWrapper is a plain positioned div — no backdrop-filter,
              no isolation group. floatingBar is a sibling of Container here,
              so its backdrop-filter correctly blurs Container's rendered output. */}
          <ModalWrapper $size={size}>
            <Container
              $size={size}
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              onClick={(e) => e.stopPropagation()}
            >
              {(title || description) && (
                <Header>
                  <HeaderContent>
                    {title && <Title>{title}</Title>}
                    {description && <Description>{description}</Description>}
                  </HeaderContent>
                  {onClose && (
                    <CloseButton onClick={onClose} aria-label="Close">
                      <CloseIcon />
                    </CloseButton>
                  )}
                </Header>
              )}
              {children}
            </Container>

            {/* Floating bar — sibling of Container, inside ModalWrapper.
                position: absolute relative to ModalWrapper (same bounds as Container).
                backdrop-filter blurs Container's composited output behind it. */}
            {floatingBar}
          </ModalWrapper>
        </Backdrop>
      )}
    </AnimatePresence>
  );

  return typeof document !== "undefined"
    ? createPortal(content, document.body)
    : null;
}
