/**
 * UI Utility Functions
 * Helpers for UI formatting and styling in dashboard components
 */

import { COLORS, EVENT_STATUS_COLORS } from "@/mockups";

/**
 * Generate badge styles based on growth value
 */
export function getGrowthBadgeStyle(
  growthValue: number | string
): Record<string, string> {
  const numericValue =
    typeof growthValue === "string"
      ? parseFloat(growthValue.replace("%", ""))
      : growthValue;

  const isPositive = numericValue > 0;

  return {
    backgroundColor: isPositive ? "#dcfce7" : "#fee2e2",
    color: isPositive ? "#166534" : "#991b1b",
    borderColor: isPositive ? "#bbf7d0" : "#fecaca",
  };
}

/**
 * Format number with thousands separator
 */
export function formatNumber(value: number): string {
  return new Intl.NumberFormat("tr-TR").format(value);
}

/**
 * Calculate gradient color between two values
 */
export function calculateGradientColor(
  value: number,
  min: number,
  max: number,
  lowColor: string = "#ef4444",
  highColor: string = "#22c55e"
): string {
  // Normalize value between 0 and 1
  const normalizedValue = Math.max(0, Math.min(1, (value - min) / (max - min)));

  // Simple linear interpolation between the two colors
  // In a real app, you'd use a more sophisticated color interpolation
  return normalizedValue <= 0.5 ? lowColor : highColor;
}

/**
 * Generate style for a percentage fill bar
 */
export function getPercentageBarStyle(
  percentage: number,
  highThreshold: number = 75,
  mediumThreshold: number = 40
): Record<string, string> {
  let color = EVENT_STATUS_COLORS.rejected; // Default to red for low

  if (percentage >= highThreshold) {
    color = EVENT_STATUS_COLORS.approved; // Green for high
  } else if (percentage >= mediumThreshold) {
    color = EVENT_STATUS_COLORS.pending; // Yellow/orange for medium
  }

  return {
    width: `${Math.min(100, percentage)}%`,
    backgroundColor: color,
  };
}

/**
 * Generate a skeleton loader array
 */
export function generateSkeletonArray(count: number): number[] {
  return Array.from({ length: count }, (_, index) => index);
}

/**
 * Format currency value
 */
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency: "TRY",
    minimumFractionDigits: 0,
  }).format(value);
}

/**
 * Generate random colors for chart visualization
 * (Useful when fixed color palette is not available)
 */
export function generateRandomColors(count: number): string[] {
  const colors: string[] = [];

  for (let i = 0; i < count; i++) {
    // Generate HSL colors for better distribution
    const hue = Math.floor((i * 137.5) % 360); // Golden angle approximation
    colors.push(`hsl(${hue}, 70%, 50%)`);
  }

  return colors;
}

/**
 * Truncate text with ellipsis
 */
export function truncateText(text: string, maxLength: number = 50): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + "...";
}

/**
 * Generate contrast text color (black/white) based on background color
 */
export function getContrastTextColor(backgroundColor: string): string {
  // For simplicity, just check if the color is in hex format
  if (backgroundColor.startsWith("#")) {
    // Convert hex to RGB
    const hex = backgroundColor.slice(1);
    const r = parseInt(hex.slice(0, 2), 16);
    const g = parseInt(hex.slice(2, 4), 16);
    const b = parseInt(hex.slice(4, 6), 16);

    // Calculate luminance
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

    // Return white for dark backgrounds, black for light backgrounds
    return luminance > 0.5 ? "#000000" : "#ffffff";
  }

  // Default to black text if color format is not recognized
  return "#000000";
}

/**
 * Get appropriate avatar size class based on component size
 */
export function getAvatarSizeClass(size: "sm" | "md" | "lg" = "md"): string {
  switch (size) {
    case "sm":
      return "h-8 w-8";
    case "lg":
      return "h-12 w-12";
    case "md":
    default:
      return "h-10 w-10";
  }
}

/**
 * Apply opacity to a color (assumes hex color)
 */
export function applyColorOpacity(
  color: string,
  opacity: number = 0.2
): string {
  // If it's already in rgba format or not a valid hex, return as is
  if (!color.startsWith("#")) return color;

  const hex = color.slice(1);
  const r = parseInt(hex.slice(0, 2), 16);
  const g = parseInt(hex.slice(2, 4), 16);
  const b = parseInt(hex.slice(4, 6), 16);

  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
}
