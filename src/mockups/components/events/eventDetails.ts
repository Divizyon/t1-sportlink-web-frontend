/**
 * Event Details Mockup Data
 *
 * This file contains mockup data specifically for event detail components.
 * It provides detailed information about individual events.
 */

import { EVENT_SCHEMA } from "../../schemas/eventSchema";
import { USER_SCHEMA } from "../../schemas/userSchema";

// Interface for detailed event data
export interface EventDetailsMock {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  location: {
    name: string;
    address: string;
    city: string;
    coordinates?: {
      latitude: number;
      longitude: number;
    };
  };
  category: string;
  status: string;
  maxParticipants: number;
  participants: number;
  organizer: {
    id: string;
    name: string;
    email: string;
    role: string;
    avatar: string;
  };
  attendees: Array<{
    id: string;
    name: string;
    email: string;
    avatar: string;
    status: string;
    registrationDate: string;
  }>;
  resources: Array<{
    id: string;
    name: string;
    type: string;
    url: string;
  }>;
}

// Get a specific event with all its details
export const getEventDetails = (
  eventId: string
): EventDetailsMock | undefined => {
  const event = EVENT_SCHEMA.events.find((e) => e.id === eventId);

  if (!event) return undefined;

  // Find organizer details
  const organizer =
    USER_SCHEMA.users.find((u) => u.id === event.organizer.id) ||
    USER_SCHEMA.users[0];

  // Find participants for this event (using first 10 users as mock participants)
  const attendees = USER_SCHEMA.users.slice(0, 10).map((user) => ({
    id: user.id,
    name: user.name,
    email: user.email,
    avatar: user.avatar || "/avatars/default.png",
    status: Math.random() > 0.3 ? "confirmed" : "pending",
    registrationDate: new Date(
      Date.now() - Math.floor(Math.random() * 7) * 86400000
    ).toISOString(),
  }));

  // Create sample resources
  const resources = [
    {
      id: "res-1",
      name: "Event Rules",
      type: "pdf",
      url: "/resources/event-rules.pdf",
    },
    {
      id: "res-2",
      name: "Location Map",
      type: "image",
      url: "/resources/location-map.jpg",
    },
    {
      id: "res-3",
      name: "Schedule",
      type: "doc",
      url: "/resources/event-schedule.doc",
    },
  ];

  // Construct the detailed event object
  return {
    id: event.id,
    title: event.title,
    description: event.description,
    startDate: event.startDate,
    endDate: event.endDate,
    location: event.location,
    category: event.category,
    status: event.status,
    maxParticipants: event.maxParticipants,
    participants: event.participants,
    organizer: {
      id: organizer.id,
      name: organizer.name,
      email: organizer.email,
      role: organizer.role,
      avatar: organizer.avatar || "/avatars/default.png",
    },
    attendees,
    resources,
  };
};

// Get a sample event detail
export const SAMPLE_EVENT_DETAILS: EventDetailsMock = getEventDetails(
  EVENT_SCHEMA.events[0].id
) as EventDetailsMock;
