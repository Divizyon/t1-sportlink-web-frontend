"use client"

import { ReactNode } from "react";
import { useNews } from "@/hooks/useNews";
import { createContext, useContext } from "react";
import type { NewsItem, NewsFilters } from "@/types/news";

interface NewsContextType {
  news: NewsItem[];
  filteredNews: NewsItem[];
  loading: boolean;
  error: string | null;
  filters: NewsFilters;
  setFilters: (filters: NewsFilters) => void;
  pendingCount: number;
  addNewsFromUrl: (mockNews: any[], url: string) => Promise<{ count: number } | { error: string }>;
  deleteNews: (id: string) => void;
  deleteSelectedNews: () => void;
  approveNews: (id: string) => Promise<{ success: boolean } | { error: string }>;
  rejectNews: (id: string) => Promise<{ success: boolean } | { error: string }>;
  toggleNewsSelection: (id: string) => void;
  toggleSelectAll: (select: boolean) => void;
  setNews: (news: NewsItem[] | ((prev: NewsItem[]) => NewsItem[])) => void;
}

const NewsContext = createContext<NewsContextType | null>(null);

export const useNewsContext = () => {
  const context = useContext(NewsContext);
  if (context === null) {
    throw new Error("useNewsContext must be used within a NewsProvider");
  }
  return context;
};

export function NewsProvider({ children }: { children: ReactNode }) {
  const newsHook = useNews();

  return (
    <NewsContext.Provider value={newsHook}>
      {children}
    </NewsContext.Provider>
  );
} 