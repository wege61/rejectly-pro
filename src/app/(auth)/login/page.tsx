"use client";

import { useState } from "react";
import styled from "styled-components";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { signIn } from "@/lib/auth";
import { useToast } from "@/contexts/ToastContext";
import { ROUTES } from "@/lib/constants";
import { useRouter } from "next/navigation";

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

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await signIn(email, password);
      toast.success("Login successful! Redirecting...");
      router.push(ROUTES.APP.DASHBOARD);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Login failed. Please try again.";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Header>
        <Title>Login to your account</Title>
        <Subtitle>Enter your email below to login to your account</Subtitle>
      </Header>

      <FieldGroup>
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
