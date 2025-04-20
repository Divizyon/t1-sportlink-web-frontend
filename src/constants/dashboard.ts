/**
 * Dashboard Constants
 * Centralized constants for the dashboard
 */

import {
  EventStatus,
  ReportPriority,
  ReportStatus,
  DashboardTabValue,
  ModalType,
  ReportFilterType,
} from "@/types";

// Event Categories
export const EVENT_CATEGORIES = [
  "Futbol",
  "Basketbol",
  "Voleybol",
  "Tenis",
  "Yüzme",
  "Koşu",
  "Yoga",
  "Fitness",
  "Diğer",
];

// Event Status Constants
export const EVENT_STATUS: Record<string, EventStatus> = {
  pending: "pending",
  approved: "approved",
  rejected: "rejected",
  completed: "completed",
  cancelled: "cancelled",
  ongoing: "ongoing",
  upcoming: "upcoming",
};

// Event Status Labels
export const EVENT_STATUS_LABELS: Record<string, string> = {
  pending: "Beklemede",
  approved: "Onaylandı",
  rejected: "Reddedildi",
  completed: "Tamamlandı",
  cancelled: "İptal Edildi",
  ongoing: "Devam Ediyor",
  upcoming: "Yaklaşan",
};

// Report Priority Constants
export const REPORT_PRIORITY: Record<ReportPriority, ReportPriority> = {
  high: "high",
  medium: "medium",
  low: "low",
};

// Report Priority Labels
export const REPORT_PRIORITY_LABELS: Record<ReportPriority, string> = {
  high: "Yüksek",
  medium: "Orta",
  low: "Düşük",
};

// Report Status Constants
export const REPORT_STATUS: Record<string, ReportStatus> = {
  pending: "pending",
  reviewing: "reviewing",
  resolved: "resolved",
  rejected: "rejected",
  dismissed: "dismissed",
};

// Report Status Labels
export const REPORT_STATUS_LABELS: Record<string, string> = {
  pending: "Beklemede",
  reviewing: "İnceleniyor",
  resolved: "Çözüldü",
  rejected: "Reddedildi",
  dismissed: "Kapatıldı",
};

// Entity Type Labels
export const ENTITY_TYPE_LABELS: Record<string, string> = {
  user: "Kullanıcı",
  event: "Etkinlik",
};

// Dashboard Tab Values
export const DASHBOARD_TABS = {
  overview: "overview",
  analytics: "analytics",
} as const satisfies Record<DashboardTabValue, DashboardTabValue>;

// Dashboard Tab Labels
export const DASHBOARD_TAB_LABELS = {
  overview: "Genel Bakış",
  analytics: "Analitik",
} as const satisfies Record<DashboardTabValue, string>;

// Report Filter Values
export const REPORT_FILTERS: Record<ReportFilterType, ReportFilterType> = {
  all: "all",
  users: "users",
  events: "events",
};

// Report Filter Labels
export const REPORT_FILTER_LABELS: Record<ReportFilterType, string> = {
  all: "Tüm Raporlar",
  users: "Kullanıcı Raporları",
  events: "Etkinlik Raporları",
};

// Color Constants
export const COLORS = {
  // Base colors for charts
  chart: [
    "#22c55e", // green
    "#eab308", // yellow
    "#ef4444", // red
    "#3b82f6", // blue
    "#8b5cf6", // purple
    "#ec4899", // pink
    "#10b981", // emerald
    "#f97316", // orange
    "#6366f1", // indigo
  ],
  // Status colors
  status: {
    approved: "#22c55e",
    pending: "#eab308",
    rejected: "#ef4444",
    completed: "#3b82f6",
    reviewing: "#8b5cf6",
  },
  // Priority colors
  priority: {
    high: "#ef4444",
    medium: "#eab308",
    low: "#22c55e",
  },
};

// Days of Week
export const DAYS_OF_WEEK = ["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"];

// Months
export const MONTHS = [
  "Oca",
  "Şub",
  "Mar",
  "Nis",
  "May",
  "Haz",
  "Tem",
  "Ağu",
  "Eyl",
  "Eki",
  "Kas",
  "Ara",
];

