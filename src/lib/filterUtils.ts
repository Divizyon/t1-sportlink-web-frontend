/**
 * Filter Utility Functions
 * Utilities for handling filters in dashboard components
 */

import { EVENT_CATEGORIES, REPORT_FILTERS } from "@/constants";
import { EventStatus, ReportFilterType } from "@/types/dashboard";

/**
 * Toggle a category in a category filter array
 */
export function toggleCategory(
  category: string,
  selectedCategories: string[]
): string[] {
  if (selectedCategories.includes(category)) {
    return selectedCategories.filter((c) => c !== category);
  } else {
    return [...selectedCategories, category];
  }
}

/**
 * Toggle an event status in a status filter array
 */
export function toggleStatus(
  status: EventStatus,
  selectedStatuses: EventStatus[]
): EventStatus[] {
  if (selectedStatuses.includes(status)) {
    return selectedStatuses.filter((s) => s !== status);
  } else {
    return [...selectedStatuses, status];
  }
}

/**
 * Check if all categories are selected
 */
export function areAllCategoriesSelected(
  selectedCategories: string[]
): boolean {
  return selectedCategories.length === EVENT_CATEGORIES.length;
}

/**
 * Select all categories
 */
export function selectAllCategories(): string[] {
  return [...EVENT_CATEGORIES];
}

/**
 * Check if a filter is active (any options selected)
 */
export function isFilterActive(selectedOptions: any[]): boolean {
  return selectedOptions.length > 0;
}

/**
 * Generate a filter summary text
 */
export function generateFilterSummary(
  selectedCategories: string[],
  selectedStatuses: EventStatus[] = []
): string {
  const parts: string[] = [];

  // Add category summary
  if (selectedCategories.length > 0) {
    if (selectedCategories.length === EVENT_CATEGORIES.length) {
      parts.push("Tüm kategoriler");
    } else if (selectedCategories.length <= 2) {
      parts.push(selectedCategories.join(", "));
    } else {
      parts.push(`${selectedCategories.length} kategori`);
    }
  }

  // Add status summary if applicable
  if (selectedStatuses.length > 0) {
    if (selectedStatuses.length <= 2) {
      parts.push(selectedStatuses.join(", "));
    } else {
      parts.push(`${selectedStatuses.length} durum`);
    }
  }

  return parts.length > 0 ? parts.join(", ") : "Tüm veriler";
}

/**
 * Get available report filter types
 */
export function getReportFilterTypes(): ReportFilterType[] {
  return Object.values(REPORT_FILTERS);
}

/**
 * Parse filter query params from URL
 */
export function parseFilterParams(params: URLSearchParams): {
  categories: string[];
  statuses: EventStatus[];
  dateRange?: [Date, Date] | null;
} {
  // Parse categories
  const categoriesParam = params.get("categories");
  const categories = categoriesParam ? categoriesParam.split(",") : [];

  // Parse statuses
  const statusesParam = params.get("statuses");
  const statuses = statusesParam
    ? (statusesParam.split(",") as EventStatus[])
    : [];

  // Parse date range if present
  let dateRange: [Date, Date] | null = null;
  const startDateParam = params.get("startDate");
  const endDateParam = params.get("endDate");

  if (startDateParam && endDateParam) {
    const startDate = new Date(startDateParam);
    const endDate = new Date(endDateParam);

    if (!isNaN(startDate.getTime()) && !isNaN(endDate.getTime())) {
      dateRange = [startDate, endDate];
    }
  }

  return {
    categories,
    statuses,
    dateRange,
  };
}

/**
 * Build filter query string for URL
 */
export function buildFilterQueryString(
  categories: string[] = [],
  statuses: EventStatus[] = [],
  dateRange?: [Date, Date] | null
): string {
  const params = new URLSearchParams();

  // Add categories if present
  if (categories.length > 0) {
    params.set("categories", categories.join(","));
  }

  // Add statuses if present
  if (statuses.length > 0) {
    params.set("statuses", statuses.join(","));
  }

  // Add date range if present
  if (dateRange) {
    params.set("startDate", dateRange[0].toISOString().split("T")[0]);
    params.set("endDate", dateRange[1].toISOString().split("T")[0]);
  }

  const queryString = params.toString();
  return queryString ? `?${queryString}` : "";
}

/**
 * Reset all filters
 */
export function resetFilters(): {
  categories: string[];
  statuses: EventStatus[];
  dateRange: null;
} {
  return {
    categories: [],
    statuses: [],
    dateRange: null,
  };
}
