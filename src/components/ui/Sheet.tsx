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
  background-color: rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(4px);
  z-index: ${({ theme }) => theme.zIndex.modalBackdrop};
  opacity: ${({ $isOpen }) => ($isOpen ? 1 : 0)};
  transition: opacity ${ANIMATION_DURATION}ms ease-in-out;
`;

const SheetContainer = styled.div<{ $side: SheetSide; $size: string; $isOpen: boolean }>`
  position: fixed;
  z-index: ${({ theme }) => theme.zIndex.modal};
  background-color: ${({ theme }) => theme.colors.backgroundAlt2};
  box-shadow: -8px 0 30px rgba(0, 0, 0, 0.15);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  transition: transform ${ANIMATION_DURATION}ms ease-in-out;

  /* Position and transform based on side */
  ${({ $side, $isOpen }) => {
    switch ($side) {
      case "left":
        return `
          top: 0;
          left: 0;
          bottom: 0;
          border-right: 1px solid var(--border-color, rgba(255,255,255,0.1));
          transform: translateX(${$isOpen ? "0" : "-100%"});
        `;
      case "top":
        return `
          top: 0;
          left: 0;
          right: 0;
          border-bottom: 1px solid var(--border-color, rgba(255,255,255,0.1));
          transform: translateY(${$isOpen ? "0" : "-100%"});
        `;
      case "bottom":
        return `
          bottom: 0;
          left: 0;
          right: 0;
          border-top: 1px solid theme.colors.border; 
          transform: translateY(${$isOpen ? "0" : "100%"});
        `;
      default: // right
        return `
          top: 0;
          right: 0;
          bottom: 0;
          border-left: 1px solid theme.colors.border; 
          border-radius: 8px;
          transform: translateX(${$isOpen ? "0" : "100%"});
        `;
    }
  }}

  /* Size based on side */
  ${({ $side, $size }) => {
    if ($side === "left" || $side === "right") {
      switch ($size) {
        case "sm":
          return `
            width: 320px;
            @media (max-width: 400px) { width: 85%; }
          `;
        case "lg":
          return `
            width: 420px;
            @media (max-width: 560px) { width: 85%; }
          `;
        case "xl":
          return `
            width: 540px;
            @media (max-width: 620px) { width: 85%; }
          `;
        case "full":
          return `width: 100%;`;
        default:
          return `
            width: 400px;
            @media (max-width: 480px) { width: 85%; }
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
  padding: 20px 24px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.md};
  flex-shrink: 0;
`;

const SheetHeaderContent = styled.div`
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const SheetTitle = styled.h2`
  font-size: 15px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.textPrimary};
  line-height: 1.3;
  margin: 0;
`;

const SheetDescription = styled.p`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.textSecondary};
  line-height: 1.4;
  margin: 0;
`;

const CloseButton = styled.button`
  width: 32px;
  height: 32px;
  border-radius: ${({ theme }) => theme.radius.md};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.textSecondary};
  transition: all 150ms ease;
  flex-shrink: 0;
  background: transparent;
  border: none;
  cursor: pointer;
  opacity: 0.6;

  &:hover {
    background-color: ${({ theme }) => theme.colors.surfaceHover};
    color: ${({ theme }) => theme.colors.textPrimary};
    opacity: 1;
  }

  svg {
    width: 16px;
    height: 16px;
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
