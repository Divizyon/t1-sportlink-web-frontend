"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import type { NewsItem } from "@/types/news"
import { Loader2 } from "lucide-react"

interface NewsSearchProps {
  onNewsScraped: (news: NewsItem[]) => void
}

export function NewsSearch({ onNewsScraped }: NewsSearchProps) {
  const [url, setUrl] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [processedNews, setProcessedNews] = useState<any[]>([])
  const { toast } = useToast()

  useEffect(() => {
    if (processedNews.length > 0) {
      onNewsScraped(processedNews)
      setProcessedNews([])
    }
  }, [processedNews, onNewsScraped])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!url) {
      toast({
        title: "Hata",
        description: "Lütfen bir URL girin",
        variant: "destructive"
      })
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch("/api/news/scrape", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Haber çekilirken bir hata oluştu")
      }

      const news = await response.json()
      
      if (Array.isArray(news) && news.length > 0) {
        setProcessedNews(news)
        setUrl("")
        
        toast({
          title: "Başarılı",
          description: `${news.length} haber başarıyla eklendi ve onaya gönderildi.`,
        })
      } else {
        toast({
          title: "Bilgi",
          description: "Hiç haber bulunamadı.",
        })
      }
    } catch (error) {
      toast({
        title: "Hata",
        description: error instanceof Error ? error.message : "Haber çekilirken bir hata oluştu",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Haber Kaynağı Ekle</CardTitle>
        <CardDescription>
          Spor haberlerini çekmek istediğiniz sitenin URL'sini girin
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex gap-2">
            <Input
              type="url"
              placeholder="https://www.example.com"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              disabled={isLoading}
              className="flex-1"
            />
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  İşleniyor
                </>
              ) : (
                "Haberleri Çek"
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
} 