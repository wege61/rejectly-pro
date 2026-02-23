"use client";

import styled, { css, keyframes } from "styled-components";
import { useState, useRef, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { ROUTES } from "@/lib/constants";
import { signOut } from "@/lib/auth";
import { Spinner } from "@/components/ui/Spinner";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { CreditsProvider } from "@/contexts/CreditsContext";
import { CreditWarningBanner } from "@/components/credits";

// ─── Animations ─────────────────────────────────────────────────────────────

const fadeIn = keyframes`
  from { opacity: 0; }
  to   { opacity: 1; }
`;

const fadeOut = keyframes`
  from { opacity: 1; }
  to   { opacity: 0; }
`;

const slideInFromLeft = keyframes`
  from { transform: translateX(-100%); opacity: 0; }
  to   { transform: translateX(0);    opacity: 1; }
`;

const slideOutToLeft = keyframes`
  from { transform: translateX(0);    opacity: 1; }
  to   { transform: translateX(-100%); opacity: 0; }
`;

const pageIn = keyframes`
  from { opacity: 0; transform: translateY(6px); }
  to   { opacity: 1; transform: translateY(0);   }
`;

// ─── Layout Shell ────────────────────────────────────────────────────────────

const AppShell = styled.div`
  display: flex;
  /* Lock viewport — sidebar stays fixed, only main content scrolls */
  height: 100vh;
  overflow: hidden;
  background: #0c0c0e;
  position: relative;
`;

// ─── Mobile Top Bar (floating pill — matches marketing Navbar) ────────────────

const MobileTopBar = styled.header`
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  /* Outer wrapper gives the padding so pill floats */
  padding: 12px 16px;
  pointer-events: none; /* let clicks pass through to overlay */

  @media (max-width: 1024px) {
    display: block;
  }
`;

/* The floating pill itself — mirrors NavContainer from Navbar.tsx */
const MobileNavPill = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 18px;
  border-radius: 9999px;
  pointer-events: all; /* re-enable clicks on pill */
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);

  /* Exact same glass recipe as NavContainer */
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: 9999px;
    background: rgba(14, 14, 18, 0.55);
    border: 1px solid rgba(255, 255, 255, 0.13);
    box-shadow:
      inset 0 1px 1px rgba(255, 255, 255, 0.18),
      0 8px 32px rgba(0, 0, 0, 0.35);
    backdrop-filter: blur(40px) saturate(200%);
    -webkit-backdrop-filter: blur(40px) saturate(200%);
    z-index: -1;
  }
`;

const MobileLogo = styled.div`
  font-size: 17px;
  font-weight: 700;
  letter-spacing: -0.03em;
  background: linear-gradient(135deg, var(--primary-500) 0%, var(--primary-700) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const HamburgerButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  border-radius: 50%;
  /* Transparent — sits on the pill, very minimal */
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.12);
  cursor: pointer;
  color: rgba(255, 255, 255, 0.8);
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);

  &:hover {
    background: rgba(255, 255, 255, 0.12);
    border-color: rgba(255, 255, 255, 0.22);
    color: rgba(255, 255, 255, 0.95);
  }

  svg {
    width: 16px;
    height: 16px;
  }
`;

// ─── Mobile Overlay ──────────────────────────────────────────────────────────

const MobileOverlay = styled.div<{ $visible: boolean; $closing: boolean }>`
  display: none;

  @media (max-width: 1024px) {
    display: block;
    position: fixed;
    inset: 0;
    z-index: 149;
    background: rgba(0, 0, 0, 0.4);
    backdrop-filter: blur(4px);
    cursor: pointer;

    opacity: ${({ $visible }) => ($visible ? 1 : 0)};
    pointer-events: ${({ $visible }) => ($visible ? "all" : "none")};
    animation: ${({ $visible, $closing }) =>
      $closing ? fadeOut : $visible ? fadeIn : "none"}
      0.25s ease-in-out;
  }
