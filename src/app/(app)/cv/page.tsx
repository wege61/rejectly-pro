"use client";

import styled from "styled-components";
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";
import { EmptyState } from "@/components/ui/EmptyState";
import { useToast } from "@/contexts/ToastContext";
import { Spinner } from "@/components/ui/Spinner";
import { CVListSkeleton } from "@/components/skeletons/CVListSkeleton";
import { useAuth } from "@/hooks/useAuth";
import { createClient } from "@/lib/supabase/client";

// Icons
const UploadIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="17 8 12 3 7 8" />
    <line x1="12" y1="3" x2="12" y2="15" />
  </svg>
);

const DownloadIcon = () => (
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
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="7 10 12 15 17 10" />
    <line x1="12" y1="15" x2="12" y2="3" />
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

const FileIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" />
    <polyline points="10 9 9 9 8 9" />
  </svg>
);

interface CVDocument {
  id: string;
  user_id: string;
  type: string;
  title: string;
  text: string;
  file_url: string;
  lang: string;
  created_at: string;
  updated_at: string;
}

interface OptimizedCV {
  id: string;
  user_id: string;
  report_id: string;
  original_cv_id: string | null;
  title: string;
  file_url: string;
  text: string;
  lang: string;
  created_at: string;
  updated_at: string;
  job_title?: string;
  fake_it_mode?: boolean;
}

type CVItem =
  | CVDocument
  | (OptimizedCV & { isOptimized: true; reportId: string });

const PageContainer = styled.div`
  min-height: calc(100vh - 80px);
  background: ${({ theme }) => theme.colors.background};
  display: flex;
  flex-direction: column;
`;

const ContentWrapper = styled.div`
  max-width: 1400px;
  width: 100%;
  margin: 0 auto;
  padding: ${({ theme }) => theme.spacing.xl};

  @media (max-width: 968px) {
    padding: ${({ theme }) => theme.spacing.md};
  }
`;

const Header = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: ${({ theme }) => theme.spacing.lg};

  @media (max-width: 768px) {
    flex-direction: column;
    gap: ${({ theme }) => theme.spacing.md};
  }
`;

const HeaderContent = styled.div`
  flex: 1;
`;

const Title = styled.h1`
  font-size: ${({ theme }) => theme.typography.fontSize["3xl"]};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const Subtitle = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  color: ${({ theme }) => theme.colors.textSecondary};
  line-height: 1.6;
  max-width: 600px;
`;

const CVGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: ${({ theme }) => theme.spacing.lg};
  margin-bottom: ${({ theme }) => theme.spacing.xl};

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: ${({ theme }) => theme.spacing.md};
  }
`;

const CVSection = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const CVSectionHeader = styled.div`
  padding: ${({ theme }) => theme.spacing.md} 0;
  margin-bottom: ${({ theme }) => theme.spacing.md};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  color: ${({ theme }) => theme.colors.textPrimary};
  font-size: ${({ theme }) => theme.typography.fontSize.xl};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
`;

const CVSectionIcon = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSize["2xl"]};
`;

const CVCard = styled.div<{ $isOptimized?: boolean }>`
  padding: ${({ theme }) => theme.spacing.lg};
  border-radius: ${({ theme }) => theme.radius.lg};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};
  border: 2px solid ${({ $isOptimized, theme }) =>
    $isOptimized ? "rgba(34, 197, 94, 0.3)" : theme.colors.border};
  background: ${({ $isOptimized, theme }) =>
    $isOptimized
      ? "linear-gradient(135deg, rgba(34, 197, 94, 0.08) 0%, rgba(16, 185, 129, 0.08) 100%)"
      : theme.colors.surface};
  box-shadow: ${({ theme }) => theme.shadow.sm};
  position: relative;
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: ${({ $isOptimized, theme }) =>
      $isOptimized
        ? "linear-gradient(90deg, #22c55e 0%, #10b981 100%)"
        : `linear-gradient(90deg, ${theme.colors.primary} 0%, ${theme.colors.secondary} 100%)`};
    opacity: 0;
    transition: opacity ${({ theme }) => theme.transitions.fast};
  }

  &:hover {
    transform: translateY(-4px);
    box-shadow: ${({ theme }) => theme.shadow.lg};
    border-color: ${({ $isOptimized, theme }) =>
      $isOptimized ? "#22c55e" : theme.colors.primary};

    &::before {
      opacity: 1;
    }
  }
