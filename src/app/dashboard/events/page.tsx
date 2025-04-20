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
import { CategoryFilterDropdown } from "@/components/CategoryFilterDropdown"
import { Plus, ChevronRight } from "lucide-react"
import { format } from "date-fns"
import { useToast } from "@/components/ui/use-toast"
import Link from "next/link"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface User {
  id: string
  name: string
  surname: string
  role: "bireysel_kullanici" | "kulup_uyesi" | "antrenor" | "tesis_sahibi"
  email: string
  avatar?: string
}

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
}

// Kategori renkleri
const CATEGORY_COLORS: Record<string, { bg: string; text: string }> = {
  Futbol: { bg: "bg-blue-100", text: "text-blue-800" },
  Basketbol: { bg: "bg-orange-100", text: "text-orange-800" },
  Voleybol: { bg: "bg-green-100", text: "text-green-800" },
  Tenis: { bg: "bg-purple-100", text: "text-purple-800" },
  Yüzme: { bg: "bg-cyan-100", text: "text-cyan-800" },
  Koşu: { bg: "bg-red-100", text: "text-red-800" },
  Yoga: { bg: "bg-pink-100", text: "text-pink-800" },
  Fitness: { bg: "bg-yellow-100", text: "text-yellow-800" },
  Diğer: { bg: "bg-gray-100", text: "text-gray-800" },
};

