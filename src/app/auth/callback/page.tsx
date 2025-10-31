"use client";

import { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { ROUTES } from "@/lib/constants";
import styled from "styled-components";

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  color: ${({ theme }) => theme.colors.textSecondary};
`;

export default function AuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const run = async () => {
      const supabase = createClient();

      const code = searchParams.get("code"); // PKCE kodu
      const next = searchParams.get("next") || ROUTES.AUTH.RESET_PASSWORD;
      // bazı akışlarda token_hash veya token gelir:
      const token_hash =
        searchParams.get("token_hash") || searchParams.get("token");

      try {
        if (code) {
          // PKCE akışı
          await supabase.auth.exchangeCodeForSession(code);
          // BAŞARILI İSE: next varsa ona git
          router.push(next || ROUTES.APP.DASHBOARD);
          return;
        }

        if (token_hash) {
          // PKCE yoksa (başka sekme/cihaz), recovery/magic link doğrulama
          await supabase.auth.verifyOtp({ type: "recovery", token_hash });
          router.push(next || ROUTES.APP.DASHBOARD);
          return;
        }

        // hiçbir kod yoksa
        router.push(ROUTES.AUTH.LOGIN);
      } catch (e: any) {
        // code_verifier hatası durumunda verifyOtp fallback dene
        if (String(e?.message || e).includes("code verifier") && token_hash) {
          try {
            await supabase.auth.verifyOtp({ type: "recovery", token_hash });
            router.push(next || ROUTES.APP.DASHBOARD);
            return;
          } catch {}
        }
        console.error("Auth callback error:", e);
        router.push(ROUTES.AUTH.LOGIN);
      }
    };

    run();
  }, [router, searchParams]);

  return (
    <Suspense>
      <Container>Processing authentication...</Container>
    </Suspense>
  );
}
