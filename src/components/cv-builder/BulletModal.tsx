"use client";

import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(8px);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
`;

const ModalContent = styled(motion.div)`
  background: rgba(20, 20, 22, 0.95);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  width: 100%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 24px 50px rgba(0, 0, 0, 0.5);
  display: flex;
  flex-direction: column;

  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 4px;
  }
`;

const Header = styled.div`
  padding: 20px 24px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  display: flex;
  align-items: center;
  justify-content: space-between;

  h3 {
    margin: 0;
    color: #fff;
    font-size: 18px;
    font-weight: 500;
  }

  button {
    background: none;
    border: none;
    color: rgba(255, 255, 255, 0.4);
    cursor: pointer;
    padding: 4px;
    display: flex;
    transition: color 0.2s;

    &:hover {
      color: #fff;
    }
  }
`;

const Tabs = styled.div`
  display: flex;
  padding: 0 24px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
`;

const Tab = styled.button<{ $active: boolean }>`
  background: none;
  border: none;
  padding: 16px 20px;
  color: ${props => props.$active ? '#fff' : 'rgba(255, 255, 255, 0.5)'};
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  position: relative;
  transition: color 0.2s;

  &::after {
    content: '';
    position: absolute;
    bottom: -1px;
    left: 0;
    right: 0;
    height: 2px;
    background: ${props => props.$active ? '#3b82f6' : 'transparent'};
    border-radius: 2px 2px 0 0;
    transition: background 0.2s;
  }

  &:hover {
    color: #fff;
  }
`;

const Body = styled.div`
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  min-height: 200px;
`;

const SuggestionCard = styled.button`
  text-align: left;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 16px;
  color: rgba(255, 255, 255, 0.9);
  font-size: 14px;
  line-height: 1.5;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  gap: 12px;
  align-items: flex-start;

  &:hover {
    background: rgba(59, 130, 246, 0.05);
    border-color: rgba(59, 130, 246, 0.3);
    transform: translateY(-1px);
  }

  .icon {
    flex-shrink: 0;
    color: #3b82f6;
    margin-top: 2px;
  }
`;

const Textarea = styled.textarea`
  width: 100%;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 16px;
  color: #fff;
  font-size: 15px;
  line-height: 1.5;
  resize: vertical;
  min-height: 120px;
  font-family: inherit;

  &:focus {
    outline: none;
    border-color: rgba(59, 130, 246, 0.5);
    background: rgba(255, 255, 255, 0.05);
  }

  &::placeholder {
    color: rgba(255, 255, 255, 0.3);
  }
`;

const MadLibsText = styled.div`
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 20px;
  color: rgba(255, 255, 255, 0.9);
  font-size: 15px;
  line-height: 2;
`;

const InlineInput = styled.input`
  background: rgba(59, 130, 246, 0.1);
  border: 1px dashed rgba(59, 130, 246, 0.5);
  border-radius: 6px;
  color: #60a5fa;
  font-size: inherit;
  font-family: inherit;
  padding: 2px 8px;
  margin: 0 4px;
  text-align: center;
  outline: none;
  transition: all 0.2s;

  &::placeholder {
    color: rgba(59, 130, 246, 0.5);
    transition: color 0.2s;
  }

  &:focus {
    background: rgba(59, 130, 246, 0.2);
    border-color: #3b82f6;
    color: #fff;
  }

  &:focus::placeholder {
    color: transparent;
  }
