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
  reports?: Array<{
    id: string;
    reporterId: string;
    reporterName: string;
    reason: string;
    date: string;
    status: "pending" | "reviewed" | "dismissed";
    details?: string;
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

  // Create mock reports for this event
  const reports = [
    {
      id: "report-1",
      reporterId: USER_SCHEMA.users[2].id,
      reporterName: USER_SCHEMA.users[2].name,
      reason: "Konum bilgisi yanlış",
      date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toLocaleDateString(
        "tr-TR"
      ),
      status: "pending" as const,
      details:
        "Etkinlik duyurusunda belirtilen konum doğru değil. Adres bulunamıyor.",
    },
    {
      id: "report-2",
      reporterId: USER_SCHEMA.users[3].id,
      reporterName: USER_SCHEMA.users[3].name,
      reason: "Uygunsuz içerik",
      date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toLocaleDateString(
        "tr-TR"
      ),
      status: "reviewed" as const,
      details:
        "Etkinlik açıklamasında yaş sınırı belirtilmemiş ve içerik her yaşa uygun değil.",
    },
    {
      id: "report-3",
      reporterId: USER_SCHEMA.users[4].id,
      reporterName: USER_SCHEMA.users[4].name,
      reason: "Aşırı pahalı ücretlendirme",
      date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toLocaleDateString(
        "tr-TR"
      ),
      status: "dismissed" as const,
      details: "Benzer etkinliklere göre fiyatı çok yüksek ve uygunsuz.",
    },
  ];

  // Create the detailed event object with reports
  const result = {
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
    reports,
  };

  return result;
};

// Get a sample event detail
export const SAMPLE_EVENT_DETAILS: EventDetailsMock = getEventDetails(
  EVENT_SCHEMA.events[0].id
) as EventDetailsMock;
