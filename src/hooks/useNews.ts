"use client";

import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { useToast } from "@/components/ui/use-toast";
import type { NewsItem } from "@/types/news";
import type { NewsFilters } from "@/types/news";
import { useSingleFetch } from "@/hooks";

// Mock haberler
export const MOCK_NEWS: NewsItem[] = [
  {
    id: "1",
    title: "Fenerbahçe'den muhteşem galibiyet",
    content:
      "Fenerbahçe, Süper Lig'de oynadığı son maçta rakibini 3-0 mağlup etti. Sarı-lacivertliler, bu galibiyetle puanını 65'e yükseltti.",
    category: "Spor",
    image: "https://example.com/fb-galibiyet.jpg",
    publishDate: new Date().toISOString(),
    tags: ["futbol", "süper lig"],
    status: "pending",
    hasImage: true,
    contentLength: 123,
    imageStatus: "available",
    showDetails: false,
  },
  {
    id: "2",
    title: "Basketbolda büyük başarı",
    content:
      "Türkiye Basketbol Milli Takımı, Avrupa Şampiyonası'nda çeyrek finale yükseldi. Milliler, son maçında güçlü rakibini uzatmalarda mağlup etmeyi başardı.",
    category: "Spor",
    image: "https://example.com/basket-basari.jpg",
    publishDate: new Date().toISOString(),
    tags: ["basketbol", "milli takım"],
    status: "pending",
    hasImage: true,
    contentLength: 156,
    imageStatus: "available",
    showDetails: false,
  },
  {
    id: "3",
    title: "Galatasaray'da transfer hareketliliği",
    content:
      "Galatasaray, transfer döneminde önemli hamleler yapmaya hazırlanıyor. Teknik direktör, kadroya yeni yüzler katmak için çalışmalara başladı.",
    category: "Spor",
    image: "https://example.com/gs-transfer.jpg",
    publishDate: new Date().toISOString(),
    tags: ["futbol", "transfer"],
    status: "pending",
    hasImage: true,
    contentLength: 145,
    imageStatus: "available",
    showDetails: false,
  },
  {
    id: "4",
    title: "Voleybol Milli Takımı'ndan başarı",
    content:
      "Türkiye Voleybol Milli Takımı, Avrupa Şampiyonası'nda grup maçlarını lider tamamladı. Milliler, çeyrek finalde güçlü rakibiyle karşılaşacak.",
    category: "Spor",
    image: "https://example.com/voleybol-basari.jpg",
    publishDate: new Date().toISOString(),
    tags: ["voleybol", "milli takım"],
    status: "pending",
    hasImage: true,
    contentLength: 167,
    imageStatus: "available",
    showDetails: false,
  },
];

// Kalıcı depolama için localStorage anahtarı
const STORAGE_KEY = "sportlink-news";

// Haberleri localStorage'dan yükle
const loadNewsFromStorage = (): NewsItem[] => {
  if (typeof window === "undefined") return [];
  const stored = localStorage.getItem(STORAGE_KEY);
  console.log("Stored news:", stored);
  if (!stored) {
    console.log("No stored news found, using mock news");
    return [...MOCK_NEWS];
  }
  return JSON.parse(stored);
};

// Haberleri localStorage'a kaydet
const saveNewsToStorage = (news: NewsItem[]) => {
  if (typeof window === "undefined") return;
  console.log("Saving news to storage:", news);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(news));
};

