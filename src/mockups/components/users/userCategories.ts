/**
 * User Categories Mockup Data
 *
 * This file provides mock category data for user-related components like UserTable.
 * It contains user counts per activity category with growth metrics.
 */

import { USER_SCHEMA } from "../../schemas/userSchema";
import { COLORS } from "../dashboard/colorSettings";
import { CategoryCount } from "@/types/dashboard";

// Helper function to generate a realistic growth percentage
const generateGrowthPercentage = (seed: number): string => {
  // Range between -10% and +25%
  const growth =
    seed % 5 === 0
      ? -(Math.floor(Math.random() * 10) + 1)
      : Math.floor(Math.random() * 25) + 1;
  return growth > 0 ? `+${growth}%` : `${growth}%`;
};

// Sample sport/activity categories with user counts
export const USER_CATEGORIES: CategoryCount[] = [
  { name: "Futbol", count: 156, change: "+12%" },
  { name: "Basketbol", count: 98, change: "+5%" },
  { name: "Yüzme", count: 65, change: "+22%" },
  { name: "Tenis", count: 54, change: "-3%" },
  { name: "Koşu", count: 42, change: "+9%" },
  { name: "Yoga", count: 36, change: "+18%" },
  { name: "Fitness", count: 28, change: "+7%" },
];

// Get user categories with real counts from the user schema interests
export const getUserCategoriesFromSchema = (): CategoryCount[] => {
  // Count users by interest category
  const categoryCounts: Record<string, number> = {};

  // Calculate count of users for each interest
  USER_SCHEMA.users.forEach((user) => {
    if (user.profile.interests) {
      user.profile.interests.forEach((interest) => {
        categoryCounts[interest] = (categoryCounts[interest] || 0) + 1;
      });
    }
  });

  // Convert to CategoryCount array with generated growth
  return Object.entries(categoryCounts)
    .map(([name, count], index) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1), // Capitalize
      count,
      change: generateGrowthPercentage(count),
    }))
    .sort((a, b) => b.count - a.count) // Sort by count descending
    .slice(0, 7); // Limit to 7 categories
};

// Get growth badge style based on change percentage
export const getCategoryGrowthStyle = (change: string): React.CSSProperties => {
  // Extract numeric value from change string
  const numericChange = parseInt(change);

  if (numericChange > 15) {
    return { backgroundColor: COLORS.chart[0], color: "white" }; // Strong positive (green)
  } else if (numericChange > 0) {
    return { backgroundColor: "#dcfce7", color: COLORS.chart[0] }; // Positive (light green)
  } else if (numericChange > -10) {
    return { backgroundColor: "#fee2e2", color: COLORS.chart[2] }; // Slight negative (light red)
  } else {
    return { backgroundColor: COLORS.chart[2], color: "white" }; // Strong negative (red)
  }
};
