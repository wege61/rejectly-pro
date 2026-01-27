"use client";

import styled, { keyframes } from "styled-components";
import { useState, useEffect, useCallback, useRef } from "react";
import { createPortal } from "react-dom";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Spinner } from "@/components/ui/Spinner";
import { Modal } from "@/components/ui/Modal";
import { LoadingModal } from "@/components/ui/LoadingModal";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useToast } from "@/contexts/ToastContext";
import { useAuth } from "@/hooks/useAuth";
import { createClient } from "@/lib/supabase/client";
import { GeneratedCV } from "@/types/cv";
import { generateCVPDF } from "@/lib/pdf/cvGenerator";
import { CoverLetterGenerator } from "@/components/features/CoverLetterGenerator";
import { ToolSuggestionModal } from "@/components/features/ToolSuggestionModal";
import { ScoreBreakdownModal } from "@/components/features/ScoreBreakdownModal";
import { Drawer, DrawerHeader, DrawerTitle, DrawerDescription, DrawerBody, DrawerFooter } from "@/components/ui/Drawer";
import { CreditsCard } from "@/components/dashboard";
import { ToolSuggestionResponse } from "@/types/toolSuggestion";
import { ScoreBreakdown } from "@/types/scoreBreakdown";
import { PRICING } from "@/lib/constants";
import {
  Report,
  UserCredits,
  Improvement,
  RoleRecommendation,
  FakeSkillRecommendation,
  ScoreRange,
  UserState,
  getScoreRange,
  getUserState,
  getVisibleSections,
  getScoreMessage,
  getProblemStats as getReportProblemStats,
  getSeverityInfo as getReportSeverityInfo,
  getScoreLabel,
  CHART_COLORS,
  hasSignificantImprovements,
} from "@/components/report";

const RocketIcon = () => (
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
      d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.631 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 00-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 01-2.448-2.448 14.9 14.9 0 01.06-.312m-2.24 2.39a4.493 4.493 0 00-1.757 4.306 4.493 4.493 0 004.306-1.758M16.5 9a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z"
    />
  </svg>
);

const LightBulbIcon = () => (
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
      d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.493 1.509 1.333 1.509 2.316V18"
    />
  </svg>
);

const DownloadIcon = () => (
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
      d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"
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

const DocumentIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={2}
    stroke="currentColor"
    style={{
      width: "18px",
      height: "18px",
      display: "inline-block",
      verticalAlign: "middle",
    }}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
    />
  </svg>
);

const SparklesIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={2}
    stroke="currentColor"
    style={{
      width: "18px",
      height: "18px",
      display: "inline-block",
      verticalAlign: "middle",
    }}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z"
    />
  </svg>
);

const FireIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={2}
    stroke="currentColor"
    style={{
      width: "18px",
      height: "18px",
      display: "inline-block",
      verticalAlign: "middle",
    }}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048 8.287 8.287 0 009 9.6a8.983 8.983 0 013.361-6.867 8.21 8.21 0 003 2.48z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 18a3.75 3.75 0 00.495-7.467 5.99 5.99 0 00-1.925 3.546 5.974 5.974 0 01-2.133-1A3.75 3.75 0 0012 18z"
    />
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

const BriefcaseIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={2}
    stroke="currentColor"
    style={{
      width: "18px",
      height: "18px",
      display: "inline-block",
      verticalAlign: "middle",
    }}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0M12 12.75h.008v.008H12v-.008z"
    />
  </svg>
);


const XMarkIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={2}
    stroke="currentColor"
    style={{
      width: "18px",
      height: "18px",
      display: "inline-block",
      verticalAlign: "middle",
    }}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M6 18L18 6M6 6l12 12"
    />
  </svg>
);


// Problem Summary Icons
const MagnifyingGlassIcon = ({ size = "24" }: { size?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={2.5}
    stroke="currentColor"
    style={{
      width: `${size}px`,
      height: `${size}px`,
      display: "inline-block",
      verticalAlign: "middle",
    }}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
    />
  </svg>
);

const CriticalIssueIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    style={{
      width: "28px",
      height: "28px",
      display: "inline-block",
      verticalAlign: "middle",
    }}
  >
    <path
      fillRule="evenodd"
      d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm-1.72 6.97a.75.75 0 10-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 101.06 1.06L12 13.06l1.72 1.72a.75.75 0 101.06-1.06L13.06 12l1.72-1.72a.75.75 0 10-1.06-1.06L12 10.94l-1.72-1.72z"
      clipRule="evenodd"
    />
  </svg>
);

const ImportantIssueIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    style={{
      width: "28px",
      height: "28px",
      display: "inline-block",
      verticalAlign: "middle",
    }}
  >
    <path
      fillRule="evenodd"
      d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z"
      clipRule="evenodd"
    />
  </svg>
);

const MinorIssueIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    style={{
      width: "28px",
      height: "28px",
      display: "inline-block",
      verticalAlign: "middle",
    }}
  >
    <path
      fillRule="evenodd"
      d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z"
      clipRule="evenodd"
    />
  </svg>
);

const ArrowRightLongIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={2.5}
    stroke="currentColor"
    style={{
      width: "24px",
      height: "24px",
      display: "inline-block",
      verticalAlign: "middle",
    }}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
    />
  </svg>
);

const CheckCircleFilledIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    style={{
      width: "20px",
      height: "20px",
      display: "inline-block",
      verticalAlign: "middle",
    }}
  >
    <path
      fillRule="evenodd"
      d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z"
      clipRule="evenodd"
    />
  </svg>
);


const TrendingUpIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={2.5}
    stroke="currentColor"
    style={{
      width: "16px",
      height: "16px",
      display: "inline-block",
      verticalAlign: "middle",
    }}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941"
    />
  </svg>
);

const RefreshIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={2}
    stroke="currentColor"
    style={{
      width: "20px",
      height: "20px",
    }}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"
    />
  </svg>
);

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: ${({ theme }) => theme.spacing["2xl"]};

  @media (max-width: 450px) {
    padding: ${({ theme }) => theme.spacing["lg"]};
  }
`;

const BackButton = styled(Button)`
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const Header = styled.div`
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  margin-bottom: ${({ theme }) => theme.spacing["2xl"]};
`;

const TitleElements = styled.div``;

const Title = styled.h1`
  font-size: ${({ theme }) => theme.typography.fontSize["3xl"]};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const Subtitle = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const CreditsCardWrapper = styled.div``;

const HeaderMeta = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  flex-wrap: wrap;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing["2xl"]};
`;

const CreditsIndicator = styled.div<{ $low?: boolean; $subscription?: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => `${theme.spacing.sm} ${theme.spacing.lg}`};
  background: ${({ $subscription, $low }) =>
    $subscription
      ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.2) 0%, rgba(5, 150, 105, 0.2) 100%)'
      : $low
        ? 'linear-gradient(135deg, rgba(245, 158, 11, 0.2) 0%, rgba(217, 119, 6, 0.2) 100%)'
        : 'linear-gradient(135deg, rgba(155, 135, 196, 0.2) 0%, rgba(180, 167, 214, 0.2) 100%)'
  };
  border: 2px solid ${({ $subscription, $low }) =>
    $subscription
      ? 'rgba(16, 185, 129, 0.5)'
      : $low
        ? 'rgba(245, 158, 11, 0.5)'
        : 'rgba(155, 135, 196, 0.5)'
  };
  border-radius: ${({ theme }) => theme.radius.lg};
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  color: ${({ $subscription, $low }) =>
    $subscription
      ? 'var(--success)'
      : $low
        ? '#f59e0b'
        : '#e5e7eb'
  };
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 2px 8px ${({ $subscription, $low }) =>
    $subscription
      ? 'rgba(16, 185, 129, 0.2)'
      : $low
        ? 'rgba(245, 158, 11, 0.2)'
        : 'rgba(155, 135, 196, 0.2)'
  };

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px ${({ $subscription, $low }) =>
      $subscription
        ? 'rgba(16, 185, 129, 0.3)'
        : $low
          ? 'rgba(245, 158, 11, 0.3)'
          : 'rgba(155, 135, 196, 0.3)'
    };
  }

  .credit-value {
    font-size: ${({ theme }) => theme.typography.fontSize.xl};
    font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
    color: ${({ $subscription, $low }) =>
      $subscription
        ? 'var(--success)'
        : $low
          ? '#f59e0b'
          : '#9b87c4'
    };
  }
`;

const CVActionButtonWrapper = styled.div`
  display: flex;
  width: 100%;
  justify-content: center;

  button {
    width: 100%;
    justify-content: center;

    @media (min-width: 1024px) {
      width: auto;
    }
  }
`;

const MetaItemProOrFree = styled.span<{ $isPro?: boolean }>`
  font-size: 13px;
  color: ${({ $isPro }) => $isPro ? '#FF7A73' : 'var(--text-secondary)'};
  display: flex;
  align-items: center;
  gap: 4px;
`;

const Grid = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.spacing.lg};
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  margin-bottom: ${({ theme }) => theme.spacing["2xl"]};
`;

// Stats Bento Grid - Dashboard style
const StatsBentoGrid = styled.div`
  display: grid;
  width: 100%;
  gap: 16px;
  grid-template-columns: 1fr;
  margin-bottom: ${({ theme }) => theme.spacing["2xl"]};

  @media (min-width: 640px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (min-width: 1024px) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

const statCardPulse = keyframes`
  0%, 100% { opacity: 0.4; }
  50% { opacity: 0.7; }
`;

const statCardFloat = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-4px); }
`;

const StatBentoCard = styled.div<{ $isClickable?: boolean }>`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  overflow: hidden;
  border-radius: 16px;
  background: var(--bg-alt);
  cursor: ${({ $isClickable }) => $isClickable ? 'pointer' : 'default'};
  transition: all 0.3s ease;
  min-height: 180px;

  /* Light styles */
  box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.03), 0 2px 4px rgba(0, 0, 0, 0.05),
    0 12px 24px rgba(0, 0, 0, 0.05);

  /* Dark styles */
  @media (prefers-color-scheme: dark) {
    box-shadow: 0 -20px 80px -20px rgba(255, 255, 255, 0.12) inset;
    border: 1px solid rgba(255, 255, 255, 0.1);
  }

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.12);
  }

  &:hover .stat-icon {
    transform: scale(0.85);
  }

  &:hover .stat-content {
    transform: translateY(-28px);
  }

  &:hover .stat-cta {
    transform: translateY(0);
    opacity: 1;
  }

  &:hover .stat-overlay {
    background: rgba(0, 0, 0, 0.03);
  }

  @media (prefers-color-scheme: dark) {
    &:hover .stat-overlay {
      background: rgba(255, 255, 255, 0.05);
    }
  }

  &:hover .stat-bg-element {
    opacity: 0.8;
  }
`;

const StatBentoBackground = styled.div`
  position: absolute;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
  mask-image: linear-gradient(to bottom, transparent 30%, rgba(0,0,0,0.3) 100%);
  -webkit-mask-image: linear-gradient(to bottom, transparent 30%, rgba(0,0,0,0.3) 100%);
`;

const StatBentoContent = styled.div`
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  transform-origin: bottom left;
  transition: all 0.3s ease;
  position: relative;
  z-index: 1;

  @media (max-width: 1024px) {
    transform: none !important;
  }
`;

const StatBentoIcon = styled.div<{ $color?: string }>`
  transform-origin: left;
  transition: all 0.3s ease;
  color: ${({ $color }) => $color || 'var(--accent)'};
  margin-bottom: 8px;

  svg {
    width: 32px;
    height: 32px;
  }
`;

const StatBentoValue = styled.span<{ $color?: string }>`
  font-size: 48px;
  font-weight: 700;
  color: ${({ $color }) => $color || 'var(--accent)'};
  line-height: 1;
  margin-bottom: 4px;

  @media (max-width: 1024px) {
    font-size: 40px;
  }

  @media (max-width: 640px) {
    font-size: 36px;
  }
`;

const StatBentoTitle = styled.h3`
  font-size: 18px;
  font-weight: 600;
  color: var(--text-color);
  margin-top: 4px;

  @media (max-width: 640px) {
    font-size: 16px;
  }
`;

const StatBentoDescription = styled.p`
  color: var(--text-secondary);
  font-size: 14px;
  line-height: 1.4;
`;

const StatBentoCTA = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  align-items: center;
  padding: 20px;
  transform: translateY(40px);
  opacity: 0;
  transition: all 0.3s ease;

  @media (max-width: 1024px) {
    position: relative;
    transform: translateY(0);
    opacity: 1;
    padding: 0 20px 20px 20px;
  }
`;

const StatBentoCTALink = styled.span`
  display: flex;
  align-items: center;
  gap: 6px;
  color: var(--accent);
  font-weight: 500;
  font-size: 14px;

  svg {
    width: 14px;
    height: 14px;
    transition: transform 0.2s ease;
  }

  &:hover svg {
    transform: translateX(3px);
  }
`;

const StatBentoOverlay = styled.div`
  pointer-events: none;
  position: absolute;
  inset: 0;
  transition: all 0.3s ease;
  border-radius: 16px;
`;

// Background animation elements
const ScoreBgCircle = styled.div<{ $score: number; $size: number; $delay: number }>`
  position: absolute;
  width: ${({ $size }) => $size}px;
  height: ${({ $size }) => $size}px;
  border-radius: 50%;
  background: ${({ $score }) =>
    $score >= 80
      ? 'rgba(16, 185, 129, 0.15)'
      : $score >= 60
        ? 'rgba(245, 158, 11, 0.15)'
        : 'rgba(239, 68, 68, 0.15)'};
  animation: ${statCardPulse} 3s ease-in-out infinite;
  animation-delay: ${({ $delay }) => $delay}s;
  opacity: 0.4;
  transition: opacity 0.3s ease;
`;

const KeywordBgTag = styled.div<{ $top: number; $left: number; $delay: number }>`
  position: absolute;
  top: ${({ $top }) => $top}%;
  left: ${({ $left }) => $left}%;
  padding: 4px 8px;
  background: rgba(102, 126, 234, 0.1);
  border: 1px solid rgba(102, 126, 234, 0.2);
  border-radius: 4px;
  font-size: 10px;
  color: var(--accent);
  opacity: 0.5;
  animation: ${statCardFloat} 4s ease-in-out infinite;
  animation-delay: ${({ $delay }) => $delay}s;
  transition: opacity 0.3s ease;
`;

const RoleBgBar = styled.div<{ $width: number; $top: number; $delay: number }>`
  position: absolute;
  top: ${({ $top }) => $top}%;
  right: 20px;
  width: ${({ $width }) => $width}%;
  height: 6px;
  background: linear-gradient(90deg, rgba(16, 185, 129, 0.2), rgba(16, 185, 129, 0.4));
  border-radius: 3px;
  opacity: 0.5;
  animation: ${statCardPulse} 2.5s ease-in-out infinite;
  animation-delay: ${({ $delay }) => $delay}s;
  transition: opacity 0.3s ease;
`;

const ScoreCard = styled(Card)`
  text-align: center;
`;

const ClickableScoreCard = styled(Card)`
  text-align: center;
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(102, 126, 234, 0.2);
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const ScoreClickHint = styled.div`
  font-size: 11px;
  color: ${({ theme }) => theme.colors.textTertiary};
  margin-top: ${({ theme }) => theme.spacing.sm};
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;

  svg {
    width: 12px;
    height: 12px;
  }
`;

const ScoreValue = styled.div<{ $score?: number }>`
  font-size: ${({ theme }) => theme.typography.fontSize["5xl"]};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ $score }) =>
    $score !== undefined
      ? $score >= 80
        ? '#10b981'
        : $score >= 60
          ? '#f59e0b'
          : '#ef4444'
      : '#667eea'
  };
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

const ScoreLabel = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

const ScoreContext = styled.div<{ $score?: number }>`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  color: ${({ $score }) =>
    $score !== undefined
      ? $score >= 80
        ? '#10b981'
        : $score >= 60
          ? '#f59e0b'
          : '#ef4444'
      : '#667eea'
  };
  padding: ${({ theme }) => `${theme.spacing.xs} ${theme.spacing.sm}`};
  background: ${({ $score }) =>
    $score !== undefined
      ? $score >= 80
        ? 'rgba(16, 185, 129, 0.1)'
        : $score >= 60
          ? 'rgba(245, 158, 11, 0.1)'
          : 'rgba(239, 68, 68, 0.1)'
      : 'rgba(102, 126, 234, 0.1)'
  };
  border-radius: ${({ theme }) => theme.radius.full};
  display: inline-block;
`;

// getScoreLabel is now imported from @/components/report

const ComparisonScoreCard = styled(Card)`
  text-align: center;
`;

const ClickableComparisonScoreCard = styled(Card)`
  text-align: center;
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(102, 126, 234, 0.2);
    border-color: var(--success);
  }
`;

const ScoreComparison = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.lg};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const ScoreColumn = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const ScoreTitle = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const ComparisonValue = styled.div<{ $isOptimized?: boolean }>`
  font-size: ${({ theme }) => theme.typography.fontSize["4xl"]};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ $isOptimized, theme }) =>
    $isOptimized ? "var(--success)" : theme.colors.primary};
`;

const ScoreDivider = styled.div`
  width: 1px;
  height: 60px;
  background-color: ${({ theme }) => theme.colors.border};
`;

const ImprovementBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  background: linear-gradient(135deg, var(--success) 0%, var(--success-dark) 100%);
  color: white;
  border-radius: ${({ theme }) => theme.radius.full};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  margin-top: ${({ theme }) => theme.spacing.sm};
`;

const LoadingText = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-top: ${({ theme }) => theme.spacing.sm};
`;

const BreakdownContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
  margin-top: ${({ theme }) => theme.spacing.lg};
`;

const BreakdownItem = styled.div`
  display: grid;
  grid-template-columns: 60px 1fr 100px;
  gap: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.md};
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.md};
  align-items: start;
  transition: all ${({ theme }) => theme.transitions.fast};
  cursor: pointer;

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
    transform: translateX(4px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    grid-template-columns: 1fr;
    gap: ${({ theme }) => theme.spacing.sm};
    text-align: center;
    align-items: center;
  }
`;

const ImpactBadge = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, var(--success) 0%, var(--success-dark) 100%);
  color: white;
  font-size: ${({ theme }) => theme.typography.fontSize.xl};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  border-radius: ${({ theme }) => theme.radius.md};
  flex-shrink: 0;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    width: 48px;
    height: 48px;
    font-size: ${({ theme }) => theme.typography.fontSize.lg};
    margin: 0 auto;
  }
`;

const ImpactContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
  min-width: 0;
  word-wrap: break-word;
  overflow-wrap: break-word;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    text-align: center;
  }
`;

const ImpactCategory = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  color: ${({ theme }) => theme.colors.textSecondary};
  text-transform: uppercase;
  letter-spacing: 0.5px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
`;

const ImpactAction = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  color: ${({ theme }) => theme.colors.textPrimary};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  line-height: ${({ theme }) => theme.typography.lineHeight.normal};

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    font-size: ${({ theme }) => theme.typography.fontSize.sm};
  }
`;

const ImpactReason = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
  line-height: ${({ theme }) => theme.typography.lineHeight.relaxed};

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    font-size: ${({ theme }) => theme.typography.fontSize.xs};
    line-height: ${({ theme }) => theme.typography.lineHeight.normal};
  }
`;

const ImpactPoints = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: center;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    align-items: center;
    margin-top: ${({ theme }) => theme.spacing.xs};
  }
`;

