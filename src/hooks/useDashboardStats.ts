import { useState, useEffect } from 'react';
import {
  getMonthlyStats,
  getCategoryStats,
  getWeeklyStats,
  MonthlyStat,
  CategoryStat,
  WeeklyDailyStat,
} from '../services/statsService';

interface UseDashboardStatsReturn {
  monthlyData: MonthlyStat[] | null;
  categoryData: CategoryStat[] | null;
  weeklyData: WeeklyDailyStat[] | null;
  isLoading: boolean;
  error: string | null;
}

/**
 * Custom hook to fetch dashboard statistics data (weekly, monthly and categories).
 */
export const useDashboardStats = (): UseDashboardStatsReturn => {
  const [monthlyData, setMonthlyData] = useState<MonthlyStat[] | null>(null);
  const [categoryData, setCategoryData] = useState<CategoryStat[] | null>(null);
  const [weeklyData, setWeeklyData] = useState<WeeklyDailyStat[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // Fetch data concurrently
        const [weeklyResponse, monthlyResponse, categoryResponse] = await Promise.all([
          getWeeklyStats(),
          getMonthlyStats(),
          getCategoryStats(),
        ]);
        
        // Assuming the service functions return the data array directly
        // If the actual API response wraps data (e.g., { data: [...] }), 
        // adjustments might be needed in the service functions.
        setWeeklyData(weeklyResponse);
        setMonthlyData(monthlyResponse);
        setCategoryData(categoryResponse);

      } catch (err: any) {
        console.error("Failed to fetch dashboard stats:", err);
        setError(err.message || 'İstatistikler yüklenirken bir hata oluştu.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []); // Empty dependency array means this effect runs once on mount

  return { weeklyData, monthlyData, categoryData, isLoading, error };
}; 