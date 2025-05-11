"use client";

import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="min-h-screen bg-gray-50/50">
      {/* Container */}
      <div className="mx-auto max-w-[1800px] px-2 sm:px-4 lg:px-6">
        <div className="flex min-h-screen flex-col gap-4 py-4">
          {/* Header */}
          <div className="rounded-lg bg-white shadow-sm">
            <Header toggleSidebar={toggleSidebar} />
          </div>
          
          {/* Main Content */}
          <div className="flex flex-1 gap-4">
            {/* Sidebar - Mobil için */}
            <div 
              className={`fixed inset-y-0 left-0 z-50 w-72 transform bg-white p-4 shadow-lg transition-transform duration-300 md:hidden ${
                sidebarOpen ? 'translate-x-0' : '-translate-x-full'
              }`}
            >
              <Sidebar />
            </div>
            
            {/* Overlay */}
            {sidebarOpen && (
              <div 
                className="fixed inset-0 z-40 bg-gray-600 bg-opacity-50 transition-opacity md:hidden" 
                onClick={toggleSidebar}
              />
            )}
            
            {/* Sidebar - Masaüstü için */}
            <div className="hidden w-64 shrink-0 rounded-lg bg-white p-4 shadow-sm md:block">
              <Sidebar />
            </div>
            
            {/* Main */}
            <main className="flex-1 rounded-lg bg-white p-6 shadow-sm">
              {children}
            </main>
          </div>
        </div>
      </div>
    </div>
  );
} 