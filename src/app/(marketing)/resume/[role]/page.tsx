import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { RolePage } from "@/components/resume-role/RolePage";
import { Footer } from "@/components/ui/Footer";
import { ROLE_EXAMPLES, ROLE_SLUGS, getRoleExample } from "@/lib/roleExamples";
import { scoreExample } from "@/lib/roleExamples/score";

const BASE_URL = "https://rejectly.pro";

// Only the known slugs are ever rendered; anything else 404s at the route level.
export const dynamicParams = false;

export function generateStaticParams() {
  return ROLE_SLUGS.map((role) => ({ role }));
}

export async function generateMetadata({ params }: { params: Promise<{ role: string }> }): Promise<Metadata> {
  const { role: slug } = await params;
  const example = getRoleExample(slug);
  if (!example) return {};
  const url = `${BASE_URL}/resume/${slug}`;
  return {
    title: { absolute: `${example.metaTitle} | Rejectly.pro` },
    description: example.metaDescription,
    alternates: { canonical: url },
    openGraph: { type: "article", url, title: example.metaTitle, description: example.metaDescription, siteName: "Rejectly.pro" },
    twitter: { card: "summary_large_image", title: example.metaTitle, description: example.metaDescription },
  };
}

export default async function RoleResumePage({ params }: { params: Promise<{ role: string }> }) {
  const { role: slug } = await params;
  const example = getRoleExample(slug);
  if (!example) notFound();

  const others = ROLE_SLUGS.filter((s) => s !== slug).map((s) => ({ slug: s, title: ROLE_EXAMPLES[s].title }));
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: BASE_URL },
      { "@type": "ListItem", position: 2, name: example.metaTitle.split(":")[0], item: `${BASE_URL}/resume/${slug}` },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <RolePage example={example} scores={scoreExample(example)} others={others} />
      <Footer />
    </>
  );
}
