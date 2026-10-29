import type { Metadata } from "next";
import { BreadcrumbSchema } from "@/components/seo/StructuredData";

const TITLE = "Contact Rejectly: Write to a Person";
const DESCRIPTION =
  "A question, something that broke, a refund or an idea. Your message goes to the people who build Rejectly. Or email hello@rejectly.pro.";

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: "https://rejectly.pro/contact",
    type: "website",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Contact Rejectly.pro" }],
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
