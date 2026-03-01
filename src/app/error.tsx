"use client";

import { useEffect } from "react";
import styled from "styled-components";

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

const ErrorIcon = styled.div`
  font-size: 64px;
  margin-bottom: 24px;
`;

const Title = styled.h1`
  font-size: 32px;
  font-weight: 700;
  margin-bottom: 12px;
  text-align: center;

  @media (max-width: 768px) {
    font-size: 24px;
  }
`;

const Description = styled.p`
  font-size: 16px;
  color: var(--text-secondary);
  text-align: center;
  max-width: 500px;
  margin-bottom: 32px;
  line-height: 1.6;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 16px;
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

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log error to console in development, could send to error tracking service
    console.error("Global error:", error);
  }, [error]);

  return (
    <Container>
      <ErrorIcon>&#x26A0;</ErrorIcon>
      <Title>Something went wrong</Title>
      <Description>
        We apologize for the inconvenience. An unexpected error has occurred.
        Please try again or contact support if the problem persists.
      </Description>
      <ButtonGroup>
        <Button $variant="primary" onClick={reset}>
          Try Again
        </Button>
        <Button onClick={() => (window.location.href = "/")}>
          Go to Home
        </Button>
      </ButtonGroup>
    </Container>
  );
}
