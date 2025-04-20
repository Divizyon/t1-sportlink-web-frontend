/**
 * User Stats Mockup Data
 *
 * This file contains mockup data specifically for dashboard user statistics components.
 * It provides summary statistics and trends about user activity.
 */

import { USER_SCHEMA } from "../../schemas/userSchema";

// Interface for user statistics data
export interface UserStatsMock {
  totalUsers: number;
  activeUsers: number;
  newUsersThisMonth: number;
  usersByRole: {
    admin: number;
    moderator: number;
    organizer: number;
    regular: number;
  };
  usersByStatus: {
    active: number;
    inactive: number;
    pending: number;
    suspended: number;
    banned: number;
  };
  userGrowth: {
    period: string;
    count: number;
  }[];
  usersByMembership: {
    type: string;
    count: number;
  }[];
  mostActiveUsers: {
    id: string;
    name: string;
    avatar: string;
    eventsAttended: number;
    lastActive: string;
  }[];
}

// Calculate user statistics from the USER_SCHEMA
export const USER_STATS: UserStatsMock = {
  totalUsers: USER_SCHEMA.users.length,
  activeUsers: USER_SCHEMA.users.filter((u) => u.status === "active").length,
  newUsersThisMonth: Math.floor(USER_SCHEMA.users.length * 0.1), // Mock data, 10% of users are new

  // Count users by role
  usersByRole: {
    admin: USER_SCHEMA.users.filter((u) => u.role === "admin").length,
    moderator: USER_SCHEMA.users.filter((u) => u.role === "moderator").length,
    organizer: USER_SCHEMA.users.filter((u) => u.role === "organizer").length,
    regular: USER_SCHEMA.users.filter((u) => u.role === "regular").length,
  },

  // Count users by status
  usersByStatus: {
    active: USER_SCHEMA.users.filter((u) => u.status === "active").length,
    inactive: USER_SCHEMA.users.filter((u) => u.status === "inactive").length,
    pending: USER_SCHEMA.users.filter((u) => u.status === "pending").length,
    suspended: USER_SCHEMA.users.filter((u) => u.status === "suspended").length,
    banned: USER_SCHEMA.users.filter((u) => u.status === "banned").length,
  },

  // Mock user growth over the last 6 months
  userGrowth: [
    {
      period: "6 months ago",
      count: Math.floor(USER_SCHEMA.users.length * 0.7),
    },
    {
      period: "5 months ago",
      count: Math.floor(USER_SCHEMA.users.length * 0.75),
    },
    {
      period: "4 months ago",
      count: Math.floor(USER_SCHEMA.users.length * 0.8),
    },
    {
      period: "3 months ago",
      count: Math.floor(USER_SCHEMA.users.length * 0.85),
    },
    {
      period: "2 months ago",
      count: Math.floor(USER_SCHEMA.users.length * 0.9),
    },
    {
      period: "1 month ago",
      count: Math.floor(USER_SCHEMA.users.length * 0.95),
    },
    { period: "This month", count: USER_SCHEMA.users.length },
  ],

  // User counts by membership type
  usersByMembership: [
    {
      type: "free",
      count: USER_SCHEMA.users.filter(
        (u) => !u.membership || u.membership.type === "free"
      ).length,
    },
    {
      type: "premium",
      count: USER_SCHEMA.users.filter((u) => u.membership?.type === "premium")
        .length,
    },
    {
      type: "pro",
      count: USER_SCHEMA.users.filter((u) => u.membership?.type === "pro")
        .length,
    },
  ],

  // Most active users (users with highest event attendance)
  mostActiveUsers: USER_SCHEMA.users
    .sort((a, b) => b.stats.eventsAttended - a.stats.eventsAttended)
    .slice(0, 5)
    .map((user) => ({
      id: user.id,
      name: user.name,
      avatar: user.avatar || "/avatars/default.png",
      eventsAttended: user.stats.eventsAttended,
      lastActive: user.lastActive,
    })),
};

// User activity by time of day (for showing peak activity hours)
export const USER_ACTIVITY_BY_HOUR = [
  { hour: "00:00", count: 12 },
  { hour: "01:00", count: 8 },
  { hour: "02:00", count: 5 },
  { hour: "03:00", count: 3 },
  { hour: "04:00", count: 2 },
  { hour: "05:00", count: 4 },
  { hour: "06:00", count: 10 },
  { hour: "07:00", count: 25 },
  { hour: "08:00", count: 53 },
  { hour: "09:00", count: 95 },
  { hour: "10:00", count: 132 },
  { hour: "11:00", count: 150 },
  { hour: "12:00", count: 145 },
  { hour: "13:00", count: 130 },
  { hour: "14:00", count: 135 },
  { hour: "15:00", count: 140 },
  { hour: "16:00", count: 150 },
  { hour: "17:00", count: 180 },
  { hour: "18:00", count: 210 },
  { hour: "19:00", count: 230 },
  { hour: "20:00", count: 220 },
  { hour: "21:00", count: 170 },
  { hour: "22:00", count: 110 },
  { hour: "23:00", count: 45 },
];

// User retention rates (mock data)
export const USER_RETENTION = {
  overall: 0.75, // 75% retention rate
  byJoinDate: [
    { period: "Last 30 days", rate: 0.92 },
    { period: "1-3 months", rate: 0.85 },
    { period: "3-6 months", rate: 0.78 },
    { period: "6-12 months", rate: 0.72 },
    { period: "Over 1 year", rate: 0.65 },
  ],
  byMembership: [
    { type: "free", rate: 0.65 },
    { type: "premium", rate: 0.82 },
    { type: "pro", rate: 0.91 },
  ],
};
