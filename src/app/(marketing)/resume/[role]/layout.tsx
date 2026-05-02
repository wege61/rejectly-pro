import type { Metadata } from "next";

const roles = [
  { slug: "software-engineer", title: "Software Engineer", keywords: ["software engineer resume", "developer resume ATS", "tech resume optimization", "coding resume keywords"] },
  { slug: "product-manager", title: "Product Manager", keywords: ["product manager resume", "PM resume ATS", "product management resume keywords", "product manager CV"] },
  { slug: "data-analyst", title: "Data Analyst", keywords: ["data analyst resume", "data analyst ATS resume", "analytics resume keywords", "data science resume"] },
  { slug: "marketing-manager", title: "Marketing Manager", keywords: ["marketing manager resume", "marketing resume ATS", "digital marketing resume", "marketing CV keywords"] },
  { slug: "project-manager", title: "Project Manager", keywords: ["project manager resume", "PMP resume ATS", "project management resume keywords", "PM resume optimization"] },
  { slug: "ux-designer", title: "UX Designer", keywords: ["UX designer resume", "UX resume ATS", "design resume keywords", "UI UX resume optimization"] },
  { slug: "sales-representative", title: "Sales Representative", keywords: ["sales resume", "sales representative ATS resume", "sales CV keywords", "B2B sales resume"] },
  { slug: "nurse", title: "Nurse", keywords: ["nursing resume", "nurse resume ATS", "healthcare resume keywords", "RN resume optimization"] },
  { slug: "accountant", title: "Accountant", keywords: ["accountant resume", "accounting resume ATS", "CPA resume keywords", "finance resume optimization"] },
  { slug: "teacher", title: "Teacher", keywords: ["teacher resume", "teaching resume ATS", "education resume keywords", "teacher CV optimization"] },
  { slug: "human-resources", title: "Human Resources", keywords: ["HR resume", "human resources resume ATS", "HR manager resume keywords", "people operations resume"] },
  { slug: "business-analyst", title: "Business Analyst", keywords: ["business analyst resume", "BA resume ATS", "business analysis resume keywords", "requirements analyst resume"] },
];

export function generateStaticParams() {
  return roles.map((role) => ({ role: role.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ role: string }>;
}): Promise<Metadata> {
  const { role: slug } = await params;
  const role = roles.find((r) => r.slug === slug);

  if (!role) {
    return { title: "Resume Optimization | Rejectly.pro" };
  }

  return {
    title: {
      absolute: `ATS Resume Optimizer for ${role.title}s | Rejectly.pro`,
    },
    description: `Create an ATS-optimized resume specifically for ${role.title} roles. Our AI analyzes your CV against 40+ ATS criteria and rewrites it with the exact keywords ${role.title} positions demand. Free ATS score check included.`,
    keywords: [
      ...role.keywords,
      "ATS resume checker",
      "resume optimizer",
      "job specific resume",
      `${role.title.toLowerCase()} resume template`,
      `best resume for ${role.title.toLowerCase()}`,
    ],
    openGraph: {
      title: `ATS Resume for ${role.title}s | Rejectly.pro`,
      description: `Build a job-specific, ATS-optimized resume for ${role.title} roles. Tested against Workday, Greenhouse, Taleo & Lever.`,
      url: `https://rejectly.pro/resume/${slug}`,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${role.title} Resume Optimizer`,
      description: `ATS-optimized resumes for ${role.title} roles. Free score check.`,
    },
    alternates: {
      canonical: `https://rejectly.pro/resume/${slug}`,
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
}

export default function RoleResumeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
