"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
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
import { Flag, AlertTriangle, CheckCircle, XCircle, Eye, ChevronRight, Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useReports } from "@/hooks/useReports";

export default function ReportsPage() {
  const { toast } = useToast();
  const [selectedReport, setSelectedReport] = useState<string | null>(null);
  const [adminNotes, setAdminNotes] = useState("");
  
  const { reports, loading, filters, applyFilters, updateReportStatus, updateReportNotes } = useReports();

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "Yüksek":
        return <Badge variant="destructive">Yüksek</Badge>;
      case "Orta":
        return <Badge variant="default">Orta</Badge>;
      case "Düşük":
        return <Badge variant="outline">Düşük</Badge>;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PENDING":
        return <Badge className="bg-yellow-500">Beklemede</Badge>;
      case "RESOLVED":
        return <Badge className="bg-green-500">Çözüldü</Badge>;
      case "DISMISSED":
        return <Badge className="bg-gray-500">Reddedildi</Badge>;
    }
  };

  const handleReportClick = (reportId: string) => {
    setSelectedReport(reportId);
    const report = reports.find(r => r.id === reportId);
    if (report) {
      setAdminNotes(report.admin_notes || "");
    }
  };

  const handleStatusChange = async (reportId: string, newStatus: "RESOLVED" | "DISMISSED") => {
    await updateReportStatus(reportId, newStatus);
    setSelectedReport(null);
  };

  const handleNotesChange = async (reportId: string) => {
    await updateReportNotes(reportId, adminNotes);
    setSelectedReport(null);
  };

  const handleFilterChange = (type: string, value: string) => {
    if (type === "type") {
      applyFilters({ type: value === "all" ? "all" : value as "Kullanıcı" | "Etkinlik" });
    } else if (type === "status") {
      applyFilters({ status: value === "all" ? "all" : value as "PENDING" | "RESOLVED" | "DISMISSED" });
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex-1 space-y-4 p-4 md:p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">Raporlar</h2>
        </div>

        <Tabs defaultValue="all" className="space-y-4" onValueChange={(value) => handleFilterChange("type", value)}>
          <div className="flex flex-col md:flex-row justify-between gap-4">
            <TabsList className="w-full md:w-auto">
              <TabsTrigger value="all">Tüm Raporlar</TabsTrigger>
              <TabsTrigger value="Kullanıcı" className="relative">
                Kullanıcı Raporları
                <Badge className="ml-1 bg-red-600 text-[10px] px-1 h-4 min-w-4 absolute -top-1 -right-1">
                  {reports.filter(r => r.tur === "Kullanıcı" && r.status === "PENDING").length}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="Etkinlik" className="relative">
                Etkinlik Raporları
                <Badge className="ml-1 bg-red-600 text-[10px] px-1 h-4 min-w-4 absolute -top-1 -right-1">
                  {reports.filter(r => r.tur === "Etkinlik" && r.status === "PENDING").length}
                </Badge>
              </TabsTrigger>
            </TabsList>

            <div className="flex flex-col md:flex-row gap-2 w-full md:w-auto">
              <Select onValueChange={(value) => handleFilterChange("status", value)}>
                <SelectTrigger className="w-full md:w-[150px]">
                  <SelectValue placeholder="Durum Filtrele" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tüm Durumlar</SelectItem>
                  <SelectItem value="PENDING">Beklemede</SelectItem>
                  <SelectItem value="RESOLVED">Çözüldü</SelectItem>
                  <SelectItem value="DISMISSED">Reddedildi</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Card className="w-full overflow-x-auto">
            <CardHeader>
              <CardTitle>Gelen Raporlar ({reports.length})</CardTitle>
              <CardDescription>İncelemeniz gereken rapor ve bildirimler</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex justify-center items-center p-4">
                  <Loader2 className="h-6 w-6 animate-spin" />
                </div>
              ) : (
                <>
                  {/* Mobil görünüm için kart yapısı */}
                  <div className="md:hidden space-y-4">
                    {reports.map((report) => (
                      <Card key={report.id} className="w-full">
                        <CardContent className="p-4 space-y-3">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-medium">{report.konu}</h3>
                              <p className="text-sm text-muted-foreground">{report.raporlayan}</p>
                            </div>
                            {getStatusBadge(report.status)}
                          </div>
                          <div className="flex flex-wrap gap-2">
                            <Badge variant="outline">{report.tur}</Badge>
                            {getPriorityBadge(report.oncelik)}
                          </div>
                          <div className="flex justify-between items-center">
                            <p className="text-sm text-muted-foreground">
                              {new Date(report.tarih).toLocaleDateString("tr-TR")}
                            </p>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleReportClick(report.id)}
                            >
                              Detaylar
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  {/* Masaüstü görünüm için tablo yapısı */}
                  <div className="hidden md:block">
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
                        {reports.map((report) => (
                          <TableRow 
                            key={report.id}
                            className="cursor-pointer hover:bg-muted/50"
                            onClick={() => handleReportClick(report.id)}
                          >
                            <TableCell className="font-medium">
                              {report.konu}
                            </TableCell>
                            <TableCell>{report.raporlayan}</TableCell>
                            <TableCell>
                              {new Date(report.tarih).toLocaleDateString("tr-TR")}
                            </TableCell>
                            <TableCell>{report.tur}</TableCell>
                            <TableCell>{getPriorityBadge(report.oncelik)}</TableCell>
                            <TableCell>{getStatusBadge(report.status)}</TableCell>
                            <TableCell>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleReportClick(report.id);
                                }}
                              >
                                Detaylar
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </Tabs>
      </div>

      {selectedReport && (
        <Dialog open={!!selectedReport} onOpenChange={() => setSelectedReport(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Rapor Detayı</DialogTitle>
              <DialogDescription>
                Rapor detaylarını görüntüleyin ve gerekli işlemleri yapın.
              </DialogDescription>
            </DialogHeader>
            
            {reports.find(r => r.id === selectedReport) && (
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium mb-1">Konu</h4>
                  <p>{reports.find(r => r.id === selectedReport)?.konu}</p>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium mb-1">Açıklama</h4>
                  <p>{reports.find(r => r.id === selectedReport)?.report_reason}</p>
                </div>

                <div>
                  <h4 className="text-sm font-medium mb-1">Admin Notu</h4>
                  <Textarea
                    value={adminNotes}
                    onChange={(e) => setAdminNotes(e.target.value)}
                    placeholder="Not ekleyin..."
                    className="mb-2"
                  />
                  <Button 
                    variant="outline" 
                    onClick={() => handleNotesChange(selectedReport)}
                  >
                    Notu Kaydet
                  </Button>
                </div>

                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    onClick={() => handleStatusChange(selectedReport, "DISMISSED")}
                  >
                    Reddet
                  </Button>
                  <Button
                    onClick={() => handleStatusChange(selectedReport, "RESOLVED")}
                  >
                    Çözüldü
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

