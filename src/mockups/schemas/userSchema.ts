/**
 * User Schema
 *
 * This file defines the complete user data structure for the application.
 * All component-specific mockup data should reference and subset this schema.
 */

// Types for user-related data
export interface UserSchema {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: UserRole;
  status: UserStatus;
  joinDate: string; // ISO date string
  lastActive: string; // ISO date string
  profile: {
    bio?: string;
    location?: string;
    phoneNumber?: string;
    dateOfBirth?: string; // ISO date string
    gender?: "male" | "female" | "other" | "prefer-not-to-say";
    interests?: string[];
    socialMedia?: {
      twitter?: string;
      instagram?: string;
      facebook?: string;
      linkedIn?: string;
    };
  };
  preferences: {
    notifications: {
      email: boolean;
      push: boolean;
      sms: boolean;
    };
    privacy: {
      showEmail: boolean;
      showPhone: boolean;
      showLocation: boolean;
      showJoinDate: boolean;
    };
    theme?: "light" | "dark" | "system";
    language?: string;
  };
  stats: {
    eventsAttended: number;
    eventsOrganized: number;
    ratingsReceived: number;
    averageRating: number;
    reportsSubmitted: number;
    reportsReceived: number;
  };
  membership?: {
    type: "free" | "premium" | "pro";
    startDate: string; // ISO date string
    endDate?: string; // ISO date string
    autoRenew: boolean;
  };
  verifications: {
    email: boolean;
    phone: boolean;
    identityDocument: boolean;
  };
  contactPermissions: {
    marketing: boolean;
    updates: boolean;
    surveys: boolean;
  };
}

// User role types
export type UserRole =
  | "admin"
  | "director"
  | "staff"
  | "head_coach"
  | "coach"
  | "moderator"
  | "organizer"
  | "regular";

// User status types
export type UserStatus =
  | "active"
  | "inactive"
  | "pending"
  | "suspended"
  | "banned";

// User role constants (formerly in constants/dashboard.ts)
export const USER_ROLES: Record<UserRole, UserRole> = {
  admin: "admin",
  director: "director",
  staff: "staff",
  head_coach: "head_coach",
  coach: "coach",
  moderator: "moderator",
  organizer: "organizer",
  regular: "regular",
};

// User role labels for UI display
export const USER_ROLE_LABELS: Record<UserRole, string> = {
  admin: "Yönetici",
  director: "Direktör",
  staff: "Personel",
  head_coach: "Baş Antrenör",
  coach: "Antrenör",
  moderator: "Moderatör",
  organizer: "Organizatör",
  regular: "Kullanıcı",
};

// Dashboard admin roles that have access to admin features
export const DASHBOARD_ADMIN_ROLES: UserRole[] = [
  "admin",
  "director",
  "staff",
  "head_coach",
  "coach",
];

