'use client';

import styled from 'styled-components';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: ${({ theme }) => theme.spacing['2xl']};
`;

const Title = styled.h1`
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const Section = styled.section`
  margin-top: ${({ theme }) => theme.spacing.xl};
`;

const SectionTitle = styled.h2`
  font-size: ${({ theme }) => theme.typography.fontSize.xl};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const Grid = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.spacing.md};
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
`;

const ButtonGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.md};
`;

export default function Home() {
  return (
    <Container>
      <Title>Rejectly.pro - Component Library</Title>
      
      <Section>
        <SectionTitle>Buttons</SectionTitle>
        <ButtonGrid>
          <Button>Primary Button</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="danger">Danger</Button>
          <Button size="sm">Small</Button>
          <Button size="lg">Large</Button>
          <Button isLoading>Loading...</Button>
        </ButtonGrid>
      </Section>

      <Section>
        <SectionTitle>Inputs</SectionTitle>
        <Grid>
          <Input 
            label="Email" 
            placeholder="your@email.com" 
            type="email"
            helperText="We'll never share your email"
          />
          <Input 
            label="Password" 
            placeholder="Enter password" 
            type="password"
            error="Password is required"
          />
          <Input 
            label="Full Width"
            placeholder="This is full width"
            fullWidth
          />
        </Grid>
      </Section>

      <Section>
        <SectionTitle>Textarea</SectionTitle>
        <Textarea 
          label="Job Description"
          placeholder="Paste the job description here..."
          helperText="Maximum 5000 characters"
          fullWidth
        />
        <div style={{ marginTop: '16px' }}>
          <Textarea 
            label="With Error"
            placeholder="This has an error"
            error="This field cannot be empty"
            fullWidth
          />
        </div>
      </Section>
    </Container>
  );
}