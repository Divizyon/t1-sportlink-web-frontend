"use client";

import { useState } from "react";
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
import { Plus } from "lucide-react";
import { format } from "date-fns";
import { useToast } from "@/components/ui/use-toast";
import { EVENT_SCHEMA, EVENT_STATUS_COLORS } from "@/mockups";
import { User, Event as DashboardEvent, EventStatus } from "@/types/dashboard";
import { EVENT_CATEGORY_OPTIONS } from "@/mockups";

// Kategori renkleri - daha sonra mockups'a taşınabilir
const CATEGORY_COLORS: Record<string, { bg: string; text: string }> = {
  tournament: { bg: "bg-blue-100", text: "text-blue-800" },
  training: { bg: "bg-orange-100", text: "text-orange-800" },
  meeting: { bg: "bg-green-100", text: "text-green-800" },
  sport: { bg: "bg-purple-100", text: "text-purple-800" },
  social: { bg: "bg-cyan-100", text: "text-cyan-800" },
  workshop: { bg: "bg-red-100", text: "text-red-800" },
  competition: { bg: "bg-pink-100", text: "text-pink-800" },
  other: { bg: "bg-gray-100", text: "text-gray-800" },
};

// Renk kodundan background ve text renk sınıflarını oluşturan yardımcı fonksiyon
const getStatusColorClasses = (
  status: string
): { bg: string; text: string } => {
  // Varsayılan değerler
  let bg = "bg-gray-100";
  let text = "text-gray-800";

  switch (status) {
    case "pending":
      bg = "bg-yellow-100";
      text = "text-yellow-800";
      break;
    case "approved":
      bg = "bg-green-100";
      text = "text-green-800";
      break;
    case "rejected":
      bg = "bg-red-100";
      text = "text-red-800";
      break;
    case "completed":
      bg = "bg-blue-100";
      text = "text-blue-800";
      break;
    case "cancelled":
      bg = "bg-gray-100";
      text = "text-gray-800";
      break;
    case "ongoing":
      bg = "bg-purple-100";
      text = "text-purple-800";
      break;
  }

  return { bg, text };
};

// Rol açıklamaları
const ROLE_LABELS: Record<string, string> = {
  bireysel_kullanici: "Bireysel Kullanıcı",
  kulup_uyesi: "Kulüp Üyesi",
  antrenor: "Antrenör",
  tesis_sahibi: "Tesis Sahibi",
};

// Örnek kullanıcılar (Global User tipine uygun - ID number, surname yok)
const sampleUsers: User[] = [
  {
    id: 1, // ID number
    name: "Ahmet Yılmaz",
    role: "antrenor",
    email: "ahmet.yilmaz@sportlink.com",
    status: "active",
    joinDate: "2023-01-15",
  },
  {
    id: 2, // ID number
    name: "Mehmet Demir",
    role: "kulup_uyesi",
    email: "mehmet.demir@sportlink.com",
    status: "active",
    joinDate: "2023-02-10",
  },
  {
    id: 3, // ID number
    name: "Ayşe Kaya",
    role: "tesis_sahibi",
    email: "ayse.kaya@sportlink.com",
    status: "active",
    joinDate: "2023-03-05",
  },
];

// Baş harfleri alma yardımcı fonksiyonu (Sadece name kullan)
const getInitials = (name?: string) => {
  return name?.charAt(0) || "?";
};

// Using the Event interface from EditEventModal for compatibility
interface AppEvent {
  id: string | number;
  title: string;
  description?: string;
  date: Date;
  time: string;
  location: string;
  category: string;
  participants: number;
  maxParticipants: number;
  status: EventStatus;
  organizer?: string;
  image?: string;
  createdAt?: string;
}

// Type for EditEventModal interface to match the component props
type EditEventModalEvent = {
  id: string | number;
  title: string;
  description?: string;
  date: Date;
  time: string;
  location: string;
  category: string;
  participants: number;
  maxParticipants: number;
  status: "pending" | "approved" | "rejected" | "completed";
  organizer?: string;
  image?: string;
};

