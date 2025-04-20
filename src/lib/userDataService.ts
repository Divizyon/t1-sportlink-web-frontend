/**
 * User Data Service
 *
 * A service that provides consistent user data across all components.
 * This is NOT a utility file, but a domain-specific service for user data enrichment.
 *
 * USAGE GUIDELINES:
 * - Use this service when you need to transform or enrich user/participant data
 * - For user-specific utility functions, use userUtils.ts instead
 * - For generic utilities, use utils.ts
 *
 * KEY FUNCTIONS:
 * - enrichUserData: Enhances sparse user data with consistent properties
 * - getUserById: Retrieves complete user data by ID
 *
 * @example
 * // Enriching a user object with consistent data
 * import { enrichUserData } from "@/lib/userDataService";
 * const completeUser = enrichUserData(partialUserData);
 */

import { USER_SCHEMA } from "@/mockups/schemas/userSchema";
import { EVENT_SCHEMA } from "@/mockups/schemas/eventSchema";

// Use the schema data to create the structures we need
const USER_DETAILS = USER_SCHEMA.users;

// Basic default user events
const DEFAULT_USER_EVENTS = EVENT_SCHEMA.events.slice(0, 3).map((event) => ({
  id: event.id,
  title: event.title,
  date: event.startDate,
  status: event.status,
}));

// Create a map of participant details from users
const DETAILED_PARTICIPANTS: Record<string, any> = {};
USER_SCHEMA.users.forEach((user) => {
  DETAILED_PARTICIPANTS[user.id] = {
    id: user.id,
    name: user.name,
    email: user.email,
    avatar: user.avatar,
    role: user.role,
    status: user.status,
    lastActive: user.lastActive,
    joinDate: user.joinDate,
  };
});

// Common interface for all user data
export interface CommonUser {
  id: string | number;
  name: string;
  email: string;
  status: string;
  avatar?: string;
  phone?: string;
  gender?: string;
  age?: number;
  registeredDate?: string;
  lastActive?: string;
  role?: string;
  bio?: string;
  address?: string;
  favoriteCategories?: string[];
  events?: any[];
  eventCount?: number;
  completedEvents?: number;
  joinDate?: string;
}

/**
 * Enriches participant data with consistent user information
 *
 * This function takes partial user data and ensures it has all required fields
 * by merging it with default values from the user details repository.
 *
 * @param participant The participant data to enrich
 * @returns Complete user data with consistent properties
 *
 * @example
 * const user = enrichUserData({
 *   id: "123",
 *   name: "John Doe",
 *   email: "john@example.com"
 * });
 * // Returns a complete user object with all properties
 */
export function enrichUserData(participant: any): CommonUser {
  // Check if a detailed participant exists with this ID
  const detailedParticipant =
    typeof participant.id === "string" && DETAILED_PARTICIPANTS[participant.id]
      ? DETAILED_PARTICIPANTS[participant.id]
      : null;

  // Find most appropriate user from USER_DETAILS
  const matchingUser =
    USER_DETAILS.find(
      (u) =>
        u.email.toLowerCase() === participant.email?.toLowerCase() ||
        u.name.toLowerCase() === participant.name?.toLowerCase()
    ) || USER_DETAILS[0];

  // Extract relevant data from user profile
  const userGender = matchingUser.profile?.gender
    ? matchingUser.profile.gender === "male"
      ? "Erkek"
      : matchingUser.profile.gender === "female"
      ? "Kadın"
      : "Diğer"
    : "Belirtilmemiş";

  const userWithDefaults = {
    ...matchingUser,
    gender: userGender,
    age: 28, // Default age since it's not in the schema
  };

  // Merge the data together with participant data taking precedence
  return {
    // Base user data (fallback to the first user in USER_DETAILS)
    ...userWithDefaults,

    // Override with participant data if available
    id: participant.id || userWithDefaults.id,
    name: participant.name || userWithDefaults.name,
    email: participant.email || userWithDefaults.email,
    avatar: participant.avatar || userWithDefaults.avatar,

    // Enhanced data for consistent experience
    status: participant.status || userWithDefaults.status || "active",
    phone:
      participant.phone ||
      userWithDefaults.profile?.phoneNumber ||
      "+90 555 123 4567",
    gender: participant.gender || userGender,
    age: participant.age || 28,
    registeredDate:
      participant.registeredDate || userWithDefaults.joinDate || "01.01.2023",
    lastActive:
      participant.lastEvent ||
      participant.lastActive ||
      userWithDefaults.lastActive ||
      "Bugün, 10:30",
    role: participant.role || userWithDefaults.role || "üye",
    bio:
      participant.bio ||
      userWithDefaults.profile?.bio ||
      "Spor ve açık hava aktivitelerine meraklı bir profesyonel.",
    address:
      participant.address ||
      userWithDefaults.profile?.location ||
      "İstanbul, Türkiye",
    favoriteCategories: participant.favoriteCategories ||
      userWithDefaults.profile?.interests || ["Futbol", "Koşu", "Bisiklet"],

    // Event data
    events: participant.events || DEFAULT_USER_EVENTS,
    eventCount: participant.eventCount || DEFAULT_USER_EVENTS.length,
    completedEvents:
      participant.completedEvents ||
      DEFAULT_USER_EVENTS.filter((e: any) => e.status === "completed").length,
  };
}

/**
 * Retrieves consistent user data by ID
 *
 * Searches for a user by ID across different data sources and returns
 * a complete user object with consistent properties.
 *
 * @param userId The ID of the user to retrieve
 * @returns Complete user data or null if not found
 *
 * @example
 * const user = getUserById("123");
 * if (user) {
 *   // Use the complete user data
 * }
 */
export function getUserById(userId: string | number): CommonUser | null {
  // Convert userId to string for consistent comparison
  const userIdStr = String(userId);

  // First check detailed participants
  if (userIdStr in DETAILED_PARTICIPANTS) {
    return enrichUserData(DETAILED_PARTICIPANTS[userIdStr]);
  }

  // Then check user details
  const userFromDetails = USER_DETAILS.find((u) => String(u.id) === userIdStr);
  if (userFromDetails) {
    return enrichUserData(userFromDetails);
  }

  return null;
}
