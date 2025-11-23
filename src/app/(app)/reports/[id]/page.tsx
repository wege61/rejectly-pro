"use client";

import styled from "styled-components";
import { useState, useEffect, useCallback, useRef } from "react";
import { createPortal } from "react-dom";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Spinner } from "@/components/ui/Spinner";
import { Modal } from "@/components/ui/Modal";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useToast } from "@/contexts/ToastContext";
import { useAuth } from "@/hooks/useAuth";
import { createClient } from "@/lib/supabase/client";
import { GeneratedCV } from "@/types/cv";
import { generateCVPDF } from "@/lib/pdf/cvGenerator";
import { CoverLetterGenerator } from "@/components/features/CoverLetterGenerator";
import { PRICING } from "@/lib/constants";

interface UserCredits {
  credits: number;
  hasSubscription: boolean;
  canAnalyze: boolean;
}

// Icons
const TargetIcon = () => (
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

const EyeIcon = () => (
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
      d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
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
      display: "inline-block",
      verticalAlign: "middle",
    }}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"
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

const CheckBadgeIcon = ({ size = "20" }: { size?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={2}
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
      d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z"
    />
  </svg>
);

const SparklesIcon = ({ size = "24" }: { size?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={2}
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
      d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z"
    />
  </svg>
);

const StarIcon = () => (
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
      d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
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

const LightningIcon = () => (
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
      d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z"
    />
  </svg>
);

const ClockIcon = () => (
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
      d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
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

const ShieldCheckIcon = () => (
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
      d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"
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
  margin-bottom: ${({ theme }) => theme.spacing["2xl"]};
`;

const Title = styled.h1`
  font-size: ${({ theme }) => theme.typography.fontSize["3xl"]};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const HeaderMeta = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  flex-wrap: wrap;
  align-items: center;
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
      ? '#10b981'
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
        ? '#10b981'
        : $low
          ? '#f59e0b'
          : '#9b87c4'
    };
  }
`;

const Grid = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.spacing.lg};
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  margin-bottom: ${({ theme }) => theme.spacing["2xl"]};
`;

const ScoreCard = styled(Card)`
  text-align: center;
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

const getScoreLabel = (score: number): string => {
  if (score >= 80) return 'Excellent Match';
  if (score >= 60) return 'Good Match';
  return 'Needs Improvement';
};

const ComparisonScoreCard = styled(Card)`
  text-align: center;
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
    $isOptimized ? "#10b981" : theme.colors.primary};
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
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
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
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
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
  color: #10b981;

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
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
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

const Section = styled.section`
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const KeywordList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const BulletList = styled.ul`
  list-style: disc;
  padding-left: ${({ theme }) => theme.spacing.lg};

  li {
    margin-bottom: ${({ theme }) => theme.spacing.sm};
    color: ${({ theme }) => theme.colors.textPrimary};
  }
`;

const ProUpgradeCard = styled(Card)`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  text-align: center;

  * {
    color: white !important;
  }
`;

const MainCTAButton = styled(Button)`
  background: white !important;
  color: #667eea !important;
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  padding: ${({ theme }) => `${theme.spacing.lg} ${theme.spacing.xl}`};
  width: 100%;
  margin-top: ${({ theme }) => theme.spacing.xl};
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.sm};
  box-shadow: 0 4px 20px rgba(255, 255, 255, 0.3);
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 30px rgba(255, 255, 255, 0.5);
  }

  &:active {
    transform: translateY(-1px);
  }

  @keyframes glow {
    0%, 100% {
      box-shadow: 0 4px 20px rgba(255, 255, 255, 0.3);
    }
    50% {
      box-shadow: 0 4px 30px rgba(255, 255, 255, 0.6);
    }
  }

  animation: glow 2s ease-in-out infinite;
`;

const UpgradeTitle = styled.h3`
  font-size: ${({ theme }) => theme.typography.fontSize["2xl"]};
  margin-bottom: ${({ theme }) => theme.spacing.md};
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
  position: absolute;
  bottom: ${({ theme }) => theme.spacing.md};
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => `${theme.spacing.sm} ${theme.spacing.xl}`};
  background: rgba(15, 23, 42, 0.9);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(102, 126, 234, 0.4);
  border-radius: ${({ theme }) => theme.radius.full};
  color: #a5b4fc;
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.normal};
  z-index: 10;

  &:hover {
    border-color: #667eea;
    color: white;
    background: rgba(102, 126, 234, 0.2);
    transform: translateX(-50%) translateY(-2px);
  }

  svg {
    width: 14px;
    height: 14px;
    transition: transform 0.2s ease;
  }

  &:hover svg {
    transform: translateY(2px);
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
  color: #667eea !important;
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
  background: rgba(255, 255, 255, 0.1);
  border-radius: ${({ theme }) => theme.radius.md};
  padding: ${({ theme }) => theme.spacing.md};
  margin-bottom: ${({ theme }) => theme.spacing.md};
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
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-style: italic;
  margin-bottom: ${({ theme }) => theme.spacing.sm};
  line-height: 1.5;
`;

const TestimonialAuthor = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  opacity: 0.8;
  text-align: center;
  margin-top: ${({ theme }) => theme.spacing.sm};
`;

const TestimonialDots = styled.div`
  display: flex;
  justify-content: center;
  gap: 6px;
  margin-top: ${({ theme }) => theme.spacing.sm};
`;

const TestimonialDot = styled.div<{ $isActive: boolean }>`
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: ${({ $isActive }) => $isActive ? 'white' : 'rgba(255, 255, 255, 0.3)'};
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
  padding: ${({ theme }) => theme.spacing.md};
  margin-bottom: ${({ theme }) => theme.spacing.md};
  background: rgba(255, 255, 255, 0.15);
  border-radius: ${({ theme }) => theme.radius.md};
  backdrop-filter: blur(10px);
`;

const HeroStatNumber = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize["3xl"]};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: white;
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

const HeroStatLabel = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: rgba(255, 255, 255, 0.9);
`;

const SocialProofContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: ${({ theme }) => theme.spacing.md};
  margin-bottom: ${({ theme }) => theme.spacing.lg};

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

const SocialProofBadge = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing.md};
  background: rgba(255, 255, 255, 0.1);
  border-radius: ${({ theme }) => theme.radius.md};
  backdrop-filter: blur(10px);
`;

const ProofIcon = styled.span`
  font-size: 24px;
`;

const ProofText = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  line-height: 1.4;
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
    return "linear-gradient(135deg, #10b981 0%, #059669 100%)";
  }};
  color: white;
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  line-height: 1.6;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
`;

// Comparison Table
const ComparisonTable = styled.div`
  background: rgba(255, 255, 255, 0.1);
  border-radius: ${({ theme }) => theme.radius.lg};
  overflow: hidden;
  margin: ${({ theme }) => theme.spacing.lg} 0;
  border: 1px solid rgba(255, 255, 255, 0.2);
`;

const ComparisonRow = styled.div<{ $isHeader?: boolean }>`
  display: grid;
  grid-template-columns: 2fr 1fr 1fr;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);

  ${({ $isHeader }) =>
    $isHeader &&
    `
    background: rgba(255, 255, 255, 0.1);
    font-weight: 600;
  `}

  &:last-child {
    border-bottom: none;
  }
