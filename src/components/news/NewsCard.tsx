import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ImageIcon, AlertCircle } from "lucide-react"
import type { NewsItem } from "@/types/news"
import Image from "next/image"

interface NewsCardProps {
  news: NewsItem
  onApprove?: (id: string) => void
  onReject?: (id: string) => void
  showActions?: boolean
}

export function NewsCard({ news, onApprove, onReject, showActions = true }: NewsCardProps) {
  return (
    <Card className="flex flex-col h-full">
      <CardHeader>
        <CardTitle className="line-clamp-2">{news.title}</CardTitle>
        <CardDescription className="flex items-center gap-2">
          {news.hasImage ? (
            <Badge variant="outline" className="flex items-center gap-1">
              <ImageIcon className="w-4 h-4" />
              Resim Mevcut
            </Badge>
          ) : (
            <Badge variant="destructive" className="flex items-center gap-1">
              <AlertCircle className="w-4 h-4" />
              Resim Yok
            </Badge>
          )}
          <Badge variant="outline">
            {news.contentLength} karakter
          </Badge>
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="relative h-40 mb-4 bg-muted rounded-lg overflow-hidden">
          {news.hasImage && news.image ? (
            <div className="relative w-full h-full">
              <Image
                src={news.image}
                alt={news.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                priority={false}
                onError={(e) => {
                  // Resim yüklenemediğinde placeholder göster
                  const imgElement = e.target as HTMLImageElement;
                  imgElement.style.display = 'none';
                  const container = imgElement.parentElement;
                  if (container) {
                    container.innerHTML = `
                      <div class="flex items-center justify-center w-full h-full bg-muted">
                        <div class="text-center p-4">
                          <svg class="w-8 h-8 mx-auto mb-2 text-muted-foreground" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <p class="text-sm text-muted-foreground">Resim Yüklenemedi</p>
                        </div>
                      </div>
                    `;
                  }
                }}
              />
            </div>
          ) : (
            <div className="flex items-center justify-center w-full h-full bg-muted">
              <div className="text-center p-4">
                <ImageIcon className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">Resim Bulunamadı</p>
              </div>
            </div>
          )}
        </div>
        <p className="text-sm line-clamp-3">{news.content}</p>
      </CardContent>
      {showActions && (
        <CardFooter className="flex justify-end gap-2 pt-4">
          {onReject && (
            <Button
              variant="destructive"
              size="sm"
              onClick={() => onReject(news.id)}
            >
              Reddet
            </Button>
          )}
          {onApprove && (
            <Button
              variant="default"
              size="sm"
              onClick={() => onApprove(news.id)}
            >
              Onayla
            </Button>
          )}
        </CardFooter>
      )}
    </Card>
  )
} 