"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Check, X, Search, Calendar, MapPin, Users } from "lucide-react"
import { toast } from "sonner"

// Mock veri, gerçek uygulamada API'dan gelecek
const mockEvents = [
  {
    id: 1,
    title: "Halı Saha Maçı",
    date: "28 Nisan 2024",
    time: "18:00",
    location: "Kadıköy Spor Kompleksi",
    organizer: "Ahmet Yılmaz",
    participants: 12,
    status: "pending",
    createdAt: "26 Nisan 2024"
  },
  {
    id: 2,
    title: "Basketbol Turnuvası",
    date: "30 Nisan 2024",
    time: "14:00",
    location: "Ataşehir Spor Salonu",
    organizer: "Mehmet Demir",
    participants: 20,
    status: "pending",
    createdAt: "25 Nisan 2024"
  },
  {
    id: 3,
    title: "Yüzme Etkinliği",
    date: "2 Mayıs 2024", 
    time: "10:00",
    location: "Beşiktaş Yüzme Havuzu",
    organizer: "Ayşe Kaya",
    participants: 8,
    status: "pending",
    createdAt: "24 Nisan 2024"
  },
  {
    id: 4,
    title: "Tenis Dersi",
    date: "5 Mayıs 2024",
    time: "16:30",
    location: "Şişli Tenis Kulübü",
    organizer: "Can Yıldız",
    participants: 4,
    status: "pending",
    createdAt: "23 Nisan 2024"
  },
  {
    id: 5,
    title: "Voleybol Maçı",
    date: "7 Mayıs 2024",
    time: "19:00",
    location: "Maltepe Sahil Spor Alanı",
    organizer: "Zeynep Çelik",
    participants: 12,
    status: "pending",
    createdAt: "22 Nisan 2024"
  }
]

type ApprovalModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ApprovalModal({ open, onOpenChange }: ApprovalModalProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("pending")
  const [events, setEvents] = useState(mockEvents)
  const [selectedEvent, setSelectedEvent] = useState<typeof mockEvents[0] | null>(null)

  const filteredEvents = events.filter(event => 
    (activeTab === "all" || event.status === activeTab) &&
    (event.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
     event.organizer.toLowerCase().includes(searchQuery.toLowerCase()) ||
     event.location.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  const handleApprove = (id: number) => {
    setEvents(prevEvents => 
      prevEvents.map(event => 
        event.id === id ? { ...event, status: "approved" } : event
      )
    )
    toast.success("Etkinlik başarıyla onaylandı")
    setSelectedEvent(null)
  }

  const handleReject = (id: number) => {
    setEvents(prevEvents => 
      prevEvents.map(event => 
        event.id === id ? { ...event, status: "rejected" } : event
      )
    )
    toast.success("Etkinlik reddedildi")
    setSelectedEvent(null)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800">Onay Bekliyor</Badge>
      case "approved":
        return <Badge variant="outline" className="bg-green-100 text-green-800">Onaylandı</Badge>
      case "rejected":
        return <Badge variant="outline" className="bg-red-100 text-red-800">Reddedildi</Badge>
      default:
        return null
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Etkinlik Onayları</DialogTitle>
        </DialogHeader>
        
        <div className="flex flex-col gap-4 mt-2 flex-1 overflow-hidden">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Etkinlik, organizatör veya lokasyon ara..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <Tabs defaultValue="pending" className="w-fit" value={activeTab} onValueChange={setActiveTab}>
              <TabsList>
                <TabsTrigger value="pending">Bekleyenler</TabsTrigger>
                <TabsTrigger value="approved">Onaylananlar</TabsTrigger>
                <TabsTrigger value="rejected">Reddedilenler</TabsTrigger>
                <TabsTrigger value="all">Tümü</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 overflow-y-auto pr-2" style={{ maxHeight: "calc(80vh - 200px)" }}>
            {filteredEvents.length > 0 ? (
              filteredEvents.map((event) => (
                <div
                  key={event.id}
                  className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                    selectedEvent?.id === event.id ? "border-primary bg-primary/5" : "hover:bg-accent"
                  }`}
                  onClick={() => setSelectedEvent(event)}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-medium">{event.title}</h3>
                    {getStatusBadge(event.status)}
                  </div>
                  
                  <div className="text-sm text-muted-foreground space-y-1">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span>{event.date}, {event.time}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      <span>{event.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      <span>{event.participants} Katılımcı</span>
                    </div>
                  </div>
                  
                  <div className="mt-3 text-xs text-muted-foreground">
                    <span>Organizatör: {event.organizer}</span>
                    <div>Oluşturulma: {event.createdAt}</div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full flex justify-center items-center py-8 text-muted-foreground">
                Bu kriterlere uygun etkinlik bulunamadı.
              </div>
            )}
          </div>

          {selectedEvent && selectedEvent.status === "pending" && (
            <div className="flex justify-end gap-2 mt-auto pt-4 border-t">
              <Button 
                variant="outline" 
                onClick={() => handleReject(selectedEvent.id)}
                className="gap-1"
              >
                <X className="h-4 w-4" /> Reddet
              </Button>
              <Button 
                onClick={() => handleApprove(selectedEvent.id)}
                className="gap-1"
              >
                <Check className="h-4 w-4" /> Onayla
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
} 