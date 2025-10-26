"use client";

import styled from "styled-components";
import {
  Skeleton,
  SkeletonCard,
  SkeletonTitle,
  SkeletonText,
  SkeletonButton,
} from "@/components/ui/Skeleton";

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: ${({ theme }) => theme.spacing["2xl"]};
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${({ theme }) => theme.spacing["2xl"]};
`;

const HeaderContent = styled.div``;

const JobsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
`;

const JobCard = styled(SkeletonCard)``;

const JobHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: start;
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const Footer = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding-top: ${({ theme }) => theme.spacing.md};
  border-top: 1px solid ${({ theme }) => theme.colors.border};
`;

export const JobsListSkeleton: React.FC = () => {
  return (
    <Container>
      <Header>
        <HeaderContent>
          <SkeletonTitle width="220px" height="32px" />
          <SkeletonText width="380px" height="20px" />
        </HeaderContent>
        <SkeletonButton />
      </Header>

      <JobsList>
        {[1, 2, 3, 4].map((i) => (
          <JobCard key={i}>
            <JobHeader>
              <div style={{ flex: 1 }}>
                <SkeletonTitle width="70%" />
                <SkeletonText width="30%" />
              </div>
              <Skeleton width="100px" height="24px" />
            </JobHeader>
            <Footer>
              <Skeleton width="80px" height="36px" />
            </Footer>
          </JobCard>
        ))}
      </JobsList>
    </Container>
  );
};
