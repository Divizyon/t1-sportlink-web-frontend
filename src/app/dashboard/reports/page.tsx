"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Flag,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Eye,
  ChevronRight,
} from "lucide-react";
import { UserNav } from "@/components/nav/UserNav";
import { useToast } from "@/components/ui/use-toast";
import Link from "next/link";
import { Report, ReportPriority, ReportStatus } from "@/types/dashboard";
import {
  RECENT_DASHBOARD_REPORTS,
  DashboardReport,
} from "@/mockups/components/dashboard/dashboardReports";
import {
  DASHBOARD_TAB_LABELS,
  ENTITY_TYPE_LABELS,
  REPORT_PRIORITY_LABELS,
  REPORT_STATUS_LABELS,
  UI_TEXT,
  REPORT_FILTER_LABELS,
  REPORT_FILTERS,
} from "@/constants/dashboard";
import { ReportDetailModal } from "@/components/modals/ReportDetailModal";
import { formatDate } from "@/lib/utils";

// Convert the DashboardReport to Report type
const DASHBOARD_REPORTS: Report[] = RECENT_DASHBOARD_REPORTS.map((report) => ({
  ...report,
  id:
    typeof report.id === "string" ? parseInt(report.id) : (report.id as number),
  entityId: 0, // Default value since DashboardReport doesn't have entityId
  entityType: report.entityType as "user" | "event",
  status: report.status as ReportStatus, // Handle any type differences
}));

