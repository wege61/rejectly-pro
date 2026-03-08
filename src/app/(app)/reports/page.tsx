"use client";

import styled, { keyframes, css } from "styled-components";
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { ReportsListSkeleton } from "@/components/skeletons/ReportsListSkeleton";
import { Modal } from "@/components/ui/Modal";
import { ROUTES } from "@/lib/constants";
import { useAuth } from "@/hooks/useAuth";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useToast } from "@/contexts/ToastContext";
import { CreditsCard } from "@/components/dashboard/CreditsCard";

// Icons
const DeleteIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    <line x1="10" y1="11" x2="10" y2="17" />
    <line x1="14" y1="11" x2="14" y2="17" />
  </svg>
);

const ArrowRightIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M5 12h14M12 5l7 7-7 7" />
  </svg>
);

const Container = styled.div`
  position: relative;
  padding-top: 24px;
  max-width: 1200px;
  margin: 0 auto;
  padding-left: ${({ theme }) => theme.spacing["2xl"]};
  padding-right: ${({ theme }) => theme.spacing["2xl"]};
  padding-bottom: 100px; /* Space for FAB */
  overflow-x: hidden;

  @media (max-width: 450px) {
    padding: ${({ theme }) => theme.spacing["lg"]};
    padding-top: 24px;
  }
`;

const Header = styled.div`
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 24px;
  margin-bottom: 48px;
  margin-top: 24px;

  @media (max-width: 768px) {
    align-items: flex-start;
    gap: 12px;
    margin-bottom: 24px;
  }
`;

const TitleElements = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  min-width: 0;
  gap: 12px;
`;

const Title = styled.h1`
  font-size: 36px;
  font-weight: 700;
  letter-spacing: -0.03em;
  color: rgba(255, 255, 255, 0.95);
  line-height: 1.1;
  margin: 0;

  @media (max-width: 768px) {
    font-size: 24px;
    margin-bottom: 4px;
  }
`;

const Subtitle = styled.p`
  font-size: 15px;
  color: rgba(255, 255, 255, 0.6);
  font-weight: 500;
  letter-spacing: -0.01em;
  margin: 0;

  @media (max-width: 768px) {
    order: 3;
  }
`;

const CreditsCardWrapper = styled.div`
  flex-shrink: 0;

  @media (max-width: 768px) {
    width: auto;
    
    > div {
      width: auto;
    }
  }
`;

const ReportsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
  gap: 16px;

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

const CategorySection = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing["2xl"]};

  &:last-child {
    margin-bottom: 0;
  }
`;

const CategoryHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

/* ── Liquid Glass content wrapper (same as CV page) ── */
const ContentSection = styled.div`
  position: relative;
  border-radius: 24px;
  overflow: hidden;
  background: rgba(18, 18, 22, 0.55);
  backdrop-filter: blur(40px) saturate(180%);
  -webkit-backdrop-filter: blur(40px) saturate(180%);
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: 0 8px 40px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1);

  &::before {
    content: '';
    position: absolute;
    top: 0; left: 10%; right: 10%;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.35) 50%, transparent);
    pointer-events: none;
    z-index: 1;
  }
`;

const ContentHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
    gap: 16px;
    padding: 16px;
  }
`;

const ContentBody = styled.div`
  padding: 24px;

  @media (max-width: 768px) {
    padding: 16px;
  }
`;

/* Floating pill tab bar — identical to CV page */
type ReportTabType = 'all' | 'excellent' | 'good' | 'fair' | 'poor';

const TabContainer = styled.div`
  display: flex;
  align-items: center;
  flex-shrink: 0;
  gap: 2px;
  padding: 4px;
  border-radius: 9999px;
  background: rgba(255, 255, 255, 0.06);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.08);

  @media (max-width: 768px) {
    width: 100%;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
    border-radius: 14px;
    &::-webkit-scrollbar { display: none; }
  }
`;

const TabButton = styled.button<{ $active: boolean }>`
  display: inline-flex;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;
  gap: 7px;
  padding: 7px 14px;
  border: none;
  border-radius: 9999px;
  font-size: 13.5px;
  font-weight: ${({ $active }) => ($active ? 600 : 500)};
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
  white-space: nowrap;
  letter-spacing: -0.01em;
  background: ${({ $active }) => $active ? 'rgba(255,255,255,0.14)' : 'transparent'};
  color: ${({ $active }) => $active ? 'rgba(255,255,255,0.97)' : 'rgba(255,255,255,0.45)'};
  box-shadow: ${({ $active }) => $active
    ? 'inset 0 1px 0 rgba(255,255,255,0.2), 0 2px 8px rgba(0,0,0,0.3)'
    : 'none'};

  &:hover {
    color: rgba(255,255,255,0.85);
    background: ${({ $active }) => $active ? 'rgba(255,255,255,0.14)' : 'rgba(255,255,255,0.07)'};
  }

  @media (max-width: 600px) {
    padding: 6px 11px;
    font-size: 13px;
    gap: 5px;
  }
