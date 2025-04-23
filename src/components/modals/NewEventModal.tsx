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
      const newEvent = {
        id: Math.random().toString(36).substr(2, 9),
        title: formData.title,
        description: formData.description,
        date: formData.date,
        time: formData.time,
        location: formData.location,
        maxParticipants: formData.maxParticipants,
        participants: 0,
        status: "pending",
        category: formData.category,
        organizer: null // Ana sayfada atanacak
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
              onChange={handleChange}
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
              onChange={handleChange}
              placeholder="Etkinlik hakkında detaylı bilgi verin"
              className="min-h-[100px] md:min-h-[150px] w-full resize-none"
              required
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date" className="text-sm md:text-base font-medium">Tarih *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
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
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label htmlFor="time" className="text-sm md:text-base font-medium">Saat *</Label>
              <div className="flex items-center relative">
                <Clock className="absolute left-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="time"
                  name="time"
                  type="time"
                  value={formData.time}
                  onChange={handleChange}
                  className="pl-10 w-full"
                  required
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="category" className="text-sm md:text-base font-medium">Kategori *</Label>
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
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="location" className="text-sm md:text-base font-medium">Konum *</Label>
              <div className="flex items-center relative">
                <MapPin className="absolute left-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="Örn: Şehir Parkı, Ana Giriş"
                  className="pl-10 w-full"
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="maxParticipants" className="text-sm md:text-base font-medium">Maksimum Katılımcı *</Label>
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
                  className="pl-10 w-full"
                  required
                />
              </div>
            </div>
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