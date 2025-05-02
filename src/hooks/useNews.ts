"use client";

import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { useToast } from "@/components/ui/use-toast";
import type { NewsItem } from "@/types/news";
import type { NewsFilters } from "@/types/news";
import { useSingleFetch } from "@/hooks";
import {
  SPORTS_CATEGORIES,
  getNews,
  getNewsById,
  updateNewsStatus,
  deleteNews as apiDeleteNews,
  scrapeNewsFromUrl,
  updateNewsItem,
  getPendingNews,
  getRejectedNews,
} from "@/services/newsService";
import { PAGINATION_DEFAULTS } from "@/constants/dashboard";

// Local storage key for announcements
const STORAGE_KEY = "sportlink-announcements";

// Save announcements to localStorage
const saveAnnouncementsToStorage = (announcements: NewsItem[]) => {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(announcements));
};

// Load announcements from localStorage
const loadAnnouncementsFromStorage = (): NewsItem[] => {
  if (typeof window === "undefined") return [];
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return [];
  try {
    return JSON.parse(stored);
  } catch (error) {
    console.error("Error parsing announcements from storage:", error);
    return [];
  }
};

// Load locally rejected news from localStorage
const loadRejectedNewsFromStorage = (): NewsItem[] => {
  if (typeof window === "undefined") return [];

  try {
    // Get all localStorage keys
    const keys = Object.keys(localStorage);
    // Filter for rejected news items
    const rejectedKeys = keys.filter((key) => key.startsWith("rejected-news-"));

    if (rejectedKeys.length === 0) return [];

    // Get all rejected news items
    return rejectedKeys
      .map((key) => {
        try {
          return JSON.parse(localStorage.getItem(key) || "");
        } catch (e) {
          return null;
        }
      })
      .filter(Boolean) as NewsItem[];
  } catch (error) {
    console.error("Error loading rejected news from storage:", error);
    return [];
  }
};

