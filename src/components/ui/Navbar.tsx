"use client";

import React, { useState } from "react";
import styled, { keyframes } from "styled-components";
import { ROUTES } from "@/lib/constants";
import dynamic from "next/dynamic";

// Import ThemeToggle with SSR disabled
const ThemeToggle = dynamic(
  () => import("@/components/ui/ThemeToggle").then((mod) => mod.ThemeToggle),
  { ssr: false }
);

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: scale(0.95) translateY(10px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
`;

const slideDown = keyframes`
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

// Main Header Container
const Header = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  padding: 16px 24px;

  @media (max-width: 768px) {
    padding: 12px 16px;
  }
`;

const NavContainer = styled.nav`
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 24px;
  background: var(--bg-alt);
  border-radius: 9999px;
  border: 1px solid var(--border-color);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  backdrop-filter: blur(12px);

  @media (max-width: 768px) {
    padding: 10px 16px;
    border-radius: 16px;
  }
`;

const Logo = styled.a`
  font-size: 18px;
  font-weight: 700;
  background: linear-gradient(135deg, var(--primary-500) 0%, var(--primary-700) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-decoration: none;
  cursor: pointer;
  flex-shrink: 0;

  &:hover {
    opacity: 0.8;
  }
`;

// Desktop Menu
const DesktopMenu = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;

  @media (max-width: 768px) {
    display: none;
  }
`;

const MenuItemWrapper = styled.div`
  position: relative;
`;

const MenuItemText = styled.a<{ $isActive?: boolean }>`
  display: flex;
  align-items: center;
  gap: 4px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  color: ${({ $isActive }) => $isActive ? 'var(--text-color)' : 'var(--text-secondary)'};
  text-decoration: none;
  padding: 8px 14px;
  border-radius: 9999px;
  transition: all 0.2s ease;

  &:hover {
    color: var(--text-color);
    background: var(--surface-color);
  }

  svg {
    width: 14px;
    height: 14px;
    transition: transform 0.2s ease;
  }

  &[data-open="true"] svg {
    transform: rotate(180deg);
  }
`;

const DropdownContainer = styled.div<{ $isActive: boolean }>`
  position: absolute;
  top: calc(100% + 12px);
  left: 50%;
  transform: translateX(-50%);
  display: ${({ $isActive }) => ($isActive ? "block" : "none")};
  z-index: 100;
`;

const DropdownContent = styled.div`
  background: var(--bg-alt);
  backdrop-filter: blur(12px);
  border-radius: 16px;
  overflow: hidden;
  border: 1px solid var(--border-color);
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.15);
  animation: ${fadeIn} 0.2s ease-out;
`;

const DropdownInner = styled.div`
  width: max-content;
  padding: 12px;
`;

// Right side actions
const RightSection = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;

  @media (max-width: 768px) {
    display: none;
  }
`;

const ThemeToggleWrapper = styled.div`
  display: flex;
  align-items: center;
  padding: 0 8px;
`;

const LoginLink = styled.a`
  font-size: 14px;
  font-weight: 500;
  color: var(--text-secondary);
  text-decoration: none;
  padding: 8px 14px;
  border-radius: 9999px;
  transition: all 0.2s ease;

  &:hover {
    color: var(--text-color);
    background: var(--surface-color);
  }
`;

const CTAButton = styled.a`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 600;
  color: white;
  background: var(--landing-button);
  padding: 8px 20px;
  border-radius: 9999px;
  text-decoration: none;
  transition: all 0.2s ease;
  box-shadow: 0 2px 8px rgba(255, 107, 107, 0.3);

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(255, 107, 107, 0.4);
  }
`;

// Mobile Menu Button
const MobileMenuButton = styled.button`
  display: none;
  background: none;
  border: none;
  padding: 8px;
  cursor: pointer;
  color: var(--text-color);
  border-radius: 8px;
  transition: background 0.2s ease;

  @media (max-width: 768px) {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  &:hover {
    background: var(--surface-color);
  }

  svg {
    width: 22px;
    height: 22px;
  }
`;

// Mobile Menu
const MobileMenuOverlay = styled.div<{ $isOpen: boolean }>`
  display: none;

  @media (max-width: 768px) {
    display: ${({ $isOpen }) => ($isOpen ? "block" : "none")};
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    z-index: 998;
  }
`;

const MobileMenu = styled.div<{ $isOpen: boolean }>`
  display: none;

  @media (max-width: 768px) {
    display: ${({ $isOpen }) => ($isOpen ? "flex" : "none")};
    position: fixed;
    top: 80px;
    left: 16px;
    right: 16px;
    background: var(--bg-alt);
    border: 1px solid var(--border-color);
    border-radius: 20px;
    padding: 20px;
    flex-direction: column;
    gap: 8px;
    z-index: 999;
    box-shadow: 0 20px 50px rgba(0, 0, 0, 0.2);
    animation: ${slideDown} 0.2s ease-out;
  }
`;

const MobileMenuItem = styled.a`
  display: flex;
  align-items: center;
  padding: 14px 16px;
  font-size: 15px;
  font-weight: 500;
  color: var(--text-secondary);
  text-decoration: none;
  border-radius: 12px;
  transition: all 0.2s ease;

  &:hover {
    color: var(--text-color);
    background: var(--surface-color);
  }
`;

const MobileDivider = styled.div`
  height: 1px;
  background: var(--border-color);
  margin: 8px 0;
`;

const MobileThemeWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 12px;
`;

const MobileCTAButton = styled.a`
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 15px;
  font-weight: 600;
  color: white;
  background: var(--landing-button);
  padding: 14px 20px;
  border-radius: 12px;
  text-decoration: none;
  transition: all 0.2s ease;
  margin-top: 8px;

  &:hover {
    opacity: 0.9;
  }
`;

// ProductItem Component for dropdowns
const ProductItemWrapper = styled.a`
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 12px;
  border-radius: 12px;
  text-decoration: none;
  transition: background 0.2s ease;

  &:hover {
    background: var(--surface-color);
  }
`;

const ProductItemIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: linear-gradient(135deg, var(--landing-button) 0%, #ee5a5a 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  svg {
    width: 20px;
    height: 20px;
    color: white;
  }
`;

const ProductItemContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const ProductItemTitle = styled.h4`
  font-size: 14px;
  font-weight: 600;
  color: var(--text-color);
  margin: 0;
`;

const ProductItemDescription = styled.p`
  font-size: 12px;
  color: var(--text-muted);
  margin: 0;
  max-width: 200px;
  line-height: 1.4;
`;

// Icons
const ChevronDownIcon = () => (
  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
  </svg>
);

const HamburgerIcon = () => (
  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
  </svg>
);

const CloseIcon = () => (
  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const ScanIcon = () => (
  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
  </svg>
);

const SparklesIcon = () => (
  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
  </svg>
);

const ChartIcon = () => (
  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
  </svg>
);

// Dropdown Grid
const DropdownGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: 4px;
  min-width: 280px;
`;

// Main Navbar Component
export function Navbar() {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <>
      <Header>
        <NavContainer onMouseLeave={() => setActiveDropdown(null)}>
          <Logo href={ROUTES.PUBLIC.HOME}>Rejectly.pro</Logo>

          <DesktopMenu>
            {/* Features Dropdown */}
            <MenuItemWrapper onMouseEnter={() => setActiveDropdown("features")}>
              <MenuItemText as="span" data-open={activeDropdown === "features"}>
                Features <ChevronDownIcon />
              </MenuItemText>
              <DropdownContainer $isActive={activeDropdown === "features"}>
                <DropdownContent>
                  <DropdownInner>
                    <DropdownGrid>
                      <ProductItemWrapper href={ROUTES.PUBLIC.HOW_IT_WORKS}>
                        <ProductItemIcon><ScanIcon /></ProductItemIcon>
                        <ProductItemContent>
                          <ProductItemTitle>ATS Scanner</ProductItemTitle>
                          <ProductItemDescription>Analyze your resume against ATS systems</ProductItemDescription>
                        </ProductItemContent>
                      </ProductItemWrapper>
                      <ProductItemWrapper href={ROUTES.PUBLIC.HOW_IT_WORKS}>
                        <ProductItemIcon><SparklesIcon /></ProductItemIcon>
                        <ProductItemContent>
                          <ProductItemTitle>AI Optimization</ProductItemTitle>
                          <ProductItemDescription>Get AI-powered suggestions to improve</ProductItemDescription>
                        </ProductItemContent>
                      </ProductItemWrapper>
                      <ProductItemWrapper href={ROUTES.PUBLIC.HOW_IT_WORKS}>
                        <ProductItemIcon><ChartIcon /></ProductItemIcon>
                        <ProductItemContent>
                          <ProductItemTitle>Score Analysis</ProductItemTitle>
                          <ProductItemDescription>Detailed breakdown of your resume score</ProductItemDescription>
                        </ProductItemContent>
                      </ProductItemWrapper>
                    </DropdownGrid>
                  </DropdownInner>
                </DropdownContent>
              </DropdownContainer>
            </MenuItemWrapper>

            {/* Simple Links */}
            <MenuItemText href={ROUTES.PUBLIC.HOW_IT_WORKS}>How it Works</MenuItemText>
            <MenuItemText href={ROUTES.PUBLIC.PRICING}>Pricing</MenuItemText>
            <MenuItemText href={ROUTES.PUBLIC.BLOG}>Blog</MenuItemText>
            <MenuItemText href={ROUTES.PUBLIC.FAQ}>FAQ</MenuItemText>
          </DesktopMenu>

          <RightSection>
            <ThemeToggleWrapper>
              <ThemeToggle />
            </ThemeToggleWrapper>
            <LoginLink href={ROUTES.AUTH.LOGIN}>Login</LoginLink>
            <CTAButton href={ROUTES.AUTH.SIGNUP}>Start Free</CTAButton>
          </RightSection>

          <MobileMenuButton onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <CloseIcon /> : <HamburgerIcon />}
          </MobileMenuButton>
        </NavContainer>
      </Header>

      {/* Mobile Menu */}
      <MobileMenuOverlay $isOpen={isMobileMenuOpen} onClick={closeMobileMenu} />
      <MobileMenu $isOpen={isMobileMenuOpen}>
        <MobileMenuItem href={ROUTES.PUBLIC.HOW_IT_WORKS} onClick={closeMobileMenu}>
          How it Works
        </MobileMenuItem>
        <MobileMenuItem href={ROUTES.PUBLIC.PRICING} onClick={closeMobileMenu}>
          Pricing
        </MobileMenuItem>
        <MobileMenuItem href={ROUTES.PUBLIC.BLOG} onClick={closeMobileMenu}>
          Blog
        </MobileMenuItem>
        <MobileMenuItem href={ROUTES.PUBLIC.FAQ} onClick={closeMobileMenu}>
          FAQ
        </MobileMenuItem>
        <MobileDivider />
        <MobileThemeWrapper>
          <ThemeToggle />
        </MobileThemeWrapper>
        <MobileMenuItem href={ROUTES.AUTH.LOGIN} onClick={closeMobileMenu}>
          Login
        </MobileMenuItem>
        <MobileCTAButton href={ROUTES.AUTH.SIGNUP} onClick={closeMobileMenu}>
          Start Free
        </MobileCTAButton>
      </MobileMenu>
    </>
  );
}

export default Navbar;
