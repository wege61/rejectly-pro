'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/contexts/ToastContext';
import { UserCredits, CreditsContextValue, DEFAULT_CREDITS } from '@/types/credits';

const CreditsContext = createContext<CreditsContextValue | undefined>(undefined);

interface CreditsProviderProps {
  children: ReactNode;
}

export function CreditsProvider({ children }: CreditsProviderProps) {
  const { user } = useAuth();
  const toast = useToast();
  const [credits, setCredits] = useState<UserCredits>(DEFAULT_CREDITS);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refreshCredits = useCallback(async () => {
    if (!user) {
      setCredits(DEFAULT_CREDITS);
      setIsLoading(false);
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
  }, [user]);

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

  // Notify user about credit consumption with toast
  const notifyCreditConsumed = useCallback((action: string, creditsUsed: number = 1) => {
    if (credits.hasSubscription) {
      toast.success(`${action} tamamlandı`);
      return;
    }

    const remaining = credits.credits - creditsUsed;
    const message = `${action} için ${creditsUsed} kredi kullanıldı. Kalan: ${remaining}`;

    if (remaining <= 2 && remaining > 0) {
      toast.warning(message);
    } else if (remaining <= 0) {
      toast.warning(`${message}. Kredi satın almayı unutmayın!`);
    } else {
      toast.success(message);
    }

    // Refresh to get accurate count from server
    refreshCredits();
  }, [credits, toast, refreshCredits]);

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
    notifyCreditConsumed,
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
