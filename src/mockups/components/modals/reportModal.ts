/**
 * Report Modal Mockup Data
 *
 * This file contains mockup data specifically for report modal components.
 * It provides data for report creation, detail viewing, and management modals.
 */

import {
  REPORT_SCHEMA,
  ReportEntityType,
  ReportPriority,
  ReportStatus,
} from "../../schemas/reportSchema";
import { USER_SCHEMA } from "../../schemas/userSchema";
import { EVENT_SCHEMA } from "../../schemas/eventSchema";

// Report creation form interface
export interface ReportFormMock {
  subject: string;
  description: string;
  entityType: ReportEntityType;
  entityId: string | number;
  priority: ReportPriority;
  attachments?: string[];
}

// Default empty report form
export const EMPTY_REPORT_FORM: ReportFormMock = {
  subject: "",
  description: "",
  entityType: "user",
  entityId: "",
  priority: "medium",
  attachments: [],
};

// Create a pre-filled report form for a specific entity
export const getReportFormForEntity = (
  entityType: ReportEntityType,
  entityId: string | number
): ReportFormMock => {
  let subject = "";

  // Try to get a relevant title based on entity type
  if (entityType === "user") {
    const user = USER_SCHEMA.users.find(
      (u) => String(u.id) === String(entityId)
    );
    subject = user
      ? `Report about user: ${user.name}`
      : `Report about user #${entityId}`;
  } else if (entityType === "event") {
    const event = EVENT_SCHEMA.events.find(
      (e) => String(e.id) === String(entityId)
    );
    subject = event
      ? `Report about event: ${event.title}`
      : `Report about event #${entityId}`;
  } else {
    subject = `Report about ${entityType} #${entityId}`;
  }

  return {
    ...EMPTY_REPORT_FORM,
    subject,
    entityType,
    entityId,
  };
};

// Confirmation modal data after report submission
export interface ReportConfirmationMock {
  reportId: string | number;
  subject: string;
  submittedDate: string;
  message: string;
  nextSteps: string[];
  trackingLink: string;
}

// Generate a report confirmation
export const getReportConfirmation = (
  report: ReportFormMock
): ReportConfirmationMock => {
  const reportId = `rep-${Date.now().toString().slice(-6)}`;
  const submittedDate = new Date().toISOString();

  return {
    reportId,
    subject: report.subject,
    submittedDate,
    message:
      "Thank you for submitting your report. Our team will review it shortly.",
    nextSteps: [
      "Our moderation team will review your report",
      "You may be contacted for additional information",
      "You will be notified when action is taken",
    ],
    trackingLink: `/reports/track/${reportId}`,
  };
};

// Report reason options
export const REPORT_REASON_OPTIONS = [
  { value: "inappropriate_content", label: "Inappropriate Content" },
  { value: "harassment", label: "Harassment or Bullying" },
  { value: "spam", label: "Spam or Misleading" },
  { value: "fake_account", label: "Fake Account" },
  { value: "harmful_event", label: "Harmful or Dangerous Event" },
  { value: "scam", label: "Scam or Fraud" },
  { value: "other", label: "Other" },
];

// Report update modal data (for admins/moderators)
export interface ReportUpdateModalMock {
  reportId: string | number;
  subject: string;
  description: string;
  status: ReportStatus;
  priority: ReportPriority;
  assignedTo?: string;
  resolution?: string;
  notes?: string[];
}

// Get report update data for a specific report
export const getReportUpdateModalData = (
  reportId: string | number
): ReportUpdateModalMock | undefined => {
  const report = REPORT_SCHEMA.reports.find((r) => r.id === reportId);
  if (!report) return undefined;

  return {
    reportId: report.id,
    subject: report.subject,
    description: report.description,
    status: report.status,
    priority: report.priority,
    assignedTo: report.assignedTo,
    resolution: report.resolution,
    notes: report.notes,
  };
};
