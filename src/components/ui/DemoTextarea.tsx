"use client";

import styled from "styled-components";
import { ComponentPropsWithoutRef, forwardRef } from "react";

const StyledTextarea = styled.textarea`
  display: flex;
  width: 100%;
  min-height: 120px;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(255, 255, 255, 0.02);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  padding: 16px;
  font-size: 14px;
  font-family: inherit;
  color: var(--text-color);
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.2);
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  resize: vertical;
  outline: none;

  &::placeholder {
    color: var(--text-secondary);
    opacity: 0.6;
  }

  &:focus {
    border-color: rgba(255, 255, 255, 0.3);
    background: rgba(255, 255, 255, 0.04);
    box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.2), 0 0 0 3px rgba(255, 255, 255, 0.05);
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }

  &[aria-invalid="true"] {
    border-color: #ef4444;
    box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
  }

  @media (max-width: 768px) {
    font-size: 16px; /* Prevents zoom on iOS */
  }
`;

interface DemoTextareaProps extends ComponentPropsWithoutRef<"textarea"> {
  error?: boolean;
}

export const DemoTextarea = forwardRef<HTMLTextAreaElement, DemoTextareaProps>(
  ({ error, ...props }, ref) => {
    return (
      <StyledTextarea
        ref={ref}
        data-slot="textarea"
        aria-invalid={error}
        {...props}
      />
    );
  }
);

DemoTextarea.displayName = "DemoTextarea";
