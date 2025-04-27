"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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

// Kategori renkleri
const CATEGORY_COLORS: Record<string, { bg: string; text: string }> = {
  Futbol: { bg: "bg-blue-100", text: "text-blue-800" },
  Basketbol: { bg: "bg-orange-100", text: "text-orange-800" },
  Voleybol: { bg: "bg-green-100", text: "text-green-800" },
  Tenis: { bg: "bg-purple-100", text: "text-purple-800" },
  Yüzme: { bg: "bg-cyan-100", text: "text-cyan-800" },
  Koşu: { bg: "bg-red-100", text: "text-red-800" },
  Yoga: { bg: "bg-pink-100", text: "text-pink-800" },
  Bisiklet: { bg: "bg-yellow-100", text: "text-yellow-800" },
  Yürüyüş: { bg: "bg-gray-100", text: "text-gray-800" },
  Fitness: { bg: "bg-yellow-100", text: "text-yellow-800" },
  Diğer: { bg: "bg-gray-100", text: "text-gray-800" },
};

// Sport ID ve Kategori eşleştirmesi
const SPORT_CATEGORY_MAP: Record<number, string> = {
  4: "Futbol",
  5: "Basketbol",
  14: "Voleybol",
  6: "Tenis",
  9: "Yüzme",
  10: "Koşu",
  11: "Yoga",
  13: "Bisiklet",
  15: "Yürüyüş",
  8: "Fitness",
};

// Durum renkleri
const STATUS_COLORS: Record<string, { bg: string; text: string }> = {
  ACTIVE: { bg: "bg-yellow-100", text: "text-yellow-800" },
  PENDING: { bg: "bg-green-100", text: "text-green-800" },
  REJECTED: { bg: "bg-red-100", text: "text-red-800" },
  COMPLETED: { bg: "bg-gray-100", text: "text-gray-800" },
  // Eski değerleri uyumluluk için tutalım
  pending: { bg: "bg-yellow-100", text: "text-yellow-800" },
  approved: { bg: "bg-green-100", text: "text-green-800" },
  rejected: { bg: "bg-red-100", text: "text-red-800" },
  completed: { bg: "bg-gray-100", text: "text-gray-800" },
};

// Rol açıklamaları
const ROLE_LABELS: Record<string, string> = {
  bireysel_kullanici: "Bireysel Kullanıcı",
  kulup_uyesi: "Kulüp Üyesi",
  antrenor: "Antrenör",
  tesis_sahibi: "Tesis Sahibi",
};

// Baş harfleri alma yardımcı fonksiyonu
const getInitials = (name?: string, surname?: string) => {
  const firstInitial = name?.charAt(0) || "";
  const secondInitial = surname?.charAt(0) || "";
  return firstInitial + secondInitial || "??";
};

