"use client";

import React, { useState, useEffect } from "react";
import styled, { keyframes } from "styled-components";
import { usePathname } from "next/navigation";
import { ROUTES } from "@/lib/constants";
import { useAuth } from "@/hooks/useAuth";
import { useTheme } from "@/contexts/ThemeContext";
import { Target, SlidersHorizontal, Wand2, FileText } from "lucide-react";

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(6px); }
  to { opacity: 1; transform: translateY(0); }
`;

const slideDown = keyframes`
  from { opacity: 0; transform: translateY(-8px); }
  to { opacity: 1; transform: translateY(0); }
`;

// ─── Bar ─────────────────────────────────────────────────────────────────────
const Header = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  padding-top: env(safe-area-inset-top, 0px);
  background: var(--rj-nav);
  border-bottom: 1px solid var(--rj-line);
  backdrop-filter: saturate(1.6) blur(16px);
  -webkit-backdrop-filter: saturate(1.6) blur(16px);
  font-family: var(--rj-font);
`;

const NavContainer = styled.nav`
  max-width: 1240px;
  height: 60px;
  margin: 0 auto;
  padding: 0 max(20px, env(safe-area-inset-right, 0px)) 0 max(20px, env(safe-area-inset-left, 0px));
  display: flex;
  align-items: center;
  gap: 28px;

  @media (min-width: 640px) {
    padding: 0 40px;
  }
`;

const Logo = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-weight: 700;
  font-size: 18px;
  letter-spacing: -0.03em;
  color: var(--rj-ink);
  text-decoration: none;
  flex-shrink: 0;

  &:hover {
    color: var(--rj-ink);
  }

  svg {
    width: 22px;
    height: 22px;
  }

  /* The mark is always an ink tile with a yellow tick; on dark it gets a hairline edge. */
  [data-theme="dark"] & .logo-tile {
    stroke: rgba(255, 255, 255, 0.28);
    stroke-width: 1;
  }

  small {
    font-family: var(--rj-mono);
    font-size: 12px;
    font-weight: 500;
    letter-spacing: 0;
    color: var(--rj-ink-3);
    margin-left: -4px;
  }
`;

// ─── Desktop menu ────────────────────────────────────────────────────────────
const DesktopMenu = styled.div`
  display: none;
  align-items: center;
  gap: 4px;
  margin-left: 4px;

  @media (min-width: 960px) {
    display: flex;
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
  color: ${({ $isActive }) => ($isActive ? "var(--rj-ink)" : "var(--rj-ink-2)")};
  text-decoration: none;
  padding: 8px 11px;
  border-radius: 8px;
  transition: color 0.15s ease;

  &:hover {
    color: var(--rj-ink);
  }

  svg {
    width: 13px;
    height: 13px;
    transition: transform 0.2s ease;
  }

  &[data-open="true"] svg {
    transform: rotate(180deg);
  }
`;

const DropdownContainer = styled.div<{ $isActive: boolean }>`
  position: absolute;
  top: 100%;
  left: -12px;
  padding-top: 10px;
  display: ${({ $isActive }) => ($isActive ? "block" : "none")};
  z-index: 100;
`;

const DropdownContent = styled.div`
  background: var(--rj-surface);
  border: 1px solid var(--rj-line);
  border-radius: 18px;
  box-shadow: var(--rj-shadow), 0 1px 0 var(--rj-line);
  padding: 12px;
  animation: ${fadeIn} 0.2s cubic-bezier(0.16, 1, 0.3, 1) both;
`;

const DropdownContainerBox = styled.div`
  display: flex;
  gap: 12px;
  width: 640px;
`;

const DropdownMainSection = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const DropdownSideSection = styled.div`
  width: 240px;
  display: flex;
  flex-direction: column;
  gap: 2px;
  border-left: 1px solid var(--rj-line);
  padding-left: 12px;
`;

const SectionTitle = styled.p`
  font-family: var(--rj-mono);
  font-size: 11px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--rj-ink-3);
  margin: 6px 0 6px 12px;
`;

const ProductItemWrapper = styled.a`
  display: flex;
  align-items: flex-start;
  gap: 14px;
  padding: 12px;
  border-radius: 12px;
  text-decoration: none;
  transition: background 0.15s ease;

  &:hover {
    background: color-mix(in srgb, var(--rj-ink) 5%, transparent);
  }
`;

const ProductItemIcon = styled.div`
  width: 38px;
  height: 38px;
  border-radius: 10px;
  background: color-mix(in srgb, var(--rj-ink) 6%, transparent);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  svg {
    width: 18px;
    height: 18px;
    color: var(--rj-ink);
  }
