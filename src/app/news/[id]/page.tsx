"use client"

import { NewsDetail } from "@/components/news/NewsDetail"
import { useNewsContext } from "@/providers/NewsProvider"
import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ChevronLeft } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"
import { NewsItem } from "@/types/news"
import { Skeleton } from "@/components/ui/skeleton"

interface NewsPageProps {
  params: {
    id: string
  }
}

export default function NewsPage({ params }: NewsPageProps) {
  const { news } = useNewsContext()
  const [newsItem, setNewsItem] = useState<NewsItem | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // localStorage'dan yükleme gerçekleşince haberi bul
    const item = news.find(item => item.id === params.id)
    setNewsItem(item || null)
    setLoading(false)
  }, [news, params.id])

  if (!loading && !newsItem) {
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
            {loading ? (
              <div className="space-y-4">
                <Skeleton className="h-[300px] w-full rounded-xl" />
                <Skeleton className="h-[40px] w-2/3" />
                <Skeleton className="h-[20px] w-1/3" />
                <Skeleton className="h-[100px] w-full" />
                <Skeleton className="h-[100px] w-full" />
              </div>
            ) : newsItem ? (
              <NewsDetail news={newsItem} />
            ) : null}
          </div>
        </div>
      </div>
    </div>
  )
} 