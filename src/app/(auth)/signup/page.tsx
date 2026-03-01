'use client';

import { useState, useRef } from 'react';
import styled from 'styled-components';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Turnstile, type TurnstileRef } from '@/components/ui/Turnstile';
import { signUp, signInWithGoogle } from '@/lib/auth';
import { useToast } from '@/contexts/ToastContext';
import { ROUTES } from '@/lib/constants';
import { FcGoogle } from 'react-icons/fc';

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

const Divider = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;

  &::before,
  &::after {
    content: '';
    flex: 1;
    height: 1px;
    background: var(--border-color);
  }
`;

const DividerText = styled.span`
  font-size: 14px;
  color: var(--text-secondary);
  text-transform: lowercase;
`;

const GoogleButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  padding: 12px 16px;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  background: transparent;
  color: var(--text-color);
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: var(--hover-bg);
    border-color: var(--text-secondary);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  svg {
    font-size: 20px;
  }
`;

export default function SignupPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const [captchaError, setCaptchaError] = useState<string>('');
  const turnstileRef = useRef<TurnstileRef>(null);
  const toast = useToast();
  const router = useRouter();

  const handleTurnstileVerify = (token: string) => {
    setTurnstileToken(token);
    setCaptchaError('');
  };

  const handleTurnstileError = () => {
    setCaptchaError('CAPTCHA verification failed. Please try again.');
    setTurnstileToken(null);
  };

  const handleTurnstileExpire = () => {
    setTurnstileToken(null);
  };

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

    // Check CAPTCHA if configured
    if (process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY && !turnstileToken) {
      setCaptchaError('Please complete the CAPTCHA verification.');
      return;
    }

    setIsLoading(true);

    try {
      await signUp(email, password, name, turnstileToken);
      toast.success('Account created successfully! Redirecting...');
      router.push(ROUTES.APP.DASHBOARD);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Sign up failed. Please try again.';
      toast.error(errorMessage);
      // Reset CAPTCHA on failed attempt
      turnstileRef.current?.reset();
      setTurnstileToken(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = () => {
    setIsGoogleLoading(true);
    try {
      // Will redirect to Google OAuth flow
      signInWithGoogle(ROUTES.APP.DASHBOARD);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Google sign in failed. Please try again.';
      toast.error(errorMessage);
      setIsGoogleLoading(false);
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Header>
        <Title>Create your account</Title>
        <Subtitle>Get started with your free account</Subtitle>
      </Header>

      <FieldGroup>
        <GoogleButton
          type="button"
          onClick={handleGoogleSignIn}
          disabled={isGoogleLoading || isLoading}
        >
          <FcGoogle />
          {isGoogleLoading ? 'Connecting...' : 'Continue with Google'}
        </GoogleButton>

        <Divider>
          <DividerText>or</DividerText>
        </Divider>

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

        <Turnstile
          ref={turnstileRef}
          onVerify={handleTurnstileVerify}
          onError={handleTurnstileError}
          onExpire={handleTurnstileExpire}
          error={captchaError}
        />

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
