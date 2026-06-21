'use client';

import styled from 'styled-components';
import Link from 'next/link';
import { ROUTES } from '@/lib/constants';
import AuthSidePanel from '@/components/auth/AuthSidePanel';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100dvh;
  width: 100%;
  overflow-x: hidden;

  @media (min-width: 1024px) {
    display: grid;
    grid-template-columns: 5fr 4fr;
    height: 100vh;
    overflow: hidden;
  }
`;

const FormSection = styled.div`
  display: flex;
  flex-direction: column;
  padding: ${({ theme }) => theme.spacing.md} 16px;
  background-color: #000000;
  position: relative;
  min-height: 100dvh;
  justify-content: flex-start;
  overflow-x: hidden;

  @media (min-width: 768px) {
    justify-content: center;
    padding: ${({ theme }) => theme.spacing.xl};
  }

  @media (min-width: 1024px) {
    height: 100vh;
    max-height: 100vh;
    overflow: hidden;
  }
`;

const BackgroundOrb = styled.div<{ $color: string; $size: string; $top: string; $left: string }>`
  position: absolute;
  top: ${({ $top }) => $top};
  left: ${({ $left }) => $left};
  width: ${({ $size }) => $size};
  height: ${({ $size }) => $size};
  background: ${({ $color }) => $color};
  border-radius: 50%;
  filter: blur(120px);
  opacity: 0.5;
  pointer-events: none;
  z-index: 0;
  transform: translate(-50%, -50%);
`;

const LogoContainer = styled.div`
  display: flex;
  justify-content: center;
  position: relative;
  margin-top: 24px;
  margin-bottom: 16px;
  z-index: 10;

  @media (min-width: 768px) {
    position: absolute;
    top: 32px;
    left: 32px;
    margin: 0;
  }
`;

const LogoLink = styled(Link)`
  display: flex;
  align-items: center;
  text-decoration: none;
  font-weight: 700;
  letter-spacing: -0.02em;
  font-size: 24px;
  color: #ffffff;
  transition: opacity ${({ theme }) => theme.transitions.fast};

  &:hover {
    opacity: 0.8;
  }
`;

const FormContainer = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  z-index: 10;
`;

const FormWrapper = styled.div`
  width: 100%;
  max-width: 420px;
`;

const SideSection = styled.div`
  display: none;

  @media (min-width: 1024px) {
    display: block;
  }
`;

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Container>
      <FormSection>
        {/* Subtle mesh/orb gradients to enhance glass effect */}
        <BackgroundOrb 
          $color="rgba(53, 162, 159, 0.4)" 
          $size="600px" 
          $top="20%" 
          $left="10%" 
        />
        <BackgroundOrb 
          $color="rgba(11, 102, 106, 0.3)" 
          $size="500px" 
          $top="80%" 
          $left="90%" 
        />
        <BackgroundOrb 
          $color="rgba(255, 255, 255, 0.05)" 
          $size="400px" 
          $top="50%" 
          $left="50%" 
        />
        
        <LogoContainer>
          <LogoLink href={ROUTES.PUBLIC.HOME}>
            Rejectly.pro
          </LogoLink>
        </LogoContainer>
        <FormContainer>
          <FormWrapper>
            {children}
          </FormWrapper>
        </FormContainer>
      </FormSection>
      <SideSection>
        <AuthSidePanel />
      </SideSection>
    </Container>
  );
}
