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
