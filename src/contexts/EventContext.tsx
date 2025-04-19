"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { Event, EventStatus } from "@/types";
import { useToast } from "@/components/ui/use-toast";
import { useDashboardEvents } from "@/hooks";

interface EventContextType {
  // Event data
  events: Event[];
  todaysEvents: Event[];
  filteredEvents: Event[];
  eventsByDate: Record<string, Event[]>;

  // Event filtering
  selectedCategories: string[];
  setSelectedCategories: (categories: string[]) => void;
  selectedStatus: EventStatus[];
  setSelectedStatus: (status: EventStatus[]) => void;
  categories: string[];

  // Event loading state
  loading: boolean;
  error: Error | null;

  // Event selection
  selectedEvent: Event | null;
  setSelectedEvent: (event: Event | null) => void;

  // Event statistics
  statistics: {
    total: number;
    approved: number;
    pending: number;
    rejected: number;
    completed: number;
    approvalRate: number;
    growthRate: number;
    participation: number;
    averageFillRate: number;
  };
}

const EventContext = createContext<EventContextType | undefined>(undefined);

export function useEventContext() {
  const context = useContext(EventContext);
  if (context === undefined) {
    throw new Error("useEventContext must be used within an EventProvider");
  }
  return context;
}

interface EventProviderProps {
  children: ReactNode;
}

export function EventProvider({ children }: EventProviderProps) {
  const { toast } = useToast();
  const {
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
    categories,
  } = useDashboardEvents();

  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  const value = {
    events,
    todaysEvents,
    filteredEvents,
    eventsByDate,
    selectedCategories,
    setSelectedCategories,
    selectedStatus,
    setSelectedStatus,
    categories,
    loading,
    error,
    selectedEvent,
    setSelectedEvent,
    statistics,
  };

  return (
    <EventContext.Provider value={value}>{children}</EventContext.Provider>
  );
}
