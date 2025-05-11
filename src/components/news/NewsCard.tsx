import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ImageIcon, AlertCircle, ChevronDown, ChevronUp, Calendar, Tag, FileText, Link as LinkIcon } from "lucide-react"
import type { NewsItem } from "@/types/news"
import Image from "next/image"
import { useState } from "react"
import { format } from "date-fns"
import { tr } from "date-fns/locale"

interface NewsCardProps {
  news: NewsItem
  onApprove?: (id: string) => void
  onReject?: (id: string) => void
  showActions?: boolean
}

export function NewsCard({ news, onApprove, onReject, showActions = true }: NewsCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Tarih formatlama
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "d MMMM yyyy, HH:mm", { locale: tr });
    } catch (error) {
      return dateString;
    }
  };

  // Duruma göre badge rengi belirle
  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "approved":
        return "outline" as const;
      case "rejected":
        return "destructive" as const;
      default:
        return "secondary" as const;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "approved":
        return "Onaylandı";
      case "rejected":
        return "Reddedildi";
      default:
        return "Onay Bekliyor";
    }
  };

  return (
    <Card className="flex flex-col h-full">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle 
            className="line-clamp-2 cursor-pointer hover:text-primary transition-colors" 
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {news.title}
          </CardTitle>
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-8 w-8 p-0"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </Button>
        </div>
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
        
        {isExpanded && (
          <div className="mt-4 pt-4 border-t text-sm space-y-3 animate-in fade-in-50 duration-300">
            <div className="flex items-start gap-2">
              <Badge variant="outline" className="px-2 py-0 h-5">
                {news.category}
              </Badge>
              <Badge 
                variant={getStatusBadgeVariant(news.status)} 
                className={`px-2 py-0 h-5 ${news.status === "approved" ? "bg-green-50 text-green-700 border-green-200" : ""}`}
              >
                {getStatusText(news.status)}
              </Badge>
            </div>
            
            <div className="flex items-center gap-2 text-muted-foreground">
              <Calendar size={14} />
              <span>Yayın Tarihi: {formatDate(news.publishDate)}</span>
            </div>
            
            {news.tags && news.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                <div className="flex items-center gap-1 text-muted-foreground w-full mb-1">
                  <Tag size={14} />
                  <span className="text-xs">Etiketler:</span>
                </div>
                {news.tags.map((tag, index) => (
                  <Badge key={index} variant="outline" className="bg-muted/50 text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
            
            {news.sourceUrl && (
              <div className="flex items-center gap-2 text-muted-foreground overflow-hidden">
                <LinkIcon size={14} />
                <a 
                  href={news.sourceUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-xs truncate hover:text-primary transition-colors"
                >
                  {news.sourceUrl}
                </a>
              </div>
            )}
            
            {news.details && (
              <div className="flex flex-col gap-2 pt-2 border-t mt-2">
                <div className="flex items-center gap-1 text-muted-foreground">
                  <FileText size={14} />
                  <span className="text-xs font-medium">Ek Detaylar:</span>
                </div>
                
                {news.details.author && (
                  <div className="text-xs text-muted-foreground ml-5">
                    <span className="font-medium">Yazar:</span> {news.details.author}
                  </div>
                )}
                
                {news.details.source && (
                  <div className="text-xs text-muted-foreground ml-5">
                    <span className="font-medium">Kaynak:</span> {news.details.source}
                  </div>
                )}
                
                {news.details.description && (
                  <div className="text-xs text-muted-foreground ml-5">
                    <span className="font-medium">Açıklama:</span> {news.details.description}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
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