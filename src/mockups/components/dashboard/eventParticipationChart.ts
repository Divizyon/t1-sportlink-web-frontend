/**
 * Event Participation Chart Mockups
 *
 * This file contains mockup data specifically for the EventParticipationChart component.
 */

import { EVENT_STATUS_COLORS } from "../../schemas/eventSchema";
import { COLORS } from "./colorSettings";
import { ChartData, CategoryData } from "@/types/dashboard";

// Event categories for filtering
export const EVENT_CATEGORIES = {
  all: "all",
  training: "training",
  tournament: "tournament",
  social: "social",
  sport: "sport",
  meeting: "meeting",
  other: "other",
};

// Human-readable category names
export const EVENT_CATEGORY_NAMES = {
  all: "Tüm Etkinlikler",
  training: "Antrenmanlar",
  tournament: "Turnuvalar",
  social: "Sosyal Etkinlikler",
  sport: "Spor Etkinlikleri",
  meeting: "Toplantılar",
  other: "Diğer",
};

// Sample daily event data for the bar chart
export const DAILY_EVENT_DATA: ChartData[] = [
  {
    name: "Pzt",
    onaylanan: 5,
    bekleyen: 2,
    reddedilen: 1,
    tamamlanan: 3,
  },
  {
    name: "Sal",
    onaylanan: 7,
    bekleyen: 1,
    reddedilen: 0,
    tamamlanan: 4,
  },
  {
    name: "Çar",
    onaylanan: 6,
    bekleyen: 3,
    reddedilen: 1,
    tamamlanan: 2,
  },
  {
    name: "Per",
    onaylanan: 8,
    bekleyen: 2,
    reddedilen: 2,
    tamamlanan: 5,
  },
  {
    name: "Cum",
    onaylanan: 10,
    bekleyen: 3,
    reddedilen: 0,
    tamamlanan: 6,
  },
  {
    name: "Cmt",
    onaylanan: 15,
    bekleyen: 1,
    reddedilen: 0,
    tamamlanan: 4,
  },
  {
    name: "Paz",
    onaylanan: 4,
    bekleyen: 1,
    reddedilen: 0,
    tamamlanan: 2,
  },
];

// Event category distribution for the pie chart
export const EVENT_CATEGORY_DISTRIBUTION: CategoryData[] = [
  {
    name: "Antrenmanlar",
    value: 35,
    color: COLORS.chart[0],
  },
  {
    name: "Turnuvalar",
    value: 20,
    color: COLORS.chart[1],
  },
  {
    name: "Sosyal Etkinlikler",
    value: 15,
    color: COLORS.chart[2],
  },
  {
    name: "Spor Etkinlikleri",
    value: 25,
    color: COLORS.chart[3],
  },
  {
    name: "Toplantılar",
    value: 10,
    color: COLORS.chart[4],
  },
  {
    name: "Diğer",
    value: 5,
    color: COLORS.chart[5],
  },
];

// Event status counts for the badges
export const EVENT_STATUS_COUNTS = {
  approved: 55,
  pending: 13,
  rejected: 4,
  completed: 26,
  total: 98,
};

/**
 * Filter event data by categories
 * @param categories array of category identifiers to filter by
 * @returns filtered chart data
 */
export function filterEventDataByCategories(categories: string[]): ChartData[] {
  // In a real implementation, this would filter the data based on categories
  // For mockup purposes, we'll just return a subset of the data
  return DAILY_EVENT_DATA.map((day) => {
    const multiplier = categories.length > 0 ? categories.length / 7 : 1;

    return {
      name: day.name,
      onaylanan: Math.floor(day.onaylanan * multiplier),
      bekleyen: Math.floor(day.bekleyen * multiplier),
      reddedilen: Math.floor(day.reddedilen * multiplier),
      tamamlanan: Math.floor(day.tamamlanan * multiplier),
    };
  });
}
