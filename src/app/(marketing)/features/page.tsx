'use client';

import styled from 'styled-components';

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: ${({ theme }) => theme.spacing['3xl']} ${({ theme }) => theme.spacing.lg};
`;

const Title = styled.h1`
  font-size: ${({ theme }) => theme.typography.fontSize['4xl']};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  text-align: center;
`;

export default function FeaturesPage() {
  return (
    <Container>
      <Title>Features</Title>
      <p style={{ textAlign: 'center', color: '#6b7280' }}>
        Features page coming soon...
      </p>
    </Container>
  );
}