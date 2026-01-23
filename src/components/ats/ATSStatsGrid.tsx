"use client";

import styled from "styled-components";

interface ATSStatsGridProps {
  stats: {
    hardSkillsCount: number;
    softSkillsCount?: number;
    actionVerbsCount: number;
    quantifiedAchievements: number;
  };
  wordCount?: number;
}

const Container = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
`;

const StatCard = styled.div`
  background: var(--bg-alt, #f9fafb);
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 8px;
  padding: 16px;
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const StatValue = styled.div`
  font-size: 24px;
  font-weight: 700;
  color: var(--text-color, #1f2937);
`;

const StatLabel = styled.div`
  font-size: 11px;
  font-weight: 500;
  color: var(--text-secondary, #6b7280);
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

export function ATSStatsGrid({ stats, wordCount }: ATSStatsGridProps) {
  return (
    <Container>
      <StatCard>
        <StatValue>{stats.hardSkillsCount}</StatValue>
        <StatLabel>Hard Skills</StatLabel>
      </StatCard>
      <StatCard>
        <StatValue>{stats.actionVerbsCount}</StatValue>
        <StatLabel>Action Verbs</StatLabel>
      </StatCard>
      <StatCard>
        <StatValue>{stats.quantifiedAchievements}</StatValue>
        <StatLabel>Metrics</StatLabel>
      </StatCard>
      <StatCard>
        <StatValue>{wordCount || "-"}</StatValue>
        <StatLabel>Words</StatLabel>
      </StatCard>
    </Container>
  );
}

export default ATSStatsGrid;
