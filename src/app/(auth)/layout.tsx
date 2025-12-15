'use client';

import styled from 'styled-components';
import Link from 'next/link';
import { ROUTES } from '@/lib/constants';
import AuthSidePanel from '@/components/auth/AuthSidePanel';

const Container = styled.div`
  display: grid;
  min-height: 100vh;

  @media (min-width: 1024px) {
    grid-template-columns: 3fr 2fr;
  }
`;

const FormSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg};
  padding: ${({ theme }) => theme.spacing.xl};
  background-color: var(--bg-color);

  @media (min-width: 768px) {
    padding: ${({ theme }) => theme.spacing['2xl']};
  }
`;

const LogoContainer = styled.div`
  display: flex;
  justify-content: center;

  @media (min-width: 768px) {
    justify-content: flex-start;
  }
`;

const LogoLink = styled(Link)`
  display: flex;
  align-items: center;
  text-decoration: none;
  font-weight: 600;
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  color: var(--text-color);
  transition: opacity ${({ theme }) => theme.transitions.fast};

  &:hover {
    opacity: 0.8;
  }
`;

const FormContainer = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const FormWrapper = styled.div`
  width: 100%;
  max-width: 360px;
`;

const SideSection = styled.div`
  display: none;

  @media (min-width: 1024px) {
    display: block;
  }
`;

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Container>
      <FormSection>
        <LogoContainer>
          <LogoLink href={ROUTES.PUBLIC.HOME}>
            Rejectly.pro
          </LogoLink>
        </LogoContainer>
        <FormContainer>
          <FormWrapper>
            {children}
          </FormWrapper>
        </FormContainer>
      </FormSection>
      <SideSection>
        <AuthSidePanel />
      </SideSection>
    </Container>
  );
}
