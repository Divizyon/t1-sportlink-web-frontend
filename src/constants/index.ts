/**
 * Constants Index
 * Central export point for all application constants
 */

// Re-export all dashboard constants
export * from "./dashboard";

// Global Constants

// API Base URLs
export const API = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api",
  TIMEOUT: 30000,
  RETRY_COUNT: 3,
};

// Authentication Constants
export const AUTH = {
  TOKEN_KEY: "sportlink_token",
  REFRESH_TOKEN_KEY: "sportlink_refresh_token",
  EXPIRY_KEY: "sportlink_token_expiry",
  USER_KEY: "sportlink_user",
};

// Date Formats
export const DATE_FORMATS = {
  DEFAULT: "dd MMM yyyy",
  WITH_TIME: "dd MMM yyyy HH:mm",
  TIME_ONLY: "HH:mm",
  MONTH_YEAR: "MMM yyyy",
  DAY_MONTH: "dd MMM",
  ISO: "yyyy-MM-dd",
};

// Form Validation Constants
export const VALIDATION = {
  MAX_NAME_LENGTH: 100,
  MIN_PASSWORD_LENGTH: 8,
  MAX_DESCRIPTION_LENGTH: 1000,
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB in bytes
  ALLOWED_FILE_TYPES: [".jpg", ".jpeg", ".png", ".pdf"],
};

// Route Paths
export const ROUTES = {
  HOME: "/",
  DASHBOARD: "/dashboard",
  LOGIN: "/auth/login",
  REGISTER: "/auth/register",
  EVENTS: "/events",
  EVENT_DETAIL: (id: string) => `/events/${id}`,
  PROFILE: "/profile",
  SETTINGS: "/settings",
};

// Theme Constants
export const THEME = {
  STORAGE_KEY: "sportlink_theme",
  DEFAULT: "system",
};

// Breakpoints (in pixels)
export const BREAKPOINTS = {
  xs: 480,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  "2xl": 1536,
};
