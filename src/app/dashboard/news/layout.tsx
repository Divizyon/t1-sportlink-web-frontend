"use client"

import { NewsProvider } from "@/providers/NewsProvider";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <NewsProvider>
      {children}
    </NewsProvider>
  );
} 