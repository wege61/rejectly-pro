import type { Metadata } from "next";
import { BreadcrumbSchema } from "@/components/seo/StructuredData";

export const metadata: Metadata = {
  title: "About - AI Resume Optimizer Company | Rejectly.pro",
  description: "Learn about Rejectly.pro, the AI-powered resume optimization platform helping 50K+ job seekers land their dream jobs. Our mission, values, and commitment to your success.",
  keywords: [
    "about Rejectly",
    "AI resume optimizer company",
    "resume optimization platform",
    "resume analysis company",
    "ATS optimization service",
    "AI career tools",
    "resume improvement platform",
    "job search technology",
    "resume optimization mission",
    "career advancement platform",
  ],
  openGraph: {
    title: "About - AI Resume Optimizer Company | Rejectly.pro",
    description: "Learn about Rejectly.pro, the AI-powered resume optimization platform helping 50K+ job seekers land their dream jobs with 85% higher ATS pass rate.",
    url: "https://rejectly.pro/about",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "About Rejectly.pro",
      },
    ],
  },
  alternates: {
    canonical: "https://rejectly.pro/about",
  },
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: "Home", url: "https://rejectly.pro" },
          { name: "About", url: "https://rejectly.pro/about" },
        ]}
      />
      {children}
    </>
  );
}
