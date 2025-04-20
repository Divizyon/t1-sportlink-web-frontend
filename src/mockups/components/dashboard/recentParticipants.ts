/**
 * Recent Participants Mockup Data
 *
 * This file contains mockup data specifically for the RecentParticipants component
 * (/components/dashboard/home/RecentParticipants.tsx).
 *
 * It uses a subset of the main user schema to simulate the specific data
 * needed for this component.
 */

import { USER_SCHEMA } from "../../schemas/userSchema";

// Subset of user schema fields used in the RecentParticipants component
export interface RecentParticipantMock {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  lastEvent: string;
}

// Get the 5 most recent users from the schema
export const RECENT_PARTICIPANTS: RecentParticipantMock[] = USER_SCHEMA.users
  .slice(0, 5)
  .map((user) => ({
    id: user.id,
    name: user.name,
    email: user.email,
    avatar: user.avatar,
    lastEvent: `Son aktivite: ${user.lastActive || "Hiç aktivite yok"}`,
  }));

// Enriched participant data for selection
export const PARTICIPANT_DETAILS: Record<string, any> = USER_SCHEMA.users
  .slice(0, 5)
  .reduce((acc, user) => {
    acc[user.id] = {
      ...user,
      statisticsOverview: {
        eventsJoined: Math.floor(Math.random() * 20) + 5,
        eventsOrganized: Math.floor(Math.random() * 10),
        totalReviews: Math.floor(Math.random() * 15),
        averageRating: (3 + Math.random() * 2).toFixed(1),
      },
      recentActivity: {
        lastLogin: new Date(user.lastActive || new Date()).toISOString(),
        lastEventParticipation: new Date(
          Date.now() - Math.floor(Math.random() * 7 * 24 * 60 * 60 * 1000)
        ).toISOString(),
        upcomingEvents: Math.floor(Math.random() * 3),
      },
    };
    return acc;
  }, {} as Record<string, any>);
