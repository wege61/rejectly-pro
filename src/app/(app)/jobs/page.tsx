'use client';

import styled from 'styled-components';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { useToast } from '@/contexts/ToastContext';

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: ${({ theme }) => theme.spacing['2xl']};
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${({ theme }) => theme.spacing['2xl']};
`;

const HeaderContent = styled.div``;

const Title = styled.h1`
  font-size: ${({ theme }) => theme.typography.fontSize['3xl']};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const Subtitle = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const JobsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
`;

export default function JobsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [jobTitle, setJobTitle] = useState('');
  const [jobUrl, setJobUrl] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();

  const jobs: any[] = []; // Mock - gerçek data Supabase'den gelecek

  const handleAddJob = async () => {
    if (!jobTitle || (!jobUrl && !jobDescription)) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsLoading(true);
    try {
      // TODO: Save to Supabase
      toast.success('Job posting added successfully!');
      setIsModalOpen(false);
      setJobTitle('');
      setJobUrl('');
      setJobDescription('');
    } catch (error: any) {
      toast.error(error.message || 'Failed to add job posting');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container>
      <Header>
        <HeaderContent>
          <Title>Job Postings</Title>
          <Subtitle>Manage job postings to compare with your CV</Subtitle>
        </HeaderContent>
        <Button onClick={() => setIsModalOpen(true)}>
          Add Job Posting
        </Button>
      </Header>

      {jobs.length === 0 ? (
        <Card variant="bordered">
          <EmptyState
            icon={<EmptyState.InboxIcon />}
            title="No job postings yet"
            description="Add job postings to analyze and compare with your CV."
            action={{
              label: 'Add Job Posting',
              onClick: () => setIsModalOpen(true),
            }}
          />
        </Card>
      ) : (
        <JobsList>
          {/* Jobs will be listed here */}
        </JobsList>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add Job Posting"
        description="Enter job details or paste a job posting URL"
      >
        <Modal.Body>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <Input
              label="Job Title"
              placeholder="e.g. Senior Frontend Developer"
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              required
              fullWidth
            />
            <Input
              label="Job URL (Optional)"
              type="url"
              placeholder="https://..."
              value={jobUrl}
              onChange={(e) => setJobUrl(e.target.value)}
              helperText="We'll extract the job description automatically"
              fullWidth
            />
            <Textarea
              label="Or paste job description"
              placeholder="Paste the full job description here..."
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              rows={8}
              fullWidth
            />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="ghost" onClick={() => setIsModalOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleAddJob} isLoading={isLoading}>
            Add Job
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}