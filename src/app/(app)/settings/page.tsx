"use client";

import styled from "styled-components";
import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/contexts/ToastContext";
import { Modal } from "@/components/ui/Modal";
import { signOut } from "@/lib/auth";
import { deleteUserAccount, updatePassword, updateProfile } from "@/lib/auth";

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: ${({ theme }) => theme.spacing["2xl"]};
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

const Section = styled.section`
  margin-bottom: ${({ theme }) => theme.spacing["2xl"]};
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
`;

const DangerZone = styled(Card)`
  border-color: ${({ theme }) => theme.colors.error};
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
        <Title>Settings</Title>
        <Subtitle>Manage your account settings and preferences</Subtitle>
      </Header>

      <Section>
        <Card variant="bordered">
          <Card.Header>
            <Card.Title>Profile Information</Card.Title>
            <Card.Description>
              Update your account profile information
            </Card.Description>
          </Card.Header>
          <Card.Content>
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
          </Card.Content>
          <Card.Footer>
            <Button
              onClick={handleUpdateProfile}
              isLoading={isLoading}
              disabled={!name}
            >
              Save Changes
            </Button>
          </Card.Footer>
        </Card>
      </Section>

      <Section>
        <Card variant="bordered">
          <Card.Header>
            <Card.Title>Password</Card.Title>
            <Card.Description>Change your password</Card.Description>
          </Card.Header>
          <Card.Content>
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
          </Card.Content>
          <Card.Footer>
            <Button
              variant="secondary"
              onClick={handleUpdatePassword}
              isLoading={isUpdatingPassword}
              disabled={!currentPassword || !newPassword || !confirmPassword}
            >
              Update Password
            </Button>
          </Card.Footer>
        </Card>
      </Section>

      <Section>
        <Card variant="bordered">
          <Card.Header>
            <Card.Title>Language & Region</Card.Title>
            <Card.Description>Set your preferred language</Card.Description>
          </Card.Header>
          <Card.Content>
            <Input
              label="Language"
              value="English (EN)"
              disabled
              helperText="More languages coming soon"
              fullWidth
            />
          </Card.Content>
        </Card>
      </Section>

      <Section>
        <SectionTitle style={{ color: "#ef4444" }}>Danger Zone</SectionTitle>
        <DangerZone variant="bordered">
          <Card.Content>
            <DangerTitle>Delete Account</DangerTitle>
            <DangerDescription>
              Once you delete your account, there is no going back. All your
              data including CV, reports, and payment history will be
              permanently deleted.
            </DangerDescription>
            <Button variant="danger" onClick={() => setIsDeleteModalOpen(true)}>
              Delete My Account
            </Button>
          </Card.Content>
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
