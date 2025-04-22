"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"
import { Upload, Image as ImageIcon, Bell } from "lucide-react"

interface NewsModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

const NEWS_TYPES = [
  { id: "announcement", name: "Duyuru" },
  { id: "news", name: "Haber" },
  { id: "event", name: "Etkinlik Haberi" },
  { id: "update", name: "Güncelleme" },
]

export function NewsModal({ open, onOpenChange, onSuccess }: NewsModalProps) {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("announcement")
  
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    type: "announcement",
    image: null as File | null,
    sendNotification: true,
  })

  const resetForm = () => {
    setFormData({
      title: "",
      content: "",
      type: "announcement",
      image: null,
      sendNotification: true,
    })
    setActiveTab("announcement")
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleTypeChange = (value: string) => {
    setFormData(prev => ({ ...prev, type: value }))
  }

  const handleNotificationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, sendNotification: e.target.checked }))
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData(prev => ({ ...prev, image: e.target.files![0] }))
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Form doğrulama
    if (!formData.title.trim()) {
      toast({
        title: "Hata",
        description: "Başlık alanı zorunludur.",
        variant: "destructive",
      })
      return
    }

    if (!formData.content.trim()) {
      toast({
        title: "Hata",
        description: "İçerik alanı zorunludur.",
        variant: "destructive",
      })
      return
    }

    // Form gönderme
    setLoading(true)

    // API çağrısı simülasyonu
    setTimeout(() => {
      setLoading(false)
      
      toast({
        title: "Başarılı",
        description: `${activeTab === "announcement" ? "Duyuru" : "Haber"} başarıyla yayınlandı.`,
      })
      
      resetForm()
      onOpenChange(false)
      
      if (onSuccess) {
        onSuccess()
      }
    }, 1000)
  }

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      if (!isOpen && !loading) {
        resetForm()
      }
      onOpenChange(isOpen)
    }}>
      <DialogContent className="max-w-[95vw] w-full sm:max-w-[600px] md:max-w-[650px] lg:max-w-[900px] xl:max-w-[1100px] h-[90vh] sm:h-[85vh] md:h-[80vh] overflow-y-auto p-4 sm:p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <DialogHeader>
            <DialogTitle className="text-xl sm:text-2xl">
              {activeTab === "announcement" ? "Duyuru Yayınla" : "Haber Ekle"}
            </DialogTitle>
            <DialogDescription className="text-sm sm:text-base">
              {activeTab === "announcement" 
                ? "Katılımcılara önemli duyurular yapın." 
                : "Platformda yayınlanacak haber oluşturun."}
            </DialogDescription>
          </DialogHeader>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-4">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="announcement" className="text-sm sm:text-base">
                <Bell className="mr-2 h-4 w-4" />
                Duyuru
              </TabsTrigger>
              <TabsTrigger value="news" className="text-sm sm:text-base">
                <ImageIcon className="mr-2 h-4 w-4" />
                Haber
              </TabsTrigger>
            </TabsList>
            
            <div className="space-y-4 sm:space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title" className="text-sm sm:text-base">Başlık</Label>
                <Input
                  id="title"
                  name="title"
                  placeholder="Duyuru/Haber başlığı"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="content" className="text-sm sm:text-base">İçerik</Label>
                <Textarea
                  id="content"
                  name="content"
                  placeholder="Duyuru/Haber içeriği"
                  rows={5}
                  value={formData.content}
                  onChange={handleInputChange}
                  className="w-full min-h-[120px] sm:min-h-[200px]"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="type" className="text-sm sm:text-base">Tür</Label>
                <Select 
                  value={formData.type} 
                  onValueChange={handleTypeChange}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Tür seçin" />
                  </SelectTrigger>
                  <SelectContent>
                    {NEWS_TYPES.map(type => (
                      <SelectItem key={type.id} value={type.id} className="text-sm sm:text-base">
                        {type.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="image" className="text-sm sm:text-base">Görsel</Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="image"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="flex-1 text-sm sm:text-base"
                  />
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="icon"
                    onClick={() => document.getElementById("image")?.click()}
                  >
                    <Upload className="h-4 w-4" />
                  </Button>
                </div>
                {formData.image && (
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    Seçilen dosya: {formData.image.name}
                  </p>
                )}
              </div>
              
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="sendNotification"
                  checked={formData.sendNotification}
                  onChange={handleNotificationChange}
                  className="h-4 w-4 rounded border-gray-300"
                />
                <Label htmlFor="sendNotification" className="text-sm sm:text-base font-normal">
                  Bildirim olarak gönder
                </Label>
              </div>
            </div>
          </Tabs>
          
          <DialogFooter className="flex justify-end gap-2 pt-6">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              disabled={loading}
              className="text-sm sm:text-base"
            >
              İptal
            </Button>
            <Button 
              type="submit" 
              disabled={loading}
              className="text-sm sm:text-base"
            >
              {loading ? "Gönderiliyor..." : "Yayınla"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
} 