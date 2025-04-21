/**
 * Event Schema
 *
 * This file defines the complete event data structure for the application.
 * All component-specific mockup data should reference and subset this schema.
 */

// Types for event-related data
export interface EventSchema {
  id: string;
  title: string;
  description: string;
  startDate: string; // ISO date string
  endDate: string; // ISO date string
  time: string; // Format: "HH:MM"
  location: {
    name: string;
    address: string;
    city: string;
    coordinates?: {
      latitude: number;
      longitude: number;
    };
  };
  category: EventCategory;
  participants: number;
  maxParticipants: number;
  status: EventStatus;
  organizer: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
  };
  image?: string;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  tags: string[];
  price?: {
    amount: number;
    currency: string;
  };
  recurrence?: {
    type: "daily" | "weekly" | "monthly";
    interval: number;
    endDate: string; // ISO date string
  };
  visibility: "public" | "private" | "unlisted";
  registrationRequired: boolean;
  registrationDeadline?: string; // ISO date string
}

// Event category types
export type EventCategory =
  | "tournament"
  | "training"
  | "meeting"
  | "sport"
  | "social"
  | "workshop"
  | "competition"
  | "other";

// Event status types
export type EventStatus =
  | "pending"
  | "approved"
  | "rejected"
  | "completed"
  | "cancelled"
  | "ongoing"
  | "upcoming";

// Event status constants (formerly in constants/dashboard.ts)
export const EVENT_STATUS: Record<string, EventStatus> = {
  pending: "pending",
  approved: "approved",
  rejected: "rejected",
  completed: "completed",
  cancelled: "cancelled",
  ongoing: "ongoing",
  upcoming: "upcoming",
};

// Event status labels for UI display (formerly in constants/dashboard.ts)
export const EVENT_STATUS_LABELS: Record<string, string> = {
  pending: "Beklemede",
  approved: "Onaylandı",
  rejected: "Reddedildi",
  completed: "Tamamlandı",
  cancelled: "İptal Edildi",
  ongoing: "Devam Ediyor",
  upcoming: "Yaklaşan",
};

// Event status colors for UI (formerly used from COLORS in constants/dashboard.ts)
export const EVENT_STATUS_COLORS: Record<string, string> = {
  approved: "#22c55e", // green
  pending: "#eab308", // yellow
  rejected: "#ef4444", // red
  completed: "#3b82f6", // blue
  cancelled: "#6b7280", // gray
  ongoing: "#8b5cf6", // purple
  upcoming: "#0891b2", // cyan
};

