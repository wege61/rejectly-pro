"use client";

import styled, { keyframes } from "styled-components";
import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";

const pulse = keyframes`
  0% { transform: scale(1); opacity: 0.8; }
  50% { transform: scale(1.05); opacity: 1; }
  100% { transform: scale(1); opacity: 0.8; }
`;

const slideUp = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  text-align: center;
  width: 100%;
  min-height: 300px;
`;

const IconWrapper = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: var(--accent-light, rgba(99, 102, 241, 0.1));
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 24px;
  animation: ${pulse} 2s infinite ease-in-out;
  color: var(--accent);

  svg {
    width: 36px;
    height: 36px;
    animation: spin 1.5s linear infinite;
  }

  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
`;

const LoadingTitle = styled.h3`
  font-size: 20px;
  font-weight: 600;
  color: var(--text-color);
  margin: 0 0 12px 0;
`;

const LoadingMessage = styled.p`
  font-size: 15px;
  color: var(--text-secondary);
  animation: ${slideUp} 0.4s ease forwards;
  max-width: 400px;
  line-height: 1.5;
`;

interface DynamicLoaderProps {
  title?: string;
  messages: string[];
  intervalMs?: number;
}

export function DynamicLoader({
  title = "Processing...",
  messages,
  intervalMs = 2500,
}: DynamicLoaderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (messages.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => {
        // Stop at the last message to avoid awkward looping
        if (prev === messages.length - 1) {
             return prev;
        }
        return prev + 1;
      });
    }, intervalMs);

    return () => clearInterval(interval);
  }, [messages, intervalMs]);

  return (
    <LoadingContainer>
      <IconWrapper>
        <Loader2 />
      </IconWrapper>
      <LoadingTitle>{title}</LoadingTitle>
      {/* 
        Key forces React to re-mount the component on index change,
        triggering the slide-up animation for every new message.
      */}
      <LoadingMessage key={currentIndex}>
        {messages[currentIndex]}
      </LoadingMessage>
    </LoadingContainer>
  );
}