export const useNews = () => {
  const { toast } = useToast();
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<NewsFilters>({
    category: "",
    searchTerm: "",
    status: "approved",
  });

  // Pagination state
  const [pagination, setPagination] = useState({
    page: PAGINATION_DEFAULTS.defaultPage,
    limit: PAGINATION_DEFAULTS.defaultLimit,
    total: 0,
  });

  // Ref to track if component is mounted
  const isMounted = useRef(true);
  // Use a ref to track the current call to avoid race conditions
  const currentLoadNewsCall = useRef<number>(0);
  // Track if we have an active request to prevent duplicates
  const hasActiveRequest = useRef(false);
  // Track last successful load timestamp for each status type
  const lastSuccessfulLoad = useRef<Record<string, number>>({});

  // Clean up on unmount
  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  // Function to load news from API with optional status filtering and pagination
  const loadNews = useCallback(async () => {
    // If we're already loading, don't start another request
    if (hasActiveRequest.current) {
      return;
    }

    // Skip if there's no status filter (prevents unnecessary API calls)
    if (!filters.status) {
      return;
    }

    // Check if we've loaded this status recently (debounce)
    const now = Date.now();
    const lastLoad = lastSuccessfulLoad.current[filters.status] || 0;
    if (now - lastLoad < 300 && lastLoad > 0) {
      // 300ms debounce
      return;
    }

    try {
      // Generate a unique call ID
      const callId = Date.now();
      currentLoadNewsCall.current = callId;
      hasActiveRequest.current = true;

      setLoading(true);
      setError(null);

      // First we'll load announcements from storage to preserve them
      let localAnnouncements: NewsItem[] = [];
      if (typeof window !== "undefined") {
        localAnnouncements = loadAnnouncementsFromStorage();
      }

      // Check for locally stored rejected news if we're on the rejected tab
      let localRejectedNews: NewsItem[] = [];
      if (filters.status === "rejected" && typeof window !== "undefined") {
        localRejectedNews = loadRejectedNewsFromStorage();
      }

      try {
        // If this call has been superseded by a newer one, exit early
        if (currentLoadNewsCall.current !== callId || !isMounted.current)
          return;

        let apiNews: NewsItem[] = [];
        let totalCount = 0;

        // Calculate offset from page and limit
        const offset = (pagination.page - 1) * pagination.limit;

        // Use status-specific endpoints for better performance and filtering
        if (filters.status === "pending") {
          const { data, count } = await getPendingNews({
            limit: pagination.limit,
            offset,
          });

          // If this call has been superseded, exit early
          if (currentLoadNewsCall.current !== callId || !isMounted.current)
            return;

          // Force the correct status - override whatever the API returns
          apiNews = data.map((item) => ({
            ...item,
            status: "pending" as const,
          }));
          totalCount = count;
        } else if (filters.status === "rejected") {
          const { data, count } = await getRejectedNews({
            limit: pagination.limit,
            offset,
          });

          // If this call has been superseded, exit early
          if (currentLoadNewsCall.current !== callId || !isMounted.current)
            return;

          // Force the correct status - override whatever the API returns
          apiNews = data.map((item) => ({
            ...item,
            status: "rejected" as const,
          }));
          totalCount = count;
        } else {
          // For approved or all news, use the general getNews endpoint
          const apiParams: any = {
            limit: pagination.limit,
            offset,
          };

          if (filters.status) {
            apiParams.status = filters.status;
          }

          const { data, count } = await getNews(apiParams);

          // If this call has been superseded, exit early
          if (currentLoadNewsCall.current !== callId || !isMounted.current)
            return;

          // Force the correct status - override whatever the API returns
          apiNews = data.map((item) => ({
            ...item,
            status: "approved" as const,
          }));
          totalCount = count;
        }

        // Update pagination with total count
        if (isMounted.current) {
          let adjustedTotalCount = totalCount;

          // Adjust the total count to include local items if needed
          if (filters.status === "rejected") {
            adjustedTotalCount += localRejectedNews.length;
          }

          setPagination((prev) => ({
            ...prev,
            total: adjustedTotalCount,
          }));

          // For announcements, only include them in the appropriate tab (approved)
          // and combine them with apiNews only when needed
          let combinedNews = [...apiNews];

          if (filters.status === "approved") {
            // Only add announcements to approved news
            combinedNews = [
              ...apiNews,
              ...localAnnouncements.filter(
                (item) => item.status === "approved"
              ),
            ];
          } else if (
            filters.status === "rejected" &&
            localRejectedNews.length > 0
          ) {
            // Add locally stored rejected news
            combinedNews = [...apiNews, ...localRejectedNews];
          }

          // Make sure all news items have the correct status
          combinedNews = combinedNews.map((item) => ({
            ...item,
            status: filters.status as "approved" | "pending" | "rejected",
          }));

          // Set news directly to the filtered results based on current status
          setNews(combinedNews);

          // Record the successful load timestamp for this status
          lastSuccessfulLoad.current[filters.status] = Date.now();
        }
      } catch (apiError) {
        // Only update state if component is still mounted and this is the latest call
        if (currentLoadNewsCall.current === callId && isMounted.current) {
          // If API fails, just show announcements if any
          setNews(filters.status === "approved" ? localAnnouncements : []);
          setError(
            "Sunucudan haberler yüklenemedi. Lütfen daha sonra tekrar deneyin."
          );
        }
      }
    } catch (error) {
      if (isMounted.current) {
        setError("Haberler yüklenirken bir hata oluştu.");
      }
    } finally {
      if (isMounted.current) {
        setLoading(false);
      }
      // Always reset active request flag after a short delay to prevent rapid re-calls
      setTimeout(() => {
        hasActiveRequest.current = false;
      }, 200);
    }
  }, [filters.status, pagination.page, pagination.limit]);

  // Load news when filters or pagination change
  useEffect(() => {
    // Skip early loading while component is getting initialized
    if (!filters.status) {
      return;
    }

    // Reset news array when filters change to prevent showing stale data
    setNews([]);

    // Use a small timeout to debounce rapid changes
    const timeoutId = setTimeout(() => {
      loadNews();
    }, 50);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [filters.status, pagination.page, pagination.limit, loadNews]);

  // Handle page change
  const handlePageChange = useCallback(
    (page: number) => {
      // Only update if actually changing pages
      if (pagination.page !== page) {
        setPagination((prev) => ({
          ...prev,
          page,
        }));
      }
    },
    [pagination.page]
  );

  // Handle page size change
  const handlePageSizeChange = useCallback(
    (pageSize: number) => {
      // Only update if actually changing page size
      if (pagination.limit !== pageSize) {
        setPagination((prev) => ({
          ...prev,
          limit: pageSize,
          page: 1, // Reset to first page when changing page size
        }));
      }
    },
    [pagination.limit]
  );

  // Save announcements when news changes
  useEffect(() => {
    const announcements = news.filter((item) => item.type === "announcement");
    if (announcements.length > 0) {
      saveAnnouncementsToStorage(announcements);
    }
  }, [news]);

  // Haberi sil - now uses API for non-announcement items
  const deleteNews = useCallback(
    async (id: string) => {
      try {
        const newsItem = news.find((item) => item.id === id);

        // If it's an announcement, just remove locally
        if (newsItem?.type === "announcement") {
          setNews((prevNews) => {
            const updatedNews = prevNews.filter((item) => item.id !== id);
            return updatedNews;
          });

          // Update announcements in storage
          const announcements = news.filter(
            (item) => item.type === "announcement" && item.id !== id
          );
          saveAnnouncementsToStorage(announcements);
        } else {
          // For regular news, call the API
          await apiDeleteNews(id);

          // Also try to remove from localStorage if it was stored there
          if (typeof window !== "undefined") {
            localStorage.removeItem(`rejected-news-${id}`);
          }

          // Then update local state
          setNews((prevNews) => prevNews.filter((item) => item.id !== id));
        }

        toast({
          title: "Haber Silindi",
          description: "Haber başarıyla silindi.",
          variant: "default",
        });
      } catch (error) {
        console.error("Error deleting news:", error);
        toast({
          title: "Hata",
          description: "Haber silinirken bir hata oluştu.",
          variant: "destructive",
        });
      }
    },
    [toast, news]
  );

  // Toplu haber silme
  const deleteSelectedNews = useCallback(() => {
    // Get selected news items
    const selectedItems = news.filter((item) => item.selected);
    if (selectedItems.length === 0) return;

    // Group by type (announcement vs regular news)
    const announcements = selectedItems.filter(
      (item) => item.type === "announcement"
    );
    const regularNews = selectedItems.filter(
      (item) => item.type !== "announcement"
    );

    // Process regular news items through API
    const processRegularItems = async () => {
      for (const item of regularNews) {
        try {
          await apiDeleteNews(item.id);
        } catch (error) {
          console.error(`Error deleting news item ${item.id}:`, error);
        }
      }
    };

    // Process all
    Promise.resolve(processRegularItems()).then(() => {
      // Update local state
      setNews((prevNews) => prevNews.filter((item) => !item.selected));

      // Update announcements in storage
      const remainingAnnouncements = news.filter(
        (item) => item.type === "announcement" && !item.selected
      );
      saveAnnouncementsToStorage(remainingAnnouncements);

      toast({
        title: "Haberler Silindi",
        description: "Seçili haberler başarıyla silindi.",
        variant: "default",
      });
    });
  }, [toast, news]);

  // URL'den haber ekle
  const addNewsFromUrl = useCallback(
    async (mockNews: any[] = [], url: string = "", sport_id?: number) => {
      try {
        setLoading(true);
        setError(null);

        // Check if the URL contains category information to auto-detect sport ID
        let effectiveSportId = sport_id;
        if (!effectiveSportId && url) {
          // Auto-detect sport from URL if possible
          const lowerUrl = url.toLowerCase();
          if (
            lowerUrl.includes("basketbol") ||
            lowerUrl.includes("basketball")
          ) {
            effectiveSportId = SPORTS_CATEGORIES.BASKETBALL;
          } else if (
            lowerUrl.includes("futbol") ||
            lowerUrl.includes("football")
          ) {
            effectiveSportId = SPORTS_CATEGORIES.FOOTBALL;
          } else if (
            lowerUrl.includes("voleybol") ||
            lowerUrl.includes("volleyball")
          ) {
            effectiveSportId = SPORTS_CATEGORIES.VOLLEYBALL;
          } else if (
            lowerUrl.includes("tenis") ||
            lowerUrl.includes("tennis")
          ) {
            effectiveSportId = SPORTS_CATEGORIES.TENNIS;
          } else {
            // Default to football if can't determine
            effectiveSportId = SPORTS_CATEGORIES.FOOTBALL;
          }
        }

        // If we're scraping from URL, call the scraping API
        if (url && url.trim() !== "") {
          try {
            // Call the scraping API with the detected sport ID
            const response = await scrapeNewsFromUrl(
              url,
              effectiveSportId || SPORTS_CATEGORIES.FOOTBALL
            );
            if (response.data && response.data.length > 0) {
              // Add scraped news to the state
              const scrapedNews = response.data.map((news: any) => ({
                ...news,
                status: "pending",
                sourceUrl: url,
                addedAt: new Date().toISOString(),
                selected: false,
              }));

              setNews((prevNews) => [...prevNews, ...scrapedNews]);
              return { count: scrapedNews.length };
            } else {
              return { error: "Haber bulunamadı veya çekilemedi" };
            }
          } catch (error) {
            console.error("News scraping error:", error);
            throw new Error("Haber kaynağından veri çekilemedi");
          }
        }

        // No URL provided
        return { error: "Lütfen bir URL girin" };
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
  const toggleSelectAll = useCallback(
    (select: boolean, targetIds?: string[]) => {
      setNews((prevNews: NewsItem[]) => {
        // If targetIds is provided, only toggle those specific IDs
        // Otherwise toggle all news items
        if (targetIds && targetIds.length > 0) {
          return prevNews.map((item) =>
            targetIds.includes(item.id) ? { ...item, selected: select } : item
          );
        } else {
          // Toggle all news items if no specific IDs are provided
          return prevNews.map((item) => ({ ...item, selected: select }));
        }
      });
    },
    []
  );

  // Haberi onayla - now uses API
  const approveNews = useCallback(
    async (id: string) => {
      try {
        const newsItem = news.find((item) => item.id === id);

        // If it's an announcement, just update locally
        if (newsItem?.type === "announcement") {
          setNews((prevNews) => {
            return prevNews.map((item) =>
              item.id === id
                ? {
                    ...item,
                    status: "approved" as const,
                    approvedAt: new Date().toISOString(),
                  }
                : item
            );
          });

          // Update announcements in storage
          const announcements = news
            .filter((item) => item.type === "announcement")
            .map((item) =>
              item.id === id
                ? {
                    ...item,
                    status: "approved" as const,
                    approvedAt: new Date().toISOString(),
                  }
                : item
            );

          saveAnnouncementsToStorage(announcements);
        } else {
          // For regular news, call the API
          await updateNewsStatus(id, "approved");

          // Then update local state
          setNews((prevNews) => {
            return prevNews.map((item) =>
              item.id === id
                ? {
                    ...item,
                    status: "approved" as const,
                    approvedAt: new Date().toISOString(),
                  }
                : item
            );
          });
        }

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

        toast({
          title: "Hata",
          description: errorMessage,
          variant: "destructive",
        });

        return { error: errorMessage };
      }
    },
    [toast, news]
  );

  // Haberi reddet - now uses API
  const rejectNews = useCallback(
    async (id: string) => {
      try {
        const newsItem = news.find((item) => item.id === id);

        // If it's an announcement, just update locally
        if (newsItem?.type === "announcement") {
          setNews((prevNews) =>
            prevNews.map((item) =>
              item.id === id
                ? {
                    ...item,
                    status: "rejected" as const,
                    rejectedAt: new Date().toISOString(),
                  }
                : item
            )
          );

          // Update announcements in storage
          const announcements = news
            .filter((item) => item.type === "announcement")
            .map((item) =>
              item.id === id
                ? {
                    ...item,
                    status: "rejected" as const,
                    rejectedAt: new Date().toISOString(),
                  }
                : item
            );

          saveAnnouncementsToStorage(announcements);
        } else {
          // For regular news, call the API
          await updateNewsStatus(id, "rejected");

          // Update local state regardless of API response
          // The backend might delete instead of updating status
          setNews((prevNews) => {
            // First remove the item with matching ID (in case it's being deleted on backend)
            const filteredNews = prevNews.filter((item) => item.id !== id);

            // If we still want to keep a record of the rejected item, add it back with rejected status
            const rejectedItem = prevNews.find((item) => item.id === id);
            if (rejectedItem) {
              // Store the item in localStorage for rejected tab
              console.log(
                `Manually updating status for news ID ${id} to rejected`
              );
              localStorage.setItem(
                `rejected-news-${id}`,
                JSON.stringify({
                  ...rejectedItem,
                  status: "rejected" as const,
                  rejectedAt: new Date().toISOString(),
                })
              );
            }

            return filteredNews;
          });
        }

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

        toast({
          title: "Hata",
          description: errorMessage,
          variant: "destructive",
        });

        return { error: errorMessage };
      }
    },
    [toast, news]
  );

  // Update a news item - uses API for non-announcement items
  const updateNews = useCallback(
    async (updatedItem: NewsItem) => {
      try {
        // If it's an announcement, just update locally
        if (updatedItem.type === "announcement") {
          setNews((prevNews) =>
            prevNews.map((item) =>
              item.id === updatedItem.id ? updatedItem : item
            )
          );

          // Update announcements in storage
          const announcements = news
            .map((item) =>
              item.type === "announcement" && item.id === updatedItem.id
                ? updatedItem
                : item
            )
            .filter((item) => item.type === "announcement");

          saveAnnouncementsToStorage(announcements);
        } else {
          // For regular news, call the API
          // Use a PUT request to update news item
          await updateNewsItem(updatedItem.id, {
            title: updatedItem.title,
            content: updatedItem.content,
            sport_id: parseInt(updatedItem.category) || undefined,
            type: updatedItem.type,
            end_time: updatedItem.details?.publishedAt,
          });

          // Then update local state
          setNews((prevNews) =>
            prevNews.map((item) =>
              item.id === updatedItem.id ? updatedItem : item
            )
          );
        }

        toast({
          title: "Haber Güncellendi",
          description: "Haber başarıyla güncellendi.",
          variant: "default",
        });

        return { success: true };
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Bir hata oluştu";
        setError(errorMessage);

        toast({
          title: "Hata",
          description: errorMessage,
          variant: "destructive",
        });

        return { error: errorMessage };
      }
    },
    [toast, news]
  );

  // Updated setFilters function with page reset
  const setFiltersWithPageReset = useCallback(
    (newFilters: Partial<NewsFilters>) => {
      // Skip redundant updates
      if (
        "status" in newFilters &&
        newFilters.status === filters.status &&
        "category" in newFilters &&
        newFilters.category === filters.category &&
        "searchTerm" in newFilters &&
        newFilters.searchTerm === filters.searchTerm
      ) {
        return;
      }

      // If changing status, also reset to page 1
      if ("status" in newFilters && newFilters.status !== filters.status) {
        setPagination((prev) => ({
          ...prev,
          page: 1,
        }));
      }

      // Update the filters
      setFilters((prev) => ({
        ...prev,
        ...newFilters,
      }));
    },
    [filters.status, filters.category, filters.searchTerm]
  );

  // Function to force immediate loading of news with a specific status
  const loadNewsNow = useCallback(
    async (status: "approved" | "pending" | "rejected") => {
      // Never call loadNewsNow if an active request is in progress
      if (hasActiveRequest.current) {
        return;
      }

      // Set the correct filters first - but don't force update if already set to this status
      if (filters.status !== status) {
        setFilters({
          ...filters,
          status: status,
        });
      }

      // Clear any existing news to ensure UI updates
      setNews([]);

      try {
        hasActiveRequest.current = true;
        setLoading(true);
        setError(null);

        // First we'll load announcements from storage to preserve them
        let localAnnouncements: NewsItem[] = [];
        if (typeof window !== "undefined") {
          localAnnouncements = loadAnnouncementsFromStorage();
        }

        // Check for locally stored rejected news if we're loading rejected
        let localRejectedNews: NewsItem[] = [];
        if (status === "rejected" && typeof window !== "undefined") {
          localRejectedNews = loadRejectedNewsFromStorage();
        }

        let apiNews: NewsItem[] = [];
        let totalCount = 0;

        try {
          // Use status-specific endpoints for better performance and filtering
          if (status === "pending") {
            const { data, count } = await getPendingNews({
              limit: pagination.limit,
              offset: 0, // Always start at the first page for direct loading
            });

            // Force the correct status - override whatever the API returns
            apiNews = data.map((item) => ({
              ...item,
              status: "pending" as const,
            }));
            totalCount = count;
          } else if (status === "rejected") {
            const { data, count } = await getRejectedNews({
              limit: pagination.limit,
              offset: 0, // Always start at the first page for direct loading
            });

            // Force the correct status - override whatever the API returns
            apiNews = data.map((item) => ({
              ...item,
              status: "rejected" as const,
            }));
            totalCount = count;
          } else {
            // For approved news
            const { data, count } = await getNews({
              status: "approved",
              limit: pagination.limit,
              offset: 0, // Always start at the first page for direct loading
            });

            // Force the correct status - override whatever the API returns
            apiNews = data.map((item) => ({
              ...item,
              status: "approved" as const,
            }));
            totalCount = count;
          }

          // Reset pagination to first page
          setPagination({
            page: 1,
            limit: pagination.limit,
            total: totalCount,
          });

          // For announcements, only include them in the approved tab
          let combinedNews = [...apiNews];

          if (status === "approved") {
            // Only add announcements to approved news
            combinedNews = [
              ...apiNews,
              ...localAnnouncements.filter(
                (item) => item.status === "approved"
              ),
            ];
          } else if (status === "rejected" && localRejectedNews.length > 0) {
            // Add locally stored rejected news
            combinedNews = [...apiNews, ...localRejectedNews];
          }

          // Make sure all news items have the correct status
          combinedNews = combinedNews.map((item) => ({
            ...item,
            status: status as "approved" | "pending" | "rejected",
          }));

          // Set news directly to the filtered results based on the selected status
          setNews(combinedNews);

          // Record the successful load timestamp for this status
          lastSuccessfulLoad.current[status] = Date.now();
        } catch (apiError) {
          // If API fails, show appropriate message
          setError(
            "Sunucudan haberler yüklenemedi. Lütfen daha sonra tekrar deneyin."
          );
        }
      } catch (error) {
        setError("Haberler yüklenirken bir hata oluştu.");
      } finally {
        setLoading(false);
        // Reset active request flag after a delay
        setTimeout(() => {
          hasActiveRequest.current = false;
        }, 200);
      }
    },
    [filters, pagination.limit]
  );

  return {
    news,
    setNews,
    loading,
    error,
    filters,
    setFilters: setFiltersWithPageReset,
    filteredNews: useMemo(() => {
      // Return only news with matching status to avoid mixing status types
      return news.filter((item) => item.status === filters.status);
    }, [news, filters.status]), // Only depend on news and status
    pendingCount: useMemo(() => {
      return news.filter((item) => item.status === "pending").length;
    }, [news]),
    toggleNewsSelection,
    toggleSelectAll,
    approveNews,
    rejectNews,
    deleteNews,
    deleteSelectedNews,
    updateNews,
    addNewsFromUrl,
    pagination,
    handlePageChange,
    handlePageSizeChange,
    loadNewsNow,
  };
};
