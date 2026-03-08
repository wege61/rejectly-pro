"use client";

import styled from "styled-components";
import Image from "next/image";
import { ROUTES } from "@/lib/constants";

const SectionWrapper = styled.section`
  position: relative;
  isolation: isolate;
  background: var(--bg-color);
  padding: 96px 24px;
  font-family: ${({ theme }) => theme.typography.fontFamily.sans};
  overflow: hidden;

  /* Ambient Apple Aurora Background */
  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 80vw;
    height: 80vw;
    max-width: 1200px;
    max-height: 1200px;
    background: radial-gradient(circle at 30% 30%, rgba(94, 234, 212, 0.15) 0%, transparent 40%),
                radial-gradient(circle at 70% 70%, rgba(14, 165, 233, 0.15) 0%, transparent 40%);
    filter: blur(120px);
    z-index: -1;
    pointer-events: none;
    border-radius: 50%;
  }

  @media (max-width: 768px) {
    padding: 64px 16px;
  }
`;

const Container = styled.div`
  max-width: 1280px;
  margin: 0 auto;
`;

const CTABox = styled.div`
  position: relative;
  isolation: isolate;
  overflow: hidden;
  padding: 64px 24px 0;
  border-radius: 32px;
  
  /* Apple Liquid Glass Effect */
  background: rgba(150, 150, 150, 0.05);
  backdrop-filter: blur(40px) saturate(200%);
  -webkit-backdrop-filter: blur(40px) saturate(200%);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 
    inset 0 1px 1px rgba(255, 255, 255, 0.2), 
    0 24px 64px rgba(0, 0, 0, 0.4);

  /* Subtle inner glow replacing the GradientCircle */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 100%;
    background: radial-gradient(circle at top left, rgba(255, 255, 255, 0.1), transparent 60%);
    pointer-events: none;
    z-index: -1;
  }

  @media (min-width: 640px) {
    padding: 64px 64px 0;
  }

  @media (min-width: 1024px) {
    display: flex;
    gap: 80px;
    padding: 0 96px;
  }
`;

const ContentSection = styled.div`
  max-width: 448px;
  margin: 0 auto;
  text-align: center;

  @media (min-width: 1024px) {
    margin: 0;
    flex: 1 1 auto;
    padding: 128px 0;
    text-align: left;
  }
`;

const Title = styled.h2`
  font-size: 30px;
  font-weight: 700;
  letter-spacing: -0.025em;
  color: var(--text-color);
  text-wrap: balance;
  font-family: ${({ theme }) => theme.typography.fontFamily.sans};

  @media (min-width: 640px) {
    font-size: 36px;
  }
`;

const Description = styled.p`
  margin-top: 24px;
  font-size: 18px;
  line-height: 1.75;
  color: var(--text-secondary);
  text-wrap: pretty;
  font-family: ${({ theme }) => theme.typography.fontFamily.sans};
`;

const ButtonGroup = styled.div`
  margin-top: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 24px;

  @media (min-width: 1024px) {
    justify-content: flex-start;
  }
`;

const PrimaryButton = styled.a`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 9999px;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.18) 0%, rgba(255, 255, 255, 0) 100%),
    var(--primary-500);
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  padding: 14px 28px;
  font-size: 15px;
  font-weight: 600;
  color: white;
  text-decoration: none;
  border: 1px solid rgba(255, 255, 255, 0.28);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.5), 0 4px 16px rgba(var(--primary-500-rgb), 0.3);
  transition: all 0.35s cubic-bezier(0.25, 0.8, 0.25, 1);
  font-family: ${({ theme }) => theme.typography.fontFamily.sans};

  &:hover {
    filter: brightness(1.1);
    box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.65), 0 4px 20px rgba(var(--primary-500-rgb), 0.45);
  }

  &:focus-visible {
    outline: 2px solid var(--primary-500);
    outline-offset: 2px;
  }
`;

const SecondaryButton = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 15px;
  font-weight: 600;
  color: var(--text-color);
  text-decoration: none;
  transition: all 0.2s ease;
  font-family: ${({ theme }) => theme.typography.fontFamily.sans};
  position: relative;

  &::after {
    content: '';
    position: absolute;
    bottom: -2px;
    left: 0;
    width: 0;
    height: 1.5px;
    background: currentColor;
    transition: width 0.25s cubic-bezier(0.25, 0.8, 0.25, 1);
  }

  &:hover::after {
    width: 100%;
  }

  span {
    margin-left: 4px;
    transition: transform 0.2s ease;
  }

  &:hover span {
    transform: translateX(4px);
  }
`;

const ImageSection = styled.div`
  position: relative;
  margin-top: 64px;
  height: 320px;

  @media (min-width: 1024px) {
    margin-top: 32px;
  }
`;

const AppScreenshot = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 912px;
  max-width: none;
  border-radius: 16px 0 0 0;
  background: rgba(20, 20, 20, 0.9);
  padding-top: 24px;
  padding-left: 24px;
  box-shadow:
    -20px -20px 60px rgba(0, 0, 0, 0.5),
    inset 1px 1px 1px rgba(255, 255, 255, 0.15);
  overflow: hidden;
  
  /* Mac window top bar mockup */
  &::before {
    content: '';
    position: absolute;
    top: 10px;
    left: 10px;
    width: 40px;
    height: 10px;
    background-image: 
      radial-gradient(circle at 5px 5px, #ff5f56 5px, transparent 6px),
      radial-gradient(circle at 20px 5px, #ffbd2e 5px, transparent 6px),
      radial-gradient(circle at 35px 5px, #27c93f 5px, transparent 6px);
    background-size: 40px 10px;
    background-repeat: no-repeat;
  }

  img {
    width: 100%;
    height: auto;
    display: block;
    border-radius: 8px 0 0 0;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
    border-left: 1px solid rgba(255, 255, 255, 0.1);
  }
`;

export function SecondaryCTA() {
  return (
    <SectionWrapper>
      <Container>
        <CTABox>

          <ContentSection>
            <Title>
              Your competitors have already optimized their resumes.
            </Title>
            <Description>
              Stop leaving your career to chance. Get the same unfair AI advantage that thousands of professionals are using to secure $100k+ roles right now.
            </Description>
            <ButtonGroup>
              <PrimaryButton href={ROUTES.AUTH.SIGNUP}>
                Scan My Resume for $2
              </PrimaryButton>
              <SecondaryButton href={ROUTES.PUBLIC.PRICING}>
                View Plans
                <span aria-hidden="true">→</span>
              </SecondaryButton>
            </ButtonGroup>
          </ContentSection>

          <ImageSection>
            <AppScreenshot>
              <Image
                src="/dashboard-screenshot.jpg"
                alt="Rejectly app screenshot showing resume analysis dashboard"
                width={1824}
                height={1080}
                priority
              />
            </AppScreenshot>
          </ImageSection>
        </CTABox>
      </Container>
    </SectionWrapper>
  );
}
