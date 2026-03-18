"use client";

import styled from "styled-components";
import Image from "next/image";
import { ROUTES } from "@/lib/constants";

const SectionWrapper = styled.section`
  position: relative;
  background: var(--bg-color);
  padding: 96px 24px;
  font-family: ${({ theme }) => theme.typography.fontFamily.sans};
  overflow: hidden;

  @media (max-width: 768px) {
    padding: 64px 16px;
  }
`;

const Container = styled.div`
  max-width: 1080px;
  margin: 0 auto;
`;

const CTABox = styled.div`
  position: relative;
  overflow: hidden;
  border-radius: 28px;
  background: rgba(128, 128, 128, 0.04);

  @media (min-width: 1024px) {
    display: flex;
    align-items: center;
  }
`;

const ContentSection = styled.div`
  max-width: 480px;
  padding: 48px 32px;
  text-align: center;
  margin: 0 auto;

  @media (min-width: 640px) {
    padding: 56px 48px;
  }

  @media (min-width: 1024px) {
    margin: 0;
    flex-shrink: 0;
    padding: 72px 56px;
    text-align: left;
  }
`;

const Title = styled.h2`
  font-size: 28px;
  font-weight: 700;
  letter-spacing: -0.03em;
  line-height: 1.2;
  color: var(--text-color);
  text-wrap: balance;
  font-family: ${({ theme }) => theme.typography.fontFamily.sans};

  @media (min-width: 640px) {
    font-size: 34px;
  }
`;

const Description = styled.p`
  margin-top: 16px;
  font-size: 16px;
  line-height: 1.6;
  color: var(--text-secondary);
  font-family: ${({ theme }) => theme.typography.fontFamily.sans};
`;

const ButtonGroup = styled.div`
  margin-top: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;

  @media (min-width: 1024px) {
    justify-content: flex-start;
  }
`;

const PrimaryButton = styled.a`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.18) 0%, rgba(255, 255, 255, 0) 100%),
    rgba(238, 90, 90, 0.82);
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  color: #FFFFFF;
  padding: 14px 32px;
  border-radius: 9999px;
  font-weight: 700;
  font-size: 16px;
  transition: all 0.35s cubic-bezier(0.25, 0.8, 0.25, 1);
  cursor: pointer;
  text-decoration: none;
  border: 1px solid rgba(255, 255, 255, 0.28);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.5),
    0 8px 32px rgba(238, 90, 90, 0.35);
  font-family: ${({ theme }) => theme.typography.fontFamily.sans};

  &:hover {
    background: linear-gradient(180deg, rgba(255, 255, 255, 0.26) 0%, rgba(255, 255, 255, 0) 100%),
      rgba(238, 90, 90, 0.92);
    box-shadow:
      inset 0 1px 0 rgba(255, 255, 255, 0.65),
      0 8px 32px rgba(238, 90, 90, 0.5);
  }

  &:focus-visible {
    outline: 2px solid rgba(238, 90, 90, 0.8);
    outline-offset: 2px;
  }

  @media (max-width: 640px) {
    width: 100%;
    max-width: 280px;
    font-size: 15px;
    padding: 14px 28px;
  }
`;

const SecondaryButton = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 15px;
  font-weight: 600;
  color: var(--accent);
  text-decoration: none;
  transition: opacity 0.2s ease;
  font-family: ${({ theme }) => theme.typography.fontFamily.sans};

  &:hover {
    opacity: 0.7;
  }

  span {
    transition: transform 0.2s ease;
  }

  &:hover span {
    transform: translateX(3px);
  }
`;

const ImageSection = styled.div`
  position: relative;
  flex: 1;
  min-height: 280px;

  @media (max-width: 1023px) {
    height: 280px;
    margin: 0 32px;
  }
`;

const AppScreenshot = styled.div`
  position: absolute;
  top: 32px;
  left: 0;
  width: 900px;
  max-width: none;
  border-radius: 12px 0 0 0;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);

  @media (prefers-color-scheme: dark) {
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.4);
  }

  img {
    width: 100%;
    height: auto;
    display: block;
  }

  @media (min-width: 1024px) {
    top: 48px;
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
              Stop leaving your career to chance. Get the same AI advantage that thousands of professionals are using to secure $100k+ roles.
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
