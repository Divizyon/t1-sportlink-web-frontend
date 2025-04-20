import { NextResponse } from "next/server";
import type { NewsItem } from "@/types/news";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    // Burada veritabanından haber detayları çekilecek
    // Şimdilik örnek veri dönüyoruz
    const newsItem: NewsItem = {
      id,
      title: "Örnek Haber Başlığı",
      content: "Haber içeriği burada yer alacak...",
      category: "Spor",
      image: "https://example.com/image.jpg",
      publishDate: new Date().toISOString(),
      tags: ["spor", "haber"],
      status: "pending",
      hasImage: true,
      contentLength: 200,
      imageStatus: 'available',
      details: {
        author: "Yazar Adı",
        source: "Kaynak",
        publishedAt: new Date().toISOString(),
        description: "Haber açıklaması"
      }
    };

    return NextResponse.json(newsItem);
  } catch (error) {
    return NextResponse.json(
      { error: "Haber detayları alınırken bir hata oluştu" },
      { status: 500 }
    );
  }
} 