/**
 * Mockups Index
 *
 * This is the central export point for all mockup data in the application.
 * Components should import mockup data from here to ensure they're using
 * consistent data throughout the application.
 */

// Export schemas (complete data structures)
export * from "./schemas";

// Explicitly export event schema constants
import {
  EVENT_STATUS,
  EVENT_STATUS_LABELS,
  EVENT_STATUS_COLORS,
} from "./schemas/eventSchema";
export { EVENT_STATUS, EVENT_STATUS_LABELS, EVENT_STATUS_COLORS };

// Explicitly export report schema constants
import {
  REPORT_STATUS,
  REPORT_STATUS_LABELS,
  REPORT_STATUS_COLORS,
  REPORT_PRIORITY,
  REPORT_PRIORITY_LABELS,
  REPORT_PRIORITY_COLORS,
  ENTITY_TYPE_LABELS,
} from "./schemas/reportSchema";
export {
  REPORT_STATUS,
  REPORT_STATUS_LABELS,
  REPORT_STATUS_COLORS,
  REPORT_PRIORITY,
  REPORT_PRIORITY_LABELS,
  REPORT_PRIORITY_COLORS,
  ENTITY_TYPE_LABELS,
};

// Explicitly export dashboard settings
import {
  DASHBOARD_TABS,
  DASHBOARD_TAB_LABELS,
  MODAL_TYPES,
  UI_TEXT,
  REPORT_FILTERS,
  REPORT_FILTER_LABELS,
} from "./components/dashboard/dashboardSettings";
export {
  DASHBOARD_TABS,
  DASHBOARD_TAB_LABELS,
  MODAL_TYPES,
  UI_TEXT,
  REPORT_FILTERS,
  REPORT_FILTER_LABELS,
};

// Dashboard component mockups - with renamed exports to avoid conflicts
import {
  TODAY_EVENTS,
  UPCOMING_EVENTS as DASHBOARD_UPCOMING_EVENTS,
  EVENT_PARTICIPANTS,
  type TodaysEventMock,
  type EventParticipant,
} from "./components/dashboard/todaysEvents";
export { TODAY_EVENTS, DASHBOARD_UPCOMING_EVENTS, EVENT_PARTICIPANTS };
export type { TodaysEventMock, EventParticipant };

// Dashboard UI constants
import {
  LOADING_DELAYS,
  DASHBOARD_VIEW_SETTINGS,
  DASHBOARD_DATA_SETTINGS,
  ANIMATION_TIMINGS,
} from "./components/dashboard/loadingSettings";
export {
  LOADING_DELAYS,
  DASHBOARD_VIEW_SETTINGS,
  DASHBOARD_DATA_SETTINGS,
  ANIMATION_TIMINGS,
};

// Dashboard date settings
import {
  DAYS_OF_WEEK,
  MONTHS,
  DATE_DISPLAY_FORMATS,
  DATE_RANGES,
  CALENDAR_SETTINGS,
} from "./components/dashboard/dateSettings";
export {
  DAYS_OF_WEEK,
  MONTHS,
  DATE_DISPLAY_FORMATS,
  DATE_RANGES,
  CALENDAR_SETTINGS,
};

// Dashboard color settings
import { COLORS } from "./components/dashboard/colorSettings";
export { COLORS };

export * from "./components/dashboard/analyticsCharts";
export * from "./components/dashboard/recentParticipants";
export * from "./components/dashboard/eventParticipationChart";
export * from "./components/dashboard/dashboardReports";
export * from "./components/dashboard/dashboardSettings";

// Also explicitly import and export dashboard-specific event categories
import {
  EVENT_CATEGORIES as DASHBOARD_EVENT_CATEGORIES,
  EVENT_CATEGORY_NAMES,
} from "./components/dashboard/eventParticipationChart";
export { DASHBOARD_EVENT_CATEGORIES, EVENT_CATEGORY_NAMES };

// Report components with explicit exports
import {
  getReportDetails,
  getReportsByEntity,
  SAMPLE_REPORT_DETAILS,
} from "./components/reports/reportDetails";
export { getReportDetails, getReportsByEntity, SAMPLE_REPORT_DETAILS };

