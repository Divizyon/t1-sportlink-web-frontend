import api from './api';
import { DAYS_OF_WEEK } from '@/constants';

// Type definitions based on Swagger examples

export interface MonthlyStat {
  month: string;
  onaylanan: number;
  bekleyen: number;
  reddedilen: number;
  tamamlanan: number;
}

export interface CategoryStat {
  name: string;
  count: number;
}

export interface WeeklyDailyStat {
  // Assuming the API returns day names or dates we can map
  day: string; // e.g., "Pzt", "Sal" or "2023-10-26"
  onaylanan: number;
  bekleyen: number;
  reddedilen: number;
  tamamlanan: number;
}

// Interface matching the actual API response for /stats/weekly
interface ApiWeeklyStat {
  date: string;
  pending: number;
  active: number;      // Assuming 'active' corresponds to 'onaylanan'
  completed: number;   // Corresponds to 'tamamlanan'
  rejected: number;    // Corresponds to 'reddedilen'
  // Add any other fields if the API returns more
}

// Interface expected by the EventParticipationChart component
export interface WeeklyChartData {
  name: string; // Day name (Pzt, Sal, etc.)
  onaylanan: number;
  bekleyen: number;
  reddedilen: number;
  tamamlanan: number;
}

/**
 * Fetches monthly event statistics from the API.
 */
export const getMonthlyStats = async (): Promise<MonthlyStat[]> => {
  try {
    // The actual data is likely nested, adjust '.data.data' or similar if needed based on real API responses
    const response = await api.get<{ data: MonthlyStat[] }>('/stats/monthly');
    // Assuming the array is directly in response.data based on Swagger structure
    // If nested like { status: 'success', data: [...] }, use response.data.data
    return response.data; 
  } catch (error) {
    console.error("Error fetching monthly stats:", error);
    // Re-throw the error to be handled by the calling hook/component
    throw error;
  }
};

/**
 * Fetches category distribution statistics from the API.
 */
export const getCategoryStats = async (): Promise<CategoryStat[]> => {
  try {
    const response = await api.get<{ data: CategoryStat[] }>('/stats/categories');
     // Assuming the array is directly in response.data based on Swagger structure
    // If nested like { status: 'success', data: [...] }, use response.data.data
    return response.data;
  } catch (error) {
    console.error("Error fetching category stats:", error);
    throw error;
  }
};

// Helper function to get day name (already defined in EventParticipationChart, move here?)
// For now, redefine locally or assume it exists globally/utils
const getDayName = (apiDate: string): string => {
  try {
    const date = new Date(apiDate);
    const dayIndex = date.getDay(); // Sunday = 0, Monday = 1, ...
    // Adjust index so Monday maps to DAYS_OF_WEEK[0] ('Pzt')
    return DAYS_OF_WEEK[(dayIndex + 6) % 7]; 
  } catch(e) { 
    console.error("Error parsing date:", apiDate, e);
    return apiDate; // Fallback
  }
};

/**
 * Fetches weekly event statistics and maps them to the format 
 * expected by the EventParticipationChart.
 */
export const getWeeklyStats = async (): Promise<WeeklyChartData[]> => {
  try {
    // Fetch data with the API response type
    const response = await api.get<ApiWeeklyStat[]>('/stats/weekly');
    
    // Map the API response to the chart data format
    const mappedData = response.data.map(item => ({
      name: getDayName(item.date),
      onaylanan: item.active || 0, // Map active to onaylanan
      bekleyen: item.pending || 0, // Map pending to bekleyen
      reddedilen: item.rejected || 0, // Map rejected to reddedilen
      tamamlanan: item.completed || 0, // Map completed to tamamlanan
    }));
    
    return mappedData;
  } catch (error) {
    console.error("Error fetching and mapping weekly stats:", error);
    throw error;
  }
}; 