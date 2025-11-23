'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styled from 'styled-components';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useToast } from '@/contexts/ToastContext';
import { ROUTES } from '@/lib/constants';
import { createClient } from '@/lib/supabase/client';

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg};
`;

const Title = styled.h2`
  font-size: ${({ theme }) => theme.typography.fontSize['2xl']};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const Subtitle = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: var(--text-secondary);
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const Footer = styled.div`
  margin-top: ${({ theme }) => theme.spacing.lg};
  text-align: center;
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: var(--text-secondary);

  a {
    color: var(--accent);
    font-weight: ${({ theme }) => theme.typography.fontWeight.medium};

    &:hover {
      text-decoration: underline;
    }
  }
`;

export default function ResetPasswordPage() {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();
  const router = useRouter();


const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!newPassword || !confirmPassword) {
    toast.error('Please fill in all fields');
    return;
  }

  if (newPassword.length < 6) {
    toast.error('Password must be at least 6 characters');
    return;
  }

  if (newPassword !== confirmPassword) {
    toast.error('Passwords do not match');
    return;
  }

  setIsLoading(true);

  try {
    const supabase = createClient();
    
    // Session kontrolü ekle
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      toast.error('Session expired. Please request a new reset link.');
      router.push(ROUTES.AUTH.FORGOT_PASSWORD);
      return;
    }

    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) throw error;

    toast.success('Password reset successfully!');
    router.push(ROUTES.AUTH.LOGIN);
  } catch (error: any) {
    toast.error(error.message || 'Failed to reset password. Please try again.');
  } finally {
    setIsLoading(false);
  }
};

  return (
    <>
      <Title>Reset Password</Title>
      <Subtitle>Enter your new password</Subtitle>

      <Form onSubmit={handleSubmit}>
        <Input
          label="New Password"
          type="password"
          placeholder="••••••••"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
          fullWidth
          autoComplete="new-password"
          helperText="Minimum 6 characters"
        />

        <Input
          label="Confirm New Password"
          type="password"
          placeholder="••••••••"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          fullWidth
          autoComplete="new-password"
        />

        <Button type="submit" isLoading={isLoading} fullWidth size="lg">
          Reset Password
        </Button>
      </Form>

      <Footer>
        Remember your password?{' '}
        <a href={ROUTES.AUTH.LOGIN}>Log in</a>
      </Footer>
    </>
  );
}