"use client"

import { useState, useEffect } from "react"
import { format } from "date-fns"
import { tr } from "date-fns/locale"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, MapPin, Users } from "lucide-react"

interface Event {
  id: string
  title: string
  date: Date
  time: string
  location: string
  participants: number
  maxParticipants: number
  category: string
  status: "pending" | "approved" | "rejected" | "completed"
}

interface TodaysEventsProps {
  onEventSelect?: (event: Event) => void
  categories?: string[]
}

export function TodaysEvents({ onEventSelect, categories = [] }: TodaysEventsProps) {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Gerçek uygulamada burada API'den veri çekilecek
    setLoading(true)
    
    // Demo verilerini yükleme simülasyonu
    setTimeout(() => {
      const demoEvents: Event[] = [
        {
          id: "evt-1",
          title: "Sabah Koşusu",
          date: new Date(),
          time: "06:30",
          location: "Sahil Parkı",
          participants: 12,
          maxParticipants: 20,
          category: "Koşu",
          status: "approved"
        },
        {
          id: "evt-2",
          title: "Yoga Dersi",
          date: new Date(),
          time: "09:00",
          location: "Central Fitness",
          participants: 8,
          maxParticipants: 15,
          category: "Yoga",
          status: "approved"
        },
        {
          id: "evt-3",
          title: "Basketbol Turnuvası",
          date: new Date(),
          time: "14:00",
          location: "Spor Salonu",
          participants: 20,
          maxParticipants: 20,
          category: "Basketbol",
          status: "approved"
        },
        {
          id: "evt-4",
          title: "Yüzme Etkinliği",
          date: new Date(),
          time: "16:30",
          location: "Olimpik Havuz",
          participants: 10,
          maxParticipants: 25,
          category: "Yüzme",
          status: "approved"
        },
        {
          id: "evt-5",
          title: "Akşam Bisiklet Turu",
          date: new Date(),
          time: "19:00",
          location: "Bisiklet Yolu",
          participants: 15,
          maxParticipants: 30,
          category: "Bisiklet",
          status: "approved"
        }
      ]
      
      // Kategoriye göre filtreleme
      let filteredEvents = demoEvents
      if (categories && categories.length > 0) {
        filteredEvents = demoEvents.filter(event => 
          categories.includes(event.category)
        )
      }
      
      setEvents(filteredEvents)
      setLoading(false)
    }, 800)
  }, [categories])

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((_, index) => (
          <div key={index} className="flex items-center space-x-4">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-[250px]" />
              <Skeleton className="h-4 w-[200px]" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (events.length === 0) {
    return (
      <div className="flex h-[240px] items-center justify-center border rounded-md">
        <div className="text-center">
          <Calendar className="mx-auto h-10 w-10 text-muted-foreground opacity-30" />
          <h3 className="mt-2 text-lg font-medium">Bugün için etkinlik bulunamadı</h3>
          <p className="text-sm text-muted-foreground">
            {categories.length > 0 
              ? "Filtreyi değiştirmeyi deneyin" 
              : "Bugün için etkinlik planlanmamış"}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {events.map((event) => (
        <div 
          key={event.id}
          className="flex items-start gap-4 rounded-lg border p-3 transition-colors hover:bg-muted/50 cursor-pointer"
          onClick={() => onEventSelect && onEventSelect(event)}
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
            <Calendar className="h-5 w-5 text-primary" />
          </div>
          <div className="flex-1 space-y-1">
            <div className="flex items-center justify-between">
              <p className="font-medium">{event.title}</p>
              <Badge className="bg-green-100 text-green-800 hover:bg-green-200">
                {event.category}
              </Badge>
            </div>
            
            <div className="grid grid-cols-2 gap-1 text-sm text-muted-foreground">
              <div className="flex items-center">
                <Clock className="mr-1 h-3 w-3" />
                {event.time}
              </div>
              <div className="flex items-center">
                <Users className="mr-1 h-3 w-3" />
                {event.participants}/{event.maxParticipants}
              </div>
              <div className="flex items-center col-span-2 truncate">
                <MapPin className="mr-1 h-3 w-3 flex-shrink-0" />
                <span className="truncate">{event.location}</span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
} 