"use client";
import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { AuroraBackground } from "@/components/ui/AuroraBackground";

// BentoGrid styled components
const BentoGridWrapper = styled.div`
  display: grid;
  gap: 16px;
  max-width: 1000px;
  margin: 0 auto;

  @media (min-width: 768px) {
    grid-auto-rows: 20rem;
    grid-template-columns: repeat(3, 1fr);
  }
`;

const BentoGridItemWrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 24px;
  border-radius: 24px;
  background: var(--bg-color);
  overflow: hidden;
  transition: all 0.3s ease;
  min-height: 280px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  outline: 1px solid rgba(0, 0, 0, 0.05);

  &:hover {
   
    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.1);
  }

  &.md-col-span-2 {
    @media (min-width: 768px) {
      grid-column: span 2;
    }
  }

  @media (max-width: 767px) {
    min-height: 320px;
    padding: 20px;
  }
`;

const ItemHeader = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
`;

const ItemContent = styled.div`
  transition: transform 0.3s ease;
  padding-top: 8px;

  ${BentoGridItemWrapper}:hover & {
    transform: translateY(-2px);
  }
`;

const ItemTitle = styled.h4`
  font-size: 15px;
  font-weight: 700;
  color: var(--text-color);
  line-height: 1.4;
  margin: 0 0 6px 0;
`;

const ItemDescription = styled.span`
  font-size: 13px;
  color: var(--text-secondary);
  line-height: 1.6;
  display: block;
`;

// Dot background pattern
const DotBackground = styled.div`
  position: absolute;
  inset: 0;
  background-image: radial-gradient(
    var(--text-muted) 1px,
    transparent 1px
  );
  background-size: 16px 16px;
  opacity: 0.15;
`;

