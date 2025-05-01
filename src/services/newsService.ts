import api from "./api";
import { NewsItem } from "@/types/news";

// Sports category IDs mapping - these match the IDs in the database
export const SPORTS_CATEGORIES = {
  BASKETBALL: 5, // Basketbol - confirmed from logs
  FOOTBALL: 4, // Futbol - based on sport_id value in POST form
  VOLLEYBALL: 6, // Voleybol - estimated
  TENNIS: 7, // Tenis - estimated
  SWIMMING: 8, // Yüzme - estimated
  OTHER: 9, // Diğer - estimated
};

// Interface for API response format
interface NewsResponse {
  status: string;
  data: {
    data: any[];
    count: number;
  };
}

/**
 * Get all news with optional filtering
 */
export const getNews = async (params?: {
  sport_id?: number;
  limit?: number;
  offset?: number;
  status?: "pending" | "approved" | "rejected";
}): Promise<{ data: NewsItem[]; count: number }> => {
  try {
    console.log(`[API] getNews called with params:`, params);
    const response = await api.get<NewsResponse>("/news", { params });

    // Log response stats
    console.log(
      `[API] getNews received ${response.data.data.data.length} items with total count ${response.data.data.count}`
    );

    // Transform API response to match our frontend NewsItem type
    const transformedData: NewsItem[] = response.data.data.data.map(
      (item: any) => ({
        id: item.id.toString(),
        title: item.title,
        content: item.content,
        category: item.Sports ? item.Sports.name : "Genel",
        image: item.image_url || "",
        publishDate: item.published_date,
        tags: item.tags || [],
        status: item.status as "pending" | "approved" | "rejected",
        hasImage: !!item.image_url,
        contentLength: item.content.length,
        imageStatus: item.image_url
          ? ("available" as const)
          : ("error" as const),
        sourceUrl: item.source_url || "",
        type: "news",
        details: {
          source: item.source_url || "",
          publishedAt: item.published_date,
          description:
            item.description ||
            (item.content && item.content !== item.title
              ? item.content.substring(0, 100) +
                (item.content.length > 100 ? "..." : "")
              : "Detay bilgisi bulunmamaktadır."),
          author: item.author || "",
        },
      })
    );

    return {
      data: transformedData,
      count: response.data.data.count,
    };
  } catch (error) {
    console.error("[API] Error fetching news:", error);
    throw error;
  }
};

/**
 * Get news by ID
 */
export const getNewsById = async (id: string): Promise<NewsItem> => {
  try {
    const response = await api.get<NewsResponse>(`/news/${id}`);
    const item = response.data.data.data[0];

    return {
      id: item.id.toString(),
      title: item.title,
      content: item.content,
      category: item.Sports ? item.Sports.name : "Genel",
      image: item.image_url || "",
      publishDate: item.published_date,
      tags: item.tags || [],
      status: item.status as "pending" | "approved" | "rejected",
      hasImage: !!item.image_url,
      contentLength: item.content.length,
      imageStatus: item.image_url ? ("available" as const) : ("error" as const),
      sourceUrl: item.source_url || "",
      type: "news",
      details: {
        source: item.source_url || "",
        publishedAt: item.published_date,
        description:
          item.description ||
          (item.content && item.content !== item.title
            ? item.content.substring(0, 100) +
              (item.content.length > 100 ? "..." : "")
            : "Detay bilgisi bulunmamaktadır."),
        author: item.author || "",
      },
    };
  } catch (error) {
    console.error("Error fetching news by ID:", error);
    throw error;
  }
};

/**
 * Create a new news item (Admin only)
 */
