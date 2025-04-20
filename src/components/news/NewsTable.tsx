"use client"

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useNews } from "@/hooks/useNews";
import type { NewsItem } from "@/types/news";
import { formatDate } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { tr } from "date-fns/locale";
import { Check, X, Trash2, ExternalLink } from "lucide-react";
import Image from "next/image";

interface NewsTableProps {
  news: NewsItem[];
  loading: boolean;
  showActions: boolean;
  showSelect?: boolean;
}

export function NewsTable({ news, loading, showActions, showSelect }: NewsTableProps) {
  const { toggleNewsSelection, toggleSelectAll, approveNews, rejectNews, deleteNews } = useNews();
  const { toast } = useToast();
  const [processingIds, setProcessingIds] = useState<string[]>([]);

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "d MMMM yyyy HH:mm", { locale: tr });
  };

  const handleSelectAll = () => {
    toggleSelectAll(true);
  };

  const handleSelect = (id: string) => {
    toggleNewsSelection(id);
  };

  const handleApprove = async (id: string) => {
    try {
      setProcessingIds(prev => [...prev, id]);
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
      setProcessingIds(prev => prev.filter(item => item !== id));
    }
  };

  const handleRejectSelected = async () => {
    try {
      const selectedNews = news.filter(item => item.selected);
      if (selectedNews.length === 0) {
        toast({
          title: "Uyarı",
          description: "Lütfen reddedilecek haberleri seçin",
          variant: "destructive",
        });
        return;
      }

      const result = await rejectNews();
      
      if (result.error) {
        toast({
          title: "Hata",
          description: result.error,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Başarılı",
          description: `${result.count} haber başarıyla reddedildi.`,
        });
        toggleSelectAll(false);
      }
    } catch (error) {
      toast({
        title: "Hata",
        description: "Haberler reddedilirken bir hata oluştu",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Yükleniyor...</span>
      </div>
    );
  }

  if (news.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        Haber bulunamadı.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {showSelect && (
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Checkbox
              checked={news.every(item => item.selected)}
              onCheckedChange={handleSelectAll}
            />
            <span>Tümünü Seç</span>
          </div>
          <Button
            variant="destructive"
            onClick={handleRejectSelected}
            disabled={!news.some(item => item.selected)}
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
                <TableHead className="w-12">
                  <Checkbox
                    onCheckedChange={(checked) => toggleSelectAll(!!checked)}
                  />
                </TableHead>
              )}
              <TableHead>Görsel</TableHead>
              <TableHead>Başlık</TableHead>
              <TableHead>İçerik</TableHead>
              <TableHead>Kategori</TableHead>
              <TableHead>Etiketler</TableHead>
              <TableHead>Durum</TableHead>
              <TableHead>Eklenme Tarihi</TableHead>
              {showActions && <TableHead>İşlemler</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {news.map((item) => (
              <TableRow key={item.id} className="cursor-pointer hover:bg-gray-50">
                {showSelect && (
                  <TableCell>
                    <Checkbox
                      checked={item.selected}
                      onCheckedChange={() => handleSelect(item.id)}
                    />
                  </TableCell>
                )}
                <TableCell>
                  {item.image && (
                    <div className="relative h-20 w-32">
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        className="object-cover rounded"
                      />
                    </div>
                  )}
                </TableCell>
                <TableCell className="font-medium max-w-xs">
                  <div className="line-clamp-2">{item.title}</div>
                  {item.sourceUrl && (
                    <a
                      href={item.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:underline flex items-center gap-1 mt-1"
                    >
                      Kaynağa Git
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  )}
                </TableCell>
                <TableCell className="max-w-md">
                  <div className="line-clamp-3">{item.content}</div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{item.category}</Badge>
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {item.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge
                    variant={
                      item.status === "approved"
                        ? "default"
                        : item.status === "rejected"
                        ? "destructive"
                        : "secondary"
                    }
                  >
                    {item.status === "approved"
                      ? "Onaylandı"
                      : item.status === "rejected"
                      ? "Reddedildi"
                      : "Onay Bekliyor"}
                  </Badge>
                </TableCell>
                <TableCell className="whitespace-nowrap">
                  {formatDate(item.publishDate)}
                </TableCell>
                {showActions && (
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleApprove(item.id)}
                        disabled={item.status === "approved"}
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => rejectNews(item.id)}
                        disabled={item.status === "rejected"}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => deleteNews(item.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
} 