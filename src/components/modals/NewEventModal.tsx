"use client"

import { useState } from "react"
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

interface NewEventModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: (newEvent: Event) => void
}

const EVENT_CATEGORIES = [
  "Futbol",
  "Basketbol",
  "Voleybol",
  "Tenis",
  "Yüzme",
  "Koşu",
  "Yoga",
  "Fitness",
  "Diğer"
]

export function NewEventModal({ open, onOpenChange, onSuccess }: NewEventModalProps) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: null as Date | null,
    time: "",
    location: "",
    category: "",
    maxParticipants: 20
  })
  
  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      date: null,
      time: "",
      location: "",
      category: "",
      maxParticipants: 20
    })
  }
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Form validasyonu
    if (!formData.title || !formData.description || !formData.date || !formData.time || !formData.location || !formData.category) {
      toast.error("Lütfen tüm gerekli alanları doldurun")
      return
    }
    
    setLoading(true)
    
    // Simüle edilmiş API çağrısı
    setTimeout(() => {
      const newEvent: Event = {
        id: Math.random().toString(36).substr(2, 9), // Geçici ID oluşturma
        name: formData.title,
        date: formData.date.toISOString().split('T')[0],
        location: formData.location,
        capacity: formData.maxParticipants,
        participants: 0,
        status: "active",
        category: formData.category
      }

      setLoading(false)
      toast.success("Etkinlik başarıyla oluşturuldu")
      resetForm()
      onOpenChange(false)
      if (onSuccess) onSuccess(newEvent)
    }, 1500)
  }
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-xl">Yeni Etkinlik Oluştur</DialogTitle>
          <DialogDescription>
            Oluşturacağınız etkinlik, onaylandıktan sonra kullanıcılar tarafından görüntülenebilecek.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Etkinlik Başlığı *</Label>
            <Input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Örn: Pazar Sabahı Koşusu"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Etkinlik Açıklaması *</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Etkinlik hakkında detaylı bilgi verin"
              className="min-h-[120px]"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="category">Kategori *</Label>
            <Select
              value={formData.category}
              onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Kategori seçin" />
              </SelectTrigger>
              <SelectContent>
                {EVENT_CATEGORIES.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">Tarih *</Label>
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
                    {formData.date ? (
                      format(formData.date, "PPP", { locale: tr })
                    ) : (
                      <span>Tarih seçin</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={formData.date || undefined}
                    onSelect={(date) => setFormData(prev => ({ ...prev, date }))}
                    initialFocus
                    locale={tr}
                    disabled={(date) => date < new Date()}
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="time">Saat *</Label>
              <div className="flex items-center relative">
                <Clock className="absolute left-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="time"
                  name="time"
                  type="time"
                  value={formData.time}
                  onChange={handleChange}
                  className="pl-10"
                  required
                />
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="location">Konum *</Label>
              <div className="flex items-center relative">
                <MapPin className="absolute left-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="Örn: Şehir Parkı, Ana Giriş"
                  className="pl-10"
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="maxParticipants">Maksimum Katılımcı Sayısı *</Label>
              <div className="flex items-center relative">
                <Users className="absolute left-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="maxParticipants"
                  name="maxParticipants"
                  type="number"
                  min={1}
                  max={1000}
                  value={formData.maxParticipants}
                  onChange={handleChange}
                  className="pl-10"
                  required
                />
              </div>
            </div>
          </div>
          
          <DialogFooter className="pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              İptal
            </Button>
            <Button type="submit" disabled={loading}>
              <Plus className="mr-2 h-4 w-4" />
              {loading ? "Oluşturuluyor..." : "Etkinlik Oluştur"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
} 