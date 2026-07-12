"use client";

import React, { createContext, useContext } from "react";
import type { BlogPostWithRelations } from "@/types/blog";

// Create a context to hold the latest blog posts fetched from the server
const BlogDataContext = createContext<BlogPostWithRelations[]>([]);

export function BlogDataProvider({ 
  posts, 
  children 
}: { 
  posts: BlogPostWithRelations[];
  children: React.ReactNode;
}) {
  return (
    <BlogDataContext.Provider value={posts}>
      {children}
    </BlogDataContext.Provider>
  );
}

// Hook for Client Components to easily access the latest posts
export function useLatestPosts() {
  return useContext(BlogDataContext);
}
