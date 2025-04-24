"use client";

import { useState, useEffect } from "react";
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
import { Plus, ChevronRight } from "lucide-react";
import { format } from "date-fns";
import { useToast } from "@/components/ui/use-toast";
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

// Define User interface correctly
interface User {
  id: string;
  name: string;
  surname: string;
  role: "bireysel_kullanici" | "kulup_uyesi" | "antrenor" | "tesis_sahibi";
  email: string;
  avatar?: string;
}

// Define Event interface correctly
interface Event {
  id: string | number;
  title: string;
  description: string;
  date: Date;
  time: string;
  location: string;
  category: string;
  participants: number;
  maxParticipants: number;
  status: "pending" | "approved" | "rejected" | "completed";
  organizer: User;
  image?: string;
  participantList?: User[];
}

// Kategori renkleri
const CATEGORY_COLORS: Record<string, { bg: string; text: string }> = {
  Futbol: { bg: "bg-blue-100", text: "text-blue-800" },
  Basketbol: { bg: "bg-orange-100", text: "text-orange-800" },
  Voleybol: { bg: "bg-green-100", text: "text-green-800" },
  Tenis: { bg: "bg-purple-100", text: "text-purple-800" },
  Yüzme: { bg: "bg-cyan-100", text: "text-cyan-800" },
  Koşu: { bg: "bg-red-100", text: "text-red-800" },
  Yoga: { bg: "bg-pink-100", text: "text-pink-800" },
  Fitness: { bg: "bg-yellow-100", text: "text-yellow-800" },
  Diğer: { bg: "bg-gray-100", text: "text-gray-800" },
};

