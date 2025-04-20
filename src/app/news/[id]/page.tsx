import { NewsDetail } from "@/components/news/NewsDetail"
import { useNews } from "@/hooks/useNews"
import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ChevronLeft } from "lucide-react"
import Link from "next/link"

interface NewsPageProps {
  params: {
    id: string
  }
}

export default function NewsPage({ params }: NewsPageProps) {
  const { news } = useNews()
  const newsItem = news.find(item => item.id === params.id)

  if (!newsItem) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <Link href="/dashboard/news">
            <Button variant="ghost" className="gap-2">
              <ChevronLeft className="w-4 h-4" />
              Haberlere Dön
            </Button>
          </Link>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 lg:col-start-3">
            <NewsDetail news={newsItem} />
          </div>
        </div>
      </div>
    </div>
  )
} 