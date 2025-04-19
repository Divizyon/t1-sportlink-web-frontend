import { useState, useEffect, useMemo } from "react";
import { useToast } from "@/components/ui/use-toast";

// Since we don't have predefined types for news, let's create them
interface NewsItem {
  id: number | string;
  title: string;
  content: string;
  author: string;
  publishDate: string;
  category: string;
  image?: string;
  tags?: string[];
  featured?: boolean;
}

interface Announcement {
  id: number | string;
  title: string;
  content: string;
  publishDate: string;
  expiryDate?: string;
  severity: "low" | "medium" | "high";
  isActive: boolean;
}

interface NewsFilters {
  category?: string | string[];
  searchTerm?: string;
  featured?: boolean;
  dateRange?: {
    start: Date;
    end: Date;
  };
}

// Mock data for now - in a real application this would come from an API
const MOCK_NEWS: NewsItem[] = [
  {
    id: 1,
    title: "Yeni Sezon Başlıyor",
    content: "Yeni spor sezonu hakkında tüm detaylar burada!",
    author: "Admin",
    publishDate: "2023-09-01",
    category: "sezon",
    featured: true,
    image: "/images/news/season-start.jpg",
    tags: ["yeni sezon", "duyuru", "başlangıç"],
  },
  {
    id: 2,
    title: "Basketbol Turnuvası Kayıtları Açıldı",
    content: "Üniversitelerarası basketbol turnuvası için kayıtlar başladı.",
    author: "Spor Koordinatörlüğü",
    publishDate: "2023-09-05",
    category: "turnuva",
    image: "/images/news/basketball-tournament.jpg",
    tags: ["basketbol", "turnuva", "kayıt"],
  },
  {
    id: 3,
    title: "Yüzme Havuzu Bakım Çalışması",
    content:
      "Olimpik havuzumuz 15-20 Eylül tarihleri arasında bakımda olacaktır.",
    author: "Tesis Yönetimi",
    publishDate: "2023-09-10",
    category: "tesis",
    tags: ["yüzme", "bakım", "tesis"],
  },
];

const MOCK_ANNOUNCEMENTS: Announcement[] = [
  {
    id: 1,
    title: "Sistem Bakımı",
    content:
      "Sistem 12 Eylül gece 02:00-04:00 saatleri arasında bakımda olacaktır.",
    publishDate: "2023-09-10",
    expiryDate: "2023-09-12",
    severity: "medium",
    isActive: true,
  },
  {
    id: 2,
    title: "Önemli Duyuru: Güvenlik Güncellemesi",
    content:
      "Güvenlik sebebiyle tüm kullanıcıların şifrelerini değiştirmesi gerekmektedir.",
    publishDate: "2023-09-05",
    severity: "high",
    isActive: true,
  },
];

