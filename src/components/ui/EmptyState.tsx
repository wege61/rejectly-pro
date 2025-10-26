"use client";

import styled from "styled-components";
import { Button } from "./Button";

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing["3xl"]};
  text-align: center;
  animation: ${({ theme }) => theme.animations.fadeIn} 0.5s ease;
`;

const IconWrapper = styled.div`
  width: 64px;
  height: 64px;
  border-radius: ${({ theme }) => theme.radius.full};
  background-color: ${({ theme }) => theme.colors.surfaceHover};
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  color: ${({ theme }) => theme.colors.textTertiary};
  animation: ${({ theme }) => theme.animations.scaleIn} 0.4s ease;
  transition: all ${({ theme }) => theme.transitions.normal};

  &:hover {
    transform: scale(1.1) rotate(5deg);
    background-color: ${({ theme }) => theme.colors.primaryLight};
    color: ${({ theme }) => theme.colors.primary};
  }

  svg {
    width: 32px;
    height: 32px;
  }
`;

const Title = styled.h3`
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.textPrimary};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
  animation: ${({ theme }) => theme.animations.slideInUp} 0.5s ease;
  animation-delay: 0.1s;
  animation-fill-mode: both;
`;

const Description = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  max-width: 400px;
  line-height: ${({ theme }) => theme.typography.lineHeight.relaxed};
  animation: ${({ theme }) => theme.animations.slideInUp} 0.5s ease;
  animation-delay: 0.2s;
  animation-fill-mode: both;
`;

const ActionWrapper = styled.div`
  animation: ${({ theme }) => theme.animations.slideInUp} 0.5s ease;
  animation-delay: 0.3s;
  animation-fill-mode: both;
`;

// Default icons
const InboxIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M2.25 13.5h3.86a2.25 2.25 0 012.012 1.244l.256.512a2.25 2.25 0 002.013 1.244h3.218a2.25 2.25 0 002.013-1.244l.256-.512a2.25 2.25 0 012.013-1.244h3.859m-19.5.338V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18v-4.162c0-.224-.034-.447-.1-.661L19.24 5.338a2.25 2.25 0 00-2.15-1.588H6.911a2.25 2.25 0 00-2.15 1.588L2.35 13.177a2.25 2.25 0 00-.1.661z"
    />
  </svg>
);

const DocumentIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
    />
  </svg>
);

const FolderIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z"
    />
  </svg>
);

const SearchIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
    />
  </svg>
);

export const EmptyState: React.FC<EmptyStateProps> & {
  InboxIcon: typeof InboxIcon;
  DocumentIcon: typeof DocumentIcon;
  FolderIcon: typeof FolderIcon;
  SearchIcon: typeof SearchIcon;
} = ({ icon, title, description, action }) => {
  return (
    <Container>
      {icon && <IconWrapper>{icon}</IconWrapper>}
      <Title>{title}</Title>
      {description && <Description>{description}</Description>}
      {action && (
        <ActionWrapper>
          <Button onClick={action.onClick}>{action.label}</Button>
        </ActionWrapper>
      )}
    </Container>
  );
};

EmptyState.InboxIcon = InboxIcon;
EmptyState.DocumentIcon = DocumentIcon;
EmptyState.FolderIcon = FolderIcon;
EmptyState.SearchIcon = SearchIcon;
