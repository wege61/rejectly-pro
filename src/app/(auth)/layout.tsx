'use client';

import styled from 'styled-components';
import { ROUTES } from '@/lib/constants';

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme }) => theme.colors.backgroundAlt};
  padding: ${({ theme }) => theme.spacing.lg};
`;

const Card = styled.div`
  width: 100%;
  max-width: 450px;
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.radius.xl};
  box-shadow: ${({ theme }) => theme.shadow.xl};
  padding: ${({ theme }) => theme.spacing['2xl']};
`;

const Logo = styled.div`
  text-align: center;
  margin-bottom: ${({ theme }) => theme.spacing['2xl']};
`;

const LogoLink = styled.a`
  text-decoration: none;
  cursor: pointer;
  display: inline-block;
  transition: transform ${({ theme }) => theme.transitions.fast};

  &:hover {
    transform: scale(1.02);
  }
`;

const LogoText = styled.h1`
  font-size: ${({ theme }) => theme.typography.fontSize['3xl']};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: ${({ theme }) => theme.spacing.xs};

  ${LogoLink}:hover & {
    color: ${({ theme }) => theme.colors.primaryHover};
  }
`;

const LogoSubtext = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
`;

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Container>
      <Card>
        <Logo>
          <LogoLink href={ROUTES.PUBLIC.HOME}>
            <LogoText>Rejectly.pro</LogoText>
            <LogoSubtext>AI-powered CV Analysis</LogoSubtext>
          </LogoLink>
        </Logo>
        {children}
      </Card>
    </Container>
  );
}