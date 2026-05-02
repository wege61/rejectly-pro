import type { Metadata } from "next";
import { BreadcrumbSchema } from "@/components/seo/StructuredData";

export const metadata: Metadata = {
  title: { absolute: "How It Works - AI Resume Analysis Process | Rejectly.pro" },
  description: "Learn how our AI creates a unique, ATS-optimized resume for every job you apply to — in 4 simple steps. Upload, analyze, optimize, apply.",
  keywords: [
    "AI resume analysis process",
    "how ATS optimization works",
    "resume checker guide",
    "AI resume analyzer steps",
    "resume optimization process",
    "ATS checker tutorial",
    "resume analysis workflow",
    "AI resume improvement guide",
    "how to optimize resume",
    "resume analysis explained",
  ],
  openGraph: {
    title: "How It Works - AI Resume Analysis Process | Rejectly.pro",
    description: "Learn how our AI analyzes your resume in 4 simple steps: Upload, get smart recommendations, generate cover letters, and download optimized resume.",
    url: "https://rejectly.pro/how-it-works",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Rejectly.pro - How It Works",
      },
    ],
  },
  alternates: {
    canonical: "https://rejectly.pro/how-it-works",
  },
  twitter: {
    card: "summary_large_image",
    site: "@rejectlypro",
    creator: "@rejectlypro",
    title: "How It Works - AI Resume Analysis Process | Rejectly.pro",
    description: "Learn how our AI analyzes your resume in 4 simple steps: Upload, get smart recommendations, generate cover letters, and download optimized resume.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function HowItWorksLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: "Home", url: "https://rejectly.pro" },
          { name: "How It Works", url: "https://rejectly.pro/how-it-works" },
        ]}
      />
      {children}
    </>
  );
}
