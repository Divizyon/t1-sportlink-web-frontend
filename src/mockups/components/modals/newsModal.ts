/**
 * News Modal Mockup Data
 *
 * This file contains mockup data specifically for news modal components.
 * It provides data for news creation, editing, and management.
 */

// News item types
export type NewsType = "announcement" | "news" | "event" | "update";

// News modal form interface
export interface NewsFormMock {
  title: string;
  content: string;
  type: NewsType;
  image: string | null;
  sendNotification: boolean;
}

// News types options
export const NEWS_TYPES = [
  { id: "announcement", name: "Duyuru" },
  { id: "news", name: "Haber" },
  { id: "event", name: "Etkinlik Haberi" },
  { id: "update", name: "Güncelleme" },
];

// Default empty news form
export const EMPTY_NEWS_FORM: NewsFormMock = {
  title: "",
  content: "",
  type: "announcement",
  image: null,
  sendNotification: true,
};

// Sample news items for preview
export const SAMPLE_NEWS_ITEMS = [
  {
    id: "news-001",
    title: "Yeni Sezonda Takımlar Hazır",
    content:
      "Yeni sezon başlıyor ve takımlarımız hazırlıklarını tamamladı. Bu sezon birçok heyecanlı karşılaşma bizi bekliyor.",
    type: "announcement" as NewsType,
    image: "/images/season-start.jpg",
    createdAt: new Date().toISOString(),
    author: "Spor Koordinatörü",
  },
  {
    id: "news-002",
    title: "Basketbol Turnuvası Kayıtları Başladı",
    content:
      "Geleneksel basketbol turnuvamız için kayıtlar başladı. Son kayıt tarihi 15 Ekim. Kaçırmayın!",
    type: "event" as NewsType,
    image: "/images/basketball-tournament.jpg",
    createdAt: new Date().toISOString(),
    author: "Etkinlik Ekibi",
  },
  {
    id: "news-003",
    title: "Yüzme Havuzu Bakım Çalışması",
    content:
      "Tesisimizin yüzme havuzu 10-15 Ekim tarihleri arasında bakım çalışması nedeniyle kapalı olacaktır.",
    type: "update" as NewsType,
    image: null,
    createdAt: new Date().toISOString(),
    author: "Tesis Yönetimi",
  },
];

// News confirmation data after submission
export interface NewsConfirmationMock {
  newsId: string;
  title: string;
  publishedDate: string;
  message: string;
  viewLink: string;
}

// Generate a news confirmation
export const getNewsConfirmation = (
  news: NewsFormMock
): NewsConfirmationMock => {
  const newsId = `news-${Date.now().toString().slice(-6)}`;
  const publishedDate = new Date().toISOString();

  return {
    newsId,
    title: news.title,
    publishedDate,
    message: news.sendNotification
      ? "Haber yayınlandı ve bildirim gönderildi."
      : "Haber başarıyla yayınlandı.",
    viewLink: `/news/${newsId}`,
  };
};
