"use client";

import { useState, useEffect } from "react";
import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Button, buttonVariants } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useNews } from "@/hooks/useNews";
import type { NewsItem } from "@/types/news";
import { formatDate, cn } from "@/lib/utils";
import {
  Loader2,
  ChevronDown,
  ChevronUp,
  Calendar,
  Tag,
  Globe,
  Link as LinkIcon,
  FileText,
  Clock,
  User,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { tr } from "date-fns/locale";
import { Check, X, Trash2, ExternalLink } from "lucide-react";
import Image from "next/image";
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

interface NewsTableProps {
  news: NewsItem[];
  loading: boolean;
  showActions: boolean;
  showSelect?: boolean;
  totalCount?: number;
  currentPage?: number;
  pageSize?: number;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
}

export function NewsTable({
  news,
  loading,
  showActions,
  showSelect,
  totalCount = 0,
  currentPage = 1,
  pageSize = PAGINATION_DEFAULTS.defaultLimit,
  onPageChange,
  onPageSizeChange,
}: NewsTableProps) {
  const {
    toggleNewsSelection,
    toggleSelectAll,
    approveNews,
    rejectNews,
    deleteNews,
  } = useNews();
  const { toast } = useToast();
  const [processingIds, setProcessingIds] = useState<string[]>([]);
  const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({});

  // Log the data received to ensure we're displaying what's expected
  useEffect(() => {
    console.log("NewsTable received props:", {
      newsCount: news.length,
      loading,
      totalCount,
      statusSample: news[0]?.status || "none",
    });
  }, [news, loading, totalCount]);

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "d MMMM yyyy HH:mm", { locale: tr });
  };

  const handleSelectAll = () => {
    const newsIds = news.map((item) => item.id);
    toggleSelectAll(true, newsIds);
  };

  const handleSelect = (id: string) => {
    toggleNewsSelection(id);
  };

  const toggleRowExpand = (id: string) => {
    setExpandedRows((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleApprove = async (id: string) => {
    try {
      setProcessingIds((prev) => [...prev, id]);
      const result = await approveNews(id);

      if (result.error) {
        toast({
          title: "Hata",
          description: result.error,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Başarılı",
          description: "Haber başarıyla onaylandı ve yayına alındı.",
        });
      }
    } catch (error) {
      toast({
        title: "Hata",
        description: "Haber onaylanırken bir hata oluştu",
        variant: "destructive",
      });
    } finally {
      setProcessingIds((prev) => prev.filter((item) => item !== id));
    }
  };

  const handleRejectSelected = async () => {
    try {
      const selectedNews = news.filter((item) => item.selected);
      if (selectedNews.length === 0) {
        toast({
          title: "Uyarı",
          description: "Lütfen reddedilecek haberleri seçin",
          variant: "destructive",
        });
        return;
      }

      // For each selected news item, reject it
      let successCount = 0;
      for (const item of selectedNews) {
        const result = await rejectNews(item.id);
        if (!result.error) {
          successCount++;
        }
      }

      toast({
        title: "Başarılı",
        description: `${successCount} haber başarıyla reddedildi.`,
      });
      const newsIds = news.map((item) => item.id);
      toggleSelectAll(false, newsIds);
    } catch (error) {
      toast({
        title: "Hata",
        description: "Haberler reddedilirken bir hata oluştu",
        variant: "destructive",
      });
    }
  };

  const totalPages = Math.ceil(totalCount / pageSize);
  const hasPagination = !!onPageChange && totalCount > 0;

  const handlePageChange = (newPage: number) => {
    if (onPageChange && newPage >= 1 && newPage <= totalPages) {
      onPageChange(newPage);

      // Scroll to top when changing pages
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handlePageSizeChange = (newPageSize: number) => {
    if (onPageSizeChange) {
      onPageSizeChange(newPageSize);

      // Reset to page 1 when changing page size
      onPageChange?.(1);
    }
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

  return (
    <div className="w-full">
      {loading ? (
        <div className="flex flex-col items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
          <span className="text-sm text-muted-foreground">
            Haberler yükleniyor...
          </span>
          <p className="text-xs text-muted-foreground mt-2">
            Bu biraz zaman alabilir, lütfen bekleyin.
          </p>
        </div>
      ) : news.length === 0 ? (
        <div className="py-8 text-center">
          <p className="text-sm text-muted-foreground">
            Bu kategoride haber bulunamadı.
          </p>
        </div>
      ) : (
        <>
          {showSelect && (
            <div className="flex justify-between items-center p-2 mb-2">
              <div className="flex items-center gap-2">
                <Checkbox
                  checked={news.every((item) => item.selected)}
                  onCheckedChange={handleSelectAll}
                />
                <span>Tümünü Seç</span>
              </div>
              <Button
                variant="destructive"
                onClick={handleRejectSelected}
                disabled={!news.some((item) => item.selected)}
                size="sm"
                className="text-xs"
              >
                Seçilenleri Reddet
              </Button>
            </div>
          )}

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  {showSelect && (
                    <TableHead style={{ width: 30 }}>
                      <Checkbox
                        checked={
                          news.length > 0 && news.every((item) => item.selected)
                        }
                        onCheckedChange={(checked) => {
                          handleSelectAll();
                        }}
                        aria-label="Tümünü seç"
                      />
                    </TableHead>
                  )}
                  <TableHead className="w-8 px-1 py-2"></TableHead>
                  <TableHead className="w-16 hidden sm:table-cell px-2 py-2">
                    Görsel
                  </TableHead>
                  <TableHead className="min-w-[120px] max-w-[160px] px-2 py-2">
                    Başlık
                  </TableHead>
                  <TableHead className="hidden md:table-cell px-2 py-2">
                    İçerik
                  </TableHead>
                  <TableHead className="hidden sm:table-cell w-20 px-2 py-2">
                    Kategori
                  </TableHead>
                  <TableHead className="hidden lg:table-cell px-2 py-2">
                    Etiketler
                  </TableHead>
                  <TableHead className="w-[90px] px-2 py-2">Durum</TableHead>
                  <TableHead className="hidden md:table-cell w-[120px] px-2 py-2">
                    Tarih
                  </TableHead>
                  {showActions && (
                    <TableHead className="w-[90px] px-2 py-2">
                      İşlemler
                    </TableHead>
                  )}
                </TableRow>
              </TableHeader>
              <TableBody>
                {news.map((item) => (
                  <React.Fragment key={item.id}>
                    <TableRow
                      className={`cursor-pointer hover:bg-gray-50 ${
                        expandedRows[item.id] ? "bg-gray-50" : ""
                      }`}
                    >
                      {showSelect && (
                        <TableCell
                          onClick={(e) => e.stopPropagation()}
                          className="px-2 py-2 align-middle"
                        >
                          <Checkbox
                            checked={item.selected}
                            onCheckedChange={() => handleSelect(item.id)}
                          />
                        </TableCell>
                      )}
                      <TableCell className="px-1 py-2 align-middle">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 p-0"
                          onClick={() => toggleRowExpand(item.id)}
                        >
                          {expandedRows[item.id] ? (
                            <ChevronUp size={14} />
                          ) : (
                            <ChevronDown size={14} />
                          )}
                        </Button>
                      </TableCell>
                      <TableCell
                        onClick={() => toggleRowExpand(item.id)}
                        className="hidden sm:table-cell px-2 py-2 align-middle"
                      >
                        {item.image && (
                          <div className="relative h-10 w-14 mx-auto">
                            <Image
                              src={item.image}
                              alt={item.title}
                              fill
                              className="object-cover rounded"
                              onError={(e) => {
                                const imgElement = e.target as HTMLImageElement;
                                imgElement.src =
                                  "https://via.placeholder.com/100x60?text=Görsel+Yok";
                              }}
                            />
                          </div>
                        )}
                      </TableCell>
                      <TableCell
                        className="font-medium px-2 py-2 align-middle"
                        onClick={() => toggleRowExpand(item.id)}
                      >
                        <div className="line-clamp-2 text-xs break-words">
                          {item.title}
                        </div>
                        {item.sourceUrl && (
                          <a
                            href={item.sourceUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-blue-600 hover:underline flex items-center gap-1 mt-1"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <span className="truncate">Kaynak</span>
                            <ExternalLink className="h-3 w-3 flex-shrink-0" />
                          </a>
                        )}
                      </TableCell>
                      <TableCell
                        className="hidden md:table-cell px-2 py-2 align-middle"
                        onClick={() => toggleRowExpand(item.id)}
                      >
                        <div className="line-clamp-2 text-xs">
                          {item.details?.description &&
                          item.details.description !== item.title
                            ? item.details.description
                            : item.content}
                        </div>
                      </TableCell>
                      <TableCell
                        onClick={() => toggleRowExpand(item.id)}
                        className="hidden sm:table-cell px-2 py-2 align-middle"
                      >
                        <Badge
                          variant="outline"
                          className="text-xs whitespace-nowrap max-w-full truncate block"
                        >
                          {item.category}
                        </Badge>
                      </TableCell>
                      <TableCell
                        onClick={() => toggleRowExpand(item.id)}
                        className="hidden lg:table-cell px-2 py-2 align-middle"
                      >
                        <div className="flex flex-wrap gap-1">
                          {item.tags.slice(0, 1).map((tag) => (
                            <Badge
                              key={tag}
                              variant="secondary"
                              className="text-xs truncate"
                            >
                              {tag}
                            </Badge>
                          ))}
                          {item.tags.length > 1 && (
                            <Badge variant="outline" className="text-xs">
                              +{item.tags.length - 1}
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell
                        onClick={() => toggleRowExpand(item.id)}
                        className="px-2 py-2 align-middle"
                      >
                        <Badge
                          variant={
                            item.status === "approved"
                              ? "default"
                              : item.status === "rejected"
                              ? "destructive"
                              : "secondary"
                          }
                          className="text-xs whitespace-nowrap"
                        >
                          {item.status === "approved"
                            ? "Onaylandı"
                            : item.status === "rejected"
                            ? "Reddedildi"
                            : "Onay Bekliyor"}
                        </Badge>
                      </TableCell>
                      <TableCell
                        className="whitespace-nowrap text-xs hidden md:table-cell px-2 py-2 align-middle"
                        onClick={() => toggleRowExpand(item.id)}
                      >
                        {formatDate(item.publishDate)}
                      </TableCell>
                      {showActions && (
                        <TableCell
                          onClick={(e) => e.stopPropagation()}
                          className="px-2 py-2 align-middle"
                        >
                          <div className="flex items-center justify-center gap-1">
                            {item.status !== "approved" && (
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-7 w-7 p-0"
                                onClick={() => handleApprove(item.id)}
                                disabled={processingIds.includes(item.id)}
                              >
                                <Check className="h-4 w-4" />
                              </Button>
                            )}
                            {item.status !== "rejected" && (
                              <Button
                                variant="destructive"
                                size="sm"
                                className="h-7 w-7 p-0"
                                onClick={() => rejectNews(item.id)}
                                disabled={processingIds.includes(item.id)}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            )}
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-7 w-7 p-0"
                              onClick={() => deleteNews(item.id)}
                              disabled={processingIds.includes(item.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      )}
                    </TableRow>
                    {expandedRows[item.id] && (
                      <TableRow className="bg-gray-50 border-t border-b">
                        <TableCell
                          colSpan={showSelect ? 10 : 9}
                          className="p-4"
                        >
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                              {item.image && (
                                <div className="relative h-[160px] sm:h-[200px] w-full rounded-lg overflow-hidden">
                                  <Image
                                    src={item.image}
                                    alt={item.title}
                                    fill
                                    className="object-cover"
                                    onError={(e) => {
                                      const imgElement =
                                        e.target as HTMLImageElement;
                                      imgElement.src =
                                        "https://via.placeholder.com/400x250?text=Görsel+Yok";
                                    }}
                                  />
                                </div>
                              )}
                              <div>
                                <h3 className="text-base font-medium mb-2 break-words">
                                  {item.title}
                                </h3>
                                {item.details?.description &&
                                  item.details.description !== item.title && (
                                    <p className="text-gray-600 mb-2 text-sm italic">
                                      {item.details.description}
                                    </p>
                                  )}

                                {/* Mobile view content */}
                                <div className="md:hidden mt-4 space-y-3">
                                  <div>
                                    <h4 className="text-xs text-gray-500 uppercase tracking-wider mb-1">
                                      Kategori
                                    </h4>
                                    <Badge variant="outline">
                                      {item.category}
                                    </Badge>
                                  </div>

                                  <div>
                                    <h4 className="text-xs text-gray-500 uppercase tracking-wider mb-1">
                                      Eklenme Tarihi
                                    </h4>
                                    <p className="text-sm">
                                      {formatDate(item.publishDate)}
                                    </p>
                                  </div>

                                  {item.tags && item.tags.length > 0 && (
                                    <div>
                                      <h4 className="text-xs text-gray-500 uppercase tracking-wider mb-1">
                                        Etiketler
                                      </h4>
                                      <div className="flex flex-wrap gap-1">
                                        {item.tags.map((tag) => (
                                          <Badge
                                            key={tag}
                                            variant="secondary"
                                            className="text-xs"
                                          >
                                            {tag}
                                          </Badge>
                                        ))}
                                      </div>
                                    </div>
                                  )}
                                </div>

                                <div className="mt-4">
                                  <h4 className="text-xs text-gray-500 uppercase tracking-wider mb-1">
                                    İçerik
                                  </h4>
                                  <p className="text-gray-600 whitespace-pre-wrap text-sm break-words">
                                    {item.content}
                                  </p>
                                </div>
                              </div>
                            </div>
                            <div className="space-y-4">
                              <div className="bg-white p-4 rounded-lg border space-y-3">
                                <h4 className="font-medium text-xs text-gray-500 uppercase tracking-wider">
                                  Haber Detayları
                                </h4>

                                <div className="grid grid-cols-1 gap-3">
                                  <div className="flex items-start gap-2">
                                    <Calendar className="h-4 w-4 text-gray-500 mt-0.5 shrink-0" />
                                    <div>
                                      <p className="text-xs text-gray-500">
                                        Yayın Tarihi
                                      </p>
                                      <p className="text-sm">
                                        {formatDate(item.publishDate)}
                                      </p>
                                    </div>
                                  </div>

                                  <div className="flex items-start gap-2">
                                    <Tag className="h-4 w-4 text-gray-500 mt-0.5 shrink-0" />
                                    <div>
                                      <p className="text-xs text-gray-500">
                                        Kategori
                                      </p>
                                      <Badge variant="outline" className="mt-1">
                                        {item.category}
                                      </Badge>
                                    </div>
                                  </div>

                                  {item.details?.source && (
                                    <div className="flex items-start gap-2">
                                      <Globe className="h-4 w-4 text-gray-500 mt-0.5 shrink-0" />
                                      <div>
                                        <p className="text-xs text-gray-500">
                                          Kaynak
                                        </p>
                                        <p className="text-sm break-words">
                                          {item.details.source}
                                        </p>
                                      </div>
                                    </div>
                                  )}

                                  {item.sourceUrl && (
                                    <div className="flex items-start gap-2">
                                      <LinkIcon className="h-4 w-4 text-gray-500 mt-0.5 shrink-0" />
                                      <div className="w-full overflow-hidden">
                                        <p className="text-xs text-gray-500">
                                          Kaynak URL
                                        </p>
                                        <a
                                          href={item.sourceUrl}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="text-sm text-blue-600 hover:underline block truncate"
                                        >
                                          {item.sourceUrl}
                                        </a>
                                      </div>
                                    </div>
                                  )}

                                  {item.details?.publishedAt && (
                                    <div className="flex items-start gap-2">
                                      <Clock className="h-4 w-4 text-gray-500 mt-0.5 shrink-0" />
                                      <div>
                                        <p className="text-xs text-gray-500">
                                          Orijinal Yayın Tarihi
                                        </p>
                                        <p className="text-sm">
                                          {formatDate(item.details.publishedAt)}
                                        </p>
                                      </div>
                                    </div>
                                  )}

                                  {item.details?.author && (
                                    <div className="flex items-start gap-2">
                                      <User className="h-4 w-4 text-gray-500 mt-0.5 shrink-0" />
                                      <div>
                                        <p className="text-xs text-gray-500">
                                          Yazar
                                        </p>
                                        <p className="text-sm break-words">
                                          {item.details.author}
                                        </p>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </div>

                              {item.tags && item.tags.length > 0 && (
                                <div className="bg-white p-4 rounded-lg border hidden md:block">
                                  <h4 className="font-medium text-xs text-gray-500 uppercase tracking-wider mb-2">
                                    Etiketler
                                  </h4>
                                  <div className="flex flex-wrap gap-1">
                                    {item.tags.map((tag) => (
                                      <Badge
                                        key={tag}
                                        variant="secondary"
                                        className="text-xs"
                                      >
                                        {tag}
                                      </Badge>
                                    ))}
                                  </div>
                                </div>
                              )}

                              {showActions && (
                                <div className="bg-white p-4 rounded-lg border">
                                  <h4 className="font-medium text-xs text-gray-500 uppercase tracking-wider mb-2">
                                    İşlemler
                                  </h4>
                                  <div className="flex flex-wrap gap-2">
                                    {item.status !== "approved" && (
                                      <Button
                                        variant="default"
                                        onClick={() => handleApprove(item.id)}
                                        disabled={processingIds.includes(
                                          item.id
                                        )}
                                        className="flex-1 text-xs h-9"
                                        size="sm"
                                      >
                                        <Check className="h-3 w-3 mr-1" />
                                        Onayla
                                      </Button>
                                    )}
                                    {item.status !== "rejected" && (
                                      <Button
                                        variant="destructive"
                                        onClick={() => rejectNews(item.id)}
                                        disabled={processingIds.includes(
                                          item.id
                                        )}
                                        className="flex-1 text-xs h-9"
                                        size="sm"
                                      >
                                        <X className="h-3 w-3 mr-1" />
                                        Reddet
                                      </Button>
                                    )}
                                    <Button
                                      variant="outline"
                                      onClick={() => deleteNews(item.id)}
                                      disabled={processingIds.includes(item.id)}
                                      className="flex-1 text-xs h-9"
                                      size="sm"
                                    >
                                      <Trash2 className="h-3 w-3 mr-1" />
                                      Sil
                                    </Button>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </React.Fragment>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Debugging Info - Only in development */}
          {process.env.NODE_ENV === "development" && (
            <div className="bg-gray-100 p-2 mb-2 rounded text-xs">
              <div>
                Items: {news.length} / Total: {totalCount}
              </div>
              <div>
                Current Page: {currentPage} / Total Pages: {totalPages}
              </div>
              <div>Page Size: {pageSize}</div>
            </div>
          )}

          {/* Pagination */}
          {hasPagination && (
            <div className="mt-4">
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
            </div>
          )}

          {/* Page size selector */}
          {onPageSizeChange && (
            <div className="mt-4 flex justify-end items-center gap-2">
              <span className="text-sm text-muted-foreground">
                Sayfa başına:
              </span>
              <select
                value={pageSize}
                onChange={(e) => handlePageSizeChange(Number(e.target.value))}
                className="p-2 text-sm border rounded-md"
              >
                <option value="5">5</option>
                <option value="10">10</option>
                <option value="20">20</option>
                <option value="50">50</option>
              </select>
            </div>
          )}
        </>
      )}
    </div>
  );
}
