"use client";

import styled from "styled-components";
import { useState, useEffect } from "react";
import { Modal } from "@/components/ui/Modal";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight } from "lucide-react";

interface MetricQuestion {
  id: string;
  original_bullet: string;
  question: string;
  options?: string[];
}

interface MetricQuestionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (userMetrics: Record<string, string>) => void;
  onSkip: () => void;
  metricQuestions?: MetricQuestion[] | null;
}

// --- Styled Components Aligned with ToolSuggestionModal ---

const ModalContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding: 12px 12px 32px 12px;

  @media (max-width: 640px) {
    gap: 16px;
    padding: 8px 8px 24px 8px;
  }
`;

const Description = styled.p`
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  line-height: 1.6;
  margin: 0;
`;

const HighlightText = styled.span`
  color: ${({ theme }) => theme.colors.warning};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
`;

const QuestionSection = styled(motion.div)`
  background: rgba(15, 15, 18, 0.4);
  backdrop-filter: blur(40px) saturate(200%);
  -webkit-backdrop-filter: blur(40px) saturate(200%);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 20px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.05);

  @media (max-width: 640px) {
    padding: 16px;
    gap: 16px;
    border-radius: 16px;
  }
`;

const QuestionGroup = styled(motion.div)`
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding-bottom: 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);

  &:last-child {
    padding-bottom: 0;
    border-bottom: none;
  }
`;

const OriginalInfo = styled.div`
  background: rgba(255, 255, 255, 0.03);
  border-radius: 12px;
  padding: 14px 16px;
  border: 1px solid rgba(255, 255, 255, 0.05);
`;

const OriginalText = styled.p`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.textSecondary};
  font-style: italic;
  margin: 0;
  line-height: 1.5;
`;

const QuestionLabel = styled.label`
  font-size: 14px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.textPrimary};
  line-height: 1.4;
`;

const OptionsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 4px;
`;

const OptionPill = styled.button<{ $isSelected: boolean }>`
  background: ${({ $isSelected }) => $isSelected ? 'rgba(99, 102, 241, 0.2)' : 'rgba(255, 255, 255, 0.05)'};
  border: 1px solid ${({ $isSelected }) => $isSelected ? 'rgba(99, 102, 241, 0.8)' : 'rgba(255, 255, 255, 0.1)'};
  color: ${({ $isSelected, theme }) => $isSelected ? '#818cf8' : theme.colors.textSecondary};
  padding: 8px 16px;
  border-radius: 999px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${({ $isSelected }) => $isSelected ? 'rgba(99, 102, 241, 0.25)' : 'rgba(255, 255, 255, 0.1)'};
    color: ${({ $isSelected, theme }) => $isSelected ? '#a5b4fc' : theme.colors.textPrimary};
  }
`;

const AnswerInput = styled.input`
  width: 100%;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 12px 16px;
  color: white;
  font-size: 14px;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: rgba(99, 102, 241, 0.5);
    background: rgba(99, 102, 241, 0.08);
    box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.1);
  }

  &::placeholder {
    color: rgba(255, 255, 255, 0.3);
  }
`;

const ModalGlassCTAButton = styled(motion.button)`
  background: rgba(102, 126, 234, 0.15);
  color: white;
  border: 1px solid rgba(102, 126, 234, 0.4);
  padding: 0 24px;
  height: 48px;
  border-radius: 9999px;
  font-weight: 600;
  font-size: 15px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  cursor: pointer;
  backdrop-filter: blur(10px);
  box-shadow: 0 4px 16px rgba(102, 126, 234, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1);
  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    background: rgba(102, 126, 234, 0.25);
    border-color: rgba(102, 126, 234, 0.8);
    box-shadow: 0 8px 24px rgba(102, 126, 234, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.15);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    background: rgba(255, 255, 255, 0.05);
    border-color: rgba(255, 255, 255, 0.1);
    box-shadow: none;
  }
`;

const GhostButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 0 24px;
  height: 48px;
  border-radius: 9999px;
  cursor: pointer;
  font-size: 15px;
  font-weight: 500;
  color: rgba(255,255,255,0.7);
  background: transparent;
  border: 1px solid transparent;
  transition: all 0.2s ease;

  &:hover {
    color: white;
    background: rgba(255,255,255,0.05);
  }
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 40px 0;
  
  p {
    color: ${({ theme }) => theme.colors.textSecondary};
    font-size: 14px;
  }
`;

// --- Animation Variants ---
const listVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  show: { 
    opacity: 1, 
    y: 0,
    transition: { type: "spring", stiffness: 300, damping: 24 }
  },
};

export const MetricQuestionsModal: React.FC<MetricQuestionsModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  onSkip,
  metricQuestions,
}) => {
  const [userMetrics, setUserMetrics] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isOpen) {
      setUserMetrics({});
    }
  }, [isOpen]);

  const handleConfirm = () => {
    const finalMetrics: Record<string, string> = {};
    for (const key in userMetrics) {
      if (userMetrics[key].trim() !== "") {
        finalMetrics[key] = userMetrics[key].trim();
      }
    }
    onConfirm(finalMetrics);
  };

  const hasQuestions = metricQuestions && metricQuestions.length > 0;
  const answeredCount = Object.values(userMetrics).filter(val => val.trim() !== "").length;
  const isAllAnswered = hasQuestions && answeredCount === metricQuestions.length;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Boost Your ATS Score"
      description="Adding numbers to your experience makes your CV significantly stronger. Fill in what you remember, skip the rest."
      size="md"
      showCloseButton={true}
      closeOnBackdropClick={false}
      closeOnEscape={false}
    >
      <Modal.Body>
        <ModalContent>
          <Description>
            We identified potential in <HighlightText>{metricQuestions?.length || 0} areas</HighlightText>. Let's quantify them.
          </Description>

          {hasQuestions ? (
            <AnimatePresence>
              <QuestionSection
                variants={listVariants}
                initial="hidden"
                animate="show"
              >
                {metricQuestions.map((mq) => (
                  <QuestionGroup key={mq.id} variants={itemVariants}>
                    <OriginalInfo>
                      <OriginalText>"{mq.original_bullet}"</OriginalText>
                    </OriginalInfo>
                    
                    <QuestionLabel>{mq.question}</QuestionLabel>
                    
                    {mq.options && mq.options.length > 0 && (
                      <OptionsContainer>
                        {mq.options.map((opt, idx) => (
                          <OptionPill
                            key={idx}
                            $isSelected={userMetrics[mq.id] === opt}
                            onClick={() => setUserMetrics(prev => ({ ...prev, [mq.id]: opt }))}
                          >
                            {opt}
                          </OptionPill>
                        ))}
                      </OptionsContainer>
                    )}
                    
                    <AnswerInput 
                      type="text" 
                      placeholder={mq.options && mq.options.length > 0 ? "Or type your own custom answer..." : "e.g. 50+, $10K, 20%..."}
                      value={userMetrics[mq.id] || ""}
                      onChange={(e) => setUserMetrics(prev => ({ ...prev, [mq.id]: e.target.value }))}
                    />
                  </QuestionGroup>
                ))}
              </QuestionSection>
            </AnimatePresence>
          ) : (
            <EmptyState>
              <p>No missing metrics found. Your CV is highly quantified!</p>
            </EmptyState>
          )}
        </ModalContent>
      </Modal.Body>

      <Modal.Footer>
        <GhostButton onClick={onSkip}>
          {hasQuestions ? "Skip for now" : "Continue"}
        </GhostButton>
        {hasQuestions && (
          <ModalGlassCTAButton 
            onClick={handleConfirm}
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98, y: 0 }}
          >
            {isAllAnswered ? "Save All & Continue" : "Save & Continue"}
          </ModalGlassCTAButton>
        )}
      </Modal.Footer>
    </Modal>
  );
};

