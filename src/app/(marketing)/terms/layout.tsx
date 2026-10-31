import type { Metadata } from "next";
import { BreadcrumbSchema } from "@/components/seo/StructuredData";

const TITLE = "Terms of Service | Rejectly.pro";
const DESCRIPTION =
  "The terms for using Rejectly.pro, with a short summary of each section: credits that never expire, Pro at 150 runs a month, refunds, fair use and your rights.";

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: "https://rejectly.pro/terms",
    type: "website",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Rejectly.pro Terms of Service" }],
  },
  alternates: {
    canonical: "https://rejectly.pro/terms",
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
          { name: "Home", url: "https://rejectly.pro" },
          { name: "Terms of Service", url: "https://rejectly.pro/terms" },
        ]}
      />
      {children}
    </>
  );
}
