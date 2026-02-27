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
  existingPhotoUrl?: string | null;
  existingPhotoBase64?: string | null;
  initialTemplate?: string;
}

// --- Styled Components ---

const ModalContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;

  @media (max-width: 640px) {
    gap: 16px;
  }
`;

const SectionTitle = styled.h3`
  font-size: 16px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.95);
  margin: 0 0 12px 0;
  display: flex;
  align-items: center;
  gap: 8px;

  svg {
    width: 18px;
    height: 18px;
    color: var(--accent);
  }
`;

const PhotoSection = styled.div`
  background: rgba(30, 30, 40, 0.4);
  backdrop-filter: blur(20px) saturate(140%);
  -webkit-backdrop-filter: blur(20px) saturate(140%);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 20px;
  padding: 24px;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.05), 0 4px 16px rgba(0, 0, 0, 0.2);

  @media (max-width: 640px) {
    padding: 16px;
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
  gap: 10px;
  flex: 1;
`;

const PhotoOption = styled.label<{ $isSelected: boolean }>`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  background: ${({ $isSelected }) =>
    $isSelected ? "rgba(var(--accent-rgb), 0.12)" : "rgba(255,255,255,0.03)"};
  border: 1px solid ${({ $isSelected }) => ($isSelected ? "rgba(var(--accent-rgb), 0.5)" : "rgba(255,255,255,0.08)")};
  border-radius: 14px;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
  backdrop-filter: blur(10px);

  ${({ $isSelected }) =>
    $isSelected &&
    `
    box-shadow: 0 0 12px rgba(var(--accent-rgb), 0.2), inset 0 1px 0 rgba(255,255,255,0.1);
  `}

  &:hover {
    background: ${({ $isSelected }) =>
      $isSelected ? "rgba(var(--accent-rgb), 0.16)" : "rgba(255,255,255,0.06)"};
    border-color: ${({ $isSelected }) => ($isSelected ? "rgba(var(--accent-rgb), 0.6)" : "rgba(255,255,255,0.12)")};
    transform: translateY(-1px);
  }

  input {
    display: none;
  }
`;

const RadioCircle = styled.span<{ $isSelected: boolean }>`
  width: 18px;
  height: 18px;
  border-radius: 50%;
  border: 2px solid ${({ $isSelected }) => ($isSelected ? "var(--accent)" : "rgba(255,255,255,0.3)")};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: all 0.2s ease;
  background: ${({ $isSelected }) => ($isSelected ? "rgba(var(--accent-rgb), 0.2)" : "rgba(0,0,0,0.2)")};

  &::after {
    content: "";
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: var(--accent);
    opacity: ${({ $isSelected }) => ($isSelected ? 1 : 0)};
    transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
    transform: scale(${({ $isSelected }) => ($isSelected ? 1 : 0.5)});
  }
`;

const OptionLabel = styled.span`
  font-size: 14px;
  font-weight: 500;
  color: rgba(255,255,255,0.9);
`;

const DropzoneArea = styled.div<{ $isDragActive: boolean }>`
  border: 1.5px dashed
    ${({ $isDragActive }) => ($isDragActive ? "rgba(var(--accent-rgb), 0.8)" : "rgba(255,255,255,0.15)")};
  border-radius: 16px;
  padding: 24px;
  text-align: center;
  cursor: pointer;
  transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
  background: ${({ $isDragActive }) =>
    $isDragActive ? "rgba(var(--accent-rgb), 0.08)" : "rgba(255,255,255,0.02)"};
  backdrop-filter: blur(10px);

  &:hover {
    border-color: rgba(var(--accent-rgb), 0.6);
    background: rgba(var(--accent-rgb), 0.05);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  }

  p {
    margin: 12px 0 0 0;
    font-size: 13px;
    color: rgba(255,255,255,0.6);
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
  gap: 16px;

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

const TemplateCard = styled.div<{ $isSelected: boolean; $color: string }>`
  border: 1.5px solid
    ${({ $isSelected, $color }) => ($isSelected ? $color : "rgba(255,255,255,0.08)")};
  border-radius: 16px;
  padding: 16px;
  cursor: pointer;
  transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
  background: rgba(30,30,40,0.5);
  position: relative;
  backdrop-filter: blur(10px);

  ${({ $isSelected, $color }) =>
    $isSelected &&
    `
    background: rgba(255,255,255,0.04);
    box-shadow: 0 0 20px ${$color}25, inset 0 1px 0 rgba(255,255,255,0.1);
    transform: translateY(-2px);
  `}

  &:hover {
    border-color: ${({ $color, $isSelected }) => ($isSelected ? $color : "rgba(255,255,255,0.2)")};
    background: rgba(255,255,255,0.06);
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
  }
`;

const TemplateSwatch = styled.div<{ $color: string }>`
  width: 100%;
  height: 8px;
  border-radius: 4px;
  background: ${({ $color }) => $color};
  margin-bottom: 12px;
  box-shadow: 0 2px 6px ${({ $color }) => $color}40;
`;

const TemplateName = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: rgba(255,255,255,0.95);
  margin-bottom: 4px;
`;

const TemplateDescription = styled.div`
  font-size: 12px;
  color: rgba(255,255,255,0.55);
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

const GlassPrimaryButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 12px 28px;
  border-radius: 9999px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  letter-spacing: -0.01em;
  border: none;
  color: white;
  transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
  background: linear-gradient(135deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 100%), var(--accent);
  box-shadow: inset 0 1.5px 0 rgba(255,255,255,0.4), 0 8px 24px rgba(var(--accent-rgb), 0.4);

  &:hover {
    transform: translateY(-2px);
    box-shadow: inset 0 1.5px 0 rgba(255,255,255,0.5), 0 12px 32px rgba(var(--accent-rgb), 0.5);
  }
  
  &:active {
    transform: scale(0.98);
  }

  svg {
    width: 18px;
    height: 18px;
  }
`;

const GlassSecondaryButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  border-radius: 9999px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  letter-spacing: -0.01em;
  color: rgba(255,255,255,0.7);
  border: 1px solid rgba(255,255,255,0.12);
  background: rgba(255,255,255,0.05);
  backdrop-filter: blur(16px);
  transition: all 0.2s ease;

  &:hover {
    color: rgba(255,255,255,0.95);
    background: rgba(255,255,255,0.1);
    border-color: rgba(255,255,255,0.25);
  }
`;

type PhotoChoice = "existing" | "extracted" | "upload" | "none";

export const CVCustomizationModal: React.FC<CVCustomizationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  onSkip,
  documentId,
  existingPhotoUrl,
  existingPhotoBase64,
  initialTemplate,
}) => {
  const [photoChoice, setPhotoChoice] = useState<PhotoChoice>("none");
  const [extractedPhoto, setExtractedPhoto] = useState<string | null>(null);
  const [uploadedPhoto, setUploadedPhoto] = useState<string | null>(null);
  const [isExtractingPhoto, setIsExtractingPhoto] = useState(false);
  const [extractionDone, setExtractionDone] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState("classic-blue");

  // Reset state when modal opens or existing photo data changes
  useEffect(() => {
    if (isOpen) {
      if (existingPhotoBase64 || existingPhotoUrl) {
        setPhotoChoice("existing");
      } else if (photoChoice === "existing") {
        setPhotoChoice("none");
      }
      setExtractedPhoto(null);
      setUploadedPhoto(null);
      setExtractionDone(false);
      setSelectedTemplate(initialTemplate || "classic-blue");

      // Try to extract photo from PDF
      if (documentId) {
        extractPhoto(documentId);
      } else {
        setExtractionDone(true);
      }
    }
  }, [isOpen, documentId, existingPhotoBase64, existingPhotoUrl]);

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
          if (!existingPhotoUrl && !existingPhotoBase64) {
            setPhotoChoice("extracted");
          }
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
    if (photoChoice === "existing") return existingPhotoBase64 || existingPhotoUrl || null;
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
                  {(existingPhotoBase64 || existingPhotoUrl) && (
                    <PhotoOption
                      $isSelected={photoChoice === "existing"}
                      onClick={() => setPhotoChoice("existing")}
                    >
                      <input
                        type="radio"
                        name="photoChoice"
                        checked={photoChoice === "existing"}
                        onChange={() => setPhotoChoice("existing")}
                      />
                      <RadioCircle $isSelected={photoChoice === "existing"} />
                      <OptionLabel>Use Current Photo</OptionLabel>
                    </PhotoOption>
                  )}

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
                      <OptionLabel>Use Photo from Original CV</OptionLabel>
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
        <GlassSecondaryButton onClick={onSkip}>
          Skip Customization
        </GlassSecondaryButton>
        <GlassPrimaryButton onClick={handleConfirm}>
          Save & Optimize
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <polyline points="16 16 12 12 8 16"/>
            <line x1="12" y1="12" x2="12" y2="21"/>
            <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 0 1 0 3 16.3"/>
          </svg>
        </GlassPrimaryButton>
      </Modal.Footer>
    </Modal>
  );
};
