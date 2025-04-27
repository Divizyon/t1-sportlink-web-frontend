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
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEventManagement, Event } from "@/hooks/useEventManagement";
import React, { useState, useCallback, useEffect, useMemo } from "react";
import { PaginatedList } from "@/components/common/PaginatedList";
import { Input } from "@/components/ui/input";
import {
  EventFilters,
  EventFilterValues,
} from "@/components/common/EventFilters";
import { cn } from "@/lib/utils";
import { EventDetailModal } from "@/components/common/EventDetailModal";
import { CreateEventButton } from "@/components/events/CreateEventButton";
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

export default function EventsPage() {
  const router = useRouter();
  console.log("EventsPage rendered");

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
  } = useEventManagement({
    autoFetch: false,
    cacheDuration: 300000, // 5 minutes cache
  });

  // State for creating a test event
  const [isCreatingTestEvent, setIsCreatingTestEvent] = useState(false);

  // Function to handle approving/rejecting events
  const handleStatusChange = async (eventId: string, status: string) => {
    try {
      await updateEventStatus(eventId, status);
      // After status change, refresh the current tab data
      if (activeTab === "pending") {
        handleStatusChangeWithPagination(activeTab, currentPage);
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

    // Reset pagination state
    setCurrentPage(1);

    // Update the active tab
    setActiveTab(tabValue);

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
        // For today's events, pass TODAY directly to fetchByStatus
        await fetchByStatus("TODAY");
      } else if (tabValue === "upcoming") {
        // For upcoming events, pass UPCOMING directly to fetchByStatus
        await fetchByStatus("UPCOMING");
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

  // Filter events by search query
  const filterEventsBySearchAndFilters = useCallback(
    (eventList: Event[]) => {
      // If no search or filters, return all events
      if (!searchQuery && Object.keys(activeFilters).length === 0) {
        return eventList;
      }

      // Apply search and additional filters
      return eventList.filter((event) => {
        // Check search query
        const matchesSearch =
          !searchQuery ||
          event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (event.description &&
            event.description
              .toLowerCase()
              .includes(searchQuery.toLowerCase()));

        // Check each active filter
        const matchesSport =
          !activeFilters.sport || event.sport === activeFilters.sport;
        const matchesLocation =
          !activeFilters.location || event.location === activeFilters.location;

        return matchesSearch && matchesSport && matchesLocation;
      });
    },
    [searchQuery, activeFilters]
  );

  // Function to handle deleting an event
  const handleDeleteEvent = async (eventId: string) => {
    try {
      await deleteEvent(eventId);
      toast.success("Etkinlik başarıyla silindi");

      // Close detail modal if open and showing this event
      if (isModalOpen && selectedEventId === eventId) {
        setIsModalOpen(false);
        setSelectedEventId(null);
      }

      // Refresh the current tab
      handleStatusChangeWithPagination(activeTab, currentPage);
    } catch (error) {
      console.error("Error deleting event:", error);
      toast.error("Etkinlik silinirken bir hata oluştu");
    }
  };

  // Function to handle editing an event
  const handleUpdateEvent = async (updatedEvent: Event) => {
    try {
      await updateEvent(updatedEvent);
      toast.success("Etkinlik başarıyla güncellendi");

      // Close edit modal
      setIsEditModalOpen(false);
      setEditingEvent(null);

      // Close detail modal if open and showing this event
      if (isModalOpen && selectedEventId === updatedEvent.id) {
        setIsModalOpen(false);
        setSelectedEventId(null);
      }

      // Refresh the current tab
      handleStatusChangeWithPagination(activeTab, currentPage);
    } catch (error) {
      console.error("Error updating event:", error);
      toast.error("Etkinlik güncellenirken bir hata oluştu");
    }
  };

  // Update total items whenever events change
  useEffect(() => {
    if (totalCount !== undefined) {
      console.log(`API returned totalCount: ${totalCount}`);
      setTotalItems(totalCount);
      setTotalPages(Math.ceil(totalCount / pageSize));
    }
  }, [totalCount, pageSize]);

  // Create a test event 31 minutes from now
  const createTestEvent = async () => {
    try {
      setIsCreatingTestEvent(true);

      // Use directly the admin ID we know is logged in based on logs
      const userId = "d11d962e-12b1-4ba3-ae8f-21300e9643db"; // Known admin user ID

      console.log(
        `Using hardcoded admin ID: ${userId} for test event creation`
      );

      // Calculate the time 31 minutes from now
      const now = new Date();
      const testEventTime = new Date(now.getTime() + 31 * 60 * 1000);

      // Format the date and times correctly
      // Instead of using toISOString which can cause timezone issues, use explicit formatting
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, "0");
      const day = String(now.getDate()).padStart(2, "0");
      const eventDate = `${year}-${month}-${day}`; // Format: YYYY-MM-DD

      // Log the date details for debugging
      console.log(`Current time: ${now.toISOString()}`);
      console.log(`Creating event with date: ${eventDate}`);

      // Create full ISO timestamps
      const startTimeISO = testEventTime.toISOString(); // Full ISO timestamp
      const endTimeISO = new Date(
        testEventTime.getTime() + 60 * 60 * 1000
      ).toISOString(); // 1 hour after start

      // Format the time for display
      const hours = testEventTime.getHours().toString().padStart(2, "0");
      const minutes = testEventTime.getMinutes().toString().padStart(2, "0");

      console.log(
        `Creating test event at ${eventDate} ${startTimeISO} (31 minutes from now)`
      );

      // Create the event with hardcoded sport_id 5
      const response = await api.post("/events", {
        title: `Test Event (${hours}:${minutes})`,
        description: "This is an auto-generated test event for timeout testing",
        event_date: eventDate, // Use the correctly formatted date
        start_time: startTimeISO,
        end_time: endTimeISO,
        location_name: "Test Location",
        sport_id: 5, // Using hardcoded sport_id 5
        max_participants: 5,
        creator_id: userId, // Use the admin user's ID
        location_latitude: 39.925533,
        location_longitude: 32.866287,
      });

      toast.success(
        `Test event created for today at ${hours}:${minutes} (31 minutes from now)`
      );

      // Refresh the events list
      await fetchByStatus("PENDING");
    } catch (error: any) {
      console.error("Error creating test event:", error);

      // Show more detailed error information
      if (error.response) {
        console.error("Response error data:", error.response.data);
        toast.error(
          "Failed to create test event: " +
            (error.response.data?.message || error.response.statusText)
        );
      } else if (error.request) {
        toast.error("Network error - server not responding");
      } else {
        toast.error(
          "Error creating test event: " + (error.message || "Unknown error")
        );
      }
    } finally {
      setIsCreatingTestEvent(false);
    }
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
          emptyMessage = "Bugün için planlanmış etkinlik bulunmuyor";
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
                  onClick={() => router.push("/dashboard/create-event")}
                  className="p-0 h-auto text-blue-500 hover:text-blue-700"
                >
                  Yeni etkinlik oluşturmak için tıklayın
                </Button>
              </p>
            )}
          </div>
        );
      }

      // Use the filtered events that were returned for this page
      const displayEvents = filteredEvents;

      return (
        <>
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
                      className="text-base sm:text-lg font-semibold text-primary hover:text-primary/80 transition-colors cursor-pointer pr-20 truncate"
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
                            event.timeUntilStart === "Süresi doldu" ||
                              event.status === "REJECTED"
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
                        <div className="flex items-center justify-center w-7 h-7 rounded-full bg-purple-50 text-purple-600 mr-3 mt-0.5">
                          <Scroll className="h-4 w-4" />
                        </div>
                        <p className="text-sm text-gray-600 line-clamp-2">
                          {event.description}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Card content with event details */}
                  <div className="flex-grow p-4 pt-3 space-y-3">
                    <div className="grid grid-cols-1 gap-2">
                      <div className="flex items-center">
                        <div className="flex items-center justify-center w-7 h-7 rounded-full bg-blue-50 text-blue-600 mr-3">
                          <Calendar className="h-4 w-4" />
                        </div>
                        <span className="text-sm font-medium">
                          {event.date}
                        </span>
                      </div>

                      <div className="flex items-center">
                        <div className="flex items-center justify-center w-7 h-7 rounded-full bg-purple-50 text-purple-600 mr-3">
                          <Clock className="h-4 w-4" />
                        </div>
                        <span className="text-sm font-medium">
                          {event.time}
                        </span>
                      </div>

                      <div className="flex items-center">
                        <div className="flex items-center justify-center w-7 h-7 rounded-full bg-red-50 text-red-600 mr-3">
                          <MapPin className="h-4 w-4" />
                        </div>
                        <span className="text-sm font-medium truncate">
                          {event.location}
                        </span>
                      </div>

                      <div className="flex items-center">
                        <div className="flex items-center justify-center w-7 h-7 rounded-full bg-green-50 text-green-600 mr-3">
                          {event.sport ? (
                            <SportIcon sportType={event.sport} />
                          ) : (
                            <span className="text-xs font-bold">S</span>
                          )}
                        </div>
                        <span className="text-sm font-medium">
                          {event.sport || "Genel"}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center mt-3 pt-3 border-t border-border/50">
                      <div className="flex items-center justify-center w-7 h-7 rounded-full bg-amber-50 text-amber-600 mr-3">
                        <Users className="h-4 w-4" />
                      </div>
                      <span className="text-sm font-medium">
                        {event.participants}/{event.maxParticipants} Katılımcı
                      </span>
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className="p-4 pt-0 flex justify-between space-x-3 mt-auto">
                    {/* Action buttons for pending events */}
                    {showApproveReject && event.status === "PENDING" && (
                      <div className="flex space-x-2 ml-auto">
                        <Button
                          variant="outline"
                          size="sm"
                          className={cn(
                            "border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 font-medium",
                            event.isExpiringSoon &&
                              "animate-pulse border-red-400"
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

                    {/* Edit and Delete buttons for all events */}
                    <div
                      className={cn(
                        "flex space-x-2",
                        showApproveReject && event.status === "PENDING"
                          ? "mr-auto"
                          : "ml-auto"
                      )}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8 border-blue-200 text-blue-600 hover:bg-blue-50 hover:text-blue-700"
                              onClick={() => {
                                setEditingEvent(event);
                                setIsEditModalOpen(true);
                              }}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Etkinliği Düzenle</p>
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
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {totalItems > pageSize && (
            <div className="flex justify-center mt-6">
              <div className="flex flex-col items-center space-y-2">
                <Pagination
                  totalItems={totalItems}
                  pageSize={pageSize}
                  currentPage={currentPage}
                  onPageChange={handlePageChange}
                />
                <p className="text-xs text-gray-500">
                  Sayfa {currentPage} / {Math.ceil(totalItems / pageSize)}
                  (Toplam {totalItems} etkinlik)
                </p>
              </div>
            </div>
          )}

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
                    <label
                      htmlFor="event-max-participants"
                      className="text-right"
                    >
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

                      handleUpdateEvent(editingEvent);
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
                      handleDeleteEvent(eventToDelete);
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
        </>
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
    ]
  );

  // Fix initial fetch to ensure we use consistent pagination params with updates
  useEffect(() => {
    console.log(
      "Events page mounted or revisited - fetching initial data for active tab only"
    );

    // Only run this effect once when the component mounts
    if (!initialLoadComplete) {
      setTabLoadingStates((prev) => ({ ...prev, [activeTab]: true }));

      // Check URL for status and page parameters
      const params = new URLSearchParams(window.location.search);
      const statusParam = params.get("status");
      const pageParam = params.get("page");

      // Update state based on URL params if they exist
      if (statusParam && Object.keys(TAB_TO_STATUS_MAP).includes(statusParam)) {
        setActiveTab(statusParam);
      }

      if (pageParam && !isNaN(parseInt(pageParam))) {
        setCurrentPage(parseInt(pageParam));
      }

      // Fetch data using the current active tab (potentially updated from URL)
      const tabToFetch = statusParam || activeTab;
      const pageToFetch = pageParam ? parseInt(pageParam) : currentPage;

      // Use the updated tab and page values for the initial fetch
      handleStatusChangeWithPagination(tabToFetch, pageToFetch)
        .then(() => {
          console.log(
            `Initial fetch complete for tab: ${tabToFetch}, page: ${pageToFetch}`
          );
          setInitialLoadComplete(true);
          setTabLoadingStates((prev) => ({ ...prev, [tabToFetch]: false }));
        })
        .catch((error) => {
          console.error("Error during initial fetch:", error);
          setInitialLoadComplete(true);
          setTabLoadingStates((prev) => ({ ...prev, [tabToFetch]: false }));
        });
    }

    // Clean up function
    return () => {
      console.log("Events page unmounting");
    };
  }, [
    fetchEvents,
    fetchByStatus,
    initialLoadComplete,
    activeTab,
    currentPage,
    pageSize,
    handleStatusChangeWithPagination,
  ]);

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-tight">Etkinlik Yönetimi</h1>
        <div className="flex gap-2">
          {/* Button to quickly create test event */}
          <Button
            onClick={createTestEvent}
            variant="outline"
            size="sm"
            className="bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100 flex items-center gap-1"
            disabled={isCreatingTestEvent}
          >
            <Bug className="h-4 w-4" />
            <Timer className="h-4 w-4" />
            {isCreatingTestEvent ? "Oluşturuluyor..." : "Test Etkinliği (31dk)"}
          </Button>

          <Button
            onClick={() => router.push("/dashboard/events/create")}
            size="sm"
            className="flex items-center gap-1"
          >
            <Plus className="h-4 w-4" />
            Yeni Etkinlik
          </Button>
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
        <div className="flex justify-between items-center mb-4">
          <div className="text-sm text-gray-500 italic max-w-2xl">
            {activeTab === "pending" &&
              "Onayınızı bekleyen etkinlikler. Onaylayın veya reddedin."}
            {activeTab === "today" &&
              "Bugün gerçekleşecek onaylanmış etkinlikler. Kesin tarih: " +
                new Date().toLocaleDateString("tr-TR")}
            {activeTab === "upcoming" &&
              "Gelecekte gerçekleşecek planlanan tüm etkinlikler. Bugünden sonraki tarihler gösteriliyor."}
            {activeTab === "rejected" &&
              "Reddedilen ve daha fazla işlem gerektirmeyen etkinlikler."}
            {activeTab === "completed" &&
              "Tamamlanmış etkinlikler. Süresi dolduğu için otomatik olarak tamamlandı olarak işaretlenen etkinlikler burada görüntülenir."}
            {activeTab === "all" &&
              "Tüm etkinlikler yükleniyor. Bu işlem büyük sistemlerde performans sorunlarına neden olabilir."}
          </div>

          <TabsList className="grid w-auto grid-cols-6 mb-1 ml-auto">
            <TabsTrigger
              value="pending"
              className="relative font-medium bg-amber-50 text-amber-800 hover:bg-amber-100 data-[state=active]:bg-amber-200 data-[state=active]:text-amber-900 border-b-2 border-amber-300"
            >
              <AlertCircle className="h-4 w-4 mr-1" />
              Bekleyen
              {tabLoadingStates.pending && (
                <span className="absolute right-1 top-1 w-2 h-2 bg-amber-400 rounded-full animate-pulse"></span>
              )}
            </TabsTrigger>
            <TabsTrigger
              value="today"
              className="relative bg-blue-50 text-blue-800 hover:bg-blue-100 data-[state=active]:bg-blue-200 data-[state=active]:text-blue-900"
            >
              <CalendarClock className="h-4 w-4 mr-1" />
              Bugünkü
              {tabLoadingStates.today && (
                <span className="absolute right-1 top-1 w-2 h-2 bg-blue-400 rounded-full animate-pulse"></span>
              )}
            </TabsTrigger>
            <TabsTrigger
              value="upcoming"
              className="relative bg-green-50 text-green-800 hover:bg-green-100 data-[state=active]:bg-green-200 data-[state=active]:text-green-900"
            >
              <CalendarDays className="h-4 w-4 mr-1" />
              Gelecek
              {tabLoadingStates.upcoming && (
                <span className="absolute right-1 top-1 w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
              )}
            </TabsTrigger>
            <TabsTrigger
              value="rejected"
              className="relative bg-red-50 text-red-800 hover:bg-red-100 data-[state=active]:bg-red-200 data-[state=active]:text-red-900"
            >
              <XCircle className="h-4 w-4 mr-1" />
              Reddedilen
              {tabLoadingStates.rejected && (
                <span className="absolute right-1 top-1 w-2 h-2 bg-red-400 rounded-full animate-pulse"></span>
              )}
            </TabsTrigger>
            <TabsTrigger
              value="completed"
              className="relative bg-blue-50 text-blue-800 hover:bg-blue-100 data-[state=active]:bg-blue-200 data-[state=active]:text-blue-900"
            >
              <CheckCircle className="h-4 w-4 mr-1" />
              Tamamlanan
              {tabLoadingStates.completed && (
                <span className="absolute right-1 top-1 w-2 h-2 bg-blue-400 rounded-full animate-pulse"></span>
              )}
            </TabsTrigger>
            <TabsTrigger
              value="all"
              className="relative bg-gray-50 text-gray-600 hover:bg-gray-100 data-[state=active]:bg-gray-200 data-[state=active]:text-gray-900 opacity-60 hover:opacity-100"
            >
              <Database className="h-4 w-4 mr-1" />
              Tümü
              {tabLoadingStates.all && (
                <span className="absolute right-1 top-1 w-2 h-2 bg-gray-400 rounded-full animate-pulse"></span>
              )}
              <Info className="h-3 w-3 absolute top-0 right-0 text-orange-500" />
            </TabsTrigger>
          </TabsList>
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
            {activeTab === "pending" && totalItems > 0 && (
              <Badge
                variant="outline"
                className="bg-amber-50 text-amber-800 border-amber-200"
              >
                İşlem Bekliyor: {totalItems}
              </Badge>
            )}
          </div>
          {tabLoadingStates.pending ? (
            <div className="text-center py-4 text-gray-500">
              <p>Bekleyen etkinlikler yükleniyor...</p>
            </div>
          ) : (
            renderEventList(events, true)
          )}
        </TabsContent>

        <TabsContent
          value="today"
          className="pt-4 border-blue-200 border rounded-md p-4"
        >
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <CalendarClock className="h-5 w-5 mr-2 text-blue-500" />
            Bugünkü Etkinlikler ({new Date().toLocaleDateString("tr-TR")})
          </h2>
          {tabLoadingStates.today ? (
            <div className="text-center py-4 text-gray-500">
              <p>Bugünkü etkinlikler yükleniyor...</p>
            </div>
          ) : (
            renderEventList(events)
          )}
        </TabsContent>

        <TabsContent
          value="upcoming"
          className="pt-4 border-green-200 border rounded-md p-4"
        >
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <CalendarDays className="h-5 w-5 mr-2 text-green-500" />
            Gelecek Etkinlikler ({new Date().toLocaleDateString("tr-TR")}{" "}
            sonrası)
          </h2>
          {tabLoadingStates.upcoming ? (
            <div className="text-center py-4 text-gray-500">
              <p>Gelecek etkinlikler yükleniyor...</p>
            </div>
          ) : (
            renderEventList(events)
          )}
        </TabsContent>

        <TabsContent
          value="rejected"
          className="pt-4 border-red-200 border rounded-md p-4"
        >
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <XCircle className="h-5 w-5 mr-2 text-red-500" />
            Reddedilen Etkinlikler
          </h2>
          {tabLoadingStates.rejected ? (
            <div className="text-center py-4 text-gray-500">
              <p>Reddedilen etkinlikler yükleniyor...</p>
            </div>
          ) : (
            renderEventList(events)
          )}
        </TabsContent>

        <TabsContent
          value="completed"
          className="pt-4 border-blue-200 border rounded-md p-4"
        >
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <CheckCircle className="h-5 w-5 mr-2 text-blue-500" />
            Tamamlanan Etkinlikler
          </h2>
          {tabLoadingStates.completed ? (
            <div className="text-center py-4 text-gray-500">
              <p>Tamamlanan etkinlikler yükleniyor...</p>
            </div>
          ) : (
            renderEventList(events)
          )}
        </TabsContent>

        <TabsContent
          value="all"
          className="pt-4 border-gray-200 border-2 border-dotted rounded-md p-4 bg-gray-50"
        >
          <div className="bg-orange-50 border border-orange-200 rounded p-3 mb-4">
            <div className="flex items-center text-orange-800">
              <Info className="h-5 w-5 mr-2 text-orange-500" />
              <p className="text-sm">
                Bu sekme tüm etkinlikleri yükler ve büyük sistemlerde performans
                sorunlarına neden olabilir. Sadece gerekli olduğunda kullanın.
              </p>
            </div>
          </div>

          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <Database className="h-5 w-5 mr-2 text-gray-500" />
            Tüm Etkinlikler
            {activeTab === "all" && totalItems > 0 && (
              <Badge className="ml-2 bg-gray-100 text-gray-800">
                Toplam: {totalItems}
              </Badge>
            )}
          </h2>

          {tabLoadingStates.all ? (
            <div className="text-center py-8 text-gray-500">
              <p className="mb-2">Tüm etkinlikler yükleniyor...</p>
              <p className="text-xs text-gray-400">
                Bu işlem büyük veri setlerinde zaman alabilir
              </p>
            </div>
          ) : (
            renderEventList(events)
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
