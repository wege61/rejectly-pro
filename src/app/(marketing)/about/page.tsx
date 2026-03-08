"use client";

import styled from "styled-components";
import { motion } from "framer-motion";
import { Footer } from "@/components/ui/Footer";
import { BreadcrumbSchema } from "@/components/seo/StructuredData";
import { SecondaryCTA } from "@/components/marketing/SecondaryCTA";


const Container = styled.div`
  min-height: 100vh;
  margin-top: 40px;
  background-color: var(--bg-color);
  color: var(--text-color);
  padding: 80px 24px 60px;

  @media (max-width: 768px) {
    padding: 60px 16px 40px;
  }
`;

const Content = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const Header = styled.header`
  text-align: center;
  margin-bottom: 80px;

  @media (max-width: 768px) {
    margin-bottom: 48px;
  }
`;

const Title = styled.h1`
  font-size: 56px;
  font-weight: 900;
  margin-bottom: 24px;

  @media (max-width: 768px) {
    font-size: 36px;
  }
`;

const Subtitle = styled.p`
  font-size: 20px;
  color: var(--text-secondary);
  max-width: 700px;
  margin: 0 auto;
  line-height: 1.6;

  @media (max-width: 768px) {
    font-size: 18px;
  }
`;

const Section = styled.section`
  margin-bottom: 120px;

  @media (max-width: 768px) {
    margin-bottom: 80px;
  }
`;

const SectionTitle = styled.h2`
  font-size: 40px;
  font-weight: 800;
  margin-bottom: 24px;
  text-align: center;

  @media (max-width: 768px) {
    font-size: 32px;
  }
`;

const SectionText = styled.p`
  font-size: 18px;
  color: var(--text-secondary);
  line-height: 1.8;
  max-width: 800px;
  margin: 0 auto 32px;
  text-align: center;

  @media (max-width: 768px) {
    font-size: 16px;
  }
`;

// ===== ABOUT BENTO GRID =====
const AboutBentoContainer = styled.div`
  margin-bottom: 80px;

  @media (max-width: 768px) {
    margin-bottom: 48px;
  }
`;

const AboutBentoGrid = styled.div`
  display: grid;
  gap: 16px;

  @media (min-width: 1024px) {
    grid-template-columns: 1fr 1fr;
    grid-template-rows: repeat(2, 1fr);
  }
`;

const AboutBentoCard = styled.div<{ $position?: 'story' | 'mission' | 'vision' }>`
  position: relative;

  ${({ $position }) => $position === 'story' && `
    @media (min-width: 1024px) {
      grid-row: span 2;
    }
  `}
`;

const AboutBentoCardInner = styled.div<{ $position?: 'story' | 'mission' | 'vision' }>`
  position: absolute;
  inset: 1px;
  overflow: hidden;

  /* Apple Liquid Glass core */
  background: rgba(24, 24, 24, 0.6);
  backdrop-filter: blur(60px) saturate(200%);
  -webkit-backdrop-filter: blur(60px) saturate(200%);
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow:
    0 8px 40px rgba(0, 0, 0, 0.45),
    0 2px 8px rgba(0, 0, 0, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.05);

  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);

  /* ── Specular light refraction ─── */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(
      90deg,
      transparent 0%,
      rgba(255, 255, 255, 0.25) 40%,
      rgba(255, 255, 255, 0.45) 50%,
      rgba(255, 255, 255, 0.25) 60%,
      transparent 100%
    );
    pointer-events: none;
    z-index: 1;
  }

  &::after {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    width: 1px;
    background: linear-gradient(
      180deg,
      rgba(255, 255, 255, 0.15) 0%,
      rgba(255, 255, 255, 0.05) 40%,
      rgba(255, 255, 255, 0.0) 100%
    );
    pointer-events: none;
    z-index: 1;
  }

  &:hover {
    border-color: rgba(255, 255, 255, 0.18);
    background: rgba(32, 32, 32, 0.7);
    box-shadow:
      0 20px 56px rgba(0, 0, 0, 0.65),
      0 6px 20px rgba(0, 0, 0, 0.45),
      inset 0 1px 0 rgba(255, 255, 255, 0.1);
  }

  border-radius: calc(24px - 1px);

  ${({ $position }) => $position === 'story' && `
    @media (min-width: 1024px) {
      border-radius: 48px calc(24px - 1px) calc(24px - 1px) 48px;
    }
  `}

  ${({ $position }) => $position === 'mission' && `
    @media (min-width: 1024px) {
      border-radius: calc(24px - 1px) 48px calc(24px - 1px) calc(24px - 1px);
    }
    @media (max-width: 1023px) {
      border-radius: 48px 48px calc(24px - 1px) calc(24px - 1px);
    }
  `}

  ${({ $position }) => $position === 'vision' && `
    @media (min-width: 1024px) {
      border-radius: calc(24px - 1px) calc(24px - 1px) 48px calc(24px - 1px);
    }
    @media (max-width: 1023px) {
      border-radius: calc(24px - 1px) calc(24px - 1px) 48px 48px;
    }
  `}
`;

const AboutBentoCardContent = styled.div<{ $position?: 'story' | 'mission' | 'vision' }>`
  position: relative;
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
  border-radius: 24px;

  ${({ $position }) => $position === 'story' && `
    @media (min-width: 1024px) {
      border-radius: 48px 24px 24px 48px;
    }
  `}

  ${({ $position }) => $position === 'mission' && `
    @media (min-width: 1024px) {
      border-radius: 24px 48px 24px 24px;
    }
    @media (max-width: 1023px) {
      border-radius: 48px 48px 24px 24px;
    }
  `}

  ${({ $position }) => $position === 'vision' && `
    @media (min-width: 1024px) {
      border-radius: 24px 24px 48px 24px;
    }
    @media (max-width: 1023px) {
      border-radius: 24px 24px 48px 48px;
    }
  `}
`;

const AboutBentoCardOverlay = styled.div<{ $position?: 'story' | 'mission' | 'vision' }>`
  pointer-events: none;
  position: absolute;
  inset: 1px;
  border-radius: calc(24px - 1px);
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  outline: 1px solid rgba(0, 0, 0, 0.05);

  @media (prefers-color-scheme: dark) {
    outline-color: rgba(255, 255, 255, 0.15);
  }

  ${({ $position }) => $position === 'story' && `
    @media (min-width: 1024px) {
      border-radius: 48px calc(24px - 1px) calc(24px - 1px) 48px;
    }
  `}

  ${({ $position }) => $position === 'mission' && `
    @media (min-width: 1024px) {
      border-radius: calc(24px - 1px) 48px calc(24px - 1px) calc(24px - 1px);
    }
    @media (max-width: 1023px) {
      border-radius: 48px 48px calc(24px - 1px) calc(24px - 1px);
    }
  `}

  ${({ $position }) => $position === 'vision' && `
    @media (min-width: 1024px) {
      border-radius: calc(24px - 1px) calc(24px - 1px) 48px calc(24px - 1px);
    }
    @media (max-width: 1023px) {
      border-radius: calc(24px - 1px) calc(24px - 1px) 48px 48px;
    }
  `}
`;

