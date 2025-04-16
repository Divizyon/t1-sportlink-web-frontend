"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Calendar, Clock, MapPin, Users, Edit, Trash, Save, CalendarIcon } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { toast } from "sonner"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { format } from "date-fns"
import { tr } from "date-fns/locale"
import { Badge } from "@/components/ui/badge"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { DatePickerWithPresets } from "@/components/ui/custom-datepicker"

interface Participant {
  id: string
  name: string
  email: string
  avatar?: string
}

interface Event {
  id: string
  title: string
  description: string
  date: Date
  time: string
  location: string
  organizer: string
  participants: Participant[]
  status: "pending" | "approved" | "rejected" | "completed"
  maxParticipants: number
  createdAt: Date
}

interface EventDetailModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  event?: Event | null
  onSuccess?: () => void
}

export function EventDetailModal({ open, onOpenChange, event, onSuccess }: EventDetailModalProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [activeTab, setActiveTab] = useState("details")
  const [loading, setLoading] = useState(false)
  
  // Mock event verisini kullan eğer gerçek bir event yoksa
  const mockEvent: Event = event || {
    id: "evt-123",
    title: "Futbol Turnuvası Finali",
    description: "Üniversiteler arası futbol turnuvasının final maçı.",
    date: new Date(2023, 5, 15),
    time: "15:00",
    location: "Ana Stadyum",
    organizer: "Spor Koordinatörlüğü",
    participants: [
      { id: "usr-1", name: "Ahmet Yılmaz", email: "ahmet@mail.com", avatar: "/avatars/01.png" },
      { id: "usr-2", name: "Mehmet Demir", email: "mehmet@mail.com", avatar: "/avatars/02.png" },
      { id: "usr-3", name: "Ayşe Kaya", email: "ayse@mail.com", avatar: "/avatars/03.png" },
      { id: "usr-4", name: "Zeynep Çelik", email: "zeynep@mail.com", avatar: "/avatars/04.png" },
    ],
    status: "approved",
    maxParticipants: 22,
    createdAt: new Date(2023, 4, 20),
  }
  
  const [formData, setFormData] = useState<Event>(mockEvent)
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }
  
  const handleDateChange = (date: Date | undefined) => {
    if (date) {
      setFormData(prev => ({ ...prev, date }))
    }
  }
  
  const handleSave = () => {
    setLoading(true)
    
    // Simüle edilmiş API çağrısı
    setTimeout(() => {
      setLoading(false)
      setIsEditing(false)
      toast.success("Etkinlik bilgileri güncellendi")
      if (onSuccess) onSuccess()
    }, 1000)
  }
  
  const handleDelete = () => {
    if (confirm("Bu etkinliği silmek istediğinizden emin misiniz?")) {
      setLoading(true)
      
      // Simüle edilmiş API çağrısı
      setTimeout(() => {
        setLoading(false)
        toast.success("Etkinlik silindi")
        onOpenChange(false)
        if (onSuccess) onSuccess()
      }, 1000)
    }
  }
  
  const getStatusBadge = (status: Event["status"]) => {
    switch (status) {
      case "pending":
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">Onay Bekliyor</Badge>
      case "approved":
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Onaylandı</Badge>
      case "rejected":
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Reddedildi</Badge>
      case "completed":
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Tamamlandı</Badge>
      default:
        return null
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl">{isEditing ? "Etkinliği Düzenle" : "Etkinlik Detayları"}</DialogTitle>
            {getStatusBadge(formData.status)}
          </div>
          <DialogDescription>
            {isEditing
              ? "Etkinlik bilgilerini düzenleyebilirsiniz."
              : "Etkinlik detaylarını görüntüleyin ve gerekirse düzenleyin."}
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="details">Detaylar</TabsTrigger>
            <TabsTrigger value="participants">Katılımcılar</TabsTrigger>
          </TabsList>
          
          <TabsContent value="details" className="space-y-4 pt-4">
            {isEditing ? (
              <form className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Etkinlik Başlığı</Label>
                  <Input 
                    id="title" 
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required 
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">Açıklama</Label>
                  <Textarea 
                    id="description" 
                    name="description"
                    className="min-h-[100px]"
                    value={formData.description}
                    onChange={handleChange}
                    required 
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="date">Tarih</Label>
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
                      <PopoverContent className="w-auto p-0">
                        <DatePickerWithPresets onSelect={handleDateChange} />
                      </PopoverContent>
                    </Popover>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="time">Saat</Label>
                    <Input 
                      id="time" 
                      name="time"
                      type="time"
                      value={formData.time}
                      onChange={handleChange}
                      required 
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="location">Konum</Label>
                  <Input 
                    id="location" 
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    required 
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="maxParticipants">Maksimum Katılımcı Sayısı</Label>
                  <Input 
                    id="maxParticipants" 
                    name="maxParticipants"
                    type="number"
                    min={1}
                    value={formData.maxParticipants}
                    onChange={handleChange}
                    required 
                  />
                </div>
              </form>
            ) : (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">{formData.title}</h3>
                
                <p className="text-muted-foreground">{formData.description}</p>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>{format(formData.date, "PPP", { locale: tr })}</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>{formData.time}</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>{formData.location}</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span>{formData.participants.length} / {formData.maxParticipants} Katılımcı</span>
                  </div>
                </div>
                
                <div className="pt-2">
                  <h4 className="text-sm font-medium mb-2">Organizatör</h4>
                  <p>{formData.organizer}</p>
                </div>
                
                <div className="pt-2">
                  <h4 className="text-sm font-medium mb-2">Oluşturulma Tarihi</h4>
                  <p>{format(formData.createdAt, "PPP", { locale: tr })}</p>
                </div>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="participants" className="space-y-4 pt-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Katılımcılar</h3>
                <span className="text-sm text-muted-foreground">
                  {formData.participants.length} / {formData.maxParticipants}
                </span>
              </div>
              
              <div className="space-y-3">
                {formData.participants.map((participant) => (
                  <div key={participant.id} className="flex items-center justify-between p-3 rounded-lg border">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={participant.avatar} />
                        <AvatarFallback>{participant.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{participant.name}</p>
                        <p className="text-sm text-muted-foreground">{participant.email}</p>
                      </div>
                    </div>
                    {isEditing && (
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => {
                          setFormData(prev => ({
                            ...prev,
                            participants: prev.participants.filter(p => p.id !== participant.id)
                          }))
                        }}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter className="gap-2">
          {isEditing ? (
            <>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsEditing(false)}
                disabled={loading}
              >
                İptal
              </Button>
              <Button
                type="button"
                variant="destructive"
                onClick={handleDelete}
                disabled={loading}
              >
                <Trash className="mr-2 h-4 w-4" /> Sil
              </Button>
              <Button 
                type="button" 
                onClick={handleSave}
                disabled={loading}
              >
                <Save className="mr-2 h-4 w-4" /> Kaydet
              </Button>
            </>
          ) : (
            <Button
              type="button"
              onClick={() => setIsEditing(true)}
            >
              <Edit className="mr-2 h-4 w-4" /> Düzenle
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
} 