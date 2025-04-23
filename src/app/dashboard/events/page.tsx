"use client";

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { NewEventModal } from "@/components/modals/NewEventModal"
import { EditEventModal } from "@/components/modals/EditEventModal"
import { DeleteEventModal } from "@/components/modals/DeleteEventModal"
import { Plus, ChevronRight } from "lucide-react"
import { format, parseISO } from "date-fns"
import { tr } from "date-fns/locale"
import { useToast } from "@/components/ui/use-toast"
import axios from 'axios'
import { Event as EventType } from '@/types'
import { EventCard } from '@/components/events/EventCard'
import { EventFilter } from '@/components/events/EventFilter'

// Define User interface correctly
interface User {
  id: string
  name: string
  surname: string
  role: "bireysel_kullanici" | "kulup_uyesi" | "antrenor" | "tesis_sahibi"
  email: string
  avatar?: string
}

// Define Event interface correctly
interface Event {
  id: string | number
  title: string
  description: string
  date: Date
  time: string
  location: string
  category: string
  participants: number
  maxParticipants: number
  status: "pending" | "approved" | "rejected" | "completed"
  organizer: User
  image?: string
  participantList?: User[]
}

// Kategori renkleri
const CATEGORY_COLORS: Record<string, { bg: string; text: string }> = {
  "4": { bg: "bg-blue-100", text: "text-blue-800" },
  "5": { bg: "bg-orange-100", text: "text-orange-800" },
  "6": { bg: "bg-green-100", text: "text-green-800" }
};

// Durum renkleri
const STATUS_COLORS: Record<string, { bg: string; text: string }> = {
  "pending": { bg: "bg-yellow-100", text: "text-yellow-800" },
  "approved": { bg: "bg-green-100", text: "text-green-800" },
  "rejected": { bg: "bg-red-100", text: "text-red-800" },
  "completed": { bg: "bg-gray-100", text: "text-gray-800" }
};

// Rol açıklamaları
const ROLE_LABELS: Record<string, string> = {
  "bireysel_kullanici": "Bireysel Kullanıcı",
  "kulup_uyesi": "Kulüp Üyesi",
  "antrenor": "Antrenör",
  "tesis_sahibi": "Tesis Sahibi"
}

// Örnek kullanıcılar
const sampleUsers: User[] = [
  {
    id: "1",
    name: "Ahmet",
    surname: "Yılmaz",
    role: "antrenor",
    email: "ahmet.yilmaz@sportlink.com"
  },
  {
    id: "2",
    name: "Mehmet",
    surname: "Demir",
    role: "kulup_uyesi",
    email: "mehmet.demir@sportlink.com"
  },
  {
    id: "3",
    name: "Ayşe",
    surname: "Kaya",
    role: "tesis_sahibi",
    email: "ayse.kaya@sportlink.com"
  }
]

