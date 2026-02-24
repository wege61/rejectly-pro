"use client";

import styled from "styled-components";
import { useEffect, useState, useCallback, useRef } from "react";
import { createPortal } from "react-dom";

type SheetSide = "left" | "right" | "top" | "bottom";

interface SheetProps {
  isOpen: boolean;
  onClose?: () => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  side?: SheetSide;
  size?: "sm" | "md" | "lg" | "xl" | "full";
  showCloseButton?: boolean;
  closeOnBackdropClick?: boolean;
  closeOnEscape?: boolean;
  showOverlay?: boolean;
}

const ANIMATION_DURATION = 300;

// Global counter to track open sheets
let openSheetsCount = 0;

const Overlay = styled.div<{ $isOpen: boolean }>`
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.55);
  backdrop-filter: blur(12px) saturate(140%);
  -webkit-backdrop-filter: blur(12px) saturate(140%);
  z-index: ${({ theme }) => theme.zIndex.modalBackdrop};
  opacity: ${({ $isOpen }) => ($isOpen ? 1 : 0)};
  transition: opacity ${ANIMATION_DURATION}ms ease-in-out;
`;

const SheetContainer = styled.div<{ $side: SheetSide; $size: string; $isOpen: boolean }>`
  position: fixed;
  z-index: ${({ theme }) => theme.zIndex.modal};

  /* Liquid Glass */
  background:
    linear-gradient(160deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.01) 100%),
    rgba(12, 12, 18, 0.88);
  backdrop-filter: blur(48px) saturate(180%);
  -webkit-backdrop-filter: blur(48px) saturate(180%);
  box-shadow:
    -12px 0 60px rgba(0, 0, 0, 0.6),
    inset 1px 0 0 rgba(255, 255, 255, 0.08);

  display: flex;
  flex-direction: column;
  overflow: hidden;
  transition: transform ${ANIMATION_DURATION}ms cubic-bezier(0.16, 1, 0.3, 1);

  /* Position and transform based on side */
  ${({ $side, $isOpen }) => {
    switch ($side) {
      case "left":
        return `
          top: 0;
          left: 0;
          bottom: 0;
          border-right: 1px solid rgba(255,255,255,0.08);
          transform: translateX(${$isOpen ? "0" : "-100%"});
        `;
      case "top":
        return `
          top: 0;
          left: 0;
          right: 0;
          border-bottom: 1px solid rgba(255,255,255,0.08);
          transform: translateY(${$isOpen ? "0" : "-100%"});
        `;
      case "bottom":
        return `
          bottom: 0;
          left: 0;
          right: 0;
          border-top: 1px solid rgba(255,255,255,0.08);
          transform: translateY(${$isOpen ? "0" : "100%"});
        `;
      default: // right
        return `
          top: 0;
          right: 0;
          bottom: 0;
          border-left: 1px solid rgba(255,255,255,0.08);
          transform: translateX(${$isOpen ? "0" : "100%"});
          &::before {
            content: '';
            position: absolute;
            top: 0; left: 20%; right: 20%;
            height: 1px;
            background: linear-gradient(90deg, transparent, rgba(255,255,255,0.25) 50%, transparent);
            pointer-events: none;
            z-index: 1;
          }
        `;
    }
  }}

  /* Size based on side */
  ${({ $side, $size }) => {
    if ($side === "left" || $side === "right") {
      switch ($size) {
        case "sm":
          return `
            width: 340px;
            @media (max-width: 400px) { width: 90%; }
          `;
        case "lg":
          return `
            width: 480px;
            @media (max-width: 560px) { width: 90%; }
          `;
        case "xl":
          return `
            width: 620px;
            @media (max-width: 720px) { width: 90%; }
          `;
        case "full":
          return `width: 100%;`;
        default:
          return `
            width: 440px;
            @media (max-width: 480px) { width: 90%; }
          `;
      }
    } else {
      switch ($size) {
        case "sm":
          return `height: 200px;`;
        case "lg":
          return `
            height: 500px;
            @media (max-width: 640px) { height: 80vh; }
          `;
        case "xl":
          return `
            height: 700px;
            @media (max-width: 640px) { height: 90vh; }
          `;
        case "full":
          return `height: 100%;`;
        default:
          return `
            height: 350px;
            @media (max-width: 640px) { height: 60vh; }
          `;
      }
    }
  }}
`;

const SheetHeader = styled.div`
  padding: 20px 24px 18px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.07);
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.md};
  flex-shrink: 0;
  background: rgba(255, 255, 255, 0.02);
`;

const SheetHeaderContent = styled.div`
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const SheetTitle = styled.h2`
  font-size: 16px;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.95);
  line-height: 1.3;
  margin: 0;
  letter-spacing: -0.02em;
