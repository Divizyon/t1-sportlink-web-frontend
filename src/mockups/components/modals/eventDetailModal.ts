/**
 * Event Detail Modal Mockup Data
 *
 * This file contains mockup data specifically for the EventDetailModal component.
 * It provides detailed event information, participant data, and report data.
 */

import { USER_SCHEMA } from "../../schemas/userSchema";
import { EVENT_SCHEMA, EventStatus } from "../../schemas/eventSchema";
import { SAMPLE_EVENT_DETAILS } from "../events/eventDetails";

// Interface for modal event participant
export interface EventDetailParticipant {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  age?: number;
  gender?: string;
  registeredDate?: string;
  eventCount?: number;
  status?: "active" | "suspended" | "blocked";
}

// Interface for event report
export interface EventReport {
  id: string;
  reporterId: string;
  reporterName: string;
  reason: string;
  date: string;
  status: "pending" | "reviewed" | "dismissed";
  details?: string;
}

// Interface for the event in the detail modal
export interface EventDetailMock {
  id: string;
  title: string;
  description: string;
  date: Date;
  time: string;
  location: string;
  organizer: string;
  participants: EventDetailParticipant[];
  status: "pending" | "approved" | "rejected" | "completed";
  maxParticipants: number;
  createdAt: Date;
  category?: string;
  tags?: string[];
  rejectionReason?: string;
  reports?: EventReport[];
}

// Convert sample event details to the event detail modal format
export const getEventDetailMock = (eventId?: string): EventDetailMock => {
  // Get event data from schema or use sample event if not found
  const eventData = eventId
    ? EVENT_SCHEMA.events.find((e) => e.id === eventId)
    : SAMPLE_EVENT_DETAILS;

  if (!eventData) {
    return getDefaultEventDetailMock();
  }

  // Get sample participants for the event
  const participants: EventDetailParticipant[] = USER_SCHEMA.users
    .slice(0, 5)
    .map((user) => ({
      id: user.id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      age: 20 + Math.floor(Math.random() * 30), // Random age between 20-50
      gender: Math.random() > 0.5 ? "Erkek" : "Kadın",
      registeredDate: new Date(
        Date.now() - Math.floor(Math.random() * 30) * 86400000
      ).toISOString(),
      eventCount: Math.floor(Math.random() * 10) + 1,
      status: (Math.random() > 0.2
        ? "active"
        : Math.random() > 0.5
        ? "suspended"
        : "blocked") as "active" | "suspended" | "blocked",
    }));

  // Get sample reports for the event
  const reports: EventReport[] = [
    {
      id: "report-1",
      reporterId: USER_SCHEMA.users[2].id,
      reporterName: USER_SCHEMA.users[2].name,
      reason: "Inappropriate content",
      date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
      status: "pending",
      details:
        "The event description contains inappropriate language that violates community guidelines.",
    },
    {
      id: "report-2",
      reporterId: USER_SCHEMA.users[3].id,
      reporterName: USER_SCHEMA.users[3].name,
      reason: "Misrepresentation",
      date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      status: "reviewed",
      details:
        "Event was advertised as free but there's an entrance fee mentioned in the description.",
    },
    {
      id: "report-3",
      reporterId: USER_SCHEMA.users[4].id,
      reporterName: USER_SCHEMA.users[4].name,
      reason: "Location concerns",
      date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
      status: "dismissed",
      details:
        "The venue is not suitable for the type of event being organized.",
    },
  ];

  // Extract optional event tags
  const eventTags: string[] = [];

  // Try to safely access tags if they exist
  try {
    if ("tags" in eventData && Array.isArray((eventData as any).tags)) {
      eventTags.push(...(eventData as any).tags);
    }
  } catch (e) {
    // Silently handle any errors accessing tags
  }

  return {
    id: eventData.id,
    title: eventData.title,
    description: eventData.description,
    date: new Date(eventData.startDate),
    time: new Date(eventData.startDate).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    }),
    location:
      typeof eventData.location === "string"
        ? eventData.location
        : eventData.location.name,
    organizer:
      typeof eventData.organizer === "string"
        ? eventData.organizer
        : eventData.organizer.name,
    participants: participants,
    status: eventData.status as
      | "pending"
      | "approved"
      | "rejected"
      | "completed",
    maxParticipants: eventData.maxParticipants,
    createdAt: new Date(eventData.startDate), // Using startDate since createdAt might not exist
    category: eventData.category,
    tags: eventTags,
    reports: reports,
  };
};

// Default event detail mock when no event is found
export const getDefaultEventDetailMock = (): EventDetailMock => {
  return {
    id: "default-event",
    title: "Sample Event",
    description:
      "This is a sample event description used when no real event data is available.",
    date: new Date(),
    time: "18:00",
    location: "Sample Location",
    organizer: "Event Organizer",
    participants: [],
    status: "pending",
    maxParticipants: 20,
    createdAt: new Date(),
    category: "other",
    tags: ["sample", "default"],
    reports: [],
  };
};

// Sample event detail mock for direct use in components
export const SAMPLE_EVENT_DETAIL_MOCK: EventDetailMock = getEventDetailMock();

// Rejection reasons for event moderation
export const EVENT_REJECTION_REASONS = [
  "Inappropriate content",
  "Duplicate event",
  "Insufficient details",
  "Venue concerns",
  "Date/time conflict",
  "Violates terms of service",
  "Other",
];
