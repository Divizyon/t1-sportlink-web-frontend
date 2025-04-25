import { useState, useEffect, useMemo } from "react";
import { Event, EventStatus } from "@/types";
import { EVENT_CATEGORIES } from "@/constants/dashboard";
import { TODAY_EVENTS } from "@/mocks/events";
import {
  groupEventsByDay,
  sortEventsByDate,
  getEventStatusStyle,
  calculateEventFillRate,
  filterEvents,
} from "@/lib/eventUtils";
import { calculatePercentage, calculateGrowth } from "@/lib/dashboardUtils";

interface UseDashboardEventsProps {
  initialCategories?: string[];
  initialStatus?: EventStatus[];
}

export function useDashboardEvents({
  initialCategories = [],
  initialStatus = [],
}: UseDashboardEventsProps = {}) {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [selectedCategories, setSelectedCategories] =
    useState<string[]>(initialCategories);
  const [selectedStatus, setSelectedStatus] =
    useState<EventStatus[]>(initialStatus);

  // Fetch events from API or use mock data
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        // Try to fetch from backend first
        try {
          const response = await fetch("http://localhost:3000/api/events", {
            headers: {
              Authorization: "Bearer " + localStorage.getItem("token"),
              "Content-Type": "application/json",
            },
            credentials: "include", // Include cookies for session-based auth
          });

          // Immediately fall back to mock data if we get a 401
          if (response.status === 401) {
            console.warn(
              "Authentication failed (401 Unauthorized), using mock data"
            );
            setEvents(TODAY_EVENTS);
            setLoading(false);
            return;
          }

          if (response.ok) {
            const data = await response.json();
            if (data.status === "success" && Array.isArray(data.data?.events)) {
              // Map backend data format to frontend format
              const mappedEvents = data.data.events.map((event: any) => ({
                id: event.id,
                title: event.title,
                description: event.description || "",
                date: new Date(event.event_date),
                time:
                  event.start_time.split("T")[1]?.substring(0, 5) || "00:00",
                location: event.location_name,
                category: event.sport_name || "Other",
                participants: event.participant_count || 0,
                maxParticipants: event.max_participants,
                status: mapBackendStatus(event.status),
                organizer: event.creator_name || "Unknown",
                image: "/images/events/default.jpg",
                createdAt: new Date(event.created_at)
                  .toISOString()
                  .split("T")[0],
              }));

              setEvents(mappedEvents);
              setLoading(false);
              return;
            }
          }
          throw new Error("API returned invalid format");
        } catch (apiError) {
          console.warn("Failed to fetch from API, using mock data:", apiError);

          // Fallback to mock data if API fails
          // Using only TODAY_EVENTS since EVENT_DETAILS is not available
          setEvents(TODAY_EVENTS);
          setLoading(false);
        }
      } catch (err) {
        setError(
          err instanceof Error ? err : new Error("Failed to fetch events")
        );
        setLoading(false);
      }
    };

    fetchEvents();
  }, []); // Empty dependency array to run only once

  // Map backend status to frontend status
  const mapBackendStatus = (backendStatus: string): EventStatus => {
    const statusMap: Record<string, EventStatus> = {
      ACTIVE: "approved",
      PENDING: "pending",
      CANCELLED: "rejected",
      COMPLETED: "completed",
    };
    return statusMap[backendStatus] || "pending";
  };

  // Filter events based on selected categories and status
  const filteredEvents = useMemo(() => {
    if (!events.length) return [];
    return filterEvents(events, selectedCategories, selectedStatus);
  }, [events, selectedCategories, selectedStatus]);

  // Group events by date for calendar view
  const eventsByDate = useMemo(() => {
    if (!filteredEvents.length) return {};
    return groupEventsByDay(filteredEvents);
  }, [filteredEvents]);

  // Get today's events
  const todaysEvents = useMemo(() => {
    const today = new Date().toISOString().split("T")[0];
    return eventsByDate[today] || [];
  }, [eventsByDate]);

  // Calculate statistics
  const statistics = useMemo(() => {
    const total = events.length;
    const approved = events.filter((e) => e.status === "approved").length;
    const pending = events.filter((e) => e.status === "pending").length;
    const rejected = events.filter((e) => e.status === "rejected").length;
    const completed = events.filter((e) => e.status === "completed").length;

    return {
      total,
      approved,
      pending,
      rejected,
      completed,
      approvalRate: calculatePercentage(approved, total),
      growthRate: calculateGrowth(total, Math.floor(total * 0.8)), // Assuming 20% growth for demo
      participation: events.reduce((sum, event) => sum + event.participants, 0),
      averageFillRate:
        events.length > 0
          ? events.reduce(
              (sum, event) => sum + calculateEventFillRate(event),
              0
            ) / events.length
          : 0,
    };
  }, [events]);

  return {
    events,
    filteredEvents,
    eventsByDate,
    todaysEvents,
    statistics,
    loading,
    error,
    selectedCategories,
    setSelectedCategories,
    selectedStatus,
    setSelectedStatus,
    categories: EVENT_CATEGORIES,
  };
}
