import { useCallback, useEffect, useMemo, useState } from "react";
import api from "@/services/api";
import { toast } from "sonner";
import { EventStatus } from "@/types/dashboard";
import React from "react";

// Add date manipulation imports
import {
  format,
  parseISO,
  addHours,
  differenceInMinutes,
  subHours,
} from "date-fns";

// Timezone for Istanbul
const TIMEZONE = "Europe/Istanbul";

// Time offset correction (Istanbul is UTC+3)
const TIME_OFFSET_HOURS = 3;

// Helper to log time debugging info
const logTimeDebug = (
  label: string,
  originalTime: Date,
  adjustedTime: Date
) => {
  console.log(
    `[TIME-DEBUG] ${label}: ` +
      `Original=${originalTime.toISOString()} (${format(
        originalTime,
        "HH:mm"
      )}), ` +
      `Adjusted=${adjustedTime.toISOString()} (${format(
        adjustedTime,
        "HH:mm"
      )}), ` +
      `Diff=${differenceInMinutes(adjustedTime, new Date())} minutes, ` +
      `Current Time=${new Date().toISOString()}`
  );
};

// Map frontend status to backend status
const frontendToBackendStatus: Record<string, string> = {
  PENDING: "PENDING",
  ACTIVE: "ACTIVE",
  REJECTED: "REJECTED",
  COMPLETED: "COMPLETED",
};

// Map backend status to frontend status
const backendToFrontendStatus: Record<string, string> = {
  PENDING: "PENDING",
  ACTIVE: "ACTIVE",
  REJECTED: "REJECTED",
  COMPLETED: "COMPLETED",
  CANCELLED: "REJECTED", // Map cancelled to rejected in frontend
};

// Used to check if we need to refetch when switching tabs
let lastFetchedStatus: string | null = null;

export interface Event {
  id: string;
  title: string;
  description?: string;
  date: string;
  time: string;
  endTime?: string;
  location: string;
  sport: string;
  category: string;
  participants: number;
  maxParticipants: number;
  status: string;
  organizer: string;
  image?: string;
  isExpiringSoon?: boolean;
  timeUntilStart?: string;
}

// Backend API response structure
export interface ApiEvent {
  id: string;
  title: string;
  description?: string;
  event_date?: string;
  date?: string;
  start_time?: string;
  time?: string;
  location_name?: string;
  location?: string;
  sport_category?: string;
  sport?: string;
  category?: string;
  participant_count?: number;
  participants?: number;
  max_participants?: number;
  maxParticipants?: number;
  status: "PENDING" | "ACTIVE" | "REJECTED" | "COMPLETED";
  creator_name?: string;
  organizer?: string;
  image?: string;
}

export interface EventManagementOptions {
  autoFetch?: boolean;
  cacheDuration?: number; // Cache duration in milliseconds
}

export interface FetchEventsOptions {
  forceRefresh?: boolean;
  status?: string | string[];
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  dateFilter?: "today" | "upcoming"; // Add dateFilter parameter
  includeAll?: boolean; // Whether to include all events (even past ones) for today
}

// Cache interface
interface EventCache {
  data: Event[];
  timestamp: number;
  queryKey: string;
  totalCount?: number;
}

// Global cache store for events
let eventsCache: Record<string, EventCache> = {};

