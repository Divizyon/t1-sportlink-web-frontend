/**
 * Report Types
 * This file contains types related to reports, aligned with the schema in mockups
 */

// Report status types (matching reportSchema.ts)
export type ReportStatus =
  | "pending"
  | "reviewing"
  | "resolved"
  | "rejected"
  | "dismissed";

// Report priority levels (matching reportSchema.ts)
export type ReportPriority = "low" | "medium" | "high";

// Entity types that can be reported (matching reportSchema.ts)
export type ReportEntityType = "user" | "event" | "comment" | "message";

// Report interface (matching reportSchema.ts)
export interface Report {
  id: number | string;
  subject: string;
  description: string;
  reportedBy: string;
  reportedDate: string;
  priority: ReportPriority;
  status: ReportStatus;
  entityId: number | string;
  entityType: ReportEntityType;
  assignedTo?: string;
  resolution?: string;
  resolutionDate?: string;
  notes?: string[];
  attachments?: string[];
  reason?: string; // For backward compatibility
  details?: string; // For backward compatibility
  adminNote?: string; // For backward compatibility
  adminName?: string; // For backward compatibility
  adminActionDate?: string; // For backward compatibility
  isBanned?: boolean; // For backward compatibility
}

// Report statistics interface (matching reportSchema.ts)
export interface ReportStats {
  total: number;
  pending: number;
  reviewing: number;
  resolved: number;
  rejected: number;
  dismissed: number;
  byPriority: {
    low: number;
    medium: number;
    high: number;
  };
  byEntityType: {
    user: number;
    event: number;
    comment: number;
    message: number;
  };
}