export default function EventsPage() {
  // State for events
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [isNewEventModalOpen, setIsNewEventModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [selectedEventForPreview, setSelectedEventForPreview] =
    useState<Event | null>(null);
  const [participantsToPreview, setParticipantsToPreview] = useState<
    User[] | null
  >(null);
  const [isParticipantPreviewOpen, setIsParticipantPreviewOpen] =
    useState(false);

  // Handle filter changes for subsequent requests
  const prevFiltersRef = useRef({
    searchQuery,
    statusFilter,
    selectedCategories,
  });

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
    }

    // Check if filters actually changed
    if (
      prevFiltersRef.current.searchQuery !== searchQuery ||
      prevFiltersRef.current.statusFilter !== statusFilter ||
      prevFiltersRef.current.selectedCategories.length !==
        selectedCategories.length
    ) {
      // Update ref with new values
      prevFiltersRef.current = {
        searchQuery,
        statusFilter,
        selectedCategories,
      };

      // Debounce filter changes to prevent rapid API calls
      const debounceTimer = setTimeout(() => {
        console.log("Filters changed, fetching new data...");
        fetchEvents();
      }, 500);

      return () => clearTimeout(debounceTimer);
    }
  }, [searchQuery, statusFilter, selectedCategories, fetchEvents]);

  // Load events from localStorage on initial mount
  useEffect(() => {
    // We're removing this localStorage event loading to avoid mock data usage
    // Let's just rely on the API data through fetchEvents()
    console.log("Component mounted - only using data from API");
  }, []); // Empty dependency array ensures this runs only once on mount

  // Save events to localStorage whenever the events state changes
  useEffect(() => {
    // Skip during initial render when events is still empty
    if (events.length === 0) return;

    try {
      console.log("Saving events to storage...");
      const eventsToSave = events.map((event) => ({
        ...event,
        date: event.date.toISOString(),
        organizer: {
          id: event.organizer.id,
        },
        participantList: Array.isArray(event.participantList)
          ? event.participantList.filter((p) => p && p.id)
          : [],
      }));

      localStorage.setItem("events", JSON.stringify(eventsToSave));
      console.log("Events successfully saved to storage.");
    } catch (error) {
      console.error("Error saving events:", error);
    }
  }, [events]);

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
    });

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
      }

      return updatedEvents;
    });

    toast.success("Etkinlik başarıyla oluşturuldu ve onay için gönderildi.");
  };

  // handleStatusChange fonksiyonunu güncelleyelim
  const handleStatusChange = (
    eventId: string | number,
    newStatus: "ACTIVE" | "PENDING" | "REJECTED" | "COMPLETED"
  ) => {
    // Find the event
    const event = events.find((e) => e.id === eventId);

    // Verify that the event exists and is in PENDING status
    if (!event) {
      console.error("Event not found:", eventId);
      toast.error("Etkinlik bulunamadı.");
      return;
    }

    // Only allow changes from PENDING to ACTIVE or REJECTED
    if (event.status !== "PENDING") {
      console.warn("Cannot change status of non-pending event:", event);
      toast.error("Sadece bekleyen etkinliklerin durumu değiştirilebilir.");
      return;
    }

    // Only allow changing to ACTIVE or REJECTED
    if (newStatus !== "ACTIVE" && newStatus !== "REJECTED") {
      console.warn(
        "Can only change pending events to ACTIVE or REJECTED, not:",
        newStatus
      );
      toast.error(
        "Bekleyen etkinlikler sadece onaylanabilir veya reddedilebilir."
      );
      return;
    }

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
    const successMessage =
      newStatus === "ACTIVE"
        ? "Etkinlik başarıyla onaylandı."
        : "Etkinlik reddedildi.";

    // İsteği gönder, ancak arayüzü hemen güncelle (iyimser güncelleme)
    setEvents((prevEvents) =>
      prevEvents.map((event) =>
        event.id === eventId ? { ...event, status: newStatus } : event
      )
    );

    // Kullanıcıya bilgi ver
    toast.success(successMessage);

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
                <Button
                  variant="outline"
                  size="lg"
                  className="mt-4"
                  onClick={() => setDebugMode(!debugMode)}
                >
                  {debugMode ? "Debug Modunu Kapat" : "Debug Modunu Aç"}
                </Button>
              )}
            </div>

            {/* Debug panel in development mode */}
            {debugMode && process.env.NODE_ENV === "development" && (
              <div className="mt-8 text-left">
                <h3 className="text-lg font-bold text-gray-800 mb-2">
                  API Response Debug
                </h3>
                <div className="bg-gray-900 text-gray-100 p-4 rounded-md overflow-auto max-h-[400px] text-xs">
                  <pre>{debugResponse}</pre>
                </div>
              </div>
            )}
          </div>
        )}

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
                      {event.status === "PENDING" ? (
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="bg-green-50 text-green-700 hover:bg-green-100 border-green-200"
                            onClick={() =>
                              handleStatusChange(event.id, "ACTIVE")
                            }
                          >
                            Onayla
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="bg-red-50 text-red-700 hover:bg-red-100 border-red-200"
                            onClick={() =>
                              handleStatusChange(event.id, "REJECTED")
                            }
                          >
                            Reddet
                          </Button>
                        </div>
                      ) : (
                        <div
                          className={`px-3 py-1 rounded-full text-sm font-medium w-fit ${
                            STATUS_COLORS[event.status].bg
                          } ${STATUS_COLORS[event.status].text}`}
                        >
                          {event.status === "ACTIVE"
                            ? "Onaylandı"
                            : event.status === "REJECTED"
                            ? "Reddedildi"
                            : event.status === "COMPLETED"
                            ? "Tamamlandı"
                            : "Beklemede"}
                        </div>
                      )}
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

      {/* Bilgi mesajı */}
      <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex items-center gap-2 text-blue-700">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
              clipRule="evenodd"
            />
          </svg>
          <p className="text-sm font-medium">
            Etkinlik detayına ulaşmak için lütfen etkinlik adına tıklayınız.
          </p>
        </div>
      </div>

      <EditEventModal
        open={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        event={selectedEvent || undefined}
        onSave={(updatedEvent) => {
          if (selectedEvent) {
            // Make sure we have the right type structure for handleEditEvent
            const eventUpdate: Partial<Omit<Event, "organizer">> & {
              organizer?: Partial<User>;
            } = {
              ...updatedEvent,
              // Ensure organizer is handled correctly if it exists
              ...(updatedEvent.organizer && {
                organizer:
                  typeof updatedEvent.organizer === "string"
                    ? { id: updatedEvent.organizer }
                    : updatedEvent.organizer,
              }),
            };

            handleEditEvent(selectedEvent.id, eventUpdate);
          }
        }}
        onSuccess={() => {
          setIsEditModalOpen(false);
          setSelectedEvent(null);
        }}
      />

      {selectedEventForPreview && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4 shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Etkinlik Açıklaması
              </h3>
              <button
                onClick={() => setSelectedEventForPreview(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-700 whitespace-pre-wrap">
                {selectedEventForPreview.description}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Participant Preview Dialog */}
      <Dialog
        open={isParticipantPreviewOpen}
        onOpenChange={setIsParticipantPreviewOpen}
      >
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Katılımcı Listesi</DialogTitle>
            <DialogDescription>
              Bu etkinliğe katılan kullanıcılar listelenmektedir.
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="h-[300px] w-full rounded-md border p-4 mt-4">
            {participantsToPreview && participantsToPreview.length > 0 ? (
              <ul className="space-y-3">
                {participantsToPreview.map((user) => (
                  <li key={user.id} className="flex items-center space-x-3">
                    <Avatar>
                      <AvatarImage
                        src={user.avatar}
                        alt={`${user.name} ${user.surname}`}
                      />
                      <AvatarFallback>
                        {getInitials(user.name, user.surname)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <span className="font-medium text-sm text-gray-900">
                        {user.name} {user.surname}
                      </span>
                      <span className="text-xs text-gray-500">
                        {user.email}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-500 text-center py-4">
                Gösterilecek katılımcı bulunmamaktadır.
              </p>
            )}
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  );
}
