/**
 * Mockups Index
 *
 * This is the central export point for all mockup data in the application.
 * Components should import mockup data from here to ensure they're using
 * consistent data throughout the application.
 */

// Export schemas (complete data structures)
export * from "./schemas";

// Dashboard component mockups
export * from "./components/dashboard/todaysEvents";
export * from "./components/dashboard/analyticsCharts";
export * from "./components/dashboard/recentParticipants";
export * from "./components/dashboard/eventParticipationChart";
export * from "./components/dashboard/dashboardReports";

// User component mockups
export * from "./components/users/userProfile";

/**
 * Usage Examples:
 *
 * 1. Using complete schema data:
 *    import { EVENT_SCHEMA, USER_SCHEMA, REPORT_SCHEMA } from '@/mockups';
 *
 * 2. Using component-specific data:
 *    import { TODAY_EVENTS, EVENT_PARTICIPANTS, RECENT_PARTICIPANTS, RECENT_DASHBOARD_REPORTS } from '@/mockups';
 *
 * 3. Using utility functions:
 *    import { getUserProfile, getUserEvents, filterEventDataByCategories } from '@/mockups';
 */