`;

const TabCount = styled.span<{ $active: boolean }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 18px;
  height: 18px;
  padding: 0 5px;
  border-radius: 9999px;
  font-size: 10.5px;
  font-weight: 700;
  background: ${({ $active }) => $active ? 'var(--accent)' : 'rgba(255,255,255,0.1)'};
  color: ${({ $active }) => $active ? 'white' : 'rgba(255,255,255,0.45)'};

  @media (max-width: 600px) {
    min-width: 16px;
    height: 16px;
    font-size: 10px;
  }
`;

const TabEmptyState = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 80px 24px;
  font-size: 15px;
  color: rgba(255,255,255,0.3);
  text-align: center;
`;

/* ── Liquid Glass empty state ── */
const glowPulse = keyframes`
  0%, 100% { opacity: 0.35; transform: scale(1); }
  50%       { opacity: 0.55; transform: scale(1.06); }
`;

const floatOrb = keyframes`
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  33%       { transform: translateY(-18px) rotate(3deg); }
  66%       { transform: translateY(8px) rotate(-2deg); }
`;

const shimmerSlide = keyframes`
  from { transform: translateX(-100%); }
  to   { transform: translateX(100%); }
`;

const EmptyHero = styled.div`
  position: relative;
  border-radius: 28px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0;
  padding: 36px 40px 44px;
  text-align: center;

  /* Liquid Glass base */
  background:
    radial-gradient(ellipse 70% 50% at 50% 0%, rgba(var(--accent-rgb), 0.10) 0%, transparent 70%),
    rgba(16, 16, 22, 0.60);
  backdrop-filter: blur(48px) saturate(180%);
  -webkit-backdrop-filter: blur(48px) saturate(180%);
  border: 1px solid rgba(255,255,255,0.10);
  box-shadow:
    inset 0 1px 0 rgba(255,255,255,0.12),
    0 32px 80px rgba(0,0,0,0.5);

  @media (max-width: 768px) {
    padding: 32px 20px 40px;
  }
`;

/* Floating ambient orbs inside the hero */
const OrbA = styled.div`
  position: absolute;
  width: 360px;
  height: 360px;
  border-radius: 50%;
  top: -80px;
  right: -60px;
  background: radial-gradient(circle, rgba(var(--accent-rgb), 0.14) 0%, transparent 70%);
  animation: ${floatOrb} 9s ease-in-out infinite;
  pointer-events: none;
`;

const OrbB = styled.div`
  position: absolute;
  width: 280px;
  height: 280px;
  border-radius: 50%;
  bottom: -60px;
  left: -40px;
  background: radial-gradient(circle, rgba(102, 126, 234, 0.12) 0%, transparent 70%);
  animation: ${floatOrb} 12s ease-in-out infinite reverse;
  pointer-events: none;
`;

/* Top specular line */
const HeroSpecular = styled.div`
  position: absolute;
  top: 0;
  left: 15%;
  right: 15%;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.40) 50%, transparent);
  pointer-events: none;
`;

/* The central icon badge */
const HeroIconBadge = styled.div`
  position: relative;
  width: 80px;
  height: 80px;
  border-radius: 24px;
  margin-bottom: 22px;
  display: flex;
  align-items: center;
  justify-content: center;

  background:
    linear-gradient(145deg, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0.04) 100%),
    rgba(var(--accent-rgb), 0.20);
  border: 1px solid rgba(255,255,255,0.22);
  box-shadow:
    inset 0 1.5px 0 rgba(255,255,255,0.55),
    0 8px 28px rgba(var(--accent-rgb), 0.30),
    0 3px 10px rgba(0,0,0,0.35);

  svg {
    width: 36px;
    height: 36px;
    color: rgba(255,255,255,0.92);
    filter: drop-shadow(0 1px 4px rgba(var(--accent-rgb), 0.5));
  }
`;

const HeroTitle = styled.h2`
  font-size: 26px;
  font-weight: 800;
  letter-spacing: -0.04em;
  line-height: 1.15;
  margin-bottom: 10px;
  color: rgba(255,255,255,0.95);

  @media (max-width: 768px) { font-size: 22px; }
`;

const HeroSubtitle = styled.p`
  font-size: 14px;
  color: rgba(255,255,255,0.42);
  line-height: 1.60;
  max-width: 420px;
  margin: 0 auto 24px;
  letter-spacing: -0.01em;
