import { useState, useEffect, useMemo } from "react";
import { Event, EventStatus } from "@/types";
import { EVENT_CATEGORIES } from "@/constants/dashboard";
import { TODAY_EVENTS } from "@/mockups/components/dashboard/todaysEvents";
import { EVENT_SCHEMA } from "@/mockups/schemas/eventSchema";
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
        // In production, replace with actual API call
        // const response = await fetch('/api/events');
        // const data = await response.json();

        // Map the schema events to the Event type needed by the component
        const mappedEvents: Event[] = EVENT_SCHEMA.events.map((event) => ({
          id: event.id,
          title: event.title,
          description: event.description,
          date: new Date(event.startDate), // Convert string to Date object
          time: event.time,
          location: event.location.name,
          category: event.category,
          maxParticipants: event.maxParticipants,
          currentParticipants: event.participants,
          status: event.status as EventStatus,
          organizer: event.organizer.name,
          participants: event.participants,
        }));

        setEvents(mappedEvents);
        setLoading(false);
      } catch (err) {
        setError(
          err instanceof Error ? err : new Error("Failed to fetch events")
        );
        setLoading(false);
      }
    };

    fetchEvents();
  }, []); // Empty dependency array to run only once

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
