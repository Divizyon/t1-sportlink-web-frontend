import { useState, useEffect, useMemo } from "react";
import { Event, ChartData, CategoryData, CategoryCount } from "@/types";
import {
  MONTHLY_EVENT_DATA,
  CATEGORY_DISTRIBUTION,
  WEEKLY_ACTIVITY_DATA,
  USER_REGISTRATION_DATA,
  EVENT_STATUS_DISTRIBUTION,
  USER_ROLE_DISTRIBUTION,
} from "@/mockups/components/dashboard/analyticsCharts";
import {
  calculateApprovalRate,
  calculateCompletionRate,
  calculateParticipationRate,
  calculateEventStats,
  generateCategoryDistribution,
  calculateEventGrowth,
  prepareStackedBarChartData,
} from "@/lib/analyticsUtils";
import { COLORS } from "@/mockups";

// Platform growth statistics - would come from backend in real app
const PLATFORM_GROWTH = {
  users: {
    count: 2450,
    growth: 12.5,
  },
  events: {
    count: 186,
    growth: 8.2,
  },
  participation: {
    count: 3240,
    growth: 15.7,
  },
};

// Function to generate daily chart data based on categories
const generateDailyChartData = (categories?: string[]) => {
  // Generate last 7 days
  const days = [
    "Pazartesi",
    "Salı",
    "Çarşamba",
    "Perşembe",
    "Cuma",
    "Cumartesi",
    "Pazar",
  ];

  return days.map((day, index) => {
    // Use data from WEEKLY_ACTIVITY_DATA
    const weeklyData = WEEKLY_ACTIVITY_DATA[index];

    return {
      name: day,
      onaylanan: Math.floor(weeklyData.events * 0.7),
      bekleyen: Math.floor(weeklyData.events * 0.2),
      reddedilen: Math.floor(weeklyData.events * 0.1),
      tamamlanan: Math.floor(weeklyData.events * 0.6),
    };
  });
};

interface AnalyticsFilters {
  startDate?: Date;
  endDate?: Date;
  categories?: string[];
}

export function useAnalytics(
  events: Event[] = [],
  initialFilters: AnalyticsFilters = {}
) {
  const [filters, setFilters] = useState<AnalyticsFilters>(initialFilters);
  const [loading, setLoading] = useState<boolean>(false);
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [categoryData, setCategoryData] = useState<CategoryData[]>([]);
  const [monthlyData, setMonthlyData] = useState<ChartData[]>([]);

  // Apply date filters to events if needed
  const filteredEvents = useMemo(() => {
    if (!filters.startDate && !filters.endDate) return events;

    return events.filter((event) => {
      // Use event.date if available, otherwise fall back to startDate
      const eventDate = event.date ? event.date : new Date(event.startDate);

      if (filters.startDate && eventDate < filters.startDate) return false;
      if (filters.endDate && eventDate > filters.endDate) return false;

      return true;
    });
  }, [events, filters.startDate, filters.endDate]);

  // Calculate key metrics
  const metrics = useMemo(() => {
    // Using the utility function that calculates all stats at once
    return calculateEventStats(filteredEvents);
  }, [filteredEvents]);

  // Calculate growth rates compared to previous period
  const growthMetrics = useMemo(() => {
    // In a real app, this would compare with the previous time period
    // Here, we're just using a simple approximation
    const previousEvents = events.slice(0, Math.floor(events.length * 0.8));
    const eventGrowth = calculateEventGrowth(events, previousEvents);

    return {
      eventGrowth,
      userGrowth: PLATFORM_GROWTH.users.growth,
      participationGrowth: PLATFORM_GROWTH.participation.growth,
    };
  }, [events]);

  // Load chart data
  useEffect(() => {
    const loadChartData = async () => {
      setLoading(true);
      try {
        // In production, this would be an API call
        // const response = await fetch('/api/analytics/chart-data');
        // const data = await response.json();

        // Using mock data for now
        setMonthlyData(MONTHLY_EVENT_DATA);

        // Generate daily chart data based on selected categories
        const dailyData = generateDailyChartData(filters.categories);
        setChartData(dailyData);

        // Use either real data or mock data for category distribution
        if (filteredEvents.length > 0) {
          const generatedCategoryData =
            generateCategoryDistribution(filteredEvents);
          setCategoryData(generatedCategoryData);
        } else {
          // Fall back to mock data
          setCategoryData(CATEGORY_DISTRIBUTION);
        }

        setLoading(false);
      } catch (error) {
        console.error("Error loading analytics data:", error);
        setLoading(false);
      }
    };

    loadChartData();
  }, [filteredEvents, filters.categories]);

  // Update date range filter
  const setDateRange = (startDate?: Date, endDate?: Date) => {
    setFilters((prev) => ({
      ...prev,
      startDate,
      endDate,
    }));
  };

  // Set categories filter
  const setCategoriesFilter = (categories: string[]) => {
    setFilters((prev) => ({
      ...prev,
      categories,
    }));
  };

  // Reset filters
  const resetFilters = () => {
    setFilters({});
  };

  return {
    metrics,
    growthMetrics,
    chartData,
    categoryData,
    monthlyData,
    loading,
    filters,
    setDateRange,
    setCategoriesFilter,
    resetFilters,
    platformGrowth: PLATFORM_GROWTH,
  };
}
