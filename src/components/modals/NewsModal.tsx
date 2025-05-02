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
import { Upload, Image as ImageIcon, Bell, Newspaper, X, Loader2 } from "lucide-react"

interface NewsModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

const NEWS_TYPES = [
  { id: "announcement", name: "Duyuru" },
  { id: "news", name: "Haber" },
]

const NEWS_CATEGORIES = [
  { id: "general", name: "Genel" },
  { id: "technology", name: "Teknoloji" },
  { id: "sports", name: "Spor" },
  { id: "culture", name: "Kültür-Sanat" },
  { id: "education", name: "Eğitim" },
]

// API response handlers
const handleApiResponse = async (response: Response) => {
    const errorData = await response.json().catch(() => ({}))
    console.error('API Response:', errorData)

    if (!response.ok) {
        if (response.status === 401) {
            throw new Error('Oturum süreniz dolmuş olabilir. Lütfen tekrar giriş yapın.')
        } else if (response.status === 403) {
            throw new Error('Bu işlem için yetkiniz bulunmuyor.')
        } else if (response.status === 400) {
            throw new Error(errorData.message || 'Lütfen tüm zorunlu alanları doldurun.')
        } else {
            throw new Error(errorData.error || errorData.message || 'Sunucu hatası')
        }
    }
    return errorData
}

export function NewsModal({ open, onOpenChange, onSuccess }: NewsModalProps) {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("announcement")
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    type: "announcement",
    image: null as File | null,
    sport_id: 1,
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleTypeChange = (value: string) => {
    setFormData(prev => ({ ...prev, type: value }))
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData(prev => ({ ...prev, image: e.target.files![0] }))
    }
  }

  const resetForm = () => {
    setFormData({
      title: "",
      content: "",
      type: "announcement",
      image: null,
      sport_id: 1,
    })
    setActiveTab("announcement")
  }

  const handleSubmit = async (e: React.FormEvent) => {
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

    try {
      const formDataToSend = new FormData()
      formDataToSend.append('title', formData.title.trim())
      formDataToSend.append('content', formData.content.trim())
      formDataToSend.append('type', formData.type)
      
      // Sadece haber türünde sport_id gönder
      if (formData.type === 'news') {
        formDataToSend.append('sport_id', formData.sport_id.toString())
      }

      if (formData.image) {
        formDataToSend.append('image', formData.image)
      }

      // Debug için form verilerini konsola yazdır
      console.log('Gönderilen veriler:')
      for (let [key, value] of formDataToSend.entries()) {
        console.log(key, ':', value)
      }

      // API'ye gönder
      const response = await fetch('http://localhost:3001/api/news', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Authorization': `Bearer ${document.cookie
            .split('; ')
            .find(row => row.startsWith('accessToken='))
            ?.split('=')[1] || ''}`
        },
        body: formDataToSend,
      })

      // Debug için response'u yazdır
      console.log('Response status:', response.status)
      const responseData = await response.json()
      console.log('Response data:', responseData)

      if (!response.ok) {
        throw new Error(responseData.message || responseData.error || 'Bir hata oluştu')
      }

      setLoading(false)
      toast({
        title: "Başarılı",
        description: responseData.message || "İçerik başarıyla yayınlandı.",
      })
      resetForm()
      onOpenChange(false)
      if (onSuccess) onSuccess()

    } catch (error: any) {
      console.error('Error:', error)
      setLoading(false)
      toast({
        title: "Hata",
        description: error.message || "Bir hata oluştu",
        variant: "destructive",
      })

      // Token hatası durumunda kullanıcıyı login sayfasına yönlendir
      if (error.message?.includes('token') || error.message?.includes('oturum')) {
        window.location.href = '/auth/login'
      }
    }
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
              İçerik Yayınla
            </DialogTitle>
            <DialogDescription className="text-sm sm:text-base">
              Platformda yayınlanacak içerik oluşturun
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 sm:space-y-6">
            <div className="space-y-2">
              <Label htmlFor="type" className="text-sm sm:text-base">İçerik Türü</Label>
              <Select
                value={formData.type}
                onValueChange={handleTypeChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="İçerik türü seçin" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="announcement">
                    <div className="flex items-center gap-2">
                      <Bell className="h-4 w-4" />
                      <span>Duyuru</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="news">
                    <div className="flex items-center gap-2">
                      <Newspaper className="h-4 w-4" />
                      <span>Haber</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {formData.type === 'news' && (
              <div className="space-y-2">
                <Label htmlFor="sport" className="text-sm sm:text-base">Spor Kategorisi</Label>
                <Select
                  value={formData.sport_id.toString()}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, sport_id: parseInt(value) }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Spor kategorisi seçin" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Futbol</SelectItem>
                    <SelectItem value="2">Basketbol</SelectItem>
                    <SelectItem value="3">Voleybol</SelectItem>
                    <SelectItem value="4">Tenis</SelectItem>
                    <SelectItem value="5">Yüzme</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="title" className="text-sm sm:text-base">Başlık</Label>
              <Input
                id="title"
                name="title"
                placeholder="İçerik başlığı"
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
                placeholder="İçerik detayı"
                rows={5}
                value={formData.content}
                onChange={handleInputChange}
                className="w-full min-h-[120px] sm:min-h-[200px]"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="image" className="text-sm sm:text-base">Görsel</Label>
              <div className="flex items-center gap-4">
                <Input
                  id="image"
                  name="image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full"
                />
                {formData.image && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setFormData(prev => ({ ...prev, image: null }))}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
              {formData.image && (
                <div className="mt-2">
                  <img
                    src={URL.createObjectURL(formData.image)}
                    alt="Önizleme"
                    className="max-h-40 rounded-md object-cover"
                  />
                </div>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              İptal
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Yayınlanıyor...
                </>
              ) : (
                'Yayınla'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
} 