// Durum renkleri
const STATUS_COLORS: Record<string, { bg: string; text: string }> = {
  "pending": { bg: "bg-yellow-100", text: "text-yellow-800" },
  "approved": { bg: "bg-green-100", text: "text-green-800" },
  "rejected": { bg: "bg-red-100", text: "text-red-800" },
  "completed": { bg: "bg-gray-100", text: "text-gray-800" }
}

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
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [isNewEventModalOpen, setIsNewEventModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)
  const [selectedEventForPreview, setSelectedEventForPreview] = useState<Event | null>(null)
  const { toast } = useToast()
  
  // Örnek etkinlikler
  const defaultEvents = [
    {
      id: "1",
      title: "Futbol Turnuvası",
      description: "Amatör futbol takımları arasında düzenlenecek olan dostluk turnuvası. Her yaştan futbolsever katılabilir. Takımlar 7 kişiden oluşacaktır.",
      date: new Date("2024-04-15"),
      time: "14:00",
      location: "Merkez Stadyum, İstanbul",
      maxParticipants: 100,
      participants: 75,
      status: "approved",
      category: "Futbol",
      organizer: sampleUsers[0]
    },
    {
      id: "2",
      title: "Yoga ve Meditasyon",
      description: "Stresli şehir hayatından uzaklaşıp, doğayla iç içe yoga ve meditasyon deneyimi. Tüm seviyeler için uygundur.",
      date: new Date("2024-04-20"),
      time: "09:00",
      location: "Belgrad Ormanı, İstanbul",
      maxParticipants: 30,
      participants: 15,
      status: "pending",
      category: "Yoga",
      organizer: sampleUsers[1]
    },
    {
      id: "3",
      title: "Basketbol Eğitim Kampı",
      description: "Profesyonel antrenörler eşliğinde 3 günlük yoğun basketbol eğitimi. Temel teknikler, taktikler ve maç stratejileri öğretilecektir.",
      date: new Date("2024-04-25"),
      time: "10:00",
      location: "Spor Kompleksi, Ankara",
      maxParticipants: 40,
      participants: 25,
      status: "approved",
      category: "Basketbol",
      organizer: sampleUsers[2]
    },
    {
      id: "4",
      title: "Yüzme Yarışması",
      description: "Yaz sezonunu açıyoruz! Farklı kategorilerde yüzme yarışması düzenlenecektir. Her yaş grubundan katılımcılar için uygun kategoriler mevcuttur.",
      date: new Date("2024-05-01"),
      time: "13:00",
      location: "Olimpik Yüzme Havuzu, İzmir",
      maxParticipants: 60,
      participants: 40,
      status: "pending",
      category: "Yüzme",
      organizer: sampleUsers[0]
    },
    {
      id: "5",
      title: "Tenis Turnuvası",
      description: "Çiftler tenis turnuvası. A, B ve C kategorilerinde yarışmalar yapılacaktır. Katılımcılar seviyelerine göre eşleştirilecektir.",
      date: new Date("2024-05-05"),
      time: "15:00",
      location: "Tenis Kulübü, Antalya",
      maxParticipants: 32,
      participants: 24,
      status: "approved",
      category: "Tenis",
      organizer: sampleUsers[1]
    },
    {
      id: "6",
      title: "Fitness Boot Camp",
      description: "4 haftalık yoğun fitness programı. HIIT, kardiyo ve kuvvet antrenmanları ile forma girin. Her seviyeye uygun egzersiz seçenekleri sunulacaktır.",
      date: new Date("2024-05-10"),
      time: "07:00",
      location: "Fitness Center, İstanbul",
      maxParticipants: 20,
      participants: 15,
      status: "pending",
      category: "Fitness",
      organizer: sampleUsers[2]
    }
  ]

  // localStorage'dan etkinlikleri yükle
  const [events, setEvents] = useState<Event[]>(() => {
    console.log("Initial state loading...")
    if (typeof window === 'undefined') return defaultEvents

    const savedEvents = localStorage.getItem('events')
    if (!savedEvents) {
      console.log("No saved events found, using defaults")
      return defaultEvents
    }

    try {
      const parsedEvents = JSON.parse(savedEvents)
      console.log("Loaded events from storage:", parsedEvents)
      
      const processedEvents = parsedEvents.map((event: any) => {
        const organizer = sampleUsers.find(user => user.id === event.organizer?.id) || sampleUsers[0]
        return {
          ...event,
          id: event.id || String(Date.now()),
          date: new Date(event.date),
          organizer,
          status: event.status || "pending",
          participants: event.participants || 0,
          maxParticipants: event.maxParticipants || 100
        }
      })
      
      console.log("Processed events:", processedEvents)
      return processedEvents
    } catch (error) {
      console.error('Error parsing saved events:', error)
      return defaultEvents
    }
  })

  // Etkinlikler değiştiğinde localStorage'a kaydet
  useEffect(() => {
    if (typeof window === 'undefined') return

    try {
      console.log("Saving events to storage:", events)
      const eventsToSave = events.map(event => ({
        ...event,
        date: event.date.toISOString(),
        organizer: {
          id: event.organizer.id,
          name: event.organizer.name,
          surname: event.organizer.surname,
          role: event.organizer.role,
          email: event.organizer.email
        }
      }))
      localStorage.setItem('events', JSON.stringify(eventsToSave))
      console.log("Events saved successfully")
    } catch (error) {
      console.error('Error saving events:', error)
    }
  }, [events])

  // Filtreleme fonksiyonunu güncelleyelim
  const filteredEvents = events
    // İlk olarak tarihi geçmiş onaylı etkinlikleri kontrol et
    .map(event => {
      const now = new Date()
      const eventDate = new Date(event.date)
      eventDate.setHours(23, 59, 59)
      
      // Sadece sayfa yüklendiğinde kontrol et, kullanıcı değiştirdiğinde değil
      if (eventDate < now && event.status === "approved") {
        return { ...event, status: "completed" }
      }
      return event
    })
    // Sonra filtreleme yap
    .filter(event => {
      const matchesSearch = (
        event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.location.toLowerCase().includes(searchQuery.toLowerCase())
      )
      const matchesStatus = statusFilter === "all" || event.status === statusFilter
      const matchesCategories = selectedCategories.length === 0 || selectedCategories.includes(event.category)
      
      return matchesSearch && matchesStatus && matchesCategories
    })

  const handleEditEvent = (id: string | number, updatedEvent: Partial<Event>) => {
    setEvents(events.map(event => 
      event.id === id ? { ...event, ...updatedEvent } : event
    ))
  }

  const handleDeleteEvent = (id: string | number) => {
    setEvents(events.filter(event => event.id !== id))
  }

  const handleAddNewEvent = (newEvent: Partial<Event>) => {
    console.log("Received new event data:", newEvent)
    
    // Yeni etkinlik için tam veri yapısı oluştur
    const eventToAdd: Event = {
      id: String(Date.now()),
      title: newEvent.title || '',
      description: newEvent.description || '',
      date: new Date(newEvent.date || new Date()),
      time: newEvent.time || '',
      location: newEvent.location || '',
      category: newEvent.category || '',
      participants: 0,
      maxParticipants: newEvent.maxParticipants || 100,
      status: "pending",
      organizer: sampleUsers[0], // Varsayılan olarak ilk kullanıcıyı atıyoruz
      image: newEvent.image
    }

    console.log("Formatted event to add:", eventToAdd)

    setEvents(prevEvents => {
      const updatedEvents = [...prevEvents, eventToAdd]
      console.log("All events after adding:", updatedEvents)
      
      // localStorage'a hemen kaydet
      try {
        const eventsToSave = updatedEvents.map(event => ({
          ...event,
          date: event.date.toISOString(),
          organizer: {
            id: event.organizer.id,
            name: event.organizer.name,
            surname: event.organizer.surname,
            role: event.organizer.role,
            email: event.organizer.email
          }
        }))
        localStorage.setItem('events', JSON.stringify(eventsToSave))
        console.log("Events saved to localStorage immediately after add")
      } catch (error) {
        console.error('Error saving events after add:', error)
      }

      return updatedEvents
    })

    toast({
      title: "Başarılı",
      description: "Etkinlik başarıyla oluşturuldu ve onay için gönderildi.",
    })
  }

  // handleStatusChange fonksiyonunu güncelleyelim
  const handleStatusChange = (eventId: string | number, newStatus: Event["status"]) => {
    setEvents(prevEvents => 
      prevEvents.map(event => 
        event.id === eventId ? { ...event, status: newStatus } : event
      )
    )
    
    toast({
      title: "Durum Güncellendi",
      description: `Etkinlik durumu "${newStatus === "completed" ? "Tamamlandı" : 
                                     newStatus === "approved" ? "Onaylandı" :
                                     newStatus === "rejected" ? "Reddedildi" :
                                     "Beklemede"}" olarak güncellendi.`,
    })

    if (newStatus === "rejected") {
      toast({
        title: "Etkinlik Reddedildi",
        description: "Etkinliğiniz yönetici tarafından reddedildi. Lütfen etkinlik kurallarını kontrol edin.",
        variant: "destructive"
      })
    }
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Etkinlik Yönetimi</h1>
        <Button onClick={() => setIsNewEventModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Yeni Etkinlik
        </Button>
      </div>

      <NewEventModal
        open={isNewEventModalOpen}
        onOpenChange={setIsNewEventModalOpen}
        onSuccess={handleAddNewEvent}
      />

      <Card className="p-4">
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <Input
            placeholder="Etkinlik ara..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full sm:w-64"
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
          >
            <option value="all">Tüm Durumlar</option>
            <option value="pending">Beklemede</option>
            <option value="approved">Onaylandı</option>
            <option value="rejected">Reddedildi</option>
            <option value="completed">Tamamlandı</option>
          </select>
          <CategoryFilterDropdown
            selectedCategories={selectedCategories}
            onSelectCategories={setSelectedCategories}
          />
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Durum" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tümü</SelectItem>
              <SelectItem value="active">Aktif</SelectItem>
              <SelectItem value="completed">Tamamlandı</SelectItem>
              <SelectItem value="cancelled">İptal Edildi</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Etkinlik Adı</TableHead>
                <TableHead>Tarih</TableHead>
                <TableHead>Konum</TableHead>
                <TableHead>Katılımcılar</TableHead>
                <TableHead>Organizatör</TableHead>
                <TableHead>Durum</TableHead>
                <TableHead className="text-right">İşlemler</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEvents.map((event) => (
                <TableRow key={event.id}>
                  <TableCell>
                    <TooltipProvider delayDuration={0}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <button 
                            onClick={() => setSelectedEventForPreview(event)}
                            className={`font-medium ${CATEGORY_COLORS[event.category].text} hover:${CATEGORY_COLORS[event.category].text} hover:underline cursor-pointer text-left`}
                          >
                            {event.title}
                          </button>
                        </TooltipTrigger>
                        <TooltipContent className="max-w-[300px] p-4 bg-white shadow-lg rounded-lg border border-gray-200">
                          <p className="text-gray-700 text-sm whitespace-pre-wrap">
                            {event.description}
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant="outline" 
                      className={`${CATEGORY_COLORS[event.category].bg} ${CATEGORY_COLORS[event.category].text} hover:${CATEGORY_COLORS[event.category].bg}`}
                    >
                      {event.category}
                    </Badge>
                  </TableCell>
                  <TableCell>{format(event.date, "dd.MM.yyyy")}</TableCell>
                  <TableCell>{event.location}</TableCell>
                  <TableCell>{event.participants}/{event.maxParticipants}</TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium text-gray-900">
                        {event.organizer.name} {event.organizer.surname}
                      </span>
                      <span className="text-xs text-gray-500">
                        {ROLE_LABELS[event.organizer.role]}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Select
                      value={event.status}
                      onValueChange={(value: Event["status"]) => handleStatusChange(event.id, value)}
                    >
                      <SelectTrigger className={`w-[140px] ${STATUS_COLORS[event.status].bg} ${STATUS_COLORS[event.status].text}`}>
                        <SelectValue placeholder="Durum seçin" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending" className="text-yellow-800 hover:bg-yellow-100">Beklemede</SelectItem>
                        <SelectItem value="approved" className="text-green-800 hover:bg-green-100">Onaylandı</SelectItem>
                        <SelectItem value="rejected" className="text-red-800 hover:bg-red-100">Reddedildi</SelectItem>
                        <SelectItem value="completed" className="text-gray-800 hover:bg-gray-100">Tamamlandı</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedEvent(event)
                          setIsEditModalOpen(true)
                        }}
                      >
                        Düzenle
                      </Button>
                      <DeleteEventModal 
                        eventName={event.title}
                        onDelete={() => handleDeleteEvent(event.id)}
                        className="bg-red-500 hover:bg-red-600 text-white"
                      />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>

      {/* Bilgi mesajı */}
      <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex items-center gap-2 text-blue-700">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
              clipRule="evenodd"
            />
          </svg>
          <p className="text-sm font-medium">
            Etkinlik detayına ulaşmak için lütfen etkinlik adına tıklayınız.
          </p>
        </div>
      </div>

      <NewEventModal
        open={isNewEventModalOpen}
        onOpenChange={setIsNewEventModalOpen}
        onSuccess={(newEvent) => {
          handleAddNewEvent(newEvent)
          setIsNewEventModalOpen(false)
        }}
      />

      <EditEventModal 
        open={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        event={selectedEvent}
        onSave={(updatedEvent) => {
          if (selectedEvent) {
            handleEditEvent(selectedEvent.id, updatedEvent)
          }
        }}
        onSuccess={() => {
          setIsEditModalOpen(false)
          setSelectedEvent(null)
        }}
      />

      {selectedEventForPreview && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4 shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Etkinlik Açıklaması</h3>
              <button 
                onClick={() => setSelectedEventForPreview(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-700 whitespace-pre-wrap">
                {selectedEventForPreview.description}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
