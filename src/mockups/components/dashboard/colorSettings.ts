/**
 * Dashboard Color Settings
 *
 * This file contains color-related settings and constants used in dashboard components.
 * These were previously in the constants folder and have been migrated as part
 * of the constants to mockups migration.
 */

// Color Constants for charts and status indicators
export const COLORS = {
  // Base colors for charts
  chart: [
    "#22c55e", // green
    "#eab308", // yellow
    "#ef4444", // red
    "#3b82f6", // blue
    "#8b5cf6", // purple
    "#ec4899", // pink
    "#10b981", // emerald
    "#f97316", // orange
    "#6366f1", // indigo
  ],
  // Status colors
  status: {
    approved: "#22c55e",
    pending: "#eab308",
    rejected: "#ef4444",
    completed: "#3b82f6",
    reviewing: "#8b5cf6",
  },
  // Priority colors
  priority: {
    high: "#ef4444",
    medium: "#eab308",
    low: "#22c55e",
  },
};
