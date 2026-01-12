'use client';

import { useState, useCallback } from 'react';
import { useCredits } from '@/contexts/CreditsContext';

interface CreditCheckOptions {
  action: string;
  creditsRequired?: number;
  onConfirm: () => Promise<void>;
  onInsufficientCredits?: () => void;
  skipForSubscribers?: boolean;
}

export function useCreditConfirm() {
  const { credits, refreshCredits, openNoCreditsModal } = useCredits();
  const [isProcessing, setIsProcessing] = useState(false);

  const checkAndExecute = useCallback(async (options: CreditCheckOptions) => {
    const {
      creditsRequired = 1,
      onConfirm,
      onInsufficientCredits,
      skipForSubscribers = true
    } = options;

    // Pro subscribers skip credit check
    if (credits.hasSubscription && skipForSubscribers) {
      setIsProcessing(true);
      try {
        await onConfirm();
      } finally {
        setIsProcessing(false);
        await refreshCredits();
      }
      return;
    }

    // Check if user has enough credits
    if (!credits.hasSubscription && credits.credits < creditsRequired) {
      if (onInsufficientCredits) {
        onInsufficientCredits();
      } else {
        // Default: show no credits modal
        openNoCreditsModal();
      }
      return;
    }

    // Execute the action directly (no confirmation modal)
    setIsProcessing(true);
    try {
      await onConfirm();
      await refreshCredits();
    } finally {
      setIsProcessing(false);
    }
  }, [credits, refreshCredits, openNoCreditsModal]);

  return {
    isProcessing,
    canProceed: credits.hasSubscription || credits.credits > 0,
    checkAndExecute,
    // Alias for backwards compatibility
    requestCredit: checkAndExecute,
  };
}
