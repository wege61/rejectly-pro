'use client';

import { useState } from 'react';
import styled from 'styled-components';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { signUp } from '@/lib/auth';
import { useToast } from '@/contexts/ToastContext';
import { ROUTES } from '@/lib/constants';

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xl};
`;

const Header = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  text-align: center;
`;

const Title = styled.h1`
  font-size: ${({ theme }) => theme.typography.fontSize['2xl']};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: var(--text-color);
`;

const Subtitle = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: var(--text-secondary);
`;

const FieldGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg};
`;

const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const Label = styled.label`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  color: var(--text-color);
`;

const FieldDescription = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  color: var(--text-secondary);
  margin-top: 2px;
`;

const Footer = styled.p`
  text-align: center;
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: var(--text-secondary);

  a {
    color: var(--text-color);
    text-decoration: underline;
    text-underline-offset: 4px;

    &:hover {
      color: var(--accent);
    }
  }
`;

const TermsText = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  color: var(--text-secondary);
  text-align: center;
  line-height: 1.5;

  a {
    color: var(--text-color);
    text-decoration: underline;
    text-underline-offset: 2px;

    &:hover {
      color: var(--accent);
    }
  }
`;

export default function SignupPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password.length < 8) {
      toast.error('Password must be at least 8 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      toast.error('Passwords do not match.');
      return;
    }

    setIsLoading(true);

    try {
      await signUp(email, password, name);
      toast.success('Sign up successful! Please check your email to verify your account.');
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Sign up failed. Please try again.';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Header>
        <Title>Create your account</Title>
        <Subtitle>Fill in the form below to create your account</Subtitle>
      </Header>

      <FieldGroup>
        <Field>
          <Label htmlFor="name">Full Name</Label>
          <Input
            id="name"
            type="text"
            placeholder="John Doe"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            fullWidth
            autoComplete="name"
          />
        </Field>

        <Field>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="m@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            fullWidth
            autoComplete="email"
          />
          <FieldDescription>
            We&apos;ll use this to contact you. We will not share your email with anyone.
          </FieldDescription>
        </Field>

        <Field>
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            fullWidth
            autoComplete="new-password"
          />
          <FieldDescription>
            Must be at least 8 characters long.
          </FieldDescription>
        </Field>

        <Field>
          <Label htmlFor="confirm-password">Confirm Password</Label>
          <Input
            id="confirm-password"
            type="password"
            placeholder="Confirm your password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            fullWidth
            autoComplete="new-password"
          />
        </Field>

        <Button type="submit" isLoading={isLoading} fullWidth size="lg">
          Create Account
        </Button>

        <TermsText>
          By signing up, you agree to our{' '}
          <Link href={ROUTES.PUBLIC.TERMS} target="_blank">Terms of Service</Link>
          {' '}and{' '}
          <Link href={ROUTES.PUBLIC.PRIVACY} target="_blank">Privacy Policy</Link>.
        </TermsText>
      </FieldGroup>

      <Footer>
        Already have an account?{' '}
        <Link href={ROUTES.AUTH.LOGIN}>Sign in</Link>
      </Footer>
    </Form>
  );
}
