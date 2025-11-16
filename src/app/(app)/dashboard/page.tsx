"use client";

import styled, { keyframes, css } from "styled-components";
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";
import { DashboardSkeleton } from "@/components/skeletons/DashboardSkeleton";
import { WelcomeModal } from "@/components/ui/WelcomeModal";
import { ROUTES } from "@/lib/constants";
import { useAuth } from "@/hooks/useAuth";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

// Icons
const ReportsIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={2}
    stroke="currentColor"
    style={{ width: '32px', height: '32px' }}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
    />
  </svg>
);

const CVIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={2}
    stroke="currentColor"
    style={{ width: '32px', height: '32px' }}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
    />
  </svg>
);

const JobsIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={2}
    stroke="currentColor"
    style={{ width: '32px', height: '32px' }}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0M12 12.75h.008v.008H12v-.008z"
    />
  </svg>
);

const CoverLettersIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={2}
    stroke="currentColor"
    style={{ width: '32px', height: '32px' }}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
    />
  </svg>
);

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: ${({ theme }) => theme.spacing["2xl"]};
  padding-bottom: 100px; /* Space for FAB */

  
  @media (max-width: 450px) {
    padding: ${({ theme }) => theme.spacing["lg"]};
    padding-top: 52px;
  }
`;

const Header = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing["2xl"]};
`;

const Title = styled.h1`
  font-size: ${({ theme }) => theme.typography.fontSize["3xl"]};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const Subtitle = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const Grid = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.spacing.lg};
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  margin-bottom: ${({ theme }) => theme.spacing["2xl"]};

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: ${({ theme }) => theme.spacing.sm};
    margin-bottom: ${({ theme }) => theme.spacing.lg};
  }
`;

const StatCard = styled(Card)`
  text-align: center;
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.normal};

  &:hover {
    transform: translateY(-4px);
    box-shadow: ${({ theme }) => theme.shadow.lg};
  }

  &:active {
    transform: translateY(-2px);
  }

  @media (max-width: 768px) {
    padding: ${({ theme }) => theme.spacing.md} !important;
  }
`;

const StatIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: ${({ theme }) => theme.spacing.md};
  color: ${({ theme }) => theme.colors.primary};

  svg {
    width: 32px;
    height: 32px;
  }

  @media (max-width: 768px) {
    margin-bottom: ${({ theme }) => theme.spacing.xs};

    svg {
      width: 20px;
      height: 20px;
    }
  }
`;

const StatValue = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize["4xl"]};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: ${({ theme }) => theme.spacing.sm};

  @media (max-width: 768px) {
    font-size: ${({ theme }) => theme.typography.fontSize["2xl"]};
    margin-bottom: 2px;
  }
`;

const StatLabel = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.textSecondary};

  @media (max-width: 768px) {
    font-size: ${({ theme }) => theme.typography.fontSize.xs};
  }
`;

const Section = styled.section`
  margin-bottom: ${({ theme }) => theme.spacing["2xl"]};
`;

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const SectionTitle = styled.h2`
  font-size: ${({ theme }) => theme.typography.fontSize.xl};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
`;

const QuickActionsGrid = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.spacing.lg};
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
`;

const ActionCard = styled(Card)`
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.normal};

  &:hover {
    transform: translateY(-4px);
    box-shadow: ${({ theme }) => theme.shadow.lg};
  }
`;

const ReportsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
`;

const ReportCard = styled(Card)`
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.normal};

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${({ theme }) => theme.shadow.lg};
  }
