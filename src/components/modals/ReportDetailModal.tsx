"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import { CheckCircle, XCircle, Flag, Calendar, User } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { formatDate } from "@/lib/utils";
import { REPORT_STATUS_LABELS } from "@/lib/constants";
import { ReportStatus } from "@/types/dashboard";
import { reportService } from "@/services/reportService";

interface ReportDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  report: {
    id: string;
    type: "event" | "user";
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
    severity: "low" | "medium" | "high";
    createdAt: string;
    adminNote?: string;
    adminName?: string;
    adminActionDate?: string;
    isBanned?: boolean;
  };
  onStatusChange: (reportId: string, status: "resolved" | "dismissed", adminNote?: string, banUser?: boolean) => void;
}

export function ReportDetailModal({
  open,
  onOpenChange,
  report,
  onStatusChange,
}: ReportDetailModalProps) {
  const [loading, setLoading] = useState(false);
  const [adminNote, setAdminNote] = useState("");
  const [banUser, setBanUser] = useState(false);
  const { toast } = useToast();

  const handleResolve = async () => {
    try {
      setLoading(true);
      // Önce admin notunu güncelle
      if (adminNote) {
        await reportService.addAdminNote(report.id, adminNote);
      }
      // Sonra durumu güncelle
      await reportService.updateReportStatus(report.id, "resolved", adminNote);
      // Eğer kullanıcı banlanacaksa
      if (banUser) {
        await reportService.banUserFromReport(report.id);
      }
      toast({
        title: "Rapor çözüldü",
        description: "Rapor başarıyla çözüldü.",
      });
      onOpenChange(false);
    } catch (error) {
      toast({
        title: "Hata",
        description: "Rapor çözülürken bir hata oluştu.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDismiss = async () => {
    try {
      setLoading(true);
      // Önce admin notunu güncelle
      if (adminNote) {
        await reportService.addAdminNote(report.id, adminNote);
      }
      // Sonra durumu güncelle
      await reportService.updateReportStatus(report.id, "dismissed", adminNote);
      toast({
        title: "Rapor reddedildi",
        description: "Rapor başarıyla reddedildi.",
      });
      onOpenChange(false);
    } catch (error) {
      toast({
        title: "Hata",
        description: "Rapor reddedilirken bir hata oluştu.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getSeverityBadge = (severity: "low" | "medium" | "high") => {
    switch (severity) {
      case "low":
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Düşük</Badge>;
      case "medium":
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">Orta</Badge>;
      case "high":
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Yüksek</Badge>;
    }
  };

  const getStatusBadge = (status: "pending" | "reviewing" | "resolved" | "rejected" | "dismissed") => {
    switch (status) {
      case "pending":
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">Beklemede</Badge>;
      case "reviewing":
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">İnceleniyor</Badge>;
      case "resolved":
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Çözüldü</Badge>;
      case "rejected":
      case "dismissed":
        return <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">Reddedildi</Badge>;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[95vw] md:max-w-[90vw] lg:max-w-[80vw] xl:max-w-[70vw] w-full h-[90vh] md:h-[85vh] overflow-y-auto">
        <DialogHeader className="sticky top-0 bg-background z-10 pb-2">
          <DialogTitle className="text-lg md:text-xl">Rapor Detayı</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 md:space-y-6">
          {/* Rapor Türü ve Durumu */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 md:gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm md:text-base font-medium">Rapor Türü:</span>
              <Badge variant="outline" className="text-xs md:text-sm">{report.type}</Badge>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm md:text-base font-medium">Durum:</span>
              {getStatusBadge(report.status)}
            </div>
          </div>

          {/* Raporlanan İçerik */}
          <div className="space-y-2">
            <h3 className="text-sm md:text-base font-medium">Raporlanan İçerik</h3>
            <div className="rounded-lg border p-3 md:p-4">
              <div className="flex items-center gap-3 md:gap-4">
                <Avatar className="h-10 w-10 md:h-12 md:w-12">
                  <AvatarImage src={report.reportedItem.avatar} />
                  <AvatarFallback>
                    {report.reportedItem.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm md:text-base font-medium truncate">{report.reportedItem.name}</p>
                  <p className="text-xs md:text-sm text-muted-foreground truncate">
                    {report.type === "event" ? report.reportedItem.date : report.reportedItem.email}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Raporlayan Kullanıcı */}
          <div className="space-y-2">
            <h3 className="text-sm md:text-base font-medium">Raporlayan Kullanıcı</h3>
            <div className="rounded-lg border p-3 md:p-4">
              <div className="flex items-center gap-3 md:gap-4">
                <Avatar className="h-10 w-10 md:h-12 md:w-12">
                  <AvatarImage src={report.reporter.avatar} />
                  <AvatarFallback>
                    {report.reporter.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm md:text-base font-medium truncate">{report.reporter.name}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Rapor Detayları */}
          <div className="space-y-2">
            <h3 className="text-sm md:text-base font-medium">Rapor Detayları</h3>
            <div className="rounded-lg border p-3 md:p-4 space-y-3 md:space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs md:text-sm text-muted-foreground">Önem Derecesi:</span>
                {getSeverityBadge(report.severity)}
              </div>
              <div>
                <span className="text-xs md:text-sm text-muted-foreground">Açıklama:</span>
                <p className="mt-1 text-sm md:text-base break-words">{report.details}</p>
              </div>
              <div>
                <span className="text-xs md:text-sm text-muted-foreground">Tarih:</span>
                <p className="mt-1 text-sm md:text-base">{formatDate(report.createdAt)}</p>
              </div>
            </div>
          </div>

          {/* Admin Notu */}
          <div className="space-y-2">
            <h3 className="text-sm md:text-base font-medium">Admin Notu</h3>
            {report.adminNote && (
              <div className="rounded-lg border p-3 mb-3 bg-muted/10">
                <p className="text-sm text-muted-foreground">Mevcut Not:</p>
                <p className="mt-1 text-sm whitespace-pre-wrap">{report.adminNote}</p>
              </div>
            )}
            <Textarea
              placeholder="Rapor hakkında not ekleyin..."
              value={adminNote}
              onChange={(e) => setAdminNote(e.target.value)}
              className="min-h-[100px] text-sm md:text-base resize-none"
            />
          </div>

          {/* Kullanıcıyı Banla */}
          <div className="flex items-center space-x-2">
            <Checkbox
              id="banUser"
              checked={banUser}
              onCheckedChange={(checked) => setBanUser(checked as boolean)}
            />
            <Label htmlFor="banUser" className="text-sm md:text-base">Kullanıcıyı banla</Label>
          </div>

          {/* Aksiyon Butonları */}
          <div className="flex flex-col md:flex-row justify-end gap-2 sticky bottom-0 bg-background pt-4">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
              className="w-full md:w-auto text-sm md:text-base"
            >
              İptal
            </Button>
            <Button
              variant="destructive"
              onClick={handleDismiss}
              disabled={loading}
              className="w-full md:w-auto text-sm md:text-base"
            >
              Reddet
            </Button>
            <Button 
              onClick={handleResolve} 
              disabled={loading}
              className="w-full md:w-auto text-sm md:text-base"
            >
              Çöz
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
} 