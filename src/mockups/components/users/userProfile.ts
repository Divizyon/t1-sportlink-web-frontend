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
  // Ensure we have a consistent today date for event generation
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  const nextWeek = new Date(today);
  nextWeek.setDate(today.getDate() + 7);

  const lastWeek = new Date(today);
  lastWeek.setDate(today.getDate() - 7);

  const lastMonth = new Date(today);
  lastMonth.setMonth(today.getMonth() - 1);

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

  // Generate mock completed events with past dates
  const completedEvents = [
    {
      id: `completed-${userId}-1`,
      title: "Morning Yoga Session",
      date: lastWeek.toISOString(),
      category: "training",
      status: "completed",
      isOrganizer: false,
    },
    {
      id: `completed-${userId}-2`,
      title: "Basketball Tournament",
      date: lastMonth.toISOString(),
      category: "tournament",
      status: "completed",
      isOrganizer: false,
    },
    {
      id: `completed-${userId}-3`,
      title: "Team Building Workshop",
      date: lastMonth.toISOString(),
      category: "workshop",
      status: "completed",
      isOrganizer: true,
    },
    {
      id: `completed-${userId}-4`,
      title: "Running Club",
      date: lastWeek.toISOString(),
      category: "sport",
      status: "completed",
      isOrganizer: false,
    },
    {
      id: `completed-${userId}-5`,
      title: "Swimming Competition",
      date: lastMonth.toISOString(),
      category: "competition",
      status: "completed",
      isOrganizer: false,
    },
  ];

  // Generate mock canceled events
  const canceledEvents = [
    {
      id: `canceled-${userId}-1`,
      title: "Outdoor Soccer Game",
      date: yesterday.toISOString(),
      category: "sport",
      status: "cancelled",
      isOrganizer: false,
    },
    {
      id: `canceled-${userId}-2`,
      title: "Fitness Workshop",
      date: lastWeek.toISOString(),
      category: "workshop",
      status: "cancelled",
      isOrganizer: true,
    },
  ];

  // Generate mock participated events
  const participatedEvents = [
    {
      id: `participated-${userId}-1`,
      title: "Weekly Tennis Practice",
      date: yesterday.toISOString(),
      category: "training",
      status: "completed",
      isOrganizer: false,
    },
    {
      id: `participated-${userId}-2`,
      title: "City Marathon",
      date: lastMonth.toISOString(),
      category: "competition",
      status: "completed",
      isOrganizer: false,
    },
  ];

  // Generate mock upcoming events
  const upcomingEvents = [
    {
      id: `upcoming-${userId}-1`,
      title: "Volleyball Tournament",
      date: nextWeek.toISOString(),
      category: "tournament",
      status: "approved",
      isOrganizer: false,
    },
    {
      id: `upcoming-${userId}-2`,
      title: "Cycling Group",
      date: tomorrow().toISOString(),
      category: "sport",
      status: "approved",
      isOrganizer: true,
    },
    {
      id: `upcoming-${userId}-3`,
      title: "Hiking Trip",
      date: dayAfterTomorrow().toISOString(),
      category: "outdoor",
      status: "pending",
      isOrganizer: false,
    },
  ];

  // Helper functions for date calculations
  function tomorrow() {
    const date = new Date(today);
    date.setDate(today.getDate() + 1);
    return date;
  }

  function dayAfterTomorrow() {
    const date = new Date(today);
    date.setDate(today.getDate() + 2);
    return date;
  }

  // Combine all events for the "all" section
  const allEvents = [
    ...organizedEvents,
    ...participatedEvents,
    ...completedEvents,
    ...canceledEvents,
    ...upcomingEvents,
  ];

  // Map events for the upcoming events display
  const upcoming = allEvents
    .filter((event) => {
      const eventDate = new Date(event.date);
      return (
        eventDate > today &&
        (event.status === "approved" || event.status === "pending")
      );
    })
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 5); // Limit to 5 upcoming events

  return {
    organized: organizedEvents,
    participated: [
      ...participatedEvents,
      ...completedEvents,
      ...canceledEvents,
    ],
    upcoming,
    // Additional direct access for the modal tabs
    completed: completedEvents,
    canceled: canceledEvents,
    all: allEvents,
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
