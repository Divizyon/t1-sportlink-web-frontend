import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="text-center space-y-4">
        <h1 className="text-6xl font-bold text-gray-900">404</h1>
        <h2 className="text-2xl font-semibold text-gray-700">Sayfa Bulunamadı</h2>
        <p className="text-gray-500">
          Aradığınız sayfa mevcut değil veya taşınmış olabilir.
        </p>
        <Button asChild>
          <Link href="/dashboard">
            Ana Sayfaya Dön
          </Link>
        </Button>
      </div>
    </div>
  )
} 