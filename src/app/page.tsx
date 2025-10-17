'use client';

import styled from 'styled-components';
import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Modal } from '@/components/ui/Modal';
import { EmptyState } from '@/components/ui/EmptyState';
import { useToast } from '@/contexts/ToastContext';

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
  margin-top: ${({ theme }) => theme.spacing['2xl']};
`;

const SectionTitle = styled.h2`
  font-size: ${({ theme }) => theme.typography.fontSize.xl};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const ButtonGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.md};
`;

const Grid = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.spacing.lg};
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  
  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const toast = useToast();

  return (
    <Container>
      <Title>Rejectly.pro - Component Library</Title>
      
      <Section>
        <SectionTitle>Empty States</SectionTitle>
        <Grid>
          <Card variant="bordered">
            <EmptyState
              icon={<EmptyState.DocumentIcon />}
              title="No CV uploaded"
              description="Upload your CV to start analyzing job matches and get personalized recommendations."
              action={{
                label: 'Upload CV',
                onClick: () => toast.info('Upload CV clicked'),
              }}
            />
          </Card>

          <Card variant="bordered">
            <EmptyState
              icon={<EmptyState.FolderIcon />}
              title="No reports yet"
              description="Generate your first analysis report to see detailed insights."
              action={{
                label: 'Create Report',
                onClick: () => toast.info('Create Report clicked'),
              }}
            />
          </Card>

          <Card variant="bordered">
            <EmptyState
              icon={<EmptyState.InboxIcon />}
              title="No job postings"
              description="Add job postings to compare with your CV and see match scores."
              action={{
                label: 'Add Job',
                onClick: () => toast.info('Add Job clicked'),
              }}
            />
          </Card>

          <Card variant="bordered">
            <EmptyState
              icon={<EmptyState.SearchIcon />}
              title="No results found"
              description="Try adjusting your search criteria or filters."
            />
          </Card>
        </Grid>
      </Section>

      <Section>
        <SectionTitle>Empty State in Modal</SectionTitle>
        <Button onClick={() => setIsModalOpen(true)}>
          Open Modal with Empty State
        </Button>

        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Your Reports"
          size="lg"
        >
          <Modal.Body>
            <EmptyState
              icon={<EmptyState.DocumentIcon />}
              title="No reports available"
              description="Start by uploading your CV and adding job postings to generate your first analysis report."
              action={{
                label: 'Get Started',
                onClick: () => {
                  toast.success('Let\'s get started!');
                  setIsModalOpen(false);
                },
              }}
            />
          </Modal.Body>
        </Modal>
      </Section>

      <Section>
        <SectionTitle>Toast Notifications</SectionTitle>
        <ButtonGrid>
          <Button onClick={() => toast.success('İşlem başarıyla tamamlandı!')}>
            Success Toast
          </Button>
          <Button variant="danger" onClick={() => toast.error('Bir hata oluştu!')}>
            Error Toast
          </Button>
          <Button onClick={() => toast.warning('Dikkat! Bu işlem geri alınamaz.')}>
            Warning Toast
          </Button>
          <Button variant="secondary" onClick={() => toast.info('Yeni bildiriminiz var.')}>
            Info Toast
          </Button>
        </ButtonGrid>
      </Section>
    </Container>
  );
}