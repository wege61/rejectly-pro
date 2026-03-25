import type { Metadata } from "next";
import { BreadcrumbSchema } from "@/components/seo/StructuredData";

export const metadata: Metadata = {
  title: { absolute: "About - AI Resume Optimizer Company | Rejectly.pro" },
  description: "Learn about Rejectly.pro, the AI-powered resume optimization platform that creates a unique, ATS-optimized CV for every job you apply to. Our mission, values, and commitment to your success.",
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
    description: "Learn about Rejectly.pro, the AI-powered resume optimization platform that builds job-specific, ATS-optimized resumes for every application.",
    url: "https://www.rejectly.pro/about",
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
    canonical: "https://www.rejectly.pro/about",
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
          { name: "Home", url: "https://www.rejectly.pro" },
          { name: "About", url: "https://www.rejectly.pro/about" },
        ]}
      />
      {children}
    </>
  );
}
