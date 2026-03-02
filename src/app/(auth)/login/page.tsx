"use client";

import { useState, Suspense, useRef } from "react";
import styled, { keyframes } from "styled-components";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Turnstile, type TurnstileRef } from "@/components/ui/Turnstile";
import { signIn, signInWithGoogle } from "@/lib/auth";
import { useToast } from "@/contexts/ToastContext";
import { ROUTES } from "@/lib/constants";
import { useRouter, useSearchParams } from "next/navigation";
import { FcGoogle } from "react-icons/fc";

const shimmer = keyframes`
  0% { background-position: -1000px 0; }
  100% { background-position: 1000px 0; }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
  
  /* Liquid Glass Styling */
  background: rgba(20, 20, 22, 0.4);
  backdrop-filter: blur(32px) saturate(180%);
  -webkit-backdrop-filter: blur(32px) saturate(180%);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 24px;
  padding: 32px;
  box-shadow: 
    0 24px 48px -12px rgba(0, 0, 0, 0.4),
    inset 0 1px 1px rgba(255, 255, 255, 0.1);
  position: relative;
  overflow: hidden;

  @media (max-width: 768px) {
    padding: 24px 20px;
    border-radius: 24px;
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
  gap: 4px;
  text-align: center;
`;

const Title = styled.h1`
  font-size: 28px;
  font-weight: 700;
  letter-spacing: -0.02em;
  color: #ffffff;
  margin: 0;
`;

const Subtitle = styled.p`
  font-size: 15px;
  color: rgba(255, 255, 255, 0.6);
  margin: 0;
`;

const FieldGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg};
`;

const FieldsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
`;

const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
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

const ForgotLink = styled(Link)`
  font-size: 13px;
  color: var(--accent);
  text-decoration: none;
  font-weight: 500;
  transition: opacity 0.2s ease;

  &:hover {
    opacity: 0.8;
  }
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

const Divider = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  margin: 8px 0;

  &::before,
  &::after {
    content: "";
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

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const [captchaError, setCaptchaError] = useState<string>("");
  const turnstileRef = useRef<TurnstileRef>(null);
  const toast = useToast();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") || ROUTES.APP.DASHBOARD;

  const handleTurnstileVerify = (token: string) => {
    setTurnstileToken(token);
    setCaptchaError("");
  };

  const handleTurnstileError = () => {
    setCaptchaError("CAPTCHA verification failed. Please try again.");
    setTurnstileToken(null);
  };

  const handleTurnstileExpire = () => {
    setTurnstileToken(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY && !turnstileToken) {
      setCaptchaError("Please complete the CAPTCHA verification.");
      return;
    }

    setIsLoading(true);

    try {
      await signIn(email, password, turnstileToken);
      toast.success("Login successful! Redirecting...");
      window.location.href = redirectTo;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Login failed. Please try again.";
      toast.error(errorMessage);
      turnstileRef.current?.reset();
      setTurnstileToken(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    try {
      signInWithGoogle(redirectTo);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Google sign in failed. Please try again.";
      toast.error(errorMessage);
      setIsGoogleLoading(false);
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Header>
        <Title>Welcome Back</Title>
        <Subtitle>Sign in to continue to Rejectly.pro</Subtitle>
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
          {isGoogleLoading ? "Connecting..." : "Continue with Google"}
        </Button>

        <Divider>
          <DividerText>or</DividerText>
        </Divider>

        <FieldsContainer>
          <Field>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="name@example.com"
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
                padding: "12px 16px",
              }}
            />
          </Field>

          <Field>
            <LabelRow>
              <Label htmlFor="password">Password</Label>
              <ForgotLink href={ROUTES.AUTH.FORGOT_PASSWORD}>
                Forgot password?
              </ForgotLink>
            </LabelRow>
            <Input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              fullWidth
              autoComplete="current-password"
              style={{
                background: "rgba(0, 0, 0, 0.2)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                color: "#fff",
                borderRadius: "16px",
                padding: "12px 16px",
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
          Sign In
        </Button>
      </FieldGroup>

      <Footer>
        Don&apos;t have an account?{" "}
        <Link href={ROUTES.AUTH.SIGNUP}>Create one</Link>
      </Footer>
    </Form>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginForm />
    </Suspense>
  );
}

