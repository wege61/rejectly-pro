"use client";

import styled, { keyframes } from "styled-components";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircleIcon,
  XCircleIcon,
  SparklesIcon,
} from "@heroicons/react/24/outline";

// ==========================================
// V3 TRULY PREMIUM "TAHOE LIQUID GLASS"
// ==========================================

const ScannerContainer = styled.div`
  position: relative;
  width: 100%;
  max-width: 540px;
  height: 560px;
  margin: 0 auto;
  perspective: 2500px;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
`;

// Represents a 3D Canvas
const TiltCanvas = styled(motion.div)`
  width: 100%;
  height: 100%;
  transform-style: preserve-3d;
`;

const GlassPanelWrapper = styled(motion.div)`
  position: absolute;
  inset: 0;
  border-radius: 32px; /* Apple-esque superellipse approximation */
  
  /* Liquid Glass Core */
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.05) 0%,
    rgba(20, 20, 22, 0.4) 100%
  );
  backdrop-filter: blur(80px);
  -webkit-backdrop-filter: blur(80px);
  
  /* Intricate Inner & Outer Lighting */
  box-shadow: 
    inset 0 1.5px 1px rgba(255, 255, 255, 0.25), /* Top precise highlight */
    inset 0 -1px 1px rgba(0, 0, 0, 0.5), /* Bottom inner shadow */
    0 0 0 1px rgba(255, 255, 255, 0.08), /* Crisp outer hairline */
    0 50px 100px -20px rgba(0, 0, 0, 0.8), /* Deep environmental drop shadow */
    0 30px 60px -30px rgba(53, 162, 159, 0.15); /* Subtle colored ambient spill */
    
  padding: 40px 36px;
  display: flex;
  flex-direction: column;
  overflow: hidden;

  /* Ambient reflection map (subtle overlay) */
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: 32px;
    background: linear-gradient(
      180deg,
      rgba(255, 255, 255, 0.06) 0%,
      transparent 30%
    );
    pointer-events: none;
    z-index: 2;
  }
`;

const MacHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 40px;
  z-index: 3;
`;

const Dot = styled.div<{ $color: string }>`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: ${({ $color }) => $color};
  box-shadow: inset 0 2px 4px rgba(255, 255, 255, 0.4),
    0 1px 3px rgba(0, 0, 0, 0.2);
  /* Make them feel like glossy gel pills */
  background-image: linear-gradient(
    to bottom right,
    rgba(255, 255, 255, 0.5) 0%,
    transparent 50%
  );
`;

const ResumeLine = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 32px;
  z-index: 3;
`;

const TextBlock = styled(motion.div)<{ $width: string; $height?: string; $opacity?: number }>`
  height: ${({ $height }) => $height || "10px"};
  width: ${({ $width }) => $width};
  background: rgba(255, 255, 255, ${({ $opacity }) => $opacity || 0.1});
  border-radius: 5px;
  /* Add subtle inset to text lines so they look etched */
  box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.2);
`;

