/**
 * Central Utility Functions
 *
 * This file contains core utilities used throughout the application.
 * It serves as the PRIMARY place for common, reusable functions.
 *
 * USAGE GUIDELINES:
 * - Import generic utilities directly from here
 * - For domain-specific utilities, use the specialized utility files:
 *   - userUtils.ts: For user/participant-specific operations
 *   - dashboardUtils.ts: For dashboard-specific operations
 *   - userDataService.ts: For user data transformation/enrichment
 *
 * @example
 * // Good usage:
 * import { formatDate, calculatePercentage } from "@/lib/utils";
 *
 * // Domain-specific usage:
 * import { sortUsersByActivity } from "@/lib/userUtils";
 * import { groupEventsByStatus } from "@/lib/dashboardUtils";
 */

import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { formatDistance } from "date-fns";
import { tr } from "date-fns/locale";

/**
 * Core Utilities
 * Basic utilities used throughout the application
 */

/**
 * Combines class names using clsx and tailwind-merge
 * @example cn("text-red-500", isActive && "bg-blue-500")
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Date Formatting Utilities
 * All date formatting functions in one place
 */

/**
 * Formats a date with Turkish locale and full details
 * @example formatDate("2023-08-15") // "15 Ağustos 2023, 00:00"
 */
export function formatDate(date: string | Date): string {
  const d = new Date(date);
  return d.toLocaleDateString("tr-TR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/**
 * Formats a date specifically for dashboard display (date only)
 * @example formatDashboardDate(new Date()) // "15 Ağustos 2023"
 */
export function formatDashboardDate(date: Date): string {
  return date.toLocaleDateString("tr-TR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

/**
 * Returns a relative time string (e.g., "2 gün önce")
 * @example formatLastActive("2023-08-10") // "5 gün önce"
 */
export function formatLastActive(lastActiveDate: string | Date): string {
  const date =
    typeof lastActiveDate === "string"
      ? new Date(lastActiveDate)
      : lastActiveDate;

  return formatDistance(date, new Date(), {
    addSuffix: true,
    locale: tr,
  });
}

/**
 * Calculation Utilities
 * Generic calculation functions used across components
 */

/**
 * Calculates percentage (rounded to nearest integer)
 * @example calculatePercentage(75, 100) // 75
 */
export function calculatePercentage(value: number, total: number): number {
  return total > 0 ? Math.round((value / total) * 100) : 0;
}

/**
 * Calculates growth percentage between current and previous values
 * @example calculateGrowth(150, 100) // 50
 */
export function calculateGrowth(current: number, previous: number): number {
  if (previous === 0) return current > 0 ? 100 : 0;
  return Number((((current - previous) / previous) * 100).toFixed(1));
}

/**
 * Formatting Utilities
 * General formatting utilities
 */

/**
 * Formats a number as a percentage string
 * @example formatPercentage(75) // "75%"
 */
export function formatPercentage(value: number): string {
  return `${value}%`;
}

/**
 * Formats a growth value with + or - sign
 * @example formatGrowth(50) // "+50%"
 */
export function formatGrowth(value: number): string {
  const sign = value > 0 ? "+" : "";
  return `${sign}${value}%`;
}

/**
 * String Utilities
 * Common string manipulation utilities
 */

/**
 * Gets initials from a name (first letter of first and last name)
 * @example getUserInitials("John Doe") // "JD"
 */
export function getUserInitials(name: string): string {
  if (!name) return "?";

  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();

  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}
