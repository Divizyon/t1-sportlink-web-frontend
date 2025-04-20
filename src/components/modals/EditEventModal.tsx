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
import { useToast } from "@/components/ui/use-toast"

interface Event {
  id: string | number
  title: string
  description?: string
  date: Date
  time: string
  location: string
  category: string
  participants: number
  maxParticipants: number
  status: "pending" | "approved" | "rejected" | "completed"
  organizer?: string
  image?: string
}

interface EditEventModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
  event?: Event
  onSave?: (updatedEvent: Partial<Event>) => void
}

// Event kategori listesi
const categories = [
  "Futbol", "Basketbol", "Voleybol", "Tenis", "Yüzme", "Koşu", "Diğer"
]

export function EditEventModal({ open, onOpenChange, onSuccess, event, onSave }: EditEventModalProps) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState<Partial<Event>>({})
  const [date, setDate] = useState<Date>()
  const { toast } = useToast()

  useEffect(() => {
    if (event && open) {
      setFormData(event)
      setDate(new Date(event.date))
    } else {
      setFormData({})
      setDate(undefined)
    }
  }, [event, open])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      // TODO: Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      if (onSave) {
        onSave({
          ...formData,
          date: date || new Date(),
        })
      }
      
      toast({
        title: "Başarılı",
        description: "Etkinlik başarıyla güncellendi.",
      })
      
      if (onSuccess) onSuccess()
      onOpenChange(false)
    } catch (error) {
      toast({
        title: "Hata",
        description: "Etkinlik güncellenirken bir hata oluştu.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  if (!event && open) {
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
              <Label htmlFor="title" className="text-right">
                Etkinlik Adı
              </Label>
              <Input
                id="title"
                placeholder="Etkinlik adını girin"
                className="col-span-3"
                value={formData.title || ""}
                onChange={(e) => setFormData(prev => ({...prev, title: e.target.value}))}
                required
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="category" className="text-right">
                Kategori
              </Label>
              <Select
                value={formData.category}
                onValueChange={(value) => 
                  setFormData(prev => ({...prev, category: value}))
                }
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Kategori seçin" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
              <Label htmlFor="location" className="text-right">
                Konum
              </Label>
              <Input
                id="location"
                placeholder="Etkinlik konumunu girin"
                className="col-span-3"
                value={formData.location || ""}
                onChange={(e) => 
                  setFormData(prev => ({...prev, location: e.target.value}))
                }
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="maxParticipants" className="text-right">
                Maksimum Katılımcı
              </Label>
              <Input
                id="maxParticipants"
                type="number"
                placeholder="Maksimum katılımcı sayısı"
                className="col-span-3"
                value={formData.maxParticipants || ""}
                onChange={(e) => 
                  setFormData(prev => ({...prev, maxParticipants: parseInt(e.target.value) || 0}))
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
                value={formData.description || ""}
                onChange={(e) => 
                  setFormData(prev => ({...prev, description: e.target.value}))
                }
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              İptal
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Kaydediliyor..." : "Kaydet"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}