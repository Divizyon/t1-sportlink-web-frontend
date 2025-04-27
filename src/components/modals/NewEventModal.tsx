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
  const [datePickerOpen, setDatePickerOpen] = useState(false);
  const dateButtonRef = useRef<HTMLButtonElement>(null);

  // Bu useEffect, modal kapandığında formu sıfırlar
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
      <DialogContent className="max-w-[95vw] w-full sm:max-w-[600px] md:max-w-[650px] lg:max-w-[900px] xl:max-w-[1100px] h-[90vh] sm:h-[85vh] md:h-[80vh] overflow-y-auto p-4 sm:p-6">
        <DialogHeader className="mb-4 md:mb-6">
          <DialogTitle className="text-lg md:text-xl font-semibold">
            Yeni Etkinlik Oluştur
          </DialogTitle>
          <DialogDescription className="text-sm md:text-base">
            Oluşturacağınız etkinlik, onaylandıktan sonra kullanıcılar
            tarafından görüntülenebilecek.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
          <div className="space-y-2 md:space-y-4">
            <Label htmlFor="title" className="text-sm md:text-base font-medium">
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

          <div className="space-y-2 md:space-y-4">
            <Label
              htmlFor="description"
              className="text-sm md:text-base font-medium"
            >
              Etkinlik Açıklaması *
            </Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Etkinlik hakkında detaylı bilgi verin"
              className="min-h-[100px] md:min-h-[150px] w-full resize-none"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label
                htmlFor="date"
                className="text-sm md:text-base font-medium"
              >
                Tarih *
              </Label>
              <div className="relative">
                {/* Takvim için basit bir input grubu */}
                <div className="flex">
                  <div className="relative flex-grow">
                    <Input
                      id="date"
                      name="date"
                      value={
                        formData.date ? format(formData.date, "dd.MM.yyyy") : ""
                      }
                      readOnly
                      placeholder="Tarih seçin"
                      className="pl-10 w-full cursor-pointer"
                      onClick={() => setDatePickerOpen(true)}
                    />
                    <CalendarIcon className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    ref={dateButtonRef}
                    onClick={() => setDatePickerOpen(true)}
                    className="ml-1"
                  >
                    <CalendarIcon className="h-4 w-4" />
                  </Button>
                </div>

                {/* Takvim Popup */}
                {datePickerOpen && (
                  <div className="absolute z-50 top-full left-0 mt-2 bg-white rounded-md border shadow-lg p-4 w-[300px]">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-medium">Tarih Seçin</h4>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => setDatePickerOpen(false)}
                        className="h-6 w-6 rounded-full"
                      >
                        ✕
                      </Button>
                    </div>
                    <Calendar
                      mode="single"
                      selected={formData.date || undefined}
                      onSelect={(date) => {
                        console.log("Seçilen tarih:", date);
                        if (date) {
                          setFormData((prev) => ({ ...prev, date }));
                        }
                      }}
                      disabled={(date) => {
                        // Allow selecting today's date
                        const today = new Date();
                        today.setHours(0, 0, 0, 0);
                        return date < today;
                      }}
                      initialFocus
                    />
                    <div className="flex justify-end gap-2 mt-4 pt-2 border-t">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setDatePickerOpen(false)}
                      >
                        İptal
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        onClick={() => {
                          if (formData.date) {
                            setDatePickerOpen(false);
                          } else {
                            toast.error("Lütfen bir tarih seçin");
                          }
                        }}
                      >
                        Seç
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="time"
                className="text-sm md:text-base font-medium"
              >
                Başlangıç Saati *
              </Label>
              <div className="flex items-center relative">
                <Clock className="absolute left-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="time"
                  name="time"
                  type="time"
                  value={formData.time}
                  onChange={handleChange}
                  className="pl-10 w-full"
                  required
                />
              </div>
            </div>
          </div>

          <div className="space-y-2 md:space-y-4">
            <Label
              htmlFor="endTime"
              className="text-sm md:text-base font-medium"
            >
              Bitiş Saati *
            </Label>
            <div className="flex items-center relative">
              <Clock className="absolute left-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="endTime"
                name="endTime"
                type="time"
                value={formData.endTime}
                onChange={handleChange}
                className="pl-10 w-full"
                required
              />
            </div>
          </div>

          <div className="space-y-2 md:space-y-4">
            <Label
              htmlFor="location"
              className="text-sm md:text-base font-medium"
            >
              Konum *
            </Label>
            <div className="flex items-center relative">
              <MapPin className="absolute left-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="Etkinlik konumu"
                className="pl-10 w-full"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label
                htmlFor="category"
                className="text-sm md:text-base font-medium"
              >
                Kategori *
              </Label>
              <Select
                value={formData.category}
                onValueChange={(value) => {
                  // ID ve kategori adını birlikte ayarla
                  const selectedCategory = SPORT_CATEGORIES.find(
                    (cat) => cat.name === value
                  );
                  console.log("Seçilen kategori:", value);
                  console.log("Bulunan kategori objesi:", selectedCategory);

                  const categoryId = selectedCategory?.id || 0;
                  console.log("Ayarlanacak kategori ID:", categoryId);

                  setFormData((prev) => ({
                    ...prev,
                    category: value,
                    categoryId: categoryId,
                  }));
                  console.log("Form state güncellendi");
                }}
                required
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Kategori seçin" />
                </SelectTrigger>
                <SelectContent>
                  {SPORT_CATEGORIES.map((category) => (
                    <SelectItem key={category.id} value={category.name}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="maxParticipants"
                className="text-sm md:text-base font-medium"
              >
                Maksimum Katılımcı Sayısı *
              </Label>
              <div className="flex items-center relative">
                <Users className="absolute left-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="maxParticipants"
                  name="maxParticipants"
                  type="number"
                  min={1}
                  max={1000}
                  value={formData.maxParticipants}
                  onChange={handleChange}
                  className="pl-10 w-full"
                  required
                />
              </div>
            </div>
          </div>

          <DialogFooter className="mt-6 sm:mt-8">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                resetForm();
                onOpenChange(false);
              }}
              className="w-full sm:w-auto"
            >
              İptal
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto"
            >
              {loading ? "Oluşturuluyor..." : "Oluştur"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
