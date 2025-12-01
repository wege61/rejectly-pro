import type { Metadata } from "next";
import { BreadcrumbSchema } from "@/components/seo/StructuredData";

export const metadata: Metadata = {
  title: "FAQ - Resume Optimizer Questions Answered | Rejectly.pro",
  description: "Get answers to common questions about AI resume optimization, ATS checkers, pricing, privacy, and features. Find help with resume analysis and job matching.",
  keywords: [
    "resume optimizer FAQ",
    "ATS checker questions",
    "AI resume help",
    "resume optimization FAQ",
    "resume analyzer questions",
    "ATS optimization help",
    "resume checker support",
    "AI resume questions",
    "resume analysis FAQ",
    "job matching help",
  ],
  openGraph: {
    title: "FAQ - Resume Optimizer Questions Answered | Rejectly.pro",
    description: "Get answers to common questions about AI resume optimization, ATS checkers, pricing, privacy, and features. Complete FAQ guide.",
    url: "https://rejectly.pro/faq",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Rejectly.pro FAQ",
      },
    ],
  },
  alternates: {
    canonical: "https://rejectly.pro/faq",
  },
};

export default function FAQLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: "Home", url: "https://rejectly.pro" },
          { name: "FAQ", url: "https://rejectly.pro/faq" },
        ]}
      />
      {children}
    </>
  );
}
