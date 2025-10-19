'use client';

import styled from 'styled-components';
import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Spinner } from '@/components/ui/Spinner';
import { useToast } from '@/contexts/ToastContext';
import { useAuth } from '@/hooks/useAuth';
import { getUserDocuments, deleteDocument, type Document } from '@/lib/supabase/documents';

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: ${({ theme }) => theme.spacing['2xl']};
`;

const Header = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing['2xl']};
`;

const Title = styled.h1`
  font-size: ${({ theme }) => theme.typography.fontSize['3xl']};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const Subtitle = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const UploadArea = styled.div`
  border: 2px dashed ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.lg};
  padding: ${({ theme }) => theme.spacing['3xl']};
  text-align: center;
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.normal};
  
  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
    background-color: ${({ theme }) => theme.colors.primaryLight};
  }
`;

const UploadIcon = styled.div`
  width: 64px;
  height: 64px;
  margin: 0 auto ${({ theme }) => theme.spacing.lg};
  color: ${({ theme }) => theme.colors.textTertiary};
  
  svg {
    width: 100%;
    height: 100%;
  }
`;

const UploadTitle = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const UploadSubtitle = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const HiddenInput = styled.input`
  display: none;
`;

const CVInfo = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: start;
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const CVTitle = styled.h3`
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

const CVDate = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const TextPreview = styled.div`
  background-color: ${({ theme }) => theme.colors.backgroundAlt};
  border-radius: ${({ theme }) => theme.radius.md};
  padding: ${({ theme }) => theme.spacing.md};
  max-height: 200px;
  overflow-y: auto;
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
  white-space: pre-wrap;
  word-wrap: break-word;
`;

export default function CVPage() {
  const [isUploading, setIsUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [cv, setCV] = useState<Document | null>(null);
  const toast = useToast();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      loadCV();
    }
  }, [user]);

  const loadCV = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const documents = await getUserDocuments(user.id, 'cv');
      if (documents.length > 0) {
        setCV(documents[0]);
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to load CV');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    // Validate file size
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      toast.error('File size must be less than 5MB');
      return;
    }

    const allowedTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/msword',
    ];

    if (!allowedTypes.includes(file.type)) {
      toast.error('Only PDF and DOCX files are allowed');
      return;
    }

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload-cv', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to upload CV');
      }

      setCV(data.document);
      toast.success('CV uploaded successfully!');
    } catch (error: any) {
      console.error('Upload error:', error);
      toast.error(error.message || 'Failed to upload CV');
    } finally {
      setIsUploading(false);
      e.target.value = '';
    }
  };

  const handleDelete = async () => {
    if (!cv) return;

    const confirmed = window.confirm('Are you sure you want to delete your CV?');
    if (!confirmed) return;

    try {
      await deleteDocument(cv.id);
      setCV(null);
      toast.success('CV deleted successfully');
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete CV');
    }
  };

  const handleUploadClick = () => {
    document.getElementById('cv-upload')?.click();
  };

  if (isLoading) {
    return (
      <Container>
        <Spinner centered />
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <Title>My CV</Title>
        <Subtitle>Upload and manage your CV for job matching analysis</Subtitle>
      </Header>

      {!cv ? (
        <Card variant="bordered">
          <UploadArea onClick={handleUploadClick}>
            <UploadIcon>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m6.75 12l-3-3m0 0l-3 3m3-3v6m-1.5-15H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
              </svg>
            </UploadIcon>
            <UploadTitle>Upload Your CV</UploadTitle>
            <UploadSubtitle>
              Click to upload or drag and drop<br />
              PDF or DOCX (max 5MB)
            </UploadSubtitle>
            <Button disabled={isUploading}>
              {isUploading ? 'Processing...' : 'Select File'}
            </Button>
          </UploadArea>
        
<HiddenInput
  id="cv-upload"
  type="file"
  accept=".pdf,.docx,.doc"  // ← PDF de kabul ediliyor
  onChange={handleFileSelect}
  disabled={isUploading}
/>
        </Card>
      ) : (
        <Card variant="elevated">
          <Card.Header>
            <CVInfo>
              <div>
                <CVTitle>{cv.title}</CVTitle>
                <CVDate>
                  Uploaded on {new Date(cv.created_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </CVDate>
              </div>
              <Badge variant="success">Active</Badge>
            </CVInfo>
          </Card.Header>
          <Card.Content>
            <div style={{ marginBottom: '16px' }}>
              <strong style={{ fontSize: '14px' }}>Preview:</strong>
            </div>
            <TextPreview>
              {cv.text.slice(0, 500)}...
            </TextPreview>
          </Card.Content>
          <Card.Footer>
            <Button variant="danger" onClick={handleDelete}>
              Delete
            </Button>
            <Button variant="secondary" onClick={handleUploadClick}>
              Replace CV
            </Button>
          </Card.Footer>
          <HiddenInput
            id="cv-upload"
            type="file"
            accept=".docx,.doc"
            onChange={handleFileSelect}
            disabled={isUploading}
          />
        </Card>
      )}
    </Container>
  );
}