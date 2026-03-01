"use client";

import { Turnstile as TurnstileWidget, type TurnstileInstance } from "@marsidev/react-turnstile";
import { forwardRef, useImperativeHandle, useRef, useCallback } from "react";
import styled from "styled-components";

const TurnstileContainer = styled.div`
  display: flex;
  justify-content: center;
  margin: 16px 0;

  /* Ensure the widget is visible */
  & > div {
    min-height: 65px;
  }
`;

const ErrorMessage = styled.p`
  color: var(--error);
  font-size: 12px;
  text-align: center;
  margin-top: 8px;
`;

export interface TurnstileRef {
  reset: () => void;
  getToken: () => string | null;
}

interface TurnstileProps {
  onVerify: (token: string) => void;
  onError?: (error?: string) => void;
  onExpire?: () => void;
  error?: string;
  theme?: "light" | "dark" | "auto";
}

export const Turnstile = forwardRef<TurnstileRef, TurnstileProps>(
  function Turnstile(
    { onVerify, onError, onExpire, error, theme = "auto" },
    ref
  ) {
    const widgetRef = useRef<TurnstileInstance>(null);
    const tokenRef = useRef<string | null>(null);

    const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

    useImperativeHandle(ref, () => ({
      reset: () => {
        tokenRef.current = null;
        widgetRef.current?.reset();
      },
      getToken: () => tokenRef.current,
    }));

    const handleVerify = useCallback(
      (token: string) => {
        tokenRef.current = token;
        onVerify(token);
      },
      [onVerify]
    );

    const handleError = useCallback(
      (errorCode?: string) => {
        tokenRef.current = null;
        onError?.(errorCode);
      },
      [onError]
    );

    const handleExpire = useCallback(() => {
      tokenRef.current = null;
      onExpire?.();
    }, [onExpire]);

    // If no site key is configured, render nothing (skip CAPTCHA)
    if (!siteKey) {
      return null;
    }

    return (
      <TurnstileContainer>
        <div>
          <TurnstileWidget
            ref={widgetRef}
            siteKey={siteKey}
            onSuccess={handleVerify}
            onError={handleError}
            onExpire={handleExpire}
            options={{
              theme,
              size: "normal",
            }}
          />
          {error && <ErrorMessage>{error}</ErrorMessage>}
        </div>
      </TurnstileContainer>
    );
  }
);

export default Turnstile;
