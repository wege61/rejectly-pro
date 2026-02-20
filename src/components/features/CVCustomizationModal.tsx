"use client";

import styled from "styled-components";
import { useState, useEffect, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Camera, Upload, UserX, Check, Loader2 } from "lucide-react";
import { COLOR_TEMPLATES } from "@/lib/pdf/colorTemplates";
import { CVCustomizationOptions } from "@/types/cvCustomization";

interface CVCustomizationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (options: CVCustomizationOptions) => void;
  onSkip: () => void;
  documentId?: string;
}

// --- Styled Components ---

const ModalContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg};

  @media (max-width: 640px) {
    gap: ${({ theme }) => theme.spacing.md};
  }
`;

const SectionTitle = styled.h3`
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.textPrimary};
  margin: 0 0 ${({ theme }) => theme.spacing.sm} 0;
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};

  svg {
    width: 18px;
    height: 18px;
    color: var(--accent);
  }
`;

const PhotoSection = styled.div`
  background: ${({ theme }) => theme.colors.surfaceHover};
  border-radius: ${({ theme }) => theme.radius.lg};
  padding: ${({ theme }) => theme.spacing.lg};

  @media (max-width: 640px) {
    padding: 14px;
  }
`;

const PhotoPreviewRow = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.lg};

  @media (max-width: 640px) {
    flex-direction: column;
    align-items: flex-start;
    gap: ${({ theme }) => theme.spacing.md};
  }
`;

const PhotoPreview = styled.div`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  overflow: hidden;
  border: 3px solid var(--accent);
  flex-shrink: 0;
  background: ${({ theme }) => theme.colors.surface};
  display: flex;
  align-items: center;
  justify-content: center;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  @media (max-width: 640px) {
    width: 90px;
    height: 90px;
    align-self: center;
  }
`;

const PhotoOptions = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
  flex: 1;
`;

const PhotoOption = styled.label<{ $isSelected: boolean }>`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  background: ${({ $isSelected }) =>
    $isSelected ? "var(--accent-light, rgba(99, 102, 241, 0.08))" : "transparent"};
  border: 1.5px solid ${({ $isSelected }) => ($isSelected ? "var(--accent)" : "transparent")};
  border-radius: ${({ theme }) => theme.radius.md};
  cursor: pointer;
  transition: all 0.15s ease;

  &:hover {
    background: ${({ $isSelected }) =>
      $isSelected ? "var(--accent-light, rgba(99, 102, 241, 0.12))" : "rgba(0,0,0,0.03)"};
  }

  input {
    display: none;
  }
`;

const RadioCircle = styled.span<{ $isSelected: boolean }>`
  width: 18px;
  height: 18px;
  border-radius: 50%;
  border: 2px solid ${({ $isSelected }) => ($isSelected ? "var(--accent)" : "var(--border-color)")};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: all 0.15s ease;

  &::after {
    content: "";
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: var(--accent);
    opacity: ${({ $isSelected }) => ($isSelected ? 1 : 0)};
    transition: opacity 0.15s ease;
  }
`;

const OptionLabel = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const DropzoneArea = styled.div<{ $isDragActive: boolean }>`
  border: 2px dashed
    ${({ $isDragActive }) => ($isDragActive ? "var(--accent)" : "var(--border-color)")};
  border-radius: ${({ theme }) => theme.radius.lg};
  padding: ${({ theme }) => theme.spacing.xl};
  text-align: center;
  cursor: pointer;
  transition: all 0.2s ease;
  background: ${({ $isDragActive }) =>
    $isDragActive ? "var(--accent-light, rgba(99, 102, 241, 0.05))" : "transparent"};

  &:hover {
    border-color: var(--accent);
    background: var(--accent-light, rgba(99, 102, 241, 0.03));
  }

  p {
    margin: ${({ theme }) => theme.spacing.sm} 0 0 0;
    font-size: ${({ theme }) => theme.typography.fontSize.sm};
    color: ${({ theme }) => theme.colors.textSecondary};
  }
`;

const LoadingState = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing.lg};
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};

  svg {
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
`;

const TemplateGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: ${({ theme }) => theme.spacing.md};

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

const TemplateCard = styled.div<{ $isSelected: boolean; $color: string }>`
  border: 2px solid
    ${({ $isSelected, $color }) => ($isSelected ? $color : "var(--border-color)")};
  border-radius: ${({ theme }) => theme.radius.lg};
  padding: ${({ theme }) => theme.spacing.md};
  cursor: pointer;
  transition: all 0.2s ease;
  background: ${({ theme }) => theme.colors.surface};
  position: relative;

  ${({ $isSelected, $color }) =>
    $isSelected &&
    `
    box-shadow: 0 0 0 3px ${$color}20;
  `}

  &:hover {
    border-color: ${({ $color }) => $color};
    transform: translateY(-1px);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  }
`;

const TemplateSwatch = styled.div<{ $color: string }>`
  width: 100%;
  height: 8px;
  border-radius: 4px;
  background: ${({ $color }) => $color};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const TemplateName = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.textPrimary};
  margin-bottom: 4px;
`;

const TemplateDescription = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  color: ${({ theme }) => theme.colors.textSecondary};
  line-height: 1.5;
`;

const SelectedBadge = styled.div<{ $color: string }>`
  position: absolute;
  top: 8px;
  right: 8px;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: ${({ $color }) => $color};
  display: flex;
  align-items: center;
  justify-content: center;

  svg {
    width: 14px;
    height: 14px;
    color: white;
  }
