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
  gap: ${({ theme }) => theme.spacing.sm};
  
  /* Liquid Glass Styling */
  background: rgba(20, 20, 22, 0.4);
  backdrop-filter: blur(32px) saturate(180%);
  -webkit-backdrop-filter: blur(32px) saturate(180%);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 24px;
  padding: 24px;
  box-shadow: 
    0 24px 48px -12px rgba(0, 0, 0, 0.4),
    inset 0 1px 1px rgba(255, 255, 255, 0.1);
  position: relative;
  overflow: hidden;

  @media (max-width: 768px) {
    padding: 20px;
    border-radius: 20px;
    background: rgba(20, 20, 22, 0.6);
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(
      90deg,
      rgba(255, 255, 255, 0) 0%,
      rgba(255, 255, 255, 0.15) 50%,
      rgba(255, 255, 255, 0) 100%
    );
  }
`;

const Header = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  text-align: center;
`;

const Title = styled.h1`
  font-size: 24px;
  font-weight: 700;
  letter-spacing: -0.02em;
  color: #ffffff;
  margin: 0;
`;

const Subtitle = styled.p`
  font-size: 14px;
  color: rgba(255, 255, 255, 0.6);
  margin: 0;
`;

const FieldGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const FieldsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const LabelRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Label = styled.label`
  font-size: 14px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.9);
  padding-left: 4px;
`;

const FieldDescription = styled.p`
  font-size: 13px;
  color: rgba(255, 255, 255, 0.4);
  margin-top: 2px;
  padding-left: 4px;
`;

const Footer = styled.p`
  text-align: center;
  font-size: 14px;
  color: rgba(255, 255, 255, 0.6);
  margin-top: ${({ theme }) => theme.spacing.sm};

  a {
    color: #ffffff;
    font-weight: 500;
    text-decoration: none;
    margin-left: 4px;
    transition: color 0.2s ease;

    &:hover {
      color: var(--accent);
    }
  }
`;

const TermsText = styled.p`
  font-size: 13px;
  color: rgba(255, 255, 255, 0.4);
  text-align: center;
  line-height: 1.5;
  margin-top: -4px;
  margin-bottom: -8px;

  a {
    color: #ffffff;
    font-weight: 500;
    text-decoration: none;
    transition: color 0.2s ease;

    &:hover {
      color: var(--accent);
    }
  }
`;

const Divider = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  margin: 8px 0;

  &::before,
  &::after {
    content: '';
    flex: 1;
    height: 1px;
    background: linear-gradient(
      90deg,
      rgba(255, 255, 255, 0) 0%,
      rgba(255, 255, 255, 0.1) 50%,
      rgba(255, 255, 255, 0) 100%
    );
  }
`;

const DividerText = styled.span`
  font-size: 13px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.4);
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

export default function SignupPage() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
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
      const fullName = `${firstName} ${lastName}`.trim();
      await signUp(email, password, fullName, turnstileToken);
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
        <Button
          type="button"
          variant="glass-secondary"
          size="lg"
          fullWidth
          onClick={handleGoogleSignIn}
          disabled={isGoogleLoading || isLoading}
          style={{ gap: '12px', fontWeight: 600 }}
        >
          <FcGoogle size={22} />
          {isGoogleLoading ? 'Connecting...' : 'Continue with Google'}
        </Button>

        <Divider>
          <DividerText>or</DividerText>
        </Divider>

        <FieldsContainer>
          <div style={{ display: 'flex', gap: '12px' }}>
            <Field style={{ flex: 1 }}>
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                type="text"
                placeholder="Alex"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
                fullWidth
                autoComplete="given-name"
                style={{
                  background: "rgba(0, 0, 0, 0.2)",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  color: "#fff",
                  borderRadius: "16px",
                  padding: "8px 12px",
                }}
              />
            </Field>
            <Field style={{ flex: 1 }}>
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                type="text"
                placeholder="Chen"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
                fullWidth
                autoComplete="family-name"
                style={{
                  background: "rgba(0, 0, 0, 0.2)",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  color: "#fff",
                  borderRadius: "16px",
                  padding: "8px 12px",
                }}
              />
            </Field>
          </div>

          <Field>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="elon@spacex.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              fullWidth
              autoComplete="email"
              style={{
                background: "rgba(0, 0, 0, 0.2)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                color: "#fff",
                borderRadius: "16px",
                padding: "8px 12px",
              }}
            />
          </Field>

          <Field>
            <LabelRow>
              <Label htmlFor="password">Password</Label>
            </LabelRow>
            <Input
              id="password"
              type="password"
              placeholder="Min. 8 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              fullWidth
              autoComplete="new-password"
              style={{
                background: "rgba(0, 0, 0, 0.2)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                color: "#fff",
                borderRadius: "16px",
                padding: "8px 12px",
              }}
            />
          </Field>

          <Field>
            <LabelRow>
              <Label htmlFor="confirm-password">Confirm Password</Label>
            </LabelRow>
            <Input
              id="confirm-password"
              type="password"
              placeholder="Confirm password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              fullWidth
              autoComplete="new-password"
              style={{
                background: "rgba(0, 0, 0, 0.2)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                color: "#fff",
                borderRadius: "16px",
                padding: "8px 12px",
              }}
            />
          </Field>
        </FieldsContainer>

        <Turnstile
          ref={turnstileRef}
          onVerify={handleTurnstileVerify}
          onError={handleTurnstileError}
          onExpire={handleTurnstileExpire}
          error={captchaError}
        />

        <Button 
          type="submit" 
          variant="glass-primary"
          isLoading={isLoading} 
          fullWidth 
          size="lg"
          style={{ 
            borderRadius: '16px', 
            fontWeight: 600,
            fontSize: '16px',
            marginTop: '8px'
          }}
        >
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
