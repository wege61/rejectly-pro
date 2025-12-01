import type { Metadata } from "next";
import { BreadcrumbSchema } from "@/components/seo/StructuredData";

export const metadata: Metadata = {
  title: "Pricing - Affordable AI Resume Optimization | Rejectly.pro",
  description: "Simple, transparent pricing for AI resume optimization. Start at $2 for single analysis or get unlimited access for $12/month. No hidden fees, cancel anytime.",
  keywords: [
    "AI resume optimizer pricing",
    "ATS checker cost",
    "resume analysis pricing",
    "affordable resume optimization",
    "resume checker plans",
    "AI resume subscription",
    "pay per resume analysis",
    "resume optimization cost",
    "ATS optimization pricing",
    "professional resume pricing",
  ],
  openGraph: {
    title: "Pricing - Affordable AI Resume Optimization | Rejectly.pro",
    description: "Simple, transparent pricing for AI resume optimization. Start at $2 for single analysis or get unlimited access for $12/month. No hidden fees.",
    url: "https://rejectly.pro/pricing",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Rejectly.pro Pricing Plans",
      },
    ],
  },
  alternates: {
    canonical: "https://rejectly.pro/pricing",
  },
};

export default function PricingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: "Home", url: "https://rejectly.pro" },
          { name: "Pricing", url: "https://rejectly.pro/pricing" },
        ]}
      />
      {children}
    </>
  );
}
