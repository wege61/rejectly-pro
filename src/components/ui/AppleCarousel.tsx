"use client";

import React, {
  useEffect,
  useRef,
  useState,
  createContext,
  useContext,
} from "react";
import styled from "styled-components";
import { AnimatePresence, motion } from "motion/react";
import { useClickOutside } from "@/hooks/useClickOutside";

// Types
type Card = {
  src: string;
  title: string;
  category: string;
  content: React.ReactNode;
};

interface CarouselProps {
  items: React.ReactNode[];
  initialScroll?: number;
}

// Context
export const CarouselContext = createContext<{
  onCardClose: (index: number) => void;
  currentIndex: number;
}>({
  onCardClose: () => {},
  currentIndex: 0,
});

// Icons
const ArrowLeftIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="19" y1="12" x2="5" y2="12" />
    <polyline points="12 19 5 12 12 5" />
  </svg>
);

const ArrowRightIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
);

const CloseIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

// Styled Components
const CarouselWrapper = styled.div`
  position: relative;
  width: 100%;
`;

const CarouselTrack = styled.div`
  display: flex;
  width: 100%;
  overflow-x: scroll;
  overscroll-behavior-x: auto;
  scroll-behavior: smooth;
  padding: 40px 0;
  scrollbar-width: none;
  -ms-overflow-style: none;

  &::-webkit-scrollbar {
    display: none;
  }

  @media (min-width: 768px) {
    padding: 80px 0;
  }
`;

const CarouselInner = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  gap: 16px;
  padding-left: 16px;
  max-width: 1280px;
  margin: 0 auto;

  @media (min-width: 768px) {
    gap: 24px;
    padding-left: 24px;
  }
`;

const CardWrapper = styled(motion.div)`
  border-radius: 24px;
  flex-shrink: 0;

  &:last-child {
    padding-right: 5%;
  }

  @media (min-width: 768px) {
    &:last-child {
      padding-right: 33%;
    }
  }
`;

const NavigationContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-right: 40px;
`;

const NavButton = styled.button`
  position: relative;
  z-index: 40;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: var(--bg-alt);
  border: 1px solid var(--border-color);
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    background: var(--bg-color);
    border-color: var(--primary-500);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  svg {
    width: 20px;
    height: 20px;
    color: var(--text-secondary);
  }
`;

// Modal Styles
const ModalOverlay = styled(motion.div)`
  position: fixed;
  inset: 0;
  height: 100%;
  width: 100%;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(12px);
  z-index: 1100;
`;

const ModalContainer = styled.div`
  position: fixed;
  inset: 0;
  z-index: 1100;
  height: 100vh;
  overflow: auto;
`;

const ModalContent = styled(motion.div)`
  position: relative;
  z-index: 1110;
  width: 90%;
  max-width: 800px;
  margin: 64px auto;
  height: fit-content;
  background: rgba(150, 150, 150, 0.08);
  backdrop-filter: blur(40px) saturate(200%);
  -webkit-backdrop-filter: blur(40px) saturate(200%);
  border-radius: 32px;
  padding: 32px;
  font-family: inherit;
  border: 1px solid rgba(255, 255, 255, 0.15);
  box-shadow: inset 0 1px 1px rgba(255, 255, 255, 0.2), 0 24px 64px rgba(0, 0, 0, 0.2);

  @media (min-width: 768px) {
    padding: 56px;
  }
`;

const ModalCloseButton = styled.button`
  position: absolute;
  top: 24px;
  right: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: var(--text-color);
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
  z-index: 1120;

  &:hover {
    transform: scale(1.05);
    background: rgba(255, 255, 255, 0.9);
  }

  svg {
    width: 20px;
    height: 20px;
    color: var(--bg-color);
  }

  @media (min-width: 768px) {
    top: 32px;
    right: 32px;
  }
`;

const ModalCategory = styled(motion.p)`
  font-size: 14px;
  font-weight: 500;
  color: var(--accent);

  @media (min-width: 768px) {
    font-size: 16px;
  }
`;

const ModalTitle = styled(motion.p)`
  margin-top: 16px;
  font-size: 24px;
  font-weight: 600;
  color: var(--text-color);

  @media (min-width: 768px) {
    font-size: 40px;
  }
`;

const ModalBody = styled.div`
  padding: 32px 0 0;
  color: var(--text-secondary);
  font-size: 16px;
  line-height: 1.7;

  @media (min-width: 768px) {
    padding: 48px 0 0;
    font-size: 17px;
  }
`;

// Card Styles
const CardButton = styled(motion.button)`
  position: relative;
  z-index: 10;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  overflow: hidden;
  border-radius: 24px;
  background: var(--bg-alt);
  border: none;
  cursor: pointer;
  height: 320px;
  width: 224px;
  text-align: left;

  @media (min-width: 768px) {
    height: 480px;
    width: 360px;
  }
`;

