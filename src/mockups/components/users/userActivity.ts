/**
 * User Activity Mockup Data
 *
 * This file contains mockup data specifically for user activity components.
 * It provides activity logs, participation history, and activity stats.
 */

import { USER_SCHEMA } from "../../schemas/userSchema";
import { EVENT_SCHEMA } from "../../schemas/eventSchema";

// Activity log entry interface
export interface ActivityLogEntry {
  id: string;
  userId: string;
  type:
    | "event_registration"
    | "event_attendance"
    | "profile_update"
    | "comment"
    | "rating"
    | "badge_earned";
  timestamp: string;
  details: {
    title: string;
    description: string;
    eventId?: string;
    eventTitle?: string;
    badgeId?: string;
    badgeName?: string;
    ratingValue?: number;
    commentText?: string;
    points?: number;
  };
}

// User event participation interface
export interface UserEventParticipation {
  id: string;
  eventId: string;
  eventTitle: string;
  eventDate: string;
  registrationDate: string;
  status: "registered" | "attended" | "cancelled" | "no_show";
  feedback?: {
    rating: number;
    comment: string;
    submittedAt: string;
  };
}

// Badges earned by users
export interface UserBadge {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  earnedDate: string;
  category: "participation" | "achievement" | "community" | "special";
  level?: "bronze" | "silver" | "gold" | "platinum";
}

// Generate activity log for a specific user
export const getUserActivityLog = (userId: string): ActivityLogEntry[] => {
  const user = USER_SCHEMA.users.find((u) => u.id === userId);
  if (!user) return [];

  // Create a random number of activities
  const activityCount = Math.min(20, Math.floor(Math.random() * 30));
  const activities: ActivityLogEntry[] = [];

  // Generate activities over the last 30 days
  const now = new Date();

  for (let i = 0; i < activityCount; i++) {
    // Random date within the last 30 days
    const daysAgo = Math.floor(Math.random() * 30);
    const hoursAgo = Math.floor(Math.random() * 24);
    const timestamp = new Date(now);
    timestamp.setDate(timestamp.getDate() - daysAgo);
    timestamp.setHours(timestamp.getHours() - hoursAgo);

    // Randomly select activity type
    const activityTypes: ActivityLogEntry["type"][] = [
      "event_registration",
      "event_attendance",
      "profile_update",
      "comment",
      "rating",
      "badge_earned",
    ];
    const type =
      activityTypes[Math.floor(Math.random() * activityTypes.length)];

    // Generate activity details based on type
    let details: ActivityLogEntry["details"] = {
      title: "",
      description: "",
    };

    const randomEvent =
      EVENT_SCHEMA.events[
        Math.floor(Math.random() * EVENT_SCHEMA.events.length)
      ];

    switch (type) {
      case "event_registration":
        details = {
          title: "Registered for Event",
          description: `${user.name} registered for ${randomEvent.title}`,
          eventId: randomEvent.id,
          eventTitle: randomEvent.title,
        };
        break;
      case "event_attendance":
        details = {
          title: "Attended Event",
          description: `${user.name} attended ${randomEvent.title}`,
          eventId: randomEvent.id,
          eventTitle: randomEvent.title,
        };
        break;
      case "profile_update":
        details = {
          title: "Updated Profile",
          description: `${user.name} updated their profile information`,
        };
        break;
      case "comment":
        details = {
          title: "Left a Comment",
          description: `${user.name} commented on ${randomEvent.title}`,
          eventId: randomEvent.id,
          eventTitle: randomEvent.title,
          commentText:
            "This was a great event! Looking forward to the next one.",
        };
        break;
      case "rating":
        const rating = Math.floor(Math.random() * 5) + 1;
        details = {
          title: "Rated an Event",
          description: `${user.name} gave ${randomEvent.title} a rating of ${rating}/5`,
          eventId: randomEvent.id,
          eventTitle: randomEvent.title,
          ratingValue: rating,
        };
        break;
      case "badge_earned":
        const badges = [
          { id: "badge-1", name: "First Event" },
          { id: "badge-2", name: "Frequent Participant" },
          { id: "badge-3", name: "Sports Enthusiast" },
          { id: "badge-4", name: "Community Builder" },
        ];
        const badge = badges[Math.floor(Math.random() * badges.length)];
        details = {
          title: "Earned a Badge",
          description: `${user.name} earned the ${badge.name} badge`,
          badgeId: badge.id,
          badgeName: badge.name,
          points: 50,
        };
        break;
    }

    activities.push({
      id: `act-${userId}-${i}`,
      userId,
      type,
      timestamp: timestamp.toISOString(),
      details,
    });
  }

  // Sort activities by timestamp (newest first)
  return activities.sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );
};

