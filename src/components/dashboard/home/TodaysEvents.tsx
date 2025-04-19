"use client";

import { useState, useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, MapPin, Users } from "lucide-react";
import { Event, EventStatus, TodaysEventsProps } from "@/types/dashboard";
import { TODAY_EVENTS } from "@/mocks/events";
import {
  formatEventTime,
  formatEventLocation,
  calculateEventFillRate,
  getEventStatusStyle,
} from "@/lib/eventUtils";
import { generateSkeletonArray } from "@/lib/uiUtils";
import { filterEvents } from "@/lib/eventUtils";

export function TodaysEvents({
  onEventSelect,
  categories = [],
}: TodaysEventsProps) {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Gerçek uygulamada burada API'den veri çekilecek
    setLoading(true);

    // Mock verileri kullanarak yükleme simülasyonu
    setTimeout(() => {
      // Kategoriye göre filtreleme
      const filteredEvents = filterEvents(TODAY_EVENTS, categories);
      setEvents(filteredEvents);
      setLoading(false);
    }, 800);
  }, [categories]);

  if (loading) {
    return (
      <div className="space-y-4">
        {generateSkeletonArray(3).map((index) => (
          <div key={index} className="flex items-center space-x-4">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-[250px]" />
              <Skeleton className="h-4 w-[200px]" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div className="flex h-[240px] items-center justify-center border rounded-md">
        <div className="text-center">
          <Calendar className="mx-auto h-10 w-10 text-muted-foreground opacity-30" />
          <h3 className="mt-2 text-lg font-medium">
            Bugün için etkinlik bulunamadı
          </h3>
          <p className="text-sm text-muted-foreground">
            {categories.length > 0
              ? "Filtreyi değiştirmeyi deneyin"
              : "Bugün için etkinlik planlanmamış"}
          </p>
        </div>
      </div>
    );
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
              <Badge style={getEventStatusStyle(event.status)}>
                {event.category}
              </Badge>
            </div>

            <div className="grid grid-cols-2 gap-1 text-sm text-muted-foreground">
              <div className="flex items-center">
                <Clock className="mr-1 h-3 w-3" />
                {formatEventTime(event.time)}
              </div>
              <div className="flex items-center">
                <Users className="mr-1 h-3 w-3" />
                {event.participants}/{event.maxParticipants}
                <span className="text-xs ml-1">
                  ({calculateEventFillRate(event)}%)
                </span>
              </div>
              <div className="flex items-center col-span-2 truncate">
                <MapPin className="mr-1 h-3 w-3 flex-shrink-0" />
                <span className="truncate">
                  {formatEventLocation(event.location)}
                </span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