// Sample user data using the schema
export const USER_SCHEMA = {
  // Complete user objects following the schema
  users: [
    {
      id: "usr-001",
      name: "Ali Yilmaz",
      email: "ali@example.com",
      avatar: "/avatars/01.png",
      role: "regular",
      status: "active",
      joinDate: "2023-01-15T10:30:00Z",
      lastActive: "2023-08-25T14:45:00Z",
      profile: {
        bio: "Sports enthusiast and avid runner.",
        location: "Istanbul",
        phoneNumber: "+90 555 123 4567",
        dateOfBirth: "1990-05-12T00:00:00Z",
        gender: "male",
        interests: ["running", "basketball", "fitness"],
        socialMedia: {
          instagram: "@aliyilmaz",
          twitter: "@aliyilmaz",
        },
      },
      preferences: {
        notifications: {
          email: true,
          push: true,
          sms: false,
        },
        privacy: {
          showEmail: false,
          showPhone: false,
          showLocation: true,
          showJoinDate: true,
        },
        theme: "system",
        language: "tr",
      },
      stats: {
        eventsAttended: 12,
        eventsOrganized: 2,
        ratingsReceived: 10,
        averageRating: 4.8,
        reportsSubmitted: 0,
        reportsReceived: 0,
      },
      membership: {
        type: "free",
        startDate: "2023-01-15T10:30:00Z",
        autoRenew: false,
      },
      verifications: {
        email: true,
        phone: true,
        identityDocument: false,
      },
      contactPermissions: {
        marketing: true,
        updates: true,
        surveys: false,
      },
    },
    {
      id: "usr-002",
      name: "Ayşe Demir",
      email: "ayse@example.com",
      avatar: "/avatars/02.png",
      role: "moderator",
      status: "active",
      joinDate: "2022-11-20T08:15:00Z",
      lastActive: "2023-08-24T19:30:00Z",
      profile: {
        bio: "Fitness trainer and yoga instructor.",
        location: "Istanbul",
        phoneNumber: "+90 555 987 6543",
        dateOfBirth: "1988-10-25T00:00:00Z",
        gender: "female",
        interests: ["yoga", "pilates", "meditation"],
        socialMedia: {
          instagram: "@aysedemir",
          facebook: "aysedemir.fitness",
        },
      },
      preferences: {
        notifications: {
          email: true,
          push: true,
          sms: true,
        },
        privacy: {
          showEmail: true,
          showPhone: false,
          showLocation: true,
          showJoinDate: true,
        },
        theme: "light",
        language: "tr",
      },
      stats: {
        eventsAttended: 8,
        eventsOrganized: 15,
        ratingsReceived: 42,
        averageRating: 4.9,
        reportsSubmitted: 2,
        reportsReceived: 0,
      },
      membership: {
        type: "premium",
        startDate: "2023-02-01T00:00:00Z",
        endDate: "2024-02-01T00:00:00Z",
        autoRenew: true,
      },
      verifications: {
        email: true,
        phone: true,
        identityDocument: true,
      },
      contactPermissions: {
        marketing: true,
        updates: true,
        surveys: true,
      },
    },
    {
      id: "usr-003",
      name: "Mehmet Can",
      email: "mehmet@example.com",
      avatar: "/avatars/03.png",
      role: "regular",
      status: "active",
      joinDate: "2023-03-10T14:20:00Z",
      lastActive: "2023-08-23T12:10:00Z",
      profile: {
        bio: "Basketball player and coach.",
        location: "Ankara",
        phoneNumber: "+90 555 111 2222",
        dateOfBirth: "1992-07-18T00:00:00Z",
        gender: "male",
        interests: ["basketball", "coaching", "fitness"],
      },
      preferences: {
        notifications: {
          email: true,
          push: false,
          sms: false,
        },
        privacy: {
          showEmail: false,
          showPhone: false,
          showLocation: false,
          showJoinDate: true,
        },
        theme: "dark",
        language: "tr",
      },
      stats: {
        eventsAttended: 5,
        eventsOrganized: 3,
        ratingsReceived: 12,
        averageRating: 4.5,
        reportsSubmitted: 1,
        reportsReceived: 0,
      },
      verifications: {
        email: true,
        phone: false,
        identityDocument: false,
      },
      contactPermissions: {
        marketing: false,
        updates: true,
        surveys: false,
      },
    },
    {
      id: "usr-004",
      name: "Zeynep Kaya",
      email: "zeynep@example.com",
      avatar: "/avatars/04.png",
      role: "organizer",
      status: "inactive",
      joinDate: "2023-02-05T09:45:00Z",
      lastActive: "2023-07-15T16:30:00Z",
      profile: {
        bio: "Event organizer specializing in outdoor activities.",
        location: "Izmir",
        phoneNumber: "+90 555 333 4444",
        dateOfBirth: "1991-12-03T00:00:00Z",
        gender: "female",
        interests: ["hiking", "cycling", "outdoor", "nature"],
        socialMedia: {
          instagram: "@zeynepkaya",
          twitter: "@zeynepkaya",
          linkedIn: "zeynepkaya",
        },
      },
      preferences: {
        notifications: {
          email: true,
          push: true,
          sms: true,
        },
        privacy: {
          showEmail: true,
          showPhone: true,
          showLocation: true,
          showJoinDate: true,
        },
        theme: "light",
        language: "en",
      },
      stats: {
        eventsAttended: 3,
        eventsOrganized: 22,
        ratingsReceived: 65,
        averageRating: 4.7,
        reportsSubmitted: 0,
        reportsReceived: 1,
      },
      membership: {
        type: "pro",
        startDate: "2023-02-10T00:00:00Z",
        endDate: "2024-02-10T00:00:00Z",
        autoRenew: true,
      },
      verifications: {
        email: true,
        phone: true,
        identityDocument: true,
      },
      contactPermissions: {
        marketing: true,
        updates: true,
        surveys: true,
      },
    },
    {
      id: "usr-005",
      name: "Emre Sahin",
      email: "emre@example.com",
      avatar: "/avatars/05.png",
      role: "admin",
      status: "active",
      joinDate: "2022-09-01T08:00:00Z",
      lastActive: "2023-08-25T18:15:00Z",
      profile: {
        location: "Istanbul",
        phoneNumber: "+90 555 555 5555",
        gender: "male",
      },
      preferences: {
        notifications: {
          email: true,
          push: true,
          sms: true,
        },
        privacy: {
          showEmail: false,
          showPhone: false,
          showLocation: false,
          showJoinDate: false,
        },
        theme: "system",
        language: "tr",
      },
      stats: {
        eventsAttended: 0,
        eventsOrganized: 0,
        ratingsReceived: 0,
        averageRating: 0,
        reportsSubmitted: 0,
        reportsReceived: 0,
      },
      verifications: {
        email: true,
        phone: true,
        identityDocument: true,
      },
      contactPermissions: {
        marketing: false,
        updates: true,
        surveys: false,
      },
    },
  ],

  // User role distribution
  roles: {
    admin: 2,
    moderator: 5,
    organizer: 28,
    regular: 465,
  },

  // User status distribution
  statusCounts: {
    active: 487,
    inactive: 12,
    pending: 23,
    suspended: 8,
    banned: 5,
  },
};
