"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"

interface DeleteEventModalProps {
  eventName: string
  onDelete: () => void
}

export function DeleteEventModal({ eventName, onDelete }: DeleteEventModalProps) {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="destructive" size="icon">
          <Trash2 className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Etkinliği Sil</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <p className="text-sm text-muted-foreground">
            "{eventName}" etkinliğini silmek istediğinize emin misiniz? Bu işlem geri alınamaz.
          </p>
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => setOpen(false)}>
            İptal
          </Button>
          <Button variant="destructive" onClick={() => {
            onDelete()
            setOpen(false)
          }}>
            Sil
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
} 