export function useNews(initialFilters: NewsFilters = {}) {
  const { toast } = useToast();
  const [news, setNews] = useState<NewsItem[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [filters, setFilters] = useState<NewsFilters>(initialFilters);

  // Fetch news and announcements
  useEffect(() => {
    const fetchNewsAndAnnouncements = async () => {
      setLoading(true);
      try {
        // In a real application, these would be API calls
        // const newsResponse = await fetch('/api/news');
        // const newsData = await newsResponse.json();
        // setNews(newsData);

        // const announcementsResponse = await fetch('/api/announcements');
        // const announcementsData = await announcementsResponse.json();
        // setAnnouncements(announcementsData);

        // Using mock data for now
        setNews(MOCK_NEWS);
        setAnnouncements(MOCK_ANNOUNCEMENTS);
        setLoading(false);
      } catch (err) {
        setError(
          err instanceof Error ? err : new Error("Failed to fetch news")
        );
        setLoading(false);
      }
    };

    fetchNewsAndAnnouncements();
  }, []);

  // Filter news based on criteria
  const filteredNews = useMemo(() => {
    return news.filter((item) => {
      // Filter by category
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

      // Filter by search term
      if (filters.searchTerm && filters.searchTerm.trim() !== "") {
        const searchTerm = filters.searchTerm.toLowerCase();
        return (
          item.title.toLowerCase().includes(searchTerm) ||
          item.content.toLowerCase().includes(searchTerm) ||
          (item.tags &&
            item.tags.some((tag) => tag.toLowerCase().includes(searchTerm)))
        );
      }

      // Filter by featured status
      if (filters.featured !== undefined) {
        return item.featured === filters.featured;
      }

      // Filter by date range
      if (filters.dateRange) {
        const publishDate = new Date(item.publishDate);
        if (
          publishDate < filters.dateRange.start ||
          publishDate > filters.dateRange.end
        ) {
          return false;
        }
      }

      return true;
    });
  }, [news, filters]);

  // Get active announcements
  const activeAnnouncements = useMemo(() => {
    const today = new Date();
    return announcements.filter((announcement) => {
      if (!announcement.isActive) return false;

      if (announcement.expiryDate) {
        const expiryDate = new Date(announcement.expiryDate);
        if (expiryDate < today) return false;
      }

      return true;
    });
  }, [announcements]);

  // Create a new news item
  const createNews = async (newsData: Omit<NewsItem, "id">) => {
    setLoading(true);
    try {
      // In a real application, this would be an API call
      // const response = await fetch('/api/news', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(newsData)
      // });
      // const createdNews = await response.json();

      // Simulating API response
      const createdNews: NewsItem = {
        ...newsData,
        id: Date.now(), // Generate a temporary ID
      };

      setNews((prevNews) => [createdNews, ...prevNews]);
      setLoading(false);

      toast({
        title: "Haber Oluşturuldu",
        description: `"${newsData.title}" başarıyla yayınlandı.`,
      });

      return createdNews;
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to create news"));
      setLoading(false);

      toast({
        title: "Haber Oluşturulamadı",
        description: "Bir hata oluştu.",
        variant: "destructive",
      });

      throw err;
    }
  };

  // Create a new announcement
  const createAnnouncement = async (
    announcementData: Omit<Announcement, "id">
  ) => {
    setLoading(true);
    try {
      // In a real application, this would be an API call
      // const response = await fetch('/api/announcements', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(announcementData)
      // });
      // const createdAnnouncement = await response.json();

      // Simulating API response
      const createdAnnouncement: Announcement = {
        ...announcementData,
        id: Date.now(), // Generate a temporary ID
      };

      setAnnouncements((prevAnnouncements) => [
        createdAnnouncement,
        ...prevAnnouncements,
      ]);
      setLoading(false);

      toast({
        title: "Duyuru Oluşturuldu",
        description: `"${announcementData.title}" başarıyla yayınlandı.`,
      });

      return createdAnnouncement;
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error("Failed to create announcement")
      );
      setLoading(false);

      toast({
        title: "Duyuru Oluşturulamadı",
        description: "Bir hata oluştu.",
        variant: "destructive",
      });

      throw err;
    }
  };

  // Set category filter
  const setCategoryFilter = (category: string | string[]) => {
    setFilters((prev) => ({
      ...prev,
      category,
    }));
  };

  // Set search filter
  const setSearchFilter = (searchTerm: string) => {
    setFilters((prev) => ({
      ...prev,
      searchTerm,
    }));
  };

  // Set featured filter
  const setFeaturedFilter = (featured: boolean | undefined) => {
    setFilters((prev) => ({
      ...prev,
      featured,
    }));
  };

  // Set date range filter
  const setDateRangeFilter = (start: Date, end: Date) => {
    setFilters((prev) => ({
      ...prev,
      dateRange: { start, end },
    }));
  };

  // Reset all filters
  const resetFilters = () => {
    setFilters({});
  };

  return {
    news,
    filteredNews,
    announcements,
    activeAnnouncements,
    loading,
    error,
    filters,
    createNews,
    createAnnouncement,
    setCategoryFilter,
    setSearchFilter,
    setFeaturedFilter,
    setDateRangeFilter,
    resetFilters,
  };
}
