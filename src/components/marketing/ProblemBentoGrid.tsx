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
  background: var(--bg-alt);
  overflow: hidden;
  transition: all 0.3s ease;
  min-height: 280px;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: inherit;
    padding: 1px;
    background: linear-gradient(
      180deg,
      rgba(255, 107, 107, 0.2) 0%,
      rgba(255, 107, 107, 0.05) 100%
    );
    -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
    pointer-events: none;
  }

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);

    &::before {
      background: linear-gradient(
        180deg,
        rgba(255, 107, 107, 0.4) 0%,
        rgba(255, 107, 107, 0.1) 100%
      );
    }
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
  border-top: 1px solid var(--border-color);

  ${BentoGridItemWrapper}:hover & {
    transform: translateY(-2px);
  }
`;

const ItemIconWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 8px;
`;

const ItemIcon = styled.div`
  width: 28px;
  height: 28px;
  border-radius: 8px;
  background: var(--landing-button);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  svg {
    width: 16px;
    height: 16px;
    color: white;
  }
`;

const ItemTitle = styled.h4`
  font-size: 15px;
  font-weight: 700;
  color: var(--text-color);
  line-height: 1.4;
  margin: 0;
`;

const ItemDescription = styled.span`
  font-size: 13px;
  color: var(--text-secondary);
  line-height: 1.6;
  display: block;
  margin-top: 6px;
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

// Skeleton One - ATS Rejection Animation (Chat bubbles)
const SkeletonOne = () => {
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
          borderRadius: "9999px",
          border: "1px solid var(--border-color)",
          padding: "8px",
          alignItems: "center",
          gap: "8px",
          background: "var(--bg-color)",
          position: "relative",
          zIndex: 1,
        }}
      >
        <div
          style={{
            height: "24px",
            width: "24px",
            borderRadius: "9999px",
            background: "linear-gradient(to right, #FF6B6B, #ee5a5a)",
            flexShrink: 0,
          }}
        />
        <div
          style={{
            width: "100%",
            background: "var(--bg-alt)",
            height: "16px",
            borderRadius: "9999px",
          }}
        />
      </motion.div>
      <motion.div
        variants={variantsSecond}
        style={{
          display: "flex",
          flexDirection: "row",
          borderRadius: "9999px",
          border: "1px solid var(--border-color)",
          padding: "8px",
          alignItems: "center",
          gap: "8px",
          width: "75%",
          marginLeft: "auto",
          background: "var(--bg-color)",
          position: "relative",
          zIndex: 1,
        }}
      >
        <div
          style={{
            width: "100%",
            background: "var(--bg-alt)",
            height: "16px",
            borderRadius: "9999px",
          }}
        />
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
      <motion.div
        variants={variants}
        style={{
          display: "flex",
          flexDirection: "row",
          borderRadius: "9999px",
          border: "1px solid var(--border-color)",
          padding: "8px",
          alignItems: "center",
          gap: "8px",
          background: "var(--bg-color)",
          position: "relative",
          zIndex: 1,
        }}
      >
        <div
          style={{
            height: "24px",
            width: "24px",
            borderRadius: "9999px",
            background: "linear-gradient(to right, #FF6B6B, #ee5a5a)",
            flexShrink: 0,
          }}
        />
        <div
          style={{
            width: "100%",
            background: "var(--bg-alt)",
            height: "16px",
            borderRadius: "9999px",
          }}
        />
      </motion.div>
    </motion.div>
  );
};

// Skeleton Two - Skills Gap Analysis (Progress bars)
const SkeletonTwo = () => {
  const variants = {
    initial: { width: 0 },
    animate: {
      width: "100%",
      transition: { duration: 0.2 },
    },
    hover: {
      width: ["0%", "100%"],
      transition: { duration: 2 },
    },
  };
  const arr = new Array(6).fill(0);
  const widths = [85, 45, 70, 30, 60, 50];

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
        flexDirection: "column",
        gap: "8px",
        position: "relative",
      }}
    >
      <DotBackground />
      {arr.map((_, i) => (
        <motion.div
          key={"skeleton-two" + i}
          variants={variants}
          style={{
            maxWidth: widths[i] + "%",
            display: "flex",
            flexDirection: "row",
            borderRadius: "9999px",
            border: "1px solid var(--border-color)",
            padding: "8px",
            alignItems: "center",
            gap: "8px",
            background: i % 2 === 0 ? "rgba(255, 107, 107, 0.1)" : "var(--bg-alt)",
            width: "100%",
            height: "16px",
            position: "relative",
            zIndex: 1,
          }}
        />
      ))}
    </motion.div>
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

// Icons
const XIcon = () => (
  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M6 18L18 6M6 6l12 12"
    />
  </svg>
);

const TargetIcon = () => (
  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);

const RobotIcon = () => (
  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2zm8-12v2m-2 4h.01M13 11h.01"
    />
  </svg>
);

const ChartIcon = () => (
  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
    />
  </svg>
);

const SparklesIcon = () => (
  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
    />
  </svg>
);

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
  icon,
}: {
  className?: string;
  title?: string | React.ReactNode;
  description?: string | React.ReactNode;
  header?: React.ReactNode;
  icon?: React.ReactNode;
}) => {
  const isColSpan2 = className?.includes("md:col-span-2");

  return (
    <BentoGridItemWrapper className={cn(isColSpan2 && "md-col-span-2", className)}>
      <ItemHeader>{header}</ItemHeader>
      <ItemContent>
        <ItemIconWrapper>
          <ItemIcon>{icon}</ItemIcon>
          <ItemTitle>{title}</ItemTitle>
        </ItemIconWrapper>
        <ItemDescription>{description}</ItemDescription>
      </ItemContent>
    </BentoGridItemWrapper>
  );
};

// Section styled components
const ProblemSectionWrapper = styled.section`
  padding: 80px 24px;
  background: var(--bg-color);

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
    icon: <XIcon />,
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
    icon: <ChartIcon />,
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
    icon: <RobotIcon />,
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
    icon: <TargetIcon />,
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
    icon: <SparklesIcon />,
  },
];

// Main component export
export function ProblemBentoGrid() {
  return (
    <ProblemSectionWrapper>
      <SectionHeader>
        <SectionTitle>Why Your Applications Keep Getting Rejected</SectionTitle>
        <SectionSubtitle>
          The brutal truth about modern job hunting that nobody tells you
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
            icon={item.icon}
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
