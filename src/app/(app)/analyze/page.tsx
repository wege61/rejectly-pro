"use client";

import styled from "styled-components";
import { useState, useEffect } from "react";
import { OnboardingWizard } from "@/components/ui/OnboardingWizard";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/lib/constants";
import { CreditsCard } from "@/components/dashboard/CreditsCard";

const Container = styled.div`
  position: relative;
  padding-top: 24px;
  max-width: 1200px;
  margin: 0 auto;
  padding-left: ${({ theme }) => theme.spacing["2xl"]};
  padding-right: ${({ theme }) => theme.spacing["2xl"]};
  padding-bottom: 100px; /* Space for FAB */
  overflow-x: hidden;

  @media (max-width: 450px) {
    padding: ${({ theme }) => theme.spacing["lg"]};
    padding-top: 24px;
  }
`;

const Header = styled.div`
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 24px;
  margin-bottom: 48px;

  @media (max-width: 768px) {
    align-items: flex-start;
    gap: 12px;
    margin-bottom: 24px;
  }
`;

const TitleElements = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  min-width: 0;
  gap: 4px;
`;

const Title = styled.h1`
  font-size: 36px;
  font-weight: 700;
  letter-spacing: -0.03em;
  color: rgba(255, 255, 255, 0.95);
  line-height: 1.1;
  margin: 0;

  @media (max-width: 768px) {
    font-size: 24px;
    margin-bottom: 4px;
  }
`;

const Subtitle = styled.p`
  font-size: 15px;
  color: rgba(255, 255, 255, 0.6);
  font-weight: 500;
  letter-spacing: -0.01em;
  margin: 0;

  @media (max-width: 768px) {
    order: 3;
    font-size: 14px;
  }
`;

const CreditsCardWrapper = styled.div`
  flex-shrink: 0;

  @media (max-width: 768px) {
    width: auto;
    
    > div {
      width: auto;
    }
  }
`;

export default function AnalyzePage() {
  const router = useRouter();
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Free reports don't require credits, always open the wizard
    setIsWizardOpen(true);
    setIsLoading(false);
  }, []);

  const handleWizardClose = () => {
    setIsWizardOpen(false);
    router.replace(ROUTES.APP.DASHBOARD);
  };

  const handleWizardComplete = () => {
    setIsWizardOpen(false);
    // Will redirect to report in the wizard itself
  };

  if (isLoading) {
    return (
      <Container>
        <Header>
          <TitleElements>
            <Title>Create New Analysis</Title>
            <Subtitle>Loading...</Subtitle>
          </TitleElements>
          <CreditsCardWrapper>
            <CreditsCard />
          </CreditsCardWrapper>
        </Header>
      </Container>
    );
  }

  return (
    <>
      <Container>
        <Header>
          <TitleElements>
            <Title>Create New Analysis</Title>
            <Subtitle>
              Upload your CV and select a job posting to generate your
              personalized match report
            </Subtitle>
          </TitleElements>
          <CreditsCardWrapper>
            <CreditsCard />
          </CreditsCardWrapper>
        </Header>

      </Container>

      <OnboardingWizard
        isOpen={isWizardOpen}
        onClose={handleWizardClose}
        onComplete={handleWizardComplete}
      />
    </>
  );
}