`;

/* 3-step how-it-works strip */
const StepsRow = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 0;
  width: 100%;
  max-width: 580px;
  margin-bottom: 28px;
  position: relative;

  @media (max-width: 640px) {
    flex-direction: column;
    align-items: center;
    gap: 12px;
  }
`;

const StepConnector = styled.div`
  flex: 1;
  height: 1px;
  background: linear-gradient(90deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.06) 100%);
  margin-top: 22px;
  flex-shrink: 1;

  @media (max-width: 640px) { display: none; }
`;

const Step = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  flex-shrink: 0;
  width: 130px;

  @media (max-width: 640px) {
    width: 100%;
    max-width: 260px;
    flex-direction: row;
    text-align: left;
    align-items: center;
  }
`;

const StepNum = styled.div<{ $n: 1 | 2 | 3 }>`
  width: 44px;
  height: 44px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  font-weight: 800;
  flex-shrink: 0;

  background: ${({ $n }) => {
    switch ($n) {
      case 1: return 'rgba(var(--accent-rgb), 0.18)';
      case 2: return 'rgba(102, 126, 234, 0.18)';
      case 3: return 'rgba(16, 185, 129, 0.18)';
    }
  }};
  border: 1px solid ${({ $n }) => {
    switch ($n) {
      case 1: return 'rgba(var(--accent-rgb), 0.35)';
      case 2: return 'rgba(102, 126, 234, 0.35)';
      case 3: return 'rgba(16, 185, 129, 0.35)';
    }
  }};
  color: ${({ $n }) => {
    switch ($n) {
      case 1: return 'var(--accent)';
      case 2: return '#818cf8';
      case 3: return '#34d399';
    }
  }};
`;

const StepText = styled.div`
  font-size: 11.5px;
  font-weight: 600;
  color: rgba(255,255,255,0.48);
  letter-spacing: 0.01em;
  line-height: 1.45;
  text-align: center;

  @media (max-width: 640px) { text-align: left; }
`;

/* CTA button */
const HeroCTAButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 16px 36px;
  border-radius: 9999px;
  cursor: pointer;
  font-size: 15px;
  font-weight: 700;
  letter-spacing: -0.01em;
  border: none;
  color: white;
  transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
  position: relative;
  overflow: hidden;

  background: linear-gradient(
    135deg,
    rgba(255,255,255,0.22) 0%,
    rgba(255,255,255,0.0) 100%
  ), rgba(var(--accent-rgb), 0.75);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  box-shadow:
    inset 0 1.5px 0 rgba(255,255,255,0.55),
    0 8px 32px rgba(var(--accent-rgb), 0.45),
    0 2px 8px rgba(0,0,0,0.3);

  &:hover {
    transform: translateY(-3px) scale(1.02);
    box-shadow:
      inset 0 1.5px 0 rgba(255,255,255,0.70),
      0 16px 56px rgba(var(--accent-rgb), 0.55),
      0 4px 16px rgba(0,0,0,0.35);
  }

  &:active { transform: scale(0.98); }

  svg { width: 20px; height: 20px; flex-shrink: 0; }
`;

const HeroCTASecondary = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 14px 28px;
  border-radius: 9999px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  letter-spacing: -0.01em;
  color: rgba(255,255,255,0.60);
  border: 1px solid rgba(255,255,255,0.12);
  background: rgba(255,255,255,0.05);
  backdrop-filter: blur(16px);
  transition: all 0.2s ease;

  &:hover {
    color: rgba(255,255,255,0.85);
    background: rgba(255,255,255,0.1);
    border-color: rgba(255,255,255,0.22);
  }
`;

const HeroCTARow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
  justify-content: center;
`;


const CategoryBadge = styled.span<{ $variant: 'excellent' | 'good' | 'fair' | 'poor' }>`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 5px 14px;
  border-radius: 9999px;
  font-size: 13px;
  font-weight: 600;

  /* Liquid Glass pill */
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);

  ${({ $variant }) => {
    switch ($variant) {
      case 'excellent':
        return `
          color: var(--primary-500);
          background: rgba(var(--primary-rgb, 99,210,178), 0.1);
          border: 1px solid rgba(var(--primary-rgb, 99,210,178), 0.2);
        `;
      case 'good':
        return `
          color: #60a5fa;
          background: rgba(96,165,250, 0.1);
          border: 1px solid rgba(96,165,250, 0.2);
        `;
      case 'fair':
        return `
          color: #fbbf24;
          background: rgba(251,191,36, 0.1);
          border: 1px solid rgba(251,191,36, 0.2);
        `;
      case 'poor':
        return `
          color: #fb923c;
          background: rgba(249,115,22, 0.1);
          border: 1px solid rgba(249,115,22, 0.2);
        `;
    }
  }}
`;

