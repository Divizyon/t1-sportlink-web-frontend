"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Edit, Trash2 } from "lucide-react"
import { NewNewsModal } from "@/components/modals/NewNewsModal"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"

interface News {
  id: string
  title: string
  content: string
  date: string
  status: "published" | "draft"
}

export default function NewsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [news, setNews] = useState<News[]>([
    {
      id: "1",
      title: "Yeni Spor Salonu Açılıyor",
      content: "Yeni spor salonumuz 1 Nisan'da açılıyor...",
      date: "2024-03-10",
      status: "published"
    },
    {
      id: "2",
      title: "Yaz Kampı Kayıtları Başladı",
      content: "Yaz kampı kayıtları için son başvuru tarihi...",
      date: "2024-03-15",
      status: "draft"
    }
  ])

  const filteredNews = news.filter(item => 
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.content.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleEditNews = (id: string, updatedNews: Partial<News>) => {
    setNews(news.map(item => 
      item.id === id ? { ...item, ...updatedNews } : item
    ))
    toast.success("Haber başarıyla güncellendi")
  }

  const handleDeleteNews = (id: string) => {
    setNews(news.filter(item => item.id !== id))
    toast.success("Haber başarıyla silindi")
  }

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Haber & Duyuru Yönetimi</h2>
        <div className="flex items-center space-x-2">
          <NewNewsModal />
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <Input
          placeholder="Haber ara..."
          className="w-[300px]"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Tüm Haberler</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Haber Başlığı</TableHead>
                  <TableHead>İçerik</TableHead>
                  <TableHead>Tarih</TableHead>
                  <TableHead>Durum</TableHead>
                  <TableHead>Aksiyon</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredNews.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.title}</TableCell>
                    <TableCell>{item.content}</TableCell>
                    <TableCell>{item.date}</TableCell>
                    <TableCell>
                      <Badge variant={item.status === "published" ? "default" : "secondary"}>
                        {item.status === "published" ? "Yayında" : "Taslak"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button 
                          variant="outline" 
                          size="icon" 
                          onClick={() => handleEditNews(item.id, { status: item.status === "published" ? "draft" : "published" })}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="icon" 
                          onClick={() => handleDeleteNews(item.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 