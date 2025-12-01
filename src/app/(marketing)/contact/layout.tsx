import type { Metadata } from "next";
import { BreadcrumbSchema } from "@/components/seo/StructuredData";

export const metadata: Metadata = {
  title: "Contact - Get Resume Optimizer Support | Rejectly.pro",
  description: "Contact Rejectly.pro support team for help with AI resume optimization, billing questions, or feature requests. 24-hour response time guaranteed.",
  keywords: [
    "contact Rejectly support",
    "resume optimizer help",
    "customer support",
    "AI resume assistance",
    "resume optimization support",
    "technical support",
    "billing questions",
    "feature requests",
    "resume help desk",
    "contact us",
  ],
  openGraph: {
    title: "Contact - Get Resume Optimizer Support | Rejectly.pro",
    description: "Contact Rejectly.pro support team for help with AI resume optimization, billing questions, or feature requests. 24-hour response time.",
    url: "https://rejectly.pro/contact",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Contact Rejectly.pro",
      },
    ],
  },
  alternates: {
    canonical: "https://rejectly.pro/contact",
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: "Home", url: "https://rejectly.pro" },
          { name: "Contact", url: "https://rejectly.pro/contact" },
        ]}
      />
      {children}
    </>
  );
}