const AboutBentoHeader = styled.div<{ $story?: boolean }>`
  padding: 32px 32px 16px;

  @media (max-width: 768px) {
    padding: 24px 24px 12px;
  }

  ${({ $story }) => $story && `
    padding-bottom: 8px;
  `}
`;

const AboutBentoTitle = styled.h2`
  font-size: 24px;
  font-weight: 700;
  color: var(--text-color);

  @media (max-width: 1024px) {
    text-align: center;
  }

  @media (max-width: 768px) {
    font-size: 20px;
  }
`;

const AboutBentoDescription = styled.p<{ $story?: boolean }>`
  font-size: 14px;
  line-height: 1.7;
  color: var(--text-secondary);
  margin-top: 12px;

  @media (max-width: 1024px) {
    text-align: center;
  }

  ${({ $story }) => $story && `
    font-size: 15px;
    line-height: 1.8;
  `}
`;

const AboutBentoVisualContainer = styled.div<{ $type?: 'story' | 'small' }>`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px 32px 32px;
  position: relative;
  overflow: hidden;

  ${({ $type }) => $type === 'story' && `
    @media (min-width: 1024px) {
      min-height: 280px;
    }
    padding: 8px 32px 32px;
    align-items: flex-end;
    justify-content: flex-start;
  `}

  @media (max-width: 768px) {
    padding: 16px 24px 24px;
    min-height: 180px;
  }
`;

// ===== STORY VISUAL (Timeline Journey) =====
const StoryTimelineContainer = styled.div`
  width: 100%;
  max-width: 400px;
  position: relative;
  padding: 20px 0;

  @media (max-width: 1024px) {
    margin: 0 auto;
  }
`;

const StoryTimelineLine = styled.div`
  position: absolute;
  left: 20px;
  top: 20px;
  bottom: 20px;
  width: 3px;
  background: linear-gradient(180deg, #ef4444 0%, #f59e0b 33%, #10b981 66%, #6366f1 100%);
  border-radius: 2px;

  @media (max-width: 768px) {
    left: 16px;
  }
`;

const StoryTimelineItem = styled.div<{ $delay: number }>`
  display: flex;
  align-items: flex-start;
  gap: 16px;
  padding: 12px 0;
  animation: fadeSlideIn 0.5s ease-out forwards;
  animation-delay: ${({ $delay }) => $delay}s;
  opacity: 0;
  transform: translateX(-10px);

  @keyframes fadeSlideIn {
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }
`;

const StoryTimelineDot = styled.div<{ $color: string }>`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: ${({ $color }) => $color};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  box-shadow: 0 4px 12px ${({ $color }) => $color}40;
  z-index: 1;

  @media (max-width: 768px) {
    width: 32px;
    height: 32px;
  }
`;

const StoryTimelineEmoji = styled.span`
  font-size: 18px;

  @media (max-width: 768px) {
    font-size: 14px;
  }
`;

const StoryTimelineContent = styled.div`
  flex: 1;
  padding-top: 8px;
`;

const StoryTimelineLabel = styled.div`
  font-size: 13px;
  font-weight: 600;
  color: var(--text-color);
  margin-bottom: 2px;
`;

const StoryTimelineText = styled.div`
  font-size: 11px;
  color: var(--text-secondary);
`;

// ===== MISSION VISUAL (Globe with People) =====
const MissionContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
  width: 100%;
  max-width: 320px;
  padding: 16px;
`;

const MissionGlobe = styled.div`
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background: linear-gradient(135deg, #3b82f6 0%, #6366f1 50%, #8b5cf6 100%);
  position: relative;
  flex-shrink: 0;
  animation: globeRotate 20s linear infinite;
  box-shadow: 0 8px 32px rgba(99, 102, 241, 0.3);

  @keyframes globeRotate {
    0% { background-position: 0% 50%; }
    100% { background-position: 200% 50%; }
  }

  &::before {
    content: '';
    position: absolute;
    inset: 4px;
    border-radius: 50%;
    border: 2px dashed rgba(255, 255, 255, 0.3);
  }

  &::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 0;
    right: 0;
    height: 2px;
    background: rgba(255, 255, 255, 0.3);
    transform: translateY(-50%);
  }
`;

const MissionGlobeVertical = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 50%;
  width: 2px;
  background: rgba(255, 255, 255, 0.3);
  transform: translateX(-50%);
`;

const MissionPeopleGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
`;

const MissionPerson = styled.div<{ $color: string; $delay: number }>`
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: ${({ $color }) => $color};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  animation: personPop 0.4s ease-out forwards;
  animation-delay: ${({ $delay }) => $delay}s;
  transform: scale(0);

  @keyframes personPop {
    to { transform: scale(1); }
  }
`;

// ===== VISION VISUAL (Rising Stars/Rocket Path) =====
const VisionContainer = styled.div`
  width: 100%;
  max-width: 320px;
  height: 140px;
  position: relative;
  background: linear-gradient(180deg, rgba(99, 102, 241, 0.05) 0%, rgba(139, 92, 246, 0.1) 100%);
  border-radius: 16px;
  overflow: hidden;
`;

const VisionPath = styled.svg`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
`;

const VisionPathLine = styled.path`
  fill: none;
  stroke: url(#visionGradient);
  stroke-width: 3;
  stroke-linecap: round;
  stroke-dasharray: 300;
  stroke-dashoffset: 300;
  animation: drawPath 2s ease-out forwards;

  @keyframes drawPath {
    to { stroke-dashoffset: 0; }
  }
`;

const VisionStar = styled.div<{ $top: string; $left: string; $size: string; $delay: number }>`
  position: absolute;
  top: ${({ $top }) => $top};
  left: ${({ $left }) => $left};
  width: ${({ $size }) => $size};
  height: ${({ $size }) => $size};
  background: #fbbf24;
  clip-path: polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%);
  animation: starTwinkle 1s ease-out forwards;
  animation-delay: ${({ $delay }) => $delay}s;
  opacity: 0;
  transform: scale(0);

  @keyframes starTwinkle {
    to {
      opacity: 1;
      transform: scale(1);
    }
  }
`;

const VisionMilestone = styled.div<{ $position: 'start' | 'middle' | 'end' }>`
  position: absolute;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  animation: milestoneFade 0.5s ease-out forwards;
  opacity: 0;

  ${({ $position }) => {
    switch ($position) {
      case 'start':
        return `
          bottom: 12px;
          left: 20px;
          animation-delay: 0.5s;
        `;
      case 'middle':
        return `
          bottom: 50px;
          left: 50%;
          transform: translateX(-50%);
          animation-delay: 1s;
        `;
      case 'end':
        return `
          top: 12px;
          right: 20px;
          animation-delay: 1.5s;
        `;
    }
  }}

  @keyframes milestoneFade {
    to { opacity: 1; }
  }
`;

const VisionMilestoneNumber = styled.span<{ $color: string }>`
  font-size: 16px;
  font-weight: 800;
  color: ${({ $color }) => $color};
`;

const VisionMilestoneLabel = styled.span`
  font-size: 9px;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