`;

const ProductItemContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 3px;
`;

const ItemTitle = styled.span`
  font-size: 14px;
  font-weight: 600;
  color: var(--rj-ink);
  letter-spacing: -0.01em;
`;

const ItemDescription = styled.span`
  font-size: 13px;
  color: var(--rj-ink-2);
  line-height: 1.45;
`;

const SecondaryItemWrapper = styled.a`
  display: flex;
  flex-direction: column;
  gap: 3px;
  padding: 12px;
  border-radius: 12px;
  text-decoration: none;
  transition: background 0.15s ease;

  &:hover {
    background: color-mix(in srgb, var(--rj-ink) 5%, transparent);
  }
`;

// ─── Right side ──────────────────────────────────────────────────────────────
const RightSection = styled.div`
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: 6px;
`;

const LoginLink = styled.a`
  display: none;
  font-size: 14px;
  font-weight: 500;
  color: var(--rj-ink-2);
  text-decoration: none;
  padding: 8px 10px;

  &:hover {
    color: var(--rj-ink);
  }

  @media (min-width: 640px) {
    display: inline-flex;
  }
`;

const CTAButton = styled.a`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 13.5px;
  font-weight: 600;
  white-space: nowrap;
  color: var(--rj-btn-ink);
  background: var(--rj-btn);
  padding: 8px 14px;
  margin-left: 4px;
  border-radius: 9999px;
  text-decoration: none;
  transition: transform 0.15s ease;

  &:hover {
    color: var(--rj-btn-ink);
    transform: translateY(-1px);
  }
`;

const IconButton = styled.button`
  width: 36px;
  height: 36px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  color: var(--rj-ink-2);
  transition: color 0.15s ease, background 0.15s ease;

  &:hover {
    color: var(--rj-ink);
    background: color-mix(in srgb, var(--rj-ink) 6%, transparent);
  }

  &:focus-visible {
    outline: 2px solid var(--rj-ink);
    outline-offset: 2px;
  }

  svg {
    width: 18px;
    height: 18px;
  }
`;

const ThemeButton = styled(IconButton)`
  display: none;

  @media (min-width: 960px) {
    display: inline-flex;
  }
`;

const MobileMenuButton = styled(IconButton)`
  color: var(--rj-ink);

  @media (min-width: 960px) {
    display: none;
  }

  svg {
    width: 20px;
    height: 20px;
  }
`;

// ─── Mobile menu ─────────────────────────────────────────────────────────────
const MobileMenuOverlay = styled.div<{ $isOpen: boolean }>`
  display: ${({ $isOpen }) => ($isOpen ? "block" : "none")};
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.32);
  z-index: 998;

  @media (min-width: 960px) {
    display: none;
  }
`;

const MobileMenu = styled.div<{ $isOpen: boolean }>`
  display: ${({ $isOpen }) => ($isOpen ? "flex" : "none")};
  position: fixed;
  top: calc(60px + env(safe-area-inset-top, 0px) + 8px);
  left: max(12px, env(safe-area-inset-left, 0px));
  right: max(12px, env(safe-area-inset-right, 0px));
  max-height: calc(100dvh - 90px);
  overflow-y: auto;
  background: var(--rj-surface);
  border: 1px solid var(--rj-line);
  border-radius: 18px;
  padding: 10px;
  flex-direction: column;
  gap: 2px;
  z-index: 999;
  box-shadow: var(--rj-shadow);
  font-family: var(--rj-font);
  animation: ${slideDown} 0.2s cubic-bezier(0.16, 1, 0.3, 1) both;

  @media (min-width: 960px) {
    display: none;
  }
`;

const MobileMenuItem = styled.a`
  display: flex;
  align-items: center;
  padding: 13px 12px;
  font-size: 16px;
  font-weight: 500;
  color: var(--rj-ink);
  text-decoration: none;
  border-radius: 10px;

  &:hover {
    color: var(--rj-ink);
    background: color-mix(in srgb, var(--rj-ink) 5%, transparent);
  }
`;

const MobileThemeRow = styled.button`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 13px 12px;
  font-size: 16px;
  font-weight: 500;
  color: var(--rj-ink);
  border-radius: 10px;
  text-align: left;

  span:last-child {
    font-family: var(--rj-mono);
    font-size: 12px;
    color: var(--rj-ink-3);
    text-transform: uppercase;
    letter-spacing: 0.06em;
  }

  &:hover {
    background: color-mix(in srgb, var(--rj-ink) 5%, transparent);
  }
`;