const CategoryCount = styled.span`
  font-size: 13px;
  color: var(--text-secondary);
`;

const ReportCard = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  overflow: hidden;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  min-height: 200px;

  /* Liquid Glass card — stronger contrast */
  background: rgba(30, 30, 40, 0.78);
  backdrop-filter: blur(30px) saturate(160%);
  -webkit-backdrop-filter: blur(30px) saturate(160%);
  border: 1px solid rgba(255, 255, 255, 0.14);
  box-shadow:
    0 2px 1px rgba(255, 255, 255, 0.06) inset,
    0 8px 32px rgba(0, 0, 0, 0.55),
    0 2px 8px rgba(0, 0, 0, 0.4);

  &:hover {
    transform: translateY(-5px) scale(1.01);
    border-color: rgba(255, 255, 255, 0.22);
    box-shadow:
      0 2px 1px rgba(255, 255, 255, 0.08) inset,
      0 20px 56px rgba(0, 0, 0, 0.65),
      0 6px 20px rgba(0, 0, 0, 0.45);
  }

  &:hover .report-content {
    transform: translateY(-32px);
  }

  &:hover .report-cta {
    transform: translateY(0);
    opacity: 1;
  }

  @media (max-width: 1024px) {
    &:hover .report-content {
      transform: none;
    }
  }
`;

const FakeItBanner = styled.div`
  position: absolute;
  top: 12px;
  left: 12px;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(12px);
  color: rgba(255, 255, 255, 0.75);
  padding: 4px 10px;
  font-size: 11px;
  font-weight: 500;
  border-radius: 9999px;
  z-index: 10;
  display: flex;
  align-items: center;
  gap: 4px;
`;

const CardContent = styled.div`
  padding: 24px;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  position: relative;
  z-index: 1;
`;

const ContentInner = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  transform-origin: bottom left;
  transition: all 0.3s ease;

  @media (max-width: 1024px) {
    transform: none !important;
  }
`;

const ScoreDisplay = styled.div`
  margin-bottom: 8px;
  display: flex;
  align-items: flex-end;
`;

const ScoreValue = styled.span<{ $category: 'excellent' | 'good' | 'fair' | 'poor' }>`
  font-size: 48px;
  font-weight: 700;
  color: ${({ $category }) => {
    switch ($category) {
      case 'excellent':
        return 'var(--primary-500)';
      case 'good':
        return '#2A57A0';
      case 'fair':
        return '#EAB308';
      case 'poor':
        return '#F97316';
    }
  }};
  line-height: 1;

  &::after {
    content: '%';
    font-size: 24px;
    margin-left: 2px;
    opacity: 0.7;
  }

  @media (max-width: 640px) {
    font-size: 40px;

    &::after {
      font-size: 20px;
    }
  }
`;

const OriginalScore = styled.span`
  font-size: 28px;
  font-weight: 600;
  color: var(--text-secondary);
  text-decoration: line-through;
  opacity: 0.5;
  margin-right: 8px;
  line-height: 1;
  align-self: flex-end;
  padding-bottom: 4px;

  @media (max-width: 640px) {
    font-size: 24px;
  }
`;

const ReportTitle = styled.h3`
  font-size: 18px;
  font-weight: 600;
  color: var(--text-color);
  margin-top: 4px;

  @media (max-width: 640px) {
    font-size: 16px;
  }
`;

const ReportMeta = styled.p`
  color: var(--text-secondary);
  font-size: 14px;
  line-height: 1.4;
  margin-top: 2px;
`;

const MetaRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 12px;
`;

const MetaItem = styled.span`
  font-size: 13px;
  color: var(--text-secondary);
  display: flex;
  align-items: center;
  gap: 4px;
`;

const MetaItemProOrFree = styled.span<{ $isPro?: boolean }>`
  font-size: 13px;
  color: ${({ $isPro }) => $isPro ? '#FF7A73' : 'var(--text-secondary)'};
  display: flex;
  align-items: center;
  gap: 4px;
`;

const CTAContainer = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px;
  transform: translateY(100%);
  opacity: 0;
  transition: all 0.3s ease;
  background: linear-gradient(to top, rgba(30, 30, 40, 0.95) 60%, transparent);

  @media (max-width: 768px) {
    padding: 0;
    transform: translateY(0);
    opacity: 1;
    position: relative;
    padding-top: 16px;
    background: none;
  }
`;

