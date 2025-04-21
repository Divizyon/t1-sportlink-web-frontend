/**
 * Dashboard Settings Mockup
 *
 * Bu dosya dashboard ile ilgili ayarlar ve sabitler içerir.
 * Önceden constants klasöründe bulunan değerleri artık mockups'tan alıyoruz.
 */

import { DashboardTabValue, ReportFilterType } from "@/types";

// Dashboard Tab Values - önceden constants/dashboard.ts'de bulunuyordu
export const DASHBOARD_TABS = {
  overview: "overview",
  analytics: "analytics",
} as const;

// Dashboard Tab Labels - önceden constants/dashboard.ts'de bulunuyordu
export const DASHBOARD_TAB_LABELS = {
  overview: "Genel Bakış",
  analytics: "Analitik",
} as const;

// Report Filter Values - önceden constants/dashboard.ts'de bulunuyordu
export const REPORT_FILTERS: Record<ReportFilterType, ReportFilterType> = {
  all: "all",
  users: "users",
  events: "events",
};

// Report Filter Labels - önceden constants/dashboard.ts'de bulunuyordu
export const REPORT_FILTER_LABELS: Record<ReportFilterType, string> = {
  all: "Tüm Raporlar",
  users: "Kullanıcı Raporları",
  events: "Etkinlik Raporları",
};

// Modal Types (for more semantic references) - önceden constants/dashboard.ts'de bulunuyordu
export const MODAL_TYPES = {
  EVENT: "event",
  NEW_EVENT: "newEvent",
  NEWS: "newNews",
  ANNOUNCEMENT: "newAnnouncement",
  USER: "user",
  DAILY_EVENTS: "dailyEvents",
  ACTIVE_USERS: "activeUsers",
  TOTAL_PARTICIPANTS: "totalParticipants",
  REPORTED_USERS: "reportedUsers",
  REPORTED_EVENTS: "reportedEvents",
  ORG_EVENTS: "orgEvents",
};

// Common UI Text - önceden constants/dashboard.ts'de bulunuyordu
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
