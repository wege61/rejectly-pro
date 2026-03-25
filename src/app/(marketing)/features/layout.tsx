import type { Metadata } from "next";
import { BreadcrumbSchema } from "@/components/seo/StructuredData";

export const metadata: Metadata = {
  title: { absolute: "Features - GPT-4 Powered Resume Analysis Tools | Rejectly.pro" },
  description: "Explore Rejectly.pro's AI-powered tools: Job Match Analysis, ATS Optimizer, Cover Letter Generator, and CV Builder. Create job-specific resumes for every application.",
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
    description: "Explore Rejectly.pro's AI-powered tools: Job Match Analysis, ATS Optimizer, Cover Letter Generator, and free CV Builder.",
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
