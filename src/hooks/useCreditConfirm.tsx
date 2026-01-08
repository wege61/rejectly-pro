'use client';

import { useState, useCallback } from 'react';
import { useCredits } from '@/contexts/CreditsContext';

interface CreditConfirmOptions {
  action: string; // "ATS Analizi", "Pro Rapor", "CV Optimizasyonu"
  creditsRequired?: number;
  onConfirm: () => Promise<void>;
  onCancel?: () => void;
  skipConfirmForSubscribers?: boolean;
}

interface CreditConfirmState {
  isOpen: boolean;
  action: string;
  creditsRequired: number;
  currentCredits: number;
  hasSubscription: boolean;
}

export function useCreditConfirm() {
  const { credits, refreshCredits } = useCredits();
  const [state, setState] = useState<CreditConfirmState>({
    isOpen: false,
    action: '',
    creditsRequired: 1,
    currentCredits: 0,
    hasSubscription: false,
  });
  const [pendingAction, setPendingAction] = useState<(() => Promise<void>) | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const requestCredit = useCallback(async (options: CreditConfirmOptions) => {
    const {
      action,
      creditsRequired = 1,
      onConfirm,
      onCancel,
      skipConfirmForSubscribers = true
    } = options;

    // Pro subscribers skip confirmation
    if (credits.hasSubscription && skipConfirmForSubscribers) {
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
      setState({
        isOpen: true,
        action,
        creditsRequired,
        currentCredits: credits.credits,
        hasSubscription: false,
      });
      setPendingAction(null); // No action possible
      return;
    }

    // Show confirmation modal
    setState({
      isOpen: true,
      action,
      creditsRequired,
      currentCredits: credits.credits,
      hasSubscription: credits.hasSubscription,
    });
    setPendingAction(() => onConfirm);
  }, [credits, refreshCredits]);

  const confirm = useCallback(async () => {
    if (!pendingAction) return;

    setIsProcessing(true);
    try {
      await pendingAction();
      await refreshCredits();
    } finally {
      setIsProcessing(false);
      setState(prev => ({ ...prev, isOpen: false }));
      setPendingAction(null);
    }
  }, [pendingAction, refreshCredits]);

  const cancel = useCallback(() => {
    setState(prev => ({ ...prev, isOpen: false }));
    setPendingAction(null);
  }, []);

  return {
    state,
    isProcessing,
    canProceed: state.hasSubscription || state.currentCredits >= state.creditsRequired,
    requestCredit,
    confirm,
    cancel,
  };
}