const KeywordBox = styled(motion.div)<{ $isSuccess: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 500;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  letter-spacing: -0.2px;

  background: ${({ $isSuccess }) =>
    $isSuccess ? "rgba(255, 255, 255, 0.9)" : "rgba(30, 30, 35, 0.8)"};
  color: ${({ $isSuccess }) => ($isSuccess ? "#000000" : "#A1A1AA")};
  box-shadow: 
    inset 0 1px 1px ${({ $isSuccess }) => ($isSuccess ? "rgba(255,255,255,1)" : "rgba(255,255,255,0.05)")},
    0 0 0 1px ${({ $isSuccess }) => ($isSuccess ? "transparent" : "rgba(255, 255, 255, 0.1)")},
    0 4px 12px rgba(0, 0, 0, 0.2);

  svg {
    width: 14px;
    height: 14px;
    stroke-width: 2.5;
    color: ${({ $isSuccess }) => ($isSuccess ? "#10B981" : "#EE5A5A")};
  }
`;

const scanAnimation = keyframes`
  0% { top: -10%; opacity: 0; }
  10% { opacity: 1; }
  45% { top: 110%; opacity: 1; }
  50% { opacity: 0; }
  100% { top: 110%; opacity: 0; }
`;

const ScannerLaser = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  height: 2px;
  background: #ffffff;
  box-shadow: 
    0 0 10px 2px rgba(255, 255, 255, 0.8),
    0 0 30px 8px rgba(53, 162, 159, 0.5); /* Deep teal/silver optic flare */
  z-index: 20;
  animation: ${scanAnimation} 4s cubic-bezier(0.25, 1, 0.5, 1) forwards;
  
  &::after {
    content: '';
    position: absolute;
    top: -80px;
    left: 0;
    right: 0;
    height: 80px;
    background: linear-gradient(to bottom, transparent, rgba(255, 255, 255, 0.08));
    mask-image: linear-gradient(to bottom, transparent, black);
    -webkit-mask-image: linear-gradient(to bottom, transparent, black);
  }
`;

const MagicSweep = styled(motion.div)`
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to bottom,
    transparent,
    rgba(255, 255, 255, 0.08),
    transparent
  );
  height: 200%;
  z-index: 15;
  pointer-events: none;
`;

const StatusBadge = styled(motion.div)<{ $isSuccess: boolean }>`
  position: absolute;
  top: 32px;
  right: 32px;
  padding: 8px 16px;
  border-radius: 999px;
  font-weight: 600;
  font-size: 13px;
  letter-spacing: 0.2px;
  display: flex;
  align-items: center;
  gap: 8px;
  
  /* Apple glass pill aesthetic */
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  color: ${({ $isSuccess }) => ($isSuccess ? "#10B981" : "#A1A1AA")};
  box-shadow: 
    inset 0 1px 1px rgba(255, 255, 255, 0.1),
    0 0 0 1px rgba(255, 255, 255, 0.05),
    0 8px 24px rgba(0, 0, 0, 0.4);
  z-index: 30;

  svg {
    stroke-width: 2.2;
    color: ${({ $isSuccess }) => ($isSuccess ? "#10B981" : "#EE5A5A")};
  }
`;

// ==========================================
// COMPONENT
// ==========================================

export function AnimatedATSScanner() {
  const [phase, setPhase] = useState<"scanning" | "magic" | "success">("scanning");

  useEffect(() => {
    const timer1 = setTimeout(() => setPhase("magic"), 3800);
    const timer2 = setTimeout(() => setPhase("success"), 4500);

    const loop = setInterval(() => {
      setPhase("scanning");
      setTimeout(() => setPhase("magic"), 3800);
      setTimeout(() => setPhase("success"), 4500);
    }, 9000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearInterval(loop);
    };
  }, []);

  const isSuccess = phase === "success";

  return (
    <ScannerContainer>
      <TiltCanvas
        initial={{ rotateX: 6, rotateY: -8, scale: 0.95 }}
        animate={{ 
          rotateX: [6, 4, 6], 
          rotateY: [-8, -6, -8],
          y: [0, -15, 0]
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <GlassPanelWrapper>
          <MacHeader>
            <Dot $color="#FF5F56" />
            <Dot $color="#FFBD2E" />
            <Dot $color="#27C93F" />
          </MacHeader>

          {phase === "scanning" && <ScannerLaser />}
          
          <MagicSweep
            initial={{ y: "-150%" }}
            animate={{ y: phase === "magic" || phase === "success" ? "100%" : "-150%" }}
            transition={{ duration: 1.2, ease: [0.25, 1, 0.5, 1] }}
          />

          <AnimatePresence mode="popLayout">
            <StatusBadge
              key={isSuccess ? "success" : "scanning"}
              $isSuccess={isSuccess}
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            >
              {isSuccess ? (
                <>
                  <SparklesIcon style={{ width: 16 }} />
                  98% ATS MATCH
                </>
              ) : (
                <>
                  <XCircleIcon style={{ width: 16 }} />
                  32% REJECTED
                </>
              )}
            </StatusBadge>
          </AnimatePresence>

          <motion.div
             animate={{ opacity: phase === "magic" ? 0.7 : 1 }}
             transition={{ duration: 0.4 }}
             style={{ marginTop: "8px", zIndex: 3 }}
          >
            <TextBlock $width="35%" $height="20px" $opacity={isSuccess ? 0.3 : 0.1} style={{ marginBottom: "32px" }} />
            
            <ResumeLine>
              <TextBlock $width="100%" />
              <TextBlock $width="85%" />
              <div style={{ display: "flex", gap: "12px", alignItems: "center", marginTop: "4px" }}>
                <TextBlock $width="15%" />
                <AnimatePresence mode="popLayout">
                  <KeywordBox
                    key={isSuccess ? "strong1" : "weak1"}
                    $isSuccess={isSuccess}
                    initial={{ opacity: 0, filter: "blur(8px)", scale: 0.95 }}
                    animate={{ opacity: 1, filter: "blur(0px)", scale: 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    {isSuccess ? (
                      <>
                        <CheckCircleIcon /> Led full-stack capstone project
                      </>
                    ) : (
                      <>
                        <XCircleIcon /> did a school project
                      </>
                    )}
                  </KeywordBox>
                </AnimatePresence>
                <TextBlock $width="25%" />
              </div>
            </ResumeLine>

            <ResumeLine style={{ marginTop: "36px" }}>
              <TextBlock $width="80%" />
              <div style={{ display: "flex", gap: "12px", alignItems: "center", marginTop: "4px" }}>
                <AnimatePresence mode="popLayout">
                  <KeywordBox
                    key={isSuccess ? "strong2" : "weak2"}
                    $isSuccess={isSuccess}
                    initial={{ opacity: 0, filter: "blur(8px)", scale: 0.95 }}
                    animate={{ opacity: 1, filter: "blur(0px)", scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                  >
                    {isSuccess ? (
                      <>
                        <CheckCircleIcon /> React.js & TypeScript
                      </>
                    ) : (
                      <>
                        <XCircleIcon /> knows coding
                      </>
                    )}
                  </KeywordBox>
                </AnimatePresence>
                <TextBlock $width="40%" />
              </div>
              <TextBlock $width="65%" />
            </ResumeLine>
            
            <ResumeLine style={{ marginTop: "36px" }}>
              <div style={{ display: "flex", gap: "12px", alignItems: "center", marginTop: "4px" }}>
                <TextBlock $width="15%" />
                <AnimatePresence mode="popLayout">
                  <KeywordBox
                    key={isSuccess ? "strong3" : "weak3"}
                    $isSuccess={isSuccess}
                    initial={{ opacity: 0, filter: "blur(8px)", scale: 0.95 }}
                    animate={{ opacity: 1, filter: "blur(0px)", scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                  >
                    {isSuccess ? (
                      <>
                        <CheckCircleIcon /> Won 1st place at Hackathon
                      </>
                    ) : (
                      <>
                       <XCircleIcon /> wrote some code
                      </>
                    )}
                  </KeywordBox>
                </AnimatePresence>
              </div>
              <TextBlock $width="90%" />
              <TextBlock $width="50%" />
            </ResumeLine>
          </motion.div>
        </GlassPanelWrapper>
      </TiltCanvas>
    </ScannerContainer>
  );
}
