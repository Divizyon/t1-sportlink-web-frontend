/**
 * Dashboard Types
 * This file contains all TypeScript interfaces and types for the dashboard components.
 */

// Import the shared Event and User types
import { Event, EventCategory, EventStatus } from "./event";
import { ReportEntityType, ReportPriority, ReportStatus } from "./report";

// User type (exactly matching userSchema.ts)
export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: UserRole;
  status: UserStatus;
  joinDate: string; // ISO date string
  lastActive: string; // ISO date string
  profile: {
    bio?: string;
    location?: string;
    phoneNumber?: string;
    dateOfBirth?: string; // ISO date string
    gender?: "male" | "female" | "other" | "prefer-not-to-say";
    interests?: string[];
    socialMedia?: {
      twitter?: string;
      instagram?: string;
      facebook?: string;
      linkedIn?: string;
    };
  };
  preferences?: {
    notifications: {
      email: boolean;
      push: boolean;
      sms: boolean;
    };
    privacy: {
      showEmail: boolean;
      showPhone: boolean;
      showLocation: boolean;
      showJoinDate: boolean;
    };
    theme?: "light" | "dark" | "system";
    language?: string;
  };
  stats?: {
    eventsAttended: number;
    eventsOrganized: number;
    ratingsReceived: number;
    averageRating: number;
    reportsSubmitted: number;
    reportsReceived: number;
  };
  membership?: {
    type: "free" | "premium" | "pro";
    startDate: string; // ISO date string
    endDate?: string; // ISO date string
    autoRenew: boolean;
  };
  verifications?: {
    email: boolean;
    phone: boolean;
    identityDocument: boolean;
  };
  contactPermissions?: {
    marketing: boolean;
    updates: boolean;
    surveys: boolean;
  };
}

// User role types (exactly matching userSchema.ts)
export type UserRole =
  | "admin"
  | "director"
  | "staff"
  | "head_coach"
  | "coach"
  | "moderator"
  | "organizer"
  | "regular";

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

// Dashboard Tab Types - exactly matching dashboardSettings.ts
export type TabType =
  | "overview"
  | "reports"
  | "events"
  | "users"
  | "messages"
  | "notifications"
  | "analytics"
  | "settings";

// DashboardTabValue matches TabType for full compatibility
export type DashboardTabValue = TabType;

// Modal Types - match all used modals in the MODAL_TYPES from dashboardSettings.ts
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
  | "settings"
  // Legacy modal types for backward compatibility
  | "event"
  | "user"
  | "dailyEvents"
  | "orgEvents"
  | "reportedUsers"
  | "reportedEvents"
  | "users"
  | "activeUsers"
  | "totalParticipants"
  | "EVENT"
  | "USER"
  | "DAILY_EVENTS"
  | "ORG_EVENTS"
  | "REPORTED_USERS"
  | "REPORTED_EVENTS"
  | "NEW_EVENT"
  | "ANNOUNCEMENT"
  | "NEWS"
  | null; // Allow null for compatibility with existing code

// Report Filter Types - exactly matching dashboardSettings.ts
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