`;

const FakeItBanner = styled.div`
  position: absolute;
  top: -10px;
  right: 12px;
  background: linear-gradient(135deg, #f59e0b 0%, #ea580c 100%);
  color: white;
  padding: 6px 16px;
  font-size: 10px;
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 0.8px;
  box-shadow: 0 4px 12px rgba(245, 158, 11, 0.4);
  border-radius: 6px 6px 0 0;
  z-index: 10;
  display: flex;
  align-items: center;
  gap: 4px;

  &::before {
    content: '🚀';
  }
`;

const ReportCardWithFakeIt = styled(ReportCard)<{ $fakeItMode?: boolean }>`
  ${({ $fakeItMode }) =>
    $fakeItMode &&
    `
    position: relative;
    border: 2px solid rgba(245, 158, 11, 0.3);
    margin-top: 12px;
    overflow: visible;

    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 3px;
      background: linear-gradient(90deg, #f59e0b 0%, #ea580c 100%);
    }

    &:hover {
      border-color: rgba(245, 158, 11, 0.5);
      box-shadow: 0 8px 24px rgba(245, 158, 11, 0.15);
    }
  `}
`;

const ReportHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: start;
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const ReportTitle = styled.h3`
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.textPrimary};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

const ReportDate = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const ScoreBadge = styled(Badge)`
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  padding: ${({ theme }) => `${theme.spacing.xs} ${theme.spacing.md}`};
`;

const ReportMeta = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
  flex-wrap: wrap;
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const ReportSummary = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
  line-height: ${({ theme }) => theme.typography.lineHeight.relaxed};
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const ViewAllLink = styled.div`
  display: flex;
  justify-content: center;
  margin-top: ${({ theme }) => theme.spacing.lg};

  button {
    transition: all ${({ theme }) => theme.transitions.normal};

    &:hover {
      transform: translateY(-2px);
    }
  }
`;

const CoverLetterCard = styled(Card)<{ $tone: string }>`
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.normal};
  border-left: 4px solid ${({ $tone }) => {
    switch ($tone) {
      case 'professional':
        return '#3b82f6';
      case 'friendly':
        return '#10b981';
      case 'formal':
        return '#8b5cf6';
      default:
        return '#6b7280';
    }
  }};

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${({ theme }) => theme.shadow.md};
  }
`;

const CoverLetterTitle = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.textPrimary};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const CoverLetterMeta = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
`;

// Floating Action Button (FAB)
const FAB = styled.button<{ $showHint?: boolean }>`
  position: fixed;
  bottom: ${({ theme }) => theme.spacing["2xl"]};
  right: ${({ theme }) => theme.spacing["2xl"]};
  width: 64px;
  height: 64px;
  border-radius: ${({ theme }) => theme.radius.full};
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8px 24px rgba(102, 126, 234, 0.4);
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.normal};
  z-index: 10010;
  border: none;

  ${({ $showHint }) => $showHint && css`
    box-shadow:
      0 8px 24px rgba(102, 126, 234, 0.4),
      0 0 0 4px rgba(255, 255, 255, 0.3);
  `}

  &:hover {
    transform: scale(1.1) translateY(-2px);
    box-shadow: 0 12px 32px rgba(102, 126, 234, 0.5);
  }

  &:active {
    transform: scale(0.95);
  }

  svg {
    width: 28px;
    height: 28px;
  }
