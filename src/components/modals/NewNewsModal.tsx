"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Newspaper } from "lucide-react"

export function NewNewsModal() {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Newspaper className="mr-2 h-4 w-4" />
          Haber Ekle
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Yeni Haber Ekle</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="title">Haber Başlığı</Label>
            <Input id="title" placeholder="Haber başlığını girin" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="content">İçerik</Label>
            <Textarea id="content" placeholder="Haber içeriğini girin" className="min-h-[200px]" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="image">Görsel URL</Label>
            <Input id="image" placeholder="Görsel URL'sini girin" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="source">Kaynak</Label>
            <Input id="source" placeholder="Haber kaynağını girin" />
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => setOpen(false)}>
            İptal
          </Button>
          <Button onClick={() => setOpen(false)}>
            Yayınla
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
} 