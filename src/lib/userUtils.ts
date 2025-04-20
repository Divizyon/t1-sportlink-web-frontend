/**
 * User Utility Functions
 *
 * Specialized utilities for working with user and participant data.
 * This file contains functions specific to user operations, filtering, sorting, etc.
 *
 * USAGE GUIDELINES:
 * - Use these functions for user/participant-specific operations
 * - For generic utilities, use utils.ts instead
 * - For user data transformation/enrichment, use userDataService.ts
 *
 * NOTES:
 * - Some functions from utils.ts are re-exported here for backward compatibility
 *   (getUserInitials, formatLastActive)
 *
 * @example
 * // User specific operations
 * import { sortUsersByActivity, isAdmin } from "@/lib/userUtils";
 */

import { User, Participant } from "@/types/dashboard";
import { subDays } from "date-fns";
import { calculateGrowth } from "./utils";

// Re-export functions to maintain backward compatibility
export { getUserInitials, formatLastActive } from "./utils";

/**
 * Sort users by recent activity (most recent first)
 * @example sortUsersByActivity(users)
 */
export function sortUsersByActivity(users: User[]): User[] {
  return [...users].sort((a, b) => {
    if (!a.lastActive && !b.lastActive) return 0;
    if (!a.lastActive) return 1;
    if (!b.lastActive) return -1;

    const dateA = new Date(a.lastActive).getTime();
    const dateB = new Date(b.lastActive).getTime();
    return dateB - dateA;
  });
}

/**
 * Groups users by their role
 * @example const usersByRole = groupUsersByRole(users);
 */
export function groupUsersByRole(users: User[]): Record<string, User[]> {
  return users.reduce((acc, user) => {
    if (!acc[user.role]) {
      acc[user.role] = [];
    }
    acc[user.role].push(user);
    return acc;
  }, {} as Record<string, User[]>);
}

/**
 * Filter users by their status
 * @example const activeUsers = filterUsersByStatus(users, "active");
 */
export function filterUsersByStatus(users: User[], status: string): User[] {
  return users.filter((user) => user.status === status);
}

/**
 * Get users who were active within the specified number of days
 * @param days Number of days to consider as "active" (default: 30)
 * @example const recentlyActiveUsers = getActiveUsers(users, 7);
 */
export function getActiveUsers(users: User[], days: number = 30): User[] {
  const dateThreshold = subDays(new Date(), days);

  return users.filter((user) => {
    if (!user.lastActive) return false;
    const lastActiveDate = new Date(user.lastActive);
    return lastActiveDate >= dateThreshold;
  });
}

/**
 * Calculate growth percentage between current and previous user counts
 * @example const growthRate = calculateUserGrowth(currentMonthUsers, lastMonthUsers);
 */
export function calculateUserGrowth(
  currentUsers: User[],
  previousUsers: User[]
): number {
  return calculateGrowth(currentUsers.length, previousUsers.length);
}

/**
 * Sort participants by their last event date (most recent first)
 * @example const sortedParticipants = sortParticipantsByLastEvent(participants);
 */
export function sortParticipantsByLastEvent(
  participants: Participant[]
): Participant[] {
  return [...participants].sort((a, b) => {
    // This assumes lastEvent is in a format that can be lexically compared
    // For a real app, it would be better to parse these as dates
    return b.lastEvent.localeCompare(a.lastEvent);
  });
}

/**
 * Filter participants who have participated in a specific category
 * @example const footballParticipants = filterParticipantsByCategory(participants, "Futbol", eventsByParticipant);
 */
export function filterParticipantsByCategory(
  participants: Participant[],
  category: string,
  eventsByParticipant: Record<string, any[]> // This would typically contain event data by participant ID
): Participant[] {
  return participants.filter((participant) => {
    const participantEvents = eventsByParticipant[participant.id] || [];
    return participantEvents.some((event) => event.category === category);
  });
}

/**
 * Format user role for display (capitalize first letter)
 * @example formatUserRole("admin") // "Admin"
 */
export function formatUserRole(role: string): string {
  // Add role-specific formatting logic here
  return role.charAt(0).toUpperCase() + role.slice(1);
}

/**
 * Determine if a user has admin role
 * @example if (isAdmin(user)) { // show admin controls }
 */
export function isAdmin(user: User): boolean {
  return user.role === "admin";
}

/**
 * Calculate user participation statistics
 * @example const stats = calculateUserParticipationStats(userId, participationData);
 */
export function calculateUserParticipationStats(
  userId: string | number,
  participationData: any[] // This would typically be a record of user participation
) {
  const userParticipation = participationData.filter(
    (p) => p.userId === userId
  );

  const total = userParticipation.length;
  const completed = userParticipation.filter(
    (p) => p.status === "completed"
  ).length;
  const rate = total > 0 ? Math.round((completed / total) * 100) : 0;

  return {
    total,
    completed,
    rate,
  };
}
