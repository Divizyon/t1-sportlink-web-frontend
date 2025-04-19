/**
 * Dashboard Utility Functions
 * Provides reusable utility functions for dashboard components
 */

import { ChartData, CategoryData, Event, EventStatus } from "@/types/dashboard";
import { EVENT_STATUS_LABELS, COLORS, DAYS_OF_WEEK, MONTHS } from "@/constants";

/**
 * Data Transformation Utilities
 */

/**
 * Calculates percentage value
 */
export function calculatePercentage(value: number, total: number): number {
  return total > 0 ? Math.round((value / total) * 100) : 0;
}

/**
 * Calculates the growth percentage between current and previous values
 */
export function calculateGrowth(current: number, previous: number): number {
  if (previous === 0) return current > 0 ? 100 : 0;
  return Number((((current - previous) / previous) * 100).toFixed(1));
}

/**
 * Groups events by their status
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
 * Converts events to chart data format
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
    // Get date key based on timeframe
    let dateKey: string;

    if (timeframe === "daily") {
      // For daily, use day of week
      const day = event.date.getDay();
      dateKey = DAYS_OF_WEEK[day === 0 ? 6 : day - 1]; // Adjust for Monday start
    } else {
      // For monthly, use month
      dateKey = MONTHS[event.date.getMonth()];
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
 * Converts category data to chart format
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
 */
export function filterEventsByDateRange(
  events: Event[],
  startDate: Date,
  endDate: Date
): Event[] {
  return events.filter((event) => {
    const eventDate = new Date(event.date);
    return eventDate >= startDate && eventDate <= endDate;
  });
}

/**
 * Filters events by categories
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
 */
export function filterEventsByStatus(
  events: Event[],
  statuses: EventStatus[]
): Event[] {
  if (!statuses.length) return events;
  return events.filter((event) => statuses.includes(event.status));
}

/**
 * Formatting Utilities
 */

/**
 * Formats a number as a percentage string
 */
export function formatPercentage(value: number): string {
  return `${value}%`;
}

/**
 * Formats a growth value with + or - sign
 */
export function formatGrowth(value: number): string {
  const sign = value > 0 ? "+" : "";
  return `${sign}${value}%`;
}

/**
 * Gets the color for an event status
 */
export function getStatusColor(status: EventStatus): string {
  return COLORS.status[status] || COLORS.status.pending;
}

/**
 * Format date for display on dashboard
 */
export function formatDashboardDate(date: Date): string {
  return date.toLocaleDateString("tr-TR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}
