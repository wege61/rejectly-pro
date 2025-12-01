import type { Metadata } from "next";
import { BreadcrumbSchema } from "@/components/seo/StructuredData";

export const metadata: Metadata = {
  title: "Features - GPT-4 Powered Resume Analysis Tools | Rejectly.pro",
  description: "Discover powerful AI resume features: ATS optimization, keyword analysis, professional rewriting, cover letter generation, and instant job matching. Try free demo now.",
  keywords: [
    "AI resume features",
    "ATS optimization features",
    "resume analysis tools",
    "GPT-4 resume checker",
    "resume keyword analyzer",
    "professional resume rewriting",
    "AI cover letter generator",
    "job matching AI",
    "resume optimization tools",
    "ATS-friendly resume",
  ],
  openGraph: {
    title: "Features - GPT-4 Powered Resume Analysis Tools | Rejectly.pro",
    description: "Discover powerful AI resume features: ATS optimization, keyword analysis, professional rewriting, and instant job matching. Try free demo now.",
    url: "https://www.rejectly.pro/features",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Rejectly.pro AI Resume Features",
      },
    ],
  },
  alternates: {
    canonical: "https://www.rejectly.pro/features",
  },
};

export default function FeaturesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: "Home", url: "https://www.rejectly.pro" },
          { name: "Features", url: "https://www.rejectly.pro/features" },
        ]}
      />
      {children}
    </>
  );
}
