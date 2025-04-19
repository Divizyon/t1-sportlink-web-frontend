import { User } from "@/types/dashboard";

/**
 * Mock data for users
 */

// Users for the dashboard
export const USERS: User[] = [
  {
    id: 1,
    name: "Ahmet Yılmaz",
    email: "ahmet@example.com",
    role: "admin",
    status: "active",
    joinDate: "2023-01-15",
    avatar: "/avatars/01.png",
    registeredDate: "2023-01-15",
    lastActive: "2023-08-25",
  },
  {
    id: 2,
    name: "Ayşe Demir",
    email: "ayse@example.com",
    role: "moderator",
    status: "active",
    joinDate: "2023-02-20",
    avatar: "/avatars/02.png",
    registeredDate: "2023-02-20",
    lastActive: "2023-08-24",
  },
  {
    id: 3,
    name: "Mehmet Can",
    email: "mehmet@example.com",
    role: "user",
    status: "active",
    joinDate: "2023-03-10",
    avatar: "/avatars/03.png",
    registeredDate: "2023-03-10",
    lastActive: "2023-08-23",
  },
  {
    id: 4,
    name: "Zeynep Kaya",
    email: "zeynep@example.com",
    role: "user",
    status: "inactive",
    joinDate: "2023-04-05",
    avatar: "/avatars/04.png",
    registeredDate: "2023-04-05",
    lastActive: "2023-07-15",
  },
];

// Detailed user data (for UserDetailModal and other components)
export const USER_DETAILS: User[] = [
  {
    id: 1,
    name: "Ahmet Koç",
    email: "ahmet@example.com",
    role: "üye",
    status: "aktif",
    joinDate: "2023-01-15",
    avatar: "/avatars/user1.jpg",
    registeredDate: "2023-01-10",
    lastActive: "2023-07-15",
  },
  {
    id: 2,
    name: "Ayşe Yılmaz",
    email: "ayse@example.com",
    role: "üye",
    status: "aktif",
    joinDate: "2023-02-20",
    avatar: "/avatars/user2.jpg",
    registeredDate: "2023-02-18",
    lastActive: "2023-07-14",
  },
  {
    id: 3,
    name: "Mehmet Can",
    email: "mehmet@example.com",
    role: "üye",
    status: "aktif",
    joinDate: "2023-03-10",
    avatar: "/avatars/user3.jpg",
    registeredDate: "2023-03-05",
    lastActive: "2023-07-10",
  },
];

// User status distribution
export const USER_STATUS_COUNTS = {
  active: 487,
  pending: 23,
  inactive: 12,
  blocked: 5,
};
