"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { 
  CalendarIcon, 
  Clock, 
  MapPin, 
  Users,  
  Plus
} from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { toast } from "sonner"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"
import { tr } from "date-fns/locale"
import { cn } from "@/lib/utils"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import axios from "axios"
import { Category } from "@/types"

interface NewEventModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: (newEvent: any) => void
}

export function NewEventModal({ open, onOpenChange, onSuccess }: NewEventModalProps) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: null as Date | null,
    start_time: "",
    location_name: "",
    sport_id: "",
    max_participants: 20
  })
  const [categories, setCategories] = useState<Category[]>([])
  const { toast } = useToast()
  
  useEffect(() => {
    if (open) {
      const loadCategories = async () => {
        try {
          const token = localStorage.getItem('token')
          if (!token) {
            toast({
              title: "Hata",
              description: "Bu işlemi gerçekleştirmek için giriş yapmalısınız.",
              variant: "destructive",
            })
            return
          }

          const response = await axios.get(
            `${process.env.NEXT_PUBLIC_API_URL}/v1/categories`,
            {
              headers: {
                'Authorization': `Bearer ${token}`
              }
            }
          )

          if (response.data.status === 'success') {
            setCategories(response.data.data.categories)
          }
        } catch (error) {
          console.error("Kategoriler yüklenirken hata:", error)
          toast({
            title: "Hata",
            description: "Kategoriler yüklenirken bir hata oluştu",
            variant: "destructive",
          })
        }
      }

      loadCategories()
    }
  }, [open])
  
  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      date: null,
      start_time: "",
      location_name: "",
      sport_id: "",
      max_participants: 20
    })
  }
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Form validasyonu
    if (!formData.title || !formData.description || !formData.date || !formData.start_time || !formData.location_name || !formData.sport_id) {
      toast.error("Lütfen tüm gerekli alanları doldurun")
      return
    }
    
    setLoading(true)
    
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        toast({
          title: "Hata",
          description: "Bu işlemi gerçekleştirmek için giriş yapmalısınız.",
          variant: "destructive",
        })
        return
      }

      // Tarih ve saat formatını düzelt
      const formattedDate = formData.date ? format(formData.date, "yyyy-MM-dd") : format(new Date(), "yyyy-MM-dd")

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/v1/events`,
        {
          title: formData.title,
          description: formData.description,
          event_date: `${formattedDate}T${formData.start_time}:00`,
          location_name: formData.location_name,
          sport_id: parseInt(formData.sport_id),
          max_participants: formData.max_participants,
          status: "pending"
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        }
      )

      if (response.data.status === 'success') {
        toast.success("Etkinlik başarıyla oluşturuldu")
        resetForm()
        onOpenChange(false)
        if (onSuccess) onSuccess(response.data.data)
      } else {
        throw new Error(response.data.message || "Etkinlik oluşturulurken bir hata oluştu")
      }
    } catch (error) {
      console.error("Etkinlik oluşturma hatası:", error)
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          toast({
            title: "Hata",
            description: "Bu işlemi gerçekleştirmek için giriş yapmalısınız.",
            variant: "destructive",
          })
        } else {
          toast({
            title: "Hata",
            description: error.response?.data?.message || "Etkinlik oluşturulurken bir hata oluştu",
            variant: "destructive",
          })
        }
      } else {
        toast({
          title: "Hata",
          description: error instanceof Error ? error.message : "Etkinlik oluşturulurken bir hata oluştu",
          variant: "destructive",
        })
      }
    } finally {
      setLoading(false)
    }
  }
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[95vw] w-full sm:max-w-[600px] md:max-w-[650px] lg:max-w-[900px] xl:max-w-[1100px] h-[90vh] sm:h-[85vh] md:h-[80vh] overflow-y-auto p-4 sm:p-6">
        <DialogHeader className="mb-4 md:mb-6">
          <DialogTitle className="text-lg md:text-xl font-semibold">Yeni Etkinlik Oluştur</DialogTitle>
          <DialogDescription className="text-sm md:text-base">
            Oluşturacağınız etkinlik, onaylandıktan sonra kullanıcılar tarafından görüntülenebilecek.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
          <div className="space-y-2 md:space-y-4">
            <Label htmlFor="title" className="text-sm md:text-base font-medium">Etkinlik Başlığı *</Label>
            <Input
              id="title"
              name="title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Örn: Pazar Sabahı Koşusu"
              required
              className="w-full"
            />
          </div>
          
          <div className="space-y-2 md:space-y-4">
            <Label htmlFor="description" className="text-sm md:text-base font-medium">Etkinlik Açıklaması *</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Etkinlik hakkında detaylı bilgi verin"
              className="min-h-[100px] md:min-h-[150px] w-full resize-none"
              required
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-sm md:text-base font-medium">Tarih *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !formData.date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.date ? format(formData.date, "PPP", { locale: tr }) : "Tarih seçin"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={formData.date || undefined}
                    onSelect={(date) => {
                      console.log("Seçilen tarih:", date)
                      setFormData(prev => ({ ...prev, date: date || null }))
                    }}
                    disabled={(date) => date < new Date()}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="time" className="text-sm md:text-base font-medium">Saat *</Label>
              <Input
                id="time"
                name="start_time"
                type="time"
                value={formData.start_time}
                onChange={(e) => setFormData(prev => ({ ...prev, start_time: e.target.value }))}
                className="w-full"
                required
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="location" className="text-sm md:text-base font-medium">Konum *</Label>
              <Input
                id="location"
                name="location_name"
                value={formData.location_name}
                onChange={(e) => setFormData(prev => ({ ...prev, location_name: e.target.value }))}
                placeholder="Örn: Şehir Parkı, Ana Giriş"
                className="w-full"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="maxParticipants" className="text-sm md:text-base font-medium">Maksimum Katılımcı *</Label>
              <Input
                id="maxParticipants"
                name="max_participants"
                type="number"
                min={1}
                max={1000}
                value={formData.max_participants}
                onChange={(e) => setFormData(prev => ({ ...prev, max_participants: parseInt(e.target.value) }))}
                className="w-full"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="sport" className="text-sm md:text-base font-medium">Spor Kategorisi *</Label>
            <Select
              value={formData.sport_id}
              onValueChange={(value) => setFormData(prev => ({ ...prev, sport_id: value }))}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Kategori seçin" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id.toString()}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:gap-4 mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
              className="w-full sm:w-auto text-sm md:text-base"
            >
              İptal
            </Button>
            <Button 
              type="submit" 
              disabled={loading}
              className="w-full sm:w-auto text-sm md:text-base"
            >
              {loading ? "Oluşturuluyor..." : "Etkinlik Oluştur"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
} 