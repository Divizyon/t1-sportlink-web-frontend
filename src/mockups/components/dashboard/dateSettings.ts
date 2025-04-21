/**
 * Dashboard Date Settings
 *
 * This file contains date-related settings and constants used in dashboard components.
 * These settings were previously in the constants folder and have been migrated as part
 * of the constants to mockups migration.
 */

// Days of Week - used in dashboard charts
export const DAYS_OF_WEEK = ["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"];

// Months - used in dashboard charts and date formatting
export const MONTHS = [
  "Ocak",
  "Şubat",
  "Mart",
  "Nisan",
  "Mayıs",
  "Haziran",
  "Temmuz",
  "Ağustos",
  "Eylül",
  "Ekim",
  "Kasım",
  "Aralık",
];

// Date format options for dashboard displays
export const DATE_DISPLAY_FORMATS = {
  short: "dd MMM",
  medium: "dd MMM yyyy",
  full: "dd MMMM yyyy",
  withTime: "dd MMM yyyy HH:mm",
  withWeekday: "EEEE, dd MMM",
};

// Date ranges for dashboard filtering
export const DATE_RANGES = {
  today: "Bugün",
  yesterday: "Dün",
  thisWeek: "Bu Hafta",
  lastWeek: "Geçen Hafta",
  thisMonth: "Bu Ay",
  lastMonth: "Geçen Ay",
  thisYear: "Bu Yıl",
  custom: "Özel Aralık",
};

// Calendar grid view settings
export const CALENDAR_SETTINGS = {
  startOfWeek: 1, // Monday
  daysInWeek: 7,
  defaultView: "month",
  minTimeSlot: 30, // minutes
};
