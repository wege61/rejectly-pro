import { Suspense } from "react";
import { Navbar } from "@/components/ui/Navbar";
import { Spinner } from "@/components/ui/Spinner";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
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
    </>
  );
}