const ImpactValue = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: var(--success);

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    font-size: ${({ theme }) => theme.typography.fontSize.xl};
  }
`;

const ImpactLabel = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  color: ${({ theme }) => theme.colors.textSecondary};
  text-transform: uppercase;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    font-size: ${({ theme }) => theme.typography.fontSize.sm};
  }
`;

const TotalImpactSummary = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${({ theme }) => theme.spacing.lg};
  background: ${({ theme }) => theme.colors.backgroundAlt};
  border-radius: ${({ theme }) => theme.radius.lg};
  color: white;
  margin-top: ${({ theme }) => theme.spacing.md};

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    flex-direction: column;
    gap: ${({ theme }) => theme.spacing.sm};
    padding: ${({ theme }) => theme.spacing.md};
    text-align: center;
  }
`;

const TotalLabel = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    font-size: ${({ theme }) => theme.typography.fontSize.base};
  }
`;

const TotalValue = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize["2xl"]};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    font-size: ${({ theme }) => theme.typography.fontSize.xl};
  }
`;

// Fixes Card - Unified component matching StatBentoCard style
const FixesCard = styled.div`
  background: var(--bg-alt);
  border-radius: 16px;
  overflow: hidden;

  /* Light styles */
  box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.03), 0 2px 4px rgba(0, 0, 0, 0.05),
    0 12px 24px rgba(0, 0, 0, 0.05);

  @media (prefers-color-scheme: dark) {
    box-shadow: 0 -20px 80px -20px rgba(255, 255, 255, 0.12) inset;
    border: 1px solid rgba(255, 255, 255, 0.1);
  }
`;

const FixesHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  gap: 16px;
  flex-wrap: wrap;

  @media (max-width: 640px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const FixesHeaderLeft = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const FixesTitle = styled.h3`
  font-size: 18px;
  font-weight: 600;
  color: var(--text-color);
  margin: 0;
`;

const FixesSubtitle = styled.p`
  font-size: 14px;
  color: var(--text-secondary);
  margin: 0;
`;

const FixesScoreBadge = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 16px;
  border-radius: 8px;
`;

const FixesScoreItem = styled.div<{ $isAfter?: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
`;

const FixesScoreValue = styled.span<{ $isAfter?: boolean }>`
  font-size: ${({ $isAfter }) => ($isAfter ? '24px' : '18px')};
  font-weight: 700;
  color: ${({ $isAfter }) => ($isAfter ? 'var(--success)' : 'var(--text-secondary)')};
  line-height: 1;
`;

const FixesScoreLabel = styled.span`
  font-size: 11px;
  color: var(--text-tertiary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const FixesScoreArrow = styled.div`
  color: var(--text-tertiary);
  display: flex;
  align-items: center;

  svg {
    width: 16px;
    height: 16px;
  }
`;

const FixesList = styled.div`
  display: flex;
  flex-direction: column;
`;

const FixItem = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 16px;
  padding: 16px 24px;
border-bottom: 1px solid ${({ theme }) => theme.colors.border};  
cursor: pointer;
  transition: background 0.15s ease;

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background: rgba(0, 0, 0, 0.02);
  }

  @media (prefers-color-scheme: dark) {
    &:hover {
      background: rgba(255, 255, 255, 0.02);
    }
  }

  @media (max-width: 640px) {
    flex-direction: column;
    gap: 12px;
  }
`;

const FixSeverityDot = styled.div<{ $severity: 'critical' | 'important' | 'minor' }>`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
  background: ${({ $severity }) => {
    if ($severity === 'critical') return '#F97316';
    if ($severity === 'important') return '#EAB308';
    return 'var(--accent)';
  }};

  @media (max-width: 640px) {
    display: none;
  }
`;

const IconWrapper = styled.div`
  width: 24px;
  height: 24px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  background: var(--checkbox);
  
`;


const FixContent = styled.div`
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const FixCategory = styled.span`
  font-size: 12px;
  color: var(--text-tertiary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const FixProblem = styled.p`
  font-size: 14px;
  color: var(--text-color);
  margin: 0;
  line-height: 1.5;
`;

const FixReason = styled.p`
  font-size: 13px;
  color: var(--text-secondary);
  margin: 0;
  line-height: 1.4;
`;

const FixImpact = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 2px;
  flex-shrink: 0;

  @media (max-width: 640px) {
    flex-direction: row;
    align-items: center;
    gap: 8px;
  }
`;

const FixImpactValue = styled.span`
  font-size: 16px;
  font-weight: 600;
  color: var(--success);
`;

const FixImpactLabel = styled.span`
  font-size: 11px;
  color: var(--text-tertiary);
  text-transform: uppercase;
`;

const FixesFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 24px;
  background: var(--accent);
  border-top: 1px solid ${({ theme }) => theme.colors.border};

  @media (max-width: 640px) {
    flex-direction: column;
    gap: 8px;
    text-align: center;
  }
`;

const FixesFooterLabel = styled.span`
  font-size: 14px;
  font-weight: 500;
  color: white;
`;

const FixesFooterValue = styled.span`
  font-size: 18px;
  font-weight: 700;
  color: var(--primary-500);
`;

// ATS Optimized Card - For high-score users showing what was done
const ATSOptimizedCard = styled.div`
  position: relative;
  background: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.radius.xl};
  padding: 40px;
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  overflow: hidden;
  border: 1px solid ${({ theme }) => theme.colors.border};
  box-shadow: ${({ theme }) => theme.shadow.lg};

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, ${({ theme }) => theme.colors.success} 0%, ${({ theme }) => theme.colors.primary} 100%);
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    padding: 28px 20px;
  }
`;

const ATSOptimizedHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 32px;
  flex-wrap: wrap;
  gap: 24px;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const ATSOptimizedTitleSection = styled.div`
  flex: 1;
  min-width: 280px;
`;

const ATSOptimizedTitle = styled.h3`
  font-size: ${({ theme }) => theme.typography.fontSize["2xl"]};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.textPrimary};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};

  svg {
    color: ${({ theme }) => theme.colors.success};
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    font-size: ${({ theme }) => theme.typography.fontSize.xl};
  }
`;

const ATSOptimizedSubtitle = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const ATSScoreBadge = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  background: ${({ theme }) => theme.colors.successLight};
  padding: ${({ theme }) => `${theme.spacing.md} ${theme.spacing.lg}`};
  border-radius: ${({ theme }) => theme.radius.lg};
  border: 1px solid ${({ theme }) => theme.colors.success};

  .score-number {
    font-size: 32px;
    font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
    color: ${({ theme }) => theme.colors.success};
    line-height: 1;
  }

  .score-label {
    font-size: ${({ theme }) => theme.typography.fontSize.xs};
    color: ${({ theme }) => theme.colors.success};
    text-transform: uppercase;
    letter-spacing: 0.5px;
    font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    width: 100%;
    justify-content: center;
  }
`;

const ATSFeaturesList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: ${({ theme }) => theme.spacing.md};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const ATSFeatureItem = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing.md};
  background: ${({ theme }) => theme.colors.backgroundAlt};
  border-radius: ${({ theme }) => theme.radius.md};
  border: 1px solid ${({ theme }) => theme.colors.border};

  svg {
    width: 20px;
    height: 20px;
    color: ${({ theme }) => theme.colors.success};
    flex-shrink: 0;
  }

  span {
    font-size: ${({ theme }) => theme.typography.fontSize.sm};
    color: ${({ theme }) => theme.colors.textPrimary};
    font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  }
`;

const ATSResultMessage = styled.div`
  background: ${({ theme }) => theme.colors.successLight};
  border-radius: ${({ theme }) => theme.radius.lg};
  padding: ${({ theme }) => theme.spacing.lg};
  text-align: center;
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  border: 1px solid ${({ theme }) => theme.colors.success};
  color: ${({ theme }) => theme.colors.success};
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.sm};

  svg {
    flex-shrink: 0;
  }
`;

// Keywords Drawer Styled Components
const KeywordsSummaryRow = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 32px 24px;
  margin: 0 auto 8px;
  max-width: 600px;
`;

const KeywordsSummaryCount = styled.div`
  font-size: 56px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textPrimary};
  line-height: 1;
  letter-spacing: -2px;
`;

const KeywordsSummaryText = styled.div`
  font-size: 15px;
  color: ${({ theme }) => theme.colors.textTertiary};
  line-height: 1.4;
  text-align: center;
`;

const KeywordItemCard = styled.div`
  max-width: 600px;
  padding: 20px 0;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};

  &:first-child {
    padding-top: 0;
  }

  &:last-child {
    border-bottom: none;
    padding-bottom: 0;
  }
`;

const KeywordItemHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 12px;
`;

const KeywordBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: ${({ theme }) => theme.colors.textPrimary};
  font-size: 16px;
  font-weight: 600;
  letter-spacing: -0.2px;

  &::before {
    content: '';
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: var(--primary-500);
    flex-shrink: 0;
  }
`;

const KeywordImpact = styled.span`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.textTertiary};
  font-weight: 500;
`;

const KeywordDescription = styled.p`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.textTertiary};
  line-height: 1.5;
  margin: 0;
  text-align: center;
  padding: 8px 0;
`;

const KeywordContextList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const KeywordContext = styled.div`
  background: ${({ theme }) => theme.colors.backgroundAlt};
  border-radius: 12px;
  padding: 14px 16px;
  font-size: 14px;
  color: ${({ theme }) => theme.colors.textPrimary};
  line-height: 1.6;

  .section-label {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 12px;
    color: ${({ theme }) => theme.colors.textTertiary};
    margin-bottom: 8px;
    font-weight: 500;

    i {
      font-style: normal;
      color: ${({ theme }) => theme.colors.textTertiary};
    }
  }

  .highlight {
    background: linear-gradient(135deg, rgba(var(--primary-500-rgb), 0.15), rgba(var(--primary-500-rgb), 0.08));
    color: var(--primary-600);
    padding: 2px 6px;
    border-radius: 4px;
    font-weight: 600;

    @media (prefers-color-scheme: dark) {
      color: var(--primary-400);
    }
  }
`;

const KeywordNotFound = styled.div`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.textTertiary};
  padding: 14px 16px;
  border-radius: 12px;
  background: ${({ theme }) => theme.colors.backgroundAlt};
`;

// Role Recommendations Drawer Styled Components
const RoleItemCard = styled.div`
  max-width: 600px;
  padding: 20px 0;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};

  &:first-child {
    padding-top: 0;
  }

  &:last-child {
    border-bottom: none;
    padding-bottom: 0;
  }
`;

const RoleItemHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 10px;
`;

const RoleItemTitle = styled.span`
  font-size: 16px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textPrimary};
  letter-spacing: -0.2px;
`;

const RoleItemMatch = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: 13px;
  font-weight: 600;
  color: #10b981;
  background: rgba(16, 185, 129, 0.1);
  padding: 5px 12px;
  border-radius: 100px;

  svg {
    flex-shrink: 0;
  }
`;

const RoleItemDescription = styled.p`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.textSecondary};
  line-height: 1.6;
  margin: 0;
`;

const ClickableKeywordsCard = styled(Card)`
  text-align: center;
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(53, 162, 159, 0.2);
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

// Fake It Mode Warning Banner
const FakeItModeWarning = styled.div`
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
  border-radius: 12px;
  padding: 16px 20px;
  margin-bottom: 24px;
  display: flex;
  align-items: center;
  gap: 12px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 4px 12px rgba(245, 158, 11, 0.3);

  .warning-icon {
    font-size: 24px;
    flex-shrink: 0;
  }

  .warning-content {
    flex: 1;
  }

  .warning-title {
    font-size: 16px;
    font-weight: 700;
    margin-bottom: 4px;
    color: white;
  }

  .warning-text {
    font-size: 13px;
    opacity: 0.95;
    line-height: 1.4;
    color: white;
  }
`;

// Problem Severity Badge
const ProblemSeverityBadge = styled.span<{ $severity: "critical" | "important" | "minor" }>`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 12px;
  border-radius: ${({ theme }) => theme.radius.full};
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};

  ${({ $severity }) => {
    if ($severity === "critical") {
      return `
        background: rgba(239, 68, 68, 0.1);
        color: #ef4444;
        border: 1px solid rgba(239, 68, 68, 0.3);
      `;
    } else if ($severity === "important") {
      return `
        background: rgba(245, 158, 11, 0.1);
        color: #f59e0b;
        border: 1px solid rgba(245, 158, 11, 0.3);
      `;
    } else {
      return `
        background: rgba(34, 197, 94, 0.1);
        color: #22c55e;
        border: 1px solid rgba(34, 197, 94, 0.3);
      `;
    }
  }}
`;

// Problem Text Components
const ProblemText = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
  padding: ${({ theme }) => theme.spacing.sm};
  background: rgba(239, 68, 68, 0.05);
  border-left: 3px solid #ef4444;
  border-radius: ${({ theme }) => theme.radius.sm};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const Section = styled.section`
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

// Bento Grid Components - Matches StatBentoCard style
const BentoGrid = styled.div`
  display: grid;
  width: 100%;
  gap: 16px;
  grid-template-columns: 1fr;
  margin-bottom: ${({ theme }) => theme.spacing.xl};

  @media (min-width: 640px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (min-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const BentoCard = styled.div<{ $rowSpan?: number; $position?: 'left' | 'right' | 'middle' }>`
  position: relative;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border-radius: 16px;
  background: var(--bg-alt);
  transition: all 0.3s ease;

  /* Match StatBentoCard shadow */
  box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.03), 0 2px 4px rgba(0, 0, 0, 0.05),
    0 12px 24px rgba(0, 0, 0, 0.05);

  @media (prefers-color-scheme: dark) {
    box-shadow: 0 -20px 80px -20px rgba(255, 255, 255, 0.12) inset;
    border: 1px solid rgba(255, 255, 255, 0.1);
  }

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.12);
  }

  @media (prefers-color-scheme: dark) {
    &:hover {
      box-shadow: 0 -20px 80px -20px rgba(255, 255, 255, 0.18) inset,
        0 20px 40px rgba(0, 0, 0, 0.3);
    }
  }

  /* Row span for desktop */
  @media (min-width: 1024px) {
    ${({ $rowSpan }) => $rowSpan === 2 && `
      grid-row: span 2;
    `}
  }
`;

const BentoCardInner = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
`;

const BentoCardContent = styled.div`
  padding: 20px;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

// Keep for backwards compatibility but don't use
const BentoCardIcon = styled.div<{ $color?: string }>`
  display: none;
`;

const BentoCardTitle = styled.h3`
  font-size: 18px;
  font-weight: 600;
  color: var(--text-color);
  margin-bottom: 4px;

  @media (max-width: 640px) {
    font-size: 16px;
  }
`;

const BentoCardDescription = styled.p`
  color: var(--text-secondary);
  font-size: 14px;
  line-height: 1.4;
  margin-bottom: 16px;
`;

const BentoCardBody = styled.div`
  flex: 1;
  color: var(--text-color);
  font-size: 14px;
  line-height: 1.6;

  p {
    margin: 0;
    line-height: 1.6;
  }
`;

const BentoOverlay = styled.div`
  pointer-events: none;
  position: absolute;
  inset: 0;
  transition: all 0.3s ease;
  border-radius: 16px;
`;

const KeywordList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const BulletList = styled.ul`
  list-style: disc;
  padding-left: 20px;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;

  li {
    color: var(--text-color);
    font-size: 14px;
    line-height: 1.6;
    padding-left: 4px;

    &::marker {
      color: var(--text-secondary);
    }
  }
`;

const ProUpgradeCard = styled(Card)`
  background: var(--bg-alt);
  border: 1px solid var(--border-color);
  text-align: center;
`;

const MainCTAButton = styled(Button)`
  background: var(--text-color) !important;
  color: var(--bg-color) !important;
  font-size: 16px;
  font-weight: 600;
  padding: 14px 24px;
  width: 100%;
  margin-top: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.2s ease;

  &:hover {
    opacity: 0.9;
  }
`;

const UpgradeTitle = styled.h3`
  font-size: 22px;
  font-weight: 600;
  color: var(--text-color);
  margin-bottom: 16px;
`;

const UpgradeFeatures = styled.ul`
  text-align: left;
  list-style: none;
  margin: ${({ theme }) => theme.spacing.lg} 0;

  li {
    margin-bottom: ${({ theme }) => theme.spacing.sm};
    padding-left: ${({ theme }) => theme.spacing.lg};
    position: relative;

    &:before {
      content: "✓";
      position: absolute;
      left: 0;
      font-weight: bold;
    }
  }
`;

// Blurred Preview Components for Free Users
const BlurredPreviewSection = styled.div<{ $isVisible?: boolean }>`
  position: relative;
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const BlurredContent = styled.div`
  position: relative;
  filter: blur(5px);
  user-select: none;
  pointer-events: none;
  opacity: 0.6;
`;

const SeeMoreButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  padding: 12px 20px;
  background: var(--bg-color);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  color: var(--text-color);
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-top: 16px;

  &:hover {
    background: var(--bg-alt);
    border-color: var(--text-secondary);
  }

  svg {
    width: 16px;
    height: 16px;
    color: var(--text-secondary);
  }
`;

const LockedPreview = styled.div`
  margin-top: 16px;
  padding: 12px;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.08) 0%, rgba(118, 75, 162, 0.08) 100%);
  border: 1px dashed rgba(102, 126, 234, 0.3);
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 10px;
`;

const LockedIcon = styled.div`
  width: 32px;
  height: 32px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  flex-shrink: 0;

  svg {
    width: 16px;
    height: 16px;
  }
`;

const LockedText = styled.div`
  flex: 1;

  span {
    display: block;
    font-size: 13px;
    font-weight: 600;
    color: var(--text-color);
  }

  small {
    font-size: 12px;
    color: var(--text-secondary);
  }
`;

const AnimatedUnlockOverlay = styled.div<{ $isVisible: boolean }>`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) ${({ $isVisible }) => $isVisible ? 'scale(1)' : 'scale(0.8)'};
  z-index: 10;
  text-align: center;
  background: linear-gradient(
    135deg,
    rgba(102, 126, 234, 0.95) 0%,
    rgba(118, 75, 162, 0.95) 100%
  );
  padding: ${({ theme }) => theme.spacing.lg};
  border-radius: ${({ theme }) => theme.radius.lg};
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(10px);
  opacity: ${({ $isVisible }) => $isVisible ? 1 : 0};
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
`;

const BeforeAfterContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${({ theme }) => theme.spacing.md};
  margin-bottom: ${({ theme }) => theme.spacing.md};

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

const BeforeAfterBox = styled.div<{ $type: 'before' | 'after' }>`
  padding: ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ $type }) =>
    $type === 'before'
      ? 'rgba(239, 68, 68, 0.1)'
      : 'rgba(16, 185, 129, 0.1)'
  };
  border: 1px solid ${({ $type }) =>
    $type === 'before'
      ? 'rgba(239, 68, 68, 0.3)'
      : 'rgba(16, 185, 129, 0.3)'
  };
`;

const BeforeAfterLabel = styled.div<{ $type: 'before' | 'after' }>`
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: ${({ theme }) => theme.spacing.xs};
  color: ${({ $type }) =>
    $type === 'before' ? '#ef4444' : '#10b981'
  };
