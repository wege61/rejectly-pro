import type { Metadata } from "next";
import { BreadcrumbSchema } from "@/components/seo/StructuredData";
import { PRICING_FAQS } from "@/components/marketing/pricing/faq";
import { PRICING } from "@/lib/constants";

const TITLE = "Pricing: Free ATS Scan, Credits from $2 | Rejectly.pro";
const DESCRIPTION = `The ATS scan and job match demo are free. A Job Match or ATS Optimizer run is 1 credit ($${PRICING.SINGLE.price}), ${PRICING.STARTER.credits} credits are $${PRICING.STARTER.price}, or Pro is $${PRICING.PRO.price}/month for ${PRICING.PRO.runsPerPeriod} runs. Credits never expire.`;

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  keywords: [
    "ats resume checker pricing",
    "resume optimizer pricing",
    "ats checker cost",
    "resume analysis pricing",
    "pay per resume analysis",
    "resume checker plans",
    "free ats scan",
  ],
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: "https://rejectly.pro/pricing",
    type: "website",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Rejectly.pro pricing" }],
  },
  alternates: {
    canonical: "https://rejectly.pro/pricing",
  },
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: PRICING_FAQS.map((f) => ({
    "@type": "Question",
    name: f.question,
    acceptedAnswer: { "@type": "Answer", text: f.answer },
  })),
};

export default function PricingLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: "Home", url: "https://rejectly.pro" },
          { name: "Pricing", url: "https://rejectly.pro/pricing" },
        ]}
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      {children}
    </>
  );
}
