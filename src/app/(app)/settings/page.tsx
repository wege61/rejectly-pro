"use client";

import styled from "styled-components";
import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/contexts/ToastContext";
import { useCredits } from "@/contexts/CreditsContext";
import { Modal } from "@/components/ui/Modal";
import { signOut } from "@/lib/auth";
import { deleteUserAccount, updatePassword, updateProfile } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/lib/constants";
import { CreditsCard } from "@/components/dashboard";

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

const Section = styled.section`
  margin-bottom: ${({ theme }) => theme.spacing["2xl"]};
    max-width: 800px;

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

const SectionTitle = styled.h2`
  font-size: ${({ theme }) => theme.typography.fontSize.xl};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};

  /* Glass-like inputs */
  input {
    background: rgba(0, 0, 0, 0.2);
    border: 1px solid rgba(255, 255, 255, 0.1);
    color: white;
    box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.2);
    transition: all 0.2s ease;

    &::placeholder {
      color: rgba(255, 255, 255, 0.4);
    }

    &:hover:not(:disabled) {
      background: rgba(0, 0, 0, 0.3);
      border-color: rgba(255, 255, 255, 0.2);
    }

    &:focus:not(:disabled) {
      background: rgba(0, 0, 0, 0.4);
      border-color: rgba(255, 255, 255, 0.3);
      box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.1), inset 0 2px 4px rgba(0, 0, 0, 0.2);
    }

    &:disabled {
      opacity: 0.5;
      background: rgba(255, 255, 255, 0.05);
    }
  }

  label {
    color: rgba(255, 255, 255, 0.9);
  }
`;

const GlassCard = styled.div`
  position: relative;
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
`;

const GlassCardHeader = styled.div`
  padding: 28px 24px 16px;
  position: relative;
  z-index: 2;
`;

const GlassCardTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0 0 4px 0;
  color: var(--text-color);
  letter-spacing: -0.01em;
`;

const GlassCardDescription = styled.p`
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.48);
  margin: 0;
  font-weight: 500;
`;

const GlassCardContent = styled.div`
  padding: 16px 24px 28px;
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const DangerZone = styled(GlassCard)`
  border-color: rgba(239, 68, 68, 0.5);
  box-shadow: 
    0 8px 40px rgba(0, 0, 0, 0.45),
    0 2px 8px rgba(0, 0, 0, 0.3),
    inset 0 0 0 1px rgba(239, 68, 68, 0.1);
`;

const DangerTitle = styled.h3`
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.error};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const DangerDescription = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;


export default function SettingsPage() {
  const { user } = useAuth();
  const toast = useToast();
  const router = useRouter();
  const [name, setName] = useState(user?.user_metadata?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  const handleUpdateProfile = async () => {
    if (!name || name.trim() === "") {
      toast.error("Name cannot be empty");
      return;
    }

    setIsLoading(true);
    try {
      await updateProfile(name);
      toast.success("Profile updated successfully!");
    } catch (error: any) {
      toast.error(error.message || "Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdatePassword = async () => {
    // Validasyon
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error("Please fill in all password fields");
      return;
    }

    if (newPassword.length < 6) {
      toast.error("New password must be at least 6 characters");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }

    setIsUpdatingPassword(true);
    try {
      await updatePassword(currentPassword, newPassword);
      toast.success("Password updated successfully!");
      // Formu temizle
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error: any) {
      toast.error(error.message || "Failed to update password");
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    try {
      await deleteUserAccount();
      toast.success("Account deleted successfully");
    } catch (error: any) {
      toast.error(error.message || "Failed to delete account");
      setIsDeleting(false);
      setIsDeleteModalOpen(false);
    }
  };

  return (
    <Container>
      <Header>
        <TitleElements>
          <Title>Settings</Title>
          <Subtitle>Manage your account settings and preferences</Subtitle>
        </TitleElements>
        <CreditsCardWrapper>
          <CreditsCard />
        </CreditsCardWrapper>
      </Header>

      <Section>
        <GlassCard>
          <GlassCardHeader>
            <GlassCardTitle>Profile Information</GlassCardTitle>
            <GlassCardDescription>
              Update your account profile information
            </GlassCardDescription>
          </GlassCardHeader>
          <GlassCardContent>
            <FormGroup>
              <Input
                label="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                fullWidth
              />
              <Input
                label="Email"
                type="email"
                value={email}
                disabled
                helperText="Email cannot be changed"
                fullWidth
              />
            </FormGroup>
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '12px' }}>
                <Button
                  onClick={handleUpdateProfile}
                  isLoading={isLoading}
                  disabled={!name}
                >
                  Save Changes
                </Button>
              </div>
          </GlassCardContent>
        </GlassCard>
      </Section>

      <Section>
        <GlassCard>
          <GlassCardHeader>
            <GlassCardTitle>Password</GlassCardTitle>
            <GlassCardDescription>Change your password</GlassCardDescription>
          </GlassCardHeader>
          <GlassCardContent>
            <FormGroup>
              <Input
                label="Current Password"
                type="password"
                placeholder="••••••••"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                fullWidth
              />
              <Input
                label="New Password"
                type="password"
                placeholder="••••••••"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                helperText="Minimum 6 characters"
                fullWidth
              />
              <Input
                label="Confirm New Password"
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                fullWidth
              />
            </FormGroup>
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '12px' }}>
                <Button
                  variant="secondary"
                  onClick={handleUpdatePassword}
                  isLoading={isUpdatingPassword}
                  disabled={!currentPassword || !newPassword || !confirmPassword}
                >
                  Update Password
                </Button>
              </div>
          </GlassCardContent>
        </GlassCard>
      </Section>

      <Section>
        <GlassCard>
          <GlassCardHeader>
            <GlassCardTitle>Language & Region</GlassCardTitle>
            <GlassCardDescription>Set your preferred language</GlassCardDescription>
          </GlassCardHeader>
          <GlassCardContent>
            <Input
              label="Language"
              value="English (EN)"
              disabled
              helperText="More languages coming soon"
              fullWidth
            />
          </GlassCardContent>
        </GlassCard>
      </Section>

      <Section>
        <SectionTitle style={{ color: "#ef4444" }}>Danger Zone</SectionTitle>
        <DangerZone>
          <GlassCardContent>
            <DangerTitle>Delete Account</DangerTitle>
            <DangerDescription>
              Once you delete your account, there is no going back. All your
              data including CV, reports, and payment history will be
              permanently deleted.
            </DangerDescription>
            <Button variant="danger" onClick={() => setIsDeleteModalOpen(true)}>
              Delete My Account
            </Button>
          </GlassCardContent>
        </DangerZone>
      </Section>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => !isDeleting && setIsDeleteModalOpen(false)}
        title="Delete Account"
        size="sm"
      >
        <Modal.Body>
          <p style={{ marginBottom: "16px" }}>
            Are you absolutely sure you want to delete your account? This action
            cannot be undone.
          </p>
          <p style={{ fontSize: "14px", color: "#6b7280" }}>
            All your data will be permanently deleted, including:
          </p>
          <ul
            style={{
              fontSize: "14px",
              color: "#6b7280",
              paddingLeft: "20px",
              marginTop: "8px",
            }}
          >
            <li>Your CV and job postings</li>
            <li>All analysis reports</li>
            <li>Payment history</li>
            <li>Account settings</li>
          </ul>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="ghost"
            onClick={() => setIsDeleteModalOpen(false)}
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={handleDeleteAccount}
            isLoading={isDeleting}
          >
            Yes, Delete My Account
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}
