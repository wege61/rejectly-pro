import { FaqPage } from "@/components/faq/FaqPage";
import { ALL_FAQS } from "@/components/faq/content";
import { Footer } from "@/components/ui/Footer";

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: ALL_FAQS.map((f) => ({
    "@type": "Question",
    name: f.question,
    acceptedAnswer: { "@type": "Answer", text: f.answer },
  })),
};

export default function Page() {
  return (
    <div style={{ minHeight: "100vh", background: "var(--rj-paper)", overflowX: "clip" }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <FaqPage />
      <Footer />
    </div>
  );
}
