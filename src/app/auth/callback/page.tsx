"use client";

import { Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { ROUTES } from "@/lib/constants";
import styled from "styled-components";

/* ------------------------------------------------------
   ✅ Build-time hata önleyici konfigürasyonlar
------------------------------------------------------ */
export const dynamic = "force-static";
export const fetchCache = "force-no-store";
export const preferredRegion = "auto";
export const runtime = "edge";

/* ------------------------------------------------------
   ✅ Basit stiller
------------------------------------------------------ */
const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  color: ${({ theme }) => theme.colors.textSecondary};
`;

/* ------------------------------------------------------
   ✅ Sayfanın asıl işlevi
------------------------------------------------------ */
function AuthCallbackInner() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const handleAuthCallback = async () => {
      const supabase = createClient();

      const code = searchParams.get("code"); // PKCE kodu
      const next = searchParams.get("next") || ROUTES.AUTH.RESET_PASSWORD;
      const token_hash =
        searchParams.get("token_hash") || searchParams.get("token");

      try {
        // 1️⃣ PKCE oturum değişimi
        if (code) {
          await supabase.auth.exchangeCodeForSession(code);
          router.push(next || ROUTES.APP.DASHBOARD);
          return;
        }

        // 2️⃣ Recovery veya magic link fallback
        if (token_hash) {
          await supabase.auth.verifyOtp({ type: "recovery", token_hash });
          router.push(next || ROUTES.APP.DASHBOARD);
          return;
        }

        // 3️⃣ Parametre yoksa login’e yönlendir
        router.push(ROUTES.AUTH.LOGIN);
      } catch (e: any) {
        // 4️⃣ PKCE hatası durumunda fallback
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

    handleAuthCallback();
  }, [router, searchParams]);

  return <Container>Processing authentication...</Container>;
}

/* ------------------------------------------------------
   ✅ Suspense sarmalı: useSearchParams hatasını önler
------------------------------------------------------ */
export default function AuthCallbackPage() {
  return (
    <Suspense fallback={<Container>Processing authentication...</Container>}>
      <AuthCallbackInner />
    </Suspense>
  );
}
