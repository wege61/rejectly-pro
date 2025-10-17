'use client';

import styled from 'styled-components';
import { Button } from '@/components/ui/Button';

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: ${({ theme }) => theme.spacing['2xl']};
`;

const Title = styled.h1`
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const ButtonGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.md};
  margin-top: ${({ theme }) => theme.spacing.xl};
`;

export default function Home() {
  return (
    <Container>
      <Title>Rejectly.pro - Component Test</Title>
      
      <ButtonGrid>
        <Button>Primary Button</Button>
        <Button variant="secondary">Secondary Button</Button>
        <Button variant="ghost">Ghost Button</Button>
        <Button variant="danger">Danger Button</Button>
        <Button size="sm">Small</Button>
        <Button size="lg">Large</Button>
        <Button isLoading>Loading...</Button>
        <Button disabled>Disabled</Button>
      </ButtonGrid>
    </Container>
  );
}