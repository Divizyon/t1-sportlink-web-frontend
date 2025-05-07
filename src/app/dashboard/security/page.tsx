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
  LogOut,
  User,
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
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { PAGINATION_DEFAULTS } from "@/constants/dashboard";

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
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(PAGINATION_DEFAULTS.defaultPage);
  const [pageSize, setPageSize] = useState(PAGINATION_DEFAULTS.defaultLimit);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  // Fetch security logs from API
  const fetchSecurityLogs = useCallback(async () => {
    console.log(`[DEBUG] fetchSecurityLogs called: page=${currentPage}, limit=${pageSize}`);
    
    // Use a ref to track the current fetch request
    const requestId = Date.now();
    const currentRequest = requestId;
    
    // Comment out the loading check to allow refreshing the same page
    // if (isLoading) return;
    
    setIsLoading(true);
    setError(null);

    try {
      const apiUrl =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";
      let url = `${apiUrl}/security/logs?page=${currentPage}&limit=${pageSize}`;

      // Add filters to the request if present
      if (dateFilter) {
        url += `&dateFilter=${dateFilter}`;
      }

      if (searchQuery) {
        url += `&searchQuery=${encodeURIComponent(searchQuery)}`;
      }

      console.log(`[Security] Fetching logs: ${url}`);
      
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${Cookies.get("accessToken")}`,
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      // If a newer request was initiated, abort this one
      if (requestId !== currentRequest) {
        console.log("[Security] Aborting stale request");
        return;
      }

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
      console.log("[Security] Received data:", data.data?.logs?.length || 0, "logs");

      if (data.success && Array.isArray(data.data?.logs)) {
        setLogs(data.data.logs);
        
        // Set pagination data
        if (data.data.pagination) {
          setTotalCount(data.data.pagination.total);
          setTotalPages(data.data.pagination.totalPages);
          console.log(`[Security] Pagination: ${data.data.pagination.page}/${data.data.pagination.totalPages} (${data.data.pagination.total} total)`);
        }
      } else {
        // If API response doesn't have the expected format
        setError(
          "Güvenlik logları alınamadı: Sunucudan gelen veri formatı hatalı."
        );
        setLogs([]);
      }
    } catch (err) {
      console.error("Error fetching security logs:", err);

      // If a newer request was initiated, abort this one
      if (requestId !== currentRequest) {
        return;
      }

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
      // Only update loading state if this is still the current request
      if (requestId === currentRequest) {
        setIsLoading(false);
      }
    }
  }, [currentPage, pageSize, dateFilter, searchQuery]);

  // This separate effect ensures initial loading
  useEffect(() => {
    console.log("[DEBUG] Initial effect - component mounted");
    fetchSecurityLogs();
    // Only run this on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // This effect handles page/size changes
  useEffect(() => {
    console.log(`[DEBUG] Page/size changed - page=${currentPage}, size=${pageSize}`);
    // Skip the initial render since we have a separate effect for that
    if (currentPage === PAGINATION_DEFAULTS.defaultPage && 
        pageSize === PAGINATION_DEFAULTS.defaultLimit &&
        !dateFilter && !searchQuery) {
      return;
    }
    
    fetchSecurityLogs();
  }, [currentPage, pageSize, fetchSecurityLogs]);

  // This effect handles filter changes
  useEffect(() => {
    if (!dateFilter && !searchQuery) return;
    
    console.log(`[DEBUG] Filter changed - dateFilter=${dateFilter}, searchQuery=${searchQuery}`);
    
    const debounceTimer = setTimeout(() => {
      // Reset to first page when filters change (but only if we're not already on page 1)
      if (currentPage !== 1) {
        console.log(`[DEBUG] Resetting page to 1 due to filter change`);
        setCurrentPage(1);
        // The page change will trigger the fetch via the other effect
      } else {
        // If we're already on page 1, we need to fetch data with the new filters
        console.log(`[DEBUG] Already on page 1, fetching with new filters`);
        fetchSecurityLogs();
      }
    }, 500);

    return () => clearTimeout(debounceTimer);
  }, [dateFilter, searchQuery, currentPage, fetchSecurityLogs]);

  // Handle page change
  const handlePageChange = (page: number) => {
    console.log(`[DEBUG] handlePageChange called with page=${page}`);
    if (page < 1 || page > totalPages || page === currentPage) {
      console.log(`[DEBUG] Page change ignored - invalid page or same as current`);
      return;
    }
    setCurrentPage(page);
  };

  // Handle page size change
  const handlePageSizeChange = (size: number) => {
    if (size === pageSize) return;
    setPageSize(size);
    setCurrentPage(1); // Reset to first page when changing page size
    // Fetch will happen automatically due to dependency on pageSize
  };

  // Format date for display
  const formatDate = (dateStr: string) => {
    try {
      const [year, month, day] = dateStr.split("-");
      return `${day}.${month}.${year}`;
    } catch (e) {
      return dateStr;
    }
  };

  const filteredLogs = logs;

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

  // Generate pagination items
  const getPaginationItems = () => {
    const items = [];
    const maxVisiblePages = 5;

    // Always show first page
    items.push(
      <PaginationItem key="first">
        <PaginationLink
          onClick={(e) => {
            e.preventDefault();
            handlePageChange(1);
          }}
          isActive={currentPage === 1}
        >
          1
        </PaginationLink>
      </PaginationItem>
    );

    // If there are many pages, show ellipsis after first page
    if (currentPage > 3) {
      items.push(
        <PaginationItem key="ellipsis-start">
          <PaginationEllipsis />
        </PaginationItem>
      );
    }

    // Show current page and nearby pages
    for (
      let i = Math.max(2, currentPage - 1);
      i <= Math.min(totalPages - 1, currentPage + 1);
      i++
    ) {
      if (i <= 1 || i >= totalPages) continue;
      items.push(
        <PaginationItem key={i}>
          <PaginationLink
            onClick={(e) => {
              e.preventDefault();
              handlePageChange(i);
            }}
            isActive={currentPage === i}
          >
            {i}
          </PaginationLink>
        </PaginationItem>
      );
    }

    // If there are many pages, show ellipsis before last page
    if (currentPage < totalPages - 2) {
      items.push(
        <PaginationItem key="ellipsis-end">
          <PaginationEllipsis />
        </PaginationItem>
      );
    }

    // Always show last page if there's more than one page
    if (totalPages > 1) {
      items.push(
        <PaginationItem key="last">
          <PaginationLink
            onClick={(e) => {
              e.preventDefault();
              handlePageChange(totalPages);
            }}
            isActive={currentPage === totalPages}
          >
            {totalPages}
          </PaginationLink>
        </PaginationItem>
      );
    }

    return items;
  };

  // Format action text for display by extracting the subject and action
  const formatActionText = (action: string): { brief: string, subject: string, details: string, actor: string } => {
    // Try to extract the first part as a brief summary (typically contains who did what)
    const segments = action.split(/[:;]/);
    
    // Try to extract actor's name if possible (usually before the first action verb)
    let actor = "";
    if (segments.length > 0) {
      const firstPart = segments[0];
      const actorMatch = firstPart.match(/^([^,]+)/);
      if (actorMatch) {
        actor = actorMatch[1].trim();
      }
    }
    
    if (segments.length > 1) {
      // Extract a reasonable subject from the first part
      const firstPart = segments[0].trim();
      const subject = firstPart.length > 30 ? firstPart.substring(0, 30) + '...' : firstPart;
      
      // Brief is the first segment with some refinement
      const brief = firstPart.length > 40 ? firstPart.substring(0, 40) + '...' : firstPart;
      
      return {
        brief,
        subject,
        details: action,
        actor
      };
    }
    
    // If we can't segment it, just truncate the original
    return {
      brief: action.length > 40 ? action.substring(0, 40) + '...' : action,
      subject: action.length > 30 ? action.substring(0, 30) + '...' : action,
      details: action,
      actor
    };
  };

  // Create a separate refresh function for the refresh button
  const handleRefresh = () => {
    console.log(`[DEBUG] Manual refresh requested`);
    // Force a refresh by directly calling fetchSecurityLogs
    fetchSecurityLogs();
  };
  
  // Enhanced dialog for action details with proper formatting
  const ActionDetailsDialog = () => {
    if (!selectedAction) return null;
    
    const formatDetailText = (text: string) => {
      // Split by common delimiters and add proper line breaks
      return text.split(/[;:]/).map((segment, index) => (
        <React.Fragment key={index}>
          {index > 0 && <div className="mt-2 pt-2 border-t border-gray-100"></div>}
          <p className={index === 0 ? "font-medium text-base" : "text-sm text-gray-700"}>
            {segment.trim()}
          </p>
        </React.Fragment>
      ));
    };
    
    return (
      <Dialog
        open={!!selectedAction}
        onOpenChange={(open) => !open && setSelectedAction(null)}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-lg font-semibold">
              <Shield className="h-5 w-5 text-primary" />
              İşlem Detayı
            </DialogTitle>
          </DialogHeader>
          <div className="mt-2 p-4 bg-gray-50 rounded-md border border-gray-100 shadow-inner">
            {formatDetailText(selectedAction)}
          </div>
          <div className="mt-4 flex justify-end">
            <Button variant="outline" onClick={() => setSelectedAction(null)}>
              Kapat
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  };

  // Get appropriate icon based on log type
  const getLogTypeIcon = (type: string) => {
    switch (type) {
      case "login":
        return <Shield className="h-4 w-4 text-blue-500" />;
      case "logout":
        return <LogOut className="h-4 w-4 text-gray-500" />;
      case "failed_attempt":
        return <AlertTriangle className="h-4 w-4 text-orange-500" />;
      case "password_change":
        return <Lock className="h-4 w-4 text-purple-500" />;
      case "user_update":
        return <User className="h-4 w-4 text-green-500" />;
      case "role_change":
        return <Shield className="h-4 w-4 text-indigo-500" />;
      case "permission_change":
        return <Shield className="h-4 w-4 text-teal-500" />;
      default:
        return <Shield className="h-4 w-4 text-primary" />;
    }
  };

  // Get text label for log type
  const getLogTypeText = (type: string) => {
    switch (type) {
      case "login":
        return "Giriş";
      case "logout":
        return "Çıkış";
      case "failed_attempt":
        return "Başarısız Giriş";
      case "password_change":
        return "Şifre Değişikliği";
      case "user_update":
        return "Kullanıcı Güncelleme";
      case "role_change":
        return "Rol Değişikliği";
      case "permission_change":
        return "İzin Değişikliği";
      default:
        return type;
    }
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
            onClick={handleRefresh}
            disabled={isLoading}
          >
            <RefreshCw
              className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`}
            />
            Yenile
          </Button>
        </div>
      </div>

      <Card className="overflow-hidden border-none shadow-md">
        <div className="p-4 bg-gray-50 border-b">
          <div className="flex flex-col sm:flex-row gap-4">
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
        </div>

        {isLoading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
          </div>
        )}

        {error && (
          <div className="text-center py-8 text-red-500">
            <AlertTriangle className="mx-auto h-8 w-8 mb-2" />
            <p>{error}</p>
          </div>
        )}

        {!isLoading && !error && filteredLogs.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
            <Shield className="h-10 w-10 text-muted-foreground/40 mb-4" />
            <p>Bu kriterlere uygun log bulunamadı</p>
          </div>
        )}

        {showLogs && !isLoading && filteredLogs.length > 0 && (
          <>
            <div className="grid gap-4 p-4 md:hidden">
              {filteredLogs.map((log) => {
                const actionFormatted = formatActionText(log.action);
                
                return (
                  <Card key={log.id} className="overflow-hidden border">
                    <div className="p-3 bg-gray-50 border-b flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {getLogTypeIcon(log.type)}
                        <span className="font-medium">{getLogTypeText(log.type)}</span>
                      </div>
                      <Badge
                        variant="outline"
                        className={
                          log.status === "success"
                            ? "bg-green-50 text-green-700 border-green-200"
                            : log.status === "warning"
                            ? "bg-yellow-50 text-yellow-700 border-yellow-200"
                            : "bg-red-50 text-red-700 border-red-200"
                        }
                      >
                        {log.status === "success"
                          ? "Başarılı"
                          : log.status === "warning"
                          ? "Uyarı"
                          : "Hata"}
                      </Badge>
                    </div>
                    <div className="p-3">
                      <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm mb-3">
                        <div>
                          <div className="text-gray-500 text-xs">Admin</div>
                          <div className="font-medium">{log.admin}</div>
                        </div>
                        <div>
                          <div className="text-gray-500 text-xs">IP</div>
                          <div className="font-mono text-xs">{log.ip}</div>
                        </div>
                        <div>
                          <div className="text-gray-500 text-xs">Tarih</div>
                          <div>{formatDate(log.date)}</div>
                        </div>
                        <div>
                          <div className="text-gray-500 text-xs">Saat</div>
                          <div>{log.time}</div>
                        </div>
                      </div>
                      <div className="mt-3 border-t pt-3">
                        <div className="text-gray-500 text-xs mb-1">İşlem</div>
                        <p className="text-sm mb-2 line-clamp-2">
                          {actionFormatted.brief}
                        </p>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => setSelectedAction(log.action)}
                          className="w-full text-xs"
                        >
                          <Eye className="h-3.5 w-3.5 mr-1" />
                          Detayları Göster
                        </Button>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
            <div className="hidden md:block">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50">
                      <TableHead className="w-[12%]">Tip</TableHead>
                      <TableHead className="w-[15%]">Admin</TableHead>
                      <TableHead className="w-[12%]">IP Adresi</TableHead>
                      <TableHead className="w-[10%]">Tarih</TableHead>
                      <TableHead className="w-[8%]">Saat</TableHead>
                      <TableHead className="w-[35%]">İşlem</TableHead>
                      <TableHead className="w-[8%]">Durum</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredLogs.map((log) => {
                      const actionFormatted = formatActionText(log.action);
                      
                      return (
                        <TableRow key={log.id} className="hover:bg-gray-50/70">
                          <TableCell>
                            <div className="flex items-center gap-2">
                              {getLogTypeIcon(log.type)}
                              <span className="font-medium">{getLogTypeText(log.type)}</span>
                            </div>
                          </TableCell>
                          <TableCell className="font-medium">{log.admin}</TableCell>
                          <TableCell className="font-mono text-xs">{log.ip}</TableCell>
                          <TableCell>{formatDate(log.date)}</TableCell>
                          <TableCell>{log.time}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <div className="flex-1 truncate">
                                {actionFormatted.subject}
                              </div>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7 rounded-full hover:bg-gray-100"
                                onClick={() => setSelectedAction(log.action)}
                                title="Detayları Göster"
                              >
                                <Eye className="h-3.5 w-3.5 text-gray-500 hover:text-primary" />
                              </Button>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className={
                                log.status === "success"
                                  ? "bg-green-50 text-green-700 border-green-200"
                                  : log.status === "warning"
                                  ? "bg-yellow-50 text-yellow-700 border-yellow-200"
                                  : "bg-red-50 text-red-700 border-red-200"
                              }
                            >
                              {log.status === "success"
                                ? "Başarılı"
                                : log.status === "warning"
                                ? "Uyarı"
                                : "Hata"}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            </div>

            {/* Pagination */}
            <div className="p-4 bg-gray-50 border-t">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center text-sm text-muted-foreground">
                  <span>Toplam: <strong>{totalCount}</strong> kayıt</span>
                </div>
                
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        onClick={(e) => {
                          e.preventDefault();
                          if (currentPage > 1) {
                            handlePageChange(currentPage - 1);
                          }
                        }}
                        href="#"
                        aria-disabled={currentPage === 1}
                        className={
                          currentPage === 1
                            ? "pointer-events-none opacity-50"
                            : ""
                        }
                      />
                    </PaginationItem>

                    {getPaginationItems()}

                    <PaginationItem>
                      <PaginationNext
                        onClick={(e) => {
                          e.preventDefault();
                          if (currentPage < totalPages) {
                            handlePageChange(currentPage + 1);
                          }
                        }}
                        href="#"
                        aria-disabled={currentPage === totalPages}
                        className={
                          currentPage === totalPages
                            ? "pointer-events-none opacity-50"
                            : ""
                        }
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>

                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground whitespace-nowrap">
                    Sayfa başına:
                  </span>
                  <select
                    value={pageSize}
                    onChange={(e) => handlePageSizeChange(Number(e.target.value))}
                    className="p-1.5 text-sm border rounded-md bg-white"
                  >
                    {PAGINATION_DEFAULTS.pageSizeOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </>
        )}
      </Card>

      {/* Enhanced action details dialog */}
      <ActionDetailsDialog />
    </div>
  );
}
