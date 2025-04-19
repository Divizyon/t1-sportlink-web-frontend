/**
 * User Utility Functions
 * Specialized utilities for working with user and participant data
 */

import { User, Participant } from "@/types/dashboard";
import { formatDistance, subDays } from "date-fns";
import { tr } from "date-fns/locale";

/**
 * Get user initials for avatar fallback
 */
export function getUserInitials(name: string): string {
  if (!name) return "?";

  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();

  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}

/**
 * Format user's last active time as a relative time string
 */
export function formatLastActive(lastActiveDate: string | Date): string {
  const date =
    typeof lastActiveDate === "string"
      ? new Date(lastActiveDate)
      : lastActiveDate;

  return formatDistance(date, new Date(), {
    addSuffix: true,
    locale: tr,
  });
}

/**
 * Sort users by recent activity
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
 * Group users by their role
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
 * Filter users by status
 */
export function filterUsersByStatus(users: User[], status: string): User[] {
  return users.filter((user) => user.status === status);
}

/**
 * Get active users (users who were active in the last X days)
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
 * Calculate new user growth
 */
export function calculateUserGrowth(
  currentUsers: User[],
  previousUsers: User[]
): number {
  const currentCount = currentUsers.length;
  const previousCount = previousUsers.length;

  if (previousCount === 0) {
    return currentCount > 0 ? 100 : 0;
  }

  return Number(
    (((currentCount - previousCount) / previousCount) * 100).toFixed(1)
  );
}

/**
 * Sort participants by their last event date
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
 * Format user role for display
 */
export function formatUserRole(role: string): string {
  // Add role-specific formatting logic here
  return role.charAt(0).toUpperCase() + role.slice(1);
}

/**
 * Determine if a user is admin
 */
export function isAdmin(user: User): boolean {
  return user.role === "admin";
}

/**
 * Calculate user participation statistics
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
