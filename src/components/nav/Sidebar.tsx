"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  ChevronRight,
  Plus,
  Flag,
  Settings,
  Shield,
  Newspaper,
} from "lucide-react";
import { REPORTS } from "@/mocks/reports";
import { toast } from "sonner";
import { NewEventModal } from "@/components/modals/NewEventModal";

export function Sidebar() {
  const [openEvents, setOpenEvents] = useState(false);
  const [isNewEventModalOpen, setIsNewEventModalOpen] = useState(false);

  const handleNewEventSuccess = (newEvent: any) => {
    setIsNewEventModalOpen(false);
    toast.success("Yeni etkinlik başarıyla oluşturuldu");
  };

  return (
    <div className="space-y-1">
      <Button
        variant="ghost"
        className="w-full justify-start"
        onClick={() => setOpenEvents(!openEvents)}
      >
        <Calendar className="mr-2 h-4 w-4" />
        Etkinlikler
        <ChevronRight
          className={`ml-auto h-4 w-4 transition-transform ${
            openEvents ? "rotate-90" : ""
          }`}
        />
      </Button>
      {openEvents && (
        <div className="ml-4 space-y-1">
          <Button variant="ghost" className="w-full justify-start" asChild>
            <Link href="/dashboard/events">
              <Calendar className="mr-2 h-4 w-4" />
              Tüm Etkinlikler
            </Link>
          </Button>

          <Button
            variant="ghost"
            size="default"
            className="w-full justify-start"
            onClick={() => setIsNewEventModalOpen(true)}
          >
            <Plus className="w-4 h-4 mr-2" />
            Yeni Etkinlik
          </Button>

          <Button variant="ghost" className="w-full justify-start" asChild>
            <Link href="/dashboard/reports">
              <Flag className="mr-2 h-4 w-4" />
              Raporlar
              <Badge className="ml-1 bg-red-600 text-[10px] px-1 h-4 min-w-4">
                {REPORTS.filter((r) => r.status === "pending").length}
              </Badge>
            </Link>
          </Button>
          <Button variant="ghost" className="w-full justify-start" asChild>
            <Link href="/dashboard/settings">
              <Settings className="mr-2 h-4 w-4" />
              Ayarlar
            </Link>
          </Button>
          <Button variant="ghost" className="w-full justify-start" asChild>
            <Link href="/dashboard/security">
              <Shield className="mr-2 h-4 w-4" />
              Güvenlik
            </Link>
          </Button>
          <Button variant="ghost" className="w-full justify-start" asChild>
            <Link href="/dashboard/news">
              <Newspaper className="mr-2 h-4 w-4" />
              Haberler
            </Link>
          </Button>
        </div>
      )}

      {/* New Event Modal */}
      <NewEventModal
        open={isNewEventModalOpen}
        onOpenChange={setIsNewEventModalOpen}
        onSuccess={handleNewEventSuccess}
      />
    </div>
  );
}
