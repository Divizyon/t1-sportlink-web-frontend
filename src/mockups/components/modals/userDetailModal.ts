/**
 * User Detail Modal Mockup Data
 *
 * This file contains mockup data specifically for user detail modal components.
 * It provides utility functions for user status badges and event status badges.
 */

import { UserStatus } from "../../schemas/userSchema";
import { getUserModalData } from "./userModal";
import { getUserEvents } from "../users/userProfile";

/**
 * Normalized user status types that may appear in the UI
 */
export type NormalizedUserStatus =
  | "active"
  | "aktif"
  | "suspended"
  | "blocked"
  | "inactive";

/**
 * Get status badge class names for a given user status
 */
export const getUserStatusBadgeClasses = (
  status: UserStatus | string
): string => {
  // Normalize status to lowercase for consistent case handling
  const normalizedStatus = status?.toLowerCase() as NormalizedUserStatus;

  switch (normalizedStatus) {
    case "active":
    case "aktif":
      return "bg-green-50 text-green-700 border-green-200";
    case "suspended":
      return "bg-yellow-50 text-yellow-700 border-yellow-200";
    case "blocked":
      return "bg-red-50 text-red-700 border-red-200";
    case "inactive":
      return "bg-gray-50 text-gray-700 border-gray-200";
    default:
      // Return active styling as default if status is unknown
      return "bg-green-50 text-green-700 border-green-200";
  }
};

/**
 * Get status badge label for a given user status in Turkish
 */
export const getUserStatusBadgeLabel = (
  status: UserStatus | string
): string => {
  // Normalize status to lowercase for consistent case handling
  const normalizedStatus = status?.toLowerCase() as NormalizedUserStatus;

  switch (normalizedStatus) {
    case "active":
    case "aktif":
      return "Aktif";
    case "suspended":
      return "Askıya Alınmış";
    case "blocked":
      return "Engellendi";
    case "inactive":
      return "Pasif";
    default:
      // Return Aktif as default if status is unknown
      return "Aktif";
  }
};

/**
 * Get event status badge class names for a given event status
 */
export const getEventStatusBadgeClasses = (status: string): string => {
  switch (status) {
    case "completed":
      return "bg-green-50 text-green-700";
    case "upcoming":
      return "bg-purple-50 text-purple-700";
    case "canceled":
    case "cancelled":
      return "bg-red-50 text-red-700";
    default:
      return "bg-gray-50 text-gray-700";
  }
};

/**
 * Get event status badge label for a given event status in Turkish
 */
export const getEventStatusBadgeLabel = (status: string): string => {
  switch (status) {
    case "completed":
      return "Tamamlandı";
    case "upcoming":
      return "Yaklaşan";
    case "canceled":
    case "cancelled":
      return "İptal Edildi";
    default:
      return status;
  }
};

/**
 * Get complete detail modal data for a user
 */
export const getUserDetailModalData = (userId: string) => {
  // Get basic user data from userModal
  const userData = getUserModalData(userId);

  // Get user events
  const userEventData = getUserEvents(userId);

  // Format the data for the modal
  return {
    userData,
    userEvents: userEventData,
    stats: {
      completedCount: userEventData?.completed.length || 0,
      upcomingCount: userEventData?.upcoming.length || 0,
      canceledCount: userEventData?.canceled.length || 0,
    },
  };
};
