"use client";

import React, { useState, useEffect } from "react";
import styled, { keyframes } from "styled-components";
import { usePathname } from "next/navigation";
import { ROUTES } from "@/lib/constants";
import { useAuth } from "@/hooks/useAuth";
import { Target, SlidersHorizontal, Wand2, FileText } from "lucide-react";
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
const Header = styled.header<{ $isBlogDetail?: boolean }>`
  position: fixed;
  top: 0;
  left: ${({ $isBlogDetail }) => ($isBlogDetail ? "340px" : "0")};
  right: 0;
  z-index: 1000;
  padding: ${({ $isBlogDetail }) => ($isBlogDetail ? "12px 24px" : "16px 24px")};
  transition: all 0.3s ease;

  @media (max-width: 1024px) {
    left: 0;
  }

  @media (max-width: 768px) {
    padding: 12px 16px;
  }
`;

const NavContainer = styled.nav<{ $isBlogDetail?: boolean }>`
  position: relative;
  max-width: ${({ $isBlogDetail }) => ($isBlogDetail ? "900px" : "1200px")};
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${({ $isBlogDetail }) => ($isBlogDetail ? "8px 16px" : "12px 24px")};
  border-radius: 9999px;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: 9999px;
    background: rgba(150, 150, 150, 0.08); /* Exact match to Navbar */
    border: 1px solid rgba(255, 255, 255, 0.15);
    box-shadow: inset 0 1px 1px rgba(255, 255, 255, 0.2), 0 8px 32px rgba(0, 0, 0, 0.12);
    backdrop-filter: blur(40px) saturate(200%);
    -webkit-backdrop-filter: blur(40px) saturate(200%);
    z-index: -1;
  }

  @media (max-width: 768px) {
    padding: 8px 16px;
    border-radius: 32px;
    &::before {
      border-radius: 32px;
    }
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
  background: rgba(150, 150, 150, 0.08); /* Exact match to NavContainer */
  backdrop-filter: blur(40px) saturate(200%);
  -webkit-backdrop-filter: blur(40px) saturate(200%);
  border-radius: 24px;
  border: 1px solid rgba(255, 255, 255, 0.15);
  box-shadow: 
    inset 0 1px 1px rgba(255, 255, 255, 0.3), 
    0 24px 64px rgba(0, 0, 0, 0.15);
  animation: ${fadeIn} 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  
  /* Fix for Safari/MacOS backdrop-filter clipping bug when transform is present */
  transform: translateZ(0);
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
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.18) 0%, rgba(255, 255, 255, 0) 100%),
    rgba(238, 90, 90, 0.82);
  padding: 8px 20px;
  border-radius: 9999px;
  text-decoration: none;
  border: 1px solid rgba(255, 255, 255, 0.28);
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  transition: all 0.35s cubic-bezier(0.25, 0.8, 0.25, 1);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.5), 0 4px 16px rgba(238, 90, 90, 0.35);

  &:hover {
    background: linear-gradient(180deg, rgba(255, 255, 255, 0.26) 0%, rgba(255, 255, 255, 0) 100%),
      rgba(238, 90, 90, 0.92);
    box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.65), 0 4px 20px rgba(238, 90, 90, 0.5);
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
    background: rgba(150, 150, 150, 0.08);
    backdrop-filter: blur(50px) saturate(200%);
    border: 1px solid rgba(255, 255, 255, 0.15);
    border-radius: 24px;
    padding: 20px;
    flex-direction: column;
    gap: 8px;
    z-index: 999;
    box-shadow: inset 0 1px 1px rgba(255, 255, 255, 0.3), 0 20px 50px rgba(0, 0, 0, 0.2);
    animation: ${slideDown} 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
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


const MobileCTAButton = styled.a`
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 15px;
  font-weight: 600;
  color: white;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.18) 0%, rgba(255, 255, 255, 0) 100%),
    rgba(238, 90, 90, 0.82);
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  border: 1px solid rgba(255, 255, 255, 0.28);
  padding: 14px 20px;
  border-radius: 16px;
  text-decoration: none;
  transition: all 0.35s cubic-bezier(0.25, 0.8, 0.25, 1);
  margin-top: 8px;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.5), 0 4px 16px rgba(238, 90, 90, 0.35);

  &:hover {
    background: linear-gradient(180deg, rgba(255, 255, 255, 0.26) 0%, rgba(255, 255, 255, 0) 100%),
      rgba(238, 90, 90, 0.92);
    box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.65), 0 4px 20px rgba(238, 90, 90, 0.5);
  }
