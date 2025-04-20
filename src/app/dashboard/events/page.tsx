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
import { User, Event } from "@/types"

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

// Örnek kullanıcılar (Global User tipine uygun - ID number, surname yok)
const sampleUsers: User[] = [
  {
    id: 1, // ID number
    name: "Ahmet Yılmaz",
    role: "antrenor",
    email: "ahmet.yilmaz@sportlink.com"
  },
  {
    id: 2, // ID number
    name: "Mehmet Demir",
    role: "kulup_uyesi",
    email: "mehmet.demir@sportlink.com"
  },
  {
    id: 3, // ID number
    name: "Ayşe Kaya",
    role: "tesis_sahibi",
    email: "ayse.kaya@sportlink.com"
  }
]

// Baş harfleri alma yardımcı fonksiyonu (Sadece name kullan)
const getInitials = (name?: string) => {
  return name?.charAt(0) || '?'; 
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
  
  // Örnek etkinlikler (Global Event tipine uygun: id: number, organizer: number)
  const defaultEvents: Event[] = [
    {
      id: 1, // ID number
      title: "Futbol Turnuvası",
      description: "Amatör futbol takımları arasında düzenlenecek olan dostluk turnuvası...",
      date: new Date("2024-04-15"),
      time: "14:00",
      location: "Merkez Stadyum, İstanbul",
      maxParticipants: 100,
      participants: 75,
      status: "approved",
      category: "Futbol",
      organizer: 1 // Organizer ID (number)
    },
    {
      id: 2, // ID number
      title: "Yoga ve Meditasyon",
      description: "Stresli şehir hayatından uzaklaşıp, doğayla iç içe yoga ve meditasyon deneyimi...",
      date: new Date("2024-04-20"),
      time: "09:00",
      location: "Belgrad Ormanı, İstanbul",
      maxParticipants: 30,
      participants: 15,
      status: "pending",
      category: "Yoga",
      organizer: 2 // Organizer ID (number)
    },
    {
      id: 3, // ID number
      title: "Basketbol Eğitim Kampı",
      description: "Profesyonel antrenörler eşliğinde 3 günlük yoğun basketbol eğitimi...",
      date: new Date("2024-04-25"),
      time: "10:00",
      location: "Spor Kompleksi, Ankara",
      maxParticipants: 40,
      participants: 25,
      status: "approved",
      category: "Basketbol",
      organizer: 3 // Organizer ID (number)
    },
    {
      id: 4, // ID number
      title: "Yüzme Yarışması",
      description: "Olimpik havuzda düzenlenecek 50m ve 100m serbest stil yüzme yarışları...",
      date: new Date("2024-05-01"),
      time: "09:00",
      location: "Olimpik Yüzme Havuzu, İzmir",
      maxParticipants: 50,
      participants: 35,
      status: "pending",
      category: "Yüzme",
      organizer: 1 // Organizer ID (number)
    },
    {
      id: 5, // ID number
      title: "Tenis Turnuvası",
      description: "Çiftler tenis turnuvası. Amatör ve profesyonel kategorilerde yarışmalar...",
      date: new Date("2024-05-05"),
      time: "10:00",
      location: "Tenis Kulübü, Antalya",
      maxParticipants: 32,
      participants: 24,
      status: "approved",
      category: "Tenis",
      organizer: 2 // Organizer ID (number)
    },
    {
      id: 6, // ID number
      title: "Fitness Boot Camp",
      description: "4 haftalık yoğun fitness programı. HIIT, kardiyo ve kuvvet antrenmanları içerir...",
      date: new Date("2024-05-10"),
      time: "07:00",
      location: "Fitness Center, İstanbul",
      maxParticipants: 30,
      participants: 20,
      status: "pending",
      category: "Fitness",
      organizer: 3 // Organizer ID (number)
    },
    {
      id: 7, // ID number
      title: "Voleybol Turnuvası",
      description: "Plaj voleybolu turnuvası. 2'şer kişilik takımlar halinde yarışma...",
      date: new Date("2024-06-15"),
      time: "16:00",
      location: "Plaj Spor Tesisi, Antalya",
      maxParticipants: 40,
      participants: 28,
      status: "approved",
      category: "Voleybol",
      organizer: 1 // Organizer ID (number)
    },
    {
      id: 8, // ID number
      title: "Koşu Maratonu",
      description: "Yaz maratonu etkinliği. 5km, 10km ve 21km kategorilerinde yarışlar...",
      date: new Date("2024-06-20"),
      time: "08:00",
      location: "Sahil Parkuru, İzmir",
      maxParticipants: 200,
      participants: 145,
      status: "pending",
      category: "Koşu",
      organizer: 2 // Organizer ID (number)
    }
  ]

  // localStorage'dan etkinlikleri yükle (ID ve organizer number ile)
  const [events, setEvents] = useState<Event[]>(() => {
    const currentDefaultEvents: Event[] = [...defaultEvents];
    if (typeof window === 'undefined') return currentDefaultEvents;

    let loadedEvents: Event[] = [];
    const savedEvents = localStorage.getItem('events');

    if (savedEvents) {
      try {
        const parsedEvents = JSON.parse(savedEvents);
        loadedEvents = parsedEvents.map((event: any) => ({
          ...event,
          id: Number(event.id) || Date.now(), // ID number
          date: new Date(event.date),
          organizer: Number(event.organizer), // Organizer ID number
          status: event.status || "pending",
          participants: Number(event.participants) || 0,
          maxParticipants: Number(event.maxParticipants) || 100
        } as Event));
      } catch (error) { console.error('Error parsing saved events:', error); loadedEvents = []; }
    }

    // Merge (ID number)
    const combinedEventsMap = new Map<number, Event>(); 
    currentDefaultEvents.forEach(event => combinedEventsMap.set(event.id, event));
    loadedEvents.forEach(event => combinedEventsMap.set(event.id, event));
    return Array.from(combinedEventsMap.values());
  })

  // Etkinlikler değiştiğinde localStorage'a kaydet (ID ve organizer number)
  useEffect(() => {
    if (typeof window === 'undefined') return
    try {
      const eventsToSave = events.map(event => ({
        ...event,
        date: event.date.toISOString(),
        organizer: Number(event.organizer) // Organizer ID number
      }))
      localStorage.setItem('events', JSON.stringify(eventsToSave))
    } catch (error) { console.error('Error saving events:', error) }
  }, [events])

  // Filtreleme fonksiyonunu güncelleyelim
  const filteredEvents = events
    // İlk olarak tarihi geçmiş onaylı etkinlikleri kontrol et
    .map(event => {
      const now = new Date()
      const eventDate = new Date(event.date)
      eventDate.setHours(23, 59, 59)
      
      // Status tipini kontrol et
      if (eventDate < now && event.status === "approved") {
        // Dönüş tipinin Event olduğundan emin ol
        return { ...event, status: "completed" as Event["status"] } 
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

  const handleEditEvent = (id: number, updatedEvent: Partial<Omit<Event, 'id' | 'organizer'>> & { organizer?: number }) => {
    setEvents(events.map(event => 
      event.id === id ? { ...event, ...updatedEvent } : event
    ))
  }

  const handleDeleteEvent = (id: number) => {
    setEvents(events.filter(event => event.id !== id))
  }

  const handleAddNewEvent = (newEvent: Partial<Omit<Event, 'id' | 'organizer'>> & { organizer?: number }) => {
    const eventToAdd: Event = {
      id: Date.now(), // Yeni ID number
      title: newEvent.title || '',
      description: newEvent.description || '',
      date: new Date(newEvent.date || new Date()),
      time: newEvent.time || '',
      location: newEvent.location || '',
      category: newEvent.category || '',
      participants: 0,
      maxParticipants: newEvent.maxParticipants || 100,
      status: "pending",
      organizer: newEvent.organizer || 1, // Varsayılan organizer ID (number)
      image: newEvent.image
    }
    setEvents(prevEvents => [...prevEvents, eventToAdd])
    toast({ title: "Başarılı", description: "Etkinlik başarıyla oluşturuldu." })
  }

  const handleStatusChange = (eventId: number, newStatus: Event["status"]) => {
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

  // Helper function to get organizer details by ID (number)
  const getOrganizerDetails = (organizerId?: number): User | undefined => {
    return sampleUsers.find(user => user.id === organizerId);
  };

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
        onSuccess={(newEvent: Partial<Omit<Event, 'id' | 'organizer'>> & { organizer?: number }) => {
          handleAddNewEvent(newEvent)
          setIsNewEventModalOpen(false)
        }}
      />

      <Card className="p-4">
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <Input
            placeholder="Etkinlik ara..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full sm:w-64"
          />
          <CategoryFilterDropdown
            selectedCategories={selectedCategories}
            onSelectCategories={setSelectedCategories}
          />
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Durum" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tüm Durumlar</SelectItem>
              <SelectItem value="pending">Beklemede</SelectItem>
              <SelectItem value="approved">Onaylandı</SelectItem>
              <SelectItem value="rejected">Reddedildi</SelectItem>
              <SelectItem value="completed">Tamamlandı</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Etkinlik Adı</TableHead>
                <TableHead>Kategori</TableHead>
                <TableHead>Tarih</TableHead>
                <TableHead>Konum</TableHead>
                <TableHead>Organizatör</TableHead>
                <TableHead>Katılımcı Sayısı</TableHead>
                <TableHead>Durum</TableHead>
                <TableHead className="text-right">İşlemler</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEvents.map((event) => {
                const organizerDetails = getOrganizerDetails(event.organizer);
                return (
                  <TableRow key={event.id}>
                    <TableCell>
                      <TooltipProvider delayDuration={0}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <button 
                              onClick={() => setSelectedEventForPreview(event)}
                              className={`font-medium ${CATEGORY_COLORS[event.category]?.text || 'text-gray-800'} hover:${CATEGORY_COLORS[event.category]?.text || 'text-gray-800'} hover:underline cursor-pointer text-left`}
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
                        className={`${CATEGORY_COLORS[event.category]?.bg || 'bg-gray-100'} ${CATEGORY_COLORS[event.category]?.text || 'text-gray-800'} hover:${CATEGORY_COLORS[event.category]?.bg || 'bg-gray-100'}`}
                      >
                        {event.category}
                      </Badge>
                    </TableCell>
                    <TableCell>{format(event.date, "dd.MM.yyyy")}</TableCell>
                    <TableCell>{event.location}</TableCell>
                    <TableCell>
                      {organizerDetails ? (
                        <div className="flex flex-col">
                          <span className="font-medium text-gray-900">
                            {organizerDetails.name}
                          </span>
                          <span className="text-xs text-gray-500">
                            {ROLE_LABELS[organizerDetails.role]}
                          </span>
                        </div>
                      ) : (
                        <span className="text-xs text-gray-500">Bilinmiyor</span>
                      )}
                    </TableCell>
                    <TableCell>{event.participants}/{event.maxParticipants}</TableCell>
                    <TableCell>
                      <Select
                        value={event.status}
                        onValueChange={(value: Event["status"]) => handleStatusChange(event.id, value)}
                      >
                        <SelectTrigger className={`w-[140px] ${STATUS_COLORS[event.status]?.bg || 'bg-gray-100'} ${STATUS_COLORS[event.status]?.text || 'text-gray-800'}`}>
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
                        />
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
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

      <EditEventModal 
        open={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        event={selectedEvent ?? undefined} 
        onSave={(updatedEvent: Partial<Omit<Event, 'id' | 'organizer'>> & { organizer?: number }) => { 
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
