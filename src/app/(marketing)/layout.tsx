'use client';

import styled from 'styled-components';
import { Button } from '@/components/ui/Button';
import { ROUTES } from '@/lib/constants';

const Header = styled.header`
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  padding: ${({ theme }) => theme.spacing.lg} 0;
`;

const Nav = styled.nav`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 ${({ theme }) => theme.spacing.lg};
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Logo = styled.a`
  font-size: ${({ theme }) => theme.typography.fontSize.xl};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.primary};
  text-decoration: none;
  
  &:hover {
    color: ${({ theme }) => theme.colors.primaryHover};
  }
`;

const NavLinks = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.lg};
  align-items: center;
  
  a {
    color: ${({ theme }) => theme.colors.textSecondary};
    font-size: ${({ theme }) => theme.typography.fontSize.sm};
    
    &:hover {
      color: ${({ theme }) => theme.colors.textPrimary};
    }
  }
`;

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header>
        <Nav>
          <Logo href={ROUTES.PUBLIC.HOME}>Rejectly.pro</Logo>
          <NavLinks>
            <a href={ROUTES.PUBLIC.FEATURES}>Features</a>
            <a href={ROUTES.PUBLIC.HOW_IT_WORKS}>How it Works</a>
            <a href={ROUTES.PUBLIC.PRICING}>Pricing</a>
            <a href={ROUTES.PUBLIC.FAQ}>FAQ</a>
            <a href={ROUTES.AUTH.LOGIN}>Login</a>
            <Button 
              size="sm" 
              onClick={() => window.location.href = ROUTES.AUTH.SIGNUP}
            >
              Start Free
            </Button>
          </NavLinks>
        </Nav>
      </Header>
      <main>{children}</main>
    </>
  );
}