"use client";

import styled, { keyframes } from "styled-components";
import React, { useRef, useState } from "react";
import { motion } from "motion/react";
import { useDropzone } from "react-dropzone";

// Icons
const UploadIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="17 8 12 3 7 8" />
    <line x1="12" y1="3" x2="12" y2="15" />
  </svg>
);

// Animation variants
const mainVariant = {
  initial: {
    x: 0,
    y: 0,
  },
  animate: {
    x: 20,
    y: -20,
    opacity: 0.9,
  },
};

const secondaryVariant = {
  initial: {
    opacity: 0,
  },
  animate: {
    opacity: 1,
  },
};

// Styled Components
const UploadWrapper = styled.div`
  width: 100%;
`;

const UploadContainer = styled(motion.div)`
  padding: 40px;
  display: block;
  border-radius: 12px;
  cursor: pointer;
  width: 100%;
  position: relative;
  overflow: hidden;
  background: var(--bg-color);
  border: 2px dashed var(--border-color);
  transition: all 0.3s ease;

  &:hover {
    border-color: var(--primary-500);
    background: linear-gradient(135deg, rgba(var(--primary-500-rgb), 0.05) 0%, rgba(var(--primary-500-rgb), 0.08) 100%);
  }
`;

const GridPatternContainer = styled.div`
  position: absolute;
  inset: 0;
  mask-image: radial-gradient(ellipse at center, white, transparent);
  -webkit-mask-image: radial-gradient(ellipse at center, white, transparent);
  pointer-events: none;
`;

const GridPatternInner = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  gap: 1px;
  transform: scale(1.05);
  background: var(--bg-color);
`;

const GridCell = styled.div<{ $isEven: boolean }>`
  width: 40px;
  height: 40px;
  flex-shrink: 0;
  border-radius: 2px;
  background: ${({ $isEven }) => $isEven ? 'var(--bg-alt)' : 'var(--bg-alt)'};
  box-shadow: ${({ $isEven }) => !$isEven ? 'inset 0 0 1px 3px var(--bg-color)' : 'none'};
`;

const ContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  z-index: 10;
`;

const UploadTitle = styled.p`
  font-weight: 700;
  font-size: 16px;
  color: var(--text-color);
`;

const UploadDescription = styled.p`
  font-weight: 400;
  font-size: 14px;
  color: var(--text-secondary);
  margin-top: 8px;
`;

const FilePreviewContainer = styled.div`
  position: relative;
  width: 100%;
  margin-top: 40px;
  max-width: 560px;
  margin-left: auto;
  margin-right: auto;
`;

const FileCard = styled(motion.div)`
  position: relative;
  overflow: hidden;
  z-index: 40;
  background: var(--bg-alt);
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  padding: 16px;
  margin-top: 16px;
  width: 100%;
  margin-left: auto;
  margin-right: auto;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  border: 1px solid var(--border-color);
`;

const FileHeader = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  align-items: center;
  gap: 16px;
`;

const FileName = styled(motion.p)`
  font-size: 16px;
  color: var(--text-color);
  font-weight: 500;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 320px;
`;

const FileSize = styled(motion.p)`
  border-radius: 8px;
  padding: 4px 8px;
  flex-shrink: 0;
  font-size: 14px;
  color: var(--text-secondary);
  background: var(--bg-color);
`;

const FileMeta = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 100%;
  margin-top: 8px;
  justify-content: space-between;
  color: var(--text-secondary);
  font-size: 14px;

  @media (min-width: 768px) {
    flex-direction: row;
    align-items: center;
  }
`;

const FileType = styled(motion.p)`
  padding: 2px 8px;
  border-radius: 6px;
  background: var(--bg-color);
`;

const FileDate = styled(motion.p)`
  color: var(--text-secondary);
`;

const FileActions = styled(motion.div)`
  display: flex;
  gap: 8px;
  margin-top: 12px;
  width: 100%;
`;

const FileActionButton = styled.button<{ $variant?: "primary" | "danger" }>`
  flex: 1;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 8px 14px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;
  background: var(--bg-color);
  color: ${({ $variant }) => $variant === "danger" ? "#ef4444" : "var(--text-color)"};

  &:hover {
    background: ${({ $variant }) => $variant === "danger" ? "rgba(239, 68, 68, 0.1)" : "var(--bg-alt)"};
  }

  svg {
    width: 14px;
    height: 14px;
  }
`;

const RefreshIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 2v6h-6" />
    <path d="M3 12a9 9 0 0 1 15-6.7L21 8" />
    <path d="M3 22v-6h6" />
    <path d="M21 12a9 9 0 0 1-15 6.7L3 16" />
  </svg>
);

const XIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const UploadIconBox = styled(motion.div)<{ $isDragActive: boolean }>`
  position: relative;
  z-index: 40;
  background: var(--bg-alt);
  display: flex;
  align-items: center;
  justify-content: center;
  height: 128px;
  margin-top: 16px;
  width: 100%;
  max-width: 128px;
  margin-left: auto;
  margin-right: auto;
  border-radius: 12px;
  box-shadow: 0 10px 50px rgba(0, 0, 0, 0.1);
  border: 1px solid var(--border-color);
  transition: box-shadow 0.3s ease;

  ${UploadContainer}:hover & {
    box-shadow: 0 25px 50px rgba(0, 0, 0, 0.15);
  }

  svg {
    width: 24px;
    height: 24px;
    color: var(--text-secondary);
  }
`;

const DropText = styled(motion.p)`
  color: var(--text-secondary);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  font-size: 14px;
`;

const DashedBorder = styled(motion.div)`
  position: absolute;
  opacity: 0;
  border: 2px dashed var(--primary-500);
  inset: 0;
  z-index: 30;
  background: transparent;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 128px;
  margin-top: 16px;
  width: 100%;
  max-width: 128px;
  margin-left: auto;
  margin-right: auto;
  border-radius: 12px;
`;

const HiddenInput = styled.input`
  display: none;
`;

// Grid Pattern Component
function GridPattern() {
  const columns = 41;
  const rows = 11;
  return (
    <GridPatternInner>
      {Array.from({ length: rows }).map((_, row) =>
        Array.from({ length: columns }).map((_, col) => {
          const index = row * columns + col;
          return (
            <GridCell
              key={`${col}-${row}`}
              $isEven={index % 2 === 0}
            />
          );
        })
      )}
    </GridPatternInner>
  );
}

// FileUpload Component
interface FileUploadProps {
  onChange?: (files: File[]) => void;
  onRemove?: () => void;
  accept?: string;
}

export function FileUpload({ onChange, onRemove, accept }: FileUploadProps) {
  const [files, setFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (newFiles: File[]) => {
    // Replace files instead of accumulating (single file mode)
    setFiles(newFiles);
    onChange && onChange(newFiles);
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    setFiles([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    onRemove && onRemove();
  };

  const handleChangeFile = (e: React.MouseEvent) => {
    e.stopPropagation();
    fileInputRef.current?.click();
  };

  const handleClick = () => {
    if (files.length === 0) {
      fileInputRef.current?.click();
    }
  };

  const { getRootProps, isDragActive } = useDropzone({
    multiple: false,
    noClick: true,
    onDrop: handleFileChange,
    onDropRejected: (error) => {
      console.log(error);
    },
  });

  return (
    <UploadWrapper {...getRootProps()}>
      <UploadContainer
        onClick={handleClick}
        whileHover="animate"
      >
        <HiddenInput
          ref={fileInputRef}
          type="file"
          accept={accept || ".pdf,.docx"}
          onChange={(e) => handleFileChange(Array.from(e.target.files || []))}
        />
        <GridPatternContainer>
          <GridPattern />
        </GridPatternContainer>
        <ContentContainer>
          <UploadTitle>Upload file</UploadTitle>
          <UploadDescription>
            Drag or drop your files here or click to upload
          </UploadDescription>
          <FilePreviewContainer>
            {files.length > 0 &&
              files.map((file, idx) => (
                <FileCard
                  key={"file" + idx}
                  layoutId={idx === 0 ? "file-upload" : "file-upload-" + idx}
                >
                  <FileHeader>
                    <FileName
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      layout
                    >
                      {file.name}
                    </FileName>
                    <FileSize
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      layout
                    >
                      {(file.size / (1024 * 1024)).toFixed(2)} MB
                    </FileSize>
                  </FileHeader>

                  <FileMeta>
                    <FileType
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      layout
                    >
                      {file.type || "document"}
                    </FileType>

                    <FileDate
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      layout
                    >
                      modified {new Date(file.lastModified).toLocaleDateString()}
                    </FileDate>
                  </FileMeta>
                  <FileActions
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    <FileActionButton onClick={handleChangeFile}>
                      <RefreshIcon />
                      Change File
                    </FileActionButton>
                    <FileActionButton $variant="danger" onClick={handleRemove}>
                      <XIcon />
                      Remove
                    </FileActionButton>
                  </FileActions>
                </FileCard>
              ))}
            {!files.length && (
              <UploadIconBox
                layoutId="file-upload"
                variants={mainVariant}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 20,
                }}
                $isDragActive={isDragActive}
              >
                {isDragActive ? (
                  <DropText
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    Drop it
                    <UploadIcon />
                  </DropText>
                ) : (
                  <UploadIcon />
                )}
              </UploadIconBox>
            )}

            {!files.length && (
              <DashedBorder variants={secondaryVariant} />
            )}
          </FilePreviewContainer>
        </ContentContainer>
      </UploadContainer>
    </UploadWrapper>
  );
}

export { GridPattern };
