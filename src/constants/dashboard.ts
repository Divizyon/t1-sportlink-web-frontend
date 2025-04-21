/**
 * Dashboard Constants
 *
 * This file contains centralized constants for the dashboard component including
 * labels, status values, and configuration settings.
 */

import {
  EventStatus,
  ReportPriority,
  ReportStatus,
  DashboardTabValue,
  ModalType,
  ReportFilterType,
  EventCategory,
  UserRole,
  TabType,
} from "@/types";
import { REPORT_FILTERS, REPORT_FILTER_LABELS } from "@/mockups";

// User Roles and Dashboard Access
export const DASHBOARD_ADMIN_ROLES: UserRole[] = [
  "admin",
  "director",
  "staff",
  "head_coach",
  "coach",
];

// Event Categories for Filtering
export const EVENT_CATEGORIES = {
  all: "all",
  tournament: "tournament",
  training: "training",
  meeting: "meeting",
  sport: "sport",
  social: "social",
  workshop: "workshop",
  competition: "competition",
  match: "match",
  other: "other",
};

// Export here to keep backward compatibility
export { REPORT_FILTERS, REPORT_FILTER_LABELS };

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
export const DASHBOARD_TABS: Record<TabType, TabType> = {
  overview: "overview",
  reports: "reports",
  events: "events",
  users: "users",
  messages: "messages",
  notifications: "notifications",
  analytics: "analytics",
  settings: "settings",
};

// Dashboard Tab Labels
export const DASHBOARD_TAB_LABELS: Record<TabType, string> = {
  overview: "Genel Bakış",
  reports: "Raporlar",
  events: "Etkinlikler",
  users: "Kullanıcılar",
  messages: "Mesajlar",
  notifications: "Bildirimler",
  analytics: "Analizler",
  settings: "Ayarlar",
};

// Status Labels for Dashboard Items
export const DASHBOARD_STATUS_LABELS = {
  pending: "Beklemede",
  processing: "İşleniyor",
  resolved: "Çözüldü",
  approved: "Onaylandı",
  rejected: "Reddedildi",
};

// Modal Types for Dashboard
export const DASHBOARD_MODAL_TYPES = {
  newReport: "newReport",
  viewReport: "viewReport",
  editReport: "editReport",
  deleteReport: "deleteReport",
  newEvent: "newEvent",
  viewEvent: "viewEvent",
  editEvent: "editEvent",
  deleteEvent: "deleteEvent",
  sendMessage: "sendMessage",
  viewMessage: "viewMessage",
  newUser: "newUser",
  viewUser: "viewUser",
  editUser: "editUser",
  deleteUser: "deleteUser",
  newNotification: "newNotification",
  viewNotification: "viewNotification",
  settings: "settings",
};

// Event Category Labels for UI
export const EVENT_CATEGORY_LABELS = {
  all: "Tüm Etkinlikler",
  tournament: "Turnuvalar",
  training: "Antrenmanlar",
  meeting: "Toplantılar",
  sport: "Spor Etkinlikleri",
  social: "Sosyal Etkinlikler",
  workshop: "Atölyeler",
  competition: "Yarışmalar",
  match: "Maçlar",
  other: "Diğer",
};

// Modal Labels for Dashboard
export const DASHBOARD_MODAL_LABELS = {
  newReport: "Yeni Rapor Oluştur",
  viewReport: "Raporu Görüntüle",
  editReport: "Raporu Düzenle",
  deleteReport: "Raporu Sil",
  newEvent: "Yeni Etkinlik Oluştur",
  viewEvent: "Etkinliği Görüntüle",
  editEvent: "Etkinliği Düzenle",
  deleteEvent: "Etkinliği Sil",
  sendMessage: "Mesaj Gönder",
  viewMessage: "Mesajı Görüntüle",
  newUser: "Yeni Kullanıcı Oluştur",
  viewUser: "Kullanıcıyı Görüntüle",
  editUser: "Kullanıcıyı Düzenle",
  deleteUser: "Kullanıcıyı Sil",
  newNotification: "Yeni Bildirim Oluştur",
  viewNotification: "Bildirimi Görüntüle",
  settings: "Ayarlar",
};

// Dashboard Settings
export const DASHBOARD_SETTINGS = {
  itemsPerPage: 10,
  defaultTab: DASHBOARD_TABS.overview,
  defaultFilter: REPORT_FILTERS.all,
  defaultCategory: EVENT_CATEGORIES.all,
  refreshInterval: 60000, // 1 minute in milliseconds
};

// Dashboard UI Text
export const DASHBOARD_UI_TEXT = {
  noReports: "Henüz rapor bulunmamaktadır.",
  noEvents: "Henüz etkinlik bulunmamaktadır.",
  noUsers: "Henüz kullanıcı bulunmamaktadır.",
  noMessages: "Henüz mesaj bulunmamaktadır.",
  noNotifications: "Henüz bildirim bulunmamaktadır.",
  loadMore: "Daha Fazla Yükle",
  search: "Ara...",
  filter: "Filtrele",
  sort: "Sırala",
  create: "Oluştur",
  edit: "Düzenle",
  delete: "Sil",
  view: "Görüntüle",
  save: "Kaydet",
  cancel: "İptal",
  confirm: "Onayla",
  loading: "Yükleniyor...",
  error: "Bir hata oluştu. Lütfen daha sonra tekrar deneyin.",
  success: "İşlem başarıyla tamamlandı.",
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
