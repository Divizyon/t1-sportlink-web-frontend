"use client";

import React, { ReactNode } from "react";
import { AuthProvider } from "@/contexts";

interface AppProviderProps {
  children: ReactNode;
}

export function AppProvider({ children }: AppProviderProps) {
  return <AuthProvider>{children}</AuthProvider>;
}
