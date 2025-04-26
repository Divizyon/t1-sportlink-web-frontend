"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Flag } from "lucide-react";
import { format } from "date-fns";
import { tr } from "date-fns/locale";
import axios from "axios";
import Cookies from "js-cookie";
import { ReportDetailModal } from "@/components/modals/ReportDetailModal";

interface Report {
  id: string;
  konu: string;
  raporlayan: string;
  tarih: string;
  tur: "Kullanıcı" | "Etkinlik";
  oncelik: "Yüksek" | "Orta" | "Düşük";
  durum: "Beklemede" | "İnceleniyor" | "Çözüldü" | "Reddedildi";
  reporter_id: string;
  event_id?: string;
  report_reason: string;
  report_date: string;
  status: string;
  admin_notes?: string;
}

interface DetailReport {
  id: string;
  type: "user" | "event";
  title: string;
  reporter: {
    id: string;
    name: string;
    avatar?: string;
  };
  reportedItem: {
    id: string;
    name: string;
    avatar?: string;
    date?: string;
    email?: string;
    reportCount?: number;
  };
  reason: string;
  details: string;
  status: "pending" | "reviewing" | "resolved" | "rejected" | "dismissed";
  severity: "high" | "medium" | "low";
  createdAt: string;
  adminNote: string;
  adminName: string;
  isBanned?: boolean;
}

interface RecentReportsProps {
  onReportSelect: (report: Report) => void;
}

export function RecentReports({ onReportSelect }: RecentReportsProps) {
  const [loading, setLoading] = useState(true);
  const [reports, setReports] = useState<Report[]>([]);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      setLoading(true);
      
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
      const response = await fetch(`${baseUrl.replace('/api', '')}/api/reports`, {
        headers: {
          Authorization: "Bearer " + Cookies.get("accessToken"),
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.status === "success" && Array.isArray(data.data.reports)) {
        console.log("API'den gelen raporlar:", data.data.reports);
        // Son 5 raporu al ve tarihe göre sırala
        const latestReports = data.data.reports
          .sort((a: any, b: any) => 
            new Date(b.report_date).getTime() - new Date(a.report_date).getTime()
          )
          .slice(0, 5)
          .map((report: any) => ({
            id: report.id,
            konu: report.konu,
            raporlayan: report.raporlayan,
            tarih: report.tarih,
            tur: report.tur,
            oncelik: report.oncelik,
            durum: report.durum,
            reporter_id: report.reporter_id,
            event_id: report.event_id,
            report_reason: report.report_reason,
            report_date: report.report_date,
            status: report.status,
            admin_notes: report.admin_notes
          }));

        setReports(latestReports);
      }
    } catch (error) {
      console.error("Raporlar yüklenirken hata:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (
    reportId: string,
    newStatus: string,
    adminNote?: string,
    banUser?: boolean
  ) => {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
      const response = await fetch(`${baseUrl.replace('/api', '')}/api/reports/${reportId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${Cookies.get('accessToken')}`,
        },
        body: JSON.stringify({
          status: newStatus,
          admin_notes: adminNote,
          is_banned: banUser,
        }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      // Raporları güncelle
      setReports(prevReports =>
        prevReports.map(report =>
          report.id === reportId
            ? {
                ...report,
                status: newStatus,
                admin_notes: adminNote,
              }
            : report
        )
      );

      // Seçili raporu güncelle
      if (selectedReport && selectedReport.id === reportId) {
        setSelectedReport(prev => prev ? {
          ...prev,
          status: newStatus,
          admin_notes: adminNote,
        } : null);
      }
    } catch (error) {
      console.error('Rapor durumu güncellenirken hata:', error);
    }
  };

  const getStatusBadge = (durum: string) => {
    switch (durum) {
      case "Beklemede":
        return (
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
            Beklemede
          </Badge>
        );
      case "İnceleniyor":
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            İnceleniyor
          </Badge>
        );
      case "Çözüldü":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            Çözüldü
          </Badge>
        );
      case "Reddedildi":
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
            Reddedildi
          </Badge>
        );
      default:
        return null;
    }
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return "Geçersiz Tarih";
      }
      return format(date, "d MMMM yyyy", { locale: tr });
    } catch {
      return "Geçersiz Tarih";
    }
  };

  const mapReportToModalFormat = (report: Report) => {
    const statusMap: Record<string, "pending" | "reviewing" | "resolved" | "rejected" | "dismissed"> = {
      "Beklemede": "pending",
      "İnceleniyor": "reviewing",
      "Çözüldü": "resolved",
      "Reddedildi": "rejected"
    };

    const severityMap: Record<string, "high" | "medium" | "low"> = {
      "Yüksek": "high",
      "Orta": "medium",
      "Düşük": "low"
    };

    const modalReport = {
      id: report.id,
      type: report.tur === "Kullanıcı" ? ("user" as const) : ("event" as const),
      title: report.konu,
      reporter: {
        id: report.reporter_id,
        name: report.raporlayan,
        avatar: undefined,
      },
      reportedItem: {
        id: report.event_id || "0",
        name: report.konu,
        avatar: undefined,
        date: report.tarih,
        email: report.tur === "Kullanıcı" ? report.raporlayan : undefined,
        reportCount: undefined,
      },
      reason: report.report_reason,
      details: report.report_reason,
      status: statusMap[report.durum] || "pending",
      severity: severityMap[report.oncelik] || "medium",
      createdAt: report.report_date,
      adminNote: report.admin_notes || "",
      adminName: "",
      isBanned: false
    } as const;

    return modalReport;
  };

  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3, 4, 5].map((index) => (
          <div key={index} className="flex items-center gap-3">
            <Skeleton className="h-9 w-9 rounded-full" />
            <div className="space-y-1 flex-1">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-3 w-32" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <>
      <div className="space-y-3">
        {reports.length === 0 ? (
          <div className="text-center text-muted-foreground py-4">
            Henüz rapor bulunmuyor
          </div>
        ) : (
          reports.map((report) => (
            <div
              key={report.id}
              className="flex items-center justify-between px-4 py-2 hover:bg-muted/50 cursor-pointer transition-colors"
              onClick={() => {
                setSelectedReport(report);
                setIsDetailModalOpen(true);
              }}
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <Flag className="h-4 w-4 text-muted-foreground" />
                  <p className="text-sm font-medium leading-none truncate">
                    {report.konu}
                  </p>
                </div>
                <div className="flex items-center gap-2 mt-0.5">
                  <p className="text-xs text-muted-foreground">
                    {formatDate(report.report_date || report.tarih)}
                  </p>
                  <span className="text-xs text-muted-foreground">•</span>
                  <p className="text-xs text-muted-foreground">
                    {report.raporlayan}
                  </p>
                </div>
              </div>
              <div className="ml-3">
                {getStatusBadge(report.durum)}
              </div>
            </div>
          ))
        )}
      </div>

      {selectedReport && (
        <ReportDetailModal
          open={isDetailModalOpen}
          onOpenChange={setIsDetailModalOpen}
          report={mapReportToModalFormat(selectedReport)}
          onStatusChange={handleStatusChange}
        />
      )}
    </>
  );
} 