// Bento Grid for Core Values
const BentoValuesContainer = styled.div`
  margin-top: 40px;
`;

const BentoValuesGrid = styled.div`
  display: grid;
  gap: 16px;

  @media (min-width: 1024px) {
    grid-template-columns: repeat(3, 1fr);
    grid-template-rows: repeat(2, 1fr);
  }
`;

const BentoBottomRow = styled.div`
  display: grid;
  gap: 16px;
  grid-template-columns: repeat(2, 1fr);
  margin-top: 16px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const BentoCard = styled.div<{ $position?: 'left-tall' | 'right-tall' | 'top-middle' | 'bottom-middle' | 'bottom-left' | 'bottom-right' }>`
  position: relative;

  ${({ $position }) => $position === 'left-tall' && `
    @media (min-width: 1024px) {
      grid-row: span 2;
    }
  `}

  ${({ $position }) => $position === 'right-tall' && `
    @media (min-width: 1024px) {
      grid-row: span 2;
    }
  `}

  ${({ $position }) => $position === 'top-middle' && `
    @media (max-width: 1023px) {
      order: -1;
    }
  `}

  ${({ $position }) => $position === 'bottom-middle' && `
    @media (min-width: 1024px) {
      grid-column-start: 2;
      grid-row-start: 2;
    }
  `}
`;

const BentoCardInner = styled.div<{ $position?: 'left-tall' | 'right-tall' | 'top-middle' | 'bottom-middle' | 'bottom-left' | 'bottom-right' }>`
  position: absolute;
  inset: 1px;
  overflow: hidden;

  /* Apple Liquid Glass core */
  background: rgba(24, 24, 24, 0.6);
  backdrop-filter: blur(60px) saturate(200%);
  -webkit-backdrop-filter: blur(60px) saturate(200%);
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow:
    0 8px 40px rgba(0, 0, 0, 0.45),
    0 2px 8px rgba(0, 0, 0, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.05);

  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);

  /* ── Specular light refraction ─── */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(
      90deg,
      transparent 0%,
      rgba(255, 255, 255, 0.25) 40%,
      rgba(255, 255, 255, 0.45) 50%,
      rgba(255, 255, 255, 0.25) 60%,
      transparent 100%
    );
    pointer-events: none;
    z-index: 1;
  }

  &::after {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    width: 1px;
    background: linear-gradient(
      180deg,
      rgba(255, 255, 255, 0.15) 0%,
      rgba(255, 255, 255, 0.05) 40%,
      rgba(255, 255, 255, 0.0) 100%
    );
    pointer-events: none;
    z-index: 1;
  }

  &:hover {
    border-color: rgba(255, 255, 255, 0.18);
    background: rgba(32, 32, 32, 0.7);
    box-shadow:
      0 20px 56px rgba(0, 0, 0, 0.65),
      0 6px 20px rgba(0, 0, 0, 0.45),
      inset 0 1px 0 rgba(255, 255, 255, 0.1);
  }

  border-radius: calc(24px - 1px);

  ${({ $position }) => $position === 'left-tall' && `
    @media (min-width: 1024px) {
      border-radius: 48px calc(24px - 1px) calc(24px - 1px) 48px;
    }
  `}

  ${({ $position }) => $position === 'right-tall' && `
    @media (min-width: 1024px) {
      border-radius: calc(24px - 1px) 48px 48px calc(24px - 1px);
    }
    @media (max-width: 1023px) {
      border-radius: calc(24px - 1px) calc(24px - 1px) 48px 48px;
    }
  `}

  ${({ $position }) => $position === 'top-middle' && `
    @media (max-width: 1023px) {
      border-radius: 48px 48px calc(24px - 1px) calc(24px - 1px);
    }
  `}

  ${({ $position }) => $position === 'bottom-left' && `
    @media (min-width: 769px) {
      border-radius: calc(24px - 1px) calc(24px - 1px) calc(24px - 1px) 48px;
    }
  `}

  ${({ $position }) => $position === 'bottom-right' && `
    @media (min-width: 769px) {
      border-radius: calc(24px - 1px) calc(24px - 1px) 48px calc(24px - 1px);
    }
  `}
`;

const BentoCardContent = styled.div<{ $position?: 'left-tall' | 'right-tall' | 'top-middle' | 'bottom-middle' | 'bottom-left' | 'bottom-right' }>`
  position: relative;
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
  border-radius: 24px;

  ${({ $position }) => $position === 'left-tall' && `
    @media (min-width: 1024px) {
      border-radius: 48px 24px 24px 48px;
    }
  `}

  ${({ $position }) => $position === 'right-tall' && `
    @media (min-width: 1024px) {
      border-radius: 24px 48px 48px 24px;
    }
    @media (max-width: 1023px) {
      border-radius: 24px 24px 48px 48px;
    }
  `}

  ${({ $position }) => $position === 'top-middle' && `
    @media (max-width: 1023px) {
      border-radius: 48px 48px 24px 24px;
    }
  `}

  ${({ $position }) => $position === 'bottom-left' && `
    @media (min-width: 769px) {
      border-radius: 24px 24px 24px 48px;
    }
  `}

  ${({ $position }) => $position === 'bottom-right' && `
    @media (min-width: 769px) {
      border-radius: 24px 24px 48px 24px;
    }
  `}
`;

const BentoCardHeader = styled.div<{ $compact?: boolean }>`
  padding: 32px 32px 12px;

  @media (max-width: 768px) {
    padding: 24px 24px 12px;
  }

  ${({ $compact }) => $compact && `
    padding-bottom: 0;
  `}
`;

const BentoCardTitle = styled.p`
  font-size: 18px;
  font-weight: 600;
  color: var(--text-color);
  margin-top: 8px;

  @media (max-width: 1024px) {
    text-align: center;
  }
`;

const BentoCardDescription = styled.p`
  font-size: 14px;
  line-height: 1.6;
  color: var(--text-secondary);
  margin-top: 8px;
  max-width: 400px;

  @media (max-width: 1024px) {
    text-align: center;
    margin-left: auto;
    margin-right: auto;
  }
`;

const BentoCardVisualContainer = styled.div<{ $type?: 'tall' | 'small' | 'bottom' }>`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px 32px 32px;
  position: relative;
  overflow: hidden;

  ${({ $type }) => $type === 'tall' && `
    @media (min-width: 1024px) {
      min-height: 360px;
    }
    padding: 0;
  `}

  ${({ $type }) => $type === 'bottom' && `
    min-height: 140px;
    padding: 16px 32px 24px;
  `}

  @media (max-width: 768px) {
    padding: 16px 24px 24px;
    min-height: 200px;
  }
