"use client";

import { useState, Suspense } from "react";
import styled from "styled-components";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { signIn, signInWithGoogle } from "@/lib/auth";
import { useToast } from "@/contexts/ToastContext";
import { ROUTES } from "@/lib/constants";
import { useRouter, useSearchParams } from "next/navigation";
import { FcGoogle } from "react-icons/fc";

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
  font-size: ${({ theme }) => theme.typography.fontSize["2xl"]};
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

const LabelRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Label = styled.label`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  color: var(--text-color);
`;

const ForgotLink = styled(Link)`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: var(--text-secondary);
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
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

const Divider = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;

  &::before,
  &::after {
    content: "";
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

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const toast = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") || ROUTES.APP.DASHBOARD;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await signIn(email, password);
      toast.success("Login successful! Redirecting...");
      router.push(redirectTo);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Login failed. Please try again.";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    try {
      await signInWithGoogle();
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Google sign in failed. Please try again.";
      toast.error(errorMessage);
      setIsGoogleLoading(false);
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Header>
        <Title>Login to your account</Title>
        <Subtitle>Enter your email below to login to your account</Subtitle>
      </Header>

      <FieldGroup>
        <GoogleButton
          type="button"
          onClick={handleGoogleSignIn}
          disabled={isGoogleLoading || isLoading}
        >
          <FcGoogle />
          {isGoogleLoading ? "Connecting..." : "Continue with Google"}
        </GoogleButton>

        <Divider>
          <DividerText>or</DividerText>
        </Divider>

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
          <LabelRow>
            <Label htmlFor="password">Password</Label>
            <ForgotLink href={ROUTES.AUTH.FORGOT_PASSWORD}>
              Forgot your password?
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
          />
        </Field>

        <Button type="submit" isLoading={isLoading} fullWidth size="lg">
          Login
        </Button>
      </FieldGroup>

      <Footer>
        Don&apos;t have an account?{" "}
        <Link href={ROUTES.AUTH.SIGNUP}>Sign up</Link>
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