// Baş harfleri alma yardımcı fonksiyonu
const getInitials = (name?: string, surname?: string) => {
  const firstInitial = name?.charAt(0) || '';
  const secondInitial = surname?.charAt(0) || '';
  return firstInitial + secondInitial || '??';
};

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filters, setFilters] = useState({
    search: "",
    category: "all",
    date: ""
  })
  const [newEventModalOpen, setNewEventModalOpen] = useState(false)
  const [editEventModalOpen, setEditEventModalOpen] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/events`, {
          params: filters
        });
        
        if (response.data.status === 'success') {
          const eventsData = response.data.data.events || [];
          setEvents(eventsData.map((event: any) => ({
            ...event,
            date: event.event_date ? parseISO(event.event_date) : new Date()
          })));
        } else {
          setError('Etkinlikler alınamadı');
        }
      } catch (error) {
        console.error('Events fetch error:', error);
        setError('Etkinlikler alınırken bir hata oluştu');
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvents();
  }, [filters]);

  if (isLoading) {
    return <div>Yükleniyor...</div>
  }

  if (error) {
    return <div className="text-red-500">{error}</div>
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Etkinlikler</h1>
        <Button onClick={() => setNewEventModalOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Yeni Etkinlik
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Input
          type="text"
          placeholder="Etkinlik Ara..."
          value={filters.search}
          onChange={(e) => setFilters({ ...filters, search: e.target.value })}
        />
        
        <Select
          value={filters.category}
          onValueChange={(value) => setFilters({ ...filters, category: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Kategori Seçin" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tümü</SelectItem>
            <SelectItem value="4">Futbol</SelectItem>
            <SelectItem value="5">Basketbol</SelectItem>
            <SelectItem value="6">Voleybol</SelectItem>
          </SelectContent>
        </Select>
        
        <Input
          type="date"
          value={filters.date}
          onChange={(e) => setFilters({ ...filters, date: e.target.value })}
        />
      </div>
      
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Etkinlik</TableHead>
              <TableHead>Kategori</TableHead>
              <TableHead>Tarih</TableHead>
              <TableHead>Konum</TableHead>
              <TableHead>Durum</TableHead>
              <TableHead>İşlemler</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {events.map((event) => (
              <TableRow key={event.id}>
                <TableCell>
                  <div>
                    <div className="font-medium">{event.title}</div>
                    <div className="text-sm text-gray-500">{event.description}</div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge 
                    variant="outline"
                    className={`${CATEGORY_COLORS[event.sport_id]?.bg} ${CATEGORY_COLORS[event.sport_id]?.text}`}
                  >
                    {event.sport_id === "4" ? "Futbol" : 
                     event.sport_id === "5" ? "Basketbol" : 
                     event.sport_id === "6" ? "Voleybol" : "Diğer"}
                  </Badge>
                </TableCell>
                <TableCell>
                  {format(event.date, "PPP", { locale: tr })}
                </TableCell>
                <TableCell>{event.location_name}</TableCell>
                <TableCell>
                  <Badge 
                    variant="outline"
                    className={`${STATUS_COLORS[event.status?.toLowerCase()]?.bg} ${STATUS_COLORS[event.status?.toLowerCase()]?.text}`}
                  >
                    {event.status?.toLowerCase() === "pending" ? "Beklemede" :
                     event.status?.toLowerCase() === "approved" ? "Onaylandı" :
                     event.status?.toLowerCase() === "rejected" ? "Reddedildi" :
                     event.status?.toLowerCase() === "completed" ? "Tamamlandı" : "Bilinmiyor"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setSelectedEvent(event)
                        setEditEventModalOpen(true)
                      }}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                    <DeleteEventModal
                      eventName={event.title}
                      onDelete={async () => {
                        try {
                          await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/events/${event.id}`)
                          setEvents(events.filter(e => e.id !== event.id))
                          toast({
                            title: "Başarılı",
                            description: "Etkinlik başarıyla silindi.",
                          })
                        } catch (error) {
                          toast({
                            title: "Hata",
                            description: "Etkinlik silinirken bir hata oluştu.",
                            variant: "destructive",
                          })
                        }
                      }}
                    />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      <NewEventModal
        open={newEventModalOpen}
        onOpenChange={setNewEventModalOpen}
        onSuccess={(newEvent) => {
          setEvents([...events, newEvent])
          setNewEventModalOpen(false)
        }}
      />

      {selectedEvent && (
        <EditEventModal
          open={editEventModalOpen}
          onOpenChange={setEditEventModalOpen}
          event={selectedEvent}
          onSuccess={() => {
            setEditEventModalOpen(false)
            setSelectedEvent(null)
          }}
          onSave={async (updatedEvent) => {
            try {
              await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/events/${selectedEvent.id}`, updatedEvent)
              setEvents(events.map(e => e.id === selectedEvent.id ? { ...e, ...updatedEvent } : e))
              toast({
                title: "Başarılı",
                description: "Etkinlik başarıyla güncellendi.",
              })
            } catch (error) {
              toast({
                title: "Hata",
                description: "Etkinlik güncellenirken bir hata oluştu.",
                variant: "destructive",
              })
            }
          }}
        />
      )}
    </div>
  )
}
