import { NextResponse } from "next/server";
import type { NewsItem } from "@/types/news";

// Geçici haber deposu - başlangıç verileri
const initialNews: NewsItem[] = [
  {
    id: "1",
    title: "Fenerbahçe'den muhteşem galibiyet",
    content: "Fenerbahçe, Süper Lig'de oynadığı son maçta rakibini 3-0 mağlup etti. Sarı-lacivertliler, bu galibiyetle puanını 65'e yükseltti.",
    category: "Spor",
    image: "https://example.com/fb-galibiyet.jpg",
    publishDate: new Date().toISOString(),
    tags: ["futbol", "süper lig"],
    status: "approved"
  },
  {
    id: "2",
    title: "Basketbolda büyük başarı",
    content: "Türkiye Basketbol Milli Takımı, Avrupa Şampiyonası'nda çeyrek finale yükseldi. Milliler, son maçında güçlü rakibini uzatmalarda mağlup etmeyi başardı.",
    category: "Spor",
    image: "https://example.com/basket-basari.jpg",
    publishDate: new Date().toISOString(),
    tags: ["basketbol", "milli takım"],
    status: "approved"
  }
];

// Geçici veri deposu
let newsStore: NewsItem[] = [...initialNews];

export async function GET() {
  try {
    // Onaylanmış haberleri döndür
    const approvedNews = newsStore.filter(news => news.status === "approved");
    return NextResponse.json(approvedNews);
  } catch (error) {
    console.error("Haberler yüklenirken hata:", error);
    return NextResponse.json(
      { error: "Haberler yüklenirken bir hata oluştu" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const newsData = await request.json();
    
    // Yeni haber için ID oluştur
    const newNews: NewsItem = {
      ...newsData,
      id: Math.random().toString(36).substring(2),
      status: "pending"
    };
    
    // Haberi depoya ekle
    newsStore.push(newNews);
    
    return NextResponse.json(newNews);
  } catch (error) {
    console.error("Haber eklenirken hata:", error);
    return NextResponse.json(
      { error: "Haber eklenirken bir hata oluştu" },
      { status: 500 }
    );
  }
} 