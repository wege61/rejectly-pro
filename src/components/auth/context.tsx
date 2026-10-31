"use client";

import { useEffect, useState } from "react";
import { PRICING, ROUTES } from "@/lib/constants";
import { loadScan } from "@/lib/ats/savedScan";
import { safeRedirect } from "@/lib/safeRedirect";
import type { GeneratedCV } from "@/types/cv";
import { FIX } from "@/components/cv-builder/AtsMeter";

/*
 * Where the visitor was before the sign-in page: read from ?redirect= and from
 * what's already saved in this browser (the builder's draft, a free scan). The
 * page uses it to say what happens next. With no matching data it falls back
 * to "direct".
 */

export type AuthContextKind = "builder" | "scan" | "pricing" | "direct";

export interface AuthContextInfo {
  kind: AuthContextKind;
  redirect: string;
  back: { href: string; label: string };
  builder?: { name: string; contact: string; sections: string[]; score: number | null; toFix: number | null };
  scan?: { fileName: string; score: number; toFix: number; top: { name: string; points: number }[] };
  plan?: { id: "single" | "starter" | "pro"; name: string; price: number; detail: string; step: string };
}

const PLANS = {
  single: { name: "Single", price: PRICING.SINGLE.price, detail: "1 credit · one Job Match or ATS Optimizer run" },
  starter: { name: "Starter", price: PRICING.STARTER.price, detail: `${PRICING.STARTER.credits} credits · one per Job Match or ATS Optimizer run` },
  pro: { name: "Pro", price: PRICING.PRO.price, detail: `${PRICING.PRO.runsPerPeriod} runs a month · cancel anytime` },
} as const;

function readBuilderDraft(): GeneratedCV | null {
  try {
    const raw = localStorage.getItem("rejectly-cv-builder-storage");
    const cv = raw ? (JSON.parse(raw)?.state?.cv as GeneratedCV | undefined) : undefined;
    return cv?.contact?.name?.trim() ? cv : null;
  } catch {
    return null;
  }
}

export function useAuthContext(): AuthContextInfo {
  const [info, setInfo] = useState<AuthContextInfo>({
    kind: "direct",
    redirect: ROUTES.APP.DASHBOARD,
    back: { href: ROUTES.PUBLIC.HOME, label: "Rejectly home" },
  });

  useEffect(() => {
    const redirect = safeRedirect(new URLSearchParams(window.location.search).get("redirect"), ROUTES.APP.DASHBOARD);
    const url = new URL(redirect, window.location.origin);
    const direct = { kind: "direct" as const, redirect, back: { href: ROUTES.PUBLIC.HOME, label: "Rejectly home" } };

    if (url.pathname === ROUTES.PUBLIC.CV_BUILDER) {
      const cv = readBuilderDraft();
      if (!cv) return setInfo({ ...direct, back: { href: ROUTES.PUBLIC.CV_BUILDER, label: "Back to the builder" } });
      const sections = [cv.education?.length && "EDUCATION", cv.experience?.length && "EXPERIENCE", cv.projects?.length && "PROJECTS", cv.skills?.technical?.length && "SKILLS"].filter(Boolean) as string[];
      const base: AuthContextInfo = {
        kind: "builder",
        redirect,
        back: { href: ROUTES.PUBLIC.CV_BUILDER, label: "Back to the builder" },
        builder: { name: cv.contact.name, contact: [cv.contact.email, cv.contact.phone, cv.contact.location].filter(Boolean).join(" · "), sections, score: null, toFix: null },
      };
      setInfo(base);
      // Score it the way the builder does, without loading the PDF code up front.
      Promise.all([import("@/lib/pdf/cvGenerator"), import("@/lib/ats/deterministicScoring")]).then(([pdf, scorer]) => {
        const r = scorer.calculateDeterministicScore(pdf.cvPlainText(cv));
        const toFix = Object.values(r.categories).flatMap((c) => c.checks).filter((c) => !c.passed).length;
        setInfo((cur) => (cur.kind === "builder" && cur.builder ? { ...cur, builder: { ...cur.builder, score: r.overallScore, toFix } } : cur));
      }).catch(() => {});
      return;
    }

    if (url.pathname === ROUTES.PUBLIC.ATS_CHECK) {
      const saved = loadScan();
      if (!saved) return setInfo({ ...direct, back: { href: ROUTES.PUBLIC.ATS_CHECK, label: "Back to the scan" } });
      const failed = Object.values(saved.result.categories).flatMap((c) => c?.checks ?? []).filter((c) => c && !c.passed).sort((a, b) => b.points - a.points);
      return setInfo({
        kind: "scan",
        redirect,
        back: { href: `${ROUTES.PUBLIC.ATS_CHECK}?restore=1`, label: "Back to your scan" },
        scan: { fileName: saved.fileName, score: saved.result.overallScore, toFix: failed.length, top: failed.slice(0, 3).map((c) => ({ name: FIX[c.name] ?? c.name, points: c.points })) },
      });
    }

    const plan = url.pathname === ROUTES.APP.BILLING ? url.searchParams.get("plan") : null;
    if (plan === "single" || plan === "starter" || plan === "pro") {
      return setInfo({
        kind: "pricing",
        redirect,
        back: { href: ROUTES.PUBLIC.PRICING, label: "Back to pricing" },
        plan: { id: plan, ...PLANS[plan], step: "Step 2 of 3" },
      });
    }

    setInfo(direct);
  }, []);

  return info;
}

/** The words that change with where the visitor came from. */
export function contextCopy(info: AuthContextInfo) {
  switch (info.kind) {
    case "builder":
      return {
        eyebrow: "Step 2 of 2 · Download",
        signup: { title: ["Create a free account to ", "download", " your resume."], lead: "Your resume is saved to your account, then the PDF downloads.", button: "Create account and download" },
        login: { title: "Log in to download your resume.", button: "Log in and download" },
      };
    case "scan":
      return {
        eyebrow: "Save your scan",
        signup: { title: ["Keep your scan and its ", "fixes", "."], lead: "Your score and all 19 checks go to your dashboard. The scan stays free.", button: "Create account and save" },
        login: { title: "Log in to save your scan.", button: "Log in and save" },
      };
    case "pricing":
      return {
        eyebrow: `${info.plan?.step} · ${info.plan?.name}, $${info.plan?.price}`,
        signup: { title: ["One step before ", "checkout", "."], lead: "Credits are added to your account, so we need one first.", button: "Create account and continue" },
        login: { title: "Log in to continue to checkout.", button: "Log in and continue" },
      };
    default:
      return {
        eyebrow: "Free account",
        signup: { title: ["Create your ", "free", " account."], lead: "No card. Your scans, resumes and reports in one place.", button: "Create account" },
        login: { title: "Welcome back.", button: "Log in" },
      };
  }
}