// Sample event data using the schema
export const EVENT_SCHEMA = {
  // Complete event objects following the schema
  events: [
    {
      id: "evt-001",
      title: "Morning Run Club",
      description:
        "Join us for a morning run around the park. All fitness levels welcome!",
      startDate: "2023-09-10T07:00:00Z",
      endDate: "2023-09-10T08:30:00Z",
      time: "07:00",
      location: {
        name: "City Park",
        address: "1234 Park Avenue",
        city: "Istanbul",
        coordinates: {
          latitude: 41.0082,
          longitude: 28.9784,
        },
      },
      category: "sport",
      participants: 15,
      maxParticipants: 30,
      status: "approved",
      organizer: {
        id: "usr-1",
        name: "Ali Yilmaz",
        email: "ali@example.com",
        avatar: "/avatars/01.png",
      },
      image: "/images/events/morning-run.jpg",
      createdAt: "2023-08-01T09:00:00Z",
      updatedAt: "2023-08-15T14:30:00Z",
      tags: ["running", "fitness", "morning", "outdoor"],
      visibility: "public",
      registrationRequired: true,
      registrationDeadline: "2023-09-09T20:00:00Z",
    },
    {
      id: "evt-002",
      title: "Basketball Tournament",
      description:
        "Annual basketball tournament with teams from across the city. Sign up your team now!",
      startDate: "2023-09-15T10:00:00Z",
      endDate: "2023-09-17T18:00:00Z",
      time: "10:00",
      location: {
        name: "Sports Complex",
        address: "567 Athletic Drive",
        city: "Istanbul",
        coordinates: {
          latitude: 41.0359,
          longitude: 28.9877,
        },
      },
      category: "tournament",
      participants: 48,
      maxParticipants: 64,
      status: "approved",
      organizer: {
        id: "usr-2",
        name: "Ahmet Demir",
        email: "ahmet@example.com",
        avatar: "/avatars/02.png",
      },
      image: "/images/events/basketball-tournament.jpg",
      createdAt: "2023-07-15T11:30:00Z",
      updatedAt: "2023-08-05T16:45:00Z",
      tags: ["basketball", "tournament", "competition", "team"],
      price: {
        amount: 250,
        currency: "TRY",
      },
      visibility: "public",
      registrationRequired: true,
      registrationDeadline: "2023-09-10T23:59:59Z",
    },
    {
      id: "evt-003",
      title: "Yoga in the Park",
      description:
        "Relaxing yoga session in the park with instructor Zeynep. Bring your own mat!",
      startDate: "2023-09-12T17:30:00Z",
      endDate: "2023-09-12T18:30:00Z",
      time: "17:30",
      location: {
        name: "Sunset Park",
        address: "789 Peaceful Lane",
        city: "Istanbul",
        coordinates: {
          latitude: 41.0231,
          longitude: 28.9112,
        },
      },
      category: "training",
      participants: 12,
      maxParticipants: 20,
      status: "approved",
      organizer: {
        id: "usr-3",
        name: "Zeynep Kaya",
        email: "zeynep@example.com",
        avatar: "/avatars/03.png",
      },
      image: "/images/events/yoga-park.jpg",
      createdAt: "2023-08-20T10:15:00Z",
      updatedAt: "2023-08-25T09:30:00Z",
      tags: ["yoga", "wellness", "outdoor", "meditation"],
      recurrence: {
        type: "weekly",
        interval: 1,
        endDate: "2023-10-31T18:30:00Z",
      },
      visibility: "public",
      registrationRequired: true,
    },
    {
      id: "evt-004",
      title: "Sports Club Meeting",
      description:
        "Monthly meeting to discuss club activities, finances, and upcoming events.",
      startDate: "2023-09-05T19:00:00Z",
      endDate: "2023-09-05T20:30:00Z",
      time: "19:00",
      location: {
        name: "Community Center",
        address: "456 Main Street",
        city: "Istanbul",
      },
      category: "meeting",
      participants: 8,
      maxParticipants: 15,
      status: "completed",
      organizer: {
        id: "usr-4",
        name: "Mehmet Can",
        email: "mehmet@example.com",
        avatar: "/avatars/04.png",
      },
      createdAt: "2023-08-10T13:45:00Z",
      updatedAt: "2023-09-06T09:15:00Z",
      tags: ["meeting", "club", "planning"],
      visibility: "private",
      registrationRequired: false,
    },
    {
      id: "evt-005",
      title: "Fitness Workshop",
      description:
        "Learn proper exercise techniques from professional trainers.",
      startDate: "2023-09-20T14:00:00Z",
      endDate: "2023-09-20T17:00:00Z",
      time: "14:00",
      location: {
        name: "Fitness Center",
        address: "321 Health Blvd",
        city: "Istanbul",
      },
      category: "workshop",
      participants: 25,
      maxParticipants: 30,
      status: "pending",
      organizer: {
        id: "usr-5",
        name: "Selin Yildiz",
        email: "selin@example.com",
        avatar: "/avatars/05.png",
      },
      image: "/images/events/fitness-workshop.jpg",
      createdAt: "2023-08-28T15:00:00Z",
      updatedAt: "2023-08-28T15:00:00Z",
      tags: ["fitness", "workshop", "training", "health"],
      price: {
        amount: 50,
        currency: "TRY",
      },
      visibility: "public",
      registrationRequired: true,
      registrationDeadline: "2023-09-18T23:59:59Z",
    },
  ],

  // References to event categories
  categories: [
    "tournament",
    "training",
    "meeting",
    "sport",
    "social",
    "workshop",
    "competition",
    "other",
  ],

  // Event statistics
  stats: {
    total: 25,
    approved: 18,
    pending: 4,
    rejected: 1,
    completed: 12,
    cancelled: 2,
    ongoing: 4,
  },
};
