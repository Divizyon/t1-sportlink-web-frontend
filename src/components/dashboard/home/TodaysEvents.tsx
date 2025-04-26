"use client";

import { useState, useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, MapPin, Users } from "lucide-react";
import {
  Event,
  EventStatus,
  TodaysEventsProps,
  Participant,
} from "@/types/dashboard";
import {
  formatEventTime,
  formatEventLocation,
  calculateEventFillRate,
  getEventStatusStyle,
} from "@/lib/eventUtils";
import { generateSkeletonArray } from "@/lib/uiUtils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getUserInitials } from "@/lib/userUtils";
import { enrichUserData } from "@/lib/userDataService";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import api from "@/services/api";

// Define a more comprehensive ApiEvent interface to handle different API response formats
interface ApiEvent {
  id: string;
  title: string;
  description?: string;
  date?: string;
  event_date?: string;
  time?: string;
  start_time?: string;
  endTime?: string;
  location?: string;
  location_name?: string;
  category?: string;
  sport_category?: string;
  participants?: number;
  participant_count?: number;
  maxParticipants?: number;
  max_participants?: number;
  status: string;
  organizer?: string;
  creator_name?: string;
  isAttending?: boolean;
  created_at?: string;
}

// Map backend status to frontend status
const mapEventStatus = (
  status: string
): "pending" | "approved" | "rejected" | "completed" => {
  switch (status) {
    case "PENDING":
      return "pending";
    case "ACTIVE":
      return "approved";
    case "REJECTED":
      return "rejected";
    case "COMPLETED":
      return "completed";
    default:
      return "approved"; // Default for unknown status
  }
};

// Map backend event to frontend Event type
const mapApiEventToEvent = (apiEvent: ApiEvent): Event => {
  return {
    id: apiEvent.id,
    title: apiEvent.title,
    description: apiEvent.description || "",
    date: new Date(apiEvent.event_date || apiEvent.date || new Date()),
    time: apiEvent.start_time || apiEvent.time || "00:00",
    location: apiEvent.location_name || apiEvent.location || "",
    category: apiEvent.sport_category || apiEvent.category || "Diğer",
    participants: apiEvent.participant_count || apiEvent.participants || 0,
    maxParticipants:
      apiEvent.max_participants || apiEvent.maxParticipants || 10,
    status: mapEventStatus(apiEvent.status),
    organizer: apiEvent.creator_name || apiEvent.organizer || "SportLink",
  };
};

