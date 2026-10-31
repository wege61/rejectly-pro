import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ROLES, ROLE_SLUGS, getRole, type RoleSlug } from "@/lib/resumeRoles";
import { RoleClient } from "./RoleClient";
import { RolePage } from "@/components/resume-role/RolePage";
import { Footer } from "@/components/ui/Footer";
import { getRoleExample } from "@/lib/roleExamples";
import { scoreExample } from "@/lib/roleExamples/score";

const BASE_URL = "https://rejectly.pro";

// Only the 12 known slugs are ever rendered; anything else 404s at the route level.
export const dynamicParams = false;

export function generateStaticParams() {
  return ROLE_SLUGS.map((role) => ({ role }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ role: string }>;
}): Promise<Metadata> {
  const { role: slug } = await params;
  const role = getRole(slug);
  if (!role) return {};

  const url = `${BASE_URL}/resume/${slug}`;
  // Rebuilt roles describe themselves; the rest keep their old copy until rebuilt.
  const example = getRoleExample(slug);
  if (example) {
    return {
      title: { absolute: `${example.metaTitle} | Rejectly.pro` },
      description: example.metaDescription,
      alternates: { canonical: url },
      openGraph: { type: "article", url, title: example.metaTitle, description: example.metaDescription, siteName: "Rejectly.pro" },
      twitter: { card: "summary_large_image", title: example.metaTitle, description: example.metaDescription },
    };
  }
  return {
    title: role.metaTitle,
    description: role.metaDescription,
    alternates: {
      canonical: url,
    },
    openGraph: {
      type: "article",
      url,
      title: `${role.metaTitle} | Rejectly.pro`,
      description: role.metaDescription,
      siteName: "Rejectly.pro",
    },
    twitter: {
      card: "summary_large_image",
      title: `${role.metaTitle} | Rejectly.pro`,
      description: role.metaDescription,
    },
  };
}

export default async function RoleResumePage({
  params,
}: {
  params: Promise<{ role: string }>;
}) {
  const { role: slug } = await params;
  const role = getRole(slug);
  if (!role) notFound();

  const related = ROLE_SLUGS.filter((s) => s !== slug).map((s: RoleSlug) => ({
    slug: s,
    title: ROLES[s].title,
  }));

  const example = getRoleExample(slug);

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: BASE_URL },
      {
        "@type": "ListItem",
        position: 2,
        name: `${example ? "Entry-Level " : ""}${role.title} Resume Guide`,
        item: `${BASE_URL}/resume/${slug}`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      {example ? (
        <>
          <RolePage example={example} scores={scoreExample(example)} others={related} />
          <Footer />
        </>
      ) : (
        <RoleClient role={role} related={related} />
      )}
    </>
  );
}