const CTALink = styled.span`
  display: flex;
  align-items: center;
  gap: 6px;
  color: var(--accent);
  font-weight: 500;
  font-size: 14px;

  &:hover {
    text-decoration: underline;
  }
`;

const CardActions = styled.div`
  display: flex;
  gap: 8px;
`;

const ActionButton = styled.button<{ $variant?: 'danger' }>`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px 12px;
  border: none;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  background: transparent;
  color: var(--text-secondary);

  &:hover {
    background: rgba(var(--accent-rgb), 0.1);
    color: var(--accent);
  }

  ${({ $variant }) =>
    $variant === 'danger' &&
    `
    &:hover {
      background: rgba(239, 68, 68, 0.1);
      color: #ef4444;
    }
  `}
`;

const Overlay = styled.div`
  pointer-events: none;
  position: absolute;
  inset: 0;
  transition: all 0.3s ease;
`;

// Background Animation Components
const floatAnimation = keyframes`
  0%, 100% { transform: translateY(0) rotate(0deg); opacity: 0.6; }
  50% { transform: translateY(-8px) rotate(2deg); opacity: 0.8; }
`;

const fadeInUp = keyframes`
  0% { opacity: 0; transform: translateY(10px); }
  100% { opacity: 1; transform: translateY(0); }
`;

const scrollText = keyframes`
  0% { transform: translateY(0); }
  100% { transform: translateY(-50%); }
`;

const ReportCardBackgroundWrapper = styled.div`
  position: absolute;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
  /* Fade bottom — preview frame is at top-right */
  mask-image: linear-gradient(to top, transparent 35%, #000 100%);
  -webkit-mask-image: linear-gradient(to top, transparent 35%, #000 100%);
`;

const KeywordContainer = styled.div`
  position: absolute;
  top: 12px;
  left: 12px;
  right: 80px;
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  opacity: 0.5;
`;

const KeywordBadge = styled.span<{ $delay: number }>`
  display: inline-block;
  padding: 4px 8px;
  font-size: 9px;
  font-weight: 500;
  background: rgba(var(--accent-rgb), 0.08);
  color: var(--text-secondary);
  border-radius: 4px;
  border: 1px solid rgba(var(--accent-rgb), 0.1);
  animation: ${fadeInUp} 0.4s ease-out forwards;
  animation-delay: ${({ $delay }) => $delay}s;
  opacity: 0;
`;

const SummaryScrollContainer = styled.div`
  position: absolute;
  top: 50px;
  left: 12px;
  right: 12px;
  bottom: 60px;
  overflow: hidden;
  opacity: 0.15;
`;

const SummaryText = styled.div`
  font-size: 10px;
  line-height: 1.6;
  color: var(--text-secondary);
  animation: ${scrollText} 20s linear infinite;

  &:hover {
    animation-play-state: paused;
  }
`;

const SummaryTextDuplicate = styled.div`
  font-size: 10px;
  line-height: 1.6;
  color: var(--text-secondary);
`;

interface ReportCardBackgroundProps {
  keywords?: string[];
  summary?: string;
}

/* ── Document preview frame (same as CV + Jobs cards) ── */
const ReportPreviewContainer = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;
  width: 140px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  z-index: 2;

  @media (max-width: 640px) {
    width: 120px;
    right: 8px;
  }
`;

const ReportPreviewCard = styled.div<{ $delay: number }>`
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  padding: 10px;
  animation: ${fadeInUp} 0.5s ease-out forwards;
  animation-delay: ${({ $delay }) => $delay}s;
  opacity: 0;
  filter: blur(0.4px);
  transition: all 0.2s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
`;

const ReportPreviewSection = styled.div`
  margin-bottom: 6px;
  &:last-child { margin-bottom: 0; }
`;

const ReportPreviewSectionTitle = styled.div`
  font-size: 7px;
  font-weight: 700;
  color: var(--accent);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 3px;
`;

const ReportPreviewLine = styled.div<{ $width?: string }>`
  height: 4px;
  width: ${({ $width }) => $width || '100%'};
  background: linear-gradient(
    90deg,
    rgba(var(--accent-rgb), 0.15) 0%,
    rgba(var(--accent-rgb), 0.25) 50%,
    rgba(var(--accent-rgb), 0.15) 100%
  );
  background-size: 200% 100%;
  border-radius: 2px;
  margin-bottom: 3px;
  &:last-child { margin-bottom: 0; }