`;

// ProductItem Component for dropdowns
const ProductItemWrapper = styled.a`
  display: flex;
  align-items: flex-start;
  gap: 16px;
  padding: 14px;
  border-radius: 16px;
  text-decoration: none;
  background: transparent;
  border: 1px solid transparent;
  transition: all 0.25s cubic-bezier(0.2, 0.8, 0.2, 1);

  &:hover {
    background: rgba(150, 150, 150, 0.1);
    border-color: rgba(255, 255, 255, 0.1);
  }
`;

const ProductItemIcon = styled.div`
  width: 44px;
  height: 44px;
  border-radius: 14px;
  background: rgba(150, 150, 150, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  border: 1px solid rgba(255, 255, 255, 0.15);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.2);

  svg {
    width: 20px;
    height: 20px;
    color: var(--text-color);
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
  letter-spacing: -0.01em;
`;

const ProductItemDescription = styled.p`
  font-size: 13px;
  color: var(--text-secondary);
  margin: 0;
  max-width: 260px;
  line-height: 1.5;
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

// Removed SF Symbols-inspired icons (Target, SlidersHorizontal, Wand2 are now imported from lucide-react)

// Dropdown Layout
const DropdownContainerBox = styled.div`
  display: flex;
  gap: 16px;
  min-width: 600px;

  @media (max-width: 768px) {
    flex-direction: column;
    min-width: unset;
  }
`;

const DropdownMainSection = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const DropdownSideSection = styled.div`
  width: 280px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  border-left: 1px solid rgba(255, 255, 255, 0.15);
  padding-left: 16px;

  @media (max-width: 768px) {
    width: 100%;
    border-left: none;
    border-top: 1px solid rgba(255, 255, 255, 0.15);
    padding-left: 0;
    padding-top: 16px;
  }
`;

const SectionTitle = styled.h3`
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--text-muted);
  margin: 4px 0 8px 14px;
`;

const SecondaryItemWrapper = styled.a`
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 12px 14px;
  border-radius: 14px;
  text-decoration: none;
  background: transparent;
  border: 1px solid transparent;
  transition: all 0.25s cubic-bezier(0.2, 0.8, 0.2, 1);

  &:hover {
    background: rgba(150, 150, 150, 0.1);
    border-color: rgba(255, 255, 255, 0.1);
  }
`;

const SecondaryItemTitle = styled.h4`
  font-size: 14px;
  font-weight: 600;
  color: var(--text-color);
  margin: 0;
  letter-spacing: -0.01em;
`;

const SecondaryItemDescription = styled.p`
  font-size: 13px;
  color: var(--text-secondary);
  margin: 0;
  line-height: 1.5;
`;

// Main Navbar Component
export function Navbar() {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const { user, loading } = useAuth();
  const pathname = usePathname();

  // Check if we are on a blog detail page (e.g. /blog/something) vs just /blog
  // Or maybe any /blog page. The user said "blog sayfamızda". We'll offset it
  // on detail pages, but maybe just string check.
  const isBlogDetail = pathname?.startsWith('/blog/') && pathname !== '/blog';

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (isBlogDetail) {
    return null;
  }

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <>
      <Header $isBlogDetail={isBlogDetail}>
        <NavContainer $isBlogDetail={isBlogDetail} onMouseLeave={() => setActiveDropdown(null)}>
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
                    <DropdownContainerBox>
                      <DropdownMainSection>
                        <SectionTitle>Main Tools</SectionTitle>
                        <ProductItemWrapper href={ROUTES.APP.REPORTS}>
                          <ProductItemIcon><Target strokeWidth={1.5} /></ProductItemIcon>
                          <ProductItemContent>
                            <ProductItemTitle>Job Match & Optimize</ProductItemTitle>
                            <ProductItemDescription>Analyze how well your resume matches a job posting and generate a targeted version to boost your chances.</ProductItemDescription>
                          </ProductItemContent>
                        </ProductItemWrapper>
                        <ProductItemWrapper href={ROUTES.APP.ATS_OPTIMIZER}>
                          <ProductItemIcon><SlidersHorizontal strokeWidth={1.5} /></ProductItemIcon>
                          <ProductItemContent>
                            <ProductItemTitle>ATS Optimizer</ProductItemTitle>
                            <ProductItemDescription>Upload your resume to check ATS compatibility and get an optimized version.</ProductItemDescription>
                          </ProductItemContent>
                        </ProductItemWrapper>
                        <ProductItemWrapper href={ROUTES.APP.COVER_LETTERS}>
                          <ProductItemIcon><Wand2 strokeWidth={1.5} /></ProductItemIcon>
                          <ProductItemContent>
                            <ProductItemTitle>Cover Letters</ProductItemTitle>
                            <ProductItemDescription>Generate AI-powered cover letters from your reports and manage your applications.</ProductItemDescription>
                          </ProductItemContent>
                        </ProductItemWrapper>
                        <ProductItemWrapper href={ROUTES.PUBLIC.CV_BUILDER}>
                          <ProductItemIcon><FileText strokeWidth={1.5} /></ProductItemIcon>
                          <ProductItemContent>
                            <ProductItemTitle>CV Builder</ProductItemTitle>
                            <ProductItemDescription>Build a professional, ATS-friendly CV from scratch with smart suggestions and instant PDF export.</ProductItemDescription>
                          </ProductItemContent>
                        </ProductItemWrapper>
                      </DropdownMainSection>

                      <DropdownSideSection>
                        <SectionTitle>Additional Features</SectionTitle>
                        <SecondaryItemWrapper href={ROUTES.APP.REPORTS}>
                          <SecondaryItemTitle>Role Recommendation</SecondaryItemTitle>
                          <SecondaryItemDescription>Get alternative role ideas based on your resume analysis automatically during job matching.</SecondaryItemDescription>
                        </SecondaryItemWrapper>
                        <SecondaryItemWrapper href={ROUTES.APP.ATS_OPTIMIZER}>
                          <SecondaryItemTitle>Resume Customization</SecondaryItemTitle>
                          <SecondaryItemDescription>Customize color palettes and add your photo to the AI-generated optimized resumes.</SecondaryItemDescription>
                        </SecondaryItemWrapper>
                      </DropdownSideSection>
                    </DropdownContainerBox>
                  </DropdownInner>
                </DropdownContent>
              </DropdownContainer>
            </MenuItemWrapper>

            {/* Simple Links */}
            <MenuItemText href={ROUTES.PUBLIC.ATS_CHECK}>ATS Check</MenuItemText>
            <MenuItemText href={ROUTES.PUBLIC.CV_BUILDER}>CV Builder</MenuItemText>
            <MenuItemText href={ROUTES.PUBLIC.HOW_IT_WORKS}>How it Works</MenuItemText>
            <MenuItemText href={ROUTES.PUBLIC.PRICING}>Pricing</MenuItemText>
            <MenuItemText href={ROUTES.PUBLIC.FAQ}>FAQ</MenuItemText>
            <MenuItemText href={ROUTES.PUBLIC.BLOG}>Blog</MenuItemText>
          </DesktopMenu>

          <RightSection>
            {!isMounted || loading ? (
                 <div style={{ width: 100, height: 36 }} /> // Placeholder to prevent shifting
            ) : user ? (
              <CTAButton href={ROUTES.APP.DASHBOARD}>Dashboard</CTAButton>
            ) : (
              <>
                <LoginLink href={ROUTES.AUTH.LOGIN}>Login</LoginLink>
                <CTAButton href={ROUTES.AUTH.SIGNUP}>Start Free</CTAButton>
              </>
            )}
          </RightSection>

          <MobileMenuButton onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <CloseIcon /> : <HamburgerIcon />}
          </MobileMenuButton>
        </NavContainer>
      </Header>

      {/* Mobile Menu */}
      <MobileMenuOverlay $isOpen={isMobileMenuOpen} onClick={closeMobileMenu} />
      <MobileMenu $isOpen={isMobileMenuOpen}>
        <MobileMenuItem href={ROUTES.PUBLIC.ATS_CHECK} onClick={closeMobileMenu}>
          ATS Check
        </MobileMenuItem>
        <MobileMenuItem href={ROUTES.PUBLIC.CV_BUILDER} onClick={closeMobileMenu}>
          CV Builder
        </MobileMenuItem>
        <MobileMenuItem href={ROUTES.PUBLIC.HOW_IT_WORKS} onClick={closeMobileMenu}>
          How it Works
        </MobileMenuItem>
        <MobileMenuItem href={ROUTES.PUBLIC.PRICING} onClick={closeMobileMenu}>
          Pricing
        </MobileMenuItem>
        <MobileMenuItem href={ROUTES.PUBLIC.FAQ} onClick={closeMobileMenu}>
          FAQ
        </MobileMenuItem>
        <MobileMenuItem href={ROUTES.PUBLIC.BLOG} onClick={closeMobileMenu}>
          Blog
        </MobileMenuItem>
        <MobileDivider />
        {!isMounted || loading ? (
            <div style={{ height: '50px' }} />
        ) : user ? (
          <MobileCTAButton href={ROUTES.APP.DASHBOARD} onClick={closeMobileMenu}>
            Go to Dashboard
          </MobileCTAButton>
        ) : (
          <>
            <MobileMenuItem href={ROUTES.AUTH.LOGIN} onClick={closeMobileMenu}>
              Login
            </MobileMenuItem>
            <MobileCTAButton href={ROUTES.AUTH.SIGNUP} onClick={closeMobileMenu}>
              Start Free
            </MobileCTAButton>
          </>
        )}
      </MobileMenu>
    </>
  );
}

export default Navbar;
