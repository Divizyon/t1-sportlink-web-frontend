"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import { User } from "@/types";
import { useUsers } from "@/hooks";

interface UserFilters {
  status?: string | string[];
  role?: string | string[];
  search?: string;
  dateRange?: {
    start: Date;
    end: Date;
  };
}

interface UserContextType {
  // User data
  users: User[];
  filteredUsers: User[];
  activeUsers: User[];
  recentUsers: User[];
  usersByActivity: User[];

  // User filtering
  filters: UserFilters;
  setStatusFilter: (status: string | string[]) => void;
  setRoleFilter: (role: string | string[]) => void;
  setSearchFilter: (search: string) => void;
  setDateRangeFilter: (start: Date, end: Date) => void;
  resetFilters: () => void;

  // User loading state
  loading: boolean;
  error: Error | null;

  // User selection
  selectedUser: User | null;
  setSelectedUser: (user: User | null) => void;

  // User statistics
  statistics: {
    total: number;
    active: number;
    recent: number;
    activePercentage: number;
    growthRate: number;
    byStatus: Record<string, number>;
    byRole: Record<string, number>;
  };
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function useUserContext() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUserContext must be used within a UserProvider");
  }
  return context;
}

interface UserProviderProps {
  children: ReactNode;
}

export function UserProvider({ children }: UserProviderProps) {
  const {
    users,
    filteredUsers,
    activeUsers,
    recentUsers,
    usersByActivity,
    statistics,
    loading,
    error,
    filters,
    setStatusFilter,
    setRoleFilter,
    setSearchFilter,
    setDateRangeFilter,
    resetFilters,
  } = useUsers();

  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const value = {
    users,
    filteredUsers,
    activeUsers,
    recentUsers,
    usersByActivity,
    statistics,
    loading,
    error,
    filters,
    setStatusFilter,
    setRoleFilter,
    setSearchFilter,
    setDateRangeFilter,
    resetFilters,
    selectedUser,
    setSelectedUser,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}
