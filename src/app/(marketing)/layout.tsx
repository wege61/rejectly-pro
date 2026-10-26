import { Suspense } from "react";
import type { Metadata } from "next";
import { Navbar } from "@/components/ui/Navbar";
import { Spinner } from "@/components/ui/Spinner";
import { getGuideShelfStatic } from "@/lib/blog";
import { BlogDataProvider } from "@/components/blog/BlogDataContext";

export const metadata: Metadata = {
  alternates: {
    canonical: "https://rejectly.pro",
  },
};

export default async function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // The homepage guide shelf. The static fetcher doesn't read cookies, so
  // marketing pages stay statically rendered.
  const shelf = await getGuideShelfStatic();

  return (
    <BlogDataProvider shelf={shelf}>
      <Navbar />
      <main>
        <Suspense
          fallback={
            <div style={{ padding: "80px 24px", textAlign: "center" }}>
              <Spinner size="xl" />
            </div>
          }
        >
          {children}
        </Suspense>
      </main>
    </BlogDataProvider>
  );
}
