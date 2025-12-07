"use client";

import React, { useCallback, useEffect, useState } from "react";
import styled, { keyframes } from "styled-components";

const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(10px);
    filter: blur(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
    filter: blur(0);
  }
`;

const fadeOutUp = keyframes`
  from {
    opacity: 1;
    transform: translateY(0) scale(1);
    filter: blur(0);
  }
  to {
    opacity: 0;
    transform: translateY(-40px) translateX(40px) scale(2);
    filter: blur(8px);
  }
`;

const WordContainer = styled.span`
  position: relative;
  display: inline-block;
  min-width: 200px;
  text-align: left;
`;

const Word = styled.span<{ $isExiting: boolean }>`
  display: inline-block;
  position: relative;
  animation: ${({ $isExiting }) => ($isExiting ? fadeOutUp : fadeInUp)}
    ${({ $isExiting }) => ($isExiting ? "0.3s" : "0.5s")}
    ease-out forwards;
  color: var(--landing);
`;

const Letter = styled.span<{ $delay: number }>`
  display: inline-block;
  opacity: 0;
  animation: ${fadeInUp} 0.2s ease-out forwards;
  animation-delay: ${({ $delay }) => $delay}ms;
`;

interface FlipWordsProps {
  words: string[];
  duration?: number;
  className?: string;
}

export const FlipWords = ({
  words,
  duration = 3000,
  className,
}: FlipWordsProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isExiting, setIsExiting] = useState(false);
  const [key, setKey] = useState(0);

  const currentWord = words[currentIndex];

  useEffect(() => {
    const interval = setInterval(() => {
      setIsExiting(true);

      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % words.length);
        setIsExiting(false);
        setKey((prev) => prev + 1);
      }, 300);
    }, duration);

    return () => clearInterval(interval);
  }, [duration, words.length]);

  return (
    <WordContainer className={className}>
      <Word key={key} $isExiting={isExiting}>
        {currentWord.split("").map((letter, index) => (
          <Letter key={`${key}-${index}`} $delay={index * 50}>
            {letter === " " ? "\u00A0" : letter}
          </Letter>
        ))}
      </Word>
    </WordContainer>
  );
};
