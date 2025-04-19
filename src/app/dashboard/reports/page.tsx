"use client";

import { useState } from "react";
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
import { Flag, AlertTriangle, CheckCircle, XCircle, Eye } from "lucide-react";
import { UserNav } from "@/components/nav/UserNav";
import { useToast } from "@/components/ui/use-toast";
import Link from "next/link";
import { Report, ReportPriority, ReportStatus } from "@/types/dashboard";
import { DASHBOARD_REPORTS } from "@/mocks/dashboard-reports";

export default function ReportsPage() {
  const { toast } = useToast();
  const [filter, setFilter] = useState<"all" | "users" | "events">("all");
  const [priorityFilter, setPriorityFilter] = useState<ReportPriority | "all">(
    "all"
  );
  const [statusFilter, setStatusFilter] = useState<ReportStatus | "all">("all");

  // Filtreleme işlemi
  const filteredReports = DASHBOARD_REPORTS.filter((report) => {
    // Tür filtreleme
    if (filter !== "all" && report.entityType !== filter.slice(0, -1)) {
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
        return <Badge variant="destructive">Yüksek</Badge>;
      case "medium":
        return <Badge variant="default">Orta</Badge>;
      case "low":
        return <Badge variant="outline">Düşük</Badge>;
    }
  };

  const getStatusBadge = (status: ReportStatus) => {
    switch (status) {
      case "pending":
        return <Badge className="bg-yellow-500">Beklemede</Badge>;
      case "reviewing":
        return <Badge className="bg-blue-500">İnceleniyor</Badge>;
      case "resolved":
        return <Badge className="bg-green-500">Çözüldü</Badge>;
      case "rejected":
        return <Badge className="bg-gray-500">Reddedildi</Badge>;
    }
  };

  const handleStatusChange = (reportId: number, newStatus: ReportStatus) => {
    // Normalde API'ye istek atılacak
    toast({
      title: "Durum Güncellendi",
      description: `Rapor durumu ${newStatus} olarak güncellendi`,
    });
  };

  return (
    <div className="flex min-h-screen flex-col">
      <div className="border-b">
        <div className="flex h-16 items-center px-4">
          <h1 className="text-xl font-bold">Sport Link</h1>
          <div className="ml-auto flex items-center">
            <UserNav />
          </div>
        </div>
      </div>
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">Raporlar</h2>
          <div className="flex items-center space-x-2">
            <Button variant="outline" asChild>
              <Link href="/dashboard">Anasayfa</Link>
            </Button>
          </div>
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
                  <SelectItem value="high">Yüksek</SelectItem>
                  <SelectItem value="medium">Orta</SelectItem>
                  <SelectItem value="low">Düşük</SelectItem>
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
                  <SelectItem value="pending">Beklemede</SelectItem>
                  <SelectItem value="reviewing">İnceleniyor</SelectItem>
                  <SelectItem value="resolved">Çözüldü</SelectItem>
                  <SelectItem value="rejected">Reddedildi</SelectItem>
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
                    <TableRow key={report.id}>
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
                        {report.entityType === "user"
                          ? "Kullanıcı"
                          : "Etkinlik"}
                      </TableCell>
                      <TableCell>{getPriorityBadge(report.priority)}</TableCell>
                      <TableCell>{getStatusBadge(report.status)}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm" asChild>
                            <Link
                              href={`/dashboard/${
                                report.entityType === "user"
                                  ? "users"
                                  : "events"
                              }/${report.entityId}`}
                            >
                              <Eye className="h-4 w-4" />
                            </Link>
                          </Button>
                          {report.status === "pending" && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                handleStatusChange(report.id, "reviewing")
                              }
                            >
                              <AlertTriangle className="h-4 w-4 text-yellow-500" />
                            </Button>
                          )}
                          {(report.status === "pending" ||
                            report.status === "reviewing") && (
                            <>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                  handleStatusChange(report.id, "resolved")
                                }
                              >
                                <CheckCircle className="h-4 w-4 text-green-500" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                  handleStatusChange(report.id, "rejected")
                                }
                              >
                                <XCircle className="h-4 w-4 text-red-500" />
                              </Button>
                            </>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </Tabs>
      </div>
    </div>
  );
}
