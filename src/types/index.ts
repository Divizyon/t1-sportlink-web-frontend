/**
 * Types Index
 * Central export point for all type definitions
 */

// Re-export all dashboard types
export * from "./dashboard";

// Global Application Types

// HTTP Response Types
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

// UI Component Common Types
export interface SelectOption {
  label: string;
  value: string | number;
}

export type SortDirection = "asc" | "desc";

export type ThemeMode = "light" | "dark" | "system";

// Pagination Types
export interface PaginationParams {
  page: number;
  limit: number;
  total?: number;
}

export interface PaginatedResponse<T> {
  items: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export type DashboardTabValue = "overview" | "analytics";

export interface Event {
  id: number;
  title: string;
  description: string;
  date: Date;
  category: string;
  location: string;
  location_name: string;
  status: string;
  sport_id: number;
  start_time: string;
  end_time: string;
  max_participants: number;
  current_participants: number;
  created_at: string;
  updated_at: string;
}

export interface EventFilter {
  search: string;
  category: string;
  date: string;
}

export interface Category {
  id: number;
  name: string;
  description?: string;
  created_at?: string;
  updated_at?: string;
}
