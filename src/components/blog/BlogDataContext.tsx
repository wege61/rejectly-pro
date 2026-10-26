"use client";

import React, { createContext, useContext } from "react";
import type { GuideShelfData } from "@/components/marketing/guides/shelf";

// The homepage guide shelf, fetched once by the marketing layout on the server.
const BlogDataContext = createContext<GuideShelfData>({ guides: [], total: 0 });

export function BlogDataProvider({
  shelf,
  children,
}: {
  shelf: GuideShelfData;
  children: React.ReactNode;
}) {
  return <BlogDataContext.Provider value={shelf}>{children}</BlogDataContext.Provider>;
}

export function useGuideShelf() {
  return useContext(BlogDataContext);
}
