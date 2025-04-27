"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";
import { CalendarPlus } from "lucide-react";
import { NewEventModal } from "@/components/modals/NewEventModal";
import { Event } from "@/types/dashboard/eventDashboard";

interface CreateEventButtonProps {
  onSuccess?: (eventId: string) => void;
  variant?: "default" | "outline" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
}

export function CreateEventButton({
  onSuccess,
  variant = "default",
  size = "default",
  className = "",
}: CreateEventButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleEventSuccess = (newEvent: Partial<Event>) => {
    setIsModalOpen(false);
    if (onSuccess && newEvent.id) {
      onSuccess(String(newEvent.id));
    }
  };

  return (
    <>
      <Button
        variant={variant}
        size={size}
        onClick={() => setIsModalOpen(true)}
        className={className}
      >
        <CalendarPlus className="w-4 h-4 mr-2" />
        Yeni Etkinlik Oluştur
      </Button>

      <NewEventModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        onSuccess={handleEventSuccess}
      />
    </>
  );
}
