"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, MapPin, Users, Plus } from "lucide-react"
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
import { cn } from "@/lib/utils"

interface NewEventModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

export function NewEventModal({ open, onOpenChange, onSuccess }: NewEventModalProps) {
  const [loading, setLoading] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    // Simüle edilmiş işlem
    setTimeout(() => {
      setLoading(false)
      if (onSuccess) onSuccess()
    }, 1000)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Yeni Etkinlik Oluştur</DialogTitle>
          <DialogDescription>
            Etkinlik detaylarını girerek yeni bir spor etkinliği oluşturun.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Etkinlik Adı</Label>
            <Input id="title" placeholder="Örnek: Futbol Turnuvası" required />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">Tarih</Label>
              <div className="relative">
                <Input id="date" type="date" className="pl-9" required />
                <Calendar className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="time">Saat</Label>
              <div className="relative">
                <Input id="time" type="time" className="pl-9" required />
                <Clock className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="location">Konum</Label>
            <div className="relative">
              <Input id="location" placeholder="Konum" className="pl-9" required />
              <MapPin className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="capacity">Kapasite</Label>
              <div className="relative">
                <Input id="capacity" type="number" min="1" className="pl-9" required />
                <Users className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Açıklama</Label>
            <Textarea 
              id="description" 
              placeholder="Etkinlik detayları..." 
              className="resize-none"
              rows={4}
            />
          </div>
          
          <DialogFooter>
            <Button type="submit" disabled={loading} className="w-full gap-1">
              {loading ? "Oluşturuluyor..." : (
                <>
                  <Plus className="h-4 w-4" /> Etkinlik Oluştur
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
} 