const MobileDivider = styled.div`
  height: 1px;
  background: var(--rj-line);
  margin: 6px 4px;
`;

const MobileCTAButton = styled.a`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 50px;
  margin-top: 6px;
  font-size: 16px;
  font-weight: 600;
  color: var(--rj-btn-ink);
  background: var(--rj-btn);
  border-radius: 9999px;
  text-decoration: none;

  &:hover {
    color: var(--rj-btn-ink);
  }
`;

// ─── Icons ───────────────────────────────────────────────────────────────────
export const LogoMark = () => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <rect x="2.5" y="2.5" width="19" height="19" rx="5.5" fill="#0D0E10" className="logo-tile" />
    <path d="M7 12.5l3.2 3.2L17 8.8" stroke="#FFE14D" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const ChevronDownIcon = () => (
  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
  </svg>
);

const MenuIcon = () => (
  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path strokeLinecap="round" strokeWidth={2} d="M4 8h16M4 16h16" />
  </svg>
);

const CloseIcon = () => (
  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path strokeLinecap="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const SunIcon = () => (
  <svg fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" viewBox="0 0 24 24" aria-hidden="true">
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
  </svg>
);

const MoonIcon = () => (
  <svg fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z" />
  </svg>
);

// ─── Component ───────────────────────────────────────────────────────────────
export function Navbar() {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const { user, loading } = useAuth();
  const { mode, toggleMode } = useTheme();
  const pathname = usePathname();

  // Blog detail pages render their own header.
  const isBlogDetail = pathname?.startsWith("/blog/") && pathname !== "/blog";

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (isBlogDetail) {
    return null;
  }

  const closeMobileMenu = () => setIsMobileMenuOpen(false);
  const themeLabel = mode === "dark" ? "Switch to light mode" : "Switch to dark mode";

  return (
    <>
      <Header>
        <NavContainer onMouseLeave={() => setActiveDropdown(null)} aria-label="Main">
          <Logo href={ROUTES.PUBLIC.HOME} aria-label="Rejectly home">
            <LogoMark />
            Rejectly<small>.pro</small>
          </Logo>

          <DesktopMenu>
            <MenuItemWrapper onMouseEnter={() => setActiveDropdown("tools")}>
              <MenuItemText
                as="button"
                type="button"
                data-open={activeDropdown === "tools"}
                aria-expanded={activeDropdown === "tools"}
                onClick={() => setActiveDropdown(activeDropdown === "tools" ? null : "tools")}
              >
                Tools <ChevronDownIcon />
              </MenuItemText>
              <DropdownContainer $isActive={activeDropdown === "tools"}>
                <DropdownContent>
                  <DropdownContainerBox>
                    <DropdownMainSection>
                      <SectionTitle>Main tools</SectionTitle>
                      <ProductItemWrapper href={ROUTES.APP.REPORTS}>
                        <ProductItemIcon><Target strokeWidth={1.6} /></ProductItemIcon>
                        <ProductItemContent>
                          <ItemTitle>Job Match &amp; Optimize</ItemTitle>
                          <ItemDescription>See how well your resume matches a job posting and get a targeted version.</ItemDescription>
                        </ProductItemContent>
                      </ProductItemWrapper>
                      <ProductItemWrapper href={ROUTES.APP.ATS_OPTIMIZER}>
                        <ProductItemIcon><SlidersHorizontal strokeWidth={1.6} /></ProductItemIcon>
                        <ProductItemContent>
                          <ItemTitle>ATS Optimizer</ItemTitle>
                          <ItemDescription>Check ATS compatibility and get an optimized version of your resume.</ItemDescription>
                        </ProductItemContent>
                      </ProductItemWrapper>
                      <ProductItemWrapper href={ROUTES.APP.COVER_LETTERS}>
                        <ProductItemIcon><Wand2 strokeWidth={1.6} /></ProductItemIcon>
                        <ProductItemContent>
                          <ItemTitle>Cover Letters</ItemTitle>
                          <ItemDescription>Generate cover letters from your reports and track your applications.</ItemDescription>
                        </ProductItemContent>
                      </ProductItemWrapper>
                      <ProductItemWrapper href={ROUTES.PUBLIC.CV_BUILDER}>
                        <ProductItemIcon><FileText strokeWidth={1.6} /></ProductItemIcon>
                        <ProductItemContent>
                          <ItemTitle>CV Builder</ItemTitle>
                          <ItemDescription>Build an ATS-friendly CV from scratch and export it as a PDF.</ItemDescription>
                        </ProductItemContent>
                      </ProductItemWrapper>
                    </DropdownMainSection>

                    <DropdownSideSection>
                      <SectionTitle>Also included</SectionTitle>
                      <SecondaryItemWrapper href={ROUTES.PUBLIC.ATS_CHECK}>
                        <ItemTitle>Free ATS Check</ItemTitle>
                        <ItemDescription>Score your resume against ATS systems. No signup needed to start.</ItemDescription>
                      </SecondaryItemWrapper>
                      <SecondaryItemWrapper href={ROUTES.APP.REPORTS}>
                        <ItemTitle>Role Recommendation</ItemTitle>
                        <ItemDescription>Get alternative role ideas from your resume analysis.</ItemDescription>
                      </SecondaryItemWrapper>
                      <SecondaryItemWrapper href={ROUTES.APP.ATS_OPTIMIZER}>
                        <ItemTitle>Resume Customization</ItemTitle>
                        <ItemDescription>Change colors and add your photo to optimized resumes.</ItemDescription>
                      </SecondaryItemWrapper>
                    </DropdownSideSection>
                  </DropdownContainerBox>
                </DropdownContent>
              </DropdownContainer>
            </MenuItemWrapper>

            <MenuItemText href={ROUTES.PUBLIC.HOW_IT_WORKS} $isActive={pathname === ROUTES.PUBLIC.HOW_IT_WORKS}>How it works</MenuItemText>
            <MenuItemText href={ROUTES.PUBLIC.PRICING} $isActive={pathname === ROUTES.PUBLIC.PRICING}>Pricing</MenuItemText>
            <MenuItemText href={ROUTES.PUBLIC.BLOG} $isActive={pathname === ROUTES.PUBLIC.BLOG}>Blog</MenuItemText>
          </DesktopMenu>

          <RightSection>
            <ThemeButton type="button" onClick={toggleMode} aria-label={themeLabel} title={themeLabel}>
              {mode === "dark" ? <SunIcon /> : <MoonIcon />}
            </ThemeButton>
            {!isMounted || loading ? (
              <div style={{ width: 96, height: 36 }} />
            ) : user ? (
              <CTAButton href={ROUTES.APP.DASHBOARD}>Dashboard</CTAButton>
            ) : (
              <>
                <LoginLink href={ROUTES.AUTH.LOGIN}>Log in</LoginLink>
                <CTAButton href={ROUTES.PUBLIC.ATS_CHECK}>Scan free</CTAButton>
              </>
            )}
            <MobileMenuButton
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? <CloseIcon /> : <MenuIcon />}
            </MobileMenuButton>
          </RightSection>
        </NavContainer>
      </Header>

      <MobileMenuOverlay $isOpen={isMobileMenuOpen} onClick={closeMobileMenu} />
      <MobileMenu $isOpen={isMobileMenuOpen}>
        <MobileMenuItem href={ROUTES.PUBLIC.ATS_CHECK} onClick={closeMobileMenu}>Free ATS Check</MobileMenuItem>
        <MobileMenuItem href={ROUTES.PUBLIC.CV_BUILDER} onClick={closeMobileMenu}>CV Builder</MobileMenuItem>
        <MobileMenuItem href={ROUTES.PUBLIC.HOW_IT_WORKS} onClick={closeMobileMenu}>How it works</MobileMenuItem>
        <MobileMenuItem href={ROUTES.PUBLIC.PRICING} onClick={closeMobileMenu}>Pricing</MobileMenuItem>
        <MobileMenuItem href={ROUTES.PUBLIC.FAQ} onClick={closeMobileMenu}>FAQ</MobileMenuItem>
        <MobileMenuItem href={ROUTES.PUBLIC.BLOG} onClick={closeMobileMenu}>Blog</MobileMenuItem>
        <MobileDivider />
        <MobileThemeRow type="button" onClick={toggleMode}>
          <span>Appearance</span>
          <span>{mode === "dark" ? "Dark" : "Light"}</span>
        </MobileThemeRow>
        {!isMounted || loading ? (
          <div style={{ height: 56 }} />
        ) : user ? (
          <MobileCTAButton href={ROUTES.APP.DASHBOARD} onClick={closeMobileMenu}>Go to Dashboard</MobileCTAButton>
        ) : (
          <>
            <MobileMenuItem href={ROUTES.AUTH.LOGIN} onClick={closeMobileMenu}>Log in</MobileMenuItem>
            <MobileCTAButton href={ROUTES.PUBLIC.ATS_CHECK} onClick={closeMobileMenu}>Scan my resume free</MobileCTAButton>
          </>
        )}
      </MobileMenu>
    </>
  );
}

export default Navbar;