`;

const CVCardHeader = styled.div`
  display: flex;
  align-items: flex-start;
  gap: ${({ theme }) => theme.spacing.md};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const CVCardIcon = styled.div<{ $isOptimized?: boolean }>`
  width: 48px;
  height: 48px;
  border-radius: ${({ theme }) => theme.radius.md};
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${({ $isOptimized, theme }) =>
    $isOptimized
      ? "linear-gradient(135deg, rgba(34, 197, 94, 0.15) 0%, rgba(16, 185, 129, 0.15) 100%)"
      : `linear-gradient(135deg, ${theme.colors.primaryLight} 0%, rgba(99, 102, 241, 0.1) 100%)`};
  color: ${({ $isOptimized, theme }) =>
    $isOptimized ? "#22c55e" : theme.colors.primary};
  flex-shrink: 0;
`;

const CVCardContent = styled.div`
  flex: 1;
  min-width: 0;
`;

const CVCardTitle = styled.h3`
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.textPrimary};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const CVCardMeta = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.xs};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const CVCardDate = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const CVCardJobInfo = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-top: ${({ theme }) => theme.spacing.xs};
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
  background: rgba(34, 197, 94, 0.1);
  border-radius: ${({ theme }) => theme.radius.sm};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};

  span {
    color: #22c55e;
    font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  }
`;

const CVCardActions = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.xs};
  margin-top: ${({ theme }) => theme.spacing.md};
  padding-top: ${({ theme }) => theme.spacing.md};
  border-top: 1px solid ${({ theme }) => theme.colors.border};
`;

const UploadButton = styled(Button)`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.xs};

  @media (max-width: 768px) {
    width: 100%;
  }
`;

const CVPreviewDrawer = styled.div<{ $isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1000;
  pointer-events: ${({ $isOpen }) => ($isOpen ? "auto" : "none")};
`;

const CVPreviewBackdrop = styled.div<{ $isOpen: boolean }>`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  opacity: ${({ $isOpen }) => ($isOpen ? 1 : 0)};
  transition: opacity 0.3s ease;
`;

const CVPreviewContent = styled.div<{ $isOpen: boolean }>`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  width: 1200px;
  max-width: 95vw;
  background: ${({ theme }) => theme.colors.surface};
  box-shadow: -4px 0 24px rgba(0, 0, 0, 0.12);
  display: flex;
  transform: translateX(${({ $isOpen }) => ($isOpen ? "0" : "100%")});
  transition: transform 0.35s cubic-bezier(0.4, 0, 0.2, 1);

  @media (max-width: 1024px) {
    width: 100vw;
    max-width: 100vw;
  }
`;

const CVPreviewSidebar = styled.div`
  width: 280px;
  border-right: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.background};
  display: flex;
  flex-direction: column;
  overflow: hidden;

  @media (max-width: 1024px) {
    display: none;
  }
`;

const CVPreviewSidebarHeader = styled.div`
  padding: ${({ theme }) => theme.spacing.lg};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.surface};
`;

const CVPreviewSidebarTitle = styled.h3`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.textSecondary};
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const CVPreviewSidebarList = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: ${({ theme }) => theme.spacing.sm};

  /* Custom scrollbar */
  &::-webkit-scrollbar {
    width: 4px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.colors.border};
    border-radius: 2px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: ${({ theme }) => theme.colors.textTertiary};
  }
`;

