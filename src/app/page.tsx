'use client';

import styled from 'styled-components';
import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Spinner } from '@/components/ui/Spinner';
import { Modal } from '@/components/ui/Modal';

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

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSmallModalOpen, setIsSmallModalOpen] = useState(false);
  const [isLargeModalOpen, setIsLargeModalOpen] = useState(false);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);

  return (
    <Container>
      <Title>Rejectly.pro - Component Library</Title>
      
      <Section>
        <SectionTitle>Modals</SectionTitle>
        <ButtonGrid>
          <Button onClick={() => setIsModalOpen(true)}>
            Open Default Modal
          </Button>
          <Button variant="secondary" onClick={() => setIsSmallModalOpen(true)}>
            Open Small Modal
          </Button>
          <Button variant="secondary" onClick={() => setIsLargeModalOpen(true)}>
            Open Large Modal
          </Button>
          <Button variant="secondary" onClick={() => setIsFormModalOpen(true)}>
            Open Form Modal
          </Button>
        </ButtonGrid>

        {/* Default Modal */}
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Modal Title"
          description="This is a modal description"
        >
          <Modal.Body>
            <p>This is the modal content. You can put anything here!</p>
            <p>Click outside, press ESC, or click the X button to close.</p>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="ghost" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setIsModalOpen(false)}>
              Confirm
            </Button>
          </Modal.Footer>
        </Modal>

        {/* Small Modal */}
        <Modal
          isOpen={isSmallModalOpen}
          onClose={() => setIsSmallModalOpen(false)}
          title="Small Modal"
          size="sm"
        >
          <Modal.Body>
            <p>This is a small modal.</p>
          </Modal.Body>
          <Modal.Footer>
            <Button fullWidth onClick={() => setIsSmallModalOpen(false)}>
              Got it
            </Button>
          </Modal.Footer>
        </Modal>

        {/* Large Modal */}
        <Modal
          isOpen={isLargeModalOpen}
          onClose={() => setIsLargeModalOpen(false)}
          title="Large Modal with Long Content"
          description="This modal has a lot of content"
          size="lg"
        >
          <Modal.Body>
            <Card variant="bordered">
              <Card.Header>
                <Card.Title>Analysis Report</Card.Title>
                <Card.Description>Detailed CV analysis</Card.Description>
              </Card.Header>
              <Card.Content>
                <p>This is a large modal that can contain complex content like cards, tables, and more.</p>
                <div style={{ marginTop: '16px' }}>
                  <Badge variant="success">85% Match</Badge>
                  <Badge variant="info" style={{ marginLeft: '8px' }}>Senior Level</Badge>
                </div>
              </Card.Content>
            </Card>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setIsLargeModalOpen(false)}>
              Close
            </Button>
            <Button>Download Report</Button>
          </Modal.Footer>
        </Modal>

        {/* Form Modal */}
        <Modal
          isOpen={isFormModalOpen}
          onClose={() => setIsFormModalOpen(false)}
          title="Add Job Posting"
          description="Enter the job details to analyze"
        >
          <Modal.Body>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <Input
                label="Job Title"
                placeholder="e.g. Senior Frontend Developer"
                fullWidth
              />
              <Input
                label="Company"
                placeholder="e.g. TechCorp"
                fullWidth
              />
              <Input
                label="Job URL"
                type="url"
                placeholder="https://..."
                fullWidth
              />
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="ghost" onClick={() => setIsFormModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setIsFormModalOpen(false)}>
              Analyze
            </Button>
          </Modal.Footer>
        </Modal>
      </Section>

      <Section>
        <SectionTitle>Spinners</SectionTitle>
        <div style={{ display: 'flex', gap: '32px', alignItems: 'center' }}>
          <Spinner size="sm" />
          <Spinner size="md" />
          <Spinner size="lg" />
          <Spinner size="xl" />
        </div>
      </Section>
    </Container>
  );
}