export default function ReportsPage() {
  const { toast } = useToast();
  const [filter, setFilter] = useState<"all" | "users" | "events">("all");
  const [priorityFilter, setPriorityFilter] = useState<ReportPriority | "all">(
    "all"
  );
  const [statusFilter, setStatusFilter] = useState<ReportStatus | "all">("all");
  const [allReports, setAllReports] = useState<Report[]>(DASHBOARD_REPORTS);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  // Filtreleme işlemi
  const filteredReports = DASHBOARD_REPORTS.filter((report) => {
    // Tür filtreleme
    if (
      filter !== REPORT_FILTERS.all &&
      report.entityType !== filter.slice(0, -1)
    ) {
      return false;
    }

    // Öncelik filtreleme
    if (priorityFilter !== "all" && report.priority !== priorityFilter) {
      return false;
    }

    // Durum filtreleme
    if (statusFilter !== "all" && report.status !== statusFilter) {
      return false;
    }

    return true;
  });

  const getPriorityBadge = (priority: ReportPriority) => {
    switch (priority) {
      case "high":
        return (
          <Badge variant="destructive">{REPORT_PRIORITY_LABELS.high}</Badge>
        );
      case "medium":
        return <Badge variant="default">{REPORT_PRIORITY_LABELS.medium}</Badge>;
      case "low":
        return <Badge variant="outline">{REPORT_PRIORITY_LABELS.low}</Badge>;
    }
  };

  const getStatusBadge = (status: ReportStatus) => {
    switch (status) {
      case "pending":
        return (
          <Badge className="bg-yellow-500">
            {REPORT_STATUS_LABELS.pending}
          </Badge>
        );
      case "reviewing":
        return (
          <Badge className="bg-blue-500">
            {REPORT_STATUS_LABELS.reviewing}
          </Badge>
        );
      case "resolved":
        return (
          <Badge className="bg-green-500">
            {REPORT_STATUS_LABELS.resolved}
          </Badge>
        );
      case "rejected":
        return (
          <Badge className="bg-gray-500">{REPORT_STATUS_LABELS.rejected}</Badge>
        );
    }
  };

  const handleReportClick = (report: Report) => {
    setSelectedReport(report);
    setIsDetailModalOpen(true);
  };

  const handleReportStatusChange = async (
    reportId: string,
    status: ReportStatus,
    adminNote?: string,
    banUser?: boolean
  ) => {
    try {
      // API çağrısı yapılacak
      const updatedReports = allReports.map((report) => {
        if (report.id.toString() === reportId) {
          return {
            ...report,
            status,
            adminNote,
            adminName: "Admin User", // Gerçek admin kullanıcı adı buraya gelecek
            adminActionDate: new Date().toISOString(),
            isBanned: banUser || false,
          };
        }
        return report;
      });

      setAllReports(updatedReports);
      toast({
        title: "Başarılı",
        description: `Rapor ${
          status === "resolved" ? "çözüldü" : "reddedildi"
        }`,
      });
    } catch (error) {
      toast({
        title: "Hata",
        description: "Bir hata oluştu",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">Raporlar</h2>
        </div>

        <Tabs
          defaultValue="all"
          className="space-y-4"
          onValueChange={(value) =>
            setFilter(value as "all" | "users" | "events")
          }
        >
          <div className="flex justify-between">
            <TabsList>
              <TabsTrigger value="all">Tüm Raporlar</TabsTrigger>
              <TabsTrigger value="users" className="relative">
                Kullanıcı Raporları
                <Badge className="ml-1 bg-red-600 text-[10px] px-1 h-4 min-w-4 absolute -top-1 -right-1">
                  {
                    DASHBOARD_REPORTS.filter(
                      (r) => r.entityType === "user" && r.status === "pending"
                    ).length
                  }
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="events" className="relative">
                Etkinlik Raporları
                <Badge className="ml-1 bg-red-600 text-[10px] px-1 h-4 min-w-4 absolute -top-1 -right-1">
                  {
                    DASHBOARD_REPORTS.filter(
                      (r) => r.entityType === "event" && r.status === "pending"
                    ).length
                  }
                </Badge>
              </TabsTrigger>
            </TabsList>

            <div className="flex space-x-2">
              <Select
                value={priorityFilter}
                onValueChange={(value) =>
                  setPriorityFilter(value as ReportPriority | "all")
                }
              >
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Öncelik Filtrele" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tüm Öncelikler</SelectItem>
                  <SelectItem value="high">
                    {REPORT_PRIORITY_LABELS.high}
                  </SelectItem>
                  <SelectItem value="medium">
                    {REPORT_PRIORITY_LABELS.medium}
                  </SelectItem>
                  <SelectItem value="low">
                    {REPORT_PRIORITY_LABELS.low}
                  </SelectItem>
                </SelectContent>
              </Select>

              <Select
                value={statusFilter}
                onValueChange={(value) =>
                  setStatusFilter(value as ReportStatus | "all")
                }
              >
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Durum Filtrele" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tüm Durumlar</SelectItem>
                  <SelectItem value="pending">
                    {REPORT_STATUS_LABELS.pending}
                  </SelectItem>
                  <SelectItem value="reviewing">
                    {REPORT_STATUS_LABELS.reviewing}
                  </SelectItem>
                  <SelectItem value="resolved">
                    {REPORT_STATUS_LABELS.resolved}
                  </SelectItem>
                  <SelectItem value="rejected">
                    {REPORT_STATUS_LABELS.rejected}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Gelen Raporlar ({filteredReports.length})</CardTitle>
              <CardDescription>
                İncelemeniz gereken rapor ve bildirimler
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Konu</TableHead>
                    <TableHead>Raporlayan</TableHead>
                    <TableHead>Tarih</TableHead>
                    <TableHead>Tür</TableHead>
                    <TableHead>Öncelik</TableHead>
                    <TableHead>Durum</TableHead>
                    <TableHead>İşlemler</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredReports.map((report) => (
                    <TableRow
                      key={report.id}
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => handleReportClick(report)}
                    >
                      <TableCell className="font-medium">
                        {report.subject}
                      </TableCell>
                      <TableCell>{report.reportedBy}</TableCell>
                      <TableCell>
                        {new Date(report.reportedDate).toLocaleDateString(
                          "tr-TR"
                        )}
                      </TableCell>
                      <TableCell>
                        {ENTITY_TYPE_LABELS[report.entityType]}
                      </TableCell>
                      <TableCell>{getPriorityBadge(report.priority)}</TableCell>
                      <TableCell>{getStatusBadge(report.status)}</TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleReportClick(report);
                          }}
                        >
                          Detaylar
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </Tabs>
      </div>

      {selectedReport && (
        <ReportDetailModal
          open={isDetailModalOpen}
          onOpenChange={setIsDetailModalOpen}
          report={{
            id: selectedReport.id.toString(),
            type: selectedReport.entityType === "event" ? "event" : "user",
            title: selectedReport.subject,
            reporter: {
              id: selectedReport.reportedBy,
              name: selectedReport.reportedBy,
              avatar: undefined,
            },
            reportedItem: {
              id: selectedReport.entityId.toString(),
              name: selectedReport.subject,
              avatar: undefined,
              date:
                selectedReport.entityType === "event"
                  ? new Date(selectedReport.reportedDate).toLocaleDateString(
                      "tr-TR"
                    )
                  : undefined,
              email:
                selectedReport.entityType === "user"
                  ? selectedReport.reportedBy
                  : undefined,
            },
            reason: selectedReport.reason || selectedReport.description,
            details: selectedReport.details || selectedReport.description,
            status: selectedReport.status,
            severity: selectedReport.priority,
            createdAt: selectedReport.reportedDate,
            adminNote: selectedReport.adminNote,
            adminName: selectedReport.adminName,
            adminActionDate: selectedReport.adminActionDate,
            isBanned: selectedReport.isBanned,
          }}
          onStatusChange={handleReportStatusChange}
        />
      )}
    </div>
  );
}
