'use client';

import styled from 'styled-components';

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: ${({ theme }) => theme.spacing['2xl']};
`;

const Title = styled.h1`
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const Description = styled.p`
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
`;

export default function Home() {
  return (
    <Container>
      <Title>Rejectly.pro</Title>
      <Description>
        AI destekli CV & ilan uyum analizi - Theme sistemi çalışıyor! 🎨
      </Description>
    </Container>
  );
}