`;

const BeforeAfterText = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  line-height: 1.5;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const UnlockOverlay = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 10;
  text-align: center;
  background: linear-gradient(
    135deg,
    rgba(102, 126, 234, 0.95) 0%,
    rgba(118, 75, 162, 0.95) 100%
  );
  padding: ${({ theme }) => theme.spacing.lg};
  border-radius: ${({ theme }) => theme.radius.lg};
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(10px);
`;

const UnlockIconWrapper = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.sm};
  animation: pulse 2s ease-in-out infinite;
  color: white;

  svg {
    width: 32px;
    height: 32px;
  }

  @keyframes pulse {
    0%,
    100% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.1);
    }
  }
`;

const LockIcon = () => (
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
      d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
    />
  </svg>
);

const UnlockTitle = styled.h4`
  font-size: ${({ theme }) => theme.typography.fontSize.xl};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: white;
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const UnlockDescription = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const UnlockButton = styled(Button)`
  background: white !important;
  color: var(--accent) !important;
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(255, 255, 255, 0.3);
  }
`;

// Testimonial Carousel
const TestimonialCarousel = styled.div`
  position: relative;
  overflow: hidden;
  background: var(--bg-color);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 16px;
  min-height: 100px;
`;

const TestimonialSlide = styled.div<{ $isActive: boolean }>`
  position: ${({ $isActive }) => $isActive ? 'relative' : 'absolute'};
  top: 0;
  left: 0;
  right: 0;
  opacity: ${({ $isActive }) => $isActive ? 1 : 0};
  transform: ${({ $isActive }) => $isActive ? 'translateY(0)' : 'translateY(10px)'};
  transition: all 0.5s ease-in-out;
  pointer-events: ${({ $isActive }) => $isActive ? 'auto' : 'none'};
`;

const TestimonialText = styled.p`
  font-size: 14px;
  font-style: italic;
  color: var(--text-color);
  margin-bottom: 8px;
  line-height: 1.5;
`;

const TestimonialAuthor = styled.div`
  font-size: 12px;
  color: var(--text-secondary);
  text-align: center;
  margin-top: 8px;
`;

const TestimonialDots = styled.div`
  display: flex;
  justify-content: center;
  gap: 6px;
  margin-top: 8px;
`;

const TestimonialDot = styled.div<{ $isActive: boolean }>`
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: ${({ $isActive }) => $isActive ? 'var(--text-color)' : 'var(--border-color)'};
  transition: all 0.3s ease;
`;

const testimonials = [
  {
    text: "Fresh out of college with no experience, I was getting zero callbacks. After upgrading, I landed my first dev job in 2 weeks!",
    author: "Alex K.",
    role: "Junior Developer, 22"
  },
  {
    text: "6 months unemployed and losing hope. This tool rewrote my CV and I got 4 interviews in one week. Now happily employed!",
    author: "Maria S.",
    role: "Marketing Associate, 28"
  },
  {
    text: "As a recent graduate competing with experienced candidates, the optimized bullets made my internships shine. Got my dream job!",
    author: "James L.",
    role: "Business Analyst, 23"
  },
  {
    text: "Was laid off and struggling for 4 months. The Pro analysis showed exactly why I wasn't getting callbacks. Employed within 3 weeks!",
    author: "David R.",
    role: "Sales Rep, 31"
  },
  {
    text: "No one was looking at my applications. After the upgrade, recruiters started reaching out to ME. Life-changing!",
    author: "Sophie T.",
    role: "Junior Designer, 24"
  },
  {
    text: "Graduated during tough times with zero responses. This tool helped me land a role at a Fortune 500 company!",
    author: "Ryan M.",
    role: "Data Analyst, 25"
  },
  {
    text: "8 months of unemployment depression ended after using Pro. The rewritten CV got me 5 callbacks in the first week.",
    author: "Emma W.",
    role: "HR Coordinator, 29"
  },
  {
    text: "First job hunt after university was brutal. The ATS optimization made all the difference. Finally working in tech!",
    author: "Chris P.",
    role: "Software Engineer, 23"
  }
];

// Buy Credits Modal Components
const PricingGrid = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.spacing.md};
  grid-template-columns: repeat(3, 1fr);

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const PricingCard = styled.div<{ $featured?: boolean }>`
  padding: ${({ theme }) => theme.spacing.lg};
  background: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.radius.lg};
  border: ${({ $featured }) => $featured ? '2px solid #667eea' : '1px solid'};
  border-color: ${({ $featured, theme }) => $featured ? '#667eea' : theme.colors.border};
  position: relative;
`;

const PricingFeaturedBadge = styled.div`
  position: absolute;
  top: -10px;
  right: 16px;
`;

const PricingHeader = styled.div`
  text-align: center;
  padding-bottom: ${({ theme }) => theme.spacing.md};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const PricingName = styled.h3`
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const PricingPrice = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize["2xl"]};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: #667eea;

  span {
    font-size: ${({ theme }) => theme.typography.fontSize.sm};
    font-weight: ${({ theme }) => theme.typography.fontWeight.normal};
    color: ${({ theme }) => theme.colors.textSecondary};
  }
`;

const PricingSubtext = styled.p`
  font-size: 12px;
  color: #10b981;
  font-weight: 600;
  margin-top: 4px;
`;

// Windows 10 style fullscreen success overlay
const FullscreenSuccessOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #312e81 100%);
  z-index: 10000;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  animation: fadeInOverlay 0.8s ease;

  @keyframes fadeInOverlay {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
`;

const SuccessContent = styled.div`
  text-align: center;
  max-width: 600px;
  padding: 40px;
  animation: slideUpContent 1s ease 0.3s both;

  @keyframes slideUpContent {
    from {
      opacity: 0;
      transform: translateY(40px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const WelcomeSuccessIcon = styled.div`
  width: 120px;
  height: 120px;
  margin: 0 auto 40px;
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: scaleInIcon 0.6s ease 0.5s both;
  box-shadow: 0 20px 60px rgba(16, 185, 129, 0.4);

  @keyframes scaleInIcon {
    from {
      transform: scale(0);
    }
    to {
      transform: scale(1);
    }
  }

  svg {
    width: 60px;
    height: 60px;
    stroke: white;
    stroke-width: 3;
  }
`;

const WelcomeSuccessTitle = styled.h1`
  font-size: 48px;
  font-weight: 700;
  margin-bottom: 24px;
  background: linear-gradient(135deg, #667eea 0%, #a78bfa 50%, #f472b6 100%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: fadeInText 0.8s ease 0.8s both;

  @keyframes fadeInText {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  @media (max-width: 768px) {
    font-size: 32px;
  }
`;

const SuccessMessage = styled.p`
  font-size: 20px;
  color: #cbd5e1;
  line-height: 1.6;
  margin-bottom: 40px;
  animation: fadeInText 0.8s ease 1s both;

  @media (max-width: 768px) {
    font-size: 16px;
  }
`;

const SuccessQuote = styled.div`
  padding: 24px 32px;
  background: rgba(102, 126, 234, 0.15);
  border-radius: 16px;
  border: 1px solid rgba(102, 126, 234, 0.3);
  animation: fadeInText 0.8s ease 1.2s both;

  p {
    font-size: 16px;
    color: #a5b4fc;
    font-style: italic;
    margin: 0;
    line-height: 1.6;
  }
`;

const LoadingDots = styled.div`
  display: flex;
  gap: 8px;
  justify-content: center;
  margin-top: 40px;
  animation: fadeInText 0.8s ease 1.4s both;

  span {
    width: 8px;
    height: 8px;
    background: #667eea;
    border-radius: 50%;
    animation: dotPulse 1.4s ease infinite;

    &:nth-child(2) {
      animation-delay: 0.2s;
    }
    &:nth-child(3) {
      animation-delay: 0.4s;
    }
  }

  @keyframes dotPulse {
    0%, 80%, 100% {
      transform: scale(0.6);
      opacity: 0.5;
    }
    40% {
      transform: scale(1);
      opacity: 1;
    }
  }
`;

const PricingFeatureList = styled.ul`
  list-style: none;
  margin-bottom: ${({ theme }) => theme.spacing.md};
  padding: 0;
`;

const PricingFeatureItem = styled.li`
  display: flex;
  align-items: start;
  gap: ${({ theme }) => theme.spacing.xs};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  color: ${({ theme }) => theme.colors.textSecondary};

  svg {
    width: 16px;
    height: 16px;
    flex-shrink: 0;
    color: #10b981;
    margin-top: 1px;
  }
`;

const PricingCheckIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
    <path
      fillRule="evenodd"
      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
      clipRule="evenodd"
    />
  </svg>
);

// Guarantee Badge
const GuaranteeBadge = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.xs};
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  color: rgba(255, 255, 255, 0.9);
  margin-top: ${({ theme }) => theme.spacing.sm};
`;

// Social Proof Components
const HeroStat = styled.div`
  text-align: center;
  padding: 16px;
  margin-bottom: 16px;
  background: var(--bg-color);
  border: 1px solid var(--border-color);
  border-radius: 8px;
`;

const HeroStatNumber = styled.div`
  font-size: 32px;
  font-weight: 700;
  color: var(--success);
  margin-bottom: 4px;
`;

const HeroStatLabel = styled.div`
  font-size: 14px;
  color: var(--text-secondary);
`;

const SocialProofContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  margin-bottom: 16px;

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

const SocialProofBadge = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px;
  background: var(--bg-color);
  border: 1px solid var(--border-color);
  border-radius: 8px;
`;

const ProofIcon = styled.span`
  font-size: 20px;
  color: var(--text-secondary);
`;

const ProofText = styled.div`
  font-size: 13px;
  line-height: 1.4;
  color: var(--text-color);
`;

// Personalized Message
const PersonalizedAlert = styled.div<{
  $variant: "danger" | "warning" | "success";
}>`
  padding: ${({ theme }) => theme.spacing.lg};
  border-radius: ${({ theme }) => theme.radius.lg};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  background: ${({ $variant }) => {
    if ($variant === "danger")
      return "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)";
    if ($variant === "warning")
      return "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)";
    return "linear-gradient(135deg, var(--success) 0%, var(--success-dark) 100%)";
  }};
  color: white;
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  line-height: 1.6;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
`;

// Comparison Table
const ComparisonTable = styled.div`
  background: var(--bg-color);
  border-radius: 8px;
  overflow: hidden;
  margin: 16px 0;
  border: 1px solid var(--border-color);
`;

const ComparisonRow = styled.div<{ $isHeader?: boolean }>`
  display: grid;
  grid-template-columns: 2fr 1fr 1fr;
  border-bottom: 1px solid var(--border-color);

  ${({ $isHeader }) =>
    $isHeader &&
    `
    background: var(--bg-alt);
    font-weight: 600;
  `}

  &:last-child {
    border-bottom: none;
  }
`;

const ComparisonCell = styled.div`
  padding: 12px 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  color: var(--text-color);

  &:first-child {
    justify-content: flex-start;
    font-weight: 500;
  }
`;

// Price Display
const PriceDisplay = styled.div`
  margin: ${({ theme }) => theme.spacing.lg} 0;
`;

const OldPrice = styled.span`
  text-decoration: line-through;
  opacity: 0.7;
  margin-right: ${({ theme }) => theme.spacing.sm};
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
`;

const CurrentPrice = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSize["3xl"]};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: white;
`;

const DiscountBadge = styled.span`
  display: inline-block;
  background: var(--success);
  color: white;
  padding: 4px 12px;
  border-radius: ${({ theme }) => theme.radius.full};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  margin-left: ${({ theme }) => theme.spacing.sm};
`;

// Before/After Comparison Components
const BeforeAfterCard = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  position: relative;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 8px;
  }

  &::before {
    content: '';
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    width: 28px;
    height: 28px;
    background: var(--bg-alt);
    border: 1px solid var(--border-color);
    border-radius: 50%;
    z-index: 1;

    @media (max-width: 768px) {
      display: none;
    }
  }

  &::after {
    content: '→';
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    color: var(--text-secondary);
    font-size: 12px;
    font-weight: bold;
    z-index: 2;

    @media (max-width: 768px) {
      display: none;
    }
  }
`;

const ComparisonColumn = styled.div<{ $isAfter?: boolean }>`
  padding: 14px;
  background: var(--bg-color);
  border: 1px solid ${({ $isAfter }) => $isAfter ? 'var(--success)' : 'var(--border-color)'};
  border-radius: 8px;
`;

const ColumnLabel = styled.div<{ $isAfter?: boolean }>`
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: ${({ $isAfter }) => ($isAfter ? "var(--success)" : "var(--text-secondary)")};
  margin-bottom: 10px;
`;

const ComparisonText = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  line-height: 1.6;
  color: ${({ theme }) => theme.colors.textPrimary};
  margin: 0;

  @media (max-width: 768px) {
    font-size: ${({ theme }) => theme.typography.fontSize.xs};
  }
`;

const SampleBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 5px 10px;
  background: var(--bg-alt);
  border: 1px solid var(--border-color);
  border-radius: 20px;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: var(--text-secondary);
  margin-bottom: 14px;

  &::before {
    content: '';
    width: 6px;
    height: 6px;
    background: var(--text-secondary);
    border-radius: 50%;
  }
`;

const ArrowIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  color: var(--success);

  @media (max-width: 768px) {
    transform: rotate(90deg);
    margin: ${({ theme }) => theme.spacing.sm} 0;
  }
`;

const RoleCard = styled.div`
  padding: 14px;
  background: var(--bg-color);
  border: 1px solid var(--border-color);
  border-radius: 8px;
`;

const RoleCardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
  gap: 12px;

  @media (max-width: 640px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
`;

const RoleTitle = styled.h4`
  font-size: 16px;
  font-weight: 600;
  color: var(--text-color);
  margin: 0;
`;

const RoleFitBadge = styled.div`
  display: inline-flex;
  align-items: center;
  padding: 4px 10px;
  background: var(--bg-alt);
  border: 1px solid var(--border-color);
  color: var(--success);
  border-radius: 4px;
  font-size: 12px;
  font-weight: 600;
  white-space: nowrap;
`;

const RoleDescription = styled.p`
  font-size: 13px;
  line-height: 1.6;
  color: var(--text-secondary);
  margin: 0;
`;

const ATSTipCard = styled.div`
  padding: 14px;
  background: var(--bg-color);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  display: flex;
  gap: 12px;
  align-items: flex-start;
`;

const ATSIcon = styled.div`
  flex-shrink: 0;
  width: 36px;
  height: 36px;
  background: var(--bg-alt);
  border: 1px solid var(--border-color);
  color: var(--text-secondary);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ATSTipContent = styled.div`
  flex: 1;
`;

const ATSTipTitle = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.textPrimary};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

const ATSTipText = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  line-height: 1.6;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const ATSProofCard = styled.div`
  padding: 20px;
  background: var(--bg-color);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  text-align: center;
`;

const ATSProofIcon = styled.div`
  width: 48px;
  height: 48px;
  margin: 0 auto 14px;
  background: var(--bg-alt);
  border: 1px solid var(--border-color);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--success);

  svg {
    width: 24px;
    height: 24px;
  }
`;

const ATSProofTitle = styled.h4`
  font-size: 15px;
  font-weight: 600;
  color: var(--text-color);
  margin: 0 0 6px 0;
`;

const ATSProofText = styled.p`
  font-size: 13px;
  line-height: 1.5;
  color: var(--text-secondary);
  margin: 0 0 14px 0;
`;

const ATSProofFeatures = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  justify-content: center;
`;

const ATSProofFeature = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  background: var(--bg-alt);
  border: 1px solid var(--border-color);
  border-radius: 4px;
  font-size: 11px;
  font-weight: 500;
  color: var(--text-secondary);

  svg {
    width: 12px;
    height: 12px;
    color: var(--success);
  }
`;

const LoadingPlaceholder = styled.div`
  padding: 16px;
  text-align: center;
  color: var(--text-secondary);
  font-size: 14px;
  border: 1px dashed var(--border-color);
  border-radius: 8px;
`;

const PreviewModalBody = styled.div`
  display: flex;
  flex-direction: column;
  padding: 12px;
  overflow: hidden;
`;

const PDFPreviewContainer = styled.div`
  width: 100%;
  height: 65vh;
  min-height: 450px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 8px;
  overflow: hidden;
  background-color: ${({ theme }) => theme.colors.surface};

  @media (max-width: 640px) {
    height: 55vh;
    min-height: 350px;
  }
`;

const PDFViewer = styled.iframe`
  width: 100%;
  height: 100%;
  border: none;
`;

const PreviewActions = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  justify-content: flex-end;
  margin-top: ${({ theme }) => theme.spacing.lg};
`;

// Improvement Highlight in Modal - Compact style
const ImprovementHighlight = styled.div`
  background: var(--bg-alt);
  border-radius: 8px;
  padding: 10px 12px;
  margin-bottom: 10px;
  flex-shrink: 0;

  @media (prefers-color-scheme: dark) {
    border: 1px solid rgba(255, 255, 255, 0.08);
  }
`;

const HighlightHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  margin-bottom: 6px;
`;

const HighlightMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
`;

const HighlightCategory = styled.span`
  font-size: 11px;
  font-weight: 500;
  color: var(--text-tertiary);
  text-transform: uppercase;
  letter-spacing: 0.3px;
`;

const HighlightSection = styled.span`
  font-size: 11px;
  color: var(--text-tertiary);
  padding: 1px 6px;
  background: rgba(0, 0, 0, 0.05);
  border-radius: 3px;

  @media (prefers-color-scheme: dark) {
    background: rgba(255, 255, 255, 0.05);
  }
`;

const HighlightImpactBadge = styled.span`
  font-size: 14px;
  font-weight: 700;
  color: var(--success);
  background: rgba(16, 185, 129, 0.12);
  padding: 4px 10px;
  border-radius: 6px;
`;

const HighlightTitle = styled.div`
  display: none;
`;

const HighlightAction = styled.div`
  font-size: 13px;
  font-weight: 500;
  color: var(--text-color);
  line-height: 1.4;
  margin-bottom: 4px;
`;

const HighlightReason = styled.div`
  font-size: 12px;
  color: var(--text-secondary);
  line-height: 1.4;
`;

const HighlightImpact = styled.div`
  display: none;
`;

const FakeItToggleContainer = styled.div`
  display: flex;
  align-items: start;
  gap: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.lg};
  background: linear-gradient(135deg, #f59e0b 0%, #ea580c 100%);
  border-radius: ${({ theme }) => theme.radius.md};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.normal};

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(245, 158, 11, 0.3);
  }
`;

const FakeItCheckbox = styled.input`
  width: 20px;
  height: 20px;
  cursor: pointer;
  accent-color: white;
  margin-top: 2px;
`;

const FakeItContent = styled.div`
  flex: 1;
  color: white;
`;

const FakeItTitle = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

const FakeItDescription = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  opacity: 0.95;
  line-height: 1.5;
`;

const CVGenerationSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xl};
`;

const CVGenerationIntro = styled.div`
  text-align: center;
  padding: ${({ theme }) => theme.spacing.lg} 0;
`;

const IntroHeading = styled.h3`
  font-size: ${({ theme }) => theme.typography.fontSize.xl};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.textPrimary};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
  background: var(--gradient-primary);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const IntroSubtext = styled.p`
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  line-height: 1.6;
  max-width: 600px;
  margin: 0 auto;
`;

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: ${({ theme }) => theme.spacing.md};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const FeatureCard = styled.div`
  display: flex;
  align-items: start;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing.md};
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.md};
  transition: all ${({ theme }) => theme.transitions.fast};

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
    transform: translateY(-2px);
    box-shadow: 0 4px 12px ${({ theme }) => theme.colors.primary}15;
  }
`;

const FeatureIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: ${({ theme }) => theme.radius.full};
  background: var(--gradient-primary);
  color: white;
  font-size: 12px;
  flex-shrink: 0;
  margin-top: 2px;
`;

const FeatureText = styled.div`
  color: ${({ theme }) => theme.colors.textPrimary};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  line-height: 1.5;
`;

const FakeItSection = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const GenerateCTAContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  padding-top: ${({ theme }) => theme.spacing.lg};
  border-top: 1px solid ${({ theme }) => theme.colors.border};
`;

// Resume Actions - Minimal list style
const ResumeActionsList = styled.div`
  display: flex;
  flex-direction: column;
`;

const ResumeActionItem = styled.div<{ $disabled?: boolean }>`
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px 0;
  border-bottom: 1px solid var(--border-color);
  cursor: ${({ $disabled }) => $disabled ? 'not-allowed' : 'pointer'};
  opacity: ${({ $disabled }) => $disabled ? 0.5 : 1};
  transition: all 0.15s ease;

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    opacity: ${({ $disabled }) => $disabled ? 0.5 : 0.7};
  }
`;

const ResumeActionIcon = styled.div<{ $color?: string }>`
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: ${({ $color }) => $color ? `${$color}15` : 'rgba(102, 126, 234, 0.1)'};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  color: ${({ $color }) => $color || '#667eea'};

  svg {
    width: 20px;
    height: 20px;
  }
`;

const ResumeActionContent = styled.div`
  flex: 1;
  min-width: 0;
`;

const ResumeActionTitle = styled.div`
  font-size: 15px;
  font-weight: 600;
  color: var(--text-color);
`;

const ResumeActionDescription = styled.div`
  font-size: 14px;
  color: var(--text-secondary);
  margin-top: 2px;
`;

const ResumeActionArrow = styled.div`
  color: var(--text-tertiary);
  flex-shrink: 0;

  svg {
    width: 16px;
    height: 16px;
  }
`;

const ResumeStatusBadge = styled.div<{ $ready?: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  background: ${({ $ready }) => $ready ? 'rgba(16, 185, 129, 0.1)' : 'rgba(102, 126, 234, 0.1)'};
  color: ${({ $ready }) => $ready ? 'var(--success)' : '#667eea'};

  svg {
    width: 16px;
    height: 16px;
  }
`;

const ResumeFooter = styled.div<{ $variant?: 'default' | 'accent' }>`
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 18px 24px;
  background: ${({ $variant }) =>
    $variant === 'accent' ? 'rgba(245, 158, 11, 0.06)' : 'rgba(102, 126, 234, 0.04)'};
  border-top: 1px solid var(--border-color);
  cursor: pointer;
  transition: all 0.15s ease;

  &:hover {
    background: ${({ $variant }) =>
      $variant === 'accent' ? 'rgba(245, 158, 11, 0.1)' : 'rgba(102, 126, 234, 0.08)'};
  }
`;

const ResumeFooterIcon = styled.div<{ $color?: string }>`
  width: 36px;
  height: 36px;
  border-radius: 8px;
  background: ${({ $color }) => $color ? `${$color}20` : 'rgba(102, 126, 234, 0.15)'};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  color: ${({ $color }) => $color || '#667eea'};

  svg {
    width: 18px;
    height: 18px;
  }
`;

const ResumeFooterContent = styled.div`
  flex: 1;
`;

const ResumeFooterTitle = styled.div<{ $color?: string }>`
  font-size: 14px;
  font-weight: 600;
  color: ${({ $color }) => $color || 'var(--text-color)'};
`;

const ResumeFooterDescription = styled.div`
  font-size: 13px;
  color: var(--text-secondary);
  margin-top: 2px;
`;

const ActionCardIcon = styled.div<{ $variant?: 'primary' | 'secondary' | 'ghost' | 'accent' }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 8px;
  background: ${({ $variant }) =>
    $variant === 'primary' ? '#667eea' :
    $variant === 'accent' ? 'rgba(245, 158, 11, 0.15)' :
    'rgba(102, 126, 234, 0.1)'};

  svg {
    width: 18px;
    height: 18px;
    color: ${({ $variant }) =>
      $variant === 'primary' ? 'white' :
      $variant === 'accent' ? '#f59e0b' :
      '#667eea'};
  }
`;

const ActionCardTitle = styled.h4`
  font-size: 15px;
  font-weight: 600;
  color: var(--text-color);
  margin: 0;
`;

const ActionCardDescription = styled.p`
  font-size: 13px;
  color: var(--text-secondary);
  line-height: 1.5;
  margin: 0;
`;

const LearningRecommendationCard = styled.div`
  padding: ${({ theme }) => theme.spacing.lg};
  background: ${({ theme }) => theme.colors.surface};
  border: 2px solid #f59e0b;
  border-radius: ${({ theme }) => theme.radius.lg};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const SkillTitle = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.xl};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: #f59e0b;
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

const SkillCategory = styled.div`
  display: inline-block;
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
  background: rgba(245, 158, 11, 0.1);
  border: 1px solid rgba(245, 158, 11, 0.3);
  border-radius: ${({ theme }) => theme.radius.full};
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  color: #f59e0b;
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const LearningPathSection = styled.div`
  margin-top: ${({ theme }) => theme.spacing.md};
`;

const SectionTitle = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.textPrimary};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const TimeEstimate = styled.div`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
  background: linear-gradient(135deg, var(--success) 0%, var(--success-dark) 100%);
  color: white;
  border-radius: ${({ theme }) => theme.radius.full};
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  margin-left: auto;
`;

const CareerInsightCard = styled.div`
  position: relative;
  padding: ${({ theme }) => theme.spacing["2xl"]};
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid rgba(139, 92, 246, 0.3);
  border-radius: ${({ theme }) => theme.radius.xl};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, #8b5cf6 0%, #ec4899 100%);
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    padding: ${({ theme }) => theme.spacing.xl};
  }
`;

const InsightHeader = styled.div`
  display: flex;
  align-items: start;
  gap: ${({ theme }) => theme.spacing.lg};
  margin-bottom: ${({ theme }) => theme.spacing.xl};

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    flex-direction: column;
    gap: ${({ theme }) => theme.spacing.md};
  }
`;

const InsightIcon = styled.div`
  width: 64px;
  height: 64px;
  background: linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%);
  border-radius: ${({ theme }) => theme.radius.xl};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32px;
  flex-shrink: 0;
  box-shadow: 0 8px 20px rgba(139, 92, 246, 0.3);
`;

const InsightContent = styled.div`
  flex: 1;
`;

const InsightTitle = styled.h3`
  font-size: ${({ theme }) => theme.typography.fontSize["2xl"]};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.textPrimary};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
  line-height: 1.3;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    font-size: ${({ theme }) => theme.typography.fontSize.xl};
  }
`;

const InsightSubtitle = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  color: ${({ theme }) => theme.colors.textSecondary};
  line-height: 1.6;
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const MatchScoreBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.md};
  background: rgba(139, 92, 246, 0.1);
  border: 1px solid rgba(139, 92, 246, 0.3);
  border-radius: ${({ theme }) => theme.radius.full};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: #8b5cf6;
`;

const AlternativeRolesSection = styled.div`
  margin-top: ${({ theme }) => theme.spacing.xl};
`;

const SectionLabel = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.textSecondary};
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const AlternativeRolesList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: ${({ theme }) => theme.spacing.md};

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    grid-template-columns: 1fr;
  }
`;

const AlternativeRoleItem = styled.div`
  padding: ${({ theme }) => theme.spacing.lg};
  background: linear-gradient(
    135deg,
    rgba(139, 92, 246, 0.05) 0%,
    rgba(236, 72, 153, 0.05) 100%
  );
  border: 1px solid rgba(139, 92, 246, 0.2);
  border-radius: ${({ theme }) => theme.radius.lg};
  transition: all ${({ theme }) => theme.transitions.normal};
  cursor: pointer;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(139, 92, 246, 0.15);
    border-color: rgba(139, 92, 246, 0.4);
  }
`;

const RoleHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: start;
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const RoleName = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.textPrimary};
  line-height: 1.4;
`;

const RoleMatch = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: var(--success);
`;

const RoleMatchIcon = styled.div`
  width: 20px;
  height: 20px;
  background: linear-gradient(135deg, var(--success) 0%, var(--success-dark) 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 12px;
`;

// Score Breakdown Card - FixesCard tarzında
const ScoreBreakdownCard = styled.div`
  background: var(--bg-alt);
  border-radius: 16px;
  overflow: hidden;

  box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.03), 0 2px 4px rgba(0, 0, 0, 0.05),
    0 12px 24px rgba(0, 0, 0, 0.05);

  @media (prefers-color-scheme: dark) {
    box-shadow: 0 -20px 80px -20px rgba(255, 255, 255, 0.12) inset;
    border: 1px solid rgba(255, 255, 255, 0.1);
  }
`;

const ScoreBreakdownHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  gap: 16px;
  flex-wrap: wrap;

  @media (max-width: 640px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const ScoreBreakdownHeaderLeft = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const ScoreBreakdownTitle = styled.h3`
  font-size: 18px;
  font-weight: 600;
  color: var(--text-color);
  margin: 0;
`;

const ScoreBreakdownSubtitle = styled.p`
  font-size: 14px;
  color: var(--text-secondary);
  margin: 0;
`;

const ScoreBreakdownBadge = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 14px;
  border-radius: 8px;
`;

const ScoreBadgeValue = styled.span<{ $muted?: boolean }>`
  font-size: ${({ $muted }) => ($muted ? '16px' : '22px')};
  font-weight: 700;
  color: ${({ $muted }) => ($muted ? 'var(--text-tertiary)' : 'var(--success)')};
  line-height: 1;
`;

const ScoreBadgeArrow = styled.span`
  color: var(--text-tertiary);
  font-size: 14px;
`;

const ScoreBreakdownBody = styled.div`
  padding: 20px 24px;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const StackedBarContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const StackedBarLabel = styled.div<{ $align?: 'left' | 'right' }>`
  display: flex;
  flex-direction: column;
  align-items: ${({ $align }) => $align === 'right' ? 'flex-end' : 'flex-start'};
  gap: 2px;
  min-width: 70px;
`;

const StackedBarLabelTitle = styled.span`
  font-size: 11px;
  font-weight: 500;
  color: var(--text-tertiary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const StackedBarLabelValue = styled.span<{ $highlight?: boolean }>`
  font-size: 20px;
  font-weight: 700;
  color: ${({ $highlight }) => $highlight ? 'var(--success)' : 'var(--text-secondary)'};
  line-height: 1;
`;

const StackedBarWrapper = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const StackedBar = styled.div`
  height: 28px;
  background: var(--border-color);
  border-radius: 6px;
  overflow: hidden;
  display: flex;
  gap: 2px;
  padding: 2px;
`;

const StackedBarSegment = styled.div<{ $width: number; $color: string }>`
  height: 100%;
  width: ${({ $width }) => $width}%;
  background: ${({ $color }) => $color};
  opacity: 0.85;
  border-radius: 4px;
  transition: all 0.3s ease;
  cursor: default;

  &:hover {
    opacity: 1;
    transform: scaleY(1.08);
  }
`;

const BreakdownLegend = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 12px;
`;

const LegendItem = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const LegendDot = styled.div<{ $color: string }>`
  width: 10px;
  height: 10px;
  background: ${({ $color }) => $color};
  border-radius: 3px;
  flex-shrink: 0;
`;

const LegendText = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1px;
  min-width: 0;
`;

const LegendCategory = styled.span`
  font-size: 13px;
  font-weight: 500;
  color: var(--text-color);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const LegendValue = styled.span<{ $color: string }>`
  font-size: 12px;
  font-weight: 600;
  color: ${({ $color }) => $color};
`;

const ScoreBreakdownFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 24px;
  background: var(--accent);
  border-top: 1px solid ${({ theme }) => theme.colors.border};
`;

const BreakdownFooterLabel = styled.span`
  font-size: 14px;
  color: white;
  font-weight: 500;
`;

const BreakdownFooterValue = styled.span`
  font-size: 18px;
  font-weight: 700;
  color: var(--primary-500);
`;

// Generate Resume Card - FixesCard tarzında
const GenerateResumeCard = styled.div`
  background: var(--bg-alt);
  border-radius: 16px;
  overflow: hidden;

  box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.03), 0 2px 4px rgba(0, 0, 0, 0.05),
    0 12px 24px rgba(0, 0, 0, 0.05);

  @media (prefers-color-scheme: dark) {
    box-shadow: 0 -20px 80px -20px rgba(255, 255, 255, 0.12) inset;
    border: 1px solid rgba(255, 255, 255, 0.1);
  }
`;

const GenerateResumeHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px;
  border-bottom: 1px solid var(--border-color);
  gap: 16px;

  @media (max-width: 640px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const GenerateResumeHeaderLeft = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const GenerateResumeTitle = styled.h3`
  font-size: 18px;
  font-weight: 600;
  color: var(--text-color);
  margin: 0;
`;

const GenerateResumeSubtitle = styled.p`
  font-size: 14px;
  color: var(--text-secondary);
  margin: 0;
`;

const GenerateResumeBody = styled.div`
  padding: 32px 24px;
`;

const GenerateResumeEmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  max-width: 400px;
  margin: 0 auto;
`;

const EmptyStateIcon = styled.div`
  width: 56px;
  height: 56px;
  margin-bottom: 16px;
  background: rgba(102, 126, 234, 0.1);
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #667eea;

  svg {
    width: 28px;
    height: 28px;
  }
`;

const EmptyStateTitle = styled.h4`
  font-size: 16px;
  font-weight: 600;
  color: var(--text-color);
  margin: 0 0 8px 0;
`;

const EmptyStateDescription = styled.p`
  font-size: 14px;
  color: var(--text-secondary);
  margin: 0 0 20px 0;
  line-height: 1.5;
`;

// Types are now imported from @/components/report

