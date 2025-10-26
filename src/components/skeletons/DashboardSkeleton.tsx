"use client";

import styled from "styled-components";
import {
  Skeleton,
  SkeletonCard,
  SkeletonTitle,
  SkeletonText,
} from "@/components/ui/Skeleton";

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: ${({ theme }) => theme.spacing["2xl"]};
`;

const Header = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing["2xl"]};
`;

const Grid = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.spacing.lg};
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  margin-bottom: ${({ theme }) => theme.spacing["2xl"]};
`;

const StatCard = styled(SkeletonCard)`
  text-align: center;
`;

const StatValue = styled(Skeleton)`
  width: 80px;
  height: 48px;
  margin: 0 auto ${({ theme }) => theme.spacing.sm};
`;

const StatLabel = styled(Skeleton)`
  width: 120px;
  height: 16px;
  margin: 0 auto;
`;

const Section = styled.section`
  margin-bottom: ${({ theme }) => theme.spacing["2xl"]};
`;

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const ReportCard = styled(SkeletonCard)`
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const ReportHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: start;
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const ReportScore = styled(Skeleton)`
  width: 60px;
  height: 60px;
  border-radius: 50%;
`;

export const DashboardSkeleton: React.FC = () => {
  return (
    <Container>
      <Header>
        <SkeletonTitle width="300px" height="32px" />
        <SkeletonText width="400px" height="20px" />
      </Header>

      {/* Stats Grid */}
      <Grid>
        {[1, 2, 3].map((i) => (
          <StatCard key={i}>
            <StatValue />
            <StatLabel />
          </StatCard>
        ))}
      </Grid>

      {/* Quick Actions */}
      <Section>
        <SectionHeader>
          <Skeleton width="200px" height="24px" />
        </SectionHeader>
        <Grid>
          {[1, 2, 3].map((i) => (
            <SkeletonCard key={i}>
              <SkeletonTitle width="70%" />
              <SkeletonText width="90%" />
              <SkeletonText width="60%" />
            </SkeletonCard>
          ))}
        </Grid>
      </Section>

      {/* Recent Reports */}
      <Section>
        <SectionHeader>
          <Skeleton width="180px" height="24px" />
          <Skeleton width="100px" height="36px" />
        </SectionHeader>
        {[1, 2, 3].map((i) => (
          <ReportCard key={i}>
            <ReportHeader>
              <div style={{ flex: 1 }}>
                <SkeletonTitle width="60%" />
                <SkeletonText width="40%" />
              </div>
              <ReportScore />
            </ReportHeader>
            <div style={{ display: "flex", gap: "8px", marginBottom: "12px" }}>
              <Skeleton width="80px" height="24px" />
              <Skeleton width="60px" height="24px" />
            </div>
            <SkeletonText width="100%" />
            <SkeletonText width="80%" />
          </ReportCard>
        ))}
      </Section>
    </Container>
  );
};
