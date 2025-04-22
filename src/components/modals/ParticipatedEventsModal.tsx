"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CalendarDays } from "lucide-react"; // Icon for events

// Simple type for event preview data passed as prop
interface EventPreview {
  id: string | number;
  title: string;
}

interface ParticipatedEventsModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  userName: string;
  events: EventPreview[];
}

export function ParticipatedEventsModal({ 
  isOpen,
  onOpenChange,
  userName,
  events,
}: ParticipatedEventsModalProps) {

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{userName} Katıldığı Etkinlikler</DialogTitle>
          <DialogDescription>
            {userName} kullanıcısının katıldığı etkinlikler aşağıda listelenmiştir.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="h-[300px] w-full rounded-md border p-4 mt-4">
          {events && events.length > 0 ? (
            <ul className="space-y-3">
              {events.map((event) => (
                <li key={event.id} className="flex items-center space-x-3">
                  <CalendarDays className="h-5 w-5 text-gray-500 flex-shrink-0" />
                  <span className="text-sm text-gray-800">
                    {event.title}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-500 text-center py-4">
              Bu kullanıcının katıldığı etkinlik bulunmamaktadır.
            </p>
          )}
        </ScrollArea>
        {/* No footer/buttons needed for just viewing */}
      </DialogContent>
    </Dialog>
  );
} 