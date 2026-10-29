import type { Metadata } from "next";
import { BreadcrumbSchema } from "@/components/seo/StructuredData";

export const metadata: Metadata = {
  title: { absolute: "FAQ: Straight Answers About Rejectly.pro" },
  description: "How the free ATS scan works, what a credit buys, refunds, what happens to your resume, and what the AI will and won't do.",
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
    title: "FAQ: Straight Answers About Rejectly.pro",
    description: "How the free ATS scan works, what a credit buys, refunds, what happens to your resume, and what the AI will and won't do.",
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