`;

const BentoCardOverlay = styled.div<{ $position?: 'left-tall' | 'right-tall' | 'top-middle' | 'bottom-middle' | 'bottom-left' | 'bottom-right' }>`
  pointer-events: none;
  position: absolute;
  inset: 1px;
  border-radius: calc(24px - 1px);
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  outline: 1px solid rgba(0, 0, 0, 0.05);

  @media (prefers-color-scheme: dark) {
    outline-color: rgba(255, 255, 255, 0.15);
  }

  ${({ $position }) => $position === 'left-tall' && `
    @media (min-width: 1024px) {
      border-radius: 48px calc(24px - 1px) calc(24px - 1px) 48px;
    }
  `}

  ${({ $position }) => $position === 'right-tall' && `
    @media (min-width: 1024px) {
      border-radius: calc(24px - 1px) 48px 48px calc(24px - 1px);
    }
    @media (max-width: 1023px) {
      border-radius: calc(24px - 1px) calc(24px - 1px) 48px 48px;
    }
  `}

  ${({ $position }) => $position === 'top-middle' && `
    @media (max-width: 1023px) {
      border-radius: 48px 48px calc(24px - 1px) calc(24px - 1px);
    }
  `}

  ${({ $position }) => $position === 'bottom-left' && `
    @media (min-width: 769px) {
      border-radius: calc(24px - 1px) calc(24px - 1px) calc(24px - 1px) 48px;
    }
  `}

  ${({ $position }) => $position === 'bottom-right' && `
    @media (min-width: 769px) {
      border-radius: calc(24px - 1px) calc(24px - 1px) 48px calc(24px - 1px);
    }
  `}
`;

// ===== INNOVATION VISUAL (Left Tall Card) =====
const InnovationContainer = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  padding: 0 32px;

  @media (min-width: 1025px) {
    padding: 0 40px;
  }
`;

const PhoneMockup = styled.div`
  position: relative;
  width: 200px;
  height: 320px;
  background: linear-gradient(180deg, #1a1a2e 0%, #16213e 100%);
  border-radius: 32px 32px 0 0;
  border: 4px solid #2d3748;
  border-bottom: none;
  overflow: hidden;
  box-shadow: 0 -20px 60px rgba(99, 102, 241, 0.3);

  @media (max-width: 768px) {
    width: 160px;
    height: 260px;
    border-radius: 24px 24px 0 0;
  }
`;

const PhoneScreen = styled.div`
  position: absolute;
  inset: 8px;
  inset-bottom: 0;
  background: linear-gradient(180deg, #0f0f23 0%, #1a1a3e 100%);
  border-radius: 24px 24px 0 0;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  padding: 16px;
  gap: 12px;
`;

const PhoneNotch = styled.div`
  width: 60px;
  height: 20px;
  background: #000;
  border-radius: 0 0 12px 12px;
  margin: 0 auto;
  position: relative;
  top: -8px;
`;

const PhoneScoreCard = styled.div`
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.2) 0%, rgba(139, 92, 246, 0.2) 100%);
  border-radius: 16px;
  padding: 16px;
  text-align: center;
  border: 1px solid rgba(99, 102, 241, 0.3);
`;

const PhoneScoreValue = styled.div`
  font-size: 36px;
  font-weight: 800;
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const PhoneScoreLabel = styled.div`
  font-size: 10px;
  color: rgba(255, 255, 255, 0.6);
  margin-top: 4px;
`;

const PhoneProgressBar = styled.div`
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  height: 8px;
  overflow: hidden;
`;

const PhoneProgressFill = styled.div<{ $width: string; $color: string }>`
  height: 100%;
  width: ${({ $width }) => $width};
  background: ${({ $color }) => $color};
  border-radius: 8px;
`;

const PhoneListItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
`;

const PhoneListDot = styled.div<{ $color: string }>`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${({ $color }) => $color};
`;

const PhoneListText = styled.div`
  font-size: 9px;
  color: rgba(255, 255, 255, 0.7);
  flex: 1;
`;

// ===== PRIVACY VISUAL (Right Tall Card) =====
const PrivacyContainer = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
`;

const CodeEditorWrapper = styled.div`
  position: absolute;
  top: 24px;
  right: 0;
  bottom: 0;
  left: 24px;
  background: rgba(15, 15, 35, 0.9);
  border-radius: 16px 0 0 0;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-right: none;
  border-bottom: none;

  @media (max-width: 768px) {
    left: 16px;
    top: 16px;
  }
`;

const CodeEditorHeader = styled.div`
  display: flex;
  background: rgba(0, 0, 0, 0.4);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
`;

const CodeEditorTab = styled.div<{ $active?: boolean }>`
  padding: 10px 16px;
  font-size: 11px;
  font-family: 'SF Mono', monospace;
  color: ${({ $active }) => $active ? '#fff' : 'rgba(255, 255, 255, 0.5)'};
  background: ${({ $active }) => $active ? 'rgba(255, 255, 255, 0.05)' : 'transparent'};
  border-right: 1px solid rgba(255, 255, 255, 0.1);
  ${({ $active }) => $active && `border-bottom: 2px solid #10b981;`}
`;

const CodeEditorContent = styled.div`
  padding: 20px;
  font-family: 'SF Mono', 'Monaco', monospace;
  font-size: 11px;
  line-height: 1.8;
  color: rgba(255, 255, 255, 0.8);

  @media (min-width: 1025px) {
    font-size: 12px;
    padding: 24px;
  }