export function TodaysEvents({
  onEventSelect,
  onUserSelect,
  categories = [],
}: TodaysEventsProps) {
  const [events, setEvents] = useState<Event[]>([]);
  const [eventParticipants, setEventParticipants] = useState<
    Record<string | number, Participant[]>
  >({});
  const [loading, setLoading] = useState(true);
  const [expandedEvent, setExpandedEvent] = useState<string | number | null>(
    null
  );
  const router = useRouter();

  const toggleEventExpand = (eventId: string | number, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedEvent(expandedEvent === eventId ? null : eventId);
  };

  // Fetch events from the API
  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      try {
        // Call the today's events API endpoint
        console.log("Fetching today's events from API...");

        // Use our API service with the correct endpoint
        const eventsEndpoint = "/events/today";
        console.log("Using events endpoint:", eventsEndpoint);

        const response = await api.get(eventsEndpoint);

        console.log("Raw API response:", response);
        console.log("Response data:", response.data);

        if (
          response.data.status === "success" &&
          Array.isArray(response.data.data)
        ) {
          // Map the API response to our Event type
          const apiEvents: ApiEvent[] = response.data.data;
          console.log("API events array:", apiEvents);

          if (apiEvents.length === 0) {
            console.log("No events returned from API");
            setEvents([]);
          } else {
            // Check the format of the first event to debug
            console.log("First event sample:", apiEvents[0]);

            const frontendEvents: Event[] = apiEvents.map(mapApiEventToEvent);

            console.log("Mapped frontend events:", frontendEvents);

            // Filter events by category if categories are provided
            const filteredEvents =
              categories.length > 0
                ? frontendEvents.filter((event) =>
                    categories.includes(event.category)
                  )
                : frontendEvents;

            console.log("Final filtered events:", filteredEvents);
            setEvents(filteredEvents);
          }
        } else {
          console.error("API response format was unexpected:", response.data);
          setEvents([]);
          toast.error("Etkinlikler yüklenirken bir hata oluştu");
        }
      } catch (error: any) {
        console.error("Error fetching today's events:", error);
        // More detailed error reporting
        if (error.response) {
          console.error(
            "API error response:",
            error.response.status,
            error.response.data
          );
        } else if (error.request) {
          console.error("No response received:", error.request);
        }
        setEvents([]);
        toast.error("Etkinlikler yüklenirken bir hata oluştu");
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [categories]);

  // Fetch participants when an event is expanded
  useEffect(() => {
    if (expandedEvent !== null) {
      fetchEventParticipants(expandedEvent);
    }
  }, [expandedEvent]);

  // Function to fetch participants for a specific event
  const fetchEventParticipants = async (eventId: string | number) => {
    // If we already have participants for this event, don't fetch again
    if (eventParticipants[eventId]?.length > 0) return;

    try {
      console.log(`Fetching participants for event ${eventId}`);

      // Use our API service with the correct endpoint
      const participantsEndpoint = `/events/${eventId}/participants`;
      console.log("Using participants endpoint:", participantsEndpoint);

      const response = await api.get(participantsEndpoint);

      console.log("Raw participants response:", response);
      console.log("Participants response data:", response.data);

      if (
        response.data.status === "success" &&
        Array.isArray(response.data.data)
      ) {
        // Map the API response to our Participant type
        const participants: Participant[] = response.data.data.map(
          (p: any) => ({
            id: p.id || p.user_id,
            name:
              p.name ||
              `${p.first_name || ""} ${p.last_name || ""}`.trim() ||
              "Anonim Kullanıcı",
            email:
              p.email ||
              `user-${(p.id || p.user_id || "").substring(0, 4)}@example.com`,
            avatar: p.avatar,
          })
        );

        console.log(`Found ${participants.length} participants`);
        setEventParticipants((prev) => ({
          ...prev,
          [eventId]: participants,
        }));
      } else {
        // If API fails or returns unexpected format
        console.error("Invalid participants response format:", response.data);
        setEventParticipants((prev) => ({
          ...prev,
          [eventId]: [],
        }));
      }
    } catch (error: any) {
      console.error("Error fetching event participants:", error);
      // More detailed error reporting
      if (error.response) {
        console.error(
          "API error response:",
          error.response.status,
          error.response.data
        );
      } else if (error.request) {
        console.error("No response received:", error.request);
      }
      setEventParticipants((prev) => ({
        ...prev,
        [eventId]: [],
      }));
    }
  };

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
        <div key={event.id} className="space-y-1">
          <div
            className="flex items-start gap-4 rounded-lg border p-3 transition-colors hover:bg-muted/50 cursor-pointer"
            onClick={() => {
              if (onEventSelect && event?.id) {
                // Only pass the event ID, rather than the whole event object
                // This forces the EventDetailModal to fetch the full details from the API
                const eventWithIdOnly = { id: event.id } as Event;
                onEventSelect(eventWithIdOnly);
              }
            }}
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
              <div className="flex justify-end mt-1">
                <button
                  onClick={(e) => toggleEventExpand(event.id, e)}
                  className="text-xs text-primary hover:underline"
                >
                  {expandedEvent === event.id
                    ? "Gizle"
                    : "Katılımcıları Göster"}
                </button>
              </div>
            </div>
          </div>

          {/* Participants section shown when expanded */}
          {expandedEvent === event.id && (
            <div className="ml-14 mt-2 space-y-2 rounded-md border p-2 bg-muted/20">
              <h4 className="text-xs font-medium text-muted-foreground mb-2">
                Katılımcılar
              </h4>
              <div className="space-y-2">
                {eventParticipants[event.id]?.length > 0 ? (
                  eventParticipants[event.id].map((participant) => (
                    <div
                      key={participant.id}
                      className="flex items-center space-x-2 p-1 hover:bg-muted/50 rounded-md cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation();
                        onUserSelect &&
                          onUserSelect(enrichUserData(participant) as any);
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
                        <p className="text-xs font-medium">
                          {participant.name}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-xs text-muted-foreground text-center py-2">
                    Henüz katılımcı bulunmamaktadır.
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      ))}
      <div className="mt-4">
        <Button
          variant="outline"
          className="w-full"
          onClick={() => router.push("/dashboard/events")}
        >
          <Calendar className="mr-2 h-4 w-4" />
          Tüm Etkinlikleri Gör
        </Button>
      </div>
    </div>
  );
}
