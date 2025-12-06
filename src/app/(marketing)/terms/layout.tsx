import type { Metadata } from "next";
import { BreadcrumbSchema } from "@/components/seo/StructuredData";

export const metadata: Metadata = {
  title: "Terms of Service - User Agreement | Rejectly.pro",
  description: "Read Rejectly.pro terms of service. Understand your rights and responsibilities when using our AI resume optimization platform, billing, and account policies.",
  keywords: [
    "terms of service",
    "user agreement",
    "service terms",
    "platform policies",
    "billing terms",
    "subscription agreement",
    "acceptable use policy",
    "intellectual property",
    "account terms",
    "legal agreement",
  ],
  openGraph: {
    title: "Terms of Service - User Agreement | Rejectly.pro",
    description: "Read our terms of service for using Rejectly.pro AI resume optimization platform. Clear policies on accounts, billing, and usage.",
    url: "https://www.rejectly.pro/terms",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Rejectly.pro Terms of Service",
      },
    ],
  },
  alternates: {
    canonical: "https://www.rejectly.pro/terms",
  },
};

export default function TermsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: "Home", url: "https://www.rejectly.pro" },
          { name: "Terms of Service", url: "https://www.rejectly.pro/terms" },
        ]}
      />
      {children}
    </>
  );
}