`;

const CodeLine = styled.div<{ $indent?: number }>`
  padding-left: ${({ $indent }) => ($indent || 0) * 16}px;

  .keyword { color: #c792ea; }
  .string { color: #c3e88d; }
  .function { color: #82aaff; }
  .comment { color: #546e7a; font-style: italic; }
  .number { color: #f78c6c; }
  .property { color: #89ddff; }
`;

// ===== ACCESSIBILITY VISUAL =====
const AccessibilityContainer = styled.div`
  width: 100%;
  max-width: 320px;
  height: 140px;
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(99, 102, 241, 0.15) 100%);
  border-radius: 16px;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  padding: 20px;
  gap: 12px;
`;

const AccessibilityBar = styled.div<{ $height: string; $color: string; $delay: number }>`
  width: 36px;
  height: ${({ $height }) => $height};
  background: linear-gradient(180deg, ${({ $color }) => $color} 0%, ${({ $color }) => $color}aa 100%);
  border-radius: 6px;
  animation: barGrow 1.5s ease-out forwards;
  animation-delay: ${({ $delay }) => $delay}s;
  transform-origin: bottom;

  @keyframes barGrow {
    0% { transform: scaleY(0); }
    100% { transform: scaleY(1); }
  }
`;

// ===== EDUCATION VISUAL =====
const EducationContainer = styled.div`
  width: 100%;
  max-width: 320px;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const EducationStep = styled.div<{ $delay: number }>`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  background: rgba(139, 92, 246, 0.1);
  border-radius: 12px;
  border: 1px solid rgba(139, 92, 246, 0.2);
  animation: slideIn 0.5s ease-out forwards;
  animation-delay: ${({ $delay }) => $delay}s;
  opacity: 0;
  transform: translateX(-20px);

  @keyframes slideIn {
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }
`;

const EducationStepNumber = styled.div`
  width: 28px;
  height: 28px;
  background: linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 700;
  color: white;
  flex-shrink: 0;
`;

const EducationStepText = styled.div`
  font-size: 12px;
  color: var(--text-secondary);
`;

// ===== SPEED VISUAL =====
const SpeedContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 24px;
  padding: 20px;
  background: linear-gradient(135deg, rgba(245, 158, 11, 0.1) 0%, rgba(249, 115, 22, 0.1) 100%);
  border-radius: 16px;
  width: 100%;
  max-width: 360px;
`;

const SpeedGauge = styled.div`
  width: 100px;
  height: 100px;
  position: relative;
  flex-shrink: 0;
`;

const SpeedGaugeCircle = styled.svg`
  width: 100%;
  height: 100%;
  transform: rotate(-90deg);
`;

const SpeedGaugeTrack = styled.circle`
  fill: none;
  stroke: rgba(249, 115, 22, 0.2);
  stroke-width: 8;
`;

const SpeedGaugeFill = styled.circle`
  fill: none;
  stroke: #f97316;
  stroke-width: 8;
  stroke-linecap: round;
  stroke-dasharray: 251;
  stroke-dashoffset: 50;
  animation: gaugeAnim 1.5s ease-out forwards;

  @keyframes gaugeAnim {
    from { stroke-dashoffset: 251; }
    to { stroke-dashoffset: 50; }
  }
`;

const SpeedGaugeValue = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const SpeedNumber = styled.span`
  font-size: 28px;
  font-weight: 800;
  color: #f97316;
`;

const SpeedUnit = styled.span`
  font-size: 11px;
  color: rgba(249, 115, 22, 0.7);
  margin-top: -4px;
`;

const SpeedStats = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const SpeedStatItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  color: var(--text-secondary);
`;

const SpeedStatDot = styled.div<{ $color: string }>`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${({ $color }) => $color};
`;

// ===== ACCURACY VISUAL =====
const AccuracyContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 24px;
  padding: 20px;
  background: linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(5, 150, 105, 0.1) 100%);
  border-radius: 16px;
  width: 100%;
  max-width: 360px;
`;

const TargetVisual = styled.div`
  width: 100px;
  height: 100px;
  position: relative;
  flex-shrink: 0;
`;

const TargetRing = styled.div<{ $size: string; $delay: number }>`
  position: absolute;
  top: 50%;
  left: 50%;
  width: ${({ $size }) => $size};
  height: ${({ $size }) => $size};
  border: 3px solid rgba(16, 185, 129, 0.3);
  border-radius: 50%;
  transform: translate(-50%, -50%) scale(0);
  animation: ringPulse 0.6s ease-out forwards;
  animation-delay: ${({ $delay }) => $delay}s;

  @keyframes ringPulse {
    to { transform: translate(-50%, -50%) scale(1); }
  }
`;

const TargetCenter = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  width: 24px;
  height: 24px;
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  border-radius: 50%;
  transform: translate(-50%, -50%) scale(0);
  animation: centerPop 0.4s ease-out forwards;
  animation-delay: 0.6s;
  box-shadow: 0 0 20px rgba(16, 185, 129, 0.5);

  @keyframes centerPop {
    to { transform: translate(-50%, -50%) scale(1); }
  }
`;

const AccuracyStats = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const AccuracyStatItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
`;

const AccuracyStatLabel = styled.span`
  font-size: 12px;
  color: var(--text-secondary);
`;

const AccuracyStatValue = styled.span`
  font-size: 14px;
  font-weight: 700;
  color: #10b981;
`;

const AuroraBackgroundContainer = styled.div`
  position: absolute;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
  z-index: 0;
  
  --aurora: repeating-linear-gradient(100deg, #3b82f6 10%, #a5b4fc 15%, #93c5fd 20%, #ddd6fe 25%, #60a5fa 30%);
  --dark-gradient: repeating-linear-gradient(100deg, #000 0%, #000 7%, transparent 10%, transparent 12%, #000 16%);
  /* For light mode, though mostly dark theme is active in this section */
  --white-gradient: repeating-linear-gradient(100deg, #fff 0%, #fff 7%, transparent 10%, transparent 12%, #fff 16%);
`;

const AuroraEffect = styled.div`
  position: absolute;
  inset: -10px;
  opacity: 0.5; /* Increased opacity to highlight aurora on black bg */
  filter: blur(10px) invert(0); 
  will-change: transform;
  
  [data-theme="dark"] &,
  @media (prefers-color-scheme: dark) {
    background-image: var(--dark-gradient), var(--aurora);
    filter: blur(10px);
  }

  [data-theme="light"] & {
    background-image: var(--white-gradient), var(--aurora);
    filter: blur(10px) invert(1);
  }

  mask-image: radial-gradient(ellipse at 100% 0%, black 10%, transparent 70%);

  background-image: var(--dark-gradient), var(--aurora);
  background-size: 300% 200%;
  background-position: 50% 50%, 50% 50%;
  
  &::after {
    content: "";
    position: absolute;
    inset: 0;
    background-image: var(--dark-gradient), var(--aurora);
    background-size: 200% 100%;
    background-attachment: fixed;
    mix-blend-mode: difference;
    animation: aurora-anim 60s linear infinite;

    [data-theme="light"] & {
      background-image: var(--white-gradient), var(--aurora);
    }
  }

  @keyframes aurora-anim {
    from {
      background-position: 50% 50%, 50% 50%;
    }
    to {
      background-position: 350% 50%, 350% 50%;
    }
  }
`;

const TeamSection = styled.section`
  position: relative;
  width: 100vw;
  margin-left: -50vw;
  left: 50%;
  margin-bottom: 120px;
  padding: 80px 24px;
  text-align: center;
  overflow: hidden;

  /* Apple Liquid Glass Section Surface */
  background: #000000;
  backdrop-filter: blur(80px) saturate(200%);
  -webkit-backdrop-filter: blur(80px) saturate(200%);

  /* Top/Bottom Specular borders */
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.05);

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(
      90deg,
      transparent 0%,
      rgba(255, 255, 255, 0.15) 40%,
      rgba(255, 255, 255, 0.3) 50%,
      rgba(255, 255, 255, 0.15) 60%,
      transparent 100%
    );
    z-index: 1;
  }

  @media (max-width: 768px) {
    padding: 60px 16px;
    margin-bottom: 80px;
  }
`;

/* optional: bento-style ambient blobs (subtle, non-distracting) */
const TeamAmbient = styled.div`
  pointer-events: none;
  position: absolute;
  inset: -40%;
  background:
    radial-gradient(closest-side at 25% 35%, rgba(99, 102, 241, 0.18), transparent 60%),
    radial-gradient(closest-side at 75% 55%, rgba(16, 185, 129, 0.16), transparent 60%),
    radial-gradient(closest-side at 55% 85%, rgba(139, 92, 246, 0.12), transparent 60%);
  filter: blur(18px);
  opacity: 0.9;
`;

const TeamInner = styled.div`
  position: relative;
  max-width: 1100px;
  margin: 0 auto;
`;

const TeamTitle = styled.h2`
  font-size: 48px;
  font-weight: 800;
  margin-bottom: 24px;
  letter-spacing: -0.02em;

  background: linear-gradient(180deg, #FFFFFF 0%, #A1A1AA 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;

  @media (max-width: 768px) {
    font-size: 36px;
  }
`;

const TeamText = styled.p`
  font-size: 18px;
  color: var(--text-secondary);
  line-height: 1.8;
  max-width: 780px;
  margin: 0 auto 40px;

  @media (max-width: 768px) {
    font-size: 16px;
    margin-bottom: 32px;
  }
`;

const TeamStats = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;
  margin-top: 24px;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
    gap: 12px;
  }
`;

const StatCard = styled.div`
  position: relative;
  background: rgba(24, 24, 24, 0.4);
  backdrop-filter: blur(40px) saturate(180%);
  -webkit-backdrop-filter: blur(40px) saturate(180%);
  border-radius: 24px;
  padding: 32px 24px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow:
    0 8px 32px rgba(0, 0, 0, 0.4),
    inset 0 1px 0 rgba(255, 255, 255, 0.05);

  transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.4s cubic-bezier(0.16, 1, 0.3, 1);

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(
      90deg,
      transparent 0%,
      rgba(255, 255, 255, 0.2) 50%,
      transparent 100%
    );
    z-index: 1;
  }

  &:hover {
    transform: translateY(-8px);
    box-shadow:
      0 16px 40px rgba(0, 0, 0, 0.5),
      inset 0 1px 0 rgba(255, 255, 255, 0.1);
    background: rgba(30, 30, 30, 0.5);
  }
`;

const StatNumber = styled.div`
  font-size: 56px;
  font-weight: 800;
  letter-spacing: -2px;
  margin-bottom: 8px;

  background: linear-gradient(135deg, #ffffff 0%, rgba(255, 255, 255, 0.7) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  filter: drop-shadow(0 2px 8px rgba(255, 255, 255, 0.15));
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;

  @media (max-width: 768px) {
    font-size: 44px;
  }
`;

const StatLabel = styled.div`
  font-size: 14px;
  color: var(--text-secondary);
  font-weight: 500;
`;


export default function AboutPage() {
  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: 'https://www.rejectly.pro' },
          { name: 'About', url: 'https://www.rejectly.pro/about' }
        ]}
      />
      <Container>
        <Content>
          <Header>
            <Title>About Rejectly.pro</Title>
          <Subtitle>
            Empowering job seekers with AI-driven insights to land their dream careers
          </Subtitle>
        </Header>

        <AboutBentoContainer>
          <AboutBentoGrid>
            {/* Our Story - Left Tall Card */}
            <AboutBentoCard $position="story">
              <AboutBentoCardInner $position="story" />
              <AboutBentoCardContent $position="story">
                <AboutBentoHeader $story>
                  <AboutBentoTitle>Our Story</AboutBentoTitle>
                  <AboutBentoDescription $story>
                    Rejectly.pro was born from a simple observation: talented professionals
                    were getting rejected not because they lacked skills, but because their
                    resumes didn't effectively communicate their value. We built this platform
                    to level the playing field.
                  </AboutBentoDescription>
                </AboutBentoHeader>
                <AboutBentoVisualContainer $type="story">
                  <StoryTimelineContainer>
                    <StoryTimelineLine />
                    <StoryTimelineItem $delay={0}>
                      <StoryTimelineDot $color="#ef4444">
                        <StoryTimelineEmoji>😔</StoryTimelineEmoji>
                      </StoryTimelineDot>
                      <StoryTimelineContent>
                        <StoryTimelineLabel>The Problem</StoryTimelineLabel>
                        <StoryTimelineText>Great talent, poor resume presentation</StoryTimelineText>
                      </StoryTimelineContent>
                    </StoryTimelineItem>
                    <StoryTimelineItem $delay={0.15}>
                      <StoryTimelineDot $color="#f59e0b">
                        <StoryTimelineEmoji>💡</StoryTimelineEmoji>
                      </StoryTimelineDot>
                      <StoryTimelineContent>
                        <StoryTimelineLabel>The Insight</StoryTimelineLabel>
                        <StoryTimelineText>AI can bridge this gap</StoryTimelineText>
                      </StoryTimelineContent>
                    </StoryTimelineItem>
                    <StoryTimelineItem $delay={0.3}>
                      <StoryTimelineDot $color="#10b981">
                        <StoryTimelineEmoji>🚀</StoryTimelineEmoji>
                      </StoryTimelineDot>
                      <StoryTimelineContent>
                        <StoryTimelineLabel>The Solution</StoryTimelineLabel>
                        <StoryTimelineText>Rejectly.pro is born</StoryTimelineText>
                      </StoryTimelineContent>
                    </StoryTimelineItem>
                    <StoryTimelineItem $delay={0.45}>
                      <StoryTimelineDot $color="#6366f1">
                        <StoryTimelineEmoji>🎯</StoryTimelineEmoji>
                      </StoryTimelineDot>
                      <StoryTimelineContent>
                        <StoryTimelineLabel>Today</StoryTimelineLabel>
                        <StoryTimelineText>Helping thousands land dream jobs</StoryTimelineText>
                      </StoryTimelineContent>
                    </StoryTimelineItem>
                  </StoryTimelineContainer>
                </AboutBentoVisualContainer>
              </AboutBentoCardContent>
              <AboutBentoCardOverlay $position="story" />
            </AboutBentoCard>

            {/* Our Mission - Top Right Card */}
            <AboutBentoCard $position="mission">
              <AboutBentoCardInner $position="mission" />
              <AboutBentoCardContent $position="mission">
                <AboutBentoHeader>
                  <AboutBentoTitle>Our Mission</AboutBentoTitle>
                  <AboutBentoDescription>
                    To democratize access to professional resume optimization, ensuring every
                    job seeker has the tools they need regardless of background or resources.
                  </AboutBentoDescription>
                </AboutBentoHeader>
                <AboutBentoVisualContainer $type="small">
                  <MissionContainer>
                    <MissionGlobe>
                      <MissionGlobeVertical />
                    </MissionGlobe>
                    <MissionPeopleGrid>
                      <MissionPerson $color="#3b82f6" $delay={0}>👤</MissionPerson>
                      <MissionPerson $color="#10b981" $delay={0.1}>👤</MissionPerson>
                      <MissionPerson $color="#f59e0b" $delay={0.2}>👤</MissionPerson>
                      <MissionPerson $color="#8b5cf6" $delay={0.3}>👤</MissionPerson>
                      <MissionPerson $color="#ef4444" $delay={0.4}>👤</MissionPerson>
                      <MissionPerson $color="#06b6d4" $delay={0.5}>👤</MissionPerson>
                      <MissionPerson $color="#ec4899" $delay={0.6}>👤</MissionPerson>
                      <MissionPerson $color="#84cc16" $delay={0.7}>👤</MissionPerson>
                      <MissionPerson $color="#f97316" $delay={0.8}>👤</MissionPerson>
                    </MissionPeopleGrid>
                  </MissionContainer>
                </AboutBentoVisualContainer>
              </AboutBentoCardContent>
              <AboutBentoCardOverlay $position="mission" />
            </AboutBentoCard>

            {/* Our Vision - Bottom Right Card */}
            <AboutBentoCard $position="vision">
              <AboutBentoCardInner $position="vision" />
              <AboutBentoCardContent $position="vision">
                <AboutBentoHeader>
                  <AboutBentoTitle>Our Vision</AboutBentoTitle>
                  <AboutBentoDescription>
                    To become the world's most trusted platform for career advancement,
                    empowering millions through intelligent, data-driven resume optimization.
                  </AboutBentoDescription>
                </AboutBentoHeader>
                <AboutBentoVisualContainer $type="small">
                  <VisionContainer>
                    <VisionPath viewBox="0 0 320 140">
                      <defs>
                        <linearGradient id="visionGradient" x1="0%" y1="100%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#6366f1" />
                          <stop offset="50%" stopColor="#8b5cf6" />
                          <stop offset="100%" stopColor="#a855f7" />
                        </linearGradient>
                      </defs>
                      <VisionPathLine d="M 30 120 Q 100 100 160 70 T 290 20" />
                    </VisionPath>
                    <VisionStar $top="15px" $left="70%" $size="12px" $delay={0.8} />
                    <VisionStar $top="25px" $left="85%" $size="16px" $delay={1} />
                    <VisionStar $top="40px" $left="75%" $size="10px" $delay={1.2} />
                    <VisionMilestone $position="start">
                      <VisionMilestoneNumber $color="#6366f1">50K+</VisionMilestoneNumber>
                      <VisionMilestoneLabel>Users</VisionMilestoneLabel>
                    </VisionMilestone>
                    <VisionMilestone $position="middle">
                      <VisionMilestoneNumber $color="#8b5cf6">1M+</VisionMilestoneNumber>
                      <VisionMilestoneLabel>Resumes</VisionMilestoneLabel>
                    </VisionMilestone>
                    <VisionMilestone $position="end">
                      <VisionMilestoneNumber $color="#a855f7">∞</VisionMilestoneNumber>
                      <VisionMilestoneLabel>Potential</VisionMilestoneLabel>
                    </VisionMilestone>
                  </VisionContainer>
                </AboutBentoVisualContainer>
              </AboutBentoCardContent>
              <AboutBentoCardOverlay $position="vision" />
            </AboutBentoCard>
          </AboutBentoGrid>
        </AboutBentoContainer>

        <Section>
          <SectionTitle>Our Core Values</SectionTitle>
          <SectionText>
            These principles guide everything we do and shape how we serve our users
          </SectionText>

          <BentoValuesContainer>
            <BentoValuesGrid>
              {/* Innovation - Left Tall Card */}
              <BentoCard $position="left-tall">
                <BentoCardInner $position="left-tall" />
                <BentoCardContent $position="left-tall">
                  <BentoCardHeader $compact>
                    <BentoCardTitle>Innovation</BentoCardTitle>
                    <BentoCardDescription>
                      Cutting-edge AI technology delivers smarter, more effective resume analysis tools.
                    </BentoCardDescription>
                  </BentoCardHeader>
                  <BentoCardVisualContainer $type="tall">
                    <InnovationContainer>
                      <PhoneMockup>
                        <PhoneScreen>
                          <PhoneNotch />
                          <PhoneScoreCard>
                            <PhoneScoreValue>87%</PhoneScoreValue>
                            <PhoneScoreLabel>Match Score</PhoneScoreLabel>
                          </PhoneScoreCard>
                          <PhoneProgressBar>
                            <PhoneProgressFill $width="87%" $color="linear-gradient(90deg, #6366f1, #8b5cf6)" />
                          </PhoneProgressBar>
                          <PhoneListItem>
                            <PhoneListDot $color="#10b981" />
                            <PhoneListText>Skills matched</PhoneListText>
                          </PhoneListItem>
                          <PhoneListItem>
                            <PhoneListDot $color="#f59e0b" />
                            <PhoneListText>Keywords found</PhoneListText>
                          </PhoneListItem>
                          <PhoneListItem>
                            <PhoneListDot $color="#6366f1" />
                            <PhoneListText>ATS optimized</PhoneListText>
                          </PhoneListItem>
                        </PhoneScreen>
                      </PhoneMockup>
                    </InnovationContainer>
                  </BentoCardVisualContainer>
                </BentoCardContent>
                <BentoCardOverlay $position="left-tall" />
              </BentoCard>

              {/* Accessibility - Top Middle Card */}
              <BentoCard $position="top-middle">
                <BentoCardInner $position="top-middle" />
                <BentoCardContent $position="top-middle">
                  <BentoCardHeader>
                    <BentoCardTitle>Accessibility</BentoCardTitle>
                    <BentoCardDescription>
                      Quality career tools for everyone. Affordable and user-friendly.
                    </BentoCardDescription>
                  </BentoCardHeader>
                  <BentoCardVisualContainer $type="small">
                    <AccessibilityContainer>
                      <AccessibilityBar $height="50px" $color="#3b82f6" $delay={0} />
                      <AccessibilityBar $height="75px" $color="#6366f1" $delay={0.1} />
                      <AccessibilityBar $height="100px" $color="#8b5cf6" $delay={0.2} />
                      <AccessibilityBar $height="60px" $color="#a855f7" $delay={0.3} />
                      <AccessibilityBar $height="85px" $color="#6366f1" $delay={0.4} />
                    </AccessibilityContainer>
                  </BentoCardVisualContainer>
                </BentoCardContent>
                <BentoCardOverlay $position="top-middle" />
              </BentoCard>

              {/* Privacy - Right Tall Card */}
              <BentoCard $position="right-tall">
                <BentoCardInner $position="right-tall" />
                <BentoCardContent $position="right-tall">
                  <BentoCardHeader $compact>
                    <BentoCardTitle>Privacy & Security</BentoCardTitle>
                    <BentoCardDescription>
                      Industry-leading security measures protect your sensitive career data.
                    </BentoCardDescription>
                  </BentoCardHeader>
                  <BentoCardVisualContainer $type="tall">
                    <PrivacyContainer>
                      <CodeEditorWrapper>
                        <CodeEditorHeader>
                          <CodeEditorTab $active>security.ts</CodeEditorTab>
                          <CodeEditorTab>config.ts</CodeEditorTab>
                        </CodeEditorHeader>
                        <CodeEditorContent>
                          <CodeLine><span className="comment">{'// AES-256 encryption'}</span></CodeLine>
                          <CodeLine><span className="keyword">const</span> <span className="function">encrypt</span> = (data) {'=> {'}</CodeLine>
                          <CodeLine $indent={1}><span className="keyword">return</span> crypto</CodeLine>
                          <CodeLine $indent={2}>.<span className="function">createCipher</span>(<span className="string">&apos;aes-256&apos;</span>)</CodeLine>
                          <CodeLine $indent={2}>.<span className="function">update</span>(data)</CodeLine>
                          <CodeLine>{'}'};</CodeLine>
                          <CodeLine></CodeLine>
                          <CodeLine><span className="comment">{'// Compliance status'}</span></CodeLine>
                          <CodeLine><span className="keyword">export const</span> compliance = {'{'}</CodeLine>
                          <CodeLine $indent={1}><span className="property">gdpr:</span> <span className="string">true</span>,</CodeLine>
                          <CodeLine $indent={1}><span className="property">ccpa:</span> <span className="string">true</span>,</CodeLine>
                          <CodeLine $indent={1}><span className="property">soc2:</span> <span className="string">true</span>,</CodeLine>
                          <CodeLine $indent={1}><span className="property">iso27001:</span> <span className="string">true</span></CodeLine>
                          <CodeLine>{'}'};</CodeLine>
                        </CodeEditorContent>
                      </CodeEditorWrapper>
                    </PrivacyContainer>
                  </BentoCardVisualContainer>
                </BentoCardContent>
                <BentoCardOverlay $position="right-tall" />
              </BentoCard>

              {/* Education - Bottom Middle Card */}
              <BentoCard $position="bottom-middle">
                <BentoCardInner $position="bottom-middle" />
                <BentoCardContent $position="bottom-middle">
                  <BentoCardHeader>
                    <BentoCardTitle>Education</BentoCardTitle>
                    <BentoCardDescription>
                      Learn why and how. Best practices for long-term success.
                    </BentoCardDescription>
                  </BentoCardHeader>
                  <BentoCardVisualContainer $type="small">
                    <EducationContainer>
                      <EducationStep $delay={0}>
                        <EducationStepNumber>1</EducationStepNumber>
                        <EducationStepText>Analyze your resume</EducationStepText>
                      </EducationStep>
                      <EducationStep $delay={0.15}>
                        <EducationStepNumber>2</EducationStepNumber>
                        <EducationStepText>Understand the gaps</EducationStepText>
                      </EducationStep>
                      <EducationStep $delay={0.3}>
                        <EducationStepNumber>3</EducationStepNumber>
                        <EducationStepText>Apply improvements</EducationStepText>
                      </EducationStep>
                    </EducationContainer>
                  </BentoCardVisualContainer>
                </BentoCardContent>
                <BentoCardOverlay $position="bottom-middle" />
              </BentoCard>
            </BentoValuesGrid>

            {/* Bottom Row - Speed & Accuracy */}
            <BentoBottomRow>
              {/* Speed Card */}
              <BentoCard $position="bottom-left">
                <BentoCardInner $position="bottom-left" />
                <BentoCardContent $position="bottom-left">
                  <BentoCardHeader>
                    <BentoCardTitle>Speed</BentoCardTitle>
                    <BentoCardDescription>
                      Fast, actionable insights. Iterate and improve quickly.
                    </BentoCardDescription>
                  </BentoCardHeader>
                  <BentoCardVisualContainer $type="bottom">
                    <SpeedContainer>
                      <SpeedGauge>
                        <SpeedGaugeCircle viewBox="0 0 100 100">
                          <SpeedGaugeTrack cx="50" cy="50" r="40" />
                          <SpeedGaugeFill cx="50" cy="50" r="40" />
                        </SpeedGaugeCircle>
                        <SpeedGaugeValue>
                          <SpeedNumber>2</SpeedNumber>
                          <SpeedUnit>seconds</SpeedUnit>
                        </SpeedGaugeValue>
                      </SpeedGauge>
                      <SpeedStats>
                        <SpeedStatItem>
                          <SpeedStatDot $color="#f97316" />
                          Instant analysis
                        </SpeedStatItem>
                        <SpeedStatItem>
                          <SpeedStatDot $color="#fb923c" />
                          Real-time feedback
                        </SpeedStatItem>
                        <SpeedStatItem>
                          <SpeedStatDot $color="#fdba74" />
                          Quick iterations
                        </SpeedStatItem>
                      </SpeedStats>
                    </SpeedContainer>
                  </BentoCardVisualContainer>
                </BentoCardContent>
                <BentoCardOverlay $position="bottom-left" />
              </BentoCard>

              {/* Accuracy Card */}
              <BentoCard $position="bottom-right">
                <BentoCardInner $position="bottom-right" />
                <BentoCardContent $position="bottom-right">
                  <BentoCardHeader>
                    <BentoCardTitle>Accuracy</BentoCardTitle>
                    <BentoCardDescription>
                      AI trained on millions of resumes. Reliable recommendations.
                    </BentoCardDescription>
                  </BentoCardHeader>
                  <BentoCardVisualContainer $type="bottom">
                    <AccuracyContainer>
                      <TargetVisual>
                        <TargetRing $size="100px" $delay={0} />
                        <TargetRing $size="70px" $delay={0.15} />
                        <TargetRing $size="40px" $delay={0.3} />
                        <TargetCenter />
                      </TargetVisual>
                      <AccuracyStats>
                        <AccuracyStatItem>
                          <AccuracyStatLabel>Precision</AccuracyStatLabel>
                          <AccuracyStatValue>98.5%</AccuracyStatValue>
                        </AccuracyStatItem>
                        <AccuracyStatItem>
                          <AccuracyStatLabel>Recall</AccuracyStatLabel>
                          <AccuracyStatValue>97.2%</AccuracyStatValue>
                        </AccuracyStatItem>
                        <AccuracyStatItem>
                          <AccuracyStatLabel>F1 Score</AccuracyStatLabel>
                          <AccuracyStatValue>97.8%</AccuracyStatValue>
                        </AccuracyStatItem>
                      </AccuracyStats>
                    </AccuracyContainer>
                  </BentoCardVisualContainer>
                </BentoCardContent>
                <BentoCardOverlay $position="bottom-right" />
              </BentoCard>
            </BentoBottomRow>
          </BentoValuesContainer>
        </Section>

        <TeamSection>
  <AuroraBackgroundContainer>
    <AuroraEffect />
  </AuroraBackgroundContainer>
  <TeamInner>
    <TeamTitle>Built by Job Seekers, For Job Seekers</TeamTitle>
    <TeamText>
      Our team has been in your shoes. We've experienced the frustration of resume
      rejections, the anxiety of job searches, and the joy of finally landing that
      perfect role. This firsthand experience drives us to build the best possible
      tools for your career success.
    </TeamText>

    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: { staggerChildren: 0.15 }
        }
      }}
    >
      <TeamStats as={motion.div}>
        <StatCard
          as={motion.div}
          variants={{
            hidden: { opacity: 0, y: 30 },
            visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 20 } }
          }}
        >
          <StatNumber>50K+</StatNumber>
          <StatLabel>Resumes Analyzed</StatLabel>
        </StatCard>

        <StatCard
          as={motion.div}
          variants={{
            hidden: { opacity: 0, y: 30 },
            visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 20 } }
          }}
        >
          <StatNumber>85%</StatNumber>
          <StatLabel>Interview Rate Increase</StatLabel>
        </StatCard>

        <StatCard
          as={motion.div}
          variants={{
            hidden: { opacity: 0, y: 30 },
            visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 20 } }
          }}
        >
          <StatNumber>24/7</StatNumber>
          <StatLabel>AI-Powered Support</StatLabel>
        </StatCard>
      </TeamStats>
    </motion.div>
  </TeamInner>
</TeamSection>

        <SecondaryCTA />
      </Content>
      <Footer />
    </Container>
    </>
  );
}
