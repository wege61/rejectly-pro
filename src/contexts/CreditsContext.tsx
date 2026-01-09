'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { UserCredits, CreditsContextValue, DEFAULT_CREDITS } from '@/types/credits';

const CreditsContext = createContext<CreditsContextValue | undefined>(undefined);

interface CreditsProviderProps {
  children: ReactNode;
}

export function CreditsProvider({ children }: CreditsProviderProps) {
  const { user, loading: authLoading } = useAuth();
  const [credits, setCredits] = useState<UserCredits>(DEFAULT_CREDITS);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refreshCredits = useCallback(async () => {
    if (!user) {
      setCredits(DEFAULT_CREDITS);
      // Only set isLoading to false if auth has finished loading
      // This prevents showing 0 credits while auth is still loading
      if (!authLoading) {
        setIsLoading(false);
      }
      return;
    }

    try {
      setError(null);
      const response = await fetch('/api/user/credits');

      if (!response.ok) {
        throw new Error('Failed to fetch credits');
      }

      const data = await response.json();
      setCredits({
        credits: data.credits ?? 0,
        hasSubscription: data.hasSubscription ?? false,
        canAnalyze: data.canAnalyze ?? false,
        subscriptionStatus: data.subscriptionStatus,
        subscriptionPlan: data.subscriptionPlan,
        subscriptionEndDate: data.subscriptionEndDate,
      });
    } catch (err) {
      console.error('Error fetching credits:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch credits');
    } finally {
      setIsLoading(false);
    }
  }, [user, authLoading]);

  // Consume a credit locally (optimistic update)
  const consumeCredit = useCallback(async (): Promise<boolean> => {
    if (credits.hasSubscription) {
      // Pro users don't consume credits
      return true;
    }

    if (credits.credits <= 0) {
      return false;
    }

    // Optimistic update
    setCredits(prev => ({
      ...prev,
      credits: Math.max(0, prev.credits - 1),
      canAnalyze: prev.credits - 1 > 0 || prev.hasSubscription,
    }));

    return true;
  }, [credits]);

  // Fetch credits on mount and when user changes
  useEffect(() => {
    refreshCredits();
  }, [refreshCredits]);

  const value: CreditsContextValue = {
    credits,
    isLoading,
    error,
    refreshCredits,
    consumeCredit,
  };

  return (
    <CreditsContext.Provider value={value}>
      {children}
    </CreditsContext.Provider>
  );
}

export function useCredits(): CreditsContextValue {
  const context = useContext(CreditsContext);

  if (context === undefined) {
    throw new Error('useCredits must be used within a CreditsProvider');
  }

  return context;
}

// Export for convenience
export { CreditsContext };
