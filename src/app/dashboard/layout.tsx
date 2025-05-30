"use client";

import { useState } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { UserNav } from "@/components/nav/UserNav";
import { useDashboardContext } from "@/contexts/DashboardContext";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { selectedCategories, setSelectedCategories } = useDashboardContext();

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="min-h-screen bg-gray-50/50">
      {/* Container */}
      <div className="mx-auto max-w-[1800px] px-2 sm:px-4 lg:px-6">
        <div className="flex min-h-screen flex-col gap-4 py-4">
          {/* Main Content */}
          <div className="flex flex-1 gap-4">
            {/* Sidebar - Mobile */}
            <div
              className={`fixed inset-y-0 left-0 z-50 w-72 transform bg-white p-4 shadow-lg transition-transform duration-300 md:hidden ${
                sidebarOpen ? "translate-x-0" : "-translate-x-full"
              }`}
            >
              <Sidebar />
            </div>

            {/* Overlay */}
            {sidebarOpen && (
              <div
                className="fixed inset-0 z-40 bg-gray-600/50 backdrop-blur-sm transition-opacity md:hidden"
                onClick={toggleSidebar}
              />
            )}

            {/* Sidebar - Desktop */}
            <div className="hidden w-64 shrink-0 rounded-lg bg-white p-4 shadow-sm md:block">
              <Sidebar />
            </div>

            {/* Main */}
            <div className="flex-1 flex flex-col">
              <header className="flex h-14 items-center justify-between border-b px-6 rounded-t-lg bg-white shadow-sm mb-2">
                <div className="flex items-center gap-4">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="md:hidden"
                    onClick={toggleSidebar}
                  >
                    <Menu className="h-5 w-5" />
                  </Button>
                  <h2 className="text-lg font-semibold">
                    <span className="text-[#00A86B] italic">SportLink</span> Yönetim Paneli
                  </h2>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="pl-2 border-l">
                    <UserNav />
                  </div>
                </div>
              </header>
              <main className="flex-1 rounded-lg bg-white p-6 shadow-sm">
                {children}
              </main>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
