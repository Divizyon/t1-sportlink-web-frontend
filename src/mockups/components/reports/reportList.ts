/**
 * Report List Mockup Data
 *
 * This file contains mockup data specifically for report list components.
 * It provides filtered and paginated report lists with various sorting options.
 */

import {
  REPORT_SCHEMA,
  ReportEntityType,
  ReportPriority,
  ReportStatus,
} from "../../schemas/reportSchema";

// Interface for list report item
export interface ReportListItemMock {
  id: string | number;
  subject: string;
  description: string;
  reportedDate: string;
  priority: string;
  status: string;
  reportedBy: string;
  assignedTo?: string;
  entityId: string | number;
  entityType: ReportEntityType;
  resolution?: string;
  resolutionDate?: string;
}

// Filter reports by entity type
export const filterReportsByEntityType = (
  entityType: ReportEntityType | "all"
): ReportListItemMock[] => {
  if (entityType === "all") {
    return REPORT_SCHEMA.reports.map(mapToReportListItem);
  }

  return REPORT_SCHEMA.reports
    .filter((report) => report.entityType === entityType)
    .map(mapToReportListItem);
};

// Filter reports by status
export const filterReportsByStatus = (
  status: ReportStatus | "all"
): ReportListItemMock[] => {
  if (status === "all") {
    return REPORT_SCHEMA.reports.map(mapToReportListItem);
  }

  return REPORT_SCHEMA.reports
    .filter((report) => report.status === status)
    .map(mapToReportListItem);
};

// Filter reports by priority
export const filterReportsByPriority = (
  priority: ReportPriority | "all"
): ReportListItemMock[] => {
  if (priority === "all") {
    return REPORT_SCHEMA.reports.map(mapToReportListItem);
  }

  return REPORT_SCHEMA.reports
    .filter((report) => report.priority === priority)
    .map(mapToReportListItem);
};

// Sort reports by date
export const sortReportsByDate = (
  reports: ReportListItemMock[] = REPORT_SCHEMA.reports.map(
    mapToReportListItem
  ),
  ascending: boolean = false
): ReportListItemMock[] => {
  return [...reports].sort((a, b) => {
    const dateA = new Date(a.reportedDate).getTime();
    const dateB = new Date(b.reportedDate).getTime();
    return ascending ? dateA - dateB : dateB - dateA;
  });
};

// Search reports by subject or description
export const searchReports = (query: string): ReportListItemMock[] => {
  if (!query.trim()) {
    return REPORT_SCHEMA.reports.map(mapToReportListItem);
  }

  const lowercaseQuery = query.toLowerCase();

  return REPORT_SCHEMA.reports
    .filter(
      (report) =>
        report.subject.toLowerCase().includes(lowercaseQuery) ||
        report.description.toLowerCase().includes(lowercaseQuery)
    )
    .map(mapToReportListItem);
};

// Helper function to map REPORT_SCHEMA report to ReportListItemMock
const mapToReportListItem = (
  report: (typeof REPORT_SCHEMA.reports)[0]
): ReportListItemMock => {
  return {
    id: report.id,
    subject: report.subject,
    description: report.description,
    reportedDate: report.reportedDate,
    priority: report.priority,
    status: report.status,
    reportedBy: report.reportedBy,
    assignedTo: report.assignedTo,
    entityId: report.entityId,
    entityType: report.entityType,
    resolution: report.resolution,
    resolutionDate: report.resolutionDate,
  };
};

// Export commonly used report lists
export const RECENT_REPORTS = sortReportsByDate().slice(0, 5);
export const HIGH_PRIORITY_REPORTS = filterReportsByPriority("high");
export const PENDING_REPORTS = filterReportsByStatus("pending");

// Report entity type options for filtering
export const REPORT_ENTITY_TYPE_OPTIONS = [
  { value: "all", label: "All Types" },
  { value: "user", label: "User" },
  { value: "event", label: "Event" },
  { value: "comment", label: "Comment" },
  { value: "message", label: "Message" },
];

// Report status options for filtering
export const REPORT_STATUS_OPTIONS = [
  { value: "all", label: "All Statuses" },
  { value: "pending", label: "Pending" },
  { value: "reviewing", label: "Reviewing" },
  { value: "resolved", label: "Resolved" },
  { value: "rejected", label: "Rejected" },
];

// Report priority options for filtering
export const REPORT_PRIORITY_OPTIONS = [
  { value: "all", label: "All Priorities" },
  { value: "high", label: "High" },
  { value: "medium", label: "Medium" },
  { value: "low", label: "Low" },
];
