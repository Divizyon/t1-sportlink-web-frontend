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
  DialogFooter,
} from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import Image from "next/image"
import { format } from "date-fns"
import { tr } from "date-fns/locale"
import type { NewsItem } from "@/types/news"
import { Check, X, Eye, AlertCircle } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Alert } from "@/components/ui/alert"

interface NewsApprovalTableProps {
  news: NewsItem[]
  onApprove: (id: string) => Promise<void>
  onReject: (id: string) => Promise<void>
}

export function NewsApprovalTable({ news, onApprove, onReject }: NewsApprovalTableProps) {
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null)
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [processingId, setProcessingId] = useState<string | null>(null)

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

  const handleSingleApprove = async (id: string) => {
    setProcessingId(id);
    try {
      await onApprove(id);
    } catch (error) {
      console.error('Haber onaylanırken hata:', error);
    } finally {
      setProcessingId(null);
    }
  }

  const handleSingleReject = async (id: string) => {
    setProcessingId(id);
    try {
      await onReject(id);
    } catch (error) {
      console.error('Haber reddedilirken hata:', error);
    } finally {
      setProcessingId(null);
    }
  }

  if (news.length === 0) {
    return (
      <Alert variant="default">
        <AlertCircle className="h-4 w-4" />
        <span className="ml-2">Onay bekleyen haber bulunmuyor.</span>
      </Alert>
    )
  }

  return (
    <div className="space-y-4">
      {selectedIds.length > 0 && (
        <div className="flex items-center justify-between bg-muted p-3 rounded-lg border">
          <span className="text-sm font-medium">
            <strong>{selectedIds.length}</strong> haber seçildi
          </span>
          <div className="flex gap-2">
            <Button
              variant="destructive"
              size="sm"
              onClick={handleBulkReject}
              disabled={isProcessing}
              className="gap-1"
            >
              <X className="h-4 w-4" /> 
              Reddet
            </Button>
            <Button
              variant="default"
              size="sm"
              onClick={handleBulkApprove}
              disabled={isProcessing}
              className="gap-1"
            >
              <Check className="h-4 w-4" /> 
              Onayla
            </Button>
          </div>
        </div>
      )}
      
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <Checkbox
                  checked={news.length > 0 && selectedIds.length === news.length}
                  onCheckedChange={(checked: boolean) => handleSelectAll(!!checked)}
                />
              </TableHead>
              <TableHead>Haber</TableHead>
              <TableHead className="w-[150px]">İşlemler</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {news.map((item) => (
              <TableRow key={item.id} className="hover:bg-muted/50">
                <TableCell>
                  <Checkbox
                    checked={selectedIds.includes(item.id)}
                    onCheckedChange={(checked: boolean) => handleSelectOne(item.id, !!checked)}
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
                      <div className="text-sm text-muted-foreground mt-1 line-clamp-2">
                        {item.content?.substring(0, 120)}...
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedNews(item)}
                      className="w-full justify-start"
                    >
                      <Eye className="h-3.5 w-3.5 mr-1" /> İncele
                    </Button>
                    <div className="flex gap-1">
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleSingleReject(item.id)}
                        disabled={processingId === item.id}
                        className="flex-1"
                      >
                        <X className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        variant="default"
                        size="sm"
                        onClick={() => handleSingleApprove(item.id)}
                        disabled={processingId === item.id}
                        className="flex-1"
                      >
                        <Check className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={!!selectedNews} onOpenChange={(open) => !open && setSelectedNews(null)}>
        {selectedNews && (
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold">{selectedNews.title}</DialogTitle>
              <DialogDescription>
                <div className="flex items-center gap-2 text-sm">
                  {selectedNews.category && (
                    <Badge variant="outline">{selectedNews.category}</Badge>
                  )}
                  <span>{formatDate(selectedNews.publishDate)}</span>
                </div>
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-6">
              {selectedNews.image && (
                <div className="relative w-full h-[300px] rounded-lg overflow-hidden">
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
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="destructive"
                onClick={() => {
                  handleSingleReject(selectedNews.id);
                  setSelectedNews(null);
                }}
                className="gap-1"
              >
                <X className="h-4 w-4" />
                Reddet
              </Button>
              <Button
                onClick={() => {
                  handleSingleApprove(selectedNews.id);
                  setSelectedNews(null);
                }}
                className="gap-1"
              >
                <Check className="h-4 w-4" />
                Onayla
              </Button>
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>
    </div>
  )
} 