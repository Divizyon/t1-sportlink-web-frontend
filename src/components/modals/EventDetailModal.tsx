"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { 
  Calendar, Clock, MapPin, Users, Edit, Trash, Save, CalendarIcon,
  CheckCircle, XCircle, Filter, Info, Flag, ExternalLink, MessageSquare
} from "lucide-react"
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"
import { useRouter } from "next/navigation"

interface Participant {
  id: string
  name: string
  email: string
  avatar?: string
  age?: number
  gender?: string
  registeredDate?: string
  eventCount?: number
  status?: "active" | "suspended" | "blocked"
}

interface Report {
  id: string
  reporterId: string
  reporterName: string
  reason: string
  date: string
  status: "pending" | "reviewed" | "dismissed"
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
  category?: string
  tags?: string[]
  rejectionReason?: string
  reports?: Report[]
}

interface EventDetailModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  event?: Event | null
  onSuccess?: () => void
}

// Event kategori listesi
const categories = [
  "Futbol", "Basketbol", "Voleybol", "Tenis", "Yüzme", "Koşu", "Diğer"
]

// Reddetme sebepleri
const rejectionReasons = [
  "Uygunsuz içerik",
  "Yetersiz detay",
  "Tarihi geçmiş",
  "Konum uygun değil",
  "Kapasite sorunu",
  "Güvenlik riski",
  "Diğer"
]

