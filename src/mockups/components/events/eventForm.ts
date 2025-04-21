/**
 * Event Form Mockup Data
 *
 * This file contains mockup data specifically for event creation and editing forms.
 * It provides default values, form options, and validation helper functions.
 */

import { EventCategory, EventStatus } from "../../schemas/eventSchema";

// Default event form values
export const DEFAULT_EVENT_FORM = {
  title: "",
  description: "",
  startDate: new Date(Date.now() + 86400000).toISOString().split("T")[0], // Tomorrow
  endDate: new Date(Date.now() + 172800000).toISOString().split("T")[0], // Day after tomorrow
  time: "18:00",
  location: {
    name: "",
    address: "",
    city: "",
    coordinates: {
      latitude: 41.0082,
      longitude: 28.9784,
    },
  },
  category: "sport" as string,
  maxParticipants: 20,
  status: "pending" as string,
  image: "",
  visibility: "public" as "public" | "private" | "unlisted",
  registrationRequired: true,
  registrationDeadline: new Date(Date.now() + 78400000)
    .toISOString()
    .split("T")[0], // Day before event
  tags: [] as string[],
};

// Event category options for form select
export const CATEGORY_OPTIONS = [
  { value: "tournament", label: "Tournament" },
  { value: "training", label: "Training" },
  { value: "meeting", label: "Meeting" },
  { value: "sport", label: "Sport" },
  { value: "social", label: "Social" },
  { value: "workshop", label: "Workshop" },
  { value: "competition", label: "Competition" },
  { value: "other", label: "Other" },
];

// Event status options for form select (admin only)
export const STATUS_OPTIONS = [
  { value: "pending", label: "Pending" },
  { value: "approved", label: "Approved" },
  { value: "rejected", label: "Rejected" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
  { value: "ongoing", label: "Ongoing" },
];

// Event visibility options
export const VISIBILITY_OPTIONS = [
  { value: "public", label: "Public - Anyone can see this event" },
  {
    value: "private",
    label: "Private - Only invited people can see this event",
  },
  {
    value: "unlisted",
    label: "Unlisted - Only people with the link can see this event",
  },
];

// Popular event tags for suggestions
export const POPULAR_TAGS = [
  "sports",
  "fitness",
  "competition",
  "team",
  "running",
  "outdoor",
  "indoor",
  "free",
  "beginners",
  "advanced",
  "family",
  "youth",
  "seniors",
  "charity",
];

// Common locations for autocomplete
export const COMMON_LOCATIONS = [
  {
    name: "City Park",
    address: "1234 Park Avenue",
    city: "Istanbul",
    coordinates: {
      latitude: 41.0082,
      longitude: 28.9784,
    },
  },
  {
    name: "Sports Complex",
    address: "567 Athletic Drive",
    city: "Istanbul",
    coordinates: {
      latitude: 41.0359,
      longitude: 28.9877,
    },
  },
  {
    name: "Community Center",
    address: "456 Main Street",
    city: "Istanbul",
    coordinates: {
      latitude: 41.0451,
      longitude: 28.9863,
    },
  },
];

// Rejection reasons for event rejection
export const REJECTION_REASONS = [
  "Uygunsuz içerik",
  "Yetersiz detay",
  "Tarihi geçmiş",
  "Konum uygun değil",
  "Kapasite sorunu",
  "Güvenlik riski",
  "Diğer",
];

// Turkish category labels for display
export const CATEGORY_LABELS = [
  "Futbol",
  "Basketbol",
  "Voleybol",
  "Tenis",
  "Yüzme",
  "Koşu",
  "Diğer",
];

// Helper function to validate event dates
export const validateEventDates = (
  startDate: string,
  endDate: string
): boolean => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  return start < end;
};
