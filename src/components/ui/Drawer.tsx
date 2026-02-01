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
  gap: 6px;
  padding: 0 24px 20px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  max-width: 1200px;
`;

const Title = styled.h2`
  font-size: 20px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textPrimary};
  margin: 0;
  line-height: 1.4;
`;

const Description = styled.p`
  font-size: 15px;
  color: ${({ theme }) => theme.colors.textSecondary};
  margin: 0 auto;
  max-width: 1200px;
  line-height: 1.5;
`;

const BodyWrapper = styled.div`
  flex: 1;
  min-height: 0;
  overflow: hidden;
  position: relative;
  margin: 0 24px;
  display: flex;
  flex-direction: column;
  border-radius: 12px;
  background: ${({ theme }) => theme.colors.backgroundAlt};
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.06);

  @media (prefers-color-scheme: dark) {
    box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.2),
                inset 0 0 0 1px rgba(255, 255, 255, 0.03);
  }

  /* Top fade indicator */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 20px;
    background: linear-gradient(
      to bottom,
      ${({ theme }) => theme.colors.backgroundAlt} 0%,
      transparent 100%
    );
    z-index: 2;
    pointer-events: none;
    opacity: 0;
    transition: opacity 0.2s ease;
    border-radius: 12px 12px 0 0;
  }

  /* Bottom fade indicator */
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 20px;
    background: linear-gradient(
      to top,
      ${({ theme }) => theme.colors.backgroundAlt} 0%,
      transparent 100%
    );
    z-index: 2;
    pointer-events: none;
    opacity: 0;
    transition: opacity 0.2s ease;
    border-radius: 0 0 12px 12px;
  }

  &[data-scroll-top="true"]::before {
    opacity: 1;
  }

  &[data-scroll-bottom="true"]::after {
    opacity: 1;
  }
`;

const Body = styled.div`
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  margin: 0 auto;
  max-width: 720px;
  width: 100%;
  padding: 28px 24px;

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
  const scrollYRef = useRef(0);
  const wasOpenRef = useRef(false);

  // Handle escape key + scroll lock
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      scrollYRef.current = window.scrollY;
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollYRef.current}px`;
      document.body.style.left = '0';
      document.body.style.right = '0';
      document.documentElement.style.overflow = 'hidden';
      wasOpenRef.current = true;
    } else if (wasOpenRef.current) {
      // Only restore when transitioning from open → closed
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.left = '';
      document.body.style.right = '';
      document.documentElement.style.overflow = '';
      window.scrollTo(0, scrollYRef.current);
      wasOpenRef.current = false;
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
  const wrapperRef = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const body = bodyRef.current;
    const wrapper = wrapperRef.current;
    if (!body || !wrapper) return;

    const updateScrollIndicators = () => {
      const { scrollTop, scrollHeight, clientHeight } = body;
      const isScrollable = scrollHeight > clientHeight;
      const isScrolledFromTop = scrollTop > 10;
      const isScrolledFromBottom = scrollTop < scrollHeight - clientHeight - 10;

      wrapper.setAttribute('data-scroll-top', String(isScrollable && isScrolledFromTop));
      wrapper.setAttribute('data-scroll-bottom', String(isScrollable && isScrolledFromBottom));
    };

    // Initial check
    updateScrollIndicators();

    // Listen for scroll
    body.addEventListener('scroll', updateScrollIndicators);

    // Also check on resize
    const resizeObserver = new ResizeObserver(updateScrollIndicators);
    resizeObserver.observe(body);

    return () => {
      body.removeEventListener('scroll', updateScrollIndicators);
      resizeObserver.disconnect();
    };
  }, [children]);

  return (
    <BodyWrapper ref={wrapperRef}>
      <Body ref={bodyRef}>{children}</Body>
    </BodyWrapper>
  );
}

export function DrawerFooter({ children }: DrawerFooterProps) {
  return <Footer>{children}</Footer>;
}

// Export all
export default Drawer;
