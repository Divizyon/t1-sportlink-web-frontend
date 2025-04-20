import { NextResponse } from "next/server"

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    // Burada veritabanı işlemleri yapılacak
    // Şimdilik sadece başarılı yanıt dönüyoruz
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Haber onaylama hatası:", error)
    return NextResponse.json(
      { error: "Haber onaylanırken bir hata oluştu" },
      { status: 500 }
    )
  }
} 