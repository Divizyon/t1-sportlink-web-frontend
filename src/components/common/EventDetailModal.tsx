import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Calendar,
  Users,
  Clock,
  MapPin,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useEventManagement } from "@/hooks/useEventManagement";

interface EventDetailModalProps {
  eventId: string | null;
  isOpen: boolean;
  onClose: () => void;
}

export function EventDetailModal({
  eventId,
  isOpen,
  onClose,
}: EventDetailModalProps) {
  const { events, updateEventStatus, fetchByStatus } = useEventManagement({
    autoFetch: false,
  });
  const [isUpdating, setIsUpdating] = useState(false);

  // Find event by ID and add debugging
  const event = events.find((e) => e.id === eventId);
  console.log(`Modal searching for event ID: ${eventId}`);
  console.log(
    `Available events in modal:`,
    events.map((e) => ({ id: e.id, title: e.title, status: e.status }))
  );
  console.log(`Found event:`, event);

  if (!event) {
    // If event is not found, the modal will return null
    // This could happen if the events haven't been loaded yet
    console.log("Event not found in modal");
    return null;
  }

  const handleStatusChange = async (status: string) => {
    try {
      setIsUpdating(true);
      console.log(`Updating event ${event.id} status to: ${status}`);
      const result = await updateEventStatus(event.id, status);
      console.log(`Status update result:`, result);

      // Only refresh pending events - the onClose callback will handle other refreshes
      await fetchByStatus("PENDING");

      onClose();
    } catch (error) {
      console.error("Failed to update event status:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            {event.title}
          </DialogTitle>
          <DialogDescription>
            <Badge
              className={cn(
                "mt-2",
                event.status === "PENDING" && "bg-amber-100 text-amber-800",
                event.status === "ACTIVE" && "bg-green-100 text-green-800",
                event.status === "REJECTED" && "bg-red-100 text-red-800"
              )}
            >
              {event.status === "PENDING" && "Onay Bekliyor"}
              {event.status === "ACTIVE" && "Aktif"}
              {event.status === "REJECTED" && "Reddedildi"}
            </Badge>
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4">
          <div className="p-4 bg-gray-50 rounded-lg">
            <h3 className="font-medium mb-2">Etkinlik Açıklaması</h3>
            <p className="text-gray-700">
              {event.description || "Açıklama bulunmuyor."}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center">
              <Calendar className="h-5 w-5 mr-2 text-gray-500" />
              <div>
                <p className="font-medium">Tarih</p>
                <p className="text-gray-700">{event.date}</p>
              </div>
            </div>
            <div className="flex items-center">
              <Clock className="h-5 w-5 mr-2 text-gray-500" />
              <div>
                <p className="font-medium">Saat</p>
                <p className="text-gray-700">{event.time}</p>
              </div>
            </div>
            <div className="flex items-center">
              <MapPin className="h-5 w-5 mr-2 text-gray-500" />
              <div>
                <p className="font-medium">Konum</p>
                <p className="text-gray-700">{event.location}</p>
              </div>
            </div>
            <div className="flex items-center">
              <Users className="h-5 w-5 mr-2 text-gray-500" />
              <div>
                <p className="font-medium">Katılımcılar</p>
                <p className="text-gray-700">
                  {event.participants}/{event.maxParticipants}
                </p>
              </div>
            </div>
          </div>

          {event.status === "PENDING" && (
            <div className="border-t pt-4 mt-2">
              <h3 className="font-medium mb-3">Etkinlik Onayı</h3>
              <div className="flex gap-3 mt-2">
                <Button
                  variant="outline"
                  className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
                  onClick={() => handleStatusChange("REJECTED")}
                  disabled={isUpdating}
                >
                  <XCircle className="w-4 h-4 mr-2" />
                  Reddet
                </Button>
                <Button
                  variant="outline"
                  className="border-green-200 text-green-600 hover:bg-green-50 hover:text-green-700"
                  onClick={() => handleStatusChange("ACTIVE")}
                  disabled={isUpdating}
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Onayla
                </Button>
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Kapat
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