import {
  filterReportsByEntityType,
  filterReportsByStatus,
  filterReportsByPriority,
  sortReportsByDate,
  searchReports,
  RECENT_REPORTS,
  HIGH_PRIORITY_REPORTS,
  PENDING_REPORTS,
  REPORT_ENTITY_TYPE_OPTIONS,
  REPORT_STATUS_OPTIONS,
  REPORT_PRIORITY_OPTIONS,
} from "./components/reports/reportList";
export {
  filterReportsByEntityType,
  filterReportsByStatus,
  filterReportsByPriority,
  sortReportsByDate,
  searchReports,
  RECENT_REPORTS,
  HIGH_PRIORITY_REPORTS,
  PENDING_REPORTS,
  REPORT_ENTITY_TYPE_OPTIONS,
  REPORT_STATUS_OPTIONS,
  REPORT_PRIORITY_OPTIONS,
};

// User component mockups
export * from "./components/users/userProfile";
export * from "./components/users/userCategories";

// Also export components/events - with renamed exports to avoid conflicts
export * from "./components/events/eventDetails";

// Export from eventList with renamed exports to avoid conflicts
import {
  filterEventsByCategory,
  filterEventsByStatus,
  getUpcomingEvents,
  getPastEvents,
  UPCOMING_EVENTS,
  PAST_EVENTS,
  EVENT_CATEGORIES,
  EVENT_CATEGORIES_WITH_COUNT,
} from "./components/events/eventList";
export {
  filterEventsByCategory,
  filterEventsByStatus,
  getUpcomingEvents,
  getPastEvents,
  UPCOMING_EVENTS,
  PAST_EVENTS,
  EVENT_CATEGORIES,
  EVENT_CATEGORIES_WITH_COUNT,
};

// Export from eventForm with renamed exports to avoid conflicts
import {
  DEFAULT_EVENT_FORM,
  CATEGORY_OPTIONS as EVENT_CATEGORY_OPTIONS,
  STATUS_OPTIONS as EVENT_STATUS_OPTIONS,
  VISIBILITY_OPTIONS,
  POPULAR_TAGS,
  COMMON_LOCATIONS,
  validateEventDates,
  REJECTION_REASONS,
  CATEGORY_LABELS,
} from "./components/events/eventForm";
export {
  DEFAULT_EVENT_FORM,
  EVENT_CATEGORY_OPTIONS,
  EVENT_STATUS_OPTIONS,
  VISIBILITY_OPTIONS,
  POPULAR_TAGS,
  COMMON_LOCATIONS,
  validateEventDates,
  REJECTION_REASONS,
  CATEGORY_LABELS,
};

// Export from userList with renamed exports
import {
  RECENT_USERS,
  ACTIVE_USERS,
  ADMIN_USERS,
  searchUsers,
  filterUsersByRole,
  filterUsersByStatus,
  sortUsersByJoinDate,
  sortUsersByLastActive,
} from "./components/users/userList";
export {
  RECENT_USERS,
  ACTIVE_USERS,
  ADMIN_USERS,
  searchUsers,
  filterUsersByRole,
  filterUsersByStatus,
  sortUsersByJoinDate,
  sortUsersByLastActive,
};

// Export from userActivity with renamed exports
import {
  getUserActivityLog,
  getUserEventParticipation,
  getUserBadges,
  SAMPLE_USER_ACTIVITY,
} from "./components/users/userActivity";
export {
  getUserActivityLog,
  getUserEventParticipation,
  getUserBadges,
  SAMPLE_USER_ACTIVITY,
};

// Export user messages mockups with explicit imports for type safety
import {
  MOCK_MESSAGES,
  MOCK_CONVERSATIONS,
  getUsersForConversation,
  getConversationPartner,
  getMessagesForConversation,
  getUnreadMessageCount,
  MessageMock,
  ConversationMock,
} from "./components/users/userMessages";

// Re-export all the message-related types and functions
export {
  MOCK_MESSAGES,
  MOCK_CONVERSATIONS,
  getUsersForConversation,
  getConversationPartner,
  getMessagesForConversation,
  getUnreadMessageCount,
};
export type { MessageMock, ConversationMock };

// Export from eventModal with renamed exports
import {
  getEventModalData,
  getRegistrationConfirmation,
  CANCELLATION_REASONS,
} from "./components/modals/eventModal";
export { getEventModalData, getRegistrationConfirmation, CANCELLATION_REASONS };

// Export from eventDetailModal for the event detail modal component
import {
  getEventDetailMock,
  getDefaultEventDetailMock,
  SAMPLE_EVENT_DETAIL_MOCK,
  EVENT_REJECTION_REASONS,
  type EventDetailMock,
  type EventDetailParticipant,
  type EventReport,
} from "./components/modals/eventDetailModal";
export {
  getEventDetailMock,
  getDefaultEventDetailMock,
  SAMPLE_EVENT_DETAIL_MOCK,
  EVENT_REJECTION_REASONS,
};
export type { EventDetailMock, EventDetailParticipant, EventReport };

