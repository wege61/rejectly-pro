"use client";

import { AtsCheck } from "@/components/ats-check/AtsCheck";
import { AtsCheckInfo } from "@/components/ats-check/AtsCheckInfo";
import { Footer } from "@/components/ui/Footer";

export default function ATSCheckClient() {
  return (
    <div style={{ minHeight: "100vh", background: "var(--rj-paper)", overflowX: "clip" }}>
      <AtsCheck />
      <AtsCheckInfo />
      <Footer />
    </div>
  );
}
