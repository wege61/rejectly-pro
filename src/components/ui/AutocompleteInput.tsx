"use client";

import styled from "styled-components";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

const Wrapper = styled.div`
  position: relative;
  width: 100%;
`;

const StyledInput = styled.input`
  width: 100%;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 14px 16px;
  color: #fff;
  font-size: 16px;
  transition: all 0.2s ease;
  outline: none;

  &:focus {
    background: rgba(255, 255, 255, 0.06);
    border-color: rgba(255, 255, 255, 0.3);
    box-shadow: 0 0 0 4px rgba(255, 255, 255, 0.05);
  }

  &::placeholder {
    color: rgba(255, 255, 255, 0.2);
  }
`;

const Dropdown = styled(motion.ul)`
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  right: 0;
  background: rgba(20, 20, 22, 0.95);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  max-height: 240px;
  overflow-y: auto;
  z-index: 50;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
  list-style: none;
  padding: 8px;
  margin: 0;

  &::-webkit-scrollbar {
    width: 4px;
  }
  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 4px;
  }
`;

const DropdownItem = styled.li`
  padding: 12px 16px;
  border-radius: 8px;
  color: rgba(255, 255, 255, 0.9);
  font-size: 14px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 12px;
  transition: background 0.2s;

  &:hover {
    background: rgba(255, 255, 255, 0.06);
  }
  
  img {
    width: 24px;
    height: 24px;
    border-radius: 4px;
    background: #fff;
    object-fit: contain;
  }
`;

const LoadingText = styled.div`
  padding: 12px 16px;
  color: rgba(255, 255, 255, 0.5);
  font-size: 13px;
  display: flex;
  align-items: center;
  gap: 8px;

  &::after {
    content: '';
    width: 12px;
    height: 12px;
    border: 2px solid rgba(255,255,255,0.2);
    border-top-color: #fff;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;

interface Suggestion {
  name: string;
  logo?: string;
  domain?: string;
}

interface AutocompleteInputProps {
  value: string;
  onChange: (val: string) => void;
  onSelect?: (val: string, context?: any) => void;
  placeholder?: string;
  fetchType: "university" | "company" | "location" | "field_of_study" | "job_title";
}

export function AutocompleteInput({ value, onChange, onSelect, placeholder, fetchType }: AutocompleteInputProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  
  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Debounced fetch
  useEffect(() => {
    const isStaticList = fetchType === "field_of_study" || fetchType === "job_title";
    if (!isOpen || (!isStaticList && (!value || value.length < 3))) {
      setSuggestions([]);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        let results: Suggestion[] = [];
        
        if (fetchType === "field_of_study") {
          const COMMON_FIELDS = [
            "Computer Science", "Software Engineering", "Information Technology", "Cybersecurity",
            "Business Administration", "Marketing", "Finance", "Accounting", "Economics", "Entrepreneurship",
            "Psychology", "Sociology", "Data Science", "Nursing", "Biology", "Chemistry", "Physics",
            "Mechanical Engineering", "Electrical Engineering", "Civil Engineering", "Aerospace Engineering",
            "Graphic Design", "UI/UX Design", "Communications", "Political Science", "History", "English Literature",
            "Architecture", "Law", "Medicine", "Public Health", "Education", "Mathematics"
          ];
          const query = value ? value.toLowerCase() : "";
          results = COMMON_FIELDS
            .filter(d => d.toLowerCase().includes(query))
            .slice(0, 15) // Limit to 15 to not overwhelm the UI
            .map(d => ({ name: d }));
        }
        else if (fetchType === "job_title") {
          const { COMMON_JOBS } = await import('@/components/cv-builder/data/jobTitles');
          const query = value ? value.toLowerCase() : "";
          results = COMMON_JOBS
            .filter((j: string) => j.toLowerCase().includes(query))
            .slice(0, 15)
            .map((j: string) => ({ name: j }));
        }
        else if (fetchType === "university") {
          const res = await fetch(`/api/universities/search?name=${encodeURIComponent(value)}&limit=5`);
          const data = await res.json();
          const uniqueNames = new Set();
          data.forEach((item: any) => {
            if (!uniqueNames.has(item.name)) {
              results.push({ name: item.name, domain: item.alpha_two_code });
              uniqueNames.add(item.name);
            }
          });
        } 
        else if (fetchType === "company") {
          const res = await fetch(`https://autocomplete.clearbit.com/v1/companies/suggest?query=${encodeURIComponent(value)}`);
          if (res.ok) {
            const data = await res.json();
            
            const uniqueNames = new Set();
            const dedupedResults: Suggestion[] = [];
            
            data.forEach((item: any) => {
              if (!uniqueNames.has(item.name)) {
                uniqueNames.add(item.name);
                dedupedResults.push({ name: item.name, logo: item.logo, domain: item.domain });
              }
            });
            
            results = dedupedResults;
          }
        }
        else if (fetchType === "location") {
          const res = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(value)}&count=5&language=en&format=json`);
          if (res.ok) {
            const data = await res.json();
            if (data.results) {
              const uniqueNames = new Set();
              data.results.forEach((item: any) => {
                const parts = [item.name, item.admin1, item.country].filter(Boolean);
                // Eğer şehir adı ile bölge adı (admin1) aynıysa (Örn: Istanbul, Istanbul) tekrarı engelle
                const uniqueParts = parts.filter((val, index, arr) => arr.indexOf(val) === index);
                const fullName = uniqueParts.join(', ');
                if (!uniqueNames.has(fullName)) {
                  results.push({ name: fullName });
                  uniqueNames.add(fullName);
                }
              });
            }
          }
        }
        
        setSuggestions(results.slice(0, 5));
      } catch (e) {
        console.error("Failed to fetch suggestions", e);
      } finally {
        setLoading(false);
      }
    }, 500); // 500ms debounce

    return () => clearTimeout(timer);
  }, [value, fetchType, isOpen]);

  const handleSelect = (suggestion: Suggestion) => {
    onChange(suggestion.name);
    if (onSelect) onSelect(suggestion.name, suggestion);
    setIsOpen(false);
  };

  return (
    <Wrapper ref={wrapperRef}>
      <StyledInput 
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
          setIsOpen(true);
        }}
        onFocus={() => {
          if (fetchType === "field_of_study" || fetchType === "job_title" || value.length >= 3) setIsOpen(true);
        }}
        placeholder={placeholder}
      />
      
      <AnimatePresence>
        {isOpen && (loading || suggestions.length > 0) && (
          <Dropdown
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.15 }}
          >
            {loading && suggestions.length === 0 ? (
              <LoadingText>Finding {fetchType}s...</LoadingText>
            ) : (
              suggestions.map((s, i) => (
                <DropdownItem key={i} onClick={() => handleSelect(s)}>
                  {s.logo && <img src={s.logo} alt="" />}
                  {s.name}
                </DropdownItem>
              ))
            )}
          </Dropdown>
        )}
      </AnimatePresence>
    </Wrapper>
  );
}
