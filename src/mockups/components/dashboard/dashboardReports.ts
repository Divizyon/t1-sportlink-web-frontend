/**
 * Dashboard Reports Mockup Data
 *
 * This file contains mockup data specifically for the dashboard reports components.
 * It uses a subset of the main report schema to simulate the specific data
 * needed for dashboard reporting components.
 */

import {
  REPORT_SCHEMA,
  Report,
  ReportStatus,
  ReportPriority,
} from "../../schemas/reportSchema";

// Dashboard report interface with simplified structure
export interface DashboardReport {
  id: number | string;
  subject: string;
  description: string;
  reportedBy: string;
  reportedDate: string;
  priority: ReportPriority;
  status: ReportStatus;
  entityType: string;
}

// Recent reports for the dashboard - last 5 reports
export const RECENT_DASHBOARD_REPORTS: DashboardReport[] = REPORT_SCHEMA.reports
  .slice(0, 5)
  .map((report) => ({
    id: report.id,
    subject: report.subject,
    description: report.description,
    reportedBy: report.reportedBy,
    reportedDate: report.reportedDate,
    priority: report.priority,
    status: report.status,
    entityType: report.entityType,
  }));

// Report counts for dashboard badges and charts
export const REPORT_COUNTS = {
  total: REPORT_SCHEMA.stats.total,
  pending: REPORT_SCHEMA.stats.pending,
  reviewing: REPORT_SCHEMA.stats.reviewing,
  resolved: REPORT_SCHEMA.stats.resolved,
  rejected: REPORT_SCHEMA.stats.rejected,
};

// Report counts by priority for dashboard chart
export const REPORT_BY_PRIORITY = {
  low: REPORT_SCHEMA.stats.byPriority.low,
  medium: REPORT_SCHEMA.stats.byPriority.medium,
  high: REPORT_SCHEMA.stats.byPriority.high,
};

// Report counts by entity type for dashboard chart
export const REPORT_BY_ENTITY = {
  user: REPORT_SCHEMA.stats.byEntityType.user,
  event: REPORT_SCHEMA.stats.byEntityType.event,
  comment: REPORT_SCHEMA.stats.byEntityType.comment,
  message: REPORT_SCHEMA.stats.byEntityType.message,
};
