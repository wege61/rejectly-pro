"use client";

import { useEffect } from "react";
import styled from "styled-components";
import Link from "next/link";
import { ROUTES } from "@/lib/constants";

const Container = styled.div`
  min-height: calc(100vh - 80px);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 24px;
  background-color: var(--bg-color);
  color: var(--text-color);
`;

const ErrorIcon = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: rgba(var(--error-rgb, 239, 68, 68), 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 36px;
  margin-bottom: 24px;
`;

const Title = styled.h1`
  font-size: 28px;
  font-weight: 700;
  margin-bottom: 12px;
  text-align: center;

  @media (max-width: 768px) {
    font-size: 22px;
  }
`;

const Description = styled.p`
  font-size: 15px;
  color: var(--text-secondary);
  text-align: center;
  max-width: 450px;
  margin-bottom: 28px;
  line-height: 1.6;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  justify-content: center;
`;

const Button = styled.button<{ $variant?: "primary" | "secondary" }>`
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  text-decoration: none;

  ${({ $variant }) =>
    $variant === "primary"
      ? `
    background: var(--primary-500);
    color: white;
    border: none;

    &:hover {
      background: var(--primary-600);
    }
  `
      : `
    background: transparent;
    color: var(--text-color);
    border: 1px solid var(--border-color);

    &:hover {
      background: var(--hover-bg);
    }
  `}
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
  color: var(--text-color);
  border: 1px solid var(--border-color);

  &:hover {
    background: var(--hover-bg);
  }
`;

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function AppError({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error("App error:", error);
  }, [error]);

  return (
    <Container>
      <ErrorIcon>&#x26A0;</ErrorIcon>
      <Title>Something went wrong</Title>
      <Description>
        We encountered an error while loading this page. This might be a
        temporary issue. Please try again or return to your dashboard.
      </Description>
      <ButtonGroup>
        <Button $variant="primary" onClick={reset}>
          Try Again
        </Button>
        <StyledLink href={ROUTES.APP.DASHBOARD}>
          Back to Dashboard
        </StyledLink>
      </ButtonGroup>
    </Container>
  );
}
