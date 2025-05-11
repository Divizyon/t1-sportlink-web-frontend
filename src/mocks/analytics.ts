import { ChartData, CategoryData } from "@/types/dashboard";
import { DAYS_OF_WEEK, EVENT_CATEGORIES, COLORS } from "@/constants";

/**
 * Mock analytics data used across the dashboard components
 */

// Monthly events data (for MonthlyEventsChart component)
export const MONTHLY_EVENT_DATA: ChartData[] = [
  {
    name: "Ocak",
    onaylanan: 30,
    bekleyen: 5,
    reddedilen: 2,
    tamamlanan: 28,
  },
  {
    name: "Şubat",
    onaylanan: 25,
    bekleyen: 8,
    reddedilen: 3,
    tamamlanan: 22,
  },
  {
    name: "Mart",
    onaylanan: 35,
    bekleyen: 10,
    reddedilen: 4,
    tamamlanan: 31,
  },
  {
    name: "Nisan",
    onaylanan: 40,
    bekleyen: 12,
    reddedilen: 5,
    tamamlanan: 35,
  },
  {
    name: "Mayıs",
    onaylanan: 45,
    bekleyen: 15,
    reddedilen: 3,
    tamamlanan: 42,
  },
  {
    name: "Haziran",
    onaylanan: 50,
    bekleyen: 18,
    reddedilen: 4,
    tamamlanan: 46,
  },
];

// Generate daily event participation data
export const generateDailyChartData = (
  categories: string[] = []
): ChartData[] => {
  return DAYS_OF_WEEK.map((day) => {
    const baseData: ChartData = {
      name: day,
      onaylanan: Math.floor(Math.random() * 20) + 10,
      bekleyen: Math.floor(Math.random() * 10) + 5,
      reddedilen: Math.floor(Math.random() * 5) + 1,
      tamamlanan: Math.floor(Math.random() * 15) + 5,
    };

    // Filter by categories if provided
    if (categories && categories.length > 0) {
      const filteredData: ChartData = {
        name: day,
        onaylanan: 0,
        bekleyen: 0,
        reddedilen: 0,
        tamamlanan: 0,
      };

      // Weighted data for each category
      categories.forEach((category) => {
        const weight =
          (EVENT_CATEGORIES.indexOf(category) + 1) / EVENT_CATEGORIES.length;
        filteredData.onaylanan += Math.floor(baseData.onaylanan * weight);
        filteredData.bekleyen += Math.floor(baseData.bekleyen * weight);
        filteredData.reddedilen += Math.floor(baseData.reddedilen * weight);
        filteredData.tamamlanan += Math.floor(baseData.tamamlanan * weight);
      });

      return filteredData;
    }

    return baseData;
  });
};

// Generate category distribution data
export const generateCategoryData = (limit: number = 8): CategoryData[] => {
  return EVENT_CATEGORIES.slice(0, limit).map((category, index) => ({
    name: category,
    value: Math.floor(Math.random() * 50) + 20,
    color: COLORS.chart[index % COLORS.chart.length],
  }));
};

// Platform growth statistics
export const PLATFORM_GROWTH = {
  users: {
    total: 534,
    growth: 12.4,
  },
  events: {
    total: 1245,
    growth: 8.7,
  },
  participation: {
    total: 7823,
    growth: 15.2,
  },
  retention: {
    percentage: 76.3,
    change: 3.4,
  },
};

// Category distribution for pie charts
export const CATEGORY_DATA: CategoryData[] = [
  {
    name: "Futbol",
    value: 35,
    color: "#3b82f6",
  },
  {
    name: "Basketbol",
    value: 25,
    color: "#10b981",
  },
  {
    name: "Yüzme",
    value: 20,
    color: "#f59e0b",
  },
  {
    name: "Tenis",
    value: 15,
    color: "#ef4444",
  },
  {
    name: "Diğer",
    value: 5,
    color: "#8b5cf6",
  },
];
