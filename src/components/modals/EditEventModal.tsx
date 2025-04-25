"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CalendarIcon, Users } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { Event, User } from "@/types/dashboard/eventDashboard";

// Create a modal-specific version of Event that can work with our form
interface ModalEvent extends Omit<Event, "organizer"> {
  organizer?: string | User;
}

interface EditEventModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
  event?: Event;
  onSave?: (updatedEvent: Partial<Event>) => void;
}

// Event kategori listesi
const categories = [
  "Futbol",
  "Basketbol",
  "Voleybol",
  "Tenis",
  "Yüzme",
  "Koşu",
  "Diğer",
];

export function EditEventModal({
  open,
  onOpenChange,
  onSuccess,
  event,
  onSave,
}: EditEventModalProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<Partial<ModalEvent>>({});
  const [date, setDate] = useState<Date>();
  const { toast } = useToast();

  useEffect(() => {
    if (event && open) {
      // Convert the User organizer to a string id for the form
      const organizerId =
        typeof event.organizer === "string"
          ? event.organizer
          : event.organizer?.id;

      setFormData({
        ...event,
        organizer: organizerId,
      });
      setDate(new Date(event.date));
    } else {
      setFormData({});
      setDate(undefined);
    }
  }, [event, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // TODO: Replace with actual API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      if (onSave) {
        // Prepare the data to match the expected Event type
        const { organizer: formOrganizer, ...otherFormData } = formData;

        const updatedData: Partial<Event> = {
          ...otherFormData,
          date: date || new Date(),
        };

        // Only include organizer if it's a User object or we can convert it
        if (event?.organizer && typeof event.organizer !== "string") {
          // Use the original organizer object as a base, with any updates if available
          if (typeof formOrganizer === "string") {
            // If we have just an ID, keep the original organizer
            updatedData.organizer = event.organizer;
          } else if (formOrganizer && typeof formOrganizer !== "string") {
            // If we have an updated organizer object
            updatedData.organizer = formOrganizer;
          }
        }

        onSave(updatedData);
      }

      toast({
        title: "Başarılı",
        description: "Etkinlik başarıyla güncellendi.",
      });

      if (onSuccess) onSuccess();
      onOpenChange(false);
    } catch (error) {
      toast({
        title: "Hata",
        description: "Etkinlik güncellenirken bir hata oluştu.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!event && open) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[95vw] w-full sm:max-w-[525px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Etkinlik Düzenle</DialogTitle>
          <DialogDescription>
            Etkinlik detaylarını güncelleyin.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="title" className="text-right w-[100px]">
                Etkinlik Adı
              </Label>
              <Input
                id="title"
                placeholder="Etkinlik adını girin"
                className="col-span-3"
                value={formData.title || ""}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, title: e.target.value }))
                }
                required
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="category" className="text-right w-[100px]">
                Kategori
              </Label>
              <Select
                value={formData.category}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, category: value }))
                }
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Kategori seçin" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="date" className="text-right w-[100px]">
                Tarih
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "col-span-3 justify-start text-left font-normal",
                      !date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : "Tarih seçin"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="location" className="text-right w-[100px]">
                Konum
              </Label>
              <Input
                id="location"
                placeholder="Etkinlik konumunu girin"
                className="col-span-3"
                value={formData.location || ""}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, location: e.target.value }))
                }
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="maxParticipants" className="w-[100px]">
                Maksimum Katılımcı
              </Label>
              <Input
                id="maxParticipants"
                type="number"
                placeholder="Maksimum katılımcı sayısı"
                className="col-span-3"
                value={formData.maxParticipants || ""}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    maxParticipants: parseInt(e.target.value) || 0,
                  }))
                }
              />
            </div>

            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="description" className="text-right w-[100px]">
                Açıklama
              </Label>
              <Textarea
                id="description"
                placeholder="Etkinlik açıklaması"
                className="col-span-3"
                rows={3}
                value={formData.description || ""}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
              />
            </div>
          </div>

          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="w-full sm:w-auto"
            >
              İptal
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto"
            >
              {loading ? "Kaydediliyor..." : "Kaydet"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
