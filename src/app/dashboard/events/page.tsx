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
<<<<<<< Updated upstream
import { Badge } from "@/components/ui/badge";
import { NewEventModal } from "@/components/modals/NewEventModal";
import { EditEventModal } from "@/components/modals/EditEventModal";
import { DeleteEventModal } from "@/components/modals/DeleteEventModal";
import { CategoryFilterDropdown } from "@/components/CategoryFilterDropdown";
import { Plus, ChevronRight, AlertTriangle, RefreshCw } from "lucide-react";
import { format } from "date-fns";
import Link from "next/link";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Event, User } from "@/types/dashboard/eventDashboard";
import { useSingleFetch } from "@/hooks";
import { toast } from "sonner";
=======
import { Label } from "@/components/ui/label";
import { Pagination } from "@/components/ui/pagination";
>>>>>>> Stashed changes

// Status mapping between UI tabs and backend status
const TAB_TO_STATUS_MAP = {
  pending: "PENDING",
  today: "ACTIVE", // Special case, requires date filtering
  upcoming: "ACTIVE", // Special case, requires date filtering
  rejected: "REJECTED",
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
    default:
      return status;
  }
};

export default function EventsPage() {
  const router = useRouter();
  console.log("EventsPage rendered");

<<<<<<< Updated upstream
  // Debug mode for investigating response format
  const [debugMode, setDebugMode] = useState(false);
  const [debugResponse, setDebugResponse] = useState<string>("");

  // Track if we've already fetched data to avoid double fetching
  const hasFetched = useRef(false);

  // Helper function to map backend category to frontend category
  const mapBackendCategory = (backendCategory?: string | number): string => {
    // Eğer bir sport_id (number) geldiyse, direkt olarak dönüştür
    if (typeof backendCategory === "number") {
      return SPORT_CATEGORY_MAP[backendCategory] || "Diğer";
    }

    // Eğer zaten bir category string olarak geldiyse
    if (!backendCategory) return "Diğer";

    // Convert to lowercase and normalize Turkish characters for comparison
    const normalizedCategory = String(backendCategory)
      .toLowerCase()
      .replace(/ı/g, "i")
      .replace(/ğ/g, "g")
      .replace(/ü/g, "u")
      .replace(/ş/g, "s")
      .replace(/ö/g, "o")
      .replace(/ç/g, "c");

    // Map common categories
    if (normalizedCategory.includes("futbol")) return "Futbol";
    if (normalizedCategory.includes("basketbol")) return "Basketbol";
    if (normalizedCategory.includes("voleybol")) return "Voleybol";
    if (normalizedCategory.includes("tenis")) return "Tenis";
    if (normalizedCategory.includes("yuzme")) return "Yüzme";
    if (normalizedCategory.includes("kosu")) return "Koşu";
    if (normalizedCategory.includes("yoga")) return "Yoga";
    if (normalizedCategory.includes("bisiklet")) return "Bisiklet";
    if (normalizedCategory.includes("yuruyus")) return "Yürüyüş";

    // If no match found, use the original category or default to "Diğer"
    return String(backendCategory) || "Diğer";
  };

  // Function to fetch events - defined as useCallback for reuse
  const fetchEvents = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // First try with the normal endpoint
      const response = await fetch("http://localhost:3000/api/events", {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
          "Content-Type": "application/json",
        },
        credentials: "include", // Include cookies for session-based auth
      });

      if (response.status === 401) {
        setError(
          "Oturum süresi doldu veya yetkiniz yok. Lütfen tekrar giriş yapın."
        );
        setEvents([]);
        setLoading(false);
        return;
      }

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      // Clone the response for debugging
      const responseClone = response.clone();
      const respText = await responseClone.text();
      setDebugResponse(respText);

      // Parse the response as JSON
      let data;
      try {
        // Use the original response to get JSON data
        data = JSON.parse(respText);
        console.log("API Response:", data);
      } catch (e) {
        console.error("Failed to parse response as JSON:", e);
        throw new Error("Invalid JSON response from API");
      }

      // Extract events from the response, specifically checking for the format in the error
      // { "status": "success", "data": { "events": [...] } }
      let eventData = null;

      if (
        data.status === "success" &&
        data.data &&
        data.data.events &&
        Array.isArray(data.data.events)
      ) {
        console.log("Found events in data.data.events format");
        eventData = data.data.events;
      } else {
        // Check various possible response formats as fallback
        if (Array.isArray(data)) {
          console.log("Using direct array format");
          eventData = data;
        } else if (data.data && Array.isArray(data.data)) {
          console.log("Using data.data array format");
          eventData = data.data;
        } else if (data.events && Array.isArray(data.events)) {
          console.log("Using data.events array format");
          eventData = data.events;
        } else if (data.result && Array.isArray(data.result)) {
          console.log("Using data.result array format");
          eventData = data.result;
        } else if (data.etkinlikler && Array.isArray(data.etkinlikler)) {
          console.log("Using data.etkinlikler array format");
          eventData = data.etkinlikler;
        } else if (
          data._embedded?.etkinlikler &&
          Array.isArray(data._embedded.etkinlikler)
        ) {
          console.log("Using data._embedded.etkinlikler array format");
          eventData = data._embedded.etkinlikler;
        } else if (data.body && Array.isArray(data.body)) {
          console.log("Using data.body array format");
          eventData = data.body;
        } else if (data.EVENTS && Array.isArray(data.EVENTS)) {
          console.log("Using data.EVENTS array format");
          eventData = data.EVENTS;
        }
      }

      // Store the raw response for display in development mode when debugging
      const rawResponseForDebug = JSON.stringify(data, null, 2);

      console.log(
        "Final extracted events:",
        eventData ? eventData.length : 0,
        "events found"
      );

      // If we get a 200 OK but can't extract event data, we have a format mismatch
      if (!eventData && response.status === 200) {
        console.warn(
          "⚠️ API returned 200 OK but we couldn't extract events from the response"
        );
        setError(
          `API returned data in an unexpected format. Try refreshing the page or contact support.`
        );
        // In development, also display the actual data format
        if (process.env.NODE_ENV === "development") {
          setError(
            `API returned data in an unexpected format: ${rawResponseForDebug.substring(
              0,
              200
            )}...`
          );
        }
        setEvents([]);
        setLoading(false);
        return;
      }

      if (eventData && eventData.length > 0) {
        // Map backend data to frontend format
        try {
          const mappedEvents = eventData.map((event: any, index: number) => {
            console.log(`Etkinlik ${index + 1} veri yapısı:`, {
              id: event.id || event.event_id,
              title: event.title || event.event_title || event.name,
              sport_id: event.sport_id, // Sport ID'sini logla
              date: event.date || event.event_date,
            });

            // Create an organizer object that matches User interface
            const organizer: User = {
              id: event.organizer?.id || event.creator_id || "unknown",
              name: event.organizer?.name || event.creator_name || "Unknown",
              surname: event.organizer?.surname || "",
              email:
                event.organizer?.email ||
                event.creator_email ||
                "unknown@example.com",
              role: "antrenor",
            };

            // Sport ID varsa, bunu özellikle logla
            if (event.sport_id !== undefined) {
              console.log(
                `Etkinlik "${event.title || "Isimsiz"}" için sport_id: ${
                  event.sport_id
                }, dönüştürülen kategori: ${mapBackendCategory(event.sport_id)}`
              );
            }

            // Map the event to our Event interface
            return {
              id: event.id || event.event_id || String(Math.random()),
              title:
                event.title || event.event_title || event.name || "No Title",
              description: event.description || "No Description",
              date: new Date(event.date || event.event_date || new Date()),
              time: event.time || event.start_time || "00:00",
              location:
                event.location ||
                event.venue ||
                event.location_name ||
                "No Location",
              category: mapBackendCategory(
                event.sport_id !== undefined
                  ? event.sport_id
                  : event.category ||
                      event.event_type ||
                      event.sport_type ||
                      "Diğer"
              ),
              maxParticipants: event.max_participants || event.capacity || 50,
              participants:
                event.participant_count ||
                (event.participants ? event.participants.length : 0),
              status: mapBackendStatus(event.status || "completed"),
              organizer: organizer,
              image: event.image || event.photo_url || undefined,
              participantList:
                event.participantList?.map((p: any) => ({
                  id: p.id || "unknown",
                  name: p.name || "Unknown",
                  surname: p.surname || "",
                  email: p.email || "unknown@example.com",
                  role: p.role || "bireysel_kullanici",
                })) || [],
              // API'den gelen current_participants alanını destekle
              current_participants:
                event.current_participants ||
                event.participant_count ||
                (event.participants &&
                typeof event.participants === "object" &&
                Array.isArray(event.participants)
                  ? event.participants.length
                  : event.participants?.[0]?.count || 0),
            };
          });

          console.log("Successfully mapped events:", mappedEvents.length);
          setEvents(mappedEvents);
        } catch (mappingError) {
          console.error("Error mapping events:", mappingError);
          setError(
            "Etkinlik verileri işlenirken bir hata oluştu: " +
              (mappingError as Error).message
          );
          setEvents([]);
        }
      } else if (response.status === 200) {
        // This means the server returned a valid 200 OK response, but with no events
        // This is not an error, just an empty state
        console.log("Server returned 200 OK but no events were found");
        setEvents([]);
        // No error message needed for empty result
        setError(null);
      } else {
        console.warn("No valid event data found in response", data);
        setError(
          "Etkinlikler alınamadı: Sunucudan gelen veri formatı tanımlanamadı."
        );
        setEvents([]);
      }
    } catch (err) {
      console.error("Error fetching events:", err);

      // Provide more specific error messages based on the error type
      if (err instanceof Error) {
        if (
          err.message.includes("NetworkError") ||
          err.message.includes("Failed to fetch")
        ) {
          setError(
            "Ağ hatası: Sunucuya bağlanılamadı. Lütfen internet bağlantınızı kontrol edin."
          );
        } else if (err.message.includes("Timeout")) {
          setError(
            "Zaman aşımı: Sunucu yanıt vermek için çok uzun süre bekledi. Lütfen daha sonra tekrar deneyin."
          );
        } else if (err.message.includes("API error: 500")) {
          setError(
            "Sunucu hatası: İşlem sırasında bir sorun oluştu. Teknik ekip bu konuda bilgilendirildi."
          );
        } else if (err.message.includes("API error: 403")) {
          setError(
            "Erişim reddedildi: Bu verilere erişim için yetkiniz bulunmuyor."
          );
        } else if (err.message.includes("API error: 404")) {
          setError("Kaynak bulunamadı: İstenen veriler sunucuda bulunamadı.");
        } else if (err.message.includes("Invalid JSON")) {
          setError(
            "Veri formatı hatası: Sunucudan beklenmeyen bir yanıt alındı. Lütfen daha sonra tekrar deneyin."
          );
        } else {
          setError(`Bir hata oluştu: ${err.message}`);
        }
      } else {
        setError(
          "Bilinmeyen bir hata oluştu. Lütfen daha sonra tekrar deneyin."
        );
      }

      // Always set events to empty array when there's an error - do not fall back to any mock data
      setEvents([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Use our single fetch hook for the initial data load
  // Providing a specific cache key to ensure uniqueness
  useSingleFetch(fetchEvents, "events-page-initial-fetch");

  // Map backend status to frontend status
  const mapBackendStatus = (
    backendStatus: string
  ): "ACTIVE" | "PENDING" | "REJECTED" | "COMPLETED" => {
    const statusMap: Record<
      string,
      "ACTIVE" | "PENDING" | "REJECTED" | "COMPLETED"
    > = {
      ACTIVE: "ACTIVE",
      PENDING: "PENDING",
      active: "ACTIVE",
      pending: "PENDING",
      REJECTED: "REJECTED",
      CANCELLED: "REJECTED",
      rejected: "REJECTED",
      cancelled: "REJECTED",
      COMPLETED: "COMPLETED",
      completed: "COMPLETED",
    };
    return statusMap[backendStatus?.toUpperCase()] || "PENDING";
  };

  // Component State Hooks
=======
  // State to track if data is from cache
  const [isFromCache, setIsFromCache] = useState(false);
  // State to track active tab
  const [activeTab, setActiveTab] = useState<string>("pending");
  // State to track if initial load is complete
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);
  // Track last refresh time
  const lastRefreshTimeRef = React.useRef<number>(0);
  // Search state
>>>>>>> Stashed changes
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

<<<<<<< Updated upstream
  useEffect(() => {
    // Skip the first render as useSingleFetch handles that
    if (
      prevFiltersRef.current.searchQuery === "" &&
      prevFiltersRef.current.statusFilter === "all" &&
      prevFiltersRef.current.selectedCategories.length === 0
    ) {
      // Update ref with initial values
      prevFiltersRef.current = {
        searchQuery,
        statusFilter,
        selectedCategories,
      };
      return;
=======
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
>>>>>>> Stashed changes
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
        // For today's events, use the dateFilter parameter instead of client-side filtering
        await fetchByStatus({
          status: statusToFetch,
          page,
          pageSize,
          forceRefresh: true,
          dateFilter: "today",
        });
      } else if (tabValue === "upcoming") {
        // For upcoming events, use the dateFilter parameter instead of client-side filtering
        await fetchByStatus({
          status: statusToFetch,
          page,
          pageSize,
          forceRefresh: true,
          dateFilter: "upcoming",
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

<<<<<<< Updated upstream
  // Filter events based on search, category, and status filters
  const filteredEvents = events
    // İlk olarak tarihi geçmiş onaylı etkinlikleri kontrol et
    .map((event): Event => {
      const now = new Date();
      const eventDate = new Date(event.date);
      eventDate.setHours(23, 59, 59);

      // Sadece sayfa yüklendiğinde kontrol et, kullanıcı değiştirdiğinde değil
      if (eventDate < now && event.status === "ACTIVE") {
        return { ...event, status: "COMPLETED" as const };
      }
      return event;
    })
    // Sonra filtreleme yap
    .filter((event) => {
      const matchesSearch =
        event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.location.toLowerCase().includes(searchQuery.toLowerCase());

      // Status filter için büyük/küçük harf uyumlu hale getirelim
      const matchesStatus =
        statusFilter === "all" ||
        event.status === statusFilter ||
        (statusFilter === "pending" && event.status === "PENDING") ||
        (statusFilter === "approved" && event.status === "ACTIVE") ||
        (statusFilter === "rejected" && event.status === "REJECTED") ||
        (statusFilter === "completed" && event.status === "COMPLETED");

      const matchesCategories =
        selectedCategories.length === 0 ||
        selectedCategories.includes(event.category);

      return matchesSearch && matchesStatus && matchesCategories;
=======
  const uniqueLocations = useMemo(() => {
    const locationSet = new Set<string>();
    events.forEach((event) => {
      if (event.location) locationSet.add(event.location);
>>>>>>> Stashed changes
    });
    return Array.from(locationSet);
  }, [events]);

<<<<<<< Updated upstream
  // Add log to inspect filteredEvents before render
  console.log("Filtered events before rendering:", filteredEvents);

  const handleEditEvent = (
    id: string | number,
    updatedEvent: Partial<Omit<Event, "organizer">> & {
      organizer?: Partial<User>;
    }
  ) => {
    setEvents((prevEvents) =>
      prevEvents.map((event) => {
        if (event.id === id) {
          // Create a new object merging the old event with updated fields
          const newEvent = { ...event };

          // Handle all simple properties
          Object.keys(updatedEvent).forEach((key) => {
            if (key !== "organizer") {
              // @ts-ignore - We need this because TypeScript doesn't know these keys are valid
              newEvent[key] = updatedEvent[key];
            }
          });

          // Handle organizer separately if provided
          if (updatedEvent.organizer) {
            newEvent.organizer = {
              ...event.organizer,
              ...updatedEvent.organizer,
            };
          }

          return newEvent;
        }
        return event;
      })
    );
    toast.success(
      `Etkinlik durumu "${
        updatedEvent.status === "completed"
          ? "Tamamlandı"
          : updatedEvent.status === "approved"
          ? "Onaylandı"
          : updatedEvent.status === "rejected"
          ? "Reddedildi"
          : "Beklemede"
      }" olarak güncellendi.`
    );

    if (updatedEvent.status === "rejected") {
      toast.error(
        "Etkinliğiniz yönetici tarafından reddedildi. Lütfen etkinlik kurallarını kontrol edin."
      );
    }
  };

  const handleDeleteEvent = (id: string | number) => {
    // Backend API'ye silme isteği gönder
    console.log(`Etkinlik silme isteği gönderiliyor: ID=${id}`);

    const apiUrl = `${
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api"
    }/events/${id}`;

    // Tüm olası token kaynaklarını kontrol et
    const tokenFromCookie = document.cookie
      .split("; ")
      .find((row) => row.startsWith("accessToken="))
      ?.split("=")[1];

    const tokenFromLocalStorage = localStorage.getItem("token");
    const tokenFromSportlinkStorage = localStorage.getItem("sportlink_token");

    // Kullanılabilecek ilk token'ı seç
    const token =
      tokenFromCookie || tokenFromLocalStorage || tokenFromSportlinkStorage;

    console.log("Kimlik doğrulama token'ı bulundu:", !!token);

    fetch(apiUrl, {
      method: "DELETE",
      headers: {
        Authorization: token ? `Bearer ${token}` : "",
        "Content-Type": "application/json",
      },
      credentials: "include", // Cookie tabanlı auth için
    })
      .then((response) => {
        console.log(`Sunucu yanıtı: ${response.status} ${response.statusText}`);

        if (!response.ok) {
          if (response.status === 401) {
            console.error(
              "Kimlik doğrulama hatası - Token:",
              token ? token.substring(0, 10) + "..." : "Bulunamadı"
            );
            throw new Error(
              "Oturum süresi dolmuş. Kimlik doğrulama yapılamadı."
            );
          } else if (response.status === 403) {
            throw new Error("Bu etkinliği silme yetkiniz bulunmuyor.");
          } else if (response.status === 404) {
            throw new Error("Etkinlik bulunamadı.");
          } else if (response.status === 500) {
            throw new Error(
              "Sunucu hatası oluştu. Lütfen daha sonra tekrar deneyin."
            );
          } else {
            throw new Error(
              `Etkinlik silinirken bir hata oluştu: HTTP ${response.status}`
            );
          }
        }

        return response.text().then((text) => {
          try {
            return text ? JSON.parse(text) : {};
          } catch (e) {
            console.log("JSON parse hatası, boş sonuç dönüyor:", e);
            return {};
          }
        });
      })
      .then((data) => {
        console.log("Silme başarılı, sunucu yanıtı:", data);

        // Etkinlik adını bul
        const deletedEvent = events.find((e) => e.id === id);
        const eventName = deletedEvent?.title || "Etkinlik";

        // UI'dan etkinliği kaldır
        setEvents(events.filter((event) => event.id !== id));

        // Başarılı silme bildirimi göster - Sonner toast formatında
        toast.success(`"${eventName}" etkinliği başarıyla silindi.`, {
          duration: 5000,
        });

        // Konsola da başarılı olduğunu yazalım
        console.log(
          "%c ✅ Etkinlik başarıyla silindi!",
          "color: green; font-weight: bold; font-size: 14px;"
        );
      })
      .catch((error) => {
        console.error("Silme hatası:", error);
        // Hata bildirimi göster - Sonner toast formatında
        toast.error(error.message || "Etkinlik silinirken bir hata oluştu.");
      });
  };

  const handleAddNewEvent = (newEvent: Partial<Event>) => {
    console.log("Received new event data:", newEvent);

    // Ensure the organizer property is properly set
    let organizer: User;

    if (newEvent.organizer && typeof newEvent.organizer === "object") {
      // Use the provided organizer if available
      organizer = newEvent.organizer as User;
    } else {
      // Create a default organizer
      organizer = {
        id: "system-" + Date.now(),
        name: "System",
        surname: "User",
        role: "antrenor",
        email: "system@sportlink.com",
      };
    }

    // Yeni etkinlik için tam veri yapısı oluştur, gelen veriyi tamamla/garantile
    const eventToAdd: Event = {
      ...newEvent, // Start with the provided event data
      id: newEvent.id || String(Date.now()), // Ensure ID exists
      title: newEvent.title || "",
      description: newEvent.description || "",
      date: new Date(newEvent.date || new Date()),
      time: newEvent.time || "",
      location: newEvent.location || "",
      category: newEvent.category || "",
      participants: newEvent.participants || 0, // Ensure participants exists
      maxParticipants: newEvent.maxParticipants || 100, // Ensure maxParticipants exists
      status: newEvent.status || "PENDING", // Ensure status exists
      organizer: organizer, // Use the determined organizer
      image: newEvent.image,
      participantList: newEvent.participantList || [], // Ensure participantList exists
    };

    console.log("Formatted event to add:", eventToAdd);

    setEvents((prevEvents) => {
      const updatedEvents = [...prevEvents, eventToAdd];
      console.log("All events after adding:", updatedEvents);

      // localStorage'a hemen kaydet
      try {
        const eventsToSave = updatedEvents.map((event) => ({
          ...event,
          date: event.date.toISOString(),
          organizer: {
            id: event.organizer.id,
          },
          participantList:
            event.participantList?.map((p) => ({ id: p.id })) || [],
        }));
        localStorage.setItem("events", JSON.stringify(eventsToSave));
        console.log("Events saved to localStorage immediately after add");
      } catch (error) {
        console.error("Error saving events after add:", error);
=======
  // Filter events by search query
  const filterEventsBySearchAndFilters = useCallback(
    (eventList: Event[]) => {
      // If no search or filters, return all events
      if (!searchQuery && Object.keys(activeFilters).length === 0) {
        return eventList;
>>>>>>> Stashed changes
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

<<<<<<< Updated upstream
  // handleStatusChange fonksiyonunu güncelleyelim
  const handleStatusChange = (
    eventId: string | number,
    newStatus: "ACTIVE" | "PENDING" | "REJECTED" | "COMPLETED"
  ) => {
    // API'ye durum değişikliği gönder
    console.log(
      `Etkinlik durumu güncelleniyor: ID=${eventId}, Yeni Durum=${newStatus}`
    );

    const apiUrl = `${
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api"
    }/events/${eventId}/status`;

    // Tüm olası token kaynaklarını kontrol et (silme işlemiyle aynı mantık)
    const tokenFromCookie = document.cookie
      .split("; ")
      .find((row) => row.startsWith("accessToken="))
      ?.split("=")[1];

    const tokenFromLocalStorage = localStorage.getItem("token");
    const tokenFromSportlinkStorage = localStorage.getItem("sportlink_token");

    // Kullanılabilecek ilk token'ı seç
    const token =
      tokenFromCookie || tokenFromLocalStorage || tokenFromSportlinkStorage;

    // Veriyi hazırla
    const updateData = {
      status: newStatus,
    };

    // İlgili durumun başarılı mesajını hazırla
    const successMessage = `Etkinlik durumu "${
      newStatus === "COMPLETED"
        ? "Tamamlandı"
        : newStatus === "ACTIVE"
        ? "Onaylandı"
        : newStatus === "REJECTED"
        ? "Reddedildi"
        : "Beklemede"
    }" olarak güncellendi.`;

    // İsteği gönder, ancak arayüzü hemen güncelle (iyimser güncelleme)
    setEvents((prevEvents) =>
      prevEvents.map((event) =>
        event.id === eventId ? { ...event, status: newStatus } : event
      )
    );

    // Kullanıcıya bilgi ver
    toast.success(successMessage);

    if (newStatus === "REJECTED") {
      toast.error(
        "Etkinliğiniz yönetici tarafından reddedildi. Lütfen etkinlik kurallarını kontrol edin."
      );
    }

    // API çağrısı yap
    fetch(apiUrl, {
      method: "PATCH",
      headers: {
        Authorization: token ? `Bearer ${token}` : "",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updateData),
      credentials: "include",
    })
      .then((response) => {
        console.log(
          `Durum güncelleme yanıtı: ${response.status} ${response.statusText}`
        );

        if (!response.ok) {
          // Başarısız olursa, kullanıcıya bilgi ver
          throw new Error(`Durum güncellenemedi: HTTP ${response.status}`);
        }

        return response.text().then((text) => {
          try {
            return text ? JSON.parse(text) : {};
          } catch (e) {
            console.log("JSON parse hatası, boş sonuç dönüyor:", e);
            return {};
          }
        });
      })
      .then((data) => {
        console.log("Durum güncelleme başarılı, sunucu yanıtı:", data);
      })
      .catch((error) => {
        console.error("Durum güncelleme hatası:", error);

        // Hata durumunda kullanıcıya bilgi ver ve eski duruma geri döndür
        toast.error("Etkinlik durumu güncellenirken bir hata oluştu.");

        // API hatası olursa UI'ı önceki duruma geri döndür (rollback)
        fetchEvents();
      });
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Etkinlik Yönetimi</h1>
        <Button onClick={() => setIsNewEventModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Yeni Etkinlik
        </Button>
      </div>

      <NewEventModal
        open={isNewEventModalOpen}
        onOpenChange={setIsNewEventModalOpen}
        onSuccess={(newEvent) => {
          handleAddNewEvent(newEvent);
          setIsNewEventModalOpen(false);
        }}
      />

      <Card className="p-4">
        {loading && (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        )}

        {error && !loading && (
          <div className="text-center py-8 text-red-500">
            <AlertTriangle className="mx-auto h-12 w-12 mb-4" />
            <p className="font-medium text-lg mb-2">{error}</p>
            <p className="text-gray-600 mb-4">
              Veri formatı sorunu nedeniyle etkinlikler gösterilemiyor. Lütfen
              tekrar deneyin veya sistem yöneticisine başvurun.
            </p>
            <div className="flex flex-col md:flex-row gap-4 justify-center">
              <Button
                variant="default"
                size="lg"
                className="mt-4 bg-primary hover:bg-primary/90"
                onClick={() => {
                  setLoading(true);
                  setError(null);
                  fetchEvents();
                }}
              >
                <RefreshCw className="h-5 w-5 mr-2" />
                Tekrar Dene
              </Button>
              {process.env.NODE_ENV === "development" && (
=======
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
>>>>>>> Stashed changes
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

<<<<<<< Updated upstream
        {!loading && !error && (
          <div className="flex flex-col sm:flex-row justify-between items-start mb-4 gap-2">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
              <Input
                placeholder="Etkinlik ara..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full sm:w-64"
              />
              <CategoryFilterDropdown
                selectedCategories={selectedCategories}
                onSelectCategories={setSelectedCategories}
              />
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Durum" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tüm Durumlar</SelectItem>
                  <SelectItem value="pending">Beklemede</SelectItem>
                  <SelectItem value="approved">Onaylandı</SelectItem>
                  <SelectItem value="rejected">Reddedildi</SelectItem>
                  <SelectItem value="completed">Tamamlandı</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )}

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Etkinlik Adı</TableHead>
                <TableHead>Kategori</TableHead>
                <TableHead>Tarih</TableHead>
                <TableHead>Konum</TableHead>
                <TableHead>Organizatör</TableHead>
                <TableHead>Katılımcı Sayısı</TableHead>
                <TableHead>Durum</TableHead>
                <TableHead className="text-right">İşlemler</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEvents.map((event) => {
                // Log the event object being rendered for this row
                console.log(`Rendering row for event: ${event.title}`, event);
                return (
                  <TableRow key={event.id}>
                    <TableCell>
                      <TooltipProvider delayDuration={0}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <button
                              onClick={() => setSelectedEventForPreview(event)}
                              className={`font-medium text-gray-900 hover:underline cursor-pointer text-left`}
                            >
                              {event.title}
                            </button>
                          </TooltipTrigger>
                          <TooltipContent className="max-w-[300px] p-4 bg-white shadow-lg rounded-lg border border-gray-200">
                            <p className="text-gray-700 text-sm whitespace-pre-wrap">
                              {event.description}
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={`${CATEGORY_COLORS[event.category].bg} ${
                          CATEGORY_COLORS[event.category].text
                        } hover:${CATEGORY_COLORS[event.category].bg}`}
                      >
                        {event.category}
                      </Badge>
                    </TableCell>
                    <TableCell>{format(event.date, "dd.MM.yyyy")}</TableCell>
                    <TableCell>{event.location}</TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-medium text-gray-900">
                          {event.organizer.name} {event.organizer.surname}
                        </span>
                        <span className="text-xs text-gray-500">
                          {ROLE_LABELS[event.organizer.role]}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <button
                        className="text-blue-600 hover:text-blue-800 hover:underline cursor-pointer"
                        onClick={() => {
                          console.log(
                            "Participant count clicked for event:",
                            event.title
                          );
                          // Katılımcı listesini API'den çek
                          const fetchParticipants = async () => {
                            try {
                              setLoading(true);
                              const token = localStorage.getItem("token") || "";
                              const tokenFromSportlinkStorage =
                                localStorage.getItem("sportlink_token");
                              const authToken =
                                token || tokenFromSportlinkStorage || "";

                              // Alternatif endpoint'leri dene
                              let response;
                              let apiUrl =
                                process.env.NEXT_PUBLIC_API_URL ||
                                "http://localhost:3000/api";

                              try {
                                // İlk deneme - standart /events/{id}/participants endpoint
                                response = await fetch(
                                  `${apiUrl}/events/${event.id}/participants`,
                                  {
                                    headers: {
                                      Authorization: `Bearer ${authToken}`,
                                      "Content-Type": "application/json",
                                    },
                                    credentials: "include",
                                  }
                                );

                                if (response.status === 404) {
                                  // İkinci deneme - event_participants endpoint
                                  response = await fetch(
                                    `${apiUrl}/event_participants?event_id=${event.id}`,
                                    {
                                      headers: {
                                        Authorization: `Bearer ${authToken}`,
                                        "Content-Type": "application/json",
                                      },
                                      credentials: "include",
                                    }
                                  );

                                  if (response.status === 404) {
                                    // Üçüncü deneme - event detayları ile birlikte tüm katılımcıları getir
                                    response = await fetch(
                                      `${apiUrl}/events/${event.id}?include=participants`,
                                      {
                                        headers: {
                                          Authorization: `Bearer ${authToken}`,
                                          "Content-Type": "application/json",
                                        },
                                        credentials: "include",
                                      }
                                    );
                                  }
                                }
                              } catch (fetchError) {
                                console.error("Endpoint hatası:", fetchError);

                                // Eğer gerçek API'ler bulunamazsa, mevcut participantList kullan (fallback)
                                if (
                                  event.participantList &&
                                  event.participantList.length > 0
                                ) {
                                  setParticipantsToPreview(
                                    event.participantList
                                  );
                                  setIsParticipantPreviewOpen(true);
                                  setLoading(false);
                                  return;
                                } else {
                                  toast.info(
                                    "Katılımcı bilgilerine şu anda erişilemiyor."
                                  );
                                  setLoading(false);
                                  return;
                                }
                              }

                              if (!response.ok) {
                                // Eğer tüm API çağrıları başarısız olursa, mevcut participantList'e geri dön
                                if (
                                  event.participantList &&
                                  event.participantList.length > 0
                                ) {
                                  setParticipantsToPreview(
                                    event.participantList
                                  );
                                  setIsParticipantPreviewOpen(true);
                                  setLoading(false);
                                  return;
                                }
                                throw new Error(
                                  `API error: ${response.status}`
                                );
                              }

                              const data = await response.json();
                              console.log("Katılımcı verisi:", data);

                              // Katılımcı verisini doğru formata dönüştür
                              let participantList = [];

                              // Farklı API yanıt formatlarını kontrol et
                              if (data.participants) {
                                participantList = Array.isArray(
                                  data.participants
                                )
                                  ? data.participants
                                  : [];
                              } else if (data.data?.participants) {
                                participantList = Array.isArray(
                                  data.data.participants
                                )
                                  ? data.data.participants
                                  : [];
                              } else if (Array.isArray(data)) {
                                participantList = data;
                              } else if (
                                data.data &&
                                Array.isArray(data.data)
                              ) {
                                participantList = data.data;
                              } else if (
                                data.event_participants &&
                                Array.isArray(data.event_participants)
                              ) {
                                participantList = data.event_participants;
                              }

                              // Veriyi User tipine dönüştür
                              const mappedParticipants = participantList.map(
                                (p: any) => ({
                                  id: p.id || p.user_id || "unknown",
                                  name: p.name || p.first_name || "Unknown",
                                  surname: p.surname || p.last_name || "",
                                  email: p.email || "unknown@example.com",
                                  role: p.role || "bireysel_kullanici",
                                })
                              );

                              if (mappedParticipants.length > 0) {
                                setParticipantsToPreview(mappedParticipants);
                                setIsParticipantPreviewOpen(true);
                              } else {
                                toast.info(
                                  "Bu etkinlik için gösterilecek katılımcı bulunmamaktadır."
                                );
                              }
                            } catch (error) {
                              console.error(
                                "Katılımcılar çekilirken hata:",
                                error
                              );
                              toast.error(
                                "Katılımcı listesi alınamadı. Lütfen daha sonra tekrar deneyin."
                              );
                            } finally {
                              setLoading(false);
                            }
                          };

                          fetchParticipants();
                        }}
                        aria-label="Katılımcıları Görüntüle"
                      >
                        {/* Katılımcı sayısını göster - API'den gelen veriyi tercih et */}
                        {event.current_participants || event.participants || 0}/
                        {event.maxParticipants}
                      </button>
                    </TableCell>
                    <TableCell>
                      <Select
                        value={event.status}
                        onValueChange={(value) => {
                          // Status değerini "ACTIVE" | "PENDING" | "REJECTED" | "COMPLETED" formatına çevir
                          const normalizedStatus = value.toUpperCase() as
                            | "ACTIVE"
                            | "PENDING"
                            | "REJECTED"
                            | "COMPLETED";
                          handleStatusChange(event.id, normalizedStatus);
                        }}
                      >
                        <SelectTrigger
                          className={`w-[140px] ${
                            STATUS_COLORS[event.status].bg
                          } ${STATUS_COLORS[event.status].text}`}
                        >
                          <SelectValue placeholder="Durum seçin" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem
                            value="PENDING"
                            className="text-yellow-800 hover:bg-yellow-100"
                          >
                            Beklemede
                          </SelectItem>
                          <SelectItem
                            value="ACTIVE"
                            className="text-green-800 hover:bg-green-100"
                          >
                            Onaylandı
                          </SelectItem>
                          <SelectItem
                            value="REJECTED"
                            className="text-red-800 hover:bg-red-100"
                          >
                            Reddedildi
                          </SelectItem>
                          <SelectItem
                            value="COMPLETED"
                            className="text-gray-800 hover:bg-gray-100"
                          >
                            Tamamlandı
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedEvent(event);
                            setIsEditModalOpen(true);
                          }}
                        >
                          Düzenle
                        </Button>
                        <DeleteEventModal
                          eventName={event.title}
                          onDelete={() => handleDeleteEvent(event.id)}
                        />
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </Card>
=======
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
                          "bg-red-100 text-red-800 hover:bg-red-200"
                      )}
                    >
                      {event.status === "PENDING" && "Onay Bekliyor"}
                      {event.status === "ACTIVE" && "Aktif"}
                      {event.status === "REJECTED" && "Reddedildi"}
                    </Badge>
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
                          className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 font-medium"
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
                          className="border-green-200 text-green-600 hover:bg-green-50 hover:text-green-700 font-medium"
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
>>>>>>> Stashed changes

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
    <div className="container mx-auto py-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold mb-4">Etkinlik Yönetimi</h1>

        {/* Add CreateEventButton */}
        <CreateEventButton
          onSuccess={() => {
            // Refresh pending events when a new event is created
            console.log("New event created, refreshing pending events list");

            // Clear cache to ensure we get fresh data
            fetchEvents(true); // Force refresh of all events

            // Then fetch pending events specifically
            fetchByStatus("PENDING");

            // Update the tab to pending to show the new event
            setActiveTab("pending");
          }}
          variant="outline"
          size="sm"
        />
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
            {activeTab === "all" &&
              "Tüm etkinlikler yükleniyor. Bu işlem büyük sistemlerde performans sorunlarına neden olabilir."}
          </div>

          <TabsList className="grid w-auto grid-cols-5 mb-1 ml-auto">
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