export default function EventsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [isNewEventModalOpen, setIsNewEventModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<AppEvent | null>(null);
  const { toast } = useToast();

  // Convert the ALL_EVENTS from mock data to the format needed by this component
  const [events, setEvents] = useState<AppEvent[]>(
    EVENT_SCHEMA.events.map((event) => ({
      id: event.id,
      title: event.title,
      description: event.description,
      date: new Date(event.startDate),
      time: event.time,
      location: event.location.name,
      category: event.category,
      participants: event.participants,
      maxParticipants: event.maxParticipants,
      status: event.status as EventStatus,
      organizer: event.organizer.name,
      image: event.image,
      createdAt: event.createdAt,
    }))
  );

  // Filter the events based on user filters
  const filteredEvents = events
    // Check for past approved events and mark them as completed
    .map((event) => {
      const now = new Date();
      const eventDate = new Date(event.date);
      eventDate.setHours(23, 59, 59);

      if (eventDate < now && event.status === "approved") {
        return { ...event, status: "completed" as EventStatus };
      }
      return event;
    })
    // Now apply user filters
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

  const handleEditEvent = (
    id: string | number,
    updatedEvent: Partial<AppEvent>
  ) => {
    setEvents(
      events.map((event) =>
        event.id === id ? { ...event, ...updatedEvent } : event
      )
    );
    toast({
      title: "Başarılı",
      description: "Etkinlik başarıyla güncellendi.",
    });
  };

  const handleDeleteEvent = (id: string | number) => {
    setEvents(events.filter((event) => event.id !== id));
    toast({
      title: "Başarılı",
      description: "Etkinlik başarıyla silindi.",
    });
  };

  const handleAddNewEvent = (newEvent: Partial<AppEvent>) => {
    const eventToAdd: AppEvent = {
      id: Date.now(),
      title: newEvent.title || "",
      description: newEvent.description || "",
      date: new Date(newEvent.date || new Date()),
      time: newEvent.time || "",
      location: newEvent.location || "",
      category: newEvent.category || "",
      participants: 0,
      maxParticipants: newEvent.maxParticipants || 100,
      status: "pending",
      organizer: newEvent.organizer || "Organizatör",
      image: newEvent.image,
      createdAt: new Date().toISOString().split("T")[0],
    };
    setEvents((prevEvents) => [...prevEvents, eventToAdd]);
    toast({
      title: "Başarılı",
      description: "Etkinlik başarıyla oluşturuldu.",
    });
  };

  const handleStatusChange = (
    eventId: string | number,
    newStatus: EventStatus
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
              {filteredEvents.map((event) => (
                <TableRow key={event.id}>
                  <TableCell>
                    <div
                      className="font-medium hover:text-blue-500 hover:underline cursor-pointer"
                      onClick={() => {
                        setSelectedEvent(event);
                        setIsEditModalOpen(true);
                      }}
                    >
                      {event.title}
                    </div>
                    <div className="text-xs text-gray-500 mt-1 line-clamp-1">
                      {event.description}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={`${
                        CATEGORY_COLORS[event.category]?.bg || "bg-gray-100"
                      } ${
                        CATEGORY_COLORS[event.category]?.text || "text-gray-800"
                      } hover:${
                        CATEGORY_COLORS[event.category]?.bg || "bg-gray-100"
                      }`}
                    >
                      {event.category}
                    </Badge>
                  </TableCell>
                  <TableCell>{format(event.date, "dd.MM.yyyy")}</TableCell>
                  <TableCell className="max-w-[200px] truncate">
                    {event.location}
                  </TableCell>
                  <TableCell>{event.organizer}</TableCell>
                  <TableCell>
                    {event.participants}/{event.maxParticipants}
                  </TableCell>
                  <TableCell>
                    <Badge
                      className={`${getStatusColorClasses(event.status).bg} ${
                        getStatusColorClasses(event.status).text
                      }`}
                    >
                      {event.status}
                    </Badge>
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
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>

      {/* Edit modal */}
      {isEditModalOpen && selectedEvent && (
        <EditEventModal
          open={isEditModalOpen}
          onOpenChange={setIsEditModalOpen}
          event={selectedEvent as unknown as EditEventModalEvent}
          onSave={(updatedEvent) => {
            handleEditEvent(
              selectedEvent.id,
              updatedEvent as unknown as Partial<AppEvent>
            );
          }}
          onSuccess={() => {
            setIsEditModalOpen(false);
          }}
        />
      )}

      {/* Information message */}
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
          <span>
            Burada tüm etkinlikleri yönetebilirsiniz. Her etkinliğin durumunu
            değiştirebilir, yeni etkinlik ekleyebilir, var olan etkinlikleri
            düzenleyebilir veya silebilirsiniz.
          </span>
        </div>
      </div>
    </div>
  );
}
