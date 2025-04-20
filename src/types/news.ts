// News item types
export type NewsType = "announcement" | "news" | "event" | "update";

export type NewsItem = {
  id: string;
  title: string;
  content: string;
  category: string;
  type?: NewsType;
  image?: string;
  publishDate: string;
  tags: string[];
  status: "pending" | "approved" | "rejected";
  hasImage: boolean;
  contentLength: number;
  imageStatus: "available" | "error" | "loading";
  sourceUrl?: string;
  selected?: boolean;
  sendNotification?: boolean;
  details?: {
    author?: string;
    source?: string;
    publishedAt?: string;
    description?: string;
  };
};

export interface NewsFormItem {
  title: string;
  content: string;
  type: NewsType;
  image: string | null;
  sendNotification: boolean;
}

export type NewsFilters = {
  category: string | string[];
  searchTerm: string;
  status?: "pending" | "approved" | "rejected";
};
