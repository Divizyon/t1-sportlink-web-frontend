"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  CheckCircle,
  XCircle,
  Search,
  AlertCircle,
  CalendarDays,
  CalendarClock,
  Database,
  Info,
  Trash2,
  Edit,
  Scroll,
  Activity,
  Dumbbell,
  Bike,
  Target,
  Map,
  Waves,
  Table,
  Trophy,
  Bug,
  Timer,
  Plus,
  CalendarPlus,
} from "lucide-react";
import { useRouter } from "next/navigation";
import {
  useEventManagement,
  Event,
  ApiEvent,
} from "@/hooks/useEventManagement";
import { useEventCreation } from "@/hooks/useEventCreation";
import React, { useState, useCallback, useEffect, useMemo } from "react";
import { PaginatedList } from "@/components/common/PaginatedList";
import { Input } from "@/components/ui/input";
import {
  EventFilters,
  EventFilterValues,
} from "@/components/common/EventFilters";
import { cn } from "@/lib/utils";
import { EventDetailModal } from "@/components/common/EventDetailModal";
import { NewEventModal } from "@/components/modals/NewEventModal";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Label } from "@/components/ui/label";
import { Pagination } from "@/components/ui/pagination";
import api from "@/services/api";
import { useAuthStore } from "@/store/authStore";
import { format } from "date-fns";
import { EventStatus } from "@/types/dashboard";
import { Event as DashboardEvent } from "@/types/dashboard/eventDashboard";

// Status mapping between UI tabs and backend status
const TAB_TO_STATUS_MAP = {
  pending: "PENDING",
  today: "ACTIVE", // Special case, requires date filtering
  upcoming: "ACTIVE", // Special case, requires date filtering
  rejected: "REJECTED",
  completed: "COMPLETED", // Add completed status mapping
  all: "ALL", // This will fetch all events
};

// Dynamic Sport Icon component
const SportIcon = ({ sportType }: { sportType: string }) => {
  const normalizedSport = sportType?.toLowerCase().trim() || "";

  switch (normalizedSport) {
    case "futbol":
    case "football":
    case "soccer":
      return <Trophy className="h-4 w-4" />;
    case "basketbol":
    case "basketball":
      return <Trophy className="h-4 w-4" />;
    case "tenis":
    case "tennis":
      return <Target className="h-4 w-4" />;
    case "fitness":
    case "gym":
      return <Dumbbell className="h-4 w-4" />;
    case "yüzme":
    case "swimming":
      return <Waves className="h-4 w-4" />;
    case "bisiklet":
    case "cycling":
      return <Bike className="h-4 w-4" />;
    case "masa tenisi":
    case "table tennis":
    case "ping pong":
      return <Table className="h-4 w-4" />;
    case "badminton":
      return <Target className="h-4 w-4" />;
    case "yoga":
    case "pilates":
      return <Activity className="h-4 w-4" />;
    case "voleybol":
    case "volleyball":
      return <Trophy className="h-4 w-4" />;
    default:
      return <Activity className="h-4 w-4" />;
  }
};

