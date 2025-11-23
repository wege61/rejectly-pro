"use client";

import { useState, useEffect, useCallback } from "react";
import styled from "styled-components";
import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/Spinner";
import { useToast } from "@/contexts/ToastContext";
import { ApplicationModal } from "./ApplicationModal";

const KanbanContainer = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.lg};
  overflow-x: auto;
  padding: ${({ theme }) => theme.spacing.lg} 0;
  min-height: 600px;
`;

const Column = styled.div`
  flex: 1;
  min-width: 320px;
  display: flex;
  flex-direction: column;
  background: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.radius.lg};
  padding: ${({ theme }) => theme.spacing.md};
`;

const ColumnHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
`;

const ColumnTitle = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const ColumnCount = styled.div`
  background: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.textSecondary};
  padding: 4px 12px;
  border-radius: ${({ theme }) => theme.radius.full};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
`;

const CardsContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const ApplicationCard = styled.div<{ $isDragging?: boolean }>`
  background: ${({ theme }) => theme.colors.background};
  border: 2px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.md};
  padding: ${({ theme }) => theme.spacing.md};
  cursor: grab;
  transition: all ${({ theme }) => theme.transitions.fast};
  opacity: ${({ $isDragging }) => ($isDragging ? 0.5 : 1)};

  &:hover {
    border-color: var(--accent);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    transform: translateY(-2px);
  }

  &:active {
    cursor: grabbing;
  }
`;

const CardCompany = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.textPrimary};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

const CardPosition = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const CardMeta = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.xs};
  margin-top: ${({ theme }) => theme.spacing.sm};
`;

const MetaTag = styled.div<{ $variant?: "default" | "success" | "warning" | "danger" }>`
  padding: 4px 8px;
  border-radius: ${({ theme }) => theme.radius.sm};
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  background: ${({ $variant }) => {
    switch ($variant) {
      case "success":
        return "var(--success-light)";
      case "warning":
        return "rgba(245, 158, 11, 0.1)";
      case "danger":
        return "rgba(239, 68, 68, 0.1)";
      default:
        return "rgba(107, 114, 128, 0.1)";
    }
  }};
  color: ${({ $variant, theme }) => {
    switch ($variant) {
      case "success":
        return "var(--success)";
      case "warning":
        return "#f59e0b";
      case "danger":
        return "#ef4444";
      default:
        return theme.colors.textSecondary;
    }
  }};
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing["3xl"]};
  color: ${({ theme }) => theme.colors.textSecondary};
  text-align: center;
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
`;

const HeaderActions = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const LoadingContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing["3xl"]};
`;

interface Application {
  id: string;
  company_name: string;
  position_title: string;
  status: string;
  applied_date?: string;
  deadline_date?: string;
  interview_date?: string;
  salary_range?: string;
  location?: string;
  notes?: string;
  report?: {
    id: string;
    fit_score: number;
    optimized_score?: number;
  };
}

const COLUMNS = [
  { id: "applied", title: "Applied", icon: "📝" },
  { id: "screening", title: "Screening", icon: "🔍" },
  { id: "interview", title: "Interview", icon: "💼" },
  { id: "offer", title: "Offer", icon: "🎉" },
  { id: "rejected", title: "Rejected", icon: "❌" },
  { id: "withdrawn", title: "Withdrawn", icon: "🚫" },
];

