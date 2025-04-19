import { useState, useEffect, useMemo } from "react";
import { Event, ChartData, CategoryData, CategoryCount } from "@/types";
import {
  MONTHLY_EVENT_DATA,
  generateDailyChartData,
  generateCategoryData,
  CATEGORY_DATA,
  PLATFORM_GROWTH,
} from "@/mocks/analytics";
import {
  calculateApprovalRate,
  calculateCompletionRate,
  calculateParticipationRate,
  calculateEventStats,
  generateCategoryDistribution,
  calculateEventGrowth,
  prepareStackedBarChartData,
} from "@/lib/analyticsUtils";
import { COLORS } from "@/constants/dashboard";

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
      const eventDate = new Date(event.date);

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
          setCategoryData(CATEGORY_DATA);
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