`;

const ComparisonCell = styled.div`
  padding: ${({ theme }) => `${theme.spacing.md} ${theme.spacing.lg}`};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${({ theme }) => theme.typography.fontSize.base};

  &:first-child {
    justify-content: flex-start;
    font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
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
  background: #10b981;
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
  gap: ${({ theme }) => theme.spacing.lg};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  padding: ${({ theme }) => theme.spacing.lg};
  background: ${({ theme }) => theme.colors.surface};
  border: 2px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.lg};

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: ${({ theme }) => theme.spacing.md};
  }
`;

const ComparisonColumn = styled.div<{ $isAfter?: boolean }>`
  padding: ${({ theme }) => theme.spacing.md};
  background: ${({ $isAfter, theme }) =>
    $isAfter
      ? "linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(5, 150, 105, 0.05) 100%)"
      : "rgba(239, 68, 68, 0.05)"};
  border: 1px solid ${({ $isAfter }) => ($isAfter ? "#10b981" : "#ef4444")};
  border-radius: ${({ theme }) => theme.radius.md};
  position: relative;
`;

const ColumnLabel = styled.div<{ $isAfter?: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
  background: ${({ $isAfter }) =>
    $isAfter
      ? "linear-gradient(135deg, #10b981 0%, #059669 100%)"
      : "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)"};
  color: white;
  border-radius: ${({ theme }) => theme.radius.full};
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: ${({ theme }) => theme.spacing.sm};
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
  gap: ${({ theme }) => theme.spacing.xs};
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: ${({ theme }) => theme.radius.md};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  margin-bottom: ${({ theme }) => theme.spacing.md};
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
`;

const ArrowIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  color: #10b981;

  @media (max-width: 768px) {
    transform: rotate(90deg);
    margin: ${({ theme }) => theme.spacing.sm} 0;
  }
`;

const RoleCard = styled.div`
  padding: ${({ theme }) => theme.spacing.lg};
  background: linear-gradient(
    135deg,
    rgba(102, 126, 234, 0.1) 0%,
    rgba(118, 75, 162, 0.05) 100%
  );
  border: 2px solid rgba(102, 126, 234, 0.3);
  border-radius: ${({ theme }) => theme.radius.lg};
  margin-bottom: ${({ theme }) => theme.spacing.md};
  transition: all ${({ theme }) => theme.transitions.normal};

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(102, 126, 234, 0.2);
    border-color: rgba(102, 126, 234, 0.5);
  }
`;

const RoleCardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: start;
  margin-bottom: ${({ theme }) => theme.spacing.md};

  @media (max-width: 640px) {
    flex-direction: column;
    gap: ${({ theme }) => theme.spacing.sm};
  }
`;

const RoleTitle = styled.h4`
  font-size: ${({ theme }) => theme.typography.fontSize.xl};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.textPrimary};
  margin: 0;
`;

const RoleFitBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
  border-radius: ${({ theme }) => theme.radius.full};
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
`;

const RoleDescription = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  line-height: 1.6;
  color: ${({ theme }) => theme.colors.textSecondary};
  margin: 0;
`;

const ATSTipCard = styled.div`
  padding: ${({ theme }) => theme.spacing.lg};
  background: linear-gradient(
    135deg,
    rgba(16, 185, 129, 0.1) 0%,
    rgba(5, 150, 105, 0.05) 100%
  );
  border: 2px solid rgba(16, 185, 129, 0.3);
  border-radius: ${({ theme }) => theme.radius.lg};
  margin-bottom: ${({ theme }) => theme.spacing.md};
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  transition: all ${({ theme }) => theme.transitions.normal};

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(16, 185, 129, 0.15);
    border-color: rgba(16, 185, 129, 0.5);
  }
`;

const ATSIcon = styled.div`
  flex-shrink: 0;
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
  border-radius: ${({ theme }) => theme.radius.md};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
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

const PDFPreviewContainer = styled.div`
  width: 100%;
  height: 70vh;
  min-height: 500px;
  max-height: 800px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.md};
  overflow: hidden;
  background-color: ${({ theme }) => theme.colors.surface};

  @media (max-width: 640px) {
    height: 500px;
    min-height: 400px;
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

const ImprovementHighlight = styled.div`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: ${({ theme }) => theme.spacing.lg};
  border-radius: ${({ theme }) => theme.radius.md};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const HighlightTitle = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: ${({ theme }) => theme.spacing.xs};
  opacity: 0.9;
`;

const HighlightAction = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const HighlightReason = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  opacity: 0.95;
  line-height: 1.5;
`;

const HighlightImpact = styled.div`
  display: inline-block;
  background: rgba(255, 255, 255, 0.2);
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
  border-radius: ${({ theme }) => theme.radius.sm};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  margin-top: ${({ theme }) => theme.spacing.sm};
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
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.primary} 0%, #764ba2 100%);
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
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.primary} 0%, #764ba2 100%);
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

const CVSuccessSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xl};
`;

const SuccessCelebration = styled.div`
  text-align: center;
  padding: ${({ theme }) => theme.spacing.xl} 0;
  background: linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(5, 150, 105, 0.05) 100%);
  border: 2px solid #10b981;
  border-radius: ${({ theme }) => theme.radius.lg};
  position: relative;
  overflow: hidden;

  &::before {
    content: '✨';
    position: absolute;
    top: 10px;
    right: 20px;
    font-size: 40px;
    opacity: 0.3;
  }

  &::after {
    content: '🎉';
    position: absolute;
    bottom: 10px;
    left: 20px;
    font-size: 40px;
    opacity: 0.3;
  }
`;

const SuccessIcon = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  border-radius: ${({ theme }) => theme.radius.full};
  margin-bottom: ${({ theme }) => theme.spacing.md};
  box-shadow: 0 4px 20px rgba(16, 185, 129, 0.3);

  svg {
    width: 32px;
    height: 32px;
    color: white;
  }
`;

const SuccessTitle = styled.h3`
  font-size: ${({ theme }) => theme.typography.fontSize["2xl"]};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: #10b981;
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

const SuccessSubtext = styled.p`
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  max-width: 500px;
  margin: 0 auto;
`;

const ActionCardsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: ${({ theme }) => theme.spacing.lg};
`;

const ActionCard = styled.div<{ $variant?: 'primary' | 'secondary' | 'ghost' | 'accent' }>`
  padding: ${({ theme }) => theme.spacing.lg};
  background: ${({ theme }) => theme.colors.surface};
  border: 2px solid ${({ theme, $variant }) =>
    $variant === 'primary' ? theme.colors.primary :
    $variant === 'secondary' ? theme.colors.border :
    $variant === 'accent' ? '#f59e0b' :
    theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.lg};
  transition: all ${({ theme }) => theme.transitions.fast};
  cursor: pointer;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 24px ${({ theme, $variant }) =>
      $variant === 'primary' ? `${theme.colors.primary}25` :
      $variant === 'accent' ? 'rgba(245, 158, 11, 0.25)' :
      `${theme.colors.border}40`};
    border-color: ${({ theme, $variant }) =>
      $variant === 'primary' ? theme.colors.primary :
      $variant === 'secondary' ? theme.colors.primary :
      $variant === 'accent' ? '#f59e0b' :
      theme.colors.textSecondary};
  }
`;

const ActionCardHeader = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const ActionCardIcon = styled.div<{ $variant?: 'primary' | 'secondary' | 'ghost' | 'accent' }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme, $variant }) =>
    $variant === 'primary'
      ? `linear-gradient(135deg, ${theme.colors.primary} 0%, #764ba2 100%)`
      : $variant === 'secondary'
      ? `${theme.colors.primary}15`
      : $variant === 'accent'
      ? 'rgba(245, 158, 11, 0.15)'
      : `${theme.colors.textSecondary}15`};

  svg {
    width: 20px;
    height: 20px;
    color: ${({ theme, $variant }) =>
      $variant === 'primary' ? 'white' :
      $variant === 'accent' ? '#f59e0b' :
      theme.colors.primary};
  }
