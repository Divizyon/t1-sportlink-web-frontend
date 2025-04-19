import { Report, ReportPriority, ReportStatus } from "@/types/dashboard";

/**
 * Mock report data used across the dashboard components
 */

// Report list (for reports tab and modals)
export const REPORTS: Report[] = [
  {
    id: 1,
    subject: "Uygunsuz İçerik",
    description: "Etkinlik açıklamasında uygunsuz içerik bulunuyor.",
    reportedBy: "Ahmet Yılmaz",
    reportedDate: "2023-07-15",
    entityType: "event",
    entityId: 101,
    priority: "high",
    status: "pending",
  },
  {
    id: 2,
    subject: "Taciz Edici Davranış",
    description: "Kullanıcı mesajlarda taciz edici davranışlarda bulunuyor.",
    reportedBy: "Ayşe Demir",
    reportedDate: "2023-07-14",
    entityType: "user",
    entityId: 203,
    priority: "high",
    status: "reviewing",
  },
  {
    id: 3,
    subject: "Yanlış Bilgi",
    description: "Etkinlik konumu yanlış belirtilmiş.",
    reportedBy: "Mehmet Can",
    reportedDate: "2023-07-12",
    entityType: "event",
    entityId: 105,
    priority: "medium",
    status: "pending",
  },
  {
    id: 4,
    subject: "Sahte Profil",
    description: "Bu hesap sahte olabilir.",
    reportedBy: "Zeynep Kaya",
    reportedDate: "2023-07-10",
    entityType: "user",
    entityId: 210,
    priority: "medium",
    status: "resolved",
  },
  {
    id: 5,
    subject: "Spam İçerik",
    description: "Etkinlik spam içeriği barındırıyor.",
    reportedBy: "Emre Güneş",
    reportedDate: "2023-07-08",
    entityType: "event",
    entityId: 112,
    priority: "low",
    status: "rejected",
  },
];

// Report statistics
export const REPORT_STATS = {
  totalReports: 142,
  pendingReports: 28,
  resolvedLastWeek: 23,
  averageResolutionTimeHours: 48,
};

// Report status distribution
export const REPORT_STATUS_COUNTS: { [key in ReportStatus]: number } = {
  pending: 28,
  reviewing: 15,
  resolved: 88,
  rejected: 11,
};

// Report priority distribution
export const REPORT_PRIORITY_COUNTS: { [key in ReportPriority]: number } = {
  high: 37,
  medium: 65,
  low: 40,
};
