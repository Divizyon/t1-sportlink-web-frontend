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
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { formatDate } from "@/lib/utils";
import { ReportStatus } from "@/mockups";
import {
  REPORT_STATUS_LABELS,
  REPORT_PRIORITY_LABELS,
  ENTITY_TYPE_LABELS,
} from "@/mockups";

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
      email?: string;
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
    status: ReportStatus;
    severity: "low" | "medium" | "high";
    createdAt: string;
    adminNote?: string;
    adminName?: string;
    adminActionDate?: string;
    isBanned?: boolean;
  };
  onStatusChange: (
    reportId: string,
    status: ReportStatus,
    adminNote?: string,
    banUser?: boolean
  ) => void;
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
      await onStatusChange(report.id, "resolved", adminNote, banUser);
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
      await onStatusChange(report.id, "rejected", adminNote, banUser);
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
    const label = REPORT_PRIORITY_LABELS[severity];

    switch (severity) {
      case "low":
        return (
          <Badge
            variant="outline"
            className="bg-green-50 text-green-700 border-green-200"
          >
            {label}
          </Badge>
        );
      case "medium":
        return (
          <Badge
            variant="outline"
            className="bg-yellow-50 text-yellow-700 border-yellow-200"
          >
            {label}
          </Badge>
        );
      case "high":
        return (
          <Badge
            variant="outline"
            className="bg-red-50 text-red-700 border-red-200"
          >
            {label}
          </Badge>
        );
      default:
        return (
          <Badge
            variant="outline"
            className="bg-gray-50 text-gray-700 border-gray-200"
          >
            {label || severity}
          </Badge>
        );
    }
  };

  const getStatusBadge = (status: ReportStatus) => {
    const label = REPORT_STATUS_LABELS[status];

    switch (status) {
      case "pending":
        return (
          <Badge
            variant="outline"
            className="bg-yellow-50 text-yellow-700 border-yellow-200"
          >
            {label}
          </Badge>
        );
      case "reviewing":
        return (
          <Badge
            variant="outline"
            className="bg-purple-50 text-purple-700 border-purple-200"
          >
            {label}
          </Badge>
        );
      case "resolved":
        return (
          <Badge
            variant="outline"
            className="bg-green-50 text-green-700 border-green-200"
          >
            {label}
          </Badge>
        );
      case "rejected":
      case "dismissed":
        return (
          <Badge
            variant="outline"
            className="bg-red-50 text-red-700 border-red-200"
          >
            {label}
          </Badge>
        );
      default:
        return (
          <Badge
            variant="outline"
            className="bg-gray-50 text-gray-700 border-gray-200"
          >
            {label || status}
          </Badge>
        );
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Rapor Detayı</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Rapor Türü ve Durumu */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-medium">Rapor Türü:</span>
              <Badge variant="outline">
                {ENTITY_TYPE_LABELS[report.type] || report.type}
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-medium">Durum:</span>
              {getStatusBadge(report.status)}
            </div>
          </div>

          {/* Raporlanan İçerik */}
          <div className="space-y-2">
            <h3 className="font-medium">Raporlanan İçerik</h3>
            <div className="rounded-lg border p-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={report.reportedItem.avatar} />
                  <AvatarFallback>
                    {report.reportedItem.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{report.reportedItem.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {report.type === "event"
                      ? report.reportedItem.date
                      : report.reportedItem.email}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Raporlayan Kullanıcı */}
          <div className="space-y-2">
            <h3 className="font-medium">Raporlayan Kullanıcı</h3>
            <div className="rounded-lg border p-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={report.reporter.avatar} />
                  <AvatarFallback>
                    {report.reporter.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{report.reporter.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {report.reporter.email}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Rapor Detayları */}
          <div className="space-y-2">
            <h3 className="font-medium">Rapor Detayları</h3>
            <div className="rounded-lg border p-4 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Önem Derecesi:
                </span>
                {getSeverityBadge(report.severity)}
              </div>
              <div>
                <span className="text-sm text-muted-foreground">Açıklama:</span>
                <p className="mt-1">{report.details}</p>
              </div>
              <div>
                <span className="text-sm text-muted-foreground">Tarih:</span>
                <p className="mt-1">{formatDate(report.createdAt)}</p>
              </div>
            </div>
          </div>

          {/* Admin Notu */}
          <div className="space-y-2">
            <h3 className="font-medium">Admin Notu</h3>
            <Textarea
              placeholder="Rapor hakkında not ekleyin..."
              value={adminNote}
              onChange={(e) => setAdminNote(e.target.value)}
            />
          </div>

          {/* Kullanıcıyı Banla */}
          <div className="flex items-center space-x-2">
            <Checkbox
              id="banUser"
              checked={banUser}
              onCheckedChange={(checked) => setBanUser(checked as boolean)}
            />
            <Label htmlFor="banUser">Kullanıcıyı banla</Label>
          </div>

          {/* Aksiyon Butonları */}
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              İptal
            </Button>
            <Button
              variant="destructive"
              onClick={handleDismiss}
              disabled={loading}
            >
              Reddet
            </Button>
            <Button onClick={handleResolve} disabled={loading}>
              Çöz
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
