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
import { CalendarIcon, Users } from "lucide-react"
import { format } from "date-fns"
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

interface Event {
  id: number
  title: string
  date: string
  type: string
  location: string
  participants: number
  description: string
}

interface EditEventModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
  eventId?: number
}

// Mock etkinlik verileri
const mockEvents: Event[] = [
  {
    id: 1,
    title: "Futbol Turnuvası",
    date: "2023-04-18",
    type: "football",
    location: "Spor Kompleksi",
    participants: 24,
    description: "Yıllık futbol turnuvası, tüm takımların katılımı bekleniyor."
  },
  {
    id: 2,
    title: "Basketbol Maçı",
    date: "2023-04-15",
    type: "basketball",
    location: "Kapalı Spor Salonu",
    participants: 16,
    description: "Dostluk karşılaşması, iki takım arasında."
  },
  {
    id: 3,
    title: "Yüzme Yarışması",
    date: "2023-04-12",
    type: "swimming",
    location: "Olimpik Havuz",
    participants: 32,
    description: "Tüm yaş kategorilerinde yüzme yarışları."
  },
  {
    id: 4,
    title: "Tenis Turnuvası",
    date: "2023-04-10",
    type: "tennis",
    location: "Tenis Kortları",
    participants: 12,
    description: "Tenis kulübü üyeleri arası turnuva."
  }
]

export function EditEventModal({ open, onOpenChange, onSuccess, eventId }: EditEventModalProps) {
  const [loading, setLoading] = useState(false)
  const [event, setEvent] = useState<Event | null>(null)
  const [date, setDate] = useState<Date>()

  useEffect(() => {
    if (eventId && open) {
      // Gerçek bir API'dan etkinlik verisi çekilecek yerde mock veriden alıyoruz
      const foundEvent = mockEvents.find(e => e.id === eventId)
      if (foundEvent) {
        setEvent(foundEvent)
        setDate(new Date(foundEvent.date))
      }
    } else {
      setEvent(null)
      setDate(undefined)
    }
  }, [eventId, open])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    // Mock API isteği
    setTimeout(() => {
      setLoading(false)
      if (onSuccess) onSuccess()
    }, 1500)
  }

  if (!event && eventId) {
    return null
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Etkinlik Düzenle</DialogTitle>
          <DialogDescription>
            Etkinlik detaylarını güncelleyin.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Etkinlik Adı
              </Label>
              <Input
                id="name"
                placeholder="Etkinlik adını girin"
                className="col-span-3"
                value={event?.title || ""}
                onChange={(e) => setEvent(prev => prev ? {...prev, title: e.target.value} : null)}
                required
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="date" className="text-right">
                Tarih
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "col-span-3 justify-start text-left font-normal",
                      !date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : "Tarih seçin"}
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
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="type" className="text-right">
                Etkinlik Türü
              </Label>
              <Select
                value={event?.type}
                onValueChange={(value) => 
                  setEvent(prev => prev ? {...prev, type: value} : null)
                }
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Etkinlik türü seçin" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="football">Futbol</SelectItem>
                  <SelectItem value="basketball">Basketbol</SelectItem>
                  <SelectItem value="volleyball">Voleybol</SelectItem>
                  <SelectItem value="tennis">Tenis</SelectItem>
                  <SelectItem value="swimming">Yüzme</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="location" className="text-right">
                Konum
              </Label>
              <Input
                id="location"
                placeholder="Etkinlik konumunu girin"
                className="col-span-3"
                value={event?.location || ""}
                onChange={(e) => 
                  setEvent(prev => prev ? {...prev, location: e.target.value} : null)
                }
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="participants" className="text-right">
                Katılımcı Sayısı
              </Label>
              <Input
                id="participants"
                type="number"
                placeholder="Maksimum katılımcı sayısı"
                className="col-span-3"
                value={event?.participants || ""}
                onChange={(e) => 
                  setEvent(prev => prev ? 
                    {...prev, participants: parseInt(e.target.value) || 0} : null)
                }
              />
            </div>
            
            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="description" className="text-right">
                Açıklama
              </Label>
              <Textarea
                id="description"
                placeholder="Etkinlik açıklaması"
                className="col-span-3"
                rows={3}
                value={event?.description || ""}
                onChange={(e) => 
                  setEvent(prev => prev ? {...prev, description: e.target.value} : null)
                }
              />
            </div>
          </div>

          <div className="mb-4 rounded-md bg-blue-50 p-3">
            <div className="flex items-center">
              <Users className="mr-2 h-4 w-4 text-blue-600" />
              <p className="text-sm font-medium text-blue-600">
                Mevcut Katılımcılar: {event?.participants || 0}
              </p>
            </div>
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              İptal
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Kaydediliyor..." : "Değişiklikleri Kaydet"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}