"use client";

import { useState, useRef, useEffect } from "react";
import styled, { keyframes, css } from "styled-components";

// ─── Types ──────────────────────────────────────────────────────────────────

interface ShareScoreButtonProps {
  score: number;
  label?: string; // e.g. "ATS Ready", "Needs Attention"
  size?: "sm" | "md";
}

// ─── Animations ─────────────────────────────────────────────────────────────

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(6px) scale(0.97); }
  to   { opacity: 1; transform: translateY(0)   scale(1); }
`;

const checkPop = keyframes`
  0%   { transform: scale(0.5); opacity: 0; }
  60%  { transform: scale(1.2); }
  100% { transform: scale(1);   opacity: 1; }
`;

// ─── Styled Components ───────────────────────────────────────────────────────

const Wrapper = styled.div`
  position: relative;
  display: inline-block;
`;

const TriggerButton = styled.button<{ $size: "sm" | "md" }>`
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: ${({ $size }) => ($size === "sm" ? "7px 14px" : "10px 18px")};
  border-radius: 100px;
  border: 1px solid rgba(53, 162, 159, 0.25);
  background: rgba(53, 162, 159, 0.08);
  color: var(--primary-500);
  font-size: ${({ $size }) => ($size === "sm" ? "12px" : "14px")};
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;

  svg {
    width: ${({ $size }) => ($size === "sm" ? "13px" : "15px")};
    height: ${({ $size }) => ($size === "sm" ? "13px" : "15px")};
    flex-shrink: 0;
  }

  &:hover {
    background: rgba(53, 162, 159, 0.14);
    border-color: rgba(53, 162, 159, 0.4);
    transform: translateY(-1px);
    box-shadow: 0 4px 16px rgba(53, 162, 159, 0.15);
  }

  &:active {
    transform: translateY(0);
  }
`;

const Dropdown = styled.div`
  position: absolute;
  bottom: calc(100% + 10px);
  left: 50%;
  transform: translateX(-50%);
  width: 220px;
  background: rgba(22, 22, 26, 0.96);
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  box-shadow: 0 16px 48px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(255,255,255,0.04);
  padding: 8px;
  z-index: 100;
  animation: ${fadeIn} 0.18s cubic-bezier(0.16, 1, 0.3, 1) both;

  /* Arrow */
  &::after {
    content: '';
    position: absolute;
    bottom: -5px;
    left: 50%;
    transform: translateX(-50%) rotate(45deg);
    width: 10px;
    height: 10px;
    background: rgba(22, 22, 26, 0.96);
    border-right: 1px solid rgba(255, 255, 255, 0.1);
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  }
`;

const DropdownHeader = styled.div`
  padding: 8px 12px 10px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  margin-bottom: 6px;
`;

const DropdownTitle = styled.p`
  font-size: 11px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.3);
  letter-spacing: 1px;
  text-transform: uppercase;
  margin: 0 0 4px;
`;

const ScorePreview = styled.p`
  font-size: 15px;
  font-weight: 700;
  color: #fff;
  margin: 0;
  letter-spacing: -0.3px;
`;

const DropdownItem = styled.button<{ $copied?: boolean }>`
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  padding: 10px 12px;
  border-radius: 10px;
  border: none;
  background: ${({ $copied }) => ($copied ? "rgba(53, 162, 159, 0.12)" : "transparent")};
  color: ${({ $copied }) => ($copied ? "var(--primary-500)" : "rgba(255, 255, 255, 0.75)")};
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s ease;
  text-align: left;

  svg {
    width: 15px;
    height: 15px;
    flex-shrink: 0;
    opacity: 0.7;
  }

  .check-icon {
    animation: ${checkPop} 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) both;
    color: var(--primary-500);
    opacity: 1;
  }

  &:hover {
    background: rgba(255, 255, 255, 0.05);
    color: #fff;

    svg {
      opacity: 1;
    }
  }
`;

// ─── Icons ───────────────────────────────────────────────────────────────────

const ShareIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
  </svg>
);

const TwitterIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const LinkedInIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);

const CopyIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
  </svg>
);

const CheckIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
  </svg>
);

// ─── Helper ──────────────────────────────────────────────────────────────────

function getScoreLabel(score: number): string {
  if (score >= 85) return "ATS Ready 🟢";
  if (score >= 70) return "Looking Good 🟡";
  if (score >= 50) return "Needs Attention 🟠";
  return "Not Ready 🔴";
}

function buildShareText(score: number): string {
  const label = getScoreLabel(score);
  if (score >= 80) {
    return `My resume just scored ${score}/100 on an ATS check — ${label}! Check yours for free 👇`;
  }
  if (score >= 60) {
    return `Just checked my ATS resume score: ${score}/100. Time to optimize 📄 Try it free 👇`;
  }
  return `Only ${score}/100 on ATS. No wonder it was getting ignored 😅 Fixed it with Rejectly.pro 👇`;
}

// ─── Component ───────────────────────────────────────────────────────────────

export function ShareScoreButton({ score, size = "md" }: ShareScoreButtonProps) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const siteUrl = "https://rejectly.pro/ats-check";

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const shareText = buildShareText(score);
  const shareUrl = `https://rejectly.pro/ats-check?score=${score}`;
  const ogImageUrl = `https://rejectly.pro/api/og/score?score=${score}`;
  const shareTwitter = () => {
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText + "\n" + shareUrl)}`;
    window.open(url, "_blank", "noopener,noreferrer,width=550,height=450");
    setOpen(false);
  };

  const shareLinkedIn = () => {
    const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}&summary=${encodeURIComponent(shareText)}`;
    window.open(url, "_blank", "noopener,noreferrer,width=600,height=500");
    setOpen(false);
  };

  const copyLink = async () => {
    const text = `${shareText}\n${shareUrl}`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
        setOpen(false);
      }, 1600);
    } catch {
      // Fallback for older browsers
      const textarea = document.createElement("textarea");
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => { setCopied(false); setOpen(false); }, 1600);
    }
  };

  return (
    <Wrapper ref={ref}>
      <TriggerButton $size={size} onClick={() => setOpen(o => !o)}>
        <ShareIcon />
        Share Score
      </TriggerButton>

      {open && (
        <Dropdown>
          <DropdownHeader>
            <DropdownTitle>Your Score</DropdownTitle>
            <ScorePreview>{score}/100 · {getScoreLabel(score)}</ScorePreview>
          </DropdownHeader>

          <DropdownItem onClick={shareTwitter}>
            <TwitterIcon />
            Share on X (Twitter)
          </DropdownItem>

          <DropdownItem onClick={shareLinkedIn}>
            <LinkedInIcon />
            Share on LinkedIn
          </DropdownItem>

          <DropdownItem onClick={copyLink} $copied={copied}>
            {copied ? (
              <span className="check-icon"><CheckIcon /></span>
            ) : (
              <CopyIcon />
            )}
            {copied ? "Copied!" : "Copy shareable text"}
          </DropdownItem>
        </Dropdown>
      )}
    </Wrapper>
  );
}

export default ShareScoreButton;