`;

const slideIn = keyframes`
  from {
    opacity: 0;
    transform: translateX(10px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`;

const FABTooltip = styled.div<{ $autoShow?: boolean }>`
  position: absolute;
  right: 80px;
  background: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.textPrimary};
  padding: ${({ theme }) => `${theme.spacing.md} ${theme.spacing.lg}`};
  border-radius: ${({ theme }) => theme.radius.md};
  white-space: nowrap;
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  box-shadow: ${({ theme }) => theme.shadow.xl};
  opacity: ${({ $autoShow }) => ($autoShow ? 1 : 0)};
  pointer-events: none;
  transition: opacity ${({ theme }) => theme.transitions.fast};
  z-index: 10001;

  ${({ $autoShow }) => $autoShow && css`
    animation: ${slideIn} 0.5s ease-out;
  `}

  ${FAB}:hover & {
    opacity: 1;
  }

  &::after {
    content: "";
    position: absolute;
    right: -6px;
    top: 50%;
    transform: translateY(-50%);
    width: 0;
    height: 0;
    border-left: 6px solid ${({ theme }) => theme.colors.surface};
    border-top: 6px solid transparent;
    border-bottom: 6px solid transparent;
  }
`;

const SpotlightOverlay = styled.div<{ $show: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(15, 23, 42, 0.85);
  z-index: 10000;
  pointer-events: ${({ $show }) => ($show ? 'auto' : 'none')};
  opacity: ${({ $show }) => ($show ? 1 : 0)};
  transition: opacity 0.5s ease;
  backdrop-filter: blur(4px);
`;

const SpotlightCircle = styled.div`
  position: fixed;
  bottom: calc(${({ theme }) => theme.spacing["2xl"]} - 38px);
  right: calc(${({ theme }) => theme.spacing["2xl"]} - 38px);
  width: 140px;
  height: 140px;
  border-radius: 50%;
  pointer-events: none;
  z-index: 9999;
  background: radial-gradient(
    circle,
    rgba(255, 255, 255, 0.95) 0%,
    rgba(255, 255, 255, 0.85) 40%,
    transparent 70%
  );
  box-shadow:
    0 0 0 9999px rgba(15, 23, 42, 0.85),
    0 0 80px 20px rgba(102, 126, 234, 0.5);

  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 160%;
    height: 160%;
    border-radius: 50%;
    border: 3px solid rgba(102, 126, 234, 0.6);
  }
`;

const fadeInDown = keyframes`
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const HintContainer = styled.div`
  position: fixed;
  bottom: calc(${({ theme }) => theme.spacing["2xl"]} + 140px);
  right: ${({ theme }) => theme.spacing["2xl"]};
  z-index: 10002;
  pointer-events: none;
  max-width: 320px;
  text-align: right;
  ${css`
    animation: ${fadeInDown} 0.6s ease-out 0.3s both;
  `}
`;

const HintText = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize["3xl"]};
  font-weight: ${({ theme }) => theme.typography.fontWeight.extrabold};
  color: #ffffff;
  margin-bottom: ${({ theme }) => theme.spacing.sm};
  line-height: ${({ theme }) => theme.typography.lineHeight.tight};
  text-shadow:
    0 2px 4px rgba(0, 0, 0, 0.3),
    0 4px 12px rgba(102, 126, 234, 0.4);
  letter-spacing: -0.02em;
`;

const HintSubtext = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  color: rgba(255, 255, 255, 0.95);
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
  line-height: ${({ theme }) => theme.typography.lineHeight.relaxed};
`;

const ArrowContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => `${theme.spacing.sm} ${theme.spacing.lg}`};
  background: rgba(102, 126, 234, 0.15);
  border-radius: ${({ theme }) => theme.radius.full};
  border: 2px solid rgba(102, 126, 234, 0.4);
  backdrop-filter: blur(8px);
`;

const ArrowText = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSize.xl};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: #ffffff;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
`;

const ArrowIcon = styled.div`
  color: #ffffff;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));

  svg {
    width: 28px;
    height: 28px;
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

const DownArrowIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={3}
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M19.5 13.5L12 21m0 0l-7.5-7.5M12 21V3"
    />
  </svg>
);

interface Stats {
  totalReports: number;
  totalCVs: number;
  totalJobs: number;
  totalCoverLetters: number;
}

interface Report {
  id: string;
  created_at: string;
  fit_score: number;
  summary_free: string;
  pro: boolean;
  job_ids: string[];
  keywords: {
    missing?: string[];
  } | null;
  fake_it_mode: boolean | null;
}

interface CoverLetter {
  id: string;
  created_at: string;
  tone: string;
  job?: {
    id: string;
    title: string;
  };
}

