export type NewsItem = {
  id: string;
  title: string;
  content: string;
  category: string;
  image?: string;
  publishDate: string;
  tags: string[];
  status: "pending" | "approved" | "rejected";
  hasImage: boolean;
  contentLength: number;
  imageStatus: 'available' | 'error' | 'loading';
  sourceUrl?: string;
  selected?: boolean;
  showDetails?: boolean;
  type?: "announcement" | "news";
  sendNotification?: boolean;
  details?: {
    author?: string;
    source?: string;
    publishedAt?: string;
    description?: string;
  };
};

export type NewsFilters = {
  category: string | string[];
  searchTerm: string;
  status?: "pending" | "approved" | "rejected";
}; 