`;

// ─── Mobile Floating Panel (replaces full-screen drawer) ─────────────────────

const MobileFloatingPanel = styled.div<{ $visible: boolean; $closing: boolean }>`
  display: none;

  @media (max-width: 1024px) {
    display: flex;
    flex-direction: column;
    position: fixed;
    top: 70px;
    left: 10px;
    right: 10px;
    z-index: 200;
    border-radius: 22px;
    overflow: hidden;

    /*
     * True Apple Liquid Glass —
     * Very low opacity + extreme blur = objects behind bleed through
     * brightness(1.15) lightens the blur, making refracted colors pop
     * saturate(300%) amplifies those background colors
     * contrast(1.04) sharpens the "lens" feel
     */
    background: rgba(10, 10, 14, 0.28);
    backdrop-filter: blur(80px) saturate(300%) brightness(1.15) contrast(1.04);
    -webkit-backdrop-filter: blur(80px) saturate(300%) brightness(1.15) contrast(1.04);
    border: 1px solid rgba(255, 255, 255, 0.16);
    box-shadow:
      0 32px 80px rgba(0, 0, 0, 0.5),
      0 8px 24px rgba(0, 0, 0, 0.3),
      inset 0 1px 0 rgba(255, 255, 255, 0.22),
      inset 0 0 0 0.5px rgba(255, 255, 255, 0.07);

    /* Specular streak — concentrated bright line at very top (light entry point) */
    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 8%;
      right: 8%;
      height: 1px;
      background: linear-gradient(
        90deg,
        transparent 0%,
        rgba(255, 255, 255, 0.45) 35%,
        rgba(255, 255, 255, 0.75) 50%,
        rgba(255, 255, 255, 0.45) 65%,
        transparent 100%
      );
      pointer-events: none;
      z-index: 2;
    }

    /* Diagonal glass sheen — simulates environmental light bouncing through */
    &::after {
      content: '';
      position: absolute;
      inset: 0;
      background: linear-gradient(
        135deg,
        rgba(255, 255, 255, 0.07) 0%,
        rgba(255, 255, 255, 0.02) 25%,
        transparent 55%,
        rgba(255, 255, 255, 0.015) 100%
      );
      pointer-events: none;
      border-radius: 22px;
      z-index: 1;
    }

    opacity: ${({ $visible }) => ($visible ? 1 : 0)};
    pointer-events: ${({ $visible }) => ($visible ? "all" : "none")};
    transform: ${({ $visible }) =>
      $visible ? "translateY(0) scale(1)" : "translateY(-16px) scale(0.96)"};
    transform-origin: top center;
    transition: opacity 0.28s cubic-bezier(0.16, 1, 0.3, 1),
      transform 0.28s cubic-bezier(0.16, 1, 0.3, 1);
  }
`;

const MobilePanelNav = styled.div`
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const MobilePanelSection = styled.div`
  margin-bottom: 4px;
`;

const MobilePanelLabel = styled.div`
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.07em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.28);
  padding: 10px 12px 4px;
`;

const MobilePanelItem = styled.a<{ $active: boolean }>`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 11px 14px;
  border-radius: 12px;
  font-size: 15px;
  font-weight: ${({ $active }) => ($active ? 600 : 500)};
  color: ${({ $active }) =>
    $active ? "rgba(255,255,255,0.97)" : "rgba(255,255,255,0.55)"};
  background: ${({ $active }) =>
    $active ? "rgba(255,255,255,0.1)" : "transparent"};
  text-decoration: none;
  transition: all 0.18s ease;
  cursor: pointer;

  ${({ $active }) =>
    $active &&
    css`
      box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.15), 0 2px 8px rgba(0,0,0,0.3);
    `}

  &:hover {
    background: ${({ $active }) =>
      $active ? "rgba(255,255,255,0.1)" : "rgba(255,255,255,0.06)"};
    color: rgba(255, 255, 255, 0.9);
  }

  svg { width: 18px; height: 18px; flex-shrink: 0; opacity: ${({ $active }) => ($active ? 0.9 : 0.5)}; }
`;

const MobilePanelDivider = styled.div`
  height: 1px;
  background: rgba(255, 255, 255, 0.06);
  margin: 4px 12px;
`;

const MobilePanelFooter = styled.div`
  padding: 12px;
  border-top: 1px solid rgba(255, 255, 255, 0.07);
`;

/* Clickable profile row — matches desktop ProfileButton feel */
const MobilePanelProfileRow = styled.button<{ $open?: boolean }>`
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  padding: 10px 12px;
  border-radius: 14px;
  background: ${({ $open }) =>
    $open ? "rgba(255,255,255,0.1)" : "rgba(255,255,255,0.05)"};
  border: 1px solid ${({ $open }) =>
    $open ? "rgba(255,255,255,0.14)" : "rgba(255,255,255,0.07)"};
  cursor: pointer;
  transition: all 0.18s ease;
  text-align: left;

  &:hover {
    background: rgba(255, 255, 255, 0.09);
    border-color: rgba(255, 255, 255, 0.12);
  }
`;

