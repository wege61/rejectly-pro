"use client";
import React from "react";
import { motion } from "framer-motion";
import styled from "styled-components";
import { cn } from "@/lib/utils";

const LampWrapper = styled.div`
  position: relative;
  display: flex;
  min-height: 700px;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  overflow: hidden;
  background: var(--bg-color);
  width: 100%;
  border-radius: 6px;
  z-index: 0;
`;

const LampEffectContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  display: flex;
  width: 100%;
  height: 400px;
  transform: scaleY(1.25);
  align-items: center;
  justify-content: center;
  isolation: isolate;
  z-index: 0;
`;

const ConicGradientLeft = styled(motion.div)`
  position: absolute;
  inset: auto;
  right: 50%;
  height: 14rem;
  overflow: visible;
  background: conic-gradient(from 70deg at center top, #FF6B6B, transparent, transparent);
`;

const ConicGradientRight = styled(motion.div)`
  position: absolute;
  inset: auto;
  left: 50%;
  height: 14rem;
  background: conic-gradient(from 290deg at center top, transparent, transparent, #FF6B6B);
`;

const MaskBottomLeft = styled.div`
  position: absolute;
  width: 100%;
  left: 0;
  background: var(--bg-color);
  height: 10rem;
  bottom: 0;
  z-index: 20;
  mask-image: linear-gradient(to top, white, transparent);
  -webkit-mask-image: linear-gradient(to top, white, transparent);
`;

const MaskLeft = styled.div`
  position: absolute;
  width: 10rem;
  height: 100%;
  left: 0;
  background: var(--bg-color);
  bottom: 0;
  z-index: 20;
  mask-image: linear-gradient(to right, white, transparent);
  -webkit-mask-image: linear-gradient(to right, white, transparent);
`;

const MaskRight = styled.div`
  position: absolute;
  width: 10rem;
  height: 100%;
  right: 0;
  background: var(--bg-color);
  bottom: 0;
  z-index: 20;
  mask-image: linear-gradient(to left, white, transparent);
  -webkit-mask-image: linear-gradient(to left, white, transparent);
`;

const MaskBottomRight = styled.div`
  position: absolute;
  width: 100%;
  right: 0;
  background: var(--bg-color);
  height: 10rem;
  bottom: 0;
  z-index: 20;
  mask-image: linear-gradient(to top, white, transparent);
  -webkit-mask-image: linear-gradient(to top, white, transparent);
`;

const BlurLayer = styled.div`
  position: absolute;
  top: 50%;
  height: 12rem;
  width: 100%;
  transform: translateY(3rem) scaleX(1.5);
  background: var(--bg-color);
  filter: blur(40px);
`;

const BackdropLayer = styled.div`
  position: absolute;
  top: 50%;
  z-index: 50;
  height: 12rem;
  width: 100%;
  background: transparent;
  opacity: 0.1;
  backdrop-filter: blur(12px);
`;

const GlowOrb = styled.div`
  position: absolute;
  inset: auto;
  z-index: 50;
  height: 9rem;
  width: 28rem;
  transform: translateY(-50%);
  border-radius: 9999px;
  background: #FF6B6B;
  opacity: 0.5;
  filter: blur(48px);
`;

const GlowOrbInner = styled(motion.div)`
  position: absolute;
  inset: auto;
  z-index: 30;
  height: 9rem;
  transform: translateY(-6rem);
  border-radius: 9999px;
  background: #ff8585;
  filter: blur(32px);
`;

const GlowLine = styled(motion.div)`
  position: absolute;
  inset: auto;
  z-index: 50;
  height: 2px;
  transform: translateY(-7rem);
  background: #ff8585;
`;

const TopMask = styled.div`
  position: absolute;
  inset: auto;
  z-index: 40;
  height: 11rem;
  width: 100%;
  transform: translateY(-12.5rem);
  background: var(--bg-color);
`;

const ContentWrapper = styled.div`
  position: relative;
  z-index: 50;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0 20px;
  width: 100%;
  margin-top: 120px;
`;

export const LampContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <LampWrapper className={cn(className)}>
      <LampEffectContainer>
        <ConicGradientLeft
          initial={{ opacity: 0.5, width: "15rem" }}
          whileInView={{ opacity: 1, width: "30rem" }}
          transition={{
            delay: 0.3,
            duration: 0.8,
            ease: "easeInOut",
          }}
          viewport={{ once: true }}
        >
          <MaskBottomLeft />
          <MaskLeft />
        </ConicGradientLeft>

        <ConicGradientRight
          initial={{ opacity: 0.5, width: "15rem" }}
          whileInView={{ opacity: 1, width: "30rem" }}
          transition={{
            delay: 0.3,
            duration: 0.8,
            ease: "easeInOut",
          }}
          viewport={{ once: true }}
        >
          <MaskRight />
          <MaskBottomRight />
        </ConicGradientRight>

        <BlurLayer />
        <BackdropLayer />
        <GlowOrb />

        <GlowOrbInner
          initial={{ width: "8rem" }}
          whileInView={{ width: "16rem" }}
          transition={{
            delay: 0.3,
            duration: 0.8,
            ease: "easeInOut",
          }}
          viewport={{ once: true }}
        />

        <GlowLine
          initial={{ width: "15rem" }}
          whileInView={{ width: "30rem" }}
          transition={{
            delay: 0.3,
            duration: 0.8,
            ease: "easeInOut",
          }}
          viewport={{ once: true }}
        />

        <TopMask />
      </LampEffectContainer>

      <ContentWrapper>
        {children}
      </ContentWrapper>
    </LampWrapper>
  );
};

export default LampContainer;