`;

type PhotoChoice = "extracted" | "upload" | "none";

export const CVCustomizationModal: React.FC<CVCustomizationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  onSkip,
  documentId,
}) => {
  const [photoChoice, setPhotoChoice] = useState<PhotoChoice>("none");
  const [extractedPhoto, setExtractedPhoto] = useState<string | null>(null);
  const [uploadedPhoto, setUploadedPhoto] = useState<string | null>(null);
  const [isExtractingPhoto, setIsExtractingPhoto] = useState(false);
  const [extractionDone, setExtractionDone] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState("classic-blue");

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setPhotoChoice("none");
      setExtractedPhoto(null);
      setUploadedPhoto(null);
      setExtractionDone(false);
      setSelectedTemplate("classic-blue");

      // Try to extract photo from PDF
      if (documentId) {
        extractPhoto(documentId);
      } else {
        setExtractionDone(true);
      }
    }
  }, [isOpen, documentId]);

  const extractPhoto = async (docId: string) => {
    setIsExtractingPhoto(true);
    try {
      const response = await fetch("/api/cv/extract-photo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ documentId: docId }),
      });

      if (response.ok) {
        const result = await response.json();
        if (result.found && result.photoBase64) {
          setExtractedPhoto(result.photoBase64);
          setPhotoChoice("extracted");
        }
      }
    } catch (error) {
      console.error("Failed to extract photo:", error);
    } finally {
      setIsExtractingPhoto(false);
      setExtractionDone(true);
    }
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setUploadedPhoto(reader.result as string);
        setPhotoChoice("upload");
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/jpeg": [".jpg", ".jpeg"],
      "image/png": [".png"],
    },
    maxSize: 2 * 1024 * 1024, // 2MB
    multiple: false,
  });

  const getCurrentPhoto = (): string | null => {
    if (photoChoice === "extracted") return extractedPhoto;
    if (photoChoice === "upload") return uploadedPhoto;
    return null;
  };

  const handleConfirm = () => {
    const photo = getCurrentPhoto();
    onConfirm({
      photoBase64: photo,
      colorTemplateKey: selectedTemplate,
    });
  };

  const displayPhoto = getCurrentPhoto();

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Customize Your CV"
      description="Choose your photo and color theme before generating."
      size="lg"
      showCloseButton={false}
      closeOnBackdropClick={false}
      closeOnEscape={false}
    >
      <Modal.Body>
        <ModalContent>
          {/* Photo Section */}
          <PhotoSection>
            <SectionTitle>
              <Camera /> Photo
            </SectionTitle>

            {isExtractingPhoto && !extractionDone ? (
              <LoadingState>
                <Loader2 size={18} />
                Extracting photo from your CV...
              </LoadingState>
            ) : (
              <PhotoPreviewRow>
                {displayPhoto && (
                  <PhotoPreview>
                    <img src={displayPhoto} alt="CV Photo" />
                  </PhotoPreview>
                )}

                <PhotoOptions>
                  {extractedPhoto && (
                    <PhotoOption
                      $isSelected={photoChoice === "extracted"}
                      onClick={() => setPhotoChoice("extracted")}
                    >
                      <input
                        type="radio"
                        name="photoChoice"
                        checked={photoChoice === "extracted"}
                        onChange={() => setPhotoChoice("extracted")}
                      />
                      <RadioCircle $isSelected={photoChoice === "extracted"} />
                      <OptionLabel>Use This Photo</OptionLabel>
                    </PhotoOption>
                  )}

                  <PhotoOption
                    $isSelected={photoChoice === "upload"}
                    onClick={() => setPhotoChoice("upload")}
                  >
                    <input
                      type="radio"
                      name="photoChoice"
                      checked={photoChoice === "upload"}
                      onChange={() => setPhotoChoice("upload")}
                    />
                    <RadioCircle $isSelected={photoChoice === "upload"} />
                    <OptionLabel>Upload Different Photo</OptionLabel>
                  </PhotoOption>

                  <PhotoOption
                    $isSelected={photoChoice === "none"}
                    onClick={() => setPhotoChoice("none")}
                  >
                    <input
                      type="radio"
                      name="photoChoice"
                      checked={photoChoice === "none"}
                      onChange={() => setPhotoChoice("none")}
                    />
                    <RadioCircle $isSelected={photoChoice === "none"} />
                    <OptionLabel>No Photo</OptionLabel>
                  </PhotoOption>

                  {photoChoice === "upload" && (
                    <DropzoneArea
                      {...getRootProps()}
                      $isDragActive={isDragActive}
                    >
                      <input {...getInputProps()} />
                      <Upload size={24} color="var(--accent)" />
                      <p>
                        {isDragActive
                          ? "Drop your photo here..."
                          : uploadedPhoto
                          ? "Click or drag to replace"
                          : "Click or drag to upload (JPG/PNG, max 2MB)"}
                      </p>
                    </DropzoneArea>
                  )}
                </PhotoOptions>
              </PhotoPreviewRow>
            )}
          </PhotoSection>

          {/* Color Template Section */}
          <div>
            <SectionTitle>Color Theme</SectionTitle>
            <TemplateGrid>
              {COLOR_TEMPLATES.map((template) => (
                <TemplateCard
                  key={template.key}
                  $isSelected={selectedTemplate === template.key}
                  $color={template.colors.primary}
                  onClick={() => setSelectedTemplate(template.key)}
                >
                  {selectedTemplate === template.key && (
                    <SelectedBadge $color={template.colors.primary}>
                      <Check />
                    </SelectedBadge>
                  )}
                  <TemplateSwatch $color={template.colors.primary} />
                  <TemplateName>{template.name}</TemplateName>
                  <TemplateDescription>{template.description}</TemplateDescription>
                </TemplateCard>
              ))}
            </TemplateGrid>
          </div>
        </ModalContent>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="ghost" onClick={onSkip}>
          Skip
        </Button>
        <Button variant="primary" onClick={handleConfirm}>
          Continue
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
