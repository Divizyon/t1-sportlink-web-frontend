"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNews } from "@/hooks/useNews";
import { NewsTable } from "@/components/news/NewsTable";
import { NewsUrlInput } from "@/components/news/NewsUrlInput";
import { Badge } from "@/components/ui/badge";
import { useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";

export default function NewsPage() {
  const { news, filteredNews, loading, filters, setFilters, pendingCount } = useNews();
  const { toast } = useToast();

  // Onay bekleyen haber sayısını takip et
  useEffect(() => {
    if (pendingCount > 0) {
      toast({
        title: "Yeni Onay Bekleyen Haberler",
        description: `${pendingCount} haber onay bekliyor.`,
        variant: "default",
      });
    }
  }, [pendingCount, toast]);

  return (
    <div className="container mx-auto p-4 flex flex-col min-h-screen">
      {/* Üst Kısım - Tabs */}
      <div className="flex-grow">
        <Tabs defaultValue="search" className="mb-6">
          <TabsList className="mb-4">
            <TabsTrigger value="search">Haber Ara</TabsTrigger>
            <TabsTrigger value="pending" className="relative">
              Onay Bekleyenler
              {pendingCount > 0 && (
                <Badge variant="destructive" className="ml-2 absolute -top-2 -right-2">
                  {pendingCount}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="approved">Tüm Haberler</TabsTrigger>
          </TabsList>

          <TabsContent value="search">
            <NewsTable 
              news={filteredNews} 
              loading={loading}
              showActions={false}
            />
          </TabsContent>

          <TabsContent value="pending">
            <NewsTable 
              news={filteredNews.filter(item => item.status === "pending")} 
              loading={loading}
              showActions={true}
              showSelect={true}
            />
          </TabsContent>

          <TabsContent value="approved">
            <NewsTable 
              news={filteredNews.filter(item => item.status === "approved")} 
              loading={loading}
              showActions={false}
            />
          </TabsContent>
        </Tabs>
      </div>

      {/* Alt Kısım - URL Girişi */}
      <div className="mt-auto pt-6 border-t">
        <NewsUrlInput />
      </div>
    </div>
  );
} 