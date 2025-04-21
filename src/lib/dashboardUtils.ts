/**
 * Dashboard Utility Functions
 *
 * Specialized utilities for dashboard components and event data visualization.
 * This file contains functions specific to event grouping, statistics, and chart data formatting.
 *
 * USAGE GUIDELINES:
 * - Use these functions for dashboard-specific operations and event analysis
 * - For generic utilities, use utils.ts instead
 * - For user-specific operations, use userUtils.ts
 *
 * NOTES:
 * - Some functions from utils.ts are re-exported here for backward compatibility
 *   (calculatePercentage, calculateGrowth, formatPercentage, formatGrowth)
 *
 * @example
 * // Dashboard specific operations
 * import { groupEventsByStatus, eventsToChartData } from "@/lib/dashboardUtils";
 */

import { ChartData, CategoryData } from "@/types";
import { Event, EventStatus } from "@/types";
import {
  EVENT_STATUS_LABELS,
  DAYS_OF_WEEK,
  MONTHS,
  COLORS,
  EVENT_STATUS_COLORS,
} from "@/mockups";
import {
  formatDashboardDate,
  calculatePercentage,
  calculateGrowth,
  formatPercentage,
  formatGrowth,
} from "./utils";

// Re-export functions to maintain backward compatibility
export { calculatePercentage, calculateGrowth, formatPercentage, formatGrowth };

/**
 * Data Transformation Utilities
 */

/**
 * Groups events by their status
 * @example const eventsByStatus = groupEventsByStatus(events);
 */
export function groupEventsByStatus(
  events: Event[]
): Record<EventStatus, Event[]> {
  return events.reduce((acc, event) => {
    if (!acc[event.status]) {
      acc[event.status] = [];
    }
    acc[event.status].push(event);
    return acc;
  }, {} as Record<EventStatus, Event[]>);
}

/**
 * Counts events by status
 * @example const statusCounts = countEventsByStatus(events);
 */
export function countEventsByStatus(
  events: Event[]
): Record<EventStatus, number> {
  const grouped = groupEventsByStatus(events);
  return Object.keys(EVENT_STATUS_LABELS).reduce((acc, status) => {
    const eventStatus = status as EventStatus;
    acc[eventStatus] = grouped[eventStatus]?.length || 0;
    return acc;
  }, {} as Record<EventStatus, number>);
}

/**
 * Groups events by category
 * @example const eventsByCategory = groupEventsByCategory(events);
 */
export function groupEventsByCategory(
  events: Event[]
): Record<string, Event[]> {
  return events.reduce((acc, event) => {
    if (!acc[event.category]) {
      acc[event.category] = [];
    }
    acc[event.category].push(event);
    return acc;
  }, {} as Record<string, Event[]>);
}

/**
 * Chart Data Utilities
 */

/**
 * Converts events to chart data format for visualization
 * @param timeframe "daily" or "monthly" grouping
 * @example const chartData = eventsToChartData(events, "daily");
 */
export function eventsToChartData(
  events: Event[],
  timeframe: "daily" | "monthly" = "daily"
): ChartData[] {
  type ChartDataValues = {
    onaylanan: number;
    bekleyen: number;
    reddedilen: number;
    tamamlanan: number;
  };

  const groupedByDate = events.reduce((acc, event) => {
    if (!event.date) {
      return acc; // Skip events with no date
    }

    // Get date key based on timeframe
    let dateKey: string;

    if (timeframe === "daily") {
      // For daily, use day of week
      const eventDate = new Date(event.date);
      const day = eventDate.getDay();
      dateKey = DAYS_OF_WEEK[day === 0 ? 6 : day - 1]; // Adjust for Monday start
    } else {
      // For monthly, use month
      const eventDate = new Date(event.date);
      dateKey = MONTHS[eventDate.getMonth()];
    }

    if (!acc[dateKey]) {
      acc[dateKey] = {
        onaylanan: 0,
        bekleyen: 0,
        reddedilen: 0,
        tamamlanan: 0,
      };
    }

    // Increment the appropriate counter
    if (event.status === "approved") {
      acc[dateKey].onaylanan += 1;
    } else if (event.status === "pending") {
      acc[dateKey].bekleyen += 1;
    } else if (event.status === "rejected") {
      acc[dateKey].reddedilen += 1;
    } else if (event.status === "completed") {
      acc[dateKey].tamamlanan += 1;
    }

    return acc;
  }, {} as Record<string, ChartDataValues>);

  // Convert to array format expected by charts
  return Object.entries(groupedByDate).map(([name, data]) => ({
    name,
    onaylanan: data.onaylanan,
    bekleyen: data.bekleyen,
    reddedilen: data.reddedilen,
    tamamlanan: data.tamamlanan,
  }));
}

/**
 * Converts category data to chart format for pie/donut charts
 * @example const categoryChartData = categoriesToChartData(events);
 */
export function categoriesToChartData(events: Event[]): CategoryData[] {
  const grouped = groupEventsByCategory(events);

  return Object.entries(grouped).map(([category, events], index) => ({
    name: category,
    value: events.length,
    color: COLORS.chart[index % COLORS.chart.length],
  }));
}

/**
 * Filtering Utilities
 */

/**
 * Filters events by a date range
 * @example const eventsInRange = filterEventsByDateRange(events, startDate, endDate);
 */
export function filterEventsByDateRange(
  events: Event[],
  startDate: Date,
  endDate: Date
): Event[] {
  return events.filter((event) => {
    if (!event.date) return false;
    const eventDate = new Date(event.date);
    return eventDate >= startDate && eventDate <= endDate;
  });
}

/**
 * Filters events by categories
 * @example const sportEvents = filterEventsByCategories(events, ["Futbol", "Basketbol"]);
 */
export function filterEventsByCategories(
  events: Event[],
  categories: string[]
): Event[] {
  if (!categories.length) return events;
  return events.filter((event) => categories.includes(event.category));
}

/**
 * Filters events by status
 * @example const completedEvents = filterEventsByStatus(events, ["completed"]);
 */
export function filterEventsByStatus(
  events: Event[],
  statuses: EventStatus[]
): Event[] {
  if (!statuses.length) return events;
  return events.filter((event) => statuses.includes(event.status));
}

/**
 * Gets the color for an event status
 * @example const color = getStatusColor("completed"); // Returns the color for completed status
 */
export function getStatusColor(status: EventStatus): string {
  // Create a type-safe mapping of EventStatus to color
  const statusColors: Record<EventStatus, string> = {
    approved: EVENT_STATUS_COLORS.approved,
    pending: EVENT_STATUS_COLORS.pending,
    rejected: EVENT_STATUS_COLORS.rejected,
    completed: EVENT_STATUS_COLORS.completed,
    // For other statuses, use appropriate fallbacks from our color palette
    cancelled: EVENT_STATUS_COLORS.pending, // Fallback for cancelled
    ongoing: EVENT_STATUS_COLORS.approved, // Fallback for ongoing
    upcoming: EVENT_STATUS_COLORS.pending, // Fallback for upcoming
  };

  return statusColors[status] || EVENT_STATUS_COLORS.pending;
}