// ─── Sidebar ─────────────────────────────────────────────────────────────────

const Sidebar = styled.aside<{ $isOpen?: boolean; $isClosing?: boolean }>`
  width: 220px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  position: sticky;
  top: 0;
  height: 100vh;
  overflow: hidden;
  z-index: 10;

  /* ── Float panel: Apple-style inset with radius ── */
  margin: 10px 0 10px 10px;
  height: calc(100vh - 20px);
  border-radius: 18px;
  overflow: hidden;

  /* Apple Liquid Glass core */
  background: rgba(22, 22, 26, 0.78);
  backdrop-filter: blur(60px) saturate(200%);
  -webkit-backdrop-filter: blur(60px) saturate(200%);
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow:
    0 8px 40px rgba(0, 0, 0, 0.45),
    0 2px 8px rgba(0, 0, 0, 0.3);

  /* ── Specular light refraction ─── */
  /* Top highlight — light hits the glass from above */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(
      90deg,
      transparent 0%,
      rgba(255, 255, 255, 0.25) 40%,
      rgba(255, 255, 255, 0.45) 60%,
      rgba(255, 255, 255, 0.25) 80%,
      transparent 100%
    );
    pointer-events: none;
    z-index: 1;
  }

  /* Right-edge refraction — light exits through the glass face */
  &::after {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    width: 1px;
    background: linear-gradient(
      180deg,
      rgba(255, 255, 255, 0.15) 0%,
      rgba(255, 255, 255, 0.05) 40%,
      rgba(255, 255, 255, 0.0) 100%
    );
    pointer-events: none;
    z-index: 1;
  }

  @media (max-width: 1024px) {
    /* On mobile, hide the desktop sidebar completely */
    display: none;
  }
`;

// ─── Sidebar Inner Sections ──────────────────────────────────────────────────

const SidebarTop = styled.div`
  padding: 28px 18px 16px;
`;

const SidebarLogo = styled.div`
  font-size: 18px;
  font-weight: 700;
  letter-spacing: -0.03em;
  background: linear-gradient(135deg, var(--primary-500) 0%, var(--primary-700) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  padding: 4px 10px;
  margin-bottom: 4px;
  text-decoration: none;
  cursor: pointer;
`;

const SidebarScrollable = styled.div`
  flex: 1;
  overflow-y: auto;
  /* Apple-style generous negative space — content breathes */
  padding: 0 10px;

  /* Hide scrollbar */
  scrollbar-width: none;
  &::-webkit-scrollbar { display: none; }
`;

const NavGroup = styled.div`
  margin-bottom: 4px;
`;

const NavGroupLabel = styled.div`
  font-size: 10.5px;
  font-weight: 600;
  letter-spacing: 0.07em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.28);
  /* Apple-level negative space: generous top gap before each group */
  padding: 18px 12px 6px;
`;

const NavItem = styled.a<{ $active: boolean }>`
  display: flex;
  align-items: center;
  gap: 10px;
  /* Apple-style generous item padding — lots of breathing room */
  padding: 9px 12px;
  border-radius: 10px;
  font-size: 14px;
  font-weight: ${({ $active }) => ($active ? 600 : 500)};
  letter-spacing: -0.01em;
  color: ${({ $active }) =>
    $active ? "rgba(255,255,255,0.97)" : "rgba(255,255,255,0.48)"};
  background: ${({ $active }) =>
    $active ? "rgba(255,255,255,0.11)" : "transparent"};
  text-decoration: none;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
  position: relative;
  overflow: hidden;

  /* Active: specular top highlight on the item itself */
  ${({ $active }) =>
    $active &&
    css`
      box-shadow:
        inset 0 1px 0 rgba(255, 255, 255, 0.18),
        0 2px 12px rgba(0, 0, 0, 0.35);
      &::before {
        content: '';
        position: absolute;
        inset: 0;
        border-radius: 10px;
        background: linear-gradient(
          135deg,
          rgba(255, 255, 255, 0.06) 0%,
          transparent 60%
        );
        pointer-events: none;
      }
    `}

  &:hover {
    background: ${({ $active }) =>
      $active ? "rgba(255,255,255,0.11)" : "rgba(255,255,255,0.05)"};
    color: ${({ $active }) =>
      $active ? "rgba(255,255,255,0.97)" : "rgba(255,255,255,0.75)"};
  }

  svg {
    width: 17px;
    height: 17px;
    flex-shrink: 0;
    opacity: ${({ $active }) => ($active ? 0.9 : 0.5)};
  }
`;

