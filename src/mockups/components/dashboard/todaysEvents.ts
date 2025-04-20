/**
 * Today's Events Mock Data
 *
 * This file provides mock data for the TodaysEvents component.
 *
 * Component Reference:
 * - TODAY_EVENTS: Used in src/components/dashboard/home/TodaysEvents.tsx for main event listing
 * - UPCOMING_EVENTS: Used in src/components/dashboard/home/TodaysEvents.tsx for secondary event listing
 * - EVENT_PARTICIPANTS: Used in src/components/dashboard/home/TodaysEvents.tsx for expandable participant lists
 */

import { EVENT_SCHEMA, EventStatus } from "../../schemas/eventSchema";
import { USER_SCHEMA } from "../../schemas/userSchema";

// Subset of event schema fields used in the TodaysEvents component
export interface TodaysEventMock {
  id: string | number;
  title: string;
  time: string;
  location: string;
  category: string;
  participants: number;
  maxParticipants: number;
  status: EventStatus;
}

// Mock data for participants of specific events
export interface EventParticipant {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  lastEvent: string;
}

// Get today's date for filtering
const today = new Date();
today.setHours(0, 0, 0, 0);

// Filter events that are happening today
export const TODAY_EVENTS: TodaysEventMock[] = EVENT_SCHEMA.events
  .filter((event) => {
    const eventDate = new Date(event.startDate);
    eventDate.setHours(0, 0, 0, 0);
    return eventDate.getTime() === today.getTime();
  })
  .map((event) => ({
    id: event.id,
    title: event.title,
    time: event.time,
    location: event.location.name,
    category: event.category,
    participants: event.participants,
    maxParticipants: event.maxParticipants,
    status: event.status as EventStatus,
  }));

// Upcoming events for the next 7 days
export const UPCOMING_EVENTS: TodaysEventMock[] = EVENT_SCHEMA.events
  .filter((event) => {
    const eventDate = new Date(event.startDate);
    eventDate.setHours(0, 0, 0, 0);
    const nextWeek = new Date(today);
    nextWeek.setDate(today.getDate() + 7);
    return eventDate > today && eventDate <= nextWeek;
  })
  .map((event) => ({
    id: event.id,
    title: event.title,
    time: event.time,
    location: event.location.name,
    category: event.category,
    participants: event.participants,
    maxParticipants: event.maxParticipants,
    status: event.status as EventStatus,
  }));

// Mock participants for today's events
export const EVENT_PARTICIPANTS: { [key: string]: EventParticipant[] } = {
  "evt-001": [
    {
      id: USER_SCHEMA.users[0].id,
      name: USER_SCHEMA.users[0].name,
      email: USER_SCHEMA.users[0].email,
      avatar: USER_SCHEMA.users[0].avatar,
      lastEvent: "Morning Run Club",
    },
    {
      id: USER_SCHEMA.users[2].id,
      name: USER_SCHEMA.users[2].name,
      email: USER_SCHEMA.users[2].email,
      avatar: USER_SCHEMA.users[2].avatar,
      lastEvent: "Morning Run Club",
    },
  ],
  "evt-002": [
    {
      id: USER_SCHEMA.users[1].id,
      name: USER_SCHEMA.users[1].name,
      email: USER_SCHEMA.users[1].email,
      avatar: USER_SCHEMA.users[1].avatar,
      lastEvent: "Basketball Tournament",
    },
    {
      id: USER_SCHEMA.users[2].id,
      name: USER_SCHEMA.users[2].name,
      email: USER_SCHEMA.users[2].email,
      avatar: USER_SCHEMA.users[2].avatar,
      lastEvent: "Basketball Tournament",
    },
  ],
  "evt-003": [
    {
      id: USER_SCHEMA.users[0].id,
      name: USER_SCHEMA.users[0].name,
      email: USER_SCHEMA.users[0].email,
      avatar: USER_SCHEMA.users[0].avatar,
      lastEvent: "Yoga in the Park",
    },
    {
      id: USER_SCHEMA.users[1].id,
      name: USER_SCHEMA.users[1].name,
      email: USER_SCHEMA.users[1].email,
      avatar: USER_SCHEMA.users[1].avatar,
      lastEvent: "Yoga in the Park",
    },
    {
      id: USER_SCHEMA.users[3].id,
      name: USER_SCHEMA.users[3].name,
      email: USER_SCHEMA.users[3].email,
      avatar: USER_SCHEMA.users[3].avatar,
      lastEvent: "Yoga in the Park",
    },
  ],
};
