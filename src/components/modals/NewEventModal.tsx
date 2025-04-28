"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CalendarIcon, Clock, MapPin, Users, Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format, addDays } from "date-fns";
import { tr } from "date-fns/locale";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Event, User } from "@/types/dashboard/eventDashboard";
import { API } from "@/constants";
import Cookies from "js-cookie";

interface NewEventModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: (newEvent: Partial<Event>) => void;
}

const EVENT_CATEGORIES = [
  "Futbol",
  "Basketbol",
  "Voleybol",
  "Tenis",
  "Yüzme",
  "Koşu",
  "Yoga",
  "Bisiklet",
  "Yürüyüş",
];

// Sports category map to backend sport IDs
const SPORT_CATEGORY_MAP: Record<string, number> = {
  Futbol: 1,
  Basketbol: 2,
  Voleybol: 3,
  Tenis: 4,
  Yüzme: 5,
  Koşu: 6,
  Yoga: 7,
  Bisiklet: 8,
  Yürüyüş: 9,
};

// ID ve kategori adını birlikte tutan yapı
interface SportCategory {
  id: number;
  name: string;
}

// Kategori listesi ID ile birlikte
const SPORT_CATEGORIES: SportCategory[] = [
  { id: 4, name: "Futbol" },
  { id: 5, name: "Basketbol" },
  { id: 14, name: "Voleybol" },
  { id: 6, name: "Tenis" },
  { id: 9, name: "Yüzme" },
  { id: 10, name: "Koşu" },
  { id: 11, name: "Yoga" },
  { id: 13, name: "Bisiklet" },
  { id: 15, name: "Yürüyüş" },
];

// Backend API beklediği istek formatı
interface EventRequest {
  title: string;
  description: string;
  sport_id: number;
  event_date: string;
  start_time: string;
  end_time: string;
  location_name: string;
  location_lat: number;
  location_long: number;
  max_participants: number;
}