// Skeleton One - ATS Resume to Trash Animation (Refined)
const SkeletonOne = () => {
  const [phase, setPhase] = useState<"idle" | "scanning" | "rejected" | "falling">("idle");

  useEffect(() => {
    const runAnimation = () => {
      setPhase("scanning");
      setTimeout(() => setPhase("rejected"), 800);
      setTimeout(() => setPhase("falling"), 1400);
      setTimeout(() => setPhase("idle"), 2400);
    };

    runAnimation();
    const interval = setInterval(runAnimation, 3500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      style={{
        display: "flex",
        flex: 1,
        width: "100%",
        height: "100%",
        minHeight: "6rem",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        gap: "16px",
        padding: "8px",
      }}
    >
      <DotBackground />

      {/* Resume Document */}
      <motion.div
        animate={{
          x: phase === "falling" ? 50 : 0,
          y: phase === "falling" ? 40 : 0,
          rotate: phase === "falling" ? 20 : 0,
          scale: phase === "falling" ? 0.5 : 1,
          opacity: phase === "falling" ? 0 : 1,
        }}
        transition={{
          duration: phase === "falling" ? 0.5 : 0.3,
          ease: "easeInOut",
        }}
        style={{
          position: "relative",
          zIndex: 2,
          width: "56px",
          height: "72px",
          background: "var(--bg-color)",
          borderRadius: "6px",
          border: "1px solid var(--border-color)",
          padding: "8px 6px",
          display: "flex",
          flexDirection: "column",
          gap: "4px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
        }}
      >
        {/* Resume lines */}
        <div style={{ width: "100%", height: "6px", background: "var(--bg-alt)", borderRadius: "3px" }} />
        <div style={{ width: "100%", height: "3px", background: "var(--bg-alt)", borderRadius: "2px" }} />
        <div style={{ width: "75%", height: "3px", background: "var(--bg-alt)", borderRadius: "2px" }} />
        <div style={{ width: "90%", height: "3px", background: "var(--bg-alt)", borderRadius: "2px" }} />
        <div style={{ width: "60%", height: "3px", background: "var(--bg-alt)", borderRadius: "2px" }} />

        {/* Scanning line */}
        <motion.div
          animate={{
            top: phase === "scanning" ? ["0%", "100%"] : "0%",
            opacity: phase === "scanning" ? 1 : 0,
          }}
          transition={{ duration: 0.6, ease: "linear" }}
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            height: "2px",
            background: "linear-gradient(90deg, transparent, #ef4444, transparent)",
            boxShadow: "0 0 8px #ef4444",
          }}
        />

        {/* REJECTED stamp */}
        <motion.div
          animate={{
            opacity: phase === "rejected" || phase === "falling" ? 1 : 0,
            scale: phase === "rejected" ? [1.3, 1] : 1,
          }}
          transition={{ duration: 0.15 }}
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%) rotate(-12deg)",
            background: "#ef4444",
            color: "white",
            fontSize: "7px",
            fontWeight: 800,
            padding: "2px 4px",
            borderRadius: "2px",
            letterSpacing: "0.3px",
            whiteSpace: "nowrap",
          }}
        >
          REJECTED
        </motion.div>
      </motion.div>

      {/* Arrow */}
      <motion.div
        animate={{
          opacity: phase === "rejected" ? 1 : 0.3,
          x: phase === "rejected" ? [0, 4, 0] : 0,
        }}
        transition={{ duration: 0.3 }}
        style={{
          fontSize: "16px",
          color: phase === "rejected" ? "#ef4444" : "var(--text-muted)",
          zIndex: 1,
        }}
      >
        →
      </motion.div>

      {/* Trash Can */}
      <motion.div
        animate={{
          scale: phase === "falling" ? [1, 1.1, 1] : 1,
        }}
        transition={{ duration: 0.3 }}
        style={{
          position: "relative",
          zIndex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <div
          style={{
            width: "36px",
            height: "6px",
            background: "#6b7280",
            borderRadius: "2px 2px 0 0",
          }}
        />
        <div
          style={{
            width: "32px",
            height: "32px",
            background: "linear-gradient(to bottom, #4b5563, #374151)",
            borderRadius: "0 0 4px 4px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "3px",
          }}
        >
          <div style={{ width: "2px", height: "14px", background: "#6b7280", borderRadius: "1px" }} />
          <div style={{ width: "2px", height: "14px", background: "#6b7280", borderRadius: "1px" }} />
          <div style={{ width: "2px", height: "14px", background: "#6b7280", borderRadius: "1px" }} />
        </div>

        {/* Label */}
        <motion.span
          animate={{ opacity: phase === "falling" ? 1 : 0 }}
          style={{
            marginTop: "4px",
            fontSize: "8px",
            color: "#ef4444",
            fontWeight: 600,
          }}
        >
          75% end here
        </motion.span>
      </motion.div>
    </div>
  );
};

// Skeleton Two - Skills Gap Analysis (Compact version)
const SkeletonTwo = () => {
  const [step, setStep] = useState(0);

  const requirements = [
    { skill: "TypeScript", hasIt: false },
    { skill: "AWS", hasIt: false },
    { skill: "Docker", hasIt: true },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setStep((prev) => (prev + 1) % (requirements.length + 2));
    }, 700);
    return () => clearInterval(interval);
  }, []);

  const matchCount = requirements.filter(r => r.hasIt).length;
  const matchPercent = Math.round((matchCount / requirements.length) * 100);

  return (
    <div
      style={{
        display: "flex",
        flex: 1,
        width: "100%",
        height: "100%",
        minHeight: "6rem",
        flexDirection: "column",
        position: "relative",
        gap: "4px",
        justifyContent: "center",
        padding: "4px 0",
      }}
    >
      <DotBackground />

      {/* Header */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        marginBottom: "2px",
        position: "relative",
        zIndex: 1,
      }}>
        <span style={{ fontSize: "8px", color: "#22c55e", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.3px" }}>
          Required
        </span>
        <span style={{ fontSize: "8px", color: "var(--text-muted)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.3px" }}>
          You
        </span>
      </div>

      {/* Skills list */}
      {requirements.map((req, i) => (
        <motion.div
          key={req.skill}
          initial={{ opacity: 0, x: -10 }}
          animate={{
            opacity: step > i ? 1 : 0,
            x: step > i ? 0 : -10,
          }}
          transition={{ duration: 0.2 }}
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "3px 6px",
            background: req.hasIt ? "rgba(34, 197, 94, 0.08)" : "rgba(239, 68, 68, 0.08)",
            borderRadius: "4px",
            border: `1px solid ${req.hasIt ? "rgba(34, 197, 94, 0.2)" : "rgba(239, 68, 68, 0.2)"}`,
            position: "relative",
            zIndex: 1,
          }}
        >
          <span style={{ fontSize: "10px", color: "var(--text-color)", fontWeight: 500 }}>
            {req.skill}
          </span>
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: step > i ? 1 : 0 }}
            transition={{ duration: 0.15, delay: 0.1 }}
            style={{
              fontSize: "9px",
              fontWeight: 700,
              color: req.hasIt ? "#22c55e" : "#ef4444",
            }}
          >
            {req.hasIt ? "✓" : "✗"}
          </motion.span>
        </motion.div>
      ))}

      {/* Match Score */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{
          opacity: step > requirements.length ? 1 : 0,
          scale: step > requirements.length ? 1 : 0.9,
        }}
        transition={{ duration: 0.2 }}
        style={{
          marginTop: "4px",
          padding: "4px 8px",
          background: "rgba(239, 68, 68, 0.12)",
          borderRadius: "6px",
          border: "1px solid rgba(239, 68, 68, 0.25)",
          textAlign: "center",
          position: "relative",
          zIndex: 1,
        }}
      >
        <span style={{ fontSize: "9px", color: "#ef4444", fontWeight: 700 }}>
          Match: {matchPercent}% 😬
        </span>
      </motion.div>
    </div>
  );
};

