"use client";

import { useState, useEffect } from "react";
import styled from "styled-components";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/contexts/ToastContext";

const FormGrid = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.spacing.lg};
  padding: ${({ theme }) => theme.spacing.lg};
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const Label = styled.label`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const Required = styled.span`
  color: #ef4444;
  margin-left: 4px;
`;

const Input = styled.input`
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  border: 2px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.md};
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  color: ${({ theme }) => theme.colors.textPrimary};
  background: ${({ theme }) => theme.colors.background};
  transition: all ${({ theme }) => theme.transitions.fast};

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }

  &::placeholder {
    color: ${({ theme }) => theme.colors.textSecondary};
  }
`;

const Select = styled.select`
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  border: 2px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.md};
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  color: ${({ theme }) => theme.colors.textPrimary};
  background: ${({ theme }) => theme.colors.background};
  transition: all ${({ theme }) => theme.transitions.fast};

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }
`;

const TextArea = styled.textarea`
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  border: 2px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.md};
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  color: ${({ theme }) => theme.colors.textPrimary};
  background: ${({ theme }) => theme.colors.background};
  min-height: 100px;
  resize: vertical;
  font-family: inherit;
  transition: all ${({ theme }) => theme.transitions.fast};

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }

  &::placeholder {
    color: ${({ theme }) => theme.colors.textSecondary};
  }
`;

const TwoColumnGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${({ theme }) => theme.spacing.md};

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const ActionButtons = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
  justify-content: flex-end;
  padding: ${({ theme }) => theme.spacing.lg};
  border-top: 1px solid ${({ theme }) => theme.colors.border};
`;

interface ApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  applicationId?: string;
  initialData?: {
    company_name?: string;
    position_title?: string;
    status?: string;
    applied_date?: string;
    deadline_date?: string;
    interview_date?: string;
    salary_range?: string;
    location?: string;
    notes?: string;
    report_id?: string;
    job_id?: string;
    cv_id?: string;
    cover_letter_id?: string;
  };
}

export function ApplicationModal({
  isOpen,
  onClose,
  onSuccess,
  applicationId,
  initialData,
}: ApplicationModalProps) {
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    company_name: initialData?.company_name || "",
    position_title: initialData?.position_title || "",
    status: initialData?.status || "applied",
    applied_date: initialData?.applied_date || "",
    deadline_date: initialData?.deadline_date || "",
    interview_date: initialData?.interview_date || "",
    salary_range: initialData?.salary_range || "",
    location: initialData?.location || "",
    notes: initialData?.notes || "",
    report_id: initialData?.report_id || "",
    job_id: initialData?.job_id || "",
    cv_id: initialData?.cv_id || "",
    cover_letter_id: initialData?.cover_letter_id || "",
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        company_name: initialData.company_name || "",
        position_title: initialData.position_title || "",
        status: initialData.status || "applied",
        applied_date: initialData.applied_date || "",
        deadline_date: initialData.deadline_date || "",
        interview_date: initialData.interview_date || "",
        salary_range: initialData.salary_range || "",
        location: initialData.location || "",
        notes: initialData.notes || "",
        report_id: initialData.report_id || "",
        job_id: initialData.job_id || "",
        cv_id: initialData.cv_id || "",
        cover_letter_id: initialData.cover_letter_id || "",
      });
    }
  }, [initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.company_name || !formData.position_title) {
      toast.error("Company name and position title are required");
      return;
    }

    setIsLoading(true);

    try {
      const url = applicationId
        ? `/api/applications/${applicationId}`
        : "/api/applications";

      const method = applicationId ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to save application");
      }

      toast.success(
        applicationId
          ? "Application updated successfully!"
          : "Application created successfully!"
      );
      onSuccess?.();
      onClose();
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={applicationId ? "Edit Application" : "Add New Application"}
      description={
        applicationId
          ? "Update the details of your job application"
          : "Track a new job application"
      }
      size="lg"
    >
      <form onSubmit={handleSubmit}>
        <Modal.Body>
          <FormGrid>
            <TwoColumnGrid>
              <FormGroup>
                <Label>
                  Company Name<Required>*</Required>
                </Label>
                <Input
                  type="text"
                  name="company_name"
                  value={formData.company_name}
                  onChange={handleChange}
                  placeholder="e.g., Google"
                  required
                />
              </FormGroup>

              <FormGroup>
                <Label>
                  Position Title<Required>*</Required>
                </Label>
                <Input
                  type="text"
                  name="position_title"
                  value={formData.position_title}
                  onChange={handleChange}
                  placeholder="e.g., Senior Software Engineer"
                  required
                />
              </FormGroup>
            </TwoColumnGrid>

            <TwoColumnGrid>
              <FormGroup>
                <Label>Status</Label>
                <Select name="status" value={formData.status} onChange={handleChange}>
                  <option value="applied">Applied</option>
                  <option value="screening">Screening</option>
                  <option value="interview">Interview</option>
                  <option value="offer">Offer</option>
                  <option value="rejected">Rejected</option>
                  <option value="withdrawn">Withdrawn</option>
                </Select>
              </FormGroup>

              <FormGroup>
                <Label>Location</Label>
                <Input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="e.g., San Francisco, CA"
                />
              </FormGroup>
            </TwoColumnGrid>

            <TwoColumnGrid>
              <FormGroup>
                <Label>Applied Date</Label>
                <Input
                  type="date"
                  name="applied_date"
                  value={formData.applied_date}
                  onChange={handleChange}
                />
              </FormGroup>

              <FormGroup>
                <Label>Deadline Date</Label>
                <Input
                  type="date"
                  name="deadline_date"
                  value={formData.deadline_date}
                  onChange={handleChange}
                />
              </FormGroup>
            </TwoColumnGrid>

            <TwoColumnGrid>
              <FormGroup>
                <Label>Interview Date & Time</Label>
                <Input
                  type="datetime-local"
                  name="interview_date"
                  value={formData.interview_date}
                  onChange={handleChange}
                />
              </FormGroup>

              <FormGroup>
                <Label>Salary Range</Label>
                <Input
                  type="text"
                  name="salary_range"
                  value={formData.salary_range}
                  onChange={handleChange}
                  placeholder="e.g., $120k - $180k"
                />
              </FormGroup>
            </TwoColumnGrid>

            <FormGroup>
              <Label>Notes</Label>
              <TextArea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                placeholder="Add any notes about this application..."
              />
            </FormGroup>
          </FormGrid>
        </Modal.Body>

        <Modal.Footer>
          <ActionButtons>
            <Button
              type="button"
              variant="ghost"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" isLoading={isLoading}>
              {applicationId ? "Update Application" : "Add Application"}
            </Button>
          </ActionButtons>
        </Modal.Footer>
      </form>
    </Modal>
  );
}
