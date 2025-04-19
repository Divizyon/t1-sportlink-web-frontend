/**
 * Event Utility Functions
 * Specialized utilities for working with event data
 */

import { Event, EventStatus } from "@/types/dashboard";
import {
  EVENT_STATUS_LABELS,
  EVENT_STATUS,
  COLORS,
  DATE_FORMATS,
} from "@/constants";
import { format, isSameDay, isBefore, isAfter, parseISO } from "date-fns";
import { tr } from "date-fns/locale";

/**
 * Formats an event date according to the specified format
 */
export function formatEventDate(
  date: Date | string,
  formatStr: string = DATE_FORMATS.DEFAULT
): string {
  const dateObj = typeof date === "string" ? parseISO(date) : date;
  return format(dateObj, formatStr, { locale: tr });
}

/**
 * Formats an event time
 */
export function formatEventTime(time: string): string {
  return time;
}

/**
 * Checks if an event is happening today
 */
export function isEventToday(eventDate: Date | string): boolean {
  const date = typeof eventDate === "string" ? parseISO(eventDate) : eventDate;
  return isSameDay(date, new Date());
}

/**
 * Checks if an event date is in the past
 */
export function isEventPast(eventDate: Date | string): boolean {
  const date = typeof eventDate === "string" ? parseISO(eventDate) : eventDate;
  return isBefore(date, new Date()) && !isEventToday(date);
}

/**
 * Checks if an event date is in the future
 */
export function isEventFuture(eventDate: Date | string): boolean {
  const date = typeof eventDate === "string" ? parseISO(eventDate) : eventDate;
  return isAfter(date, new Date()) && !isEventToday(date);
}

/**
 * Gets the display label for an event status
 */
export function getEventStatusLabel(status: EventStatus): string {
  return EVENT_STATUS_LABELS[status] || status;
}

/**
 * Gets the CSS color for an event status
 */
export function getEventStatusColor(status: EventStatus): string {
  return COLORS.status[status] || COLORS.status.pending;
}

/**
 * Creates a badge style object for an event status
 */
export function getEventStatusStyle(
  status: EventStatus
): Record<string, string> {
  const color = getEventStatusColor(status);
  return {
    backgroundColor: `${color}20`, // 20% opacity
    color: color,
    borderColor: color,
  };
}

/**
 * Calculates the fill rate percentage for an event
 */
export function calculateEventFillRate(event: Event): number {
  if (
    typeof event.participants !== "number" ||
    typeof event.maxParticipants !== "number" ||
    event.maxParticipants <= 0
  ) {
    return 0;
  }

  return Math.round((event.participants / event.maxParticipants) * 100);
}

/**
 * Sorts events by date (newest first)
 */
export function sortEventsByDate(
  events: Event[],
  ascending: boolean = false
): Event[] {
  return [...events].sort((a, b) => {
    const dateA = new Date(a.date).getTime();
    const dateB = new Date(b.date).getTime();
    return ascending ? dateA - dateB : dateB - dateA;
  });
}

/**
 * Sorts events by status priority
 * Default order: pending, approved, completed, rejected
 */
export function sortEventsByStatus(events: Event[]): Event[] {
  const statusPriority: Record<EventStatus, number> = {
    pending: 1,
    approved: 2,
    completed: 3,
    rejected: 4,
  };

  return [...events].sort((a, b) => {
    return statusPriority[a.status] - statusPriority[b.status];
  });
}

/**
 * Groups events by day
 */
export function groupEventsByDay(events: Event[]): Record<string, Event[]> {
  return events.reduce((acc, event) => {
    const dateKey = formatEventDate(event.date, DATE_FORMATS.ISO);

    if (!acc[dateKey]) {
      acc[dateKey] = [];
    }

    acc[dateKey].push(event);
    return acc;
  }, {} as Record<string, Event[]>);
}

/**
 * Combines category and status filters for events
 */
export function filterEvents(
  events: Event[],
  categories: string[] = [],
  statuses: EventStatus[] = []
): Event[] {
  return events.filter((event) => {
    const matchesCategory =
      categories.length === 0 || categories.includes(event.category);
    const matchesStatus =
      statuses.length === 0 || statuses.includes(event.status);
    return matchesCategory && matchesStatus;
  });
}

/**
 * Gets text representation of an event's location
 */
export function formatEventLocation(location: string): string {
  return location;
}
