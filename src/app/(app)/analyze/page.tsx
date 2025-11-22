"use client";

import styled from "styled-components";
import { useState, useEffect } from "react";
import { OnboardingWizard } from "@/components/ui/OnboardingWizard";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/lib/constants";

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: ${({ theme }) => theme.spacing["2xl"]};
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: ${({ theme }) => theme.spacing["3xl"]};
`;

const Title = styled.h1`
  font-size: ${({ theme }) => theme.typography.fontSize["4xl"]};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  margin-bottom: ${({ theme }) => theme.spacing.md};
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const Subtitle = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  color: ${({ theme }) => theme.colors.textSecondary};
  max-width: 600px;
  margin: 0 auto;
`;

export default function AnalyzePage() {
  const router = useRouter();
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Free rapor için kredi gerekmez, wizard'ı her zaman aç
    setIsWizardOpen(true);
    setIsLoading(false);
  }, []);

  const handleWizardClose = () => {
    setIsWizardOpen(false);
    router.push(ROUTES.APP.DASHBOARD);
  };

  const handleWizardComplete = () => {
    setIsWizardOpen(false);
    // Will redirect to report in the wizard itself
  };

  if (isLoading) {
    return (
      <Container>
        <Header>
          <Title>Create New Analysis</Title>
          <Subtitle>Loading...</Subtitle>
        </Header>
      </Container>
    );
  }

  return (
    <>
      <Container>
        <Header>
          <Title>Create New Analysis</Title>
          <Subtitle>
            Upload your CV and select a job posting to generate your
            personalized match report
          </Subtitle>
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
