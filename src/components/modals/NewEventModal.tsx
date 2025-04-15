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
import { CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"

export function NewEventModal() {
  const [date, setDate] = useState<Date>()
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <CalendarIcon className="mr-2 h-4 w-4" />
          Yeni Etkinlik
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Yeni Etkinlik Oluştur</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Etkinlik Adı</Label>
            <Input id="name" placeholder="Etkinlik adını girin" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="description">Açıklama</Label>
            <Textarea id="description" placeholder="Etkinlik açıklamasını girin" />
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
            <Input id="location" placeholder="Etkinlik konumunu girin" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="capacity">Katılımcı Kapasitesi</Label>
            <Input id="capacity" type="number" placeholder="Maksimum katılımcı sayısı" />
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => setOpen(false)}>
            İptal
          </Button>
          <Button onClick={() => setOpen(false)}>
            Oluştur
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
} 