`;

const ActionCardTitle = styled.h4`
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.textPrimary};
  margin: 0;
`;

const ActionCardDescription = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
  line-height: 1.5;
  margin: 0;
`;

const LoadingModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  animation: fadeIn 0.3s ease-in-out;

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
`;

const LoadingModalContent = styled.div`
  background: ${({ theme }) => theme.colors.background};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.xl};
  padding: ${({ theme }) => theme.spacing["2xl"]};
  max-width: 600px;
  width: 90%;
  text-align: center;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  animation: slideUp 0.4s ease-out;

  @keyframes slideUp {
    from {
      transform: translateY(30px);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }
`;

const LoadingSpinner = styled.div`
  width: 80px;
  height: 80px;
  margin: 0 auto ${({ theme }) => theme.spacing.xl};
  border: 4px solid ${({ theme }) => theme.colors.border};
  border-top: 4px solid ${({ theme }) => theme.colors.primary};
  border-radius: 50%;
  animation: spin 1s linear infinite;

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

const LoadingTitle = styled.h3`
  font-size: ${({ theme }) => theme.typography.fontSize.xl};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.textPrimary};
  margin-bottom: ${({ theme }) => theme.spacing.md};
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.primary} 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const LoadingMessage = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  color: ${({ theme }) => theme.colors.textSecondary};
  line-height: 1.6;
  min-height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 ${({ theme }) => theme.spacing.lg};
  animation: messageSlide 0.5s ease-in-out;

  @keyframes messageSlide {
    0% {
      opacity: 0;
      transform: translateY(-10px);
    }
    100% {
      opacity: 1;
      transform: translateY(0);
    }
  }
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
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
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
  color: #10b981;
`;

const RoleMatchIcon = styled.div`
  width: 20px;
  height: 20px;
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 12px;
`;

const ImprovementVisualization = styled.div`
  padding: ${({ theme }) => theme.spacing["2xl"]};
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.xl};
  margin-top: ${({ theme }) => theme.spacing.xl};
`;

const VisualizationHeader = styled.div`
  text-align: center;
  margin-bottom: ${({ theme }) => theme.spacing["2xl"]};
`;

const VisualizationTitle = styled.h3`
  font-size: ${({ theme }) => theme.typography.fontSize["2xl"]};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.textPrimary};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const VisualizationSubtitle = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const ChartContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing["3xl"]};
  flex-wrap: wrap;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    flex-direction: column;
  }
`;

const CircularChart = styled.div`
  position: relative;
  width: 280px;
  height: 280px;
`;

const ScoreRing = styled.svg`
  transform: rotate(-90deg);
  filter: drop-shadow(0 4px 12px rgba(16, 185, 129, 0.2));
`;

const ChartCenter = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
`;

const CenterScore = styled.div`
  font-size: 48px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: #10b981;
  line-height: 1;
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

const CenterLabel = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const ImprovementsList = styled.div`
  flex: 1;
  min-width: 300px;
  max-width: 500px;
`;

const ImprovementItem = styled.div<{ $color: string }>`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.md};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-left: 4px solid ${({ $color }) => $color};
  border-radius: ${({ theme }) => theme.radius.md};
  transition: all ${({ theme }) => theme.transitions.normal};

  &:hover {
    transform: translateX(4px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
`;

const ImprovementIcon = styled.div<{ $color: string }>`
  width: 40px;
  height: 40px;
  background: ${({ $color }) => $color};
  border-radius: ${({ theme }) => theme.radius.md};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  flex-shrink: 0;
`;

const ImprovementContent = styled.div`
  flex: 1;
`;

const ImprovementCategory = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.textPrimary};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

const ImprovementDescription = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  color: ${({ theme }) => theme.colors.textSecondary};
  line-height: 1.4;
