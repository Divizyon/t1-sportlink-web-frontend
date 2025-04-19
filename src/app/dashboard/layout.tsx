"use client";

import { useState } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { CalendarDateRangePicker } from "@/components/date-range-picker";
import { UserNav } from "@/components/nav/user-nav";

export default function DashboardLayout({
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
      <div className="flex min-h-screen flex-col gap-4 py-4">          
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
          <div className="flex-1 flex flex-col">
            <header className="flex h-14 items-center justify-between border-b px-6 rounded-t-lg bg-white shadow-sm mb-2">
              <h2 className="text-lg font-semibold">SportLink Yönetim Paneli</h2>
              <div className="flex items-center space-x-4">
                <CalendarDateRangePicker />
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
  );
} 