// ─── Sidebar Footer / Profile ────────────────────────────────────────────────

const SidebarBottom = styled.div`
  padding: 12px;
  /* Specular hairline separator */
  border-top: 1px solid rgba(255, 255, 255, 0.07);
  position: relative;

  /* Subtle inner glow at the top of footer */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 16px;
    right: 16px;
    height: 1px;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.12) 40%,
      rgba(255, 255, 255, 0.12) 60%,
      transparent
    );
    pointer-events: none;
  }
`;

const ProfileButton = styled.button<{ $open: boolean }>`
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  padding: 10px;
  border-radius: 12px;
  background: ${({ $open }) =>
    $open ? "rgba(255,255,255,0.1)" : "rgba(255,255,255,0.04)"};
  border: 1px solid ${({ $open }) =>
    $open ? "rgba(255,255,255,0.12)" : "rgba(255,255,255,0.06)"};
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: left;

  &:hover {
    background: rgba(255, 255, 255, 0.08);
    border-color: rgba(255, 255, 255, 0.1);
  }
`;

const Avatar = styled.div`
  width: 34px;
  height: 34px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--primary-500), var(--primary-700));
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  font-weight: 700;
  color: white;
  flex-shrink: 0;
  letter-spacing: -0.02em;
`;

const ProfileMeta = styled.div`
  flex: 1;
  min-width: 0;
`;

const ProfileName = styled.div`
  font-size: 13px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.9);
  letter-spacing: -0.01em;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const ProfileEmail = styled.div`
  font-size: 11px;
  color: rgba(255, 255, 255, 0.4);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-top: 1px;
`;

const ChevronIcon = styled.div<{ $open: boolean }>`
  color: rgba(255, 255, 255, 0.3);
  display: flex;
  transition: transform 0.2s ease;
  transform: ${({ $open }) => ($open ? "rotate(180deg)" : "rotate(0deg)")};

  svg {
    width: 16px;
    height: 16px;
  }
`;

// ─── Profile Dropdown ────────────────────────────────────────────────────────

const ProfileDropdown = styled.div<{ $open: boolean }>`
  position: fixed;
  bottom: 80px;
  left: 232px;
  width: 230px;
  z-index: 300;

  /* Liquid Glass treatment */
  background: rgba(18, 18, 22, 0.6);
  backdrop-filter: blur(60px) saturate(220%) brightness(1.1);
  -webkit-backdrop-filter: blur(60px) saturate(220%) brightness(1.1);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 18px;
  padding: 6px;
  box-shadow:
    0 24px 64px rgba(0, 0, 0, 0.6),
    0 4px 16px rgba(0, 0, 0, 0.4),
    inset 0 1px 0 rgba(255, 255, 255, 0.2),
    inset 0 0 0 0.5px rgba(255, 255, 255, 0.08);

  /* Specular top edge */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 15%;
    right: 15%;
    height: 1px;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.5) 50%,
      transparent
    );
    pointer-events: none;
    border-radius: 18px 18px 0 0;
  }

  opacity: ${({ $open }) => ($open ? 1 : 0)};
  visibility: ${({ $open }) => ($open ? "visible" : "hidden")};
  transform: ${({ $open }) =>
    $open ? "scale(1) translateY(0)" : "scale(0.95) translateY(6px)"};
  transform-origin: left bottom;
  transition: all 0.22s cubic-bezier(0.16, 1, 0.3, 1);

  /* Mobile: float below the profile row inside the panel */
  @media (max-width: 1024px) {
    position: fixed;
    bottom: auto;
    top: auto;
    /* Will be overridden by JS via inline style if needed —
       statically position at reasonable offset from viewport bottom */
    left: 10px;
    right: 10px;
    width: auto;
    bottom: 20px;
    transform-origin: center bottom;
  }
`;

const DropdownItem = styled.a`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 9px 12px;
  border-radius: 10px;
  color: rgba(255, 255, 255, 0.75);
  font-size: 13px;
  font-weight: 500;
  letter-spacing: -0.01em;
  text-decoration: none;
  cursor: pointer;
  transition: all 0.15s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.07);
    color: rgba(255, 255, 255, 0.95);
  }

  svg { width: 17px; height: 17px; flex-shrink: 0; opacity: 0.7; }
`;

const DropdownSignOut = styled.button`
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  padding: 9px 12px;
  border-radius: 10px;
  background: transparent;
  border: none;
  color: #ff453a;
  font-size: 13px;
  font-weight: 500;
  letter-spacing: -0.01em;
  cursor: pointer;
  text-align: left;
  transition: all 0.15s ease;

  &:hover { background: rgba(255, 59, 48, 0.1); }

  svg { width: 17px; height: 17px; flex-shrink: 0; }
