/**
 * Event Participation Chart Mockup Data
 *
 * This file contains mockup data specifically for the EventParticipationChart component
 * (/components/dashboard/analytics/EventParticipationChart.tsx).
 *
 * It provides structured data for both daily event summaries and category distribution
 * used in chart visualizations.
 */

import { EVENT_SCHEMA, EventCategory } from "../../schemas/eventSchema";

// Chart data interfaces
export interface EventChartData {
  name: string;
  onaylanan: number;
  bekleyen: number;
  reddedilen: number;
  tamamlanan: number;
  [key: string]: string | number;
}

export interface EventCategoryData {
  name: string;
  value: number;
  color: string;
}

// Chart color constants
const CHART_COLORS = [
  "#4338ca", // indigo-700
  "#0891b2", // cyan-600
  "#059669", // emerald-600
  "#d97706", // amber-600
  "#dc2626", // red-600
  "#7c3aed", // violet-600
  "#2563eb", // blue-600
  "#c026d3", // fuchsia-600
];

// Days of week in Turkish
const DAYS_OF_WEEK_TR = [
  "Pazartesi",
  "Salı",
  "Çarşamba",
  "Perşembe",
  "Cuma",
  "Cumartesi",
  "Pazar",
];

// Daily event data - specific to the EventParticipationChart component
export const DAILY_EVENT_DATA: EventChartData[] = DAYS_OF_WEEK_TR.map(
  (day, index) => {
    // Calculate consistent but varied numbers for each day
    const seed = index + 1;
    return {
      name: day,
      onaylanan: 10 + ((seed * 3) % 10),
      bekleyen: 3 + ((seed * 2) % 5),
      reddedilen: 1 + ((seed * 1) % 2),
      tamamlanan: 8 + ((seed * 4) % 12),
    };
  }
);

// Filter function to select data by categories
export const filterEventDataByCategories = (
  categories: string[]
): EventChartData[] => {
  if (!categories || categories.length === 0) {
    return DAILY_EVENT_DATA;
  }

  // Total available categories (fallback to using array length if schema property doesn't exist)
  const TOTAL_CATEGORIES = 8; // Estimate based on common categories

  return DAILY_EVENT_DATA.map((day) => {
    // Apply category filtering - reduce values based on selected categories
    const categoryCount = categories.length;
    const categoryRatio = categoryCount / TOTAL_CATEGORIES;

    return {
      name: day.name,
      onaylanan: Math.floor(day.onaylanan * categoryRatio),
      bekleyen: Math.floor(day.bekleyen * categoryRatio),
      reddedilen: Math.floor(day.reddedilen * categoryRatio),
      tamamlanan: Math.floor(day.tamamlanan * categoryRatio),
    };
  });
};

// Define sample category counts if schema doesn't provide them
const CATEGORY_COUNTS = {
  Futbol: 35,
  Basketbol: 25,
  Yüzme: 20,
  Tenis: 15,
  Koşu: 12,
  Yoga: 10,
  Bisiklet: 8,
  Diğer: 5,
};

// Category distribution data
export const EVENT_CATEGORY_DISTRIBUTION: EventCategoryData[] = Object.entries(
  CATEGORY_COUNTS
).map(([name, value], index) => ({
  name,
  value: typeof value === "number" ? value : 0,
  color: CHART_COLORS[index % CHART_COLORS.length],
}));

// Stats data for use in EventParticipationChart badges
export const EVENT_STATUS_COUNTS = {
  approved: EVENT_SCHEMA.stats.approved,
  pending: EVENT_SCHEMA.stats.pending,
  rejected: EVENT_SCHEMA.stats.rejected,
  completed: EVENT_SCHEMA.stats.completed,
  // Calculate total as sum of other stats
  get total() {
    return this.approved + this.pending + this.rejected + this.completed;
  },
};
