'use client';

import { useState } from 'react';
import styled from 'styled-components';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { resetPassword } from '@/lib/auth';
import { useToast } from '@/contexts/ToastContext';
import { ROUTES } from '@/lib/constants';

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

const SuccessMessage = styled.div`
  padding: ${({ theme }) => theme.spacing.md};
  background-color: var(--success-bg);
  border: 1px solid var(--success-border);
  border-radius: ${({ theme }) => theme.radius.md};
  color: var(--success);
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  text-align: center;
`;

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const toast = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      toast.error('Please enter your email address');
      return;
    }

    setIsLoading(true);

    try {
      await resetPassword(email);
      setEmailSent(true);
      toast.success('Password reset email sent!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to send reset email. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (emailSent) {
    return (
      <>
        <Title>Check Your Email</Title>
        <Subtitle>We've sent you a password reset link</Subtitle>

        <SuccessMessage>
          We've sent a password reset link to <strong>{email}</strong>.
          <br />
          Please check your inbox and follow the instructions.
        </SuccessMessage>

        <Footer>
          Remember your password?{' '}
          <a href={ROUTES.AUTH.LOGIN}>Log in</a>
        </Footer>
      </>
    );
  }

  return (
    <>
      <Title>Forgot Password?</Title>
      <Subtitle>Enter your email and we'll send you a reset link</Subtitle>

      <Form onSubmit={handleSubmit}>
        <Input
          label="Email"
          type="email"
          placeholder="example@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          fullWidth
          autoComplete="email"
        />

        <Button type="submit" isLoading={isLoading} fullWidth size="lg">
          Send Reset Link
        </Button>
      </Form>

      <Footer>
        Remember your password?{' '}
        <a href={ROUTES.AUTH.LOGIN}>Log in</a>
      </Footer>
    </>
  );
}