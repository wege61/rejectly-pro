"use client";

import styled, { keyframes } from "styled-components";
import { useState, useEffect } from "react";
import { Modal } from "./Modal";
import { Button } from "./Button";

// Animations
const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const slideInLeft = keyframes`
  from {
    opacity: 0;
    transform: translateX(-50px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`;

const slideInRight = keyframes`
  from {
    opacity: 0;
    transform: translateX(50px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`;

const float = keyframes`
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-20px);
  }
`;

const pulse = keyframes`
  0%, 100% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.05);
    opacity: 0.8;
  }
`;

// Styled Components
const WelcomeContainer = styled.div`
  position: relative;
  height: 600px;
  display: flex;
  flex-direction: column;

  @media (max-height: 700px) {
    height: 500px;
  }
`;

const SlidesWrapper = styled.div`
  position: relative;
  flex: 1;
  overflow: hidden;
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const SlidesContainer = styled.div<{ $currentSlide: number }>`
  display: flex;
  height: 100%;
  transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  transform: translateX(-${({ $currentSlide }) => $currentSlide * 100}%);
`;

const Slide = styled.div`
  min-width: 100%;
  height: 100%;
  padding: ${({ theme }) => `${theme.spacing.xl} ${theme.spacing.lg}`};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  position: relative;
`;

const SlideIcon = styled.div<{ $animation?: string }>`
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  animation: ${({ $animation }) => {
    switch ($animation) {
      case 'float':
        return float;
      case 'pulse':
        return pulse;
      default:
        return fadeInUp;
    }
  }} 2s ease-in-out infinite;

  svg {
    width: 80px;
    height: 80px;
    stroke-width: 1.5;
    color: ${({ theme }) => theme.colors.primary};
  }

  @media (max-height: 700px) {
    svg {
      width: 60px;
      height: 60px;
    }
    margin-bottom: ${({ theme }) => theme.spacing.md};
  }
`;

const SlideTitle = styled.h2`
  font-size: ${({ theme }) => theme.typography.fontSize["2xl"]};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.textPrimary};
  margin-bottom: ${({ theme }) => theme.spacing.sm};

  @media (max-height: 700px) {
    font-size: ${({ theme }) => theme.typography.fontSize.xl};
  }
`;

const SlideDescription = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  color: ${({ theme }) => theme.colors.textSecondary};
  max-width: 480px;
  line-height: ${({ theme }) => theme.typography.lineHeight.relaxed};

  @media (max-height: 700px) {
    font-size: ${({ theme }) => theme.typography.fontSize.sm};
  }
`;

const SlideFeatures = styled.ul`
  list-style: none;
  padding: 0;
  margin-top: ${({ theme }) => theme.spacing.lg};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const FeatureItem = styled.li`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  color: ${({ theme }) => theme.colors.textPrimary};

  svg {
    width: 24px;
    height: 24px;
    color: ${({ theme }) => theme.colors.success};
    flex-shrink: 0;
  }
`;

const NavigationSection = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${({ theme }) => theme.spacing.xl};
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  gap: ${({ theme }) => theme.spacing.md};
`;

const DotsContainer = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
  justify-content: center;
  flex: 1;
`;

const Dot = styled.button<{ $isActive: boolean }>`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: ${({ theme, $isActive }) =>
    $isActive ? theme.colors.primary : theme.colors.border};
  transition: all ${({ theme }) => theme.transitions.normal};
  cursor: pointer;
  border: none;
  padding: 0;

  &:hover {
    transform: scale(1.2);
    background-color: ${({ theme }) => theme.colors.primary};
  }
`;

const GradientBackground = styled.div<{ $variant: number }>`
  position: absolute;
  top: -50%;
  left: -50%;
  right: -50%;
  bottom: -50%;
  opacity: 0.1;
  pointer-events: none;
  z-index: -1;

  background: ${({ $variant }) => {
    switch ($variant) {
      case 0:
        return 'radial-gradient(circle at 30% 50%, var(--primary-500) 0%, transparent 50%)';
      case 1:
        return 'radial-gradient(circle at 70% 50%, var(--primary-600) 0%, transparent 50%)';
      case 2:
        return 'radial-gradient(circle at 50% 30%, var(--primary-400) 0%, transparent 50%)';
      case 3:
        return 'radial-gradient(circle at 50% 70%, var(--primary-500) 0%, transparent 50%)';
      default:
        return 'radial-gradient(circle at 50% 50%, var(--primary-500) 0%, transparent 50%)';
    }
  }};
