import { Footer } from "@/components/ui/Footer";
import { Hero } from "@/components/marketing/hero/Hero";
import { WhyItHappens } from "@/components/marketing/why/WhyItHappens";
import { TryIt } from "@/components/marketing/try/TryIt";
import { ToolsTour } from "@/components/marketing/tools/ToolsTour";
import { Proof } from "@/components/marketing/proof/Proof";
import { Pricing } from "@/components/marketing/pricing/Pricing";
import { FAQ } from "@/components/marketing/faq/FAQ";
import { GuidesShelf } from "@/components/marketing/guides/GuidesShelf";
import { FinalCTA } from "@/components/marketing/final/FinalCTA";

/*
 * Homepage. Every section is its own component under components/marketing;
 * this file only puts them in order. Organization, WebSite and product
 * structured data come from the root layout; the FAQ adds its own FAQPage.
 */
export default function Page() {
  return (
    <div style={{ minHeight: "100vh", background: "var(--rj-paper)", overflowX: "clip" }}>
      <Hero />
      <WhyItHappens />
      <TryIt />
      <ToolsTour />
      <Proof />
      <Pricing />
      <FAQ />
      <GuidesShelf />
      <FinalCTA />
      <Footer />
    </div>
  );
}