// Export from userModal with renamed exports
import {
  getUserModalData,
  getUserEditFormDefaults,
  GENDER_OPTIONS,
  ROLE_OPTIONS as USER_ROLE_OPTIONS,
  STATUS_OPTIONS as USER_STATUS_OPTIONS,
  POPULAR_INTERESTS,
} from "./components/modals/userModal";
export {
  getUserModalData,
  getUserEditFormDefaults,
  GENDER_OPTIONS,
  USER_ROLE_OPTIONS,
  USER_STATUS_OPTIONS,
  POPULAR_INTERESTS,
};

// Export userDetailModal utilities
import {
  getUserStatusBadgeClasses,
  getUserStatusBadgeLabel,
  getEventStatusBadgeClasses,
  getEventStatusBadgeLabel,
  getUserDetailModalData,
} from "./components/modals/userDetailModal";
export {
  getUserStatusBadgeClasses,
  getUserStatusBadgeLabel,
  getEventStatusBadgeClasses,
  getEventStatusBadgeLabel,
  getUserDetailModalData,
};

// Export from reportModal with renamed exports
import {
  getReportFormForEntity,
  getReportConfirmation,
  getReportUpdateModalData,
  EMPTY_REPORT_FORM,
  REPORT_REASON_OPTIONS,
} from "./components/modals/reportModal";
export {
  getReportFormForEntity,
  getReportConfirmation,
  getReportUpdateModalData,
  EMPTY_REPORT_FORM,
  REPORT_REASON_OPTIONS,
};

// Export from newsModal with renamed exports
import {
  NEWS_TYPES,
  EMPTY_NEWS_FORM,
  SAMPLE_NEWS_ITEMS,
  getNewsConfirmation,
  NewsType,
  NewsFormMock,
  NewsConfirmationMock,
} from "./components/modals/newsModal";
export { NEWS_TYPES, EMPTY_NEWS_FORM, SAMPLE_NEWS_ITEMS, getNewsConfirmation };
export type { NewsType, NewsFormMock, NewsConfirmationMock };

// Analytics Charts imports
import {
  MONTHLY_EVENT_DATA,
  EVENT_DATA_KEY_LABELS,
  // other imports from analyticsCharts.ts...
} from "./components/dashboard/analyticsCharts";
export { MONTHLY_EVENT_DATA, EVENT_DATA_KEY_LABELS /* other exports */ };

// Export from reportModal with renamed exports
export * from "./components/modals/reportModal";
export * from "./components/modals/userModal";
export * from "./components/modals/newsModal";
export * from "./components/modals/reportUtils";

/**
 * Usage Examples:
 *
 * 1. Using complete schema data:
 *    import { EVENT_SCHEMA, USER_SCHEMA, REPORT_SCHEMA } from '@/mockups';
 *
 * 2. Using component-specific data:
 *    import { TODAY_EVENTS, EVENT_PARTICIPANTS, RECENT_PARTICIPANTS } from '@/mockups';
 *    import { UPCOMING_EVENTS, PAST_EVENTS, EVENT_CATEGORIES_WITH_COUNT } from '@/mockups';
 *    import { RECENT_USERS, ACTIVE_USERS, ADMIN_USERS, USER_STATS } from '@/mockups';
 *    import { RECENT_REPORTS, HIGH_PRIORITY_REPORTS, PENDING_REPORTS } from '@/mockups';
 *
 * 3. Using utility functions:
 *    import { getUserProfile, filterEventsByCategory, getEventDetails } from '@/mockups';
 *    import { getUserActivityLog, getUserBadges, searchUsers } from '@/mockups';
 *    import { getReportDetails, searchReports, sortReportsByDate } from '@/mockups';
 *
 * 4. Using form data and options:
 *    import { DEFAULT_EVENT_FORM, EVENT_CATEGORY_OPTIONS, EVENT_STATUS_OPTIONS } from '@/mockups';
 *    import { GENDER_OPTIONS, USER_ROLE_OPTIONS, USER_STATUS_OPTIONS } from '@/mockups';
 *    import { REPORT_REASON_OPTIONS, EMPTY_REPORT_FORM, REPORT_STATUS_OPTIONS } from '@/mockups';
 */
