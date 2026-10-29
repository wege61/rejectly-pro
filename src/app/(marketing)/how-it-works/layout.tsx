import type { Metadata } from "next";
import { BreadcrumbSchema } from "@/components/seo/StructuredData";

export const metadata: Metadata = {
  title: { absolute: "How Rejectly Works: Follow One Resume From Upload to Interview" },
  description: "See what an ATS reads in a real student resume, how the 19-check score works, how a job match and rewrite stay honest, and which parts are AI and which are code.",
  keywords: [
    "how ATS reads a resume",
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
    title: "How Rejectly Works: Follow One Resume From Upload to Interview",
    description: "See what an ATS reads in a real student resume, how the 19-check score works, how a job match and rewrite stay honest, and which parts are AI and which are code.",
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
    title: "How Rejectly Works: Follow One Resume From Upload to Interview",
    description: "See what an ATS reads in a real student resume, how the 19-check score works, how a job match and rewrite stay honest, and which parts are AI and which are code.",
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
