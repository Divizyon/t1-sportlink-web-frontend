/**
 * User Modal Mockup Data
 *
 * This file contains mockup data specifically for user modal components.
 * It provides data for user details, editing, and profile viewing modals.
 */

import { USER_SCHEMA, UserRole, UserStatus } from "../../schemas/userSchema";

// Interface for user modal data
export interface UserModalMock {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: string;
  status: string;
  profile: {
    bio?: string;
    location?: string;
    phoneNumber?: string;
    dateOfBirth?: string;
    gender?: string;
    interests?: string[];
    socialMedia?: {
      twitter?: string;
      instagram?: string;
      facebook?: string;
      linkedIn?: string;
    };
  };
  stats: {
    eventsAttended: number;
    eventsOrganized: number;
    ratingsReceived: number;
    averageRating: number;
  };
  membershipType?: string;
  joinDate: string;
  lastActive: string;
}

// Get modal data for a specific user
export const getUserModalData = (userId: string): UserModalMock | undefined => {
  const user = USER_SCHEMA.users.find((u) => u.id === userId);
  if (!user) return undefined;

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    avatar: user.avatar || "/avatars/default.png",
    role: user.role,
    status: user.status,
    profile: user.profile,
    stats: user.stats,
    membershipType: user.membership?.type,
    joinDate: user.joinDate,
    lastActive: user.lastActive,
  };
};

// User edit form default values
export const getUserEditFormDefaults = (
  userId: string
): Partial<UserModalMock> | undefined => {
  const user = getUserModalData(userId);
  if (!user) return undefined;

  return {
    name: user.name,
    email: user.email,
    avatar: user.avatar,
    role: user.role,
    status: user.status,
    profile: {
      bio: user.profile.bio || "",
      location: user.profile.location || "",
      phoneNumber: user.profile.phoneNumber || "",
      dateOfBirth: user.profile.dateOfBirth || "",
      gender: user.profile.gender || "prefer-not-to-say",
      interests: user.profile.interests || [],
      socialMedia: user.profile.socialMedia || {},
    },
  };
};

// Gender options for form select
export const GENDER_OPTIONS = [
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
  { value: "other", label: "Other" },
  { value: "prefer-not-to-say", label: "Prefer not to say" },
];

// Role options for form select (admin only)
export const ROLE_OPTIONS = [
  { value: "admin", label: "Administrator" },
  { value: "moderator", label: "Moderator" },
  { value: "organizer", label: "Organizer" },
  { value: "regular", label: "Regular User" },
];

// Status options for form select (admin only)
export const STATUS_OPTIONS = [
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
  { value: "pending", label: "Pending" },
  { value: "suspended", label: "Suspended" },
  { value: "banned", label: "Banned" },
];

// Popular interests for suggestions
export const POPULAR_INTERESTS = [
  "basketball",
  "football",
  "soccer",
  "tennis",
  "running",
  "cycling",
  "swimming",
  "yoga",
  "fitness",
  "volleyball",
  "hiking",
  "martial arts",
  "table tennis",
  "badminton",
];

// Sample user modal data for quick access
export const SAMPLE_USER_MODAL = getUserModalData(USER_SCHEMA.users[0].id);
