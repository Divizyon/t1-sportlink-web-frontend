"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Shield,
  AlertTriangle,
  Lock,
  Eye,
  EyeOff,
  RefreshCw,
} from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Cookies from "js-cookie";
import React from "react";
import { useSingleFetch } from "@/hooks";

interface SecurityLog {
  id: string;
  type:
    | "login"
    | "logout"
    | "failed_attempt"
    | "password_change"
    | "user_update"
    | "role_change"
    | "permission_change";
  admin: string;
  ip: string;
  date: string;
  time: string;
  status: "success" | "warning" | "error";
  action: string;
}

export default function SecurityPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [showLogs, setShowLogs] = useState(true);
  const [selectedAction, setSelectedAction] = useState<string | null>(null);
  const [logs, setLogs] = useState<SecurityLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch security logs from API
  const fetchSecurityLogs = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const apiUrl =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";
      let url = `${apiUrl}/security/logs?limit=50`;

      // Add filters to the request if present
      if (dateFilter) {
        url += `&dateFilter=${dateFilter}`;
      }

      if (searchQuery) {
        url += `&searchQuery=${encodeURIComponent(searchQuery)}`;
      }

      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${Cookies.get("accessToken")}`,
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (!response.ok) {
        if (response.status === 401) {
          setError(
            "Oturum süresi doldu veya yetkiniz yok. Lütfen tekrar giriş yapın."
          );
          setLogs([]);
          setIsLoading(false);
          return;
        }
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();

      if (data.success && Array.isArray(data.data?.logs)) {
        setLogs(data.data.logs);
      } else {
        // If API response doesn't have the expected format
        setError(
          "Güvenlik logları alınamadı: Sunucudan gelen veri formatı hatalı."
        );
        setLogs([]);
      }
    } catch (err) {
      console.error("Error fetching security logs:", err);

      // Provide more specific error messages based on the error type
      if (err instanceof Error) {
        if (
          err.message.includes("NetworkError") ||
          err.message.includes("Failed to fetch")
        ) {
          setError(
            "Ağ hatası: Sunucuya bağlanılamadı. Lütfen internet bağlantınızı kontrol edin."
          );
        } else if (err.message.includes("Timeout")) {
          setError(
            "Zaman aşımı: Sunucu yanıt vermek için çok uzun süre bekledi. Lütfen daha sonra tekrar deneyin."
          );
        } else if (err.message.includes("API error: 500")) {
          setError(
            "Sunucu hatası: İşlem sırasında bir sorun oluştu. Teknik ekip bu konuda bilgilendirildi."
          );
        } else if (err.message.includes("API error: 403")) {
          setError(
            "Erişim reddedildi: Bu verilere erişim için yetkiniz bulunmuyor."
          );
        } else if (err.message.includes("API error: 404")) {
          setError("Kaynak bulunamadı: İstenen veriler sunucuda bulunamadı.");
        } else {
          setError(`Bir hata oluştu: ${err.message}`);
        }
      } else {
        setError(
          "Bilinmeyen bir hata oluştu. Lütfen daha sonra tekrar deneyin."
        );
      }

      // Always set logs to empty array when there's an error - do not fall back to any mock data
      setLogs([]);
    } finally {
      setIsLoading(false);
    }
  }, [dateFilter, searchQuery]);

  // Use our single fetch hook to prevent double fetching
  useSingleFetch(fetchSecurityLogs);

  // Add effect for filter changes (with debounce)
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      fetchSecurityLogs();
    }, 500);

    return () => clearTimeout(debounceTimer);
  }, [dateFilter, searchQuery, fetchSecurityLogs]);

  // Format date for display
  const formatDate = (dateStr: string) => {
    try {
      const [year, month, day] = dateStr.split("-");
      return `${day}.${month}.${year}`;
    } catch (e) {
      return dateStr;
    }
  };

  const filteredLogs = logs.filter(
    (log) =>
      (log.admin.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.ip.includes(searchQuery) ||
        log.action.toLowerCase().includes(searchQuery.toLowerCase())) &&
      (dateFilter === "" || log.date === dateFilter)
  );

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "success":
        return <Shield className="h-4 w-4 text-green-500" />;
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case "error":
        return <Lock className="h-4 w-4 text-red-500" />;
      default:
        return null;
    }
  };

  const handleToggleLogs = () => {
    setShowLogs(!showLogs);
    toast.success(`Loglar ${showLogs ? "gizlendi" : "gösterildi"}`);
  };

  const truncateText = (text: string, maxLength: number = 50) => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + "...";
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Güvenlik Logları</h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleToggleLogs}>
            {showLogs ? (
              <>
                <EyeOff className="h-4 w-4 mr-2" />
                Logları Gizle
              </>
            ) : (
              <>
                <Eye className="h-4 w-4 mr-2" />
                Logları Göster
              </>
            )}
          </Button>
          <Button
            variant="outline"
            onClick={fetchSecurityLogs}
            disabled={isLoading}
          >
            <RefreshCw
              className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`}
            />
            Yenile
          </Button>
        </div>
      </div>

      <Card className="p-4">
        <div className="mb-4 flex flex-col sm:flex-row gap-4">
          <Input
            placeholder="Admin, IP veya İşlem ara..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full sm:max-w-sm"
          />
          <Input
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="w-full sm:max-w-[200px]"
            placeholder="Tarih seç"
          />
        </div>

        {isLoading && (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        )}

        {error && (
          <div className="text-center py-8 text-red-500">
            <AlertTriangle className="mx-auto h-8 w-8 mb-2" />
            <p>{error}</p>
          </div>
        )}

        {!isLoading && !error && filteredLogs.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <p>Bu kriterlere uygun log bulunamadı</p>
          </div>
        )}

        {showLogs && !isLoading && filteredLogs.length > 0 && (
          <>
            <div className="grid gap-4 md:hidden">
              {filteredLogs.map((log) => (
                <Card key={log.id} className="p-4">
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <div className="font-medium">
                        {log.type === "login"
                          ? "Giriş"
                          : log.type === "logout"
                          ? "Çıkış"
                          : log.type === "failed_attempt"
                          ? "Başarısız Giriş"
                          : log.type === "password_change"
                          ? "Şifre Değişikliği"
                          : log.type === "user_update"
                          ? "Kullanıcı Güncelleme"
                          : log.type === "role_change"
                          ? "Rol Değişikliği"
                          : "İzin Değişikliği"}
                      </div>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(log.status)}
                        <Badge
                          variant="outline"
                          className={
                            log.status === "success"
                              ? "bg-green-100 text-green-800 border-green-200"
                              : log.status === "warning"
                              ? "bg-yellow-100 text-yellow-800 border-yellow-200"
                              : "bg-red-100 text-red-800 border-red-200"
                          }
                        >
                          {log.status === "success"
                            ? "Başarılı"
                            : log.status === "warning"
                            ? "Uyarı"
                            : "Hata"}
                        </Badge>
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      <div>Admin: {log.admin}</div>
                      <div>IP: {log.ip}</div>
                      <div>
                        Tarih: {formatDate(log.date)} {log.time}
                      </div>
                    </div>
                    <div>
                      <button
                        onClick={() => setSelectedAction(log.action)}
                        className="text-left hover:underline cursor-pointer text-blue-600"
                      >
                        {truncateText(log.action, 100)}
                      </button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
            <div className="hidden md:block">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tip</TableHead>
                    <TableHead>Admin</TableHead>
                    <TableHead>IP Adresi</TableHead>
                    <TableHead>Tarih</TableHead>
                    <TableHead>Saat</TableHead>
                    <TableHead>İşlem</TableHead>
                    <TableHead>Durum</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredLogs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell className="font-medium">
                        {log.type === "login"
                          ? "Giriş"
                          : log.type === "logout"
                          ? "Çıkış"
                          : log.type === "failed_attempt"
                          ? "Başarısız Giriş"
                          : log.type === "password_change"
                          ? "Şifre Değişikliği"
                          : log.type === "user_update"
                          ? "Kullanıcı Güncelleme"
                          : log.type === "role_change"
                          ? "Rol Değişikliği"
                          : "İzin Değişikliği"}
                      </TableCell>
                      <TableCell>{log.admin}</TableCell>
                      <TableCell>{log.ip}</TableCell>
                      <TableCell>{formatDate(log.date)}</TableCell>
                      <TableCell>{log.time}</TableCell>
                      <TableCell>
                        <button
                          onClick={() => setSelectedAction(log.action)}
                          className="text-left hover:underline cursor-pointer text-blue-600"
                        >
                          {truncateText(log.action)}
                        </button>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(log.status)}
                          <Badge
                            variant="outline"
                            className={
                              log.status === "success"
                                ? "bg-green-100 text-green-800 border-green-200"
                                : log.status === "warning"
                                ? "bg-yellow-100 text-yellow-800 border-yellow-200"
                                : "bg-red-100 text-red-800 border-red-200"
                            }
                          >
                            {log.status === "success"
                              ? "Başarılı"
                              : log.status === "warning"
                              ? "Uyarı"
                              : "Hata"}
                          </Badge>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </>
        )}
      </Card>

      {/* Detail Dialog */}
      <Dialog
        open={!!selectedAction}
        onOpenChange={(open) => !open && setSelectedAction(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>İşlem Detayı</DialogTitle>
          </DialogHeader>
          <div className="mt-4">
            <p>{selectedAction}</p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
