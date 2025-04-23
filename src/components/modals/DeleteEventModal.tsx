"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { Trash2 } from "lucide-react"
import axios from "axios"
import { useRouter } from "next/navigation"

interface DeleteEventModalProps {
  eventId: number
  eventName: string
  onSuccess?: () => void
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function DeleteEventModal({ eventId, eventName, onSuccess, open, onOpenChange }: DeleteEventModalProps) {
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  const handleDelete = async () => {
    if (loading) return; // Prevent multiple clicks
    
    try {
      setLoading(true)
      
      if (!eventId || eventId === undefined) {
        toast({
          title: "Hata",
          description: "Silinecek etkinlik bulunamadı.",
          variant: "destructive",
        })
        return;
      }

      const token = localStorage.getItem('token');
      if (!token) {
        toast({
          title: "Hata",
          description: "Bu işlemi gerçekleştirmek için giriş yapmalısınız.",
          variant: "destructive",
        })
        return
      }

      const response = await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/events/${eventId}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.status === 200) {
        toast({
          title: "Başarılı",
          description: "Etkinlik başarıyla silindi"
        });
        onOpenChange(false);
        router.refresh();
      }
    } catch (error) {
      console.error("Etkinlik silme hatası:", error)
      if (axios.isAxiosError(error)) {
        if (error.name === 'AbortError' || error.code === 'ECONNABORTED') {
          toast({
            title: "Zaman Aşımı",
            description: "İşlem çok uzun sürdü. Lütfen tekrar deneyin.",
            variant: "destructive",
          })
        } else if (error.response?.status === 401) {
          toast({
            title: "Hata",
            description: "Bu işlemi gerçekleştirmek için yetkiniz yok.",
            variant: "destructive",
          })
        } else if (error.code === 'ERR_NETWORK') {
          toast({
            title: "Hata",
            description: "Sunucuya bağlanılamadı. Lütfen internet bağlantınızı kontrol edin."
          });
        } else {
          toast({
            title: "Hata",
            description: error.response?.data?.message || "Etkinlik silinirken bir hata oluştu"
          });
        }
      } else {
        toast({
          title: "Hata",
          description: "Beklenmeyen bir hata oluştu"
        });
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button variant="destructive" size="icon">
          <Trash2 className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Etkinliği Sil</DialogTitle>
          <DialogDescription>
            "{eventName}" etkinliğini silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)} 
            disabled={loading}
          >
            İptal
          </Button>
          <Button 
            variant="destructive" 
            onClick={handleDelete} 
            disabled={loading}
          >
            {loading ? "Siliniyor..." : "Sil"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
} 