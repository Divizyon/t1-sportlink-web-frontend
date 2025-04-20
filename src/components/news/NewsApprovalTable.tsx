"use client"

import { useState } from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import Image from "next/image"
import { format } from "date-fns"
import { tr } from "date-fns/locale"
import type { NewsItem } from "@/types/news"

interface NewsApprovalTableProps {
  news: NewsItem[]
  onApprove: (id: string) => Promise<void>
  onReject: (id: string) => Promise<void>
}

export function NewsApprovalTable({ news, onApprove, onReject }: NewsApprovalTableProps) {
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null)
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [isProcessing, setIsProcessing] = useState(false)

  const handleImageError = (e: any) => {
    e.target.src = 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?q=80&w=800&auto=format&fit=crop'
  }

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "d MMMM yyyy HH:mm", { locale: tr })
  }

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(news.map(item => item.id))
    } else {
      setSelectedIds([])
    }
  }

  const handleSelectOne = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedIds(prev => [...prev, id])
    } else {
      setSelectedIds(prev => prev.filter(itemId => itemId !== id))
    }
  }

  const handleBulkReject = async () => {
    if (!selectedIds.length) return
    
    setIsProcessing(true)
    try {
      for (const id of selectedIds) {
        await onReject(id)
      }
      setSelectedIds([])
    } catch (error) {
      console.error('Toplu red işlemi sırasında hata:', error)
    } finally {
      setIsProcessing(false)
    }
  }

  const handleBulkApprove = async () => {
    if (!selectedIds.length) return
    
    setIsProcessing(true)
    try {
      for (const id of selectedIds) {
        await onApprove(id)
      }
      setSelectedIds([])
    } catch (error) {
      console.error('Toplu onay işlemi sırasında hata:', error)
    } finally {
      setIsProcessing(false)
    }
  }

  if (news.length === 0) {
    return (
      <div className="text-center py-10 text-muted-foreground">
        Onay bekleyen haber bulunmuyor.
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {selectedIds.length > 0 && (
        <div className="flex items-center justify-between bg-muted p-4 rounded-lg">
          <span className="text-sm font-medium">
            {selectedIds.length} haber seçildi
          </span>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={handleBulkReject}
              disabled={isProcessing}
            >
              Seçilenleri Reddet
            </Button>
            <Button
              onClick={handleBulkApprove}
              disabled={isProcessing}
            >
              Seçilenleri Onayla
            </Button>
          </div>
        </div>
      )}
      
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12">
              <Checkbox
                checked={selectedIds.length === news.length}
                onCheckedChange={(checked: boolean) => handleSelectAll(checked)}
              />
            </TableHead>
            <TableHead>Haber</TableHead>
            <TableHead className="w-[180px]">Tarih</TableHead>
            <TableHead className="w-[150px]">İşlemler</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {news.map((item) => (
            <TableRow key={item.id}>
              <TableCell>
                <Checkbox
                  checked={selectedIds.includes(item.id)}
                  onCheckedChange={(checked: boolean) => handleSelectOne(item.id, checked)}
                />
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-4">
                  {item.image && (
                    <div className="relative w-16 h-16 rounded overflow-hidden flex-shrink-0">
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        className="object-cover"
                        onError={handleImageError}
                      />
                    </div>
                  )}
                  <div>
                    <div className="font-medium cursor-pointer hover:text-primary" onClick={() => setSelectedNews(item)}>
                      {item.title}
                    </div>
                    <div className="text-sm text-muted-foreground mt-1">
                      {item.content.substring(0, 100)}...
                    </div>
                  </div>
                </div>
              </TableCell>
              <TableCell>{formatDate(item.publishDate)}</TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onReject(item.id)}
                    disabled={isProcessing}
                  >
                    Reddet
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => onApprove(item.id)}
                    disabled={isProcessing}
                  >
                    Onayla
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={!!selectedNews} onOpenChange={() => setSelectedNews(null)}>
        {selectedNews && (
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold">{selectedNews.title}</DialogTitle>
              <DialogDescription>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Badge variant="outline">{selectedNews.category}</Badge>
                  <span>{formatDate(selectedNews.publishDate)}</span>
                </div>
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-6">
              {selectedNews.image && (
                <div className="relative w-full h-[400px] rounded-lg overflow-hidden">
                  <Image
                    src={selectedNews.image}
                    alt={selectedNews.title}
                    fill
                    className="object-cover"
                    onError={handleImageError}
                    priority
                  />
                </div>
              )}
              <div className="space-y-4">
                <article className="prose prose-sm max-w-none">
                  <p className="text-base whitespace-pre-wrap leading-relaxed">
                    {selectedNews.content}
                  </p>
                </article>
                <div className="flex flex-wrap gap-2">
                  {selectedNews.tags.map((tag) => (
                    <Badge key={tag} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </DialogContent>
        )}
      </Dialog>
    </div>
  )
} 