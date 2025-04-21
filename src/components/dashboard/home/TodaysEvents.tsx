"use client";

import { useState, useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, MapPin, Users } from "lucide-react";
import { Event, EventStatus, EventCategory } from "@/types/event";
import { TodaysEventsProps, Participant } from "@/types/dashboard";
import {
  TODAY_EVENTS,
  DASHBOARD_UPCOMING_EVENTS,
  EVENT_PARTICIPANTS,
  LOADING_DELAYS,
  DASHBOARD_DATA_SETTINGS,
  type TodaysEventMock,
  DEFAULT_EVENT_FORM,
} from "@/mockups";
import {
  formatEventTime,
  formatEventLocation,
  calculateEventFillRate,
  getEventStatusStyle,
} from "@/lib/eventUtils";
import { generateSkeletonArray } from "@/lib/uiUtils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getUserInitials } from "@/lib/userUtils";

export function TodaysEvents({
  onEventSelect,
  onUserSelect,
  categories = [],
}: TodaysEventsProps) {
  const [events, setEvents] = useState<TodaysEventMock[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedEvent, setExpandedEvent] = useState<string | number | null>(
    null
  );

  useEffect(() => {
    // Simulating API load delay
    setLoading(true);

    // Set timeout to simulate loading
    setTimeout(() => {
      // Get events from mockups
      let todayEvents = [...TODAY_EVENTS];

      // Filter by categories if specified
      if (categories && categories.length > 0) {
        todayEvents = todayEvents.filter((event) =>
          categories.includes(event.category)
        );
      }

      setEvents(todayEvents);
      setLoading(false);
    }, LOADING_DELAYS.medium);
  }, [categories]);

  const toggleEventExpand = (eventId: string | number, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedEvent(expandedEvent === eventId ? null : eventId);
  };

  // Convert TodaysEventMock to Event type for the onEventSelect callback
  const convertToEventType = (mockEvent: TodaysEventMock): Event => {
    return {
      id: String(mockEvent.id),
      title: mockEvent.title,
      description: DEFAULT_EVENT_FORM.description || "Event details",
      startDate: new Date().toISOString(),
      endDate: new Date().toISOString(),
      time: mockEvent.time,
      location: {
        name: mockEvent.location,
        address: DEFAULT_EVENT_FORM.location.address || "Sample Address",
        city: DEFAULT_EVENT_FORM.location.city || "Sample City",
      },
      category: mockEvent.category as EventCategory,
      participants: mockEvent.participants,
      maxParticipants: mockEvent.maxParticipants,
      status: mockEvent.status as EventStatus,
      organizer: {
        id: "1",
        name: "Organizer",
        email: "organizer@example.com",
      },
      tags: DEFAULT_EVENT_FORM.tags || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      visibility: DEFAULT_EVENT_FORM.visibility || "public",
      registrationRequired: DEFAULT_EVENT_FORM.registrationRequired || false,
    };
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {generateSkeletonArray(DASHBOARD_DATA_SETTINGS.maxDisplayedItems).map(
          (index) => (
            <div key={index} className="flex items-center space-x-4">
              <Skeleton className="h-12 w-12 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-[250px]" />
                <Skeleton className="h-4 w-[200px]" />
              </div>
            </div>
          )
        )}
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
        <div key={event.id} className="space-y-1">
          <div
            className="flex items-start gap-4 rounded-lg border p-3 transition-colors hover:bg-muted/50 cursor-pointer"
            onClick={() =>
              onEventSelect && onEventSelect(convertToEventType(event))
            }
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
                    ({calculateEventFillRate(event as any)}%)
                  </span>
                  {EVENT_PARTICIPANTS[event.id] && (
                    <button
                      onClick={(e) => toggleEventExpand(event.id, e)}
                      className="ml-1 text-xs text-primary hover:underline"
                    >
                      {expandedEvent === event.id ? "Gizle" : "Göster"}
                    </button>
                  )}
                </div>
                <div className="flex items-center col-span-2 truncate">
                  <MapPin className="mr-1 h-3 w-3 flex-shrink-0" />
                  <span className="truncate">{event.location}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Participants section shown when expanded */}
          {expandedEvent === event.id && EVENT_PARTICIPANTS[event.id] && (
            <div className="ml-14 mt-2 space-y-2 rounded-md border p-2 bg-muted/20">
              <h4 className="text-xs font-medium text-muted-foreground mb-2">
                Katılımcılar
              </h4>
              <div className="space-y-2">
                {EVENT_PARTICIPANTS[event.id].map((participant) => (
                  <div
                    key={participant.id}
                    className="flex items-center space-x-2 p-1 hover:bg-muted/50 rounded-md cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      onUserSelect && onUserSelect(participant as Participant);
                    }}
                  >
                    <Avatar className="h-6 w-6">
                      <AvatarImage
                        src={participant.avatar}
                        alt={participant.name}
                      />
                      <AvatarFallback>
                        {getUserInitials(participant.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-xs font-medium">{participant.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {participant.email}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ))}

      {/* Add a section for upcoming events */}
      {DASHBOARD_UPCOMING_EVENTS.length > 0 && (
        <div className="mt-8">
          <h3 className="text-sm font-medium text-muted-foreground mb-4">
            Yaklaşan Etkinlikler
          </h3>
          <div className="space-y-3">
            {DASHBOARD_UPCOMING_EVENTS.slice(
              0,
              DASHBOARD_DATA_SETTINGS.maxDisplayedItems - 2
            ).map((event) => (
              <div
                key={event.id}
                className="flex items-start gap-3 rounded-lg border p-2 transition-colors hover:bg-muted/50 cursor-pointer"
                onClick={() =>
                  onEventSelect && onEventSelect(convertToEventType(event))
                }
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                  <Calendar className="h-4 w-4 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-sm">{event.title}</p>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span className="flex items-center">
                      <Clock className="mr-1 h-3 w-3" />
                      {formatEventTime(event.time)}
                    </span>
                    <span className="flex items-center">
                      <MapPin className="mr-1 h-3 w-3" />
                      {event.location}
                    </span>
                  </div>
                </div>
                <Badge
                  variant="outline"
                  style={getEventStatusStyle(event.status)}
                >
                  {event.category}
                </Badge>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