export const useNews = () => {
  const { toast } = useToast();
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<NewsFilters>({
    category: "",
    searchTerm: "",
    status: "pending",
  });

  // Function to load news from storage or API
  const loadNews = useCallback(async () => {
    try {
      const loadedNews = loadNewsFromStorage();
      setNews(loadedNews);

      // Here we would typically also fetch from API if needed
      // This is where you would add your API fetch logic
    } catch (error) {
      console.error("Error loading news:", error);
      // Fallback to mock data in case of error
      setNews([...MOCK_NEWS]);
    }
  }, []);

  // Use our pattern to prevent multiple fetches
  useSingleFetch(loadNews);

  // Haberler değiştiğinde localStorage'a kaydet
  useEffect(() => {
    saveNewsToStorage(news);
  }, [news]);

  // Haberi sil
  const deleteNews = useCallback(
    (id: string) => {
      setNews((prevNews) => {
        const updatedNews = prevNews.filter((item) => item.id !== id);
        saveNewsToStorage(updatedNews);
        return updatedNews;
      });

      toast({
        title: "Haber Silindi",
        description: "Haber başarıyla silindi.",
        variant: "default",
      });
    },
    [toast]
  );

  // Toplu haber silme
  const deleteSelectedNews = useCallback(() => {
    setNews((prevNews) => {
      const updatedNews = prevNews.filter((item) => !item.selected);
      saveNewsToStorage(updatedNews);
      return updatedNews;
    });

    toast({
      title: "Haberler Silindi",
      description: "Seçili haberler başarıyla silindi.",
      variant: "default",
    });
  }, [toast]);

  // Filtrelenmiş haberler
  const filteredNews = useMemo(() => {
    console.log("Filtreleme yapılıyor:", { filters, news });

    const filtered = news.filter((item) => {
      // Kategori filtresi
      if (filters.category) {
        if (Array.isArray(filters.category)) {
          if (
            filters.category.length > 0 &&
            !filters.category.includes(item.category)
          ) {
            return false;
          }
        } else if (
          filters.category !== "all" &&
          item.category !== filters.category
        ) {
          return false;
        }
      }

      // Durum filtresi
      if (filters.status) {
        // Status filtresindeki değeri ve haberin durumunu logla
        console.log(
          `Haber ID: ${item.id}, Status: ${item.status}, Filtre: ${filters.status}`
        );
        if (item.status !== filters.status) {
          return false;
        }
      }

      // Arama filtresi
      if (filters.searchTerm && filters.searchTerm.trim() !== "") {
        const searchTerm = filters.searchTerm.toLowerCase();
        return (
          item.title.toLowerCase().includes(searchTerm) ||
          item.content.toLowerCase().includes(searchTerm) ||
          (item.tags &&
            item.tags.some((tag) => tag.toLowerCase().includes(searchTerm)))
        );
      }

      return true;
    });

    console.log(`Filtreleme sonucu: ${filtered.length} haber bulundu`);
    return filtered;
  }, [news, filters]);

  // Onay bekleyen haber sayısı
  const pendingCount = useMemo(() => {
    return news.filter((item) => item.status === "pending").length;
  }, [news]);

  // URL'den haber ekle
  const addNewsFromUrl = useCallback(
    async (mockNews: any[] = [], url: string = "") => {
      try {
        setLoading(true);
        setError(null);

        // Gelen haberleri kontrol et
        const newsData =
          Array.isArray(mockNews) && mockNews.length > 0 ? mockNews : [];

        if (newsData.length > 0) {
          // Haberleri onay bekleyen olarak ekle
          const pendingNews = newsData.map((news) => ({
            ...news,
            status: "pending",
            sourceUrl: url || news.sourceUrl || "",
            addedAt: new Date().toISOString(),
            selected: false,
          }));

          // Yeni haberleri mevcut haberlere ekle
          setNews((prevNews) => [...prevNews, ...pendingNews]);

          return { count: newsData.length };
        } else {
          return { error: "Haber bulunamadı" };
        }
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Bir hata oluştu";
        setError(errorMessage);
        return { error: errorMessage };
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // Haberi seç/seçimi kaldır
  const toggleNewsSelection = useCallback((id: string) => {
    setNews((prevNews) =>
      prevNews.map((item) =>
        item.id === id ? { ...item, selected: !item.selected } : item
      )
    );
  }, []);

  // Tüm haberleri seç/seçimi kaldır
  const toggleSelectAll = useCallback((select: boolean) => {
    setNews((prevNews) =>
      prevNews.map((item) => ({ ...item, selected: select }))
    );
  }, []);

  // Haberi onayla
  const approveNews = useCallback(
    async (id: string) => {
      try {
        console.log(`${id} ID'li haber onaylanıyor...`);

        setNews((prevNews) => {
          const updatedNews = prevNews.map((item) =>
            item.id === id
              ? {
                  ...item,
                  status: "approved" as const,
                  approvedAt: new Date().toISOString(),
                }
              : item
          );
          console.log("Onaylamadan sonra haberler:", updatedNews);
          return updatedNews;
        });

        toast({
          title: "Haber Onaylandı",
          description: "Haber başarıyla onaylandı ve yayına alındı.",
          variant: "default",
        });

        return { success: true };
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Bir hata oluştu";
        setError(errorMessage);
        return { error: errorMessage };
      }
    },
    [toast]
  );

  // Haberi reddet
  const rejectNews = useCallback(
    async (id: string) => {
      try {
        setNews((prevNews) =>
          prevNews.map((item) =>
            item.id === id
              ? {
                  ...item,
                  status: "rejected",
                  rejectedAt: new Date().toISOString(),
                }
              : item
          )
        );

        toast({
          title: "Haber Reddedildi",
          description: "Haber başarıyla reddedildi.",
          variant: "default",
        });

        return { success: true };
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Bir hata oluştu";
        setError(errorMessage);
        return { error: errorMessage };
      }
    },
    [toast]
  );

  return {
    news,
    filteredNews,
    loading,
    error,
    filters,
    setFilters,
    pendingCount,
    addNewsFromUrl,
    deleteNews,
    deleteSelectedNews,
    approveNews,
    rejectNews,
    toggleNewsSelection,
    toggleSelectAll,
    setNews,
  };
};
