import { NextResponse } from "next/server";
import type { NewsItem } from "@/types/news";

// Geçici haber deposu - başlangıç verileri
const initialNews: NewsItem[] = [
  {
    id: "1",
    title: "Fenerbahçe'den muhteşem galibiyet",
    content: "Fenerbahçe, Süper Lig'de oynadığı son maçta rakibini 3-0 mağlup etti. Sarı-lacivertliler, bu galibiyetle puanını 65'e yükseltti.",
    sport_id: 1,
    image_url: "https://example.com/fb-galibiyet.jpg",
    status: "approved",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: "2",
    title: "Basketbolda büyük başarı",
    content: "Türkiye Basketbol Milli Takımı, Avrupa Şampiyonası'nda çeyrek finale yükseldi. Milliler, son maçında güçlü rakibini uzatmalarda mağlup etmeyi başardı.",
    sport_id: 2,
    image_url: "https://example.com/basket-basari.jpg",
    status: "approved",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

// Geçici veri deposu
let newsStore: NewsItem[] = [...initialNews];

export async function GET() {
  try {
    // Onaylanmış haberleri döndür
    const approvedNews = newsStore.filter(news => news.status === "approved");
    return NextResponse.json({
      status: "success",
      message: "Haberler başarıyla getirildi.",
      data: approvedNews
    });
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
    // FormData'yı al
    const formData = await request.formData();
    
    // FormData'dan verileri çıkart
    const newsData = {
      title: formData.get('title'),
      content: formData.get('content'),
      sport_id: Number(formData.get('sport_id')),
    };

    // Görsel varsa işle
    const image = formData.get('image');
    let image_url = null;
    if (image && image instanceof File) {
      // Görseli işle (örneğin bir CDN'e yükle)
      // Şimdilik sadece dosya adını kaydedelim
      image_url = `/uploads/${image.name}`;
    }
    
    // Yeni haber için ID oluştur
    const newNews: NewsItem = {
      ...newsData,
      id: Math.random().toString(36).substring(2),
      status: "approved", // Admin tarafından oluşturulan haberler direkt onaylı
      image_url,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    // Haberi depoya ekle
    newsStore.push(newNews);
    
    return NextResponse.json({
      status: 'success',
      message: 'Haber başarıyla oluşturuldu.',
      data: newNews
    }, { status: 201 });

  } catch (error) {
    console.error("Haber eklenirken hata:", error);
    return NextResponse.json(
      { 
        status: 'error',
        message: "Haber eklenirken bir hata oluştu",
        error: error.message 
      },
      { status: 500 }
    );
  }
} 