`;

const ReportCardBackground = ({ keywords, summary }: ReportCardBackgroundProps) => {
  const displayKeywords = keywords?.slice(0, 5) || [];
  const summaryText = summary || '';

  return (
    <ReportCardBackgroundWrapper>
      {/* Document preview frame — top right */}
      <ReportPreviewContainer>
        <ReportPreviewCard $delay={0}>
          <ReportPreviewSection>
            <ReportPreviewSectionTitle>Match Score</ReportPreviewSectionTitle>
            <ReportPreviewLine $width="85%" />
            <ReportPreviewLine $width="60%" />
          </ReportPreviewSection>
          <ReportPreviewSection>
            <ReportPreviewSectionTitle>Keywords</ReportPreviewSectionTitle>
            <ReportPreviewLine />
            <ReportPreviewLine $width="75%" />
            <ReportPreviewLine $width="50%" />
          </ReportPreviewSection>
        </ReportPreviewCard>

        <ReportPreviewCard $delay={0.15}>
          <ReportPreviewSection>
            <ReportPreviewSectionTitle>Skills</ReportPreviewSectionTitle>
            <ReportPreviewLine $width="90%" />
            <ReportPreviewLine $width="65%" />
          </ReportPreviewSection>
          <ReportPreviewSection>
            <ReportPreviewSectionTitle>Experience</ReportPreviewSectionTitle>
            <ReportPreviewLine $width="80%" />
            <ReportPreviewLine $width="55%" />
          </ReportPreviewSection>
        </ReportPreviewCard>
      </ReportPreviewContainer>

      {/* Keyword badges — left side */}
      {displayKeywords.length > 0 && (
        <KeywordContainer style={{ right: '160px' }}>
          {displayKeywords.map((keyword, idx) => (
            <KeywordBadge key={idx} $delay={idx * 0.1}>
              {keyword}
            </KeywordBadge>
          ))}
        </KeywordContainer>
      )}

      {summaryText && (
        <SummaryScrollContainer style={{ right: '160px' }}>
          <SummaryText>
            {summaryText}
            <SummaryTextDuplicate>
              {summaryText}
            </SummaryTextDuplicate>
          </SummaryText>
        </SummaryScrollContainer>
      )}
    </ReportCardBackgroundWrapper>
  );
};

const FAB = styled.button`
  position: fixed;
  bottom: 32px;
  right: 32px;
  width: 60px;
  height: 60px;
  border-radius: 9999px;
  z-index: 90;

  background: linear-gradient(
    180deg,
    rgba(255, 255, 255, 0.22) 0%,
    rgba(255, 255, 255, 0.0) 100%
  ), rgba(220, 60, 60, 0.38);
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.22s cubic-bezier(0.16, 1, 0.3, 1);
  box-shadow:
    inset 0 1.5px 0 rgba(255, 255, 255, 0.55),
    0 8px 32px rgba(220, 60, 60, 0.5),
    0 2px 8px rgba(0, 0, 0, 0.25);

  &:hover {
    transform: scale(1.08) translateY(-3px);
    background: linear-gradient(
      180deg,
      rgba(255, 255, 255, 0.3) 0%,
      rgba(255, 255, 255, 0.0) 100%
    ), rgba(230, 70, 70, 0.58);
    box-shadow:
      inset 0 1.5px 0 rgba(255, 255, 255, 0.65),
      0 16px 48px rgba(220, 60, 60, 0.55),
      0 4px 16px rgba(0, 0, 0, 0.3);
  }

  &:active { transform: scale(0.96); }

  svg {
    width: 26px;
    height: 26px;
    filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.3));
  }

  @media (max-width: 768px) {
    bottom: 24px;
    right: 20px;
    width: 56px;
    height: 56px;
  }