`;

const PrimaryButton = styled.button`
  background: #fff;
  color: #000;
  border: none;
  border-radius: 12px;
  padding: 14px 24px;
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

  &:hover:not(:disabled) {
    transform: scale(1.02);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const LoadingText = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px;
  color: rgba(255, 255, 255, 0.5);
  font-size: 14px;
  gap: 12px;

  &::after {
    content: '';
    width: 16px;
    height: 16px;
    border: 2px solid rgba(255,255,255,0.2);
    border-top-color: #fff;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 40px 20px;
  color: rgba(255, 255, 255, 0.5);
  font-size: 14px;
`;

interface BulletModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (bullet: string) => void;
  jobTitle: string;
  company: string;
}

export function BulletModal({ isOpen, onClose, onAdd, jobTitle, company }: BulletModalProps) {
  const [activeTab, setActiveTab] = useState<'suggestions' | 'polish'>('suggestions');
  
  // Suggestions State
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const [hasFetched, setHasFetched] = useState(false);
  const [selectedSuggestion, setSelectedSuggestion] = useState<string | null>(null);
  const [inputValues, setInputValues] = useState<Record<number, string>>({});

  // Polish State
  const [draft, setDraft] = useState("");
  const [loadingPolish, setLoadingPolish] = useState(false);
  const [polishedResult, setPolishedResult] = useState("");

  useEffect(() => {
    if (isOpen && activeTab === 'suggestions' && !hasFetched && jobTitle) {
      fetchSuggestions();
    }
  }, [isOpen, activeTab, jobTitle]);

  const fetchSuggestions = async () => {
    if (!jobTitle) return;

    try {
      const cacheKey = `rejectly_bullets_${jobTitle}_${company}`;
      
      // 1. Check LocalStorage
      const cached = localStorage.getItem(cacheKey);
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setSuggestions(parsed);
          setHasFetched(true);
          return; // Zero latency! No API call needed.
        }
      }

      // 2. Not cached, make API call
      setLoadingSuggestions(true);
      const res = await fetch('/api/cv/bullets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: jobTitle, company })
      });
      const data = await res.json();
      if (data.bullets) {
        setSuggestions(data.bullets);
        setHasFetched(true);
        // Save to cache
        localStorage.setItem(cacheKey, JSON.stringify(data.bullets));
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingSuggestions(false);
    }
  };

  const handlePolish = async () => {
    if (!draft.trim()) return;
    setLoadingPolish(true);
    try {
      const res = await fetch('/api/cv/polish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: draft, role: jobTitle, company })
      });
      const data = await res.json();
      if (data.bullet) {
        setPolishedResult(data.bullet);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingPolish(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <Overlay
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <ModalContent
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
          >
            <Header>
              <h3>Add Responsibilities</h3>
              <button onClick={onClose}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </Header>

            <Tabs>
              <Tab 
                $active={activeTab === 'suggestions'} 
                onClick={() => setActiveTab('suggestions')}
              >
                Smart Suggestions
              </Tab>
              <Tab 
                $active={activeTab === 'polish'} 
                onClick={() => setActiveTab('polish')}
              >
                Write My Own (Professional Polish)
              </Tab>
            </Tabs>

            <Body>
              {activeTab === 'suggestions' && (
                <>
                  {selectedSuggestion !== null ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <p style={{ margin: 0, color: 'rgba(255,255,255,0.7)', fontSize: '14px' }}>
                          Fill in the brackets with your real numbers:
                        </p>
                        <button 
                          onClick={() => setSelectedSuggestion(null)}
                          style={{ background: 'transparent', border: 'none', color: '#3b82f6', cursor: 'pointer', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '4px' }}
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6" /></svg>
                          Back to list
                        </button>
                      </div>
                      <MadLibsText>
                        {selectedSuggestion.split(/(\[.*?\])/g).map((part, index) => {
                          if (part.startsWith('[') && part.endsWith(']')) {
                            return (
                              <InlineInput
                                key={index}
                                placeholder={part}
                                value={inputValues[index] !== undefined ? inputValues[index] : ""}
                                onChange={(e) => setInputValues(prev => ({ ...prev, [index]: e.target.value }))}
                                size={Math.max((inputValues[index] || part).length, 3)}
                              />
                            );
                          }
                          return <span key={index}>{part}</span>;
                        })}
                      </MadLibsText>
                      <PrimaryButton 
                        onClick={() => {
                          const finalString = selectedSuggestion.split(/(\[.*?\])/g).map((part, index) => {
                            if (part.startsWith('[') && part.endsWith(']')) {
                              return inputValues[index] !== undefined && inputValues[index] !== "" ? inputValues[index] : part;
                            }
                            return part;
                          }).join('');
                          onAdd(finalString);
                          onClose();
                          setTimeout(() => {
                            setSelectedSuggestion(null);
                            setInputValues({});
                          }, 300);
                        }}
                        style={{ alignSelf: 'flex-end', background: '#fff', color: '#000' }}
                      >
                        Add to CV
                      </PrimaryButton>
                    </div>
                  ) : loadingSuggestions ? (
                    <LoadingText>Brainstorming for {jobTitle || "your role"}</LoadingText>
                  ) : suggestions.length > 0 ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      <p style={{ margin: '0 0 8px', color: 'rgba(255,255,255,0.5)', fontSize: '13px' }}>
                        Click a template to fill in your real metrics.
                      </p>
                      {suggestions.map((s, i) => (
                        <SuggestionCard 
                          key={i} 
                          onClick={() => setSelectedSuggestion(s)}
                        >
                          <div className="icon">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M12 5v14M5 12h14" />
                            </svg>
                          </div>
                          <div style={{ lineHeight: '1.6' }}>
                            {s.split(/(\[.*?\])/g).map((part, pIndex) => {
                              if (part.startsWith('[') && part.endsWith(']')) {
                                return <span 
                                  key={pIndex}
                                  style={{
                                    background: 'rgba(59, 130, 246, 0.15)',
                                    border: '1px solid rgba(59, 130, 246, 0.3)',
                                    backdropFilter: 'blur(4px)',
                                    color: '#60a5fa',
                                    padding: '2px 6px',
                                    borderRadius: '6px',
                                    fontSize: '0.9em',
                                    margin: '0 4px',
                                    fontWeight: 500,
                                    display: 'inline-block'
                                  }}
                                >
                                  {part}
                                </span>;
                              }
                              return <span key={pIndex}>{part}</span>;
                            })}
                          </div>
                        </SuggestionCard>
                      ))}
                    </div>
                  ) : (
                    <EmptyState>
                      {jobTitle ? (
                        <>
                          <p>Couldn't load suggestions.</p>
                          <PrimaryButton onClick={fetchSuggestions} style={{ margin: '16px auto 0' }}>Try Again</PrimaryButton>
                        </>
                      ) : (
                        <p>Please enter a Job Title first to get suggestions.</p>
                      )}
                    </EmptyState>
                  )}
                </>
              )}

              {activeTab === 'polish' && (
                <>
                  {!polishedResult ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                      <p style={{ margin: 0, color: 'rgba(255,255,255,0.7)', fontSize: '14px' }}>
                        Write a rough draft of what you did. We'll turn it into a professional, ATS-friendly achievement.
                      </p>
                      <Textarea 
                        placeholder="e.g. I fixed the website login bug and made the app load much faster."
                        value={draft}
                        onChange={(e) => setDraft(e.target.value)}
                        autoFocus
                      />
                      <PrimaryButton 
                        onClick={handlePolish} 
                        disabled={!draft.trim() || loadingPolish}
                        style={{ alignSelf: 'flex-end', background: '#3b82f6', color: '#fff' }}
                      >
                        {loadingPolish ? "Polishing..." : "Professional Polish"}
                      </PrimaryButton>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                      <p style={{ margin: 0, color: '#10b981', fontSize: '14px', fontWeight: 500 }}>
                        Here is your polished version:
                      </p>
                      <Textarea 
                        value={polishedResult}
                        onChange={(e) => setPolishedResult(e.target.value)}
                      />
                      <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                        <button 
                          onClick={() => setPolishedResult("")}
                          style={{ background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.5)', cursor: 'pointer', fontSize: '14px' }}
                        >
                          Try Again
                        </button>
                        <PrimaryButton onClick={() => {
                          onAdd(polishedResult);
                          onClose();
                          // Reset for next time
                          setDraft("");
                          setPolishedResult("");
                        }}>
                          Add to CV
                        </PrimaryButton>
                      </div>
                    </div>
                  )}
                </>
              )}
            </Body>
          </ModalContent>
        </Overlay>
      )}
    </AnimatePresence>
  );
}
