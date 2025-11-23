'use client';

import { useState } from 'react';
import styled from 'styled-components';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { signUp } from '@/lib/auth';
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

const TermsText = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  color: var(--text-secondary);
  text-align: center;

  a {
    color: var(--accent);

    &:hover {
      text-decoration: underline;
    }
  }
`;

export default function SignupPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password.length < 6) {
      toast.error('Password must be at least 6 characters long.');
      return;
    }

    setIsLoading(true);

    try {
      await signUp(email, password, name);
      toast.success('Sign up successful! Please check your email.');
    } catch (error: any) {
      toast.error(error.message || 'Sign up failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Title>Create an Account</Title>
      <Subtitle>Sign up for free and start your resume analysis</Subtitle>

      <Form onSubmit={handleSubmit}>
        <Input
          label="Full Name"
          type="text"
          placeholder="John Doe"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          fullWidth
          autoComplete="name"
        />

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

        <Input
          label="Password"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          fullWidth
          autoComplete="new-password"
          helperText="Minimum 6 characters"
        />

        <Button type="submit" isLoading={isLoading} fullWidth size="lg">
          Sign Up
        </Button>
      </Form>

      <TermsText>
        By signing up, you agree to our{' '}
        <a href={ROUTES.PUBLIC.TERMS} target="_blank">
          Terms of Service
        </a>{' '}
        and{' '}
        <a href={ROUTES.PUBLIC.PRIVACY} target="_blank">
          Privacy Policy
        </a>
        .
      </TermsText>

      <Footer>
        Already have an account?{' '}
        <a href={ROUTES.AUTH.LOGIN}>Log in</a>
      </Footer>
    </>
  );
}
