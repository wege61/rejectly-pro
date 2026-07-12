import { Suspense } from "react";
import type { Metadata } from "next";
import { Navbar } from "@/components/ui/Navbar";
import { Spinner } from "@/components/ui/Spinner";
import { getLatestBlogPostsStatic } from "@/lib/blog";
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
  // Fetch the latest 10 blog posts for the homepage FeaturedGuides carousel
  // Using the static fetcher ensures we don't opt into dynamic rendering
  // and keeps the homepage and all marketing pages incredibly fast.
  const posts = await getLatestBlogPostsStatic(10);

  return (
    <BlogDataProvider posts={posts}>
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
