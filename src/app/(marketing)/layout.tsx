"use client";

import styled from "styled-components";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { ROUTES } from "@/lib/constants";
import { Suspense } from "react";
import { Spinner } from "@/components/ui/Spinner";
import dynamic from "next/dynamic";

// Import ThemeToggle with SSR disabled
const ThemeToggle = dynamic(
  () => import("@/components/ui/ThemeToggle").then((mod) => mod.ThemeToggle),
  { ssr: false }
);

const Header = styled.header`
  border-bottom: 1px solid var(--border-color);
  padding: ${({ theme }) => theme.spacing.lg} 0;
  background-color: var(--bg-color);
  position: sticky;
  top: 0;
  z-index: ${({ theme }) => theme.zIndex.sticky};
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
  background: #696FC7;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-decoration: none;
  cursor: pointer;

  &:hover {
    opacity: 0.8;
  }
`;

const DesktopNav = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.lg};
  align-items: center;

  @media (max-width: 768px) {
    display: none;
  }

  a {
    color: var(--text-secondary);
    font-size: ${({ theme }) => theme.typography.fontSize.sm};
    font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
    text-decoration: none;
    transition: color ${({ theme }) => theme.transitions.fast};

    &:hover {
      color: var(--text-color);
    }
  }
`;

const ThemeToggleWrapper = styled.div`
  display: flex;
  align-items: center;
`;

const MobileMenuButton = styled.button`
  display: none;
  background: none;
  border: none;
  padding: ${({ theme }) => theme.spacing.sm};
  cursor: pointer;
  color: var(--text-color);

  @media (max-width: 768px) {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  svg {
    width: 24px;
    height: 24px;
  }
`;

const MobileMenu = styled.div<{ $isOpen: boolean }>`
  position: fixed;
  top: 73px;
  left: 0;
  right: 0;
  background-color: var(--surface-color);
  border-bottom: 1px solid var(--border-color);
  padding: ${({ theme }) => theme.spacing.lg};
  display: ${({ $isOpen }) => ($isOpen ? "flex" : "none")};
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
  z-index: ${({ theme }) => theme.zIndex.fixed};
  box-shadow: ${({ theme }) => theme.shadow.lg};

  @media (min-width: 769px) {
    display: none;
  }

  a {
    color: var(--text-secondary);
    font-size: ${({ theme }) => theme.typography.fontSize.base};
    font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
    text-decoration: none;
    padding: ${({ theme }) => theme.spacing.sm} 0;

    &:hover {
      color: var(--text-color);
    }
  }
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
          <Logo href={ROUTES.PUBLIC.HOME} onClick={closeMobileMenu}>
            Rejectly.pro
          </Logo>

          <DesktopNav>
            <a href={ROUTES.PUBLIC.HOW_IT_WORKS}>How it Works</a>
            <a href={ROUTES.PUBLIC.PRICING}>Pricing</a>
            <a href={ROUTES.PUBLIC.FAQ}>FAQ</a>
            <ThemeToggleWrapper>
              <ThemeToggle />
            </ThemeToggleWrapper>
            <a href={ROUTES.AUTH.LOGIN}>Login</a>
            <Button
              size="sm"
              onClick={() => (window.location.href = ROUTES.AUTH.SIGNUP)}
            >
              Start Free
            </Button>
          </DesktopNav>

          <MobileMenuButton
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
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
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
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
                  d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                />
              </svg>
            )}
          </MobileMenuButton>
        </Nav>

        <MobileMenu $isOpen={isMobileMenuOpen}>
          <a href={ROUTES.PUBLIC.HOW_IT_WORKS} onClick={closeMobileMenu}>
            How it Works
          </a>
          <a href={ROUTES.PUBLIC.PRICING} onClick={closeMobileMenu}>
            Pricing
          </a>
          <a href={ROUTES.PUBLIC.FAQ} onClick={closeMobileMenu}>
            FAQ
          </a>
          <ThemeToggleWrapper style={{ justifyContent: 'center', padding: '8px 0' }}>
            <ThemeToggle />
          </ThemeToggleWrapper>
          <a href={ROUTES.AUTH.LOGIN} onClick={closeMobileMenu}>
            Login
          </a>
          <Button
            fullWidth
            onClick={() => {
              closeMobileMenu();
              window.location.href = ROUTES.AUTH.SIGNUP;
            }}
          >
            Start Free
          </Button>
        </MobileMenu>
      </Header>

      <main>
        <Suspense
          fallback={
            <div style={{ padding: "80px 24px", textAlign: "center" }}>
              <Spinner size="xl" />
            </div>
          }
        >
          {children}
        </Suspense>
      </main>
    </>
  );
}
