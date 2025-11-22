"use client";

import styled from "styled-components";
import { useState, useEffect } from "react";
import { OnboardingWizard } from "@/components/ui/OnboardingWizard";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/lib/constants";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

interface UserCredits {
  credits: number;
  hasSubscription: boolean;
  canAnalyze: boolean;
}

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

const NoCreditsCard = styled(Card)`
  max-width: 500px;
  margin: 0 auto;
  text-align: center;
  background: linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(220, 38, 38, 0.1) 100%);
  border: 1px solid rgba(239, 68, 68, 0.3);
`;

const NoCreditsTitle = styled.h3`
  font-size: ${({ theme }) => theme.typography.fontSize.xl};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
  color: ${({ theme }) => theme.colors.error};
`;

const NoCreditsDescription = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const CreditsInfo = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.md};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  padding: ${({ theme }) => theme.spacing.md};
  background: ${({ theme }) => theme.colors.backgroundAlt};
  border-radius: ${({ theme }) => theme.radius.md};
`;

const CreditsValue = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSize["2xl"]};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.primary};
`;

const CreditsLabel = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
`;

export default function AnalyzePage() {
  const router = useRouter();
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [userCredits, setUserCredits] = useState<UserCredits | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchCredits() {
      try {
        const response = await fetch("/api/user/credits");
        if (response.ok) {
          const data = await response.json();
          setUserCredits(data);
          // Kredi varsa veya abonelik varsa wizard'ı aç
          if (data.canAnalyze) {
            setIsWizardOpen(true);
          }
        }
      } catch (error) {
        console.error("Error fetching credits:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchCredits();
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

        {/* Kredi yoksa uyarı göster */}
        {userCredits && !userCredits.canAnalyze && (
          <NoCreditsCard variant="elevated">
            <Card.Content>
              <NoCreditsTitle>No Credits Available</NoCreditsTitle>
              <NoCreditsDescription>
                You need credits or an active subscription to create a Pro analysis.
              </NoCreditsDescription>
              <CreditsInfo>
                <div>
                  <CreditsValue>{userCredits.credits}</CreditsValue>
                  <CreditsLabel> credits remaining</CreditsLabel>
                </div>
              </CreditsInfo>
              <Button onClick={() => router.push(ROUTES.APP.BILLING)} fullWidth>
                Buy Credits
              </Button>
            </Card.Content>
          </NoCreditsCard>
        )}
      </Container>

      {userCredits?.canAnalyze && (
        <OnboardingWizard
          isOpen={isWizardOpen}
          onClose={handleWizardClose}
          onComplete={handleWizardComplete}
        />
      )}
    </>
  );
}