const CardGradient = styled.div`
  pointer-events: none;
  position: absolute;
  inset: 0;
  z-index: 30;
  height: 100%;
  background: linear-gradient(to bottom, rgba(0, 0, 0, 0.6) 0%, transparent 40%, transparent 100%);
`;

const CardContent = styled.div`
  position: relative;
  z-index: 40;
  padding: 24px;

  @media (min-width: 768px) {
    padding: 32px;
  }
`;

const CardCategory = styled(motion.p)`
  font-size: 12px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.9);
  text-align: left;

  @media (min-width: 768px) {
    font-size: 14px;
  }
`;

const CardTitle = styled(motion.p)`
  margin-top: 8px;
  max-width: 280px;
  font-size: 18px;
  font-weight: 600;
  color: white;
  text-align: left;
  text-wrap: balance;

  @media (min-width: 768px) {
    font-size: 26px;
  }
`;

const CardImage = styled.img<{ $isLoading: boolean }>`
  position: absolute;
  inset: 0;
  z-index: 10;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: all 0.3s ease;
  filter: ${({ $isLoading }) => $isLoading ? 'blur(8px)' : 'blur(0)'};
`;

// Carousel Component
export const Carousel = ({ items, initialScroll = 0 }: CarouselProps) => {
  const carouselRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (carouselRef.current) {
      carouselRef.current.scrollLeft = initialScroll;
      checkScrollability();
    }
  }, [initialScroll]);

  const checkScrollability = () => {
    if (carouselRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth);
    }
  };

  const scrollLeft = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: -300, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: 300, behavior: "smooth" });
    }
  };

  const handleCardClose = (index: number) => {
    if (carouselRef.current) {
      const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
      const cardWidth = isMobile ? 224 : 360;
      const gap = isMobile ? 16 : 24;
      const scrollPosition = (cardWidth + gap) * (index + 1);
      carouselRef.current.scrollTo({
        left: scrollPosition,
        behavior: "smooth",
      });
      setCurrentIndex(index);
    }
  };

  return (
    <CarouselContext.Provider value={{ onCardClose: handleCardClose, currentIndex }}>
      <CarouselWrapper>
        <CarouselTrack ref={carouselRef} onScroll={checkScrollability}>
          <CarouselInner>
            {items.map((item, index) => (
              <CardWrapper
                key={"card" + index}
                initial={{ opacity: 0, y: 20 }}
                animate={{
                  opacity: 1,
                  y: 0,
                  transition: {
                    duration: 0.5,
                    delay: 0.2 * index,
                    ease: "easeOut",
                  },
                }}
              >
                {item}
              </CardWrapper>
            ))}
          </CarouselInner>
        </CarouselTrack>
        <NavigationContainer>
          <NavButton onClick={scrollLeft} disabled={!canScrollLeft}>
            <ArrowLeftIcon />
          </NavButton>
          <NavButton onClick={scrollRight} disabled={!canScrollRight}>
            <ArrowRightIcon />
          </NavButton>
        </NavigationContainer>
      </CarouselWrapper>
    </CarouselContext.Provider>
  );
};

// Card Component
export const AppleCard = ({
  card,
  index,
  layout = false,
}: {
  card: Card;
  index: number;
  layout?: boolean;
}) => {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const { onCardClose } = useContext(CarouselContext);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        handleClose();
      }
    }

    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  useClickOutside(containerRef, () => handleClose());

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    onCardClose(index);
  };

  return (
    <>
      <AnimatePresence>
        {open && (
          <ModalContainer>
            <ModalOverlay
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />
            <ModalContent
              ref={containerRef}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              layoutId={layout ? `card-${card.title}` : undefined}
            >
              <ModalCloseButton onClick={handleClose}>
                <CloseIcon />
              </ModalCloseButton>
              <ModalCategory layoutId={layout ? `category-${card.title}` : undefined}>
                {card.category}
              </ModalCategory>
              <ModalTitle layoutId={layout ? `title-${card.title}` : undefined}>
                {card.title}
              </ModalTitle>
              <ModalBody>{card.content}</ModalBody>
            </ModalContent>
          </ModalContainer>
        )}
      </AnimatePresence>
      <CardButton
        layoutId={layout ? `card-${card.title}` : undefined}
        onClick={handleOpen}
      >
        <CardGradient />
        <CardContent>
          <CardCategory layoutId={layout ? `category-${card.category}` : undefined}>
            {card.category}
          </CardCategory>
          <CardTitle layoutId={layout ? `title-${card.title}` : undefined}>
            {card.title}
          </CardTitle>
        </CardContent>
        <CardImage
          src={card.src}
          alt={card.title}
          $isLoading={isLoading}
          onLoad={() => setIsLoading(false)}
          loading="lazy"
          decoding="async"
        />
      </CardButton>
    </>
  );
};

export type { Card };
