"use client";

import { useEffect } from "react";
import styled from "styled-components";
import Link from "next/link";
import { ROUTES } from "@/lib/constants";

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 24px;
  background-color: var(--bg-color);
  color: var(--text-color);
`;

const Card = styled.div`
  max-width: 400px;
  width: 100%;
  padding: 32px;
  background: var(--bg-alt);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  text-align: center;
`;

const ErrorIcon = styled.div`
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: rgba(var(--error-rgb, 239, 68, 68), 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  margin: 0 auto 20px;
`;

const Title = styled.h1`
  font-size: 22px;
  font-weight: 600;
  margin-bottom: 8px;
`;

const Description = styled.p`
  font-size: 14px;
  color: var(--text-secondary);
  margin-bottom: 24px;
  line-height: 1.5;
`;

const ButtonGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const Button = styled.button`
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  background: var(--primary-500);
  color: white;
  border: none;
  width: 100%;

  &:hover {
    background: var(--primary-600);
  }
`;

const StyledLink = styled(Link)`
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  text-decoration: none;
  background: transparent;
  color: var(--text-secondary);
  border: 1px solid var(--border-color);
  display: block;

  &:hover {
    background: var(--hover-bg);
    color: var(--text-color);
  }
`;

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function AuthError({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error("Auth error:", error);
  }, [error]);

  return (
    <Container>
      <Card>
        <ErrorIcon>&#x26A0;</ErrorIcon>
        <Title>Authentication Error</Title>
        <Description>
          We encountered an issue with the authentication process.
          Please try again or return to the login page.
        </Description>
        <ButtonGroup>
          <Button onClick={reset}>Try Again</Button>
          <StyledLink href={ROUTES.AUTH.LOGIN}>Back to Login</StyledLink>
        </ButtonGroup>
      </Card>
    </Container>
  );
}
