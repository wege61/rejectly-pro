import { Pricing } from "@/components/marketing/pricing/Pricing";
import { PricingDetails } from "@/components/marketing/pricing/PricingDetails";
import { Footer } from "@/components/ui/Footer";

/*
 * /pricing. The top is the homepage's pricing section (one source for prices,
 * the planner and the receipt), as the page's h1. Product and price structured
 * data come from the root layout; this route's layout adds the breadcrumb and
 * the FAQPage.
 */
export default function PricingPage() {
  return (
    <div style={{ minHeight: "100vh", background: "var(--rj-paper)", overflowX: "clip" }}>
      <Pricing page />
      <PricingDetails />
      <Footer />
    </div>
  );
}
