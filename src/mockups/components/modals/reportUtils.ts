/**
 * Report Modal Utilities
 *
 * This file contains common utility functions for report-related components.
 * It provides standardized styling and data transformation functions.
 */

import { ReportPriority, ReportStatus } from "../../schemas/reportSchema";

/**
 * Get severity badge class names for a given priority level
 */
export const getSeverityBadgeClasses = (severity: ReportPriority): string => {
  switch (severity) {
    case "low":
      return "bg-green-50 text-green-700 border-green-200";
    case "medium":
      return "bg-yellow-50 text-yellow-700 border-yellow-200";
    case "high":
      return "bg-red-50 text-red-700 border-red-200";
    default:
      return "bg-gray-50 text-gray-700 border-gray-200";
  }
};

/**
 * Get severity badge label for a given priority level
 */
export const getSeverityBadgeLabel = (severity: ReportPriority): string => {
  switch (severity) {
    case "low":
      return "Düşük";
    case "medium":
      return "Orta";
    case "high":
      return "Yüksek";
    default:
      return String(severity);
  }
};

/**
 * Get status badge class names for a given report status
 */
export const getStatusBadgeClasses = (
  status: ReportStatus | string
): string => {
  switch (status) {
    case "pending":
      return "bg-yellow-50 text-yellow-700 border-yellow-200";
    case "reviewing":
      return "bg-purple-50 text-purple-700 border-purple-200";
    case "resolved":
      return "bg-green-50 text-green-700 border-green-200";
    case "rejected":
    case "dismissed":
      return "bg-red-50 text-red-700 border-red-200";
    default:
      return "bg-gray-50 text-gray-700 border-gray-200";
  }
};

/**
 * Get status badge label for a given report status
 */
export const getStatusBadgeLabel = (status: ReportStatus | string): string => {
  switch (status) {
    case "pending":
      return "Beklemede";
    case "reviewing":
      return "İnceleniyor";
    case "resolved":
      return "Çözüldü";
    case "rejected":
    case "dismissed":
      return "Reddedildi";
    default:
      return String(status);
  }
};

/**
 * Convert from schema report status to UI report status
 */
export const mapStatusFromSchema = (
  status: ReportStatus
): "pending" | "resolved" | "dismissed" => {
  if (status === "reviewing") return "pending";
  if (status === "rejected") return "dismissed";
  if (status === "resolved") return "resolved";
  return "pending"; // Default case
};

/**
 * Convert from UI report status to schema report status
 */
export const mapStatusToSchema = (status: string): ReportStatus => {
  if (status === "dismissed") return "rejected";
  if (status === "resolved") return "resolved";
  if (status === "pending") return "reviewing";
  return "pending"; // Default case
};
