"use client";

import { useState, useEffect, useCallback } from "react";
import styled, { keyframes } from "styled-components";
import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/Spinner";
import { useToast } from "@/contexts/ToastContext";
import { useCredits } from "@/contexts/CreditsContext";
import { Modal } from "@/components/ui/Modal";
import { EmptyState } from "@/components/ui/EmptyState";
import { Card } from "@/components/ui/Card";
import { CoverLetterGenerator } from "@/components/features/CoverLetterGenerator";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/lib/constants";
import { CreditsCard } from "@/components/dashboard/CreditsCard";

// Icons
const ViewIcon = () => (
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
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const CopyIcon = () => (
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
    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
  </svg>
);

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

const EnvelopeIcon = ({ size = "64" }: { size?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    style={{
      width: `${size}px`,
      height: `${size}px`,
      display: "inline-block",
    }}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
    />
  </svg>
);

const CheckCircleIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={2}
    stroke="currentColor"
    style={{
      width: "20px",
      height: "20px",
      display: "inline-block",
      verticalAlign: "middle",
    }}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 36px ${({ theme }) => theme.spacing["2xl"]} 120px;

  @media (max-width: 768px) {
    padding: 70px 16px 120px;
  }
`;

const TwoColumnLayout = styled.div`
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: 20px;
  align-items: start;

  @media (max-width: 1200px) {
    grid-template-columns: 1fr;
  }

  @media (max-width: 768px) {
    gap: 16px;
  }
`;

const ColumnDivider = styled.div`
  width: 1px;
  height: 100%;
  min-height: 500px;
  background: linear-gradient(
    to bottom,
    transparent 0%,
    ${({ theme }) => theme.colors.border} 5%,
    ${({ theme }) => theme.colors.border} 95%,
    transparent 100%
  );

  @media (max-width: 1200px) {
    display: none;
  }
`;

const Column = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
`;

const ColumnHeader = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const Header = styled.div`
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 16px;
  margin-bottom: ${({ theme }) => theme.spacing["xl"]};
`;

const TitleElements = styled.div``;

const Title = styled.h1`
  font-size: 34px;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.97);
  margin-bottom: 8px;
  letter-spacing: -0.04em;
  line-height: 1.1;

  @media (max-width: 768px) {
    font-size: 26px;
  }
`;

const CreditsCardWrapper = styled.div`
  flex-shrink: 0;
  padding-top: 4px;
`;

const Description = styled.p`
  font-size: 15px;
  color: rgba(255, 255, 255, 0.4);
  line-height: 1.6;
  letter-spacing: -0.01em;
  max-width: 580px;
`;

/* ── Liquid Glass column section wrapper (same pattern as Reports/ATS) ── */
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
  padding: 16px 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
`;

const ContentBody = styled.div`
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const SectionTitle = styled.h2`
  font-size: 15px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.85);
  letter-spacing: -0.02em;
`;

const SectionDescription = styled.p`
  font-size: 12px;
  color: rgba(255, 255, 255, 0.35);
`;

/* ── Report filter tab strip (horizontal SCROLL) ── */
const ReportFilterStrip = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 10px;
  overflow-x: auto;
  padding-bottom: 6px;
  margin-bottom: 28px;
  scrollbar-width: none;
  &::-webkit-scrollbar { display: none; }
`;

/* "All Reports" hub tab — visually distinct from individual report tabs */
const AllReportsTab = styled.button<{ $isActive: boolean }>`
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 6px;
  width: 80px;
  height: 80px;
  border-radius: 22px;
  cursor: pointer;
  position: relative;
  transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);

  /* distinct: soft white glass pill */
  background: ${({ $isActive }) => $isActive
    ? 'rgba(255,255,255,0.18)'
    : 'rgba(255,255,255,0.06)'};
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  border: 1px solid ${({ $isActive }) => $isActive
    ? 'rgba(255,255,255,0.40)'
    : 'rgba(255,255,255,0.12)'};
  box-shadow: ${({ $isActive }) => $isActive
    ? '0 4px 20px rgba(255,255,255,0.10), inset 0 1px 0 rgba(255,255,255,0.5)'
    : '0 2px 8px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.15)'};

  &:hover {
    transform: translateY(-2px);
    background: rgba(255,255,255,0.14);
    border-color: rgba(255,255,255,0.28);
  }

  /* Grid icon svg inside */
  svg {
    width: 22px;
    height: 22px;
    color: ${({ $isActive }) => $isActive ? 'rgba(255,255,255,0.95)' : 'rgba(255,255,255,0.50)'};
    transition: color 0.2s ease;
  }
`;

const AllReportsLabel = styled.span<{ $isActive: boolean }>`
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: ${({ $isActive }) => $isActive ? 'rgba(255,255,255,0.90)' : 'rgba(255,255,255,0.35)'};
  transition: color 0.2s ease;
`;

const AllReportsCount = styled.span`
  position: absolute;
  top: -5px;
  right: -5px;
  min-width: 18px;
  height: 18px;
  padding: 0 4px;
  border-radius: 9999px;
  background: var(--accent);
  border: 2px solid rgba(12, 12, 18, 0.9);
  font-size: 9px;
  font-weight: 800;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ReportFilterTab = styled.button<{ $isActive: boolean; $hasLetters: boolean }>`
  flex-shrink: 0;
  min-width: 180px;
  max-width: 220px;
  padding: 14px 16px;
  border-radius: 18px;
  cursor: pointer;
  text-align: left;
  transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
  position: relative;
  overflow: hidden;

  background: ${({ $isActive }) => $isActive
    ? 'rgba(var(--accent-rgb), 0.13)'
    : 'rgba(30, 30, 40, 0.72)'};
  backdrop-filter: blur(24px) saturate(160%);
  -webkit-backdrop-filter: blur(24px) saturate(160%);
  border: 1px solid ${({ $isActive }) => $isActive
    ? 'rgba(var(--accent-rgb), 0.40)'
    : 'rgba(255,255,255,0.10)'};
  box-shadow:
    0 2px 1px rgba(255,255,255,0.05) inset,
    0 6px 24px rgba(0,0,0,0.45);

  /* Specular top line when active */
  ${({ $isActive }) => $isActive && `
    &::after {
      content: '';
      position: absolute;
      top: 0; left: 15%; right: 15%;
      height: 1px;
      background: linear-gradient(90deg, transparent, rgba(255,255,255,0.45) 50%, transparent);
    }
  `}

  &:hover {
    transform: translateY(-3px);
    border-color: rgba(255,255,255,0.20);
    box-shadow:
      0 2px 1px rgba(255,255,255,0.07) inset,
      0 12px 36px rgba(0,0,0,0.55);
  }
`;

const ReportTabTop = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
`;

const ReportTabScore = styled.span<{ $category: 'excellent' | 'good' | 'needsWork' }>`
  font-size: 22px;
  font-weight: 800;
  line-height: 1;
  color: ${({ $category }) => {
    switch ($category) {
      case 'excellent': return 'var(--primary-500)';
      case 'good':      return '#3b82f6';
      case 'needsWork': return '#f97316';
    }
  }};
  &::after { content: '%'; font-size: 12px; margin-left: 1px; opacity: 0.7; }
`;

const ReportTabLetterCount = styled.span<{ $count: number }>`
  font-size: 9px;
  font-weight: 700;
  padding: 2px 7px;
  border-radius: 9999px;
  letter-spacing: 0.03em;
  background: ${({ $count }) => $count > 0
    ? 'rgba(16, 185, 129, 0.18)'
    : 'rgba(255,255,255,0.05)'};
  border: 1px solid ${({ $count }) => $count > 0
    ? 'rgba(16, 185, 129, 0.35)'
    : 'rgba(255,255,255,0.08)'};
  color: ${({ $count }) => $count > 0 ? '#34d399' : 'rgba(255,255,255,0.25)'};
`;

const ReportTabTitle = styled.div`
  font-size: 12px;
  font-weight: 600;
  color: rgba(255,255,255,0.80);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  letter-spacing: -0.01em;
`;

const ReportTabGenerateBtn = styled.div`
  margin-top: 10px;
  font-size: 10px;
  font-weight: 600;
  color: var(--accent);
  opacity: 0.75;
  letter-spacing: 0.02em;
  display: flex;
  align-items: center;
  gap: 4px;
  text-transform: uppercase;
`;

/* ── Cover letter grid: 3 columns desktop ── */
const LetterGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 14px;

  @media (max-width: 1100px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 680px) {
    grid-template-columns: 1fr;
  }
`;

/* Source report tag on letter cards */
const LetterSourceTag = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: 9.5px;
  font-weight: 600;
  color: rgba(255,255,255,0.35);
  letter-spacing: 0.02em;
  margin-bottom: 4px;
  &::before {
    content: '';
    display: block;
    width: 5px;
    height: 5px;
    border-radius: 50%;
    background: var(--accent);
    opacity: 0.5;
  }
`;

/* Filter active bar */
const FilterBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding: 8px 14px;
  border-radius: 10px;
  background: rgba(var(--accent-rgb), 0.07);
  border: 1px solid rgba(var(--accent-rgb), 0.18);
  font-size: 12px;
  color: var(--accent);
  font-weight: 500;
`;

const FilterClearButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: rgba(255,255,255,0.4);
  font-size: 11px;
  padding: 2px 8px;
  border-radius: 6px;
  transition: all 0.15s ease;
  &:hover { color: rgba(255,255,255,0.8); background: rgba(255,255,255,0.07); }
`;

/* FAB for generate new */
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
    rgba(255,255,255,0.22) 0%,
    rgba(255,255,255,0.0) 100%
  ), rgba(var(--accent-rgb), 0.38);
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  border: 1px solid rgba(255,255,255,0.3);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.22s cubic-bezier(0.16, 1, 0.3, 1);
  box-shadow:
    inset 0 1.5px 0 rgba(255,255,255,0.55),
    0 8px 32px rgba(var(--accent-rgb), 0.4),
    0 2px 8px rgba(0,0,0,0.25);
  &:hover {
    transform: scale(1.08) translateY(-3px);
    box-shadow:
      inset 0 1.5px 0 rgba(255,255,255,0.65),
      0 16px 48px rgba(var(--accent-rgb), 0.5),
      0 4px 16px rgba(0,0,0,0.3);
  }
  &:active { transform: scale(0.96); }
  svg { width: 26px; height: 26px; filter: drop-shadow(0 1px 2px rgba(0,0,0,0.3)); }
  @media (max-width: 768px) {
    bottom: 24px; right: 20px; width: 56px; height: 56px;
  }
`;

const PlusIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

// Mini Report Card Animations (matching reports page style)
const floatAnimationMini = keyframes`
  0%, 100% { transform: translateY(0) rotate(0deg); opacity: 0.5; }
  50% { transform: translateY(-4px) rotate(1deg); opacity: 0.7; }
`;

const fadeInUpMini = keyframes`
  0% { opacity: 0; transform: translateY(6px); }
  100% { opacity: 1; transform: translateY(0); }
`;

const scrollTextMini = keyframes`
  0% { transform: translateY(0); }
  100% { transform: translateY(-50%); }
`;

// Mini Report Card Styled Components (matching reports page style - compact version)
const MiniReportCard = styled.div<{ $isPremium: boolean; $isActive?: boolean; $hasLetters?: boolean }>`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  overflow: hidden;
  border-radius: 16px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  min-height: 140px;

  /* Liquid Glass card */
  background: ${({ $isActive }) => $isActive
    ? 'rgba(var(--accent-rgb), 0.15)'
    : 'rgba(30, 30, 40, 0.78)'};
  backdrop-filter: blur(30px) saturate(160%);
  -webkit-backdrop-filter: blur(30px) saturate(160%);
  border: 1px solid ${({ $isActive }) => $isActive
    ? 'rgba(var(--accent-rgb), 0.45)'
    : 'rgba(255, 255, 255, 0.14)'};
  box-shadow:
    0 2px 1px rgba(255, 255, 255, 0.06) inset,
    0 8px 32px rgba(0, 0, 0, 0.55),
    0 2px 8px rgba(0, 0, 0, 0.4);

  &:hover {
    transform: translateY(-4px) scale(1.01);
    border-color: rgba(255, 255, 255, 0.22);
    box-shadow:
      0 2px 1px rgba(255, 255, 255, 0.08) inset,
      0 16px 48px rgba(0, 0, 0, 0.65),
      0 4px 16px rgba(0, 0, 0, 0.45);
  }

  &:hover .mini-report-content { transform: translateY(-24px); }
  &:hover .mini-report-cta { transform: translateY(0); opacity: 1; }

  @media (max-width: 1024px) {
    &:hover .mini-report-content { transform: none; }
  }
`;

const MiniReportProBadge = styled.div`
  position: absolute;
  top: 8px;
  right: 8px;
  color: var(--accent);
  padding: 3px 8px;
  font-size: 9px;
  font-weight: 600;
  border-radius: 4px;
  z-index: 10;
  letter-spacing: 0.5px;
`;

const MiniReportCardContent = styled.div`
  padding: 16px;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  position: relative;
  z-index: 1;
`;

const MiniReportContentInner = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  transform-origin: bottom left;
  transition: all 0.3s ease;

  @media (max-width: 1024px) {
    transform: none !important;
  }
`;

const MiniReportScoreDisplay = styled.div`
  margin-bottom: 4px;
`;

const MiniReportScoreValue = styled.span<{ $category: 'excellent' | 'good' | 'needsWork' }>`
  font-size: 32px;
  font-weight: 700;
  color: ${({ $category }) => {
    switch ($category) {
      case 'excellent':
        return 'var(--primary-500)';
      case 'good':
        return '#2a57a0ff';
      case 'needsWork':
        return '#f97316';
    }
  }};
  line-height: 1;

  &::after {
    content: '%';
    font-size: 16px;
    margin-left: 1px;
    opacity: 0.7;
  }
`;

const MiniReportTitle = styled.h3`
  font-size: 13px;
  font-weight: 600;
  color: var(--text-color);
  margin-top: 2px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const MiniReportMeta = styled.p`
  color: var(--text-secondary);
  font-size: 11px;
  line-height: 1.3;
  margin-top: 2px;
`;

const MiniReportCTAContainer = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding: 12px 16px;
  transform: translateY(100%);
  opacity: 0;
  transition: all 0.3s ease;
  background: linear-gradient(to top, rgba(30, 30, 40, 0.95) 60%, transparent);

  @media (max-width: 768px) {
    transform: translateY(0);
    opacity: 1;
    position: relative;
    padding: 10px 0 0 0;
    background: none;
  }
`;

const MiniReportCTALink = styled.span`
  display: flex;
  align-items: center;
  gap: 4px;
  color: var(--accent);
  font-weight: 500;
  font-size: 12px;

  &:hover {
    text-decoration: underline;
  }
`;

const MiniReportOverlay = styled.div`
  pointer-events: none;
  position: absolute;
  inset: 0;
  transition: all 0.3s ease;
`;

// Mini Report Card Background Components
const MiniReportCardBackgroundWrapper = styled.div`
  position: absolute;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
  mask-image: linear-gradient(to bottom, #000 0%, #000 30%, transparent 100%);
  -webkit-mask-image: linear-gradient(to bottom, #000 0%, #000 30%, transparent 100%);
`;

const MiniReportKeywordContainer = styled.div`
  position: absolute;
  top: 8px;
  left: 8px;
  right: 50px;
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  opacity: 0.4;
`;

const MiniReportKeywordBadge = styled.span<{ $delay: number }>`
  display: inline-block;
  padding: 2px 5px;
  font-size: 7px;
  font-weight: 500;
  background: rgba(var(--accent-rgb), 0.08);
  color: var(--text-secondary);
  border-radius: 3px;
  border: 1px solid rgba(var(--accent-rgb), 0.1);
  animation: ${fadeInUpMini} 0.3s ease-out forwards;
  animation-delay: ${({ $delay }) => $delay}s, ${({ $delay }) => $delay + 0.3}s;
  opacity: 0;
`;

const MiniReportSummaryScrollContainer = styled.div`
  position: absolute;
  top: 30px;
  left: 8px;
  right: 8px;
  bottom: 40px;
  overflow: hidden;
  opacity: 0.12;
`;

const MiniReportSummaryText = styled.div`
  font-size: 8px;
  line-height: 1.5;
  color: var(--text-secondary);
  animation: ${scrollTextMini} 15s linear infinite;
`;

const MiniReportSummaryTextDuplicate = styled.div`
  font-size: 8px;
  line-height: 1.5;
  color: var(--text-secondary);
`;

// Arrow icon for CTA
const ArrowRightIconMini = () => (
  <svg
    width="10"
    height="10"
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

interface MiniReportCardBackgroundProps {
  cvTitle?: string;
}

const MiniReportCardBackground = ({ cvTitle }: MiniReportCardBackgroundProps) => {
  const keywords = cvTitle ? cvTitle.split(/[\s_\-\.]+/).slice(0, 3) : [];

  return (
    <MiniReportCardBackgroundWrapper>
      {keywords.length > 0 && (
        <MiniReportKeywordContainer>
          {keywords.map((keyword, idx) => (
            <MiniReportKeywordBadge key={idx} $delay={idx * 0.08}>
              {keyword}
            </MiniReportKeywordBadge>
          ))}
        </MiniReportKeywordContainer>
      )}
      {cvTitle && (
        <MiniReportSummaryScrollContainer>
          <MiniReportSummaryText>
            {cvTitle}
            <MiniReportSummaryTextDuplicate>
              {cvTitle}
            </MiniReportSummaryTextDuplicate>
          </MiniReportSummaryText>
        </MiniReportSummaryScrollContainer>
      )}
    </MiniReportCardBackgroundWrapper>
  );
};

// Cover Letter Card Animations
const letterScrollAnimation = keyframes`
  0% { transform: translateY(0); }
  100% { transform: translateY(-50%); }
`;

const letterFadeIn = keyframes`
  0% { opacity: 0; transform: translateX(10px); }
  100% { opacity: 1; transform: translateX(0); }
`;

// Cover Letter Card Styles - Matching Report Card Style
const CoverLetterCard = styled.div<{ $tone: string }>`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  overflow: hidden;
  border-radius: 16px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  min-height: 210px;

  /* Liquid Glass card */
  background: rgba(30, 30, 40, 0.78);
  backdrop-filter: blur(30px) saturate(160%);
  -webkit-backdrop-filter: blur(30px) saturate(160%);
  border: 1px solid rgba(255, 255, 255, 0.14);
  box-shadow:
    0 2px 1px rgba(255, 255, 255, 0.06) inset,
    0 8px 32px rgba(0, 0, 0, 0.55),
    0 2px 8px rgba(0, 0, 0, 0.4);

  &:hover {
    transform: translateY(-4px) scale(1.01);
    border-color: rgba(255, 255, 255, 0.22);
    box-shadow:
      0 2px 1px rgba(255, 255, 255, 0.08) inset,
      0 16px 48px rgba(0, 0, 0, 0.65),
      0 4px 16px rgba(0, 0, 0, 0.45);
  }

  &:hover .letter-content { transform: translateY(-28px); }
  &:hover .letter-cta { transform: translateY(0); opacity: 1; }

  @media (max-width: 1024px) {
    &:hover .letter-content { transform: none; }
  }
`;

const CoverLetterToneBadge = styled.div<{ $tone: string }>`
  position: absolute;
  top: 10px;
  right: 12px;
  /* Liquid Glass pill */
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  background: ${({ $tone }) => {
    switch ($tone) {
      case 'professional': return 'rgba(59, 130, 246, 0.12)';
      case 'friendly':     return 'rgba(16, 185, 129, 0.12)';
      case 'formal':       return 'rgba(139, 92, 246, 0.12)';
      default:             return 'rgba(107, 114, 128, 0.12)';
    }
  }};
  border: 1px solid ${({ $tone }) => {
    switch ($tone) {
      case 'professional': return 'rgba(59, 130, 246, 0.25)';
      case 'friendly':     return 'rgba(16, 185, 129, 0.25)';
      case 'formal':       return 'rgba(139, 92, 246, 0.25)';
      default:             return 'rgba(107, 114, 128, 0.25)';
    }
  }};
  color: ${({ $tone }) => {
    switch ($tone) {
      case 'professional': return '#60a5fa';
      case 'friendly':     return '#34d399';
      case 'formal':       return '#a78bfa';
      default:             return '#9ca3af';
    }
  }};
  padding: 4px 10px;
  font-size: 10px;
  font-weight: 600;
  border-radius: 9999px;
  z-index: 10;
  text-transform: capitalize;
`;

const CoverLetterCardContent = styled.div`
  padding: 20px;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  position: relative;
  z-index: 1;
`;

const CoverLetterContentInner = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  transform-origin: bottom left;
  transition: all 0.3s ease;
  max-width: 65%;

  @media (max-width: 1024px) {
    transform: none !important;
    max-width: 100%;
  }
`;

const CoverLetterTitle = styled.h3`
  font-size: 16px;
  font-weight: 600;
  color: var(--text-color);
  margin-top: 4px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const CoverLetterMeta = styled.p`
  color: var(--text-secondary);
  font-size: 12px;
  line-height: 1.4;
  margin-top: 2px;
`;

const CoverLetterMetaRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 8px;
`;

const CoverLetterMetaItem = styled.span`
  font-size: 11px;
  color: var(--text-secondary);
  display: flex;
  align-items: center;
  gap: 4px;
`;

const CoverLetterCTAContainer = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 20px;
  transform: translateY(100%);
  opacity: 0;
  transition: all 0.3s ease;
  background: linear-gradient(to top, rgba(30, 30, 40, 0.95) 60%, transparent);

  @media (max-width: 768px) {
    transform: translateY(0);
    opacity: 1;
    position: relative;
    padding: 10px 0 0 0;
    background: none;
  }
`;

const CoverLetterCTALink = styled.span`
  display: flex;
  align-items: center;
  gap: 5px;
  color: var(--accent);
  font-weight: 500;
  font-size: 13px;

  &:hover {
    text-decoration: underline;
  }
`;

const CoverLetterActions = styled.div`
  display: flex;
  gap: 6px;
`;

const CoverLetterActionButton = styled.button<{ $variant?: 'danger' }>`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 6px 10px;
  border: none;
  border-radius: 6px;
  font-size: 11px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  background: transparent;
  color: var(--text-secondary);
  gap: 4px;

  &:hover {
    background: rgba(255, 255, 255, 0.05);
    color: var(--text-color);
  }

  ${({ $variant }) =>
    $variant === 'danger' &&
    `
    &:hover {
      background: rgba(239, 68, 68, 0.1);
      color: #ef4444;
    }
  `}

  svg {
    width: 12px;
    height: 12px;
  }
`;

const CoverLetterOverlay = styled.div`
  pointer-events: none;
  position: absolute;
  inset: 0;
  transition: all 0.3s ease;
`;

// Cover Letter Card Background Components (right side animation)
const CoverLetterBackgroundWrapper = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  width: 45%;
  overflow: hidden;
  pointer-events: none;
  mask-image: linear-gradient(to left, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.3) 50%, transparent 100%);
  -webkit-mask-image: linear-gradient(to left, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.3) 50%, transparent 100%);
`;

const CoverLetterTextPreview = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;
  bottom: 10px;
  width: calc(100% - 20px);
  overflow: hidden;
  opacity: 0.2;
  animation: ${letterFadeIn} 0.5s ease-out forwards;
`;

const CoverLetterScrollingText = styled.div`
  font-size: 9px;
  line-height: 1.7;
  color: var(--text-secondary);
  animation: ${letterScrollAnimation} 25s linear infinite;
  white-space: pre-wrap;
  word-break: break-word;
`;

const CoverLetterScrollingTextDuplicate = styled.div`
  font-size: 9px;
  line-height: 1.7;
  color: var(--text-secondary);
  white-space: pre-wrap;
  word-break: break-word;
  margin-top: 20px;
`;

interface CoverLetterBackgroundProps {
  content?: string;
}

const CoverLetterBackground = ({ content }: CoverLetterBackgroundProps) => {
  if (!content) return null;

  // Truncate content for preview
  const previewText = content.slice(0, 500);

  return (
    <CoverLetterBackgroundWrapper>
      <CoverLetterTextPreview>
        <CoverLetterScrollingText>
          {previewText}
          <CoverLetterScrollingTextDuplicate>
            {previewText}
          </CoverLetterScrollingTextDuplicate>
        </CoverLetterScrollingText>
      </CoverLetterTextPreview>
    </CoverLetterBackgroundWrapper>
  );
};

// Arrow icon for CTA
const ArrowRightIconLetter = () => (
  <svg
    width="12"
    height="12"
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

const LoadingContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing["3xl"]};
`;

const ModalContent = styled.div`
  padding: ${({ theme }) => theme.spacing.lg};
`;

const ModalText = styled.div`
  white-space: pre-wrap;
  line-height: 1.8;
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  color: ${({ theme }) => theme.colors.textPrimary};
  max-height: 500px;
  overflow-y: auto;
`;

const ModalMetaInfo = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  padding-bottom: ${({ theme }) => theme.spacing.md};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  flex-wrap: wrap;
`;

const MetaItem = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
`;

interface CoverLetter {
  id: string;
  content: string;
  tone: string;
  length: string;
  language: string;
  template?: string;
  created_at: string;
  report_id?: string;
  structured_content?: {
    paragraphs?: Array<{
      id: string;
      type: string;
      content: string;
      rationale: string;
      sentences: Array<{
        id: string;
        text: string;
        isHighlight: boolean;
        alternatives?: string[];
      }>;
    }>;
    keyHighlights?: string[];
    wordCount?: number;
  };
  report?: {
    id: string;
    job?: {
      title: string;
    };
  };
  job?: {
    id: string;
    title: string;
    type: string;
  };
}

interface Report {
  id: string;
  fit_score: number;
  is_premium: boolean;
  created_at: string;
  cv?: {
    title: string;
  };
  job?: {
    title: string;
  };
}

export default function CoverLettersPage() {
  const toast = useToast();
  const router = useRouter();
  const [coverLetters, setCoverLetters] = useState<CoverLetter[]>([]);
  const [reports, setReports] = useState<Report[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedLetter, setSelectedLetter] = useState<CoverLetter | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [letterToDelete, setLetterToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Cover letter generator
  const [selectedReportId, setSelectedReportId] = useState<string | null>(null);
  const [isGeneratorOpen, setIsGeneratorOpen] = useState(false);
  const [isPremiumModalOpen, setIsPremiumModalOpen] = useState(false);
  const [selectedFreeReportId, setSelectedFreeReportId] = useState<string | null>(null);

  // Cover letter editor
  const [selectedLetterForEdit, setSelectedLetterForEdit] = useState<CoverLetter | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);

  // Active report filter (for right column)
  const [filterReportId, setFilterReportId] = useState<string | null>(null);

  // User credits from context
  const { credits: userCredits } = useCredits();

  // Derived values
  const getCoverLetterCount = (reportId: string) =>
    coverLetters.filter(l => l.report_id === reportId).length;

  const filteredCoverLetters = filterReportId
    ? coverLetters.filter(l => l.report_id === filterReportId)
    : coverLetters;

  const filterReport = filterReportId ? reports.find(r => r.id === filterReportId) : null;

  const fetchCoverLetters = useCallback(async () => {
    try {
      const response = await fetch("/api/cover-letters");
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch cover letters");
      }

      setCoverLetters(data.coverLetters || []);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      toast.error(errorMessage);
    }
  }, [toast]);

  const fetchReports = useCallback(async () => {
    try {
      const response = await fetch("/api/reports");
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch reports");
      }

      setReports(data.reports || []);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      toast.error(errorMessage);
    }
  }, [toast]);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      await Promise.all([fetchCoverLetters(), fetchReports()]);
      setIsLoading(false);
    };

    loadData();
  }, [fetchCoverLetters, fetchReports]);

  const handleReportClick = (reportId: string) => {
    const report = reports.find(r => r.id === reportId);
    if (!report) return;

    // Highlight this report and filter the right column
    setFilterReportId(filterReportId === reportId ? null : reportId);

    if (report.is_premium) {
      setSelectedReportId(reportId);
      setIsGeneratorOpen(true);
    } else {
      setSelectedFreeReportId(reportId);
      setIsPremiumModalOpen(true);
    }
  };

  const handleGeneratorClose = () => {
    setIsGeneratorOpen(false);
    // Delay clearing the reportId until after the animation completes
    setTimeout(() => {
      setSelectedReportId(null);
    }, 350); // Slightly longer than ANIMATION_DURATION (300ms) to ensure animation finishes
  };

  const handleGeneratorSuccess = async (letterId?: string) => {
    await fetchCoverLetters();

    // Auto-open the generated cover letter
    if (letterId) {
      const newLetter = coverLetters.find(l => l.id === letterId);
      if (newLetter) {
        setSelectedLetterForEdit(newLetter);
        setIsEditorOpen(true);
      } else {
        // Refetch and find
        const response = await fetch("/api/cover-letters");
        if (response.ok) {
          const data = await response.json();
          const generated = data.coverLetters?.find((l: CoverLetter) => l.id === letterId);
          if (generated) {
            setSelectedLetterForEdit(generated);
            setIsEditorOpen(true);
          }
        }
      }
    }

    handleGeneratorClose();
    toast.success("Cover letter generated successfully!");
  };

  const handleCardClick = (letter: CoverLetter) => {
    setSelectedLetterForEdit(letter);
    setIsEditorOpen(true);
  };

  const handleCopy = () => {
    if (selectedLetter) {
      navigator.clipboard.writeText(selectedLetter.content);
      toast.success("Cover letter copied to clipboard!");
    }
  };

  const handleDownload = () => {
    if (selectedLetter) {
      const blob = new Blob([selectedLetter.content], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `cover_letter_${new Date(selectedLetter.created_at).toLocaleDateString()}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success("Cover letter downloaded!");
    }
  };

  const handleDeleteClick = (id: string) => {
    setLetterToDelete(id);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!letterToDelete) return;

    setIsDeleting(true);
    try {
      const response = await fetch(`/api/cover-letters?id=${letterToDelete}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to delete cover letter");
      }

      toast.success("Cover letter deleted successfully!");
      fetchCoverLetters();
      setDeleteModalOpen(false);
      setLetterToDelete(null);
      setIsModalOpen(false);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      toast.error(errorMessage);
    } finally {
      setIsDeleting(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getWordCount = (text: string) => {
    return text.trim().split(/\s+/).length;
  };

  const getToneLabel = (tone: string) => {
    const labels: Record<string, string> = {
      professional: "Professional",
      friendly: "Friendly",
      formal: "Formal",
    };
    return labels[tone] || tone;
  };

  const getLanguageLabel = (lang: string) => {
    const labels: Record<string, string> = {
      en: "English",
      tr: "Turkish",
    };
    return labels[lang] || lang;
  };

  if (isLoading) {
    return (
      <Container>
        <LoadingContainer>
          <Spinner size="xl" />
        </LoadingContainer>
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <TitleElements>
          <Title>Cover Letters</Title>
          <Description>
            Generate AI-powered cover letters from your reports and manage your applications.
          </Description>
        </TitleElements>
        <CreditsCardWrapper>
          <CreditsCard />
        </CreditsCardWrapper>
      </Header>

      {/* ── Report tab strip ── */}
      {reports.length > 0 && (
        <ReportFilterStrip>
          {/* "All" hub tab — visually distinct */}
          <AllReportsTab
            $isActive={!filterReportId}
            onClick={() => setFilterReportId(null)}
            title={`All ${reports.length} reports · ${coverLetters.length} total letters`}
          >
            {coverLetters.length > 0 && <AllReportsCount>{coverLetters.length}</AllReportsCount>}
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round">
              <rect x="3" y="3" width="7" height="7" rx="1.5"/>
              <rect x="14" y="3" width="7" height="7" rx="1.5"/>
              <rect x="3" y="14" width="7" height="7" rx="1.5"/>
              <rect x="14" y="14" width="7" height="7" rx="1.5"/>
            </svg>
            <AllReportsLabel $isActive={!filterReportId}>All</AllReportsLabel>
          </AllReportsTab>

          {/* One tab per report */}
          {reports.map((report) => {
            const getScoreCategory = (score: number) => {
              if (score >= 70) return 'excellent' as const;
              if (score >= 41) return 'good' as const;
              return 'needsWork' as const;
            };
            const letterCount = getCoverLetterCount(report.id);
            const isActive = filterReportId === report.id;

            return (
              <ReportFilterTab
                key={report.id}
                $isActive={isActive}
                $hasLetters={letterCount > 0}
                onClick={() => setFilterReportId(isActive ? null : report.id)}
              >
                <ReportTabTop>
                  <ReportTabScore $category={getScoreCategory(report.fit_score)}>
                    {report.fit_score}
                  </ReportTabScore>
                  <ReportTabLetterCount $count={letterCount}>
                    {letterCount > 0 ? `${letterCount} ✓` : 'No letters'}
                  </ReportTabLetterCount>
                </ReportTabTop>
                <ReportTabTitle>{report.job?.title || 'Job Analysis'}</ReportTabTitle>
                {isActive && (
                  <ReportTabGenerateBtn
                    onClick={(e) => {
                      e.stopPropagation();
                      handleReportClick(report.id);
                    }}
                  >
                    ✦ Generate new letter →
                  </ReportTabGenerateBtn>
                )}
              </ReportFilterTab>
            );
          })}
        </ReportFilterStrip>
      )}

      {/* ── Letters section (full width) ── */}
      <ContentSection>
        <ContentHeader>
          <div>
            <SectionTitle>
              {filterReport
                ? `Letters — ${filterReport.job?.title || 'Report'}`
                : 'Your Cover Letters'}
            </SectionTitle>
            <SectionDescription>
              {filterReport
                ? `${filteredCoverLetters.length} letter${filteredCoverLetters.length !== 1 ? 's' : ''} · Click a tab above to switch report`
                : `${coverLetters.length} total · click a report tab to filter`}
            </SectionDescription>
          </div>
          {filterReport && (
            <FilterClearButton onClick={() => setFilterReportId(null)}>
              Show all ×
            </FilterClearButton>
          )}
        </ContentHeader>
        <ContentBody>

          {/* Active filter bar */}
          {filterReport && (
            <FilterBar>
              <span>✦ Filtered by <strong>{filterReport.job?.title || 'Report'}</strong> · {filterReport.fit_score}% fit score</span>
              <FilterClearButton onClick={() => setFilterReportId(null)}>Clear ×</FilterClearButton>
            </FilterBar>
          )}

          {filteredCoverLetters.length === 0 ? (
            <Card variant="bordered">
              <EmptyState
                icon={<EmptyState.DocumentIcon />}
                title={filterReport ? `No letters for "${filterReport.job?.title || 'this report'}" yet` : 'No cover letters yet'}
                description={
                  filterReport
                    ? 'Use the "✦ Generate new letter →" button in the tab above to create one.'
                    : 'Click on a report tab above to select a report and generate your first cover letter.'
                }
              />
            </Card>
          ) : (
            <LetterGrid>
              {filteredCoverLetters.map((letter) => {
                const sourceReport = reports.find(r => r.id === letter.report_id);
                return (
                  <CoverLetterCard
                    key={letter.id}
                    $tone={letter.tone}
                    onClick={() => handleCardClick(letter)}
                  >
                    <CoverLetterBackground content={letter.content} />
                    <CoverLetterToneBadge $tone={letter.tone}>
                      {getToneLabel(letter.tone)}
                    </CoverLetterToneBadge>

                    <CoverLetterCardContent>
                      <CoverLetterContentInner className="letter-content">
                        {/* Source report link */}
                        {sourceReport && (
                          <LetterSourceTag>
                            {sourceReport.job?.title || 'Report'} · {sourceReport.fit_score}% fit
                          </LetterSourceTag>
                        )}
                        <CoverLetterTitle>
                          {letter.job?.title || 'Cover Letter'}
                        </CoverLetterTitle>
                        <CoverLetterMeta>
                          {formatDate(letter.created_at)}
                        </CoverLetterMeta>
                        <CoverLetterMetaRow>
                          <CoverLetterMetaItem>
                            {getWordCount(letter.content)} words
                          </CoverLetterMetaItem>
                          <CoverLetterMetaItem>
                            {getLanguageLabel(letter.language)}
                          </CoverLetterMetaItem>
                        </CoverLetterMetaRow>
                      </CoverLetterContentInner>

                      <CoverLetterCTAContainer className="letter-cta" onClick={(e) => e.stopPropagation()}>
                        <CoverLetterCTALink onClick={() => handleCardClick(letter)}>
                          View & Edit
                          <ArrowRightIconLetter />
                        </CoverLetterCTALink>
                        <CoverLetterActions>
                          <CoverLetterActionButton
                            onClick={(e) => {
                              e.stopPropagation();
                              navigator.clipboard.writeText(letter.content);
                              toast.success('Copied to clipboard!');
                            }}
                          >
                            <CopyIcon /> Copy
                          </CoverLetterActionButton>
                          <CoverLetterActionButton
                            $variant="danger"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteClick(letter.id);
                            }}
                          >
                            <DeleteIcon />
                          </CoverLetterActionButton>
                        </CoverLetterActions>
                      </CoverLetterCTAContainer>
                    </CoverLetterCardContent>

                    <CoverLetterOverlay className="letter-overlay" />
                  </CoverLetterCard>
                );
              })}
            </LetterGrid>
          )}
        </ContentBody>
      </ContentSection>

      {/* FAB — generate new cover letter */}
      <FAB
        onClick={() => {
          if (filterReportId) {
            handleReportClick(filterReportId);
          } else {
            // Open generator — user will pick a report inside
            setIsGeneratorOpen(true);
          }
        }}
      >
        <PlusIcon />
      </FAB>


      {/* View Cover Letter Modal */}
      {selectedLetter && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Cover Letter"
          description="Full cover letter content"
          size="lg"
        >
          <Modal.Body>
            <ModalContent>
              <ModalMetaInfo>
                <MetaItem>
                  <strong>Tone:</strong> {getToneLabel(selectedLetter.tone)}
                </MetaItem>
                <MetaItem>
                  <strong>Words:</strong> {getWordCount(selectedLetter.content)}
                </MetaItem>
                <MetaItem>
                  <strong>Language:</strong> {getLanguageLabel(selectedLetter.language)}
                </MetaItem>
                <MetaItem>
                  <strong>Created:</strong> {formatDate(selectedLetter.created_at)}
                </MetaItem>
              </ModalMetaInfo>

              <ModalText>{selectedLetter.content}</ModalText>
            </ModalContent>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="ghost" onClick={() => setIsModalOpen(false)}>
              Close
            </Button>
            <Button variant="ghost" onClick={handleCopy}>
              <CopyIcon /> Copy
            </Button>
            <Button variant="primary" onClick={handleDownload}>
              Download
            </Button>
          </Modal.Footer>
        </Modal>
      )}

      {/* Cover Letter Generator Modal (for creating new letters) */}
      {selectedReportId && (
        <CoverLetterGenerator
          isOpen={isGeneratorOpen}
          onClose={handleGeneratorClose}
          reportId={selectedReportId}
          onSuccess={handleGeneratorSuccess}
        />
      )}

      {/* Cover Letter Editor Modal (for editing existing letters) */}
      {selectedLetterForEdit && (
        <CoverLetterGenerator
          isOpen={isEditorOpen}
          onClose={() => {
            setIsEditorOpen(false);
            // Delay clearing the letter data until after the animation completes
            setTimeout(() => {
              setSelectedLetterForEdit(null);
            }, 350);
          }}
          reportId={selectedLetterForEdit.report_id}
          existingLetter={{
            id: selectedLetterForEdit.id,
            content: selectedLetterForEdit.content,
            tone: selectedLetterForEdit.tone,
            length: selectedLetterForEdit.length,
            language: selectedLetterForEdit.language,
            paragraphs: selectedLetterForEdit.structured_content?.paragraphs as any,
            keyHighlights: selectedLetterForEdit.structured_content?.keyHighlights,
          }}
          onSuccess={() => {
            fetchCoverLetters();
            toast.success("Cover letter viewed!");
          }}
        />
      )}

      {/* Premium Upgrade Modal */}
      <Modal
        isOpen={isPremiumModalOpen}
        onClose={() => setIsPremiumModalOpen(false)}
        title="✨ Premium Feature"
        description="Cover letters are only available for premium reports"
        size="md"
      >
        <Modal.Body>
          <div style={{
            padding: '24px',
            textAlign: 'center',
          }}>
            <div style={{
              marginBottom: '20px',
              display: 'flex',
              justifyContent: 'center',
            }}>
              <div style={{
                background: 'var(--gradient-primary)',
                borderRadius: '16px',
                padding: '16px',
                display: 'inline-flex',
              }}>
                <EnvelopeIcon size="48" />
              </div>
            </div>
            <h3 style={{
              fontSize: '24px',
              fontWeight: 600,
              marginBottom: '16px',
              background: 'var(--gradient-primary)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>
              AI-Powered Cover Letters
            </h3>
            <p style={{
              fontSize: '16px',
              color: '#9ca3af',
              marginBottom: '24px',
              lineHeight: '1.6',
            }}>
              Create personalized, professional cover letters tailored to each job posting.
              To unlock this feature, you need to upgrade the report to premium.
            </p>

            <div style={{
              background: 'rgba(102, 126, 234, 0.1)',
              border: '2px solid rgba(102, 126, 234, 0.3)',
              borderRadius: '12px',
              padding: '20px',
              marginBottom: '24px',
              textAlign: 'left',
            }}>
              <div style={{ fontSize: '14px', fontWeight: 600, marginBottom: '12px', color: 'var(--accent)' }}>
                ✨ What you'll get with premium:
              </div>
              <ul style={{
                listStyle: 'none',
                padding: 0,
                margin: 0,
                fontSize: '14px',
                color: '#d1d5db',
              }}>
                <li style={{ marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ color: 'var(--success)', flexShrink: 0 }}>
                    <CheckCircleIcon />
                  </div>
                  <span>AI-generated cover letters with 6 templates</span>
                </li>
                <li style={{ marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ color: 'var(--success)', flexShrink: 0 }}>
                    <CheckCircleIcon />
                  </div>
                  <span>Optimized CV with improved ATS score</span>
                </li>
                <li style={{ marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ color: 'var(--success)', flexShrink: 0 }}>
                    <CheckCircleIcon />
                  </div>
                  <span>Detailed improvement breakdown</span>
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ color: 'var(--success)', flexShrink: 0 }}>
                    <CheckCircleIcon />
                  </div>
                  <span>Alternative role recommendations</span>
                </li>
              </ul>
            </div>

            {userCredits.canAnalyze ? (
              <>
                <div style={{
                  background: 'rgba(16, 185, 129, 0.1)',
                  border: '1px solid rgba(16, 185, 129, 0.3)',
                  borderRadius: '8px',
                  padding: '12px',
                  marginBottom: '16px',
                  fontSize: '14px',
                  color: 'var(--success)',
                }}>
                  You have <strong>{userCredits.credits}</strong> credits available
                </div>
                <Button
                  size="lg"
                  onClick={() => {
                    setIsPremiumModalOpen(false);
                    if (selectedFreeReportId) {
                      router.push(`/reports/${selectedFreeReportId}?upgrade=true`);
                    }
                  }}
                  style={{
                    width: '100%',
                    background: 'var(--gradient-primary)',
                    fontSize: '16px',
                    padding: '14px 24px',
                    marginBottom: '12px',
                  }}
                >
                  Upgrade to Pro - Use 1 Credit
                </Button>
                <p style={{
                  fontSize: '12px',
                  color: '#6b7280',
                  marginTop: '12px',
                }}>
                  Uses 1 credit • Unlock all premium features
                </p>
              </>
            ) : (
              <>
                <Button
                  size="lg"
                  onClick={() => router.push(ROUTES.APP.BILLING)}
                  style={{
                    width: '100%',
                    background: 'var(--gradient-primary)',
                    fontSize: '16px',
                    padding: '14px 24px',
                    marginBottom: '12px',
                  }}
                >
                  Buy Credits to Unlock
                </Button>
                <p style={{
                  fontSize: '12px',
                  color: '#6b7280',
                  marginTop: '12px',
                }}>
                  Starting at $2 for 1 credit • Best value: $7 for 10 credits
                </p>
              </>
            )}
          </div>
        </Modal.Body>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={() => !isDeleting && setDeleteModalOpen(false)}
        title="Delete Cover Letter"
        size="sm"
      >
        <Modal.Body>
          <div style={{ padding: '16px 0' }}>
            <p style={{ marginBottom: '12px', fontSize: '15px', lineHeight: '1.6' }}>
              Are you sure you want to delete this cover letter? This action cannot be undone.
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
            {isDeleting ? 'Deleting...' : 'Delete Cover Letter'}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}