// Loading Delays (in ms) for development
export const LOADING_DELAYS = {
  short: 500,
  medium: 800,
  long: 1500,
};

// Pagination defaults
export const PAGINATION_DEFAULTS = {
  defaultLimit: 10,
  defaultPage: 1,
  pageSizeOptions: [5, 10, 25, 50, 100],
};

// Modal Types (for more semantic references)
export const MODAL_TYPES = {
  EVENT: "event" as ModalType,
  NEW_EVENT: "newEvent" as ModalType,
  NEWS: "newNews" as ModalType,
  ANNOUNCEMENT: "newAnnouncement" as ModalType,
  USER: "user" as ModalType,
  DAILY_EVENTS: "dailyEvents" as ModalType,
  ACTIVE_USERS: "activeUsers" as ModalType,
  TOTAL_PARTICIPANTS: "totalParticipants" as ModalType,
  REPORTED_USERS: "reportedUsers" as ModalType,
  REPORTED_EVENTS: "reportedEvents" as ModalType,
  ORG_EVENTS: "orgEvents" as ModalType,
};

// Common UI Text
export const UI_TEXT = {
  // Section Titles
  SECTION_TITLES: {
    OVERVIEW: "Genel Bakış",
    ANALYTICS: "Analitik",
    WEEKLY_PARTICIPATION: "Haftalık Katılım",
    TODAY_EVENTS: "Bugünkü Etkinlikler",
    RECENT_PARTICIPANTS: "Son Katılımcılar",
    PLATFORM_STATS: "Platform İstatistikleri",
    EVENT_ANALYSIS: "Etkinlik Analizi",
    USER_DISTRIBUTION: "Kullanıcı Dağılımı",
  },

  // Section Descriptions
  SECTION_DESCRIPTIONS: {
    OVERVIEW: "Genel bakış açıklaması",
    ANALYTICS: "Analitik açıklaması",
    WEEKLY_PARTICIPATION: "Haftalık katılım istatistikleri",
    TODAY_EVENTS: (date: string) => `${date} tarihli etkinlikler`,
    RECENT_PARTICIPANTS: "Son katılan kullanıcıların listesi",
    PLATFORM_STATS: "Platform genel istatistikleri",
    EVENT_ANALYSIS: "Etkinlik analiz ve istatistikleri",
    USER_DISTRIBUTION: "Kullanıcı dağılım ve istatistikleri",
  },

  // Button Text
  BUTTON_TEXT: {
    NEW_EVENT: "Yeni Etkinlik",
    PUBLISH_ANNOUNCEMENT: "Duyuru Yayınla",
    PUBLISH_NEWS: "Haber Yayınla",
    MANAGE_ALL_USERS: "Tüm Kullanıcıları Yönet",
    ORG_EVENTS: "Organizasyon Etkinlikleri",
    USER_STATS: "Kullanıcı İstatistikleri",
  },

  // Toast Messages
  TOAST: {
    EVENT_CREATED: {
      TITLE: "Etkinlik oluşturuldu",
      DESCRIPTION: (eventTitle: string) =>
        `"${eventTitle}" etkinliği başarıyla oluşturuldu.`,
    },
    REPORT_STATUS_UPDATED: {
      TITLE: "Rapor durumu güncellendi",
      DESCRIPTION: (status: string) =>
        `Rapor durumu ${status} olarak değiştirildi.`,
    },
  },

  // Stats Labels
  STATS: {
    ACTIVE_USERS: "Aktif Kullanıcılar",
    TOTAL_PARTICIPANTS: "Toplam Katılımcı",
    EVENT_FILL_RATE: "Etkinlik Doluluk Oranı",
    NEW_MEMBERS: (count: number) => `Son 30 günde +${count} yeni üye`,
    MONTHLY_PARTICIPANTS: "Son ayın toplam katılımcısı",
    AVG_PARTICIPATION: "Ortalama etkinlik katılım oranı",
  },
};
