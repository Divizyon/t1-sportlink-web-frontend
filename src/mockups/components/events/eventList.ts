/**
 * Event List Mockup Data
 *
 * This file contains mockup data specifically for event list components.
 * It provides filtered and paginated event lists with various sorting options.
 */

import {
  EVENT_SCHEMA,
  EventCategory,
  EventStatus,
} from "../../schemas/eventSchema";

// Interface for list event item
export interface EventListItemMock {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  category: string;
  status: string;
  participants: number;
  maxParticipants: number;
  organizer: {
    id: string;
    name: string;
    avatar?: string;
  };
  image?: string;
  location: {
    name: string;
    city: string;
  };
}

// Filter events by category
export const filterEventsByCategory = (
  category: EventCategory | "all"
): EventListItemMock[] => {
  if (category === "all") {
    return EVENT_SCHEMA.events.map(mapToEventListItem);
  }

  return EVENT_SCHEMA.events
    .filter((event) => event.category === category)
    .map(mapToEventListItem);
};

// Filter events by status
export const filterEventsByStatus = (
  status: EventStatus | "all"
): EventListItemMock[] => {
  if (status === "all") {
    return EVENT_SCHEMA.events.map(mapToEventListItem);
  }

  return EVENT_SCHEMA.events
    .filter((event) => event.status === status)
    .map(mapToEventListItem);
};

// Filter upcoming events (events with start date in the future)
export const getUpcomingEvents = (): EventListItemMock[] => {
  const now = new Date().toISOString();

  return EVENT_SCHEMA.events
    .filter((event) => event.startDate > now)
    .sort(
      (a, b) =>
        new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
    )
    .map(mapToEventListItem);
};

// Filter past events (events with end date in the past)
export const getPastEvents = (): EventListItemMock[] => {
  const now = new Date().toISOString();

  return EVENT_SCHEMA.events
    .filter((event) => event.endDate < now)
    .sort(
      (a, b) => new Date(b.endDate).getTime() - new Date(a.endDate).getTime()
    )
    .map(mapToEventListItem);
};

// Helper function to map EVENT_SCHEMA event to EventListItemMock
const mapToEventListItem = (
  event: (typeof EVENT_SCHEMA.events)[0]
): EventListItemMock => {
  return {
    id: event.id,
    title: event.title,
    description: event.description,
    startDate: event.startDate,
    endDate: event.endDate,
    category: event.category,
    status: event.status,
    participants: event.participants,
    maxParticipants: event.maxParticipants,
    organizer: {
      id: event.organizer.id,
      name: event.organizer.name,
      avatar: event.organizer.avatar,
    },
    image: event.image,
    location: {
      name: event.location.name,
      city: event.location.city,
    },
  };
};

// Export commonly used event lists
export const UPCOMING_EVENTS = getUpcomingEvents().slice(0, 5);
export const PAST_EVENTS = getPastEvents().slice(0, 5);

// Event categories with count
export const EVENT_CATEGORIES = [
  "tournament",
  "training",
  "meeting",
  "sport",
  "social",
  "workshop",
  "competition",
  "other",
] as const;

export const EVENT_CATEGORIES_WITH_COUNT = EVENT_CATEGORIES.map((category) => ({
  category,
  count: filterEventsByCategory(category as EventCategory).length,
}));