// Utility functions for event status display
const getEventStatusStyle = (status: string): string => {
  switch (status.toUpperCase()) {
    case "PENDING":
      return "bg-amber-100 text-amber-800 border-amber-200";
    case "ACTIVE":
      return "bg-green-100 text-green-800 border-green-200";
    case "REJECTED":
      return "bg-red-100 text-red-800 border-red-200";
    case "COMPLETED":
      return "bg-blue-100 text-blue-800 border-blue-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

const translateEventStatus = (status: string): string => {
  switch (status.toUpperCase()) {
    case "PENDING":
      return "Onay Bekliyor";
    case "ACTIVE":
      return "Aktif";
    case "REJECTED":
      return "Reddedildi";
    case "COMPLETED":
      return "Tamamlandı";
    default:
      return status;
  }
};

// Type guard to check if an event has the timeUntilStart property
const hasTimeUntilStart = (event: Event | ApiEvent): event is Event => {
  return "timeUntilStart" in event;
};

// Type guard to check if an event is an ApiEvent
const isApiEvent = (event: Event | ApiEvent): event is ApiEvent => {
  return (
    "event_date" in event || "start_time" in event || "location_name" in event
  );
};

// Convert ApiEvent to Event from useEventManagement hook
const convertToEvent = (
  event: Event | ApiEvent
): import("@/hooks/useEventManagement").Event => {
  if (!isApiEvent(event)) {
    return {
      id: String(event.id), // Convert id to string to match useEventManagement.Event
      title: event.title,
      description: event.description,
      date:
        typeof event.date === "object"
          ? format(event.date, "yyyy-MM-dd")
          : String(event.date),
      time: event.time,
      location: event.location,
      sport: event.category, // Map category to sport if needed
      category: event.category,
      participants: event.participants,
      maxParticipants: event.maxParticipants,
      status: event.status,
      organizer:
        typeof event.organizer === "object" && event.organizer !== null
          ? // Only access name if organizer is an object and not null
            (event.organizer as { name: string }).name
          : String(event.organizer),
      image: event.image,
    };
  }

  // Convert ApiEvent to Event from useEventManagement
  return {
    id: String(event.id),
    title: event.title,
    description: event.description,
    date: event.date || event.event_date || "",
    time: event.time || event.start_time || "",
    location: event.location || event.location_name || "",
    sport: event.sport || event.sport_category || "",
    category: event.category || "",
    participants: event.participants || event.participant_count || 0,
    maxParticipants: event.maxParticipants || event.max_participants || 0,
    status: event.status,
    organizer: event.organizer || event.creator_name || "",
    image: event.image,
  };
};

// Helper function to find an event by ID
const findEventById = (id: string, eventsList?: Event[]): Event => {
  const events = eventsList || [];
  const event = events.find((e) => e.id === id);

  if (!event) {
    console.error(`Event with ID ${id} not found`);
    return {
      id: "",
      title: "",
      description: "",
      date: "",
      time: "",
      location: "",
      sport: "",
      category: "",
      participants: 0,
      maxParticipants: 0,
      status: "",
      organizer: "",
    };
  }

  return event;
};

// Helper function to get the next status for an event
const getNextStatus = (currentStatus: EventStatus): EventStatus => {
  switch (currentStatus) {
    case "pending":
      return "approved";
    case "approved":
      return "completed";
    case "rejected":
      return "pending";
    case "completed":
      return "completed";
    default:
      return currentStatus;
  }
};

// Add a utility function to avoid repeated direct fetch calls for today's events
const fetchTodayEventsCount = async () => {
  try {
    console.log("Direct fetch of today's events count");
    const todayResponse = await api.get(
      "/events?page=1&limit=1&status=ACTIVE&date_filter=today&includeAll=true"
    );
    return todayResponse.data?.data?.total || 0;
  } catch (err) {
    console.error("Error fetching today's count:", err);
    return 0;
  }
};

export default function EventsPage() {
  const router = useRouter();
  console.log("EventsPage rendered");

  // Event creation hook
  const { createEvent, loading: createEventLoading } = useEventCreation();

  // State to track if data is from cache
  const [isFromCache, setIsFromCache] = useState(false);
  // State to track active tab
  const [activeTab, setActiveTab] = useState<string>("pending");
  // State to track if initial load is complete
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);
  // Track last refresh time
  const lastRefreshTimeRef = React.useRef<number>(0);
  // Search state
  const [searchQuery, setSearchQuery] = useState("");
  // State to track search and filters
  const [activeFilters, setActiveFilters] = useState<EventFilterValues>({});
  // Track tab-specific loading states
  const [tabLoadingStates, setTabLoadingStates] = useState<
    Record<string, boolean>
  >({
    pending: false,
    today: false,
    upcoming: false,
    rejected: false,
    completed: false,
    all: false,
  });
  // Add state for the modal
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // State for edit modal
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // State for delete confirmation
  const [eventToDelete, setEventToDelete] = useState<string | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  // API data fetch hook
  const {
    events,
    loading,
    error,
    lastUpdated,
    fetchEvents,
    fetchByStatus,
    updateEventStatus,
    deleteEvent,
    updateEvent,
    totalCount,
    triggerRefresh,
  } = useEventManagement({
    autoFetch: false,
    cacheDuration: 300000, // 5 minutes cache
  });

  // State for creating a test event
  const [isCreatingTestEvent, setIsCreatingTestEvent] = useState(false);

  // State for new event modal
  const [isNewEventModalOpen, setIsNewEventModalOpen] = useState(false);

  // Add new state to track event counts per tab
  const [eventCountsByStatus, setEventCountsByStatus] = useState<
    Record<string, number>
  >({
    pending: 0,
    today: 0,
    upcoming: 0,
    rejected: 0,
    completed: 0,
    all: 0,
  });

  // Add necessary state
  const lastFetchParamsRef = React.useRef<{
    tab: string;
    page: number;
    time: number;
  } | null>(null);

  // Update fetchIndividualCounts to also respect the verifyTodayCount flag
  const fetchIndividualCounts = useCallback(
    async (verifyTodayCount = false) => {
      try {
        console.log("Fetching individual event counts");

        // Create an array of promises for the API calls
        const promises = [
          api.get("/events?page=1&limit=1&status=PENDING"),
          api.get("/events?page=1&limit=1&status=ACTIVE&date_filter=upcoming"),
          api.get("/events?page=1&limit=1&status=REJECTED"),
          api.get("/events?page=1&limit=1&status=COMPLETED"),
          api.get("/events?page=1&limit=1"),
        ];

        // Only add the today request if needed
        let todayResponse = null;
        if (verifyTodayCount || activeTab === "today") {
          todayResponse = await api.get(
            "/events?page=1&limit=1&status=ACTIVE&date_filter=today&includeAll=true"
          );
        }

        // Execute all the promises
        const [
          pendingResponse,
          upcomingResponse,
          rejectedResponse,
          completedResponse,
          allResponse,
        ] = await Promise.all(promises);

        // Get the total count from each response
        const counts = {
          pending: pendingResponse.data?.data?.total || 0,
          today: todayResponse ? todayResponse.data?.data?.total || 0 : 0,
          upcoming: upcomingResponse.data?.data?.total || 0,
          rejected: rejectedResponse.data?.data?.total || 0,
          completed: completedResponse.data?.data?.total || 0,
          all: allResponse.data?.data?.total || 0,
        };

        console.log("Individual event counts:", counts);
        setEventCountsByStatus(counts);
      } catch (error) {
        console.error("Error fetching individual counts:", error);
      }
    },
    [activeTab]
  );

  // Modify fetchAllEventCounts to use the utility function
  const fetchAllEventCounts = useCallback(
    async (options = { verifyTodayCount: false }) => {
      // Add a timestamp to prevent redundant calls within a short timeframe
      const now = Date.now();
      if (now - lastRefreshTimeRef.current < 1000) {
        console.log("Skipping fetchAllEventCounts, called too soon");
        return;
      }

      lastRefreshTimeRef.current = now;
      console.log("Fetching all event counts");

      try {
        // Use the new /events/counts endpoint
        const response = await api.get("/events/counts");

        if (response.data?.status === "success") {
          const counts = response.data.data;
          console.log("Event counts from unified endpoint:", counts);

          // Only verify today count if explicitly requested or on today tab
          const shouldVerifyTodayCount =
            options.verifyTodayCount || activeTab === "today";

          // If today count is 0 and verification is needed, double-check
          if (counts.today === 0 && shouldVerifyTodayCount) {
            console.log(
              "Verifying today's events count (active tab or requested)"
            );
            const todayCount = await fetchTodayEventsCount();

            if (todayCount > 0) {
              console.log(
                `Found discrepancy: counts endpoint reports 0 today events but direct fetch shows ${todayCount}`
              );
              counts.today = todayCount;
            }
          }

          setEventCountsByStatus(counts);
        } else {
          // Fallback to individual requests if the endpoint fails
          console.warn(
            "Counts endpoint failed, falling back to individual requests"
          );
          fetchIndividualCounts(options.verifyTodayCount);
        }
      } catch (error) {
        console.error("Error fetching event counts:", error);
        // Fallback to individual requests
        fetchIndividualCounts(options.verifyTodayCount);
      }
    },
    [fetchIndividualCounts, activeTab]
  );

  // Function to handle approving/rejecting events
  const handleStatusChange = async (eventId: string, status: string) => {
    try {
      console.log(`Changing event ${eventId} status to ${status}`);
      const success = await updateEventStatus(eventId, status);
      if (success) {
        // Update counts immediately but only fetch once
        console.log("Event status updated, refreshing counts");
        fetchAllEventCounts({ verifyTodayCount: false });

        // Don't need to refetch events as updateEventStatus already updates the UI
      }
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Status güncelleme hatası");
    }
  };

  // Handle tab change
  const handleTabChange = (tabValue: string) => {
    console.log(
      `Tab changed to: ${tabValue}, tab status: ${
        TAB_TO_STATUS_MAP[tabValue as keyof typeof TAB_TO_STATUS_MAP]
      }`
    );

    // Prevent redundant calls if tab hasn't changed
    if (tabValue === activeTab) {
      console.log("Tab hasn't changed, skipping redundant API calls");
      return;
    }

    // Reset pagination state
    setCurrentPage(1);

    // Update the active tab
    setActiveTab(tabValue);

    // Only verify today's count if switching to today tab
    const verifyTodayCount = tabValue === "today";

    // Fetch data for the first page with the new status
    handleStatusChangeWithPagination(tabValue, 1);
  };

  // Handle status change with pagination
  const handleStatusChangeWithPagination = async (
    tabValue: string,
    page: number = currentPage
  ) => {
    console.log(`Fetching events with status: ${tabValue}, page: ${page}`);

    try {
      // Prevent redundant API calls with same parameters
      if (
        lastFetchParamsRef.current &&
        lastFetchParamsRef.current.tab === tabValue &&
        lastFetchParamsRef.current.page === page &&
        Date.now() - lastFetchParamsRef.current.time < 500
      ) {
        console.log("Skipping redundant fetch with same parameters");
        return;
      }

      // Store current fetch parameters to prevent duplicates
      lastFetchParamsRef.current = {
        tab: tabValue,
        page,
        time: Date.now(),
      };

      const statusToFetch =
        TAB_TO_STATUS_MAP[tabValue as keyof typeof TAB_TO_STATUS_MAP];

      // Update loading state for this tab
      setTabLoadingStates((prev) => ({ ...prev, [tabValue]: true }));

      // Set the current tab status as loading
      if (tabValue === "all") {
        // For the "all" tab, fetch events without any status filtering
        await fetchEvents({
          page,
          pageSize,
          forceRefresh: true,
        });
      } else if (tabValue === "today") {
        // For today's events, use fetchByStatus with the today filter and includeAll
        await fetchByStatus({
          status: "ACTIVE",
          dateFilter: "today",
          page,
          pageSize,
          forceRefresh: true,
          includeAll: true,
        });

        // After a successful fetch of today's events, update the count in the state
        // to ensure counts match the actual displayed events
        if (totalCount > 0) {
          console.log(
            `Updating today count to match fetched events: ${totalCount}`
          );
          setEventCountsByStatus((prev) => ({
            ...prev,
            today: totalCount,
          }));
        }
      } else if (tabValue === "upcoming") {
        // For upcoming events, use fetchByStatus with the upcoming filter
        await fetchByStatus({
          status: "ACTIVE",
          dateFilter: "upcoming",
          page,
          pageSize,
          forceRefresh: true,
        });
      } else {
        // For other tabs, fetch the status directly
        await fetchByStatus({
          status: statusToFetch,
          page,
          pageSize,
          forceRefresh: true,
        });
      }

      // Update the URL query parameters without causing a navigation
      const params = new URLSearchParams(window.location.search);
      params.set("status", tabValue);
      params.set("page", page.toString());

      const newUrl = `${window.location.pathname}?${params.toString()}`;
      window.history.pushState({ path: newUrl }, "", newUrl);
    } catch (error) {
      console.error("Error fetching events by status:", error);
    } finally {
      // Reset loading state
      setTabLoadingStates((prev) => ({ ...prev, [tabValue]: false }));
    }
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    console.log(`Page changed to: ${page}`);
    setCurrentPage(page);

    // Get the current active status and fetch the new page
    handleStatusChangeWithPagination(activeTab, page);
  };

  // Initial fetch ensures consistent pagination parameters with updates
  useEffect(() => {
    console.log("Events page mounted - initializing with single API call");

    // Check URL parameters for status and page
    const searchParams = new URLSearchParams(window.location.search);
    const statusParam = searchParams.get("status");
    const pageParam = searchParams.get("page");

    console.log("URL Params - status:", statusParam, "page:", pageParam);

    // Update active tab and current page if specified in URL
    if (statusParam) {
      setActiveTab(statusParam);
    }

    if (pageParam) {
      setCurrentPage(parseInt(pageParam, 10));
    }

    // Initialize with a single set of API calls
    const initializePage = async () => {
      const activeTabValue = statusParam || activeTab;
      // Only verify today's count if on today tab
      const verifyTodayCount = activeTabValue === "today";

      // First fetch all event counts
      await fetchAllEventCounts({ verifyTodayCount });

      // Then fetch the events for the active tab only once
      console.log(
        `Initial fetch for tab: ${activeTabValue}, page: ${
          pageParam || currentPage
        }`
      );

      await handleStatusChangeWithPagination(
        activeTabValue,
        pageParam ? parseInt(pageParam, 10) : currentPage
      );

      setInitialLoadComplete(true);
    };

    initializePage();

    return () => {
      console.log("Events page unmounted");
    };
  }, []);

  // Remove the additional useEffect that was causing duplicate calls
  // Add effect to update event counts only when specific actions are taken
  useEffect(() => {
    // Skip on initial load since fetchAllEventCounts is already called
    if (initialLoadComplete) {
      // Avoid redundant API calls by adding a debounce
      const timeoutId = setTimeout(() => {
        console.log("Updating event counts after state change");
        // Only verify today count if on the today tab
        const verifyTodayCount = activeTab === "today";
        fetchAllEventCounts({ verifyTodayCount });
      }, 300);

      return () => clearTimeout(timeoutId);
    }
  }, [initialLoadComplete, fetchAllEventCounts, activeTab]);

  // Update cache status whenever lastUpdated changes
  React.useEffect(() => {
    if (lastUpdated) {
      const timeDiff = Math.abs(
        lastUpdated.getTime() - (lastRefreshTimeRef.current || 0)
      );
      setIsFromCache(timeDiff > 100);
    }
  }, [lastUpdated]);

  // Count events by type for summary display - this is now just used for badges
  const eventCounts = useMemo(
    () => ({
      all: totalItems, // Use totalCount from API response
      pending: activeTab === "pending" ? totalItems : 0,
      today: activeTab === "today" ? totalItems : 0,
      upcoming: activeTab === "upcoming" ? totalItems : 0,
      rejected: activeTab === "rejected" ? totalItems : 0,
      completed: activeTab === "completed" ? totalItems : 0,
    }),
    [activeTab, totalItems]
  );

  // Extract unique sports and locations for filtering
  const uniqueSports = useMemo(() => {
    const sportSet = new Set<string>();
    events.forEach((event) => {
      if (event.sport) sportSet.add(event.sport);
    });
    return Array.from(sportSet);
  }, [events]);

  const uniqueLocations = useMemo(() => {
    const locationSet = new Set<string>();
    events.forEach((event) => {
      if (event.location) locationSet.add(event.location);
    });
    return Array.from(locationSet);
  }, [events]);

  // Function to check if an event is editable
  const isEventEditable = (event: any) => {
    // Events can be edited if they are in PENDING, ACTIVE status and have appropriate date conditions
    // Also allow editing for today's events
    console.log(
      `Checking editability for event ${event.id} with status ${event.status}`
    );

    if (event.status === "PENDING") {
      console.log(`Event ${event.id} is PENDING, allowing edit`);
      return true;
    }

    if (event.status === "ACTIVE") {
      // Check if the event is today or upcoming
      const eventDate = new Date(`${event.date}T${event.time}`);
      const now = new Date();

      // For Today's tab, ensure events are editable
      if (activeTab === "today") {
        const isEditable = eventDate > now;
        console.log(
          `Today tab - Event ${event.id} date/time: ${eventDate}, now: ${now}, editable: ${isEditable}`
        );
        return isEditable;
      }

      // Allow editing if event hasn't started yet
      const isEditable = eventDate > now;
      console.log(
        `Event ${event.id} is ACTIVE, date/time: ${eventDate}, now: ${now}, editable: ${isEditable}`
      );
      return isEditable;
    }

    console.log(`Event ${event.id} not editable, status: ${event.status}`);
    return false;
  };

  // Function to filter events by search query and active filters
  const filterEventsBySearchAndFilters = (events: any[]) => {
    if (!events) return [];

    return events.filter((event) => {
      // Search query filter
      const matchesSearch =
        !searchQuery ||
        event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (event.description &&
          event.description.toLowerCase().includes(searchQuery.toLowerCase()));

      // Filter by date if set
      const matchesDate =
        !activeFilters.date ||
        new Date(event.date).toDateString() ===
          activeFilters.date.toDateString();

      // Filter by sport if set
      const matchesSport =
        !activeFilters.sport || event.category === activeFilters.sport;

      // Filter by location if set
      const matchesLocation =
        !activeFilters.location ||
        event.location
          .toLowerCase()
          .includes(activeFilters.location.toLowerCase());

      // Filter by min participants if set
      const matchesMinParticipants =
        !activeFilters.minParticipants ||
        event.participants >= (activeFilters.minParticipants || 0);

      // Filter by max participants if set
      const matchesMaxParticipants =
        !activeFilters.maxParticipants ||
        event.participants <= (activeFilters.maxParticipants || Infinity);

      return (
        matchesSearch &&
        matchesDate &&
        matchesSport &&
        matchesLocation &&
        matchesMinParticipants &&
        matchesMaxParticipants
      );
    });
  };

  // Handle event update from edit modal
  const handleUpdateEvent = async (eventId: string) => {
    try {
      if (!editingEvent) {
        toast.error("No event data to update");
        return;
      }

      // Convert the editing event to backend format
      const eventToUpdate = {
        id: eventId,
        title: editingEvent.title,
        description: editingEvent.description || "",
        date: editingEvent.date,
        time: editingEvent.time,
        location: editingEvent.location,
        sport: editingEvent.sport,
        maxParticipants: editingEvent.maxParticipants,
      };

      const success = await updateEvent(eventToUpdate as any);

      if (success) {
        setIsEditModalOpen(false);

        // Update counts immediately
        fetchAllEventCounts({ verifyTodayCount: activeTab === "today" });

        toast.success("Etkinlik başarıyla güncellendi");
      }
    } catch (error) {
      console.error("Error updating event:", error);
      toast.error("Failed to update event");
    }
  };

  // Handle event deletion
  const handleDeleteEvent = async () => {
    if (!eventToDelete) {
      toast.error("No event selected for deletion");
      return;
    }

    try {
      await deleteEvent(eventToDelete);
      setIsDeleteDialogOpen(false);
      setEventToDelete(null);

      // Update counts immediately
      fetchAllEventCounts({ verifyTodayCount: activeTab === "today" });

      toast.success("Event successfully deleted");
    } catch (error) {
      console.error("Error deleting event:", error);
      toast.error("Failed to delete event");
    }
  };

  // Handle successful creation of a new event
  const handleNewEventSuccess = () => {
    // Update counts immediately but avoid redundant API calls
    console.log("New event created, updating counts");
    fetchAllEventCounts({ verifyTodayCount: false });

    // Change to pending tab if we're not already there
    if (activeTab !== "pending") {
      setActiveTab("pending");

      // Only fetch events if changing tabs
      handleStatusChangeWithPagination("pending", 1);
    } else {
      // Just refresh the current page if already on pending tab
      handleStatusChangeWithPagination("pending", currentPage);
    }

    toast.success("Etkinlik başarıyla oluşturuldu");

    // Update URL to show pending tab
    const params = new URLSearchParams(window.location.search);
    params.set("status", "pending");
    params.set("page", "1");
    const newUrl = `${window.location.pathname}?${params.toString()}`;
    window.history.pushState({ path: newUrl }, "", newUrl);
  };

  // Render the event list
  const renderEventList = useCallback(
    (eventList: Event[], showApproveReject = false) => {
      console.log(
        `Rendering event list with ${eventList.length} events (total: ${totalItems})`
      );

      // Apply basic filters (search, sport, location)
      const filteredEvents = filterEventsBySearchAndFilters(eventList);
      console.log(
        `After filtering: ${filteredEvents.length} events to display`
      );

      // For today's tab, log extra information about editability
      if (activeTab === "today") {
        console.log(
          "Today's events tab is active, checking editability of events"
        );
        filteredEvents.forEach((event) => {
          console.log(
            `Today event: ${event.id}, title: ${event.title}, status: ${event.status}, time: ${event.time}`
          );
          console.log(`Is editable: ${isEventEditable(event)}`);
        });
      }

      if (filteredEvents.length === 0) {
        // Show custom messages based on tab
        let emptyMessage = "Bu kriterlere uygun etkinlik bulunamadı";

        if (
          activeTab === "pending" &&
          !searchQuery &&
          Object.keys(activeFilters).length === 0
        ) {
          emptyMessage = "Onay bekleyen etkinlik bulunmuyor";
        } else if (
          activeTab === "today" &&
          !searchQuery &&
          Object.keys(activeFilters).length === 0
        ) {
          if (totalItems > 0) {
            emptyMessage = `Bugün için planlanmış ${totalItems} etkinlik var, ancak hiçbiri şu an gösterilmiyor. Etkinlikler geçmiş olabilir veya henüz başlamamış olabilir.`;
          } else {
            emptyMessage = "Bugün için planlanmış etkinlik bulunmuyor";
          }
        } else if (
          activeTab === "upcoming" &&
          !searchQuery &&
          Object.keys(activeFilters).length === 0
        ) {
          emptyMessage = "Gelecek için planlanmış etkinlik bulunmuyor";
        } else if (
          activeTab === "rejected" &&
          !searchQuery &&
          Object.keys(activeFilters).length === 0
        ) {
          emptyMessage = "Reddedilmiş etkinlik bulunmuyor";
        }

        return (
          <div className="text-center py-8 text-gray-500">
            <p>{emptyMessage}</p>
            {(activeTab === "today" || activeTab === "upcoming") && (
              <p className="mt-2 text-sm">
                <Button
                  variant="link"
                  className="p-0 h-auto text-blue-500 hover:text-blue-700"
                  onClick={() => setIsNewEventModalOpen(true)}
                >
                  <CalendarPlus className="w-4 h-4 mr-2" />
                  Yeni Etkinlik Oluştur
                </Button>
              </p>
            )}
          </div>
        );
      }

      // Use the filtered events that were returned for this page
      const displayEvents = filteredEvents;

      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {displayEvents.map((event) => (
            <Card
              key={event.id}
              className="group overflow-hidden border-border/40 bg-card transition-all hover:shadow-md dark:border-border/20 h-full"
            >
              <div className="flex flex-col h-full">
                {/* Card header with title and status */}
                <div className="relative bg-muted/20 p-4 pb-3 border-b">
                  <h3
                    className="text-base sm:text-lg font-semibold text-primary hover:text-primary/80 transition-colors cursor-pointer pr-16 truncate"
                    onClick={() => {
                      console.log(
                        `Clicked on event: ${event.id} - ${event.title}`
                      );
                      setSelectedEventId(event.id);
                      setIsModalOpen(true);
                    }}
                  >
                    {event.title}
                  </h3>
                  <Badge
                    className={cn(
                      "absolute right-4 top-4 px-2.5 py-1 text-xs font-medium capitalize",
                      event.status === "PENDING" &&
                        "bg-amber-100 text-amber-800 hover:bg-amber-200",
                      event.status === "ACTIVE" &&
                        "bg-green-100 text-green-800 hover:bg-green-200",
                      event.status === "REJECTED" &&
                        "bg-red-100 text-red-800 hover:bg-red-200",
                      event.status === "COMPLETED" &&
                        "bg-blue-100 text-blue-800 hover:bg-blue-200"
                    )}
                  >
                    {event.status === "PENDING" && "Onay Bekliyor"}
                    {event.status === "ACTIVE" && "Aktif"}
                    {event.status === "REJECTED" && "Reddedildi"}
                    {event.status === "COMPLETED" && "Tamamlandı"}
                  </Badge>

                  {/* Add warning for expiring events or timed out rejected events */}
                  {(event.isExpiringSoon ||
                    (event.status === "REJECTED" &&
                      event.timeUntilStart === "Süresi doldu")) && (
                    <div className="absolute top-12 right-4 mt-1">
                      <Badge
                        className={cn(
                          "border animate-pulse",
                          event.timeUntilStart === "Süresi doldu"
                            ? "bg-red-100 text-red-800 hover:bg-red-200 border-red-300"
                            : event.timeUntilStart === "Çok az kaldı!"
                            ? "bg-orange-100 text-orange-800 hover:bg-orange-200 border-orange-300"
                            : "bg-amber-100 text-amber-800 hover:bg-amber-200 border-amber-300"
                        )}
                      >
                        {event.timeUntilStart || "Süresi doldu"}
                      </Badge>
                    </div>
                  )}
                </div>

                {/* Event description section */}
                {event.description && (
                  <div className="px-4 pt-3 pb-1">
                    <div className="flex items-start">
                      <div className="flex-shrink-0 flex items-center justify-center w-7 h-7 rounded-full bg-purple-50 text-purple-600 mr-3 mt-0.5">
                        <Scroll className="h-4 w-4" />
                      </div>
                      <p className="text-sm text-gray-600 line-clamp-2 flex-grow">
                        {event.description}
                      </p>
                    </div>
                  </div>
                )}

                {/* Card content with event details */}
                <div className="flex-grow p-4 pt-3 space-y-3">
                  <div className="grid grid-cols-1 gap-2">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 flex items-center justify-center w-7 h-7 rounded-full bg-blue-50 text-blue-600 mr-3">
                        <Calendar className="h-4 w-4" />
                      </div>
                      <span className="text-sm font-medium truncate">
                        {event.date}
                      </span>
                    </div>

                    <div className="flex items-center">
                      <div className="flex-shrink-0 flex items-center justify-center w-7 h-7 rounded-full bg-purple-50 text-purple-600 mr-3">
                        <Clock className="h-4 w-4" />
                      </div>
                      <div>
                        <span className="text-sm font-medium">
                          Başlangıç: {event.time}
                        </span>
                        {event.endTime && (
                          <div className="text-sm">
                            <span className="text-sm text-gray-600">
                              Bitiş: {event.endTime}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center">
                      <div className="flex-shrink-0 flex items-center justify-center w-7 h-7 rounded-full bg-red-50 text-red-600 mr-3">
                        <MapPin className="h-4 w-4" />
                      </div>
                      <span className="text-sm font-medium truncate">
                        {event.location}
                      </span>
                    </div>

                    <div className="flex items-center">
                      <div className="flex-shrink-0 flex items-center justify-center w-7 h-7 rounded-full bg-green-50 text-green-600 mr-3">
                        {event.sport ? (
                          <SportIcon sportType={event.sport} />
                        ) : (
                          <span className="text-xs font-bold">S</span>
                        )}
                      </div>
                      <span className="text-sm font-medium truncate">
                        {event.sport || "Genel"}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center mt-3 pt-3 border-t border-border/50">
                    <div className="flex-shrink-0 flex items-center justify-center w-7 h-7 rounded-full bg-amber-50 text-amber-600 mr-3">
                      <Users className="h-4 w-4" />
                    </div>
                    <span className="text-sm font-medium">
                      {event.participants}/{event.maxParticipants} Katılımcı
                    </span>
                  </div>
                </div>

                {/* Action buttons */}
                <div className="p-4 pt-0 flex flex-wrap justify-between gap-3 mt-auto">
                  {/* Action buttons for pending events */}
                  {showApproveReject && event.status === "PENDING" && (
                    <div className="flex flex-wrap space-x-2 ml-auto">
                      <Button
                        variant="outline"
                        size="sm"
                        className={cn(
                          "border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 font-medium",
                          event.isExpiringSoon && "animate-pulse border-red-400"
                        )}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleStatusChange(event.id, "REJECTED");
                        }}
                      >
                        <XCircle className="h-4 w-4 mr-1.5" />
                        Reddet
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className={cn(
                          "border-green-200 text-green-600 hover:bg-green-50 hover:text-green-700 font-medium",
                          event.isExpiringSoon &&
                            "animate-pulse border-green-400"
                        )}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleStatusChange(event.id, "ACTIVE");
                        }}
                      >
                        <CheckCircle className="h-4 w-4 mr-1.5" />
                        Onayla
                      </Button>
                    </div>
                  )}

                  {/* Edit and Delete buttons for non-pending events */}
                  {event.status !== "PENDING" && (
                    <div
                      className="flex space-x-2 ml-auto"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="outline"
                              size="icon"
                              className={cn(
                                "h-8 w-8",
                                isEventEditable(event) ||
                                  (activeTab === "today" &&
                                    event.status === "ACTIVE")
                                  ? "border-blue-200 text-blue-600 hover:bg-blue-50 hover:text-blue-700"
                                  : "border-gray-200 text-gray-400 hover:bg-gray-50 cursor-not-allowed"
                              )}
                              onClick={() => {
                                if (
                                  isEventEditable(event) ||
                                  (activeTab === "today" &&
                                    event.status === "ACTIVE")
                                ) {
                                  console.log(
                                    `Opening edit modal for event ${event.id} in ${activeTab} tab`
                                  );
                                  setEditingEvent(event);
                                  setIsEditModalOpen(true);
                                } else {
                                  toast.error("Bu etkinlik artık düzenlenemez");
                                }
                              }}
                              disabled={
                                !(
                                  isEventEditable(event) ||
                                  (activeTab === "today" &&
                                    event.status === "ACTIVE")
                                )
                              }
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            {isEventEditable(event) ||
                            (activeTab === "today" && event.status === "ACTIVE")
                              ? "Etkinliği Düzenle"
                              : "Bu etkinlik artık düzenlenemez"}
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>

                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8 border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
                              onClick={() => {
                                setEventToDelete(event.id);
                                setIsDeleteDialogOpen(true);
                              }}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Etkinliği Sil</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      );
    },
    [
      filterEventsBySearchAndFilters,
      totalItems,
      pageSize,
      currentPage,
      handlePageChange,
      handleStatusChange,
      handleUpdateEvent,
      handleDeleteEvent,
      activeTab,
      setSelectedEventId,
      setIsModalOpen,
      setEditingEvent,
      setIsEditModalOpen,
      setEventToDelete,
      setIsDeleteDialogOpen,
      router,
      searchQuery,
      activeFilters,
      isEventEditable,
      setIsNewEventModalOpen,
    ]
  );

  // Effect to update totalItems from API responses
  useEffect(() => {
    console.log("totalCount updated from API:", totalCount);
    setTotalItems(totalCount);
    setTotalPages(Math.ceil(totalCount / pageSize));
  }, [totalCount, pageSize]);

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header section with improved responsive design */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-2">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight">
            Etkinlik Yönetimi
          </h1>
          <p className="text-sm text-muted-foreground">
            Tüm spor etkinliklerini yönetin ve organize edin
          </p>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 text-red-700 p-4 mb-4 rounded-lg">
          <p className="font-medium">Hata oluştu</p>
          <p className="text-sm">{error.message}</p>
        </div>
      )}

      {/* Search and filters */}
      <EventFilters
        onSearchChange={setSearchQuery}
        onFilterChange={setActiveFilters}
        searchValue={searchQuery}
        sports={uniqueSports}
        locations={uniqueLocations}
      />

      {/* Tabs and content */}
      <Tabs
        defaultValue="pending"
        onValueChange={handleTabChange}
        value={activeTab}
        className="event-tabs mt-6"
      >
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <div className="flex items-center space-x-2">
            <Button
              variant="default"
              size="sm"
              onClick={() => setIsNewEventModalOpen(true)}
              className="bg-green-600 hover:bg-green-700 mr-4"
            >
              <CalendarPlus className="w-4 h-4 mr-2" />
              Yeni Etkinlik Oluştur
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={async () => {
                try {
                  toast.loading("Test etkinliği oluşturuluyor...");

                  // Create a test event with predefined data
                  const testEvent = await createEvent({
                    title: `Test Etkinlik - ${new Date().toLocaleDateString(
                      "tr-TR"
                    )}`,
                    description:
                      "Bu bir test etkinliğidir. Otomatik olarak oluşturulmuştur.",
                    sport_id: 6, // Koşu
                    location_name: "Test Lokasyon",
                    location_lat: 41.0082,
                    location_long: 28.9784,
                    max_participants: 20,
                    hoursInFuture: 0.515,
                  });

                  toast.dismiss();

                  if (testEvent) {
                    // Navigate to pending tab and refresh
                    handleNewEventSuccess();
                  }
                } catch (error) {
                  toast.dismiss();
                  toast.error("Test etkinliği oluşturulurken hata oluştu.");
                }
              }}
              className="flex items-center bg-amber-50 text-amber-800 hover:bg-amber-100"
              style={{ borderColor: "#fcd34d" }}
              disabled={createEventLoading}
            >
              <Clock className="h-4 w-4 mr-2" />
              Test Etkinliği (31dk sonrasına)
            </Button>
          </div>

          <TabsList className="flex">
            <TabsTrigger
              value="pending"
              className="relative font-medium bg-amber-50 text-amber-800 hover:bg-amber-100 data-[state=active]:bg-amber-200 data-[state=active]:text-amber-900 data-[state=active]:border-b-2 data-[state=active]:border-amber-500 data-[state=active]:shadow-sm"
            >
              <span className="flex items-center">
                <AlertCircle className="h-4 w-4 mr-1" />
                Onay Bekleyen
                <Badge
                  variant="outline"
                  className="ml-2 px-1.5 py-0 text-xs bg-amber-100 border-amber-300"
                >
                  {eventCountsByStatus.pending}
                </Badge>
              </span>
            </TabsTrigger>
            <TabsTrigger
              value="today"
              className="relative bg-blue-50 text-blue-800 hover:bg-blue-100 data-[state=active]:bg-blue-200 data-[state=active]:text-blue-900 data-[state=active]:border-b-2 data-[state=active]:border-blue-500 data-[state=active]:shadow-sm"
            >
              <span className="flex items-center">
                <CalendarClock className="h-4 w-4 mr-1" />
                Bugünkü
                <Badge
                  variant="outline"
                  className="ml-2 px-1.5 py-0 text-xs bg-blue-100 border-blue-300"
                >
                  {eventCountsByStatus.today}
                </Badge>
              </span>
            </TabsTrigger>
            <TabsTrigger
              value="upcoming"
              className="relative bg-green-50 text-green-800 hover:bg-green-100 data-[state=active]:bg-green-200 data-[state=active]:text-green-900 data-[state=active]:border-b-2 data-[state=active]:border-green-500 data-[state=active]:shadow-sm"
            >
              <span className="flex items-center">
                <CalendarDays className="h-4 w-4 mr-1" />
                Gelecek
                <Badge
                  variant="outline"
                  className="ml-2 px-1.5 py-0 text-xs bg-green-100 border-green-300"
                >
                  {eventCountsByStatus.upcoming}
                </Badge>
              </span>
            </TabsTrigger>
            <TabsTrigger
              value="rejected"
              className="relative bg-red-50 text-red-800 hover:bg-red-100 data-[state=active]:bg-red-200 data-[state=active]:text-red-900 data-[state=active]:border-b-2 data-[state=active]:border-red-500 data-[state=active]:shadow-sm"
            >
              <span className="flex items-center">
                <XCircle className="h-4 w-4 mr-1" />
                Reddedilen
                <Badge
                  variant="outline"
                  className="ml-2 px-1.5 py-0 text-xs bg-red-100 border-red-300"
                >
                  {eventCountsByStatus.rejected}
                </Badge>
              </span>
            </TabsTrigger>
            <TabsTrigger
              value="completed"
              className="relative bg-blue-50 text-blue-800 hover:bg-blue-100 data-[state=active]:bg-blue-200 data-[state=active]:text-blue-900 data-[state=active]:border-b-2 data-[state=active]:border-blue-500 data-[state=active]:shadow-sm"
            >
              <span className="flex items-center">
                <CheckCircle className="h-4 w-4 mr-1" />
                Tamamlanan
                <Badge
                  variant="outline"
                  className="ml-2 px-1.5 py-0 text-xs bg-blue-100 border-blue-300"
                >
                  {eventCountsByStatus.completed}
                </Badge>
              </span>
            </TabsTrigger>
            <TabsTrigger
              value="all"
              className="relative bg-gray-50 text-gray-600 hover:bg-gray-100 data-[state=active]:bg-gray-200 data-[state=active]:text-gray-900 data-[state=active]:border-b-2 data-[state=active]:border-gray-500 data-[state=active]:shadow-sm"
            >
              <span className="flex items-center">
                <Database className="h-4 w-4 mr-1" />
                Tümü
                <Badge
                  variant="outline"
                  className="ml-2 px-1.5 py-0 text-xs bg-gray-100 border-gray-300"
                >
                  {eventCountsByStatus.all}
                </Badge>
              </span>
            </TabsTrigger>
          </TabsList>
        </div>

        <div className="text-sm text-gray-500 italic flex-1 ml-4">
          {activeTab === "pending" &&
            "Onayınızı bekleyen etkinlikler. Onaylayın veya reddedin."}
          {activeTab === "today" &&
            "Bugün gerçekleşecek onaylanmış etkinlikler."}
          {activeTab === "upcoming" &&
            "Gelecekte gerçekleşecek planlanan tüm etkinlikler."}
          {activeTab === "rejected" &&
            "Reddedilen ve daha fazla işlem gerektirmeyen etkinlikler."}
          {activeTab === "completed" &&
            "Tamamlanmış etkinlikler. Süresi dolduğu için otomatik olarak tamamlandı olarak işaretlenen etkinlikler burada görüntülenir."}
          {activeTab === "all" && "Sistemdeki tüm etkinlikler gösteriliyor."}
        </div>

        <TabsContent
          value="pending"
          className="pt-4 border-amber-200 border-2 border-dashed rounded-md p-4"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold flex items-center">
              <AlertCircle className="h-5 w-5 mr-2 text-amber-500" />
              Onay Bekleyen Etkinlikler
            </h2>
            {eventCountsByStatus.pending > 0 && (
              <Badge
                variant="outline"
                className="bg-amber-50 text-amber-800 border-amber-200"
              >
                İşlem Bekliyor: {eventCountsByStatus.pending}
              </Badge>
            )}
          </div>
          {tabLoadingStates.pending ? (
            <div className="text-center py-4 text-gray-500">
              <p>Bekleyen etkinlikler yükleniyor...</p>
            </div>
          ) : (
            <>
              {renderEventList(events, true)}
              <div className="flex justify-center mt-6">
                <div className="flex flex-col items-center space-y-2">
                  <Pagination
                    totalItems={totalItems}
                    pageSize={pageSize}
                    currentPage={currentPage}
                    onPageChange={handlePageChange}
                  />
                  <p className="text-xs text-gray-500">
                    Sayfa {currentPage} /{" "}
                    {Math.max(Math.ceil(totalItems / pageSize), 1)}
                    (Toplam {totalItems} etkinlik)
                  </p>
                </div>
              </div>
            </>
          )}
        </TabsContent>

        <TabsContent
          value="today"
          className="pt-4 border-blue-200 border rounded-md p-4"
        >
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <CalendarClock className="h-5 w-5 mr-2 text-blue-500" />
            Bugünkü Etkinlikler
            <Badge className="ml-2 bg-blue-50 text-blue-800 border border-blue-200">
              {eventCountsByStatus.today}
            </Badge>
          </h2>
          {tabLoadingStates.today ? (
            <div className="text-center py-4 text-gray-500">
              <p>Bugünkü etkinlikler yükleniyor...</p>
            </div>
          ) : (
            <>
              {events.length > 0 ? (
                renderEventList(events)
              ) : (
                <div className="text-center py-8 text-gray-500">
                  {totalItems > 0 ? (
                    <>
                      <p>
                        Bugün için planlanmış {totalItems} etkinlik var, ancak
                        şu anda görüntülenmiyor.
                      </p>
                      <p className="mt-2 text-sm">
                        Etkinlikler geçmiş olabilir veya henüz başlamamış
                        olabilir.
                      </p>
                    </>
                  ) : (
                    <p>Bugün için planlanmış etkinlik bulunmuyor</p>
                  )}
                  <p className="mt-2 text-sm">
                    <Button
                      variant="link"
                      className="p-0 h-auto text-blue-500 hover:text-blue-700"
                      onClick={() => setIsNewEventModalOpen(true)}
                    >
                      <CalendarPlus className="w-4 h-4 mr-2" />
                      Yeni Etkinlik Oluştur
                    </Button>
                  </p>
                </div>
              )}
              <div className="flex justify-center mt-6">
                <div className="flex flex-col items-center space-y-2">
                  <Pagination
                    totalItems={totalItems}
                    pageSize={pageSize}
                    currentPage={currentPage}
                    onPageChange={handlePageChange}
                  />
                  <p className="text-xs text-gray-500">
                    Sayfa {currentPage} /{" "}
                    {Math.max(Math.ceil(totalItems / pageSize), 1)}
                    (Toplam {totalItems} etkinlik)
                  </p>
                </div>
              </div>
            </>
          )}
        </TabsContent>

        <TabsContent
          value="upcoming"
          className="pt-4 border-green-200 border rounded-md p-4"
        >
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <CalendarDays className="h-5 w-5 mr-2 text-green-500" />
            Gelecek Etkinlikler
            <Badge className="ml-2 bg-green-50 text-green-800 border border-green-200">
              {eventCountsByStatus.upcoming}
            </Badge>
          </h2>
          {tabLoadingStates.upcoming ? (
            <div className="text-center py-4 text-gray-500">
              <p>Gelecek etkinlikler yükleniyor...</p>
            </div>
          ) : (
            <>
              {renderEventList(events)}
              <div className="flex justify-center mt-6">
                <div className="flex flex-col items-center space-y-2">
                  <Pagination
                    totalItems={totalItems}
                    pageSize={pageSize}
                    currentPage={currentPage}
                    onPageChange={handlePageChange}
                  />
                  <p className="text-xs text-gray-500">
                    Sayfa {currentPage} /{" "}
                    {Math.max(Math.ceil(totalItems / pageSize), 1)}
                    (Toplam {totalItems} etkinlik)
                  </p>
                </div>
              </div>
            </>
          )}
        </TabsContent>

        <TabsContent
          value="rejected"
          className="pt-4 border-red-200 border rounded-md p-4"
        >
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <XCircle className="h-5 w-5 mr-2 text-red-500" />
            Reddedilen Etkinlikler
            <Badge className="ml-2 bg-red-50 text-red-800 border border-red-200">
              {eventCountsByStatus.rejected}
            </Badge>
          </h2>
          {tabLoadingStates.rejected ? (
            <div className="text-center py-4 text-gray-500">
              <p>Reddedilen etkinlikler yükleniyor...</p>
            </div>
          ) : (
            <>
              {renderEventList(events)}
              <div className="flex justify-center mt-6">
                <div className="flex flex-col items-center space-y-2">
                  <Pagination
                    totalItems={totalItems}
                    pageSize={pageSize}
                    currentPage={currentPage}
                    onPageChange={handlePageChange}
                  />
                  <p className="text-xs text-gray-500">
                    Sayfa {currentPage} /{" "}
                    {Math.max(Math.ceil(totalItems / pageSize), 1)}
                    (Toplam {totalItems} etkinlik)
                  </p>
                </div>
              </div>
            </>
          )}
        </TabsContent>

        <TabsContent
          value="completed"
          className="pt-4 border-blue-200 border rounded-md p-4"
        >
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <CheckCircle className="h-5 w-5 mr-2 text-blue-500" />
            Tamamlanan Etkinlikler
            <Badge className="ml-2 bg-blue-50 text-blue-800 border border-blue-200">
              {eventCountsByStatus.completed}
            </Badge>
          </h2>
          {tabLoadingStates.completed ? (
            <div className="text-center py-4 text-gray-500">
              <p>Tamamlanan etkinlikler yükleniyor...</p>
            </div>
          ) : (
            <>
              {renderEventList(events)}
              <div className="flex justify-center mt-6">
                <div className="flex flex-col items-center space-y-2">
                  <Pagination
                    totalItems={totalItems}
                    pageSize={pageSize}
                    currentPage={currentPage}
                    onPageChange={handlePageChange}
                  />
                  <p className="text-xs text-gray-500">
                    Sayfa {currentPage} /{" "}
                    {Math.max(Math.ceil(totalItems / pageSize), 1)}
                    (Toplam {totalItems} etkinlik)
                  </p>
                </div>
              </div>
            </>
          )}
        </TabsContent>

        <TabsContent
          value="all"
          className="pt-4 border-gray-200 border rounded-md p-4"
        >
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <Database className="h-5 w-5 mr-2 text-gray-500" />
            Tüm Etkinlikler
            <Badge className="ml-2 bg-gray-100 text-gray-800 border border-gray-300 font-medium">
              Toplam: {eventCountsByStatus.all}
            </Badge>
          </h2>

          {tabLoadingStates.all ? (
            <div className="text-center py-8 text-gray-500">
              <p className="mb-2">Tüm etkinlikler yükleniyor...</p>
            </div>
          ) : (
            <>
              {renderEventList(events)}
              <div className="flex justify-center mt-6">
                <div className="flex flex-col items-center space-y-2">
                  <Pagination
                    totalItems={totalItems}
                    pageSize={pageSize}
                    currentPage={currentPage}
                    onPageChange={handlePageChange}
                  />
                  <p className="text-xs text-gray-500">
                    Sayfa {currentPage} /{" "}
                    {Math.max(Math.ceil(totalItems / pageSize), 1)}
                    (Toplam {totalItems} etkinlik)
                  </p>
                </div>
              </div>
            </>
          )}
        </TabsContent>
      </Tabs>

      {/* New Event Modal */}
      <NewEventModal
        open={isNewEventModalOpen}
        onOpenChange={setIsNewEventModalOpen}
        onSuccess={handleNewEventSuccess}
      />

      {/* Event Detail Modal */}
      <EventDetailModal
        eventId={selectedEventId}
        isOpen={isModalOpen}
        onClose={() => {
          console.log("Closing modal");
          setIsModalOpen(false);
          setSelectedEventId(null);

          // Refresh events after closing modal
          handleStatusChangeWithPagination(activeTab, currentPage);
        }}
      />

      {/* Edit Event Modal */}
      {editingEvent && (
        <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Etkinliği Düzenle</DialogTitle>
              <DialogDescription>
                Etkinlik bilgilerini güncelleyin. Tamamlandığında Kaydet
                butonuna tıklayın.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="event-title" className="text-right">
                  Başlık
                </label>
                <input
                  id="event-title"
                  className="col-span-3 p-2 border rounded"
                  value={editingEvent.title}
                  onChange={(e) =>
                    setEditingEvent({
                      ...editingEvent,
                      title: e.target.value,
                    })
                  }
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="event-description" className="text-right">
                  Açıklama
                </label>
                <textarea
                  id="event-description"
                  className="col-span-3 p-2 border rounded"
                  rows={3}
                  value={editingEvent.description || ""}
                  onChange={(e) =>
                    setEditingEvent({
                      ...editingEvent,
                      description: e.target.value,
                    })
                  }
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="event-date" className="text-right">
                  Tarih
                </label>
                <input
                  id="event-date"
                  type="date"
                  className="col-span-3 p-2 border rounded"
                  value={editingEvent.date}
                  onChange={(e) =>
                    setEditingEvent({
                      ...editingEvent,
                      date: e.target.value,
                    })
                  }
                  required
                  min={new Date().toISOString().split("T")[0]}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="event-time" className="text-right">
                  Saat
                </label>
                <input
                  id="event-time"
                  type="time"
                  className="col-span-3 p-2 border rounded"
                  value={editingEvent.time}
                  onChange={(e) =>
                    setEditingEvent({
                      ...editingEvent,
                      time: e.target.value,
                    })
                  }
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="event-location" className="text-right">
                  Konum
                </label>
                <input
                  id="event-location"
                  className="col-span-3 p-2 border rounded"
                  value={editingEvent.location}
                  onChange={(e) =>
                    setEditingEvent({
                      ...editingEvent,
                      location: e.target.value,
                    })
                  }
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="event-sport" className="text-right">
                  Spor
                </label>
                <input
                  id="event-sport"
                  className="col-span-3 p-2 border rounded"
                  value={editingEvent.sport || ""}
                  onChange={(e) =>
                    setEditingEvent({
                      ...editingEvent,
                      sport: e.target.value,
                    })
                  }
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="event-max-participants" className="text-right">
                  Max Katılımcı
                </label>
                <input
                  id="event-max-participants"
                  type="number"
                  className="col-span-3 p-2 border rounded"
                  value={editingEvent.maxParticipants}
                  onChange={(e) =>
                    setEditingEvent({
                      ...editingEvent,
                      maxParticipants: parseInt(e.target.value),
                    })
                  }
                  required
                  min={1}
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsEditModalOpen(false)}
              >
                İptal
              </Button>
              <Button
                onClick={() => {
                  // Validate form before submission
                  if (
                    !editingEvent.title ||
                    !editingEvent.date ||
                    !editingEvent.time ||
                    !editingEvent.location ||
                    !editingEvent.sport ||
                    !editingEvent.maxParticipants
                  ) {
                    toast.error("Lütfen tüm gerekli alanları doldurun.");
                    return;
                  }

                  handleUpdateEvent(editingEvent.id);
                }}
              >
                Kaydet
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={isDeleteDialogOpen}
        onOpenChange={(open) => {
          setIsDeleteDialogOpen(open);
          if (!open) {
            // Clear the eventToDelete when dialog is closed
            setEventToDelete(null);
          }
        }}
      >
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Etkinliği Sil</DialogTitle>
            <DialogDescription>
              Bu etkinliği silmek istediğinizden emin misiniz? Bu işlem geri
              alınamaz.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsDeleteDialogOpen(false);
                setEventToDelete(null);
              }}
            >
              İptal
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                if (eventToDelete) {
                  handleDeleteEvent();
                  setIsDeleteDialogOpen(false);
                  setEventToDelete(null);
                }
              }}
            >
              Etkinliği Sil
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
