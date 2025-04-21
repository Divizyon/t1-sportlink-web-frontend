/**
 * Analytics Charts Mockup Data
 *
 * This file contains mockup data specifically for the dashboard analytics charts
 * components. It uses data derived from the main schemas.
 */

import { EVENT_SCHEMA, EventCategory } from "../../schemas/eventSchema";
import { USER_SCHEMA } from "../../schemas/userSchema";

// Chart data interfaces
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

// Months in Turkish
const MONTHS_TR = [
  "Ocak",
  "Şubat",
  "Mart",
  "Nisan",
  "Mayıs",
  "Haziran",
  "Temmuz",
  "Ağustos",
  "Eylül",
  "Ekim",
  "Kasım",
  "Aralık",
];

// Monthly events data derived from the schema
export const MONTHLY_EVENT_DATA: ChartData[] = MONTHS_TR.map((month, index) => {
  // Calculate random but consistent numbers for each month
  const seed = index + 1;
  const approved = 20 + ((seed * 3) % 15);
  const pending = 5 + ((seed * 2) % 8);
  const rejected = 1 + ((seed * 1) % 4);
  const completed = approved - (seed % 3);

  return {
    name: month,
    onaylanan: approved,
    bekleyen: pending,
    reddedilen: rejected,
    tamamlanan: completed,
  };
});

// Category distribution data
export const CATEGORY_DISTRIBUTION: CategoryData[] = Object.entries(
  EVENT_SCHEMA.events.reduce((acc, event) => {
    const category = event.category as string;
    acc[category] = (acc[category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>)
).map(([name, value], index) => ({
  name,
  value,
  color: CHART_COLORS[index % CHART_COLORS.length],
}));

// Weekly activity data
export const WEEKLY_ACTIVITY_DATA = [
  { day: "Pazartesi", events: 12, participants: 68 },
  { day: "Salı", events: 8, participants: 42 },
  { day: "Çarşamba", events: 15, participants: 85 },
  { day: "Perşembe", events: 10, participants: 56 },
  { day: "Cuma", events: 18, participants: 94 },
  { day: "Cumartesi", events: 22, participants: 128 },
  { day: "Pazar", events: 14, participants: 76 },
];

// User registration statistics by month
export const USER_REGISTRATION_DATA = MONTHS_TR.map((month, index) => {
  // Calculate random but consistent numbers for each month
  const seed = index + 1;
  const newUsers = 15 + ((seed * 4) % 20);
  const activeUsers = 35 + ((seed * 5) % 25);
  const participatingUsers = 25 + ((seed * 3) % 15);

  return {
    name: month,
    new: newUsers,
    active: activeUsers,
    participating: participatingUsers,
  };
});

// Event status distribution
export const EVENT_STATUS_DISTRIBUTION = {
  pending: EVENT_SCHEMA.stats.pending,
  approved: EVENT_SCHEMA.stats.approved,
  rejected: EVENT_SCHEMA.stats.rejected,
  completed: EVENT_SCHEMA.stats.completed,
  cancelled: EVENT_SCHEMA.stats.cancelled,
  ongoing: EVENT_SCHEMA.stats.ongoing,
};

// User role distribution
export const USER_ROLE_DISTRIBUTION = {
  admin: USER_SCHEMA.roles.admin,
  moderator: USER_SCHEMA.roles.moderator,
  organizer: USER_SCHEMA.roles.organizer,
  regular: USER_SCHEMA.roles.regular,
};

// Chart data key to Turkish label mapping
export const EVENT_DATA_KEY_LABELS: Record<string, string> = {
  onaylanan: "Onaylanan",
  bekleyen: "Bekleyen",
  reddedilen: "Reddedilen",
  tamamlanan: "Tamamlanan",
};
