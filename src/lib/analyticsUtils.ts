/**
 * Analytics Utility Functions
 * Specialized utilities for data visualization and analytics
 */

import { ChartData, CategoryData } from "@/types";
import { Event } from "@/types";
import { COLORS } from "@/mockups";
import {
  groupEventsByCategory,
  groupEventsByStatus,
  eventsToChartData,
} from "./dashboardUtils";

/**
 * Calculates summary statistics from event data
 */
export function calculateEventStats(events: Event[]) {
  const total = events.length;
  const grouped = groupEventsByStatus(events);

  return {
    total,
    approved: grouped.approved?.length || 0,
    pending: grouped.pending?.length || 0,
    rejected: grouped.rejected?.length || 0,
    completed: grouped.completed?.length || 0,
    approvalRate: calculateApprovalRate(events),
    completionRate: calculateCompletionRate(events),
    participationRate: calculateParticipationRate(events),
  };
}

/**
 * Calculates the percentage of approved events
 */
export function calculateApprovalRate(events: Event[]): number {
  if (events.length === 0) return 0;

  const approvedCount = events.filter(
    (event) => event.status === "approved" || event.status === "completed"
  ).length;

  return Math.round((approvedCount / events.length) * 100);
}

/**
 * Calculates the percentage of completed events
 */
export function calculateCompletionRate(events: Event[]): number {
  if (events.length === 0) return 0;

  // Only consider approved and completed events for this calculation
  const relevantEvents = events.filter(
    (event) => event.status === "approved" || event.status === "completed"
  );

  if (relevantEvents.length === 0) return 0;

  const completedCount = relevantEvents.filter(
    (event) => event.status === "completed"
  ).length;

  return Math.round((completedCount / relevantEvents.length) * 100);
}

/**
 * Calculates the average participation rate across all events
 */
export function calculateParticipationRate(events: Event[]): number {
  if (events.length === 0) return 0;

  // Only include events that have participants and maxParticipants
  const validEvents = events.filter(
    (event) =>
      typeof event.participants === "number" &&
      typeof event.maxParticipants === "number" &&
      event.maxParticipants > 0
  );

  if (validEvents.length === 0) return 0;

  const totalRate = validEvents.reduce((sum, event) => {
    return sum + event.participants / event.maxParticipants;
  }, 0);

  return Math.round((totalRate / validEvents.length) * 100);
}

/**
 * Calculates month-over-month growth in events
 */
export function calculateEventGrowth(
  currentMonthEvents: Event[],
  previousMonthEvents: Event[]
): number {
  const currentCount = currentMonthEvents.length;
  const previousCount = previousMonthEvents.length;

  if (previousCount === 0) {
    return currentCount > 0 ? 100 : 0;
  }

  return Number(
    (((currentCount - previousCount) / previousCount) * 100).toFixed(1)
  );
}

/**
 * Creates a dataset for event category distribution
 */
export function generateCategoryDistribution(events: Event[]): CategoryData[] {
  const grouped = groupEventsByCategory(events);

  return Object.entries(grouped).map(([category, events], index) => ({
    name: category,
    value: events.length,
    color: COLORS.chart[index % COLORS.chart.length],
  }));
}

/**
 * Prepares stacked bar chart data from events based on time period
 */
export function prepareStackedBarChartData(
  events: Event[],
  timeframe: "daily" | "monthly" = "daily"
): ChartData[] {
  return eventsToChartData(events, timeframe);
}

/**
 * Calculates fill rate statistics for events
 */
export function calculateFillRates(events: Event[]) {
  // Only include events with participant data
  const validEvents = events.filter(
    (event) =>
      typeof event.participants === "number" &&
      typeof event.maxParticipants === "number" &&
      event.maxParticipants > 0
  );

  if (validEvents.length === 0) {
    return {
      average: 0,
      high: 0,
      medium: 0,
      low: 0,
    };
  }

  const rates = validEvents.map(
    (event) => (event.participants / event.maxParticipants) * 100
  );

  const average = rates.reduce((sum, rate) => sum + rate, 0) / rates.length;

  // Count events by fill rate category
  const high = rates.filter((rate) => rate >= 75).length;
  const medium = rates.filter((rate) => rate >= 40 && rate < 75).length;
  const low = rates.filter((rate) => rate < 40).length;

  return {
    average: Math.round(average),
    high,
    medium,
    low,
  };
}