export function NewEventModal({
  open,
  onOpenChange,
  onSuccess,
}: NewEventModalProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: null as Date | null,
    time: "",
    endTime: "",
    location: "",
    category: "",
    categoryId: 0, // Kategori ID'si için yeni alan
    maxParticipants: 20,
    lat: 90, // Default değer olarak 90 ayarlandı
    long: 180, // Default değer olarak 180 ayarlandı
  });

  // This useEffect resets the form when the modal is closed
  useEffect(() => {
    if (!open) {
      resetForm();
    }
  }, [open]);

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      date: null,
      time: "",
      endTime: "",
      location: "",
      category: "",
      categoryId: 0, // ID sıfırlama
      maxParticipants: 20,
      lat: 90,
      long: 180,
    });
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Form validasyonu
    if (
      !formData.title ||
      !formData.description ||
      !formData.date ||
      !formData.time ||
      !formData.endTime ||
      !formData.location ||
      !formData.category
    ) {
      toast.error("Lütfen tüm gerekli alanları doldurun");
      return;
    }

    // Check if end time is after start time
    const [startHours, startMinutes] = formData.time.split(":").map(Number);
    const [endHours, endMinutes] = formData.endTime.split(":").map(Number);

    if (
      startHours > endHours ||
      (startHours === endHours && startMinutes >= endMinutes)
    ) {
      toast.error("Bitiş saati başlangıç saatinden sonra olmalıdır");
      return;
    }

    setLoading(true);

    try {
      // Create a default user for the organizer
      const defaultUser: User = {
        id: "temp-user-id",
        name: "Sistem",
        surname: "Kullanıcısı",
        role: "antrenor",
        email: "sistem@sportlink.com",
      };

      // Format date and time for the API
      const eventDate = formData.date
        ? format(formData.date, "yyyy-MM-dd")
        : "";

      // Start time handling
      const [hours, minutes] = formData.time.split(":").map(Number);
      const startTime = new Date(formData.date!);
      startTime.setHours(hours, minutes, 0, 0);

      // End time handling - use the actual end time provided by user
      const [endHours, endMinutes] = formData.endTime.split(":").map(Number);
      const endTime = new Date(formData.date!);
      endTime.setHours(endHours, endMinutes, 0, 0);

      // API'nin beklediği formatta request body hazırla
      // Tam olarak şema formatına uygun, ne eksik ne fazla
      const requestBody: EventRequest = {
        title: formData.title,
        description: formData.description,
        sport_id: formData.categoryId, // Doğrudan categoryId kullanılıyor
        event_date: eventDate,
        start_time: startTime.toISOString(),
        end_time: endTime.toISOString(),
        location_name: formData.location,
        location_lat: formData.lat,
        location_long: formData.long,
        max_participants: Number(formData.maxParticipants),
      };

      // Debug için sport_id'yi kontrol et
      console.log("Seçilen kategori adı:", formData.category);
      console.log("Seçilen kategori ID:", formData.categoryId);
      console.log("Gönderilecek sport_id:", requestBody.sport_id);
      console.log("Gönderilen veri:", requestBody);

      // Kategori ID'sinin geçerli olup olmadığını kontrol et
      if (!requestBody.sport_id || requestBody.sport_id <= 0) {
        toast.error("Geçerli bir kategori seçmelisiniz!");
        setLoading(false);
        return;
      }

      // Token'ı Cookie'den al
      const token = Cookies.get("accessToken");

      // API'ye doğrudan bağlan ve gerçek yanıt al
      const response = await fetch("http://localhost:3000/api/events", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "", // Token varsa Authorization header'ına ekle
        },
        body: JSON.stringify(requestBody),
      });

      // Yanıt başarılı değilse hata fırlat
      if (!response.ok) {
        const errorData = await response.json();
        console.error("API hata yanıtı:", errorData);

        // Daha detaylı hata mesajı
        let errorMessage = "Etkinlik oluşturulurken bir hata oluştu";

        if (errorData.message) {
          errorMessage = errorData.message;
        }

        if (errorData.errors && Array.isArray(errorData.errors)) {
          // Varsa validasyon hatalarını göster
          errorMessage += ": " + errorData.errors.join(", ");
        }

        // API yanıtından sport_id ile ilgili spesifik hata var mı diye kontrol et
        if (
          errorMessage.includes("sport_id") ||
          errorMessage.includes("ilişkisel")
        ) {
          errorMessage +=
            " - Sport ID: " +
            requestBody.sport_id +
            " ile ilgili bir sorun olabilir.";
        }

        throw new Error(errorMessage);
      }

      // Başarılı yanıtı al
      const responseData = await response.json();
      console.log("API yanıtı:", responseData);

      // Frontend format için yanıtı dönüştür
      const newEvent: Partial<Event> = {
        id:
          responseData?.data?.event?.id ||
          Math.random().toString(36).substr(2, 9),
        title: formData.title,
        description: formData.description,
        date: formData.date || new Date(),
        time: formData.time,
        location: formData.location,
        maxParticipants: formData.maxParticipants,
        participants: 0,
        status: "PENDING",
        category: formData.category,
        organizer: defaultUser,
      };

      setLoading(false);
      toast.success("Etkinlik başarıyla oluşturuldu");
      resetForm();
      onOpenChange(false);
      if (onSuccess) onSuccess(newEvent);
    } catch (error) {
      setLoading(false);
      console.error("Etkinlik oluşturma hatası:", error);

      // Hata mesajlarını ele al
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Etkinlik oluşturulurken bir hata oluştu");
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[95vw] w-full sm:max-w-[550px] md:max-w-[600px] max-h-[90vh] overflow-y-auto p-4 sm:p-6">
        <DialogHeader className="mb-4">
          <DialogTitle className="text-lg font-semibold">
            Yeni Etkinlik Oluştur
          </DialogTitle>
          <DialogDescription className="text-sm">
            Oluşturacağınız etkinlik, onaylandıktan sonra kullanıcılar
            tarafından görüntülenebilecek.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title field */}
          <div className="space-y-2">
            <Label htmlFor="title" className="text-sm font-medium">
              Etkinlik Başlığı *
            </Label>
            <Input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Örn: Pazar Sabahı Koşusu"
              required
              className="w-full"
            />
          </div>

          {/* Description field */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-medium">
              Etkinlik Açıklaması *
            </Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Etkinlik hakkında detaylı bilgi verin"
              className="min-h-[100px] w-full resize-none"
              required
            />
          </div>

          {/* Date field (full width) */}
          <div className="space-y-2">
            <Label htmlFor="date" className="text-sm font-medium">
              Tarih *
            </Label>
            <div className="mt-1">
              <Input
                id="date"
                name="date"
                type="date"
                value={formData.date ? format(formData.date, "yyyy-MM-dd") : ""}
                onChange={(e) => {
                  if (e.target.value) {
                    const date = new Date(e.target.value);
                    setFormData((prev) => ({ ...prev, date }));
                  } else {
                    setFormData((prev) => ({ ...prev, date: null }));
                  }
                }}
                min={format(new Date(), "yyyy-MM-dd")}
                className="w-full"
                required
              />
            </div>
          </div>

          {/* Time fields in 2 columns */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Start Time field */}
            <div className="space-y-2">
              <Label htmlFor="time" className="text-sm font-medium">
                Başlangıç Saati *
              </Label>
              <Input
                id="time"
                name="time"
                type="time"
                value={formData.time}
                onChange={handleChange}
                className="w-full"
                required
              />
            </div>

            {/* End Time field */}
            <div className="space-y-2">
              <Label htmlFor="endTime" className="text-sm font-medium">
                Bitiş Saati *
              </Label>
              <Input
                id="endTime"
                name="endTime"
                type="time"
                value={formData.endTime}
                onChange={handleChange}
                className="w-full"
                required
              />
            </div>
          </div>

          {/* Location field (full width) */}
          <div className="space-y-2">
            <Label htmlFor="location" className="text-sm font-medium">
              Konum *
            </Label>
            <Input
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="Etkinlik konumu"
              className="w-full"
              required
            />
          </div>

          {/* Category and Max Participants in 2 columns */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Category field */}
            <div className="space-y-2">
              <Label htmlFor="category" className="text-sm font-medium">
                Kategori *
              </Label>
              <Select
                value={formData.category}
                onValueChange={(value) => {
                  // Find the selected category object
                  const selectedCategory = SPORT_CATEGORIES.find(
                    (category) => category.name === value
                  );

                  setFormData((prev) => ({
                    ...prev,
                    category: value,
                    categoryId: selectedCategory ? selectedCategory.id : 0,
                  }));
                }}
              >
                <SelectTrigger id="category" className="w-full">
                  <SelectValue placeholder="Kategori seçin" />
                </SelectTrigger>
                <SelectContent position="popper" className="min-w-[220px]">
                  {SPORT_CATEGORIES.map((category) => (
                    <SelectItem key={category.id} value={category.name}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Max Participants field */}
            <div className="space-y-2">
              <Label htmlFor="maxParticipants" className="text-sm font-medium">
                Maksimum Katılımcı
              </Label>
              <Input
                id="maxParticipants"
                name="maxParticipants"
                type="number"
                min="1"
                max="100"
                value={formData.maxParticipants}
                onChange={handleChange}
                className="w-full"
              />
            </div>
          </div>

          {/* Form Actions */}
          <DialogFooter className="mt-6 flex flex-col sm:flex-row sm:justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
              className="w-full sm:w-auto"
            >
              İptal
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto"
            >
              {loading ? (
                <>
                  <span className="mr-2">Oluşturuluyor...</span>
                  <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
                </>
              ) : (
                "Etkinlik Oluştur"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
