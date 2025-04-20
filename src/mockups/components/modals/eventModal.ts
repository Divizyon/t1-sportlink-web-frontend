/**
 * Event Modal Mockup Data
 *
 * This file contains mockup data specifically for event modal components.
 * It provides data for event details, registration, and confirmation modals.
 */

import { EVENT_SCHEMA } from "../../schemas/eventSchema";
import { USER_SCHEMA } from "../../schemas/userSchema";

// Interface for event modal data
export interface EventModalMock {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  location: {
    name: string;
    address: string;
    city: string;
  };
  category: string;
  organizer: {
    id: string;
    name: string;
    avatar?: string;
  };
  participants: number;
  maxParticipants: number;
  price?: {
    amount: number;
    currency: string;
  };
  registrationDeadline?: string;
}

// Get modal data for a specific event
export const getEventModalData = (
  eventId: string
): EventModalMock | undefined => {
  const event = EVENT_SCHEMA.events.find((e) => e.id === eventId);
  if (!event) return undefined;

  return {
    id: event.id,
    title: event.title,
    description: event.description,
    startDate: event.startDate,
    endDate: event.endDate,
    location: {
      name: event.location.name,
      address: event.location.address,
      city: event.location.city,
    },
    category: event.category,
    organizer: {
      id: event.organizer.id,
      name: event.organizer.name,
      avatar: event.organizer.avatar,
    },
    participants: event.participants,
    maxParticipants: event.maxParticipants,
    price: event.price,
    registrationDeadline: event.registrationDeadline,
  };
};

// Registration status options
export type RegistrationStatus =
  | "confirmed"
  | "waitlist"
  | "cancelled"
  | "failed";

// Registration confirmation data
export interface RegistrationConfirmationMock {
  eventId: string;
  eventTitle: string;
  registrationId: string;
  userId: string;
  userName: string;
  registrationDate: string;
  status: RegistrationStatus;
  message: string;
  qrCode?: string;
  paymentRequired?: boolean;
  paymentAmount?: number;
  paymentCurrency?: string;
}

// Generate registration confirmation data
export const getRegistrationConfirmation = (
  eventId: string,
  userId: string,
  status: RegistrationStatus = "confirmed"
): RegistrationConfirmationMock | undefined => {
  const event = EVENT_SCHEMA.events.find((e) => e.id === eventId);
  const user = USER_SCHEMA.users.find((u) => u.id === userId);

  if (!event || !user) return undefined;

  // Generate an appropriate message based on status
  let message = "";
  switch (status) {
    case "confirmed":
      message = `Your registration for ${event.title} has been confirmed. We look forward to seeing you!`;
      break;
    case "waitlist":
      message = `The event is currently full. You have been added to the waitlist and will be notified if a spot becomes available.`;
      break;
    case "cancelled":
      message = `Your registration for ${event.title} has been cancelled. We hope to see you at other events in the future.`;
      break;
    case "failed":
      message = `We could not complete your registration for ${event.title}. Please try again or contact support.`;
      break;
  }

  return {
    eventId: event.id,
    eventTitle: event.title,
    registrationId: `reg-${eventId}-${userId}`,
    userId: user.id,
    userName: user.name,
    registrationDate: new Date().toISOString(),
    status,
    message,
    qrCode:
      status === "confirmed"
        ? `/qrcodes/registration-${event.id}-${user.id}.png`
        : undefined,
    paymentRequired: event.price && event.price.amount > 0,
    paymentAmount: event.price?.amount,
    paymentCurrency: event.price?.currency,
  };
};

// Event cancellation reason options
export const CANCELLATION_REASONS = [
  { value: "schedule_conflict", label: "Schedule Conflict" },
  { value: "no_longer_interested", label: "No Longer Interested" },
  { value: "too_expensive", label: "Price Too High" },
  { value: "other", label: "Other" },
];

// Sample event modal data for quick access
export const SAMPLE_EVENT_MODAL = getEventModalData(EVENT_SCHEMA.events[0].id);