export const createNews = async (data: {
  title: string;
  content: string;
  sport_id: number;
  type?: string;
  end_time?: string;
  image?: File;
}) => {
  try {
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("content", data.content);
    formData.append("sport_id", data.sport_id.toString());

    if (data.type) {
      formData.append("type", data.type);
    }

    if (data.end_time) {
      formData.append("end_time", data.end_time);
    }

    if (data.image) {
      formData.append("image", data.image);
    }

    const response = await api.post("/news", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error creating news:", error);
    throw error;
  }
};

/**
 * Update a news item status (Admin only)
 */
export const updateNewsStatus = async (
  id: string,
  status: "pending" | "approved" | "rejected"
) => {
  try {
    // This endpoint is defined in newsScraperRoutes.ts as PATCH /api/news-scraper/:id/status
    const response = await api.patch(`/news-scraper/${id}/status`, { status });
    return response.data;
  } catch (error) {
    console.error("Error updating news status:", error);
    throw error;
  }
};

/**
 * Delete a news item (Admin only)
 */
export const deleteNews = async (id: string) => {
  try {
    const response = await api.delete(`/news/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting news:", error);
    throw error;
  }
};

/**
 * Scrape news from a URL (Admin only)
 */
export const scrapeNewsFromUrl = async (url: string, sport_id: number) => {
  try {
    const response = await api.post("/news-scraper/scrape", {
      url,
      sport_id,
    });
    return response.data;
  } catch (error) {
    console.error("Error scraping news from URL:", error);
    throw error;
  }
};

/**
 * Get all sport categories
 */
export const getSportCategories = async () => {
  try {
    const response = await api.get("/sports");
    return response.data;
  } catch (error) {
    console.error("Error fetching sport categories:", error);
    throw error;
  }
};

/**
 * Update a news item content (Admin only)
 */
export const updateNewsItem = async (
  id: string,
  data: {
    title?: string;
    content?: string;
    sport_id?: number;
    type?: string;
    end_time?: string;
    image?: File;
  }
) => {
  try {
    // If there's an image, use FormData
    if (data.image) {
      const formData = new FormData();

      if (data.title) formData.append("title", data.title);
      if (data.content) formData.append("content", data.content);
      if (data.sport_id) formData.append("sport_id", data.sport_id.toString());
      if (data.type) formData.append("type", data.type);
      if (data.end_time) formData.append("end_time", data.end_time);
      formData.append("image", data.image);

      const response = await api.put(`/news/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } else {
      // Regular JSON update
      const response = await api.put(`/news/${id}`, data);
      return response.data;
    }
  } catch (error) {
    console.error("Error updating news:", error);
    throw error;
  }
};

/**
 * Get rejected news (Admin only)
 */
export const getRejectedNews = async (params?: {
  limit?: number;
  offset?: number;
}): Promise<{
  data: NewsItem[];
  count: number;
}> => {
  try {
    console.log(`[API] getRejectedNews called with params:`, params);
    const response = await api.get("/news-scraper/rejected", { params });

    // Log response stats
    console.log(
      `[API] getRejectedNews received ${
        response.data.data?.length || 0
      } items with total count ${response.data.count || 0}`
    );

    // Transform API response to match our frontend NewsItem type
    const apiData = response.data.data || [];
    const transformedData: NewsItem[] = apiData.map((item: any) => ({
      id: item.id.toString(),
      title: item.title,
      content: item.content,
      category: item.Sports ? item.Sports.name : "Genel",
      image: item.image_url || "",
      publishDate: item.published_date,
      tags: item.tags || [],
      status: "rejected" as const,
      hasImage: !!item.image_url,
      contentLength: item.content.length,
      imageStatus: item.image_url ? ("available" as const) : ("error" as const),
      sourceUrl: item.source_url || "",
      type: "news",
      details: {
        source: item.source_url || "",
        publishedAt: item.published_date,
        description:
          item.description ||
          (item.content && item.content !== item.title
            ? item.content.substring(0, 100) +
              (item.content.length > 100 ? "..." : "")
            : "Detay bilgisi bulunmamaktadır."),
        author: item.author || "",
      },
    }));

    return {
      data: transformedData,
      count: response.data.count || apiData.length,
    };
  } catch (error) {
    console.error("[API] Error fetching rejected news:", error);
    throw error;
  }
};

/**
 * Get pending news (Admin only)
 */
export const getPendingNews = async (params?: {
  limit?: number;
  offset?: number;
}): Promise<{
  data: NewsItem[];
  count: number;
}> => {
  try {
    console.log(`[API] getPendingNews called with params:`, params);
    const response = await api.get("/news-scraper/pending", { params });

    // Log response stats
    console.log(
      `[API] getPendingNews received ${
        response.data.data?.length || 0
      } items with total count ${response.data.count || 0}`
    );

    // Transform API response to match our frontend NewsItem type
    const apiData = response.data.data || [];
    const transformedData: NewsItem[] = apiData.map((item: any) => ({
      id: item.id.toString(),
      title: item.title,
      content: item.content,
      category: item.Sports ? item.Sports.name : "Genel",
      image: item.image_url || "",
      publishDate: item.published_date,
      tags: item.tags || [],
      status: "pending" as const,
      hasImage: !!item.image_url,
      contentLength: item.content.length,
      imageStatus: item.image_url ? ("available" as const) : ("error" as const),
      sourceUrl: item.source_url || "",
      type: "news",
      details: {
        source: item.source_url || "",
        publishedAt: item.published_date,
        description:
          item.description ||
          (item.content && item.content !== item.title
            ? item.content.substring(0, 100) +
              (item.content.length > 100 ? "..." : "")
            : "Detay bilgisi bulunmamaktadır."),
        author: item.author || "",
      },
    }));

    return {
      data: transformedData,
      count: response.data.count || apiData.length,
    };
  } catch (error) {
    console.error("[API] Error fetching pending news:", error);
    throw error;
  }
};
