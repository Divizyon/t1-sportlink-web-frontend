/**
 * User Profile Mockup Data
 *
 * This file contains mockup data specifically for user profile components.
 * It uses a subset of the main user schema for what's needed in profile views.
 */

import { USER_SCHEMA, UserRole, UserStatus } from "../../schemas/userSchema";
import { EVENT_SCHEMA } from "../../schemas/eventSchema";

// Interface for user profile data
export interface UserProfileData {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  avatar?: string;
  joinDate: string;
  lastActive: string;
  bio?: string;
  location?: string;
  interests?: string[];
  stats: {
    eventsAttended: number;
    eventsOrganized: number;
    averageRating: number;
  };
  socialMedia?: {
    twitter?: string;
    instagram?: string;
    facebook?: string;
    linkedIn?: string;
  };
  verified: boolean;
}

// Interface for user activity
export interface UserActivityItem {
  id: string;
  type:
    | "event-joined"
    | "event-created"
    | "event-completed"
    | "profile-updated";
  date: string;
  title: string;
  details?: string;
}

// Map users from the schema to profile-specific format
export const USER_PROFILES: UserProfileData[] = USER_SCHEMA.users.map(
  (user) => ({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role as UserRole,
    status: user.status as UserStatus,
    avatar: user.avatar,
    joinDate: user.joinDate,
    lastActive: user.lastActive,
    bio: user.profile.bio,
    location: user.profile.location,
    interests: user.profile.interests,
    stats: {
      eventsAttended: user.stats.eventsAttended,
      eventsOrganized: user.stats.eventsOrganized,
      averageRating: user.stats.averageRating,
    },
    socialMedia: user.profile.socialMedia,
    verified: user.verifications.email,
  })
);

// Get a specific user profile by ID
export const getUserProfile = (userId: string): UserProfileData | undefined => {
  return USER_PROFILES.find((user) => user.id === userId);
};

// Generate events a user has participated in
export const getUserEvents = (userId: string) => {
  // Find events where this user is the organizer
  const organizedEvents = EVENT_SCHEMA.events
    .filter((event) => event.organizer.id === userId)
    .map((event) => ({
      id: event.id,
      title: event.title,
      date: event.startDate,
      category: event.category,
      status: event.status,
      isOrganizer: true,
    }));

  // Generate some random participated events
  const participatedEvents = EVENT_SCHEMA.events
    .filter((event) => event.organizer.id !== userId) // Not organizing
    .slice(0, 3) // Just take first few events
    .map((event) => ({
      id: event.id,
      title: event.title,
      date: event.startDate,
      category: event.category,
      status: event.status,
      isOrganizer: false,
    }));

  return {
    organized: organizedEvents,
    participated: participatedEvents,
    upcoming: [...organizedEvents, ...participatedEvents]
      .filter((event) => new Date(event.date) > new Date())
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(0, 5), // Limit to 5 upcoming events
  };
};

// Generate user activity feed
export const getUserActivity = (userId: string): UserActivityItem[] => {
  const user = USER_SCHEMA.users.find((u) => u.id === userId);
  if (!user) return [];

  // Generate a few activity items based on the user's data
  const activities: UserActivityItem[] = [];

  // Add event joined activities
  for (let i = 0; i < 3; i++) {
    const randomEvent =
      EVENT_SCHEMA.events[
        Math.floor(Math.random() * EVENT_SCHEMA.events.length)
      ];
    activities.push({
      id: `activity-${userId}-join-${i}`,
      type: "event-joined",
      date: new Date(
        new Date(user.joinDate).getTime() + i * 7 * 24 * 60 * 60 * 1000
      ).toISOString(),
      title: `Joined ${randomEvent.title}`,
      details: `Joined as participant`,
    });
  }

  // Add event created activities for organizers
  if (user.role === "organizer" || user.role === "admin") {
    for (let i = 0; i < 2; i++) {
      activities.push({
        id: `activity-${userId}-create-${i}`,
        type: "event-created",
        date: new Date(
          new Date(user.joinDate).getTime() + i * 14 * 24 * 60 * 60 * 1000
        ).toISOString(),
        title: `Created new event: ${EVENT_SCHEMA.events[i].title}`,
        details: `Created as organizer`,
      });
    }
  }

  // Add profile updated
  activities.push({
    id: `activity-${userId}-profile-1`,
    type: "profile-updated",
    date: new Date(
      new Date(user.joinDate).getTime() + 2 * 24 * 60 * 60 * 1000
    ).toISOString(),
    title: `Updated profile information`,
  });

  // Sort by date (most recent first) and return
  return activities.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
};