const CVPreviewSidebarItem = styled.div<{ $active: boolean; $isOptimized?: boolean }>`
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
  border-radius: ${({ theme }) => theme.radius.md};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};
  border: 2px solid ${({ $active, $isOptimized, theme }) =>
    $active
      ? $isOptimized
        ? "#22c55e"
        : theme.colors.primary
      : "transparent"};
  background: ${({ $active, $isOptimized, theme }) =>
    $active
      ? $isOptimized
        ? "rgba(34, 197, 94, 0.12)"
        : theme.colors.primaryLight
      : theme.colors.surface};
  position: relative;

  &::before {
    content: "";
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 3px;
    background: ${({ $active, $isOptimized, theme }) =>
      $active
        ? $isOptimized
          ? "#22c55e"
          : theme.colors.primary
        : "transparent"};
    border-radius: ${({ theme }) => theme.radius.sm} 0 0 ${({ theme }) => theme.radius.sm};
    transition: all ${({ theme }) => theme.transitions.fast};
  }

  &:hover {
    background: ${({ $active, $isOptimized, theme }) =>
      $active
        ? $isOptimized
          ? "rgba(34, 197, 94, 0.12)"
          : theme.colors.primaryLight
        : "rgba(0, 0, 0, 0.03)"};
    transform: translateX(2px);

    &::before {
      background: ${({ $active, $isOptimized, theme }) =>
        $active
          ? $isOptimized
            ? "#22c55e"
            : theme.colors.primary
          : theme.colors.textTertiary};
    }
  }
`;

const CVPreviewSidebarItemTitle = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  color: ${({ theme }) => theme.colors.textPrimary};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const CVPreviewSidebarItemMeta = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.xs};
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const CVPreviewMain = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const CVPreviewHeader = styled.div`
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.lg};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.sm};
  flex-shrink: 0;
  background: ${({ theme }) => theme.colors.surface};

  @media (max-width: 768px) {
    padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  }
`;

const CVPreviewTitle = styled.h2`
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.textPrimary};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  flex: 1;

  @media (max-width: 768px) {
    font-size: ${({ theme }) => theme.typography.fontSize.base};
  }
`;

const CVPreviewTitleWrapper = styled.div`
  flex: 1;
  min-width: 0;
`;

const CVPreviewJobInfo = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  color: ${({ theme }) => theme.colors.textSecondary};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const CVPreviewActions = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.xs};
  flex-shrink: 0;
`;

const CVPreviewNavigation = styled.div`
  display: none;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  padding: ${({ theme }) => theme.spacing.sm};
  background: ${({ theme }) => theme.colors.background};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};

  @media (max-width: 1024px) {
    display: flex;
  }
`;

const CVPreviewNavButton = styled(Button)`
  min-width: 40px;
`;

const CVPreviewNavInfo = styled.div`
  flex: 1;
  text-align: center;
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const ChevronLeftIcon = () => (
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
    <polyline points="15 18 9 12 15 6" />
  </svg>
);

const ChevronRightIcon = () => (
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
    <polyline points="9 18 15 12 9 6" />
  </svg>
);

const CVPreviewBody = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: ${({ theme }) => theme.spacing.lg};
  background: ${({ theme }) => theme.colors.background};

  /* Custom scrollbar */
  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.colors.border};
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: ${({ theme }) => theme.colors.textTertiary};
  }
`;

const PDFContainer = styled.div`
  width: 100%;
  height: 100%;
  min-height: calc(100vh - 140px);
  background: white;
  border-radius: ${({ theme }) => theme.radius.md};
  box-shadow: ${({ theme }) => theme.shadow.md};
  overflow: hidden;

  iframe {
    width: 100%;
    height: 100%;
    border: none;
  }
`;

const CloseIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const EyeIcon = () => (
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

const HiddenInput = styled.input`
  display: none;