export default function DashboardPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState<Stats>({
    totalReports: 0,
    totalCVs: 0,
    totalJobs: 0,
    totalCoverLetters: 0,
  });
  const [recentReports, setRecentReports] = useState<Report[]>([]);
  const [recentCoverLetters, setRecentCoverLetters] = useState<CoverLetter[]>([]);
  const [jobTitlesMap, setJobTitlesMap] = useState<Record<string, string>>({});
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);
  const [showFABHint, setShowFABHint] = useState(false);
  const [fabHintCompleted, setFabHintCompleted] = useState(false);

  // Check if user has seen welcome modal and FAB hint
  useEffect(() => {
    async function checkOnboardingStatus() {
      if (!user) return;

      try {
        const supabase = createClient();
        const { data: profile } = await supabase
          .from("profiles")
          .select("has_seen_welcome_modal, fab_hint_completed")
          .eq("id", user.id)
          .single();

        if (profile) {
          setFabHintCompleted(profile.fab_hint_completed || false);

          if (!profile.has_seen_welcome_modal) {
            // Show welcome modal after a short delay for better UX
            setTimeout(() => {
              setShowWelcomeModal(true);
            }, 500);
          } else if (!profile.fab_hint_completed) {
            // If welcome modal was seen but FAB hint not completed, show hint
            setTimeout(() => {
              setShowFABHint(true);
            }, 1000);
          }
        }
      } catch (error) {
        console.error("Error checking onboarding status:", error);
      }
    }

    checkOnboardingStatus();
  }, [user]);

  const handleWelcomeComplete = async () => {
    if (!user) return;

    try {
      const supabase = createClient();
      await supabase
        .from("profiles")
        .update({ has_seen_welcome_modal: true })
        .eq("id", user.id);

      setShowWelcomeModal(false);

      // Show FAB hint after welcome modal is completed
      if (!fabHintCompleted) {
        setTimeout(() => {
          setShowFABHint(true);
        }, 1000);
      }
    } catch (error) {
      console.error("Error updating welcome modal status:", error);
      setShowWelcomeModal(false);
    }
  };

  const handleFABClick = async () => {
    // Mark FAB hint as completed when user clicks FAB
    if (showFABHint && !fabHintCompleted && user) {
      try {
        const supabase = createClient();
        await supabase
          .from("profiles")
          .update({ fab_hint_completed: true })
          .eq("id", user.id);

        setShowFABHint(false);
        setFabHintCompleted(true);
      } catch (error) {
        console.error("Error updating FAB hint status:", error);
      }
    }

    // Navigate to analyze page
    router.push(ROUTES.APP.ANALYZE);
  };

  const handleDismissFABHint = async () => {
    if (!user) return;

    try {
      const supabase = createClient();
      await supabase
        .from("profiles")
        .update({ fab_hint_completed: true })
        .eq("id", user.id);

      setShowFABHint(false);
      setFabHintCompleted(true);
    } catch (error) {
      console.error("Error dismissing FAB hint:", error);
      setShowFABHint(false);
    }
  };

  useEffect(() => {
    async function fetchDashboardData() {
      if (!user) return;

      try {
        const supabase = createClient();

        // Fetch stats
        const [reportsRes, cvsRes, jobsRes, coverLettersRes] = await Promise.all([
          supabase
            .from("reports")
            .select("id", { count: "exact", head: true })
            .eq("user_id", user.id),
          supabase
            .from("documents")
            .select("id", { count: "exact", head: true })
            .eq("user_id", user.id)
            .eq("type", "cv"),
          supabase
            .from("documents")
            .select("id", { count: "exact", head: true })
            .eq("user_id", user.id)
            .eq("type", "job"),
          supabase
            .from("cover_letters")
            .select("id", { count: "exact", head: true })
            .eq("user_id", user.id),
        ]);

        setStats({
          totalReports: reportsRes.count || 0,
          totalCVs: cvsRes.count || 0,
          totalJobs: jobsRes.count || 0,
          totalCoverLetters: coverLettersRes.count || 0,
        });

        // Fetch recent data
        const [reportsData, coverLettersData] = await Promise.all([
          supabase
            .from("reports")
            .select("*")
            .eq("user_id", user.id)
            .order("created_at", { ascending: false })
            .limit(2),
          supabase
            .from("cover_letters")
            .select(`
              *,
              job:documents!job_id(id, title)
            `)
            .eq("user_id", user.id)
            .order("created_at", { ascending: false })
            .limit(3),
        ]);

        if (reportsData.data) {
          setRecentReports(reportsData.data);

          // Collect all unique job IDs from reports
          const allJobIds = new Set<string>();
          reportsData.data.forEach((report) => {
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

        if (coverLettersData.data) {
          setRecentCoverLetters(coverLettersData.data);
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchDashboardData();
  }, [user]);

  const getScoreColor = (score: number): "success" | "warning" | "error" => {
    if (score >= 75) return "success";
    if (score >= 50) return "warning";
    return "error";
  };

  const getToneIcon = (tone: string) => {
    const icons: Record<string, string> = {
      professional: "💼",
      friendly: "😊",
      formal: "🎩",
    };
    return icons[tone] || "✉️";
  };


  if (isLoading) {
    return <DashboardSkeleton />;
  }

  return (
    <>
      <WelcomeModal
        isOpen={showWelcomeModal}
        onClose={() => setShowWelcomeModal(false)}
        onComplete={handleWelcomeComplete}
      />

      <Container>
        <Header>
          <Title>Dashboard</Title>
          <Subtitle>
            Welcome back, {user?.user_metadata?.name || "User"}! Here&apos;s
            your overview.
          </Subtitle>
        </Header>

        {/* Stats */}
        <Grid>
          <StatCard variant="elevated" onClick={() => router.push(ROUTES.APP.REPORTS)}>
            <StatIcon>
              <ReportsIcon />
            </StatIcon>
            <StatValue>{stats.totalReports}</StatValue>
            <StatLabel>Total Reports</StatLabel>
          </StatCard>
          <StatCard variant="elevated" onClick={() => router.push(ROUTES.APP.CV)}>
            <StatIcon>
              <CVIcon />
            </StatIcon>
            <StatValue>{stats.totalCVs}</StatValue>
            <StatLabel>Resumes Uploaded</StatLabel>
          </StatCard>
          <StatCard variant="elevated" onClick={() => router.push(ROUTES.APP.JOBS)}>
            <StatIcon>
              <JobsIcon />
            </StatIcon>
            <StatValue>{stats.totalJobs}</StatValue>
            <StatLabel>Job Postings</StatLabel>
          </StatCard>
          <StatCard variant="elevated" onClick={() => router.push(ROUTES.APP.COVER_LETTERS)}>
            <StatIcon>
              <CoverLettersIcon />
            </StatIcon>
            <StatValue>{stats.totalCoverLetters}</StatValue>
            <StatLabel>Cover Letters</StatLabel>
          </StatCard>
        </Grid>

        {/* Quick Actions */}
        <Section>
          <SectionHeader>
            <SectionTitle>Quick Actions</SectionTitle>
          </SectionHeader>
          <QuickActionsGrid>
            <ActionCard
              variant="elevated"
              onClick={() => router.push(ROUTES.APP.CV)}
            >
              <Card.Header>
                <Card.Title>Upload Resume</Card.Title>
                <Card.Description>
                  Add a new resume to analyze against job postings
                </Card.Description>
              </Card.Header>
            </ActionCard>
            <ActionCard
              variant="elevated"
              onClick={() => router.push(ROUTES.APP.JOBS)}
            >
              <Card.Header>
                <Card.Title>Add Job Posting</Card.Title>
                <Card.Description>
                  Save job postings to compare with your resume
                </Card.Description>
              </Card.Header>
            </ActionCard>
            <ActionCard
              variant="elevated"
              onClick={() => router.push(ROUTES.APP.COVER_LETTERS)}
            >
              <Card.Header>
                <Card.Title>✉️ Generate Cover Letter</Card.Title>
                <Card.Description>
                  Create AI-powered cover letters for your applications
                </Card.Description>
              </Card.Header>
            </ActionCard>
          </QuickActionsGrid>
        </Section>

        {/* Recent Cover Letters */}
        {recentCoverLetters.length > 0 && (
          <Section>
            <SectionHeader>
              <SectionTitle>Recent Cover Letters</SectionTitle>
            </SectionHeader>
            <ReportsList>
              {recentCoverLetters.map((letter) => (
                <CoverLetterCard
                  key={letter.id}
                  variant="elevated"
                  $tone={letter.tone}
                  onClick={() => router.push(ROUTES.APP.COVER_LETTERS)}
                >
                  <CoverLetterTitle>
                    {getToneIcon(letter.tone)} {letter.job?.title || "Cover Letter"}
                  </CoverLetterTitle>
                  <CoverLetterMeta>
                    Created on {new Date(letter.created_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </CoverLetterMeta>
                </CoverLetterCard>
              ))}
            </ReportsList>
            <ViewAllLink>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => router.push(ROUTES.APP.COVER_LETTERS)}
              >
                View All Cover Letters →
              </Button>
            </ViewAllLink>
          </Section>
        )}

        {/* Recent Reports */}
        <Section>
          <SectionHeader>
            <SectionTitle>Recent Reports</SectionTitle>
          </SectionHeader>

          {recentReports.length === 0 ? (
            <Card variant="bordered">
              <EmptyState
                icon={<EmptyState.DocumentIcon />}
                title="No reports yet"
                description="Create your first analysis to see results here."
                action={{
                  label: "Create Analysis",
                  onClick: () => router.push(ROUTES.APP.ANALYZE),
                }}
              />
            </Card>
          ) : (
            <>
              <ReportsList>
                {recentReports.map((report) => (
                  <ReportCardWithFakeIt
                    key={report.id}
                    variant="elevated"
                    onClick={() =>
                      router.push(ROUTES.APP.REPORT_DETAIL(report.id))
                    }
                    $fakeItMode={report.fake_it_mode ?? false}
                  >
                    {report.fake_it_mode && (
                      <FakeItBanner>
                        Fake It Mode
                      </FakeItBanner>
                    )}
                    <ReportHeader>
                      <div>
                        <ReportTitle>Resume Analysis Report</ReportTitle>
                        <ReportDate>
                          Created on{" "}
                          {new Date(report.created_at).toLocaleDateString(
                            "en-EN",
                            {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            }
                          )}
                        </ReportDate>
                        {report.job_ids && report.job_ids.length > 0 && (
                          <div style={{ marginTop: "4px", fontSize: "13px" }}>
                            <span style={{ color: "#6b7280", fontWeight: "500" }}>
                              Job{report.job_ids.length > 1 ? "s" : ""}:{" "}
                            </span>
                            <span style={{ color: "#6b7280", fontWeight: "600" }}>
                              {report.job_ids
                                .map((id: string) => jobTitlesMap[id] || "Unknown")
                                .join(" • ")}
                            </span>
                          </div>
                        )}
                      </div>
                      <ScoreBadge variant={getScoreColor(report.fit_score)}>
                        {report.fit_score}% Match
                      </ScoreBadge>
                    </ReportHeader>
                    <ReportMeta>
                      <Badge size="sm">
                        {report.keywords?.missing?.length || 0} Missing Keywords
                      </Badge>
                      <Badge variant={report.pro ? "info" : "default"} size="sm">
                        {report.pro ? "Pro Report" : "Free Report"}
                      </Badge>
                    </ReportMeta>
                    <ReportSummary>{report.summary_free}</ReportSummary>
                  </ReportCardWithFakeIt>
                ))}
              </ReportsList>
              <ViewAllLink>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => router.push(ROUTES.APP.REPORTS)}
                >
                  View All Reports {'\u2192'}
                </Button>
              </ViewAllLink>
            </>
          )}
        </Section>
      </Container>

      {/* Floating Action Button with Spotlight */}
      {showFABHint && (
        <>
          <SpotlightOverlay $show={showFABHint} onClick={handleDismissFABHint} />
          <SpotlightCircle />
          <HintContainer>
            <HintText>Ready to Get Started?</HintText>
            <HintSubtext>
              Create your first AI-powered resume analysis
            </HintSubtext>
            <ArrowContainer>
              <ArrowText>Click here</ArrowText>
              <ArrowIcon>
                <DownArrowIcon />
              </ArrowIcon>
            </ArrowContainer>
          </HintContainer>
        </>
      )}

      <FAB onClick={handleFABClick} $showHint={showFABHint}>
        <FABTooltip $autoShow={showFABHint}>
          New Analysis
        </FABTooltip>
        <PlusIcon />
      </FAB>
    </>
  );
}
