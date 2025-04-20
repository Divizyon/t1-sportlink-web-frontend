export interface Event {
  id: string;
  title: string;
  description: string;
  startDate: string; // ISO date string
  endDate: string; // ISO date string
  time?: string; // Format: "HH:MM"
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
  | "upcoming"; // Including "upcoming" from the original type
