"use client";

import styled, { keyframes } from "styled-components";
import Link from "next/link";
import { ROUTES } from "@/lib/constants";

const float = keyframes`
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-16px); }
`;

const pulse = keyframes`
  0%, 100% { opacity: 0.4; }
  50% { opacity: 0.8; }
`;

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bg-color, #09090b);
  padding: 24px;
  position: relative;
  overflow: hidden;
`;

const GlowOrb = styled.div`
  position: absolute;
  width: 400px;
  height: 400px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(53, 162, 159, 0.08) 0%, transparent 70%);
  animation: ${pulse} 4s ease-in-out infinite;
  pointer-events: none;
  
  &:nth-child(1) {
    top: -100px;
    right: -100px;
  }
  &:nth-child(2) {
    bottom: -150px;
    left: -100px;
    animation-delay: 2s;
  }
`;

const Content = styled.div`
  text-align: center;
  max-width: 480px;
  position: relative;
  z-index: 1;
`;

const ErrorCode = styled.div`
  font-size: clamp(100px, 20vw, 180px);
  font-weight: 800;
  letter-spacing: -0.04em;
  line-height: 1;
  background: linear-gradient(
    180deg,
    rgba(255, 255, 255, 0.15) 0%,
    rgba(255, 255, 255, 0.04) 100%
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: ${float} 6s ease-in-out infinite;
  user-select: none;
  margin-bottom: -16px;
`;

const Title = styled.h1`
  font-size: 24px;
  font-weight: 700;
  color: #fff;
  margin-bottom: 12px;
  letter-spacing: -0.02em;
`;

const Description = styled.p`
  font-size: 16px;
  color: rgba(255, 255, 255, 0.5);
  line-height: 1.6;
  margin-bottom: 36px;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
  justify-content: center;
  flex-wrap: wrap;
`;

const PrimaryButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 14px 28px;
  background: linear-gradient(
    135deg,
    rgba(53, 162, 159, 0.9) 0%,
    rgba(11, 102, 106, 0.9) 100%
  );
  color: #fff;
  border: 1px solid rgba(53, 162, 159, 0.5);
  border-radius: 9999px;
  font-size: 15px;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.2s ease;
  box-shadow: 0 8px 32px rgba(53, 162, 159, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);

  &:hover {
    box-shadow: 0 12px 40px rgba(53, 162, 159, 0.35),
      inset 0 1px 0 rgba(255, 255, 255, 0.3);
    transform: translateY(-1px);
  }
`;

const SecondaryButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 14px 28px;
  background: rgba(255, 255, 255, 0.04);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  color: rgba(255, 255, 255, 0.7);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 9999px;
  font-size: 15px;
  font-weight: 500;
  text-decoration: none;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.08);
    color: #fff;
    border-color: rgba(255, 255, 255, 0.2);
  }
`;

export default function NotFound() {
  return (
    <Container>
      <GlowOrb />
      <GlowOrb />
      <Content>
        <ErrorCode>404</ErrorCode>
        <Title>Page not found</Title>
        <Description>
          The page you&apos;re looking for doesn&apos;t exist or has been moved. 
          Let&apos;s get you back on track.
        </Description>
        <ButtonGroup>
          <PrimaryButton href={ROUTES.PUBLIC.HOME}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
              <polyline points="9 22 9 12 15 12 15 22"/>
            </svg>
            Go Home
          </PrimaryButton>
          <SecondaryButton href={ROUTES.PUBLIC.ATS_CHECK}>
            Check Your Resume
          </SecondaryButton>
        </ButtonGroup>
      </Content>
    </Container>
  );
}
