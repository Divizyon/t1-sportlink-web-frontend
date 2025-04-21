/**
 * Dashboard Types
 * This file contains all TypeScript interfaces and types for the dashboard components.
 */

// Import the shared Event and User types
import { Event, EventCategory, EventStatus } from "./event";

// User type (consistent with mockups/schemas/userSchema.ts)
export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: UserRole;
  status: UserStatus;
  joinDate: string; // ISO date string
  lastActive: string; // ISO date string
  profile?: {
    bio?: string;
    location?: string;
    phoneNumber?: string;
    dateOfBirth?: string;
    gender?: "male" | "female" | "other" | "prefer-not-to-say";
    interests?: string[];
    socialMedia?: {
      twitter?: string;
      instagram?: string;
      facebook?: string;
      linkedIn?: string;
    };
  };
}

// User role types
export type UserRole = "admin" | "moderator" | "organizer" | "regular";

// User status types
export type UserStatus =
  | "active"
  | "inactive"
  | "pending"
  | "suspended"
  | "banned";

export interface Participant {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  lastEvent: string;
}

// Chart Data Types
export interface ChartData {
  name: string;
  onaylanan: number;
  bekleyen: number;
  reddedilen: number;
  tamamlanan: number;
  [key: string]: string | number;
}

export interface CategoryData {
  name: string;
  value: number;
  color: string;
}

export interface CategoryCount {
  name: string;
  count: number;
  change: string;
}

// Report Types
export interface Report {
  id: number;
  subject: string;
  description: string;
  reportedBy: string;
  reportedDate: string;
  entityType: "user" | "event";
  entityId: number;
  priority: ReportPriority;
  status: ReportStatus;
  reason?: string;
  details?: string;
  adminNote?: string;
  adminName?: string;
  adminActionDate?: string;
  isBanned?: boolean;
}

export type ReportPriority = "high" | "medium" | "low";
export type ReportStatus =
  | "pending"
  | "reviewing"
  | "resolved"
  | "rejected"
  | "dismissed";

// Component Props Types
export interface EventParticipationChartProps {
  categories?: string[];
}

export interface RecentParticipantsProps {
  onUserSelect?: (participant: Participant) => void;
}

export interface TodaysEventsProps {
  onEventSelect?: (event: Event) => void;
  onUserSelect?: (participant: Participant) => void;
  categories?: string[];
}

export interface CategoryFilterDropdownProps {
  selectedCategories: string[];
  onChange: (categories: string[]) => void;
}

// Dashboard Tab Types
export type TabType =
  | "overview"
  | "reports"
  | "events"
  | "users"
  | "messages"
  | "notifications"
  | "analytics"
  | "settings";

// Legacy Dashboard Tab Types (for backward compatibility)
export type DashboardTabValue = "overview" | "analytics" | "reports";

// Modal Types
export type ModalType =
  | "newReport"
  | "viewReport"
  | "editReport"
  | "deleteReport"
  | "newEvent"
  | "viewEvent"
  | "editEvent"
  | "deleteEvent"
  | "sendMessage"
  | "viewMessage"
  | "newUser"
  | "viewUser"
  | "editUser"
  | "deleteUser"
  | "newNotification"
  | "viewNotification"
  | "settings";

// Legacy Modal Types (for backward compatibility)
export type LegacyModalType =
  | "event"
  | "newEvent"
  | "newNews"
  | "newAnnouncement"
  | "user"
  | "users"
  | "dailyEvents"
  | "activeUsers"
  | "totalParticipants"
  | "reportedUsers"
  | "reportedEvents"
  | "orgEvents";

// Report Filter Types
export type ReportFilterType =
  | "all"
  | "pending"
  | "reviewing"
  | "resolved"
  | "rejected"
  | "dismissed"
  | "highPriority";

// Legacy Filter Types (for backward compatibility)
export type LegacyReportFilterType = "all" | "users" | "events";
