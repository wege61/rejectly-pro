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

const ReportsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
`;

const ReportCard = styled(SkeletonCard)`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
`;

const ReportHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: start;
`;

const ReportScore = styled(Skeleton)`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  flex-shrink: 0;
`;

const BadgeRow = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
`;

export const ReportsListSkeleton: React.FC = () => {
  return (
    <Container>
      <Header>
        <SkeletonTitle width="250px" height="32px" />
        <SkeletonText width="400px" height="20px" />
      </Header>

      <ReportsList>
        {[1, 2, 3, 4, 5].map((i) => (
          <ReportCard key={i}>
            <ReportHeader>
              <div style={{ flex: 1 }}>
                <SkeletonTitle width="50%" />
                <SkeletonText width="30%" />
              </div>
              <ReportScore />
            </ReportHeader>
            <BadgeRow>
              <Skeleton width="60px" height="24px" />
              <Skeleton width="100px" height="24px" />
            </BadgeRow>
            <SkeletonText width="100%" />
            <SkeletonText width="85%" />
          </ReportCard>
        ))}
      </ReportsList>
    </Container>
  );
};