`;

const PlusIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={2.5}
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 4.5v15m7.5-7.5h-15"
    />
  </svg>
);

interface Report {
  id: string;
  fit_score: number;
  summary_free: string;
  keywords: {
    missing?: string[];
  } | null;
  pro: boolean;
  created_at: string;
  job_ids: string[];
  optimized_score: number | null;

}

export default function ReportsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [reports, setReports] = useState<Report[]>([]);
  const [jobTitlesMap, setJobTitlesMap] = useState<Record<string, string>>({});
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [reportToDelete, setReportToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [activeTab, setActiveTab] = useState<ReportTabType>('all');
  const { user } = useAuth();
  const router = useRouter();
  const toast = useToast();

  useEffect(() => {
    async function fetchReports() {
      if (!user) return;

      const supabase = createClient();
      const { data } = await supabase
        .from("reports")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (data) {
        setReports(data);

        // Collect all unique job IDs from all reports
        const allJobIds = new Set<string>();
        data.forEach((report) => {
          if (report.job_ids && Array.isArray(report.job_ids)) {
            report.job_ids.forEach((id: string) => allJobIds.add(id));
          }
        });

        // Fetch all job titles in one query
        if (allJobIds.size > 0) {
          const { data: jobDocs } = await supabase
            .from("documents")
            .select("id, title")
            .in("id", Array.from(allJobIds))
            .eq("type", "job");

          if (jobDocs) {
            const titlesMap: Record<string, string> = {};
            jobDocs.forEach((doc) => {
              titlesMap[doc.id] = doc.title;
            });
            setJobTitlesMap(titlesMap);
          }
        }
      }

      setIsLoading(false);
    }

    fetchReports();
  }, [user]);

  const handleDeleteClick = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setReportToDelete(id);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!reportToDelete) return;

    setIsDeleting(true);
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from("reports")
        .delete()
        .eq("id", reportToDelete)
        .eq("user_id", user?.id);

      if (error) throw error;

      toast.success("Report deleted successfully!");
      setReports(reports.filter(report => report.id !== reportToDelete));
      setDeleteModalOpen(false);
      setReportToDelete(null);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to delete report";
      toast.error(errorMessage);
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return <ReportsListSkeleton />;
  }

  return (
    <Container>
      <Header>
        <TitleElements>
          <Title>Job Match & Optimize</Title>
          <Subtitle>Analyze how well your resume matches a job posting and generate a targeted version to boost your chances.</Subtitle>
        </TitleElements>
        <CreditsCardWrapper>
          <CreditsCard />
        </CreditsCardWrapper>
      </Header>

      {reports.length === 0 ? (
        <EmptyHero>
          {/* Ambient floating orbs */}
          <OrbA />
          <OrbB />
          {/* Top specular line */}
          <HeroSpecular />

          {/* Central icon badge */}
          <HeroIconBadge>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 17H7A5 5 0 0 1 7 7h2" />
              <path d="M15 7h2a5 5 0 1 1 0 10h-2" />
              <line x1="8" y1="12" x2="16" y2="12" />
            </svg>
          </HeroIconBadge>

          <HeroTitle>Analyze your first job match</HeroTitle>
          <HeroSubtitle>
            Upload your CV, paste a job posting, and let AI score how well you match — then generate a tailored version that gets past ATS filters.
          </HeroSubtitle>

          {/* 3-step how it works */}
          <StepsRow>
            <Step>
              <StepNum $n={1}>1</StepNum>
              <StepText>Upload your CV or choose an existing one</StepText>
            </Step>
            <StepConnector />
            <Step>
              <StepNum $n={2}>2</StepNum>
              <StepText>Paste a job posting or pick from saved jobs</StepText>
            </Step>
            <StepConnector />
            <Step>
              <StepNum $n={3}>3</StepNum>
              <StepText>Get your AI match score & optimized CV</StepText>
            </Step>
          </StepsRow>

          {/* CTAs */}
          <HeroCTARow>
            <HeroCTAButton onClick={() => router.push(ROUTES.APP.ANALYZE)}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              Start New Analysis
            </HeroCTAButton>
            <HeroCTASecondary onClick={() => router.push(ROUTES.APP.JOBS)}>
              Browse job postings
            </HeroCTASecondary>
          </HeroCTARow>
        </EmptyHero>
      ) : (

        <ContentSection>
          {/* ── Tab bar ── */}
          <ContentHeader>
            <TabContainer>
              <TabButton $active={activeTab === 'all'} onClick={() => setActiveTab('all')}>
                All
                <TabCount $active={activeTab === 'all'}>{reports.length}</TabCount>
              </TabButton>

              {reports.filter(r => (r.optimized_score ?? r.fit_score) >= 85).length > 0 && (
                <TabButton $active={activeTab === 'excellent'} onClick={() => setActiveTab('excellent')}>
                  Excellent
                  <TabCount $active={activeTab === 'excellent'}>
                    {reports.filter(r => (r.optimized_score ?? r.fit_score) >= 85).length}
                  </TabCount>
                </TabButton>
              )}

              {reports.filter(r => { const s = r.optimized_score ?? r.fit_score; return s >= 70 && s < 85; }).length > 0 && (
                <TabButton $active={activeTab === 'good'} onClick={() => setActiveTab('good')}>
                  Good
                  <TabCount $active={activeTab === 'good'}>
                    {reports.filter(r => { const s = r.optimized_score ?? r.fit_score; return s >= 70 && s < 85; }).length}
                  </TabCount>
                </TabButton>
              )}

              {reports.filter(r => { const s = r.optimized_score ?? r.fit_score; return s >= 50 && s < 70; }).length > 0 && (
                <TabButton $active={activeTab === 'fair'} onClick={() => setActiveTab('fair')}>
                  Fair
                  <TabCount $active={activeTab === 'fair'}>
                    {reports.filter(r => { const s = r.optimized_score ?? r.fit_score; return s >= 50 && s < 70; }).length}
                  </TabCount>
                </TabButton>
              )}

              {reports.filter(r => (r.optimized_score ?? r.fit_score) < 50).length > 0 && (
                <TabButton $active={activeTab === 'poor'} onClick={() => setActiveTab('poor')}>
                  Poor
                  <TabCount $active={activeTab === 'poor'}>
                    {reports.filter(r => (r.optimized_score ?? r.fit_score) < 50).length}
                  </TabCount>
                </TabButton>
              )}
            </TabContainer>
          </ContentHeader>

          {/* ── Filtered grid ── */}
          <ContentBody>
            {(() => {
              const getDisplayScore = (r: Report) => r.optimized_score ?? r.fit_score;
              const filtered =
                activeTab === 'all'       ? reports
                : activeTab === 'excellent' ? reports.filter(r => getDisplayScore(r) >= 85)
                : activeTab === 'good'     ? reports.filter(r => { const s = getDisplayScore(r); return s >= 70 && s < 85; })
                : activeTab === 'fair'     ? reports.filter(r => { const s = getDisplayScore(r); return s >= 50 && s < 70; })
                :                           reports.filter(r => getDisplayScore(r) < 50);

              if (filtered.length === 0) {
                return <TabEmptyState>No {activeTab} reports yet.</TabEmptyState>;
              }

              return (
                <ReportsGrid>
                  {filtered.map(report => {
                    const jobTitles = report.job_ids
                      ?.map(id => jobTitlesMap[id])
                      .filter(Boolean)
                      .join(' • ');
                    const s = getDisplayScore(report);
                    const cat = s >= 85 ? 'excellent' : s >= 70 ? 'good' : s >= 50 ? 'fair' : 'poor';

                    return (
                      <ReportCard
                        key={report.id}
                        onClick={() => router.push(ROUTES.APP.REPORT_DETAIL(report.id))}
                      >
                        <ReportCardBackground
                          keywords={report.keywords?.missing}
                          summary={report.summary_free}
                        />


                        <CardContent>
                          <ContentInner className="report-content">
                            <ScoreDisplay>
                              {report.optimized_score != null && report.optimized_score !== report.fit_score && (
                                <OriginalScore>{report.fit_score}%</OriginalScore>
                              )}
                              <ScoreValue $category={cat}>{s}</ScoreValue>
                            </ScoreDisplay>
                            <ReportTitle>{jobTitles || 'CV Analysis Report'}</ReportTitle>
                            <ReportMeta>
                              {new Date(report.created_at).toLocaleDateString('en-US', {
                                year: 'numeric', month: 'long', day: 'numeric',
                              })}
                            </ReportMeta>
                            <MetaRow>
                              <MetaItem>{report.keywords?.missing?.length || 0} missing keywords</MetaItem>
                              <MetaItemProOrFree $isPro={report.pro}>
                                {report.pro ? 'Pro' : 'Free'}
                              </MetaItemProOrFree>
                            </MetaRow>
                          </ContentInner>

                          <CTAContainer className="report-cta" onClick={e => e.stopPropagation()}>
                            <CTALink>
                              View Details
                              <ArrowRightIcon />
                            </CTALink>
                            <CardActions>
                              <ActionButton
                                $variant="danger"
                                onClick={e => handleDeleteClick(report.id, e)}
                              >
                                <DeleteIcon />
                              </ActionButton>
                            </CardActions>
                          </CTAContainer>
                        </CardContent>

                        <Overlay className="report-overlay" />
                      </ReportCard>
                    );
                  })}
                </ReportsGrid>
              );
            })()}
          </ContentBody>
        </ContentSection>
      )}

      <FAB onClick={() => router.push(ROUTES.APP.ANALYZE)}>
        <PlusIcon />
      </FAB>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={() => !isDeleting && setDeleteModalOpen(false)}
        title="Delete Report"
        size="sm"
      >
        <Modal.Body>
          <div style={{ padding: '16px 0' }}>
            <p style={{ marginBottom: '12px', fontSize: '15px', lineHeight: '1.6' }}>
              Are you sure you want to delete this report? This action cannot be undone.
            </p>
            <p style={{ color: '#dc2626', fontSize: '14px', fontWeight: 500 }}>
              ⚠️ This will permanently remove all analysis data.
            </p>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="ghost"
            onClick={() => setDeleteModalOpen(false)}
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleDeleteConfirm}
            isLoading={isDeleting}
            style={{
              background: 'linear-gradient(135deg, #dc2626 0%, #991b1b 100%)',
              border: 'none',
            }}
          >
            {isDeleting ? 'Deleting...' : 'Delete Report'}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}
