"use client";

import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef, useEffect } from "react";

const Container = styled.div`
  position: relative;
  width: 100%;
`;

const InputDisplay = styled.div<{ $isOpen: boolean; $hasValue: boolean }>`
  width: 100%;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid ${props => props.$isOpen ? '#3b82f6' : 'rgba(255, 255, 255, 0.1)'};
  border-radius: 12px;
  padding: 16px;
  color: ${props => props.$hasValue ? '#fff' : 'rgba(255, 255, 255, 0.4)'};
  font-size: 15px;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  justify-content: space-between;
  align-items: center;

  &:hover {
    background: rgba(255, 255, 255, 0.05);
    border-color: ${props => props.$isOpen ? '#3b82f6' : 'rgba(255, 255, 255, 0.2)'};
  }

  svg {
    transition: transform 0.2s;
    transform: ${props => props.$isOpen ? 'rotate(180deg)' : 'rotate(0)'};
    color: rgba(255, 255, 255, 0.5);
  }
`;

const Dropdown = styled(motion.div)`
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  width: 100%;
  min-width: 250px;
  background: rgba(20, 20, 22, 0.95);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
  z-index: 50;
  padding: 16px;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;

  button {
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    color: #fff;
    border-radius: 6px;
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.2s;

    &:hover {
      background: rgba(255, 255, 255, 0.1);
      border-color: rgba(255, 255, 255, 0.2);
    }
  }

  span {
    color: #fff;
    font-weight: 600;
    font-size: 16px;
  }
`;

const MonthsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
`;

const MonthBtn = styled.button<{ $selected: boolean; $isCurrent: boolean }>`
  background: ${props => props.$selected ? '#3b82f6' : props.$isCurrent ? 'rgba(59, 130, 246, 0.1)' : 'transparent'};
  color: ${props => props.$selected ? '#fff' : props.$isCurrent ? '#60a5fa' : 'rgba(255, 255, 255, 0.7)'};
  border: 1px solid ${props => props.$selected ? '#3b82f6' : props.$isCurrent ? 'rgba(59, 130, 246, 0.3)' : 'transparent'};
  border-radius: 8px;
  padding: 10px 4px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: ${props => props.$selected ? '#2563eb' : 'rgba(255, 255, 255, 0.05)'};
  }
`;

const PresentBtn = styled.button`
  width: 100%;
  margin-top: 16px;
  background: rgba(16, 185, 129, 0.1);
  color: #10b981;
  border: 1px dashed rgba(16, 185, 129, 0.3);
  border-radius: 8px;
  padding: 12px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: rgba(16, 185, 129, 0.15);
    border-color: rgba(16, 185, 129, 0.5);
  }
`;

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

interface MonthYearPickerProps {
  value: string; // Format: "Mon YYYY" (e.g. "Aug 2021"), "Present", or ""
  onChange: (val: string) => void;
  placeholder?: string;
  showPresent?: boolean;
}

export function MonthYearPicker({ value, onChange, placeholder = "Select Date", showPresent = false }: MonthYearPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Parse initial view year from value, or default to current year
  const currentYearDate = new Date().getFullYear();
  const currentMonthDate = new Date().getMonth();

  const [viewYear, setViewYear] = useState(() => {
    if (value && value !== "Present") {
      const parts = value.split(' ');
      if (parts.length === 2) {
        return parseInt(parts[1], 10) || currentYearDate;
      }
    }
    return currentYearDate;
  });

  // Handle outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleMonthSelect = (monthIndex: number) => {
    // Return format: "Mon YYYY" (e.g., "Aug 2024")
    const newValue = `${MONTHS[monthIndex]} ${viewYear}`;
    onChange(newValue);
    setIsOpen(false);
  };

  const handlePresentClick = () => {
    onChange("Present");
    setIsOpen(false);
  };

  const getDisplayValue = () => {
    if (!value) return placeholder;
    return value;
  };

  // Determine selected year/month to highlight
  let selectedYear: number | null = null;
  let selectedMonthIndex: number | null = null;
  if (value && value !== "Present") {
    const parts = value.split(' ');
    if (parts.length === 2) {
      selectedYear = parseInt(parts[1], 10);
      selectedMonthIndex = MONTHS.indexOf(parts[0]);
    }
  }

  return (
    <Container ref={containerRef}>
      <InputDisplay 
        $isOpen={isOpen} 
        $hasValue={!!value}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>{getDisplayValue()}</span>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
      </InputDisplay>

      <AnimatePresence>
        {isOpen && (
          <Dropdown
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
          >
            <Header>
              <button onClick={(e) => { e.preventDefault(); setViewYear(y => y - 1); }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6" /></svg>
              </button>
              <span>{viewYear}</span>
              <button onClick={(e) => { e.preventDefault(); setViewYear(y => y + 1); }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6" /></svg>
              </button>
            </Header>

            <MonthsGrid>
              {MONTHS.map((monthStr, index) => {
                const isSelected = selectedYear === viewYear && selectedMonthIndex === index;
                const isCurrent = currentYearDate === viewYear && currentMonthDate === index;
                return (
                  <MonthBtn
                    key={monthStr}
                    $selected={isSelected}
                    $isCurrent={isCurrent}
                    onClick={(e) => { e.preventDefault(); handleMonthSelect(index); }}
                  >
                    {monthStr}
                  </MonthBtn>
                )
              })}
            </MonthsGrid>

            {showPresent && (
              <PresentBtn onClick={(e) => { e.preventDefault(); handlePresentClick(); }}>
                Currently Working Here (Present)
              </PresentBtn>
            )}
          </Dropdown>
        )}
      </AnimatePresence>
    </Container>
  );
}
