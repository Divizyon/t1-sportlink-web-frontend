/**
 * Types Index
 * This file exports all the types used in the application
 */

// Export all types from event.ts
export * from "./event";

// Export all types from dashboard.ts
export * from "./dashboard";

// Export all types from report.ts
export * from "./report";

// Re-export notification types
export * from "./notification";

// Re-export news types
export * from "./news";

// Re-export faq types
export * from "./faq";

// Explicitly re-export Event and EventStatus to fix import errors
export type { Event, EventStatus, EventCategory } from "./event";
export type {
  Report,
  ReportStatus,
  ReportPriority,
  ReportEntityType,
} from "./report";

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