// Skeleton Three - Text Flip Animation (Good vs Bad Examples)
const SkeletonThree = () => {
  const goodExamples = [
    "Led cross-functional team of 8",
    "Increased revenue by 150%",
    "Managed $2M budget",
  ];
  const badExamples = [
    "Worked with team members",
    "Helped improve sales",
    "Handled company money",
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % goodExamples.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      style={{
        display: "flex",
        flex: 1,
        width: "100%",
        height: "100%",
        minHeight: "6rem",
        flexDirection: "column",
        gap: "12px",
        position: "relative",
        justifyContent: "center",
      }}
    >
      <DotBackground />

      {/* Bad Example - Red */}
      <motion.div
        key={`bad-${currentIndex}`}
        initial={{ opacity: 0, y: -10, filter: "blur(4px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        exit={{ opacity: 0, y: 10, filter: "blur(4px)" }}
        transition={{ duration: 0.5 }}
        style={{
          position: "relative",
          zIndex: 1,
          borderRadius: "12px",
          padding: "12px 16px",
          background: "linear-gradient(to bottom, rgba(239, 68, 68, 0.15), rgba(239, 68, 68, 0.05))",
          border: "1px solid rgba(239, 68, 68, 0.3)",
          boxShadow: "inset 0 -1px rgba(239, 68, 68, 0.2), 0 2px 8px rgba(239, 68, 68, 0.1)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
          <div
            style={{
              width: "6px",
              height: "6px",
              borderRadius: "50%",
              background: "#ef4444",
            }}
          />
          <span style={{ fontSize: "10px", color: "#ef4444", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px" }}>
            ATS Rejected
          </span>
        </div>
        <motion.p
          style={{
            fontSize: "13px",
            color: "var(--text-color)",
            fontWeight: 500,
            margin: 0,
          }}
        >
          {badExamples[currentIndex].split("").map((letter, index) => (
            <motion.span
              key={index}
              initial={{ opacity: 0, filter: "blur(8px)" }}
              animate={{ opacity: 1, filter: "blur(0px)" }}
              transition={{ delay: index * 0.02, duration: 0.3 }}
            >
              {letter}
            </motion.span>
          ))}
        </motion.p>
      </motion.div>

      {/* Good Example - Green */}
      <motion.div
        key={`good-${currentIndex}`}
        initial={{ opacity: 0, y: 10, filter: "blur(4px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        exit={{ opacity: 0, y: -10, filter: "blur(4px)" }}
        transition={{ duration: 0.5, delay: 0.2 }}
        style={{
          position: "relative",
          zIndex: 1,
          borderRadius: "12px",
          padding: "12px 16px",
          background: "linear-gradient(to bottom, rgba(34, 197, 94, 0.15), rgba(34, 197, 94, 0.05))",
          border: "1px solid rgba(34, 197, 94, 0.3)",
          boxShadow: "inset 0 -1px rgba(34, 197, 94, 0.2), 0 2px 8px rgba(34, 197, 94, 0.1)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
          <div
            style={{
              width: "6px",
              height: "6px",
              borderRadius: "50%",
              background: "#22c55e",
            }}
          />
          <span style={{ fontSize: "10px", color: "#22c55e", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px" }}>
            ATS Approved
          </span>
        </div>
        <motion.p
          style={{
            fontSize: "13px",
            color: "var(--text-color)",
            fontWeight: 500,
            margin: 0,
          }}
        >
          {goodExamples[currentIndex].split("").map((letter, index) => (
            <motion.span
              key={index}
              initial={{ opacity: 0, filter: "blur(8px)" }}
              animate={{ opacity: 1, filter: "blur(0px)" }}
              transition={{ delay: 0.2 + index * 0.02, duration: 0.3 }}
            >
              {letter}
            </motion.span>
          ))}
        </motion.p>
      </motion.div>
    </div>
  );
};

// Skeleton Four - Application Comparison (3 cards)
const SkeletonFour = () => {
  const first = {
    initial: { x: 20, rotate: -5 },
    hover: { x: 0, rotate: 0 },
  };
  const second = {
    initial: { x: -20, rotate: 5 },
    hover: { x: 0, rotate: 0 },
  };

  return (
    <motion.div
      initial="initial"
      animate="animate"
      whileHover="hover"
      style={{
        display: "flex",
        flex: 1,
        width: "100%",
        height: "100%",
        minHeight: "6rem",
        flexDirection: "row",
        gap: "8px",
        position: "relative",
      }}
    >
      <DotBackground />
      <motion.div
        variants={first}
        style={{
          height: "100%",
          width: "33.333%",
          borderRadius: "16px",
          background: "var(--bg-color)",
          padding: "16px",
          border: "1px solid var(--border-color)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          zIndex: 1,
        }}
      >
        <div
          style={{
            width: "40px",
            height: "40px",
            borderRadius: "9999px",
            background: "linear-gradient(to right, #888, #aaa)",
            marginBottom: "12px",
          }}
        />
        <p
          style={{
            fontSize: "11px",
            textAlign: "center",
            fontWeight: 600,
            color: "var(--text-muted)",
            marginBottom: "8px",
          }}
        >
          Generic Resume
        </p>
        <span
          style={{
            border: "1px solid #FF6B6B",
            background: "rgba(255, 107, 107, 0.1)",
            color: "#FF6B6B",
            fontSize: "10px",
            borderRadius: "9999px",
            padding: "2px 8px",
          }}
        >
          Rejected
        </span>
      </motion.div>
      <motion.div
        style={{
          height: "100%",
          position: "relative",
          zIndex: 20,
          width: "33.333%",
          borderRadius: "16px",
          background: "var(--bg-color)",
          padding: "16px",
          border: "1px solid var(--border-color)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            width: "40px",
            height: "40px",
            borderRadius: "9999px",
            background: "linear-gradient(to right, #FF6B6B, #ee5a5a)",
            marginBottom: "12px",
          }}
        />
        <p
          style={{
            fontSize: "11px",
            textAlign: "center",
            fontWeight: 600,
            color: "var(--text-muted)",
            marginBottom: "8px",
          }}
        >
          AI-Optimized
        </p>
        <span
          style={{
            border: "1px solid #22c55e",
            background: "rgba(34, 197, 94, 0.1)",
            color: "#22c55e",
            fontSize: "10px",
            borderRadius: "9999px",
            padding: "2px 8px",
          }}
        >
          Interview
        </span>
      </motion.div>
      <motion.div
        variants={second}
        style={{
          height: "100%",
          width: "33.333%",
          borderRadius: "16px",
          background: "var(--bg-color)",
          padding: "16px",
          border: "1px solid var(--border-color)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          zIndex: 1,
        }}
      >
        <div
          style={{
            width: "40px",
            height: "40px",
            borderRadius: "9999px",
            background: "linear-gradient(to right, #888, #aaa)",
            marginBottom: "12px",
          }}
        />
        <p
          style={{
            fontSize: "11px",
            textAlign: "center",
            fontWeight: 600,
            color: "var(--text-muted)",
            marginBottom: "8px",
          }}
        >
          Wrong Keywords
        </p>
        <span
          style={{
            border: "1px solid #f97316",
            background: "rgba(249, 115, 22, 0.1)",
            color: "#f97316",
            fontSize: "10px",
            borderRadius: "9999px",
            padding: "2px 8px",
          }}
        >
          No Response
        </span>
      </motion.div>
    </motion.div>
  );
};

// Skeleton Five - Chat conversation (Resume feedback)
const SkeletonFive = () => {
  const variants = {
    initial: { x: 0 },
    animate: {
      x: 10,
      rotate: 5,
      transition: { duration: 0.2 },
    },
  };
  const variantsSecond = {
    initial: { x: 0 },
    animate: {
      x: -10,
      rotate: -5,
      transition: { duration: 0.2 },
    },
  };

  return (
    <motion.div
      initial="initial"
      whileHover="animate"
      style={{
        display: "flex",
        flex: 1,
        width: "100%",
        height: "100%",
        minHeight: "6rem",
        flexDirection: "column",
        gap: "8px",
        position: "relative",
      }}
    >
      <DotBackground />
      <motion.div
        variants={variants}
        style={{
          display: "flex",
          flexDirection: "row",
          borderRadius: "16px",
          border: "1px solid var(--border-color)",
          padding: "10px",
          alignItems: "flex-start",
          gap: "10px",
          background: "var(--bg-color)",
          position: "relative",
          zIndex: 1,
        }}
      >
        <div
          style={{
            width: "32px",
            height: "32px",
            borderRadius: "9999px",
            background: "linear-gradient(to right, #FF6B6B, #ee5a5a)",
            flexShrink: 0,
          }}
        />
        <p
          style={{
            fontSize: "12px",
            color: "var(--text-muted)",
            lineHeight: 1.5,
            margin: 0,
          }}
        >
          Your resume lacks the specific keywords ATS systems look for. Missing: &quot;project management&quot;, &quot;agile&quot;...
        </p>
      </motion.div>
      <motion.div
        variants={variantsSecond}
        style={{
          display: "flex",
          flexDirection: "row",
          borderRadius: "9999px",
          border: "1px solid var(--border-color)",
          padding: "10px 14px",
          alignItems: "center",
          justifyContent: "flex-end",
          gap: "10px",
          width: "65%",
          marginLeft: "auto",
          background: "var(--bg-color)",
          position: "relative",
          zIndex: 1,
        }}
      >
        <p style={{ fontSize: "12px", color: "var(--text-muted)", margin: 0 }}>Fix it for me</p>
        <div
          style={{
            height: "24px",
            width: "24px",
            borderRadius: "9999px",
            background: "linear-gradient(to right, #FF6B6B, #ee5a5a)",
            flexShrink: 0,
          }}
        />
      </motion.div>
    </motion.div>
  );
};

// Bento Grid Components
const BentoGrid = ({
  className,
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) => {
  return (
    <BentoGridWrapper className={cn(className)}>
      {children}
    </BentoGridWrapper>
  );
};

const BentoGridItem = ({
  className,
  title,
  description,
  header,
}: {
  className?: string;
  title?: string | React.ReactNode;
  description?: string | React.ReactNode;
  header?: React.ReactNode;
}) => {
  const isColSpan2 = className?.includes("md:col-span-2");

  return (
    <BentoGridItemWrapper className={cn(isColSpan2 && "md-col-span-2", className)}>
      <ItemHeader>{header}</ItemHeader>
      <ItemContent>
        <ItemTitle>{title}</ItemTitle>
        <ItemDescription>{description}</ItemDescription>
      </ItemContent>
    </BentoGridItemWrapper>
  );
};

// Section styled components
const ProblemSectionWrapper = styled.section`
  padding: 80px 24px;
  background: var(--bg-alt);

  @media (max-width: 768px) {
    padding: 60px 16px;
  }
`;

const SectionHeader = styled.div`
  text-align: center;
  margin-bottom: 48px;
`;

const SectionTitle = styled.h2`
  font-size: 36px;
  font-weight: 700;
  color: var(--text-color);
  margin-bottom: 16px;
  letter-spacing: -0.02em;

  @media (max-width: 768px) {
    font-size: 28px;
  }
`;

const SectionSubtitle = styled.p`
  font-size: 18px;
  color: var(--text-secondary);
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.6;

  @media (max-width: 768px) {
    font-size: 16px;
  }
`;

const TransitionBoxWrapper = styled.div`
  margin-top: 64px;
  /* Full viewport width - break out of container */
  width: 100vw;
  position: relative;
  left: 50%;
  right: 50%;
  margin-left: -50vw;
  margin-right: -50vw;
  overflow: hidden;

  @media (max-width: 768px) {
    margin-top: 48px;
  }
`;

const TransitionBoxContent = styled.div`
  text-align: center;
  padding: 80px 32px;
  position: relative;
  z-index: 10;
  max-width: 700px;
  margin: 0 auto;

  h3 {
    font-size: 42px;
    font-weight: 700;
    margin-bottom: 24px;
    color: var(--text-color);
    letter-spacing: -0.02em;
  }

  p {
    font-size: 20px;
    color: var(--text-secondary);
    line-height: 1.7;
    max-width: 540px;
    margin: 0 auto;
  }

  @media (max-width: 768px) {
    padding: 60px 24px;

    h3 {
      font-size: 28px;
    }

    p {
      font-size: 16px;
    }
  }
`;

// Items data
const items = [
  {
    title: "ATS Robots Kill Your Resume",
    description: (
      <span>
        98% of Fortune 500 companies use ATS. Your CV gets rejected in 7.4 seconds by algorithms.
      </span>
    ),
    header: <SkeletonOne />,
    className: "md:col-span-1",
  },
  {
    title: "Invisible Skills Gap",
    description: (
      <span>
        Without AI analysis, you can&apos;t see the 30-40% skills gap between your resume and the job.
      </span>
    ),
    header: <SkeletonTwo />,
    className: "md:col-span-1",
  },
  {
    title: "Wrong Language",
    description: (
      <span>
        What impresses humans confuses ATS. Your resume needs to be bilingual: machine & human readable.
      </span>
    ),
    header: <SkeletonThree />,
    className: "md:col-span-1",
  },
  {
    title: "The Difference Between Rejection and Interview",
    description: (
      <span>
        Same qualifications, different results. AI-optimized resumes get 3x more interviews.
      </span>
    ),
    header: <SkeletonFour />,
    className: "md:col-span-2",
  },
  {
    title: "Instant AI Feedback",
    description: (
      <span>
        Get specific, actionable insights to transform your resume in seconds.
      </span>
    ),
    header: <SkeletonFive />,
    className: "md:col-span-1",
  },
];

// Main component export
export function ProblemBentoGrid() {
  return (
    <ProblemSectionWrapper>
      <SectionHeader>
        <SectionTitle>Why you keep getting rejected</SectionTitle>
        <SectionSubtitle>
          The brutal truth about modern job hunting
        </SectionSubtitle>
      </SectionHeader>

      <BentoGrid>
        {items.map((item, i) => (
          <BentoGridItem
            key={i}
            title={item.title}
            description={item.description}
            header={item.header}
            className={item.className}
          />
        ))}
      </BentoGrid>

      <TransitionBoxWrapper>
        <AuroraBackground showRadialGradient={true}>
          <TransitionBoxContent>
            <h3>There&apos;s a better way.</h3>
            <p>
              Stop sending applications into the void.
              Let AI show you exactly what&apos;s missing—in 30 seconds.
            </p>
          </TransitionBoxContent>
        </AuroraBackground>
      </TransitionBoxWrapper>
    </ProblemSectionWrapper>
  );
}

export default ProblemBentoGrid;
