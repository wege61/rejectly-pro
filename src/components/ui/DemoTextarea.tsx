"use client";

import styled from "styled-components";
import { ComponentPropsWithoutRef, forwardRef } from "react";

const StyledTextarea = styled.textarea`
  display: flex;
  width: 100%;
  min-height: 120px;
  border-radius: 12px;
  border: 2px solid var(--border-color);
  background: var(--bg-color);
  padding: 12px 16px;
  font-size: 14px;
  font-family: inherit;
  color: var(--text-color);
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  transition: all 0.2s ease;
  resize: vertical;
  outline: none;

  &::placeholder {
    color: var(--text-secondary);
  }

  &:focus {
    border-color: var(--primary-500);
    box-shadow: 0 0 0 3px rgba(var(--primary-500-rgb), 0.15);
  }

  &:hover:not(:focus) {
    border-color: var(--primary-200);
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
