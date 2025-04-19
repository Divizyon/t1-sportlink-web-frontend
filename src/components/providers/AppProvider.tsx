"use client";

import React, { ReactNode } from "react";
import { AuthProvider } from "@/contexts";
import { DashboardProvider } from "@/contexts/DashboardContext";

interface AppProviderProps {
  children: ReactNode;
}

export function AppProvider({ children }: AppProviderProps) {
  return (
    <AuthProvider>
      <DashboardProvider>{children}</DashboardProvider>
    </AuthProvider>
  );
}
