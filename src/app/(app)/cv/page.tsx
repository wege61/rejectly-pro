"use client";

import styled from "styled-components";
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/contexts/ToastContext";
import { Spinner } from "@/components/ui/Spinner";
import { CVListSkeleton } from "@/components/skeletons/CVListSkeleton";
import { useAuth } from "@/hooks/useAuth";
import { createClient } from "@/lib/supabase/client";

interface CVDocument {
  id: string;
  user_id: string;
  type: string;
  title: string;
  text: string;
  file_url: string;
  lang: string;
  created_at: string;
  updated_at: string;
}

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: ${({ theme }) => theme.spacing["2xl"]};
`;

const Header = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing["2xl"]};
`;

const Title = styled.h1`
  font-size: ${({ theme }) => theme.typography.fontSize["3xl"]};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const Subtitle = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const UploadArea = styled.div`
  border: 2px dashed ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.lg};
  padding: ${({ theme }) => theme.spacing["3xl"]};
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

const PreviewPanel = styled.div`
  margin-top: ${({ theme }) => theme.spacing.lg};
  padding: ${({ theme }) => theme.spacing.lg};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.md};
  background-color: ${({ theme }) => theme.colors.surface};
  max-height: 400px;
  overflow-y: auto;
`;

const PreviewTitle = styled.h4`
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.textPrimary};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const EditablePreview = styled.textarea`
  width: 100%;
  min-height: 300px;
  padding: ${({ theme }) => theme.spacing.md};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.sm};
  background-color: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.textPrimary};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  resize: vertical;
  font-family: monospace;
  line-height: 1.6;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const CharCount = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
  text-align: right;
  margin-top: ${({ theme }) => theme.spacing.xs};
`;

export default function CVPage() {
  const [isUploading, setIsUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [cvDocument, setCvDocument] = useState<CVDocument | null>(null);
  const [editedText, setEditedText] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const toast = useToast();
  const { user } = useAuth();

  // Fetch existing CV
  useEffect(() => {
    async function fetchCV() {
      if (!user) return;

      const supabase = createClient();
      const { data } = await supabase
        .from("documents")
        .select("*")
        .eq("user_id", user.id)
        .eq("type", "cv")
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (data) {
        setCvDocument(data);
        setEditedText(data.text);
      }

      setIsLoading(false);
    }

    fetchCV();
  }, [user]);

  const handleSaveChanges = async () => {
    if (!cvDocument) return;

    setIsSaving(true);
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from("documents")
        .update({ text: editedText })
        .eq("id", cvDocument.id);

      if (error) throw error;

      toast.success("CV updated successfully!");
      setCvDocument({ ...cvDocument, text: editedText });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to update CV";
      toast.error(errorMessage);
    } finally {
      setIsSaving(false);
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);

    try {
      // If replacing existing CV, delete old one first
      if (cvDocument) {
        const supabase = createClient();
        const { error: deleteError } = await supabase
          .from("documents")
          .delete()
          .eq("id", cvDocument.id);

        if (deleteError) {
          console.error("Failed to delete old CV:", deleteError);
          // Continue anyway to upload new one
        }
      }

      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/cv/upload", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Upload failed");
      }

      const successMessage = cvDocument
        ? "CV replaced successfully!"
        : "CV uploaded successfully! Your resume has been processed. Now add job postings to analyze.";
      toast.success(successMessage);

      // Refresh CV data
      const supabase = createClient();
      const { data } = await supabase
        .from("documents")
        .select("*")
        .eq("id", result.document.id)
        .single();

      if (data) {
        setCvDocument(data);
        setEditedText(data.text);
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Upload failed";
      toast.error(errorMessage);
    } finally {
      setIsUploading(false);
      // Reset input
      e.target.value = "";
    }
  };

  const handleUploadClick = () => {
    document.getElementById("cv-upload")?.click();
  };

  const handleDelete = async () => {
    if (!cvDocument) return;

    try {
      const supabase = createClient();
      const { error: deleteError } = await supabase
        .from("documents")
        .delete()
        .eq("id", cvDocument.id);

      if (deleteError) throw deleteError;

      toast.success("CV deleted successfully");
      setCvDocument(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to delete CV";
      toast.error(errorMessage);
    }
  };

  if (isLoading) {
    return <CVListSkeleton />;
  }

  return (
    <Container>
      <Header>
        <Title>My CV</Title>
        <Subtitle>Upload and manage your CV for job matching analysis</Subtitle>
      </Header>

      {!cvDocument ? (
        <Card variant="bordered">
          <UploadArea onClick={handleUploadClick}>
            <UploadIcon>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m6.75 12l-3-3m0 0l-3 3m3-3v6m-1.5-15H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
                />
              </svg>
            </UploadIcon>
            <UploadTitle>
              {isUploading ? "Uploading..." : "Upload Your CV"}
            </UploadTitle>
            <UploadSubtitle>
              Click to upload or drag and drop
              <br />
              PDF or DOCX (max 5MB)
            </UploadSubtitle>
            {isUploading ? <Spinner /> : <Button>Select File</Button>}
          </UploadArea>
          <HiddenInput
            id="cv-upload"
            type="file"
            accept=".pdf,.docx"
            onChange={handleFileSelect}
            disabled={isUploading}
          />
        </Card>
      ) : (
        <Card variant="elevated">
          <Card.Header>
            <Card.Title>{cvDocument.title}</Card.Title>
            <Card.Description>
              Uploaded on{" "}
              {new Date(cvDocument.created_at).toLocaleDateString("tr-TR")}
            </Card.Description>
          </Card.Header>
          <Card.Content>
            <p style={{ color: "#6b7280", fontSize: "14px" }}>
              Text length: {cvDocument.text.length.toLocaleString()} characters
            </p>
            <p style={{ color: "#6b7280", fontSize: "14px", marginTop: "8px" }}>
              Language: {cvDocument.lang === "tr" ? "Turkish" : "English"}
            </p>

            {/* Preview and Edit Panel */}
            <PreviewPanel>
              <PreviewTitle>CV Content</PreviewTitle>
              <EditablePreview
                value={editedText}
                onChange={(e) => setEditedText(e.target.value)}
                placeholder="CV content will appear here..."
              />
              <CharCount>{editedText.length} characters</CharCount>
              {editedText !== cvDocument.text && (
                <div style={{ marginTop: "12px", display: "flex", gap: "8px", justifyContent: "flex-end" }}>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setEditedText(cvDocument.text)}
                  >
                    Discard Changes
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleSaveChanges}
                    isLoading={isSaving}
                  >
                    Save Changes
                  </Button>
                </div>
              )}
            </PreviewPanel>
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
            accept=".pdf,.docx"
            onChange={handleFileSelect}
            disabled={isUploading}
          />
        </Card>
      )}
    </Container>
  );
}
