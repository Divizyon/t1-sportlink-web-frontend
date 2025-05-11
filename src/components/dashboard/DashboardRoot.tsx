import React, { ReactNode } from "react";
import { DashboardProvider, EventProvider, UserProvider } from "@/contexts";

interface DashboardRootProps {
  children: ReactNode;
}

export function DashboardRoot({ children }: DashboardRootProps) {
  return (
    <DashboardProvider>
      <EventProvider>
        <UserProvider>{children}</UserProvider>
      </EventProvider>
    </DashboardProvider>
  );
}
