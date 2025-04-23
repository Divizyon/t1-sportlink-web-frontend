/**
 * User Data Service
 *
 * A service that provides consistent user data handling across all components.
 * This service handles user data without any mock fallbacks.
 *
 * KEY FUNCTIONS:
 * - processUserData: Ensures user data is properly typed without adding mock data
 */

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
 * Processes user data to ensure proper typing without adding mock data
 *
 * This function takes user data from the database and ensures it has the correct type
 * without adding any mock or default values.
 *
 * @param userData The user data from the database
 * @returns The same user data with proper typing
 */
export function processUserData(userData: any): CommonUser {
  // Simply return the user data with proper typing
  // No mock data or defaults are added
  return {
    id: userData.id,
    name: userData.name,
    email: userData.email,
    status: userData.status,
    avatar: userData.avatar,
    phone: userData.phone,
    gender: userData.gender,
    age: userData.age,
    registeredDate: userData.registeredDate,
    lastActive: userData.lastActive,
    role: userData.role,
    bio: userData.bio,
    address: userData.address,
    favoriteCategories: userData.favoriteCategories,
    events: userData.events,
    eventCount: userData.eventCount,
    completedEvents: userData.completedEvents,
    joinDate: userData.joinDate,
  };
}

/**
 * Legacy function maintained for backward compatibility
 * @deprecated Use processUserData instead
 */
export function enrichUserData(userData: any): CommonUser {
  return processUserData(userData);
}
