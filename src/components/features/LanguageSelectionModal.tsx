"use client";

import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { SUPPORTED_LANGUAGES } from "@/lib/languageUtils";

const LanguageGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(130px, 1fr));
  gap: 12px;
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
  max-height: 400px;
  overflow-y: auto;
  padding: 4px;
  
  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 4px;
  }
`;

const LanguageCard = styled(motion.button)<{ $active: boolean; $detected: boolean }>`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 16px 12px;
  background: ${({ $active }) => $active ? 'rgba(53, 162, 159, 0.15)' : 'rgba(255, 255, 255, 0.03)'};
  border: 1px solid ${({ $active }) => $active ? 'rgba(53, 162, 159, 0.5)' : 'rgba(255, 255, 255, 0.08)'};
  border-radius: 16px;
  color: ${({ $active }) => $active ? '#fff' : 'rgba(255, 255, 255, 0.6)'};
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  overflow: hidden;

  &:hover {
    background: ${({ $active }) => $active ? 'rgba(53, 162, 159, 0.2)' : 'rgba(255, 255, 255, 0.08)'};
    border-color: ${({ $active }) => $active ? 'rgba(53, 162, 159, 0.7)' : 'rgba(255, 255, 255, 0.2)'};
    color: #fff;
    transform: translateY(-2px);
  }

  ${({ $active }) => $active && `
    box-shadow: 0 8px 24px rgba(53, 162, 159, 0.2);
  `}
`;

const DetectedBadge = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  background: linear-gradient(135deg, rgba(53, 162, 159, 0.9) 0%, rgba(11, 102, 106, 0.9) 100%);
  color: white;
  font-size: 10px;
  font-weight: 700;
  padding: 2px 8px;
  border-bottom-left-radius: 8px;
  letter-spacing: 0.5px;
`;

const ModalHeader = styled.div`
  text-align: center;
  margin-bottom: 24px;
`;

const Title = styled.h2`
  font-size: 24px;
  font-weight: 600;
  color: white;
  margin-bottom: 8px;
`;

const Description = styled.p`
  font-size: 14px;
  color: rgba(255, 255, 255, 0.6);
`;

const Actions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 24px;
  padding-top: 16px;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
`;

interface LanguageSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (language: string) => void;
  detectedLanguage?: string | null;
  selectedLanguage: string;
  setSelectedLanguage: (lang: string) => void;
  isGenerating?: boolean;
}

export function LanguageSelectionModal({
  isOpen,
  onClose,
  onConfirm,
  detectedLanguage,
  selectedLanguage,
  setSelectedLanguage,
  isGenerating = false,
}: LanguageSelectionModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md">
      <Modal.Body>
        <ModalHeader>
          <Title>Select Resume Language</Title>
          <Description>
            Choose the language for your AI-optimized resume. 
            {detectedLanguage && " We've auto-selected the recommended language based on your original CV."}
          </Description>
        </ModalHeader>

        <LanguageGrid>
          {SUPPORTED_LANGUAGES.map((lang) => {
            const isActive = selectedLanguage === lang.code;
            const isDetected = detectedLanguage === lang.code;
            return (
              <LanguageCard
                key={lang.code}
                $active={isActive}
                $detected={isDetected}
                onClick={() => setSelectedLanguage(lang.code)}
                whileTap={{ scale: 0.95 }}
              >
                {isDetected && <DetectedBadge>RECOMMENDED</DetectedBadge>}
                <span style={{ fontSize: '16px', fontWeight: isActive ? 600 : 500 }}>
                  {lang.name}
                </span>
              </LanguageCard>
            );
          })}
        </LanguageGrid>

        <Actions>
          <Button variant="glass-secondary" onClick={onClose} disabled={isGenerating}>
            Cancel
          </Button>
          <Button 
            variant="glass-primary" 
            onClick={() => onConfirm(selectedLanguage)}
            disabled={isGenerating}
          >
            {isGenerating ? "Starting..." : "Generate Resume"}
          </Button>
        </Actions>
      </Modal.Body>
    </Modal>
  );
}
