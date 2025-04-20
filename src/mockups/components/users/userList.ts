/**
 * User List Mockup Data
 *
 * This file contains mockup data specifically for user list components.
 * It provides filtered and paginated user lists with various sorting options.
 */

import { USER_SCHEMA, UserRole, UserStatus } from "../../schemas/userSchema";

// Interface for list user item
export interface UserListItemMock {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: string;
  status: string;
  joinDate: string;
  lastActive: string;
  eventsAttended: number;
  eventsOrganized: number;
  membershipType?: string;
}

// Filter users by role
export const filterUsersByRole = (
  role: UserRole | "all"
): UserListItemMock[] => {
  if (role === "all") {
    return USER_SCHEMA.users.map(mapToUserListItem);
  }

  return USER_SCHEMA.users
    .filter((user) => user.role === role)
    .map(mapToUserListItem);
};

// Filter users by status
export const filterUsersByStatus = (
  status: UserStatus | "all"
): UserListItemMock[] => {
  if (status === "all") {
    return USER_SCHEMA.users.map(mapToUserListItem);
  }

  return USER_SCHEMA.users
    .filter((user) => user.status === status)
    .map(mapToUserListItem);
};

// Sort users by join date
export const sortUsersByJoinDate = (
  users: UserListItemMock[] = USER_SCHEMA.users.map(mapToUserListItem),
  ascending: boolean = false
): UserListItemMock[] => {
  return [...users].sort((a, b) => {
    const dateA = new Date(a.joinDate).getTime();
    const dateB = new Date(b.joinDate).getTime();
    return ascending ? dateA - dateB : dateB - dateA;
  });
};

// Sort users by last active
export const sortUsersByLastActive = (
  users: UserListItemMock[] = USER_SCHEMA.users.map(mapToUserListItem),
  ascending: boolean = false
): UserListItemMock[] => {
  return [...users].sort((a, b) => {
    const dateA = new Date(a.lastActive).getTime();
    const dateB = new Date(b.lastActive).getTime();
    return ascending ? dateA - dateB : dateB - dateA;
  });
};

// Search users by name or email
export const searchUsers = (query: string): UserListItemMock[] => {
  if (!query.trim()) {
    return USER_SCHEMA.users.map(mapToUserListItem);
  }

  const lowercaseQuery = query.toLowerCase();

  return USER_SCHEMA.users
    .filter(
      (user) =>
        user.name.toLowerCase().includes(lowercaseQuery) ||
        user.email.toLowerCase().includes(lowercaseQuery)
    )
    .map(mapToUserListItem);
};

// Helper function to map USER_SCHEMA user to UserListItemMock
const mapToUserListItem = (
  user: (typeof USER_SCHEMA.users)[0]
): UserListItemMock => {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    avatar: user.avatar || "/avatars/default.png",
    role: user.role,
    status: user.status,
    joinDate: user.joinDate,
    lastActive: user.lastActive,
    eventsAttended: user.stats.eventsAttended,
    eventsOrganized: user.stats.eventsOrganized,
    membershipType: user.membership?.type,
  };
};

// Export commonly used user lists
export const RECENT_USERS = sortUsersByJoinDate().slice(0, 5);
export const ACTIVE_USERS = sortUsersByLastActive().slice(0, 10);
export const ADMIN_USERS = filterUsersByRole("admin");

// User role options for filtering
export const ROLE_OPTIONS = [
  { value: "all", label: "All Roles" },
  { value: "admin", label: "Administrators" },
  { value: "moderator", label: "Moderators" },
  { value: "organizer", label: "Organizers" },
  { value: "regular", label: "Regular Users" },
];

// User status options for filtering
export const STATUS_OPTIONS = [
  { value: "all", label: "All Statuses" },
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
  { value: "pending", label: "Pending" },
  { value: "suspended", label: "Suspended" },
  { value: "banned", label: "Banned" },
];
