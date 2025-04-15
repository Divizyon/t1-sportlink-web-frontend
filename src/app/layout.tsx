import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Spor Yönetim Sistemi",
  description: "Spor etkinlikleri yönetim sistemi",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="tr">
      <body className={inter.className}>
        <div className="flex min-h-screen">
          <div className="hidden md:flex md:w-72 md:flex-col md:fixed md:inset-y-0 z-50">
            <Sidebar />
          </div>
          <div className="flex-1 md:pl-72">
            <Header />
            <main className="flex-1 p-6">{children}</main>
          </div>
        </div>
        <Toaster />
      </body>
    </html>
  );
}