`;

const SheetDescription = styled.p`
  font-size: 13px;
  color: rgba(255, 255, 255, 0.35);
  line-height: 1.4;
  margin: 0;
  letter-spacing: -0.01em;
`;

const CloseButton = styled.button`
  width: 32px;
  height: 32px;
  border-radius: 9999px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(255,255,255,0.45);
  transition: all 150ms ease;
  flex-shrink: 0;
  background: rgba(255,255,255,0.06);
  border: 1px solid rgba(255,255,255,0.08);
  cursor: pointer;

  &:hover {
    background: rgba(255,255,255,0.12);
    color: rgba(255,255,255,0.9);
  }

  svg {
    width: 14px;
    height: 14px;
  }
`;

const SheetBody = styled.div`
  padding: 0;
  overflow-y: auto;
  flex: 1;
`;

const SheetFooter = styled.div`
  padding: 16px 24px;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: ${({ theme }) => theme.spacing.sm};
  flex-shrink: 0;

  @media (max-width: 640px) {
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

export const Sheet: React.FC<SheetProps> & {
  Body: typeof SheetBody;
  Footer: typeof SheetFooter;
} = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  side = "right",
  size = "md",
  showCloseButton = true,
  closeOnBackdropClick = true,
  closeOnEscape = true,
  showOverlay = true,
}) => {
  // Track if sheet should be in DOM
  const [isMounted, setIsMounted] = useState(false);
  // Track if sheet is visually open (for CSS transition)
  const [isAnimatingOpen, setIsAnimatingOpen] = useState(false);
  // Track if this sheet instance has incremented the counter
  const hasIncrementedRef = useRef(false);

  // Track animation frame IDs for cleanup
  const animationFrameRef = useRef<number | null>(null);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    // Clean up any pending animation frames or timers
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }

    if (isOpen) {
      // Increment counter only once per open
      if (!hasIncrementedRef.current) {
        openSheetsCount++;
        hasIncrementedRef.current = true;
      }
      // Always ensure we start from closed visual state for proper animation
      setIsAnimatingOpen(false);
      // Mount the component first
      setIsMounted(true);
      // Then trigger the open animation on next frame
      // Use nested RAF to ensure browser has painted the closed state
      animationFrameRef.current = requestAnimationFrame(() => {
        animationFrameRef.current = requestAnimationFrame(() => {
          setIsAnimatingOpen(true);
        });
      });
      document.body.style.overflow = "hidden";
    } else if (hasIncrementedRef.current) {
      // Only run close logic if this sheet was previously open
      hasIncrementedRef.current = false;
      openSheetsCount--;
      // Start close animation
      setIsAnimatingOpen(false);
      // Unmount after animation completes
      closeTimerRef.current = setTimeout(() => {
        setIsMounted(false);
        // Only reset overflow if no other sheets are open
        if (openSheetsCount === 0) {
          document.body.style.overflow = "unset";
        }
      }, ANIMATION_DURATION);
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (closeTimerRef.current) {
        clearTimeout(closeTimerRef.current);
      }
    };
  }, [isOpen]);

  // ESC key handler
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen && closeOnEscape && onClose) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose, closeOnEscape]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      // Cancel any pending animations/timers
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (closeTimerRef.current) {
        clearTimeout(closeTimerRef.current);
      }
      // If this sheet was open when unmounting, decrement counter
      if (hasIncrementedRef.current) {
        openSheetsCount--;
        hasIncrementedRef.current = false;
      }
      // Only reset overflow if no other sheets are open
      if (openSheetsCount === 0) {
        document.body.style.overflow = "unset";
      }
    };
  }, []);

  const handleOverlayClick = useCallback(() => {
    if (closeOnBackdropClick && onClose) {
      onClose();
    }
  }, [closeOnBackdropClick, onClose]);

  if (!isMounted) return null;

  const sheetContent = (
    <>
      {showOverlay && (
        <Overlay $isOpen={isAnimatingOpen} onClick={handleOverlayClick} />
      )}
      <SheetContainer $side={side} $size={size} $isOpen={isAnimatingOpen}>
        {(title || description || showCloseButton) && (
          <SheetHeader>
            <SheetHeaderContent>
              {title && <SheetTitle>{title}</SheetTitle>}
              {description && <SheetDescription>{description}</SheetDescription>}
            </SheetHeaderContent>
            {showCloseButton && onClose && (
              <CloseButton onClick={onClose} aria-label="Close sheet">
                <CloseIcon />
              </CloseButton>
            )}
          </SheetHeader>
        )}
        {children}
      </SheetContainer>
    </>
  );

  return typeof document !== "undefined"
    ? createPortal(sheetContent, document.body)
    : null;
};

Sheet.Body = SheetBody;
Sheet.Footer = SheetFooter;
