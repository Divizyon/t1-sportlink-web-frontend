/**
 * Dashboard Settings Mockups
 *
 * Bu dosya, dashboard bileşenlerinde kullanılan tüm statik UI ayarlarını ve etiketlerini içerir.
 * Dashboard sekmeler, modal tipleri, filtreler ve UI metinleri burada tanımlanmıştır.
 *
 * Bu veri yapıları, arayüzün nasıl görüneceğini tanımlamak için kullanılır ve backend API entegrasyonuyla
 * büyük ölçüde değişmesi beklenmez. Yine de, bazı dinamik UI yapılandırmaları backend'den alınabilir.
 */

import {
  DashboardTabValue,
  ModalType,
  TabType,
  ReportFilterType,
} from "@/types";

// Dashboard Tab Values - Arayüz sekme değerleri
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

// Dashboard Tab Labels - Arayüz sekmelerinin görünen isimleri
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

// Modal Types for Dashboard - Dashboard'daki tüm modal tipleri
export const MODAL_TYPES: Record<string, string> = {
  // Yeni modal tipleri
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

  // Eskiden kullanılan modal tipleri (geriye uyumluluk için)
  EVENT: "viewEvent",
  USER: "viewUser",
  DAILY_EVENTS: "viewEvent",
  ORG_EVENTS: "viewEvent",
  REPORTED_USERS: "viewReport",
  REPORTED_EVENTS: "viewReport",
  NEW_EVENT: "newEvent",
  ANNOUNCEMENT: "newNotification",
  NEWS: "newNotification",
};

// Dashboard Modal Labels - Modal başlıkları
export const MODAL_LABELS: Record<string, string> = {
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

  // Eskiden kullanılan modal tipleri için etiketler
  EVENT: "Etkinliği Görüntüle",
  USER: "Kullanıcıyı Görüntüle",
  DAILY_EVENTS: "Bugünkü Etkinlikler",
  ORG_EVENTS: "Organizasyon Etkinlikleri",
  REPORTED_USERS: "Bildirilen Kullanıcılar",
  REPORTED_EVENTS: "Bildirilen Etkinlikler",
  NEW_EVENT: "Yeni Etkinlik Oluştur",
  ANNOUNCEMENT: "Duyuru Yayınla",
  NEWS: "Haber Yayınla",
};

// Status Labels for Dashboard Items - Dashboard öğeleri için durum etiketleri
export const DASHBOARD_STATUS_LABELS = {
  pending: "Beklemede",
  processing: "İşleniyor",
  resolved: "Çözüldü",
  approved: "Onaylandı",
  rejected: "Reddedildi",
};

// Dashboard UI Text - UI metinleri
export const UI_TEXT = {
  noReports: "Henüz rapor bulunmamaktadır.",
  noEvents: "Henüz etkinlik bulunmamaktadır.",
  noUsers: "Henüz kullanıcı bulunmamaktadır.",
  noMessages: "Henüz mesaj bulunmamaktadır.",
  noNotifications: "Henüz bildirim bulunmamaktadır.",
  loadingReports: "Raporlar yükleniyor...",
  loadingEvents: "Etkinlikler yükleniyor...",
  loadingUsers: "Kullanıcılar yükleniyor...",
  loadingMessages: "Mesajlar yükleniyor...",
  loadingNotifications: "Bildirimler yükleniyor...",
  loadingAnalytics: "Analiz verileri yükleniyor...",
  emptySearch: "Arama sonucu bulunamadı.",
  serverError: "Sunucu hatası oluştu. Lütfen daha sonra tekrar deneyin.",
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
  BUTTON_TEXT: {
    NEW_EVENT: "Yeni Etkinlik Oluştur",
    PUBLISH_ANNOUNCEMENT: "Duyuru Yayınla",
    PUBLISH_NEWS: "Haber Yayınla",
    ORG_EVENTS: "Tüm Organizasyon Etkinlikleri",
    MANAGE_ALL_USERS: "Tüm Kullanıcıları Yönet",
  },
  SECTION_TITLES: {
    WEEKLY_PARTICIPATION: "Haftalık Katılım",
    TODAY_EVENTS: "Bugünkü Etkinlikler",
    RECENT_PARTICIPANTS: "Son Katılımcılar",
    PLATFORM_STATS: "Platform İstatistikleri",
    EVENT_ANALYSIS: "Etkinlik Analizi",
    USER_DISTRIBUTION: "Kullanıcı Dağılımı",
  },
  SECTION_DESCRIPTIONS: {
    WEEKLY_PARTICIPATION: "Son 7 gündeki etkinliklere katılım oranları",
    TODAY_EVENTS: (date: string) =>
      `${date} tarihinde gerçekleşecek etkinlikler`,
    RECENT_PARTICIPANTS: "Son katılan kullanıcılar",
    PLATFORM_STATS: "Genel platform istatistikleri",
    EVENT_ANALYSIS: "Aylık etkinlik istatistikleri",
    USER_DISTRIBUTION: "Kullanıcı dağılım istatistikleri",
  },
  STATS: {
    ACTIVE_USERS: "Aktif Kullanıcılar",
    NEW_MEMBERS: (count: number) => `Bu ay ${count} yeni üye`,
    TOTAL_PARTICIPANTS: "Toplam Katılımcılar",
    MONTHLY_PARTICIPANTS: "Son 30 günde etkinliklere katılan kullanıcı sayısı",
    EVENT_FILL_RATE: "Etkinlik Doluluk Oranı",
    AVG_PARTICIPATION: "Etkinliklerin ortalama doluluk oranı",
  },
};

// Report filters - Rapor filtreleri
export const REPORT_FILTERS: Record<ReportFilterType, ReportFilterType> = {
  all: "all",
  pending: "pending",
  reviewing: "reviewing",
  resolved: "resolved",
  rejected: "rejected",
  dismissed: "dismissed",
  highPriority: "highPriority",
};

// Report filter labels - Rapor filtre etiketleri
export const REPORT_FILTER_LABELS: Record<ReportFilterType, string> = {
  all: "Tüm Raporlar",
  pending: "Beklemede",
  reviewing: "İnceleniyor",
  resolved: "Çözüldü",
  rejected: "Reddedildi",
  dismissed: "Kapatıldı",
  highPriority: "Yüksek Öncelikli",
};
