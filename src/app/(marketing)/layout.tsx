'use client';

import styled from 'styled-components';
import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { ROUTES } from '@/lib/constants';

const Header = styled.header`
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  padding: ${({ theme }) => theme.spacing.lg} 0;
  position: sticky;
  top: 0;
  background-color: ${({ theme }) => theme.colors.background};
  z-index: 50;
`;

const Nav = styled.nav`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 ${({ theme }) => theme.spacing.lg};
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Logo = styled.a`
  font-size: ${({ theme }) => theme.typography.fontSize.xl};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.primary};
  text-decoration: none;
  
  &:hover {
    color: ${({ theme }) => theme.colors.primaryHover};
  }
`;

const NavLinks = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.lg};
  align-items: center;
  
  a {
    color: ${({ theme }) => theme.colors.textSecondary};
    font-size: ${({ theme }) => theme.typography.fontSize.sm};
    text-decoration: none;
    white-space: nowrap;
    
    &:hover {
      color: ${({ theme }) => theme.colors.textPrimary};
    }
  }

  @media (max-width: 768px) {
    display: none;
  }
`;

const MobileMenuButton = styled.button`
  display: none;
  background: none;
  border: none;
  cursor: pointer;
  padding: ${({ theme }) => theme.spacing.xs};
  color: ${({ theme }) => theme.colors.textPrimary};

  svg {
    width: 24px;
    height: 24px;
  }

  &:hover {
    opacity: 0.7;
  }

  @media (max-width: 768px) {
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

const MobileOverlay = styled.div<{ $isOpen: boolean }>`
  display: none;

  @media (max-width: 768px) {
    display: block;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 100;
    opacity: ${({ $isOpen }) => ($isOpen ? 1 : 0)};
    pointer-events: ${({ $isOpen }) => ($isOpen ? 'all' : 'none')};
    transition: opacity 0.3s ease;
  }
`;

const MobileMenu = styled.div<{ $isOpen: boolean }>`
  display: none;

  @media (max-width: 768px) {
    display: flex;
    flex-direction: column;
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    width: 280px;
    max-width: 85vw;
    background-color: ${({ theme }) => theme.colors.surface};
    z-index: 150;
    padding: ${({ theme }) => theme.spacing.lg};
    transform: translateX(${({ $isOpen }) => ($isOpen ? '0' : '100%')});
    transition: transform 0.3s ease;
    box-shadow: -2px 0 8px rgba(0, 0, 0, 0.1);
  }
`;

const MobileMenuHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const MobileMenuLogo = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.xl};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.primary};
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: ${({ theme }) => theme.spacing.xs};
  color: ${({ theme }) => theme.colors.textPrimary};
  display: flex;
  align-items: center;
  justify-content: center;

  svg {
    width: 24px;
    height: 24px;
  }

  &:hover {
    opacity: 0.7;
  }
`;

const MobileNavLinks = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
  flex: 1;

  a {
    color: ${({ theme }) => theme.colors.textSecondary};
    font-size: ${({ theme }) => theme.typography.fontSize.base};
    text-decoration: none;
    padding: ${({ theme }) => theme.spacing.sm} 0;
    border-bottom: 1px solid ${({ theme }) => theme.colors.border};

    &:hover {
      color: ${({ theme }) => theme.colors.textPrimary};
    }

    &:last-child {
      border-bottom: none;
    }
  }
`;

const MobileAuthButtons = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
  margin-top: auto;
  padding-top: ${({ theme }) => theme.spacing.lg};
  border-top: 1px solid ${({ theme }) => theme.colors.border};
`;

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <>
      <Header>
        <Nav>
          <Logo href={ROUTES.PUBLIC.HOME}>Rejectly.pro</Logo>
          
          <NavLinks>
            <a href={ROUTES.PUBLIC.FEATURES}>Features</a>
            <a href={ROUTES.PUBLIC.HOW_IT_WORKS}>How it Works</a>
            <a href={ROUTES.PUBLIC.PRICING}>Pricing</a>
            <a href={ROUTES.PUBLIC.FAQ}>FAQ</a>
            <a href={ROUTES.AUTH.LOGIN}>Login</a>
            <Button 
              size="sm" 
              onClick={() => window.location.href = ROUTES.AUTH.SIGNUP}
            >
              Start Free
            </Button>
          </NavLinks>

          <MobileMenuButton onClick={() => setIsMobileMenuOpen(true)}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          </MobileMenuButton>
        </Nav>
      </Header>

      <MobileOverlay $isOpen={isMobileMenuOpen} onClick={closeMobileMenu} />

      <MobileMenu $isOpen={isMobileMenuOpen}>
        <MobileMenuHeader>
          <MobileMenuLogo>Rejectly.pro</MobileMenuLogo>
          <CloseButton onClick={closeMobileMenu}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </CloseButton>
        </MobileMenuHeader>

        <MobileNavLinks>
          <a href={ROUTES.PUBLIC.FEATURES} onClick={closeMobileMenu}>Features</a>
          <a href={ROUTES.PUBLIC.HOW_IT_WORKS} onClick={closeMobileMenu}>How it Works</a>
          <a href={ROUTES.PUBLIC.PRICING} onClick={closeMobileMenu}>Pricing</a>
          <a href={ROUTES.PUBLIC.FAQ} onClick={closeMobileMenu}>FAQ</a>
        </MobileNavLinks>

        <MobileAuthButtons>
          <Button 
            variant="ghost"
            size="md"
            fullWidth
            onClick={() => {
              closeMobileMenu();
              window.location.href = ROUTES.AUTH.LOGIN;
            }}
          >
            Login
          </Button>
          <Button 
            size="md"
            fullWidth
            onClick={() => {
              closeMobileMenu();
              window.location.href = ROUTES.AUTH.SIGNUP;
            }}
          >
            Start Free
          </Button>
        </MobileAuthButtons>
      </MobileMenu>

      <main>{children}</main>
    </>
  );
}