export function ApplicationsKanban() {
  const toast = useToast();
  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [draggedItem, setDraggedItem] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);

  const fetchApplications = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/applications");
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch applications");
      }

      setApplications(data.applications || []);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  const handleDragStart = (e: React.DragEvent, applicationId: string) => {
    setDraggedItem(applicationId);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = async (e: React.DragEvent, newStatus: string) => {
    e.preventDefault();

    if (!draggedItem) return;

    const application = applications.find((app) => app.id === draggedItem);
    if (!application || application.status === newStatus) {
      setDraggedItem(null);
      return;
    }

    // Optimistic update
    setApplications((prev) =>
      prev.map((app) =>
        app.id === draggedItem ? { ...app, status: newStatus } : app
      )
    );

    try {
      const response = await fetch(`/api/applications/${draggedItem}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to update application");
      }

      toast.success(`Moved to ${COLUMNS.find((c) => c.id === newStatus)?.title}`);
    } catch (error) {
      // Revert on error
      setApplications((prev) =>
        prev.map((app) =>
          app.id === draggedItem ? { ...app, status: application.status } : app
        )
      );
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      toast.error(errorMessage);
    } finally {
      setDraggedItem(null);
    }
  };

  const getApplicationsByStatus = (status: string) => {
    return applications.filter((app) => app.status === status);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return null;
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  const getDeadlineVariant = (
    deadlineDate?: string
  ): "default" | "success" | "warning" | "danger" => {
    if (!deadlineDate) return "default";
    const deadline = new Date(deadlineDate);
    const today = new Date();
    const daysUntil = Math.ceil(
      (deadline.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (daysUntil < 0) return "danger";
    if (daysUntil <= 3) return "warning";
    return "success";
  };

  const handleAddApplication = () => {
    setSelectedApplication(null);
    setIsModalOpen(true);
  };

  const handleEditApplication = (application: Application) => {
    setSelectedApplication(application);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedApplication(null);
  };

  const handleModalSuccess = () => {
    fetchApplications();
  };

  if (isLoading) {
    return (
      <LoadingContainer>
        <Spinner size="xl" />
      </LoadingContainer>
    );
  }

  return (
    <>
      <HeaderActions>
        <Button onClick={handleAddApplication}>
          + Add Application
        </Button>
        <Button variant="ghost" onClick={fetchApplications}>
          🔄 Refresh
        </Button>
      </HeaderActions>

      <KanbanContainer>
        {COLUMNS.map((column) => {
          const columnApps = getApplicationsByStatus(column.id);
          return (
            <Column
              key={column.id}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, column.id)}
            >
              <ColumnHeader>
                <ColumnTitle>
                  {column.icon} {column.title}
                </ColumnTitle>
                <ColumnCount>{columnApps.length}</ColumnCount>
              </ColumnHeader>

              <CardsContainer>
                {columnApps.length === 0 ? (
                  <EmptyState>
                    <div style={{ fontSize: "32px", marginBottom: "8px" }}>
                      {column.icon}
                    </div>
                    <div>No applications yet</div>
                  </EmptyState>
                ) : (
                  columnApps.map((app) => (
                    <ApplicationCard
                      key={app.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, app.id)}
                      onDragEnd={handleDragEnd}
                      $isDragging={draggedItem === app.id}
                      onClick={() => handleEditApplication(app)}
                    >
                      <CardCompany>{app.company_name}</CardCompany>
                      <CardPosition>{app.position_title}</CardPosition>

                      <CardMeta>
                        {app.location && (
                          <MetaTag>📍 {app.location}</MetaTag>
                        )}
                        {app.salary_range && (
                          <MetaTag>💰 {app.salary_range}</MetaTag>
                        )}
                        {app.applied_date && (
                          <MetaTag>
                            Applied {formatDate(app.applied_date)}
                          </MetaTag>
                        )}
                        {app.deadline_date && (
                          <MetaTag $variant={getDeadlineVariant(app.deadline_date)}>
                            Deadline {formatDate(app.deadline_date)}
                          </MetaTag>
                        )}
                        {app.report && (
                          <MetaTag $variant="success">
                            {app.report.optimized_score || app.report.fit_score}% Match
                          </MetaTag>
                        )}
                      </CardMeta>
                    </ApplicationCard>
                  ))
                )}
              </CardsContainer>
            </Column>
          );
        })}
      </KanbanContainer>

      <ApplicationModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onSuccess={handleModalSuccess}
        applicationId={selectedApplication?.id}
        initialData={selectedApplication || undefined}
      />
    </>
  );
}
