"use client";

import styled from "styled-components";
import Image from "next/image";
import { ROUTES } from "@/lib/constants";

const Section = styled.section`
  padding: 80px 24px;
  margin-top: 60px;

  @media (max-width: 768px) {
    padding: 60px 16px;
  }
`;

const CTASection = styled(Section)`
  background: linear-gradient(
    135deg,
    rgba(var(--accent-rgb), 0.05) 0%,
    rgba(var(--primary-500-rgb), 0.05) 100%
  );
  border-top: 1px solid var(--primary-500);
  border-bottom: 1px solid var(--primary-500);
`;

const PrimaryButton = styled.a`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background: var(--landing-button);
  color: #FFFFFF;
  padding: 18px 40px;
  border-radius: 9999px;
  font-weight: 700;
  font-size: 18px;
  transition: all 0.3s ease;
  cursor: pointer;
  text-decoration: none;
  box-shadow: 0 8px 24px rgba(255, 122, 115, 0.25);

  &:hover {
    background: #FF6A64;
    transform: translateY(-2px);
    box-shadow: 0 15px 40px rgba(255, 122, 115, 0.4);
  }

  svg {
    width: 22px;
    height: 22px;
  }

  @media (max-width: 640px) {
    width: 100%;
    max-width: 320px;
    font-size: 16px;
    padding: 16px 32px;
  }
`;

const CTACard = styled.div`
  background: var(--bg-alt);
  border: 2px solid var(--accent);
  border-radius: 24px;
  padding: 64px 48px;
  text-align: center;
  max-width: 800px;
  margin: 0 auto;
  box-shadow: 0 20px 60px rgba(var(--accent-rgb), 0.15);

  @media (max-width: 768px) {
    padding: 40px 24px;
  }
`;

const AvatarStack = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 24px;
`;

const AvatarWrapper = styled.div<{ $isFirst?: boolean }>`
  width: 44px;
  height: 44px;
  border-radius: 50%;
  overflow: hidden;
  border: 3px solid var(--bg-color);
  margin-left: ${({ $isFirst }) => ($isFirst ? "0" : "-12px")};
  position: relative;
  flex-shrink: 0;
`;

const CTATitle = styled.h2`
  font-size: 36px;
  font-weight: 800;
  margin-bottom: 16px;
  color: var(--text-color);

  @media (max-width: 768px) {
    font-size: 28px;
  }
`;

const CTASubtitle = styled.p`
  font-size: 18px;
  color: var(--text-secondary);
  margin-bottom: 32px;
  line-height: 1.6;

  @media (max-width: 768px) {
    font-size: 16px;
  }
`;


const CTAButton = styled(PrimaryButton)`
  font-size: 20px;
  padding: 20px 48px;

  @media (max-width: 768px) {
    font-size: 18px;
    padding: 18px 36px;
    width: 100%;
  }
`;

const CTAFeatures = styled.div`
  display: flex;
  justify-content: center;
  gap: 32px;
  margin-top: 32px;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    gap: 16px;
  }
`;

const CTAFeature = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--text-secondary);
  font-size: 14px;

  svg {
    width: 18px;
    height: 18px;
    color: var(--success);
  }
`;

const RocketIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
    <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
    <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
    <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
  </svg>
);

const CheckIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

export function SecondaryCTA() {
  return (
    <CTASection>
      <CTACard>
        <AvatarStack>
          <AvatarWrapper $isFirst>
            <Image
              src="https://i.pravatar.cc/150?img=1"
              alt="Professional who achieved interview success with Rejectly AI resume optimizer"
              fill
              sizes="44px"
              style={{ objectFit: "cover" }}
            />
          </AvatarWrapper>
          <AvatarWrapper>
            <Image
              src="https://i.pravatar.cc/150?img=2"
              alt="Job seeker who transformed career using Rejectly ATS-friendly resume builder"
              fill
              sizes="44px"
              style={{ objectFit: "cover" }}
            />
          </AvatarWrapper>
          <AvatarWrapper>
            <Image
              src="https://i.pravatar.cc/150?img=3"
              alt="Tech professional who landed interviews at top companies with Rejectly"
              fill
              sizes="44px"
              style={{ objectFit: "cover" }}
            />
          </AvatarWrapper>
          <AvatarWrapper>
            <Image
              src="https://i.pravatar.cc/150?img=4"
              alt="Career changer who beat applicant tracking systems using Rejectly"
              fill
              sizes="44px"
              style={{ objectFit: "cover" }}
            />
          </AvatarWrapper>
          <AvatarWrapper>
            <Image
              src="https://i.pravatar.cc/150?img=5"
              alt="Success story from professionals who transformed job search with Rejectly"
              fill
              sizes="44px"
              style={{ objectFit: "cover" }}
            />
          </AvatarWrapper>
        </AvatarStack>

        <CTATitle>
          Still Deciding? Every Day You Wait is Another Day of Rejections.
        </CTATitle>

        <CTASubtitle>
          Join 500+ professionals who transformed their job search with Rejectly.pro.
          Stop wasting hours on applications that go nowhere. Start getting interviews
          within 7 days—or your money back.
        </CTASubtitle>

        <CTAButton href={ROUTES.AUTH.SIGNUP}>
          <RocketIcon />
          Yes, I Want to Fix My Resume Now
        </CTAButton>

        <CTAFeatures>
          <CTAFeature>
            <CheckIcon />
            No credit card required
          </CTAFeature>
          <CTAFeature>
            <CheckIcon />
            Results in 30 seconds
          </CTAFeature>
          <CTAFeature>
            <CheckIcon />
            Cancel anytime, no questions
          </CTAFeature>
        </CTAFeatures>
      </CTACard>
    </CTASection>
  );
}
