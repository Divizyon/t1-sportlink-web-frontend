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

// Rename our Event interface to avoid conflicts
interface EventItem {
  id: string;
  name: string;
  date: string;
  location: string;
  capacity: number;
  participants: number;
  status: "active" | "completed" | "cancelled";
  category: string;
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

export default function EventsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [isNewEventModalOpen, setIsNewEventModalOpen] = useState(false);
  const [editEventId, setEditEventId] = useState<number | null>(null);
  const [events, setEvents] = useState<EventItem[]>([
    {
      id: "1",
      name: "Futbol Turnuvası",
      date: "2024-03-15",
      location: "Merkez Stadyum",
      capacity: 100,
      participants: 75,
      status: "active",
      category: "Futbol",
    },
    {
      id: "2",
      name: "Basketbol Maçı",
      date: "2024-03-20",
      location: "Spor Salonu",
      capacity: 50,
      participants: 30,
      status: "active",
      category: "Basketbol",
    },
  ]);

  const filteredEvents = events.filter((event) => {
    const matchesSearch =
      event.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || event.status === statusFilter;
    const matchesCategories =
      selectedCategories.length === 0 ||
      selectedCategories.includes(event.category);
    return matchesSearch && matchesStatus && matchesCategories;
  });

  const handleEditEvent = (id: string, updatedEvent: Partial<EventItem>) => {
    setEvents(
      events.map((event) =>
        event.id === id ? { ...event, ...updatedEvent } : event
      )
    );
  };

  const handleDeleteEvent = (id: string) => {
    setEvents(events.filter((event) => event.id !== id));
  };

  const handleAddNewEvent = (newEvent: any) => {
    const eventItem: EventItem = {
      id: newEvent.id,
      name: newEvent.name,
      date: newEvent.date,
      location: newEvent.location,
      capacity: newEvent.capacity,
      participants: newEvent.participants,
      status: newEvent.status as "active" | "completed" | "cancelled",
      category: newEvent.category,
    };
    setEvents((prevEvents) => [...prevEvents, eventItem]);
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
        onSuccess={handleAddNewEvent}
      />

      <Card className="p-4">
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <Input
            placeholder="Etkinlik ara..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-sm"
          />
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Durum" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tümü</SelectItem>
              <SelectItem value="active">Aktif</SelectItem>
              <SelectItem value="completed">Tamamlandı</SelectItem>
              <SelectItem value="cancelled">İptal Edildi</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Etkinlik Adı</TableHead>
                <TableHead>Tarih</TableHead>
                <TableHead>Konum</TableHead>
                <TableHead>Katılımcılar</TableHead>
                <TableHead>Durum</TableHead>
                <TableHead className="text-right">İşlemler</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEvents.map((event) => (
                <TableRow key={event.id}>
                  <TableCell className="font-medium">{event.name}</TableCell>
                  <TableCell>{event.date}</TableCell>
                  <TableCell>{event.location}</TableCell>
                  <TableCell>
                    {event.participants}/{event.capacity}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        event.status === "active" ? "default" : "secondary"
                      }
                    >
                      {event.status === "active"
                        ? "Aktif"
                        : event.status === "completed"
                        ? "Tamamlandı"
                        : "İptal Edildi"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setEditEventId(Number(event.id))}
                      >
                        Düzenle
                      </Button>
                      <DeleteEventModal
                        eventName={event.name}
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

      {editEventId !== null && (
        <EditEventModal
          eventId={editEventId}
          open={true}
          onOpenChange={(open) => {
            if (!open) setEditEventId(null);
          }}
        />
      )}
    </div>
  );
}
