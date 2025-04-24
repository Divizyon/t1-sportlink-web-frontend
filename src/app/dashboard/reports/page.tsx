"use client";

import { useState, useEffect } from "react";
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
import { DASHBOARD_REPORTS } from "@/mocks/dashboard-reports";
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
import Cookies from "js-cookie";

export default function ReportsPage() {
  const { toast } = useToast();
  const [filter, setFilter] = useState<"all" | "users" | "events">("all");
  const [priorityFilter, setPriorityFilter] = useState<ReportPriority | "all">(
    "all"
  );
  const [statusFilter, setStatusFilter] = useState<ReportStatus | "all">("all");
  const [allReports, setAllReports] = useState<Report[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  // Default reports for fallback
  const defaultReports = DASHBOARD_REPORTS;

  // Fetch reports from API
  useEffect(() => {
    const fetchReports = async () => {
      try {
        setIsLoading(true);
        const apiUrl =
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";
        // Add authentication headers to the request
        const response = await fetch(`${apiUrl}/reports`, {
          headers: {
            Authorization: "Bearer " + Cookies.get("accessToken"),
            "Content-Type": "application/json",
          },
          credentials: "include", // Include cookies for session-based auth
        });

        // Immediately fall back to mock data if we get a 401
        if (response.status === 401) {
          console.warn(
            "Authentication failed (401 Unauthorized), using mock data"
          );
          setAllReports(defaultReports);
          setIsLoading(false);
          return;
        }

        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }

        const data = await response.json();
        console.log("API Response:", data);

        if (data.status === "success" && Array.isArray(data.data?.reports)) {
          // Map backend data to frontend format
          const mappedReports: Report[] = data.data.reports.map(
            (report: any) => ({
              id: report.id || Math.floor(Math.random() * 1000),
              entityId: report.entity_id || 0,
              entityType: report.entity_type === "USER" ? "user" : "event",
              subject: report.title || report.subject || "No subject",
              description: report.description || "No description",
              reportedBy: report.reporter_name || "Unknown User",
              reportedDate: safeDateFormat(report.created_at),
              priority: mapReportPriority(report.priority),
              status: mapReportStatus(report.status),
              reason:
                report.reason || report.description || "No reason provided",
              details:
                report.details || report.description || "No details provided",
              adminNote: report.admin_note || "",
              adminName: report.admin_name || "",
              adminActionDate: safeDateFormat(report.resolved_at),
              isBanned: report.is_banned || false,
            })
          );

          console.log("Mapped Reports:", mappedReports);
          setAllReports(mappedReports);
        } else {
          console.warn("API returned invalid format, using default reports");
          setAllReports(defaultReports);
        }
      } catch (err) {
        console.error("Error fetching reports:", err);
        setError(err instanceof Error ? err.message : "Unknown error");
        setAllReports(defaultReports); // Fallback to default reports
      } finally {
        setIsLoading(false);
      }
    };

    fetchReports();
  }, []);

  // Mapping functions for backend data
  const mapReportPriority = (backendPriority?: string): ReportPriority => {
    if (!backendPriority) return "medium";

    const priorityMap: Record<string, ReportPriority> = {
      HIGH: "high",
      MEDIUM: "medium",
      LOW: "low",
    };

    return priorityMap[backendPriority.toUpperCase()] || "medium";
  };

  const mapReportStatus = (backendStatus?: string): ReportStatus => {
    if (!backendStatus) return "pending";

    const statusMap: Record<string, ReportStatus> = {
      PENDING: "pending",
      REVIEWING: "reviewing",
      IN_REVIEW: "reviewing",
      RESOLVED: "resolved",
      REJECTED: "rejected",
    };

    return statusMap[backendStatus.toUpperCase()] || "pending";
  };

  // Helper function to safely format dates
  const safeDateFormat = (dateString?: string) => {
    if (!dateString) return "";
    try {
      // Make sure the date string is valid
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return ""; // Invalid date
      }
      return date.toISOString().split("T")[0];
    } catch (error) {
      console.error("Date formatting error:", error);
      return "";
    }
  };

  // Filtreleme işlemi
  const filteredReports = allReports.filter((report) => {
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
    console.log("Clicked report data:", report);
    setSelectedReport(report);
    setIsDetailModalOpen(true);
  };

  // Make sure modal doesn't open if report data is invalid
  useEffect(() => {
    if (selectedReport && isDetailModalOpen) {
      // Validate that required properties exist
      if (!selectedReport.id) {
        console.error("Invalid report data - missing ID", selectedReport);
        setIsDetailModalOpen(false);
        toast({
          title: "Hata",
          description: "Rapor detayları görüntülenemiyor",
          variant: "destructive",
        });
      }
    }
  }, [selectedReport, isDetailModalOpen]);

  const handleReportStatusChange = async (
    reportId: string,
    status: ReportStatus,
    adminNote?: string,
    banUser?: boolean
  ) => {
    try {
      // API çağrısı yapılacak
      const apiUrl =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";
      const response = await fetch(`${apiUrl}/reports/${reportId}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + Cookies.get("accessToken"),
        },
        body: JSON.stringify({
          status: status,
          admin_notes: adminNote,
        }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

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
      <div className="flex-1 space-y-4 p-4 md:p-6">
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
          <div className="flex flex-col md:flex-row justify-between gap-4">
            <TabsList className="w-full md:w-auto">
              <TabsTrigger value="all">Tüm Raporlar</TabsTrigger>
              <TabsTrigger value="users" className="relative">
                Kullanıcı Raporları
                <Badge className="ml-1 bg-red-600 text-[10px] px-1 h-4 min-w-4 absolute -top-1 -right-1">
                  {
                    allReports.filter(
                      (r) => r.entityType === "user" && r.status === "pending"
                    ).length
                  }
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="events" className="relative">
                Etkinlik Raporları
                <Badge className="ml-1 bg-red-600 text-[10px] px-1 h-4 min-w-4 absolute -top-1 -right-1">
                  {
                    allReports.filter(
                      (r) => r.entityType === "event" && r.status === "pending"
                    ).length
                  }
                </Badge>
              </TabsTrigger>
            </TabsList>

            <div className="flex flex-col md:flex-row gap-2 w-full md:w-auto">
              <Select
                value={priorityFilter}
                onValueChange={(value) =>
                  setPriorityFilter(value as ReportPriority | "all")
                }
              >
                <SelectTrigger className="w-full md:w-[150px]">
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
                <SelectTrigger className="w-full md:w-[150px]">
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

          <Card className="w-full overflow-x-auto">
            <CardHeader>
              <CardTitle>Gelen Raporlar ({filteredReports.length})</CardTitle>
              <CardDescription>
                {filter === "all"
                  ? "Tüm raporlar"
                  : filter === "users"
                  ? "Kullanıcı raporları"
                  : "Etkinlik raporları"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex justify-center items-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : error ? (
                <div className="text-center py-8 text-red-500">
                  <AlertTriangle className="mx-auto h-8 w-8 mb-2" />
                  <p>{error}</p>
                </div>
              ) : filteredReports.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <p>Bu kriterlere uygun rapor bulunamadı</p>
                </div>
              ) : (
                <div className="md:hidden space-y-4">
                  {filteredReports.map((report) => (
                    <Card key={report.id} className="w-full">
                      <CardContent className="p-4 space-y-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-medium">{report.subject}</h3>
                            <p className="text-sm text-muted-foreground">
                              {report.reportedBy}
                            </p>
                          </div>
                          {getStatusBadge(report.status)}
                        </div>
                        <div className="flex flex-wrap gap-2">
                          <Badge variant="outline">
                            {ENTITY_TYPE_LABELS[report.entityType]}
                          </Badge>
                          {getPriorityBadge(report.priority)}
                        </div>
                        <div className="flex justify-between items-center">
                          <p className="text-sm text-muted-foreground">
                            {new Date(report.reportedDate).toLocaleDateString(
                              "tr-TR"
                            )}
                          </p>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleReportClick(report)}
                          >
                            Detaylar
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}

              {/* Masaüstü görünüm için tablo yapısı */}
              <div className="hidden md:block">
                {!isLoading && !error && filteredReports.length > 0 && (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Konu</TableHead>
                        <TableHead>Tür</TableHead>
                        <TableHead>Raporlayan</TableHead>
                        <TableHead>Tarih</TableHead>
                        <TableHead>Öncelik</TableHead>
                        <TableHead>Durum</TableHead>
                        <TableHead className="text-right">İşlemler</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredReports.map((report) => (
                        <TableRow
                          key={report.id}
                          className="cursor-pointer hover:bg-muted/50"
                          onClick={() => handleReportClick(report)}
                        >
                          <TableCell className="font-mono text-xs text-muted-foreground">
                            #{report.id}
                          </TableCell>
                          <TableCell className="font-medium">
                            {report.subject}
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">
                              {ENTITY_TYPE_LABELS[report.entityType]}
                            </Badge>
                          </TableCell>
                          <TableCell>{report.reportedBy}</TableCell>
                          <TableCell>
                            {report.reportedDate
                              ? formatDate(report.reportedDate)
                              : "-"}
                          </TableCell>
                          <TableCell>
                            {getPriorityBadge(report.priority)}
                          </TableCell>
                          <TableCell>{getStatusBadge(report.status)}</TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleReportClick(report);
                              }}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </div>
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
              id: selectedReport.entityId
                ? selectedReport.entityId.toString()
                : "0",
              name: selectedReport.subject,
              avatar: undefined,
              date:
                selectedReport.entityType === "event" &&
                selectedReport.reportedDate
                  ? (() => {
                      try {
                        return new Date(
                          selectedReport.reportedDate
                        ).toLocaleDateString("tr-TR");
                      } catch (e) {
                        console.error("Error formatting date:", e);
                        return undefined;
                      }
                    })()
                  : undefined,
              email:
                selectedReport.entityType === "user"
                  ? selectedReport.reportedBy
                  : undefined,
            },
            reason:
              selectedReport.reason ||
              selectedReport.description ||
              "No reason provided",
            details:
              selectedReport.details ||
              selectedReport.description ||
              "No details available",
            status: selectedReport.status || "pending",
            severity: selectedReport.priority || "medium",
            createdAt: selectedReport.reportedDate || "",
            adminNote: selectedReport.adminNote || "",
            adminName: selectedReport.adminName || "",
            adminActionDate: selectedReport.adminActionDate || "",
            isBanned: selectedReport.isBanned || false,
          }}
          onStatusChange={handleReportStatusChange}
        />
      )}
    </div>
  );
}