export default function ReportDetailPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const toast = useToast();
  const { user } = useAuth();
  const reportId = params.id as string;
  const shouldAutoUpgrade = searchParams.get('upgrade') === 'true';

  const [isLoading, setIsLoading] = useState(true);
  const [isUpgrading, setIsUpgrading] = useState(false);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  // Ref for upgrade section scroll
  const upgradeRef = useRef<HTMLDivElement>(null);

  const scrollToUpgrade = () => {
    upgradeRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };
  const [isGeneratingCV, setIsGeneratingCV] = useState(false);
  const [isAnalyzingOptimized, setIsAnalyzingOptimized] = useState(false);
  const [optimizedScore, setOptimizedScore] = useState<number | null>(null);
  const [improvementBreakdown, setImprovementBreakdown] = useState<
    Improvement[]
  >([]);
  const [report, setReport] = useState<Report | null>(null);
  const [jobPostingTitles, setJobPostingTitles] = useState<string[]>([]);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [pdfPreviewUrl, setPdfPreviewUrl] = useState<string | null>(null);
  const [selectedImprovement, setSelectedImprovement] =
    useState<Improvement | null>(null);
  const [fakeItMode, setFakeItMode] = useState(false);
  const [isCoverLetterModalOpen, setIsCoverLetterModalOpen] = useState(false);
  const [isPremiumModalOpen, setIsPremiumModalOpen] = useState(false);
  const [isBuyCreditsModalOpen, setIsBuyCreditsModalOpen] = useState(false);
  const [isBuyingCredits, setIsBuyingCredits] = useState<string | null>(null);
  const [purchaseSuccess, setPurchaseSuccess] = useState(false);
  const [isToolSuggestionModalOpen, setIsToolSuggestionModalOpen] = useState(false);
  const [isScoreBreakdownModalOpen, setIsScoreBreakdownModalOpen] = useState(false);
  const [isOptimizedScoreBreakdownModalOpen, setIsOptimizedScoreBreakdownModalOpen] = useState(false);
  const [isKeywordsModalOpen, setIsKeywordsModalOpen] = useState(false);
  const [isRoleRecommendationsDrawerOpen, setIsRoleRecommendationsDrawerOpen] = useState(false);
  const [optimizedScoreBreakdown, setOptimizedScoreBreakdown] = useState<ScoreBreakdown | null>(null);
  const [toolSuggestions, setToolSuggestions] = useState<ToolSuggestionResponse | null>(null);
  const [isLoadingToolSuggestions, setIsLoadingToolSuggestions] = useState(false);
  const [pendingCVGeneration, setPendingCVGeneration] = useState<{ fakeItMode: boolean } | null>(null);
  const wasGeneratingRef = useRef(false);
  const [userCredits, setUserCredits] = useState<UserCredits>({
    credits: 0,
    hasSubscription: false,
    canAnalyze: false,
  });

  // Computed values for systematic rendering
  const scoreRange: ScoreRange = report ? getScoreRange(report.fit_score) : "medium";
  const userState: UserState = report ? getUserState(report) : "free";
  const visibleSections = report
    ? getVisibleSections(
        scoreRange,
        userState,
        improvementBreakdown.length > 0,
        optimizedScore !== null && optimizedScore > report.fit_score
      )
    : null;
  const scoreMessage = getScoreMessage(scoreRange, userState);

  // Fetch user credits
  const fetchCredits = async () => {
    try {
      const response = await fetch("/api/user/credits");
      if (response.ok) {
        const data = await response.json();
        setUserCredits(data);
      }
    } catch (error) {
      console.error("Error fetching credits:", error);
    }
  };

  useEffect(() => {
    fetchCredits();
  }, []);

  // Buy credits handler
  const handleBuyCredits = async (planId: string, credits: number, planName: string) => {
    setIsBuyingCredits(planId);
    try {
      const response = await fetch("/api/credits/add-test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ credits, planName }),
      });

      if (response.ok) {
        await fetchCredits();
        setPurchaseSuccess(true);

        // Close modal after 5 seconds
        setTimeout(() => {
          setIsBuyCreditsModalOpen(false);
          setPurchaseSuccess(false);
        }, 5000);
      } else {
        alert("Failed to add credits");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error occurred");
    } finally {
      setIsBuyingCredits(null);
    }
  };

  // Auto-upgrade when coming from cover letters page
  const autoUpgradeTriggered = useRef(false);
  useEffect(() => {
    if (shouldAutoUpgrade && report && !report.pro && userCredits.canAnalyze && !autoUpgradeTriggered.current && !isLoading) {
      autoUpgradeTriggered.current = true;
      // Remove upgrade param from URL
      router.replace(`/reports/${reportId}`, { scroll: false });
      // Trigger upgrade
      setTimeout(() => {
        const upgradeButton = document.querySelector('[data-upgrade-button]') as HTMLButtonElement;
        if (upgradeButton) {
          upgradeButton.click();
        }
      }, 500);
    }
  }, [shouldAutoUpgrade, report, userCredits.canAnalyze, isLoading, router, reportId]);

  // Define analyzeOptimizedCV before useEffect that uses it
  const analyzeOptimizedCV = useCallback(async () => {
    if (!report) return;

    console.log("🔍 Starting resume analysis...", {
      reportId: report.id,
      hasGeneratedCV: !!report.generated_cv,
      currentOptimizedScore: optimizedScore,
    });

    setIsAnalyzingOptimized(true);
    try {
      const response = await fetch("/api/cv/analyze-optimized", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          reportId: report.id,
        }),
      });

      const result = await response.json();

      console.log("📊 Analysis result:", {
        ...result,
        fakeItMode: result.fakeItMode,
        cached: result.cached,
        improvementBreakdownType: typeof result.improvementBreakdown,
        improvementBreakdownValue: result.improvementBreakdown,
        isArray: Array.isArray(result.improvementBreakdown),
        length: result.improvementBreakdown?.length,
      });

      if (!response.ok) {
        throw new Error(result.error || "Analysis failed");
      }

      setOptimizedScore(result.fitScore);

      // Normalize improvement breakdown to match actual score difference
      if (
        result.improvementBreakdown &&
        Array.isArray(result.improvementBreakdown) &&
        result.improvementBreakdown.length > 0
      ) {
        const actualDifference = result.fitScore - report.fit_score;
        const totalImpact = result.improvementBreakdown.reduce(
          (sum: number, imp: Improvement) => sum + imp.impact,
          0
        );

        console.log("🎯 Breakdown normalization:", {
          actualDifference,
          totalImpact,
          needsNormalization: Math.abs(totalImpact - actualDifference) > 0.5,
        });

        // If AI's total doesn't match actual difference, normalize it
        if (totalImpact > 0 && Math.abs(totalImpact - actualDifference) > 0.5) {
          const scaleFactor = actualDifference / totalImpact;
          const normalizedBreakdown = result.improvementBreakdown.map(
            (imp: Improvement) => ({
              ...imp,
              impact: Math.round(imp.impact * scaleFactor * 10) / 10, // Round to 1 decimal
            })
          );
          console.log("✅ Setting normalized breakdown:", normalizedBreakdown);
          setImprovementBreakdown(normalizedBreakdown);
        } else {
          console.log(
            "✅ Setting original breakdown:",
            result.improvementBreakdown
          );
          setImprovementBreakdown(result.improvementBreakdown);
        }
      } else {
        console.log("⚠️ No breakdown data received");
        setImprovementBreakdown([]);
      }
    } catch (error) {
      console.error("❌ Failed to analyze optimized resume:", error);
      // Don't show error toast to user, just log it
    } finally {
      setIsAnalyzingOptimized(false);
    }
  }, [report, optimizedScore]);

  useEffect(() => {
    async function fetchReport() {
      if (!user) return;

      const supabase = createClient();
      const { data, error } = await supabase
        .from("reports")
        .select("*")
        .eq("id", reportId)
        .eq("user_id", user.id)
        .single();

      if (error || !data) {
        toast.error("Report not found");
        router.push("/reports");
        return;
      }

      // Fetch job posting titles from job_ids
      if (
        data.job_ids &&
        Array.isArray(data.job_ids) &&
        data.job_ids.length > 0
      ) {
        const { data: jobDocs, error: jobError } = await supabase
          .from("documents")
          .select("title")
          .in("id", data.job_ids)
          .eq("type", "job");

        if (!jobError && jobDocs) {
          setJobPostingTitles(jobDocs.map((doc) => doc.title));
        }
      }

      console.log("📋 Report loaded from database:", {
        reportId: data.id,
        hasGeneratedCV: !!data.generated_cv,
        fakeItMode: data.fake_it_mode,
        optimizedScore: {
          type: typeof data.optimized_score,
          value: data.optimized_score,
          isNumber: typeof data.optimized_score === "number",
        },
        improvementBreakdown: {
          exists: !!data.improvement_breakdown,
          type: typeof data.improvement_breakdown,
          length: data.improvement_breakdown?.length,
          isArray: Array.isArray(data.improvement_breakdown),
        },
      });

      setReport(data);

      // Load fake it mode from report
      if (data.fake_it_mode !== undefined) {
        setFakeItMode(data.fake_it_mode);
        console.log('📌 Loaded fake_it_mode from database:', data.fake_it_mode);
      }

      // Load cached analysis results from database if available
      const hasValidScore = typeof data.optimized_score === "number";
      const hasValidBreakdown =
        data.improvement_breakdown &&
        Array.isArray(data.improvement_breakdown);

      console.log("🔍 Cache validation:", {
        hasValidScore,
        hasValidBreakdown,
        fakeItMode: data.fake_it_mode,
        willLoadFromCache: hasValidScore,
      });

      if (hasValidScore) {
        console.log("✅ Loading from cache:", {
          score: data.optimized_score,
          fakeItMode: data.fake_it_mode,
          breakdownCount: data.improvement_breakdown?.length ?? 0,
          breakdown: data.improvement_breakdown,
        });
        setOptimizedScore(data.optimized_score);
        if (hasValidBreakdown) {
          setImprovementBreakdown(data.improvement_breakdown);
        }
        if (data.optimized_score_breakdown) {
          setOptimizedScoreBreakdown(data.optimized_score_breakdown);
        }
      } else {
        console.log("⚠️ Cache not available:", {
          reason: !hasValidScore ? "No valid score" : "No valid breakdown",
          willAnalyze: !!data.generated_cv,
        });
      }

      setIsLoading(false);
    }

    fetchReport();
  }, [user, reportId, router, toast]);

  // Testimonial carousel auto-rotate
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // Auto-analyze when CV exists but no score
  useEffect(() => {
    const shouldAnalyze =
      !isLoading &&
      report?.generated_cv &&
      optimizedScore === null &&
      !isAnalyzingOptimized &&
      typeof report.optimized_score !== "number";

    console.log("🔍 Analysis check:", {
      isLoading,
      hasCV: !!report?.generated_cv,
      currentScore: optimizedScore,
      analyzing: isAnalyzingOptimized,
      dbScore: report?.optimized_score,
      shouldAnalyze,
    });

    if (shouldAnalyze) {
      console.log("🚀 Triggering analysis");
      analyzeOptimizedCV();
    }
  }, [
    isLoading,
    report?.generated_cv,
    report?.optimized_score,
    optimizedScore,
    isAnalyzingOptimized,
    analyzeOptimizedCV,
  ]);

  // Scroll to top when CV generation completes
  useEffect(() => {
    if (wasGeneratingRef.current && !isGeneratingCV) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    wasGeneratingRef.current = isGeneratingCV;
  }, [isGeneratingCV]);

  // Helper function to get personalized message based on score
  const getPersonalizedMessage = (score: number) => {
    if (score < 50) {
      return {
        variant: "danger" as const,
        message:
          "⚠️ Your score is below average. 83% of users with similar scores got rejected. Upgrade now to fix critical issues and dramatically improve your chances.",
      };
    } else if (score >= 50 && score < 70) {
      return {
        variant: "warning" as const,
        message:
          "⚡ You're close! Users who upgraded from this range increased their interview rate by 67%. Don't let small gaps cost you opportunities.",
      };
    } else {
      return {
        variant: "success" as const,
        message:
          "🎯 Great score! Make it perfect - upgraded users in your range got 3x more responses. Stand out from other qualified candidates.",
      };
    }
  };

  // Helper function to find where keywords appear in the generated CV
  interface KeywordMatch {
    section: string;
    text: string;
  }

  const findKeywordInCV = (keyword: string, cv: GeneratedCV): KeywordMatch[] => {
    const matches: KeywordMatch[] = [];
    const keywordLower = keyword.toLowerCase();

    // Check summary
    if (cv.summary && cv.summary.toLowerCase().includes(keywordLower)) {
      matches.push({
        section: "Professional Summary",
        text: cv.summary,
      });
    }

    // Check experience bullets
    cv.experience?.forEach((exp) => {
      exp.bullets?.forEach((bullet) => {
        if (bullet.toLowerCase().includes(keywordLower)) {
          matches.push({
            section: `${exp.title} at ${exp.company}`,
            text: bullet,
          });
        }
      });
    });

    // Check skills
    const allSkills = [...(cv.skills?.technical || []), ...(cv.skills?.soft || [])];
    const matchingSkill = allSkills.find(skill =>
      skill.toLowerCase().includes(keywordLower) || keywordLower.includes(skill.toLowerCase())
    );
    if (matchingSkill) {
      matches.push({
        section: "Skills",
        text: `Added to skills section: ${matchingSkill}`,
      });
    }

    return matches;
  };

  // Helper to highlight keyword in text
  const highlightKeyword = (text: string, keyword: string): React.ReactNode => {
    const parts = text.split(new RegExp(`(${keyword})`, 'gi'));
    return parts.map((part, index) =>
      part.toLowerCase() === keyword.toLowerCase()
        ? <span key={index} className="highlight">{part}</span>
        : part
    );
  };

  const handleCreateFakeItReport = async () => {
    if (!report || isGeneratingCV) return;

    setIsGeneratingCV(true);
    try {
      // Report is already pro, generate CV with fake it mode (no credit cost)
      // The API will handle updating both generated_cv and fake_it_mode
      console.log('🚀 Starting fake it mode resume generation...');

      const cvResponse = await fetch("/api/cv/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          reportId: report.id,
          fakeItMode: true,
        }),
      });

      const cvResult = await cvResponse.json();

      if (!cvResponse.ok) {
        throw new Error(cvResult.error || "Failed to generate resume");
      }

      // Refresh the report data
      const supabase = createClient();
      const { data: updatedReport } = await supabase
        .from("reports")
        .select("*")
        .eq("id", report.id)
        .single();

      if (updatedReport) {
        setReport(updatedReport);
        // Update fake_it_mode state from database
        if (updatedReport.fake_it_mode !== undefined) {
          setFakeItMode(updatedReport.fake_it_mode);
          console.log('📌 Updated fake_it_mode in handleUpgradeToPro:', updatedReport.fake_it_mode);
        }

        // Generate PDF on client and save to optimized_cvs via API
        if (updatedReport.generated_cv) {
          try {
            const pdf = await generateCVPDF(updatedReport.generated_cv);
            const pdfBlob = pdf.output('blob');

            const userName = updatedReport.generated_cv.contact?.name || 'Optimized';
            const sanitizedName = userName.replace(/[^a-zA-Z0-9\s]/g, '').replace(/\s+/g, '_');
            const pdfFile = new File([pdfBlob], `${sanitizedName}.pdf`, { type: 'application/pdf' });

            // Use API to upload with service role (bypasses RLS)
            const formData = new FormData();
            formData.append('pdf', pdfFile);
            formData.append('reportId', updatedReport.id);

            const saveResponse = await fetch('/api/cv/save-optimized', {
              method: 'POST',
              body: formData,
            });

            const saveResult = await saveResponse.json();

            if (!saveResponse.ok) {
              console.error('Save error:', saveResult.error);
              throw new Error(saveResult.error);
            }

            console.log('✅ Resume saved to My resume via API (fake it mode)');
          } catch (saveError) {
            console.error('Error saving to My resume:', saveError);
          }
        }

        // Analyze the optimized resume to populate cache
        console.log('📊 Analyzing optimized resume to populate cache...');
        const analyzeResponse = await fetch("/api/cv/analyze-optimized", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            reportId: updatedReport.id,
          }),
        });

        if (analyzeResponse.ok) {
          const analysisResult = await analyzeResponse.json();
          console.log('✅ Analysis complete:', {
            optimizedScore: analysisResult.fitScore,
            originalScore: analysisResult.originalScore,
            fakeItMode: analysisResult.fakeItMode,
            breakdownCount: analysisResult.improvementBreakdown?.length
          });
          setOptimizedScore(analysisResult.fitScore);
          setImprovementBreakdown(analysisResult.improvementBreakdown || []);
          if (analysisResult.optimizedScoreBreakdown) {
            setOptimizedScoreBreakdown(analysisResult.optimizedScoreBreakdown);
          }

          // Refresh report to get updated cache from database
          const { data: finalReport } = await supabase
            .from("reports")
            .select("*")
            .eq("id", report.id)
            .single();

          if (finalReport) {
            setReport(finalReport);
            console.log('Report refreshed with cache:', {
              optimizedScore: finalReport.optimized_score,
              fakeItMode: finalReport.fake_it_mode,
              hasBreakdown: !!finalReport.improvement_breakdown
            });
          }
        } else {
          console.error('❌ Analysis failed:', await analyzeResponse.text());
        }
      }

      toast.success("Resume generated with Fake It Mode!");
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      toast.error(errorMessage);
    } finally {
      setIsGeneratingCV(false);
    }
  };

  const handleUpgradeToPro = async () => {
    if (!report) return;

    setIsUpgrading(true);
    try {
      const response = await fetch("/api/analyze/pro", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          reportId: report.id,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Upgrade failed");
      }

      // Refresh report
      const supabase = createClient();
      const { data } = await supabase
        .from("reports")
        .select("*")
        .eq("id", reportId)
        .single();

      if (data) {
        setReport(data);
        setIsUpgrading(false);

        // Show tool suggestion modal instead of auto-generating CV
        setPendingCVGeneration({ fakeItMode: false });
        setIsToolSuggestionModalOpen(true);
        const suggestions = await fetchToolSuggestions();
        setToolSuggestions(suggestions);
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Upgrade failed";
      toast.error(errorMessage);
      setIsUpgrading(false);
    }
  };

  // Complete CV generation after tool selection (used by upgrade flow)
  const completeUpgradeWithCV = async (additionalTools: string[] = []) => {
    if (!report) return;

    setIsGeneratingCV(true);
    try {
      const cvResponse = await fetch("/api/cv/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          reportId: report.id,
          fakeItMode: pendingCVGeneration?.fakeItMode ?? false,
          additionalTools,
        }),
      });

      if (cvResponse.ok) {
        // Refresh report to get generated_cv
        const supabase = createClient();
        const { data: updatedData } = await supabase
          .from("reports")
          .select("*")
          .eq("id", reportId)
          .single();

        if (updatedData) {
          // Update fake_it_mode state from database
          if (updatedData.fake_it_mode !== undefined) {
            setFakeItMode(updatedData.fake_it_mode);
            console.log('📌 Updated fake_it_mode after upgrade:', updatedData.fake_it_mode);
          }
          setReport(updatedData);

          // Generate PDF on client and save to optimized_cvs via API
          if (updatedData.generated_cv) {
            try {
              const pdf = await generateCVPDF(updatedData.generated_cv);
              const pdfBlob = pdf.output('blob');

              const userName = updatedData.generated_cv.contact?.name || 'Optimized';
              const sanitizedName = userName.replace(/[^a-zA-Z0-9\s]/g, '').replace(/\s+/g, '_');
              const pdfFile = new File([pdfBlob], `${sanitizedName}.pdf`, { type: 'application/pdf' });

              // Use API to upload with service role (bypasses RLS)
              const formData = new FormData();
              formData.append('pdf', pdfFile);
              formData.append('reportId', updatedData.id);

              const saveResponse = await fetch('/api/cv/save-optimized', {
                method: 'POST',
                body: formData,
              });

              const saveResult = await saveResponse.json();

              if (!saveResponse.ok) {
                console.error('Save error:', saveResult.error);
                throw new Error(saveResult.error);
              }

              console.log('Resume saved to My resume via API');
            } catch (saveError) {
              console.error('Error saving to My resume:', saveError);
            }
          }

          // Analyze optimized CV to get score improvement
          const analyzeResponse = await fetch("/api/cv/analyze-optimized", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              reportId: updatedData.id,
            }),
          });

          if (analyzeResponse.ok) {
            const analysisResult = await analyzeResponse.json();
            setOptimizedScore(analysisResult.optimizedScore);
            setImprovementBreakdown(analysisResult.improvements || []);
            if (analysisResult.optimizedScoreBreakdown) {
              setOptimizedScoreBreakdown(analysisResult.optimizedScoreBreakdown);
            }
          }
        }

        // Scroll to top after everything completes
        window.scrollTo({ top: 0, behavior: 'smooth' });
        const toolsMessage = additionalTools.length > 0
          ? ` ${additionalTools.length} additional tools added!`
          : "";
        toast.success(`Your optimized resume is ready!${toolsMessage}`);
      }
    } catch (cvError) {
      console.error("Resume generation error:", cvError);
      toast.error("Resume generation failed");
    } finally {
      setIsGeneratingCV(false);
      setPendingCVGeneration(null);
    }
  };

  // Fetch tool suggestions before CV generation
  const fetchToolSuggestions = async () => {
    if (!report) return null;

    setIsLoadingToolSuggestions(true);
    try {
      const response = await fetch("/api/cv/suggest-tools", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reportId: report.id }),
      });

      if (!response.ok) {
        console.error("Failed to fetch tool suggestions");
        return null;
      }

      const result = await response.json();
      return result.suggestions as ToolSuggestionResponse;
    } catch (error) {
      console.error("Error fetching tool suggestions:", error);
      return null;
    } finally {
      setIsLoadingToolSuggestions(false);
    }
  };

  // Handle tool selection confirm from modal
  const handleToolSuggestionConfirm = async (selectedTools: string[]) => {
    setIsToolSuggestionModalOpen(false);
    setToolSuggestions(null);
    await completeUpgradeWithCV(selectedTools);
  };

  // Handle skip from tool suggestion modal
  const handleToolSuggestionSkip = async () => {
    setIsToolSuggestionModalOpen(false);
    setToolSuggestions(null);
    await completeUpgradeWithCV([]);
  };

  const handlePreviewCV = async () => {
    if (!report?.generated_cv) return;

    try {
      const pdf = await generateCVPDF(report.generated_cv);
      const pdfBlob = pdf.output("blob");
      const blobUrl = URL.createObjectURL(pdfBlob);
      setPdfPreviewUrl(blobUrl);
      setIsPreviewOpen(true);

      // Save PDF to Storage for CV page
      savePDFToStorage(pdfBlob);
    } catch (error) {
      console.error("Resume preview error:", error);
      toast.error("Failed to preview resume. Please try again.");
    }
  };

  const handleRegenerateCV = async () => {
    if (!report) return;

    setIsGeneratingCV(true);
    try {
      const response = await fetch("/api/cv/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          reportId: report.id,
          fakeItMode: report.fake_it_mode || false,
          forceRegenerate: true,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to regenerate CV");
      }

      // Update local state with new CV
      setReport((prev) => prev ? { ...prev, generated_cv: data.cv } : null);

      // Generate and preview the new PDF
      const pdf = await generateCVPDF(data.cv);
      const pdfBlob = pdf.output("blob");
      const blobUrl = URL.createObjectURL(pdfBlob);
      setPdfPreviewUrl(blobUrl);

      toast.success("Resume regenerated successfully!");
    } catch (error) {
      console.error("Resume regeneration error:", error);
      toast.error("Failed to regenerate resume. Please try again.");
    } finally {
      setIsGeneratingCV(false);
    }
  };

  const savePDFToStorage = async (pdfBlob: Blob) => {
    if (!report) return;

    try {
      // Create FormData
      const formData = new FormData();
      formData.append("pdf", pdfBlob, `optimized-cv-${report.id}.pdf`);
      formData.append("reportId", report.id);

      // Call API endpoint
      const response = await fetch("/api/cv/save-optimized", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        console.error("Save error:", result.error);
        return;
      }

      console.log("✅ PDF saved successfully:", result.message);
    } catch (error) {
      console.error("Error saving PDF:", error);
    }
  };

  const handleDownloadCV = async () => {
    if (!report?.generated_cv) return;

    try {
      const pdf = await generateCVPDF(report.generated_cv);
      // Use just the name for better ATS compatibility
      const fileName = `${report.generated_cv.contact.name.replace(
        /\s+/g,
        "_"
      )}.pdf`;
      pdf.save(fileName);
      toast.success("Resume downloaded successfully! Check your downloads folder.");
      handleClosePreview(); // Close modal after download
    } catch (error) {
      console.error("Resume download error:", error);
      toast.error("Failed to download resume. Please try again.");
    }
  };

  // Helper function to get severity badge emoji and text
  const getSeverityInfo = (severity?: string) => {
    switch (severity) {
      case "critical":
        return { emoji: "🔴", text: "Critical Issue" };
      case "important":
        return { emoji: "🟡", text: "Important Gap" };
      case "minor":
        return { emoji: "🟢", text: "Minor Tweak" };
      default:
        return { emoji: "⚪", text: "Improvement" };
    }
  };

  // Helper function to calculate problem statistics
  const getProblemStats = (improvements: Improvement[]) => {
    const critical = improvements.filter((imp) => imp.severity === "critical");
    const important = improvements.filter((imp) => imp.severity === "important");
    const minor = improvements.filter((imp) => imp.severity === "minor");

    const criticalImpact = critical.reduce((sum, imp) => sum + imp.impact, 0);
    const importantImpact = important.reduce((sum, imp) => sum + imp.impact, 0);
    const minorImpact = minor.reduce((sum, imp) => sum + imp.impact, 0);

    return {
      critical: { count: critical.length, impact: criticalImpact },
      important: { count: important.length, impact: importantImpact },
      minor: { count: minor.length, impact: minorImpact },
      total: improvements.length,
      totalImpact: criticalImpact + importantImpact + minorImpact,
    };
  };

  const handleClosePreview = () => {
    setIsPreviewOpen(false);
    setSelectedImprovement(null);
    if (pdfPreviewUrl) {
      URL.revokeObjectURL(pdfPreviewUrl);
      setPdfPreviewUrl(null);
    }
  };

  const handleImprovementClick = async (improvement: Improvement) => {
    if (!report?.generated_cv) return;

    setSelectedImprovement(improvement);

    try {
      const pdf = await generateCVPDF(report.generated_cv, improvement.section);
      const pdfBlob = pdf.output("blob");
      const blobUrl = URL.createObjectURL(pdfBlob);
      setPdfPreviewUrl(blobUrl);
      setIsPreviewOpen(true);
    } catch (error) {
      console.error("Resume preview error:", error);
      toast.error("Failed to preview resume. Please try again.");
    }
  };

  if (isLoading) {
    return (
      <Container>
        <Spinner centered size="xl" />
      </Container>
    );
  }

  if (!report) {
    return null;
  }

  const missingKeywords = report.keywords?.missing || [];
  const rewrittenBullets = report.summary_pro?.rewrittenBullets || [];
  const roleRecommendations = report.role_fit || [];
  const atsFlags = report.ats_flags || [];

  return (
    <Container>
      <BackButton variant="ghost" size="sm" onClick={() => router.back()}>
        ← Back
      </BackButton>

      <Header>
        <TitleElements>
          <Title>Resume Analysis Report</Title>
          <Subtitle>
            {jobPostingTitles.length > 0
              ? `Job: ${jobPostingTitles.join(" • ")}`
              : `Created on ${new Date(report.created_at).toLocaleDateString("tr-TR")}`}
          </Subtitle>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '8px' }}>
            <MetaItemProOrFree $isPro={report.pro}>
              {report.pro ? "Pro" : "Free"}
            </MetaItemProOrFree>
            <span style={{ color: "#9ca3af", fontSize: "13px" }}>
              <i>{new Date(report.created_at).toLocaleDateString("tr-TR")}</i>
            </span>
          </div>
        </TitleElements>
        <CreditsCardWrapper>
          <CreditsCard />
        </CreditsCardWrapper>
      </Header>

      <HeaderMeta>
        

        {/* CV Action Button */}
        {(report.pro && report.generated_cv) || !report.pro ? (
          <CVActionButtonWrapper>
            {report.pro && report.generated_cv ? (
              <Button
                variant="primary"
                size="lg"
                onClick={handlePreviewCV}
                style={{
                  background: 'var(--accent)',
                  padding: '12px 24px',
                  fontSize: '15px',
                  fontWeight: '600',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                 
                }}
              >
                 View optimized resume
              </Button>
            ) : (
              <Button
                variant="primary"
                size="lg"
                onClick={userCredits.canAnalyze ? handleUpgradeToPro : () => setIsBuyCreditsModalOpen(true)}
                isLoading={isUpgrading}
                style={{
                  background: 'var(--gradient-primary)',
                  padding: '12px 24px',
                  fontSize: '15px',
                  fontWeight: '600',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
                }}
              >
                <RocketIcon /> Generate optimized resume
              </Button>
            )}
          </CVActionButtonWrapper>
        ) : null}
      </HeaderMeta>

      <StatsBentoGrid>
        {/* Match Score Card */}
        <StatBentoCard
          $isClickable={!!report.score_breakdown || visibleSections?.showScoreComparison}
          onClick={() => {
            if (visibleSections?.showScoreComparison && (optimizedScoreBreakdown || report.optimized_score_breakdown)) {
              setIsOptimizedScoreBreakdownModalOpen(true);
            } else if (report.score_breakdown) {
              setIsScoreBreakdownModalOpen(true);
            }
          }}
        >
          <StatBentoBackground>
            <ScoreBgCircle className="stat-bg-element" $score={report.fit_score} $size={120} $delay={0} style={{ top: '10%', right: '10%' }} />
            <ScoreBgCircle className="stat-bg-element" $score={report.fit_score} $size={80} $delay={0.5} style={{ top: '30%', right: '30%' }} />
            <ScoreBgCircle className="stat-bg-element" $score={report.fit_score} $size={60} $delay={1} style={{ top: '15%', right: '50%' }} />
          </StatBentoBackground>
          <StatBentoContent className="stat-content">
            <StatBentoIcon
              className="stat-icon"
              $color={(optimizedScore ?? report.fit_score) >= 85 ? 'var(--primary-500)' : (optimizedScore ?? report.fit_score) >= 70 ? '#2a57a0ff' : (optimizedScore ?? report.fit_score) >= 50 ? '#EAB308' : '#F97316'}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </StatBentoIcon>
            {visibleSections?.showScoreComparison ? (
              <>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px' }}>
                  <span style={{ fontSize: '24px', color: 'var(--text-secondary)', textDecoration: 'line-through' }}>{report.fit_score}%</span>
                  <StatBentoValue $color={optimizedScore! >= 85 ? 'var(--primary-500)' : optimizedScore! >= 70 ? '#2a57a0ff' : optimizedScore! >= 50 ? '#EAB308' : '#F97316'}>{optimizedScore}%</StatBentoValue>
                </div>
                <StatBentoTitle>Match Score</StatBentoTitle>
                <StatBentoDescription><strong>↑ +{optimizedScore! - report.fit_score}%</strong> improvement after optimization</StatBentoDescription>
              </>
            ) : (
              <>
                <StatBentoValue $color={report.fit_score >= 85 ? 'var(--primary-500)' : report.fit_score >= 70 ? '#2a57a0ff' : report.fit_score >= 50 ? '#EAB308' : '#F97316'}>
                  {report.fit_score}%
                </StatBentoValue>
                <StatBentoTitle>Match Score</StatBentoTitle>
                <StatBentoDescription>{getScoreLabel(report.fit_score)}</StatBentoDescription>
              </>
            )}
          </StatBentoContent>
          {(report.score_breakdown || visibleSections?.showScoreComparison) && (
            <StatBentoCTA className="stat-cta">
              <StatBentoCTALink>
                View breakdown
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </StatBentoCTALink>
            </StatBentoCTA>
          )}
          <StatBentoOverlay className="stat-overlay" />
        </StatBentoCard>

        {/* Keywords Card */}
        <StatBentoCard
          $isClickable={!!(report.pro && report.generated_cv)}
          onClick={() => {
            if (report.pro && report.generated_cv) {
              setIsKeywordsModalOpen(true);
            }
          }}
        >
          <StatBentoBackground>
            <KeywordBgTag className="stat-bg-element" $top={15} $left={60} $delay={0}>React</KeywordBgTag>
            <KeywordBgTag className="stat-bg-element" $top={25} $left={75} $delay={0.3}>TypeScript</KeywordBgTag>
            <KeywordBgTag className="stat-bg-element" $top={35} $left={55} $delay={0.6}>Node.js</KeywordBgTag>
            <KeywordBgTag className="stat-bg-element" $top={20} $left={85} $delay={0.9}>AWS</KeywordBgTag>
          </StatBentoBackground>
          <StatBentoContent className="stat-content">
            <StatBentoIcon className="stat-icon" $color="var(--accent)">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6z" />
              </svg>
            </StatBentoIcon>
            <StatBentoValue>{missingKeywords.length}</StatBentoValue>
            <StatBentoTitle>{report.pro && report.generated_cv ? 'Keywords Added' : 'Missing Keywords'}</StatBentoTitle>
            <StatBentoDescription>
              {report.pro && report.generated_cv
                ? 'Important keywords integrated into your optimized resume'
                : 'Add these keywords to improve your match score'}
            </StatBentoDescription>
          </StatBentoContent>
          {report.pro && report.generated_cv && (
            <StatBentoCTA className="stat-cta">
              <StatBentoCTALink>
                View details
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </StatBentoCTALink>
            </StatBentoCTA>
          )}
          <StatBentoOverlay className="stat-overlay" />
        </StatBentoCard>

        {/* Role Recommendations Card */}
        {visibleSections?.showRoleRecommendations && (
          <StatBentoCard
            $isClickable={roleRecommendations.length > 0}
            onClick={() => {
              if (roleRecommendations.length > 0) {
                setIsRoleRecommendationsDrawerOpen(true);
              }
            }}
          >
            <StatBentoBackground>
              <RoleBgBar className="stat-bg-element" $width={85} $top={20} $delay={0} />
              <RoleBgBar className="stat-bg-element" $width={70} $top={35} $delay={0.3} />
              <RoleBgBar className="stat-bg-element" $width={55} $top={50} $delay={0.6} />
            </StatBentoBackground>
            <StatBentoContent className="stat-content">
              <StatBentoIcon className="stat-icon" $color="var(--primary-500)">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0M12 12.75h.008v.008H12v-.008z" />
                </svg>
              </StatBentoIcon>
              <StatBentoValue $color="var(--primary-500)">{roleRecommendations.length}</StatBentoValue>
              <StatBentoTitle>Role Recommendations</StatBentoTitle>
              <StatBentoDescription>Alternative positions that match your profile</StatBentoDescription>
            </StatBentoContent>
            {roleRecommendations.length > 0 && (
              <StatBentoCTA className="stat-cta">
                <StatBentoCTALink>
                  View details
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                </StatBentoCTALink>
              </StatBentoCTA>
            )}
            <StatBentoOverlay className="stat-overlay" />
          </StatBentoCard>
        )}
      </StatsBentoGrid>

      {/* Personalized Alert - Show immediately after scores for free users */}
      {visibleSections?.showUpgradePrompt && (
        <PersonalizedAlert
          $variant={getPersonalizedMessage(report.fit_score).variant}
        >
          {getPersonalizedMessage(report.fit_score).message}
        </PersonalizedAlert>
      )}

      {visibleSections?.showCareerInsight &&
        roleRecommendations.length > 0 && (
          <CareerInsightCard>
            <InsightHeader>
              <InsightContent>
                <InsightTitle>We found better matches for you</InsightTitle>
                <InsightSubtitle>
                  Your resume shows a {report.fit_score}% match with this position.
                  Based on your experience and skills, these roles might be a
                  better fit for your career goals.
                </InsightSubtitle>
                <MatchScoreBadge>
                  Current Match: {report.fit_score}%
                </MatchScoreBadge>
              </InsightContent>
            </InsightHeader>

            <AlternativeRolesSection>
              <SectionLabel>Recommended Positions</SectionLabel>
              <AlternativeRolesList>
                {roleRecommendations.slice(0, 3).map((role, index) => (
                  <AlternativeRoleItem key={index}>
                    <RoleHeader>
                      <RoleName>{role.title}</RoleName>
                      <RoleMatch>
                        <RoleMatchIcon>✓</RoleMatchIcon>
                        {role.fit}%
                      </RoleMatch>
                    </RoleHeader>
                  </AlternativeRoleItem>
                ))}
              </AlternativeRolesList>
            </AlternativeRolesSection>
          </CareerInsightCard>
        )}

      {report.generated_cv && isAnalyzingOptimized && (
        <Section>
          <Card variant="bordered">
            <Card.Content style={{ textAlign: "center", padding: "40px" }}>
              <Spinner size="lg" />
              <p style={{ marginTop: "16px", color: "#9ca3af" }}>
                Analyzing optimized resume to calculate improvement breakdown...
              </p>
            </Card.Content>
          </Card>
        </Section>
      )}

      {/* ATS Optimized Card - For high-score users showing what was done */}
      {visibleSections?.showPerfectMatch && !isAnalyzingOptimized && (
        <Section>
          <ATSOptimizedCard>
            <ATSOptimizedHeader>
              <ATSOptimizedTitleSection>
                <ATSOptimizedTitle>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" style={{ width: 28, height: 28 }}>
                    <path fillRule="evenodd" d="M8.603 3.799A4.49 4.49 0 0112 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 013.498 1.307 4.491 4.491 0 011.307 3.497A4.49 4.49 0 0121.75 12a4.49 4.49 0 01-1.549 3.397 4.491 4.491 0 01-1.307 3.497 4.491 4.491 0 01-3.497 1.307A4.49 4.49 0 0112 21.75a4.49 4.49 0 01-3.397-1.549 4.49 4.49 0 01-3.498-1.306 4.491 4.491 0 01-1.307-3.498A4.49 4.49 0 012.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 011.307-3.497 4.49 4.49 0 013.497-1.307zm7.007 6.387a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
                  </svg>
                  Resume Optimized & ATS-Ready
                </ATSOptimizedTitle>
                <ATSOptimizedSubtitle>
                  Your resume has been professionally optimized with ATS-friendly formatting and enhanced language
                </ATSOptimizedSubtitle>
              </ATSOptimizedTitleSection>

              <ATSScoreBadge>
                <div className="score-number">{report.fit_score}%</div>
                <div className="score-label">Match Score</div>
              </ATSScoreBadge>
            </ATSOptimizedHeader>

            <ATSFeaturesList>
              <ATSFeatureItem>
                <CheckCircleFilledIcon />
                <span>ATS-Friendly Formatting</span>
              </ATSFeatureItem>
              <ATSFeatureItem>
                <CheckCircleFilledIcon />
                <span>Optimized Keywords</span>
              </ATSFeatureItem>
              <ATSFeatureItem>
                <CheckCircleFilledIcon />
                <span>Professional Language</span>
              </ATSFeatureItem>
              <ATSFeatureItem>
                <CheckCircleFilledIcon />
                <span>Achievement-Focused Bullets</span>
              </ATSFeatureItem>
            </ATSFeaturesList>

            <ATSResultMessage>
              <CheckCircleFilledIcon />
              Your resume is ready to apply! Download it below or generate a cover letter.
            </ATSResultMessage>
          </ATSOptimizedCard>
        </Section>
      )}

      {visibleSections?.showProblemSummary &&
        !isAnalyzingOptimized && (
          <>
            {/* Fixes Card - Unified Component */}

<Section>
              <ScoreBreakdownCard>
                <ScoreBreakdownHeader>
                  <ScoreBreakdownHeaderLeft>
                    <ScoreBreakdownTitle>Score Breakdown</ScoreBreakdownTitle>
                    <ScoreBreakdownSubtitle>
                      How each optimization impacts your score
                    </ScoreBreakdownSubtitle>
                  </ScoreBreakdownHeaderLeft>
                  <ScoreBreakdownBadge>
                    <ScoreBadgeValue $muted>{report.fit_score}%</ScoreBadgeValue>
                    <ScoreBadgeArrow>→</ScoreBadgeArrow>
                    <ScoreBadgeValue>{optimizedScore}%</ScoreBadgeValue>
                  </ScoreBreakdownBadge>
                </ScoreBreakdownHeader>

                <ScoreBreakdownBody>
                  {(() => {
                    // Softer, pastel colors
                    const colors = [
                      "var(--primary-500)", // soft green
                      "#2A57A0", // soft blue
                      "#EAB308", // soft purple
                      "#F97316", // soft amber
                      "var(--accent)", // soft pink
                      "#F97316", // soft teal
                    ];
                    const totalImprovement = improvementBreakdown.reduce((sum, i) => sum + i.impact, 0);

                    return (
                      <>
                        <StackedBarContainer>
                          <StackedBarLabel>
                            <StackedBarLabelTitle>Before</StackedBarLabelTitle>
                            <StackedBarLabelValue>{report.fit_score}%</StackedBarLabelValue>
                          </StackedBarLabel>

                          <StackedBarWrapper>
                            <StackedBar>
                              {improvementBreakdown.map((improvement, index) => {
                                const color = colors[index % colors.length];
                                const segmentWidth = (improvement.impact / totalImprovement) * 100;
                                return (
                                  <StackedBarSegment
                                    key={index}
                                    $width={segmentWidth}
                                    $color={color}
                                    title={`${improvement.category}: +${Math.round(improvement.impact * 10) / 10}%`}
                                  />
                                );
                              })}
                            </StackedBar>
                          </StackedBarWrapper>

                          <StackedBarLabel $align="right">
                            <StackedBarLabelTitle>After</StackedBarLabelTitle>
                            <StackedBarLabelValue $highlight>{optimizedScore}%</StackedBarLabelValue>
                          </StackedBarLabel>
                        </StackedBarContainer>

                        <BreakdownLegend>
                          {improvementBreakdown.map((improvement, index) => {
                            const color = colors[index % colors.length];
                            return (
                              <LegendItem key={index}>
                                <LegendDot $color={color} />
                                <LegendText>
                                  <LegendCategory>{improvement.category}</LegendCategory>
                                  <LegendValue $color={color}>
                                    +{Math.round(improvement.impact * 10) / 10}%
                                  </LegendValue>
                                </LegendText>
                              </LegendItem>
                            );
                          })}
                        </BreakdownLegend>
                      </>
                    );
                  })()}
                </ScoreBreakdownBody>

                <ScoreBreakdownFooter>
                  <BreakdownFooterLabel>Total Improvement</BreakdownFooterLabel>
                  <BreakdownFooterValue>
                    +{Math.round(improvementBreakdown.reduce((sum, imp) => sum + imp.impact, 0) * 10) / 10}%
                  </BreakdownFooterValue>
                </ScoreBreakdownFooter>
              </ScoreBreakdownCard>
            </Section>

            <Section>
              <FixesCard>
                <FixesHeader>
                  <FixesHeaderLeft>
                    <FixesTitle>
                      {improvementBreakdown.length} Problem{improvementBreakdown.length !== 1 ? 's' : ''} Fixed
                    </FixesTitle>
                    <FixesSubtitle>
                      Issues identified and resolved in your resume
                    </FixesSubtitle>
                  </FixesHeaderLeft>

                  <FixesScoreBadge>
                    <FixesScoreItem>
                      <FixesScoreValue>{report.fit_score}%</FixesScoreValue>
                      <FixesScoreLabel>Before</FixesScoreLabel>
                    </FixesScoreItem>
                    <FixesScoreArrow>
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                      </svg>
                    </FixesScoreArrow>
                    <FixesScoreItem>
                      <FixesScoreValue $isAfter>{optimizedScore}%</FixesScoreValue>
                      <FixesScoreLabel>After</FixesScoreLabel>
                    </FixesScoreItem>
                  </FixesScoreBadge>
                </FixesHeader>

                {report.fake_it_mode && (
                  <FakeItModeWarning>
                    <div className="warning-icon">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" style={{ width: 20, height: 20 }}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                      </svg>
                    </div>
                    <div className="warning-content">
                      <div className="warning-title">Fake It Mode Active</div>
                      <div className="warning-text">
                        All missing keywords were added. Be prepared to discuss these skills in interviews.
                      </div>
                    </div>
                  </FakeItModeWarning>
                )}

                <FixesList>
                  {improvementBreakdown.map((improvement, index) => (
                    <FixItem
                      key={index}
                      onClick={() => handleImprovementClick(improvement)}
                      title="Click to view this fix in your resume"
                    >
                      <IconWrapper>
                      <FixSeverityDot $severity={improvement.severity || "minor"} />
                      </IconWrapper>
                      <FixContent>
                        <FixCategory>{improvement.category}</FixCategory>
                        <FixProblem>
                          {improvement.problem || improvement.action}
                        </FixProblem>
                        <FixReason>{improvement.reason}</FixReason>
                      </FixContent>
                      <FixImpact>
                        <FixImpactValue>+{Math.round(improvement.impact * 10) / 10}%</FixImpactValue>
                        <FixImpactLabel>Impact</FixImpactLabel>
                      </FixImpact>
                    </FixItem>
                  ))}
                </FixesList>

                <FixesFooter>
                  <FixesFooterLabel>Total Score Improvement</FixesFooterLabel>
                  <FixesFooterValue>
                    +{Math.round(improvementBreakdown.reduce((sum, imp) => sum + imp.impact, 0) * 10) / 10}%
                  </FixesFooterValue>
                </FixesFooter>
              </FixesCard>
            </Section>

            
          </>
        )}

      {/* Bento Grid - Summary, Bullet Points, Role Recommendations, ATS Tips */}
      {visibleSections?.showSampleContent ? (
        <BentoGrid>
          {/* Summary - Left Column, Row Span 2 */}
          <BentoCard $rowSpan={2} $position="left">
            <BentoCardInner>
              <BentoCardContent>
                <BentoCardTitle>Summary</BentoCardTitle>
                <BentoCardDescription>
                  AI-generated analysis of your resume match
                </BentoCardDescription>
                <BentoCardBody>
                  <p>
                    {report.summary_free
                      ?.replace(/[Tt]he candidate/g, 'You')
                      ?.replace(/[Tt]he candidate's/g, 'Your')
                      ?.replace(/[Tt]heir/g, 'your')
                      ?.replace(/[Tt]hey have/g, 'you have')
                      ?.replace(/[Tt]hey are/g, 'you are')
                    }
                  </p>
                </BentoCardBody>
              </BentoCardContent>
              <BentoOverlay />
            </BentoCardInner>
          </BentoCard>

          {/* Missing Keywords - Middle Top */}
          <BentoCard>
            <BentoCardInner>
              <BentoCardContent>
                <BentoCardTitle>Missing Keywords</BentoCardTitle>
                <BentoCardDescription>
                  Keywords from the job posting not found in your resume
                </BentoCardDescription>
                <BentoCardBody>
                  {missingKeywords.length > 0 ? (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                      {missingKeywords.slice(0, 6).map((keyword: string, index: number) => (
                        <span
                          key={index}
                          style={{
                            padding: '6px 12px',
                            background: 'var(--bg-color)',
                            border: '1px solid var(--border-color)',
                            borderRadius: '6px',
                            fontSize: '13px',
                            color: 'var(--text-color)',
                          }}
                        >
                          {keyword}
                        </span>
                      ))}
                      {missingKeywords.length > 6 && (
                        <span
                          style={{
                            padding: '6px 12px',
                            background: 'var(--bg-alt)',
                            border: '1px solid var(--border-color)',
                            borderRadius: '6px',
                            fontSize: '13px',
                            color: 'var(--text-secondary)',
                          }}
                        >
                          +{missingKeywords.length - 6} more
                        </span>
                      )}
                    </div>
                  ) : (
                    <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
                      No missing keywords detected
                    </p>
                  )}
                  <SeeMoreButton onClick={scrollToUpgrade}>
                    Get Optimized CV
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 10.5V6.75a4.5 4.5 0 119 0v3.75M3.75 21.75h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H3.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                    </svg>
                  </SeeMoreButton>
                </BentoCardBody>
              </BentoCardContent>
              <BentoOverlay />
            </BentoCardInner>
          </BentoCard>

          {/* ATS-Optimized CV - Right Column, Row Span 2 */}
          <BentoCard $rowSpan={2} $position="right">
            <BentoCardInner>
              <BentoCardContent>
                <BentoCardTitle>ATS-Optimized CV</BentoCardTitle>
                <BentoCardDescription>
                  Your new CV will pass Applicant Tracking Systems
                </BentoCardDescription>
                <BentoCardBody>
                  <BulletList>
                    <li>All missing keywords added to your CV</li>
                    <li>ATS-friendly formatting applied</li>
                    <li>Optimized section structure</li>
                    <li>Clean, parseable layout</li>
                  </BulletList>
                  <SeeMoreButton onClick={scrollToUpgrade}>
                    Get Optimized CV
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 10.5V6.75a4.5 4.5 0 119 0v3.75M3.75 21.75h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H3.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                    </svg>
                  </SeeMoreButton>
                </BentoCardBody>
              </BentoCardContent>
              <BentoOverlay className="bento-overlay" />
            </BentoCardInner>
          </BentoCard>

          {/* Role Recommendations - Middle Bottom */}
          <BentoCard>
            <BentoCardInner>
              <BentoCardContent>
                <BentoCardTitle>Role Recommendations</BentoCardTitle>
                <BentoCardDescription>
                  Roles that match your skills and experience
                </BentoCardDescription>
                <BentoCardBody>
                  <RoleCard>
                    <RoleCardHeader>
                      <RoleTitle>
                        {roleRecommendations[0]?.title || report.sample_role?.title || 'Senior Product Manager'}
                      </RoleTitle>
                      <RoleFitBadge>
                        {roleRecommendations[0]?.fit || report.sample_role?.fit || 87}% Match
                      </RoleFitBadge>
                    </RoleCardHeader>
                  </RoleCard>
                  <p style={{
                    marginTop: '8px',
                    fontSize: '13px',
                    color: 'var(--text-secondary)'
                  }}>
                    +{roleRecommendations.length > 1 ? roleRecommendations.length - 1 : 4} more roles available
                  </p>
                  <SeeMoreButton onClick={scrollToUpgrade}>
                    See All Roles
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 10.5V6.75a4.5 4.5 0 119 0v3.75M3.75 21.75h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H3.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                    </svg>
                  </SeeMoreButton>
                </BentoCardBody>
              </BentoCardContent>
              <BentoOverlay />
            </BentoCardInner>
          </BentoCard>
        </BentoGrid>
      ) : (
        <BentoGrid>
          {/* Summary - Left Column, Row Span 2 */}
          <BentoCard $rowSpan={2} $position="left">
            <BentoCardInner>
              <BentoCardContent>
                <BentoCardTitle>Summary</BentoCardTitle>
                <BentoCardDescription>
                  AI-generated analysis of your resume match
                </BentoCardDescription>
                <BentoCardBody>
                  <p>
                    {report.summary_free
                      ?.replace(/[Tt]he candidate/g, 'You')
                      ?.replace(/[Tt]he candidate's/g, 'Your')
                      ?.replace(/[Tt]heir/g, 'your')
                      ?.replace(/[Tt]hey have/g, 'you have')
                      ?.replace(/[Tt]hey are/g, 'you are')
                    }
                  </p>
                </BentoCardBody>
              </BentoCardContent>
              <BentoOverlay />
            </BentoCardInner>
          </BentoCard>

          {/* Rewritten Bullet Points - Middle Top */}
          <BentoCard>
            <BentoCardInner>
              <BentoCardContent>
                <BentoCardTitle>
                  {report.generated_cv
                    ? "Professional bullet points applied"
                    : "Rewritten bullet points"}
                </BentoCardTitle>
                <BentoCardDescription>
                  {report.generated_cv
                    ? "These achievement-focused bullets are now integrated in your optimized resume"
                    : "Improved versions of your experience bullets"}
                </BentoCardDescription>
                <BentoCardBody>
                  <BulletList>
                    {rewrittenBullets.map((bullet: string, index: number) => (
                      <li key={index}>{bullet}</li>
                    ))}
                  </BulletList>
                </BentoCardBody>
              </BentoCardContent>
              <BentoOverlay />
            </BentoCardInner>
          </BentoCard>

          {/* ATS Optimization Tips - Right Column, Row Span 2 */}
          <BentoCard $rowSpan={2} $position="right">
            <BentoCardInner>
              <BentoCardContent>
                <BentoCardTitle>
                  {report.generated_cv
                    ? "ATS optimizations applied"
                    : "ATS optimization tips"}
                </BentoCardTitle>
                <BentoCardDescription>
                  {report.generated_cv
                    ? "Your optimized resume has been enhanced with these ATS-friendly improvements"
                    : "Improve your chances with applicant tracking systems"}
                </BentoCardDescription>
                <BentoCardBody>
                  <BulletList>
                    {atsFlags.map((flag: string, index: number) => (
                      <li key={index}>{flag}</li>
                    ))}
                  </BulletList>
                </BentoCardBody>
              </BentoCardContent>
              <BentoOverlay />
            </BentoCardInner>
          </BentoCard>

          {/* Role Recommendations - Middle Bottom */}
          <BentoCard>
            <BentoCardInner>
              <BentoCardContent>
                <BentoCardTitle>Role recommendations</BentoCardTitle>
                <BentoCardDescription>
                  Alternative roles that match your profile
                </BentoCardDescription>
                <BentoCardBody>
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    {roleRecommendations.map((role: RoleRecommendation) => (
                      <div
                        key={role.title}
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          padding: "12px",
                          backgroundColor: "var(--bg-color)",
                          borderRadius: "8px",
                        }}
                      >
                        <span style={{ fontWeight: 500, fontSize: "14px" }}>{role.title}</span>
                        <Badge variant="success">{role.fit}% Match</Badge>
                      </div>
                    ))}
                  </div>
                </BentoCardBody>
              </BentoCardContent>
              <BentoOverlay />
            </BentoCardInner>
          </BentoCard>
        </BentoGrid>
      )}

      {/* Missing Keywords - Below the Bento Grid */}
      {!(report.pro && report.generated_cv) && (
        <Section>
          <Card variant="bordered">
            <Card.Header>
              <Card.Title>Missing Keywords</Card.Title>
              <Card.Description>
                Add these keywords to improve your match score
              </Card.Description>
            </Card.Header>
            <Card.Content>
              <KeywordList>
                {missingKeywords.map((keyword: string) => (
                  <Badge key={keyword} variant="warning">
                    {keyword}
                  </Badge>
                ))}
              </KeywordList>
            </Card.Content>
          </Card>
        </Section>
      )}

      {visibleSections?.showSampleContent && (
        <>

          {/* Main Upgrade Card */}
          <Section ref={upgradeRef}>
            <ProUpgradeCard variant="elevated">
              <Card.Content>
                <UpgradeTitle>Unlock Your Full Potential</UpgradeTitle>

                {/* Hero Stat */}
                <HeroStat>
                  <HeroStatNumber>94%</HeroStatNumber>
                  <HeroStatLabel>of Pro users get more interviews</HeroStatLabel>
                </HeroStat>

                {/* Testimonial Carousel */}
                <TestimonialCarousel>
                  {testimonials.map((testimonial, index) => (
                    <TestimonialSlide key={index} $isActive={index === currentTestimonial}>
                      <TestimonialText>&quot;{testimonial.text}&quot;</TestimonialText>
                      <TestimonialAuthor>
                        — {testimonial.author}, {testimonial.role}
                      </TestimonialAuthor>
                    </TestimonialSlide>
                  ))}
                </TestimonialCarousel>

                {/* Compact Comparison */}
                <ComparisonTable>
                  <ComparisonRow $isHeader>
                    <ComparisonCell>What You Get</ComparisonCell>
                    <ComparisonCell>FREE</ComparisonCell>
                    <ComparisonCell>PRO</ComparisonCell>
                  </ComparisonRow>
                  <ComparisonRow>
                    <ComparisonCell>AI-Optimized Resume PDF</ComparisonCell>
                    <ComparisonCell>
                      <XMarkIcon />
                    </ComparisonCell>
                    <ComparisonCell>
                      <CheckCircleIcon />
                    </ComparisonCell>
                  </ComparisonRow>
                  <ComparisonRow>
                    <ComparisonCell>Rewritten Bullet Points</ComparisonCell>
                    <ComparisonCell>
                      <XMarkIcon />
                    </ComparisonCell>
                    <ComparisonCell>
                      <CheckCircleIcon />
                    </ComparisonCell>
                  </ComparisonRow>
                  <ComparisonRow>
                    <ComparisonCell>ATS Optimization Tips</ComparisonCell>
                    <ComparisonCell>
                      <XMarkIcon />
                    </ComparisonCell>
                    <ComparisonCell>
                      <CheckCircleIcon />
                    </ComparisonCell>
                  </ComparisonRow>
                  <ComparisonRow>
                    <ComparisonCell>Cover Letter Generator</ComparisonCell>
                    <ComparisonCell>
                      <XMarkIcon />
                    </ComparisonCell>
                    <ComparisonCell>
                      <CheckCircleIcon />
                    </ComparisonCell>
                  </ComparisonRow>
                </ComparisonTable>

                {/* Social Proof - Compact */}
                <SocialProofContainer>
                  <SocialProofBadge>
                    <ProofIcon>
                      <FireIcon />
                    </ProofIcon>
                    <ProofText>
                      <strong>487</strong> upgraded this week
                    </ProofText>
                  </SocialProofBadge>
                  <SocialProofBadge>
                    <ProofIcon>
                      <BriefcaseIcon />
                    </ProofIcon>
                    <ProofText>
                      <strong>12,483+</strong> professionals
                    </ProofText>
                  </SocialProofBadge>
                </SocialProofContainer>

                {/* CTA Button */}
                <MainCTAButton
                  size="lg"
                  data-upgrade-button
                  onClick={userCredits.canAnalyze ? handleUpgradeToPro : () => setIsBuyCreditsModalOpen(true)}
                  isLoading={isUpgrading}
                >
                  {isUpgrading ? (
                    "Upgrading..."
                  ) : userCredits.canAnalyze ? (
                    <>
                      <RocketIcon /> Upgrade Now - Use 1 Credit
                    </>
                  ) : (
                    <>
                      <RocketIcon /> Get Credits & Upgrade
                    </>
                  )}
                </MainCTAButton>

                {/* Guarantee */}
                <GuaranteeBadge>
                  <CheckCircleIcon /> 100% Satisfaction Guaranteed
                </GuaranteeBadge>
              </Card.Content>
            </ProUpgradeCard>
          </Section>
        </>
      )}

      {/* PRO-only sections */}
      {!visibleSections?.showSampleContent && (
        <>
          {report.fake_skills_recommendations &&
            report.fake_skills_recommendations.length > 0 && (
              <Section>
                <Card variant="bordered">
                  <Card.Header>
                    <Card.Title>
                      🎯 Learning Path - Turn Fake Skills into Real Ones!
                    </Card.Title>
                    <Card.Description>
                      You&apos;ve added these skills to your resume. Now let's make
                      them real! Follow these personalized learning paths to
                      acquire these skills.
                    </Card.Description>
                  </Card.Header>
                  <Card.Content>
                    {report.fake_skills_recommendations.map(
                      (recommendation, index) => (
                        <LearningRecommendationCard key={index}>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              marginBottom: "8px",
                            }}
                          >
                            <SkillCategory>
                              {recommendation.category}
                            </SkillCategory>
                            <TimeEstimate>
                              ⏱️ {recommendation.estimatedTime}
                            </TimeEstimate>
                          </div>
                          <SkillTitle>{recommendation.skill}</SkillTitle>

                          <LearningPathSection>
                            <SectionTitle>📚 Learning Path</SectionTitle>
                            <BulletList>
                              {recommendation.learningPath.map((step, idx) => (
                                <li key={idx}>{step}</li>
                              ))}
                            </BulletList>
                          </LearningPathSection>

                          <LearningPathSection>
                            <SectionTitle>💡 Project Ideas</SectionTitle>
                            <BulletList>
                              {recommendation.projectIdeas.map((idea, idx) => (
                                <li key={idx}>{idea}</li>
                              ))}
                            </BulletList>
                          </LearningPathSection>
                        </LearningRecommendationCard>
                      )
                    )}
                  </Card.Content>
                </Card>
              </Section>
            )}

          <Section>
            <GenerateResumeCard>
              <GenerateResumeHeader>
                <GenerateResumeHeaderLeft>
                  <GenerateResumeTitle>
                    {report.generated_cv ? 'Optimized Resume' : 'Generate Optimized Resume'}
                  </GenerateResumeTitle>
                  <GenerateResumeSubtitle>
                    {report.generated_cv
                      ? 'Your ATS-optimized resume is ready'
                      : 'ATS-friendly resume with all improvements applied'}
                  </GenerateResumeSubtitle>
                </GenerateResumeHeaderLeft>
                {report.generated_cv && (
                  <ResumeStatusBadge $ready>
                    <CheckCircleIcon />
                    Ready
                  </ResumeStatusBadge>
                )}
              </GenerateResumeHeader>

              {!report.generated_cv ? (
                <GenerateResumeBody>
                  <GenerateResumeEmptyState>
                    <EmptyStateIcon>
                      <RocketIcon />
                    </EmptyStateIcon>
                    <EmptyStateTitle>Ready to generate</EmptyStateTitle>
                    <EmptyStateDescription>
                      Create an optimized resume tailored for this position with all improvements applied.
                    </EmptyStateDescription>
                    <Button
                      onClick={async () => {
                        setIsUpgrading(true);
                        try {
                          // Generate CV
                          const response = await fetch("/api/cv/generate", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                              reportId: report.id,
                              fakeItMode: false,
                            }),
                          });

                          const cvResult = await response.json();

                          if (!response.ok) {
                            throw new Error(cvResult.error || "Failed to generate resume");
                          }

                          // Refresh report data
                          const supabase = createClient();
                          const { data: updatedReport } = await supabase
                            .from("reports")
                            .select("*")
                            .eq("id", report.id)
                            .single();

                          if (updatedReport) {
                            setReport(updatedReport);
                            // Update fake_it_mode state from database
                            if (updatedReport.fake_it_mode !== undefined) {
                              setFakeItMode(updatedReport.fake_it_mode);
                              console.log('📌 Updated fake_it_mode in modal:', updatedReport.fake_it_mode);
                            }

                            // Generate PDF on client and save to optimized_cvs via API
                            if (updatedReport.generated_cv) {
                              try {
                                const pdf = await generateCVPDF(updatedReport.generated_cv);
                                const pdfBlob = pdf.output('blob');

                                const userName = updatedReport.generated_cv.contact?.name || 'Optimized';
                                const sanitizedName = userName.replace(/[^a-zA-Z0-9\s]/g, '').replace(/\s+/g, '_');
                                const pdfFile = new File([pdfBlob], `${sanitizedName}.pdf`, { type: 'application/pdf' });

                                // Use API to upload with service role (bypasses RLS)
                                const formData = new FormData();
                                formData.append('pdf', pdfFile);
                                formData.append('reportId', updatedReport.id);

                                const saveResponse = await fetch('/api/cv/save-optimized', {
                                  method: 'POST',
                                  body: formData,
                                });

                                const saveResult = await saveResponse.json();

                                if (!saveResponse.ok) {
                                  console.error('Save error:', saveResult.error);
                                  throw new Error(saveResult.error);
                                }

                                console.log('✅ Resume saved to My Resumes via API (modal)');
                              } catch (saveError) {
                                console.error('Error saving to My Resumes:', saveError);
                              }
                            }

                            // Analyze the optimized CV score
                            try {
                              const analyzeResponse = await fetch("/api/cv/analyze-optimized", {
                                method: "POST",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({ reportId: updatedReport.id }),
                              });

                              if (analyzeResponse.ok) {
                                const analysisResult = await analyzeResponse.json();
                                setOptimizedScore(analysisResult.optimizedScore);
                                setImprovementBreakdown(analysisResult.improvements || []);
                                if (analysisResult.optimizedScoreBreakdown) {
                                  setOptimizedScoreBreakdown(analysisResult.optimizedScoreBreakdown);
                                }
                              }
                            } catch (analyzeError) {
                              console.error("Score analysis error:", analyzeError);
                            }
                          }

                          toast.success("Your optimized resume is ready!");
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        } catch (error) {
                          const errorMessage = error instanceof Error ? error.message : "Unknown error";
                          toast.error(errorMessage);
                        } finally {
                          setIsUpgrading(false);
                        }
                      }}
                      isLoading={isUpgrading}
                      style={{
                        background: '#667eea',
                      }}
                    >
                      {isUpgrading ? "Generating..." : "Generate Resume"}
                    </Button>
                  </GenerateResumeEmptyState>
                </GenerateResumeBody>
              ) : (
                <>
                  <GenerateResumeBody>
                    <ResumeActionsList>
                      <ResumeActionItem onClick={handlePreviewCV}>
                        <ResumeActionIcon $color="#667eea">
                          <DocumentIcon />
                        </ResumeActionIcon>
                        <ResumeActionContent>
                          <ResumeActionTitle>Preview & Download</ResumeActionTitle>
                          <ResumeActionDescription>View and download as PDF</ResumeActionDescription>
                        </ResumeActionContent>
                        <ResumeActionArrow>
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                          </svg>
                        </ResumeActionArrow>
                      </ResumeActionItem>

                      <ResumeActionItem onClick={() => {
                        if (report?.pro) {
                          setIsCoverLetterModalOpen(true);
                        } else {
                          setIsPremiumModalOpen(true);
                        }
                      }}>
                        <ResumeActionIcon $color="#8b5cf6">
                          <EnvelopeIcon size="18" />
                        </ResumeActionIcon>
                        <ResumeActionContent>
                          <ResumeActionTitle>Generate Cover Letter</ResumeActionTitle>
                          <ResumeActionDescription>Tailored letter for this position</ResumeActionDescription>
                        </ResumeActionContent>
                        <ResumeActionArrow>
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                          </svg>
                        </ResumeActionArrow>
                      </ResumeActionItem>

                      <ResumeActionItem
                        $disabled={isGeneratingCV}
                        onClick={isGeneratingCV ? undefined : handleRegenerateCV}
                      >
                        <ResumeActionIcon $color="#10b981">
                          {isGeneratingCV ? <Spinner size="sm" /> : <RefreshIcon />}
                        </ResumeActionIcon>
                        <ResumeActionContent>
                          <ResumeActionTitle>Regenerate Resume</ResumeActionTitle>
                          <ResumeActionDescription>Create a new optimized version</ResumeActionDescription>
                        </ResumeActionContent>
                        <ResumeActionArrow>
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                          </svg>
                        </ResumeActionArrow>
                      </ResumeActionItem>
                    </ResumeActionsList>
                  </GenerateResumeBody>

                  {report?.pro && !report?.fake_it_mode && (
                    <ResumeFooter
                      $variant="accent"
                      onClick={isGeneratingCV ? undefined : handleCreateFakeItReport}
                      style={{ opacity: isGeneratingCV ? 0.5 : 1, cursor: isGeneratingCV ? 'not-allowed' : 'pointer' }}
                    >
                      <ResumeFooterIcon $color="#f59e0b">
                        {isGeneratingCV ? <Spinner size="sm" /> : <SparklesIcon />}
                      </ResumeFooterIcon>
                      <ResumeFooterContent>
                        <ResumeFooterTitle $color="#f59e0b">Try Fake It Mode</ResumeFooterTitle>
                        <ResumeFooterDescription>Add missing skills with learning paths</ResumeFooterDescription>
                      </ResumeFooterContent>
                      <ResumeActionArrow>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" style={{ color: '#f59e0b' }}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                        </svg>
                      </ResumeActionArrow>
                    </ResumeFooter>
                  )}
                </>
              )}
            </GenerateResumeCard>
          </Section>
        </>
      )}

      {/* CV Preview Modal */}
      <Modal
        isOpen={isPreviewOpen}
        onClose={handleClosePreview}
        title="Resume Preview"
        size="lg"
      >
        <PreviewModalBody>
          {selectedImprovement && (
            <ImprovementHighlight>
              <HighlightHeader>
                <HighlightMeta>
                  <HighlightCategory>{selectedImprovement.category}</HighlightCategory>
                  {selectedImprovement.section && (
                    <HighlightSection>
                      {selectedImprovement.section.charAt(0).toUpperCase() + selectedImprovement.section.slice(1)}
                    </HighlightSection>
                  )}
                </HighlightMeta>
                <HighlightImpactBadge>
                  +{Math.round(selectedImprovement.impact * 10) / 10}%
                </HighlightImpactBadge>
              </HighlightHeader>
              <HighlightAction>{selectedImprovement.action}</HighlightAction>
              <HighlightReason>{selectedImprovement.reason}</HighlightReason>
            </ImprovementHighlight>
          )}
          <PDFPreviewContainer>
            {pdfPreviewUrl ? (
              <PDFViewer
                src={`${pdfPreviewUrl}#toolbar=0&navpanes=0&scrollbar=0&view=FitH`}
                title="Resume Preview"
              />
            ) : (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  height: "100%",
                }}
              >
                <Spinner size="lg" />
              </div>
            )}
          </PDFPreviewContainer>
        </PreviewModalBody>
        <Modal.Footer>
          <Button variant="ghost" onClick={handleClosePreview}>
            Close
          </Button>
          <Button variant="primary" onClick={handleDownloadCV}>
            <DownloadIcon /> Download PDF
          </Button>
        </Modal.Footer>
      </Modal>

      {/* CV Generation Loading Modal */}
      <LoadingModal
        isOpen={isGeneratingCV}
        title="Generating optimized resume"
        messages={[
          "Analyzing your experience and skills...",
          "Optimizing keywords for ATS systems...",
          "Highlighting your achievements...",
          "Restructuring for maximum impact...",
          "Tailoring content to job requirements...",
          "Adding the finishing touches...",
          "Almost ready, just a moment...",
          "Creating something amazing...",
        ]}
        steps={[
          { label: "Analyze", completed: true },
          { label: "Optimize", active: true },
          { label: "Complete", active: false },
        ]}
      />

      {/* Pro Upgrade Loading Modal */}
      <LoadingModal
        isOpen={isUpgrading}
        title="Upgrading to Pro"
        messages={[
          "Activating Pro features...",
          "Preparing advanced analytics...",
          "Generating AI recommendations...",
          "Loading cover letter templates...",
          "Enabling optimized resume feature...",
          "You're almost Pro...",
          "Final checks in progress...",
        ]}
        steps={[
          { label: "Process", active: true },
          { label: "Analyze", active: false },
          { label: "Complete", active: false },
        ]}
      />

      {/* Premium Upgrade Modal for Cover Letters */}
      <Modal
        isOpen={isPremiumModalOpen}
        onClose={() => setIsPremiumModalOpen(false)}
        title="✨ Premium Feature"
        description="Upgrade to unlock AI-powered cover letters"
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
              Choose from multiple templates, tones, and styles to make your application stand out.
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
                ✨ What you'll get:
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
                  <span>6 professional templates to choose from</span>
                </li>
                <li style={{ marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ color: 'var(--success)', flexShrink: 0 }}>
                    <CheckCircleIcon />
                  </div>
                  <span>Multiple tones (Professional, Friendly, Formal)</span>
                </li>
                <li style={{ marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ color: 'var(--success)', flexShrink: 0 }}>
                    <CheckCircleIcon />
                  </div>
                  <span>Customizable length and language (EN/TR)</span>
                </li>
                <li style={{ marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ color: 'var(--success)', flexShrink: 0 }}>
                    <CheckCircleIcon />
                  </div>
                  <span>Interactive editor with alternative phrasings</span>
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ color: 'var(--success)', flexShrink: 0 }}>
                    <CheckCircleIcon />
                  </div>
                  <span>Tailored to your resume and job posting</span>
                </li>
              </ul>
            </div>

            <Button
              size="lg"
              onClick={userCredits.canAnalyze ? handleUpgradeToPro : () => setIsBuyCreditsModalOpen(true)}
              isLoading={isUpgrading}
              style={{
                width: '100%',
                background: 'var(--gradient-primary)',
                fontSize: '16px',
                padding: '14px 24px',
                marginBottom: '12px',
              }}
            >
              {isUpgrading ? 'Processing...' : userCredits.canAnalyze ? 'Upgrade to Pro - Use 1 Credit' : 'Buy Credits to Upgrade'}
            </Button>

            <p style={{
              fontSize: '12px',
              color: '#6b7280',
              marginTop: '12px',
            }}>
              {userCredits.canAnalyze ? `You have ${userCredits.credits} credits • Uses 1 credit` : 'Buy credits to unlock all premium features'}
            </p>
          </div>
        </Modal.Body>
      </Modal>

      {/* Buy Credits Modal */}
      <Modal
        isOpen={isBuyCreditsModalOpen && !purchaseSuccess}
        onClose={() => setIsBuyCreditsModalOpen(false)}
        title="Buy Credits"
        description="Choose a plan to unlock premium features"
        size="lg"
      >
        <Modal.Body>
          <PricingGrid>
              {/* Single */}
              <PricingCard>
                <PricingHeader>
                  <PricingName>{PRICING.SINGLE.name}</PricingName>
                  <PricingPrice>
                    ${PRICING.SINGLE.price} <span>one-time</span>
                  </PricingPrice>
                </PricingHeader>
                <PricingFeatureList>
                  {PRICING.SINGLE.features.map((feature) => (
                    <PricingFeatureItem key={feature}>
                      <PricingCheckIcon />
                      <span>{feature}</span>
                    </PricingFeatureItem>
                  ))}
                </PricingFeatureList>
                <Button
                  variant="secondary"
                  fullWidth
                  onClick={() => handleBuyCredits('single', 1, 'Single')}
                  disabled={isBuyingCredits === 'single'}
                >
                  {isBuyingCredits === 'single' ? 'Processing...' : 'Buy Single'}
                </Button>
              </PricingCard>

              {/* Starter - Featured */}
              <PricingCard $featured>
                <PricingFeaturedBadge>
                  <Badge variant="info">Best Value</Badge>
                </PricingFeaturedBadge>
                <PricingHeader>
                  <PricingName>{PRICING.STARTER.name}</PricingName>
                  <PricingPrice>
                    ${PRICING.STARTER.price} <span>one-time</span>
                  </PricingPrice>
                  <PricingSubtext>$0.70 per report - save 65%</PricingSubtext>
                </PricingHeader>
                <PricingFeatureList>
                  {PRICING.STARTER.features.map((feature) => (
                    <PricingFeatureItem key={feature}>
                      <PricingCheckIcon />
                      <span>{feature}</span>
                    </PricingFeatureItem>
                  ))}
                </PricingFeatureList>
                <Button
                  fullWidth
                  onClick={() => handleBuyCredits('starter', 10, 'Starter')}
                  disabled={isBuyingCredits === 'starter'}
                >
                  {isBuyingCredits === 'starter' ? 'Processing...' : 'Buy Starter'}
                </Button>
              </PricingCard>

              {/* Pro */}
              <PricingCard>
                <PricingHeader>
                  <PricingName>{PRICING.PRO.name}</PricingName>
                  <PricingPrice>
                    ${PRICING.PRO.price} <span>/month</span>
                  </PricingPrice>
                </PricingHeader>
                <PricingFeatureList>
                  {PRICING.PRO.features.map((feature) => (
                    <PricingFeatureItem key={feature}>
                      <PricingCheckIcon />
                      <span>{feature}</span>
                    </PricingFeatureItem>
                  ))}
                </PricingFeatureList>
                <Button
                  variant="secondary"
                  fullWidth
                  onClick={() => alert('Subscription requires Stripe integration')}
                >
                  Subscribe
                </Button>
              </PricingCard>
            </PricingGrid>
        </Modal.Body>
      </Modal>

      {/* Fullscreen Success Overlay - Windows 10 Style */}
      {purchaseSuccess && typeof document !== "undefined" && createPortal(
        <FullscreenSuccessOverlay>
          <SuccessContent>
            <WelcomeSuccessIcon>
              <svg viewBox="0 0 24 24" fill="none">
                <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </WelcomeSuccessIcon>

            <WelcomeSuccessTitle>
              You're One Step Closer!
            </WelcomeSuccessTitle>

            <SuccessMessage>
              Your investment in yourself will pay off. Every optimized reseume brings you closer to your dream job.
            </SuccessMessage>

            <SuccessQuote>
              <p>"The only way to do great work is to love what you do. Keep pushing forward!"</p>
            </SuccessQuote>

            <LoadingDots>
              <span />
              <span />
              <span />
            </LoadingDots>
          </SuccessContent>
        </FullscreenSuccessOverlay>,
        document.body
      )}

      {/* Tool Suggestion Loading Modal */}
      <LoadingModal
        isOpen={isLoadingToolSuggestions}
        title="Analyzing Your Experience"
        messages={[
          "Finding tools to strengthen your resume...",
          "Reviewing industry trends...",
          "Matching popular technologies...",
          "Preparing career-focused suggestions...",
          "Identifying the best tool combinations...",
          "Almost ready with great recommendations...",
        ]}
        steps={[
          { label: "Scan", active: true },
          { label: "Analyze", active: false },
          { label: "Suggest", active: false },
        ]}
      />

      {/* Tool Suggestion Modal */}
      <ToolSuggestionModal
        isOpen={isToolSuggestionModalOpen && !isLoadingToolSuggestions}
        onClose={() => {
          setIsToolSuggestionModalOpen(false);
          setPendingCVGeneration(null);
        }}
        onConfirm={handleToolSuggestionConfirm}
        onSkip={handleToolSuggestionSkip}
        suggestions={toolSuggestions}
      />

      {/* Cover Letter Generator Modal */}
      <CoverLetterGenerator
        isOpen={isCoverLetterModalOpen}
        onClose={() => setIsCoverLetterModalOpen(false)}
        reportId={reportId}
      />

      {/* Score Breakdown Modal */}
      <ScoreBreakdownModal
        isOpen={isScoreBreakdownModalOpen}
        onClose={() => setIsScoreBreakdownModalOpen(false)}
        breakdown={report?.score_breakdown || null}
        fitScore={report?.fit_score || 0}
      />

      {/* Optimized Score Breakdown Modal */}
      <ScoreBreakdownModal
        isOpen={isOptimizedScoreBreakdownModalOpen}
        onClose={() => setIsOptimizedScoreBreakdownModalOpen(false)}
        breakdown={optimizedScoreBreakdown || report?.optimized_score_breakdown || null}
        fitScore={optimizedScore || 0}
      />

      {/* Keywords Added Drawer */}
      <Drawer isOpen={isKeywordsModalOpen} onClose={() => setIsKeywordsModalOpen(false)}>
        <DrawerHeader>
          <DrawerTitle>Keywords Added</DrawerTitle>
          <DrawerDescription>Keywords strategically integrated into your optimized resume</DrawerDescription>
        </DrawerHeader>

        <KeywordsSummaryRow>
            <KeywordsSummaryCount>{missingKeywords.length}</KeywordsSummaryCount>
            <KeywordsSummaryText>keywords matched from the job description</KeywordsSummaryText>
          </KeywordsSummaryRow>
        <DrawerBody>
          

          {missingKeywords.map((keyword: string) => {
            const matches = report.generated_cv ? findKeywordInCV(keyword, report.generated_cv) : [];
            return (
              <KeywordItemCard key={keyword}>
                <KeywordItemHeader>
                  <KeywordBadge>
                    
                    {keyword}
                  </KeywordBadge>
                  <KeywordImpact>
                    {matches.length > 0 ? `${matches.length} match${matches.length > 1 ? 'es' : ''}` : 'Added'}
                  </KeywordImpact>
                </KeywordItemHeader>

                {matches.length > 0 ? (
                  <KeywordContextList>
                    {matches.slice(0, 3).map((match, idx) => (
                      <KeywordContext key={idx}>
                        <div className="section-label">
                          <i>Found in</i>
                          {match.section}
                        </div>
                        <div>{highlightKeyword(match.text, keyword)}</div>
                      </KeywordContext>
                    ))}
                    {matches.length > 3 && (
                      <KeywordDescription>
                        +{matches.length - 3} more occurrence{matches.length - 3 > 1 ? 's' : ''}
                      </KeywordDescription>
                    )}
                  </KeywordContextList>
                ) : (
                  <KeywordNotFound>
                    Added to your skills section
                  </KeywordNotFound>
                )}
              </KeywordItemCard>
            );
          })}
        </DrawerBody>
        <DrawerFooter>
          <Button variant="primary" onClick={() => setIsKeywordsModalOpen(false)} style={{width: "300px", maxWidth: "95%"}}>
            Done
          </Button>
        </DrawerFooter>
      </Drawer>

      {/* Role Recommendations Drawer */}
      <Drawer isOpen={isRoleRecommendationsDrawerOpen} onClose={() => setIsRoleRecommendationsDrawerOpen(false)}>
        <DrawerHeader>
          <DrawerTitle>Role Recommendations</DrawerTitle>
          <DrawerDescription>Alternative positions that match your profile and experience</DrawerDescription>
        </DrawerHeader>

        <KeywordsSummaryRow>
          <KeywordsSummaryCount>{roleRecommendations.length}</KeywordsSummaryCount>
          <KeywordsSummaryText>alternative roles found based on your skills</KeywordsSummaryText>
        </KeywordsSummaryRow>

        <DrawerBody>
          {roleRecommendations.map((role, index) => (
            <RoleItemCard key={index}>
              <RoleItemHeader>
                <RoleItemTitle>{role.title}</RoleItemTitle>
                <RoleItemMatch>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  {role.fit}% Match
                </RoleItemMatch>
              </RoleItemHeader>
              {role.description && (
                <RoleItemDescription>{role.description}</RoleItemDescription>
              )}
            </RoleItemCard>
          ))}
        </DrawerBody>
        <DrawerFooter>
          <Button variant="primary" onClick={() => setIsRoleRecommendationsDrawerOpen(false)} style={{width: "300px", maxWidth: "95%"}}>
            Done
          </Button>
        </DrawerFooter>
      </Drawer>
    </Container>
  );
}
