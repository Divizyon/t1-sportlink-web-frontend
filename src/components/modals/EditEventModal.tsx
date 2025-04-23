"use client"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { tr } from "date-fns/locale"
import { cn } from "@/lib/utils"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { Event, Category } from "@/types"
import axios from "axios"
import { useRouter } from "next/navigation"
import Cookies from 'js-cookie'

interface EditEventModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
  event?: Event
  onSave?: (updatedEvent: Partial<Event>) => void
}

// Durum seçenekleri
const statusOptions = [
  { value: "pending", label: "Beklemede" },
  { value: "approved", label: "Onaylandı" },
  { value: "rejected", label: "Reddedildi" },
  { value: "completed", label: "Tamamlandı" }
]

export function EditEventModal({ open, onOpenChange, onSuccess, event, onSave }: EditEventModalProps) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState<Partial<Event>>({})
  const [date, setDate] = useState<Date>()
  const [categories, setCategories] = useState<Category[]>([])
  const { toast } = useToast()
  const router = useRouter()

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const token = Cookies.get('token') || localStorage.getItem('token');
        if (!token) {
          throw new Error("Oturum açmanız gerekiyor");
        }

        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/sports`,
          {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }
        );

        if (response.data.status === 'success' && Array.isArray(response.data.data)) {
          // Boş ID'leri filtrele
          const validCategories = response.data.data.filter((category: Category) => category.id);
          setCategories(validCategories);
        } else {
          throw new Error("Kategoriler geçerli formatta değil");
        }
      } catch (error) {
        console.error('Kategoriler yüklenirken hata oluştu:', error);
        toast({
          title: "Hata",
          description: "Kategoriler yüklenirken bir hata oluştu.",
          variant: "destructive",
        });
      }
    };

    if (open) {
      fetchCategories();
    }
  }, [open]);

  useEffect(() => {
    if (event && open) {
      setFormData(event)
      setDate(event.date instanceof Date ? event.date : new Date(event.date))
    } else {
      setFormData({})
      setDate(undefined)
    }
  }, [event, open])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      if (!event?.id) {
        toast.error("Etkinlik ID'si bulunamadı");
        return;
      }

      const token = localStorage.getItem('token');
      if (!token) {
        toast.error("Oturum bulunamadı");
        return;
      }

      // Tarih ve saat formatını düzelt
      const formattedDate = date ? format(date, "yyyy-MM-dd") : format(new Date(), "yyyy-MM-dd")
      const formattedTime = formData.start_time || "00:00"

      const response = await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/v1/events/${event.id}`,
        {
          ...formData,
          date: formattedDate,
          time: formattedTime,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.status === 'success') {
        toast.success("Etkinlik başarıyla güncellendi");
        onOpenChange(false);
        router.refresh();
      }
    } catch (error) {
      console.error("Etkinlik güncelleme hatası:", error)
      if (axios.isAxiosError(error)) {
        if (error.code === "ERR_NETWORK") {
          toast.error("Sunucuya bağlanılamadı. Lütfen internet bağlantınızı kontrol edin.");
        } else {
          toast.error(error.response?.data?.message || "Etkinlik güncellenirken bir hata oluştu");
        }
      } else {
        toast.error("Beklenmeyen bir hata oluştu");
      }
    } finally {
      setLoading(false)
    }
  }

  if (!event && open) {
    return null
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Etkinlik Düzenle</DialogTitle>
          <DialogDescription>
            Etkinlik bilgilerini güncelleyin. Değişiklikler kaydedildikten sonra yayınlanacaktır.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Başlık</Label>
              <Input
                id="title"
                value={formData.title || ""}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Açıklama</Label>
              <Textarea
                id="description"
                value={formData.description || ""}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label>Tarih</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP", { locale: tr }) : "Tarih seçin"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="time">Saat</Label>
              <Input
                id="time"
                type="time"
                value={formData.start_time || ""}
                onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="location">Konum</Label>
              <Input
                id="location"
                value={formData.location_name || ""}
                onChange={(e) => setFormData({ ...formData, location_name: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="sport">Spor Kategorisi</Label>
              <Select
                value={formData.sport_id?.toString() || ""}
                onValueChange={(value) => setFormData({ ...formData, sport_id: parseInt(value) })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Spor kategorisi seçin" />
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
            <div className="grid gap-2">
              <Label htmlFor="status">Durum</Label>
              <Select
                value={formData.status || event?.status || ""}
                onValueChange={(value) => setFormData({ ...formData, status: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Durum seçin" />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="maxParticipants">Maksimum Katılımcı</Label>
              <Input
                id="maxParticipants"
                type="number"
                min="1"
                value={formData.max_participants || ""}
                onChange={(e) => setFormData({ ...formData, max_participants: parseInt(e.target.value) })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={loading}>
              {loading ? "Kaydediliyor..." : "Kaydet"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}