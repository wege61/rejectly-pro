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

const CVList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
`;

const CVCard = styled(SkeletonCard)``;

const CVHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: start;
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const BadgeRow = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const Footer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: ${({ theme }) => theme.spacing.md};
  border-top: 1px solid ${({ theme }) => theme.colors.border};
`;

export const CVListSkeleton: React.FC = () => {
  return (
    <Container>
      <Header>
        <HeaderContent>
          <SkeletonTitle width="200px" height="32px" />
          <SkeletonText width="350px" height="20px" />
        </HeaderContent>
        <SkeletonButton />
      </Header>

      <CVList>
        {[1, 2, 3].map((i) => (
          <CVCard key={i}>
            <CVHeader>
              <div style={{ flex: 1 }}>
                <SkeletonTitle width="60%" />
                <SkeletonText width="40%" />
              </div>
            </CVHeader>
            <BadgeRow>
              <Skeleton width="120px" height="24px" />
            </BadgeRow>
            <Footer>
              <Skeleton width="100px" height="16px" />
              <Skeleton width="80px" height="36px" />
            </Footer>
          </CVCard>
        ))}
      </CVList>
    </Container>
  );
};
