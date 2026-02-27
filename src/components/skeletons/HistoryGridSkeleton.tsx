"use client";

import styled from "styled-components";
import {
  Skeleton,
  SkeletonCard,
  SkeletonTitle,
  SkeletonText,
} from "@/components/ui/Skeleton";

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
  gap: 16px;

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

const Card = styled(SkeletonCard)`
  min-height: 200px;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 24px;
`;

const ScorePlaceholder = styled(Skeleton)`
  width: 80px;
  height: 48px;
  margin-bottom: 12px;
  border-radius: 8px;
`;

const MetaRow = styled.div`
  margin-top: 4px;
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

export const HistoryGridSkeleton = () => {
  return (
    <Grid>
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <Card key={i}>
          <ScorePlaceholder />
          <MetaRow>
            <SkeletonTitle width="60%" height="20px" className="mb-1" />
            <SkeletonText width="40%" height="14px" />
          </MetaRow>
        </Card>
      ))}
    </Grid>
  );
};
