'use client';

import React, { useEffect, useCallback, useRef } from 'react';
import { createPortal } from 'react-dom';
import styled from 'styled-components';
import { motion, AnimatePresence, PanInfo } from 'framer-motion';

// Types
interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  shouldScaleBackground?: boolean;
}

interface DrawerHeaderProps {
  children: React.ReactNode;
}

interface DrawerBodyProps {
  children: React.ReactNode;
}

interface DrawerFooterProps {
  children: React.ReactNode;
}

interface DrawerTitleProps {
  children: React.ReactNode;
}

interface DrawerDescriptionProps {
  children: React.ReactNode;
}

// Styled Components
const Overlay = styled(motion.div)`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  z-index: 9998;
  backdrop-filter: blur(4px);
`;

const DrawerContainer = styled(motion.div)`
  position: fixed;
  inset-inline: 0;
  bottom: 0;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  background: ${({ theme }) => theme.colors.backgroundAlt2};
  border-top-left-radius: 16px;
  border-top-right-radius: 16px;
  max-height: 90vh;
  box-shadow: 0 -10px 40px rgba(0, 0, 0, 0.15);
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-bottom: none;
`;

const Handle = styled.div`
  display: flex;
  justify-content: center;
  padding: 12px 0 8px;
  cursor: grab;

  &:active {
    cursor: grabbing;
  }
`;

const HandleBar = styled.div`
  width: 48px;
  height: 5px;
  border-radius: 9999px;
  background: ${({ theme }) => theme.colors.border};
  transition: background 0.2s ease;

  ${Handle}:hover & {
    background: ${({ theme }) => theme.colors.textTertiary};
  }
`;

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  overflow: hidden;
`;

const Header = styled.div`
  display: flex;
  flex-direction: column;
  margin: 0 auto;
  gap: 4px;
  padding: 0 24px 16px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  max-width: 1200px;
`;

const Title = styled.h2`
  font-size: 18px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textPrimary};
  margin: 0;
  line-height: 1.4;
`;

const Description = styled.p`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.textSecondary};
  margin: 0 auto;
  max-width: 1200px;
  line-height: 1.5;
`;

const Body = styled.div`
  flex: 1;
  overflow-y: auto;
  margin: 0 auto;
  max-width: 1200px;
  max-width: 90vw;
  padding: 24px;
  border-radius: 12px;
  background: ${({ theme }) => theme.colors.backgroundAlt3};

  /* Custom scrollbar */
  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.colors.border};
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: ${({ theme }) => theme.colors.textTertiary};
  }
`;

const Footer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 16px 24px 24px;
  margin: 0 auto;
  max-width: 1200px;
  width: 100%;
  `;

// Animation variants with proper typing
const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
};

// Scale background helper
function getScaleWrapper(): HTMLElement | null {
  // Try to find the app layout container first (includes sidebar + main)
  // Then fall back to Next.js wrapper or body's first child
  return document.getElementById('app-layout') ||
         document.getElementById('__next') ||
         document.body.firstElementChild as HTMLElement;
}

function applyScaleBackground(scale: boolean) {
  const wrapper = getScaleWrapper();
  if (!wrapper) return;

  if (scale) {
    wrapper.style.transition = 'transform 0.5s cubic-bezier(0.32, 0.72, 0, 1)';
    wrapper.style.transform = 'scale(0.99)';
  } else {
    wrapper.style.transform = '';
    setTimeout(() => {
      wrapper.style.transition = '';
    }, 500);
  }
}

// Main Drawer Component
export function Drawer({ isOpen, onClose, children, shouldScaleBackground = true }: DrawerProps) {
  const dragY = useRef(0);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  // Handle scale background separately for proper animation sync
  useEffect(() => {
    if (!shouldScaleBackground) return;

    if (isOpen) {
      applyScaleBackground(true);
    } else {
      applyScaleBackground(false);
    }
  }, [isOpen, shouldScaleBackground]);

  // Handle drag
  const handleDragEnd = useCallback(
    (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
      const shouldClose = info.velocity.y > 500 || info.offset.y > 200;

      if (shouldClose) {
        onClose();
      }
      dragY.current = 0;
    },
    [onClose]
  );

  if (typeof window === 'undefined') return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <>
          <Overlay
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={onClose}
            transition={{ duration: 0.2 }}
          />
          <DrawerContainer
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{
              type: 'spring' as const,
              damping: 30,
              stiffness: 300,
            }}
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0, bottom: 0.5 }}
            onDragEnd={handleDragEnd}
          >
            <Handle>
              <HandleBar />
            </Handle>
            <ContentWrapper>
              {children}
            </ContentWrapper>
          </DrawerContainer>
        </>
      )}
    </AnimatePresence>,
    document.body
  );
}

// Subcomponents
export function DrawerHeader({ children }: DrawerHeaderProps) {
  return <Header>{children}</Header>;
}

export function DrawerTitle({ children }: DrawerTitleProps) {
  return <Title>{children}</Title>;
}

export function DrawerDescription({ children }: DrawerDescriptionProps) {
  return <Description>{children}</Description>;
}

export function DrawerBody({ children }: DrawerBodyProps) {
  return <Body>{children}</Body>;
}

export function DrawerFooter({ children }: DrawerFooterProps) {
  return <Footer>{children}</Footer>;
}

// Export all
export default Drawer;