`;

const DropdownDivider = styled.div`
  height: 1px;
  background: rgba(255, 255, 255, 0.07);
  margin: 4px 0;
`;

const ThemeRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 9px 12px;
  color: rgba(255, 255, 255, 0.75);
  font-size: 13px;
  font-weight: 500;
  letter-spacing: -0.01em;
`;

// ─── Main Content Area ────────────────────────────────────────────────────────

const PageMain = styled.main<{ $animating?: boolean }>`
  flex: 1;
  height: 100vh;
  overflow-y: auto;
  animation: ${({ $animating }) => ($animating ? pageIn : "none")} 0.3s ease;

  @media (max-width: 1024px) {
    padding-top: 70px;
    height: 100vh;
  }
`;

const LoadingScreen = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: #0a0a0a;
`;

// ─── Icons ───────────────────────────────────────────────────────────────────

const DashboardIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
  </svg>
);

const ResumeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
  </svg>
);

const JobPostingsIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0M12 12.75h.008v.008H12v-.008z" />
  </svg>
);

const JobMatchIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
  </svg>
);

const ATSIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
  </svg>
);

const CoverLetterIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
  </svg>
);

const BillingIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
  </svg>
);

const SettingsIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const LogOutIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
  </svg>
);

const ThemeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
  </svg>
);

const MenuIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
  </svg>
);

const CloseIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const ChevronUpDown = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 15L12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9" />
  </svg>
);

// ─── Nav Structure ────────────────────────────────────────────────────────────

const navSections = [
  {
    label: "Overview",
    items: [
      { label: "Dashboard", href: ROUTES.APP.DASHBOARD, icon: <DashboardIcon /> },
    ],
  },
  {
    label: "My Data",
    items: [
      { label: "Resumes",      href: ROUTES.APP.CV,   icon: <ResumeIcon /> },
      { label: "Job Postings", href: ROUTES.APP.JOBS, icon: <JobPostingsIcon /> },
    ],
  },
  {
    label: "Tools",
    items: [
      { label: "Job Match",     href: ROUTES.APP.REPORTS,        icon: <JobMatchIcon /> },
      { label: "ATS Optimizer", href: ROUTES.APP.ATS_OPTIMIZER,  icon: <ATSIcon /> },
      { label: "Cover Letters", href: ROUTES.APP.COVER_LETTERS,  icon: <CoverLetterIcon /> },
    ],
  },
];

// ─── Component ────────────────────────────────────────────────────────────────

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth(ROUTES.AUTH.LOGIN);
  const pathname = usePathname();
  const [isMobileOpen, setIsMobileOpen]     = useState(false);
  const [isClosing, setIsClosing]           = useState(false);
  const [isAnimating, setIsAnimating]       = useState(false);
  const [isProfileOpen, setIsProfileOpen]   = useState(false);
  const profileRef   = useRef<HTMLElement>(null);
  const dropdownRef  = useRef<HTMLDivElement>(null);

  // Page transition
  useEffect(() => {
    setIsAnimating(true);
    const t = setTimeout(() => setIsAnimating(false), 300);
    return () => clearTimeout(t);
  }, [pathname]);

  // Scroll lock on mobile
  useEffect(() => {
    document.body.style.overflow = isMobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isMobileOpen]);

  // Close profile dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const t = e.target as Node;
      if (
        profileRef.current && !profileRef.current.contains(t) &&
        dropdownRef.current && !dropdownRef.current.contains(t)
      ) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const openMobile  = () => { setIsClosing(false); setIsMobileOpen(true); };
  const closeMobile = () => {
    setIsClosing(true);
    setTimeout(() => { setIsMobileOpen(false); setIsClosing(false); }, 280);
  };

  const handleNavClick = () => {
    if (isMobileOpen) closeMobile();
    setIsProfileOpen(false);
  };

  const getInitials = (name?: string, email?: string) => {
    if (name) return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
    if (email) return email[0].toUpperCase();
    return "U";
  };

  if (loading) {
    return (
      <LoadingScreen>
        <Spinner size="xl" />
      </LoadingScreen>
    );
  }

  if (!user) return null;

  const SidebarContent = () => (
    <>
      {/* Logo */}
      <SidebarTop>
        <SidebarLogo as={Link} href="/">Rejectly.pro</SidebarLogo>
      </SidebarTop>

      {/* Nav groups */}
      <SidebarScrollable>
        {navSections.map(section => (
          <NavGroup key={section.label}>
            <NavGroupLabel>{section.label}</NavGroupLabel>
            {section.items.map(item => (
              <NavItem
                key={item.href}
                href={item.href}
                $active={pathname === item.href}
                onClick={handleNavClick}
              >
                {item.icon}
                <span>{item.label}</span>
              </NavItem>
            ))}
          </NavGroup>
        ))}
      </SidebarScrollable>

      {/* Profile card */}
      <SidebarBottom ref={profileRef as React.RefObject<HTMLDivElement>}>
        <ProfileButton
          $open={isProfileOpen}
          onClick={() => setIsProfileOpen(v => !v)}
        >
          <Avatar>{getInitials(user.user_metadata?.name, user.email)}</Avatar>
          <ProfileMeta>
            <ProfileName>{user.user_metadata?.name || "User"}</ProfileName>
            <ProfileEmail>{user.email}</ProfileEmail>
          </ProfileMeta>
          <ChevronIcon $open={isProfileOpen}>
            <ChevronUpDown />
          </ChevronIcon>
        </ProfileButton>
      </SidebarBottom>
    </>
  );

  return (
    <AppShell id="app-layout">
      {/* ── Mobile top bar ── */}
      <MobileTopBar>
        <MobileNavPill>
          <MobileLogo as={Link} href="/">Rejectly.pro</MobileLogo>
          <HamburgerButton onClick={isMobileOpen ? closeMobile : openMobile} aria-label="Toggle menu">
            {isMobileOpen ? <CloseIcon /> : <MenuIcon />}
          </HamburgerButton>
        </MobileNavPill>
      </MobileTopBar>

      {/* ── Mobile overlay (dim bg) ── */}
      <MobileOverlay
        $visible={isMobileOpen}
        $closing={isClosing}
        onClick={closeMobile}
      />

      {/* ── Mobile floating glass panel ── */}
      <MobileFloatingPanel $visible={isMobileOpen} $closing={isClosing}>
        <MobilePanelNav>
          {navSections.map(section => (
            <MobilePanelSection key={section.label}>
              <MobilePanelLabel>{section.label}</MobilePanelLabel>
              {section.items.map(item => (
                <MobilePanelItem
                  key={item.href}
                  href={item.href}
                  $active={pathname === item.href}
                  onClick={closeMobile}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </MobilePanelItem>
              ))}
            </MobilePanelSection>
          ))}
        </MobilePanelNav>
        <MobilePanelDivider />
        <MobilePanelFooter>
          <MobilePanelProfileRow
            $open={isProfileOpen}
            onClick={() => setIsProfileOpen(v => !v)}
            ref={profileRef as React.RefObject<HTMLButtonElement>}
          >
            <Avatar>{getInitials(user.user_metadata?.name, user.email)}</Avatar>
            <ProfileMeta>
              <ProfileName>{user.user_metadata?.name || "User"}</ProfileName>
              <ProfileEmail>{user.email}</ProfileEmail>
            </ProfileMeta>
            <ChevronIcon $open={isProfileOpen} style={{ marginLeft: "auto" }}>
              <ChevronUpDown />
            </ChevronIcon>
          </MobilePanelProfileRow>
        </MobilePanelFooter>
      </MobileFloatingPanel>

      {/* ── Desktop Sidebar ── */}
      <Sidebar>
        <SidebarContent />
      </Sidebar>

      {/* ── Profile dropdown (desktop) ── */}
      <ProfileDropdown $open={isProfileOpen} ref={dropdownRef}>
        <DropdownItem href={ROUTES.APP.BILLING} onClick={handleNavClick}>
          <BillingIcon /> Billing
        </DropdownItem>
        <DropdownItem href={ROUTES.APP.SETTINGS} onClick={handleNavClick}>
          <SettingsIcon /> Settings
        </DropdownItem>
        <DropdownDivider />
        <ThemeRow>
          <span style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <ThemeIcon /> Theme
          </span>
          <ThemeToggle />
        </ThemeRow>
        <DropdownDivider />
        <DropdownSignOut onClick={() => signOut()}>
          <LogOutIcon /> Sign out
        </DropdownSignOut>
      </ProfileDropdown>

      {/* ── Main ── */}
      <PageMain $animating={isAnimating}>
        <CreditsProvider>
          <CreditWarningBanner />
          {children}
        </CreditsProvider>
      </PageMain>
    </AppShell>
  );
}