`;

interface RoleRecommendation {
  title: string;
  fit: number;
}

interface Improvement {
  category: string;
  action: string;
  impact: number;
  reason: string;
  section?: string; // Optional for backward compatibility with existing data
}

interface FakeSkillRecommendation {
  skill: string;
  category: string;
  learningPath: string[];
  projectIdeas: string[];
  estimatedTime: string;
}

interface Report {
  id: string;
  user_id: string;
  cv_id: string;
  job_ids: string[];
  fit_score: number;
  summary_free: string;
  summary_pro: {
    rewrittenBullets?: string[];
    roleRecommendations?: RoleRecommendation[];
    atsFlags?: string[];
  } | null;
  keywords: {
    missing?: string[];
  } | null;
  sample_rewrite: {
    original: string;
    rewritten: string;
  } | null;
  sample_role: {
    title: string;
    fit: number;
    description: string;
  } | null;
  role_fit: RoleRecommendation[] | null;
  ats_flags: string[] | null;
  pro: boolean;
  generated_cv: GeneratedCV | null;
  optimized_score: number | null;
  improvement_breakdown: Improvement[] | null;
  fake_skills_recommendations: FakeSkillRecommendation[] | null;
  fake_it_mode: boolean;
  created_at: string;
}

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
  const [loadingMessageIndex, setLoadingMessageIndex] = useState(0);
  const wasGeneratingRef = useRef(false);
  const [userCredits, setUserCredits] = useState<UserCredits>({
    credits: 0,
    hasSubscription: false,
    canAnalyze: false,
  });

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

  // Loading messages
  const loadingMessages = [
    "Analyzing your experience and skills... 🔍",
    "Optimizing keywords for ATS systems... 🤖",
    "Enhancing your achievements... 🌟",
    "Restructuring for maximum impact... 📊",
    "Tailoring content to job requirements... 🎯",
    "Polishing the final details... ✨",
    "Almost there... 🚀",
  ];

  // Define analyzeOptimizedCV before useEffect that uses it
  const analyzeOptimizedCV = useCallback(async () => {
    if (!report) return;

    console.log("🔍 Starting CV analysis...", {
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
      console.error("❌ Failed to analyze optimized CV:", error);
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

      // Load cached analysis results from database if available
      const hasValidScore = typeof data.optimized_score === "number";
      const hasValidBreakdown =
        data.improvement_breakdown &&
        Array.isArray(data.improvement_breakdown) &&
        data.improvement_breakdown.length > 0;

      console.log("🔍 Cache validation:", {
        hasValidScore,
        hasValidBreakdown,
        willLoadFromCache: hasValidScore && hasValidBreakdown,
      });

      if (hasValidScore && hasValidBreakdown) {
        console.log("✅ Loading from cache:", {
          score: data.optimized_score,
          breakdownCount: data.improvement_breakdown.length,
          breakdown: data.improvement_breakdown,
        });
        setOptimizedScore(data.optimized_score);
        setImprovementBreakdown(data.improvement_breakdown);
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

  // Rotate loading messages every 5 seconds
  useEffect(() => {
    if (!isGeneratingCV && !isUpgrading) {
      setLoadingMessageIndex(0);
      return;
    }

    const interval = setInterval(() => {
      setLoadingMessageIndex((prev) => (prev + 1) % loadingMessages.length);
    }, 2500);

    return () => clearInterval(interval);
  }, [isGeneratingCV, isUpgrading, loadingMessages.length]);

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

  const handleCreateFakeItReport = async () => {
    if (!report || isGeneratingCV) return;

    setIsGeneratingCV(true);
    try {
      // Report is already pro, just regenerate CV with fake it mode (no credit cost)
      // First clear the existing generated_cv to allow regeneration
      const supabase = createClient();
      await supabase
        .from("reports")
        .update({ generated_cv: null, fake_it_mode: true })
        .eq("id", report.id);

      // Generate CV with fake it mode
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
        throw new Error(cvResult.error || "Failed to generate CV");
      }

      // Refresh the report data
      const { data: updatedReport } = await supabase
        .from("reports")
        .select("*")
        .eq("id", report.id)
        .single();

      if (updatedReport) {
        setReport(updatedReport);

        // Generate PDF on client and save to optimized_cvs
        if (updatedReport.generated_cv) {
          try {
            const pdf = await generateCVPDF(updatedReport.generated_cv);
            const pdfBlob = pdf.output('blob');

            const userName = updatedReport.generated_cv.contact?.name || 'Optimized';
            const sanitizedName = userName.replace(/[^a-zA-Z0-9\s]/g, '').replace(/\s+/g, '_');
            const fileName = `optimized/${user?.id}/${updatedReport.id}/${sanitizedName}.pdf`;

            // Upload to storage
            const { error: uploadError } = await supabase.storage
              .from('cv-files')
              .upload(fileName, pdfBlob, {
                contentType: 'application/pdf',
                upsert: true,
              });

            if (uploadError) {
              console.error('Upload error:', uploadError);
              throw uploadError;
            }

            const { data: urlData } = supabase.storage
              .from('cv-files')
              .getPublicUrl(fileName);

            // Save to optimized_cvs
            await supabase
              .from('optimized_cvs')
              .delete()
              .eq('report_id', updatedReport.id);

            const { error: insertError } = await supabase
              .from('optimized_cvs')
              .insert({
                user_id: user?.id,
                report_id: updatedReport.id,
                original_cv_id: updatedReport.cv_id,
                title: `${userName} - Optimized CV`,
                file_url: urlData.publicUrl,
                text: JSON.stringify(updatedReport.generated_cv),
                lang: 'en',
              });

            if (insertError) {
              console.error('Insert error:', insertError);
            } else {
              console.log('✅ CV saved to My CVs');
            }
          } catch (saveError) {
            console.error('Error saving to My CVs:', saveError);
          }
        }
      }

      toast.success("CV regenerated with Fake It Mode!");
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

        // Automatically generate optimized CV
        try {
          const cvResponse = await fetch("/api/cv/generate", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              reportId: data.id,
              fakeItMode: false,
            }),
          });

          if (cvResponse.ok) {
            // Refresh report again to get generated_cv
            const { data: updatedData } = await supabase
              .from("reports")
              .select("*")
              .eq("id", reportId)
              .single();

            if (updatedData) {
              setReport(updatedData);

              // Generate PDF on client and save to optimized_cvs
              if (updatedData.generated_cv) {
                try {
                  const pdf = await generateCVPDF(updatedData.generated_cv);
                  const pdfBlob = pdf.output('blob');

                  const userName = updatedData.generated_cv.contact?.name || 'Optimized';
                  const sanitizedName = userName.replace(/[^a-zA-Z0-9\s]/g, '').replace(/\s+/g, '_');
                  const fileName = `optimized/${user?.id}/${updatedData.id}/${sanitizedName}.pdf`;

                  // Upload to storage
                  const { error: uploadError } = await supabase.storage
                    .from('cv-files')
                    .upload(fileName, pdfBlob, {
                      contentType: 'application/pdf',
                      upsert: true,
                    });

                  if (uploadError) {
                    console.error('Upload error:', uploadError);
                    throw uploadError;
                  }

                  const { data: urlData } = supabase.storage
                    .from('cv-files')
                    .getPublicUrl(fileName);

                  // Save to optimized_cvs
                  await supabase
                    .from('optimized_cvs')
                    .delete()
                    .eq('report_id', updatedData.id);

                  const { error: insertError } = await supabase
                    .from('optimized_cvs')
                    .insert({
                      user_id: user?.id,
                      report_id: updatedData.id,
                      original_cv_id: updatedData.cv_id,
                      title: `${userName} - Optimized CV`,
                      file_url: urlData.publicUrl,
                      text: JSON.stringify(updatedData.generated_cv),
                      lang: 'en',
                    });

                  if (insertError) {
                    console.error('Insert error:', insertError);
                  } else {
                    console.log('✅ CV saved to My CVs');
                  }
                } catch (saveError) {
                  console.error('Error saving to My CVs:', saveError);
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
              }
            }
          }
        } catch (cvError) {
          console.error("CV generation error:", cvError);
        }

        // Scroll to top after everything completes
        window.scrollTo({ top: 0, behavior: 'smooth' });
        toast.success("Your optimized CV is ready!");
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Upgrade failed";
      toast.error(errorMessage);
    } finally {
      setIsUpgrading(false);
    }
  };

  const handleGenerateCV = async () => {
    if (!report) return;

    setIsGeneratingCV(true);
    // Clear previous analysis cache
    setOptimizedScore(null);
    setImprovementBreakdown([]);

    try {
      const response = await fetch("/api/cv/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          reportId: report.id,
          fakeItMode,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "CV generation failed");
      }

      toast.success(
        "Your optimized CV has been generated successfully! You can now download it as PDF."
      );

      // Refresh report to get generated_cv (cache will be cleared)
      const supabase = createClient();
      const { data } = await supabase
        .from("reports")
        .select("*")
        .eq("id", reportId)
        .single();

      if (data) {
        setReport(data);
      }

      // Analyze the optimized CV to get new match score
      await analyzeOptimizedCV();
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "CV generation failed";
      toast.error(errorMessage);
    } finally {
      setIsGeneratingCV(false);
    }
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
      console.error("CV preview error:", error);
      toast.error("Failed to preview CV. Please try again.");
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
      toast.success("CV downloaded successfully! Check your downloads folder.");
      handleClosePreview(); // Close modal after download
    } catch (error) {
      console.error("CV download error:", error);
      toast.error("Failed to download CV. Please try again.");
    }
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
      console.error("CV preview error:", error);
      toast.error("Failed to preview CV. Please try again.");
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
        <Title>CV Analysis Report</Title>
        <HeaderMeta>
          <Badge variant={report.pro ? "info" : "default"}>
            {report.pro ? "Pro Report" : "Free Report"}
          </Badge>
          <span style={{ color: "#9ca3af", fontSize: "14px" }}>
            Created on {new Date(report.created_at).toLocaleDateString("tr-TR")}
          </span>
          <CreditsIndicator
            $subscription={userCredits.hasSubscription}
            $low={!userCredits.hasSubscription && userCredits.credits <= 2}
            onClick={() => setIsBuyCreditsModalOpen(true)}
          >
            {userCredits.hasSubscription ? (
              <>✓ Pro Active</>
            ) : (
              <>
                <span className="credit-value">{userCredits.credits}</span> credits
              </>
            )}
          </CreditsIndicator>
        </HeaderMeta>
        {jobPostingTitles.length > 0 && (
          <div style={{ marginTop: "12px" }}>
            <span
              style={{ color: "#6b7280", fontSize: "14px", fontWeight: "500" }}
            >
              Job Posting{jobPostingTitles.length > 1 ? "s" : ""}:{" "}
            </span>
            <span
              style={{ color: "white", fontSize: "14px", fontWeight: "600" }}
            >
              {jobPostingTitles.join(" • ")}
            </span>
          </div>
        )}
      </Header>

      <Grid>
        {optimizedScore !== null && report.generated_cv ? (
          <ComparisonScoreCard variant="elevated">
            <ScoreComparison>
              <ScoreColumn>
                <ScoreTitle>ORIGINAL</ScoreTitle>
                <ComparisonValue>{report.fit_score}%</ComparisonValue>
              </ScoreColumn>
              <ScoreDivider />
              <ScoreColumn>
                <ScoreTitle>OPTIMIZED</ScoreTitle>
                <ComparisonValue $isOptimized>
                  {optimizedScore}%
                </ComparisonValue>
              </ScoreColumn>
            </ScoreComparison>
            {optimizedScore > report.fit_score && (
              <ImprovementBadge>
                ↑ +{optimizedScore - report.fit_score}% Improvement
              </ImprovementBadge>
            )}
            {isAnalyzingOptimized && (
              <LoadingText>Analyzing optimized CV...</LoadingText>
            )}
          </ComparisonScoreCard>
        ) : (
          <ScoreCard variant="elevated">
            <ScoreValue $score={report.fit_score}>{report.fit_score}%</ScoreValue>
            <ScoreLabel>Match Score</ScoreLabel>
            <ScoreContext $score={report.fit_score}>{getScoreLabel(report.fit_score)}</ScoreContext>
            {report.generated_cv && isAnalyzingOptimized && (
              <LoadingText>Analyzing optimized CV...</LoadingText>
            )}
          </ScoreCard>
        )}

        <ScoreCard variant="elevated">
          <ScoreValue>{missingKeywords.length}</ScoreValue>
          <ScoreLabel>Missing Keywords</ScoreLabel>
        </ScoreCard>

        {report.pro && (
          <ScoreCard variant="elevated">
            <ScoreValue>{roleRecommendations.length}</ScoreValue>
            <ScoreLabel>Role Recommendations</ScoreLabel>
          </ScoreCard>
        )}
      </Grid>

      {/* Personalized Alert - Show immediately after scores for free users */}
      {!report.pro && (
        <PersonalizedAlert
          $variant={getPersonalizedMessage(report.fit_score).variant}
        >
          {getPersonalizedMessage(report.fit_score).message}
        </PersonalizedAlert>
      )}

      {report.fit_score < 50 &&
        roleRecommendations.length > 0 &&
        report.pro && (
          <CareerInsightCard>
            <InsightHeader>
              <InsightIcon><LightBulbIcon /></InsightIcon>
              <InsightContent>
                <InsightTitle>We Found Better Matches For You</InsightTitle>
                <InsightSubtitle>
                  Your CV shows a {report.fit_score}% match with this position.
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
                Analyzing optimized CV to calculate improvement breakdown...
              </p>
            </Card.Content>
          </Card>
        </Section>
      )}

      {improvementBreakdown.length > 0 &&
        optimizedScore !== null &&
        !isAnalyzingOptimized && (
          <>
            <Section>
              <Card variant="bordered">
                <Card.Header>
                  <Card.Title>
                    <TargetIcon /> How We Improved Your Score
                  </Card.Title>
                  <Card.Description>
                    Detailed breakdown of each optimization and its impact
                  </Card.Description>
                </Card.Header>
                <Card.Content>
                  <BreakdownContainer>
                    {improvementBreakdown.map((improvement, index) => (
                      <BreakdownItem
                        key={index}
                        onClick={() => handleImprovementClick(improvement)}
                        title="Click to view this improvement in your CV"
                      >
                        <ImpactBadge>
                          +{Math.round(improvement.impact * 10) / 10}
                        </ImpactBadge>
                        <ImpactContent>
                          <ImpactCategory>
                            {improvement.category}
                          </ImpactCategory>
                          <ImpactAction>{improvement.action}</ImpactAction>
                          <ImpactReason>{improvement.reason}</ImpactReason>
                        </ImpactContent>
                        <ImpactPoints>
                          <ImpactValue>
                            +{Math.round(improvement.impact * 10) / 10}%
                          </ImpactValue>
                          <ImpactLabel>Score</ImpactLabel>
                        </ImpactPoints>
                      </BreakdownItem>
                    ))}
                  </BreakdownContainer>
                  <TotalImpactSummary>
                    <TotalLabel>Total Impact</TotalLabel>
                    <TotalValue>
                      +
                      {Math.round(
                        improvementBreakdown.reduce(
                          (sum, imp) => sum + imp.impact,
                          0
                        ) * 10
                      ) / 10}
                      %
                    </TotalValue>
                  </TotalImpactSummary>
                </Card.Content>
              </Card>
            </Section>

            <Section>
              <ImprovementVisualization>
                <VisualizationHeader>
                  <VisualizationTitle>
                    📊 Score Improvement Breakdown
                  </VisualizationTitle>
                  <VisualizationSubtitle>
                    Visual representation of how each optimization contributed
                    to your final score
                  </VisualizationSubtitle>
                </VisualizationHeader>

                <ChartContainer>
                  <CircularChart>
                    <ScoreRing width="280" height="280">
                      <circle
                        cx="140"
                        cy="140"
                        r="120"
                        fill="none"
                        stroke="#e5e7eb"
                        strokeWidth="20"
                      />
                      <circle
                        cx="140"
                        cy="140"
                        r="120"
                        fill="none"
                        stroke="#10b981"
                        strokeWidth="20"
                        strokeDasharray={`${(optimizedScore / 100) * 754} 754`}
                        strokeLinecap="round"
                        style={{
                          transition: "stroke-dasharray 1s ease-in-out",
                        }}
                      />
                    </ScoreRing>
                    <ChartCenter>
                      <CenterScore>{optimizedScore}%</CenterScore>
                      <CenterLabel>New Score</CenterLabel>
                      <div
                        style={{
                          marginTop: "8px",
                          fontSize: "14px",
                          color: "#6b7280",
                        }}
                      >
                        from {report.fit_score}%
                      </div>
                    </ChartCenter>
                  </CircularChart>

                  <ImprovementsList>
                    {improvementBreakdown.map((improvement, index) => {
                      const colors = [
                        "#10b981",
                        "#3b82f6",
                        "#8b5cf6",
                        "#f59e0b",
                        "#ec4899",
                        "#14b8a6",
                      ];
                      const color = colors[index % colors.length];

                      return (
                        <ImprovementItem key={index} $color={color}>
                          <ImprovementIcon $color={color}>
                            +{Math.round(improvement.impact * 10) / 10}%
                          </ImprovementIcon>
                          <ImprovementContent>
                            <ImprovementCategory>
                              {improvement.category}
                            </ImprovementCategory>
                            <ImprovementDescription>
                              {improvement.action}
                            </ImprovementDescription>
                          </ImprovementContent>
                        </ImprovementItem>
                      );
                    })}
                  </ImprovementsList>
                </ChartContainer>
              </ImprovementVisualization>
            </Section>
          </>
        )}

      <Section>
        <Card variant="bordered">
          <Card.Header>
            <Card.Title>Summary</Card.Title>
            <Card.Description>
              AI-generated analysis of your CV match
            </Card.Description>
          </Card.Header>
          <Card.Content>
            <p>{report.summary_free}</p>
          </Card.Content>
        </Card>
      </Section>

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

      {!report.pro ? (
        <>
          {/* Rewritten Bullets with Before/After Example */}
          <Section>
            <Card variant="bordered">
              <Card.Header>
                <Card.Title>Rewritten Bullet Points</Card.Title>
                <Card.Description>
                  Professionally enhanced versions of your experience bullets
                </Card.Description>
              </Card.Header>
              <Card.Content>
                <SampleBadge>✨ Free Sample - See the Difference</SampleBadge>

                {report.sample_rewrite ? (
                  <BeforeAfterCard>
                    <ComparisonColumn>
                      <ColumnLabel>❌ Before (Your CV)</ColumnLabel>
                      <ComparisonText>
                        {report.sample_rewrite.original}
                      </ComparisonText>
                    </ComparisonColumn>

                    <ComparisonColumn $isAfter>
                      <ColumnLabel $isAfter>✅ After (Pro)</ColumnLabel>
                      <ComparisonText>
                        {report.sample_rewrite.rewritten}
                      </ComparisonText>
                    </ComparisonColumn>
                  </BeforeAfterCard>
                ) : (
                  <div
                    style={{
                      padding: "20px",
                      textAlign: "center",
                      color: "#9ca3af",
                      fontSize: "14px",
                      border: "1px dashed #334155",
                      borderRadius: "8px",
                      marginBottom: "24px",
                    }}
                  >
                    Sample rewrite is being generated from your CV. Please
                    refresh the page or create a new analysis.
                  </div>
                )}

                <BlurredPreviewSection style={{ marginTop: "16px", paddingBottom: "48px" }}>
                  <BlurredContent>
                    <BulletList>
                      <li>
                        Spearheaded the development of microservices architecture that improved system scalability by 45%, reducing server costs by $15K/month while maintaining 99.9% uptime
                      </li>
                      <li>
                        Led cross-functional teams of 8 developers to deliver high-impact projects, reducing time-to-market by 40% through implementation of agile methodologies
                      </li>
                    </BulletList>
                  </BlurredContent>
                  <SeeMoreButton onClick={scrollToUpgrade}>
                    See all professional rewrites
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                    </svg>
                  </SeeMoreButton>
                </BlurredPreviewSection>
              </Card.Content>
            </Card>
          </Section>

          {/* Role Recommendations with Sample */}
          <Section>
            <Card variant="bordered">
              <Card.Header>
                <Card.Title>Alternative Role Recommendations</Card.Title>
                <Card.Description>
                  Discover roles that match your skills and experience
                </Card.Description>
              </Card.Header>
              <Card.Content>
                <SampleBadge>✨ Top Match for Your Profile</SampleBadge>

                {report.sample_role ? (
                  <RoleCard>
                    <RoleCardHeader>
                      <RoleTitle>{report.sample_role.title}</RoleTitle>
                      <RoleFitBadge>
                        ✓ {report.sample_role.fit}% Match
                      </RoleFitBadge>
                    </RoleCardHeader>
                    <RoleDescription>
                      {report.sample_role.description}
                    </RoleDescription>
                  </RoleCard>
                ) : (
                  <div
                    style={{
                      padding: "20px",
                      textAlign: "center",
                      color: "#9ca3af",
                      fontSize: "14px",
                      border: "1px dashed #334155",
                      borderRadius: "8px",
                    }}
                  >
                    Role recommendation is being generated. Please refresh the
                    page or create a new analysis.
                  </div>
                )}

                <BlurredPreviewSection style={{ marginTop: "16px", paddingBottom: "48px" }}>
                  <BlurredContent>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "10px",
                      }}
                    >
                      <div
                        style={{
                          padding: "14px",
                          backgroundColor: "#1e293b",
                          border: "1px solid #334155",
                          borderRadius: "10px",
                        }}
                      >
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                          <span style={{ fontWeight: 600, fontSize: "15px", color: "#f1f5f9" }}>
                            Technical Lead
                          </span>
                          <Badge variant="success">85% Match</Badge>
                        </div>
                        <p style={{ fontSize: "13px", color: "#94a3b8", margin: 0 }}>
                          Your leadership experience and technical depth make you an excellent candidate...
                        </p>
                      </div>
                      <div
                        style={{
                          padding: "14px",
                          backgroundColor: "#1e293b",
                          border: "1px solid #334155",
                          borderRadius: "10px",
                        }}
                      >
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                          <span style={{ fontWeight: 600, fontSize: "15px", color: "#f1f5f9" }}>
                            Solutions Architect
                          </span>
                          <Badge variant="success">82% Match</Badge>
                        </div>
                        <p style={{ fontSize: "13px", color: "#94a3b8", margin: 0 }}>
                          Your system design skills position you well for this strategic role...
                        </p>
                      </div>
                    </div>
                  </BlurredContent>
                  <SeeMoreButton onClick={scrollToUpgrade}>
                    See all role recommendations
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                    </svg>
                  </SeeMoreButton>
                </BlurredPreviewSection>
              </Card.Content>
            </Card>
          </Section>

          {/* ATS Optimization Tips with Sample */}
          <Section>
            <Card variant="bordered">
              <Card.Header>
                <Card.Title>ATS Optimization Tips</Card.Title>
                <Card.Description>
                  Improve your chances with applicant tracking systems
                </Card.Description>
              </Card.Header>
              <Card.Content>
                <SampleBadge>✨ Free Tip - Boost Your ATS Score</SampleBadge>

                <ATSTipCard>
                  <ATSIcon>📄</ATSIcon>
                  <ATSTipContent>
                    <ATSTipTitle>Optimize Your CV File Name</ATSTipTitle>
                    <ATSTipText>
                      Name your CV file strategically:
                      &quot;FirstName_LastName_Position_CV.pdf&quot; (e.g.,
                      &quot;John_Smith_Senior_Developer_CV.pdf&quot;). ATS
                      systems often index file names, and including the position
                      helps recruiters find your application quickly. Avoid
                      generic names like &quot;Resume.pdf&quot; or
                      &ldquo;CV_final_v2.pdf" which appear unprofessional.
                    </ATSTipText>
                  </ATSTipContent>
                </ATSTipCard>

                <BlurredPreviewSection style={{ marginTop: "16px", paddingBottom: "48px" }}>
                  <BlurredContent>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "10px",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          gap: "12px",
                          padding: "14px",
                          backgroundColor: "#1e293b",
                          border: "1px solid #334155",
                          borderRadius: "10px",
                        }}
                      >
                        <div style={{ fontSize: "20px" }}>🎯</div>
                        <div>
                          <div style={{ fontWeight: 600, fontSize: "14px", color: "#f1f5f9", marginBottom: "4px" }}>
                            Add Quantifiable Achievements
                          </div>
                          <p style={{ fontSize: "12px", color: "#94a3b8", margin: 0 }}>
                            Include specific metrics and percentages to demonstrate impact...
                          </p>
                        </div>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          gap: "12px",
                          padding: "14px",
                          backgroundColor: "#1e293b",
                          border: "1px solid #334155",
                          borderRadius: "10px",
                        }}
                      >
                        <div style={{ fontSize: "20px" }}>🔑</div>
                        <div>
                          <div style={{ fontWeight: 600, fontSize: "14px", color: "#f1f5f9", marginBottom: "4px" }}>
                            Strategic Keyword Placement
                          </div>
                          <p style={{ fontSize: "12px", color: "#94a3b8", margin: 0 }}>
                            Place important keywords in your professional summary...
                          </p>
                        </div>
                      </div>
                    </div>
                  </BlurredContent>
                  <SeeMoreButton onClick={scrollToUpgrade}>
                    See all ATS optimization tips
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                    </svg>
                  </SeeMoreButton>
                </BlurredPreviewSection>
              </Card.Content>
            </Card>
          </Section>

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
                    <ComparisonCell>AI-Optimized CV PDF</ComparisonCell>
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
      ) : (
        <>
          <Section>
            <Card variant="bordered">
              <Card.Header>
                <Card.Title>Rewritten Bullet Points</Card.Title>
                <Card.Description>
                  Improved versions of your experience bullets
                </Card.Description>
              </Card.Header>
              <Card.Content>
                <BulletList>
                  {rewrittenBullets.map((bullet: string, index: number) => (
                    <li key={index}>{bullet}</li>
                  ))}
                </BulletList>
              </Card.Content>
            </Card>
          </Section>

          <Section>
            <Card variant="bordered">
              <Card.Header>
                <Card.Title>Role Recommendations</Card.Title>
                <Card.Description>
                  Alternative roles that match your profile
                </Card.Description>
              </Card.Header>
              <Card.Content>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "12px",
                  }}
                >
                  {roleRecommendations.map((role: RoleRecommendation) => (
                    <div
                      key={role.title}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        padding: "12px",
                        backgroundColor: "#1e293b", // slate-800 (theme.colors.surface)
                        border: "1px solid #334155", // slate-700 (theme.colors.border)
                        borderRadius: "8px",
                      }}
                    >
                      <span style={{ fontWeight: 500, color: "#f1f5f9" }}>
                        {role.title}
                      </span>
                      <Badge variant="success">{role.fit}% Match</Badge>
                    </div>
                  ))}
                </div>
              </Card.Content>
            </Card>
          </Section>

          <Section>
            <Card variant="bordered">
              <Card.Header>
                <Card.Title>ATS Optimization Tips</Card.Title>
                <Card.Description>
                  Improve your chances with applicant tracking systems
                </Card.Description>
              </Card.Header>
              <Card.Content>
                <BulletList>
                  {atsFlags.map((flag: string, index: number) => (
                    <li key={index}>{flag}</li>
                  ))}
                </BulletList>
              </Card.Content>
            </Card>
          </Section>

          {report.fake_skills_recommendations &&
            report.fake_skills_recommendations.length > 0 && (
              <Section>
                <Card variant="bordered">
                  <Card.Header>
                    <Card.Title>
                      🎯 Learning Path - Turn Fake Skills into Real Ones!
                    </Card.Title>
                    <Card.Description>
                      You&apos;ve added these skills to your CV. Now let's make
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
            <Card variant="bordered">
              <Card.Header>
                <Card.Title>
                  <TargetIcon /> Generate Optimized CV
                </Card.Title>
                <Card.Description>
                  Get a fully optimized, ATS-friendly CV with all improvements
                  applied
                </Card.Description>
              </Card.Header>
              <Card.Content>
                {!report.generated_cv ? (
                  <div style={{
                    textAlign: 'center',
                    padding: '48px 24px',
                  }}>
                    <div style={{
                      width: '64px',
                      height: '64px',
                      margin: '0 auto 20px',
                      background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.15) 0%, rgba(118, 75, 162, 0.15) 100%)',
                      borderRadius: '16px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                      <TargetIcon />
                    </div>
                    <h3 style={{
                      fontSize: '18px',
                      fontWeight: 600,
                      color: '#f1f5f9',
                      marginBottom: '8px'
                    }}>
                      Generate Your Optimized CV
                    </h3>
                    <p style={{
                      color: '#9ca3af',
                      fontSize: '14px',
                      marginBottom: '24px',
                      maxWidth: '400px',
                      margin: '0 auto 24px'
                    }}>
                      Create an ATS-optimized CV tailored for this job position with all improvements applied.
                    </p>
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
                            throw new Error(cvResult.error || "Failed to generate CV");
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

                            // Generate PDF on client and save to optimized_cvs
                            if (updatedReport.generated_cv) {
                              try {
                                const pdf = await generateCVPDF(updatedReport.generated_cv);
                                const pdfBlob = pdf.output('blob');

                                const userName = updatedReport.generated_cv.contact?.name || 'Optimized';
                                const sanitizedName = userName.replace(/[^a-zA-Z0-9\s]/g, '').replace(/\s+/g, '_');
                                const fileName = `optimized/${user?.id}/${updatedReport.id}/${sanitizedName}.pdf`;

                                // Upload to storage
                                const { error: uploadError } = await supabase.storage
                                  .from('cv-files')
                                  .upload(fileName, pdfBlob, {
                                    contentType: 'application/pdf',
                                    upsert: true,
                                  });

                                if (uploadError) {
                                  console.error('Upload error:', uploadError);
                                  throw uploadError;
                                }

                                const { data: urlData } = supabase.storage
                                  .from('cv-files')
                                  .getPublicUrl(fileName);

                                // Save to optimized_cvs
                                await supabase
                                  .from('optimized_cvs')
                                  .delete()
                                  .eq('report_id', updatedReport.id);

                                await supabase
                                  .from('optimized_cvs')
                                  .insert({
                                    user_id: user?.id,
                                    report_id: updatedReport.id,
                                    original_cv_id: updatedReport.cv_id,
                                    title: `${userName} - Optimized CV`,
                                    file_url: urlData.publicUrl,
                                    text: JSON.stringify(updatedReport.generated_cv),
                                    lang: 'en',
                                  });

                                console.log('✅ CV saved to My CVs');
                              } catch (saveError) {
                                console.error('Error saving to My CVs:', saveError);
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
                              }
                            } catch (analyzeError) {
                              console.error("Score analysis error:", analyzeError);
                            }
                          }

                          toast.success("Your optimized CV is ready!");
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
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      }}
                    >
                      {isUpgrading ? "Generating..." : "Generate Optimized CV"}
                    </Button>
                  </div>
                ) : (
                  <CVSuccessSection>
                    <SuccessCelebration>
                      <SuccessIcon>
                        <CheckCircleIcon />
                      </SuccessIcon>
                      <SuccessTitle>Your Optimized CV is Ready!</SuccessTitle>
                      <SuccessSubtext>
                        Your professionally crafted CV is ready to download. Choose
                        your next action below.
                      </SuccessSubtext>
                      {report?.fake_it_mode && (
                        <div style={{
                          marginTop: '20px',
                          padding: '16px 20px',
                          background: 'linear-gradient(135deg, rgba(251, 191, 36, 0.15) 0%, rgba(245, 158, 11, 0.2) 50%, rgba(251, 191, 36, 0.15) 100%)',
                          border: '2px solid rgba(245, 158, 11, 0.5)',
                          borderRadius: '12px',
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: '12px',
                          boxShadow: '0 4px 12px rgba(245, 158, 11, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
                          position: 'relative',
                          overflow: 'hidden',
                        }}>
                          <div style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            height: '1px',
                            background: 'linear-gradient(90deg, transparent, rgba(251, 191, 36, 0.6), transparent)',
                          }} />
                          <div style={{
                            flexShrink: 0,
                            width: '32px',
                            height: '32px',
                            borderRadius: '8px',
                            background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: '0 2px 8px rgba(245, 158, 11, 0.3)',
                            color: '#ffffff',
                          }}>
                            <SparklesIcon />
                          </div>
                          <div style={{ flex: 1 }}>
                            <div style={{
                              fontSize: '15px',
                              fontWeight: 600,
                              color: '#fbbf24',
                              marginBottom: '4px',
                              letterSpacing: '0.3px',
                            }}>
                              Fake It Mode Enabled
                            </div>
                            <div style={{
                              fontSize: '13px',
                              color: '#fcd34d',
                              lineHeight: '1.5',
                              opacity: 0.9,
                            }}>
                              This CV includes learning paths for missing skills to help you transition into your target role
                            </div>
                          </div>
                        </div>
                      )}
                    </SuccessCelebration>

                    {/* Fake It Mode Card - only show if premium and not already in fake it mode */}
                    {report?.pro && !report?.fake_it_mode && (
                      <ActionCard
                        $variant="accent"
                        onClick={handleCreateFakeItReport}
                        style={{
                          opacity: isGeneratingCV ? 0.6 : 1,
                          cursor: isGeneratingCV ? 'not-allowed' : 'pointer',
                          background: 'linear-gradient(135deg, rgba(251, 191, 36, 0.08) 0%, rgba(245, 158, 11, 0.12) 100%)',
                          border: '2px solid #f59e0b',
                          marginBottom: '20px',
                        }}
                      >
                        <ActionCardHeader>
                          <ActionCardIcon $variant="accent">
                            {isGeneratingCV ? <Spinner size="sm" /> : <SparklesIcon />}
                          </ActionCardIcon>
                          <ActionCardTitle style={{
                            background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                          }}>
                            {isGeneratingCV ? "Creating New Report..." : "Try Fake It Mode"}
                          </ActionCardTitle>
                        </ActionCardHeader>
                        <ActionCardDescription>
                          {isGeneratingCV
                            ? "Creating a new report with Fake It Mode enabled. This will include missing skills and learning paths..."
                            : "Create a new report with missing skills added to your CV. Get learning paths and project ideas to acquire these skills. Perfect for career transitions!"
                          }
                        </ActionCardDescription>
                      </ActionCard>
                    )}

                    <ActionCardsGrid>
                      <ActionCard
                        $variant="primary"
                        onClick={handlePreviewCV}
                      >
                        <ActionCardHeader>
                          <ActionCardIcon $variant="primary">
                            <EyeIcon />
                          </ActionCardIcon>
                          <ActionCardTitle>Preview & Download</ActionCardTitle>
                        </ActionCardHeader>
                        <ActionCardDescription>
                          Review your optimized CV and download it as a PDF to start
                          applying immediately.
                        </ActionCardDescription>
                      </ActionCard>

                      <ActionCard
                        $variant="secondary"
                        onClick={() => {
                          if (report?.pro) {
                            setIsCoverLetterModalOpen(true);
                          } else {
                            setIsPremiumModalOpen(true);
                          }
                        }}
                      >
                        <ActionCardHeader>
                          <ActionCardIcon $variant="secondary">
                            <EnvelopeIcon size="24" />
                          </ActionCardIcon>
                          <ActionCardTitle>Generate Cover Letter</ActionCardTitle>
                        </ActionCardHeader>
                        <ActionCardDescription>
                          Create a tailored cover letter that perfectly complements
                          your optimized CV.
                        </ActionCardDescription>
                      </ActionCard>

                      <ActionCard
                        $variant="ghost"
                        onClick={!isGeneratingCV ? handleGenerateCV : undefined}
                        style={{ opacity: isGeneratingCV ? 0.6 : 1, cursor: isGeneratingCV ? 'not-allowed' : 'pointer' }}
                      >
                        <ActionCardHeader>
                          <ActionCardIcon $variant="ghost">
                            <RefreshIcon />
                          </ActionCardIcon>
                          <ActionCardTitle>
                            {isGeneratingCV ? "Regenerating..." : "Regenerate CV"}
                          </ActionCardTitle>
                        </ActionCardHeader>
                        <ActionCardDescription>
                          {isGeneratingCV
                            ? "Please wait while we regenerate your CV..."
                            : "Not satisfied? Generate a new version with different optimizations."}
                        </ActionCardDescription>
                      </ActionCard>
                    </ActionCardsGrid>
                  </CVSuccessSection>
                )}
              </Card.Content>
            </Card>
          </Section>
        </>
      )}

      {/* CV Preview Modal */}
      <Modal
        isOpen={isPreviewOpen}
        onClose={handleClosePreview}
        title="CV Preview"
        description="Review your optimized CV before downloading"
        size="lg"
      >
        <Modal.Body>
          {selectedImprovement && (
            <ImprovementHighlight>
              <HighlightTitle>
                {selectedImprovement.category} • +
                {Math.round(selectedImprovement.impact * 10) / 10}% Impact
                {selectedImprovement.section &&
                  ` • ${
                    selectedImprovement.section.charAt(0).toUpperCase() +
                    selectedImprovement.section.slice(1)
                  } Section`}
              </HighlightTitle>
              <HighlightAction>{selectedImprovement.action}</HighlightAction>
              <HighlightReason>{selectedImprovement.reason}</HighlightReason>
              <HighlightImpact>
                <LightBulbIcon /> This improvement boosted your score by +
                {Math.round(selectedImprovement.impact * 10) / 10}%
                {selectedImprovement.section &&
                  ` - Look for the green highlighted section in the CV below`}
              </HighlightImpact>
            </ImprovementHighlight>
          )}
          <PDFPreviewContainer>
            {pdfPreviewUrl ? (
              <PDFViewer
                src={`${pdfPreviewUrl}#toolbar=0&navpanes=0&scrollbar=0&view=FitH`}
                title="CV Preview"
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
        </Modal.Body>
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
      {isGeneratingCV && (
        <LoadingModalOverlay>
          <LoadingModalContent>
            <LoadingSpinner />
            <LoadingTitle>Generating Your Optimized CV</LoadingTitle>
            <LoadingMessage key={loadingMessageIndex}>
              {loadingMessages[loadingMessageIndex]}
            </LoadingMessage>
          </LoadingModalContent>
        </LoadingModalOverlay>
      )}

      {/* Pro Upgrade Loading Modal */}
      {isUpgrading && (
        <LoadingModalOverlay>
          <LoadingModalContent>
            <LoadingSpinner />
            <LoadingTitle>Upgrading to Pro</LoadingTitle>
            <LoadingMessage key={loadingMessageIndex}>
              {loadingMessages[loadingMessageIndex]}
            </LoadingMessage>
          </LoadingModalContent>
        </LoadingModalOverlay>
      )}

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
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
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
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
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
              <div style={{ fontSize: '14px', fontWeight: 600, marginBottom: '12px', color: '#667eea' }}>
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
                  <div style={{ color: '#10b981', flexShrink: 0 }}>
                    <CheckCircleIcon />
                  </div>
                  <span>6 professional templates to choose from</span>
                </li>
                <li style={{ marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ color: '#10b981', flexShrink: 0 }}>
                    <CheckCircleIcon />
                  </div>
                  <span>Multiple tones (Professional, Friendly, Formal)</span>
                </li>
                <li style={{ marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ color: '#10b981', flexShrink: 0 }}>
                    <CheckCircleIcon />
                  </div>
                  <span>Customizable length and language (EN/TR)</span>
                </li>
                <li style={{ marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ color: '#10b981', flexShrink: 0 }}>
                    <CheckCircleIcon />
                  </div>
                  <span>Interactive editor with alternative phrasings</span>
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ color: '#10b981', flexShrink: 0 }}>
                    <CheckCircleIcon />
                  </div>
                  <span>Tailored to your CV and job posting</span>
                </li>
              </ul>
            </div>

            <Button
              size="lg"
              onClick={userCredits.canAnalyze ? handleUpgradeToPro : () => setIsBuyCreditsModalOpen(true)}
              isLoading={isUpgrading}
              style={{
                width: '100%',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
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
              Your investment in yourself will pay off. Every optimized CV brings you closer to your dream job.
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

      {/* Cover Letter Generator Modal */}
      <CoverLetterGenerator
        isOpen={isCoverLetterModalOpen}
        onClose={() => setIsCoverLetterModalOpen(false)}
        reportId={reportId}
      />
    </Container>
  );
}
