"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { Send } from "lucide-react"

export function NewsForm() {
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [loading, setLoading] = useState(false)
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!title.trim() || !content.trim()) {
      toast.error("Lütfen başlık ve içerik alanlarını doldurun")
      return
    }
    
    setLoading(true)
    
    // Simüle edilmiş API çağrısı
    setTimeout(() => {
      toast.success("Duyuru başarıyla yayınlandı")
      // Formu sıfırla
      setTitle("")
      setContent("")
      setLoading(false)
    }, 1500)
  }
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">Başlık</Label>
        <Input
          id="title"
          placeholder="Duyuru başlığı"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="content">İçerik</Label>
        <Textarea
          id="content"
          placeholder="Duyuru içeriği"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="min-h-[120px]"
        />
      </div>
      
      <Button type="submit" className="w-full" disabled={loading}>
        <Send className="mr-2 h-4 w-4" />
        {loading ? "Yayınlanıyor..." : "Duyuruyu Yayınla"}
      </Button>
    </form>
  )
} 