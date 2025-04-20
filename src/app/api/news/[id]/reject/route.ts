import { NextResponse } from "next/server"
import { MOCK_NEWS } from "@/hooks/useNews"

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // ID parametresini kontrol et
    if (!params?.id) {
      return NextResponse.json(
        { error: "Haber ID'si gerekli" },
        { status: 400 }
      );
    }

    const id = params.id
    // Gerçek uygulamada burada veritabanında haberin durumu güncellenecek
    const newsIndex = MOCK_NEWS.findIndex((n) => n.id === id)
    if (newsIndex === -1) {
      return NextResponse.json(
        { error: "Haber bulunamadı" },
        { status: 404 }
      )
    }

    MOCK_NEWS[newsIndex].status = "rejected"
    return NextResponse.json({ success: true, news: MOCK_NEWS[newsIndex] })
  } catch (error) {
    console.error("Haber reddetme hatası:", error)
    return NextResponse.json(
      { error: "Haber reddedilirken bir hata oluştu" },
      { status: 500 }
    )
  }
} 