export const useEventManagement = (options: EventManagementOptions = {}) => {
  const { autoFetch = true, cacheDuration = 60000 } = options; // Default cache: 1 minute
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [totalCount, setTotalCount] = useState<number>(0);
  const lastRefreshTimeRef = React.useRef<number>(0);
  const [lastActionTime, setLastActionTime] = useState<number>(0);

  // Add a function to trigger refresh
  const triggerRefresh = useCallback(() => {
    setLastActionTime(Date.now());
  }, []);

  // Format time from various formats with timezone adjustment
  const formatTime = (timeStr?: string): string => {
    if (!timeStr) return "N/A";
    try {
      console.log(`[TIME-FORMAT] Formatting time from: ${timeStr}`);

      // Parse the ISO time string to a Date object
      let date: Date;

      // For various time formats
      if (timeStr.includes("T")) {
        // Full ISO string
        date = parseISO(timeStr);
        console.log(`[TIME-FORMAT] Parsed ISO date: ${date.toISOString()}`);
      } else if (timeStr.includes(":")) {
        // Time only format (HH:MM or HH:MM:SS)
        const today = new Date();
        const [hours, minutes, seconds] = timeStr.split(":").map(Number);
        date = new Date(
          today.getFullYear(),
          today.getMonth(),
          today.getDate(),
          hours,
          minutes,
          seconds || 0
        );
        console.log(`[TIME-FORMAT] Parsed time-only: ${date.toISOString()}`);
      } else {
        // Fallback - just use the string as-is
        console.log(`[TIME-FORMAT] Unknown format, using as-is: ${timeStr}`);
        return timeStr;
      }

      // Add timezone offset for Istanbul (UTC+3)
      const adjustedDate = addHours(date, TIME_OFFSET_HOURS);

      // Log time debugging info
      console.log(
        `[TIME-FORMAT] Original=${date.toISOString()} (${format(
          date,
          "HH:mm"
        )}), ` +
          `Adjusted=${adjustedDate.toISOString()} (${format(
            adjustedDate,
            "HH:mm"
          )})`
      );

      // Format just the time portion as HH:MM
      return format(adjustedDate, "HH:mm");
    } catch (error) {
      console.error("Error formatting time:", error);

      // Fallback to simple formatting for non-ISO strings
      if (timeStr.includes("T")) {
        return timeStr.split("T")[1].substring(0, 5);
      }
      return timeStr;
    }
  };

  // Map event status to frontend status
  const mapStatus = (status: string): string => {
    // Log the status received from backend for debugging
    console.log(`Mapping backend status: ${status} for frontend`);
    return backendToFrontendStatus[status] || status;
  };

  // Create a cache key from the fetch options
  const createCacheKey = (options?: FetchEventsOptions): string => {
    if (!options) return "all";

    const statusKey = options.status
      ? Array.isArray(options.status)
        ? options.status.sort().join(",")
        : options.status
      : "all";

    const paginationKey = `page=${options.page || 1}-size=${
      options.pageSize || 15
    }`;

    const sortKey = options.sortBy
      ? `-${options.sortBy}-${options.sortOrder || "desc"}`
      : "";

    const dateFilterKey = options.dateFilter
      ? `-date=${options.dateFilter}`
      : "";

    return `events-${statusKey}-${paginationKey}${sortKey}${dateFilterKey}`;
  };

  // Check if cache is still valid
  const isCacheValid = useCallback(
    (cacheKey: string) => {
      if (!eventsCache[cacheKey]) return false;
      const now = Date.now();
      return now - eventsCache[cacheKey].timestamp < cacheDuration;
    },
    [cacheDuration]
  );

  // Fetch events from API
  const fetchEvents = useCallback(
    async (
      optionsOrForceRefresh?: boolean | FetchEventsOptions
    ): Promise<boolean> => {
      // Handle the legacy boolean parameter for backward compatibility
      const options: FetchEventsOptions =
        typeof optionsOrForceRefresh === "boolean"
          ? { forceRefresh: optionsOrForceRefresh }
          : optionsOrForceRefresh || {};

      const {
        forceRefresh = false,
        status,
        page = 1,
        pageSize = 10, // Default to 10 per page
        sortBy = "created_at",
        sortOrder = "desc",
        dateFilter, // Added dateFilter parameter
      } = options;

      // If loading is already in progress, don't start another request
      if (loading) {
        console.log("Skipping fetch - loading already in progress");
        return false;
      }

      // Create a cache key based on the request parameters
      const cacheKey = createCacheKey(options);

      // Check cache first if not forcing refresh
      if (!forceRefresh && isCacheValid(cacheKey)) {
        console.log(`Using cached events data for key: ${cacheKey}`);
        setEvents(eventsCache[cacheKey].data);
        setTotalCount(
          eventsCache[cacheKey].totalCount || eventsCache[cacheKey].data.length
        );
        setLastUpdated(new Date(eventsCache[cacheKey].timestamp));
        return true; // Return true to indicate data came from cache
      }

      setLoading(true);
      setError(null);

      try {
        console.log(
          `Fetching events with params:`,
          JSON.stringify({
            status,
            page,
            pageSize,
            sortBy,
            sortOrder,
            dateFilter, // Added dateFilter to the log
          })
        );

        // Record the start time for refresh detection
        const requestStart = Date.now();
        lastRefreshTimeRef.current = requestStart;

        // Build the API URL with query parameters
        let queryParams = new URLSearchParams();
        queryParams.append("page", page.toString());
        queryParams.append("limit", pageSize.toString());

        // Add sorting parameters
        if (sortBy) {
          queryParams.append("sort_by", sortBy);
          queryParams.append("sort_order", sortOrder);
        }

        // Add status filtering
        if (status) {
          if (Array.isArray(status)) {
            // Handle multiple status values
            status.forEach((s) => {
              const backendStatus = frontendToBackendStatus[s] || s;
              queryParams.append("status", backendStatus);
            });
          } else {
            // Handle single status value
            const backendStatus = frontendToBackendStatus[status] || status;
            queryParams.append("status", backendStatus);
          }
        }

        // Add date filtering - send directly to the backend
        if (dateFilter) {
          queryParams.append("date_filter", dateFilter);
        }

        // Make the API request with all the query parameters
        console.log(`API request URL params: ${queryParams.toString()}`);
        const response = await api.get(`/events?${queryParams.toString()}`);

        // Track the last status we fetched
        if (status) {
          lastFetchedStatus = Array.isArray(status) ? status.join(",") : status;
        } else {
          lastFetchedStatus = null;
        }

        console.log("API response:", response.data);

        // Default values
        let eventData: any[] = [];
        let totalItems = 0;

        // Process the response data
        if (response.data) {
          // Handle different response formats
          if (response.data.data && response.data.data.events) {
            // New format with pagination
            eventData = response.data.data.events;
            totalItems = response.data.data.total || 0;
            console.log(
              `Found ${eventData.length} events with total count ${totalItems}`
            );
          } else if (Array.isArray(response.data)) {
            // Direct array of events
            eventData = response.data;
            totalItems = response.data.length;
            console.log("Found array of events directly in response");
          } else if (typeof response.data === "object") {
            // Look for common patterns in the response structure
            if (response.data.data && Array.isArray(response.data.data)) {
              // { data: [...events] } format
              eventData = response.data.data;
              totalItems =
                response.data.total ||
                response.data.count ||
                response.data.data.length;
              console.log("Found events in response.data.data");
            } else if (
              response.data.events &&
              Array.isArray(response.data.events)
            ) {
              // { events: [...events] } format
              eventData = response.data.events;
              totalItems =
                response.data.total ||
                response.data.count ||
                response.data.events.length;
              console.log("Found events in response.data.events");
            } else if (
              response.data.data?.events &&
              Array.isArray(response.data.data.events)
            ) {
              // { data: { events: [...events] } } format
              eventData = response.data.data.events;
              totalItems =
                response.data.data.total ||
                response.data.data.count ||
                response.data.data.events.length;
              console.log("Found events in response.data.data.events");
            } else {
              // Last resort: look for any array in the response
              console.log("Searching for events array in response");
              for (const key in response.data) {
                if (Array.isArray(response.data[key])) {
                  const possibleEvents = response.data[key];
                  if (
                    possibleEvents.length > 0 &&
                    possibleEvents[0].title &&
                    possibleEvents[0].status
                  ) {
                    console.log(`Found events in response.data.${key}`);
                    eventData = possibleEvents;
                    totalItems =
                      response.data.total ||
                      response.data.count ||
                      possibleEvents.length;
                    break;
                  }
                }
              }
            }
          }
        }

        // Map backend data to frontend model with simplified date handling
        const mappedEvents = eventData.map((event: any) => {
          console.log(
            `Processing event: ${event.id} "${event.title}" with status ${event.status}, start_time=${event.start_time}`
          );

          // Get the event date in YYYY-MM-DD format, handling timezone appropriately
          let eventDate;
          try {
            // Use the event_date or date from the API response
            const dateStr = event.event_date || event.date;
            if (dateStr) {
              // If it's a full ISO string, convert to timezone and format
              if (dateStr.includes("T")) {
                const date = parseISO(dateStr);
                const adjustedDate = addHours(date, TIME_OFFSET_HOURS);
                eventDate = format(adjustedDate, "yyyy-MM-dd");
              } else {
                // If it's already just a date string, use it directly
                eventDate = dateStr;
              }
            } else {
              // Fallback to current date if no date is provided
              const now = new Date();
              const adjustedDate = addHours(now, TIME_OFFSET_HOURS);
              eventDate = format(adjustedDate, "yyyy-MM-dd");
            }
          } catch (error) {
            console.error("Error parsing event date:", error);
            eventDate = new Date().toISOString().split("T")[0];
          }

          // Check if event is about to expire (for pending events)
          const now = new Date();
          const startTimeIso = event.start_time || "";
          let isExpiringSoon = false;
          let timeUntilStart = "";

          // Check if event is about to expire (for pending events)
          if (event.status === "PENDING" && startTimeIso) {
            try {
              // Parse the event start time
              const startTime = parseISO(startTimeIso);

              // Calculate time difference directly in milliseconds
              const timeUntilStartMs = startTime.getTime() - now.getTime();
              const minutesUntilStart = Math.floor(
                timeUntilStartMs / (60 * 1000)
              );

              console.log(
                `Event status check "${event.title}": ` +
                  `Start time: ${startTime.toISOString()}, ` +
                  `Current time: ${now.toISOString()}, ` +
                  `Minutes until start: ${minutesUntilStart}, ` +
                  `Should be rejected? ${
                    minutesUntilStart <= 30 ? "YES" : "NO"
                  }`
              );

              // Add time remaining indicator for upcoming events
              if (minutesUntilStart > 0) {
                if (minutesUntilStart <= 5) {
                  // Critical - less than 5 minutes left
                  isExpiringSoon = true;
                  timeUntilStart = `${minutesUntilStart} dk kaldı!`;
                } else if (minutesUntilStart <= 30) {
                  // Warning - less than 30 minutes left
                  isExpiringSoon = true;
                  timeUntilStart = `${minutesUntilStart} dk kaldı`;
                }
              } else {
                // Event start time has passed
                isExpiringSoon = true;
                timeUntilStart = "Süresi doldu";
              }
            } catch (error) {
              console.error(
                `Error calculating event expiry for "${event.title}":`,
                error
              );
            }
          }
          // Check if this is a rejected event that was auto-timed out
          else if (event.status === "REJECTED" && startTimeIso) {
            try {
              // Parse the event start time
              const utcStartTime = parseISO(startTimeIso);

              // Add timezone offset for Istanbul (UTC+3)
              const adjustedStartTime = addHours(
                utcStartTime,
                TIME_OFFSET_HOURS
              );

              // Log time debugging info
              logTimeDebug(
                `Rejected event "${event.title}" check`,
                utcStartTime,
                adjustedStartTime
              );

              // Calculate minutes difference
              const minutesDiff = differenceInMinutes(adjustedStartTime, now);

              console.log(
                `Rejected event "${event.title}": Start in ${minutesDiff} minutes`
              );

              // Only mark as timed out if the event was rejected due to timeout
              // (i.e., if it was pending and its start time passed)
              if (minutesDiff <= 0) {
                isExpiringSoon = true;
                timeUntilStart = "Süresi doldu";
                console.log(
                  `Rejected event "${event.title}" was timed out: ${minutesDiff} minutes`
                );
              }
            } catch (error) {
              console.error(
                "Error calculating time for rejected event:",
                error
              );
            }
          }

          return {
            id: event.id || "",
            title: event.title || "",
            description: event.description || "",
            date: eventDate,
            time: formatTime(event.start_time || event.time),
            endTime: event.end_time ? formatTime(event.end_time) : undefined,
            location: event.location_name || event.location || "",
            sport:
              event.sport_category ||
              (event.sport && event.sport.name) ||
              event.sport ||
              event.category ||
              "",
            category:
              event.category ||
              (event.sport && event.sport.name) ||
              event.sport_category ||
              "",
            participants:
              event.participant_count ||
              event.current_participants ||
              event.participants ||
              0,
            maxParticipants:
              event.max_participants || event.maxParticipants || 10,
            status: mapStatus(event.status),
            organizer: event.creator_name || event.organizer || "",
            image:
              event.image ||
              (event.sport && event.sport.icon ? event.sport.icon : undefined),
            isExpiringSoon,
            timeUntilStart,
            rawStartTime: startTimeIso, // Add the raw start time for debugging
          };
        });

        console.log(
          "Mapped events:",
          mappedEvents.length,
          "events after mapping"
        );

        // Store both the totalItems (total count of all events matching criteria)
        // and the actual page of events we got from the API
        eventsCache[cacheKey] = {
          data: mappedEvents,
          timestamp: Date.now(),
          queryKey: cacheKey,
          totalCount: totalItems,
        };

        // Update state
        setEvents(mappedEvents);
        setTotalCount(totalItems);
        setLastUpdated(new Date());
        console.log(
          `Events fetched and set: ${mappedEvents.length}, total: ${totalItems}`
        );

        return false; // Not from cache
      } catch (error: any) {
        console.error("Error fetching events:", error);
        setError(error);
        return false;
      } finally {
        setLoading(false);
      }
    },
    [loading, isCacheValid, formatTime, mapStatus]
  );

  // Update event status
  const updateEventStatus = useCallback(
    async (eventId: string, newStatus: string): Promise<boolean> => {
      try {
        console.log(`Updating event ${eventId} status to ${newStatus}`);

        // Ensure we're using the correct status format for the backend
        const backendStatus = frontendToBackendStatus[newStatus] || newStatus;

        // Make the API request
        await api.patch(`/events/${eventId}/status`, {
          status: backendStatus,
        });

        // Update the local state
        setEvents((prevEvents) =>
          prevEvents.map((event) =>
            event.id === eventId ? { ...event, status: newStatus } : event
          )
        );

        // Clear the cache to force a refresh on next fetch
        eventsCache = {};

        // Set last updated time
        setLastUpdated(new Date());

        // Don't call triggerRefresh() here - it causes a double refresh cycle

        toast.success(
          `Etkinlik durumu başarıyla güncellendi: ${
            newStatus === "ACTIVE" ? "Onaylandı" : "Reddedildi"
          }`
        );

        return true;
      } catch (error) {
        console.error("Error updating event status:", error);
        setError(error as Error);
        toast.error("Etkinlik durumu güncellenirken bir hata oluştu");
        return false;
      }
    },
    []
  );

  // Update event details
  const updateEvent = useCallback(
    async (updatedEvent: Event): Promise<boolean> => {
      try {
        console.log(`Updating event ${updatedEvent.id}`, updatedEvent);

        // Format the date and time to match backend expectations
        // Backend expects date in YYYY-MM-DD format
        // and time in HH:MM:SS format or full ISO format
        const formattedDate = updatedEvent.date; // Already in YYYY-MM-DD format

        // Format time to ISO format
        const [hours, minutes] = updatedEvent.time.split(":");
        const today = new Date();
        const timeDate = new Date(
          today.getFullYear(),
          today.getMonth(),
          today.getDate(),
          parseInt(hours),
          parseInt(minutes)
        );
        const formattedTime = timeDate.toISOString();

        // Transform frontend model to backend model
        const backendEvent = {
          title: updatedEvent.title,
          description: updatedEvent.description || "",
          event_date: formattedDate,
          start_time: formattedTime, // Use ISO format
          location_name: updatedEvent.location,
          sport_category: updatedEvent.sport,
          max_participants: updatedEvent.maxParticipants,
        };

        console.log("Sending update to backend:", backendEvent);

        // Make the API request
        await api.put(`/events/${updatedEvent.id}`, backendEvent);

        // Update the local state
        setEvents((prevEvents) =>
          prevEvents.map((event) =>
            event.id === updatedEvent.id ? updatedEvent : event
          )
        );

        // Clear the cache to force a refresh on next fetch
        eventsCache = {};

        // Set last updated time
        setLastUpdated(new Date());

        // Don't call triggerRefresh() here - it causes a double refresh cycle

        return true;
      } catch (error) {
        console.error("Error updating event:", error);
        setError(error as Error);
        toast.error("Etkinlik güncellenirken bir hata oluştu");
        return false;
      }
    },
    []
  );

  // Delete event
  const deleteEvent = useCallback(async (eventId: string): Promise<boolean> => {
    try {
      console.log(`Deleting event ${eventId}`);

      // Make the API request
      await api.delete(`/events/${eventId}`);

      // Update the local state
      setEvents((prevEvents) =>
        prevEvents.filter((event) => event.id !== eventId)
      );

      // Clear the cache to force a refresh on next fetch
      eventsCache = {};

      // Set last updated time
      setLastUpdated(new Date());

      // Don't call triggerRefresh() here - it causes a double refresh cycle

      return true;
    } catch (error) {
      console.error("Error deleting event:", error);
      setError(error as Error);
      toast.error("Etkinlik silinirken bir hata oluştu");
      return false;
    }
  }, []);

  // Auto fetch on mount if enabled
  useEffect(() => {
    if (autoFetch) {
      fetchEvents();
    }
  }, [autoFetch, fetchEvents]);

  // Fetch specific status events
  const fetchByStatus = useCallback(
    (statusOrOptions: string | string[] | FetchEventsOptions) => {
      console.log(
        "fetchByStatus called with:",
        JSON.stringify(statusOrOptions)
      );

      // If it's already a FetchEventsOptions object
      if (
        typeof statusOrOptions === "object" &&
        !Array.isArray(statusOrOptions) &&
        "status" in statusOrOptions
      ) {
        console.log(
          "Passing FetchEventsOptions directly to fetchEvents:",
          JSON.stringify(statusOrOptions)
        );
        return fetchEvents(statusOrOptions);
      }

      // Special case for ALL status - fetch without any status filter
      if (statusOrOptions === "ALL") {
        console.log("Fetching ALL events without status filter");
        return fetchEvents({
          forceRefresh: true,
          page: 1,
          pageSize: 10,
        });
      }

      // Special cases for Today and Upcoming - add dateFilter
      if (statusOrOptions === "TODAY") {
        console.log("Fetching TODAY events with date filter");
        return fetchEvents({
          status: "ACTIVE",
          dateFilter: "today",
          forceRefresh: true,
          page: 1,
          pageSize: 10,
        });
      }

      if (statusOrOptions === "UPCOMING") {
        console.log("Fetching UPCOMING events with date filter");
        return fetchEvents({
          status: "ACTIVE",
          dateFilter: "upcoming",
          forceRefresh: true,
          page: 1,
          pageSize: 10,
        });
      }

      // For string or array status, construct FetchEventsOptions
      let options: FetchEventsOptions;

      if (
        typeof statusOrOptions === "string" ||
        Array.isArray(statusOrOptions)
      ) {
        options = {
          status: statusOrOptions,
          page: 1, // Default to first page
          pageSize: 10, // Default pageSize
          forceRefresh: true, // Always refresh when switching status
        };
      } else {
        // Safeguard against unexpected input
        options = {
          page: 1,
          pageSize: 10,
          forceRefresh: true,
        };
      }

      console.log(
        `Converting status to FetchEventsOptions:`,
        JSON.stringify(options)
      );
      return fetchEvents(options);
    },
    [fetchEvents]
  );

  // Filtered event lists with better logging
  const pendingEvents = useMemo(() => {
    console.log(
      `Found ${
        events.filter((e) => e.status === "PENDING").length
      } pending events out of ${events.length} total events`
    );
    return events.filter((e) => e.status === "PENDING");
  }, [events]);

  const todayEvents = useMemo(() => {
    if (!events || events.length === 0) {
      console.log("No events to filter for today");
      return [];
    }

    // Get today's date in YYYY-MM-DD format
    const today = new Date();
    // We need to use local date strings to match how we're processing dates from API
    const todayStr = today.toISOString().split("T")[0];

    console.log(
      `Filtering today's events (${todayStr}) from ${events.length} events with status ACTIVE`
    );

    // Log events with their dates for debugging
    const activeEvents = events.filter((event) => event.status === "ACTIVE");
    console.log(`${activeEvents.length} active events to filter:`);
    activeEvents.forEach((event) => {
      console.log(
        `Event ${event.id}: "${event.title}", date="${event.date}", status=${event.status}`
      );
    });

    // Enhanced date comparison for today's events
    const filtered = activeEvents.filter((event) => {
      try {
        // Skip if no date
        if (!event.date) {
          console.warn(
            `Event ${event.id}: "${event.title}" has no date, skipping`
          );
          return false;
        }

        // Simple string comparison (we've already normalized the dates in the same format)
        const isToday = event.date === todayStr;

        console.log(
          `Comparing date for "${event.title}": event date=${event.date}, today=${todayStr}, result=${isToday}`
        );

        return isToday;
      } catch (err) {
        console.error(
          `Error filtering event ${event.id}: "${event.title}"`,
          err
        );
        return false;
      }
    });

    console.log(`Found ${filtered.length} events for today (${todayStr})`);
    filtered.forEach((event) => {
      console.log(`Today's event: "${event.title}", date=${event.date}`);
    });

    return filtered;
  }, [events]);

  const upcomingEvents = useMemo(() => {
    if (!events || events.length === 0) {
      console.log("No events to filter for upcoming");
      return [];
    }

    // Get today's date in YYYY-MM-DD format
    const today = new Date();
    const todayStr = today.toISOString().split("T")[0];

    console.log(
      `Filtering upcoming events (after ${todayStr}) from ${events.length} total events`
    );

    // Get all ACTIVE events
    const activeEvents = events.filter((event) => event.status === "ACTIVE");
    console.log(`${activeEvents.length} active events to filter for upcoming`);

    // Simplified date comparison for upcoming events - use string comparison for consistency
    const filtered = activeEvents.filter((event) => {
      try {
        // Skip if no date
        if (!event.date) {
          return false;
        }

        // Simple string comparison - this works since we've normalized the dates in the same format
        // If event.date string is alphabetically greater than todayStr, it's in the future
        const isUpcoming = event.date > todayStr;

        console.log(
          `Comparing upcoming date for "${event.title}": event date=${event.date}, today=${todayStr}, result=${isUpcoming}`
        );

        return isUpcoming;
      } catch (err) {
        console.error(`Error filtering upcoming event: ${event.title}`, err);
        return false;
      }
    });

    console.log(`Found ${filtered.length} upcoming events (after ${todayStr})`);
    filtered.forEach((event) => {
      console.log(`Upcoming event: "${event.title}", date=${event.date}`);
    });

    return filtered;
  }, [events]);

  const rejectedEvents = useMemo(
    () => events.filter((e) => e.status === "REJECTED"),
    [events]
  );

  // Add effect to automatically refresh when lastActionTime changes
  useEffect(() => {
    if (lastActionTime > 0) {
      const currentStatus = lastFetchedStatus;
      if (currentStatus) {
        console.log(`Auto-refreshing data for status: ${currentStatus}`);
        fetchByStatus(currentStatus);
      }
    }
  }, [lastActionTime, fetchByStatus]);

  return {
    events,
    loading,
    error,
    lastUpdated,
    fetchEvents,
    fetchByStatus,
    updateEventStatus,
    deleteEvent,
    updateEvent,
    pendingEvents,
    todayEvents,
    upcomingEvents,
    rejectedEvents,
    totalCount,
    triggerRefresh, // Export the refresh function
  };
};
