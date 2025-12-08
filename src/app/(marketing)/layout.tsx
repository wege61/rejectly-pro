"use client";

import { Suspense } from "react";
import styled from "styled-components";
import { Navbar } from "@/components/ui/Navbar";
import { Spinner } from "@/components/ui/Spinner";

const Main = styled.main`
  padding-top: 80px; /* Space for fixed navbar */

  @media (max-width: 768px) {
    padding-top: 72px;
  }
`;

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      <Main>
        <Suspense
          fallback={
            <div style={{ padding: "80px 24px", textAlign: "center" }}>
              <Spinner size="xl" />
            </div>
          }
        >
          {children}
        </Suspense>
      </Main>
    </>
  );
}