// Get event participation history for a user
export const getUserEventParticipation = (
  userId: string
): UserEventParticipation[] => {
  const user = USER_SCHEMA.users.find((u) => u.id === userId);
  if (!user) return [];

  // Create participation entries for a subset of events
  return EVENT_SCHEMA.events
    .slice(0, user.stats.eventsAttended)
    .map((event, index) => {
      // Generate a random registration date before the event
      const eventDate = new Date(event.startDate);
      const regDate = new Date(eventDate);
      regDate.setDate(regDate.getDate() - Math.floor(Math.random() * 14) - 1);

      // Determine participation status
      const statuses: UserEventParticipation["status"][] = [
        "registered",
        "attended",
        "cancelled",
        "no_show",
      ];
      const statusWeights = [0.1, 0.7, 0.1, 0.1]; // 70% chance of 'attended'

      let statusIndex = 0;
      const rand = Math.random();
      let cumulativeWeight = 0;

      for (let i = 0; i < statusWeights.length; i++) {
        cumulativeWeight += statusWeights[i];
        if (rand < cumulativeWeight) {
          statusIndex = i;
          break;
        }
      }

      const status = statuses[statusIndex];

      // Add feedback for attended events
      let feedback = undefined;
      if (status === "attended" && Math.random() > 0.3) {
        const feedbackDate = new Date(eventDate);
        feedbackDate.setDate(feedbackDate.getDate() + 1);

        feedback = {
          rating: Math.floor(Math.random() * 5) + 1,
          comment: "Great event, really enjoyed it!",
          submittedAt: feedbackDate.toISOString(),
        };
      }

      return {
        id: `part-${userId}-${event.id}`,
        eventId: event.id,
        eventTitle: event.title,
        eventDate: event.startDate,
        registrationDate: regDate.toISOString(),
        status,
        feedback,
      };
    });
};

// Get badges earned by a user
export const getUserBadges = (userId: string): UserBadge[] => {
  const user = USER_SCHEMA.users.find((u) => u.id === userId);
  if (!user) return [];

  // Base number of badges on user's activity level
  const badgeCount = Math.min(8, Math.floor(user.stats.eventsAttended / 2));

  const badges: UserBadge[] = [
    {
      id: "badge-welcome",
      name: "Welcome",
      description: "Joined the platform",
      imageUrl: "/badges/welcome.png",
      earnedDate: user.joinDate,
      category: "special",
    },
  ];

  // Add more badges based on activity
  if (user.stats.eventsAttended >= 1) {
    const earnedDate = new Date(user.joinDate);
    earnedDate.setDate(earnedDate.getDate() + 7);

    badges.push({
      id: "badge-first-event",
      name: "First Event",
      description: "Attended your first event",
      imageUrl: "/badges/first-event.png",
      earnedDate: earnedDate.toISOString(),
      category: "participation",
      level: "bronze",
    });
  }

  if (user.stats.eventsAttended >= 5) {
    const earnedDate = new Date(user.joinDate);
    earnedDate.setDate(earnedDate.getDate() + 30);

    badges.push({
      id: "badge-regular",
      name: "Regular Participant",
      description: "Attended 5 events",
      imageUrl: "/badges/regular.png",
      earnedDate: earnedDate.toISOString(),
      category: "participation",
      level: "silver",
    });
  }

  if (user.stats.eventsOrganized >= 1) {
    const earnedDate = new Date(user.joinDate);
    earnedDate.setDate(earnedDate.getDate() + 45);

    badges.push({
      id: "badge-organizer",
      name: "Event Organizer",
      description: "Organized your first event",
      imageUrl: "/badges/organizer.png",
      earnedDate: earnedDate.toISOString(),
      category: "achievement",
      level: "gold",
    });
  }

  return badges;
};

// Get a sample user's activity data
export const SAMPLE_USER_ACTIVITY = {
  activityLog: getUserActivityLog("usr-001"),
  eventParticipation: getUserEventParticipation("usr-001"),
  badges: getUserBadges("usr-001"),
};
