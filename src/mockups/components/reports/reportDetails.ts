/**
 * Report Details Mockup Data
 *
 * This file contains mockup data specifically for report detail components.
 * It provides detailed information about individual reports.
 */

import {
  REPORT_SCHEMA,
  ReportEntityType,
  Report,
} from "../../schemas/reportSchema";
import { USER_SCHEMA } from "../../schemas/userSchema";
import { EVENT_SCHEMA } from "../../schemas/eventSchema";

// Interface for detailed report view
export interface ReportDetailsMock extends Report {
  reportedByUser: {
    id: string;
    name: string;
    avatar: string;
    email: string;
  };
  assignedToUser?: {
    id: string;
    name: string;
    avatar: string;
    email: string;
  };
  relatedEntity?: {
    id: string | number;
    type: ReportEntityType;
    title: string;
    link: string;
    details?: any;
  };
  timeline: {
    date: string;
    action: string;
    user?: string;
    details?: string;
  }[];
  comments: {
    id: string;
    user: {
      id: string;
      name: string;
      avatar: string;
    };
    text: string;
    timestamp: string;
  }[];
}

// Get detailed information for a specific report
export const getReportDetails = (
  reportId: string | number
): ReportDetailsMock | undefined => {
  const report = REPORT_SCHEMA.reports.find((r) => r.id === reportId);
  if (!report) return undefined;

  // Find reported by user info
  const reportedByName =
    typeof report.reportedBy === "string" ? report.reportedBy : "";
  const reportedByUser = {
    id: "usr-" + Math.floor(Math.random() * 1000),
    name: reportedByName,
    avatar: "/avatars/default.png",
    email: reportedByName.toLowerCase().replace(" ", ".") + "@example.com",
  };

  // Find assigned to user info (if any)
  let assignedToUser = undefined;
  if (report.assignedTo) {
    const assignedToName = report.assignedTo;
    assignedToUser = {
      id: "usr-" + Math.floor(Math.random() * 1000),
      name: assignedToName,
      avatar: "/avatars/default.png",
      email: assignedToName.toLowerCase().replace(" ", ".") + "@example.com",
    };
  }

  // Get related entity details
  let relatedEntity = undefined;
  if (report.entityId && report.entityType) {
    let title = "Unknown";
    let link = "#";
    let details = null;

    if (report.entityType === "event") {
      const event = EVENT_SCHEMA.events.find(
        (e) => String(e.id) === String(report.entityId)
      );
      if (event) {
        title = event.title;
        link = `/events/${event.id}`;
        details = {
          description: event.description,
          date: event.startDate,
          organizer: event.organizer.name,
        };
      }
    } else if (report.entityType === "user") {
      const user = USER_SCHEMA.users.find(
        (u) => String(u.id) === String(report.entityId)
      );
      if (user) {
        title = user.name;
        link = `/users/${user.id}`;
        details = {
          email: user.email,
          role: user.role,
          joinDate: user.joinDate,
        };
      }
    } else {
      title = `${
        report.entityType.charAt(0).toUpperCase() + report.entityType.slice(1)
      } #${report.entityId}`;
      link = `/${report.entityType}s/${report.entityId}`;
    }

    relatedEntity = {
      id: report.entityId,
      type: report.entityType,
      title,
      link,
      details,
    };
  }

  // Generate a timeline of actions for this report
  const reportedDate = new Date(report.reportedDate);

  const timeline = [
    {
      date: reportedDate.toISOString(),
      action: "Report Created",
      user: reportedByUser.name,
      details: `Report was submitted by ${reportedByUser.name}`,
    },
  ];

  // Add review step if report was reviewed
  if (
    report.status === "reviewing" ||
    report.status === "resolved" ||
    report.status === "rejected"
  ) {
    const reviewDate = new Date(reportedDate);
    reviewDate.setDate(reviewDate.getDate() + 1);

    timeline.push({
      date: reviewDate.toISOString(),
      action: "Under Review",
      user: assignedToUser?.name || "System",
      details: `Report was assigned to ${
        assignedToUser?.name || "a moderator"
      } for review`,
    });
  }

  // Add resolution step if report was resolved or rejected
  if (report.status === "resolved" || report.status === "rejected") {
    const resolutionDate =
      report.resolutionDate ||
      new Date(reportedDate.getTime() + 172800000).toISOString(); // 2 days later if not specified

    timeline.push({
      date: resolutionDate,
      action: report.status === "resolved" ? "Resolved" : "Rejected",
      user: assignedToUser?.name || "System",
      details:
        report.resolution ||
        `Report was ${
          report.status === "resolved" ? "resolved" : "rejected"
        } by ${assignedToUser?.name || "the system"}`,
    });
  }

  // Sort timeline chronologically
  timeline.sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  // Generate sample comments
  const comments = [];

  if (report.status !== "pending") {
    const commentDate = new Date(reportedDate);
    commentDate.setHours(commentDate.getHours() + 4);

    comments.push({
      id: `comment-1`,
      user: {
        id: assignedToUser?.id || "usr-mod",
        name: assignedToUser?.name || "Moderator",
        avatar: assignedToUser?.avatar || "/avatars/default.png",
      },
      text: "Thank you for submitting this report. We are looking into it.",
      timestamp: commentDate.toISOString(),
    });
  }

  if (report.status === "resolved" || report.status === "rejected") {
    const commentDate = new Date(reportedDate);
    commentDate.setHours(commentDate.getHours() + 48);

    comments.push({
      id: `comment-2`,
      user: {
        id: assignedToUser?.id || "usr-mod",
        name: assignedToUser?.name || "Moderator",
        avatar: assignedToUser?.avatar || "/avatars/default.png",
      },
      text:
        report.resolution ||
        `We have ${
          report.status === "resolved" ? "resolved" : "rejected"
        } this report. ${
          report.status === "resolved"
            ? "Appropriate action has been taken."
            : "No action was required."
        }`,
      timestamp: commentDate.toISOString(),
    });
  }

  return {
    ...report,
    reportedByUser,
    assignedToUser,
    relatedEntity,
    timeline,
    comments,
  };
};

// Get a sample report detail
export const SAMPLE_REPORT_DETAILS = getReportDetails(
  REPORT_SCHEMA.reports[0].id
);

// Get reports by entity
export const getReportsByEntity = (
  entityType: ReportEntityType,
  entityId: string | number
): ReportDetailsMock[] => {
  return REPORT_SCHEMA.reports
    .filter(
      (report) =>
        report.entityType === entityType &&
        String(report.entityId) === String(entityId)
    )
    .map((report) => getReportDetails(report.id))
    .filter((report): report is ReportDetailsMock => !!report);
};
