"use client";

import styled from "styled-components";
import { useCVStore } from "./store";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

const FormContainer = styled(motion.div)`
  display: flex;
  flex-direction: column;
  gap: 24px;
  width: 100%;
`;

const TabsContainer = styled.div`
  display: flex;
  gap: 8px;
  background: color-mix(in srgb, var(--rj-ink) 3%, transparent);
  padding: 6px;
  border-radius: 12px;
  border: 1px solid color-mix(in srgb, var(--rj-ink) 5%, transparent);
  margin-bottom: 8px;
`;

const Tab = styled.button<{ $active: boolean }>`
  flex: 1;
  padding: 10px 16px;
  border-radius: 8px;
  background: ${props => props.$active ? 'color-mix(in srgb, var(--rj-ink) 10%, transparent)' : 'transparent'};
  color: ${props => props.$active ? 'var(--rj-paper)' : 'color-mix(in srgb, var(--rj-ink) 50%, transparent)'};
  border: 1px solid ${props => props.$active ? 'color-mix(in srgb, var(--rj-ink) 10%, transparent)' : 'transparent'};
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: ${props => props.$active ? '0 2px 8px rgba(0,0,0,0.2)' : 'none'};

  &:hover {
    color: var(--rj-ink);
  }
`;

const Textarea = styled.textarea`
  width: 100%;
  background: color-mix(in srgb, var(--rj-ink) 3%, transparent);
  border: 1px solid color-mix(in srgb, var(--rj-ink) 10%, transparent);
  border-radius: 12px;
  padding: 16px;
  color: var(--rj-ink);
  font-size: 15px;
  line-height: 1.6;
  min-height: 200px;
  resize: vertical;
  outline: none;
  font-family: inherit;

  &:focus {
    background: color-mix(in srgb, var(--rj-ink) 6%, transparent);
    border-color: color-mix(in srgb, var(--rj-ink) 50%, transparent);
    box-shadow: 0 0 0 4px color-mix(in srgb, var(--rj-ink) 10%, transparent);
  }
`;

const SuggestionCard = styled(motion.button)`
  width: 100%;
  text-align: left;
  background: color-mix(in srgb, var(--rj-ink) 2%, transparent);
  border: 1px solid color-mix(in srgb, var(--rj-ink) 8%, transparent);
  border-radius: 12px;
  padding: 20px;
  color: color-mix(in srgb, var(--rj-ink) 85%, transparent);
  font-size: 14px;
  line-height: 1.6;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);

  &:hover {
    background: color-mix(in srgb, var(--rj-ink) 6%, transparent);
    border-color: color-mix(in srgb, var(--rj-ink) 30%, transparent);
    transform: translateY(-2px) scale(1.01);
    box-shadow: 0 4px 16px color-mix(in srgb, var(--rj-ink) 15%, transparent);
  }
`;

const HeaderBox = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  padding-bottom: 16px;
  margin-bottom: 8px;
`;

const FocusToggleContainer = styled.div`
  display: flex;
  background: color-mix(in srgb, var(--rj-ink) 2%, transparent);
  padding: 4px;
  border-radius: 12px;
  border: 1px solid color-mix(in srgb, var(--rj-ink) 5%, transparent);
  margin-bottom: 16px;
`;

const FocusButton = styled.button<{ $active: boolean }>`
  flex: 1;
  padding: 10px 12px;
  border-radius: 8px;
  background: ${props => props.$active ? 'color-mix(in srgb, var(--rj-ink) 15%, transparent)' : 'transparent'};
  color: ${props => props.$active ? 'var(--rj-ink)' : 'color-mix(in srgb, var(--rj-ink) 50%, transparent)'};
  border: 1px solid ${props => props.$active ? 'color-mix(in srgb, var(--rj-ink) 30%, transparent)' : 'transparent'};
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    color: ${props => props.$active ? 'var(--rj-ink)' : '#fff'};
  }