`;

// Icons
const RocketIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.631 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 00-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 01-2.448-2.448 14.9 14.9 0 01.06-.312m-2.24 2.39a4.493 4.493 0 00-1.757 4.306 4.493 4.493 0 004.306-1.758M16.5 9a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z"
    />
  </svg>
);

const DocumentIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
    />
  </svg>
);

const BriefcaseIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0M12 12.75h.008v.008H12v-.008z"
    />
  </svg>
);

const ChartIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z"
    />
  </svg>
);

const SparklesIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z"
    />
  </svg>
);

const EditIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
    />
  </svg>
);

const CheckIcon = () => (
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
      d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);

interface WelcomeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
}

const SLIDES_DATA = [
  {
    icon: <RocketIcon />,
    title: "Land Your Dream Job 3x Faster",
    description: "Join thousands of job seekers who have transformed their career with AI-powered resume optimization and smart job matching.",
    animation: "float" as const,
    variant: 0,
  },
  {
    icon: <DocumentIcon />,
    title: "AI-Powered Resume Analysis",
    description: "Get past ATS systems and stand out to recruiters. Our AI analyzes your resume like a hiring manager would.",
    features: [
      "Beat 95% of ATS systems instantly",
      "Identify missing keywords in seconds",
      "Get actionable improvement tips",
    ],
    animation: "pulse" as const,
    variant: 1,
  },
  {
    icon: <BriefcaseIcon />,
    title: "Smart Job Matching",
    description: "Stop wasting time on wrong applications. Know your match score before you apply and focus on opportunities you'll actually get.",
    features: [
      "See your fit score for each job (0-100%)",
      "Discover which skills you're missing",
      "Apply only where you have 70%+ match",
    ],
    animation: "float" as const,
    variant: 2,
  },
  {
    icon: <EditIcon />,
    title: "AI Cover Letter Generator",
    description: "Generate personalized, compelling cover letters in seconds. Each one tailored to the specific job and company.",
    features: [
      "Save 2+ hours per application",
      "85% higher response rate",
      "Multiple tone options (professional, friendly, formal)",
    ],
    animation: "pulse" as const,
    variant: 3,
  },
  {
    icon: <ChartIcon />,
    title: "Track Your Progress & Improve",
    description: "Get detailed analytics on every application. See what's working, what's not, and continuously improve your success rate.",
    features: [
      "Visual analysis reports for each application",
      "Track application success over time",
      "Learn from your best-performing resumes",
    ],
    animation: "float" as const,
    variant: 1,
  },
  {
    icon: <SparklesIcon />,
    title: "Ready to Get More Interviews?",
    description: "Start optimizing your job search today. Most users see results within their first 5 applications.",
    animation: "pulse" as const,
    variant: 0,
  },
];

export function WelcomeModal({ isOpen, onClose, onComplete }: WelcomeModalProps) {
  const [currentSlide, setCurrentSlide] = useState(0);

  const totalSlides = SLIDES_DATA.length;
  const isLastSlide = currentSlide === totalSlides - 1;

  const handleNext = () => {
    if (isLastSlide) {
      onComplete();
    } else {
      setCurrentSlide((prev) => Math.min(prev + 1, totalSlides - 1));
    }
  };

  const handlePrev = () => {
    setCurrentSlide((prev) => Math.max(prev - 1, 0));
  };

  const handleSkip = () => {
    onComplete();
  };

  const handleDotClick = (index: number) => {
    setCurrentSlide(index);
  };

  // Reset slide when modal opens
  useEffect(() => {
    if (isOpen) {
      setCurrentSlide(0);
    }
  }, [isOpen]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === 'ArrowRight') {
        handleNext();
      } else if (e.key === 'ArrowLeft' && currentSlide > 0) {
        handlePrev();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, currentSlide, isLastSlide]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg" showCloseButton={false}>
      <Modal.Body style={{ padding: 0 }}>
        <WelcomeContainer>
          <SlidesWrapper>
            <SlidesContainer $currentSlide={currentSlide}>
              {SLIDES_DATA.map((slide, index) => (
                <Slide key={index}>
                  <GradientBackground $variant={slide.variant} />
                  <SlideIcon $animation={slide.animation}>
                    {slide.icon}
                  </SlideIcon>
                  <SlideTitle>{slide.title}</SlideTitle>
                  <SlideDescription>{slide.description}</SlideDescription>
                  {slide.features && (
                    <SlideFeatures>
                      {slide.features.map((feature, idx) => (
                        <FeatureItem key={idx}>
                          <CheckIcon />
                          <span>{feature}</span>
                        </FeatureItem>
                      ))}
                    </SlideFeatures>
                  )}
                </Slide>
              ))}
            </SlidesContainer>
          </SlidesWrapper>

          <NavigationSection>
            <Button
              variant="ghost"
              onClick={currentSlide === 0 ? handleSkip : handlePrev}
              size="sm"
            >
              {currentSlide === 0 ? 'Skip' : '← Back'}
            </Button>

            <DotsContainer>
              {SLIDES_DATA.map((_, index) => (
                <Dot
                  key={index}
                  $isActive={currentSlide === index}
                  onClick={() => handleDotClick(index)}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </DotsContainer>

            <Button onClick={handleNext} size="sm">
              {isLastSlide ? 'Get Started!' : 'Next →'}
            </Button>
          </NavigationSection>
        </WelcomeContainer>
      </Modal.Body>
    </Modal>
  );
}