// Durum renkleri
const STATUS_COLORS: Record<string, { bg: string; text: string }> = {
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

// Örnek kullanıcılar
const sampleUsers: User[] = [
  {
    id: "1",
    name: "Ahmet",
    surname: "Yılmaz",
    role: "antrenor",
    email: "ahmet.yilmaz@sportlink.com",
  },
  {
    id: "2",
    name: "Mehmet",
    surname: "Demir",
    role: "kulup_uyesi",
    email: "mehmet.demir@sportlink.com",
  },
  {
    id: "3",
    name: "Ayşe",
    surname: "Kaya",
    role: "tesis_sahibi",
    email: "ayse.kaya@sportlink.com",
  },
];

// Baş harfleri alma yardımcı fonksiyonu
const getInitials = (name?: string, surname?: string) => {
  const firstInitial = name?.charAt(0) || "";
  const secondInitial = surname?.charAt(0) || "";
  return firstInitial + secondInitial || "??";
};

export default function EventsPage() {
  // Default events for fallback
  const defaultEvents: Event[] = [
    {
      id: "1",
      title: "Futbol Turnuvası",
      description:
        "Amatör futbol takımları arasında düzenlenecek olan dostluk turnuvası. Her yaştan futbolsever katılabilir. Takımlar 7 kişiden oluşacaktır.",
      date: new Date("2024-04-15"),
      time: "14:00",
      location: "Merkez Stadyum, Konya",
      maxParticipants: 100,
      participants: 3,
      status: "completed",
      category: "Futbol",
      organizer: sampleUsers[0],
      participantList: [
        {
          id: "p1",
          name: "Ali",
          surname: "Veli",
          role: "bireysel_kullanici",
          email: "ali@veli.com",
        },
        {
          id: "p2",
          name: "Zeynep",
          surname: "Çalışkan",
          role: "kulup_uyesi",
          email: "z@c.com",
        },
        sampleUsers[1],
      ],
    },
    {
      id: "2",
      title: "Yoga ve Meditasyon",
      description:
        "Stresli şehir hayatından uzaklaşıp, doğayla iç içe yoga ve meditasyon deneyimi. Tüm seviyeler için uygundur.",
      date: new Date("2024-04-20"),
      time: "09:00",
      location: "Meram Ormanı, Konya",
      maxParticipants: 30,
      participants: 1,
      status: "pending",
      category: "Yoga",
      organizer: sampleUsers[1],
      participantList: [sampleUsers[0]],
    },
    {
      id: "3",
      title: "Basketbol Eğitim Kampı",
      description:
        "Profesyonel antrenörler eşliğinde 3 günlük yoğun basketbol eğitimi. Temel teknikler, taktikler ve maç stratejileri öğretilecektir.",
      date: new Date("2024-04-25"),
      time: "10:00",
      location: "Spor Kompleksi, Konya",
      maxParticipants: 40,
      participants: 0,
      status: "completed",
      category: "Basketbol",
      organizer: sampleUsers[2],
      participantList: [],
    },
    {
      id: "4",
      title: "Yüzme",
      description: "Temel teknikler, taktikler ve stratejiler öğretilecektir.",
      date: new Date("2024-04-25"),
      time: "10:00",
      location: "Spor Kompleksi, Konya",
      maxParticipants: 40,
      participants: 0,
      status: "completed",
      category: "Yüzme",
      organizer: sampleUsers[2],
    },
    {
      id: "5",
      title: "Tenis Maçı",
      description:
        "Profesyonel antrenörler eşliğinde 3 günlük yoğun basketbol eğitimi. Temel teknikler, taktikler ve maç stratejileri öğretilecektir.",
      date: new Date("2024-04-25"),
      time: "10:00",
      location: "Spor Kompleksi, Konya",
      maxParticipants: 40,
      participants: 2,
      status: "completed",
      category: "Tenis",
      organizer: sampleUsers[2],
      participantList: [sampleUsers[0], sampleUsers[1]],
    },
  ];

  // State for events
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch events from API
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
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
          setEvents(defaultEvents);
          setLoading(false);
          return;
        }

        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }
        const data = await response.json();

        if (data.status === "success" && Array.isArray(data.data?.events)) {
          // Map backend data to frontend format
          const mappedEvents: Event[] = data.data.events.map((event: any) => ({
            id: event.id,
            title: event.title,
            description: event.description || "",
            date: new Date(event.event_date),
            time: event.start_time
              ? event.start_time.split("T")[1]?.substring(0, 5)
              : "00:00",
            location: event.location_name,
            category: event.sport_name || "Diğer",
            participants: event.participant_count || 0,
            maxParticipants: event.max_participants,
            status: mapBackendStatus(event.status),
            organizer: {
              id: event.creator_id,
              name: event.creator_name?.split(" ")[0] || "Unknown",
              surname: event.creator_name?.split(" ")[1] || "",
              role: event.creator_role || "bireysel_kullanici",
              email: event.creator_email || `${event.creator_id}@example.com`,
            },
            participantList: event.participants || [],
          }));

          console.log("Filtered events before rendering:", mappedEvents);
          setEvents(mappedEvents);
        } else {
          console.warn("API returned invalid format, using default events");
          setEvents(defaultEvents);
        }
      } catch (err) {
        console.error("Error fetching events:", err);
        setError(err instanceof Error ? err.message : "Unknown error");
        setEvents(defaultEvents); // Fallback to default events
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  // Map backend status to frontend status
  const mapBackendStatus = (
    backendStatus: string
  ): "pending" | "approved" | "rejected" | "completed" => {
    const statusMap: Record<
      string,
      "pending" | "approved" | "rejected" | "completed"
    > = {
      ACTIVE: "approved",
      PENDING: "pending",
      CANCELLED: "rejected",
      COMPLETED: "completed",
    };
    return statusMap[backendStatus] || "pending";
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
  const { toast } = useToast();

  // Load events from localStorage on initial mount
  useEffect(() => {
    console.log("Attempting to load events from localStorage on mount...");
    const savedEvents = localStorage.getItem("events");
    if (savedEvents) {
      try {
        const parsedEvents = JSON.parse(savedEvents);
        console.log("Loaded raw events from storage:", parsedEvents);

        // Process loaded events: ensure correct types and add missing participantList
        const processedEvents = parsedEvents.map((loadedEvent: any): Event => {
          console.log(`Processing loaded event ID: ${loadedEvent.id}`); // Log event being processed

          // Find the corresponding default event, if it exists
          const defaultEvent = defaultEvents.find(
            (de) => de.id === loadedEvent.id
          );

          const organizer =
            sampleUsers.find((user) => user.id === loadedEvent.organizer?.id) ||
            sampleUsers[0];

          // Determine the definitive participantList
          let finalParticipantList: User[] = [];
          const loadedList = loadedEvent.participantList;
          console.log(
            `  Raw loadedList from storage for ${loadedEvent.id}:`,
            loadedList
          ); // Log raw list
          console.log(
            `  Default participantList for ${loadedEvent.id}:`,
            defaultEvent?.participantList
          ); // Log default list

          if (Array.isArray(loadedList) && loadedList.length > 0) {
            console.log(`  Processing loaded list for ${loadedEvent.id}...`);
            // Process loaded list: find full User objects and filter out failures
            finalParticipantList = loadedList
              .map((p: any) => {
                const foundUser = sampleUsers.find((u) => u.id === p?.id);
                console.log(
                  `    Mapping participant ID ${p?.id}: Found user ->`,
                  foundUser
                    ? `${foundUser.name} ${foundUser.surname}`
                    : "Not Found"
                );
                return foundUser;
              })
              .filter((user): user is User => Boolean(user)); // Use type guard to ensure User[] type
          } else if (
            defaultEvent?.participantList &&
            defaultEvent.participantList.length > 0
          ) {
            // If loaded data lacks a list, but default has one, use the default
            console.log(
              `  Event ${loadedEvent.id} missing list in storage, using default list.`
            );
            finalParticipantList = defaultEvent.participantList;
          } else {
            console.log(
              `  No participant list found in loaded or default for ${loadedEvent.id}.`
            );
          }

          // Ensure organizer is a proper User object
          const finalOrganizer =
            sampleUsers.find((user) => user.id === loadedEvent.organizer?.id) ||
            defaultEvent?.organizer ||
            sampleUsers[0];

          console.log(
            `  Final participantList for ${loadedEvent.id}:`,
            finalParticipantList
          ); // Log final list
          const finalParticipantsCount = finalParticipantList.length;
          console.log(
            `  Final participants count for ${loadedEvent.id}: ${finalParticipantsCount}`
          ); // Log the count

          return {
            // Base properties from loaded or default event
            id: loadedEvent.id || defaultEvent?.id || String(Date.now()),
            title: loadedEvent.title || defaultEvent?.title || "",
            description:
              loadedEvent.description || defaultEvent?.description || "",
            date: new Date(
              loadedEvent.date || defaultEvent?.date || Date.now()
            ),
            time: loadedEvent.time || defaultEvent?.time || "",
            location: loadedEvent.location || defaultEvent?.location || "",
            category: loadedEvent.category || defaultEvent?.category || "Diğer",
            maxParticipants:
              loadedEvent.maxParticipants ||
              defaultEvent?.maxParticipants ||
              100,
            status: loadedEvent.status || defaultEvent?.status || "pending",
            image: loadedEvent.image || defaultEvent?.image,
            // Use processed data
            organizer: finalOrganizer,
            participantList: finalParticipantList,
            participants: finalParticipantsCount, // Use the calculated count
          };
        });

        console.log("Processed events from storage:", processedEvents);
        setEvents(processedEvents);
      } catch (error) {
        console.error("Error parsing saved events:", error);
        // Optional: Clear broken storage item?
        // localStorage.removeItem('events');
        // Keep defaultEvents if parsing fails
        setEvents(defaultEvents);
      }
    } else {
      console.log("No saved events found in localStorage, using defaults.");
      setEvents(defaultEvents); // Ensure state is set even if nothing in storage
    }
  }, []); // Empty dependency array ensures this runs only once on mount

  // Save events to localStorage whenever the events state changes
  useEffect(() => {
    try {
      console.log("Attempting to save events to storage..."); // Add log before saving
      const eventsToSave = events.map((event) => ({
        ...event,
        date: event.date.toISOString(), // Keep date as ISO string
        organizer: {
          id: event.organizer.id, // Store only organizer ID
        },
        // Store full participant objects (ensure they are valid)
        participantList: Array.isArray(event.participantList)
          ? event.participantList.filter((p) => p && p.id)
          : [],
      }));

      // Add log to show what's being saved
      console.log("Data being saved to localStorage:", eventsToSave);

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
      if (eventDate < now && event.status === "approved") {
        return { ...event, status: "completed" as const };
      }
      return event;
    })
    // Sonra filtreleme yap
    .filter((event) => {
      const matchesSearch =
        event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.location.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus =
        statusFilter === "all" || event.status === statusFilter;
      const matchesCategories =
        selectedCategories.length === 0 ||
        selectedCategories.includes(event.category);

      return matchesSearch && matchesStatus && matchesCategories;
    });

  // Add log to inspect filteredEvents before render
  console.log("Filtered events before rendering:", filteredEvents);

  const handleEditEvent = (
    id: string | number,
    updatedEvent: Partial<Event>
  ) => {
    setEvents(
      events.map((event) =>
        event.id === id ? { ...event, ...updatedEvent } : event
      )
    );
  };

  const handleDeleteEvent = (id: string | number) => {
    setEvents(events.filter((event) => event.id !== id));
  };

  const handleAddNewEvent = (newEvent: Partial<Event>) => {
    console.log("Received new event data:", newEvent);

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
      status: newEvent.status || "pending", // Ensure status exists
      organizer: newEvent.organizer || sampleUsers[0], // Ensure organizer exists, default if needed
      image: newEvent.image,
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

    toast({
      title: "Başarılı",
      description: "Etkinlik başarıyla oluşturuldu ve onay için gönderildi.",
    });
  };

  // handleStatusChange fonksiyonunu güncelleyelim
  const handleStatusChange = (
    eventId: string | number,
    newStatus: Event["status"]
  ) => {
    setEvents((prevEvents) =>
      prevEvents.map((event) =>
        event.id === eventId ? { ...event, status: newStatus } : event
      )
    );

    toast({
      title: "Durum Güncellendi",
      description: `Etkinlik durumu "${
        newStatus === "completed"
          ? "Tamamlandı"
          : newStatus === "approved"
          ? "Onaylandı"
          : newStatus === "rejected"
          ? "Reddedildi"
          : "Beklemede"
      }" olarak güncellendi.`,
    });

    if (newStatus === "rejected") {
      toast({
        title: "Etkinlik Reddedildi",
        description:
          "Etkinliğiniz yönetici tarafından reddedildi. Lütfen etkinlik kurallarını kontrol edin.",
        variant: "destructive",
      });
    }
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
        <div className="flex flex-col md:flex-row gap-4 mb-4">
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
                              className={`font-medium ${
                                CATEGORY_COLORS[event.category].text
                              } hover:${
                                CATEGORY_COLORS[event.category].text
                              } hover:underline cursor-pointer text-left`}
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
                          console.log(
                            "Event participantList:",
                            event.participantList
                          );
                          if (
                            event.participantList &&
                            event.participantList.length > 0
                          ) {
                            console.log(
                              "Setting participants and opening dialog..."
                            );
                            setParticipantsToPreview(event.participantList);
                            setIsParticipantPreviewOpen(true);
                          } else {
                            console.log(
                              "No participants to show or list is empty."
                            );
                            // Optionally show a toast if no participants
                            toast({
                              title: "Bilgi",
                              description:
                                "Bu etkinlik için gösterilecek katılımcı bulunmamaktadır.",
                            });
                          }
                        }}
                        disabled={
                          !event.participantList ||
                          event.participantList.length === 0
                        } // Disable if no list or empty
                        title={
                          event.participantList &&
                          event.participantList.length > 0
                            ? "Katılımcıları Görüntüle"
                            : "Katılımcı Yok"
                        }
                      >
                        {event.participants}/{event.maxParticipants}
                      </button>
                    </TableCell>
                    <TableCell>
                      <Select
                        value={event.status}
                        onValueChange={(value: Event["status"]) =>
                          handleStatusChange(event.id, value)
                        }
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
                            value="pending"
                            className="text-yellow-800 hover:bg-yellow-100"
                          >
                            Beklemede
                          </SelectItem>
                          <SelectItem
                            value="approved"
                            className="text-green-800 hover:bg-green-100"
                          >
                            Onaylandı
                          </SelectItem>
                          <SelectItem
                            value="rejected"
                            className="text-red-800 hover:bg-red-100"
                          >
                            Reddedildi
                          </SelectItem>
                          <SelectItem
                            value="completed"
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
            handleEditEvent(selectedEvent.id, updatedEvent);
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
