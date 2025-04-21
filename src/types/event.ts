/**
 * Event Types
 * This file contains types related to events, aligned with the schema in mockups
 */

// Event interface (matching EventSchema)
export interface Event {
  id: string;
  title: string;
  description: string;
  startDate: string; // ISO date string
  endDate: string; // ISO date string
  date?: Date; // For backward compatibility with existing components
  time: string; // Format: "HH:MM"
  location:
    | {
        name: string;
        address: string;
        city: string;
        coordinates?: {
          latitude: number;
          longitude: number;
        };
      }
    | string; // Allow string for backward compatibility
  category: EventCategory;
  participants: number;
  maxParticipants: number;
  status: EventStatus;
  organizer:
    | {
        id: string;
        name: string;
        email: string;
        avatar?: string;
      }
    | string; // Allow string for backward compatibility
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
  currentParticipants?: number; // For backward compatibility
}

// Event category types (matching EventSchema.EventCategory)
export type EventCategory =
  | "all"
  | "tournament"
  | "training"
  | "meeting"
  | "sport"
  | "social"
  | "workshop"
  | "competition"
  | "match"
  | "other";

// Event status types (matching EventSchema.EventStatus)
export type EventStatus =
  | "pending"
  | "approved"
  | "rejected"
  | "completed"
  | "cancelled"
  | "ongoing"
  | "upcoming";
