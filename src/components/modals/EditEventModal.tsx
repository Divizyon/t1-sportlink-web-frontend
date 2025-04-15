"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { CalendarIcon, Edit } from "lucide-react"
import { cn } from "@/lib/utils"

interface EditEventModalProps {
  event: {
    id: string
    name: string
    description: string
    date: Date
    location: string
    capacity: number
  }
}

export function EditEventModal({ event }: EditEventModalProps) {
  const [date, setDate] = useState<Date>(event.date)
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon">
          <Edit className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Etkinliği Düzenle</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Etkinlik Adı</Label>
            <Input id="name" defaultValue={event.name} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="description">Açıklama</Label>
            <Textarea id="description" defaultValue={event.description} />
          </div>
          <div className="grid gap-2">
            <Label>Tarih</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : <span>Tarih seçin</span>}
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
            <Label htmlFor="location">Konum</Label>
            <Input id="location" defaultValue={event.location} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="capacity">Katılımcı Kapasitesi</Label>
            <Input id="capacity" type="number" defaultValue={event.capacity} />
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => setOpen(false)}>
            İptal
          </Button>
          <Button onClick={() => setOpen(false)}>
            Kaydet
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
} 