export function EventDetailModal({ open, onOpenChange, event, onSuccess }: EventDetailModalProps) {
  const router = useRouter()
  const [isEditing, setIsEditing] = useState(false)
  const [activeTab, setActiveTab] = useState("details")
  const [loading, setLoading] = useState(false)
  const [showRejectDialog, setShowRejectDialog] = useState(false)
  const [rejectionReason, setRejectionReason] = useState("")
  const [rejectionComment, setRejectionComment] = useState("")
  const [selectedParticipant, setSelectedParticipant] = useState<Participant | null>(null)
  
  // Mock event verisini kullan eğer gerçek bir event yoksa
  const mockEvent: Event = event || {
    id: "evt-123",
    title: "Futbol Turnuvası Finali",
    description: "Üniversiteler arası futbol turnuvasının final maçı.",
    date: new Date(2023, 5, 15),
    time: "15:00",
    location: "Ana Stadyum",
    organizer: "Spor Koordinatörlüğü",
    category: "Futbol",
    tags: ["turnuva", "final", "üniversite"],
    participants: [
      { 
        id: "usr-1", 
        name: "Ahmet Yılmaz", 
        email: "ahmet@mail.com", 
        avatar: "/avatars/01.png",
        age: 22,
        gender: "Erkek",
        registeredDate: "01.01.2023",
        eventCount: 15,
        status: "active"
      },
      { 
        id: "usr-2", 
        name: "Mehmet Demir", 
        email: "mehmet@mail.com", 
        avatar: "/avatars/02.png",
        age: 24,
        gender: "Erkek",
        registeredDate: "15.02.2023",
        eventCount: 8,
        status: "active"
      },
      { 
        id: "usr-3", 
        name: "Ayşe Kaya", 
        email: "ayse@mail.com", 
        avatar: "/avatars/03.png",
        age: 20,
        gender: "Kadın",
        registeredDate: "10.03.2023",
        eventCount: 12,
        status: "active"
      },
      { 
        id: "usr-4", 
        name: "Zeynep Çelik", 
        email: "zeynep@mail.com", 
        avatar: "/avatars/04.png",
        age: 19,
        gender: "Kadın",
        registeredDate: "05.04.2023",
        eventCount: 5,
        status: "active"
      },
    ],
    reports: [
      {
        id: "rep-1",
        reporterId: "usr-101",
        reporterName: "Murat Öz",
        reason: "Uygunsuz içerik - Etkinlik açıklamasında uygunsuz dil kullanımı",
        date: "10.04.2023",
        status: "pending"
      },
      {
        id: "rep-2",
        reporterId: "usr-102",
        reporterName: "Deniz Yıldız",
        reason: "Yanıltıcı bilgi - Etkinlik konumu yanlış",
        date: "11.04.2023",
        status: "pending"
      }
    ],
    status: "pending",
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

  const handleApproveEvent = () => {
    setLoading(true)
    
    // Simüle edilmiş API çağrısı
    setTimeout(() => {
      setFormData(prev => ({ ...prev, status: "approved" }))
      setLoading(false)
      toast.success("Etkinlik onaylandı")
      if (onSuccess) onSuccess()
    }, 1000)
  }

  const openRejectDialog = () => {
    setShowRejectDialog(true)
  }
  
  const handleRejectEvent = () => {
    if (!rejectionReason) {
      toast.error("Lütfen bir red sebebi seçin")
      return
    }
    
    setLoading(true)
    
    // Simüle edilmiş API çağrısı
    setTimeout(() => {
      setFormData(prev => ({ 
        ...prev, 
        status: "rejected",
        rejectionReason: rejectionReason + (rejectionComment ? ` - ${rejectionComment}` : "")
      }))
      setLoading(false)
      setShowRejectDialog(false)
      toast.success("Etkinlik reddedildi ve neden bildirildi")
      if (onSuccess) onSuccess()
    }, 1000)
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

  const handleViewParticipantProfile = (participant: Participant) => {
    setSelectedParticipant(participant)
  }

  const handleNavigateToUserProfile = (userId: string) => {
    // Gerçek uygulamada kullanıcı profiline yönlendirilecek
    toast.info(`${userId} ID'li kullanıcı profiline yönlendiriliyorsunuz`)
    router.push(`/dashboard/users/${userId}`)
  }

  const handleCategoryChange = (value: string) => {
    setFormData(prev => ({ ...prev, category: value }))
  }

  const handleDismissReport = (reportId: string) => {
    if (formData.reports) {
      setFormData(prev => ({
        ...prev,
        reports: prev.reports?.map(report => 
          report.id === reportId ? { ...report, status: "dismissed" } : report
        )
      }))
      toast.success("Rapor reddedildi")
    }
  }

  const handleReviewReport = (reportId: string) => {
    if (formData.reports) {
      setFormData(prev => ({
        ...prev,
        reports: prev.reports?.map(report => 
          report.id === reportId ? { ...report, status: "reviewed" } : report
        )
      }))
      toast.success("Rapor incelendi olarak işaretlendi")
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
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="details">Detaylar</TabsTrigger>
            <TabsTrigger value="participants">Katılımcılar</TabsTrigger>
            <TabsTrigger value="reports" className="relative">
              Raporlar
              {formData.reports && formData.reports.filter(r => r.status === "pending").length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] rounded-full h-4 w-4 flex items-center justify-center">
                  {formData.reports.filter(r => r.status === "pending").length}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="actions">İşlemler</TabsTrigger>
          </TabsList>
          
          {/* Detaylar Tab */}
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
                  <Label htmlFor="category">Kategori</Label>
                  <Select
                    value={formData.category}
                    onValueChange={handleCategoryChange}
                  >
                    <SelectTrigger className="w-full">
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

                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.category && (
                    <Badge variant="secondary" className="bg-blue-50 text-blue-700">
                      <Filter className="mr-1 h-3 w-3" />
                      {formData.category}
                    </Badge>
                  )}
                  
                  {formData.tags && formData.tags.map(tag => (
                    <Badge key={tag} variant="outline" className="bg-gray-50">
                      #{tag}
                    </Badge>
                  ))}
                </div>
                
                <div className="pt-2">
                  <h4 className="text-sm font-medium mb-2">Organizatör</h4>
                  <p>{formData.organizer}</p>
                </div>
                
                <div className="pt-2">
                  <h4 className="text-sm font-medium mb-2">Oluşturulma Tarihi</h4>
                  <p>{format(formData.createdAt, "PPP", { locale: tr })}</p>
                </div>

                {formData.status === "rejected" && formData.rejectionReason && (
                  <div className="pt-2 border p-3 rounded bg-red-50">
                    <h4 className="text-sm font-medium mb-2 flex items-center text-red-700">
                      <XCircle className="mr-1 h-4 w-4" />
                      Reddetme Nedeni
                    </h4>
                    <p className="text-sm text-red-700">{formData.rejectionReason}</p>
                  </div>
                )}
              </div>
            )}
          </TabsContent>
          
          {/* Katılımcılar Tab */}
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
                  <div 
                    key={participant.id} 
                    className="flex items-center justify-between p-3 rounded-lg border hover:bg-slate-50 cursor-pointer transition-colors"
                    onClick={() => handleViewParticipantProfile(participant)}
                  >
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
                    <div className="flex items-center gap-2">
                      <HoverCard>
                        <HoverCardTrigger>
                          <Button variant="ghost" size="sm">
                            <Info className="h-4 w-4" />
                          </Button>
                        </HoverCardTrigger>
                        <HoverCardContent className="w-80">
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span className="text-sm font-medium">Yaş:</span>
                              <span className="text-sm">{participant.age}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm font-medium">Cinsiyet:</span>
                              <span className="text-sm">{participant.gender}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm font-medium">Kayıt Tarihi:</span>
                              <span className="text-sm">{participant.registeredDate}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm font-medium">Etkinlik Sayısı:</span>
                              <span className="text-sm">{participant.eventCount}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm font-medium">Durum:</span>
                              <Badge variant={participant.status === "active" ? "default" : "destructive"} className="text-xs">
                                {participant.status === "active" ? "Aktif" : participant.status === "suspended" ? "Askıda" : "Engellenmiş"}
                              </Badge>
                            </div>
                          </div>
                        </HoverCardContent>
                      </HoverCard>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={(e) => {
                          e.stopPropagation()
                          handleNavigateToUserProfile(participant.id)
                        }}
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                      {isEditing && (
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={(e) => {
                            e.stopPropagation()
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
                  </div>
                ))}

                {selectedParticipant && (
                  <Dialog open={!!selectedParticipant} onOpenChange={() => setSelectedParticipant(null)}>
                    <DialogContent className="sm:max-w-[500px]">
                      <DialogHeader>
                        <DialogTitle>Katılımcı Profili</DialogTitle>
                      </DialogHeader>
                      <div className="flex flex-col gap-4">
                        <div className="flex items-center gap-4">
                          <Avatar className="h-16 w-16">
                            <AvatarImage src={selectedParticipant.avatar} />
                            <AvatarFallback>{selectedParticipant.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <h3 className="text-lg font-semibold">{selectedParticipant.name}</h3>
                            <p className="text-sm text-muted-foreground">{selectedParticipant.email}</p>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <Label>Yaş</Label>
                            <div className="text-sm">{selectedParticipant.age}</div>
                          </div>
                          <div className="space-y-1">
                            <Label>Cinsiyet</Label>
                            <div className="text-sm">{selectedParticipant.gender}</div>
                          </div>
                          <div className="space-y-1">
                            <Label>Kayıt Tarihi</Label>
                            <div className="text-sm">{selectedParticipant.registeredDate}</div>
                          </div>
                          <div className="space-y-1">
                            <Label>Katıldığı Etkinlikler</Label>
                            <div className="text-sm">{selectedParticipant.eventCount}</div>
                          </div>
                          <div className="space-y-1 col-span-2">
                            <Label>Durum</Label>
                            <Badge variant={selectedParticipant.status === "active" ? "default" : "destructive"}>
                              {selectedParticipant.status === "active" ? "Aktif" : selectedParticipant.status === "suspended" ? "Askıda" : "Engellenmiş"}
                            </Badge>
                          </div>
                        </div>

                        <div className="flex justify-end gap-2 mt-4">
                          <Button 
                            variant="outline" 
                            onClick={() => setSelectedParticipant(null)}
                          >
                            Kapat
                          </Button>
                          <Button 
                            onClick={() => {
                              handleNavigateToUserProfile(selectedParticipant.id)
                              setSelectedParticipant(null)
                            }}
                          >
                            <ExternalLink className="mr-2 h-4 w-4" />
                            Profili Görüntüle
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                )}
              </div>
            </div>
          </TabsContent>

          {/* Raporlar Tab */}
          <TabsContent value="reports" className="space-y-4 pt-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Raporlar</h3>
                {formData.reports && (
                  <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
                    {formData.reports.filter(r => r.status === "pending").length} Bekleyen
                  </Badge>
                )}
              </div>
              
              {formData.reports && formData.reports.length > 0 ? (
                <div className="space-y-3">
                  {formData.reports.map((report) => (
                    <div key={report.id} className="border rounded-lg overflow-hidden">
                      <div className={cn(
                        "p-3",
                        report.status === "pending" ? "bg-yellow-50" : 
                        report.status === "reviewed" ? "bg-blue-50" : "bg-gray-50"
                      )}>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">{report.reporterName}</p>
                            <p className="text-xs text-muted-foreground">{report.date}</p>
                          </div>
                          <Badge variant="outline" className={cn(
                            "text-xs",
                            report.status === "pending" ? "bg-yellow-100 text-yellow-800 border-yellow-300" : 
                            report.status === "reviewed" ? "bg-blue-100 text-blue-800 border-blue-300" : 
                            "bg-gray-100 text-gray-800 border-gray-300"
                          )}>
                            {report.status === "pending" ? "Beklemede" : 
                             report.status === "reviewed" ? "İncelendi" : "Reddedildi"}
                          </Badge>
                        </div>
                      </div>
                      <div className="p-3">
                        <p className="text-sm">{report.reason}</p>
                      </div>
                      {report.status === "pending" && (
                        <div className="p-3 border-t flex justify-end gap-2">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => handleDismissReport(report.id)}
                          >
                            <XCircle className="mr-1 h-4 w-4" />
                            Reddet
                          </Button>
                          <Button 
                            size="sm" 
                            onClick={() => handleReviewReport(report.id)}
                          >
                            <CheckCircle className="mr-1 h-4 w-4" />
                            İncelendi
                          </Button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Flag className="mx-auto h-8 w-8 opacity-30 mb-2" />
                  <p>Bu etkinlik için henüz rapor bulunmuyor.</p>
                </div>
              )}
            </div>
          </TabsContent>

          {/* İşlemler Tab */}
          <TabsContent value="actions" className="space-y-4 pt-4">
            <div className="space-y-4">
              <div className="border p-4 rounded-lg space-y-4">
                <h3 className="text-lg font-semibold">Etkinlik Durumu</h3>
                <div className="flex items-center gap-3">
                  <p className="text-muted-foreground">Mevcut Durum:</p>
                  {getStatusBadge(formData.status)}
                </div>

                {formData.status === "pending" && (
                  <div className="flex flex-col sm:flex-row gap-2 pt-2">
                    <Button 
                      className="flex-1" 
                      onClick={handleApproveEvent}
                      disabled={loading}
                    >
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Etkinliği Onayla
                    </Button>
                    <Button 
                      variant="outline" 
                      className="flex-1" 
                      onClick={openRejectDialog}
                      disabled={loading}
                    >
                      <XCircle className="mr-2 h-4 w-4" />
                      Etkinliği Reddet
                    </Button>
                  </div>
                )}

                {showRejectDialog && (
                  <div className="border p-3 rounded-lg mt-3 space-y-3 bg-gray-50">
                    <h4 className="font-medium">Reddetme Nedeni</h4>
                    <div className="space-y-2">
                      <Select 
                        value={rejectionReason} 
                        onValueChange={setRejectionReason}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Reddetme nedeni seçin" />
                        </SelectTrigger>
                        <SelectContent>
                          {rejectionReasons.map(reason => (
                            <SelectItem key={reason} value={reason}>{reason}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      
                      <Textarea 
                        placeholder="Ek açıklama (isteğe bağlı)" 
                        value={rejectionComment}
                        onChange={e => setRejectionComment(e.target.value)}
                        className="h-20"
                      />
                      
                      <div className="flex justify-end gap-2 pt-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => setShowRejectDialog(false)}
                          disabled={loading}
                        >
                          İptal
                        </Button>
                        <Button 
                          variant="destructive" 
                          size="sm" 
                          onClick={handleRejectEvent}
                          disabled={loading}
                        >
                          Etkinliği Reddet
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="border p-4 rounded-lg space-y-4">
                <h3 className="text-lg font-semibold">Etkinlik Yönetimi</h3>
                <div className="flex flex-col sm:flex-row gap-2">
                  <Button 
                    variant={isEditing ? "default" : "outline"} 
                    className="flex-1" 
                    onClick={() => setIsEditing(!isEditing)}
                  >
                    <Edit className="mr-2 h-4 w-4" />
                    {isEditing ? "Düzenleme Modundasınız" : "Etkinliği Düzenle"}
                  </Button>
                  
                  <Button 
                    variant="destructive" 
                    className="flex-1" 
                    disabled={loading}
                    onClick={handleDelete}
                  >
                    <Trash className="mr-2 h-4 w-4" />
                    Etkinliği Sil
                  </Button>
                </div>
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
                onClick={handleSave}
                disabled={loading}
              >
                <Save className="mr-2 h-4 w-4" /> Kaydet
              </Button>
            </>
          ) : (
            <Button
              type="button"
              onClick={() => onOpenChange(false)}
            >
              Kapat
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
} 