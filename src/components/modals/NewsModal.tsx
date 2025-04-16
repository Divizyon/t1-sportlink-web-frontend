"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { tr } from "date-fns/locale"
import { CalendarIcon, ImageIcon, Save, X } from "lucide-react"
import { toast } from "sonner"

interface NewsModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function NewsModal({ open, onOpenChange }: NewsModalProps) {
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [image, setImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [publishDate, setPublishDate] = useState<Date | undefined>(new Date())

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setImage(file)
      
      // Resim önizlemesi için
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!title) {
      toast.error("Lütfen bir başlık girin.")
      return
    }
    
    if (!content) {
      toast.error("Lütfen haber içeriği girin.")
      return
    }
    
    // Burada API çağrısı yapılabilir
    toast.success("Haber başarıyla kaydedildi!")
    
    // Formu temizle
    resetForm()
    
    // Modalı kapat
    onOpenChange(false)
  }
  
  const resetForm = () => {
    setTitle("")
    setContent("")
    setImage(null)
    setImagePreview(null)
    setPublishDate(new Date())
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Haber Ekle</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Başlık</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Haber başlığı girin"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="content">İçerik</Label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Haber içeriği girin"
              rows={5}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="image">Kapak Görseli</Label>
            <div className="flex items-center gap-4">
              <Button
                type="button"
                variant="outline"
                className="w-full h-32 flex flex-col items-center justify-center border-dashed"
                onClick={() => document.getElementById("image")?.click()}
              >
                <ImageIcon className="h-8 w-8 mb-2 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Görsel seçmek için tıklayın</span>
                <Input
                  id="image"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                />
              </Button>
              
              {imagePreview && (
                <div className="relative w-32 h-32">
                  <img 
                    src={imagePreview} 
                    alt="Önizleme" 
                    className="w-full h-full object-cover rounded" 
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute -top-2 -right-2 h-6 w-6"
                    onClick={() => {
                      setImage(null)
                      setImagePreview(null)
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="publishDate">Yayın Tarihi</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="publishDate"
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !publishDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {publishDate ? (
                    format(publishDate, "PPP", { locale: tr })
                  ) : (
                    <span>Tarih seçin</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={publishDate}
                  onSelect={setPublishDate}
                  initialFocus
                  locale={tr}
                />
              </PopoverContent>
            </Popover>
          </div>
          
          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              İptal
            </Button>
            <Button type="submit">
              <Save className="mr-2 h-4 w-4" />
              Kaydet
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
} 