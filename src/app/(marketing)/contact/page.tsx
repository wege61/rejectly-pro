import { ContactPage } from "@/components/contact/ContactPage";
import { Footer } from "@/components/ui/Footer";

const schema = {
  "@context": "https://schema.org",
  "@type": "ContactPage",
  name: "Contact Rejectly.pro",
  url: "https://rejectly.pro/contact",
  mainEntity: {
    "@type": "Organization",
    name: "Rejectly.pro",
    url: "https://rejectly.pro",
    contactPoint: { "@type": "ContactPoint", contactType: "customer support", email: "hello@rejectly.pro", availableLanguage: "English" },
  },
};

export default function Contact() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <ContactPage />
      <Footer />
    </>
  );
}