`;

export default function CVPage() {
  const [isUploading, setIsUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [allCVs, setAllCVs] = useState<CVItem[]>([]);
  const [previewCV, setPreviewCV] = useState<CVItem | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [cvToDelete, setCvToDelete] = useState<CVItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const toast = useToast();
  const { user } = useAuth();

  // Scroll active CV into view in sidebar
  useEffect(() => {
    if (previewCV) {
      const activeElement = document.getElementById(`sidebar-cv-${previewCV.id}`);
      if (activeElement) {
        activeElement.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }
    }
  }, [previewCV]);

  // Close drawer with ESC key, navigate with arrow keys, and prevent body scroll
  useEffect(() => {
    const handleKeyboard = (e: KeyboardEvent) => {
      if (!previewCV) return;

      if (e.key === "Escape") {
        setPreviewCV(null);
      } else if (e.key === "ArrowUp" || e.key === "ArrowDown") {
        e.preventDefault();
        const currentIndex = allCVs.findIndex((cv) => cv.id === previewCV.id);

        if (e.key === "ArrowUp" && currentIndex > 0) {
          setPreviewCV(allCVs[currentIndex - 1]);
        } else if (e.key === "ArrowDown" && currentIndex < allCVs.length - 1) {
          setPreviewCV(allCVs[currentIndex + 1]);
        }
      }
    };

    if (previewCV) {
      window.addEventListener("keydown", handleKeyboard);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      window.removeEventListener("keydown", handleKeyboard);
      document.body.style.overflow = "unset";
    };
  }, [previewCV, allCVs]);

  // Fetch all CVs (both original and optimized)
  useEffect(() => {
    async function fetchCVs() {
      if (!user) return;

      const supabase = createClient();

      // Fetch original CVs
      const { data: originalCVs } = await supabase
        .from("documents")
        .select("*")
        .eq("user_id", user.id)
        .eq("type", "cv")
        .order("created_at", { ascending: false });

      // Fetch optimized CVs from optimized_cvs table with report info
      const { data: optimizedCVs } = await supabase
        .from("optimized_cvs")
        .select(`
          *,
          reports:report_id (
            job_ids,
            fake_it_mode
          )
        `)
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      // Get job titles from documents for all job_ids
      const allJobIds = (optimizedCVs || [])
        .flatMap((cv: any) => cv.reports?.job_ids || [])
        .filter(Boolean);

      let jobTitlesMap: Record<string, string> = {};
      if (allJobIds.length > 0) {
        const { data: jobDocs } = await supabase
          .from("documents")
          .select("id, title")
          .in("id", allJobIds);

        if (jobDocs) {
          jobTitlesMap = Object.fromEntries(
            jobDocs.map((doc) => [doc.id, doc.title])
          );
        }
      }

      // Combine all lists (only original and optimized with PDFs)
      const combined: CVItem[] = [
        ...(originalCVs || []),
        ...(optimizedCVs || []).map((cv: any) => {
          const jobIds = cv.reports?.job_ids || [];
          const jobTitle = jobIds.map((id: string) => jobTitlesMap[id]).filter(Boolean).join(', ');
          return {
            ...cv,
            isOptimized: true as const,
            reportId: cv.report_id,
            job_title: jobTitle || undefined,
            fake_it_mode: cv.reports?.fake_it_mode || false,
          };
        }),
      ];

      // Sort by created_at desc
      combined.sort((a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );

      setAllCVs(combined);
      setIsLoading(false);
    }

    fetchCVs();
  }, [user]);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/cv/upload", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Upload failed");
      }

      toast.success("CV uploaded successfully!");

      // Refresh CV data
      const supabase = createClient();
      const { data } = await supabase
        .from("documents")
        .select("*")
        .eq("id", result.document.id)
        .single();

      if (data) {
        setAllCVs((prev) => [data, ...prev]);
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Upload failed";
      toast.error(errorMessage);
    } finally {
      setIsUploading(false);
      e.target.value = "";
    }
  };

  const handleUploadClick = () => {
    document.getElementById("cv-upload")?.click();
  };

  const handleDeleteClick = (cv: CVItem, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setCvToDelete(cv);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!cvToDelete) return;

    setIsDeleting(true);
    try {
      const supabase = createClient();
      const isOptimized = "isOptimized" in cvToDelete && cvToDelete.isOptimized;

      // Delete from appropriate table
      const { error } = await supabase
        .from(isOptimized ? "optimized_cvs" : "documents")
        .delete()
        .eq("id", cvToDelete.id);

      if (error) throw error;

      // If optimized CV, also clear generated_cv from reports table
      if (isOptimized && "reportId" in cvToDelete) {
        await supabase
          .from("reports")
          .update({
            generated_cv: null,
            optimized_score: null,
            improvement_breakdown: null
          })
          .eq("id", cvToDelete.reportId);
      }

      toast.success("CV deleted successfully!");
      setAllCVs((prev) => prev.filter((cv) => cv.id !== cvToDelete.id));

      // Close preview if the deleted CV is currently being previewed
      if (previewCV?.id === cvToDelete.id) {
        setPreviewCV(null);
      }

      setDeleteModalOpen(false);
      setCvToDelete(null);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to delete CV";
      toast.error(errorMessage);
    } finally {
      setIsDeleting(false);
    }
  };

  const getPublicUrl = (fileUrl: string): string => {
    // If already a full URL, return as is
    if (fileUrl.startsWith("http://") || fileUrl.startsWith("https://")) {
      return fileUrl;
    }

    // Otherwise, construct Supabase Storage public URL
    const supabase = createClient();
    const { data } = supabase.storage
      .from("cv-files")
      .getPublicUrl(fileUrl);

    return data.publicUrl;
  };

  const handleDownload = async (cv: CVItem) => {
    if (!cv?.file_url) return;

    try {
      const publicUrl = getPublicUrl(cv.file_url);
      const response = await fetch(publicUrl);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;

      let filename: string;

      // For optimized CVs, try to extract name from the CV data for ATS compatibility
      if ("isOptimized" in cv && cv.isOptimized) {
        let extractedName: string | null = null;

        // Try to get name from cv.text (JSON data)
        if (cv.text) {
          try {
            const cvData = JSON.parse(cv.text);
            if (cvData.contact?.name) {
              extractedName = cvData.contact.name;
            }
          } catch (e) {
            console.log("Failed to parse CV text:", e);
          }
        }

        // Fallback: extract name from title (e.g., "John Doe - Optimized CV" -> "John Doe")
        if (!extractedName && cv.title) {
          const titleMatch = cv.title.match(/^(.+?)\s*-\s*Optimized CV$/i);
          if (titleMatch) {
            extractedName = titleMatch[1].trim();
          }
        }

        if (extractedName) {
          filename = extractedName.replace(/\s+/g, "_") + ".pdf";
        } else {
          filename = (cv.title || "cv").replace(/\.pdf.*/i, "").replace(/ - Optimized CV$/i, "") + ".pdf";
        }
      } else {
        // Original CV - use title
        filename = (cv.title || "cv").replace(/\.pdf.*/i, "") + ".pdf";
      }

      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success("CV downloaded!");
    } catch (error) {
      toast.error("Failed to download CV");
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  if (isLoading) {
    return <CVListSkeleton />;
  }

  return (
    <PageContainer>
      <ContentWrapper>
        <Header>
          <HeaderContent>
            <Title>My CVs</Title>
            <Subtitle>
              Upload and manage your resumes. Optimized versions are automatically generated from your job analysis reports.
            </Subtitle>
          </HeaderContent>
          <UploadButton onClick={handleUploadClick} disabled={isUploading}>
            {isUploading ? (
              <>
                <Spinner size="sm" /> Uploading...
              </>
            ) : (
              <>
                <UploadIcon /> Upload New CV
              </>
            )}
          </UploadButton>
          <HiddenInput
            id="cv-upload"
            type="file"
            accept=".pdf,.docx"
            onChange={handleFileSelect}
            disabled={isUploading}
          />
        </Header>

        {allCVs.length === 0 ? (
          <Card variant="bordered">
            <EmptyState
              icon={<EmptyState.DocumentIcon />}
              title="No CVs yet"
              description="Upload your first resume to get started with job matching analysis and AI-powered optimization."
              action={{
                label: isUploading ? "Uploading..." : "Upload Your First CV",
                onClick: handleUploadClick,
              }}
            />
          </Card>
        ) : (
          <>
            {/* Optimized CVs Section */}
            {allCVs.filter((cv) => "isOptimized" in cv && cv.isOptimized).length > 0 && (
              <CVSection>
                <CVSectionHeader>
                  <CVSectionIcon>✨</CVSectionIcon>
                  <span>Optimized CVs</span>
                </CVSectionHeader>
                <CVGrid>
                  {allCVs
                    .filter((cv) => "isOptimized" in cv && cv.isOptimized)
                    .map((cv) => {
                      const optimizedCV = cv as OptimizedCV & { isOptimized: true; reportId: string };
                      return (
                      <CVCard key={cv.id} $isOptimized={true} onClick={() => setPreviewCV(cv)}>
                        <CVCardHeader>
                          <CVCardIcon $isOptimized={true}>
                            <FileIcon />
                          </CVCardIcon>
                          <CVCardContent>
                            <CVCardTitle>{cv.title}</CVCardTitle>
                            <CVCardMeta>
                              <Badge size="sm" variant="success">
                                ✨ Optimized
                              </Badge>
                              {optimizedCV.fake_it_mode && (
                                <Badge size="sm" variant="warning">
                                  🎭 Fake It
                                </Badge>
                              )}
                              <Badge size="sm" variant="info">
                                {cv.lang === "tr" ? "🇹🇷 Turkish" : "🇬🇧 English"}
                              </Badge>
                            </CVCardMeta>
                            <CVCardDate>
                              Generated {formatDate(cv.created_at)}
                            </CVCardDate>
                            {optimizedCV.job_title && (
                              <CVCardJobInfo>
                                For: <span>{optimizedCV.job_title}</span>
                              </CVCardJobInfo>
                            )}
                          </CVCardContent>
                        </CVCardHeader>
                        <CVCardActions>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              setPreviewCV(cv);
                            }}
                            style={{ flex: 1 }}
                          >
                            <EyeIcon /> Preview
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDownload(cv);
                            }}
                          >
                            <DownloadIcon />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => handleDeleteClick(cv, e)}
                          >
                            <DeleteIcon />
                          </Button>
                        </CVCardActions>
                      </CVCard>
                    );
                    })}
                </CVGrid>
              </CVSection>
            )}

            {/* Original CVs Section */}
            {allCVs.filter((cv) => !("isOptimized" in cv) || !cv.isOptimized).length > 0 && (
              <CVSection>
                <CVSectionHeader>
                  <CVSectionIcon>📄</CVSectionIcon>
                  <span>Original CVs</span>
                </CVSectionHeader>
                <CVGrid>
                  {allCVs
                    .filter((cv) => !("isOptimized" in cv) || !cv.isOptimized)
                    .map((cv) => (
                      <CVCard key={cv.id} onClick={() => setPreviewCV(cv)}>
                        <CVCardHeader>
                          <CVCardIcon>
                            <FileIcon />
                          </CVCardIcon>
                          <CVCardContent>
                            <CVCardTitle>{cv.title}</CVCardTitle>
                            <CVCardMeta>
                              <Badge size="sm" variant="default">
                                Original
                              </Badge>
                              <Badge size="sm" variant="info">
                                {cv.lang === "tr" ? "🇹🇷 Turkish" : "🇬🇧 English"}
                              </Badge>
                            </CVCardMeta>
                            <CVCardDate>
                              Uploaded {formatDate(cv.created_at)}
                            </CVCardDate>
                          </CVCardContent>
                        </CVCardHeader>
                        <CVCardActions>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              setPreviewCV(cv);
                            }}
                            style={{ flex: 1 }}
                          >
                            <EyeIcon /> Preview
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDownload(cv);
                            }}
                          >
                            <DownloadIcon />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => handleDeleteClick(cv, e)}
                          >
                            <DeleteIcon />
                          </Button>
                        </CVCardActions>
                      </CVCard>
                    ))}
                </CVGrid>
              </CVSection>
            )}
          </>
        )}
      </ContentWrapper>

      {/* PDF Preview Drawer */}
      <CVPreviewDrawer $isOpen={!!previewCV}>
        <CVPreviewBackdrop
          $isOpen={!!previewCV}
          onClick={() => setPreviewCV(null)}
        />
        <CVPreviewContent $isOpen={!!previewCV}>
          {/* Sidebar with CV list */}
          <CVPreviewSidebar>
            <CVPreviewSidebarHeader>
              <CVPreviewSidebarTitle>All CVs ({allCVs.length})</CVPreviewSidebarTitle>
            </CVPreviewSidebarHeader>
            <CVPreviewSidebarList>
              {allCVs.map((cv) => {
                const isOptimized = "isOptimized" in cv && cv.isOptimized;
                return (
                  <CVPreviewSidebarItem
                    id={`sidebar-cv-${cv.id}`}
                    key={cv.id}
                    $active={previewCV?.id === cv.id}
                    $isOptimized={isOptimized}
                    onClick={() => setPreviewCV(cv)}
                  >
                    <CVPreviewSidebarItemTitle>
                      {cv.title}
                    </CVPreviewSidebarItemTitle>
                    <CVPreviewSidebarItemMeta>
                      {isOptimized ? (
                        <>
                          <span style={{ color: "#22c55e" }}>✨ Optimized</span>
                          {(cv as any).fake_it_mode && (
                            <>
                              <span>•</span>
                              <span style={{ color: "#f59e0b" }}>🎭</span>
                            </>
                          )}
                        </>
                      ) : (
                        <span>📄 Original</span>
                      )}
                      <span>•</span>
                      <span>{cv.lang === "tr" ? "TR" : "EN"}</span>
                    </CVPreviewSidebarItemMeta>
                  </CVPreviewSidebarItem>
                );
              })}
            </CVPreviewSidebarList>
          </CVPreviewSidebar>

          {/* Main preview area */}
          <CVPreviewMain>
            {/* Mobile navigation */}
            <CVPreviewNavigation>
              <CVPreviewNavButton
                variant="ghost"
                size="sm"
                onClick={() => {
                  const currentIndex = allCVs.findIndex((cv) => cv.id === previewCV?.id);
                  if (currentIndex > 0) {
                    setPreviewCV(allCVs[currentIndex - 1]);
                  }
                }}
                disabled={allCVs.findIndex((cv) => cv.id === previewCV?.id) === 0}
              >
                <ChevronLeftIcon />
              </CVPreviewNavButton>
              <CVPreviewNavInfo>
                {allCVs.findIndex((cv) => cv.id === previewCV?.id) + 1} / {allCVs.length}
              </CVPreviewNavInfo>
              <CVPreviewNavButton
                variant="ghost"
                size="sm"
                onClick={() => {
                  const currentIndex = allCVs.findIndex((cv) => cv.id === previewCV?.id);
                  if (currentIndex < allCVs.length - 1) {
                    setPreviewCV(allCVs[currentIndex + 1]);
                  }
                }}
                disabled={allCVs.findIndex((cv) => cv.id === previewCV?.id) === allCVs.length - 1}
              >
                <ChevronRightIcon />
              </CVPreviewNavButton>
            </CVPreviewNavigation>

            <CVPreviewHeader>
              <CVPreviewTitleWrapper>
                <CVPreviewTitle>
                  {previewCV?.title}
                  {"isOptimized" in (previewCV || {}) && (previewCV as any).isOptimized && (
                    <Badge size="sm" variant="success">
                      ✨ Optimized
                    </Badge>
                  )}
                  {"isOptimized" in (previewCV || {}) && (previewCV as any).fake_it_mode && (
                    <Badge size="sm" variant="warning">
                      🎭 Fake It
                    </Badge>
                  )}
                </CVPreviewTitle>
                {"isOptimized" in (previewCV || {}) && (previewCV as any).job_title && (
                  <CVPreviewJobInfo>
                    <span>Created for:</span>
                    <strong style={{ color: '#22c55e' }}>{(previewCV as any).job_title}</strong>
                  </CVPreviewJobInfo>
                )}
              </CVPreviewTitleWrapper>
              <CVPreviewActions>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => previewCV && handleDownload(previewCV)}
                >
                  <DownloadIcon /> Download
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setPreviewCV(null)}
                >
                  <CloseIcon />
                </Button>
              </CVPreviewActions>
            </CVPreviewHeader>
            <CVPreviewBody>
              {previewCV && (
                <PDFContainer>
                  <iframe
                    src={`${getPublicUrl(previewCV.file_url)}#toolbar=0`}
                    title="CV Preview"
                  />
                </PDFContainer>
              )}
            </CVPreviewBody>
          </CVPreviewMain>
        </CVPreviewContent>
      </CVPreviewDrawer>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={() => !isDeleting && setDeleteModalOpen(false)}
        title="Delete CV"
        size="sm"
      >
        <Modal.Body>
          <div style={{ padding: "16px 0" }}>
            <p style={{ marginBottom: "12px", fontSize: "15px", lineHeight: "1.6" }}>
              Are you sure you want to delete <strong>{cvToDelete?.title}</strong>?
              This action cannot be undone.
            </p>
            <p style={{ color: "#dc2626", fontSize: "14px", fontWeight: 500 }}>
              ⚠️ All reports associated with this CV will remain, but the CV file will be permanently removed.
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
              background: "linear-gradient(135deg, #dc2626 0%, #991b1b 100%)",
              border: "none",
            }}
          >
            {isDeleting ? "Deleting..." : "Delete CV"}
          </Button>
        </Modal.Footer>
      </Modal>
    </PageContainer>
  );
}