`;

export function SummaryForm() {
  const { cv, updateSummary } = useCVStore();
  const [activeTab, setActiveTab] = useState<'smart' | 'custom'>('smart');
  const [focus, setFocus] = useState<'experience' | 'education'>('experience');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasFetched, setHasFetched] = useState(false);
  
  // Track previous cache hash to refetch if profile changed
  const [lastHash, setLastHash] = useState('');

  // Initial tab set based on strictly having a summary loaded already (runs only on mount)
  useEffect(() => {
    if (cv.summary.trim()) {
      setActiveTab('custom');
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const fetchSuggestions = async () => {
      const validExp = cv.experience.filter(e => e.title.trim() !== "");
      const validEdu = cv.education.filter(e => e.institution.trim() !== "");
      const validCerts = (cv.certifications || []).filter(c => c.name.trim() !== "");

      // Create stable hash for cache targeting entire background subset
      const bgHash = btoa(encodeURIComponent(JSON.stringify({ 
        f: focus,
        e: validExp.map(x => x.title + x.company), 
        d: validEdu.map(x => x.degree), 
        c: validCerts.map(x => x.name),
        s: cv.skills.technical
      })));

      // If user opened this step and no change in their profile since last fetch, skip redundant network
      if (bgHash === lastHash && hasFetched && suggestions.length > 0) return;

      const cacheKey = `rejectly_summary_${bgHash}`;
      const cached = localStorage.getItem(cacheKey);
      
      if (cached) {
        try {
          const parsed = JSON.parse(cached);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setSuggestions(parsed);
            setHasFetched(true);
            setLastHash(bgHash);
            return;
          }
        } catch(e) {}
      }

      setLoading(true);
      try {
        const res = await fetch('/api/cv/summary', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            experience: validExp, 
            education: validEdu, 
            certifications: validCerts,
            skills: cv.skills.technical,
            focus: focus
          })
        });
        const data = await res.json();
        if (data.suggestions) {
          setSuggestions(data.suggestions);
          setHasFetched(true);
          setLastHash(bgHash);
          localStorage.setItem(cacheKey, JSON.stringify(data.suggestions));
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    if (activeTab === 'smart') {
      fetchSuggestions();
    }
  }, [activeTab, cv, hasFetched, lastHash, suggestions.length, focus]);

  const handleSelectSuggestion = (text: string) => {
    updateSummary(text);
    setActiveTab('custom');
  };

  return (
    <FormContainer
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
    >
      <TabsContainer>
        <Tab $active={activeTab === 'smart'} onClick={() => setActiveTab('smart')}>
           Smart Suggestions
        </Tab>
        <Tab $active={activeTab === 'custom'} onClick={() => setActiveTab('custom')}>
           Write My Own
        </Tab>
      </TabsContainer>

      <AnimatePresence mode="wait">
        {activeTab === 'smart' ? (
          <motion.div 
            key="smart"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}
          >
            <HeaderBox>
               <div>
                 <h3 style={{ fontSize: '16px', margin: '0 0 4px', color: 'var(--rj-ink)', fontWeight: 600 }}>Tailored Summaries</h3>
                 <div style={{ fontSize: '13px', color: 'color-mix(in srgb, var(--rj-ink) 50%, transparent)' }}>AI suggestions from what you&apos;ve entered. Keep only what&apos;s true.</div>
               </div>
            </HeaderBox>

            <FocusToggleContainer>
              <FocusButton $active={focus === 'experience'} onClick={() => { setHasFetched(false); setFocus('experience'); }}>
                Experience-Focused
              </FocusButton>
              <FocusButton $active={focus === 'education'} onClick={() => { setHasFetched(false); setFocus('education'); }}>
                Education-Focused
              </FocusButton>
            </FocusToggleContainer>

            {loading ? (
               <div style={{ padding: '60px 40px', textAlign: 'center', color: 'color-mix(in srgb, var(--rj-ink) 50%, transparent)', fontSize: '14px', lineHeight: 1.6 }}>
                 <motion.div 
                   animate={{ rotate: 360 }}
                   transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                   style={{ marginBottom: '16px', display: 'inline-block', color: 'var(--rj-ink)' }}
                 >
                   <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2v4m0 12v4M4.93 4.93l2.83 2.83m8.48 8.48l2.83 2.83M2 12h4m12 0h4M4.93 19.07l2.83-2.83m8.48-8.48l2.83-2.83"/></svg>
                 </motion.div>
                 <br />
                 Writing summaries from your experience, education and skills…
               </div>
            ) : suggestions.length > 0 ? (
               suggestions.map((text, idx) => (
                 <SuggestionCard 
                   key={idx}
                   onClick={() => handleSelectSuggestion(text)}
                   initial={{ opacity: 0, y: 20 }}
                   animate={{ opacity: 1, y: 0 }}
                   transition={{ delay: idx * 0.1, duration: 0.3 }}
                 >
                   {text}
                 </SuggestionCard>
               ))
            ) : (
               <div style={{ padding: '40px', textAlign: 'center', color: 'color-mix(in srgb, var(--rj-pen) 80%, transparent)', fontSize: '14px', background: 'color-mix(in srgb, var(--rj-pen) 5%, transparent)', borderRadius: '12px' }}>
                 No professional background data was provided to analyze. Go back and fill your experience, or switch to the manual tab.
               </div>
            )}
          </motion.div>
        ) : (
          <motion.div 
            key="custom"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <div style={{ marginBottom: '12px', fontSize: '14px', color: 'color-mix(in srgb, var(--rj-ink) 80%, transparent)', fontWeight: 500 }}>
              Your Professional Summary
            </div>
            <Textarea 
              value={cv.summary}
              onChange={(e) => updateSummary(e.target.value)}
              onFocus={(e) => {
                if (e.target.value.startsWith("Theoretical Physicist with expertise in anomalous")) updateSummary("");
              }}
              placeholder="e.g. Results-driven professional with 7+ years of experience..."
            />
          </motion.div>
        )}
      </AnimatePresence>

    </FormContainer>
  );
}
