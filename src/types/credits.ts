/**
 * Central type definitions for credits system
 */

export interface UserCredits {
  credits: number;
  hasSubscription: boolean;
  canAnalyze: boolean;
  subscriptionStatus?: string;
  subscriptionPlan?: string;
  subscriptionEndDate?: string;
}

export interface CreditsContextValue {
  credits: UserCredits;
  isLoading: boolean;
  error: string | null;
  refreshCredits: () => Promise<void>;
  consumeCredit: () => Promise<boolean>;
}

export const DEFAULT_CREDITS: UserCredits = {
  credits: 0,
  hasSubscription: false,
  canAnalyze: false,
};
