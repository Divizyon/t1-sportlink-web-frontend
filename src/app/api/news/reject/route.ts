import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { ids } = await request.json();

    if (!ids || !Array.isArray(ids)) {
      return NextResponse.json(
        { error: "Geçersiz haber ID'leri" },
        { status: 400 }
      );
    }

    // Burada veritabanı işlemleri yapılacak
    // Şimdilik sadece başarılı yanıt dönüyoruz
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Haberler reddedilirken bir hata oluştu" },
      { status: 500 }
    );
  }
} 