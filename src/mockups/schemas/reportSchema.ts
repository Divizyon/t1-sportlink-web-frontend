/**
 * Report Schema
 *
 * This file defines the complete data structure for reports
 * used throughout the application.
 */

// Report status types
export type ReportStatus = "pending" | "reviewing" | "resolved" | "rejected";

// Report priority levels
export type ReportPriority = "low" | "medium" | "high";

// Entity types that can be reported
export type ReportEntityType = "user" | "event" | "comment" | "message";

// Base report interface
export interface Report {
  id: number | string;
  subject: string;
  description: string;
  reportedBy: string;
  reportedDate: string;
  priority: ReportPriority;
  status: ReportStatus;
  entityId: number | string;
  entityType: ReportEntityType;
  assignedTo?: string;
  resolution?: string;
  resolutionDate?: string;
  notes?: string[];
  attachments?: string[];
}

// Report statistics interface
export interface ReportStats {
  total: number;
  pending: number;
  reviewing: number;
  resolved: number;
  rejected: number;
  byPriority: {
    low: number;
    medium: number;
    high: number;
  };
  byEntityType: {
    user: number;
    event: number;
    comment: number;
    message: number;
  };
}

// Generate sample report data
const generateReports = (): Report[] => {
  const reports: Report[] = [
    {
      id: 1,
      subject: "Uygunsuz Davranış",
      description:
        "Katılımcı diğer kullanıcılara karşı uygunsuz davranışlarda bulundu",
      reportedBy: "Ahmet Yılmaz",
      reportedDate: "2023-08-25",
      priority: "high",
      status: "pending",
      entityId: 123,
      entityType: "user",
    },
    {
      id: 2,
      subject: "Yanıltıcı Etkinlik Bilgisi",
      description: "Etkinlik konumu yanlış belirtilmiş",
      reportedBy: "Mehmet Demir",
      reportedDate: "2023-08-24",
      priority: "medium",
      status: "reviewing",
      entityId: 456,
      entityType: "event",
    },
    {
      id: 3,
      subject: "Sahte Etkinlik",
      description: "Bu etkinlik bir dolandırıcılık girişimi olabilir",
      reportedBy: "Zeynep Kaya",
      reportedDate: "2023-08-23",
      priority: "high",
      status: "pending",
      entityId: 789,
      entityType: "event",
    },
    {
      id: 4,
      subject: "Yaş Sınırı İhlali",
      description: "18 yaş altı katılımcılar kabul edildi",
      reportedBy: "Cemil Özkan",
      reportedDate: "2023-08-22",
      priority: "high",
      status: "pending",
      entityId: 101,
      entityType: "event",
    },
    {
      id: 5,
      subject: "Taciz Raporu",
      description: "Kullanıcı mesajlarda taciz edici içerikler gönderdi",
      reportedBy: "Gül Akın",
      reportedDate: "2023-08-21",
      priority: "high",
      status: "reviewing",
      entityId: 456,
      entityType: "user",
    },
    {
      id: 6,
      subject: "Uygunsuz Profil Resmi",
      description: "Kullanıcının profil fotoğrafı uygunsuz içerik barındırıyor",
      reportedBy: "İbrahim Tatlıses",
      reportedDate: "2023-08-20",
      priority: "medium",
      status: "resolved",
      entityId: 789,
      entityType: "user",
      resolution: "Profil fotoğrafı kaldırıldı ve kullanıcı uyarıldı",
      resolutionDate: "2023-08-21",
      assignedTo: "Moderatör Ayşe",
    },
    {
      id: 7,
      subject: "Gerçekleşmeyen Etkinlik",
      description: "Etkinlik iptal edildi fakat bildirim yapılmadı",
      reportedBy: "Deniz Tuna",
      reportedDate: "2023-08-19",
      priority: "low",
      status: "rejected",
      entityId: 111,
      entityType: "event",
      resolution: "Etkinliğin doğal afet nedeniyle iptal edildiği doğrulandı",
      resolutionDate: "2023-08-20",
      assignedTo: "Moderatör Emre",
    },
    {
      id: 8,
      subject: "Sahte Konum",
      description: "Organizatör gerçekleştiği konumu yanlış belirtti",
      reportedBy: "Pınar Deniz",
      reportedDate: "2023-08-18",
      priority: "medium",
      status: "pending",
      entityId: 112,
      entityType: "event",
    },
  ];

  return reports;
};

// Calculate report statistics
const calculateReportStats = (reports: Report[]): ReportStats => {
  const stats: ReportStats = {
    total: reports.length,
    pending: 0,
    reviewing: 0,
    resolved: 0,
    rejected: 0,
    byPriority: {
      low: 0,
      medium: 0,
      high: 0,
    },
    byEntityType: {
      user: 0,
      event: 0,
      comment: 0,
      message: 0,
    },
  };

  reports.forEach((report) => {
    // Count by status
    stats[report.status]++;

    // Count by priority
    stats.byPriority[report.priority]++;

    // Count by entity type
    stats.byEntityType[report.entityType]++;
  });

  return stats;
};

// Export the complete report schema
export const REPORT_SCHEMA = {
  reports: generateReports(),
  stats: calculateReportStats(generateReports()),
};
